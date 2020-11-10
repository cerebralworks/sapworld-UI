import { Injectable } from '@angular/core';

declare var window: any;

@Injectable()
export class AppGlobals {
    readonly baseUrl: string = `${window.location.protocol}//${window.location.host}`; //swingzen-beta
    readonly resourceUrl: string = `${this.baseUrl}/assets`;
    readonly defaultImage = `${this.resourceUrl}/images/placeholder-image.png`;
    readonly defaultProfileImage = `${this.resourceUrl}/images/default-profile.jpg`;
    readonly availableLanguages: Array<string> = ['en', 'de', 'es'];
}
