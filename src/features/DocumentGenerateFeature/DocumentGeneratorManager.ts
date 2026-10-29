
import  { DocumentGenerator_interface, DocumentGenerator_class, DocumentGeneratorBase}  from "./DocumentGenerator";
import  { EDocGenerateType,diagramType }  from "./DocDefine";
export class DocumentGeneratorManager{

    public static getAdaptedPrcessor(type:string):DocumentGeneratorBase{
        let processor:DocumentGeneratorBase;
       
        if(diagramType.get(type) == EDocGenerateType.Class){
            processor = new DocumentGenerator_class();
        }else{
            processor = new DocumentGenerator_interface();
        }

        return processor;
    }
}