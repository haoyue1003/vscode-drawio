import { EElementNodeType, ElementNode, DiagramSheet } from "./XmiDefine";

/**
 * XMI导入器 - 处理XMI文件导入并转换为drawio格式
 */
export class XmiBuilder {
    /**
     * 将解析后的数据转换为Drawio XML格式
     * @param data 解析后的数据
     * @returns Drawio XML内容
     */
    public convertToDrawioXml(data: Array<DiagramSheet>): string {
        // 示例数据
        // const elements: DiagramSheet[] = [
        //     {
        //         id: '1',
        //         elementNodes:
        //             [
        //                 { type: EElementNodeType.UseCase, id: '6', name: '用例1', idParentid: '12', coordinate: { left: '20', top: '60', width: '140', height: '70' } },
        //                 { type: EElementNodeType.UseCase, id: '8', name: '用例2', idParentid: '1', coordinate: { left: '340', top: '210', width: '150', height: '80' } },
        //                 { type: EElementNodeType.Actor, id: '9', name: '用户', idParentid: '1', coordinate: { left: '70', top: '525', width: '30', height: '60' } },
        //                 { type: EElementNodeType.Package, id: '12', name: 'Package', idParentid: '1', coordinate: { left: '-100', top: '110', width: '290', height: '260' } },
        //                 // { type: EElementNodeType.Include, id: '11', name: '', idParentid: '1', sourceid: '9', targetid: '8' },
        //                 // { type: EElementNodeType.Extend, id: '10', name: '', idParentid: '1', sourceid: '9', targetid: '6' },
        //             ],
        //     }, {
        //         id: '2',
        //         elementNodes:
        //             [
        //                 { type: EElementNodeType.UseCase, id: '6', name: '用例1', idParentid: '12', coordinate: { left: '20', top: '60', width: '140', height: '70' } },
        //                 { type: EElementNodeType.UseCase, id: '8', name: '用例2', idParentid: '1', coordinate: { left: '340', top: '210', width: '150', height: '80' } },
        //                 { type: EElementNodeType.Actor, id: '9', name: '用户', idParentid: '1', coordinate: { left: '70', top: '525', width: '30', height: '60' } },
        //                 { type: EElementNodeType.Package, id: '12', name: 'Package', idParentid: '1', coordinate: { left: '-100', top: '110', width: '290', height: '260' } },
        //                 // { type: EElementNodeType.Include, id: '11', name: '', idParentid: '1', sourceid: '9', targetid: '8' },
        //                 // { type: EElementNodeType.Extend, id: '10', name: '', idParentid: '1', sourceid: '9', targetid: '6' },
        //             ]
        //     }
        // ];

        const builder = new BuilderProcessor();
        return builder.createElements(data).xmlValue();
    }
}
/**
 * 符合 HesdsXML 规范的 xml 文件
 */
class HesdsXML {
    constructor() {
        this.diagram = '';
        this.host = this.generateRandomHost();
    }
    private host: string;
    public diagram: string;

    /**
     * 生成随机的host标识符
     * @returns 随机生成的host字符串
     */
    private generateRandomHost(): string {
        return Array.from(
            { length: 10 },
            () => Math.floor(Math.random() * 16).toString(16)
        ).join('');
    }

    /**
     * 返回完整的XML文档字符串
     */
    public xmlValue(): string {
        return `
        <mxfile host="${this.host}">
            ${this.diagram}
        </mxfile>
        `;
    }
}

// 用于传递字符串引用的接口
interface MxCellContainer {
    useCase: string;
    line: string;
}

/**
 * 声明构建符合 BuilderProcessor 规范的 xml 文件的接口
 */
class BuilderProcessor {

    private _XML: HesdsXML;

    constructor() {
        this._XML = new HesdsXML();
        // this.page = 1;
    }
    // private page: number;

