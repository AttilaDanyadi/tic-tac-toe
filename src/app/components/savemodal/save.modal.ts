import { Component } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";

export interface SaveDialogParams {
    title: string;
}
export interface SaveDialogResult {
    boardName: string;
}

@Component({
    selector: 'save-modal',
    templateUrl: './save.modal.html'
})
export class SaveModal extends DialogComponent<SaveModal, SaveDialogResult> implements SaveDialogParams {
    public title: string;
    public boardName: string;

    constructor(dialogService: DialogService) {
        super(dialogService);
    }

    private confirm() {
        //check name
        this.result = { boardName: this.boardName };
        this.close();
    }
}