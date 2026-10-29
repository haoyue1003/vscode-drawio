
export enum SequenceDiagramElementNodeType {
    Unknown = 'UnKnow',
    Actor = 'Actor',
    Package = 'Package',
    Generalization = 'Generalization',
    Association = 'Association',
    UseCase = 'UseCase',
    Include = 'Include',
    Extend = 'Extend',
    Dependency = 'Dependency'
}

export enum EElementNodeType {
    Unknown = 'UnKnow',
    Actor = 'Actor',
    Package = 'Package',    
    Generalization = 'Generalization',
    Association = 'Association',
    UseCase = 'UseCase',
    Include = 'Include',
    Extend = 'Extend',
    Dependency = 'Dependency',
    SequenceDiagramClassifierRole  = 'ClassifierRole',
    SequenceDiagramMessage  = 'Message',
    
}

export interface Coordinate {
    left: string;//相对坐标
    top: string;//相对坐标
    width: string;//margin宽
    height: string;//margin高
}

export interface DiagramSheet {
    id:string;
    elementNodes:Array<ElementNode>;
}

export interface ElementNode {
    id:string;
    type: EElementNodeType;
    name:string;
    coordinate: Coordinate;
    sourceid?:string;
    targetid?:string;
    idParentid?: string;
    sourceX?:number;
    targetX?:number;
}

export enum EDiagramType {
    unknown = 'UnKnow',
    usecase = 'UseCaseDiagram',
    sequenceDiagram = 'SequenceDiagram',
    class = '2',
    sequence = '3'
  }