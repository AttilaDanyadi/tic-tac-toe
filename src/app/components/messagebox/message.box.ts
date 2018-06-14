import { Component } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
export interface MessageBoxParameters {
    title: string;
    message: string;
    buttons: MessageBoxButtons[];
    icon: any;
    defaultButton: MessageBoxButtons;
}
export type MessageBoxButtons = 'OK' | 'Yes' | 'No' | 'Cancel';
@Component({
    selector: 'message-box',
    templateUrl: './message.box.html'
})
export class MessageBox extends DialogComponent<MessageBoxParameters, MessageBoxButtons> implements MessageBoxParameters {
    public title: string;
    public message: string;
    public buttons: MessageBoxButtons[];
    public icon: any;
    public defaultButton: MessageBoxButtons;

    public Show(params:MessageBoxParameters){
        return this.dialogService.addDialog(MessageBox,params);
    }

    constructor(dialogService: DialogService) {
        super(dialogService);
    }

    private GetClass(button: MessageBoxButtons) {
        switch (button) {
            case 'OK':
                return 'btn btn-primary';
            case 'Yes':
                return 'btn btn-success';
            case 'No':
                return 'btn btn-danger';
            case 'Cancel':
            default:
                return 'btn btn-default';
        }
    }

    private Return(button: MessageBoxButtons) {
        this.result = button;
        this.close();
    }
}