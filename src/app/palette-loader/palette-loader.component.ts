import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-palette-loader',
  templateUrl: './palette-loader.component.html',
  styleUrls: ['./palette-loader.component.css']
})
export class PaletteLoaderComponent implements OnInit {

  @Output() selectPalFile = new EventEmitter<File>();

  constructor() { }

  ngOnInit() {
  }

  private cancelEvent(e:Event) {
    e.stopPropagation();
    e.preventDefault();
  }

  handleDragEnter(e:DragEvent) {
    this.cancelEvent(e);
  }

  handleDragOver(e:DragEvent) {
    this.cancelEvent(e);
  }

  dropPalette(event:DragEvent) {
    this.cancelEvent(event);

    if (event.dataTransfer) {
      let files = event.dataTransfer.files;
      this.selectPalFile.emit(files[0]);
    }
  }

  selectPalette(event:Event) {
    let targ = <HTMLInputElement>(event.target);
    if (targ.files && targ.files.length > 0) {
      this.selectPalFile.emit(targ.files[0]);
    }
  }

}
