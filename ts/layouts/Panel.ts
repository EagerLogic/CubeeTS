module cubee {

    export class Panel extends AUserControl {
        
        public get Width() {
            return this._Width;
        }
        public get width() {
            return this.Width.value;
        }
        public set width(value) {
            this.Width.value = value;
        }

        public get Height() {
            return this._Height;
        }
        public get height() {
            return this.Height.value;
        }
        public set height(value) {
            this.Height.value = value;
        }

        public get Background() {
            return this._Background;
        }
        public get background() {
            return this.Background.value;
        }
        public set background(value) {
            this.Background.value = value;
        }

        public get Shadow() {
            return this._Shadow;
        }
        public get shadow() {
            return this.Shadow.value;
        }
        public set shadow(value) {
            this.Shadow.value = value;
        }
        
        public get children() {
            return this.children_inner;
        }
        
    }

}
