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
                this._iElement.className = this._iElement.className = "fa-spin";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3ViZWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9ldmVudHMudHMiLCIuLi8uLi9wcm9wZXJ0aWVzLnRzIiwiLi4vLi4vc3R5bGVzLnRzIiwiLi4vLi4vdXRpbHMudHMiLCIuLi8uLi9jb21wb25lbnRfYmFzZS9MYXlvdXRDaGlsZHJlbi50cyIsIi4uLy4uL2NvbXBvbmVudF9iYXNlL0FDb21wb25lbnQudHMiLCIuLi8uLi9jb21wb25lbnRfYmFzZS9BTGF5b3V0LnRzIiwiLi4vLi4vY29tcG9uZW50X2Jhc2UvQVVzZXJDb250cm9sLnRzIiwiLi4vLi4vY29tcG9uZW50X2Jhc2UvQVZpZXcudHMiLCIuLi8uLi9sYXlvdXRzL1BhbmVsLnRzIiwiLi4vLi4vbGF5b3V0cy9IQm94LnRzIiwiLi4vLi4vbGF5b3V0cy9WQm94LnRzIiwiLi4vLi4vbGF5b3V0cy9TY3JvbGxCb3gudHMiLCIuLi8uLi9jb21wb25lbnRzL0xhYmVsLnRzIiwiLi4vLi4vY29tcG9uZW50cy9CdXR0b24udHMiLCIuLi8uLi9jb21wb25lbnRzL1RleHRCb3gudHMiLCIuLi8uLi9jb21wb25lbnRzL1Bhc3N3b3JkQm94LnRzIiwiLi4vLi4vY29tcG9uZW50cy9UZXh0QXJlYS50cyIsIi4uLy4uL2NvbXBvbmVudHMvQ2hlY2tCb3gudHMiLCIuLi8uLi9jb21wb25lbnRzL0NvbWJvQm94LnRzIiwiLi4vLi4vY29tcG9uZW50cy9QaWN0dXJlQm94LnRzIiwiLi4vLi4vcG9wdXBzLnRzIiwiLi4vLi4vY3ViZWUudHMiLCIuLi8uLi9jb21wb25lbnRzL0VJY29uLnRzIiwiLi4vLi4vY29tcG9uZW50cy9GQUljb24udHMiXSwibmFtZXMiOlsiY3ViZWUiLCJjdWJlZS5FdmVudEFyZ3MiLCJjdWJlZS5FdmVudEFyZ3MuY29uc3RydWN0b3IiLCJjdWJlZS5IdG1sRXZlbnRMaXN0ZW5lckNhbGxiYWNrIiwiY3ViZWUuSHRtbEV2ZW50TGlzdGVuZXJDYWxsYmFjay5jb25zdHJ1Y3RvciIsImN1YmVlLkh0bWxFdmVudExpc3RlbmVyQ2FsbGJhY2sub25BZGRlZCIsImN1YmVlLkh0bWxFdmVudExpc3RlbmVyQ2FsbGJhY2sub25SZW1vdmVkIiwiY3ViZWUuRXZlbnQiLCJjdWJlZS5FdmVudC5jb25zdHJ1Y3RvciIsImN1YmVlLkV2ZW50LmFkZExpc3RlbmVyIiwiY3ViZWUuRXZlbnQucmVtb3ZlTGlzdGVuZXIiLCJjdWJlZS5FdmVudC5oYXNMaXN0ZW5lciIsImN1YmVlLkV2ZW50LmZpcmVFdmVudCIsImN1YmVlLkV2ZW50Lmxpc3RlbmVyQ2FsbGJhY2siLCJjdWJlZS5UaW1lciIsImN1YmVlLlRpbWVyLmNvbnN0cnVjdG9yIiwiY3ViZWUuVGltZXIuc3RhcnQiLCJjdWJlZS5UaW1lci5zdG9wIiwiY3ViZWUuVGltZXIuU3RhcnRlZCIsImN1YmVlLkV2ZW50UXVldWUiLCJjdWJlZS5FdmVudFF1ZXVlLmNvbnN0cnVjdG9yIiwiY3ViZWUuRXZlbnRRdWV1ZS5JbnN0YW5jZSIsImN1YmVlLkV2ZW50UXVldWUuaW52b2tlTGF0ZXIiLCJjdWJlZS5FdmVudFF1ZXVlLmludm9rZVByaW9yIiwiY3ViZWUuUnVuT25jZSIsImN1YmVlLlJ1bk9uY2UuY29uc3RydWN0b3IiLCJjdWJlZS5SdW5PbmNlLnJ1biIsImN1YmVlLlBhcmVudENoYW5nZWRFdmVudEFyZ3MiLCJjdWJlZS5QYXJlbnRDaGFuZ2VkRXZlbnRBcmdzLmNvbnN0cnVjdG9yIiwiY3ViZWUuUHJvcGVydHkiLCJjdWJlZS5Qcm9wZXJ0eS5jb25zdHJ1Y3RvciIsImN1YmVlLlByb3BlcnR5LmlkIiwiY3ViZWUuUHJvcGVydHkudmFsaWQiLCJjdWJlZS5Qcm9wZXJ0eS52YWx1ZSIsImN1YmVlLlByb3BlcnR5Lm51bGxhYmxlIiwiY3ViZWUuUHJvcGVydHkucmVhZG9ubHkiLCJjdWJlZS5Qcm9wZXJ0eS5pbml0UmVhZG9ubHlCaW5kIiwiY3ViZWUuUHJvcGVydHkuZ2V0IiwiY3ViZWUuUHJvcGVydHkuc2V0IiwiY3ViZWUuUHJvcGVydHkuaW52YWxpZGF0ZSIsImN1YmVlLlByb3BlcnR5LmludmFsaWRhdGVJZk5lZWRlZCIsImN1YmVlLlByb3BlcnR5LmZpcmVDaGFuZ2VMaXN0ZW5lcnMiLCJjdWJlZS5Qcm9wZXJ0eS5nZXRPYmplY3RWYWx1ZSIsImN1YmVlLlByb3BlcnR5LmFkZENoYW5nZUxpc3RlbmVyIiwiY3ViZWUuUHJvcGVydHkucmVtb3ZlQ2hhbmdlTGlzdGVuZXIiLCJjdWJlZS5Qcm9wZXJ0eS5oYXNDaGFuZ2VMaXN0ZW5lciIsImN1YmVlLlByb3BlcnR5LmFuaW1hdGUiLCJjdWJlZS5Qcm9wZXJ0eS5iaW5kIiwiY3ViZWUuUHJvcGVydHkuYmlkaXJlY3Rpb25hbEJpbmQiLCJjdWJlZS5Qcm9wZXJ0eS51bmJpbmQiLCJjdWJlZS5Qcm9wZXJ0eS51bmJpbmRUYXJnZXRzIiwiY3ViZWUuUHJvcGVydHkuaXNCb3VuZCIsImN1YmVlLlByb3BlcnR5LmlzQmlkaXJlY3Rpb25hbEJvdW5kIiwiY3ViZWUuUHJvcGVydHkuY3JlYXRlUHJvcGVydHlMaW5lIiwiY3ViZWUuUHJvcGVydHkuZGVzdHJveSIsImN1YmVlLkV4cHJlc3Npb24iLCJjdWJlZS5FeHByZXNzaW9uLmNvbnN0cnVjdG9yIiwiY3ViZWUuRXhwcmVzc2lvbi52YWx1ZSIsImN1YmVlLkV4cHJlc3Npb24uYWRkQ2hhbmdlTGlzdGVuZXIiLCJjdWJlZS5FeHByZXNzaW9uLnJlbW92ZUNoYW5nZUxpc3RlbmVyIiwiY3ViZWUuRXhwcmVzc2lvbi5oYXNDaGFuZ2VMaXN0ZW5lciIsImN1YmVlLkV4cHJlc3Npb24uZ2V0T2JqZWN0VmFsdWUiLCJjdWJlZS5FeHByZXNzaW9uLmJpbmQiLCJjdWJlZS5FeHByZXNzaW9uLnVuYmluZEFsbCIsImN1YmVlLkV4cHJlc3Npb24udW5iaW5kIiwiY3ViZWUuRXhwcmVzc2lvbi5pbnZhbGlkYXRlIiwiY3ViZWUuRXhwcmVzc2lvbi5pbnZhbGlkYXRlSWZOZWVkZWQiLCJjdWJlZS5FeHByZXNzaW9uLmZpcmVDaGFuZ2VMaXN0ZW5lcnMiLCJjdWJlZS5LZXlGcmFtZSIsImN1YmVlLktleUZyYW1lLmNvbnN0cnVjdG9yIiwiY3ViZWUuS2V5RnJhbWUudGltZSIsImN1YmVlLktleUZyYW1lLnByb3BlcnR5IiwiY3ViZWUuS2V5RnJhbWUuZW5kVmFsdWUiLCJjdWJlZS5LZXlGcmFtZS5pbnRlcnBvbGF0b3IiLCJjdWJlZS5LZXlGcmFtZS5rZXlGcmFtZVJlYWNoZWRMaXN0ZW5lciIsImN1YmVlLlByb3BlcnR5TGluZSIsImN1YmVlLlByb3BlcnR5TGluZS5jb25zdHJ1Y3RvciIsImN1YmVlLlByb3BlcnR5TGluZS5zdGFydFRpbWUiLCJjdWJlZS5Qcm9wZXJ0eUxpbmUuYW5pbWF0ZSIsImN1YmVlLkludGVycG9sYXRvcnMiLCJjdWJlZS5JbnRlcnBvbGF0b3JzLmNvbnN0cnVjdG9yIiwiY3ViZWUuSW50ZXJwb2xhdG9ycy5MaW5lYXIiLCJjdWJlZS5BQW5pbWF0b3IiLCJjdWJlZS5BQW5pbWF0b3IuY29uc3RydWN0b3IiLCJjdWJlZS5BQW5pbWF0b3IuYW5pbWF0ZSIsImN1YmVlLkFBbmltYXRvci5zdGFydCIsImN1YmVlLkFBbmltYXRvci5zdG9wIiwiY3ViZWUuQUFuaW1hdG9yLlN0YXJ0ZWQiLCJjdWJlZS5BQW5pbWF0b3IuU3RvcHBlZCIsImN1YmVlLlRpbWVsaW5lIiwiY3ViZWUuVGltZWxpbmUuY29uc3RydWN0b3IiLCJjdWJlZS5UaW1lbGluZS5jcmVhdGVQcm9wZXJ0eUxpbmVzIiwiY3ViZWUuVGltZWxpbmUuc3RhcnQiLCJjdWJlZS5UaW1lbGluZS5zdG9wIiwiY3ViZWUuVGltZWxpbmUub25BbmltYXRlIiwiY3ViZWUuVGltZWxpbmUub25GaW5pc2hlZEV2ZW50IiwiY3ViZWUuVGltZWxpbmVGaW5pc2hlZEV2ZW50QXJncyIsImN1YmVlLlRpbWVsaW5lRmluaXNoZWRFdmVudEFyZ3MuY29uc3RydWN0b3IiLCJjdWJlZS5UaW1lbGluZUZpbmlzaGVkRXZlbnRBcmdzLlN0b3BwZWQiLCJjdWJlZS5OdW1iZXJQcm9wZXJ0eSIsImN1YmVlLk51bWJlclByb3BlcnR5LmNvbnN0cnVjdG9yIiwiY3ViZWUuTnVtYmVyUHJvcGVydHkuYW5pbWF0ZSIsImN1YmVlLlN0cmluZ1Byb3BlcnR5IiwiY3ViZWUuU3RyaW5nUHJvcGVydHkuY29uc3RydWN0b3IiLCJjdWJlZS5QYWRkaW5nUHJvcGVydHkiLCJjdWJlZS5QYWRkaW5nUHJvcGVydHkuY29uc3RydWN0b3IiLCJjdWJlZS5Cb3JkZXJQcm9wZXJ0eSIsImN1YmVlLkJvcmRlclByb3BlcnR5LmNvbnN0cnVjdG9yIiwiY3ViZWUuQmFja2dyb3VuZFByb3BlcnR5IiwiY3ViZWUuQmFja2dyb3VuZFByb3BlcnR5LmNvbnN0cnVjdG9yIiwiY3ViZWUuQm9vbGVhblByb3BlcnR5IiwiY3ViZWUuQm9vbGVhblByb3BlcnR5LmNvbnN0cnVjdG9yIiwiY3ViZWUuQ29sb3JQcm9wZXJ0eSIsImN1YmVlLkNvbG9yUHJvcGVydHkuY29uc3RydWN0b3IiLCJjdWJlZS5BQmFja2dyb3VuZCIsImN1YmVlLkFCYWNrZ3JvdW5kLmNvbnN0cnVjdG9yIiwiY3ViZWUuQ29sb3IiLCJjdWJlZS5Db2xvci5jb25zdHJ1Y3RvciIsImN1YmVlLkNvbG9yLlRSQU5TUEFSRU5UIiwiY3ViZWUuQ29sb3IuV0hJVEUiLCJjdWJlZS5Db2xvci5CTEFDSyIsImN1YmVlLkNvbG9yLkxJR0hUX0dSQVkiLCJjdWJlZS5Db2xvci5nZXRBcmdiQ29sb3IiLCJjdWJlZS5Db2xvci5nZXRBcmdiQ29sb3JCeUNvbXBvbmVudHMiLCJjdWJlZS5Db2xvci5nZXRSZ2JDb2xvciIsImN1YmVlLkNvbG9yLmdldFJnYkNvbG9yQnlDb21wb25lbnRzIiwiY3ViZWUuQ29sb3IuZml4Q29tcG9uZW50IiwiY3ViZWUuQ29sb3IuZmFkZUNvbG9ycyIsImN1YmVlLkNvbG9yLm1peENvbXBvbmVudCIsImN1YmVlLkNvbG9yLmFyZ2IiLCJjdWJlZS5Db2xvci5hbHBoYSIsImN1YmVlLkNvbG9yLnJlZCIsImN1YmVlLkNvbG9yLmdyZWVuIiwiY3ViZWUuQ29sb3IuYmx1ZSIsImN1YmVlLkNvbG9yLmZhZGUiLCJjdWJlZS5Db2xvci50b0NTUyIsImN1YmVlLkNvbG9yQmFja2dyb3VuZCIsImN1YmVlLkNvbG9yQmFja2dyb3VuZC5jb25zdHJ1Y3RvciIsImN1YmVlLkNvbG9yQmFja2dyb3VuZC5jb2xvciIsImN1YmVlLkNvbG9yQmFja2dyb3VuZC5hcHBseSIsImN1YmVlLlBhZGRpbmciLCJjdWJlZS5QYWRkaW5nLmNvbnN0cnVjdG9yIiwiY3ViZWUuUGFkZGluZy5jcmVhdGUiLCJjdWJlZS5QYWRkaW5nLmxlZnQiLCJjdWJlZS5QYWRkaW5nLnRvcCIsImN1YmVlLlBhZGRpbmcucmlnaHQiLCJjdWJlZS5QYWRkaW5nLmJvdHRvbSIsImN1YmVlLlBhZGRpbmcuYXBwbHkiLCJjdWJlZS5Cb3JkZXIiLCJjdWJlZS5Cb3JkZXIuY29uc3RydWN0b3IiLCJjdWJlZS5Cb3JkZXIuY3JlYXRlIiwiY3ViZWUuQm9yZGVyLmxlZnRXaWR0aCIsImN1YmVlLkJvcmRlci50b3BXaWR0aCIsImN1YmVlLkJvcmRlci5yaWdodFdpZHRoIiwiY3ViZWUuQm9yZGVyLmJvdHRvbVdpZHRoIiwiY3ViZWUuQm9yZGVyLmxlZnRDb2xvciIsImN1YmVlLkJvcmRlci50b3BDb2xvciIsImN1YmVlLkJvcmRlci5yaWdodENvbG9yIiwiY3ViZWUuQm9yZGVyLmJvdHRvbUNvbG9yIiwiY3ViZWUuQm9yZGVyLnRvcExlZnRSYWRpdXMiLCJjdWJlZS5Cb3JkZXIudG9wUmlnaHRSYWRpdXMiLCJjdWJlZS5Cb3JkZXIuYm90dG9tTGVmdFJhZGl1cyIsImN1YmVlLkJvcmRlci5ib3R0b21SaWdodFJhZGl1cyIsImN1YmVlLkJvcmRlci5hcHBseSIsImN1YmVlLkJveFNoYWRvdyIsImN1YmVlLkJveFNoYWRvdy5jb25zdHJ1Y3RvciIsImN1YmVlLkJveFNoYWRvdy5oUG9zIiwiY3ViZWUuQm94U2hhZG93LnZQb3MiLCJjdWJlZS5Cb3hTaGFkb3cuYmx1ciIsImN1YmVlLkJveFNoYWRvdy5zcHJlYWQiLCJjdWJlZS5Cb3hTaGFkb3cuY29sb3IiLCJjdWJlZS5Cb3hTaGFkb3cuaW5uZXIiLCJjdWJlZS5Cb3hTaGFkb3cuYXBwbHkiLCJjdWJlZS5FVGV4dE92ZXJmbG93IiwiY3ViZWUuRVRleHRPdmVyZmxvdy5jb25zdHJ1Y3RvciIsImN1YmVlLkVUZXh0T3ZlcmZsb3cuQ0xJUCIsImN1YmVlLkVUZXh0T3ZlcmZsb3cuRUxMSVBTSVMiLCJjdWJlZS5FVGV4dE92ZXJmbG93LkNTUyIsImN1YmVlLkVUZXh0T3ZlcmZsb3cuYXBwbHkiLCJjdWJlZS5FVGV4dEFsaWduIiwiY3ViZWUuRVRleHRBbGlnbi5jb25zdHJ1Y3RvciIsImN1YmVlLkVUZXh0QWxpZ24uTEVGVCIsImN1YmVlLkVUZXh0QWxpZ24uQ0VOVEVSIiwiY3ViZWUuRVRleHRBbGlnbi5SSUdIVCIsImN1YmVlLkVUZXh0QWxpZ24uSlVTVElGWSIsImN1YmVlLkVUZXh0QWxpZ24uQ1NTIiwiY3ViZWUuRVRleHRBbGlnbi5hcHBseSIsImN1YmVlLkVIQWxpZ24iLCJjdWJlZS5FSEFsaWduLmNvbnN0cnVjdG9yIiwiY3ViZWUuRUhBbGlnbi5MRUZUIiwiY3ViZWUuRUhBbGlnbi5DRU5URVIiLCJjdWJlZS5FSEFsaWduLlJJR0hUIiwiY3ViZWUuRUhBbGlnbi5DU1MiLCJjdWJlZS5FVkFsaWduIiwiY3ViZWUuRVZBbGlnbi5jb25zdHJ1Y3RvciIsImN1YmVlLkVWQWxpZ24uVE9QIiwiY3ViZWUuRVZBbGlnbi5NSURETEUiLCJjdWJlZS5FVkFsaWduLkJPVFRPTSIsImN1YmVlLkVWQWxpZ24uQ1NTIiwiY3ViZWUuRm9udEZhbWlseSIsImN1YmVlLkZvbnRGYW1pbHkuY29uc3RydWN0b3IiLCJjdWJlZS5Gb250RmFtaWx5LkFyaWFsIiwiY3ViZWUuRm9udEZhbWlseS5pbml0Rm9udENvbnRhaW5lclN0eWxlIiwiY3ViZWUuRm9udEZhbWlseS5yZWdpc3RlckZvbnQiLCJjdWJlZS5Gb250RmFtaWx5LkNTUyIsImN1YmVlLkZvbnRGYW1pbHkuYXBwbHkiLCJjdWJlZS5FQ3Vyc29yIiwiY3ViZWUuRUN1cnNvci5jb25zdHJ1Y3RvciIsImN1YmVlLkVDdXJzb3IuQVVUTyIsImN1YmVlLkVDdXJzb3IuY3NzIiwiY3ViZWUuRVNjcm9sbEJhclBvbGljeSIsImN1YmVlLkVQaWN0dXJlU2l6ZU1vZGUiLCJjdWJlZS5JbWFnZSIsImN1YmVlLkltYWdlLmNvbnN0cnVjdG9yIiwiY3ViZWUuSW1hZ2UudXJsIiwiY3ViZWUuSW1hZ2Uub25Mb2FkIiwiY3ViZWUuSW1hZ2Uud2lkdGgiLCJjdWJlZS5JbWFnZS5oZWlnaHQiLCJjdWJlZS5JbWFnZS5sb2FkZWQiLCJjdWJlZS5JbWFnZS5hcHBseSIsImN1YmVlLlBvaW50MkQiLCJjdWJlZS5Qb2ludDJELmNvbnN0cnVjdG9yIiwiY3ViZWUuUG9pbnQyRC54IiwiY3ViZWUuUG9pbnQyRC55IiwiY3ViZWUuTGF5b3V0Q2hpbGRyZW4iLCJjdWJlZS5MYXlvdXRDaGlsZHJlbi5jb25zdHJ1Y3RvciIsImN1YmVlLkxheW91dENoaWxkcmVuLmFkZCIsImN1YmVlLkxheW91dENoaWxkcmVuLmluc2VydCIsImN1YmVlLkxheW91dENoaWxkcmVuLnJlbW92ZUNvbXBvbmVudCIsImN1YmVlLkxheW91dENoaWxkcmVuLnJlbW92ZUluZGV4IiwiY3ViZWUuTGF5b3V0Q2hpbGRyZW4uY2xlYXIiLCJjdWJlZS5MYXlvdXRDaGlsZHJlbi5nZXQiLCJjdWJlZS5MYXlvdXRDaGlsZHJlbi5pbmRleE9mIiwiY3ViZWUuTGF5b3V0Q2hpbGRyZW4uc2l6ZSIsImN1YmVlLk1vdXNlRXZlbnRUeXBlcyIsImN1YmVlLk1vdXNlRXZlbnRUeXBlcy5jb25zdHJ1Y3RvciIsImN1YmVlLkFDb21wb25lbnQiLCJjdWJlZS5BQ29tcG9uZW50LmNvbnN0cnVjdG9yIiwiY3ViZWUuQUNvbXBvbmVudC5pbnZva2VQb3N0Q29uc3RydWN0IiwiY3ViZWUuQUNvbXBvbmVudC5wb3N0Q29uc3RydWN0IiwiY3ViZWUuQUNvbXBvbmVudC5zZXRDdWJlZVBhbmVsIiwiY3ViZWUuQUNvbXBvbmVudC5nZXRDdWJlZVBhbmVsIiwiY3ViZWUuQUNvbXBvbmVudC51cGRhdGVUcmFuc2Zvcm0iLCJjdWJlZS5BQ29tcG9uZW50LnJlcXVlc3RMYXlvdXQiLCJjdWJlZS5BQ29tcG9uZW50Lm1lYXN1cmUiLCJjdWJlZS5BQ29tcG9uZW50Lm9uTWVhc3VyZSIsImN1YmVlLkFDb21wb25lbnQuc2NhbGVQb2ludCIsImN1YmVlLkFDb21wb25lbnQucm90YXRlUG9pbnQiLCJjdWJlZS5BQ29tcG9uZW50LmVsZW1lbnQiLCJjdWJlZS5BQ29tcG9uZW50LnBhcmVudCIsImN1YmVlLkFDb21wb25lbnQuX3NldFBhcmVudCIsImN1YmVlLkFDb21wb25lbnQubGF5b3V0IiwiY3ViZWUuQUNvbXBvbmVudC5uZWVkc0xheW91dCIsImN1YmVlLkFDb21wb25lbnQuVHJhbnNsYXRlWCIsImN1YmVlLkFDb21wb25lbnQudHJhbnNsYXRlWCIsImN1YmVlLkFDb21wb25lbnQuVHJhbnNsYXRlWSIsImN1YmVlLkFDb21wb25lbnQudHJhbnNsYXRlWSIsImN1YmVlLkFDb21wb25lbnQucGFkZGluZ1Byb3BlcnR5IiwiY3ViZWUuQUNvbXBvbmVudC5QYWRkaW5nIiwiY3ViZWUuQUNvbXBvbmVudC5wYWRkaW5nIiwiY3ViZWUuQUNvbXBvbmVudC5ib3JkZXJQcm9wZXJ0eSIsImN1YmVlLkFDb21wb25lbnQuQm9yZGVyIiwiY3ViZWUuQUNvbXBvbmVudC5ib3JkZXIiLCJjdWJlZS5BQ29tcG9uZW50Lk1lYXN1cmVkV2lkdGgiLCJjdWJlZS5BQ29tcG9uZW50Lm1lYXN1cmVkV2lkdGgiLCJjdWJlZS5BQ29tcG9uZW50Lk1lYXN1cmVkSGVpZ2h0IiwiY3ViZWUuQUNvbXBvbmVudC5tZWFzdXJlZEhlaWdodCIsImN1YmVlLkFDb21wb25lbnQuQ2xpZW50V2lkdGgiLCJjdWJlZS5BQ29tcG9uZW50LmNsaWVudFdpZHRoIiwiY3ViZWUuQUNvbXBvbmVudC5DbGllbnRIZWlnaHQiLCJjdWJlZS5BQ29tcG9uZW50LmNsaWVudEhlaWdodCIsImN1YmVlLkFDb21wb25lbnQuQm91bmRzV2lkdGgiLCJjdWJlZS5BQ29tcG9uZW50LmJvdW5kc1dpZHRoIiwiY3ViZWUuQUNvbXBvbmVudC5Cb3VuZHNIZWlnaHQiLCJjdWJlZS5BQ29tcG9uZW50LmJvdW5kc0hlaWdodCIsImN1YmVlLkFDb21wb25lbnQuQm91bmRzTGVmdCIsImN1YmVlLkFDb21wb25lbnQuYm91bmRzTGVmdCIsImN1YmVlLkFDb21wb25lbnQuQm91bmRzVG9wIiwiY3ViZWUuQUNvbXBvbmVudC5ib3VuZHNUb3AiLCJjdWJlZS5BQ29tcG9uZW50Lm1pbldpZHRoUHJvcGVydHkiLCJjdWJlZS5BQ29tcG9uZW50Lk1pbldpZHRoIiwiY3ViZWUuQUNvbXBvbmVudC5taW5XaWR0aCIsImN1YmVlLkFDb21wb25lbnQubWluSGVpZ2h0UHJvcGVydHkiLCJjdWJlZS5BQ29tcG9uZW50Lk1pbkhlaWdodCIsImN1YmVlLkFDb21wb25lbnQubWluSGVpZ2h0IiwiY3ViZWUuQUNvbXBvbmVudC5tYXhXaWR0aFByb3BlcnR5IiwiY3ViZWUuQUNvbXBvbmVudC5NYXhXaWR0aCIsImN1YmVlLkFDb21wb25lbnQubWF4V2lkdGgiLCJjdWJlZS5BQ29tcG9uZW50Lm1heEhlaWdodFByb3BlcnR5IiwiY3ViZWUuQUNvbXBvbmVudC5NYXhIZWlnaHQiLCJjdWJlZS5BQ29tcG9uZW50Lm1heEhlaWdodCIsImN1YmVlLkFDb21wb25lbnQuc2V0UG9zaXRpb24iLCJjdWJlZS5BQ29tcG9uZW50Ll9zZXRMZWZ0IiwiY3ViZWUuQUNvbXBvbmVudC5fc2V0VG9wIiwiY3ViZWUuQUNvbXBvbmVudC5zZXRTaXplIiwiY3ViZWUuQUNvbXBvbmVudC5DdXJzb3IiLCJjdWJlZS5BQ29tcG9uZW50LmN1cnNvciIsImN1YmVlLkFDb21wb25lbnQuUG9pbnRlclRyYW5zcGFyZW50IiwiY3ViZWUuQUNvbXBvbmVudC5wb2ludGVyVHJhbnNwYXJlbnQiLCJjdWJlZS5BQ29tcG9uZW50LlZpc2libGUiLCJjdWJlZS5BQ29tcG9uZW50LnZpc2libGUiLCJjdWJlZS5BQ29tcG9uZW50Lm9uQ2xpY2siLCJjdWJlZS5BQ29tcG9uZW50Lm9uQ29udGV4dE1lbnUiLCJjdWJlZS5BQ29tcG9uZW50Lm9uTW91c2VEb3duIiwiY3ViZWUuQUNvbXBvbmVudC5vbk1vdXNlTW92ZSIsImN1YmVlLkFDb21wb25lbnQub25Nb3VzZVVwIiwiY3ViZWUuQUNvbXBvbmVudC5vbk1vdXNlRW50ZXIiLCJjdWJlZS5BQ29tcG9uZW50Lm9uTW91c2VMZWF2ZSIsImN1YmVlLkFDb21wb25lbnQub25Nb3VzZVdoZWVsIiwiY3ViZWUuQUNvbXBvbmVudC5vbktleURvd24iLCJjdWJlZS5BQ29tcG9uZW50Lm9uS2V5UHJlc3MiLCJjdWJlZS5BQ29tcG9uZW50Lm9uS2V5VXAiLCJjdWJlZS5BQ29tcG9uZW50Lm9uUGFyZW50Q2hhbmdlZCIsImN1YmVlLkFDb21wb25lbnQuQWxwaGEiLCJjdWJlZS5BQ29tcG9uZW50LmFscGhhIiwiY3ViZWUuQUNvbXBvbmVudC5IYW5kbGVQb2ludGVyIiwiY3ViZWUuQUNvbXBvbmVudC5oYW5kbGVQb2ludGVyIiwiY3ViZWUuQUNvbXBvbmVudC5FbmFibGVkIiwiY3ViZWUuQUNvbXBvbmVudC5lbmFibGVkIiwiY3ViZWUuQUNvbXBvbmVudC5TZWxlY3RhYmxlIiwiY3ViZWUuQUNvbXBvbmVudC5zZWxlY3RhYmxlIiwiY3ViZWUuQUNvbXBvbmVudC5sZWZ0IiwiY3ViZWUuQUNvbXBvbmVudC50b3AiLCJjdWJlZS5BQ29tcG9uZW50LlJvdGF0ZSIsImN1YmVlLkFDb21wb25lbnQucm90YXRlIiwiY3ViZWUuQUNvbXBvbmVudC5TY2FsZVgiLCJjdWJlZS5BQ29tcG9uZW50LnNjYWxlWCIsImN1YmVlLkFDb21wb25lbnQuU2NhbGVZIiwiY3ViZWUuQUNvbXBvbmVudC5zY2FsZVkiLCJjdWJlZS5BQ29tcG9uZW50LlRyYW5zZm9ybUNlbnRlclgiLCJjdWJlZS5BQ29tcG9uZW50LnRyYW5zZm9ybUNlbnRlclgiLCJjdWJlZS5BQ29tcG9uZW50LlRyYW5zZm9ybUNlbnRlclkiLCJjdWJlZS5BQ29tcG9uZW50LnRyYW5zZm9ybUNlbnRlclkiLCJjdWJlZS5BQ29tcG9uZW50LkhvdmVyZWQiLCJjdWJlZS5BQ29tcG9uZW50LmhvdmVyZWQiLCJjdWJlZS5BQ29tcG9uZW50LlByZXNzZWQiLCJjdWJlZS5BQ29tcG9uZW50LnByZXNzZWQiLCJjdWJlZS5BTGF5b3V0IiwiY3ViZWUuQUxheW91dC5jb25zdHJ1Y3RvciIsImN1YmVlLkFMYXlvdXQuY2hpbGRyZW5faW5uZXIiLCJjdWJlZS5BTGF5b3V0LmxheW91dCIsImN1YmVlLkFMYXlvdXQuZ2V0Q29tcG9uZW50c0F0UG9zaXRpb24iLCJjdWJlZS5BTGF5b3V0LmdldENvbXBvbmVudHNBdFBvc2l0aW9uX2ltcGwiLCJjdWJlZS5BTGF5b3V0LnNldENoaWxkTGVmdCIsImN1YmVlLkFMYXlvdXQuc2V0Q2hpbGRUb3AiLCJjdWJlZS5BVXNlckNvbnRyb2wiLCJjdWJlZS5BVXNlckNvbnRyb2wuY29uc3RydWN0b3IiLCJjdWJlZS5BVXNlckNvbnRyb2wud2lkdGhQcm9wZXJ0eSIsImN1YmVlLkFVc2VyQ29udHJvbC5XaWR0aCIsImN1YmVlLkFVc2VyQ29udHJvbC53aWR0aCIsImN1YmVlLkFVc2VyQ29udHJvbC5oZWlnaHRQcm9wZXJ0eSIsImN1YmVlLkFVc2VyQ29udHJvbC5IZWlnaHQiLCJjdWJlZS5BVXNlckNvbnRyb2wuaGVpZ2h0IiwiY3ViZWUuQVVzZXJDb250cm9sLmJhY2tncm91bmRQcm9wZXJ0eSIsImN1YmVlLkFVc2VyQ29udHJvbC5CYWNrZ3JvdW5kIiwiY3ViZWUuQVVzZXJDb250cm9sLmJhY2tncm91bmQiLCJjdWJlZS5BVXNlckNvbnRyb2wuc2hhZG93UHJvcGVydHkiLCJjdWJlZS5BVXNlckNvbnRyb2wuU2hhZG93IiwiY3ViZWUuQVVzZXJDb250cm9sLnNoYWRvdyIsImN1YmVlLkFVc2VyQ29udHJvbC5EcmFnZ2FibGUiLCJjdWJlZS5BVXNlckNvbnRyb2wuZHJhZ2dhYmxlIiwiY3ViZWUuQVVzZXJDb250cm9sLl9vbkNoaWxkQWRkZWQiLCJjdWJlZS5BVXNlckNvbnRyb2wuX29uQ2hpbGRSZW1vdmVkIiwiY3ViZWUuQVVzZXJDb250cm9sLl9vbkNoaWxkcmVuQ2xlYXJlZCIsImN1YmVlLkFVc2VyQ29udHJvbC5vbkxheW91dCIsImN1YmVlLkFWaWV3IiwiY3ViZWUuQVZpZXcuY29uc3RydWN0b3IiLCJjdWJlZS5BVmlldy5tb2RlbCIsImN1YmVlLlBhbmVsIiwiY3ViZWUuUGFuZWwuY29uc3RydWN0b3IiLCJjdWJlZS5QYW5lbC53aWR0aFByb3BlcnR5IiwiY3ViZWUuUGFuZWwuV2lkdGgiLCJjdWJlZS5QYW5lbC53aWR0aCIsImN1YmVlLlBhbmVsLmhlaWdodFByb3BlcnR5IiwiY3ViZWUuUGFuZWwuSGVpZ2h0IiwiY3ViZWUuUGFuZWwuaGVpZ2h0IiwiY3ViZWUuUGFuZWwuYmFja2dyb3VuZFByb3BlcnR5IiwiY3ViZWUuUGFuZWwuQmFja2dyb3VuZCIsImN1YmVlLlBhbmVsLmJhY2tncm91bmQiLCJjdWJlZS5QYW5lbC5zaGFkb3dQcm9wZXJ0eSIsImN1YmVlLlBhbmVsLlNoYWRvdyIsImN1YmVlLlBhbmVsLnNoYWRvdyIsImN1YmVlLlBhbmVsLmNoaWxkcmVuIiwiY3ViZWUuSEJveCIsImN1YmVlLkhCb3guY29uc3RydWN0b3IiLCJjdWJlZS5IQm94LnNldENlbGxXaWR0aCIsImN1YmVlLkhCb3guZ2V0Q2VsbFdpZHRoIiwiY3ViZWUuSEJveC5zZXRDZWxsSEFsaWduIiwiY3ViZWUuSEJveC5nZXRDZWxsSEFsaWduIiwiY3ViZWUuSEJveC5zZXRDZWxsVkFsaWduIiwiY3ViZWUuSEJveC5nZXRDZWxsVkFsaWduIiwiY3ViZWUuSEJveC5zZXRMYXN0Q2VsbEhBbGlnbiIsImN1YmVlLkhCb3guc2V0TGFzdENlbGxWQWxpZ24iLCJjdWJlZS5IQm94LnNldExhc3RDZWxsV2lkdGgiLCJjdWJlZS5IQm94LmFkZEVtcHR5Q2VsbCIsImN1YmVlLkhCb3guX29uQ2hpbGRBZGRlZCIsImN1YmVlLkhCb3guX29uQ2hpbGRSZW1vdmVkIiwiY3ViZWUuSEJveC5fb25DaGlsZHJlbkNsZWFyZWQiLCJjdWJlZS5IQm94Lm9uTGF5b3V0IiwiY3ViZWUuSEJveC5zZXRJbkxpc3QiLCJjdWJlZS5IQm94LmdldEZyb21MaXN0IiwiY3ViZWUuSEJveC5yZW1vdmVGcm9tTGlzdCIsImN1YmVlLkhCb3guY2hpbGRyZW4iLCJjdWJlZS5IQm94LkhlaWdodCIsImN1YmVlLkhCb3guaGVpZ2h0IiwiY3ViZWUuVkJveCIsImN1YmVlLlZCb3guY29uc3RydWN0b3IiLCJjdWJlZS5WQm94LmNoaWxkcmVuIiwiY3ViZWUuVkJveC5zZXRDZWxsSGVpZ2h0IiwiY3ViZWUuVkJveC5zZXRJbkxpc3QiLCJjdWJlZS5WQm94LmdldEZyb21MaXN0IiwiY3ViZWUuVkJveC5yZW1vdmVGcm9tTGlzdCIsImN1YmVlLlZCb3guZ2V0Q2VsbEhlaWdodCIsImN1YmVlLlZCb3guc2V0Q2VsbEhBbGlnbiIsImN1YmVlLlZCb3guZ2V0Q2VsbEhBbGlnbiIsImN1YmVlLlZCb3guc2V0Q2VsbFZBbGlnbiIsImN1YmVlLlZCb3guZ2V0Q2VsbFZBbGlnbiIsImN1YmVlLlZCb3guc2V0TGFzdENlbGxIQWxpZ24iLCJjdWJlZS5WQm94LnNldExhc3RDZWxsVkFsaWduIiwiY3ViZWUuVkJveC5zZXRMYXN0Q2VsbEhlaWdodCIsImN1YmVlLlZCb3guYWRkRW1wdHlDZWxsIiwiY3ViZWUuVkJveC5XaWR0aCIsImN1YmVlLlZCb3gud2lkdGgiLCJjdWJlZS5WQm94Ll9vbkNoaWxkQWRkZWQiLCJjdWJlZS5WQm94Ll9vbkNoaWxkUmVtb3ZlZCIsImN1YmVlLlZCb3guX29uQ2hpbGRyZW5DbGVhcmVkIiwiY3ViZWUuVkJveC5vbkxheW91dCIsImN1YmVlLlNjcm9sbEJveCIsImN1YmVlLlNjcm9sbEJveC5jb25zdHJ1Y3RvciIsImN1YmVlLlNjcm9sbEJveC53aWR0aFByb3BlcnR5IiwiY3ViZWUuU2Nyb2xsQm94LldpZHRoIiwiY3ViZWUuU2Nyb2xsQm94LndpZHRoIiwiY3ViZWUuU2Nyb2xsQm94LmhlaWdodFByb3BlcnR5IiwiY3ViZWUuU2Nyb2xsQm94LkhlaWdodCIsImN1YmVlLlNjcm9sbEJveC5oZWlnaHQiLCJjdWJlZS5TY3JvbGxCb3guQ29udGVudCIsImN1YmVlLlNjcm9sbEJveC5jb250ZW50IiwiY3ViZWUuU2Nyb2xsQm94LkhTY3JvbGxQb2xpY3kiLCJjdWJlZS5TY3JvbGxCb3guaFNjcm9sbFBvbGljeSIsImN1YmVlLlNjcm9sbEJveC5WU2Nyb2xsUG9saWN5IiwiY3ViZWUuU2Nyb2xsQm94LnZTY3JvbGxQb2xpY3kiLCJjdWJlZS5TY3JvbGxCb3guU2Nyb2xsV2lkdGgiLCJjdWJlZS5TY3JvbGxCb3guc2Nyb2xsV2lkdGgiLCJjdWJlZS5TY3JvbGxCb3guU2Nyb2xsSGVpZ2h0IiwiY3ViZWUuU2Nyb2xsQm94LnNjcm9sbEhlaWdodCIsImN1YmVlLlNjcm9sbEJveC5IU2Nyb2xsUG9zIiwiY3ViZWUuU2Nyb2xsQm94LmhTY3JvbGxQb3MiLCJjdWJlZS5TY3JvbGxCb3guVlNjcm9sbFBvcyIsImN1YmVlLlNjcm9sbEJveC52U2Nyb2xsUG9zIiwiY3ViZWUuU2Nyb2xsQm94Lk1heEhTY3JvbGxQb3MiLCJjdWJlZS5TY3JvbGxCb3gubWF4SFNjcm9sbFBvcyIsImN1YmVlLlNjcm9sbEJveC5NYXhWU2Nyb2xsUG9zIiwiY3ViZWUuU2Nyb2xsQm94Lm1heFZTY3JvbGxQb3MiLCJjdWJlZS5MYWJlbCIsImN1YmVlLkxhYmVsLmNvbnN0cnVjdG9yIiwiY3ViZWUuTGFiZWwuV2lkdGgiLCJjdWJlZS5MYWJlbC53aWR0aCIsImN1YmVlLkxhYmVsLkhlaWdodCIsImN1YmVlLkxhYmVsLmhlaWdodCIsImN1YmVlLkxhYmVsLlRleHQiLCJjdWJlZS5MYWJlbC50ZXh0IiwiY3ViZWUuTGFiZWwuVGV4dE92ZXJmbG93IiwiY3ViZWUuTGFiZWwudGV4dE92ZXJmbG93IiwiY3ViZWUuTGFiZWwuRm9yZUNvbG9yIiwiY3ViZWUuTGFiZWwuZm9yZUNvbG9yIiwiY3ViZWUuTGFiZWwuVmVydGljYWxBbGlnbiIsImN1YmVlLkxhYmVsLnZlcnRpY2FsQWxpZ24iLCJjdWJlZS5MYWJlbC5Cb2xkIiwiY3ViZWUuTGFiZWwuYm9sZCIsImN1YmVlLkxhYmVsLkl0YWxpYyIsImN1YmVlLkxhYmVsLml0YWxpYyIsImN1YmVlLkxhYmVsLlVuZGVybGluZSIsImN1YmVlLkxhYmVsLnVuZGVybGluZSIsImN1YmVlLkxhYmVsLlRleHRBbGlnbiIsImN1YmVlLkxhYmVsLnRleHRBbGlnbiIsImN1YmVlLkxhYmVsLkZvbnRTaXplIiwiY3ViZWUuTGFiZWwuZm9udFNpemUiLCJjdWJlZS5MYWJlbC5Gb250RmFtaWx5IiwiY3ViZWUuTGFiZWwuZm9udEZhbWlseSIsImN1YmVlLkJ1dHRvbiIsImN1YmVlLkJ1dHRvbi5jb25zdHJ1Y3RvciIsImN1YmVlLkJ1dHRvbi5XaWR0aCIsImN1YmVlLkJ1dHRvbi53aWR0aCIsImN1YmVlLkJ1dHRvbi5IZWlnaHQiLCJjdWJlZS5CdXR0b24uaGVpZ2h0IiwiY3ViZWUuQnV0dG9uLlRleHQiLCJjdWJlZS5CdXR0b24udGV4dCIsImN1YmVlLkJ1dHRvbi5UZXh0T3ZlcmZsb3ciLCJjdWJlZS5CdXR0b24udGV4dE92ZXJmbG93IiwiY3ViZWUuQnV0dG9uLkZvcmVDb2xvciIsImN1YmVlLkJ1dHRvbi5mb3JlQ29sb3IiLCJjdWJlZS5CdXR0b24uVmVydGljYWxBbGlnbiIsImN1YmVlLkJ1dHRvbi52ZXJ0aWNhbEFsaWduIiwiY3ViZWUuQnV0dG9uLkJvbGQiLCJjdWJlZS5CdXR0b24uYm9sZCIsImN1YmVlLkJ1dHRvbi5JdGFsaWMiLCJjdWJlZS5CdXR0b24uaXRhbGljIiwiY3ViZWUuQnV0dG9uLlVuZGVybGluZSIsImN1YmVlLkJ1dHRvbi51bmRlcmxpbmUiLCJjdWJlZS5CdXR0b24uVGV4dEFsaWduIiwiY3ViZWUuQnV0dG9uLnRleHRBbGlnbiIsImN1YmVlLkJ1dHRvbi5Gb250U2l6ZSIsImN1YmVlLkJ1dHRvbi5mb250U2l6ZSIsImN1YmVlLkJ1dHRvbi5Gb250RmFtaWx5IiwiY3ViZWUuQnV0dG9uLmZvbnRGYW1pbHkiLCJjdWJlZS5CdXR0b24uQmFja2dyb3VuZCIsImN1YmVlLkJ1dHRvbi5iYWNrZ3JvdW5kIiwiY3ViZWUuQnV0dG9uLlNoYWRvdyIsImN1YmVlLkJ1dHRvbi5zaGFkb3ciLCJjdWJlZS5UZXh0Qm94IiwiY3ViZWUuVGV4dEJveC5jb25zdHJ1Y3RvciIsImN1YmVlLlRleHRCb3guV2lkdGgiLCJjdWJlZS5UZXh0Qm94LndpZHRoIiwiY3ViZWUuVGV4dEJveC5IZWlnaHQiLCJjdWJlZS5UZXh0Qm94LmhlaWdodCIsImN1YmVlLlRleHRCb3guVGV4dCIsImN1YmVlLlRleHRCb3gudGV4dCIsImN1YmVlLlRleHRCb3guQmFja2dyb3VuZCIsImN1YmVlLlRleHRCb3guYmFja2dyb3VuZCIsImN1YmVlLlRleHRCb3guRm9yZUNvbG9yIiwiY3ViZWUuVGV4dEJveC5mb3JlQ29sb3IiLCJjdWJlZS5UZXh0Qm94LlRleHRBbGlnbiIsImN1YmVlLlRleHRCb3gudGV4dEFsaWduIiwiY3ViZWUuVGV4dEJveC5WZXJ0aWNhbEFsaWduIiwiY3ViZWUuVGV4dEJveC52ZXJ0aWNhbEFsaWduIiwiY3ViZWUuVGV4dEJveC5Cb2xkIiwiY3ViZWUuVGV4dEJveC5ib2xkIiwiY3ViZWUuVGV4dEJveC5JdGFsaWMiLCJjdWJlZS5UZXh0Qm94Lml0YWxpYyIsImN1YmVlLlRleHRCb3guVW5kZXJsaW5lIiwiY3ViZWUuVGV4dEJveC51bmRlcmxpbmUiLCJjdWJlZS5UZXh0Qm94LkZvbnRTaXplIiwiY3ViZWUuVGV4dEJveC5mb250U2l6ZSIsImN1YmVlLlRleHRCb3guRm9udEZhbWlseSIsImN1YmVlLlRleHRCb3guZm9udEZhbWlseSIsImN1YmVlLlRleHRCb3guUGxhY2Vob2xkZXIiLCJjdWJlZS5UZXh0Qm94LnBsYWNlaG9sZGVyIiwiY3ViZWUuUGFzc3dvcmRCb3giLCJjdWJlZS5QYXNzd29yZEJveC5jb25zdHJ1Y3RvciIsImN1YmVlLlBhc3N3b3JkQm94LldpZHRoIiwiY3ViZWUuUGFzc3dvcmRCb3gud2lkdGgiLCJjdWJlZS5QYXNzd29yZEJveC5IZWlnaHQiLCJjdWJlZS5QYXNzd29yZEJveC5oZWlnaHQiLCJjdWJlZS5QYXNzd29yZEJveC5UZXh0IiwiY3ViZWUuUGFzc3dvcmRCb3gudGV4dCIsImN1YmVlLlBhc3N3b3JkQm94LkJhY2tncm91bmQiLCJjdWJlZS5QYXNzd29yZEJveC5iYWNrZ3JvdW5kIiwiY3ViZWUuUGFzc3dvcmRCb3guRm9yZUNvbG9yIiwiY3ViZWUuUGFzc3dvcmRCb3guZm9yZUNvbG9yIiwiY3ViZWUuUGFzc3dvcmRCb3guVGV4dEFsaWduIiwiY3ViZWUuUGFzc3dvcmRCb3gudGV4dEFsaWduIiwiY3ViZWUuUGFzc3dvcmRCb3guVmVydGljYWxBbGlnbiIsImN1YmVlLlBhc3N3b3JkQm94LnZlcnRpY2FsQWxpZ24iLCJjdWJlZS5QYXNzd29yZEJveC5Cb2xkIiwiY3ViZWUuUGFzc3dvcmRCb3guYm9sZCIsImN1YmVlLlBhc3N3b3JkQm94Lkl0YWxpYyIsImN1YmVlLlBhc3N3b3JkQm94Lml0YWxpYyIsImN1YmVlLlBhc3N3b3JkQm94LlVuZGVybGluZSIsImN1YmVlLlBhc3N3b3JkQm94LnVuZGVybGluZSIsImN1YmVlLlBhc3N3b3JkQm94LkZvbnRTaXplIiwiY3ViZWUuUGFzc3dvcmRCb3guZm9udFNpemUiLCJjdWJlZS5QYXNzd29yZEJveC5Gb250RmFtaWx5IiwiY3ViZWUuUGFzc3dvcmRCb3guZm9udEZhbWlseSIsImN1YmVlLlBhc3N3b3JkQm94LlBsYWNlaG9sZGVyIiwiY3ViZWUuUGFzc3dvcmRCb3gucGxhY2Vob2xkZXIiLCJjdWJlZS5UZXh0QXJlYSIsImN1YmVlLlRleHRBcmVhLmNvbnN0cnVjdG9yIiwiY3ViZWUuVGV4dEFyZWEuV2lkdGgiLCJjdWJlZS5UZXh0QXJlYS53aWR0aCIsImN1YmVlLlRleHRBcmVhLkhlaWdodCIsImN1YmVlLlRleHRBcmVhLmhlaWdodCIsImN1YmVlLlRleHRBcmVhLlRleHQiLCJjdWJlZS5UZXh0QXJlYS50ZXh0IiwiY3ViZWUuVGV4dEFyZWEuQmFja2dyb3VuZCIsImN1YmVlLlRleHRBcmVhLmJhY2tncm91bmQiLCJjdWJlZS5UZXh0QXJlYS5Gb3JlQ29sb3IiLCJjdWJlZS5UZXh0QXJlYS5mb3JlQ29sb3IiLCJjdWJlZS5UZXh0QXJlYS5UZXh0QWxpZ24iLCJjdWJlZS5UZXh0QXJlYS50ZXh0QWxpZ24iLCJjdWJlZS5UZXh0QXJlYS5WZXJ0aWNhbEFsaWduIiwiY3ViZWUuVGV4dEFyZWEudmVydGljYWxBbGlnbiIsImN1YmVlLlRleHRBcmVhLkJvbGQiLCJjdWJlZS5UZXh0QXJlYS5ib2xkIiwiY3ViZWUuVGV4dEFyZWEuSXRhbGljIiwiY3ViZWUuVGV4dEFyZWEuaXRhbGljIiwiY3ViZWUuVGV4dEFyZWEuVW5kZXJsaW5lIiwiY3ViZWUuVGV4dEFyZWEudW5kZXJsaW5lIiwiY3ViZWUuVGV4dEFyZWEuRm9udFNpemUiLCJjdWJlZS5UZXh0QXJlYS5mb250U2l6ZSIsImN1YmVlLlRleHRBcmVhLkZvbnRGYW1pbHkiLCJjdWJlZS5UZXh0QXJlYS5mb250RmFtaWx5IiwiY3ViZWUuVGV4dEFyZWEuUGxhY2Vob2xkZXIiLCJjdWJlZS5UZXh0QXJlYS5wbGFjZWhvbGRlciIsImN1YmVlLkNoZWNrQm94IiwiY3ViZWUuQ2hlY2tCb3guY29uc3RydWN0b3IiLCJjdWJlZS5DaGVja0JveC5DaGVja2VkIiwiY3ViZWUuQ2hlY2tCb3guY2hlY2tlZCIsImN1YmVlLkNvbWJvQm94IiwiY3ViZWUuQ29tYm9Cb3guY29uc3RydWN0b3IiLCJjdWJlZS5Db21ib0JveC5XaWR0aCIsImN1YmVlLkNvbWJvQm94LndpZHRoIiwiY3ViZWUuQ29tYm9Cb3guSGVpZ2h0IiwiY3ViZWUuQ29tYm9Cb3guaGVpZ2h0IiwiY3ViZWUuQ29tYm9Cb3guVGV4dCIsImN1YmVlLkNvbWJvQm94LnRleHQiLCJjdWJlZS5Db21ib0JveC5CYWNrZ3JvdW5kIiwiY3ViZWUuQ29tYm9Cb3guYmFja2dyb3VuZCIsImN1YmVlLkNvbWJvQm94LkZvcmVDb2xvciIsImN1YmVlLkNvbWJvQm94LmZvcmVDb2xvciIsImN1YmVlLkNvbWJvQm94LlRleHRBbGlnbiIsImN1YmVlLkNvbWJvQm94LnRleHRBbGlnbiIsImN1YmVlLkNvbWJvQm94LlZlcnRpY2FsQWxpZ24iLCJjdWJlZS5Db21ib0JveC52ZXJ0aWNhbEFsaWduIiwiY3ViZWUuQ29tYm9Cb3guQm9sZCIsImN1YmVlLkNvbWJvQm94LmJvbGQiLCJjdWJlZS5Db21ib0JveC5JdGFsaWMiLCJjdWJlZS5Db21ib0JveC5pdGFsaWMiLCJjdWJlZS5Db21ib0JveC5VbmRlcmxpbmUiLCJjdWJlZS5Db21ib0JveC51bmRlcmxpbmUiLCJjdWJlZS5Db21ib0JveC5Gb250U2l6ZSIsImN1YmVlLkNvbWJvQm94LmZvbnRTaXplIiwiY3ViZWUuQ29tYm9Cb3guRm9udEZhbWlseSIsImN1YmVlLkNvbWJvQm94LmZvbnRGYW1pbHkiLCJjdWJlZS5Db21ib0JveC5QbGFjZWhvbGRlciIsImN1YmVlLkNvbWJvQm94LnBsYWNlaG9sZGVyIiwiY3ViZWUuQ29tYm9Cb3guc2VsZWN0ZWRJbmRleFByb3BlcnR5IiwiY3ViZWUuQ29tYm9Cb3guU2VsZWN0ZWRJbmRleCIsImN1YmVlLkNvbWJvQm94LnNlbGVjdGVkSW5kZXgiLCJjdWJlZS5Db21ib0JveC5zZWxlY3RlZEl0ZW1Qcm9wZXJ0eSIsImN1YmVlLkNvbWJvQm94LlNlbGVjdGVkSXRlbSIsImN1YmVlLkNvbWJvQm94LnNlbGVjdGVkSXRlbSIsImN1YmVlLlBpY3R1cmVCb3giLCJjdWJlZS5QaWN0dXJlQm94LmNvbnN0cnVjdG9yIiwiY3ViZWUuUGljdHVyZUJveC5yZWNhbGN1bGF0ZVNpemUiLCJjdWJlZS5QaWN0dXJlQm94LnBpY3R1cmVTaXplTW9kZVByb3BlcnR5IiwiY3ViZWUuUGljdHVyZUJveC5QaWN0dXJlU2l6ZU1vZGUiLCJjdWJlZS5QaWN0dXJlQm94LnBpY3R1cmVTaXplTW9kZSIsImN1YmVlLlBpY3R1cmVCb3gud2lkdGhQcm9wZXJ0eSIsImN1YmVlLlBpY3R1cmVCb3guV2lkdGgiLCJjdWJlZS5QaWN0dXJlQm94LndpZHRoIiwiY3ViZWUuUGljdHVyZUJveC5oZWlnaHRQcm9wZXJ0eSIsImN1YmVlLlBpY3R1cmVCb3guSGVpZ2h0IiwiY3ViZWUuUGljdHVyZUJveC5oZWlnaHQiLCJjdWJlZS5QaWN0dXJlQm94LnBhZGRpbmdQcm9wZXJ0eSIsImN1YmVlLlBpY3R1cmVCb3guUGFkZGluZyIsImN1YmVlLlBpY3R1cmVCb3gucGFkZGluZyIsImN1YmVlLlBpY3R1cmVCb3guYm9yZGVyUHJvcGVydHkiLCJjdWJlZS5QaWN0dXJlQm94LkJvcmRlciIsImN1YmVlLlBpY3R1cmVCb3guYm9yZGVyIiwiY3ViZWUuUGljdHVyZUJveC5iYWNrZ3JvdW5kUHJvcGVydHkiLCJjdWJlZS5QaWN0dXJlQm94LkJhY2tncm91bmQiLCJjdWJlZS5QaWN0dXJlQm94LmJhY2tncm91bmQiLCJjdWJlZS5QaWN0dXJlQm94LmltYWdlUHJvcGVydHkiLCJjdWJlZS5QaWN0dXJlQm94LkltYWdlIiwiY3ViZWUuUGljdHVyZUJveC5pbWFnZSIsImN1YmVlLkFQb3B1cCIsImN1YmVlLkFQb3B1cC5jb25zdHJ1Y3RvciIsImN1YmVlLkFQb3B1cC5fX19wb3B1cFJvb3QiLCJjdWJlZS5BUG9wdXAucm9vdENvbXBvbmVudCIsImN1YmVlLkFQb3B1cC5zaG93IiwiY3ViZWUuQVBvcHVwLmNsb3NlIiwiY3ViZWUuQVBvcHVwLmlzQ2xvc2VBbGxvd2VkIiwiY3ViZWUuQVBvcHVwLm9uQ2xvc2VkIiwiY3ViZWUuQVBvcHVwLm1vZGFsIiwiY3ViZWUuQVBvcHVwLmF1dG9DbG9zZSIsImN1YmVlLkFQb3B1cC5nbGFzc0NvbG9yIiwiY3ViZWUuQVBvcHVwLlRyYW5zbGF0ZVgiLCJjdWJlZS5BUG9wdXAudHJhbnNsYXRlWCIsImN1YmVlLkFQb3B1cC5UcmFuc2xhdGVZIiwiY3ViZWUuQVBvcHVwLnRyYW5zbGF0ZVkiLCJjdWJlZS5BUG9wdXAuQ2VudGVyIiwiY3ViZWUuQVBvcHVwLmNlbnRlciIsImN1YmVlLkFQb3B1cC5fbGF5b3V0IiwiY3ViZWUuUG9wdXBzIiwiY3ViZWUuUG9wdXBzLmNvbnN0cnVjdG9yIiwiY3ViZWUuUG9wdXBzLl9hZGRQb3B1cCIsImN1YmVlLlBvcHVwcy5fcmVtb3ZlUG9wdXAiLCJjdWJlZS5Qb3B1cHMuX3JlcXVlc3RMYXlvdXQiLCJjdWJlZS5Qb3B1cHMubGF5b3V0IiwiY3ViZWUuQ3ViZWVQYW5lbCIsImN1YmVlLkN1YmVlUGFuZWwuY29uc3RydWN0b3IiLCJjdWJlZS5DdWJlZVBhbmVsLmNoZWNrQm91bmRzIiwiY3ViZWUuQ3ViZWVQYW5lbC5yZXF1ZXN0TGF5b3V0IiwiY3ViZWUuQ3ViZWVQYW5lbC5sYXlvdXQiLCJjdWJlZS5DdWJlZVBhbmVsLnJvb3RDb21wb25lbnQiLCJjdWJlZS5DdWJlZVBhbmVsLkNsaWVudFdpZHRoIiwiY3ViZWUuQ3ViZWVQYW5lbC5jbGllbnRXaWR0aCIsImN1YmVlLkN1YmVlUGFuZWwuQ2xpZW50SGVpZ2h0IiwiY3ViZWUuQ3ViZWVQYW5lbC5jbGllbnRIZWlnaHQiLCJjdWJlZS5DdWJlZVBhbmVsLkJvdW5kc1dpZHRoIiwiY3ViZWUuQ3ViZWVQYW5lbC5ib3VuZHNXaWR0aCIsImN1YmVlLkN1YmVlUGFuZWwuQm91bmRzSGVpZ2h0IiwiY3ViZWUuQ3ViZWVQYW5lbC5ib3VuZHNIZWlnaHQiLCJjdWJlZS5DdWJlZVBhbmVsLkJvdW5kc0xlZnQiLCJjdWJlZS5DdWJlZVBhbmVsLmJvdW5kc0xlZnQiLCJjdWJlZS5DdWJlZVBhbmVsLkJvdW5kc1RvcCIsImN1YmVlLkN1YmVlUGFuZWwuYm91bmRzVG9wIiwiY3ViZWUuRUljb24iLCJjdWJlZS5FSWNvbi5jb25zdHJ1Y3RvciIsImN1YmVlLkVJY29uLkFESlVTVCIsImN1YmVlLkVJY29uLkFOQ0hPUiIsImN1YmVlLkVJY29uLkFSQ0hJVkUiLCJjdWJlZS5FSWNvbi5BUlJPV1MiLCJjdWJlZS5FSWNvbi5BUlJPV1NfSCIsImN1YmVlLkVJY29uLkFSUk9XU19WIiwiY3ViZWUuRUljb24uQVNURVJJU0siLCJjdWJlZS5FSWNvbi5CQU4iLCJjdWJlZS5FSWNvbi5CQVJfQ0hBUlRfTyIsImN1YmVlLkVJY29uLkJBUkNPREUiLCJjdWJlZS5FSWNvbi5CQVJTIiwiY3ViZWUuRUljb24uQkVFUiIsImN1YmVlLkVJY29uLkJFTEwiLCJjdWJlZS5FSWNvbi5CRUxMX08iLCJjdWJlZS5FSWNvbi5CT0xUIiwiY3ViZWUuRUljb24uQk9PSyIsImN1YmVlLkVJY29uLkJPT0tNQVJLIiwiY3ViZWUuRUljb24uQk9PS01BUktfTyIsImN1YmVlLkVJY29uLkJSSUVGQ0FTRSIsImN1YmVlLkVJY29uLkJVRyIsImN1YmVlLkVJY29uLmNsYXNzTmFtZSIsImN1YmVlLkZBSWNvbiIsImN1YmVlLkZBSWNvbi5jb25zdHJ1Y3RvciIsImN1YmVlLkZBSWNvbi5pbml0RkEiLCJjdWJlZS5GQUljb24ucmVmcmVzaFN0eWxlIiwiY3ViZWUuRkFJY29uLmNvbG9yUHJvcGVydHkiLCJjdWJlZS5GQUljb24uQ29sb3IiLCJjdWJlZS5GQUljb24uY29sb3IiLCJjdWJlZS5GQUljb24uc2l6ZVByb3BlcnR5IiwiY3ViZWUuRkFJY29uLlNpemUiLCJjdWJlZS5GQUljb24uc2l6ZSIsImN1YmVlLkZBSWNvbi5zcGluUHJvcGVydHkiLCJjdWJlZS5GQUljb24uU3BpbiIsImN1YmVlLkZBSWNvbi5zcGluIiwiY3ViZWUuRkFJY29uLmljb25Qcm9wZXJ0eSIsImN1YmVlLkZBSWNvbi5JY29uIiwiY3ViZWUuRkFJY29uLmljb24iXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsSUFBTyxLQUFLLENBeU5YO0FBek5ELFdBQU8sS0FBSyxFQUFDLENBQUM7SUFFVkE7UUFDSUMsbUJBQW1CQSxNQUFjQTtZQUFkQyxXQUFNQSxHQUFOQSxNQUFNQSxDQUFRQTtRQUFJQSxDQUFDQTtRQUMxQ0QsZ0JBQUNBO0lBQURBLENBQUNBLEFBRkRELElBRUNBO0lBRllBLGVBQVNBLFlBRXJCQSxDQUFBQTtJQU9EQTtRQUVJRyxtQ0FB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QUFDQTtnQkFDL0JBLElBQUlBLEVBQUVBLEdBQWdCQSxLQUFLQSxDQUFDQTtnQkFDNUJBLEVBQUVBLENBQUNBLENBQUNBLE9BQU9BLElBQUlBLElBQUlBLENBQUNBLFVBQVVBLEdBQUdBLEVBQUVBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO29CQUN2Q0EsUUFBUUEsR0FBR0EsS0FBS0EsQ0FBQ0E7Z0JBQ3JCQSxDQUFDQTtnQkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7b0JBQ0pBLFNBQVNBLEdBQUdBLEtBQUtBLENBQUNBO29CQUNsQkEsS0FBS0EsQ0FBQ0E7Z0JBQ1ZBLENBQUNBO2dCQUVEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxFQUFFQSxDQUFDQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxZQUFZQSxJQUFJQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxFQUFFQSxDQUFDQSxJQUFJQSxJQUFJQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDeEZBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLHVCQUF1QkEsSUFBSUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3JDQSxFQUFFQSxDQUFDQSx1QkFBdUJBLEVBQUVBLENBQUNBO29CQUNqQ0EsQ0FBQ0E7Z0JBQ0xBLENBQUNBO1lBQ0xBLENBQUNBO1lBRURBLEVBQUVBLENBQUNBLENBQUNBLFFBQVFBLElBQUlBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO2dCQUNuQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsU0FBU0EsSUFBSUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3BCQSxJQUFJQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxHQUFHQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDM0ZB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VUFBVUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBLENBQUNBO1lBRXhEQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxJQUFJQSxXQUFLQSxDQUFhQSxJQUFJQSwrQkFBeUJBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLEVBQUVBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO1lBQzdGQSxJQUFJQSxDQUFDQSxZQUFZQSxHQUFHQSxJQUFJQSxXQUFLQSxDQUFhQSxJQUFJQSwrQkFBeUJBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLEVBQUVBLFdBQVdBLENBQUNBLENBQUNBLENBQUNBO1lBQ3JHQSxJQUFJQSxDQUFFQSxZQUFZQSxHQUFHQSxJQUFJQSxXQUFLQSxDQUFhQSxJQUFJQSwrQkFBeUJBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLEVBQUVBLFdBQVdBLENBQUNBLENBQUNBLENBQUNBO1lBQ3RHQSxJQUFJQSxDQUFFQSxVQUFVQSxHQUFHQSxJQUFJQSxXQUFLQSxDQUFhQSxJQUFJQSwrQkFBeUJBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLEVBQUVBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2xHQSxJQUFJQSxDQUFFQSxhQUFhQSxHQUFHQSxJQUFJQSxXQUFLQSxDQUFhQSxJQUFJQSwrQkFBeUJBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLEVBQUVBLFlBQVlBLENBQUNBLENBQUNBLENBQUNBO1lBQ3hHQSxJQUFJQSxDQUFFQSxhQUFhQSxHQUFHQSxJQUFJQSxXQUFLQSxDQUFhQSxJQUFJQSwrQkFBeUJBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLEVBQUVBLFlBQVlBLENBQUNBLENBQUNBLENBQUNBO1lBQ3hHQSxJQUFJQSxDQUFFQSxhQUFhQSxHQUFHQSxJQUFJQSxXQUFLQSxDQUFhQSxJQUFJQSwrQkFBeUJBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLEVBQUVBLFlBQVlBLENBQUNBLENBQUNBLENBQUNBO1lBQ3hHQSxJQUFJQSxDQUFFQSxVQUFVQSxHQUFHQSxJQUFJQSxXQUFLQSxDQUFnQkEsSUFBSUEsK0JBQXlCQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxFQUFFQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNyR0EsSUFBSUEsQ0FBRUEsV0FBV0EsR0FBR0EsSUFBSUEsV0FBS0EsQ0FBZ0JBLElBQUlBLCtCQUF5QkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsRUFBRUEsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDdkdBLElBQUlBLENBQUVBLFFBQVFBLEdBQUdBLElBQUlBLFdBQUtBLENBQWdCQSxJQUFJQSwrQkFBeUJBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLEVBQUVBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO1lBQ2pHQSxJQUFJQSxDQUFFQSxjQUFjQSxHQUFHQSxJQUFJQSxXQUFLQSxDQUFTQSxJQUFJQSwrQkFBeUJBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLEVBQUVBLGFBQWFBLENBQUNBLENBQUNBLENBQUNBO1lBRXRHQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxXQUFXQSxDQUFDQTtnQkFDM0JBLEtBQUlBLENBQUNBLGNBQWNBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBO1lBQ3JDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNIQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxXQUFXQSxDQUFDQTtnQkFDM0JBLEtBQUlBLENBQUNBLGNBQWNBLENBQUNBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBO1lBQ3RDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNIQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxXQUFXQSxDQUFDQTtnQkFDMUJBLEtBQUlBLENBQUNBLGNBQWNBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBO1lBQ3JDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNIQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxXQUFXQSxDQUFDQTtnQkFDeEJBLEtBQUlBLENBQUNBLGNBQWNBLENBQUNBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBO1lBQ3RDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNQQSxDQUFDQTtRQUVPRCx3Q0FBbUJBLEdBQTNCQTtZQUNJRSxJQUFJQSxDQUFDQSxxQkFBcUJBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBO1FBQ3JDQSxDQUFDQTtRQUVTRixrQ0FBYUEsR0FBdkJBO1FBRUFHLENBQUNBO1FBRU1ILGtDQUFhQSxHQUFwQkEsVUFBcUJBLFVBQXNCQTtZQUN2Q0ksSUFBSUEsQ0FBQ0EsV0FBV0EsR0FBR0EsVUFBVUEsQ0FBQ0E7UUFDbENBLENBQUNBO1FBRURKLGtDQUFhQSxHQUFiQTtZQUNJSyxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxJQUFJQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDM0JBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBO1lBQzVCQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxJQUFJQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDN0JBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLGFBQWFBLEVBQUVBLENBQUNBO1lBQ3ZDQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDSkEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7WUFDaEJBLENBQUNBO1FBQ0xBLENBQUNBO1FBRU9MLG9DQUFlQSxHQUF2QkE7WUFDSU0sSUFBSUEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0E7WUFDL0JBLEtBQUtBLEdBQUdBLEtBQUtBLEdBQUdBLENBQUNBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO1lBQzVCQSxLQUFLQSxHQUFHQSxLQUFLQSxHQUFHQSxHQUFHQSxDQUFDQTtZQUNwQkEsSUFBSUEsUUFBUUEsR0FBR0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0E7WUFFN0JBLElBQUlBLE9BQU9BLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsS0FBS0EsR0FBR0EsR0FBR0EsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0E7WUFDekRBLElBQUlBLE9BQU9BLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsS0FBS0EsR0FBR0EsR0FBR0EsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0E7WUFFekRBLElBQUlBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBLFFBQVFBLEVBQUVBLENBQUNBO1lBQ3ZDQSxJQUFJQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQTtZQUV2Q0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsZUFBZUEsR0FBR0EsT0FBT0EsR0FBR0EsR0FBR0EsR0FBR0EsT0FBT0EsQ0FBQ0E7WUFDOURBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLEtBQUtBLENBQUNBLFNBQVNBLEdBQUdBLFlBQVlBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEtBQUtBLEdBQUdBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEtBQUtBO2tCQUNyR0EsYUFBYUEsR0FBR0EsUUFBUUEsR0FBR0EsWUFBWUEsR0FBR0EsRUFBRUEsR0FBR0EsV0FBV0EsR0FBR0EsRUFBRUEsR0FBR0EsR0FBR0EsQ0FBQ0E7WUFDeEVBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLEtBQUtBLENBQUNBLGtCQUFrQkEsR0FBR0EsUUFBUUEsQ0FBQ0E7UUFDdERBLENBQUNBO1FBRUROLGtDQUFhQSxHQUFiQTtZQUNJTyxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDckJBLElBQUlBLENBQUNBLFlBQVlBLEdBQUdBLElBQUlBLENBQUNBO2dCQUN6QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsSUFBSUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3ZCQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxhQUFhQSxFQUFFQSxDQUFDQTtnQkFDakNBLENBQUNBO2dCQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxJQUFJQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDbENBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLGFBQWFBLEVBQUVBLENBQUNBO2dCQUNyQ0EsQ0FBQ0E7Z0JBQUNBLElBQUlBLENBQUNBLENBQUNBO29CQUNKQSxZQUFNQSxDQUFDQSxjQUFjQSxFQUFFQSxDQUFDQTtnQkFDNUJBLENBQUNBO1lBQ0xBLENBQUNBO1FBQ0xBLENBQUNBO1FBRURQLDRCQUFPQSxHQUFQQTtZQUNJUSxJQUFJQSxDQUFDQSxTQUFTQSxFQUFFQSxDQUFDQTtRQUNyQkEsQ0FBQ0E7UUFFT1IsOEJBQVNBLEdBQWpCQTtZQUVJUyxJQUFJQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxXQUFXQSxDQUFDQTtZQUNuQ0EsSUFBSUEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsWUFBWUEsQ0FBQ0E7WUFDcENBLElBQUlBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLEtBQUtBLENBQUNBO1lBQzVCQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDWkEsRUFBRUEsR0FBR0EsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0E7Z0JBQzNCQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQTtZQUMvQkEsQ0FBQ0E7WUFDREEsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxLQUFLQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUNuQ0EsSUFBSUEsQ0FBQ0EsbUJBQW1CQSxDQUFDQSxLQUFLQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUdwQ0EsSUFBSUEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7WUFDbkNBLElBQUlBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLFlBQVlBLENBQUNBO1lBQ3BDQSxJQUFJQSxDQUFDQSxvQkFBb0JBLENBQUNBLEtBQUtBLEdBQUdBLEVBQUVBLENBQUNBO1lBQ3JDQSxJQUFJQSxDQUFDQSxxQkFBcUJBLENBQUNBLEtBQUtBLEdBQUdBLEVBQUVBLENBQUNBO1lBR3RDQSxJQUFJQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxpQkFBaUJBLENBQUNBLEtBQUtBLENBQUNBO1lBQ3ZDQSxJQUFJQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxpQkFBaUJBLENBQUNBLEtBQUtBLENBQUNBO1lBRXZDQSxJQUFJQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNYQSxJQUFJQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNYQSxJQUFJQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUNaQSxJQUFJQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUVaQSxJQUFJQSxFQUFFQSxHQUFHQSxJQUFJQSxhQUFPQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMzQkEsSUFBSUEsRUFBRUEsR0FBR0EsSUFBSUEsYUFBT0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDNUJBLElBQUlBLEVBQUVBLEdBQUdBLElBQUlBLGFBQU9BLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO1lBQzdCQSxJQUFJQSxFQUFFQSxHQUFHQSxJQUFJQSxhQUFPQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQTtZQUU1QkEsSUFBSUEsRUFBRUEsR0FBR0EsQ0FBQ0EsRUFBRUEsR0FBR0EsR0FBR0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDeEJBLElBQUlBLEVBQUVBLEdBQUdBLENBQUNBLEVBQUVBLEdBQUdBLEdBQUdBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBRXhCQSxJQUFJQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUM3QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2JBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO2dCQUN6Q0EsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzFDQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDM0NBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO1lBQzlDQSxDQUFDQTtZQUVEQSxJQUFJQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUM1QkEsSUFBSUEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0E7WUFFNUJBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLElBQUlBLEdBQUdBLElBQUlBLEVBQUVBLElBQUlBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO2dCQUN6QkEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ2pEQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQTtnQkFDakRBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO2dCQUNqREEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7WUFDckRBLENBQUNBO1lBRURBLElBQUlBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2hFQSxJQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNoRUEsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDaEVBLElBQUlBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2hFQSxFQUFFQSxHQUFHQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQTtZQUNqQkEsRUFBRUEsR0FBR0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0E7WUFDakJBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBO1lBQ1ZBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBO1lBRVZBLElBQUlBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsS0FBS0EsR0FBR0EsRUFBRUEsQ0FBQ0E7WUFDbENBLElBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsS0FBS0EsR0FBR0EsRUFBRUEsQ0FBQ0E7WUFDakNBLElBQUlBLENBQUNBLGtCQUFrQkEsQ0FBQ0EsS0FBS0EsR0FBR0EsRUFBRUEsQ0FBQ0E7WUFDbkNBLElBQUlBLENBQUNBLG1CQUFtQkEsQ0FBQ0EsS0FB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QSxFQUFFQSxDQUFTQSxFQUFFQSxNQUFvQkE7WUFDMUZLLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLElBQUlBLENBQUNBLFdBQVdBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBLENBQUNBO2dCQUN0RUEsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQzFCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxJQUFJQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtvQkFDbERBLElBQUlBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUMzQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsU0FBU0EsSUFBSUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3BCQSxRQUFRQSxDQUFDQTtvQkFDYkEsQ0FBQ0E7b0JBQ0RBLElBQUlBLEVBQUVBLEdBQUdBLENBQUNBLEdBQUdBLFNBQVNBLENBQUNBLElBQUlBLEdBQUdBLFNBQVNBLENBQUNBLFVBQVVBLENBQUNBO29CQUNuREEsSUFBSUEsRUFBRUEsR0FBR0EsQ0FBQ0EsR0FBR0EsU0FBU0EsQ0FBQ0EsR0FBR0EsR0FBR0EsU0FBU0EsQ0FBQ0EsVUFBVUEsQ0FBQ0E7b0JBQ2xEQSxFQUFFQSxDQUFDQSxDQUFDQSxTQUFTQSxZQUFZQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDL0JBLElBQUlBLENBQUNBLDRCQUE0QkEsQ0FBVUEsU0FBU0EsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0E7b0JBQzFF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Q0EsQ0FBQ0E7b0JBQ0pBLEtBQUlBLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBLEtBQUtBLEdBQUdBLEtBQUlBLENBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBO2dCQUN0REEsQ0FBQ0E7WUFDTEEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDSEEsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0E7WUFDN0JBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLGlCQUFpQkEsQ0FBQ0E7Z0JBQzlCQSxLQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxDQUFDQSxLQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtZQUN2Q0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDSEEsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0E7WUFDN0JBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLGlCQUFpQkEsQ0FBQ0E7Z0JBQ2xDQSxJQUFJQSxFQUFFQSxHQUFHQSxLQUFJQSxDQUFDQSxhQUFhQSxDQUFDQTtnQkFDNUJBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLElBQUlBLGFBQU9BLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO29CQUNwQkEsS0FBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsYUFBYUEsR0FBR0EsS0FBS0EsQ0FBQ0E7Z0JBQzdDQSxDQUFDQTtnQkFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsYUFBT0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzlCQSxLQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQSxhQUFhQSxHQUFHQSxRQUFRQSxDQUFDQTtnQkFDaERBLENBQUNBO2dCQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxJQUFJQSxhQUFPQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDOUJBLEtBQUlB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QUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtZQUN6REEsZUFBVUEsR0FBR0EsSUFBSUEsY0FBUUEsQ0FBYUEsZ0JBQVVBLENBQUNBLElBQUlBLEVBQUVBLEtBQUtBLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO1lBQ3JFQSxtQkFBY0EsR0FBR0EsSUFBSUEsY0FBUUEsQ0FBVUEsYUFBT0EsQ0FBQ0EsR0FBR0EsRUFBRUEsS0FBS0EsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0E7WUFDbEVBLFVBQUtBLEdBQUdBLElBQUlBLHFCQUFlQSxDQUFDQSxLQUFLQSxFQUFFQSxLQUFLQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtZQUNqREEsWUFBT0EsR0FBR0EsSUFBSUEscUJBQWVBLENBQUNBLEtBQUtBLEVBQUVBLEtBQUtBLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO1lBQ25EQSxlQUFVQSxHQUFHQSxJQUFJQSxxQkFBZUEsQ0FBQ0EsS0FBS0EsRUFBRUEsS0FBS0EsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0E7WUFDdERBLGNBQVNBLEdBQUdBLElBQUlBLG9CQUFjQSxDQUFDQSxFQUFFQSxFQUFFQSxLQUFLQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtZQUNqREEsZ0JBQVdBLEdBQUdBLElBQUlBLGNBQVFBLENBQWFBLGdCQUFVQSxDQUFDQSxLQUFLQSxFQUFFQSxLQUFLQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtZQUN2RUEsaUJBQVlBLEdBQUdBLElBQUlBLG9CQUFjQSxDQUFDQSxJQUFJQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUlsREEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsTUFBTUEsRUFBRUEsVUFBVUEsQ0FBQ0EsQ0FBQ0E7WUFFOUNBLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLFlBQU1BLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLEVBQUVBLFdBQUtBLENBQUNBLFVBQVVBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO1lBQ3BEQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFD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Q0EsQUF0SERodEIsRUFBNEJBLGtCQUFZQSxFQXNIdkNBO0lBdEhZQSxZQUFNQSxTQXNIbEJBLENBQUFBO0FBRUxBLENBQUNBLEVBMUhNLEtBQUssS0FBTCxLQUFLLFFBMEhYIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlIGN1YmVlIHtcblxuICAgIGV4cG9ydCBjbGFzcyBFdmVudEFyZ3Mge1xuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc2VuZGVyOiBPYmplY3QpIHsgfVxuICAgIH1cbiAgICBcbiAgICBleHBvcnQgaW50ZXJmYWNlIElMaXN0ZW5lckNhbGxiYWNrPFQ+IHtcbiAgICAgICAgb25BZGRlZChsaXN0ZW5lcjogSUV2ZW50TGlzdGVuZXI8VD4pOiB2b2lkO1xuICAgICAgICBvblJlbW92ZWQobGlzdGVuZXI6IElFdmVudExpc3RlbmVyPFQ+KTogdm9pZDtcbiAgICB9XG4gICAgXG4gICAgZXhwb3J0IGNsYXNzIEh0bWxFdmVudExpc3RlbmVyQ2FsbGJhY2s8VD4gaW1wbGVtZW50cyBJTGlzdGVuZXJDYWxsYmFjazxUPiB7XG4gICAgICAgIFxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9lbGVtZW50OiBIVE1MRWxlbWVudCwgcHJpdmF0ZSBfZXZlbnRUeXBlOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBvbkFkZGVkKGxpc3RlbmVyOiBJRXZlbnRMaXN0ZW5lcjxUPik6IHZvaWQge1xuICAgICAgICAgICAgKDxhbnk+bGlzdGVuZXIpLiQkbmF0aXZlTGlzdGVuZXIgPSBmdW5jdGlvbiAoZXZlbnRBcmdzOiBUKSB7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXIoZXZlbnRBcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLl9ldmVudFR5cGUsICg8YW55Pmxpc3RlbmVyKS4kJG5hdGl2ZUxpc3RlbmVyKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgb25SZW1vdmVkKGxpc3RlbmVyOiBJRXZlbnRMaXN0ZW5lcjxUPik6IHZvaWQge1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMuX2V2ZW50VHlwZSwgKDxhbnk+bGlzdGVuZXIpLiQkbmF0aXZlTGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBFdmVudDxUPiB7XG5cbiAgICAgICAgcHJpdmF0ZSBfbGlzdGVuZXJzOiBJRXZlbnRMaXN0ZW5lcjxUPltdID0gW107XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBfbGlzdGVuZXJDYWxsYmFjazogSUxpc3RlbmVyQ2FsbGJhY2s8VD4gPSBudWxsKSB7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRMaXN0ZW5lcihsaXN0ZW5lcjogSUV2ZW50TGlzdGVuZXI8VD4pIHtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgbGlzdGVuZXIgcGFyYW1ldGVyIGNhbiBub3QgYmUgbnVsbC5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzTGlzdGVuZXIobGlzdGVuZXIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICh0aGlzLl9saXN0ZW5lckNhbGxiYWNrICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9saXN0ZW5lckNhbGxiYWNrLm9uQWRkZWQobGlzdGVuZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlTGlzdGVuZXIobGlzdGVuZXI6IElFdmVudExpc3RlbmVyPFQ+KSB7XG4gICAgICAgICAgICB2YXIgaWR4ID0gdGhpcy5fbGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpO1xuICAgICAgICAgICAgaWYgKGlkeCA8IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnMuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICh0aGlzLl9saXN0ZW5lckNhbGxiYWNrICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9saXN0ZW5lckNhbGxiYWNrLm9uUmVtb3ZlZChsaXN0ZW5lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBoYXNMaXN0ZW5lcihsaXN0ZW5lcjogSUV2ZW50TGlzdGVuZXI8VD4pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9saXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcikgPiAtMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpcmVFdmVudChhcmdzOiBUKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBsIGluIHRoaXMuX2xpc3RlbmVycykge1xuICAgICAgICAgICAgICAgIGxldCBsaXN0ZW5lcjogSUV2ZW50TGlzdGVuZXI8VD4gPSBsO1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyKGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBnZXQgbGlzdGVuZXJDYWxsYmFjaygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9saXN0ZW5lckNhbGxiYWNrO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBzZXQgbGlzdGVuZXJDYWxsYmFjayh2YWx1ZTogSUxpc3RlbmVyQ2FsbGJhY2s8VD4pIHtcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVyQ2FsbGJhY2sgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFRpbWVyIHtcblxuICAgICAgICBwcml2YXRlIHRva2VuOiBudW1iZXI7XG4gICAgICAgIHByaXZhdGUgcmVwZWF0OiBib29sZWFuID0gdHJ1ZTtcbiAgICAgICAgcHJpdmF0ZSBhY3Rpb246IHsgKCk6IHZvaWQgfSA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZnVuYygpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLnJlcGVhdCkge1xuICAgICAgICAgICAgICAgIHRoaXMudG9rZW4gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZnVuYzogeyAoKTogdm9pZCB9KSB7XG4gICAgICAgICAgICBpZiAoZnVuYyA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgZnVuYyBwYXJhbWV0ZXIgY2FuIG5vdCBiZSBudWxsLlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3RhcnQoZGVsYXk6IG51bWJlciwgcmVwZWF0OiBib29sZWFuKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgICAgIHRoaXMucmVwZWF0ID0gcmVwZWF0O1xuICAgICAgICAgICAgaWYgKHRoaXMucmVwZWF0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b2tlbiA9IHNldEludGVydmFsKHRoaXMuZnVuYywgZGVsYXkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRva2VuID0gc2V0VGltZW91dCh0aGlzLmZ1bmMsIGRlbGF5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN0b3AoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy50b2tlbiAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRva2VuKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRva2VuID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBTdGFydGVkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9rZW4gIT0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBJRXZlbnRMaXN0ZW5lcjxUPiB7XG4gICAgICAgIChhcmdzOiBUKTogdm9pZDtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRXZlbnRRdWV1ZSB7XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IEV2ZW50UXVldWUgPSBudWxsO1xuXG4gICAgICAgIHN0YXRpYyBnZXQgSW5zdGFuY2UoKSB7XG4gICAgICAgICAgICBpZiAoRXZlbnRRdWV1ZS5pbnN0YW5jZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgRXZlbnRRdWV1ZS5pbnN0YW5jZSA9IG5ldyBFdmVudFF1ZXVlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBFdmVudFF1ZXVlLmluc3RhbmNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBxdWV1ZTogeyAoKTogdm9pZCB9W10gPSBbXTtcbiAgICAgICAgcHJpdmF0ZSB0aW1lcjogVGltZXIgPSBudWxsO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgdGhpcy50aW1lciA9IG5ldyBUaW1lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHNpemUgPSB0aGlzLnF1ZXVlLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGFzazogeyAoKTogdm9pZCB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFzayA9IHRoaXMucXVldWVbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXVlLnNwbGljZSgwLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YXNrICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXNrKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2l6ZSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZXJlIHdlcmUgc29tZSB0YXNrIHRoYW4gd2UgbmVlZCB0byBjaGVjayBmYXN0IGlmIG1vcmUgdGFza3MgYXJlIHJlY2VpdmVkXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbWVyLnN0YXJ0KDAsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZXJlIGlzbid0IGFueSB0YXNrIHRoYW4gd2UgY2FuIHJlbGF4IGEgYml0XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbWVyLnN0YXJ0KDUwLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnRpbWVyLnN0YXJ0KDEwLCBmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpbnZva2VMYXRlcih0YXNrOiB7ICgpOiB2b2lkIH0pIHtcbiAgICAgICAgICAgIGlmICh0YXNrID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoZSB0YXNrIGNhbiBub3QgYmUgbnVsbC5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucXVldWUucHVzaCh0YXNrKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGludm9rZVByaW9yKHRhc2s6IHsgKCk6IHZvaWQgfSkge1xuICAgICAgICAgICAgaWYgKHRhc2sgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIHRhc2sgY2FuIG5vdCBiZSBudWxsLlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5xdWV1ZS5zcGxpY2UoMCwgMCwgdGFzayk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBSdW5PbmNlIHtcblxuICAgICAgICBwcml2YXRlIHNjaGVkdWxlZCA9IGZhbHNlO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZnVuYzogSVJ1bm5hYmxlKSB7XG4gICAgICAgICAgICBpZiAoZnVuYyA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgZnVuYyBwYXJhbWV0ZXIgY2FuIG5vdCBiZSBudWxsLlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcnVuKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2NoZWR1bGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZWQgPSB0cnVlO1xuICAgICAgICAgICAgRXZlbnRRdWV1ZS5JbnN0YW5jZS5pbnZva2VMYXRlcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLmZ1bmMoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFBhcmVudENoYW5nZWRFdmVudEFyZ3MgZXh0ZW5kcyBFdmVudEFyZ3Mge1xuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmV3UGFyZW50OiBBTGF5b3V0LFxuICAgICAgICAgICAgcHVibGljIHNlbmRlcjogT2JqZWN0KSB7XG4gICAgICAgICAgICBzdXBlcihzZW5kZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG59XG5cblxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cImV2ZW50cy50c1wiLz5cblxubW9kdWxlIGN1YmVlIHtcblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSUNoYW5nZUxpc3RlbmVyIHtcbiAgICAgICAgKHNlbmRlcj86IE9iamVjdCk6IHZvaWQ7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBJT2JzZXJ2YWJsZSB7XG4gICAgICAgIGFkZENoYW5nZUxpc3RlbmVyKGxpc3RlbmVyOiBJQ2hhbmdlTGlzdGVuZXIpOiB2b2lkO1xuICAgICAgICByZW1vdmVDaGFuZ2VMaXN0ZW5lcihsaXN0ZW5lcjogSUNoYW5nZUxpc3RlbmVyKTogdm9pZDtcbiAgICAgICAgaGFzQ2hhbmdlTGlzdGVuZXIobGlzdGVuZXI6IElDaGFuZ2VMaXN0ZW5lcik6IHZvaWQ7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBJQmluZGFibGU8VD4ge1xuICAgICAgICBiaW5kKHNvdXJjZTogVCk6IHZvaWQ7XG4gICAgICAgIHVuYmluZCgpOiB2b2lkO1xuICAgICAgICBpc0JvdW5kKCk6IGJvb2xlYW47XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBJQW5pbWF0ZWFibGU8VD4ge1xuICAgICAgICBhbmltYXRlKHBvczogbnVtYmVyLCBzdGFydFZhbHVlOiBULCBlbmRWYWx1ZTogVCk6IFQ7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBJUHJvcGVydHk8VD4gZXh0ZW5kcyBJT2JzZXJ2YWJsZSB7XG4gICAgICAgIGdldE9iamVjdFZhbHVlKCk6IE9iamVjdDtcbiAgICAgICAgaW52YWxpZGF0ZSgpOiB2b2lkO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVZhbGlkYXRvcjxUPiB7XG4gICAgICAgIHZhbGlkYXRlKHZhbHVlOiBUKTogVDtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgUHJvcGVydHk8VD4gaW1wbGVtZW50cyBJUHJvcGVydHk8VD4sIElBbmltYXRlYWJsZTxUPiwgSUJpbmRhYmxlPElQcm9wZXJ0eTxUPj4ge1xuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9uZXh0SWQgPSAwO1xuXG4gICAgICAgIHByaXZhdGUgX2NoYW5nZUxpc3RlbmVyczogSUNoYW5nZUxpc3RlbmVyW10gPSBbXTtcblxuICAgICAgICBwcml2YXRlIF92YWxpZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBwcml2YXRlIF9iaW5kaW5nU291cmNlOiBJUHJvcGVydHk8VD47XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVhZG9ubHlCaW5kOiBJUHJvcGVydHk8VD47XG4gICAgICAgIHByaXZhdGUgX2JpZGlyZWN0aW9uYWxCaW5kUHJvcGVydHk6IFByb3BlcnR5PFQ+O1xuICAgICAgICBwcml2YXRlIF9iaWRpcmVjdGlvbmFsQ2hhbmdlTGlzdGVuZXJUaGlzOiBJQ2hhbmdlTGlzdGVuZXI7XG4gICAgICAgIHByaXZhdGUgX2JpZGlyZWN0aW9uYWxDaGFuZ2VMaXN0ZW5lck90aGVyOiBJQ2hhbmdlTGlzdGVuZXI7XG4gICAgICAgIHByaXZhdGUgX2lkOiBzdHJpbmcgPSBcInBcIiArIFByb3BlcnR5Ll9uZXh0SWQrKztcbiAgICAgICAgcHJpdmF0ZSBiaW5kTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZUlmTmVlZGVkKCk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgICAgIHByaXZhdGUgX3ZhbHVlPzogVCxcbiAgICAgICAgICAgIHByaXZhdGUgX251bGxhYmxlOiBib29sZWFuID0gdHJ1ZSxcbiAgICAgICAgICAgIHByaXZhdGUgX3JlYWRvbmx5OiBib29sZWFuID0gZmFsc2UsXG4gICAgICAgICAgICBwcml2YXRlIF92YWxpZGF0b3I6IElWYWxpZGF0b3I8VD4gPSBudWxsKSB7XG5cbiAgICAgICAgICAgIGlmIChfdmFsdWUgPT0gbnVsbCAmJiBfbnVsbGFibGUgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIkEgbnVsbGFibGUgcHJvcGVydHkgY2FuIG5vdCBiZSBudWxsLlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fdmFsdWUgIT0gbnVsbCAmJiBfdmFsaWRhdG9yICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZSA9IF92YWxpZGF0b3IudmFsaWRhdGUoX3ZhbHVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgaWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faWQ7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgdmFsaWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmFsaWQ7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgdmFsdWUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldCB2YWx1ZShuZXdWYWx1ZTogVCkge1xuICAgICAgICAgICAgdGhpcy5zZXQobmV3VmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IG51bGxhYmxlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX251bGxhYmxlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHJlYWRvbmx5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlYWRvbmx5O1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdFJlYWRvbmx5QmluZChyZWFkb25seUJpbmQ6IElQcm9wZXJ0eTxUPikge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3JlYWRvbmx5QmluZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgcmVhZG9ubHkgYmluZCBpcyBhbHJlYWR5IGluaXRpYWxpemVkLlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fcmVhZG9ubHlCaW5kID0gcmVhZG9ubHlCaW5kO1xuICAgICAgICAgICAgaWYgKHJlYWRvbmx5QmluZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmVhZG9ubHlCaW5kLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuYmluZExpc3RlbmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBnZXQoKTogVCB7XG4gICAgICAgICAgICB0aGlzLl92YWxpZCA9IHRydWU7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9iaW5kaW5nU291cmNlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdmFsaWRhdG9yICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbGlkYXRvci52YWxpZGF0ZSg8VD50aGlzLl9iaW5kaW5nU291cmNlLmdldE9iamVjdFZhbHVlKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gPFQ+dGhpcy5fYmluZGluZ1NvdXJjZS5nZXRPYmplY3RWYWx1ZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fcmVhZG9ubHlCaW5kICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdmFsaWRhdG9yICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbGlkYXRvci52YWxpZGF0ZSg8VD50aGlzLl9yZWFkb25seUJpbmQuZ2V0T2JqZWN0VmFsdWUoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiA8VD50aGlzLl9yZWFkb25seUJpbmQuZ2V0T2JqZWN0VmFsdWUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzZXQobmV3VmFsdWU6IFQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9yZWFkb25seSkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiQ2FuIG5vdCBjaGFuZ2UgdGhlIHZhbHVlIG9mIGEgcmVhZG9ubHkgcHJvcGVydHkuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzQm91bmQoKSkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiQ2FuIG5vdCBjaGFuZ2UgdGhlIHZhbHVlIG9mIGEgYm91bmQgcHJvcGVydHkuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5fbnVsbGFibGUgJiYgbmV3VmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiQ2FuIG5vdCBzZXQgdGhlIHZhbHVlIHRvIG51bGwgb2YgYSBub24gbnVsbGFibGUgcHJvcGVydHkuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl92YWxpZGF0b3IgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy5fdmFsaWRhdG9yLnZhbGlkYXRlKG5ld1ZhbHVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX3ZhbHVlID09IG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fdmFsdWUgIT0gbnVsbCAmJiB0aGlzLl92YWx1ZSA9PSBuZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbnZhbGlkYXRlKCkge1xuICAgICAgICAgICAgdGhpcy5fdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuZmlyZUNoYW5nZUxpc3RlbmVycygpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW52YWxpZGF0ZUlmTmVlZGVkKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl92YWxpZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZmlyZUNoYW5nZUxpc3RlbmVycygpIHtcbiAgICAgICAgICAgIHRoaXMuX2NoYW5nZUxpc3RlbmVycy5mb3JFYWNoKChsaXN0ZW5lcikgPT4ge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyKHRoaXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRPYmplY3RWYWx1ZSgpOiBPYmplY3Qge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRDaGFuZ2VMaXN0ZW5lcihsaXN0ZW5lcjogSUNoYW5nZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICBpZiAobGlzdGVuZXIgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIGxpc3RlbmVyIHBhcmFtZXRlciBjYW4gbm90IGJlIG51bGwuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmhhc0NoYW5nZUxpc3RlbmVyKGxpc3RlbmVyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fY2hhbmdlTGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuXG4gICAgICAgICAgICAvLyB2YWxpZGF0ZSB0aGUgY29tcG9uZW50XG4gICAgICAgICAgICB0aGlzLmdldCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIobGlzdGVuZXI6IElDaGFuZ2VMaXN0ZW5lcikge1xuICAgICAgICAgICAgdmFyIGlkeCA9IHRoaXMuX2NoYW5nZUxpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKTtcbiAgICAgICAgICAgIGlmIChpZHggPCAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fY2hhbmdlTGlzdGVuZXJzLnNwbGljZShpZHgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaGFzQ2hhbmdlTGlzdGVuZXIobGlzdGVuZXI6IElDaGFuZ2VMaXN0ZW5lcik6IGJvb2xlYW4ge1xuICAgICAgICAgICAgdGhpcy5fY2hhbmdlTGlzdGVuZXJzLmZvckVhY2goKGwpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobCA9PSBsaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFuaW1hdGUocG9zOiBudW1iZXIsIHN0YXJ0VmFsdWU6IFQsIGVuZFZhbHVlOiBUKSB7XG4gICAgICAgICAgICBpZiAocG9zIDwgMC41KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXJ0VmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBlbmRWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJpbmQoc291cmNlOiBJUHJvcGVydHk8VD4pIHtcbiAgICAgICAgICAgIGlmIChzb3VyY2UgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIHNvdXJjZSBjYW4gbm90IGJlIG51bGwuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzQm91bmQoKSkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhpcyBwcm9wZXJ0eSBpcyBhbHJlYWR5IGJvdW5kLlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fcmVhZG9ubHkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIkNhbid0IGJpbmQgYSByZWFkb25seSBwcm9wZXJ0eS5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fYmluZGluZ1NvdXJjZSA9IHNvdXJjZTtcbiAgICAgICAgICAgIHRoaXMuX2JpbmRpbmdTb3VyY2UuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5iaW5kTGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBiaWRpcmVjdGlvbmFsQmluZChvdGhlcjogUHJvcGVydHk8VD4pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzQm91bmQoKSkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhpcyBwcm9wZXJ0eSBpcyBhbHJlYWR5IGJvdW5kLlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fcmVhZG9ubHkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIkNhbid0IGJpbmQgYSByZWFkb25seSBwcm9wZXJ0eS5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG90aGVyID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoZSBvdGhlciBwYXJhbWV0ZXIgY2FuIG5vdCBiZSBudWxsLlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3RoZXIuX3JlYWRvbmx5KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJDYW4gbm90IGJpbmQgYSBwcm9wZXJ0eSBiaWRpcmVjdGlvbmFsbHkgdG8gYSByZWFkb25seSBwcm9wZXJ0eS5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG90aGVyID09IHRoaXMpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIkNhbiBub3QgYmluZCBhIHByb3BlcnR5IGJpZGlyZWN0aW9uYWxseSBmb3IgdGhlbXNlbGYuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvdGhlci5pc0JvdW5kKCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoZSB0YXJnZXQgcHJvcGVydHkgaXMgYWxyZWFkeSBib3VuZC5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fYmlkaXJlY3Rpb25hbEJpbmRQcm9wZXJ0eSA9IG90aGVyO1xuICAgICAgICAgICAgdGhpcy5fYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyT3RoZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXQodGhpcy5fYmlkaXJlY3Rpb25hbEJpbmRQcm9wZXJ0eS5nZXQoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvdGhlci5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9iaWRpcmVjdGlvbmFsQ2hhbmdlTGlzdGVuZXJPdGhlcik7XG4gICAgICAgICAgICB0aGlzLl9iaWRpcmVjdGlvbmFsQ2hhbmdlTGlzdGVuZXJUaGlzID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX2JpZGlyZWN0aW9uYWxCaW5kUHJvcGVydHkuc2V0KHRoaXMuZ2V0KCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9iaWRpcmVjdGlvbmFsQ2hhbmdlTGlzdGVuZXJUaGlzKTtcblxuICAgICAgICAgICAgb3RoZXIuX2JpZGlyZWN0aW9uYWxCaW5kUHJvcGVydHkgPSB0aGlzO1xuICAgICAgICAgICAgb3RoZXIuX2JpZGlyZWN0aW9uYWxDaGFuZ2VMaXN0ZW5lck90aGVyID0gdGhpcy5fYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyVGhpcztcbiAgICAgICAgICAgIG90aGVyLl9iaWRpcmVjdGlvbmFsQ2hhbmdlTGlzdGVuZXJUaGlzID0gdGhpcy5fYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyT3RoZXI7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHVuYmluZCgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9iaW5kaW5nU291cmNlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9iaW5kaW5nU291cmNlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuYmluZExpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9iaW5kaW5nU291cmNlID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0JpZGlyZWN0aW9uYWxCb3VuZCgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9iaWRpcmVjdGlvbmFsQ2hhbmdlTGlzdGVuZXJUaGlzKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9iaWRpcmVjdGlvbmFsQmluZFByb3BlcnR5LnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX2JpZGlyZWN0aW9uYWxDaGFuZ2VMaXN0ZW5lck90aGVyKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9iaWRpcmVjdGlvbmFsQmluZFByb3BlcnR5Ll9iaWRpcmVjdGlvbmFsQmluZFByb3BlcnR5ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLl9iaWRpcmVjdGlvbmFsQmluZFByb3BlcnR5Ll9iaWRpcmVjdGlvbmFsQ2hhbmdlTGlzdGVuZXJPdGhlciA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmlkaXJlY3Rpb25hbEJpbmRQcm9wZXJ0eS5fYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyVGhpcyA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmlkaXJlY3Rpb25hbEJpbmRQcm9wZXJ0eSA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyT3RoZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuX2JpZGlyZWN0aW9uYWxDaGFuZ2VMaXN0ZW5lclRoaXMgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdW5iaW5kVGFyZ2V0cygpIHtcbiAgICAgICAgICAgIC8vIFRPRE8gbnVsbCBiaW5kaW5nU291cmNlIG9mIHRhcmdldHNcbiAgICAgICAgICAgIHRoaXMuX2NoYW5nZUxpc3RlbmVycyA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgaXNCb3VuZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9iaW5kaW5nU291cmNlICE9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpc0JpZGlyZWN0aW9uYWxCb3VuZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9iaWRpcmVjdGlvbmFsQmluZFByb3BlcnR5ICE9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBjcmVhdGVQcm9wZXJ0eUxpbmUoa2V5RnJhbWVzOiBLZXlGcmFtZTxUPltdKTogUHJvcGVydHlMaW5lPFQ+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvcGVydHlMaW5lPFQ+KGtleUZyYW1lcyk7XG4gICAgICAgIH1cblxuICAgICAgICBkZXN0cm95KCkge1xuICAgICAgICAgICAgdGhpcy51bmJpbmQoKTtcbiAgICAgICAgICAgIHRoaXMuX2NoYW5nZUxpc3RlbmVycyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5iaW5kTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRXhwcmVzc2lvbjxUPiBpbXBsZW1lbnRzIElQcm9wZXJ0eTxUPiwgSU9ic2VydmFibGUge1xuXG4gICAgICAgIHByaXZhdGUgX25vdGlmeUxpc3RlbmVyc09uY2UgPSBuZXcgUnVuT25jZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZpcmVDaGFuZ2VMaXN0ZW5lcnMoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcHJpdmF0ZSBfYmluZGluZ1NvdXJjZXM6IElQcm9wZXJ0eTxhbnk+W10gPSBbXTtcbiAgICAgICAgcHJpdmF0ZSBfYmluZGluZ0xpc3RlbmVyOiBJQ2hhbmdlTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmludmFsaWRhdGVJZk5lZWRlZCgpO1xuICAgICAgICB9O1xuICAgICAgICBwcml2YXRlIF9jaGFuZ2VMaXN0ZW5lcnM6IElDaGFuZ2VMaXN0ZW5lcltdID0gW107XG5cbiAgICAgICAgcHJpdmF0ZSBfZnVuYzogeyAoKTogVCB9O1xuICAgICAgICBwcml2YXRlIF92YWxpZCA9IGZhbHNlO1xuICAgICAgICBwcml2YXRlIF92YWx1ZTogVCA9IG51bGw7XG5cbiAgICAgICAgY29uc3RydWN0b3IoZnVuYzogeyAoKTogVCB9LCAuLi5hY3RpdmF0b3JzOiBJUHJvcGVydHk8YW55PltdKSB7XG4gICAgICAgICAgICBpZiAoZnVuYyA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgJ2Z1bmMnIHBhcmFtZXRlciBjYW4gbm90IGJlIG51bGxcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2Z1bmMgPSBmdW5jO1xuICAgICAgICAgICAgdGhpcy5iaW5kLmFwcGx5KHRoaXMsIGFjdGl2YXRvcnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHZhbHVlKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl92YWxpZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gdGhpcy5fZnVuYygpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3ZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkQ2hhbmdlTGlzdGVuZXIobGlzdGVuZXI6IElDaGFuZ2VMaXN0ZW5lcikge1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVyID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoZSBsaXN0ZW5lciBwYXJhbWV0ZXIgY2FuIG5vdCBiZSBudWxsLlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNDaGFuZ2VMaXN0ZW5lcihsaXN0ZW5lcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2NoYW5nZUxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcblxuICAgICAgICAgICAgbGV0IHggPSB0aGlzLnZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIobGlzdGVuZXI6IElDaGFuZ2VMaXN0ZW5lcikge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5fY2hhbmdlTGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpO1xuICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jaGFuZ2VMaXN0ZW5lcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX2NoYW5nZUxpc3RlbmVycy5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmluZGluZ1NvdXJjZXMuZm9yRWFjaCgocHJvcCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBwcm9wLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX2JpbmRpbmdMaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaGFzQ2hhbmdlTGlzdGVuZXIobGlzdGVuZXI6IElDaGFuZ2VMaXN0ZW5lcikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoYW5nZUxpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKSA+IC0xO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0T2JqZWN0VmFsdWUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJpbmQoLi4ucHJvcGVydGllczogSVByb3BlcnR5PGFueT5bXSkge1xuICAgICAgICAgICAgcHJvcGVydGllcy5mb3JFYWNoKChwcm9wKSA9PiB7XG4gICAgICAgICAgICAgICAgcHJvcC5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9iaW5kaW5nTGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2JpbmRpbmdTb3VyY2VzLnB1c2gocHJvcCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB1bmJpbmRBbGwoKSB7XG4gICAgICAgICAgICB0aGlzLl9iaW5kaW5nU291cmNlcy5mb3JFYWNoKChwcm9wKSA9PiB7XG4gICAgICAgICAgICAgICAgcHJvcC5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9iaW5kaW5nTGlzdGVuZXIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9iaW5kaW5nU291cmNlcyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB1bmJpbmQocHJvcGVydHk6IElQcm9wZXJ0eTxhbnk+KSB7XG4gICAgICAgICAgICBwcm9wZXJ0eS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9iaW5kaW5nTGlzdGVuZXIpO1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5fYmluZGluZ1NvdXJjZXMuaW5kZXhPZihwcm9wZXJ0eSk7XG4gICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2JpbmRpbmdTb3VyY2VzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmludmFsaWRhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGludmFsaWRhdGUoKSB7XG4gICAgICAgICAgICB0aGlzLl92YWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5fbm90aWZ5TGlzdGVuZXJzT25jZS5ydW4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGludmFsaWRhdGVJZk5lZWRlZCgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fdmFsaWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmludmFsaWRhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgZmlyZUNoYW5nZUxpc3RlbmVycygpIHtcbiAgICAgICAgICAgIHRoaXMuX2NoYW5nZUxpc3RlbmVycy5mb3JFYWNoKChsaXN0ZW5lcjogSUNoYW5nZUxpc3RlbmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXIodGhpcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEtleUZyYW1lPFQ+IHtcblxuICAgICAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgICAgIHByaXZhdGUgX3RpbWU6IG51bWJlcixcbiAgICAgICAgICAgIHByaXZhdGUgX3Byb3BlcnR5OiBQcm9wZXJ0eTxUPixcbiAgICAgICAgICAgIHByaXZhdGUgX2VuZFZhbHVlOiBULFxuICAgICAgICAgICAgcHJpdmF0ZSBfa2V5ZnJhbWVSZWFjaGVkTGlzdGVuZXI6IHsgKCk6IHZvaWQgfSA9IG51bGwsXG4gICAgICAgICAgICBwcml2YXRlIF9pbnRlcnBvbGF0b3I6IElJbnRlcnBvbGF0b3IgPSBJbnRlcnBvbGF0b3JzLkxpbmVhcikge1xuXG4gICAgICAgICAgICBpZiAoX3RpbWUgPCAwKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgdGltZSBwYXJhbWV0ZXIgY2FuIG5vdCBiZSBzbWFsbGVyIHRoYW4gemVyby5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKF9wcm9wZXJ0eSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgcHJvcGVydHkgcGFyYW1ldGVyIGNhbiBub3QgYmUgbnVsbC5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChfcHJvcGVydHkucmVhZG9ubHkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIkNhbid0IGFuaW1hdGUgYSByZWFkLW9ubHkgcHJvcGVydHkuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfZW5kVmFsdWUgPT0gbnVsbCAmJiAhX3Byb3BlcnR5Lm51bGxhYmxlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJDYW4ndCBzZXQgbnVsbCB2YWx1ZSB0byBhIG5vbiBudWxsYWJsZSBwcm9wZXJ0eS5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKF9pbnRlcnBvbGF0b3IgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2ludGVycG9sYXRvciA9IEludGVycG9sYXRvcnMuTGluZWFyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHRpbWUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGltZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBwcm9wZXJ0eSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wcm9wZXJ0eVxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGVuZFZhbHVlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2VuZFZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGludGVycG9sYXRvcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbnRlcnBvbGF0b3I7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQga2V5RnJhbWVSZWFjaGVkTGlzdGVuZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fa2V5ZnJhbWVSZWFjaGVkTGlzdGVuZXI7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBQcm9wZXJ0eUxpbmU8VD4ge1xuXG4gICAgICAgIHByaXZhdGUgX3Byb3BlcnR5OiBQcm9wZXJ0eTxUPjtcbiAgICAgICAgcHJpdmF0ZSBfc3RhcnRUaW1lOiBudW1iZXIgPSAtMTtcbiAgICAgICAgcHJpdmF0ZSBfbGFzdFJ1blRpbWU6IG51bWJlciA9IC0xO1xuICAgICAgICBwcml2YXRlIF9wcmV2aW91c0ZyYW1lOiBLZXlGcmFtZTxUPiA9IG51bGw7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBfa2V5RnJhbWVzOiBLZXlGcmFtZTxUPltdKSB7XG4gICAgICAgICAgICB0aGlzLl9wcm9wZXJ0eSA9IF9rZXlGcmFtZXNbMF0ucHJvcGVydHk7XG4gICAgICAgICAgICB2YXIgZmlyc3RGcmFtZTogS2V5RnJhbWU8VD4gPSBfa2V5RnJhbWVzWzBdO1xuICAgICAgICAgICAgaWYgKGZpcnN0RnJhbWUudGltZSA+IDApIHtcbiAgICAgICAgICAgICAgICBfa2V5RnJhbWVzLnNwbGljZSgwLCAwLCBuZXcgS2V5RnJhbWUoMCwgZmlyc3RGcmFtZS5wcm9wZXJ0eSwgZmlyc3RGcmFtZS5wcm9wZXJ0eS52YWx1ZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHN0YXJ0VGltZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdGFydFRpbWU7XG4gICAgICAgIH1cblxuICAgICAgICBzZXQgc3RhcnRUaW1lKHN0YXJ0VGltZTogbnVtYmVyKSB7XG4gICAgICAgICAgICB0aGlzLl9zdGFydFRpbWUgPSBzdGFydFRpbWU7XG4gICAgICAgIH1cblxuICAgICAgICBhbmltYXRlKCkge1xuICAgICAgICAgICAgdmFyIGFjdFRpbWUgPSBEYXRlLm5vdygpO1xuXG4gICAgICAgICAgICBpZiAoYWN0VGltZSA9PSB0aGlzLl9zdGFydFRpbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBuZXh0RnJhbWU6IEtleUZyYW1lPFQ+ID0gbnVsbDtcbiAgICAgICAgICAgIHZhciBhY3RGcmFtZTogS2V5RnJhbWU8VD4gPSBudWxsO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9rZXlGcmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgZnJhbWUgPSB0aGlzLl9rZXlGcmFtZXNbaV07XG4gICAgICAgICAgICAgICAgdmFyIGZyOiBLZXlGcmFtZTxUPiA9IGZyYW1lO1xuICAgICAgICAgICAgICAgIGlmIChhY3RUaW1lID49IHRoaXMuX3N0YXJ0VGltZSArIGZyLnRpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgYWN0RnJhbWUgPSBmcmFtZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuZXh0RnJhbWUgPSBmcmFtZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3N0YXJ0VGltZSArIGZyLnRpbWUgPiB0aGlzLl9sYXN0UnVuVGltZSAmJiB0aGlzLl9zdGFydFRpbWUgKyBmci50aW1lIDw9IGFjdFRpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZyLmtleUZyYW1lUmVhY2hlZExpc3RlbmVyICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyLmtleUZyYW1lUmVhY2hlZExpc3RlbmVyKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhY3RGcmFtZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5leHRGcmFtZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwb3MgPSAoKGFjdFRpbWUgLSB0aGlzLl9zdGFydFRpbWUgLSBhY3RGcmFtZS50aW1lKSkgLyAobmV4dEZyYW1lLnRpbWUgLSBhY3RGcmFtZS50aW1lKTtcbiAgICAgICAgICAgICAgICAgICAgYWN0RnJhbWUucHJvcGVydHkudmFsdWUgPSBhY3RGcmFtZS5wcm9wZXJ0eS5hbmltYXRlKHBvcywgYWN0RnJhbWUuZW5kVmFsdWUsIG5leHRGcmFtZS5lbmRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYWN0RnJhbWUucHJvcGVydHkudmFsdWUgPSBhY3RGcmFtZS5lbmRWYWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2xhc3RSdW5UaW1lID0gYWN0VGltZTtcblxuICAgICAgICAgICAgcmV0dXJuIGFjdFRpbWUgPj0gdGhpcy5fc3RhcnRUaW1lICsgdGhpcy5fa2V5RnJhbWVzW3RoaXMuX2tleUZyYW1lcy5sZW5ndGggLSAxXS50aW1lO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSUludGVycG9sYXRvciB7XG4gICAgICAgICh2YWx1ZTogbnVtYmVyKTogbnVtYmVyO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBJbnRlcnBvbGF0b3JzIHtcbiAgICAgICAgc3RhdGljIGdldCBMaW5lYXIoKTogSUludGVycG9sYXRvciB7XG4gICAgICAgICAgICByZXR1cm4gKHZhbHVlOiBudW1iZXIpOiBudW1iZXIgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBQW5pbWF0b3Ige1xuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGFuaW1hdG9yczogQUFuaW1hdG9yW10gPSBbXTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgQU5JTUFUT1JfVEFTSyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIEFBbmltYXRvci5hbmltYXRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcHJpdmF0ZSBzdGFydGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICAgICAgc3RhdGljIGFuaW1hdGUoKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gQUFuaW1hdG9yLmFuaW1hdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIGlmIChBQW5pbWF0b3IuYW5pbWF0b3JzLmxlbmd0aCA8PSBpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgYW5pbWF0b3I6IEFBbmltYXRvciA9IEFBbmltYXRvci5hbmltYXRvcnNbaV07XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0b3Iub25BbmltYXRlKCk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAodCkge1xuICAgICAgICAgICAgICAgICAgICBuZXcgQ29uc29sZSgpLmVycm9yKHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKEFBbmltYXRvci5hbmltYXRvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIEV2ZW50UXVldWUuSW5zdGFuY2UuaW52b2tlTGF0ZXIoQUFuaW1hdG9yLkFOSU1BVE9SX1RBU0spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3RhcnQoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGFydGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBBQW5pbWF0b3IuYW5pbWF0b3JzLnB1c2godGhpcyk7XG4gICAgICAgICAgICBpZiAoQUFuaW1hdG9yLmFuaW1hdG9ycy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgICAgIEV2ZW50UXVldWUuSW5zdGFuY2UuaW52b2tlTGF0ZXIoQUFuaW1hdG9yLkFOSU1BVE9SX1RBU0spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0b3AoKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuc3RhcnRlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG5cbiAgICAgICAgICAgIHZhciBpZHggPSBBQW5pbWF0b3IuYW5pbWF0b3JzLmluZGV4T2YodGhpcyk7XG4gICAgICAgICAgICBBQW5pbWF0b3IuYW5pbWF0b3JzLnNwbGljZShpZHgsIDEpXG4gICAgICAgIH1cblxuICAgICAgICBnZXQgU3RhcnRlZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0YXJ0ZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgU3RvcHBlZCgpIHtcbiAgICAgICAgICAgIHJldHVybiAhdGhpcy5zdGFydGVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIGFic3RyYWN0IG9uQW5pbWF0ZSgpOiB2b2lkO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBUaW1lbGluZSBleHRlbmRzIEFBbmltYXRvciB7XG5cblxuICAgICAgICBwcml2YXRlIHByb3BlcnR5TGluZXM6IFByb3BlcnR5TGluZTxhbnk+W10gPSBbXTtcbiAgICAgICAgcHJpdmF0ZSByZXBlYXRDb3VudCA9IDA7XG4gICAgICAgIHByaXZhdGUgZmluaXNoZWRFdmVudDogRXZlbnQ8VGltZWxpbmVGaW5pc2hlZEV2ZW50QXJncz4gPSBuZXcgRXZlbnQ8VGltZWxpbmVGaW5pc2hlZEV2ZW50QXJncz4oKTtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGtleUZyYW1lczogS2V5RnJhbWU8YW55PltdKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgY3JlYXRlUHJvcGVydHlMaW5lcygpIHtcbiAgICAgICAgICAgIHZhciBwbE1hcDogeyBba2V5OiBzdHJpbmddOiBLZXlGcmFtZTxhbnk+W10gfSA9IHt9O1xuICAgICAgICAgICAgdmFyIGtleXM6IHN0cmluZ1tdID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMua2V5RnJhbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGtleUZyYW1lID0gdGhpcy5rZXlGcmFtZXNbaV07XG4gICAgICAgICAgICAgICAgbGV0IGtmOiBLZXlGcmFtZTxhbnk+ID0ga2V5RnJhbWU7XG4gICAgICAgICAgICAgICAgbGV0IHByb3BlcnR5TGluZSA9IHBsTWFwW2tmLnByb3BlcnR5LmlkXTtcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHlMaW5lID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlMaW5lID0gW107XG4gICAgICAgICAgICAgICAgICAgIHBsTWFwW2tmLnByb3BlcnR5LmlkXSA9IHByb3BlcnR5TGluZTtcbiAgICAgICAgICAgICAgICAgICAga2V5cy5wdXNoKGtmLnByb3BlcnR5LmlkKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHlMaW5lLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5TGluZVtwcm9wZXJ0eUxpbmUubGVuZ3RoIC0gMV0udGltZSA+PSBrZi50aW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBcIlRoZSBrZXlmcmFtZXMgbXVzdCBiZSBpbiBhc2NlbmRpbmcgdGltZSBvcmRlciBwZXIgcHJvcGVydHkuXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcHJvcGVydHlMaW5lLnB1c2goa2V5RnJhbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAga2V5cy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcHJvcGVydHlMaW5lOiBQcm9wZXJ0eUxpbmU8YW55PiA9IHBsTWFwW2tleV1bMF0ucHJvcGVydHkuY3JlYXRlUHJvcGVydHlMaW5lKHBsTWFwW2tleV0pO1xuICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydHlMaW5lcy5wdXNoKHByb3BlcnR5TGluZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXJ0KHJlcGVhdENvdW50OiBudW1iZXIgPSAwKSB7XG4gICAgICAgICAgICBpZiAocmVwZWF0Q291bnQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJlcGVhdENvdW50ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcGVhdENvdW50ID0gcmVwZWF0Q291bnQgfCAwO1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVQcm9wZXJ0eUxpbmVzKCk7XG4gICAgICAgICAgICB0aGlzLnJlcGVhdENvdW50ID0gcmVwZWF0Q291bnQ7XG4gICAgICAgICAgICB2YXIgc3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIHRoaXMucHJvcGVydHlMaW5lcy5mb3JFYWNoKChwcm9wZXJ0eUxpbmUpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcGw6IFByb3BlcnR5TGluZTxhbnk+ID0gcHJvcGVydHlMaW5lO1xuICAgICAgICAgICAgICAgIHBsLnN0YXJ0VGltZSA9IHN0YXJ0VGltZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc3VwZXIuc3RhcnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0b3AoKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuU3RhcnRlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN1cGVyLnN0b3AoKTtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoZWRFdmVudC5maXJlRXZlbnQobmV3IFRpbWVsaW5lRmluaXNoZWRFdmVudEFyZ3ModHJ1ZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgb25BbmltYXRlKCkge1xuICAgICAgICAgICAgdmFyIGZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMucHJvcGVydHlMaW5lcy5mb3JFYWNoKChwcm9wZXJ0eUxpbmUpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcGw6IFByb3BlcnR5TGluZTxhbnk+ID0gcHJvcGVydHlMaW5lO1xuICAgICAgICAgICAgICAgIGZpbmlzaGVkID0gZmluaXNoZWQgJiYgcGwuYW5pbWF0ZSgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChmaW5pc2hlZCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlcGVhdENvdW50IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgc3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eUxpbmVzLmZvckVhY2goKHByb3BlcnR5TGluZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBsOiBQcm9wZXJ0eUxpbmU8YW55PiA9IHByb3BlcnR5TGluZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsLnN0YXJ0VGltZSA9IHN0YXJ0VGltZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXBlYXRDb3VudC0tO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5yZXBlYXRDb3VudCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydHlMaW5lcy5mb3JFYWNoKChwcm9wZXJ0eUxpbmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGw6IFByb3BlcnR5TGluZTxhbnk+ID0gcHJvcGVydHlMaW5lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsLnN0YXJ0VGltZSA9IHN0YXJ0VGltZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VwZXIuc3RvcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5pc2hlZEV2ZW50LmZpcmVFdmVudChuZXcgVGltZWxpbmVGaW5pc2hlZEV2ZW50QXJncyhmYWxzZSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgb25GaW5pc2hlZEV2ZW50KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoZWRFdmVudDtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFRpbWVsaW5lRmluaXNoZWRFdmVudEFyZ3Mge1xuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHN0b3BwZWQ6IGJvb2xlYW4gPSBmYWxzZSkge1xuXG4gICAgICAgIH1cblxuICAgICAgICBnZXQgU3RvcHBlZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0b3BwZWQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgTnVtYmVyUHJvcGVydHkgZXh0ZW5kcyBQcm9wZXJ0eTxudW1iZXI+IHtcblxuICAgICAgICBhbmltYXRlKHBvczogbnVtYmVyLCBzdGFydFZhbHVlOiBudW1iZXIsIGVuZFZhbHVlOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICAgICAgcmV0dXJuIHN0YXJ0VmFsdWUgKyAoKGVuZFZhbHVlIC0gc3RhcnRWYWx1ZSkgKiBwb3MpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgU3RyaW5nUHJvcGVydHkgZXh0ZW5kcyBQcm9wZXJ0eTxzdHJpbmc+IHtcblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBQYWRkaW5nUHJvcGVydHkgZXh0ZW5kcyBQcm9wZXJ0eTxQYWRkaW5nPiB7XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQm9yZGVyUHJvcGVydHkgZXh0ZW5kcyBQcm9wZXJ0eTxCb3JkZXI+IHtcblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBCYWNrZ3JvdW5kUHJvcGVydHkgZXh0ZW5kcyBQcm9wZXJ0eTxBQmFja2dyb3VuZD4ge1xuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEJvb2xlYW5Qcm9wZXJ0eSBleHRlbmRzIFByb3BlcnR5PGJvb2xlYW4+IHtcblxuICAgIH1cbiAgICBcbiAgICBleHBvcnQgY2xhc3MgQ29sb3JQcm9wZXJ0eSBleHRlbmRzIFByb3BlcnR5PENvbG9yPiB7XG5cbiAgICB9XG5cbn1cblxuXG4iLCJcblxubW9kdWxlIGN1YmVlIHtcblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVN0eWxlIHtcblxuICAgICAgICBhcHBseShlbGVtZW50OiBIVE1MRWxlbWVudCk6IHZvaWQ7XG5cbiAgICB9XG5cbiAgICBleHBvcnQgYWJzdHJhY3QgY2xhc3MgQUJhY2tncm91bmQgaW1wbGVtZW50cyBJU3R5bGUge1xuXG4gICAgICAgIGFic3RyYWN0IGFwcGx5KGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogdm9pZDtcblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBDb2xvciB7XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1RSQU5TUEFSRU5UID0gQ29sb3IuZ2V0QXJnYkNvbG9yKDB4MDAwMDAwMDApO1xuICAgICAgICBzdGF0aWMgZ2V0IFRSQU5TUEFSRU5UKCkge1xuICAgICAgICAgICAgcmV0dXJuIENvbG9yLl9UUkFOU1BBUkVOVDtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9XSElURSA9IENvbG9yLmdldEFyZ2JDb2xvcigweGZmZmZmZmZmKTtcbiAgICAgICAgc3RhdGljIGdldCBXSElURSgpIHtcbiAgICAgICAgICAgIHJldHVybiBDb2xvci5fV0hJVEU7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQkxBQ0sgPSBDb2xvci5nZXRBcmdiQ29sb3IoMHhmZjAwMDAwMCk7XG4gICAgICAgIHN0YXRpYyBnZXQgQkxBQ0soKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29sb3IuX0JMQUNLO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0xJR0hUX0dSQVkgPSBDb2xvci5nZXRBcmdiQ29sb3IoMHhmZmNjY2NjYyk7XG4gICAgICAgIHN0YXRpYyBnZXQgTElHSFRfR1JBWSgpIHtcbiAgICAgICAgICAgIHJldHVybiBDb2xvci5fTElHSFRfR1JBWTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZ2V0QXJnYkNvbG9yKGFyZ2I6IG51bWJlcik6IENvbG9yIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29sb3IoYXJnYik7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGdldEFyZ2JDb2xvckJ5Q29tcG9uZW50cyhhbHBoYTogbnVtYmVyLCByZWQ6IG51bWJlciwgZ3JlZW46IG51bWJlciwgYmx1ZTogbnVtYmVyKSB7XG4gICAgICAgICAgICBhbHBoYSA9IHRoaXMuZml4Q29tcG9uZW50KGFscGhhKTtcbiAgICAgICAgICAgIHJlZCA9IHRoaXMuZml4Q29tcG9uZW50KHJlZCk7XG4gICAgICAgICAgICBncmVlbiA9IHRoaXMuZml4Q29tcG9uZW50KGdyZWVuKTtcbiAgICAgICAgICAgIGJsdWUgPSB0aGlzLmZpeENvbXBvbmVudChibHVlKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QXJnYkNvbG9yKFxuICAgICAgICAgICAgICAgIGFscGhhIDw8IDI0XG4gICAgICAgICAgICAgICAgfCByZWQgPDwgMTZcbiAgICAgICAgICAgICAgICB8IGdyZWVuIDw8IDhcbiAgICAgICAgICAgICAgICB8IGJsdWVcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGdldFJnYkNvbG9yKHJnYjogbnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRBcmdiQ29sb3IocmdiIHwgMHhmZjAwMDAwMCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGdldFJnYkNvbG9yQnlDb21wb25lbnRzKHJlZDogbnVtYmVyLCBncmVlbjogbnVtYmVyLCBibHVlOiBudW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEFyZ2JDb2xvckJ5Q29tcG9uZW50cygyNTUsIHJlZCwgZ3JlZW4sIGJsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgZml4Q29tcG9uZW50KGNvbXBvbmVudDogbnVtYmVyKSB7XG4gICAgICAgICAgICBjb21wb25lbnQgPSBjb21wb25lbnQgfCAwO1xuICAgICAgICAgICAgaWYgKGNvbXBvbmVudCA8IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNvbXBvbmVudCA+IDI1NSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAyNTU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGZhZGVDb2xvcnMoc3RhcnRDb2xvcjogQ29sb3IsIGVuZENvbG9yOiBDb2xvciwgZmFkZVBvc2l0aW9uOiBudW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBDb2xvci5nZXRBcmdiQ29sb3JCeUNvbXBvbmVudHMoXG4gICAgICAgICAgICAgICAgdGhpcy5taXhDb21wb25lbnQoc3RhcnRDb2xvci5hbHBoYSwgZW5kQ29sb3IuYWxwaGEsIGZhZGVQb3NpdGlvbiksXG4gICAgICAgICAgICAgICAgdGhpcy5taXhDb21wb25lbnQoc3RhcnRDb2xvci5yZWQsIGVuZENvbG9yLnJlZCwgZmFkZVBvc2l0aW9uKSxcbiAgICAgICAgICAgICAgICB0aGlzLm1peENvbXBvbmVudChzdGFydENvbG9yLmdyZWVuLCBlbmRDb2xvci5ncmVlbiwgZmFkZVBvc2l0aW9uKSxcbiAgICAgICAgICAgICAgICB0aGlzLm1peENvbXBvbmVudChzdGFydENvbG9yLmJsdWUsIGVuZENvbG9yLmJsdWUsIGZhZGVQb3NpdGlvbilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBtaXhDb21wb25lbnQoc3RhcnRWYWx1ZTogbnVtYmVyLCBlbmRWYWx1ZTogbnVtYmVyLCBwb3M6IG51bWJlcikge1xuICAgICAgICAgICAgdmFyIHJlcyA9IChzdGFydFZhbHVlICsgKChlbmRWYWx1ZSAtIHN0YXJ0VmFsdWUpICogcG9zKSkgfCAwO1xuICAgICAgICAgICAgcmVzID0gdGhpcy5maXhDb21wb25lbnQocmVzKTtcbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9hcmdiID0gMDtcblxuICAgICAgICBjb25zdHJ1Y3RvcihhcmdiOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGFyZ2IgPSBhcmdiIHwgMDtcbiAgICAgICAgICAgIHRoaXMuX2FyZ2IgPSBhcmdiO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGFyZ2IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYXJnYjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBhbHBoYSgpIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5fYXJnYiA+Pj4gMjQpICYgMHhmZjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCByZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuX2FyZ2IgPj4+IDE2KSAmIDB4ZmY7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgZ3JlZW4oKSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuX2FyZ2IgPj4+IDgpICYgMHhmZjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBibHVlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FyZ2IgJiAweGZmO1xuICAgICAgICB9XG5cbiAgICAgICAgZmFkZShmYWRlQ29sb3I6IENvbG9yLCBmYWRlUG9zaXRpb246IG51bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIENvbG9yLmZhZGVDb2xvcnModGhpcywgZmFkZUNvbG9yLCBmYWRlUG9zaXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgdG9DU1MoKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJyZ2JhKFwiICsgdGhpcy5yZWQgKyBcIiwgXCIgKyB0aGlzLmdyZWVuICsgXCIsIFwiICsgdGhpcy5ibHVlICsgXCIsIFwiICsgKHRoaXMuYWxwaGEgLyAyNTUuMCkgKyBcIilcIjtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIENvbG9yQmFja2dyb3VuZCBleHRlbmRzIEFCYWNrZ3JvdW5kIHtcblxuICAgICAgICBwcml2YXRlIF9jb2xvcjogQ29sb3IgPSBudWxsO1xuICAgICAgICBwcml2YXRlIF9jYWNoZTogc3RyaW5nID0gbnVsbDtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihjb2xvcjogQ29sb3IpIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgICAgICB0aGlzLl9jb2xvciA9IGNvbG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGNvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgYXBwbHkoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jYWNoZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLl9jYWNoZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2NvbG9yID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImJhY2tncm91bmRDb2xvclwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYWNoZSA9IHRoaXMuX2NvbG9yLnRvQ1NTKCk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5fY2FjaGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgUGFkZGluZyBpbXBsZW1lbnRzIElTdHlsZSB7XG5cbiAgICAgICAgc3RhdGljIGNyZWF0ZShwYWRkaW5nOiBudW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUGFkZGluZyhwYWRkaW5nLCBwYWRkaW5nLCBwYWRkaW5nLCBwYWRkaW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICAgICAgcHJpdmF0ZSBfbGVmdDogbnVtYmVyLFxuICAgICAgICAgICAgcHJpdmF0ZSBfdG9wOiBudW1iZXIsXG4gICAgICAgICAgICBwcml2YXRlIF9yaWdodDogbnVtYmVyLFxuICAgICAgICAgICAgcHJpdmF0ZSBfYm90dG9tOiBudW1iZXIpIHsgfVxuXG4gICAgICAgIGdldCBsZWZ0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xlZnQ7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgdG9wKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RvcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCByaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBib3R0b20oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYm90dG9tO1xuICAgICAgICB9XG5cbiAgICAgICAgYXBwbHkoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUucGFkZGluZ0xlZnQgPSB0aGlzLl9sZWZ0ICsgXCJweFwiO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5wYWRkaW5nVG9wID0gdGhpcy5fdG9wICsgXCJweFwiO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5wYWRkaW5nUmlnaHQgPSB0aGlzLl9yaWdodCArIFwicHhcIjtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUucGFkZGluZ0JvdHRvbSA9IHRoaXMuX2JvdHRvbSArIFwicHhcIjtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEJvcmRlciBpbXBsZW1lbnRzIElTdHlsZSB7XG5cbiAgICAgICAgc3RhdGljIGNyZWF0ZSh3aWR0aDogbnVtYmVyLCBjb2xvcjogQ29sb3IsIHJhZGl1czogbnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEJvcmRlcih3aWR0aCwgd2lkdGgsIHdpZHRoLCB3aWR0aCwgY29sb3IsIGNvbG9yLCBjb2xvciwgY29sb3IsIHJhZGl1cywgcmFkaXVzLCByYWRpdXMsIHJhZGl1cyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgICAgIHByaXZhdGUgX2xlZnRXaWR0aDogbnVtYmVyLFxuICAgICAgICAgICAgcHJpdmF0ZSBfdG9wV2lkdGg6IG51bWJlcixcbiAgICAgICAgICAgIHByaXZhdGUgX3JpZ2h0V2lkdGg6IG51bWJlcixcbiAgICAgICAgICAgIHByaXZhdGUgX2JvdHRvbVdpZHRoOiBudW1iZXIsXG4gICAgICAgICAgICBwcml2YXRlIF9sZWZ0Q29sb3I6IENvbG9yLFxuICAgICAgICAgICAgcHJpdmF0ZSBfdG9wQ29sb3I6IENvbG9yLFxuICAgICAgICAgICAgcHJpdmF0ZSBfcmlnaHRDb2xvcjogQ29sb3IsXG4gICAgICAgICAgICBwcml2YXRlIF9ib3R0b21Db2xvcjogQ29sb3IsXG4gICAgICAgICAgICBwcml2YXRlIF90b3BMZWZ0UmFkaXVzOiBudW1iZXIsXG4gICAgICAgICAgICBwcml2YXRlIF90b3BSaWdodFJhZGl1czogbnVtYmVyLFxuICAgICAgICAgICAgcHJpdmF0ZSBfYm90dG9tTGVmdFJhZGl1czogbnVtYmVyLFxuICAgICAgICAgICAgcHJpdmF0ZSBfYm90dG9tUmlnaHRSYWRpdXM6IG51bWJlcikge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2xlZnRDb2xvciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGVmdENvbG9yID0gQ29sb3IuVFJBTlNQQVJFTlQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5fdG9wQ29sb3IgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3RvcENvbG9yID0gQ29sb3IuVFJBTlNQQVJFTlQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5fcmlnaHRDb2xvciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmlnaHRDb2xvciA9IENvbG9yLlRSQU5TUEFSRU5UO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuX2JvdHRvbUNvbG9yID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9ib3R0b21Db2xvciA9IENvbG9yLlRSQU5TUEFSRU5UO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGxlZnRXaWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sZWZ0V2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRvcFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RvcFdpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGdldCByaWdodFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JpZ2h0V2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJvdHRvbVdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvdHRvbVdpZHRoO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGxlZnRDb2xvcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sZWZ0Q29sb3I7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRvcENvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RvcENvbG9yO1xuICAgICAgICB9XG4gICAgICAgIGdldCByaWdodENvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JpZ2h0Q29sb3I7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJvdHRvbUNvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvdHRvbUNvbG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHRvcExlZnRSYWRpdXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdG9wTGVmdFJhZGl1cztcbiAgICAgICAgfVxuICAgICAgICBnZXQgdG9wUmlnaHRSYWRpdXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdG9wUmlnaHRSYWRpdXM7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJvdHRvbUxlZnRSYWRpdXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYm90dG9tTGVmdFJhZGl1cztcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm90dG9tUmlnaHRSYWRpdXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYm90dG9tUmlnaHRSYWRpdXM7XG4gICAgICAgIH1cblxuICAgICAgICBhcHBseShlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5ib3JkZXJTdHlsZSA9IFwic29saWRcIjtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuYm9yZGVyTGVmdENvbG9yID0gdGhpcy5fbGVmdENvbG9yLnRvQ1NTKCk7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJvcmRlckxlZnRXaWR0aCA9IHRoaXMuX2xlZnRXaWR0aCArIFwicHhcIjtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuYm9yZGVyVG9wQ29sb3IgPSB0aGlzLl90b3BDb2xvci50b0NTUygpO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5ib3JkZXJUb3BXaWR0aCA9IHRoaXMuX3RvcFdpZHRoICsgXCJweFwiO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5ib3JkZXJSaWdodENvbG9yID0gdGhpcy5fcmlnaHRDb2xvci50b0NTUygpO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5ib3JkZXJSaWdodFdpZHRoID0gdGhpcy5fcmlnaHRXaWR0aCArIFwicHhcIjtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuYm9yZGVyQm90dG9tQ29sb3IgPSB0aGlzLl9ib3R0b21Db2xvci50b0NTUygpO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5ib3JkZXJCb3R0b21XaWR0aCA9IHRoaXMuX2JvdHRvbVdpZHRoICsgXCJweFwiO1xuXG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJvcmRlclRvcExlZnRSYWRpdXMgPSB0aGlzLl90b3BMZWZ0UmFkaXVzICsgXCJweFwiO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5ib3JkZXJUb3BSaWdodFJhZGl1cyA9IHRoaXMuX3RvcFJpZ2h0UmFkaXVzICsgXCJweFwiO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5ib3JkZXJCb3R0b21MZWZ0UmFkaXVzID0gdGhpcy5fYm90dG9tTGVmdFJhZGl1cyArIFwicHhcIjtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuYm9yZGVyQm90dG9tUmlnaHRSYWRpdXMgPSB0aGlzLl9ib3R0b21SaWdodFJhZGl1cyArIFwicHhcIjtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEJveFNoYWRvdyBpbXBsZW1lbnRzIElTdHlsZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoXG4gICAgICAgICAgICBwcml2YXRlIF9oUG9zOiBudW1iZXIsXG4gICAgICAgICAgICBwcml2YXRlIF92UG9zOiBudW1iZXIsXG4gICAgICAgICAgICBwcml2YXRlIF9ibHVyOiBudW1iZXIsXG4gICAgICAgICAgICBwcml2YXRlIF9zcHJlYWQ6IG51bWJlcixcbiAgICAgICAgICAgIHByaXZhdGUgX2NvbG9yOiBDb2xvcixcbiAgICAgICAgICAgIHByaXZhdGUgX2lubmVyOiBib29sZWFuKSB7IH1cblxuICAgICAgICBnZXQgaFBvcygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9oUG9zO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHZQb3MoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdlBvcztcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBibHVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JsdXI7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgc3ByZWFkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NwcmVhZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBjb2xvcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb2xvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBpbm5lcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbm5lcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGFwcGx5KGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJveFNoYWRvdyA9IHRoaXMuX2hQb3MgKyBcInB4IFwiICsgdGhpcy5fdlBvcyArIFwicHggXCIgKyB0aGlzLl9ibHVyICsgXCJweCBcIiArIHRoaXMuX3NwcmVhZCArIFwicHggXCJcbiAgICAgICAgICAgICsgdGhpcy5fY29sb3IudG9DU1MoKSArICh0aGlzLl9pbm5lciA/IFwiIGluc2V0XCIgOiBcIlwiKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEVUZXh0T3ZlcmZsb3cgaW1wbGVtZW50cyBJU3R5bGUge1xuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DTElQID0gbmV3IEVUZXh0T3ZlcmZsb3coXCJjbGlwXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRUxMSVBTSVMgPSBuZXcgRVRleHRPdmVyZmxvdyhcImVsbGlwc2lzXCIpO1xuXG4gICAgICAgIHN0YXRpYyBnZXQgQ0xJUCgpIHtcbiAgICAgICAgICAgIHJldHVybiBFVGV4dE92ZXJmbG93Ll9DTElQO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIGdldCBFTExJUFNJUygpIHtcbiAgICAgICAgICAgIHJldHVybiBFVGV4dE92ZXJmbG93Ll9FTExJUFNJUztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2Nzczogc3RyaW5nKSB7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQ1NTKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NzcztcbiAgICAgICAgfVxuXG4gICAgICAgIGFwcGx5KGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLnRleHRPdmVyZmxvdyA9IHRoaXMuX2NzcztcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEVUZXh0QWxpZ24gaW1wbGVtZW50cyBJU3R5bGUge1xuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9MRUZUID0gbmV3IEVUZXh0QWxpZ24oXCJsZWZ0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ0VOVEVSID0gbmV3IEVUZXh0QWxpZ24oXCJjZW50ZXJcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9SSUdIVCA9IG5ldyBFVGV4dEFsaWduKFwicmlnaHRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9KVVNUSUZZID0gbmV3IEVUZXh0QWxpZ24oXCJqdXN0aWZ5XCIpO1xuXG4gICAgICAgIHN0YXRpYyBnZXQgTEVGVCgpIHtcbiAgICAgICAgICAgIHJldHVybiBFVGV4dEFsaWduLl9MRUZUO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIGdldCBDRU5URVIoKSB7XG4gICAgICAgICAgICByZXR1cm4gRVRleHRBbGlnbi5fQ0VOVEVSO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIGdldCBSSUdIVCgpIHtcbiAgICAgICAgICAgIHJldHVybiBFVGV4dEFsaWduLl9SSUdIVDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRpYyBnZXQgSlVTVElGWSgpIHtcbiAgICAgICAgICAgIHJldHVybiBFVGV4dEFsaWduLl9KVVNUSUZZO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBfY3NzOiBzdHJpbmcpIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBDU1MoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY3NzO1xuICAgICAgICB9XG5cbiAgICAgICAgYXBwbHkoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudGV4dEFsaWduID0gdGhpcy5fY3NzO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRUhBbGlnbiB7XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0xFRlQgPSBuZXcgRUhBbGlnbihcImxlZnRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DRU5URVIgPSBuZXcgRUhBbGlnbihcImNlbnRlclwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1JJR0hUID0gbmV3IEVIQWxpZ24oXCJyaWdodFwiKTtcblxuICAgICAgICBzdGF0aWMgZ2V0IExFRlQoKSB7XG4gICAgICAgICAgICByZXR1cm4gRUhBbGlnbi5fTEVGVDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRpYyBnZXQgQ0VOVEVSKCkge1xuICAgICAgICAgICAgcmV0dXJuIEVIQWxpZ24uX0NFTlRFUjtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRpYyBnZXQgUklHSFQoKSB7XG4gICAgICAgICAgICByZXR1cm4gRUhBbGlnbi5fUklHSFQ7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jc3M6IHN0cmluZykge1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IENTUygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jc3M7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBFVkFsaWduIHtcblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfVE9QID0gbmV3IEVWQWxpZ24oXCJ0b3BcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9NSURETEUgPSBuZXcgRVZBbGlnbihcIm1pZGRsZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0JPVFRPTSA9IG5ldyBFVkFsaWduKFwiYm90dG9tXCIpO1xuXG4gICAgICAgIHN0YXRpYyBnZXQgVE9QKCkge1xuICAgICAgICAgICAgcmV0dXJuIEVWQWxpZ24uX1RPUDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRpYyBnZXQgTUlERExFKCkge1xuICAgICAgICAgICAgcmV0dXJuIEVWQWxpZ24uX01JRERMRTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRpYyBnZXQgQk9UVE9NKCkge1xuICAgICAgICAgICAgcmV0dXJuIEVWQWxpZ24uX0JPVFRPTTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2Nzczogc3RyaW5nKSB7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQ1NTKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NzcztcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEZvbnRGYW1pbHkgaW1wbGVtZW50cyBJU3R5bGUge1xuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9hcmlhbCA9IG5ldyBGb250RmFtaWx5KFwiQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZlwiKTtcbiAgICAgICAgcHVibGljIHN0YXRpYyBnZXQgQXJpYWwoKSB7XG4gICAgICAgICAgICByZXR1cm4gRm9udEZhbWlseS5fYXJpYWw7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBpbml0aWFsaXplZCA9IGZhbHNlO1xuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGluaXRGb250Q29udGFpbmVyU3R5bGUoKSB7XG4gICAgICAgICAgICB2YXIgd25kOiBhbnkgPSB3aW5kb3c7XG4gICAgICAgICAgICB3bmQuZm9udHNTdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgICAgICAgICAgIHduZC5mb250c1N0eWxlLnR5cGUgPSBcInRleHQvY3NzXCI7XG4gICAgICAgICAgICB2YXIgZG9jOiBhbnkgPSBkb2N1bWVudDtcbiAgICAgICAgICAgIGRvYy5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0uYXBwZW5kQ2hpbGQod25kLmZvbnRzU3R5bGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyByZWdpc3RlckZvbnQobmFtZTogc3RyaW5nLCBzcmM6IHN0cmluZywgZXh0cmE6IHN0cmluZykge1xuICAgICAgICAgICAgdmFyIGV4ID0gZXh0cmE7XG4gICAgICAgICAgICBpZiAoZXggPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGV4ID0gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgY3QgPSBcIkBmb250LWZhY2Uge2ZvbnQtZmFtaWx5OiAnXCIgKyBuYW1lICsgXCInOyBzcmM6IHVybCgnXCIgKyBzcmMgKyBcIicpO1wiICsgZXggKyBcIn1cIjtcbiAgICAgICAgICAgIHZhciBpaCA9ICg8YW55PndpbmRvdykuZm9udHNTdHlsZS5pbm5lckhUTUw7XG4gICAgICAgICAgICBpZiAoaWggPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGloID0gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAoPGFueT53aW5kb3cpLmZvbnRzU3R5bGUuaW5uZXJIVE1MID0gaWggKyBjdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2Nzczogc3RyaW5nKSB7XG4gICAgICAgICAgICBpZiAoIUZvbnRGYW1pbHkuaW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICAgICAgICBGb250RmFtaWx5LmluaXRGb250Q29udGFpbmVyU3R5bGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBDU1MoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY3NzO1xuICAgICAgICB9XG5cbiAgICAgICAgYXBwbHkoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuZm9udEZhbWlseSA9IHRoaXMuX2NzcztcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEVDdXJzb3Ige1xuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGF1dG8gPSBuZXcgRUN1cnNvcihcImF1dG9cIik7XG4gICAgICAgIHN0YXRpYyBnZXQgQVVUTygpIHtcbiAgICAgICAgICAgIHJldHVybiBFQ3Vyc29yLmF1dG87XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jc3M6IHN0cmluZykgeyB9XG5cbiAgICAgICAgZ2V0IGNzcygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jc3M7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnQgZW51bSBFU2Nyb2xsQmFyUG9saWN5IHtcblxuICAgICAgICBWSVNJQkxFLFxuICAgICAgICBBVVRPLFxuICAgICAgICBISURERU5cblxuICAgIH1cblxuICAgIGV4cG9ydCBlbnVtIEVQaWN0dXJlU2l6ZU1vZGUge1xuXG4gICAgICAgIE5PUk1BTCxcbiAgICAgICAgQ0VOVEVSLFxuICAgICAgICBTVFJFVENILFxuICAgICAgICBGSUxMLFxuICAgICAgICBaT09NLFxuICAgICAgICBGSVRfV0lEVEgsXG4gICAgICAgIEZJVF9IRUlHSFRcblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBJbWFnZSBpbXBsZW1lbnRzIElTdHlsZSB7XG5cbiAgICAgICAgcHJpdmF0ZSBfb25Mb2FkID0gbmV3IEV2ZW50PEV2ZW50QXJncz4oKTtcblxuICAgICAgICBwcml2YXRlIF93aWR0aCA9IDA7XG4gICAgICAgIHByaXZhdGUgX2hlaWdodCA9IDA7XG4gICAgICAgIHByaXZhdGUgX2xvYWRlZCA9IGZhbHNlO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX3VybDogc3RyaW5nKSB7XG4gICAgICAgICAgICBpZiAoX3VybCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgdXJsIHBhcmFtZXRlciBjYW4gbm90IGJlIG51bGwuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgZSA9IDxIVE1MSW1hZ2VFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG4gICAgICAgICAgICBlLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl93aWR0aCA9IGUud2lkdGg7XG4gICAgICAgICAgICAgICAgdGhpcy5faGVpZ2h0ID0gZS5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkxvYWQuZmlyZUV2ZW50KG5ldyBFdmVudEFyZ3ModGhpcykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBlLnNyYyA9IF91cmw7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgdXJsKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3VybDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBvbkxvYWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25Mb2FkO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dpZHRoO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgbG9hZGVkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xvYWRlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGFwcGx5KGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcInNyY1wiLCB0aGlzLnVybCk7XG4gICAgICAgIH1cblxuICAgIH1cblxufVxuXG5cbiIsIm1vZHVsZSBjdWJlZSB7XG4gICAgXG4gICAgZXhwb3J0IGludGVyZmFjZSBJUnVubmFibGUge1xuICAgICAgICAoKTogdm9pZDtcbiAgICB9XG4gICAgXG4gICAgZXhwb3J0IGNsYXNzIFBvaW50MkQge1xuICAgICAgICBcbiAgICAgICAgY29uc3RydWN0b3IgKHByaXZhdGUgX3g6IG51bWJlciwgcHJpdmF0ZSBfeTogbnVtYmVyKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgZ2V0IHgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5feDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgZ2V0IHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5feTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG4gICAgXG59XG5cblxuIiwibW9kdWxlIGN1YmVlIHtcbiAgICBcbiAgICBleHBvcnQgY2xhc3MgTGF5b3V0Q2hpbGRyZW4ge1xuICAgICAgICBwcml2YXRlIGNoaWxkcmVuOiBBQ29tcG9uZW50W10gPSBbXTtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBhcmVudDogQUxheW91dCkge1xuICAgICAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBhZGQoY29tcG9uZW50OiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICBpZiAoY29tcG9uZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LnBhcmVudCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIGNvbXBvbmVudCBpcyBhbHJlYWR5IGEgY2hpbGQgb2YgYSBsYXlvdXQuXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5fc2V0UGFyZW50KHRoaXMucGFyZW50KTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQub25QYXJlbnRDaGFuZ2VkLmZpcmVFdmVudChuZXcgUGFyZW50Q2hhbmdlZEV2ZW50QXJncyh0aGlzLnBhcmVudCwgY29tcG9uZW50KSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjb21wb25lbnQpO1xuICAgICAgICAgICAgdGhpcy5wYXJlbnQuX29uQ2hpbGRBZGRlZChjb21wb25lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5zZXJ0KGluZGV4OiBudW1iZXIsIGNvbXBvbmVudDogQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgaWYgKGNvbXBvbmVudCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5wYXJlbnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBcIlRoZSBjb21wb25lbnQgaXMgYWxyZWFkeSBhIGNoaWxkIG9mIGEgbGF5b3V0LlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG5ld0NoaWxkcmVuOiBBQ29tcG9uZW50W10gPSBbXTtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgICAgICAgICBuZXdDaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbmV3Q2hpbGRyZW4uc3BsaWNlKGluZGV4LCAwLCBjb21wb25lbnQpO1xuXG4gICAgICAgICAgICAvLyBUT0RPIFZFUlkgSU5FRkVDVElWRVxuICAgICAgICAgICAgdGhpcy5jbGVhcigpO1xuXG4gICAgICAgICAgICBuZXdDaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkKGNoaWxkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlQ29tcG9uZW50KGNvbXBvbmVudDogQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgdmFyIGlkeCA9IHRoaXMuY2hpbGRyZW4uaW5kZXhPZihjb21wb25lbnQpO1xuICAgICAgICAgICAgaWYgKGlkeCA8IDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoZSBnaXZlbiBjb21wb25lbnQgaXNuJ3QgYSBjaGlsZCBvZiB0aGlzIGxheW91dC5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucmVtb3ZlSW5kZXgoaWR4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZUluZGV4KGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgICAgIHZhciByZW1vdmVkQ29tcG9uZW50OiBBQ29tcG9uZW50ID0gdGhpcy5jaGlsZHJlbltpbmRleF07XG4gICAgICAgICAgICBpZiAocmVtb3ZlZENvbXBvbmVudCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlZENvbXBvbmVudC5fc2V0UGFyZW50KG51bGwpO1xuICAgICAgICAgICAgICAgIHJlbW92ZWRDb21wb25lbnQub25QYXJlbnRDaGFuZ2VkLmZpcmVFdmVudChuZXcgUGFyZW50Q2hhbmdlZEV2ZW50QXJncyhudWxsLCByZW1vdmVkQ29tcG9uZW50KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5fb25DaGlsZFJlbW92ZWQocmVtb3ZlZENvbXBvbmVudCwgaW5kZXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2xlYXIoKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQuX3NldFBhcmVudChudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQub25QYXJlbnRDaGFuZ2VkLmZpcmVFdmVudChuZXcgUGFyZW50Q2hhbmdlZEV2ZW50QXJncyhudWxsLCBjaGlsZCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgICAgICAgICAgdGhpcy5wYXJlbnQuX29uQ2hpbGRyZW5DbGVhcmVkKCk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQoaW5kZXg6IG51bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5baW5kZXhdXG4gICAgICAgIH1cblxuICAgICAgICBpbmRleE9mKGNvbXBvbmVudDogQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4uaW5kZXhPZihjb21wb25lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2l6ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmxlbmd0aDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbn1cblxuXG4iLCJtb2R1bGUgY3ViZWUge1xuICAgIFxuICAgIGV4cG9ydCBjbGFzcyBNb3VzZUV2ZW50VHlwZXMge1xuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgTU9VU0VfRE9XTiA9IDA7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgTU9VU0VfTU9WRSA9IDE7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgTU9VU0VfVVAgPSAyO1xuICAgICAgICBwdWJsaWMgc3RhdGljIE1PVVNFX0VOVEVSID0gMztcbiAgICAgICAgcHVibGljIHN0YXRpYyBNT1VTRV9MRUFWRSA9IDQ7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgTU9VU0VfV0hFRUwgPSA1O1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgYWJzdHJhY3QgY2xhc3MgQUNvbXBvbmVudCB7XG5cbiAgICAgICAgcHJpdmF0ZSBfdHJhbnNsYXRlWCA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF90cmFuc2xhdGVZID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3JvdGF0ZSA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLjAsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3NjYWxlWCA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgxLjAsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3NjYWxlWSA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgxLjAsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3RyYW5zZm9ybUNlbnRlclggPSBuZXcgTnVtYmVyUHJvcGVydHkoMC41LCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF90cmFuc2Zvcm1DZW50ZXJZID0gbmV3IE51bWJlclByb3BlcnR5KDAuNSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfcGFkZGluZyA9IG5ldyBQYWRkaW5nUHJvcGVydHkobnVsbCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9ib3JkZXIgPSBuZXcgQm9yZGVyUHJvcGVydHkobnVsbCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9tZWFzdXJlZFdpZHRoID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgcHJpdmF0ZSBfbWVhc3VyZWRIZWlnaHQgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIHRydWUpO1xuICAgICAgICBwcml2YXRlIF9jbGllbnRXaWR0aCA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgIHByaXZhdGUgX2NsaWVudEhlaWdodCA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgIHByaXZhdGUgX2JvdW5kc1dpZHRoID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgcHJpdmF0ZSBfYm91bmRzSGVpZ2h0ID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgcHJpdmF0ZSBfYm91bmRzTGVmdCA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgIHByaXZhdGUgX2JvdW5kc1RvcCA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgIHByaXZhdGUgX21lYXN1cmVkV2lkdGhTZXR0ZXIgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfbWVhc3VyZWRIZWlnaHRTZXR0ZXIgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfY2xpZW50V2lkdGhTZXR0ZXIgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfY2xpZW50SGVpZ2h0U2V0dGVyID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2JvdW5kc1dpZHRoU2V0dGVyID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2JvdW5kc0hlaWdodFNldHRlciA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9ib3VuZHNMZWZ0U2V0dGVyID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2JvdW5kc1RvcFNldHRlciA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9jdXJzb3IgPSBuZXcgUHJvcGVydHk8RUN1cnNvcj4oRUN1cnNvci5BVVRPLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9wb2ludGVyVHJhbnNwYXJlbnQgPSBuZXcgUHJvcGVydHk8Ym9vbGVhbj4oZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2hhbmRsZVBvaW50ZXIgPSBuZXcgUHJvcGVydHk8Ym9vbGVhbj4odHJ1ZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdmlzaWJsZSA9IG5ldyBQcm9wZXJ0eTxib29sZWFuPih0cnVlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9lbmFibGVkID0gbmV3IFByb3BlcnR5PGJvb2xlYW4+KHRydWUsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2FscGhhID0gbmV3IE51bWJlclByb3BlcnR5KDEuMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfc2VsZWN0YWJsZSA9IG5ldyBQcm9wZXJ0eTxib29sZWFuPihmYWxzZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfbWluV2lkdGggPSBuZXcgTnVtYmVyUHJvcGVydHkobnVsbCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9taW5IZWlnaHQgPSBuZXcgTnVtYmVyUHJvcGVydHkobnVsbCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9tYXhXaWR0aCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX21heEhlaWdodCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2hvdmVyZWQgPSBuZXcgUHJvcGVydHk8Ym9vbGVhbj4oZmFsc2UsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgcHJpdmF0ZSBfaG92ZXJlZFNldHRlciA9IG5ldyBQcm9wZXJ0eTxib29sZWFuPihmYWxzZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfcHJlc3NlZCA9IG5ldyBQcm9wZXJ0eTxib29sZWFuPihmYWxzZSwgZmFsc2UsIHRydWUpO1xuICAgICAgICBwcml2YXRlIF9wcmVzc2VkU2V0dGVyID0gbmV3IFByb3BlcnR5PGJvb2xlYW4+KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9vbkNsaWNrID0gbmV3IEV2ZW50PE1vdXNlRXZlbnQ+KCk7XG4gICAgICAgIHByaXZhdGUgX29uTW91c2VEb3duID0gbmV3IEV2ZW50PE1vdXNlRXZlbnQ+KCk7XG4gICAgICAgIHByaXZhdGUgX29uTW91c2VEcmFnID0gbmV3IEV2ZW50PE1vdXNlRXZlbnQ+KCk7XG4gICAgICAgIHByaXZhdGUgX29uTW91c2VNb3ZlID0gbmV3IEV2ZW50PE1vdXNlRXZlbnQ+KCk7XG4gICAgICAgIHByaXZhdGUgX29uTW91c2VVcCA9IG5ldyBFdmVudDxNb3VzZUV2ZW50PigpO1xuICAgICAgICBwcml2YXRlIF9vbk1vdXNlRW50ZXIgPSBuZXcgRXZlbnQ8TW91c2VFdmVudD4oKTtcbiAgICAgICAgcHJpdmF0ZSBfb25Nb3VzZUxlYXZlID0gbmV3IEV2ZW50PE1vdXNlRXZlbnQ+KCk7XG4gICAgICAgIHByaXZhdGUgX29uTW91c2VXaGVlbCA9IG5ldyBFdmVudDxNb3VzZUV2ZW50PigpO1xuICAgICAgICBwcml2YXRlIF9vbktleURvd24gPSBuZXcgRXZlbnQ8S2V5Ym9hcmRFdmVudD4oKTtcbiAgICAgICAgcHJpdmF0ZSBfb25LZXlQcmVzcyA9IG5ldyBFdmVudDxLZXlib2FyZEV2ZW50PigpO1xuICAgICAgICBwcml2YXRlIF9vbktleVVwID0gbmV3IEV2ZW50PEtleWJvYXJkRXZlbnQ+KCk7XG4gICAgICAgIHByaXZhdGUgX29uUGFyZW50Q2hhbmdlZCA9IG5ldyBFdmVudDxQYXJlbnRDaGFuZ2VkRXZlbnRBcmdzPigpO1xuICAgICAgICBwcml2YXRlIF9vbkNvbnRleHRNZW51ID0gbmV3IEV2ZW50PE9iamVjdD4oKTtcbiAgICAgICAgcHJpdmF0ZSBfbGVmdCA9IDA7XG4gICAgICAgIHByaXZhdGUgX3RvcCA9IDA7XG4gICAgICAgIHByaXZhdGUgX2VsZW1lbnQ6IEhUTUxFbGVtZW50O1xuICAgICAgICBwcml2YXRlIF9wYXJlbnQ6IEFMYXlvdXQ7XG4gICAgICAgIHB1YmxpYyBfbmVlZHNMYXlvdXQgPSB0cnVlO1xuICAgICAgICBwcml2YXRlIF9jdWJlZVBhbmVsOiBDdWJlZVBhbmVsO1xuICAgICAgICBwcml2YXRlIF90cmFuc2Zvcm1DaGFuZ2VkTGlzdGVuZXIgPSAoc2VuZGVyOiBPYmplY3QpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtKCk7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgfTtcbiAgICAgICAgcHJpdmF0ZSBfcG9zdENvbnN0cnVjdFJ1bk9uY2UgPSBuZXcgUnVuT25jZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBvc3RDb25zdHJ1Y3QoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgQUNvbXBvbmV0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gcm9vdEVsZW1lbnQgVGhlIHVuZGVybGF5aW5nIEhUTUwgZWxlbWVudCB3aGljaCB0aGlzIGNvbXBvbmVudCB3cmFwcy5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yKHJvb3RFbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudCA9IHJvb3RFbGVtZW50O1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5ib3hTaXppbmcgPSBcImJvcmRlci1ib3hcIjtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKFwiZHJhZ2dhYmxlXCIsIFwiZmFsc2VcIik7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5vdXRsaW5lU3R5bGUgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUub3V0bGluZVdpZHRoID0gXCIwcHhcIjtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUubWFyZ2luID0gXCIwcHhcIjtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9IFwiYWxsXCI7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2xhdGVYLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX3RyYW5zZm9ybUNoYW5nZWRMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2xhdGVZLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX3RyYW5zZm9ybUNoYW5nZWRMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLl9yb3RhdGUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fdHJhbnNmb3JtQ2hhbmdlZExpc3RlbmVyKTtcbiAgICAgICAgICAgIHRoaXMuX3NjYWxlWC5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl90cmFuc2Zvcm1DaGFuZ2VkTGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy5fc2NhbGVZLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX3RyYW5zZm9ybUNoYW5nZWRMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2Zvcm1DZW50ZXJYLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX3RyYW5zZm9ybUNoYW5nZWRMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2Zvcm1DZW50ZXJZLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX3RyYW5zZm9ybUNoYW5nZWRMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLl9ob3ZlcmVkLmluaXRSZWFkb25seUJpbmQodGhpcy5faG92ZXJlZFNldHRlcik7XG4gICAgICAgICAgICB0aGlzLl9wcmVzc2VkLmluaXRSZWFkb25seUJpbmQodGhpcy5fcHJlc3NlZFNldHRlcik7XG4gICAgICAgICAgICB0aGlzLl9wYWRkaW5nLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgcCA9IHRoaXMuX3BhZGRpbmcudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHAgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnBhZGRpbmcgPSBcIjBweFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHAuYXBwbHkodGhpcy5fZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9wYWRkaW5nLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2JvcmRlci5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGIgPSB0aGlzLl9ib3JkZXIudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKGIgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYm9yZGVyU3R5bGVcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJib3JkZXJDb2xvclwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImJvcmRlcldpZHRoXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYm9yZGVyUmFkaXVzXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGIuYXBwbHkodGhpcy5fZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9jdXJzb3IuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUuY3Vyc29yID0gdGhpcy5jdXJzb3IuY3NzO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl92aXNpYmxlLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdmlzaWJsZS52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZW5hYmxlZC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2VuYWJsZWQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2FscGhhLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLm9wYWNpdHkgPSBcIlwiICsgdGhpcy5fYWxwaGEudmFsdWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGFibGUuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zZWxlY3RhYmxlLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJtb3pVc2VyU2VsZWN0XCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwia2h0bWxVc2VyU2VsZWN0XCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwid2Via2l0VXNlclNlbGVjdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcIm1zVXNlclNlbGVjdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcInVzZXJTZWxlY3RcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcIm1velVzZXJTZWxlY3RcIiwgXCJub25lXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KFwia2h0bWxVc2VyU2VsZWN0XCIsIFwibm9uZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcIndlYmtpdFVzZXJTZWxlY3RcIiwgXCJub25lXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KFwibXNVc2VyU2VsZWN0XCIsIFwibm9uZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcInVzZXJTZWxlY3RcIiwgXCJub25lXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fc2VsZWN0YWJsZS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9taW5XaWR0aC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX21pbldpZHRoLnZhbHVlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcIm1pbldpZHRoXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoXCJtaW5XaWR0aFwiLCB0aGlzLl9taW5XaWR0aC52YWx1ZSArIFwicHhcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9taW5IZWlnaHQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9taW5IZWlnaHQudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwibWluSGVpZ2h0XCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoXCJtaW5IZWlnaHRcIiwgdGhpcy5fbWluSGVpZ2h0LnZhbHVlICsgXCJweFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX21heFdpZHRoLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbWF4V2lkdGgudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwibWF4V2lkdGhcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcIm1heFdpZHRoXCIsIHRoaXMuX21heFdpZHRoLnZhbHVlICsgXCJweFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX21heEhlaWdodC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX21heEhlaWdodC52YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJtYXhIZWlnaHRcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcIm1heEhlaWdodFwiLCB0aGlzLl9tYXhIZWlnaHQudmFsdWUgKyBcInB4XCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5faGFuZGxlUG9pbnRlci5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9oYW5kbGVQb2ludGVyLnZhbHVlIHx8IHRoaXMuX3BvaW50ZXJUcmFuc3BhcmVudC52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KFwicG9pbnRlckV2ZW50c1wiLCBcIm5vbmVcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcInBvaW50ZXJFdmVudHNcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9wb2ludGVyVHJhbnNwYXJlbnQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5faGFuZGxlUG9pbnRlci52YWx1ZSB8fCB0aGlzLl9wb2ludGVyVHJhbnNwYXJlbnQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcInBvaW50ZXJFdmVudHNcIiwgXCJub25lXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJwb2ludGVyRXZlbnRzXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLl9tZWFzdXJlZFdpZHRoLmluaXRSZWFkb25seUJpbmQodGhpcy5fbWVhc3VyZWRXaWR0aFNldHRlcik7XG4gICAgICAgICAgICB0aGlzLl9tZWFzdXJlZEhlaWdodC5pbml0UmVhZG9ubHlCaW5kKHRoaXMuX21lYXN1cmVkSGVpZ2h0U2V0dGVyKTtcbiAgICAgICAgICAgIHRoaXMuX2NsaWVudFdpZHRoLmluaXRSZWFkb25seUJpbmQodGhpcy5fY2xpZW50V2lkdGhTZXR0ZXIpO1xuICAgICAgICAgICAgdGhpcy5fY2xpZW50SGVpZ2h0LmluaXRSZWFkb25seUJpbmQodGhpcy5fY2xpZW50SGVpZ2h0U2V0dGVyKTtcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kc1dpZHRoLmluaXRSZWFkb25seUJpbmQodGhpcy5fYm91bmRzV2lkdGhTZXR0ZXIpO1xuICAgICAgICAgICAgdGhpcy5fYm91bmRzSGVpZ2h0LmluaXRSZWFkb25seUJpbmQodGhpcy5fYm91bmRzSGVpZ2h0U2V0dGVyKTtcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kc0xlZnQuaW5pdFJlYWRvbmx5QmluZCh0aGlzLl9ib3VuZHNMZWZ0U2V0dGVyKTtcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kc1RvcC5pbml0UmVhZG9ubHlCaW5kKHRoaXMuX2JvdW5kc1RvcFNldHRlcik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuX29uQ2xpY2sgPSBuZXcgRXZlbnQ8TW91c2VFdmVudD4obmV3IEh0bWxFdmVudExpc3RlbmVyQ2FsbGJhY2sodGhpcy5fZWxlbWVudCwgXCJjbGlja1wiKSk7XG4gICAgICAgICAgICB0aGlzLl9vbk1vdXNlRG93biA9IG5ldyBFdmVudDxNb3VzZUV2ZW50PihuZXcgSHRtbEV2ZW50TGlzdGVuZXJDYWxsYmFjayh0aGlzLl9lbGVtZW50LCBcIm1vdXNlZG93blwiKSk7XG4gICAgICAgICAgICB0aGlzLiBfb25Nb3VzZU1vdmUgPSBuZXcgRXZlbnQ8TW91c2VFdmVudD4obmV3IEh0bWxFdmVudExpc3RlbmVyQ2FsbGJhY2sodGhpcy5fZWxlbWVudCwgXCJtb3VzZW1vdmVcIikpO1xuICAgICAgICAgICAgdGhpcy4gX29uTW91c2VVcCA9IG5ldyBFdmVudDxNb3VzZUV2ZW50PihuZXcgSHRtbEV2ZW50TGlzdGVuZXJDYWxsYmFjayh0aGlzLl9lbGVtZW50LCBcIm1vdXNldXBcIikpO1xuICAgICAgICAgICAgdGhpcy4gX29uTW91c2VFbnRlciA9IG5ldyBFdmVudDxNb3VzZUV2ZW50PihuZXcgSHRtbEV2ZW50TGlzdGVuZXJDYWxsYmFjayh0aGlzLl9lbGVtZW50LCBcIm1vdXNlZW50ZXJcIikpO1xuICAgICAgICAgICAgdGhpcy4gX29uTW91c2VMZWF2ZSA9IG5ldyBFdmVudDxNb3VzZUV2ZW50PihuZXcgSHRtbEV2ZW50TGlzdGVuZXJDYWxsYmFjayh0aGlzLl9lbGVtZW50LCBcIm1vdXNlbGVhdmVcIikpO1xuICAgICAgICAgICAgdGhpcy4gX29uTW91c2VXaGVlbCA9IG5ldyBFdmVudDxNb3VzZUV2ZW50PihuZXcgSHRtbEV2ZW50TGlzdGVuZXJDYWxsYmFjayh0aGlzLl9lbGVtZW50LCBcIm1vdXNld2hlZWxcIikpO1xuICAgICAgICAgICAgdGhpcy4gX29uS2V5RG93biA9IG5ldyBFdmVudDxLZXlib2FyZEV2ZW50PihuZXcgSHRtbEV2ZW50TGlzdGVuZXJDYWxsYmFjayh0aGlzLl9lbGVtZW50LCBcImtleWRvd25cIikpO1xuICAgICAgICAgICAgdGhpcy4gX29uS2V5UHJlc3MgPSBuZXcgRXZlbnQ8S2V5Ym9hcmRFdmVudD4obmV3IEh0bWxFdmVudExpc3RlbmVyQ2FsbGJhY2sodGhpcy5fZWxlbWVudCwgXCJrZXlwcmVzc1wiKSk7XG4gICAgICAgICAgICB0aGlzLiBfb25LZXlVcCA9IG5ldyBFdmVudDxLZXlib2FyZEV2ZW50PihuZXcgSHRtbEV2ZW50TGlzdGVuZXJDYWxsYmFjayh0aGlzLl9lbGVtZW50LCBcImtleXVwXCIpKTtcbiAgICAgICAgICAgIHRoaXMuIF9vbkNvbnRleHRNZW51ID0gbmV3IEV2ZW50PE9iamVjdD4obmV3IEh0bWxFdmVudExpc3RlbmVyQ2FsbGJhY2sodGhpcy5fZWxlbWVudCwgXCJjb250ZXh0bWVudVwiKSk7XG5cbiAgICAgICAgICAgIHRoaXMuX29uTW91c2VFbnRlci5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5faG92ZXJlZFNldHRlci52YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX29uTW91c2VMZWF2ZS5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5faG92ZXJlZFNldHRlci52YWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9vbk1vdXNlRG93bi5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJlc3NlZFNldHRlci52YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX29uTW91c2VVcC5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJlc3NlZFNldHRlci52YWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGludm9rZVBvc3RDb25zdHJ1Y3QoKSB7XG4gICAgICAgICAgICB0aGlzLl9wb3N0Q29uc3RydWN0UnVuT25jZS5ydW4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBwb3N0Q29uc3RydWN0KCkge1xuXG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc2V0Q3ViZWVQYW5lbChjdWJlZVBhbmVsOiBDdWJlZVBhbmVsKSB7XG4gICAgICAgICAgICB0aGlzLl9jdWJlZVBhbmVsID0gY3ViZWVQYW5lbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldEN1YmVlUGFuZWwoKTogQ3ViZWVQYW5lbCB7XG4gICAgICAgICAgICBpZiAodGhpcy5fY3ViZWVQYW5lbCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2N1YmVlUGFuZWw7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0Q3ViZWVQYW5lbCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgdXBkYXRlVHJhbnNmb3JtKCkge1xuICAgICAgICAgICAgdmFyIGFuZ2xlID0gdGhpcy5fcm90YXRlLnZhbHVlO1xuICAgICAgICAgICAgYW5nbGUgPSBhbmdsZSAtIChhbmdsZSB8IDApO1xuICAgICAgICAgICAgYW5nbGUgPSBhbmdsZSAqIDM2MDtcbiAgICAgICAgICAgIHZhciBhbmdsZVN0ciA9IGFuZ2xlICsgXCJkZWdcIjtcblxuICAgICAgICAgICAgdmFyIGNlbnRlclggPSAodGhpcy5fdHJhbnNmb3JtQ2VudGVyWC52YWx1ZSAqIDEwMCkgKyBcIiVcIjtcbiAgICAgICAgICAgIHZhciBjZW50ZXJZID0gKHRoaXMuX3RyYW5zZm9ybUNlbnRlclkudmFsdWUgKiAxMDApICsgXCIlXCI7XG5cbiAgICAgICAgICAgIHZhciBzWCA9IHRoaXMuX3NjYWxlWC52YWx1ZS50b1N0cmluZygpO1xuICAgICAgICAgICAgdmFyIHNZID0gdGhpcy5fc2NhbGVZLnZhbHVlLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gY2VudGVyWCArIFwiIFwiICsgY2VudGVyWTtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gXCJ0cmFuc2xhdGUoXCIgKyB0aGlzLl90cmFuc2xhdGVYLnZhbHVlICsgXCJweCwgXCIgKyB0aGlzLl90cmFuc2xhdGVZLnZhbHVlXG4gICAgICAgICAgICArIFwicHgpIHJvdGF0ZShcIiArIGFuZ2xlU3RyICsgXCIpIHNjYWxlWCggXCIgKyBzWCArIFwiKSBzY2FsZVkoXCIgKyBzWSArIFwiKVwiO1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5iYWNrZmFjZVZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVxdWVzdExheW91dCgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fbmVlZHNMYXlvdXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9uZWVkc0xheW91dCA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3BhcmVudCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcmVudC5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9jdWJlZVBhbmVsICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3ViZWVQYW5lbC5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgUG9wdXBzLl9yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbWVhc3VyZSgpIHtcbiAgICAgICAgICAgIHRoaXMub25NZWFzdXJlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIG9uTWVhc3VyZSgpIHtcbiAgICAgICAgICAgIC8vIGNhbGN1bGF0aW5nIGNsaWVudCBib3VuZHNcbiAgICAgICAgICAgIHZhciBjdyA9IHRoaXMuX2VsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgICAgICAgICB2YXIgY2ggPSB0aGlzLl9lbGVtZW50LmNsaWVudEhlaWdodDtcbiAgICAgICAgICAgIHZhciBwID0gdGhpcy5fcGFkZGluZy52YWx1ZTtcbiAgICAgICAgICAgIGlmIChwICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjdyA9IGN3IC0gcC5sZWZ0IC0gcC5yaWdodDtcbiAgICAgICAgICAgICAgICBjaCA9IGNoIC0gcC50b3AgLSBwLmJvdHRvbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2NsaWVudFdpZHRoU2V0dGVyLnZhbHVlID0gY3c7XG4gICAgICAgICAgICB0aGlzLl9jbGllbnRIZWlnaHRTZXR0ZXIudmFsdWUgPSBjaDtcblxuICAgICAgICAgICAgLy8gY2FsY3VsYXRpbmcgbWVhc3VyZWQgYm91bmRzXG4gICAgICAgICAgICB2YXIgbXcgPSB0aGlzLl9lbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICAgICAgdmFyIG1oID0gdGhpcy5fZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICB0aGlzLl9tZWFzdXJlZFdpZHRoU2V0dGVyLnZhbHVlID0gbXc7XG4gICAgICAgICAgICB0aGlzLl9tZWFzdXJlZEhlaWdodFNldHRlci52YWx1ZSA9IG1oO1xuXG4gICAgICAgICAgICAvLyBjYWxjdWxhdGluZyBwYXJlbnQgYm91bmRzXG4gICAgICAgICAgICB2YXIgdGN4ID0gdGhpcy5fdHJhbnNmb3JtQ2VudGVyWC52YWx1ZTtcbiAgICAgICAgICAgIHZhciB0Y3kgPSB0aGlzLl90cmFuc2Zvcm1DZW50ZXJZLnZhbHVlO1xuXG4gICAgICAgICAgICB2YXIgYnggPSAwO1xuICAgICAgICAgICAgdmFyIGJ5ID0gMDtcbiAgICAgICAgICAgIHZhciBidyA9IG13O1xuICAgICAgICAgICAgdmFyIGJoID0gbWg7XG5cbiAgICAgICAgICAgIHZhciB0bCA9IG5ldyBQb2ludDJEKDAsIDApO1xuICAgICAgICAgICAgdmFyIHRyID0gbmV3IFBvaW50MkQobXcsIDApO1xuICAgICAgICAgICAgdmFyIGJyID0gbmV3IFBvaW50MkQobXcsIG1oKTtcbiAgICAgICAgICAgIHZhciBibCA9IG5ldyBQb2ludDJEKDAsIG1oKTtcblxuICAgICAgICAgICAgdmFyIGN4ID0gKG13ICogdGN4KSB8IDA7XG4gICAgICAgICAgICB2YXIgY3kgPSAobWggKiB0Y3kpIHwgMDtcblxuICAgICAgICAgICAgdmFyIHJvdCA9IHRoaXMuX3JvdGF0ZS52YWx1ZTtcbiAgICAgICAgICAgIGlmIChyb3QgIT0gMC4wKSB7XG4gICAgICAgICAgICAgICAgdGwgPSB0aGlzLnJvdGF0ZVBvaW50KGN4LCBjeSwgMCwgMCwgcm90KTtcbiAgICAgICAgICAgICAgICB0ciA9IHRoaXMucm90YXRlUG9pbnQoY3gsIGN5LCBidywgMCwgcm90KTtcbiAgICAgICAgICAgICAgICBiciA9IHRoaXMucm90YXRlUG9pbnQoY3gsIGN5LCBidywgYmgsIHJvdCk7XG4gICAgICAgICAgICAgICAgYmwgPSB0aGlzLnJvdGF0ZVBvaW50KGN4LCBjeSwgMCwgYmgsIHJvdCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzeCA9IHRoaXMuX3NjYWxlWC52YWx1ZTtcbiAgICAgICAgICAgIHZhciBzeSA9IHRoaXMuX3NjYWxlWS52YWx1ZTtcblxuICAgICAgICAgICAgaWYgKHN4ICE9IDEuMCB8fCBzeSAhPSAxLjApIHtcbiAgICAgICAgICAgICAgICB0bCA9IHRoaXMuc2NhbGVQb2ludChjeCwgY3ksIHRsLngsIHRsLnksIHN4LCBzeSk7XG4gICAgICAgICAgICAgICAgdHIgPSB0aGlzLnNjYWxlUG9pbnQoY3gsIGN5LCB0ci54LCB0ci55LCBzeCwgc3kpO1xuICAgICAgICAgICAgICAgIGJyID0gdGhpcy5zY2FsZVBvaW50KGN4LCBjeSwgYnIueCwgYnIueSwgc3gsIHN5KTtcbiAgICAgICAgICAgICAgICBibCA9IHRoaXMuc2NhbGVQb2ludChjeCwgY3ksIGJsLngsIGJsLnksIHN4LCBzeSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBtaW5YID0gTWF0aC5taW4oTWF0aC5taW4odGwueCwgdHIueCksIE1hdGgubWluKGJyLngsIGJsLngpKTtcbiAgICAgICAgICAgIHZhciBtaW5ZID0gTWF0aC5taW4oTWF0aC5taW4odGwueSwgdHIueSksIE1hdGgubWluKGJyLnksIGJsLnkpKTtcbiAgICAgICAgICAgIHZhciBtYXhYID0gTWF0aC5tYXgoTWF0aC5tYXgodGwueCwgdHIueCksIE1hdGgubWF4KGJyLngsIGJsLngpKTtcbiAgICAgICAgICAgIHZhciBtYXhZID0gTWF0aC5tYXgoTWF0aC5tYXgodGwueSwgdHIueSksIE1hdGgubWF4KGJyLnksIGJsLnkpKTtcbiAgICAgICAgICAgIGJ3ID0gbWF4WCAtIG1pblg7XG4gICAgICAgICAgICBiaCA9IG1heFkgLSBtaW5ZO1xuICAgICAgICAgICAgYnggPSBtaW5YO1xuICAgICAgICAgICAgYnkgPSBtaW5ZO1xuXG4gICAgICAgICAgICB0aGlzLl9ib3VuZHNMZWZ0U2V0dGVyLnZhbHVlID0gYng7XG4gICAgICAgICAgICB0aGlzLl9ib3VuZHNUb3BTZXR0ZXIudmFsdWUgPSBieTtcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kc1dpZHRoU2V0dGVyLnZhbHVlID0gYnc7XG4gICAgICAgICAgICB0aGlzLl9ib3VuZHNIZWlnaHRTZXR0ZXIudmFsdWUgPSBiaDtcbiAgICAgICAgfVxuXG4gICAgICAgIHNjYWxlUG9pbnQoY2VudGVyWDogbnVtYmVyLCBjZW50ZXJZOiBudW1iZXIsIHBvaW50WDogbnVtYmVyLCBwb2ludFk6IG51bWJlciwgc2NhbGVYOiBudW1iZXIsIHNjYWxlWTogbnVtYmVyKSB7XG4gICAgICAgICAgICB2YXIgcmVzWCA9IChjZW50ZXJYICsgKChwb2ludFggLSBjZW50ZXJYKSAqIHNjYWxlWCkpIHwgMDtcbiAgICAgICAgICAgIHZhciByZXNZID0gKGNlbnRlclkgKyAoKHBvaW50WSAtIGNlbnRlclkpICogc2NhbGVZKSkgfCAwO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQb2ludDJEKHJlc1gsIHJlc1kpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSByb3RhdGVQb2ludChjeDogbnVtYmVyLCBjeTogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlciwgYW5nbGU6IG51bWJlcikge1xuICAgICAgICAgICAgYW5nbGUgPSAoYW5nbGUgKiAzNjApICogKE1hdGguUEkgLyAxODApO1xuICAgICAgICAgICAgeCA9IHggLSBjeDtcbiAgICAgICAgICAgIHkgPSB5IC0gY3k7XG4gICAgICAgICAgICB2YXIgc2luID0gTWF0aC5zaW4oYW5nbGUpO1xuICAgICAgICAgICAgdmFyIGNvcyA9IE1hdGguY29zKGFuZ2xlKTtcbiAgICAgICAgICAgIHZhciByeCA9ICgoY29zICogeCkgLSAoc2luICogeSkpIHwgMDtcbiAgICAgICAgICAgIHZhciByeSA9ICgoc2luICogeCkgKyAoY29zICogeSkpIHwgMDtcbiAgICAgICAgICAgIHJ4ID0gcnggKyBjeDtcbiAgICAgICAgICAgIHJ5ID0gcnkgKyBjeTtcblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQb2ludDJEKHJ4LCByeSk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgZWxlbWVudCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9lbGVtZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHBhcmVudCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgX3NldFBhcmVudChwYXJlbnQ6IEFMYXlvdXQpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxheW91dCgpIHtcbiAgICAgICAgICAgIHRoaXMuX25lZWRzTGF5b3V0ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLm1lYXN1cmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBuZWVkc0xheW91dCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9uZWVkc0xheW91dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUcmFuc2xhdGVYKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0ZVg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRyYW5zbGF0ZVgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UcmFuc2xhdGVYLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0cmFuc2xhdGVYKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRyYW5zbGF0ZVgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUcmFuc2xhdGVZKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0ZVk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRyYW5zbGF0ZVkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UcmFuc2xhdGVZLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0cmFuc2xhdGVZKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRyYW5zbGF0ZVkudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcHJvdGVjdGVkIHBhZGRpbmdQcm9wZXJ0eSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYWRkaW5nO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBnZXQgUGFkZGluZygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhZGRpbmdQcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBnZXQgcGFkZGluZygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlBhZGRpbmcudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIHNldCBwYWRkaW5nKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlBhZGRpbmcudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBib3JkZXJQcm9wZXJ0eSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib3JkZXI7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGdldCBCb3JkZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ib3JkZXJQcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBnZXQgYm9yZGVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm9yZGVyLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBzZXQgYm9yZGVyKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkJvcmRlci52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IE1lYXN1cmVkV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbWVhc3VyZWRXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgbWVhc3VyZWRXaWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLk1lYXN1cmVkV2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IG1lYXN1cmVkV2lkdGgodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuTWVhc3VyZWRXaWR0aC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IE1lYXN1cmVkSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21lYXN1cmVkSGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGdldCBtZWFzdXJlZEhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLk1lYXN1cmVkSGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBtZWFzdXJlZEhlaWdodCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5NZWFzdXJlZEhlaWdodC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IENsaWVudFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NsaWVudFdpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGdldCBjbGllbnRXaWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkNsaWVudFdpZHRoLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBjbGllbnRXaWR0aCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5DbGllbnRXaWR0aC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IENsaWVudEhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jbGllbnRIZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGNsaWVudEhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkNsaWVudEhlaWdodC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgY2xpZW50SGVpZ2h0KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkNsaWVudEhlaWdodC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEJvdW5kc1dpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvdW5kc1dpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGdldCBib3VuZHNXaWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkJvdW5kc1dpZHRoLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBib3VuZHNXaWR0aCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Cb3VuZHNXaWR0aC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEJvdW5kc0hlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib3VuZHNIZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJvdW5kc0hlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkJvdW5kc0hlaWdodC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYm91bmRzSGVpZ2h0KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkJvdW5kc0hlaWdodC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEJvdW5kc0xlZnQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYm91bmRzTGVmdDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm91bmRzTGVmdCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkJvdW5kc0xlZnQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGJvdW5kc0xlZnQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQm91bmRzTGVmdC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEJvdW5kc1RvcCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib3VuZHNUb3A7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJvdW5kc1RvcCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkJvdW5kc1RvcC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYm91bmRzVG9wKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkJvdW5kc1RvcC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIG1pbldpZHRoUHJvcGVydHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbWluV2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGdldCBNaW5XaWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1pbldpZHRoUHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IG1pbldpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuTWluV2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIHNldCBtaW5XaWR0aCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5NaW5XaWR0aC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cblxuICAgICAgICBwcm90ZWN0ZWQgbWluSGVpZ2h0UHJvcGVydHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbWluSGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBnZXQgTWluSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWluSGVpZ2h0UHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IG1pbkhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLk1pbkhlaWdodC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgc2V0IG1pbkhlaWdodCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5NaW5IZWlnaHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcHJvdGVjdGVkIG1heFdpZHRoUHJvcGVydHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbWF4V2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGdldCBNYXhXaWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1heFdpZHRoUHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IG1heFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuTWF4V2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIHNldCBtYXhXaWR0aCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5NYXhXaWR0aC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cblxuICAgICAgICBwcm90ZWN0ZWQgbWF4SGVpZ2h0UHJvcGVydHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbWF4SGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBnZXQgTWF4SGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF4SGVpZ2h0UHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IG1heEhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLk1heEhlaWdodC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgc2V0IG1heEhlaWdodCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5NYXhIZWlnaHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgdGhlIGJhc2UgcG9zaXRpb24gb2YgdGhpcyBjb21wb25lbnQgcmVsYXRpdmUgdG8gdGhlIHBhcmVudCdzIHRvcC1sZWZ0IGNvcm5lci4gVGhpcyBtZXRob2QgaXMgY2FsbGVkIGZyb20gYVxuICAgICAgICAgKiBsYXlvdXQncyBvbkxheW91dCBtZXRob2QgdG8gc2V0IHRoZSBiYXNlIHBvc2l0aW9uIG9mIHRoaXMgY29tcG9uZW50LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gbGVmdCBUaGUgbGVmdCBiYXNlIHBvc2l0aW9uIG9mIHRoaXMgY29tcG9uZW50IHJlbGF0aXZlIHRvIHRoZSBwYXJlbnRzIHRvcC1sZWZ0IGNvcm5lci5cbiAgICAgICAgICogQHBhcmFtIHRvcCBUaGUgdG9wIGJhc2UgcG9zaXRpb24gb2YgdGhpcyBjb21wb25lbnQgcmVsYXRpdmUgdG8gdGhlIHBhcmVudHMgdG9wLWxlZnQgY29ybmVyLlxuICAgICAgICAgKi9cbiAgICAgICAgcHJvdGVjdGVkIHNldFBvc2l0aW9uKGxlZnQ6IG51bWJlciwgdG9wOiBudW1iZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUubGVmdCA9IFwiXCIgKyBsZWZ0ICsgXCJweFwiO1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS50b3AgPSBcIlwiICsgdG9wICsgXCJweFwiO1xuICAgICAgICAgICAgdGhpcy5fbGVmdCA9IGxlZnQ7XG4gICAgICAgICAgICB0aGlzLl90b3AgPSB0b3A7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0cyB0aGUgYmFzZSBsZWZ0IHBvc2l0aW9uIG9mIHRoaXMgY29tcG9uZW50IHJlbGF0aXZlIHRvIHRoZSBwYXJlbnQncyB0b3AtbGVmdCBjb3JuZXIuIFRoaXMgbWV0aG9kIGlzIGNhbGxlZFxuICAgICAgICAgKiBmcm9tIGEgbGF5b3V0J3Mgb25MYXlvdXQgbWV0aG9kIHRvIHNldCB0aGUgYmFzZSBsZWZ0IHBvc2l0aW9uIG9mIHRoaXMgY29tcG9uZW50LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gbGVmdCBUaGUgbGVmdCBiYXNlIHBvc2l0aW9uIG9mIHRoaXMgY29tcG9uZW50IHJlbGF0aXZlIHRvIHRoZSBwYXJlbnRzIHRvcC1sZWZ0IGNvcm5lci5cbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBfc2V0TGVmdChsZWZ0OiBudW1iZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUubGVmdCA9IFwiXCIgKyBsZWZ0ICsgXCJweFwiO1xuICAgICAgICAgICAgdGhpcy5fbGVmdCA9IGxlZnQ7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0cyB0aGUgYmFzZSB0b3AgcG9zaXRpb24gb2YgdGhpcyBjb21wb25lbnQgcmVsYXRpdmUgdG8gdGhlIHBhcmVudCdzIHRvcC1sZWZ0IGNvcm5lci4gVGhpcyBtZXRob2QgaXMgY2FsbGVkIGZyb21cbiAgICAgICAgICogYSBsYXlvdXQncyBvbkxheW91dCBtZXRob2QgdG8gc2V0IHRoZSBiYXNlIHRvcCBwb3NpdGlvbiBvZiB0aGlzIGNvbXBvbmVudC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHRvcCBUaGUgdG9wIGJhc2UgcG9zaXRpb24gb2YgdGhpcyBjb21wb25lbnQgcmVsYXRpdmUgdG8gdGhlIHBhcmVudHMgdG9wLWxlZnQgY29ybmVyLlxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIF9zZXRUb3AodG9wOiBudW1iZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUudG9wID0gXCJcIiArIHRvcCArIFwicHhcIjtcbiAgICAgICAgICAgIHRoaXMuX3RvcCA9IHRvcDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIHRoZSBzaXplIG9mIHRoaXMgY29tcG9uZW50LiBUaGlzIG1ldGhvZCBjYW4gYmUgY2FsbGVkIHdoZW4gYSBkeW5hbWljYWxseSBzaXplZCBjb21wb25lbnQncyBzaXplIGlzXG4gICAgICAgICAqIGNhbGN1bGF0ZWQuIFR5cGljYWxseSBmcm9tIHRoZSBvbkxheW91dCBtZXRob2QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB3aWR0aCBUaGUgd2lkdGggb2YgdGhpcyBjb21wb25lbnQuXG4gICAgICAgICAqIEBwYXJhbSBoZWlnaHQgVGhlIGhlaWdodCBvZiB0aGlzIGNvbXBvbmVudC5cbiAgICAgICAgICovXG4gICAgICAgIHByb3RlY3RlZCBzZXRTaXplKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSB7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLndpZHRoID0gXCJcIiArIHdpZHRoICsgXCJweFwiO1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBcIlwiICsgaGVpZ2h0ICsgXCJweFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEN1cnNvcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jdXJzb3I7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGN1cnNvcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkN1cnNvci52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgY3Vyc29yKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkN1cnNvci52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFBvaW50ZXJUcmFuc3BhcmVudCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wb2ludGVyVHJhbnNwYXJlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHBvaW50ZXJUcmFuc3BhcmVudCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlBvaW50ZXJUcmFuc3BhcmVudC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgcG9pbnRlclRyYW5zcGFyZW50KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlBvaW50ZXJUcmFuc3BhcmVudC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFZpc2libGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmlzaWJsZTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdmlzaWJsZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlZpc2libGUudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHZpc2libGUodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVmlzaWJsZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IG9uQ2xpY2soKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25DbGljaztcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBvbkNvbnRleHRNZW51KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX29uQ29udGV4dE1lbnU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgb25Nb3VzZURvd24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25Nb3VzZURvd247XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgb25Nb3VzZU1vdmUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25Nb3VzZU1vdmU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgb25Nb3VzZVVwKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX29uTW91c2VVcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBvbk1vdXNlRW50ZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25Nb3VzZUVudGVyO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IG9uTW91c2VMZWF2ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbk1vdXNlTGVhdmU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgb25Nb3VzZVdoZWVsKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX29uTW91c2VXaGVlbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBvbktleURvd24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25LZXlEb3duO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IG9uS2V5UHJlc3MoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25LZXlQcmVzcztcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBvbktleVVwKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX29uS2V5VXA7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgb25QYXJlbnRDaGFuZ2VkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX29uUGFyZW50Q2hhbmdlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBBbHBoYSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hbHBoYTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYWxwaGEoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5BbHBoYS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYWxwaGEodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQWxwaGEudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBIYW5kbGVQb2ludGVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hhbmRsZVBvaW50ZXI7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGhhbmRsZVBvaW50ZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5IYW5kbGVQb2ludGVyLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBoYW5kbGVQb2ludGVyKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkhhbmRsZVBvaW50ZXIudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBFbmFibGVkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2VuYWJsZWQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGVuYWJsZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5FbmFibGVkLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBlbmFibGVkKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkVuYWJsZWQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBTZWxlY3RhYmxlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGFibGU7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHNlbGVjdGFibGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5TZWxlY3RhYmxlLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBzZWxlY3RhYmxlKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlNlbGVjdGFibGUudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgZ2V0IGxlZnQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbGVmdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB0b3AoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdG9wO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFJvdGF0ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yb3RhdGU7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHJvdGF0ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlJvdGF0ZS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgcm90YXRlKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlJvdGF0ZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFNjYWxlWCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zY2FsZVg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHNjYWxlWCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlNjYWxlWC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgc2NhbGVYKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlNjYWxlWC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFNjYWxlWSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zY2FsZVk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHNjYWxlWSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlNjYWxlWS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgc2NhbGVZKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlNjYWxlWS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFRyYW5zZm9ybUNlbnRlclgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNmb3JtQ2VudGVyWDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdHJhbnNmb3JtQ2VudGVyWCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlRyYW5zZm9ybUNlbnRlclgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHRyYW5zZm9ybUNlbnRlclgodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVHJhbnNmb3JtQ2VudGVyWC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFRyYW5zZm9ybUNlbnRlclkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNmb3JtQ2VudGVyWTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdHJhbnNmb3JtQ2VudGVyWSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlRyYW5zZm9ybUNlbnRlclkudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHRyYW5zZm9ybUNlbnRlclkodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVHJhbnNmb3JtQ2VudGVyWS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEhvdmVyZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faG92ZXJlZDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgaG92ZXJlZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkhvdmVyZWQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGhvdmVyZWQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuSG92ZXJlZC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFByZXNzZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcHJlc3NlZDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgcHJlc3NlZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlByZXNzZWQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHByZXNzZWQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuUHJlc3NlZC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH1cblxufVxuXG5cbiIsIm1vZHVsZSBjdWJlZSB7XG5cbiAgICBleHBvcnQgYWJzdHJhY3QgY2xhc3MgQUxheW91dCBleHRlbmRzIEFDb21wb25lbnQge1xuICAgICAgICBwcml2YXRlIF9jaGlsZHJlbiA9IG5ldyBMYXlvdXRDaGlsZHJlbih0aGlzKTtcblxuICAgICAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgc3VwZXIoZWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IGNoaWxkcmVuX2lubmVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkcmVuO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGFic3RyYWN0IF9vbkNoaWxkQWRkZWQoY2hpbGQ6IEFDb21wb25lbnQpOiB2b2lkO1xuXG4gICAgICAgIHB1YmxpYyBhYnN0cmFjdCBfb25DaGlsZFJlbW92ZWQoY2hpbGQ6IEFDb21wb25lbnQsIGluZGV4OiBudW1iZXIpOiB2b2lkO1xuXG4gICAgICAgIHB1YmxpYyBhYnN0cmFjdCBfb25DaGlsZHJlbkNsZWFyZWQoKTogdm9pZDtcblxuICAgICAgICBsYXlvdXQoKSB7XG4gICAgICAgICAgICB0aGlzLl9uZWVkc0xheW91dCA9IGZhbHNlO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuX2lubmVyLnNpemUoKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkID0gdGhpcy5jaGlsZHJlbl9pbm5lci5nZXQoaSk7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkLm5lZWRzTGF5b3V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZC5sYXlvdXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMub25MYXlvdXQoKTtcbiAgICAgICAgICAgIHRoaXMubWVhc3VyZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIGFic3RyYWN0IG9uTGF5b3V0KCk6IHZvaWQ7XG5cbiAgICAgICAgZ2V0Q29tcG9uZW50c0F0UG9zaXRpb24oeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICAgICAgICAgIHZhciByZXM6IEFDb21wb25lbnRbXSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnRzQXRQb3NpdGlvbl9pbXBsKHRoaXMsIHgsIHksIHJlcyk7XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBnZXRDb21wb25lbnRzQXRQb3NpdGlvbl9pbXBsKHJvb3Q6IEFMYXlvdXQsIHg6IG51bWJlciwgeTogbnVtYmVyLCByZXN1bHQ6IEFDb21wb25lbnRbXSkge1xuICAgICAgICAgICAgaWYgKHggPj0gMCAmJiB4IDw9IHJvb3QuYm91bmRzV2lkdGggJiYgeSA+PSAwICYmIHkgPD0gcm9vdC5ib3VuZHNIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuc3BsaWNlKDAsIDAsIHJvb3QpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm9vdC5jaGlsZHJlbl9pbm5lci5zaXplKCk7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29tcG9uZW50ID0gcm9vdC5jaGlsZHJlbl9pbm5lci5nZXQoaSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGV0IHR4ID0geCAtIGNvbXBvbmVudC5sZWZ0IC0gY29tcG9uZW50LnRyYW5zbGF0ZVg7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0eSA9IHkgLSBjb21wb25lbnQudG9wIC0gY29tcG9uZW50LnRyYW5zbGF0ZVk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBBTGF5b3V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudHNBdFBvc2l0aW9uX2ltcGwoPEFMYXlvdXQ+Y29tcG9uZW50LCB0eCwgdHksIHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHggPj0gMCAmJiB0eCA8PSBjb21wb25lbnQuYm91bmRzV2lkdGggJiYgeSA+PSAwICYmIHkgPD0gY29tcG9uZW50LmJvdW5kc0hlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5zcGxpY2UoMCwgMCwgY29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBzZXRDaGlsZExlZnQoY2hpbGQ6IEFDb21wb25lbnQsIGxlZnQ6IG51bWJlcikge1xuICAgICAgICAgICAgY2hpbGQuX3NldExlZnQobGVmdCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgc2V0Q2hpbGRUb3AoY2hpbGQ6IEFDb21wb25lbnQsIHRvcDogbnVtYmVyKSB7XG4gICAgICAgICAgICBjaGlsZC5fc2V0VG9wKHRvcCk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuIiwibW9kdWxlIGN1YmVlIHtcblxuICAgIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBVXNlckNvbnRyb2wgZXh0ZW5kcyBBTGF5b3V0IHtcblxuICAgICAgICBwcml2YXRlIF93aWR0aCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2hlaWdodCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2JhY2tncm91bmQgPSBuZXcgQmFja2dyb3VuZFByb3BlcnR5KG5ldyBDb2xvckJhY2tncm91bmQoQ29sb3IuVFJBTlNQQVJFTlQpLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3NoYWRvdyA9IG5ldyBQcm9wZXJ0eTxCb3hTaGFkb3c+KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfZHJhZ2dhYmxlID0gbmV3IEJvb2xlYW5Qcm9wZXJ0eShmYWxzZSk7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vdmVyZmxvd1ggPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93WSA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICB0aGlzLl93aWR0aC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3dpZHRoLnZhbHVlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwid2lkdGhcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLndpZHRoID0gXCJcIiArIHRoaXMuX3dpZHRoLnZhbHVlICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fd2lkdGguaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5faGVpZ2h0LmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5faGVpZ2h0LnZhbHVlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiaGVpZ2h0XCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBcIlwiICsgdGhpcy5faGVpZ2h0LnZhbHVlICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5faGVpZ2h0LmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2JhY2tncm91bmQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImJhY2tncm91bmRDb2xvclwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJiYWNrZ3JvdW5kSW1hZ2VcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYmFja2dyb3VuZFwiKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fYmFja2dyb3VuZC52YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2JhY2tncm91bmQudmFsdWUuYXBwbHkodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2JhY2tncm91bmQuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fc2hhZG93LmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fc2hhZG93LnZhbHVlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYm94U2hhZG93XCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYWRvdy52YWx1ZS5hcHBseSh0aGlzLmVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZHJhZ2dhYmxlLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZHJhZ2dhYmxlLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkcmFnZ2FibGVcIiwgXCJ0cnVlXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkcmFnZ2FibGVcIiwgXCJmYWxzZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2RyYWdnYWJsZS5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgd2lkdGhQcm9wZXJ0eSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMud2lkdGhQcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBnZXQgd2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5XaWR0aC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgc2V0IHdpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLldpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuXG5cbiAgICAgICAgcHJvdGVjdGVkIGhlaWdodFByb3BlcnR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IEhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhlaWdodFByb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGdldCBoZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5IZWlnaHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIHNldCBoZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuSGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHByb3RlY3RlZCBiYWNrZ3JvdW5kUHJvcGVydHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYmFja2dyb3VuZDtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IEJhY2tncm91bmQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5iYWNrZ3JvdW5kUHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IGJhY2tncm91bmQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5CYWNrZ3JvdW5kLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBzZXQgYmFja2dyb3VuZCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5CYWNrZ3JvdW5kLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHByb3RlY3RlZCBzaGFkb3dQcm9wZXJ0eSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zaGFkb3c7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGdldCBTaGFkb3coKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zaGFkb3dQcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBnZXQgc2hhZG93KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuU2hhZG93LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBzZXQgc2hhZG93KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlNoYWRvdy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cblxuICAgICAgICBnZXQgRHJhZ2dhYmxlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RyYWdnYWJsZTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgZHJhZ2dhYmxlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRHJhZ2dhYmxlLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBkcmFnZ2FibGUodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuRHJhZ2dhYmxlLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgX29uQ2hpbGRBZGRlZChjaGlsZDogQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgaWYgKGNoaWxkICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hpbGQuZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBfb25DaGlsZFJlbW92ZWQoY2hpbGQ6IEFDb21wb25lbnQsIGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmIChjaGlsZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNoaWxkKGNoaWxkLmVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgX29uQ2hpbGRyZW5DbGVhcmVkKCkge1xuICAgICAgICAgICAgdmFyIHJvb3QgPSB0aGlzLmVsZW1lbnQ7XG4gICAgICAgICAgICB2YXIgZSA9IHRoaXMuZWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICAgICAgICAgIHdoaWxlIChlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICByb290LnJlbW92ZUNoaWxkKGUpO1xuICAgICAgICAgICAgICAgIGUgPSByb290LmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgb25MYXlvdXQoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy53aWR0aCAhPSBudWxsICYmIHRoaXMuaGVpZ2h0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNpemUodGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgbWF4VyA9IDA7XG4gICAgICAgICAgICAgICAgdmFyIG1heEggPSAwO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbl9pbm5lci5zaXplKCk7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29tcG9uZW50ID0gdGhpcy5jaGlsZHJlbl9pbm5lci5nZXQoaSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjVyA9IGNvbXBvbmVudC5ib3VuZHNXaWR0aCArIGNvbXBvbmVudC5ib3VuZHNMZWZ0ICsgY29tcG9uZW50LnRyYW5zbGF0ZVg7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjSCA9IGNvbXBvbmVudC5ib3VuZHNIZWlnaHQgKyBjb21wb25lbnQuYm91bmRzVG9wICsgY29tcG9uZW50LnRyYW5zbGF0ZVk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNXID4gbWF4Vykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF4VyA9IGNXO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNIID4gbWF4SCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF4SCA9IGNIO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMud2lkdGggIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBtYXhXID0gdGhpcy5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGVpZ2h0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF4SCA9IHRoaXMuaGVpZ2h0O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U2l6ZShtYXhXLCBtYXhIKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG59XG5cblxuIiwibW9kdWxlIGN1YmVlIHtcbiAgICBcbiAgICBleHBvcnQgY2xhc3MgQVZpZXc8VD4gZXh0ZW5kcyBBVXNlckNvbnRyb2wge1xuICAgICAgICBcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBfbW9kZWw6IFQpIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGdldCBtb2RlbCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tb2RlbDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG4gICAgXG59XG5cbiIsIm1vZHVsZSBjdWJlZSB7XG5cbiAgICBleHBvcnQgY2xhc3MgUGFuZWwgZXh0ZW5kcyBBVXNlckNvbnRyb2wge1xuICAgICAgICBcbiAgICAgICAgcHJvdGVjdGVkIHdpZHRoUHJvcGVydHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIud2lkdGhQcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIGdldCBXaWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLndpZHRoUHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgd2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5XaWR0aC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgd2lkdGgodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuV2lkdGgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcHJvdGVjdGVkIGhlaWdodFByb3BlcnR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmhlaWdodFByb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IEhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhlaWdodFByb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkhlaWdodC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgaGVpZ2h0KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkhlaWdodC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cblxuICAgICAgICBwcm90ZWN0ZWQgYmFja2dyb3VuZFByb3BlcnR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmJhY2tncm91bmRQcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIGdldCBCYWNrZ3JvdW5kKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYmFja2dyb3VuZFByb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJhY2tncm91bmQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5CYWNrZ3JvdW5kLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBiYWNrZ3JvdW5kKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkJhY2tncm91bmQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcHJvdGVjdGVkIHNoYWRvd1Byb3BlcnR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLnNoYWRvd1Byb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IFNoYWRvdygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNoYWRvd1Byb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHNoYWRvdygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlNoYWRvdy52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgc2hhZG93KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlNoYWRvdy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgXG4gICAgICAgIHB1YmxpYyBnZXQgY2hpbGRyZW4oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbl9pbm5lcjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG5cbn1cbiIsIm1vZHVsZSBjdWJlZSB7XG5cbiAgICBleHBvcnQgY2xhc3MgSEJveCBleHRlbmRzIEFMYXlvdXQge1xuXG4gICAgICAgIHByaXZhdGUgX2hlaWdodCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2NlbGxXaWR0aHM6IG51bWJlcltdID0gW107XG4gICAgICAgIHByaXZhdGUgX2hBbGlnbnM6IEVIQWxpZ25bXSA9IFtdO1xuICAgICAgICBwcml2YXRlIF92QWxpZ25zOiBFVkFsaWduW10gPSBbXTtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgIHRoaXMucG9pbnRlclRyYW5zcGFyZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX2hlaWdodC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzZXRDZWxsV2lkdGgoaW5kZXhPckNvbXBvbmVudDogbnVtYmVyIHwgQUNvbXBvbmVudCwgY2VsbEhlaWdodDogbnVtYmVyKSB7XG4gICAgICAgICAgICBpZiAoaW5kZXhPckNvbXBvbmVudCBpbnN0YW5jZW9mIEFDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldENlbGxXaWR0aCh0aGlzLmNoaWxkcmVuX2lubmVyLmluZGV4T2YoaW5kZXhPckNvbXBvbmVudCksIGNlbGxIZWlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZXRJbkxpc3QodGhpcy5fY2VsbFdpZHRocywgPG51bWJlcj5pbmRleE9yQ29tcG9uZW50LCBjZWxsSGVpZ2h0KTtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldENlbGxXaWR0aChpbmRleE9yQ29tcG9uZW50OiBudW1iZXIgfCBBQ29tcG9uZW50KTogbnVtYmVyIHtcbiAgICAgICAgICAgIGlmIChpbmRleE9yQ29tcG9uZW50IGluc3RhbmNlb2YgQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldENlbGxXaWR0aCh0aGlzLmNoaWxkcmVuX2lubmVyLmluZGV4T2YoaW5kZXhPckNvbXBvbmVudCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RnJvbUxpc3QodGhpcy5fY2VsbFdpZHRocywgPG51bWJlcj5pbmRleE9yQ29tcG9uZW50KTtcbiAgICB9XG4gICAgXG4gICAgcHVibGljIHNldENlbGxIQWxpZ24oaW5kZXhPckNvbXBvbmVudDogbnVtYmVyIHwgQUNvbXBvbmVudCwgaEFsaWduOiBFSEFsaWduKSB7XG4gICAgICAgICAgICBpZiAoaW5kZXhPckNvbXBvbmVudCBpbnN0YW5jZW9mIEFDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldENlbGxIQWxpZ24odGhpcy5jaGlsZHJlbl9pbm5lci5pbmRleE9mKGluZGV4T3JDb21wb25lbnQpLCBoQWxpZ24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZXRJbkxpc3QodGhpcy5faEFsaWducywgPG51bWJlcj5pbmRleE9yQ29tcG9uZW50LCBoQWxpZ24pO1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgIH1cblxuICAgIHB1YmxpYyBnZXRDZWxsSEFsaWduKGluZGV4T3JDb21wb25lbnQ6IG51bWJlciB8IEFDb21wb25lbnQpOiBFSEFsaWduIHtcbiAgICAgICAgICAgIGlmIChpbmRleE9yQ29tcG9uZW50IGluc3RhbmNlb2YgQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldENlbGxIQWxpZ24odGhpcy5jaGlsZHJlbl9pbm5lci5pbmRleE9mKGluZGV4T3JDb21wb25lbnQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEZyb21MaXN0KHRoaXMuX2hBbGlnbnMsIDxudW1iZXI+aW5kZXhPckNvbXBvbmVudCk7XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBzZXRDZWxsVkFsaWduKGluZGV4T3JDb21wb25lbnQ6IG51bWJlciB8IEFDb21wb25lbnQsIHZBbGlnbjogRVZBbGlnbikge1xuICAgICAgICAgICAgaWYgKGluZGV4T3JDb21wb25lbnQgaW5zdGFuY2VvZiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRDZWxsVkFsaWduKHRoaXMuY2hpbGRyZW5faW5uZXIuaW5kZXhPZihpbmRleE9yQ29tcG9uZW50KSwgdkFsaWduKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2V0SW5MaXN0KHRoaXMuX3ZBbGlnbnMsIDxudW1iZXI+aW5kZXhPckNvbXBvbmVudCwgdkFsaWduKTtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Q2VsbFZBbGlnbihpbmRleE9yQ29tcG9uZW50OiBudW1iZXIgfCBBQ29tcG9uZW50KTogRVZBbGlnbiB7XG4gICAgICAgICAgICBpZiAoaW5kZXhPckNvbXBvbmVudCBpbnN0YW5jZW9mIEFDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRDZWxsVkFsaWduKHRoaXMuY2hpbGRyZW5faW5uZXIuaW5kZXhPZihpbmRleE9yQ29tcG9uZW50KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRGcm9tTGlzdCh0aGlzLl92QWxpZ25zLCA8bnVtYmVyPmluZGV4T3JDb21wb25lbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRMYXN0Q2VsbEhBbGlnbihoQWxpZ246IEVIQWxpZ24pIHtcbiAgICAgICAgdGhpcy5zZXRDZWxsSEFsaWduKHRoaXMuY2hpbGRyZW5faW5uZXIuc2l6ZSgpIC0gMSwgaEFsaWduKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0TGFzdENlbGxWQWxpZ24odkFsaWduOiBFVkFsaWduKSB7XG4gICAgICAgIHRoaXMuc2V0Q2VsbFZBbGlnbih0aGlzLmNoaWxkcmVuX2lubmVyLnNpemUoKSAtIDEsIHZBbGlnbik7XG4gICAgfVxuXG4gICAgcHVibGljIHNldExhc3RDZWxsV2lkdGgod2lkdGg6IG51bWJlcikge1xuICAgICAgICB0aGlzLnNldENlbGxXaWR0aCh0aGlzLmNoaWxkcmVuX2lubmVyLnNpemUoKSAtIDEsIHdpZHRoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkRW1wdHlDZWxsKHdpZHRoOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5jaGlsZHJlbl9pbm5lci5hZGQobnVsbCk7XG4gICAgICAgIHRoaXMuc2V0Q2VsbFdpZHRoKHRoaXMuY2hpbGRyZW5faW5uZXIuc2l6ZSgpIC0gMSwgd2lkdGgpO1xuICAgIH1cblxuICAgIF9vbkNoaWxkQWRkZWQoY2hpbGQ6IEFDb21wb25lbnQpIHtcbiAgICAgICAgaWYgKGNoaWxkICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChjaGlsZC5lbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICB9XG5cbiAgICBfb25DaGlsZFJlbW92ZWQoY2hpbGQ6IEFDb21wb25lbnQsIGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKGNoaWxkICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDaGlsZChjaGlsZC5lbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbW92ZUZyb21MaXN0KHRoaXMuX2hBbGlnbnMsIGluZGV4KTtcbiAgICAgICAgdGhpcy5yZW1vdmVGcm9tTGlzdCh0aGlzLl92QWxpZ25zLCBpbmRleCk7XG4gICAgICAgIHRoaXMucmVtb3ZlRnJvbUxpc3QodGhpcy5fY2VsbFdpZHRocywgaW5kZXgpO1xuICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICB9XG5cbiAgICBfb25DaGlsZHJlbkNsZWFyZWQoKSB7XG4gICAgICAgIGxldCByb290ID0gdGhpcy5lbGVtZW50O1xuICAgICAgICBsZXQgZSA9IHRoaXMuZWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICAgICAgd2hpbGUgKGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgcm9vdC5yZW1vdmVDaGlsZChlKTtcbiAgICAgICAgICAgIGUgPSByb290LmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2hBbGlnbnMgPSBbXTtcbiAgICAgICAgdGhpcy5fdkFsaWducyA9IFtdO1xuICAgICAgICB0aGlzLl9jZWxsV2lkdGhzID0gW107XG4gICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBvbkxheW91dCgpIHtcbiAgICAgICAgdmFyIG1heEhlaWdodCA9IC0xO1xuICAgICAgICBpZiAodGhpcy5oZWlnaHQgIT0gbnVsbCkge1xuICAgICAgICAgICAgbWF4SGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYWN0VyA9IDA7XG4gICAgICAgIHZhciBtYXhIID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLnNpemUoKTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY2hpbGRYID0gMDtcbiAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuY2hpbGRyZW4uZ2V0KGkpO1xuICAgICAgICAgICAgbGV0IGNlbGxXID0gdGhpcy5nZXRDZWxsV2lkdGgoaSk7XG4gICAgICAgICAgICBsZXQgaEFsaWduID0gdGhpcy5nZXRDZWxsSEFsaWduKGkpO1xuICAgICAgICAgICAgbGV0IHJlYWxDZWxsVyA9IC0xO1xuICAgICAgICAgICAgaWYgKGNlbGxXICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZWFsQ2VsbFcgPSBjZWxsVztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNoaWxkID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVhbENlbGxXID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBhY3RXICs9IHJlYWxDZWxsVztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vY2hpbGQubGF5b3V0KCk7XG4gICAgICAgICAgICAgICAgbGV0IGN3ID0gY2hpbGQuYm91bmRzV2lkdGg7XG4gICAgICAgICAgICAgICAgbGV0IGNoID0gY2hpbGQuYm91bmRzSGVpZ2h0O1xuICAgICAgICAgICAgICAgIGxldCBjbCA9IGNoaWxkLnRyYW5zbGF0ZVg7XG4gICAgICAgICAgICAgICAgbGV0IGN0ID0gY2hpbGQudHJhbnNsYXRlWTtcbiAgICAgICAgICAgICAgICBsZXQgY2FsY3VsYXRlZENlbGxXID0gcmVhbENlbGxXO1xuICAgICAgICAgICAgICAgIGlmIChjYWxjdWxhdGVkQ2VsbFcgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGF0ZWRDZWxsVyA9IGN3ICsgY2w7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjYWxjdWxhdGVkQ2VsbFcgPCBjdykge1xuICAgICAgICAgICAgICAgICAgICBjYWxjdWxhdGVkQ2VsbFcgPSBjdztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjaGlsZFggPSBhY3RXIC0gY2hpbGQudHJhbnNsYXRlWDtcblxuICAgICAgICAgICAgICAgIGlmIChoQWxpZ24gPT0gRUhBbGlnbi5DRU5URVIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRYICs9IChjYWxjdWxhdGVkQ2VsbFcgLSBjdykgLyAyO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaEFsaWduID09IEVIQWxpZ24uUklHSFQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRYICs9IChjYWxjdWxhdGVkQ2VsbFcgLSBjdyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNoaWxkLl9zZXRMZWZ0KGNoaWxkWCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoY2ggKyBjdCA+IG1heEgpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF4SCA9IGNoICsgY3Q7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFjdFcgKz0gY2FsY3VsYXRlZENlbGxXO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlYWxIZWlnaHQgPSBtYXhIO1xuICAgICAgICBpZiAobWF4SGVpZ2h0ID4gLTEpIHtcbiAgICAgICAgICAgIHJlYWxIZWlnaHQgPSBtYXhIZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLnNpemUoKTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY2hpbGRZID0gMDtcbiAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuY2hpbGRyZW4uZ2V0KGkpO1xuICAgICAgICAgICAgaWYgKGNoaWxkID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCB2QWxpZ24gPSB0aGlzLmdldENlbGxWQWxpZ24oaSk7XG4gICAgICAgICAgICBsZXQgY2ggPSBjaGlsZC5ib3VuZHNIZWlnaHQ7XG4gICAgICAgICAgICBpZiAodkFsaWduID09IEVWQWxpZ24uTUlERExFKSB7XG4gICAgICAgICAgICAgICAgY2hpbGRZICs9IChyZWFsSGVpZ2h0IC0gY2gpIC8gMjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodkFsaWduID09IEVWQWxpZ24uQk9UVE9NKSB7XG4gICAgICAgICAgICAgICAgY2hpbGRZICs9IChyZWFsSGVpZ2h0IC0gY2gpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjaGlsZC5fc2V0VG9wKGNoaWxkWSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFNpemUoYWN0VywgcmVhbEhlaWdodCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRJbkxpc3Q8VD4obGlzdDogVFtdLCBpbmRleDogbnVtYmVyLCB2YWx1ZTogVCkge1xuICAgICAgICB3aGlsZSAobGlzdC5sZW5ndGggPCBpbmRleCkge1xuICAgICAgICAgICAgbGlzdC5wdXNoKG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIGxpc3RbaW5kZXhdID0gdmFsdWU7XG4gICAgfVxuXG4gICAgICAgIHByaXZhdGUgZ2V0RnJvbUxpc3Q8VD4obGlzdDogVFtdLCBpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIGlmIChsaXN0Lmxlbmd0aCA+IGluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm4gbGlzdFtpbmRleF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgICAgIHByaXZhdGUgcmVtb3ZlRnJvbUxpc3Q8VD4obGlzdDogVFtdLCBpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIGlmIChsaXN0Lmxlbmd0aCA+IGluZGV4KSB7XG4gICAgICAgICAgICBsaXN0LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgY2hpbGRyZW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuX2lubmVyO1xuICAgIH1cbiAgICBcbiAgICBnZXQgSGVpZ2h0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xuICAgIH1cbiAgICBnZXQgaGVpZ2h0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5IZWlnaHQudmFsdWU7XG4gICAgfVxuICAgIHNldCBoZWlnaHQodmFsdWUpIHtcbiAgICAgICAgdGhpcy5IZWlnaHQudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG5cblxufVxuICAgIFxufVxuXG4iLCJtb2R1bGUgY3ViZWUge1xuXG4gICAgZXhwb3J0IGNsYXNzIFZCb3ggZXh0ZW5kcyBBTGF5b3V0IHtcblxuICAgICAgICBwcml2YXRlIF93aWR0aCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIC8vcHJpdmF0ZSBmaW5hbCBBcnJheUxpc3Q8RWxlbWVudD4gd3JhcHBpbmdQYW5lbHMgPSBuZXcgQXJyYXlMaXN0PEVsZW1lbnQ+KCk7XG4gICAgICAgIHByaXZhdGUgX2NlbGxIZWlnaHRzOiBudW1iZXJbXSA9IFtdO1xuICAgICAgICBwcml2YXRlIF9oQWxpZ25zOiBFSEFsaWduW10gPSBbXTtcbiAgICAgICAgcHJpdmF0ZSBfdkFsaWduczogRVZBbGlnbltdID0gW107XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICB0aGlzLnBvaW50ZXJUcmFuc3BhcmVudCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLl93aWR0aC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuX2lubmVyO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0Q2VsbEhlaWdodChpbmRleE9yQ29tcG9uZW50OiBudW1iZXIgfCBBQ29tcG9uZW50LCBjZWxsSGVpZ2h0OiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmIChpbmRleE9yQ29tcG9uZW50IGluc3RhbmNlb2YgQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q2VsbEhlaWdodCh0aGlzLmNoaWxkcmVuLmluZGV4T2YoPEFDb21wb25lbnQ+aW5kZXhPckNvbXBvbmVudCksIGNlbGxIZWlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZXRJbkxpc3QodGhpcy5fY2VsbEhlaWdodHMsIDxudW1iZXI+aW5kZXhPckNvbXBvbmVudCwgY2VsbEhlaWdodCk7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc2V0SW5MaXN0PFQ+KGxpc3Q6IFRbXSwgaW5kZXg6IG51bWJlciwgdmFsdWU6IFQpIHtcbiAgICAgICAgICAgIHdoaWxlIChsaXN0Lmxlbmd0aCA8IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgbGlzdC5wdXNoKG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGlzdFtpbmRleF0gPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgZ2V0RnJvbUxpc3Q8VD4obGlzdDogVFtdLCBpbmRleDogbnVtYmVyKSB7XG4gICAgICAgICAgICBpZiAobGlzdC5sZW5ndGggPiBpbmRleCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsaXN0W2luZGV4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSByZW1vdmVGcm9tTGlzdDxUPihsaXN0OiBUW10sIGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmIChsaXN0Lmxlbmd0aCA+IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgbGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldENlbGxIZWlnaHQoaW5kZXhPckNvbXBvbmVudDogbnVtYmVyIHwgQUNvbXBvbmVudCk6IG51bWJlciB7XG4gICAgICAgICAgICBpZiAoaW5kZXhPckNvbXBvbmVudCBpbnN0YW5jZW9mIEFDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRDZWxsSGVpZ2h0KHRoaXMuY2hpbGRyZW4uaW5kZXhPZihpbmRleE9yQ29tcG9uZW50KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmdldEZyb21MaXN0KHRoaXMuX2NlbGxIZWlnaHRzLCA8bnVtYmVyPmluZGV4T3JDb21wb25lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHNldENlbGxIQWxpZ24oaW5kZXhPckNvbXBvbmVudDogbnVtYmVyIHwgQUNvbXBvbmVudCwgaEFsaWduOiBFSEFsaWduKSB7XG4gICAgICAgICAgICBpZiAoaW5kZXhPckNvbXBvbmVudCBpbnN0YW5jZW9mIEFDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldENlbGxIQWxpZ24odGhpcy5jaGlsZHJlbi5pbmRleE9mKGluZGV4T3JDb21wb25lbnQpLCBoQWxpZ24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZXRJbkxpc3QodGhpcy5faEFsaWducywgPG51bWJlcj5pbmRleE9yQ29tcG9uZW50LCBoQWxpZ24pO1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0Q2VsbEhBbGlnbihpbmRleE9yQ29tcG9uZW50OiBudW1iZXIgfCBBQ29tcG9uZW50KTogRUhBbGlnbiB7XG4gICAgICAgICAgICBpZiAoaW5kZXhPckNvbXBvbmVudCBpbnN0YW5jZW9mIEFDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRDZWxsSEFsaWduKHRoaXMuY2hpbGRyZW4uaW5kZXhPZihpbmRleE9yQ29tcG9uZW50KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRGcm9tTGlzdCh0aGlzLl9oQWxpZ25zLCA8bnVtYmVyPmluZGV4T3JDb21wb25lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHNldENlbGxWQWxpZ24oaW5kZXhPckNvbXBvbmVudDogbnVtYmVyIHwgQUNvbXBvbmVudCwgdkFsaWduOiBFVkFsaWduKSB7XG4gICAgICAgICAgICBpZiAoaW5kZXhPckNvbXBvbmVudCBpbnN0YW5jZW9mIEFDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldENlbGxWQWxpZ24odGhpcy5jaGlsZHJlbi5pbmRleE9mKGluZGV4T3JDb21wb25lbnQpLCB2QWxpZ24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZXRJbkxpc3QodGhpcy5fdkFsaWducywgPG51bWJlcj5pbmRleE9yQ29tcG9uZW50LCB2QWxpZ24pO1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRDZWxsVkFsaWduKGluZGV4T3JDb21wb25lbnQ6IG51bWJlciB8IEFDb21wb25lbnQpOiBFVkFsaWduIHtcbiAgICAgICAgaWYgKGluZGV4T3JDb21wb25lbnQgaW5zdGFuY2VvZiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRDZWxsVkFsaWduKHRoaXMuY2hpbGRyZW4uaW5kZXhPZihpbmRleE9yQ29tcG9uZW50KSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nZXRGcm9tTGlzdCh0aGlzLl92QWxpZ25zLCA8bnVtYmVyPmluZGV4T3JDb21wb25lbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRMYXN0Q2VsbEhBbGlnbihoQWxpZ246IEVIQWxpZ24pIHtcbiAgICAgICAgdGhpcy5zZXRDZWxsSEFsaWduKHRoaXMuY2hpbGRyZW4uc2l6ZSgpIC0gMSwgaEFsaWduKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0TGFzdENlbGxWQWxpZ24odkFsaWduOiBFVkFsaWduKSB7XG4gICAgICAgIHRoaXMuc2V0Q2VsbFZBbGlnbih0aGlzLmNoaWxkcmVuLnNpemUoKSAtIDEsIHZBbGlnbik7XG4gICAgfVxuXG4gICAgcHVibGljIHNldExhc3RDZWxsSGVpZ2h0KGhlaWdodDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuc2V0Q2VsbEhlaWdodCh0aGlzLmNoaWxkcmVuLnNpemUoKSAtIDEsIGhlaWdodCk7XG4gICAgfVxuXG4gICAgcHVibGljIGFkZEVtcHR5Q2VsbChoZWlnaHQ6IG51bWJlcikge1xuICAgICAgICB0aGlzLmNoaWxkcmVuLmFkZChudWxsKTtcbiAgICAgICAgdGhpcy5zZXRDZWxsSGVpZ2h0KHRoaXMuY2hpbGRyZW4uc2l6ZSgpIC0gMSwgaGVpZ2h0KTtcbiAgICB9XG4gICAgXG4gICAgZ2V0IFdpZHRoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XG4gICAgfVxuICAgIGdldCB3aWR0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuV2lkdGgudmFsdWU7XG4gICAgfVxuICAgIHNldCB3aWR0aCh2YWx1ZSkge1xuICAgICAgICB0aGlzLldpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgfVxuXG4gICAgcHVibGljIF9vbkNoaWxkQWRkZWQoY2hpbGQ6IEFDb21wb25lbnQpIHtcbiAgICAgICAgaWYgKGNoaWxkICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChjaGlsZC5lbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgX29uQ2hpbGRSZW1vdmVkKGNoaWxkOiBBQ29tcG9uZW50LCBpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIGlmIChjaGlsZCAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2hpbGQoY2hpbGQuZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZW1vdmVGcm9tTGlzdCh0aGlzLl9oQWxpZ25zLCBpbmRleCk7XG4gICAgICAgIHRoaXMucmVtb3ZlRnJvbUxpc3QodGhpcy5fdkFsaWducywgaW5kZXgpO1xuICAgICAgICB0aGlzLnJlbW92ZUZyb21MaXN0KHRoaXMuX2NlbGxIZWlnaHRzLCBpbmRleCk7XG4gICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBfb25DaGlsZHJlbkNsZWFyZWQoKSB7XG4gICAgICAgIHZhciByb290ID0gdGhpcy5lbGVtZW50O1xuICAgICAgICB2YXIgZSA9IHRoaXMuZWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICAgICAgd2hpbGUgKGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgcm9vdC5yZW1vdmVDaGlsZChlKTtcbiAgICAgICAgICAgIGUgPSByb290LmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2hBbGlnbnMgPSBbXTtcbiAgICAgICAgdGhpcy5fdkFsaWducyA9IFtdO1xuICAgICAgICB0aGlzLl9jZWxsSGVpZ2h0cyA9IFtdO1xuICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgb25MYXlvdXQoKSB7XG4gICAgICAgIHZhciBtYXhXaWR0aCA9IC0xO1xuICAgICAgICBpZiAodGhpcy53aWR0aCAhPSBudWxsKSB7XG4gICAgICAgICAgICBtYXhXaWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYWN0SCA9IDA7XG4gICAgICAgIHZhciBtYXhXID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLnNpemUoKTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY2hpbGRZID0gMDtcbiAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuY2hpbGRyZW4uZ2V0KGkpO1xuICAgICAgICAgICAgbGV0IGNlbGxIID0gdGhpcy5nZXRDZWxsSGVpZ2h0KGkpO1xuICAgICAgICAgICAgbGV0IHZBbGlnbiA9IHRoaXMuZ2V0Q2VsbFZBbGlnbihpKTtcbiAgICAgICAgICAgIGxldCByZWFsQ2VsbEggPSAtMTtcbiAgICAgICAgICAgIGlmIChjZWxsSCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmVhbENlbGxIID0gY2VsbEg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjaGlsZCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlYWxDZWxsSCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgYWN0SCArPSByZWFsQ2VsbEg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL2NoaWxkLmxheW91dCgpO1xuICAgICAgICAgICAgICAgIGxldCBjdyA9IGNoaWxkLmJvdW5kc1dpZHRoO1xuICAgICAgICAgICAgICAgIGxldCBjaCA9IGNoaWxkLmJvdW5kc0hlaWdodDtcbiAgICAgICAgICAgICAgICBsZXQgY2wgPSBjaGlsZC50cmFuc2xhdGVYO1xuICAgICAgICAgICAgICAgIGxldCBjdCA9IGNoaWxkLnRyYW5zbGF0ZVk7XG4gICAgICAgICAgICAgICAgbGV0IGNhbGN1bGF0ZWRDZWxsSCA9IHJlYWxDZWxsSDtcbiAgICAgICAgICAgICAgICBpZiAoY2FsY3VsYXRlZENlbGxIIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICBjYWxjdWxhdGVkQ2VsbEggPSBjaCArIGN0O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2FsY3VsYXRlZENlbGxIIDwgY2gpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXRlZENlbGxIID0gY2g7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY2hpbGRZID0gYWN0SCAtIGNoaWxkLnRyYW5zbGF0ZVk7XG5cbiAgICAgICAgICAgICAgICBpZiAodkFsaWduID09IEVWQWxpZ24uTUlERExFKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkWSArPSAoY2FsY3VsYXRlZENlbGxIIC0gY2gpIC8gMjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZBbGlnbiA9PSBFVkFsaWduLkJPVFRPTSkge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZFkgKz0gKGNhbGN1bGF0ZWRDZWxsSCAtIGNoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2hpbGQuX3NldFRvcChjaGlsZFkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGN3ICsgY2wgPiBtYXhXKSB7XG4gICAgICAgICAgICAgICAgICAgIG1heFcgPSBjdyArIGNsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhY3RIICs9IGNhbGN1bGF0ZWRDZWxsSDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZWFsV2lkdGggPSBtYXhXO1xuICAgICAgICBpZiAobWF4V2lkdGggPiAtMSkge1xuICAgICAgICAgICAgcmVhbFdpZHRoID0gbWF4V2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLnNpemUoKTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY2hpbGRYID0gMDtcbiAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuY2hpbGRyZW4uZ2V0KGkpO1xuICAgICAgICAgICAgaWYgKGNoaWxkID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBoQWxpZ24gPSB0aGlzLmdldENlbGxIQWxpZ24oaSk7XG4gICAgICAgICAgICBsZXQgY3cgPSBjaGlsZC5ib3VuZHNXaWR0aDtcbiAgICAgICAgICAgIGlmIChoQWxpZ24gPT0gRUhBbGlnbi5DRU5URVIpIHtcbiAgICAgICAgICAgICAgICBjaGlsZFggPSAocmVhbFdpZHRoIC0gY3cpIC8gMjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaEFsaWduID09IEVIQWxpZ24uUklHSFQpIHtcbiAgICAgICAgICAgICAgICBjaGlsZFggPSAocmVhbFdpZHRoIC0gY3cpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjaGlsZC5fc2V0TGVmdChjaGlsZFgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRTaXplKHJlYWxXaWR0aCwgYWN0SCk7XG4gICAgfVxuXG5cblxufVxuICAgIFxufVxuXG5cbiIsIm1vZHVsZSBjdWJlZSB7XG5cbiAgICBleHBvcnQgY2xhc3MgU2Nyb2xsQm94IGV4dGVuZHMgQVVzZXJDb250cm9sIHtcblxuICAgICAgICBwcml2YXRlIF9jb250ZW50ID0gbmV3IFByb3BlcnR5PEFDb21wb25lbnQ+KG51bGwpO1xuICAgICAgICBwcml2YXRlIF9oU2Nyb2xsUG9saWN5ID0gbmV3IFByb3BlcnR5PEVTY3JvbGxCYXJQb2xpY3k+KEVTY3JvbGxCYXJQb2xpY3kuQVVUTywgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF92U2Nyb2xsUG9saWN5ID0gbmV3IFByb3BlcnR5PEVTY3JvbGxCYXJQb2xpY3k+KEVTY3JvbGxCYXJQb2xpY3kuQVVUTywgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9zY3JvbGxXaWR0aCA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgIHByaXZhdGUgX3Njcm9sbEhlaWdodCA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgIHByaXZhdGUgX2hTY3JvbGxQb3MgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIHRydWUpO1xuICAgICAgICBwcml2YXRlIF92U2Nyb2xsUG9zID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgcHJpdmF0ZSBfbWF4SFNjcm9sbFBvcyA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgIHByaXZhdGUgX21heFZTY3JvbGxQb3MgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIHRydWUpO1xuICAgICAgICBwcml2YXRlIF9tYXhIU2Nyb2xsUG9zV3JpdGVyID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX21heFZTY3JvbGxQb3NXcml0ZXIgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIGZhbHNlKTtcblxuICAgICAgICBwcml2YXRlIF9jYWxjdWxhdGVTY3JvbGxXaWR0aEV4cCA9IG5ldyBFeHByZXNzaW9uPG51bWJlcj4oKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuY29udGVudCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb250ZW50LmJvdW5kc1dpZHRoO1xuICAgICAgICB9LCB0aGlzLl9jb250ZW50KTtcbiAgICAgICAgcHJpdmF0ZSBfY2FsY3VsYXRlU2Nyb2xsSGVpZ2h0RXhwID0gbmV3IEV4cHJlc3Npb248bnVtYmVyPigoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5jb250ZW50ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQuYm91bmRzSGVpZ2h0O1xuICAgICAgICB9LCB0aGlzLl9jb250ZW50KTtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJvdmVyZmxvd1wiKTtcblxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsV2lkdGguaW5pdFJlYWRvbmx5QmluZCh0aGlzLl9jYWxjdWxhdGVTY3JvbGxXaWR0aEV4cCk7XG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxIZWlnaHQuaW5pdFJlYWRvbmx5QmluZCh0aGlzLl9jYWxjdWxhdGVTY3JvbGxIZWlnaHRFeHApO1xuXG4gICAgICAgICAgICB0aGlzLl9tYXhIU2Nyb2xsUG9zLmluaXRSZWFkb25seUJpbmQodGhpcy5fbWF4SFNjcm9sbFBvc1dyaXRlcik7XG4gICAgICAgICAgICB0aGlzLl9tYXhWU2Nyb2xsUG9zLmluaXRSZWFkb25seUJpbmQodGhpcy5fbWF4VlNjcm9sbFBvc1dyaXRlcik7XG5cbiAgICAgICAgICAgIHRoaXMuX21heEhTY3JvbGxQb3NXcml0ZXIuYmluZChuZXcgRXhwcmVzc2lvbjxudW1iZXI+KCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKHRoaXMuc2Nyb2xsV2lkdGggLSB0aGlzLmNsaWVudFdpZHRoKTtcbiAgICAgICAgICAgIH0sIHRoaXMuQ2xpZW50V2lkdGgsIHRoaXMuX3Njcm9sbFdpZHRoKSk7XG5cbiAgICAgICAgICAgIHRoaXMuX21heFZTY3JvbGxQb3NXcml0ZXIuYmluZChuZXcgRXhwcmVzc2lvbjxudW1iZXI+KCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKHRoaXMuc2Nyb2xsSGVpZ2h0IC0gdGhpcy5jbGllbnRIZWlnaHQpO1xuICAgICAgICAgICAgfSwgdGhpcy5DbGllbnRIZWlnaHQsIHRoaXMuX3Njcm9sbEhlaWdodCkpO1xuXG4gICAgICAgICAgICB0aGlzLl9jb250ZW50LmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuX2lubmVyLmNsZWFyKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsY3VsYXRlU2Nyb2xsV2lkdGhFeHAudW5iaW5kQWxsKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsY3VsYXRlU2Nyb2xsV2lkdGhFeHAuYmluZCh0aGlzLl9jb250ZW50KTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb250ZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FsY3VsYXRlU2Nyb2xsV2lkdGhFeHAuYmluZCh0aGlzLmNvbnRlbnQuQm91bmRzV2lkdGgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZVNjcm9sbEhlaWdodEV4cC51bmJpbmRBbGwoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxjdWxhdGVTY3JvbGxIZWlnaHRFeHAuYmluZCh0aGlzLl9jb250ZW50KTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb250ZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FsY3VsYXRlU2Nyb2xsSGVpZ2h0RXhwLmJpbmQodGhpcy5jb250ZW50LkJvdW5kc0hlaWdodCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29udGVudCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5faW5uZXIuYWRkKHRoaXMuY29udGVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIChldnQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmhTY3JvbGxQb3MgPSB0aGlzLmVsZW1lbnQuc2Nyb2xsTGVmdDtcbiAgICAgICAgICAgICAgICB0aGlzLnZTY3JvbGxQb3MgPSB0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuX2hTY3JvbGxQb3MuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zY3JvbGxMZWZ0ID0gdGhpcy5oU2Nyb2xsUG9zO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9oU2Nyb2xsUG9zLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wID0gdGhpcy52U2Nyb2xsUG9zO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuX2hTY3JvbGxQb2xpY3kuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhTY3JvbGxQb2xpY3kgPT0gRVNjcm9sbEJhclBvbGljeS5BVVRPKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vdmVyZmxvd1ggPSBcImF1dG9cIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaFNjcm9sbFBvbGljeSA9PSBFU2Nyb2xsQmFyUG9saWN5LkhJRERFTikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUub3ZlcmZsb3dYID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaFNjcm9sbFBvbGljeSA9PSBFU2Nyb2xsQmFyUG9saWN5LlZJU0lCTEUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93WCA9IFwic2Nyb2xsXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9oU2Nyb2xsUG9saWN5LmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3ZTY3JvbGxQb2xpY3kuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnZTY3JvbGxQb2xpY3kgPT0gRVNjcm9sbEJhclBvbGljeS5BVVRPKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vdmVyZmxvd1kgPSBcImF1dG9cIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudlNjcm9sbFBvbGljeSA9PSBFU2Nyb2xsQmFyUG9saWN5LkhJRERFTikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUub3ZlcmZsb3dZID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudlNjcm9sbFBvbGljeSA9PSBFU2Nyb2xsQmFyUG9saWN5LlZJU0lCTEUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93WSA9IFwic2Nyb2xsXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl92U2Nyb2xsUG9saWN5LmludmFsaWRhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCB3aWR0aFByb3BlcnR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLndpZHRoUHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy53aWR0aFByb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuV2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHdpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLldpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHByb3RlY3RlZCBoZWlnaHRQcm9wZXJ0eSgpIHtcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5oZWlnaHRQcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIGdldCBIZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oZWlnaHRQcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIGdldCBoZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5IZWlnaHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGhlaWdodCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5IZWlnaHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgZ2V0IENvbnRlbnQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY29udGVudDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgY29udGVudCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkNvbnRlbnQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGNvbnRlbnQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQ29udGVudC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEhTY3JvbGxQb2xpY3koKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faFNjcm9sbFBvbGljeTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgaFNjcm9sbFBvbGljeSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkhTY3JvbGxQb2xpY3kudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGhTY3JvbGxQb2xpY3kodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuSFNjcm9sbFBvbGljeS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFZTY3JvbGxQb2xpY3koKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdlNjcm9sbFBvbGljeTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdlNjcm9sbFBvbGljeSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlZTY3JvbGxQb2xpY3kudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHZTY3JvbGxQb2xpY3kodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVlNjcm9sbFBvbGljeS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFNjcm9sbFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbFdpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGdldCBzY3JvbGxXaWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlNjcm9sbFdpZHRoLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBzY3JvbGxXaWR0aCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5TY3JvbGxXaWR0aC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFNjcm9sbEhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxIZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHNjcm9sbEhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlNjcm9sbEhlaWdodC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgc2Nyb2xsSGVpZ2h0KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlNjcm9sbEhlaWdodC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEhTY3JvbGxQb3MoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faFNjcm9sbFBvcztcbiAgICAgICAgfVxuICAgICAgICBnZXQgaFNjcm9sbFBvcygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkhTY3JvbGxQb3MudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGhTY3JvbGxQb3ModmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuSFNjcm9sbFBvcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFZTY3JvbGxQb3MoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdlNjcm9sbFBvcztcbiAgICAgICAgfVxuICAgICAgICBnZXQgdlNjcm9sbFBvcygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlZTY3JvbGxQb3MudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHZTY3JvbGxQb3ModmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVlNjcm9sbFBvcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IE1heEhTY3JvbGxQb3MoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbWF4SFNjcm9sbFBvcztcbiAgICAgICAgfVxuICAgICAgICBnZXQgbWF4SFNjcm9sbFBvcygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLk1heEhTY3JvbGxQb3MudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IG1heEhTY3JvbGxQb3ModmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuTWF4SFNjcm9sbFBvcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IE1heFZTY3JvbGxQb3MoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbWF4VlNjcm9sbFBvcztcbiAgICAgICAgfVxuICAgICAgICBnZXQgbWF4VlNjcm9sbFBvcygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLk1heFZTY3JvbGxQb3MudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IG1heFZTY3JvbGxQb3ModmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuTWF4VlNjcm9sbFBvcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn1cblxuXG4iLCJtb2R1bGUgY3ViZWUge1xuXG4gICAgZXhwb3J0IGNsYXNzIExhYmVsIGV4dGVuZHMgQUNvbXBvbmVudCB7XG5cbiAgICAgICAgcHJpdmF0ZSBfd2lkdGggPSBuZXcgTnVtYmVyUHJvcGVydHkobnVsbCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9oZWlnaHQgPSBuZXcgTnVtYmVyUHJvcGVydHkobnVsbCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF90ZXh0ID0gbmV3IFN0cmluZ1Byb3BlcnR5KFwiXCIsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3RleHRPdmVyZmxvdyA9IG5ldyBQcm9wZXJ0eTxFVGV4dE92ZXJmbG93PihFVGV4dE92ZXJmbG93LkNMSVAsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2ZvcmVDb2xvciA9IG5ldyBDb2xvclByb3BlcnR5KENvbG9yLkJMQUNLLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3RleHRBbGlnbiA9IG5ldyBQcm9wZXJ0eTxFVGV4dEFsaWduPihFVGV4dEFsaWduLkxFRlQsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3ZlcnRpY2FsQWxpZ24gPSBuZXcgUHJvcGVydHk8RVZBbGlnbj4oRVZBbGlnbi5UT1AsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2JvbGQgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9pdGFsaWMgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF91bmRlcmxpbmUgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9mb250U2l6ZSA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgxMiwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfZm9udEZhbWlseSA9IG5ldyBQcm9wZXJ0eTxGb250RmFtaWx5PihGb250RmFtaWx5LkFyaWFsLCBmYWxzZSwgZmFsc2UpO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSk7XG4gICAgICAgICAgICB0aGlzLl93aWR0aC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMud2lkdGggPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2hpdGVTcGFjZSA9IFwibm93cmFwXCI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vdmVyZmxvd1ggPSBcInZpc2libGVcIjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwid2lkdGhcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLndoaXRlU3BhY2UgPSBcIm5vcm1hbFwiO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUub3ZlcmZsb3dYID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLndpZHRoID0gdGhpcy53aWR0aCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3dpZHRoLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2hlaWdodC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGVpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiaGVpZ2h0XCIpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vdmVyZmxvd1kgPSBcInZpc2libGVcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHQgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vdmVyZmxvd1kgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5faGVpZ2h0LmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3RleHQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSB0aGlzLnRleHQ7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdGV4dC5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl90ZXh0T3ZlcmZsb3cuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudGV4dE92ZXJmbG93LmFwcGx5KHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudGV4dE92ZXJmbG93ID09IEVUZXh0T3ZlcmZsb3cuRUxMSVBTSVMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLndoaXRlU3BhY2UgPSBcIm5vd3JhcFwiO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcIndoaXRlU3BhY2VcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3dpZHRoLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faGVpZ2h0LmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3RleHRPdmVyZmxvdy5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9mb3JlQ29sb3IuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZvcmVDb2xvciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5jb2xvciA9IFwicmdiYSgwLDAsMCwwLjApXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmNvbG9yID0gdGhpcy5mb3JlQ29sb3IudG9DU1MoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2ZvcmVDb2xvci5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl90ZXh0QWxpZ24uYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudGV4dEFsaWduLmFwcGx5KHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3RleHRBbGlnbi5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl92ZXJ0aWNhbEFsaWduLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdGEgPSB0aGlzLnZlcnRpY2FsQWxpZ247XG4gICAgICAgICAgICAgICAgaWYgKHRhID09IEVWQWxpZ24uVE9QKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52ZXJ0aWNhbEFsaWduID0gXCJ0b3BcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRhID09IEVWQWxpZ24uTUlERExFKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52ZXJ0aWNhbEFsaWduID0gXCJtaWRkbGVcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRhID09IEVWQWxpZ24uQk9UVE9NKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52ZXJ0aWNhbEFsaWduID0gXCJib3R0b21cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRpY2FsQWxpZ24uaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fdW5kZXJsaW5lLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy51bmRlcmxpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRleHREZWNvcmF0aW9uID0gXCJ1bmRlcmxpbmVcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudGV4dERlY29yYXRpb24gPSBcIm5vbmVcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3VuZGVybGluZS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9ib2xkLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ib2xkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250V2VpZ2h0ID0gXCJib2xkXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZvbnRXZWlnaHQgPSBcIm5vcm1hbFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fYm9sZC5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9pdGFsaWMuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLml0YWxpYykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFN0eWxlID0gXCJpdGFsaWNcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFN0eWxlID0gXCJub3JtYWxcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2l0YWxpYy5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9mb250U2l6ZS5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZvbnRTaXplID0gdGhpcy5mb250U2l6ZSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZm9udFNpemUuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fZm9udEZhbWlseS5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5mb250RmFtaWx5LmFwcGx5KHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2ZvbnRGYW1pbHkuaW52YWxpZGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGdldCB3aWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLldpZHRoLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB3aWR0aCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5XaWR0aC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cblxuICAgICAgICBnZXQgSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgaGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuSGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBoZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuSGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVGV4dCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZXh0O1xuICAgICAgICB9XG4gICAgICAgIGdldCB0ZXh0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVGV4dC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdGV4dCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5UZXh0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVGV4dE92ZXJmbG93KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RleHRPdmVyZmxvdztcbiAgICAgICAgfVxuICAgICAgICBnZXQgdGV4dE92ZXJmbG93KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVGV4dE92ZXJmbG93LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0ZXh0T3ZlcmZsb3codmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVGV4dE92ZXJmbG93LnZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLlBhZGRpbmdcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBGb3JlQ29sb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9yZUNvbG9yO1xuICAgICAgICB9XG4gICAgICAgIGdldCBmb3JlQ29sb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Gb3JlQ29sb3IudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGZvcmVDb2xvcih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Gb3JlQ29sb3IudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBWZXJ0aWNhbEFsaWduKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZlcnRpY2FsQWxpZ247XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHZlcnRpY2FsQWxpZ24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5WZXJ0aWNhbEFsaWduLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB2ZXJ0aWNhbEFsaWduKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlZlcnRpY2FsQWxpZ24udmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBCb2xkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvbGQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJvbGQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Cb2xkLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBib2xkKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkJvbGQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBJdGFsaWMoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faXRhbGljO1xuICAgICAgICB9XG4gICAgICAgIGdldCBpdGFsaWMoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5JdGFsaWMudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGl0YWxpYyh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5JdGFsaWMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBVbmRlcmxpbmUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdW5kZXJsaW5lO1xuICAgICAgICB9XG4gICAgICAgIGdldCB1bmRlcmxpbmUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5VbmRlcmxpbmUudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHVuZGVybGluZSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5VbmRlcmxpbmUudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUZXh0QWxpZ24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGV4dEFsaWduO1xuICAgICAgICB9XG4gICAgICAgIGdldCB0ZXh0QWxpZ24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UZXh0QWxpZ24udmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHRleHRBbGlnbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5UZXh0QWxpZ24udmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBGb250U2l6ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb250U2l6ZTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgZm9udFNpemUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Gb250U2l6ZS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgZm9udFNpemUodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuRm9udFNpemUudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBGb250RmFtaWx5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvbnRGYW1pbHk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGZvbnRGYW1pbHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Gb250RmFtaWx5LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBmb250RmFtaWx5KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkZvbnRGYW1pbHkudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG59XG5cblxuIiwibW9kdWxlIGN1YmVlIHtcbiAgICBcbiAgICBleHBvcnQgY2xhc3MgQnV0dG9uIGV4dGVuZHMgQUNvbXBvbmVudCB7XG4gICAgICAgIFxuICAgICAgICBwcml2YXRlIF93aWR0aCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2hlaWdodCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3RleHQgPSBuZXcgU3RyaW5nUHJvcGVydHkoXCJcIiwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdGV4dE92ZXJmbG93ID0gbmV3IFByb3BlcnR5PEVUZXh0T3ZlcmZsb3c+KEVUZXh0T3ZlcmZsb3cuQ0xJUCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfZm9yZUNvbG9yID0gbmV3IENvbG9yUHJvcGVydHkoQ29sb3IuQkxBQ0ssIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdGV4dEFsaWduID0gbmV3IFByb3BlcnR5PEVUZXh0QWxpZ24+KEVUZXh0QWxpZ24uQ0VOVEVSLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF92ZXJ0aWNhbEFsaWduID0gbmV3IFByb3BlcnR5PEVWQWxpZ24+KEVWQWxpZ24uTUlERExFLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9ib2xkID0gbmV3IEJvb2xlYW5Qcm9wZXJ0eShmYWxzZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfaXRhbGljID0gbmV3IEJvb2xlYW5Qcm9wZXJ0eShmYWxzZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdW5kZXJsaW5lID0gbmV3IEJvb2xlYW5Qcm9wZXJ0eShmYWxzZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfZm9udFNpemUgPSBuZXcgTnVtYmVyUHJvcGVydHkoMTIsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2ZvbnRGYW1pbHkgPSBuZXcgUHJvcGVydHk8Rm9udEZhbWlseT4oRm9udEZhbWlseS5BcmlhbCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYmFja2dyb3VuZCA9IG5ldyBCYWNrZ3JvdW5kUHJvcGVydHkobmV3IENvbG9yQmFja2dyb3VuZChDb2xvci5UUkFOU1BBUkVOVCksIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfc2hhZG93ID0gbmV3IFByb3BlcnR5PEJveFNoYWRvdz4obnVsbCwgdHJ1ZSwgZmFsc2UpO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKSk7XG4gICAgICAgICAgICB0aGlzLnBhZGRpbmcgPSBQYWRkaW5nLmNyZWF0ZSgxMCk7XG4gICAgICAgICAgICB0aGlzLl93aWR0aC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMud2lkdGggPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2hpdGVTcGFjZSA9IFwibm93cmFwXCI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vdmVyZmxvd1ggPSBcInZpc2libGVcIjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwid2lkdGhcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLndoaXRlU3BhY2UgPSBcIm5vcm1hbFwiO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUub3ZlcmZsb3dYID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLndpZHRoID0gdGhpcy53aWR0aCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3dpZHRoLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2hlaWdodC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGVpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiaGVpZ2h0XCIpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vdmVyZmxvd1kgPSBcInZpc2libGVcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHQgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vdmVyZmxvd1kgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5faGVpZ2h0LmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3RleHQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSB0aGlzLnRleHQ7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdGV4dC5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl90ZXh0T3ZlcmZsb3cuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudGV4dE92ZXJmbG93LmFwcGx5KHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudGV4dE92ZXJmbG93ID09IEVUZXh0T3ZlcmZsb3cuRUxMSVBTSVMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLndoaXRlU3BhY2UgPSBcIm5vd3JhcFwiO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcIndoaXRlU3BhY2VcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3dpZHRoLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faGVpZ2h0LmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3RleHRPdmVyZmxvdy5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9mb3JlQ29sb3IuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZvcmVDb2xvciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5jb2xvciA9IFwicmdiYSgwLDAsMCwwLjApXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmNvbG9yID0gdGhpcy5mb3JlQ29sb3IudG9DU1MoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2ZvcmVDb2xvci5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl90ZXh0QWxpZ24uYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudGV4dEFsaWduLmFwcGx5KHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3RleHRBbGlnbi5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl92ZXJ0aWNhbEFsaWduLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdGEgPSB0aGlzLnZlcnRpY2FsQWxpZ247XG4gICAgICAgICAgICAgICAgaWYgKHRhID09IEVWQWxpZ24uVE9QKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52ZXJ0aWNhbEFsaWduID0gXCJ0b3BcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRhID09IEVWQWxpZ24uTUlERExFKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52ZXJ0aWNhbEFsaWduID0gXCJtaWRkbGVcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRhID09IEVWQWxpZ24uQk9UVE9NKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52ZXJ0aWNhbEFsaWduID0gXCJib3R0b21cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRpY2FsQWxpZ24uaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fdW5kZXJsaW5lLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy51bmRlcmxpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRleHREZWNvcmF0aW9uID0gXCJ1bmRlcmxpbmVcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudGV4dERlY29yYXRpb24gPSBcIm5vbmVcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3VuZGVybGluZS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9ib2xkLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ib2xkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250V2VpZ2h0ID0gXCJib2xkXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZvbnRXZWlnaHQgPSBcIm5vcm1hbFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fYm9sZC5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9pdGFsaWMuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLml0YWxpYykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFN0eWxlID0gXCJpdGFsaWNcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFN0eWxlID0gXCJub3JtYWxcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2l0YWxpYy5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9mb250U2l6ZS5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZvbnRTaXplID0gdGhpcy5mb250U2l6ZSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZm9udFNpemUuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fZm9udEZhbWlseS5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5mb250RmFtaWx5LmFwcGx5KHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2ZvbnRGYW1pbHkuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYmFja2dyb3VuZENvbG9yXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImJhY2tncm91bmRJbWFnZVwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJiYWNrZ3JvdW5kXCIpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9iYWNrZ3JvdW5kLnZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZC52YWx1ZS5hcHBseSh0aGlzLmVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZC5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9zaGFkb3cuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zaGFkb3cudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJib3hTaGFkb3dcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhZG93LnZhbHVlLmFwcGx5KHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuYm9yZGVyID0gQm9yZGVyLmNyZWF0ZSgxLCBDb2xvci5MSUdIVF9HUkFZLCAyKTtcbiAgICAgICAgICAgIHRoaXMuZm9udFNpemUgPSAxNDtcbiAgICAgICAgICAgIHRoaXMuYm9sZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmJhY2tncm91bmQgPSBuZXcgQ29sb3JCYWNrZ3JvdW5kKENvbG9yLldISVRFKTtcbiAgICAgICAgICAgIHRoaXMuc2hhZG93ID0gbmV3IEJveFNoYWRvdygxLCAxLCA1LCAwLCBDb2xvci5MSUdIVF9HUkFZLCBmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuV2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHdpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLldpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGdldCBIZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGdldCBoZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5IZWlnaHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGhlaWdodCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5IZWlnaHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUZXh0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RleHQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRleHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UZXh0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0ZXh0KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRleHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUZXh0T3ZlcmZsb3coKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGV4dE92ZXJmbG93O1xuICAgICAgICB9XG4gICAgICAgIGdldCB0ZXh0T3ZlcmZsb3coKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UZXh0T3ZlcmZsb3cudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHRleHRPdmVyZmxvdyh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5UZXh0T3ZlcmZsb3cudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuUGFkZGluZ1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEZvcmVDb2xvcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb3JlQ29sb3I7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGZvcmVDb2xvcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkZvcmVDb2xvci52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgZm9yZUNvbG9yKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkZvcmVDb2xvci52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFZlcnRpY2FsQWxpZ24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmVydGljYWxBbGlnbjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdmVydGljYWxBbGlnbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlZlcnRpY2FsQWxpZ24udmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHZlcnRpY2FsQWxpZ24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVmVydGljYWxBbGlnbi52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEJvbGQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYm9sZDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm9sZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkJvbGQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGJvbGQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQm9sZC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEl0YWxpYygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pdGFsaWM7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGl0YWxpYygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkl0YWxpYy52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgaXRhbGljKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkl0YWxpYy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFVuZGVybGluZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl91bmRlcmxpbmU7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHVuZGVybGluZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlVuZGVybGluZS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdW5kZXJsaW5lKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlVuZGVybGluZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFRleHRBbGlnbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZXh0QWxpZ247XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRleHRBbGlnbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlRleHRBbGlnbi52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdGV4dEFsaWduKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRleHRBbGlnbi52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEZvbnRTaXplKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvbnRTaXplO1xuICAgICAgICB9XG4gICAgICAgIGdldCBmb250U2l6ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkZvbnRTaXplLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBmb250U2l6ZSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Gb250U2l6ZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEZvbnRGYW1pbHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9udEZhbWlseTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgZm9udEZhbWlseSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkZvbnRGYW1pbHkudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGZvbnRGYW1pbHkodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuRm9udEZhbWlseS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBnZXQgQmFja2dyb3VuZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9iYWNrZ3JvdW5kO1xuICAgICAgICB9XG4gICAgICAgIGdldCBiYWNrZ3JvdW5kKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQmFja2dyb3VuZC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYmFja2dyb3VuZCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5CYWNrZ3JvdW5kLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgU2hhZG93KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NoYWRvdztcbiAgICAgICAgfVxuICAgICAgICBnZXQgc2hhZG93KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuU2hhZG93LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBzaGFkb3codmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuU2hhZG93LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuXG4gICAgfVxuICAgIFxufVxuXG5cbiIsIm1vZHVsZSBjdWJlZSB7XG5cbiAgICBleHBvcnQgY2xhc3MgVGV4dEJveCBleHRlbmRzIEFDb21wb25lbnQge1xuXG4gICAgICAgIHByaXZhdGUgX3dpZHRoID0gbmV3IE51bWJlclByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfaGVpZ2h0ID0gbmV3IE51bWJlclByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdGV4dCA9IG5ldyBTdHJpbmdQcm9wZXJ0eShcIlwiLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9iYWNrZ3JvdW5kID0gbmV3IEJhY2tncm91bmRQcm9wZXJ0eShuZXcgQ29sb3JCYWNrZ3JvdW5kKENvbG9yLldISVRFKSwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9mb3JlQ29sb3IgPSBuZXcgQ29sb3JQcm9wZXJ0eShDb2xvci5CTEFDSywgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF90ZXh0QWxpZ24gPSBuZXcgUHJvcGVydHk8RVRleHRBbGlnbj4oRVRleHRBbGlnbi5MRUZULCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF92ZXJ0aWNhbEFsaWduID0gbmV3IFByb3BlcnR5PEVWQWxpZ24+KEVWQWxpZ24uVE9QLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9ib2xkID0gbmV3IEJvb2xlYW5Qcm9wZXJ0eShmYWxzZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfaXRhbGljID0gbmV3IEJvb2xlYW5Qcm9wZXJ0eShmYWxzZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdW5kZXJsaW5lID0gbmV3IEJvb2xlYW5Qcm9wZXJ0eShmYWxzZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfZm9udFNpemUgPSBuZXcgTnVtYmVyUHJvcGVydHkoMTIsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2ZvbnRGYW1pbHkgPSBuZXcgUHJvcGVydHk8Rm9udEZhbWlseT4oRm9udEZhbWlseS5BcmlhbCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfcGxhY2Vob2xkZXIgPSBuZXcgU3RyaW5nUHJvcGVydHkobnVsbCwgdHJ1ZSk7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIikpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJ0ZXh0XCIpO1xuXG4gICAgICAgICAgICB0aGlzLmJvcmRlciA9IEJvcmRlci5jcmVhdGUoMSwgQ29sb3IuTElHSFRfR1JBWSwgMCk7XG4gICAgICAgICAgICB0aGlzLl93aWR0aC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMud2lkdGggPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJ3aWR0aFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2lkdGggPSB0aGlzLndpZHRoICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5faGVpZ2h0LmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oZWlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJoZWlnaHRcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmhlaWdodCA9IHRoaXMuaGVpZ2h0ICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdGV4dC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudGV4dCAhPSB0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKFwidmFsdWVcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIHRoaXMudGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9mb3JlQ29sb3IuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZvcmVDb2xvciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5jb2xvciA9IFwicmdiYSgwLDAsMCwgMC4wKVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5jb2xvciA9IHRoaXMuZm9yZUNvbG9yLnRvQ1NTKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9mb3JlQ29sb3IuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fdGV4dEFsaWduLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRBbGlnbi5hcHBseSh0aGlzLmVsZW1lbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl90ZXh0QWxpZ24uaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fdmVydGljYWxBbGlnbi5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHRhID0gdGhpcy52ZXJ0aWNhbEFsaWduO1xuICAgICAgICAgICAgICAgIGlmICh0YSA9PSBFVkFsaWduLlRPUCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmVydGljYWxBbGlnbiA9IFwidG9wXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0YSA9PSBFVkFsaWduLk1JRERMRSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmVydGljYWxBbGlnbiA9IFwibWlkZGxlXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0YSA9PSBFVkFsaWduLkJPVFRPTSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmVydGljYWxBbGlnbiA9IFwiYm90dG9tXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl92ZXJ0aWNhbEFsaWduLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3VuZGVybGluZS5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudW5kZXJsaW5lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50ZXh0RGVjb3JhdGlvbiA9IFwidW5kZXJsaW5lXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRleHREZWNvcmF0aW9uID0gXCJub25lXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl91bmRlcmxpbmUuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fYm9sZC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYm9sZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFdlaWdodCA9IFwiYm9sZFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250V2VpZ2h0ID0gXCJub3JtYWxcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2JvbGQuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5faXRhbGljLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pdGFsaWMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZvbnRTdHlsZSA9IFwiaXRhbGljXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZvbnRTdHlsZSA9IFwibm9ybWFsXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9pdGFsaWMuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fZm9udFNpemUuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250U2l6ZSA9IHRoaXMuZm9udFNpemUgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2ZvbnRTaXplLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2ZvbnRGYW1pbHkuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZm9udEZhbWlseS5hcHBseSh0aGlzLmVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9mb250RmFtaWx5LmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2JhY2tncm91bmQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJhY2tncm91bmQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJiYWNrZ3JvdW5kQ29sb3JcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImJhY2tncm91bmRJbWFnZVwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJhY2tncm91bmQuYXBwbHkodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2JhY2tncm91bmQuaW52YWxpZGF0ZSgpO1xuXG4gICAgICAgICAgICB0aGlzLl9wbGFjZWhvbGRlci5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGxhY2Vob2xkZXIgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcInBsYWNlaG9sZGVyXCIsIHRoaXMucGxhY2Vob2xkZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGdldCB3aWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLldpZHRoLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB3aWR0aCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5XaWR0aC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkhlaWdodC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgaGVpZ2h0KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkhlaWdodC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFRleHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGV4dDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdGV4dCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlRleHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHRleHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVGV4dC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEJhY2tncm91bmQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYmFja2dyb3VuZDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYmFja2dyb3VuZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkJhY2tncm91bmQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGJhY2tncm91bmQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQmFja2dyb3VuZC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEZvcmVDb2xvcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb3JlQ29sb3I7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGZvcmVDb2xvcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkZvcmVDb2xvci52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgZm9yZUNvbG9yKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkZvcmVDb2xvci52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFRleHRBbGlnbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZXh0QWxpZ247XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRleHRBbGlnbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlRleHRBbGlnbi52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdGV4dEFsaWduKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRleHRBbGlnbi52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFZlcnRpY2FsQWxpZ24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmVydGljYWxBbGlnbjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdmVydGljYWxBbGlnbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlZlcnRpY2FsQWxpZ24udmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHZlcnRpY2FsQWxpZ24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVmVydGljYWxBbGlnbi52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEJvbGQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYm9sZDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm9sZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkJvbGQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGJvbGQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQm9sZC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEl0YWxpYygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pdGFsaWM7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGl0YWxpYygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkl0YWxpYy52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgaXRhbGljKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkl0YWxpYy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFVuZGVybGluZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl91bmRlcmxpbmU7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHVuZGVybGluZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlVuZGVybGluZS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdW5kZXJsaW5lKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlVuZGVybGluZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEZvbnRTaXplKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvbnRTaXplO1xuICAgICAgICB9XG4gICAgICAgIGdldCBmb250U2l6ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkZvbnRTaXplLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBmb250U2l6ZSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Gb250U2l6ZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEZvbnRGYW1pbHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9udEZhbWlseTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgZm9udEZhbWlseSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkZvbnRGYW1pbHkudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGZvbnRGYW1pbHkodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuRm9udEZhbWlseS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFBsYWNlaG9sZGVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BsYWNlaG9sZGVyO1xuICAgICAgICB9XG4gICAgICAgIGdldCBwbGFjZWhvbGRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlBsYWNlaG9sZGVyLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBwbGFjZWhvbGRlcih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5QbGFjZWhvbGRlci52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn1cblxuXG4iLCJtb2R1bGUgY3ViZWUge1xuXG4gICAgZXhwb3J0IGNsYXNzIFBhc3N3b3JkQm94IGV4dGVuZHMgQUNvbXBvbmVudCB7XG5cbiAgICAgICAgcHJpdmF0ZSBfd2lkdGggPSBuZXcgTnVtYmVyUHJvcGVydHkobnVsbCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9oZWlnaHQgPSBuZXcgTnVtYmVyUHJvcGVydHkobnVsbCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF90ZXh0ID0gbmV3IFN0cmluZ1Byb3BlcnR5KFwiXCIsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2JhY2tncm91bmQgPSBuZXcgQmFja2dyb3VuZFByb3BlcnR5KG5ldyBDb2xvckJhY2tncm91bmQoQ29sb3IuV0hJVEUpLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2ZvcmVDb2xvciA9IG5ldyBDb2xvclByb3BlcnR5KENvbG9yLkJMQUNLLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3RleHRBbGlnbiA9IG5ldyBQcm9wZXJ0eTxFVGV4dEFsaWduPihFVGV4dEFsaWduLkxFRlQsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3ZlcnRpY2FsQWxpZ24gPSBuZXcgUHJvcGVydHk8RVZBbGlnbj4oRVZBbGlnbi5UT1AsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2JvbGQgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9pdGFsaWMgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF91bmRlcmxpbmUgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9mb250U2l6ZSA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgxMiwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfZm9udEZhbWlseSA9IG5ldyBQcm9wZXJ0eTxGb250RmFtaWx5PihGb250RmFtaWx5LkFyaWFsLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9wbGFjZWhvbGRlciA9IG5ldyBTdHJpbmdQcm9wZXJ0eShudWxsLCB0cnVlKTtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKSk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInBhc3N3b3JkXCIpO1xuXG4gICAgICAgICAgICB0aGlzLmJvcmRlciA9IEJvcmRlci5jcmVhdGUoMSwgQ29sb3IuTElHSFRfR1JBWSwgMCk7XG4gICAgICAgICAgICB0aGlzLl93aWR0aC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMud2lkdGggPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJ3aWR0aFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2lkdGggPSB0aGlzLndpZHRoICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5faGVpZ2h0LmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oZWlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJoZWlnaHRcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmhlaWdodCA9IHRoaXMuaGVpZ2h0ICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdGV4dC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudGV4dCAhPSB0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKFwidmFsdWVcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIHRoaXMudGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9mb3JlQ29sb3IuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZvcmVDb2xvciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5jb2xvciA9IFwicmdiYSgwLDAsMCwgMC4wKVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5jb2xvciA9IHRoaXMuZm9yZUNvbG9yLnRvQ1NTKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9mb3JlQ29sb3IuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fdGV4dEFsaWduLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRBbGlnbi5hcHBseSh0aGlzLmVsZW1lbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl90ZXh0QWxpZ24uaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fdmVydGljYWxBbGlnbi5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHRhID0gdGhpcy52ZXJ0aWNhbEFsaWduO1xuICAgICAgICAgICAgICAgIGlmICh0YSA9PSBFVkFsaWduLlRPUCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmVydGljYWxBbGlnbiA9IFwidG9wXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0YSA9PSBFVkFsaWduLk1JRERMRSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmVydGljYWxBbGlnbiA9IFwibWlkZGxlXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0YSA9PSBFVkFsaWduLkJPVFRPTSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudmVydGljYWxBbGlnbiA9IFwiYm90dG9tXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl92ZXJ0aWNhbEFsaWduLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3VuZGVybGluZS5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudW5kZXJsaW5lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50ZXh0RGVjb3JhdGlvbiA9IFwidW5kZXJsaW5lXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRleHREZWNvcmF0aW9uID0gXCJub25lXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl91bmRlcmxpbmUuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fYm9sZC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYm9sZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFdlaWdodCA9IFwiYm9sZFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250V2VpZ2h0ID0gXCJub3JtYWxcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2JvbGQuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5faXRhbGljLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pdGFsaWMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZvbnRTdHlsZSA9IFwiaXRhbGljXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZvbnRTdHlsZSA9IFwibm9ybWFsXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9pdGFsaWMuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fZm9udFNpemUuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250U2l6ZSA9IHRoaXMuZm9udFNpemUgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2ZvbnRTaXplLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2ZvbnRGYW1pbHkuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZm9udEZhbWlseS5hcHBseSh0aGlzLmVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9mb250RmFtaWx5LmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2JhY2tncm91bmQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJhY2tncm91bmQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJiYWNrZ3JvdW5kQ29sb3JcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImJhY2tncm91bmRJbWFnZVwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJhY2tncm91bmQuYXBwbHkodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2JhY2tncm91bmQuaW52YWxpZGF0ZSgpO1xuXG4gICAgICAgICAgICB0aGlzLl9wbGFjZWhvbGRlci5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGxhY2Vob2xkZXIgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcInBsYWNlaG9sZGVyXCIsIHRoaXMucGxhY2Vob2xkZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGdldCB3aWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLldpZHRoLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB3aWR0aCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5XaWR0aC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkhlaWdodC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgaGVpZ2h0KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkhlaWdodC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFRleHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGV4dDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdGV4dCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlRleHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHRleHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVGV4dC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEJhY2tncm91bmQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYmFja2dyb3VuZDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYmFja2dyb3VuZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkJhY2tncm91bmQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGJhY2tncm91bmQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQmFja2dyb3VuZC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEZvcmVDb2xvcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb3JlQ29sb3I7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGZvcmVDb2xvcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkZvcmVDb2xvci52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgZm9yZUNvbG9yKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkZvcmVDb2xvci52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFRleHRBbGlnbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZXh0QWxpZ247XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRleHRBbGlnbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlRleHRBbGlnbi52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdGV4dEFsaWduKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRleHRBbGlnbi52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFZlcnRpY2FsQWxpZ24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmVydGljYWxBbGlnbjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdmVydGljYWxBbGlnbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlZlcnRpY2FsQWxpZ24udmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHZlcnRpY2FsQWxpZ24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVmVydGljYWxBbGlnbi52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEJvbGQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYm9sZDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm9sZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkJvbGQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGJvbGQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQm9sZC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEl0YWxpYygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pdGFsaWM7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGl0YWxpYygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkl0YWxpYy52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgaXRhbGljKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkl0YWxpYy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFVuZGVybGluZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl91bmRlcmxpbmU7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHVuZGVybGluZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlVuZGVybGluZS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdW5kZXJsaW5lKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlVuZGVybGluZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEZvbnRTaXplKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvbnRTaXplO1xuICAgICAgICB9XG4gICAgICAgIGdldCBmb250U2l6ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkZvbnRTaXplLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBmb250U2l6ZSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Gb250U2l6ZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEZvbnRGYW1pbHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9udEZhbWlseTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgZm9udEZhbWlseSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkZvbnRGYW1pbHkudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGZvbnRGYW1pbHkodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuRm9udEZhbWlseS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFBsYWNlaG9sZGVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BsYWNlaG9sZGVyO1xuICAgICAgICB9XG4gICAgICAgIGdldCBwbGFjZWhvbGRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlBsYWNlaG9sZGVyLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBwbGFjZWhvbGRlcih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5QbGFjZWhvbGRlci52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn1cblxuXG4iLCJtb2R1bGUgY3ViZWUge1xuXG4gICAgZXhwb3J0IGNsYXNzIFRleHRBcmVhIGV4dGVuZHMgQUNvbXBvbmVudCB7XG5cbiAgICAgICAgcHJpdmF0ZSBfd2lkdGggPSBuZXcgTnVtYmVyUHJvcGVydHkobnVsbCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9oZWlnaHQgPSBuZXcgTnVtYmVyUHJvcGVydHkobnVsbCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF90ZXh0ID0gbmV3IFN0cmluZ1Byb3BlcnR5KFwiXCIsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2JhY2tncm91bmQgPSBuZXcgQmFja2dyb3VuZFByb3BlcnR5KG5ldyBDb2xvckJhY2tncm91bmQoQ29sb3IuV0hJVEUpLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2ZvcmVDb2xvciA9IG5ldyBDb2xvclByb3BlcnR5KENvbG9yLkJMQUNLLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3RleHRBbGlnbiA9IG5ldyBQcm9wZXJ0eTxFVGV4dEFsaWduPihFVGV4dEFsaWduLkxFRlQsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3ZlcnRpY2FsQWxpZ24gPSBuZXcgUHJvcGVydHk8RVZBbGlnbj4oRVZBbGlnbi5UT1AsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2JvbGQgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9pdGFsaWMgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF91bmRlcmxpbmUgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9mb250U2l6ZSA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgxMiwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfZm9udEZhbWlseSA9IG5ldyBQcm9wZXJ0eTxGb250RmFtaWx5PihGb250RmFtaWx5LkFyaWFsLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9wbGFjZWhvbGRlciA9IG5ldyBTdHJpbmdQcm9wZXJ0eShudWxsLCB0cnVlKTtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZXh0YXJlYVwiKSk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInRleHRcIik7XG5cbiAgICAgICAgICAgIHRoaXMuYm9yZGVyID0gQm9yZGVyLmNyZWF0ZSgxLCBDb2xvci5MSUdIVF9HUkFZLCAwKTtcbiAgICAgICAgICAgIHRoaXMuX3dpZHRoLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy53aWR0aCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcIndpZHRoXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aCA9IHRoaXMud2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9oZWlnaHQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhlaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImhlaWdodFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHQgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl90ZXh0LmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50ZXh0ICE9IHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgdGhpcy50ZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2ZvcmVDb2xvci5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9yZUNvbG9yID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmNvbG9yID0gXCJyZ2JhKDAsMCwwLCAwLjApXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmNvbG9yID0gdGhpcy5mb3JlQ29sb3IudG9DU1MoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2ZvcmVDb2xvci5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl90ZXh0QWxpZ24uYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudGV4dEFsaWduLmFwcGx5KHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3RleHRBbGlnbi5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl92ZXJ0aWNhbEFsaWduLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdGEgPSB0aGlzLnZlcnRpY2FsQWxpZ247XG4gICAgICAgICAgICAgICAgaWYgKHRhID09IEVWQWxpZ24uVE9QKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52ZXJ0aWNhbEFsaWduID0gXCJ0b3BcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRhID09IEVWQWxpZ24uTUlERExFKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52ZXJ0aWNhbEFsaWduID0gXCJtaWRkbGVcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRhID09IEVWQWxpZ24uQk9UVE9NKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52ZXJ0aWNhbEFsaWduID0gXCJib3R0b21cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRpY2FsQWxpZ24uaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fdW5kZXJsaW5lLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy51bmRlcmxpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRleHREZWNvcmF0aW9uID0gXCJ1bmRlcmxpbmVcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudGV4dERlY29yYXRpb24gPSBcIm5vbmVcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3VuZGVybGluZS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9ib2xkLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ib2xkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250V2VpZ2h0ID0gXCJib2xkXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZvbnRXZWlnaHQgPSBcIm5vcm1hbFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fYm9sZC5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9pdGFsaWMuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLml0YWxpYykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFN0eWxlID0gXCJpdGFsaWNcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFN0eWxlID0gXCJub3JtYWxcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2l0YWxpYy5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9mb250U2l6ZS5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZvbnRTaXplID0gdGhpcy5mb250U2l6ZSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZm9udFNpemUuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fZm9udEZhbWlseS5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5mb250RmFtaWx5LmFwcGx5KHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2ZvbnRGYW1pbHkuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYmFja2dyb3VuZCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImJhY2tncm91bmRDb2xvclwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYmFja2dyb3VuZEltYWdlXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZC5hcHBseSh0aGlzLmVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZC5pbnZhbGlkYXRlKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3BsYWNlaG9sZGVyLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wbGFjZWhvbGRlciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIiwgdGhpcy5wbGFjZWhvbGRlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuV2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHdpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLldpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgaGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuSGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBoZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuSGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVGV4dCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZXh0O1xuICAgICAgICB9XG4gICAgICAgIGdldCB0ZXh0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVGV4dC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdGV4dCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5UZXh0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQmFja2dyb3VuZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9iYWNrZ3JvdW5kO1xuICAgICAgICB9XG4gICAgICAgIGdldCBiYWNrZ3JvdW5kKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQmFja2dyb3VuZC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYmFja2dyb3VuZCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5CYWNrZ3JvdW5kLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgRm9yZUNvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvcmVDb2xvcjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgZm9yZUNvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRm9yZUNvbG9yLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBmb3JlQ29sb3IodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuRm9yZUNvbG9yLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVGV4dEFsaWduKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RleHRBbGlnbjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdGV4dEFsaWduKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVGV4dEFsaWduLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0ZXh0QWxpZ24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVGV4dEFsaWduLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVmVydGljYWxBbGlnbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92ZXJ0aWNhbEFsaWduO1xuICAgICAgICB9XG4gICAgICAgIGdldCB2ZXJ0aWNhbEFsaWduKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVmVydGljYWxBbGlnbi52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdmVydGljYWxBbGlnbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5WZXJ0aWNhbEFsaWduLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm9sZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib2xkO1xuICAgICAgICB9XG4gICAgICAgIGdldCBib2xkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm9sZC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYm9sZCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Cb2xkLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgSXRhbGljKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2l0YWxpYztcbiAgICAgICAgfVxuICAgICAgICBnZXQgaXRhbGljKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuSXRhbGljLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBpdGFsaWModmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuSXRhbGljLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVW5kZXJsaW5lKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3VuZGVybGluZTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdW5kZXJsaW5lKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVW5kZXJsaW5lLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB1bmRlcmxpbmUodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVW5kZXJsaW5lLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgRm9udFNpemUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9udFNpemU7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGZvbnRTaXplKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRm9udFNpemUudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGZvbnRTaXplKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkZvbnRTaXplLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgRm9udEZhbWlseSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb250RmFtaWx5O1xuICAgICAgICB9XG4gICAgICAgIGdldCBmb250RmFtaWx5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRm9udEZhbWlseS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgZm9udEZhbWlseSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Gb250RmFtaWx5LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgUGxhY2Vob2xkZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGxhY2Vob2xkZXI7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHBsYWNlaG9sZGVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuUGxhY2Vob2xkZXIudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHBsYWNlaG9sZGVyKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlBsYWNlaG9sZGVyLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuXG4gICAgfVxuXG59XG5cblxuIiwibW9kdWxlIGN1YmVlIHtcblxuICAgIGV4cG9ydCBjbGFzcyBDaGVja0JveCBleHRlbmRzIEFDb21wb25lbnQge1xuXG4gICAgICAgIHByaXZhdGUgX2NoZWNrZWQgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlLCBmYWxzZSk7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIikpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJjaGVja2JveFwiKTtcblxuICAgICAgICAgICAgdGhpcy5fY2hlY2tlZC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGU6IGFueSA9IHRoaXMuZWxlbWVudDtcbiAgICAgICAgICAgICAgICBlLmNoZWNrZWQgPSB0aGlzLmNoZWNrZWQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgZ2V0IENoZWNrZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hlY2tlZDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgY2hlY2tlZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkNoZWNrZWQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGNoZWNrZWQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQ2hlY2tlZC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn1cblxuXG4iLCJtb2R1bGUgY3ViZWUge1xuXG4gICAgZXhwb3J0IGNsYXNzIENvbWJvQm94PFQ+IGV4dGVuZHMgQUNvbXBvbmVudCB7XG5cbiAgICAgICAgcHJpdmF0ZSBfc2VsZWN0ZWRJbmRleCA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgtMSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfc2VsZWN0ZWRJdGVtID0gbmV3IFByb3BlcnR5PFQ+KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBpdGVtczogVFtdID0gW107XG4gICAgICAgIHByaXZhdGUgX3dpZHRoID0gbmV3IE51bWJlclByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfaGVpZ2h0ID0gbmV3IE51bWJlclByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdGV4dCA9IG5ldyBTdHJpbmdQcm9wZXJ0eShcIlwiLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9iYWNrZ3JvdW5kID0gbmV3IEJhY2tncm91bmRQcm9wZXJ0eShuZXcgQ29sb3JCYWNrZ3JvdW5kKENvbG9yLldISVRFKSwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9mb3JlQ29sb3IgPSBuZXcgQ29sb3JQcm9wZXJ0eShDb2xvci5CTEFDSywgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF90ZXh0QWxpZ24gPSBuZXcgUHJvcGVydHk8RVRleHRBbGlnbj4oRVRleHRBbGlnbi5MRUZULCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF92ZXJ0aWNhbEFsaWduID0gbmV3IFByb3BlcnR5PEVWQWxpZ24+KEVWQWxpZ24uVE9QLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9ib2xkID0gbmV3IEJvb2xlYW5Qcm9wZXJ0eShmYWxzZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfaXRhbGljID0gbmV3IEJvb2xlYW5Qcm9wZXJ0eShmYWxzZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdW5kZXJsaW5lID0gbmV3IEJvb2xlYW5Qcm9wZXJ0eShmYWxzZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfZm9udFNpemUgPSBuZXcgTnVtYmVyUHJvcGVydHkoMTIsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2ZvbnRGYW1pbHkgPSBuZXcgUHJvcGVydHk8Rm9udEZhbWlseT4oRm9udEZhbWlseS5BcmlhbCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfcGxhY2Vob2xkZXIgPSBuZXcgU3RyaW5nUHJvcGVydHkobnVsbCwgdHJ1ZSk7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIikpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJzZWxlY3RcIik7XG5cbiAgICAgICAgICAgIHRoaXMuYm9yZGVyID0gQm9yZGVyLmNyZWF0ZSgxLCBDb2xvci5MSUdIVF9HUkFZLCAwKTtcbiAgICAgICAgICAgIHRoaXMuX3dpZHRoLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy53aWR0aCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcIndpZHRoXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aCA9IHRoaXMud2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9oZWlnaHQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhlaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImhlaWdodFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHQgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl90ZXh0LmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50ZXh0ICE9IHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgdGhpcy50ZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2ZvcmVDb2xvci5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9yZUNvbG9yID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmNvbG9yID0gXCJyZ2JhKDAsMCwwLCAwLjApXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmNvbG9yID0gdGhpcy5mb3JlQ29sb3IudG9DU1MoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2ZvcmVDb2xvci5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl90ZXh0QWxpZ24uYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudGV4dEFsaWduLmFwcGx5KHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3RleHRBbGlnbi5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl92ZXJ0aWNhbEFsaWduLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdGEgPSB0aGlzLnZlcnRpY2FsQWxpZ247XG4gICAgICAgICAgICAgICAgaWYgKHRhID09IEVWQWxpZ24uVE9QKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52ZXJ0aWNhbEFsaWduID0gXCJ0b3BcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRhID09IEVWQWxpZ24uTUlERExFKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52ZXJ0aWNhbEFsaWduID0gXCJtaWRkbGVcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRhID09IEVWQWxpZ24uQk9UVE9NKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS52ZXJ0aWNhbEFsaWduID0gXCJib3R0b21cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRpY2FsQWxpZ24uaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fdW5kZXJsaW5lLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy51bmRlcmxpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRleHREZWNvcmF0aW9uID0gXCJ1bmRlcmxpbmVcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudGV4dERlY29yYXRpb24gPSBcIm5vbmVcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3VuZGVybGluZS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9ib2xkLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ib2xkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250V2VpZ2h0ID0gXCJib2xkXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZvbnRXZWlnaHQgPSBcIm5vcm1hbFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fYm9sZC5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9pdGFsaWMuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLml0YWxpYykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFN0eWxlID0gXCJpdGFsaWNcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFN0eWxlID0gXCJub3JtYWxcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2l0YWxpYy5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9mb250U2l6ZS5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZvbnRTaXplID0gdGhpcy5mb250U2l6ZSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZm9udFNpemUuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fZm9udEZhbWlseS5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5mb250RmFtaWx5LmFwcGx5KHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2ZvbnRGYW1pbHkuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYmFja2dyb3VuZCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImJhY2tncm91bmRDb2xvclwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYmFja2dyb3VuZEltYWdlXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZC5hcHBseSh0aGlzLmVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZC5pbnZhbGlkYXRlKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3BsYWNlaG9sZGVyLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wbGFjZWhvbGRlciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIiwgdGhpcy5wbGFjZWhvbGRlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdmFsID0gKDxIVE1MU2VsZWN0RWxlbWVudD50aGlzLmVsZW1lbnQpLnZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh2YWwgPT0gbnVsbCB8fCB2YWwgPT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZEluZGV4LnZhbHVlID0gLTE7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkSXRlbS52YWx1ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRJbmRleC52YWx1ZSA9IHBhcnNlSW50KHZhbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkSW5kZXguYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkSXRlbS5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9zZWxlY3RlZEl0ZW0udmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0gPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZEluZGV4LnZhbHVlID0gLTE7XG4gICAgICAgICAgICAgICAgICAgICg8SFRNTFNlbGVjdEVsZW1lbnQ+dGhpcy5lbGVtZW50KS52YWx1ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gLTE7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0gPT0gdGhpcy5pdGVtc1tpXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZEluZGV4LnZhbHVlID0gLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICAoPEhUTUxTZWxlY3RFbGVtZW50PnRoaXMuZWxlbWVudCkudmFsdWUgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRJbmRleC52YWx1ZSA9IGluZGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgKDxIVE1MU2VsZWN0RWxlbWVudD50aGlzLmVsZW1lbnQpLnZhbHVlID0gXCJcIiArIGluZGV4O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuV2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHdpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLldpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgaGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuSGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBoZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuSGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVGV4dCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZXh0O1xuICAgICAgICB9XG4gICAgICAgIGdldCB0ZXh0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVGV4dC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdGV4dCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5UZXh0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQmFja2dyb3VuZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9iYWNrZ3JvdW5kO1xuICAgICAgICB9XG4gICAgICAgIGdldCBiYWNrZ3JvdW5kKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQmFja2dyb3VuZC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYmFja2dyb3VuZCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5CYWNrZ3JvdW5kLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgRm9yZUNvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvcmVDb2xvcjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgZm9yZUNvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRm9yZUNvbG9yLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBmb3JlQ29sb3IodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuRm9yZUNvbG9yLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVGV4dEFsaWduKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RleHRBbGlnbjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdGV4dEFsaWduKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVGV4dEFsaWduLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0ZXh0QWxpZ24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVGV4dEFsaWduLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVmVydGljYWxBbGlnbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92ZXJ0aWNhbEFsaWduO1xuICAgICAgICB9XG4gICAgICAgIGdldCB2ZXJ0aWNhbEFsaWduKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVmVydGljYWxBbGlnbi52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdmVydGljYWxBbGlnbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5WZXJ0aWNhbEFsaWduLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm9sZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib2xkO1xuICAgICAgICB9XG4gICAgICAgIGdldCBib2xkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm9sZC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYm9sZCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Cb2xkLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgSXRhbGljKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2l0YWxpYztcbiAgICAgICAgfVxuICAgICAgICBnZXQgaXRhbGljKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuSXRhbGljLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBpdGFsaWModmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuSXRhbGljLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVW5kZXJsaW5lKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3VuZGVybGluZTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdW5kZXJsaW5lKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVW5kZXJsaW5lLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB1bmRlcmxpbmUodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVW5kZXJsaW5lLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgRm9udFNpemUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9udFNpemU7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGZvbnRTaXplKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRm9udFNpemUudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGZvbnRTaXplKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkZvbnRTaXplLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgRm9udEZhbWlseSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb250RmFtaWx5O1xuICAgICAgICB9XG4gICAgICAgIGdldCBmb250RmFtaWx5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRm9udEZhbWlseS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgZm9udEZhbWlseSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Gb250RmFtaWx5LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgUGxhY2Vob2xkZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGxhY2Vob2xkZXI7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHBsYWNlaG9sZGVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuUGxhY2Vob2xkZXIudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHBsYWNlaG9sZGVyKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlBsYWNlaG9sZGVyLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHByb3RlY3RlZCBzZWxlY3RlZEluZGV4UHJvcGVydHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRJbmRleDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgU2VsZWN0ZWRJbmRleCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkSW5kZXhQcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIGdldCBzZWxlY3RlZEluZGV4KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuU2VsZWN0ZWRJbmRleC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgc2VsZWN0ZWRJbmRleCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5TZWxlY3RlZEluZGV4LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHByb3RlY3RlZCBzZWxlY3RlZEl0ZW1Qcm9wZXJ0eSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZEl0ZW07XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IFNlbGVjdGVkSXRlbSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkSXRlbVByb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHNlbGVjdGVkSXRlbSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlNlbGVjdGVkSXRlbS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgc2VsZWN0ZWRJdGVtKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlNlbGVjdGVkSXRlbS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn1cblxuXG4iLCJtb2R1bGUgY3ViZWUge1xuXG4gICAgZXhwb3J0IGNsYXNzIFBpY3R1cmVCb3ggZXh0ZW5kcyBBQ29tcG9uZW50IHtcblxuICAgICAgICBwcml2YXRlIF93aWR0aCA9IG5ldyBOdW1iZXJQcm9wZXJ0eSg1MCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfaGVpZ2h0ID0gbmV3IE51bWJlclByb3BlcnR5KDUwLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9waWN0dXJlU2l6ZU1vZGUgPSBuZXcgUHJvcGVydHk8RVBpY3R1cmVTaXplTW9kZT4oRVBpY3R1cmVTaXplTW9kZS5OT1JNQUwsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2ltYWdlID0gbmV3IFByb3BlcnR5PEltYWdlPihudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2JhY2tncm91bmQgPSBuZXcgQmFja2dyb3VuZFByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfaW1nRWxlbWVudDogSFRNTEltYWdlRWxlbWVudCA9IG51bGw7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICB0aGlzLl9pbWdFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICAgICAgICAgIHRoaXMuX2ltZ0VsZW1lbnQuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5faW1nRWxlbWVudCk7XG4gICAgICAgICAgICB0aGlzLl93aWR0aC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWNhbGN1bGF0ZVNpemUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fd2lkdGguaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5faGVpZ2h0LmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlY2FsY3VsYXRlU2l6ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9oZWlnaHQuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fcGljdHVyZVNpemVNb2RlLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlY2FsY3VsYXRlU2l6ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9waWN0dXJlU2l6ZU1vZGUuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5faW1hZ2UuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pbWFnZS52YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2UuYXBwbHkodGhpcy5faW1nRWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5pbWFnZS5sb2FkZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2Uub25Mb2FkLmFkZExpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlY2FsY3VsYXRlU2l6ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbWdFbGVtZW50LnNldEF0dHJpYnV0ZShcInNyY1wiLCBcIlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZWNhbGN1bGF0ZVNpemUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5faW1hZ2UuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYmFja2dyb3VuZCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImJhY2tncm91bmRDb2xvclwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYmFja2dyb3VuZEltYWdlXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZC5hcHBseSh0aGlzLmVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZC5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHJlY2FsY3VsYXRlU2l6ZSgpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aCA9IHRoaXMud2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHQgKyBcInB4XCI7XG4gICAgICAgICAgICBsZXQgcHNtID0gdGhpcy5waWN0dXJlU2l6ZU1vZGU7XG4gICAgICAgICAgICBsZXQgaW1nV2lkdGggPSAwO1xuICAgICAgICAgICAgbGV0IGltZ0hlaWdodCA9IDA7XG4gICAgICAgICAgICBsZXQgcGljV2lkdGggPSB0aGlzLndpZHRoO1xuICAgICAgICAgICAgbGV0IHBpY0hlaWdodCA9IHRoaXMuaGVpZ2h0O1xuICAgICAgICAgICAgbGV0IGN4ID0gMDtcbiAgICAgICAgICAgIGxldCBjeSA9IDA7XG4gICAgICAgICAgICBsZXQgY3cgPSAwO1xuICAgICAgICAgICAgbGV0IGNoID0gMDtcbiAgICAgICAgICAgIGxldCBpbWdSYXRpbzogbnVtYmVyID0gbnVsbDtcbiAgICAgICAgICAgIGxldCBwaWNSYXRpbyA9IHBpY1dpZHRoIC8gcGljSGVpZ2h0O1xuXG4gICAgICAgICAgICBpZiAodGhpcy5pbWFnZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaW1nV2lkdGggPSB0aGlzLmltYWdlLndpZHRoO1xuICAgICAgICAgICAgICAgIGltZ0hlaWdodCA9IHRoaXMuaW1hZ2UuaGVpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGltZ1dpZHRoID09IDAgfHwgaW1nSGVpZ2h0ID09IDApIHtcbiAgICAgICAgICAgICAgICAvLyBub3RoaW5nIHRvIGRvIGhlcmVcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaW1nUmF0aW8gPSBpbWdXaWR0aCAvIGltZ0hlaWdodDtcbiAgICAgICAgICAgICAgICBpZiAocHNtID09IEVQaWN0dXJlU2l6ZU1vZGUuQ0VOVEVSKSB7XG4gICAgICAgICAgICAgICAgICAgIGN4ID0gKGltZ1dpZHRoIC0gcGljV2lkdGgpIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgY3kgPSAoaW1nSGVpZ2h0IC0gcGljSGVpZ2h0KSAvIDI7XG4gICAgICAgICAgICAgICAgICAgIGN3ID0gaW1nV2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIGNoID0gaW1nSGVpZ2h0O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocHNtID09IEVQaWN0dXJlU2l6ZU1vZGUuRklMTCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW1nUmF0aW8gPiBwaWNSYXRpbykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZml0IGhlaWdodFxuICAgICAgICAgICAgICAgICAgICAgICAgY3kgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2ggPSBwaWNIZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdyA9IChjaCAqIGltZ1JhdGlvKSB8IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBjeCA9IChwaWNXaWR0aCAtIGN3KSAvIDI7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmaXQgd2lkdGhcbiAgICAgICAgICAgICAgICAgICAgICAgIGN4ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN3ID0gcGljV2lkdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaCA9IChjdyAvIGltZ1JhdGlvKSB8IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBjeSA9IChwaWNIZWlnaHQgLSBjaCkgLyAyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwc20gPT0gRVBpY3R1cmVTaXplTW9kZS5GSVRfSEVJR0hUKSB7XG4gICAgICAgICAgICAgICAgICAgIGN5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgY2ggPSBwaWNIZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIGN3ID0gKGNoICogaW1nUmF0aW8pIHwgMDtcbiAgICAgICAgICAgICAgICAgICAgY3ggPSAocGljV2lkdGggLSBjdykgLyAyO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocHNtID09IEVQaWN0dXJlU2l6ZU1vZGUuRklUX1dJRFRIKSB7XG4gICAgICAgICAgICAgICAgICAgIGN4ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgY3cgPSBwaWNXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgY2ggPSAoY3cgLyBpbWdSYXRpbykgfCAwO1xuICAgICAgICAgICAgICAgICAgICBjeSA9IChwaWNIZWlnaHQgLSBjaCkgLyAyO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocHNtID09IEVQaWN0dXJlU2l6ZU1vZGUuTk9STUFMKSB7XG4gICAgICAgICAgICAgICAgICAgIGN4ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgY3kgPSAwO1xuICAgICAgICAgICAgICAgICAgICBjdyA9IGltZ1dpZHRoO1xuICAgICAgICAgICAgICAgICAgICBjaCA9IGltZ0hlaWdodDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHBzbSA9PSBFUGljdHVyZVNpemVNb2RlLlNUUkVUQ0gpIHtcbiAgICAgICAgICAgICAgICAgICAgY3ggPSAwO1xuICAgICAgICAgICAgICAgICAgICBjeSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGN3ID0gcGljV2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIGNoID0gcGljSGVpZ2h0O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocHNtID09IEVQaWN0dXJlU2l6ZU1vZGUuWk9PTSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW1nUmF0aW8gPiBwaWNSYXRpbykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZml0IHdpZHRoXG4gICAgICAgICAgICAgICAgICAgICAgICBjeCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdyA9IHBpY1dpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2ggPSAoY3cgLyBpbWdSYXRpbykgfCAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3kgPSAocGljSGVpZ2h0IC0gY2gpIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZpdCBoZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgICAgIGN5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoID0gcGljSGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgY3cgPSAoY2ggKiBpbWdSYXRpbykgfCAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3ggPSAocGljV2lkdGggLSBjdykgLyAyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IGN4ICsgXCJweFwiO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRvcCA9IGN5ICsgXCJweFwiO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLndpZHRoID0gY3cgKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gY2ggKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBwaWN0dXJlU2l6ZU1vZGVQcm9wZXJ0eSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9waWN0dXJlU2l6ZU1vZGU7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IFBpY3R1cmVTaXplTW9kZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBpY3R1cmVTaXplTW9kZVByb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHBpY3R1cmVTaXplTW9kZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlBpY3R1cmVTaXplTW9kZS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgcGljdHVyZVNpemVNb2RlKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlBpY3R1cmVTaXplTW9kZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIHdpZHRoUHJvcGVydHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMud2lkdGhQcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIGdldCB3aWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLldpZHRoLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB3aWR0aCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5XaWR0aC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIGhlaWdodFByb3BlcnR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGVpZ2h0UHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgaGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuSGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBoZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuSGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgcGFkZGluZ1Byb3BlcnR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLnBhZGRpbmdQcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIGdldCBQYWRkaW5nKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFkZGluZ1Byb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHBhZGRpbmcoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5QYWRkaW5nLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBwYWRkaW5nKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlBhZGRpbmcudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBib3JkZXJQcm9wZXJ0eSgpIHtcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5ib3JkZXJQcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIGdldCBCb3JkZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ib3JkZXJQcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIGdldCBib3JkZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Cb3JkZXIudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGJvcmRlcih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Cb3JkZXIudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBiYWNrZ3JvdW5kUHJvcGVydHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYmFja2dyb3VuZDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgQmFja2dyb3VuZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJhY2tncm91bmRQcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIGdldCBiYWNrZ3JvdW5kKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQmFja2dyb3VuZC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYmFja2dyb3VuZCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5CYWNrZ3JvdW5kLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgaW1hZ2VQcm9wZXJ0eSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbWFnZTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgSW1hZ2UoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbWFnZVByb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGltYWdlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuSW1hZ2UudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGltYWdlKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkltYWdlLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgIH1cblxufVxuXG4iLCJtb2R1bGUgY3ViZWUge1xuXG4gICAgZXhwb3J0IGNsYXNzIEFQb3B1cCB7XG5cbiAgICAgICAgcHJpdmF0ZSBfbW9kYWw6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcHJpdmF0ZSBfYXV0b0Nsb3NlID0gdHJ1ZTtcbiAgICAgICAgcHJpdmF0ZSBfZ2xhc3NDb2xvciA9IENvbG9yLlRSQU5TUEFSRU5UO1xuXG4gICAgICAgIHByaXZhdGUgX3RyYW5zbGF0ZVggPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdHJhbnNsYXRlWSA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9jZW50ZXIgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuXG4gICAgICAgIHByaXZhdGUgX3BvcHVwUm9vdDogUGFuZWwgPSBudWxsO1xuICAgICAgICBwcml2YXRlIF9yb290Q29tcG9uZW50Q29udGFpbmVyOiBQYW5lbCA9IG51bGw7XG4gICAgICAgIHByaXZhdGUgX3Jvb3RDb21wb25lbnQ6IEFDb21wb25lbnQgPSBudWxsO1xuXG4gICAgICAgIHByaXZhdGUgX3Zpc2libGUgPSBmYWxzZTtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihtb2RhbDogYm9vbGVhbiA9IHRydWUsIGF1dG9DbG9zZTogYm9vbGVhbiA9IHRydWUsIGdsYXNzQ29sb3IgPSBDb2xvci5nZXRBcmdiQ29sb3IoMHgwMDAwMDAwMCkpIHtcbiAgICAgICAgICAgIHRoaXMuX21vZGFsID0gbW9kYWw7XG4gICAgICAgICAgICB0aGlzLl9hdXRvQ2xvc2UgPSBhdXRvQ2xvc2U7XG4gICAgICAgICAgICB0aGlzLl9nbGFzc0NvbG9yID0gZ2xhc3NDb2xvcjtcbiAgICAgICAgICAgIHRoaXMuX3BvcHVwUm9vdCA9IG5ldyBQYW5lbCgpO1xuICAgICAgICAgICAgdGhpcy5fcG9wdXBSb290LmVsZW1lbnQuc3R5bGUubGVmdCA9IFwiMHB4XCI7XG4gICAgICAgICAgICB0aGlzLl9wb3B1cFJvb3QuZWxlbWVudC5zdHlsZS50b3AgPSBcIjBweFwiO1xuICAgICAgICAgICAgdGhpcy5fcG9wdXBSb290LmVsZW1lbnQuc3R5bGUucmlnaHQgPSBcIjBweFwiO1xuICAgICAgICAgICAgdGhpcy5fcG9wdXBSb290LmVsZW1lbnQuc3R5bGUuYm90dG9tID0gXCIwcHhcIjtcbiAgICAgICAgICAgIHRoaXMuX3BvcHVwUm9vdC5lbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gXCJmaXhlZFwiO1xuICAgICAgICAgICAgaWYgKGdsYXNzQ29sb3IgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3BvcHVwUm9vdC5iYWNrZ3JvdW5kID0gbmV3IENvbG9yQmFja2dyb3VuZChnbGFzc0NvbG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtb2RhbCB8fCBhdXRvQ2xvc2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wb3B1cFJvb3QuZWxlbWVudC5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJhbGxcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcG9wdXBSb290LmVsZW1lbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9IFwibm9uZVwiO1xuICAgICAgICAgICAgICAgIHRoaXMuX3BvcHVwUm9vdC5wb2ludGVyVHJhbnNwYXJlbnQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9yb290Q29tcG9uZW50Q29udGFpbmVyID0gbmV3IFBhbmVsKCk7XG4gICAgICAgICAgICB0aGlzLl9yb290Q29tcG9uZW50Q29udGFpbmVyLlRyYW5zbGF0ZVguYmluZChuZXcgRXhwcmVzc2lvbjxudW1iZXI+KCgpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgYmFzZVggPSAwO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jZW50ZXIudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgYmFzZVggPSAodGhpcy5fcG9wdXBSb290LmNsaWVudFdpZHRoIC0gdGhpcy5fcm9vdENvbXBvbmVudENvbnRhaW5lci5ib3VuZHNXaWR0aCkgLyAyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gYmFzZVggKyB0aGlzLl90cmFuc2xhdGVYLnZhbHVlO1xuICAgICAgICAgICAgfSwgdGhpcy5fY2VudGVyLCB0aGlzLl9wb3B1cFJvb3QuQ2xpZW50V2lkdGgsIHRoaXMuX3RyYW5zbGF0ZVgsXG4gICAgICAgICAgICAgICAgdGhpcy5fcm9vdENvbXBvbmVudENvbnRhaW5lci5Cb3VuZHNXaWR0aCkpO1xuICAgICAgICAgICAgdGhpcy5fcm9vdENvbXBvbmVudENvbnRhaW5lci5UcmFuc2xhdGVZLmJpbmQobmV3IEV4cHJlc3Npb248bnVtYmVyPigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGJhc2VZID0gMDtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY2VudGVyLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGJhc2VZID0gKHRoaXMuX3BvcHVwUm9vdC5jbGllbnRIZWlnaHQgLSB0aGlzLl9yb290Q29tcG9uZW50Q29udGFpbmVyLmJvdW5kc0hlaWdodCkgLyAyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gYmFzZVkgKyB0aGlzLl90cmFuc2xhdGVZLnZhbHVlO1xuICAgICAgICAgICAgfSwgdGhpcy5fY2VudGVyLCB0aGlzLl9wb3B1cFJvb3QuQ2xpZW50SGVpZ2h0LCB0aGlzLl90cmFuc2xhdGVZLFxuICAgICAgICAgICAgICAgIHRoaXMuX3Jvb3RDb21wb25lbnRDb250YWluZXIuQm91bmRzSGVpZ2h0KSk7XG4gICAgICAgICAgICB0aGlzLl9wb3B1cFJvb3QuY2hpbGRyZW4uYWRkKHRoaXMuX3Jvb3RDb21wb25lbnRDb250YWluZXIpO1xuXG4gICAgICAgICAgICBpZiAoYXV0b0Nsb3NlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcG9wdXBSb290Lm9uQ2xpY2suYWRkTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgX19wb3B1cFJvb3QoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcG9wdXBSb290O1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIGdldCByb290Q29tcG9uZW50KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jvb3RDb21wb25lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgc2V0IHJvb3RDb21wb25lbnQocm9vdENvbXBvbmVudDogQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgdGhpcy5fcm9vdENvbXBvbmVudENvbnRhaW5lci5jaGlsZHJlbi5jbGVhcigpO1xuICAgICAgICAgICAgdGhpcy5fcm9vdENvbXBvbmVudCA9IG51bGw7XG4gICAgICAgICAgICBpZiAocm9vdENvbXBvbmVudCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcm9vdENvbXBvbmVudENvbnRhaW5lci5jaGlsZHJlbi5hZGQocm9vdENvbXBvbmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9yb290Q29tcG9uZW50ID0gcm9vdENvbXBvbmVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBzaG93KCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3Zpc2libGUpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoaXMgcG9wdXAgaXMgYWxyZWFkeSBzaG93bi5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBib2R5OiBIVE1MQm9keUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJvZHlcIilbMF07XG4gICAgICAgICAgICBib2R5LmFwcGVuZENoaWxkKHRoaXMuX3BvcHVwUm9vdC5lbGVtZW50KTtcbiAgICAgICAgICAgIFBvcHVwcy5fYWRkUG9wdXAodGhpcyk7XG4gICAgICAgICAgICB0aGlzLl92aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBjbG9zZSgpOiBib29sZWFuIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fdmlzaWJsZSkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhpcyBwb3B1cCBpc24ndCBzaG93bi5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdGhpcy5pc0Nsb3NlQWxsb3dlZCgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGJvZHk6IEhUTUxCb2R5RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXTtcbiAgICAgICAgICAgIGJvZHkucmVtb3ZlQ2hpbGQodGhpcy5fcG9wdXBSb290LmVsZW1lbnQpO1xuICAgICAgICAgICAgUG9wdXBzLl9yZW1vdmVQb3B1cCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuX3Zpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMub25DbG9zZWQoKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIGlzQ2xvc2VBbGxvd2VkKCk6IGJvb2xlYW4ge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgb25DbG9zZWQoKSB7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBtb2RhbCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tb2RhbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBhdXRvQ2xvc2UoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYXV0b0Nsb3NlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGdsYXNzQ29sb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2xhc3NDb2xvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUcmFuc2xhdGVYKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0ZVg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRyYW5zbGF0ZVgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UcmFuc2xhdGVYLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0cmFuc2xhdGVYKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRyYW5zbGF0ZVgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUcmFuc2xhdGVZKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0ZVk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRyYW5zbGF0ZVkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UcmFuc2xhdGVZLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0cmFuc2xhdGVZKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRyYW5zbGF0ZVkudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBDZW50ZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2VudGVyO1xuICAgICAgICB9XG4gICAgICAgIGdldCBjZW50ZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5DZW50ZXIudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGNlbnRlcih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5DZW50ZXIudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9sYXlvdXQoKSB7XG4gICAgICAgICAgICB0aGlzLl9wb3B1cFJvb3Qud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgICAgIHRoaXMuX3BvcHVwUm9vdC5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgICAgICB0aGlzLl9wb3B1cFJvb3QubGF5b3V0KCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBQb3B1cHMge1xuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9wb3B1cHM6IEFQb3B1cFtdID0gW107XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9sYXlvdXRSdW5PbmNlID0gbmV3IFJ1bk9uY2UoKCkgPT4ge1xuICAgICAgICAgICAgUG9wdXBzLmxheW91dCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBzdGF0aWMgX2FkZFBvcHVwKHBvcHVwOiBBUG9wdXApIHtcbiAgICAgICAgICAgIFBvcHVwcy5fcG9wdXBzLnB1c2gocG9wdXApO1xuICAgICAgICAgICAgUG9wdXBzLl9yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0aWMgX3JlbW92ZVBvcHVwKHBvcHVwOiBBUG9wdXApIHtcbiAgICAgICAgICAgIHZhciBpZHggPSBQb3B1cHMuX3BvcHVwcy5pbmRleE9mKHBvcHVwKTtcbiAgICAgICAgICAgIGlmIChpZHggPiAtMSkge1xuICAgICAgICAgICAgICAgIFBvcHVwcy5fcG9wdXBzLnNwbGljZShpZHgsIDEpO1xuICAgICAgICAgICAgICAgIFBvcHVwcy5fcmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIF9yZXF1ZXN0TGF5b3V0KCkge1xuICAgICAgICAgICAgUG9wdXBzLl9sYXlvdXRSdW5PbmNlLnJ1bigpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgbGF5b3V0KCkge1xuICAgICAgICAgICAgUG9wdXBzLl9wb3B1cHMuZm9yRWFjaCgocG9wdXApID0+IHtcbiAgICAgICAgICAgICAgICBwb3B1cC5fbGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgdGhyb3cgXCJDYW4gbm90IGluc3RhbnRpYXRlIFBvcHVwcyBjbGFzcy5cIlxuICAgICAgICB9XG5cbiAgICB9XG5cbn1cblxuXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwidXRpbHMudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiZXZlbnRzLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInByb3BlcnRpZXMudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwic3R5bGVzLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImNvbXBvbmVudF9iYXNlL0xheW91dENoaWxkcmVuLnRzXCIvPiBcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJjb21wb25lbnRfYmFzZS9BQ29tcG9uZW50LnRzXCIvPiBcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJjb21wb25lbnRfYmFzZS9BTGF5b3V0LnRzXCIvPiBcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJjb21wb25lbnRfYmFzZS9BVXNlckNvbnRyb2wudHNcIi8+IFxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImNvbXBvbmVudF9iYXNlL0FWaWV3LnRzXCIvPiBcblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImxheW91dHMvUGFuZWwudHNcIi8+ICBcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJsYXlvdXRzL0hCb3gudHNcIi8+ICAgXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwibGF5b3V0cy9WQm94LnRzXCIvPiAgICBcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJsYXlvdXRzL1Njcm9sbEJveC50c1wiLz4gICAgXG4gICBcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJjb21wb25lbnRzL0xhYmVsLnRzXCIvPiAgXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiY29tcG9uZW50cy9CdXR0b24udHNcIi8+ICAgIFxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImNvbXBvbmVudHMvVGV4dEJveC50c1wiLz4gICAgXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiY29tcG9uZW50cy9QYXNzd29yZEJveC50c1wiLz4gICAgXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiY29tcG9uZW50cy9UZXh0QXJlYS50c1wiLz4gICAgXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiY29tcG9uZW50cy9DaGVja0JveC50c1wiLz4gICAgIFxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImNvbXBvbmVudHMvQ29tYm9Cb3gudHNcIi8+ICAgICBcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJjb21wb25lbnRzL1BpY3R1cmVCb3gudHNcIi8+ICAgICBcblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInBvcHVwcy50c1wiLz4gIFxuXG4vLyBodG1sIGNvbXBvbmVudFxuLy8gaHlwZXJsaW5rXG5cbi8vIGZhaWNvblxuLy8gZWljb25cblxuLy8gRVZFTlRTXG5cblxubW9kdWxlIGN1YmVlIHsgICAgICAgICAgICAgICAgXG5cbiAgICBleHBvcnQgY2xhc3MgQ3ViZWVQYW5lbCB7ICAgICAgICBcblxuICAgICAgICBwcml2YXRlIF9sYXlvdXRSdW5PbmNlOiBSdW5PbmNlID0gbnVsbDsgXG5cbiAgICAgICAgcHJpdmF0ZSBfY29udGVudFBhbmVsOiBQYW5lbCA9IG51bGw7XG4gICAgICAgIHByaXZhdGUgX3Jvb3RDb21wb25lbnQ6IEFDb21wb25lbnQgPSBudWxsO1xuXG5cbiAgICAgICAgcHJpdmF0ZSBfZWxlbWVudDogSFRNTEVsZW1lbnQ7XG5cbiAgICAgICAgcHJpdmF0ZSBfbGVmdCA9IC0xO1xuICAgICAgICBwcml2YXRlIF90b3AgPSAtMTtcbiAgICAgICAgcHJpdmF0ZSBfY2xpZW50V2lkdGggPSAtMTtcbiAgICAgICAgcHJpdmF0ZSBfY2xpZW50SGVpZ2h0ID0gLTE7XG4gICAgICAgIHByaXZhdGUgX29mZnNldFdpZHRoID0gLTE7XG4gICAgICAgIHByaXZhdGUgX29mZnNldEhlaWdodCA9IC0xO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEhUTUxEaXZFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwib25yZXNpemVcIiwgKGV2dDogVUlFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbCA9IG5ldyBQYW5lbCgpO1xuICAgICAgICAgICAgdGhpcy5fY29udGVudFBhbmVsLmVsZW1lbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9IFwibm9uZVwiO1xuICAgICAgICAgICAgdGhpcy5fY29udGVudFBhbmVsLnBvaW50ZXJUcmFuc3BhcmVudCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLl9jb250ZW50UGFuZWwuc2V0Q3ViZWVQYW5lbCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5fY29udGVudFBhbmVsLmVsZW1lbnQpO1xuXG4gICAgICAgICAgICB0aGlzLmNoZWNrQm91bmRzKCk7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcblxuICAgICAgICAgICAgdmFyIHQgPSBuZXcgVGltZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIEV2ZW50UXVldWUuSW5zdGFuY2UuaW52b2tlTGF0ZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrQm91bmRzKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHQuc3RhcnQoMTAwLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgY2hlY2tCb3VuZHMoKSB7XG4gICAgICAgICAgICAvLyBUT0RPIG9mZnNldExlZnQgLT4gYWJzb2x1dGVMZWZ0XG4gICAgICAgICAgICB2YXIgbmV3TGVmdCA9IHRoaXMuX2VsZW1lbnQub2Zmc2V0TGVmdDtcbiAgICAgICAgICAgIC8vIFRPRE8gb2Zmc2V0VG9wIC0+IGFic29sdXRlVG9wXG4gICAgICAgICAgICB2YXIgbmV3VG9wID0gdGhpcy5fZWxlbWVudC5vZmZzZXRUb3A7XG4gICAgICAgICAgICB2YXIgbmV3Q2xpZW50V2lkdGggPSB0aGlzLl9lbGVtZW50LmNsaWVudFdpZHRoO1xuICAgICAgICAgICAgdmFyIG5ld0NsaWVudEhlaWdodCA9IHRoaXMuX2VsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICAgICAgICAgICAgdmFyIG5ld09mZnNldFdpZHRoID0gdGhpcy5fZWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICAgICAgICAgIHZhciBuZXdPZmZzZXRIZWlnaHQgPSB0aGlzLl9lbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgIGlmIChuZXdMZWZ0ICE9IHRoaXMuX2xlZnQgfHwgbmV3VG9wICE9IHRoaXMuX3RvcCB8fCBuZXdDbGllbnRXaWR0aCAhPSB0aGlzLl9jbGllbnRXaWR0aCB8fCBuZXdDbGllbnRIZWlnaHQgIT0gdGhpcy5fY2xpZW50SGVpZ2h0XG4gICAgICAgICAgICAgICAgfHwgbmV3T2Zmc2V0V2lkdGggIT0gdGhpcy5fb2Zmc2V0V2lkdGggfHwgbmV3T2Zmc2V0SGVpZ2h0ICE9IHRoaXMuX29mZnNldEhlaWdodCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xlZnQgPSBuZXdMZWZ0O1xuICAgICAgICAgICAgICAgIHRoaXMuX3RvcCA9IG5ld1RvcDtcbiAgICAgICAgICAgICAgICB0aGlzLl9jbGllbnRXaWR0aCA9IG5ld0NsaWVudFdpZHRoO1xuICAgICAgICAgICAgICAgIHRoaXMuX2NsaWVudEhlaWdodCA9IG5ld0NsaWVudEhlaWdodDtcbiAgICAgICAgICAgICAgICB0aGlzLl9vZmZzZXRXaWR0aCA9IG5ld09mZnNldFdpZHRoO1xuICAgICAgICAgICAgICAgIHRoaXMuX29mZnNldEhlaWdodCA9IG5ld09mZnNldEhlaWdodDtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb250ZW50UGFuZWwud2lkdGggPSB0aGlzLl9vZmZzZXRXaWR0aDtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb250ZW50UGFuZWwuaGVpZ2h0ID0gdGhpcy5fb2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9lbGVtZW50LnN0eWxlLnBvc2l0aW9uID09IFwiYWJzb2x1dGVcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb250ZW50UGFuZWwudHJhbnNsYXRlWCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbC50cmFuc2xhdGVZID0gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb250ZW50UGFuZWwudHJhbnNsYXRlWCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbC50cmFuc2xhdGVZID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXF1ZXN0TGF5b3V0KCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2xheW91dFJ1bk9uY2UgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xheW91dFJ1bk9uY2UgPSBuZXcgUnVuT25jZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGF5b3V0KCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9sYXlvdXRSdW5PbmNlLnJ1bigpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGF5b3V0KCkge1xuICAgICAgICAgICAgUG9wdXBzLl9yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB0aGlzLl9jb250ZW50UGFuZWwubGF5b3V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgcm9vdENvbXBvbmVudCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yb290Q29tcG9uZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0IHJvb3RDb21wb25lbnQocm9vdENvbXBvbmVudDogQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgdGhpcy5fY29udGVudFBhbmVsLmNoaWxkcmVuLmNsZWFyKCk7XG4gICAgICAgICAgICB0aGlzLl9yb290Q29tcG9uZW50ID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChyb290Q29tcG9uZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb250ZW50UGFuZWwuY2hpbGRyZW4uYWRkKHJvb3RDb21wb25lbnQpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Jvb3RDb21wb25lbnQgPSByb290Q29tcG9uZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IENsaWVudFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRlbnRQYW5lbC5DbGllbnRXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgY2xpZW50V2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5DbGllbnRXaWR0aC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgY2xpZW50V2lkdGgodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQ2xpZW50V2lkdGgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBDbGllbnRIZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY29udGVudFBhbmVsLkNsaWVudEhlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgY2xpZW50SGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQ2xpZW50SGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBjbGllbnRIZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQ2xpZW50SGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm91bmRzV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY29udGVudFBhbmVsLkJvdW5kc1dpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGdldCBib3VuZHNXaWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkJvdW5kc1dpZHRoLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBib3VuZHNXaWR0aCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Cb3VuZHNXaWR0aC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEJvdW5kc0hlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250ZW50UGFuZWwuQm91bmRzSGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGdldCBib3VuZHNIZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Cb3VuZHNIZWlnaHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGJvdW5kc0hlaWdodCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Cb3VuZHNIZWlnaHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBCb3VuZHNMZWZ0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRlbnRQYW5lbC5Cb3VuZHNMZWZ0O1xuICAgICAgICB9XG4gICAgICAgIGdldCBib3VuZHNMZWZ0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm91bmRzTGVmdC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYm91bmRzTGVmdCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Cb3VuZHNMZWZ0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm91bmRzVG9wKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRlbnRQYW5lbC5Cb3VuZHNUb3A7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJvdW5kc1RvcCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkJvdW5kc1RvcC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYm91bmRzVG9wKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkJvdW5kc1RvcC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn1cblxuXG4iLCJtb2R1bGUgY3ViZWUge1xuXG4gICAgZXhwb3J0IGNsYXNzIEVJY29uIHtcblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQURKVVNUID0gbmV3IEVJY29uKFwiZmEtYWRqdXN0XCIpO1xuICAgICAgICBzdGF0aWMgZ2V0IEFESlVTVCgpIHsgcmV0dXJuIEVJY29uLl9BREpVU1Q7IH1cbiAgICAgICAgXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9BTkNIT1IgPSBuZXcgRUljb24oXCJmYS1hbmNob3JcIik7XG4gICAgICAgIHN0YXRpYyBnZXQgQU5DSE9SKCkgeyByZXR1cm4gRUljb24uX0FOQ0hPUjsgfVxuICAgICAgICBcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0FSQ0hJVkUgPSBuZXcgRUljb24oXCJmYS1hcmNoaXZlXCIpO1xuICAgICAgICBzdGF0aWMgZ2V0IEFSQ0hJVkUoKSB7IHJldHVybiBFSWNvbi5fQVJDSElWRTsgfVxuICAgICAgICBcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0FSUk9XUyA9IG5ldyBFSWNvbihcImZhLWFycm93c1wiKTtcbiAgICAgICAgc3RhdGljIGdldCBBUlJPV1MoKSB7IHJldHVybiBFSWNvbi5fQVJST1dTOyB9XG4gICAgICAgIFxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQVJST1dTX0ggPSBuZXcgRUljb24oXCJmYS1hcnJvd3MtaFwiKTtcbiAgICAgICAgc3RhdGljIGdldCBBUlJPV1NfSCgpIHsgcmV0dXJuIEVJY29uLl9BUlJPV1NfSDsgfVxuICAgICAgICBcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0FSUk9XU19WID0gbmV3IEVJY29uKFwiZmEtYXJyb3dzLXZcIik7XG4gICAgICAgIHN0YXRpYyBnZXQgQVJST1dTX1YoKSB7IHJldHVybiBFSWNvbi5fQVJST1dTX1Y7IH1cbiAgICAgICAgXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9BU1RFUklTSyA9IG5ldyBFSWNvbihcImZhLWFzdGVyaXNrXCIpO1xuICAgICAgICBzdGF0aWMgZ2V0IEFTVEVSSVNLKCkgeyByZXR1cm4gRUljb24uX0FTVEVSSVNLOyB9XG4gICAgICAgIFxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQkFOID0gbmV3IEVJY29uKFwiZmEtYmFuXCIpO1xuICAgICAgICBzdGF0aWMgZ2V0IEJBTigpIHsgcmV0dXJuIEVJY29uLl9CQU47IH1cbiAgICAgICAgXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9CQVJfQ0hBUlRfTyA9IG5ldyBFSWNvbihcImZhLWJhci1jaGFydC1vXCIpO1xuICAgICAgICBzdGF0aWMgZ2V0IEJBUl9DSEFSVF9PKCkgeyByZXR1cm4gRUljb24uX0JBUl9DSEFSVF9POyB9XG4gICAgICAgIFxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQkFSQ09ERSA9IG5ldyBFSWNvbihcImZhLWJhcmNvZGVcIik7XG4gICAgICAgIHN0YXRpYyBnZXQgQkFSQ09ERSgpIHsgcmV0dXJuIEVJY29uLl9CQVJDT0RFOyB9XG4gICAgICAgIFxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQkFSUyA9IG5ldyBFSWNvbihcImZhLWJhcnNcIik7XG4gICAgICAgIHN0YXRpYyBnZXQgQkFSUygpIHsgcmV0dXJuIEVJY29uLl9CQVJTOyB9XG4gICAgICAgIFxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQkVFUiA9IG5ldyBFSWNvbihcImZhLWJlZXJcIik7XG4gICAgICAgIHN0YXRpYyBnZXQgQkVFUigpIHsgcmV0dXJuIEVJY29uLl9CRUVSOyB9XG4gICAgICAgIFxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQkVMTCA9IG5ldyBFSWNvbihcImZhLWJlbGxcIik7XG4gICAgICAgIHN0YXRpYyBnZXQgQkVMTCgpIHsgcmV0dXJuIEVJY29uLl9CRUxMOyB9XG4gICAgICAgIFxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQkVMTF9PID0gbmV3IEVJY29uKFwiZmEtYmVsbC1vXCIpO1xuICAgICAgICBzdGF0aWMgZ2V0IEJFTExfTygpIHsgcmV0dXJuIEVJY29uLl9CRUxMX087IH1cbiAgICAgICAgXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9CT0xUID0gbmV3IEVJY29uKFwiZmEtYm9sdFwiKTtcbiAgICAgICAgc3RhdGljIGdldCBCT0xUKCkgeyByZXR1cm4gRUljb24uX0JPTFQ7IH1cbiAgICAgICAgXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9CT09LID0gbmV3IEVJY29uKFwiZmEtYm9va1wiKTtcbiAgICAgICAgc3RhdGljIGdldCBCT09LKCkgeyByZXR1cm4gRUljb24uX0JPT0s7IH1cbiAgICAgICAgXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9CT09LTUFSSyA9IG5ldyBFSWNvbihcImZhLWJvb2ttYXJrXCIpO1xuICAgICAgICBzdGF0aWMgZ2V0IEJPT0tNQVJLKCkgeyByZXR1cm4gRUljb24uX0JPT0tNQVJLOyB9XG4gICAgICAgIFxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQk9PS01BUktfTyA9IG5ldyBFSWNvbihcImZhLWJvb2ttYXJrLW9cIik7XG4gICAgICAgIHN0YXRpYyBnZXQgQk9PS01BUktfTygpIHsgcmV0dXJuIEVJY29uLl9CT09LTUFSS19POyB9XG4gICAgICAgIFxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQlJJRUZDQVNFID0gbmV3IEVJY29uKFwiZmEtYnJpZWZjYXNlXCIpO1xuICAgICAgICBzdGF0aWMgZ2V0IEJSSUVGQ0FTRSgpIHsgcmV0dXJuIEVJY29uLl9CUklFRkNBU0U7IH1cbiAgICAgICAgXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9CVUcgPSBuZXcgRUljb24oXCJmYS1idWdcIik7XG4gICAgICAgIHN0YXRpYyBnZXQgQlVHKCkgeyByZXR1cm4gRUljb24uX0JVRzsgfVxuICAgICAgICBcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0JVSUxESU5HX08gPSBuZXcgRUljb24oXCJmYS1idWlsZGluZy1vXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQlVMTEhPUk4gPSBuZXcgRUljb24oXCJmYS1idWxsaG9yblwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0JVTExTRVlFID0gbmV3IEVJY29uKFwiZmEtYnVsbHNleWVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DQUxFTkRBUiA9IG5ldyBFSWNvbihcImZhLWNhbGVuZGFyXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ0FMRU5EQVJfTyA9IG5ldyBFSWNvbihcImZhLWNhbGVuZGFyLW9cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DQU1FUkEgPSBuZXcgRUljb24oXCJmYS1jYW1lcmFcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DQU1FUkFfUkVUUk8gPSBuZXcgRUljb24oXCJmYS1jYW1lcmEtcmV0cm9cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DQVJFVF9TUVVBUkVfT19ET1dOID0gbmV3IEVJY29uKFwiZmEtY2FyZXQtc3F1YXJlLW8tZG93blwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0NBUkVUX1NRVUFSRV9PX1JJR0hUID0gbmV3IEVJY29uKFwiZmEtY2FyZXQtc3F1YXJlLW8tcmlnaHRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DQVJFVF9TUVVBUkVfT19VUCA9IG5ldyBFSWNvbihcImZhLWNhcmV0LXNxdWFyZS1vLXVwXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ0VSVElGSUNBVEUgPSBuZXcgRUljb24oXCJmYS1jZXJ0aWZpY2F0ZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0NIRUNLID0gbmV3IEVJY29uKFwiZmEtY2hlY2tcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DSEVDS19DSVJDTEUgPSBuZXcgRUljb24oXCJmYS1jaGVjay1jaXJjbGVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DSEVDS19DSVJDTEVfTyA9IG5ldyBFSWNvbihcImZhLWNoZWNrLWNpcmNsZS1vXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ0hFQ0tfU1FVQVJFID0gbmV3IEVJY29uKFwiZmEtY2hlY2stc3F1YXJlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ0hFQ0tfU1FVQVJFX08gPSBuZXcgRUljb24oXCJmYS1jaGVjay1zcXVhcmUtb1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0NJUkNMRSA9IG5ldyBFSWNvbihcImZhLWNpcmNsZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0NJUkNMRV9PID0gbmV3IEVJY29uKFwiZmEtY2lyY2xlLW9cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DTE9DS19PID0gbmV3IEVJY29uKFwiZmEtY2xvY2stb1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0NMT1VEID0gbmV3IEVJY29uKFwiZmEtY2xvdWRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DTE9VRF9ET1dOTE9BRCA9IG5ldyBFSWNvbihcImZhLWNsb3VkLWRvd25sb2FkXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ0xPVURfVVBMT0FEID0gbmV3IEVJY29uKFwiZmEtY2xvdWQtdXBsb2FkXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ09ERSA9IG5ldyBFSWNvbihcImZhLWNvZGVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DT0RFX0ZPUksgPSBuZXcgRUljb24oXCJmYS1jb2RlLWZvcmtcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DT0ZGRUUgPSBuZXcgRUljb24oXCJmYS1jb2ZmZWVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DT0cgPSBuZXcgRUljb24oXCJmYS1jb2dcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DT0dTID0gbmV3IEVJY29uKFwiZmEtY29nc1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0NPTU1FTlQgPSBuZXcgRUljb24oXCJmYS1jb21tZW50XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ09NTUVOVF9PID0gbmV3IEVJY29uKFwiZmEtY29tbWVudC1vXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ09NTUVOVFMgPSBuZXcgRUljb24oXCJmYS1jb21tZW50c1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0NPTU1FTlRTX08gPSBuZXcgRUljb24oXCJmYS1jb21tZW50cy1vXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ09NUEFTUyA9IG5ldyBFSWNvbihcImZhLWNvbXBhc3NcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DUkVESVRfQ0FSRCA9IG5ldyBFSWNvbihcImZhLWNyZWRpdC1jYXJkXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ1JPUCA9IG5ldyBFSWNvbihcImZhLWNyb3BcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DUk9TU0hBSVJTID0gbmV3IEVJY29uKFwiZmEtY3Jvc3NoYWlyc1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0NVVExFUlkgPSBuZXcgRUljb24oXCJmYS1jdXRsZXJ5XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfREFTSEJPQVJEID0gbmV3IEVJY29uKFwiZmEtZGFzaGJvYXJkXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfREVTS1RPUCA9IG5ldyBFSWNvbihcImZhLWRlc2t0b3BcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9ET1dOTE9BRCA9IG5ldyBFSWNvbihcImZhLWRvd25sb2FkXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRURJVCA9IG5ldyBFSWNvbihcImZhLWVkaXRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9FTExJUFNJU19IID0gbmV3IEVJY29uKFwiZmEtZWxsaXBzaXMtaFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0VMTElQU0lTX1YgPSBuZXcgRUljb24oXCJmYS1lbGxpcHNpcy12XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRU5WRUxPUEUgPSBuZXcgRUljb24oXCJmYS1lbnZlbG9wZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0VOVkVMT1BFX08gPSBuZXcgRUljb24oXCJmYS1lbnZlbG9wZS1vXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRVJBU0VSID0gbmV3IEVJY29uKFwiZmEtZXJhc2VyXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRVhDSEFOR0UgPSBuZXcgRUljb24oXCJmYS1leGNoYW5nZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0VYQ0xBTUFUSU9OID0gbmV3IEVJY29uKFwiZmEtZXhjbGFtYXRpb25cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9FWENMQU1BVElPTl9DSVJDTEUgPSBuZXcgRUljb24oXCJmYS1leGNsYW1hdGlvbi1jaXJjbGVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9FWENMQU1BVElPTl9UUklBTkdMRSA9IG5ldyBFSWNvbihcImZhLWV4Y2xhbWF0aW9uLXRyaWFuZ2xlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRVhURVJOQUxfTElOSyA9IG5ldyBFSWNvbihcImZhLWV4dGVybmFsLWxpbmtcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9FWFRFUk5BTF9MSU5LX1NRVUFSRSA9IG5ldyBFSWNvbihcImZhLWV4dGVybmFsLWxpbmstc3F1YXJlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRVlFID0gbmV3IEVJY29uKFwiZmEtZXllXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRVlFX1NMQVNIID0gbmV3IEVJY29uKFwiZmEtZXllLXNsYXNoXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRkVNQUxFID0gbmV3IEVJY29uKFwiZmEtZmVtYWxlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRklHSFRFUl9KRVQgPSBuZXcgRUljb24oXCJmYS1maWdodGVyLWpldFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0ZJTE0gPSBuZXcgRUljb24oXCJmYS1maWxtXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRklMVEVSID0gbmV3IEVJY29uKFwiZmEtZmlsdGVyXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRklSRSA9IG5ldyBFSWNvbihcImZhLWZpcmVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9GSVJFX0VYVElOR1VJU0hFUiA9IG5ldyBFSWNvbihcImZhLWZpcmUtZXh0aW5ndWlzaGVyXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRkxBRyA9IG5ldyBFSWNvbihcImZhLWZsYWdcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9GTEFHX0NIRUNLRVJFRCA9IG5ldyBFSWNvbihcImZhLWZsYWctY2hlY2tlcmVkXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRkxBR19PID0gbmV3IEVJY29uKFwiZmEtZmxhZy1vXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRkxBU0ggPSBuZXcgRUljb24oXCJmYS1mbGFzaFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0ZMQVNLID0gbmV3IEVJY29uKFwiZmEtZmxhc2tcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9GT0xERVIgPSBuZXcgRUljb24oXCJmYS1mb2xkZXJcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9GT0xERVJfTyA9IG5ldyBFSWNvbihcImZhLWZvbGRlci1vXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRk9MREVSX09QRU4gPSBuZXcgRUljb24oXCJmYS1mb2xkZXItb3BlblwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0ZPTERFUl9PUEVOX08gPSBuZXcgRUljb24oXCJmYS1mb2xkZXItb3Blbi1vXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRlJPV05fTyA9IG5ldyBFSWNvbihcImZhLWZyb3duLW9cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9HQU1FUEFEID0gbmV3IEVJY29uKFwiZmEtZ2FtZXBhZFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0dBVkVMID0gbmV3IEVJY29uKFwiZmEtZ2F2ZWxcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9HRUFSID0gbmV3IEVJY29uKFwiZmEtZ2VhclwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0dFQVJTID0gbmV3IEVJY29uKFwiZmEtZ2VhcnNcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9HSUZUID0gbmV3IEVJY29uKFwiZmEtZ2lmdFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0dMQVNTID0gbmV3IEVJY29uKFwiZmEtZ2xhc3NcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9HTE9CRSA9IG5ldyBFSWNvbihcImZhLWdsb2JlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfR1JPVVAgPSBuZXcgRUljb24oXCJmYS1ncm91cFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0hERF9PID0gbmV3IEVJY29uKFwiZmEtaGRkLW9cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9IRUFEUEhPTkVTID0gbmV3IEVJY29uKFwiZmEtaGVhZHBob25lc1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0hFQVJUID0gbmV3IEVJY29uKFwiZmEtaGVhcnRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9IRUFSVF9PID0gbmV3IEVJY29uKFwiZmEtaGVhcnQtb1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0hPTUUgPSBuZXcgRUljb24oXCJmYS1ob21lXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfSU5CT1ggPSBuZXcgRUljb24oXCJmYS1pbmJveFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0lORk8gPSBuZXcgRUljb24oXCJmYS1pbmZvXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfSU5GT19DSVJDTEUgPSBuZXcgRUljb24oXCJmYS1pbmZvLWNpcmNsZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0tFWSA9IG5ldyBFSWNvbihcImZhLWtleVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0tFWUJPQVJEX08gPSBuZXcgRUljb24oXCJmYS1rZXlib2FyZC1vXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTEFQVE9QID0gbmV3IEVJY29uKFwiZmEtbGFwdG9wXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTEVBRiA9IG5ldyBFSWNvbihcImZhLWxlYWZcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9MRUdBTCA9IG5ldyBFSWNvbihcImZhLWxlZ2FsXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTEVNT05fTyA9IG5ldyBFSWNvbihcImZhLWxlbW9uLW9cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9MRVZFTF9ET1dOID0gbmV3IEVJY29uKFwiZmEtbGV2ZWwtZG93blwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0xFVkVMX1VQID0gbmV3IEVJY29uKFwiZmEtbGV2ZWwtdXBcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9MSUdIVEJVTEJfTyA9IG5ldyBFSWNvbihcImZhLWxpZ2h0YnVsYi1vXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTE9DQVRJT05fQVJST1cgPSBuZXcgRUljb24oXCJmYS1sb2NhdGlvbi1hcnJvd1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0xPQ0sgPSBuZXcgRUljb24oXCJmYS1sb2NrXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTUFHSUMgPSBuZXcgRUljb24oXCJmYS1tYWdpY1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX01BR05FVCA9IG5ldyBFSWNvbihcImZhLW1hZ25ldFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX01BSUxfRk9SV0FSRCA9IG5ldyBFSWNvbihcImZhLW1haWwtZm9yd2FyZFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX01BSUxfUkVQTFkgPSBuZXcgRUljb24oXCJmYS1tYWlsLXJlcGx5XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTUFJTF9SRVBMWV9BTEwgPSBuZXcgRUljb24oXCJmYS1tYWlsLXJlcGx5LWFsbFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX01BTEUgPSBuZXcgRUljb24oXCJmYS1tYWxlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTUFQX01BUktFUiA9IG5ldyBFSWNvbihcImZhLW1hcC1tYXJrZXJcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9NRUhfTyA9IG5ldyBFSWNvbihcImZhLW1laC1vXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTUlDUk9QSE9ORSA9IG5ldyBFSWNvbihcImZhLW1pY3JvcGhvbmVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9NSUNST1BIT05FX1NMQVNIID0gbmV3IEVJY29uKFwiZmEtbWljcm9waG9uZS1zbGFzaFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX01JTlVTID0gbmV3IEVJY29uKFwiZmEtbWludXNcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9NSU5VU19DSVJDTEUgPSBuZXcgRUljb24oXCJmYS1taW51cy1jaXJjbGVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9NSU5VU19TUVVBUkUgPSBuZXcgRUljb24oXCJmYS1taW51cy1zcXVhcmVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9NSU5VU19TUVVBUkVfTyA9IG5ldyBFSWNvbihcImZhLW1pbnVzLXNxdWFyZS1vXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTU9CSUxFID0gbmV3IEVJY29uKFwiZmEtbW9iaWxlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTU9CSUxFX1BIT05FID0gbmV3IEVJY29uKFwiZmEtbW9iaWxlLXBob25lXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTU9ORVkgPSBuZXcgRUljb24oXCJmYS1tb25leVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX01PT05fTyA9IG5ldyBFSWNvbihcImZhLW1vb24tb1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX01VU0lDID0gbmV3IEVJY29uKFwiZmEtbXVzaWNcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9QRU5DSUwgPSBuZXcgRUljb24oXCJmYS1wZW5jaWxcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9QRU5DSUxfU1FVQVJFID0gbmV3IEVJY29uKFwiZmEtcGVuY2lsLXNxdWFyZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1BFTkNJTF9TUVVBUkVfTyA9IG5ldyBFSWNvbihcImZhLXBlbmNpbC1zcXVhcmUtb1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1BIT05FID0gbmV3IEVJY29uKFwiZmEtcGhvbmVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9QSE9ORV9TUVVBUkUgPSBuZXcgRUljb24oXCJmYS1waG9uZS1zcXVhcmVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9QSUNUVVJFX08gPSBuZXcgRUljb24oXCJmYS1waWN0dXJlLW9cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9QTEFORSA9IG5ldyBFSWNvbihcImZhLXBsYW5lXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUExVUyA9IG5ldyBFSWNvbihcImZhLXBsdXNcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9QTFVTX0NJUkNMRSA9IG5ldyBFSWNvbihcImZhLXBsdXMtY2lyY2xlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUExVU19TUVVBUkUgPSBuZXcgRUljb24oXCJmYS1wbHVzLXNxdWFyZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1BMVVNfU1FVQVJFX08gPSBuZXcgRUljb24oXCJmYS1wbHVzLXNxdWFyZS1vXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUE9XRVJfT0ZGID0gbmV3IEVJY29uKFwiZmEtcG93ZXItb2ZmXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUFJJTlQgPSBuZXcgRUljb24oXCJmYS1wcmludFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1BVWlpMRV9QSUVDRSA9IG5ldyBFSWNvbihcImZhLXB1enpsZS1waWVjZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1FSQ09ERSA9IG5ldyBFSWNvbihcImZhLXFyY29kZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1FVRVNUSU9OID0gbmV3IEVJY29uKFwiZmEtcXVlc3Rpb25cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9RVUVTVElPTl9DSVJDTEUgPSBuZXcgRUljb24oXCJmYS1xdWVzdGlvbi1jaXJjbGVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9RVU9URV9MRUZUID0gbmV3IEVJY29uKFwiZmEtcXVvdGUtbGVmdFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1FVT1RFX1JJR0hUID0gbmV3IEVJY29uKFwiZmEtcXVvdGUtcmlnaHRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9SQU5ET00gPSBuZXcgRUljb24oXCJmYS1yYW5kb21cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9SRUZSRVNIID0gbmV3IEVJY29uKFwiZmEtcmVmcmVzaFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1JFUExZID0gbmV3IEVJY29uKFwiZmEtcmVwbHlcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9SRVBMWV9BTEwgPSBuZXcgRUljb24oXCJmYS1yZXBseS1hbGxcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9SRVRXRUVUID0gbmV3IEVJY29uKFwiZmEtcmV0d2VldFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1JPQUQgPSBuZXcgRUljb24oXCJmYS1yb2FkXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUk9DS0VUID0gbmV3IEVJY29uKFwiZmEtcm9ja2V0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUlNTID0gbmV3IEVJY29uKFwiZmEtcnNzXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUlNTX1NRVUFSRSA9IG5ldyBFSWNvbihcImZhLXJzcy1zcXVhcmVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TRUFSQ0ggPSBuZXcgRUljb24oXCJmYS1zZWFyY2hcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TRUFSQ0hfTUlOVVMgPSBuZXcgRUljb24oXCJmYS1zZWFyY2gtbWludXNcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TRUFSQ0hfUExVUyA9IG5ldyBFSWNvbihcImZhLXNlYXJjaC1wbHVzXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfU0hBUkUgPSBuZXcgRUljb24oXCJmYS1zaGFyZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NIQVJFX1NRVUFSRSA9IG5ldyBFSWNvbihcImZhLXNoYXJlLXNxdWFyZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NIQVJFX1NRVUFSRV9PID0gbmV3IEVJY29uKFwiZmEtc2hhcmUtc3F1YXJlLW9cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TSElFTEQgPSBuZXcgRUljb24oXCJmYS1zaGllbGRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TSE9QUElOR19DQVJUID0gbmV3IEVJY29uKFwiZmEtc2hvcHBpbmctY2FydFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NJR05fSU4gPSBuZXcgRUljb24oXCJmYS1zaWduLWluXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfU0lHTl9PVVQgPSBuZXcgRUljb24oXCJmYS1zaWduLW91dFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NJR05BTCA9IG5ldyBFSWNvbihcImZhLXNpZ25hbFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NJVEVNQVAgPSBuZXcgRUljb24oXCJmYS1zaXRlbWFwXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfU01JTEVfTyA9IG5ldyBFSWNvbihcImZhLXNtaWxlLW9cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TT1JUID0gbmV3IEVJY29uKFwiZmEtc29ydFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NPUlRfQUxQSEFfQVNDID0gbmV3IEVJY29uKFwiZmEtc29ydC1hbHBoYS1hc2NcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TT1JUX0FMUEhBX0RFU0MgPSBuZXcgRUljb24oXCJmYS1zb3J0LWFscGhhLWRlc2NcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TT1JUX0FNT1VOVF9BU0MgPSBuZXcgRUljb24oXCJmYS1zb3J0LWFtb3VudC1hc2NcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TT1JUX0FNT1VOVF9ERVNDID0gbmV3IEVJY29uKFwiZmEtc29ydC1hbW91bnQtZGVzY1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NPUlRfQVNDID0gbmV3IEVJY29uKFwiZmEtc29ydC1hc2NcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TT1JUX0RFU0MgPSBuZXcgRUljb24oXCJmYS1zb3J0LWRlc2NcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TT1JUX0RPV04gPSBuZXcgRUljb24oXCJmYS1zb3J0LWRvd25cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TT1JUX05VTUVSSUNfQVNDID0gbmV3IEVJY29uKFwiZmEtc29ydC1udW1lcmljLWFzY1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NPUlRfTlVNRVJJQ19ERVNDID0gbmV3IEVJY29uKFwiZmEtc29ydC1udW1lcmljLWRlc2NcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TT1JUX1VQID0gbmV3IEVJY29uKFwiZmEtc29ydC11cFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NQSU5ORVIgPSBuZXcgRUljb24oXCJmYS1zcGlubmVyXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfU1FVQVJFID0gbmV3IEVJY29uKFwiZmEtc3F1YXJlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfU1FVQVJFX08gPSBuZXcgRUljb24oXCJmYS1zcXVhcmUtb1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NUQVIgPSBuZXcgRUljb24oXCJmYS1zdGFyXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfU1RBUl9IQUxGID0gbmV3IEVJY29uKFwiZmEtc3Rhci1oYWxmXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfU1RBUl9IQUxGX0VNUFRZID0gbmV3IEVJY29uKFwiZmEtc3Rhci1oYWxmLWVtcHR5XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfU1RBUl9IQUxGX0ZVTEwgPSBuZXcgRUljb24oXCJmYS1zdGFyLWhhbGYtZnVsbFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NUQVJfSEFMRl9PID0gbmV3IEVJY29uKFwiZmEtc3Rhci1oYWxmLW9cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TVEFSX08gPSBuZXcgRUljb24oXCJmYS1zdGFyLW9cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TVUJTQ1JJUFQgPSBuZXcgRUljb24oXCJmYS1zdWJzY3JpcHRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TVUlUQ0FTRSA9IG5ldyBFSWNvbihcImZhLXN1aXRjYXNlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfU1VOX08gPSBuZXcgRUljb24oXCJmYS1zdW4tb1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NVUEVSU0NSSVBUID0gbmV3IEVJY29uKFwiZmEtc3VwZXJzY3JpcHRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9UQUJMRVQgPSBuZXcgRUljb24oXCJmYS10YWJsZXRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9UQUNIT01FVEVSID0gbmV3IEVJY29uKFwiZmEtdGFjaG9tZXRlclwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1RBRyA9IG5ldyBFSWNvbihcImZhLXRhZ1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1RBR1MgPSBuZXcgRUljb24oXCJmYS10YWdzXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfVEFTS1MgPSBuZXcgRUljb24oXCJmYS10YXNrc1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1RFUk1JTkFMID0gbmV3IEVJY29uKFwiZmEtdGVybWluYWxcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9USFVNQl9UQUNLID0gbmV3IEVJY29uKFwiZmEtdGh1bWItdGFja1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1RIVU1CU19ET1dOID0gbmV3IEVJY29uKFwiZmEtdGh1bWJzLWRvd25cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9USFVNQlNfT19ET1dOID0gbmV3IEVJY29uKFwiZmEtdGh1bWJzLW8tZG93blwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1RIVU1CU19PX1VQID0gbmV3IEVJY29uKFwiZmEtdGh1bWJzLW8tdXBcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9USFVNQlNfVVAgPSBuZXcgRUljb24oXCJmYS10aHVtYnMtdXBcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9USUNLRVQgPSBuZXcgRUljb24oXCJmYS10aWNrZXRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9USU1FUyA9IG5ldyBFSWNvbihcImZhLXRpbWVzXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfVElNRVNfQ0lSQ0xFID0gbmV3IEVJY29uKFwiZmEtdGltZXMtY2lyY2xlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfVElNRVNfQ0lSQ0xFX08gPSBuZXcgRUljb24oXCJmYS10aW1lcy1jaXJjbGUtb1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1RJTlQgPSBuZXcgRUljb24oXCJmYS10aW50XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfVE9HR0xFX0RPV04gPSBuZXcgRUljb24oXCJmYS10b2dnbGUtZG93blwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1RPR0dMRV9MRUZUID0gbmV3IEVJY29uKFwiZmEtdG9nZ2xlLWxlZnRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9UT0dHTEVfUklHSFQgPSBuZXcgRUljb24oXCJmYS10b2dnbGUtcmlnaHRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9UT0dHTEVfVVAgPSBuZXcgRUljb24oXCJmYS10b2dnbGUtdXBcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9UUkFTSF9PID0gbmV3IEVJY29uKFwiZmEtdHJhc2gtb1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1RST1BIWSA9IG5ldyBFSWNvbihcImZhLXRyb3BoeVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1RSVUNLID0gbmV3IEVJY29uKFwiZmEtdHJ1Y2tcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9VTUJSRUxMQSA9IG5ldyBFSWNvbihcImZhLXVtYnJlbGxhXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfVU5MT0NLID0gbmV3IEVJY29uKFwiZmEtdW5sb2NrXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfVU5MT0NLX0FMVCA9IG5ldyBFSWNvbihcImZhLXVubG9jay1hbHRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9VTlNPUlRFRCA9IG5ldyBFSWNvbihcImZhLXVuc29ydGVkXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfVVBMT0FEID0gbmV3IEVJY29uKFwiZmEtdXBsb2FkXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfVVNFUiA9IG5ldyBFSWNvbihcImZhLXVzZXJcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9VU0VSUyA9IG5ldyBFSWNvbihcImZhLXVzZXJzXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfVklERU9fQ0FNRVJBID0gbmV3IEVJY29uKFwiZmEtdmlkZW8tY2FtZXJhXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfVk9MVU1FX0RPV04gPSBuZXcgRUljb24oXCJmYS12b2x1bWUtZG93blwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1ZPTFVNRV9PRkYgPSBuZXcgRUljb24oXCJmYS12b2x1bWUtb2ZmXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfVk9MVU1FX1VQID0gbmV3IEVJY29uKFwiZmEtdm9sdW1lLXVwXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfV0FSTklORyA9IG5ldyBFSWNvbihcImZhLXdhcm5pbmdcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9XSEVFTENIQUlSID0gbmV3IEVJY29uKFwiZmEtd2hlZWxjaGFpclwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1dSRU5DSCA9IG5ldyBFSWNvbihcImZhLXdyZW5jaFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0RPVF9DSVJDTEVfTyA9IG5ldyBFSWNvbihcImZhLWRvdC1jaXJjbGUtb1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0JJVENPSU4gPSBuZXcgRUljb24oXCJmYS1iaXRjb2luXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQlRDID0gbmV3IEVJY29uKFwiZmEtYnRjXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ05ZID0gbmV3IEVJY29uKFwiZmEtY255XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRE9MTEFSID0gbmV3IEVJY29uKFwiZmEtZG9sbGFyXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRVVSID0gbmV3IEVJY29uKFwiZmEtZXVyXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRVVSTyA9IG5ldyBFSWNvbihcImZhLWV1cm9cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9HQlAgPSBuZXcgRUljb24oXCJmYS1nYnBcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9JTlIgPSBuZXcgRUljb24oXCJmYS1pbnJcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9KUFkgPSBuZXcgRUljb24oXCJmYS1qcHlcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9LUlcgPSBuZXcgRUljb24oXCJmYS1rcndcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9STUIgPSBuZXcgRUljb24oXCJmYS1ybWJcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9ST1VCTEUgPSBuZXcgRUljb24oXCJmYS1yb3VibGVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9SVUIgPSBuZXcgRUljb24oXCJmYS1ydWJcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9SVUJMRSA9IG5ldyBFSWNvbihcImZhLXJ1YmxlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUlVQRUUgPSBuZXcgRUljb24oXCJmYS1ydXBlZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1RSWSA9IG5ldyBFSWNvbihcImZhLXRyeVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1RVUktJU0hfTElSQSA9IG5ldyBFSWNvbihcImZhLXR1cmtpc2gtbGlyYVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1VTRCA9IG5ldyBFSWNvbihcImZhLXVzZFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1dPTiA9IG5ldyBFSWNvbihcImZhLXdvblwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1lFTiA9IG5ldyBFSWNvbihcImZhLXllblwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0FMSUdOX0NFTlRFUiA9IG5ldyBFSWNvbihcImZhLWFsaWduLWNlbnRlclwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0FMSUdOX0pVU1RJRlkgPSBuZXcgRUljb24oXCJmYS1hbGlnbi1qdXN0aWZ5XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQUxJR05fTEVGVCA9IG5ldyBFSWNvbihcImZhLWFsaWduLWxlZnRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9BTElHTl9SSUdIVCA9IG5ldyBFSWNvbihcImZhLWFsaWduLXJpZ2h0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQk9MRCA9IG5ldyBFSWNvbihcImZhLWJvbGRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DSEFJTiA9IG5ldyBFSWNvbihcImZhLWNoYWluXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ0hBSU5fQlJPS0VOID0gbmV3IEVJY29uKFwiZmEtY2hhaW4tYnJva2VuXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ0xJUEJPQVJEID0gbmV3IEVJY29uKFwiZmEtY2xpcGJvYXJkXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ09MVU1OUyA9IG5ldyBFSWNvbihcImZhLWNvbHVtbnNcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DT1BZID0gbmV3IEVJY29uKFwiZmEtY29weVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0NVVCA9IG5ldyBFSWNvbihcImZhLWN1dFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0RFREVOVCA9IG5ldyBFSWNvbihcImZhLWRlZGVudFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0ZJTEUgPSBuZXcgRUljb24oXCJmYS1maWxlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRklMRV9PID0gbmV3IEVJY29uKFwiZmEtZmlsZS1vXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRklMRV9URVhUID0gbmV3IEVJY29uKFwiZmEtZmlsZS10ZXh0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRklMRV9URVhUX08gPSBuZXcgRUljb24oXCJmYS1maWxlLXRleHQtb1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0ZJTEVTX08gPSBuZXcgRUljb24oXCJmYS1maWxlcy1vXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRkxPUFBZX08gPSBuZXcgRUljb24oXCJmYS1mbG9wcHktb1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0ZPTlQgPSBuZXcgRUljb24oXCJmYS1mb250XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfSU5ERU5UID0gbmV3IEVJY29uKFwiZmEtaW5kZW50XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfSVRBTElDID0gbmV3IEVJY29uKFwiZmEtaXRhbGljXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTElOSyA9IG5ldyBFSWNvbihcImZhLWxpbmtcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9MSVNUID0gbmV3IEVJY29uKFwiZmEtbGlzdFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0xJU1RfQUxUID0gbmV3IEVJY29uKFwiZmEtbGlzdC1hbHRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9MSVNUX09MID0gbmV3IEVJY29uKFwiZmEtbGlzdC1vbFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0xJU1RfVUwgPSBuZXcgRUljb24oXCJmYS1saXN0LXVsXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfT1VUREVOVCA9IG5ldyBFSWNvbihcImZhLW91dGRlbnRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9QQVBFUkNMSVAgPSBuZXcgRUljb24oXCJmYS1wYXBlcmNsaXBcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9QQVNURSA9IG5ldyBFSWNvbihcImZhLXBhc3RlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUkVQRUFUID0gbmV3IEVJY29uKFwiZmEtcmVwZWF0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUk9UQVRFX0xFRlQgPSBuZXcgRUljb24oXCJmYS1yb3RhdGUtbGVmdFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1JPVEFURV9SSUdIVCA9IG5ldyBFSWNvbihcImZhLXJvdGF0ZS1yaWdodFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NBVkUgPSBuZXcgRUljb24oXCJmYS1zYXZlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfU0NJU1NPUlMgPSBuZXcgRUljb24oXCJmYS1zY2lzc29yc1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NUUklLRVRIUk9VR0ggPSBuZXcgRUljb24oXCJmYS1zdHJpa2V0aHJvdWdoXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfVEFCTEUgPSBuZXcgRUljb24oXCJmYS10YWJsZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1RFWFRfSEVJR0hUID0gbmV3IEVJY29uKFwiZmEtdGV4dC1oZWlnaHRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9URVhUX1dJRFRIID0gbmV3IEVJY29uKFwiZmEtdGV4dC13aWR0aFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1RIID0gbmV3IEVJY29uKFwiZmEtdGhcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9USF9MQVJHRSA9IG5ldyBFSWNvbihcImZhLXRoLWxhcmdlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfVEhfTElTVCA9IG5ldyBFSWNvbihcImZhLXRoLWxpc3RcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9VTkRFUkxJTkUgPSBuZXcgRUljb24oXCJmYS11bmRlcmxpbmVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9VTkRPID0gbmV3IEVJY29uKFwiZmEtdW5kb1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1VOTElOSyA9IG5ldyBFSWNvbihcImZhLXVubGlua1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0FOR0xFX0RPVUJMRV9ET1dOID0gbmV3IEVJY29uKFwiZmEtYW5nbGUtZG91YmxlLWRvd25cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9BTkdMRV9ET1VCTEVfTEVGVCA9IG5ldyBFSWNvbihcImZhLWFuZ2xlLWRvdWJsZS1sZWZ0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQU5HTEVfRE9VQkxFX1JJR0hUID0gbmV3IEVJY29uKFwiZmEtYW5nbGUtZG91YmxlLXJpZ2h0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQU5HTEVfRE9VQkxFX1VQID0gbmV3IEVJY29uKFwiZmEtYW5nbGUtZG91YmxlLXVwXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQU5HTEVfRE9XTiA9IG5ldyBFSWNvbihcImZhLWFuZ2xlLWRvd25cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9BTkdMRV9MRUZUID0gbmV3IEVJY29uKFwiZmEtYW5nbGUtbGVmdFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0FOR0xFX1JJR0hUID0gbmV3IEVJY29uKFwiZmEtYW5nbGUtcmlnaHRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9BTkdMRV9VUCA9IG5ldyBFSWNvbihcImZhLWFuZ2xlLXVwXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQVJST1dfQ0lSQ0xFX0RPV04gPSBuZXcgRUljb24oXCJmYS1hcnJvdy1jaXJjbGUtZG93blwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0FSUk9XX0NJUkNMRV9MRUZUID0gbmV3IEVJY29uKFwiZmEtYXJyb3ctY2lyY2xlLWxlZnRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9BUlJPV19DSVJDTEVfT19ET1dOID0gbmV3IEVJY29uKFwiZmEtYXJyb3ctY2lyY2xlLW8tZG93blwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0FSUk9XX0NJUkNMRV9PX0xFRlQgPSBuZXcgRUljb24oXCJmYS1hcnJvdy1jaXJjbGUtby1sZWZ0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQVJST1dfQ0lSQ0xFX09fUklHSFQgPSBuZXcgRUljb24oXCJmYS1hcnJvdy1jaXJjbGUtby1yaWdodFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0FSUk9XX0NJUkNMRV9PX1VQID0gbmV3IEVJY29uKFwiZmEtYXJyb3ctY2lyY2xlLW8tdXBcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9BUlJPV19DSVJDTEVfUklHSFQgPSBuZXcgRUljb24oXCJmYS1hcnJvdy1jaXJjbGUtcmlnaHRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9BUlJPV19DSVJDTEVfVVAgPSBuZXcgRUljb24oXCJmYS1hcnJvdy1jaXJjbGUtdXBcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9BUlJPV19ET1dOID0gbmV3IEVJY29uKFwiZmEtYXJyb3ctZG93blwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0FSUk9XX0xFRlQgPSBuZXcgRUljb24oXCJmYS1hcnJvdy1sZWZ0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQVJST1dfUklHSFQgPSBuZXcgRUljb24oXCJmYS1hcnJvdy1yaWdodFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0FSUk9XX1VQID0gbmV3IEVJY29uKFwiZmEtYXJyb3ctdXBcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9BUlJPV1NfQUxUID0gbmV3IEVJY29uKFwiZmEtYXJyb3dzLWFsdFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0NBUkVUX0RPV04gPSBuZXcgRUljb24oXCJmYS1jYXJldC1kb3duXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ0FSRVRfTEVGVCA9IG5ldyBFSWNvbihcImZhLWNhcmV0LWxlZnRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DQVJFVF9SSUdIVCA9IG5ldyBFSWNvbihcImZhLWNhcmV0LXJpZ2h0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ0FSRVRfU1FVQVJFX09fTEVGVCA9IG5ldyBFSWNvbihcImZhLWNhcmV0LXNxdWFyZS1vLWxlZnRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DQVJFVF9VUCA9IG5ldyBFSWNvbihcImZhLWNhcmV0LXVwXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ0hFVlJPTl9DSVJDTEVfRE9XTiA9IG5ldyBFSWNvbihcImZhLWNoZXZyb24tY2lyY2xlLWRvd25cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DSEVWUk9OX0NJUkNMRV9MRUZUID0gbmV3IEVJY29uKFwiZmEtY2hldnJvbi1jaXJjbGUtbGVmdFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0NIRVZST05fQ0lSQ0xFX1JJR0hUID0gbmV3IEVJY29uKFwiZmEtY2hldnJvbi1jaXJjbGUtcmlnaHRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DSEVWUk9OX0NJUkNMRV9VUCA9IG5ldyBFSWNvbihcImZhLWNoZXZyb24tY2lyY2xlLXVwXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ0hFVlJPTl9ET1dOID0gbmV3IEVJY29uKFwiZmEtY2hldnJvbi1kb3duXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ0hFVlJPTl9MRUZUID0gbmV3IEVJY29uKFwiZmEtY2hldnJvbi1sZWZ0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQ0hFVlJPTl9SSUdIVCA9IG5ldyBFSWNvbihcImZhLWNoZXZyb24tcmlnaHRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DSEVWUk9OX1VQID0gbmV3IEVJY29uKFwiZmEtY2hldnJvbi11cFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0hBTkRfT19ET1dOID0gbmV3IEVJY29uKFwiZmEtaGFuZC1vLWRvd25cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9IQU5EX09fTEVGVCA9IG5ldyBFSWNvbihcImZhLWhhbmQtby1sZWZ0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfSEFORF9PX1JJR0hUID0gbmV3IEVJY29uKFwiZmEtaGFuZC1vLXJpZ2h0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfSEFORF9PX1VQID0gbmV3IEVJY29uKFwiZmEtaGFuZC1vLXVwXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTE9OR19BUlJPV19ET1dOID0gbmV3IEVJY29uKFwiZmEtbG9uZy1hcnJvdy1kb3duXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTE9OR19BUlJPV19MRUZUID0gbmV3IEVJY29uKFwiZmEtbG9uZy1hcnJvdy1sZWZ0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTE9OR19BUlJPV19SSUdIVCA9IG5ldyBFSWNvbihcImZhLWxvbmctYXJyb3ctcmlnaHRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9MT05HX0FSUk9XX1VQID0gbmV3IEVJY29uKFwiZmEtbG9uZy1hcnJvdy11cFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0JBQ0tXQVJEID0gbmV3IEVJY29uKFwiZmEtYmFja3dhcmRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DT01QUkVTUyA9IG5ldyBFSWNvbihcImZhLWNvbXByZXNzXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRUpFQ1QgPSBuZXcgRUljb24oXCJmYS1lamVjdFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0VYUEFORCA9IG5ldyBFSWNvbihcImZhLWV4cGFuZFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0ZBU1RfQkFDS1dBUkQgPSBuZXcgRUljb24oXCJmYS1mYXN0LWJhY2t3YXJkXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRkFTVF9GT1JXQVJEID0gbmV3IEVJY29uKFwiZmEtZmFzdC1mb3J3YXJkXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfRk9SV0FSRCA9IG5ldyBFSWNvbihcImZhLWZvcndhcmRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9QQVVTRSA9IG5ldyBFSWNvbihcImZhLXBhdXNlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUExBWSA9IG5ldyBFSWNvbihcImZhLXBsYXlcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9QTEFZX0NJUkNMRSA9IG5ldyBFSWNvbihcImZhLXBsYXktY2lyY2xlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUExBWV9DSVJDTEVfTyA9IG5ldyBFSWNvbihcImZhLXBsYXktY2lyY2xlLW9cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TVEVQX0JBQ0tXQVJEID0gbmV3IEVJY29uKFwiZmEtc3RlcC1iYWNrd2FyZFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NURVBfRk9SV0FSRCA9IG5ldyBFSWNvbihcImZhLXN0ZXAtZm9yd2FyZFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NUT1AgPSBuZXcgRUljb24oXCJmYS1zdG9wXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfWU9VVFVCRV9QTEFZID0gbmV3IEVJY29uKFwiZmEteW91dHViZS1wbGF5XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQUROID0gbmV3IEVJY29uKFwiZmEtYWRuXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQU5EUk9JRCA9IG5ldyBFSWNvbihcImZhLWFuZHJvaWRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9BUFBMRSA9IG5ldyBFSWNvbihcImZhLWFwcGxlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQklUQlVDS0VUID0gbmV3IEVJY29uKFwiZmEtYml0YnVja2V0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQklUQlVDS0VUX1NRVUFSRSA9IG5ldyBFSWNvbihcImZhLWJpdGJ1Y2tldC1zcXVhcmVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DU1MzID0gbmV3IEVJY29uKFwiZmEtY3NzM1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0RSSUJCQkxFID0gbmV3IEVJY29uKFwiZmEtZHJpYmJibGVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9EUk9QQk9YID0gbmV3IEVJY29uKFwiZmEtZHJvcGJveFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0ZBQ0VCT09LID0gbmV3IEVJY29uKFwiZmEtZmFjZWJvb2tcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9GQUNFQk9PS19TUVVBUkUgPSBuZXcgRUljb24oXCJmYS1mYWNlYm9vay1zcXVhcmVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9GTElDS1IgPSBuZXcgRUljb24oXCJmYS1mbGlja3JcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9GT1VSU1FVQVJFID0gbmV3IEVJY29uKFwiZmEtZm91cnNxdWFyZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0dJVEhVQiA9IG5ldyBFSWNvbihcImZhLWdpdGh1YlwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0dJVEhVQl9BTFQgPSBuZXcgRUljb24oXCJmYS1naXRodWItYWx0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfR0lUSFVCX1NRVUFSRSA9IG5ldyBFSWNvbihcImZhLWdpdGh1Yi1zcXVhcmVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9HSVRUSVAgPSBuZXcgRUljb24oXCJmYS1naXR0aXBcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9HT09HTEVfUExVUyA9IG5ldyBFSWNvbihcImZhLWdvb2dsZS1wbHVzXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfR09PR0xFX1BMVVNfU1FVQVJFID0gbmV3IEVJY29uKFwiZmEtZ29vZ2xlLXBsdXMtc3F1YXJlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfSFRNTDUgPSBuZXcgRUljb24oXCJmYS1odG1sNVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0lOU1RBR1JBTSA9IG5ldyBFSWNvbihcImZhLWluc3RhZ3JhbVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0xJTktFRElOID0gbmV3IEVJY29uKFwiZmEtbGlua2VkaW5cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9MSU5LRURJTl9TUVVBUkUgPSBuZXcgRUljb24oXCJmYS1saW5rZWRpbi1zcXVhcmVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9MSU5VWCA9IG5ldyBFSWNvbihcImZhLWxpbnV4XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTUFYQ0ROID0gbmV3IEVJY29uKFwiZmEtbWF4Y2RuXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUEFHRUxJTkVTID0gbmV3IEVJY29uKFwiZmEtcGFnZWxpbmVzXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUElOVEVSRVNUID0gbmV3IEVJY29uKFwiZmEtcGludGVyZXN0XCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUElOVEVSRVNUX1NRVUFSRSA9IG5ldyBFSWNvbihcImZhLXBpbnRlcmVzdC1zcXVhcmVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9SRU5SRU4gPSBuZXcgRUljb24oXCJmYS1yZW5yZW5cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TS1lQRSA9IG5ldyBFSWNvbihcImZhLXNreXBlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfU1RBQ0tfRVhDSEFOR0UgPSBuZXcgRUljb24oXCJmYS1zdGFjay1leGNoYW5nZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1NUQUNLX09WRVJGTE9XID0gbmV3IEVJY29uKFwiZmEtc3RhY2stb3ZlcmZsb3dcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9UUkVMTE8gPSBuZXcgRUljb24oXCJmYS10cmVsbG9cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9UVU1CTFIgPSBuZXcgRUljb24oXCJmYS10dW1ibHJcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9UVU1CTFJfU1FVQVJFID0gbmV3IEVJY29uKFwiZmEtdHVtYmxyLXNxdWFyZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1RXSVRURVIgPSBuZXcgRUljb24oXCJmYS10d2l0dGVyXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfVFdJVFRFUl9TUVVBUkUgPSBuZXcgRUljb24oXCJmYS10d2l0dGVyLXNxdWFyZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1ZJTUVPX1NRVUFSRSA9IG5ldyBFSWNvbihcImZhLXZpbWVvLXNxdWFyZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1ZLID0gbmV3IEVJY29uKFwiZmEtdmtcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9XRUlCTyA9IG5ldyBFSWNvbihcImZhLXdlaWJvXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfV0lORE9XUyA9IG5ldyBFSWNvbihcImZhLXdpbmRvd3NcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9YSU5HID0gbmV3IEVJY29uKFwiZmEteGluZ1wiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1hJTkdfU1FVQVJFID0gbmV3IEVJY29uKFwiZmEteGluZy1zcXVhcmVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9ZT1VUVUJFID0gbmV3IEVJY29uKFwiZmEteW91dHViZVwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1lPVVRVQkVfU1FVQVJFID0gbmV3IEVJY29uKFwiZmEteW91dHViZS1zcXVhcmVcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9BTUJVTEFOQ0UgPSBuZXcgRUljb24oXCJmYS1hbWJ1bGFuY2VcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9IX1NRVUFSRSA9IG5ldyBFSWNvbihcImZhLWgtc3F1YXJlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfSE9TUElUQUxfTyA9IG5ldyBFSWNvbihcImZhLWhvc3BpdGFsLW9cIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9NRURLSVQgPSBuZXcgRUljb24oXCJmYS1tZWRraXRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9TVEVUSE9TQ09QRSA9IG5ldyBFSWNvbihcImZhLXN0ZXRob3Njb3BlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfVVNFUl9NRCA9IG5ldyBFSWNvbihcImZhLXVzZXItbWRcIik7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBfdmFsdWU6IHN0cmluZykge1xuXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGdldCBjbGFzc05hbWUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gICAgICAgIH1cblxuICAgIH1cblxufVxuXG5cbiIsIm1vZHVsZSBjdWJlZSB7XG5cbiAgICBleHBvcnQgY2xhc3MgRkFJY29uIGV4dGVuZHMgQVVzZXJDb250cm9sIHtcblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfaW5pdGlhbGl6ZWQgPSBmYWxzZTtcblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBpbml0RkEoKSB7XG4gICAgICAgICAgICBGQUljb24uX2luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciB3OiBhbnkgPSB3aW5kb3c7XG4gICAgICAgICAgICB3LmZhc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKTtcbiAgICAgICAgICAgIHcuZmFzdHN0eWxlLmhyZWYgPSBcIi8vbmV0ZG5hLmJvb3RzdHJhcGNkbi5jb20vZm9udC1hd2Vzb21lLzQuMC4zL2Nzcy9mb250LWF3ZXNvbWUuY3NzXCI7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0uYXBwZW5kQ2hpbGQody5mYXN0eWxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3NpemUgPSBuZXcgTnVtYmVyUHJvcGVydHkoMTYsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2NvbG9yID0gbmV3IENvbG9yUHJvcGVydHkoQ29sb3IuQkxBQ0ssIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3NwaW4gPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9pY29uID0gbmV3IFByb3BlcnR5PEVJY29uPihFSWNvbi5CQU4sIGZhbHNlLCBmYWxzZSk7XG5cbiAgICAgICAgcHJpdmF0ZSBfaUVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gbnVsbDtcblxuICAgICAgICBwcml2YXRlIF9jaGFuZ2VMaXN0ZW5lcjogSUNoYW5nZUxpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoU3R5bGUoKTtcbiAgICAgICAgfTtcblxuXG5cbiAgICAgICAgY29uc3RydWN0b3IoaWNvbjogRUljb24pIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgICAgICBpZiAoIUZBSWNvbi5faW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICAgICAgICBGQUljb24uaW5pdEZBKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaWNvbiA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgaWNvbiBwYXJhbWV0ZXIgY2FuIG5vdCBiZSBudWxsLlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzdXBlci53aWR0aFByb3BlcnR5KCkuYmluZCh0aGlzLl9zaXplKTtcbiAgICAgICAgICAgIHN1cGVyLmhlaWdodFByb3BlcnR5KCkuYmluZCh0aGlzLl9zaXplKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xuICAgICAgICAgICAgdGhpcy5faWNvbi52YWx1ZSA9IGljb247XG5cbiAgICAgICAgICAgIHRoaXMuX2lFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlcIik7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5faUVsZW1lbnQpO1xuXG4gICAgICAgICAgICB0aGlzLl9zaXplLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX2NoYW5nZUxpc3RlbmVyKTtcbiAgICAgICAgICAgIHRoaXMuX2NvbG9yLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX2NoYW5nZUxpc3RlbmVyKTtcbiAgICAgICAgICAgIHRoaXMuX3NwaW4uYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fY2hhbmdlTGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy5faWNvbi5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9jaGFuZ2VMaXN0ZW5lcik7XG5cbiAgICAgICAgICAgIHRoaXMucmVmcmVzaFN0eWxlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHJlZnJlc2hTdHlsZSgpIHtcbiAgICAgICAgICAgIHRoaXMuX2lFbGVtZW50LmNsYXNzTmFtZSA9IFwiZmFcIjtcbiAgICAgICAgICAgIGlmICh0aGlzLmljb24gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2lFbGVtZW50LmNsYXNzTmFtZSA9IFwiZmEgXCIgKyB0aGlzLl9pY29uLnZhbHVlLmNsYXNzTmFtZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5faUVsZW1lbnQuc3R5bGUuZm9udFNpemUgPSB0aGlzLnNpemUgKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLl9pRWxlbWVudC5zdHlsZS5jb2xvciA9IHRoaXMuX2NvbG9yLnZhbHVlLnRvQ1NTKCk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnNwaW4pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pRWxlbWVudC5jbGFzc05hbWUgPSB0aGlzLl9pRWxlbWVudC5jbGFzc05hbWUgPSBcImZhLXNwaW5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5saW5lSGVpZ2h0ID0gdGhpcy5zaXplICsgXCJweFwiO1xuICAgICAgICAgICAgdGhpcy5faUVsZW1lbnQuc3R5bGUuYmFja2ZhY2VWaXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBjb2xvclByb3BlcnR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbG9yO1xuICAgICAgICB9XG4gICAgICAgIGdldCBDb2xvcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbG9yUHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgY29sb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Db2xvci52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgY29sb3IodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQ29sb3IudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBzaXplUHJvcGVydHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2l6ZTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgU2l6ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNpemVQcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIGdldCBzaXplKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuU2l6ZS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgc2l6ZSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5TaXplLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgc3BpblByb3BlcnR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NwaW47XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IFNwaW4oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zcGluUHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgc3BpbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlNwaW4udmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHNwaW4odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuU3Bpbi52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIGljb25Qcm9wZXJ0eSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pY29uO1xuICAgICAgICB9XG4gICAgICAgIGdldCBJY29uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaWNvblByb3BlcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGljb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5JY29uLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBpY29uKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkljb24udmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG59XG5cblxuIl19