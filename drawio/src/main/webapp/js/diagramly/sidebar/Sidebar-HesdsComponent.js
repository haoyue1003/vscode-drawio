(function () {
    Sidebar.prototype.addHESDSComponentPalette = function () {
        this.setCurrentSearchEntryLibrary();
        this.addComponentPalette(false);
        this.setCurrentSearchEntryLibrary();
    }

    // Adds PhysicalView shapes
    Sidebar.prototype.addComponentPalette = function (expand) {
        var sb = this;
        var dt = 'uml ';
        var field = new mxCell('+ field: type', new mxGeometry(0, 0, 100, 26), 'text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;html=1;');
        // 作为独立节点
        field.vertex = true;
        // 分割线
        var divider = new mxCell('', new mxGeometry(0, 0, 40, 8), 'line;strokeWidth=1;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=3;spacingRight=3;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;strokeColor=inherit;');
        // 作为独立节点
        divider.vertex = true;
        var fns = [
            // component
            this.addEntry(dt + 'component', function () {
                var cell = new mxCell('&laquo;Annotation&raquo;<br/><b>Component</b>', new mxGeometry(0, 0, 180, 90), 'html=1;whiteSpace=wrap;verticalAlign=top;align=center;spacingTop=8;spacingLeft=2;spacingRight=12;container=1;dropTarget=1;collapsible=1;recursiveResize=1;');
                cell.vertex = true;

                var symbol = new mxCell('', new mxGeometry(1, 0, 20, 20), 'shape=module;jettyWidth=8;jettyHeight=4;');
                symbol.vertex = true;
                symbol.geometry.relative = true;
                symbol.geometry.offset = new mxPoint(-27, 7);
                cell.insert(symbol);

                return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, '组件 (Component)');
            }),
            // Component with Attributes
            this.addEntry(dt + 'component', function () {
                var cell = new mxCell('<p style="margin:0px;margin-top:6px;text-align:center;"><b>Component</b></p>' +
                    '<hr/><p style="margin:0px;margin-left:8px;">+ Attribute1: Type<br/>+ Attribute2: Type</p>', new mxGeometry(0, 0, 280, 90),
                    'align=left;overflow=fill;html=1;dropTarget=0;whiteSpace=wrap;container=1;dropTarget=1;collapsible=1;recursiveResize=1;');
                cell.vertex = true;

                var symbol = new mxCell('', new mxGeometry(1, 0, 20, 20), 'shape=component;jettyWidth=8;jettyHeight=4;');
                symbol.vertex = true;
                symbol.geometry.relative = true;
                symbol.geometry.offset = new mxPoint(-24, 4);
                cell.insert(symbol);

                return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, '组件 (Component with Attributes)');
            }),
            // Artifact
            this.createVertexTemplateEntry('html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.application;appType=artifact;archiType=square;',
                150, 75, 'Artifact', 'Artifact', null, null, this.getTagsForStencil('mxgraph.archimate3', '', 'archimate technology artifact').join(' ')),
            // 类
            this.addEntry(dt + 'object instance', function () {
                var cell = new mxCell('Classname', new mxGeometry(0, 0, 160, 90),
                    'swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=26;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;whiteSpace=wrap;html=1;');
                cell.vertex = true;
                cell.insert(field.clone());
                cell.insert(divider.clone());
                cell.insert(sb.cloneCell(field, '+ method(type): type'));

                return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, '类 (Class)');
            }),
            // 需求接口
            this.addDataEntry('uml lollipop notation provided required interface', 20, 20, 'Required Interface',
                'jVNBbuMwDHyN7o6N9L5x2l66QIEe9qy1GUutIhoUHTt9/VKWNo7bBu0hgDicYeQZSlX1cXok3Zvf2IJT1b2qakLkdDpONTinysK2qtqrsizkp8qHG93N3C16TeD5J4IyCU7aDZCQBAQ+uwwQDr6FyC9UtUNigx167Z4QewE3Ar4C8/nFvkeFHhgFMnx0uQu+/UWEo5RGu0NtqYmzI/5gncuDpcoT7qQKTPgGf2zLJk8Jb8CNyeQDes7sTSl1M9BpvmJkpi+AtoOVKaypg2xK9dmnmZVNegQ8AtNZKAROsz2tR+mQyu7Cu0if0crEspiyv9ukOKdyu9YHHKiBLFlSksPVHRZozu7rHKvvcxSB7UM0fjSW4aXXTeyMsnvrvLSznZdzI94ARSD00ESbDnaKLu8OEluNDqW59+jhEtgHkCDYd/13vkGMrQey8lFxaJ7+vCA7QtZ8xdbO4ThvTvivj07N3m13aruP6ziws17+1/t0xWUBTkAM0813cSPvMa9cZKSnUxiwneE19tUGrOJbspJyec8p2uvn/g8='),
            // 提供接口 
            // interface
            this.createVertexTemplateEntry('shape=ellipse;html=1;verticalLabelPosition=bottom;sketch=0;labelPosition=center;spacingBottom=-10;', 10, 10, 'Interface', 'Interface', null, null, 'uml interface lollipop notation'),
            this.createEdgeTemplateEntry('html=1;verticalAlign=bottom;labelBackgroundColor=none;endArrow=oval;endFill=0;endSize=15;', 50, 0, '', 'Provided Interface', null, 'provided interface'),
            // 提供接口 && 需求接口 组合
            this.addEntry('uml lollipop notation provided required interface', function () {
                return sb.createVertexTemplateFromData('zZRNb9swDIZ/je6O3ey+OGsvG1Cgh55Vm7G0KqJB07HTXz/KUux4bbBdNvRgQHz5IYmPTFWUx/GBdGt+YA1OFd9UURIix9VxLME5lWe2VsVe5Xkmn8rvb3g3kzdrNYHnv0koYsJJux6iEoWOzy4JhL2vIcRnqtghscEGvXbfEVsRNyL+BObzk30LGbpnFMnw0SUv+PorEQ5iGu0OpaUq1A76vXUuFRYrVfgiVseEr/BsazapSvcKXJkUHA8JdQOre7OmBtK97963YopKfXgAPALTWUIInGZ7WpfSXTSbOW5OfUQrFfNsTBvFDmfnaG7X+R32VEFKWUDI4uoMizTh+RhV/n9RoWz0DtIKQroakJVbAD21urK+Sc6I4oZzYb35NDT/Nb67P+OTBNt24dcYjGUIPQueQabDGpN2tvGyrqQZQEHoWqhCXw52DPx3B2FWokNx7j16mH+p30SCzr7pl+kEAUV7ATZXf1yUHSFrvorWzuEwPZjukh86NfVuu1PbfXiFPTvrZV/v4xE3M/ETEMN4c3LdAHxJSKSGNCOClP5EA7YxvNY+egErmgs6MZcBHElfz+df',
                    40, 10, 'Lollipop Notation');
            }),
            // port
            this.createVertexTemplateEntry('fontStyle=0;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;spacingLeft=2;', 30, 30, 'port1', 'Port', null, null, 'port'),
            // 端口和需求接口
            this.addEntry(dt + 'port required interface lollipop notation', function () {
                var cell1 = new mxCell('', new mxGeometry(0, 0, 30, 30), 'html=1;rounded=0;');
                cell1.vertex = true;
                var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;html=1;rounded=0;align=center;verticalAlign=top;endFill=0;labelBackgroundColor=none;endSize=2;');
                edge1.geometry.relative = true;
                edge1.edge = true;
                cell1.insertEdge(edge1, true);
                var cell2 = new mxCell('', new mxGeometry(55, 10, 5, 10), 'shape=requiredInterface;html=1;fontSize=11;align=center;fillColor=none;points=[];aspect=fixed;resizable=0;verticalAlign=bottom;labelPosition=center;verticalLabelPosition=top;flipH=1;');
                cell2.vertex = true;
                cell2.insertEdge(edge1, false);
                return sb.createEdgeTemplateFromCells([cell1, edge1, cell2], 60, 30, 'Port with required interface');
            }),
            // 端口和提供接口
            this.addEntry(dt + 'port provided interface lollipop notation', function () {
                var cell1 = new mxCell('', new mxGeometry(0, 0, 30, 30), 'html=1;rounded=0;');
                cell1.vertex = true;
                var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;html=1;rounded=0;align=center;verticalAlign=top;endFill=0;labelBackgroundColor=none;endSize=2;');
                edge1.geometry.relative = true;
                edge1.edge = true;
                cell1.insertEdge(edge1, true);
                var cell2 = new mxCell('', new mxGeometry(52, 11, 8, 8), 'ellipse;html=1;fontSize=11;align=center;fillColor=none;points=[];aspect=fixed;resizable=0;verticalAlign=bottom;labelPosition=center;verticalLabelPosition=top;flipH=1;');
                cell2.vertex = true;
                cell2.insertEdge(edge1, false);

                return sb.createEdgeTemplateFromCells([cell1, edge1, cell2], 60, 30, 'Port with provided interface');
            }),
            // 关联
            this.createEdgeTemplateEntry('endArrow=none;startArrow=none;endFill=0;startFill=0;endSize=8;html=1;verticalAlign=bottom;labelBackgroundColor=none;strokeWidth=3;', 160, 0, '', '关联 (Association)'),
            // 依赖
            this.addEntry('dependency', function () {
                var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=open;html=1;rounded=0;align=center;verticalAlign=bottom;dashed=1;endFill=0;labelBackgroundColor=none;');
                edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
                edge.geometry.setTerminalPoint(new mxPoint(160, 0), false);
                edge.geometry.relative = true;
                edge.edge = true;

                return sb.createEdgeTemplateFromCells([edge], 160, 0, '依赖 (Dependency)');
            }),
            // 实现
            this.createEdgeTemplateEntry('endArrow=block;dashed=1;endFill=0;endSize=12;html=1;', 160, 0, '', '实现 (Implementation)', null, 'uml realization implementation'),
            // 注释
            this.createVertexTemplateEntry('shape=note2;boundedLbl=1;whiteSpace=wrap;html=1;size=25;verticalAlign=top;align=center;', 120, 60, 'Comment', 'Comment', null, null, 'uml comment note')
        ]
        this.addPalette('HESDSLogic', '逻辑视图', expand || false, mxUtils.bind(this, function (content) {
            for (var i = 0; i < fns.length; i++) {
                content.appendChild(fns[i](content));
            }
        }));
    };
})();
