// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { TextTransformerComponent } from './features/text-tools/components/text-transformer/text-transformer.component';

export const routes: Routes = [
  { path: '', redirectTo: 'text-transformer', pathMatch: 'full' },
  { path: 'text-transformer', component: TextTransformerComponent },
  // Agrega más rutas aquí según las nuevas funcionalidades
];
