/// <reference path="events.ts"/>

module cubee {

    export interface IChangeListener {
        (sender?: Object): void;
    }

    export interface IObservable {
        addChangeListener(listener: IChangeListener): void;
        removeChangeListener(listener: IChangeListener): void;
        hasChangeListener(listener: IChangeListener): void;
    }

    export interface IBindable<T> {
        bind(source: T): void;
        unbind(): void;
        isBound(): boolean;
    }

    export interface IAnimateable<T> {
        animate(pos: number, startValue: T, endValue: T): T;
    }

    export interface IProperty<T> extends IObservable {
        getObjectValue(): Object;
        invalidate(): void;
    }

    export interface IValidator<T> {
        validate(value: T): T;
    }

    export class Property<T> implements IProperty<T>, IAnimateable<T>, IBindable<IProperty<T>> {

        private static _nextId = 0;

        private _changeListeners: IChangeListener[] = [];

        private _valid: boolean = false;
        private _bindingSource: IProperty<T>;

        private _readonlyBind: IProperty<T>;
        private _bidirectionalBindProperty: Property<T>;
        private _bidirectionalChangeListenerThis: IChangeListener;
        private _bidirectionalChangeListenerOther: IChangeListener;
        private _id: string = "p" + Property._nextId++;

        constructor(
            private _value?: T,
            private _nullable: boolean = true,
            private _readonly: boolean = false,
            private _validator: IValidator<T> = null) {

            if (_value == null && _nullable == false) {
                throw "A nullable property can not be null.";
            }

            if (this._value != null && _validator != null) {
                this._value = _validator.validate(_value);
            }

            this.invalidate();
        }

        get id() {
            return this._id;
        }

        get valid() {
            return this._valid;
        }

        get value() {
            return this._value;
        }

        set value(newValue: T) {
            this.set(newValue);
        }

        get nullable() {
            return this._nullable;
        }

        get readonly() {
            return this._readonly;
        }

        private bindListener() {
            this.invalidateIfNeeded();
        }

        initReadonlyBind(readonlyBind: IProperty<T>) {
            if (this._readonlyBind != null) {
                throw "The readonly bind is already initialized.";
            }
            this._readonlyBind = readonlyBind;
            if (readonlyBind != null) {
                readonlyBind.addChangeListener(this.bindListener);
            }
            this.invalidate();
        }

        private get(): T {
            this._valid = true;

            if (this._bindingSource != null) {
                if (this._validator != null) {
                    return this._validator.validate(<T>this._bindingSource.getObjectValue());
                }
                return <T>this._bindingSource.getObjectValue();
            }

            if (this._readonlyBind != null) {
                if (this._validator != null) {
                    return this._validator.validate(<T>this._readonlyBind.getObjectValue());
                }
                return <T>this._readonlyBind.getObjectValue();
            }

            return this._value;
        }

        private set(newValue: T) {
            if (this._readonly) {
                throw "Can not change the value of a readonly property.";
            }

            if (this.isBound()) {
                throw "Can not change the value of a bound property.";
            }

            if (!this._nullable && newValue == null) {
                throw "Can not set the value to null of a non nullable property.";
            }

            if (this._validator != null) {
                newValue = this._validator.validate(newValue);
            }

            if (this._value == newValue) {
                return;
            }

            if (this._value != null && this._value == newValue) {
                return;
            }

            this._value = newValue;

            this.invalidate();
        }

        invalidate() {
            this._valid = false;
            this.fireChangeListeners();
        }

        invalidateIfNeeded() {
            if (!this._valid) {
                return;
            }
            this.invalidate();
        }

        fireChangeListeners() {
            this._changeListeners.forEach((listener) => {
                listener(this);
            });
        }

        getObjectValue(): Object {
            return this.get();
        }

        addChangeListener(listener: IChangeListener) {
            if (listener == null) {
                throw "The listener parameter can not be null.";
            }

            if (this.hasChangeListener(listener)) {
                return;
            }

            this._changeListeners.push(listener);

            // validate the component
            this.get();
        }

        removeChangeListener(listener: IChangeListener) {
            var idx = this._changeListeners.indexOf(listener);
            if (idx < 0) {
                return;
            }
            this._changeListeners.splice(idx);
        }

        hasChangeListener(listener: IChangeListener): boolean {
            this._changeListeners.forEach((l) => {
                if (l == listener) {
                    return true;
                }
            });
            return false;
        }

