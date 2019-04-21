import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

//import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class SpinnerService
{
  private counter = 0;
  private currentLoader = null;

  //Customization
  /*private options = {
    spinner: 'hide',
    content: '<div class="ar-spinner">\
      <div>\
      </div>\
    </div>'
  };*/

  constructor(private loadingController: LoadingController/*, private sanitizer: DomSanitizer*/) {
    /*let svg = '<div class="pea-spinner">\
      <svg width="69" height="69" viewBox="0 0 69 69" fill="none" preserveAspectRatio="none">\
      <g clip-path="url(#clip0)">\
      <path d="M13.2383 25.6584C18.4901 16.2124 29.6567 12.0901 39.5669 15.3352L42.4771 10.1009L52.1696 26.1702L33.4051 26.418L36.0693 21.6261C29.6339 20.1495 22.7226 23.0073 19.3571 29.0606C15.279 36.3955 17.9287 45.681 25.2637 49.7591C32.5986 53.8372 41.8841 51.1875 45.9622 43.8525C47.0606 41.8769 47.6951 39.7425 47.8481 37.508L54.8328 37.9859C54.6091 41.2545 53.6834 44.3727 52.0812 47.2544C46.1271 57.9632 32.5705 61.8317 21.8616 55.8777C11.1526 49.9237 7.28434 36.3673 13.2383 25.6584Z" fill="#C30C26"/>\
      </g>\
      <defs>\
      <clipPath id="clip0">\
      <rect width="50.0266" height="50.0266" fill="white" transform="translate(43.7231 68.0325) rotate(-150.927)"/>\
      </clipPath>\
      </defs>\
      </svg>\
    </div>';

    let safeSvg = this.sanitizer.bypassSecurityTrustHtml(svg);

    this.options.content = safeSvg;*/
  }

  async showLoader()
  {
    if (this.counter <= 0)
    {
      this.counter = 0;
      this.currentLoader = await this.loadingController.create(/*this.options*/);
      if (this.currentLoader)
        await this.currentLoader.present();
    }

    this.counter++;
  }

  async dismissLoader()
  {
    this.counter--;
    
    if (this.counter <= 0)
    {
      this.counter = 0;
      if (this.currentLoader)
        await this.currentLoader.dismiss();
      this.currentLoader = null;
    }
  }
}
