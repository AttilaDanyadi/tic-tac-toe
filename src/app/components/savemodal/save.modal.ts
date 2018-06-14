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
    public Valid = true;

    constructor(dialogService: DialogService) {
        super(dialogService);
    }

    private confirm() {
        this.Valid = this.boardName &&
            (3 <= this.boardName.length) &&
            (this.boardName.length <= 50) &&
            (!this.boardName.includes(' '));
        if (this.Valid) {
            this.result = { boardName: this.boardName };
            this.close();
        }
    }
}