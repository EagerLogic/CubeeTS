namespace cubee {

    export class Panel extends AUserControl {
        
        protected widthProperty() {
            return super.widthProperty();
        }
        get Width() {
            return this.widthProperty();
        }
        get width() {
            return this.Width.value;
        }
        set width(value) {
            this.Width.value = value;
        }


        protected heightProperty() {
            return super.heightProperty();
        }
        get Height() {
            return this.heightProperty();
        }
        get height() {
            return this.Height.value;
        }
        set height(value) {
            this.Height.value = value;
        }


        protected backgroundProperty() {
            return super.backgroundProperty();
        }
        get Background() {
            return this.backgroundProperty();
        }
        get background() {
            return this.Background.value;
        }
        set background(value) {
            this.Background.value = value;
        }


        protected shadowProperty() {
            return super.shadowProperty();
        }
        get Shadow() {
            return this.shadowProperty();
        }
        get shadow() {
            return this.Shadow.value;
        }
        set shadow(value) {
            this.Shadow.value = value;
        }
        
        get Padding() {
            return this.paddingProperty();
        }
        get padding() {
            return this.Padding.value;
        }
        set padding(value) {
            this.Padding.value = value;
        }

        get Border() {
            return this.borderProperty();
        }
        get border() {
            return this.Border.value;
        }
        set border(value) {
            this.Border.value = value;
        }

        
        public get children() {
            return this.children_inner;
        }
        
    }

}
