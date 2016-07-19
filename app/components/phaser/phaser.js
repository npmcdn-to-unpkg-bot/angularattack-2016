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
// core
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
//------------------------------------
var PhaserComponent = (function () {
    //--------------
    function PhaserComponent(el) {
        this.el = el;
        //--------------
        this.globals = _root.globals;
        // send data to a listener
        //this.phaser.emit({message: "Sent from child!"})
        this.phaser = new core_1.EventEmitter();
        this.selfRef = el.nativeElement;
        var t = this;
    }
    //--------------
    //--------------
    PhaserComponent.prototype.ngOnInit = function () {
        var t = this;
        // load phaser
        if ($('[src="' + t.settings.file + '"]').length == 0) {
            var js = document.createElement("script");
            js.type = "text/javascript";
            js.src = t.settings.file;
            document.body.appendChild(js);
            js.onload = function () {
                t.initPhaser();
            };
        }
        else {
            function scriptLoadedTest() {
                setTimeout(function () {
                    try {
                        var test = new Phaser.Game();
                        clearInterval(this);
                    }
                    catch (err) { }
                    finally {
                        if (test != undefined) {
                            t.initPhaser();
                        }
                        else {
                            scriptLoadedTest();
                        }
                    }
                }, 1);
            }
            var intv = scriptLoadedTest();
        }
    };
    //--------------
    //--------------
    PhaserComponent.prototype.initPhaser = function () {
        this.phaser.emit({ container: this.selfRef });
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], PhaserComponent.prototype, "phaser", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], PhaserComponent.prototype, "settings", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], PhaserComponent.prototype, "layout", void 0);
    PhaserComponent = __decorate([
        core_1.Component({
            selector: 'phaser',
            directives: [common_1.CORE_DIRECTIVES],
            template: "\n    <div></div>\n  "
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], PhaserComponent);
    return PhaserComponent;
}());
exports.PhaserComponent = PhaserComponent;
//------------------------------------
//# sourceMappingURL=phaser.js.map