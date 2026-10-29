import { sendEvent } from "./vscode";

interface TemplateData {
    name: string;
    iconImageUrl: string;
    xmlUrl: string;
    xml: ''
}

interface TemplateLibData {
    id: string;
    isSystem: boolean;
    type: string;
    data: TemplateData[];
}

interface checkboxValue {
    title: string
    data: Array<checkboxItem>
}

interface checkboxItem {
    label: string,
    value: string
}

enum InputType {
    radio = 'radio',
    checkbox = 'checkbox'
}

class DialogLibrary {
    constructor() { }
    public static fileData_xmi:string ='';
    /**
     * 创建对话框
     */
    public createDialog(target: HTMLElement, className: string): HTMLElement {
        let dialog: HTMLDivElement;
        const DEFAULT_DIALOG_CLASS = 'defaultDialog';

        dialog = document.createElement('div');
        dialog.setAttribute('class', `${DEFAULT_DIALOG_CLASS} ${className}`);
        target.append(dialog);
        return dialog
    }

    /**
     * Head
     */
    public createDialogHead(dialog: HTMLElement, className: string): HTMLElement {
        let dialogHead: HTMLDivElement;
        const DEFAULT_DIALOGHEADER_CLASS = 'defaultHead'

        dialogHead = document.createElement('div');
        dialogHead.setAttribute('class', `${DEFAULT_DIALOGHEADER_CLASS} ${className}`)
        dialog.append(dialogHead);
        requestAnimationFrame(() => {
            dialogHead.style.lineHeight = dialogHead.getBoundingClientRect().height + 'px'
        })
        return dialogHead;
    }

    /**
     * Body
     */
    public createDialogBody(dialog: HTMLElement, className: string): HTMLElement {
        let dialogBody: HTMLDivElement;
        const DEFAULT_DIALOGHEADER_CLASS = 'defaultBody'

        dialogBody = document.createElement('div');
        dialogBody.setAttribute('class', `${DEFAULT_DIALOGHEADER_CLASS} ${className}`)
        dialog.append(dialogBody);
        return dialogBody;
    }

    /**
     * Footer
     */
    public createDialogFooter(dialog: HTMLElement, className: string): HTMLElement {
        let dialogFooter: HTMLDivElement;
        const DEFAULT_DIALOGFOOTER_CLASS = 'defaultFooter'

        dialogFooter = document.createElement('div');
        dialogFooter.setAttribute('class', `${DEFAULT_DIALOGFOOTER_CLASS} ${className}`)
        dialog.append(dialogFooter);
        return dialogFooter;
    }

    /**
     * 关闭按钮 x
     */
    public createCloseBtn(dialogHead: HTMLElement, className?: string, ...args: any) {
        const deleteBtn = document.createElement('div');
        deleteBtn.setAttribute('class', 'default-dialog-close')
        deleteBtn.setAttribute('title', '关闭');
        deleteBtn.innerText = '×';

        deleteBtn.onclick = () => {
            let dialog = document.querySelector('.defaultDialog')
            dialog!.remove();
        };

        dialogHead.append(deleteBtn);
    }

    /**
     * 标题形式的对话框 title
     */
    public createHeadContentBytitle(dialogHead: HTMLElement, value: string) {
        let title = document.createElement('span')
        title.setAttribute('class', 'default-dialog-head-title')
        title.innerHTML = value
        dialogHead.append(title)
    }

    /**
     * 确定按钮
     */
    public createConfirmBtn(dialogFooter: HTMLElement, callBack: Function, inActive?:boolean): HTMLElement {
        const button = document.createElement('button');
        button.setAttribute('class', 'default-dialog-confirm-btn')
        button.innerText = '确认';
        if(inActive){
            button.disabled = true;
            button.classList.add('inActive');
        }
        button.onclick = (e) => {
            callBack()
            let dialog = document.querySelector('.defaultDialog')
            dialog!.remove();
        }
        dialogFooter.append(button);
        return button;
    }

