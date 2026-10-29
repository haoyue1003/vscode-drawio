import { Style } from "docx";
import  { EDocGenerateType ,ClassEntry, ClassMethod, EAccessRight,accessProperties}  from "./DocDefine";
const { Document, Packer, Paragraph, TextRun ,HeadingLevel,TableOfContents  } = require('docx');
import * as vscode from 'vscode';
/**
 * 
 */
export class DocumentBuilderManager {

    public constructor() {
    }

    public static getAdaptedBuilder(id:EDocGenerateType):DocumentBuilderBase{
        let processor:DocumentBuilderBase;

        if(id == EDocGenerateType.Class){
            processor = new DocumentBuilder_class();
        }else{
            processor = new DocumentBuilder_class();
        }

        return processor;
    }

}

export abstract class DocumentBuilderBase{
    public constructor() {
   }
    abstract run(data:any, targetUri:vscode.Uri):void;
    protected _allParagraphs:Array<any> = [];
    protected _doc:any;
  }

  export class DocumentBuilder_class extends DocumentBuilderBase{
      public constructor() {
        super();
     
      }
      
      public run(data: any, targetUri: vscode.Uri): void {
          let classData: Array<ClassEntry> = data as Array<ClassEntry>;

          this._allParagraphs = [];
 

          //create 目录
          let table = new TableOfContents("目录", {
              hyperlink: true, // 目录项带超链接
              headingStyleRange: "1-" + `${classData.length}`, // 包含 1 到 3 级标题
          });
          this._allParagraphs.push(table);
          this.buildParagraphs(classData);

        //   this._doc = new Document({
        //       sections: [{
        //           properties: {},
        //           children: [
        //               new TableOfContents("目录", {
        //                   hyperlink: true, // 目录项带超链接
        //                   headingStyleRange: "1-3", // 包含 1 到 3 级标题
        //               }),
        //               new Paragraph({
        //                   text: "第一章 介绍",
        //                   heading: HeadingLevel.HEADING_1, // 一级标题
        //               }),
        //               new Paragraph("这是第一章的内容。"),
        //               // 标题 2
        //               new Paragraph({
        //                   text: "1.1 背景",
        //                   heading: HeadingLevel.HEADING_1, // 二级标题
        //               }),
        //               new Paragraph("这是 1.1 节的内容。"),
        //               // 标题 3
        //               new Paragraph({
        //                   text: "1.1.1 技术栈",
        //                   heading: HeadingLevel.HEADING_2, // 三级标题
        //               }),
        //               new Paragraph("这是 1.1.1 节的内容。"),
        //           ],
        //       }],
        //   });

        this._doc = new Document({
            sections: [{
                properties: {},
                children: this._allParagraphs
            }],
        });
           async function generateDocx(doc:any) {
              await Packer.toBuffer(doc).then((buffer: any) => {
                console.log('buffer:', buffer)
                  require('fs').writeFileSync(targetUri.fsPath, buffer);
              });
           }

           generateDocx(this._doc);

      }

      private buildParagraphs(classData: Array<ClassEntry>): any {
          for (let [cIndex, cItem] of classData.entries()) {
              this._allParagraphs.push(new Paragraph({
                  text: `${cIndex + 1}.` + '类名' + cItem.name,
                  heading: HeadingLevel.HEADING_1, // 一级标题
              }));
            //   this._allParagraphs.push(new Paragraph({ text: "职责介绍:XXX", }));
              this._allParagraphs.push(new Paragraph({

                children: [
                    new TextRun({
                        text: "职责介绍:XXX",
                        font: "Times New Roman", // 设置字体
                        size: 24, // 设置字体大小，单位pt
                        bold: true, // 设置粗体
                        // italic: true, // 设置斜体
                        color: "000000" // 设置颜色，这里是黑色
                    }),
                ]}
              ));
              // 在项目之间添加空行（不使用分页符）
              this._allParagraphs.push(new Paragraph({ text: '' }));

              this._allParagraphs.push(new Paragraph({ text: "接口介绍" }));

              for (let funItem of cItem.methodList) {

                  let retType: string = '';
                  if (funItem.returnType == undefined) {
                      retType = 'void';
                  } else {
                      retType = funItem.returnType;
                  }

                  if (0 == funItem.parameters.length) {
                      this._allParagraphs.push(new Paragraph({ text: retType + ' ' + funItem.name + '()' }));
                  } else {
                      this._allParagraphs.push(new Paragraph({ text: retType + ' ' + funItem.name + '(' }));
                      let comma: string = ',';
                      for (let [pIndex, pItem] of funItem.parameters.entries()) {

                          if ((pIndex + 1) == funItem.parameters.length) {
                              comma = '';
                          }
                          this._allParagraphs.push(new Paragraph({ text: pItem[0] + '    ' + pItem[1] + comma }));
                      }
                      this._allParagraphs.push(new Paragraph({ text: ');' }));
                  }

                  // 在项目之间添加空行（不使用分页符）
                  this._allParagraphs.push(new Paragraph({ text: '' }));

                  //访问属性

                  this._allParagraphs.push(new Paragraph({ text: '访问属性：' + accessProperties.get(funItem.accessRight) }));

                  this._allParagraphs.push(new Paragraph({ text: '' }));

                  //对每个参数说明：
                  if (0 == funItem.parameters.length) {
                      this._allParagraphs.push(new Paragraph({ text: '参数:无' }));
                  } else {
                      this._allParagraphs.push(new Paragraph({ text: '参数' }));

                      for (let [pIndex, pItem] of funItem.parameters.entries()) {
                          this._allParagraphs.push(new Paragraph({ text: String(pItem[1]) }));
                          this._allParagraphs.push(new Paragraph({ text: '类型' + ' ' + pItem[0] }));
                          this._allParagraphs.push(new Paragraph({ text: '说明:XXX' }));
                          if ((pIndex + 1) != funItem.parameters.length) {
                              this._allParagraphs.push(new Paragraph({ text: '' }));
                          }
                      }
                  }

                  // 在项目之间添加空行（不使用分页符）
                  this._allParagraphs.push(new Paragraph({ text: '' }));

                  //返回值
                  this._allParagraphs.push(new Paragraph({ text: '返回值' }));
                  this._allParagraphs.push(new Paragraph({ text: '类型：' + funItem.returnType }));
                  this._allParagraphs.push(new Paragraph({ text: '成功：' + 'XXX' }));
                  this._allParagraphs.push(new Paragraph({ text: '失败：' + 'XXX' }));

                  this._allParagraphs.push(new Paragraph({ text: '' }));
              }
          }
      }
  }