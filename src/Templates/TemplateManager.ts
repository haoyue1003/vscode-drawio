import type { Template } from '../DrawioClient/DrawioTypes'
const path = require('path');
const { sep } = path;
const glob = require('glob');
import {Uri} from "vscode";
import * as vscode from 'vscode';
import * as fs from 'fs';
/**
 * 获取所有的自主提供的模板信息
 */
export class TemplateManager {
    private SystemTemplates: Template[] = []
    private UserTemplates: Template[] = []
    private TEMPLATES: Template[] = []
    private  xmlSuffix:string =  '*.5md';
    private  imgSuffix:string =  '*.png';
    // 获取系统自带的模板
    private getSystemTemplates(): Template[] {
        try {
            let templateId = this.SystemTemplates.length;
            const templatesPath = path.resolve(__dirname, `..${sep}..${sep}viewtemplates${sep}build-in`);
            const typeDirs = glob.sync(path.join(templatesPath, '*').replace(/\\/g, '/'));
            typeDirs.forEach((typeDir: string) => {
                const type = path.basename(typeDir);
                const moduleDirs = glob.sync(path.join(typeDir, '*').replace(/\\/g, '/'));
                if (moduleDirs.length !== 0) {
                    this.SystemTemplates.push({
                        id: `${templateId++}`,
                        isSystem: true,
                        type,
                        data: []
                    });
                    moduleDirs.forEach((moduleDir: string) => {
                        const module = path.basename(moduleDir);
                        const drawioFile = glob.sync(path.join(moduleDir, this.xmlSuffix).replace(/\\/g, '/'))[0];
                        const pngFile = glob.sync(path.join(moduleDir, this.imgSuffix).replace(/\\/g, '/'))[0];
                        if (drawioFile && pngFile) {
                            // 读取 PNG 文件并转换为 base64
                            const pngBuffer = fs.readFileSync(pngFile);
                            const base64String = pngBuffer.toString('base64');
                            const iconImageUrl = `data:image/png;base64,${base64String}`;
                            
                            this.SystemTemplates[this.SystemTemplates.length - 1].data.push({
                                name: module,
                                iconImageUrl: iconImageUrl,
                                xmlUrl: drawioFile,
                                xml: ''
                            })
                        };
                    });
                }
            });
            return this.SystemTemplates;
        } catch (error) {
            console.error('Error in getting templates', error);
            return [];
        }
    }

    /**
     *  获取用户自定义的模板
     * @returns 用户自定义的模板
     */
    private getUserTemplates(): Template[] {
        try {
            let templateId = this.SystemTemplates.length;
            const userHome = vscode.Uri.file(process.env.HOME || process.env.USERPROFILE || '');
            const templatePath = `${userHome.fsPath}/.viewtemplates`;
            const templateNameDirs = glob.sync(path.join(templatePath, '*').replace(/\\/g, '/'));

            if (templateNameDirs.length !== 0) {
                this.UserTemplates.push({
                    id: `${templateId++}`,
                    isSystem: false,
                    type: 'user',
                    data: templateNameDirs.reduce((acc: any[], typeDir: string) => {
                        const name = path.basename(typeDir);
                        const drawioFile =  glob.sync(path.join(typeDir, this.xmlSuffix).replace(/\\/g, '/'))[0];
                        const pngFile = glob.sync(path.join(typeDir, this.imgSuffix).replace(/\\/g, '/'))[0];
                        if (drawioFile && pngFile) {
                            // 读取 PNG 文件并转换为 base64
                            const pngBuffer = fs.readFileSync(pngFile);
                            const base64String = pngBuffer.toString('base64');
                            const iconImageUrl = `data:image/png;base64,${base64String}`;
                            
                            acc.push({
                                name,
                                iconImageUrl: iconImageUrl,
                                xmlUrl: drawioFile,
                                xml: ''
                            });
                        }
                        return acc;
                    }, [])
                });
            }
            return this.UserTemplates;
        } catch (error) {
            console.error('Error in getting templates', error);
            return [];
        }
    }

    public getTemplates() {
        this.getSystemTemplates();
        this.getUserTemplates();
        this.TEMPLATES = this.SystemTemplates.concat(this.UserTemplates);
        return this.TEMPLATES;
    }
}
