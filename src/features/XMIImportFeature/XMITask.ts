
import  { EDiagramType,DiagramSheet}  from "./XmiDefine";
export abstract class XMITask{
    public constructor(/*data: CallRelationModuleData*/) {
      // this._data = data;
    }
  
    abstract process(diagramXmi:any, diagramTargetData:DiagramSheet):any;
    
    public diagramType:EDiagramType = EDiagramType.unknown;
  
  }