        animate(pos: number, startValue: T, endValue: T) {
            if (pos < 0.5) {
                return startValue;
            }

            return endValue;
        }

        bind(source: IProperty<T>) {
            if (source == null) {
                throw "The source can not be null.";
            }

            if (this.isBound()) {
                throw "This property is already bound.";
            }

            if (this._readonly) {
                throw "Can't bind a readonly property.";
            }

            this._bindingSource = source;
            this._bindingSource.addChangeListener(this.bindListener);
            this.invalidate();
        }

        bidirectionalBind(other: Property<T>) {
            if (this.isBound()) {
                throw "This property is already bound.";
            }

            if (this._readonly) {
                throw "Can't bind a readonly property.";
            }

            if (other == null) {
                throw "The other parameter can not be null.";
            }

            if (other._readonly) {
                throw "Can not bind a property bidirectionally to a readonly property.";
            }

            if (other == this) {
                throw "Can not bind a property bidirectionally for themself.";
            }

            if (other.isBound()) {
                throw "The target property is already bound.";
            }

            this._bidirectionalBindProperty = other;
            this._bidirectionalChangeListenerOther = () => {
                this.set(this._bidirectionalBindProperty.get());
            }
            other.addChangeListener(this._bidirectionalChangeListenerOther);
            this._bidirectionalChangeListenerThis = () => {
                this._bidirectionalBindProperty.set(this.get());
            }
            this.addChangeListener(this._bidirectionalChangeListenerThis);

            other._bidirectionalBindProperty = this;
            other._bidirectionalChangeListenerOther = this._bidirectionalChangeListenerThis;
            other._bidirectionalChangeListenerThis = this._bidirectionalChangeListenerOther;

        }

        unbind() {
            if (this._bindingSource != null) {
                this._bindingSource.removeChangeListener(this.bindListener);
                this._bindingSource = null;
                this.invalidate();
            } else if (this.isBidirectionalBound()) {
                this.removeChangeListener(this._bidirectionalChangeListenerThis);
                this._bidirectionalBindProperty.removeChangeListener(this._bidirectionalChangeListenerOther);
                this._bidirectionalBindProperty._bidirectionalBindProperty = null;
                this._bidirectionalBindProperty._bidirectionalChangeListenerOther = null;
                this._bidirectionalBindProperty._bidirectionalChangeListenerThis = null;
                this._bidirectionalBindProperty = null;
                this._bidirectionalChangeListenerOther = null;
                this._bidirectionalChangeListenerThis = null;
            }
        }

        unbindTargets() {
            // TODO null bindingSource of targets
            this._changeListeners = [];
        }

        isBound() {
            return this._bindingSource != null;
        }

        isBidirectionalBound() {
            return this._bidirectionalBindProperty != null;
        }

        createPropertyLine(keyFrames: KeyFrame<T>[]): PropertyLine<T> {
            return new PropertyLine<T>(keyFrames);
        }

        destroy() {
            this.unbind();
            this._changeListeners = [];
            this.bindListener = null;
        }

    }

    export class Expression<T> implements IProperty<T>, IObservable {

        private _notifyListenersOnce = new RunOnce(() => {
            this.fireChangeListeners();
        });

        private _bindingSources: IProperty<any>[] = [];
        private _bindingListener: IChangeListener = () => {
            this.invalidateIfNeeded();
        };
        private _changeListeners: IChangeListener[] = [];

        private _func: { (): T };
        private _valid = false;
        private _value: T = null;

        constructor(func: { (): T }, ...activators: IProperty<any>[]) {
            if (func == null) {
                throw "The 'func' parameter can not be null";
            }
            this._func = func;
            this.bind.apply(this, activators);
        }

        get value() {
            if (!this._valid) {
                this._value = this._func();
                this._valid = true;
            }

            return this._value;
        }

        addChangeListener(listener: IChangeListener) {
        if (listener == null) {
            throw "The listener parameter can not be null.";
        }

        if (this.hasChangeListener(listener)) {
            return;
        }

        this._changeListeners.push(listener);

        let x = this.value;
    }

    removeChangeListener(listener: IChangeListener) {
        var index = this._changeListeners.indexOf(listener);
        if (index > -1) {
            this._changeListeners.splice(index, 1);
        }

        if (this._changeListeners.length < 1) {
            this._bindingSources.forEach((prop) => {
                prop.removeChangeListener(this._bindingListener);
            });
        }

        this.invalidate();
    }

