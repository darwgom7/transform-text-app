import { Component } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

import { FormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-text-transformer',
  imports: [
    FormsModule,
    ClipboardModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './text-transformer.component.html',
  styleUrl: './text-transformer.component.css'
})
export class TextTransformerComponent {
  inputText: string = '';
  sortOrder: 'none' | 'asc' | 'desc' = 'none';
  textFormat: 'none' | 'uppercase' | 'lowercase' | 'capitalize' = 'none';
  removeDuplicates: boolean = false;
  transformedText: string = '';

  constructor(private clipboard: Clipboard) {}

  transformText(): void {
    if (!this.inputText) {
      this.transformedText = '';
      return;
    }
  
    // 1. Get clean lines
    let lines = this.inputText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line);
  
    // 2. Apply text formatting
    lines = lines.map(line => {
      switch (this.textFormat) {
        case 'uppercase':
          return line.toUpperCase();
        case 'lowercase':
          return line.toLowerCase();
        case 'capitalize':
          return line.replace(/\b\w/g, char => char.toUpperCase());
        default:
          return line;
      }
    });
  
    // 3. Remove duplicates after formatting
    if (this.removeDuplicates) {
      lines = Array.from(new Set(lines));
    }
  
    // 4. Sort if necessary
    if (this.sortOrder === 'asc') {
      lines.sort((a, b) => a.localeCompare(b));
    } else if (this.sortOrder === 'desc') {
      lines.sort((a, b) => b.localeCompare(a));
    }
  
    // 5. Assign result
    this.transformedText = lines.join('\n');
  }
  
  // Copy the transformed text to the clipboard
  copyToClipboard(): void {
    this.clipboard.copy(this.transformedText);
  }
}
