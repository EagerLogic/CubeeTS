namespace cubee {
    
    export class MouseEventTypes {

        public static MOUSE_DOWN = 0;
        public static MOUSE_MOVE = 1;
        public static MOUSE_UP = 2;
        public static MOUSE_ENTER = 3;
        public static MOUSE_LEAVE = 4;
        public static MOUSE_WHEEL = 5;

        constructor() { }

    }

    export abstract class AComponent {

        private _translateX = new NumberProperty(0, false, false);
        private _translateY = new NumberProperty(0, false, false);
        private _rotate = new NumberProperty(0.0, false, false);
        private _scaleX = new NumberProperty(1.0, false, false);
        private _scaleY = new NumberProperty(1.0, false, false);
        private _transformCenterX = new NumberProperty(0.5, false, false);
        private _transformCenterY = new NumberProperty(0.5, false, false);
        private _padding = new PaddingProperty(null, true, false);
        private _border = new BorderProperty(null, true, false);
        private _measuredWidth = new NumberProperty(0, false, true);
        private _measuredHeight = new NumberProperty(0, false, true);
        private _clientWidth = new NumberProperty(0, false, true);
        private _clientHeight = new NumberProperty(0, false, true);
        private _boundsWidth = new NumberProperty(0, false, true);
        private _boundsHeight = new NumberProperty(0, false, true);
        private _boundsLeft = new NumberProperty(0, false, true);
        private _boundsTop = new NumberProperty(0, false, true);
        private _measuredWidthSetter = new NumberProperty(0, false, false);
        private _measuredHeightSetter = new NumberProperty(0, false, false);
        private _clientWidthSetter = new NumberProperty(0, false, false);
        private _clientHeightSetter = new NumberProperty(0, false, false);
        private _boundsWidthSetter = new NumberProperty(0, false, false);
        private _boundsHeightSetter = new NumberProperty(0, false, false);
        private _boundsLeftSetter = new NumberProperty(0, false, false);
        private _boundsTopSetter = new NumberProperty(0, false, false);
        private _cursor = new Property<ECursor>(ECursor.AUTO, false, false);
        private _pointerTransparent = new Property<boolean>(false, false, false);
        private _handlePointer = new Property<boolean>(true, false, false);
        private _visible = new Property<boolean>(true, false, false);
        private _enabled = new Property<boolean>(true, false, false);
        private _alpha = new NumberProperty(1.0, false, false);
        private _selectable = new Property<boolean>(false, false, false);
        private _minWidth = new NumberProperty(null, true, false);
        private _minHeight = new NumberProperty(null, true, false);
        private _maxWidth = new NumberProperty(null, true, false);
        private _maxHeight = new NumberProperty(null, true, false);
        private _hovered = new Property<boolean>(false, false, true);
        private _hoveredSetter = new Property<boolean>(false, false, false);
        private _pressed = new Property<boolean>(false, false, true);
        private _pressedSetter = new Property<boolean>(false, false, false);
        private _onClick = new Event<MouseEvent>();
        private _onMouseDown = new Event<MouseEvent>();
        private _onMouseDrag = new Event<MouseEvent>();
        private _onMouseMove = new Event<MouseEvent>();
        private _onMouseUp = new Event<MouseEvent>();
        private _onMouseEnter = new Event<MouseEvent>();
        private _onMouseLeave = new Event<MouseEvent>();
        private _onMouseWheel = new Event<MouseEvent>();
        private _onKeyDown = new Event<KeyboardEvent>();
        private _onKeyPress = new Event<KeyboardEvent>();
        private _onKeyUp = new Event<KeyboardEvent>();
        private _onParentChanged = new Event<ParentChangedEventArgs>();
        private _onContextMenu = new Event<Object>();
        private _left = 0;
        private _top = 0;
        private _element: HTMLElement;
        private _parent: ALayout;
        public _needsLayout = true;
        private _cubeePanel: CubeePanel;
        private _transformChangedListener = (sender: Object): void => {
            this.updateTransform();
            this.requestLayout();
        };
        private _postConstructRunOnce = new RunOnce(() => {
            this.postConstruct();
        });

        /**
         * Creates a new instance of AComponet.
         *
         * @param rootElement The underlaying HTML element which this component wraps.
         */
        constructor(rootElement: HTMLElement) {
            this._element = rootElement;
            this._element.setAttribute("data-cubee-component", this.getClassName());
            this._element.style.boxSizing = "border-box";
            this._element.setAttribute("draggable", "false");
            this._element.style.position = "absolute";
            this._element.style.outlineStyle = "none";
            this._element.style.outlineWidth = "0px";
            this._element.style.margin = "0px";
            this._element.style.pointerEvents = "all";
            this._translateX.addChangeListener(this._transformChangedListener);
            this._translateY.addChangeListener(this._transformChangedListener);
            this._rotate.addChangeListener(this._transformChangedListener);
            this._scaleX.addChangeListener(this._transformChangedListener);
            this._scaleY.addChangeListener(this._transformChangedListener);
            this._transformCenterX.addChangeListener(this._transformChangedListener);
            this._transformCenterY.addChangeListener(this._transformChangedListener);
            this._hovered.initReadonlyBind(this._hoveredSetter);
            this._pressed.initReadonlyBind(this._pressedSetter);
            this._padding.addChangeListener(() => {
                var p = this._padding.value;
                if (p == null) {
                    this._element.style.padding = "0px";
                } else {
                    p.apply(this._element);
                }
                this.requestLayout();
            });
            this._padding.invalidate();
            this._border.addChangeListener(() => {
                var b = this._border.value;
                if (b == null) {
                    this._element.style.removeProperty("borderStyle");
                    this._element.style.removeProperty("borderColor");
                    this._element.style.removeProperty("borderWidth");
                    this._element.style.removeProperty("borderRadius");
                } else {
                    b.apply(this._element);
                }
                this.requestLayout();
            });
            this._cursor.addChangeListener(() => {
                this._element.style.cursor = this.cursor.css;
            });
            this._visible.addChangeListener(() => {
                if (this._visible.value) {
                    this._element.style.visibility = "visible";
                } else {
                    this._element.style.visibility = "hidden";
                }
            });
            this._enabled.addChangeListener(() => {
                if (this._enabled.value) {
                    this._element.removeAttribute("disabled");
                } else {
                    this._element.setAttribute("disabled", "true");
                }
            });
            this._alpha.addChangeListener(() => {
                this._element.style.opacity = "" + this._alpha.value;
            });
            this._selectable.addChangeListener(() => {
                if (this._selectable.value) {
                    this._element.style.removeProperty("mozUserSelect");
                    this._element.style.removeProperty("khtmlUserSelect");
                    this._element.style.removeProperty("webkitUserSelect");
                    this._element.style.removeProperty("msUserSelect");
                    this._element.style.removeProperty("userSelect");
                } else {
                    this._element.style.setProperty("mozUserSelect", "none");
                    this._element.style.setProperty("khtmlUserSelect", "none");
                    this._element.style.setProperty("webkitUserSelect", "none");
                    this._element.style.setProperty("msUserSelect", "none");
                    this._element.style.setProperty("userSelect", "none");
                }
            });
            this._selectable.invalidate();
            this._minWidth.addChangeListener(() => {
                if (this._minWidth.value == null) {
                    this._element.style.removeProperty("minWidth");
                } else {
                    this._element.style.setProperty("minWidth", this._minWidth.value + "px");
                }
                this.requestLayout();
            });
            this._minHeight.addChangeListener(() => {
                if (this._minHeight.value == null) {
                    this._element.style.removeProperty("minHeight");
                } else {
                    this._element.style.setProperty("minHeight", this._minHeight.value + "px");
                }
                this.requestLayout();
            });
            this._maxWidth.addChangeListener(() => {
                if (this._maxWidth.value == null) {
                    this._element.style.removeProperty("maxWidth");
                } else {
                    this._element.style.setProperty("maxWidth", this._maxWidth.value + "px");
                }
                this.requestLayout();
            });
            this._maxHeight.addChangeListener(() => {
                if (this._maxHeight.value == null) {
                    this._element.style.removeProperty("maxHeight");
                } else {
                    this._element.style.setProperty("maxHeight", this._maxHeight.value + "px");
                }
                this.requestLayout();
            });
            this._handlePointer.addChangeListener(() => {
                if (!this._handlePointer.value || this._pointerTransparent.value) {
                    this._element.style.pointerEvents = "none";
                } else {
                    this._element.style.pointerEvents = "all";
                }
            });
            this._pointerTransparent.addChangeListener(() => {
                if (!this._handlePointer.value || this._pointerTransparent.value) {
                    this._element.style.pointerEvents = "none";
                } else {
                    this._element.style.pointerEvents = "all";
                }
            });

            this._measuredWidth.initReadonlyBind(this._measuredWidthSetter);
            this._measuredHeight.initReadonlyBind(this._measuredHeightSetter);
            this._clientWidth.initReadonlyBind(this._clientWidthSetter);
            this._clientHeight.initReadonlyBind(this._clientHeightSetter);
            this._boundsWidth.initReadonlyBind(this._boundsWidthSetter);
            this._boundsHeight.initReadonlyBind(this._boundsHeightSetter);
            this._boundsLeft.initReadonlyBind(this._boundsLeftSetter);
            this._boundsTop.initReadonlyBind(this._boundsTopSetter);
            
            this._onClick = new Event<MouseEvent>(new HtmlEventListenerCallback(this._element, "click"));
            this._onMouseDown = new Event<MouseEvent>(new HtmlEventListenerCallback(this._element, "mousedown"));
            this. _onMouseMove = new Event<MouseEvent>(new HtmlEventListenerCallback(this._element, "mousemove"));
            this. _onMouseUp = new Event<MouseEvent>(new HtmlEventListenerCallback(this._element, "mouseup"));
            this. _onMouseEnter = new Event<MouseEvent>(new HtmlEventListenerCallback(this._element, "mouseenter"));
            this. _onMouseLeave = new Event<MouseEvent>(new HtmlEventListenerCallback(this._element, "mouseleave"));
            this. _onMouseWheel = new Event<MouseEvent>(new HtmlEventListenerCallback(this._element, "mousewheel"));
            this. _onKeyDown = new Event<KeyboardEvent>(new HtmlEventListenerCallback(this._element, "keydown"));
            this. _onKeyPress = new Event<KeyboardEvent>(new HtmlEventListenerCallback(this._element, "keypress"));
            this. _onKeyUp = new Event<KeyboardEvent>(new HtmlEventListenerCallback(this._element, "keyup"));
            this. _onContextMenu = new Event<Object>(new HtmlEventListenerCallback(this._element, "contextmenu"));

            this._onMouseEnter.addListener(() => {
                this._hoveredSetter.value = true;
            });
            this._onMouseLeave.addListener(() => {
                this._hoveredSetter.value = false;
            });
            this._onMouseDown.addListener(() => {
                this._pressedSetter.value = true;
            });
            this._onMouseUp.addListener(() => {
                this._pressedSetter.value = false;
            });
        }
        
        private getClassName() {
            var funcNameRegex = /function (.{1,})\(/;
            var results  = (funcNameRegex).exec(this["constructor"].toString());
            return (results && results.length > 1) ? results[1] : "";
        }

        private invokePostConstruct() {
            this._postConstructRunOnce.run(); 
        }

        protected postConstruct() {

        }

        public setCubeePanel(cubeePanel: CubeePanel) {
            this._cubeePanel = cubeePanel;
        }

        getCubeePanel(): CubeePanel {
            if (this._cubeePanel != null) {
                return this._cubeePanel;
            } else if (this.parent != null) {
                return this.parent.getCubeePanel();
            } else {
                return null;
            }
        }

        private updateTransform() {
            var angle = this._rotate.value;
            angle = angle - (angle | 0);
            angle = angle * 360;
            var angleStr = angle + "deg";

            var centerX = (this._transformCenterX.value * 100) + "%";
            var centerY = (this._transformCenterY.value * 100) + "%";

            var sX = this._scaleX.value.toString();
            var sY = this._scaleY.value.toString();

            this._element.style.transformOrigin = centerX + " " + centerY;
            this._element.style.transform = "translate(" + (this._translateX.value | 0) + "px, " + (this._translateY.value | 0)
            + "px) rotate(" + angleStr + ") scaleX( " + sX + ") scaleY(" + sY + ")";
            this._element.style.backfaceVisibility = "hidden";
        }

        requestLayout() {
            if (!this._needsLayout) {
                this._needsLayout = true;
                if (this._parent != null) {
                    this._parent.requestLayout();
                } else if (this._cubeePanel != null) {
                    this._cubeePanel.requestLayout();
                } else {
                    Popups._requestLayout();
                }
            }
        }

        measure() {
            this.onMeasure();
        }

        private onMeasure() {
            // calculating client bounds
            var cw = this._element.clientWidth;
            var ch = this._element.clientHeight;
            var p = this._padding.value;
            if (p != null) {
                cw = cw - p.left - p.right;
                ch = ch - p.top - p.bottom;
            }
            this._clientWidthSetter.value = cw;
            this._clientHeightSetter.value = ch;

            // calculating measured bounds
            var mw = this._element.offsetWidth;
            var mh = this._element.offsetHeight;
            this._measuredWidthSetter.value = mw;
            this._measuredHeightSetter.value = mh;

            // calculating parent bounds
            var tcx = this._transformCenterX.value;
            var tcy = this._transformCenterY.value;

            var bx = 0;
            var by = 0;
            var bw = mw;
            var bh = mh;

            var tl = new Point2D(0, 0);
            var tr = new Point2D(mw, 0);
            var br = new Point2D(mw, mh);
            var bl = new Point2D(0, mh);

            var cx = (mw * tcx) | 0;
            var cy = (mh * tcy) | 0;

            var rot = this._rotate.value;
            if (rot != 0.0) {
                tl = this.rotatePoint(cx, cy, 0, 0, rot);
                tr = this.rotatePoint(cx, cy, bw, 0, rot);
                br = this.rotatePoint(cx, cy, bw, bh, rot);
                bl = this.rotatePoint(cx, cy, 0, bh, rot);
            }

            var sx = this._scaleX.value;
            var sy = this._scaleY.value;

            if (sx != 1.0 || sy != 1.0) {
                tl = this.scalePoint(cx, cy, tl.x, tl.y, sx, sy);
                tr = this.scalePoint(cx, cy, tr.x, tr.y, sx, sy);
                br = this.scalePoint(cx, cy, br.x, br.y, sx, sy);
                bl = this.scalePoint(cx, cy, bl.x, bl.y, sx, sy);
            }

            var minX = Math.min(Math.min(tl.x, tr.x), Math.min(br.x, bl.x));
            var minY = Math.min(Math.min(tl.y, tr.y), Math.min(br.y, bl.y));
            var maxX = Math.max(Math.max(tl.x, tr.x), Math.max(br.x, bl.x));
            var maxY = Math.max(Math.max(tl.y, tr.y), Math.max(br.y, bl.y));
            bw = maxX - minX;
            bh = maxY - minY;
            bx = minX;
            by = minY;

            this._boundsLeftSetter.value = bx;
            this._boundsTopSetter.value = by;
            this._boundsWidthSetter.value = bw;
            this._boundsHeightSetter.value = bh;
        }

        scalePoint(centerX: number, centerY: number, pointX: number, pointY: number, scaleX: number, scaleY: number) {
            var resX = (centerX + ((pointX - centerX) * scaleX)) | 0;
            var resY = (centerY + ((pointY - centerY) * scaleY)) | 0;
            return new Point2D(resX, resY);
        }

        private rotatePoint(cx: number, cy: number, x: number, y: number, angle: number) {
            angle = (angle * 360) * (Math.PI / 180);
            x = x - cx;
            y = y - cy;
            var sin = Math.sin(angle);
            var cos = Math.cos(angle);
            var rx = ((cos * x) - (sin * y)) | 0;
            var ry = ((sin * x) + (cos * y)) | 0;
            rx = rx + cx;
            ry = ry + cy;

            return new Point2D(rx, ry);
        }

        get element() {
            return this._element;
        }

        get parent() {
            return this._parent;
        }

        public _setParent(parent: ALayout) {
            this._parent = parent;
        }

        layout() {
            this._needsLayout = false;
            this.measure();
        }

        get needsLayout() {
            return this._needsLayout;
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
        
        protected paddingProperty() {
            return this._padding;
        }
        protected get Padding() {
            return this.paddingProperty();
        }
        protected get padding() {
            return this.Padding.value;
        }
        protected set padding(value) {
            this.Padding.value = value;
        }

        protected borderProperty() {
            return this._border;
        }
        protected get Border() {
            return this.borderProperty();
        }
        protected get border() {
            return this.Border.value;
        }
        protected set border(value) {
            this.Border.value = value;
        }

        get MeasuredWidth() {
            return this._measuredWidth;
        }
        get measuredWidth() {
            return this.MeasuredWidth.value;
        }
        set measuredWidth(value) {
            this.MeasuredWidth.value = value;
        }

        get MeasuredHeight() {
            return this._measuredHeight;
        }
        get measuredHeight() {
            return this.MeasuredHeight.value;
        }
        set measuredHeight(value) {
            this.MeasuredHeight.value = value;
        }

        get ClientWidth() {
            return this._clientWidth;
        }
        get clientWidth() {
            return this.ClientWidth.value;
        }
        set clientWidth(value) {
            this.ClientWidth.value = value;
        }

        get ClientHeight() {
            return this._clientHeight;
        }
        get clientHeight() {
            return this.ClientHeight.value;
        }
        set clientHeight(value) {
            this.ClientHeight.value = value;
        }

        get BoundsWidth() {
            return this._boundsWidth;
        }
        get boundsWidth() {
            return this.BoundsWidth.value;
        }
        set boundsWidth(value) {
            this.BoundsWidth.value = value;
        }

        get BoundsHeight() {
            return this._boundsHeight;
        }
        get boundsHeight() {
            return this.BoundsHeight.value;
        }
        set boundsHeight(value) {
            this.BoundsHeight.value = value;
        }

        get BoundsLeft() {
            return this._boundsLeft;
        }
        get boundsLeft() {
            return this.BoundsLeft.value;
        }
        set boundsLeft(value) {
            this.BoundsLeft.value = value;
        }

        get BoundsTop() {
            return this._boundsTop;
        }
        get boundsTop() {
            return this.BoundsTop.value;
        }
        set boundsTop(value) {
            this.BoundsTop.value = value;
        }

        protected minWidthProperty() {
            return this._minWidth;
        }
        protected get MinWidth() {
            return this.minWidthProperty();
        }
        protected get minWidth() {
            return this.MinWidth.value;
        }
        protected set minWidth(value) {
            this.MinWidth.value = value;
        }


        protected minHeightProperty() {
            return this._minHeight;
        }
        protected get MinHeight() {
            return this.minHeightProperty();
        }
        protected get minHeight() {
            return this.MinHeight.value;
        }
        protected set minHeight(value) {
            this.MinHeight.value = value;
        }


        protected maxWidthProperty() {
            return this._maxWidth;
        }
        protected get MaxWidth() {
            return this.maxWidthProperty();
        }
        protected get maxWidth() {
            return this.MaxWidth.value;
        }
        protected set maxWidth(value) {
            this.MaxWidth.value = value;
        }


        protected maxHeightProperty() {
            return this._maxHeight;
        }
        protected get MaxHeight() {
            return this.maxHeightProperty();
        }
        protected get maxHeight() {
            return this.MaxHeight.value;
        }
        protected set maxHeight(value) {
            this.MaxHeight.value = value;
        }


        /**
         * Sets the base position of this component relative to the parent's top-left corner. This method is called from a
         * layout's onLayout method to set the base position of this component.
         *
         * @param left The left base position of this component relative to the parents top-left corner.
         * @param top The top base position of this component relative to the parents top-left corner.
         */
        protected setPosition(left: number, top: number) {
            this._element.style.left = "" + left + "px";
            this._element.style.top = "" + top + "px";
            this._left = left;
            this._top = top;
        }

        /**
         * Sets the base left position of this component relative to the parent's top-left corner. This method is called
         * from a layout's onLayout method to set the base left position of this component.
         *
         * @param left The left base position of this component relative to the parents top-left corner.
         */
        public _setLeft(left: number) {
            this._element.style.left = "" + left + "px";
            this._left = left;
        }

        /**
         * Sets the base top position of this component relative to the parent's top-left corner. This method is called from
         * a layout's onLayout method to set the base top position of this component.
         *
         * @param top The top base position of this component relative to the parents top-left corner.
         */
        public _setTop(top: number) {
            this._element.style.top = "" + top + "px";
            this._top = top;
        }

        /**
         * Sets the size of this component. This method can be called when a dynamically sized component's size is
         * calculated. Typically from the onLayout method.
         *
         * @param width The width of this component.
         * @param height The height of this component.
         */
        protected setSize(width: number, height: number) {
            this._element.style.width = "" + width + "px";
            this._element.style.height = "" + height + "px";
        }

        get Cursor() {
            return this._cursor;
        }
        get cursor() {
            return this.Cursor.value;
        }
        set cursor(value) {
            this.Cursor.value = value;
        }

        get PointerTransparent() {
            return this._pointerTransparent;
        }
        get pointerTransparent() {
            return this.PointerTransparent.value;
        }
        set pointerTransparent(value) {
            this.PointerTransparent.value = value;
        }

        get Visible() {
            return this._visible;
        }
        get visible() {
            return this.Visible.value;
        }
        set visible(value) {
            this.Visible.value = value;
        }

        get onClick() {
            return this._onClick;
        }

        get onContextMenu() {
            return this._onContextMenu;
        }

        get onMouseDown() {
            return this._onMouseDown;
        }

        get onMouseMove() {
            return this._onMouseMove;
        }

        get onMouseUp() {
            return this._onMouseUp;
        }

        get onMouseEnter() {
            return this._onMouseEnter;
        }

        get onMouseLeave() {
            return this._onMouseLeave;
        }

        get onMouseWheel() {
            return this._onMouseWheel;
        }

        get onKeyDown() {
            return this._onKeyDown;
        }

        get onKeyPress() {
            return this._onKeyPress;
        }

        get onKeyUp() {
            return this._onKeyUp;
        }

        get onParentChanged() {
            return this._onParentChanged;
        }

        get Alpha() {
            return this._alpha;
        }
        get alpha() {
            return this.Alpha.value;
        }
        set alpha(value) {
            this.Alpha.value = value;
        }

        get HandlePointer() {
            return this._handlePointer;
        }
        get handlePointer() {
            return this.HandlePointer.value;
        }
        set handlePointer(value) {
            this.HandlePointer.value = value;
        }

        get Enabled() {
            return this._enabled;
        }
        get enabled() {
            return this.Enabled.value;
        }
        set enabled(value) {
            this.Enabled.value = value;
        }

        get Selectable() {
            return this._selectable;
        }
        get selectable() {
            return this.Selectable.value;
        }
        set selectable(value) {
            this.Selectable.value = value;
        }


        get left() {
            return this._left;
        }

        get top() {
            return this._top;
        }

        get Rotate() {
            return this._rotate;
        }
        get rotate() {
            return this.Rotate.value;
        }
        set rotate(value) {
            this.Rotate.value = value;
        }

        get ScaleX() {
            return this._scaleX;
        }
        get scaleX() {
            return this.ScaleX.value;
        }
        set scaleX(value) {
            this.ScaleX.value = value;
        }

        get ScaleY() {
            return this._scaleY;
        }
        get scaleY() {
            return this.ScaleY.value;
        }
        set scaleY(value) {
            this.ScaleY.value = value;
        }

        get TransformCenterX() {
            return this._transformCenterX;
        }
        get transformCenterX() {
            return this.TransformCenterX.value;
        }
        set transformCenterX(value) {
            this.TransformCenterX.value = value;
        }

        get TransformCenterY() {
            return this._transformCenterY;
        }
        get transformCenterY() {
            return this.TransformCenterY.value;
        }
        set transformCenterY(value) {
            this.TransformCenterY.value = value;
        }

        get Hovered() {
            return this._hovered;
        }
        get hovered() {
            return this.Hovered.value;
        }
        set hovered(value) {
            this.Hovered.value = value;
        }

        get Pressed() {
            return this._pressed;
        }
        get pressed() {
            return this.Pressed.value;
        }
        set pressed(value) {
            this.Pressed.value = value;
        }
        
    }

}


