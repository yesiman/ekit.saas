import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RichtextEditorComponent } from './richtext-editor.component';

describe('GenericComponent', () => {
  let component: RichtextEditorComponent;
  let fixture: ComponentFixture<RichtextEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RichtextEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RichtextEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
