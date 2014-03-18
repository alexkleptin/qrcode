svgEditor.addExtension("QR code", function (S) {
    var NS = svgedit.NS,
		Utils = svgedit.utilities,
		svgcontent = S.svgcontent,
		addElem = S.addSvgElementFromJson,
		selElems,
		editingforeign = false,
		svgdoc = S.svgroot.parentNode.ownerDocument,
		started,
		newFO;

    var selElement = null;

    var updateQrcode = function (elem, text) {
        /*
        var $canvas = $('canvas', $(elem));
        var canvas = $canvas[0];
        if ($canvas.length == 0) {
            canvas = document.createElement('canvas');
            canvas.setAttributeNS(NS.XMLNS, 'xmlns', NS.HTML);
            elem.appendChild(canvas);
        }

        canvas.width = elem.getAttribute('width');
        canvas.height = elem.getAttribute('height');

        var qrcode = new QRCode(-1, QRErrorCorrectLevel.H);
        qrcode.addData(elem.getAttribute('font-size'));
        qrcode.make();

        var ctx = canvas.getContext('2d');

        // compute tileW/tileH based on options.width/options.height
        var tileW = parseFloat(elem.getAttribute('width')) / qrcode.getModuleCount();
        var tileH = parseFloat(elem.getAttribute('height')) / qrcode.getModuleCount();

        // draw in the canvas
        for (var row = 0; row < qrcode.getModuleCount() ; row++) {
            for (var col = 0; col < qrcode.getModuleCount() ; col++) {
                ctx.fillStyle = qrcode.isDark(row, col) ? "#000" : "#fff";
                var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
                var h = (Math.ceil((row + 1) * tileH) - Math.floor(row * tileH));
                ctx.fillRect(Math.round(col * tileW), Math.round(row * tileH), w, h);
            }
        }
        */

        var canvas = document.createElement('canvas');
        canvas.setAttributeNS(NS.XMLNS, 'xmlns', NS.HTML);

        canvas.width = elem.getAttribute('width');
        canvas.height = elem.getAttribute('height');

        var qrcode = new QRCode(-1, QRErrorCorrectLevel.H);
        qrcode.addData(text);
        qrcode.make();

        var ctx = canvas.getContext('2d');

        // compute tileW/tileH based on options.width/options.height
        var tileW = parseFloat(elem.getAttribute('width')) / qrcode.getModuleCount();
        var tileH = parseFloat(elem.getAttribute('height')) / qrcode.getModuleCount();

        // draw in the canvas
        for (var row = 0; row < qrcode.getModuleCount() ; row++) {
            for (var col = 0; col < qrcode.getModuleCount() ; col++) {
                ctx.fillStyle = qrcode.isDark(row, col) ? "#000" : "#fff";
                var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
                var h = (Math.ceil((row + 1) * tileH) - Math.floor(row * tileH));
                ctx.fillRect(Math.round(col * tileW), Math.round(row * tileH), w, h);
            }
        }

        svgedit.utilities.setHref(elem, canvas.toDataURL());
    }

    return {
        name: "QR Code for Id Card Editor",
        // For more notes on how to make an icon file, see the source of
        // the hellorworld-icon.xml
        svgicons: "extensions/qrcode-icon.xml",

        // Multiple buttons can be added in this array
        buttons: [{
            // Must match the icon ID in helloworld-icon.xml
            id: "qrcode",

            // This indicates that the button will be added to the "mode"
            // button panel on the left side
            type: "mode",

            // Tooltip text
            title: "Create QR code",

            // Events
            events: {
                'click': function () {
                    // The action taken when the button is clicked on.
                    // For "mode" buttons, any other button will 
                    // automatically be de-pressed.
                    svgCanvas.setMode("qrcode");
                }
            }
        }],
        context_tools: [{
            type: "input",
            panel: "qrcode_panel",
            title: "Change QR code text",
            id: "qrcode_text",
            label: "QR code text",
            size: 10,
            events: {
                change: function() {
                    updateQrcode(selElement, this.value);
                    //S.call("changed", selElems);
                }
            }
        }],
        // This is triggered when the main mouse button is pressed down 
        // on the editor canvas (not the tool panels)
        mouseDown: function (opts) {
            // Check the mode on mousedown
            if (svgCanvas.getMode() == "qrcode") {

                var zoom = svgCanvas.getZoom();

                // Get the actual coordinate by dividing by the zoom value
                var x = opts.start_x / zoom;
                var y = opts.start_y / zoom;
                /*
                var newImage = S.addSvgElementFromJson({
                    "element": "image",
                    "attr": {
                        "x": x,
                        "y": y,
                        "width": 0,
                        "height": 0,
                        "id": S.getNextId(),
                        "opacity": 1,
                        "style": "pointer-events:inherit",
                        "xlink:href": "image/circle.png"
                    }
                });
                */
                //setHref(newImage, last_good_img_url);
                //preventClickDefault(newImage);

                // The returned object must include "started" with 
                // a value of true in order for mouseUp to be triggered
                return { started: true };
            }
        },

        // This is triggered from anywhere, but "started" must have been set
        // to true (see above). Note that "opts" is an object with event info
        mouseUp: function (opts) {
            // Check the mode on mouseup
            if (svgCanvas.getMode() == "qrcode") {
                var zoom = svgCanvas.getZoom();

                // Get the actual coordinate by dividing by the zoom value
                var x = opts.mouse_x / zoom;
                var y = opts.mouse_y / zoom;

                $.prompt("Please enter the text which should be encoded in QR code", "qrcode", function (text) {
                    if (text) {
                        /*
                        var qrCodeGroup = S.addSvgElementFromJson({
                            "element": "svg",
                            "attr": {
                                //"x": 0,
                                //"y": 0,
                                //"width": 200,
                                //"height": 200,
                                "id": S.getNextId(),
                                "opacity": 1,
                                "style": "pointer-events:inherit"
                            }
                        });

                        var svg = S.svgroot.parentNode.ownerDocument.createElementNS(NS.SVG, "svg");
                        //qrCodeGroup.appendChild(svg);

                       */
                        var qrcode = new QRCode(-1, QRErrorCorrectLevel.H);
                        qrcode.addData(text);
                        qrcode.make();
                        /*
                        // compute tileS percentage
                        var tileW = 200 / qrcode.getModuleCount();
                        var tileH = 200 / qrcode.getModuleCount();
                        
                        // draw in the table
                        for (var row = 0; row < qrcode.getModuleCount() ; row++) {
                            for (var col = 0; col < qrcode.getModuleCount() ; col++) {
                                var xt = Math.round(col * tileW);
                                var yt = Math.round(row * tileH);

                                var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
                                var h = (Math.ceil((row + 1) * tileH) - Math.floor(row * tileH));

                                var shape = S.svgroot.parentNode.ownerDocument.createElementNS(NS.SVG, "rect");
                                svgedit.utilities.assignAttributes(shape,
                                {
                                    "x": x +xt,
                                    "y": y +yt,
                                    width: w,
                                    height: h,
                                    fill: qrcode.isDark(row, col) ? "rgb(0, 0, 0)" : "rgb(255,255,255)",
                                    stroke: "none",
                                    "opacity": 1,
                                    "style": "pointer-events:inherit"
                                }, 100);

                                qrCodeGroup.appendChild(shape);
                            }
                        }
                        */
                        
                        // create canvas element
                        var canvas = document.createElement('canvas');
                        canvas.setAttributeNS(NS.XMLNS, 'xmlns', NS.HTML);
                        canvas.width = 200;
                        canvas.height = 200;
                        var ctx = canvas.getContext('2d');

                        // compute tileW/tileH based on options.width/options.height
                        var tileW = 200 / qrcode.getModuleCount();
                        var tileH = 200 / qrcode.getModuleCount();

                        // draw in the canvas
                        for (var row = 0; row < qrcode.getModuleCount() ; row++) {
                            for (var col = 0; col < qrcode.getModuleCount() ; col++) {
                                ctx.fillStyle = qrcode.isDark(row, col) ? "#000" : "#fff";
                                var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
                                var h = (Math.ceil((row + 1) * tileH) - Math.floor(row * tileH));
                                ctx.fillRect(Math.round(col * tileW), Math.round(row * tileH), w, h);
                            }
                        }

                        //alert(canvas.toDataURL());
                        //qrCodeGroup.appendChild(canvas);
                        /*
                        newFO = S.addSvgElementFromJson({
                            "element": "foreignObject",
                            "attr": {
                                "x": x,
                                "y": y,
                                "id": S.getNextId(),
                                "font-size": text,
                                "width": "200",
                                "height": "200",
                                "style": "pointer-events:inherit",
                                "type": "qrcode",
                                "text": text,
                            }
                        });

                        newFO.appendChild(canvas);
                        */

                        newFO = S.addSvgElementFromJson({
                            "element": "image",
                            "attr": {
                                "x": x,
                                "y": y,
                                "id": S.getNextId(),
                                "font-size": text,
                                "width": "200",
                                "height": "200",
                                "style": "pointer-events:inherit",
                                "type": "qrcode",
                                "text": text,
                            }
                        });

                        svgedit.utilities.setHref(newFO, canvas.toDataURL());

                        svgCanvas.addToSelection([newFO], true);
                        
                        return {
                            keep: true,
                            element: newFO
                        };
                        
                    }

                });


                //preventClickDefault(newImage);

                // Show the text using the custom alert function
                //$.alert(text);
            }
        },
        selectedChanged: function (opts) {
            // Use this to update the current selected elements
            var isQrcode = opts.selectedElement && opts.selectedElement.getAttribute('font-size') == 'qrcode';
            $('#qrcode_panel').toggle(isQrcode);
            selElement = isQrcode ? opts.selectedElement : null;
            if (isQrcode)
                $('#image_panel').hide();
        },
        elementChanged: function (opts) {
            for (var i = 0; i < opts.elems.length; i++) {
                var elem = opts.elems[i];
                if (elem && elem.getAttribute('font-size') == 'qrcode') {
                    var text = elem.getAttribute('font-size');
                    /*
                    var $canvas = $('canvas', $(elem));
                    var canvas = $canvas[0];
                    if ($canvas.length == 0) {
                        canvas = document.createElement('canvas');
                        canvas.setAttributeNS(NS.XMLNS, 'xmlns', NS.HTML);
                        elem.appendChild(canvas);
                    }

                    canvas.width = elem.getAttribute('width');
                    canvas.height = elem.getAttribute('height');

                    var qrcode = new QRCode(-1, QRErrorCorrectLevel.H);
                    qrcode.addData(elem.getAttribute('font-size'));
                    qrcode.make();

                    var ctx = canvas.getContext('2d');

                    // compute tileW/tileH based on options.width/options.height
                    var tileW = parseFloat(elem.getAttribute('width')) / qrcode.getModuleCount();
                    var tileH = parseFloat(elem.getAttribute('height')) / qrcode.getModuleCount();

                    // draw in the canvas
                    for (var row = 0; row < qrcode.getModuleCount() ; row++) {
                        for (var col = 0; col < qrcode.getModuleCount() ; col++) {
                            ctx.fillStyle = qrcode.isDark(row, col) ? "#000" : "#fff";
                            var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
                            var h = (Math.ceil((row + 1) * tileH) - Math.floor(row * tileH));
                            ctx.fillRect(Math.round(col * tileW), Math.round(row * tileH), w, h);
                        }
                    }
                    */

                    var canvas = document.createElement('canvas');
                    canvas.setAttributeNS(NS.XMLNS, 'xmlns', NS.HTML);

                    canvas.width = elem.getAttribute('width');
                    canvas.height = elem.getAttribute('height');

                    var qrcode = new QRCode(-1, QRErrorCorrectLevel.H);
                    qrcode.addData(text);
                    qrcode.make();

                    var ctx = canvas.getContext('2d');

                    // compute tileW/tileH based on options.width/options.height
                    var tileW = parseFloat(elem.getAttribute('width')) / qrcode.getModuleCount();
                    var tileH = parseFloat(elem.getAttribute('height')) / qrcode.getModuleCount();

                    // draw in the canvas
                    for (var row = 0; row < qrcode.getModuleCount() ; row++) {
                        for (var col = 0; col < qrcode.getModuleCount() ; col++) {
                            ctx.fillStyle = qrcode.isDark(row, col) ? "#000" : "#fff";
                            var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
                            var h = (Math.ceil((row + 1) * tileH) - Math.floor(row * tileH));
                            ctx.fillRect(Math.round(col * tileW), Math.round(row * tileH), w, h);
                        }
                    }

                    svgedit.utilities.setHref(elem, canvas.toDataURL());
                }
            }

            if (selElement) 
                $('#image_panel').hide();

        },
        callback: function() {
            $('#qrcode_panel').hide();
        }

    };

});
