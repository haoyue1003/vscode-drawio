(function () {
    Sidebar.prototype.addHESDSClassPalette = function () {
        this.setCurrentSearchEntryLibrary();
        this.addClassPalette(false);
        this.setCurrentSearchEntryLibrary();
    }

    // Adds PhysicalView shapes
    Sidebar.prototype.addClassPalette = function (expand) {
        var sb = this;
        var dt = 'uml ';
        // 定义类的属性字段样式
        var field = new mxCell('+ field: type', new mxGeometry(0, 0, 100, 26), 'text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;html=1;type=hesds-classfield;');
        // 作为独立节点
        field.vertex = true;

        var method_ = new mxCell('+ method(type): type', new mxGeometry(0, 0, 100, 26), 'text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;html=1;type=hesds-classmethod;');
        // 作为独立节点
        method_.vertex = true;

        // 分割线
        var divider = new mxCell('', new mxGeometry(0, 0, 40, 8), 'line;strokeWidth=1;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=3;spacingRight=3;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;strokeColor=inherit;');
        // 作为独立节点
        divider.vertex = true;
        var s = 'image;aspect=fixed;perimeter=ellipsePerimeter;html=1;align=center;shadow=0;dashed=0;spacingTop=3;image=img/lib/active_directory/';
        var gn = 'ms active directory ';
        var dt = 'ibm';
        var d = 50;

        var fns = [
            // 类
            this.addEntry(dt + 'object instance', function () {
                var cell = new mxCell('Classname', new mxGeometry(0, 0, 160, 90),
                    'swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=26;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;whiteSpace=wrap;html=1;type=hesds-classname;');
                cell.vertex = true;
                cell.insert(field.clone());
                cell.insert(divider.clone());
                cell.insert(method_.clone());
                return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, '类 (Class)');
            }),
            // 接口
            this.addEntry(dt + 'object instance', function () {
                var cell = new mxCell('<p style="margin:0px;margin-top:4px;text-align:center;">' +
                    '<i>&lt;&lt;Interface&gt;&gt;</i><br/><b>name</b></p>' +
                    '<hr size="1"/><p style="margin:0px;margin-left:4px;">+ field1: Type<br/>' +
                    '+ field2: Type</p>' +
                    '<hr size="1"/><p style="margin:0px;margin-left:4px;">' +
                    '+ method1(Type): Type<br/>' +
                    '+ method2(Type, Type): Type</p>', new mxGeometry(0, 0, 190, 140),
                    'verticalAlign=top;align=left;overflow=fill;fontSize=12;fontFamily=Helvetica;html=1;whiteSpace=wrap;');
                cell.vertex = true;
                return sb.createVertexTemplateFromCells([cell.clone()], cell.geometry.width, cell.geometry.height, '接口 (Interface)');
            }),
            // 接口
            this.createVertexTemplateEntry('html=1;whiteSpace=wrap;', 110, 50, '&laquo;interface&raquo;<br><b>Name</b>', '简易接口 (Interface)', null, null, dt + 'interface object instance annotated annotation'),
            // 枚举
            this.addEntry(dt + 'enumeration', function () {
                var cell1 = new mxCell('&lt;&lt;Enum&gt;&gt<br><b>name</b>', new mxGeometry(0, 0, 140, 70),
                    'swimlane;fontStyle=0;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=40;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;html=1;whiteSpace=wrap;');
                cell1.vertex = true;
                var field1 = new mxCell('literal1',
                    new mxGeometry(0, 0, 140, 30), 'text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;');
                field1.vertex = true;
                cell1.insert(field1);

                return sb.createVertexTemplateFromCells([cell1], cell1.geometry.width, cell1.geometry.height, '枚举 (Enumeration)');
            }),
            this.addEntry(dt + 'package', function()
			{
		 		var cell1 = new mxCell('Package', new mxGeometry(0, 0, 150, 100),
		 			'shape=folder;fontStyle=1;tabWidth=110;tabHeight=30;tabPosition=left;html=1;boundedLbl=1;labelInHeader=1;container=1;collapsible=0;whiteSpace=wrap;');
				cell1.vertex = true;
				return sb.createVertexTemplateFromCells([cell1], cell1.geometry.width, cell1.geometry.height, 'Package'); 
			}),
            // 关联
            this.createEdgeTemplateEntry('endArrow=none;startArrow=none;endFill=0;startFill=0;endSize=8;html=1;verticalAlign=bottom;labelBackgroundColor=none;strokeWidth=3;', 160, 0, '', '关联 (Association)'),
            // 具有方向性的关联
            this.createEdgeTemplateEntry('endArrow=open;startArrow=none;endFill=0;startFill=0;endSize=8;html=1;verticalAlign=bottom;labelBackgroundColor=none;strokeWidth=1;', 160, 0, '', '单向关联 (Association)'),
            // 双向关联
            this.createEdgeTemplateEntry('endArrow=block;startArrow=block;endFill=1;startFill=1;html=1;', 160, 0, '', '双向关联 (Association)', null, 'uml association'),
            // 终止
            this.createEdgeTemplateEntry('endArrow=open;startArrow=cross;endFill=0;startFill=0;endSize=8;startSize=10;html=1;', 160, 0, '', '终止 (Terminate)', null, 'uml terminate'),
            // 泛化
            this.createEdgeTemplateEntry('endArrow=block;endSize=16;endFill=0;html=1;', 160, 0, 'Extends', '泛化 (Generalization)', null, 'uml generalization extend'),
            // 聚合
            this.addEntry('uml aggregation', function () {
                var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=open;html=1;endSize=12;startArrow=diamondThin;startSize=14;startFill=0;edgeStyle=orthogonalEdgeStyle;align=left;verticalAlign=bottom;');
                edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
                edge.geometry.setTerminalPoint(new mxPoint(160, 0), false);
                edge.geometry.relative = true;
                edge.geometry.x = -1;
                edge.geometry.y = 3;
                edge.edge = true;
                return sb.createEdgeTemplateFromCells([edge], 160, 0, '聚合 (Aggregation)');
            }),
            // 聚合
            this.createEdgeTemplateEntry('endArrow=diamondThin;endFill=0;endSize=24;html=1;', 160, 0, '', '聚合2 (Aggregation)', null, 'uml aggregation'),
            // 组合
            this.addEntry('uml composition', function () {
                var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=open;html=1;endSize=12;startArrow=diamondThin;startSize=14;startFill=1;edgeStyle=orthogonalEdgeStyle;align=left;verticalAlign=bottom;');
                edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
                edge.geometry.setTerminalPoint(new mxPoint(160, 0), false);
                edge.geometry.relative = true;
                edge.geometry.x = -1;
                edge.geometry.y = 3;
                edge.edge = true;

                return sb.createEdgeTemplateFromCells([edge], 160, 0, '组合 (Composition)');
            }),
            // 组合
            this.createEdgeTemplateEntry('endArrow=diamondThin;endFill=1;endSize=24;html=1;', 160, 0, '', '组合2 (Composition)', null, 'uml composition'),
            // 依赖
            this.addEntry('dependency', function () {
                var edge = new mxCell('&lt;&lt;keyword&gt;&gt;', new mxGeometry(0, 0, 0, 0), 'endArrow=open;html=1;rounded=0;align=center;verticalAlign=bottom;dashed=1;endFill=0;labelBackgroundColor=none;');
                edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
                edge.geometry.setTerminalPoint(new mxPoint(160, 0), false);
                edge.geometry.relative = true;
                edge.edge = true;
                var cell1 = new mxCell('Dependency', new mxGeometry(0, 0, 0, 0), 'resizable=0;html=1;align=center;verticalAlign=top;labelBackgroundColor=none;');
                cell1.geometry.relative = true;
                cell1.setConnectable(false);
                cell1.vertex = true;
                edge.insert(cell1);

                return sb.createEdgeTemplateFromCells([edge], 160, 0, '依赖 (Dependency)');
            }),
            // 实现
            this.createEdgeTemplateEntry('endArrow=block;dashed=1;endFill=0;endSize=12;html=1;', 160, 0, '', '实现 (Implementation)', null, 'uml realization implementation'),
            // 内部类
            this.createEdgeTemplateEntry('endArrow=open;startArrow=circlePlus;endFill=0;startFill=0;endSize=8;html=1;', 160, 0, '', 'Inner Class', null, 'uml inner class'),
            // 接口
            this.createVertexTemplateEntry(s + 'interface.svg;',
                d, d * 0.47, '', '接口 (Interface)', false, null, this.getTagsForStencil('', 'active', 'threat modeling').join(' ')),
            // 注释
            this.createVertexTemplateEntry('shape=note;strokeWidth=2;fontSize=14;size=20;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;fontColor=#666600;', 
                100 * 1.1, 100 * 0.8, 'Note', '注释 (Note)', null, null, this.getTagsForStencil('', 'note', 'threat modeling').join(' ')),
           
            this.createEdgeTemplateEntry('endArrow=none;dashed=1;html=1;', 40, 0, '', 'Dashed Line', null, 'dashed undirected no')
        ]
        this.addPalette('HESDSDeployment', '开发视图', expand || false, mxUtils.bind(this, function (content) {
            for (var i = 0; i < fns.length; i++) {
                content.appendChild(fns[i](content));
            }
        }));
    };
})();
