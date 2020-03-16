import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { NgRedux } from '@angular-redux/store';
import { AppState } from '../store/store.model';

@Injectable()
export class AlertService
{
    constructor(private alertController: AlertController, private ngRedux: NgRedux<AppState>) { }

    async presentArAlert(header?: string, subHeader?: string, cssClass?: string, buttonsInfos?: {
        text: string,
        cssClass?: string,
        role?: string,
        actions?: { type: string, payload?: any; }[],
        dismissOnClick?: boolean;
    }[])
    {
        let buttons;

        if (buttonsInfos)
        {
            buttons = [];

            for (let info of buttonsInfos)
            {
                let button = { text: info.text };

                if (info.cssClass)
                    button['cssClass'] = info.cssClass;

                button['role'] = info.role ? info.role : null;

                if (info.actions)
                    button['handler'] = () =>
                    {
                        for (let action of info.actions)
                            this.ngRedux.dispatch(action);

                        if (info.dismissOnClick != null && info.dismissOnClick != undefined)
                            return info.dismissOnClick;
                    };

                buttons.push(button);
            }
        }

        let options = {
            cssClass: 'ar-alert' + (cssClass && cssClass.length ? ' ' + cssClass : ''),
            backdropDismiss: false,
        };

        if (header)
            options['header'] = header;

        if (subHeader)
            options['subHeader'] = subHeader;

        if (buttons)
            options['buttons'] = buttons;

        let alert = await this.alertController.create(options);

        alert.present();
    }
}