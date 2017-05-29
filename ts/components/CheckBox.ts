namespace cubee {

    export class CheckBox extends AComponent {

        private _checked = new BooleanProperty(false, false);

        constructor() {
            super(document.createElement("input"));
            this.element.setAttribute("type", "checkbox");

            this._checked.addChangeListener(() => {
                var e: any = this.element;
                e.checked = this.checked;
            });
            
            this.element.addEventListener("change", () => {
                this.checked = (<HTMLInputElement>this.element).checked;
            });
        }
        
        get Checked() {
            return this._checked;
        }
        get checked() {
            return this.Checked.value;
        }
        set checked(value) {
            this.Checked.value = value;
        }

    }
    
    export class CheckBoxWithTitle extends AUserControl {
        
        private hb: HBox;
        private _checkBox: CheckBox;
        private _label: Label;
        
        constructor() {
            super();
            
            this.hb = new HBox();
            this.children_inner.add(this.hb);
            
            this._checkBox = new CheckBox();
            this.hb.children.add(this._checkBox);
            this.hb.setLastCellVAlign(EVAlign.MIDDLE);
            
            this.hb.addEmptyCell(10);
            
            this._label = new Label();
            this.hb.children.add(this._label);
            this.hb.setLastCellVAlign(EVAlign.MIDDLE);
        }
        
        get checkBox() {
            return this._checkBox;
        }
        
        get label() {
            return this._label;
        }
        
    }

}


