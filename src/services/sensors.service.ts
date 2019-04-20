import { Injectable } from '@angular/core';
import { select } from "@angular-redux/store";
import { Observable, combineLatest } from "rxjs";

import { AccelerometerActions, GyroscopeActions, MagnetometerActions } from '../store';

import { MotionDTO } from '../entities/dto/motionDTO';
import { OrientationDTO } from '../entities/dto/orientationDTO';
import { MagneticFieldDTO } from '../entities/dto/magneticFieldDTO';

import { constants } from '../util/constants';

@Injectable()
export class SensorsService
{
    private static readonly NS2S: number = 1.0 / 1000000000.0;
    private static readonly EPSILON: number = 0.000000001;
    private static readonly  FILTER_COEFFICIENT: number = 0.9;

    @select(["accelerometer", "coordinates"])
    accelerometerCoordinates$: Observable<MotionDTO>;
    accelerometerCoordinatesSubscription: any = null;

    @select(["gyroscope", "coordinates"])
    gyroscopeCoordinates$: Observable<OrientationDTO>;
    gyroscopeCoordinatesSubscription: any = null;
    
    @select(["magnetometer", "coordinates"])
    magnetometerCoordinates$: Observable<MagneticFieldDTO>;
    magnetometerCoordinatesSubscription: any = null;

    sensorsSubscription: any = null;

    // angular speeds from gyro
    private gyro: number[] = [];    //Float array of size 3

    // rotation matrix from gyro data
    private gyroMatrix: number[] = [];  //Float array of size 9

    // orientation angles from gyro matrix
    private gyroOrientation: number[] = [];  //Float array of size 3

    // magnetic field vector
    private magnet: number[] = [];   //Float array of size 3

    // accelerometer vector
    private accel: number[] = [];    //Float array of size 3

    // orientation angles from accel and magnet
    private accMagOrientation: number[] = [];    //Float array of size 3

    // final orientation angles from sensor fusion
    private fusedOrientation: number[] = [];     //Float array of size 3

    // accelerometer and magnetometer based rotation matrix
    private rotationMatrix: number[] = [];  //Float array of size 9

    private timestamp: number;
    private initState: boolean = true;

    constructor(private accelerometer: AccelerometerActions, private gyroscope: GyroscopeActions, private magnetometer: MagnetometerActions) {}

    startSensors()
    {
        this.initState = true;

        this.magnet = [0, 0, 0];

        this.gyroOrientation = [0, 0, 0];

        // initialise gyroMatrix with identity matrix
        this.gyroMatrix[0] = 1; this.gyroMatrix[1] = 0; this.gyroMatrix[2] = 0;
        this.gyroMatrix[3] = 0; this.gyroMatrix[4] = 1; this.gyroMatrix[5] = 0;
        this.gyroMatrix[6] = 0; this.gyroMatrix[7] = 0; this.gyroMatrix[8] = 1;

        this.rotationMatrix = Array.from(Array(9));

        this.accelerometer.startService();
        this.gyroscope.startService();
        this.magnetometer.startService();

        this.sensorsSubscription = combineLatest(this.magnetometerCoordinates$, this.accelerometerCoordinates$, this.gyroscopeCoordinates$)
            .subscribe(([magneticFieldData, accelerometerData, gyroscopeData]) => {
                if (magneticFieldData as MagneticFieldDTO)
                {
                    //console.log("Magnetometer data: ", magneticFieldData);
                    this.magnet[0] = magneticFieldData.x;
                    this.magnet[1] = magneticFieldData.y;
                    this.magnet[2] = magneticFieldData.z;
                }

                if (
                    (accelerometerData as MotionDTO) && this.magnet &&
                    (this.magnet[0] != null && this.magnet[0] != undefined) &&
                    (this.magnet[1] != null && this.magnet[1] != undefined) &&
                    (this.magnet[2] != null && this.magnet[2] != undefined)
                ) {
                    //console.log("Accelerometer data: ", accelerometerData);
                    this.accel[0] = accelerometerData.x;
                    this.accel[1] = accelerometerData.y;
                    this.accel[2] = accelerometerData.z;
        
                    this.calculateAccMagOrientation();
                }

                if (
                    (gyroscopeData as OrientationDTO) && this.accMagOrientation &&
                    (this.accMagOrientation[0] != null && this.accMagOrientation[0] != undefined) &&
                    (this.accMagOrientation[1] != null && this.accMagOrientation[1] != undefined) &&
                    (this.accMagOrientation[2] != null && this.accMagOrientation[2] != undefined)
                ) {
                    //console.log("Gyroscope data: ", gyroscopeData);
                    this.gyroFunction(gyroscopeData);
                }
            });
    }

