namespace cubee {

    export abstract class AUserControl extends ALayout {

        private _width = new NumberProperty(null, true, false);
        private _height = new NumberProperty(null, true, false);
        private _background = new BackgroundProperty(new ColorBackground(Color.TRANSPARENT), true, false);
        private _shadow = new Property<BoxShadow>(null, true, false);
        private _draggable = new BooleanProperty(false);

        constructor() {
            super(document.createElement("div"));
            this.element.style.overflowX = "hidden";
            this.element.style.overflowY = "hidden";
            this._width.addChangeListener(() => {
                if (this._width.value == null) {
                    this.element.style.removeProperty("width");
                } else {
                    this.element.style.width = "" + this._width.value + "px";
                }
                this.requestLayout();
            });
            this._width.invalidate();
            this._height.addChangeListener(() => {
                if (this._height.value == null) {
                    this.element.style.removeProperty("height");
                } else {
                    this.element.style.height = "" + this._height.value + "px";
                }
                this.requestLayout();
            });
            this._height.invalidate();
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
            this._draggable.addChangeListener(() => {
                if (this._draggable.value) {
                    this.element.setAttribute("draggable", "true");
                } else {
                    this.element.setAttribute("draggable", "false");
                }
            });
            this._draggable.invalidate();
        }

        protected widthProperty() {
            return this._width;
        }
        protected get Width() {
            return this.widthProperty();
        }
        protected get width() {
            return this.Width.value;
        }
        protected set width(value) {
            this.Width.value = value;
        }



        protected heightProperty() {
            return this._height;
        }
        protected get Height() {
            return this.heightProperty();
        }
        protected get height() {
            return this.Height.value;
        }
        protected set height(value) {
            this.Height.value = value;
        }


        protected backgroundProperty() {
            return this._background;
        }
        protected get Background() {
            return this.backgroundProperty();
        }
        protected get background() {
            return this.Background.value;
        }
        protected set background(value) {
            this.Background.value = value;
        }


        protected shadowProperty() {
            return this._shadow;
        }
        protected get Shadow() {
            return this.shadowProperty();
        }
        protected get shadow() {
            return this.Shadow.value;
        }
        protected set shadow(value) {
            this.Shadow.value = value;
        }


        get Draggable() {
            return this._draggable;
        }
        get draggable() {
            return this.Draggable.value;
        }
        set draggable(value) {
            this.Draggable.value = value;
        }

        public _onChildAdded(child: AComponent) {
            if (child != null) {
                this.element.appendChild(child.element);
            }
            this.requestLayout();
        }

        public _onChildRemoved(child: AComponent, index: number) {
            if (child != null) {
                this.element.removeChild(child.element);
            }
            this.requestLayout();
        }

        public _onChildrenCleared() {
            var root = this.element;
            var e = this.element.firstElementChild;
            while (e != null) {
                root.removeChild(e);
                e = root.firstElementChild;
            }
            this.requestLayout();
        }

        protected onLayout() {
            if (this.width != null && this.height != null) {
                this.setSize(this.width, this.height);
            } else {
                var maxW = 0;
                var maxH = 0;
                for (var i = 0; i < this.children_inner.size(); i++) {
                    let component = this.children_inner.get(i);
                    let cW = component.boundsWidth + component.boundsLeft + component.translateX;
                    let cH = component.boundsHeight + component.boundsTop + component.translateY;

                    if (cW > maxW) {
                        maxW = cW;
                    }

                    if (cH > maxH) {
                        maxH = cH;
                    }
                }

                if (this.width != null) {
                    maxW = this.height;
                }

                if (this.height != null) {
                    maxH = this.height;
                }

                this.setSize(maxW, maxH);
            }
        }

    }

}


