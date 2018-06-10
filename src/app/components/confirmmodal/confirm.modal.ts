import { Component } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
export interface ConfirmModel {
  title: string;
  message: string;
}
@Component({
  selector: 'confirm',
  templateUrl: './confirm.modal.html'
})
export class ConfirmModal extends DialogComponent<ConfirmModel, boolean> implements ConfirmModel {
  public title: string;
  public message: string;

  constructor(dialogService: DialogService) {
    super(dialogService);
  }

  private confirm() {
    this.result = true;
    this.close();
  }
}