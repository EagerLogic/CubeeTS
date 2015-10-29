module cubee {
    
    export class Button extends AComponent {
        
        private _width = new NumberProperty(null, true, false);
        private _height = new NumberProperty(null, true, false);
        private _text = new StringProperty("", false, false);
        private _textOverflow = new Property<ETextOverflow>(ETextOverflow.CLIP, false, false);
        private _foreColor = new ColorProperty(Color.BLACK, true, false);
        private _textAlign = new Property<ETextAlign>(ETextAlign.CENTER, false, false);
        private _verticalAlign = new Property<EVAlign>(EVAlign.MIDDLE, false, false);
        private _bold = new BooleanProperty(false, false, false);
        private _italic = new BooleanProperty(false, false, false);
        private _underline = new BooleanProperty(false, false, false);
        private _fontSize = new NumberProperty(12, false, false);
        private _fontFamily = new Property<FontFamily>(FontFamily.Arial, false, false);
        private _background = new BackgroundProperty(new ColorBackground(Color.TRANSPARENT), true, false);
        private _shadow = new Property<BoxShadow>(null, true, false);

        constructor() {
            super(document.createElement("button"));
            this.padding = Padding.create(10);
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
                this.element.style.removeProperty("backgroundColor");
                this.element.style.removeProperty("backgroundImage");
                this.element.style.removeProperty("background");
                if (this._background.value != null) {
                    this._background.value.apply(this.element);
                }
            });
            this._background.invalidate();
            this._shadow.addChangeListener(() => {
                if (this._shadow.value == null) {
                    this.element.style.removeProperty("boxShadow");
                } else {
                    this._shadow.value.apply(this.element);
                }
            });
            
            this.border = Border.create(1, Color.LIGHT_GRAY, 2);
            this.fontSize = 14;
            this.bold = true;
            this.background = new ColorBackground(Color.WHITE);
            this.shadow = new BoxShadow(1, 1, 5, 0, Color.LIGHT_GRAY, false);
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
        
        get Background() {
            return this._background;
        }
        get background() {
            return this.Background.value;
        }
        set background(value) {
            this.Background.value = value;
        }

        get Shadow() {
            return this._shadow;
        }
        get shadow() {
            return this.Shadow.value;
        }
        set shadow(value) {
            this.Shadow.value = value;
        }


    }
    
}


