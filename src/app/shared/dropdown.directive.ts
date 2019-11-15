import { 
  Directive, 
  HostBinding, 
  HostListener, 
  ElementRef
} from '@angular/core';

@Directive({
  selector: '[dropdownDirective]',
  exportAs: 'appDropdown'
})
export class DropdownDirective {

  @HostBinding('class.show') isOpened: boolean = false;

  // Click listener
  @HostListener('document:click', ['$event']) onClick(event: Event) {
    this.isOpened = this.elementRef.nativeElement.contains(event.target) ? !this.isOpened : false;
  }

  constructor(private elementRef: ElementRef) {}
}