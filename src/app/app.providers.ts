import { Observable } from 'rxjs';

import { HTTP } from '@ionic-native/http/ngx';
import { Network } from '@ionic-native/network/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

////////////////////HERE STARTS PLUGIN MOCKS TO USE THEM MOCKED IN IONIC SERVE (DEV EXECUTION)///////////////
export class HTTPMock {
    get(endpoint: string, params?: any, header?: any)
    {
        return new Promise((resolve, reject) => {
            resolve({});
        });
    }

    post(endpoint: string, params?: any, header?: any)
    {
        return new Promise((resolve, reject) => {
            resolve({});
        });
    }

    setRequestTimeout(timeout: number): void
    {
        return;
    }
}

export class NetworkMock {
    public type: string = 'unknowkn';

    onchange(): Observable<any>
    {
        return new Observable((subscriber) => {
            subscriber.complete();
        });
    }
}

export class NativeStorageMock {
    setItem(reference: string, value: any): Promise<any>
    {
        localStorage.setItem(reference, value);
        return new Promise((resolve, reject) => {
            resolve({});
        });
    }

    getItem(reference: string): Promise<any>
    {
        let value = localStorage.getItem(reference);
        return new Promise((resolve, reject) => {
            resolve(value);
        });
    }

    remove(reference: string): Promise<any>
    {
        localStorage.removeItem(reference);
        return new Promise((resolve, reject) => {
            resolve({});
        });
    }
}

export function hasCordova(): boolean{
    return window.hasOwnProperty('cordova');
}

export function getHTTP(): any
{
    return hasCordova()? HTTP : HTTPMock;
}

export function getNetwork(): any
{
    return hasCordova()? Network : NetworkMock;
}

export function getNativeStorage(): any
{
    return hasCordova()? NativeStorage : NativeStorageMock;
}
////////////////////HERE ENDS PLUGIN MOCKS TO USE THEM MOCKED IN IONIC SERVE (DEV EXECUTION)///////////////