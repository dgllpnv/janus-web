import { Location } from '@angular/common';
import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[back-button]'
})
export class BackButtonDirective {

  constructor(private _location: Location) { }

  @HostListener('click')
  onClick() {              
      this._location.back();
  }

}
