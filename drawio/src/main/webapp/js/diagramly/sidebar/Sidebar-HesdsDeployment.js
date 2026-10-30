(function () {
    Sidebar.prototype.addHESDSDeploymentPalette = function () {
        this.setCurrentSearchEntryLibrary();
        this.addDeploymentPalette(false);
        this.setCurrentSearchEntryLibrary();
    }

    // Adds PhysicalView shapes
    Sidebar.prototype.addDeploymentPalette = function (expand) {
        var sb = this;
        var dt = 'uml ';
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
            // Artifact
            this.createVertexTemplateEntry('html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.application;appType=artifact;archiType=square;',
                150, 75, 'Artifact', 'Artifact', null, null, this.getTagsForStencil('mxgraph.archimate3', '', 'archimate technology artifact').join(' ')),
            // interface
            this.createVertexTemplateEntry('shape=ellipse;html=1;verticalLabelPosition=bottom;sketch=0;labelPosition=center;spacingBottom=-10;', 10, 10, 'Interface', 'Interface', null, null, 'uml interface lollipop notation'),
            // node
            this.createVertexTemplateEntry('verticalAlign=top;align=left;spacingTop=8;spacingLeft=2;spacingRight=12;shape=cube;size=10;direction=south;fontStyle=4;html=1;whiteSpace=wrap;container=1;dropTarget=1;collapsible=1;recursiveResize=1;',
                180, 120, 'note', 'note', null, null, dt + 'note container'),
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
        ]
        this.addPalette('HESDSPhysics', '物理视图', expand || false, mxUtils.bind(this, function (content) {
            for (var i = 0; i < fns.length; i++) {
                content.appendChild(fns[i](content));
            }
        }));
    };
})();