    hasChangeListener(listener: IChangeListener) {
        return this._changeListeners.indexOf(listener) > -1;
    }

    getObjectValue() {
        return this.value;
    }

    bind(...properties: IProperty<any>[]) {
        properties.forEach((prop) => {
            prop.addChangeListener(this._bindingListener);
            this._bindingSources.push(prop);
        });

        this.invalidate();
    }

    unbindAll() {
        this._bindingSources.forEach((prop) => {
            prop.removeChangeListener(this._bindingListener);
        });
        this._bindingSources = [];
        this.invalidate();
    }

    unbind(property: IProperty<any>) {
        property.removeChangeListener(this._bindingListener);
        var index = this._bindingSources.indexOf(property);
        if (index > -1) {
            this._bindingSources.splice(index, 1);
        }
        this.invalidate();
    }

    invalidate() {
        this._valid = false;
        this._notifyListenersOnce.run();
    }

    invalidateIfNeeded() {
        if (!this._valid) {
            return;
        }
        this.invalidate();
    }

    private fireChangeListeners() {
        this._changeListeners.forEach((listener: IChangeListener) => {
            listener(this);
        });
    }

}

export class KeyFrame<T> {

    constructor(
        private _time: number,
        private _property: Property<T>,
        private _endValue: T,
        private _keyframeReachedListener: { (): void } = null,
        private _interpolator: IInterpolator = Interpolators.Linear) {

        if (_time < 0) {
            throw "The time parameter can not be smaller than zero.";
        }

        if (_property == null) {
            throw "The property parameter can not be null.";
        }
        if (_property.readonly) {
            throw "Can't animate a read-only property.";
        }

        if (_endValue == null && !_property.nullable) {
            throw "Can't set null value to a non nullable property.";
        }

        if (_interpolator == null) {
            this._interpolator = Interpolators.Linear;
        }
    }

    get time() {
        return this._time;
    }

    get property() {
        return this._property
    }

    get endValue() {
        return this._endValue;
    }

    get interpolator() {
        return this._interpolator;
    }

    get keyFrameReachedListener() {
        return this._keyframeReachedListener;
    }

}

export class PropertyLine<T> {

    private _property: Property<T>;
    private _startTime: number = -1;
    private _lastRunTime: number = -1;
    private _previousFrame: KeyFrame<T> = null;

    constructor(private _keyFrames: KeyFrame<T>[]) {
        this._property = _keyFrames[0].property;
        var firstFrame: KeyFrame<T> = _keyFrames[0];
        if (firstFrame.time > 0) {
            _keyFrames.splice(0, 0, new KeyFrame(0, firstFrame.property, firstFrame.property.value));
        }
    }

    get startTime() {
        return this._startTime;
    }

    set startTime(startTime: number) {
        this._startTime = startTime;
    }

    animate() {
        var actTime = Date.now();

        if (actTime == this._startTime) {
            return false;
        }

        var nextFrame: KeyFrame<T> = null;
        var actFrame: KeyFrame<T> = null;
        for (var i = 0; i < this._keyFrames.length; i++) {
            let frame = this._keyFrames[i];
            var fr: KeyFrame<T> = frame;
            if (actTime >= this._startTime + fr.time) {
                actFrame = frame;
            } else {
                nextFrame = frame;
                break;
            }

            if (this._startTime + fr.time > this._lastRunTime && this._startTime + fr.time <= actTime) {
                if (fr.keyFrameReachedListener != null) {
                    fr.keyFrameReachedListener();
                }
            }
        }

        if (actFrame != null) {
            if (nextFrame != null) {
                var pos = ((actTime - this._startTime - actFrame.time)) / (nextFrame.time - actFrame.time);
                actFrame.property.value = actFrame.property.animate(pos, actFrame.endValue, nextFrame.endValue);
            } else {
                actFrame.property.value = actFrame.endValue;
            }
        }

        this._lastRunTime = actTime;

        return actTime >= this._startTime + this._keyFrames[this._keyFrames.length - 1].time;

    }

}

export interface IInterpolator {
    (value: number): number;
}

export class Interpolators {
    static get Linear(): IInterpolator {
        return (value: number): number => {
            return value;
        }
    }
}

export abstract class AAnimator {

    private static animators: AAnimator[] = [];
    private static ANIMATOR_TASK = (): void => {
        AAnimator.animate();
    };

    private started: boolean = false;

