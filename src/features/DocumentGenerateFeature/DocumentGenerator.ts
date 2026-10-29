import  { EDocGenerateType ,ClassEntry, ClassMethod, EAccessRight}  from "./DocDefine";
import  { DocumentBuilderManager}  from "./DocumentBuilder";
import { DOMParser, XMLSerializer } from 'xmldom';
import * as vscode from 'vscode';

export abstract class DocumentGeneratorBase{
  public constructor() {
 }

  abstract run(data:any, targetUri:vscode.Uri):void;
  
  // public diagramType:EDiagramType = EDiagramType.unknown;
  protected _xmlRoot:any;

//   public static _diagramSheets:Array<DiagramSheet>= [];
//   public static _rootXML:any;
}

export class DocumentGenerator_interface extends DocumentGeneratorBase{
    public constructor() {
      super();
    }

    public run(data:any, targetUri:vscode.Uri):void{
    }
}

export class DocumentGenerator_class extends DocumentGeneratorBase{
    public constructor() {
      super();
    }

    public run(data:any, targetUri:vscode.Uri):void {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "text/xml");
        this._xmlRoot = xmlDoc.documentElement;
        let classList:Array<ClassEntry> = this.parseXml();
        console.log('classList:', classList);

        if(classList && classList.length>0){
            //build document data
            DocumentBuilderManager.getAdaptedBuilder(EDocGenerateType.Class).run(classList, targetUri);
        }
    }

    public parseXml(): any {
        let classList:Array<ClassEntry> = [];
        let classes = this.searchByType('hesds-classname');
        if (classes) {
            for (let classItem of classes) {
                let classEntry:ClassEntry ={name:classItem.getAttribute('value'), methodList:[]};

                let id:string = classItem.getAttribute('id');
                let methodNodes = this.searchByType('hesds-classmethod', id);

                if (methodNodes) {
                    for (let methodItem of methodNodes) {
                        let classMethod:ClassMethod = {
                            accessRight:EAccessRight.public,
                            name:'',
                            parameters:[],
                            returnType:undefined
                        }
                        let value:string = methodItem.getAttribute('value');
                        value = value.replace(/&nbsp;/g,'').trim();
                        
                        if(value.includes(EAccessRight.public)){
                            classMethod.accessRight = EAccessRight.public;
                        }
                        else if(value.includes(EAccessRight.private)){
                            classMethod.accessRight = EAccessRight.private;
                        }else if(value.includes(EAccessRight.protected)){
                            classMethod.accessRight = EAccessRight.protected;
                        }else{
                            classMethod.accessRight = EAccessRight.default;
                        }

                        //解析函数名
                        // let name = value.match((new RegExp('[A-Za-z\\s]+(?=\\()' as string, 'g')));
                        value = value.replace('+','').replace('-','').replace('#','').trim();
                        value = value.replace(/）/g, ')').replace(/（/g, '(').replace(/：/g, ':');
                        let indexSep:number = value.indexOf('(');
                        if( -1!= indexSep){
                            classMethod.name = value.substring(0, indexSep).trim();
                        }
                        // console.log('method item:',classMethod.name);

                        //解析函数参数
                        let parameterRet = value.match((new RegExp('\\((.*?)\\)' as string, 'g'))); 
                        // console.log('method parameterList:', parameterRet![0]);
                        let parameterData: string = '';
                        if(parameterRet){
                            parameterData = parameterRet[0].replace('(','').replace(')','').trim();
                            parameterData = parameterData.replace(/，/g, ',');
                        }
                        if(parameterData.length > 0){
                            let parameters = parameterData.split(',');
                            if(parameters){
                                let paramList:Array<[string, string]>=[];
                                for(let item of parameters){
                                    let p:string = item.trim();
                                    let content = p.split(' ');
                                    if(content){
                                        paramList.push([content[0], content[1]]);
                                    }else{
                                        paramList.push([p, '']);
                                    }
                                }
                                classMethod.parameters = paramList;
                            }
                        }
                        //解析函数返回值
                        let index:number = value.indexOf(':');
                        if(-1 != index){
                            let retType:string = value.substring(index + 1).trim();
                            classMethod.returnType = retType;
                        }
                        // console.log('classMethod:', classMethod);
                        classEntry.methodList.push(classMethod);
                    }
                }

                classList.push(classEntry);
            }
        }
        return classList;
    }

    private searchByType(type1:string, type2?:string):any{
        const mxCellList = this._xmlRoot.getElementsByTagName('mxCell');
        if(mxCellList){
            if(type2){
                return Array.from(mxCellList).filter((el: any) =>el.getAttribute('style').includes(type1) && el.getAttribute('parent') == type2);
            }else{
                return Array.from(mxCellList).filter((el: any) =>el.getAttribute('style').includes(type1));
            }
        }
        return undefined;
    }
}


// const xmlParseHandlers: Record<EDocGenerateType, (data: string) => any> = {
//     [EDocGenerateType.Unknown]: (data: string) => undefined,
//     [EDocGenerateType.Interface]: parseXml_IF,
 
// };