import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  @Input() visible: boolean;
  @Output() visibleChange = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
    this.visible = this.visible || false;
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

}
