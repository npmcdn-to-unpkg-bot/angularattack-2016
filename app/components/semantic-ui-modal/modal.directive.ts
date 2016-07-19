declare var $:any;

import {Directive, ElementRef, Input} from '@angular/core';
@Directive({
  selector: '[ui-modal]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseclick)': 'onMouseLeave()',
    '(click)':      'onClick()'
  }
})
export class uiSemanticModal {
  @Input('options') options:any

  constructor(private el: ElementRef){

  }

  onMouseEnter(){

  }

  onMouseLeave(){

  }

  onClick(){
    var selector = '.ui.modal'
    if(this.options == undefined){
        this.options = {selector: '.ui.modal'}
    }
    else{
      if(this.options.selector == undefined){
        this.options.selector = '.ui.modal'
      }
    }
    $(this.options.selector)
      .modal(this.options)
      .modal('show')
  }

}
