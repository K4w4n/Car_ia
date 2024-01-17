import Control from "./index";

type ControlDirection = 'forward' | 'left' | 'right' | 'reverse';

/** Control the player from the keyboard */
export default class PlayerControl extends Control {

    /** Translates the event key to a controller property */
    private readonly keyDictionary: Record<string, ControlDirection | null> = {
        "ArrowLeft": "left",
        "ArrowRight": "right",
        "ArrowUp": "forward",
        "ArrowDown": "reverse",
    }

    constructor() {
        super();
        this.addKeyboardListeners();
    }

    /** Create keyboard events with two event handlers */
    private addKeyboardListeners() {
        document.onkeydown = this.keyDownHandler.bind(this);
        document.onkeyup = this.keyUpHandler.bind(this);
    }

    /** Handles keyboard events when the key is down */
    private keyDownHandler(event: KeyboardEvent) {
        this.setControl(event.key, true);
    }

    /** Handles keyboard events when the key is up */
    private keyUpHandler(event: KeyboardEvent) {
        this.setControl(event.key, false);
    }

    /** Modify the control according to the key pressed */
    private setControl(key: string, value: boolean) {
        const attribute = this.keyToAttribute(key);
        if (attribute) this[attribute] = value;
    }

    /** Converts a key into control action */
    private keyToAttribute(key: string): ControlDirection | null {
        return this.keyDictionary[key] || null;
    }
}