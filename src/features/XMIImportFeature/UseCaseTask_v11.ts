import  {EElementNodeType, Coordinate, ElementNode, EDiagramType,DiagramSheet}  from "./XmiDefine";
import { DOMParser, XMLSerializer } from 'xmldom';
import {XmiBuilder} from  "./XMIBuilder";
import {XMITask} from  "./XMITask";
import {XMIImportProcessor} from  "./XMIImportProcessor";


export class UseCaseTask_v11 extends XMITask{

    private tagList: Map<string, EElementNodeType> = new Map(
      [
        ['UML:Package', EElementNodeType.Package],
        ['UML:Actor', EElementNodeType.Actor],
        ['UML:UseCase', EElementNodeType.UseCase],
        ['UML:Generalization', EElementNodeType.Generalization],
        ['UML:Association', EElementNodeType.Association],
        ['UML:Include', EElementNodeType.Include],
        ['UML:Extend', EElementNodeType.Extend],
        ['UML:Dependency', EElementNodeType.Dependency],
        ['UML:UnKnow', EElementNodeType.Unknown],
      ]
    );
  
    constructor(/*data: CallRelationModuleData*/) {
      //super(data);
      super();
      this.diagramType = EDiagramType.usecase;
    }
  
    public process(diagramXmi:any, diagramTargetData:DiagramSheet):any{
      // <UML:DiagramElement xmi.id="UMLPackageView.5" geometry="1567, 1015, 1263, 1479," style="Category" subject="UMLPackage.25"/>
      // <UML:DiagramElement xmi.id="UMLPackageView.5" geometry="1567, 1015, 1263, 1479," style="Category" subject="UMLPackage.25"/>
      const diagramElementList = diagramXmi.getElementsByTagName('UML:DiagramElement');
      for (let j = 0; j < diagramElementList.length; j++){
        const diagramElement = diagramElementList[j];
        // console.log(`Item ID: ${diagramElement.getAttribute('xmi.id')}, geometry: ${diagramElement.getAttribute('geometry')}`); // 输出ID和文本内容
        const xmiId:string = diagramElement.getAttribute('subject');
        // const elements = XMIImportProcessor._rootXML.getElementsByTagName('UML:Actor');
        let elementData:ElementNode|undefined  = this.searchAndParseElementByID(xmiId);
       
        if(elementData){
          let geometry:string = diagramElement.getAttribute('geometry');
          let coordinate:Array<string> = geometry.split(',');
  
          let scale:number = XMIImportProcessor._scale/100;
          let adjustLeft:number = Number(coordinate[0].trim()) -  Number(coordinate[2].trim())/2;
          let adjustTop:number = Number(coordinate[1].trim()) -  Number(coordinate[3].trim())/2;
  
          adjustLeft = adjustLeft * scale;
          adjustTop = adjustTop * scale;
          let adjustWidth:number =  parseInt(coordinate[2].trim())* scale;
          let adjustHeight:number =  parseInt(coordinate[3].trim())* scale;
          // elementData.coordinate ={ left: left.toString(), top: top.toString(), width: coordinate[2].trim(), height: coordinate[3].trim() };
          elementData.coordinate ={ left: adjustLeft.toString(), top: adjustTop.toString(), width: adjustWidth.toString(), height:adjustHeight.toString() };
          diagramTargetData.elementNodes.push(elementData);
        }
        else{
        }
      }
    }
  
    
    public searchAndParseElementByID(xmiId: string): ElementNode|undefined {
      for (let item of this.tagList) {
        const elements = XMIImportProcessor._rootXML.getElementsByTagName(item[0]);
        if (elements) {
          let element = Array.from(elements).filter((el: any) => el.getAttribute('xmi.id') === xmiId);
          console.log('element:', element)
          if (element[0]) {
            console.log('element:', (element[0] as any).getAttribute('name'))
            let elementNode: ElementNode = {
              id: xmiId,
              type: item[1],
              name: (element[0] as any).getAttribute('name'),
              coordinate: { left: '', top: '', width: '', height: '' },
              idParentid:'1'
            }
  
            if (item[1] == EElementNodeType.Extend) {
              elementNode.sourceid = (element[0] as any).getAttribute('base');
              elementNode.targetid = (element[0] as any).getAttribute('extension');
            } else if (item[1] == EElementNodeType.Include) {
              elementNode.sourceid = (element[0] as any).getAttribute('base');
              elementNode.targetid = (element[0] as any).getAttribute('addition');
            } else if (item[1] == EElementNodeType.Generalization) {
              elementNode.sourceid = (element[0] as any).getAttribute('child');
              elementNode.targetid = (element[0] as any).getAttribute('parent');
            } else if (item[1] == EElementNodeType.Association) {
              const associationEnds = (element[0] as any).getElementsByTagName('UML:AssociationEnd');
              elementNode.sourceid = (associationEnds[0] as any).getAttribute('type');
              elementNode.targetid = (associationEnds[1] as any).getAttribute('type');
            } else if (item[1] == EElementNodeType.Dependency) {
              elementNode.sourceid = (element[0] as any).getAttribute('client');
              elementNode.targetid = (element[0] as any).getAttribute('supplier');
            } 
             else {
  
            }
            return elementNode;
          }
          
        }
  
      }
      return undefined;
    }
  }