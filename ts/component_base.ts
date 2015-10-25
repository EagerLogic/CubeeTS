/// <reference path="utils.ts"/>
/// <reference path="events.ts"/>
/// <reference path="properties.ts"/>

module cubee {

    //    export interface INativeEventListener {
    //        (event: UIEvent): any;
    //    }

    class MouseDownEventLog {
        constructor(
            public component: AComponent,
            public screenX: number,
            public screenY: number,
            public x: number,
            public y: number,
            public timestamp: number = Date.now()) { }
    }

    export class ECursor {

        private static auto = new ECursor("auto");
        static get AUTO() {
            return ECursor.auto;
        }

        constructor(private _css: string) { }

        get css() {
            return this._css;
        }
    }

    export class LayoutChildren {
        private children: AComponent[] = [];

        constructor(private parent: ALayout) {
            this.parent = parent;
        }

        add(component: AComponent) {
            if (component != null) {
                if (component.parent != null) {
                    throw "The component is already a child of a layout.";
                }
                component._setParent(this.parent);
                component.onParentChanged.fireEvent(new ParentChangedEventArgs(this.parent, component));
            }

            this.children.push(component);
            this.parent._onChildAdded(component);
        }

        insert(index: number, component: AComponent) {
            if (component != null) {
                if (component.parent != null) {
                    throw "The component is already a child of a layout.";
                }
            }

            var newChildren: AComponent[] = [];
            this.children.forEach((child) => {
                newChildren.push(child);
            });
            newChildren.splice(index, 0, component);

            // TODO VERY INEFECTIVE
            this.clear();

            newChildren.forEach((child) => {
                this.add(child);
            });
        }

        removeComponent(component: AComponent) {
            var idx = this.children.indexOf(component);
            if (idx < 0) {
                throw "The given component isn't a child of this layout.";
            }
            this.removeIndex(idx);
        }

        removeIndex(index: number) {
            var removedComponent: AComponent = this.children[index];
            if (removedComponent != null) {
                removedComponent._setParent(null);
                removedComponent.onParentChanged.fireEvent(new ParentChangedEventArgs(null, removedComponent));
            }
            this.parent._onChildRemoved(removedComponent, index);
        }

        clear() {
            this.children.forEach((child) => {
                if (child != null) {
                    child._setParent(null);
                    child.onParentChanged.fireEvent(new ParentChangedEventArgs(null, child));
                }
            });
            this.children = [];
            this.parent._onChildrenCleared();
        }

        get(index: number) {
            return this.children[index]
        }

        indexOf(component: AComponent) {
            return this.children.indexOf(component);
        }

        size() {
            return this.children.length;
        }
    }



    export abstract class AComponent {

        //        private static pointerDownEvents: MouseDownEventLog[] = [];
        //
        //        private static logPointerDownEvent(item: MouseDownEventLog) {
        //            AComponent.pointerDownEvents.push(item);
        //        }
        //
        //        static fireDragEvents(screenX: number, screenY: number, altPressed: boolean, ctrlPressed: boolean,
        //            shiftPressed: boolean, metaPressed: boolean) {
        //            AComponent.pointerDownEvents.forEach((log) => {
        //                let args = new MouseDragEventArgs(screenX, screenY, screenX - log.screenX,
        //                    screenY - log.screenY, altPressed, ctrlPressed, shiftPressed, metaPressed, log.component);
        //                log.component.onMouseDrag.fireEvent(args);
        //            });
        //        }
        //
        //        static fireUpEvents(screenX: number, screenY: number, altPressed: boolean, ctrlPressed: boolean,
        //            shiftPressed: boolean, metaPressed: boolean, button: number, nativeEvent: MouseEvent) {
        //            var stamp = Date.now();
        //            AComponent.pointerDownEvents.forEach((log) => {
        //                let args = new MouseUpEventArgs(screenX, screenY, screenX - log.screenX,
        //                    screenY - log.screenY, altPressed, ctrlPressed, shiftPressed, metaPressed, button, nativeEvent, log.component);
        //                log.component.onMouseUp.fireEvent(args);
        //                if (stamp - log.timestamp < 500) {
        //                    log.component.onClick.fireEvent(new ClickEventArgs(screenX, screenY, log.x, log.y,
        //                        altPressed, ctrlPressed, shiftPressed, metaPressed, button, log.component));
        //                }
        //            });
        //            AComponent.pointerDownEvents = [];
        //        }

