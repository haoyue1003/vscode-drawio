
import  {DiagramSheet}  from "./XmiDefine";



export abstract class XMIImportProcessor{
    public constructor(data: string) {
      this._data = data;
      XMIImportProcessor._scale = 100;
   }
  
    public setSacle(scale:string){
      XMIImportProcessor._scale = parseInt(scale);
    }
  
    abstract run():string;
    
    // public diagramType:EDiagramType = EDiagramType.unknown;
    protected _data:string;
  
    public static _diagramSheets:Array<DiagramSheet>= [];
    public static _rootXML:any;
    public static _scale:number;
  }