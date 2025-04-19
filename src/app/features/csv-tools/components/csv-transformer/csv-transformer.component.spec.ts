import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvTransformerComponent } from './csv-transformer.component';

describe('CsvToolComponent', () => {
  let component: CsvTransformerComponent;
  let fixture: ComponentFixture<CsvTransformerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CsvTransformerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsvTransformerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