    private calculateAccMagOrientation()
    {
        if (this.calculateRotationMatrix(/*rotationMatrix, accel, magnet*/))
            this.accMagOrientation = this.getOrientation(this.rotationMatrix);
    }

    private calculateRotationMatrix(/*float[] R, float[] gravity, float[] geomagnetic*/): boolean
    {
        // TODO: move this to native code for efficiency
        let Ax: number = this.accel[0];
        let Ay: number = this.accel[1];
        let Az: number = this.accel[2];
        const normsqA: number = (Ax * Ax + Ay * Ay + Az * Az);
        const g: number = 9.81;
        const freeFallGravitySquared: number = 0.01 * g * g;
        if (normsqA < freeFallGravitySquared)
        {
            // gravity less than 10% of normal value
            return false;
        }
        const Ex: number = this.magnet[0];
        const Ey: number = this.magnet[1];
        const Ez: number = this.magnet[2];
        let Hx: number = Ey * Az - Ez * Ay;
        let Hy: number = Ez * Ax - Ex * Az;
        let Hz: number = Ex * Ay - Ey * Ax;
        const normH: number = Math.sqrt(Hx * Hx + Hy * Hy + Hz * Hz);
        if (normH < 0.1)
        {
            // device is close to free fall (or in space?), or close to
            // magnetic north pole. Typical values are  > 100.
            return false;
        }

        const invH: number = 1.0 / normH;
        Hx *= invH;
        Hy *= invH;
        Hz *= invH;
        const invA: number = 1.0 / Math.sqrt(Ax * Ax + Ay * Ay + Az * Az);
        Ax *= invA;
        Ay *= invA;
        Az *= invA;
        const Mx = Ay * Hz - Az * Hy;
        const My = Az * Hx - Ax * Hz;
        const Mz = Ax * Hy - Ay * Hx;

        if (this.rotationMatrix != null) {
            this.rotationMatrix[0] = Hx;     this.rotationMatrix[1] = Hy;     this.rotationMatrix[2] = Hz;
            this.rotationMatrix[3] = Mx;     this.rotationMatrix[4] = My;     this.rotationMatrix[5] = Mz;
            this.rotationMatrix[6] = Ax;     this.rotationMatrix[7] = Ay;     this.rotationMatrix[8] = Az;
        }

        return true;
    }

    public getOrientation(R: number[]): number[]
    {
        let values: number[] = [];
        /*
         * 4x4 (length=16) case:
         *   /  R[ 0]   R[ 1]   R[ 2]   0  \
         *   |  R[ 4]   R[ 5]   R[ 6]   0  |
         *   |  R[ 8]   R[ 9]   R[10]   0  |
         *   \      0       0       0   1  /
         *
         * 3x3 (length=9) case:
         *   /  R[ 0]   R[ 1]   R[ 2]  \
         *   |  R[ 3]   R[ 4]   R[ 5]  |
         *   \  R[ 6]   R[ 7]   R[ 8]  /
         *
         */
        if (R.length == 9) {
            values[0] = Math.atan2(R[1], R[4]);
            values[1] = Math.asin(-R[7]);
            values[2] = Math.atan2(-R[6], R[8]);
        } else {
            values[0] = Math.atan2(R[1], R[5]);
            values[1] = Math.asin(-R[9]);
            values[2] = Math.atan2(-R[8], R[10]);
        }
        return values;
    }

