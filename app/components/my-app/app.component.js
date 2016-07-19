"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var phaser_1 = require('../../components/phaser/phaser');
var fullscreenBtn_1 = require('../../components/fullscreenBtn/fullscreenBtn');
var modal_directive_1 = require('../../components/semantic-ui-modal/modal.directive');
var AppComponent = (function () {
    function AppComponent() {
        //--------------
        this.needed = [false, false];
        this.container = { phaser: null };
        this.gameObj = null;
        this.currentlySelected = 0;
    }
    //--------------
    //--------------
    AppComponent.prototype.checkComplete = function () {
        var t = this;
        var count = 0;
        for (var i = 0; i < this.needed.length; ++i) {
            if (this.needed[i]) {
                count++;
            }
        }
        if (count == this.needed.length) {
            this.startGame();
        }
    };
    //--------------
    //---------------
    AppComponent.prototype.ngOnInit = function () {
        var t = this;
        var js = document.createElement("script");
        js.type = "text/javascript";
        js.src = '/games/menuselect.js';
        document.body.appendChild(js);
        js.onload = function () {
            t.needed[0] = true;
            t.checkComplete();
        };
        $.backstretch("assets/images/bg.png");
    };
    //---------------
    //---------------
    AppComponent.prototype.startGame = function () {
        var t = this;
        __phaser.game.init(t.container.phaser, t);
    };
    //---------------
    //---------------
    AppComponent.prototype.phaserData1 = function (phaser) {
        this.container.phaser = phaser.container;
        this.needed[1] = true;
        this.checkComplete();
    };
    //---------------
    AppComponent.prototype.updateSelected = function (id) {
        this.currentlySelected = id;
    };
    //---------------
    AppComponent.prototype.loadGame = function (id) {
        var t = this;
        var js = document.createElement("script");
        js.type = "text/javascript";
        if (id == 0) {
            js.src = '/games/menuselect.js';
            this.currentlySelected = 0;
        }
        if (id == 1) {
            js.src = '/games/angularattack_1.js';
            this.currentlySelected = 1;
        }
        if (id == 2) {
            js.src = '/games/debugger_panic.js';
            this.currentlySelected = 2;
        }
        if (id == 3) {
            js.src = '/games/game_blank_miranda.js';
            this.currentlySelected = 3;
        }
        if (id == 9) {
            js.src = '/games/angularattack_2.js';
            this.currentlySelected = 1;
        }
        console.log(js.src);
        __phaser.destroyGame(function () {
            document.body.appendChild(js);
            js.onload = function () {
                __phaser.game.init(t.container.phaser, t);
            };
        });
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            templateUrl: './app/components/my-app/main.html',
            directives: [
                common_1.CORE_DIRECTIVES,
                phaser_1.PhaserComponent,
                fullscreenBtn_1.fullscreenBtn,
                modal_directive_1.uiSemanticModal
            ],
            styles: ["\n      #app-container{\n        width: 1200px;\n      }\n\n      #game-container{\n        position: absolute;\n        margin-left: 200px;\n        margin-top: 80px;\n        width: 800px;\n        height: 500px;\n        overflow: hidden;\n        border: 5px solid black;\n        border-radius: 20px;\n        -webkit-transform: rotateX( 18deg);\n        transform: rotateX(18deg);\n      }\n\n      .cabinet-top{\n        width: 100%;\n        height: 300px;\n        margin-top: 10px;\n        background-color: white\n      }\n\n      .cabinet-top-image{\n         position: absolute;\n         width: 1228px;\n         height: 300px;\n         z-index: 1;\n         pointer-events: none\n      }\n\n      .cabinet-screen-top-left{\n        width: 50%;\n        height: 300px;\n        opacity: 1;\n        pointer-events: none;\n      }\n\n      .cabinet-screen-top-left img{\n         width: 614px;\n         height: 300px;\n      }\n\n      .cabinet-screen-top-right{\n        width: 50%;\n        height: 300px;\n        opacity: 1;\n        pointer-events: none;\n      }\n\n      .cabinet-screen-top-right img{\n         width: 614px;\n         height: 300px\n      }\n\n      .cabinet-screen-bottom-left{\n        width: 50%;\n        height: 350px;\n        opacity: 1;\n        pointer-events: none;\n      }\n\n      .cabinet-screen-bottom-left img{\n         width: 614px;\n         height: 360px;\n         margin-left: -0px\n      }\n\n      .cabinet-screen-bottom-right{\n        width: 50%;\n        height: 350px;\n        opacity: 1;\n      }\n      .cabinet-screen-bottom-right img{\n         width: 614px;\n         height: 360px;\n         margin-left: -0px\n      }\n\n      .cabinet-bottom{\n        width: 100%;\n        height: 600px;\n      }\n\n      .cabinet-bottom img{\n         width: 1228px; auto;\n         margin-left: -0px\n      }\n\n      .game-panel-0{\n         position: relative;\n         left: 55px;\n         top: 50px;\n         z-index: 0;\n         width: 310px;\n         height: 200px;\n         cursor: pointer;\n      }\n\n      .game-panel-1{\n         position: relative;\n         left: 495px;\n         top: -170px;\n         z-index: 0;\n         width: 220px;\n         height: 220px;\n         cursor: pointer;\n      }\n\n      .game-panel-2{\n         position: relative;\n         left: 736px;\n         top: -380px;\n         z-index: 0;\n         width: 220px;\n         height: 220px;\n         cursor: pointer;\n      }\n\n      .game-panel-3{\n         position: relative;\n         left: 955px;\n         top: -590px;\n         z-index: 0\n         width: 220px;\n         height: 220px;\n         cursor: pointer;\n      }\n\n      .logo-container{\n         position: relative;\n         bottom: 0;\n         left: 900;\n         width: auto;\n         height: 200px;\n         margin-top: -320px;\n         -ms-transform: rotate(20deg);\n         -webkit-transform: rotate(20deg);\n         transform: rotate(20deg);\n      }\n\n      .logo-container img{\n         width: 200px; height: auto\n      }\n\n      .boxart{\n         width: 220px;\n         height: 220px;\n      }\n\n      .active-game-selection{\n        opacity: .8;\n      }\n      .inactive-game-selection{\n        opacity: .5;\n      }\n\n      #cabinet-screen{\n        width: 1228px;\n        perspective: 1000px;\n      }\n\n      #cabinet-backdrop{\n         position: absolute;\n         left: 150;\n         width: 900px;\n         height: 900px;\n         z-index: -1;\n         background-color: rgba(0, 0, 0, .9)\n      }\n\n      #cabinet-screen-cover{\n        position: absolute;\n        margin-left: 190px;\n        margin-top: 55px;\n        width: 820px;\n        height: 505px;\n        overflow: hidden;\n        padding: 0px;\n        background-color: rgba(0, 150, 0, .08);\n        border-radius: 20px;\n        -webkit-transform: rotateX(18deg);\n        transform: rotateX(18deg);\n        pointer-events: none;\n      }\n\n      #cabinet-screen-glass{\n        position: absolute;\n        margin-left: 190px;\n        margin-top: 55px;\n        width: 820px;\n        height: 505px;\n        overflow: hidden;\n        padding: 0px;\n        background: url(\"assets/game/images/glass.jpg\");\n        background-size: 800px 505px;\n        background-repeat: no-repeat;\n        -webkit-filter: blur(20px);\n        filter: blur(20px);\n        opacity: .35;\n        border-radius: 200px;\n        -webkit-transform: rotateX(18deg);\n        transform: rotateX(18deg);\n        pointer-events: none;\n      }\n\n      #cabinet-screen-scanlines{\n        position: absolute;\n        margin-left: 190px;\n        margin-top: 55px;\n        width: 820px;\n        height: 505px;\n        overflow: hidden;\n        padding: 0px;\n        background: url(\"assets/game/images/scanlines.jpg\");\n        background-size: 820px 555px;\n        background-repeat: no-repeat;\n        opacity: .2;\n         border-radius: 20px;\n        -webkit-transform: rotateX(18deg);\n        transform: rotateX(18deg);\n        pointer-events: none;\n      }\n\n      #game-container{\n        position: absolute;\n        margin-left: 200px;\n        margin-top: 60px;\n        width: 800px;\n        height: 500px;\n        background-color: gray;\n        overflow: hidden;\n        padding: 0px;\n\n\n        -webkit-transform: rotateX( 20deg);\n        transform: rotateX(20deg);\n\n      }\n\n    "],
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map