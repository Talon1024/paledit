import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainEditorViewComponent } from './main-editor-view.component';

describe('MainEditorViewComponent', () => {
  let component: MainEditorViewComponent;
  let fixture: ComponentFixture<MainEditorViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainEditorViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainEditorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
