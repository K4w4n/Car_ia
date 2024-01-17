import Entity from "../classes/Entity";

export default interface IDrawer {
    draw(entityList: Entity[]): void;
}