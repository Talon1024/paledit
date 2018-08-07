import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedColourComponent } from './selected-colour.component';

describe('SelectedColourComponent', () => {
  let component: SelectedColourComponent;
  let fixture: ComponentFixture<SelectedColourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedColourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedColourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
