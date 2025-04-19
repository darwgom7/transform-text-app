import { Component } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';

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
    CommonModule,
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
  resultCount: number = 0;
  duplicateCount: number = 0;

  selectedRangeStart: number | null = null;
  selectedRangeEnd: number | null = null;

  private readonly STORAGE_KEY = 'text-transformer-state';

  constructor(private clipboard: Clipboard) {
    this.restoreState();
  }

  private saveState(): void {
    const state = {
      inputText: this.inputText,
      sortOrder: this.sortOrder,
      textFormat: this.textFormat,
      removeDuplicates: this.removeDuplicates,
      transformedText: this.transformedText,
      duplicateCount: this.duplicateCount
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
  }

  private restoreState(): void {
    const stateStr = localStorage.getItem(this.STORAGE_KEY);
    if (stateStr) {
      try {
        const state = JSON.parse(stateStr);
        this.inputText = state.inputText || '';
        this.sortOrder = state.sortOrder || 'none';
        this.textFormat = state.textFormat || 'none';
        this.removeDuplicates = state.removeDuplicates || false;
        this.transformedText = state.transformedText || '';
        this.resultCount = this.transformedText
          ? this.transformedText.split('\n').filter(line => line.trim()).length
          : 0;
        this.duplicateCount = state.duplicateCount || 0;
      } catch (error) {
        console.error('Error parsing state from localStorage:', error);
      }
    }
  }

  clearAll(): void {
    this.inputText = '';
    this.sortOrder = 'none';
    this.textFormat = 'none';
    this.removeDuplicates = false;
    this.transformedText = '';
    this.resultCount = 0;
    this.duplicateCount = 0;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Change transformText to accept an optional base text
  transformText(baseText?: string): void {
    const sourceText = baseText !== undefined ? baseText : this.transformedText || this.inputText;
    if (!sourceText) {
      this.transformedText = '';
      this.resultCount = 0;
      this.duplicateCount = 0;
      this.saveState();
      return;
    }

    // 1. Get clean lines
    let lines = sourceText
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

    // 3. Calculate how many different words are duplicated
    const freq: Record<string, number> = {};
    lines.forEach(line => {
      freq[line] = (freq[line] || 0) + 1;
    });
    this.duplicateCount = Object.values(freq).filter(count => count > 1).length;

    // 4. Remove duplicates after formatting
    if (this.removeDuplicates) {
      lines = Array.from(new Set(lines));
    }

    // 5. Sort if necessary
    if (this.sortOrder === 'asc') {
      lines.sort((a, b) => a.localeCompare(b));
    } else if (this.sortOrder === 'desc') {
      lines.sort((a, b) => b.localeCompare(a));
    }

    // 6. Assign result
    this.transformedText = lines.join('\n');
    this.resultCount = lines.length;
    this.saveState();
  }

  // Change filter handlers to work on the current result
  onSortChange(): void {
    this.transformText(this.transformedText);
  }
  onTextFormatChange(): void {
    this.transformText(this.transformedText);
  }
  onRemoveDuplicatesChange(): void {
    this.transformText(this.transformedText);
  }

  restoreResult(): void {
    this.transformText(this.inputText);
  }

  // Copy the transformed text to the clipboard
  copyToClipboard(): void {
    this.clipboard.copy(this.transformedText);
  }

  // Handles double click to copy and remove a word
  onLineDoubleClick(index: number): void {
    const lines = this.filteredLines.slice();
    const value = lines[index];
    this.clipboard.copy(value);
    lines.splice(index, 1);
    this.transformedText = lines.join('\n');
    this.resultCount = lines.length;
    this.saveState(); // Save the updated state without reprocessing inputText
  }

  // Handles single click to select a range
  onLineClick(index: number): void {
    if (this.selectedRangeStart === null) {
      this.selectedRangeStart = index;
      this.selectedRangeEnd = null;
    } else if (this.selectedRangeEnd === null) {
      this.selectedRangeEnd = index;
      // Copy and remove the selected range
      this.copyAndRemoveRange();
    } else {
      // Reset selection if a range is already selected
      this.selectedRangeStart = index;
      this.selectedRangeEnd = null;
    }
  }

  copyAndRemoveRange(): void {
    if (this.selectedRangeStart === null || this.selectedRangeEnd === null) return;
    const start = Math.min(this.selectedRangeStart, this.selectedRangeEnd);
    const end = Math.max(this.selectedRangeStart, this.selectedRangeEnd);
    const lines = this.filteredLines.slice();
    const selected = lines.slice(start, end + 1);
    this.clipboard.copy(selected.join('\n'));
    lines.splice(start, end - start + 1);
    this.transformedText = lines.join('\n');
    this.resultCount = lines.length;
    this.selectedRangeStart = null;
    this.selectedRangeEnd = null;
    this.saveState();
  }

  isLineSelected(index: number): boolean {
    if (this.selectedRangeStart === null) return false;
    if (this.selectedRangeEnd === null) return index === this.selectedRangeStart;
    const start = Math.min(this.selectedRangeStart, this.selectedRangeEnd);
    const end = Math.max(this.selectedRangeStart, this.selectedRangeEnd);
    return index >= start && index <= end;
  }

  get filteredLines(): string[] {
    return this.transformedText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line);
  }

  // In the textarea, on input, always process from inputText
  onInputTextChange(): void {
    // Reset selection and dynamic result
    this.selectedRangeStart = null;
    this.selectedRangeEnd = null;
    this.transformText(this.inputText);
  }
}
