namespace cubee {
    
    export class AView<T> extends AUserControl {
        
        constructor(private _model: T) {
            super();
        }
        
        get model() {
            return this._model;
        }
        
    }
    
}

