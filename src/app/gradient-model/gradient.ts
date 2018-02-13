import { Palcolour } from '../palette-model/palcolour';

class GradientStop {
  position:number;
  colour:Palcolour;
}

export class Gradient {
  stops:GradientStop[];
}
