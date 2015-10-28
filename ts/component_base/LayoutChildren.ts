module cubee {
    
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
    
}


