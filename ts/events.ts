namespace cubee {

    export class EventArgs {
        constructor(public sender: Object) { }
    }
    
    export interface IListenerCallback<T> {
        onAdded(listener: IEventListener<T>): void;
        onRemoved(listener: IEventListener<T>): void;
    }
    
    export class HtmlEventListenerCallback<T> implements IListenerCallback<T> {
        
        constructor(private _element: HTMLElement, private _eventType: string) {
            
        }
        
        onAdded(listener: IEventListener<T>): void {
            (<any>listener).$$nativeListener = function (eventArgs: T) {
                listener(eventArgs);
            }
            this._element.addEventListener(this._eventType, (<any>listener).$$nativeListener);
        }
        
        onRemoved(listener: IEventListener<T>): void {
            this._element.removeEventListener(this._eventType, (<any>listener).$$nativeListener);
        }
        
    }

    export class Event<T> {

        private _listeners: IEventListener<T>[] = [];

        constructor(private _listenerCallback: IListenerCallback<T> = null) {
        }

        addListener(listener: IEventListener<T>) {
            if (listener == null) {
                throw "The listener parameter can not be null.";
            }

            if (this.hasListener(listener)) {
                return;
            }

            this._listeners.push(listener);
            
            if (this._listenerCallback != null) {
                this._listenerCallback.onAdded(listener);
            }
        }

        removeListener(listener: IEventListener<T>) {
            var idx = this._listeners.indexOf(listener);
            if (idx < 0) {
                return;
            }
            this._listeners.splice(idx, 1);
            
            if (this._listenerCallback != null) {
                this._listenerCallback.onRemoved(listener);
            }
        }

        hasListener(listener: IEventListener<T>) {
            return this._listeners.indexOf(listener) > -1;
        }

        fireEvent(args: T) {
            for (var l of this._listeners) {
                let listener: IEventListener<T> = l;
                listener(args);
            }
        }
        
        get listenerCallback() {
            return this._listenerCallback;
        }
        
        set listenerCallback(value: IListenerCallback<T>) {
            this._listenerCallback = value;
        }

    }

    export class Timer {

        private token: number;
        private repeat: boolean = true;
        private action: { (): void } = () => {
            this.func();
            if (!this.repeat) {
                this.token = null;
            }
        };

        constructor(private func: { (): void }) {
            if (func == null) {
                throw "The func parameter can not be null.";
            }
        }

        start(delay: number, repeat: boolean) {
            this.stop();
            this.repeat = repeat;
            if (this.repeat) {
                this.token = setInterval(this.func, delay);
            } else {
                this.token = setTimeout(this.func, delay);
            }
        }

        stop() {
            if (this.token != null) {
                clearInterval(this.token);
                this.token = null;
            }
        }

        get Started() {
            return this.token != null;
        }

    }

    export interface IEventListener<T> {
        (args: T): void;
    }

    export class EventQueue {

        private static instance: EventQueue = null;

        static get Instance() {
            if (EventQueue.instance == null) {
                EventQueue.instance = new EventQueue();
            }

            return EventQueue.instance;
        }

        private queue: { (): void }[] = [];
        private timer: Timer = null;

        constructor() {
            this.timer = new Timer(() => {
                let size = this.queue.length;
                try {
                    for (let i: number = 0; i < size; i++) {
                        let task: { (): void };
                        task = this.queue[0];
                        this.queue.splice(0, 1);
                        if (task != null) {
                            task();
                        }
                    }
                } finally {
                    if (size > 0) {
                        // if there were some task than we need to check fast if more tasks are received
                        this.timer.start(0, false);
                    } else {
                        // if there isn't any task than we can relax a bit
                        this.timer.start(50, false);
                    }
                }


            });
            this.timer.start(10, false);
        }

        invokeLater(task: { (): void }) {
            if (task == null) {
                throw "The task can not be null.";
            }
            this.queue.push(task);
        }

        invokePrior(task: { (): void }) {
            if (task == null) {
                throw "The task can not be null.";
            }
            this.queue.splice(0, 0, task);
        }

    }

    export class RunOnce {

        private scheduled = false;

        constructor(private func: IRunnable) {
            if (func == null) {
                throw "The func parameter can not be null.";
            }
        }

        run() {
            if (this.scheduled) {
                return;
            }
            this.scheduled = true;
            EventQueue.Instance.invokeLater(() => {
                this.scheduled = false;
                this.func();
            });
        }
    }

    export class ParentChangedEventArgs extends EventArgs {
        constructor(public newParent: ALayout,
            public sender: Object) {
            super(sender);
        }
    }

}


