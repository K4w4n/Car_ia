import Car from "../Car/index.js";
import IACar from "../Car/Ia.js";
import Level from "../Level.js";

export default class Training {
    private levels: Level[] = [];
    private iaCars: IACar[] = [];
    private botCars: Car[] = [];

    constructor(levels: Level[]) {
        this.levels = levels;
    }
}