import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-color-dialog',
  templateUrl: './update-color-dialog.component.html',
  styleUrls: ['./update-color-dialog.component.css'],
})
export class UpdateColorDialogComponent {
  updateColorForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<UpdateColorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    // Gelen renk bilgileri ile form oluşturuluyor
    this.updateColorForm = this.fb.group({
      id: [data.color.id], // ID sabit
      name: [data.color.name, Validators.required], // Renk adı zorunlu
      code: [data.color.code, [Validators.required, Validators.pattern(/^[0-9]+$/)]], // Kod zorunlu, sayı
    });
  }

  save(): void {
    if (this.updateColorForm.valid) {
      this.dialogRef.close(this.updateColorForm.value); // Form bilgilerini dialoga gönder
    }
  }

  close(): void {
    this.dialogRef.close(); // Dialogu kapat
  }
}
