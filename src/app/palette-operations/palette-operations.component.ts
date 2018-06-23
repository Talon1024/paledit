import { Component, OnInit } from '@angular/core';
import { PaletteOperationService } from '../palette-operation.service';

@Component({
  selector: 'app-palette-operations',
  templateUrl: './palette-operations.component.html',
  styleUrls: ['./palette-operations.component.css']
})
export class PaletteOperationsComponent implements OnInit {

  private curColour: string;

  constructor(private palOp: PaletteOperationService) { }

  ngOnInit() {
  }

}
