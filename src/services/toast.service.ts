import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

import { constants } from '../util/constants';

@Injectable()
export class ToastService
{
  private counter = 0;
  
  constructor(private toastController: ToastController) {}

  async showErrorToast(options: {text?: string, duration?: number})
  {
    if (this.counter == 0)
    {
      ++(this.counter);

      let text = options.text;
      if (options.text == null)
        text = 'Si è verificato un errore';

      let duration = constants.TOAST_TIMEOUT;
      if (options.duration)
        duration = options.duration;

      const toast = await this.toastController.create({
        message: text,
        position: 'bottom',
        cssClass: 'ar-toast error-toast',
        duration: duration
      });
      toast.onDidDismiss().then(() => {
        this.counter > 0? --(this.counter) : 0
      });
      toast.present();
    }
  }

  async showSuccessToast(options: {text?: string, duration?: number})
  {
    if (this.counter == 0)
    {
      ++(this.counter);

      let text = options.text;
      if (options.text == null)
        text = 'Operazione completata con successo';

      let duration = constants.TOAST_TIMEOUT;
      if (options.duration)
        duration = options.duration;

      const toast = await this.toastController.create({
        message: text,
        position: 'bottom',
        cssClass: 'ar-toast error-toast',
        duration: duration
      });
      toast.onDidDismiss().then(() => {
        this.counter > 0? --(this.counter) : 0
      });
      toast.present();
    }
  }
}