    /**
     * 取消按钮
     */
    public createCancelBtn(dialogFooter: HTMLElement, callBack?: Function): HTMLElement {
        const button = document.createElement('button');
        button.setAttribute('class', 'default-dialog-cancel-btn')
        button.innerText = '取消';
        button.onclick = (e) => {
            let dialog = document.querySelector('.defaultDialog')
            dialog!.remove();
        }
        dialogFooter.append(button);
        return button;
    }

    /**
     * 创建多选框组 / 单选项
     */
    public createCheckboxGroup(dialogBody: HTMLElement, data: checkboxValue, type: InputType): HTMLElement {
        let container = document.createElement('div')
        container.setAttribute('class', 'default-dialog-body-feature-container')

        let label = document.createElement('div')
        label.innerHTML = data.title

        let checkboxDiv = document.createElement('div')
        checkboxDiv.setAttribute('class', 'default-dialog-checkboxdiv')

        data.data.forEach((item, index) => {
            const checkboxContainer = document.createElement('div');
            checkboxContainer.setAttribute('class', 'defaul-dialog-checkbox');

            const checkbox = document.createElement('input');
            checkbox.type = type;
            checkbox.name = data.title;
            checkbox.id = item.value;
            checkbox.value = item.value;
            if (index === 0) {
                checkbox.checked = true;
            }

            const label = document.createElement('label');
            label.htmlFor = item.value;
            label.textContent = item.label;

            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(label);
            checkboxDiv.appendChild(checkboxContainer);
        });

        dialogBody.append(container)
        container.append(label)
        container.append(checkboxDiv)

        return container;
    }

    // /**
    //  * 创建文件选择框
    //  */
     public createFileSelector(dialogBody: HTMLElement, fileType: Array<string>) {
        let container = document.createElement('div');
        container.setAttribute('class', 'default-dialog-body-feature-container');
        let label = document.createElement('div');
        label.innerHTML = '选择文件';

        const inputContainer = document.createElement('div');
        inputContainer.setAttribute('class', 'default-dialog-fileInput');

        const input = document.createElement('input');
        input.type = 'file';
        input.id = 'fileInput';
        input.accept = fileType.join(',');
        input.value = '';
        input.placeholder = '请选择文件';

        inputContainer.appendChild(input);

        // 选择文件之后，将文件名显示在input框中
        input.addEventListener('change', (event) => {
            const fileInput = event.target as HTMLInputElement;
            if (fileInput.files && fileInput.files.length > 0) {
                const file = fileInput.files[0];

                // 读取文件内容
                const reader = new FileReader();
                reader.onload = function (e) {
                    if (e.target && typeof e.target.result === 'string') {
                        DialogLibrary.fileData_xmi = e.target.result;
                        if(DialogLibrary.fileData_xmi.length >0)
                        {
                           let btn = document.querySelector('.default-dialog-confirm-btn')as HTMLButtonElement;
                            btn.disabled = false;
                            btn.classList.remove('inActive');
                        }
                    }
                };
                reader.onerror = function () {
        
                };
                reader.readAsText(file, 'UTF-8');
                
            } else {
                input.value = '';
            }
        });

        container.append(label);
        container.append(inputContainer);
        dialogBody.append(container);
    }
}

/**
 * 从xml文档导入配置对话框
 */
export class ImportXMIDialog {
    constructor() {
        this.dialogLibrary = new DialogLibrary()
    }
    private dialogLibrary: DialogLibrary
    private dialog: HTMLElement | undefined;
    private dialogHead: HTMLElement | undefined;
    private dialogBody: HTMLElement | undefined;
    private dialogFooter: HTMLElement | undefined;
    private zoomSelector: HTMLElement | undefined
    // private fileSelector: HTMLElement | undefined;

