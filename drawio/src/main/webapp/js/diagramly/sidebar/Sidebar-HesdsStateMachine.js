(function () {
    Sidebar.prototype.addHESDSStateMachinePalette = function () {
        this.setCurrentSearchEntryLibrary();
        this.addStateMachinePalette(false);
        this.setCurrentSearchEntryLibrary();
    }

    // Adds PhysicalView shapes
    Sidebar.prototype.addStateMachinePalette = function (expand) {
        var sb = this;
        var dt = 'uml ';
        var fns = [
            this.createVertexTemplateEntry('ellipse;fillColor=strokeColor;html=1;', 30, 30,
                '', 'Initial state', null, null, dt + 'initial state'),
            this.createVertexTemplateEntry('ellipse;html=1;shape=endState;fillColor=strokeColor;', 30, 30,
                '', 'Final state', null, null, dt + 'final state'),
            this.createVertexTemplateEntry('html=1;align=center;verticalAlign=top;rounded=1;absoluteArcSize=1;arcSize=10;dashed=0;whiteSpace=wrap;container=1;', 140, 40,
                'State', 'State', null, null, dt + 'state'),
            this.createVertexTemplateEntry('shape=umlState;rounded=1;verticalAlign=top;spacingTop=5;umlStateSymbol=collapseState;absoluteArcSize=1;arcSize=10;html=1;whiteSpace=wrap;', 140, 60,
                'State1', 'State', null, null, dt + 'state'),

            this.createVertexTemplateEntry('shape=ellipse;html=1;fontSize=18;align=center;',
                30, 30, 'H*', 'Deep History', null, null, this.getTagsForStencil('', '', dt + 'history deep pseudo state').join(' ')),
            this.createVertexTemplateEntry('shape=ellipse;html=1;fontSize=18;align=center;',
                30, 30, 'H', 'Shallow History', null, null, this.getTagsForStencil('', '', dt + 'history shallow pseudo state').join(' ')),

            this.createEdgeTemplateEntry('edgeStyle=none;html=1;endArrow=open;endSize=12;strokeWidth=3;verticalAlign=bottom;',
                160, 0, 'trigger', 'Transition', null, this.getTagsForStencil('', '', dt + 'transition').join(' ')),
            this.createVertexTemplateEntry('html=1;points=[];perimeter=orthogonalPerimeter;fillColor=strokeColor;', 5, 80,
                '', 'Join/Fork', null, null, dt + 'join fork pseudostate'),
            this.createVertexTemplateEntry('html=1;points=[];perimeter=orthogonalPerimeter;fillColor=strokeColor;', 80, 5,
                '', 'Join/Fork', null, null, dt + 'join fork pseudostate'),    
            this.createVertexTemplateEntry('rhombus;', 20, 20,
                    '', 'Choice', null, null, dt + 'choice pseudostate merge decision node'),
            this.createVertexTemplateEntry('shape=ellipse;html=1;fillColor=strokeColor;fontSize=18;fontColor=#ffffff;', 
                        20, 20, '', 'Junction Pseudo State', null, null, this.getTagsForStencil('', '', dt + 'junction pseudo state').join(' ')),
            this.createVertexTemplateEntry('shape=note2;boundedLbl=1;whiteSpace=wrap;html=1;size=25;verticalAlign=top;align=center;', 120, 60, 'Comment', 'Comment', null, null, 'uml comment note'),
            this.createEdgeTemplateEntry('endArrow=none;dashed=1;html=1;', 40, 0, '', 'Dashed Line', null, 'dashed undirected no')               
            ]
        this.addPalette('HESDSStateMachine', '状态机图', expand || false, mxUtils.bind(this, function (content) {
            for (var i = 0; i < fns.length; i++) {
                content.appendChild(fns[i](content));
            }
        }));
    };
})();
