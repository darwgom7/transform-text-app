import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Component as DialogComponent, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-csv-transformer',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './csv-transformer.component.html',
  styleUrl: './csv-transformer.component.css'
})
export class CsvTransformerComponent {
  csvText: string = '';
  csvData: any[] = [];
  csvHeaders: string[] = [];

  constructor(private dialog: MatDialog) {}

  processCsv(): void {
    console.log('Processing CSV...');
    const result = Papa.parse(this.csvText, { header: true, skipEmptyLines: true });
    this.csvData = result.data;
    this.csvHeaders = result.meta.fields || [];
  }

  openTableModal(): void {
    this.processCsv();
    if (this.csvData.length > 0) {
      const dialogRef = this.dialog.open(CsvTableDialogComponent, {
        width: '96vw',
        maxWidth: '900px',
        data: { headers: this.csvHeaders, rows: this.csvData }
      });
      dialogRef.afterClosed().subscribe((updatedRows: any[]) => {
        if (updatedRows) {
          const csv = Papa.unparse(updatedRows, { columns: this.csvHeaders });
          this.csvText = csv;
          this.processCsv();
        }
      });
    }
  }

  downloadCsv(): void {
    // Convert current data to CSV
    const csv = Papa.unparse(this.csvData, { columns: this.csvHeaders });
    // Create a blob and a link to download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'datos.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}

@DialogComponent({
  selector: 'app-csv-table-dialog',
  template: `
    <h2 mat-dialog-title style="position: relative;">
      Vista previa del CSV
      <button mat-icon-button mat-dialog-close matTooltip="Cerrar" class="close-btn" style="position: absolute; top: 8px; right: 8px; z-index: 10;">
        <mat-icon>close</mat-icon>
      </button>
    </h2>
    <mat-dialog-content>
      <ng-container *ngIf="!isMobile(); else mobileList">
        <mat-table [dataSource]="data.rows" class="csv-table">
          <ng-container *ngFor="let header of data.headers" [matColumnDef]="header">
            <mat-header-cell *matHeaderCellDef>{{ header }}</mat-header-cell>
            <mat-cell *matCellDef="let row; let rowIndex = index">
              <ng-container *ngIf="header === 'D'; else normalInput">
                <mat-form-field appearance="fill" class="csv-cell-field csv-d-field">
                  <textarea matInput [(ngModel)]="data.rows[rowIndex][header]" rows="2"></textarea>
                </mat-form-field>
              </ng-container>
              <ng-template #normalInput>
                <mat-form-field appearance="fill" class="csv-cell-field">
                  <input matInput [(ngModel)]="data.rows[rowIndex][header]" />
                </mat-form-field>
              </ng-template>
            </mat-cell>
          </ng-container>
          <mat-header-row *matHeaderRowDef="data.headers"></mat-header-row>
          <mat-row *matRowDef="let row; columns: data.headers;"></mat-row>
        </mat-table>
      </ng-container>
      <ng-template #mobileList>
        <div class="csv-mobile-list">
          <div *ngFor="let row of data.rows; let rowIndex = index" class="csv-mobile-card">
            <div *ngFor="let header of data.headers" class="csv-mobile-field">
              <label class="csv-mobile-label">{{ header }}</label>
              <ng-container *ngIf="header === 'D'; else mobileInput">
                <textarea [(ngModel)]="data.rows[rowIndex][header]" rows="2" class="csv-mobile-textarea"></textarea>
              </ng-container>
              <ng-template #mobileInput>
                <input [(ngModel)]="data.rows[rowIndex][header]" class="csv-mobile-input" />
              </ng-template>
            </div>
          </div>
        </div>
      </ng-template>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button color="primary" (click)="saveAndClose()">
        <mat-icon>save</mat-icon>
        Guardar
      </button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatDialogModule, FormsModule, MatInputModule, MatFormFieldModule, MatIconModule]
})
export class CsvTableDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { headers: string[], rows: any[] },
    public dialogRef: MatDialogRef<CsvTableDialogComponent>
  ) {}

  isMobile(): boolean {
    return window.innerWidth <= 600;
  }

  saveAndClose() {
    this.dialogRef.close(this.data.rows);
  }
}
