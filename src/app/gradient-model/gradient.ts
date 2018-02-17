import { Palcolour } from '../palette-model/palcolour';
import { ColourRange } from '../palette-model/colour-range';

export class GradientStop {
  position:number;
  colour:Palcolour;
}

export class Gradient {
  stops:GradientStop[];
  palRange:ColourRange;
}