    // 元素处理映射表
    private elementHandlers: Record<EElementNodeType, (data: ElementNode, container: MxCellContainer) => void> = {
        [EElementNodeType.UseCase]: (data: ElementNode, container: MxCellContainer) => this.createUseCase(data, container),
        [EElementNodeType.Actor]: (data: ElementNode, container: MxCellContainer) => this.createActor(data, container),
        [EElementNodeType.Package]: (data: ElementNode, container: MxCellContainer) => this.createPackage(data, container),
        [EElementNodeType.Include]: (data: ElementNode, container: MxCellContainer) => this.createIncludeLine(data, container),
        [EElementNodeType.Extend]: (data: ElementNode, container: MxCellContainer) => this.createExtendLine(data, container),
        [EElementNodeType.Association]: (data: ElementNode, container: MxCellContainer) => this.createAssociationLine(data, container),
        [EElementNodeType.Generalization]: (data: ElementNode, container: MxCellContainer) => this.createGeneralizationLine(data, container),
        [EElementNodeType.Dependency]: (data: ElementNode, container: MxCellContainer) => this.createDependencyLine(data, container),
        [EElementNodeType.Unknown]: (data: ElementNode, container: MxCellContainer) => undefined,
        [EElementNodeType.SequenceDiagramMessage]: (data: ElementNode, container: MxCellContainer) => this.createMessage(data, container),
        [EElementNodeType.SequenceDiagramClassifierRole]: (data: ElementNode, container: MxCellContainer) => this.createSeqObjectView(data, container),
    };

    /**
     * 批量处理元素创建
     */
    public createElements(elements: DiagramSheet[]): HesdsXML {
        elements.forEach((sheetItem: DiagramSheet) => {
            this.createSheet(sheetItem);
        });
        return this._XML;
    }

    /**
     * 创建 每一个sheet中的元素
     */
    public createSheet(sheetItem: DiagramSheet) {
        const container: MxCellContainer = {
            useCase: '',
            line: ''
        };

        // 处理 节点 元素
        sheetItem.elementNodes.forEach(node => {
            const handler = this.elementHandlers[node.type];
            if (handler) {
                handler(node, container);
            } else {
                console.warn(`未知元素类型: ${node.type}`);
            }
        })

        this._XML.diagram += `
            <diagram id="${sheetItem.id}" name="第 ${sheetItem.id} 页">
                <mxGraphModel dx="2390" dy="1166" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0">
                    <root>
                        <mxCell id="0"/>
                        <mxCell id="1" parent="0"/>
                        ${container.useCase}
                        ${container.line}
                    </root>
                </mxGraphModel>
            </diagram>
        `;
    }
    // /**
    //  * 创建 SeqObjectView 元素
    //  */
    private createSeqObjectView(data: ElementNode, container: MxCellContainer) {

        //x y 是 xmi的x y  width是xmi的width  height是写c死的drawio的60 
        container.useCase += 
            `<mxCell id="${data.id}" value="${data.name}" style="shape=rect;html=1;whiteSpace=wrap;align=center;strokeColor=#ff0000;strokeWidth=2;fontFamily=Courier New;fontSize=16;fontColor=#ff0000;" parent="1" vertex="1">
                <mxGeometry x="${data!.coordinate!.left}" y="${data!.coordinate!.top}" width="${data!.coordinate!.width}" height="60" as="geometry"/>
            </mxCell>
            <mxCell id="${data.id+1}" value="" style="edgeStyle=none;html=1;dashed=1;endArrow=none;align=center;verticalAlign=bottom;exitX=0.5;exitY=1;strokeColor=#0000ff;strokeWidth=2;fontFamily=Courier New;fontSize=16;fontColor=#0000ff;elbow=vertical;exitDx=0;exitDy=0;" parent="1" source="${data.id}" edge="1">
                <mxGeometry x="1" relative="1" as="geometry">
                    <mxPoint x="${Number(data!.coordinate!.left) + ( Number(data!.coordinate!.width)/2)}" 
                    y="${Number(data!.coordinate!.top) +Number(data!.coordinate!.height) }" as="targetPoint"/>
                </mxGeometry>
            </mxCell> `; 
        //mxPoint是下面的线  x=left + width/2   y = top + height

    }
    /**
     * 创建 Message 元素
     */
    private createMessage(data: ElementNode, container: MxCellContainer) {
        if(data.sourceid != data.targetid){
            let sourceX = data.sourceX??0;
            let targetX = data.targetX??0;
            if(sourceX < targetX){
                //互相调用
                container.useCase += `
                    <mxCell id="${data.id}" value="${data.name}" style="html=1;verticalAlign=bottom;endArrow=block;curved=0;rounded=0;strokeColor=#0000ff;strokeWidth=2;fontFamily=Courier New;fontSize=16;fontColor=#0000ff;elbow=vertical;entryX=-0.1;entryY=0.5;entryDx=0;entryDy=0;entryPerimeter=0;" edge="1" parent="1" target="${data.id+10}">
                            <mxGeometry width="80" relative="1" as="geometry">
                                <mxPoint x="${data!.coordinate!.left}" y="${data!.coordinate!.top}" as="sourcePoint"/>
                            </mxGeometry>
                    </mxCell>
                    <mxCell id="${data.id+10}" value="" style="html=1;points=[];perimeter=orthogonalPerimeter;strokeColor=#ff0000;strokeWidth=2;fontFamily=Courier New;fontSize=16;fontColor=#ff0000;" parent="1" vertex="1">
                        <mxGeometry x="${Number(data!.coordinate!.left) + Number(data!.coordinate!.width) +5}" y="${Number(data!.coordinate!.top) -40 }" width="10" height="80" as="geometry"/>
                    </mxCell>`; 
            }else{
                //互相调用
                container.useCase += `
                    <mxCell id="${data.id}" value="${data.name}" style="html=1;verticalAlign=bottom;endArrow=block;curved=0;rounded=0;strokeColor=#0000ff;strokeWidth=2;fontFamily=Courier New;fontSize=16;fontColor=#0000ff;elbow=vertical;entryX=1.1;entryY=0.5;entryDx=0;entryDy=0;entryPerimeter=0;" edge="1" parent="1" target="${data.id+10}">
                            <mxGeometry width="80" relative="1" as="geometry">
                                <mxPoint x="${Number(data!.coordinate!.left) + Number(data!.coordinate!.width) }" y="${data!.coordinate!.top}" as="sourcePoint"/>
                            </mxGeometry>
                    </mxCell>
                    <mxCell id="${data.id+10}" value="" style="html=1;points=[];perimeter=orthogonalPerimeter;strokeColor=#ff0000;strokeWidth=2;fontFamily=Courier New;fontSize=16;fontColor=#ff0000;" parent="1" vertex="1">
                        <mxGeometry x="${Number(data!.coordinate!.left) -15}" y="${Number(data!.coordinate!.top) -40 }" width="10" height="80" as="geometry"/>
                    </mxCell>`; 

            }
        }else{
            //自己调自己
            container.useCase += `
                <mxCell id="${data.id}" value="${data.name}" style="html=1;align=left;spacingLeft=2;endArrow=block;rounded=0;edgeStyle=orthogonalEdgeStyle;curved=0;rounded=0;strokeColor=#0000ff;strokeWidth=2;fontFamily=Courier New;fontSize=16;fontColor=#0000ff;elbow=vertical;" parent="1" target="${data.id+10}" edge="1">
                    <mxGeometry relative="1" as="geometry">
                        <mxPoint x="${Number(data!.coordinate!.left) }" y="${data!.coordinate!.top}" as="sourcePoint"/>
                        <Array as="points">
                            <mxPoint x="${Number(data!.coordinate!.left) +30}" y="${Number(data!.coordinate!.top) +30}"/>
                        </Array>
                    </mxGeometry>
                </mxCell>
                <mxCell id="${data.id+10}" value="" style="html=1;points=[];perimeter=orthogonalPerimeter;outlineConnect=0;targetShapes=umlLifeline;portConstraint=eastwest;newEdgeStyle={&quot;curved&quot;:0,&quot;rounded&quot;:0};strokeColor=#ff0000;strokeWidth=2;fontFamily=Courier New;fontSize=16;fontColor=#ff0000;" parent="1" vertex="1">
                    <mxGeometry x="${Number(data!.coordinate!.left) -5}" y="${Number(data!.coordinate!.top)+20 }" width="10" height="40" as="geometry"/>
                </mxCell>
                 `;
        }
    
    }

