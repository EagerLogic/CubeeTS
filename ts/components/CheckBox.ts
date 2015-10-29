module cubee {

    export class CheckBox extends AComponent {

        private _checked = new BooleanProperty(false, false);

        constructor() {
            super(document.createElement("input"));
            this.element.setAttribute("type", "checkbox");

            this._checked.addChangeListener(() => {
                var e: any = this.element;
                e.checked = this.checked;
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

}


