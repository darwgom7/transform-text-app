import { Routes } from '@angular/router';
import { TextTransformerComponent } from './features/text-tools/components/text-transformer/text-transformer.component';
import { CsvTransformerComponent } from './features/csv-tools/components/csv-transformer/csv-transformer.component';

export const routes: Routes = [
  { path: '', redirectTo: 'text-transformer', pathMatch: 'full' },
  { path: 'text-transformer', component: TextTransformerComponent },
  { path: 'csv-transformer', component: CsvTransformerComponent },
];