    public open() {
        DialogLibrary.fileData_xmi = '';
        this.dialog = this.dialogLibrary.createDialog(document.body, 'xmi-dialog')
        this.dialogHead = this.dialogLibrary.createDialogHead(this.dialog, 'xmi-head')
        this.dialogBody = this.dialogLibrary.createDialogBody(this.dialog, 'xmi-body')
        this.dialogFooter = this.dialogLibrary.createDialogFooter(this.dialog, 'xmi-footer')
        this.dialogLibrary.createCloseBtn(this.dialogHead)
        this.dialogLibrary.createHeadContentBytitle(this.dialogHead, '生成文档设置')
        this.dialogLibrary.createCancelBtn(this.dialogFooter);
        this.dialogLibrary.createFileSelector(this.dialogBody, ['.xml', '.xmi'])
        this.dialogLibrary.createConfirmBtn(this.dialogFooter, this.confirmHandler.bind(this), true);
        this.zoomSelector = this.dialogLibrary.createCheckboxGroup(this.dialogBody, {
            title: '缩放大小',
            data: [
                { label: '10%', value: '10' },
                { label: '25%', value: '25' },
                { label: '50%', value: '50' },
                { label: '75%', value: '75' },
                { label: '100%', value: '100' },
            ]
        }, InputType.radio)
    }

    private confirmHandler() {
        const selectedRadio = this.zoomSelector!.querySelector('input[type="radio"]:checked') as HTMLInputElement;
        const size = selectedRadio.value;
        console.log('Selected size:', size);
        sendEvent({ event: "invokeCommand", command: { command: 'ImportFromXMI', size: size, xml: DialogLibrary.fileData_xmi} });
    }
}

/**
 * 生成文档
 */
export class ExportToWordDialog {
    constructor() {
        this.dialogLibrary = new DialogLibrary()
    }
    private dialogLibrary: DialogLibrary
    private dialog: HTMLElement | undefined;
    private dialogHead: HTMLElement | undefined;
    private dialogBody: HTMLElement | undefined;
    private dialogFooter: HTMLElement | undefined;
    private exportSelector: HTMLElement | undefined

    public open() {
        this.dialog = this.dialogLibrary.createDialog(document.body, 'xmi-dialog')
        this.dialogHead = this.dialogLibrary.createDialogHead(this.dialog, 'xmi-head')
        this.dialogBody = this.dialogLibrary.createDialogBody(this.dialog, 'xmi-body')
        this.dialogFooter = this.dialogLibrary.createDialogFooter(this.dialog, 'xmi-footer')
        this.dialogLibrary.createCloseBtn(this.dialogHead)
        this.dialogLibrary.createHeadContentBytitle(this.dialogHead, '生成文档设置')
        this.dialogLibrary.createCancelBtn(this.dialogFooter)
        this.dialogLibrary.createConfirmBtn(this.dialogFooter, this.confirmHandler.bind(this))
        this.exportSelector = this.dialogLibrary.createCheckboxGroup(this.dialogBody, {
            title: '导出类型',
            data: [
                { label: '类图', value: '类图' },
                { label: '接口', value: '接口' }
            ]
        }, InputType.radio)
    }

    private confirmHandler() {
        const selectedRadio = this.exportSelector!.querySelector('input[type="radio"]:checked') as HTMLInputElement;
        const type = selectedRadio.value;
        sendEvent({ event: "invokeCommand", command: { command: 'exportToWord', data: type} });
    }
}

/**
 * 新增 drawio 页面插件，用于展示用户选择模板对话框
 */
export class TemplateDialog {
    private dialog: HTMLElement | null = null;
    private dialogHeader: HTMLElement | null = null;
    private dialogBody: HTMLElement | null = null;

    constructor() {
        this.initEventListeners();
    }

    private static instance: TemplateDialog | null = null;

    /**
     * 单例模式获取 TemplateDialogManager 实例
     * @returns TemplateDialogManager 单例
     */
    public static getInstance() {
        if (!TemplateDialog.instance) {
            TemplateDialog.instance = new TemplateDialog();
        }
        return TemplateDialog.instance;
    }

    /**
     * 打开模板对话框
     * @param message 触发打开模板页面的消息
     * @returns 
     */
    public open(data: Array<TemplateLibData>) {
        let dialogLibrary = new DialogLibrary()
        this.dialog = dialogLibrary.createDialog(document.body, 'template-dialog')
        this.dialogHeader = dialogLibrary.createDialogHead(this.dialog, 'template-dialog-head')
        this.dialogBody = dialogLibrary.createDialogBody(this.dialog, 'template-dialog-body')
        dialogLibrary.createCloseBtn(this.dialogHeader)

        this.createTemplatePageHeader(data);
        this.createTemplatePageBody(data);
        this.adjustGridColumns();
    }

