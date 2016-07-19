import {Component} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import {PhaserComponent}  from '../../components/phaser/phaser'
import {fullscreenBtn} from '../../components/fullscreenBtn/fullscreenBtn';
import {uiSemanticModal} from '../../components/semantic-ui-modal/modal.directive';

// declare
declare var $:any;
declare var _root:any;
declare var THREE:any;
declare var Phaser:any;
declare var __threeJS:any;
declare var __phaser:any;


@Component({
    selector: 'my-app',
    templateUrl: './app/components/my-app/main.html',
    directives: [
    CORE_DIRECTIVES,
    PhaserComponent,
    fullscreenBtn,
    uiSemanticModal
  	],
    styles: [`
      #app-container{
        width: 1200px;
      }

      #game-container{
        position: absolute;
        margin-left: 200px;
        margin-top: 80px;
        width: 800px;
        height: 500px;
        overflow: hidden;
        border: 5px solid black;
        border-radius: 20px;
        -webkit-transform: rotateX( 18deg);
        transform: rotateX(18deg);
      }

      .cabinet-top{
        width: 100%;
        height: 300px;
        margin-top: 10px;
        background-color: white
      }

      .cabinet-top-image{
         position: absolute;
         width: 1228px;
         height: 300px;
         z-index: 1;
         pointer-events: none
      }

      .cabinet-screen-top-left{
        width: 50%;
        height: 300px;
        opacity: 1;
        pointer-events: none;
      }

      .cabinet-screen-top-left img{
         width: 614px;
         height: 300px;
      }

      .cabinet-screen-top-right{
        width: 50%;
        height: 300px;
        opacity: 1;
        pointer-events: none;
      }

      .cabinet-screen-top-right img{
         width: 614px;
         height: 300px
      }

      .cabinet-screen-bottom-left{
        width: 50%;
        height: 350px;
        opacity: 1;
        pointer-events: none;
      }

      .cabinet-screen-bottom-left img{
         width: 614px;
         height: 360px;
         margin-left: -0px
      }

      .cabinet-screen-bottom-right{
        width: 50%;
        height: 350px;
        opacity: 1;
      }
      .cabinet-screen-bottom-right img{
         width: 614px;
         height: 360px;
         margin-left: -0px
      }

      .cabinet-bottom{
        width: 100%;
        height: 600px;
      }

      .cabinet-bottom img{
         width: 1228px; auto;
         margin-left: -0px
      }

      .game-panel-0{
         position: relative;
         left: 55px;
         top: 50px;
         z-index: 0;
         width: 310px;
         height: 200px;
         cursor: pointer;
      }

      .game-panel-1{
         position: relative;
         left: 495px;
         top: -170px;
         z-index: 0;
         width: 220px;
         height: 220px;
         cursor: pointer;
      }

      .game-panel-2{
         position: relative;
         left: 736px;
         top: -380px;
         z-index: 0;
         width: 220px;
         height: 220px;
         cursor: pointer;
      }

      .game-panel-3{
         position: relative;
         left: 955px;
         top: -590px;
         z-index: 0
         width: 220px;
         height: 220px;
         cursor: pointer;
      }

      .logo-container{
         position: relative;
         bottom: 0;
         left: 900;
         width: auto;
         height: 200px;
         margin-top: -320px;
         -ms-transform: rotate(20deg);
         -webkit-transform: rotate(20deg);
         transform: rotate(20deg);
      }

      .logo-container img{
         width: 200px; height: auto
      }

      .boxart{
         width: 220px;
         height: 220px;
      }

      .active-game-selection{
        opacity: .8;
      }
      .inactive-game-selection{
        opacity: .5;
      }

      #cabinet-screen{
        width: 1228px;
        perspective: 1000px;
      }

      #cabinet-backdrop{
         position: absolute;
         left: 150;
         width: 900px;
         height: 900px;
         z-index: -1;
         background-color: rgba(0, 0, 0, .9)
      }

      #cabinet-screen-cover{
        position: absolute;
        margin-left: 190px;
        margin-top: 55px;
        width: 820px;
        height: 505px;
        overflow: hidden;
        padding: 0px;
        background-color: rgba(0, 150, 0, .08);
        border-radius: 20px;
        -webkit-transform: rotateX(18deg);
        transform: rotateX(18deg);
        pointer-events: none;
      }

      #cabinet-screen-glass{
        position: absolute;
        margin-left: 190px;
        margin-top: 55px;
        width: 820px;
        height: 505px;
        overflow: hidden;
        padding: 0px;
        background: url("assets/game/images/glass.jpg");
        background-size: 800px 505px;
        background-repeat: no-repeat;
        -webkit-filter: blur(20px);
        filter: blur(20px);
        opacity: .35;
        border-radius: 200px;
        -webkit-transform: rotateX(18deg);
        transform: rotateX(18deg);
        pointer-events: none;
      }

      #cabinet-screen-scanlines{
        position: absolute;
        margin-left: 190px;
        margin-top: 55px;
        width: 820px;
        height: 505px;
        overflow: hidden;
        padding: 0px;
        background: url("assets/game/images/scanlines.jpg");
        background-size: 820px 555px;
        background-repeat: no-repeat;
        opacity: .2;
         border-radius: 20px;
        -webkit-transform: rotateX(18deg);
        transform: rotateX(18deg);
        pointer-events: none;
      }

      #game-container{
        position: absolute;
        margin-left: 200px;
        margin-top: 60px;
        width: 800px;
        height: 500px;
        background-color: gray;
        overflow: hidden;
        padding: 0px;


        -webkit-transform: rotateX( 20deg);
        transform: rotateX(20deg);

      }

    `],
})
export class AppComponent {


