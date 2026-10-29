import { EventEmitter } from "@hediet/std/events";
import { Disposable } from "@hediet/std/disposable";
import { DrawioConfig, DrawioEvent, DrawioAction } from "./DrawioTypes";
import { BufferImpl } from "../utils/buffer";
import * as vscode from 'vscode';
import { TemplateManager } from '../Templates/TemplateManager'
import  { XMIImportManager }  from "../features/XMIImportFeature/XMIImportManager";
import  { XMIImportProcessor }  from "../features/XMIImportFeature/XMIImportProcessor_v11";
import  { DocumentGeneratorManager }  from "../features/DocumentGenerateFeature/DocumentGeneratorManager";
import  { DocumentGeneratorBase }  from  "../features/DocumentGenerateFeature/DocumentGenerator"
import  { EDocGenerateType,diagramType}  from  "../features/DocumentGenerateFeature/DocDefine"

const path = require('path');

/**
 * Represents a connection to an drawio iframe.
 */
export class DrawioClient<
	TCustomAction extends {} = never,
	TCustomEvent extends {} = never
> {
	public readonly dispose = Disposable.fn();

	private readonly onInitEmitter = new EventEmitter();
	public readonly onInit = this.onInitEmitter.asEvent();

	protected readonly onChangeEmitter =
		new EventEmitter<DrawioDocumentChange>();
	public readonly onChange = this.onChangeEmitter.asEvent();

	private readonly onSaveEmitter = new EventEmitter();
	public readonly onSave = this.onSaveEmitter.asEvent();

	private readonly onUnknownMessageEmitter = new EventEmitter<{
		message: TCustomEvent;
	}>();
	public readonly onUnknownMessage = this.onUnknownMessageEmitter.asEvent();

	// This is always up to date, except directly after calling load.
	private currentXml: string | undefined = undefined;

	private isMerging = false;

	// 当前所打开的绘制文件
	public currentUri: vscode.Uri | undefined;

	public _webview:any;

	constructor(
		private readonly messageStream: MessageStream,
		private readonly getConfig: () => Promise<DrawioConfig>,
		public readonly reloadWebview: () => void
	) {
		this.dispose.track(
			messageStream.registerMessageHandler((msg) =>
				this.handleEvent(JSON.parse(msg as string) as DrawioEvent)
			)
		);
	}

	private currentActionId = 0;
	private responseHandlers = new Map<
		string,
		{ resolve: (response: DrawioEvent) => void; reject: () => void }
	>();

	protected sendCustomAction(action: TCustomAction): void {
		this.sendAction(action);
	}

	protected sendCustomActionExpectResponse(
		action: TCustomAction
	): Promise<TCustomEvent> {
		return this.sendActionWaitForResponse(action);
	}

	public sendAction(action: DrawioAction | TCustomAction) {
		this.messageStream.sendMessage(JSON.stringify(action));
	}

	private sendActionWaitForResponse(
		action: DrawioAction
	): Promise<DrawioEvent>;
	private sendActionWaitForResponse(
		action: TCustomAction
	): Promise<TCustomEvent>;
	private sendActionWaitForResponse(
		action: DrawioAction | TCustomAction
	): Promise<DrawioEvent | TCustomEvent> {
		return new Promise((resolve, reject) => {
			const actionId = (this.currentActionId++).toString();

			this.responseHandlers.set(actionId, {
				resolve: (response) => {
					this.responseHandlers.delete(actionId);
					resolve(response);
				},
				reject,
			});

			this.messageStream.sendMessage(
				JSON.stringify(Object.assign(action, { actionId }))
			);
		});
	}

	protected async handleEvent(evt: { event: string }): Promise<void> {
		const drawioEvt = evt as DrawioEvent;

		if ("message" in drawioEvt) {
			const actionId = (drawioEvt.message as any).actionId as
				| string
				| undefined;
			if (actionId) {
				const responseHandler = this.responseHandlers.get(actionId);
				this.responseHandlers.delete(actionId);
				if (responseHandler) {
					responseHandler.resolve(drawioEvt);
				}
			}
		} else if (drawioEvt.event === "init") {
			this.onInitEmitter.emit();
		} else if (drawioEvt.event === "autosave") {
			const oldXml = this.currentXml;
			if (oldXml !== drawioEvt.xml) {
				this.currentXml = drawioEvt.xml;

				// Don't emit a change event if we're merging some changes in.
				if (!this.isMerging) {
					this.onChangeEmitter.emit({
						newXml: this.currentXml,
						oldXml,
					});
				}
			}
		} else if (drawioEvt.event === "save") {
			const oldXml = this.currentXml;
			this.currentXml = drawioEvt.xml;
			if (oldXml != this.currentXml) {
				// a little bit hacky.
				// If "save" does trigger a change,
				// treat save as autosave and don't actually save the file.
				this.onChangeEmitter.emit({ newXml: this.currentXml, oldXml });
			} else {
				// Otherwise, the change has already
				// been reported by autosave.
				this.onSaveEmitter.emit();
			}
		} else if (drawioEvt.event === "export") {
			// sometimes, message is not included :(
			// this is a hack to find the request to resolve
			const vals = [...this.responseHandlers.values()];
			this.responseHandlers.clear();
			if (vals.length !== 1) {
				for (const val of vals) {
					val.reject();
				}
			} else {
				vals[0].resolve(drawioEvt);
			}
		} else if (drawioEvt.event === "configure") {
			const config = await this.getConfig();
			this.sendAction({
				action: "configure",
				config,
			});
		}else if (drawioEvt.event === "useTemplate") {
			this.loadTemplate(drawioEvt.uri);
		} else if (drawioEvt.event === "deleteTemplate") {
			this.deleteTemplate(drawioEvt.uri);
		} 
		 else if (drawioEvt.event === "promptStyleUnmodifiable") {
			this.promptStyleUnmodifiable(drawioEvt.data);
		}
		else {
			this.onUnknownMessageEmitter.emit({ message: drawioEvt });
		}
	}

	public async mergeXmlLike(xmlLike: string): Promise<void> {
		const promise = this.sendActionWaitForResponse({
			action: "merge",
			xml: xmlLike,
		});
		this.isMerging = true;
		try {
			const evt = await promise;
			if (evt.event !== "merge") {
				throw new Error("Invalid response");
			}
			if (evt.error) {
				throw new Error(evt.error);
			}
		} finally {
			this.isMerging = false;
		}
	}

	/**
	 * This loads an xml or svg+xml Draw.io diagram.
	 */
	public async loadXmlLike(xmlLike: string): Promise<void> {
		this.currentXml = undefined;
		this.sendAction({
			action: "load",
			xml: xmlLike,
			autosave: 1,
		});
		// We request the xml to detect if an autosave is a real change.
		await this.getXml();
	}

	public async loadPngWithEmbeddedXml(png: Uint8Array): Promise<void> {
		let str = BufferImpl.from(png).toString("base64");
		this.loadXmlLike("data:image/png;base64," + str);
	}

	public async export(extension: string): Promise<BufferImpl> {
		if (extension.endsWith(".png")) {
			return await this.exportAsPngWithEmbeddedXml();
		} else if (
			extension.endsWith(".drawio") ||
			extension.endsWith(".5md")
		) {
			const xml = await this.getXml();
			return BufferImpl.from(xml, "utf-8");
		} else if (extension.endsWith(".svg")) {
			return await this.exportAsSvgWithEmbeddedXml();
		} else {
			throw new Error(
				`Invalid file extension "${extension}"! Only ".png", ".svg" and ".5md" are supported.`
			);
		}
	}

	private async getXmlUncached(): Promise<string> {
		const response = await this.sendActionWaitForResponse({
			action: "export",
			format: "xml",
		});
		if (response.event !== "export") {
			throw new Error("Unexpected response");
		}
		return response.xml;
	}

	public async getXml(): Promise<string> {
		if (!this.currentXml) {
			const xml = await this.getXmlUncached();
			if (!this.currentXml) {
				// It might have been changed in the meantime.
				// Always trust autosave.
				this.currentXml = xml;
			}
		}
		return this.currentXml;
	}

	public async exportAsPngWithEmbeddedXml(): Promise<BufferImpl> {
		const response = await this.sendActionWaitForResponse({
			action: "export",
			format: "xmlpng",
		});
		if (response.event !== "export") {
			throw new Error("Unexpected response");
		}
		const start = "data:image/png;base64,";
		if (!response.data.startsWith(start)) {
			throw new Error("Invalid data");
		}
		const base64Data = response.data.substr(start.length);
		return BufferImpl.from(base64Data, "base64");
	}

	public async exportAsSvgWithEmbeddedXml(): Promise<BufferImpl> {
		const response = await this.sendActionWaitForResponse({
			action: "export",
			format: "xmlsvg",
		});
		if (response.event !== "export") {
			throw new Error("Unexpected response");
		}
		const start = "data:image/svg+xml;base64,";
		if (!response.data.startsWith(start)) {
			throw new Error("Invalid data");
		}
		const base64Data = response.data.substr(start.length);
		return BufferImpl.from(base64Data, "base64");
	}

	public triggerOnSave(): void {
		this.onSaveEmitter.emit();
	}

	// public showOpenDialog(uri:vscode.Uri): void {
	// 	let dirPath = '';
	// 	const workspaceFolders = vscode.workspace.workspaceFolders;
	// 	if (workspaceFolders) {
	// 		dirPath = path.join(workspaceFolders[0].uri.fsPath);
	// 	}
	// 	let defaultUri = vscode.Uri.file(dirPath);
	// 	console.log('uri:', uri);

	// 	vscode.window.showOpenDialog({
	// 		canSelectFiles: true,
	// 		canSelectFolders: false,
	// 		canSelectMany: false,
	// 		defaultUri,
	// 		openLabel: 'Select Option Files',
	// 		filters: {
	// 			'All Files': ['*']
	// 		}
	// 	}).then(async templatefileUri => {
	// 		if (templatefileUri && templatefileUri[0]) {
	// 			const fileUriValue = templatefileUri[0];

	// 			let content = await vscode.workspace.fs.readFile(templatefileUri[0]);
	// 			// let data = BufferImpl.from(
	// 			// 	content
	// 			// ).toString("utf-8");
	// 			// 解析文件内容
	// 			//let fileName: string = fileUriValue.fsPath.substring(fileUriValue.fsPath.lastIndexOf(path.sep) + 1); // 获取文件名
	// 			// console.log('file name:', fileName);
	// 			// console.log('template data:', data);

	// 			// let ret = await vscode.workspace.fs.readFile(uri);
	// 			// console.log('current content:', BufferImpl.from(ret).toString("utf-8"))

	// 			await vscode.workspace.fs.writeFile(uri, content);

	// 			//  ret = await vscode.workspace.fs.readFile(uri);
	// 			// console.log('current after write content:', BufferImpl.from(ret).toString("utf-8"))
	// 			this.loadXmlLike(BufferImpl.from(content).toString("utf-8"));

	// 		}
	// 	});
	// }

	public async loadTemplate(templateUri: string): Promise<void> {
		let content = await vscode.workspace.fs.readFile(vscode.Uri.file(templateUri));
		if (this.currentUri) {
			await vscode.workspace.fs.writeFile(this.currentUri, content);
		}
		this.loadXmlLike(BufferImpl.from(content).toString("utf-8"));
	}

	public async deleteTemplate(filePath: string): Promise<void> {
		try {
			let parentUri = vscode.Uri.file(path.dirname(filePath));
			// const templateUri = vscode.Uri.file(filePath);
			// const parentUri = templateUri.with({ path: path.dirname(templateUri.path) });
			await vscode.workspace.fs.delete(parentUri, { recursive: true });
		} catch (e) {
			console.error(e);
		}
	}

	public showOpenDialog(uri: vscode.Uri): void {
		this.currentUri = uri;
		let templateManager = new TemplateManager();
		this.sendAction({
			action: "showTemplatePages",
			data: templateManager.getTemplates()
		});
		console.log('sendAction complete!')
	}

	// public async importFromXMI(uri: vscode.Uri, size?:string): Promise<void> {
	// 	this.currentUri = uri;
	// 	console.log('showOpenDialogXMI!');
	// 	const workspaceFolders = vscode.workspace.workspaceFolders;
	// 	let dirPath = '';
	// 	if (workspaceFolders) {
	// 		dirPath = workspaceFolders[0].uri.fsPath;
	// 	}
	// 	let defaultUri = vscode.Uri.file(dirPath);
	// 	vscode.window.showOpenDialog({
	// 		canSelectFiles: true,
	// 		canSelectFolders: false,
	// 		canSelectMany: false,
	// 		defaultUri,
	// 		openLabel: 'Select Option Files',
	// 		filters: {
	// 			//'All Files': ['*']
	// 			'XMI Files': ['xml','xmi'] 
	// 		}
	// 	}).then(fileUri => {
	// 		if (fileUri && fileUri[0]) {
	// 			const fileUriValue = fileUri[0];
	// 			vscode.workspace.fs.readFile(fileUriValue).then(async data => {
	// 				const fileContent: string = data.toString();
	// 				try {
	// 					console.log('得到了缩放值', size);
						
	// 					// 解析文件内容
	// 					let xp:XMIImportProcessor = XMIImportManager.getAdaptedProtocolPrcessor(fileContent, size);
	// 					let data:string = xp.run();

	// 					// let fileName: string = fileUriValue.fsPath.substring(fileUriValue.fsPath.lastIndexOf(path.sep) + 1); // 获取文件名
	// 					 console.log('xmi:', data);
	// 					if (this.currentUri) {
	// 						await vscode.workspace.fs.writeFile(this.currentUri, BufferImpl.from(data));
	// 					}
	// 					this.loadXmlLike(BufferImpl.from(data).toString("utf-8"));
	// 				} catch (error) {
	// 					console.error('Error parsing file content:', error);
	// 					vscode.window.showErrorMessage('Failed to parse the selected file. Please check the file format.');
	// 				}
	// 			});
	// 		}
	// 	});
	// }
	public async importFromXMI(uri: vscode.Uri, size: string, xml: string): Promise<void> {
		try {
			// 解析文件内容
			let xp: XMIImportProcessor = XMIImportManager.getAdaptedProtocolPrcessor(xml, size);
			let data: string = xp.run();

			// let fileName: string = fileUriValue.fsPath.substring(fileUriValue.fsPath.lastIndexOf(path.sep) + 1); // 获取文件名
			console.log('xmi:', data);
			if (this.currentUri) {
				await vscode.workspace.fs.writeFile(this.currentUri, BufferImpl.from(data));
			}
			this.loadXmlLike(BufferImpl.from(data).toString("utf-8"));
		}
		catch (error) {
			console.error('Error parsing file content:', error);
			vscode.window.showErrorMessage('没有选择有效文件或者选择文件格式不正确，请选择符合xmi标准格式文件');
		}
	}

	public async exportToWord(uri: vscode.Uri, type:string): Promise<void> {
		const targetUri = await vscode.window.showSaveDialog({
			saveLabel: "Create",
			filters: {
				'Word文档': ["docx"],
			},
		});
		if (!targetUri) {
			return;
		}
		console.log('targetUri:', targetUri);

		let xmlBuffer:Uint8Array = await vscode.workspace.fs.readFile(uri);
		// console.log('exportToWord buffer:', xmlBuffer.toString());
		let docBuffer:Buffer|undefined = undefined;
		try{
			let dg:DocumentGeneratorBase = DocumentGeneratorManager.getAdaptedPrcessor(type);
			dg.run(xmlBuffer.toString(), targetUri);
		}
		catch(e){
			console.log('catch:',e)
		}
		// try {
		// 	// if(docBuffer){
		// 	// 	await vscode.workspace.fs.writeFile(
		// 	// 		targetUri,
		// 	// 		new Uint8Array(docBuffer)
		// 	// 	);
		// 	// }
		// } catch (e) {
		// 	console.error("Cannot create or open file", e);
		// 	await vscode.window.showErrorMessage(
		// 		`Cannot create or open file "${targetUri.toString()}"!`
		// 	);
		// }
	}

	public promptStyleUnmodifiable(data: string): void {
		vscode.window.showWarningMessage(data);
	}
}

export interface DrawioDocumentChange {
	oldXml: string | undefined;
	newXml: string;
}

export interface MessageStream {
	registerMessageHandler(handler: (message: unknown) => void): Disposable;
	sendMessage(message: unknown): void;
}
