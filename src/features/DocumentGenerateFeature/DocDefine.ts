export enum EDocGenerateType {
    Unknown = 'UnKnow',
    Interface = 'Interface',
    Class = 'Class',
}

export enum EAccessRight {
    default = '',
    public = '+',
    protected = '#',
    private = '-',
}

export interface ClassEntry{
    name:string;
    methodList:Array<ClassMethod>;
    fieldList?:Array<string>;
}

export interface ClassField{
    accessRight:EAccessRight;
    type:string;
    name:string;
}
export interface ClassMethod{
    accessRight:EAccessRight;
    name:string;
    parameters:Array<[string, string]>;//[参数类型，参数名字]
    returnType:string|undefined;
}


export const accessProperties:Map<EAccessRight, string> = new Map([[EAccessRight.private,'私有'],[EAccessRight.public,'公有'],[EAccessRight.protected,'保护']]);
export const diagramType:Map<string, EDocGenerateType> = new Map([['类图',EDocGenerateType.Class],['接口',EDocGenerateType.Interface]]);