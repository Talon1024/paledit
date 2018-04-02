import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GradientEditorComponent } from './gradient-editor.component';

describe('GradientEditorComponent', () => {
  let component: GradientEditorComponent;
  let fixture: ComponentFixture<GradientEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GradientEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GradientEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