    /**
     * 创建模板对话框标题选择栏
     * @param data 模板数据
     */
    private createTemplatePageHeader(data: TemplateLibData[]) {
        // 根据模板类型创建标题
        data.forEach(item => {
            const typeTitle = document.createElement('span');
            typeTitle.style.cssText = `
                display: inline-block;
                padding: 0 10px;
                text-align: center;
                cursor: pointer;
                transition: background-color 0.3s, color 0.3s;
            `;
            typeTitle.innerText = item.type;
            typeTitle.onclick = () => this.switchTemplate(item.id, typeTitle, data);
            typeTitle.onmouseenter = () => typeTitle.style.color = 'white';
            typeTitle.onmouseleave = () => typeTitle.style.color = 'black';

            if (item.id === data[0].id) {
                typeTitle.style.fontWeight = 'bold';
            }
            this.dialogHeader!.append(typeTitle);
        });
    }

    /**
     * 创建模板对话框主体 --- 模板展示区域
     * @param data 模板数据
     */
    private createTemplatePageBody(data: TemplateLibData[]) {
        // 根据模板类型创建多个模板选择页面 --- 每个页面包含多个模板
        data.forEach(templatePage => {
            const templatePageItem = document.createElement('div');
            templatePageItem.setAttribute('id', `page-${templatePage.id}`);
            templatePageItem.style.cssText = `
                width: cacl(100% - 20px);
                position: absolute;
                top: 0;
                left: 0;
                display: none;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 10px;
                padding: 10px;
            `;
            this.dialogBody!.append(templatePageItem);

            // 创建每个模板
            templatePage.data.forEach((template: TemplateData) => {
                const templateItem = this.createTemplateItem(template, templatePage.isSystem);
                templatePageItem.append(templateItem);
            });

            if (templatePage.id === data[0].id) {
                templatePageItem.style.display = 'grid';
            }
        });
    }

    /**
     * 创建单个模板区域
     * @param template 模板数据
     * @returns 
     */
    private createTemplateItem(template: TemplateData, templateIsSystem: Boolean): HTMLElement {
        // 模板总体容器
        const templateItemTotal = document.createElement('div');
        const templateBtns: HTMLElement[] = [];

        templateItemTotal.style.cssText = `
            width: 200px;
            height: 230px;
            border-radius: 4px;
            box-shadow: 0 0 5px rgba(0,0,0,0.3);
            box-sizing: border-box;
        `;

        // 模板内容
        const templateItem = document.createElement('div');
        templateItem.style.cssText = `
            width: 200px;
            height: 200px;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
        `;

        // 模板图片
        const templateIcon = document.createElement('img');
        templateIcon.src = template.iconImageUrl;
        // templateIcon.style.cssText = `
        //     width: 95%;
        //     height: 95%;
        // `;
        templateIcon.draggable = false;
        templateItem.append(templateIcon);

        // 使用按钮
        const confirmBtn = this.createConfirmBtn(templateItem, template);
        templateBtns.push(confirmBtn);

        // 删除按钮
        if (!templateIsSystem) {
            const deleteBtn = this.createDeleteBtn(templateItem, template, templateItemTotal);
            templateBtns.push(deleteBtn);
        }

        templateItemTotal.append(templateItem);

        // 模板标题
        const templateTitle = document.createElement('div');
        templateTitle.style.cssText = `
            width: 100%;
            height: 30px;
            line-height: 30px;
            color: black;
            font-size: 14px;
            padding: 0 10px;
        `;
        templateTitle.innerText = template.name;
        templateItemTotal.append(templateTitle);

        templateItemTotal.onmouseenter = () => {
            this.btnAnimation(true, templateBtns);
            templateItemTotal.style.transition = 'transform 0.3s';
            templateItemTotal.style.transform = 'translateY(-5px)';
        };

        templateItemTotal.onmouseleave = () => {
            this.btnAnimation(false, templateBtns);
            templateItemTotal.style.transition = 'transform 0.3s';
            templateItemTotal.style.transform = 'translateY(0)';
        };

        return templateItemTotal;
    }

