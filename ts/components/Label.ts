namespace cubee {

    export class Label extends AComponent {

        private _width = new NumberProperty(null, true, false);
        private _height = new NumberProperty(null, true, false);
        private _text = new StringProperty("", false, false);
        private _textOverflow = new Property<ETextOverflow>(ETextOverflow.CLIP, false, false);
        private _foreColor = new ColorProperty(Color.BLACK, true, false);
        private _textAlign = new Property<ETextAlign>(ETextAlign.LEFT, false, false);
        private _verticalAlign = new Property<EVAlign>(EVAlign.TOP, false, false);
        private _italic = new BooleanProperty(false, false, false);
        private _underline = new BooleanProperty(false, false, false);
        private _fontSize = new NumberProperty(12, false, false);
        private _fontFamily = new Property<FontFamily>(FontFamily.Arial, false, false);
        private _fontWeight = new Property<number>(400, false, false, { validate(value: number)  {
            if (value < 901 && value > 1 && value % 100 == 0) {
                return value;
            }
            return 400;
        }});

        constructor() {
            super(document.createElement("div"));
            this._width.addChangeListener(() => {
                if (this.width == null) {
                    this.element.style.whiteSpace = "nowrap";
                    this.element.style.overflowX = "visible";
                    this.element.style.removeProperty("width");
                } else {
                    this.element.style.whiteSpace = "normal";
                    this.element.style.overflowX = "hidden";
                    this.element.style.width = this.width + "px";
                }
                this.requestLayout();
            });
            this._width.invalidate();
            this._height.addChangeListener(() => {
                if (this.height == null) {
                    this.element.style.removeProperty("height")
                    this.element.style.overflowY = "visible";
                } else {
                    this.element.style.height = this.height + "px";
                    this.element.style.overflowY = "hidden";
                }
                this.requestLayout();
            });
            this._height.invalidate();
            this._text.addChangeListener(() => {
                this.element.innerHTML = this.text;
                this.requestLayout()
            });
            this._text.invalidate();
            this._textOverflow.addChangeListener(() => {
                this.textOverflow.apply(this.element);
                if (this.textOverflow == ETextOverflow.ELLIPSIS) {
                    this.element.style.whiteSpace = "nowrap";
                    this.element.style.overflow = "hidden";
                } else {
                    this.element.style.removeProperty("whiteSpace");
                    this._width.invalidate();
                    this._height.invalidate();
                }
                this.requestLayout();
            });
            this._textOverflow.invalidate();
            this._foreColor.addChangeListener(() => {
                if (this.foreColor == null) {
                    this.element.style.color = "rgba(0,0,0,0.0)";
                } else {
                    this.element.style.color = this.foreColor.toCSS();
                }
            });
            this._foreColor.invalidate();
            this._textAlign.addChangeListener(() => {
                this.textAlign.apply(this.element);
            });
            this._textAlign.invalidate();
            this._verticalAlign.addChangeListener(() => {
                let ta = this.verticalAlign;
                if (ta == EVAlign.TOP) {
                    this.element.style.verticalAlign = "top";
                } else if (ta == EVAlign.MIDDLE) {
                    this.element.style.verticalAlign = "middle";
                } else if (ta == EVAlign.BOTTOM) {
                    this.element.style.verticalAlign = "bottom";
                }
            });
            this._verticalAlign.invalidate();
            this._underline.addChangeListener(() => {
                if (this.underline) {
                    this.element.style.textDecoration = "underline";
                } else {
                    this.element.style.textDecoration = "none";
                }
                this.requestLayout();
            });
            this._underline.invalidate();
            this._fontWeight.addChangeListener(() => {
                this.element.style.fontWeight = "" + (this._fontWeight.value | 0);
                this.requestLayout();
            });
            this._fontWeight.invalidate();
            this._italic.addChangeListener(() => {
                if (this.italic) {
                    this.element.style.fontStyle = "italic";
                } else {
                    this.element.style.fontStyle = "normal";
                }
                this.requestLayout();
            });
            this._italic.invalidate();
            this._fontSize.addChangeListener(() => {
                this.element.style.fontSize = this.fontSize + "px";
                this.requestLayout();
            });
            this._fontSize.invalidate();
            this._fontFamily.addChangeListener(() => {
                this.fontFamily.apply(this.element);
                this.requestLayout();
            });
            this._fontFamily.invalidate();
        }

        get Width() {
            return this._width;
        }
        get width() {
            return this.Width.value;
        }
        set width(value) {
            this.Width.value = value;
        }


        get Height() {
            return this._height;
        }
        get height() {
            return this.Height.value;
        }
        set height(value) {
            this.Height.value = value;
        }

        get Text() {
            return this._text;
        }
        get text() {
            return this.Text.value;
        }
        set text(value) {
            this.Text.value = value;
        }

        get TextOverflow() {
            return this._textOverflow;
        }
        get textOverflow() {
            return this.TextOverflow.value;
        }
        set textOverflow(value) {
            this.TextOverflow.value = value;
            this.Padding
        }

        get ForeColor() {
            return this._foreColor;
        }
        get foreColor() {
            return this.ForeColor.value;
        }
        set foreColor(value) {
            this.ForeColor.value = value;
        }

        get VerticalAlign() {
            return this._verticalAlign;
        }
        get verticalAlign() {
            return this.VerticalAlign.value;
        }
        set verticalAlign(value) {
            this.VerticalAlign.value = value;
        }

        get FontWeight() {
            return this._fontWeight;
        }
        get fontWeight() {
            return this.FontWeight.value;
        }
        set fontWeight(value) {
            this.FontWeight.value = value;
        }

        get Italic() {
            return this._italic;
        }
        get italic() {
            return this.Italic.value;
        }
        set italic(value) {
            this.Italic.value = value;
        }

        get Underline() {
            return this._underline;
        }
        get underline() {
            return this.Underline.value;
        }
        set underline(value) {
            this.Underline.value = value;
        }

        get TextAlign() {
            return this._textAlign;
        }
        get textAlign() {
            return this.TextAlign.value;
        }
        set textAlign(value) {
            this.TextAlign.value = value;
        }

        get FontSize() {
            return this._fontSize;
        }
        get fontSize() {
            return this.FontSize.value;
        }
        set fontSize(value) {
            this.FontSize.value = value;
        }

        get FontFamily() {
            return this._fontFamily;
        }
        get fontFamily() {
            return this.FontFamily.value;
        }
        set fontFamily(value) {
            this.FontFamily.value = value;
        }

    }

}


