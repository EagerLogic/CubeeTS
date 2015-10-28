module cubee {

    export class VBox extends ALayout {

        private _width = new NumberProperty(null, true, false);
        //private final ArrayList<Element> wrappingPanels = new ArrayList<Element>();
        private _cellHeights: number[] = [];
        private _hAligns: EHAlign[] = [];
        private _vAligns: EVAlign[] = [];

        constructor() {
            super(document.createElement("div"));
            this.element.style.overflow = "hidden";
            this.pointerTransparent = true;
            this._width.addChangeListener(() => {
                this.requestLayout();
            });
        }

        get children() {
            return this.children_inner;
        }

        setCellHeight(indexOrComponent: number | AComponent, cellHeight: number) {
            if (indexOrComponent instanceof AComponent) {
                this.setCellHeight(this.children.indexOf(<AComponent>indexOrComponent), cellHeight);
            }
            this.setInList(this._cellHeights, <number>indexOrComponent, cellHeight);
            this.requestLayout();
        }

        private setInList<T>(list: T[], index: number, value: T) {
            while (list.length < index) {
                list.push(null);
            }
            list[index] = value;
        }

        private getFromList<T>(list: T[], index: number) {
            if (list.length > index) {
                return list[index];
            }
            return null;
        }

        private removeFromList<T>(list: T[], index: number) {
            if (list.length > index) {
                list.splice(index, 1);
            }
        }

        public getCellHeight(indexOrComponent: number | AComponent): number {
            if (indexOrComponent instanceof AComponent) {
                return this.getCellHeight(this.children.indexOf(indexOrComponent));
            }
            this.getFromList(this._cellHeights, <number>indexOrComponent);
        }

        public setCellHAlign(indexOrComponent: number | AComponent, hAlign: EHAlign) {
            if (indexOrComponent instanceof AComponent) {
                this.setCellHAlign(this.children.indexOf(indexOrComponent), hAlign);
            }
            this.setInList(this._hAligns, <number>indexOrComponent, hAlign);
            this.requestLayout();
        }

        public getCellHAlign(indexOrComponent: number | AComponent): EHAlign {
            if (indexOrComponent instanceof AComponent) {
                return this.getCellHAlign(this.children.indexOf(indexOrComponent));
            }
            return this.getFromList(this._hAligns, <number>indexOrComponent);
        }

        public setCellVAlign(indexOrComponent: number | AComponent, vAlign: EVAlign) {
            if (indexOrComponent instanceof AComponent) {
                this.setCellVAlign(this.children.indexOf(indexOrComponent), vAlign);
            }
            this.setInList(this._vAligns, <number>indexOrComponent, vAlign);
            this.requestLayout();
    }

        public getCellVAlign(indexOrComponent: number | AComponent): EVAlign {
        if (indexOrComponent instanceof AComponent) {
            return this.getCellVAlign(this.children.indexOf(indexOrComponent));
        }
        this.getFromList(this._vAligns, <number>indexOrComponent);
    }

    public setLastCellHAlign(hAlign: EHAlign) {
        this.setCellHAlign(this.children.size() - 1, hAlign);
    }

    public setLastCellVAlign(vAlign: EVAlign) {
        this.setCellVAlign(this.children.size() - 1, vAlign);
    }

    public setLastCellHeight(height: number) {
        this.setCellHeight(this.children.size() - 1, height);
    }

    public addEmptyCell(height: number) {
        this.children.add(null);
        this.setCellHeight(this.children.size() - 1, height);
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
        this.removeFromList(this._hAligns, index);
        this.removeFromList(this._vAligns, index);
        this.removeFromList(this._cellHeights, index);
        this.requestLayout();
    }

    public _onChildrenCleared() {
        var root = this.element;
        var e = this.element.firstElementChild;
        while (e != null) {
            root.removeChild(e);
            e = root.firstElementChild;
        }
        this._hAligns = [];
        this._vAligns = [];
        this._cellHeights = [];
        this.requestLayout();
    }

    protected onLayout() {
        var maxWidth = -1;
        if (this.width != null) {
            maxWidth = this.width;
        }

        var actH = 0;
        var maxW = 0;
        for (var i = 0; i < this.children.size(); i++) {
            let childY = 0;
            let child = this.children.get(i);
            let cellH = this.getCellHeight(i);
            let vAlign = this.getCellVAlign(i);
            let realCellH = -1;
            if (cellH != null) {
                realCellH = cellH;
            }

            if (child == null) {
                if (realCellH > 0) {
                    actH += realCellH;
                }
            } else {
                //child.layout();
                let cw = child.boundsWidth;
                let ch = child.boundsHeight;
                let cl = child.translateX;
                let ct = child.translateY;
                let calculatedCellH = realCellH;
                if (calculatedCellH < 0) {
                    calculatedCellH = ch + ct;
                } else if (calculatedCellH < ch) {
                    calculatedCellH = ch;
                }

                childY = actH - child.translateY;

                if (vAlign == EVAlign.MIDDLE) {
                    childY += (calculatedCellH - ch) / 2;
                } else if (vAlign == EVAlign.BOTTOM) {
                    childY += (calculatedCellH - ch);
                }
                child._setTop(childY);

                if (cw + cl > maxW) {
                    maxW = cw + cl;
                }
                actH += calculatedCellH;
            }
        }

        var realWidth = maxW;
        if (maxWidth > -1) {
            realWidth = maxWidth;
        }
        for (var i = 0; i < this.children.size(); i++) {
            let childX = 0;
            let child = this.children.get(i);
            if (child == null) {
                continue;
            }
            let hAlign = this.getCellHAlign(i);
            let cw = child.boundsWidth;
            if (hAlign == EHAlign.CENTER) {
                childX = (realWidth - cw) / 2;
            } else if (hAlign == EHAlign.RIGHT) {
                childX = (realWidth - cw);
            }

            child._setLeft(childX);
        }

        this.setSize(realWidth, actH);
    }



}
    
}