    /**
     * 创建删除按钮
     * @param templateItem 模板内容 
     * @returns deleteBtn
     */
    private createDeleteBtn(templateItem: HTMLElement, templateData: TemplateData, templateItemTotal: HTMLElement) {
        const deleteBtn = document.createElement('div');
        deleteBtn.style.cssText = `
            width: 10px;
            height: 10px;
            position: absolute;
            top: 5px;
            right: 5px;
            border-radius: 50%;
            color: black;
            cursor: pointer;
            border: 1px solid #ccc;
            transition: opacity 0.3s;
            opacity: 0;
            line-height: 10px;
            text-align: center;
        `;
        deleteBtn.innerText = '×';

        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            sendEvent({
                event: 'deleteTemplate',
                uri: templateData.xmlUrl
            });
            templateItemTotal.remove();
        };

        templateItem.append(deleteBtn);

        return deleteBtn;
    }

    /**
     * 创建确认按钮
     * @param templateItem 模板内容
     * @returns confirmBtn
     */
    private createConfirmBtn(templateItem: HTMLElement, templateData: TemplateData) {
        const confirmBtn = document.createElement('button');
        confirmBtn.style.cssText = `
            width: 50%;
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            padding: 5px 10px;
            border: none;
            border-radius: 4px;
            background-color: black;
            color: white;
            cursor: pointer;
            transition: opacity 0.3s;
            opacity: 0;
        `;
        confirmBtn.innerText = '使用';
        confirmBtn.onclick = (e) => {
            sendEvent({
                event: 'useTemplate',
                uri: templateData.xmlUrl
            });
            // this.dialog!.style.display = 'none';
            this.dialog?.remove();
            this.dialog = null;
        }
        templateItem.append(confirmBtn);

        return confirmBtn;
    }

    /**
     * 创建按钮动画
     */
    private btnAnimation(show: Boolean, btns: HTMLElement[]) {
        btns.forEach(btn => {
            btn.style.opacity = show ? '1' : '0';
        });

    }

    /**
     * 切换模板类型页
     * @param selectedId 选择的模板类型ID
     * @param data 对应的模板数据
     */
    private switchTemplate(selectedId: string, self: HTMLElement, data: TemplateLibData[]) {
        data.forEach(template => {
            const page = document.querySelector(`#page-${template.id}`) as HTMLElement;
            page.style.display = template.id === selectedId ? 'grid' : 'none';
        });

        const allTitles = this.dialogHeader!.querySelectorAll('span');
        allTitles.forEach(title => title.style.fontWeight = '');
        self.style.fontWeight = 'bold';
    }

    /**
     * 调整模板页面模板列数
     */
    public adjustGridColumns() {
        const templatePageBodyWidth = this.dialogBody!.clientWidth;
        const columnCount = Math.ceil((templatePageBodyWidth - 40) / 210); // 200px + 10px gap
        const templatePageItems = this.dialogBody!.querySelectorAll('div[id^="page-"]');
        templatePageItems.forEach(item => {
            (item as HTMLElement).style.gridTemplateColumns = `repeat(${columnCount}, 1fr)`;
        });
    }

    /**
     * 初始化事件监听 - 监听窗口大小变化，调整模板页面模板列数
     */
    private initEventListeners() {
        window.addEventListener('resize', () => this.adjustGridColumns());
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.dialog?.remove();
                this.dialog = null;
            }
        });
    }
}

// 显式挂载到window对象
// 自动实例化并挂载常用方法
// (window as any).handleCustomEvent = (message: any) => {
//     if(message.action == 'showTemplatePages'){
//         TemplateDialog.getInstance().open(message.data);
//     }
//     else{}
// };
export class DocGeneratorOptionDialog {
    private dialog: HTMLElement | null = null;

    constructor() {
    }

}