    private gyroFunction(gyroData: OrientationDTO)
    {
        // don't start until first accelerometer/magnetometer orientation has been acquired
        if (this.accMagOrientation == null)
            return;

        // initialisation of the gyroscope based rotation matrix
        if (this.initState)
        {
            let initMatrix: number[] = [];  //Array of 9 elements float
            initMatrix = this.getRotationMatrixFromOrientation(this.accMagOrientation);
            let test: number[] = [];    //Array of 3 elements float
            test = this.getOrientation(initMatrix);
            this.gyroMatrix = this.matrixMultiplication(this.gyroMatrix, initMatrix);
            this.initState = false;
        }

        // copy the new gyro values into the gyro array
        // convert the raw gyro data into a rotation vector
        let deltaVector: number[] = Array.from(Array(4).fill(0)); //Array of 4 elements float
        if (this.timestamp)
        {
            const dT: number = (gyroData.timestamp - this.timestamp) * SensorsService.NS2S;
            this.gyro[0] = gyroData.x;
            this.gyro[1] = gyroData.y;
            this.gyro[2] = gyroData.z;
            deltaVector = this.getRotationVectorFromGyro(this.gyro, dT / 2.0);
        }

        // measurement done, save current time for next interval
        this.timestamp = gyroData.timestamp;

        // convert rotation vector into rotation matrix
        let deltaMatrix: number[] = []; //Array of 9 elements float
        deltaMatrix = this.getRotationMatrixFromVector(deltaVector);

        // apply the new rotation interval on the gyroscope based rotation matrix
        this.gyroMatrix = this.matrixMultiplication(this.gyroMatrix, deltaMatrix);

        // get the gyroscope based orientation from the rotation matrix
        this.gyroOrientation = this.getOrientation(this.gyroMatrix);
    }

    private getRotationMatrixFromOrientation(o: number[]): number[]
    {
        let xM: number[] = [];  //Array of 9 elements float
        let yM: number[] = [];  //Array of 9 elements float
        let zM: number[] = [];  //Array of 9 elements float
     
        let sinX: number = Math.sin(o[1]);
        let cosX: number = Math.cos(o[1]);
        let sinY: number = Math.sin(o[2]);
        let cosY: number = Math.cos(o[2]);
        let sinZ: number = Math.sin(o[0]);
        let cosZ: number = Math.cos(o[0]);
     
        // rotation about x-axis (pitch)
        xM[0] = 1.0; xM[1] = 0.0; xM[2] = 0.0;
        xM[3] = 0.0; xM[4] = cosX; xM[5] = sinX;
        xM[6] = 0.0; xM[7] = -sinX; xM[8] = cosX;
     
        // rotation about y-axis (roll)
        yM[0] = cosY;   yM[1] = 0.0;    yM[2] = sinY;
        yM[3] = 0.0;    yM[4] = 1.0;    yM[5] = 0.0;
        yM[6] = -sinY;  yM[7] = 0.0;    yM[8] = cosY;
     
        // rotation about z-axis (azimuth)
        zM[0] = cosZ;   zM[1] = sinZ;   zM[2] = 0.0;
        zM[3] = -sinZ;  zM[4] = cosZ;   zM[5] = 0.0;
        zM[6] = 0.0;    zM[7] = 0.0;    zM[8] = 1.0;
     
        // rotation order is y, x, z (roll, pitch, azimuth)
        let resultMatrix: number[] = this.matrixMultiplication(xM, yM);
        resultMatrix = this.matrixMultiplication(zM, resultMatrix);
        return resultMatrix;
    }

    private matrixMultiplication(A: number[], B: number[]) {
        let result: number[] = [];   //Array of 9 elements float
     
        result[0] = A[0] * B[0] + A[1] * B[3] + A[2] * B[6];
        result[1] = A[0] * B[1] + A[1] * B[4] + A[2] * B[7];
        result[2] = A[0] * B[2] + A[1] * B[5] + A[2] * B[8];
     
        result[3] = A[3] * B[0] + A[4] * B[3] + A[5] * B[6];
        result[4] = A[3] * B[1] + A[4] * B[4] + A[5] * B[7];
        result[5] = A[3] * B[2] + A[4] * B[5] + A[5] * B[8];
     
        result[6] = A[6] * B[0] + A[7] * B[3] + A[8] * B[6];
        result[7] = A[6] * B[1] + A[7] * B[4] + A[8] * B[7];
        result[8] = A[6] * B[2] + A[7] * B[5] + A[8] * B[8];
     
        return result;
    }

