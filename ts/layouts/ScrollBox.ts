module cubee {

    export class ScrollBox extends AUserControl {

        private _content = new Property<AComponent>(null);
        private _hScrollPolicy = new Property<EScrollBarPolicy>(EScrollBarPolicy.AUTO, false);
        private _vScrollPolicy = new Property<EScrollBarPolicy>(EScrollBarPolicy.AUTO, false);
        private _scrollWidth = new NumberProperty(0, false, true);
        private _scrollHeight = new NumberProperty(0, false, true);
        private _hScrollPos = new NumberProperty(0, false, true);
        private _vScrollPos = new NumberProperty(0, false, true);
        private _maxHScrollPos = new NumberProperty(0, false, true);
        private _maxVScrollPos = new NumberProperty(0, false, true);
        private _maxHScrollPosWriter = new NumberProperty(0, false, false);
        private _maxVScrollPosWriter = new NumberProperty(0, false, false);

        private _calculateScrollWidthExp = new Expression<number>(() => {
            if (this.content == null) {
                return 0;
            }
            return this.content.boundsWidth;
        }, this._content);
        private _calculateScrollHeightExp = new Expression<number>(() => {
            if (this.content == null) {
                return 0;
            }
            return this.content.boundsHeight;
        }, this._content);

        constructor() {
            super();
            this.element.style.removeProperty("overflow");

            this._scrollWidth.initReadonlyBind(this._calculateScrollWidthExp);
            this._scrollHeight.initReadonlyBind(this._calculateScrollHeightExp);

            this._maxHScrollPos.initReadonlyBind(this._maxHScrollPosWriter);
            this._maxVScrollPos.initReadonlyBind(this._maxVScrollPosWriter);

            this._maxHScrollPosWriter.bind(new Expression<number>(() => {
                return (this.scrollWidth - this.clientWidth);
            }, this.ClientWidth, this._scrollWidth));

            this._maxVScrollPosWriter.bind(new Expression<number>(() => {
                return (this.scrollHeight - this.clientHeight);
            }, this.ClientHeight, this._scrollHeight));

            this._content.addChangeListener(() => {
                this.children_inner.clear();
                this._calculateScrollWidthExp.unbindAll();
                this._calculateScrollWidthExp.bind(this._content);
                if (this.content != null) {
                    this._calculateScrollWidthExp.bind(this.content.BoundsWidth);
                }

                this._calculateScrollHeightExp.unbindAll();
                this._calculateScrollHeightExp.bind(this._content);
                if (this.content != null) {
                    this._calculateScrollHeightExp.bind(this.content.BoundsHeight);
                }

                if (this.content != null) {
                    this.children_inner.add(this.content);
                }
            });

            this.element.addEventListener("scroll", (evt) => {
                this.hScrollPos = this.element.scrollLeft;
                this.vScrollPos = this.element.scrollTop;
            });

            this._hScrollPos.addChangeListener(() => {
                this.element.scrollLeft = this.hScrollPos;
            });
            this._hScrollPos.addChangeListener(() => {
                this.element.scrollTop = this.vScrollPos;
            });

            this._hScrollPolicy.addChangeListener(() => {
                if (this.hScrollPolicy == EScrollBarPolicy.AUTO) {
                    this.element.style.overflowX = "auto";
                } else if (this.hScrollPolicy == EScrollBarPolicy.HIDDEN) {
                    this.element.style.overflowX = "hidden";
                } else if (this.hScrollPolicy == EScrollBarPolicy.VISIBLE) {
                    this.element.style.overflowX = "scroll";
                }
            });
            this._hScrollPolicy.invalidate();
            this._vScrollPolicy.addChangeListener(() => {
                if (this.vScrollPolicy == EScrollBarPolicy.AUTO) {
                    this.element.style.overflowY = "auto";
                } else if (this.vScrollPolicy == EScrollBarPolicy.HIDDEN) {
                    this.element.style.overflowY = "hidden";
                } else if (this.vScrollPolicy == EScrollBarPolicy.VISIBLE) {
                    this.element.style.overflowY = "scroll";
                }
            });
            this._vScrollPolicy.invalidate();
        }

        protected widthProperty() {
            return super.widthProperty();
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
            return super.heightProperty();
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


        get Content() {
            return this._content;
        }
        get content() {
            return this.Content.value;
        }
        set content(value) {
            this.Content.value = value;
        }

        get HScrollPolicy() {
            return this._hScrollPolicy;
        }
        get hScrollPolicy() {
            return this.HScrollPolicy.value;
        }
        set hScrollPolicy(value) {
            this.HScrollPolicy.value = value;
        }

        get VScrollPolicy() {
            return this._vScrollPolicy;
        }
        get vScrollPolicy() {
            return this.VScrollPolicy.value;
        }
        set vScrollPolicy(value) {
            this.VScrollPolicy.value = value;
        }

        get ScrollWidth() {
            return this._scrollWidth;
        }
        get scrollWidth() {
            return this.ScrollWidth.value;
        }
        set scrollWidth(value) {
            this.ScrollWidth.value = value;
        }

        get ScrollHeight() {
            return this._scrollHeight;
        }
        get scrollHeight() {
            return this.ScrollHeight.value;
        }
        set scrollHeight(value) {
            this.ScrollHeight.value = value;
        }

        get HScrollPos() {
            return this._hScrollPos;
        }
        get hScrollPos() {
            return this.HScrollPos.value;
        }
        set hScrollPos(value) {
            this.HScrollPos.value = value;
        }

        get VScrollPos() {
            return this._vScrollPos;
        }
        get vScrollPos() {
            return this.VScrollPos.value;
        }
        set vScrollPos(value) {
            this.VScrollPos.value = value;
        }

        get MaxHScrollPos() {
            return this._maxHScrollPos;
        }
        get maxHScrollPos() {
            return this.MaxHScrollPos.value;
        }
        set maxHScrollPos(value) {
            this.MaxHScrollPos.value = value;
        }

        get MaxVScrollPos() {
            return this._maxVScrollPos;
        }
        get maxVScrollPos() {
            return this.MaxVScrollPos.value;
        }
        set maxVScrollPos(value) {
            this.MaxVScrollPos.value = value;
        }

    }

}


