(function () {
    Sidebar.prototype.addHESDSUseCasePalette = function () {
        this.setCurrentSearchEntryLibrary();
        this.addUseCasePalette(false);
        this.setCurrentSearchEntryLibrary();
    }

    // Adds PhysicalView shapes
    Sidebar.prototype.addUseCasePalette = function (expand) {
        var sb = this;
        var dt = 'uml ';
        var fns = [
            this.createVertexTemplateEntry('shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;', 30, 60, 'Actor', 'Actor', false, null, 'uml actor'),
            this.createVertexTemplateEntry('ellipse;whiteSpace=wrap;html=1;', 140, 70, 'Use Case', 'Use Case', null, null, 'uml use case usecase'),
            this.addEntry(dt + 'package', function()
			{
		 		var cell1 = new mxCell('Package', new mxGeometry(0, 0, 150, 100),
		 			'shape=folder;fontStyle=1;tabWidth=110;tabHeight=30;tabPosition=left;html=1;boundedLbl=1;labelInHeader=1;container=1;collapsible=0;whiteSpace=wrap;');
				cell1.vertex = true;
				return sb.createVertexTemplateFromCells([cell1], cell1.geometry.width, cell1.geometry.height, 'Package'); 
			}),
            this.createEdgeTemplateEntry('html=1;verticalAlign=bottom;labelBackgroundColor=none;endArrow=open;endFill=0;dashed=1;', 160, 0, '&lt;&lt;extend&gt;&gt;', 'Extend', null, 'extend'),
            this.createEdgeTemplateEntry('html=1;verticalAlign=bottom;labelBackgroundColor=none;endArrow=open;endFill=0;dashed=1;', 160, 0, '&lt;&lt;include&gt;&gt;', 'Include', null, 'include'),
            this.createEdgeTemplateEntry('endArrow=none;startArrow=none;endFill=0;startFill=0;endSize=8;html=1;verticalAlign=bottom;labelBackgroundColor=none;strokeWidth=3;',
                 160, 0, '', 'Association', null, 'association'),
            this.createEdgeTemplateEntry('edgeStyle=none;html=1;endArrow=block;endFill=0;endSize=12;verticalAlign=bottom;', 
					160, 0, '', 'Generalization', null, 'generalization'),
            this.createVertexTemplateEntry('shape=note2;boundedLbl=1;whiteSpace=wrap;html=1;size=25;verticalAlign=top;align=center;', 120, 60, 'Comment', 'Comment', null, null, 'uml comment note'),
            this.createEdgeTemplateEntry('endArrow=none;dashed=1;html=1;', 40, 0, '', 'Dashed Line', null, 'dashed undirected no')
        ]
        this.addPalette('HESDSUseCase', '场景视图', expand || false, mxUtils.bind(this, function (content) {
            for (var i = 0; i < fns.length; i++) {
                content.appendChild(fns[i](content));
            }
        }));
    };
})();
