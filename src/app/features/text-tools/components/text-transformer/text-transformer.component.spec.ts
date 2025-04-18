import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextTransformerComponent } from './text-transformer.component';

describe('TextTransformerComponent', () => {
  let component: TextTransformerComponent;
  let fixture: ComponentFixture<TextTransformerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextTransformerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextTransformerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