    /**
     * 创建 useCase 元素
     */
    private createUseCase(data: ElementNode, container: MxCellContainer) {
        container.useCase += `
                <mxCell id="${data.id}" value="${data.name}" style="ellipse;whiteSpace=wrap;html=1;strokeColor=#ff0000;strokeWidth=2;fontFamily=Courier New;fontSize=16;fontColor=#ff0000;" parent="${data.idParentid}" vertex="1">
                    <mxGeometry x="${data!.coordinate!.left}" y="${data!.coordinate!.top}" width="${data!.coordinate!.width}" height="${data!.coordinate!.height}" as="geometry"/>
                </mxCell>
                `;
    }

    /**
     * 创建 Actor 元素
     */
    private createActor(data: ElementNode, container: MxCellContainer) {
        container.useCase += `
                <mxCell id="${data.id}" value="${data.name}" style="shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;strokeColor=#ff0000;strokeWidth=2;fontFamily=Courier New;fontSize=16;fontColor=#ff0000;" parent="${data.idParentid}" vertex="1">
                    <mxGeometry x="${data!.coordinate!.left}" y="${data!.coordinate!.top}" width="${data!.coordinate!.width}" height="${data!.coordinate!.height}" as="geometry"/>
                </mxCell>
                `;
    }

    /**
    * 创建 package 元素
    */
    private createPackage(data: ElementNode, container: MxCellContainer) {
        container.useCase += `
                <mxCell id="${data.id}" value="${data.name}" style="shape=folder;fontStyle=1;tabWidth=110;tabHeight=30;tabPosition=left;html=1;boundedLbl=1;labelInHeader=1;container=1;collapsible=0;whiteSpace=wrap;strokeColor=#ff0000;strokeWidth=2;fontFamily=Courier New;fontSize=16;fontColor=#ff0000;" parent="${data.idParentid}" vertex="1">
                    <mxGeometry x="${data!.coordinate!.left}" y="${data!.coordinate!.top}" width="${data!.coordinate!.width}" height="${data!.coordinate!.height}" as="geometry"/>
                </mxCell>
                `;
    }

