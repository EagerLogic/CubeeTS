namespace cubee {

    export class PictureBox extends AComponent {

        private _width = new NumberProperty(50, false, false);
        private _height = new NumberProperty(50, false, false);
        private _pictureSizeMode = new Property<EPictureSizeMode>(EPictureSizeMode.NORMAL, false, false);
        private _image = new Property<Image>(null, true, false);
        private _background = new BackgroundProperty(null, true, false);
        private _imgElement: HTMLImageElement = null;

        constructor() {
            super(document.createElement("div"));
            this.element.style.overflow = "hidden";
            this._imgElement = document.createElement("img");
            this._imgElement.style.position = "absolute";
            this.element.appendChild(this._imgElement);
            this._width.addChangeListener(() => {
                this.recalculateSize();
            });
            this._width.invalidate();
            this._height.addChangeListener(() => {
                this.recalculateSize();
            });
            this._height.invalidate();
            this._pictureSizeMode.addChangeListener(() => {
                this.recalculateSize();
            });
            this._pictureSizeMode.invalidate();
            this._image.addChangeListener(() => {
                if (this._image.value != null) {
                    this.image.apply(this._imgElement);
                    if (!this.image.loaded) {
                        this.image.onLoad.addListener(() => {
                            this.recalculateSize();
                        });
                    }
                } else {
                    this._imgElement.setAttribute("src", "");
                }
                this.recalculateSize();
            });
            this._image.invalidate();
            this._background.addChangeListener(() => {
                if (this.background == null) {
                    this.element.style.removeProperty("backgroundColor");
                    this.element.style.removeProperty("backgroundImage");
                } else {
                    this.background.apply(this.element);
                }
            });
            this._background.invalidate();
        }

        private recalculateSize() {
            this.element.style.width = this.width + "px";
            this.element.style.height = this.height + "px";
            let psm = this.pictureSizeMode;
            let imgWidth = 0;
            let imgHeight = 0;
            let picWidth = this.width;
            let picHeight = this.height;
            let cx = 0;
            let cy = 0;
            let cw = 0;
            let ch = 0;
            let imgRatio: number = null;
            let picRatio = picWidth / picHeight;

            if (this.image != null) {
                imgWidth = this.image.width;
                imgHeight = this.image.height;
            }
            if (imgWidth == 0 || imgHeight == 0) {
                // nothing to do here
            } else {
                imgRatio = imgWidth / imgHeight;
                if (psm == EPictureSizeMode.CENTER) {
                    cx = (imgWidth - picWidth) / 2;
                    cy = (imgHeight - picHeight) / 2;
                    cw = imgWidth;
                    ch = imgHeight;
                } else if (psm == EPictureSizeMode.FILL) {
                    if (imgRatio > picRatio) {
                        // fit height
                        cy = 0;
                        ch = picHeight;
                        cw = (ch * imgRatio) | 0;
                        cx = (picWidth - cw) / 2;
                    } else {
                        // fit width
                        cx = 0;
                        cw = picWidth;
                        ch = (cw / imgRatio) | 0;
                        cy = (picHeight - ch) / 2;
                    }
                } else if (psm == EPictureSizeMode.FIT_HEIGHT) {
                    cy = 0;
                    ch = picHeight;
                    cw = (ch * imgRatio) | 0;
                    cx = (picWidth - cw) / 2;
                } else if (psm == EPictureSizeMode.FIT_WIDTH) {
                    cx = 0;
                    cw = picWidth;
                    ch = (cw / imgRatio) | 0;
                    cy = (picHeight - ch) / 2;
                } else if (psm == EPictureSizeMode.NORMAL) {
                    cx = 0;
                    cy = 0;
                    cw = imgWidth;
                    ch = imgHeight;
                } else if (psm == EPictureSizeMode.STRETCH) {
                    cx = 0;
                    cy = 0;
                    cw = picWidth;
                    ch = picHeight;
                } else if (psm == EPictureSizeMode.ZOOM) {
                    if (imgRatio > picRatio) {
                        // fit width
                        cx = 0;
                        cw = picWidth;
                        ch = (cw / imgRatio) | 0;
                        cy = (picHeight - ch) / 2;
                    } else {
                        // fit height
                        cy = 0;
                        ch = picHeight;
                        cw = (ch * imgRatio) | 0;
                        cx = (picWidth - cw) / 2;
                    }
                }
            }
            
            this._imgElement.style.left = cx + "px";
            this._imgElement.style.top = cy + "px";
            this._imgElement.style.width = cw + "px";
            this._imgElement.style.height = ch + "px";
            this.requestLayout();
        }

        protected pictureSizeModeProperty() {
            return this._pictureSizeMode;
        }
        get PictureSizeMode() {
            return this.pictureSizeModeProperty();
        }
        get pictureSizeMode() {
            return this.PictureSizeMode.value;
        }
        set pictureSizeMode(value) {
            this.PictureSizeMode.value = value;
        }

        protected widthProperty() {
            return this._width;
        }
        get Width() {
            return this.widthProperty();
        }
        get width() {
            return this.Width.value;
        }
        set width(value) {
            this.Width.value = value;
        }

        protected heightProperty() {
            return this._height;
        }
        get Height() {
            return this.heightProperty();
        }
        get height() {
            return this.Height.value;
        }
        set height(value) {
            this.Height.value = value;
        }

        protected paddingProperty() {
            return super.paddingProperty();
        }
        get Padding() {
            return this.paddingProperty();
        }
        get padding() {
            return this.Padding.value;
        }
        set padding(value) {
            this.Padding.value = value;
        }

        protected borderProperty() {
            return super.borderProperty();
        }
        get Border() {
            return this.borderProperty();
        }
        get border() {
            return this.Border.value;
        }
        set border(value) {
            this.Border.value = value;
        }

        protected backgroundProperty() {
            return this._background;
        }
        get Background() {
            return this.backgroundProperty();
        }
        get background() {
            return this.Background.value;
        }
        set background(value) {
            this.Background.value = value;
        }

        protected imageProperty() {
            return this._image;
        }
        get Image() {
            return this.imageProperty();
        }
        get image() {
            return this.Image.value;
        }
        set image(value) {
            this.Image.value = value;
        }

    }

}

