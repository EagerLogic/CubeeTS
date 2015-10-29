module cubee {

    export class FAIcon extends AUserControl {

        private static _initialized = false;

        private static initFA() {
            FAIcon._initialized = true;
            var w: any = window;
            w.fastyle = document.createElement("link");
            w.faststyle.href = "//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css";
            document.getElementsByTagName("head")[0].appendChild(w.fastyle);
        }

        private _size = new NumberProperty(16, false, false);
        private _color = new ColorProperty(Color.BLACK, false, false);
        private _spin = new BooleanProperty(false, false, false);
        private _icon = new Property<EIcon>(EIcon.BAN, false, false);

        private _iElement: HTMLElement = null;

        private _changeListener: IChangeListener = () => {
            this.refreshStyle();
        };



        constructor(icon: EIcon) {
            super();
            if (!FAIcon._initialized) {
                FAIcon.initFA();
            }
            if (icon == null) {
                throw "The icon parameter can not be null.";
            }

            super.widthProperty().bind(this._size);
            super.heightProperty().bind(this._size);
            this.element.style.textAlign = "center";
            this._icon.value = icon;

            this._iElement = document.createElement("i");
            this.element.appendChild(this._iElement);

            this._size.addChangeListener(this._changeListener);
            this._color.addChangeListener(this._changeListener);
            this._spin.addChangeListener(this._changeListener);
            this._icon.addChangeListener(this._changeListener);

            this.refreshStyle();
        }

        private refreshStyle() {
            this._iElement.className = "fa";
            if (this.icon != null) {
                this._iElement.className = "fa " + this._icon.value.className;
            }

            this._iElement.style.fontSize = this.size + "px";
            this._iElement.style.color = this._color.value.toCSS();

            if (this.spin) {
                this._iElement.className = this._iElement.className = "fa-spin";
            }
            this.element.style.lineHeight = this.size + "px";
            this._iElement.style.backfaceVisibility = "hidden";
        }

        protected colorProperty() {
            return this._color;
        }
        get Color() {
            return this.colorProperty();
        }
        get color() {
            return this.Color.value;
        }
        set color(value) {
            this.Color.value = value;
        }

        protected sizeProperty() {
            return this._size;
        }
        get Size() {
            return this.sizeProperty();
        }
        get size() {
            return this.Size.value;
        }
        set size(value) {
            this.Size.value = value;
        }

        protected spinProperty() {
            return this._spin;
        }
        get Spin() {
            return this.spinProperty();
        }
        get spin() {
            return this.Spin.value;
        }
        set spin(value) {
            this.Spin.value = value;
        }

        protected iconProperty() {
            return this._icon;
        }
        get Icon() {
            return this.iconProperty();
        }
        get icon() {
            return this.Icon.value;
        }
        set icon(value) {
            this.Icon.value = value;
        }

    }

}


