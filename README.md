# Draw.io VS Code Integration

> ## 衍生作品声明 / Derivative Work Notice
>
> 本项目（`hesds-modeling-design-tool`，「4+1 视图建模工具」）是基于
> [hediet/vscode-drawio](https://github.com/hediet/vscode-drawio) **v1.6.6**
> （Copyright © Henning Dieterichs，GPL-3.0）修改而来的衍生作品，并内置了
> [jgraph/drawio](https://github.com/jgraph/drawio) 的修改版（Apache-2.0）。
>
> - 本仓库全部代码（含修改部分）按 **[GNU General Public License v3.0](./LICENSE.md)** 发布。
>   您可以自由使用、修改、再分发，但再分发时须同样采用 GPL-3.0、附带许可证原文，并保留本声明与原版权信息。
> - 相对上游 v1.6.6 的主要修改：扩展更名与发布者变更（`hesds`）、新增左侧「4+1 视图建模工具」活动栏视图、
>   `*.5md` 语言与自定义编辑器 `hesds.4+1view-text`、内置模板与自定义模板/模型库管理、
>   UML 模型自动生成 Word（docx）文档、XMI 1.1（用例图/时序图）导入、
>   drawio 侧边栏面板与形状库定制（`drawio/src/main/webapp/js/diagramly/sidebar/Sidebar-Hesds*.js` 等）、
>   drawio 自定义插件（`drawio-custom-plugins/`）等。详细变更见 [CHANGELOG.md](./CHANGELOG.md)。
> - `drawio/` 目录为 draw.io 官方源码的修改版，遵循 **Apache License 2.0**，许可证见
>   [drawio/LICENSE](./drawio/LICENSE)；其版权归 JGraph Ltd 及 draw.io 贡献者所有，
>   本仓库已一并公开该目录下的全部修改。
> - 本仓库与上述上游项目无隶属关系；上游的文档链接、贡献者名单与赞助入口仅作来源标注保留。

[![](https://img.shields.io/static/v1?style=social&label=Sponsor&message=%E2%9D%A4&logo=GitHub&color&link=%3Curl%3E)](https://github.com/sponsors/hediet)
[![](https://img.shields.io/static/v1?style=social&label=Donate&message=%E2%9D%A4&logo=Paypal&color&link=%3Curl%3E)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ZP5F38L4C88UY&source=url)
[![](https://img.shields.io/twitter/follow/hediet_dev.svg?style=social)](https://twitter.com/intent/follow?screen_name=hediet_dev)

This unofficial extension integrates [Draw.io](https://app.diagrams.net/) (also known as [diagrams.net](diagrams.net)) into VS Code.  
Mentioned in the official diagrams.net [blog](https://www.diagrams.net/blog/embed-diagrams-vscode).

## Features

-   Edit `.drawio`, `.dio`, `.drawio.svg` or `.drawio.png` files in the Draw.io editor.
    -   To create a new diagram, simply create an empty `*.drawio`, `*.drawio.svg` or `*.drawio.png` file and open it.
    -   `.drawio.svg` are valid `.svg` files that can be embedded in Github readme files! No export needed.
    -   `.drawio.png` are valid `.png` files! No export needed. You should use `.svg` though whenever possible - they look much better!
    -   To convert between different formats, use the `Draw.io: Convert To...` command.
-   Uses an offline version of Draw.io by default.
-   Multiple Draw.io themes are available.
-   Use Liveshare to collaboratively edit a diagram with others.
-   Nodes/edges can be linked with code spans.

## Demo

![](./docs/demo.gif)

<br />
<br />

# Like it so far? You might also like my [open source](https://github.com/hediet/chrome-ext-github-monaco) [Chrome extension that enhances the Github markdown editor](https://chrome.google.com/webstore/detail/monaco-markdown-editor-fo/mmpbdjdnmhgkpligeniippcgfmkgkpnf)!

<br />
<br />

## Editing .drawio.svg/.drawio.png Files

You can directly edit and save `.drawio.svg` and `.drawio.png` files.
These files are perfectly valid svg/png-images that contain an embedded Draw.io diagram.
Whenever you edit such a file, the svg/png part of that file is kept up to date.

The logo of this extension is such a `.drawio.png` file that has been created with the extension itself!

![](./docs/drawio-png.gif)

If diffs are important for you, you should prefer `.drawio` and avoid `.drawio.png` diagrams.

## Collaboratively Edit Or Present Diagrams

With version 1.0 of this extension, extensive support for [VS Code Liveshare](https://visualstudio.microsoft.com/de/services/live-share/) has been added. You can now edit or present your Draw.io diagrams remotely, while seeing each participant's cursor and selection! This can be used for discussing, reviewing or brainstorming diagrams.
With Draw.io's freehand drawing tool and integrated LaTeX support, this extension becomes an advanced whiteboard solution that can be used for remote code interviews!

![](./docs/liveshare-demo.gif)

_Internally, this extension synchronizes Draw.io diagrams with text documents.
These text documents are shared by Liveshare. As Liveshare has no understanding of the text, modification conflicts might occur on simultaneous modifications._

## Code Link Feature

In the status bar, you can enable or disable the code link feature.
If it is enabled and you double click on a node whose label starts with `#`,
you will perform a workspace search for a symbol matching the rest of the label.

If you have a node labeled `#MyClass` and a class of name `MyClass`, you will jump to its source if you double click the node!

**Please note that you have to open at least one file of the project that contains the symbol.**
Otherwise, VS Code will not consider this project when searching for symbols.
This file itself does not have to contain the symbol though.

Thanks to my latest github sponsors, this feature is open source and freely available now.

_TIP_: If you open the draw.io editor to the right side (i.e. the second editor column) and navigate to a symbol,
the diagram will stay visible.

![](./docs/demo-code-link.gif)

## Themes

<details>
    <summary><b>Available Draw.io Themes</b></summary>
    <!-- Please use HTML syntax here so that it works for Github and mkdocs -->
    <ul>
        <li><p>Theme "atlas"</p><img src="docs/theme-atlas.png" alt="atlas" width="800"></li>
        <li><p>Theme "Kennedy"</p><img src="docs/theme-Kennedy.png" alt="Kennedy" width="800"></li>
        <li><p>Theme "min"</p><img src="docs/theme-min.png" alt="min" width="800"</li>
        <li><p>Theme "dark"</p><img src="docs/theme-dark.png" alt="dark" width="800"></li>
    </ul>
</details>

## Associate `.svg` Files With The Draw.io Editor

By default, this extension only handles `*.drawio.svg` files.
Add this to your VS Code `settings.json` file if you want to associate it with `.svg` files:

```json
"workbench.editorAssociations": {
    "*.svg": "hediet.vscode-drawio-text",
}
```

You won't be able to edit arbitrary SVG files though - only those that have been created with Draw.io or this extension!

## Editing the Diagram and its XML Side by Side

You can open the same `*.drawio` file with the Draw.io editor and as xml file.
They are synchronized, so you can switch between them as you like it.
This is super practical if you want to use find/replace to rename text or other features of VS Code to speed up your diagram creation/edit process.
Use the `View: Reopen Editor With...` command to toggle between the text or the Draw.io editor. You can open multiple editors for the same file.
This does not make much sense for SVG files though, as the draw.io diagram is stored in its metadata.

![](./docs/drawio-xml.gif)

## Contributors

-   Henning Dieterichs, [hediet](https://github.com/hediet) on Github (Main Contributor / Author)
-   Vincent Rouillé, [Speedy37](https://github.com/Speedy37) on Github

## See Also / Similar Extensions

-   [Draw.io](https://app.diagrams.net/) - This extension relies on the giant work of Draw.io. Their embedding feature enables this extension! This extension bundles a recent version of Draw.io.
-   [vscode-drawio](https://github.com/eightHundreds/vscode-drawio) by eightHundreds.

## Other Cool Extensions

If you like this extension, you might like [my other extensions](https://marketplace.visualstudio.com/search?term=henning%20dieterichs&target=VSCode) too:

-   **[Debug Visualizer](https://marketplace.visualstudio.com/items?itemName=hediet.debug-visualizer)**: An extension for visualizing data structures while debugging.
-   **[Real-Time Debugging](https://marketplace.visualstudio.com/items?itemName=hediet.realtime-debugging)**: This extension visualizes how your code is being executed.
