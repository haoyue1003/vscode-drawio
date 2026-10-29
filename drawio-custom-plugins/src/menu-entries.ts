import { showDialog } from "./propertiesDialog";
import { sendEvent } from "./vscode";
import { TemplateDialog } from "./customDialogManager";
import { ImportXMIDialog } from "./customDialogManager"
import { ExportToWordDialog } from "./customDialogManager"

Draw.loadPlugin((ui) => {
	sendEvent({ event: "pluginLoaded", pluginId: "menu-entries" });

	const importActionName = "vscode.import";
	mxResources.parse(`${importActionName}=导入...`);
	ui.actions.addAction(importActionName, () => ui.importLocalFile(true));

	const exportActionName = "vscode.export";
	mxResources.parse(`${exportActionName}=导出...`);
	ui.actions.addAction(exportActionName, () => {
		sendEvent({ event: "invokeCommand", command: "export" });
	});

	const convertActionName = "vscode.convert";
	mxResources.parse(`${convertActionName}=Convert...`);
	ui.actions.addAction(convertActionName, () => {
		sendEvent({ event: "invokeCommand", command: "convert" });
	});

	const saveActionName = "vscode.save";
	mxResources.parse(`${saveActionName}=保存`);
	ui.actions.addAction(saveActionName, () => {
		sendEvent({ event: "invokeCommand", command: "save" });
	});

	const openWithTemplate = "OpenWithTemplate";
	mxResources.parse(`${openWithTemplate}=从模版导入...`);
	ui.actions.addAction(openWithTemplate, () => {
		sendEvent({ event: "invokeCommand", command: "OpenWithTemplate" });
	});

	const propertiesActionName = "properties";
	ui.actions.addAction(propertiesActionName, () => {
		showDialog(ui);
	});

	const exportToSelfTemplate = "ExportAsTemplate";
	mxResources.parse(`${exportToSelfTemplate}=导出模版...`);
	ui.actions.addAction(exportToSelfTemplate, () => {
		sendEvent({ event: "invokeCommand", command: "ExportAsTemplate" });
	});

	const importFromXMI = "ImportFromXMI";
	mxResources.parse(`${importFromXMI}=从XMI文件导入...`);
	ui.actions.addAction(importFromXMI, () => {
		new ImportXMIDialog().open()
		// sendEvent({ event: "invokeCommand", command: "ImportFromXMI" });
	});

	const exportToWord = "exportToWord";
	mxResources.parse(`${exportToWord}=生成文档...`);
	ui.actions.addAction(exportToWord, () => {
		new ExportToWordDialog().open()
		// sendEvent({ event: "invokeCommand", command: "exportToWord" });
	});

	const menu = ui.menus.get("file");
	const oldFunct = menu.funct;
	menu.funct = function (menu: any, parent: any) {
		oldFunct.apply(this, arguments);
		ui.menus.addMenuItems(
			menu,
			[
				// "-",
				// propertiesActionName,
				"-",
				importActionName,
				exportActionName,
				// convertActionName,
				saveActionName,
				"-",
				openWithTemplate,
				exportToSelfTemplate,
				//'insertTemplate_hesds'
				"-",
				importFromXMI,
				"-",
				exportToWord

			],
			parent
		);
	};

	window.addEventListener("message", (evt) => {
		if (evt.source !== window.opener) {
			return;
		}
		const data = JSON.parse(evt.data);

		switch (data.action) {
			case "showTemplatePages": {
				TemplateDialog.getInstance().open(data.data);
				break;
			}
			default: {
				return;
			}
		}
		evt.preventDefault();
		evt.stopPropagation();
	});
});
