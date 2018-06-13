import { Rgbcolour } from './rgb';
import { Palette } from './palette';

export class Palcolour extends Rgbcolour {
  index: number;
  palette: Palette;
  selected = false;
}
