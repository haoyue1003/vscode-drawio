(function () {
    Sidebar.prototype.addHESDSSequencePalette = function () {
        this.setCurrentSearchEntryLibrary();
        this.addSequencePalette(false);
        this.setCurrentSearchEntryLibrary();
    }

    // Adds PhysicalView shapes
    Sidebar.prototype.addSequencePalette = function (expand) {
        var sequenceEdgeStyle = 'newEdgeStyle={"curved":0,"rounded":0};';
        var activationStyle = 'html=1;points=[[0,0,0,0,5],[0,1,0,0,-5],[1,0,0,0,5],[1,1,0,0,-5]];perimeter=orthogonalPerimeter;' +
		'outlineConnect=0;targetShapes=umlLifeline;portConstraint=eastwest;' + sequenceEdgeStyle;
        var frameStyle = 'shape=umlFrame;whiteSpace=wrap;html=1;pointerEvents=0;recursiveResize=0;container=1;collapsible=0;';
        
        var sb = this;
        var dt = 'uml ';
        var fns = [
            this.addEntry(dt + 'lifeline', function()
		    {
		    	var cardCell = new mxCell('b1:Block1', new mxGeometry(0, 0, 160, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
		    	cardCell.vertex = true;
		    	var assoc1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;dashed=1;endArrow=none;align=center;verticalAlign=bottom;exitX=0.5;exitY=1;');
		    	assoc1.geometry.setTerminalPoint(new mxPoint(80, 150), false);
		    	assoc1.geometry.relative = true;
		    	assoc1.geometry.x = 1;
		    	assoc1.edge = true;
		    	cardCell.insertEdge(assoc1, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, assoc1], 160, 150, 'Lifeline');
			}),
            this.addDataEntry(dt + 'execution specification', 160, 220, 'Execution Specification',
				'vZXbbuMgEIafxpeVfMjxMod2V1pVrZSVerlizaxBxWBhUid9+oUwDiFutu1W7VXgZyYzfPPbTopVvfumScNuFQWR5CndJcU6yfNsNJrYH6fsvTJNcy9UmlMMCsKGPwOKKapbTqGNAo1SwvAmFkslJZQm0ojWqovD/igRV21IBQNhUxIxVB84Ncyrs3wa9O/AK9ZXziZzf1KTPhhv0jJCVXciFddJsdJKGb+qdysQDl7PxefdXDg9NqZBmrck/BhdbX7yeiXrB1j8Wt/xrrq9yvAeT0Rs8ca/s6RYLIUqH7FEa/Y9DXuHxi31AfWSmVrYnU1Ydowb2DSkdMed9YLViOCVtNvSdgjaClgLtIHdxVtkRzbWVKBqMHpvQ7pAP5sgUnZCvtcIDrw6pgYmdoFY3oNoPkA04ALUmga3UkmI2VDSMqC4AUkXzpchUqutpIfz1O5aQ7Q5i/D1XJGIWqu2uoR/tB5c+ipeDYIY/hQXeIklpt4rbv8xT3GOM6SPT3mRnU3DXqoCg0lnAzl28f8zyoc2HszoZCCN6+PQ2XiZjNdOAc1tE86la6UNU5WSRNwH9UPexYTpOII0R0anzn7B2LPPMnY++1JjXzDxAN8bfN2/tbyrXvXFZ7v9/NXj+x+Y/eseGrsN3xUfHr7OxfVf'),
           
            this.createVertexTemplateEntry(activationStyle, 10, 80, '', 'Activation Bar', null, null, 'uml sequence activation bar'),
            //依赖线
            this.createEdgeTemplateEntry('html=1;verticalAlign=bottom;startArrow=oval;startFill=1;endArrow=block;startSize=6;' +
                    'curved=0;rounded=0;', 80, 0, '', 'dispatch', null, 'uml sequence message call invoke dispatch'),
            this.createEdgeTemplateEntry('html=1;verticalAlign=bottom;endArrow=block;curved=0;rounded=0;',
                80, 0, 'text', 'Syn Call/Message', null, 'uml sequence message call invoke dispatch'),
            this.addEntry('uml sequence return message', function () {
                var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), 'html=1;verticalAlign=bottom;' +
                    'endArrow=open;dashed=1;endSize=8;curved=0;rounded=0;');
                edge.geometry.setTerminalPoint(new mxPoint(80, 0), true);
                edge.geometry.setTerminalPoint(new mxPoint(0, 0), false);
                edge.geometry.relative = true;
                edge.edge = true;

                return sb.createEdgeTemplateFromCells([edge], 80, 0, 'Return');
            }),
            this.createEdgeTemplateEntry('endArrow=open;endFill=1;endSize=12;html=1;', 120, 0, 'text', 'Asyn Call/Message', null, 'uml association'),  

            //条件框
            this.addEntry(dt + 'interaction', function()
			{
		 		var cell1 = new mxCell('opt', new mxGeometry(0, 0, 290, 160), frameStyle + 'width=170;');
				cell1.vertex = true;
		 		var field1 = new mxCell('[Guard]', 
		 				new mxGeometry(0, 0, 100, 20), 'text;html=1;');
		 		field1.geometry.relative = true;
		 		field1.geometry.offset = new mxPoint(20, 40);
		 		field1.vertex = true;
		 		cell1.insert(field1);
				return sb.createVertexTemplateFromCells([cell1], cell1.geometry.width, cell1.geometry.height, 'opt'); 
			}),
            this.addEntry(dt + 'interaction', function()
			{
		 		var cell1 = new mxCell('loop', new mxGeometry(0, 0, 290, 160), frameStyle + 'width=170;');
				cell1.vertex = true;
		 		var field1 = new mxCell('[Guard]', 
		 				new mxGeometry(0, 0, 100, 20), 'text;html=1;');
		 		field1.geometry.relative = true;
		 		field1.geometry.offset = new mxPoint(20, 40);
		 		field1.vertex = true;
		 		cell1.insert(field1);
				return sb.createVertexTemplateFromCells([cell1], cell1.geometry.width, cell1.geometry.height, 'loop'); 
			}),
            this.addEntry(dt + 'interaction', function()
			{
		 		var cell1 = new mxCell('alt', new mxGeometry(0, 0, 290, 250), frameStyle + 'width=170;');
				cell1.vertex = true;
		 		var field1 = new mxCell('[condition1]', 
		 				new mxGeometry(0, 0, 100, 20), 'text;html=1;');
		 		field1.geometry.relative = true;
		 		field1.geometry.offset = new mxPoint(20, 40);
		 		field1.vertex = true;
		 		cell1.insert(field1);
		 		var field2 = new mxCell('[condition2]', 
		 				new mxGeometry(0, 125, 290, 10), 'line;strokeWidth=1;dashed=1;labelPosition=center;verticalLabelPosition=bottom;align=left;verticalAlign=top;spacingLeft=20;spacingTop=15;html=1;whiteSpace=wrap;');
		 		field2.geometry.relative = false;
		 		field2.vertex = true;
		 		cell1.insert(field2);

				return sb.createVertexTemplateFromCells([cell1], cell1.geometry.width, cell1.geometry.height, 'alt'); 
			}),
            //组合
            this.addEntry('uml sequence invoke invocation call activation bar', function()
            {
                var cell = new mxCell('', new mxGeometry(0, 0, 10, 80), activationStyle);
                cell.vertex = true;
                
                var edge = new mxCell('text', new mxGeometry(0, 0, 0, 0), 'html=1;verticalAlign=bottom;startArrow=oval;endArrow=block;' +
                    'startSize=8;curved=0;rounded=0;entryX=0;entryY=0;entryDx=0;entryDy=5;');
                edge.geometry.setTerminalPoint(new mxPoint(-70, 5), true);
                edge.geometry.relative = true;
                edge.edge = true;
                
                cell.insertEdge(edge, false);
        
                return sb.createVertexTemplateFromCells([cell, edge], 10, 80, 'dispatch Message');
            }),
            this.addEntry('uml sequence invoke call delegation synchronous invocation activation bar', function () {
                var cell = new mxCell('', new mxGeometry(0, 0, 10, 80), activationStyle);
                cell.vertex = true;

                var edge1 = new mxCell('text', new mxGeometry(0, 0, 0, 0), 'html=1;verticalAlign=bottom;endArrow=block;' +
                    'curved=0;rounded=0;entryX=0;entryY=0;entryDx=0;entryDy=5;');
                edge1.geometry.setTerminalPoint(new mxPoint(-70, 5), true);
                edge1.geometry.relative = true;
                edge1.edge = true;

                cell.insertEdge(edge1, false);

                var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'html=1;verticalAlign=bottom;endArrow=open;dashed=1;' +
                    'endSize=8;curved=0;rounded=0;exitX=0;exitY=1;exitDx=0;exitDy=-5;');
                edge2.geometry.setTerminalPoint(new mxPoint(-70, 75), false);
                edge2.geometry.relative = true;
                edge2.edge = true;

                cell.insertEdge(edge2, true);

                return sb.createVertexTemplateFromCells([cell, edge1, edge2], 10, 80, 'Synchronous Invocation');
            }),
            this.addEntry('uml sequence invoke call delegation callback activation bar', function()
            {
                var cell = new mxCell('', new mxGeometry(0, 0, 10, 80), activationStyle);
                cell.vertex = true;
    
                var edge1 = new mxCell('text', new mxGeometry(0, 0, 0, 0), 'html=1;verticalAlign=bottom;endArrow=block;' +
                    'curved=0;rounded=0;entryX=1;entryY=0;entryDx=0;entryDy=5;');
                edge1.geometry.setTerminalPoint(new mxPoint(80, 5), true);
                edge1.geometry.relative = true;
                edge1.edge = true;
    
                cell.insertEdge(edge1, false);
    
                var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'html=1;verticalAlign=bottom;endArrow=open;dashed=1;' +
                    'endSize=8;curved=0;rounded=0;exitX=1;exitY=1;exitDx=0;exitDy=-5;');
                edge2.geometry.setTerminalPoint(new mxPoint(80, 75), false);
                edge2.geometry.relative = true;
                edge2.edge = true;
    
                cell.insertEdge(edge2, true);
    
                return sb.createVertexTemplateFromCells([cell, edge1, edge2], 10, 80, 'Callback');
    
            }),
            this.addEntry('uml sequence self call recursion delegation activation bar', function () {
                var cell = new mxCell('', new mxGeometry(-5, 20, 10, 40), activationStyle);
                cell.vertex = true;

                var edge = new mxCell('self call', new mxGeometry(0, 0, 0, 0), 'html=1;align=left;spacingLeft=2;endArrow=block;' +
                    'rounded=0;edgeStyle=orthogonalEdgeStyle;curved=0;rounded=0;');
                edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
                edge.geometry.points = [new mxPoint(30, 30)];
                edge.geometry.relative = true;
                edge.edge = true;

                cell.insertEdge(edge, false);

                return sb.createVertexTemplateFromCells([cell, edge], 10, 60, 'Self Call');
            }),
            this.addDataEntry(dt + 'creation event', 250, 220, 'Creation Event',
				'1Vddb9owFP01eexECOHjkY92k6ZqlZjU7Wky8W1i4cSRYyD01+8aO9+hgNpKGy/Ex9fX9j3nHoLjLeP8qyRp9CgocGc4oLnjrZwhfiYefmnkaJDJYGiAUDJqILcC1uwVLDiw6I5RyBqBSgiuWNoEA5EkEKgGRqQUh2bYi+DNXVMSQgdYB4R30WdGVWTQ6XBS4d+AhVGxszuemZmYFMH2JllEqDjUIO/e8ZZSCGWe4nwJXBevqItZ93BmtjyYhERds+D76G79k8XLJH6G+Z/VD3YIH+9G9nB7wnf2xva06liUABI615XEkUghcbxFpohUBZaIBAMXGPXAcENvNSgiamOctdxOcRSpWE+4+LgHqRiWe85ZiKlXG6GUiHGCkw3wBQm2oRS7hC4FF7LaLVNSbEtGdKJTFFC7n7kE0A65VbXckgMUL4gYlDxiyKFi2R3b6kjgRLF9MxexygrLtWW6J8Fwl+HAat4bNFdkYicDsEF1xop1eSEmu/BMHqxxCKqTBx9qN6qgkx5u0Ybb0cZSAlHQUYiCXDVpJZbOAMsNsofnmFGqly8kZOyVbE6pNHOpvs7pgv7C8Vc6106JzIjHLalv6eEFpdaC7OFxX8hvFUFhX836+2ZUU0ghkKhmAW2W6vpoUHQrH/6ow8cGDz9fcBFsu22LfpPqR3myxTo5h4gpWKck0NMH9O0+wj6gfKV++3qqXrLxp5XMv8Le0CTWdmilU6sVJVl0chXXuFjL9S7qvPQzyJn6pTX+xbej373O1eetZ9zM+Mhb1x/fTNn7DK/IMmsZV5vgT3au4t5v0V7juGs5KUiGh9CMroRUkQhFQvhThX5Ie0z9RpVmPd3S0yzTT2uWyX/XLNf+zF/TK9ZdjTQviusf7aCLidp5zryLXO5EHFbvria8+gfg3f8F'),

            this.createVertexTemplateEntry('shape=mxgraph.sysml.' + 'x;', 
		    		20, 20, '', 'Terminate Node', null, null, 'terminate node'),
            this.createVertexTemplateEntry('shape=note2;boundedLbl=1;whiteSpace=wrap;html=1;size=25;verticalAlign=top;align=center;', 120, 60, 'Comment', 'Comment', null, null, 'uml comment note'),
            this.createEdgeTemplateEntry('endArrow=none;dashed=1;html=1;', 40, 0, '', 'Dashed Line', null, 'dashed undirected no')        
        ]
        this.addPalette('HESDSSequence', '过程视图', expand || false, mxUtils.bind(this, function (content) {
            for (var i = 0; i < fns.length; i++) {
                content.appendChild(fns[i](content));
            }
        }));
    };
})();
