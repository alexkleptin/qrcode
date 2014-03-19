//---------------------------------------------------------------------
// It renders QR code to canvas, svg and image
// It's only a wrapper over the QRCode library by Kazuhiko Arase http://www.d-project.com/
//---------------------------------------------------------------------
if (QRCode === undefined) var QRCode = {};

(function() {

    var svgNamespace = 'http://www.w3.org/2000/svg';

    QRCode.render = function(options) {

        options	= $.extend( {}, {
            typeNumber	: -1,
            correctLevel	: QRErrorCorrectLevel.H,
            background      : "#ffffff",
            foreground      : "#000000"
        }, options);

        function toCanvas(text, width, height) {

            var qrcode = new QRCode(options.typeNumber, options.correctLevel);
            qrcode.addData(text);
            qrcode.make();

            // create canvas element
            var canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext('2d');

            // compute tileW/tileH based on options.width/options.height
            var tileW = width / qrcode.getModuleCount();
            var tileH = height / qrcode.getModuleCount();

            // draw in the canvas
            for (var row = 0; row < qrcode.getModuleCount() ; row++) {
                for (var col = 0; col < qrcode.getModuleCount() ; col++) {
                    ctx.fillStyle = qrcode.isDark(row, col) ? options.foreground : options.background;
                    var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
                    var h = (Math.ceil((row + 1) * tileH) - Math.floor(row * tileH));
                    ctx.fillRect(Math.round(col * tileW), Math.round(row * tileH), w, h);
                }
            }
            // return just built canvas
            return canvas;
        }

        function toImageData(text, width, height) {
            // convert canvas to image and return it
            return toCanvas(text, width, height).toDataURL();
        }

        function toSvg(text, x, y, width, height) {

            var qrcode = new QRCode(options.typeNumber, options.correctLevel);
            qrcode.addData(text);
            qrcode.make();

            // create svg group root element
            var group = document.createElementNS(svgNamespace, 'g');

            // compute tileS percentage
            var tileW = width / qrcode.getModuleCount();
            var tileH = height / qrcode.getModuleCount();

            // draw in the svg
            for (var row = 0; row < qrcode.getModuleCount() ; row++) {
                for (var col = 0; col < qrcode.getModuleCount() ; col++) {
                    var xt = Math.round(col * tileW);
                    var yt = Math.round(row * tileH);

                    var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
                    var h = (Math.ceil((row + 1) * tileH) - Math.floor(row * tileH));

                    var shape = document.createElementNS(svgNamespace, 'rect');
                    shape.x = x + xt;
                    shape.y = y + yt;
                    shape.width = w;
                    shape.height = h;
                    shape.opacity = 1;
                    shape.fill = qrcode.isDark(row, col) ? options.foreground : options.background;

                    group.appendChild(shape);
                }
            }

            // return just built svg
            return group;
        }

        return {
            toCanvas: toCanvas,
            toImageData: toImageData,
            toSvg: toSvg,
        };
    };
})();