(function () {
    Sidebar.prototype.addHESDSModelingPalette = function () {
        this.setCurrentSearchEntryLibrary();
        this.addModelingPalette(false);
        this.setCurrentSearchEntryLibrary();
    }

    // Adds PhysicalView shapes
    Sidebar.prototype.addModelingPalette = function (expand) {
        var sb = this;
        var dt = 'uml ';
        var fns = [
            this.addEntry(dt + 'package', function () {
                var cell1 = new mxCell('Package', new mxGeometry(0, 0, 150, 100),
                    'shape=folder;fontStyle=1;tabWidth=110;tabHeight=30;tabPosition=left;html=1;boundedLbl=1;labelInHeader=1;container=1;collapsible=0;whiteSpace=wrap;type=hesds-dv;');
                cell1.vertex = true;
                return sb.createVertexTemplateFromCells([cell1], cell1.geometry.width, cell1.geometry.height, 'Package');
            }),
            this.createEdgeTemplateEntry('html=1;verticalAlign=bottom;labelBackgroundColor=none;endArrow=block;endFill=1;type=one-way;', 160, 0, '', 'dependence', null, 'dependence'),
            this.createEdgeTemplateEntry('html=1;verticalAlign=bottom;labelBackgroundColor=none;endArrow=block;endFill=1;startArrow=block;startFill=1;type=two-way;', 160, 0, '', 'bidirectional dependency', null, 'bidirectional dependency'),
        ]
        this.addPalette('HESDSModeling', '设计验证建模', expand || false, mxUtils.bind(this, function (content) {
            for (var i = 0; i < fns.length; i++) {
                content.appendChild(fns[i](content));
            }
        }));
    };
})();
