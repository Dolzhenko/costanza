// Copyright (c) 2020 Jarret Dyrbye
// Distributed under the MIT software license, see the accompanying
// file LICENSE or http://www.opensource.org/licenses/mit-license.php

var D = require('../utl/dom.js').DomUtl;
var I = require('../utl/icon.js').IconUtl;


class ConnectWalletScreen {
    constructor(app_div, model) {
        this.app_div = app_div;
        this.onbbackclick = null;
        this.onbeaconselect = null;
        this.ongenerateselect = null;
        this.onscanselect = null;
        this.onforgetselect = null;
        this.onconnectstoredselect = null;
        this.model = model;
    }

    ///////////////////////////////////////////////////////////////////////////
    // Buttons
    ///////////////////////////////////////////////////////////////////////////

    drawBackButton(div, back_func) {
        var b = D.button(div, back_func, "main-button");
        var flex = D.emptyDiv(b, "flex items-center justify-around");
        var icon_span = D.emptySpan(flex, "px-2");
        var back = I.backarrow2x(icon_span);
        var text = D.textSpan(flex, "Back");
    }

   drawPasteButton(div, paste_func) {
        var b = D.button(div, paste_func, "p-2 main-button");
        var flex = D.emptyDiv(b, "flex items-center justify-around");
        var icon_span = D.emptySpan(flex, "px-1");
        var back = I.paste2x(icon_span);
    }

   drawGenerateButton(div, generate_func) {
        var b = D.button(div, generate_func, "p-2 main-button");
        var flex = D.emptyDiv(b, "flex items-center justify-around");
        var icon_span = D.emptySpan(flex, "px-1");
        var back = I.magic2x(icon_span);
        var text = D.textSpan(flex, "Generate");
    }

    drawScanButton(div, scan_func) {
        var b = D.button(div, scan_func, "p-2 main-button");
        var flex = D.emptyDiv(b, "flex items-center justify-around");
        var icon_span = D.emptySpan(flex, "px-2");
        var qr = I.qrcode2x(icon_span);
        var text = D.textSpan(flex, "Scan");
    }

    drawConnectStoredButton(div, connect_func) {
        var b = D.button(div, connect_func, "p-2 main-button");
        var flex = D.emptyDiv(b, "flex items-center justify-around");
        var icon_span = D.emptySpan(flex, "px-2");
        var qr = I.bolt2x(icon_span);
        var text = D.textSpan(flex, "Connect");
    }

    drawForgetButton(div, forget_func) {
        var b = D.button(div, forget_func, "p-2 main-button");
        var flex = D.emptyDiv(b, "flex items-center justify-around");
        var icon_span = D.emptySpan(flex, "px-2");
        var qr = I.trash2x(icon_span);
        var text = D.textSpan(flex, "Forget");
    }

    pasteResult() {
        var paste_string = this.paste_input.value;
        if (this.onbeaconselect != null) {
            this.onbeaconselect(paste_string.toLowerCase());
        }
    }

    doGenerate() {
        console.log("generate.");
        if (this.ongenerateselect != null) {
            this.ongenerateselect();
        }
    }

    doScan() {
        console.log("scan.");
        if (this.onscanselect != null) {
            this.onscanselect();
        }
    }

    doForget() {
        console.log("forget.");
        if (this.onforgetselect != null) {
            this.onforgetselect();
        }
    }

    doConnectStored() {
        console.log("connect to stored.");
        if (this.onconnectstoredselect != null) {
            this.onconnectstoredselect();
        }
    }


    ///////////////////////////////////////////////////////////////////////////
    // Panels
    ///////////////////////////////////////////////////////////////////////////

    drawTitle(div) {
        var flex = D.emptyDiv(div, "flex items-center justify-around");
        D.textParagraph(flex, "Connect Wallet:",
                        "font-black text-2xl text-yellow-800");
    }

    drawDisconnected(div) {
        var flex = D.emptyDiv(div, "flex items-center justify-around");
        D.textParagraph(flex, "(disconnected)",
                        "font-black text-yellow-800 py-5");
    }

    drawTitlePanel(div) {
        var flex = D.emptyDiv(div,
                              "flex flex-wrap section-background");
        var button_flex = D.emptyDiv(flex, "flex-initial px-2");
        var title_flex = D.emptyDiv(flex, "flex-initial px-5 py-2");
        this.drawBackButton(button_flex, this.onbackclick);
        this.drawTitle(title_flex);
    }


    connectResult() {
        var paste_string = this.paste_input.value;
        console.log("paste: " + paste_string);
        this.stopScanning();
        if (this.onbeaconselect != null) {
            this.onbeaconselect(paste_string.toLowerCase());
        }
    }


    drawStored(div) {
        var flex = D.emptyDiv(div, "flex flex-col");
        D.textParagraph(flex, "Stored Wallet Beacon:",
                        "font-black text-yellow-800 py-5");

        if (! this.model.hasStoredConsumerBeacon()) {
            D.textParagraph(flex, "(none)",
                            "font-black text-yellow-800 py-5");
            return;
        }
        var beacon = this.model.getStoredConsumerBeacon();

        D.textParagraph(flex, beacon,
                        "font-black break-words text-yellow-800 py-5");

        var buttons = D.emptyDiv(flex, "flex justify-around py-4");
        this.drawConnectStoredButton(buttons,
                             (function() {this.doConnectStored()}).bind(this));
        this.drawForgetButton(buttons,
                             (function() {this.doForget()}).bind(this));

    }

    drawInterfacePanel(div) {
        var flex = D.emptyDiv(div,
                              "flex flex-col section-background");

        this.drawDisconnected(flex);

        var paste = D.emptyDiv(flex, "flex justify-center");
        this.paste_input = D.emptyInput(paste,
            "w-auto appearance-none rounded shadow " +
            "p-3 text-grey-dark mr-2 focus:outline-none");
        this.paste_input.setAttribute("placeholder", "paste beacon");
        this.drawPasteButton(paste,
                             (function() {this.pasteResult()}).bind(this));


        var buttons = D.emptyDiv(flex, "flex justify-around py-4");
        this.drawGenerateButton(buttons,
                             (function() {this.doGenerate()}).bind(this));
        this.drawScanButton(buttons,
                            (function() {this.doScan()}).bind(this));

        this.drawStored(flex);

    }

    ///////////////////////////////////////////////////////////////////////////
    // Screens
    ///////////////////////////////////////////////////////////////////////////

    drawConnecting(beacon) {
        var flex = D.emptyDiv(this.app_div, "flex flex-col h-screen");
        var flex_top = D.emptyDiv(flex, "flex-none");
        this.drawTitlePanel(flex_top);
        var flex_mid = D.emptyDiv(flex, "flex-none");
        D.textParagraph(flex_mid, "Connect To :" + beacon,
                        "font-black text-2xl text-yellow-800");
    }

    draw() {
        //console.log("path: " + QrScanner.WORKER_PATH);
        var flex = D.emptyDiv(this.app_div, "flex flex-col h-screen");
        var flex_top = D.emptyDiv(flex, "flex-none");
        this.drawTitlePanel(flex_top);

        var flex_mid = D.emptyDiv(flex, "flex-grow");
        //this.drawScanVideo(flex_mid);
        this.drawInterfacePanel(flex_mid);
        var flex_bottom = D.emptyDiv(flex, "flex-none");
    }
}

exports.ConnectWalletScreen = ConnectWalletScreen;