    /**
     * 创建包含关系连接线
     */
    private createIncludeLine(data: ElementNode, container: MxCellContainer) {
        container.line += `
                <mxCell id="${data.id}" value="&amp;lt;&amp;lt;include&amp;gt;&amp;gt;" style="endArrow=open;startArrow=none;endFill=0;startFill=0;endSize=8;html=1;verticalAlign=bottom;dashed=1;labelBackgroundColor=none;strokeWidth=2;strokeColor=#0000ff;fontFamily=Courier New;fontSize=12;fontColor=#0000ff;" parent="${data.idParentid}" source="${data.sourceid}" target="${data.targetid}" edge="1">
                    <mxGeometry width="0" relative="1" as="geometry"/>
                </mxCell>
                `;
    }

    /**
     * 创建扩展关系连接线
     */
    private createExtendLine(data: ElementNode, container: MxCellContainer) {
        container.line += `
                <mxCell id="${data.id}" value="&amp;lt;&amp;lt;extend&amp;gt;&amp;gt;" style="endArrow=open;startArrow=none;endFill=0;startFill=0;endSize=8;html=1;verticalAlign=bottom;dashed=1;labelBackgroundColor=none;strokeWidth=2;strokeColor=#0000ff;fontFamily=Courier New;fontSize=12;fontColor=#0000ff;" parent="${data.idParentid}" source="${data.sourceid}" target="${data.targetid}" edge="1">
                    <mxGeometry width="0" relative="1" as="geometry"/>
                </mxCell>
                `;
    }

    /**
        * 创建 Association 连接线
        */
    private createAssociationLine(data: ElementNode, container: MxCellContainer) {
        container.line += `
                <mxCell id="${data.id}" value="" style="endArrow=none;startArrow=none;endFill=0;startFill=0;endSize=8;html=1;verticalAlign=bottom;labelBackgroundColor=none;strokeWidth=3;strokeColor=#0000ff;fontFamily=Courier New;fontSize=16;fontColor=#0000ff;elbow=vertical;" parent="${data.idParentid}" source="${data.sourceid}" target="${data.targetid}" edge="1">
                    <mxGeometry width="0" relative="1" as="geometry"/>
                </mxCell>
                `;
    }

    /**
     * 创建 Generalization 连接线
     */
    private createGeneralizationLine(data: ElementNode, container: MxCellContainer) {
        container.line += `
                <mxCell id="${data.id}" value="" style="edgeStyle=none;html=1;endArrow=block;endFill=0;endSize=12;verticalAlign=bottom;strokeColor=#0000ff;strokeWidth=2;fontFamily=Courier New;fontSize=16;fontColor=#0000ff;elbow=vertical;" parent="${data.idParentid}" source="${data.sourceid}" target="${data.targetid}" edge="1">
                    <mxGeometry width="0" relative="1" as="geometry"/>
                </mxCell>
                `;
    }

    /**
     * 创建 Dependency 连接线
     */
    private createDependencyLine(data: ElementNode, container: MxCellContainer) {
        container.line += `
                <mxCell id="${data.id}" value="" style="endArrow=open;html=1;rounded=0;align=center;verticalAlign=bottom;dashed=1;endFill=0;labelBackgroundColor=none;strokeColor=#0000ff;strokeWidth=2;fontFamily=Courier New;fontSize=16;fontColor=#0000ff;elbow=vertical;" parent="${data.idParentid}" source="${data.sourceid}" target="${data.targetid}" edge="1">
                    <mxGeometry width="0" relative="1" as="geometry"/>
                </mxCell>
                `;
    }

}