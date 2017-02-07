namespace cubee {

    export class APopup {

        private _modal: boolean = false;
        private _autoClose = true;
        private _glassColor = Color.TRANSPARENT;

        private _translateX = new NumberProperty(0, false, false);
        private _translateY = new NumberProperty(0, false, false);
        private _center = new BooleanProperty(false, false, false);

        private _popupRoot: Panel = null;
        private _rootComponentContainer: Panel = null;
        private _rootComponent: AComponent = null;

        private _visible = false;

        constructor(modal: boolean = true, autoClose: boolean = true, glassColor = Color.getArgbColor(0x00000000)) {
            this._modal = modal;
            this._autoClose = autoClose;
            this._glassColor = glassColor;
            this._popupRoot = new Panel();
            this._popupRoot.element.style.left = "0px";
            this._popupRoot.element.style.top = "0px";
            this._popupRoot.element.style.right = "0px";
            this._popupRoot.element.style.bottom = "0px";
            this._popupRoot.element.style.position = "fixed";
            if (glassColor != null) {
                this._popupRoot.background = new ColorBackground(glassColor);
            }
            if (modal || autoClose) {
                this._popupRoot.element.style.pointerEvents = "all";
            } else {
                this._popupRoot.element.style.pointerEvents = "none";
                this._popupRoot.pointerTransparent = true;
            }

            this._rootComponentContainer = new Panel();
            this._rootComponentContainer.TranslateX.bind(new Expression<number>(() => {
                var baseX = 0;
                if (this._center.value) {
                    baseX = (this._popupRoot.clientWidth - this._rootComponentContainer.boundsWidth) / 2;
                }
                return baseX + this._translateX.value;
            }, this._center, this._popupRoot.ClientWidth, this._translateX,
                this._rootComponentContainer.BoundsWidth));
            this._rootComponentContainer.TranslateY.bind(new Expression<number>(() => {
                var baseY = 0;
                if (this._center.value) {
                    baseY = (this._popupRoot.clientHeight - this._rootComponentContainer.boundsHeight) / 2;
                }
                return baseY + this._translateY.value;
            }, this._center, this._popupRoot.ClientHeight, this._translateY,
                this._rootComponentContainer.BoundsHeight));
            this._popupRoot.children.add(this._rootComponentContainer);
            
            this._rootComponentContainer.onClick.addListener((evt) => {
                evt.stopPropagation();
            });

            if (autoClose) {
                this._popupRoot.onClick.addListener(() => {
                    this.close();
                });
            }
        }

        get __popupRoot() {
            return this._popupRoot;
        }

        protected get rootComponent() {
            return this._rootComponent;
        }

        protected set rootComponent(rootComponent: AComponent) {
            this._rootComponentContainer.children.clear();
            this._rootComponent = null;
            if (rootComponent != null) {
                this._rootComponentContainer.children.add(rootComponent);
            }
            this._rootComponent = rootComponent;
        }

        protected show() {
            if (this._visible) {
                throw "This popup is already shown.";
            }
            var body: HTMLBodyElement = document.getElementsByTagName("body")[0];
            body.appendChild(this._popupRoot.element);
            Popups._addPopup(this);
            this._visible = true;
        }

        protected close(): boolean {
            if (!this._visible) {
                throw "This popup isn't shown.";
            }
            if (!this.isCloseAllowed()) {
                return false;
            }
            var body: HTMLBodyElement = document.getElementsByTagName("body")[0];
            body.removeChild(this._popupRoot.element);
            Popups._removePopup(this);
            this._visible = false;
            this.onClosed();
            return true;
        }

        protected isCloseAllowed(): boolean {
            return true;
        }

        protected onClosed() {

        }

        get modal() {
            return this._modal;
        }

        get autoClose() {
            return this._autoClose;
        }

        get glassColor() {
            return this._glassColor;
        }

        get TranslateX() {
            return this._translateX;
        }
        get translateX() {
            return this.TranslateX.value;
        }
        set translateX(value) {
            this.TranslateX.value = value;
        }

        get TranslateY() {
            return this._translateY;
        }
        get translateY() {
            return this.TranslateY.value;
        }
        set translateY(value) {
            this.TranslateY.value = value;
        }

        get Center() {
            return this._center;
        }
        get center() {
            return this.Center.value;
        }
        set center(value) {
            this.Center.value = value;
        }

        _layout() {
            this._popupRoot.width = window.innerWidth;
            this._popupRoot.height = window.innerHeight;
            this._popupRoot.layout();
        }

    }

    export class Popups {

        private static _popups: APopup[] = [];
        private static _layoutRunOnce = new RunOnce(() => {
            Popups.layout();
        });

        static _addPopup(popup: APopup) {
            Popups._popups.push(popup);
            Popups._requestLayout();
        }

        static _removePopup(popup: APopup) {
            var idx = Popups._popups.indexOf(popup);
            if (idx > -1) {
                Popups._popups.splice(idx, 1);
                Popups._requestLayout();
            }
        }

        static _requestLayout() {
            Popups._layoutRunOnce.run();
        }

        private static layout() {
            Popups._popups.forEach((popup) => {
                popup._layout();
            });
        }

        constructor() {
            throw "Can not instantiate Popups class."
        }

    }

}


