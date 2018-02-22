import { Rgbcolour } from './rgb';
import { Palette } from './palette';

export class Palcolour extends Rgbcolour {
  index:number;
  palette:Palette;

  getStyles():Object {
    let rgbStyles = super.getStyles();
    let gridCol = (this.index % 16) + 1;
    let gridRow = Math.floor(this.index / 16) + 1;

    rgbStyles['grid-column'] = gridCol;
    rgbStyles['grid-row'] = gridRow;
    return rgbStyles;
  }
}
