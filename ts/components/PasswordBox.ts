namespace cubee {

    export class PasswordBox extends AComponent {

        private _width = new NumberProperty(null, true, false);
        private _height = new NumberProperty(null, true, false);
        private _text = new StringProperty("", false, false);
        private _background = new BackgroundProperty(new ColorBackground(Color.WHITE), true, false);
        private _foreColor = new ColorProperty(Color.BLACK, true, false);
        private _textAlign = new Property<ETextAlign>(ETextAlign.LEFT, false, false);
        private _verticalAlign = new Property<EVAlign>(EVAlign.TOP, false, false);
        private _bold = new BooleanProperty(false, false, false);
        private _italic = new BooleanProperty(false, false, false);
        private _underline = new BooleanProperty(false, false, false);
        private _fontSize = new NumberProperty(12, false, false);
        private _fontFamily = new Property<FontFamily>(FontFamily.Arial, false, false);
        private _placeholder = new StringProperty(null, true);

        constructor() {
            super(document.createElement("input"));
            this.element.setAttribute("type", "password");

            this.border = Border.create(1, Color.LIGHT_GRAY, 0);
            this._width.addChangeListener(() => {
                if (this.width == null) {
                    this.element.style.removeProperty("width");
                } else {
                    this.element.style.width = this.width + "px";
                }
                this.requestLayout();
            });
            this._height.addChangeListener(() => {
                if (this.height == null) {
                    this.element.style.removeProperty("height");
                } else {
                    this.element.style.height = this.height + "px";
                }
                this.requestLayout();
            });
            this._text.addChangeListener(() => {
                if (this.text != this.element.getAttribute("value")) {
                    this.element.setAttribute("value", this.text);
                }
            });
            this._foreColor.addChangeListener(() => {
                if (this.foreColor == null) {
                    this.element.style.color = "rgba(0,0,0, 0.0)";
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
            this._bold.addChangeListener(() => {
                if (this.bold) {
                    this.element.style.fontWeight = "bold";
                } else {
                    this.element.style.fontWeight = "normal";
                }
                this.requestLayout();
            });
            this._bold.invalidate();
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
            this._background.addChangeListener(() => {
                if (this.background == null) {
                    this.element.style.removeProperty("backgroundColor");
                    this.element.style.removeProperty("backgroundImage");
                } else {
                    this.background.apply(this.element);
                }
            });
            this._background.invalidate();

            this._placeholder.addChangeListener(() => {
                if (this.placeholder == null) {
                    this.element.removeAttribute("placeholder");
                } else {
                    this.element.setAttribute("placeholder", this.placeholder);
                }
            });
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

        get Background() {
            return this._background;
        }
        get background() {
            return this.Background.value;
        }
        set background(value) {
            this.Background.value = value;
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

        get TextAlign() {
            return this._textAlign;
        }
        get textAlign() {
            return this.TextAlign.value;
        }
        set textAlign(value) {
            this.TextAlign.value = value;
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

        get Bold() {
            return this._bold;
        }
        get bold() {
            return this.Bold.value;
        }
        set bold(value) {
            this.Bold.value = value;
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

        get Placeholder() {
            return this._placeholder;
        }
        get placeholder() {
            return this.Placeholder.value;
        }
        set placeholder(value) {
            this.Placeholder.value = value;
        }

    }

}


