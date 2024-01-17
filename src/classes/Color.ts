type Rgb = {
    r: number;
    g: number;
    b: number;
}

/** Manages colors */
export default class Color {
    private rgb: Rgb;

    /** Checks if it is a valid hex code */
    private readonly hexRegex = /^#([0-9A-Fa-f]{3}){1,2}$/i;

    constructor(colorValue?: string | Rgb) {

        switch (typeof colorValue) {
            case 'string':
                this.validateHex(colorValue);
                this.rgb = this.hexToRGB(colorValue);
                break;

            case "undefined":
                this.rgb = this.getRandomRgb();
                break;

            default:
                this.rgb = colorValue;
                break;
        }
    }

    private getRandomRgb():Rgb {
        return {
            r: Math.round((Math.random() * 255)),
            g: Math.round((Math.random() * 255)),
            b: Math.round((Math.random() * 255)),
        };
    }

    /** Returns an error if the hexadecimal is invalid */
    private validateHex(hex: string) {
        if (!this.hexRegex.test(hex)) {
            throw Error("Invalid hexadecimal format");
        }
    }

    /** Gets hexadecimal of the color */
    public getHex(): string {
        return this.rgbToHex(this.rgb);
    }

    /** Convert the RGB color to hexadecimal */
    private rgbToHex(rgb: Rgb): string {
        // Convert back to hexadecimal format
        const r: string = rgb.r.toString(16).padStart(2, '0');
        const g: string = rgb.g.toString(16).padStart(2, '0');
        const b: string = rgb.b.toString(16).padStart(2, '0');

        // Return the color in hexadecimal format
        return `#${r}${g}${b}`;
    }

    /** Gets hexadecimal of the color */
    public getRgb(): Rgb {
        return { ...this.rgb }
    }

    /** Convert the hexadecimal color to RGB */
    private hexToRGB(hex: string): Rgb {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
    }

    public vary(percentage: number): void {

        /** Maximum variation allowed based on the percentage */
        const maxVariation: number = 255 * percentage;

        // Apply variation to each RGB component with randomness
        this.rgb.r += Math.round((Math.random() * 2 - 1) * maxVariation);
        this.rgb.g += Math.round((Math.random() * 2 - 1) * maxVariation);
        this.rgb.b += Math.round((Math.random() * 2 - 1) * maxVariation);

        // Ensure the values are within the valid range (0-255)
        this.rgb.r = Math.min(255, Math.max(0, this.rgb.r));
        this.rgb.g = Math.min(255, Math.max(0, this.rgb.g));
        this.rgb.b = Math.min(255, Math.max(0, this.rgb.b));
    }

}