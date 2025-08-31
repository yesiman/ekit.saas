import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef as MatDialogRef, MAT_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { any } from '../basic-dialog.component';

@Component({
    selector: 'app-basic-dialog-overview',
    templateUrl: './basic-dialog-overview.component.html',
    styleUrls: ['./basic-dialog-overview.component.scss'],
    standalone: false
})
export class BasicDialogOverviewComponent{

  constructor(
    public dialogRef: MatDialogRef<BasicDialogOverviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
