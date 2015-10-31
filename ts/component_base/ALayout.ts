namespace cubee {

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

