

module cubee {

    export interface IStyle {

        apply(element: HTMLElement): void;

    }

    export abstract class ABackground implements IStyle {

        abstract apply(element: HTMLElement): void;

    }

    export class Color {

        private static _TRANSPARENT = Color.getArgbColor(0x00000000);
        static get TRANSPARENT() {
            return Color._TRANSPARENT;
        }

        public static getArgbColor(argb: number): Color {
            return new Color(argb);
        }

        public static getArgbColorByComponents(alpha: number, red: number, green: number, blue: number) {
            alpha = this.fixComponent(alpha);
            red = this.fixComponent(red);
            green = this.fixComponent(green);
            blue = this.fixComponent(blue);

            return this.getArgbColor(
                alpha << 24
                | red << 16
                | green << 8
                | blue
            );
        }

        public static getRgbColor(rgb: number) {
            return this.getArgbColor(rgb | 0xff000000);
        }

        public static getRgbColorByComponents(red: number, green: number, blue: number) {
            return this.getArgbColorByComponents(255, red, green, blue);
        }

        private static fixComponent(component: number) {
            component = component | 0;
            if (component < 0) {
                return 0;
            }

            if (component > 255) {
                return 255;
            }

            return component;
        }

        public static fadeColors(startColor: Color, endColor: Color, fadePosition: number) {
            return Color.getArgbColorByComponents(
                this.mixComponent(startColor.alpha, endColor.alpha, fadePosition),
                this.mixComponent(startColor.red, endColor.red, fadePosition),
                this.mixComponent(startColor.green, endColor.green, fadePosition),
                this.mixComponent(startColor.blue, endColor.blue, fadePosition)
            );
        }

        private static mixComponent(startValue: number, endValue: number, pos: number) {
            var res = (startValue + ((endValue - startValue) * pos)) | 0;
            res = this.fixComponent(res);
            return res;
        }

        private _argb = 0;

        constructor(argb: number) {
            argb = argb | 0;
            this._argb = argb;
        }

        get argb() {
            return this._argb;
        }

        get alpha() {
            return (this._argb >>> 24) & 0xff;
        }

        get red() {
            return (this._argb >>> 16) & 0xff;
        }

        get green() {
            return (this._argb >>> 8) & 0xff;
        }

        get blue() {
            return this._argb & 0xff;
        }

        fade(fadeColor: Color, fadePosition: number) {
            return Color.fadeColors(this, fadeColor, fadePosition);
        }

        toCSS() {
            return "rgba(" + this.red + ", " + this.green + ", " + this.blue + ", " + (this.alpha / 255.0) + ")";
        }

    }

    export class ColorBackground extends ABackground {

        private _color: Color = null;
        private _cache: string = null;

        constructor(color: Color) {
            super();
            this._color = color;
        }

        get color() {
            return this._color;
        }

        apply(element: HTMLElement) {
            if (this._cache != null) {
                element.style.backgroundColor = this._cache;
            } else {
                if (this._color == null) {
                    element.style.removeProperty("backgroundColor");
                } else {
                    this._cache = this._color.toCSS();
                    element.style.backgroundColor = this._cache;
                }
            }
        }

    }

    export class Padding implements IStyle {

        static create(padding: number) {
            return new Padding(padding, padding, padding, padding);
        }

        constructor(
            private _left: number,
            private _top: number,
            private _right: number,
            private _bottom: number) { }

        get left() {
            return this._left;
        }

        get top() {
            return this._top;
        }

        get right() {
            return this._right;
        }

        get bottom() {
            return this._bottom;
        }

        apply(element: HTMLElement) {
            element.style.paddingLeft = this._left + "px";
            element.style.paddingTop = this._top + "px";
            element.style.paddingRight = this._right + "px";
            element.style.paddingBottom = this._bottom + "px";
        }

    }

    export class Border implements IStyle {

        static create(width: number, color: Color, radius: number) {
            return new Border(width, width, width, width, color, color, color, color, radius, radius, radius, radius);
        }

        constructor(
            private _leftWidth: number,
            private _topWidth: number,
            private _rightWidth: number,
            private _bottomWidth: number,
            private _leftColor: Color,
            private _topColor: Color,
            private _rightColor: Color,
            private _bottomColor: Color,
            private _topLeftRadius: number,
            private _topRightRadius: number,
            private _bottomLeftRadius: number,
            private _bottomRightRadius: number) {
            if (this._leftColor == null) {
                this._leftColor = Color.TRANSPARENT;
            }
            if (this._topColor == null) {
                this._topColor = Color.TRANSPARENT;
            }
            if (this._rightColor == null) {
                this._rightColor = Color.TRANSPARENT;
            }
            if (this._bottomColor == null) {
                this._bottomColor = Color.TRANSPARENT;
            }
        }

        get leftWidth() {
            return this._leftWidth;
        }
        get topWidth() {
            return this._topWidth;
        }
        get rightWidth() {
            return this._rightWidth;
        }
        get bottomWidth() {
            return this._bottomWidth;
        }

        get leftColor() {
            return this._leftColor;
        }
        get topColor() {
            return this._topColor;
        }
        get rightColor() {
            return this._rightColor;
        }
        get bottomColor() {
            return this._bottomColor;
        }

        get topLeftRadius() {
            return this._topLeftRadius;
        }
        get topRightRadius() {
            return this._topRightRadius;
        }
        get bottomLeftRadius() {
            return this._bottomLeftRadius;
        }
        get bottomRightRadius() {
            return this._bottomRightRadius;
        }

        apply(element: HTMLElement) {
            element.style.borderStyle = "solid";
            element.style.borderLeftColor = this._leftColor.toCSS();
            element.style.borderLeftWidth = this._leftWidth + "px";
            element.style.borderTopColor = this._topColor.toCSS();
            element.style.borderTopWidth = this._topWidth + "px";
            element.style.borderRightColor = this._rightColor.toCSS();
            element.style.borderRightWidth = this._rightWidth + "px";
            element.style.borderBottomColor = this._bottomColor.toCSS();
            element.style.borderBottomWidth = this._bottomWidth + "px";

            element.style.borderTopLeftRadius = this._topLeftRadius + "px";
            element.style.borderTopRightRadius = this._topRightRadius + "px";
            element.style.borderBottomLeftRadius = this._bottomLeftRadius + "px";
            element.style.borderBottomRightRadius = this._bottomRightRadius + "px";
        }

    }

    export class BoxShadow implements IStyle {

        constructor(
            private _hPos: number,
            private _vPos: number,
            private _blur: number,
            private _spread: number,
            private _color: Color,
            private _inner: boolean) { }

        get hPos() {
            return this._hPos;
        }

        get vPos() {
            return this._vPos;
        }

        get blur() {
            return this._blur;
        }

        get spread() {
            return this._spread;
        }

        get color() {
            return this._color;
        }

        get inner() {
            return this._inner;
        }

        apply(element: HTMLElement) {
            element.style.boxShadow = this._hPos + "px " + this._vPos + "px " + this._blur + "px " + this._spread + "px "
            + this._color.toCSS() + (this._inner ? " inset" : "");
        }

    }

}


