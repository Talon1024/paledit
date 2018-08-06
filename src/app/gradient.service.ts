import { Injectable } from '@angular/core';
import { ColourRange } from './palette-model/colour-range';
import { Rgbcolour } from './palette-model/rgb';
import { Gradient, GradientStop } from './gradient-model/gradient';

@Injectable()
export class GradientService {

  constructor() {
    console.log('Constructing a new GradientService...');
    this._gradient = new Gradient([
      new GradientStop(0, {red: 0, green: 0, blue: 0}),
      new GradientStop(1, {red: 255, green: 255, blue: 255})
    ]);
  }

  private _gradient: Gradient;
  get gradient() { return this._gradient; }

  addStopAt(stopIdx: number) {
    const stopCount = this._gradient.stops.length;
    let otherStopIdx = stopIdx + 1;
    let newStopIdx = otherStopIdx;
    if (otherStopIdx >= stopCount) {
      otherStopIdx = stopIdx - 1;
      newStopIdx = stopIdx;
    }

    const newPos = (this._gradient.stops[stopIdx].position + this._gradient.stops[otherStopIdx].position) / 2;
    const newColour = Rgbcolour.blend(this._gradient.stops[stopIdx].colour,
      0.5, this._gradient.stops[otherStopIdx].colour, Rgbcolour.tint);
    const newStop = new GradientStop(newPos, newColour);
    this._gradient.addStop(newStop);
    return newStopIdx;
  }

  removeStopAt(stopIdx: number): number {
    const stopCount = this._gradient.stops.length;
    if (stopCount <= 2) { return; }

    this._gradient.stops.splice(stopIdx, 1);
    this._gradient.stops.sort((a, b) => {
      return a.position - b.position;
    });

    if (stopIdx === stopCount - 1) {
      stopIdx -= 1;
    }

    return stopIdx;
  }

  stopColour(stopIdx: number) {
    return this._gradient.stops[stopIdx].colour;
  }

  setStopColour(stopIdx: number, colour: string) {
    this._gradient.stops[stopIdx].colour = Rgbcolour.fromHex(colour);
  }

  stopPos(stopIdx: number) {
    return this._gradient.stops[stopIdx].position;
  }

  setStopPos(stopIdx: number, pos: number) {
    const colour = this._gradient.stops[stopIdx].colour;
    this._gradient.stops[stopIdx].position = pos;
    this._gradient.stops.sort((a, b) => {
      return a.position - b.position;
    });
    return this._gradient.stops.findIndex((s) => s.colour === colour);
  }

  stopCount(): number {
    return this._gradient.stops.length;
  }
}
