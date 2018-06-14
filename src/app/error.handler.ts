import { Injectable, Injector, ErrorHandler } from '@angular/core';
import { DialogService } from 'ng2-bootstrap-modal';
import { MessageBox } from './components/index';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private injector: Injector) { }

    handleError(error) {
        const dialogService = this.injector.get(DialogService);
        console.log('global error', error);
        new MessageBox(dialogService).Show({
            title: 'Ooops... ',
            message: 'error.statusText',
            buttons: ['OK'],
            icon: undefined,
            defaultButton: 'OK'
        }).subscribe(r => { throw error });
    }
}