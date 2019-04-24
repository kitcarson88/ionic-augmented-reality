import { Injectable } from '@angular/core';
import { Cordova } from '@ionic-native/core';
import { Observable } from 'rxjs';

import { HTTP } from '@ionic-native/http/ngx';
import { Network } from '@ionic-native/network/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { DeviceMotion } from '@ionic-native/device-motion/ngx';
import { Gyroscope } from '@ionic-native/gyroscope/ngx';
import { CameraPreview } from '@ionic-native/camera-preview/ngx';

    ////////////////////Mock providers
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

export class ScreenOrientationMock {
    public ORIENTATIONS = {
        PORTRAIT_PRIMARY: "",
        PORTRAIT_SECONDARY: "",
        LANDSCAPE_PRIMARY: "",
        LANDSCAPE_SECONDARY: "",
        PORTRAIT: "",
        LANDSCAPE: "",
        ANY: ""
    };

    lock(orientation: string): Promise<any>
    {
        return new Promise((resolve, reject) => {
            resolve({});
        });
    }
}

export class DiagnosticMock {
    isCameraPresent(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }

    isCameraAuthorized(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }

    isLocationEnabled(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }

    isLocationAvailable(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }

    isLocationAuthorized(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }

    requestCameraAuthorization(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve("mock granted");
        });
    }

    requestLocationAuthorization(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve("mock granted");
        });
    }
}

export class LocationAccuracyMock {
    public REQUEST_PRIORITY_HIGH_ACCURACY: number = 4;

    canRequest(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }

    request(accuracy: number): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve("");
        });
    }
}

export class GeolocationMock {
    watchPosition(options?: any): Observable<any>
    {
        let position = {
            coords: {
                latitude: 41.906927,
                longitude: 12.513942,
                accuracy: 10,
                altitude: 0,
                altitudeAccuracy: 0,
                heading: 0,
                speed: 0
            },
            timestamp: 0
        };

        return Observable.create((observer: any) => {
            observer.next(position);

            setInterval(() => {
                observer.next(position);
            }, options['maximumAge']);
        });
    }
}

export class DeviceMotionMock {
    watchAcceleration(options?: any): Observable<any>
    {
        let frequency = 5000;
        if (options && options['frequency'])
            frequency = options['frequency'];

        let motion = {
            timestamp: 1552143235608,
            x: -0.06703969836235046,
            y: -0.019154198467731476,
            z: 9.773429870605469
        };

        return Observable.create((observer: any) => {
            observer.next(motion);

            setInterval(() => {
                observer.next(motion);
            }, frequency);
        });
    }
}

export class GyroscopeMock {
    watch(options?: any): Observable<any>
    {
        let frequency = 5000;
        if (options && options['frequency'])
            frequency = options['frequency'];

        let orientation = {
            timestamp: 1552143235689,
            x: 0.0003597996255848557,
            y: -0.0006072000251151621,
            z: -0.0010830641258507967
        };

        return Observable.create((observer: any) => {
            observer.next(orientation);
            
            setInterval(() => {
                observer.next(orientation);
            }, frequency);
        });
    }
}

export class CameraPreviewMock {
    startCamera(options?: any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            resolve("Camera not available");
        });
    }

    stopCamera()
    {
        
    }

    getHorizontalFOV(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(60);
        });
    }
}

    /////////////////////Cordova verify function
export function hasCordova(): boolean{
    return window.hasOwnProperty('cordova');
}

    /////////////////////Providers getters
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

export function getScreenOrientation(): any
{
    return hasCordova()? ScreenOrientation : ScreenOrientationMock;
}

export function getDiagnostic(): any {
    return hasCordova()? Diagnostic : DiagnosticMock;
}

export function getLocationAccuracy(): any {
    return hasCordova()? LocationAccuracy : LocationAccuracyMock;
}

export function getGeolocation(): any
{
    return hasCordova()? Geolocation : GeolocationMock;
}

export function getDeviceMotion(): any
{
    return hasCordova()? DeviceMotion : DeviceMotionMock;
}

export function getGyroscope(): any
{
    return hasCordova()? Gyroscope : GyroscopeMock;
}

export function getCameraPreview(): any{
    return hasCordova()? CameraPreview : CameraPreviewMock;
}
////////////////////HERE ENDS PLUGIN MOCKS TO USE THEM MOCKED IN IONIC SERVE (DEV EXECUTION)///////////////