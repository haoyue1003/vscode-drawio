
import  { XMIImportProcessor_v11}  from "./XMIImportProcessor_v11";
import  { XMIImportProcessor}  from "./XMIImportProcessor";


export class XMIImportManager{

    public static getAdaptedProtocolPrcessor(data:string, scale?:string):XMIImportProcessor{
        let processor:XMIImportProcessor;

        if(data.includes('xmi.version="1.1"')){
            processor = new XMIImportProcessor_v11(data);

        }else{
            processor = new XMIImportProcessor_v11(data);
        }
        if(scale){
            processor.setSacle(scale);
        }
        return processor;
    }
}