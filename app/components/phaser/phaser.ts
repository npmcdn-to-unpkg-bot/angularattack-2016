// core
import {Component, Input, Output, EventEmitter, ElementRef} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';


declare var $:any;
declare var Object:any;
declare var _root:any;
declare var Phaser:any;
//------------------------------------
@Component({
  selector: 'phaser',
  directives: [CORE_DIRECTIVES],
  template: `
    <div></div>
  `
})
export class PhaserComponent {

  //--------------
  public globals = _root.globals;
  public self:any;
  public selfRef:any;


  // send data to a listener
  //this.phaser.emit({message: "Sent from child!"})
  @Output() phaser = new EventEmitter();
  @Input() settings:any;
  @Input() layout:any;

   //--------------
   constructor(private el: ElementRef) {
      this.selfRef = el.nativeElement;
      var t = this;
   }
   //--------------

  //--------------
  ngOnInit(){
    var t = this;

    // load phaser
    if($('[src="' + t.settings.file + '"]').length == 0){
      var js = document.createElement("script");
          js.type = "text/javascript";
          js.src = t.settings.file;
          document.body.appendChild(js);
          js.onload = function(){
              t.initPhaser()
          }
    }
    // if phaser already exists, but needs to be checked for it to be loaded
    else{
      function scriptLoadedTest(){
        setTimeout(function(){
          try {
              var test = new Phaser.Game();
              clearInterval(this)
          }
          catch(err) {}
          finally{
              if(test != undefined){
                t.initPhaser();
              }
              else{
                scriptLoadedTest()
              }
          }
        }, 1)
      }
      var intv = scriptLoadedTest();

    }

  }
  //--------------

  //--------------
  initPhaser(){
    this.phaser.emit({container: this.selfRef})
  }
  //--------------


}
//------------------------------------
