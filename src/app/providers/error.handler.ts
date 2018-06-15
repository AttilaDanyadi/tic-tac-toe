import { Injectable, Injector, ErrorHandler } from '@angular/core';
import { Response } from '@angular/http';
import { DialogService } from 'ng2-bootstrap-modal';
import { MessageBox } from '../components/index';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private injector: Injector) { }

    public handleError(error) {
        console.log('App error', error);

        let dialogService = this.injector.get(DialogService);

        let message: string;
        if (error) {
            if (error.constructor) {
                if (error.constructor.name == 'Response') {
                    let res = error as Response;
                    message = 'HTTP: ' + res.status + ' Text: ' + res.statusText;
                }
                else {
                    message = 'Class of error: ' + error.constructor.name;
                }
            }
            else {
                error = JSON.stringify(error);
            }
        }
        else {
            message = 'Unkown error';
        }

        new MessageBox(dialogService).Show({
            title: 'Ooops... Some error happend!',
            message: message,
            buttons: ['OK'],
            icon: undefined,
            defaultButton: 'OK'
        }).subscribe(dialogResult => { });
        throw error;
    }
}