    static animate() {
        for (var i = AAnimator.animators.length - 1; i >= 0; i--) {
            if (AAnimator.animators.length <= i) {
                continue;
            }
            var animator: AAnimator = AAnimator.animators[i];
            try {
                animator.onAnimate();
            } catch (t) {
                new Console().error(t);
            }
        }

        if (AAnimator.animators.length > 0) {
            EventQueue.Instance.invokeLater(AAnimator.ANIMATOR_TASK);
        }
    }

    start() {
        if (this.started) {
            return;
        }

        AAnimator.animators.push(this);
        if (AAnimator.animators.length == 1) {
            EventQueue.Instance.invokeLater(AAnimator.ANIMATOR_TASK);
        }
        this.started = true;
    }

    stop() {
        if (!this.started) {
            return;
        }

        this.started = false;

        var idx = AAnimator.animators.indexOf(this);
        AAnimator.animators.splice(idx, 1)
    }

    get Started() {
        return this.started;
    }

    get Stopped() {
        return !this.started;
    }

    protected abstract onAnimate(): void;
}

export class Timeline extends AAnimator {


    private propertyLines: PropertyLine<any>[] = [];
    private repeatCount = 0;
    private finishedEvent: Event<TimelineFinishedEventArgs> = new Event<TimelineFinishedEventArgs>();

    constructor(private keyFrames: KeyFrame<any>[]) {
        super();
    }

    createPropertyLines() {
        var plMap: { [key: string]: KeyFrame<any>[] } = {};
        var keys: string[] = [];
        for (var i = 0; i < this.keyFrames.length; i++) {
            let keyFrame = this.keyFrames[i];
            let kf: KeyFrame<any> = keyFrame;
            let propertyLine = plMap[kf.property.id];
            if (propertyLine == null) {
                propertyLine = [];
                plMap[kf.property.id] = propertyLine;
                keys.push(kf.property.id)
            }
            if (propertyLine.length > 0) {
                if (propertyLine[propertyLine.length - 1].time >= kf.time) {
                    throw "The keyframes must be in ascending time order per property.";
                }
            }
            propertyLine.push(keyFrame);
        }
        keys.forEach((key) => {
            let propertyLine: PropertyLine<any> = plMap[key][0].property.createPropertyLine(plMap[key]);
            this.propertyLines.push(propertyLine);
        });
    }

    start(repeatCount: number = 0) {
        if (repeatCount == null) {
            repeatCount = 0;
        }
        repeatCount = repeatCount | 0;
        this.createPropertyLines();
        this.repeatCount = repeatCount;
        var startTime = Date.now();
        this.propertyLines.forEach((propertyLine) => {
            let pl: PropertyLine<any> = propertyLine;
            pl.startTime = startTime;
        });
        super.start();
    }

    stop() {
        if (!this.Started) {
            return;
        }
        super.stop();
        this.finishedEvent.fireEvent(new TimelineFinishedEventArgs(true));
    }

    onAnimate() {
        var finished = true;
        this.propertyLines.forEach((propertyLine) => {
            let pl: PropertyLine<any> = propertyLine;
            finished = finished && pl.animate();
        });

        if (finished) {
            if (this.repeatCount < 0) {
                let startTime = Date.now();
                this.propertyLines.forEach((propertyLine) => {
                    let pl: PropertyLine<any> = propertyLine;
                    pl.startTime = startTime;
                });
            } else {
                this.repeatCount--;
                if (this.repeatCount > -1) {
                    let startTime = Date.now();
                    this.propertyLines.forEach((propertyLine) => {
                        let pl: PropertyLine<any> = propertyLine;
                        pl.startTime = startTime;
                    });
                } else {
                    super.stop();
                    this.finishedEvent.fireEvent(new TimelineFinishedEventArgs(false));
                }
            }
        }
    }

    onFinishedEvent() {
        return this.finishedEvent;
    }

}

export class TimelineFinishedEventArgs {
    constructor(private stopped: boolean = false) {

    }

    get Stopped() {
        return this.stopped;
    }
}

export class NumberProperty extends Property<number> {

    animate(pos: number, startValue: number, endValue: number): number {
        return startValue + ((endValue - startValue) * pos);
    }

}

export class StringProperty extends Property<string> {

}

export class PaddingProperty extends Property<Padding> {

}

export class BorderProperty extends Property<Border> {

}

export class BackgroundProperty extends Property<ABackground> {

}

export class BooleanProperty extends Property<boolean> {

}

}


