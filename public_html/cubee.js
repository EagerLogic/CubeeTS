var cubee;
(function (cubee) {
    var Point2D = (function () {
        function Point2D(_x, _y) {
            this._x = _x;
            this._y = _y;
        }
        Object.defineProperty(Point2D.prototype, "x", {
            get: function () {
                return this._x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Point2D.prototype, "y", {
            get: function () {
                return this._y;
            },
            enumerable: true,
            configurable: true
        });
        return Point2D;
    }());
    cubee.Point2D = Point2D;
})(cubee || (cubee = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var cubee;
(function (cubee) {
    var EventArgs = (function () {
        function EventArgs(sender) {
            this.sender = sender;
        }
        return EventArgs;
    }());
    cubee.EventArgs = EventArgs;
    var HtmlEventListenerCallback = (function () {
        function HtmlEventListenerCallback(_element, _eventType) {
            this._element = _element;
            this._eventType = _eventType;
        }
        HtmlEventListenerCallback.prototype.onAdded = function (listener) {
            listener.$$nativeListener = function (eventArgs) {
                listener(eventArgs);
            };
            this._element.addEventListener(this._eventType, listener.$$nativeListener);
        };
        HtmlEventListenerCallback.prototype.onRemoved = function (listener) {
            this._element.removeEventListener(this._eventType, listener.$$nativeListener);
        };
        return HtmlEventListenerCallback;
    }());
    cubee.HtmlEventListenerCallback = HtmlEventListenerCallback;
    var Event = (function () {
        function Event(_listenerCallback) {
            if (_listenerCallback === void 0) { _listenerCallback = null; }
            this._listenerCallback = _listenerCallback;
            this._listeners = [];
        }
        Event.prototype.addListener = function (listener) {
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
        };
        Event.prototype.removeListener = function (listener) {
            var idx = this._listeners.indexOf(listener);
            if (idx < 0) {
                return;
            }
            this._listeners.splice(idx, 1);
            if (this._listenerCallback != null) {
                this._listenerCallback.onRemoved(listener);
            }
        };
        Event.prototype.hasListener = function (listener) {
            return this._listeners.indexOf(listener) > -1;
        };
        Event.prototype.fireEvent = function (args) {
            for (var _i = 0, _a = this._listeners; _i < _a.length; _i++) {
                var l = _a[_i];
                var listener = l;
                listener(args);
            }
        };
        Object.defineProperty(Event.prototype, "listenerCallback", {
            get: function () {
                return this._listenerCallback;
            },
            set: function (value) {
                this._listenerCallback = value;
            },
            enumerable: true,
            configurable: true
        });
        return Event;
    }());
    cubee.Event = Event;
    var Timer = (function () {
        function Timer(func) {
            var _this = this;
            this.func = func;
            this.repeat = true;
            this.action = function () {
                _this.func();
                if (!_this.repeat) {
                    _this.token = null;
                }
            };
            if (func == null) {
                throw "The func parameter can not be null.";
            }
        }
        Timer.prototype.start = function (delay, repeat) {
            this.stop();
            this.repeat = repeat;
            if (this.repeat) {
                this.token = setInterval(this.func, delay);
            }
            else {
                this.token = setTimeout(this.func, delay);
            }
        };
        Timer.prototype.stop = function () {
            if (this.token != null) {
                clearInterval(this.token);
                this.token = null;
            }
        };
        Object.defineProperty(Timer.prototype, "Started", {
            get: function () {
                return this.token != null;
            },
            enumerable: true,
            configurable: true
        });
        return Timer;
    }());
    cubee.Timer = Timer;
    var EventQueue = (function () {
        function EventQueue() {
            var _this = this;
            this.queue = [];
            this.timer = null;
            this.timer = new Timer(function () {
                var size = _this.queue.length;
                try {
                    for (var i = 0; i < size; i++) {
                        var task = void 0;
                        task = _this.queue[0];
                        _this.queue.splice(0, 1);
                        if (task != null) {
                            task();
                        }
                    }
                }
                finally {
                    if (size > 0) {
                        _this.timer.start(0, false);
                    }
                    else {
                        _this.timer.start(50, false);
                    }
                }
            });
            this.timer.start(10, false);
        }
        Object.defineProperty(EventQueue, "Instance", {
            get: function () {
                if (EventQueue.instance == null) {
                    EventQueue.instance = new EventQueue();
                }
                return EventQueue.instance;
            },
            enumerable: true,
            configurable: true
        });
        EventQueue.prototype.invokeLater = function (task) {
            if (task == null) {
                throw "The task can not be null.";
            }
            this.queue.push(task);
        };
        EventQueue.prototype.invokePrior = function (task) {
            if (task == null) {
                throw "The task can not be null.";
            }
            this.queue.splice(0, 0, task);
        };
        return EventQueue;
    }());
    EventQueue.instance = null;
    cubee.EventQueue = EventQueue;
    var RunOnce = (function () {
        function RunOnce(func) {
            this.func = func;
            this.scheduled = false;
            if (func == null) {
                throw "The func parameter can not be null.";
            }
        }
        RunOnce.prototype.run = function () {
            var _this = this;
            if (this.scheduled) {
                return;
            }
            this.scheduled = true;
            EventQueue.Instance.invokeLater(function () {
                _this.scheduled = false;
                _this.func();
            });
        };
        return RunOnce;
    }());
    cubee.RunOnce = RunOnce;
    var ParentChangedEventArgs = (function (_super) {
        __extends(ParentChangedEventArgs, _super);
        function ParentChangedEventArgs(newParent, sender) {
            var _this = _super.call(this, sender) || this;
            _this.newParent = newParent;
            _this.sender = sender;
            return _this;
        }
        return ParentChangedEventArgs;
    }(EventArgs));
    cubee.ParentChangedEventArgs = ParentChangedEventArgs;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var Property = (function () {
        function Property(_value, _nullable, _readonly, _validator) {
            if (_nullable === void 0) { _nullable = true; }
            if (_readonly === void 0) { _readonly = false; }
            if (_validator === void 0) { _validator = null; }
            var _this = this;
            this._value = _value;
            this._nullable = _nullable;
            this._readonly = _readonly;
            this._validator = _validator;
            this._changeListeners = [];
            this._valid = false;
            this._id = "p" + Property._nextId++;
            this.bindListener = function () {
                _this.invalidateIfNeeded();
            };
            if (_value == null && _nullable == false) {
                throw "A nullable property can not be null.";
            }
            if (this._value != null && _validator != null) {
                this._value = _validator.validate(_value);
            }
            this.invalidate();
        }
        Object.defineProperty(Property.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Property.prototype, "valid", {
            get: function () {
                return this._valid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Property.prototype, "value", {
            get: function () {
                return this.get();
            },
            set: function (newValue) {
                this.set(newValue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Property.prototype, "nullable", {
            get: function () {
                return this._nullable;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Property.prototype, "readonly", {
            get: function () {
                return this._readonly;
            },
            enumerable: true,
            configurable: true
        });
        Property.prototype.initReadonlyBind = function (readonlyBind) {
            if (this._readonlyBind != null) {
                throw "The readonly bind is already initialized.";
            }
            this._readonlyBind = readonlyBind;
            if (readonlyBind != null) {
                readonlyBind.addChangeListener(this.bindListener);
            }
            this.invalidate();
        };
        Property.prototype.get = function () {
            this._valid = true;
            if (this._bindingSource != null) {
                if (this._validator != null) {
                    return this._validator.validate(this._bindingSource.getObjectValue());
                }
                return this._bindingSource.getObjectValue();
            }
            if (this._readonlyBind != null) {
                if (this._validator != null) {
                    return this._validator.validate(this._readonlyBind.getObjectValue());
                }
                return this._readonlyBind.getObjectValue();
            }
            return this._value;
        };
        Property.prototype.set = function (newValue) {
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
        };
        Property.prototype.invalidate = function () {
            this._valid = false;
            this.fireChangeListeners();
        };
        Property.prototype.invalidateIfNeeded = function () {
            if (!this._valid) {
                return;
            }
            this.invalidate();
        };
        Property.prototype.fireChangeListeners = function () {
            var _this = this;
            this._changeListeners.forEach(function (listener) {
                listener(_this);
            });
        };
        Property.prototype.getObjectValue = function () {
            return this.get();
        };
        Property.prototype.addChangeListener = function (listener) {
            if (listener == null) {
                throw "The listener parameter can not be null.";
            }
            if (this.hasChangeListener(listener)) {
                return;
            }
            this._changeListeners.push(listener);
            this.get();
        };
        Property.prototype.removeChangeListener = function (listener) {
            var idx = this._changeListeners.indexOf(listener);
            if (idx < 0) {
                return;
            }
            this._changeListeners.splice(idx);
        };
        Property.prototype.hasChangeListener = function (listener) {
            this._changeListeners.forEach(function (l) {
                if (l == listener) {
                    return true;
                }
            });
            return false;
        };
        Property.prototype.animate = function (pos, startValue, endValue) {
            if (pos < 0.5) {
                return startValue;
            }
            return endValue;
        };
        Property.prototype.bind = function (source) {
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
        };
        Property.prototype.bidirectionalBind = function (other) {
            var _this = this;
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
            this._bidirectionalChangeListenerOther = function () {
                _this.set(_this._bidirectionalBindProperty.get());
            };
            other.addChangeListener(this._bidirectionalChangeListenerOther);
            this._bidirectionalChangeListenerThis = function () {
                _this._bidirectionalBindProperty.set(_this.get());
            };
            this.addChangeListener(this._bidirectionalChangeListenerThis);
            other._bidirectionalBindProperty = this;
            other._bidirectionalChangeListenerOther = this._bidirectionalChangeListenerThis;
            other._bidirectionalChangeListenerThis = this._bidirectionalChangeListenerOther;
        };
        Property.prototype.unbind = function () {
            if (this._bindingSource != null) {
                this._bindingSource.removeChangeListener(this.bindListener);
                this._bindingSource = null;
                this.invalidate();
            }
            else if (this.isBidirectionalBound()) {
                this.removeChangeListener(this._bidirectionalChangeListenerThis);
                this._bidirectionalBindProperty.removeChangeListener(this._bidirectionalChangeListenerOther);
                this._bidirectionalBindProperty._bidirectionalBindProperty = null;
                this._bidirectionalBindProperty._bidirectionalChangeListenerOther = null;
                this._bidirectionalBindProperty._bidirectionalChangeListenerThis = null;
                this._bidirectionalBindProperty = null;
                this._bidirectionalChangeListenerOther = null;
                this._bidirectionalChangeListenerThis = null;
            }
        };
        Property.prototype.unbindTargets = function () {
            this._changeListeners = [];
        };
        Property.prototype.isBound = function () {
            return this._bindingSource != null;
        };
        Property.prototype.isBidirectionalBound = function () {
            return this._bidirectionalBindProperty != null;
        };
        Property.prototype.createPropertyLine = function (keyFrames) {
            return new PropertyLine(keyFrames);
        };
        Property.prototype.destroy = function () {
            this.unbind();
            this._changeListeners = [];
            this.bindListener = null;
        };
        return Property;
    }());
    Property._nextId = 0;
    cubee.Property = Property;
    var Expression = (function () {
        function Expression(func) {
            var activators = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                activators[_i - 1] = arguments[_i];
            }
            var _this = this;
            this._notifyListenersOnce = new cubee.RunOnce(function () {
                _this.fireChangeListeners();
            });
            this._bindingSources = [];
            this._bindingListener = function () {
                _this.invalidateIfNeeded();
            };
            this._changeListeners = [];
            this._valid = false;
            this._value = null;
            if (func == null) {
                throw "The 'func' parameter can not be null";
            }
            this._func = func;
            this.bind.apply(this, activators);
        }
        Object.defineProperty(Expression.prototype, "value", {
            get: function () {
                if (!this._valid) {
                    this._value = this._func();
                    this._valid = true;
                }
                return this._value;
            },
            enumerable: true,
            configurable: true
        });
        Expression.prototype.addChangeListener = function (listener) {
            if (listener == null) {
                throw "The listener parameter can not be null.";
            }
            if (this.hasChangeListener(listener)) {
                return;
            }
            this._changeListeners.push(listener);
            var x = this.value;
        };
        Expression.prototype.removeChangeListener = function (listener) {
            var _this = this;
            var index = this._changeListeners.indexOf(listener);
            if (index > -1) {
                this._changeListeners.splice(index, 1);
            }
            if (this._changeListeners.length < 1) {
                this._bindingSources.forEach(function (prop) {
                    prop.removeChangeListener(_this._bindingListener);
                });
            }
            this.invalidate();
        };
        Expression.prototype.hasChangeListener = function (listener) {
            return this._changeListeners.indexOf(listener) > -1;
        };
        Expression.prototype.getObjectValue = function () {
            return this.value;
        };
        Expression.prototype.bind = function () {
            var _this = this;
            var properties = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                properties[_i] = arguments[_i];
            }
            properties.forEach(function (prop) {
                prop.addChangeListener(_this._bindingListener);
                _this._bindingSources.push(prop);
            });
            this.invalidate();
        };
        Expression.prototype.unbindAll = function () {
            var _this = this;
            this._bindingSources.forEach(function (prop) {
                prop.removeChangeListener(_this._bindingListener);
            });
            this._bindingSources = [];
            this.invalidate();
        };
        Expression.prototype.unbind = function (property) {
            property.removeChangeListener(this._bindingListener);
            var index = this._bindingSources.indexOf(property);
            if (index > -1) {
                this._bindingSources.splice(index, 1);
            }
            this.invalidate();
        };
        Expression.prototype.invalidate = function () {
            this._valid = false;
            this._notifyListenersOnce.run();
        };
        Expression.prototype.invalidateIfNeeded = function () {
            if (!this._valid) {
                return;
            }
            this.invalidate();
        };
        Expression.prototype.fireChangeListeners = function () {
            var _this = this;
            this._changeListeners.forEach(function (listener) {
                listener(_this);
            });
        };
        return Expression;
    }());
    cubee.Expression = Expression;
    var KeyFrame = (function () {
        function KeyFrame(_time, _property, _endValue, _keyframeReachedListener, _interpolator) {
            if (_keyframeReachedListener === void 0) { _keyframeReachedListener = null; }
            if (_interpolator === void 0) { _interpolator = Interpolators.Linear; }
            this._time = _time;
            this._property = _property;
            this._endValue = _endValue;
            this._keyframeReachedListener = _keyframeReachedListener;
            this._interpolator = _interpolator;
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
        Object.defineProperty(KeyFrame.prototype, "time", {
            get: function () {
                return this._time;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(KeyFrame.prototype, "property", {
            get: function () {
                return this._property;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(KeyFrame.prototype, "endValue", {
            get: function () {
                return this._endValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(KeyFrame.prototype, "interpolator", {
            get: function () {
                return this._interpolator;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(KeyFrame.prototype, "keyFrameReachedListener", {
            get: function () {
                return this._keyframeReachedListener;
            },
            enumerable: true,
            configurable: true
        });
        return KeyFrame;
    }());
    cubee.KeyFrame = KeyFrame;
    var PropertyLine = (function () {
        function PropertyLine(_keyFrames) {
            this._keyFrames = _keyFrames;
            this._startTime = -1;
            this._lastRunTime = -1;
            this._previousFrame = null;
            this._property = _keyFrames[0].property;
            var firstFrame = _keyFrames[0];
            if (firstFrame.time > 0) {
                _keyFrames.splice(0, 0, new KeyFrame(0, firstFrame.property, firstFrame.property.value));
            }
        }
        Object.defineProperty(PropertyLine.prototype, "startTime", {
            get: function () {
                return this._startTime;
            },
            set: function (startTime) {
                this._startTime = startTime;
            },
            enumerable: true,
            configurable: true
        });
        PropertyLine.prototype.animate = function () {
            var actTime = Date.now();
            if (actTime == this._startTime) {
                return false;
            }
            var nextFrame = null;
            var actFrame = null;
            for (var i = 0; i < this._keyFrames.length; i++) {
                var frame = this._keyFrames[i];
                var fr = frame;
                if (actTime >= this._startTime + fr.time) {
                    actFrame = frame;
                }
                else {
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
                }
                else {
                    actFrame.property.value = actFrame.endValue;
                }
            }
            this._lastRunTime = actTime;
            return actTime >= this._startTime + this._keyFrames[this._keyFrames.length - 1].time;
        };
        return PropertyLine;
    }());
    cubee.PropertyLine = PropertyLine;
    var Interpolators = (function () {
        function Interpolators() {
        }
        Object.defineProperty(Interpolators, "Linear", {
            get: function () {
                return function (value) {
                    return value;
                };
            },
            enumerable: true,
            configurable: true
        });
        return Interpolators;
    }());
    cubee.Interpolators = Interpolators;
    var AAnimator = (function () {
        function AAnimator() {
            this.started = false;
        }
        AAnimator.animate = function () {
            for (var i = AAnimator.animators.length - 1; i >= 0; i--) {
                if (AAnimator.animators.length <= i) {
                    continue;
                }
                var animator = AAnimator.animators[i];
                try {
                    animator.onAnimate();
                }
                catch (t) {
                    new Console().error(t);
                }
            }
            if (AAnimator.animators.length > 0) {
                cubee.EventQueue.Instance.invokeLater(AAnimator.ANIMATOR_TASK);
            }
        };
        AAnimator.prototype.start = function () {
            if (this.started) {
                return;
            }
            AAnimator.animators.push(this);
            if (AAnimator.animators.length == 1) {
                cubee.EventQueue.Instance.invokeLater(AAnimator.ANIMATOR_TASK);
            }
            this.started = true;
        };
        AAnimator.prototype.stop = function () {
            if (!this.started) {
                return;
            }
            this.started = false;
            var idx = AAnimator.animators.indexOf(this);
            AAnimator.animators.splice(idx, 1);
        };
        Object.defineProperty(AAnimator.prototype, "Started", {
            get: function () {
                return this.started;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AAnimator.prototype, "Stopped", {
            get: function () {
                return !this.started;
            },
            enumerable: true,
            configurable: true
        });
        return AAnimator;
    }());
    AAnimator.animators = [];
    AAnimator.ANIMATOR_TASK = function () {
        AAnimator.animate();
    };
    cubee.AAnimator = AAnimator;
    var Timeline = (function (_super) {
        __extends(Timeline, _super);
        function Timeline(keyFrames) {
            var _this = _super.call(this) || this;
            _this.keyFrames = keyFrames;
            _this.propertyLines = [];
            _this.repeatCount = 0;
            _this.finishedEvent = new cubee.Event();
            return _this;
        }
        Timeline.prototype.createPropertyLines = function () {
            var _this = this;
            var plMap = {};
            var keys = [];
            for (var i = 0; i < this.keyFrames.length; i++) {
                var keyFrame = this.keyFrames[i];
                var kf = keyFrame;
                var propertyLine = plMap[kf.property.id];
                if (propertyLine == null) {
                    propertyLine = [];
                    plMap[kf.property.id] = propertyLine;
                    keys.push(kf.property.id);
                }
                if (propertyLine.length > 0) {
                    if (propertyLine[propertyLine.length - 1].time >= kf.time) {
                        throw "The keyframes must be in ascending time order per property.";
                    }
                }
                propertyLine.push(keyFrame);
            }
            keys.forEach(function (key) {
                var propertyLine = plMap[key][0].property.createPropertyLine(plMap[key]);
                _this.propertyLines.push(propertyLine);
            });
        };
        Timeline.prototype.start = function (repeatCount) {
            if (repeatCount === void 0) { repeatCount = 0; }
            if (repeatCount == null) {
                repeatCount = 0;
            }
            repeatCount = repeatCount | 0;
            this.createPropertyLines();
            this.repeatCount = repeatCount;
            var startTime = Date.now();
            this.propertyLines.forEach(function (propertyLine) {
                var pl = propertyLine;
                pl.startTime = startTime;
            });
            _super.prototype.start.call(this);
        };
        Timeline.prototype.stop = function () {
            if (!this.Started) {
                return;
            }
            _super.prototype.stop.call(this);
            this.finishedEvent.fireEvent(new TimelineFinishedEventArgs(true));
        };
        Timeline.prototype.onAnimate = function () {
            var finished = true;
            this.propertyLines.forEach(function (propertyLine) {
                var pl = propertyLine;
                finished = finished && pl.animate();
            });
            if (finished) {
                if (this.repeatCount < 0) {
                    var startTime_1 = Date.now();
                    this.propertyLines.forEach(function (propertyLine) {
                        var pl = propertyLine;
                        pl.startTime = startTime_1;
                    });
                }
                else {
                    this.repeatCount--;
                    if (this.repeatCount > -1) {
                        var startTime_2 = Date.now();
                        this.propertyLines.forEach(function (propertyLine) {
                            var pl = propertyLine;
                            pl.startTime = startTime_2;
                        });
                    }
                    else {
                        _super.prototype.stop.call(this);
                        this.finishedEvent.fireEvent(new TimelineFinishedEventArgs(false));
                    }
                }
            }
        };
        Timeline.prototype.onFinishedEvent = function () {
            return this.finishedEvent;
        };
        return Timeline;
    }(AAnimator));
    cubee.Timeline = Timeline;
    var TimelineFinishedEventArgs = (function () {
        function TimelineFinishedEventArgs(stopped) {
            if (stopped === void 0) { stopped = false; }
            this.stopped = stopped;
        }
        Object.defineProperty(TimelineFinishedEventArgs.prototype, "Stopped", {
            get: function () {
                return this.stopped;
            },
            enumerable: true,
            configurable: true
        });
        return TimelineFinishedEventArgs;
    }());
    cubee.TimelineFinishedEventArgs = TimelineFinishedEventArgs;
    var NumberProperty = (function (_super) {
        __extends(NumberProperty, _super);
        function NumberProperty() {
            return _super.apply(this, arguments) || this;
        }
        NumberProperty.prototype.animate = function (pos, startValue, endValue) {
            return startValue + ((endValue - startValue) * pos);
        };
        return NumberProperty;
    }(Property));
    cubee.NumberProperty = NumberProperty;
    var StringProperty = (function (_super) {
        __extends(StringProperty, _super);
        function StringProperty() {
            return _super.apply(this, arguments) || this;
        }
        return StringProperty;
    }(Property));
    cubee.StringProperty = StringProperty;
    var PaddingProperty = (function (_super) {
        __extends(PaddingProperty, _super);
        function PaddingProperty() {
            return _super.apply(this, arguments) || this;
        }
        return PaddingProperty;
    }(Property));
    cubee.PaddingProperty = PaddingProperty;
    var BorderProperty = (function (_super) {
        __extends(BorderProperty, _super);
        function BorderProperty() {
            return _super.apply(this, arguments) || this;
        }
        return BorderProperty;
    }(Property));
    cubee.BorderProperty = BorderProperty;
    var BackgroundProperty = (function (_super) {
        __extends(BackgroundProperty, _super);
        function BackgroundProperty() {
            return _super.apply(this, arguments) || this;
        }
        return BackgroundProperty;
    }(Property));
    cubee.BackgroundProperty = BackgroundProperty;
    var BooleanProperty = (function (_super) {
        __extends(BooleanProperty, _super);
        function BooleanProperty() {
            return _super.apply(this, arguments) || this;
        }
        return BooleanProperty;
    }(Property));
    cubee.BooleanProperty = BooleanProperty;
    var ColorProperty = (function (_super) {
        __extends(ColorProperty, _super);
        function ColorProperty() {
            return _super.apply(this, arguments) || this;
        }
        return ColorProperty;
    }(Property));
    cubee.ColorProperty = ColorProperty;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var ABackground = (function () {
        function ABackground() {
        }
        return ABackground;
    }());
    cubee.ABackground = ABackground;
    var Color = (function () {
        function Color(argb) {
            this._argb = 0;
            argb = argb | 0;
            this._argb = argb;
        }
        Object.defineProperty(Color, "TRANSPARENT", {
            get: function () {
                return Color._TRANSPARENT;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color, "WHITE", {
            get: function () {
                return Color._WHITE;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color, "BLACK", {
            get: function () {
                return Color._BLACK;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color, "LIGHT_GRAY", {
            get: function () {
                return Color._LIGHT_GRAY;
            },
            enumerable: true,
            configurable: true
        });
        Color.getArgbColor = function (argb) {
            return new Color(argb);
        };
        Color.getArgbColorByComponents = function (alpha, red, green, blue) {
            alpha = this.fixComponent(alpha);
            red = this.fixComponent(red);
            green = this.fixComponent(green);
            blue = this.fixComponent(blue);
            return this.getArgbColor(alpha << 24
                | red << 16
                | green << 8
                | blue);
        };
        Color.getRgbColor = function (rgb) {
            return this.getArgbColor(rgb | 0xff000000);
        };
        Color.getRgbColorByComponents = function (red, green, blue) {
            return this.getArgbColorByComponents(255, red, green, blue);
        };
        Color.fixComponent = function (component) {
            component = component | 0;
            if (component < 0) {
                return 0;
            }
            if (component > 255) {
                return 255;
            }
            return component;
        };
        Color.fadeColors = function (startColor, endColor, fadePosition) {
            return Color.getArgbColorByComponents(this.mixComponent(startColor.alpha, endColor.alpha, fadePosition), this.mixComponent(startColor.red, endColor.red, fadePosition), this.mixComponent(startColor.green, endColor.green, fadePosition), this.mixComponent(startColor.blue, endColor.blue, fadePosition));
        };
        Color.mixComponent = function (startValue, endValue, pos) {
            var res = (startValue + ((endValue - startValue) * pos)) | 0;
            res = this.fixComponent(res);
            return res;
        };
        Object.defineProperty(Color.prototype, "argb", {
            get: function () {
                return this._argb;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "alpha", {
            get: function () {
                return (this._argb >>> 24) & 0xff;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "red", {
            get: function () {
                return (this._argb >>> 16) & 0xff;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "green", {
            get: function () {
                return (this._argb >>> 8) & 0xff;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "blue", {
            get: function () {
                return this._argb & 0xff;
            },
            enumerable: true,
            configurable: true
        });
        Color.prototype.fade = function (fadeColor, fadePosition) {
            return Color.fadeColors(this, fadeColor, fadePosition);
        };
        Color.prototype.toCSS = function () {
            return "rgba(" + this.red + ", " + this.green + ", " + this.blue + ", " + (this.alpha / 255.0) + ")";
        };
        return Color;
    }());
    Color._TRANSPARENT = Color.getArgbColor(0x00000000);
    Color._WHITE = Color.getArgbColor(0xffffffff);
    Color._BLACK = Color.getArgbColor(0xff000000);
    Color._LIGHT_GRAY = Color.getArgbColor(0xffcccccc);
    cubee.Color = Color;
    var ColorBackground = (function (_super) {
        __extends(ColorBackground, _super);
        function ColorBackground(color) {
            var _this = _super.call(this) || this;
            _this._color = null;
            _this._cache = null;
            _this._color = color;
            return _this;
        }
        Object.defineProperty(ColorBackground.prototype, "color", {
            get: function () {
                return this._color;
            },
            enumerable: true,
            configurable: true
        });
        ColorBackground.prototype.apply = function (element) {
            if (this._cache != null) {
                element.style.backgroundColor = this._cache;
            }
            else {
                if (this._color == null) {
                    element.style.removeProperty("backgroundColor");
                }
                else {
                    this._cache = this._color.toCSS();
                    element.style.backgroundColor = this._cache;
                }
            }
        };
        return ColorBackground;
    }(ABackground));
    cubee.ColorBackground = ColorBackground;
    var Padding = (function () {
        function Padding(_left, _top, _right, _bottom) {
            this._left = _left;
            this._top = _top;
            this._right = _right;
            this._bottom = _bottom;
        }
        Padding.create = function (padding) {
            return new Padding(padding, padding, padding, padding);
        };
        Object.defineProperty(Padding.prototype, "left", {
            get: function () {
                return this._left;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Padding.prototype, "top", {
            get: function () {
                return this._top;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Padding.prototype, "right", {
            get: function () {
                return this._right;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Padding.prototype, "bottom", {
            get: function () {
                return this._bottom;
            },
            enumerable: true,
            configurable: true
        });
        Padding.prototype.apply = function (element) {
            element.style.paddingLeft = this._left + "px";
            element.style.paddingTop = this._top + "px";
            element.style.paddingRight = this._right + "px";
            element.style.paddingBottom = this._bottom + "px";
        };
        return Padding;
    }());
    cubee.Padding = Padding;
    var Border = (function () {
        function Border(_leftWidth, _topWidth, _rightWidth, _bottomWidth, _leftColor, _topColor, _rightColor, _bottomColor, _topLeftRadius, _topRightRadius, _bottomLeftRadius, _bottomRightRadius) {
            this._leftWidth = _leftWidth;
            this._topWidth = _topWidth;
            this._rightWidth = _rightWidth;
            this._bottomWidth = _bottomWidth;
            this._leftColor = _leftColor;
            this._topColor = _topColor;
            this._rightColor = _rightColor;
            this._bottomColor = _bottomColor;
            this._topLeftRadius = _topLeftRadius;
            this._topRightRadius = _topRightRadius;
            this._bottomLeftRadius = _bottomLeftRadius;
            this._bottomRightRadius = _bottomRightRadius;
            if (this._leftColor == null) {
                this._leftColor = Color.TRANSPARENT;
            }
            if (this._topColor == null) {
                this._topColor = Color.TRANSPARENT;
            }
            if (this._rightColor == null) {
                this._rightColor = Color.TRANSPARENT;
            }
            if (this._bottomColor == null) {
                this._bottomColor = Color.TRANSPARENT;
            }
        }
        Border.create = function (width, color, radius) {
            return new Border(width, width, width, width, color, color, color, color, radius, radius, radius, radius);
        };
        Object.defineProperty(Border.prototype, "leftWidth", {
            get: function () {
                return this._leftWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Border.prototype, "topWidth", {
            get: function () {
                return this._topWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Border.prototype, "rightWidth", {
            get: function () {
                return this._rightWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Border.prototype, "bottomWidth", {
            get: function () {
                return this._bottomWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Border.prototype, "leftColor", {
            get: function () {
                return this._leftColor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Border.prototype, "topColor", {
            get: function () {
                return this._topColor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Border.prototype, "rightColor", {
            get: function () {
                return this._rightColor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Border.prototype, "bottomColor", {
            get: function () {
                return this._bottomColor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Border.prototype, "topLeftRadius", {
            get: function () {
                return this._topLeftRadius;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Border.prototype, "topRightRadius", {
            get: function () {
                return this._topRightRadius;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Border.prototype, "bottomLeftRadius", {
            get: function () {
                return this._bottomLeftRadius;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Border.prototype, "bottomRightRadius", {
            get: function () {
                return this._bottomRightRadius;
            },
            enumerable: true,
            configurable: true
        });
        Border.prototype.apply = function (element) {
            element.style.borderStyle = "solid";
            element.style.borderLeftColor = this._leftColor.toCSS();
            element.style.borderLeftWidth = this._leftWidth + "px";
            element.style.borderTopColor = this._topColor.toCSS();
            element.style.borderTopWidth = this._topWidth + "px";
            element.style.borderRightColor = this._rightColor.toCSS();
            element.style.borderRightWidth = this._rightWidth + "px";
            element.style.borderBottomColor = this._bottomColor.toCSS();
            element.style.borderBottomWidth = this._bottomWidth + "px";
            element.style.borderTopLeftRadius = this._topLeftRadius + "px";
            element.style.borderTopRightRadius = this._topRightRadius + "px";
            element.style.borderBottomLeftRadius = this._bottomLeftRadius + "px";
            element.style.borderBottomRightRadius = this._bottomRightRadius + "px";
        };
        return Border;
    }());
    cubee.Border = Border;
    var BoxShadow = (function () {
        function BoxShadow(_hPos, _vPos, _blur, _spread, _color, _inner) {
            this._hPos = _hPos;
            this._vPos = _vPos;
            this._blur = _blur;
            this._spread = _spread;
            this._color = _color;
            this._inner = _inner;
        }
        Object.defineProperty(BoxShadow.prototype, "hPos", {
            get: function () {
                return this._hPos;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoxShadow.prototype, "vPos", {
            get: function () {
                return this._vPos;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoxShadow.prototype, "blur", {
            get: function () {
                return this._blur;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoxShadow.prototype, "spread", {
            get: function () {
                return this._spread;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoxShadow.prototype, "color", {
            get: function () {
                return this._color;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoxShadow.prototype, "inner", {
            get: function () {
                return this._inner;
            },
            enumerable: true,
            configurable: true
        });
        BoxShadow.prototype.apply = function (element) {
            element.style.boxShadow = this._hPos + "px " + this._vPos + "px " + this._blur + "px " + this._spread + "px "
                + this._color.toCSS() + (this._inner ? " inset" : "");
        };
        return BoxShadow;
    }());
    cubee.BoxShadow = BoxShadow;
    var ETextOverflow = (function () {
        function ETextOverflow(_css) {
            this._css = _css;
        }
        Object.defineProperty(ETextOverflow, "CLIP", {
            get: function () {
                return ETextOverflow._CLIP;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ETextOverflow, "ELLIPSIS", {
            get: function () {
                return ETextOverflow._ELLIPSIS;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ETextOverflow.prototype, "CSS", {
            get: function () {
                return this._css;
            },
            enumerable: true,
            configurable: true
        });
        ETextOverflow.prototype.apply = function (element) {
            element.style.textOverflow = this._css;
        };
        return ETextOverflow;
    }());
    ETextOverflow._CLIP = new ETextOverflow("clip");
    ETextOverflow._ELLIPSIS = new ETextOverflow("ellipsis");
    cubee.ETextOverflow = ETextOverflow;
    var ETextAlign = (function () {
        function ETextAlign(_css) {
            this._css = _css;
        }
        Object.defineProperty(ETextAlign, "LEFT", {
            get: function () {
                return ETextAlign._LEFT;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ETextAlign, "CENTER", {
            get: function () {
                return ETextAlign._CENTER;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ETextAlign, "RIGHT", {
            get: function () {
                return ETextAlign._RIGHT;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ETextAlign, "JUSTIFY", {
            get: function () {
                return ETextAlign._JUSTIFY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ETextAlign.prototype, "CSS", {
            get: function () {
                return this._css;
            },
            enumerable: true,
            configurable: true
        });
        ETextAlign.prototype.apply = function (element) {
            element.style.textAlign = this._css;
        };
        return ETextAlign;
    }());
    ETextAlign._LEFT = new ETextAlign("left");
    ETextAlign._CENTER = new ETextAlign("center");
    ETextAlign._RIGHT = new ETextAlign("right");
    ETextAlign._JUSTIFY = new ETextAlign("justify");
    cubee.ETextAlign = ETextAlign;
    var EHAlign = (function () {
        function EHAlign(_css) {
            this._css = _css;
        }
        Object.defineProperty(EHAlign, "LEFT", {
            get: function () {
                return EHAlign._LEFT;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EHAlign, "CENTER", {
            get: function () {
                return EHAlign._CENTER;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EHAlign, "RIGHT", {
            get: function () {
                return EHAlign._RIGHT;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EHAlign.prototype, "CSS", {
            get: function () {
                return this._css;
            },
            enumerable: true,
            configurable: true
        });
        return EHAlign;
    }());
    EHAlign._LEFT = new EHAlign("left");
    EHAlign._CENTER = new EHAlign("center");
    EHAlign._RIGHT = new EHAlign("right");
    cubee.EHAlign = EHAlign;
    var EVAlign = (function () {
        function EVAlign(_css) {
            this._css = _css;
        }
        Object.defineProperty(EVAlign, "TOP", {
            get: function () {
                return EVAlign._TOP;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EVAlign, "MIDDLE", {
            get: function () {
                return EVAlign._MIDDLE;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EVAlign, "BOTTOM", {
            get: function () {
                return EVAlign._BOTTOM;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EVAlign.prototype, "CSS", {
            get: function () {
                return this._css;
            },
            enumerable: true,
            configurable: true
        });
        return EVAlign;
    }());
    EVAlign._TOP = new EVAlign("top");
    EVAlign._MIDDLE = new EVAlign("middle");
    EVAlign._BOTTOM = new EVAlign("bottom");
    cubee.EVAlign = EVAlign;
    var FontFamily = (function () {
        function FontFamily(_css) {
            this._css = _css;
            if (!FontFamily.initialized) {
                FontFamily.initFontContainerStyle();
            }
        }
        Object.defineProperty(FontFamily, "Arial", {
            get: function () {
                return FontFamily._arial;
            },
            enumerable: true,
            configurable: true
        });
        FontFamily.initFontContainerStyle = function () {
            var wnd = window;
            wnd.fontsStyle = document.createElement("style");
            wnd.fontsStyle.type = "text/css";
            var doc = document;
            doc.getElementsByTagName("head")[0].appendChild(wnd.fontsStyle);
        };
        FontFamily.registerFont = function (name, src, extra) {
            var ex = extra;
            if (ex == null) {
                ex = '';
            }
            var ct = "@font-face {font-family: '" + name + "'; src: url('" + src + "');" + ex + "}";
            var ih = window.fontsStyle.innerHTML;
            if (ih == null) {
                ih = '';
            }
            window.fontsStyle.innerHTML = ih + ct;
        };
        Object.defineProperty(FontFamily.prototype, "CSS", {
            get: function () {
                return this._css;
            },
            enumerable: true,
            configurable: true
        });
        FontFamily.prototype.apply = function (element) {
            element.style.fontFamily = this._css;
        };
        return FontFamily;
    }());
    FontFamily._arial = new FontFamily("Arial, Helvetica, sans-serif");
    FontFamily.initialized = false;
    cubee.FontFamily = FontFamily;
    var ECursor = (function () {
        function ECursor(_css) {
            this._css = _css;
        }
        Object.defineProperty(ECursor, "AUTO", {
            get: function () {
                return ECursor.auto;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ECursor.prototype, "css", {
            get: function () {
                return this._css;
            },
            enumerable: true,
            configurable: true
        });
        return ECursor;
    }());
    ECursor.auto = new ECursor("auto");
    cubee.ECursor = ECursor;
    var EScrollBarPolicy;
    (function (EScrollBarPolicy) {
        EScrollBarPolicy[EScrollBarPolicy["VISIBLE"] = 0] = "VISIBLE";
        EScrollBarPolicy[EScrollBarPolicy["AUTO"] = 1] = "AUTO";
        EScrollBarPolicy[EScrollBarPolicy["HIDDEN"] = 2] = "HIDDEN";
    })(EScrollBarPolicy = cubee.EScrollBarPolicy || (cubee.EScrollBarPolicy = {}));
    var EPictureSizeMode;
    (function (EPictureSizeMode) {
        EPictureSizeMode[EPictureSizeMode["NORMAL"] = 0] = "NORMAL";
        EPictureSizeMode[EPictureSizeMode["CENTER"] = 1] = "CENTER";
        EPictureSizeMode[EPictureSizeMode["STRETCH"] = 2] = "STRETCH";
        EPictureSizeMode[EPictureSizeMode["FILL"] = 3] = "FILL";
        EPictureSizeMode[EPictureSizeMode["ZOOM"] = 4] = "ZOOM";
        EPictureSizeMode[EPictureSizeMode["FIT_WIDTH"] = 5] = "FIT_WIDTH";
        EPictureSizeMode[EPictureSizeMode["FIT_HEIGHT"] = 6] = "FIT_HEIGHT";
    })(EPictureSizeMode = cubee.EPictureSizeMode || (cubee.EPictureSizeMode = {}));
    var Image = (function () {
        function Image(_url) {
            var _this = this;
            this._url = _url;
            this._onLoad = new cubee.Event();
            this._width = 0;
            this._height = 0;
            this._loaded = false;
            if (_url == null) {
                throw "The url parameter can not be null.";
            }
            var e = document.createElement("img");
            e.addEventListener("load", function () {
                _this._width = e.width;
                _this._height = e.height;
                _this._loaded = true;
                _this._onLoad.fireEvent(new cubee.EventArgs(_this));
            });
            e.src = _url;
        }
        Object.defineProperty(Image.prototype, "url", {
            get: function () {
                return this._url;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Image.prototype, "onLoad", {
            get: function () {
                return this._onLoad;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Image.prototype, "width", {
            get: function () {
                return this._width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Image.prototype, "height", {
            get: function () {
                return this._height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Image.prototype, "loaded", {
            get: function () {
                return this._loaded;
            },
            enumerable: true,
            configurable: true
        });
        Image.prototype.apply = function (element) {
            element.setAttribute("src", this.url);
        };
        return Image;
    }());
    cubee.Image = Image;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    function call(url, method, param, callback) {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    var json = this.responseText;
                    var result = JSON.parse(json);
                    callback(this.status, result);
                }
                else {
                    callback(this.status, null);
                }
            }
        };
        req.open(method, url);
        if (param != null) {
            req.send(JSON.stringify(param));
        }
        else {
            req.send();
        }
    }
    cubee.call = call;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var LayoutChildren = (function () {
        function LayoutChildren(parent) {
            this.parent = parent;
            this.children = [];
            this.parent = parent;
        }
        LayoutChildren.prototype.add = function (component) {
            if (component != null) {
                if (component.parent != null) {
                    throw "The component is already a child of a layout.";
                }
                component._setParent(this.parent);
                component.onParentChanged.fireEvent(new cubee.ParentChangedEventArgs(this.parent, component));
            }
            this.children.push(component);
            this.parent._onChildAdded(component);
        };
        LayoutChildren.prototype.insert = function (index, component) {
            var _this = this;
            if (component != null) {
                if (component.parent != null) {
                    throw "The component is already a child of a layout.";
                }
            }
            var newChildren = [];
            this.children.forEach(function (child) {
                newChildren.push(child);
            });
            newChildren.splice(index, 0, component);
            this.clear();
            newChildren.forEach(function (child) {
                _this.add(child);
            });
        };
        LayoutChildren.prototype.removeComponent = function (component) {
            var idx = this.children.indexOf(component);
            if (idx < 0) {
                throw "The given component isn't a child of this layout.";
            }
            this.removeIndex(idx);
        };
        LayoutChildren.prototype.removeIndex = function (index) {
            var removedComponent = this.children[index];
            if (removedComponent != null) {
                removedComponent._setParent(null);
                removedComponent.onParentChanged.fireEvent(new cubee.ParentChangedEventArgs(null, removedComponent));
            }
            this.parent._onChildRemoved(removedComponent, index);
        };
        LayoutChildren.prototype.clear = function () {
            this.children.forEach(function (child) {
                if (child != null) {
                    child._setParent(null);
                    child.onParentChanged.fireEvent(new cubee.ParentChangedEventArgs(null, child));
                }
            });
            this.children = [];
            this.parent._onChildrenCleared();
        };
        LayoutChildren.prototype.get = function (index) {
            return this.children[index];
        };
        LayoutChildren.prototype.indexOf = function (component) {
            return this.children.indexOf(component);
        };
        LayoutChildren.prototype.size = function () {
            return this.children.length;
        };
        return LayoutChildren;
    }());
    cubee.LayoutChildren = LayoutChildren;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var MouseEventTypes = (function () {
        function MouseEventTypes() {
        }
        return MouseEventTypes;
    }());
    MouseEventTypes.MOUSE_DOWN = 0;
    MouseEventTypes.MOUSE_MOVE = 1;
    MouseEventTypes.MOUSE_UP = 2;
    MouseEventTypes.MOUSE_ENTER = 3;
    MouseEventTypes.MOUSE_LEAVE = 4;
    MouseEventTypes.MOUSE_WHEEL = 5;
    cubee.MouseEventTypes = MouseEventTypes;
    var AComponent = (function () {
        function AComponent(rootElement) {
            var _this = this;
            this._translateX = new cubee.NumberProperty(0, false, false);
            this._translateY = new cubee.NumberProperty(0, false, false);
            this._rotate = new cubee.NumberProperty(0.0, false, false);
            this._scaleX = new cubee.NumberProperty(1.0, false, false);
            this._scaleY = new cubee.NumberProperty(1.0, false, false);
            this._transformCenterX = new cubee.NumberProperty(0.5, false, false);
            this._transformCenterY = new cubee.NumberProperty(0.5, false, false);
            this._padding = new cubee.PaddingProperty(null, true, false);
            this._border = new cubee.BorderProperty(null, true, false);
            this._measuredWidth = new cubee.NumberProperty(0, false, true);
            this._measuredHeight = new cubee.NumberProperty(0, false, true);
            this._clientWidth = new cubee.NumberProperty(0, false, true);
            this._clientHeight = new cubee.NumberProperty(0, false, true);
            this._boundsWidth = new cubee.NumberProperty(0, false, true);
            this._boundsHeight = new cubee.NumberProperty(0, false, true);
            this._boundsLeft = new cubee.NumberProperty(0, false, true);
            this._boundsTop = new cubee.NumberProperty(0, false, true);
            this._measuredWidthSetter = new cubee.NumberProperty(0, false, false);
            this._measuredHeightSetter = new cubee.NumberProperty(0, false, false);
            this._clientWidthSetter = new cubee.NumberProperty(0, false, false);
            this._clientHeightSetter = new cubee.NumberProperty(0, false, false);
            this._boundsWidthSetter = new cubee.NumberProperty(0, false, false);
            this._boundsHeightSetter = new cubee.NumberProperty(0, false, false);
            this._boundsLeftSetter = new cubee.NumberProperty(0, false, false);
            this._boundsTopSetter = new cubee.NumberProperty(0, false, false);
            this._cursor = new cubee.Property(cubee.ECursor.AUTO, false, false);
            this._pointerTransparent = new cubee.Property(false, false, false);
            this._handlePointer = new cubee.Property(true, false, false);
            this._visible = new cubee.Property(true, false, false);
            this._enabled = new cubee.Property(true, false, false);
            this._alpha = new cubee.NumberProperty(1.0, false, false);
            this._selectable = new cubee.Property(false, false, false);
            this._minWidth = new cubee.NumberProperty(null, true, false);
            this._minHeight = new cubee.NumberProperty(null, true, false);
            this._maxWidth = new cubee.NumberProperty(null, true, false);
            this._maxHeight = new cubee.NumberProperty(null, true, false);
            this._hovered = new cubee.Property(false, false, true);
            this._hoveredSetter = new cubee.Property(false, false, false);
            this._pressed = new cubee.Property(false, false, true);
            this._pressedSetter = new cubee.Property(false, false, false);
            this._onClick = new cubee.Event();
            this._onMouseDown = new cubee.Event();
            this._onMouseDrag = new cubee.Event();
            this._onMouseMove = new cubee.Event();
            this._onMouseUp = new cubee.Event();
            this._onMouseEnter = new cubee.Event();
            this._onMouseLeave = new cubee.Event();
            this._onMouseWheel = new cubee.Event();
            this._onKeyDown = new cubee.Event();
            this._onKeyPress = new cubee.Event();
            this._onKeyUp = new cubee.Event();
            this._onParentChanged = new cubee.Event();
            this._onContextMenu = new cubee.Event();
            this._left = 0;
            this._top = 0;
            this._needsLayout = true;
            this._transformChangedListener = function (sender) {
                _this.updateTransform();
                _this.requestLayout();
            };
            this._postConstructRunOnce = new cubee.RunOnce(function () {
                _this.postConstruct();
            });
            this._element = rootElement;
            this._element.setAttribute("data-cubee-component", this.getClassName());
            this._element.style.boxSizing = "border-box";
            this._element.setAttribute("draggable", "false");
            this._element.style.position = "absolute";
            this._element.style.outlineStyle = "none";
            this._element.style.outlineWidth = "0px";
            this._element.style.margin = "0px";
            this._element.style.pointerEvents = "all";
            this._translateX.addChangeListener(this._transformChangedListener);
            this._translateY.addChangeListener(this._transformChangedListener);
            this._rotate.addChangeListener(this._transformChangedListener);
            this._scaleX.addChangeListener(this._transformChangedListener);
            this._scaleY.addChangeListener(this._transformChangedListener);
            this._transformCenterX.addChangeListener(this._transformChangedListener);
            this._transformCenterY.addChangeListener(this._transformChangedListener);
            this._hovered.initReadonlyBind(this._hoveredSetter);
            this._pressed.initReadonlyBind(this._pressedSetter);
            this._padding.addChangeListener(function () {
                var p = _this._padding.value;
                if (p == null) {
                    _this._element.style.padding = "0px";
                }
                else {
                    p.apply(_this._element);
                }
                _this.requestLayout();
            });
            this._padding.invalidate();
            this._border.addChangeListener(function () {
                var b = _this._border.value;
                if (b == null) {
                    _this._element.style.removeProperty("borderStyle");
                    _this._element.style.removeProperty("borderColor");
                    _this._element.style.removeProperty("borderWidth");
                    _this._element.style.removeProperty("borderRadius");
                }
                else {
                    b.apply(_this._element);
                }
                _this.requestLayout();
            });
            this._cursor.addChangeListener(function () {
                _this._element.style.cursor = _this.cursor.css;
            });
            this._visible.addChangeListener(function () {
                if (_this._visible.value) {
                    _this._element.style.visibility = "visible";
                }
                else {
                    _this._element.style.visibility = "hidden";
                }
            });
            this._enabled.addChangeListener(function () {
                if (_this._enabled.value) {
                    _this._element.removeAttribute("disabled");
                }
                else {
                    _this._element.setAttribute("disabled", "true");
                }
            });
            this._alpha.addChangeListener(function () {
                _this._element.style.opacity = "" + _this._alpha.value;
            });
            this._selectable.addChangeListener(function () {
                if (_this._selectable.value) {
                    _this._element.style.removeProperty("mozUserSelect");
                    _this._element.style.removeProperty("khtmlUserSelect");
                    _this._element.style.removeProperty("webkitUserSelect");
                    _this._element.style.removeProperty("msUserSelect");
                    _this._element.style.removeProperty("userSelect");
                }
                else {
                    _this._element.style.setProperty("mozUserSelect", "none");
                    _this._element.style.setProperty("khtmlUserSelect", "none");
                    _this._element.style.setProperty("webkitUserSelect", "none");
                    _this._element.style.setProperty("msUserSelect", "none");
                    _this._element.style.setProperty("userSelect", "none");
                }
            });
            this._selectable.invalidate();
            this._minWidth.addChangeListener(function () {
                if (_this._minWidth.value == null) {
                    _this._element.style.removeProperty("minWidth");
                }
                else {
                    _this._element.style.setProperty("minWidth", _this._minWidth.value + "px");
                }
                _this.requestLayout();
            });
            this._minHeight.addChangeListener(function () {
                if (_this._minHeight.value == null) {
                    _this._element.style.removeProperty("minHeight");
                }
                else {
                    _this._element.style.setProperty("minHeight", _this._minHeight.value + "px");
                }
                _this.requestLayout();
            });
            this._maxWidth.addChangeListener(function () {
                if (_this._maxWidth.value == null) {
                    _this._element.style.removeProperty("maxWidth");
                }
                else {
                    _this._element.style.setProperty("maxWidth", _this._maxWidth.value + "px");
                }
                _this.requestLayout();
            });
            this._maxHeight.addChangeListener(function () {
                if (_this._maxHeight.value == null) {
                    _this._element.style.removeProperty("maxHeight");
                }
                else {
                    _this._element.style.setProperty("maxHeight", _this._maxHeight.value + "px");
                }
                _this.requestLayout();
            });
            this._handlePointer.addChangeListener(function () {
                if (!_this._handlePointer.value || _this._pointerTransparent.value) {
                    _this._element.style.setProperty("pointerEvents", "none");
                }
                else {
                    _this._element.style.removeProperty("pointerEvents");
                }
            });
            this._pointerTransparent.addChangeListener(function () {
                if (!_this._handlePointer.value || _this._pointerTransparent.value) {
                    _this._element.style.setProperty("pointerEvents", "none");
                }
                else {
                    _this._element.style.removeProperty("pointerEvents");
                }
            });
            this._measuredWidth.initReadonlyBind(this._measuredWidthSetter);
            this._measuredHeight.initReadonlyBind(this._measuredHeightSetter);
            this._clientWidth.initReadonlyBind(this._clientWidthSetter);
            this._clientHeight.initReadonlyBind(this._clientHeightSetter);
            this._boundsWidth.initReadonlyBind(this._boundsWidthSetter);
            this._boundsHeight.initReadonlyBind(this._boundsHeightSetter);
            this._boundsLeft.initReadonlyBind(this._boundsLeftSetter);
            this._boundsTop.initReadonlyBind(this._boundsTopSetter);
            this._onClick = new cubee.Event(new cubee.HtmlEventListenerCallback(this._element, "click"));
            this._onMouseDown = new cubee.Event(new cubee.HtmlEventListenerCallback(this._element, "mousedown"));
            this._onMouseMove = new cubee.Event(new cubee.HtmlEventListenerCallback(this._element, "mousemove"));
            this._onMouseUp = new cubee.Event(new cubee.HtmlEventListenerCallback(this._element, "mouseup"));
            this._onMouseEnter = new cubee.Event(new cubee.HtmlEventListenerCallback(this._element, "mouseenter"));
            this._onMouseLeave = new cubee.Event(new cubee.HtmlEventListenerCallback(this._element, "mouseleave"));
            this._onMouseWheel = new cubee.Event(new cubee.HtmlEventListenerCallback(this._element, "mousewheel"));
            this._onKeyDown = new cubee.Event(new cubee.HtmlEventListenerCallback(this._element, "keydown"));
            this._onKeyPress = new cubee.Event(new cubee.HtmlEventListenerCallback(this._element, "keypress"));
            this._onKeyUp = new cubee.Event(new cubee.HtmlEventListenerCallback(this._element, "keyup"));
            this._onContextMenu = new cubee.Event(new cubee.HtmlEventListenerCallback(this._element, "contextmenu"));
            this._onMouseEnter.addListener(function () {
                _this._hoveredSetter.value = true;
            });
            this._onMouseLeave.addListener(function () {
                _this._hoveredSetter.value = false;
            });
            this._onMouseDown.addListener(function () {
                _this._pressedSetter.value = true;
            });
            this._onMouseUp.addListener(function () {
                _this._pressedSetter.value = false;
            });
        }
        AComponent.prototype.getClassName = function () {
            var funcNameRegex = /function (.{1,})\(/;
            var results = (funcNameRegex).exec(this["constructor"].toString());
            return (results && results.length > 1) ? results[1] : "";
        };
        AComponent.prototype.invokePostConstruct = function () {
            this._postConstructRunOnce.run();
        };
        AComponent.prototype.postConstruct = function () {
        };
        AComponent.prototype.setCubeePanel = function (cubeePanel) {
            this._cubeePanel = cubeePanel;
        };
        AComponent.prototype.getCubeePanel = function () {
            if (this._cubeePanel != null) {
                return this._cubeePanel;
            }
            else if (this.parent != null) {
                return this.parent.getCubeePanel();
            }
            else {
                return null;
            }
        };
        AComponent.prototype.updateTransform = function () {
            var angle = this._rotate.value;
            angle = angle - (angle | 0);
            angle = angle * 360;
            var angleStr = angle + "deg";
            var centerX = (this._transformCenterX.value * 100) + "%";
            var centerY = (this._transformCenterY.value * 100) + "%";
            var sX = this._scaleX.value.toString();
            var sY = this._scaleY.value.toString();
            this._element.style.transformOrigin = centerX + " " + centerY;
            this._element.style.transform = "translate(" + this._translateX.value + "px, " + this._translateY.value
                + "px) rotate(" + angleStr + ") scaleX( " + sX + ") scaleY(" + sY + ")";
            this._element.style.backfaceVisibility = "hidden";
        };
        AComponent.prototype.requestLayout = function () {
            if (!this._needsLayout) {
                this._needsLayout = true;
                if (this._parent != null) {
                    this._parent.requestLayout();
                }
                else if (this._cubeePanel != null) {
                    this._cubeePanel.requestLayout();
                }
                else {
                    cubee.Popups._requestLayout();
                }
            }
        };
        AComponent.prototype.measure = function () {
            this.onMeasure();
        };
        AComponent.prototype.onMeasure = function () {
            var cw = this._element.clientWidth;
            var ch = this._element.clientHeight;
            var p = this._padding.value;
            if (p != null) {
                cw = cw - p.left - p.right;
                ch = ch - p.top - p.bottom;
            }
            this._clientWidthSetter.value = cw;
            this._clientHeightSetter.value = ch;
            var mw = this._element.offsetWidth;
            var mh = this._element.offsetHeight;
            this._measuredWidthSetter.value = mw;
            this._measuredHeightSetter.value = mh;
            var tcx = this._transformCenterX.value;
            var tcy = this._transformCenterY.value;
            var bx = 0;
            var by = 0;
            var bw = mw;
            var bh = mh;
            var tl = new cubee.Point2D(0, 0);
            var tr = new cubee.Point2D(mw, 0);
            var br = new cubee.Point2D(mw, mh);
            var bl = new cubee.Point2D(0, mh);
            var cx = (mw * tcx) | 0;
            var cy = (mh * tcy) | 0;
            var rot = this._rotate.value;
            if (rot != 0.0) {
                tl = this.rotatePoint(cx, cy, 0, 0, rot);
                tr = this.rotatePoint(cx, cy, bw, 0, rot);
                br = this.rotatePoint(cx, cy, bw, bh, rot);
                bl = this.rotatePoint(cx, cy, 0, bh, rot);
            }
            var sx = this._scaleX.value;
            var sy = this._scaleY.value;
            if (sx != 1.0 || sy != 1.0) {
                tl = this.scalePoint(cx, cy, tl.x, tl.y, sx, sy);
                tr = this.scalePoint(cx, cy, tr.x, tr.y, sx, sy);
                br = this.scalePoint(cx, cy, br.x, br.y, sx, sy);
                bl = this.scalePoint(cx, cy, bl.x, bl.y, sx, sy);
            }
            var minX = Math.min(Math.min(tl.x, tr.x), Math.min(br.x, bl.x));
            var minY = Math.min(Math.min(tl.y, tr.y), Math.min(br.y, bl.y));
            var maxX = Math.max(Math.max(tl.x, tr.x), Math.max(br.x, bl.x));
            var maxY = Math.max(Math.max(tl.y, tr.y), Math.max(br.y, bl.y));
            bw = maxX - minX;
            bh = maxY - minY;
            bx = minX;
            by = minY;
            this._boundsLeftSetter.value = bx;
            this._boundsTopSetter.value = by;
            this._boundsWidthSetter.value = bw;
            this._boundsHeightSetter.value = bh;
        };
        AComponent.prototype.scalePoint = function (centerX, centerY, pointX, pointY, scaleX, scaleY) {
            var resX = (centerX + ((pointX - centerX) * scaleX)) | 0;
            var resY = (centerY + ((pointY - centerY) * scaleY)) | 0;
            return new cubee.Point2D(resX, resY);
        };
        AComponent.prototype.rotatePoint = function (cx, cy, x, y, angle) {
            angle = (angle * 360) * (Math.PI / 180);
            x = x - cx;
            y = y - cy;
            var sin = Math.sin(angle);
            var cos = Math.cos(angle);
            var rx = ((cos * x) - (sin * y)) | 0;
            var ry = ((sin * x) + (cos * y)) | 0;
            rx = rx + cx;
            ry = ry + cy;
            return new cubee.Point2D(rx, ry);
        };
        Object.defineProperty(AComponent.prototype, "element", {
            get: function () {
                return this._element;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            enumerable: true,
            configurable: true
        });
        AComponent.prototype._setParent = function (parent) {
            this._parent = parent;
        };
        AComponent.prototype.layout = function () {
            this._needsLayout = false;
            this.measure();
        };
        Object.defineProperty(AComponent.prototype, "needsLayout", {
            get: function () {
                return this._needsLayout;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "TranslateX", {
            get: function () {
                return this._translateX;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "translateX", {
            get: function () {
                return this.TranslateX.value;
            },
            set: function (value) {
                this.TranslateX.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "TranslateY", {
            get: function () {
                return this._translateY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "translateY", {
            get: function () {
                return this.TranslateY.value;
            },
            set: function (value) {
                this.TranslateY.value = value;
            },
            enumerable: true,
            configurable: true
        });
        AComponent.prototype.paddingProperty = function () {
            return this._padding;
        };
        Object.defineProperty(AComponent.prototype, "Padding", {
            get: function () {
                return this.paddingProperty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "padding", {
            get: function () {
                return this.Padding.value;
            },
            set: function (value) {
                this.Padding.value = value;
            },
            enumerable: true,
            configurable: true
        });
        AComponent.prototype.borderProperty = function () {
            return this._border;
        };
        Object.defineProperty(AComponent.prototype, "Border", {
            get: function () {
                return this.borderProperty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "border", {
            get: function () {
                return this.Border.value;
            },
            set: function (value) {
                this.Border.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "MeasuredWidth", {
            get: function () {
                return this._measuredWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "measuredWidth", {
            get: function () {
                return this.MeasuredWidth.value;
            },
            set: function (value) {
                this.MeasuredWidth.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "MeasuredHeight", {
            get: function () {
                return this._measuredHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "measuredHeight", {
            get: function () {
                return this.MeasuredHeight.value;
            },
            set: function (value) {
                this.MeasuredHeight.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "ClientWidth", {
            get: function () {
                return this._clientWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "clientWidth", {
            get: function () {
                return this.ClientWidth.value;
            },
            set: function (value) {
                this.ClientWidth.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "ClientHeight", {
            get: function () {
                return this._clientHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "clientHeight", {
            get: function () {
                return this.ClientHeight.value;
            },
            set: function (value) {
                this.ClientHeight.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "BoundsWidth", {
            get: function () {
                return this._boundsWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "boundsWidth", {
            get: function () {
                return this.BoundsWidth.value;
            },
            set: function (value) {
                this.BoundsWidth.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "BoundsHeight", {
            get: function () {
                return this._boundsHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "boundsHeight", {
            get: function () {
                return this.BoundsHeight.value;
            },
            set: function (value) {
                this.BoundsHeight.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "BoundsLeft", {
            get: function () {
                return this._boundsLeft;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "boundsLeft", {
            get: function () {
                return this.BoundsLeft.value;
            },
            set: function (value) {
                this.BoundsLeft.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "BoundsTop", {
            get: function () {
                return this._boundsTop;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "boundsTop", {
            get: function () {
                return this.BoundsTop.value;
            },
            set: function (value) {
                this.BoundsTop.value = value;
            },
            enumerable: true,
            configurable: true
        });
        AComponent.prototype.minWidthProperty = function () {
            return this._minWidth;
        };
        Object.defineProperty(AComponent.prototype, "MinWidth", {
            get: function () {
                return this.minWidthProperty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "minWidth", {
            get: function () {
                return this.MinWidth.value;
            },
            set: function (value) {
                this.MinWidth.value = value;
            },
            enumerable: true,
            configurable: true
        });
        AComponent.prototype.minHeightProperty = function () {
            return this._minHeight;
        };
        Object.defineProperty(AComponent.prototype, "MinHeight", {
            get: function () {
                return this.minHeightProperty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "minHeight", {
            get: function () {
                return this.MinHeight.value;
            },
            set: function (value) {
                this.MinHeight.value = value;
            },
            enumerable: true,
            configurable: true
        });
        AComponent.prototype.maxWidthProperty = function () {
            return this._maxWidth;
        };
        Object.defineProperty(AComponent.prototype, "MaxWidth", {
            get: function () {
                return this.maxWidthProperty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "maxWidth", {
            get: function () {
                return this.MaxWidth.value;
            },
            set: function (value) {
                this.MaxWidth.value = value;
            },
            enumerable: true,
            configurable: true
        });
        AComponent.prototype.maxHeightProperty = function () {
            return this._maxHeight;
        };
        Object.defineProperty(AComponent.prototype, "MaxHeight", {
            get: function () {
                return this.maxHeightProperty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "maxHeight", {
            get: function () {
                return this.MaxHeight.value;
            },
            set: function (value) {
                this.MaxHeight.value = value;
            },
            enumerable: true,
            configurable: true
        });
        AComponent.prototype.setPosition = function (left, top) {
            this._element.style.left = "" + left + "px";
            this._element.style.top = "" + top + "px";
            this._left = left;
            this._top = top;
        };
        AComponent.prototype._setLeft = function (left) {
            this._element.style.left = "" + left + "px";
            this._left = left;
        };
        AComponent.prototype._setTop = function (top) {
            this._element.style.top = "" + top + "px";
            this._top = top;
        };
        AComponent.prototype.setSize = function (width, height) {
            this._element.style.width = "" + width + "px";
            this._element.style.height = "" + height + "px";
        };
        Object.defineProperty(AComponent.prototype, "Cursor", {
            get: function () {
                return this._cursor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "cursor", {
            get: function () {
                return this.Cursor.value;
            },
            set: function (value) {
                this.Cursor.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "PointerTransparent", {
            get: function () {
                return this._pointerTransparent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "pointerTransparent", {
            get: function () {
                return this.PointerTransparent.value;
            },
            set: function (value) {
                this.PointerTransparent.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "Visible", {
            get: function () {
                return this._visible;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "visible", {
            get: function () {
                return this.Visible.value;
            },
            set: function (value) {
                this.Visible.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "onClick", {
            get: function () {
                return this._onClick;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "onContextMenu", {
            get: function () {
                return this._onContextMenu;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "onMouseDown", {
            get: function () {
                return this._onMouseDown;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "onMouseMove", {
            get: function () {
                return this._onMouseMove;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "onMouseUp", {
            get: function () {
                return this._onMouseUp;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "onMouseEnter", {
            get: function () {
                return this._onMouseEnter;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "onMouseLeave", {
            get: function () {
                return this._onMouseLeave;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "onMouseWheel", {
            get: function () {
                return this._onMouseWheel;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "onKeyDown", {
            get: function () {
                return this._onKeyDown;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "onKeyPress", {
            get: function () {
                return this._onKeyPress;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "onKeyUp", {
            get: function () {
                return this._onKeyUp;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "onParentChanged", {
            get: function () {
                return this._onParentChanged;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "Alpha", {
            get: function () {
                return this._alpha;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "alpha", {
            get: function () {
                return this.Alpha.value;
            },
            set: function (value) {
                this.Alpha.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "HandlePointer", {
            get: function () {
                return this._handlePointer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "handlePointer", {
            get: function () {
                return this.HandlePointer.value;
            },
            set: function (value) {
                this.HandlePointer.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "Enabled", {
            get: function () {
                return this._enabled;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "enabled", {
            get: function () {
                return this.Enabled.value;
            },
            set: function (value) {
                this.Enabled.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "Selectable", {
            get: function () {
                return this._selectable;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "selectable", {
            get: function () {
                return this.Selectable.value;
            },
            set: function (value) {
                this.Selectable.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "left", {
            get: function () {
                return this._left;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "top", {
            get: function () {
                return this._top;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "Rotate", {
            get: function () {
                return this._rotate;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "rotate", {
            get: function () {
                return this.Rotate.value;
            },
            set: function (value) {
                this.Rotate.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "ScaleX", {
            get: function () {
                return this._scaleX;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "scaleX", {
            get: function () {
                return this.ScaleX.value;
            },
            set: function (value) {
                this.ScaleX.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "ScaleY", {
            get: function () {
                return this._scaleY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "scaleY", {
            get: function () {
                return this.ScaleY.value;
            },
            set: function (value) {
                this.ScaleY.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "TransformCenterX", {
            get: function () {
                return this._transformCenterX;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "transformCenterX", {
            get: function () {
                return this.TransformCenterX.value;
            },
            set: function (value) {
                this.TransformCenterX.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "TransformCenterY", {
            get: function () {
                return this._transformCenterY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "transformCenterY", {
            get: function () {
                return this.TransformCenterY.value;
            },
            set: function (value) {
                this.TransformCenterY.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "Hovered", {
            get: function () {
                return this._hovered;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "hovered", {
            get: function () {
                return this.Hovered.value;
            },
            set: function (value) {
                this.Hovered.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "Pressed", {
            get: function () {
                return this._pressed;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "pressed", {
            get: function () {
                return this.Pressed.value;
            },
            set: function (value) {
                this.Pressed.value = value;
            },
            enumerable: true,
            configurable: true
        });
        return AComponent;
    }());
    cubee.AComponent = AComponent;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var ALayout = (function (_super) {
        __extends(ALayout, _super);
        function ALayout(element) {
            var _this = _super.call(this, element) || this;
            _this._children = new cubee.LayoutChildren(_this);
            return _this;
        }
        Object.defineProperty(ALayout.prototype, "children_inner", {
            get: function () {
                return this._children;
            },
            enumerable: true,
            configurable: true
        });
        ALayout.prototype.layout = function () {
            this._needsLayout = false;
            for (var i = 0; i < this.children_inner.size(); i++) {
                var child = this.children_inner.get(i);
                if (child != null) {
                    if (child.needsLayout) {
                        child.layout();
                    }
                }
            }
            this.onLayout();
            this.measure();
        };
        ALayout.prototype.getComponentsAtPosition = function (x, y) {
            var res = [];
            this.getComponentsAtPosition_impl(this, x, y, res);
            return res;
        };
        ALayout.prototype.getComponentsAtPosition_impl = function (root, x, y, result) {
            if (x >= 0 && x <= root.boundsWidth && y >= 0 && y <= root.boundsHeight) {
                result.splice(0, 0, root);
                for (var i = 0; i < root.children_inner.size(); i++) {
                    var component = root.children_inner.get(i);
                    if (component == null) {
                        continue;
                    }
                    var tx = x - component.left - component.translateX;
                    var ty = y - component.top - component.translateY;
                    if (component instanceof ALayout) {
                        this.getComponentsAtPosition_impl(component, tx, ty, result);
                    }
                    else {
                        if (tx >= 0 && tx <= component.boundsWidth && y >= 0 && y <= component.boundsHeight) {
                            result.splice(0, 0, component);
                        }
                    }
                }
            }
        };
        ALayout.prototype.setChildLeft = function (child, left) {
            child._setLeft(left);
        };
        ALayout.prototype.setChildTop = function (child, top) {
            child._setTop(top);
        };
        return ALayout;
    }(cubee.AComponent));
    cubee.ALayout = ALayout;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var AUserControl = (function (_super) {
        __extends(AUserControl, _super);
        function AUserControl() {
            var _this = _super.call(this, document.createElement("div")) || this;
            _this._width = new cubee.NumberProperty(null, true, false);
            _this._height = new cubee.NumberProperty(null, true, false);
            _this._background = new cubee.BackgroundProperty(new cubee.ColorBackground(cubee.Color.TRANSPARENT), true, false);
            _this._shadow = new cubee.Property(null, true, false);
            _this._draggable = new cubee.BooleanProperty(false);
            _this.element.style.overflowX = "hidden";
            _this.element.style.overflowY = "hidden";
            _this._width.addChangeListener(function () {
                if (_this._width.value == null) {
                    _this.element.style.removeProperty("width");
                }
                else {
                    _this.element.style.width = "" + _this._width.value + "px";
                }
                _this.requestLayout();
            });
            _this._width.invalidate();
            _this._height.addChangeListener(function () {
                if (_this._height.value == null) {
                    _this.element.style.removeProperty("height");
                }
                else {
                    _this.element.style.height = "" + _this._height.value + "px";
                }
                _this.requestLayout();
            });
            _this._height.invalidate();
            _this._background.addChangeListener(function () {
                _this.element.style.removeProperty("backgroundColor");
                _this.element.style.removeProperty("backgroundImage");
                _this.element.style.removeProperty("background");
                if (_this._background.value != null) {
                    _this._background.value.apply(_this.element);
                }
            });
            _this._background.invalidate();
            _this._shadow.addChangeListener(function () {
                if (_this._shadow.value == null) {
                    _this.element.style.removeProperty("boxShadow");
                }
                else {
                    _this._shadow.value.apply(_this.element);
                }
            });
            _this._draggable.addChangeListener(function () {
                if (_this._draggable.value) {
                    _this.element.setAttribute("draggable", "true");
                }
                else {
                    _this.element.setAttribute("draggable", "false");
                }
            });
            _this._draggable.invalidate();
            return _this;
        }
        AUserControl.prototype.widthProperty = function () {
            return this._width;
        };
        Object.defineProperty(AUserControl.prototype, "Width", {
            get: function () {
                return this.widthProperty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AUserControl.prototype, "width", {
            get: function () {
                return this.Width.value;
            },
            set: function (value) {
                this.Width.value = value;
            },
            enumerable: true,
            configurable: true
        });
        AUserControl.prototype.heightProperty = function () {
            return this._height;
        };
        Object.defineProperty(AUserControl.prototype, "Height", {
            get: function () {
                return this.heightProperty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AUserControl.prototype, "height", {
            get: function () {
                return this.Height.value;
            },
            set: function (value) {
                this.Height.value = value;
            },
            enumerable: true,
            configurable: true
        });
        AUserControl.prototype.backgroundProperty = function () {
            return this._background;
        };
        Object.defineProperty(AUserControl.prototype, "Background", {
            get: function () {
                return this.backgroundProperty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AUserControl.prototype, "background", {
            get: function () {
                return this.Background.value;
            },
            set: function (value) {
                this.Background.value = value;
            },
            enumerable: true,
            configurable: true
        });
        AUserControl.prototype.shadowProperty = function () {
            return this._shadow;
        };
        Object.defineProperty(AUserControl.prototype, "Shadow", {
            get: function () {
                return this.shadowProperty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AUserControl.prototype, "shadow", {
            get: function () {
                return this.Shadow.value;
            },
            set: function (value) {
                this.Shadow.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AUserControl.prototype, "Draggable", {
            get: function () {
                return this._draggable;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AUserControl.prototype, "draggable", {
            get: function () {
                return this.Draggable.value;
            },
            set: function (value) {
                this.Draggable.value = value;
            },
            enumerable: true,
            configurable: true
        });
        AUserControl.prototype._onChildAdded = function (child) {
            if (child != null) {
                this.element.appendChild(child.element);
            }
            this.requestLayout();
        };
        AUserControl.prototype._onChildRemoved = function (child, index) {
            if (child != null) {
                this.element.removeChild(child.element);
            }
            this.requestLayout();
        };
        AUserControl.prototype._onChildrenCleared = function () {
            var root = this.element;
            var e = this.element.firstElementChild;
            while (e != null) {
                root.removeChild(e);
                e = root.firstElementChild;
            }
            this.requestLayout();
        };
        AUserControl.prototype.onLayout = function () {
            if (this.width != null && this.height != null) {
                this.setSize(this.width, this.height);
            }
            else {
                var maxW = 0;
                var maxH = 0;
                for (var i = 0; i < this.children_inner.size(); i++) {
                    var component = this.children_inner.get(i);
                    var cW = component.boundsWidth + component.boundsLeft + component.translateX;
                    var cH = component.boundsHeight + component.boundsTop + component.translateY;
                    if (cW > maxW) {
                        maxW = cW;
                    }
                    if (cH > maxH) {
                        maxH = cH;
                    }
                }
                if (this.width != null) {
                    maxW = this.height;
                }
                if (this.height != null) {
                    maxH = this.height;
                }
                this.setSize(maxW, maxH);
            }
        };
        return AUserControl;
    }(cubee.ALayout));
    cubee.AUserControl = AUserControl;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var AView = (function (_super) {
        __extends(AView, _super);
        function AView(_model) {
            var _this = _super.call(this) || this;
            _this._model = _model;
            return _this;
        }
        Object.defineProperty(AView.prototype, "model", {
            get: function () {
                return this._model;
            },
            enumerable: true,
            configurable: true
        });
        return AView;
    }(cubee.AUserControl));
    cubee.AView = AView;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var Panel = (function (_super) {
        __extends(Panel, _super);
        function Panel() {
            return _super.apply(this, arguments) || this;
        }
        Panel.prototype.widthProperty = function () {
            return _super.prototype.widthProperty.call(this);
        };
        Object.defineProperty(Panel.prototype, "Width", {
            get: function () {
                return this.widthProperty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Panel.prototype, "width", {
            get: function () {
                return this.Width.value;
            },
            set: function (value) {
                this.Width.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Panel.prototype.heightProperty = function () {
            return _super.prototype.heightProperty.call(this);
        };
        Object.defineProperty(Panel.prototype, "Height", {
            get: function () {
                return this.heightProperty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Panel.prototype, "height", {
            get: function () {
                return this.Height.value;
            },
            set: function (value) {
                this.Height.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Panel.prototype.backgroundProperty = function () {
            return _super.prototype.backgroundProperty.call(this);
        };
        Object.defineProperty(Panel.prototype, "Background", {
            get: function () {
                return this.backgroundProperty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Panel.prototype, "background", {
            get: function () {
                return this.Background.value;
            },
            set: function (value) {
                this.Background.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Panel.prototype.shadowProperty = function () {
            return _super.prototype.shadowProperty.call(this);
        };
        Object.defineProperty(Panel.prototype, "Shadow", {
            get: function () {
                return this.shadowProperty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Panel.prototype, "shadow", {
            get: function () {
                return this.Shadow.value;
            },
            set: function (value) {
                this.Shadow.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Panel.prototype, "children", {
            get: function () {
                return this.children_inner;
            },
            enumerable: true,
            configurable: true
        });
        return Panel;
    }(cubee.AUserControl));
    cubee.Panel = Panel;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var HBox = (function (_super) {
        __extends(HBox, _super);
        function HBox() {
            var _this = _super.call(this, document.createElement("div")) || this;
            _this._height = new cubee.NumberProperty(null, true, false);
            _this._cellWidths = [];
            _this._hAligns = [];
            _this._vAligns = [];
            _this.element.style.overflow = "hidden";
            _this.pointerTransparent = true;
            _this._height.addChangeListener(function () {
                _this.requestLayout();
            });
            return _this;
        }
        HBox.prototype.setCellWidth = function (indexOrComponent, cellHeight) {
            if (indexOrComponent instanceof cubee.AComponent) {
                this.setCellWidth(this.children_inner.indexOf(indexOrComponent), cellHeight);
            }
            this.setInList(this._cellWidths, indexOrComponent, cellHeight);
            this.requestLayout();
        };
        HBox.prototype.getCellWidth = function (indexOrComponent) {
            if (indexOrComponent instanceof cubee.AComponent) {
                return this.getCellWidth(this.children_inner.indexOf(indexOrComponent));
            }
            return this.getFromList(this._cellWidths, indexOrComponent);
        };
        HBox.prototype.setCellHAlign = function (indexOrComponent, hAlign) {
            if (indexOrComponent instanceof cubee.AComponent) {
                this.setCellHAlign(this.children_inner.indexOf(indexOrComponent), hAlign);
            }
            this.setInList(this._hAligns, indexOrComponent, hAlign);
            this.requestLayout();
        };
        HBox.prototype.getCellHAlign = function (indexOrComponent) {
            if (indexOrComponent instanceof cubee.AComponent) {
                return this.getCellHAlign(this.children_inner.indexOf(indexOrComponent));
            }
            return this.getFromList(this._hAligns, indexOrComponent);
        };
        HBox.prototype.setCellVAlign = function (indexOrComponent, vAlign) {
            if (indexOrComponent instanceof cubee.AComponent) {
                this.setCellVAlign(this.children_inner.indexOf(indexOrComponent), vAlign);
            }
            this.setInList(this._vAligns, indexOrComponent, vAlign);
            this.requestLayout();
        };
        HBox.prototype.getCellVAlign = function (indexOrComponent) {
            if (indexOrComponent instanceof cubee.AComponent) {
                return this.getCellVAlign(this.children_inner.indexOf(indexOrComponent));
            }
            return this.getFromList(this._vAligns, indexOrComponent);
        };
        HBox.prototype.setLastCellHAlign = function (hAlign) {
            this.setCellHAlign(this.children_inner.size() - 1, hAlign);
        };
        HBox.prototype.setLastCellVAlign = function (vAlign) {
            this.setCellVAlign(this.children_inner.size() - 1, vAlign);
        };
        HBox.prototype.setLastCellWidth = function (width) {
            this.setCellWidth(this.children_inner.size() - 1, width);
        };
        HBox.prototype.addEmptyCell = function (width) {
            this.children_inner.add(null);
            this.setCellWidth(this.children_inner.size() - 1, width);
        };
        HBox.prototype._onChildAdded = function (child) {
            if (child != null) {
                this.element.appendChild(child.element);
            }
            this.requestLayout();
        };
        HBox.prototype._onChildRemoved = function (child, index) {
            if (child != null) {
                this.element.removeChild(child.element);
            }
            this.removeFromList(this._hAligns, index);
            this.removeFromList(this._vAligns, index);
            this.removeFromList(this._cellWidths, index);
            this.requestLayout();
        };
        HBox.prototype._onChildrenCleared = function () {
            var root = this.element;
            var e = this.element.firstElementChild;
            while (e != null) {
                root.removeChild(e);
                e = root.firstElementChild;
            }
            this._hAligns = [];
            this._vAligns = [];
            this._cellWidths = [];
            this.requestLayout();
        };
        HBox.prototype.onLayout = function () {
            var maxHeight = -1;
            if (this.height != null) {
                maxHeight = this.height;
            }
            var actW = 0;
            var maxH = 0;
            for (var i = 0; i < this.children.size(); i++) {
                var childX = 0;
                var child = this.children.get(i);
                var cellW = this.getCellWidth(i);
                var hAlign = this.getCellHAlign(i);
                var realCellW = -1;
                if (cellW != null) {
                    realCellW = cellW;
                }
                if (child == null) {
                    if (realCellW > 0) {
                        actW += realCellW;
                    }
                }
                else {
                    var cw = child.boundsWidth;
                    var ch = child.boundsHeight;
                    var cl = child.translateX;
                    var ct = child.translateY;
                    var calculatedCellW = realCellW;
                    if (calculatedCellW < 0) {
                        calculatedCellW = cw + cl;
                    }
                    else if (calculatedCellW < cw) {
                        calculatedCellW = cw;
                    }
                    childX = actW - child.translateX;
                    if (hAlign == cubee.EHAlign.CENTER) {
                        childX += (calculatedCellW - cw) / 2;
                    }
                    else if (hAlign == cubee.EHAlign.RIGHT) {
                        childX += (calculatedCellW - cw);
                    }
                    child._setLeft(childX);
                    if (ch + ct > maxH) {
                        maxH = ch + ct;
                    }
                    actW += calculatedCellW;
                }
            }
            var realHeight = maxH;
            if (maxHeight > -1) {
                realHeight = maxHeight;
            }
            for (var i = 0; i < this.children.size(); i++) {
                var childY = 0;
                var child = this.children.get(i);
                if (child == null) {
                    continue;
                }
                var vAlign = this.getCellVAlign(i);
                var ch = child.boundsHeight;
                if (vAlign == cubee.EVAlign.MIDDLE) {
                    childY += (realHeight - ch) / 2;
                }
                else if (vAlign == cubee.EVAlign.BOTTOM) {
                    childY += (realHeight - ch);
                }
                child._setTop(childY);
            }
            this.setSize(actW, realHeight);
        };
        HBox.prototype.setInList = function (list, index, value) {
            while (list.length < index) {
                list.push(null);
            }
            list[index] = value;
        };
        HBox.prototype.getFromList = function (list, index) {
            if (list.length > index) {
                return list[index];
            }
            return null;
        };
        HBox.prototype.removeFromList = function (list, index) {
            if (list.length > index) {
                list.splice(index, 1);
            }
        };
        Object.defineProperty(HBox.prototype, "children", {
            get: function () {
                return this.children_inner;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HBox.prototype, "Height", {
            get: function () {
                return this._height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HBox.prototype, "height", {
            get: function () {
                return this.Height.value;
            },
            set: function (value) {
                this.Height.value = value;
            },
            enumerable: true,
            configurable: true
        });
        return HBox;
    }(cubee.ALayout));
    cubee.HBox = HBox;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var VBox = (function (_super) {
        __extends(VBox, _super);
        function VBox() {
            var _this = _super.call(this, document.createElement("div")) || this;
            _this._width = new cubee.NumberProperty(null, true, false);
            _this._cellHeights = [];
            _this._hAligns = [];
            _this._vAligns = [];
            _this.element.style.overflow = "hidden";
            _this.pointerTransparent = true;
            _this._width.addChangeListener(function () {
                _this.requestLayout();
            });
            return _this;
        }
        Object.defineProperty(VBox.prototype, "children", {
            get: function () {
                return this.children_inner;
            },
            enumerable: true,
            configurable: true
        });
        VBox.prototype.setCellHeight = function (indexOrComponent, cellHeight) {
            if (indexOrComponent instanceof cubee.AComponent) {
                this.setCellHeight(this.children.indexOf(indexOrComponent), cellHeight);
            }
            this.setInList(this._cellHeights, indexOrComponent, cellHeight);
            this.requestLayout();
        };
        VBox.prototype.setInList = function (list, index, value) {
            while (list.length < index) {
                list.push(null);
            }
            list[index] = value;
        };
        VBox.prototype.getFromList = function (list, index) {
            if (list.length > index) {
                return list[index];
            }
            return null;
        };
        VBox.prototype.removeFromList = function (list, index) {
            if (list.length > index) {
                list.splice(index, 1);
            }
        };
        VBox.prototype.getCellHeight = function (indexOrComponent) {
            if (indexOrComponent instanceof cubee.AComponent) {
                return this.getCellHeight(this.children.indexOf(indexOrComponent));
            }
            this.getFromList(this._cellHeights, indexOrComponent);
        };
        VBox.prototype.setCellHAlign = function (indexOrComponent, hAlign) {
            if (indexOrComponent instanceof cubee.AComponent) {
                this.setCellHAlign(this.children.indexOf(indexOrComponent), hAlign);
            }
            this.setInList(this._hAligns, indexOrComponent, hAlign);
            this.requestLayout();
        };
        VBox.prototype.getCellHAlign = function (indexOrComponent) {
            if (indexOrComponent instanceof cubee.AComponent) {
                return this.getCellHAlign(this.children.indexOf(indexOrComponent));
            }
            return this.getFromList(this._hAligns, indexOrComponent);
        };
        VBox.prototype.setCellVAlign = function (indexOrComponent, vAlign) {
            if (indexOrComponent instanceof cubee.AComponent) {
                this.setCellVAlign(this.children.indexOf(indexOrComponent), vAlign);
            }
            this.setInList(this._vAligns, indexOrComponent, vAlign);
            this.requestLayout();
        };
        VBox.prototype.getCellVAlign = function (indexOrComponent) {
            if (indexOrComponent instanceof cubee.AComponent) {
                return this.getCellVAlign(this.children.indexOf(indexOrComponent));
            }
            this.getFromList(this._vAligns, indexOrComponent);
        };
        VBox.prototype.setLastCellHAlign = function (hAlign) {
            this.setCellHAlign(this.children.size() - 1, hAlign);
        };
        VBox.prototype.setLastCellVAlign = function (vAlign) {
            this.setCellVAlign(this.children.size() - 1, vAlign);
        };
        VBox.prototype.setLastCellHeight = function (height) {
            this.setCellHeight(this.children.size() - 1, height);
        };
        VBox.prototype.addEmptyCell = function (height) {
            this.children.add(null);
            this.setCellHeight(this.children.size() - 1, height);
        };
        Object.defineProperty(VBox.prototype, "Width", {
            get: function () {
                return this._width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VBox.prototype, "width", {
            get: function () {
                return this.Width.value;
            },
            set: function (value) {
                this.Width.value = value;
            },
            enumerable: true,
            configurable: true
        });
        VBox.prototype._onChildAdded = function (child) {
            if (child != null) {
                this.element.appendChild(child.element);
            }
            this.requestLayout();
        };
        VBox.prototype._onChildRemoved = function (child, index) {
            if (child != null) {
                this.element.removeChild(child.element);
            }
            this.removeFromList(this._hAligns, index);
            this.removeFromList(this._vAligns, index);
            this.removeFromList(this._cellHeights, index);
            this.requestLayout();
        };
        VBox.prototype._onChildrenCleared = function () {
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
        };
        VBox.prototype.onLayout = function () {
            var maxWidth = -1;
            if (this.width != null) {
                maxWidth = this.width;
            }
            var actH = 0;
            var maxW = 0;
            for (var i = 0; i < this.children.size(); i++) {
                var childY = 0;
                var child = this.children.get(i);
                var cellH = this.getCellHeight(i);
                var vAlign = this.getCellVAlign(i);
                var realCellH = -1;
                if (cellH != null) {
                    realCellH = cellH;
                }
                if (child == null) {
                    if (realCellH > 0) {
                        actH += realCellH;
                    }
                }
                else {
                    var cw = child.boundsWidth;
                    var ch = child.boundsHeight;
                    var cl = child.translateX;
                    var ct = child.translateY;
                    var calculatedCellH = realCellH;
                    if (calculatedCellH < 0) {
                        calculatedCellH = ch + ct;
                    }
                    else if (calculatedCellH < ch) {
                        calculatedCellH = ch;
                    }
                    childY = actH - child.translateY;
                    if (vAlign == cubee.EVAlign.MIDDLE) {
                        childY += (calculatedCellH - ch) / 2;
                    }
                    else if (vAlign == cubee.EVAlign.BOTTOM) {
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
                var childX = 0;
                var child = this.children.get(i);
                if (child == null) {
                    continue;
                }
                var hAlign = this.getCellHAlign(i);
                var cw = child.boundsWidth;
                if (hAlign == cubee.EHAlign.CENTER) {
                    childX = (realWidth - cw) / 2;
                }
                else if (hAlign == cubee.EHAlign.RIGHT) {
                    childX = (realWidth - cw);
                }
                child._setLeft(childX);
            }
            this.setSize(realWidth, actH);
        };
        return VBox;
    }(cubee.ALayout));
    cubee.VBox = VBox;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var ScrollBox = (function (_super) {
        __extends(ScrollBox, _super);
        function ScrollBox() {
            var _this = _super.call(this) || this;
            _this._content = new cubee.Property(null);
            _this._hScrollPolicy = new cubee.Property(cubee.EScrollBarPolicy.AUTO, false);
            _this._vScrollPolicy = new cubee.Property(cubee.EScrollBarPolicy.AUTO, false);
            _this._scrollWidth = new cubee.NumberProperty(0, false, true);
            _this._scrollHeight = new cubee.NumberProperty(0, false, true);
            _this._hScrollPos = new cubee.NumberProperty(0, false, true);
            _this._vScrollPos = new cubee.NumberProperty(0, false, true);
            _this._maxHScrollPos = new cubee.NumberProperty(0, false, true);
            _this._maxVScrollPos = new cubee.NumberProperty(0, false, true);
            _this._maxHScrollPosWriter = new cubee.NumberProperty(0, false, false);
            _this._maxVScrollPosWriter = new cubee.NumberProperty(0, false, false);
            _this._calculateScrollWidthExp = new cubee.Expression(function () {
                if (_this.content == null) {
                    return 0;
                }
                return _this.content.boundsWidth;
            }, _this._content);
            _this._calculateScrollHeightExp = new cubee.Expression(function () {
                if (_this.content == null) {
                    return 0;
                }
                return _this.content.boundsHeight;
            }, _this._content);
            _this.element.style.removeProperty("overflow");
            _this._scrollWidth.initReadonlyBind(_this._calculateScrollWidthExp);
            _this._scrollHeight.initReadonlyBind(_this._calculateScrollHeightExp);
            _this._maxHScrollPos.initReadonlyBind(_this._maxHScrollPosWriter);
            _this._maxVScrollPos.initReadonlyBind(_this._maxVScrollPosWriter);
            _this._maxHScrollPosWriter.bind(new cubee.Expression(function () {
                return (_this.scrollWidth - _this.clientWidth);
            }, _this.ClientWidth, _this._scrollWidth));
            _this._maxVScrollPosWriter.bind(new cubee.Expression(function () {
                return (_this.scrollHeight - _this.clientHeight);
            }, _this.ClientHeight, _this._scrollHeight));
            _this._content.addChangeListener(function () {
                _this.children_inner.clear();
                _this._calculateScrollWidthExp.unbindAll();
                _this._calculateScrollWidthExp.bind(_this._content);
                if (_this.content != null) {
                    _this._calculateScrollWidthExp.bind(_this.content.BoundsWidth);
                }
                _this._calculateScrollHeightExp.unbindAll();
                _this._calculateScrollHeightExp.bind(_this._content);
                if (_this.content != null) {
                    _this._calculateScrollHeightExp.bind(_this.content.BoundsHeight);
                }
                if (_this.content != null) {
                    _this.children_inner.add(_this.content);
                }
            });
            _this.element.addEventListener("scroll", function (evt) {
                _this.hScrollPos = _this.element.scrollLeft;
                _this.vScrollPos = _this.element.scrollTop;
            });
            _this._hScrollPos.addChangeListener(function () {
                _this.element.scrollLeft = _this.hScrollPos;
            });
            _this._hScrollPos.addChangeListener(function () {
                _this.element.scrollTop = _this.vScrollPos;
            });
            _this._hScrollPolicy.addChangeListener(function () {
                if (_this.hScrollPolicy == cubee.EScrollBarPolicy.AUTO) {
                    _this.element.style.overflowX = "auto";
                }
                else if (_this.hScrollPolicy == cubee.EScrollBarPolicy.HIDDEN) {
                    _this.element.style.overflowX = "hidden";
                }
                else if (_this.hScrollPolicy == cubee.EScrollBarPolicy.VISIBLE) {
                    _this.element.style.overflowX = "scroll";
                }
            });
            _this._hScrollPolicy.invalidate();
            _this._vScrollPolicy.addChangeListener(function () {
                if (_this.vScrollPolicy == cubee.EScrollBarPolicy.AUTO) {
                    _this.element.style.overflowY = "auto";
                }
                else if (_this.vScrollPolicy == cubee.EScrollBarPolicy.HIDDEN) {
                    _this.element.style.overflowY = "hidden";
                }
                else if (_this.vScrollPolicy == cubee.EScrollBarPolicy.VISIBLE) {
                    _this.element.style.overflowY = "scroll";
                }
            });
            _this._vScrollPolicy.invalidate();
            return _this;
        }
        ScrollBox.prototype.widthProperty = function () {
            return _super.prototype.widthProperty.call(this);
        };
        Object.defineProperty(ScrollBox.prototype, "Width", {
            get: function () {
                return this.widthProperty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBox.prototype, "width", {
            get: function () {
                return this.Width.value;
            },
            set: function (value) {
                this.Width.value = value;
            },
            enumerable: true,
            configurable: true
        });
        ScrollBox.prototype.heightProperty = function () {
            return _super.prototype.heightProperty.call(this);
        };
        Object.defineProperty(ScrollBox.prototype, "Height", {
            get: function () {
                return this.heightProperty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBox.prototype, "height", {
            get: function () {
                return this.Height.value;
            },
            set: function (value) {
                this.Height.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBox.prototype, "Content", {
            get: function () {
                return this._content;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBox.prototype, "content", {
            get: function () {
                return this.Content.value;
            },
            set: function (value) {
                this.Content.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBox.prototype, "HScrollPolicy", {
            get: function () {
                return this._hScrollPolicy;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBox.prototype, "hScrollPolicy", {
            get: function () {
                return this.HScrollPolicy.value;
            },
            set: function (value) {
                this.HScrollPolicy.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBox.prototype, "VScrollPolicy", {
            get: function () {
                return this._vScrollPolicy;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBox.prototype, "vScrollPolicy", {
            get: function () {
                return this.VScrollPolicy.value;
            },
            set: function (value) {
                this.VScrollPolicy.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBox.prototype, "ScrollWidth", {
            get: function () {
                return this._scrollWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBox.prototype, "scrollWidth", {
            get: function () {
                return this.ScrollWidth.value;
            },
            set: function (value) {
                this.ScrollWidth.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBox.prototype, "ScrollHeight", {
            get: function () {
                return this._scrollHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBox.prototype, "scrollHeight", {
            get: function () {
                return this.ScrollHeight.value;
            },
            set: function (value) {
                this.ScrollHeight.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBox.prototype, "HScrollPos", {
            get: function () {
                return this._hScrollPos;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBox.prototype, "hScrollPos", {
            get: function () {
                return this.HScrollPos.value;
            },
            set: function (value) {
                this.HScrollPos.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBox.prototype, "VScrollPos", {
            get: function () {
                return this._vScrollPos;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBox.prototype, "vScrollPos", {
            get: function () {
                return this.VScrollPos.value;
            },
            set: function (value) {
                this.VScrollPos.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBox.prototype, "MaxHScrollPos", {
            get: function () {
                return this._maxHScrollPos;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBox.prototype, "maxHScrollPos", {
            get: function () {
                return this.MaxHScrollPos.value;
            },
            set: function (value) {
                this.MaxHScrollPos.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBox.prototype, "MaxVScrollPos", {
            get: function () {
                return this._maxVScrollPos;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBox.prototype, "maxVScrollPos", {
            get: function () {
                return this.MaxVScrollPos.value;
            },
            set: function (value) {
                this.MaxVScrollPos.value = value;
            },
            enumerable: true,
            configurable: true
        });
        return ScrollBox;
    }(cubee.AUserControl));
    cubee.ScrollBox = ScrollBox;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var Label = (function (_super) {
        __extends(Label, _super);
        function Label() {
            var _this = _super.call(this, document.createElement("div")) || this;
            _this._width = new cubee.NumberProperty(null, true, false);
            _this._height = new cubee.NumberProperty(null, true, false);
            _this._text = new cubee.StringProperty("", false, false);
            _this._textOverflow = new cubee.Property(cubee.ETextOverflow.CLIP, false, false);
            _this._foreColor = new cubee.ColorProperty(cubee.Color.BLACK, true, false);
            _this._textAlign = new cubee.Property(cubee.ETextAlign.LEFT, false, false);
            _this._verticalAlign = new cubee.Property(cubee.EVAlign.TOP, false, false);
            _this._bold = new cubee.BooleanProperty(false, false, false);
            _this._italic = new cubee.BooleanProperty(false, false, false);
            _this._underline = new cubee.BooleanProperty(false, false, false);
            _this._fontSize = new cubee.NumberProperty(12, false, false);
            _this._fontFamily = new cubee.Property(cubee.FontFamily.Arial, false, false);
            _this._width.addChangeListener(function () {
                if (_this.width == null) {
                    _this.element.style.whiteSpace = "nowrap";
                    _this.element.style.overflowX = "visible";
                    _this.element.style.removeProperty("width");
                }
                else {
                    _this.element.style.whiteSpace = "normal";
                    _this.element.style.overflowX = "hidden";
                    _this.element.style.width = _this.width + "px";
                }
                _this.requestLayout();
            });
            _this._width.invalidate();
            _this._height.addChangeListener(function () {
                if (_this.height == null) {
                    _this.element.style.removeProperty("height");
                    _this.element.style.overflowY = "visible";
                }
                else {
                    _this.element.style.height = _this.height + "px";
                    _this.element.style.overflowY = "hidden";
                }
                _this.requestLayout();
            });
            _this._height.invalidate();
            _this._text.addChangeListener(function () {
                _this.element.innerHTML = _this.text;
                _this.requestLayout();
            });
            _this._text.invalidate();
            _this._textOverflow.addChangeListener(function () {
                _this.textOverflow.apply(_this.element);
                if (_this.textOverflow == cubee.ETextOverflow.ELLIPSIS) {
                    _this.element.style.whiteSpace = "nowrap";
                    _this.element.style.overflow = "hidden";
                }
                else {
                    _this.element.style.removeProperty("whiteSpace");
                    _this._width.invalidate();
                    _this._height.invalidate();
                }
                _this.requestLayout();
            });
            _this._textOverflow.invalidate();
            _this._foreColor.addChangeListener(function () {
                if (_this.foreColor == null) {
                    _this.element.style.color = "rgba(0,0,0,0.0)";
                }
                else {
                    _this.element.style.color = _this.foreColor.toCSS();
                }
            });
            _this._foreColor.invalidate();
            _this._textAlign.addChangeListener(function () {
                _this.textAlign.apply(_this.element);
            });
            _this._textAlign.invalidate();
            _this._verticalAlign.addChangeListener(function () {
                var ta = _this.verticalAlign;
                if (ta == cubee.EVAlign.TOP) {
                    _this.element.style.verticalAlign = "top";
                }
                else if (ta == cubee.EVAlign.MIDDLE) {
                    _this.element.style.verticalAlign = "middle";
                }
                else if (ta == cubee.EVAlign.BOTTOM) {
                    _this.element.style.verticalAlign = "bottom";
                }
            });
            _this._verticalAlign.invalidate();
            _this._underline.addChangeListener(function () {
                if (_this.underline) {
                    _this.element.style.textDecoration = "underline";
                }
                else {
                    _this.element.style.textDecoration = "none";
                }
                _this.requestLayout();
            });
            _this._underline.invalidate();
            _this._bold.addChangeListener(function () {
                if (_this.bold) {
                    _this.element.style.fontWeight = "bold";
                }
                else {
                    _this.element.style.fontWeight = "normal";
                }
                _this.requestLayout();
            });
            _this._bold.invalidate();
            _this._italic.addChangeListener(function () {
                if (_this.italic) {
                    _this.element.style.fontStyle = "italic";
                }
                else {
                    _this.element.style.fontStyle = "normal";
                }
                _this.requestLayout();
            });
            _this._italic.invalidate();
            _this._fontSize.addChangeListener(function () {
                _this.element.style.fontSize = _this.fontSize + "px";
                _this.requestLayout();
            });
            _this._fontSize.invalidate();
            _this._fontFamily.addChangeListener(function () {
                _this.fontFamily.apply(_this.element);
                _this.requestLayout();
            });
            _this._fontFamily.invalidate();
            return _this;
        }
        Object.defineProperty(Label.prototype, "Width", {
            get: function () {
                return this._width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "width", {
            get: function () {
                return this.Width.value;
            },
            set: function (value) {
                this.Width.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "Height", {
            get: function () {
                return this._height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "height", {
            get: function () {
                return this.Height.value;
            },
            set: function (value) {
                this.Height.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "Text", {
            get: function () {
                return this._text;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "text", {
            get: function () {
                return this.Text.value;
            },
            set: function (value) {
                this.Text.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "TextOverflow", {
            get: function () {
                return this._textOverflow;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "textOverflow", {
            get: function () {
                return this.TextOverflow.value;
            },
            set: function (value) {
                this.TextOverflow.value = value;
                this.Padding;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "ForeColor", {
            get: function () {
                return this._foreColor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "foreColor", {
            get: function () {
                return this.ForeColor.value;
            },
            set: function (value) {
                this.ForeColor.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "VerticalAlign", {
            get: function () {
                return this._verticalAlign;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "verticalAlign", {
            get: function () {
                return this.VerticalAlign.value;
            },
            set: function (value) {
                this.VerticalAlign.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "Bold", {
            get: function () {
                return this._bold;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "bold", {
            get: function () {
                return this.Bold.value;
            },
            set: function (value) {
                this.Bold.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "Italic", {
            get: function () {
                return this._italic;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "italic", {
            get: function () {
                return this.Italic.value;
            },
            set: function (value) {
                this.Italic.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "Underline", {
            get: function () {
                return this._underline;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "underline", {
            get: function () {
                return this.Underline.value;
            },
            set: function (value) {
                this.Underline.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "TextAlign", {
            get: function () {
                return this._textAlign;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "textAlign", {
            get: function () {
                return this.TextAlign.value;
            },
            set: function (value) {
                this.TextAlign.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "FontSize", {
            get: function () {
                return this._fontSize;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "fontSize", {
            get: function () {
                return this.FontSize.value;
            },
            set: function (value) {
                this.FontSize.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "FontFamily", {
            get: function () {
                return this._fontFamily;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "fontFamily", {
            get: function () {
                return this.FontFamily.value;
            },
            set: function (value) {
                this.FontFamily.value = value;
            },
            enumerable: true,
            configurable: true
        });
        return Label;
    }(cubee.AComponent));
    cubee.Label = Label;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button() {
            var _this = _super.call(this, document.createElement("button")) || this;
            _this._width = new cubee.NumberProperty(null, true, false);
            _this._height = new cubee.NumberProperty(null, true, false);
            _this._text = new cubee.StringProperty("", false, false);
            _this._textOverflow = new cubee.Property(cubee.ETextOverflow.CLIP, false, false);
            _this._foreColor = new cubee.ColorProperty(cubee.Color.BLACK, true, false);
            _this._textAlign = new cubee.Property(cubee.ETextAlign.CENTER, false, false);
            _this._verticalAlign = new cubee.Property(cubee.EVAlign.MIDDLE, false, false);
            _this._bold = new cubee.BooleanProperty(false, false, false);
            _this._italic = new cubee.BooleanProperty(false, false, false);
            _this._underline = new cubee.BooleanProperty(false, false, false);
            _this._fontSize = new cubee.NumberProperty(12, false, false);
            _this._fontFamily = new cubee.Property(cubee.FontFamily.Arial, false, false);
            _this._background = new cubee.BackgroundProperty(new cubee.ColorBackground(cubee.Color.TRANSPARENT), true, false);
            _this._shadow = new cubee.Property(null, true, false);
            _this.padding = cubee.Padding.create(10);
            _this._width.addChangeListener(function () {
                if (_this.width == null) {
                    _this.element.style.whiteSpace = "nowrap";
                    _this.element.style.overflowX = "visible";
                    _this.element.style.removeProperty("width");
                }
                else {
                    _this.element.style.whiteSpace = "normal";
                    _this.element.style.overflowX = "hidden";
                    _this.element.style.width = _this.width + "px";
                }
                _this.requestLayout();
            });
            _this._width.invalidate();
            _this._height.addChangeListener(function () {
                if (_this.height == null) {
                    _this.element.style.removeProperty("height");
                    _this.element.style.overflowY = "visible";
                }
                else {
                    _this.element.style.height = _this.height + "px";
                    _this.element.style.overflowY = "hidden";
                }
                _this.requestLayout();
            });
            _this._height.invalidate();
            _this._text.addChangeListener(function () {
                _this.element.innerHTML = _this.text;
                _this.requestLayout();
            });
            _this._text.invalidate();
            _this._textOverflow.addChangeListener(function () {
                _this.textOverflow.apply(_this.element);
                if (_this.textOverflow == cubee.ETextOverflow.ELLIPSIS) {
                    _this.element.style.whiteSpace = "nowrap";
                    _this.element.style.overflow = "hidden";
                }
                else {
                    _this.element.style.removeProperty("whiteSpace");
                    _this._width.invalidate();
                    _this._height.invalidate();
                }
                _this.requestLayout();
            });
            _this._textOverflow.invalidate();
            _this._foreColor.addChangeListener(function () {
                if (_this.foreColor == null) {
                    _this.element.style.color = "rgba(0,0,0,0.0)";
                }
                else {
                    _this.element.style.color = _this.foreColor.toCSS();
                }
            });
            _this._foreColor.invalidate();
            _this._textAlign.addChangeListener(function () {
                _this.textAlign.apply(_this.element);
            });
            _this._textAlign.invalidate();
            _this._verticalAlign.addChangeListener(function () {
                var ta = _this.verticalAlign;
                if (ta == cubee.EVAlign.TOP) {
                    _this.element.style.verticalAlign = "top";
                }
                else if (ta == cubee.EVAlign.MIDDLE) {
                    _this.element.style.verticalAlign = "middle";
                }
                else if (ta == cubee.EVAlign.BOTTOM) {
                    _this.element.style.verticalAlign = "bottom";
                }
            });
            _this._verticalAlign.invalidate();
            _this._underline.addChangeListener(function () {
                if (_this.underline) {
                    _this.element.style.textDecoration = "underline";
                }
                else {
                    _this.element.style.textDecoration = "none";
                }
                _this.requestLayout();
            });
            _this._underline.invalidate();
            _this._bold.addChangeListener(function () {
                if (_this.bold) {
                    _this.element.style.fontWeight = "bold";
                }
                else {
                    _this.element.style.fontWeight = "normal";
                }
                _this.requestLayout();
            });
            _this._bold.invalidate();
            _this._italic.addChangeListener(function () {
                if (_this.italic) {
                    _this.element.style.fontStyle = "italic";
                }
                else {
                    _this.element.style.fontStyle = "normal";
                }
                _this.requestLayout();
            });
            _this._italic.invalidate();
            _this._fontSize.addChangeListener(function () {
                _this.element.style.fontSize = _this.fontSize + "px";
                _this.requestLayout();
            });
            _this._fontSize.invalidate();
            _this._fontFamily.addChangeListener(function () {
                _this.fontFamily.apply(_this.element);
                _this.requestLayout();
            });
            _this._fontFamily.invalidate();
            _this._background.addChangeListener(function () {
                _this.element.style.removeProperty("backgroundColor");
                _this.element.style.removeProperty("backgroundImage");
                _this.element.style.removeProperty("background");
                if (_this._background.value != null) {
                    _this._background.value.apply(_this.element);
                }
            });
            _this._background.invalidate();
            _this._shadow.addChangeListener(function () {
                if (_this._shadow.value == null) {
                    _this.element.style.removeProperty("boxShadow");
                }
                else {
                    _this._shadow.value.apply(_this.element);
                }
            });
            _this.border = cubee.Border.create(1, cubee.Color.LIGHT_GRAY, 2);
            _this.fontSize = 14;
            _this.bold = true;
            _this.background = new cubee.ColorBackground(cubee.Color.WHITE);
            _this.shadow = new cubee.BoxShadow(1, 1, 5, 0, cubee.Color.LIGHT_GRAY, false);
            return _this;
        }
        Object.defineProperty(Button.prototype, "Width", {
            get: function () {
                return this._width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "width", {
            get: function () {
                return this.Width.value;
            },
            set: function (value) {
                this.Width.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "Height", {
            get: function () {
                return this._height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "height", {
            get: function () {
                return this.Height.value;
            },
            set: function (value) {
                this.Height.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "Text", {
            get: function () {
                return this._text;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "text", {
            get: function () {
                return this.Text.value;
            },
            set: function (value) {
                this.Text.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "TextOverflow", {
            get: function () {
                return this._textOverflow;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "textOverflow", {
            get: function () {
                return this.TextOverflow.value;
            },
            set: function (value) {
                this.TextOverflow.value = value;
                this.Padding;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "ForeColor", {
            get: function () {
                return this._foreColor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "foreColor", {
            get: function () {
                return this.ForeColor.value;
            },
            set: function (value) {
                this.ForeColor.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "VerticalAlign", {
            get: function () {
                return this._verticalAlign;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "verticalAlign", {
            get: function () {
                return this.VerticalAlign.value;
            },
            set: function (value) {
                this.VerticalAlign.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "Bold", {
            get: function () {
                return this._bold;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "bold", {
            get: function () {
                return this.Bold.value;
            },
            set: function (value) {
                this.Bold.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "Italic", {
            get: function () {
                return this._italic;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "italic", {
            get: function () {
                return this.Italic.value;
            },
            set: function (value) {
                this.Italic.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "Underline", {
            get: function () {
                return this._underline;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "underline", {
            get: function () {
                return this.Underline.value;
            },
            set: function (value) {
                this.Underline.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "TextAlign", {
            get: function () {
                return this._textAlign;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "textAlign", {
            get: function () {
                return this.TextAlign.value;
            },
            set: function (value) {
                this.TextAlign.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "FontSize", {
            get: function () {
                return this._fontSize;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "fontSize", {
            get: function () {
                return this.FontSize.value;
            },
            set: function (value) {
                this.FontSize.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "FontFamily", {
            get: function () {
                return this._fontFamily;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "fontFamily", {
            get: function () {
                return this.FontFamily.value;
            },
            set: function (value) {
                this.FontFamily.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "Background", {
            get: function () {
                return this._background;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "background", {
            get: function () {
                return this.Background.value;
            },
            set: function (value) {
                this.Background.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "Shadow", {
            get: function () {
                return this._shadow;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "shadow", {
            get: function () {
                return this.Shadow.value;
            },
            set: function (value) {
                this.Shadow.value = value;
            },
            enumerable: true,
            configurable: true
        });
        return Button;
    }(cubee.AComponent));
    cubee.Button = Button;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var TextBox = (function (_super) {
        __extends(TextBox, _super);
        function TextBox() {
            var _this = _super.call(this, document.createElement("input")) || this;
            _this._width = new cubee.NumberProperty(null, true, false);
            _this._height = new cubee.NumberProperty(null, true, false);
            _this._text = new cubee.StringProperty("", false, false);
            _this._background = new cubee.BackgroundProperty(new cubee.ColorBackground(cubee.Color.WHITE), true, false);
            _this._foreColor = new cubee.ColorProperty(cubee.Color.BLACK, true, false);
            _this._textAlign = new cubee.Property(cubee.ETextAlign.LEFT, false, false);
            _this._verticalAlign = new cubee.Property(cubee.EVAlign.TOP, false, false);
            _this._bold = new cubee.BooleanProperty(false, false, false);
            _this._italic = new cubee.BooleanProperty(false, false, false);
            _this._underline = new cubee.BooleanProperty(false, false, false);
            _this._fontSize = new cubee.NumberProperty(12, false, false);
            _this._fontFamily = new cubee.Property(cubee.FontFamily.Arial, false, false);
            _this._placeholder = new cubee.StringProperty(null, true);
            _this.element.setAttribute("type", "text");
            _this.border = cubee.Border.create(1, cubee.Color.LIGHT_GRAY, 0);
            _this._width.addChangeListener(function () {
                if (_this.width == null) {
                    _this.element.style.removeProperty("width");
                }
                else {
                    _this.element.style.width = _this.width + "px";
                }
                _this.requestLayout();
            });
            _this._height.addChangeListener(function () {
                if (_this.height == null) {
                    _this.element.style.removeProperty("height");
                }
                else {
                    _this.element.style.height = _this.height + "px";
                }
                _this.requestLayout();
            });
            _this._text.addChangeListener(function () {
                if (_this.text != _this.element.getAttribute("value")) {
                    _this.element.setAttribute("value", _this.text);
                }
            });
            _this._foreColor.addChangeListener(function () {
                if (_this.foreColor == null) {
                    _this.element.style.color = "rgba(0,0,0, 0.0)";
                }
                else {
                    _this.element.style.color = _this.foreColor.toCSS();
                }
            });
            _this._foreColor.invalidate();
            _this._textAlign.addChangeListener(function () {
                _this.textAlign.apply(_this.element);
            });
            _this._textAlign.invalidate();
            _this._verticalAlign.addChangeListener(function () {
                var ta = _this.verticalAlign;
                if (ta == cubee.EVAlign.TOP) {
                    _this.element.style.verticalAlign = "top";
                }
                else if (ta == cubee.EVAlign.MIDDLE) {
                    _this.element.style.verticalAlign = "middle";
                }
                else if (ta == cubee.EVAlign.BOTTOM) {
                    _this.element.style.verticalAlign = "bottom";
                }
            });
            _this._verticalAlign.invalidate();
            _this._underline.addChangeListener(function () {
                if (_this.underline) {
                    _this.element.style.textDecoration = "underline";
                }
                else {
                    _this.element.style.textDecoration = "none";
                }
                _this.requestLayout();
            });
            _this._underline.invalidate();
            _this._bold.addChangeListener(function () {
                if (_this.bold) {
                    _this.element.style.fontWeight = "bold";
                }
                else {
                    _this.element.style.fontWeight = "normal";
                }
                _this.requestLayout();
            });
            _this._bold.invalidate();
            _this._italic.addChangeListener(function () {
                if (_this.italic) {
                    _this.element.style.fontStyle = "italic";
                }
                else {
                    _this.element.style.fontStyle = "normal";
                }
                _this.requestLayout();
            });
            _this._italic.invalidate();
            _this._fontSize.addChangeListener(function () {
                _this.element.style.fontSize = _this.fontSize + "px";
                _this.requestLayout();
            });
            _this._fontSize.invalidate();
            _this._fontFamily.addChangeListener(function () {
                _this.fontFamily.apply(_this.element);
                _this.requestLayout();
            });
            _this._fontFamily.invalidate();
            _this._background.addChangeListener(function () {
                if (_this.background == null) {
                    _this.element.style.removeProperty("backgroundColor");
                    _this.element.style.removeProperty("backgroundImage");
                }
                else {
                    _this.background.apply(_this.element);
                }
            });
            _this._background.invalidate();
            _this._placeholder.addChangeListener(function () {
                if (_this.placeholder == null) {
                    _this.element.removeAttribute("placeholder");
                }
                else {
                    _this.element.setAttribute("placeholder", _this.placeholder);
                }
            });
            return _this;
        }
        Object.defineProperty(TextBox.prototype, "Width", {
            get: function () {
                return this._width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextBox.prototype, "width", {
            get: function () {
                return this.Width.value;
            },
            set: function (value) {
                this.Width.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextBox.prototype, "Height", {
            get: function () {
                return this._height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextBox.prototype, "height", {
            get: function () {
                return this.Height.value;
            },
            set: function (value) {
                this.Height.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextBox.prototype, "Text", {
            get: function () {
                return this._text;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextBox.prototype, "text", {
            get: function () {
                return this.Text.value;
            },
            set: function (value) {
                this.Text.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextBox.prototype, "Background", {
            get: function () {
                return this._background;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextBox.prototype, "background", {
            get: function () {
                return this.Background.value;
            },
            set: function (value) {
                this.Background.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextBox.prototype, "ForeColor", {
            get: function () {
                return this._foreColor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextBox.prototype, "foreColor", {
            get: function () {
                return this.ForeColor.value;
            },
            set: function (value) {
                this.ForeColor.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextBox.prototype, "TextAlign", {
            get: function () {
                return this._textAlign;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextBox.prototype, "textAlign", {
            get: function () {
                return this.TextAlign.value;
            },
            set: function (value) {
                this.TextAlign.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextBox.prototype, "VerticalAlign", {
            get: function () {
                return this._verticalAlign;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextBox.prototype, "verticalAlign", {
            get: function () {
                return this.VerticalAlign.value;
            },
            set: function (value) {
                this.VerticalAlign.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextBox.prototype, "Bold", {
            get: function () {
                return this._bold;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextBox.prototype, "bold", {
            get: function () {
                return this.Bold.value;
            },
            set: function (value) {
                this.Bold.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextBox.prototype, "Italic", {
            get: function () {
                return this._italic;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextBox.prototype, "italic", {
            get: function () {
                return this.Italic.value;
            },
            set: function (value) {
                this.Italic.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextBox.prototype, "Underline", {
            get: function () {
                return this._underline;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextBox.prototype, "underline", {
            get: function () {
                return this.Underline.value;
            },
            set: function (value) {
                this.Underline.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextBox.prototype, "FontSize", {
            get: function () {
                return this._fontSize;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextBox.prototype, "fontSize", {
            get: function () {
                return this.FontSize.value;
            },
            set: function (value) {
                this.FontSize.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextBox.prototype, "FontFamily", {
            get: function () {
                return this._fontFamily;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextBox.prototype, "fontFamily", {
            get: function () {
                return this.FontFamily.value;
            },
            set: function (value) {
                this.FontFamily.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextBox.prototype, "Placeholder", {
            get: function () {
                return this._placeholder;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextBox.prototype, "placeholder", {
            get: function () {
                return this.Placeholder.value;
            },
            set: function (value) {
                this.Placeholder.value = value;
            },
            enumerable: true,
            configurable: true
        });
        return TextBox;
    }(cubee.AComponent));
    cubee.TextBox = TextBox;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var PasswordBox = (function (_super) {
        __extends(PasswordBox, _super);
        function PasswordBox() {
            var _this = _super.call(this, document.createElement("input")) || this;
            _this._width = new cubee.NumberProperty(null, true, false);
            _this._height = new cubee.NumberProperty(null, true, false);
            _this._text = new cubee.StringProperty("", false, false);
            _this._background = new cubee.BackgroundProperty(new cubee.ColorBackground(cubee.Color.WHITE), true, false);
            _this._foreColor = new cubee.ColorProperty(cubee.Color.BLACK, true, false);
            _this._textAlign = new cubee.Property(cubee.ETextAlign.LEFT, false, false);
            _this._verticalAlign = new cubee.Property(cubee.EVAlign.TOP, false, false);
            _this._bold = new cubee.BooleanProperty(false, false, false);
            _this._italic = new cubee.BooleanProperty(false, false, false);
            _this._underline = new cubee.BooleanProperty(false, false, false);
            _this._fontSize = new cubee.NumberProperty(12, false, false);
            _this._fontFamily = new cubee.Property(cubee.FontFamily.Arial, false, false);
            _this._placeholder = new cubee.StringProperty(null, true);
            _this.element.setAttribute("type", "password");
            _this.border = cubee.Border.create(1, cubee.Color.LIGHT_GRAY, 0);
            _this._width.addChangeListener(function () {
                if (_this.width == null) {
                    _this.element.style.removeProperty("width");
                }
                else {
                    _this.element.style.width = _this.width + "px";
                }
                _this.requestLayout();
            });
            _this._height.addChangeListener(function () {
                if (_this.height == null) {
                    _this.element.style.removeProperty("height");
                }
                else {
                    _this.element.style.height = _this.height + "px";
                }
                _this.requestLayout();
            });
            _this._text.addChangeListener(function () {
                if (_this.text != _this.element.getAttribute("value")) {
                    _this.element.setAttribute("value", _this.text);
                }
            });
            _this._foreColor.addChangeListener(function () {
                if (_this.foreColor == null) {
                    _this.element.style.color = "rgba(0,0,0, 0.0)";
                }
                else {
                    _this.element.style.color = _this.foreColor.toCSS();
                }
            });
            _this._foreColor.invalidate();
            _this._textAlign.addChangeListener(function () {
                _this.textAlign.apply(_this.element);
            });
            _this._textAlign.invalidate();
            _this._verticalAlign.addChangeListener(function () {
                var ta = _this.verticalAlign;
                if (ta == cubee.EVAlign.TOP) {
                    _this.element.style.verticalAlign = "top";
                }
                else if (ta == cubee.EVAlign.MIDDLE) {
                    _this.element.style.verticalAlign = "middle";
                }
                else if (ta == cubee.EVAlign.BOTTOM) {
                    _this.element.style.verticalAlign = "bottom";
                }
            });
            _this._verticalAlign.invalidate();
            _this._underline.addChangeListener(function () {
                if (_this.underline) {
                    _this.element.style.textDecoration = "underline";
                }
                else {
                    _this.element.style.textDecoration = "none";
                }
                _this.requestLayout();
            });
            _this._underline.invalidate();
            _this._bold.addChangeListener(function () {
                if (_this.bold) {
                    _this.element.style.fontWeight = "bold";
                }
                else {
                    _this.element.style.fontWeight = "normal";
                }
                _this.requestLayout();
            });
            _this._bold.invalidate();
            _this._italic.addChangeListener(function () {
                if (_this.italic) {
                    _this.element.style.fontStyle = "italic";
                }
                else {
                    _this.element.style.fontStyle = "normal";
                }
                _this.requestLayout();
            });
            _this._italic.invalidate();
            _this._fontSize.addChangeListener(function () {
                _this.element.style.fontSize = _this.fontSize + "px";
                _this.requestLayout();
            });
            _this._fontSize.invalidate();
            _this._fontFamily.addChangeListener(function () {
                _this.fontFamily.apply(_this.element);
                _this.requestLayout();
            });
            _this._fontFamily.invalidate();
            _this._background.addChangeListener(function () {
                if (_this.background == null) {
                    _this.element.style.removeProperty("backgroundColor");
                    _this.element.style.removeProperty("backgroundImage");
                }
                else {
                    _this.background.apply(_this.element);
                }
            });
            _this._background.invalidate();
            _this._placeholder.addChangeListener(function () {
                if (_this.placeholder == null) {
                    _this.element.removeAttribute("placeholder");
                }
                else {
                    _this.element.setAttribute("placeholder", _this.placeholder);
                }
            });
            return _this;
        }
        Object.defineProperty(PasswordBox.prototype, "Width", {
            get: function () {
                return this._width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PasswordBox.prototype, "width", {
            get: function () {
                return this.Width.value;
            },
            set: function (value) {
                this.Width.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PasswordBox.prototype, "Height", {
            get: function () {
                return this._height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PasswordBox.prototype, "height", {
            get: function () {
                return this.Height.value;
            },
            set: function (value) {
                this.Height.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PasswordBox.prototype, "Text", {
            get: function () {
                return this._text;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PasswordBox.prototype, "text", {
            get: function () {
                return this.Text.value;
            },
            set: function (value) {
                this.Text.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PasswordBox.prototype, "Background", {
            get: function () {
                return this._background;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PasswordBox.prototype, "background", {
            get: function () {
                return this.Background.value;
            },
            set: function (value) {
                this.Background.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PasswordBox.prototype, "ForeColor", {
            get: function () {
                return this._foreColor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PasswordBox.prototype, "foreColor", {
            get: function () {
                return this.ForeColor.value;
            },
            set: function (value) {
                this.ForeColor.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PasswordBox.prototype, "TextAlign", {
            get: function () {
                return this._textAlign;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PasswordBox.prototype, "textAlign", {
            get: function () {
                return this.TextAlign.value;
            },
            set: function (value) {
                this.TextAlign.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PasswordBox.prototype, "VerticalAlign", {
            get: function () {
                return this._verticalAlign;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PasswordBox.prototype, "verticalAlign", {
            get: function () {
                return this.VerticalAlign.value;
            },
            set: function (value) {
                this.VerticalAlign.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PasswordBox.prototype, "Bold", {
            get: function () {
                return this._bold;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PasswordBox.prototype, "bold", {
            get: function () {
                return this.Bold.value;
            },
            set: function (value) {
                this.Bold.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PasswordBox.prototype, "Italic", {
            get: function () {
                return this._italic;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PasswordBox.prototype, "italic", {
            get: function () {
                return this.Italic.value;
            },
            set: function (value) {
                this.Italic.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PasswordBox.prototype, "Underline", {
            get: function () {
                return this._underline;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PasswordBox.prototype, "underline", {
            get: function () {
                return this.Underline.value;
            },
            set: function (value) {
                this.Underline.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PasswordBox.prototype, "FontSize", {
            get: function () {
                return this._fontSize;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PasswordBox.prototype, "fontSize", {
            get: function () {
                return this.FontSize.value;
            },
            set: function (value) {
                this.FontSize.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PasswordBox.prototype, "FontFamily", {
            get: function () {
                return this._fontFamily;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PasswordBox.prototype, "fontFamily", {
            get: function () {
                return this.FontFamily.value;
            },
            set: function (value) {
                this.FontFamily.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PasswordBox.prototype, "Placeholder", {
            get: function () {
                return this._placeholder;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PasswordBox.prototype, "placeholder", {
            get: function () {
                return this.Placeholder.value;
            },
            set: function (value) {
                this.Placeholder.value = value;
            },
            enumerable: true,
            configurable: true
        });
        return PasswordBox;
    }(cubee.AComponent));
    cubee.PasswordBox = PasswordBox;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var TextArea = (function (_super) {
        __extends(TextArea, _super);
        function TextArea() {
            var _this = _super.call(this, document.createElement("textarea")) || this;
            _this._width = new cubee.NumberProperty(null, true, false);
            _this._height = new cubee.NumberProperty(null, true, false);
            _this._text = new cubee.StringProperty("", false, false);
            _this._background = new cubee.BackgroundProperty(new cubee.ColorBackground(cubee.Color.WHITE), true, false);
            _this._foreColor = new cubee.ColorProperty(cubee.Color.BLACK, true, false);
            _this._textAlign = new cubee.Property(cubee.ETextAlign.LEFT, false, false);
            _this._verticalAlign = new cubee.Property(cubee.EVAlign.TOP, false, false);
            _this._bold = new cubee.BooleanProperty(false, false, false);
            _this._italic = new cubee.BooleanProperty(false, false, false);
            _this._underline = new cubee.BooleanProperty(false, false, false);
            _this._fontSize = new cubee.NumberProperty(12, false, false);
            _this._fontFamily = new cubee.Property(cubee.FontFamily.Arial, false, false);
            _this._placeholder = new cubee.StringProperty(null, true);
            _this.element.setAttribute("type", "text");
            _this.border = cubee.Border.create(1, cubee.Color.LIGHT_GRAY, 0);
            _this._width.addChangeListener(function () {
                if (_this.width == null) {
                    _this.element.style.removeProperty("width");
                }
                else {
                    _this.element.style.width = _this.width + "px";
                }
                _this.requestLayout();
            });
            _this._height.addChangeListener(function () {
                if (_this.height == null) {
                    _this.element.style.removeProperty("height");
                }
                else {
                    _this.element.style.height = _this.height + "px";
                }
                _this.requestLayout();
            });
            _this._text.addChangeListener(function () {
                if (_this.text != _this.element.getAttribute("value")) {
                    _this.element.setAttribute("value", _this.text);
                }
            });
            _this._foreColor.addChangeListener(function () {
                if (_this.foreColor == null) {
                    _this.element.style.color = "rgba(0,0,0, 0.0)";
                }
                else {
                    _this.element.style.color = _this.foreColor.toCSS();
                }
            });
            _this._foreColor.invalidate();
            _this._textAlign.addChangeListener(function () {
                _this.textAlign.apply(_this.element);
            });
            _this._textAlign.invalidate();
            _this._verticalAlign.addChangeListener(function () {
                var ta = _this.verticalAlign;
                if (ta == cubee.EVAlign.TOP) {
                    _this.element.style.verticalAlign = "top";
                }
                else if (ta == cubee.EVAlign.MIDDLE) {
                    _this.element.style.verticalAlign = "middle";
                }
                else if (ta == cubee.EVAlign.BOTTOM) {
                    _this.element.style.verticalAlign = "bottom";
                }
            });
            _this._verticalAlign.invalidate();
            _this._underline.addChangeListener(function () {
                if (_this.underline) {
                    _this.element.style.textDecoration = "underline";
                }
                else {
                    _this.element.style.textDecoration = "none";
                }
                _this.requestLayout();
            });
            _this._underline.invalidate();
            _this._bold.addChangeListener(function () {
                if (_this.bold) {
                    _this.element.style.fontWeight = "bold";
                }
                else {
                    _this.element.style.fontWeight = "normal";
                }
                _this.requestLayout();
            });
            _this._bold.invalidate();
            _this._italic.addChangeListener(function () {
                if (_this.italic) {
                    _this.element.style.fontStyle = "italic";
                }
                else {
                    _this.element.style.fontStyle = "normal";
                }
                _this.requestLayout();
            });
            _this._italic.invalidate();
            _this._fontSize.addChangeListener(function () {
                _this.element.style.fontSize = _this.fontSize + "px";
                _this.requestLayout();
            });
            _this._fontSize.invalidate();
            _this._fontFamily.addChangeListener(function () {
                _this.fontFamily.apply(_this.element);
                _this.requestLayout();
            });
            _this._fontFamily.invalidate();
            _this._background.addChangeListener(function () {
                if (_this.background == null) {
                    _this.element.style.removeProperty("backgroundColor");
                    _this.element.style.removeProperty("backgroundImage");
                }
                else {
                    _this.background.apply(_this.element);
                }
            });
            _this._background.invalidate();
            _this._placeholder.addChangeListener(function () {
                if (_this.placeholder == null) {
                    _this.element.removeAttribute("placeholder");
                }
                else {
                    _this.element.setAttribute("placeholder", _this.placeholder);
                }
            });
            return _this;
        }
        Object.defineProperty(TextArea.prototype, "Width", {
            get: function () {
                return this._width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextArea.prototype, "width", {
            get: function () {
                return this.Width.value;
            },
            set: function (value) {
                this.Width.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextArea.prototype, "Height", {
            get: function () {
                return this._height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextArea.prototype, "height", {
            get: function () {
                return this.Height.value;
            },
            set: function (value) {
                this.Height.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextArea.prototype, "Text", {
            get: function () {
                return this._text;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextArea.prototype, "text", {
            get: function () {
                return this.Text.value;
            },
            set: function (value) {
                this.Text.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextArea.prototype, "Background", {
            get: function () {
                return this._background;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextArea.prototype, "background", {
            get: function () {
                return this.Background.value;
            },
            set: function (value) {
                this.Background.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextArea.prototype, "ForeColor", {
            get: function () {
                return this._foreColor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextArea.prototype, "foreColor", {
            get: function () {
                return this.ForeColor.value;
            },
            set: function (value) {
                this.ForeColor.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextArea.prototype, "TextAlign", {
            get: function () {
                return this._textAlign;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextArea.prototype, "textAlign", {
            get: function () {
                return this.TextAlign.value;
            },
            set: function (value) {
                this.TextAlign.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextArea.prototype, "VerticalAlign", {
            get: function () {
                return this._verticalAlign;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextArea.prototype, "verticalAlign", {
            get: function () {
                return this.VerticalAlign.value;
            },
            set: function (value) {
                this.VerticalAlign.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextArea.prototype, "Bold", {
            get: function () {
                return this._bold;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextArea.prototype, "bold", {
            get: function () {
                return this.Bold.value;
            },
            set: function (value) {
                this.Bold.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextArea.prototype, "Italic", {
            get: function () {
                return this._italic;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextArea.prototype, "italic", {
            get: function () {
                return this.Italic.value;
            },
            set: function (value) {
                this.Italic.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextArea.prototype, "Underline", {
            get: function () {
                return this._underline;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextArea.prototype, "underline", {
            get: function () {
                return this.Underline.value;
            },
            set: function (value) {
                this.Underline.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextArea.prototype, "FontSize", {
            get: function () {
                return this._fontSize;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextArea.prototype, "fontSize", {
            get: function () {
                return this.FontSize.value;
            },
            set: function (value) {
                this.FontSize.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextArea.prototype, "FontFamily", {
            get: function () {
                return this._fontFamily;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextArea.prototype, "fontFamily", {
            get: function () {
                return this.FontFamily.value;
            },
            set: function (value) {
                this.FontFamily.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextArea.prototype, "Placeholder", {
            get: function () {
                return this._placeholder;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextArea.prototype, "placeholder", {
            get: function () {
                return this.Placeholder.value;
            },
            set: function (value) {
                this.Placeholder.value = value;
            },
            enumerable: true,
            configurable: true
        });
        return TextArea;
    }(cubee.AComponent));
    cubee.TextArea = TextArea;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var CheckBox = (function (_super) {
        __extends(CheckBox, _super);
        function CheckBox() {
            var _this = _super.call(this, document.createElement("input")) || this;
            _this._checked = new cubee.BooleanProperty(false, false);
            _this.element.setAttribute("type", "checkbox");
            _this._checked.addChangeListener(function () {
                var e = _this.element;
                e.checked = _this.checked;
            });
            return _this;
        }
        Object.defineProperty(CheckBox.prototype, "Checked", {
            get: function () {
                return this._checked;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CheckBox.prototype, "checked", {
            get: function () {
                return this.Checked.value;
            },
            set: function (value) {
                this.Checked.value = value;
            },
            enumerable: true,
            configurable: true
        });
        return CheckBox;
    }(cubee.AComponent));
    cubee.CheckBox = CheckBox;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var ComboBox = (function (_super) {
        __extends(ComboBox, _super);
        function ComboBox() {
            var _this = _super.call(this, document.createElement("input")) || this;
            _this._selectedIndex = new cubee.NumberProperty(-1, false, false);
            _this._selectedItem = new cubee.Property(null, true, false);
            _this.items = [];
            _this._width = new cubee.NumberProperty(null, true, false);
            _this._height = new cubee.NumberProperty(null, true, false);
            _this._text = new cubee.StringProperty("", false, false);
            _this._background = new cubee.BackgroundProperty(new cubee.ColorBackground(cubee.Color.WHITE), true, false);
            _this._foreColor = new cubee.ColorProperty(cubee.Color.BLACK, true, false);
            _this._textAlign = new cubee.Property(cubee.ETextAlign.LEFT, false, false);
            _this._verticalAlign = new cubee.Property(cubee.EVAlign.TOP, false, false);
            _this._bold = new cubee.BooleanProperty(false, false, false);
            _this._italic = new cubee.BooleanProperty(false, false, false);
            _this._underline = new cubee.BooleanProperty(false, false, false);
            _this._fontSize = new cubee.NumberProperty(12, false, false);
            _this._fontFamily = new cubee.Property(cubee.FontFamily.Arial, false, false);
            _this._placeholder = new cubee.StringProperty(null, true);
            _this.element.setAttribute("type", "select");
            _this.border = cubee.Border.create(1, cubee.Color.LIGHT_GRAY, 0);
            _this._width.addChangeListener(function () {
                if (_this.width == null) {
                    _this.element.style.removeProperty("width");
                }
                else {
                    _this.element.style.width = _this.width + "px";
                }
                _this.requestLayout();
            });
            _this._height.addChangeListener(function () {
                if (_this.height == null) {
                    _this.element.style.removeProperty("height");
                }
                else {
                    _this.element.style.height = _this.height + "px";
                }
                _this.requestLayout();
            });
            _this._text.addChangeListener(function () {
                if (_this.text != _this.element.getAttribute("value")) {
                    _this.element.setAttribute("value", _this.text);
                }
            });
            _this._foreColor.addChangeListener(function () {
                if (_this.foreColor == null) {
                    _this.element.style.color = "rgba(0,0,0, 0.0)";
                }
                else {
                    _this.element.style.color = _this.foreColor.toCSS();
                }
            });
            _this._foreColor.invalidate();
            _this._textAlign.addChangeListener(function () {
                _this.textAlign.apply(_this.element);
            });
            _this._textAlign.invalidate();
            _this._verticalAlign.addChangeListener(function () {
                var ta = _this.verticalAlign;
                if (ta == cubee.EVAlign.TOP) {
                    _this.element.style.verticalAlign = "top";
                }
                else if (ta == cubee.EVAlign.MIDDLE) {
                    _this.element.style.verticalAlign = "middle";
                }
                else if (ta == cubee.EVAlign.BOTTOM) {
                    _this.element.style.verticalAlign = "bottom";
                }
            });
            _this._verticalAlign.invalidate();
            _this._underline.addChangeListener(function () {
                if (_this.underline) {
                    _this.element.style.textDecoration = "underline";
                }
                else {
                    _this.element.style.textDecoration = "none";
                }
                _this.requestLayout();
            });
            _this._underline.invalidate();
            _this._bold.addChangeListener(function () {
                if (_this.bold) {
                    _this.element.style.fontWeight = "bold";
                }
                else {
                    _this.element.style.fontWeight = "normal";
                }
                _this.requestLayout();
            });
            _this._bold.invalidate();
            _this._italic.addChangeListener(function () {
                if (_this.italic) {
                    _this.element.style.fontStyle = "italic";
                }
                else {
                    _this.element.style.fontStyle = "normal";
                }
                _this.requestLayout();
            });
            _this._italic.invalidate();
            _this._fontSize.addChangeListener(function () {
                _this.element.style.fontSize = _this.fontSize + "px";
                _this.requestLayout();
            });
            _this._fontSize.invalidate();
            _this._fontFamily.addChangeListener(function () {
                _this.fontFamily.apply(_this.element);
                _this.requestLayout();
            });
            _this._fontFamily.invalidate();
            _this._background.addChangeListener(function () {
                if (_this.background == null) {
                    _this.element.style.removeProperty("backgroundColor");
                    _this.element.style.removeProperty("backgroundImage");
                }
                else {
                    _this.background.apply(_this.element);
                }
            });
            _this._background.invalidate();
            _this._placeholder.addChangeListener(function () {
                if (_this.placeholder == null) {
                    _this.element.removeAttribute("placeholder");
                }
                else {
                    _this.element.setAttribute("placeholder", _this.placeholder);
                }
            });
            _this.element.addEventListener("change", function () {
                var val = _this.element.value;
                if (val == null || val == "") {
                    _this._selectedIndex.value = -1;
                    _this._selectedItem.value = null;
                }
                else {
                    _this._selectedIndex.value = parseInt(val);
                }
            });
            _this._selectedIndex.addChangeListener(function () {
            });
            _this._selectedItem.addChangeListener(function () {
                var item = _this._selectedItem.value;
                if (item == null) {
                    _this._selectedIndex.value = -1;
                    _this.element.value = null;
                }
                else {
                    var index = -1;
                    for (var i = 0; i < _this.items.length; i++) {
                        if (item == _this.items[i]) {
                            index = i;
                        }
                    }
                    if (index < 0) {
                        _this._selectedIndex.value = -1;
                        _this.element.value = null;
                    }
                    else {
                        _this._selectedIndex.value = index;
                        _this.element.value = "" + index;
                    }
                }
            });
            return _this;
        }
        Object.defineProperty(ComboBox.prototype, "Width", {
            get: function () {
                return this._width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComboBox.prototype, "width", {
            get: function () {
                return this.Width.value;
            },
            set: function (value) {
                this.Width.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComboBox.prototype, "Height", {
            get: function () {
                return this._height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComboBox.prototype, "height", {
            get: function () {
                return this.Height.value;
            },
            set: function (value) {
                this.Height.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComboBox.prototype, "Text", {
            get: function () {
                return this._text;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComboBox.prototype, "text", {
            get: function () {
                return this.Text.value;
            },
            set: function (value) {
                this.Text.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComboBox.prototype, "Background", {
            get: function () {
                return this._background;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComboBox.prototype, "background", {
            get: function () {
                return this.Background.value;
            },
            set: function (value) {
                this.Background.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComboBox.prototype, "ForeColor", {
            get: function () {
                return this._foreColor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComboBox.prototype, "foreColor", {
            get: function () {
                return this.ForeColor.value;
            },
            set: function (value) {
                this.ForeColor.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComboBox.prototype, "TextAlign", {
            get: function () {
                return this._textAlign;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComboBox.prototype, "textAlign", {
            get: function () {
                return this.TextAlign.value;
            },
            set: function (value) {
                this.TextAlign.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComboBox.prototype, "VerticalAlign", {
            get: function () {
                return this._verticalAlign;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComboBox.prototype, "verticalAlign", {
            get: function () {
                return this.VerticalAlign.value;
            },
            set: function (value) {
                this.VerticalAlign.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComboBox.prototype, "Bold", {
            get: function () {
                return this._bold;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComboBox.prototype, "bold", {
            get: function () {
                return this.Bold.value;
            },
            set: function (value) {
                this.Bold.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComboBox.prototype, "Italic", {
            get: function () {
                return this._italic;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComboBox.prototype, "italic", {
            get: function () {
                return this.Italic.value;
            },
            set: function (value) {
                this.Italic.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComboBox.prototype, "Underline", {
            get: function () {
                return this._underline;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComboBox.prototype, "underline", {
            get: function () {
                return this.Underline.value;
            },
            set: function (value) {
                this.Underline.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComboBox.prototype, "FontSize", {
            get: function () {
                return this._fontSize;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComboBox.prototype, "fontSize", {
            get: function () {
                return this.FontSize.value;
            },
            set: function (value) {
                this.FontSize.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComboBox.prototype, "FontFamily", {
            get: function () {
                return this._fontFamily;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComboBox.prototype, "fontFamily", {
            get: function () {
                return this.FontFamily.value;
            },
            set: function (value) {
                this.FontFamily.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComboBox.prototype, "Placeholder", {
            get: function () {
                return this._placeholder;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComboBox.prototype, "placeholder", {
            get: function () {
                return this.Placeholder.value;
            },
            set: function (value) {
                this.Placeholder.value = value;
            },
            enumerable: true,
            configurable: true
        });
        ComboBox.prototype.selectedIndexProperty = function () {
            return this._selectedIndex;
        };
        Object.defineProperty(ComboBox.prototype, "SelectedIndex", {
            get: function () {
                return this.selectedIndexProperty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComboBox.prototype, "selectedIndex", {
            get: function () {
                return this.SelectedIndex.value;
            },
            set: function (value) {
                this.SelectedIndex.value = value;
            },
            enumerable: true,
            configurable: true
        });
        ComboBox.prototype.selectedItemProperty = function () {
            return this._selectedItem;
        };
        Object.defineProperty(ComboBox.prototype, "SelectedItem", {
            get: function () {
                return this.selectedItemProperty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComboBox.prototype, "selectedItem", {
            get: function () {
                return this.SelectedItem.value;
            },
            set: function (value) {
                this.SelectedItem.value = value;
            },
            enumerable: true,
            configurable: true
        });
        return ComboBox;
    }(cubee.AComponent));
    cubee.ComboBox = ComboBox;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var PictureBox = (function (_super) {
        __extends(PictureBox, _super);
        function PictureBox() {
            var _this = _super.call(this, document.createElement("div")) || this;
            _this._width = new cubee.NumberProperty(50, false, false);
            _this._height = new cubee.NumberProperty(50, false, false);
            _this._pictureSizeMode = new cubee.Property(cubee.EPictureSizeMode.NORMAL, false, false);
            _this._image = new cubee.Property(null, true, false);
            _this._background = new cubee.BackgroundProperty(null, true, false);
            _this._imgElement = null;
            _this.element.style.overflow = "hidden";
            _this._imgElement = document.createElement("img");
            _this._imgElement.style.position = "absolute";
            _this.element.appendChild(_this._imgElement);
            _this._width.addChangeListener(function () {
                _this.recalculateSize();
            });
            _this._width.invalidate();
            _this._height.addChangeListener(function () {
                _this.recalculateSize();
            });
            _this._height.invalidate();
            _this._pictureSizeMode.addChangeListener(function () {
                _this.recalculateSize();
            });
            _this._pictureSizeMode.invalidate();
            _this._image.addChangeListener(function () {
                if (_this._image.value != null) {
                    _this.image.apply(_this._imgElement);
                    if (!_this.image.loaded) {
                        _this.image.onLoad.addListener(function () {
                            _this.recalculateSize();
                        });
                    }
                }
                else {
                    _this._imgElement.setAttribute("src", "");
                }
                _this.recalculateSize();
            });
            _this._image.invalidate();
            _this._background.addChangeListener(function () {
                if (_this.background == null) {
                    _this.element.style.removeProperty("backgroundColor");
                    _this.element.style.removeProperty("backgroundImage");
                }
                else {
                    _this.background.apply(_this.element);
                }
            });
            _this._background.invalidate();
            return _this;
        }
        PictureBox.prototype.recalculateSize = function () {
            this.element.style.width = this.width + "px";
            this.element.style.height = this.height + "px";
            var psm = this.pictureSizeMode;
            var imgWidth = 0;
            var imgHeight = 0;
            var picWidth = this.width;
            var picHeight = this.height;
            var cx = 0;
            var cy = 0;
            var cw = 0;
            var ch = 0;
            var imgRatio = null;
            var picRatio = picWidth / picHeight;
            if (this.image != null) {
                imgWidth = this.image.width;
                imgHeight = this.image.height;
            }
            if (imgWidth == 0 || imgHeight == 0) {
            }
            else {
                imgRatio = imgWidth / imgHeight;
                if (psm == cubee.EPictureSizeMode.CENTER) {
                    cx = (imgWidth - picWidth) / 2;
                    cy = (imgHeight - picHeight) / 2;
                    cw = imgWidth;
                    ch = imgHeight;
                }
                else if (psm == cubee.EPictureSizeMode.FILL) {
                    if (imgRatio > picRatio) {
                        cy = 0;
                        ch = picHeight;
                        cw = (ch * imgRatio) | 0;
                        cx = (picWidth - cw) / 2;
                    }
                    else {
                        cx = 0;
                        cw = picWidth;
                        ch = (cw / imgRatio) | 0;
                        cy = (picHeight - ch) / 2;
                    }
                }
                else if (psm == cubee.EPictureSizeMode.FIT_HEIGHT) {
                    cy = 0;
                    ch = picHeight;
                    cw = (ch * imgRatio) | 0;
                    cx = (picWidth - cw) / 2;
                }
                else if (psm == cubee.EPictureSizeMode.FIT_WIDTH) {
                    cx = 0;
                    cw = picWidth;
                    ch = (cw / imgRatio) | 0;
                    cy = (picHeight - ch) / 2;
                }
                else if (psm == cubee.EPictureSizeMode.NORMAL) {
                    cx = 0;
                    cy = 0;
                    cw = imgWidth;
                    ch = imgHeight;
                }
                else if (psm == cubee.EPictureSizeMode.STRETCH) {
                    cx = 0;
                    cy = 0;
                    cw = picWidth;
                    ch = picHeight;
                }
                else if (psm == cubee.EPictureSizeMode.ZOOM) {
                    if (imgRatio > picRatio) {
                        cx = 0;
                        cw = picWidth;
                        ch = (cw / imgRatio) | 0;
                        cy = (picHeight - ch) / 2;
                    }
                    else {
                        cy = 0;
                        ch = picHeight;
                        cw = (ch * imgRatio) | 0;
                        cx = (picWidth - cw) / 2;
                    }
                }
            }
            this.element.style.left = cx + "px";
            this.element.style.top = cy + "px";
            this.element.style.width = cw + "px";
            this.element.style.height = ch + "px";
            this.requestLayout();
        };
        PictureBox.prototype.pictureSizeModeProperty = function () {
            return this._pictureSizeMode;
        };
        Object.defineProperty(PictureBox.prototype, "PictureSizeMode", {
            get: function () {
                return this.pictureSizeModeProperty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PictureBox.prototype, "pictureSizeMode", {
            get: function () {
                return this.PictureSizeMode.value;
            },
            set: function (value) {
                this.PictureSizeMode.value = value;
            },
            enumerable: true,
            configurable: true
        });
        PictureBox.prototype.widthProperty = function () {
            return this._width;
        };
        Object.defineProperty(PictureBox.prototype, "Width", {
            get: function () {
                return this.widthProperty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PictureBox.prototype, "width", {
            get: function () {
                return this.Width.value;
            },
            set: function (value) {
                this.Width.value = value;
            },
            enumerable: true,
            configurable: true
        });
        PictureBox.prototype.heightProperty = function () {
            return this._height;
        };
        Object.defineProperty(PictureBox.prototype, "Height", {
            get: function () {
                return this.heightProperty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PictureBox.prototype, "height", {
            get: function () {
                return this.Height.value;
            },
            set: function (value) {
                this.Height.value = value;
            },
            enumerable: true,
            configurable: true
        });
        PictureBox.prototype.paddingProperty = function () {
            return _super.prototype.paddingProperty.call(this);
        };
        Object.defineProperty(PictureBox.prototype, "Padding", {
            get: function () {
                return this.paddingProperty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PictureBox.prototype, "padding", {
            get: function () {
                return this.Padding.value;
            },
            set: function (value) {
                this.Padding.value = value;
            },
            enumerable: true,
            configurable: true
        });
        PictureBox.prototype.borderProperty = function () {
            return _super.prototype.borderProperty.call(this);
        };
        Object.defineProperty(PictureBox.prototype, "Border", {
            get: function () {
                return this.borderProperty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PictureBox.prototype, "border", {
            get: function () {
                return this.Border.value;
            },
            set: function (value) {
                this.Border.value = value;
            },
            enumerable: true,
            configurable: true
        });
        PictureBox.prototype.backgroundProperty = function () {
            return this._background;
        };
        Object.defineProperty(PictureBox.prototype, "Background", {
            get: function () {
                return this.backgroundProperty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PictureBox.prototype, "background", {
            get: function () {
                return this.Background.value;
            },
            set: function (value) {
                this.Background.value = value;
            },
            enumerable: true,
            configurable: true
        });
        PictureBox.prototype.imageProperty = function () {
            return this._image;
        };
        Object.defineProperty(PictureBox.prototype, "Image", {
            get: function () {
                return this.imageProperty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PictureBox.prototype, "image", {
            get: function () {
                return this.Image.value;
            },
            set: function (value) {
                this.Image.value = value;
            },
            enumerable: true,
            configurable: true
        });
        return PictureBox;
    }(cubee.AComponent));
    cubee.PictureBox = PictureBox;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var APopup = (function () {
        function APopup(modal, autoClose, glassColor) {
            if (modal === void 0) { modal = true; }
            if (autoClose === void 0) { autoClose = true; }
            if (glassColor === void 0) { glassColor = cubee.Color.getArgbColor(0x00000000); }
            var _this = this;
            this._modal = false;
            this._autoClose = true;
            this._glassColor = cubee.Color.TRANSPARENT;
            this._translateX = new cubee.NumberProperty(0, false, false);
            this._translateY = new cubee.NumberProperty(0, false, false);
            this._center = new cubee.BooleanProperty(false, false, false);
            this._popupRoot = null;
            this._rootComponentContainer = null;
            this._rootComponent = null;
            this._visible = false;
            this._modal = modal;
            this._autoClose = autoClose;
            this._glassColor = glassColor;
            this._popupRoot = new cubee.Panel();
            this._popupRoot.element.style.left = "0px";
            this._popupRoot.element.style.top = "0px";
            this._popupRoot.element.style.right = "0px";
            this._popupRoot.element.style.bottom = "0px";
            this._popupRoot.element.style.position = "fixed";
            if (glassColor != null) {
                this._popupRoot.background = new cubee.ColorBackground(glassColor);
            }
            if (modal || autoClose) {
                this._popupRoot.element.style.pointerEvents = "all";
            }
            else {
                this._popupRoot.element.style.pointerEvents = "none";
                this._popupRoot.pointerTransparent = true;
            }
            this._rootComponentContainer = new cubee.Panel();
            this._rootComponentContainer.TranslateX.bind(new cubee.Expression(function () {
                var baseX = 0;
                if (_this._center.value) {
                    baseX = (_this._popupRoot.clientWidth - _this._rootComponentContainer.boundsWidth) / 2;
                }
                return baseX + _this._translateX.value;
            }, this._center, this._popupRoot.ClientWidth, this._translateX, this._rootComponentContainer.BoundsWidth));
            this._rootComponentContainer.TranslateY.bind(new cubee.Expression(function () {
                var baseY = 0;
                if (_this._center.value) {
                    baseY = (_this._popupRoot.clientHeight - _this._rootComponentContainer.boundsHeight) / 2;
                }
                return baseY + _this._translateY.value;
            }, this._center, this._popupRoot.ClientHeight, this._translateY, this._rootComponentContainer.BoundsHeight));
            this._popupRoot.children.add(this._rootComponentContainer);
            if (autoClose) {
                this._popupRoot.onClick.addListener(function () {
                    _this.close();
                });
            }
        }
        Object.defineProperty(APopup.prototype, "__popupRoot", {
            get: function () {
                return this._popupRoot;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(APopup.prototype, "rootComponent", {
            get: function () {
                return this._rootComponent;
            },
            set: function (rootComponent) {
                this._rootComponentContainer.children.clear();
                this._rootComponent = null;
                if (rootComponent != null) {
                    this._rootComponentContainer.children.add(rootComponent);
                }
                this._rootComponent = rootComponent;
            },
            enumerable: true,
            configurable: true
        });
        APopup.prototype.show = function () {
            if (this._visible) {
                throw "This popup is already shown.";
            }
            var body = document.getElementsByTagName("body")[0];
            body.appendChild(this._popupRoot.element);
            Popups._addPopup(this);
            this._visible = true;
        };
        APopup.prototype.close = function () {
            if (!this._visible) {
                throw "This popup isn't shown.";
            }
            if (!this.isCloseAllowed()) {
                return false;
            }
            var body = document.getElementsByTagName("body")[0];
            body.removeChild(this._popupRoot.element);
            Popups._removePopup(this);
            this._visible = false;
            this.onClosed();
            return true;
        };
        APopup.prototype.isCloseAllowed = function () {
            return true;
        };
        APopup.prototype.onClosed = function () {
        };
        Object.defineProperty(APopup.prototype, "modal", {
            get: function () {
                return this._modal;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(APopup.prototype, "autoClose", {
            get: function () {
                return this._autoClose;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(APopup.prototype, "glassColor", {
            get: function () {
                return this._glassColor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(APopup.prototype, "TranslateX", {
            get: function () {
                return this._translateX;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(APopup.prototype, "translateX", {
            get: function () {
                return this.TranslateX.value;
            },
            set: function (value) {
                this.TranslateX.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(APopup.prototype, "TranslateY", {
            get: function () {
                return this._translateY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(APopup.prototype, "translateY", {
            get: function () {
                return this.TranslateY.value;
            },
            set: function (value) {
                this.TranslateY.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(APopup.prototype, "Center", {
            get: function () {
                return this._center;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(APopup.prototype, "center", {
            get: function () {
                return this.Center.value;
            },
            set: function (value) {
                this.Center.value = value;
            },
            enumerable: true,
            configurable: true
        });
        APopup.prototype._layout = function () {
            this._popupRoot.width = window.innerWidth;
            this._popupRoot.height = window.innerHeight;
            this._popupRoot.layout();
        };
        return APopup;
    }());
    cubee.APopup = APopup;
    var Popups = (function () {
        function Popups() {
            throw "Can not instantiate Popups class.";
        }
        Popups._addPopup = function (popup) {
            Popups._popups.push(popup);
            Popups._requestLayout();
        };
        Popups._removePopup = function (popup) {
            var idx = Popups._popups.indexOf(popup);
            if (idx > -1) {
                Popups._popups.splice(idx, 1);
                Popups._requestLayout();
            }
        };
        Popups._requestLayout = function () {
            Popups._layoutRunOnce.run();
        };
        Popups.layout = function () {
            Popups._popups.forEach(function (popup) {
                popup._layout();
            });
        };
        return Popups;
    }());
    Popups._popups = [];
    Popups._layoutRunOnce = new cubee.RunOnce(function () {
        Popups.layout();
    });
    cubee.Popups = Popups;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var CubeePanel = (function () {
        function CubeePanel(element) {
            var _this = this;
            this._layoutRunOnce = null;
            this._contentPanel = null;
            this._rootComponent = null;
            this._left = -1;
            this._top = -1;
            this._clientWidth = -1;
            this._clientHeight = -1;
            this._offsetWidth = -1;
            this._offsetHeight = -1;
            this._element = element;
            window.addEventListener("onresize", function (evt) {
                _this.requestLayout();
            });
            this._contentPanel = new cubee.Panel();
            this._contentPanel.element.style.pointerEvents = "none";
            this._contentPanel.pointerTransparent = true;
            this._contentPanel.setCubeePanel(this);
            this._element.appendChild(this._contentPanel.element);
            this.checkBounds();
            this.requestLayout();
            var t = new cubee.Timer(function () {
                cubee.EventQueue.Instance.invokeLater(function () {
                    _this.checkBounds();
                });
            });
            t.start(100, true);
        }
        CubeePanel.prototype.checkBounds = function () {
            var newLeft = this._element.offsetLeft;
            var newTop = this._element.offsetTop;
            var newClientWidth = this._element.clientWidth;
            var newClientHeight = this._element.clientHeight;
            var newOffsetWidth = this._element.offsetWidth;
            var newOffsetHeight = this._element.offsetHeight;
            if (newLeft != this._left || newTop != this._top || newClientWidth != this._clientWidth || newClientHeight != this._clientHeight
                || newOffsetWidth != this._offsetWidth || newOffsetHeight != this._offsetHeight) {
                this._left = newLeft;
                this._top = newTop;
                this._clientWidth = newClientWidth;
                this._clientHeight = newClientHeight;
                this._offsetWidth = newOffsetWidth;
                this._offsetHeight = newOffsetHeight;
                this._contentPanel.width = this._offsetWidth;
                this._contentPanel.height = this._offsetHeight;
                if (this._element.style.position == "absolute") {
                    this._contentPanel.translateX = 0;
                    this._contentPanel.translateY = 0;
                }
                else {
                    this._contentPanel.translateX = 0;
                    this._contentPanel.translateY = 0;
                }
                this.requestLayout();
            }
        };
        CubeePanel.prototype.requestLayout = function () {
            var _this = this;
            if (this._layoutRunOnce == null) {
                this._layoutRunOnce = new cubee.RunOnce(function () {
                    _this.layout();
                });
            }
            this._layoutRunOnce.run();
        };
        CubeePanel.prototype.layout = function () {
            cubee.Popups._requestLayout();
            this._contentPanel.layout();
        };
        Object.defineProperty(CubeePanel.prototype, "rootComponent", {
            get: function () {
                return this._rootComponent;
            },
            set: function (rootComponent) {
                this._contentPanel.children.clear();
                this._rootComponent = null;
                if (rootComponent != null) {
                    this._contentPanel.children.add(rootComponent);
                    this._rootComponent = rootComponent;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CubeePanel.prototype, "ClientWidth", {
            get: function () {
                return this._contentPanel.ClientWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CubeePanel.prototype, "clientWidth", {
            get: function () {
                return this.ClientWidth.value;
            },
            set: function (value) {
                this.ClientWidth.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CubeePanel.prototype, "ClientHeight", {
            get: function () {
                return this._contentPanel.ClientHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CubeePanel.prototype, "clientHeight", {
            get: function () {
                return this.ClientHeight.value;
            },
            set: function (value) {
                this.ClientHeight.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CubeePanel.prototype, "BoundsWidth", {
            get: function () {
                return this._contentPanel.BoundsWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CubeePanel.prototype, "boundsWidth", {
            get: function () {
                return this.BoundsWidth.value;
            },
            set: function (value) {
                this.BoundsWidth.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CubeePanel.prototype, "BoundsHeight", {
            get: function () {
                return this._contentPanel.BoundsHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CubeePanel.prototype, "boundsHeight", {
            get: function () {
                return this.BoundsHeight.value;
            },
            set: function (value) {
                this.BoundsHeight.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CubeePanel.prototype, "BoundsLeft", {
            get: function () {
                return this._contentPanel.BoundsLeft;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CubeePanel.prototype, "boundsLeft", {
            get: function () {
                return this.BoundsLeft.value;
            },
            set: function (value) {
                this.BoundsLeft.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CubeePanel.prototype, "BoundsTop", {
            get: function () {
                return this._contentPanel.BoundsTop;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CubeePanel.prototype, "boundsTop", {
            get: function () {
                return this.BoundsTop.value;
            },
            set: function (value) {
                this.BoundsTop.value = value;
            },
            enumerable: true,
            configurable: true
        });
        return CubeePanel;
    }());
    cubee.CubeePanel = CubeePanel;
})(cubee || (cubee = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3ViZWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy91dGlscy50cyIsIi4uL3RzL2V2ZW50cy50cyIsIi4uL3RzL3Byb3BlcnRpZXMudHMiLCIuLi90cy9zdHlsZXMudHMiLCIuLi90cy9ycGMudHMiLCIuLi90cy9jb21wb25lbnRfYmFzZS9MYXlvdXRDaGlsZHJlbi50cyIsIi4uL3RzL2NvbXBvbmVudF9iYXNlL0FDb21wb25lbnQudHMiLCIuLi90cy9jb21wb25lbnRfYmFzZS9BTGF5b3V0LnRzIiwiLi4vdHMvY29tcG9uZW50X2Jhc2UvQVVzZXJDb250cm9sLnRzIiwiLi4vdHMvY29tcG9uZW50X2Jhc2UvQVZpZXcudHMiLCIuLi90cy9sYXlvdXRzL1BhbmVsLnRzIiwiLi4vdHMvbGF5b3V0cy9IQm94LnRzIiwiLi4vdHMvbGF5b3V0cy9WQm94LnRzIiwiLi4vdHMvbGF5b3V0cy9TY3JvbGxCb3gudHMiLCIuLi90cy9jb21wb25lbnRzL0xhYmVsLnRzIiwiLi4vdHMvY29tcG9uZW50cy9CdXR0b24udHMiLCIuLi90cy9jb21wb25lbnRzL1RleHRCb3gudHMiLCIuLi90cy9jb21wb25lbnRzL1Bhc3N3b3JkQm94LnRzIiwiLi4vdHMvY29tcG9uZW50cy9UZXh0QXJlYS50cyIsIi4uL3RzL2NvbXBvbmVudHMvQ2hlY2tCb3gudHMiLCIuLi90cy9jb21wb25lbnRzL0NvbWJvQm94LnRzIiwiLi4vdHMvY29tcG9uZW50cy9QaWN0dXJlQm94LnRzIiwiLi4vdHMvcG9wdXBzLnRzIiwiLi4vdHMvY3ViZWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBVSxLQUFLLENBc0JkO0FBdEJELFdBQVUsS0FBSztJQU1YO1FBRUksaUJBQXFCLEVBQVUsRUFBVSxFQUFVO1lBQTlCLE9BQUUsR0FBRixFQUFFLENBQVE7WUFBVSxPQUFFLEdBQUYsRUFBRSxDQUFRO1FBRW5ELENBQUM7UUFFRCxzQkFBSSxzQkFBQztpQkFBTDtnQkFDSSxN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RUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUMzQyxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDOUMsQ0FBQztZQUVELElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO1lBQzVCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO1lBRTVCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxHQUFHLElBQUksRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDakQsRUFBRSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUNqRCxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ2pELEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNyRCxDQUFDO1lBRUQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJ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LElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUNqQyxDQUFDOzs7V0FIQTtRQUtMLGlCQUFDO0lBQUQsQ0FBQyxBQTdKRCxJQTZKQztJQTdKWSxnQkFBVSxhQTZKdEIsQ0FBQTtBQUVMLENBQUMsRUFqS1MsS0FBSyxLQUFMLEtBQUssUUFpS2QiLCJzb3VyY2VzQ29udGVudCI6WyJuYW1lc3BhY2UgY3ViZWUge1xuICAgIFxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVJ1bm5hYmxlIHtcbiAgICAgICAgKCk6IHZvaWQ7XG4gICAgfVxuICAgIFxuICAgIGV4cG9ydCBjbGFzcyBQb2ludDJEIHtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0cnVjdG9yIChwcml2YXRlIF94OiBudW1iZXIsIHByaXZhdGUgX3k6IG51bWJlcikge1xuICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGdldCB4KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3g7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGdldCB5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3k7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfVxuICAgIFxufVxuXG5cbiIsIm5hbWVzcGFjZSBjdWJlZSB7XG5cbiAgICBleHBvcnQgY2xhc3MgRXZlbnRBcmdzIHtcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHNlbmRlcjogT2JqZWN0KSB7IH1cbiAgICB9XG4gICAgXG4gICAgZXhwb3J0IGludGVyZmFjZSBJTGlzdGVuZXJDYWxsYmFjazxUPiB7XG4gICAgICAgIG9uQWRkZWQobGlzdGVuZXI6IElFdmVudExpc3RlbmVyPFQ+KTogdm9pZDtcbiAgICAgICAgb25SZW1vdmVkKGxpc3RlbmVyOiBJRXZlbnRMaXN0ZW5lcjxUPik6IHZvaWQ7XG4gICAgfVxuICAgIFxuICAgIGV4cG9ydCBjbGFzcyBIdG1sRXZlbnRMaXN0ZW5lckNhbGxiYWNrPFQ+IGltcGxlbWVudHMgSUxpc3RlbmVyQ2FsbGJhY2s8VD4ge1xuICAgICAgICBcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudDogSFRNTEVsZW1lbnQsIHByaXZhdGUgX2V2ZW50VHlwZTogc3RyaW5nKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgb25BZGRlZChsaXN0ZW5lcjogSUV2ZW50TGlzdGVuZXI8VD4pOiB2b2lkIHtcbiAgICAgICAgICAgICg8YW55Pmxpc3RlbmVyKS4kJG5hdGl2ZUxpc3RlbmVyID0gZnVuY3Rpb24gKGV2ZW50QXJnczogVCkge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyKGV2ZW50QXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodGhpcy5fZXZlbnRUeXBlLCAoPGFueT5saXN0ZW5lcikuJCRuYXRpdmVMaXN0ZW5lcik7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIG9uUmVtb3ZlZChsaXN0ZW5lcjogSUV2ZW50TGlzdGVuZXI8VD4pOiB2b2lkIHtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0aGlzLl9ldmVudFR5cGUsICg8YW55Pmxpc3RlbmVyKS4kJG5hdGl2ZUxpc3RlbmVyKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRXZlbnQ8VD4ge1xuXG4gICAgICAgIHByaXZhdGUgX2xpc3RlbmVyczogSUV2ZW50TGlzdGVuZXI8VD5bXSA9IFtdO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2xpc3RlbmVyQ2FsbGJhY2s6IElMaXN0ZW5lckNhbGxiYWNrPFQ+ID0gbnVsbCkge1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkTGlzdGVuZXIobGlzdGVuZXI6IElFdmVudExpc3RlbmVyPFQ+KSB7XG4gICAgICAgICAgICBpZiAobGlzdGVuZXIgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIGxpc3RlbmVyIHBhcmFtZXRlciBjYW4gbm90IGJlIG51bGwuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmhhc0xpc3RlbmVyKGxpc3RlbmVyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodGhpcy5fbGlzdGVuZXJDYWxsYmFjayAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJDYWxsYmFjay5vbkFkZGVkKGxpc3RlbmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZUxpc3RlbmVyKGxpc3RlbmVyOiBJRXZlbnRMaXN0ZW5lcjxUPikge1xuICAgICAgICAgICAgdmFyIGlkeCA9IHRoaXMuX2xpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKTtcbiAgICAgICAgICAgIGlmIChpZHggPCAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzLnNwbGljZShpZHgsIDEpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodGhpcy5fbGlzdGVuZXJDYWxsYmFjayAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJDYWxsYmFjay5vblJlbW92ZWQobGlzdGVuZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaGFzTGlzdGVuZXIobGlzdGVuZXI6IElFdmVudExpc3RlbmVyPFQ+KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpID4gLTE7XG4gICAgICAgIH1cblxuICAgICAgICBmaXJlRXZlbnQoYXJnczogVCkge1xuICAgICAgICAgICAgZm9yICh2YXIgbCBvZiB0aGlzLl9saXN0ZW5lcnMpIHtcbiAgICAgICAgICAgICAgICBsZXQgbGlzdGVuZXI6IElFdmVudExpc3RlbmVyPFQ+ID0gbDtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcihhcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgZ2V0IGxpc3RlbmVyQ2FsbGJhY2soKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbGlzdGVuZXJDYWxsYmFjaztcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgc2V0IGxpc3RlbmVyQ2FsbGJhY2sodmFsdWU6IElMaXN0ZW5lckNhbGxiYWNrPFQ+KSB7XG4gICAgICAgICAgICB0aGlzLl9saXN0ZW5lckNhbGxiYWNrID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBUaW1lciB7XG5cbiAgICAgICAgcHJpdmF0ZSB0b2tlbjogbnVtYmVyO1xuICAgICAgICBwcml2YXRlIHJlcGVhdDogYm9vbGVhbiA9IHRydWU7XG4gICAgICAgIHByaXZhdGUgYWN0aW9uOiB7ICgpOiB2b2lkIH0gPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZ1bmMoKTtcbiAgICAgICAgICAgIGlmICghdGhpcy5yZXBlYXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRva2VuID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGZ1bmM6IHsgKCk6IHZvaWQgfSkge1xuICAgICAgICAgICAgaWYgKGZ1bmMgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIGZ1bmMgcGFyYW1ldGVyIGNhbiBub3QgYmUgbnVsbC5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXJ0KGRlbGF5OiBudW1iZXIsIHJlcGVhdDogYm9vbGVhbikge1xuICAgICAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgICAgICB0aGlzLnJlcGVhdCA9IHJlcGVhdDtcbiAgICAgICAgICAgIGlmICh0aGlzLnJlcGVhdCkge1xuICAgICAgICAgICAgICAgIHRoaXMudG9rZW4gPSBzZXRJbnRlcnZhbCh0aGlzLmZ1bmMsIGRlbGF5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b2tlbiA9IHNldFRpbWVvdXQodGhpcy5mdW5jLCBkZWxheSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMudG9rZW4gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50b2tlbik7XG4gICAgICAgICAgICAgICAgdGhpcy50b2tlbiA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgU3RhcnRlZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRva2VuICE9IG51bGw7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSUV2ZW50TGlzdGVuZXI8VD4ge1xuICAgICAgICAoYXJnczogVCk6IHZvaWQ7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEV2ZW50UXVldWUge1xuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBFdmVudFF1ZXVlID0gbnVsbDtcblxuICAgICAgICBzdGF0aWMgZ2V0IEluc3RhbmNlKCkge1xuICAgICAgICAgICAgaWYgKEV2ZW50UXVldWUuaW5zdGFuY2UgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIEV2ZW50UXVldWUuaW5zdGFuY2UgPSBuZXcgRXZlbnRRdWV1ZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gRXZlbnRRdWV1ZS5pbnN0YW5jZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgcXVldWU6IHsgKCk6IHZvaWQgfVtdID0gW107XG4gICAgICAgIHByaXZhdGUgdGltZXI6IFRpbWVyID0gbnVsbDtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHRoaXMudGltZXIgPSBuZXcgVGltZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBzaXplID0gdGhpcy5xdWV1ZS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRhc2s6IHsgKCk6IHZvaWQgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhc2sgPSB0aGlzLnF1ZXVlWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWV1ZS5zcGxpY2UoMCwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFzayAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFzaygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNpemUgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGVyZSB3ZXJlIHNvbWUgdGFzayB0aGFuIHdlIG5lZWQgdG8gY2hlY2sgZmFzdCBpZiBtb3JlIHRhc2tzIGFyZSByZWNlaXZlZFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50aW1lci5zdGFydCgwLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGVyZSBpc24ndCBhbnkgdGFzayB0aGFuIHdlIGNhbiByZWxheCBhIGJpdFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50aW1lci5zdGFydCg1MCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy50aW1lci5zdGFydCgxMCwgZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW52b2tlTGF0ZXIodGFzazogeyAoKTogdm9pZCB9KSB7XG4gICAgICAgICAgICBpZiAodGFzayA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgdGFzayBjYW4gbm90IGJlIG51bGwuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnF1ZXVlLnB1c2godGFzayk7XG4gICAgICAgIH1cblxuICAgICAgICBpbnZva2VQcmlvcih0YXNrOiB7ICgpOiB2b2lkIH0pIHtcbiAgICAgICAgICAgIGlmICh0YXNrID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoZSB0YXNrIGNhbiBub3QgYmUgbnVsbC5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucXVldWUuc3BsaWNlKDAsIDAsIHRhc2spO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgUnVuT25jZSB7XG5cbiAgICAgICAgcHJpdmF0ZSBzY2hlZHVsZWQgPSBmYWxzZTtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGZ1bmM6IElSdW5uYWJsZSkge1xuICAgICAgICAgICAgaWYgKGZ1bmMgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIGZ1bmMgcGFyYW1ldGVyIGNhbiBub3QgYmUgbnVsbC5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJ1bigpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNjaGVkdWxlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIEV2ZW50UXVldWUuSW5zdGFuY2UuaW52b2tlTGF0ZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5mdW5jKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBQYXJlbnRDaGFuZ2VkRXZlbnRBcmdzIGV4dGVuZHMgRXZlbnRBcmdzIHtcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5ld1BhcmVudDogQUxheW91dCxcbiAgICAgICAgICAgIHB1YmxpYyBzZW5kZXI6IE9iamVjdCkge1xuICAgICAgICAgICAgc3VwZXIoc2VuZGVyKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJldmVudHMudHNcIi8+XG5cbm5hbWVzcGFjZSBjdWJlZSB7XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIElDaGFuZ2VMaXN0ZW5lciB7XG4gICAgICAgIChzZW5kZXI/OiBPYmplY3QpOiB2b2lkO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSU9ic2VydmFibGUge1xuICAgICAgICBhZGRDaGFuZ2VMaXN0ZW5lcihsaXN0ZW5lcjogSUNoYW5nZUxpc3RlbmVyKTogdm9pZDtcbiAgICAgICAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIobGlzdGVuZXI6IElDaGFuZ2VMaXN0ZW5lcik6IHZvaWQ7XG4gICAgICAgIGhhc0NoYW5nZUxpc3RlbmVyKGxpc3RlbmVyOiBJQ2hhbmdlTGlzdGVuZXIpOiB2b2lkO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSUJpbmRhYmxlPFQ+IHtcbiAgICAgICAgYmluZChzb3VyY2U6IFQpOiB2b2lkO1xuICAgICAgICB1bmJpbmQoKTogdm9pZDtcbiAgICAgICAgaXNCb3VuZCgpOiBib29sZWFuO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSUFuaW1hdGVhYmxlPFQ+IHtcbiAgICAgICAgYW5pbWF0ZShwb3M6IG51bWJlciwgc3RhcnRWYWx1ZTogVCwgZW5kVmFsdWU6IFQpOiBUO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVByb3BlcnR5PFQ+IGV4dGVuZHMgSU9ic2VydmFibGUge1xuICAgICAgICBnZXRPYmplY3RWYWx1ZSgpOiBPYmplY3Q7XG4gICAgICAgIGludmFsaWRhdGUoKTogdm9pZDtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIElWYWxpZGF0b3I8VD4ge1xuICAgICAgICB2YWxpZGF0ZSh2YWx1ZTogVCk6IFQ7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFByb3BlcnR5PFQ+IGltcGxlbWVudHMgSVByb3BlcnR5PFQ+LCBJQW5pbWF0ZWFibGU8VD4sIElCaW5kYWJsZTxJUHJvcGVydHk8VD4+IHtcblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfbmV4dElkID0gMDtcblxuICAgICAgICBwcml2YXRlIF9jaGFuZ2VMaXN0ZW5lcnM6IElDaGFuZ2VMaXN0ZW5lcltdID0gW107XG5cbiAgICAgICAgcHJpdmF0ZSBfdmFsaWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcHJpdmF0ZSBfYmluZGluZ1NvdXJjZTogSVByb3BlcnR5PFQ+O1xuXG4gICAgICAgIHByaXZhdGUgX3JlYWRvbmx5QmluZDogSVByb3BlcnR5PFQ+O1xuICAgICAgICBwcml2YXRlIF9iaWRpcmVjdGlvbmFsQmluZFByb3BlcnR5OiBQcm9wZXJ0eTxUPjtcbiAgICAgICAgcHJpdmF0ZSBfYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyVGhpczogSUNoYW5nZUxpc3RlbmVyO1xuICAgICAgICBwcml2YXRlIF9iaWRpcmVjdGlvbmFsQ2hhbmdlTGlzdGVuZXJPdGhlcjogSUNoYW5nZUxpc3RlbmVyO1xuICAgICAgICBwcml2YXRlIF9pZDogc3RyaW5nID0gXCJwXCIgKyBQcm9wZXJ0eS5fbmV4dElkKys7XG4gICAgICAgIHByaXZhdGUgYmluZExpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmludmFsaWRhdGVJZk5lZWRlZCgpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgY29uc3RydWN0b3IoXG4gICAgICAgICAgICBwcml2YXRlIF92YWx1ZT86IFQsXG4gICAgICAgICAgICBwcml2YXRlIF9udWxsYWJsZTogYm9vbGVhbiA9IHRydWUsXG4gICAgICAgICAgICBwcml2YXRlIF9yZWFkb25seTogYm9vbGVhbiA9IGZhbHNlLFxuICAgICAgICAgICAgcHJpdmF0ZSBfdmFsaWRhdG9yOiBJVmFsaWRhdG9yPFQ+ID0gbnVsbCkge1xuXG4gICAgICAgICAgICBpZiAoX3ZhbHVlID09IG51bGwgJiYgX251bGxhYmxlID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJBIG51bGxhYmxlIHByb3BlcnR5IGNhbiBub3QgYmUgbnVsbC5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX3ZhbHVlICE9IG51bGwgJiYgX3ZhbGlkYXRvciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSBfdmFsaWRhdG9yLnZhbGlkYXRlKF92YWx1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGlkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lkO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHZhbGlkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbGlkO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHZhbHVlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBzZXQgdmFsdWUobmV3VmFsdWU6IFQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0KG5ld1ZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBudWxsYWJsZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9udWxsYWJsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCByZWFkb25seSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZWFkb25seTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXRSZWFkb25seUJpbmQocmVhZG9ubHlCaW5kOiBJUHJvcGVydHk8VD4pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9yZWFkb25seUJpbmQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIHJlYWRvbmx5IGJpbmQgaXMgYWxyZWFkeSBpbml0aWFsaXplZC5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3JlYWRvbmx5QmluZCA9IHJlYWRvbmx5QmluZDtcbiAgICAgICAgICAgIGlmIChyZWFkb25seUJpbmQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJlYWRvbmx5QmluZC5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLmJpbmRMaXN0ZW5lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmludmFsaWRhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgZ2V0KCk6IFQge1xuICAgICAgICAgICAgdGhpcy5fdmFsaWQgPSB0cnVlO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fYmluZGluZ1NvdXJjZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3ZhbGlkYXRvciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl92YWxpZGF0b3IudmFsaWRhdGUoPFQ+dGhpcy5fYmluZGluZ1NvdXJjZS5nZXRPYmplY3RWYWx1ZSgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIDxUPnRoaXMuX2JpbmRpbmdTb3VyY2UuZ2V0T2JqZWN0VmFsdWUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX3JlYWRvbmx5QmluZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3ZhbGlkYXRvciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl92YWxpZGF0b3IudmFsaWRhdGUoPFQ+dGhpcy5fcmVhZG9ubHlCaW5kLmdldE9iamVjdFZhbHVlKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gPFQ+dGhpcy5fcmVhZG9ubHlCaW5kLmdldE9iamVjdFZhbHVlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc2V0KG5ld1ZhbHVlOiBUKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fcmVhZG9ubHkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIkNhbiBub3QgY2hhbmdlIHRoZSB2YWx1ZSBvZiBhIHJlYWRvbmx5IHByb3BlcnR5LlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5pc0JvdW5kKCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIkNhbiBub3QgY2hhbmdlIHRoZSB2YWx1ZSBvZiBhIGJvdW5kIHByb3BlcnR5LlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXRoaXMuX251bGxhYmxlICYmIG5ld1ZhbHVlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIkNhbiBub3Qgc2V0IHRoZSB2YWx1ZSB0byBudWxsIG9mIGEgbm9uIG51bGxhYmxlIHByb3BlcnR5LlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fdmFsaWRhdG9yICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IHRoaXMuX3ZhbGlkYXRvci52YWxpZGF0ZShuZXdWYWx1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl92YWx1ZSA9PSBuZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX3ZhbHVlICE9IG51bGwgJiYgdGhpcy5fdmFsdWUgPT0gbmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW52YWxpZGF0ZSgpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmZpcmVDaGFuZ2VMaXN0ZW5lcnMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGludmFsaWRhdGVJZk5lZWRlZCgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fdmFsaWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmludmFsaWRhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpcmVDaGFuZ2VMaXN0ZW5lcnMoKSB7XG4gICAgICAgICAgICB0aGlzLl9jaGFuZ2VMaXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXIpID0+IHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcih0aGlzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0T2JqZWN0VmFsdWUoKTogT2JqZWN0IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkQ2hhbmdlTGlzdGVuZXIobGlzdGVuZXI6IElDaGFuZ2VMaXN0ZW5lcikge1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVyID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoZSBsaXN0ZW5lciBwYXJhbWV0ZXIgY2FuIG5vdCBiZSBudWxsLlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNDaGFuZ2VMaXN0ZW5lcihsaXN0ZW5lcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2NoYW5nZUxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcblxuICAgICAgICAgICAgLy8gdmFsaWRhdGUgdGhlIGNvbXBvbmVudFxuICAgICAgICAgICAgdGhpcy5nZXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZUNoYW5nZUxpc3RlbmVyKGxpc3RlbmVyOiBJQ2hhbmdlTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHZhciBpZHggPSB0aGlzLl9jaGFuZ2VMaXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcik7XG4gICAgICAgICAgICBpZiAoaWR4IDwgMCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2NoYW5nZUxpc3RlbmVycy5zcGxpY2UoaWR4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGhhc0NoYW5nZUxpc3RlbmVyKGxpc3RlbmVyOiBJQ2hhbmdlTGlzdGVuZXIpOiBib29sZWFuIHtcbiAgICAgICAgICAgIHRoaXMuX2NoYW5nZUxpc3RlbmVycy5mb3JFYWNoKChsKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGwgPT0gbGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBhbmltYXRlKHBvczogbnVtYmVyLCBzdGFydFZhbHVlOiBULCBlbmRWYWx1ZTogVCkge1xuICAgICAgICAgICAgaWYgKHBvcyA8IDAuNSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdGFydFZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZW5kVmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBiaW5kKHNvdXJjZTogSVByb3BlcnR5PFQ+KSB7XG4gICAgICAgICAgICBpZiAoc291cmNlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoZSBzb3VyY2UgY2FuIG5vdCBiZSBudWxsLlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5pc0JvdW5kKCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoaXMgcHJvcGVydHkgaXMgYWxyZWFkeSBib3VuZC5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX3JlYWRvbmx5KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJDYW4ndCBiaW5kIGEgcmVhZG9ubHkgcHJvcGVydHkuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2JpbmRpbmdTb3VyY2UgPSBzb3VyY2U7XG4gICAgICAgICAgICB0aGlzLl9iaW5kaW5nU291cmNlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuYmluZExpc3RlbmVyKTtcbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgYmlkaXJlY3Rpb25hbEJpbmQob3RoZXI6IFByb3BlcnR5PFQ+KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0JvdW5kKCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoaXMgcHJvcGVydHkgaXMgYWxyZWFkeSBib3VuZC5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX3JlYWRvbmx5KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJDYW4ndCBiaW5kIGEgcmVhZG9ubHkgcHJvcGVydHkuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvdGhlciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgb3RoZXIgcGFyYW1ldGVyIGNhbiBub3QgYmUgbnVsbC5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG90aGVyLl9yZWFkb25seSkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiQ2FuIG5vdCBiaW5kIGEgcHJvcGVydHkgYmlkaXJlY3Rpb25hbGx5IHRvIGEgcmVhZG9ubHkgcHJvcGVydHkuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvdGhlciA9PSB0aGlzKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJDYW4gbm90IGJpbmQgYSBwcm9wZXJ0eSBiaWRpcmVjdGlvbmFsbHkgZm9yIHRoZW1zZWxmLlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3RoZXIuaXNCb3VuZCgpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgdGFyZ2V0IHByb3BlcnR5IGlzIGFscmVhZHkgYm91bmQuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2JpZGlyZWN0aW9uYWxCaW5kUHJvcGVydHkgPSBvdGhlcjtcbiAgICAgICAgICAgIHRoaXMuX2JpZGlyZWN0aW9uYWxDaGFuZ2VMaXN0ZW5lck90aGVyID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0KHRoaXMuX2JpZGlyZWN0aW9uYWxCaW5kUHJvcGVydHkuZ2V0KCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3RoZXIuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyT3RoZXIpO1xuICAgICAgICAgICAgdGhpcy5fYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyVGhpcyA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9iaWRpcmVjdGlvbmFsQmluZFByb3BlcnR5LnNldCh0aGlzLmdldCgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyVGhpcyk7XG5cbiAgICAgICAgICAgIG90aGVyLl9iaWRpcmVjdGlvbmFsQmluZFByb3BlcnR5ID0gdGhpcztcbiAgICAgICAgICAgIG90aGVyLl9iaWRpcmVjdGlvbmFsQ2hhbmdlTGlzdGVuZXJPdGhlciA9IHRoaXMuX2JpZGlyZWN0aW9uYWxDaGFuZ2VMaXN0ZW5lclRoaXM7XG4gICAgICAgICAgICBvdGhlci5fYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyVGhpcyA9IHRoaXMuX2JpZGlyZWN0aW9uYWxDaGFuZ2VMaXN0ZW5lck90aGVyO1xuXG4gICAgICAgIH1cblxuICAgICAgICB1bmJpbmQoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fYmluZGluZ1NvdXJjZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmluZGluZ1NvdXJjZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLmJpbmRMaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmluZGluZ1NvdXJjZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNCaWRpcmVjdGlvbmFsQm91bmQoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyVGhpcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmlkaXJlY3Rpb25hbEJpbmRQcm9wZXJ0eS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9iaWRpcmVjdGlvbmFsQ2hhbmdlTGlzdGVuZXJPdGhlcik7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmlkaXJlY3Rpb25hbEJpbmRQcm9wZXJ0eS5fYmlkaXJlY3Rpb25hbEJpbmRQcm9wZXJ0eSA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmlkaXJlY3Rpb25hbEJpbmRQcm9wZXJ0eS5fYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyT3RoZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuX2JpZGlyZWN0aW9uYWxCaW5kUHJvcGVydHkuX2JpZGlyZWN0aW9uYWxDaGFuZ2VMaXN0ZW5lclRoaXMgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuX2JpZGlyZWN0aW9uYWxCaW5kUHJvcGVydHkgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuX2JpZGlyZWN0aW9uYWxDaGFuZ2VMaXN0ZW5lck90aGVyID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLl9iaWRpcmVjdGlvbmFsQ2hhbmdlTGlzdGVuZXJUaGlzID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHVuYmluZFRhcmdldHMoKSB7XG4gICAgICAgICAgICAvLyBUT0RPIG51bGwgYmluZGluZ1NvdXJjZSBvZiB0YXJnZXRzXG4gICAgICAgICAgICB0aGlzLl9jaGFuZ2VMaXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlzQm91bmQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYmluZGluZ1NvdXJjZSAhPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaXNCaWRpcmVjdGlvbmFsQm91bmQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYmlkaXJlY3Rpb25hbEJpbmRQcm9wZXJ0eSAhPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY3JlYXRlUHJvcGVydHlMaW5lKGtleUZyYW1lczogS2V5RnJhbWU8VD5bXSk6IFByb3BlcnR5TGluZTxUPiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb3BlcnR5TGluZTxUPihrZXlGcmFtZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVzdHJveSgpIHtcbiAgICAgICAgICAgIHRoaXMudW5iaW5kKCk7XG4gICAgICAgICAgICB0aGlzLl9jaGFuZ2VMaXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuYmluZExpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEV4cHJlc3Npb248VD4gaW1wbGVtZW50cyBJUHJvcGVydHk8VD4sIElPYnNlcnZhYmxlIHtcblxuICAgICAgICBwcml2YXRlIF9ub3RpZnlMaXN0ZW5lcnNPbmNlID0gbmV3IFJ1bk9uY2UoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5maXJlQ2hhbmdlTGlzdGVuZXJzKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHByaXZhdGUgX2JpbmRpbmdTb3VyY2VzOiBJUHJvcGVydHk8YW55PltdID0gW107XG4gICAgICAgIHByaXZhdGUgX2JpbmRpbmdMaXN0ZW5lcjogSUNoYW5nZUxpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlSWZOZWVkZWQoKTtcbiAgICAgICAgfTtcbiAgICAgICAgcHJpdmF0ZSBfY2hhbmdlTGlzdGVuZXJzOiBJQ2hhbmdlTGlzdGVuZXJbXSA9IFtdO1xuXG4gICAgICAgIHByaXZhdGUgX2Z1bmM6IHsgKCk6IFQgfTtcbiAgICAgICAgcHJpdmF0ZSBfdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgcHJpdmF0ZSBfdmFsdWU6IFQgPSBudWxsO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGZ1bmM6IHsgKCk6IFQgfSwgLi4uYWN0aXZhdG9yczogSVByb3BlcnR5PGFueT5bXSkge1xuICAgICAgICAgICAgaWYgKGZ1bmMgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhlICdmdW5jJyBwYXJhbWV0ZXIgY2FuIG5vdCBiZSBudWxsXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9mdW5jID0gZnVuYztcbiAgICAgICAgICAgIHRoaXMuYmluZC5hcHBseSh0aGlzLCBhY3RpdmF0b3JzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB2YWx1ZSgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fdmFsaWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZSA9IHRoaXMuX2Z1bmMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl92YWxpZCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZENoYW5nZUxpc3RlbmVyKGxpc3RlbmVyOiBJQ2hhbmdlTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgbGlzdGVuZXIgcGFyYW1ldGVyIGNhbiBub3QgYmUgbnVsbC5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzQ2hhbmdlTGlzdGVuZXIobGlzdGVuZXIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9jaGFuZ2VMaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG5cbiAgICAgICAgICAgIGxldCB4ID0gdGhpcy52YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZUNoYW5nZUxpc3RlbmVyKGxpc3RlbmVyOiBJQ2hhbmdlTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuX2NoYW5nZUxpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKTtcbiAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2hhbmdlTGlzdGVuZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9jaGFuZ2VMaXN0ZW5lcnMubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2JpbmRpbmdTb3VyY2VzLmZvckVhY2goKHByb3ApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcC5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9iaW5kaW5nTGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmludmFsaWRhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGhhc0NoYW5nZUxpc3RlbmVyKGxpc3RlbmVyOiBJQ2hhbmdlTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGFuZ2VMaXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcikgPiAtMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldE9iamVjdFZhbHVlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBiaW5kKC4uLnByb3BlcnRpZXM6IElQcm9wZXJ0eTxhbnk+W10pIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMuZm9yRWFjaCgocHJvcCkgPT4ge1xuICAgICAgICAgICAgICAgIHByb3AuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fYmluZGluZ0xpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9iaW5kaW5nU291cmNlcy5wdXNoKHByb3ApO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdW5iaW5kQWxsKCkge1xuICAgICAgICAgICAgdGhpcy5fYmluZGluZ1NvdXJjZXMuZm9yRWFjaCgocHJvcCkgPT4ge1xuICAgICAgICAgICAgICAgIHByb3AucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fYmluZGluZ0xpc3RlbmVyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fYmluZGluZ1NvdXJjZXMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdW5iaW5kKHByb3BlcnR5OiBJUHJvcGVydHk8YW55Pikge1xuICAgICAgICAgICAgcHJvcGVydHkucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fYmluZGluZ0xpc3RlbmVyKTtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuX2JpbmRpbmdTb3VyY2VzLmluZGV4T2YocHJvcGVydHkpO1xuICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9iaW5kaW5nU291cmNlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbnZhbGlkYXRlKCkge1xuICAgICAgICAgICAgdGhpcy5fdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuX25vdGlmeUxpc3RlbmVyc09uY2UucnVuKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbnZhbGlkYXRlSWZOZWVkZWQoKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX3ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGZpcmVDaGFuZ2VMaXN0ZW5lcnMoKSB7XG4gICAgICAgICAgICB0aGlzLl9jaGFuZ2VMaXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXI6IElDaGFuZ2VMaXN0ZW5lcikgPT4ge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyKHRoaXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBLZXlGcmFtZTxUPiB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoXG4gICAgICAgICAgICBwcml2YXRlIF90aW1lOiBudW1iZXIsXG4gICAgICAgICAgICBwcml2YXRlIF9wcm9wZXJ0eTogUHJvcGVydHk8VD4sXG4gICAgICAgICAgICBwcml2YXRlIF9lbmRWYWx1ZTogVCxcbiAgICAgICAgICAgIHByaXZhdGUgX2tleWZyYW1lUmVhY2hlZExpc3RlbmVyOiB7ICgpOiB2b2lkIH0gPSBudWxsLFxuICAgICAgICAgICAgcHJpdmF0ZSBfaW50ZXJwb2xhdG9yOiBJSW50ZXJwb2xhdG9yID0gSW50ZXJwb2xhdG9ycy5MaW5lYXIpIHtcblxuICAgICAgICAgICAgaWYgKF90aW1lIDwgMCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIHRpbWUgcGFyYW1ldGVyIGNhbiBub3QgYmUgc21hbGxlciB0aGFuIHplcm8uXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfcHJvcGVydHkgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIHByb3BlcnR5IHBhcmFtZXRlciBjYW4gbm90IGJlIG51bGwuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoX3Byb3BlcnR5LnJlYWRvbmx5KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJDYW4ndCBhbmltYXRlIGEgcmVhZC1vbmx5IHByb3BlcnR5LlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoX2VuZFZhbHVlID09IG51bGwgJiYgIV9wcm9wZXJ0eS5udWxsYWJsZSkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiQ2FuJ3Qgc2V0IG51bGwgdmFsdWUgdG8gYSBub24gbnVsbGFibGUgcHJvcGVydHkuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfaW50ZXJwb2xhdG9yID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pbnRlcnBvbGF0b3IgPSBJbnRlcnBvbGF0b3JzLkxpbmVhcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB0aW1lKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RpbWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgcHJvcGVydHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcHJvcGVydHlcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBlbmRWYWx1ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9lbmRWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBpbnRlcnBvbGF0b3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faW50ZXJwb2xhdG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGtleUZyYW1lUmVhY2hlZExpc3RlbmVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2tleWZyYW1lUmVhY2hlZExpc3RlbmVyO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgUHJvcGVydHlMaW5lPFQ+IHtcblxuICAgICAgICBwcml2YXRlIF9wcm9wZXJ0eTogUHJvcGVydHk8VD47XG4gICAgICAgIHByaXZhdGUgX3N0YXJ0VGltZTogbnVtYmVyID0gLTE7XG4gICAgICAgIHByaXZhdGUgX2xhc3RSdW5UaW1lOiBudW1iZXIgPSAtMTtcbiAgICAgICAgcHJpdmF0ZSBfcHJldmlvdXNGcmFtZTogS2V5RnJhbWU8VD4gPSBudWxsO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2tleUZyYW1lczogS2V5RnJhbWU8VD5bXSkge1xuICAgICAgICAgICAgdGhpcy5fcHJvcGVydHkgPSBfa2V5RnJhbWVzWzBdLnByb3BlcnR5O1xuICAgICAgICAgICAgdmFyIGZpcnN0RnJhbWU6IEtleUZyYW1lPFQ+ID0gX2tleUZyYW1lc1swXTtcbiAgICAgICAgICAgIGlmIChmaXJzdEZyYW1lLnRpbWUgPiAwKSB7XG4gICAgICAgICAgICAgICAgX2tleUZyYW1lcy5zcGxpY2UoMCwgMCwgbmV3IEtleUZyYW1lKDAsIGZpcnN0RnJhbWUucHJvcGVydHksIGZpcnN0RnJhbWUucHJvcGVydHkudmFsdWUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBzdGFydFRpbWUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhcnRUaW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0IHN0YXJ0VGltZShzdGFydFRpbWU6IG51bWJlcikge1xuICAgICAgICAgICAgdGhpcy5fc3RhcnRUaW1lID0gc3RhcnRUaW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgYW5pbWF0ZSgpIHtcbiAgICAgICAgICAgIHZhciBhY3RUaW1lID0gRGF0ZS5ub3coKTtcblxuICAgICAgICAgICAgaWYgKGFjdFRpbWUgPT0gdGhpcy5fc3RhcnRUaW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbmV4dEZyYW1lOiBLZXlGcmFtZTxUPiA9IG51bGw7XG4gICAgICAgICAgICB2YXIgYWN0RnJhbWU6IEtleUZyYW1lPFQ+ID0gbnVsbDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fa2V5RnJhbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZyYW1lID0gdGhpcy5fa2V5RnJhbWVzW2ldO1xuICAgICAgICAgICAgICAgIHZhciBmcjogS2V5RnJhbWU8VD4gPSBmcmFtZTtcbiAgICAgICAgICAgICAgICBpZiAoYWN0VGltZSA+PSB0aGlzLl9zdGFydFRpbWUgKyBmci50aW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGFjdEZyYW1lID0gZnJhbWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dEZyYW1lID0gZnJhbWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zdGFydFRpbWUgKyBmci50aW1lID4gdGhpcy5fbGFzdFJ1blRpbWUgJiYgdGhpcy5fc3RhcnRUaW1lICsgZnIudGltZSA8PSBhY3RUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmci5rZXlGcmFtZVJlYWNoZWRMaXN0ZW5lciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmci5rZXlGcmFtZVJlYWNoZWRMaXN0ZW5lcigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYWN0RnJhbWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmIChuZXh0RnJhbWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcG9zID0gKChhY3RUaW1lIC0gdGhpcy5fc3RhcnRUaW1lIC0gYWN0RnJhbWUudGltZSkpIC8gKG5leHRGcmFtZS50aW1lIC0gYWN0RnJhbWUudGltZSk7XG4gICAgICAgICAgICAgICAgICAgIGFjdEZyYW1lLnByb3BlcnR5LnZhbHVlID0gYWN0RnJhbWUucHJvcGVydHkuYW5pbWF0ZShwb3MsIGFjdEZyYW1lLmVuZFZhbHVlLCBuZXh0RnJhbWUuZW5kVmFsdWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFjdEZyYW1lLnByb3BlcnR5LnZhbHVlID0gYWN0RnJhbWUuZW5kVmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9sYXN0UnVuVGltZSA9IGFjdFRpbWU7XG5cbiAgICAgICAgICAgIHJldHVybiBhY3RUaW1lID49IHRoaXMuX3N0YXJ0VGltZSArIHRoaXMuX2tleUZyYW1lc1t0aGlzLl9rZXlGcmFtZXMubGVuZ3RoIC0gMV0udGltZTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIElJbnRlcnBvbGF0b3Ige1xuICAgICAgICAodmFsdWU6IG51bWJlcik6IG51bWJlcjtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgSW50ZXJwb2xhdG9ycyB7XG4gICAgICAgIHN0YXRpYyBnZXQgTGluZWFyKCk6IElJbnRlcnBvbGF0b3Ige1xuICAgICAgICAgICAgcmV0dXJuICh2YWx1ZTogbnVtYmVyKTogbnVtYmVyID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnQgYWJzdHJhY3QgY2xhc3MgQUFuaW1hdG9yIHtcblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBhbmltYXRvcnM6IEFBbmltYXRvcltdID0gW107XG4gICAgICAgIHByaXZhdGUgc3RhdGljIEFOSU1BVE9SX1RBU0sgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBBQW5pbWF0b3IuYW5pbWF0ZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHByaXZhdGUgc3RhcnRlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgICAgIHN0YXRpYyBhbmltYXRlKCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IEFBbmltYXRvci5hbmltYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICBpZiAoQUFuaW1hdG9yLmFuaW1hdG9ycy5sZW5ndGggPD0gaSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGFuaW1hdG9yOiBBQW5pbWF0b3IgPSBBQW5pbWF0b3IuYW5pbWF0b3JzW2ldO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdG9yLm9uQW5pbWF0ZSgpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3IENvbnNvbGUoKS5lcnJvcih0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChBQW5pbWF0b3IuYW5pbWF0b3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBFdmVudFF1ZXVlLkluc3RhbmNlLmludm9rZUxhdGVyKEFBbmltYXRvci5BTklNQVRPUl9UQVNLKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXJ0KCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhcnRlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgQUFuaW1hdG9yLmFuaW1hdG9ycy5wdXNoKHRoaXMpO1xuICAgICAgICAgICAgaWYgKEFBbmltYXRvci5hbmltYXRvcnMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICBFdmVudFF1ZXVlLkluc3RhbmNlLmludm9rZUxhdGVyKEFBbmltYXRvci5BTklNQVRPUl9UQVNLKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc3RhcnRlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXJ0ZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICB2YXIgaWR4ID0gQUFuaW1hdG9yLmFuaW1hdG9ycy5pbmRleE9mKHRoaXMpO1xuICAgICAgICAgICAgQUFuaW1hdG9yLmFuaW1hdG9ycy5zcGxpY2UoaWR4LCAxKVxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFN0YXJ0ZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdGFydGVkO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFN0b3BwZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gIXRoaXMuc3RhcnRlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBhYnN0cmFjdCBvbkFuaW1hdGUoKTogdm9pZDtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgVGltZWxpbmUgZXh0ZW5kcyBBQW5pbWF0b3Ige1xuXG5cbiAgICAgICAgcHJpdmF0ZSBwcm9wZXJ0eUxpbmVzOiBQcm9wZXJ0eUxpbmU8YW55PltdID0gW107XG4gICAgICAgIHByaXZhdGUgcmVwZWF0Q291bnQgPSAwO1xuICAgICAgICBwcml2YXRlIGZpbmlzaGVkRXZlbnQ6IEV2ZW50PFRpbWVsaW5lRmluaXNoZWRFdmVudEFyZ3M+ID0gbmV3IEV2ZW50PFRpbWVsaW5lRmluaXNoZWRFdmVudEFyZ3M+KCk7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBrZXlGcmFtZXM6IEtleUZyYW1lPGFueT5bXSkge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNyZWF0ZVByb3BlcnR5TGluZXMoKSB7XG4gICAgICAgICAgICB2YXIgcGxNYXA6IHsgW2tleTogc3RyaW5nXTogS2V5RnJhbWU8YW55PltdIH0gPSB7fTtcbiAgICAgICAgICAgIHZhciBrZXlzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmtleUZyYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBrZXlGcmFtZSA9IHRoaXMua2V5RnJhbWVzW2ldO1xuICAgICAgICAgICAgICAgIGxldCBrZjogS2V5RnJhbWU8YW55PiA9IGtleUZyYW1lO1xuICAgICAgICAgICAgICAgIGxldCBwcm9wZXJ0eUxpbmUgPSBwbE1hcFtrZi5wcm9wZXJ0eS5pZF07XG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5TGluZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5TGluZSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBwbE1hcFtrZi5wcm9wZXJ0eS5pZF0gPSBwcm9wZXJ0eUxpbmU7XG4gICAgICAgICAgICAgICAgICAgIGtleXMucHVzaChrZi5wcm9wZXJ0eS5pZClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5TGluZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eUxpbmVbcHJvcGVydHlMaW5lLmxlbmd0aCAtIDFdLnRpbWUgPj0ga2YudGltZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUga2V5ZnJhbWVzIG11c3QgYmUgaW4gYXNjZW5kaW5nIHRpbWUgb3JkZXIgcGVyIHByb3BlcnR5LlwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHByb3BlcnR5TGluZS5wdXNoKGtleUZyYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGtleXMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHByb3BlcnR5TGluZTogUHJvcGVydHlMaW5lPGFueT4gPSBwbE1hcFtrZXldWzBdLnByb3BlcnR5LmNyZWF0ZVByb3BlcnR5TGluZShwbE1hcFtrZXldKTtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnR5TGluZXMucHVzaChwcm9wZXJ0eUxpbmUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGFydChyZXBlYXRDb3VudDogbnVtYmVyID0gMCkge1xuICAgICAgICAgICAgaWYgKHJlcGVhdENvdW50ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXBlYXRDb3VudCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXBlYXRDb3VudCA9IHJlcGVhdENvdW50IHwgMDtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUHJvcGVydHlMaW5lcygpO1xuICAgICAgICAgICAgdGhpcy5yZXBlYXRDb3VudCA9IHJlcGVhdENvdW50O1xuICAgICAgICAgICAgdmFyIHN0YXJ0VGltZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgICB0aGlzLnByb3BlcnR5TGluZXMuZm9yRWFjaCgocHJvcGVydHlMaW5lKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHBsOiBQcm9wZXJ0eUxpbmU8YW55PiA9IHByb3BlcnR5TGluZTtcbiAgICAgICAgICAgICAgICBwbC5zdGFydFRpbWUgPSBzdGFydFRpbWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLlN0YXJ0ZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdXBlci5zdG9wKCk7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaGVkRXZlbnQuZmlyZUV2ZW50KG5ldyBUaW1lbGluZUZpbmlzaGVkRXZlbnRBcmdzKHRydWUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9uQW5pbWF0ZSgpIHtcbiAgICAgICAgICAgIHZhciBmaW5pc2hlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnByb3BlcnR5TGluZXMuZm9yRWFjaCgocHJvcGVydHlMaW5lKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHBsOiBQcm9wZXJ0eUxpbmU8YW55PiA9IHByb3BlcnR5TGluZTtcbiAgICAgICAgICAgICAgICBmaW5pc2hlZCA9IGZpbmlzaGVkICYmIHBsLmFuaW1hdGUoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoZmluaXNoZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yZXBlYXRDb3VudCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN0YXJ0VGltZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydHlMaW5lcy5mb3JFYWNoKChwcm9wZXJ0eUxpbmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwbDogUHJvcGVydHlMaW5lPGFueT4gPSBwcm9wZXJ0eUxpbmU7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbC5zdGFydFRpbWUgPSBzdGFydFRpbWU7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVwZWF0Q291bnQtLTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucmVwZWF0Q291bnQgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHN0YXJ0VGltZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnR5TGluZXMuZm9yRWFjaCgocHJvcGVydHlMaW5lKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBsOiBQcm9wZXJ0eUxpbmU8YW55PiA9IHByb3BlcnR5TGluZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbC5zdGFydFRpbWUgPSBzdGFydFRpbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1cGVyLnN0b3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmluaXNoZWRFdmVudC5maXJlRXZlbnQobmV3IFRpbWVsaW5lRmluaXNoZWRFdmVudEFyZ3MoZmFsc2UpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG9uRmluaXNoZWRFdmVudCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbmlzaGVkRXZlbnQ7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBUaW1lbGluZUZpbmlzaGVkRXZlbnRBcmdzIHtcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBzdG9wcGVkOiBib29sZWFuID0gZmFsc2UpIHtcblxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFN0b3BwZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdG9wcGVkO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIE51bWJlclByb3BlcnR5IGV4dGVuZHMgUHJvcGVydHk8bnVtYmVyPiB7XG5cbiAgICAgICAgYW5pbWF0ZShwb3M6IG51bWJlciwgc3RhcnRWYWx1ZTogbnVtYmVyLCBlbmRWYWx1ZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgICAgIHJldHVybiBzdGFydFZhbHVlICsgKChlbmRWYWx1ZSAtIHN0YXJ0VmFsdWUpICogcG9zKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFN0cmluZ1Byb3BlcnR5IGV4dGVuZHMgUHJvcGVydHk8c3RyaW5nPiB7XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgUGFkZGluZ1Byb3BlcnR5IGV4dGVuZHMgUHJvcGVydHk8UGFkZGluZz4ge1xuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEJvcmRlclByb3BlcnR5IGV4dGVuZHMgUHJvcGVydHk8Qm9yZGVyPiB7XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQmFja2dyb3VuZFByb3BlcnR5IGV4dGVuZHMgUHJvcGVydHk8QUJhY2tncm91bmQ+IHtcblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBCb29sZWFuUHJvcGVydHkgZXh0ZW5kcyBQcm9wZXJ0eTxib29sZWFuPiB7XG5cbiAgICB9XG4gICAgXG4gICAgZXhwb3J0IGNsYXNzIENvbG9yUHJvcGVydHkgZXh0ZW5kcyBQcm9wZXJ0eTxDb2xvcj4ge1xuXG4gICAgfVxuXG59XG5cblxuIiwiXG5cbm5hbWVzcGFjZSBjdWJlZSB7XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIElTdHlsZSB7XG5cbiAgICAgICAgYXBwbHkoZWxlbWVudDogSFRNTEVsZW1lbnQpOiB2b2lkO1xuXG4gICAgfVxuXG4gICAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFCYWNrZ3JvdW5kIGltcGxlbWVudHMgSVN0eWxlIHtcblxuICAgICAgICBhYnN0cmFjdCBhcHBseShlbGVtZW50OiBIVE1MRWxlbWVudCk6IHZvaWQ7XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQ29sb3Ige1xuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9UUkFOU1BBUkVOVCA9IENvbG9yLmdldEFyZ2JDb2xvcigweDAwMDAwMDAwKTtcbiAgICAgICAgc3RhdGljIGdldCBUUkFOU1BBUkVOVCgpIHtcbiAgICAgICAgICAgIHJldHVybiBDb2xvci5fVFJBTlNQQVJFTlQ7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfV0hJVEUgPSBDb2xvci5nZXRBcmdiQ29sb3IoMHhmZmZmZmZmZik7XG4gICAgICAgIHN0YXRpYyBnZXQgV0hJVEUoKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29sb3IuX1dISVRFO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0JMQUNLID0gQ29sb3IuZ2V0QXJnYkNvbG9yKDB4ZmYwMDAwMDApO1xuICAgICAgICBzdGF0aWMgZ2V0IEJMQUNLKCkge1xuICAgICAgICAgICAgcmV0dXJuIENvbG9yLl9CTEFDSztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9MSUdIVF9HUkFZID0gQ29sb3IuZ2V0QXJnYkNvbG9yKDB4ZmZjY2NjY2MpO1xuICAgICAgICBzdGF0aWMgZ2V0IExJR0hUX0dSQVkoKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29sb3IuX0xJR0hUX0dSQVk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGdldEFyZ2JDb2xvcihhcmdiOiBudW1iZXIpOiBDb2xvciB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IENvbG9yKGFyZ2IpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBnZXRBcmdiQ29sb3JCeUNvbXBvbmVudHMoYWxwaGE6IG51bWJlciwgcmVkOiBudW1iZXIsIGdyZWVuOiBudW1iZXIsIGJsdWU6IG51bWJlcikge1xuICAgICAgICAgICAgYWxwaGEgPSB0aGlzLmZpeENvbXBvbmVudChhbHBoYSk7XG4gICAgICAgICAgICByZWQgPSB0aGlzLmZpeENvbXBvbmVudChyZWQpO1xuICAgICAgICAgICAgZ3JlZW4gPSB0aGlzLmZpeENvbXBvbmVudChncmVlbik7XG4gICAgICAgICAgICBibHVlID0gdGhpcy5maXhDb21wb25lbnQoYmx1ZSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEFyZ2JDb2xvcihcbiAgICAgICAgICAgICAgICBhbHBoYSA8PCAyNFxuICAgICAgICAgICAgICAgIHwgcmVkIDw8IDE2XG4gICAgICAgICAgICAgICAgfCBncmVlbiA8PCA4XG4gICAgICAgICAgICAgICAgfCBibHVlXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBnZXRSZ2JDb2xvcihyZ2I6IG51bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QXJnYkNvbG9yKHJnYiB8IDB4ZmYwMDAwMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBnZXRSZ2JDb2xvckJ5Q29tcG9uZW50cyhyZWQ6IG51bWJlciwgZ3JlZW46IG51bWJlciwgYmx1ZTogbnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRBcmdiQ29sb3JCeUNvbXBvbmVudHMoMjU1LCByZWQsIGdyZWVuLCBibHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGZpeENvbXBvbmVudChjb21wb25lbnQ6IG51bWJlcikge1xuICAgICAgICAgICAgY29tcG9uZW50ID0gY29tcG9uZW50IHwgMDtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQgPCAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjb21wb25lbnQgPiAyNTUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMjU1O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBmYWRlQ29sb3JzKHN0YXJ0Q29sb3I6IENvbG9yLCBlbmRDb2xvcjogQ29sb3IsIGZhZGVQb3NpdGlvbjogbnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29sb3IuZ2V0QXJnYkNvbG9yQnlDb21wb25lbnRzKFxuICAgICAgICAgICAgICAgIHRoaXMubWl4Q29tcG9uZW50KHN0YXJ0Q29sb3IuYWxwaGEsIGVuZENvbG9yLmFscGhhLCBmYWRlUG9zaXRpb24pLFxuICAgICAgICAgICAgICAgIHRoaXMubWl4Q29tcG9uZW50KHN0YXJ0Q29sb3IucmVkLCBlbmRDb2xvci5yZWQsIGZhZGVQb3NpdGlvbiksXG4gICAgICAgICAgICAgICAgdGhpcy5taXhDb21wb25lbnQoc3RhcnRDb2xvci5ncmVlbiwgZW5kQ29sb3IuZ3JlZW4sIGZhZGVQb3NpdGlvbiksXG4gICAgICAgICAgICAgICAgdGhpcy5taXhDb21wb25lbnQoc3RhcnRDb2xvci5ibHVlLCBlbmRDb2xvci5ibHVlLCBmYWRlUG9zaXRpb24pXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgbWl4Q29tcG9uZW50KHN0YXJ0VmFsdWU6IG51bWJlciwgZW5kVmFsdWU6IG51bWJlciwgcG9zOiBudW1iZXIpIHtcbiAgICAgICAgICAgIHZhciByZXMgPSAoc3RhcnRWYWx1ZSArICgoZW5kVmFsdWUgLSBzdGFydFZhbHVlKSAqIHBvcykpIHwgMDtcbiAgICAgICAgICAgIHJlcyA9IHRoaXMuZml4Q29tcG9uZW50KHJlcyk7XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfYXJnYiA9IDA7XG5cbiAgICAgICAgY29uc3RydWN0b3IoYXJnYjogbnVtYmVyKSB7XG4gICAgICAgICAgICBhcmdiID0gYXJnYiB8IDA7XG4gICAgICAgICAgICB0aGlzLl9hcmdiID0gYXJnYjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBhcmdiKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FyZ2I7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgYWxwaGEoKSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuX2FyZ2IgPj4+IDI0KSAmIDB4ZmY7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgcmVkKCkge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLl9hcmdiID4+PiAxNikgJiAweGZmO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGdyZWVuKCkge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLl9hcmdiID4+PiA4KSAmIDB4ZmY7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgYmx1ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hcmdiICYgMHhmZjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZhZGUoZmFkZUNvbG9yOiBDb2xvciwgZmFkZVBvc2l0aW9uOiBudW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBDb2xvci5mYWRlQ29sb3JzKHRoaXMsIGZhZGVDb2xvciwgZmFkZVBvc2l0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvQ1NTKCkge1xuICAgICAgICAgICAgcmV0dXJuIFwicmdiYShcIiArIHRoaXMucmVkICsgXCIsIFwiICsgdGhpcy5ncmVlbiArIFwiLCBcIiArIHRoaXMuYmx1ZSArIFwiLCBcIiArICh0aGlzLmFscGhhIC8gMjU1LjApICsgXCIpXCI7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBDb2xvckJhY2tncm91bmQgZXh0ZW5kcyBBQmFja2dyb3VuZCB7XG5cbiAgICAgICAgcHJpdmF0ZSBfY29sb3I6IENvbG9yID0gbnVsbDtcbiAgICAgICAgcHJpdmF0ZSBfY2FjaGU6IHN0cmluZyA9IG51bGw7XG5cbiAgICAgICAgY29uc3RydWN0b3IoY29sb3I6IENvbG9yKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgICAgdGhpcy5fY29sb3IgPSBjb2xvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBjb2xvcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb2xvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGFwcGx5KGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fY2FjaGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5fY2FjaGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jb2xvciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJiYWNrZ3JvdW5kQ29sb3JcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FjaGUgPSB0aGlzLl9jb2xvci50b0NTUygpO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuX2NhY2hlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFBhZGRpbmcgaW1wbGVtZW50cyBJU3R5bGUge1xuXG4gICAgICAgIHN0YXRpYyBjcmVhdGUocGFkZGluZzogbnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFBhZGRpbmcocGFkZGluZywgcGFkZGluZywgcGFkZGluZywgcGFkZGluZyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgICAgIHByaXZhdGUgX2xlZnQ6IG51bWJlcixcbiAgICAgICAgICAgIHByaXZhdGUgX3RvcDogbnVtYmVyLFxuICAgICAgICAgICAgcHJpdmF0ZSBfcmlnaHQ6IG51bWJlcixcbiAgICAgICAgICAgIHByaXZhdGUgX2JvdHRvbTogbnVtYmVyKSB7IH1cblxuICAgICAgICBnZXQgbGVmdCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sZWZ0O1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHRvcCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90b3A7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgcmlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgYm90dG9tKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvdHRvbTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFwcGx5KGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLnBhZGRpbmdMZWZ0ID0gdGhpcy5fbGVmdCArIFwicHhcIjtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUucGFkZGluZ1RvcCA9IHRoaXMuX3RvcCArIFwicHhcIjtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUucGFkZGluZ1JpZ2h0ID0gdGhpcy5fcmlnaHQgKyBcInB4XCI7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLnBhZGRpbmdCb3R0b20gPSB0aGlzLl9ib3R0b20gKyBcInB4XCI7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBCb3JkZXIgaW1wbGVtZW50cyBJU3R5bGUge1xuXG4gICAgICAgIHN0YXRpYyBjcmVhdGUod2lkdGg6IG51bWJlciwgY29sb3I6IENvbG9yLCByYWRpdXM6IG51bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBCb3JkZXIod2lkdGgsIHdpZHRoLCB3aWR0aCwgd2lkdGgsIGNvbG9yLCBjb2xvciwgY29sb3IsIGNvbG9yLCByYWRpdXMsIHJhZGl1cywgcmFkaXVzLCByYWRpdXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IoXG4gICAgICAgICAgICBwcml2YXRlIF9sZWZ0V2lkdGg6IG51bWJlcixcbiAgICAgICAgICAgIHByaXZhdGUgX3RvcFdpZHRoOiBudW1iZXIsXG4gICAgICAgICAgICBwcml2YXRlIF9yaWdodFdpZHRoOiBudW1iZXIsXG4gICAgICAgICAgICBwcml2YXRlIF9ib3R0b21XaWR0aDogbnVtYmVyLFxuICAgICAgICAgICAgcHJpdmF0ZSBfbGVmdENvbG9yOiBDb2xvcixcbiAgICAgICAgICAgIHByaXZhdGUgX3RvcENvbG9yOiBDb2xvcixcbiAgICAgICAgICAgIHByaXZhdGUgX3JpZ2h0Q29sb3I6IENvbG9yLFxuICAgICAgICAgICAgcHJpdmF0ZSBfYm90dG9tQ29sb3I6IENvbG9yLFxuICAgICAgICAgICAgcHJpdmF0ZSBfdG9wTGVmdFJhZGl1czogbnVtYmVyLFxuICAgICAgICAgICAgcHJpdmF0ZSBfdG9wUmlnaHRSYWRpdXM6IG51bWJlcixcbiAgICAgICAgICAgIHByaXZhdGUgX2JvdHRvbUxlZnRSYWRpdXM6IG51bWJlcixcbiAgICAgICAgICAgIHByaXZhdGUgX2JvdHRvbVJpZ2h0UmFkaXVzOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9sZWZ0Q29sb3IgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xlZnRDb2xvciA9IENvbG9yLlRSQU5TUEFSRU5UO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuX3RvcENvbG9yID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl90b3BDb2xvciA9IENvbG9yLlRSQU5TUEFSRU5UO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuX3JpZ2h0Q29sb3IgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JpZ2h0Q29sb3IgPSBDb2xvci5UUkFOU1BBUkVOVDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLl9ib3R0b21Db2xvciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYm90dG9tQ29sb3IgPSBDb2xvci5UUkFOU1BBUkVOVDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBsZWZ0V2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbGVmdFdpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGdldCB0b3BXaWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90b3BXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgcmlnaHRXaWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yaWdodFdpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGdldCBib3R0b21XaWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib3R0b21XaWR0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBsZWZ0Q29sb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbGVmdENvbG9yO1xuICAgICAgICB9XG4gICAgICAgIGdldCB0b3BDb2xvcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90b3BDb2xvcjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgcmlnaHRDb2xvcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yaWdodENvbG9yO1xuICAgICAgICB9XG4gICAgICAgIGdldCBib3R0b21Db2xvcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib3R0b21Db2xvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB0b3BMZWZ0UmFkaXVzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RvcExlZnRSYWRpdXM7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRvcFJpZ2h0UmFkaXVzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RvcFJpZ2h0UmFkaXVzO1xuICAgICAgICB9XG4gICAgICAgIGdldCBib3R0b21MZWZ0UmFkaXVzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvdHRvbUxlZnRSYWRpdXM7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJvdHRvbVJpZ2h0UmFkaXVzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvdHRvbVJpZ2h0UmFkaXVzO1xuICAgICAgICB9XG5cbiAgICAgICAgYXBwbHkoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuYm9yZGVyU3R5bGUgPSBcInNvbGlkXCI7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJvcmRlckxlZnRDb2xvciA9IHRoaXMuX2xlZnRDb2xvci50b0NTUygpO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5ib3JkZXJMZWZ0V2lkdGggPSB0aGlzLl9sZWZ0V2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJvcmRlclRvcENvbG9yID0gdGhpcy5fdG9wQ29sb3IudG9DU1MoKTtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuYm9yZGVyVG9wV2lkdGggPSB0aGlzLl90b3BXaWR0aCArIFwicHhcIjtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuYm9yZGVyUmlnaHRDb2xvciA9IHRoaXMuX3JpZ2h0Q29sb3IudG9DU1MoKTtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuYm9yZGVyUmlnaHRXaWR0aCA9IHRoaXMuX3JpZ2h0V2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJvcmRlckJvdHRvbUNvbG9yID0gdGhpcy5fYm90dG9tQ29sb3IudG9DU1MoKTtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuYm9yZGVyQm90dG9tV2lkdGggPSB0aGlzLl9ib3R0b21XaWR0aCArIFwicHhcIjtcblxuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5ib3JkZXJUb3BMZWZ0UmFkaXVzID0gdGhpcy5fdG9wTGVmdFJhZGl1cyArIFwicHhcIjtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuYm9yZGVyVG9wUmlnaHRSYWRpdXMgPSB0aGlzLl90b3BSaWdodFJhZGl1cyArIFwicHhcIjtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuYm9yZGVyQm90dG9tTGVmdFJhZGl1cyA9IHRoaXMuX2JvdHRvbUxlZnRSYWRpdXMgKyBcInB4XCI7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzID0gdGhpcy5fYm90dG9tUmlnaHRSYWRpdXMgKyBcInB4XCI7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBCb3hTaGFkb3cgaW1wbGVtZW50cyBJU3R5bGUge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICAgICAgcHJpdmF0ZSBfaFBvczogbnVtYmVyLFxuICAgICAgICAgICAgcHJpdmF0ZSBfdlBvczogbnVtYmVyLFxuICAgICAgICAgICAgcHJpdmF0ZSBfYmx1cjogbnVtYmVyLFxuICAgICAgICAgICAgcHJpdmF0ZSBfc3ByZWFkOiBudW1iZXIsXG4gICAgICAgICAgICBwcml2YXRlIF9jb2xvcjogQ29sb3IsXG4gICAgICAgICAgICBwcml2YXRlIF9pbm5lcjogYm9vbGVhbikgeyB9XG5cbiAgICAgICAgZ2V0IGhQb3MoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faFBvcztcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB2UG9zKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZQb3M7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgYmx1cigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ibHVyO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHNwcmVhZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zcHJlYWQ7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgY29sb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY29sb3I7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgaW5uZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faW5uZXI7XG4gICAgICAgIH1cblxuICAgICAgICBhcHBseShlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5ib3hTaGFkb3cgPSB0aGlzLl9oUG9zICsgXCJweCBcIiArIHRoaXMuX3ZQb3MgKyBcInB4IFwiICsgdGhpcy5fYmx1ciArIFwicHggXCIgKyB0aGlzLl9zcHJlYWQgKyBcInB4IFwiXG4gICAgICAgICAgICArIHRoaXMuX2NvbG9yLnRvQ1NTKCkgKyAodGhpcy5faW5uZXIgPyBcIiBpbnNldFwiIDogXCJcIik7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBFVGV4dE92ZXJmbG93IGltcGxlbWVudHMgSVN0eWxlIHtcblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ0xJUCA9IG5ldyBFVGV4dE92ZXJmbG93KFwiY2xpcFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0VMTElQU0lTID0gbmV3IEVUZXh0T3ZlcmZsb3coXCJlbGxpcHNpc1wiKTtcblxuICAgICAgICBzdGF0aWMgZ2V0IENMSVAoKSB7XG4gICAgICAgICAgICByZXR1cm4gRVRleHRPdmVyZmxvdy5fQ0xJUDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRpYyBnZXQgRUxMSVBTSVMoKSB7XG4gICAgICAgICAgICByZXR1cm4gRVRleHRPdmVyZmxvdy5fRUxMSVBTSVM7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jc3M6IHN0cmluZykge1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IENTUygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jc3M7XG4gICAgICAgIH1cblxuICAgICAgICBhcHBseShlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS50ZXh0T3ZlcmZsb3cgPSB0aGlzLl9jc3M7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBFVGV4dEFsaWduIGltcGxlbWVudHMgSVN0eWxlIHtcblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTEVGVCA9IG5ldyBFVGV4dEFsaWduKFwibGVmdFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0NFTlRFUiA9IG5ldyBFVGV4dEFsaWduKFwiY2VudGVyXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUklHSFQgPSBuZXcgRVRleHRBbGlnbihcInJpZ2h0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfSlVTVElGWSA9IG5ldyBFVGV4dEFsaWduKFwianVzdGlmeVwiKTtcblxuICAgICAgICBzdGF0aWMgZ2V0IExFRlQoKSB7XG4gICAgICAgICAgICByZXR1cm4gRVRleHRBbGlnbi5fTEVGVDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRpYyBnZXQgQ0VOVEVSKCkge1xuICAgICAgICAgICAgcmV0dXJuIEVUZXh0QWxpZ24uX0NFTlRFUjtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRpYyBnZXQgUklHSFQoKSB7XG4gICAgICAgICAgICByZXR1cm4gRVRleHRBbGlnbi5fUklHSFQ7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0aWMgZ2V0IEpVU1RJRlkoKSB7XG4gICAgICAgICAgICByZXR1cm4gRVRleHRBbGlnbi5fSlVTVElGWTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2Nzczogc3RyaW5nKSB7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQ1NTKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NzcztcbiAgICAgICAgfVxuXG4gICAgICAgIGFwcGx5KGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLnRleHRBbGlnbiA9IHRoaXMuX2NzcztcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEVIQWxpZ24ge1xuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9MRUZUID0gbmV3IEVIQWxpZ24oXCJsZWZ0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ0VOVEVSID0gbmV3IEVIQWxpZ24oXCJjZW50ZXJcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9SSUdIVCA9IG5ldyBFSEFsaWduKFwicmlnaHRcIik7XG5cbiAgICAgICAgc3RhdGljIGdldCBMRUZUKCkge1xuICAgICAgICAgICAgcmV0dXJuIEVIQWxpZ24uX0xFRlQ7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0aWMgZ2V0IENFTlRFUigpIHtcbiAgICAgICAgICAgIHJldHVybiBFSEFsaWduLl9DRU5URVI7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0aWMgZ2V0IFJJR0hUKCkge1xuICAgICAgICAgICAgcmV0dXJuIEVIQWxpZ24uX1JJR0hUO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBfY3NzOiBzdHJpbmcpIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBDU1MoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY3NzO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRVZBbGlnbiB7XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1RPUCA9IG5ldyBFVkFsaWduKFwidG9wXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTUlERExFID0gbmV3IEVWQWxpZ24oXCJtaWRkbGVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9CT1RUT00gPSBuZXcgRVZBbGlnbihcImJvdHRvbVwiKTtcblxuICAgICAgICBzdGF0aWMgZ2V0IFRPUCgpIHtcbiAgICAgICAgICAgIHJldHVybiBFVkFsaWduLl9UT1A7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0aWMgZ2V0IE1JRERMRSgpIHtcbiAgICAgICAgICAgIHJldHVybiBFVkFsaWduLl9NSURETEU7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0aWMgZ2V0IEJPVFRPTSgpIHtcbiAgICAgICAgICAgIHJldHVybiBFVkFsaWduLl9CT1RUT007XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jc3M6IHN0cmluZykge1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IENTUygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jc3M7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBGb250RmFtaWx5IGltcGxlbWVudHMgSVN0eWxlIHtcblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfYXJpYWwgPSBuZXcgRm9udEZhbWlseShcIkFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWZcIik7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZ2V0IEFyaWFsKCkge1xuICAgICAgICAgICAgcmV0dXJuIEZvbnRGYW1pbHkuX2FyaWFsO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBpbml0Rm9udENvbnRhaW5lclN0eWxlKCkge1xuICAgICAgICAgICAgdmFyIHduZDogYW55ID0gd2luZG93O1xuICAgICAgICAgICAgd25kLmZvbnRzU3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gICAgICAgICAgICB3bmQuZm9udHNTdHlsZS50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuICAgICAgICAgICAgdmFyIGRvYzogYW55ID0gZG9jdW1lbnQ7XG4gICAgICAgICAgICBkb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdLmFwcGVuZENoaWxkKHduZC5mb250c1N0eWxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVnaXN0ZXJGb250KG5hbWU6IHN0cmluZywgc3JjOiBzdHJpbmcsIGV4dHJhOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHZhciBleCA9IGV4dHJhO1xuICAgICAgICAgICAgaWYgKGV4ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBleCA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGN0ID0gXCJAZm9udC1mYWNlIHtmb250LWZhbWlseTogJ1wiICsgbmFtZSArIFwiJzsgc3JjOiB1cmwoJ1wiICsgc3JjICsgXCInKTtcIiArIGV4ICsgXCJ9XCI7XG4gICAgICAgICAgICB2YXIgaWggPSAoPGFueT53aW5kb3cpLmZvbnRzU3R5bGUuaW5uZXJIVE1MO1xuICAgICAgICAgICAgaWYgKGloID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpaCA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgKDxhbnk+d2luZG93KS5mb250c1N0eWxlLmlubmVySFRNTCA9IGloICsgY3Q7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jc3M6IHN0cmluZykge1xuICAgICAgICAgICAgaWYgKCFGb250RmFtaWx5LmluaXRpYWxpemVkKSB7XG4gICAgICAgICAgICAgICAgRm9udEZhbWlseS5pbml0Rm9udENvbnRhaW5lclN0eWxlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQ1NTKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NzcztcbiAgICAgICAgfVxuXG4gICAgICAgIGFwcGx5KGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmZvbnRGYW1pbHkgPSB0aGlzLl9jc3M7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBFQ3Vyc29yIHtcblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBhdXRvID0gbmV3IEVDdXJzb3IoXCJhdXRvXCIpO1xuICAgICAgICBzdGF0aWMgZ2V0IEFVVE8oKSB7XG4gICAgICAgICAgICByZXR1cm4gRUN1cnNvci5hdXRvO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBfY3NzOiBzdHJpbmcpIHsgfVxuXG4gICAgICAgIGdldCBjc3MoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY3NzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGVudW0gRVNjcm9sbEJhclBvbGljeSB7XG5cbiAgICAgICAgVklTSUJMRSxcbiAgICAgICAgQVVUTyxcbiAgICAgICAgSElEREVOXG5cbiAgICB9XG5cbiAgICBleHBvcnQgZW51bSBFUGljdHVyZVNpemVNb2RlIHtcblxuICAgICAgICBOT1JNQUwsXG4gICAgICAgIENFTlRFUixcbiAgICAgICAgU1RSRVRDSCxcbiAgICAgICAgRklMTCxcbiAgICAgICAgWk9PTSxcbiAgICAgICAgRklUX1dJRFRILFxuICAgICAgICBGSVRfSEVJR0hUXG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgSW1hZ2UgaW1wbGVtZW50cyBJU3R5bGUge1xuXG4gICAgICAgIHByaXZhdGUgX29uTG9hZCA9IG5ldyBFdmVudDxFdmVudEFyZ3M+KCk7XG5cbiAgICAgICAgcHJpdmF0ZSBfd2lkdGggPSAwO1xuICAgICAgICBwcml2YXRlIF9oZWlnaHQgPSAwO1xuICAgICAgICBwcml2YXRlIF9sb2FkZWQgPSBmYWxzZTtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF91cmw6IHN0cmluZykge1xuICAgICAgICAgICAgaWYgKF91cmwgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIHVybCBwYXJhbWV0ZXIgY2FuIG5vdCBiZSBudWxsLlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGUgPSA8SFRNTEltYWdlRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICAgICAgZS5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2lkdGggPSBlLndpZHRoO1xuICAgICAgICAgICAgICAgIHRoaXMuX2hlaWdodCA9IGUuaGVpZ2h0O1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvYWRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fb25Mb2FkLmZpcmVFdmVudChuZXcgRXZlbnRBcmdzKHRoaXMpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZS5zcmMgPSBfdXJsO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHVybCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl91cmw7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgb25Mb2FkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX29uTG9hZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB3aWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBoZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGxvYWRlZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sb2FkZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBhcHBseShlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgdGhpcy51cmwpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn1cblxuXG4iLCIvKiBcbiAqIFRvIGNoYW5nZSB0aGlzIGxpY2Vuc2UgaGVhZGVyLCBjaG9vc2UgTGljZW5zZSBIZWFkZXJzIGluIFByb2plY3QgUHJvcGVydGllcy5cbiAqIFRvIGNoYW5nZSB0aGlzIHRlbXBsYXRlIGZpbGUsIGNob29zZSBUb29scyB8IFRlbXBsYXRlc1xuICogYW5kIG9wZW4gdGhlIHRlbXBsYXRlIGluIHRoZSBlZGl0b3IuXG4gKi9cbiBcbm5hbWVzcGFjZSBjdWJlZSB7XG4gICAgXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGNhbGw8JFAsICRSPih1cmw6IHN0cmluZywgbWV0aG9kOiBzdHJpbmcsIHBhcmFtOiAkUCwgY2FsbGJhY2s6IFJwY1Jlc3VsdDwkUj4pIHtcbiAgICAgICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBqc29uID0gdGhpcy5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQ6ICRSID0gSlNPTi5wYXJzZShqc29uKTtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sodGhpcy5zdGF0dXMsIHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sodGhpcy5zdGF0dXMsIG51bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXEub3BlbihtZXRob2QsIHVybCk7XG4gICAgICAgIGlmIChwYXJhbSAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXEuc2VuZChKU09OLnN0cmluZ2lmeShwYXJhbSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVxLnNlbmQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBleHBvcnQgaW50ZXJmYWNlIFJwY1Jlc3VsdDwkUj4ge1xuICAgICAgICAoc3RhdHVzOiBudW1iZXIsIHJlc3VsdDogJFIpOiB2b2lkO1xuICAgIH1cbiAgICBcbn1cblxuXG4iLCJuYW1lc3BhY2UgY3ViZWUge1xuICAgIFxuICAgIGV4cG9ydCBjbGFzcyBMYXlvdXRDaGlsZHJlbiB7XG4gICAgICAgIHByaXZhdGUgY2hpbGRyZW46IEFDb21wb25lbnRbXSA9IFtdO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcGFyZW50OiBBTGF5b3V0KSB7XG4gICAgICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZChjb21wb25lbnQ6IEFDb21wb25lbnQpIHtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQucGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgY29tcG9uZW50IGlzIGFscmVhZHkgYSBjaGlsZCBvZiBhIGxheW91dC5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29tcG9uZW50Ll9zZXRQYXJlbnQodGhpcy5wYXJlbnQpO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5vblBhcmVudENoYW5nZWQuZmlyZUV2ZW50KG5ldyBQYXJlbnRDaGFuZ2VkRXZlbnRBcmdzKHRoaXMucGFyZW50LCBjb21wb25lbnQpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNvbXBvbmVudCk7XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5fb25DaGlsZEFkZGVkKGNvbXBvbmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbnNlcnQoaW5kZXg6IG51bWJlciwgY29tcG9uZW50OiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICBpZiAoY29tcG9uZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LnBhcmVudCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIGNvbXBvbmVudCBpcyBhbHJlYWR5IGEgY2hpbGQgb2YgYSBsYXlvdXQuXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbmV3Q2hpbGRyZW46IEFDb21wb25lbnRbXSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgICAgICAgICAgIG5ld0NoaWxkcmVuLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBuZXdDaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDAsIGNvbXBvbmVudCk7XG5cbiAgICAgICAgICAgIC8vIFRPRE8gVkVSWSBJTkVGRUNUSVZFXG4gICAgICAgICAgICB0aGlzLmNsZWFyKCk7XG5cbiAgICAgICAgICAgIG5ld0NoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGQoY2hpbGQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmVDb21wb25lbnQoY29tcG9uZW50OiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICB2YXIgaWR4ID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKGNvbXBvbmVudCk7XG4gICAgICAgICAgICBpZiAoaWR4IDwgMCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIGdpdmVuIGNvbXBvbmVudCBpc24ndCBhIGNoaWxkIG9mIHRoaXMgbGF5b3V0LlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yZW1vdmVJbmRleChpZHgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlSW5kZXgoaW5kZXg6IG51bWJlcikge1xuICAgICAgICAgICAgdmFyIHJlbW92ZWRDb21wb25lbnQ6IEFDb21wb25lbnQgPSB0aGlzLmNoaWxkcmVuW2luZGV4XTtcbiAgICAgICAgICAgIGlmIChyZW1vdmVkQ29tcG9uZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZW1vdmVkQ29tcG9uZW50Ll9zZXRQYXJlbnQobnVsbCk7XG4gICAgICAgICAgICAgICAgcmVtb3ZlZENvbXBvbmVudC5vblBhcmVudENoYW5nZWQuZmlyZUV2ZW50KG5ldyBQYXJlbnRDaGFuZ2VkRXZlbnRBcmdzKG51bGwsIHJlbW92ZWRDb21wb25lbnQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucGFyZW50Ll9vbkNoaWxkUmVtb3ZlZChyZW1vdmVkQ29tcG9uZW50LCBpbmRleCk7XG4gICAgICAgIH1cblxuICAgICAgICBjbGVhcigpIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZC5fc2V0UGFyZW50KG51bGwpO1xuICAgICAgICAgICAgICAgICAgICBjaGlsZC5vblBhcmVudENoYW5nZWQuZmlyZUV2ZW50KG5ldyBQYXJlbnRDaGFuZ2VkRXZlbnRBcmdzKG51bGwsIGNoaWxkKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5fb25DaGlsZHJlbkNsZWFyZWQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldChpbmRleDogbnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbltpbmRleF1cbiAgICAgICAgfVxuXG4gICAgICAgIGluZGV4T2YoY29tcG9uZW50OiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5pbmRleE9mKGNvbXBvbmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBzaXplKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxufVxuXG5cbiIsIm5hbWVzcGFjZSBjdWJlZSB7XG4gICAgXG4gICAgZXhwb3J0IGNsYXNzIE1vdXNlRXZlbnRUeXBlcyB7XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBNT1VTRV9ET1dOID0gMDtcbiAgICAgICAgcHVibGljIHN0YXRpYyBNT1VTRV9NT1ZFID0gMTtcbiAgICAgICAgcHVibGljIHN0YXRpYyBNT1VTRV9VUCA9IDI7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgTU9VU0VfRU5URVIgPSAzO1xuICAgICAgICBwdWJsaWMgc3RhdGljIE1PVVNFX0xFQVZFID0gNDtcbiAgICAgICAgcHVibGljIHN0YXRpYyBNT1VTRV9XSEVFTCA9IDU7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7IH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBQ29tcG9uZW50IHtcblxuICAgICAgICBwcml2YXRlIF90cmFuc2xhdGVYID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3RyYW5zbGF0ZVkgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfcm90YXRlID0gbmV3IE51bWJlclByb3BlcnR5KDAuMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfc2NhbGVYID0gbmV3IE51bWJlclByb3BlcnR5KDEuMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfc2NhbGVZID0gbmV3IE51bWJlclByb3BlcnR5KDEuMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdHJhbnNmb3JtQ2VudGVyWCA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLjUsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3RyYW5zZm9ybUNlbnRlclkgPSBuZXcgTnVtYmVyUHJvcGVydHkoMC41LCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9wYWRkaW5nID0gbmV3IFBhZGRpbmdQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2JvcmRlciA9IG5ldyBCb3JkZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX21lYXN1cmVkV2lkdGggPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIHRydWUpO1xuICAgICAgICBwcml2YXRlIF9tZWFzdXJlZEhlaWdodCA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgIHByaXZhdGUgX2NsaWVudFdpZHRoID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgcHJpdmF0ZSBfY2xpZW50SGVpZ2h0ID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgcHJpdmF0ZSBfYm91bmRzV2lkdGggPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIHRydWUpO1xuICAgICAgICBwcml2YXRlIF9ib3VuZHNIZWlnaHQgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIHRydWUpO1xuICAgICAgICBwcml2YXRlIF9ib3VuZHNMZWZ0ID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgcHJpdmF0ZSBfYm91bmRzVG9wID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgcHJpdmF0ZSBfbWVhc3VyZWRXaWR0aFNldHRlciA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9tZWFzdXJlZEhlaWdodFNldHRlciA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9jbGllbnRXaWR0aFNldHRlciA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9jbGllbnRIZWlnaHRTZXR0ZXIgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYm91bmRzV2lkdGhTZXR0ZXIgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYm91bmRzSGVpZ2h0U2V0dGVyID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2JvdW5kc0xlZnRTZXR0ZXIgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYm91bmRzVG9wU2V0dGVyID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2N1cnNvciA9IG5ldyBQcm9wZXJ0eTxFQ3Vyc29yPihFQ3Vyc29yLkFVVE8sIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3BvaW50ZXJUcmFuc3BhcmVudCA9IG5ldyBQcm9wZXJ0eTxib29sZWFuPihmYWxzZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfaGFuZGxlUG9pbnRlciA9IG5ldyBQcm9wZXJ0eTxib29sZWFuPih0cnVlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF92aXNpYmxlID0gbmV3IFByb3BlcnR5PGJvb2xlYW4+KHRydWUsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2VuYWJsZWQgPSBuZXcgUHJvcGVydHk8Ym9vbGVhbj4odHJ1ZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYWxwaGEgPSBuZXcgTnVtYmVyUHJvcGVydHkoMS4wLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9zZWxlY3RhYmxlID0gbmV3IFByb3BlcnR5PGJvb2xlYW4+KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9taW5XaWR0aCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX21pbkhlaWdodCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX21heFdpZHRoID0gbmV3IE51bWJlclByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfbWF4SGVpZ2h0ID0gbmV3IE51bWJlclByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfaG92ZXJlZCA9IG5ldyBQcm9wZXJ0eTxib29sZWFuPihmYWxzZSwgZmFsc2UsIHRydWUpO1xuICAgICAgICBwcml2YXRlIF9ob3ZlcmVkU2V0dGVyID0gbmV3IFByb3BlcnR5PGJvb2xlYW4+KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9wcmVzc2VkID0gbmV3IFByb3BlcnR5PGJvb2xlYW4+KGZhbHNlLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgIHByaXZhdGUgX3ByZXNzZWRTZXR0ZXIgPSBuZXcgUHJvcGVydHk8Ym9vbGVhbj4oZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX29uQ2xpY2sgPSBuZXcgRXZlbnQ8TW91c2VFdmVudD4oKTtcbiAgICAgICAgcHJpdmF0ZSBfb25Nb3VzZURvd24gPSBuZXcgRXZlbnQ8TW91c2VFdmVudD4oKTtcbiAgICAgICAgcHJpdmF0ZSBfb25Nb3VzZURyYWcgPSBuZXcgRXZlbnQ8TW91c2VFdmVudD4oKTtcbiAgICAgICAgcHJpdmF0ZSBfb25Nb3VzZU1vdmUgPSBuZXcgRXZlbnQ8TW91c2VFdmVudD4oKTtcbiAgICAgICAgcHJpdmF0ZSBfb25Nb3VzZVVwID0gbmV3IEV2ZW50PE1vdXNlRXZlbnQ+KCk7XG4gICAgICAgIHByaXZhdGUgX29uTW91c2VFbnRlciA9IG5ldyBFdmVudDxNb3VzZUV2ZW50PigpO1xuICAgICAgICBwcml2YXRlIF9vbk1vdXNlTGVhdmUgPSBuZXcgRXZlbnQ8TW91c2VFdmVudD4oKTtcbiAgICAgICAgcHJpdmF0ZSBfb25Nb3VzZVdoZWVsID0gbmV3IEV2ZW50PE1vdXNlRXZlbnQ+KCk7XG4gICAgICAgIHByaXZhdGUgX29uS2V5RG93biA9IG5ldyBFdmVudDxLZXlib2FyZEV2ZW50PigpO1xuICAgICAgICBwcml2YXRlIF9vbktleVByZXNzID0gbmV3IEV2ZW50PEtleWJvYXJkRXZlbnQ+KCk7XG4gICAgICAgIHByaXZhdGUgX29uS2V5VXAgPSBuZXcgRXZlbnQ8S2V5Ym9hcmRFdmVudD4oKTtcbiAgICAgICAgcHJpdmF0ZSBfb25QYXJlbnRDaGFuZ2VkID0gbmV3IEV2ZW50PFBhcmVudENoYW5nZWRFdmVudEFyZ3M+KCk7XG4gICAgICAgIHByaXZhdGUgX29uQ29udGV4dE1lbnUgPSBuZXcgRXZlbnQ8T2JqZWN0PigpO1xuICAgICAgICBwcml2YXRlIF9sZWZ0ID0gMDtcbiAgICAgICAgcHJpdmF0ZSBfdG9wID0gMDtcbiAgICAgICAgcHJpdmF0ZSBfZWxlbWVudDogSFRNTEVsZW1lbnQ7XG4gICAgICAgIHByaXZhdGUgX3BhcmVudDogQUxheW91dDtcbiAgICAgICAgcHVibGljIF9uZWVkc0xheW91dCA9IHRydWU7XG4gICAgICAgIHByaXZhdGUgX2N1YmVlUGFuZWw6IEN1YmVlUGFuZWw7XG4gICAgICAgIHByaXZhdGUgX3RyYW5zZm9ybUNoYW5nZWRMaXN0ZW5lciA9IChzZW5kZXI6IE9iamVjdCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVUcmFuc2Zvcm0oKTtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICB9O1xuICAgICAgICBwcml2YXRlIF9wb3N0Q29uc3RydWN0UnVuT25jZSA9IG5ldyBSdW5PbmNlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucG9zdENvbnN0cnVjdCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiBBQ29tcG9uZXQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSByb290RWxlbWVudCBUaGUgdW5kZXJsYXlpbmcgSFRNTCBlbGVtZW50IHdoaWNoIHRoaXMgY29tcG9uZW50IHdyYXBzLlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RydWN0b3Iocm9vdEVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50ID0gcm9vdEVsZW1lbnQ7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtY3ViZWUtY29tcG9uZW50XCIsIHRoaXMuZ2V0Q2xhc3NOYW1lKCkpO1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5ib3hTaXppbmcgPSBcImJvcmRlci1ib3hcIjtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKFwiZHJhZ2dhYmxlXCIsIFwiZmFsc2VcIik7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5vdXRsaW5lU3R5bGUgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUub3V0bGluZVdpZHRoID0gXCIwcHhcIjtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUubWFyZ2luID0gXCIwcHhcIjtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9IFwiYWxsXCI7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2xhdGVYLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX3RyYW5zZm9ybUNoYW5nZWRMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2xhdGVZLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX3RyYW5zZm9ybUNoYW5nZWRMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLl9yb3RhdGUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fdHJhbnNmb3JtQ2hhbmdlZExpc3RlbmVyKTtcbiAgICAgICAgICAgIHRoaXMuX3NjYWxlWC5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl90cmFuc2Zvcm1DaGFuZ2VkTGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy5fc2NhbGVZLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX3RyYW5zZm9ybUNoYW5nZWRMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2Zvcm1DZW50ZXJYLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX3RyYW5zZm9ybUNoYW5nZWRMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2Zvcm1DZW50ZXJZLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX3RyYW5zZm9ybUNoYW5nZWRMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLl9ob3ZlcmVkLmluaXRSZWFkb25seUJpbmQodGhpcy5faG92ZXJlZFNldHRlcik7XG4gICAgICAgICAgICB0aGlzLl9wcmVzc2VkLmluaXRSZWFkb25seUJpbmQodGhpcy5fcHJlc3NlZFNldHRlcik7XG4gICAgICAgICAgICB0aGlzLl9wYWRkaW5nLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgcCA9IHRoaXMuX3BhZGRpbmcudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHAgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnBhZGRpbmcgPSBcIjBweFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHAuYXBwbHkodGhpcy5fZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9wYWRkaW5nLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2JvcmRlci5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGIgPSB0aGlzLl9ib3JkZXIudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKGIgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYm9yZGVyU3R5bGVcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJib3JkZXJDb2xvclwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImJvcmRlcldpZHRoXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYm9yZGVyUmFkaXVzXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGIuYXBwbHkodGhpcy5fZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9jdXJzb3IuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUuY3Vyc29yID0gdGhpcy5jdXJzb3IuY3NzO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl92aXNpYmxlLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdmlzaWJsZS52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZW5hYmxlZC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2VuYWJsZWQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2FscGhhLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLm9wYWNpdHkgPSBcIlwiICsgdGhpcy5fYWxwaGEudmFsdWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGFibGUuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zZWxlY3RhYmxlLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJtb3pVc2VyU2VsZWN0XCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwia2h0bWxVc2VyU2VsZWN0XCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwid2Via2l0VXNlclNlbGVjdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcIm1zVXNlclNlbGVjdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcInVzZXJTZWxlY3RcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcIm1velVzZXJTZWxlY3RcIiwgXCJub25lXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KFwia2h0bWxVc2VyU2VsZWN0XCIsIFwibm9uZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcIndlYmtpdFVzZXJTZWxlY3RcIiwgXCJub25lXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KFwibXNVc2VyU2VsZWN0XCIsIFwibm9uZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcInVzZXJTZWxlY3RcIiwgXCJub25lXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fc2VsZWN0YWJsZS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9taW5XaWR0aC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX21pbldpZHRoLnZhbHVlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcIm1pbldpZHRoXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoXCJtaW5XaWR0aFwiLCB0aGlzLl9taW5XaWR0aC52YWx1ZSArIFwicHhcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9taW5IZWlnaHQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9taW5IZWlnaHQudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwibWluSGVpZ2h0XCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoXCJtaW5IZWlnaHRcIiwgdGhpcy5fbWluSGVpZ2h0LnZhbHVlICsgXCJweFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX21heFdpZHRoLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbWF4V2lkdGgudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwibWF4V2lkdGhcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcIm1heFdpZHRoXCIsIHRoaXMuX21heFdpZHRoLnZhbHVlICsgXCJweFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX21heEhlaWdodC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX21heEhlaWdodC52YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJtYXhIZWlnaHRcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcIm1heEhlaWdodFwiLCB0aGlzLl9tYXhIZWlnaHQudmFsdWUgKyBcInB4XCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5faGFuZGxlUG9pbnRlci5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9oYW5kbGVQb2ludGVyLnZhbHVlIHx8IHRoaXMuX3BvaW50ZXJUcmFuc3BhcmVudC52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KFwicG9pbnRlckV2ZW50c1wiLCBcIm5vbmVcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcInBvaW50ZXJFdmVudHNcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9wb2ludGVyVHJhbnNwYXJlbnQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5faGFuZGxlUG9pbnRlci52YWx1ZSB8fCB0aGlzLl9wb2ludGVyVHJhbnNwYXJlbnQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcInBvaW50ZXJFdmVudHNcIiwgXCJub25lXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJwb2ludGVyRXZlbnRzXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLl9tZWFzdXJlZFdpZHRoLmluaXRSZWFkb25seUJpbmQodGhpcy5fbWVhc3VyZWRXaWR0aFNldHRlcik7XG4gICAgICAgICAgICB0aGlzLl9tZWFzdXJlZEhlaWdodC5pbml0UmVhZG9ubHlCaW5kKHRoaXMuX21lYXN1cmVkSGVpZ2h0U2V0dGVyKTtcbiAgICAgICAgICAgIHRoaXMuX2NsaWVudFdpZHRoLmluaXRSZWFkb25seUJpbmQodGhpcy5fY2xpZW50V2lkdGhTZXR0ZXIpO1xuICAgICAgICAgICAgdGhpcy5fY2xpZW50SGVpZ2h0LmluaXRSZWFkb25seUJpbmQodGhpcy5fY2xpZW50SGVpZ2h0U2V0dGVyKTtcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kc1dpZHRoLmluaXRSZWFkb25seUJpbmQodGhpcy5fYm91bmRzV2lkdGhTZXR0ZXIpO1xuICAgICAgICAgICAgdGhpcy5fYm91bmRzSGVpZ2h0LmluaXRSZWFkb25seUJpbmQodGhpcy5fYm91bmRzSGVpZ2h0U2V0dGVyKTtcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kc0xlZnQuaW5pdFJlYWRvbmx5QmluZCh0aGlzLl9ib3VuZHNMZWZ0U2V0dGVyKTtcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kc1RvcC5pbml0UmVhZG9ubHlCaW5kKHRoaXMuX2JvdW5kc1RvcFNldHRlcik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuX29uQ2xpY2sgPSBuZXcgRXZlbnQ8TW91c2VFdmVudD4obmV3IEh0bWxFdmVudExpc3RlbmVyQ2FsbGJhY2sodGhpcy5fZWxlbWVudCwgXCJjbGlja1wiKSk7XG4gICAgICAgICAgICB0aGlzLl9vbk1vdXNlRG93biA9IG5ldyBFdmVudDxNb3VzZUV2ZW50PihuZXcgSHRtbEV2ZW50TGlzdGVuZXJDYWxsYmFjayh0aGlzLl9lbGVtZW50LCBcIm1vdXNlZG93blwiKSk7XG4gICAgICAgICAgICB0aGlzLiBfb25Nb3VzZU1vdmUgPSBuZXcgRXZlbnQ8TW91c2VFdmVudD4obmV3IEh0bWxFdmVudExpc3RlbmVyQ2FsbGJhY2sodGhpcy5fZWxlbWVudCwgXCJtb3VzZW1vdmVcIikpO1xuICAgICAgICAgICAgdGhpcy4gX29uTW91c2VVcCA9IG5ldyBFdmVudDxNb3VzZUV2ZW50PihuZXcgSHRtbEV2ZW50TGlzdGVuZXJDYWxsYmFjayh0aGlzLl9lbGVtZW50LCBcIm1vdXNldXBcIikpO1xuICAgICAgICAgICAgdGhpcy4gX29uTW91c2VFbnRlciA9IG5ldyBFdmVudDxNb3VzZUV2ZW50PihuZXcgSHRtbEV2ZW50TGlzdGVuZXJDYWxsYmFjayh0aGlzLl9lbGVtZW50LCBcIm1vdXNlZW50ZXJcIikpO1xuICAgICAgICAgICAgdGhpcy4gX29uTW91c2VMZWF2ZSA9IG5ldyBFdmVudDxNb3VzZUV2ZW50PihuZXcgSHRtbEV2ZW50TGlzdGVuZXJDYWxsYmFjayh0aGlzLl9lbGVtZW50LCBcIm1vdXNlbGVhdmVcIikpO1xuICAgICAgICAgICAgdGhpcy4gX29uTW91c2VXaGVlbCA9IG5ldyBFdmVudDxNb3VzZUV2ZW50PihuZXcgSHRtbEV2ZW50TGlzdGVuZXJDYWxsYmFjayh0aGlzLl9lbGVtZW50LCBcIm1vdXNld2hlZWxcIikpO1xuICAgICAgICAgICAgdGhpcy4gX29uS2V5RG93biA9IG5ldyBFdmVudDxLZXlib2FyZEV2ZW50PihuZXcgSHRtbEV2ZW50TGlzdGVuZXJDYWxsYmFjayh0aGlzLl9lbGVtZW50LCBcImtleWRvd25cIikpO1xuICAgICAgICAgICAgdGhpcy4gX29uS2V5UHJlc3MgPSBuZXcgRXZlbnQ8S2V5Ym9hcmRFdmVudD4obmV3IEh0bWxFdmVudExpc3RlbmVyQ2FsbGJhY2sodGhpcy5fZWxlbWVudCwgXCJrZXlwcmVzc1wiKSk7XG4gICAgICAgICAgICB0aGlzLiBfb25LZXlVcCA9IG5ldyBFdmVudDxLZXlib2FyZEV2ZW50PihuZXcgSHRtbEV2ZW50TGlzdGVuZXJDYWxsYmFjayh0aGlzLl9lbGVtZW50LCBcImtleXVwXCIpKTtcbiAgICAgICAgICAgIHRoaXMuIF9vbkNvbnRleHRNZW51ID0gbmV3IEV2ZW50PE9iamVjdD4obmV3IEh0bWxFdmVudExpc3RlbmVyQ2FsbGJhY2sodGhpcy5fZWxlbWVudCwgXCJjb250ZXh0bWVudVwiKSk7XG5cbiAgICAgICAgICAgIHRoaXMuX29uTW91c2VFbnRlci5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5faG92ZXJlZFNldHRlci52YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX29uTW91c2VMZWF2ZS5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5faG92ZXJlZFNldHRlci52YWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9vbk1vdXNlRG93bi5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJlc3NlZFNldHRlci52YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX29uTW91c2VVcC5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJlc3NlZFNldHRlci52YWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHByaXZhdGUgZ2V0Q2xhc3NOYW1lKCkge1xuICAgICAgICAgICAgdmFyIGZ1bmNOYW1lUmVnZXggPSAvZnVuY3Rpb24gKC57MSx9KVxcKC87XG4gICAgICAgICAgICB2YXIgcmVzdWx0cyAgPSAoZnVuY05hbWVSZWdleCkuZXhlYyh0aGlzW1wiY29uc3RydWN0b3JcIl0udG9TdHJpbmcoKSk7XG4gICAgICAgICAgICByZXR1cm4gKHJlc3VsdHMgJiYgcmVzdWx0cy5sZW5ndGggPiAxKSA/IHJlc3VsdHNbMV0gOiBcIlwiO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBpbnZva2VQb3N0Q29uc3RydWN0KCkge1xuICAgICAgICAgICAgdGhpcy5fcG9zdENvbnN0cnVjdFJ1bk9uY2UucnVuKCk7IFxuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIHBvc3RDb25zdHJ1Y3QoKSB7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzZXRDdWJlZVBhbmVsKGN1YmVlUGFuZWw6IEN1YmVlUGFuZWwpIHtcbiAgICAgICAgICAgIHRoaXMuX2N1YmVlUGFuZWwgPSBjdWJlZVBhbmVsO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0Q3ViZWVQYW5lbCgpOiBDdWJlZVBhbmVsIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jdWJlZVBhbmVsICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY3ViZWVQYW5lbDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXRDdWJlZVBhbmVsKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB1cGRhdGVUcmFuc2Zvcm0oKSB7XG4gICAgICAgICAgICB2YXIgYW5nbGUgPSB0aGlzLl9yb3RhdGUudmFsdWU7XG4gICAgICAgICAgICBhbmdsZSA9IGFuZ2xlIC0gKGFuZ2xlIHwgMCk7XG4gICAgICAgICAgICBhbmdsZSA9IGFuZ2xlICogMzYwO1xuICAgICAgICAgICAgdmFyIGFuZ2xlU3RyID0gYW5nbGUgKyBcImRlZ1wiO1xuXG4gICAgICAgICAgICB2YXIgY2VudGVyWCA9ICh0aGlzLl90cmFuc2Zvcm1DZW50ZXJYLnZhbHVlICogMTAwKSArIFwiJVwiO1xuICAgICAgICAgICAgdmFyIGNlbnRlclkgPSAodGhpcy5fdHJhbnNmb3JtQ2VudGVyWS52YWx1ZSAqIDEwMCkgKyBcIiVcIjtcblxuICAgICAgICAgICAgdmFyIHNYID0gdGhpcy5fc2NhbGVYLnZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB2YXIgc1kgPSB0aGlzLl9zY2FsZVkudmFsdWUudG9TdHJpbmcoKTtcblxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSBjZW50ZXJYICsgXCIgXCIgKyBjZW50ZXJZO1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZShcIiArIHRoaXMuX3RyYW5zbGF0ZVgudmFsdWUgKyBcInB4LCBcIiArIHRoaXMuX3RyYW5zbGF0ZVkudmFsdWVcbiAgICAgICAgICAgICsgXCJweCkgcm90YXRlKFwiICsgYW5nbGVTdHIgKyBcIikgc2NhbGVYKCBcIiArIHNYICsgXCIpIHNjYWxlWShcIiArIHNZICsgXCIpXCI7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLmJhY2tmYWNlVmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgICAgIH1cblxuICAgICAgICByZXF1ZXN0TGF5b3V0KCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9uZWVkc0xheW91dCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX25lZWRzTGF5b3V0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fcGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFyZW50LnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2N1YmVlUGFuZWwgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdWJlZVBhbmVsLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBQb3B1cHMuX3JlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBtZWFzdXJlKCkge1xuICAgICAgICAgICAgdGhpcy5vbk1lYXN1cmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgb25NZWFzdXJlKCkge1xuICAgICAgICAgICAgLy8gY2FsY3VsYXRpbmcgY2xpZW50IGJvdW5kc1xuICAgICAgICAgICAgdmFyIGN3ID0gdGhpcy5fZWxlbWVudC5jbGllbnRXaWR0aDtcbiAgICAgICAgICAgIHZhciBjaCA9IHRoaXMuX2VsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICAgICAgICAgICAgdmFyIHAgPSB0aGlzLl9wYWRkaW5nLnZhbHVlO1xuICAgICAgICAgICAgaWYgKHAgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGN3ID0gY3cgLSBwLmxlZnQgLSBwLnJpZ2h0O1xuICAgICAgICAgICAgICAgIGNoID0gY2ggLSBwLnRvcCAtIHAuYm90dG9tO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fY2xpZW50V2lkdGhTZXR0ZXIudmFsdWUgPSBjdztcbiAgICAgICAgICAgIHRoaXMuX2NsaWVudEhlaWdodFNldHRlci52YWx1ZSA9IGNoO1xuXG4gICAgICAgICAgICAvLyBjYWxjdWxhdGluZyBtZWFzdXJlZCBib3VuZHNcbiAgICAgICAgICAgIHZhciBtdyA9IHRoaXMuX2VsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICB2YXIgbWggPSB0aGlzLl9lbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgIHRoaXMuX21lYXN1cmVkV2lkdGhTZXR0ZXIudmFsdWUgPSBtdztcbiAgICAgICAgICAgIHRoaXMuX21lYXN1cmVkSGVpZ2h0U2V0dGVyLnZhbHVlID0gbWg7XG5cbiAgICAgICAgICAgIC8vIGNhbGN1bGF0aW5nIHBhcmVudCBib3VuZHNcbiAgICAgICAgICAgIHZhciB0Y3ggPSB0aGlzLl90cmFuc2Zvcm1DZW50ZXJYLnZhbHVlO1xuICAgICAgICAgICAgdmFyIHRjeSA9IHRoaXMuX3RyYW5zZm9ybUNlbnRlclkudmFsdWU7XG5cbiAgICAgICAgICAgIHZhciBieCA9IDA7XG4gICAgICAgICAgICB2YXIgYnkgPSAwO1xuICAgICAgICAgICAgdmFyIGJ3ID0gbXc7XG4gICAgICAgICAgICB2YXIgYmggPSBtaDtcblxuICAgICAgICAgICAgdmFyIHRsID0gbmV3IFBvaW50MkQoMCwgMCk7XG4gICAgICAgICAgICB2YXIgdHIgPSBuZXcgUG9pbnQyRChtdywgMCk7XG4gICAgICAgICAgICB2YXIgYnIgPSBuZXcgUG9pbnQyRChtdywgbWgpO1xuICAgICAgICAgICAgdmFyIGJsID0gbmV3IFBvaW50MkQoMCwgbWgpO1xuXG4gICAgICAgICAgICB2YXIgY3ggPSAobXcgKiB0Y3gpIHwgMDtcbiAgICAgICAgICAgIHZhciBjeSA9IChtaCAqIHRjeSkgfCAwO1xuXG4gICAgICAgICAgICB2YXIgcm90ID0gdGhpcy5fcm90YXRlLnZhbHVlO1xuICAgICAgICAgICAgaWYgKHJvdCAhPSAwLjApIHtcbiAgICAgICAgICAgICAgICB0bCA9IHRoaXMucm90YXRlUG9pbnQoY3gsIGN5LCAwLCAwLCByb3QpO1xuICAgICAgICAgICAgICAgIHRyID0gdGhpcy5yb3RhdGVQb2ludChjeCwgY3ksIGJ3LCAwLCByb3QpO1xuICAgICAgICAgICAgICAgIGJyID0gdGhpcy5yb3RhdGVQb2ludChjeCwgY3ksIGJ3LCBiaCwgcm90KTtcbiAgICAgICAgICAgICAgICBibCA9IHRoaXMucm90YXRlUG9pbnQoY3gsIGN5LCAwLCBiaCwgcm90KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHN4ID0gdGhpcy5fc2NhbGVYLnZhbHVlO1xuICAgICAgICAgICAgdmFyIHN5ID0gdGhpcy5fc2NhbGVZLnZhbHVlO1xuXG4gICAgICAgICAgICBpZiAoc3ggIT0gMS4wIHx8IHN5ICE9IDEuMCkge1xuICAgICAgICAgICAgICAgIHRsID0gdGhpcy5zY2FsZVBvaW50KGN4LCBjeSwgdGwueCwgdGwueSwgc3gsIHN5KTtcbiAgICAgICAgICAgICAgICB0ciA9IHRoaXMuc2NhbGVQb2ludChjeCwgY3ksIHRyLngsIHRyLnksIHN4LCBzeSk7XG4gICAgICAgICAgICAgICAgYnIgPSB0aGlzLnNjYWxlUG9pbnQoY3gsIGN5LCBici54LCBici55LCBzeCwgc3kpO1xuICAgICAgICAgICAgICAgIGJsID0gdGhpcy5zY2FsZVBvaW50KGN4LCBjeSwgYmwueCwgYmwueSwgc3gsIHN5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG1pblggPSBNYXRoLm1pbihNYXRoLm1pbih0bC54LCB0ci54KSwgTWF0aC5taW4oYnIueCwgYmwueCkpO1xuICAgICAgICAgICAgdmFyIG1pblkgPSBNYXRoLm1pbihNYXRoLm1pbih0bC55LCB0ci55KSwgTWF0aC5taW4oYnIueSwgYmwueSkpO1xuICAgICAgICAgICAgdmFyIG1heFggPSBNYXRoLm1heChNYXRoLm1heCh0bC54LCB0ci54KSwgTWF0aC5tYXgoYnIueCwgYmwueCkpO1xuICAgICAgICAgICAgdmFyIG1heFkgPSBNYXRoLm1heChNYXRoLm1heCh0bC55LCB0ci55KSwgTWF0aC5tYXgoYnIueSwgYmwueSkpO1xuICAgICAgICAgICAgYncgPSBtYXhYIC0gbWluWDtcbiAgICAgICAgICAgIGJoID0gbWF4WSAtIG1pblk7XG4gICAgICAgICAgICBieCA9IG1pblg7XG4gICAgICAgICAgICBieSA9IG1pblk7XG5cbiAgICAgICAgICAgIHRoaXMuX2JvdW5kc0xlZnRTZXR0ZXIudmFsdWUgPSBieDtcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kc1RvcFNldHRlci52YWx1ZSA9IGJ5O1xuICAgICAgICAgICAgdGhpcy5fYm91bmRzV2lkdGhTZXR0ZXIudmFsdWUgPSBidztcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kc0hlaWdodFNldHRlci52YWx1ZSA9IGJoO1xuICAgICAgICB9XG5cbiAgICAgICAgc2NhbGVQb2ludChjZW50ZXJYOiBudW1iZXIsIGNlbnRlclk6IG51bWJlciwgcG9pbnRYOiBudW1iZXIsIHBvaW50WTogbnVtYmVyLCBzY2FsZVg6IG51bWJlciwgc2NhbGVZOiBudW1iZXIpIHtcbiAgICAgICAgICAgIHZhciByZXNYID0gKGNlbnRlclggKyAoKHBvaW50WCAtIGNlbnRlclgpICogc2NhbGVYKSkgfCAwO1xuICAgICAgICAgICAgdmFyIHJlc1kgPSAoY2VudGVyWSArICgocG9pbnRZIC0gY2VudGVyWSkgKiBzY2FsZVkpKSB8IDA7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFBvaW50MkQocmVzWCwgcmVzWSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHJvdGF0ZVBvaW50KGN4OiBudW1iZXIsIGN5OiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyLCBhbmdsZTogbnVtYmVyKSB7XG4gICAgICAgICAgICBhbmdsZSA9IChhbmdsZSAqIDM2MCkgKiAoTWF0aC5QSSAvIDE4MCk7XG4gICAgICAgICAgICB4ID0geCAtIGN4O1xuICAgICAgICAgICAgeSA9IHkgLSBjeTtcbiAgICAgICAgICAgIHZhciBzaW4gPSBNYXRoLnNpbihhbmdsZSk7XG4gICAgICAgICAgICB2YXIgY29zID0gTWF0aC5jb3MoYW5nbGUpO1xuICAgICAgICAgICAgdmFyIHJ4ID0gKChjb3MgKiB4KSAtIChzaW4gKiB5KSkgfCAwO1xuICAgICAgICAgICAgdmFyIHJ5ID0gKChzaW4gKiB4KSArIChjb3MgKiB5KSkgfCAwO1xuICAgICAgICAgICAgcnggPSByeCArIGN4O1xuICAgICAgICAgICAgcnkgPSByeSArIGN5O1xuXG4gICAgICAgICAgICByZXR1cm4gbmV3IFBvaW50MkQocngsIHJ5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBlbGVtZW50KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgcGFyZW50KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBfc2V0UGFyZW50KHBhcmVudDogQUxheW91dCkge1xuICAgICAgICAgICAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgbGF5b3V0KCkge1xuICAgICAgICAgICAgdGhpcy5fbmVlZHNMYXlvdXQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMubWVhc3VyZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IG5lZWRzTGF5b3V0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX25lZWRzTGF5b3V0O1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFRyYW5zbGF0ZVgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNsYXRlWDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdHJhbnNsYXRlWCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlRyYW5zbGF0ZVgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHRyYW5zbGF0ZVgodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVHJhbnNsYXRlWC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFRyYW5zbGF0ZVkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNsYXRlWTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdHJhbnNsYXRlWSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlRyYW5zbGF0ZVkudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHRyYW5zbGF0ZVkodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVHJhbnNsYXRlWS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBwcm90ZWN0ZWQgcGFkZGluZ1Byb3BlcnR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhZGRpbmc7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGdldCBQYWRkaW5nKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFkZGluZ1Byb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGdldCBwYWRkaW5nKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuUGFkZGluZy52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgc2V0IHBhZGRpbmcodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuUGFkZGluZy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIGJvcmRlclByb3BlcnR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvcmRlcjtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IEJvcmRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJvcmRlclByb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGdldCBib3JkZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Cb3JkZXIudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIHNldCBib3JkZXIodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQm9yZGVyLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgTWVhc3VyZWRXaWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tZWFzdXJlZFdpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGdldCBtZWFzdXJlZFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuTWVhc3VyZWRXaWR0aC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgbWVhc3VyZWRXaWR0aCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5NZWFzdXJlZFdpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgTWVhc3VyZWRIZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbWVhc3VyZWRIZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IG1lYXN1cmVkSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuTWVhc3VyZWRIZWlnaHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IG1lYXN1cmVkSGVpZ2h0KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLk1lYXN1cmVkSGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQ2xpZW50V2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2xpZW50V2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGNsaWVudFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQ2xpZW50V2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGNsaWVudFdpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkNsaWVudFdpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQ2xpZW50SGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NsaWVudEhlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgY2xpZW50SGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQ2xpZW50SGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBjbGllbnRIZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQ2xpZW50SGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm91bmRzV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYm91bmRzV2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJvdW5kc1dpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm91bmRzV2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGJvdW5kc1dpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkJvdW5kc1dpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm91bmRzSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvdW5kc0hlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm91bmRzSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm91bmRzSGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBib3VuZHNIZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQm91bmRzSGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm91bmRzTGVmdCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib3VuZHNMZWZ0O1xuICAgICAgICB9XG4gICAgICAgIGdldCBib3VuZHNMZWZ0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm91bmRzTGVmdC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYm91bmRzTGVmdCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Cb3VuZHNMZWZ0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm91bmRzVG9wKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvdW5kc1RvcDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm91bmRzVG9wKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm91bmRzVG9wLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBib3VuZHNUb3AodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQm91bmRzVG9wLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgbWluV2lkdGhQcm9wZXJ0eSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9taW5XaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IE1pbldpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWluV2lkdGhQcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBnZXQgbWluV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5NaW5XaWR0aC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgc2V0IG1pbldpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLk1pbldpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHByb3RlY3RlZCBtaW5IZWlnaHRQcm9wZXJ0eSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9taW5IZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGdldCBNaW5IZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5taW5IZWlnaHRQcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBnZXQgbWluSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuTWluSGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBzZXQgbWluSGVpZ2h0KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLk1pbkhlaWdodC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cblxuICAgICAgICBwcm90ZWN0ZWQgbWF4V2lkdGhQcm9wZXJ0eSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tYXhXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IE1heFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF4V2lkdGhQcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBnZXQgbWF4V2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5NYXhXaWR0aC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgc2V0IG1heFdpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLk1heFdpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHByb3RlY3RlZCBtYXhIZWlnaHRQcm9wZXJ0eSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tYXhIZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGdldCBNYXhIZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXhIZWlnaHRQcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBnZXQgbWF4SGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuTWF4SGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBzZXQgbWF4SGVpZ2h0KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLk1heEhlaWdodC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0cyB0aGUgYmFzZSBwb3NpdGlvbiBvZiB0aGlzIGNvbXBvbmVudCByZWxhdGl2ZSB0byB0aGUgcGFyZW50J3MgdG9wLWxlZnQgY29ybmVyLiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgZnJvbSBhXG4gICAgICAgICAqIGxheW91dCdzIG9uTGF5b3V0IG1ldGhvZCB0byBzZXQgdGhlIGJhc2UgcG9zaXRpb24gb2YgdGhpcyBjb21wb25lbnQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBsZWZ0IFRoZSBsZWZ0IGJhc2UgcG9zaXRpb24gb2YgdGhpcyBjb21wb25lbnQgcmVsYXRpdmUgdG8gdGhlIHBhcmVudHMgdG9wLWxlZnQgY29ybmVyLlxuICAgICAgICAgKiBAcGFyYW0gdG9wIFRoZSB0b3AgYmFzZSBwb3NpdGlvbiBvZiB0aGlzIGNvbXBvbmVudCByZWxhdGl2ZSB0byB0aGUgcGFyZW50cyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqL1xuICAgICAgICBwcm90ZWN0ZWQgc2V0UG9zaXRpb24obGVmdDogbnVtYmVyLCB0b3A6IG51bWJlcikge1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5sZWZ0ID0gXCJcIiArIGxlZnQgKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnRvcCA9IFwiXCIgKyB0b3AgKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLl9sZWZ0ID0gbGVmdDtcbiAgICAgICAgICAgIHRoaXMuX3RvcCA9IHRvcDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIHRoZSBiYXNlIGxlZnQgcG9zaXRpb24gb2YgdGhpcyBjb21wb25lbnQgcmVsYXRpdmUgdG8gdGhlIHBhcmVudCdzIHRvcC1sZWZ0IGNvcm5lci4gVGhpcyBtZXRob2QgaXMgY2FsbGVkXG4gICAgICAgICAqIGZyb20gYSBsYXlvdXQncyBvbkxheW91dCBtZXRob2QgdG8gc2V0IHRoZSBiYXNlIGxlZnQgcG9zaXRpb24gb2YgdGhpcyBjb21wb25lbnQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBsZWZ0IFRoZSBsZWZ0IGJhc2UgcG9zaXRpb24gb2YgdGhpcyBjb21wb25lbnQgcmVsYXRpdmUgdG8gdGhlIHBhcmVudHMgdG9wLWxlZnQgY29ybmVyLlxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIF9zZXRMZWZ0KGxlZnQ6IG51bWJlcikge1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5sZWZ0ID0gXCJcIiArIGxlZnQgKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLl9sZWZ0ID0gbGVmdDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIHRoZSBiYXNlIHRvcCBwb3NpdGlvbiBvZiB0aGlzIGNvbXBvbmVudCByZWxhdGl2ZSB0byB0aGUgcGFyZW50J3MgdG9wLWxlZnQgY29ybmVyLiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgZnJvbVxuICAgICAgICAgKiBhIGxheW91dCdzIG9uTGF5b3V0IG1ldGhvZCB0byBzZXQgdGhlIGJhc2UgdG9wIHBvc2l0aW9uIG9mIHRoaXMgY29tcG9uZW50LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gdG9wIFRoZSB0b3AgYmFzZSBwb3NpdGlvbiBvZiB0aGlzIGNvbXBvbmVudCByZWxhdGl2ZSB0byB0aGUgcGFyZW50cyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgX3NldFRvcCh0b3A6IG51bWJlcikge1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS50b3AgPSBcIlwiICsgdG9wICsgXCJweFwiO1xuICAgICAgICAgICAgdGhpcy5fdG9wID0gdG9wO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgdGhlIHNpemUgb2YgdGhpcyBjb21wb25lbnQuIFRoaXMgbWV0aG9kIGNhbiBiZSBjYWxsZWQgd2hlbiBhIGR5bmFtaWNhbGx5IHNpemVkIGNvbXBvbmVudCdzIHNpemUgaXNcbiAgICAgICAgICogY2FsY3VsYXRlZC4gVHlwaWNhbGx5IGZyb20gdGhlIG9uTGF5b3V0IG1ldGhvZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHdpZHRoIFRoZSB3aWR0aCBvZiB0aGlzIGNvbXBvbmVudC5cbiAgICAgICAgICogQHBhcmFtIGhlaWdodCBUaGUgaGVpZ2h0IG9mIHRoaXMgY29tcG9uZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgcHJvdGVjdGVkIHNldFNpemUod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUud2lkdGggPSBcIlwiICsgd2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLmhlaWdodCA9IFwiXCIgKyBoZWlnaHQgKyBcInB4XCI7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQ3Vyc29yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnNvcjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgY3Vyc29yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQ3Vyc29yLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBjdXJzb3IodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQ3Vyc29yLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgUG9pbnRlclRyYW5zcGFyZW50KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BvaW50ZXJUcmFuc3BhcmVudDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgcG9pbnRlclRyYW5zcGFyZW50KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuUG9pbnRlclRyYW5zcGFyZW50LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBwb2ludGVyVHJhbnNwYXJlbnQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuUG9pbnRlclRyYW5zcGFyZW50LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVmlzaWJsZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92aXNpYmxlO1xuICAgICAgICB9XG4gICAgICAgIGdldCB2aXNpYmxlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVmlzaWJsZS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdmlzaWJsZSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5WaXNpYmxlLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgb25DbGljaygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbkNsaWNrO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IG9uQ29udGV4dE1lbnUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25Db250ZXh0TWVudTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBvbk1vdXNlRG93bigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbk1vdXNlRG93bjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBvbk1vdXNlTW92ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbk1vdXNlTW92ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBvbk1vdXNlVXAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25Nb3VzZVVwO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IG9uTW91c2VFbnRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbk1vdXNlRW50ZXI7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgb25Nb3VzZUxlYXZlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX29uTW91c2VMZWF2ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBvbk1vdXNlV2hlZWwoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25Nb3VzZVdoZWVsO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IG9uS2V5RG93bigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbktleURvd247XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgb25LZXlQcmVzcygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbktleVByZXNzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IG9uS2V5VXAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25LZXlVcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBvblBhcmVudENoYW5nZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25QYXJlbnRDaGFuZ2VkO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEFscGhhKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FscGhhO1xuICAgICAgICB9XG4gICAgICAgIGdldCBhbHBoYSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkFscGhhLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBhbHBoYSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5BbHBoYS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEhhbmRsZVBvaW50ZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGFuZGxlUG9pbnRlcjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgaGFuZGxlUG9pbnRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkhhbmRsZVBvaW50ZXIudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGhhbmRsZVBvaW50ZXIodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuSGFuZGxlUG9pbnRlci52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEVuYWJsZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZW5hYmxlZDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgZW5hYmxlZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkVuYWJsZWQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGVuYWJsZWQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuRW5hYmxlZC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFNlbGVjdGFibGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0YWJsZTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgc2VsZWN0YWJsZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlNlbGVjdGFibGUudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHNlbGVjdGFibGUodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0YWJsZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cblxuICAgICAgICBnZXQgbGVmdCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sZWZ0O1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHRvcCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90b3A7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgUm90YXRlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JvdGF0ZTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgcm90YXRlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuUm90YXRlLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCByb3RhdGUodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuUm90YXRlLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgU2NhbGVYKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NjYWxlWDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgc2NhbGVYKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuU2NhbGVYLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBzY2FsZVgodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuU2NhbGVYLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgU2NhbGVZKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NjYWxlWTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgc2NhbGVZKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuU2NhbGVZLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBzY2FsZVkodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuU2NhbGVZLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVHJhbnNmb3JtQ2VudGVyWCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90cmFuc2Zvcm1DZW50ZXJYO1xuICAgICAgICB9XG4gICAgICAgIGdldCB0cmFuc2Zvcm1DZW50ZXJYKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVHJhbnNmb3JtQ2VudGVyWC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdHJhbnNmb3JtQ2VudGVyWCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5UcmFuc2Zvcm1DZW50ZXJYLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVHJhbnNmb3JtQ2VudGVyWSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90cmFuc2Zvcm1DZW50ZXJZO1xuICAgICAgICB9XG4gICAgICAgIGdldCB0cmFuc2Zvcm1DZW50ZXJZKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVHJhbnNmb3JtQ2VudGVyWS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdHJhbnNmb3JtQ2VudGVyWSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5UcmFuc2Zvcm1DZW50ZXJZLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgSG92ZXJlZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ob3ZlcmVkO1xuICAgICAgICB9XG4gICAgICAgIGdldCBob3ZlcmVkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuSG92ZXJlZC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgaG92ZXJlZCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Ib3ZlcmVkLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgUHJlc3NlZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wcmVzc2VkO1xuICAgICAgICB9XG4gICAgICAgIGdldCBwcmVzc2VkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuUHJlc3NlZC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgcHJlc3NlZCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5QcmVzc2VkLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfVxuXG59XG5cblxuIiwibmFtZXNwYWNlIGN1YmVlIHtcblxuICAgIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBTGF5b3V0IGV4dGVuZHMgQUNvbXBvbmVudCB7XG4gICAgICAgIHByaXZhdGUgX2NoaWxkcmVuID0gbmV3IExheW91dENoaWxkcmVuKHRoaXMpO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICBzdXBlcihlbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBnZXQgY2hpbGRyZW5faW5uZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW47XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgYWJzdHJhY3QgX29uQ2hpbGRBZGRlZChjaGlsZDogQUNvbXBvbmVudCk6IHZvaWQ7XG5cbiAgICAgICAgcHVibGljIGFic3RyYWN0IF9vbkNoaWxkUmVtb3ZlZChjaGlsZDogQUNvbXBvbmVudCwgaW5kZXg6IG51bWJlcik6IHZvaWQ7XG5cbiAgICAgICAgcHVibGljIGFic3RyYWN0IF9vbkNoaWxkcmVuQ2xlYXJlZCgpOiB2b2lkO1xuXG4gICAgICAgIGxheW91dCgpIHtcbiAgICAgICAgICAgIHRoaXMuX25lZWRzTGF5b3V0ID0gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW5faW5uZXIuc2l6ZSgpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGQgPSB0aGlzLmNoaWxkcmVuX2lubmVyLmdldChpKTtcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGQubmVlZHNMYXlvdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLmxheW91dCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5vbkxheW91dCgpO1xuICAgICAgICAgICAgdGhpcy5tZWFzdXJlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgYWJzdHJhY3Qgb25MYXlvdXQoKTogdm9pZDtcblxuICAgICAgICBnZXRDb21wb25lbnRzQXRQb3NpdGlvbih4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgICAgICAgICAgdmFyIHJlczogQUNvbXBvbmVudFtdID0gW107XG4gICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudHNBdFBvc2l0aW9uX2ltcGwodGhpcywgeCwgeSwgcmVzKTtcbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGdldENvbXBvbmVudHNBdFBvc2l0aW9uX2ltcGwocm9vdDogQUxheW91dCwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHJlc3VsdDogQUNvbXBvbmVudFtdKSB7XG4gICAgICAgICAgICBpZiAoeCA+PSAwICYmIHggPD0gcm9vdC5ib3VuZHNXaWR0aCAmJiB5ID49IDAgJiYgeSA8PSByb290LmJvdW5kc0hlaWdodCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5zcGxpY2UoMCwgMCwgcm9vdCk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByb290LmNoaWxkcmVuX2lubmVyLnNpemUoKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb21wb25lbnQgPSByb290LmNoaWxkcmVuX2lubmVyLmdldChpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZXQgdHggPSB4IC0gY29tcG9uZW50LmxlZnQgLSBjb21wb25lbnQudHJhbnNsYXRlWDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHR5ID0geSAtIGNvbXBvbmVudC50b3AgLSBjb21wb25lbnQudHJhbnNsYXRlWTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIEFMYXlvdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50c0F0UG9zaXRpb25faW1wbCg8QUxheW91dD5jb21wb25lbnQsIHR4LCB0eSwgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eCA+PSAwICYmIHR4IDw9IGNvbXBvbmVudC5ib3VuZHNXaWR0aCAmJiB5ID49IDAgJiYgeSA8PSBjb21wb25lbnQuYm91bmRzSGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnNwbGljZSgwLCAwLCBjb21wb25lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIHNldENoaWxkTGVmdChjaGlsZDogQUNvbXBvbmVudCwgbGVmdDogbnVtYmVyKSB7XG4gICAgICAgICAgICBjaGlsZC5fc2V0TGVmdChsZWZ0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBzZXRDaGlsZFRvcChjaGlsZDogQUNvbXBvbmVudCwgdG9wOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGNoaWxkLl9zZXRUb3AodG9wKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG4iLCJuYW1lc3BhY2UgY3ViZWUge1xuXG4gICAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFVc2VyQ29udHJvbCBleHRlbmRzIEFMYXlvdXQge1xuXG4gICAgICAgIHByaXZhdGUgX3dpZHRoID0gbmV3IE51bWJlclByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfaGVpZ2h0ID0gbmV3IE51bWJlclByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYmFja2dyb3VuZCA9IG5ldyBCYWNrZ3JvdW5kUHJvcGVydHkobmV3IENvbG9yQmFja2dyb3VuZChDb2xvci5UUkFOU1BBUkVOVCksIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfc2hhZG93ID0gbmV3IFByb3BlcnR5PEJveFNoYWRvdz4obnVsbCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9kcmFnZ2FibGUgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlKTtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93WCA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUub3ZlcmZsb3dZID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgIHRoaXMuX3dpZHRoLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fd2lkdGgudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJ3aWR0aFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2lkdGggPSBcIlwiICsgdGhpcy5fd2lkdGgudmFsdWUgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl93aWR0aC5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9oZWlnaHQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9oZWlnaHQudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJoZWlnaHRcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmhlaWdodCA9IFwiXCIgKyB0aGlzLl9oZWlnaHQudmFsdWUgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9oZWlnaHQuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYmFja2dyb3VuZENvbG9yXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImJhY2tncm91bmRJbWFnZVwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJiYWNrZ3JvdW5kXCIpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9iYWNrZ3JvdW5kLnZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZC52YWx1ZS5hcHBseSh0aGlzLmVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZC5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9zaGFkb3cuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zaGFkb3cudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJib3hTaGFkb3dcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhZG93LnZhbHVlLmFwcGx5KHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9kcmFnZ2FibGUuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9kcmFnZ2FibGUudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcImRyYWdnYWJsZVwiLCBcInRydWVcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcImRyYWdnYWJsZVwiLCBcImZhbHNlXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZHJhZ2dhYmxlLmludmFsaWRhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCB3aWR0aFByb3BlcnR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dpZHRoO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBnZXQgV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy53aWR0aFByb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGdldCB3aWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLldpZHRoLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBzZXQgd2lkdGgodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuV2lkdGgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG5cblxuICAgICAgICBwcm90ZWN0ZWQgaGVpZ2h0UHJvcGVydHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBnZXQgSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGVpZ2h0UHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IGhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkhlaWdodC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgc2V0IGhlaWdodCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5IZWlnaHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcHJvdGVjdGVkIGJhY2tncm91bmRQcm9wZXJ0eSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9iYWNrZ3JvdW5kO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBnZXQgQmFja2dyb3VuZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJhY2tncm91bmRQcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBnZXQgYmFja2dyb3VuZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkJhY2tncm91bmQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIHNldCBiYWNrZ3JvdW5kKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkJhY2tncm91bmQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcHJvdGVjdGVkIHNoYWRvd1Byb3BlcnR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NoYWRvdztcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IFNoYWRvdygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNoYWRvd1Byb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGdldCBzaGFkb3coKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5TaGFkb3cudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIHNldCBzaGFkb3codmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuU2hhZG93LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGdldCBEcmFnZ2FibGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZHJhZ2dhYmxlO1xuICAgICAgICB9XG4gICAgICAgIGdldCBkcmFnZ2FibGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5EcmFnZ2FibGUudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGRyYWdnYWJsZSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5EcmFnZ2FibGUudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBfb25DaGlsZEFkZGVkKGNoaWxkOiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICBpZiAoY2hpbGQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChjaGlsZC5lbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIF9vbkNoaWxkUmVtb3ZlZChjaGlsZDogQUNvbXBvbmVudCwgaW5kZXg6IG51bWJlcikge1xuICAgICAgICAgICAgaWYgKGNoaWxkICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2hpbGQoY2hpbGQuZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBfb25DaGlsZHJlbkNsZWFyZWQoKSB7XG4gICAgICAgICAgICB2YXIgcm9vdCA9IHRoaXMuZWxlbWVudDtcbiAgICAgICAgICAgIHZhciBlID0gdGhpcy5lbGVtZW50LmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICAgICAgd2hpbGUgKGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJvb3QucmVtb3ZlQ2hpbGQoZSk7XG4gICAgICAgICAgICAgICAgZSA9IHJvb3QuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBvbkxheW91dCgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLndpZHRoICE9IG51bGwgJiYgdGhpcy5oZWlnaHQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U2l6ZSh0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBtYXhXID0gMDtcbiAgICAgICAgICAgICAgICB2YXIgbWF4SCA9IDA7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuX2lubmVyLnNpemUoKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb21wb25lbnQgPSB0aGlzLmNoaWxkcmVuX2lubmVyLmdldChpKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNXID0gY29tcG9uZW50LmJvdW5kc1dpZHRoICsgY29tcG9uZW50LmJvdW5kc0xlZnQgKyBjb21wb25lbnQudHJhbnNsYXRlWDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNIID0gY29tcG9uZW50LmJvdW5kc0hlaWdodCArIGNvbXBvbmVudC5ib3VuZHNUb3AgKyBjb21wb25lbnQudHJhbnNsYXRlWTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoY1cgPiBtYXhXKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXhXID0gY1c7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoY0ggPiBtYXhIKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXhIID0gY0g7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy53aWR0aCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIG1heFcgPSB0aGlzLmhlaWdodDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oZWlnaHQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBtYXhIID0gdGhpcy5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTaXplKG1heFcsIG1heEgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbn1cblxuXG4iLCJuYW1lc3BhY2UgY3ViZWUge1xuICAgIFxuICAgIGV4cG9ydCBjbGFzcyBBVmlldzxUPiBleHRlbmRzIEFVc2VyQ29udHJvbCB7XG4gICAgICAgIFxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9tb2RlbDogVCkge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgZ2V0IG1vZGVsKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21vZGVsO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH1cbiAgICBcbn1cblxuIiwibmFtZXNwYWNlIGN1YmVlIHtcblxuICAgIGV4cG9ydCBjbGFzcyBQYW5lbCBleHRlbmRzIEFVc2VyQ29udHJvbCB7XG4gICAgICAgIFxuICAgICAgICBwcm90ZWN0ZWQgd2lkdGhQcm9wZXJ0eSgpIHtcbiAgICAgICAgICAgIHJldHVybiBzdXBlci53aWR0aFByb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMud2lkdGhQcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIGdldCB3aWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLldpZHRoLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB3aWR0aCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5XaWR0aC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cblxuICAgICAgICBwcm90ZWN0ZWQgaGVpZ2h0UHJvcGVydHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuaGVpZ2h0UHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGVpZ2h0UHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgaGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuSGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBoZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuSGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHByb3RlY3RlZCBiYWNrZ3JvdW5kUHJvcGVydHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuYmFja2dyb3VuZFByb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IEJhY2tncm91bmQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5iYWNrZ3JvdW5kUHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYmFja2dyb3VuZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkJhY2tncm91bmQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGJhY2tncm91bmQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQmFja2dyb3VuZC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cblxuICAgICAgICBwcm90ZWN0ZWQgc2hhZG93UHJvcGVydHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuc2hhZG93UHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgU2hhZG93KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2hhZG93UHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgc2hhZG93KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuU2hhZG93LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBzaGFkb3codmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuU2hhZG93LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBcbiAgICAgICAgcHVibGljIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuX2lubmVyO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH1cblxufVxuIiwibmFtZXNwYWNlIGN1YmVlIHtcblxuICAgIGV4cG9ydCBjbGFzcyBIQm94IGV4dGVuZHMgQUxheW91dCB7XG5cbiAgICAgICAgcHJpdmF0ZSBfaGVpZ2h0ID0gbmV3IE51bWJlclByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfY2VsbFdpZHRoczogbnVtYmVyW10gPSBbXTtcbiAgICAgICAgcHJpdmF0ZSBfaEFsaWduczogRUhBbGlnbltdID0gW107XG4gICAgICAgIHByaXZhdGUgX3ZBbGlnbnM6IEVWQWxpZ25bXSA9IFtdO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgdGhpcy5wb2ludGVyVHJhbnNwYXJlbnQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5faGVpZ2h0LmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHNldENlbGxXaWR0aChpbmRleE9yQ29tcG9uZW50OiBudW1iZXIgfCBBQ29tcG9uZW50LCBjZWxsSGVpZ2h0OiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmIChpbmRleE9yQ29tcG9uZW50IGluc3RhbmNlb2YgQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q2VsbFdpZHRoKHRoaXMuY2hpbGRyZW5faW5uZXIuaW5kZXhPZihpbmRleE9yQ29tcG9uZW50KSwgY2VsbEhlaWdodCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNldEluTGlzdCh0aGlzLl9jZWxsV2lkdGhzLCA8bnVtYmVyPmluZGV4T3JDb21wb25lbnQsIGNlbGxIZWlnaHQpO1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0Q2VsbFdpZHRoKGluZGV4T3JDb21wb25lbnQ6IG51bWJlciB8IEFDb21wb25lbnQpOiBudW1iZXIge1xuICAgICAgICAgICAgaWYgKGluZGV4T3JDb21wb25lbnQgaW5zdGFuY2VvZiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2VsbFdpZHRoKHRoaXMuY2hpbGRyZW5faW5uZXIuaW5kZXhPZihpbmRleE9yQ29tcG9uZW50KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRGcm9tTGlzdCh0aGlzLl9jZWxsV2lkdGhzLCA8bnVtYmVyPmluZGV4T3JDb21wb25lbnQpO1xuICAgIH1cbiAgICBcbiAgICBwdWJsaWMgc2V0Q2VsbEhBbGlnbihpbmRleE9yQ29tcG9uZW50OiBudW1iZXIgfCBBQ29tcG9uZW50LCBoQWxpZ246IEVIQWxpZ24pIHtcbiAgICAgICAgICAgIGlmIChpbmRleE9yQ29tcG9uZW50IGluc3RhbmNlb2YgQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q2VsbEhBbGlnbih0aGlzLmNoaWxkcmVuX2lubmVyLmluZGV4T2YoaW5kZXhPckNvbXBvbmVudCksIGhBbGlnbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNldEluTGlzdCh0aGlzLl9oQWxpZ25zLCA8bnVtYmVyPmluZGV4T3JDb21wb25lbnQsIGhBbGlnbik7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgcHVibGljIGdldENlbGxIQWxpZ24oaW5kZXhPckNvbXBvbmVudDogbnVtYmVyIHwgQUNvbXBvbmVudCk6IEVIQWxpZ24ge1xuICAgICAgICAgICAgaWYgKGluZGV4T3JDb21wb25lbnQgaW5zdGFuY2VvZiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2VsbEhBbGlnbih0aGlzLmNoaWxkcmVuX2lubmVyLmluZGV4T2YoaW5kZXhPckNvbXBvbmVudCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RnJvbUxpc3QodGhpcy5faEFsaWducywgPG51bWJlcj5pbmRleE9yQ29tcG9uZW50KTtcbiAgICB9XG4gICAgXG4gICAgcHVibGljIHNldENlbGxWQWxpZ24oaW5kZXhPckNvbXBvbmVudDogbnVtYmVyIHwgQUNvbXBvbmVudCwgdkFsaWduOiBFVkFsaWduKSB7XG4gICAgICAgICAgICBpZiAoaW5kZXhPckNvbXBvbmVudCBpbnN0YW5jZW9mIEFDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldENlbGxWQWxpZ24odGhpcy5jaGlsZHJlbl9pbm5lci5pbmRleE9mKGluZGV4T3JDb21wb25lbnQpLCB2QWxpZ24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZXRJbkxpc3QodGhpcy5fdkFsaWducywgPG51bWJlcj5pbmRleE9yQ29tcG9uZW50LCB2QWxpZ24pO1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgIH1cblxuICAgIHB1YmxpYyBnZXRDZWxsVkFsaWduKGluZGV4T3JDb21wb25lbnQ6IG51bWJlciB8IEFDb21wb25lbnQpOiBFVkFsaWduIHtcbiAgICAgICAgICAgIGlmIChpbmRleE9yQ29tcG9uZW50IGluc3RhbmNlb2YgQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldENlbGxWQWxpZ24odGhpcy5jaGlsZHJlbl9pbm5lci5pbmRleE9mKGluZGV4T3JDb21wb25lbnQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEZyb21MaXN0KHRoaXMuX3ZBbGlnbnMsIDxudW1iZXI+aW5kZXhPckNvbXBvbmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHNldExhc3RDZWxsSEFsaWduKGhBbGlnbjogRUhBbGlnbikge1xuICAgICAgICB0aGlzLnNldENlbGxIQWxpZ24odGhpcy5jaGlsZHJlbl9pbm5lci5zaXplKCkgLSAxLCBoQWxpZ24pO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRMYXN0Q2VsbFZBbGlnbih2QWxpZ246IEVWQWxpZ24pIHtcbiAgICAgICAgdGhpcy5zZXRDZWxsVkFsaWduKHRoaXMuY2hpbGRyZW5faW5uZXIuc2l6ZSgpIC0gMSwgdkFsaWduKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0TGFzdENlbGxXaWR0aCh3aWR0aDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuc2V0Q2VsbFdpZHRoKHRoaXMuY2hpbGRyZW5faW5uZXIuc2l6ZSgpIC0gMSwgd2lkdGgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhZGRFbXB0eUNlbGwod2lkdGg6IG51bWJlcikge1xuICAgICAgICB0aGlzLmNoaWxkcmVuX2lubmVyLmFkZChudWxsKTtcbiAgICAgICAgdGhpcy5zZXRDZWxsV2lkdGgodGhpcy5jaGlsZHJlbl9pbm5lci5zaXplKCkgLSAxLCB3aWR0aCk7XG4gICAgfVxuXG4gICAgX29uQ2hpbGRBZGRlZChjaGlsZDogQUNvbXBvbmVudCkge1xuICAgICAgICBpZiAoY2hpbGQgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKGNoaWxkLmVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgIH1cblxuICAgIF9vbkNoaWxkUmVtb3ZlZChjaGlsZDogQUNvbXBvbmVudCwgaW5kZXg6IG51bWJlcikge1xuICAgICAgICBpZiAoY2hpbGQgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNoaWxkKGNoaWxkLmVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVtb3ZlRnJvbUxpc3QodGhpcy5faEFsaWducywgaW5kZXgpO1xuICAgICAgICB0aGlzLnJlbW92ZUZyb21MaXN0KHRoaXMuX3ZBbGlnbnMsIGluZGV4KTtcbiAgICAgICAgdGhpcy5yZW1vdmVGcm9tTGlzdCh0aGlzLl9jZWxsV2lkdGhzLCBpbmRleCk7XG4gICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgIH1cblxuICAgIF9vbkNoaWxkcmVuQ2xlYXJlZCgpIHtcbiAgICAgICAgbGV0IHJvb3QgPSB0aGlzLmVsZW1lbnQ7XG4gICAgICAgIGxldCBlID0gdGhpcy5lbGVtZW50LmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICB3aGlsZSAoZSAhPSBudWxsKSB7XG4gICAgICAgICAgICByb290LnJlbW92ZUNoaWxkKGUpO1xuICAgICAgICAgICAgZSA9IHJvb3QuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5faEFsaWducyA9IFtdO1xuICAgICAgICB0aGlzLl92QWxpZ25zID0gW107XG4gICAgICAgIHRoaXMuX2NlbGxXaWR0aHMgPSBbXTtcbiAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG9uTGF5b3V0KCkge1xuICAgICAgICB2YXIgbWF4SGVpZ2h0ID0gLTE7XG4gICAgICAgIGlmICh0aGlzLmhlaWdodCAhPSBudWxsKSB7XG4gICAgICAgICAgICBtYXhIZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhY3RXID0gMDtcbiAgICAgICAgdmFyIG1heEggPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4uc2l6ZSgpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBjaGlsZFggPSAwO1xuICAgICAgICAgICAgbGV0IGNoaWxkID0gdGhpcy5jaGlsZHJlbi5nZXQoaSk7XG4gICAgICAgICAgICBsZXQgY2VsbFcgPSB0aGlzLmdldENlbGxXaWR0aChpKTtcbiAgICAgICAgICAgIGxldCBoQWxpZ24gPSB0aGlzLmdldENlbGxIQWxpZ24oaSk7XG4gICAgICAgICAgICBsZXQgcmVhbENlbGxXID0gLTE7XG4gICAgICAgICAgICBpZiAoY2VsbFcgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJlYWxDZWxsVyA9IGNlbGxXO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY2hpbGQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmIChyZWFsQ2VsbFcgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGFjdFcgKz0gcmVhbENlbGxXO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy9jaGlsZC5sYXlvdXQoKTtcbiAgICAgICAgICAgICAgICBsZXQgY3cgPSBjaGlsZC5ib3VuZHNXaWR0aDtcbiAgICAgICAgICAgICAgICBsZXQgY2ggPSBjaGlsZC5ib3VuZHNIZWlnaHQ7XG4gICAgICAgICAgICAgICAgbGV0IGNsID0gY2hpbGQudHJhbnNsYXRlWDtcbiAgICAgICAgICAgICAgICBsZXQgY3QgPSBjaGlsZC50cmFuc2xhdGVZO1xuICAgICAgICAgICAgICAgIGxldCBjYWxjdWxhdGVkQ2VsbFcgPSByZWFsQ2VsbFc7XG4gICAgICAgICAgICAgICAgaWYgKGNhbGN1bGF0ZWRDZWxsVyA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXRlZENlbGxXID0gY3cgKyBjbDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNhbGN1bGF0ZWRDZWxsVyA8IGN3KSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGF0ZWRDZWxsVyA9IGN3O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNoaWxkWCA9IGFjdFcgLSBjaGlsZC50cmFuc2xhdGVYO1xuXG4gICAgICAgICAgICAgICAgaWYgKGhBbGlnbiA9PSBFSEFsaWduLkNFTlRFUikge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZFggKz0gKGNhbGN1bGF0ZWRDZWxsVyAtIGN3KSAvIDI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChoQWxpZ24gPT0gRUhBbGlnbi5SSUdIVCkge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZFggKz0gKGNhbGN1bGF0ZWRDZWxsVyAtIGN3KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2hpbGQuX3NldExlZnQoY2hpbGRYKTtcblxuICAgICAgICAgICAgICAgIGlmIChjaCArIGN0ID4gbWF4SCkge1xuICAgICAgICAgICAgICAgICAgICBtYXhIID0gY2ggKyBjdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYWN0VyArPSBjYWxjdWxhdGVkQ2VsbFc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcmVhbEhlaWdodCA9IG1heEg7XG4gICAgICAgIGlmIChtYXhIZWlnaHQgPiAtMSkge1xuICAgICAgICAgICAgcmVhbEhlaWdodCA9IG1heEhlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4uc2l6ZSgpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBjaGlsZFkgPSAwO1xuICAgICAgICAgICAgbGV0IGNoaWxkID0gdGhpcy5jaGlsZHJlbi5nZXQoaSk7XG4gICAgICAgICAgICBpZiAoY2hpbGQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHZBbGlnbiA9IHRoaXMuZ2V0Q2VsbFZBbGlnbihpKTtcbiAgICAgICAgICAgIGxldCBjaCA9IGNoaWxkLmJvdW5kc0hlaWdodDtcbiAgICAgICAgICAgIGlmICh2QWxpZ24gPT0gRVZBbGlnbi5NSURETEUpIHtcbiAgICAgICAgICAgICAgICBjaGlsZFkgKz0gKHJlYWxIZWlnaHQgLSBjaCkgLyAyO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh2QWxpZ24gPT0gRVZBbGlnbi5CT1RUT00pIHtcbiAgICAgICAgICAgICAgICBjaGlsZFkgKz0gKHJlYWxIZWlnaHQgLSBjaCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNoaWxkLl9zZXRUb3AoY2hpbGRZKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0U2l6ZShhY3RXLCByZWFsSGVpZ2h0KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldEluTGlzdDxUPihsaXN0OiBUW10sIGluZGV4OiBudW1iZXIsIHZhbHVlOiBUKSB7XG4gICAgICAgIHdoaWxlIChsaXN0Lmxlbmd0aCA8IGluZGV4KSB7XG4gICAgICAgICAgICBsaXN0LnB1c2gobnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgbGlzdFtpbmRleF0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBnZXRGcm9tTGlzdDxUPihsaXN0OiBUW10sIGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKGxpc3QubGVuZ3RoID4gaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiBsaXN0W2luZGV4XTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSByZW1vdmVGcm9tTGlzdDxUPihsaXN0OiBUW10sIGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKGxpc3QubGVuZ3RoID4gaW5kZXgpIHtcbiAgICAgICAgICAgIGxpc3Quc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5faW5uZXI7XG4gICAgfVxuICAgIFxuICAgIGdldCBIZWlnaHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XG4gICAgfVxuICAgIGdldCBoZWlnaHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkhlaWdodC52YWx1ZTtcbiAgICB9XG4gICAgc2V0IGhlaWdodCh2YWx1ZSkge1xuICAgICAgICB0aGlzLkhlaWdodC52YWx1ZSA9IHZhbHVlO1xuICAgIH1cblxuXG59XG4gICAgXG59XG5cbiIsIm5hbWVzcGFjZSBjdWJlZSB7XG5cbiAgICBleHBvcnQgY2xhc3MgVkJveCBleHRlbmRzIEFMYXlvdXQge1xuXG4gICAgICAgIHByaXZhdGUgX3dpZHRoID0gbmV3IE51bWJlclByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgLy9wcml2YXRlIGZpbmFsIEFycmF5TGlzdDxFbGVtZW50PiB3cmFwcGluZ1BhbmVscyA9IG5ldyBBcnJheUxpc3Q8RWxlbWVudD4oKTtcbiAgICAgICAgcHJpdmF0ZSBfY2VsbEhlaWdodHM6IG51bWJlcltdID0gW107XG4gICAgICAgIHByaXZhdGUgX2hBbGlnbnM6IEVIQWxpZ25bXSA9IFtdO1xuICAgICAgICBwcml2YXRlIF92QWxpZ25zOiBFVkFsaWduW10gPSBbXTtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgIHRoaXMucG9pbnRlclRyYW5zcGFyZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX3dpZHRoLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGNoaWxkcmVuKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5faW5uZXI7XG4gICAgICAgIH1cblxuICAgICAgICBzZXRDZWxsSGVpZ2h0KGluZGV4T3JDb21wb25lbnQ6IG51bWJlciB8IEFDb21wb25lbnQsIGNlbGxIZWlnaHQ6IG51bWJlcikge1xuICAgICAgICAgICAgaWYgKGluZGV4T3JDb21wb25lbnQgaW5zdGFuY2VvZiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRDZWxsSGVpZ2h0KHRoaXMuY2hpbGRyZW4uaW5kZXhPZig8QUNvbXBvbmVudD5pbmRleE9yQ29tcG9uZW50KSwgY2VsbEhlaWdodCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNldEluTGlzdCh0aGlzLl9jZWxsSGVpZ2h0cywgPG51bWJlcj5pbmRleE9yQ29tcG9uZW50LCBjZWxsSGVpZ2h0KTtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzZXRJbkxpc3Q8VD4obGlzdDogVFtdLCBpbmRleDogbnVtYmVyLCB2YWx1ZTogVCkge1xuICAgICAgICAgICAgd2hpbGUgKGxpc3QubGVuZ3RoIDwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBsaXN0LnB1c2gobnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsaXN0W2luZGV4XSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBnZXRGcm9tTGlzdDxUPihsaXN0OiBUW10sIGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmIChsaXN0Lmxlbmd0aCA+IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpc3RbaW5kZXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHJlbW92ZUZyb21MaXN0PFQ+KGxpc3Q6IFRbXSwgaW5kZXg6IG51bWJlcikge1xuICAgICAgICAgICAgaWYgKGxpc3QubGVuZ3RoID4gaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBsaXN0LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0Q2VsbEhlaWdodChpbmRleE9yQ29tcG9uZW50OiBudW1iZXIgfCBBQ29tcG9uZW50KTogbnVtYmVyIHtcbiAgICAgICAgICAgIGlmIChpbmRleE9yQ29tcG9uZW50IGluc3RhbmNlb2YgQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldENlbGxIZWlnaHQodGhpcy5jaGlsZHJlbi5pbmRleE9mKGluZGV4T3JDb21wb25lbnQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZ2V0RnJvbUxpc3QodGhpcy5fY2VsbEhlaWdodHMsIDxudW1iZXI+aW5kZXhPckNvbXBvbmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc2V0Q2VsbEhBbGlnbihpbmRleE9yQ29tcG9uZW50OiBudW1iZXIgfCBBQ29tcG9uZW50LCBoQWxpZ246IEVIQWxpZ24pIHtcbiAgICAgICAgICAgIGlmIChpbmRleE9yQ29tcG9uZW50IGluc3RhbmNlb2YgQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q2VsbEhBbGlnbih0aGlzLmNoaWxkcmVuLmluZGV4T2YoaW5kZXhPckNvbXBvbmVudCksIGhBbGlnbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNldEluTGlzdCh0aGlzLl9oQWxpZ25zLCA8bnVtYmVyPmluZGV4T3JDb21wb25lbnQsIGhBbGlnbik7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRDZWxsSEFsaWduKGluZGV4T3JDb21wb25lbnQ6IG51bWJlciB8IEFDb21wb25lbnQpOiBFSEFsaWduIHtcbiAgICAgICAgICAgIGlmIChpbmRleE9yQ29tcG9uZW50IGluc3RhbmNlb2YgQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldENlbGxIQWxpZ24odGhpcy5jaGlsZHJlbi5pbmRleE9mKGluZGV4T3JDb21wb25lbnQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEZyb21MaXN0KHRoaXMuX2hBbGlnbnMsIDxudW1iZXI+aW5kZXhPckNvbXBvbmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc2V0Q2VsbFZBbGlnbihpbmRleE9yQ29tcG9uZW50OiBudW1iZXIgfCBBQ29tcG9uZW50LCB2QWxpZ246IEVWQWxpZ24pIHtcbiAgICAgICAgICAgIGlmIChpbmRleE9yQ29tcG9uZW50IGluc3RhbmNlb2YgQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q2VsbFZBbGlnbih0aGlzLmNoaWxkcmVuLmluZGV4T2YoaW5kZXhPckNvbXBvbmVudCksIHZBbGlnbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNldEluTGlzdCh0aGlzLl92QWxpZ25zLCA8bnVtYmVyPmluZGV4T3JDb21wb25lbnQsIHZBbGlnbik7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICB9XG5cbiAgICAgICAgcHVibGljIGdldENlbGxWQWxpZ24oaW5kZXhPckNvbXBvbmVudDogbnVtYmVyIHwgQUNvbXBvbmVudCk6IEVWQWxpZ24ge1xuICAgICAgICBpZiAoaW5kZXhPckNvbXBvbmVudCBpbnN0YW5jZW9mIEFDb21wb25lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldENlbGxWQWxpZ24odGhpcy5jaGlsZHJlbi5pbmRleE9mKGluZGV4T3JDb21wb25lbnQpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdldEZyb21MaXN0KHRoaXMuX3ZBbGlnbnMsIDxudW1iZXI+aW5kZXhPckNvbXBvbmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHNldExhc3RDZWxsSEFsaWduKGhBbGlnbjogRUhBbGlnbikge1xuICAgICAgICB0aGlzLnNldENlbGxIQWxpZ24odGhpcy5jaGlsZHJlbi5zaXplKCkgLSAxLCBoQWxpZ24pO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRMYXN0Q2VsbFZBbGlnbih2QWxpZ246IEVWQWxpZ24pIHtcbiAgICAgICAgdGhpcy5zZXRDZWxsVkFsaWduKHRoaXMuY2hpbGRyZW4uc2l6ZSgpIC0gMSwgdkFsaWduKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0TGFzdENlbGxIZWlnaHQoaGVpZ2h0OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5zZXRDZWxsSGVpZ2h0KHRoaXMuY2hpbGRyZW4uc2l6ZSgpIC0gMSwgaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkRW1wdHlDZWxsKGhlaWdodDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4uYWRkKG51bGwpO1xuICAgICAgICB0aGlzLnNldENlbGxIZWlnaHQodGhpcy5jaGlsZHJlbi5zaXplKCkgLSAxLCBoZWlnaHQpO1xuICAgIH1cbiAgICBcbiAgICBnZXQgV2lkdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcbiAgICB9XG4gICAgZ2V0IHdpZHRoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5XaWR0aC52YWx1ZTtcbiAgICB9XG4gICAgc2V0IHdpZHRoKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuV2lkdGgudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgX29uQ2hpbGRBZGRlZChjaGlsZDogQUNvbXBvbmVudCkge1xuICAgICAgICBpZiAoY2hpbGQgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKGNoaWxkLmVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBfb25DaGlsZFJlbW92ZWQoY2hpbGQ6IEFDb21wb25lbnQsIGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKGNoaWxkICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDaGlsZChjaGlsZC5lbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbW92ZUZyb21MaXN0KHRoaXMuX2hBbGlnbnMsIGluZGV4KTtcbiAgICAgICAgdGhpcy5yZW1vdmVGcm9tTGlzdCh0aGlzLl92QWxpZ25zLCBpbmRleCk7XG4gICAgICAgIHRoaXMucmVtb3ZlRnJvbUxpc3QodGhpcy5fY2VsbEhlaWdodHMsIGluZGV4KTtcbiAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgfVxuXG4gICAgcHVibGljIF9vbkNoaWxkcmVuQ2xlYXJlZCgpIHtcbiAgICAgICAgdmFyIHJvb3QgPSB0aGlzLmVsZW1lbnQ7XG4gICAgICAgIHZhciBlID0gdGhpcy5lbGVtZW50LmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICB3aGlsZSAoZSAhPSBudWxsKSB7XG4gICAgICAgICAgICByb290LnJlbW92ZUNoaWxkKGUpO1xuICAgICAgICAgICAgZSA9IHJvb3QuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5faEFsaWducyA9IFtdO1xuICAgICAgICB0aGlzLl92QWxpZ25zID0gW107XG4gICAgICAgIHRoaXMuX2NlbGxIZWlnaHRzID0gW107XG4gICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBvbkxheW91dCgpIHtcbiAgICAgICAgdmFyIG1heFdpZHRoID0gLTE7XG4gICAgICAgIGlmICh0aGlzLndpZHRoICE9IG51bGwpIHtcbiAgICAgICAgICAgIG1heFdpZHRoID0gdGhpcy53aWR0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhY3RIID0gMDtcbiAgICAgICAgdmFyIG1heFcgPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4uc2l6ZSgpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBjaGlsZFkgPSAwO1xuICAgICAgICAgICAgbGV0IGNoaWxkID0gdGhpcy5jaGlsZHJlbi5nZXQoaSk7XG4gICAgICAgICAgICBsZXQgY2VsbEggPSB0aGlzLmdldENlbGxIZWlnaHQoaSk7XG4gICAgICAgICAgICBsZXQgdkFsaWduID0gdGhpcy5nZXRDZWxsVkFsaWduKGkpO1xuICAgICAgICAgICAgbGV0IHJlYWxDZWxsSCA9IC0xO1xuICAgICAgICAgICAgaWYgKGNlbGxIICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZWFsQ2VsbEggPSBjZWxsSDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNoaWxkID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVhbENlbGxIID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBhY3RIICs9IHJlYWxDZWxsSDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vY2hpbGQubGF5b3V0KCk7XG4gICAgICAgICAgICAgICAgbGV0IGN3ID0gY2hpbGQuYm91bmRzV2lkdGg7XG4gICAgICAgICAgICAgICAgbGV0IGNoID0gY2hpbGQuYm91bmRzSGVpZ2h0O1xuICAgICAgICAgICAgICAgIGxldCBjbCA9IGNoaWxkLnRyYW5zbGF0ZVg7XG4gICAgICAgICAgICAgICAgbGV0IGN0ID0gY2hpbGQudHJhbnNsYXRlWTtcbiAgICAgICAgICAgICAgICBsZXQgY2FsY3VsYXRlZENlbGxIID0gcmVhbENlbGxIO1xuICAgICAgICAgICAgICAgIGlmIChjYWxjdWxhdGVkQ2VsbEggPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGF0ZWRDZWxsSCA9IGNoICsgY3Q7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjYWxjdWxhdGVkQ2VsbEggPCBjaCkge1xuICAgICAgICAgICAgICAgICAgICBjYWxjdWxhdGVkQ2VsbEggPSBjaDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjaGlsZFkgPSBhY3RIIC0gY2hpbGQudHJhbnNsYXRlWTtcblxuICAgICAgICAgICAgICAgIGlmICh2QWxpZ24gPT0gRVZBbGlnbi5NSURETEUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRZICs9IChjYWxjdWxhdGVkQ2VsbEggLSBjaCkgLyAyO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodkFsaWduID09IEVWQWxpZ24uQk9UVE9NKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkWSArPSAoY2FsY3VsYXRlZENlbGxIIC0gY2gpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjaGlsZC5fc2V0VG9wKGNoaWxkWSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoY3cgKyBjbCA+IG1heFcpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF4VyA9IGN3ICsgY2w7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFjdEggKz0gY2FsY3VsYXRlZENlbGxIO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJlYWxXaWR0aCA9IG1heFc7XG4gICAgICAgIGlmIChtYXhXaWR0aCA+IC0xKSB7XG4gICAgICAgICAgICByZWFsV2lkdGggPSBtYXhXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4uc2l6ZSgpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBjaGlsZFggPSAwO1xuICAgICAgICAgICAgbGV0IGNoaWxkID0gdGhpcy5jaGlsZHJlbi5nZXQoaSk7XG4gICAgICAgICAgICBpZiAoY2hpbGQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGhBbGlnbiA9IHRoaXMuZ2V0Q2VsbEhBbGlnbihpKTtcbiAgICAgICAgICAgIGxldCBjdyA9IGNoaWxkLmJvdW5kc1dpZHRoO1xuICAgICAgICAgICAgaWYgKGhBbGlnbiA9PSBFSEFsaWduLkNFTlRFUikge1xuICAgICAgICAgICAgICAgIGNoaWxkWCA9IChyZWFsV2lkdGggLSBjdykgLyAyO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChoQWxpZ24gPT0gRUhBbGlnbi5SSUdIVCkge1xuICAgICAgICAgICAgICAgIGNoaWxkWCA9IChyZWFsV2lkdGggLSBjdyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNoaWxkLl9zZXRMZWZ0KGNoaWxkWCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFNpemUocmVhbFdpZHRoLCBhY3RIKTtcbiAgICB9XG5cblxuXG59XG4gICAgXG59XG5cblxuIiwibmFtZXNwYWNlIGN1YmVlIHtcblxuICAgIGV4cG9ydCBjbGFzcyBTY3JvbGxCb3ggZXh0ZW5kcyBBVXNlckNvbnRyb2wge1xuXG4gICAgICAgIHByaXZhdGUgX2NvbnRlbnQgPSBuZXcgUHJvcGVydHk8QUNvbXBvbmVudD4obnVsbCk7XG4gICAgICAgIHByaXZhdGUgX2hTY3JvbGxQb2xpY3kgPSBuZXcgUHJvcGVydHk8RVNjcm9sbEJhclBvbGljeT4oRVNjcm9sbEJhclBvbGljeS5BVVRPLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3ZTY3JvbGxQb2xpY3kgPSBuZXcgUHJvcGVydHk8RVNjcm9sbEJhclBvbGljeT4oRVNjcm9sbEJhclBvbGljeS5BVVRPLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3Njcm9sbFdpZHRoID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgcHJpdmF0ZSBfc2Nyb2xsSGVpZ2h0ID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgcHJpdmF0ZSBfaFNjcm9sbFBvcyA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgIHByaXZhdGUgX3ZTY3JvbGxQb3MgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIHRydWUpO1xuICAgICAgICBwcml2YXRlIF9tYXhIU2Nyb2xsUG9zID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgcHJpdmF0ZSBfbWF4VlNjcm9sbFBvcyA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgIHByaXZhdGUgX21heEhTY3JvbGxQb3NXcml0ZXIgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfbWF4VlNjcm9sbFBvc1dyaXRlciA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgZmFsc2UpO1xuXG4gICAgICAgIHByaXZhdGUgX2NhbGN1bGF0ZVNjcm9sbFdpZHRoRXhwID0gbmV3IEV4cHJlc3Npb248bnVtYmVyPigoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5jb250ZW50ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQuYm91bmRzV2lkdGg7XG4gICAgICAgIH0sIHRoaXMuX2NvbnRlbnQpO1xuICAgICAgICBwcml2YXRlIF9jYWxjdWxhdGVTY3JvbGxIZWlnaHRFeHAgPSBuZXcgRXhwcmVzc2lvbjxudW1iZXI+KCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRlbnQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudC5ib3VuZHNIZWlnaHQ7XG4gICAgICAgIH0sIHRoaXMuX2NvbnRlbnQpO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcIm92ZXJmbG93XCIpO1xuXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxXaWR0aC5pbml0UmVhZG9ubHlCaW5kKHRoaXMuX2NhbGN1bGF0ZVNjcm9sbFdpZHRoRXhwKTtcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbEhlaWdodC5pbml0UmVhZG9ubHlCaW5kKHRoaXMuX2NhbGN1bGF0ZVNjcm9sbEhlaWdodEV4cCk7XG5cbiAgICAgICAgICAgIHRoaXMuX21heEhTY3JvbGxQb3MuaW5pdFJlYWRvbmx5QmluZCh0aGlzLl9tYXhIU2Nyb2xsUG9zV3JpdGVyKTtcbiAgICAgICAgICAgIHRoaXMuX21heFZTY3JvbGxQb3MuaW5pdFJlYWRvbmx5QmluZCh0aGlzLl9tYXhWU2Nyb2xsUG9zV3JpdGVyKTtcblxuICAgICAgICAgICAgdGhpcy5fbWF4SFNjcm9sbFBvc1dyaXRlci5iaW5kKG5ldyBFeHByZXNzaW9uPG51bWJlcj4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAodGhpcy5zY3JvbGxXaWR0aCAtIHRoaXMuY2xpZW50V2lkdGgpO1xuICAgICAgICAgICAgfSwgdGhpcy5DbGllbnRXaWR0aCwgdGhpcy5fc2Nyb2xsV2lkdGgpKTtcblxuICAgICAgICAgICAgdGhpcy5fbWF4VlNjcm9sbFBvc1dyaXRlci5iaW5kKG5ldyBFeHByZXNzaW9uPG51bWJlcj4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAodGhpcy5zY3JvbGxIZWlnaHQgLSB0aGlzLmNsaWVudEhlaWdodCk7XG4gICAgICAgICAgICB9LCB0aGlzLkNsaWVudEhlaWdodCwgdGhpcy5fc2Nyb2xsSGVpZ2h0KSk7XG5cbiAgICAgICAgICAgIHRoaXMuX2NvbnRlbnQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5faW5uZXIuY2xlYXIoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxjdWxhdGVTY3JvbGxXaWR0aEV4cC51bmJpbmRBbGwoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxjdWxhdGVTY3JvbGxXaWR0aEV4cC5iaW5kKHRoaXMuX2NvbnRlbnQpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRlbnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYWxjdWxhdGVTY3JvbGxXaWR0aEV4cC5iaW5kKHRoaXMuY29udGVudC5Cb3VuZHNXaWR0aCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsY3VsYXRlU2Nyb2xsSGVpZ2h0RXhwLnVuYmluZEFsbCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZVNjcm9sbEhlaWdodEV4cC5iaW5kKHRoaXMuX2NvbnRlbnQpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRlbnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYWxjdWxhdGVTY3JvbGxIZWlnaHRFeHAuYmluZCh0aGlzLmNvbnRlbnQuQm91bmRzSGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb250ZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbl9pbm5lci5hZGQodGhpcy5jb250ZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgKGV2dCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuaFNjcm9sbFBvcyA9IHRoaXMuZWxlbWVudC5zY3JvbGxMZWZ0O1xuICAgICAgICAgICAgICAgIHRoaXMudlNjcm9sbFBvcyA9IHRoaXMuZWxlbWVudC5zY3JvbGxUb3A7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5faFNjcm9sbFBvcy5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnNjcm9sbExlZnQgPSB0aGlzLmhTY3JvbGxQb3M7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2hTY3JvbGxQb3MuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zY3JvbGxUb3AgPSB0aGlzLnZTY3JvbGxQb3M7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5faFNjcm9sbFBvbGljeS5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaFNjcm9sbFBvbGljeSA9PSBFU2Nyb2xsQmFyUG9saWN5LkFVVE8pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93WCA9IFwiYXV0b1wiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5oU2Nyb2xsUG9saWN5ID09IEVTY3JvbGxCYXJQb2xpY3kuSElEREVOKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vdmVyZmxvd1ggPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5oU2Nyb2xsUG9saWN5ID09IEVTY3JvbGxCYXJQb2xpY3kuVklTSUJMRSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUub3ZlcmZsb3dYID0gXCJzY3JvbGxcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2hTY3JvbGxQb2xpY3kuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fdlNjcm9sbFBvbGljeS5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudlNjcm9sbFBvbGljeSA9PSBFU2Nyb2xsQmFyUG9saWN5LkFVVE8pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93WSA9IFwiYXV0b1wiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy52U2Nyb2xsUG9saWN5ID09IEVTY3JvbGxCYXJQb2xpY3kuSElEREVOKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vdmVyZmxvd1kgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy52U2Nyb2xsUG9saWN5ID09IEVTY3JvbGxCYXJQb2xpY3kuVklTSUJMRSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUub3ZlcmZsb3dZID0gXCJzY3JvbGxcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3ZTY3JvbGxQb2xpY3kuaW52YWxpZGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIHdpZHRoUHJvcGVydHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIud2lkdGhQcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIGdldCBXaWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLndpZHRoUHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgd2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5XaWR0aC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgd2lkdGgodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuV2lkdGgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcHJvdGVjdGVkIGhlaWdodFByb3BlcnR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmhlaWdodFByb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IEhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhlaWdodFByb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkhlaWdodC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgaGVpZ2h0KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkhlaWdodC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cblxuICAgICAgICBnZXQgQ29udGVudCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250ZW50O1xuICAgICAgICB9XG4gICAgICAgIGdldCBjb250ZW50KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQ29udGVudC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgY29udGVudCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Db250ZW50LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgSFNjcm9sbFBvbGljeSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9oU2Nyb2xsUG9saWN5O1xuICAgICAgICB9XG4gICAgICAgIGdldCBoU2Nyb2xsUG9saWN5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuSFNjcm9sbFBvbGljeS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgaFNjcm9sbFBvbGljeSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5IU2Nyb2xsUG9saWN5LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVlNjcm9sbFBvbGljeSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92U2Nyb2xsUG9saWN5O1xuICAgICAgICB9XG4gICAgICAgIGdldCB2U2Nyb2xsUG9saWN5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVlNjcm9sbFBvbGljeS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdlNjcm9sbFBvbGljeSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5WU2Nyb2xsUG9saWN5LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgU2Nyb2xsV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsV2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHNjcm9sbFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuU2Nyb2xsV2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHNjcm9sbFdpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlNjcm9sbFdpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgU2Nyb2xsSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbEhlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgc2Nyb2xsSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuU2Nyb2xsSGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBzY3JvbGxIZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuU2Nyb2xsSGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgSFNjcm9sbFBvcygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9oU2Nyb2xsUG9zO1xuICAgICAgICB9XG4gICAgICAgIGdldCBoU2Nyb2xsUG9zKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuSFNjcm9sbFBvcy52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgaFNjcm9sbFBvcyh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5IU2Nyb2xsUG9zLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVlNjcm9sbFBvcygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92U2Nyb2xsUG9zO1xuICAgICAgICB9XG4gICAgICAgIGdldCB2U2Nyb2xsUG9zKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVlNjcm9sbFBvcy52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdlNjcm9sbFBvcyh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5WU2Nyb2xsUG9zLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgTWF4SFNjcm9sbFBvcygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tYXhIU2Nyb2xsUG9zO1xuICAgICAgICB9XG4gICAgICAgIGdldCBtYXhIU2Nyb2xsUG9zKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuTWF4SFNjcm9sbFBvcy52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgbWF4SFNjcm9sbFBvcyh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5NYXhIU2Nyb2xsUG9zLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgTWF4VlNjcm9sbFBvcygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tYXhWU2Nyb2xsUG9zO1xuICAgICAgICB9XG4gICAgICAgIGdldCBtYXhWU2Nyb2xsUG9zKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuTWF4VlNjcm9sbFBvcy52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgbWF4VlNjcm9sbFBvcyh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5NYXhWU2Nyb2xsUG9zLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgIH1cblxufVxuXG5cbiIsIm5hbWVzcGFjZSBjdWJlZSB7XG5cbiAgICBleHBvcnQgY2xhc3MgTGFiZWwgZXh0ZW5kcyBBQ29tcG9uZW50IHtcblxuICAgICAgICBwcml2YXRlIF93aWR0aCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2hlaWdodCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3RleHQgPSBuZXcgU3RyaW5nUHJvcGVydHkoXCJcIiwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdGV4dE92ZXJmbG93ID0gbmV3IFByb3BlcnR5PEVUZXh0T3ZlcmZsb3c+KEVUZXh0T3ZlcmZsb3cuQ0xJUCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfZm9yZUNvbG9yID0gbmV3IENvbG9yUHJvcGVydHkoQ29sb3IuQkxBQ0ssIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdGV4dEFsaWduID0gbmV3IFByb3BlcnR5PEVUZXh0QWxpZ24+KEVUZXh0QWxpZ24uTEVGVCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdmVydGljYWxBbGlnbiA9IG5ldyBQcm9wZXJ0eTxFVkFsaWduPihFVkFsaWduLlRPUCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYm9sZCA9IG5ldyBCb29sZWFuUHJvcGVydHkoZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2l0YWxpYyA9IG5ldyBCb29sZWFuUHJvcGVydHkoZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3VuZGVybGluZSA9IG5ldyBCb29sZWFuUHJvcGVydHkoZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2ZvbnRTaXplID0gbmV3IE51bWJlclByb3BlcnR5KDEyLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9mb250RmFtaWx5ID0gbmV3IFByb3BlcnR5PEZvbnRGYW1pbHk+KEZvbnRGYW1pbHkuQXJpYWwsIGZhbHNlLCBmYWxzZSk7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKTtcbiAgICAgICAgICAgIHRoaXMuX3dpZHRoLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy53aWR0aCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aGl0ZVNwYWNlID0gXCJub3dyYXBcIjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93WCA9IFwidmlzaWJsZVwiO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJ3aWR0aFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2hpdGVTcGFjZSA9IFwibm9ybWFsXCI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vdmVyZmxvd1ggPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2lkdGggPSB0aGlzLndpZHRoICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fd2lkdGguaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5faGVpZ2h0LmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oZWlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJoZWlnaHRcIilcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93WSA9IFwidmlzaWJsZVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93WSA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9oZWlnaHQuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fdGV4dC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmlubmVySFRNTCA9IHRoaXMudGV4dDtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl90ZXh0LmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3RleHRPdmVyZmxvdy5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0T3ZlcmZsb3cuYXBwbHkodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50ZXh0T3ZlcmZsb3cgPT0gRVRleHRPdmVyZmxvdy5FTExJUFNJUykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2hpdGVTcGFjZSA9IFwibm93cmFwXCI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwid2hpdGVTcGFjZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fd2lkdGguaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9oZWlnaHQuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdGV4dE92ZXJmbG93LmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2ZvcmVDb2xvci5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9yZUNvbG9yID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmNvbG9yID0gXCJyZ2JhKDAsMCwwLDAuMClcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuY29sb3IgPSB0aGlzLmZvcmVDb2xvci50b0NTUygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZm9yZUNvbG9yLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3RleHRBbGlnbi5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0QWxpZ24uYXBwbHkodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdGV4dEFsaWduLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRpY2FsQWxpZ24uYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB0YSA9IHRoaXMudmVydGljYWxBbGlnbjtcbiAgICAgICAgICAgICAgICBpZiAodGEgPT0gRVZBbGlnbi5UT1ApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZlcnRpY2FsQWxpZ24gPSBcInRvcFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGEgPT0gRVZBbGlnbi5NSURETEUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZlcnRpY2FsQWxpZ24gPSBcIm1pZGRsZVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGEgPT0gRVZBbGlnbi5CT1RUT00pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZlcnRpY2FsQWxpZ24gPSBcImJvdHRvbVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdmVydGljYWxBbGlnbi5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl91bmRlcmxpbmUuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnVuZGVybGluZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudGV4dERlY29yYXRpb24gPSBcInVuZGVybGluZVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50ZXh0RGVjb3JhdGlvbiA9IFwibm9uZVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdW5kZXJsaW5lLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2JvbGQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZvbnRXZWlnaHQgPSBcImJvbGRcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFdlaWdodCA9IFwibm9ybWFsXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9ib2xkLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2l0YWxpYy5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXRhbGljKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250U3R5bGUgPSBcIml0YWxpY1wiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250U3R5bGUgPSBcIm5vcm1hbFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5faXRhbGljLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2ZvbnRTaXplLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFNpemUgPSB0aGlzLmZvbnRTaXplICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9mb250U2l6ZS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9mb250RmFtaWx5LmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmZvbnRGYW1pbHkuYXBwbHkodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZm9udEZhbWlseS5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuV2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHdpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLldpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGdldCBIZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGdldCBoZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5IZWlnaHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGhlaWdodCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5IZWlnaHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUZXh0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RleHQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRleHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UZXh0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0ZXh0KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRleHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUZXh0T3ZlcmZsb3coKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGV4dE92ZXJmbG93O1xuICAgICAgICB9XG4gICAgICAgIGdldCB0ZXh0T3ZlcmZsb3coKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UZXh0T3ZlcmZsb3cudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHRleHRPdmVyZmxvdyh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5UZXh0T3ZlcmZsb3cudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuUGFkZGluZ1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEZvcmVDb2xvcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb3JlQ29sb3I7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGZvcmVDb2xvcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkZvcmVDb2xvci52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgZm9yZUNvbG9yKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkZvcmVDb2xvci52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFZlcnRpY2FsQWxpZ24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmVydGljYWxBbGlnbjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdmVydGljYWxBbGlnbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlZlcnRpY2FsQWxpZ24udmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHZlcnRpY2FsQWxpZ24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVmVydGljYWxBbGlnbi52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEJvbGQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYm9sZDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm9sZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkJvbGQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGJvbGQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQm9sZC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEl0YWxpYygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pdGFsaWM7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGl0YWxpYygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkl0YWxpYy52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgaXRhbGljKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkl0YWxpYy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFVuZGVybGluZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl91bmRlcmxpbmU7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHVuZGVybGluZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlVuZGVybGluZS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdW5kZXJsaW5lKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlVuZGVybGluZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFRleHRBbGlnbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZXh0QWxpZ247XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRleHRBbGlnbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlRleHRBbGlnbi52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdGV4dEFsaWduKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRleHRBbGlnbi52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEZvbnRTaXplKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvbnRTaXplO1xuICAgICAgICB9XG4gICAgICAgIGdldCBmb250U2l6ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkZvbnRTaXplLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBmb250U2l6ZSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Gb250U2l6ZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEZvbnRGYW1pbHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9udEZhbWlseTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgZm9udEZhbWlseSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkZvbnRGYW1pbHkudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGZvbnRGYW1pbHkodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuRm9udEZhbWlseS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn1cblxuXG4iLCJuYW1lc3BhY2UgY3ViZWUge1xuICAgIFxuICAgIGV4cG9ydCBjbGFzcyBCdXR0b24gZXh0ZW5kcyBBQ29tcG9uZW50IHtcbiAgICAgICAgXG4gICAgICAgIHByaXZhdGUgX3dpZHRoID0gbmV3IE51bWJlclByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfaGVpZ2h0ID0gbmV3IE51bWJlclByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdGV4dCA9IG5ldyBTdHJpbmdQcm9wZXJ0eShcIlwiLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF90ZXh0T3ZlcmZsb3cgPSBuZXcgUHJvcGVydHk8RVRleHRPdmVyZmxvdz4oRVRleHRPdmVyZmxvdy5DTElQLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9mb3JlQ29sb3IgPSBuZXcgQ29sb3JQcm9wZXJ0eShDb2xvci5CTEFDSywgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF90ZXh0QWxpZ24gPSBuZXcgUHJvcGVydHk8RVRleHRBbGlnbj4oRVRleHRBbGlnbi5DRU5URVIsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3ZlcnRpY2FsQWxpZ24gPSBuZXcgUHJvcGVydHk8RVZBbGlnbj4oRVZBbGlnbi5NSURETEUsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2JvbGQgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9pdGFsaWMgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF91bmRlcmxpbmUgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9mb250U2l6ZSA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgxMiwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfZm9udEZhbWlseSA9IG5ldyBQcm9wZXJ0eTxGb250RmFtaWx5PihGb250RmFtaWx5LkFyaWFsLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9iYWNrZ3JvdW5kID0gbmV3IEJhY2tncm91bmRQcm9wZXJ0eShuZXcgQ29sb3JCYWNrZ3JvdW5kKENvbG9yLlRSQU5TUEFSRU5UKSwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9zaGFkb3cgPSBuZXcgUHJvcGVydHk8Qm94U2hhZG93PihudWxsLCB0cnVlLCBmYWxzZSk7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpKTtcbiAgICAgICAgICAgIHRoaXMucGFkZGluZyA9IFBhZGRpbmcuY3JlYXRlKDEwKTtcbiAgICAgICAgICAgIHRoaXMuX3dpZHRoLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy53aWR0aCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aGl0ZVNwYWNlID0gXCJub3dyYXBcIjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93WCA9IFwidmlzaWJsZVwiO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJ3aWR0aFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2hpdGVTcGFjZSA9IFwibm9ybWFsXCI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vdmVyZmxvd1ggPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2lkdGggPSB0aGlzLndpZHRoICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fd2lkdGguaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5faGVpZ2h0LmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oZWlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJoZWlnaHRcIilcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93WSA9IFwidmlzaWJsZVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93WSA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9oZWlnaHQuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fdGV4dC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmlubmVySFRNTCA9IHRoaXMudGV4dDtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl90ZXh0LmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3RleHRPdmVyZmxvdy5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0T3ZlcmZsb3cuYXBwbHkodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50ZXh0T3ZlcmZsb3cgPT0gRVRleHRPdmVyZmxvdy5FTExJUFNJUykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2hpdGVTcGFjZSA9IFwibm93cmFwXCI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwid2hpdGVTcGFjZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fd2lkdGguaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9oZWlnaHQuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdGV4dE92ZXJmbG93LmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2ZvcmVDb2xvci5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9yZUNvbG9yID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmNvbG9yID0gXCJyZ2JhKDAsMCwwLDAuMClcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuY29sb3IgPSB0aGlzLmZvcmVDb2xvci50b0NTUygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZm9yZUNvbG9yLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3RleHRBbGlnbi5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0QWxpZ24uYXBwbHkodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdGV4dEFsaWduLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRpY2FsQWxpZ24uYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB0YSA9IHRoaXMudmVydGljYWxBbGlnbjtcbiAgICAgICAgICAgICAgICBpZiAodGEgPT0gRVZBbGlnbi5UT1ApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZlcnRpY2FsQWxpZ24gPSBcInRvcFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGEgPT0gRVZBbGlnbi5NSURETEUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZlcnRpY2FsQWxpZ24gPSBcIm1pZGRsZVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGEgPT0gRVZBbGlnbi5CT1RUT00pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZlcnRpY2FsQWxpZ24gPSBcImJvdHRvbVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdmVydGljYWxBbGlnbi5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl91bmRlcmxpbmUuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnVuZGVybGluZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudGV4dERlY29yYXRpb24gPSBcInVuZGVybGluZVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50ZXh0RGVjb3JhdGlvbiA9IFwibm9uZVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdW5kZXJsaW5lLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2JvbGQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZvbnRXZWlnaHQgPSBcImJvbGRcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFdlaWdodCA9IFwibm9ybWFsXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9ib2xkLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2l0YWxpYy5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXRhbGljKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250U3R5bGUgPSBcIml0YWxpY1wiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250U3R5bGUgPSBcIm5vcm1hbFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5faXRhbGljLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2ZvbnRTaXplLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFNpemUgPSB0aGlzLmZvbnRTaXplICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9mb250U2l6ZS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9mb250RmFtaWx5LmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmZvbnRGYW1pbHkuYXBwbHkodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZm9udEZhbWlseS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9iYWNrZ3JvdW5kLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJiYWNrZ3JvdW5kQ29sb3JcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYmFja2dyb3VuZEltYWdlXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImJhY2tncm91bmRcIik7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2JhY2tncm91bmQudmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9iYWNrZ3JvdW5kLnZhbHVlLmFwcGx5KHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9iYWNrZ3JvdW5kLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3NoYWRvdy5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3NoYWRvdy52YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImJveFNoYWRvd1wiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFkb3cudmFsdWUuYXBwbHkodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5ib3JkZXIgPSBCb3JkZXIuY3JlYXRlKDEsIENvbG9yLkxJR0hUX0dSQVksIDIpO1xuICAgICAgICAgICAgdGhpcy5mb250U2l6ZSA9IDE0O1xuICAgICAgICAgICAgdGhpcy5ib2xkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZCA9IG5ldyBDb2xvckJhY2tncm91bmQoQ29sb3IuV0hJVEUpO1xuICAgICAgICAgICAgdGhpcy5zaGFkb3cgPSBuZXcgQm94U2hhZG93KDEsIDEsIDUsIDAsIENvbG9yLkxJR0hUX0dSQVksIGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBXaWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgd2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5XaWR0aC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgd2lkdGgodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuV2lkdGgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgZ2V0IEhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkhlaWdodC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgaGVpZ2h0KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkhlaWdodC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFRleHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGV4dDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdGV4dCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlRleHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHRleHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVGV4dC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFRleHRPdmVyZmxvdygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZXh0T3ZlcmZsb3c7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRleHRPdmVyZmxvdygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlRleHRPdmVyZmxvdy52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdGV4dE92ZXJmbG93KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRleHRPdmVyZmxvdy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5QYWRkaW5nXG4gICAgICAgIH1cblxuICAgICAgICBnZXQgRm9yZUNvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvcmVDb2xvcjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgZm9yZUNvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRm9yZUNvbG9yLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBmb3JlQ29sb3IodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuRm9yZUNvbG9yLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVmVydGljYWxBbGlnbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92ZXJ0aWNhbEFsaWduO1xuICAgICAgICB9XG4gICAgICAgIGdldCB2ZXJ0aWNhbEFsaWduKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVmVydGljYWxBbGlnbi52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdmVydGljYWxBbGlnbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5WZXJ0aWNhbEFsaWduLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm9sZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib2xkO1xuICAgICAgICB9XG4gICAgICAgIGdldCBib2xkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm9sZC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYm9sZCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Cb2xkLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgSXRhbGljKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2l0YWxpYztcbiAgICAgICAgfVxuICAgICAgICBnZXQgaXRhbGljKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuSXRhbGljLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBpdGFsaWModmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuSXRhbGljLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVW5kZXJsaW5lKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3VuZGVybGluZTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdW5kZXJsaW5lKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVW5kZXJsaW5lLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB1bmRlcmxpbmUodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVW5kZXJsaW5lLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVGV4dEFsaWduKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RleHRBbGlnbjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdGV4dEFsaWduKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVGV4dEFsaWduLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0ZXh0QWxpZ24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVGV4dEFsaWduLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgRm9udFNpemUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9udFNpemU7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGZvbnRTaXplKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRm9udFNpemUudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGZvbnRTaXplKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkZvbnRTaXplLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgRm9udEZhbWlseSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb250RmFtaWx5O1xuICAgICAgICB9XG4gICAgICAgIGdldCBmb250RmFtaWx5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRm9udEZhbWlseS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgZm9udEZhbWlseSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Gb250RmFtaWx5LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGdldCBCYWNrZ3JvdW5kKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JhY2tncm91bmQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJhY2tncm91bmQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5CYWNrZ3JvdW5kLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBiYWNrZ3JvdW5kKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkJhY2tncm91bmQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBTaGFkb3coKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2hhZG93O1xuICAgICAgICB9XG4gICAgICAgIGdldCBzaGFkb3coKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5TaGFkb3cudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHNoYWRvdyh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5TaGFkb3cudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG5cbiAgICB9XG4gICAgXG59XG5cblxuIiwibmFtZXNwYWNlIGN1YmVlIHtcblxuICAgIGV4cG9ydCBjbGFzcyBUZXh0Qm94IGV4dGVuZHMgQUNvbXBvbmVudCB7XG5cbiAgICAgICAgcHJpdmF0ZSBfd2lkdGggPSBuZXcgTnVtYmVyUHJvcGVydHkobnVsbCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9oZWlnaHQgPSBuZXcgTnVtYmVyUHJvcGVydHkobnVsbCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF90ZXh0ID0gbmV3IFN0cmluZ1Byb3BlcnR5KFwiXCIsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2JhY2tncm91bmQgPSBuZXcgQmFja2dyb3VuZFByb3BlcnR5KG5ldyBDb2xvckJhY2tncm91bmQoQ29sb3IuV0hJVEUpLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2ZvcmVDb2xvciA9IG5ldyBDb2xvclByb3BlcnR5KENvbG9yLkJMQUNLLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3RleHRBbGlnbiA9IG5ldyBQcm9wZXJ0eTxFVGV4dEFsaWduPihFVGV4dEFsaWduLkxFRlQsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3ZlcnRpY2FsQWxpZ24gPSBuZXcgUHJvcGVydHk8RVZBbGlnbj4oRVZBbGlnbi5UT1AsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2JvbGQgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9pdGFsaWMgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF91bmRlcmxpbmUgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9mb250U2l6ZSA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgxMiwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfZm9udEZhbWlseSA9IG5ldyBQcm9wZXJ0eTxGb250RmFtaWx5PihGb250RmFtaWx5LkFyaWFsLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9wbGFjZWhvbGRlciA9IG5ldyBTdHJpbmdQcm9wZXJ0eShudWxsLCB0cnVlKTtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKSk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInRleHRcIik7XG5cbiAgICAgICAgICAgIHRoaXMuYm9yZGVyID0gQm9yZGVyLmNyZWF0ZSgxLCBDb2xvci5MSUdIVF9HUkFZLCAwKTtcbiAgICAgICAgICAgIHRoaXMuX3dpZHRoLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy53aWR0aCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcIndpZHRoXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aCA9IHRoaXMud2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9oZWlnaHQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhlaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImhlaWdodFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHQgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl90ZXh0LmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50ZXh0ICE9IHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgdGhpcy50ZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2ZvcmVDb2xvci5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9yZUNvbG9yID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmNvbG9yID0gXCJyZ2JhKDAsMCwwLCAwLjApXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmNvbG9yID0gdGhpcy5mb3JlQ29sb3IudG9DU1MoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2ZvcmVDb2xvci5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl90ZXh0QWxpZ24uYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudGV4dEFsaWduLmFwcGx5KHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3RleHRBbGlnbi5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl92ZXJ0aWNhbEFsaWduLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdGEgPSB0aGlzLnZlcnRpY2FsQWxpZ247XG4gICAgICAgICAgICAgICAgaWYgKHRhID09IEVWQWxpZ24uVE9QKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52ZXJ0aWNhbEFsaWduID0gXCJ0b3BcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRhID09IEVWQWxpZ24uTUlERExFKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52ZXJ0aWNhbEFsaWduID0gXCJtaWRkbGVcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRhID09IEVWQWxpZ24uQk9UVE9NKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52ZXJ0aWNhbEFsaWduID0gXCJib3R0b21cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRpY2FsQWxpZ24uaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fdW5kZXJsaW5lLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy51bmRlcmxpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRleHREZWNvcmF0aW9uID0gXCJ1bmRlcmxpbmVcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudGV4dERlY29yYXRpb24gPSBcIm5vbmVcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3VuZGVybGluZS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9ib2xkLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ib2xkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250V2VpZ2h0ID0gXCJib2xkXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZvbnRXZWlnaHQgPSBcIm5vcm1hbFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fYm9sZC5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9pdGFsaWMuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLml0YWxpYykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFN0eWxlID0gXCJpdGFsaWNcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFN0eWxlID0gXCJub3JtYWxcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2l0YWxpYy5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9mb250U2l6ZS5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZvbnRTaXplID0gdGhpcy5mb250U2l6ZSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZm9udFNpemUuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fZm9udEZhbWlseS5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5mb250RmFtaWx5LmFwcGx5KHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2ZvbnRGYW1pbHkuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYmFja2dyb3VuZCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImJhY2tncm91bmRDb2xvclwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYmFja2dyb3VuZEltYWdlXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZC5hcHBseSh0aGlzLmVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZC5pbnZhbGlkYXRlKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3BsYWNlaG9sZGVyLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wbGFjZWhvbGRlciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIiwgdGhpcy5wbGFjZWhvbGRlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuV2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHdpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLldpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgaGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuSGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBoZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuSGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVGV4dCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZXh0O1xuICAgICAgICB9XG4gICAgICAgIGdldCB0ZXh0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVGV4dC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdGV4dCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5UZXh0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQmFja2dyb3VuZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9iYWNrZ3JvdW5kO1xuICAgICAgICB9XG4gICAgICAgIGdldCBiYWNrZ3JvdW5kKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQmFja2dyb3VuZC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYmFja2dyb3VuZCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5CYWNrZ3JvdW5kLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgRm9yZUNvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvcmVDb2xvcjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgZm9yZUNvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRm9yZUNvbG9yLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBmb3JlQ29sb3IodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuRm9yZUNvbG9yLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVGV4dEFsaWduKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RleHRBbGlnbjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdGV4dEFsaWduKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVGV4dEFsaWduLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0ZXh0QWxpZ24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVGV4dEFsaWduLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVmVydGljYWxBbGlnbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92ZXJ0aWNhbEFsaWduO1xuICAgICAgICB9XG4gICAgICAgIGdldCB2ZXJ0aWNhbEFsaWduKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVmVydGljYWxBbGlnbi52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdmVydGljYWxBbGlnbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5WZXJ0aWNhbEFsaWduLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm9sZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib2xkO1xuICAgICAgICB9XG4gICAgICAgIGdldCBib2xkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm9sZC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYm9sZCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Cb2xkLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgSXRhbGljKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2l0YWxpYztcbiAgICAgICAgfVxuICAgICAgICBnZXQgaXRhbGljKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuSXRhbGljLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBpdGFsaWModmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuSXRhbGljLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVW5kZXJsaW5lKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3VuZGVybGluZTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdW5kZXJsaW5lKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVW5kZXJsaW5lLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB1bmRlcmxpbmUodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVW5kZXJsaW5lLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgRm9udFNpemUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9udFNpemU7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGZvbnRTaXplKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRm9udFNpemUudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGZvbnRTaXplKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkZvbnRTaXplLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgRm9udEZhbWlseSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb250RmFtaWx5O1xuICAgICAgICB9XG4gICAgICAgIGdldCBmb250RmFtaWx5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRm9udEZhbWlseS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgZm9udEZhbWlseSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Gb250RmFtaWx5LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgUGxhY2Vob2xkZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGxhY2Vob2xkZXI7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHBsYWNlaG9sZGVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuUGxhY2Vob2xkZXIudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHBsYWNlaG9sZGVyKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlBsYWNlaG9sZGVyLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgIH1cblxufVxuXG5cbiIsIm5hbWVzcGFjZSBjdWJlZSB7XG5cbiAgICBleHBvcnQgY2xhc3MgUGFzc3dvcmRCb3ggZXh0ZW5kcyBBQ29tcG9uZW50IHtcblxuICAgICAgICBwcml2YXRlIF93aWR0aCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2hlaWdodCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3RleHQgPSBuZXcgU3RyaW5nUHJvcGVydHkoXCJcIiwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYmFja2dyb3VuZCA9IG5ldyBCYWNrZ3JvdW5kUHJvcGVydHkobmV3IENvbG9yQmFja2dyb3VuZChDb2xvci5XSElURSksIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfZm9yZUNvbG9yID0gbmV3IENvbG9yUHJvcGVydHkoQ29sb3IuQkxBQ0ssIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdGV4dEFsaWduID0gbmV3IFByb3BlcnR5PEVUZXh0QWxpZ24+KEVUZXh0QWxpZ24uTEVGVCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdmVydGljYWxBbGlnbiA9IG5ldyBQcm9wZXJ0eTxFVkFsaWduPihFVkFsaWduLlRPUCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYm9sZCA9IG5ldyBCb29sZWFuUHJvcGVydHkoZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2l0YWxpYyA9IG5ldyBCb29sZWFuUHJvcGVydHkoZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3VuZGVybGluZSA9IG5ldyBCb29sZWFuUHJvcGVydHkoZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2ZvbnRTaXplID0gbmV3IE51bWJlclByb3BlcnR5KDEyLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9mb250RmFtaWx5ID0gbmV3IFByb3BlcnR5PEZvbnRGYW1pbHk+KEZvbnRGYW1pbHkuQXJpYWwsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3BsYWNlaG9sZGVyID0gbmV3IFN0cmluZ1Byb3BlcnR5KG51bGwsIHRydWUpO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwicGFzc3dvcmRcIik7XG5cbiAgICAgICAgICAgIHRoaXMuYm9yZGVyID0gQm9yZGVyLmNyZWF0ZSgxLCBDb2xvci5MSUdIVF9HUkFZLCAwKTtcbiAgICAgICAgICAgIHRoaXMuX3dpZHRoLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy53aWR0aCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcIndpZHRoXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aCA9IHRoaXMud2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9oZWlnaHQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhlaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImhlaWdodFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHQgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl90ZXh0LmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50ZXh0ICE9IHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgdGhpcy50ZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2ZvcmVDb2xvci5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9yZUNvbG9yID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmNvbG9yID0gXCJyZ2JhKDAsMCwwLCAwLjApXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmNvbG9yID0gdGhpcy5mb3JlQ29sb3IudG9DU1MoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2ZvcmVDb2xvci5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl90ZXh0QWxpZ24uYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudGV4dEFsaWduLmFwcGx5KHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3RleHRBbGlnbi5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl92ZXJ0aWNhbEFsaWduLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdGEgPSB0aGlzLnZlcnRpY2FsQWxpZ247XG4gICAgICAgICAgICAgICAgaWYgKHRhID09IEVWQWxpZ24uVE9QKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52ZXJ0aWNhbEFsaWduID0gXCJ0b3BcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRhID09IEVWQWxpZ24uTUlERExFKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52ZXJ0aWNhbEFsaWduID0gXCJtaWRkbGVcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRhID09IEVWQWxpZ24uQk9UVE9NKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52ZXJ0aWNhbEFsaWduID0gXCJib3R0b21cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRpY2FsQWxpZ24uaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fdW5kZXJsaW5lLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy51bmRlcmxpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRleHREZWNvcmF0aW9uID0gXCJ1bmRlcmxpbmVcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudGV4dERlY29yYXRpb24gPSBcIm5vbmVcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3VuZGVybGluZS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9ib2xkLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ib2xkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250V2VpZ2h0ID0gXCJib2xkXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZvbnRXZWlnaHQgPSBcIm5vcm1hbFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fYm9sZC5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9pdGFsaWMuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLml0YWxpYykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFN0eWxlID0gXCJpdGFsaWNcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFN0eWxlID0gXCJub3JtYWxcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2l0YWxpYy5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9mb250U2l6ZS5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZvbnRTaXplID0gdGhpcy5mb250U2l6ZSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZm9udFNpemUuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fZm9udEZhbWlseS5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5mb250RmFtaWx5LmFwcGx5KHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2ZvbnRGYW1pbHkuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYmFja2dyb3VuZCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImJhY2tncm91bmRDb2xvclwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYmFja2dyb3VuZEltYWdlXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZC5hcHBseSh0aGlzLmVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZC5pbnZhbGlkYXRlKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3BsYWNlaG9sZGVyLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wbGFjZWhvbGRlciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIiwgdGhpcy5wbGFjZWhvbGRlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuV2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHdpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLldpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgaGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuSGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBoZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuSGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVGV4dCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZXh0O1xuICAgICAgICB9XG4gICAgICAgIGdldCB0ZXh0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVGV4dC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdGV4dCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5UZXh0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQmFja2dyb3VuZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9iYWNrZ3JvdW5kO1xuICAgICAgICB9XG4gICAgICAgIGdldCBiYWNrZ3JvdW5kKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQmFja2dyb3VuZC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYmFja2dyb3VuZCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5CYWNrZ3JvdW5kLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgRm9yZUNvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvcmVDb2xvcjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgZm9yZUNvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRm9yZUNvbG9yLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBmb3JlQ29sb3IodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuRm9yZUNvbG9yLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVGV4dEFsaWduKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RleHRBbGlnbjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdGV4dEFsaWduKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVGV4dEFsaWduLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0ZXh0QWxpZ24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVGV4dEFsaWduLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVmVydGljYWxBbGlnbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92ZXJ0aWNhbEFsaWduO1xuICAgICAgICB9XG4gICAgICAgIGdldCB2ZXJ0aWNhbEFsaWduKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVmVydGljYWxBbGlnbi52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdmVydGljYWxBbGlnbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5WZXJ0aWNhbEFsaWduLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm9sZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib2xkO1xuICAgICAgICB9XG4gICAgICAgIGdldCBib2xkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm9sZC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYm9sZCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Cb2xkLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgSXRhbGljKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2l0YWxpYztcbiAgICAgICAgfVxuICAgICAgICBnZXQgaXRhbGljKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuSXRhbGljLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBpdGFsaWModmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuSXRhbGljLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVW5kZXJsaW5lKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3VuZGVybGluZTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdW5kZXJsaW5lKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVW5kZXJsaW5lLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB1bmRlcmxpbmUodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVW5kZXJsaW5lLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgRm9udFNpemUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9udFNpemU7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGZvbnRTaXplKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRm9udFNpemUudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGZvbnRTaXplKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkZvbnRTaXplLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgRm9udEZhbWlseSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb250RmFtaWx5O1xuICAgICAgICB9XG4gICAgICAgIGdldCBmb250RmFtaWx5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRm9udEZhbWlseS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgZm9udEZhbWlseSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Gb250RmFtaWx5LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgUGxhY2Vob2xkZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGxhY2Vob2xkZXI7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHBsYWNlaG9sZGVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuUGxhY2Vob2xkZXIudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHBsYWNlaG9sZGVyKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlBsYWNlaG9sZGVyLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgIH1cblxufVxuXG5cbiIsIm5hbWVzcGFjZSBjdWJlZSB7XG5cbiAgICBleHBvcnQgY2xhc3MgVGV4dEFyZWEgZXh0ZW5kcyBBQ29tcG9uZW50IHtcblxuICAgICAgICBwcml2YXRlIF93aWR0aCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2hlaWdodCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3RleHQgPSBuZXcgU3RyaW5nUHJvcGVydHkoXCJcIiwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYmFja2dyb3VuZCA9IG5ldyBCYWNrZ3JvdW5kUHJvcGVydHkobmV3IENvbG9yQmFja2dyb3VuZChDb2xvci5XSElURSksIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfZm9yZUNvbG9yID0gbmV3IENvbG9yUHJvcGVydHkoQ29sb3IuQkxBQ0ssIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdGV4dEFsaWduID0gbmV3IFByb3BlcnR5PEVUZXh0QWxpZ24+KEVUZXh0QWxpZ24uTEVGVCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdmVydGljYWxBbGlnbiA9IG5ldyBQcm9wZXJ0eTxFVkFsaWduPihFVkFsaWduLlRPUCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYm9sZCA9IG5ldyBCb29sZWFuUHJvcGVydHkoZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2l0YWxpYyA9IG5ldyBCb29sZWFuUHJvcGVydHkoZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3VuZGVybGluZSA9IG5ldyBCb29sZWFuUHJvcGVydHkoZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2ZvbnRTaXplID0gbmV3IE51bWJlclByb3BlcnR5KDEyLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9mb250RmFtaWx5ID0gbmV3IFByb3BlcnR5PEZvbnRGYW1pbHk+KEZvbnRGYW1pbHkuQXJpYWwsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3BsYWNlaG9sZGVyID0gbmV3IFN0cmluZ1Byb3BlcnR5KG51bGwsIHRydWUpO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRleHRhcmVhXCIpKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwidGV4dFwiKTtcblxuICAgICAgICAgICAgdGhpcy5ib3JkZXIgPSBCb3JkZXIuY3JlYXRlKDEsIENvbG9yLkxJR0hUX0dSQVksIDApO1xuICAgICAgICAgICAgdGhpcy5fd2lkdGguYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLndpZHRoID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwid2lkdGhcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLndpZHRoID0gdGhpcy53aWR0aCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2hlaWdodC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGVpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiaGVpZ2h0XCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3RleHQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRleHQgIT0gdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShcInZhbHVlXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCB0aGlzLnRleHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZm9yZUNvbG9yLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mb3JlQ29sb3IgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuY29sb3IgPSBcInJnYmEoMCwwLDAsIDAuMClcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuY29sb3IgPSB0aGlzLmZvcmVDb2xvci50b0NTUygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZm9yZUNvbG9yLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3RleHRBbGlnbi5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0QWxpZ24uYXBwbHkodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdGV4dEFsaWduLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRpY2FsQWxpZ24uYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB0YSA9IHRoaXMudmVydGljYWxBbGlnbjtcbiAgICAgICAgICAgICAgICBpZiAodGEgPT0gRVZBbGlnbi5UT1ApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZlcnRpY2FsQWxpZ24gPSBcInRvcFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGEgPT0gRVZBbGlnbi5NSURETEUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZlcnRpY2FsQWxpZ24gPSBcIm1pZGRsZVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGEgPT0gRVZBbGlnbi5CT1RUT00pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZlcnRpY2FsQWxpZ24gPSBcImJvdHRvbVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdmVydGljYWxBbGlnbi5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl91bmRlcmxpbmUuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnVuZGVybGluZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudGV4dERlY29yYXRpb24gPSBcInVuZGVybGluZVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50ZXh0RGVjb3JhdGlvbiA9IFwibm9uZVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdW5kZXJsaW5lLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2JvbGQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZvbnRXZWlnaHQgPSBcImJvbGRcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFdlaWdodCA9IFwibm9ybWFsXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9ib2xkLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2l0YWxpYy5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXRhbGljKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250U3R5bGUgPSBcIml0YWxpY1wiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250U3R5bGUgPSBcIm5vcm1hbFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5faXRhbGljLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2ZvbnRTaXplLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFNpemUgPSB0aGlzLmZvbnRTaXplICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9mb250U2l6ZS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9mb250RmFtaWx5LmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmZvbnRGYW1pbHkuYXBwbHkodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZm9udEZhbWlseS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9iYWNrZ3JvdW5kLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5iYWNrZ3JvdW5kID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYmFja2dyb3VuZENvbG9yXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJiYWNrZ3JvdW5kSW1hZ2VcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLmFwcGx5KHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9iYWNrZ3JvdW5kLmludmFsaWRhdGUoKTtcblxuICAgICAgICAgICAgdGhpcy5fcGxhY2Vob2xkZXIuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBsYWNlaG9sZGVyID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShcInBsYWNlaG9sZGVyXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiLCB0aGlzLnBsYWNlaG9sZGVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBXaWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgd2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5XaWR0aC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgd2lkdGgodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuV2lkdGgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBIZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGdldCBoZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5IZWlnaHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGhlaWdodCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5IZWlnaHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUZXh0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RleHQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRleHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UZXh0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0ZXh0KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRleHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBCYWNrZ3JvdW5kKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JhY2tncm91bmQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJhY2tncm91bmQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5CYWNrZ3JvdW5kLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBiYWNrZ3JvdW5kKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkJhY2tncm91bmQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBGb3JlQ29sb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9yZUNvbG9yO1xuICAgICAgICB9XG4gICAgICAgIGdldCBmb3JlQ29sb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Gb3JlQ29sb3IudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGZvcmVDb2xvcih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Gb3JlQ29sb3IudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUZXh0QWxpZ24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGV4dEFsaWduO1xuICAgICAgICB9XG4gICAgICAgIGdldCB0ZXh0QWxpZ24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UZXh0QWxpZ24udmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHRleHRBbGlnbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5UZXh0QWxpZ24udmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBWZXJ0aWNhbEFsaWduKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZlcnRpY2FsQWxpZ247XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHZlcnRpY2FsQWxpZ24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5WZXJ0aWNhbEFsaWduLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB2ZXJ0aWNhbEFsaWduKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlZlcnRpY2FsQWxpZ24udmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBCb2xkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvbGQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJvbGQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Cb2xkLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBib2xkKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkJvbGQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBJdGFsaWMoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faXRhbGljO1xuICAgICAgICB9XG4gICAgICAgIGdldCBpdGFsaWMoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5JdGFsaWMudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGl0YWxpYyh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5JdGFsaWMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBVbmRlcmxpbmUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdW5kZXJsaW5lO1xuICAgICAgICB9XG4gICAgICAgIGdldCB1bmRlcmxpbmUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5VbmRlcmxpbmUudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHVuZGVybGluZSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5VbmRlcmxpbmUudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBGb250U2l6ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb250U2l6ZTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgZm9udFNpemUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Gb250U2l6ZS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgZm9udFNpemUodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuRm9udFNpemUudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBGb250RmFtaWx5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvbnRGYW1pbHk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGZvbnRGYW1pbHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Gb250RmFtaWx5LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBmb250RmFtaWx5KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkZvbnRGYW1pbHkudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBQbGFjZWhvbGRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wbGFjZWhvbGRlcjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgcGxhY2Vob2xkZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5QbGFjZWhvbGRlci52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgcGxhY2Vob2xkZXIodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuUGxhY2Vob2xkZXIudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG5cbiAgICB9XG5cbn1cblxuXG4iLCJuYW1lc3BhY2UgY3ViZWUge1xuXG4gICAgZXhwb3J0IGNsYXNzIENoZWNrQm94IGV4dGVuZHMgQUNvbXBvbmVudCB7XG5cbiAgICAgICAgcHJpdmF0ZSBfY2hlY2tlZCA9IG5ldyBCb29sZWFuUHJvcGVydHkoZmFsc2UsIGZhbHNlKTtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKSk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImNoZWNrYm94XCIpO1xuXG4gICAgICAgICAgICB0aGlzLl9jaGVja2VkLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgZTogYW55ID0gdGhpcy5lbGVtZW50O1xuICAgICAgICAgICAgICAgIGUuY2hlY2tlZCA9IHRoaXMuY2hlY2tlZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBnZXQgQ2hlY2tlZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGVja2VkO1xuICAgICAgICB9XG4gICAgICAgIGdldCBjaGVja2VkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQ2hlY2tlZC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgY2hlY2tlZCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5DaGVja2VkLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgIH1cblxufVxuXG5cbiIsIm5hbWVzcGFjZSBjdWJlZSB7XG5cbiAgICBleHBvcnQgY2xhc3MgQ29tYm9Cb3g8VD4gZXh0ZW5kcyBBQ29tcG9uZW50IHtcblxuICAgICAgICBwcml2YXRlIF9zZWxlY3RlZEluZGV4ID0gbmV3IE51bWJlclByb3BlcnR5KC0xLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9zZWxlY3RlZEl0ZW0gPSBuZXcgUHJvcGVydHk8VD4obnVsbCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIGl0ZW1zOiBUW10gPSBbXTtcbiAgICAgICAgcHJpdmF0ZSBfd2lkdGggPSBuZXcgTnVtYmVyUHJvcGVydHkobnVsbCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9oZWlnaHQgPSBuZXcgTnVtYmVyUHJvcGVydHkobnVsbCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF90ZXh0ID0gbmV3IFN0cmluZ1Byb3BlcnR5KFwiXCIsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2JhY2tncm91bmQgPSBuZXcgQmFja2dyb3VuZFByb3BlcnR5KG5ldyBDb2xvckJhY2tncm91bmQoQ29sb3IuV0hJVEUpLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2ZvcmVDb2xvciA9IG5ldyBDb2xvclByb3BlcnR5KENvbG9yLkJMQUNLLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3RleHRBbGlnbiA9IG5ldyBQcm9wZXJ0eTxFVGV4dEFsaWduPihFVGV4dEFsaWduLkxFRlQsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3ZlcnRpY2FsQWxpZ24gPSBuZXcgUHJvcGVydHk8RVZBbGlnbj4oRVZBbGlnbi5UT1AsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2JvbGQgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9pdGFsaWMgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF91bmRlcmxpbmUgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9mb250U2l6ZSA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgxMiwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfZm9udEZhbWlseSA9IG5ldyBQcm9wZXJ0eTxGb250RmFtaWx5PihGb250RmFtaWx5LkFyaWFsLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9wbGFjZWhvbGRlciA9IG5ldyBTdHJpbmdQcm9wZXJ0eShudWxsLCB0cnVlKTtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKSk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInNlbGVjdFwiKTtcblxuICAgICAgICAgICAgdGhpcy5ib3JkZXIgPSBCb3JkZXIuY3JlYXRlKDEsIENvbG9yLkxJR0hUX0dSQVksIDApO1xuICAgICAgICAgICAgdGhpcy5fd2lkdGguYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLndpZHRoID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwid2lkdGhcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLndpZHRoID0gdGhpcy53aWR0aCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2hlaWdodC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGVpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiaGVpZ2h0XCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3RleHQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRleHQgIT0gdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShcInZhbHVlXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCB0aGlzLnRleHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZm9yZUNvbG9yLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mb3JlQ29sb3IgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuY29sb3IgPSBcInJnYmEoMCwwLDAsIDAuMClcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuY29sb3IgPSB0aGlzLmZvcmVDb2xvci50b0NTUygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZm9yZUNvbG9yLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3RleHRBbGlnbi5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0QWxpZ24uYXBwbHkodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdGV4dEFsaWduLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRpY2FsQWxpZ24uYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB0YSA9IHRoaXMudmVydGljYWxBbGlnbjtcbiAgICAgICAgICAgICAgICBpZiAodGEgPT0gRVZBbGlnbi5UT1ApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZlcnRpY2FsQWxpZ24gPSBcInRvcFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGEgPT0gRVZBbGlnbi5NSURETEUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZlcnRpY2FsQWxpZ24gPSBcIm1pZGRsZVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGEgPT0gRVZBbGlnbi5CT1RUT00pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZlcnRpY2FsQWxpZ24gPSBcImJvdHRvbVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdmVydGljYWxBbGlnbi5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl91bmRlcmxpbmUuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnVuZGVybGluZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudGV4dERlY29yYXRpb24gPSBcInVuZGVybGluZVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50ZXh0RGVjb3JhdGlvbiA9IFwibm9uZVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdW5kZXJsaW5lLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2JvbGQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZvbnRXZWlnaHQgPSBcImJvbGRcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFdlaWdodCA9IFwibm9ybWFsXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9ib2xkLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2l0YWxpYy5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXRhbGljKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250U3R5bGUgPSBcIml0YWxpY1wiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250U3R5bGUgPSBcIm5vcm1hbFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5faXRhbGljLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2ZvbnRTaXplLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFNpemUgPSB0aGlzLmZvbnRTaXplICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9mb250U2l6ZS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9mb250RmFtaWx5LmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmZvbnRGYW1pbHkuYXBwbHkodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZm9udEZhbWlseS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9iYWNrZ3JvdW5kLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5iYWNrZ3JvdW5kID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYmFja2dyb3VuZENvbG9yXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJiYWNrZ3JvdW5kSW1hZ2VcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLmFwcGx5KHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9iYWNrZ3JvdW5kLmludmFsaWRhdGUoKTtcblxuICAgICAgICAgICAgdGhpcy5fcGxhY2Vob2xkZXIuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBsYWNlaG9sZGVyID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShcInBsYWNlaG9sZGVyXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiLCB0aGlzLnBsYWNlaG9sZGVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB2YWwgPSAoPEhUTUxTZWxlY3RFbGVtZW50PnRoaXMuZWxlbWVudCkudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHZhbCA9PSBudWxsIHx8IHZhbCA9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkSW5kZXgudmFsdWUgPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRJdGVtLnZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZEluZGV4LnZhbHVlID0gcGFyc2VJbnQodmFsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRJbmRleC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRJdGVtLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX3NlbGVjdGVkSXRlbS52YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkSW5kZXgudmFsdWUgPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgKDxIVE1MU2VsZWN0RWxlbWVudD50aGlzLmVsZW1lbnQpLnZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLml0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbSA9PSB0aGlzLml0ZW1zW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkSW5kZXgudmFsdWUgPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICg8SFRNTFNlbGVjdEVsZW1lbnQ+dGhpcy5lbGVtZW50KS52YWx1ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZEluZGV4LnZhbHVlID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICAoPEhUTUxTZWxlY3RFbGVtZW50PnRoaXMuZWxlbWVudCkudmFsdWUgPSBcIlwiICsgaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBXaWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgd2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5XaWR0aC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgd2lkdGgodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuV2lkdGgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBIZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGdldCBoZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5IZWlnaHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGhlaWdodCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5IZWlnaHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUZXh0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RleHQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRleHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UZXh0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0ZXh0KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRleHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBCYWNrZ3JvdW5kKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JhY2tncm91bmQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJhY2tncm91bmQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5CYWNrZ3JvdW5kLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBiYWNrZ3JvdW5kKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkJhY2tncm91bmQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBGb3JlQ29sb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9yZUNvbG9yO1xuICAgICAgICB9XG4gICAgICAgIGdldCBmb3JlQ29sb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Gb3JlQ29sb3IudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGZvcmVDb2xvcih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Gb3JlQ29sb3IudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUZXh0QWxpZ24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGV4dEFsaWduO1xuICAgICAgICB9XG4gICAgICAgIGdldCB0ZXh0QWxpZ24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UZXh0QWxpZ24udmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHRleHRBbGlnbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5UZXh0QWxpZ24udmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBWZXJ0aWNhbEFsaWduKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZlcnRpY2FsQWxpZ247XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHZlcnRpY2FsQWxpZ24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5WZXJ0aWNhbEFsaWduLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB2ZXJ0aWNhbEFsaWduKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlZlcnRpY2FsQWxpZ24udmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBCb2xkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvbGQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJvbGQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Cb2xkLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBib2xkKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkJvbGQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBJdGFsaWMoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faXRhbGljO1xuICAgICAgICB9XG4gICAgICAgIGdldCBpdGFsaWMoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5JdGFsaWMudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGl0YWxpYyh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5JdGFsaWMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBVbmRlcmxpbmUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdW5kZXJsaW5lO1xuICAgICAgICB9XG4gICAgICAgIGdldCB1bmRlcmxpbmUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5VbmRlcmxpbmUudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHVuZGVybGluZSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5VbmRlcmxpbmUudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBGb250U2l6ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb250U2l6ZTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgZm9udFNpemUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Gb250U2l6ZS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgZm9udFNpemUodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuRm9udFNpemUudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBGb250RmFtaWx5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvbnRGYW1pbHk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGZvbnRGYW1pbHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Gb250RmFtaWx5LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBmb250RmFtaWx5KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkZvbnRGYW1pbHkudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBQbGFjZWhvbGRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wbGFjZWhvbGRlcjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgcGxhY2Vob2xkZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5QbGFjZWhvbGRlci52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgcGxhY2Vob2xkZXIodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuUGxhY2Vob2xkZXIudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcHJvdGVjdGVkIHNlbGVjdGVkSW5kZXhQcm9wZXJ0eSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZEluZGV4O1xuICAgICAgICB9XG4gICAgICAgIGdldCBTZWxlY3RlZEluZGV4KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRJbmRleFByb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHNlbGVjdGVkSW5kZXgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5TZWxlY3RlZEluZGV4LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBzZWxlY3RlZEluZGV4KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlNlbGVjdGVkSW5kZXgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcHJvdGVjdGVkIHNlbGVjdGVkSXRlbVByb3BlcnR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkSXRlbTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgU2VsZWN0ZWRJdGVtKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRJdGVtUHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgc2VsZWN0ZWRJdGVtKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuU2VsZWN0ZWRJdGVtLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBzZWxlY3RlZEl0ZW0odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRJdGVtLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgIH1cblxufVxuXG5cbiIsIm5hbWVzcGFjZSBjdWJlZSB7XG5cbiAgICBleHBvcnQgY2xhc3MgUGljdHVyZUJveCBleHRlbmRzIEFDb21wb25lbnQge1xuXG4gICAgICAgIHByaXZhdGUgX3dpZHRoID0gbmV3IE51bWJlclByb3BlcnR5KDUwLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9oZWlnaHQgPSBuZXcgTnVtYmVyUHJvcGVydHkoNTAsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3BpY3R1cmVTaXplTW9kZSA9IG5ldyBQcm9wZXJ0eTxFUGljdHVyZVNpemVNb2RlPihFUGljdHVyZVNpemVNb2RlLk5PUk1BTCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfaW1hZ2UgPSBuZXcgUHJvcGVydHk8SW1hZ2U+KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYmFja2dyb3VuZCA9IG5ldyBCYWNrZ3JvdW5kUHJvcGVydHkobnVsbCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9pbWdFbGVtZW50OiBIVE1MSW1hZ2VFbGVtZW50ID0gbnVsbDtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgIHRoaXMuX2ltZ0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICAgICAgdGhpcy5faW1nRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLl9pbWdFbGVtZW50KTtcbiAgICAgICAgICAgIHRoaXMuX3dpZHRoLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlY2FsY3VsYXRlU2l6ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl93aWR0aC5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9oZWlnaHQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucmVjYWxjdWxhdGVTaXplKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2hlaWdodC5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9waWN0dXJlU2l6ZU1vZGUuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucmVjYWxjdWxhdGVTaXplKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3BpY3R1cmVTaXplTW9kZS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9pbWFnZS5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2ltYWdlLnZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbWFnZS5hcHBseSh0aGlzLl9pbWdFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmltYWdlLmxvYWRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbWFnZS5vbkxvYWQuYWRkTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVjYWxjdWxhdGVTaXplKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ltZ0VsZW1lbnQuc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlY2FsY3VsYXRlU2l6ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9pbWFnZS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9iYWNrZ3JvdW5kLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5iYWNrZ3JvdW5kID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYmFja2dyb3VuZENvbG9yXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJiYWNrZ3JvdW5kSW1hZ2VcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLmFwcGx5KHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9iYWNrZ3JvdW5kLmludmFsaWRhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgcmVjYWxjdWxhdGVTaXplKCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLndpZHRoID0gdGhpcy53aWR0aCArIFwicHhcIjtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodCArIFwicHhcIjtcbiAgICAgICAgICAgIGxldCBwc20gPSB0aGlzLnBpY3R1cmVTaXplTW9kZTtcbiAgICAgICAgICAgIGxldCBpbWdXaWR0aCA9IDA7XG4gICAgICAgICAgICBsZXQgaW1nSGVpZ2h0ID0gMDtcbiAgICAgICAgICAgIGxldCBwaWNXaWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICAgICAgICBsZXQgcGljSGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgICAgICAgICBsZXQgY3ggPSAwO1xuICAgICAgICAgICAgbGV0IGN5ID0gMDtcbiAgICAgICAgICAgIGxldCBjdyA9IDA7XG4gICAgICAgICAgICBsZXQgY2ggPSAwO1xuICAgICAgICAgICAgbGV0IGltZ1JhdGlvOiBudW1iZXIgPSBudWxsO1xuICAgICAgICAgICAgbGV0IHBpY1JhdGlvID0gcGljV2lkdGggLyBwaWNIZWlnaHQ7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmltYWdlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpbWdXaWR0aCA9IHRoaXMuaW1hZ2Uud2lkdGg7XG4gICAgICAgICAgICAgICAgaW1nSGVpZ2h0ID0gdGhpcy5pbWFnZS5oZWlnaHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW1nV2lkdGggPT0gMCB8fCBpbWdIZWlnaHQgPT0gMCkge1xuICAgICAgICAgICAgICAgIC8vIG5vdGhpbmcgdG8gZG8gaGVyZVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbWdSYXRpbyA9IGltZ1dpZHRoIC8gaW1nSGVpZ2h0O1xuICAgICAgICAgICAgICAgIGlmIChwc20gPT0gRVBpY3R1cmVTaXplTW9kZS5DRU5URVIpIHtcbiAgICAgICAgICAgICAgICAgICAgY3ggPSAoaW1nV2lkdGggLSBwaWNXaWR0aCkgLyAyO1xuICAgICAgICAgICAgICAgICAgICBjeSA9IChpbWdIZWlnaHQgLSBwaWNIZWlnaHQpIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgY3cgPSBpbWdXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgY2ggPSBpbWdIZWlnaHQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwc20gPT0gRVBpY3R1cmVTaXplTW9kZS5GSUxMKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbWdSYXRpbyA+IHBpY1JhdGlvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmaXQgaGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgICAgICBjeSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaCA9IHBpY0hlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN3ID0gKGNoICogaW1nUmF0aW8pIHwgMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN4ID0gKHBpY1dpZHRoIC0gY3cpIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZpdCB3aWR0aFxuICAgICAgICAgICAgICAgICAgICAgICAgY3ggPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3cgPSBwaWNXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoID0gKGN3IC8gaW1nUmF0aW8pIHwgMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN5ID0gKHBpY0hlaWdodCAtIGNoKSAvIDI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHBzbSA9PSBFUGljdHVyZVNpemVNb2RlLkZJVF9IRUlHSFQpIHtcbiAgICAgICAgICAgICAgICAgICAgY3kgPSAwO1xuICAgICAgICAgICAgICAgICAgICBjaCA9IHBpY0hlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgY3cgPSAoY2ggKiBpbWdSYXRpbykgfCAwO1xuICAgICAgICAgICAgICAgICAgICBjeCA9IChwaWNXaWR0aCAtIGN3KSAvIDI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwc20gPT0gRVBpY3R1cmVTaXplTW9kZS5GSVRfV0lEVEgpIHtcbiAgICAgICAgICAgICAgICAgICAgY3ggPSAwO1xuICAgICAgICAgICAgICAgICAgICBjdyA9IHBpY1dpZHRoO1xuICAgICAgICAgICAgICAgICAgICBjaCA9IChjdyAvIGltZ1JhdGlvKSB8IDA7XG4gICAgICAgICAgICAgICAgICAgIGN5ID0gKHBpY0hlaWdodCAtIGNoKSAvIDI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwc20gPT0gRVBpY3R1cmVTaXplTW9kZS5OT1JNQUwpIHtcbiAgICAgICAgICAgICAgICAgICAgY3ggPSAwO1xuICAgICAgICAgICAgICAgICAgICBjeSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGN3ID0gaW1nV2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIGNoID0gaW1nSGVpZ2h0O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocHNtID09IEVQaWN0dXJlU2l6ZU1vZGUuU1RSRVRDSCkge1xuICAgICAgICAgICAgICAgICAgICBjeCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGN5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgY3cgPSBwaWNXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgY2ggPSBwaWNIZWlnaHQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwc20gPT0gRVBpY3R1cmVTaXplTW9kZS5aT09NKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbWdSYXRpbyA+IHBpY1JhdGlvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmaXQgd2lkdGhcbiAgICAgICAgICAgICAgICAgICAgICAgIGN4ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN3ID0gcGljV2lkdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaCA9IChjdyAvIGltZ1JhdGlvKSB8IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBjeSA9IChwaWNIZWlnaHQgLSBjaCkgLyAyO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZml0IGhlaWdodFxuICAgICAgICAgICAgICAgICAgICAgICAgY3kgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2ggPSBwaWNIZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdyA9IChjaCAqIGltZ1JhdGlvKSB8IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBjeCA9IChwaWNXaWR0aCAtIGN3KSAvIDI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0gY3ggKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gY3kgKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2lkdGggPSBjdyArIFwicHhcIjtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBjaCArIFwicHhcIjtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIHBpY3R1cmVTaXplTW9kZVByb3BlcnR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BpY3R1cmVTaXplTW9kZTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgUGljdHVyZVNpemVNb2RlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGljdHVyZVNpemVNb2RlUHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgcGljdHVyZVNpemVNb2RlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuUGljdHVyZVNpemVNb2RlLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBwaWN0dXJlU2l6ZU1vZGUodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuUGljdHVyZVNpemVNb2RlLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgd2lkdGhQcm9wZXJ0eSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy53aWR0aFByb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuV2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHdpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLldpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgaGVpZ2h0UHJvcGVydHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGdldCBIZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oZWlnaHRQcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIGdldCBoZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5IZWlnaHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGhlaWdodCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5IZWlnaHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBwYWRkaW5nUHJvcGVydHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIucGFkZGluZ1Byb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IFBhZGRpbmcoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYWRkaW5nUHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgcGFkZGluZygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlBhZGRpbmcudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHBhZGRpbmcodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuUGFkZGluZy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIGJvcmRlclByb3BlcnR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmJvcmRlclByb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IEJvcmRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJvcmRlclByb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJvcmRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkJvcmRlci52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYm9yZGVyKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkJvcmRlci52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIGJhY2tncm91bmRQcm9wZXJ0eSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9iYWNrZ3JvdW5kO1xuICAgICAgICB9XG4gICAgICAgIGdldCBCYWNrZ3JvdW5kKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYmFja2dyb3VuZFByb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJhY2tncm91bmQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5CYWNrZ3JvdW5kLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBiYWNrZ3JvdW5kKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkJhY2tncm91bmQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBpbWFnZVByb3BlcnR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ltYWdlO1xuICAgICAgICB9XG4gICAgICAgIGdldCBJbWFnZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmltYWdlUHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgaW1hZ2UoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5JbWFnZS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgaW1hZ2UodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuSW1hZ2UudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG59XG5cbiIsIm5hbWVzcGFjZSBjdWJlZSB7XG5cbiAgICBleHBvcnQgY2xhc3MgQVBvcHVwIHtcblxuICAgICAgICBwcml2YXRlIF9tb2RhbDogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBwcml2YXRlIF9hdXRvQ2xvc2UgPSB0cnVlO1xuICAgICAgICBwcml2YXRlIF9nbGFzc0NvbG9yID0gQ29sb3IuVFJBTlNQQVJFTlQ7XG5cbiAgICAgICAgcHJpdmF0ZSBfdHJhbnNsYXRlWCA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF90cmFuc2xhdGVZID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2NlbnRlciA9IG5ldyBCb29sZWFuUHJvcGVydHkoZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG5cbiAgICAgICAgcHJpdmF0ZSBfcG9wdXBSb290OiBQYW5lbCA9IG51bGw7XG4gICAgICAgIHByaXZhdGUgX3Jvb3RDb21wb25lbnRDb250YWluZXI6IFBhbmVsID0gbnVsbDtcbiAgICAgICAgcHJpdmF0ZSBfcm9vdENvbXBvbmVudDogQUNvbXBvbmVudCA9IG51bGw7XG5cbiAgICAgICAgcHJpdmF0ZSBfdmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKG1vZGFsOiBib29sZWFuID0gdHJ1ZSwgYXV0b0Nsb3NlOiBib29sZWFuID0gdHJ1ZSwgZ2xhc3NDb2xvciA9IENvbG9yLmdldEFyZ2JDb2xvcigweDAwMDAwMDAwKSkge1xuICAgICAgICAgICAgdGhpcy5fbW9kYWwgPSBtb2RhbDtcbiAgICAgICAgICAgIHRoaXMuX2F1dG9DbG9zZSA9IGF1dG9DbG9zZTtcbiAgICAgICAgICAgIHRoaXMuX2dsYXNzQ29sb3IgPSBnbGFzc0NvbG9yO1xuICAgICAgICAgICAgdGhpcy5fcG9wdXBSb290ID0gbmV3IFBhbmVsKCk7XG4gICAgICAgICAgICB0aGlzLl9wb3B1cFJvb3QuZWxlbWVudC5zdHlsZS5sZWZ0ID0gXCIwcHhcIjtcbiAgICAgICAgICAgIHRoaXMuX3BvcHVwUm9vdC5lbGVtZW50LnN0eWxlLnRvcCA9IFwiMHB4XCI7XG4gICAgICAgICAgICB0aGlzLl9wb3B1cFJvb3QuZWxlbWVudC5zdHlsZS5yaWdodCA9IFwiMHB4XCI7XG4gICAgICAgICAgICB0aGlzLl9wb3B1cFJvb3QuZWxlbWVudC5zdHlsZS5ib3R0b20gPSBcIjBweFwiO1xuICAgICAgICAgICAgdGhpcy5fcG9wdXBSb290LmVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSBcImZpeGVkXCI7XG4gICAgICAgICAgICBpZiAoZ2xhc3NDb2xvciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcG9wdXBSb290LmJhY2tncm91bmQgPSBuZXcgQ29sb3JCYWNrZ3JvdW5kKGdsYXNzQ29sb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1vZGFsIHx8IGF1dG9DbG9zZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3BvcHVwUm9vdC5lbGVtZW50LnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcImFsbFwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wb3B1cFJvb3QuZWxlbWVudC5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJub25lXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5fcG9wdXBSb290LnBvaW50ZXJUcmFuc3BhcmVudCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX3Jvb3RDb21wb25lbnRDb250YWluZXIgPSBuZXcgUGFuZWwoKTtcbiAgICAgICAgICAgIHRoaXMuX3Jvb3RDb21wb25lbnRDb250YWluZXIuVHJhbnNsYXRlWC5iaW5kKG5ldyBFeHByZXNzaW9uPG51bWJlcj4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBiYXNlWCA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2NlbnRlci52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBiYXNlWCA9ICh0aGlzLl9wb3B1cFJvb3QuY2xpZW50V2lkdGggLSB0aGlzLl9yb290Q29tcG9uZW50Q29udGFpbmVyLmJvdW5kc1dpZHRoKSAvIDI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBiYXNlWCArIHRoaXMuX3RyYW5zbGF0ZVgudmFsdWU7XG4gICAgICAgICAgICB9LCB0aGlzLl9jZW50ZXIsIHRoaXMuX3BvcHVwUm9vdC5DbGllbnRXaWR0aCwgdGhpcy5fdHJhbnNsYXRlWCxcbiAgICAgICAgICAgICAgICB0aGlzLl9yb290Q29tcG9uZW50Q29udGFpbmVyLkJvdW5kc1dpZHRoKSk7XG4gICAgICAgICAgICB0aGlzLl9yb290Q29tcG9uZW50Q29udGFpbmVyLlRyYW5zbGF0ZVkuYmluZChuZXcgRXhwcmVzc2lvbjxudW1iZXI+KCgpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgYmFzZVkgPSAwO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jZW50ZXIudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgYmFzZVkgPSAodGhpcy5fcG9wdXBSb290LmNsaWVudEhlaWdodCAtIHRoaXMuX3Jvb3RDb21wb25lbnRDb250YWluZXIuYm91bmRzSGVpZ2h0KSAvIDI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBiYXNlWSArIHRoaXMuX3RyYW5zbGF0ZVkudmFsdWU7XG4gICAgICAgICAgICB9LCB0aGlzLl9jZW50ZXIsIHRoaXMuX3BvcHVwUm9vdC5DbGllbnRIZWlnaHQsIHRoaXMuX3RyYW5zbGF0ZVksXG4gICAgICAgICAgICAgICAgdGhpcy5fcm9vdENvbXBvbmVudENvbnRhaW5lci5Cb3VuZHNIZWlnaHQpKTtcbiAgICAgICAgICAgIHRoaXMuX3BvcHVwUm9vdC5jaGlsZHJlbi5hZGQodGhpcy5fcm9vdENvbXBvbmVudENvbnRhaW5lcik7XG5cbiAgICAgICAgICAgIGlmIChhdXRvQ2xvc2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wb3B1cFJvb3Qub25DbGljay5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBfX3BvcHVwUm9vdCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wb3B1cFJvb3Q7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IHJvb3RDb21wb25lbnQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcm9vdENvbXBvbmVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBzZXQgcm9vdENvbXBvbmVudChyb290Q29tcG9uZW50OiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9yb290Q29tcG9uZW50Q29udGFpbmVyLmNoaWxkcmVuLmNsZWFyKCk7XG4gICAgICAgICAgICB0aGlzLl9yb290Q29tcG9uZW50ID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChyb290Q29tcG9uZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yb290Q29tcG9uZW50Q29udGFpbmVyLmNoaWxkcmVuLmFkZChyb290Q29tcG9uZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3Jvb3RDb21wb25lbnQgPSByb290Q29tcG9uZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIHNob3coKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fdmlzaWJsZSkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhpcyBwb3B1cCBpcyBhbHJlYWR5IHNob3duLlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGJvZHk6IEhUTUxCb2R5RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXTtcbiAgICAgICAgICAgIGJvZHkuYXBwZW5kQ2hpbGQodGhpcy5fcG9wdXBSb290LmVsZW1lbnQpO1xuICAgICAgICAgICAgUG9wdXBzLl9hZGRQb3B1cCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuX3Zpc2libGUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIGNsb3NlKCk6IGJvb2xlYW4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl92aXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGlzIHBvcHVwIGlzbid0IHNob3duLlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzQ2xvc2VBbGxvd2VkKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYm9keTogSFRNTEJvZHlFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJib2R5XCIpWzBdO1xuICAgICAgICAgICAgYm9keS5yZW1vdmVDaGlsZCh0aGlzLl9wb3B1cFJvb3QuZWxlbWVudCk7XG4gICAgICAgICAgICBQb3B1cHMuX3JlbW92ZVBvcHVwKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5fdmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5vbkNsb3NlZCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgaXNDbG9zZUFsbG93ZWQoKTogYm9vbGVhbiB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBvbkNsb3NlZCgpIHtcblxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IG1vZGFsKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21vZGFsO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGF1dG9DbG9zZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hdXRvQ2xvc2U7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgZ2xhc3NDb2xvcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9nbGFzc0NvbG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFRyYW5zbGF0ZVgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNsYXRlWDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdHJhbnNsYXRlWCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlRyYW5zbGF0ZVgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHRyYW5zbGF0ZVgodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVHJhbnNsYXRlWC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFRyYW5zbGF0ZVkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNsYXRlWTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdHJhbnNsYXRlWSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlRyYW5zbGF0ZVkudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHRyYW5zbGF0ZVkodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVHJhbnNsYXRlWS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IENlbnRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jZW50ZXI7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGNlbnRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkNlbnRlci52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgY2VudGVyKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkNlbnRlci52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgX2xheW91dCgpIHtcbiAgICAgICAgICAgIHRoaXMuX3BvcHVwUm9vdC53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICAgICAgdGhpcy5fcG9wdXBSb290LmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgICAgIHRoaXMuX3BvcHVwUm9vdC5sYXlvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFBvcHVwcyB7XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX3BvcHVwczogQVBvcHVwW10gPSBbXTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX2xheW91dFJ1bk9uY2UgPSBuZXcgUnVuT25jZSgoKSA9PiB7XG4gICAgICAgICAgICBQb3B1cHMubGF5b3V0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHN0YXRpYyBfYWRkUG9wdXAocG9wdXA6IEFQb3B1cCkge1xuICAgICAgICAgICAgUG9wdXBzLl9wb3B1cHMucHVzaChwb3B1cCk7XG4gICAgICAgICAgICBQb3B1cHMuX3JlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRpYyBfcmVtb3ZlUG9wdXAocG9wdXA6IEFQb3B1cCkge1xuICAgICAgICAgICAgdmFyIGlkeCA9IFBvcHVwcy5fcG9wdXBzLmluZGV4T2YocG9wdXApO1xuICAgICAgICAgICAgaWYgKGlkeCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgUG9wdXBzLl9wb3B1cHMuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgICAgICAgICAgUG9wdXBzLl9yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0aWMgX3JlcXVlc3RMYXlvdXQoKSB7XG4gICAgICAgICAgICBQb3B1cHMuX2xheW91dFJ1bk9uY2UucnVuKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBsYXlvdXQoKSB7XG4gICAgICAgICAgICBQb3B1cHMuX3BvcHVwcy5mb3JFYWNoKChwb3B1cCkgPT4ge1xuICAgICAgICAgICAgICAgIHBvcHVwLl9sYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICB0aHJvdyBcIkNhbiBub3QgaW5zdGFudGlhdGUgUG9wdXBzIGNsYXNzLlwiXG4gICAgICAgIH1cblxuICAgIH1cblxufVxuXG5cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ1dGlscy50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJldmVudHMudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicHJvcGVydGllcy50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJzdHlsZXMudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicnBjLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImNvbXBvbmVudF9iYXNlL0xheW91dENoaWxkcmVuLnRzXCIvPiBcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJjb21wb25lbnRfYmFzZS9BQ29tcG9uZW50LnRzXCIvPiBcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJjb21wb25lbnRfYmFzZS9BTGF5b3V0LnRzXCIvPiBcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJjb21wb25lbnRfYmFzZS9BVXNlckNvbnRyb2wudHNcIi8+IFxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImNvbXBvbmVudF9iYXNlL0FWaWV3LnRzXCIvPiBcblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImxheW91dHMvUGFuZWwudHNcIi8+ICBcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJsYXlvdXRzL0hCb3gudHNcIi8+ICAgXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwibGF5b3V0cy9WQm94LnRzXCIvPiAgICBcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJsYXlvdXRzL1Njcm9sbEJveC50c1wiLz4gICAgXG4gICAgXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiY29tcG9uZW50cy9MYWJlbC50c1wiLz4gIFxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImNvbXBvbmVudHMvQnV0dG9uLnRzXCIvPiAgICBcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJjb21wb25lbnRzL1RleHRCb3gudHNcIi8+ICAgIFxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImNvbXBvbmVudHMvUGFzc3dvcmRCb3gudHNcIi8+ICAgICBcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJjb21wb25lbnRzL1RleHRBcmVhLnRzXCIvPiAgICBcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJjb21wb25lbnRzL0NoZWNrQm94LnRzXCIvPiAgICAgXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiY29tcG9uZW50cy9Db21ib0JveC50c1wiLz4gICAgIFxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImNvbXBvbmVudHMvUGljdHVyZUJveC50c1wiLz4gICAgIFxuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicG9wdXBzLnRzXCIvPiAgXG5cbi8vIGh0bWwgY29tcG9uZW50XG4vLyBoeXBlcmxpbmtcblxuLy8gZmFpY29uXG4vLyBlaWNvblxuXG4vLyBFVkVOVFNcblxuXG5uYW1lc3BhY2UgY3ViZWUgeyAgICAgICAgICAgICAgICBcblxuICAgIGV4cG9ydCBjbGFzcyBDdWJlZVBhbmVsIHsgICAgICAgIFxuXG4gICAgICAgIHByaXZhdGUgX2xheW91dFJ1bk9uY2U6IFJ1bk9uY2UgPSBudWxsOyBcblxuICAgICAgICBwcml2YXRlIF9jb250ZW50UGFuZWw6IFBhbmVsID0gbnVsbDtcbiAgICAgICAgcHJpdmF0ZSBfcm9vdENvbXBvbmVudDogQUNvbXBvbmVudCA9IG51bGw7XG5cblxuICAgICAgICBwcml2YXRlIF9lbGVtZW50OiBIVE1MRWxlbWVudDtcblxuICAgICAgICBwcml2YXRlIF9sZWZ0ID0gLTE7XG4gICAgICAgIHByaXZhdGUgX3RvcCA9IC0xO1xuICAgICAgICBwcml2YXRlIF9jbGllbnRXaWR0aCA9IC0xO1xuICAgICAgICBwcml2YXRlIF9jbGllbnRIZWlnaHQgPSAtMTtcbiAgICAgICAgcHJpdmF0ZSBfb2Zmc2V0V2lkdGggPSAtMTtcbiAgICAgICAgcHJpdmF0ZSBfb2Zmc2V0SGVpZ2h0ID0gLTE7XG5cbiAgICAgICAgY29uc3RydWN0b3IoZWxlbWVudDogSFRNTERpdkVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJvbnJlc2l6ZVwiLCAoZXZ0OiBVSUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5fY29udGVudFBhbmVsID0gbmV3IFBhbmVsKCk7XG4gICAgICAgICAgICB0aGlzLl9jb250ZW50UGFuZWwuZWxlbWVudC5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJub25lXCI7XG4gICAgICAgICAgICB0aGlzLl9jb250ZW50UGFuZWwucG9pbnRlclRyYW5zcGFyZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbC5zZXRDdWJlZVBhbmVsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLl9jb250ZW50UGFuZWwuZWxlbWVudCk7XG5cbiAgICAgICAgICAgIHRoaXMuY2hlY2tCb3VuZHMoKTtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuXG4gICAgICAgICAgICB2YXIgdCA9IG5ldyBUaW1lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgRXZlbnRRdWV1ZS5JbnN0YW5jZS5pbnZva2VMYXRlcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tCb3VuZHMoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdC5zdGFydCgxMDAsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBjaGVja0JvdW5kcygpIHtcbiAgICAgICAgICAgIC8vIFRPRE8gb2Zmc2V0TGVmdCAtPiBhYnNvbHV0ZUxlZnRcbiAgICAgICAgICAgIHZhciBuZXdMZWZ0ID0gdGhpcy5fZWxlbWVudC5vZmZzZXRMZWZ0O1xuICAgICAgICAgICAgLy8gVE9ETyBvZmZzZXRUb3AgLT4gYWJzb2x1dGVUb3BcbiAgICAgICAgICAgIHZhciBuZXdUb3AgPSB0aGlzLl9lbGVtZW50Lm9mZnNldFRvcDtcbiAgICAgICAgICAgIHZhciBuZXdDbGllbnRXaWR0aCA9IHRoaXMuX2VsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgICAgICAgICB2YXIgbmV3Q2xpZW50SGVpZ2h0ID0gdGhpcy5fZWxlbWVudC5jbGllbnRIZWlnaHQ7XG4gICAgICAgICAgICB2YXIgbmV3T2Zmc2V0V2lkdGggPSB0aGlzLl9lbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICAgICAgdmFyIG5ld09mZnNldEhlaWdodCA9IHRoaXMuX2VsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgaWYgKG5ld0xlZnQgIT0gdGhpcy5fbGVmdCB8fCBuZXdUb3AgIT0gdGhpcy5fdG9wIHx8IG5ld0NsaWVudFdpZHRoICE9IHRoaXMuX2NsaWVudFdpZHRoIHx8IG5ld0NsaWVudEhlaWdodCAhPSB0aGlzLl9jbGllbnRIZWlnaHRcbiAgICAgICAgICAgICAgICB8fCBuZXdPZmZzZXRXaWR0aCAhPSB0aGlzLl9vZmZzZXRXaWR0aCB8fCBuZXdPZmZzZXRIZWlnaHQgIT0gdGhpcy5fb2Zmc2V0SGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGVmdCA9IG5ld0xlZnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fdG9wID0gbmV3VG9wO1xuICAgICAgICAgICAgICAgIHRoaXMuX2NsaWVudFdpZHRoID0gbmV3Q2xpZW50V2lkdGg7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2xpZW50SGVpZ2h0ID0gbmV3Q2xpZW50SGVpZ2h0O1xuICAgICAgICAgICAgICAgIHRoaXMuX29mZnNldFdpZHRoID0gbmV3T2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICAgICAgdGhpcy5fb2Zmc2V0SGVpZ2h0ID0gbmV3T2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbC53aWR0aCA9IHRoaXMuX29mZnNldFdpZHRoO1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbC5oZWlnaHQgPSB0aGlzLl9vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2VsZW1lbnQuc3R5bGUucG9zaXRpb24gPT0gXCJhYnNvbHV0ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbC50cmFuc2xhdGVYID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29udGVudFBhbmVsLnRyYW5zbGF0ZVkgPSAwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbC50cmFuc2xhdGVYID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29udGVudFBhbmVsLnRyYW5zbGF0ZVkgPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlcXVlc3RMYXlvdXQoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fbGF5b3V0UnVuT25jZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGF5b3V0UnVuT25jZSA9IG5ldyBSdW5PbmNlKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXlvdXQoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2xheW91dFJ1bk9uY2UucnVuKCk7XG4gICAgICAgIH1cblxuICAgICAgICBsYXlvdXQoKSB7XG4gICAgICAgICAgICBQb3B1cHMuX3JlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbC5sYXlvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCByb290Q29tcG9uZW50KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jvb3RDb21wb25lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBzZXQgcm9vdENvbXBvbmVudChyb290Q29tcG9uZW50OiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9jb250ZW50UGFuZWwuY2hpbGRyZW4uY2xlYXIoKTtcbiAgICAgICAgICAgIHRoaXMuX3Jvb3RDb21wb25lbnQgPSBudWxsO1xuICAgICAgICAgICAgaWYgKHJvb3RDb21wb25lbnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbC5jaGlsZHJlbi5hZGQocm9vdENvbXBvbmVudCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcm9vdENvbXBvbmVudCA9IHJvb3RDb21wb25lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQ2xpZW50V2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY29udGVudFBhbmVsLkNsaWVudFdpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGdldCBjbGllbnRXaWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkNsaWVudFdpZHRoLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBjbGllbnRXaWR0aCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5DbGllbnRXaWR0aC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IENsaWVudEhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250ZW50UGFuZWwuQ2xpZW50SGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGdldCBjbGllbnRIZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5DbGllbnRIZWlnaHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGNsaWVudEhlaWdodCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5DbGllbnRIZWlnaHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBCb3VuZHNXaWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250ZW50UGFuZWwuQm91bmRzV2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJvdW5kc1dpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm91bmRzV2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGJvdW5kc1dpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkJvdW5kc1dpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm91bmRzSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRlbnRQYW5lbC5Cb3VuZHNIZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJvdW5kc0hlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkJvdW5kc0hlaWdodC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYm91bmRzSGVpZ2h0KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkJvdW5kc0hlaWdodC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEJvdW5kc0xlZnQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY29udGVudFBhbmVsLkJvdW5kc0xlZnQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJvdW5kc0xlZnQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Cb3VuZHNMZWZ0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBib3VuZHNMZWZ0KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkJvdW5kc0xlZnQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBCb3VuZHNUb3AoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY29udGVudFBhbmVsLkJvdW5kc1RvcDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm91bmRzVG9wKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm91bmRzVG9wLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBib3VuZHNUb3AodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQm91bmRzVG9wLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgIH1cblxufVxuXG5cbiJdfQ==