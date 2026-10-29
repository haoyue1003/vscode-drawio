import  {EElementNodeType, Coordinate, ElementNode, EDiagramType,DiagramSheet}  from "./XmiDefine";
import { DOMParser, XMLSerializer } from 'xmldom';
import {XmiBuilder} from  "./XMIBuilder";
import {XMITask} from  "./XMITask";
import {XMIImportProcessor} from  "./XMIImportProcessor";


export class SequenceDiagramTask_v11 extends XMITask{

    private tagList: Map<string, EElementNodeType> = new Map(
      [
        ['UML:Message', EElementNodeType.SequenceDiagramMessage],
        ['UML:ClassifierRole', EElementNodeType.SequenceDiagramClassifierRole],
      ]
    );
  
    constructor(/*data: CallRelationModuleData*/) {
      //super(data);
      super();
      this.diagramType = EDiagramType.usecase;
    }
    
    
    public process(diagramXmi:any, diagramTargetData:DiagramSheet):any{
      //<UML:DiagramElement xmi.id="UMLSeqStimulusView.9" geometry="1785, 786, 90, 60," style="Message,SQN=2," subject="UMLStimulus.13"/>
      //<UML:DiagramElement xmi.id="UMLSeqStimulusView.10" geometry="1153, 888, 1173, 0," style="Message,SQN=3," subject="UMLStimulus.15"/>
      const diagramElementList = diagramXmi.getElementsByTagName('UML:DiagramElement');

      let diagramElementMap: Map<string, any> = new Map()
      for (let j = 0; j < diagramElementList.length; j++){
        const diagramElement = diagramElementList[j];
        const xmiId:string = diagramElement.getAttribute('subject');
        diagramElementMap.set(xmiId,diagramElement);
      }
      for (let j = 0; j < diagramElementList.length; j++){
        const diagramElement = diagramElementList[j];
        // console.log(`Item ID: ${diagramElement.getAttribute('xmi.id')}, geometry: ${diagramElement.getAttribute('geometry')}`); // 输出ID和文本内容
        const xmiId:string = diagramElement.getAttribute('subject');
        // const elements = XMIImportProcessor._rootXML.getElementsByTagName('UML:Actor');
        let elementData:ElementNode|undefined  = this.searchAndParseElementByID(xmiId,diagramElementMap);
       
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
  
    
    public searchAndParseElementByID(xmiId: string,diagramElementMap: Map<string, any>): ElementNode|undefined {
      for (let item of this.tagList) {
          const elements = XMIImportProcessor._rootXML.getElementsByTagName(item[0]);
          if (elements) {
          let element = Array.from(elements).filter((el: any) => el.getAttribute('xmi.id') === xmiId);
          // console.log('element:', element)
          if (element[0]) {
            // console.log('element:', (element[0] as any).getAttribute('name'))
            let elementNode: ElementNode = {
              id: xmiId,
              type: item[1],
              name: (element[0] as any).getAttribute('name'),
              coordinate: { left: '', top: '', width: '', height: '' },
              idParentid:'1'
            }
            // console.error('@@@@@@@@@@@item[1]:', item[1])
            if (item[1] == EElementNodeType.SequenceDiagramMessage) {
              let sourceid = (element[0] as any).getAttribute('sender')
              let targetid = (element[0] as any).getAttribute('receiver')
              elementNode.sourceid = sourceid;
              elementNode.targetid = targetid;
              const sourceDiagramElement = diagramElementMap.get(sourceid);
              const targetDiagramElement = diagramElementMap.get(targetid);
              let scale:number = XMIImportProcessor._scale/100;

              let sourceGeometry:string = sourceDiagramElement.getAttribute('geometry');
              let sourceCoordinate:Array<string> = sourceGeometry.split(',');
              let sourceX:number = ( Number(sourceCoordinate[0].trim()) -  Number(sourceCoordinate[2].trim())/2)* scale;
              // let sourceY:number =  (Number(sourceCoordinate[1].trim()) -  Number(sourceCoordinate[3].trim())/2)* scale;
      
              let targetGeometry:string = targetDiagramElement.getAttribute('geometry');
              let targetCoordinate:Array<string> = targetGeometry.split(',');
              let targetX:number = ( Number(targetCoordinate[0].trim()) -  Number(targetCoordinate[2].trim())/2)* scale;
              // let targetY:number =  (Number(targetCoordinate[1].trim()) -  Number(targetCoordinate[3].trim())/2)* scale;

              elementNode.sourceX = sourceX;
              elementNode.targetX = targetX;
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