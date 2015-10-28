module cubee {

    export abstract class ALayout extends AComponent {
        private _children = new LayoutChildren(this);

        constructor(element: HTMLElement) {
            super(element);
        }

        protected get children_inner() {
            return this._children;
        }

        public abstract _onChildAdded(child: AComponent): void;

        public abstract _onChildRemoved(child: AComponent, index: number): void;

        public abstract _onChildrenCleared(): void;

        layout() {
            this._needsLayout = false;
            for (var i = 0; i < this.children_inner.size(); i++) {
                let child = this.children_inner.get(i);
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
                for (var i = 0; i < root.children_inner.size(); i++) {
                    let component = root.children_inner.get(i);
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

}

