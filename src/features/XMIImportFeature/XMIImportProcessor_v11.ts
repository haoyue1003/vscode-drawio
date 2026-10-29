
import  { EDiagramType,DiagramSheet}  from "./XmiDefine";
import { DOMParser } from 'xmldom';
import {XmiBuilder} from  "./XMIBuilder";
import {XMITask} from  "./XMITask";
import {UseCaseTask_v11} from  "./UseCaseTask_v11";
import {XMIImportProcessor} from  "./XMIImportProcessor";
import {SequenceDiagramTask_v11} from  "./SequenceDiagramTask_v11";


export class XMIImportProcessor_v11 extends XMIImportProcessor{
    public constructor(data: string) {
      super(data);
    }

  //   <UML:Diagram xmi.id="UMLUseCaseDiagram.4" name="UseCaseDiagram1" diagramType="UseCaseDiagram" toolName="Rational Rose 98" owner="UMLModel.3">
  //      <UML:Diagram.element>
  //        <UML:DiagramElement xmi.id="UMLPackageView.5" geometry="1567, 1015, 1263, 1479," style="Category" subject="UMLPackage.25"/>
  //        <UML:DiagramElement xmi.id="UMLPackageView.5" geometry="1567, 1015, 1263, 1479," style="Category" subject="UMLPackage.25"/>
  public run():string {

    XMIImportProcessor._diagramSheets = [];
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this._data, "text/xml");
    XMIImportProcessor._rootXML = xmlDoc.documentElement;
    const diagramList = XMIImportProcessor._rootXML.getElementsByTagName('UML:Diagram');
    if (!diagramList) {
      return '';
    }

    console.log('diagrams:', diagramList);

    for (let i = 0; i < diagramList.length; i++) {
      //<UML:Diagram xmi.id="UMLUseCaseDiagram.4" name="UseCaseDiagram1" diagramType="UseCaseDiagram" toolName="Rational Rose 98" owner="UMLModel.3">
      const diagramXmi = diagramList[i]; // 获取当前<item>元素
      const diagramType = diagramXmi.getAttribute('diagramType');
      let diagramTargetData: DiagramSheet = { id:diagramXmi.getAttribute('name')!, elementNodes: [] };

      let task: XMITask | undefined = this.getTaskByDiagramType(diagramType as unknown as EDiagramType);
      if (task) {
        task.process(diagramXmi, diagramTargetData);
        XMIImportProcessor._diagramSheets.push(diagramTargetData);
      }
    }
    console.log('XMIImportProcessor._diagramSheets:', XMIImportProcessor._diagramSheets);
    return new XmiBuilder().convertToDrawioXml(XMIImportProcessor._diagramSheets);
  }

    private getTaskByDiagramType(type:EDiagramType):XMITask{

      let task:XMITask = new UnKnowTask();
      if(type == EDiagramType.usecase){
        task = new UseCaseTask_v11();
      }
      if(type == EDiagramType.sequenceDiagram){
        task = new SequenceDiagramTask_v11();
      }
      return task;
    }
}



export class UnKnowTask extends XMITask{
  constructor(/*data: CallRelationModuleData*/) {
    //super(data);
    super();
    this.diagramType = EDiagramType.unknown;
  }

  public process(diagramXmi:any, diagramTargetData:DiagramSheet):any{

  }
}


