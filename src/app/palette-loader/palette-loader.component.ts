import { Component, OnInit } from '@angular/core';
import { PaletteIoService } from '../palette-io.service';
import { PalcollectionOperationService } from '../palcollection-operation.service';

@Component({
  selector: 'app-palette-loader',
  templateUrl: './palette-loader.component.html',
  styleUrls: ['./palette-loader.component.css']
})
export class PaletteLoaderComponent implements OnInit {

  constructor(private palIo: PaletteIoService,
    private colOp: PalcollectionOperationService) { }

  ngOnInit() {
  }

  private cancelEvent(e: Event) {
    e.stopPropagation();
    e.preventDefault();
  }

  handleDragEnter(e: DragEvent) {
    this.cancelEvent(e);
  }

  handleDragOver(e: DragEvent) {
    this.cancelEvent(e);
  }

  dropPalette(event: DragEvent) {
    this.cancelEvent(event);

    if (event.dataTransfer) {
      const files = event.dataTransfer.files;
      this.palIo.getPaletteFile(files[0]).subscribe((col) => {
        this.colOp.collection = col;
      });
    }
  }

  selectPalette(event: Event) {
    const targ = event.target as HTMLInputElement;
    if (targ.files && targ.files.length > 0) {
      this.palIo.getPaletteFile(targ.files[0]).subscribe((col) => {
        this.colOp.collection = col;
      });
    }
  }

}
