import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColorService } from '../color/services/color.service';
import { Color } from '../color/models/color';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ColorFormDialogComponent } from '../color/color-form-dialog/color-form-dialog.component';
import { UpdateColorDialogComponent } from './update-color-dialog/update-color-dialog.component';

@Component({
  selector: 'app-color-dialog',
  templateUrl: './color-dialog.component.html',
  styleUrls: ['./color-dialog.component.css']
})
export class ColorDialogComponent implements OnInit {
  colors: any[] = []; // Mevcut renkler
  colorForm: FormGroup; // Yeni renk ekleme formu

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ColorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private colorService: ColorService,
    private fb: FormBuilder
  ) {
    this.colorForm = this.fb.group({
      name: ['', Validators.required], // Color adı zorunlu
      code: [null, [Validators.required, Validators.pattern(/^[0-9]+$/)]], // Color kodu zorunlu, sadece sayı
    });
  }

  ngOnInit(): void {
    this.getColors(); // Mevcut renkleri yükle
  }

  getColors(): void {
    this.colorService.getColorList().subscribe((data) => {
      this.colors = data.filter((color) => !color.isDeleted); // Sadece silinmemiş renkleri getir
    });
  }

  addColor(): void {
    if (this.colorForm.valid) {
      const newColor = this.colorForm.value;
      this.colorService.addColor(newColor).subscribe(() => {
        this.getColors(); // Listeyi güncelle
        this.colorForm.reset(); // Formu sıfırla
      });
    }
  }

  updateColor(color: any): void {
    const dialogRef = this.dialog.open(UpdateColorDialogComponent, {
      width: '400px',
      data: { color }, // Seçilen renk bilgileri gönderiliyor
    });

    dialogRef.afterClosed().subscribe((updatedColor) => {
      if (updatedColor) {
        this.colorService.updateColor(updatedColor).subscribe(() => {
          this.getColors(); // Listeyi güncelle
        });
      }
    });
  }

  deleteColor(id: number): void {
    this.colorService.deleteColor(id).subscribe(() => {
      this.getColors(); // Listeyi güncelle
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}



  