        //        public static addNativeEvent(element: Element, eventName: string, nativeEventListener: { (event: UIEvent): any }, useCapture: boolean) {
        //            element.addEventListener(eventName, nativeEventListener, useCapture);
        //        }
        //
        //        public static removeNativeEvent(element: Element, eventName: string, nativeEventListener: { (event: UIEvent): any }, useCapture: boolean) {
        //            element.removeEventListener(eventName, nativeEventListener, useCapture);
        //        }

        //        private nativeEventListener: INativeEventListener = (event: UIEvent): any => {
        //            this.handleNativeEvent(event);
        //        };

        //        private handleNativeEvent(event: UIEvent) {
        //            if (this instanceof TextBox) {
        //                if (event.type == "keyup") {
        //                    EventQueue.Instance.invokePrior(() => {
        //                        (<TextBox>this).textProperty().set(getElement().getPropertyString("value"));
        //                    });
        //                }
        //            }
        //
        //            //var x = event.clientX;
        //            //var y = event.clientY;
        //            //var wheelVelocity = event.velocityY;
        //            var parent: AComponent;
        //            var keyArgs: KeyEventArgs;
        //            var cp = this.getCubeePanel();
        //            var kevt: KeyboardEvent = null;
        //            switch (event.type) {
        //                case "mousedown":
        //                case "mousewheel":
        //                    event.stopPropagation();
        //                    if (cp != null) {
        //                        cp.doPointerEventClimbingUp(x, y, wheelVelocity,
        //                            event.getAltKey(), event.getCtrlKey(), event.getShiftKey(), event.getMetaKey(),
        //                            event.getTypeInt(), event.getButton(), event);
        //                    } else {
        //                        Popups.doPointerEventClimbingUp(x, y, wheelVelocity,
        //                            event.getAltKey(), event.getCtrlKey(), event.getShiftKey(), event.getMetaKey(),
        //                            event.getTypeInt(), event.getButton(), event);
        //                    }
        //
        //                    break;
        //                case "mousemove":
        //                    event.stopPropagation();
        //                    if (AComponent.pointerDownEvents.length > 0) {
        //                        let evt = <MouseEvent>event;
        //                        AComponent.fireDragEvents(evt.clientX, evt.clientY, evt.altKey, evt.ctrlKey,
        //                            evt.shiftKey, evt.metaKey);
        //                    } else {
        //                        let wevt = <WheelEvent>event;
        //                        if (cp != null) {
        //                            cp.doPointerEventClimbingUp(wevt.clientX, wevt.clientY, wevt.deltaY,
        //                                wevt.altKey, wevt.ctrlKey, wevt.shiftKey, wevt.metaKey,
        //                                wevt.type, wevt.button, wevt);
        //                        } else {
        //                            Popups.doPointerEventClimbingUp(wevt.clientX, wevt.clientY, wevt.deltaY,
        //                                wevt.altKey, wevt.ctrlKey, wevt.shiftKey, wevt.metaKey,
        //                                wevt.type, wevt.button, wevt);
        //                        }
        //                    }
        //                    break;
        //
        //                case "mouseup":
        //                    event.stopPropagation();
        //                    let evt = <MouseEvent>event;
        //                    AComponent.fireDragEvents(evt.clientX, evt.clientY, evt.altKey, evt.ctrlKey,
        //                        evt.shiftKey, evt.metaKey);
        //                    break;
        //                case "mouseover":
        //                    if (this._pointerTransparent.Value) {
        //                        return;
        //                    }
        //
        //                    // check handle pointer
        //                    parent = this;
        //                    while (parent != null) {
        //                        if (!parent.handlePointer) {
        //                            return;
        //                        }
        //                        parent = parent.Parent;
        //                    }
        //                    if (!this.hovered) {
        //                        this.onMouseEnter.fireEvent(new EventArgs(this));
        //                    }
        //                    break;
        //                case "mouseout":
        //                    if (this.pointerTransparent) {
        //                        return;
        //                    }
        //
        //                    // check handle pointer
        //                    parent = this;
        //                    while (parent != null) {
        //                        if (!parent.handlePointer) {
        //                            return;
        //                        }
        //                        parent = parent.Parent;
        //                    }
        //                    if (this.hovered) {
        //                        /*int compX = getLeft();
        //                         int compY = getTop();
        //                         if (x >= compX && y >= compY && x <= compX + boundsWidthProperty().get() && y <= compY + boundsHeightProperty().get()) {
        //                         return;
        //                         }*/
        //                        this.onMouseLeave.fireEvent(new EventArgs(this));
        //                    }
        //                    break;
        //                case "keydwon":
        //                    event.stopPropagation();
        //                    kevt = <KeyboardEvent>event;
        //                    let keyArgs = new KeyEventArgs(kevt.keyCode, kevt.altKey, kevt.ctrlKey,
        //                        kevt.shiftKey, kevt.metaKey, this, kevt);
        //                    this.onKeyDown.fireEvent(keyArgs);
        //                    break;
        //                case "keypress":
        //                    event.stopPropagation();
        //                    kevt = <KeyboardEvent>event;
        //                    keyArgs = new KeyEventArgs(kevt.keyCode, kevt.altKey, kevt.ctrlKey,
        //                        kevt.shiftKey, kevt.metaKey, this, kevt);
        //                    this.onKeyPress.fireEvent(keyArgs);
        //                    break;
        //                case "keyup":
        //                    event.stopPropagation();
        //                    kevt = <KeyboardEvent>event;
        //                    keyArgs = new KeyEventArgs(kevt.keyCode, kevt.altKey, kevt.ctrlKey,
        //                        kevt.shiftKey, kevt.metaKey, this, kevt);
        //                    this.onKeyUp.fireEvent(keyArgs);
        //                    break;
        //                case "contextmenu":
        //                    this.onContextMenu.fireEvent(new ContextMenuEventArgs(event, this));
        //                    break;
        //            }
        //        }

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
        private _onClick = new Event<ClickEventArgs>();
        private _onMouseDown = new Event<MouseDownEventArgs>();
        private _onMouseDrag = new Event<MouseDragEventArgs>();
        private _onMouseMove = new Event<MouseMoveEventArgs>();
        private _onMouseUp = new Event<MouseUpEventArgs>();
        private _onMouseEnter = new Event<Object>();
        private _onMouseLeave = new Event<Object>();
        private _onMouseWheel = new Event<MouseWheelEventArgs>();
        private _onKeyDown = new Event<KeyEventArgs>();
        private _onKeyPress = new Event<KeyEventArgs>();
        private _onKeyUp = new Event<KeyEventArgs>();
        private _onParentChanged = new Event<ParentChangedEventArgs>();
        private _onContextMenu = new Event<ContextMenuEventArgs>();
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
                    this._element.style.setProperty("pointerEvents", "none");
                } else {
                    this._element.style.removeProperty("pointerEvents");
                }
            });
            this._pointerTransparent.addChangeListener(() => {
                if (!this._handlePointer.value || this._pointerTransparent.value) {
                    this._element.style.setProperty("pointerEvents", "none");
                } else {
                    this._element.style.removeProperty("pointerEvents");
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
            
            // TODO replace event handling mechanism
            //DOM.setEventListener(getElement(), nativeEventListener);
            // sinking all the events
            //DOM.sinkEvents(getElement(), -1);

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
            this._element.style.transform = "translate(" + this._translateX.value + "px, " + this._translateY.value
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
        
        

        //	public final DoubleProperty rotateProperty() {
        //		return rotate;
        //	}
        //
        //	public final DoubleProperty scaleXProperty() {
        //		return scaleX;
        //	}
        //
        //	public final DoubleProperty scaleYProperty() {
        //		return scaleY;
        //	}
        //
        //	public final DoubleProperty transformCenterXProperty() {
        //		return transformCenterX;
        //	}
        //
        //	public final DoubleProperty transformCenterYProperty() {
        //		return transformCenterY;
        //	}
        
        get Padding() {
            return this._padding;
        }
        get padding() {
            return this.Padding.value;
        }
        set padding(value) {
            this.Padding.value = value;
        }

        get Border() {
            return this._border;
        }
        get border() {
            return this.Border.value;
        }
        set border(value) {
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

        get MinWidth() {
            return this._minWidth;
        }
        get minWIdth() {
            return this.MinWidth.value;
        }
        set minWIdth(value) {
            this.MinWidth.value = value;
        }

        get MinHeight() {
            return this._minHeight;
        }
        get minHeight() {
            return this.MinHeight.value;
        }
        set minHeight(value) {
            this.MinHeight.value = value;
        }

        get MaxWidth() {
            return this._maxWidth;
        }
        get maxWidth() {
            return this.MaxWidth.value;
        }
        set maxWidth(value) {
            this.MaxWidth.value = value;
        }

        get MaxHeight() {
            return this._maxHeight;
        }
        get maxHeight() {
            return this.MaxHeight.value;
        }
        set maxHeight(value) {
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

        /**
         * This method is called by the parent of this component when a pointer event is occured. The goal of this method is
         * to decide if this component wants to handle the event or not, and delegate the event to child components if
         * needed.
         *
         * @param screenX The x coordinate of the pointer relative to the screen's top-left corner.
         * @param screenY The y coordinate of the pointer relative to the screen's top-left corner.
         * @param parentScreenX The x coordinate of the pointer relative to the parent's top-left corner.
         * @param parentScreenY The y coordinate of the pointer relative to the parent's top-left corner.
         * @param x The x coordinate of the pointer relative to this component's top-left corner.
         * @param y The y coordinate of the pointer relative to this component's top-left corner.
         * @param wheelVelocity The mouse wheel velocity value.
         * @param type The type of the event. Valid values are listed in PointerEventArgs class.
         * @param altPressed Indicates if the alt key is pressed when the event occured or not.
         * @param ctrlPressed Indicates if the ctrl key is pressed when the event occured or not.
         * @param shiftPressed Indicates if the shift key is pressed when the event occured or not.
         * @param metaPressed Indicates if the meta key is pressed when the event occured or not.
         *
         * @return True if the event is fully handled and underlaying components can't handle this event, otherwise false if
         * underlaying components can handle this event.
         */
        _doPointerEventClimbingUp(screenX: number, screenY: number, x: number, y: number, wheelVelocity: number,
            altPressed: boolean, ctrlPressed: boolean, shiftPressed: boolean, metaPressed: boolean
            , eventType: number, button: number, nativeEvent: UIEvent) {
            if (!this._handlePointer.value) {
                return false;
            }
            if (this._pointerTransparent.value) {
                return false;
            }
            if (this._enabled.value) {
                return true;
            }
            if (!this._visible.value) {
                return false;
            }
            this.onPointerEventClimbingUp(screenX, screenY, x, y, wheelVelocity, altPressed,
                ctrlPressed, shiftPressed, metaPressed, eventType, button);
            return this.onPointerEventFallingDown(screenX, screenY, x, y, wheelVelocity, altPressed,
                ctrlPressed, shiftPressed, metaPressed, eventType, button, nativeEvent);
        }

        //	boolean doPointerEventFallingDown(int screenX, int screenY, int parentScreenX, int parentScreenY,
        //			int x, int y, int wheelVelocity, boolean altPressed, boolean ctrlPressed, boolean shiftPressed,
        //			boolean metaPressed, int type) {
        //		return onPointerEventFallingDown(screenX, screenY, parentScreenX, parentScreenY, x, y, wheelVelocity, altPressed,
        //				ctrlPressed, shiftPressed, metaPressed, type);
        //	}
        /**
         * This method is called when a pointer event is climbing up on the component hierarchy. The goal of this method is
         * to decide if the event can reach child components or not. In the most of the cases you don't need to overwrite
         * this method. The default implementation is returns true.
         *
         * @param screenX The x coordinate of the pointer relative to the screen's top-left corner.
         * @param screenY The y coordinate of the pointer relative to the screen's top-left corner.
         * @param x The x coordinate of the pointer relative to this component's top-left corner.
         * @param y The y coordinate of the pointer relative to this component's top-left corner.
         * @param wheelVelocity The mouse wheel velocity value.
         * @param type The type of the event. Valid values are listed in PointerEventArgs class.
         * @param altPressed Indicates if the alt key is pressed when the event occured or not.
         * @param ctrlPressed Indicates if the ctrl key is pressed when the event occured or not.
         * @param shiftPressed Indicates if the shift key is pressed when the event occured or not.
         * @param metaPressed Indicates if the meta key is pressed when the event occured or not.
         *
         * @return False if this event can't reach overlaying components, or true if overlaying components can also get the
         * climbing up event.
         */
        protected onPointerEventClimbingUp(screenX: number, screenY: number, x: number, y: number, wheelVelocity: number,
            altPressed: boolean, ctrlPressed: boolean, shiftPressed: boolean, metaPressed: boolean
            , eventType: number, button: number) {
            return true;
        }

        /**
         * This method is called when a pointer event is falling down on the component hierarchy. The goal of this method is
         * to fire events if needed, and in the result type define if the underlaying components can process this event too.
         * The default implementation is fires the associated event, and returns true.
         *
         * @param screenX The x coordinate of the pointer relative to the screen's top-left corner.
         * @param screenY The y coordinate of the pointer relative to the screen's top-left corner.
         * @param x The x coordinate of the pointer relative to this component's top-left corner.
         * @param y The y coordinate of the pointer relative to this component's top-left corner.
         * @param wheelVelocity The mouse wheel velocity value.
         * @param type The type of the event. Valid values are listed in PointerEventArgs class.
         * @param altPressed Indicates if the alt key is pressed when the event occured or not.
         * @param ctrlPressed Indicates if the ctrl key is pressed when the event occured or not.
         * @param shiftPressed Indicates if the shift key is pressed when the event occured or not.
         * @param metaPressed Indicates if the meta key is pressed when the event occured or not.
         *
         * @return True if this event is fully processed, and underlaying components can't process this event, or false if
         * underlaying components can also get the falling down event.
         */
        protected onPointerEventFallingDown(screenX: number, screenY: number, x: number, y: number, wheelVelocity: number,
            altPressed: boolean, ctrlPressed: boolean, shiftPressed: boolean, metaPressed: boolean,
            eventType: number, button: number, nativeEvent: UIEvent) {
            switch (eventType) {
                case MouseEventTypes.MOUSE_DOWN:
                    var mdea = new MouseDownEventArgs(screenX, screenY, x, y, altPressed, ctrlPressed,
                        shiftPressed, metaPressed, button, <MouseEvent>nativeEvent, this);
                    //this.registerDownEvent(screenX, screenY, x, y, altPressed, ctrlPressed, shiftPressed, metaPressed);
                    this._onMouseDown.fireEvent(mdea);
                    break;
                case MouseEventTypes.MOUSE_MOVE:
                    var mmea = new MouseMoveEventArgs(screenX, screenY, x, y, altPressed, ctrlPressed,
                        shiftPressed, metaPressed, this);
                    this._onMouseMove.fireEvent(mmea);
                    break;
                case MouseEventTypes.MOUSE_ENTER:
                    this._onMouseEnter.fireEvent(new EventArgs(this));
                    break;
                case MouseEventTypes.MOUSE_LEAVE:
                    this._onMouseLeave.fireEvent(new EventArgs(this));
                    break;
                case MouseEventTypes.MOUSE_WHEEL:
                    this._onMouseWheel.fireEvent(new MouseWheelEventArgs(wheelVelocity, altPressed, ctrlPressed, shiftPressed,
                        metaPressed, this));
                    break;
            }
            return true;
        }

        //        protected registerDownEvent(screenX: number, screenY: number, x: number, y: number,
        //            altPressed: boolean, ctrlPressed: boolean, shiftPressed: boolean, metaPressed: boolean) {
        //            AComponent.logPointerDownEvent(new MouseDownEventLog(this, screenX, screenY, x, y));
        //        }

        /**
         * Indicates if this component is intersects the given point. The x and y coordinate is relative to the parent's
         * top-left coordinate.
         *
         * @param x The x coordinate of the point.
         * @param y The y coordinate of the point.
         *
         * @return True if this component is intersects the given point, otherwise false.
         */
        _isIntersectsPoint(x: number, y: number) {
            // measured positions
            var x1 = this._left + this._translateX.value;
            var y1 = this._top + this._translateY.value;
            var x2 = x1 + this._measuredWidth.value;
            var y2 = y1;
            var x3 = x2;
            var y3 = y2 + this._measuredHeight.value;
            var x4 = x1;
            var y4 = y3;

            // scale points
            if (this._scaleX.value != 1.0) {
                x1 = (x1 - ((x2 - x1) * this._transformCenterX.value * this._scaleX.value)) | 0;
                x2 = (x1 + ((x2 - x1) * (1 - this._transformCenterX.value) * this._scaleX.value)) | 0;
                x3 = x2;
                x4 = x1;
            }
            if (this._scaleY.value != 1.0) {
                y1 = (y1 - ((y2 - y1) * this._transformCenterY.value * this._scaleY.value)) | 0;
                y4 = (y4 + ((y4 - y1) * (1 - this._transformCenterY.value) * this._scaleY.value)) | 0;
                y2 = y1;
                y3 = y4;
            }

            // rotatePoints
            if (this.rotate != 0.0) {
                var rpx = (x1 + ((x2 - x1) * this.transformCenterX)) | 0;
                var rpy = (y1 + ((y4 - y1) * this.transformCenterX)) | 0;
                var tl = this.rotatePoint(0, 0, x1 - rpx, y1 - rpy, this.rotate);
                var tr = this.rotatePoint(0, 0, x2 - rpx, y2 - rpy, this.rotate);
                var br = this.rotatePoint(0, 0, x3 - rpx, y3 - rpy, this.rotate);
                var bl = this.rotatePoint(0, 0, x4 - rpx, y4 - rpy, this.rotate);
                x1 = tl.x + rpx;
                y1 = tl.y + rpy;
                x2 = tr.x + rpx;
                y2 = tr.y + rpy;
                x3 = br.x + rpx;
                y3 = br.y + rpy;
                x4 = bl.x + rpx;
                y4 = bl.y + rpy;
            }

            var cnt = 0;
            if (this.isPointIntersectsLine(x, y, x1, y1, x2, y2)) {
                cnt++;
            }
            if (this.isPointIntersectsLine(x, y, x2, y2, x3, y3)) {
                cnt++;
            }
            if (this.isPointIntersectsLine(x, y, x3, y3, x4, y4)) {
                cnt++;
            }
            if (this.isPointIntersectsLine(x, y, x4, y4, x1, y1)) {
                cnt++;
            }
            return cnt == 1 || cnt == 3;
        }

        private isPointIntersectsLine(px: number, py: number, lx1: number, ly1: number, lx2: number, ly2: number) {
            /* ((poly[i][1] > y) != (poly[j][1] > y)) and \
             (x < (poly[j][0] - poly[i][0]) * (y - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0])
             */
            return ((ly1 > py) != (ly2 > py)) && (px < (lx2 - lx1) * ((py - ly1)) / (ly2 - ly1) + lx1);
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



        //        public final int getScreenX() {
        //            return getElement().getAbsoluteLeft();
        //        }
        //
        //        public final int getScreenY() {
        //            return getElement().getAbsoluteTop();
        //        }
        
    }

    export abstract class ALayout extends AComponent {
        private _children = new LayoutChildren(this);

        constructor(element: HTMLElement) {
            super(element);
        }

        get children() {
            return this._children;
        }

        public abstract _onChildAdded(child: AComponent): void;

        public abstract _onChildRemoved(child: AComponent, index: number): void;

        public abstract _onChildrenCleared(): void;

        layout() {
            this._needsLayout = false;
            for (var i = 0; i < this.children.size(); i++) {
                let child = this.children.get(i);
                if (child != null) {
                    if (child.needsLayout) {
                        child.layout();
                    }
                }
            }
            this.onLayout();
            this.measure();
        }

        public _doPointerEventClimbingUp(screenX: number, screenY: number, x: number, y: number, wheelVelocity: number,
            altPressed: boolean, ctrlPressed: boolean, shiftPressed: boolean, metaPressed: boolean, type: number, button: number, event: MouseEvent) {
            if (!this.handlePointer) {
                return false;
            }
            if (!this.enabled) {
                return true;
            }
            if (!this.visible) {
                return false;
            }
            if (this.onPointerEventClimbingUp(screenX, screenY, x, y, wheelVelocity, altPressed,
                ctrlPressed, shiftPressed, metaPressed, type, button)) {
                for (var i = this._children.size() - 1; i >= 0; i--) {
                    let child = this._children.get(i);
                    if (child != null) {
                        let parentX = x + this.element.scrollLeft;
                        let parentY = y + this.element.scrollTop;
                        let p = this.padding;
                        if (p != null) {
                            parentX -= p.left;
                            parentY -= p.top;
                        }
                        if (child._isIntersectsPoint(parentX, parentY)) {
                            let left = child.left + child.translateX;
                            let top = child.top + child.translateY;
                            let tcx = (left + child.measuredWidth * child.transformCenterX) | 0;
                            let tcy = (top + child.measuredHeight * child.transformCenterY) | 0;
                            let childPoint = this._rotatePoint(tcx, tcy, parentX, parentY, -child.rotate);
                            let childX = childPoint.x;
                            let childY = childPoint.y;
                            childX = childX - left;
                            childY = childY - top;
                            // TODO scale back point
                            if (child._doPointerEventClimbingUp(screenX, screenY, childX, childY, wheelVelocity,
                                altPressed, ctrlPressed, shiftPressed, metaPressed, type, button, event)) { 
                                return true;
                            }
                        }
                    }
                }
            }
            if (this.pointerTransparent) {
                return false;
            } else {
                return this.onPointerEventFallingDown(screenX, screenY, x, y, wheelVelocity, altPressed,
                    ctrlPressed, shiftPressed, metaPressed, type, button, event);
            }

        }

        private _rotatePoint(cx: number, cy: number, x: number, y: number, angle: number) {
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

        protected abstract onLayout(): void;

        getComponentsAtPosition(x: number, y: number) {
            var res: AComponent[] = [];
            this.getComponentsAtPosition_impl(this, x, y, res);
            return res;
        }

        private getComponentsAtPosition_impl(root: ALayout, x: number, y: number, result: AComponent[]) {
            if (x >= 0 && x <= root.boundsWidth && y >= 0 && y <= root.boundsHeight) {
                result.splice(0, 0, root);
                for (var i = 0; i < root.children.size(); i++) {
                    let component = root.children.get(i);
                    if (component == null) {
                        continue;
                    }
                    let tx = x - component.left - component.translateX;
                    let ty = y - component.top - component.translateY;
                    if (component instanceof ALayout) {
                        let l: ALayout;
                        this.getComponentsAtPosition_impl(<ALayout>component, tx, ty, result);
                    } else {
                        if (tx >= 0 && tx <= component.boundsWidth && y >= 0 && y <= component.boundsHeight) {
                            result.splice(0, 0, component);
                        }
                    }
                }
            }
        }

        protected setChildLeft(child: AComponent, left: number) {
            child._setLeft(left);
        }

        protected setChildTop(child: AComponent, top: number) {
            child._setTop(top);
        }
    }

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
                for (var i = 0; i < this.children.size(); i++) {
                    let component = this.children.get(i);
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

    export class MouseEventTypes {

        public static MOUSE_DOWN = 0;
        public static MOUSE_MOVE = 1;
        public static MOUSE_UP = 2;
        public static MOUSE_ENTER = 3;
        public static MOUSE_LEAVE = 4;
        public static MOUSE_WHEEL = 5;

        constructor() { }

    }

}