    private getRotationMatrixFromVector(rotationVector: number[]): number[]
    {
        let R: number[] = [];
        let q0: number;
        let q1: number = rotationVector[0];
        let q2: number = rotationVector[1];
        let q3: number = rotationVector[2];
        if (rotationVector.length >= 4) {
            q0 = rotationVector[3];
        } else {
            q0 = 1 - q1 * q1 - q2 * q2 - q3 * q3;
            q0 = (q0 > 0) ? Math.sqrt(q0) : 0;
        }
        let sq_q1: number = 2 * q1 * q1;
        let sq_q2: number = 2 * q2 * q2;
        let sq_q3: number = 2 * q3 * q3;
        let q1_q2: number = 2 * q1 * q2;
        let q3_q0: number = 2 * q3 * q0;
        let q1_q3: number = 2 * q1 * q3;
        let q2_q0: number = 2 * q2 * q0;
        let q2_q3: number = 2 * q2 * q3;
        let q1_q0: number = 2 * q1 * q0;

        R[0] = 1 - sq_q2 - sq_q3;
        R[1] = q1_q2 - q3_q0;
        R[2] = q1_q3 + q2_q0;
        R[3] = q1_q2 + q3_q0;
        R[4] = 1 - sq_q1 - sq_q3;
        R[5] = q2_q3 - q1_q0;
        R[6] = q1_q3 - q2_q0;
        R[7] = q2_q3 + q1_q0;
        R[8] = 1 - sq_q1 - sq_q2;

        return R;
    }

    // This function is borrowed from the Android reference
	// at http://developer.android.com/reference/android/hardware/SensorEvent.html#values
	// It calculates a rotation vector from the gyroscope angular speed values.
    private getRotationVectorFromGyro(gyroValues: number[], timeFactor: number)
    {
        let deltaRotationVector: number[] = []; //Array of 4 elements

        let normValues: number[] = [];   //Array of 3 elements
        
        // Calculate the angular speed of the sample
        let omegaMagnitude: number = Math.sqrt(gyroValues[0] * gyroValues[0] +
        gyroValues[1] * gyroValues[1] +
        gyroValues[2] * gyroValues[2]);
        
        // Normalize the rotation vector if it's big enough to get the axis
        if (omegaMagnitude > SensorsService.EPSILON)
        {
            normValues[0] = gyroValues[0] / omegaMagnitude;
            normValues[1] = gyroValues[1] / omegaMagnitude;
            normValues[2] = gyroValues[2] / omegaMagnitude;
        }
        
        // Integrate around this axis with the angular speed by the timestep
        // in order to get a delta rotation from this sample over the timestep
        // We will convert this axis-angle representation of the delta rotation
        // into a quaternion before turning it into the rotation matrix.
        let thetaOverTwo: number = omegaMagnitude * timeFactor;
        let sinThetaOverTwo: number = Math.sin(thetaOverTwo);
        let cosThetaOverTwo: number =  Math.cos(thetaOverTwo);
        deltaRotationVector[0] = sinThetaOverTwo * normValues[0];
        deltaRotationVector[1] = sinThetaOverTwo * normValues[1];
        deltaRotationVector[2] = sinThetaOverTwo * normValues[2];
        deltaRotationVector[3] = cosThetaOverTwo;

        return deltaRotationVector;
    }

    stopSensors()
    {
        this.accelerometer.stopService();
        this.gyroscope.stopService();
        this.magnetometer.stopService();

        if (this.sensorsSubscription)
        {
            this.sensorsSubscription.unsubscribe();
            this.sensorsSubscription = null;
        }
    }

    getSensorsData(options?: {frequency?: number, delay?: number}): Observable<any>
    {
        let frequency = constants.FUSION_SENSOR_FREQUENCY;
        let delay = constants.FUSION_SENSOR_INIT_DELAY;

        if (options && options.frequency)
            frequency = options.frequency;

        if (options && options.delay)
            delay = options.delay;

        console.log("frequency: ", frequency);
        console.log("delay: ", delay);

        return Observable.create((observer: any) => {
            setTimeout(() => {
                this.calculateFusedOrientation();
                this.convertFusionOrientationInDegrees();

                observer.next({
                    alfa: this.fusedOrientation[0],
                    beta: this.fusedOrientation[1],
                    gamma: this.fusedOrientation[2]
                });

                setInterval(() => {
                    this.calculateFusedOrientation();
                    this.convertFusionOrientationInDegrees();

                    observer.next({
                        alfa: this.fusedOrientation[0],
                        beta: this.fusedOrientation[1],
                        gamma: this.fusedOrientation[2]
                    });
                }, frequency);
            }, delay);
        });
    }

