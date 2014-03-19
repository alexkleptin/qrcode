//---------------------------------------------------------------------
// QR code plugin to SVG-edit
// It allows to add and update QR code elements
// In order to add new QR code element it is necessary to click on new button in left bar and
//   to click in the editable area, then enter the text which will be encoded in QR code
// User can edit encoded text in any time using text field in top bar
// This text field is visible if only one QR code element is selected at the moment
//---------------------------------------------------------------------
svgEditor.addExtension("QR code", function (S) {

    var defaultQrcode = {
        text: "qrcode",
        width: 200,
        height: 200,
    };

    var qrcodeMode = "qrcode";


    // element which is creating between mouseDown and mouseUp events
	var creatingElement;

    // current selected QR code element
	var selElement = null;

    var qrcodeRender = QRCode.render();

    // update QR code element to new text
    var updateQrcode = function(elem, text) {
        var width = elem.getAttribute('width');
        var height = elem.getAttribute('height');

        // rerender new image
        svgedit.utilities.setHref(elem,
            qrcodeRender.toImageData(text, width, height));

        updateText(elem, text);
    };

    // update text of QR code element which is stored in metadata
    // (currently metadata is id attribute of internal svg 'g' element)
    var updateText = function (elem, text) {
        $('g', $(elem)).attr('id', text);
    };

    // get text of QR code element
    var getText = function (elem) {
        return $('g', $(elem)).attr('id');
    };

    return {
        name: "QR Code for Id Card Editor",

        svgicons: "extensions/qrcode-icon.xml",

        buttons: [{
            // Must match the icon ID in qrcode-icon.xml
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
                    svgCanvas.setMode(qrcodeMode);
                }
            }
        }],

        context_tools: [{
            // text field in top bar which allowas to edit QR code text

            type: "input",
            panel: "qrcode_panel",
            title: "Change QR code text",
            id: "qrcode_text",
            label: "QR code text",
            size: 20,
            events: {
                change: function() {
                    updateQrcode(selElement, this.value);
                    //S.call("changed", [selElement]);
                }
            }
        }],

        // This is triggered when the main mouse button is pressed down 
        // on the editor canvas (not the tool panels)
        mouseDown: function (opts) {
            // Check the mode on mousedown
            if (svgCanvas.getMode() == qrcodeMode) {

                var zoom = svgCanvas.getZoom();

                // Get the actual coordinate by dividing by the zoom value
                var x = opts.start_x / zoom;
                var y = opts.start_y / zoom;

                // change id from "svg" to "qrcode" in order to recognize QR code element
                var id = S.getNextId();
                var idNumber = id.substr(4);
                id = "qrcode_" + idNumber;

                creatingElement = S.addSvgElementFromJson({
                    "element": "image",
                    "attr": {
                        "x": x,
                        "y": y,
                        "id": id,
                        "width": defaultQrcode.width,
                        "height": defaultQrcode.height,
                        "style": "pointer-events:inherit",
                    }
                });

                svgedit.utilities.setHref(creatingElement,
                    qrcodeRender.toImageData("", defaultQrcode.width, defaultQrcode.height));

                $(creatingElement).click(function (e) { e.preventDefault(); });

                // add group element as a metadata
                // custom attributes are not saved but <g id='...text...'> is saved
                var g = S.svgroot.parentNode.ownerDocument.createElementNS(svgedit.NS.SVG, "g");
                g.id = "";
                creatingElement.appendChild(g);

                // The returned object must include "started" with 
                // a value of true in order for mouseUp to be triggered
                return { started: true };
            }
        },

        // This is triggered from anywhere, but "started" must have been set
        // to true (see above). Note that "opts" is an object with event info
        mouseUp: function (opts) {
            // Check the mode on mouseup
            if (svgCanvas.getMode() == qrcodeMode) {
                var zoom = svgCanvas.getZoom();

                // ask text of QR code
                $.prompt("Please enter the text which should be encoded in QR code", defaultQrcode.text, function (text) {
                    if (text) {
                        updateQrcode(creatingElement, text);
                        $('input', $('#qrcode_panel')).val(text);
                    }
                });
                
                // select new QR code element
                svgCanvas.addToSelection([creatingElement], true);
                
                return {
                    keep: true,
                    element: creatingElement
                };
            }
        },

        selectedChanged: function (opts) {

            // check is currently selected single element QR code
            var isQrcode = !!(opts.selectedElement && opts.selectedElement.getAttribute('id').substr(0, 6) == 'qrcode');

            // show or hide context panel in top bar
            $('#qrcode_panel').toggle(isQrcode);
            selElement = isQrcode ? opts.selectedElement : null;

            if (isQrcode) {
                // hide default image panel (because QR code now is image)
                $('#image_panel').hide();

                // update text in context panel
                $('input', $('#qrcode_panel')).val(getText(opts.selectedElement));
            }
        },

        elementChanged: function (opts) {
            for (var i = 0; i < opts.elems.length; i++) {
                var elem = opts.elems[i];
                // check is currently changing element QR code
                if (elem && elem.getAttribute('id').substr(0, 6) == 'qrcode') {
                    // re-render image
                    var text = getText(elem);
                    updateQrcode(elem, text);
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
