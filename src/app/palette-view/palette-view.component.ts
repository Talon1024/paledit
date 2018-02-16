import { Component, OnInit } from '@angular/core';
import { Palcollection } from '../palette-model/palcollection';
import { Palette } from '../palette-model/palette';
import { Palcolour } from '../palette-model/palcolour';

@Component({
  selector: 'app-palette-view',
  templateUrl: './palette-view.component.html',
  styleUrls: ['./palette-view.component.css']
})
export class PaletteViewComponent implements OnInit {

  palCollection:Palcollection;
  curPalette:Palette;
  curPalRows:Palcolour[];

  constructor() { }

  ngOnInit() {
  }

}