    private calculateFusedOrientation()
    {
        let oneMinusCoeff: number = 1.0 - SensorsService.FILTER_COEFFICIENT;
        // azimuth
        if (this.gyroOrientation[0] < -0.5 * Math.PI && this.accMagOrientation[0] > 0.0) {
            this.fusedOrientation[0] = (SensorsService.FILTER_COEFFICIENT * (this.gyroOrientation[0] + 2.0 * Math.PI) + oneMinusCoeff * this.accMagOrientation[0]);
            this.fusedOrientation[0] -= (this.fusedOrientation[0] > Math.PI) ? 2.0 * Math.PI : 0;
        }
        else if (this.accMagOrientation[0] < -0.5 * Math.PI && this.gyroOrientation[0] > 0.0) {
            this.fusedOrientation[0] = (SensorsService.FILTER_COEFFICIENT * this.gyroOrientation[0] + oneMinusCoeff * (this.accMagOrientation[0] + 2.0 * Math.PI));
            this.fusedOrientation[0] -= (this.fusedOrientation[0] > Math.PI)? 2.0 * Math.PI : 0;
        }
        else {
            this.fusedOrientation[0] = SensorsService.FILTER_COEFFICIENT * this.gyroOrientation[0] + oneMinusCoeff * this.accMagOrientation[0];
        }
        
        // pitch
        if (this.gyroOrientation[1] < -0.5 * Math.PI && this.accMagOrientation[1] > 0.0) {
            this.fusedOrientation[1] = (SensorsService.FILTER_COEFFICIENT * (this.gyroOrientation[1] + 2.0 * Math.PI) + oneMinusCoeff * this.accMagOrientation[1]);
            this.fusedOrientation[1] -= (this.fusedOrientation[1] > Math.PI) ? 2.0 * Math.PI : 0;
        }
        else if (this.accMagOrientation[1] < -0.5 * Math.PI && this.gyroOrientation[1] > 0.0) {
            this.fusedOrientation[1] = (SensorsService.FILTER_COEFFICIENT * this.gyroOrientation[1] + oneMinusCoeff * (this.accMagOrientation[1] + 2.0 * Math.PI));
            this.fusedOrientation[1] -= (this.fusedOrientation[1] > Math.PI)? 2.0 * Math.PI : 0;
        }
        else {
            this.fusedOrientation[1] = SensorsService.FILTER_COEFFICIENT * this.gyroOrientation[1] + oneMinusCoeff * this.accMagOrientation[1];
        }
        
        // roll
        if (this.gyroOrientation[2] < -0.5 * Math.PI && this.accMagOrientation[2] > 0.0) {
            this.fusedOrientation[2] = (SensorsService.FILTER_COEFFICIENT * (this.gyroOrientation[2] + 2.0 * Math.PI) + oneMinusCoeff * this.accMagOrientation[2]);
            this.fusedOrientation[2] -= (this.fusedOrientation[2] > Math.PI) ? 2.0 * Math.PI : 0;
        }
        else if (this.accMagOrientation[2] < -0.5 * Math.PI && this.gyroOrientation[2] > 0.0) {
            this.fusedOrientation[2] = (SensorsService.FILTER_COEFFICIENT * this.gyroOrientation[2] + oneMinusCoeff * (this.accMagOrientation[2] + 2.0 * Math.PI));
            this.fusedOrientation[2] -= (this.fusedOrientation[2] > Math.PI)? 2.0 * Math.PI : 0;
        }
        else {
            this.fusedOrientation[2] = SensorsService.FILTER_COEFFICIENT * this.gyroOrientation[2] + oneMinusCoeff * this.accMagOrientation[2];
        }

        // overwrite gyro matrix and orientation with fused orientation
        // to comensate gyro drift
        this.gyroMatrix = this.getRotationMatrixFromOrientation(this.fusedOrientation);
        this.gyroOrientation[0] = this.fusedOrientation[0];
        this.gyroOrientation[1] = this.fusedOrientation[1];
        this.gyroOrientation[2] = this.fusedOrientation[2];
    }

    private convertFusionOrientationInDegrees()
    {
        this.fusedOrientation[0] *= 180 / Math.PI;
        this.fusedOrientation[1] *= 180 / Math.PI;
        this.fusedOrientation[2] *= 180 / Math.PI;

        if (this.fusedOrientation[0] < 0)
            this.fusedOrientation[0] += 360;

        this.fusedOrientation[2] += 180;
    }
}