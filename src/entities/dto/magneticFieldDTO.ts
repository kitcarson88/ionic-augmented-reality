export class MagneticFieldDTO {
    x: number;
    y: number;
    z: number;
    magnitude: number;

    constructor(x: number, y: number, z: number, magnitude: number)
    {
        this.x = x;
        this.y = y;
        this.z = z;
        this.magnitude = magnitude;
    }
};