import { Component, OnInit, Input } from '@angular/core';
import { SafeStyle } from '@angular/platform-browser';
import { Palcolour } from '../palette-model/palcolour';
import { ColourRange } from '../palette-model/colour-range';
import { Rgbcolour } from '../palette-model/rgb';
import { KeyboardService } from '../keyboard.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PaletteOperationService, IPaletteUpdate } from '../palette-operation.service';
import { PaletteSelectionService } from '../palette-selection.service';

@Component({
  selector: 'app-palette-view',
  templateUrl: './palette-view.component.html',
  styleUrls: ['./palette-view.component.css']
})
export class PaletteViewComponent implements OnInit {

  private keyState: {[key: string]: boolean};
  @Input() multiple: boolean;
  public palColours: Palcolour[];
  private selectionRange: ColourRange;

  public lockSelection: boolean;
  public showNumbers: boolean;
  public showConflicts: boolean;
  public get selInterval() {
    return this.palSel.interval.toString(10);
  }
  public set selInterval(value: string) {
    let n = Number.parseInt(value, 10);
    n = Math.max(n, 0);
    this.palSel.interval = n;
  }
  public get palColumns(): SafeStyle {
    const numColumns = Math.round(Math.sqrt(this.palOp.getLength()));
    const style = `repeat(${numColumns}, 1fr)`;
    return this.sanitizer.bypassSecurityTrustStyle(style);
  }

  constructor(
    private keyboard: KeyboardService,
    private sanitizer: DomSanitizer,
    private palOp: PaletteOperationService,
    private palSel: PaletteSelectionService) {
    }

  selectPalColour(colourIndex: number) {
    if (!this.multiple) {
      this.keyState = {};
    }
    this.selectionRange = this.palSel.select(colourIndex, this.keyState);
    this.updatePalColours();
  }

  selectAll() {
    this.selectionRange = this.palSel.selectAll();
    this.updatePalColours();
  }

  getStyles(colour: Palcolour) {
    const styles = Rgbcolour.getStyles(colour.rgb);
    return styles;
  }

  private updatePalColours() {
    const palLen = this.palOp.getLength();
    if (this.palColours.length !== palLen) {
      this.palColours = new Array(palLen);
    }
    for (let i = 0; i < palLen; i++) {
      this.palColours[i] = this.getPalColour(i);
    }
  }

  private getPalColour(index: number): Palcolour {
    const rgb = this.palOp.colourAt(index);
    const selected = this.selectionRange != null ? this.selectionRange.contains(index) !== -1 : false;
    const conflicts = this.palOp.getDuplicates(index);
    return {index, rgb, selected, conflicts};
  }

  ngOnInit() {
    this.keyState = {};
    this.lockSelection = false;
    this.showNumbers = true;
    this.palColours = [];
    this.keyboard.observeKeyboard(['Shift', 'Control']).subscribe((press) => {
      this.keyState[press.key] = press.state;
    });
    this.palOp.palChangeObv.subscribe((ud: IPaletteUpdate) => {
      if (ud.new && !this.lockSelection) {
        this.palSel.selectionRange = null;
        this.selectionRange = null;
      }
      this.updatePalColours();
    });
    document.addEventListener('visibilitychange', () => { // Fired when user switches tabs
      // Clear keyState
      this.keyState = {};
    });
  }
}
