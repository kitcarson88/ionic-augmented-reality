import { Injectable } from '@angular/core';
import { AlertController, Events } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';
import { constants } from '../util/constants';

@Injectable()
export class AlertService
{
    constructor(
        private translateService: TranslateService,
        private alertController: AlertController,
        public events: Events
    ) {}

    async showSensorsError(textCode: string) {
        let text = await this.translateService.get(textCode).toPromise();

        const alert = await this.alertController.create({
            cssClass: 'ar-alert sensorsError',
            message: text,
            buttons: [
                {
                    text: 'Ok',
                    handler: data => {
                        this.events.publish(constants.AR_SYSTEM_ERROR);
                    }
                }
            ]
        });
    
        await alert.present();
    }
}