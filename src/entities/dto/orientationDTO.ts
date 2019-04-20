export class OrientationDTO {
    x: number;
    y: number;
    z: number;
    timestamp: number;

    constructor(x: number, y: number, z: number, timestamp: number)
    {
        this.x = x;
        this.y = y;
        this.z = z;
        this.timestamp = timestamp;
    }
}