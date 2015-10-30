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
    })();
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
    })();
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
            for (var l in this._listeners) {
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
    })();
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
    })();
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
        EventQueue.instance = null;
        return EventQueue;
    })();
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
    })();
    cubee.RunOnce = RunOnce;
    var ParentChangedEventArgs = (function (_super) {
        __extends(ParentChangedEventArgs, _super);
        function ParentChangedEventArgs(newParent, sender) {
            _super.call(this, sender);
            this.newParent = newParent;
            this.sender = sender;
        }
        return ParentChangedEventArgs;
    })(EventArgs);
    cubee.ParentChangedEventArgs = ParentChangedEventArgs;
})(cubee || (cubee = {}));
/// <reference path="events.ts"/>
var cubee;
(function (cubee) {
    var Property = (function () {
        function Property(_value, _nullable, _readonly, _validator) {
            var _this = this;
            if (_nullable === void 0) { _nullable = true; }
            if (_readonly === void 0) { _readonly = false; }
            if (_validator === void 0) { _validator = null; }
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
        Property._nextId = 0;
        return Property;
    })();
    cubee.Property = Property;
    var Expression = (function () {
        function Expression(func) {
            var _this = this;
            var activators = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                activators[_i - 1] = arguments[_i];
            }
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
                properties[_i - 0] = arguments[_i];
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
    })();
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
    })();
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
    })();
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
    })();
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
        AAnimator.animators = [];
        AAnimator.ANIMATOR_TASK = function () {
            AAnimator.animate();
        };
        return AAnimator;
    })();
    cubee.AAnimator = AAnimator;
    var Timeline = (function (_super) {
        __extends(Timeline, _super);
        function Timeline(keyFrames) {
            _super.call(this);
            this.keyFrames = keyFrames;
            this.propertyLines = [];
            this.repeatCount = 0;
            this.finishedEvent = new cubee.Event();
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
                    var startTime = Date.now();
                    this.propertyLines.forEach(function (propertyLine) {
                        var pl = propertyLine;
                        pl.startTime = startTime;
                    });
                }
                else {
                    this.repeatCount--;
                    if (this.repeatCount > -1) {
                        var startTime = Date.now();
                        this.propertyLines.forEach(function (propertyLine) {
                            var pl = propertyLine;
                            pl.startTime = startTime;
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
    })(AAnimator);
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
    })();
    cubee.TimelineFinishedEventArgs = TimelineFinishedEventArgs;
    var NumberProperty = (function (_super) {
        __extends(NumberProperty, _super);
        function NumberProperty() {
            _super.apply(this, arguments);
        }
        NumberProperty.prototype.animate = function (pos, startValue, endValue) {
            return startValue + ((endValue - startValue) * pos);
        };
        return NumberProperty;
    })(Property);
    cubee.NumberProperty = NumberProperty;
    var StringProperty = (function (_super) {
        __extends(StringProperty, _super);
        function StringProperty() {
            _super.apply(this, arguments);
        }
        return StringProperty;
    })(Property);
    cubee.StringProperty = StringProperty;
    var PaddingProperty = (function (_super) {
        __extends(PaddingProperty, _super);
        function PaddingProperty() {
            _super.apply(this, arguments);
        }
        return PaddingProperty;
    })(Property);
    cubee.PaddingProperty = PaddingProperty;
    var BorderProperty = (function (_super) {
        __extends(BorderProperty, _super);
        function BorderProperty() {
            _super.apply(this, arguments);
        }
        return BorderProperty;
    })(Property);
    cubee.BorderProperty = BorderProperty;
    var BackgroundProperty = (function (_super) {
        __extends(BackgroundProperty, _super);
        function BackgroundProperty() {
            _super.apply(this, arguments);
        }
        return BackgroundProperty;
    })(Property);
    cubee.BackgroundProperty = BackgroundProperty;
    var BooleanProperty = (function (_super) {
        __extends(BooleanProperty, _super);
        function BooleanProperty() {
            _super.apply(this, arguments);
        }
        return BooleanProperty;
    })(Property);
    cubee.BooleanProperty = BooleanProperty;
    var ColorProperty = (function (_super) {
        __extends(ColorProperty, _super);
        function ColorProperty() {
            _super.apply(this, arguments);
        }
        return ColorProperty;
    })(Property);
    cubee.ColorProperty = ColorProperty;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var ABackground = (function () {
        function ABackground() {
        }
        return ABackground;
    })();
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
        Color._TRANSPARENT = Color.getArgbColor(0x00000000);
        Color._WHITE = Color.getArgbColor(0xffffffff);
        Color._BLACK = Color.getArgbColor(0xff000000);
        Color._LIGHT_GRAY = Color.getArgbColor(0xffcccccc);
        return Color;
    })();
    cubee.Color = Color;
    var ColorBackground = (function (_super) {
        __extends(ColorBackground, _super);
        function ColorBackground(color) {
            _super.call(this);
            this._color = null;
            this._cache = null;
            this._color = color;
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
    })(ABackground);
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
    })();
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
    })();
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
    })();
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
        ETextOverflow._CLIP = new ETextOverflow("clip");
        ETextOverflow._ELLIPSIS = new ETextOverflow("ellipsis");
        return ETextOverflow;
    })();
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
        ETextAlign._LEFT = new ETextAlign("left");
        ETextAlign._CENTER = new ETextAlign("center");
        ETextAlign._RIGHT = new ETextAlign("right");
        ETextAlign._JUSTIFY = new ETextAlign("justify");
        return ETextAlign;
    })();
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
        EHAlign._LEFT = new EHAlign("left");
        EHAlign._CENTER = new EHAlign("center");
        EHAlign._RIGHT = new EHAlign("right");
        return EHAlign;
    })();
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
        EVAlign._TOP = new EVAlign("top");
        EVAlign._MIDDLE = new EVAlign("middle");
        EVAlign._BOTTOM = new EVAlign("bottom");
        return EVAlign;
    })();
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
        FontFamily._arial = new FontFamily("Arial, Helvetica, sans-serif");
        FontFamily.initialized = false;
        return FontFamily;
    })();
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
        ECursor.auto = new ECursor("auto");
        return ECursor;
    })();
    cubee.ECursor = ECursor;
    (function (EScrollBarPolicy) {
        EScrollBarPolicy[EScrollBarPolicy["VISIBLE"] = 0] = "VISIBLE";
        EScrollBarPolicy[EScrollBarPolicy["AUTO"] = 1] = "AUTO";
        EScrollBarPolicy[EScrollBarPolicy["HIDDEN"] = 2] = "HIDDEN";
    })(cubee.EScrollBarPolicy || (cubee.EScrollBarPolicy = {}));
    var EScrollBarPolicy = cubee.EScrollBarPolicy;
    (function (EPictureSizeMode) {
        EPictureSizeMode[EPictureSizeMode["NORMAL"] = 0] = "NORMAL";
        EPictureSizeMode[EPictureSizeMode["CENTER"] = 1] = "CENTER";
        EPictureSizeMode[EPictureSizeMode["STRETCH"] = 2] = "STRETCH";
        EPictureSizeMode[EPictureSizeMode["FILL"] = 3] = "FILL";
        EPictureSizeMode[EPictureSizeMode["ZOOM"] = 4] = "ZOOM";
        EPictureSizeMode[EPictureSizeMode["FIT_WIDTH"] = 5] = "FIT_WIDTH";
        EPictureSizeMode[EPictureSizeMode["FIT_HEIGHT"] = 6] = "FIT_HEIGHT";
    })(cubee.EPictureSizeMode || (cubee.EPictureSizeMode = {}));
    var EPictureSizeMode = cubee.EPictureSizeMode;
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
    })();
    cubee.Image = Image;
})(cubee || (cubee = {}));
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
    })();
    cubee.Point2D = Point2D;
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
    })();
    cubee.LayoutChildren = LayoutChildren;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var MouseEventTypes = (function () {
        function MouseEventTypes() {
        }
        MouseEventTypes.MOUSE_DOWN = 0;
        MouseEventTypes.MOUSE_MOVE = 1;
        MouseEventTypes.MOUSE_UP = 2;
        MouseEventTypes.MOUSE_ENTER = 3;
        MouseEventTypes.MOUSE_LEAVE = 4;
        MouseEventTypes.MOUSE_WHEEL = 5;
        return MouseEventTypes;
    })();
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
    })();
    cubee.AComponent = AComponent;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var ALayout = (function (_super) {
        __extends(ALayout, _super);
        function ALayout(element) {
            _super.call(this, element);
            this._children = new cubee.LayoutChildren(this);
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
    })(cubee.AComponent);
    cubee.ALayout = ALayout;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var AUserControl = (function (_super) {
        __extends(AUserControl, _super);
        function AUserControl() {
            var _this = this;
            _super.call(this, document.createElement("div"));
            this._width = new cubee.NumberProperty(null, true, false);
            this._height = new cubee.NumberProperty(null, true, false);
            this._background = new cubee.BackgroundProperty(new cubee.ColorBackground(cubee.Color.TRANSPARENT), true, false);
            this._shadow = new cubee.Property(null, true, false);
            this._draggable = new cubee.BooleanProperty(false);
            this.element.style.overflowX = "hidden";
            this.element.style.overflowY = "hidden";
            this._width.addChangeListener(function () {
                if (_this._width.value == null) {
                    _this.element.style.removeProperty("width");
                }
                else {
                    _this.element.style.width = "" + _this._width.value + "px";
                }
                _this.requestLayout();
            });
            this._width.invalidate();
            this._height.addChangeListener(function () {
                if (_this._height.value == null) {
                    _this.element.style.removeProperty("height");
                }
                else {
                    _this.element.style.height = "" + _this._height.value + "px";
                }
                _this.requestLayout();
            });
            this._height.invalidate();
            this._background.addChangeListener(function () {
                _this.element.style.removeProperty("backgroundColor");
                _this.element.style.removeProperty("backgroundImage");
                _this.element.style.removeProperty("background");
                if (_this._background.value != null) {
                    _this._background.value.apply(_this.element);
                }
            });
            this._background.invalidate();
            this._shadow.addChangeListener(function () {
                if (_this._shadow.value == null) {
                    _this.element.style.removeProperty("boxShadow");
                }
                else {
                    _this._shadow.value.apply(_this.element);
                }
            });
            this._draggable.addChangeListener(function () {
                if (_this._draggable.value) {
                    _this.element.setAttribute("draggable", "true");
                }
                else {
                    _this.element.setAttribute("draggable", "false");
                }
            });
            this._draggable.invalidate();
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
    })(cubee.ALayout);
    cubee.AUserControl = AUserControl;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var AView = (function (_super) {
        __extends(AView, _super);
        function AView(_model) {
            _super.call(this);
            this._model = _model;
        }
        Object.defineProperty(AView.prototype, "model", {
            get: function () {
                return this._model;
            },
            enumerable: true,
            configurable: true
        });
        return AView;
    })(cubee.AUserControl);
    cubee.AView = AView;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var Panel = (function (_super) {
        __extends(Panel, _super);
        function Panel() {
            _super.apply(this, arguments);
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
    })(cubee.AUserControl);
    cubee.Panel = Panel;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var HBox = (function (_super) {
        __extends(HBox, _super);
        function HBox() {
            var _this = this;
            _super.call(this, document.createElement("div"));
            this._height = new cubee.NumberProperty(null, true, false);
            this._cellWidths = [];
            this._hAligns = [];
            this._vAligns = [];
            this.element.style.overflow = "hidden";
            this.pointerTransparent = true;
            this._height.addChangeListener(function () {
                _this.requestLayout();
            });
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
    })(cubee.ALayout);
    cubee.HBox = HBox;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var VBox = (function (_super) {
        __extends(VBox, _super);
        function VBox() {
            var _this = this;
            _super.call(this, document.createElement("div"));
            this._width = new cubee.NumberProperty(null, true, false);
            this._cellHeights = [];
            this._hAligns = [];
            this._vAligns = [];
            this.element.style.overflow = "hidden";
            this.pointerTransparent = true;
            this._width.addChangeListener(function () {
                _this.requestLayout();
            });
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
    })(cubee.ALayout);
    cubee.VBox = VBox;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var ScrollBox = (function (_super) {
        __extends(ScrollBox, _super);
        function ScrollBox() {
            var _this = this;
            _super.call(this);
            this._content = new cubee.Property(null);
            this._hScrollPolicy = new cubee.Property(cubee.EScrollBarPolicy.AUTO, false);
            this._vScrollPolicy = new cubee.Property(cubee.EScrollBarPolicy.AUTO, false);
            this._scrollWidth = new cubee.NumberProperty(0, false, true);
            this._scrollHeight = new cubee.NumberProperty(0, false, true);
            this._hScrollPos = new cubee.NumberProperty(0, false, true);
            this._vScrollPos = new cubee.NumberProperty(0, false, true);
            this._maxHScrollPos = new cubee.NumberProperty(0, false, true);
            this._maxVScrollPos = new cubee.NumberProperty(0, false, true);
            this._maxHScrollPosWriter = new cubee.NumberProperty(0, false, false);
            this._maxVScrollPosWriter = new cubee.NumberProperty(0, false, false);
            this._calculateScrollWidthExp = new cubee.Expression(function () {
                if (_this.content == null) {
                    return 0;
                }
                return _this.content.boundsWidth;
            }, this._content);
            this._calculateScrollHeightExp = new cubee.Expression(function () {
                if (_this.content == null) {
                    return 0;
                }
                return _this.content.boundsHeight;
            }, this._content);
            this.element.style.removeProperty("overflow");
            this._scrollWidth.initReadonlyBind(this._calculateScrollWidthExp);
            this._scrollHeight.initReadonlyBind(this._calculateScrollHeightExp);
            this._maxHScrollPos.initReadonlyBind(this._maxHScrollPosWriter);
            this._maxVScrollPos.initReadonlyBind(this._maxVScrollPosWriter);
            this._maxHScrollPosWriter.bind(new cubee.Expression(function () {
                return (_this.scrollWidth - _this.clientWidth);
            }, this.ClientWidth, this._scrollWidth));
            this._maxVScrollPosWriter.bind(new cubee.Expression(function () {
                return (_this.scrollHeight - _this.clientHeight);
            }, this.ClientHeight, this._scrollHeight));
            this._content.addChangeListener(function () {
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
            this.element.addEventListener("scroll", function (evt) {
                _this.hScrollPos = _this.element.scrollLeft;
                _this.vScrollPos = _this.element.scrollTop;
            });
            this._hScrollPos.addChangeListener(function () {
                _this.element.scrollLeft = _this.hScrollPos;
            });
            this._hScrollPos.addChangeListener(function () {
                _this.element.scrollTop = _this.vScrollPos;
            });
            this._hScrollPolicy.addChangeListener(function () {
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
            this._hScrollPolicy.invalidate();
            this._vScrollPolicy.addChangeListener(function () {
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
            this._vScrollPolicy.invalidate();
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
    })(cubee.AUserControl);
    cubee.ScrollBox = ScrollBox;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var Label = (function (_super) {
        __extends(Label, _super);
        function Label() {
            var _this = this;
            _super.call(this, document.createElement("div"));
            this._width = new cubee.NumberProperty(null, true, false);
            this._height = new cubee.NumberProperty(null, true, false);
            this._text = new cubee.StringProperty("", false, false);
            this._textOverflow = new cubee.Property(cubee.ETextOverflow.CLIP, false, false);
            this._foreColor = new cubee.ColorProperty(cubee.Color.BLACK, true, false);
            this._textAlign = new cubee.Property(cubee.ETextAlign.LEFT, false, false);
            this._verticalAlign = new cubee.Property(cubee.EVAlign.TOP, false, false);
            this._bold = new cubee.BooleanProperty(false, false, false);
            this._italic = new cubee.BooleanProperty(false, false, false);
            this._underline = new cubee.BooleanProperty(false, false, false);
            this._fontSize = new cubee.NumberProperty(12, false, false);
            this._fontFamily = new cubee.Property(cubee.FontFamily.Arial, false, false);
            this._width.addChangeListener(function () {
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
            this._width.invalidate();
            this._height.addChangeListener(function () {
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
            this._height.invalidate();
            this._text.addChangeListener(function () {
                _this.element.innerHTML = _this.text;
                _this.requestLayout();
            });
            this._text.invalidate();
            this._textOverflow.addChangeListener(function () {
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
            this._textOverflow.invalidate();
            this._foreColor.addChangeListener(function () {
                if (_this.foreColor == null) {
                    _this.element.style.color = "rgba(0,0,0,0.0)";
                }
                else {
                    _this.element.style.color = _this.foreColor.toCSS();
                }
            });
            this._foreColor.invalidate();
            this._textAlign.addChangeListener(function () {
                _this.textAlign.apply(_this.element);
            });
            this._textAlign.invalidate();
            this._verticalAlign.addChangeListener(function () {
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
            this._verticalAlign.invalidate();
            this._underline.addChangeListener(function () {
                if (_this.underline) {
                    _this.element.style.textDecoration = "underline";
                }
                else {
                    _this.element.style.textDecoration = "none";
                }
                _this.requestLayout();
            });
            this._underline.invalidate();
            this._bold.addChangeListener(function () {
                if (_this.bold) {
                    _this.element.style.fontWeight = "bold";
                }
                else {
                    _this.element.style.fontWeight = "normal";
                }
                _this.requestLayout();
            });
            this._bold.invalidate();
            this._italic.addChangeListener(function () {
                if (_this.italic) {
                    _this.element.style.fontStyle = "italic";
                }
                else {
                    _this.element.style.fontStyle = "normal";
                }
                _this.requestLayout();
            });
            this._italic.invalidate();
            this._fontSize.addChangeListener(function () {
                _this.element.style.fontSize = _this.fontSize + "px";
                _this.requestLayout();
            });
            this._fontSize.invalidate();
            this._fontFamily.addChangeListener(function () {
                _this.fontFamily.apply(_this.element);
                _this.requestLayout();
            });
            this._fontFamily.invalidate();
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
    })(cubee.AComponent);
    cubee.Label = Label;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button() {
            var _this = this;
            _super.call(this, document.createElement("button"));
            this._width = new cubee.NumberProperty(null, true, false);
            this._height = new cubee.NumberProperty(null, true, false);
            this._text = new cubee.StringProperty("", false, false);
            this._textOverflow = new cubee.Property(cubee.ETextOverflow.CLIP, false, false);
            this._foreColor = new cubee.ColorProperty(cubee.Color.BLACK, true, false);
            this._textAlign = new cubee.Property(cubee.ETextAlign.CENTER, false, false);
            this._verticalAlign = new cubee.Property(cubee.EVAlign.MIDDLE, false, false);
            this._bold = new cubee.BooleanProperty(false, false, false);
            this._italic = new cubee.BooleanProperty(false, false, false);
            this._underline = new cubee.BooleanProperty(false, false, false);
            this._fontSize = new cubee.NumberProperty(12, false, false);
            this._fontFamily = new cubee.Property(cubee.FontFamily.Arial, false, false);
            this._background = new cubee.BackgroundProperty(new cubee.ColorBackground(cubee.Color.TRANSPARENT), true, false);
            this._shadow = new cubee.Property(null, true, false);
            this.padding = cubee.Padding.create(10);
            this._width.addChangeListener(function () {
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
            this._width.invalidate();
            this._height.addChangeListener(function () {
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
            this._height.invalidate();
            this._text.addChangeListener(function () {
                _this.element.innerHTML = _this.text;
                _this.requestLayout();
            });
            this._text.invalidate();
            this._textOverflow.addChangeListener(function () {
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
            this._textOverflow.invalidate();
            this._foreColor.addChangeListener(function () {
                if (_this.foreColor == null) {
                    _this.element.style.color = "rgba(0,0,0,0.0)";
                }
                else {
                    _this.element.style.color = _this.foreColor.toCSS();
                }
            });
            this._foreColor.invalidate();
            this._textAlign.addChangeListener(function () {
                _this.textAlign.apply(_this.element);
            });
            this._textAlign.invalidate();
            this._verticalAlign.addChangeListener(function () {
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
            this._verticalAlign.invalidate();
            this._underline.addChangeListener(function () {
                if (_this.underline) {
                    _this.element.style.textDecoration = "underline";
                }
                else {
                    _this.element.style.textDecoration = "none";
                }
                _this.requestLayout();
            });
            this._underline.invalidate();
            this._bold.addChangeListener(function () {
                if (_this.bold) {
                    _this.element.style.fontWeight = "bold";
                }
                else {
                    _this.element.style.fontWeight = "normal";
                }
                _this.requestLayout();
            });
            this._bold.invalidate();
            this._italic.addChangeListener(function () {
                if (_this.italic) {
                    _this.element.style.fontStyle = "italic";
                }
                else {
                    _this.element.style.fontStyle = "normal";
                }
                _this.requestLayout();
            });
            this._italic.invalidate();
            this._fontSize.addChangeListener(function () {
                _this.element.style.fontSize = _this.fontSize + "px";
                _this.requestLayout();
            });
            this._fontSize.invalidate();
            this._fontFamily.addChangeListener(function () {
                _this.fontFamily.apply(_this.element);
                _this.requestLayout();
            });
            this._fontFamily.invalidate();
            this._background.addChangeListener(function () {
                _this.element.style.removeProperty("backgroundColor");
                _this.element.style.removeProperty("backgroundImage");
                _this.element.style.removeProperty("background");
                if (_this._background.value != null) {
                    _this._background.value.apply(_this.element);
                }
            });
            this._background.invalidate();
            this._shadow.addChangeListener(function () {
                if (_this._shadow.value == null) {
                    _this.element.style.removeProperty("boxShadow");
                }
                else {
                    _this._shadow.value.apply(_this.element);
                }
            });
            this.border = cubee.Border.create(1, cubee.Color.LIGHT_GRAY, 2);
            this.fontSize = 14;
            this.bold = true;
            this.background = new cubee.ColorBackground(cubee.Color.WHITE);
            this.shadow = new cubee.BoxShadow(1, 1, 5, 0, cubee.Color.LIGHT_GRAY, false);
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
    })(cubee.AComponent);
    cubee.Button = Button;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var TextBox = (function (_super) {
        __extends(TextBox, _super);
        function TextBox() {
            var _this = this;
            _super.call(this, document.createElement("input"));
            this._width = new cubee.NumberProperty(null, true, false);
            this._height = new cubee.NumberProperty(null, true, false);
            this._text = new cubee.StringProperty("", false, false);
            this._background = new cubee.BackgroundProperty(new cubee.ColorBackground(cubee.Color.WHITE), true, false);
            this._foreColor = new cubee.ColorProperty(cubee.Color.BLACK, true, false);
            this._textAlign = new cubee.Property(cubee.ETextAlign.LEFT, false, false);
            this._verticalAlign = new cubee.Property(cubee.EVAlign.TOP, false, false);
            this._bold = new cubee.BooleanProperty(false, false, false);
            this._italic = new cubee.BooleanProperty(false, false, false);
            this._underline = new cubee.BooleanProperty(false, false, false);
            this._fontSize = new cubee.NumberProperty(12, false, false);
            this._fontFamily = new cubee.Property(cubee.FontFamily.Arial, false, false);
            this._placeholder = new cubee.StringProperty(null, true);
            this.element.setAttribute("type", "text");
            this.border = cubee.Border.create(1, cubee.Color.LIGHT_GRAY, 0);
            this._width.addChangeListener(function () {
                if (_this.width == null) {
                    _this.element.style.removeProperty("width");
                }
                else {
                    _this.element.style.width = _this.width + "px";
                }
                _this.requestLayout();
            });
            this._height.addChangeListener(function () {
                if (_this.height == null) {
                    _this.element.style.removeProperty("height");
                }
                else {
                    _this.element.style.height = _this.height + "px";
                }
                _this.requestLayout();
            });
            this._text.addChangeListener(function () {
                if (_this.text != _this.element.getAttribute("value")) {
                    _this.element.setAttribute("value", _this.text);
                }
            });
            this._foreColor.addChangeListener(function () {
                if (_this.foreColor == null) {
                    _this.element.style.color = "rgba(0,0,0, 0.0)";
                }
                else {
                    _this.element.style.color = _this.foreColor.toCSS();
                }
            });
            this._foreColor.invalidate();
            this._textAlign.addChangeListener(function () {
                _this.textAlign.apply(_this.element);
            });
            this._textAlign.invalidate();
            this._verticalAlign.addChangeListener(function () {
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
            this._verticalAlign.invalidate();
            this._underline.addChangeListener(function () {
                if (_this.underline) {
                    _this.element.style.textDecoration = "underline";
                }
                else {
                    _this.element.style.textDecoration = "none";
                }
                _this.requestLayout();
            });
            this._underline.invalidate();
            this._bold.addChangeListener(function () {
                if (_this.bold) {
                    _this.element.style.fontWeight = "bold";
                }
                else {
                    _this.element.style.fontWeight = "normal";
                }
                _this.requestLayout();
            });
            this._bold.invalidate();
            this._italic.addChangeListener(function () {
                if (_this.italic) {
                    _this.element.style.fontStyle = "italic";
                }
                else {
                    _this.element.style.fontStyle = "normal";
                }
                _this.requestLayout();
            });
            this._italic.invalidate();
            this._fontSize.addChangeListener(function () {
                _this.element.style.fontSize = _this.fontSize + "px";
                _this.requestLayout();
            });
            this._fontSize.invalidate();
            this._fontFamily.addChangeListener(function () {
                _this.fontFamily.apply(_this.element);
                _this.requestLayout();
            });
            this._fontFamily.invalidate();
            this._background.addChangeListener(function () {
                if (_this.background == null) {
                    _this.element.style.removeProperty("backgroundColor");
                    _this.element.style.removeProperty("backgroundImage");
                }
                else {
                    _this.background.apply(_this.element);
                }
            });
            this._background.invalidate();
            this._placeholder.addChangeListener(function () {
                if (_this.placeholder == null) {
                    _this.element.removeAttribute("placeholder");
                }
                else {
                    _this.element.setAttribute("placeholder", _this.placeholder);
                }
            });
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
    })(cubee.AComponent);
    cubee.TextBox = TextBox;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var PasswordBox = (function (_super) {
        __extends(PasswordBox, _super);
        function PasswordBox() {
            var _this = this;
            _super.call(this, document.createElement("input"));
            this._width = new cubee.NumberProperty(null, true, false);
            this._height = new cubee.NumberProperty(null, true, false);
            this._text = new cubee.StringProperty("", false, false);
            this._background = new cubee.BackgroundProperty(new cubee.ColorBackground(cubee.Color.WHITE), true, false);
            this._foreColor = new cubee.ColorProperty(cubee.Color.BLACK, true, false);
            this._textAlign = new cubee.Property(cubee.ETextAlign.LEFT, false, false);
            this._verticalAlign = new cubee.Property(cubee.EVAlign.TOP, false, false);
            this._bold = new cubee.BooleanProperty(false, false, false);
            this._italic = new cubee.BooleanProperty(false, false, false);
            this._underline = new cubee.BooleanProperty(false, false, false);
            this._fontSize = new cubee.NumberProperty(12, false, false);
            this._fontFamily = new cubee.Property(cubee.FontFamily.Arial, false, false);
            this._placeholder = new cubee.StringProperty(null, true);
            this.element.setAttribute("type", "password");
            this.border = cubee.Border.create(1, cubee.Color.LIGHT_GRAY, 0);
            this._width.addChangeListener(function () {
                if (_this.width == null) {
                    _this.element.style.removeProperty("width");
                }
                else {
                    _this.element.style.width = _this.width + "px";
                }
                _this.requestLayout();
            });
            this._height.addChangeListener(function () {
                if (_this.height == null) {
                    _this.element.style.removeProperty("height");
                }
                else {
                    _this.element.style.height = _this.height + "px";
                }
                _this.requestLayout();
            });
            this._text.addChangeListener(function () {
                if (_this.text != _this.element.getAttribute("value")) {
                    _this.element.setAttribute("value", _this.text);
                }
            });
            this._foreColor.addChangeListener(function () {
                if (_this.foreColor == null) {
                    _this.element.style.color = "rgba(0,0,0, 0.0)";
                }
                else {
                    _this.element.style.color = _this.foreColor.toCSS();
                }
            });
            this._foreColor.invalidate();
            this._textAlign.addChangeListener(function () {
                _this.textAlign.apply(_this.element);
            });
            this._textAlign.invalidate();
            this._verticalAlign.addChangeListener(function () {
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
            this._verticalAlign.invalidate();
            this._underline.addChangeListener(function () {
                if (_this.underline) {
                    _this.element.style.textDecoration = "underline";
                }
                else {
                    _this.element.style.textDecoration = "none";
                }
                _this.requestLayout();
            });
            this._underline.invalidate();
            this._bold.addChangeListener(function () {
                if (_this.bold) {
                    _this.element.style.fontWeight = "bold";
                }
                else {
                    _this.element.style.fontWeight = "normal";
                }
                _this.requestLayout();
            });
            this._bold.invalidate();
            this._italic.addChangeListener(function () {
                if (_this.italic) {
                    _this.element.style.fontStyle = "italic";
                }
                else {
                    _this.element.style.fontStyle = "normal";
                }
                _this.requestLayout();
            });
            this._italic.invalidate();
            this._fontSize.addChangeListener(function () {
                _this.element.style.fontSize = _this.fontSize + "px";
                _this.requestLayout();
            });
            this._fontSize.invalidate();
            this._fontFamily.addChangeListener(function () {
                _this.fontFamily.apply(_this.element);
                _this.requestLayout();
            });
            this._fontFamily.invalidate();
            this._background.addChangeListener(function () {
                if (_this.background == null) {
                    _this.element.style.removeProperty("backgroundColor");
                    _this.element.style.removeProperty("backgroundImage");
                }
                else {
                    _this.background.apply(_this.element);
                }
            });
            this._background.invalidate();
            this._placeholder.addChangeListener(function () {
                if (_this.placeholder == null) {
                    _this.element.removeAttribute("placeholder");
                }
                else {
                    _this.element.setAttribute("placeholder", _this.placeholder);
                }
            });
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
    })(cubee.AComponent);
    cubee.PasswordBox = PasswordBox;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var TextArea = (function (_super) {
        __extends(TextArea, _super);
        function TextArea() {
            var _this = this;
            _super.call(this, document.createElement("textarea"));
            this._width = new cubee.NumberProperty(null, true, false);
            this._height = new cubee.NumberProperty(null, true, false);
            this._text = new cubee.StringProperty("", false, false);
            this._background = new cubee.BackgroundProperty(new cubee.ColorBackground(cubee.Color.WHITE), true, false);
            this._foreColor = new cubee.ColorProperty(cubee.Color.BLACK, true, false);
            this._textAlign = new cubee.Property(cubee.ETextAlign.LEFT, false, false);
            this._verticalAlign = new cubee.Property(cubee.EVAlign.TOP, false, false);
            this._bold = new cubee.BooleanProperty(false, false, false);
            this._italic = new cubee.BooleanProperty(false, false, false);
            this._underline = new cubee.BooleanProperty(false, false, false);
            this._fontSize = new cubee.NumberProperty(12, false, false);
            this._fontFamily = new cubee.Property(cubee.FontFamily.Arial, false, false);
            this._placeholder = new cubee.StringProperty(null, true);
            this.element.setAttribute("type", "text");
            this.border = cubee.Border.create(1, cubee.Color.LIGHT_GRAY, 0);
            this._width.addChangeListener(function () {
                if (_this.width == null) {
                    _this.element.style.removeProperty("width");
                }
                else {
                    _this.element.style.width = _this.width + "px";
                }
                _this.requestLayout();
            });
            this._height.addChangeListener(function () {
                if (_this.height == null) {
                    _this.element.style.removeProperty("height");
                }
                else {
                    _this.element.style.height = _this.height + "px";
                }
                _this.requestLayout();
            });
            this._text.addChangeListener(function () {
                if (_this.text != _this.element.getAttribute("value")) {
                    _this.element.setAttribute("value", _this.text);
                }
            });
            this._foreColor.addChangeListener(function () {
                if (_this.foreColor == null) {
                    _this.element.style.color = "rgba(0,0,0, 0.0)";
                }
                else {
                    _this.element.style.color = _this.foreColor.toCSS();
                }
            });
            this._foreColor.invalidate();
            this._textAlign.addChangeListener(function () {
                _this.textAlign.apply(_this.element);
            });
            this._textAlign.invalidate();
            this._verticalAlign.addChangeListener(function () {
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
            this._verticalAlign.invalidate();
            this._underline.addChangeListener(function () {
                if (_this.underline) {
                    _this.element.style.textDecoration = "underline";
                }
                else {
                    _this.element.style.textDecoration = "none";
                }
                _this.requestLayout();
            });
            this._underline.invalidate();
            this._bold.addChangeListener(function () {
                if (_this.bold) {
                    _this.element.style.fontWeight = "bold";
                }
                else {
                    _this.element.style.fontWeight = "normal";
                }
                _this.requestLayout();
            });
            this._bold.invalidate();
            this._italic.addChangeListener(function () {
                if (_this.italic) {
                    _this.element.style.fontStyle = "italic";
                }
                else {
                    _this.element.style.fontStyle = "normal";
                }
                _this.requestLayout();
            });
            this._italic.invalidate();
            this._fontSize.addChangeListener(function () {
                _this.element.style.fontSize = _this.fontSize + "px";
                _this.requestLayout();
            });
            this._fontSize.invalidate();
            this._fontFamily.addChangeListener(function () {
                _this.fontFamily.apply(_this.element);
                _this.requestLayout();
            });
            this._fontFamily.invalidate();
            this._background.addChangeListener(function () {
                if (_this.background == null) {
                    _this.element.style.removeProperty("backgroundColor");
                    _this.element.style.removeProperty("backgroundImage");
                }
                else {
                    _this.background.apply(_this.element);
                }
            });
            this._background.invalidate();
            this._placeholder.addChangeListener(function () {
                if (_this.placeholder == null) {
                    _this.element.removeAttribute("placeholder");
                }
                else {
                    _this.element.setAttribute("placeholder", _this.placeholder);
                }
            });
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
    })(cubee.AComponent);
    cubee.TextArea = TextArea;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var CheckBox = (function (_super) {
        __extends(CheckBox, _super);
        function CheckBox() {
            var _this = this;
            _super.call(this, document.createElement("input"));
            this._checked = new cubee.BooleanProperty(false, false);
            this.element.setAttribute("type", "checkbox");
            this._checked.addChangeListener(function () {
                var e = _this.element;
                e.checked = _this.checked;
            });
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
    })(cubee.AComponent);
    cubee.CheckBox = CheckBox;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var ComboBox = (function (_super) {
        __extends(ComboBox, _super);
        function ComboBox() {
            var _this = this;
            _super.call(this, document.createElement("input"));
            this._selectedIndex = new cubee.NumberProperty(-1, false, false);
            this._selectedItem = new cubee.Property(null, true, false);
            this.items = [];
            this._width = new cubee.NumberProperty(null, true, false);
            this._height = new cubee.NumberProperty(null, true, false);
            this._text = new cubee.StringProperty("", false, false);
            this._background = new cubee.BackgroundProperty(new cubee.ColorBackground(cubee.Color.WHITE), true, false);
            this._foreColor = new cubee.ColorProperty(cubee.Color.BLACK, true, false);
            this._textAlign = new cubee.Property(cubee.ETextAlign.LEFT, false, false);
            this._verticalAlign = new cubee.Property(cubee.EVAlign.TOP, false, false);
            this._bold = new cubee.BooleanProperty(false, false, false);
            this._italic = new cubee.BooleanProperty(false, false, false);
            this._underline = new cubee.BooleanProperty(false, false, false);
            this._fontSize = new cubee.NumberProperty(12, false, false);
            this._fontFamily = new cubee.Property(cubee.FontFamily.Arial, false, false);
            this._placeholder = new cubee.StringProperty(null, true);
            this.element.setAttribute("type", "select");
            this.border = cubee.Border.create(1, cubee.Color.LIGHT_GRAY, 0);
            this._width.addChangeListener(function () {
                if (_this.width == null) {
                    _this.element.style.removeProperty("width");
                }
                else {
                    _this.element.style.width = _this.width + "px";
                }
                _this.requestLayout();
            });
            this._height.addChangeListener(function () {
                if (_this.height == null) {
                    _this.element.style.removeProperty("height");
                }
                else {
                    _this.element.style.height = _this.height + "px";
                }
                _this.requestLayout();
            });
            this._text.addChangeListener(function () {
                if (_this.text != _this.element.getAttribute("value")) {
                    _this.element.setAttribute("value", _this.text);
                }
            });
            this._foreColor.addChangeListener(function () {
                if (_this.foreColor == null) {
                    _this.element.style.color = "rgba(0,0,0, 0.0)";
                }
                else {
                    _this.element.style.color = _this.foreColor.toCSS();
                }
            });
            this._foreColor.invalidate();
            this._textAlign.addChangeListener(function () {
                _this.textAlign.apply(_this.element);
            });
            this._textAlign.invalidate();
            this._verticalAlign.addChangeListener(function () {
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
            this._verticalAlign.invalidate();
            this._underline.addChangeListener(function () {
                if (_this.underline) {
                    _this.element.style.textDecoration = "underline";
                }
                else {
                    _this.element.style.textDecoration = "none";
                }
                _this.requestLayout();
            });
            this._underline.invalidate();
            this._bold.addChangeListener(function () {
                if (_this.bold) {
                    _this.element.style.fontWeight = "bold";
                }
                else {
                    _this.element.style.fontWeight = "normal";
                }
                _this.requestLayout();
            });
            this._bold.invalidate();
            this._italic.addChangeListener(function () {
                if (_this.italic) {
                    _this.element.style.fontStyle = "italic";
                }
                else {
                    _this.element.style.fontStyle = "normal";
                }
                _this.requestLayout();
            });
            this._italic.invalidate();
            this._fontSize.addChangeListener(function () {
                _this.element.style.fontSize = _this.fontSize + "px";
                _this.requestLayout();
            });
            this._fontSize.invalidate();
            this._fontFamily.addChangeListener(function () {
                _this.fontFamily.apply(_this.element);
                _this.requestLayout();
            });
            this._fontFamily.invalidate();
            this._background.addChangeListener(function () {
                if (_this.background == null) {
                    _this.element.style.removeProperty("backgroundColor");
                    _this.element.style.removeProperty("backgroundImage");
                }
                else {
                    _this.background.apply(_this.element);
                }
            });
            this._background.invalidate();
            this._placeholder.addChangeListener(function () {
                if (_this.placeholder == null) {
                    _this.element.removeAttribute("placeholder");
                }
                else {
                    _this.element.setAttribute("placeholder", _this.placeholder);
                }
            });
            this.element.addEventListener("change", function () {
                var val = _this.element.value;
                if (val == null || val == "") {
                    _this._selectedIndex.value = -1;
                    _this._selectedItem.value = null;
                }
                else {
                    _this._selectedIndex.value = parseInt(val);
                }
            });
            this._selectedIndex.addChangeListener(function () {
            });
            this._selectedItem.addChangeListener(function () {
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
    })(cubee.AComponent);
    cubee.ComboBox = ComboBox;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var PictureBox = (function (_super) {
        __extends(PictureBox, _super);
        function PictureBox() {
            var _this = this;
            _super.call(this, document.createElement("div"));
            this._width = new cubee.NumberProperty(50, false, false);
            this._height = new cubee.NumberProperty(50, false, false);
            this._pictureSizeMode = new cubee.Property(cubee.EPictureSizeMode.NORMAL, false, false);
            this._image = new cubee.Property(null, true, false);
            this._background = new cubee.BackgroundProperty(null, true, false);
            this._imgElement = null;
            this.element.style.overflow = "hidden";
            this._imgElement = document.createElement("img");
            this._imgElement.style.position = "absolute";
            this.element.appendChild(this._imgElement);
            this._width.addChangeListener(function () {
                _this.recalculateSize();
            });
            this._width.invalidate();
            this._height.addChangeListener(function () {
                _this.recalculateSize();
            });
            this._height.invalidate();
            this._pictureSizeMode.addChangeListener(function () {
                _this.recalculateSize();
            });
            this._pictureSizeMode.invalidate();
            this._image.addChangeListener(function () {
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
            this._image.invalidate();
            this._background.addChangeListener(function () {
                if (_this.background == null) {
                    _this.element.style.removeProperty("backgroundColor");
                    _this.element.style.removeProperty("backgroundImage");
                }
                else {
                    _this.background.apply(_this.element);
                }
            });
            this._background.invalidate();
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
    })(cubee.AComponent);
    cubee.PictureBox = PictureBox;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var APopup = (function () {
        function APopup(modal, autoClose, glassColor) {
            var _this = this;
            if (modal === void 0) { modal = true; }
            if (autoClose === void 0) { autoClose = true; }
            if (glassColor === void 0) { glassColor = cubee.Color.getArgbColor(0x00000000); }
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
    })();
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
        Popups._popups = [];
        Popups._layoutRunOnce = new cubee.RunOnce(function () {
            Popups.layout();
        });
        return Popups;
    })();
    cubee.Popups = Popups;
})(cubee || (cubee = {}));
/// <reference path="utils.ts"/>
/// <reference path="events.ts"/>
/// <reference path="properties.ts"/>
/// <reference path="styles.ts"/>
/// <reference path="component_base/LayoutChildren.ts"/> 
/// <reference path="component_base/AComponent.ts"/> 
/// <reference path="component_base/ALayout.ts"/> 
/// <reference path="component_base/AUserControl.ts"/> 
/// <reference path="component_base/AView.ts"/> 
/// <reference path="layouts/Panel.ts"/>  
/// <reference path="layouts/HBox.ts"/>   
/// <reference path="layouts/VBox.ts"/>    
/// <reference path="layouts/ScrollBox.ts"/>    
/// <reference path="components/Label.ts"/>  
/// <reference path="components/Button.ts"/>    
/// <reference path="components/TextBox.ts"/>    
/// <reference path="components/PasswordBox.ts"/>     
/// <reference path="components/TextArea.ts"/>    
/// <reference path="components/CheckBox.ts"/>     
/// <reference path="components/ComboBox.ts"/>     
/// <reference path="components/PictureBox.ts"/>     
/// <reference path="popups.ts"/>  
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
    })();
    cubee.CubeePanel = CubeePanel;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var EIcon = (function () {
        function EIcon(_value) {
            this._value = _value;
        }
        Object.defineProperty(EIcon, "ADJUST", {
            get: function () { return EIcon._ADJUST; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EIcon, "ANCHOR", {
            get: function () { return EIcon._ANCHOR; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EIcon, "ARCHIVE", {
            get: function () { return EIcon._ARCHIVE; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EIcon, "ARROWS", {
            get: function () { return EIcon._ARROWS; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EIcon, "ARROWS_H", {
            get: function () { return EIcon._ARROWS_H; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EIcon, "ARROWS_V", {
            get: function () { return EIcon._ARROWS_V; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EIcon, "ASTERISK", {
            get: function () { return EIcon._ASTERISK; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EIcon, "BAN", {
            get: function () { return EIcon._BAN; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EIcon, "BAR_CHART_O", {
            get: function () { return EIcon._BAR_CHART_O; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EIcon, "BARCODE", {
            get: function () { return EIcon._BARCODE; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EIcon, "BARS", {
            get: function () { return EIcon._BARS; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EIcon, "BEER", {
            get: function () { return EIcon._BEER; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EIcon, "BELL", {
            get: function () { return EIcon._BELL; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EIcon, "BELL_O", {
            get: function () { return EIcon._BELL_O; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EIcon, "BOLT", {
            get: function () { return EIcon._BOLT; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EIcon, "BOOK", {
            get: function () { return EIcon._BOOK; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EIcon, "BOOKMARK", {
            get: function () { return EIcon._BOOKMARK; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EIcon, "BOOKMARK_O", {
            get: function () { return EIcon._BOOKMARK_O; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EIcon, "BRIEFCASE", {
            get: function () { return EIcon._BRIEFCASE; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EIcon, "BUG", {
            get: function () { return EIcon._BUG; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EIcon.prototype, "className", {
            get: function () {
                return this._value;
            },
            enumerable: true,
            configurable: true
        });
        EIcon._ADJUST = new EIcon("fa-adjust");
        EIcon._ANCHOR = new EIcon("fa-anchor");
        EIcon._ARCHIVE = new EIcon("fa-archive");
        EIcon._ARROWS = new EIcon("fa-arrows");
        EIcon._ARROWS_H = new EIcon("fa-arrows-h");
        EIcon._ARROWS_V = new EIcon("fa-arrows-v");
        EIcon._ASTERISK = new EIcon("fa-asterisk");
        EIcon._BAN = new EIcon("fa-ban");
        EIcon._BAR_CHART_O = new EIcon("fa-bar-chart-o");
        EIcon._BARCODE = new EIcon("fa-barcode");
        EIcon._BARS = new EIcon("fa-bars");
        EIcon._BEER = new EIcon("fa-beer");
        EIcon._BELL = new EIcon("fa-bell");
        EIcon._BELL_O = new EIcon("fa-bell-o");
        EIcon._BOLT = new EIcon("fa-bolt");
        EIcon._BOOK = new EIcon("fa-book");
        EIcon._BOOKMARK = new EIcon("fa-bookmark");
        EIcon._BOOKMARK_O = new EIcon("fa-bookmark-o");
        EIcon._BRIEFCASE = new EIcon("fa-briefcase");
        EIcon._BUG = new EIcon("fa-bug");
        EIcon._BUILDING_O = new EIcon("fa-building-o");
        EIcon._BULLHORN = new EIcon("fa-bullhorn");
        EIcon._BULLSEYE = new EIcon("fa-bullseye");
        EIcon._CALENDAR = new EIcon("fa-calendar");
        EIcon._CALENDAR_O = new EIcon("fa-calendar-o");
        EIcon._CAMERA = new EIcon("fa-camera");
        EIcon._CAMERA_RETRO = new EIcon("fa-camera-retro");
        EIcon._CARET_SQUARE_O_DOWN = new EIcon("fa-caret-square-o-down");
        EIcon._CARET_SQUARE_O_RIGHT = new EIcon("fa-caret-square-o-right");
        EIcon._CARET_SQUARE_O_UP = new EIcon("fa-caret-square-o-up");
        EIcon._CERTIFICATE = new EIcon("fa-certificate");
        EIcon._CHECK = new EIcon("fa-check");
        EIcon._CHECK_CIRCLE = new EIcon("fa-check-circle");
        EIcon._CHECK_CIRCLE_O = new EIcon("fa-check-circle-o");
        EIcon._CHECK_SQUARE = new EIcon("fa-check-square");
        EIcon._CHECK_SQUARE_O = new EIcon("fa-check-square-o");
        EIcon._CIRCLE = new EIcon("fa-circle");
        EIcon._CIRCLE_O = new EIcon("fa-circle-o");
        EIcon._CLOCK_O = new EIcon("fa-clock-o");
        EIcon._CLOUD = new EIcon("fa-cloud");
        EIcon._CLOUD_DOWNLOAD = new EIcon("fa-cloud-download");
        EIcon._CLOUD_UPLOAD = new EIcon("fa-cloud-upload");
        EIcon._CODE = new EIcon("fa-code");
        EIcon._CODE_FORK = new EIcon("fa-code-fork");
        EIcon._COFFEE = new EIcon("fa-coffee");
        EIcon._COG = new EIcon("fa-cog");
        EIcon._COGS = new EIcon("fa-cogs");
        EIcon._COMMENT = new EIcon("fa-comment");
        EIcon._COMMENT_O = new EIcon("fa-comment-o");
        EIcon._COMMENTS = new EIcon("fa-comments");
        EIcon._COMMENTS_O = new EIcon("fa-comments-o");
        EIcon._COMPASS = new EIcon("fa-compass");
        EIcon._CREDIT_CARD = new EIcon("fa-credit-card");
        EIcon._CROP = new EIcon("fa-crop");
        EIcon._CROSSHAIRS = new EIcon("fa-crosshairs");
        EIcon._CUTLERY = new EIcon("fa-cutlery");
        EIcon._DASHBOARD = new EIcon("fa-dashboard");
        EIcon._DESKTOP = new EIcon("fa-desktop");
        EIcon._DOWNLOAD = new EIcon("fa-download");
        EIcon._EDIT = new EIcon("fa-edit");
        EIcon._ELLIPSIS_H = new EIcon("fa-ellipsis-h");
        EIcon._ELLIPSIS_V = new EIcon("fa-ellipsis-v");
        EIcon._ENVELOPE = new EIcon("fa-envelope");
        EIcon._ENVELOPE_O = new EIcon("fa-envelope-o");
        EIcon._ERASER = new EIcon("fa-eraser");
        EIcon._EXCHANGE = new EIcon("fa-exchange");
        EIcon._EXCLAMATION = new EIcon("fa-exclamation");
        EIcon._EXCLAMATION_CIRCLE = new EIcon("fa-exclamation-circle");
        EIcon._EXCLAMATION_TRIANGLE = new EIcon("fa-exclamation-triangle");
        EIcon._EXTERNAL_LINK = new EIcon("fa-external-link");
        EIcon._EXTERNAL_LINK_SQUARE = new EIcon("fa-external-link-square");
        EIcon._EYE = new EIcon("fa-eye");
        EIcon._EYE_SLASH = new EIcon("fa-eye-slash");
        EIcon._FEMALE = new EIcon("fa-female");
        EIcon._FIGHTER_JET = new EIcon("fa-fighter-jet");
        EIcon._FILM = new EIcon("fa-film");
        EIcon._FILTER = new EIcon("fa-filter");
        EIcon._FIRE = new EIcon("fa-fire");
        EIcon._FIRE_EXTINGUISHER = new EIcon("fa-fire-extinguisher");
        EIcon._FLAG = new EIcon("fa-flag");
        EIcon._FLAG_CHECKERED = new EIcon("fa-flag-checkered");
        EIcon._FLAG_O = new EIcon("fa-flag-o");
        EIcon._FLASH = new EIcon("fa-flash");
        EIcon._FLASK = new EIcon("fa-flask");
        EIcon._FOLDER = new EIcon("fa-folder");
        EIcon._FOLDER_O = new EIcon("fa-folder-o");
        EIcon._FOLDER_OPEN = new EIcon("fa-folder-open");
        EIcon._FOLDER_OPEN_O = new EIcon("fa-folder-open-o");
        EIcon._FROWN_O = new EIcon("fa-frown-o");
        EIcon._GAMEPAD = new EIcon("fa-gamepad");
        EIcon._GAVEL = new EIcon("fa-gavel");
        EIcon._GEAR = new EIcon("fa-gear");
        EIcon._GEARS = new EIcon("fa-gears");
        EIcon._GIFT = new EIcon("fa-gift");
        EIcon._GLASS = new EIcon("fa-glass");
        EIcon._GLOBE = new EIcon("fa-globe");
        EIcon._GROUP = new EIcon("fa-group");
        EIcon._HDD_O = new EIcon("fa-hdd-o");
        EIcon._HEADPHONES = new EIcon("fa-headphones");
        EIcon._HEART = new EIcon("fa-heart");
        EIcon._HEART_O = new EIcon("fa-heart-o");
        EIcon._HOME = new EIcon("fa-home");
        EIcon._INBOX = new EIcon("fa-inbox");
        EIcon._INFO = new EIcon("fa-info");
        EIcon._INFO_CIRCLE = new EIcon("fa-info-circle");
        EIcon._KEY = new EIcon("fa-key");
        EIcon._KEYBOARD_O = new EIcon("fa-keyboard-o");
        EIcon._LAPTOP = new EIcon("fa-laptop");
        EIcon._LEAF = new EIcon("fa-leaf");
        EIcon._LEGAL = new EIcon("fa-legal");
        EIcon._LEMON_O = new EIcon("fa-lemon-o");
        EIcon._LEVEL_DOWN = new EIcon("fa-level-down");
        EIcon._LEVEL_UP = new EIcon("fa-level-up");
        EIcon._LIGHTBULB_O = new EIcon("fa-lightbulb-o");
        EIcon._LOCATION_ARROW = new EIcon("fa-location-arrow");
        EIcon._LOCK = new EIcon("fa-lock");
        EIcon._MAGIC = new EIcon("fa-magic");
        EIcon._MAGNET = new EIcon("fa-magnet");
        EIcon._MAIL_FORWARD = new EIcon("fa-mail-forward");
        EIcon._MAIL_REPLY = new EIcon("fa-mail-reply");
        EIcon._MAIL_REPLY_ALL = new EIcon("fa-mail-reply-all");
        EIcon._MALE = new EIcon("fa-male");
        EIcon._MAP_MARKER = new EIcon("fa-map-marker");
        EIcon._MEH_O = new EIcon("fa-meh-o");
        EIcon._MICROPHONE = new EIcon("fa-microphone");
        EIcon._MICROPHONE_SLASH = new EIcon("fa-microphone-slash");
        EIcon._MINUS = new EIcon("fa-minus");
        EIcon._MINUS_CIRCLE = new EIcon("fa-minus-circle");
        EIcon._MINUS_SQUARE = new EIcon("fa-minus-square");
        EIcon._MINUS_SQUARE_O = new EIcon("fa-minus-square-o");
        EIcon._MOBILE = new EIcon("fa-mobile");
        EIcon._MOBILE_PHONE = new EIcon("fa-mobile-phone");
        EIcon._MONEY = new EIcon("fa-money");
        EIcon._MOON_O = new EIcon("fa-moon-o");
        EIcon._MUSIC = new EIcon("fa-music");
        EIcon._PENCIL = new EIcon("fa-pencil");
        EIcon._PENCIL_SQUARE = new EIcon("fa-pencil-square");
        EIcon._PENCIL_SQUARE_O = new EIcon("fa-pencil-square-o");
        EIcon._PHONE = new EIcon("fa-phone");
        EIcon._PHONE_SQUARE = new EIcon("fa-phone-square");
        EIcon._PICTURE_O = new EIcon("fa-picture-o");
        EIcon._PLANE = new EIcon("fa-plane");
        EIcon._PLUS = new EIcon("fa-plus");
        EIcon._PLUS_CIRCLE = new EIcon("fa-plus-circle");
        EIcon._PLUS_SQUARE = new EIcon("fa-plus-square");
        EIcon._PLUS_SQUARE_O = new EIcon("fa-plus-square-o");
        EIcon._POWER_OFF = new EIcon("fa-power-off");
        EIcon._PRINT = new EIcon("fa-print");
        EIcon._PUZZLE_PIECE = new EIcon("fa-puzzle-piece");
        EIcon._QRCODE = new EIcon("fa-qrcode");
        EIcon._QUESTION = new EIcon("fa-question");
        EIcon._QUESTION_CIRCLE = new EIcon("fa-question-circle");
        EIcon._QUOTE_LEFT = new EIcon("fa-quote-left");
        EIcon._QUOTE_RIGHT = new EIcon("fa-quote-right");
        EIcon._RANDOM = new EIcon("fa-random");
        EIcon._REFRESH = new EIcon("fa-refresh");
        EIcon._REPLY = new EIcon("fa-reply");
        EIcon._REPLY_ALL = new EIcon("fa-reply-all");
        EIcon._RETWEET = new EIcon("fa-retweet");
        EIcon._ROAD = new EIcon("fa-road");
        EIcon._ROCKET = new EIcon("fa-rocket");
        EIcon._RSS = new EIcon("fa-rss");
        EIcon._RSS_SQUARE = new EIcon("fa-rss-square");
        EIcon._SEARCH = new EIcon("fa-search");
        EIcon._SEARCH_MINUS = new EIcon("fa-search-minus");
        EIcon._SEARCH_PLUS = new EIcon("fa-search-plus");
        EIcon._SHARE = new EIcon("fa-share");
        EIcon._SHARE_SQUARE = new EIcon("fa-share-square");
        EIcon._SHARE_SQUARE_O = new EIcon("fa-share-square-o");
        EIcon._SHIELD = new EIcon("fa-shield");
        EIcon._SHOPPING_CART = new EIcon("fa-shopping-cart");
        EIcon._SIGN_IN = new EIcon("fa-sign-in");
        EIcon._SIGN_OUT = new EIcon("fa-sign-out");
        EIcon._SIGNAL = new EIcon("fa-signal");
        EIcon._SITEMAP = new EIcon("fa-sitemap");
        EIcon._SMILE_O = new EIcon("fa-smile-o");
        EIcon._SORT = new EIcon("fa-sort");
        EIcon._SORT_ALPHA_ASC = new EIcon("fa-sort-alpha-asc");
        EIcon._SORT_ALPHA_DESC = new EIcon("fa-sort-alpha-desc");
        EIcon._SORT_AMOUNT_ASC = new EIcon("fa-sort-amount-asc");
        EIcon._SORT_AMOUNT_DESC = new EIcon("fa-sort-amount-desc");
        EIcon._SORT_ASC = new EIcon("fa-sort-asc");
        EIcon._SORT_DESC = new EIcon("fa-sort-desc");
        EIcon._SORT_DOWN = new EIcon("fa-sort-down");
        EIcon._SORT_NUMERIC_ASC = new EIcon("fa-sort-numeric-asc");
        EIcon._SORT_NUMERIC_DESC = new EIcon("fa-sort-numeric-desc");
        EIcon._SORT_UP = new EIcon("fa-sort-up");
        EIcon._SPINNER = new EIcon("fa-spinner");
        EIcon._SQUARE = new EIcon("fa-square");
        EIcon._SQUARE_O = new EIcon("fa-square-o");
        EIcon._STAR = new EIcon("fa-star");
        EIcon._STAR_HALF = new EIcon("fa-star-half");
        EIcon._STAR_HALF_EMPTY = new EIcon("fa-star-half-empty");
        EIcon._STAR_HALF_FULL = new EIcon("fa-star-half-full");
        EIcon._STAR_HALF_O = new EIcon("fa-star-half-o");
        EIcon._STAR_O = new EIcon("fa-star-o");
        EIcon._SUBSCRIPT = new EIcon("fa-subscript");
        EIcon._SUITCASE = new EIcon("fa-suitcase");
        EIcon._SUN_O = new EIcon("fa-sun-o");
        EIcon._SUPERSCRIPT = new EIcon("fa-superscript");
        EIcon._TABLET = new EIcon("fa-tablet");
        EIcon._TACHOMETER = new EIcon("fa-tachometer");
        EIcon._TAG = new EIcon("fa-tag");
        EIcon._TAGS = new EIcon("fa-tags");
        EIcon._TASKS = new EIcon("fa-tasks");
        EIcon._TERMINAL = new EIcon("fa-terminal");
        EIcon._THUMB_TACK = new EIcon("fa-thumb-tack");
        EIcon._THUMBS_DOWN = new EIcon("fa-thumbs-down");
        EIcon._THUMBS_O_DOWN = new EIcon("fa-thumbs-o-down");
        EIcon._THUMBS_O_UP = new EIcon("fa-thumbs-o-up");
        EIcon._THUMBS_UP = new EIcon("fa-thumbs-up");
        EIcon._TICKET = new EIcon("fa-ticket");
        EIcon._TIMES = new EIcon("fa-times");
        EIcon._TIMES_CIRCLE = new EIcon("fa-times-circle");
        EIcon._TIMES_CIRCLE_O = new EIcon("fa-times-circle-o");
        EIcon._TINT = new EIcon("fa-tint");
        EIcon._TOGGLE_DOWN = new EIcon("fa-toggle-down");
        EIcon._TOGGLE_LEFT = new EIcon("fa-toggle-left");
        EIcon._TOGGLE_RIGHT = new EIcon("fa-toggle-right");
        EIcon._TOGGLE_UP = new EIcon("fa-toggle-up");
        EIcon._TRASH_O = new EIcon("fa-trash-o");
        EIcon._TROPHY = new EIcon("fa-trophy");
        EIcon._TRUCK = new EIcon("fa-truck");
        EIcon._UMBRELLA = new EIcon("fa-umbrella");
        EIcon._UNLOCK = new EIcon("fa-unlock");
        EIcon._UNLOCK_ALT = new EIcon("fa-unlock-alt");
        EIcon._UNSORTED = new EIcon("fa-unsorted");
        EIcon._UPLOAD = new EIcon("fa-upload");
        EIcon._USER = new EIcon("fa-user");
        EIcon._USERS = new EIcon("fa-users");
        EIcon._VIDEO_CAMERA = new EIcon("fa-video-camera");
        EIcon._VOLUME_DOWN = new EIcon("fa-volume-down");
        EIcon._VOLUME_OFF = new EIcon("fa-volume-off");
        EIcon._VOLUME_UP = new EIcon("fa-volume-up");
        EIcon._WARNING = new EIcon("fa-warning");
        EIcon._WHEELCHAIR = new EIcon("fa-wheelchair");
        EIcon._WRENCH = new EIcon("fa-wrench");
        EIcon._DOT_CIRCLE_O = new EIcon("fa-dot-circle-o");
        EIcon._BITCOIN = new EIcon("fa-bitcoin");
        EIcon._BTC = new EIcon("fa-btc");
        EIcon._CNY = new EIcon("fa-cny");
        EIcon._DOLLAR = new EIcon("fa-dollar");
        EIcon._EUR = new EIcon("fa-eur");
        EIcon._EURO = new EIcon("fa-euro");
        EIcon._GBP = new EIcon("fa-gbp");
        EIcon._INR = new EIcon("fa-inr");
        EIcon._JPY = new EIcon("fa-jpy");
        EIcon._KRW = new EIcon("fa-krw");
        EIcon._RMB = new EIcon("fa-rmb");
        EIcon._ROUBLE = new EIcon("fa-rouble");
        EIcon._RUB = new EIcon("fa-rub");
        EIcon._RUBLE = new EIcon("fa-ruble");
        EIcon._RUPEE = new EIcon("fa-rupee");
        EIcon._TRY = new EIcon("fa-try");
        EIcon._TURKISH_LIRA = new EIcon("fa-turkish-lira");
        EIcon._USD = new EIcon("fa-usd");
        EIcon._WON = new EIcon("fa-won");
        EIcon._YEN = new EIcon("fa-yen");
        EIcon._ALIGN_CENTER = new EIcon("fa-align-center");
        EIcon._ALIGN_JUSTIFY = new EIcon("fa-align-justify");
        EIcon._ALIGN_LEFT = new EIcon("fa-align-left");
        EIcon._ALIGN_RIGHT = new EIcon("fa-align-right");
        EIcon._BOLD = new EIcon("fa-bold");
        EIcon._CHAIN = new EIcon("fa-chain");
        EIcon._CHAIN_BROKEN = new EIcon("fa-chain-broken");
        EIcon._CLIPBOARD = new EIcon("fa-clipboard");
        EIcon._COLUMNS = new EIcon("fa-columns");
        EIcon._COPY = new EIcon("fa-copy");
        EIcon._CUT = new EIcon("fa-cut");
        EIcon._DEDENT = new EIcon("fa-dedent");
        EIcon._FILE = new EIcon("fa-file");
        EIcon._FILE_O = new EIcon("fa-file-o");
        EIcon._FILE_TEXT = new EIcon("fa-file-text");
        EIcon._FILE_TEXT_O = new EIcon("fa-file-text-o");
        EIcon._FILES_O = new EIcon("fa-files-o");
        EIcon._FLOPPY_O = new EIcon("fa-floppy-o");
        EIcon._FONT = new EIcon("fa-font");
        EIcon._INDENT = new EIcon("fa-indent");
        EIcon._ITALIC = new EIcon("fa-italic");
        EIcon._LINK = new EIcon("fa-link");
        EIcon._LIST = new EIcon("fa-list");
        EIcon._LIST_ALT = new EIcon("fa-list-alt");
        EIcon._LIST_OL = new EIcon("fa-list-ol");
        EIcon._LIST_UL = new EIcon("fa-list-ul");
        EIcon._OUTDENT = new EIcon("fa-outdent");
        EIcon._PAPERCLIP = new EIcon("fa-paperclip");
        EIcon._PASTE = new EIcon("fa-paste");
        EIcon._REPEAT = new EIcon("fa-repeat");
        EIcon._ROTATE_LEFT = new EIcon("fa-rotate-left");
        EIcon._ROTATE_RIGHT = new EIcon("fa-rotate-right");
        EIcon._SAVE = new EIcon("fa-save");
        EIcon._SCISSORS = new EIcon("fa-scissors");
        EIcon._STRIKETHROUGH = new EIcon("fa-strikethrough");
        EIcon._TABLE = new EIcon("fa-table");
        EIcon._TEXT_HEIGHT = new EIcon("fa-text-height");
        EIcon._TEXT_WIDTH = new EIcon("fa-text-width");
        EIcon._TH = new EIcon("fa-th");
        EIcon._TH_LARGE = new EIcon("fa-th-large");
        EIcon._TH_LIST = new EIcon("fa-th-list");
        EIcon._UNDERLINE = new EIcon("fa-underline");
        EIcon._UNDO = new EIcon("fa-undo");
        EIcon._UNLINK = new EIcon("fa-unlink");
        EIcon._ANGLE_DOUBLE_DOWN = new EIcon("fa-angle-double-down");
        EIcon._ANGLE_DOUBLE_LEFT = new EIcon("fa-angle-double-left");
        EIcon._ANGLE_DOUBLE_RIGHT = new EIcon("fa-angle-double-right");
        EIcon._ANGLE_DOUBLE_UP = new EIcon("fa-angle-double-up");
        EIcon._ANGLE_DOWN = new EIcon("fa-angle-down");
        EIcon._ANGLE_LEFT = new EIcon("fa-angle-left");
        EIcon._ANGLE_RIGHT = new EIcon("fa-angle-right");
        EIcon._ANGLE_UP = new EIcon("fa-angle-up");
        EIcon._ARROW_CIRCLE_DOWN = new EIcon("fa-arrow-circle-down");
        EIcon._ARROW_CIRCLE_LEFT = new EIcon("fa-arrow-circle-left");
        EIcon._ARROW_CIRCLE_O_DOWN = new EIcon("fa-arrow-circle-o-down");
        EIcon._ARROW_CIRCLE_O_LEFT = new EIcon("fa-arrow-circle-o-left");
        EIcon._ARROW_CIRCLE_O_RIGHT = new EIcon("fa-arrow-circle-o-right");
        EIcon._ARROW_CIRCLE_O_UP = new EIcon("fa-arrow-circle-o-up");
        EIcon._ARROW_CIRCLE_RIGHT = new EIcon("fa-arrow-circle-right");
        EIcon._ARROW_CIRCLE_UP = new EIcon("fa-arrow-circle-up");
        EIcon._ARROW_DOWN = new EIcon("fa-arrow-down");
        EIcon._ARROW_LEFT = new EIcon("fa-arrow-left");
        EIcon._ARROW_RIGHT = new EIcon("fa-arrow-right");
        EIcon._ARROW_UP = new EIcon("fa-arrow-up");
        EIcon._ARROWS_ALT = new EIcon("fa-arrows-alt");
        EIcon._CARET_DOWN = new EIcon("fa-caret-down");
        EIcon._CARET_LEFT = new EIcon("fa-caret-left");
        EIcon._CARET_RIGHT = new EIcon("fa-caret-right");
        EIcon._CARET_SQUARE_O_LEFT = new EIcon("fa-caret-square-o-left");
        EIcon._CARET_UP = new EIcon("fa-caret-up");
        EIcon._CHEVRON_CIRCLE_DOWN = new EIcon("fa-chevron-circle-down");
        EIcon._CHEVRON_CIRCLE_LEFT = new EIcon("fa-chevron-circle-left");
        EIcon._CHEVRON_CIRCLE_RIGHT = new EIcon("fa-chevron-circle-right");
        EIcon._CHEVRON_CIRCLE_UP = new EIcon("fa-chevron-circle-up");
        EIcon._CHEVRON_DOWN = new EIcon("fa-chevron-down");
        EIcon._CHEVRON_LEFT = new EIcon("fa-chevron-left");
        EIcon._CHEVRON_RIGHT = new EIcon("fa-chevron-right");
        EIcon._CHEVRON_UP = new EIcon("fa-chevron-up");
        EIcon._HAND_O_DOWN = new EIcon("fa-hand-o-down");
        EIcon._HAND_O_LEFT = new EIcon("fa-hand-o-left");
        EIcon._HAND_O_RIGHT = new EIcon("fa-hand-o-right");
        EIcon._HAND_O_UP = new EIcon("fa-hand-o-up");
        EIcon._LONG_ARROW_DOWN = new EIcon("fa-long-arrow-down");
        EIcon._LONG_ARROW_LEFT = new EIcon("fa-long-arrow-left");
        EIcon._LONG_ARROW_RIGHT = new EIcon("fa-long-arrow-right");
        EIcon._LONG_ARROW_UP = new EIcon("fa-long-arrow-up");
        EIcon._BACKWARD = new EIcon("fa-backward");
        EIcon._COMPRESS = new EIcon("fa-compress");
        EIcon._EJECT = new EIcon("fa-eject");
        EIcon._EXPAND = new EIcon("fa-expand");
        EIcon._FAST_BACKWARD = new EIcon("fa-fast-backward");
        EIcon._FAST_FORWARD = new EIcon("fa-fast-forward");
        EIcon._FORWARD = new EIcon("fa-forward");
        EIcon._PAUSE = new EIcon("fa-pause");
        EIcon._PLAY = new EIcon("fa-play");
        EIcon._PLAY_CIRCLE = new EIcon("fa-play-circle");
        EIcon._PLAY_CIRCLE_O = new EIcon("fa-play-circle-o");
        EIcon._STEP_BACKWARD = new EIcon("fa-step-backward");
        EIcon._STEP_FORWARD = new EIcon("fa-step-forward");
        EIcon._STOP = new EIcon("fa-stop");
        EIcon._YOUTUBE_PLAY = new EIcon("fa-youtube-play");
        EIcon._ADN = new EIcon("fa-adn");
        EIcon._ANDROID = new EIcon("fa-android");
        EIcon._APPLE = new EIcon("fa-apple");
        EIcon._BITBUCKET = new EIcon("fa-bitbucket");
        EIcon._BITBUCKET_SQUARE = new EIcon("fa-bitbucket-square");
        EIcon._CSS3 = new EIcon("fa-css3");
        EIcon._DRIBBBLE = new EIcon("fa-dribbble");
        EIcon._DROPBOX = new EIcon("fa-dropbox");
        EIcon._FACEBOOK = new EIcon("fa-facebook");
        EIcon._FACEBOOK_SQUARE = new EIcon("fa-facebook-square");
        EIcon._FLICKR = new EIcon("fa-flickr");
        EIcon._FOURSQUARE = new EIcon("fa-foursquare");
        EIcon._GITHUB = new EIcon("fa-github");
        EIcon._GITHUB_ALT = new EIcon("fa-github-alt");
        EIcon._GITHUB_SQUARE = new EIcon("fa-github-square");
        EIcon._GITTIP = new EIcon("fa-gittip");
        EIcon._GOOGLE_PLUS = new EIcon("fa-google-plus");
        EIcon._GOOGLE_PLUS_SQUARE = new EIcon("fa-google-plus-square");
        EIcon._HTML5 = new EIcon("fa-html5");
        EIcon._INSTAGRAM = new EIcon("fa-instagram");
        EIcon._LINKEDIN = new EIcon("fa-linkedin");
        EIcon._LINKEDIN_SQUARE = new EIcon("fa-linkedin-square");
        EIcon._LINUX = new EIcon("fa-linux");
        EIcon._MAXCDN = new EIcon("fa-maxcdn");
        EIcon._PAGELINES = new EIcon("fa-pagelines");
        EIcon._PINTEREST = new EIcon("fa-pinterest");
        EIcon._PINTEREST_SQUARE = new EIcon("fa-pinterest-square");
        EIcon._RENREN = new EIcon("fa-renren");
        EIcon._SKYPE = new EIcon("fa-skype");
        EIcon._STACK_EXCHANGE = new EIcon("fa-stack-exchange");
        EIcon._STACK_OVERFLOW = new EIcon("fa-stack-overflow");
        EIcon._TRELLO = new EIcon("fa-trello");
        EIcon._TUMBLR = new EIcon("fa-tumblr");
        EIcon._TUMBLR_SQUARE = new EIcon("fa-tumblr-square");
        EIcon._TWITTER = new EIcon("fa-twitter");
        EIcon._TWITTER_SQUARE = new EIcon("fa-twitter-square");
        EIcon._VIMEO_SQUARE = new EIcon("fa-vimeo-square");
        EIcon._VK = new EIcon("fa-vk");
        EIcon._WEIBO = new EIcon("fa-weibo");
        EIcon._WINDOWS = new EIcon("fa-windows");
        EIcon._XING = new EIcon("fa-xing");
        EIcon._XING_SQUARE = new EIcon("fa-xing-square");
        EIcon._YOUTUBE = new EIcon("fa-youtube");
        EIcon._YOUTUBE_SQUARE = new EIcon("fa-youtube-square");
        EIcon._AMBULANCE = new EIcon("fa-ambulance");
        EIcon._H_SQUARE = new EIcon("fa-h-square");
        EIcon._HOSPITAL_O = new EIcon("fa-hospital-o");
        EIcon._MEDKIT = new EIcon("fa-medkit");
        EIcon._STETHOSCOPE = new EIcon("fa-stethoscope");
        EIcon._USER_MD = new EIcon("fa-user-md");
        return EIcon;
    })();
    cubee.EIcon = EIcon;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var FAIcon = (function (_super) {
        __extends(FAIcon, _super);
        function FAIcon(icon) {
            var _this = this;
            _super.call(this);
            this._size = new cubee.NumberProperty(16, false, false);
            this._color = new cubee.ColorProperty(cubee.Color.BLACK, false, false);
            this._spin = new cubee.BooleanProperty(false, false, false);
            this._icon = new cubee.Property(cubee.EIcon.BAN, false, false);
            this._iElement = null;
            this._changeListener = function () {
                _this.refreshStyle();
            };
            if (!FAIcon._initialized) {
                FAIcon.initFA();
            }
            if (icon == null) {
                throw "The icon parameter can not be null.";
            }
            _super.prototype.widthProperty.call(this).bind(this._size);
            _super.prototype.heightProperty.call(this).bind(this._size);
            this.element.style.textAlign = "center";
            this._icon.value = icon;
            this._iElement = document.createElement("i");
            this.element.appendChild(this._iElement);
            this._size.addChangeListener(this._changeListener);
            this._color.addChangeListener(this._changeListener);
            this._spin.addChangeListener(this._changeListener);
            this._icon.addChangeListener(this._changeListener);
            this.refreshStyle();
        }
        FAIcon.initFA = function () {
            FAIcon._initialized = true;
            var w = window;
            w.fastyle = document.createElement("link");
            w.faststyle.href = "//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css";
            document.getElementsByTagName("head")[0].appendChild(w.fastyle);
        };
        FAIcon.prototype.refreshStyle = function () {
            this._iElement.className = "fa";
            if (this.icon != null) {
                this._iElement.className = "fa " + this._icon.value.className;
            }
            this._iElement.style.fontSize = this.size + "px";
            this._iElement.style.color = this._color.value.toCSS();
            if (this.spin) {
                this._iElement.className = this._iElement.className + " fa-spin";
            }
            this.element.style.lineHeight = this.size + "px";
            this._iElement.style.backfaceVisibility = "hidden";
        };
        FAIcon.prototype.colorProperty = function () {
            return this._color;
        };
        Object.defineProperty(FAIcon.prototype, "Color", {
            get: function () {
                return this.colorProperty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FAIcon.prototype, "color", {
            get: function () {
                return this.Color.value;
            },
            set: function (value) {
                this.Color.value = value;
            },
            enumerable: true,
            configurable: true
        });
        FAIcon.prototype.sizeProperty = function () {
            return this._size;
        };
        Object.defineProperty(FAIcon.prototype, "Size", {
            get: function () {
                return this.sizeProperty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FAIcon.prototype, "size", {
            get: function () {
                return this.Size.value;
            },
            set: function (value) {
                this.Size.value = value;
            },
            enumerable: true,
            configurable: true
        });
        FAIcon.prototype.spinProperty = function () {
            return this._spin;
        };
        Object.defineProperty(FAIcon.prototype, "Spin", {
            get: function () {
                return this.spinProperty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FAIcon.prototype, "spin", {
            get: function () {
                return this.Spin.value;
            },
            set: function (value) {
                this.Spin.value = value;
            },
            enumerable: true,
            configurable: true
        });
        FAIcon.prototype.iconProperty = function () {
            return this._icon;
        };
        Object.defineProperty(FAIcon.prototype, "Icon", {
            get: function () {
                return this.iconProperty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FAIcon.prototype, "icon", {
            get: function () {
                return this.Icon.value;
            },
            set: function (value) {
                this.Icon.value = value;
            },
            enumerable: true,
            configurable: true
        });
        FAIcon._initialized = false;
        return FAIcon;
    })(cubee.AUserControl);
    cubee.FAIcon = FAIcon;
})(cubee || (cubee = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3ViZWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9ldmVudHMudHMiLCIuLi8uLi9wcm9wZXJ0aWVzLnRzIiwiLi4vLi4vc3R5bGVzLnRzIiwiLi4vLi4vdXRpbHMudHMiLCIuLi8uLi9jb21wb25lbnRfYmFzZS9MYXlvdXRDaGlsZHJlbi50cyIsIi4uLy4uL2NvbXBvbmVudF9iYXNlL0FDb21wb25lbnQudHMiLCIuLi8uLi9jb21wb25lbnRfYmFzZS9BTGF5b3V0LnRzIiwiLi4vLi4vY29tcG9uZW50X2Jhc2UvQVVzZXJDb250cm9sLnRzIiwiLi4vLi4vY29tcG9uZW50X2Jhc2UvQVZpZXcudHMiLCIuLi8uLi9sYXlvdXRzL1BhbmVsLnRzIiwiLi4vLi4vbGF5b3V0cy9IQm94LnRzIiwiLi4vLi4vbGF5b3V0cy9WQm94LnRzIiwiLi4vLi4vbGF5b3V0cy9TY3JvbGxCb3gudHMiLCIuLi8uLi9jb21wb25lbnRzL0xhYmVsLnRzIiwiLi4vLi4vY29tcG9uZW50cy9CdXR0b24udHMiLCIuLi8uLi9jb21wb25lbnRzL1RleHRCb3gudHMiLCIuLi8uLi9jb21wb25lbnRzL1Bhc3N3b3JkQm94LnRzIiwiLi4vLi4vY29tcG9uZW50cy9UZXh0QXJlYS50cyIsIi4uLy4uL2NvbXBvbmVudHMvQ2hlY2tCb3gudHMiLCIuLi8uLi9jb21wb25lbnRzL0NvbWJvQm94LnRzIiwiLi4vLi4vY29tcG9uZW50cy9QaWN0dXJlQm94LnRzIiwiLi4vLi4vcG9wdXBzLnRzIiwiLi4vLi4vY3ViZWUudHMiLCIuLi8uLi9jb21wb25lbnRzL0VJY29uLnRzIiwiLi4vLi4vY29tcG9uZW50cy9GQUljb24udHMiXSwibmFtZXMiOlsiY3ViZWUiLCJjdWJlZS5FdmVudEFyZ3MiLCJjdWJlZS5FdmVudEFyZ3MuY29uc3RydWN0b3IiLCJjdWJlZS5IdG1sRXZlbnRMaXN0ZW5lckNhbGxiYWNrIiwiY3ViZWUuSHRtbEV2ZW50TGlzdGVuZXJDYWxsYmFjay5jb25zdHJ1Y3RvciIsImN1YmVlLkh0bWxFdmVudExpc3RlbmVyQ2FsbGJhY2sub25BZGRlZCIsImN1YmVlLkh0bWxFdmVudExpc3RlbmVyQ2FsbGJhY2sub25SZW1vdmVkIiwiY3ViZWUuRXZlbnQiLCJjdWJlZS5FdmVudC5jb25zdHJ1Y3RvciIsImN1YmVlLkV2ZW50LmFkZExpc3RlbmVyIiwiY3ViZWUuRXZlbnQucmVtb3ZlTGlzdGVuZXIiLCJjdWJlZS5FdmVudC5oYXNMaXN0ZW5lciIsImN1YmVlLkV2ZW50LmZpcmVFdmVudCIsImN1YmVlLkV2ZW50Lmxpc3RlbmVyQ2FsbGJhY2siLCJjdWJlZS5UaW1lciIsImN1YmVlLlRpbWVyLmNvbnN0cnVjdG9yIiwiY3ViZWUuVGltZXIuc3RhcnQiLCJjdWJlZS5UaW1lci5zdG9wIiwiY3ViZWUuVGltZXIuU3RhcnRlZCIsImN1YmVlLkV2ZW50UXVldWUiLCJjdWJlZS5FdmVudFF1ZXVlLmNvbnN0cnVjdG9yIiwiY3ViZWUuRXZlbnRRdWV1ZS5JbnN0YW5jZSIsImN1YmVlLkV2ZW50UXVldWUuaW52b2tlTGF0ZXIiLCJjdWJlZS5FdmVudFF1ZXVlLmludm9rZVByaW9yIiwiY3ViZWUuUnVuT25jZSIsImN1YmVlLlJ1bk9uY2UuY29uc3RydWN0b3IiLCJjdWJlZS5SdW5PbmNlLnJ1biIsImN1YmVlLlBhcmVudENoYW5nZWRFdmVudEFyZ3MiLCJjdWJlZS5QYXJlbnRDaGFuZ2VkRXZlbnRBcmdzLmNvbnN0cnVjdG9yIiwiY3ViZWUuUHJvcGVydHkiLCJjdWJlZS5Qcm9wZXJ0eS5jb25zdHJ1Y3RvciIsImN1YmVlLlByb3BlcnR5LmlkIiwiY3ViZWUuUHJvcGVydHkudmFsaWQiLCJjdWJlZS5Qcm9wZXJ0eS52YWx1ZSIsImN1YmVlLlByb3BlcnR5Lm51bGxhYmxlIiwiY3ViZWUuUHJvcGVydHkucmVhZG9ubHkiLCJjdWJlZS5Qcm9wZXJ0eS5pbml0UmVhZG9ubHlCaW5kIiwiY3ViZWUuUHJvcGVydHkuZ2V0IiwiY3ViZWUuUHJvcGVydHkuc2V0IiwiY3ViZWUuUHJvcGVydHkuaW52YWxpZGF0ZSIsImN1YmVlLlByb3BlcnR5LmludmFsaWRhdGVJZk5lZWRlZCIsImN1YmVlLlByb3BlcnR5LmZpcmVDaGFuZ2VMaXN0ZW5lcnMiLCJjdWJlZS5Qcm9wZXJ0eS5nZXRPYmplY3RWYWx1ZSIsImN1YmVlLlByb3BlcnR5LmFkZENoYW5nZUxpc3RlbmVyIiwiY3ViZWUuUHJvcGVydHkucmVtb3ZlQ2hhbmdlTGlzdGVuZXIiLCJjdWJlZS5Qcm9wZXJ0eS5oYXNDaGFuZ2VMaXN0ZW5lciIsImN1YmVlLlByb3BlcnR5LmFuaW1hdGUiLCJjdWJlZS5Qcm9wZXJ0eS5iaW5kIiwiY3ViZWUuUHJvcGVydHkuYmlkaXJlY3Rpb25hbEJpbmQiLCJjdWJlZS5Qcm9wZXJ0eS51bmJpbmQiLCJjdWJlZS5Qcm9wZXJ0eS51bmJpbmRUYXJnZXRzIiwiY3ViZWUuUHJvcGVydHkuaXNCb3VuZCIsImN1YmVlLlByb3BlcnR5LmlzQmlkaXJlY3Rpb25hbEJvdW5kIiwiY3ViZWUuUHJvcGVydHkuY3JlYXRlUHJvcGVydHlMaW5lIiwiY3ViZWUuUHJvcGVydHkuZGVzdHJveSIsImN1YmVlLkV4cHJlc3Npb24iLCJjdWJlZS5FeHByZXNzaW9uLmNvbnN0cnVjdG9yIiwiY3ViZWUuRXhwcmVzc2lvbi52YWx1ZSIsImN1YmVlLkV4cHJlc3Npb24uYWRkQ2hhbmdlTGlzdGVuZXIiLCJjdWJlZS5FeHByZXNzaW9uLnJlbW92ZUNoYW5nZUxpc3RlbmVyIiwiY3ViZWUuRXhwcmVzc2lvbi5oYXNDaGFuZ2VMaXN0ZW5lciIsImN1YmVlLkV4cHJlc3Npb24uZ2V0T2JqZWN0VmFsdWUiLCJjdWJlZS5FeHByZXNzaW9uLmJpbmQiLCJjdWJlZS5FeHByZXNzaW9uLnVuYmluZEFsbCIsImN1YmVlLkV4cHJlc3Npb24udW5iaW5kIiwiY3ViZWUuRXhwcmVzc2lvbi5pbnZhbGlkYXRlIiwiY3ViZWUuRXhwcmVzc2lvbi5pbnZhbGlkYXRlSWZOZWVkZWQiLCJjdWJlZS5FeHByZXNzaW9uLmZpcmVDaGFuZ2VMaXN0ZW5lcnMiLCJjdWJlZS5LZXlGcmFtZSIsImN1YmVlLktleUZyYW1lLmNvbnN0cnVjdG9yIiwiY3ViZWUuS2V5RnJhbWUudGltZSIsImN1YmVlLktleUZyYW1lLnByb3BlcnR5IiwiY3ViZWUuS2V5RnJhbWUuZW5kVmFsdWUiLCJjdWJlZS5LZXlGcmFtZS5pbnRlcnBvbGF0b3IiLCJjdWJlZS5LZXlGcmFtZS5rZXlGcmFtZVJlYWNoZWRMaXN0ZW5lciIsImN1YmVlLlByb3BlcnR5TGluZSIsImN1YmVlLlByb3BlcnR5TGluZS5jb25zdHJ1Y3RvciIsImN1YmVlLlByb3BlcnR5TGluZS5zdGFydFRpbWUiLCJjdWJlZS5Qcm9wZXJ0eUxpbmUuYW5pbWF0ZSIsImN1YmVlLkludGVycG9sYXRvcnMiLCJjdWJlZS5JbnRlcnBvbGF0b3JzLmNvbnN0cnVjdG9yIiwiY3ViZWUuSW50ZXJwb2xhdG9ycy5MaW5lYXIiLCJjdWJlZS5BQW5pbWF0b3IiLCJjdWJlZS5BQW5pbWF0b3IuY29uc3RydWN0b3IiLCJjdWJlZS5BQW5pbWF0b3IuYW5pbWF0ZSIsImN1YmVlLkFBbmltYXRvci5zdGFydCIsImN1YmVlLkFBbmltYXRvci5zdG9wIiwiY3ViZWUuQUFuaW1hdG9yLlN0YXJ0ZWQiLCJjdWJlZS5BQW5pbWF0b3IuU3RvcHBlZCIsImN1YmVlLlRpbWVsaW5lIiwiY3ViZWUuVGltZWxpbmUuY29uc3RydWN0b3IiLCJjdWJlZS5UaW1lbGluZS5jcmVhdGVQcm9wZXJ0eUxpbmVzIiwiY3ViZWUuVGltZWxpbmUuc3RhcnQiLCJjdWJlZS5UaW1lbGluZS5zdG9wIiwiY3ViZWUuVGltZWxpbmUub25BbmltYXRlIiwiY3ViZWUuVGltZWxpbmUub25GaW5pc2hlZEV2ZW50IiwiY3ViZWUuVGltZWxpbmVGaW5pc2hlZEV2ZW50QXJncyIsImN1YmVlLlRpbWVsaW5lRmluaXNoZWRFdmVudEFyZ3MuY29uc3RydWN0b3IiLCJjdWJlZS5UaW1lbGluZUZpbmlzaGVkRXZlbnRBcmdzLlN0b3BwZWQiLCJjdWJlZS5OdW1iZXJQcm9wZXJ0eSIsImN1YmVlLk51bWJlclByb3BlcnR5LmNvbnN0cnVjdG9yIiwiY3ViZWUuTnVtYmVyUHJvcGVydHkuYW5pbWF0ZSIsImN1YmVlLlN0cmluZ1Byb3BlcnR5IiwiY3ViZWUuU3RyaW5nUHJvcGVydHkuY29uc3RydWN0b3IiLCJjdWJlZS5QYWRkaW5nUHJvcGVydHkiLCJjdWJlZS5QYWRkaW5nUHJvcGVydHkuY29uc3RydWN0b3IiLCJjdWJlZS5Cb3JkZXJQcm9wZXJ0eSIsImN1YmVlLkJvcmRlclByb3BlcnR5LmNvbnN0cnVjdG9yIiwiY3ViZWUuQmFja2dyb3VuZFByb3BlcnR5IiwiY3ViZWUuQmFja2dyb3VuZFByb3BlcnR5LmNvbnN0cnVjdG9yIiwiY3ViZWUuQm9vbGVhblByb3BlcnR5IiwiY3ViZWUuQm9vbGVhblByb3BlcnR5LmNvbnN0cnVjdG9yIiwiY3ViZWUuQ29sb3JQcm9wZXJ0eSIsImN1YmVlLkNvbG9yUHJvcGVydHkuY29uc3RydWN0b3IiLCJjdWJlZS5BQmFja2dyb3VuZCIsImN1YmVlLkFCYWNrZ3JvdW5kLmNvbnN0cnVjdG9yIiwiY3ViZWUuQ29sb3IiLCJjdWJlZS5Db2xvci5jb25zdHJ1Y3RvciIsImN1YmVlLkNvbG9yLlRSQU5TUEFSRU5UIiwiY3ViZWUuQ29sb3IuV0hJVEUiLCJjdWJlZS5Db2xvci5CTEFDSyIsImN1YmVlLkNvbG9yLkxJR0hUX0dSQVkiLCJjdWJlZS5Db2xvci5nZXRBcmdiQ29sb3IiLCJjdWJlZS5Db2xvci5nZXRBcmdiQ29sb3JCeUNvbXBvbmVudHMiLCJjdWJlZS5Db2xvci5nZXRSZ2JDb2xvciIsImN1YmVlLkNvbG9yLmdldFJnYkNvbG9yQnlDb21wb25lbnRzIiwiY3ViZWUuQ29sb3IuZml4Q29tcG9uZW50IiwiY3ViZWUuQ29sb3IuZmFkZUNvbG9ycyIsImN1YmVlLkNvbG9yLm1peENvbXBvbmVudCIsImN1YmVlLkNvbG9yLmFyZ2IiLCJjdWJlZS5Db2xvci5hbHBoYSIsImN1YmVlLkNvbG9yLnJlZCIsImN1YmVlLkNvbG9yLmdyZWVuIiwiY3ViZWUuQ29sb3IuYmx1ZSIsImN1YmVlLkNvbG9yLmZhZGUiLCJjdWJlZS5Db2xvci50b0NTUyIsImN1YmVlLkNvbG9yQmFja2dyb3VuZCIsImN1YmVlLkNvbG9yQmFja2dyb3VuZC5jb25zdHJ1Y3RvciIsImN1YmVlLkNvbG9yQmFja2dyb3VuZC5jb2xvciIsImN1YmVlLkNvbG9yQmFja2dyb3VuZC5hcHBseSIsImN1YmVlLlBhZGRpbmciLCJjdWJlZS5QYWRkaW5nLmNvbnN0cnVjdG9yIiwiY3ViZWUuUGFkZGluZy5jcmVhdGUiLCJjdWJlZS5QYWRkaW5nLmxlZnQiLCJjdWJlZS5QYWRkaW5nLnRvcCIsImN1YmVlLlBhZGRpbmcucmlnaHQiLCJjdWJlZS5QYWRkaW5nLmJvdHRvbSIsImN1YmVlLlBhZGRpbmcuYXBwbHkiLCJjdWJlZS5Cb3JkZXIiLCJjdWJlZS5Cb3JkZXIuY29uc3RydWN0b3IiLCJjdWJlZS5Cb3JkZXIuY3JlYXRlIiwiY3ViZWUuQm9yZGVyLmxlZnRXaWR0aCIsImN1YmVlLkJvcmRlci50b3BXaWR0aCIsImN1YmVlLkJvcmRlci5yaWdodFdpZHRoIiwiY3ViZWUuQm9yZGVyLmJvdHRvbVdpZHRoIiwiY3ViZWUuQm9yZGVyLmxlZnRDb2xvciIsImN1YmVlLkJvcmRlci50b3BDb2xvciIsImN1YmVlLkJvcmRlci5yaWdodENvbG9yIiwiY3ViZWUuQm9yZGVyLmJvdHRvbUNvbG9yIiwiY3ViZWUuQm9yZGVyLnRvcExlZnRSYWRpdXMiLCJjdWJlZS5Cb3JkZXIudG9wUmlnaHRSYWRpdXMiLCJjdWJlZS5Cb3JkZXIuYm90dG9tTGVmdFJhZGl1cyIsImN1YmVlLkJvcmRlci5ib3R0b21SaWdodFJhZGl1cyIsImN1YmVlLkJvcmRlci5hcHBseSIsImN1YmVlLkJveFNoYWRvdyIsImN1YmVlLkJveFNoYWRvdy5jb25zdHJ1Y3RvciIsImN1YmVlLkJveFNoYWRvdy5oUG9zIiwiY3ViZWUuQm94U2hhZG93LnZQb3MiLCJjdWJlZS5Cb3hTaGFkb3cuYmx1ciIsImN1YmVlLkJveFNoYWRvdy5zcHJlYWQiLCJjdWJlZS5Cb3hTaGFkb3cuY29sb3IiLCJjdWJlZS5Cb3hTaGFkb3cuaW5uZXIiLCJjdWJlZS5Cb3hTaGFkb3cuYXBwbHkiLCJjdWJlZS5FVGV4dE92ZXJmbG93IiwiY3ViZWUuRVRleHRPdmVyZmxvdy5jb25zdHJ1Y3RvciIsImN1YmVlLkVUZXh0T3ZlcmZsb3cuQ0xJUCIsImN1YmVlLkVUZXh0T3ZlcmZsb3cuRUxMSVBTSVMiLCJjdWJlZS5FVGV4dE92ZXJmbG93LkNTUyIsImN1YmVlLkVUZXh0T3ZlcmZsb3cuYXBwbHkiLCJjdWJlZS5FVGV4dEFsaWduIiwiY3ViZWUuRVRleHRBbGlnbi5jb25zdHJ1Y3RvciIsImN1YmVlLkVUZXh0QWxpZ24uTEVGVCIsImN1YmVlLkVUZXh0QWxpZ24uQ0VOVEVSIiwiY3ViZWUuRVRleHRBbGlnbi5SSUdIVCIsImN1YmVlLkVUZXh0QWxpZ24uSlVTVElGWSIsImN1YmVlLkVUZXh0QWxpZ24uQ1NTIiwiY3ViZWUuRVRleHRBbGlnbi5hcHBseSIsImN1YmVlLkVIQWxpZ24iLCJjdWJlZS5FSEFsaWduLmNvbnN0cnVjdG9yIiwiY3ViZWUuRUhBbGlnbi5MRUZUIiwiY3ViZWUuRUhBbGlnbi5DRU5URVIiLCJjdWJlZS5FSEFsaWduLlJJR0hUIiwiY3ViZWUuRUhBbGlnbi5DU1MiLCJjdWJlZS5FVkFsaWduIiwiY3ViZWUuRVZBbGlnbi5jb25zdHJ1Y3RvciIsImN1YmVlLkVWQWxpZ24uVE9QIiwiY3ViZWUuRVZBbGlnbi5NSURETEUiLCJjdWJlZS5FVkFsaWduLkJPVFRPTSIsImN1YmVlLkVWQWxpZ24uQ1NTIiwiY3ViZWUuRm9udEZhbWlseSIsImN1YmVlLkZvbnRGYW1pbHkuY29uc3RydWN0b3IiLCJjdWJlZS5Gb250RmFtaWx5LkFyaWFsIiwiY3ViZWUuRm9udEZhbWlseS5pbml0Rm9udENvbnRhaW5lclN0eWxlIiwiY3ViZWUuRm9udEZhbWlseS5yZWdpc3RlckZvbnQiLCJjdWJlZS5Gb250RmFtaWx5LkNTUyIsImN1YmVlLkZvbnRGYW1pbHkuYXBwbHkiLCJjdWJlZS5FQ3Vyc29yIiwiY3ViZWUuRUN1cnNvci5jb25zdHJ1Y3RvciIsImN1YmVlLkVDdXJzb3IuQVVUTyIsImN1YmVlLkVDdXJzb3IuY3NzIiwiY3ViZWUuRVNjcm9sbEJhclBvbGljeSIsImN1YmVlLkVQaWN0dXJlU2l6ZU1vZGUiLCJjdWJlZS5JbWFnZSIsImN1YmVlLkltYWdlLmNvbnN0cnVjdG9yIiwiY3ViZWUuSW1hZ2UudXJsIiwiY3ViZWUuSW1hZ2Uub25Mb2FkIiwiY3ViZWUuSW1hZ2Uud2lkdGgiLCJjdWJlZS5JbWFnZS5oZWlnaHQiLCJjdWJlZS5JbWFnZS5sb2FkZWQiLCJjdWJlZS5JbWFnZS5hcHBseSIsImN1YmVlLlBvaW50MkQiLCJjdWJlZS5Qb2ludDJELmNvbnN0cnVjdG9yIiwiY3ViZWUuUG9pbnQyRC54IiwiY3ViZWUuUG9pbnQyRC55IiwiY3ViZWUuTGF5b3V0Q2hpbGRyZW4iLCJjdWJlZS5MYXlvdXRDaGlsZHJlbi5jb25zdHJ1Y3RvciIsImN1YmVlLkxheW91dENoaWxkcmVuLmFkZCIsImN1YmVlLkxheW91dENoaWxkcmVuLmluc2VydCIsImN1YmVlLkxheW91dENoaWxkcmVuLnJlbW92ZUNvbXBvbmVudCIsImN1YmVlLkxheW91dENoaWxkcmVuLnJlbW92ZUluZGV4IiwiY3ViZWUuTGF5b3V0Q2hpbGRyZW4uY2xlYXIiLCJjdWJlZS5MYXlvdXRDaGlsZHJlbi5nZXQiLCJjdWJlZS5MYXlvdXRDaGlsZHJlbi5pbmRleE9mIiwiY3ViZWUuTGF5b3V0Q2hpbGRyZW4uc2l6ZSIsImN1YmVlLk1vdXNlRXZlbnRUeXBlcyIsImN1YmVlLk1vdXNlRXZlbnRUeXBlcy5jb25zdHJ1Y3RvciIsImN1YmVlLkFDb21wb25lbnQiLCJjdWJlZS5BQ29tcG9uZW50LmNvbnN0cnVjdG9yIiwiY3ViZWUuQUNvbXBvbmVudC5nZXRDbGFzc05hbWUiLCJjdWJlZS5BQ29tcG9uZW50Lmludm9rZVBvc3RDb25zdHJ1Y3QiLCJjdWJlZS5BQ29tcG9uZW50LnBvc3RDb25zdHJ1Y3QiLCJjdWJlZS5BQ29tcG9uZW50LnNldEN1YmVlUGFuZWwiLCJjdWJlZS5BQ29tcG9uZW50LmdldEN1YmVlUGFuZWwiLCJjdWJlZS5BQ29tcG9uZW50LnVwZGF0ZVRyYW5zZm9ybSIsImN1YmVlLkFDb21wb25lbnQucmVxdWVzdExheW91dCIsImN1YmVlLkFDb21wb25lbnQubWVhc3VyZSIsImN1YmVlLkFDb21wb25lbnQub25NZWFzdXJlIiwiY3ViZWUuQUNvbXBvbmVudC5zY2FsZVBvaW50IiwiY3ViZWUuQUNvbXBvbmVudC5yb3RhdGVQb2ludCIsImN1YmVlLkFDb21wb25lbnQuZWxlbWVudCIsImN1YmVlLkFDb21wb25lbnQucGFyZW50IiwiY3ViZWUuQUNvbXBvbmVudC5fc2V0UGFyZW50IiwiY3ViZWUuQUNvbXBvbmVudC5sYXlvdXQiLCJjdWJlZS5BQ29tcG9uZW50Lm5lZWRzTGF5b3V0IiwiY3ViZWUuQUNvbXBvbmVudC5UcmFuc2xhdGVYIiwiY3ViZWUuQUNvbXBvbmVudC50cmFuc2xhdGVYIiwiY3ViZWUuQUNvbXBvbmVudC5UcmFuc2xhdGVZIiwiY3ViZWUuQUNvbXBvbmVudC50cmFuc2xhdGVZIiwiY3ViZWUuQUNvbXBvbmVudC5wYWRkaW5nUHJvcGVydHkiLCJjdWJlZS5BQ29tcG9uZW50LlBhZGRpbmciLCJjdWJlZS5BQ29tcG9uZW50LnBhZGRpbmciLCJjdWJlZS5BQ29tcG9uZW50LmJvcmRlclByb3BlcnR5IiwiY3ViZWUuQUNvbXBvbmVudC5Cb3JkZXIiLCJjdWJlZS5BQ29tcG9uZW50LmJvcmRlciIsImN1YmVlLkFDb21wb25lbnQuTWVhc3VyZWRXaWR0aCIsImN1YmVlLkFDb21wb25lbnQubWVhc3VyZWRXaWR0aCIsImN1YmVlLkFDb21wb25lbnQuTWVhc3VyZWRIZWlnaHQiLCJjdWJlZS5BQ29tcG9uZW50Lm1lYXN1cmVkSGVpZ2h0IiwiY3ViZWUuQUNvbXBvbmVudC5DbGllbnRXaWR0aCIsImN1YmVlLkFDb21wb25lbnQuY2xpZW50V2lkdGgiLCJjdWJlZS5BQ29tcG9uZW50LkNsaWVudEhlaWdodCIsImN1YmVlLkFDb21wb25lbnQuY2xpZW50SGVpZ2h0IiwiY3ViZWUuQUNvbXBvbmVudC5Cb3VuZHNXaWR0aCIsImN1YmVlLkFDb21wb25lbnQuYm91bmRzV2lkdGgiLCJjdWJlZS5BQ29tcG9uZW50LkJvdW5kc0hlaWdodCIsImN1YmVlLkFDb21wb25lbnQuYm91bmRzSGVpZ2h0IiwiY3ViZWUuQUNvbXBvbmVudC5Cb3VuZHNMZWZ0IiwiY3ViZWUuQUNvbXBvbmVudC5ib3VuZHNMZWZ0IiwiY3ViZWUuQUNvbXBvbmVudC5Cb3VuZHNUb3AiLCJjdWJlZS5BQ29tcG9uZW50LmJvdW5kc1RvcCIsImN1YmVlLkFDb21wb25lbnQubWluV2lkdGhQcm9wZXJ0eSIsImN1YmVlLkFDb21wb25lbnQuTWluV2lkdGgiLCJjdWJlZS5BQ29tcG9uZW50Lm1pbldpZHRoIiwiY3ViZWUuQUNvbXBvbmVudC5taW5IZWlnaHRQcm9wZXJ0eSIsImN1YmVlLkFDb21wb25lbnQuTWluSGVpZ2h0IiwiY3ViZWUuQUNvbXBvbmVudC5taW5IZWlnaHQiLCJjdWJlZS5BQ29tcG9uZW50Lm1heFdpZHRoUHJvcGVydHkiLCJjdWJlZS5BQ29tcG9uZW50Lk1heFdpZHRoIiwiY3ViZWUuQUNvbXBvbmVudC5tYXhXaWR0aCIsImN1YmVlLkFDb21wb25lbnQubWF4SGVpZ2h0UHJvcGVydHkiLCJjdWJlZS5BQ29tcG9uZW50Lk1heEhlaWdodCIsImN1YmVlLkFDb21wb25lbnQubWF4SGVpZ2h0IiwiY3ViZWUuQUNvbXBvbmVudC5zZXRQb3NpdGlvbiIsImN1YmVlLkFDb21wb25lbnQuX3NldExlZnQiLCJjdWJlZS5BQ29tcG9uZW50Ll9zZXRUb3AiLCJjdWJlZS5BQ29tcG9uZW50LnNldFNpemUiLCJjdWJlZS5BQ29tcG9uZW50LkN1cnNvciIsImN1YmVlLkFDb21wb25lbnQuY3Vyc29yIiwiY3ViZWUuQUNvbXBvbmVudC5Qb2ludGVyVHJhbnNwYXJlbnQiLCJjdWJlZS5BQ29tcG9uZW50LnBvaW50ZXJUcmFuc3BhcmVudCIsImN1YmVlLkFDb21wb25lbnQuVmlzaWJsZSIsImN1YmVlLkFDb21wb25lbnQudmlzaWJsZSIsImN1YmVlLkFDb21wb25lbnQub25DbGljayIsImN1YmVlLkFDb21wb25lbnQub25Db250ZXh0TWVudSIsImN1YmVlLkFDb21wb25lbnQub25Nb3VzZURvd24iLCJjdWJlZS5BQ29tcG9uZW50Lm9uTW91c2VNb3ZlIiwiY3ViZWUuQUNvbXBvbmVudC5vbk1vdXNlVXAiLCJjdWJlZS5BQ29tcG9uZW50Lm9uTW91c2VFbnRlciIsImN1YmVlLkFDb21wb25lbnQub25Nb3VzZUxlYXZlIiwiY3ViZWUuQUNvbXBvbmVudC5vbk1vdXNlV2hlZWwiLCJjdWJlZS5BQ29tcG9uZW50Lm9uS2V5RG93biIsImN1YmVlLkFDb21wb25lbnQub25LZXlQcmVzcyIsImN1YmVlLkFDb21wb25lbnQub25LZXlVcCIsImN1YmVlLkFDb21wb25lbnQub25QYXJlbnRDaGFuZ2VkIiwiY3ViZWUuQUNvbXBvbmVudC5BbHBoYSIsImN1YmVlLkFDb21wb25lbnQuYWxwaGEiLCJjdWJlZS5BQ29tcG9uZW50LkhhbmRsZVBvaW50ZXIiLCJjdWJlZS5BQ29tcG9uZW50LmhhbmRsZVBvaW50ZXIiLCJjdWJlZS5BQ29tcG9uZW50LkVuYWJsZWQiLCJjdWJlZS5BQ29tcG9uZW50LmVuYWJsZWQiLCJjdWJlZS5BQ29tcG9uZW50LlNlbGVjdGFibGUiLCJjdWJlZS5BQ29tcG9uZW50LnNlbGVjdGFibGUiLCJjdWJlZS5BQ29tcG9uZW50LmxlZnQiLCJjdWJlZS5BQ29tcG9uZW50LnRvcCIsImN1YmVlLkFDb21wb25lbnQuUm90YXRlIiwiY3ViZWUuQUNvbXBvbmVudC5yb3RhdGUiLCJjdWJlZS5BQ29tcG9uZW50LlNjYWxlWCIsImN1YmVlLkFDb21wb25lbnQuc2NhbGVYIiwiY3ViZWUuQUNvbXBvbmVudC5TY2FsZVkiLCJjdWJlZS5BQ29tcG9uZW50LnNjYWxlWSIsImN1YmVlLkFDb21wb25lbnQuVHJhbnNmb3JtQ2VudGVyWCIsImN1YmVlLkFDb21wb25lbnQudHJhbnNmb3JtQ2VudGVyWCIsImN1YmVlLkFDb21wb25lbnQuVHJhbnNmb3JtQ2VudGVyWSIsImN1YmVlLkFDb21wb25lbnQudHJhbnNmb3JtQ2VudGVyWSIsImN1YmVlLkFDb21wb25lbnQuSG92ZXJlZCIsImN1YmVlLkFDb21wb25lbnQuaG92ZXJlZCIsImN1YmVlLkFDb21wb25lbnQuUHJlc3NlZCIsImN1YmVlLkFDb21wb25lbnQucHJlc3NlZCIsImN1YmVlLkFMYXlvdXQiLCJjdWJlZS5BTGF5b3V0LmNvbnN0cnVjdG9yIiwiY3ViZWUuQUxheW91dC5jaGlsZHJlbl9pbm5lciIsImN1YmVlLkFMYXlvdXQubGF5b3V0IiwiY3ViZWUuQUxheW91dC5nZXRDb21wb25lbnRzQXRQb3NpdGlvbiIsImN1YmVlLkFMYXlvdXQuZ2V0Q29tcG9uZW50c0F0UG9zaXRpb25faW1wbCIsImN1YmVlLkFMYXlvdXQuc2V0Q2hpbGRMZWZ0IiwiY3ViZWUuQUxheW91dC5zZXRDaGlsZFRvcCIsImN1YmVlLkFVc2VyQ29udHJvbCIsImN1YmVlLkFVc2VyQ29udHJvbC5jb25zdHJ1Y3RvciIsImN1YmVlLkFVc2VyQ29udHJvbC53aWR0aFByb3BlcnR5IiwiY3ViZWUuQVVzZXJDb250cm9sLldpZHRoIiwiY3ViZWUuQVVzZXJDb250cm9sLndpZHRoIiwiY3ViZWUuQVVzZXJDb250cm9sLmhlaWdodFByb3BlcnR5IiwiY3ViZWUuQVVzZXJDb250cm9sLkhlaWdodCIsImN1YmVlLkFVc2VyQ29udHJvbC5oZWlnaHQiLCJjdWJlZS5BVXNlckNvbnRyb2wuYmFja2dyb3VuZFByb3BlcnR5IiwiY3ViZWUuQVVzZXJDb250cm9sLkJhY2tncm91bmQiLCJjdWJlZS5BVXNlckNvbnRyb2wuYmFja2dyb3VuZCIsImN1YmVlLkFVc2VyQ29udHJvbC5zaGFkb3dQcm9wZXJ0eSIsImN1YmVlLkFVc2VyQ29udHJvbC5TaGFkb3ciLCJjdWJlZS5BVXNlckNvbnRyb2wuc2hhZG93IiwiY3ViZWUuQVVzZXJDb250cm9sLkRyYWdnYWJsZSIsImN1YmVlLkFVc2VyQ29udHJvbC5kcmFnZ2FibGUiLCJjdWJlZS5BVXNlckNvbnRyb2wuX29uQ2hpbGRBZGRlZCIsImN1YmVlLkFVc2VyQ29udHJvbC5fb25DaGlsZFJlbW92ZWQiLCJjdWJlZS5BVXNlckNvbnRyb2wuX29uQ2hpbGRyZW5DbGVhcmVkIiwiY3ViZWUuQVVzZXJDb250cm9sLm9uTGF5b3V0IiwiY3ViZWUuQVZpZXciLCJjdWJlZS5BVmlldy5jb25zdHJ1Y3RvciIsImN1YmVlLkFWaWV3Lm1vZGVsIiwiY3ViZWUuUGFuZWwiLCJjdWJlZS5QYW5lbC5jb25zdHJ1Y3RvciIsImN1YmVlLlBhbmVsLndpZHRoUHJvcGVydHkiLCJjdWJlZS5QYW5lbC5XaWR0aCIsImN1YmVlLlBhbmVsLndpZHRoIiwiY3ViZWUuUGFuZWwuaGVpZ2h0UHJvcGVydHkiLCJjdWJlZS5QYW5lbC5IZWlnaHQiLCJjdWJlZS5QYW5lbC5oZWlnaHQiLCJjdWJlZS5QYW5lbC5iYWNrZ3JvdW5kUHJvcGVydHkiLCJjdWJlZS5QYW5lbC5CYWNrZ3JvdW5kIiwiY3ViZWUuUGFuZWwuYmFja2dyb3VuZCIsImN1YmVlLlBhbmVsLnNoYWRvd1Byb3BlcnR5IiwiY3ViZWUuUGFuZWwuU2hhZG93IiwiY3ViZWUuUGFuZWwuc2hhZG93IiwiY3ViZWUuUGFuZWwuY2hpbGRyZW4iLCJjdWJlZS5IQm94IiwiY3ViZWUuSEJveC5jb25zdHJ1Y3RvciIsImN1YmVlLkhCb3guc2V0Q2VsbFdpZHRoIiwiY3ViZWUuSEJveC5nZXRDZWxsV2lkdGgiLCJjdWJlZS5IQm94LnNldENlbGxIQWxpZ24iLCJjdWJlZS5IQm94LmdldENlbGxIQWxpZ24iLCJjdWJlZS5IQm94LnNldENlbGxWQWxpZ24iLCJjdWJlZS5IQm94LmdldENlbGxWQWxpZ24iLCJjdWJlZS5IQm94LnNldExhc3RDZWxsSEFsaWduIiwiY3ViZWUuSEJveC5zZXRMYXN0Q2VsbFZBbGlnbiIsImN1YmVlLkhCb3guc2V0TGFzdENlbGxXaWR0aCIsImN1YmVlLkhCb3guYWRkRW1wdHlDZWxsIiwiY3ViZWUuSEJveC5fb25DaGlsZEFkZGVkIiwiY3ViZWUuSEJveC5fb25DaGlsZFJlbW92ZWQiLCJjdWJlZS5IQm94Ll9vbkNoaWxkcmVuQ2xlYXJlZCIsImN1YmVlLkhCb3gub25MYXlvdXQiLCJjdWJlZS5IQm94LnNldEluTGlzdCIsImN1YmVlLkhCb3guZ2V0RnJvbUxpc3QiLCJjdWJlZS5IQm94LnJlbW92ZUZyb21MaXN0IiwiY3ViZWUuSEJveC5jaGlsZHJlbiIsImN1YmVlLkhCb3guSGVpZ2h0IiwiY3ViZWUuSEJveC5oZWlnaHQiLCJjdWJlZS5WQm94IiwiY3ViZWUuVkJveC5jb25zdHJ1Y3RvciIsImN1YmVlLlZCb3guY2hpbGRyZW4iLCJjdWJlZS5WQm94LnNldENlbGxIZWlnaHQiLCJjdWJlZS5WQm94LnNldEluTGlzdCIsImN1YmVlLlZCb3guZ2V0RnJvbUxpc3QiLCJjdWJlZS5WQm94LnJlbW92ZUZyb21MaXN0IiwiY3ViZWUuVkJveC5nZXRDZWxsSGVpZ2h0IiwiY3ViZWUuVkJveC5zZXRDZWxsSEFsaWduIiwiY3ViZWUuVkJveC5nZXRDZWxsSEFsaWduIiwiY3ViZWUuVkJveC5zZXRDZWxsVkFsaWduIiwiY3ViZWUuVkJveC5nZXRDZWxsVkFsaWduIiwiY3ViZWUuVkJveC5zZXRMYXN0Q2VsbEhBbGlnbiIsImN1YmVlLlZCb3guc2V0TGFzdENlbGxWQWxpZ24iLCJjdWJlZS5WQm94LnNldExhc3RDZWxsSGVpZ2h0IiwiY3ViZWUuVkJveC5hZGRFbXB0eUNlbGwiLCJjdWJlZS5WQm94LldpZHRoIiwiY3ViZWUuVkJveC53aWR0aCIsImN1YmVlLlZCb3guX29uQ2hpbGRBZGRlZCIsImN1YmVlLlZCb3guX29uQ2hpbGRSZW1vdmVkIiwiY3ViZWUuVkJveC5fb25DaGlsZHJlbkNsZWFyZWQiLCJjdWJlZS5WQm94Lm9uTGF5b3V0IiwiY3ViZWUuU2Nyb2xsQm94IiwiY3ViZWUuU2Nyb2xsQm94LmNvbnN0cnVjdG9yIiwiY3ViZWUuU2Nyb2xsQm94LndpZHRoUHJvcGVydHkiLCJjdWJlZS5TY3JvbGxCb3guV2lkdGgiLCJjdWJlZS5TY3JvbGxCb3gud2lkdGgiLCJjdWJlZS5TY3JvbGxCb3guaGVpZ2h0UHJvcGVydHkiLCJjdWJlZS5TY3JvbGxCb3guSGVpZ2h0IiwiY3ViZWUuU2Nyb2xsQm94LmhlaWdodCIsImN1YmVlLlNjcm9sbEJveC5Db250ZW50IiwiY3ViZWUuU2Nyb2xsQm94LmNvbnRlbnQiLCJjdWJlZS5TY3JvbGxCb3guSFNjcm9sbFBvbGljeSIsImN1YmVlLlNjcm9sbEJveC5oU2Nyb2xsUG9saWN5IiwiY3ViZWUuU2Nyb2xsQm94LlZTY3JvbGxQb2xpY3kiLCJjdWJlZS5TY3JvbGxCb3gudlNjcm9sbFBvbGljeSIsImN1YmVlLlNjcm9sbEJveC5TY3JvbGxXaWR0aCIsImN1YmVlLlNjcm9sbEJveC5zY3JvbGxXaWR0aCIsImN1YmVlLlNjcm9sbEJveC5TY3JvbGxIZWlnaHQiLCJjdWJlZS5TY3JvbGxCb3guc2Nyb2xsSGVpZ2h0IiwiY3ViZWUuU2Nyb2xsQm94LkhTY3JvbGxQb3MiLCJjdWJlZS5TY3JvbGxCb3guaFNjcm9sbFBvcyIsImN1YmVlLlNjcm9sbEJveC5WU2Nyb2xsUG9zIiwiY3ViZWUuU2Nyb2xsQm94LnZTY3JvbGxQb3MiLCJjdWJlZS5TY3JvbGxCb3guTWF4SFNjcm9sbFBvcyIsImN1YmVlLlNjcm9sbEJveC5tYXhIU2Nyb2xsUG9zIiwiY3ViZWUuU2Nyb2xsQm94Lk1heFZTY3JvbGxQb3MiLCJjdWJlZS5TY3JvbGxCb3gubWF4VlNjcm9sbFBvcyIsImN1YmVlLkxhYmVsIiwiY3ViZWUuTGFiZWwuY29uc3RydWN0b3IiLCJjdWJlZS5MYWJlbC5XaWR0aCIsImN1YmVlLkxhYmVsLndpZHRoIiwiY3ViZWUuTGFiZWwuSGVpZ2h0IiwiY3ViZWUuTGFiZWwuaGVpZ2h0IiwiY3ViZWUuTGFiZWwuVGV4dCIsImN1YmVlLkxhYmVsLnRleHQiLCJjdWJlZS5MYWJlbC5UZXh0T3ZlcmZsb3ciLCJjdWJlZS5MYWJlbC50ZXh0T3ZlcmZsb3ciLCJjdWJlZS5MYWJlbC5Gb3JlQ29sb3IiLCJjdWJlZS5MYWJlbC5mb3JlQ29sb3IiLCJjdWJlZS5MYWJlbC5WZXJ0aWNhbEFsaWduIiwiY3ViZWUuTGFiZWwudmVydGljYWxBbGlnbiIsImN1YmVlLkxhYmVsLkJvbGQiLCJjdWJlZS5MYWJlbC5ib2xkIiwiY3ViZWUuTGFiZWwuSXRhbGljIiwiY3ViZWUuTGFiZWwuaXRhbGljIiwiY3ViZWUuTGFiZWwuVW5kZXJsaW5lIiwiY3ViZWUuTGFiZWwudW5kZXJsaW5lIiwiY3ViZWUuTGFiZWwuVGV4dEFsaWduIiwiY3ViZWUuTGFiZWwudGV4dEFsaWduIiwiY3ViZWUuTGFiZWwuRm9udFNpemUiLCJjdWJlZS5MYWJlbC5mb250U2l6ZSIsImN1YmVlLkxhYmVsLkZvbnRGYW1pbHkiLCJjdWJlZS5MYWJlbC5mb250RmFtaWx5IiwiY3ViZWUuQnV0dG9uIiwiY3ViZWUuQnV0dG9uLmNvbnN0cnVjdG9yIiwiY3ViZWUuQnV0dG9uLldpZHRoIiwiY3ViZWUuQnV0dG9uLndpZHRoIiwiY3ViZWUuQnV0dG9uLkhlaWdodCIsImN1YmVlLkJ1dHRvbi5oZWlnaHQiLCJjdWJlZS5CdXR0b24uVGV4dCIsImN1YmVlLkJ1dHRvbi50ZXh0IiwiY3ViZWUuQnV0dG9uLlRleHRPdmVyZmxvdyIsImN1YmVlLkJ1dHRvbi50ZXh0T3ZlcmZsb3ciLCJjdWJlZS5CdXR0b24uRm9yZUNvbG9yIiwiY3ViZWUuQnV0dG9uLmZvcmVDb2xvciIsImN1YmVlLkJ1dHRvbi5WZXJ0aWNhbEFsaWduIiwiY3ViZWUuQnV0dG9uLnZlcnRpY2FsQWxpZ24iLCJjdWJlZS5CdXR0b24uQm9sZCIsImN1YmVlLkJ1dHRvbi5ib2xkIiwiY3ViZWUuQnV0dG9uLkl0YWxpYyIsImN1YmVlLkJ1dHRvbi5pdGFsaWMiLCJjdWJlZS5CdXR0b24uVW5kZXJsaW5lIiwiY3ViZWUuQnV0dG9uLnVuZGVybGluZSIsImN1YmVlLkJ1dHRvbi5UZXh0QWxpZ24iLCJjdWJlZS5CdXR0b24udGV4dEFsaWduIiwiY3ViZWUuQnV0dG9uLkZvbnRTaXplIiwiY3ViZWUuQnV0dG9uLmZvbnRTaXplIiwiY3ViZWUuQnV0dG9uLkZvbnRGYW1pbHkiLCJjdWJlZS5CdXR0b24uZm9udEZhbWlseSIsImN1YmVlLkJ1dHRvbi5CYWNrZ3JvdW5kIiwiY3ViZWUuQnV0dG9uLmJhY2tncm91bmQiLCJjdWJlZS5CdXR0b24uU2hhZG93IiwiY3ViZWUuQnV0dG9uLnNoYWRvdyIsImN1YmVlLlRleHRCb3giLCJjdWJlZS5UZXh0Qm94LmNvbnN0cnVjdG9yIiwiY3ViZWUuVGV4dEJveC5XaWR0aCIsImN1YmVlLlRleHRCb3gud2lkdGgiLCJjdWJlZS5UZXh0Qm94LkhlaWdodCIsImN1YmVlLlRleHRCb3guaGVpZ2h0IiwiY3ViZWUuVGV4dEJveC5UZXh0IiwiY3ViZWUuVGV4dEJveC50ZXh0IiwiY3ViZWUuVGV4dEJveC5CYWNrZ3JvdW5kIiwiY3ViZWUuVGV4dEJveC5iYWNrZ3JvdW5kIiwiY3ViZWUuVGV4dEJveC5Gb3JlQ29sb3IiLCJjdWJlZS5UZXh0Qm94LmZvcmVDb2xvciIsImN1YmVlLlRleHRCb3guVGV4dEFsaWduIiwiY3ViZWUuVGV4dEJveC50ZXh0QWxpZ24iLCJjdWJlZS5UZXh0Qm94LlZlcnRpY2FsQWxpZ24iLCJjdWJlZS5UZXh0Qm94LnZlcnRpY2FsQWxpZ24iLCJjdWJlZS5UZXh0Qm94LkJvbGQiLCJjdWJlZS5UZXh0Qm94LmJvbGQiLCJjdWJlZS5UZXh0Qm94Lkl0YWxpYyIsImN1YmVlLlRleHRCb3guaXRhbGljIiwiY3ViZWUuVGV4dEJveC5VbmRlcmxpbmUiLCJjdWJlZS5UZXh0Qm94LnVuZGVybGluZSIsImN1YmVlLlRleHRCb3guRm9udFNpemUiLCJjdWJlZS5UZXh0Qm94LmZvbnRTaXplIiwiY3ViZWUuVGV4dEJveC5Gb250RmFtaWx5IiwiY3ViZWUuVGV4dEJveC5mb250RmFtaWx5IiwiY3ViZWUuVGV4dEJveC5QbGFjZWhvbGRlciIsImN1YmVlLlRleHRCb3gucGxhY2Vob2xkZXIiLCJjdWJlZS5QYXNzd29yZEJveCIsImN1YmVlLlBhc3N3b3JkQm94LmNvbnN0cnVjdG9yIiwiY3ViZWUuUGFzc3dvcmRCb3guV2lkdGgiLCJjdWJlZS5QYXNzd29yZEJveC53aWR0aCIsImN1YmVlLlBhc3N3b3JkQm94LkhlaWdodCIsImN1YmVlLlBhc3N3b3JkQm94LmhlaWdodCIsImN1YmVlLlBhc3N3b3JkQm94LlRleHQiLCJjdWJlZS5QYXNzd29yZEJveC50ZXh0IiwiY3ViZWUuUGFzc3dvcmRCb3guQmFja2dyb3VuZCIsImN1YmVlLlBhc3N3b3JkQm94LmJhY2tncm91bmQiLCJjdWJlZS5QYXNzd29yZEJveC5Gb3JlQ29sb3IiLCJjdWJlZS5QYXNzd29yZEJveC5mb3JlQ29sb3IiLCJjdWJlZS5QYXNzd29yZEJveC5UZXh0QWxpZ24iLCJjdWJlZS5QYXNzd29yZEJveC50ZXh0QWxpZ24iLCJjdWJlZS5QYXNzd29yZEJveC5WZXJ0aWNhbEFsaWduIiwiY3ViZWUuUGFzc3dvcmRCb3gudmVydGljYWxBbGlnbiIsImN1YmVlLlBhc3N3b3JkQm94LkJvbGQiLCJjdWJlZS5QYXNzd29yZEJveC5ib2xkIiwiY3ViZWUuUGFzc3dvcmRCb3guSXRhbGljIiwiY3ViZWUuUGFzc3dvcmRCb3guaXRhbGljIiwiY3ViZWUuUGFzc3dvcmRCb3guVW5kZXJsaW5lIiwiY3ViZWUuUGFzc3dvcmRCb3gudW5kZXJsaW5lIiwiY3ViZWUuUGFzc3dvcmRCb3guRm9udFNpemUiLCJjdWJlZS5QYXNzd29yZEJveC5mb250U2l6ZSIsImN1YmVlLlBhc3N3b3JkQm94LkZvbnRGYW1pbHkiLCJjdWJlZS5QYXNzd29yZEJveC5mb250RmFtaWx5IiwiY3ViZWUuUGFzc3dvcmRCb3guUGxhY2Vob2xkZXIiLCJjdWJlZS5QYXNzd29yZEJveC5wbGFjZWhvbGRlciIsImN1YmVlLlRleHRBcmVhIiwiY3ViZWUuVGV4dEFyZWEuY29uc3RydWN0b3IiLCJjdWJlZS5UZXh0QXJlYS5XaWR0aCIsImN1YmVlLlRleHRBcmVhLndpZHRoIiwiY3ViZWUuVGV4dEFyZWEuSGVpZ2h0IiwiY3ViZWUuVGV4dEFyZWEuaGVpZ2h0IiwiY3ViZWUuVGV4dEFyZWEuVGV4dCIsImN1YmVlLlRleHRBcmVhLnRleHQiLCJjdWJlZS5UZXh0QXJlYS5CYWNrZ3JvdW5kIiwiY3ViZWUuVGV4dEFyZWEuYmFja2dyb3VuZCIsImN1YmVlLlRleHRBcmVhLkZvcmVDb2xvciIsImN1YmVlLlRleHRBcmVhLmZvcmVDb2xvciIsImN1YmVlLlRleHRBcmVhLlRleHRBbGlnbiIsImN1YmVlLlRleHRBcmVhLnRleHRBbGlnbiIsImN1YmVlLlRleHRBcmVhLlZlcnRpY2FsQWxpZ24iLCJjdWJlZS5UZXh0QXJlYS52ZXJ0aWNhbEFsaWduIiwiY3ViZWUuVGV4dEFyZWEuQm9sZCIsImN1YmVlLlRleHRBcmVhLmJvbGQiLCJjdWJlZS5UZXh0QXJlYS5JdGFsaWMiLCJjdWJlZS5UZXh0QXJlYS5pdGFsaWMiLCJjdWJlZS5UZXh0QXJlYS5VbmRlcmxpbmUiLCJjdWJlZS5UZXh0QXJlYS51bmRlcmxpbmUiLCJjdWJlZS5UZXh0QXJlYS5Gb250U2l6ZSIsImN1YmVlLlRleHRBcmVhLmZvbnRTaXplIiwiY3ViZWUuVGV4dEFyZWEuRm9udEZhbWlseSIsImN1YmVlLlRleHRBcmVhLmZvbnRGYW1pbHkiLCJjdWJlZS5UZXh0QXJlYS5QbGFjZWhvbGRlciIsImN1YmVlLlRleHRBcmVhLnBsYWNlaG9sZGVyIiwiY3ViZWUuQ2hlY2tCb3giLCJjdWJlZS5DaGVja0JveC5jb25zdHJ1Y3RvciIsImN1YmVlLkNoZWNrQm94LkNoZWNrZWQiLCJjdWJlZS5DaGVja0JveC5jaGVja2VkIiwiY3ViZWUuQ29tYm9Cb3giLCJjdWJlZS5Db21ib0JveC5jb25zdHJ1Y3RvciIsImN1YmVlLkNvbWJvQm94LldpZHRoIiwiY3ViZWUuQ29tYm9Cb3gud2lkdGgiLCJjdWJlZS5Db21ib0JveC5IZWlnaHQiLCJjdWJlZS5Db21ib0JveC5oZWlnaHQiLCJjdWJlZS5Db21ib0JveC5UZXh0IiwiY3ViZWUuQ29tYm9Cb3gudGV4dCIsImN1YmVlLkNvbWJvQm94LkJhY2tncm91bmQiLCJjdWJlZS5Db21ib0JveC5iYWNrZ3JvdW5kIiwiY3ViZWUuQ29tYm9Cb3guRm9yZUNvbG9yIiwiY3ViZWUuQ29tYm9Cb3guZm9yZUNvbG9yIiwiY3ViZWUuQ29tYm9Cb3guVGV4dEFsaWduIiwiY3ViZWUuQ29tYm9Cb3gudGV4dEFsaWduIiwiY3ViZWUuQ29tYm9Cb3guVmVydGljYWxBbGlnbiIsImN1YmVlLkNvbWJvQm94LnZlcnRpY2FsQWxpZ24iLCJjdWJlZS5Db21ib0JveC5Cb2xkIiwiY3ViZWUuQ29tYm9Cb3guYm9sZCIsImN1YmVlLkNvbWJvQm94Lkl0YWxpYyIsImN1YmVlLkNvbWJvQm94Lml0YWxpYyIsImN1YmVlLkNvbWJvQm94LlVuZGVybGluZSIsImN1YmVlLkNvbWJvQm94LnVuZGVybGluZSIsImN1YmVlLkNvbWJvQm94LkZvbnRTaXplIiwiY3ViZWUuQ29tYm9Cb3guZm9udFNpemUiLCJjdWJlZS5Db21ib0JveC5Gb250RmFtaWx5IiwiY3ViZWUuQ29tYm9Cb3guZm9udEZhbWlseSIsImN1YmVlLkNvbWJvQm94LlBsYWNlaG9sZGVyIiwiY3ViZWUuQ29tYm9Cb3gucGxhY2Vob2xkZXIiLCJjdWJlZS5Db21ib0JveC5zZWxlY3RlZEluZGV4UHJvcGVydHkiLCJjdWJlZS5Db21ib0JveC5TZWxlY3RlZEluZGV4IiwiY3ViZWUuQ29tYm9Cb3guc2VsZWN0ZWRJbmRleCIsImN1YmVlLkNvbWJvQm94LnNlbGVjdGVkSXRlbVByb3BlcnR5IiwiY3ViZWUuQ29tYm9Cb3guU2VsZWN0ZWRJdGVtIiwiY3ViZWUuQ29tYm9Cb3guc2VsZWN0ZWRJdGVtIiwiY3ViZWUuUGljdHVyZUJveCIsImN1YmVlLlBpY3R1cmVCb3guY29uc3RydWN0b3IiLCJjdWJlZS5QaWN0dXJlQm94LnJlY2FsY3VsYXRlU2l6ZSIsImN1YmVlLlBpY3R1cmVCb3gucGljdHVyZVNpemVNb2RlUHJvcGVydHkiLCJjdWJlZS5QaWN0dXJlQm94LlBpY3R1cmVTaXplTW9kZSIsImN1YmVlLlBpY3R1cmVCb3gucGljdHVyZVNpemVNb2RlIiwiY3ViZWUuUGljdHVyZUJveC53aWR0aFByb3BlcnR5IiwiY3ViZWUuUGljdHVyZUJveC5XaWR0aCIsImN1YmVlLlBpY3R1cmVCb3gud2lkdGgiLCJjdWJlZS5QaWN0dXJlQm94LmhlaWdodFByb3BlcnR5IiwiY3ViZWUuUGljdHVyZUJveC5IZWlnaHQiLCJjdWJlZS5QaWN0dXJlQm94LmhlaWdodCIsImN1YmVlLlBpY3R1cmVCb3gucGFkZGluZ1Byb3BlcnR5IiwiY3ViZWUuUGljdHVyZUJveC5QYWRkaW5nIiwiY3ViZWUuUGljdHVyZUJveC5wYWRkaW5nIiwiY3ViZWUuUGljdHVyZUJveC5ib3JkZXJQcm9wZXJ0eSIsImN1YmVlLlBpY3R1cmVCb3guQm9yZGVyIiwiY3ViZWUuUGljdHVyZUJveC5ib3JkZXIiLCJjdWJlZS5QaWN0dXJlQm94LmJhY2tncm91bmRQcm9wZXJ0eSIsImN1YmVlLlBpY3R1cmVCb3guQmFja2dyb3VuZCIsImN1YmVlLlBpY3R1cmVCb3guYmFja2dyb3VuZCIsImN1YmVlLlBpY3R1cmVCb3guaW1hZ2VQcm9wZXJ0eSIsImN1YmVlLlBpY3R1cmVCb3guSW1hZ2UiLCJjdWJlZS5QaWN0dXJlQm94LmltYWdlIiwiY3ViZWUuQVBvcHVwIiwiY3ViZWUuQVBvcHVwLmNvbnN0cnVjdG9yIiwiY3ViZWUuQVBvcHVwLl9fX3BvcHVwUm9vdCIsImN1YmVlLkFQb3B1cC5yb290Q29tcG9uZW50IiwiY3ViZWUuQVBvcHVwLnNob3ciLCJjdWJlZS5BUG9wdXAuY2xvc2UiLCJjdWJlZS5BUG9wdXAuaXNDbG9zZUFsbG93ZWQiLCJjdWJlZS5BUG9wdXAub25DbG9zZWQiLCJjdWJlZS5BUG9wdXAubW9kYWwiLCJjdWJlZS5BUG9wdXAuYXV0b0Nsb3NlIiwiY3ViZWUuQVBvcHVwLmdsYXNzQ29sb3IiLCJjdWJlZS5BUG9wdXAuVHJhbnNsYXRlWCIsImN1YmVlLkFQb3B1cC50cmFuc2xhdGVYIiwiY3ViZWUuQVBvcHVwLlRyYW5zbGF0ZVkiLCJjdWJlZS5BUG9wdXAudHJhbnNsYXRlWSIsImN1YmVlLkFQb3B1cC5DZW50ZXIiLCJjdWJlZS5BUG9wdXAuY2VudGVyIiwiY3ViZWUuQVBvcHVwLl9sYXlvdXQiLCJjdWJlZS5Qb3B1cHMiLCJjdWJlZS5Qb3B1cHMuY29uc3RydWN0b3IiLCJjdWJlZS5Qb3B1cHMuX2FkZFBvcHVwIiwiY3ViZWUuUG9wdXBzLl9yZW1vdmVQb3B1cCIsImN1YmVlLlBvcHVwcy5fcmVxdWVzdExheW91dCIsImN1YmVlLlBvcHVwcy5sYXlvdXQiLCJjdWJlZS5DdWJlZVBhbmVsIiwiY3ViZWUuQ3ViZWVQYW5lbC5jb25zdHJ1Y3RvciIsImN1YmVlLkN1YmVlUGFuZWwuY2hlY2tCb3VuZHMiLCJjdWJlZS5DdWJlZVBhbmVsLnJlcXVlc3RMYXlvdXQiLCJjdWJlZS5DdWJlZVBhbmVsLmxheW91dCIsImN1YmVlLkN1YmVlUGFuZWwucm9vdENvbXBvbmVudCIsImN1YmVlLkN1YmVlUGFuZWwuQ2xpZW50V2lkdGgiLCJjdWJlZS5DdWJlZVBhbmVsLmNsaWVudFdpZHRoIiwiY3ViZWUuQ3ViZWVQYW5lbC5DbGllbnRIZWlnaHQiLCJjdWJlZS5DdWJlZVBhbmVsLmNsaWVudEhlaWdodCIsImN1YmVlLkN1YmVlUGFuZWwuQm91bmRzV2lkdGgiLCJjdWJlZS5DdWJlZVBhbmVsLmJvdW5kc1dpZHRoIiwiY3ViZWUuQ3ViZWVQYW5lbC5Cb3VuZHNIZWlnaHQiLCJjdWJlZS5DdWJlZVBhbmVsLmJvdW5kc0hlaWdodCIsImN1YmVlLkN1YmVlUGFuZWwuQm91bmRzTGVmdCIsImN1YmVlLkN1YmVlUGFuZWwuYm91bmRzTGVmdCIsImN1YmVlLkN1YmVlUGFuZWwuQm91bmRzVG9wIiwiY3ViZWUuQ3ViZWVQYW5lbC5ib3VuZHNUb3AiLCJjdWJlZS5FSWNvbiIsImN1YmVlLkVJY29uLmNvbnN0cnVjdG9yIiwiY3ViZWUuRUljb24uQURKVVNUIiwiY3ViZWUuRUljb24uQU5DSE9SIiwiY3ViZWUuRUljb24uQVJDSElWRSIsImN1YmVlLkVJY29uLkFSUk9XUyIsImN1YmVlLkVJY29uLkFSUk9XU19IIiwiY3ViZWUuRUljb24uQVJST1dTX1YiLCJjdWJlZS5FSWNvbi5BU1RFUklTSyIsImN1YmVlLkVJY29uLkJBTiIsImN1YmVlLkVJY29uLkJBUl9DSEFSVF9PIiwiY3ViZWUuRUljb24uQkFSQ09ERSIsImN1YmVlLkVJY29uLkJBUlMiLCJjdWJlZS5FSWNvbi5CRUVSIiwiY3ViZWUuRUljb24uQkVMTCIsImN1YmVlLkVJY29uLkJFTExfTyIsImN1YmVlLkVJY29uLkJPTFQiLCJjdWJlZS5FSWNvbi5CT09LIiwiY3ViZWUuRUljb24uQk9PS01BUksiLCJjdWJlZS5FSWNvbi5CT09LTUFSS19PIiwiY3ViZWUuRUljb24uQlJJRUZDQVNFIiwiY3ViZWUuRUljb24uQlVHIiwiY3ViZWUuRUljb24uY2xhc3NOYW1lIiwiY3ViZWUuRkFJY29uIiwiY3ViZWUuRkFJY29uLmNvbnN0cnVjdG9yIiwiY3ViZWUuRkFJY29uLmluaXRGQSIsImN1YmVlLkZBSWNvbi5yZWZyZXNoU3R5bGUiLCJjdWJlZS5GQUljb24uY29sb3JQcm9wZXJ0eSIsImN1YmVlLkZBSWNvbi5Db2xvciIsImN1YmVlLkZBSWNvbi5jb2xvciIsImN1YmVlLkZBSWNvbi5zaXplUHJvcGVydHkiLCJjdWJlZS5GQUljb24uU2l6ZSIsImN1YmVlLkZBSWNvbi5zaXplIiwiY3ViZWUuRkFJY29uLnNwaW5Qcm9wZXJ0eSIsImN1YmVlLkZBSWNvbi5TcGluIiwiY3ViZWUuRkFJY29uLnNwaW4iLCJjdWJlZS5GQUljb24uaWNvblByb3BlcnR5IiwiY3ViZWUuRkFJY29uLkljb24iLCJjdWJlZS5GQUljb24uaWNvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxJQUFPLEtBQUssQ0F5Tlg7QUF6TkQsV0FBTyxLQUFLLEVBQUMsQ0FBQztJQUVWQTtRQUNJQyxtQkFBbUJBLE1BQWNBO1lBQWRDLFdBQU1BLEdBQU5BLE1BQU1BLENBQVFBO1FBQUlBLENBQUNBO1FBQzFDRCxnQkFBQ0E7SUFBREEsQ0FBQ0EsQUFGREQsSUFFQ0E7SUFGWUEsZUFB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LENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUMvQkEsSUFBSUEsRUFBRUEsR0FBZ0JBLEtBQUtBLENBQUNBO2dCQUM1QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsSUFBSUEsSUFBSUEsQ0FBQ0EsVUFBVUEsR0FBR0EsRUFBRUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3ZDQSxRQUFRQSxHQUFHQSxLQUFLQSxDQUFDQTtnQkFDckJBLENBQUNBO2dCQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDSkEsU0FBU0EsR0FBR0EsS0FBS0EsQ0FBQ0E7b0JBQ2xCQSxLQUFLQSxDQUFDQTtnQkFDVkEsQ0FBQ0E7Z0JBRURBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLEdBQUdBLEVBQUVBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLFlBQVlBLElBQUlBLElBQUlBLENBQUNBLFVBQVVBLEdBQUdBLEVBQUVBLENBQUNBLElBQUlBLElBQUlBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO29CQUN4RkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsdUJBQXVCQSxJQUFJQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDckNBLEVBQUVBLENBQUNBLHVCQUF1QkEsRUFBRUEsQ0FBQ0E7b0JBQ2pDQSxDQUFDQTtnQkFDTEEsQ0FBQ0E7WUFDTEEsQ0FBQ0E7WUFFREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsUUFBUUEsSUFBSUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ25CQSxFQUFFQSxDQUFDQSxDQUFDQSxTQUFTQSxJQUFJQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDcEJBLElBQUlBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLEdBQUdBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLFNBQVNBLENBQUNBLElBQUlBLEdBQUdBLFFBQVFB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SUEsQ0FBQ0EsbUJBQW1CQSxDQUFDQSxDQUFDQTtZQUM5REEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxJQUFJQSxDQUFDQSxpQkFBaUJBLENBQUNBLENBQUNBO1lBQzFEQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxnQkFBZ0JBLENBQUNBLElBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsQ0FBQ0E7WUFFeERBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLElBQUlBLFdBQUtBLENBQWFBLElBQUlBLCtCQUF5QkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsRUFBRUEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDN0ZBLElBQUlBLENBQUNBLFlBQVlBLEdBQUdBLElBQUlBLFdBQUtBLENBQWFBLElBQUlBLCtCQUF5QkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsRUFBRUEsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDckdBLElBQUlBLENBQUVBLFlBQVlBLEdBQUdBLElBQUlBLFdBQUtBLENBQWFBLElBQUlBLCtCQUF5QkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsRUFBRUEsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDdEdBLElBQUlBLENBQUVBLFVBQVVBLEdBQUdBLElBQUlBLFdBQUtBLENBQWFBLElBQUlBLCtCQUF5QkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsRUFBRUEsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDbEdBLElBQUlBLENBQUVBLGFBQWFBLEdBQUdBLElBQUlBLFdBQUtBLENBQWFBLElBQUlBLCtCQUF5QkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsRUFBRUEsWUFBWUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDeEdBLElBQUlBLENBQUVBLGFBQWFBLEdBQUdBLElBQUlBLFdBQUtBLENBQWFBLElBQUlBLCtCQUF5QkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsRUFBRUEsWUFBWUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDeEdBLElBQUlBLENB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QUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDN0JBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLGFBQWFBLEVBQUVBLENBQUNBO1lBQ3ZDQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDSkEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7WUFDaEJBLENBQUNBO1FBQ0xBLENBQUNBO1FBRU9OLG9DQUFlQSxHQUF2QkE7WUFDSU8sSUFBSUEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0E7WUFDL0JBLEtBQUtBLEdBQUdBLEtBQUtBLEdBQUdBLENBQUNBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO1lBQzVCQSxLQUFLQSxHQUFHQSxLQUFLQSxHQUFHQSxHQUFHQSxDQUFDQTtZQUNwQkEsSUFBSUEsUUFBUUEsR0FBR0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0E7WUFFN0JBLElBQUlBLE9BQU9BLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsS0FBS0EsR0FBR0EsR0FBR0EsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0E7WUFDekRBLElBQUlBLE9BQU9BLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsS0FBS0EsR0FBR0EsR0FBR0EsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0E7WUFFekRBLElBQUlBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBLFFBQVFBLEVBQUVBLENBQUNBO1lBQ3ZDQSxJQUFJQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQTtZQUV2Q0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsZUFBZUEsR0FBR0EsT0FBT0EsR0FBR0EsR0FBR0EsR0FBR0EsT0FBT0EsQ0FBQ0E7WUFDOURBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLEtBQUtBLENBQUNBLFNBQVNBLEdBQUdBLFlBQVlBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEtBQUtBLEdBQUdBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEtBQUtBO2tCQUNyR0EsYUFBYUEsR0FBR0EsUUFBUUEsR0FBR0EsWUFBWUEsR0FBR0EsRUFBRUEsR0FBR0EsV0FBV0EsR0FBR0EsRUFBRUEsR0FBR0EsR0FBR0EsQ0FBQ0E7WUFDeEVBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLEtBQUtBLENBQUNBLGtCQUFrQkEsR0FBR0EsUUFBUUEsQ0FBQ0E7UUFDdERBLENBQUNBO1FBRURQLGtDQUFhQSxHQUFiQTtZQUNJUSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDckJBLElBQUlBLENBQUNBLFlBQVlBLEdBQUdBLElBQUlBLENBQUNBO2dCQUN6QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsSUFBSUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3ZCQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxhQUFhQSxFQUFFQSxDQUFDQTtnQkFDakNBLENBQUNBO2dCQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxJQUFJQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDbENBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLGFBQWFBLEVBQUVBLENBQUNBO2dCQUNyQ0EsQ0FBQ0E7Z0JBQUNBLElBQUlBLENBQUNBLENBQUNBO29CQUNKQSxZQUFNQSxDQUFDQSxjQUFjQSxFQUFFQSxDQUFDQTtnQkFDNUJBLENBQUNBO1lBQ0xBLENBQUNBO1FBQ0xBLENBQUNBO1FBRURSLDRCQUFPQSxHQUFQQTtZQUNJUyxJQUFJQSxDQUFDQSxTQUFTQSxFQUFFQSxDQUFDQTtRQUNyQkEsQ0FBQ0E7UUFFT1QsOEJBQVNBLEdBQWpCQTtZQUVJVSxJQUFJQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxXQUFXQSxDQUFDQTtZQUNuQ0EsSUFBSUEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsWUFBWUEsQ0FBQ0E7WUFDcENBLElBQUlBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLEtBQUtBLENBQUNBO1lBQzVCQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDWkEsRUFBRUEsR0FBR0EsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0E7Z0JBQzNCQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQTtZQUMvQkEsQ0FBQ0E7WUFDREEsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxLQUFLQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUNuQ0EsSUFBSUEsQ0FBQ0EsbUJBQW1CQSxDQUFDQSxLQUFLQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUdwQ0EsSUFBSUEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7WUFDbkNBLElBQUlBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLFlBQVlBLENBQUNBO1lBQ3BDQSxJQUFJQSxDQUFDQSxvQkFBb0JBLENBQUNBLEtBQUtBLEdBQUdBLEVBQUVBLENBQUNBO1lBQ3JDQSxJQUFJQSxDQUFDQSxxQkFBcUJBLENBQUNBLEtBQUtBLEdBQUdBLEVBQUVBLENBQUNBO1lBR3RDQSxJQUFJQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxpQkFBaUJBLENBQUNBLEtBQUtBLENBQUNBO1lBQ3ZDQSxJQUFJQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxpQkFBaUJBLENBQUNBLEtBQUtBLENBQUNBO1lBRXZDQSxJQUFJQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNYQSxJQUFJQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNYQSxJQUFJQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUNaQSxJQUFJQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUVaQSxJQUFJQSxFQUFFQSxHQUFHQSxJQUFJQSxhQUFPQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMzQkEsSUFBSUEsRUFBRUEsR0FBR0EsSUFBSUEsYUFBT0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDNUJBLElBQUlBLEVBQUVBLEdBQUdBLElBQUlBLGFBQU9BLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO1lBQzdCQSxJQUFJQSxFQUFFQSxHQUFHQSxJQUFJQSxhQUFPQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQTtZQUU1QkEsSUFBSUEsRUFBRUEsR0FBR0EsQ0FBQ0EsRUFBRUEsR0FBR0EsR0FBR0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDeEJBLElBQUlBLEVBQUVBLEdBQUdBLENBQUNBLEVBQUVBLEdBQUdBLEdBQUdBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBRXhCQSxJQUFJQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUM3QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2JBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO2dCQUN6Q0EsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzFDQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDM0NBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO1lBQzlDQSxDQUFDQTtZQUVEQSxJQUFJQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUM1QkEsSUFBSUEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0E7WUFFNUJBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLElBQUlBLEdBQUdBLElBQUlBLEVBQUVBLElBQUlBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO2dCQUN6QkEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ2pEQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQTtnQkFDakRBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO2dCQUNqREEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7WUFDckRBLENBQUNBO1lBRURBLElBQUlBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2hFQSxJQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNoRUEsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDaEVBLElBQUlBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLElBQUlB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QUFDQTtvQkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7d0JBRUpBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO3dCQUNQQSxFQUFFQSxHQUFHQSxRQUFRQSxDQUFDQTt3QkFDZEEsRUFBRUEsR0FBR0EsQ0FBQ0EsRUFBRUEsR0FBR0EsUUFBUUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3pCQSxFQUFFQSxHQUFHQSxDQUFDQSxTQUFTQSxHQUFHQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDOUJBLENBQUNBO2dCQUNMQSxDQUFDQTtnQkFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsc0JBQWdCQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDNUNBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO29CQUNQQSxFQUFFQSxHQUFHQSxTQUFTQSxDQUFDQTtvQkFDZkEsRUFBRUEsR0FBR0EsQ0FBQ0EsRUFBRUEsR0FBR0EsUUFBUUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3pCQSxFQUFFQSxHQUFHQSxDQUFDQSxRQUFRQSxHQUFHQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDN0JBLENBQUNBO2dCQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxzQkFBZ0JBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBO29CQUMzQ0EsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ1BBLEVBQUVBLEdBQUdBLFFBQVFBLENBQUNBO29CQUNkQSxFQUFFQSxHQUFHQSxDQUFDQSxFQUFFQSxHQUFHQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDekJBLEVBQUVBLEdBQUdBLENBQUNBLFNBQVNBLEdBQUdBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO2dCQUM5QkEsQ0FBQ0E7Z0JBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLElBQUlB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Q0EsS0FBS0EsQ0FBQ0E7WUFDMUNBLENBQUNBLEVBQUVBLElBQUlBLENBQUNBLE9BQU9BLEVBQUVBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLFdBQVdBLEVBQUVBLElBQUlBLENBQUNBLFdBQVdBLEVBQzFEQSxJQUFJQSxDQUFDQSx1QkFBdUJBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLENBQUNBO1lBQy9DQSxJQUFJQSxDQUFDQSx1QkFBdUJBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLGdCQUFVQSxDQUFTQTtnQkFDaEVBLElBQUlBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBO2dCQUNkQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDckJBLEtBQUtBLEdBQUdBLENBQUNBLEtBQUlBLENBQUNBLFVBQVVBLENBQUNBLFlBQVlBLEdBQUdBLEtBQUlBLENBQUNBLHVCQUF1QkEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzNGQSxDQUFDQTtnQkFDREEsTUFBTUEsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsS0FBS0EsQ0FBQ0E7WUFDMUNBLENBQUNBLEVBQUVBLElBQUlBLENBQUNBLE9BQU9BLEVBQUVBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLFlBQVlBLEVBQUVBLElBQUlBLENBQUNBLFdBQVdBLEVBQzNEQSxJQUFJQSxDQUFDQSx1QkFBdUJBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBLENBQUNBO1lBQ2hEQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSx1QkFBdUJBLENBQUNBLENBQUNBO1lBRTNEQSxFQUFFQSxDQUFDQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDWkEsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsV0FBV0EsQ0FBQ0E7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LENBQUNBLENBQUNBO1FBQ25DQSxVQUFJQSxHQUFHQSxJQUFJQSxLQUFLQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtRQUMzQkEsVUFBSUEsR0FBR0EsSUFBSUEsS0FBS0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7UUFDM0JBLGFBQU9BLEdBQUdBLElBQUlBLEtBQUtBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBO1FBQ2pDQSxVQUFJQSxHQUFHQSxJQUFJQSxLQUFLQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtRQUMzQkEsV0FBS0EsR0FBR0EsSUFBSUEsS0FBS0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7UUFDN0JBLFVBQUlBLEdBQUdBLElBQUlBLEtBQUtBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO1FBQzNCQSxVQUFJQSxHQUFHQSxJQUFJQSxLQUFLQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtRQUMzQkEsVUFBSUEsR0FBR0EsSUFBSUEsS0FBS0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7UUFDM0JBLFVBQUlBLEdBQUdBLElBQUlBLEtBQUtBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO1FBQzNCQSxVQUFJQSxHQUFHQSxJQUFJQSxLQUFLQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtRQUMzQkEsYUFBT0EsR0FBR0EsSUFBSUEsS0FBS0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0E7UUFDakNBLFVBQUlBLEdBQUdBLElBQUlBLEtBQUtBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO1FBQzNCQSxZQUFNQSxHQUFHQSxJQUFJQSxLQUFLQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtRQUMvQkEsWUFBTUEsR0FBR0EsSUFBSUEsS0FBS0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7UUFDL0JBLFVBQUlBLEdBQUdBLElBQUlBLEtBQUtBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO1FBQzNCQSxtQkFBYUEsR0FBR0EsSUFBSUEsS0FBS0EsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxDQUFDQTtRQUM3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QkEsQ0FBQ0E7OztXQUhBWjtRQUtTQSw2QkFBWUEsR0FBdEJBO1lBQ0lhLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBO1FBQ3RCQSxDQUFDQTtRQUNEYixzQkFBSUEsd0JBQUlBO2lCQUFSQTtnQkFDSWMsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsQ0FBQ0E7WUFDL0JBLENBQUNBOzs7V0FBQWQ7UUFDREEsc0JBQUlBLHdCQUFJQTtpQkFBUkE7Z0JBQ0llLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBO1lBQzNCQSxDQUFDQTtpQkFDRGYsVUFBU0EsS0FBS0E7Z0JBQ1ZlLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBO1lBQzVCQSxDQUFDQTs7O1dBSEFmO1FBL0djQSxtQkFBWUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFvSHhDQSxhQUFDQTtJQUFEQSxDQUFDQSxBQXRIRGp0QixFQUE0QkEsa0JBQVlBLEVBc0h2Q0E7SUF0SFlBLFlBQU1BLFNBc0hsQkEsQ0FBQUE7QUFFTEEsQ0FBQ0EsRUExSE0sS0FBSyxLQUFMLEtBQUssUUEwSFgiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUgY3ViZWUge1xuXG4gICAgZXhwb3J0IGNsYXNzIEV2ZW50QXJncyB7XG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzZW5kZXI6IE9iamVjdCkgeyB9XG4gICAgfVxuICAgIFxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSUxpc3RlbmVyQ2FsbGJhY2s8VD4ge1xuICAgICAgICBvbkFkZGVkKGxpc3RlbmVyOiBJRXZlbnRMaXN0ZW5lcjxUPik6IHZvaWQ7XG4gICAgICAgIG9uUmVtb3ZlZChsaXN0ZW5lcjogSUV2ZW50TGlzdGVuZXI8VD4pOiB2b2lkO1xuICAgIH1cbiAgICBcbiAgICBleHBvcnQgY2xhc3MgSHRtbEV2ZW50TGlzdGVuZXJDYWxsYmFjazxUPiBpbXBsZW1lbnRzIElMaXN0ZW5lckNhbGxiYWNrPFQ+IHtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2VsZW1lbnQ6IEhUTUxFbGVtZW50LCBwcml2YXRlIF9ldmVudFR5cGU6IHN0cmluZykge1xuICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIG9uQWRkZWQobGlzdGVuZXI6IElFdmVudExpc3RlbmVyPFQ+KTogdm9pZCB7XG4gICAgICAgICAgICAoPGFueT5saXN0ZW5lcikuJCRuYXRpdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIChldmVudEFyZ3M6IFQpIHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcihldmVudEFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHRoaXMuX2V2ZW50VHlwZSwgKDxhbnk+bGlzdGVuZXIpLiQkbmF0aXZlTGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBvblJlbW92ZWQobGlzdGVuZXI6IElFdmVudExpc3RlbmVyPFQ+KTogdm9pZCB7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIodGhpcy5fZXZlbnRUeXBlLCAoPGFueT5saXN0ZW5lcikuJCRuYXRpdmVMaXN0ZW5lcik7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEV2ZW50PFQ+IHtcblxuICAgICAgICBwcml2YXRlIF9saXN0ZW5lcnM6IElFdmVudExpc3RlbmVyPFQ+W10gPSBbXTtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9saXN0ZW5lckNhbGxiYWNrOiBJTGlzdGVuZXJDYWxsYmFjazxUPiA9IG51bGwpIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZExpc3RlbmVyKGxpc3RlbmVyOiBJRXZlbnRMaXN0ZW5lcjxUPikge1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVyID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoZSBsaXN0ZW5lciBwYXJhbWV0ZXIgY2FuIG5vdCBiZSBudWxsLlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNMaXN0ZW5lcihsaXN0ZW5lcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHRoaXMuX2xpc3RlbmVyQ2FsbGJhY2sgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVyQ2FsbGJhY2sub25BZGRlZChsaXN0ZW5lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcjogSUV2ZW50TGlzdGVuZXI8VD4pIHtcbiAgICAgICAgICAgIHZhciBpZHggPSB0aGlzLl9saXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcik7XG4gICAgICAgICAgICBpZiAoaWR4IDwgMCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVycy5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHRoaXMuX2xpc3RlbmVyQ2FsbGJhY2sgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVyQ2FsbGJhY2sub25SZW1vdmVkKGxpc3RlbmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGhhc0xpc3RlbmVyKGxpc3RlbmVyOiBJRXZlbnRMaXN0ZW5lcjxUPikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKSA+IC0xO1xuICAgICAgICB9XG5cbiAgICAgICAgZmlyZUV2ZW50KGFyZ3M6IFQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGwgaW4gdGhpcy5fbGlzdGVuZXJzKSB7XG4gICAgICAgICAgICAgICAgbGV0IGxpc3RlbmVyOiBJRXZlbnRMaXN0ZW5lcjxUPiA9IGw7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXIoYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGdldCBsaXN0ZW5lckNhbGxiYWNrKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3RlbmVyQ2FsbGJhY2s7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHNldCBsaXN0ZW5lckNhbGxiYWNrKHZhbHVlOiBJTGlzdGVuZXJDYWxsYmFjazxUPikge1xuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJDYWxsYmFjayA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgVGltZXIge1xuXG4gICAgICAgIHByaXZhdGUgdG9rZW46IG51bWJlcjtcbiAgICAgICAgcHJpdmF0ZSByZXBlYXQ6IGJvb2xlYW4gPSB0cnVlO1xuICAgICAgICBwcml2YXRlIGFjdGlvbjogeyAoKTogdm9pZCB9ID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mdW5jKCk7XG4gICAgICAgICAgICBpZiAoIXRoaXMucmVwZWF0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b2tlbiA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBmdW5jOiB7ICgpOiB2b2lkIH0pIHtcbiAgICAgICAgICAgIGlmIChmdW5jID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoZSBmdW5jIHBhcmFtZXRlciBjYW4gbm90IGJlIG51bGwuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzdGFydChkZWxheTogbnVtYmVyLCByZXBlYXQ6IGJvb2xlYW4pIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICAgICAgdGhpcy5yZXBlYXQgPSByZXBlYXQ7XG4gICAgICAgICAgICBpZiAodGhpcy5yZXBlYXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRva2VuID0gc2V0SW50ZXJ2YWwodGhpcy5mdW5jLCBkZWxheSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudG9rZW4gPSBzZXRUaW1lb3V0KHRoaXMuZnVuYywgZGVsYXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3RvcCgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnRva2VuICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMudG9rZW4pO1xuICAgICAgICAgICAgICAgIHRoaXMudG9rZW4gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFN0YXJ0ZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b2tlbiAhPSBudWxsO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIElFdmVudExpc3RlbmVyPFQ+IHtcbiAgICAgICAgKGFyZ3M6IFQpOiB2b2lkO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBFdmVudFF1ZXVlIHtcblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogRXZlbnRRdWV1ZSA9IG51bGw7XG5cbiAgICAgICAgc3RhdGljIGdldCBJbnN0YW5jZSgpIHtcbiAgICAgICAgICAgIGlmIChFdmVudFF1ZXVlLmluc3RhbmNlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBFdmVudFF1ZXVlLmluc3RhbmNlID0gbmV3IEV2ZW50UXVldWUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIEV2ZW50UXVldWUuaW5zdGFuY2U7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHF1ZXVlOiB7ICgpOiB2b2lkIH1bXSA9IFtdO1xuICAgICAgICBwcml2YXRlIHRpbWVyOiBUaW1lciA9IG51bGw7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVyID0gbmV3IFRpbWVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgc2l6ZSA9IHRoaXMucXVldWUubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0YXNrOiB7ICgpOiB2b2lkIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXNrID0gdGhpcy5xdWV1ZVswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucXVldWUuc3BsaWNlKDAsIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhc2sgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhc2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzaXplID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlcmUgd2VyZSBzb21lIHRhc2sgdGhhbiB3ZSBuZWVkIHRvIGNoZWNrIGZhc3QgaWYgbW9yZSB0YXNrcyBhcmUgcmVjZWl2ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGltZXIuc3RhcnQoMCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXNuJ3QgYW55IHRhc2sgdGhhbiB3ZSBjYW4gcmVsYXggYSBiaXRcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGltZXIuc3RhcnQoNTAsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudGltZXIuc3RhcnQoMTAsIGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGludm9rZUxhdGVyKHRhc2s6IHsgKCk6IHZvaWQgfSkge1xuICAgICAgICAgICAgaWYgKHRhc2sgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIHRhc2sgY2FuIG5vdCBiZSBudWxsLlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5xdWV1ZS5wdXNoKHRhc2spO1xuICAgICAgICB9XG5cbiAgICAgICAgaW52b2tlUHJpb3IodGFzazogeyAoKTogdm9pZCB9KSB7XG4gICAgICAgICAgICBpZiAodGFzayA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgdGFzayBjYW4gbm90IGJlIG51bGwuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnF1ZXVlLnNwbGljZSgwLCAwLCB0YXNrKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFJ1bk9uY2Uge1xuXG4gICAgICAgIHByaXZhdGUgc2NoZWR1bGVkID0gZmFsc2U7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBmdW5jOiBJUnVubmFibGUpIHtcbiAgICAgICAgICAgIGlmIChmdW5jID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoZSBmdW5jIHBhcmFtZXRlciBjYW4gbm90IGJlIG51bGwuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBydW4oKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zY2hlZHVsZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlZCA9IHRydWU7XG4gICAgICAgICAgICBFdmVudFF1ZXVlLkluc3RhbmNlLmludm9rZUxhdGVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuZnVuYygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgUGFyZW50Q2hhbmdlZEV2ZW50QXJncyBleHRlbmRzIEV2ZW50QXJncyB7XG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuZXdQYXJlbnQ6IEFMYXlvdXQsXG4gICAgICAgICAgICBwdWJsaWMgc2VuZGVyOiBPYmplY3QpIHtcbiAgICAgICAgICAgIHN1cGVyKHNlbmRlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiZXZlbnRzLnRzXCIvPlxuXG5tb2R1bGUgY3ViZWUge1xuXG4gICAgZXhwb3J0IGludGVyZmFjZSBJQ2hhbmdlTGlzdGVuZXIge1xuICAgICAgICAoc2VuZGVyPzogT2JqZWN0KTogdm9pZDtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIElPYnNlcnZhYmxlIHtcbiAgICAgICAgYWRkQ2hhbmdlTGlzdGVuZXIobGlzdGVuZXI6IElDaGFuZ2VMaXN0ZW5lcik6IHZvaWQ7XG4gICAgICAgIHJlbW92ZUNoYW5nZUxpc3RlbmVyKGxpc3RlbmVyOiBJQ2hhbmdlTGlzdGVuZXIpOiB2b2lkO1xuICAgICAgICBoYXNDaGFuZ2VMaXN0ZW5lcihsaXN0ZW5lcjogSUNoYW5nZUxpc3RlbmVyKTogdm9pZDtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIElCaW5kYWJsZTxUPiB7XG4gICAgICAgIGJpbmQoc291cmNlOiBUKTogdm9pZDtcbiAgICAgICAgdW5iaW5kKCk6IHZvaWQ7XG4gICAgICAgIGlzQm91bmQoKTogYm9vbGVhbjtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIElBbmltYXRlYWJsZTxUPiB7XG4gICAgICAgIGFuaW1hdGUocG9zOiBudW1iZXIsIHN0YXJ0VmFsdWU6IFQsIGVuZFZhbHVlOiBUKTogVDtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIElQcm9wZXJ0eTxUPiBleHRlbmRzIElPYnNlcnZhYmxlIHtcbiAgICAgICAgZ2V0T2JqZWN0VmFsdWUoKTogT2JqZWN0O1xuICAgICAgICBpbnZhbGlkYXRlKCk6IHZvaWQ7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBJVmFsaWRhdG9yPFQ+IHtcbiAgICAgICAgdmFsaWRhdGUodmFsdWU6IFQpOiBUO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBQcm9wZXJ0eTxUPiBpbXBsZW1lbnRzIElQcm9wZXJ0eTxUPiwgSUFuaW1hdGVhYmxlPFQ+LCBJQmluZGFibGU8SVByb3BlcnR5PFQ+PiB7XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX25leHRJZCA9IDA7XG5cbiAgICAgICAgcHJpdmF0ZSBfY2hhbmdlTGlzdGVuZXJzOiBJQ2hhbmdlTGlzdGVuZXJbXSA9IFtdO1xuXG4gICAgICAgIHByaXZhdGUgX3ZhbGlkOiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHByaXZhdGUgX2JpbmRpbmdTb3VyY2U6IElQcm9wZXJ0eTxUPjtcblxuICAgICAgICBwcml2YXRlIF9yZWFkb25seUJpbmQ6IElQcm9wZXJ0eTxUPjtcbiAgICAgICAgcHJpdmF0ZSBfYmlkaXJlY3Rpb25hbEJpbmRQcm9wZXJ0eTogUHJvcGVydHk8VD47XG4gICAgICAgIHByaXZhdGUgX2JpZGlyZWN0aW9uYWxDaGFuZ2VMaXN0ZW5lclRoaXM6IElDaGFuZ2VMaXN0ZW5lcjtcbiAgICAgICAgcHJpdmF0ZSBfYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyT3RoZXI6IElDaGFuZ2VMaXN0ZW5lcjtcbiAgICAgICAgcHJpdmF0ZSBfaWQ6IHN0cmluZyA9IFwicFwiICsgUHJvcGVydHkuX25leHRJZCsrO1xuICAgICAgICBwcml2YXRlIGJpbmRMaXN0ZW5lciA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlSWZOZWVkZWQoKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICAgICAgcHJpdmF0ZSBfdmFsdWU/OiBULFxuICAgICAgICAgICAgcHJpdmF0ZSBfbnVsbGFibGU6IGJvb2xlYW4gPSB0cnVlLFxuICAgICAgICAgICAgcHJpdmF0ZSBfcmVhZG9ubHk6IGJvb2xlYW4gPSBmYWxzZSxcbiAgICAgICAgICAgIHByaXZhdGUgX3ZhbGlkYXRvcjogSVZhbGlkYXRvcjxUPiA9IG51bGwpIHtcblxuICAgICAgICAgICAgaWYgKF92YWx1ZSA9PSBudWxsICYmIF9udWxsYWJsZSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiQSBudWxsYWJsZSBwcm9wZXJ0eSBjYW4gbm90IGJlIG51bGwuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl92YWx1ZSAhPSBudWxsICYmIF92YWxpZGF0b3IgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gX3ZhbGlkYXRvci52YWxpZGF0ZShfdmFsdWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmludmFsaWRhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBpZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB2YWxpZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92YWxpZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB2YWx1ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBUKSB7XG4gICAgICAgICAgICB0aGlzLnNldChuZXdWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgbnVsbGFibGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbnVsbGFibGU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgcmVhZG9ubHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVhZG9ubHk7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0UmVhZG9ubHlCaW5kKHJlYWRvbmx5QmluZDogSVByb3BlcnR5PFQ+KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fcmVhZG9ubHlCaW5kICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoZSByZWFkb25seSBiaW5kIGlzIGFscmVhZHkgaW5pdGlhbGl6ZWQuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9yZWFkb25seUJpbmQgPSByZWFkb25seUJpbmQ7XG4gICAgICAgICAgICBpZiAocmVhZG9ubHlCaW5kICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZWFkb25seUJpbmQuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5iaW5kTGlzdGVuZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGdldCgpOiBUIHtcbiAgICAgICAgICAgIHRoaXMuX3ZhbGlkID0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuX2JpbmRpbmdTb3VyY2UgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl92YWxpZGF0b3IgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdmFsaWRhdG9yLnZhbGlkYXRlKDxUPnRoaXMuX2JpbmRpbmdTb3VyY2UuZ2V0T2JqZWN0VmFsdWUoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiA8VD50aGlzLl9iaW5kaW5nU291cmNlLmdldE9iamVjdFZhbHVlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9yZWFkb25seUJpbmQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl92YWxpZGF0b3IgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdmFsaWRhdG9yLnZhbGlkYXRlKDxUPnRoaXMuX3JlYWRvbmx5QmluZC5nZXRPYmplY3RWYWx1ZSgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIDxUPnRoaXMuX3JlYWRvbmx5QmluZC5nZXRPYmplY3RWYWx1ZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHNldChuZXdWYWx1ZTogVCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3JlYWRvbmx5KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJDYW4gbm90IGNoYW5nZSB0aGUgdmFsdWUgb2YgYSByZWFkb25seSBwcm9wZXJ0eS5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNCb3VuZCgpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJDYW4gbm90IGNoYW5nZSB0aGUgdmFsdWUgb2YgYSBib3VuZCBwcm9wZXJ0eS5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF0aGlzLl9udWxsYWJsZSAmJiBuZXdWYWx1ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJDYW4gbm90IHNldCB0aGUgdmFsdWUgdG8gbnVsbCBvZiBhIG5vbiBudWxsYWJsZSBwcm9wZXJ0eS5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX3ZhbGlkYXRvciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbmV3VmFsdWUgPSB0aGlzLl92YWxpZGF0b3IudmFsaWRhdGUobmV3VmFsdWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fdmFsdWUgPT0gbmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl92YWx1ZSAhPSBudWxsICYmIHRoaXMuX3ZhbHVlID09IG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLmludmFsaWRhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGludmFsaWRhdGUoKSB7XG4gICAgICAgICAgICB0aGlzLl92YWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5maXJlQ2hhbmdlTGlzdGVuZXJzKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbnZhbGlkYXRlSWZOZWVkZWQoKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX3ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmaXJlQ2hhbmdlTGlzdGVuZXJzKCkge1xuICAgICAgICAgICAgdGhpcy5fY2hhbmdlTGlzdGVuZXJzLmZvckVhY2goKGxpc3RlbmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXIodGhpcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldE9iamVjdFZhbHVlKCk6IE9iamVjdCB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZENoYW5nZUxpc3RlbmVyKGxpc3RlbmVyOiBJQ2hhbmdlTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgbGlzdGVuZXIgcGFyYW1ldGVyIGNhbiBub3QgYmUgbnVsbC5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzQ2hhbmdlTGlzdGVuZXIobGlzdGVuZXIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9jaGFuZ2VMaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG5cbiAgICAgICAgICAgIC8vIHZhbGlkYXRlIHRoZSBjb21wb25lbnRcbiAgICAgICAgICAgIHRoaXMuZ2V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmVDaGFuZ2VMaXN0ZW5lcihsaXN0ZW5lcjogSUNoYW5nZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICB2YXIgaWR4ID0gdGhpcy5fY2hhbmdlTGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpO1xuICAgICAgICAgICAgaWYgKGlkeCA8IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9jaGFuZ2VMaXN0ZW5lcnMuc3BsaWNlKGlkeCk7XG4gICAgICAgIH1cblxuICAgICAgICBoYXNDaGFuZ2VMaXN0ZW5lcihsaXN0ZW5lcjogSUNoYW5nZUxpc3RlbmVyKTogYm9vbGVhbiB7XG4gICAgICAgICAgICB0aGlzLl9jaGFuZ2VMaXN0ZW5lcnMuZm9yRWFjaCgobCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChsID09IGxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgYW5pbWF0ZShwb3M6IG51bWJlciwgc3RhcnRWYWx1ZTogVCwgZW5kVmFsdWU6IFQpIHtcbiAgICAgICAgICAgIGlmIChwb3MgPCAwLjUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhcnRWYWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGVuZFZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgYmluZChzb3VyY2U6IElQcm9wZXJ0eTxUPikge1xuICAgICAgICAgICAgaWYgKHNvdXJjZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgc291cmNlIGNhbiBub3QgYmUgbnVsbC5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNCb3VuZCgpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGlzIHByb3BlcnR5IGlzIGFscmVhZHkgYm91bmQuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9yZWFkb25seSkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiQ2FuJ3QgYmluZCBhIHJlYWRvbmx5IHByb3BlcnR5LlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9iaW5kaW5nU291cmNlID0gc291cmNlO1xuICAgICAgICAgICAgdGhpcy5fYmluZGluZ1NvdXJjZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLmJpbmRMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLmludmFsaWRhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJpZGlyZWN0aW9uYWxCaW5kKG90aGVyOiBQcm9wZXJ0eTxUPikge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNCb3VuZCgpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGlzIHByb3BlcnR5IGlzIGFscmVhZHkgYm91bmQuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9yZWFkb25seSkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiQ2FuJ3QgYmluZCBhIHJlYWRvbmx5IHByb3BlcnR5LlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3RoZXIgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIG90aGVyIHBhcmFtZXRlciBjYW4gbm90IGJlIG51bGwuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvdGhlci5fcmVhZG9ubHkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIkNhbiBub3QgYmluZCBhIHByb3BlcnR5IGJpZGlyZWN0aW9uYWxseSB0byBhIHJlYWRvbmx5IHByb3BlcnR5LlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3RoZXIgPT0gdGhpcykge1xuICAgICAgICAgICAgICAgIHRocm93IFwiQ2FuIG5vdCBiaW5kIGEgcHJvcGVydHkgYmlkaXJlY3Rpb25hbGx5IGZvciB0aGVtc2VsZi5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG90aGVyLmlzQm91bmQoKSkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIHRhcmdldCBwcm9wZXJ0eSBpcyBhbHJlYWR5IGJvdW5kLlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9iaWRpcmVjdGlvbmFsQmluZFByb3BlcnR5ID0gb3RoZXI7XG4gICAgICAgICAgICB0aGlzLl9iaWRpcmVjdGlvbmFsQ2hhbmdlTGlzdGVuZXJPdGhlciA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldCh0aGlzLl9iaWRpcmVjdGlvbmFsQmluZFByb3BlcnR5LmdldCgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG90aGVyLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX2JpZGlyZWN0aW9uYWxDaGFuZ2VMaXN0ZW5lck90aGVyKTtcbiAgICAgICAgICAgIHRoaXMuX2JpZGlyZWN0aW9uYWxDaGFuZ2VMaXN0ZW5lclRoaXMgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmlkaXJlY3Rpb25hbEJpbmRQcm9wZXJ0eS5zZXQodGhpcy5nZXQoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX2JpZGlyZWN0aW9uYWxDaGFuZ2VMaXN0ZW5lclRoaXMpO1xuXG4gICAgICAgICAgICBvdGhlci5fYmlkaXJlY3Rpb25hbEJpbmRQcm9wZXJ0eSA9IHRoaXM7XG4gICAgICAgICAgICBvdGhlci5fYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyT3RoZXIgPSB0aGlzLl9iaWRpcmVjdGlvbmFsQ2hhbmdlTGlzdGVuZXJUaGlzO1xuICAgICAgICAgICAgb3RoZXIuX2JpZGlyZWN0aW9uYWxDaGFuZ2VMaXN0ZW5lclRoaXMgPSB0aGlzLl9iaWRpcmVjdGlvbmFsQ2hhbmdlTGlzdGVuZXJPdGhlcjtcblxuICAgICAgICB9XG5cbiAgICAgICAgdW5iaW5kKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2JpbmRpbmdTb3VyY2UgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2JpbmRpbmdTb3VyY2UucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5iaW5kTGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2JpbmRpbmdTb3VyY2UgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzQmlkaXJlY3Rpb25hbEJvdW5kKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX2JpZGlyZWN0aW9uYWxDaGFuZ2VMaXN0ZW5lclRoaXMpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2JpZGlyZWN0aW9uYWxCaW5kUHJvcGVydHkucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyT3RoZXIpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2JpZGlyZWN0aW9uYWxCaW5kUHJvcGVydHkuX2JpZGlyZWN0aW9uYWxCaW5kUHJvcGVydHkgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuX2JpZGlyZWN0aW9uYWxCaW5kUHJvcGVydHkuX2JpZGlyZWN0aW9uYWxDaGFuZ2VMaXN0ZW5lck90aGVyID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLl9iaWRpcmVjdGlvbmFsQmluZFByb3BlcnR5Ll9iaWRpcmVjdGlvbmFsQ2hhbmdlTGlzdGVuZXJUaGlzID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLl9iaWRpcmVjdGlvbmFsQmluZFByb3BlcnR5ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLl9iaWRpcmVjdGlvbmFsQ2hhbmdlTGlzdGVuZXJPdGhlciA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyVGhpcyA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB1bmJpbmRUYXJnZXRzKCkge1xuICAgICAgICAgICAgLy8gVE9ETyBudWxsIGJpbmRpbmdTb3VyY2Ugb2YgdGFyZ2V0c1xuICAgICAgICAgICAgdGhpcy5fY2hhbmdlTGlzdGVuZXJzID0gW107XG4gICAgICAgIH1cblxuICAgICAgICBpc0JvdW5kKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JpbmRpbmdTb3VyY2UgIT0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlzQmlkaXJlY3Rpb25hbEJvdW5kKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JpZGlyZWN0aW9uYWxCaW5kUHJvcGVydHkgIT0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNyZWF0ZVByb3BlcnR5TGluZShrZXlGcmFtZXM6IEtleUZyYW1lPFQ+W10pOiBQcm9wZXJ0eUxpbmU8VD4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9wZXJ0eUxpbmU8VD4oa2V5RnJhbWVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlc3Ryb3koKSB7XG4gICAgICAgICAgICB0aGlzLnVuYmluZCgpO1xuICAgICAgICAgICAgdGhpcy5fY2hhbmdlTGlzdGVuZXJzID0gW107XG4gICAgICAgICAgICB0aGlzLmJpbmRMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBFeHByZXNzaW9uPFQ+IGltcGxlbWVudHMgSVByb3BlcnR5PFQ+LCBJT2JzZXJ2YWJsZSB7XG5cbiAgICAgICAgcHJpdmF0ZSBfbm90aWZ5TGlzdGVuZXJzT25jZSA9IG5ldyBSdW5PbmNlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmlyZUNoYW5nZUxpc3RlbmVycygpO1xuICAgICAgICB9KTtcblxuICAgICAgICBwcml2YXRlIF9iaW5kaW5nU291cmNlczogSVByb3BlcnR5PGFueT5bXSA9IFtdO1xuICAgICAgICBwcml2YXRlIF9iaW5kaW5nTGlzdGVuZXI6IElDaGFuZ2VMaXN0ZW5lciA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZUlmTmVlZGVkKCk7XG4gICAgICAgIH07XG4gICAgICAgIHByaXZhdGUgX2NoYW5nZUxpc3RlbmVyczogSUNoYW5nZUxpc3RlbmVyW10gPSBbXTtcblxuICAgICAgICBwcml2YXRlIF9mdW5jOiB7ICgpOiBUIH07XG4gICAgICAgIHByaXZhdGUgX3ZhbGlkID0gZmFsc2U7XG4gICAgICAgIHByaXZhdGUgX3ZhbHVlOiBUID0gbnVsbDtcblxuICAgICAgICBjb25zdHJ1Y3RvcihmdW5jOiB7ICgpOiBUIH0sIC4uLmFjdGl2YXRvcnM6IElQcm9wZXJ0eTxhbnk+W10pIHtcbiAgICAgICAgICAgIGlmIChmdW5jID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoZSAnZnVuYycgcGFyYW1ldGVyIGNhbiBub3QgYmUgbnVsbFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fZnVuYyA9IGZ1bmM7XG4gICAgICAgICAgICB0aGlzLmJpbmQuYXBwbHkodGhpcywgYWN0aXZhdG9ycyk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgdmFsdWUoKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX3ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSB0aGlzLl9mdW5jKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fdmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRDaGFuZ2VMaXN0ZW5lcihsaXN0ZW5lcjogSUNoYW5nZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICBpZiAobGlzdGVuZXIgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIGxpc3RlbmVyIHBhcmFtZXRlciBjYW4gbm90IGJlIG51bGwuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmhhc0NoYW5nZUxpc3RlbmVyKGxpc3RlbmVyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fY2hhbmdlTGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuXG4gICAgICAgICAgICBsZXQgeCA9IHRoaXMudmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmVDaGFuZ2VMaXN0ZW5lcihsaXN0ZW5lcjogSUNoYW5nZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLl9jaGFuZ2VMaXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcik7XG4gICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NoYW5nZUxpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fY2hhbmdlTGlzdGVuZXJzLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9iaW5kaW5nU291cmNlcy5mb3JFYWNoKChwcm9wKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHByb3AucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fYmluZGluZ0xpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBoYXNDaGFuZ2VMaXN0ZW5lcihsaXN0ZW5lcjogSUNoYW5nZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hhbmdlTGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpID4gLTE7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRPYmplY3RWYWx1ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgYmluZCguLi5wcm9wZXJ0aWVzOiBJUHJvcGVydHk8YW55PltdKSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLmZvckVhY2goKHByb3ApID0+IHtcbiAgICAgICAgICAgICAgICBwcm9wLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX2JpbmRpbmdMaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmluZGluZ1NvdXJjZXMucHVzaChwcm9wKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmludmFsaWRhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVuYmluZEFsbCgpIHtcbiAgICAgICAgICAgIHRoaXMuX2JpbmRpbmdTb3VyY2VzLmZvckVhY2goKHByb3ApID0+IHtcbiAgICAgICAgICAgICAgICBwcm9wLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX2JpbmRpbmdMaXN0ZW5lcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2JpbmRpbmdTb3VyY2VzID0gW107XG4gICAgICAgICAgICB0aGlzLmludmFsaWRhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVuYmluZChwcm9wZXJ0eTogSVByb3BlcnR5PGFueT4pIHtcbiAgICAgICAgICAgIHByb3BlcnR5LnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX2JpbmRpbmdMaXN0ZW5lcik7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLl9iaW5kaW5nU291cmNlcy5pbmRleE9mKHByb3BlcnR5KTtcbiAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmluZGluZ1NvdXJjZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW52YWxpZGF0ZSgpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLl9ub3RpZnlMaXN0ZW5lcnNPbmNlLnJ1bigpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW52YWxpZGF0ZUlmTmVlZGVkKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl92YWxpZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBmaXJlQ2hhbmdlTGlzdGVuZXJzKCkge1xuICAgICAgICAgICAgdGhpcy5fY2hhbmdlTGlzdGVuZXJzLmZvckVhY2goKGxpc3RlbmVyOiBJQ2hhbmdlTGlzdGVuZXIpID0+IHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcih0aGlzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgS2V5RnJhbWU8VD4ge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICAgICAgcHJpdmF0ZSBfdGltZTogbnVtYmVyLFxuICAgICAgICAgICAgcHJpdmF0ZSBfcHJvcGVydHk6IFByb3BlcnR5PFQ+LFxuICAgICAgICAgICAgcHJpdmF0ZSBfZW5kVmFsdWU6IFQsXG4gICAgICAgICAgICBwcml2YXRlIF9rZXlmcmFtZVJlYWNoZWRMaXN0ZW5lcjogeyAoKTogdm9pZCB9ID0gbnVsbCxcbiAgICAgICAgICAgIHByaXZhdGUgX2ludGVycG9sYXRvcjogSUludGVycG9sYXRvciA9IEludGVycG9sYXRvcnMuTGluZWFyKSB7XG5cbiAgICAgICAgICAgIGlmIChfdGltZSA8IDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoZSB0aW1lIHBhcmFtZXRlciBjYW4gbm90IGJlIHNtYWxsZXIgdGhhbiB6ZXJvLlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoX3Byb3BlcnR5ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoZSBwcm9wZXJ0eSBwYXJhbWV0ZXIgY2FuIG5vdCBiZSBudWxsLlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKF9wcm9wZXJ0eS5yZWFkb25seSkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiQ2FuJ3QgYW5pbWF0ZSBhIHJlYWQtb25seSBwcm9wZXJ0eS5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKF9lbmRWYWx1ZSA9PSBudWxsICYmICFfcHJvcGVydHkubnVsbGFibGUpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIkNhbid0IHNldCBudWxsIHZhbHVlIHRvIGEgbm9uIG51bGxhYmxlIHByb3BlcnR5LlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoX2ludGVycG9sYXRvciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faW50ZXJwb2xhdG9yID0gSW50ZXJwb2xhdG9ycy5MaW5lYXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgdGltZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90aW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHByb3BlcnR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Byb3BlcnR5XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgZW5kVmFsdWUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZW5kVmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgaW50ZXJwb2xhdG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ludGVycG9sYXRvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBrZXlGcmFtZVJlYWNoZWRMaXN0ZW5lcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9rZXlmcmFtZVJlYWNoZWRMaXN0ZW5lcjtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFByb3BlcnR5TGluZTxUPiB7XG5cbiAgICAgICAgcHJpdmF0ZSBfcHJvcGVydHk6IFByb3BlcnR5PFQ+O1xuICAgICAgICBwcml2YXRlIF9zdGFydFRpbWU6IG51bWJlciA9IC0xO1xuICAgICAgICBwcml2YXRlIF9sYXN0UnVuVGltZTogbnVtYmVyID0gLTE7XG4gICAgICAgIHByaXZhdGUgX3ByZXZpb3VzRnJhbWU6IEtleUZyYW1lPFQ+ID0gbnVsbDtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9rZXlGcmFtZXM6IEtleUZyYW1lPFQ+W10pIHtcbiAgICAgICAgICAgIHRoaXMuX3Byb3BlcnR5ID0gX2tleUZyYW1lc1swXS5wcm9wZXJ0eTtcbiAgICAgICAgICAgIHZhciBmaXJzdEZyYW1lOiBLZXlGcmFtZTxUPiA9IF9rZXlGcmFtZXNbMF07XG4gICAgICAgICAgICBpZiAoZmlyc3RGcmFtZS50aW1lID4gMCkge1xuICAgICAgICAgICAgICAgIF9rZXlGcmFtZXMuc3BsaWNlKDAsIDAsIG5ldyBLZXlGcmFtZSgwLCBmaXJzdEZyYW1lLnByb3BlcnR5LCBmaXJzdEZyYW1lLnByb3BlcnR5LnZhbHVlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgc3RhcnRUaW1lKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXJ0VGltZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldCBzdGFydFRpbWUoc3RhcnRUaW1lOiBudW1iZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0VGltZSA9IHN0YXJ0VGltZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFuaW1hdGUoKSB7XG4gICAgICAgICAgICB2YXIgYWN0VGltZSA9IERhdGUubm93KCk7XG5cbiAgICAgICAgICAgIGlmIChhY3RUaW1lID09IHRoaXMuX3N0YXJ0VGltZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG5leHRGcmFtZTogS2V5RnJhbWU8VD4gPSBudWxsO1xuICAgICAgICAgICAgdmFyIGFjdEZyYW1lOiBLZXlGcmFtZTxUPiA9IG51bGw7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2tleUZyYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBmcmFtZSA9IHRoaXMuX2tleUZyYW1lc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgZnI6IEtleUZyYW1lPFQ+ID0gZnJhbWU7XG4gICAgICAgICAgICAgICAgaWYgKGFjdFRpbWUgPj0gdGhpcy5fc3RhcnRUaW1lICsgZnIudGltZSkge1xuICAgICAgICAgICAgICAgICAgICBhY3RGcmFtZSA9IGZyYW1lO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHRGcmFtZSA9IGZyYW1lO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fc3RhcnRUaW1lICsgZnIudGltZSA+IHRoaXMuX2xhc3RSdW5UaW1lICYmIHRoaXMuX3N0YXJ0VGltZSArIGZyLnRpbWUgPD0gYWN0VGltZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZnIua2V5RnJhbWVSZWFjaGVkTGlzdGVuZXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnIua2V5RnJhbWVSZWFjaGVkTGlzdGVuZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGFjdEZyYW1lICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAobmV4dEZyYW1lICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBvcyA9ICgoYWN0VGltZSAtIHRoaXMuX3N0YXJ0VGltZSAtIGFjdEZyYW1lLnRpbWUpKSAvIChuZXh0RnJhbWUudGltZSAtIGFjdEZyYW1lLnRpbWUpO1xuICAgICAgICAgICAgICAgICAgICBhY3RGcmFtZS5wcm9wZXJ0eS52YWx1ZSA9IGFjdEZyYW1lLnByb3BlcnR5LmFuaW1hdGUocG9zLCBhY3RGcmFtZS5lbmRWYWx1ZSwgbmV4dEZyYW1lLmVuZFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhY3RGcmFtZS5wcm9wZXJ0eS52YWx1ZSA9IGFjdEZyYW1lLmVuZFZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fbGFzdFJ1blRpbWUgPSBhY3RUaW1lO1xuXG4gICAgICAgICAgICByZXR1cm4gYWN0VGltZSA+PSB0aGlzLl9zdGFydFRpbWUgKyB0aGlzLl9rZXlGcmFtZXNbdGhpcy5fa2V5RnJhbWVzLmxlbmd0aCAtIDFdLnRpbWU7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBJSW50ZXJwb2xhdG9yIHtcbiAgICAgICAgKHZhbHVlOiBudW1iZXIpOiBudW1iZXI7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEludGVycG9sYXRvcnMge1xuICAgICAgICBzdGF0aWMgZ2V0IExpbmVhcigpOiBJSW50ZXJwb2xhdG9yIHtcbiAgICAgICAgICAgIHJldHVybiAodmFsdWU6IG51bWJlcik6IG51bWJlciA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFBbmltYXRvciB7XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgYW5pbWF0b3JzOiBBQW5pbWF0b3JbXSA9IFtdO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBBTklNQVRPUl9UQVNLID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgQUFuaW1hdG9yLmFuaW1hdGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBwcml2YXRlIHN0YXJ0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgICAgICBzdGF0aWMgYW5pbWF0ZSgpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBBQW5pbWF0b3IuYW5pbWF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgaWYgKEFBbmltYXRvci5hbmltYXRvcnMubGVuZ3RoIDw9IGkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBhbmltYXRvcjogQUFuaW1hdG9yID0gQUFuaW1hdG9yLmFuaW1hdG9yc1tpXTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBhbmltYXRvci5vbkFuaW1hdGUoKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoICh0KSB7XG4gICAgICAgICAgICAgICAgICAgIG5ldyBDb25zb2xlKCkuZXJyb3IodCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoQUFuaW1hdG9yLmFuaW1hdG9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgRXZlbnRRdWV1ZS5JbnN0YW5jZS5pbnZva2VMYXRlcihBQW5pbWF0b3IuQU5JTUFUT1JfVEFTSyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzdGFydCgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXJ0ZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIEFBbmltYXRvci5hbmltYXRvcnMucHVzaCh0aGlzKTtcbiAgICAgICAgICAgIGlmIChBQW5pbWF0b3IuYW5pbWF0b3JzLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgRXZlbnRRdWV1ZS5JbnN0YW5jZS5pbnZva2VMYXRlcihBQW5pbWF0b3IuQU5JTUFUT1JfVEFTSyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcCgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5zdGFydGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgdmFyIGlkeCA9IEFBbmltYXRvci5hbmltYXRvcnMuaW5kZXhPZih0aGlzKTtcbiAgICAgICAgICAgIEFBbmltYXRvci5hbmltYXRvcnMuc3BsaWNlKGlkeCwgMSlcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBTdGFydGVkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhcnRlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBTdG9wcGVkKCkge1xuICAgICAgICAgICAgcmV0dXJuICF0aGlzLnN0YXJ0ZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgYWJzdHJhY3Qgb25BbmltYXRlKCk6IHZvaWQ7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFRpbWVsaW5lIGV4dGVuZHMgQUFuaW1hdG9yIHtcblxuXG4gICAgICAgIHByaXZhdGUgcHJvcGVydHlMaW5lczogUHJvcGVydHlMaW5lPGFueT5bXSA9IFtdO1xuICAgICAgICBwcml2YXRlIHJlcGVhdENvdW50ID0gMDtcbiAgICAgICAgcHJpdmF0ZSBmaW5pc2hlZEV2ZW50OiBFdmVudDxUaW1lbGluZUZpbmlzaGVkRXZlbnRBcmdzPiA9IG5ldyBFdmVudDxUaW1lbGluZUZpbmlzaGVkRXZlbnRBcmdzPigpO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUga2V5RnJhbWVzOiBLZXlGcmFtZTxhbnk+W10pIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICBjcmVhdGVQcm9wZXJ0eUxpbmVzKCkge1xuICAgICAgICAgICAgdmFyIHBsTWFwOiB7IFtrZXk6IHN0cmluZ106IEtleUZyYW1lPGFueT5bXSB9ID0ge307XG4gICAgICAgICAgICB2YXIga2V5czogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5rZXlGcmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQga2V5RnJhbWUgPSB0aGlzLmtleUZyYW1lc1tpXTtcbiAgICAgICAgICAgICAgICBsZXQga2Y6IEtleUZyYW1lPGFueT4gPSBrZXlGcmFtZTtcbiAgICAgICAgICAgICAgICBsZXQgcHJvcGVydHlMaW5lID0gcGxNYXBba2YucHJvcGVydHkuaWRdO1xuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eUxpbmUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eUxpbmUgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgcGxNYXBba2YucHJvcGVydHkuaWRdID0gcHJvcGVydHlMaW5lO1xuICAgICAgICAgICAgICAgICAgICBrZXlzLnB1c2goa2YucHJvcGVydHkuaWQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eUxpbmUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydHlMaW5lW3Byb3BlcnR5TGluZS5sZW5ndGggLSAxXS50aW1lID49IGtmLnRpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIGtleWZyYW1lcyBtdXN0IGJlIGluIGFzY2VuZGluZyB0aW1lIG9yZGVyIHBlciBwcm9wZXJ0eS5cIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwcm9wZXJ0eUxpbmUucHVzaChrZXlGcmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBrZXlzLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBwcm9wZXJ0eUxpbmU6IFByb3BlcnR5TGluZTxhbnk+ID0gcGxNYXBba2V5XVswXS5wcm9wZXJ0eS5jcmVhdGVQcm9wZXJ0eUxpbmUocGxNYXBba2V5XSk7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eUxpbmVzLnB1c2gocHJvcGVydHlMaW5lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhcnQocmVwZWF0Q291bnQ6IG51bWJlciA9IDApIHtcbiAgICAgICAgICAgIGlmIChyZXBlYXRDb3VudCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmVwZWF0Q291bnQgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVwZWF0Q291bnQgPSByZXBlYXRDb3VudCB8IDA7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVByb3BlcnR5TGluZXMoKTtcbiAgICAgICAgICAgIHRoaXMucmVwZWF0Q291bnQgPSByZXBlYXRDb3VudDtcbiAgICAgICAgICAgIHZhciBzdGFydFRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eUxpbmVzLmZvckVhY2goKHByb3BlcnR5TGluZSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBwbDogUHJvcGVydHlMaW5lPGFueT4gPSBwcm9wZXJ0eUxpbmU7XG4gICAgICAgICAgICAgICAgcGwuc3RhcnRUaW1lID0gc3RhcnRUaW1lO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzdXBlci5zdGFydCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcCgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5TdGFydGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3VwZXIuc3RvcCgpO1xuICAgICAgICAgICAgdGhpcy5maW5pc2hlZEV2ZW50LmZpcmVFdmVudChuZXcgVGltZWxpbmVGaW5pc2hlZEV2ZW50QXJncyh0cnVlKSk7XG4gICAgICAgIH1cblxuICAgICAgICBvbkFuaW1hdGUoKSB7XG4gICAgICAgICAgICB2YXIgZmluaXNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eUxpbmVzLmZvckVhY2goKHByb3BlcnR5TGluZSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBwbDogUHJvcGVydHlMaW5lPGFueT4gPSBwcm9wZXJ0eUxpbmU7XG4gICAgICAgICAgICAgICAgZmluaXNoZWQgPSBmaW5pc2hlZCAmJiBwbC5hbmltYXRlKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKGZpbmlzaGVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmVwZWF0Q291bnQgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzdGFydFRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnR5TGluZXMuZm9yRWFjaCgocHJvcGVydHlMaW5lKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGw6IFByb3BlcnR5TGluZTxhbnk+ID0gcHJvcGVydHlMaW5lO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGwuc3RhcnRUaW1lID0gc3RhcnRUaW1lO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlcGVhdENvdW50LS07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlcGVhdENvdW50ID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdGFydFRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eUxpbmVzLmZvckVhY2goKHByb3BlcnR5TGluZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwbDogUHJvcGVydHlMaW5lPGFueT4gPSBwcm9wZXJ0eUxpbmU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGwuc3RhcnRUaW1lID0gc3RhcnRUaW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdXBlci5zdG9wKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbmlzaGVkRXZlbnQuZmlyZUV2ZW50KG5ldyBUaW1lbGluZUZpbmlzaGVkRXZlbnRBcmdzKGZhbHNlKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBvbkZpbmlzaGVkRXZlbnQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5maW5pc2hlZEV2ZW50O1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgVGltZWxpbmVGaW5pc2hlZEV2ZW50QXJncyB7XG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgc3RvcHBlZDogYm9vbGVhbiA9IGZhbHNlKSB7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBTdG9wcGVkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RvcHBlZDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBOdW1iZXJQcm9wZXJ0eSBleHRlbmRzIFByb3BlcnR5PG51bWJlcj4ge1xuXG4gICAgICAgIGFuaW1hdGUocG9zOiBudW1iZXIsIHN0YXJ0VmFsdWU6IG51bWJlciwgZW5kVmFsdWU6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgICAgICByZXR1cm4gc3RhcnRWYWx1ZSArICgoZW5kVmFsdWUgLSBzdGFydFZhbHVlKSAqIHBvcyk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBTdHJpbmdQcm9wZXJ0eSBleHRlbmRzIFByb3BlcnR5PHN0cmluZz4ge1xuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFBhZGRpbmdQcm9wZXJ0eSBleHRlbmRzIFByb3BlcnR5PFBhZGRpbmc+IHtcblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBCb3JkZXJQcm9wZXJ0eSBleHRlbmRzIFByb3BlcnR5PEJvcmRlcj4ge1xuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEJhY2tncm91bmRQcm9wZXJ0eSBleHRlbmRzIFByb3BlcnR5PEFCYWNrZ3JvdW5kPiB7XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQm9vbGVhblByb3BlcnR5IGV4dGVuZHMgUHJvcGVydHk8Ym9vbGVhbj4ge1xuXG4gICAgfVxuICAgIFxuICAgIGV4cG9ydCBjbGFzcyBDb2xvclByb3BlcnR5IGV4dGVuZHMgUHJvcGVydHk8Q29sb3I+IHtcblxuICAgIH1cblxufVxuXG5cbiIsIlxuXG5tb2R1bGUgY3ViZWUge1xuXG4gICAgZXhwb3J0IGludGVyZmFjZSBJU3R5bGUge1xuXG4gICAgICAgIGFwcGx5KGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogdm9pZDtcblxuICAgIH1cblxuICAgIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBQmFja2dyb3VuZCBpbXBsZW1lbnRzIElTdHlsZSB7XG5cbiAgICAgICAgYWJzdHJhY3QgYXBwbHkoZWxlbWVudDogSFRNTEVsZW1lbnQpOiB2b2lkO1xuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIENvbG9yIHtcblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfVFJBTlNQQVJFTlQgPSBDb2xvci5nZXRBcmdiQ29sb3IoMHgwMDAwMDAwMCk7XG4gICAgICAgIHN0YXRpYyBnZXQgVFJBTlNQQVJFTlQoKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29sb3IuX1RSQU5TUEFSRU5UO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1dISVRFID0gQ29sb3IuZ2V0QXJnYkNvbG9yKDB4ZmZmZmZmZmYpO1xuICAgICAgICBzdGF0aWMgZ2V0IFdISVRFKCkge1xuICAgICAgICAgICAgcmV0dXJuIENvbG9yLl9XSElURTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9CTEFDSyA9IENvbG9yLmdldEFyZ2JDb2xvcigweGZmMDAwMDAwKTtcbiAgICAgICAgc3RhdGljIGdldCBCTEFDSygpIHtcbiAgICAgICAgICAgIHJldHVybiBDb2xvci5fQkxBQ0s7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTElHSFRfR1JBWSA9IENvbG9yLmdldEFyZ2JDb2xvcigweGZmY2NjY2NjKTtcbiAgICAgICAgc3RhdGljIGdldCBMSUdIVF9HUkFZKCkge1xuICAgICAgICAgICAgcmV0dXJuIENvbG9yLl9MSUdIVF9HUkFZO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBnZXRBcmdiQ29sb3IoYXJnYjogbnVtYmVyKTogQ29sb3Ige1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb2xvcihhcmdiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZ2V0QXJnYkNvbG9yQnlDb21wb25lbnRzKGFscGhhOiBudW1iZXIsIHJlZDogbnVtYmVyLCBncmVlbjogbnVtYmVyLCBibHVlOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGFscGhhID0gdGhpcy5maXhDb21wb25lbnQoYWxwaGEpO1xuICAgICAgICAgICAgcmVkID0gdGhpcy5maXhDb21wb25lbnQocmVkKTtcbiAgICAgICAgICAgIGdyZWVuID0gdGhpcy5maXhDb21wb25lbnQoZ3JlZW4pO1xuICAgICAgICAgICAgYmx1ZSA9IHRoaXMuZml4Q29tcG9uZW50KGJsdWUpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRBcmdiQ29sb3IoXG4gICAgICAgICAgICAgICAgYWxwaGEgPDwgMjRcbiAgICAgICAgICAgICAgICB8IHJlZCA8PCAxNlxuICAgICAgICAgICAgICAgIHwgZ3JlZW4gPDwgOFxuICAgICAgICAgICAgICAgIHwgYmx1ZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZ2V0UmdiQ29sb3IocmdiOiBudW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEFyZ2JDb2xvcihyZ2IgfCAweGZmMDAwMDAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZ2V0UmdiQ29sb3JCeUNvbXBvbmVudHMocmVkOiBudW1iZXIsIGdyZWVuOiBudW1iZXIsIGJsdWU6IG51bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QXJnYkNvbG9yQnlDb21wb25lbnRzKDI1NSwgcmVkLCBncmVlbiwgYmx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBmaXhDb21wb25lbnQoY29tcG9uZW50OiBudW1iZXIpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudCA9IGNvbXBvbmVudCB8IDA7XG4gICAgICAgICAgICBpZiAoY29tcG9uZW50IDwgMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY29tcG9uZW50ID4gMjU1KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDI1NTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZmFkZUNvbG9ycyhzdGFydENvbG9yOiBDb2xvciwgZW5kQ29sb3I6IENvbG9yLCBmYWRlUG9zaXRpb246IG51bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIENvbG9yLmdldEFyZ2JDb2xvckJ5Q29tcG9uZW50cyhcbiAgICAgICAgICAgICAgICB0aGlzLm1peENvbXBvbmVudChzdGFydENvbG9yLmFscGhhLCBlbmRDb2xvci5hbHBoYSwgZmFkZVBvc2l0aW9uKSxcbiAgICAgICAgICAgICAgICB0aGlzLm1peENvbXBvbmVudChzdGFydENvbG9yLnJlZCwgZW5kQ29sb3IucmVkLCBmYWRlUG9zaXRpb24pLFxuICAgICAgICAgICAgICAgIHRoaXMubWl4Q29tcG9uZW50KHN0YXJ0Q29sb3IuZ3JlZW4sIGVuZENvbG9yLmdyZWVuLCBmYWRlUG9zaXRpb24pLFxuICAgICAgICAgICAgICAgIHRoaXMubWl4Q29tcG9uZW50KHN0YXJ0Q29sb3IuYmx1ZSwgZW5kQ29sb3IuYmx1ZSwgZmFkZVBvc2l0aW9uKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIG1peENvbXBvbmVudChzdGFydFZhbHVlOiBudW1iZXIsIGVuZFZhbHVlOiBudW1iZXIsIHBvczogbnVtYmVyKSB7XG4gICAgICAgICAgICB2YXIgcmVzID0gKHN0YXJ0VmFsdWUgKyAoKGVuZFZhbHVlIC0gc3RhcnRWYWx1ZSkgKiBwb3MpKSB8IDA7XG4gICAgICAgICAgICByZXMgPSB0aGlzLmZpeENvbXBvbmVudChyZXMpO1xuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX2FyZ2IgPSAwO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGFyZ2I6IG51bWJlcikge1xuICAgICAgICAgICAgYXJnYiA9IGFyZ2IgfCAwO1xuICAgICAgICAgICAgdGhpcy5fYXJnYiA9IGFyZ2I7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgYXJnYigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hcmdiO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGFscGhhKCkge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLl9hcmdiID4+PiAyNCkgJiAweGZmO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHJlZCgpIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5fYXJnYiA+Pj4gMTYpICYgMHhmZjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBncmVlbigpIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5fYXJnYiA+Pj4gOCkgJiAweGZmO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGJsdWUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYXJnYiAmIDB4ZmY7XG4gICAgICAgIH1cblxuICAgICAgICBmYWRlKGZhZGVDb2xvcjogQ29sb3IsIGZhZGVQb3NpdGlvbjogbnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29sb3IuZmFkZUNvbG9ycyh0aGlzLCBmYWRlQ29sb3IsIGZhZGVQb3NpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICB0b0NTUygpIHtcbiAgICAgICAgICAgIHJldHVybiBcInJnYmEoXCIgKyB0aGlzLnJlZCArIFwiLCBcIiArIHRoaXMuZ3JlZW4gKyBcIiwgXCIgKyB0aGlzLmJsdWUgKyBcIiwgXCIgKyAodGhpcy5hbHBoYSAvIDI1NS4wKSArIFwiKVwiO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQ29sb3JCYWNrZ3JvdW5kIGV4dGVuZHMgQUJhY2tncm91bmQge1xuXG4gICAgICAgIHByaXZhdGUgX2NvbG9yOiBDb2xvciA9IG51bGw7XG4gICAgICAgIHByaXZhdGUgX2NhY2hlOiBzdHJpbmcgPSBudWxsO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNvbG9yOiBDb2xvcikge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgICAgIHRoaXMuX2NvbG9yID0gY29sb3I7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgY29sb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY29sb3I7XG4gICAgICAgIH1cblxuICAgICAgICBhcHBseShlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2NhY2hlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuX2NhY2hlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY29sb3IgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYmFja2dyb3VuZENvbG9yXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlID0gdGhpcy5fY29sb3IudG9DU1MoKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLl9jYWNoZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBQYWRkaW5nIGltcGxlbWVudHMgSVN0eWxlIHtcblxuICAgICAgICBzdGF0aWMgY3JlYXRlKHBhZGRpbmc6IG51bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQYWRkaW5nKHBhZGRpbmcsIHBhZGRpbmcsIHBhZGRpbmcsIHBhZGRpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IoXG4gICAgICAgICAgICBwcml2YXRlIF9sZWZ0OiBudW1iZXIsXG4gICAgICAgICAgICBwcml2YXRlIF90b3A6IG51bWJlcixcbiAgICAgICAgICAgIHByaXZhdGUgX3JpZ2h0OiBudW1iZXIsXG4gICAgICAgICAgICBwcml2YXRlIF9ib3R0b206IG51bWJlcikgeyB9XG5cbiAgICAgICAgZ2V0IGxlZnQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbGVmdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB0b3AoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdG9wO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHJpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGJvdHRvbSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib3R0b207XG4gICAgICAgIH1cblxuICAgICAgICBhcHBseShlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5wYWRkaW5nTGVmdCA9IHRoaXMuX2xlZnQgKyBcInB4XCI7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLnBhZGRpbmdUb3AgPSB0aGlzLl90b3AgKyBcInB4XCI7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLnBhZGRpbmdSaWdodCA9IHRoaXMuX3JpZ2h0ICsgXCJweFwiO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5wYWRkaW5nQm90dG9tID0gdGhpcy5fYm90dG9tICsgXCJweFwiO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQm9yZGVyIGltcGxlbWVudHMgSVN0eWxlIHtcblxuICAgICAgICBzdGF0aWMgY3JlYXRlKHdpZHRoOiBudW1iZXIsIGNvbG9yOiBDb2xvciwgcmFkaXVzOiBudW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQm9yZGVyKHdpZHRoLCB3aWR0aCwgd2lkdGgsIHdpZHRoLCBjb2xvciwgY29sb3IsIGNvbG9yLCBjb2xvciwgcmFkaXVzLCByYWRpdXMsIHJhZGl1cywgcmFkaXVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICAgICAgcHJpdmF0ZSBfbGVmdFdpZHRoOiBudW1iZXIsXG4gICAgICAgICAgICBwcml2YXRlIF90b3BXaWR0aDogbnVtYmVyLFxuICAgICAgICAgICAgcHJpdmF0ZSBfcmlnaHRXaWR0aDogbnVtYmVyLFxuICAgICAgICAgICAgcHJpdmF0ZSBfYm90dG9tV2lkdGg6IG51bWJlcixcbiAgICAgICAgICAgIHByaXZhdGUgX2xlZnRDb2xvcjogQ29sb3IsXG4gICAgICAgICAgICBwcml2YXRlIF90b3BDb2xvcjogQ29sb3IsXG4gICAgICAgICAgICBwcml2YXRlIF9yaWdodENvbG9yOiBDb2xvcixcbiAgICAgICAgICAgIHByaXZhdGUgX2JvdHRvbUNvbG9yOiBDb2xvcixcbiAgICAgICAgICAgIHByaXZhdGUgX3RvcExlZnRSYWRpdXM6IG51bWJlcixcbiAgICAgICAgICAgIHByaXZhdGUgX3RvcFJpZ2h0UmFkaXVzOiBudW1iZXIsXG4gICAgICAgICAgICBwcml2YXRlIF9ib3R0b21MZWZ0UmFkaXVzOiBudW1iZXIsXG4gICAgICAgICAgICBwcml2YXRlIF9ib3R0b21SaWdodFJhZGl1czogbnVtYmVyKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fbGVmdENvbG9yID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sZWZ0Q29sb3IgPSBDb2xvci5UUkFOU1BBUkVOVDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLl90b3BDb2xvciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdG9wQ29sb3IgPSBDb2xvci5UUkFOU1BBUkVOVDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLl9yaWdodENvbG9yID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yaWdodENvbG9yID0gQ29sb3IuVFJBTlNQQVJFTlQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5fYm90dG9tQ29sb3IgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2JvdHRvbUNvbG9yID0gQ29sb3IuVFJBTlNQQVJFTlQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgbGVmdFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xlZnRXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdG9wV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdG9wV2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHJpZ2h0V2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmlnaHRXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm90dG9tV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYm90dG9tV2lkdGg7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgbGVmdENvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xlZnRDb2xvcjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdG9wQ29sb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdG9wQ29sb3I7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHJpZ2h0Q29sb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmlnaHRDb2xvcjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm90dG9tQ29sb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYm90dG9tQ29sb3I7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgdG9wTGVmdFJhZGl1cygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90b3BMZWZ0UmFkaXVzO1xuICAgICAgICB9XG4gICAgICAgIGdldCB0b3BSaWdodFJhZGl1cygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90b3BSaWdodFJhZGl1cztcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm90dG9tTGVmdFJhZGl1cygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib3R0b21MZWZ0UmFkaXVzO1xuICAgICAgICB9XG4gICAgICAgIGdldCBib3R0b21SaWdodFJhZGl1cygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib3R0b21SaWdodFJhZGl1cztcbiAgICAgICAgfVxuXG4gICAgICAgIGFwcGx5KGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJvcmRlclN0eWxlID0gXCJzb2xpZFwiO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5ib3JkZXJMZWZ0Q29sb3IgPSB0aGlzLl9sZWZ0Q29sb3IudG9DU1MoKTtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuYm9yZGVyTGVmdFdpZHRoID0gdGhpcy5fbGVmdFdpZHRoICsgXCJweFwiO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5ib3JkZXJUb3BDb2xvciA9IHRoaXMuX3RvcENvbG9yLnRvQ1NTKCk7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJvcmRlclRvcFdpZHRoID0gdGhpcy5fdG9wV2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJvcmRlclJpZ2h0Q29sb3IgPSB0aGlzLl9yaWdodENvbG9yLnRvQ1NTKCk7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJvcmRlclJpZ2h0V2lkdGggPSB0aGlzLl9yaWdodFdpZHRoICsgXCJweFwiO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5ib3JkZXJCb3R0b21Db2xvciA9IHRoaXMuX2JvdHRvbUNvbG9yLnRvQ1NTKCk7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJvcmRlckJvdHRvbVdpZHRoID0gdGhpcy5fYm90dG9tV2lkdGggKyBcInB4XCI7XG5cbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuYm9yZGVyVG9wTGVmdFJhZGl1cyA9IHRoaXMuX3RvcExlZnRSYWRpdXMgKyBcInB4XCI7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJvcmRlclRvcFJpZ2h0UmFkaXVzID0gdGhpcy5fdG9wUmlnaHRSYWRpdXMgKyBcInB4XCI7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJvcmRlckJvdHRvbUxlZnRSYWRpdXMgPSB0aGlzLl9ib3R0b21MZWZ0UmFkaXVzICsgXCJweFwiO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5ib3JkZXJCb3R0b21SaWdodFJhZGl1cyA9IHRoaXMuX2JvdHRvbVJpZ2h0UmFkaXVzICsgXCJweFwiO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQm94U2hhZG93IGltcGxlbWVudHMgSVN0eWxlIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgICAgIHByaXZhdGUgX2hQb3M6IG51bWJlcixcbiAgICAgICAgICAgIHByaXZhdGUgX3ZQb3M6IG51bWJlcixcbiAgICAgICAgICAgIHByaXZhdGUgX2JsdXI6IG51bWJlcixcbiAgICAgICAgICAgIHByaXZhdGUgX3NwcmVhZDogbnVtYmVyLFxuICAgICAgICAgICAgcHJpdmF0ZSBfY29sb3I6IENvbG9yLFxuICAgICAgICAgICAgcHJpdmF0ZSBfaW5uZXI6IGJvb2xlYW4pIHsgfVxuXG4gICAgICAgIGdldCBoUG9zKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hQb3M7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgdlBvcygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92UG9zO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGJsdXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYmx1cjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBzcHJlYWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3ByZWFkO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGNvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGlubmVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lubmVyO1xuICAgICAgICB9XG5cbiAgICAgICAgYXBwbHkoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuYm94U2hhZG93ID0gdGhpcy5faFBvcyArIFwicHggXCIgKyB0aGlzLl92UG9zICsgXCJweCBcIiArIHRoaXMuX2JsdXIgKyBcInB4IFwiICsgdGhpcy5fc3ByZWFkICsgXCJweCBcIlxuICAgICAgICAgICAgKyB0aGlzLl9jb2xvci50b0NTUygpICsgKHRoaXMuX2lubmVyID8gXCIgaW5zZXRcIiA6IFwiXCIpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRVRleHRPdmVyZmxvdyBpbXBsZW1lbnRzIElTdHlsZSB7XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0NMSVAgPSBuZXcgRVRleHRPdmVyZmxvdyhcImNsaXBcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9FTExJUFNJUyA9IG5ldyBFVGV4dE92ZXJmbG93KFwiZWxsaXBzaXNcIik7XG5cbiAgICAgICAgc3RhdGljIGdldCBDTElQKCkge1xuICAgICAgICAgICAgcmV0dXJuIEVUZXh0T3ZlcmZsb3cuX0NMSVA7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0aWMgZ2V0IEVMTElQU0lTKCkge1xuICAgICAgICAgICAgcmV0dXJuIEVUZXh0T3ZlcmZsb3cuX0VMTElQU0lTO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBfY3NzOiBzdHJpbmcpIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBDU1MoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY3NzO1xuICAgICAgICB9XG5cbiAgICAgICAgYXBwbHkoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudGV4dE92ZXJmbG93ID0gdGhpcy5fY3NzO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRVRleHRBbGlnbiBpbXBsZW1lbnRzIElTdHlsZSB7XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0xFRlQgPSBuZXcgRVRleHRBbGlnbihcImxlZnRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DRU5URVIgPSBuZXcgRVRleHRBbGlnbihcImNlbnRlclwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1JJR0hUID0gbmV3IEVUZXh0QWxpZ24oXCJyaWdodFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0pVU1RJRlkgPSBuZXcgRVRleHRBbGlnbihcImp1c3RpZnlcIik7XG5cbiAgICAgICAgc3RhdGljIGdldCBMRUZUKCkge1xuICAgICAgICAgICAgcmV0dXJuIEVUZXh0QWxpZ24uX0xFRlQ7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0aWMgZ2V0IENFTlRFUigpIHtcbiAgICAgICAgICAgIHJldHVybiBFVGV4dEFsaWduLl9DRU5URVI7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0aWMgZ2V0IFJJR0hUKCkge1xuICAgICAgICAgICAgcmV0dXJuIEVUZXh0QWxpZ24uX1JJR0hUO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIGdldCBKVVNUSUZZKCkge1xuICAgICAgICAgICAgcmV0dXJuIEVUZXh0QWxpZ24uX0pVU1RJRlk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jc3M6IHN0cmluZykge1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IENTUygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jc3M7XG4gICAgICAgIH1cblxuICAgICAgICBhcHBseShlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS50ZXh0QWxpZ24gPSB0aGlzLl9jc3M7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBFSEFsaWduIHtcblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTEVGVCA9IG5ldyBFSEFsaWduKFwibGVmdFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0NFTlRFUiA9IG5ldyBFSEFsaWduKFwiY2VudGVyXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUklHSFQgPSBuZXcgRUhBbGlnbihcInJpZ2h0XCIpO1xuXG4gICAgICAgIHN0YXRpYyBnZXQgTEVGVCgpIHtcbiAgICAgICAgICAgIHJldHVybiBFSEFsaWduLl9MRUZUO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIGdldCBDRU5URVIoKSB7XG4gICAgICAgICAgICByZXR1cm4gRUhBbGlnbi5fQ0VOVEVSO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIGdldCBSSUdIVCgpIHtcbiAgICAgICAgICAgIHJldHVybiBFSEFsaWduLl9SSUdIVDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2Nzczogc3RyaW5nKSB7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQ1NTKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NzcztcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEVWQWxpZ24ge1xuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9UT1AgPSBuZXcgRVZBbGlnbihcInRvcFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX01JRERMRSA9IG5ldyBFVkFsaWduKFwibWlkZGxlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQk9UVE9NID0gbmV3IEVWQWxpZ24oXCJib3R0b21cIik7XG5cbiAgICAgICAgc3RhdGljIGdldCBUT1AoKSB7XG4gICAgICAgICAgICByZXR1cm4gRVZBbGlnbi5fVE9QO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIGdldCBNSURETEUoKSB7XG4gICAgICAgICAgICByZXR1cm4gRVZBbGlnbi5fTUlERExFO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIGdldCBCT1RUT00oKSB7XG4gICAgICAgICAgICByZXR1cm4gRVZBbGlnbi5fQk9UVE9NO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBfY3NzOiBzdHJpbmcpIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBDU1MoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY3NzO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRm9udEZhbWlseSBpbXBsZW1lbnRzIElTdHlsZSB7XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX2FyaWFsID0gbmV3IEZvbnRGYW1pbHkoXCJBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmXCIpO1xuICAgICAgICBwdWJsaWMgc3RhdGljIGdldCBBcmlhbCgpIHtcbiAgICAgICAgICAgIHJldHVybiBGb250RmFtaWx5Ll9hcmlhbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGluaXRpYWxpemVkID0gZmFsc2U7XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgaW5pdEZvbnRDb250YWluZXJTdHlsZSgpIHtcbiAgICAgICAgICAgIHZhciB3bmQ6IGFueSA9IHdpbmRvdztcbiAgICAgICAgICAgIHduZC5mb250c1N0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICAgICAgICAgICAgd25kLmZvbnRzU3R5bGUudHlwZSA9IFwidGV4dC9jc3NcIjtcbiAgICAgICAgICAgIHZhciBkb2M6IGFueSA9IGRvY3VtZW50O1xuICAgICAgICAgICAgZG9jLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXS5hcHBlbmRDaGlsZCh3bmQuZm9udHNTdHlsZSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlZ2lzdGVyRm9udChuYW1lOiBzdHJpbmcsIHNyYzogc3RyaW5nLCBleHRyYTogc3RyaW5nKSB7XG4gICAgICAgICAgICB2YXIgZXggPSBleHRyYTtcbiAgICAgICAgICAgIGlmIChleCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZXggPSAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBjdCA9IFwiQGZvbnQtZmFjZSB7Zm9udC1mYW1pbHk6ICdcIiArIG5hbWUgKyBcIic7IHNyYzogdXJsKCdcIiArIHNyYyArIFwiJyk7XCIgKyBleCArIFwifVwiO1xuICAgICAgICAgICAgdmFyIGloID0gKDxhbnk+d2luZG93KS5mb250c1N0eWxlLmlubmVySFRNTDtcbiAgICAgICAgICAgIGlmIChpaCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWggPSAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICg8YW55PndpbmRvdykuZm9udHNTdHlsZS5pbm5lckhUTUwgPSBpaCArIGN0O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBfY3NzOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIGlmICghRm9udEZhbWlseS5pbml0aWFsaXplZCkge1xuICAgICAgICAgICAgICAgIEZvbnRGYW1pbHkuaW5pdEZvbnRDb250YWluZXJTdHlsZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IENTUygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jc3M7XG4gICAgICAgIH1cblxuICAgICAgICBhcHBseShlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5mb250RmFtaWx5ID0gdGhpcy5fY3NzO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRUN1cnNvciB7XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgYXV0byA9IG5ldyBFQ3Vyc29yKFwiYXV0b1wiKTtcbiAgICAgICAgc3RhdGljIGdldCBBVVRPKCkge1xuICAgICAgICAgICAgcmV0dXJuIEVDdXJzb3IuYXV0bztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2Nzczogc3RyaW5nKSB7IH1cblxuICAgICAgICBnZXQgY3NzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NzcztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBlbnVtIEVTY3JvbGxCYXJQb2xpY3kge1xuXG4gICAgICAgIFZJU0lCTEUsXG4gICAgICAgIEFVVE8sXG4gICAgICAgIEhJRERFTlxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGVudW0gRVBpY3R1cmVTaXplTW9kZSB7XG5cbiAgICAgICAgTk9STUFMLFxuICAgICAgICBDRU5URVIsXG4gICAgICAgIFNUUkVUQ0gsXG4gICAgICAgIEZJTEwsXG4gICAgICAgIFpPT00sXG4gICAgICAgIEZJVF9XSURUSCxcbiAgICAgICAgRklUX0hFSUdIVFxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEltYWdlIGltcGxlbWVudHMgSVN0eWxlIHtcblxuICAgICAgICBwcml2YXRlIF9vbkxvYWQgPSBuZXcgRXZlbnQ8RXZlbnRBcmdzPigpO1xuXG4gICAgICAgIHByaXZhdGUgX3dpZHRoID0gMDtcbiAgICAgICAgcHJpdmF0ZSBfaGVpZ2h0ID0gMDtcbiAgICAgICAgcHJpdmF0ZSBfbG9hZGVkID0gZmFsc2U7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBfdXJsOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIGlmIChfdXJsID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoZSB1cmwgcGFyYW1ldGVyIGNhbiBub3QgYmUgbnVsbC5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBlID0gPEhUTUxJbWFnZUVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICAgICAgICAgIGUuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX3dpZHRoID0gZS53aWR0aDtcbiAgICAgICAgICAgICAgICB0aGlzLl9oZWlnaHQgPSBlLmhlaWdodDtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2FkZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX29uTG9hZC5maXJlRXZlbnQobmV3IEV2ZW50QXJncyh0aGlzKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGUuc3JjID0gX3VybDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB1cmwoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdXJsO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IG9uTG9hZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbkxvYWQ7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgd2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgaGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBsb2FkZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbG9hZGVkO1xuICAgICAgICB9XG5cbiAgICAgICAgYXBwbHkoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwic3JjXCIsIHRoaXMudXJsKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG59XG5cblxuIiwibW9kdWxlIGN1YmVlIHtcbiAgICBcbiAgICBleHBvcnQgaW50ZXJmYWNlIElSdW5uYWJsZSB7XG4gICAgICAgICgpOiB2b2lkO1xuICAgIH1cbiAgICBcbiAgICBleHBvcnQgY2xhc3MgUG9pbnQyRCB7XG4gICAgICAgIFxuICAgICAgICBjb25zdHJ1Y3RvciAocHJpdmF0ZSBfeDogbnVtYmVyLCBwcml2YXRlIF95OiBudW1iZXIpIHtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBnZXQgeCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl94O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBnZXQgeSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl95O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH1cbiAgICBcbn1cblxuXG4iLCJtb2R1bGUgY3ViZWUge1xuICAgIFxuICAgIGV4cG9ydCBjbGFzcyBMYXlvdXRDaGlsZHJlbiB7XG4gICAgICAgIHByaXZhdGUgY2hpbGRyZW46IEFDb21wb25lbnRbXSA9IFtdO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcGFyZW50OiBBTGF5b3V0KSB7XG4gICAgICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZChjb21wb25lbnQ6IEFDb21wb25lbnQpIHtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQucGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgY29tcG9uZW50IGlzIGFscmVhZHkgYSBjaGlsZCBvZiBhIGxheW91dC5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29tcG9uZW50Ll9zZXRQYXJlbnQodGhpcy5wYXJlbnQpO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5vblBhcmVudENoYW5nZWQuZmlyZUV2ZW50KG5ldyBQYXJlbnRDaGFuZ2VkRXZlbnRBcmdzKHRoaXMucGFyZW50LCBjb21wb25lbnQpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNvbXBvbmVudCk7XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5fb25DaGlsZEFkZGVkKGNvbXBvbmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbnNlcnQoaW5kZXg6IG51bWJlciwgY29tcG9uZW50OiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICBpZiAoY29tcG9uZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LnBhcmVudCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIGNvbXBvbmVudCBpcyBhbHJlYWR5IGEgY2hpbGQgb2YgYSBsYXlvdXQuXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbmV3Q2hpbGRyZW46IEFDb21wb25lbnRbXSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgICAgICAgICAgIG5ld0NoaWxkcmVuLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBuZXdDaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDAsIGNvbXBvbmVudCk7XG5cbiAgICAgICAgICAgIC8vIFRPRE8gVkVSWSBJTkVGRUNUSVZFXG4gICAgICAgICAgICB0aGlzLmNsZWFyKCk7XG5cbiAgICAgICAgICAgIG5ld0NoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGQoY2hpbGQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmVDb21wb25lbnQoY29tcG9uZW50OiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICB2YXIgaWR4ID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKGNvbXBvbmVudCk7XG4gICAgICAgICAgICBpZiAoaWR4IDwgMCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIGdpdmVuIGNvbXBvbmVudCBpc24ndCBhIGNoaWxkIG9mIHRoaXMgbGF5b3V0LlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yZW1vdmVJbmRleChpZHgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlSW5kZXgoaW5kZXg6IG51bWJlcikge1xuICAgICAgICAgICAgdmFyIHJlbW92ZWRDb21wb25lbnQ6IEFDb21wb25lbnQgPSB0aGlzLmNoaWxkcmVuW2luZGV4XTtcbiAgICAgICAgICAgIGlmIChyZW1vdmVkQ29tcG9uZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZW1vdmVkQ29tcG9uZW50Ll9zZXRQYXJlbnQobnVsbCk7XG4gICAgICAgICAgICAgICAgcmVtb3ZlZENvbXBvbmVudC5vblBhcmVudENoYW5nZWQuZmlyZUV2ZW50KG5ldyBQYXJlbnRDaGFuZ2VkRXZlbnRBcmdzKG51bGwsIHJlbW92ZWRDb21wb25lbnQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucGFyZW50Ll9vbkNoaWxkUmVtb3ZlZChyZW1vdmVkQ29tcG9uZW50LCBpbmRleCk7XG4gICAgICAgIH1cblxuICAgICAgICBjbGVhcigpIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZC5fc2V0UGFyZW50KG51bGwpO1xuICAgICAgICAgICAgICAgICAgICBjaGlsZC5vblBhcmVudENoYW5nZWQuZmlyZUV2ZW50KG5ldyBQYXJlbnRDaGFuZ2VkRXZlbnRBcmdzKG51bGwsIGNoaWxkKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5fb25DaGlsZHJlbkNsZWFyZWQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldChpbmRleDogbnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbltpbmRleF1cbiAgICAgICAgfVxuXG4gICAgICAgIGluZGV4T2YoY29tcG9uZW50OiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5pbmRleE9mKGNvbXBvbmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBzaXplKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxufVxuXG5cbiIsIm1vZHVsZSBjdWJlZSB7XG4gICAgXG4gICAgZXhwb3J0IGNsYXNzIE1vdXNlRXZlbnRUeXBlcyB7XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBNT1VTRV9ET1dOID0gMDtcbiAgICAgICAgcHVibGljIHN0YXRpYyBNT1VTRV9NT1ZFID0gMTtcbiAgICAgICAgcHVibGljIHN0YXRpYyBNT1VTRV9VUCA9IDI7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgTU9VU0VfRU5URVIgPSAzO1xuICAgICAgICBwdWJsaWMgc3RhdGljIE1PVVNFX0xFQVZFID0gNDtcbiAgICAgICAgcHVibGljIHN0YXRpYyBNT1VTRV9XSEVFTCA9IDU7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7IH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBQ29tcG9uZW50IHtcblxuICAgICAgICBwcml2YXRlIF90cmFuc2xhdGVYID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3RyYW5zbGF0ZVkgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfcm90YXRlID0gbmV3IE51bWJlclByb3BlcnR5KDAuMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfc2NhbGVYID0gbmV3IE51bWJlclByb3BlcnR5KDEuMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfc2NhbGVZID0gbmV3IE51bWJlclByb3BlcnR5KDEuMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdHJhbnNmb3JtQ2VudGVyWCA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLjUsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3RyYW5zZm9ybUNlbnRlclkgPSBuZXcgTnVtYmVyUHJvcGVydHkoMC41LCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9wYWRkaW5nID0gbmV3IFBhZGRpbmdQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2JvcmRlciA9IG5ldyBCb3JkZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX21lYXN1cmVkV2lkdGggPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIHRydWUpO1xuICAgICAgICBwcml2YXRlIF9tZWFzdXJlZEhlaWdodCA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgIHByaXZhdGUgX2NsaWVudFdpZHRoID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgcHJpdmF0ZSBfY2xpZW50SGVpZ2h0ID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgcHJpdmF0ZSBfYm91bmRzV2lkdGggPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIHRydWUpO1xuICAgICAgICBwcml2YXRlIF9ib3VuZHNIZWlnaHQgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIHRydWUpO1xuICAgICAgICBwcml2YXRlIF9ib3VuZHNMZWZ0ID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgcHJpdmF0ZSBfYm91bmRzVG9wID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgcHJpdmF0ZSBfbWVhc3VyZWRXaWR0aFNldHRlciA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9tZWFzdXJlZEhlaWdodFNldHRlciA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9jbGllbnRXaWR0aFNldHRlciA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9jbGllbnRIZWlnaHRTZXR0ZXIgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYm91bmRzV2lkdGhTZXR0ZXIgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYm91bmRzSGVpZ2h0U2V0dGVyID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2JvdW5kc0xlZnRTZXR0ZXIgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYm91bmRzVG9wU2V0dGVyID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2N1cnNvciA9IG5ldyBQcm9wZXJ0eTxFQ3Vyc29yPihFQ3Vyc29yLkFVVE8sIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3BvaW50ZXJUcmFuc3BhcmVudCA9IG5ldyBQcm9wZXJ0eTxib29sZWFuPihmYWxzZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfaGFuZGxlUG9pbnRlciA9IG5ldyBQcm9wZXJ0eTxib29sZWFuPih0cnVlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF92aXNpYmxlID0gbmV3IFByb3BlcnR5PGJvb2xlYW4+KHRydWUsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2VuYWJsZWQgPSBuZXcgUHJvcGVydHk8Ym9vbGVhbj4odHJ1ZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYWxwaGEgPSBuZXcgTnVtYmVyUHJvcGVydHkoMS4wLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9zZWxlY3RhYmxlID0gbmV3IFByb3BlcnR5PGJvb2xlYW4+KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9taW5XaWR0aCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX21pbkhlaWdodCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX21heFdpZHRoID0gbmV3IE51bWJlclByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfbWF4SGVpZ2h0ID0gbmV3IE51bWJlclByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfaG92ZXJlZCA9IG5ldyBQcm9wZXJ0eTxib29sZWFuPihmYWxzZSwgZmFsc2UsIHRydWUpO1xuICAgICAgICBwcml2YXRlIF9ob3ZlcmVkU2V0dGVyID0gbmV3IFByb3BlcnR5PGJvb2xlYW4+KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9wcmVzc2VkID0gbmV3IFByb3BlcnR5PGJvb2xlYW4+KGZhbHNlLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgIHByaXZhdGUgX3ByZXNzZWRTZXR0ZXIgPSBuZXcgUHJvcGVydHk8Ym9vbGVhbj4oZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX29uQ2xpY2sgPSBuZXcgRXZlbnQ8TW91c2VFdmVudD4oKTtcbiAgICAgICAgcHJpdmF0ZSBfb25Nb3VzZURvd24gPSBuZXcgRXZlbnQ8TW91c2VFdmVudD4oKTtcbiAgICAgICAgcHJpdmF0ZSBfb25Nb3VzZURyYWcgPSBuZXcgRXZlbnQ8TW91c2VFdmVudD4oKTtcbiAgICAgICAgcHJpdmF0ZSBfb25Nb3VzZU1vdmUgPSBuZXcgRXZlbnQ8TW91c2VFdmVudD4oKTtcbiAgICAgICAgcHJpdmF0ZSBfb25Nb3VzZVVwID0gbmV3IEV2ZW50PE1vdXNlRXZlbnQ+KCk7XG4gICAgICAgIHByaXZhdGUgX29uTW91c2VFbnRlciA9IG5ldyBFdmVudDxNb3VzZUV2ZW50PigpO1xuICAgICAgICBwcml2YXRlIF9vbk1vdXNlTGVhdmUgPSBuZXcgRXZlbnQ8TW91c2VFdmVudD4oKTtcbiAgICAgICAgcHJpdmF0ZSBfb25Nb3VzZVdoZWVsID0gbmV3IEV2ZW50PE1vdXNlRXZlbnQ+KCk7XG4gICAgICAgIHByaXZhdGUgX29uS2V5RG93biA9IG5ldyBFdmVudDxLZXlib2FyZEV2ZW50PigpO1xuICAgICAgICBwcml2YXRlIF9vbktleVByZXNzID0gbmV3IEV2ZW50PEtleWJvYXJkRXZlbnQ+KCk7XG4gICAgICAgIHByaXZhdGUgX29uS2V5VXAgPSBuZXcgRXZlbnQ8S2V5Ym9hcmRFdmVudD4oKTtcbiAgICAgICAgcHJpdmF0ZSBfb25QYXJlbnRDaGFuZ2VkID0gbmV3IEV2ZW50PFBhcmVudENoYW5nZWRFdmVudEFyZ3M+KCk7XG4gICAgICAgIHByaXZhdGUgX29uQ29udGV4dE1lbnUgPSBuZXcgRXZlbnQ8T2JqZWN0PigpO1xuICAgICAgICBwcml2YXRlIF9sZWZ0ID0gMDtcbiAgICAgICAgcHJpdmF0ZSBfdG9wID0gMDtcbiAgICAgICAgcHJpdmF0ZSBfZWxlbWVudDogSFRNTEVsZW1lbnQ7XG4gICAgICAgIHByaXZhdGUgX3BhcmVudDogQUxheW91dDtcbiAgICAgICAgcHVibGljIF9uZWVkc0xheW91dCA9IHRydWU7XG4gICAgICAgIHByaXZhdGUgX2N1YmVlUGFuZWw6IEN1YmVlUGFuZWw7XG4gICAgICAgIHByaXZhdGUgX3RyYW5zZm9ybUNoYW5nZWRMaXN0ZW5lciA9IChzZW5kZXI6IE9iamVjdCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVUcmFuc2Zvcm0oKTtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICB9O1xuICAgICAgICBwcml2YXRlIF9wb3N0Q29uc3RydWN0UnVuT25jZSA9IG5ldyBSdW5PbmNlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucG9zdENvbnN0cnVjdCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiBBQ29tcG9uZXQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSByb290RWxlbWVudCBUaGUgdW5kZXJsYXlpbmcgSFRNTCBlbGVtZW50IHdoaWNoIHRoaXMgY29tcG9uZW50IHdyYXBzLlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RydWN0b3Iocm9vdEVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50ID0gcm9vdEVsZW1lbnQ7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtY3ViZWUtY29tcG9uZW50XCIsIHRoaXMuZ2V0Q2xhc3NOYW1lKCkpO1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5ib3hTaXppbmcgPSBcImJvcmRlci1ib3hcIjtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKFwiZHJhZ2dhYmxlXCIsIFwiZmFsc2VcIik7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5vdXRsaW5lU3R5bGUgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUub3V0bGluZVdpZHRoID0gXCIwcHhcIjtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUubWFyZ2luID0gXCIwcHhcIjtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9IFwiYWxsXCI7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2xhdGVYLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX3RyYW5zZm9ybUNoYW5nZWRMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2xhdGVZLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX3RyYW5zZm9ybUNoYW5nZWRMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLl9yb3RhdGUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fdHJhbnNmb3JtQ2hhbmdlZExpc3RlbmVyKTtcbiAgICAgICAgICAgIHRoaXMuX3NjYWxlWC5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl90cmFuc2Zvcm1DaGFuZ2VkTGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy5fc2NhbGVZLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX3RyYW5zZm9ybUNoYW5nZWRMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2Zvcm1DZW50ZXJYLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX3RyYW5zZm9ybUNoYW5nZWRMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2Zvcm1DZW50ZXJZLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX3RyYW5zZm9ybUNoYW5nZWRMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLl9ob3ZlcmVkLmluaXRSZWFkb25seUJpbmQodGhpcy5faG92ZXJlZFNldHRlcik7XG4gICAgICAgICAgICB0aGlzLl9wcmVzc2VkLmluaXRSZWFkb25seUJpbmQodGhpcy5fcHJlc3NlZFNldHRlcik7XG4gICAgICAgICAgICB0aGlzLl9wYWRkaW5nLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgcCA9IHRoaXMuX3BhZGRpbmcudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHAgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnBhZGRpbmcgPSBcIjBweFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHAuYXBwbHkodGhpcy5fZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9wYWRkaW5nLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2JvcmRlci5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGIgPSB0aGlzLl9ib3JkZXIudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKGIgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYm9yZGVyU3R5bGVcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJib3JkZXJDb2xvclwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImJvcmRlcldpZHRoXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYm9yZGVyUmFkaXVzXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGIuYXBwbHkodGhpcy5fZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9jdXJzb3IuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUuY3Vyc29yID0gdGhpcy5jdXJzb3IuY3NzO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl92aXNpYmxlLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdmlzaWJsZS52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZW5hYmxlZC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2VuYWJsZWQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2FscGhhLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLm9wYWNpdHkgPSBcIlwiICsgdGhpcy5fYWxwaGEudmFsdWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGFibGUuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zZWxlY3RhYmxlLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJtb3pVc2VyU2VsZWN0XCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwia2h0bWxVc2VyU2VsZWN0XCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwid2Via2l0VXNlclNlbGVjdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcIm1zVXNlclNlbGVjdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcInVzZXJTZWxlY3RcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcIm1velVzZXJTZWxlY3RcIiwgXCJub25lXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KFwia2h0bWxVc2VyU2VsZWN0XCIsIFwibm9uZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcIndlYmtpdFVzZXJTZWxlY3RcIiwgXCJub25lXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KFwibXNVc2VyU2VsZWN0XCIsIFwibm9uZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcInVzZXJTZWxlY3RcIiwgXCJub25lXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fc2VsZWN0YWJsZS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9taW5XaWR0aC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX21pbldpZHRoLnZhbHVlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcIm1pbldpZHRoXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoXCJtaW5XaWR0aFwiLCB0aGlzLl9taW5XaWR0aC52YWx1ZSArIFwicHhcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9taW5IZWlnaHQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9taW5IZWlnaHQudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwibWluSGVpZ2h0XCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoXCJtaW5IZWlnaHRcIiwgdGhpcy5fbWluSGVpZ2h0LnZhbHVlICsgXCJweFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX21heFdpZHRoLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbWF4V2lkdGgudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwibWF4V2lkdGhcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcIm1heFdpZHRoXCIsIHRoaXMuX21heFdpZHRoLnZhbHVlICsgXCJweFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX21heEhlaWdodC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX21heEhlaWdodC52YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJtYXhIZWlnaHRcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcIm1heEhlaWdodFwiLCB0aGlzLl9tYXhIZWlnaHQudmFsdWUgKyBcInB4XCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5faGFuZGxlUG9pbnRlci5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9oYW5kbGVQb2ludGVyLnZhbHVlIHx8IHRoaXMuX3BvaW50ZXJUcmFuc3BhcmVudC52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KFwicG9pbnRlckV2ZW50c1wiLCBcIm5vbmVcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcInBvaW50ZXJFdmVudHNcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9wb2ludGVyVHJhbnNwYXJlbnQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5faGFuZGxlUG9pbnRlci52YWx1ZSB8fCB0aGlzLl9wb2ludGVyVHJhbnNwYXJlbnQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcInBvaW50ZXJFdmVudHNcIiwgXCJub25lXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJwb2ludGVyRXZlbnRzXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLl9tZWFzdXJlZFdpZHRoLmluaXRSZWFkb25seUJpbmQodGhpcy5fbWVhc3VyZWRXaWR0aFNldHRlcik7XG4gICAgICAgICAgICB0aGlzLl9tZWFzdXJlZEhlaWdodC5pbml0UmVhZG9ubHlCaW5kKHRoaXMuX21lYXN1cmVkSGVpZ2h0U2V0dGVyKTtcbiAgICAgICAgICAgIHRoaXMuX2NsaWVudFdpZHRoLmluaXRSZWFkb25seUJpbmQodGhpcy5fY2xpZW50V2lkdGhTZXR0ZXIpO1xuICAgICAgICAgICAgdGhpcy5fY2xpZW50SGVpZ2h0LmluaXRSZWFkb25seUJpbmQodGhpcy5fY2xpZW50SGVpZ2h0U2V0dGVyKTtcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kc1dpZHRoLmluaXRSZWFkb25seUJpbmQodGhpcy5fYm91bmRzV2lkdGhTZXR0ZXIpO1xuICAgICAgICAgICAgdGhpcy5fYm91bmRzSGVpZ2h0LmluaXRSZWFkb25seUJpbmQodGhpcy5fYm91bmRzSGVpZ2h0U2V0dGVyKTtcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kc0xlZnQuaW5pdFJlYWRvbmx5QmluZCh0aGlzLl9ib3VuZHNMZWZ0U2V0dGVyKTtcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kc1RvcC5pbml0UmVhZG9ubHlCaW5kKHRoaXMuX2JvdW5kc1RvcFNldHRlcik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuX29uQ2xpY2sgPSBuZXcgRXZlbnQ8TW91c2VFdmVudD4obmV3IEh0bWxFdmVudExpc3RlbmVyQ2FsbGJhY2sodGhpcy5fZWxlbWVudCwgXCJjbGlja1wiKSk7XG4gICAgICAgICAgICB0aGlzLl9vbk1vdXNlRG93biA9IG5ldyBFdmVudDxNb3VzZUV2ZW50PihuZXcgSHRtbEV2ZW50TGlzdGVuZXJDYWxsYmFjayh0aGlzLl9lbGVtZW50LCBcIm1vdXNlZG93blwiKSk7XG4gICAgICAgICAgICB0aGlzLiBfb25Nb3VzZU1vdmUgPSBuZXcgRXZlbnQ8TW91c2VFdmVudD4obmV3IEh0bWxFdmVudExpc3RlbmVyQ2FsbGJhY2sodGhpcy5fZWxlbWVudCwgXCJtb3VzZW1vdmVcIikpO1xuICAgICAgICAgICAgdGhpcy4gX29uTW91c2VVcCA9IG5ldyBFdmVudDxNb3VzZUV2ZW50PihuZXcgSHRtbEV2ZW50TGlzdGVuZXJDYWxsYmFjayh0aGlzLl9lbGVtZW50LCBcIm1vdXNldXBcIikpO1xuICAgICAgICAgICAgdGhpcy4gX29uTW91c2VFbnRlciA9IG5ldyBFdmVudDxNb3VzZUV2ZW50PihuZXcgSHRtbEV2ZW50TGlzdGVuZXJDYWxsYmFjayh0aGlzLl9lbGVtZW50LCBcIm1vdXNlZW50ZXJcIikpO1xuICAgICAgICAgICAgdGhpcy4gX29uTW91c2VMZWF2ZSA9IG5ldyBFdmVudDxNb3VzZUV2ZW50PihuZXcgSHRtbEV2ZW50TGlzdGVuZXJDYWxsYmFjayh0aGlzLl9lbGVtZW50LCBcIm1vdXNlbGVhdmVcIikpO1xuICAgICAgICAgICAgdGhpcy4gX29uTW91c2VXaGVlbCA9IG5ldyBFdmVudDxNb3VzZUV2ZW50PihuZXcgSHRtbEV2ZW50TGlzdGVuZXJDYWxsYmFjayh0aGlzLl9lbGVtZW50LCBcIm1vdXNld2hlZWxcIikpO1xuICAgICAgICAgICAgdGhpcy4gX29uS2V5RG93biA9IG5ldyBFdmVudDxLZXlib2FyZEV2ZW50PihuZXcgSHRtbEV2ZW50TGlzdGVuZXJDYWxsYmFjayh0aGlzLl9lbGVtZW50LCBcImtleWRvd25cIikpO1xuICAgICAgICAgICAgdGhpcy4gX29uS2V5UHJlc3MgPSBuZXcgRXZlbnQ8S2V5Ym9hcmRFdmVudD4obmV3IEh0bWxFdmVudExpc3RlbmVyQ2FsbGJhY2sodGhpcy5fZWxlbWVudCwgXCJrZXlwcmVzc1wiKSk7XG4gICAgICAgICAgICB0aGlzLiBfb25LZXlVcCA9IG5ldyBFdmVudDxLZXlib2FyZEV2ZW50PihuZXcgSHRtbEV2ZW50TGlzdGVuZXJDYWxsYmFjayh0aGlzLl9lbGVtZW50LCBcImtleXVwXCIpKTtcbiAgICAgICAgICAgIHRoaXMuIF9vbkNvbnRleHRNZW51ID0gbmV3IEV2ZW50PE9iamVjdD4obmV3IEh0bWxFdmVudExpc3RlbmVyQ2FsbGJhY2sodGhpcy5fZWxlbWVudCwgXCJjb250ZXh0bWVudVwiKSk7XG5cbiAgICAgICAgICAgIHRoaXMuX29uTW91c2VFbnRlci5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5faG92ZXJlZFNldHRlci52YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX29uTW91c2VMZWF2ZS5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5faG92ZXJlZFNldHRlci52YWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9vbk1vdXNlRG93bi5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJlc3NlZFNldHRlci52YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX29uTW91c2VVcC5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJlc3NlZFNldHRlci52YWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHByaXZhdGUgZ2V0Q2xhc3NOYW1lKCkge1xuICAgICAgICAgICAgdmFyIGZ1bmNOYW1lUmVnZXggPSAvZnVuY3Rpb24gKC57MSx9KVxcKC87XG4gICAgICAgICAgICB2YXIgcmVzdWx0cyAgPSAoZnVuY05hbWVSZWdleCkuZXhlYyh0aGlzW1wiY29uc3RydWN0b3JcIl0udG9TdHJpbmcoKSk7XG4gICAgICAgICAgICByZXR1cm4gKHJlc3VsdHMgJiYgcmVzdWx0cy5sZW5ndGggPiAxKSA/IHJlc3VsdHNbMV0gOiBcIlwiO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBpbnZva2VQb3N0Q29uc3RydWN0KCkge1xuICAgICAgICAgICAgdGhpcy5fcG9zdENvbnN0cnVjdFJ1bk9uY2UucnVuKCk7IFxuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIHBvc3RDb25zdHJ1Y3QoKSB7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzZXRDdWJlZVBhbmVsKGN1YmVlUGFuZWw6IEN1YmVlUGFuZWwpIHtcbiAgICAgICAgICAgIHRoaXMuX2N1YmVlUGFuZWwgPSBjdWJlZVBhbmVsO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0Q3ViZWVQYW5lbCgpOiBDdWJlZVBhbmVsIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jdWJlZVBhbmVsICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY3ViZWVQYW5lbDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXRDdWJlZVBhbmVsKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB1cGRhdGVUcmFuc2Zvcm0oKSB7XG4gICAgICAgICAgICB2YXIgYW5nbGUgPSB0aGlzLl9yb3RhdGUudmFsdWU7XG4gICAgICAgICAgICBhbmdsZSA9IGFuZ2xlIC0gKGFuZ2xlIHwgMCk7XG4gICAgICAgICAgICBhbmdsZSA9IGFuZ2xlICogMzYwO1xuICAgICAgICAgICAgdmFyIGFuZ2xlU3RyID0gYW5nbGUgKyBcImRlZ1wiO1xuXG4gICAgICAgICAgICB2YXIgY2VudGVyWCA9ICh0aGlzLl90cmFuc2Zvcm1DZW50ZXJYLnZhbHVlICogMTAwKSArIFwiJVwiO1xuICAgICAgICAgICAgdmFyIGNlbnRlclkgPSAodGhpcy5fdHJhbnNmb3JtQ2VudGVyWS52YWx1ZSAqIDEwMCkgKyBcIiVcIjtcblxuICAgICAgICAgICAgdmFyIHNYID0gdGhpcy5fc2NhbGVYLnZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB2YXIgc1kgPSB0aGlzLl9zY2FsZVkudmFsdWUudG9TdHJpbmcoKTtcblxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSBjZW50ZXJYICsgXCIgXCIgKyBjZW50ZXJZO1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZShcIiArIHRoaXMuX3RyYW5zbGF0ZVgudmFsdWUgKyBcInB4LCBcIiArIHRoaXMuX3RyYW5zbGF0ZVkudmFsdWVcbiAgICAgICAgICAgICsgXCJweCkgcm90YXRlKFwiICsgYW5nbGVTdHIgKyBcIikgc2NhbGVYKCBcIiArIHNYICsgXCIpIHNjYWxlWShcIiArIHNZICsgXCIpXCI7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLmJhY2tmYWNlVmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgICAgIH1cblxuICAgICAgICByZXF1ZXN0TGF5b3V0KCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9uZWVkc0xheW91dCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX25lZWRzTGF5b3V0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fcGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFyZW50LnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2N1YmVlUGFuZWwgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdWJlZVBhbmVsLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBQb3B1cHMuX3JlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBtZWFzdXJlKCkge1xuICAgICAgICAgICAgdGhpcy5vbk1lYXN1cmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgb25NZWFzdXJlKCkge1xuICAgICAgICAgICAgLy8gY2FsY3VsYXRpbmcgY2xpZW50IGJvdW5kc1xuICAgICAgICAgICAgdmFyIGN3ID0gdGhpcy5fZWxlbWVudC5jbGllbnRXaWR0aDtcbiAgICAgICAgICAgIHZhciBjaCA9IHRoaXMuX2VsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICAgICAgICAgICAgdmFyIHAgPSB0aGlzLl9wYWRkaW5nLnZhbHVlO1xuICAgICAgICAgICAgaWYgKHAgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGN3ID0gY3cgLSBwLmxlZnQgLSBwLnJpZ2h0O1xuICAgICAgICAgICAgICAgIGNoID0gY2ggLSBwLnRvcCAtIHAuYm90dG9tO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fY2xpZW50V2lkdGhTZXR0ZXIudmFsdWUgPSBjdztcbiAgICAgICAgICAgIHRoaXMuX2NsaWVudEhlaWdodFNldHRlci52YWx1ZSA9IGNoO1xuXG4gICAgICAgICAgICAvLyBjYWxjdWxhdGluZyBtZWFzdXJlZCBib3VuZHNcbiAgICAgICAgICAgIHZhciBtdyA9IHRoaXMuX2VsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICB2YXIgbWggPSB0aGlzLl9lbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgIHRoaXMuX21lYXN1cmVkV2lkdGhTZXR0ZXIudmFsdWUgPSBtdztcbiAgICAgICAgICAgIHRoaXMuX21lYXN1cmVkSGVpZ2h0U2V0dGVyLnZhbHVlID0gbWg7XG5cbiAgICAgICAgICAgIC8vIGNhbGN1bGF0aW5nIHBhcmVudCBib3VuZHNcbiAgICAgICAgICAgIHZhciB0Y3ggPSB0aGlzLl90cmFuc2Zvcm1DZW50ZXJYLnZhbHVlO1xuICAgICAgICAgICAgdmFyIHRjeSA9IHRoaXMuX3RyYW5zZm9ybUNlbnRlclkudmFsdWU7XG5cbiAgICAgICAgICAgIHZhciBieCA9IDA7XG4gICAgICAgICAgICB2YXIgYnkgPSAwO1xuICAgICAgICAgICAgdmFyIGJ3ID0gbXc7XG4gICAgICAgICAgICB2YXIgYmggPSBtaDtcblxuICAgICAgICAgICAgdmFyIHRsID0gbmV3IFBvaW50MkQoMCwgMCk7XG4gICAgICAgICAgICB2YXIgdHIgPSBuZXcgUG9pbnQyRChtdywgMCk7XG4gICAgICAgICAgICB2YXIgYnIgPSBuZXcgUG9pbnQyRChtdywgbWgpO1xuICAgICAgICAgICAgdmFyIGJsID0gbmV3IFBvaW50MkQoMCwgbWgpO1xuXG4gICAgICAgICAgICB2YXIgY3ggPSAobXcgKiB0Y3gpIHwgMDtcbiAgICAgICAgICAgIHZhciBjeSA9IChtaCAqIHRjeSkgfCAwO1xuXG4gICAgICAgICAgICB2YXIgcm90ID0gdGhpcy5fcm90YXRlLnZhbHVlO1xuICAgICAgICAgICAgaWYgKHJvdCAhPSAwLjApIHtcbiAgICAgICAgICAgICAgICB0bCA9IHRoaXMucm90YXRlUG9pbnQoY3gsIGN5LCAwLCAwLCByb3QpO1xuICAgICAgICAgICAgICAgIHRyID0gdGhpcy5yb3RhdGVQb2ludChjeCwgY3ksIGJ3LCAwLCByb3QpO1xuICAgICAgICAgICAgICAgIGJyID0gdGhpcy5yb3RhdGVQb2ludChjeCwgY3ksIGJ3LCBiaCwgcm90KTtcbiAgICAgICAgICAgICAgICBibCA9IHRoaXMucm90YXRlUG9pbnQoY3gsIGN5LCAwLCBiaCwgcm90KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHN4ID0gdGhpcy5fc2NhbGVYLnZhbHVlO1xuICAgICAgICAgICAgdmFyIHN5ID0gdGhpcy5fc2NhbGVZLnZhbHVlO1xuXG4gICAgICAgICAgICBpZiAoc3ggIT0gMS4wIHx8IHN5ICE9IDEuMCkge1xuICAgICAgICAgICAgICAgIHRsID0gdGhpcy5zY2FsZVBvaW50KGN4LCBjeSwgdGwueCwgdGwueSwgc3gsIHN5KTtcbiAgICAgICAgICAgICAgICB0ciA9IHRoaXMuc2NhbGVQb2ludChjeCwgY3ksIHRyLngsIHRyLnksIHN4LCBzeSk7XG4gICAgICAgICAgICAgICAgYnIgPSB0aGlzLnNjYWxlUG9pbnQoY3gsIGN5LCBici54LCBici55LCBzeCwgc3kpO1xuICAgICAgICAgICAgICAgIGJsID0gdGhpcy5zY2FsZVBvaW50KGN4LCBjeSwgYmwueCwgYmwueSwgc3gsIHN5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG1pblggPSBNYXRoLm1pbihNYXRoLm1pbih0bC54LCB0ci54KSwgTWF0aC5taW4oYnIueCwgYmwueCkpO1xuICAgICAgICAgICAgdmFyIG1pblkgPSBNYXRoLm1pbihNYXRoLm1pbih0bC55LCB0ci55KSwgTWF0aC5taW4oYnIueSwgYmwueSkpO1xuICAgICAgICAgICAgdmFyIG1heFggPSBNYXRoLm1heChNYXRoLm1heCh0bC54LCB0ci54KSwgTWF0aC5tYXgoYnIueCwgYmwueCkpO1xuICAgICAgICAgICAgdmFyIG1heFkgPSBNYXRoLm1heChNYXRoLm1heCh0bC55LCB0ci55KSwgTWF0aC5tYXgoYnIueSwgYmwueSkpO1xuICAgICAgICAgICAgYncgPSBtYXhYIC0gbWluWDtcbiAgICAgICAgICAgIGJoID0gbWF4WSAtIG1pblk7XG4gICAgICAgICAgICBieCA9IG1pblg7XG4gICAgICAgICAgICBieSA9IG1pblk7XG5cbiAgICAgICAgICAgIHRoaXMuX2JvdW5kc0xlZnRTZXR0ZXIudmFsdWUgPSBieDtcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kc1RvcFNldHRlci52YWx1ZSA9IGJ5O1xuICAgICAgICAgICAgdGhpcy5fYm91bmRzV2lkdGhTZXR0ZXIudmFsdWUgPSBidztcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kc0hlaWdodFNldHRlci52YWx1ZSA9IGJoO1xuICAgICAgICB9XG5cbiAgICAgICAgc2NhbGVQb2ludChjZW50ZXJYOiBudW1iZXIsIGNlbnRlclk6IG51bWJlciwgcG9pbnRYOiBudW1iZXIsIHBvaW50WTogbnVtYmVyLCBzY2FsZVg6IG51bWJlciwgc2NhbGVZOiBudW1iZXIpIHtcbiAgICAgICAgICAgIHZhciByZXNYID0gKGNlbnRlclggKyAoKHBvaW50WCAtIGNlbnRlclgpICogc2NhbGVYKSkgfCAwO1xuICAgICAgICAgICAgdmFyIHJlc1kgPSAoY2VudGVyWSArICgocG9pbnRZIC0gY2VudGVyWSkgKiBzY2FsZVkpKSB8IDA7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFBvaW50MkQocmVzWCwgcmVzWSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHJvdGF0ZVBvaW50KGN4OiBudW1iZXIsIGN5OiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyLCBhbmdsZTogbnVtYmVyKSB7XG4gICAgICAgICAgICBhbmdsZSA9IChhbmdsZSAqIDM2MCkgKiAoTWF0aC5QSSAvIDE4MCk7XG4gICAgICAgICAgICB4ID0geCAtIGN4O1xuICAgICAgICAgICAgeSA9IHkgLSBjeTtcbiAgICAgICAgICAgIHZhciBzaW4gPSBNYXRoLnNpbihhbmdsZSk7XG4gICAgICAgICAgICB2YXIgY29zID0gTWF0aC5jb3MoYW5nbGUpO1xuICAgICAgICAgICAgdmFyIHJ4ID0gKChjb3MgKiB4KSAtIChzaW4gKiB5KSkgfCAwO1xuICAgICAgICAgICAgdmFyIHJ5ID0gKChzaW4gKiB4KSArIChjb3MgKiB5KSkgfCAwO1xuICAgICAgICAgICAgcnggPSByeCArIGN4O1xuICAgICAgICAgICAgcnkgPSByeSArIGN5O1xuXG4gICAgICAgICAgICByZXR1cm4gbmV3IFBvaW50MkQocngsIHJ5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBlbGVtZW50KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgcGFyZW50KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBfc2V0UGFyZW50KHBhcmVudDogQUxheW91dCkge1xuICAgICAgICAgICAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgbGF5b3V0KCkge1xuICAgICAgICAgICAgdGhpcy5fbmVlZHNMYXlvdXQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMubWVhc3VyZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IG5lZWRzTGF5b3V0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX25lZWRzTGF5b3V0O1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFRyYW5zbGF0ZVgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNsYXRlWDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdHJhbnNsYXRlWCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlRyYW5zbGF0ZVgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHRyYW5zbGF0ZVgodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVHJhbnNsYXRlWC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFRyYW5zbGF0ZVkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNsYXRlWTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdHJhbnNsYXRlWSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlRyYW5zbGF0ZVkudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHRyYW5zbGF0ZVkodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVHJhbnNsYXRlWS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBwcm90ZWN0ZWQgcGFkZGluZ1Byb3BlcnR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhZGRpbmc7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGdldCBQYWRkaW5nKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFkZGluZ1Byb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGdldCBwYWRkaW5nKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuUGFkZGluZy52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgc2V0IHBhZGRpbmcodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuUGFkZGluZy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIGJvcmRlclByb3BlcnR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvcmRlcjtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IEJvcmRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJvcmRlclByb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGdldCBib3JkZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Cb3JkZXIudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIHNldCBib3JkZXIodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQm9yZGVyLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgTWVhc3VyZWRXaWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tZWFzdXJlZFdpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGdldCBtZWFzdXJlZFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuTWVhc3VyZWRXaWR0aC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgbWVhc3VyZWRXaWR0aCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5NZWFzdXJlZFdpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgTWVhc3VyZWRIZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbWVhc3VyZWRIZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IG1lYXN1cmVkSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuTWVhc3VyZWRIZWlnaHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IG1lYXN1cmVkSGVpZ2h0KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLk1lYXN1cmVkSGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQ2xpZW50V2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2xpZW50V2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGNsaWVudFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQ2xpZW50V2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGNsaWVudFdpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkNsaWVudFdpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQ2xpZW50SGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NsaWVudEhlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgY2xpZW50SGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQ2xpZW50SGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBjbGllbnRIZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQ2xpZW50SGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm91bmRzV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYm91bmRzV2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJvdW5kc1dpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm91bmRzV2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGJvdW5kc1dpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkJvdW5kc1dpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm91bmRzSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvdW5kc0hlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm91bmRzSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm91bmRzSGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBib3VuZHNIZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQm91bmRzSGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm91bmRzTGVmdCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib3VuZHNMZWZ0O1xuICAgICAgICB9XG4gICAgICAgIGdldCBib3VuZHNMZWZ0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm91bmRzTGVmdC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYm91bmRzTGVmdCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Cb3VuZHNMZWZ0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm91bmRzVG9wKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvdW5kc1RvcDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm91bmRzVG9wKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm91bmRzVG9wLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBib3VuZHNUb3AodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQm91bmRzVG9wLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgbWluV2lkdGhQcm9wZXJ0eSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9taW5XaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IE1pbldpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWluV2lkdGhQcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBnZXQgbWluV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5NaW5XaWR0aC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgc2V0IG1pbldpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLk1pbldpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHByb3RlY3RlZCBtaW5IZWlnaHRQcm9wZXJ0eSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9taW5IZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGdldCBNaW5IZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5taW5IZWlnaHRQcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBnZXQgbWluSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuTWluSGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBzZXQgbWluSGVpZ2h0KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLk1pbkhlaWdodC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cblxuICAgICAgICBwcm90ZWN0ZWQgbWF4V2lkdGhQcm9wZXJ0eSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tYXhXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IE1heFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF4V2lkdGhQcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBnZXQgbWF4V2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5NYXhXaWR0aC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgc2V0IG1heFdpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLk1heFdpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHByb3RlY3RlZCBtYXhIZWlnaHRQcm9wZXJ0eSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tYXhIZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGdldCBNYXhIZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXhIZWlnaHRQcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBnZXQgbWF4SGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuTWF4SGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBzZXQgbWF4SGVpZ2h0KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLk1heEhlaWdodC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0cyB0aGUgYmFzZSBwb3NpdGlvbiBvZiB0aGlzIGNvbXBvbmVudCByZWxhdGl2ZSB0byB0aGUgcGFyZW50J3MgdG9wLWxlZnQgY29ybmVyLiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgZnJvbSBhXG4gICAgICAgICAqIGxheW91dCdzIG9uTGF5b3V0IG1ldGhvZCB0byBzZXQgdGhlIGJhc2UgcG9zaXRpb24gb2YgdGhpcyBjb21wb25lbnQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBsZWZ0IFRoZSBsZWZ0IGJhc2UgcG9zaXRpb24gb2YgdGhpcyBjb21wb25lbnQgcmVsYXRpdmUgdG8gdGhlIHBhcmVudHMgdG9wLWxlZnQgY29ybmVyLlxuICAgICAgICAgKiBAcGFyYW0gdG9wIFRoZSB0b3AgYmFzZSBwb3NpdGlvbiBvZiB0aGlzIGNvbXBvbmVudCByZWxhdGl2ZSB0byB0aGUgcGFyZW50cyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqL1xuICAgICAgICBwcm90ZWN0ZWQgc2V0UG9zaXRpb24obGVmdDogbnVtYmVyLCB0b3A6IG51bWJlcikge1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5sZWZ0ID0gXCJcIiArIGxlZnQgKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnRvcCA9IFwiXCIgKyB0b3AgKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLl9sZWZ0ID0gbGVmdDtcbiAgICAgICAgICAgIHRoaXMuX3RvcCA9IHRvcDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIHRoZSBiYXNlIGxlZnQgcG9zaXRpb24gb2YgdGhpcyBjb21wb25lbnQgcmVsYXRpdmUgdG8gdGhlIHBhcmVudCdzIHRvcC1sZWZ0IGNvcm5lci4gVGhpcyBtZXRob2QgaXMgY2FsbGVkXG4gICAgICAgICAqIGZyb20gYSBsYXlvdXQncyBvbkxheW91dCBtZXRob2QgdG8gc2V0IHRoZSBiYXNlIGxlZnQgcG9zaXRpb24gb2YgdGhpcyBjb21wb25lbnQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBsZWZ0IFRoZSBsZWZ0IGJhc2UgcG9zaXRpb24gb2YgdGhpcyBjb21wb25lbnQgcmVsYXRpdmUgdG8gdGhlIHBhcmVudHMgdG9wLWxlZnQgY29ybmVyLlxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIF9zZXRMZWZ0KGxlZnQ6IG51bWJlcikge1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5sZWZ0ID0gXCJcIiArIGxlZnQgKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLl9sZWZ0ID0gbGVmdDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIHRoZSBiYXNlIHRvcCBwb3NpdGlvbiBvZiB0aGlzIGNvbXBvbmVudCByZWxhdGl2ZSB0byB0aGUgcGFyZW50J3MgdG9wLWxlZnQgY29ybmVyLiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgZnJvbVxuICAgICAgICAgKiBhIGxheW91dCdzIG9uTGF5b3V0IG1ldGhvZCB0byBzZXQgdGhlIGJhc2UgdG9wIHBvc2l0aW9uIG9mIHRoaXMgY29tcG9uZW50LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gdG9wIFRoZSB0b3AgYmFzZSBwb3NpdGlvbiBvZiB0aGlzIGNvbXBvbmVudCByZWxhdGl2ZSB0byB0aGUgcGFyZW50cyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgX3NldFRvcCh0b3A6IG51bWJlcikge1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS50b3AgPSBcIlwiICsgdG9wICsgXCJweFwiO1xuICAgICAgICAgICAgdGhpcy5fdG9wID0gdG9wO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgdGhlIHNpemUgb2YgdGhpcyBjb21wb25lbnQuIFRoaXMgbWV0aG9kIGNhbiBiZSBjYWxsZWQgd2hlbiBhIGR5bmFtaWNhbGx5IHNpemVkIGNvbXBvbmVudCdzIHNpemUgaXNcbiAgICAgICAgICogY2FsY3VsYXRlZC4gVHlwaWNhbGx5IGZyb20gdGhlIG9uTGF5b3V0IG1ldGhvZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHdpZHRoIFRoZSB3aWR0aCBvZiB0aGlzIGNvbXBvbmVudC5cbiAgICAgICAgICogQHBhcmFtIGhlaWdodCBUaGUgaGVpZ2h0IG9mIHRoaXMgY29tcG9uZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgcHJvdGVjdGVkIHNldFNpemUod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUud2lkdGggPSBcIlwiICsgd2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLmhlaWdodCA9IFwiXCIgKyBoZWlnaHQgKyBcInB4XCI7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQ3Vyc29yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnNvcjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgY3Vyc29yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQ3Vyc29yLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBjdXJzb3IodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQ3Vyc29yLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgUG9pbnRlclRyYW5zcGFyZW50KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BvaW50ZXJUcmFuc3BhcmVudDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgcG9pbnRlclRyYW5zcGFyZW50KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuUG9pbnRlclRyYW5zcGFyZW50LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBwb2ludGVyVHJhbnNwYXJlbnQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuUG9pbnRlclRyYW5zcGFyZW50LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVmlzaWJsZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92aXNpYmxlO1xuICAgICAgICB9XG4gICAgICAgIGdldCB2aXNpYmxlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVmlzaWJsZS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdmlzaWJsZSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5WaXNpYmxlLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgb25DbGljaygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbkNsaWNrO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IG9uQ29udGV4dE1lbnUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25Db250ZXh0TWVudTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBvbk1vdXNlRG93bigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbk1vdXNlRG93bjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBvbk1vdXNlTW92ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbk1vdXNlTW92ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBvbk1vdXNlVXAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25Nb3VzZVVwO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IG9uTW91c2VFbnRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbk1vdXNlRW50ZXI7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgb25Nb3VzZUxlYXZlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX29uTW91c2VMZWF2ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBvbk1vdXNlV2hlZWwoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25Nb3VzZVdoZWVsO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IG9uS2V5RG93bigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbktleURvd247XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgb25LZXlQcmVzcygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbktleVByZXNzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IG9uS2V5VXAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25LZXlVcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBvblBhcmVudENoYW5nZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25QYXJlbnRDaGFuZ2VkO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEFscGhhKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FscGhhO1xuICAgICAgICB9XG4gICAgICAgIGdldCBhbHBoYSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkFscGhhLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBhbHBoYSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5BbHBoYS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEhhbmRsZVBvaW50ZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGFuZGxlUG9pbnRlcjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgaGFuZGxlUG9pbnRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkhhbmRsZVBvaW50ZXIudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGhhbmRsZVBvaW50ZXIodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuSGFuZGxlUG9pbnRlci52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEVuYWJsZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZW5hYmxlZDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgZW5hYmxlZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkVuYWJsZWQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGVuYWJsZWQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuRW5hYmxlZC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFNlbGVjdGFibGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0YWJsZTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgc2VsZWN0YWJsZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlNlbGVjdGFibGUudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHNlbGVjdGFibGUodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0YWJsZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cblxuICAgICAgICBnZXQgbGVmdCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sZWZ0O1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHRvcCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90b3A7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgUm90YXRlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JvdGF0ZTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgcm90YXRlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuUm90YXRlLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCByb3RhdGUodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuUm90YXRlLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgU2NhbGVYKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NjYWxlWDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgc2NhbGVYKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuU2NhbGVYLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBzY2FsZVgodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuU2NhbGVYLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgU2NhbGVZKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NjYWxlWTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgc2NhbGVZKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuU2NhbGVZLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBzY2FsZVkodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuU2NhbGVZLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVHJhbnNmb3JtQ2VudGVyWCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90cmFuc2Zvcm1DZW50ZXJYO1xuICAgICAgICB9XG4gICAgICAgIGdldCB0cmFuc2Zvcm1DZW50ZXJYKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVHJhbnNmb3JtQ2VudGVyWC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdHJhbnNmb3JtQ2VudGVyWCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5UcmFuc2Zvcm1DZW50ZXJYLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVHJhbnNmb3JtQ2VudGVyWSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90cmFuc2Zvcm1DZW50ZXJZO1xuICAgICAgICB9XG4gICAgICAgIGdldCB0cmFuc2Zvcm1DZW50ZXJZKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVHJhbnNmb3JtQ2VudGVyWS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdHJhbnNmb3JtQ2VudGVyWSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5UcmFuc2Zvcm1DZW50ZXJZLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgSG92ZXJlZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ob3ZlcmVkO1xuICAgICAgICB9XG4gICAgICAgIGdldCBob3ZlcmVkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuSG92ZXJlZC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgaG92ZXJlZCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Ib3ZlcmVkLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgUHJlc3NlZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wcmVzc2VkO1xuICAgICAgICB9XG4gICAgICAgIGdldCBwcmVzc2VkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuUHJlc3NlZC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgcHJlc3NlZCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5QcmVzc2VkLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfVxuXG59XG5cblxuIiwibW9kdWxlIGN1YmVlIHtcblxuICAgIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBTGF5b3V0IGV4dGVuZHMgQUNvbXBvbmVudCB7XG4gICAgICAgIHByaXZhdGUgX2NoaWxkcmVuID0gbmV3IExheW91dENoaWxkcmVuKHRoaXMpO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICBzdXBlcihlbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBnZXQgY2hpbGRyZW5faW5uZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW47XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgYWJzdHJhY3QgX29uQ2hpbGRBZGRlZChjaGlsZDogQUNvbXBvbmVudCk6IHZvaWQ7XG5cbiAgICAgICAgcHVibGljIGFic3RyYWN0IF9vbkNoaWxkUmVtb3ZlZChjaGlsZDogQUNvbXBvbmVudCwgaW5kZXg6IG51bWJlcik6IHZvaWQ7XG5cbiAgICAgICAgcHVibGljIGFic3RyYWN0IF9vbkNoaWxkcmVuQ2xlYXJlZCgpOiB2b2lkO1xuXG4gICAgICAgIGxheW91dCgpIHtcbiAgICAgICAgICAgIHRoaXMuX25lZWRzTGF5b3V0ID0gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW5faW5uZXIuc2l6ZSgpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGQgPSB0aGlzLmNoaWxkcmVuX2lubmVyLmdldChpKTtcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGQubmVlZHNMYXlvdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLmxheW91dCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5vbkxheW91dCgpO1xuICAgICAgICAgICAgdGhpcy5tZWFzdXJlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgYWJzdHJhY3Qgb25MYXlvdXQoKTogdm9pZDtcblxuICAgICAgICBnZXRDb21wb25lbnRzQXRQb3NpdGlvbih4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgICAgICAgICAgdmFyIHJlczogQUNvbXBvbmVudFtdID0gW107XG4gICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudHNBdFBvc2l0aW9uX2ltcGwodGhpcywgeCwgeSwgcmVzKTtcbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGdldENvbXBvbmVudHNBdFBvc2l0aW9uX2ltcGwocm9vdDogQUxheW91dCwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHJlc3VsdDogQUNvbXBvbmVudFtdKSB7XG4gICAgICAgICAgICBpZiAoeCA+PSAwICYmIHggPD0gcm9vdC5ib3VuZHNXaWR0aCAmJiB5ID49IDAgJiYgeSA8PSByb290LmJvdW5kc0hlaWdodCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5zcGxpY2UoMCwgMCwgcm9vdCk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByb290LmNoaWxkcmVuX2lubmVyLnNpemUoKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb21wb25lbnQgPSByb290LmNoaWxkcmVuX2lubmVyLmdldChpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZXQgdHggPSB4IC0gY29tcG9uZW50LmxlZnQgLSBjb21wb25lbnQudHJhbnNsYXRlWDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHR5ID0geSAtIGNvbXBvbmVudC50b3AgLSBjb21wb25lbnQudHJhbnNsYXRlWTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIEFMYXlvdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50c0F0UG9zaXRpb25faW1wbCg8QUxheW91dD5jb21wb25lbnQsIHR4LCB0eSwgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eCA+PSAwICYmIHR4IDw9IGNvbXBvbmVudC5ib3VuZHNXaWR0aCAmJiB5ID49IDAgJiYgeSA8PSBjb21wb25lbnQuYm91bmRzSGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnNwbGljZSgwLCAwLCBjb21wb25lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIHNldENoaWxkTGVmdChjaGlsZDogQUNvbXBvbmVudCwgbGVmdDogbnVtYmVyKSB7XG4gICAgICAgICAgICBjaGlsZC5fc2V0TGVmdChsZWZ0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBzZXRDaGlsZFRvcChjaGlsZDogQUNvbXBvbmVudCwgdG9wOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGNoaWxkLl9zZXRUb3AodG9wKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG4iLCJtb2R1bGUgY3ViZWUge1xuXG4gICAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFVc2VyQ29udHJvbCBleHRlbmRzIEFMYXlvdXQge1xuXG4gICAgICAgIHByaXZhdGUgX3dpZHRoID0gbmV3IE51bWJlclByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfaGVpZ2h0ID0gbmV3IE51bWJlclByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYmFja2dyb3VuZCA9IG5ldyBCYWNrZ3JvdW5kUHJvcGVydHkobmV3IENvbG9yQmFja2dyb3VuZChDb2xvci5UUkFOU1BBUkVOVCksIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfc2hhZG93ID0gbmV3IFByb3BlcnR5PEJveFNoYWRvdz4obnVsbCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9kcmFnZ2FibGUgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlKTtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93WCA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUub3ZlcmZsb3dZID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgIHRoaXMuX3dpZHRoLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fd2lkdGgudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJ3aWR0aFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2lkdGggPSBcIlwiICsgdGhpcy5fd2lkdGgudmFsdWUgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl93aWR0aC5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9oZWlnaHQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9oZWlnaHQudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJoZWlnaHRcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmhlaWdodCA9IFwiXCIgKyB0aGlzLl9oZWlnaHQudmFsdWUgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9oZWlnaHQuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYmFja2dyb3VuZENvbG9yXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImJhY2tncm91bmRJbWFnZVwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJiYWNrZ3JvdW5kXCIpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9iYWNrZ3JvdW5kLnZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZC52YWx1ZS5hcHBseSh0aGlzLmVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZC5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9zaGFkb3cuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zaGFkb3cudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJib3hTaGFkb3dcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhZG93LnZhbHVlLmFwcGx5KHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9kcmFnZ2FibGUuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9kcmFnZ2FibGUudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcImRyYWdnYWJsZVwiLCBcInRydWVcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcImRyYWdnYWJsZVwiLCBcImZhbHNlXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZHJhZ2dhYmxlLmludmFsaWRhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCB3aWR0aFByb3BlcnR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dpZHRoO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBnZXQgV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy53aWR0aFByb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGdldCB3aWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLldpZHRoLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBzZXQgd2lkdGgodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuV2lkdGgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG5cblxuICAgICAgICBwcm90ZWN0ZWQgaGVpZ2h0UHJvcGVydHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBnZXQgSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGVpZ2h0UHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IGhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkhlaWdodC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgc2V0IGhlaWdodCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5IZWlnaHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcHJvdGVjdGVkIGJhY2tncm91bmRQcm9wZXJ0eSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9iYWNrZ3JvdW5kO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBnZXQgQmFja2dyb3VuZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJhY2tncm91bmRQcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBnZXQgYmFja2dyb3VuZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkJhY2tncm91bmQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIHNldCBiYWNrZ3JvdW5kKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkJhY2tncm91bmQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcHJvdGVjdGVkIHNoYWRvd1Byb3BlcnR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NoYWRvdztcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IFNoYWRvdygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNoYWRvd1Byb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGdldCBzaGFkb3coKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5TaGFkb3cudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIHNldCBzaGFkb3codmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuU2hhZG93LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGdldCBEcmFnZ2FibGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZHJhZ2dhYmxlO1xuICAgICAgICB9XG4gICAgICAgIGdldCBkcmFnZ2FibGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5EcmFnZ2FibGUudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGRyYWdnYWJsZSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5EcmFnZ2FibGUudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBfb25DaGlsZEFkZGVkKGNoaWxkOiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICBpZiAoY2hpbGQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChjaGlsZC5lbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIF9vbkNoaWxkUmVtb3ZlZChjaGlsZDogQUNvbXBvbmVudCwgaW5kZXg6IG51bWJlcikge1xuICAgICAgICAgICAgaWYgKGNoaWxkICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2hpbGQoY2hpbGQuZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBfb25DaGlsZHJlbkNsZWFyZWQoKSB7XG4gICAgICAgICAgICB2YXIgcm9vdCA9IHRoaXMuZWxlbWVudDtcbiAgICAgICAgICAgIHZhciBlID0gdGhpcy5lbGVtZW50LmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICAgICAgd2hpbGUgKGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJvb3QucmVtb3ZlQ2hpbGQoZSk7XG4gICAgICAgICAgICAgICAgZSA9IHJvb3QuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBvbkxheW91dCgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLndpZHRoICE9IG51bGwgJiYgdGhpcy5oZWlnaHQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U2l6ZSh0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBtYXhXID0gMDtcbiAgICAgICAgICAgICAgICB2YXIgbWF4SCA9IDA7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuX2lubmVyLnNpemUoKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb21wb25lbnQgPSB0aGlzLmNoaWxkcmVuX2lubmVyLmdldChpKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNXID0gY29tcG9uZW50LmJvdW5kc1dpZHRoICsgY29tcG9uZW50LmJvdW5kc0xlZnQgKyBjb21wb25lbnQudHJhbnNsYXRlWDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNIID0gY29tcG9uZW50LmJvdW5kc0hlaWdodCArIGNvbXBvbmVudC5ib3VuZHNUb3AgKyBjb21wb25lbnQudHJhbnNsYXRlWTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoY1cgPiBtYXhXKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXhXID0gY1c7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoY0ggPiBtYXhIKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXhIID0gY0g7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy53aWR0aCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIG1heFcgPSB0aGlzLmhlaWdodDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oZWlnaHQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBtYXhIID0gdGhpcy5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTaXplKG1heFcsIG1heEgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbn1cblxuXG4iLCJtb2R1bGUgY3ViZWUge1xuICAgIFxuICAgIGV4cG9ydCBjbGFzcyBBVmlldzxUPiBleHRlbmRzIEFVc2VyQ29udHJvbCB7XG4gICAgICAgIFxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9tb2RlbDogVCkge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgZ2V0IG1vZGVsKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21vZGVsO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH1cbiAgICBcbn1cblxuIiwibW9kdWxlIGN1YmVlIHtcblxuICAgIGV4cG9ydCBjbGFzcyBQYW5lbCBleHRlbmRzIEFVc2VyQ29udHJvbCB7XG4gICAgICAgIFxuICAgICAgICBwcm90ZWN0ZWQgd2lkdGhQcm9wZXJ0eSgpIHtcbiAgICAgICAgICAgIHJldHVybiBzdXBlci53aWR0aFByb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMud2lkdGhQcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIGdldCB3aWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLldpZHRoLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB3aWR0aCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5XaWR0aC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cblxuICAgICAgICBwcm90ZWN0ZWQgaGVpZ2h0UHJvcGVydHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuaGVpZ2h0UHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGVpZ2h0UHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgaGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuSGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBoZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuSGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHByb3RlY3RlZCBiYWNrZ3JvdW5kUHJvcGVydHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuYmFja2dyb3VuZFByb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IEJhY2tncm91bmQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5iYWNrZ3JvdW5kUHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYmFja2dyb3VuZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkJhY2tncm91bmQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGJhY2tncm91bmQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQmFja2dyb3VuZC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cblxuICAgICAgICBwcm90ZWN0ZWQgc2hhZG93UHJvcGVydHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuc2hhZG93UHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgU2hhZG93KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2hhZG93UHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgc2hhZG93KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuU2hhZG93LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBzaGFkb3codmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuU2hhZG93LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBcbiAgICAgICAgcHVibGljIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuX2lubmVyO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH1cblxufVxuIiwibW9kdWxlIGN1YmVlIHtcblxuICAgIGV4cG9ydCBjbGFzcyBIQm94IGV4dGVuZHMgQUxheW91dCB7XG5cbiAgICAgICAgcHJpdmF0ZSBfaGVpZ2h0ID0gbmV3IE51bWJlclByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfY2VsbFdpZHRoczogbnVtYmVyW10gPSBbXTtcbiAgICAgICAgcHJpdmF0ZSBfaEFsaWduczogRUhBbGlnbltdID0gW107XG4gICAgICAgIHByaXZhdGUgX3ZBbGlnbnM6IEVWQWxpZ25bXSA9IFtdO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgdGhpcy5wb2ludGVyVHJhbnNwYXJlbnQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5faGVpZ2h0LmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHNldENlbGxXaWR0aChpbmRleE9yQ29tcG9uZW50OiBudW1iZXIgfCBBQ29tcG9uZW50LCBjZWxsSGVpZ2h0OiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmIChpbmRleE9yQ29tcG9uZW50IGluc3RhbmNlb2YgQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q2VsbFdpZHRoKHRoaXMuY2hpbGRyZW5faW5uZXIuaW5kZXhPZihpbmRleE9yQ29tcG9uZW50KSwgY2VsbEhlaWdodCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNldEluTGlzdCh0aGlzLl9jZWxsV2lkdGhzLCA8bnVtYmVyPmluZGV4T3JDb21wb25lbnQsIGNlbGxIZWlnaHQpO1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0Q2VsbFdpZHRoKGluZGV4T3JDb21wb25lbnQ6IG51bWJlciB8IEFDb21wb25lbnQpOiBudW1iZXIge1xuICAgICAgICAgICAgaWYgKGluZGV4T3JDb21wb25lbnQgaW5zdGFuY2VvZiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2VsbFdpZHRoKHRoaXMuY2hpbGRyZW5faW5uZXIuaW5kZXhPZihpbmRleE9yQ29tcG9uZW50KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRGcm9tTGlzdCh0aGlzLl9jZWxsV2lkdGhzLCA8bnVtYmVyPmluZGV4T3JDb21wb25lbnQpO1xuICAgIH1cbiAgICBcbiAgICBwdWJsaWMgc2V0Q2VsbEhBbGlnbihpbmRleE9yQ29tcG9uZW50OiBudW1iZXIgfCBBQ29tcG9uZW50LCBoQWxpZ246IEVIQWxpZ24pIHtcbiAgICAgICAgICAgIGlmIChpbmRleE9yQ29tcG9uZW50IGluc3RhbmNlb2YgQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q2VsbEhBbGlnbih0aGlzLmNoaWxkcmVuX2lubmVyLmluZGV4T2YoaW5kZXhPckNvbXBvbmVudCksIGhBbGlnbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNldEluTGlzdCh0aGlzLl9oQWxpZ25zLCA8bnVtYmVyPmluZGV4T3JDb21wb25lbnQsIGhBbGlnbik7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgcHVibGljIGdldENlbGxIQWxpZ24oaW5kZXhPckNvbXBvbmVudDogbnVtYmVyIHwgQUNvbXBvbmVudCk6IEVIQWxpZ24ge1xuICAgICAgICAgICAgaWYgKGluZGV4T3JDb21wb25lbnQgaW5zdGFuY2VvZiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2VsbEhBbGlnbih0aGlzLmNoaWxkcmVuX2lubmVyLmluZGV4T2YoaW5kZXhPckNvbXBvbmVudCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RnJvbUxpc3QodGhpcy5faEFsaWducywgPG51bWJlcj5pbmRleE9yQ29tcG9uZW50KTtcbiAgICB9XG4gICAgXG4gICAgcHVibGljIHNldENlbGxWQWxpZ24oaW5kZXhPckNvbXBvbmVudDogbnVtYmVyIHwgQUNvbXBvbmVudCwgdkFsaWduOiBFVkFsaWduKSB7XG4gICAgICAgICAgICBpZiAoaW5kZXhPckNvbXBvbmVudCBpbnN0YW5jZW9mIEFDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldENlbGxWQWxpZ24odGhpcy5jaGlsZHJlbl9pbm5lci5pbmRleE9mKGluZGV4T3JDb21wb25lbnQpLCB2QWxpZ24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZXRJbkxpc3QodGhpcy5fdkFsaWducywgPG51bWJlcj5pbmRleE9yQ29tcG9uZW50LCB2QWxpZ24pO1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgIH1cblxuICAgIHB1YmxpYyBnZXRDZWxsVkFsaWduKGluZGV4T3JDb21wb25lbnQ6IG51bWJlciB8IEFDb21wb25lbnQpOiBFVkFsaWduIHtcbiAgICAgICAgICAgIGlmIChpbmRleE9yQ29tcG9uZW50IGluc3RhbmNlb2YgQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldENlbGxWQWxpZ24odGhpcy5jaGlsZHJlbl9pbm5lci5pbmRleE9mKGluZGV4T3JDb21wb25lbnQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEZyb21MaXN0KHRoaXMuX3ZBbGlnbnMsIDxudW1iZXI+aW5kZXhPckNvbXBvbmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHNldExhc3RDZWxsSEFsaWduKGhBbGlnbjogRUhBbGlnbikge1xuICAgICAgICB0aGlzLnNldENlbGxIQWxpZ24odGhpcy5jaGlsZHJlbl9pbm5lci5zaXplKCkgLSAxLCBoQWxpZ24pO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRMYXN0Q2VsbFZBbGlnbih2QWxpZ246IEVWQWxpZ24pIHtcbiAgICAgICAgdGhpcy5zZXRDZWxsVkFsaWduKHRoaXMuY2hpbGRyZW5faW5uZXIuc2l6ZSgpIC0gMSwgdkFsaWduKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0TGFzdENlbGxXaWR0aCh3aWR0aDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuc2V0Q2VsbFdpZHRoKHRoaXMuY2hpbGRyZW5faW5uZXIuc2l6ZSgpIC0gMSwgd2lkdGgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhZGRFbXB0eUNlbGwod2lkdGg6IG51bWJlcikge1xuICAgICAgICB0aGlzLmNoaWxkcmVuX2lubmVyLmFkZChudWxsKTtcbiAgICAgICAgdGhpcy5zZXRDZWxsV2lkdGgodGhpcy5jaGlsZHJlbl9pbm5lci5zaXplKCkgLSAxLCB3aWR0aCk7XG4gICAgfVxuXG4gICAgX29uQ2hpbGRBZGRlZChjaGlsZDogQUNvbXBvbmVudCkge1xuICAgICAgICBpZiAoY2hpbGQgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKGNoaWxkLmVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgIH1cblxuICAgIF9vbkNoaWxkUmVtb3ZlZChjaGlsZDogQUNvbXBvbmVudCwgaW5kZXg6IG51bWJlcikge1xuICAgICAgICBpZiAoY2hpbGQgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNoaWxkKGNoaWxkLmVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVtb3ZlRnJvbUxpc3QodGhpcy5faEFsaWducywgaW5kZXgpO1xuICAgICAgICB0aGlzLnJlbW92ZUZyb21MaXN0KHRoaXMuX3ZBbGlnbnMsIGluZGV4KTtcbiAgICAgICAgdGhpcy5yZW1vdmVGcm9tTGlzdCh0aGlzLl9jZWxsV2lkdGhzLCBpbmRleCk7XG4gICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgIH1cblxuICAgIF9vbkNoaWxkcmVuQ2xlYXJlZCgpIHtcbiAgICAgICAgbGV0IHJvb3QgPSB0aGlzLmVsZW1lbnQ7XG4gICAgICAgIGxldCBlID0gdGhpcy5lbGVtZW50LmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICB3aGlsZSAoZSAhPSBudWxsKSB7XG4gICAgICAgICAgICByb290LnJlbW92ZUNoaWxkKGUpO1xuICAgICAgICAgICAgZSA9IHJvb3QuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5faEFsaWducyA9IFtdO1xuICAgICAgICB0aGlzLl92QWxpZ25zID0gW107XG4gICAgICAgIHRoaXMuX2NlbGxXaWR0aHMgPSBbXTtcbiAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG9uTGF5b3V0KCkge1xuICAgICAgICB2YXIgbWF4SGVpZ2h0ID0gLTE7XG4gICAgICAgIGlmICh0aGlzLmhlaWdodCAhPSBudWxsKSB7XG4gICAgICAgICAgICBtYXhIZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhY3RXID0gMDtcbiAgICAgICAgdmFyIG1heEggPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4uc2l6ZSgpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBjaGlsZFggPSAwO1xuICAgICAgICAgICAgbGV0IGNoaWxkID0gdGhpcy5jaGlsZHJlbi5nZXQoaSk7XG4gICAgICAgICAgICBsZXQgY2VsbFcgPSB0aGlzLmdldENlbGxXaWR0aChpKTtcbiAgICAgICAgICAgIGxldCBoQWxpZ24gPSB0aGlzLmdldENlbGxIQWxpZ24oaSk7XG4gICAgICAgICAgICBsZXQgcmVhbENlbGxXID0gLTE7XG4gICAgICAgICAgICBpZiAoY2VsbFcgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJlYWxDZWxsVyA9IGNlbGxXO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY2hpbGQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmIChyZWFsQ2VsbFcgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGFjdFcgKz0gcmVhbENlbGxXO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy9jaGlsZC5sYXlvdXQoKTtcbiAgICAgICAgICAgICAgICBsZXQgY3cgPSBjaGlsZC5ib3VuZHNXaWR0aDtcbiAgICAgICAgICAgICAgICBsZXQgY2ggPSBjaGlsZC5ib3VuZHNIZWlnaHQ7XG4gICAgICAgICAgICAgICAgbGV0IGNsID0gY2hpbGQudHJhbnNsYXRlWDtcbiAgICAgICAgICAgICAgICBsZXQgY3QgPSBjaGlsZC50cmFuc2xhdGVZO1xuICAgICAgICAgICAgICAgIGxldCBjYWxjdWxhdGVkQ2VsbFcgPSByZWFsQ2VsbFc7XG4gICAgICAgICAgICAgICAgaWYgKGNhbGN1bGF0ZWRDZWxsVyA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXRlZENlbGxXID0gY3cgKyBjbDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNhbGN1bGF0ZWRDZWxsVyA8IGN3KSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGF0ZWRDZWxsVyA9IGN3O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNoaWxkWCA9IGFjdFcgLSBjaGlsZC50cmFuc2xhdGVYO1xuXG4gICAgICAgICAgICAgICAgaWYgKGhBbGlnbiA9PSBFSEFsaWduLkNFTlRFUikge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZFggKz0gKGNhbGN1bGF0ZWRDZWxsVyAtIGN3KSAvIDI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChoQWxpZ24gPT0gRUhBbGlnbi5SSUdIVCkge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZFggKz0gKGNhbGN1bGF0ZWRDZWxsVyAtIGN3KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2hpbGQuX3NldExlZnQoY2hpbGRYKTtcblxuICAgICAgICAgICAgICAgIGlmIChjaCArIGN0ID4gbWF4SCkge1xuICAgICAgICAgICAgICAgICAgICBtYXhIID0gY2ggKyBjdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYWN0VyArPSBjYWxjdWxhdGVkQ2VsbFc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcmVhbEhlaWdodCA9IG1heEg7XG4gICAgICAgIGlmIChtYXhIZWlnaHQgPiAtMSkge1xuICAgICAgICAgICAgcmVhbEhlaWdodCA9IG1heEhlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4uc2l6ZSgpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBjaGlsZFkgPSAwO1xuICAgICAgICAgICAgbGV0IGNoaWxkID0gdGhpcy5jaGlsZHJlbi5nZXQoaSk7XG4gICAgICAgICAgICBpZiAoY2hpbGQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHZBbGlnbiA9IHRoaXMuZ2V0Q2VsbFZBbGlnbihpKTtcbiAgICAgICAgICAgIGxldCBjaCA9IGNoaWxkLmJvdW5kc0hlaWdodDtcbiAgICAgICAgICAgIGlmICh2QWxpZ24gPT0gRVZBbGlnbi5NSURETEUpIHtcbiAgICAgICAgICAgICAgICBjaGlsZFkgKz0gKHJlYWxIZWlnaHQgLSBjaCkgLyAyO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh2QWxpZ24gPT0gRVZBbGlnbi5CT1RUT00pIHtcbiAgICAgICAgICAgICAgICBjaGlsZFkgKz0gKHJlYWxIZWlnaHQgLSBjaCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNoaWxkLl9zZXRUb3AoY2hpbGRZKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0U2l6ZShhY3RXLCByZWFsSGVpZ2h0KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldEluTGlzdDxUPihsaXN0OiBUW10sIGluZGV4OiBudW1iZXIsIHZhbHVlOiBUKSB7XG4gICAgICAgIHdoaWxlIChsaXN0Lmxlbmd0aCA8IGluZGV4KSB7XG4gICAgICAgICAgICBsaXN0LnB1c2gobnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgbGlzdFtpbmRleF0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBnZXRGcm9tTGlzdDxUPihsaXN0OiBUW10sIGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKGxpc3QubGVuZ3RoID4gaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiBsaXN0W2luZGV4XTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSByZW1vdmVGcm9tTGlzdDxUPihsaXN0OiBUW10sIGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKGxpc3QubGVuZ3RoID4gaW5kZXgpIHtcbiAgICAgICAgICAgIGxpc3Quc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5faW5uZXI7XG4gICAgfVxuICAgIFxuICAgIGdldCBIZWlnaHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XG4gICAgfVxuICAgIGdldCBoZWlnaHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkhlaWdodC52YWx1ZTtcbiAgICB9XG4gICAgc2V0IGhlaWdodCh2YWx1ZSkge1xuICAgICAgICB0aGlzLkhlaWdodC52YWx1ZSA9IHZhbHVlO1xuICAgIH1cblxuXG59XG4gICAgXG59XG5cbiIsIm1vZHVsZSBjdWJlZSB7XG5cbiAgICBleHBvcnQgY2xhc3MgVkJveCBleHRlbmRzIEFMYXlvdXQge1xuXG4gICAgICAgIHByaXZhdGUgX3dpZHRoID0gbmV3IE51bWJlclByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgLy9wcml2YXRlIGZpbmFsIEFycmF5TGlzdDxFbGVtZW50PiB3cmFwcGluZ1BhbmVscyA9IG5ldyBBcnJheUxpc3Q8RWxlbWVudD4oKTtcbiAgICAgICAgcHJpdmF0ZSBfY2VsbEhlaWdodHM6IG51bWJlcltdID0gW107XG4gICAgICAgIHByaXZhdGUgX2hBbGlnbnM6IEVIQWxpZ25bXSA9IFtdO1xuICAgICAgICBwcml2YXRlIF92QWxpZ25zOiBFVkFsaWduW10gPSBbXTtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgIHRoaXMucG9pbnRlclRyYW5zcGFyZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX3dpZHRoLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGNoaWxkcmVuKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5faW5uZXI7XG4gICAgICAgIH1cblxuICAgICAgICBzZXRDZWxsSGVpZ2h0KGluZGV4T3JDb21wb25lbnQ6IG51bWJlciB8IEFDb21wb25lbnQsIGNlbGxIZWlnaHQ6IG51bWJlcikge1xuICAgICAgICAgICAgaWYgKGluZGV4T3JDb21wb25lbnQgaW5zdGFuY2VvZiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRDZWxsSGVpZ2h0KHRoaXMuY2hpbGRyZW4uaW5kZXhPZig8QUNvbXBvbmVudD5pbmRleE9yQ29tcG9uZW50KSwgY2VsbEhlaWdodCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNldEluTGlzdCh0aGlzLl9jZWxsSGVpZ2h0cywgPG51bWJlcj5pbmRleE9yQ29tcG9uZW50LCBjZWxsSGVpZ2h0KTtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzZXRJbkxpc3Q8VD4obGlzdDogVFtdLCBpbmRleDogbnVtYmVyLCB2YWx1ZTogVCkge1xuICAgICAgICAgICAgd2hpbGUgKGxpc3QubGVuZ3RoIDwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBsaXN0LnB1c2gobnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsaXN0W2luZGV4XSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBnZXRGcm9tTGlzdDxUPihsaXN0OiBUW10sIGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmIChsaXN0Lmxlbmd0aCA+IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpc3RbaW5kZXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHJlbW92ZUZyb21MaXN0PFQ+KGxpc3Q6IFRbXSwgaW5kZXg6IG51bWJlcikge1xuICAgICAgICAgICAgaWYgKGxpc3QubGVuZ3RoID4gaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBsaXN0LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0Q2VsbEhlaWdodChpbmRleE9yQ29tcG9uZW50OiBudW1iZXIgfCBBQ29tcG9uZW50KTogbnVtYmVyIHtcbiAgICAgICAgICAgIGlmIChpbmRleE9yQ29tcG9uZW50IGluc3RhbmNlb2YgQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldENlbGxIZWlnaHQodGhpcy5jaGlsZHJlbi5pbmRleE9mKGluZGV4T3JDb21wb25lbnQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZ2V0RnJvbUxpc3QodGhpcy5fY2VsbEhlaWdodHMsIDxudW1iZXI+aW5kZXhPckNvbXBvbmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc2V0Q2VsbEhBbGlnbihpbmRleE9yQ29tcG9uZW50OiBudW1iZXIgfCBBQ29tcG9uZW50LCBoQWxpZ246IEVIQWxpZ24pIHtcbiAgICAgICAgICAgIGlmIChpbmRleE9yQ29tcG9uZW50IGluc3RhbmNlb2YgQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q2VsbEhBbGlnbih0aGlzLmNoaWxkcmVuLmluZGV4T2YoaW5kZXhPckNvbXBvbmVudCksIGhBbGlnbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNldEluTGlzdCh0aGlzLl9oQWxpZ25zLCA8bnVtYmVyPmluZGV4T3JDb21wb25lbnQsIGhBbGlnbik7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRDZWxsSEFsaWduKGluZGV4T3JDb21wb25lbnQ6IG51bWJlciB8IEFDb21wb25lbnQpOiBFSEFsaWduIHtcbiAgICAgICAgICAgIGlmIChpbmRleE9yQ29tcG9uZW50IGluc3RhbmNlb2YgQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldENlbGxIQWxpZ24odGhpcy5jaGlsZHJlbi5pbmRleE9mKGluZGV4T3JDb21wb25lbnQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEZyb21MaXN0KHRoaXMuX2hBbGlnbnMsIDxudW1iZXI+aW5kZXhPckNvbXBvbmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc2V0Q2VsbFZBbGlnbihpbmRleE9yQ29tcG9uZW50OiBudW1iZXIgfCBBQ29tcG9uZW50LCB2QWxpZ246IEVWQWxpZ24pIHtcbiAgICAgICAgICAgIGlmIChpbmRleE9yQ29tcG9uZW50IGluc3RhbmNlb2YgQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q2VsbFZBbGlnbih0aGlzLmNoaWxkcmVuLmluZGV4T2YoaW5kZXhPckNvbXBvbmVudCksIHZBbGlnbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNldEluTGlzdCh0aGlzLl92QWxpZ25zLCA8bnVtYmVyPmluZGV4T3JDb21wb25lbnQsIHZBbGlnbik7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICB9XG5cbiAgICAgICAgcHVibGljIGdldENlbGxWQWxpZ24oaW5kZXhPckNvbXBvbmVudDogbnVtYmVyIHwgQUNvbXBvbmVudCk6IEVWQWxpZ24ge1xuICAgICAgICBpZiAoaW5kZXhPckNvbXBvbmVudCBpbnN0YW5jZW9mIEFDb21wb25lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldENlbGxWQWxpZ24odGhpcy5jaGlsZHJlbi5pbmRleE9mKGluZGV4T3JDb21wb25lbnQpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdldEZyb21MaXN0KHRoaXMuX3ZBbGlnbnMsIDxudW1iZXI+aW5kZXhPckNvbXBvbmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHNldExhc3RDZWxsSEFsaWduKGhBbGlnbjogRUhBbGlnbikge1xuICAgICAgICB0aGlzLnNldENlbGxIQWxpZ24odGhpcy5jaGlsZHJlbi5zaXplKCkgLSAxLCBoQWxpZ24pO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRMYXN0Q2VsbFZBbGlnbih2QWxpZ246IEVWQWxpZ24pIHtcbiAgICAgICAgdGhpcy5zZXRDZWxsVkFsaWduKHRoaXMuY2hpbGRyZW4uc2l6ZSgpIC0gMSwgdkFsaWduKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0TGFzdENlbGxIZWlnaHQoaGVpZ2h0OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5zZXRDZWxsSGVpZ2h0KHRoaXMuY2hpbGRyZW4uc2l6ZSgpIC0gMSwgaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkRW1wdHlDZWxsKGhlaWdodDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4uYWRkKG51bGwpO1xuICAgICAgICB0aGlzLnNldENlbGxIZWlnaHQodGhpcy5jaGlsZHJlbi5zaXplKCkgLSAxLCBoZWlnaHQpO1xuICAgIH1cbiAgICBcbiAgICBnZXQgV2lkdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcbiAgICB9XG4gICAgZ2V0IHdpZHRoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5XaWR0aC52YWx1ZTtcbiAgICB9XG4gICAgc2V0IHdpZHRoKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuV2lkdGgudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgX29uQ2hpbGRBZGRlZChjaGlsZDogQUNvbXBvbmVudCkge1xuICAgICAgICBpZiAoY2hpbGQgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKGNoaWxkLmVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBfb25DaGlsZFJlbW92ZWQoY2hpbGQ6IEFDb21wb25lbnQsIGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKGNoaWxkICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDaGlsZChjaGlsZC5lbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbW92ZUZyb21MaXN0KHRoaXMuX2hBbGlnbnMsIGluZGV4KTtcbiAgICAgICAgdGhpcy5yZW1vdmVGcm9tTGlzdCh0aGlzLl92QWxpZ25zLCBpbmRleCk7XG4gICAgICAgIHRoaXMucmVtb3ZlRnJvbUxpc3QodGhpcy5fY2VsbEhlaWdodHMsIGluZGV4KTtcbiAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgfVxuXG4gICAgcHVibGljIF9vbkNoaWxkcmVuQ2xlYXJlZCgpIHtcbiAgICAgICAgdmFyIHJvb3QgPSB0aGlzLmVsZW1lbnQ7XG4gICAgICAgIHZhciBlID0gdGhpcy5lbGVtZW50LmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICB3aGlsZSAoZSAhPSBudWxsKSB7XG4gICAgICAgICAgICByb290LnJlbW92ZUNoaWxkKGUpO1xuICAgICAgICAgICAgZSA9IHJvb3QuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5faEFsaWducyA9IFtdO1xuICAgICAgICB0aGlzLl92QWxpZ25zID0gW107XG4gICAgICAgIHRoaXMuX2NlbGxIZWlnaHRzID0gW107XG4gICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBvbkxheW91dCgpIHtcbiAgICAgICAgdmFyIG1heFdpZHRoID0gLTE7XG4gICAgICAgIGlmICh0aGlzLndpZHRoICE9IG51bGwpIHtcbiAgICAgICAgICAgIG1heFdpZHRoID0gdGhpcy53aWR0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhY3RIID0gMDtcbiAgICAgICAgdmFyIG1heFcgPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4uc2l6ZSgpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBjaGlsZFkgPSAwO1xuICAgICAgICAgICAgbGV0IGNoaWxkID0gdGhpcy5jaGlsZHJlbi5nZXQoaSk7XG4gICAgICAgICAgICBsZXQgY2VsbEggPSB0aGlzLmdldENlbGxIZWlnaHQoaSk7XG4gICAgICAgICAgICBsZXQgdkFsaWduID0gdGhpcy5nZXRDZWxsVkFsaWduKGkpO1xuICAgICAgICAgICAgbGV0IHJlYWxDZWxsSCA9IC0xO1xuICAgICAgICAgICAgaWYgKGNlbGxIICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZWFsQ2VsbEggPSBjZWxsSDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNoaWxkID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVhbENlbGxIID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBhY3RIICs9IHJlYWxDZWxsSDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vY2hpbGQubGF5b3V0KCk7XG4gICAgICAgICAgICAgICAgbGV0IGN3ID0gY2hpbGQuYm91bmRzV2lkdGg7XG4gICAgICAgICAgICAgICAgbGV0IGNoID0gY2hpbGQuYm91bmRzSGVpZ2h0O1xuICAgICAgICAgICAgICAgIGxldCBjbCA9IGNoaWxkLnRyYW5zbGF0ZVg7XG4gICAgICAgICAgICAgICAgbGV0IGN0ID0gY2hpbGQudHJhbnNsYXRlWTtcbiAgICAgICAgICAgICAgICBsZXQgY2FsY3VsYXRlZENlbGxIID0gcmVhbENlbGxIO1xuICAgICAgICAgICAgICAgIGlmIChjYWxjdWxhdGVkQ2VsbEggPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGF0ZWRDZWxsSCA9IGNoICsgY3Q7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjYWxjdWxhdGVkQ2VsbEggPCBjaCkge1xuICAgICAgICAgICAgICAgICAgICBjYWxjdWxhdGVkQ2VsbEggPSBjaDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjaGlsZFkgPSBhY3RIIC0gY2hpbGQudHJhbnNsYXRlWTtcblxuICAgICAgICAgICAgICAgIGlmICh2QWxpZ24gPT0gRVZBbGlnbi5NSURETEUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRZICs9IChjYWxjdWxhdGVkQ2VsbEggLSBjaCkgLyAyO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodkFsaWduID09IEVWQWxpZ24uQk9UVE9NKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkWSArPSAoY2FsY3VsYXRlZENlbGxIIC0gY2gpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjaGlsZC5fc2V0VG9wKGNoaWxkWSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoY3cgKyBjbCA+IG1heFcpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF4VyA9IGN3ICsgY2w7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFjdEggKz0gY2FsY3VsYXRlZENlbGxIO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJlYWxXaWR0aCA9IG1heFc7XG4gICAgICAgIGlmIChtYXhXaWR0aCA+IC0xKSB7XG4gICAgICAgICAgICByZWFsV2lkdGggPSBtYXhXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4uc2l6ZSgpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBjaGlsZFggPSAwO1xuICAgICAgICAgICAgbGV0IGNoaWxkID0gdGhpcy5jaGlsZHJlbi5nZXQoaSk7XG4gICAgICAgICAgICBpZiAoY2hpbGQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGhBbGlnbiA9IHRoaXMuZ2V0Q2VsbEhBbGlnbihpKTtcbiAgICAgICAgICAgIGxldCBjdyA9IGNoaWxkLmJvdW5kc1dpZHRoO1xuICAgICAgICAgICAgaWYgKGhBbGlnbiA9PSBFSEFsaWduLkNFTlRFUikge1xuICAgICAgICAgICAgICAgIGNoaWxkWCA9IChyZWFsV2lkdGggLSBjdykgLyAyO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChoQWxpZ24gPT0gRUhBbGlnbi5SSUdIVCkge1xuICAgICAgICAgICAgICAgIGNoaWxkWCA9IChyZWFsV2lkdGggLSBjdyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNoaWxkLl9zZXRMZWZ0KGNoaWxkWCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFNpemUocmVhbFdpZHRoLCBhY3RIKTtcbiAgICB9XG5cblxuXG59XG4gICAgXG59XG5cblxuIiwibW9kdWxlIGN1YmVlIHtcblxuICAgIGV4cG9ydCBjbGFzcyBTY3JvbGxCb3ggZXh0ZW5kcyBBVXNlckNvbnRyb2wge1xuXG4gICAgICAgIHByaXZhdGUgX2NvbnRlbnQgPSBuZXcgUHJvcGVydHk8QUNvbXBvbmVudD4obnVsbCk7XG4gICAgICAgIHByaXZhdGUgX2hTY3JvbGxQb2xpY3kgPSBuZXcgUHJvcGVydHk8RVNjcm9sbEJhclBvbGljeT4oRVNjcm9sbEJhclBvbGljeS5BVVRPLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3ZTY3JvbGxQb2xpY3kgPSBuZXcgUHJvcGVydHk8RVNjcm9sbEJhclBvbGljeT4oRVNjcm9sbEJhclBvbGljeS5BVVRPLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3Njcm9sbFdpZHRoID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgcHJpdmF0ZSBfc2Nyb2xsSGVpZ2h0ID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgcHJpdmF0ZSBfaFNjcm9sbFBvcyA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgIHByaXZhdGUgX3ZTY3JvbGxQb3MgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIHRydWUpO1xuICAgICAgICBwcml2YXRlIF9tYXhIU2Nyb2xsUG9zID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgcHJpdmF0ZSBfbWF4VlNjcm9sbFBvcyA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgIHByaXZhdGUgX21heEhTY3JvbGxQb3NXcml0ZXIgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfbWF4VlNjcm9sbFBvc1dyaXRlciA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgZmFsc2UpO1xuXG4gICAgICAgIHByaXZhdGUgX2NhbGN1bGF0ZVNjcm9sbFdpZHRoRXhwID0gbmV3IEV4cHJlc3Npb248bnVtYmVyPigoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5jb250ZW50ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQuYm91bmRzV2lkdGg7XG4gICAgICAgIH0sIHRoaXMuX2NvbnRlbnQpO1xuICAgICAgICBwcml2YXRlIF9jYWxjdWxhdGVTY3JvbGxIZWlnaHRFeHAgPSBuZXcgRXhwcmVzc2lvbjxudW1iZXI+KCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRlbnQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudC5ib3VuZHNIZWlnaHQ7XG4gICAgICAgIH0sIHRoaXMuX2NvbnRlbnQpO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcIm92ZXJmbG93XCIpO1xuXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxXaWR0aC5pbml0UmVhZG9ubHlCaW5kKHRoaXMuX2NhbGN1bGF0ZVNjcm9sbFdpZHRoRXhwKTtcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbEhlaWdodC5pbml0UmVhZG9ubHlCaW5kKHRoaXMuX2NhbGN1bGF0ZVNjcm9sbEhlaWdodEV4cCk7XG5cbiAgICAgICAgICAgIHRoaXMuX21heEhTY3JvbGxQb3MuaW5pdFJlYWRvbmx5QmluZCh0aGlzLl9tYXhIU2Nyb2xsUG9zV3JpdGVyKTtcbiAgICAgICAgICAgIHRoaXMuX21heFZTY3JvbGxQb3MuaW5pdFJlYWRvbmx5QmluZCh0aGlzLl9tYXhWU2Nyb2xsUG9zV3JpdGVyKTtcblxuICAgICAgICAgICAgdGhpcy5fbWF4SFNjcm9sbFBvc1dyaXRlci5iaW5kKG5ldyBFeHByZXNzaW9uPG51bWJlcj4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAodGhpcy5zY3JvbGxXaWR0aCAtIHRoaXMuY2xpZW50V2lkdGgpO1xuICAgICAgICAgICAgfSwgdGhpcy5DbGllbnRXaWR0aCwgdGhpcy5fc2Nyb2xsV2lkdGgpKTtcblxuICAgICAgICAgICAgdGhpcy5fbWF4VlNjcm9sbFBvc1dyaXRlci5iaW5kKG5ldyBFeHByZXNzaW9uPG51bWJlcj4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAodGhpcy5zY3JvbGxIZWlnaHQgLSB0aGlzLmNsaWVudEhlaWdodCk7XG4gICAgICAgICAgICB9LCB0aGlzLkNsaWVudEhlaWdodCwgdGhpcy5fc2Nyb2xsSGVpZ2h0KSk7XG5cbiAgICAgICAgICAgIHRoaXMuX2NvbnRlbnQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5faW5uZXIuY2xlYXIoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxjdWxhdGVTY3JvbGxXaWR0aEV4cC51bmJpbmRBbGwoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxjdWxhdGVTY3JvbGxXaWR0aEV4cC5iaW5kKHRoaXMuX2NvbnRlbnQpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRlbnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYWxjdWxhdGVTY3JvbGxXaWR0aEV4cC5iaW5kKHRoaXMuY29udGVudC5Cb3VuZHNXaWR0aCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsY3VsYXRlU2Nyb2xsSGVpZ2h0RXhwLnVuYmluZEFsbCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZVNjcm9sbEhlaWdodEV4cC5iaW5kKHRoaXMuX2NvbnRlbnQpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRlbnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYWxjdWxhdGVTY3JvbGxIZWlnaHRFeHAuYmluZCh0aGlzLmNvbnRlbnQuQm91bmRzSGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb250ZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbl9pbm5lci5hZGQodGhpcy5jb250ZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgKGV2dCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuaFNjcm9sbFBvcyA9IHRoaXMuZWxlbWVudC5zY3JvbGxMZWZ0O1xuICAgICAgICAgICAgICAgIHRoaXMudlNjcm9sbFBvcyA9IHRoaXMuZWxlbWVudC5zY3JvbGxUb3A7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5faFNjcm9sbFBvcy5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnNjcm9sbExlZnQgPSB0aGlzLmhTY3JvbGxQb3M7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2hTY3JvbGxQb3MuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zY3JvbGxUb3AgPSB0aGlzLnZTY3JvbGxQb3M7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5faFNjcm9sbFBvbGljeS5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaFNjcm9sbFBvbGljeSA9PSBFU2Nyb2xsQmFyUG9saWN5LkFVVE8pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93WCA9IFwiYXV0b1wiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5oU2Nyb2xsUG9saWN5ID09IEVTY3JvbGxCYXJQb2xpY3kuSElEREVOKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vdmVyZmxvd1ggPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5oU2Nyb2xsUG9saWN5ID09IEVTY3JvbGxCYXJQb2xpY3kuVklTSUJMRSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUub3ZlcmZsb3dYID0gXCJzY3JvbGxcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2hTY3JvbGxQb2xpY3kuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fdlNjcm9sbFBvbGljeS5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudlNjcm9sbFBvbGljeSA9PSBFU2Nyb2xsQmFyUG9saWN5LkFVVE8pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93WSA9IFwiYXV0b1wiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy52U2Nyb2xsUG9saWN5ID09IEVTY3JvbGxCYXJQb2xpY3kuSElEREVOKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vdmVyZmxvd1kgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy52U2Nyb2xsUG9saWN5ID09IEVTY3JvbGxCYXJQb2xpY3kuVklTSUJMRSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUub3ZlcmZsb3dZID0gXCJzY3JvbGxcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3ZTY3JvbGxQb2xpY3kuaW52YWxpZGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIHdpZHRoUHJvcGVydHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIud2lkdGhQcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIGdldCBXaWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLndpZHRoUHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgd2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5XaWR0aC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgd2lkdGgodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuV2lkdGgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcHJvdGVjdGVkIGhlaWdodFByb3BlcnR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmhlaWdodFByb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IEhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhlaWdodFByb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkhlaWdodC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgaGVpZ2h0KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkhlaWdodC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cblxuICAgICAgICBnZXQgQ29udGVudCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250ZW50O1xuICAgICAgICB9XG4gICAgICAgIGdldCBjb250ZW50KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQ29udGVudC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgY29udGVudCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Db250ZW50LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgSFNjcm9sbFBvbGljeSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9oU2Nyb2xsUG9saWN5O1xuICAgICAgICB9XG4gICAgICAgIGdldCBoU2Nyb2xsUG9saWN5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuSFNjcm9sbFBvbGljeS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgaFNjcm9sbFBvbGljeSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5IU2Nyb2xsUG9saWN5LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVlNjcm9sbFBvbGljeSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92U2Nyb2xsUG9saWN5O1xuICAgICAgICB9XG4gICAgICAgIGdldCB2U2Nyb2xsUG9saWN5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVlNjcm9sbFBvbGljeS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdlNjcm9sbFBvbGljeSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5WU2Nyb2xsUG9saWN5LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgU2Nyb2xsV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsV2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHNjcm9sbFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuU2Nyb2xsV2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHNjcm9sbFdpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlNjcm9sbFdpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgU2Nyb2xsSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbEhlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgc2Nyb2xsSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuU2Nyb2xsSGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBzY3JvbGxIZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuU2Nyb2xsSGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgSFNjcm9sbFBvcygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9oU2Nyb2xsUG9zO1xuICAgICAgICB9XG4gICAgICAgIGdldCBoU2Nyb2xsUG9zKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuSFNjcm9sbFBvcy52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgaFNjcm9sbFBvcyh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5IU2Nyb2xsUG9zLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVlNjcm9sbFBvcygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92U2Nyb2xsUG9zO1xuICAgICAgICB9XG4gICAgICAgIGdldCB2U2Nyb2xsUG9zKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVlNjcm9sbFBvcy52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdlNjcm9sbFBvcyh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5WU2Nyb2xsUG9zLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgTWF4SFNjcm9sbFBvcygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tYXhIU2Nyb2xsUG9zO1xuICAgICAgICB9XG4gICAgICAgIGdldCBtYXhIU2Nyb2xsUG9zKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuTWF4SFNjcm9sbFBvcy52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgbWF4SFNjcm9sbFBvcyh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5NYXhIU2Nyb2xsUG9zLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgTWF4VlNjcm9sbFBvcygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tYXhWU2Nyb2xsUG9zO1xuICAgICAgICB9XG4gICAgICAgIGdldCBtYXhWU2Nyb2xsUG9zKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuTWF4VlNjcm9sbFBvcy52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgbWF4VlNjcm9sbFBvcyh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5NYXhWU2Nyb2xsUG9zLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgIH1cblxufVxuXG5cbiIsIm1vZHVsZSBjdWJlZSB7XG5cbiAgICBleHBvcnQgY2xhc3MgTGFiZWwgZXh0ZW5kcyBBQ29tcG9uZW50IHtcblxuICAgICAgICBwcml2YXRlIF93aWR0aCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2hlaWdodCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3RleHQgPSBuZXcgU3RyaW5nUHJvcGVydHkoXCJcIiwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdGV4dE92ZXJmbG93ID0gbmV3IFByb3BlcnR5PEVUZXh0T3ZlcmZsb3c+KEVUZXh0T3ZlcmZsb3cuQ0xJUCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfZm9yZUNvbG9yID0gbmV3IENvbG9yUHJvcGVydHkoQ29sb3IuQkxBQ0ssIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdGV4dEFsaWduID0gbmV3IFByb3BlcnR5PEVUZXh0QWxpZ24+KEVUZXh0QWxpZ24uTEVGVCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdmVydGljYWxBbGlnbiA9IG5ldyBQcm9wZXJ0eTxFVkFsaWduPihFVkFsaWduLlRPUCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYm9sZCA9IG5ldyBCb29sZWFuUHJvcGVydHkoZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2l0YWxpYyA9IG5ldyBCb29sZWFuUHJvcGVydHkoZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3VuZGVybGluZSA9IG5ldyBCb29sZWFuUHJvcGVydHkoZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2ZvbnRTaXplID0gbmV3IE51bWJlclByb3BlcnR5KDEyLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9mb250RmFtaWx5ID0gbmV3IFByb3BlcnR5PEZvbnRGYW1pbHk+KEZvbnRGYW1pbHkuQXJpYWwsIGZhbHNlLCBmYWxzZSk7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKTtcbiAgICAgICAgICAgIHRoaXMuX3dpZHRoLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy53aWR0aCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aGl0ZVNwYWNlID0gXCJub3dyYXBcIjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93WCA9IFwidmlzaWJsZVwiO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJ3aWR0aFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2hpdGVTcGFjZSA9IFwibm9ybWFsXCI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vdmVyZmxvd1ggPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2lkdGggPSB0aGlzLndpZHRoICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fd2lkdGguaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5faGVpZ2h0LmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oZWlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJoZWlnaHRcIilcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93WSA9IFwidmlzaWJsZVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93WSA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9oZWlnaHQuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fdGV4dC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmlubmVySFRNTCA9IHRoaXMudGV4dDtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl90ZXh0LmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3RleHRPdmVyZmxvdy5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0T3ZlcmZsb3cuYXBwbHkodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50ZXh0T3ZlcmZsb3cgPT0gRVRleHRPdmVyZmxvdy5FTExJUFNJUykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2hpdGVTcGFjZSA9IFwibm93cmFwXCI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwid2hpdGVTcGFjZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fd2lkdGguaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9oZWlnaHQuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdGV4dE92ZXJmbG93LmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2ZvcmVDb2xvci5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9yZUNvbG9yID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmNvbG9yID0gXCJyZ2JhKDAsMCwwLDAuMClcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuY29sb3IgPSB0aGlzLmZvcmVDb2xvci50b0NTUygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZm9yZUNvbG9yLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3RleHRBbGlnbi5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0QWxpZ24uYXBwbHkodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdGV4dEFsaWduLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRpY2FsQWxpZ24uYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB0YSA9IHRoaXMudmVydGljYWxBbGlnbjtcbiAgICAgICAgICAgICAgICBpZiAodGEgPT0gRVZBbGlnbi5UT1ApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZlcnRpY2FsQWxpZ24gPSBcInRvcFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGEgPT0gRVZBbGlnbi5NSURETEUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZlcnRpY2FsQWxpZ24gPSBcIm1pZGRsZVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGEgPT0gRVZBbGlnbi5CT1RUT00pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZlcnRpY2FsQWxpZ24gPSBcImJvdHRvbVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdmVydGljYWxBbGlnbi5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl91bmRlcmxpbmUuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnVuZGVybGluZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudGV4dERlY29yYXRpb24gPSBcInVuZGVybGluZVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50ZXh0RGVjb3JhdGlvbiA9IFwibm9uZVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdW5kZXJsaW5lLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2JvbGQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZvbnRXZWlnaHQgPSBcImJvbGRcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFdlaWdodCA9IFwibm9ybWFsXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9ib2xkLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2l0YWxpYy5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXRhbGljKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250U3R5bGUgPSBcIml0YWxpY1wiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250U3R5bGUgPSBcIm5vcm1hbFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5faXRhbGljLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2ZvbnRTaXplLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFNpemUgPSB0aGlzLmZvbnRTaXplICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9mb250U2l6ZS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9mb250RmFtaWx5LmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmZvbnRGYW1pbHkuYXBwbHkodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZm9udEZhbWlseS5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuV2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHdpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLldpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGdldCBIZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGdldCBoZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5IZWlnaHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGhlaWdodCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5IZWlnaHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUZXh0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RleHQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRleHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UZXh0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0ZXh0KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRleHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUZXh0T3ZlcmZsb3coKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGV4dE92ZXJmbG93O1xuICAgICAgICB9XG4gICAgICAgIGdldCB0ZXh0T3ZlcmZsb3coKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UZXh0T3ZlcmZsb3cudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHRleHRPdmVyZmxvdyh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5UZXh0T3ZlcmZsb3cudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuUGFkZGluZ1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEZvcmVDb2xvcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb3JlQ29sb3I7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGZvcmVDb2xvcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkZvcmVDb2xvci52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgZm9yZUNvbG9yKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkZvcmVDb2xvci52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFZlcnRpY2FsQWxpZ24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmVydGljYWxBbGlnbjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdmVydGljYWxBbGlnbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlZlcnRpY2FsQWxpZ24udmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHZlcnRpY2FsQWxpZ24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVmVydGljYWxBbGlnbi52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEJvbGQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYm9sZDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm9sZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkJvbGQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGJvbGQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQm9sZC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEl0YWxpYygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pdGFsaWM7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGl0YWxpYygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkl0YWxpYy52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgaXRhbGljKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkl0YWxpYy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFVuZGVybGluZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl91bmRlcmxpbmU7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHVuZGVybGluZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlVuZGVybGluZS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdW5kZXJsaW5lKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlVuZGVybGluZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFRleHRBbGlnbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZXh0QWxpZ247XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRleHRBbGlnbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlRleHRBbGlnbi52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdGV4dEFsaWduKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRleHRBbGlnbi52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEZvbnRTaXplKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvbnRTaXplO1xuICAgICAgICB9XG4gICAgICAgIGdldCBmb250U2l6ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkZvbnRTaXplLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBmb250U2l6ZSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Gb250U2l6ZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEZvbnRGYW1pbHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9udEZhbWlseTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgZm9udEZhbWlseSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkZvbnRGYW1pbHkudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGZvbnRGYW1pbHkodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuRm9udEZhbWlseS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn1cblxuXG4iLCJtb2R1bGUgY3ViZWUge1xuICAgIFxuICAgIGV4cG9ydCBjbGFzcyBCdXR0b24gZXh0ZW5kcyBBQ29tcG9uZW50IHtcbiAgICAgICAgXG4gICAgICAgIHByaXZhdGUgX3dpZHRoID0gbmV3IE51bWJlclByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfaGVpZ2h0ID0gbmV3IE51bWJlclByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdGV4dCA9IG5ldyBTdHJpbmdQcm9wZXJ0eShcIlwiLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF90ZXh0T3ZlcmZsb3cgPSBuZXcgUHJvcGVydHk8RVRleHRPdmVyZmxvdz4oRVRleHRPdmVyZmxvdy5DTElQLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9mb3JlQ29sb3IgPSBuZXcgQ29sb3JQcm9wZXJ0eShDb2xvci5CTEFDSywgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF90ZXh0QWxpZ24gPSBuZXcgUHJvcGVydHk8RVRleHRBbGlnbj4oRVRleHRBbGlnbi5DRU5URVIsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3ZlcnRpY2FsQWxpZ24gPSBuZXcgUHJvcGVydHk8RVZBbGlnbj4oRVZBbGlnbi5NSURETEUsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2JvbGQgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9pdGFsaWMgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF91bmRlcmxpbmUgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9mb250U2l6ZSA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgxMiwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfZm9udEZhbWlseSA9IG5ldyBQcm9wZXJ0eTxGb250RmFtaWx5PihGb250RmFtaWx5LkFyaWFsLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9iYWNrZ3JvdW5kID0gbmV3IEJhY2tncm91bmRQcm9wZXJ0eShuZXcgQ29sb3JCYWNrZ3JvdW5kKENvbG9yLlRSQU5TUEFSRU5UKSwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9zaGFkb3cgPSBuZXcgUHJvcGVydHk8Qm94U2hhZG93PihudWxsLCB0cnVlLCBmYWxzZSk7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpKTtcbiAgICAgICAgICAgIHRoaXMucGFkZGluZyA9IFBhZGRpbmcuY3JlYXRlKDEwKTtcbiAgICAgICAgICAgIHRoaXMuX3dpZHRoLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy53aWR0aCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aGl0ZVNwYWNlID0gXCJub3dyYXBcIjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93WCA9IFwidmlzaWJsZVwiO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJ3aWR0aFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2hpdGVTcGFjZSA9IFwibm9ybWFsXCI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vdmVyZmxvd1ggPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2lkdGggPSB0aGlzLndpZHRoICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fd2lkdGguaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5faGVpZ2h0LmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oZWlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJoZWlnaHRcIilcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93WSA9IFwidmlzaWJsZVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93WSA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9oZWlnaHQuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fdGV4dC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmlubmVySFRNTCA9IHRoaXMudGV4dDtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl90ZXh0LmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3RleHRPdmVyZmxvdy5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0T3ZlcmZsb3cuYXBwbHkodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50ZXh0T3ZlcmZsb3cgPT0gRVRleHRPdmVyZmxvdy5FTExJUFNJUykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2hpdGVTcGFjZSA9IFwibm93cmFwXCI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwid2hpdGVTcGFjZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fd2lkdGguaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9oZWlnaHQuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdGV4dE92ZXJmbG93LmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2ZvcmVDb2xvci5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9yZUNvbG9yID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmNvbG9yID0gXCJyZ2JhKDAsMCwwLDAuMClcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuY29sb3IgPSB0aGlzLmZvcmVDb2xvci50b0NTUygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZm9yZUNvbG9yLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3RleHRBbGlnbi5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0QWxpZ24uYXBwbHkodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdGV4dEFsaWduLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRpY2FsQWxpZ24uYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB0YSA9IHRoaXMudmVydGljYWxBbGlnbjtcbiAgICAgICAgICAgICAgICBpZiAodGEgPT0gRVZBbGlnbi5UT1ApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZlcnRpY2FsQWxpZ24gPSBcInRvcFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGEgPT0gRVZBbGlnbi5NSURETEUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZlcnRpY2FsQWxpZ24gPSBcIm1pZGRsZVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGEgPT0gRVZBbGlnbi5CT1RUT00pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZlcnRpY2FsQWxpZ24gPSBcImJvdHRvbVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdmVydGljYWxBbGlnbi5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl91bmRlcmxpbmUuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnVuZGVybGluZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudGV4dERlY29yYXRpb24gPSBcInVuZGVybGluZVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50ZXh0RGVjb3JhdGlvbiA9IFwibm9uZVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdW5kZXJsaW5lLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2JvbGQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZvbnRXZWlnaHQgPSBcImJvbGRcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFdlaWdodCA9IFwibm9ybWFsXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9ib2xkLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2l0YWxpYy5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXRhbGljKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250U3R5bGUgPSBcIml0YWxpY1wiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250U3R5bGUgPSBcIm5vcm1hbFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5faXRhbGljLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2ZvbnRTaXplLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFNpemUgPSB0aGlzLmZvbnRTaXplICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9mb250U2l6ZS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9mb250RmFtaWx5LmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmZvbnRGYW1pbHkuYXBwbHkodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZm9udEZhbWlseS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9iYWNrZ3JvdW5kLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJiYWNrZ3JvdW5kQ29sb3JcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYmFja2dyb3VuZEltYWdlXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImJhY2tncm91bmRcIik7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2JhY2tncm91bmQudmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9iYWNrZ3JvdW5kLnZhbHVlLmFwcGx5KHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9iYWNrZ3JvdW5kLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3NoYWRvdy5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3NoYWRvdy52YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImJveFNoYWRvd1wiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFkb3cudmFsdWUuYXBwbHkodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5ib3JkZXIgPSBCb3JkZXIuY3JlYXRlKDEsIENvbG9yLkxJR0hUX0dSQVksIDIpO1xuICAgICAgICAgICAgdGhpcy5mb250U2l6ZSA9IDE0O1xuICAgICAgICAgICAgdGhpcy5ib2xkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZCA9IG5ldyBDb2xvckJhY2tncm91bmQoQ29sb3IuV0hJVEUpO1xuICAgICAgICAgICAgdGhpcy5zaGFkb3cgPSBuZXcgQm94U2hhZG93KDEsIDEsIDUsIDAsIENvbG9yLkxJR0hUX0dSQVksIGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBXaWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgd2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5XaWR0aC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgd2lkdGgodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuV2lkdGgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgZ2V0IEhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkhlaWdodC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgaGVpZ2h0KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkhlaWdodC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFRleHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGV4dDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdGV4dCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlRleHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHRleHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVGV4dC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFRleHRPdmVyZmxvdygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZXh0T3ZlcmZsb3c7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRleHRPdmVyZmxvdygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlRleHRPdmVyZmxvdy52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdGV4dE92ZXJmbG93KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRleHRPdmVyZmxvdy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5QYWRkaW5nXG4gICAgICAgIH1cblxuICAgICAgICBnZXQgRm9yZUNvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvcmVDb2xvcjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgZm9yZUNvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRm9yZUNvbG9yLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBmb3JlQ29sb3IodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuRm9yZUNvbG9yLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVmVydGljYWxBbGlnbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92ZXJ0aWNhbEFsaWduO1xuICAgICAgICB9XG4gICAgICAgIGdldCB2ZXJ0aWNhbEFsaWduKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVmVydGljYWxBbGlnbi52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdmVydGljYWxBbGlnbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5WZXJ0aWNhbEFsaWduLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm9sZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib2xkO1xuICAgICAgICB9XG4gICAgICAgIGdldCBib2xkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm9sZC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYm9sZCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Cb2xkLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgSXRhbGljKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2l0YWxpYztcbiAgICAgICAgfVxuICAgICAgICBnZXQgaXRhbGljKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuSXRhbGljLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBpdGFsaWModmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuSXRhbGljLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVW5kZXJsaW5lKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3VuZGVybGluZTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdW5kZXJsaW5lKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVW5kZXJsaW5lLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB1bmRlcmxpbmUodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVW5kZXJsaW5lLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVGV4dEFsaWduKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RleHRBbGlnbjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdGV4dEFsaWduKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVGV4dEFsaWduLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0ZXh0QWxpZ24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVGV4dEFsaWduLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgRm9udFNpemUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9udFNpemU7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGZvbnRTaXplKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRm9udFNpemUudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGZvbnRTaXplKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkZvbnRTaXplLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgRm9udEZhbWlseSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb250RmFtaWx5O1xuICAgICAgICB9XG4gICAgICAgIGdldCBmb250RmFtaWx5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRm9udEZhbWlseS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgZm9udEZhbWlseSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Gb250RmFtaWx5LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGdldCBCYWNrZ3JvdW5kKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JhY2tncm91bmQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJhY2tncm91bmQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5CYWNrZ3JvdW5kLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBiYWNrZ3JvdW5kKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkJhY2tncm91bmQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBTaGFkb3coKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2hhZG93O1xuICAgICAgICB9XG4gICAgICAgIGdldCBzaGFkb3coKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5TaGFkb3cudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHNoYWRvdyh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5TaGFkb3cudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG5cbiAgICB9XG4gICAgXG59XG5cblxuIiwibW9kdWxlIGN1YmVlIHtcblxuICAgIGV4cG9ydCBjbGFzcyBUZXh0Qm94IGV4dGVuZHMgQUNvbXBvbmVudCB7XG5cbiAgICAgICAgcHJpdmF0ZSBfd2lkdGggPSBuZXcgTnVtYmVyUHJvcGVydHkobnVsbCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9oZWlnaHQgPSBuZXcgTnVtYmVyUHJvcGVydHkobnVsbCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF90ZXh0ID0gbmV3IFN0cmluZ1Byb3BlcnR5KFwiXCIsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2JhY2tncm91bmQgPSBuZXcgQmFja2dyb3VuZFByb3BlcnR5KG5ldyBDb2xvckJhY2tncm91bmQoQ29sb3IuV0hJVEUpLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2ZvcmVDb2xvciA9IG5ldyBDb2xvclByb3BlcnR5KENvbG9yLkJMQUNLLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3RleHRBbGlnbiA9IG5ldyBQcm9wZXJ0eTxFVGV4dEFsaWduPihFVGV4dEFsaWduLkxFRlQsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3ZlcnRpY2FsQWxpZ24gPSBuZXcgUHJvcGVydHk8RVZBbGlnbj4oRVZBbGlnbi5UT1AsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2JvbGQgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9pdGFsaWMgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF91bmRlcmxpbmUgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9mb250U2l6ZSA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgxMiwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfZm9udEZhbWlseSA9IG5ldyBQcm9wZXJ0eTxGb250RmFtaWx5PihGb250RmFtaWx5LkFyaWFsLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9wbGFjZWhvbGRlciA9IG5ldyBTdHJpbmdQcm9wZXJ0eShudWxsLCB0cnVlKTtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKSk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInRleHRcIik7XG5cbiAgICAgICAgICAgIHRoaXMuYm9yZGVyID0gQm9yZGVyLmNyZWF0ZSgxLCBDb2xvci5MSUdIVF9HUkFZLCAwKTtcbiAgICAgICAgICAgIHRoaXMuX3dpZHRoLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy53aWR0aCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcIndpZHRoXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aCA9IHRoaXMud2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9oZWlnaHQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhlaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImhlaWdodFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHQgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl90ZXh0LmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50ZXh0ICE9IHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgdGhpcy50ZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2ZvcmVDb2xvci5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9yZUNvbG9yID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmNvbG9yID0gXCJyZ2JhKDAsMCwwLCAwLjApXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmNvbG9yID0gdGhpcy5mb3JlQ29sb3IudG9DU1MoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2ZvcmVDb2xvci5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl90ZXh0QWxpZ24uYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudGV4dEFsaWduLmFwcGx5KHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3RleHRBbGlnbi5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl92ZXJ0aWNhbEFsaWduLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdGEgPSB0aGlzLnZlcnRpY2FsQWxpZ247XG4gICAgICAgICAgICAgICAgaWYgKHRhID09IEVWQWxpZ24uVE9QKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52ZXJ0aWNhbEFsaWduID0gXCJ0b3BcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRhID09IEVWQWxpZ24uTUlERExFKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52ZXJ0aWNhbEFsaWduID0gXCJtaWRkbGVcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRhID09IEVWQWxpZ24uQk9UVE9NKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52ZXJ0aWNhbEFsaWduID0gXCJib3R0b21cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRpY2FsQWxpZ24uaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fdW5kZXJsaW5lLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy51bmRlcmxpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRleHREZWNvcmF0aW9uID0gXCJ1bmRlcmxpbmVcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudGV4dERlY29yYXRpb24gPSBcIm5vbmVcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3VuZGVybGluZS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9ib2xkLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ib2xkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250V2VpZ2h0ID0gXCJib2xkXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZvbnRXZWlnaHQgPSBcIm5vcm1hbFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fYm9sZC5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9pdGFsaWMuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLml0YWxpYykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFN0eWxlID0gXCJpdGFsaWNcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFN0eWxlID0gXCJub3JtYWxcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2l0YWxpYy5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9mb250U2l6ZS5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZvbnRTaXplID0gdGhpcy5mb250U2l6ZSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZm9udFNpemUuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fZm9udEZhbWlseS5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5mb250RmFtaWx5LmFwcGx5KHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2ZvbnRGYW1pbHkuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYmFja2dyb3VuZCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImJhY2tncm91bmRDb2xvclwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYmFja2dyb3VuZEltYWdlXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZC5hcHBseSh0aGlzLmVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZC5pbnZhbGlkYXRlKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3BsYWNlaG9sZGVyLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wbGFjZWhvbGRlciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIiwgdGhpcy5wbGFjZWhvbGRlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuV2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHdpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLldpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgaGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuSGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBoZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuSGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVGV4dCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZXh0O1xuICAgICAgICB9XG4gICAgICAgIGdldCB0ZXh0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVGV4dC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdGV4dCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5UZXh0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQmFja2dyb3VuZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9iYWNrZ3JvdW5kO1xuICAgICAgICB9XG4gICAgICAgIGdldCBiYWNrZ3JvdW5kKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQmFja2dyb3VuZC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYmFja2dyb3VuZCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5CYWNrZ3JvdW5kLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgRm9yZUNvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvcmVDb2xvcjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgZm9yZUNvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRm9yZUNvbG9yLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBmb3JlQ29sb3IodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuRm9yZUNvbG9yLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVGV4dEFsaWduKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RleHRBbGlnbjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdGV4dEFsaWduKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVGV4dEFsaWduLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0ZXh0QWxpZ24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVGV4dEFsaWduLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVmVydGljYWxBbGlnbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92ZXJ0aWNhbEFsaWduO1xuICAgICAgICB9XG4gICAgICAgIGdldCB2ZXJ0aWNhbEFsaWduKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVmVydGljYWxBbGlnbi52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdmVydGljYWxBbGlnbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5WZXJ0aWNhbEFsaWduLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm9sZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib2xkO1xuICAgICAgICB9XG4gICAgICAgIGdldCBib2xkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm9sZC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYm9sZCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Cb2xkLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgSXRhbGljKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2l0YWxpYztcbiAgICAgICAgfVxuICAgICAgICBnZXQgaXRhbGljKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuSXRhbGljLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBpdGFsaWModmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuSXRhbGljLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVW5kZXJsaW5lKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3VuZGVybGluZTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdW5kZXJsaW5lKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVW5kZXJsaW5lLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB1bmRlcmxpbmUodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVW5kZXJsaW5lLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgRm9udFNpemUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9udFNpemU7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGZvbnRTaXplKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRm9udFNpemUudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGZvbnRTaXplKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkZvbnRTaXplLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgRm9udEZhbWlseSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb250RmFtaWx5O1xuICAgICAgICB9XG4gICAgICAgIGdldCBmb250RmFtaWx5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRm9udEZhbWlseS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgZm9udEZhbWlseSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Gb250RmFtaWx5LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgUGxhY2Vob2xkZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGxhY2Vob2xkZXI7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHBsYWNlaG9sZGVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuUGxhY2Vob2xkZXIudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHBsYWNlaG9sZGVyKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlBsYWNlaG9sZGVyLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgIH1cblxufVxuXG5cbiIsIm1vZHVsZSBjdWJlZSB7XG5cbiAgICBleHBvcnQgY2xhc3MgUGFzc3dvcmRCb3ggZXh0ZW5kcyBBQ29tcG9uZW50IHtcblxuICAgICAgICBwcml2YXRlIF93aWR0aCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2hlaWdodCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3RleHQgPSBuZXcgU3RyaW5nUHJvcGVydHkoXCJcIiwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYmFja2dyb3VuZCA9IG5ldyBCYWNrZ3JvdW5kUHJvcGVydHkobmV3IENvbG9yQmFja2dyb3VuZChDb2xvci5XSElURSksIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfZm9yZUNvbG9yID0gbmV3IENvbG9yUHJvcGVydHkoQ29sb3IuQkxBQ0ssIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdGV4dEFsaWduID0gbmV3IFByb3BlcnR5PEVUZXh0QWxpZ24+KEVUZXh0QWxpZ24uTEVGVCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdmVydGljYWxBbGlnbiA9IG5ldyBQcm9wZXJ0eTxFVkFsaWduPihFVkFsaWduLlRPUCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYm9sZCA9IG5ldyBCb29sZWFuUHJvcGVydHkoZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2l0YWxpYyA9IG5ldyBCb29sZWFuUHJvcGVydHkoZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3VuZGVybGluZSA9IG5ldyBCb29sZWFuUHJvcGVydHkoZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2ZvbnRTaXplID0gbmV3IE51bWJlclByb3BlcnR5KDEyLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9mb250RmFtaWx5ID0gbmV3IFByb3BlcnR5PEZvbnRGYW1pbHk+KEZvbnRGYW1pbHkuQXJpYWwsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3BsYWNlaG9sZGVyID0gbmV3IFN0cmluZ1Byb3BlcnR5KG51bGwsIHRydWUpO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwicGFzc3dvcmRcIik7XG5cbiAgICAgICAgICAgIHRoaXMuYm9yZGVyID0gQm9yZGVyLmNyZWF0ZSgxLCBDb2xvci5MSUdIVF9HUkFZLCAwKTtcbiAgICAgICAgICAgIHRoaXMuX3dpZHRoLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy53aWR0aCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcIndpZHRoXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aCA9IHRoaXMud2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9oZWlnaHQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhlaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImhlaWdodFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHQgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl90ZXh0LmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50ZXh0ICE9IHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgdGhpcy50ZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2ZvcmVDb2xvci5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9yZUNvbG9yID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmNvbG9yID0gXCJyZ2JhKDAsMCwwLCAwLjApXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmNvbG9yID0gdGhpcy5mb3JlQ29sb3IudG9DU1MoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2ZvcmVDb2xvci5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl90ZXh0QWxpZ24uYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudGV4dEFsaWduLmFwcGx5KHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3RleHRBbGlnbi5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl92ZXJ0aWNhbEFsaWduLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdGEgPSB0aGlzLnZlcnRpY2FsQWxpZ247XG4gICAgICAgICAgICAgICAgaWYgKHRhID09IEVWQWxpZ24uVE9QKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52ZXJ0aWNhbEFsaWduID0gXCJ0b3BcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRhID09IEVWQWxpZ24uTUlERExFKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52ZXJ0aWNhbEFsaWduID0gXCJtaWRkbGVcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRhID09IEVWQWxpZ24uQk9UVE9NKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52ZXJ0aWNhbEFsaWduID0gXCJib3R0b21cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRpY2FsQWxpZ24uaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fdW5kZXJsaW5lLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy51bmRlcmxpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRleHREZWNvcmF0aW9uID0gXCJ1bmRlcmxpbmVcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudGV4dERlY29yYXRpb24gPSBcIm5vbmVcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3VuZGVybGluZS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9ib2xkLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ib2xkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250V2VpZ2h0ID0gXCJib2xkXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZvbnRXZWlnaHQgPSBcIm5vcm1hbFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fYm9sZC5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9pdGFsaWMuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLml0YWxpYykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFN0eWxlID0gXCJpdGFsaWNcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFN0eWxlID0gXCJub3JtYWxcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2l0YWxpYy5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9mb250U2l6ZS5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZvbnRTaXplID0gdGhpcy5mb250U2l6ZSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZm9udFNpemUuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fZm9udEZhbWlseS5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5mb250RmFtaWx5LmFwcGx5KHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2ZvbnRGYW1pbHkuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYmFja2dyb3VuZCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImJhY2tncm91bmRDb2xvclwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYmFja2dyb3VuZEltYWdlXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZC5hcHBseSh0aGlzLmVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZC5pbnZhbGlkYXRlKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3BsYWNlaG9sZGVyLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wbGFjZWhvbGRlciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIiwgdGhpcy5wbGFjZWhvbGRlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuV2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHdpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLldpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgaGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuSGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBoZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuSGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVGV4dCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZXh0O1xuICAgICAgICB9XG4gICAgICAgIGdldCB0ZXh0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVGV4dC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdGV4dCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5UZXh0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQmFja2dyb3VuZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9iYWNrZ3JvdW5kO1xuICAgICAgICB9XG4gICAgICAgIGdldCBiYWNrZ3JvdW5kKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQmFja2dyb3VuZC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYmFja2dyb3VuZCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5CYWNrZ3JvdW5kLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgRm9yZUNvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvcmVDb2xvcjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgZm9yZUNvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRm9yZUNvbG9yLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBmb3JlQ29sb3IodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuRm9yZUNvbG9yLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVGV4dEFsaWduKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RleHRBbGlnbjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdGV4dEFsaWduKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVGV4dEFsaWduLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0ZXh0QWxpZ24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVGV4dEFsaWduLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVmVydGljYWxBbGlnbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92ZXJ0aWNhbEFsaWduO1xuICAgICAgICB9XG4gICAgICAgIGdldCB2ZXJ0aWNhbEFsaWduKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVmVydGljYWxBbGlnbi52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdmVydGljYWxBbGlnbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5WZXJ0aWNhbEFsaWduLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm9sZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib2xkO1xuICAgICAgICB9XG4gICAgICAgIGdldCBib2xkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm9sZC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYm9sZCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Cb2xkLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgSXRhbGljKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2l0YWxpYztcbiAgICAgICAgfVxuICAgICAgICBnZXQgaXRhbGljKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuSXRhbGljLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBpdGFsaWModmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuSXRhbGljLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVW5kZXJsaW5lKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3VuZGVybGluZTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdW5kZXJsaW5lKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVW5kZXJsaW5lLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB1bmRlcmxpbmUodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVW5kZXJsaW5lLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgRm9udFNpemUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9udFNpemU7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGZvbnRTaXplKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRm9udFNpemUudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGZvbnRTaXplKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkZvbnRTaXplLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgRm9udEZhbWlseSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb250RmFtaWx5O1xuICAgICAgICB9XG4gICAgICAgIGdldCBmb250RmFtaWx5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRm9udEZhbWlseS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgZm9udEZhbWlseSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Gb250RmFtaWx5LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgUGxhY2Vob2xkZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGxhY2Vob2xkZXI7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHBsYWNlaG9sZGVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuUGxhY2Vob2xkZXIudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHBsYWNlaG9sZGVyKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlBsYWNlaG9sZGVyLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgIH1cblxufVxuXG5cbiIsIm1vZHVsZSBjdWJlZSB7XG5cbiAgICBleHBvcnQgY2xhc3MgVGV4dEFyZWEgZXh0ZW5kcyBBQ29tcG9uZW50IHtcblxuICAgICAgICBwcml2YXRlIF93aWR0aCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2hlaWdodCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3RleHQgPSBuZXcgU3RyaW5nUHJvcGVydHkoXCJcIiwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYmFja2dyb3VuZCA9IG5ldyBCYWNrZ3JvdW5kUHJvcGVydHkobmV3IENvbG9yQmFja2dyb3VuZChDb2xvci5XSElURSksIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfZm9yZUNvbG9yID0gbmV3IENvbG9yUHJvcGVydHkoQ29sb3IuQkxBQ0ssIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdGV4dEFsaWduID0gbmV3IFByb3BlcnR5PEVUZXh0QWxpZ24+KEVUZXh0QWxpZ24uTEVGVCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdmVydGljYWxBbGlnbiA9IG5ldyBQcm9wZXJ0eTxFVkFsaWduPihFVkFsaWduLlRPUCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYm9sZCA9IG5ldyBCb29sZWFuUHJvcGVydHkoZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2l0YWxpYyA9IG5ldyBCb29sZWFuUHJvcGVydHkoZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3VuZGVybGluZSA9IG5ldyBCb29sZWFuUHJvcGVydHkoZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2ZvbnRTaXplID0gbmV3IE51bWJlclByb3BlcnR5KDEyLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9mb250RmFtaWx5ID0gbmV3IFByb3BlcnR5PEZvbnRGYW1pbHk+KEZvbnRGYW1pbHkuQXJpYWwsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3BsYWNlaG9sZGVyID0gbmV3IFN0cmluZ1Byb3BlcnR5KG51bGwsIHRydWUpO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRleHRhcmVhXCIpKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwidGV4dFwiKTtcblxuICAgICAgICAgICAgdGhpcy5ib3JkZXIgPSBCb3JkZXIuY3JlYXRlKDEsIENvbG9yLkxJR0hUX0dSQVksIDApO1xuICAgICAgICAgICAgdGhpcy5fd2lkdGguYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLndpZHRoID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwid2lkdGhcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLndpZHRoID0gdGhpcy53aWR0aCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2hlaWdodC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGVpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiaGVpZ2h0XCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3RleHQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRleHQgIT0gdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShcInZhbHVlXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCB0aGlzLnRleHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZm9yZUNvbG9yLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mb3JlQ29sb3IgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuY29sb3IgPSBcInJnYmEoMCwwLDAsIDAuMClcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuY29sb3IgPSB0aGlzLmZvcmVDb2xvci50b0NTUygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZm9yZUNvbG9yLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3RleHRBbGlnbi5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0QWxpZ24uYXBwbHkodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdGV4dEFsaWduLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRpY2FsQWxpZ24uYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB0YSA9IHRoaXMudmVydGljYWxBbGlnbjtcbiAgICAgICAgICAgICAgICBpZiAodGEgPT0gRVZBbGlnbi5UT1ApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZlcnRpY2FsQWxpZ24gPSBcInRvcFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGEgPT0gRVZBbGlnbi5NSURETEUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZlcnRpY2FsQWxpZ24gPSBcIm1pZGRsZVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGEgPT0gRVZBbGlnbi5CT1RUT00pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZlcnRpY2FsQWxpZ24gPSBcImJvdHRvbVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdmVydGljYWxBbGlnbi5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl91bmRlcmxpbmUuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnVuZGVybGluZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudGV4dERlY29yYXRpb24gPSBcInVuZGVybGluZVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50ZXh0RGVjb3JhdGlvbiA9IFwibm9uZVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdW5kZXJsaW5lLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2JvbGQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZvbnRXZWlnaHQgPSBcImJvbGRcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFdlaWdodCA9IFwibm9ybWFsXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9ib2xkLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2l0YWxpYy5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXRhbGljKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250U3R5bGUgPSBcIml0YWxpY1wiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250U3R5bGUgPSBcIm5vcm1hbFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5faXRhbGljLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2ZvbnRTaXplLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFNpemUgPSB0aGlzLmZvbnRTaXplICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9mb250U2l6ZS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9mb250RmFtaWx5LmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmZvbnRGYW1pbHkuYXBwbHkodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZm9udEZhbWlseS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9iYWNrZ3JvdW5kLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5iYWNrZ3JvdW5kID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYmFja2dyb3VuZENvbG9yXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJiYWNrZ3JvdW5kSW1hZ2VcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLmFwcGx5KHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9iYWNrZ3JvdW5kLmludmFsaWRhdGUoKTtcblxuICAgICAgICAgICAgdGhpcy5fcGxhY2Vob2xkZXIuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBsYWNlaG9sZGVyID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShcInBsYWNlaG9sZGVyXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiLCB0aGlzLnBsYWNlaG9sZGVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBXaWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgd2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5XaWR0aC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgd2lkdGgodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuV2lkdGgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBIZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGdldCBoZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5IZWlnaHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGhlaWdodCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5IZWlnaHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUZXh0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RleHQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRleHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UZXh0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0ZXh0KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRleHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBCYWNrZ3JvdW5kKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JhY2tncm91bmQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJhY2tncm91bmQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5CYWNrZ3JvdW5kLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBiYWNrZ3JvdW5kKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkJhY2tncm91bmQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBGb3JlQ29sb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9yZUNvbG9yO1xuICAgICAgICB9XG4gICAgICAgIGdldCBmb3JlQ29sb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Gb3JlQ29sb3IudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGZvcmVDb2xvcih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Gb3JlQ29sb3IudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUZXh0QWxpZ24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGV4dEFsaWduO1xuICAgICAgICB9XG4gICAgICAgIGdldCB0ZXh0QWxpZ24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UZXh0QWxpZ24udmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHRleHRBbGlnbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5UZXh0QWxpZ24udmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBWZXJ0aWNhbEFsaWduKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZlcnRpY2FsQWxpZ247XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHZlcnRpY2FsQWxpZ24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5WZXJ0aWNhbEFsaWduLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB2ZXJ0aWNhbEFsaWduKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlZlcnRpY2FsQWxpZ24udmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBCb2xkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvbGQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJvbGQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Cb2xkLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBib2xkKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkJvbGQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBJdGFsaWMoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faXRhbGljO1xuICAgICAgICB9XG4gICAgICAgIGdldCBpdGFsaWMoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5JdGFsaWMudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGl0YWxpYyh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5JdGFsaWMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBVbmRlcmxpbmUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdW5kZXJsaW5lO1xuICAgICAgICB9XG4gICAgICAgIGdldCB1bmRlcmxpbmUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5VbmRlcmxpbmUudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHVuZGVybGluZSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5VbmRlcmxpbmUudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBGb250U2l6ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb250U2l6ZTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgZm9udFNpemUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Gb250U2l6ZS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgZm9udFNpemUodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuRm9udFNpemUudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBGb250RmFtaWx5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvbnRGYW1pbHk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGZvbnRGYW1pbHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Gb250RmFtaWx5LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBmb250RmFtaWx5KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkZvbnRGYW1pbHkudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBQbGFjZWhvbGRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wbGFjZWhvbGRlcjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgcGxhY2Vob2xkZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5QbGFjZWhvbGRlci52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgcGxhY2Vob2xkZXIodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuUGxhY2Vob2xkZXIudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG5cbiAgICB9XG5cbn1cblxuXG4iLCJtb2R1bGUgY3ViZWUge1xuXG4gICAgZXhwb3J0IGNsYXNzIENoZWNrQm94IGV4dGVuZHMgQUNvbXBvbmVudCB7XG5cbiAgICAgICAgcHJpdmF0ZSBfY2hlY2tlZCA9IG5ldyBCb29sZWFuUHJvcGVydHkoZmFsc2UsIGZhbHNlKTtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKSk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImNoZWNrYm94XCIpO1xuXG4gICAgICAgICAgICB0aGlzLl9jaGVja2VkLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgZTogYW55ID0gdGhpcy5lbGVtZW50O1xuICAgICAgICAgICAgICAgIGUuY2hlY2tlZCA9IHRoaXMuY2hlY2tlZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBnZXQgQ2hlY2tlZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGVja2VkO1xuICAgICAgICB9XG4gICAgICAgIGdldCBjaGVja2VkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQ2hlY2tlZC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgY2hlY2tlZCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5DaGVja2VkLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgIH1cblxufVxuXG5cbiIsIm1vZHVsZSBjdWJlZSB7XG5cbiAgICBleHBvcnQgY2xhc3MgQ29tYm9Cb3g8VD4gZXh0ZW5kcyBBQ29tcG9uZW50IHtcblxuICAgICAgICBwcml2YXRlIF9zZWxlY3RlZEluZGV4ID0gbmV3IE51bWJlclByb3BlcnR5KC0xLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9zZWxlY3RlZEl0ZW0gPSBuZXcgUHJvcGVydHk8VD4obnVsbCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIGl0ZW1zOiBUW10gPSBbXTtcbiAgICAgICAgcHJpdmF0ZSBfd2lkdGggPSBuZXcgTnVtYmVyUHJvcGVydHkobnVsbCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9oZWlnaHQgPSBuZXcgTnVtYmVyUHJvcGVydHkobnVsbCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF90ZXh0ID0gbmV3IFN0cmluZ1Byb3BlcnR5KFwiXCIsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2JhY2tncm91bmQgPSBuZXcgQmFja2dyb3VuZFByb3BlcnR5KG5ldyBDb2xvckJhY2tncm91bmQoQ29sb3IuV0hJVEUpLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2ZvcmVDb2xvciA9IG5ldyBDb2xvclByb3BlcnR5KENvbG9yLkJMQUNLLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3RleHRBbGlnbiA9IG5ldyBQcm9wZXJ0eTxFVGV4dEFsaWduPihFVGV4dEFsaWduLkxFRlQsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3ZlcnRpY2FsQWxpZ24gPSBuZXcgUHJvcGVydHk8RVZBbGlnbj4oRVZBbGlnbi5UT1AsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2JvbGQgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9pdGFsaWMgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF91bmRlcmxpbmUgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9mb250U2l6ZSA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgxMiwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfZm9udEZhbWlseSA9IG5ldyBQcm9wZXJ0eTxGb250RmFtaWx5PihGb250RmFtaWx5LkFyaWFsLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9wbGFjZWhvbGRlciA9IG5ldyBTdHJpbmdQcm9wZXJ0eShudWxsLCB0cnVlKTtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKSk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInNlbGVjdFwiKTtcblxuICAgICAgICAgICAgdGhpcy5ib3JkZXIgPSBCb3JkZXIuY3JlYXRlKDEsIENvbG9yLkxJR0hUX0dSQVksIDApO1xuICAgICAgICAgICAgdGhpcy5fd2lkdGguYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLndpZHRoID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwid2lkdGhcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLndpZHRoID0gdGhpcy53aWR0aCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2hlaWdodC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGVpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiaGVpZ2h0XCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3RleHQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRleHQgIT0gdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShcInZhbHVlXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCB0aGlzLnRleHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZm9yZUNvbG9yLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mb3JlQ29sb3IgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuY29sb3IgPSBcInJnYmEoMCwwLDAsIDAuMClcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuY29sb3IgPSB0aGlzLmZvcmVDb2xvci50b0NTUygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZm9yZUNvbG9yLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3RleHRBbGlnbi5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0QWxpZ24uYXBwbHkodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdGV4dEFsaWduLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRpY2FsQWxpZ24uYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB0YSA9IHRoaXMudmVydGljYWxBbGlnbjtcbiAgICAgICAgICAgICAgICBpZiAodGEgPT0gRVZBbGlnbi5UT1ApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZlcnRpY2FsQWxpZ24gPSBcInRvcFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGEgPT0gRVZBbGlnbi5NSURETEUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZlcnRpY2FsQWxpZ24gPSBcIm1pZGRsZVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGEgPT0gRVZBbGlnbi5CT1RUT00pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZlcnRpY2FsQWxpZ24gPSBcImJvdHRvbVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdmVydGljYWxBbGlnbi5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl91bmRlcmxpbmUuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnVuZGVybGluZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudGV4dERlY29yYXRpb24gPSBcInVuZGVybGluZVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50ZXh0RGVjb3JhdGlvbiA9IFwibm9uZVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdW5kZXJsaW5lLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2JvbGQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZvbnRXZWlnaHQgPSBcImJvbGRcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFdlaWdodCA9IFwibm9ybWFsXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9ib2xkLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2l0YWxpYy5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXRhbGljKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250U3R5bGUgPSBcIml0YWxpY1wiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250U3R5bGUgPSBcIm5vcm1hbFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5faXRhbGljLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2ZvbnRTaXplLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFNpemUgPSB0aGlzLmZvbnRTaXplICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9mb250U2l6ZS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9mb250RmFtaWx5LmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmZvbnRGYW1pbHkuYXBwbHkodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZm9udEZhbWlseS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9iYWNrZ3JvdW5kLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5iYWNrZ3JvdW5kID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYmFja2dyb3VuZENvbG9yXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJiYWNrZ3JvdW5kSW1hZ2VcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLmFwcGx5KHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9iYWNrZ3JvdW5kLmludmFsaWRhdGUoKTtcblxuICAgICAgICAgICAgdGhpcy5fcGxhY2Vob2xkZXIuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBsYWNlaG9sZGVyID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShcInBsYWNlaG9sZGVyXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiLCB0aGlzLnBsYWNlaG9sZGVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB2YWwgPSAoPEhUTUxTZWxlY3RFbGVtZW50PnRoaXMuZWxlbWVudCkudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHZhbCA9PSBudWxsIHx8IHZhbCA9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkSW5kZXgudmFsdWUgPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRJdGVtLnZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZEluZGV4LnZhbHVlID0gcGFyc2VJbnQodmFsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRJbmRleC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRJdGVtLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX3NlbGVjdGVkSXRlbS52YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkSW5kZXgudmFsdWUgPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgKDxIVE1MU2VsZWN0RWxlbWVudD50aGlzLmVsZW1lbnQpLnZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLml0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbSA9PSB0aGlzLml0ZW1zW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkSW5kZXgudmFsdWUgPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICg8SFRNTFNlbGVjdEVsZW1lbnQ+dGhpcy5lbGVtZW50KS52YWx1ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZEluZGV4LnZhbHVlID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICAoPEhUTUxTZWxlY3RFbGVtZW50PnRoaXMuZWxlbWVudCkudmFsdWUgPSBcIlwiICsgaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBXaWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgd2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5XaWR0aC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgd2lkdGgodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuV2lkdGgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBIZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGdldCBoZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5IZWlnaHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGhlaWdodCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5IZWlnaHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUZXh0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RleHQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRleHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UZXh0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0ZXh0KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRleHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBCYWNrZ3JvdW5kKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JhY2tncm91bmQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJhY2tncm91bmQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5CYWNrZ3JvdW5kLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBiYWNrZ3JvdW5kKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkJhY2tncm91bmQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBGb3JlQ29sb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9yZUNvbG9yO1xuICAgICAgICB9XG4gICAgICAgIGdldCBmb3JlQ29sb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Gb3JlQ29sb3IudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGZvcmVDb2xvcih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Gb3JlQ29sb3IudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUZXh0QWxpZ24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGV4dEFsaWduO1xuICAgICAgICB9XG4gICAgICAgIGdldCB0ZXh0QWxpZ24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UZXh0QWxpZ24udmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHRleHRBbGlnbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5UZXh0QWxpZ24udmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBWZXJ0aWNhbEFsaWduKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZlcnRpY2FsQWxpZ247XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHZlcnRpY2FsQWxpZ24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5WZXJ0aWNhbEFsaWduLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB2ZXJ0aWNhbEFsaWduKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlZlcnRpY2FsQWxpZ24udmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBCb2xkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvbGQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJvbGQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Cb2xkLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBib2xkKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkJvbGQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBJdGFsaWMoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faXRhbGljO1xuICAgICAgICB9XG4gICAgICAgIGdldCBpdGFsaWMoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5JdGFsaWMudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGl0YWxpYyh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5JdGFsaWMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBVbmRlcmxpbmUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdW5kZXJsaW5lO1xuICAgICAgICB9XG4gICAgICAgIGdldCB1bmRlcmxpbmUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5VbmRlcmxpbmUudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHVuZGVybGluZSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5VbmRlcmxpbmUudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBGb250U2l6ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb250U2l6ZTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgZm9udFNpemUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Gb250U2l6ZS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgZm9udFNpemUodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuRm9udFNpemUudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBGb250RmFtaWx5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvbnRGYW1pbHk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGZvbnRGYW1pbHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Gb250RmFtaWx5LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBmb250RmFtaWx5KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkZvbnRGYW1pbHkudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBQbGFjZWhvbGRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wbGFjZWhvbGRlcjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgcGxhY2Vob2xkZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5QbGFjZWhvbGRlci52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgcGxhY2Vob2xkZXIodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuUGxhY2Vob2xkZXIudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcHJvdGVjdGVkIHNlbGVjdGVkSW5kZXhQcm9wZXJ0eSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZEluZGV4O1xuICAgICAgICB9XG4gICAgICAgIGdldCBTZWxlY3RlZEluZGV4KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRJbmRleFByb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHNlbGVjdGVkSW5kZXgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5TZWxlY3RlZEluZGV4LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBzZWxlY3RlZEluZGV4KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlNlbGVjdGVkSW5kZXgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcHJvdGVjdGVkIHNlbGVjdGVkSXRlbVByb3BlcnR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkSXRlbTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgU2VsZWN0ZWRJdGVtKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRJdGVtUHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgc2VsZWN0ZWRJdGVtKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuU2VsZWN0ZWRJdGVtLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBzZWxlY3RlZEl0ZW0odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRJdGVtLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgIH1cblxufVxuXG5cbiIsIm1vZHVsZSBjdWJlZSB7XG5cbiAgICBleHBvcnQgY2xhc3MgUGljdHVyZUJveCBleHRlbmRzIEFDb21wb25lbnQge1xuXG4gICAgICAgIHByaXZhdGUgX3dpZHRoID0gbmV3IE51bWJlclByb3BlcnR5KDUwLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9oZWlnaHQgPSBuZXcgTnVtYmVyUHJvcGVydHkoNTAsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3BpY3R1cmVTaXplTW9kZSA9IG5ldyBQcm9wZXJ0eTxFUGljdHVyZVNpemVNb2RlPihFUGljdHVyZVNpemVNb2RlLk5PUk1BTCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfaW1hZ2UgPSBuZXcgUHJvcGVydHk8SW1hZ2U+KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYmFja2dyb3VuZCA9IG5ldyBCYWNrZ3JvdW5kUHJvcGVydHkobnVsbCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9pbWdFbGVtZW50OiBIVE1MSW1hZ2VFbGVtZW50ID0gbnVsbDtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgIHRoaXMuX2ltZ0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICAgICAgdGhpcy5faW1nRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLl9pbWdFbGVtZW50KTtcbiAgICAgICAgICAgIHRoaXMuX3dpZHRoLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlY2FsY3VsYXRlU2l6ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl93aWR0aC5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9oZWlnaHQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucmVjYWxjdWxhdGVTaXplKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2hlaWdodC5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9waWN0dXJlU2l6ZU1vZGUuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucmVjYWxjdWxhdGVTaXplKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3BpY3R1cmVTaXplTW9kZS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9pbWFnZS5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2ltYWdlLnZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbWFnZS5hcHBseSh0aGlzLl9pbWdFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmltYWdlLmxvYWRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbWFnZS5vbkxvYWQuYWRkTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVjYWxjdWxhdGVTaXplKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ltZ0VsZW1lbnQuc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlY2FsY3VsYXRlU2l6ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9pbWFnZS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9iYWNrZ3JvdW5kLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5iYWNrZ3JvdW5kID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYmFja2dyb3VuZENvbG9yXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJiYWNrZ3JvdW5kSW1hZ2VcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLmFwcGx5KHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9iYWNrZ3JvdW5kLmludmFsaWRhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgcmVjYWxjdWxhdGVTaXplKCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLndpZHRoID0gdGhpcy53aWR0aCArIFwicHhcIjtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodCArIFwicHhcIjtcbiAgICAgICAgICAgIGxldCBwc20gPSB0aGlzLnBpY3R1cmVTaXplTW9kZTtcbiAgICAgICAgICAgIGxldCBpbWdXaWR0aCA9IDA7XG4gICAgICAgICAgICBsZXQgaW1nSGVpZ2h0ID0gMDtcbiAgICAgICAgICAgIGxldCBwaWNXaWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICAgICAgICBsZXQgcGljSGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgICAgICAgICBsZXQgY3ggPSAwO1xuICAgICAgICAgICAgbGV0IGN5ID0gMDtcbiAgICAgICAgICAgIGxldCBjdyA9IDA7XG4gICAgICAgICAgICBsZXQgY2ggPSAwO1xuICAgICAgICAgICAgbGV0IGltZ1JhdGlvOiBudW1iZXIgPSBudWxsO1xuICAgICAgICAgICAgbGV0IHBpY1JhdGlvID0gcGljV2lkdGggLyBwaWNIZWlnaHQ7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmltYWdlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpbWdXaWR0aCA9IHRoaXMuaW1hZ2Uud2lkdGg7XG4gICAgICAgICAgICAgICAgaW1nSGVpZ2h0ID0gdGhpcy5pbWFnZS5oZWlnaHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW1nV2lkdGggPT0gMCB8fCBpbWdIZWlnaHQgPT0gMCkge1xuICAgICAgICAgICAgICAgIC8vIG5vdGhpbmcgdG8gZG8gaGVyZVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbWdSYXRpbyA9IGltZ1dpZHRoIC8gaW1nSGVpZ2h0O1xuICAgICAgICAgICAgICAgIGlmIChwc20gPT0gRVBpY3R1cmVTaXplTW9kZS5DRU5URVIpIHtcbiAgICAgICAgICAgICAgICAgICAgY3ggPSAoaW1nV2lkdGggLSBwaWNXaWR0aCkgLyAyO1xuICAgICAgICAgICAgICAgICAgICBjeSA9IChpbWdIZWlnaHQgLSBwaWNIZWlnaHQpIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgY3cgPSBpbWdXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgY2ggPSBpbWdIZWlnaHQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwc20gPT0gRVBpY3R1cmVTaXplTW9kZS5GSUxMKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbWdSYXRpbyA+IHBpY1JhdGlvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmaXQgaGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgICAgICBjeSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaCA9IHBpY0hlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN3ID0gKGNoICogaW1nUmF0aW8pIHwgMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN4ID0gKHBpY1dpZHRoIC0gY3cpIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZpdCB3aWR0aFxuICAgICAgICAgICAgICAgICAgICAgICAgY3ggPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3cgPSBwaWNXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoID0gKGN3IC8gaW1nUmF0aW8pIHwgMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN5ID0gKHBpY0hlaWdodCAtIGNoKSAvIDI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHBzbSA9PSBFUGljdHVyZVNpemVNb2RlLkZJVF9IRUlHSFQpIHtcbiAgICAgICAgICAgICAgICAgICAgY3kgPSAwO1xuICAgICAgICAgICAgICAgICAgICBjaCA9IHBpY0hlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgY3cgPSAoY2ggKiBpbWdSYXRpbykgfCAwO1xuICAgICAgICAgICAgICAgICAgICBjeCA9IChwaWNXaWR0aCAtIGN3KSAvIDI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwc20gPT0gRVBpY3R1cmVTaXplTW9kZS5GSVRfV0lEVEgpIHtcbiAgICAgICAgICAgICAgICAgICAgY3ggPSAwO1xuICAgICAgICAgICAgICAgICAgICBjdyA9IHBpY1dpZHRoO1xuICAgICAgICAgICAgICAgICAgICBjaCA9IChjdyAvIGltZ1JhdGlvKSB8IDA7XG4gICAgICAgICAgICAgICAgICAgIGN5ID0gKHBpY0hlaWdodCAtIGNoKSAvIDI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwc20gPT0gRVBpY3R1cmVTaXplTW9kZS5OT1JNQUwpIHtcbiAgICAgICAgICAgICAgICAgICAgY3ggPSAwO1xuICAgICAgICAgICAgICAgICAgICBjeSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGN3ID0gaW1nV2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIGNoID0gaW1nSGVpZ2h0O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocHNtID09IEVQaWN0dXJlU2l6ZU1vZGUuU1RSRVRDSCkge1xuICAgICAgICAgICAgICAgICAgICBjeCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGN5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgY3cgPSBwaWNXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgY2ggPSBwaWNIZWlnaHQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwc20gPT0gRVBpY3R1cmVTaXplTW9kZS5aT09NKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbWdSYXRpbyA+IHBpY1JhdGlvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmaXQgd2lkdGhcbiAgICAgICAgICAgICAgICAgICAgICAgIGN4ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN3ID0gcGljV2lkdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaCA9IChjdyAvIGltZ1JhdGlvKSB8IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBjeSA9IChwaWNIZWlnaHQgLSBjaCkgLyAyO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZml0IGhlaWdodFxuICAgICAgICAgICAgICAgICAgICAgICAgY3kgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2ggPSBwaWNIZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdyA9IChjaCAqIGltZ1JhdGlvKSB8IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBjeCA9IChwaWNXaWR0aCAtIGN3KSAvIDI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0gY3ggKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gY3kgKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2lkdGggPSBjdyArIFwicHhcIjtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBjaCArIFwicHhcIjtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIHBpY3R1cmVTaXplTW9kZVByb3BlcnR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BpY3R1cmVTaXplTW9kZTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgUGljdHVyZVNpemVNb2RlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGljdHVyZVNpemVNb2RlUHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgcGljdHVyZVNpemVNb2RlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuUGljdHVyZVNpemVNb2RlLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBwaWN0dXJlU2l6ZU1vZGUodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuUGljdHVyZVNpemVNb2RlLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgd2lkdGhQcm9wZXJ0eSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy53aWR0aFByb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuV2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHdpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLldpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgaGVpZ2h0UHJvcGVydHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGdldCBIZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oZWlnaHRQcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIGdldCBoZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5IZWlnaHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGhlaWdodCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5IZWlnaHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBwYWRkaW5nUHJvcGVydHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIucGFkZGluZ1Byb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IFBhZGRpbmcoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYWRkaW5nUHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgcGFkZGluZygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlBhZGRpbmcudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHBhZGRpbmcodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuUGFkZGluZy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIGJvcmRlclByb3BlcnR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmJvcmRlclByb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IEJvcmRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJvcmRlclByb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJvcmRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkJvcmRlci52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYm9yZGVyKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkJvcmRlci52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIGJhY2tncm91bmRQcm9wZXJ0eSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9iYWNrZ3JvdW5kO1xuICAgICAgICB9XG4gICAgICAgIGdldCBCYWNrZ3JvdW5kKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYmFja2dyb3VuZFByb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJhY2tncm91bmQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5CYWNrZ3JvdW5kLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBiYWNrZ3JvdW5kKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkJhY2tncm91bmQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBpbWFnZVByb3BlcnR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ltYWdlO1xuICAgICAgICB9XG4gICAgICAgIGdldCBJbWFnZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmltYWdlUHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgaW1hZ2UoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5JbWFnZS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgaW1hZ2UodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuSW1hZ2UudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG59XG5cbiIsIm1vZHVsZSBjdWJlZSB7XG5cbiAgICBleHBvcnQgY2xhc3MgQVBvcHVwIHtcblxuICAgICAgICBwcml2YXRlIF9tb2RhbDogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBwcml2YXRlIF9hdXRvQ2xvc2UgPSB0cnVlO1xuICAgICAgICBwcml2YXRlIF9nbGFzc0NvbG9yID0gQ29sb3IuVFJBTlNQQVJFTlQ7XG5cbiAgICAgICAgcHJpdmF0ZSBfdHJhbnNsYXRlWCA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF90cmFuc2xhdGVZID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2NlbnRlciA9IG5ldyBCb29sZWFuUHJvcGVydHkoZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG5cbiAgICAgICAgcHJpdmF0ZSBfcG9wdXBSb290OiBQYW5lbCA9IG51bGw7XG4gICAgICAgIHByaXZhdGUgX3Jvb3RDb21wb25lbnRDb250YWluZXI6IFBhbmVsID0gbnVsbDtcbiAgICAgICAgcHJpdmF0ZSBfcm9vdENvbXBvbmVudDogQUNvbXBvbmVudCA9IG51bGw7XG5cbiAgICAgICAgcHJpdmF0ZSBfdmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKG1vZGFsOiBib29sZWFuID0gdHJ1ZSwgYXV0b0Nsb3NlOiBib29sZWFuID0gdHJ1ZSwgZ2xhc3NDb2xvciA9IENvbG9yLmdldEFyZ2JDb2xvcigweDAwMDAwMDAwKSkge1xuICAgICAgICAgICAgdGhpcy5fbW9kYWwgPSBtb2RhbDtcbiAgICAgICAgICAgIHRoaXMuX2F1dG9DbG9zZSA9IGF1dG9DbG9zZTtcbiAgICAgICAgICAgIHRoaXMuX2dsYXNzQ29sb3IgPSBnbGFzc0NvbG9yO1xuICAgICAgICAgICAgdGhpcy5fcG9wdXBSb290ID0gbmV3IFBhbmVsKCk7XG4gICAgICAgICAgICB0aGlzLl9wb3B1cFJvb3QuZWxlbWVudC5zdHlsZS5sZWZ0ID0gXCIwcHhcIjtcbiAgICAgICAgICAgIHRoaXMuX3BvcHVwUm9vdC5lbGVtZW50LnN0eWxlLnRvcCA9IFwiMHB4XCI7XG4gICAgICAgICAgICB0aGlzLl9wb3B1cFJvb3QuZWxlbWVudC5zdHlsZS5yaWdodCA9IFwiMHB4XCI7XG4gICAgICAgICAgICB0aGlzLl9wb3B1cFJvb3QuZWxlbWVudC5zdHlsZS5ib3R0b20gPSBcIjBweFwiO1xuICAgICAgICAgICAgdGhpcy5fcG9wdXBSb290LmVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSBcImZpeGVkXCI7XG4gICAgICAgICAgICBpZiAoZ2xhc3NDb2xvciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcG9wdXBSb290LmJhY2tncm91bmQgPSBuZXcgQ29sb3JCYWNrZ3JvdW5kKGdsYXNzQ29sb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1vZGFsIHx8IGF1dG9DbG9zZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3BvcHVwUm9vdC5lbGVtZW50LnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcImFsbFwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wb3B1cFJvb3QuZWxlbWVudC5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJub25lXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5fcG9wdXBSb290LnBvaW50ZXJUcmFuc3BhcmVudCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX3Jvb3RDb21wb25lbnRDb250YWluZXIgPSBuZXcgUGFuZWwoKTtcbiAgICAgICAgICAgIHRoaXMuX3Jvb3RDb21wb25lbnRDb250YWluZXIuVHJhbnNsYXRlWC5iaW5kKG5ldyBFeHByZXNzaW9uPG51bWJlcj4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBiYXNlWCA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2NlbnRlci52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBiYXNlWCA9ICh0aGlzLl9wb3B1cFJvb3QuY2xpZW50V2lkdGggLSB0aGlzLl9yb290Q29tcG9uZW50Q29udGFpbmVyLmJvdW5kc1dpZHRoKSAvIDI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBiYXNlWCArIHRoaXMuX3RyYW5zbGF0ZVgudmFsdWU7XG4gICAgICAgICAgICB9LCB0aGlzLl9jZW50ZXIsIHRoaXMuX3BvcHVwUm9vdC5DbGllbnRXaWR0aCwgdGhpcy5fdHJhbnNsYXRlWCxcbiAgICAgICAgICAgICAgICB0aGlzLl9yb290Q29tcG9uZW50Q29udGFpbmVyLkJvdW5kc1dpZHRoKSk7XG4gICAgICAgICAgICB0aGlzLl9yb290Q29tcG9uZW50Q29udGFpbmVyLlRyYW5zbGF0ZVkuYmluZChuZXcgRXhwcmVzc2lvbjxudW1iZXI+KCgpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgYmFzZVkgPSAwO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jZW50ZXIudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgYmFzZVkgPSAodGhpcy5fcG9wdXBSb290LmNsaWVudEhlaWdodCAtIHRoaXMuX3Jvb3RDb21wb25lbnRDb250YWluZXIuYm91bmRzSGVpZ2h0KSAvIDI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBiYXNlWSArIHRoaXMuX3RyYW5zbGF0ZVkudmFsdWU7XG4gICAgICAgICAgICB9LCB0aGlzLl9jZW50ZXIsIHRoaXMuX3BvcHVwUm9vdC5DbGllbnRIZWlnaHQsIHRoaXMuX3RyYW5zbGF0ZVksXG4gICAgICAgICAgICAgICAgdGhpcy5fcm9vdENvbXBvbmVudENvbnRhaW5lci5Cb3VuZHNIZWlnaHQpKTtcbiAgICAgICAgICAgIHRoaXMuX3BvcHVwUm9vdC5jaGlsZHJlbi5hZGQodGhpcy5fcm9vdENvbXBvbmVudENvbnRhaW5lcik7XG5cbiAgICAgICAgICAgIGlmIChhdXRvQ2xvc2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wb3B1cFJvb3Qub25DbGljay5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBfX3BvcHVwUm9vdCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wb3B1cFJvb3Q7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IHJvb3RDb21wb25lbnQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcm9vdENvbXBvbmVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBzZXQgcm9vdENvbXBvbmVudChyb290Q29tcG9uZW50OiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9yb290Q29tcG9uZW50Q29udGFpbmVyLmNoaWxkcmVuLmNsZWFyKCk7XG4gICAgICAgICAgICB0aGlzLl9yb290Q29tcG9uZW50ID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChyb290Q29tcG9uZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yb290Q29tcG9uZW50Q29udGFpbmVyLmNoaWxkcmVuLmFkZChyb290Q29tcG9uZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3Jvb3RDb21wb25lbnQgPSByb290Q29tcG9uZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIHNob3coKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fdmlzaWJsZSkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhpcyBwb3B1cCBpcyBhbHJlYWR5IHNob3duLlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGJvZHk6IEhUTUxCb2R5RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXTtcbiAgICAgICAgICAgIGJvZHkuYXBwZW5kQ2hpbGQodGhpcy5fcG9wdXBSb290LmVsZW1lbnQpO1xuICAgICAgICAgICAgUG9wdXBzLl9hZGRQb3B1cCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuX3Zpc2libGUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIGNsb3NlKCk6IGJvb2xlYW4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl92aXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGlzIHBvcHVwIGlzbid0IHNob3duLlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzQ2xvc2VBbGxvd2VkKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYm9keTogSFRNTEJvZHlFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJib2R5XCIpWzBdO1xuICAgICAgICAgICAgYm9keS5yZW1vdmVDaGlsZCh0aGlzLl9wb3B1cFJvb3QuZWxlbWVudCk7XG4gICAgICAgICAgICBQb3B1cHMuX3JlbW92ZVBvcHVwKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5fdmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5vbkNsb3NlZCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgaXNDbG9zZUFsbG93ZWQoKTogYm9vbGVhbiB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBvbkNsb3NlZCgpIHtcblxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IG1vZGFsKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21vZGFsO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGF1dG9DbG9zZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hdXRvQ2xvc2U7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgZ2xhc3NDb2xvcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9nbGFzc0NvbG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFRyYW5zbGF0ZVgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNsYXRlWDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdHJhbnNsYXRlWCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlRyYW5zbGF0ZVgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHRyYW5zbGF0ZVgodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVHJhbnNsYXRlWC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFRyYW5zbGF0ZVkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNsYXRlWTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdHJhbnNsYXRlWSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlRyYW5zbGF0ZVkudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHRyYW5zbGF0ZVkodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVHJhbnNsYXRlWS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IENlbnRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jZW50ZXI7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGNlbnRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkNlbnRlci52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgY2VudGVyKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkNlbnRlci52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgX2xheW91dCgpIHtcbiAgICAgICAgICAgIHRoaXMuX3BvcHVwUm9vdC53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICAgICAgdGhpcy5fcG9wdXBSb290LmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgICAgIHRoaXMuX3BvcHVwUm9vdC5sYXlvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFBvcHVwcyB7XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX3BvcHVwczogQVBvcHVwW10gPSBbXTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX2xheW91dFJ1bk9uY2UgPSBuZXcgUnVuT25jZSgoKSA9PiB7XG4gICAgICAgICAgICBQb3B1cHMubGF5b3V0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHN0YXRpYyBfYWRkUG9wdXAocG9wdXA6IEFQb3B1cCkge1xuICAgICAgICAgICAgUG9wdXBzLl9wb3B1cHMucHVzaChwb3B1cCk7XG4gICAgICAgICAgICBQb3B1cHMuX3JlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRpYyBfcmVtb3ZlUG9wdXAocG9wdXA6IEFQb3B1cCkge1xuICAgICAgICAgICAgdmFyIGlkeCA9IFBvcHVwcy5fcG9wdXBzLmluZGV4T2YocG9wdXApO1xuICAgICAgICAgICAgaWYgKGlkeCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgUG9wdXBzLl9wb3B1cHMuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgICAgICAgICAgUG9wdXBzLl9yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0aWMgX3JlcXVlc3RMYXlvdXQoKSB7XG4gICAgICAgICAgICBQb3B1cHMuX2xheW91dFJ1bk9uY2UucnVuKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBsYXlvdXQoKSB7XG4gICAgICAgICAgICBQb3B1cHMuX3BvcHVwcy5mb3JFYWNoKChwb3B1cCkgPT4ge1xuICAgICAgICAgICAgICAgIHBvcHVwLl9sYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICB0aHJvdyBcIkNhbiBub3QgaW5zdGFudGlhdGUgUG9wdXBzIGNsYXNzLlwiXG4gICAgICAgIH1cblxuICAgIH1cblxufVxuXG5cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ1dGlscy50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJldmVudHMudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicHJvcGVydGllcy50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJzdHlsZXMudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiY29tcG9uZW50X2Jhc2UvTGF5b3V0Q2hpbGRyZW4udHNcIi8+IFxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImNvbXBvbmVudF9iYXNlL0FDb21wb25lbnQudHNcIi8+IFxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImNvbXBvbmVudF9iYXNlL0FMYXlvdXQudHNcIi8+IFxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImNvbXBvbmVudF9iYXNlL0FVc2VyQ29udHJvbC50c1wiLz4gXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiY29tcG9uZW50X2Jhc2UvQVZpZXcudHNcIi8+IFxuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwibGF5b3V0cy9QYW5lbC50c1wiLz4gIFxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImxheW91dHMvSEJveC50c1wiLz4gICBcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJsYXlvdXRzL1ZCb3gudHNcIi8+ICAgIFxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImxheW91dHMvU2Nyb2xsQm94LnRzXCIvPiAgICBcbiAgIFxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImNvbXBvbmVudHMvTGFiZWwudHNcIi8+ICBcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJjb21wb25lbnRzL0J1dHRvbi50c1wiLz4gICAgXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiY29tcG9uZW50cy9UZXh0Qm94LnRzXCIvPiAgICBcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJjb21wb25lbnRzL1Bhc3N3b3JkQm94LnRzXCIvPiAgICAgXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiY29tcG9uZW50cy9UZXh0QXJlYS50c1wiLz4gICAgXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiY29tcG9uZW50cy9DaGVja0JveC50c1wiLz4gICAgIFxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImNvbXBvbmVudHMvQ29tYm9Cb3gudHNcIi8+ICAgICBcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJjb21wb25lbnRzL1BpY3R1cmVCb3gudHNcIi8+ICAgICBcblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInBvcHVwcy50c1wiLz4gIFxuXG4vLyBodG1sIGNvbXBvbmVudFxuLy8gaHlwZXJsaW5rXG5cbi8vIGZhaWNvblxuLy8gZWljb25cblxuLy8gRVZFTlRTXG5cblxubW9kdWxlIGN1YmVlIHsgICAgICAgICAgICAgICAgXG5cbiAgICBleHBvcnQgY2xhc3MgQ3ViZWVQYW5lbCB7ICAgICAgICBcblxuICAgICAgICBwcml2YXRlIF9sYXlvdXRSdW5PbmNlOiBSdW5PbmNlID0gbnVsbDsgXG5cbiAgICAgICAgcHJpdmF0ZSBfY29udGVudFBhbmVsOiBQYW5lbCA9IG51bGw7XG4gICAgICAgIHByaXZhdGUgX3Jvb3RDb21wb25lbnQ6IEFDb21wb25lbnQgPSBudWxsO1xuXG5cbiAgICAgICAgcHJpdmF0ZSBfZWxlbWVudDogSFRNTEVsZW1lbnQ7XG5cbiAgICAgICAgcHJpdmF0ZSBfbGVmdCA9IC0xO1xuICAgICAgICBwcml2YXRlIF90b3AgPSAtMTtcbiAgICAgICAgcHJpdmF0ZSBfY2xpZW50V2lkdGggPSAtMTtcbiAgICAgICAgcHJpdmF0ZSBfY2xpZW50SGVpZ2h0ID0gLTE7XG4gICAgICAgIHByaXZhdGUgX29mZnNldFdpZHRoID0gLTE7XG4gICAgICAgIHByaXZhdGUgX29mZnNldEhlaWdodCA9IC0xO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEhUTUxEaXZFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwib25yZXNpemVcIiwgKGV2dDogVUlFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbCA9IG5ldyBQYW5lbCgpO1xuICAgICAgICAgICAgdGhpcy5fY29udGVudFBhbmVsLmVsZW1lbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9IFwibm9uZVwiO1xuICAgICAgICAgICAgdGhpcy5fY29udGVudFBhbmVsLnBvaW50ZXJUcmFuc3BhcmVudCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLl9jb250ZW50UGFuZWwuc2V0Q3ViZWVQYW5lbCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5fY29udGVudFBhbmVsLmVsZW1lbnQpO1xuXG4gICAgICAgICAgICB0aGlzLmNoZWNrQm91bmRzKCk7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcblxuICAgICAgICAgICAgdmFyIHQgPSBuZXcgVGltZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIEV2ZW50UXVldWUuSW5zdGFuY2UuaW52b2tlTGF0ZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrQm91bmRzKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHQuc3RhcnQoMTAwLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgY2hlY2tCb3VuZHMoKSB7XG4gICAgICAgICAgICAvLyBUT0RPIG9mZnNldExlZnQgLT4gYWJzb2x1dGVMZWZ0XG4gICAgICAgICAgICB2YXIgbmV3TGVmdCA9IHRoaXMuX2VsZW1lbnQub2Zmc2V0TGVmdDtcbiAgICAgICAgICAgIC8vIFRPRE8gb2Zmc2V0VG9wIC0+IGFic29sdXRlVG9wXG4gICAgICAgICAgICB2YXIgbmV3VG9wID0gdGhpcy5fZWxlbWVudC5vZmZzZXRUb3A7XG4gICAgICAgICAgICB2YXIgbmV3Q2xpZW50V2lkdGggPSB0aGlzLl9lbGVtZW50LmNsaWVudFdpZHRoO1xuICAgICAgICAgICAgdmFyIG5ld0NsaWVudEhlaWdodCA9IHRoaXMuX2VsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICAgICAgICAgICAgdmFyIG5ld09mZnNldFdpZHRoID0gdGhpcy5fZWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICAgICAgICAgIHZhciBuZXdPZmZzZXRIZWlnaHQgPSB0aGlzLl9lbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgIGlmIChuZXdMZWZ0ICE9IHRoaXMuX2xlZnQgfHwgbmV3VG9wICE9IHRoaXMuX3RvcCB8fCBuZXdDbGllbnRXaWR0aCAhPSB0aGlzLl9jbGllbnRXaWR0aCB8fCBuZXdDbGllbnRIZWlnaHQgIT0gdGhpcy5fY2xpZW50SGVpZ2h0XG4gICAgICAgICAgICAgICAgfHwgbmV3T2Zmc2V0V2lkdGggIT0gdGhpcy5fb2Zmc2V0V2lkdGggfHwgbmV3T2Zmc2V0SGVpZ2h0ICE9IHRoaXMuX29mZnNldEhlaWdodCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xlZnQgPSBuZXdMZWZ0O1xuICAgICAgICAgICAgICAgIHRoaXMuX3RvcCA9IG5ld1RvcDtcbiAgICAgICAgICAgICAgICB0aGlzLl9jbGllbnRXaWR0aCA9IG5ld0NsaWVudFdpZHRoO1xuICAgICAgICAgICAgICAgIHRoaXMuX2NsaWVudEhlaWdodCA9IG5ld0NsaWVudEhlaWdodDtcbiAgICAgICAgICAgICAgICB0aGlzLl9vZmZzZXRXaWR0aCA9IG5ld09mZnNldFdpZHRoO1xuICAgICAgICAgICAgICAgIHRoaXMuX29mZnNldEhlaWdodCA9IG5ld09mZnNldEhlaWdodDtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb250ZW50UGFuZWwud2lkdGggPSB0aGlzLl9vZmZzZXRXaWR0aDtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb250ZW50UGFuZWwuaGVpZ2h0ID0gdGhpcy5fb2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9lbGVtZW50LnN0eWxlLnBvc2l0aW9uID09IFwiYWJzb2x1dGVcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb250ZW50UGFuZWwudHJhbnNsYXRlWCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbC50cmFuc2xhdGVZID0gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb250ZW50UGFuZWwudHJhbnNsYXRlWCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbC50cmFuc2xhdGVZID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXF1ZXN0TGF5b3V0KCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2xheW91dFJ1bk9uY2UgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xheW91dFJ1bk9uY2UgPSBuZXcgUnVuT25jZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGF5b3V0KCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9sYXlvdXRSdW5PbmNlLnJ1bigpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGF5b3V0KCkge1xuICAgICAgICAgICAgUG9wdXBzLl9yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB0aGlzLl9jb250ZW50UGFuZWwubGF5b3V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgcm9vdENvbXBvbmVudCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yb290Q29tcG9uZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0IHJvb3RDb21wb25lbnQocm9vdENvbXBvbmVudDogQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgdGhpcy5fY29udGVudFBhbmVsLmNoaWxkcmVuLmNsZWFyKCk7XG4gICAgICAgICAgICB0aGlzLl9yb290Q29tcG9uZW50ID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChyb290Q29tcG9uZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb250ZW50UGFuZWwuY2hpbGRyZW4uYWRkKHJvb3RDb21wb25lbnQpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Jvb3RDb21wb25lbnQgPSByb290Q29tcG9uZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IENsaWVudFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRlbnRQYW5lbC5DbGllbnRXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgY2xpZW50V2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5DbGllbnRXaWR0aC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgY2xpZW50V2lkdGgodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQ2xpZW50V2lkdGgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBDbGllbnRIZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY29udGVudFBhbmVsLkNsaWVudEhlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgY2xpZW50SGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQ2xpZW50SGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBjbGllbnRIZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQ2xpZW50SGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm91bmRzV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY29udGVudFBhbmVsLkJvdW5kc1dpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGdldCBib3VuZHNXaWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkJvdW5kc1dpZHRoLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBib3VuZHNXaWR0aCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Cb3VuZHNXaWR0aC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEJvdW5kc0hlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250ZW50UGFuZWwuQm91bmRzSGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGdldCBib3VuZHNIZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Cb3VuZHNIZWlnaHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGJvdW5kc0hlaWdodCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Cb3VuZHNIZWlnaHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBCb3VuZHNMZWZ0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRlbnRQYW5lbC5Cb3VuZHNMZWZ0O1xuICAgICAgICB9XG4gICAgICAgIGdldCBib3VuZHNMZWZ0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm91bmRzTGVmdC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYm91bmRzTGVmdCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Cb3VuZHNMZWZ0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm91bmRzVG9wKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRlbnRQYW5lbC5Cb3VuZHNUb3A7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJvdW5kc1RvcCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkJvdW5kc1RvcC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYm91bmRzVG9wKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkJvdW5kc1RvcC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn1cblxuXG4iLCJtb2R1bGUgY3ViZWUge1xuXG4gICAgZXhwb3J0IGNsYXNzIEVJY29uIHtcblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQURKVVNUID0gbmV3IEVJY29uKFwiZmEtYWRqdXN0XCIpO1xuICAgICAgICBzdGF0aWMgZ2V0IEFESlVTVCgpIHsgcmV0dXJuIEVJY29uLl9BREpVU1Q7IH1cbiAgICAgICAgXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9BTkNIT1IgPSBuZXcgRUljb24oXCJmYS1hbmNob3JcIik7XG4gICAgICAgIHN0YXRpYyBnZXQgQU5DSE9SKCkgeyByZXR1cm4gRUljb24uX0FOQ0hPUjsgfVxuICAgICAgICBcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0FSQ0hJVkUgPSBuZXcgRUljb24oXCJmYS1hcmNoaXZlXCIpO1xuICAgICAgICBzdGF0aWMgZ2V0IEFSQ0hJVkUoKSB7IHJldHVybiBFSWNvbi5fQVJDSElWRTsgfVxuICAgICAgICBcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0FSUk9XUyA9IG5ldyBFSWNvbihcImZhLWFycm93c1wiKTtcbiAgICAgICAgc3RhdGljIGdldCBBUlJPV1MoKSB7IHJldHVybiBFSWNvbi5fQVJST1dTOyB9XG4gICAgICAgIFxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQVJST1dTX0ggPSBuZXcgRUljb24oXCJmYS1hcnJvd3MtaFwiKTtcbiAgICAgICAgc3RhdGljIGdldCBBUlJPV1NfSCgpIHsgcmV0dXJuIEVJY29uLl9BUlJPV1NfSDsgfVxuICAgICAgICBcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0FSUk9XU19WID0gbmV3IEVJY29uKFwiZmEtYXJyb3dzLXZcIik7XG4gICAgICAgIHN0YXRpYyBnZXQgQVJST1dTX1YoKSB7IHJldHVybiBFSWNvbi5fQVJST1dTX1Y7IH1cbiAgICAgICAgXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9BU1RFUklTSyA9IG5ldyBFSWNvbihcImZhLWFzdGVyaXNrXCIpO1xuICAgICAgICBzdGF0aWMgZ2V0IEFTVEVSSVNLKCkgeyByZXR1cm4gRUljb24uX0FTVEVSSVNLOyB9XG4gICAgICAgIFxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQkFOID0gbmV3IEVJY29uKFwiZmEtYmFuXCIpO1xuICAgICAgICBzdGF0aWMgZ2V0IEJBTigpIHsgcmV0dXJuIEVJY29uLl9CQU47IH1cbiAgICAgICAgXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9CQVJfQ0hBUlRfTyA9IG5ldyBFSWNvbihcImZhLWJhci1jaGFydC1vXCIpO1xuICAgICAgICBzdGF0aWMgZ2V0IEJBUl9DSEFSVF9PKCkgeyByZXR1cm4gRUljb24uX0JBUl9DSEFSVF9POyB9XG4gICAgICAgIFxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQkFSQ09ERSA9IG5ldyBFSWNvbihcImZhLWJhcmNvZGVcIik7XG4gICAgICAgIHN0YXRpYyBnZXQgQkFSQ09ERSgpIHsgcmV0dXJuIEVJY29uLl9CQVJDT0RFOyB9XG4gICAgICAgIFxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQkFSUyA9IG5ldyBFSWNvbihcImZhLWJhcnNcIik7XG4gICAgICAgIHN0YXRpYyBnZXQgQkFSUygpIHsgcmV0dXJuIEVJY29uLl9CQVJTOyB9XG4gICAgICAgIFxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQkVFUiA9IG5ldyBFSWNvbihcImZhLWJlZXJcIik7XG4gICAgICAgIHN0YXRpYyBnZXQgQkVFUigpIHsgcmV0dXJuIEVJY29uLl9CRUVSOyB9XG4gICAgICAgIFxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQkVMTCA9IG5ldyBFSWNvbihcImZhLWJlbGxcIik7XG4gICAgICAgIHN0YXRpYyBnZXQgQkVMTCgpIHsgcmV0dXJuIEVJY29uLl9CRUxMOyB9XG4gICAgICAgIFxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQkVMTF9PID0gbmV3IEVJY29uKFwiZmEtYmVsbC1vXCIpO1xuICAgICAgICBzdGF0aWMgZ2V0IEJFTExfTygpIHsgcmV0dXJuIEVJY29uLl9CRUxMX087IH1cbiAgICAgICAgXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9CT0xUID0gbmV3IEVJY29uKFwiZmEtYm9sdFwiKTtcbiAgICAgICAgc3RhdGljIGdldCBCT0xUKCkgeyByZXR1cm4gRUljb24uX0JPTFQ7IH1cbiAgICAgICAgXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9CT09LID0gbmV3IEVJY29uKFwiZmEtYm9va1wiKTtcbiAgICAgICAgc3RhdGljIGdldCBCT09LKCkgeyByZXR1cm4gRUljb24uX0JPT0s7IH1cbiAgICAgICAgXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9CT09LTUFSSyA9IG5ldyBFSWNvbihcImZhLWJvb2ttYXJrXCIpO1xuICAgICAgICBzdGF0aWMgZ2V0IEJPT0tNQVJLKCkgeyByZXR1cm4gRUljb24uX0JPT0tNQVJLOyB9XG4gICAgICAgIFxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQk9PS01BUktfTyA9IG5ldyBFSWNvbihcImZhLWJvb2ttYXJrLW9cIik7XG4gICAgICAgIHN0YXRpYyBnZXQgQk9PS01BUktfTygpIHsgcmV0dXJuIEVJY29uLl9CT09LTUFSS19POyB9XG4gICAgICAgIFxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQlJJRUZDQVNFID0gbmV3IEVJY29uKFwiZmEtYnJpZWZjYXNlXCIpO1xuICAgICAgICBzdGF0aWMgZ2V0IEJSSUVGQ0FTRSgpIHsgcmV0dXJuIEVJY29uLl9CUklFRkNBU0U7IH1cbiAgICAgICAgXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9CVUcgPSBuZXcgRUljb24oXCJmYS1idWdcIik7XG4gICAgICAgIHN0YXRpYyBnZXQgQlVHKCkgeyByZXR1cm4gRUljb24uX0JVRzsgfVxuICAgICAgICBcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0JVSUxESU5HX08gPSBuZXcgRUljb24oXCJmYS1idWlsZGluZy1vXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQlVMTEhPUk4gPSBuZXcgRUljb24oXCJmYS1idWxsaG9yblwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0JVTExTRVlFID0gbmV3IEVJY29uKFwiZmEtYnVsbHNleWVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DQUxFTkRBUiA9IG5ldyBFSWNvbihcImZhLWNhbGVuZGFyXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ0FMRU5EQVJfTyA9IG5ldyBFSWNvbihcImZhLWNhbGVuZGFyLW9cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DQU1FUkEgPSBuZXcgRUljb24oXCJmYS1jYW1lcmFcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DQU1FUkFfUkVUUk8gPSBuZXcgRUljb24oXCJmYS1jYW1lcmEtcmV0cm9cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DQVJFVF9TUVVBUkVfT19ET1dOID0gbmV3IEVJY29uKFwiZmEtY2FyZXQtc3F1YXJlLW8tZG93blwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0NBUkVUX1NRVUFSRV9PX1JJR0hUID0gbmV3IEVJY29uKFwiZmEtY2FyZXQtc3F1YXJlLW8tcmlnaHRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DQVJFVF9TUVVBUkVfT19VUCA9IG5ldyBFSWNvbihcImZhLWNhcmV0LXNxdWFyZS1vLXVwXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ0VSVElGSUNBVEUgPSBuZXcgRUljb24oXCJmYS1jZXJ0aWZpY2F0ZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0NIRUNLID0gbmV3IEVJY29uKFwiZmEtY2hlY2tcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DSEVDS19DSVJDTEUgPSBuZXcgRUljb24oXCJmYS1jaGVjay1jaXJjbGVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DSEVDS19DSVJDTEVfTyA9IG5ldyBFSWNvbihcImZhLWNoZWNrLWNpcmNsZS1vXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ0hFQ0tfU1FVQVJFID0gbmV3IEVJY29uKFwiZmEtY2hlY2stc3F1YXJlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ0hFQ0tfU1FVQVJFX08gPSBuZXcgRUljb24oXCJmYS1jaGVjay1zcXVhcmUtb1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0NJUkNMRSA9IG5ldyBFSWNvbihcImZhLWNpcmNsZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0NJUkNMRV9PID0gbmV3IEVJY29uKFwiZmEtY2lyY2xlLW9cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DTE9DS19PID0gbmV3IEVJY29uKFwiZmEtY2xvY2stb1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0NMT1VEID0gbmV3IEVJY29uKFwiZmEtY2xvdWRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DTE9VRF9ET1dOTE9BRCA9IG5ldyBFSWNvbihcImZhLWNsb3VkLWRvd25sb2FkXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ0xPVURfVVBMT0FEID0gbmV3IEVJY29uKFwiZmEtY2xvdWQtdXBsb2FkXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ09ERSA9IG5ldyBFSWNvbihcImZhLWNvZGVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DT0RFX0ZPUksgPSBuZXcgRUljb24oXCJmYS1jb2RlLWZvcmtcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DT0ZGRUUgPSBuZXcgRUljb24oXCJmYS1jb2ZmZWVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DT0cgPSBuZXcgRUljb24oXCJmYS1jb2dcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DT0dTID0gbmV3IEVJY29uKFwiZmEtY29nc1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0NPTU1FTlQgPSBuZXcgRUljb24oXCJmYS1jb21tZW50XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ09NTUVOVF9PID0gbmV3IEVJY29uKFwiZmEtY29tbWVudC1vXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ09NTUVOVFMgPSBuZXcgRUljb24oXCJmYS1jb21tZW50c1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0NPTU1FTlRTX08gPSBuZXcgRUljb24oXCJmYS1jb21tZW50cy1vXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ09NUEFTUyA9IG5ldyBFSWNvbihcImZhLWNvbXBhc3NcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DUkVESVRfQ0FSRCA9IG5ldyBFSWNvbihcImZhLWNyZWRpdC1jYXJkXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ1JPUCA9IG5ldyBFSWNvbihcImZhLWNyb3BcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DUk9TU0hBSVJTID0gbmV3IEVJY29uKFwiZmEtY3Jvc3NoYWlyc1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0NVVExFUlkgPSBuZXcgRUljb24oXCJmYS1jdXRsZXJ5XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfREFTSEJPQVJEID0gbmV3IEVJY29uKFwiZmEtZGFzaGJvYXJkXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfREVTS1RPUCA9IG5ldyBFSWNvbihcImZhLWRlc2t0b3BcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9ET1dOTE9BRCA9IG5ldyBFSWNvbihcImZhLWRvd25sb2FkXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRURJVCA9IG5ldyBFSWNvbihcImZhLWVkaXRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9FTExJUFNJU19IID0gbmV3IEVJY29uKFwiZmEtZWxsaXBzaXMtaFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0VMTElQU0lTX1YgPSBuZXcgRUljb24oXCJmYS1lbGxpcHNpcy12XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRU5WRUxPUEUgPSBuZXcgRUljb24oXCJmYS1lbnZlbG9wZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0VOVkVMT1BFX08gPSBuZXcgRUljb24oXCJmYS1lbnZlbG9wZS1vXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRVJBU0VSID0gbmV3IEVJY29uKFwiZmEtZXJhc2VyXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRVhDSEFOR0UgPSBuZXcgRUljb24oXCJmYS1leGNoYW5nZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0VYQ0xBTUFUSU9OID0gbmV3IEVJY29uKFwiZmEtZXhjbGFtYXRpb25cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9FWENMQU1BVElPTl9DSVJDTEUgPSBuZXcgRUljb24oXCJmYS1leGNsYW1hdGlvbi1jaXJjbGVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9FWENMQU1BVElPTl9UUklBTkdMRSA9IG5ldyBFSWNvbihcImZhLWV4Y2xhbWF0aW9uLXRyaWFuZ2xlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRVhURVJOQUxfTElOSyA9IG5ldyBFSWNvbihcImZhLWV4dGVybmFsLWxpbmtcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9FWFRFUk5BTF9MSU5LX1NRVUFSRSA9IG5ldyBFSWNvbihcImZhLWV4dGVybmFsLWxpbmstc3F1YXJlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRVlFID0gbmV3IEVJY29uKFwiZmEtZXllXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRVlFX1NMQVNIID0gbmV3IEVJY29uKFwiZmEtZXllLXNsYXNoXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRkVNQUxFID0gbmV3IEVJY29uKFwiZmEtZmVtYWxlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRklHSFRFUl9KRVQgPSBuZXcgRUljb24oXCJmYS1maWdodGVyLWpldFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0ZJTE0gPSBuZXcgRUljb24oXCJmYS1maWxtXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRklMVEVSID0gbmV3IEVJY29uKFwiZmEtZmlsdGVyXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRklSRSA9IG5ldyBFSWNvbihcImZhLWZpcmVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9GSVJFX0VYVElOR1VJU0hFUiA9IG5ldyBFSWNvbihcImZhLWZpcmUtZXh0aW5ndWlzaGVyXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRkxBRyA9IG5ldyBFSWNvbihcImZhLWZsYWdcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9GTEFHX0NIRUNLRVJFRCA9IG5ldyBFSWNvbihcImZhLWZsYWctY2hlY2tlcmVkXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRkxBR19PID0gbmV3IEVJY29uKFwiZmEtZmxhZy1vXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRkxBU0ggPSBuZXcgRUljb24oXCJmYS1mbGFzaFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0ZMQVNLID0gbmV3IEVJY29uKFwiZmEtZmxhc2tcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9GT0xERVIgPSBuZXcgRUljb24oXCJmYS1mb2xkZXJcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9GT0xERVJfTyA9IG5ldyBFSWNvbihcImZhLWZvbGRlci1vXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRk9MREVSX09QRU4gPSBuZXcgRUljb24oXCJmYS1mb2xkZXItb3BlblwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0ZPTERFUl9PUEVOX08gPSBuZXcgRUljb24oXCJmYS1mb2xkZXItb3Blbi1vXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRlJPV05fTyA9IG5ldyBFSWNvbihcImZhLWZyb3duLW9cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9HQU1FUEFEID0gbmV3IEVJY29uKFwiZmEtZ2FtZXBhZFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0dBVkVMID0gbmV3IEVJY29uKFwiZmEtZ2F2ZWxcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9HRUFSID0gbmV3IEVJY29uKFwiZmEtZ2VhclwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0dFQVJTID0gbmV3IEVJY29uKFwiZmEtZ2VhcnNcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9HSUZUID0gbmV3IEVJY29uKFwiZmEtZ2lmdFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0dMQVNTID0gbmV3IEVJY29uKFwiZmEtZ2xhc3NcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9HTE9CRSA9IG5ldyBFSWNvbihcImZhLWdsb2JlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfR1JPVVAgPSBuZXcgRUljb24oXCJmYS1ncm91cFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0hERF9PID0gbmV3IEVJY29uKFwiZmEtaGRkLW9cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9IRUFEUEhPTkVTID0gbmV3IEVJY29uKFwiZmEtaGVhZHBob25lc1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0hFQVJUID0gbmV3IEVJY29uKFwiZmEtaGVhcnRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9IRUFSVF9PID0gbmV3IEVJY29uKFwiZmEtaGVhcnQtb1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0hPTUUgPSBuZXcgRUljb24oXCJmYS1ob21lXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfSU5CT1ggPSBuZXcgRUljb24oXCJmYS1pbmJveFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0lORk8gPSBuZXcgRUljb24oXCJmYS1pbmZvXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfSU5GT19DSVJDTEUgPSBuZXcgRUljb24oXCJmYS1pbmZvLWNpcmNsZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0tFWSA9IG5ldyBFSWNvbihcImZhLWtleVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0tFWUJPQVJEX08gPSBuZXcgRUljb24oXCJmYS1rZXlib2FyZC1vXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTEFQVE9QID0gbmV3IEVJY29uKFwiZmEtbGFwdG9wXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTEVBRiA9IG5ldyBFSWNvbihcImZhLWxlYWZcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9MRUdBTCA9IG5ldyBFSWNvbihcImZhLWxlZ2FsXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTEVNT05fTyA9IG5ldyBFSWNvbihcImZhLWxlbW9uLW9cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9MRVZFTF9ET1dOID0gbmV3IEVJY29uKFwiZmEtbGV2ZWwtZG93blwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0xFVkVMX1VQID0gbmV3IEVJY29uKFwiZmEtbGV2ZWwtdXBcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9MSUdIVEJVTEJfTyA9IG5ldyBFSWNvbihcImZhLWxpZ2h0YnVsYi1vXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTE9DQVRJT05fQVJST1cgPSBuZXcgRUljb24oXCJmYS1sb2NhdGlvbi1hcnJvd1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0xPQ0sgPSBuZXcgRUljb24oXCJmYS1sb2NrXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTUFHSUMgPSBuZXcgRUljb24oXCJmYS1tYWdpY1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX01BR05FVCA9IG5ldyBFSWNvbihcImZhLW1hZ25ldFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX01BSUxfRk9SV0FSRCA9IG5ldyBFSWNvbihcImZhLW1haWwtZm9yd2FyZFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX01BSUxfUkVQTFkgPSBuZXcgRUljb24oXCJmYS1tYWlsLXJlcGx5XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTUFJTF9SRVBMWV9BTEwgPSBuZXcgRUljb24oXCJmYS1tYWlsLXJlcGx5LWFsbFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX01BTEUgPSBuZXcgRUljb24oXCJmYS1tYWxlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTUFQX01BUktFUiA9IG5ldyBFSWNvbihcImZhLW1hcC1tYXJrZXJcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9NRUhfTyA9IG5ldyBFSWNvbihcImZhLW1laC1vXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTUlDUk9QSE9ORSA9IG5ldyBFSWNvbihcImZhLW1pY3JvcGhvbmVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9NSUNST1BIT05FX1NMQVNIID0gbmV3IEVJY29uKFwiZmEtbWljcm9waG9uZS1zbGFzaFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX01JTlVTID0gbmV3IEVJY29uKFwiZmEtbWludXNcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9NSU5VU19DSVJDTEUgPSBuZXcgRUljb24oXCJmYS1taW51cy1jaXJjbGVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9NSU5VU19TUVVBUkUgPSBuZXcgRUljb24oXCJmYS1taW51cy1zcXVhcmVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9NSU5VU19TUVVBUkVfTyA9IG5ldyBFSWNvbihcImZhLW1pbnVzLXNxdWFyZS1vXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTU9CSUxFID0gbmV3IEVJY29uKFwiZmEtbW9iaWxlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTU9CSUxFX1BIT05FID0gbmV3IEVJY29uKFwiZmEtbW9iaWxlLXBob25lXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTU9ORVkgPSBuZXcgRUljb24oXCJmYS1tb25leVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX01PT05fTyA9IG5ldyBFSWNvbihcImZhLW1vb24tb1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX01VU0lDID0gbmV3IEVJY29uKFwiZmEtbXVzaWNcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9QRU5DSUwgPSBuZXcgRUljb24oXCJmYS1wZW5jaWxcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9QRU5DSUxfU1FVQVJFID0gbmV3IEVJY29uKFwiZmEtcGVuY2lsLXNxdWFyZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1BFTkNJTF9TUVVBUkVfTyA9IG5ldyBFSWNvbihcImZhLXBlbmNpbC1zcXVhcmUtb1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1BIT05FID0gbmV3IEVJY29uKFwiZmEtcGhvbmVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9QSE9ORV9TUVVBUkUgPSBuZXcgRUljb24oXCJmYS1waG9uZS1zcXVhcmVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9QSUNUVVJFX08gPSBuZXcgRUljb24oXCJmYS1waWN0dXJlLW9cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9QTEFORSA9IG5ldyBFSWNvbihcImZhLXBsYW5lXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUExVUyA9IG5ldyBFSWNvbihcImZhLXBsdXNcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9QTFVTX0NJUkNMRSA9IG5ldyBFSWNvbihcImZhLXBsdXMtY2lyY2xlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUExVU19TUVVBUkUgPSBuZXcgRUljb24oXCJmYS1wbHVzLXNxdWFyZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1BMVVNfU1FVQVJFX08gPSBuZXcgRUljb24oXCJmYS1wbHVzLXNxdWFyZS1vXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUE9XRVJfT0ZGID0gbmV3IEVJY29uKFwiZmEtcG93ZXItb2ZmXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUFJJTlQgPSBuZXcgRUljb24oXCJmYS1wcmludFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1BVWlpMRV9QSUVDRSA9IG5ldyBFSWNvbihcImZhLXB1enpsZS1waWVjZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1FSQ09ERSA9IG5ldyBFSWNvbihcImZhLXFyY29kZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1FVRVNUSU9OID0gbmV3IEVJY29uKFwiZmEtcXVlc3Rpb25cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9RVUVTVElPTl9DSVJDTEUgPSBuZXcgRUljb24oXCJmYS1xdWVzdGlvbi1jaXJjbGVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9RVU9URV9MRUZUID0gbmV3IEVJY29uKFwiZmEtcXVvdGUtbGVmdFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1FVT1RFX1JJR0hUID0gbmV3IEVJY29uKFwiZmEtcXVvdGUtcmlnaHRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9SQU5ET00gPSBuZXcgRUljb24oXCJmYS1yYW5kb21cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9SRUZSRVNIID0gbmV3IEVJY29uKFwiZmEtcmVmcmVzaFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1JFUExZID0gbmV3IEVJY29uKFwiZmEtcmVwbHlcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9SRVBMWV9BTEwgPSBuZXcgRUljb24oXCJmYS1yZXBseS1hbGxcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9SRVRXRUVUID0gbmV3IEVJY29uKFwiZmEtcmV0d2VldFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1JPQUQgPSBuZXcgRUljb24oXCJmYS1yb2FkXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUk9DS0VUID0gbmV3IEVJY29uKFwiZmEtcm9ja2V0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUlNTID0gbmV3IEVJY29uKFwiZmEtcnNzXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUlNTX1NRVUFSRSA9IG5ldyBFSWNvbihcImZhLXJzcy1zcXVhcmVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TRUFSQ0ggPSBuZXcgRUljb24oXCJmYS1zZWFyY2hcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TRUFSQ0hfTUlOVVMgPSBuZXcgRUljb24oXCJmYS1zZWFyY2gtbWludXNcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TRUFSQ0hfUExVUyA9IG5ldyBFSWNvbihcImZhLXNlYXJjaC1wbHVzXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfU0hBUkUgPSBuZXcgRUljb24oXCJmYS1zaGFyZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NIQVJFX1NRVUFSRSA9IG5ldyBFSWNvbihcImZhLXNoYXJlLXNxdWFyZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NIQVJFX1NRVUFSRV9PID0gbmV3IEVJY29uKFwiZmEtc2hhcmUtc3F1YXJlLW9cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TSElFTEQgPSBuZXcgRUljb24oXCJmYS1zaGllbGRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TSE9QUElOR19DQVJUID0gbmV3IEVJY29uKFwiZmEtc2hvcHBpbmctY2FydFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NJR05fSU4gPSBuZXcgRUljb24oXCJmYS1zaWduLWluXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfU0lHTl9PVVQgPSBuZXcgRUljb24oXCJmYS1zaWduLW91dFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NJR05BTCA9IG5ldyBFSWNvbihcImZhLXNpZ25hbFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NJVEVNQVAgPSBuZXcgRUljb24oXCJmYS1zaXRlbWFwXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfU01JTEVfTyA9IG5ldyBFSWNvbihcImZhLXNtaWxlLW9cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TT1JUID0gbmV3IEVJY29uKFwiZmEtc29ydFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NPUlRfQUxQSEFfQVNDID0gbmV3IEVJY29uKFwiZmEtc29ydC1hbHBoYS1hc2NcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TT1JUX0FMUEhBX0RFU0MgPSBuZXcgRUljb24oXCJmYS1zb3J0LWFscGhhLWRlc2NcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TT1JUX0FNT1VOVF9BU0MgPSBuZXcgRUljb24oXCJmYS1zb3J0LWFtb3VudC1hc2NcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TT1JUX0FNT1VOVF9ERVNDID0gbmV3IEVJY29uKFwiZmEtc29ydC1hbW91bnQtZGVzY1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NPUlRfQVNDID0gbmV3IEVJY29uKFwiZmEtc29ydC1hc2NcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TT1JUX0RFU0MgPSBuZXcgRUljb24oXCJmYS1zb3J0LWRlc2NcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TT1JUX0RPV04gPSBuZXcgRUljb24oXCJmYS1zb3J0LWRvd25cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TT1JUX05VTUVSSUNfQVNDID0gbmV3IEVJY29uKFwiZmEtc29ydC1udW1lcmljLWFzY1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NPUlRfTlVNRVJJQ19ERVNDID0gbmV3IEVJY29uKFwiZmEtc29ydC1udW1lcmljLWRlc2NcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TT1JUX1VQID0gbmV3IEVJY29uKFwiZmEtc29ydC11cFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NQSU5ORVIgPSBuZXcgRUljb24oXCJmYS1zcGlubmVyXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfU1FVQVJFID0gbmV3IEVJY29uKFwiZmEtc3F1YXJlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfU1FVQVJFX08gPSBuZXcgRUljb24oXCJmYS1zcXVhcmUtb1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NUQVIgPSBuZXcgRUljb24oXCJmYS1zdGFyXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfU1RBUl9IQUxGID0gbmV3IEVJY29uKFwiZmEtc3Rhci1oYWxmXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfU1RBUl9IQUxGX0VNUFRZID0gbmV3IEVJY29uKFwiZmEtc3Rhci1oYWxmLWVtcHR5XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfU1RBUl9IQUxGX0ZVTEwgPSBuZXcgRUljb24oXCJmYS1zdGFyLWhhbGYtZnVsbFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NUQVJfSEFMRl9PID0gbmV3IEVJY29uKFwiZmEtc3Rhci1oYWxmLW9cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TVEFSX08gPSBuZXcgRUljb24oXCJmYS1zdGFyLW9cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TVUJTQ1JJUFQgPSBuZXcgRUljb24oXCJmYS1zdWJzY3JpcHRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TVUlUQ0FTRSA9IG5ldyBFSWNvbihcImZhLXN1aXRjYXNlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfU1VOX08gPSBuZXcgRUljb24oXCJmYS1zdW4tb1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NVUEVSU0NSSVBUID0gbmV3IEVJY29uKFwiZmEtc3VwZXJzY3JpcHRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9UQUJMRVQgPSBuZXcgRUljb24oXCJmYS10YWJsZXRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9UQUNIT01FVEVSID0gbmV3IEVJY29uKFwiZmEtdGFjaG9tZXRlclwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1RBRyA9IG5ldyBFSWNvbihcImZhLXRhZ1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1RBR1MgPSBuZXcgRUljb24oXCJmYS10YWdzXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfVEFTS1MgPSBuZXcgRUljb24oXCJmYS10YXNrc1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1RFUk1JTkFMID0gbmV3IEVJY29uKFwiZmEtdGVybWluYWxcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9USFVNQl9UQUNLID0gbmV3IEVJY29uKFwiZmEtdGh1bWItdGFja1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1RIVU1CU19ET1dOID0gbmV3IEVJY29uKFwiZmEtdGh1bWJzLWRvd25cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9USFVNQlNfT19ET1dOID0gbmV3IEVJY29uKFwiZmEtdGh1bWJzLW8tZG93blwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1RIVU1CU19PX1VQID0gbmV3IEVJY29uKFwiZmEtdGh1bWJzLW8tdXBcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9USFVNQlNfVVAgPSBuZXcgRUljb24oXCJmYS10aHVtYnMtdXBcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9USUNLRVQgPSBuZXcgRUljb24oXCJmYS10aWNrZXRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9USU1FUyA9IG5ldyBFSWNvbihcImZhLXRpbWVzXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfVElNRVNfQ0lSQ0xFID0gbmV3IEVJY29uKFwiZmEtdGltZXMtY2lyY2xlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfVElNRVNfQ0lSQ0xFX08gPSBuZXcgRUljb24oXCJmYS10aW1lcy1jaXJjbGUtb1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1RJTlQgPSBuZXcgRUljb24oXCJmYS10aW50XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfVE9HR0xFX0RPV04gPSBuZXcgRUljb24oXCJmYS10b2dnbGUtZG93blwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1RPR0dMRV9MRUZUID0gbmV3IEVJY29uKFwiZmEtdG9nZ2xlLWxlZnRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9UT0dHTEVfUklHSFQgPSBuZXcgRUljb24oXCJmYS10b2dnbGUtcmlnaHRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9UT0dHTEVfVVAgPSBuZXcgRUljb24oXCJmYS10b2dnbGUtdXBcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9UUkFTSF9PID0gbmV3IEVJY29uKFwiZmEtdHJhc2gtb1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1RST1BIWSA9IG5ldyBFSWNvbihcImZhLXRyb3BoeVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1RSVUNLID0gbmV3IEVJY29uKFwiZmEtdHJ1Y2tcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9VTUJSRUxMQSA9IG5ldyBFSWNvbihcImZhLXVtYnJlbGxhXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfVU5MT0NLID0gbmV3IEVJY29uKFwiZmEtdW5sb2NrXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfVU5MT0NLX0FMVCA9IG5ldyBFSWNvbihcImZhLXVubG9jay1hbHRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9VTlNPUlRFRCA9IG5ldyBFSWNvbihcImZhLXVuc29ydGVkXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfVVBMT0FEID0gbmV3IEVJY29uKFwiZmEtdXBsb2FkXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfVVNFUiA9IG5ldyBFSWNvbihcImZhLXVzZXJcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9VU0VSUyA9IG5ldyBFSWNvbihcImZhLXVzZXJzXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfVklERU9fQ0FNRVJBID0gbmV3IEVJY29uKFwiZmEtdmlkZW8tY2FtZXJhXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfVk9MVU1FX0RPV04gPSBuZXcgRUljb24oXCJmYS12b2x1bWUtZG93blwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1ZPTFVNRV9PRkYgPSBuZXcgRUljb24oXCJmYS12b2x1bWUtb2ZmXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfVk9MVU1FX1VQID0gbmV3IEVJY29uKFwiZmEtdm9sdW1lLXVwXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfV0FSTklORyA9IG5ldyBFSWNvbihcImZhLXdhcm5pbmdcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9XSEVFTENIQUlSID0gbmV3IEVJY29uKFwiZmEtd2hlZWxjaGFpclwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1dSRU5DSCA9IG5ldyBFSWNvbihcImZhLXdyZW5jaFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0RPVF9DSVJDTEVfTyA9IG5ldyBFSWNvbihcImZhLWRvdC1jaXJjbGUtb1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0JJVENPSU4gPSBuZXcgRUljb24oXCJmYS1iaXRjb2luXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQlRDID0gbmV3IEVJY29uKFwiZmEtYnRjXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ05ZID0gbmV3IEVJY29uKFwiZmEtY255XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRE9MTEFSID0gbmV3IEVJY29uKFwiZmEtZG9sbGFyXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRVVSID0gbmV3IEVJY29uKFwiZmEtZXVyXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRVVSTyA9IG5ldyBFSWNvbihcImZhLWV1cm9cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9HQlAgPSBuZXcgRUljb24oXCJmYS1nYnBcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9JTlIgPSBuZXcgRUljb24oXCJmYS1pbnJcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9KUFkgPSBuZXcgRUljb24oXCJmYS1qcHlcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9LUlcgPSBuZXcgRUljb24oXCJmYS1rcndcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9STUIgPSBuZXcgRUljb24oXCJmYS1ybWJcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9ST1VCTEUgPSBuZXcgRUljb24oXCJmYS1yb3VibGVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9SVUIgPSBuZXcgRUljb24oXCJmYS1ydWJcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9SVUJMRSA9IG5ldyBFSWNvbihcImZhLXJ1YmxlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUlVQRUUgPSBuZXcgRUljb24oXCJmYS1ydXBlZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1RSWSA9IG5ldyBFSWNvbihcImZhLXRyeVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1RVUktJU0hfTElSQSA9IG5ldyBFSWNvbihcImZhLXR1cmtpc2gtbGlyYVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1VTRCA9IG5ldyBFSWNvbihcImZhLXVzZFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1dPTiA9IG5ldyBFSWNvbihcImZhLXdvblwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1lFTiA9IG5ldyBFSWNvbihcImZhLXllblwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0FMSUdOX0NFTlRFUiA9IG5ldyBFSWNvbihcImZhLWFsaWduLWNlbnRlclwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0FMSUdOX0pVU1RJRlkgPSBuZXcgRUljb24oXCJmYS1hbGlnbi1qdXN0aWZ5XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQUxJR05fTEVGVCA9IG5ldyBFSWNvbihcImZhLWFsaWduLWxlZnRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9BTElHTl9SSUdIVCA9IG5ldyBFSWNvbihcImZhLWFsaWduLXJpZ2h0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQk9MRCA9IG5ldyBFSWNvbihcImZhLWJvbGRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DSEFJTiA9IG5ldyBFSWNvbihcImZhLWNoYWluXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ0hBSU5fQlJPS0VOID0gbmV3IEVJY29uKFwiZmEtY2hhaW4tYnJva2VuXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ0xJUEJPQVJEID0gbmV3IEVJY29uKFwiZmEtY2xpcGJvYXJkXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ09MVU1OUyA9IG5ldyBFSWNvbihcImZhLWNvbHVtbnNcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DT1BZID0gbmV3IEVJY29uKFwiZmEtY29weVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0NVVCA9IG5ldyBFSWNvbihcImZhLWN1dFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0RFREVOVCA9IG5ldyBFSWNvbihcImZhLWRlZGVudFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0ZJTEUgPSBuZXcgRUljb24oXCJmYS1maWxlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRklMRV9PID0gbmV3IEVJY29uKFwiZmEtZmlsZS1vXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRklMRV9URVhUID0gbmV3IEVJY29uKFwiZmEtZmlsZS10ZXh0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRklMRV9URVhUX08gPSBuZXcgRUljb24oXCJmYS1maWxlLXRleHQtb1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0ZJTEVTX08gPSBuZXcgRUljb24oXCJmYS1maWxlcy1vXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRkxPUFBZX08gPSBuZXcgRUljb24oXCJmYS1mbG9wcHktb1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0ZPTlQgPSBuZXcgRUljb24oXCJmYS1mb250XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfSU5ERU5UID0gbmV3IEVJY29uKFwiZmEtaW5kZW50XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfSVRBTElDID0gbmV3IEVJY29uKFwiZmEtaXRhbGljXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTElOSyA9IG5ldyBFSWNvbihcImZhLWxpbmtcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9MSVNUID0gbmV3IEVJY29uKFwiZmEtbGlzdFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0xJU1RfQUxUID0gbmV3IEVJY29uKFwiZmEtbGlzdC1hbHRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9MSVNUX09MID0gbmV3IEVJY29uKFwiZmEtbGlzdC1vbFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0xJU1RfVUwgPSBuZXcgRUljb24oXCJmYS1saXN0LXVsXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfT1VUREVOVCA9IG5ldyBFSWNvbihcImZhLW91dGRlbnRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9QQVBFUkNMSVAgPSBuZXcgRUljb24oXCJmYS1wYXBlcmNsaXBcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9QQVNURSA9IG5ldyBFSWNvbihcImZhLXBhc3RlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUkVQRUFUID0gbmV3IEVJY29uKFwiZmEtcmVwZWF0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUk9UQVRFX0xFRlQgPSBuZXcgRUljb24oXCJmYS1yb3RhdGUtbGVmdFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1JPVEFURV9SSUdIVCA9IG5ldyBFSWNvbihcImZhLXJvdGF0ZS1yaWdodFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NBVkUgPSBuZXcgRUljb24oXCJmYS1zYXZlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfU0NJU1NPUlMgPSBuZXcgRUljb24oXCJmYS1zY2lzc29yc1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NUUklLRVRIUk9VR0ggPSBuZXcgRUljb24oXCJmYS1zdHJpa2V0aHJvdWdoXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfVEFCTEUgPSBuZXcgRUljb24oXCJmYS10YWJsZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1RFWFRfSEVJR0hUID0gbmV3IEVJY29uKFwiZmEtdGV4dC1oZWlnaHRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9URVhUX1dJRFRIID0gbmV3IEVJY29uKFwiZmEtdGV4dC13aWR0aFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1RIID0gbmV3IEVJY29uKFwiZmEtdGhcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9USF9MQVJHRSA9IG5ldyBFSWNvbihcImZhLXRoLWxhcmdlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfVEhfTElTVCA9IG5ldyBFSWNvbihcImZhLXRoLWxpc3RcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9VTkRFUkxJTkUgPSBuZXcgRUljb24oXCJmYS11bmRlcmxpbmVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9VTkRPID0gbmV3IEVJY29uKFwiZmEtdW5kb1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1VOTElOSyA9IG5ldyBFSWNvbihcImZhLXVubGlua1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0FOR0xFX0RPVUJMRV9ET1dOID0gbmV3IEVJY29uKFwiZmEtYW5nbGUtZG91YmxlLWRvd25cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9BTkdMRV9ET1VCTEVfTEVGVCA9IG5ldyBFSWNvbihcImZhLWFuZ2xlLWRvdWJsZS1sZWZ0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQU5HTEVfRE9VQkxFX1JJR0hUID0gbmV3IEVJY29uKFwiZmEtYW5nbGUtZG91YmxlLXJpZ2h0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQU5HTEVfRE9VQkxFX1VQID0gbmV3IEVJY29uKFwiZmEtYW5nbGUtZG91YmxlLXVwXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQU5HTEVfRE9XTiA9IG5ldyBFSWNvbihcImZhLWFuZ2xlLWRvd25cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9BTkdMRV9MRUZUID0gbmV3IEVJY29uKFwiZmEtYW5nbGUtbGVmdFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0FOR0xFX1JJR0hUID0gbmV3IEVJY29uKFwiZmEtYW5nbGUtcmlnaHRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9BTkdMRV9VUCA9IG5ldyBFSWNvbihcImZhLWFuZ2xlLXVwXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQVJST1dfQ0lSQ0xFX0RPV04gPSBuZXcgRUljb24oXCJmYS1hcnJvdy1jaXJjbGUtZG93blwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0FSUk9XX0NJUkNMRV9MRUZUID0gbmV3IEVJY29uKFwiZmEtYXJyb3ctY2lyY2xlLWxlZnRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9BUlJPV19DSVJDTEVfT19ET1dOID0gbmV3IEVJY29uKFwiZmEtYXJyb3ctY2lyY2xlLW8tZG93blwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0FSUk9XX0NJUkNMRV9PX0xFRlQgPSBuZXcgRUljb24oXCJmYS1hcnJvdy1jaXJjbGUtby1sZWZ0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQVJST1dfQ0lSQ0xFX09fUklHSFQgPSBuZXcgRUljb24oXCJmYS1hcnJvdy1jaXJjbGUtby1yaWdodFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0FSUk9XX0NJUkNMRV9PX1VQID0gbmV3IEVJY29uKFwiZmEtYXJyb3ctY2lyY2xlLW8tdXBcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9BUlJPV19DSVJDTEVfUklHSFQgPSBuZXcgRUljb24oXCJmYS1hcnJvdy1jaXJjbGUtcmlnaHRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9BUlJPV19DSVJDTEVfVVAgPSBuZXcgRUljb24oXCJmYS1hcnJvdy1jaXJjbGUtdXBcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9BUlJPV19ET1dOID0gbmV3IEVJY29uKFwiZmEtYXJyb3ctZG93blwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0FSUk9XX0xFRlQgPSBuZXcgRUljb24oXCJmYS1hcnJvdy1sZWZ0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQVJST1dfUklHSFQgPSBuZXcgRUljb24oXCJmYS1hcnJvdy1yaWdodFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0FSUk9XX1VQID0gbmV3IEVJY29uKFwiZmEtYXJyb3ctdXBcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9BUlJPV1NfQUxUID0gbmV3IEVJY29uKFwiZmEtYXJyb3dzLWFsdFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0NBUkVUX0RPV04gPSBuZXcgRUljb24oXCJmYS1jYXJldC1kb3duXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ0FSRVRfTEVGVCA9IG5ldyBFSWNvbihcImZhLWNhcmV0LWxlZnRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DQVJFVF9SSUdIVCA9IG5ldyBFSWNvbihcImZhLWNhcmV0LXJpZ2h0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ0FSRVRfU1FVQVJFX09fTEVGVCA9IG5ldyBFSWNvbihcImZhLWNhcmV0LXNxdWFyZS1vLWxlZnRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DQVJFVF9VUCA9IG5ldyBFSWNvbihcImZhLWNhcmV0LXVwXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ0hFVlJPTl9DSVJDTEVfRE9XTiA9IG5ldyBFSWNvbihcImZhLWNoZXZyb24tY2lyY2xlLWRvd25cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DSEVWUk9OX0NJUkNMRV9MRUZUID0gbmV3IEVJY29uKFwiZmEtY2hldnJvbi1jaXJjbGUtbGVmdFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0NIRVZST05fQ0lSQ0xFX1JJR0hUID0gbmV3IEVJY29uKFwiZmEtY2hldnJvbi1jaXJjbGUtcmlnaHRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DSEVWUk9OX0NJUkNMRV9VUCA9IG5ldyBFSWNvbihcImZhLWNoZXZyb24tY2lyY2xlLXVwXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ0hFVlJPTl9ET1dOID0gbmV3IEVJY29uKFwiZmEtY2hldnJvbi1kb3duXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ0hFVlJPTl9MRUZUID0gbmV3IEVJY29uKFwiZmEtY2hldnJvbi1sZWZ0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ0hFVlJPTl9SSUdIVCA9IG5ldyBFSWNvbihcImZhLWNoZXZyb24tcmlnaHRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DSEVWUk9OX1VQID0gbmV3IEVJY29uKFwiZmEtY2hldnJvbi11cFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0hBTkRfT19ET1dOID0gbmV3IEVJY29uKFwiZmEtaGFuZC1vLWRvd25cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9IQU5EX09fTEVGVCA9IG5ldyBFSWNvbihcImZhLWhhbmQtby1sZWZ0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfSEFORF9PX1JJR0hUID0gbmV3IEVJY29uKFwiZmEtaGFuZC1vLXJpZ2h0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfSEFORF9PX1VQID0gbmV3IEVJY29uKFwiZmEtaGFuZC1vLXVwXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTE9OR19BUlJPV19ET1dOID0gbmV3IEVJY29uKFwiZmEtbG9uZy1hcnJvdy1kb3duXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTE9OR19BUlJPV19MRUZUID0gbmV3IEVJY29uKFwiZmEtbG9uZy1hcnJvdy1sZWZ0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTE9OR19BUlJPV19SSUdIVCA9IG5ldyBFSWNvbihcImZhLWxvbmctYXJyb3ctcmlnaHRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9MT05HX0FSUk9XX1VQID0gbmV3IEVJY29uKFwiZmEtbG9uZy1hcnJvdy11cFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0JBQ0tXQVJEID0gbmV3IEVJY29uKFwiZmEtYmFja3dhcmRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DT01QUkVTUyA9IG5ldyBFSWNvbihcImZhLWNvbXByZXNzXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRUpFQ1QgPSBuZXcgRUljb24oXCJmYS1lamVjdFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0VYUEFORCA9IG5ldyBFSWNvbihcImZhLWV4cGFuZFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0ZBU1RfQkFDS1dBUkQgPSBuZXcgRUljb24oXCJmYS1mYXN0LWJhY2t3YXJkXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRkFTVF9GT1JXQVJEID0gbmV3IEVJY29uKFwiZmEtZmFzdC1mb3J3YXJkXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRk9SV0FSRCA9IG5ldyBFSWNvbihcImZhLWZvcndhcmRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9QQVVTRSA9IG5ldyBFSWNvbihcImZhLXBhdXNlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUExBWSA9IG5ldyBFSWNvbihcImZhLXBsYXlcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9QTEFZX0NJUkNMRSA9IG5ldyBFSWNvbihcImZhLXBsYXktY2lyY2xlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUExBWV9DSVJDTEVfTyA9IG5ldyBFSWNvbihcImZhLXBsYXktY2lyY2xlLW9cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TVEVQX0JBQ0tXQVJEID0gbmV3IEVJY29uKFwiZmEtc3RlcC1iYWNrd2FyZFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NURVBfRk9SV0FSRCA9IG5ldyBFSWNvbihcImZhLXN0ZXAtZm9yd2FyZFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NUT1AgPSBuZXcgRUljb24oXCJmYS1zdG9wXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfWU9VVFVCRV9QTEFZID0gbmV3IEVJY29uKFwiZmEteW91dHViZS1wbGF5XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQUROID0gbmV3IEVJY29uKFwiZmEtYWRuXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQU5EUk9JRCA9IG5ldyBFSWNvbihcImZhLWFuZHJvaWRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9BUFBMRSA9IG5ldyBFSWNvbihcImZhLWFwcGxlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQklUQlVDS0VUID0gbmV3IEVJY29uKFwiZmEtYml0YnVja2V0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQklUQlVDS0VUX1NRVUFSRSA9IG5ldyBFSWNvbihcImZhLWJpdGJ1Y2tldC1zcXVhcmVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DU1MzID0gbmV3IEVJY29uKFwiZmEtY3NzM1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0RSSUJCQkxFID0gbmV3IEVJY29uKFwiZmEtZHJpYmJibGVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9EUk9QQk9YID0gbmV3IEVJY29uKFwiZmEtZHJvcGJveFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0ZBQ0VCT09LID0gbmV3IEVJY29uKFwiZmEtZmFjZWJvb2tcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9GQUNFQk9PS19TUVVBUkUgPSBuZXcgRUljb24oXCJmYS1mYWNlYm9vay1zcXVhcmVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9GTElDS1IgPSBuZXcgRUljb24oXCJmYS1mbGlja3JcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9GT1VSU1FVQVJFID0gbmV3IEVJY29uKFwiZmEtZm91cnNxdWFyZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0dJVEhVQiA9IG5ldyBFSWNvbihcImZhLWdpdGh1YlwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0dJVEhVQl9BTFQgPSBuZXcgRUljb24oXCJmYS1naXRodWItYWx0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfR0lUSFVCX1NRVUFSRSA9IG5ldyBFSWNvbihcImZhLWdpdGh1Yi1zcXVhcmVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9HSVRUSVAgPSBuZXcgRUljb24oXCJmYS1naXR0aXBcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9HT09HTEVfUExVUyA9IG5ldyBFSWNvbihcImZhLWdvb2dsZS1wbHVzXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfR09PR0xFX1BMVVNfU1FVQVJFID0gbmV3IEVJY29uKFwiZmEtZ29vZ2xlLXBsdXMtc3F1YXJlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfSFRNTDUgPSBuZXcgRUljb24oXCJmYS1odG1sNVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0lOU1RBR1JBTSA9IG5ldyBFSWNvbihcImZhLWluc3RhZ3JhbVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0xJTktFRElOID0gbmV3IEVJY29uKFwiZmEtbGlua2VkaW5cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9MSU5LRURJTl9TUVVBUkUgPSBuZXcgRUljb24oXCJmYS1saW5rZWRpbi1zcXVhcmVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9MSU5VWCA9IG5ldyBFSWNvbihcImZhLWxpbnV4XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTUFYQ0ROID0gbmV3IEVJY29uKFwiZmEtbWF4Y2RuXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUEFHRUxJTkVTID0gbmV3IEVJY29uKFwiZmEtcGFnZWxpbmVzXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUElOVEVSRVNUID0gbmV3IEVJY29uKFwiZmEtcGludGVyZXN0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUElOVEVSRVNUX1NRVUFSRSA9IG5ldyBFSWNvbihcImZhLXBpbnRlcmVzdC1zcXVhcmVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9SRU5SRU4gPSBuZXcgRUljb24oXCJmYS1yZW5yZW5cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TS1lQRSA9IG5ldyBFSWNvbihcImZhLXNreXBlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfU1RBQ0tfRVhDSEFOR0UgPSBuZXcgRUljb24oXCJmYS1zdGFjay1leGNoYW5nZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NUQUNLX09WRVJGTE9XID0gbmV3IEVJY29uKFwiZmEtc3RhY2stb3ZlcmZsb3dcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9UUkVMTE8gPSBuZXcgRUljb24oXCJmYS10cmVsbG9cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9UVU1CTFIgPSBuZXcgRUljb24oXCJmYS10dW1ibHJcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9UVU1CTFJfU1FVQVJFID0gbmV3IEVJY29uKFwiZmEtdHVtYmxyLXNxdWFyZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1RXSVRURVIgPSBuZXcgRUljb24oXCJmYS10d2l0dGVyXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfVFdJVFRFUl9TUVVBUkUgPSBuZXcgRUljb24oXCJmYS10d2l0dGVyLXNxdWFyZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1ZJTUVPX1NRVUFSRSA9IG5ldyBFSWNvbihcImZhLXZpbWVvLXNxdWFyZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1ZLID0gbmV3IEVJY29uKFwiZmEtdmtcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9XRUlCTyA9IG5ldyBFSWNvbihcImZhLXdlaWJvXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfV0lORE9XUyA9IG5ldyBFSWNvbihcImZhLXdpbmRvd3NcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9YSU5HID0gbmV3IEVJY29uKFwiZmEteGluZ1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1hJTkdfU1FVQVJFID0gbmV3IEVJY29uKFwiZmEteGluZy1zcXVhcmVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9ZT1VUVUJFID0gbmV3IEVJY29uKFwiZmEteW91dHViZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1lPVVRVQkVfU1FVQVJFID0gbmV3IEVJY29uKFwiZmEteW91dHViZS1zcXVhcmVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9BTUJVTEFOQ0UgPSBuZXcgRUljb24oXCJmYS1hbWJ1bGFuY2VcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9IX1NRVUFSRSA9IG5ldyBFSWNvbihcImZhLWgtc3F1YXJlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfSE9TUElUQUxfTyA9IG5ldyBFSWNvbihcImZhLWhvc3BpdGFsLW9cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9NRURLSVQgPSBuZXcgRUljb24oXCJmYS1tZWRraXRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TVEVUSE9TQ09QRSA9IG5ldyBFSWNvbihcImZhLXN0ZXRob3Njb3BlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfVVNFUl9NRCA9IG5ldyBFSWNvbihcImZhLXVzZXItbWRcIik7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBfdmFsdWU6IHN0cmluZykge1xuXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGdldCBjbGFzc05hbWUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gICAgICAgIH1cblxuICAgIH1cblxufVxuXG5cbiIsIm1vZHVsZSBjdWJlZSB7XG5cbiAgICBleHBvcnQgY2xhc3MgRkFJY29uIGV4dGVuZHMgQVVzZXJDb250cm9sIHtcblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfaW5pdGlhbGl6ZWQgPSBmYWxzZTtcblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBpbml0RkEoKSB7XG4gICAgICAgICAgICBGQUljb24uX2luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciB3OiBhbnkgPSB3aW5kb3c7XG4gICAgICAgICAgICB3LmZhc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKTtcbiAgICAgICAgICAgIHcuZmFzdHN0eWxlLmhyZWYgPSBcIi8vbmV0ZG5hLmJvb3RzdHJhcGNkbi5jb20vZm9udC1hd2Vzb21lLzQuMC4zL2Nzcy9mb250LWF3ZXNvbWUuY3NzXCI7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0uYXBwZW5kQ2hpbGQody5mYXN0eWxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3NpemUgPSBuZXcgTnVtYmVyUHJvcGVydHkoMTYsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2NvbG9yID0gbmV3IENvbG9yUHJvcGVydHkoQ29sb3IuQkxBQ0ssIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3NwaW4gPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9pY29uID0gbmV3IFByb3BlcnR5PEVJY29uPihFSWNvbi5CQU4sIGZhbHNlLCBmYWxzZSk7XG5cbiAgICAgICAgcHJpdmF0ZSBfaUVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gbnVsbDtcblxuICAgICAgICBwcml2YXRlIF9jaGFuZ2VMaXN0ZW5lcjogSUNoYW5nZUxpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoU3R5bGUoKTtcbiAgICAgICAgfTtcblxuXG5cbiAgICAgICAgY29uc3RydWN0b3IoaWNvbjogRUljb24pIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgICAgICBpZiAoIUZBSWNvbi5faW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICAgICAgICBGQUljb24uaW5pdEZBKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaWNvbiA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgaWNvbiBwYXJhbWV0ZXIgY2FuIG5vdCBiZSBudWxsLlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzdXBlci53aWR0aFByb3BlcnR5KCkuYmluZCh0aGlzLl9zaXplKTtcbiAgICAgICAgICAgIHN1cGVyLmhlaWdodFByb3BlcnR5KCkuYmluZCh0aGlzLl9zaXplKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xuICAgICAgICAgICAgdGhpcy5faWNvbi52YWx1ZSA9IGljb247XG5cbiAgICAgICAgICAgIHRoaXMuX2lFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlcIik7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5faUVsZW1lbnQpO1xuXG4gICAgICAgICAgICB0aGlzLl9zaXplLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX2NoYW5nZUxpc3RlbmVyKTtcbiAgICAgICAgICAgIHRoaXMuX2NvbG9yLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX2NoYW5nZUxpc3RlbmVyKTtcbiAgICAgICAgICAgIHRoaXMuX3NwaW4uYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fY2hhbmdlTGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy5faWNvbi5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9jaGFuZ2VMaXN0ZW5lcik7XG5cbiAgICAgICAgICAgIHRoaXMucmVmcmVzaFN0eWxlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHJlZnJlc2hTdHlsZSgpIHtcbiAgICAgICAgICAgIHRoaXMuX2lFbGVtZW50LmNsYXNzTmFtZSA9IFwiZmFcIjtcbiAgICAgICAgICAgIGlmICh0aGlzLmljb24gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2lFbGVtZW50LmNsYXNzTmFtZSA9IFwiZmEgXCIgKyB0aGlzLl9pY29uLnZhbHVlLmNsYXNzTmFtZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5faUVsZW1lbnQuc3R5bGUuZm9udFNpemUgPSB0aGlzLnNpemUgKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLl9pRWxlbWVudC5zdHlsZS5jb2xvciA9IHRoaXMuX2NvbG9yLnZhbHVlLnRvQ1NTKCk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnNwaW4pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pRWxlbWVudC5jbGFzc05hbWUgPSB0aGlzLl9pRWxlbWVudC5jbGFzc05hbWUgKyBcIiBmYS1zcGluXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGluZUhlaWdodCA9IHRoaXMuc2l6ZSArIFwicHhcIjtcbiAgICAgICAgICAgIHRoaXMuX2lFbGVtZW50LnN0eWxlLmJhY2tmYWNlVmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgY29sb3JQcm9wZXJ0eSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb2xvcjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgQ29sb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb2xvclByb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGNvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQ29sb3IudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGNvbG9yKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkNvbG9yLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgc2l6ZVByb3BlcnR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NpemU7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IFNpemUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zaXplUHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgc2l6ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlNpemUudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHNpemUodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuU2l6ZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIHNwaW5Qcm9wZXJ0eSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zcGluO1xuICAgICAgICB9XG4gICAgICAgIGdldCBTcGluKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3BpblByb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHNwaW4oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5TcGluLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBzcGluKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlNwaW4udmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBpY29uUHJvcGVydHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faWNvbjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgSWNvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmljb25Qcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIGdldCBpY29uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuSWNvbi52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgaWNvbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5JY29uLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgIH1cblxufVxuXG5cbiJdfQ==