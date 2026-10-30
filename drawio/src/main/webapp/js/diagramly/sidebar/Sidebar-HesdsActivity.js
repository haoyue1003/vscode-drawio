(function () {
    Sidebar.prototype.addHESDSActivityPalette = function () {
        this.setCurrentSearchEntryLibrary();
        this.addActivityPalette(false);
        this.setCurrentSearchEntryLibrary();
    }

    // Adds PhysicalView shapes
    Sidebar.prototype.addActivityPalette = function (expand) {
        var sb = this;
        var dt = 'uml ';
        var s = 'html=1;shape=mxgraph.sysml.';
        var fns = [
            // 初始状态
            this.createVertexTemplateEntry('ellipse;fillColor=strokeColor;html=1;', 30, 30,
                '', 'Initial preudostate / node', null, null, dt + 'initial pseudostate'),
            // 终止状态
            this.createVertexTemplateEntry('ellipse;html=1;shape=endState;fillColor=strokeColor;', 30, 30,
                '', 'Final state / node', null, null, dt + 'final state'),
            // Flow Final Node
            this.createVertexTemplateEntry('shape=sumEllipse;perimeter=ellipsePerimeter;html=1;backgroundOutline=1;', 30, 30,
                '', 'Exit Point / Flow Final Node', null, null, dt + 'exit point pseudostate'),
            // 活动
            this.addEntry('uml activity state', function () {
                var cell = new mxCell('Activity', new mxGeometry(0, 0, 120, 40),
                    'rounded=1;whiteSpace=wrap;html=1;arcSize=40;');
                cell.vertex = true;

                var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=orthogonalEdgeStyle;html=1;verticalAlign=bottom;endArrow=open;endSize=8');
                edge.geometry.setTerminalPoint(new mxPoint(60, 100), false);
                edge.geometry.relative = true;
                edge.edge = true;

                cell.insertEdge(edge, true);

                return sb.createVertexTemplateFromCells([cell, edge], 120, 100, 'Activity');
            }),
            // 选择/合并节点/决策节点
            this.createVertexTemplateEntry('rhombus;', 30, 30,
                '', 'Choice / Merge Node / Decision Node', null, null, dt + 'choice pseudostate merge decision node'),
            this.addDataEntry(dt + 'decision node', 200, 80, 'Decision Node',
                '7ZXJboMwEIafxneWpOo1kDSXVoqUJzBhBFaNB5kh29PXYIclTVS6ST30gDTzz+JhPpBZGBfHteZl/oIpSBauWBhrRLJWcYxBShZ4ImXhkgWBZx4WPN2J+m3UK7kGRVMKAluw57IGq1ihopN0QpXzsjF1jkVSVyyMcirMoEvfmHvQJHZcPvME5AYrQQKViSVIhMUgYSFFpgo7FWFpIu5kE4fj3elbyY2+BiyA9MmkuIJH+3Leyboz5x5ESvlYykFkOY01Xlk/6/r2izKG29XtvYUf7w3SDLbOBZngYdULwxW2MWPnqMUZFXETiHizrmbpduzxGof7BZUutG4bKFRNa421SqGZ0zOebMBEfPeatXqMEnWfWxHXdKnHEtRF24pzM7cfdKCa1xlhqrDWOxh9RhPIaZCcxH7c6hYJV7pBYTp2xH3vCp4ZNgNyWVf8umMnIZ29RzqPsprrlM2X36Z7ATiRpWPxGZam+q9SC7zxj/rwaxDntyCCrOCf4VcZ/jQz4/b3m00fXn9v'),
            // 时间事件触发器
            this.createVertexTemplateEntry('shape=collate;html=1;', 40, 40,
                '', 'Time Event Trigger', null, null, dt + 'time event trigger'),
            // 输入端口
            this.createVertexTemplateEntry('shape=mxgraph.uml25.inputPin;html=1;points=[[0,0.5],[1,0.5]];', 30, 30, '', 'Input Pin', null, null, 'input pin'),
            // 输出端口
            this.createVertexTemplateEntry('shape=mxgraph.uml25.inputPin;html=1;points=[[0,0.5],[1,0.5]];flipH=1;', 30, 30, '', 'Output Pin', null, null, 'output pin'),
            // 发送信号动作
            this.createVertexTemplateEntry(s + 'sendSigAct;strokeWidth=2;whiteSpace=wrap;align=center;',
                100, 40, 'Signal', 'Send Signal Action', null, null, this.getTagsForStencil('', 'sendSigAct', 'sysml activity' + 'send signal action').join(' ')),
            // 接受事件动作
            this.createVertexTemplateEntry(s + 'accEvent;strokeWidth=2;whiteSpace=wrap;align=center;',
                100, 40, 'Event', 'Accept Event Action', null, null, this.getTagsForStencil('', 'accEvent', 'sysml activity' + 'accept event action').join(' ')),
            // 泳道容器
            this.addDataEntry('container swimlane pool horizontal', 360, 480, 'Vertical Pool (垂直)',
                'xZTRbsIgFIafhsstcKC11zrnjSYmewJiT4SMiqE42z39aMGZabss2bJekHD+n//A+S4gfFE1KyePamNLNIQvCV84a33cVc0CjSFAdUn4EwGgYRF4HnFZ79KjdHjwPwlADLxJc8KobK01Uax9a5JYn3Vl5CFU853SplzL1p66C2ovd6+Xau6w1u+4vdzObqSNbIJKgxpizr8EI9TQCcpXJiXSi9B5bEan6qU00gpthd614UgKiMdMzMSMZ7QocpELhg+MxyZnXXoVT/E8sqEK9V6lxqJIoqyjsP/sfsUYNonkMFV+R3XdwQPKviP7aygwDKVNLr0jwGCIQP4HBMQYAZiCQHMz7hREsjEifEIiIP6PSCiv/1rvffn2PgA='),
            this.addDataEntry('container swimlane pool horizontal', 480, 360, 'Horizontal Pool (水平)',
                'zZRRb8IgEMc/De/06MyerZsvmpj4CYi9CBkUA6itn360UE1da5ZlW3wg4f53f477hUBYoeul5QexNiUqwt4IK6wxPu50XaBSBKgsCVsQABoWgfeJbNZl6YFbrPx3DBANJ66OGJWNMSqKzjcqie4steJViOY7IVW54o05tg2c57uPPppbdPKCm757dieteR1UGlRhrLyYynOVhHCO9dtQGWIYVmzbFr3Pa5UOThdH67GeHL6T0uRLNBq9bULJWZZexIr8NQKiAuVeJBubJZG7KOyv3hvLsEk4x9GyL2hXLUGg2SO8D0D8kAGMM0iG9D4GSGYjSDL4BST5FBJ4RiTN3eT/guhlChF7YkSQ/yGiEN7+wy43+C4/AQ=='),
            // 泳道
            this.createVertexTemplateEntry('swimlane;startSize=20;whiteSpace=wrap;html=1;', 120, 320, 'Lane', 'Vertical Swimlane (垂直)', null, null, 'swimlane lane pool'),
            this.createVertexTemplateEntry('swimlane;startSize=20;horizontal=0;html=1;whiteSpace=wrap;', 320, 120, 'Lane', 'Horizontal Swimlane (水平)', null, null, 'swimlane lane pool'),
            // 分支/合并节点
            this.addEntry('uml activity fork join', function () {
                var cell = new mxCell('', new mxGeometry(0, 0, 200, 10), 'shape=line;html=1;strokeWidth=6;');
                cell.vertex = true;

                var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=orthogonalEdgeStyle;html=1;verticalAlign=bottom;endArrow=open;endSize=8;');
                edge.geometry.setTerminalPoint(new mxPoint(100, 80), false);
                edge.geometry.relative = true;
                edge.edge = true;

                cell.insertEdge(edge, true);

                return sb.createVertexTemplateFromCells([cell, edge], 200, 80, 'Fork/Join');
            }),
            // 依赖(虚线)
            this.addEntry('dependency', function () {
                var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=open;html=1;rounded=0;align=center;verticalAlign=bottom;dashed=1;endFill=0;labelBackgroundColor=none;');
                edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
                edge.geometry.setTerminalPoint(new mxPoint(160, 0), false);
                edge.geometry.relative = true;
                edge.edge = true;

                return sb.createEdgeTemplateFromCells([edge], 160, 0, '依赖 (Dependency)');
            }),
            // 依赖(实线)
            this.createEdgeTemplateEntry('endArrow=open;startArrow=none;endFill=0;startFill=0;endSize=8;html=1;verticalAlign=bottom;labelBackgroundColor=none;strokeWidth=1;', 160, 0, '', '单向关联 (Association)'),
            // 注释
            this.createVertexTemplateEntry('shape=note2;boundedLbl=1;whiteSpace=wrap;html=1;size=25;verticalAlign=top;align=center;', 120, 60, 'Comment', '注释', null, null, 'uml comment note')
        ]
        this.addPalette('HESDSActivity', '活动视图', expand || false, mxUtils.bind(this, function (content) {
            for (var i = 0; i < fns.length; i++) {
                content.appendChild(fns[i](content));
            }
        }));
    };
})();
