namespace cubee {

    export class HBox extends ALayout {

        private _height = new NumberProperty(null, true, false);
        private _cellWidths: number[] = [];
        private _hAligns: EHAlign[] = [];
        private _vAligns: EVAlign[] = [];

        constructor() {
            super(document.createElement("div"));
            this.element.style.overflow = "hidden";
            this.pointerTransparent = true;
            this._height.addChangeListener(() => {
                this.requestLayout();
            });
        }

        public setCellWidth(indexOrComponent: number | AComponent, cellHeight: number) {
            if (indexOrComponent instanceof AComponent) {
                this.setCellWidth(this.children_inner.indexOf(indexOrComponent), cellHeight);
                return;
            }
            this.setInList(this._cellWidths, <number>indexOrComponent, cellHeight);
            this.requestLayout();
        }

        public getCellWidth(indexOrComponent: number | AComponent): number {
            if (indexOrComponent instanceof AComponent) {
                return this.getCellWidth(this.children_inner.indexOf(indexOrComponent));
            }
            return this.getFromList(this._cellWidths, <number>indexOrComponent);
    }
    
    public setCellHAlign(indexOrComponent: number | AComponent, hAlign: EHAlign) {
            if (indexOrComponent instanceof AComponent) {
                this.setCellHAlign(this.children_inner.indexOf(indexOrComponent), hAlign);
            }
            this.setInList(this._hAligns, <number>indexOrComponent, hAlign);
            this.requestLayout();
        }

    public getCellHAlign(indexOrComponent: number | AComponent): EHAlign {
            if (indexOrComponent instanceof AComponent) {
                return this.getCellHAlign(this.children_inner.indexOf(indexOrComponent));
            }
            return this.getFromList(this._hAligns, <number>indexOrComponent);
    }
    
    public setCellVAlign(indexOrComponent: number | AComponent, vAlign: EVAlign) {
            if (indexOrComponent instanceof AComponent) {
                this.setCellVAlign(this.children_inner.indexOf(indexOrComponent), vAlign);
            }
            this.setInList(this._vAligns, <number>indexOrComponent, vAlign);
            this.requestLayout();
        }

    public getCellVAlign(indexOrComponent: number | AComponent): EVAlign {
            if (indexOrComponent instanceof AComponent) {
                return this.getCellVAlign(this.children_inner.indexOf(indexOrComponent));
            }
            return this.getFromList(this._vAligns, <number>indexOrComponent);
    }

    public setLastCellHAlign(hAlign: EHAlign) {
        this.setCellHAlign(this.children_inner.size() - 1, hAlign);
    }

    public setLastCellVAlign(vAlign: EVAlign) {
        this.setCellVAlign(this.children_inner.size() - 1, vAlign);
    }

    public setLastCellWidth(width: number) {
        this.setCellWidth(this.children_inner.size() - 1, width);
    }

    public addEmptyCell(width: number) {
        this.children_inner.add(null);
        this.setCellWidth(this.children_inner.size() - 1, width);
    }

    _onChildAdded(child: AComponent) {
        if (child != null) {
            this.element.appendChild(child.element);
        }
        this.requestLayout();
    }

    _onChildRemoved(child: AComponent, index: number) {
        if (child != null) {
            this.element.removeChild(child.element);
        }
        this.removeFromList(this._hAligns, index);
        this.removeFromList(this._vAligns, index);
        this.removeFromList(this._cellWidths, index);
        this.requestLayout();
    }

    _onChildrenCleared() {
        let root = this.element;
        let e = this.element.firstElementChild;
        while (e != null) {
            root.removeChild(e);
            e = root.firstElementChild;
        }
        this._hAligns = [];
        this._vAligns = [];
        this._cellWidths = [];
        this.requestLayout();
    }

    protected onLayout() {
        var maxHeight = -1;
        if (this.height != null) {
            maxHeight = this.height;
        }

        var actW = 0;
        var maxH = 0;
        for (let i = 0; i < this.children.size(); i++) {
            let childX = 0;
            let child = this.children.get(i);
            let cellW = this.getCellWidth(i);
            let hAlign = this.getCellHAlign(i);
            let realCellW = -1;
            if (cellW != null) {
                realCellW = cellW;
            }

            if (child == null) {
                if (realCellW > 0) {
                    actW += realCellW;
                }
            } else {
                //child.layout();
                let cw = child.boundsWidth;
                let ch = child.boundsHeight;
                let cl = child.translateX;
                let ct = child.translateY;
                let calculatedCellW = realCellW;
                if (calculatedCellW < 0) {
                    calculatedCellW = cw + cl;
                } else if (calculatedCellW < cw) {
                    calculatedCellW = cw;
                }

                childX = actW - child.translateX;

                if (hAlign == EHAlign.CENTER) {
                    childX += (calculatedCellW - cw) / 2;
                } else if (hAlign == EHAlign.RIGHT) {
                    childX += (calculatedCellW - cw);
                }
                child._setLeft(childX);

                if (ch + ct > maxH) {
                    maxH = ch + ct;
                }
                actW += calculatedCellW;
            }
        }

        let realHeight = maxH;
        if (maxHeight > -1) {
            realHeight = maxHeight;
        }
        for (let i = 0; i < this.children.size(); i++) {
            let childY = 0;
            let child = this.children.get(i);
            if (child == null) {
                continue;
            }
            let vAlign = this.getCellVAlign(i);
            let ch = child.boundsHeight;
            if (vAlign == EVAlign.MIDDLE) {
                childY += (realHeight - ch) / 2;
            } else if (vAlign == EVAlign.BOTTOM) {
                childY += (realHeight - ch);
            }

            child._setTop(childY);
        }

        this.setSize(actW, realHeight);
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

    get children() {
        return this.children_inner;
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


}
    
}

