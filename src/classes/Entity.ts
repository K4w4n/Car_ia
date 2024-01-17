import Coordinate from "../types/Coordinate";
import Size from "../types/Size";


export default abstract class Entity {

    protected coordinate: Coordinate;
    protected size: Size;

    constructor(coordinate?: Coordinate, size?: Size) {
        this.coordinate = coordinate || this.getDefaultCoordinate();
        this.size = size || this.getDefaultSize();
    }

    private getDefaultCoordinate(): Coordinate {
        return { x: 0, y: 0 };
    }

    private getDefaultSize(): Size {
        return { width: 10, height: 10 };
    }

    public getCoordinate(): Coordinate {
        return this.coordinate;
    }

    public getSize(): Size {
        return this.size;
    }

}