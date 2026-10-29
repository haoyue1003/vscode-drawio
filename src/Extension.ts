import * as vscode from "vscode";
import { Disposable } from "@hediet/std/disposable";
import { DrawioEditorProviderBinary } from "./DrawioEditorProviderBinary";
import { DrawioEditorProviderText } from "./DrawioEditorProviderText";
import { Config } from "./Config";
import { DrawioEditorService } from "./DrawioEditorService";
import { LinkCodeWithSelectedNodeService } from "./features/CodeLinkFeature";
import { EditDiagramAsTextFeature } from "./features/EditDiagramAsTextFeature";
import { LiveshareFeature } from "./features/LiveshareFeature";
import { ActivityTracking } from "./features/ActivtyTracking";
import { DrawioClientFactory } from "./DrawioClient";
import { registerFailableCommand } from "./utils/registerFailableCommand";

export class Extension {
	public readonly dispose = Disposable.fn();
	private readonly log = this.dispose.track(
		vscode.window.createOutputChannel("Drawio Integration Log")
	);

	private readonly config = new Config(this.context.globalState);
	private readonly drawioClientFactory = new DrawioClientFactory(
		this.config,
		this.log,
		this.context.extensionUri
	);
	private readonly editorService = new DrawioEditorService(
		this.config,
		this.drawioClientFactory
	);
	private readonly linkCodeWithSelectedNodeService = this.dispose.track(
		new LinkCodeWithSelectedNodeService(this.editorService, this.config)
	);
	private readonly editDiagramsAsTextFeature = this.dispose.track(
		new EditDiagramAsTextFeature(this.editorService, this.config)
	);
	private readonly liveshareFeature = this.dispose.track(
		new LiveshareFeature(this.editorService, this.config)
	);
	private readonly insiderFeedbackFeature = this.dispose.track(
		new ActivityTracking(this.editorService, this.config)
	);

	constructor(private readonly context: vscode.ExtensionContext) {
		this.dispose.track(
			vscode.window.registerCustomEditorProvider(
				"hesds.4+1view-text",
				new DrawioEditorProviderText(this.editorService),
				{ webviewOptions: { retainContextWhenHidden: true } }
			)
		);

		this.dispose.track(
			vscode.window.registerCustomEditorProvider(
				"hediet.vscode-drawio",
				new DrawioEditorProviderBinary(this.editorService),
				{
					supportsMultipleEditorsPerDocument: false,
					webviewOptions: { retainContextWhenHidden: true },
				}
			)
		);

		this.dispose.track(
			registerFailableCommand(
				"hesds.4+1view.newDiagram",
				async () => {
					const targetUri = await vscode.window.showSaveDialog({
						saveLabel: "Create",
						filters: {
							Diagrams: ["5md"],
						},
					});
					if (!targetUri) {
						return;
					}
					try {
						await vscode.workspace.fs.writeFile(
							targetUri,
							new Uint8Array()
						);
						await vscode.commands.executeCommand(
							"vscode.openWith",
							targetUri,
							"hesds.4+1view-text"
						);
					} catch (e) {
						console.error("Cannot create or open file", e);
						await vscode.window.showErrorMessage(
							`Cannot create or open file "${targetUri.toString()}"!`
						);
					}
				}
			)
		);
	}
}
