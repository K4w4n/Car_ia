import IDrawer from "../interfaces/IDrawer.js";
import CanvasDrawer from "./CanvasDrawer.js";
import Training from "./Training/index.js";

export default class App {
    private indexCurrentTraining: number = 0;
    private trainings: Training[];
    private drawer?: IDrawer;

    constructor() {
        this.trainings = [];
        this.drawer = new CanvasDrawer();
    }


}