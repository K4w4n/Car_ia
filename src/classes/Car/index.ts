import Coordinate from "../../types/Coordinate.js";
import Size from "../../types/Size.js";
import Color from "../Color.js";
import Entity from "../Entity.js";

export default class Car extends Entity {

    protected speed: number;
    protected acceleration: number;
    protected maxSpeed: number;
    protected friction: number;
    protected angle: number;
    protected damaged: boolean;
    protected color: Color;

    constructor(coordinate: Coordinate, size: Size) {
        super(coordinate, size);
        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = 3;
        this.friction = 0.05;
        this.angle = 0;
        this.damaged = false;
        this.color = new Color();
    }

}