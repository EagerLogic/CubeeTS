module cubee {
    
    export class EventArgs {
        constructor(public sender: Object) {}
    }
    
    export class Event<T> {
        
        private listeners: IEventListener<T>[] = [];

        public Event() {
        }

        addListener(listener: IEventListener<T>) {
            if (listener == null) {
                throw "The listener parameter can not be null.";
            }

            if (this.hasListener(listener)) {
                return;
            }

            this.listeners.push(listener);
        }

        removeListener(listener: IEventListener<T>) {
            var idx = this.listeners.indexOf(listener);
            if (idx < 0) {
                return;
            }
            this.listeners.splice(idx, 1);
        }

        hasListener(listener: IEventListener<T>) {
            return this.listeners.indexOf(listener) > -1;
        }

        fireEvent(args: T) {
            for (var l in this.listeners) {
                let listener: IEventListener<T> = l;
                listener(args);
            }
        }
        
    }
    
    export class Timer {
        
        private token: number;
        private repeat: boolean = true;
        private action: {(): void} = () => {
            this.func();
            if (!this.repeat) {
                this.token = null;
            }
        };
        
        constructor (private func: {(): void}) {
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
        
        private queue: {(): void}[] = [];
        private timer: Timer = null;

        private EventQueue() {
            this.timer = new Timer(() => {
                let size = this.queue.length;
                    try {
                        for (let i: number = 0; i < size; i++) {
                            // pollFirst() method isn't part of the GWT API
                            let task: {(): void};
                            task = this.queue[0];
                            this.queue.splice(0, 1);
                            if (task != null) {
                                task();
                            }
                        }
                    } catch (ex) {
                        new Console().error(ex);
                    }

                    if (size > 0) {
                        // if there were some task than we need to check fast if more tasks are received
                        this.timer.start(0, false);
                    } else {
                        // if there isn't any task than we can relax a bit
                        this.timer.start(50, false);
                    }
                });
            this.timer.start(10, false);
        }

        invokeLater(task: {(): void}) {
            if (task == null) {
                throw "The task can not be null.";
            }
            this.queue.push(task);
        }

        invokePrior(task: {(): void}) {
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
            
            EventQueue.Instance.invokeLater(() => {
                this.scheduled = false;
                this.func();
            });
        }
    }
    
    export class MouseDragEventArgs {
        constructor (
                public screenX: number,
                public screenY: number,
                public deltaX: number,
                public deltaY: number,
                public altPressed: boolean,
                public ctrlPressed: boolean,
                public shiftPressed: boolean,
                public metaPressed: boolean,
                public sender: Object) {}
    }
    
    export class MouseUpEventArgs {
        constructor (
                public screenX: number,
                public screenY: number,
                public deltaX: number,
                public deltaY: number,
                public altPressed: boolean,
                public ctrlPressed: boolean,
                public shiftPressed: boolean,
                public metaPressed: boolean,
                public button: number,
                public nativeEvent: MouseEvent,
                public sender: Object) {}
    }
    
    export class MouseDownEventArgs {
        constructor (
                public screenX: number,
                public screenY: number,
                public deltaX: number,
                public deltaY: number,
                public altPressed: boolean,
                public ctrlPressed: boolean,
                public shiftPressed: boolean,
                public metaPressed: boolean,
                public button: number,
                public nativeEvent: MouseEvent,
                public sender: Object) {}
    }
    
    export class MouseMoveEventArgs {
        constructor (
                public screenX: number,
                public screenY: number,
                public x: number,
                public y: number,
                public altPressed: boolean,
                public ctrlPressed: boolean,
                public shiftPressed: boolean,
                public metaPressed: boolean,
                public sender: Object) {}
    }
    
    export class MouseWheelEventArgs {
        constructor (
                public wheelVelocity: number,
                public altPressed: boolean,
                public ctrlPressed: boolean,
                public shiftPressed: boolean,
                public metaPressed: boolean,
                public sender: Object) {}
    }
    
    export class ClickEventArgs {
        constructor (
                public screenX: number,
                public screenY: number,
                public deltaX: number,
                public deltaY: number,
                public altPressed: boolean,
                public ctrlPressed: boolean,
                public shiftPressed: boolean,
                public metaPressed: boolean,
                public button: number,
                public sender: Object) {}
    }
    
    export class KeyEventArgs {
        constructor (
                public keyCode: number,
                public altPressed: boolean,
                public ctrlPressed: boolean,
                public shiftPressed: boolean,
                public metaPressed: boolean,
                public sender: Object,
                public nativeEvent: KeyboardEvent
            ) {}
    }
    
    export class ParentChangedEventArgs extends EventArgs {
        constructor (public newParent: ALayout,
                public sender: Object) {
                    super(sender);
                }
    }
    
    export class ContextMenuEventArgs {
        constructor(public nativeEvent: UIEvent,
                public sender: Object) {}
    }
    
}


