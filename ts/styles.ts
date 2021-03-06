

namespace cubee {

    export interface IStyle {

        apply(element: HTMLElement): void;

    }

    export abstract class ABackground implements IStyle {

        abstract apply(element: HTMLElement): void;

    }

    export class Color {

        private static _TRANSPARENT = Color.argb(0x00000000);
        static get TRANSPARENT() {
            return Color._TRANSPARENT;
        }

        private static _WHITE = Color.argb(0xffffffff);
        static get WHITE() {
            return Color._WHITE;
        }

        private static _BLACK = Color.argb(0xff000000);
        static get BLACK() {
            return Color._BLACK;
        }

        private static _LIGHT_GRAY = Color.argb(0xffcccccc);
        static get LIGHT_GRAY() {
            return Color._LIGHT_GRAY;
        }

        public static argb(argb: number): Color {
            return new Color(argb);
        }

        public static argb2(alpha: number, red: number, green: number, blue: number) {
            alpha = this.fixComponent(alpha);
            red = this.fixComponent(red);
            green = this.fixComponent(green);
            blue = this.fixComponent(blue);

            return this.argb(
                alpha << 24
                | red << 16
                | green << 8
                | blue
            );
        }

        public static rgb(rgb: number) {
            return this.argb(rgb | 0xff000000);
        }

        public static rgb2(red: number, green: number, blue: number) {
            return this.argb2(255, red, green, blue);
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
            return Color.argb2(
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

    export class ETextOverflow implements IStyle {

        private static _CLIP = new ETextOverflow("clip");
        private static _ELLIPSIS = new ETextOverflow("ellipsis");

        static get CLIP() {
            return ETextOverflow._CLIP;
        }

        static get ELLIPSIS() {
            return ETextOverflow._ELLIPSIS;
        }

        constructor(private _css: string) {
        }

        get CSS() {
            return this._css;
        }

        apply(element: HTMLElement) {
            element.style.textOverflow = this._css;
        }

    }

    export class ETextAlign implements IStyle {

        private static _LEFT = new ETextAlign("left");
        private static _CENTER = new ETextAlign("center");
        private static _RIGHT = new ETextAlign("right");
        private static _JUSTIFY = new ETextAlign("justify");

        static get LEFT() {
            return ETextAlign._LEFT;
        }

        static get CENTER() {
            return ETextAlign._CENTER;
        }

        static get RIGHT() {
            return ETextAlign._RIGHT;
        }

        static get JUSTIFY() {
            return ETextAlign._JUSTIFY;
        }

        constructor(private _css: string) {
        }

        get CSS() {
            return this._css;
        }

        apply(element: HTMLElement) {
            element.style.textAlign = this._css;
        }

    }

    export class EHAlign {

        private static _LEFT = new EHAlign("left");
        private static _CENTER = new EHAlign("center");
        private static _RIGHT = new EHAlign("right");

        static get LEFT() {
            return EHAlign._LEFT;
        }

        static get CENTER() {
            return EHAlign._CENTER;
        }

        static get RIGHT() {
            return EHAlign._RIGHT;
        }

        constructor(private _css: string) {
        }

        get CSS() {
            return this._css;
        }

    }

    export class EVAlign {

        private static _TOP = new EVAlign("top");
        private static _MIDDLE = new EVAlign("middle");
        private static _BOTTOM = new EVAlign("bottom");

        static get TOP() {
            return EVAlign._TOP;
        }

        static get MIDDLE() {
            return EVAlign._MIDDLE;
        }

        static get BOTTOM() {
            return EVAlign._BOTTOM;
        }

        constructor(private _css: string) {
        }

        get CSS() {
            return this._css;
        }

    }

    export class FontFamily implements IStyle {

        private static _arial = new FontFamily("Arial, Helvetica, sans-serif");
        public static get Arial() {
            return FontFamily._arial;
        }

        private static initialized = false;

        private static initFontContainerStyle() {
            var wnd: any = window;
            wnd.fontsStyle = document.createElement("style");
            wnd.fontsStyle.type = "text/css";
            var doc: any = document;
            doc.getElementsByTagName("head")[0].appendChild(wnd.fontsStyle);
        }

        public static registerFont(name: string, src: string, extra: string) {
            var ex = extra;
            if (ex == null) {
                ex = '';
            }
            var ct = "@font-face {font-family: '" + name + "'; src: url('" + src + "');" + ex + "}";
            var ih = (<any>window).fontsStyle.innerHTML;
            if (ih == null) {
                ih = '';
            }
            (<any>window).fontsStyle.innerHTML = ih + ct;
        }

        constructor(private _css: string) {
            if (!FontFamily.initialized) {
                FontFamily.initFontContainerStyle();
            }
        }

        get CSS() {
            return this._css;
        }

        apply(element: HTMLElement) {
            element.style.fontFamily = this._css;
        }

    }

    export class ECursor {

        private static auto = new ECursor("auto");
        static get AUTO() {
            return ECursor.auto;
        }
        
        private static pointer = new ECursor("pointer");
        static get POINTER() {
            return ECursor.pointer;
        }

        constructor(private _css: string) { }

        get css() {
            return this._css;
        }
    }

    export enum EScrollBarPolicy {

        VISIBLE,
        AUTO,
        HIDDEN

    }

    export enum EPictureSizeMode {

        NORMAL,
        CENTER,
        STRETCH,
        FILL,
        ZOOM,
        FIT_WIDTH,
        FIT_HEIGHT

    }

    export class Image implements IStyle {

        private _onLoad = new Event<EventArgs>();

        private _width = 0;
        private _height = 0;
        private _loaded = false;

        constructor(private _url: string) {
            if (_url == null) {
                throw "The url parameter can not be null.";
            }
            let e = <HTMLImageElement>document.createElement("img");
            e.addEventListener("load", () => {
                this._width = e.width;
                this._height = e.height;
                this._loaded = true;
                this._onLoad.fireEvent(new EventArgs(this));
            });
            e.src = _url;
        }

        get url() {
            return this._url;
        }

        get onLoad() {
            return this._onLoad;
        }

        get width() {
            return this._width;
        }

        get height() {
            return this._height;
        }

        get loaded() {
            return this._loaded;
        }

        apply(element: HTMLElement) {
            element.setAttribute("src", this.url);
        }

    }

}


