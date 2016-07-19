import {Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[fullscreen-btn]',
  host: {

  }
})
export class fullscreenBtn {
  @Input('options') options:any

  constructor(private el: ElementRef){
    var t = this;

    el.nativeElement.addEventListener("click", function(){
        var el:any = null;

        if(t.options != undefined){
          el = document.getElementById(t.options.selector);
        }
        else{
          el = document.body
        }

        var rfs = el.requestFullScreen ||
                  el.webkitRequestFullScreen ||
                  el.mozRequestFullScreen;
            rfs.call(el);
    })


  }

}