   //--------------
   public needed = [false, false]
   public container:any = {phaser: null};
   public gameObj:any = null;
   public currentlySelected:number = 0;
   //--------------


     //--------------
     checkComplete(){
       var t = this;
       var count = 0;
       for(var i = 0; i < this.needed.length; ++i){
           if(this.needed[i]){
             count++;
           }
       }
       if(count == this.needed.length){
           this.startGame();
       }
     }
     //--------------

   //---------------
 	ngOnInit(){
     var t = this;

     var js = document.createElement("script");
         js.type = "text/javascript";
         js.src = '/games/menuselect.js';
         document.body.appendChild(js);
         js.onload = function(){
             t.needed[0] = true;
             t.checkComplete();
         }


        $.backstretch("assets/images/bg.png");

 	}
   //---------------

   //---------------
   startGame(){
     var t = this;
     __phaser.game.init(t.container.phaser, t);
   }
   //---------------

   //---------------
   phaserData1(phaser:any){
     this.container.phaser = phaser.container;
     this.needed[1] = true;
     this.checkComplete();
   }
   //---------------

   updateSelected(id:number){
      this.currentlySelected = id;
   }

   //---------------
   loadGame(id:number){
      var t = this;
      var js = document.createElement("script");
         js.type = "text/javascript";

      if(id == 0){
          js.src = '/games/menuselect.js';
          this.currentlySelected = 0
      }
      if(id == 1){
         js.src = '/games/angularattack_1.js';
         this.currentlySelected = 1
      }
      if(id == 2){
         js.src = '/games/debugger_panic.js';
         this.currentlySelected = 2
      }
      if(id == 3){
         js.src = '/games/game_blank_miranda.js';
         this.currentlySelected = 3
      }

      if(id == 9){
         js.src = '/games/angularattack_2.js';
         this.currentlySelected = 1
      }

      console.log(js.src)

     __phaser.destroyGame(function(){
         document.body.appendChild(js);
         js.onload = function(){
           __phaser.game.init(t.container.phaser, t);
         }
     });

   }
   //---------------

}
