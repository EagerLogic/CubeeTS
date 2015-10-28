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
    var Event = (function () {
        function Event() {
            this.listeners = [];
        }
        Event.prototype.Event = function () {
        };
        Event.prototype.addListener = function (listener) {
            if (listener == null) {
                throw "The listener parameter can not be null.";
            }
            if (this.hasListener(listener)) {
                return;
            }
            this.listeners.push(listener);
        };
        Event.prototype.removeListener = function (listener) {
            var idx = this.listeners.indexOf(listener);
            if (idx < 0) {
                return;
            }
            this.listeners.splice(idx, 1);
        };
        Event.prototype.hasListener = function (listener) {
            return this.listeners.indexOf(listener) > -1;
        };
        Event.prototype.fireEvent = function (args) {
            for (var l in this.listeners) {
                var listener = l;
                listener(args);
            }
        };
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
    var MouseDragEventArgs = (function () {
        function MouseDragEventArgs(screenX, screenY, deltaX, deltaY, altPressed, ctrlPressed, shiftPressed, metaPressed, sender) {
            this.screenX = screenX;
            this.screenY = screenY;
            this.deltaX = deltaX;
            this.deltaY = deltaY;
            this.altPressed = altPressed;
            this.ctrlPressed = ctrlPressed;
            this.shiftPressed = shiftPressed;
            this.metaPressed = metaPressed;
            this.sender = sender;
        }
        return MouseDragEventArgs;
    })();
    cubee.MouseDragEventArgs = MouseDragEventArgs;
    var MouseUpEventArgs = (function () {
        function MouseUpEventArgs(screenX, screenY, deltaX, deltaY, altPressed, ctrlPressed, shiftPressed, metaPressed, button, nativeEvent, sender) {
            this.screenX = screenX;
            this.screenY = screenY;
            this.deltaX = deltaX;
            this.deltaY = deltaY;
            this.altPressed = altPressed;
            this.ctrlPressed = ctrlPressed;
            this.shiftPressed = shiftPressed;
            this.metaPressed = metaPressed;
            this.button = button;
            this.nativeEvent = nativeEvent;
            this.sender = sender;
        }
        return MouseUpEventArgs;
    })();
    cubee.MouseUpEventArgs = MouseUpEventArgs;
    var MouseDownEventArgs = (function () {
        function MouseDownEventArgs(screenX, screenY, deltaX, deltaY, altPressed, ctrlPressed, shiftPressed, metaPressed, button, nativeEvent, sender) {
            this.screenX = screenX;
            this.screenY = screenY;
            this.deltaX = deltaX;
            this.deltaY = deltaY;
            this.altPressed = altPressed;
            this.ctrlPressed = ctrlPressed;
            this.shiftPressed = shiftPressed;
            this.metaPressed = metaPressed;
            this.button = button;
            this.nativeEvent = nativeEvent;
            this.sender = sender;
        }
        return MouseDownEventArgs;
    })();
    cubee.MouseDownEventArgs = MouseDownEventArgs;
    var MouseMoveEventArgs = (function () {
        function MouseMoveEventArgs(screenX, screenY, x, y, altPressed, ctrlPressed, shiftPressed, metaPressed, sender) {
            this.screenX = screenX;
            this.screenY = screenY;
            this.x = x;
            this.y = y;
            this.altPressed = altPressed;
            this.ctrlPressed = ctrlPressed;
            this.shiftPressed = shiftPressed;
            this.metaPressed = metaPressed;
            this.sender = sender;
        }
        return MouseMoveEventArgs;
    })();
    cubee.MouseMoveEventArgs = MouseMoveEventArgs;
    var MouseWheelEventArgs = (function () {
        function MouseWheelEventArgs(wheelVelocity, altPressed, ctrlPressed, shiftPressed, metaPressed, sender) {
            this.wheelVelocity = wheelVelocity;
            this.altPressed = altPressed;
            this.ctrlPressed = ctrlPressed;
            this.shiftPressed = shiftPressed;
            this.metaPressed = metaPressed;
            this.sender = sender;
        }
        return MouseWheelEventArgs;
    })();
    cubee.MouseWheelEventArgs = MouseWheelEventArgs;
    var ClickEventArgs = (function () {
        function ClickEventArgs(screenX, screenY, deltaX, deltaY, altPressed, ctrlPressed, shiftPressed, metaPressed, button, sender) {
            this.screenX = screenX;
            this.screenY = screenY;
            this.deltaX = deltaX;
            this.deltaY = deltaY;
            this.altPressed = altPressed;
            this.ctrlPressed = ctrlPressed;
            this.shiftPressed = shiftPressed;
            this.metaPressed = metaPressed;
            this.button = button;
            this.sender = sender;
        }
        return ClickEventArgs;
    })();
    cubee.ClickEventArgs = ClickEventArgs;
    var KeyEventArgs = (function () {
        function KeyEventArgs(keyCode, altPressed, ctrlPressed, shiftPressed, metaPressed, sender, nativeEvent) {
            this.keyCode = keyCode;
            this.altPressed = altPressed;
            this.ctrlPressed = ctrlPressed;
            this.shiftPressed = shiftPressed;
            this.metaPressed = metaPressed;
            this.sender = sender;
            this.nativeEvent = nativeEvent;
        }
        return KeyEventArgs;
    })();
    cubee.KeyEventArgs = KeyEventArgs;
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
    var ContextMenuEventArgs = (function () {
        function ContextMenuEventArgs(nativeEvent, sender) {
            this.nativeEvent = nativeEvent;
            this.sender = sender;
        }
        return ContextMenuEventArgs;
    })();
    cubee.ContextMenuEventArgs = ContextMenuEventArgs;
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
        Object.defineProperty(Color, "BLACK", {
            get: function () {
                return Color._BLACK;
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
        Color._BLACK = Color.getArgbColor(0xff000000);
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
        Object.defineProperty(AComponent.prototype, "Padding", {
            get: function () {
                return this._padding;
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
        Object.defineProperty(AComponent.prototype, "Border", {
            get: function () {
                return this._border;
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
        Object.defineProperty(AComponent.prototype, "MinWidth", {
            get: function () {
                return this._minWidth;
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
        Object.defineProperty(AComponent.prototype, "MinHeight", {
            get: function () {
                return this._minHeight;
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
        Object.defineProperty(AComponent.prototype, "MaxWidth", {
            get: function () {
                return this._maxWidth;
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
        Object.defineProperty(AComponent.prototype, "MaxHeight", {
            get: function () {
                return this._maxHeight;
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
        AComponent.prototype._doPointerEventClimbingUp = function (screenX, screenY, x, y, wheelVelocity, altPressed, ctrlPressed, shiftPressed, metaPressed, eventType, button, nativeEvent) {
            if (!this._handlePointer.value) {
                return false;
            }
            if (this._pointerTransparent.value) {
                return false;
            }
            if (this._enabled.value) {
                return true;
            }
            if (!this._visible.value) {
                return false;
            }
            this.onPointerEventClimbingUp(screenX, screenY, x, y, wheelVelocity, altPressed, ctrlPressed, shiftPressed, metaPressed, eventType, button);
            return this.onPointerEventFallingDown(screenX, screenY, x, y, wheelVelocity, altPressed, ctrlPressed, shiftPressed, metaPressed, eventType, button, nativeEvent);
        };
        AComponent.prototype.onPointerEventClimbingUp = function (screenX, screenY, x, y, wheelVelocity, altPressed, ctrlPressed, shiftPressed, metaPressed, eventType, button) {
            return true;
        };
        AComponent.prototype.onPointerEventFallingDown = function (screenX, screenY, x, y, wheelVelocity, altPressed, ctrlPressed, shiftPressed, metaPressed, eventType, button, nativeEvent) {
            switch (eventType) {
                case MouseEventTypes.MOUSE_DOWN:
                    var mdea = new cubee.MouseDownEventArgs(screenX, screenY, x, y, altPressed, ctrlPressed, shiftPressed, metaPressed, button, nativeEvent, this);
                    this._onMouseDown.fireEvent(mdea);
                    break;
                case MouseEventTypes.MOUSE_MOVE:
                    var mmea = new cubee.MouseMoveEventArgs(screenX, screenY, x, y, altPressed, ctrlPressed, shiftPressed, metaPressed, this);
                    this._onMouseMove.fireEvent(mmea);
                    break;
                case MouseEventTypes.MOUSE_ENTER:
                    this._onMouseEnter.fireEvent(new cubee.EventArgs(this));
                    break;
                case MouseEventTypes.MOUSE_LEAVE:
                    this._onMouseLeave.fireEvent(new cubee.EventArgs(this));
                    break;
                case MouseEventTypes.MOUSE_WHEEL:
                    this._onMouseWheel.fireEvent(new cubee.MouseWheelEventArgs(wheelVelocity, altPressed, ctrlPressed, shiftPressed, metaPressed, this));
                    break;
            }
            return true;
        };
        AComponent.prototype._isIntersectsPoint = function (x, y) {
            var x1 = this._left + this._translateX.value;
            var y1 = this._top + this._translateY.value;
            var x2 = x1 + this._measuredWidth.value;
            var y2 = y1;
            var x3 = x2;
            var y3 = y2 + this._measuredHeight.value;
            var x4 = x1;
            var y4 = y3;
            if (this._scaleX.value != 1.0) {
                x1 = (x1 - ((x2 - x1) * this._transformCenterX.value * this._scaleX.value)) | 0;
                x2 = (x1 + ((x2 - x1) * (1 - this._transformCenterX.value) * this._scaleX.value)) | 0;
                x3 = x2;
                x4 = x1;
            }
            if (this._scaleY.value != 1.0) {
                y1 = (y1 - ((y2 - y1) * this._transformCenterY.value * this._scaleY.value)) | 0;
                y4 = (y4 + ((y4 - y1) * (1 - this._transformCenterY.value) * this._scaleY.value)) | 0;
                y2 = y1;
                y3 = y4;
            }
            if (this.rotate != 0.0) {
                var rpx = (x1 + ((x2 - x1) * this.transformCenterX)) | 0;
                var rpy = (y1 + ((y4 - y1) * this.transformCenterX)) | 0;
                var tl = this.rotatePoint(0, 0, x1 - rpx, y1 - rpy, this.rotate);
                var tr = this.rotatePoint(0, 0, x2 - rpx, y2 - rpy, this.rotate);
                var br = this.rotatePoint(0, 0, x3 - rpx, y3 - rpy, this.rotate);
                var bl = this.rotatePoint(0, 0, x4 - rpx, y4 - rpy, this.rotate);
                x1 = tl.x + rpx;
                y1 = tl.y + rpy;
                x2 = tr.x + rpx;
                y2 = tr.y + rpy;
                x3 = br.x + rpx;
                y3 = br.y + rpy;
                x4 = bl.x + rpx;
                y4 = bl.y + rpy;
            }
            var cnt = 0;
            if (this.isPointIntersectsLine(x, y, x1, y1, x2, y2)) {
                cnt++;
            }
            if (this.isPointIntersectsLine(x, y, x2, y2, x3, y3)) {
                cnt++;
            }
            if (this.isPointIntersectsLine(x, y, x3, y3, x4, y4)) {
                cnt++;
            }
            if (this.isPointIntersectsLine(x, y, x4, y4, x1, y1)) {
                cnt++;
            }
            return cnt == 1 || cnt == 3;
        };
        AComponent.prototype.isPointIntersectsLine = function (px, py, lx1, ly1, lx2, ly2) {
            return ((ly1 > py) != (ly2 > py)) && (px < (lx2 - lx1) * ((py - ly1)) / (ly2 - ly1) + lx1);
        };
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
        ALayout.prototype._doPointerEventClimbingUp = function (screenX, screenY, x, y, wheelVelocity, altPressed, ctrlPressed, shiftPressed, metaPressed, type, button, event) {
            if (!this.handlePointer) {
                return false;
            }
            if (!this.enabled) {
                return true;
            }
            if (!this.visible) {
                return false;
            }
            if (this.onPointerEventClimbingUp(screenX, screenY, x, y, wheelVelocity, altPressed, ctrlPressed, shiftPressed, metaPressed, type, button)) {
                for (var i = this._children.size() - 1; i >= 0; i--) {
                    var child = this._children.get(i);
                    if (child != null) {
                        var parentX = x + this.element.scrollLeft;
                        var parentY = y + this.element.scrollTop;
                        var p = this.padding;
                        if (p != null) {
                            parentX -= p.left;
                            parentY -= p.top;
                        }
                        if (child._isIntersectsPoint(parentX, parentY)) {
                            var left = child.left + child.translateX;
                            var top_1 = child.top + child.translateY;
                            var tcx = (left + child.measuredWidth * child.transformCenterX) | 0;
                            var tcy = (top_1 + child.measuredHeight * child.transformCenterY) | 0;
                            var childPoint = this._rotatePoint(tcx, tcy, parentX, parentY, -child.rotate);
                            var childX = childPoint.x;
                            var childY = childPoint.y;
                            childX = childX - left;
                            childY = childY - top_1;
                            if (child._doPointerEventClimbingUp(screenX, screenY, childX, childY, wheelVelocity, altPressed, ctrlPressed, shiftPressed, metaPressed, type, button, event)) {
                                return true;
                            }
                        }
                    }
                }
            }
            if (this.pointerTransparent) {
                return false;
            }
            else {
                return this.onPointerEventFallingDown(screenX, screenY, x, y, wheelVelocity, altPressed, ctrlPressed, shiftPressed, metaPressed, type, button, event);
            }
        };
        ALayout.prototype._rotatePoint = function (cx, cy, x, y, angle) {
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
                        var l;
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
        Object.defineProperty(AUserControl.prototype, "_Width", {
            get: function () {
                return this._width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AUserControl.prototype, "Width", {
            get: function () {
                return this._width;
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
        Object.defineProperty(AUserControl.prototype, "_Height", {
            get: function () {
                return this._height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AUserControl.prototype, "Height", {
            get: function () {
                return this._height;
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
        Object.defineProperty(AUserControl.prototype, "_Background", {
            get: function () {
                return this._background;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AUserControl.prototype, "Background", {
            get: function () {
                return this._background;
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
        Object.defineProperty(AUserControl.prototype, "_Shadow", {
            get: function () {
                return this._shadow;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AUserControl.prototype, "Shadow", {
            get: function () {
                return this._shadow;
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
    var Panel = (function (_super) {
        __extends(Panel, _super);
        function Panel() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(Panel.prototype, "Width", {
            get: function () {
                return this._Width;
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
        Object.defineProperty(Panel.prototype, "Height", {
            get: function () {
                return this._Height;
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
        Object.defineProperty(Panel.prototype, "Background", {
            get: function () {
                return this._Background;
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
        Object.defineProperty(Panel.prototype, "Shadow", {
            get: function () {
                return this._Shadow;
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
        APopup.prototype._doPointerEventClimbingUp = function (screenX, screenY, x, y, wheelVelocity, altPressed, ctrlPressed, shiftPressed, metaPressed, eventType, button, nativeEvent) {
            return this._popupRoot._doPointerEventClimbingUp(screenX, screenY, x, y, wheelVelocity, altPressed, ctrlPressed, shiftPressed, metaPressed, eventType, button, nativeEvent);
        };
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
        Popups.doPointerEventClimbingUp = function (x, y, wheelVelocity, altPressed, ctrlPressed, shiftPressed, metaPressed, eventType, button, nativeEvent) {
            for (var i = Popups._popups.length - 1; i >= 0; i--) {
                var popup = Popups._popups[i];
                if (popup._doPointerEventClimbingUp(x, y, x, y, wheelVelocity, altPressed, ctrlPressed, shiftPressed, metaPressed, eventType, button, nativeEvent)) {
                    return true;
                }
            }
            return false;
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
/// <reference path="layouts/Panel.ts"/>  
/// <reference path="layouts/Hbox.ts"/>   
/// <reference path="layouts/Vbox.ts"/>    
/// <reference path="components/Label.ts"/>  
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
        CubeePanel.prototype._doPointerEventClimbingUp = function (screenX, screenY, wheelVelocity, altPressed, ctrlPressed, shiftPressed, metaPressed, eventType, button, nativeEvent) {
            if (cubee.Popups.doPointerEventClimbingUp(screenX, screenY, wheelVelocity, altPressed, ctrlPressed, shiftPressed, metaPressed, eventType, button, nativeEvent)) {
                return true;
            }
            if (this._element.style.position != "absolute") {
                screenX = screenX + window.scrollX - this._left;
                screenY = screenY + window.scrollY - this._top;
            }
            return this._contentPanel._doPointerEventClimbingUp(screenX, screenY, screenX, screenY, wheelVelocity, altPressed, ctrlPressed, shiftPressed, metaPressed, eventType, button, nativeEvent);
        };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3ViZWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9ldmVudHMudHMiLCIuLi8uLi9wcm9wZXJ0aWVzLnRzIiwiLi4vLi4vc3R5bGVzLnRzIiwiLi4vLi4vdXRpbHMudHMiLCIuLi8uLi9jb21wb25lbnRfYmFzZS9MYXlvdXRDaGlsZHJlbi50cyIsIi4uLy4uL2NvbXBvbmVudF9iYXNlL0FDb21wb25lbnQudHMiLCIuLi8uLi9jb21wb25lbnRfYmFzZS9BTGF5b3V0LnRzIiwiLi4vLi4vY29tcG9uZW50X2Jhc2UvQVVzZXJDb250cm9sLnRzIiwiLi4vLi4vbGF5b3V0cy9QYW5lbC50cyIsIi4uLy4uL2xheW91dHMvSEJveC50cyIsIi4uLy4uL2xheW91dHMvVkJveC50cyIsIi4uLy4uL2NvbXBvbmVudHMvbGFiZWwudHMiLCIuLi8uLi9wb3B1cHMudHMiLCIuLi8uLi9jdWJlZS50cyJdLCJuYW1lcyI6WyJjdWJlZSIsImN1YmVlLkV2ZW50QXJncyIsImN1YmVlLkV2ZW50QXJncy5jb25zdHJ1Y3RvciIsImN1YmVlLkV2ZW50IiwiY3ViZWUuRXZlbnQuY29uc3RydWN0b3IiLCJjdWJlZS5FdmVudC5FdmVudCIsImN1YmVlLkV2ZW50LmFkZExpc3RlbmVyIiwiY3ViZWUuRXZlbnQucmVtb3ZlTGlzdGVuZXIiLCJjdWJlZS5FdmVudC5oYXNMaXN0ZW5lciIsImN1YmVlLkV2ZW50LmZpcmVFdmVudCIsImN1YmVlLlRpbWVyIiwiY3ViZWUuVGltZXIuY29uc3RydWN0b3IiLCJjdWJlZS5UaW1lci5zdGFydCIsImN1YmVlLlRpbWVyLnN0b3AiLCJjdWJlZS5UaW1lci5TdGFydGVkIiwiY3ViZWUuRXZlbnRRdWV1ZSIsImN1YmVlLkV2ZW50UXVldWUuY29uc3RydWN0b3IiLCJjdWJlZS5FdmVudFF1ZXVlLkluc3RhbmNlIiwiY3ViZWUuRXZlbnRRdWV1ZS5pbnZva2VMYXRlciIsImN1YmVlLkV2ZW50UXVldWUuaW52b2tlUHJpb3IiLCJjdWJlZS5SdW5PbmNlIiwiY3ViZWUuUnVuT25jZS5jb25zdHJ1Y3RvciIsImN1YmVlLlJ1bk9uY2UucnVuIiwiY3ViZWUuTW91c2VEcmFnRXZlbnRBcmdzIiwiY3ViZWUuTW91c2VEcmFnRXZlbnRBcmdzLmNvbnN0cnVjdG9yIiwiY3ViZWUuTW91c2VVcEV2ZW50QXJncyIsImN1YmVlLk1vdXNlVXBFdmVudEFyZ3MuY29uc3RydWN0b3IiLCJjdWJlZS5Nb3VzZURvd25FdmVudEFyZ3MiLCJjdWJlZS5Nb3VzZURvd25FdmVudEFyZ3MuY29uc3RydWN0b3IiLCJjdWJlZS5Nb3VzZU1vdmVFdmVudEFyZ3MiLCJjdWJlZS5Nb3VzZU1vdmVFdmVudEFyZ3MuY29uc3RydWN0b3IiLCJjdWJlZS5Nb3VzZVdoZWVsRXZlbnRBcmdzIiwiY3ViZWUuTW91c2VXaGVlbEV2ZW50QXJncy5jb25zdHJ1Y3RvciIsImN1YmVlLkNsaWNrRXZlbnRBcmdzIiwiY3ViZWUuQ2xpY2tFdmVudEFyZ3MuY29uc3RydWN0b3IiLCJjdWJlZS5LZXlFdmVudEFyZ3MiLCJjdWJlZS5LZXlFdmVudEFyZ3MuY29uc3RydWN0b3IiLCJjdWJlZS5QYXJlbnRDaGFuZ2VkRXZlbnRBcmdzIiwiY3ViZWUuUGFyZW50Q2hhbmdlZEV2ZW50QXJncy5jb25zdHJ1Y3RvciIsImN1YmVlLkNvbnRleHRNZW51RXZlbnRBcmdzIiwiY3ViZWUuQ29udGV4dE1lbnVFdmVudEFyZ3MuY29uc3RydWN0b3IiLCJjdWJlZS5Qcm9wZXJ0eSIsImN1YmVlLlByb3BlcnR5LmNvbnN0cnVjdG9yIiwiY3ViZWUuUHJvcGVydHkuaWQiLCJjdWJlZS5Qcm9wZXJ0eS52YWxpZCIsImN1YmVlLlByb3BlcnR5LnZhbHVlIiwiY3ViZWUuUHJvcGVydHkubnVsbGFibGUiLCJjdWJlZS5Qcm9wZXJ0eS5yZWFkb25seSIsImN1YmVlLlByb3BlcnR5LmluaXRSZWFkb25seUJpbmQiLCJjdWJlZS5Qcm9wZXJ0eS5nZXQiLCJjdWJlZS5Qcm9wZXJ0eS5zZXQiLCJjdWJlZS5Qcm9wZXJ0eS5pbnZhbGlkYXRlIiwiY3ViZWUuUHJvcGVydHkuaW52YWxpZGF0ZUlmTmVlZGVkIiwiY3ViZWUuUHJvcGVydHkuZmlyZUNoYW5nZUxpc3RlbmVycyIsImN1YmVlLlByb3BlcnR5LmdldE9iamVjdFZhbHVlIiwiY3ViZWUuUHJvcGVydHkuYWRkQ2hhbmdlTGlzdGVuZXIiLCJjdWJlZS5Qcm9wZXJ0eS5yZW1vdmVDaGFuZ2VMaXN0ZW5lciIsImN1YmVlLlByb3BlcnR5Lmhhc0NoYW5nZUxpc3RlbmVyIiwiY3ViZWUuUHJvcGVydHkuYW5pbWF0ZSIsImN1YmVlLlByb3BlcnR5LmJpbmQiLCJjdWJlZS5Qcm9wZXJ0eS5iaWRpcmVjdGlvbmFsQmluZCIsImN1YmVlLlByb3BlcnR5LnVuYmluZCIsImN1YmVlLlByb3BlcnR5LnVuYmluZFRhcmdldHMiLCJjdWJlZS5Qcm9wZXJ0eS5pc0JvdW5kIiwiY3ViZWUuUHJvcGVydHkuaXNCaWRpcmVjdGlvbmFsQm91bmQiLCJjdWJlZS5Qcm9wZXJ0eS5jcmVhdGVQcm9wZXJ0eUxpbmUiLCJjdWJlZS5Qcm9wZXJ0eS5kZXN0cm95IiwiY3ViZWUuRXhwcmVzc2lvbiIsImN1YmVlLkV4cHJlc3Npb24uY29uc3RydWN0b3IiLCJjdWJlZS5FeHByZXNzaW9uLnZhbHVlIiwiY3ViZWUuRXhwcmVzc2lvbi5hZGRDaGFuZ2VMaXN0ZW5lciIsImN1YmVlLkV4cHJlc3Npb24ucmVtb3ZlQ2hhbmdlTGlzdGVuZXIiLCJjdWJlZS5FeHByZXNzaW9uLmhhc0NoYW5nZUxpc3RlbmVyIiwiY3ViZWUuRXhwcmVzc2lvbi5nZXRPYmplY3RWYWx1ZSIsImN1YmVlLkV4cHJlc3Npb24uYmluZCIsImN1YmVlLkV4cHJlc3Npb24udW5iaW5kQWxsIiwiY3ViZWUuRXhwcmVzc2lvbi51bmJpbmQiLCJjdWJlZS5FeHByZXNzaW9uLmludmFsaWRhdGUiLCJjdWJlZS5FeHByZXNzaW9uLmludmFsaWRhdGVJZk5lZWRlZCIsImN1YmVlLkV4cHJlc3Npb24uZmlyZUNoYW5nZUxpc3RlbmVycyIsImN1YmVlLktleUZyYW1lIiwiY3ViZWUuS2V5RnJhbWUuY29uc3RydWN0b3IiLCJjdWJlZS5LZXlGcmFtZS50aW1lIiwiY3ViZWUuS2V5RnJhbWUucHJvcGVydHkiLCJjdWJlZS5LZXlGcmFtZS5lbmRWYWx1ZSIsImN1YmVlLktleUZyYW1lLmludGVycG9sYXRvciIsImN1YmVlLktleUZyYW1lLmtleUZyYW1lUmVhY2hlZExpc3RlbmVyIiwiY3ViZWUuUHJvcGVydHlMaW5lIiwiY3ViZWUuUHJvcGVydHlMaW5lLmNvbnN0cnVjdG9yIiwiY3ViZWUuUHJvcGVydHlMaW5lLnN0YXJ0VGltZSIsImN1YmVlLlByb3BlcnR5TGluZS5hbmltYXRlIiwiY3ViZWUuSW50ZXJwb2xhdG9ycyIsImN1YmVlLkludGVycG9sYXRvcnMuY29uc3RydWN0b3IiLCJjdWJlZS5JbnRlcnBvbGF0b3JzLkxpbmVhciIsImN1YmVlLkFBbmltYXRvciIsImN1YmVlLkFBbmltYXRvci5jb25zdHJ1Y3RvciIsImN1YmVlLkFBbmltYXRvci5hbmltYXRlIiwiY3ViZWUuQUFuaW1hdG9yLnN0YXJ0IiwiY3ViZWUuQUFuaW1hdG9yLnN0b3AiLCJjdWJlZS5BQW5pbWF0b3IuU3RhcnRlZCIsImN1YmVlLkFBbmltYXRvci5TdG9wcGVkIiwiY3ViZWUuVGltZWxpbmUiLCJjdWJlZS5UaW1lbGluZS5jb25zdHJ1Y3RvciIsImN1YmVlLlRpbWVsaW5lLmNyZWF0ZVByb3BlcnR5TGluZXMiLCJjdWJlZS5UaW1lbGluZS5zdGFydCIsImN1YmVlLlRpbWVsaW5lLnN0b3AiLCJjdWJlZS5UaW1lbGluZS5vbkFuaW1hdGUiLCJjdWJlZS5UaW1lbGluZS5vbkZpbmlzaGVkRXZlbnQiLCJjdWJlZS5UaW1lbGluZUZpbmlzaGVkRXZlbnRBcmdzIiwiY3ViZWUuVGltZWxpbmVGaW5pc2hlZEV2ZW50QXJncy5jb25zdHJ1Y3RvciIsImN1YmVlLlRpbWVsaW5lRmluaXNoZWRFdmVudEFyZ3MuU3RvcHBlZCIsImN1YmVlLk51bWJlclByb3BlcnR5IiwiY3ViZWUuTnVtYmVyUHJvcGVydHkuY29uc3RydWN0b3IiLCJjdWJlZS5OdW1iZXJQcm9wZXJ0eS5hbmltYXRlIiwiY3ViZWUuU3RyaW5nUHJvcGVydHkiLCJjdWJlZS5TdHJpbmdQcm9wZXJ0eS5jb25zdHJ1Y3RvciIsImN1YmVlLlBhZGRpbmdQcm9wZXJ0eSIsImN1YmVlLlBhZGRpbmdQcm9wZXJ0eS5jb25zdHJ1Y3RvciIsImN1YmVlLkJvcmRlclByb3BlcnR5IiwiY3ViZWUuQm9yZGVyUHJvcGVydHkuY29uc3RydWN0b3IiLCJjdWJlZS5CYWNrZ3JvdW5kUHJvcGVydHkiLCJjdWJlZS5CYWNrZ3JvdW5kUHJvcGVydHkuY29uc3RydWN0b3IiLCJjdWJlZS5Cb29sZWFuUHJvcGVydHkiLCJjdWJlZS5Cb29sZWFuUHJvcGVydHkuY29uc3RydWN0b3IiLCJjdWJlZS5Db2xvclByb3BlcnR5IiwiY3ViZWUuQ29sb3JQcm9wZXJ0eS5jb25zdHJ1Y3RvciIsImN1YmVlLkFCYWNrZ3JvdW5kIiwiY3ViZWUuQUJhY2tncm91bmQuY29uc3RydWN0b3IiLCJjdWJlZS5Db2xvciIsImN1YmVlLkNvbG9yLmNvbnN0cnVjdG9yIiwiY3ViZWUuQ29sb3IuVFJBTlNQQVJFTlQiLCJjdWJlZS5Db2xvci5CTEFDSyIsImN1YmVlLkNvbG9yLmdldEFyZ2JDb2xvciIsImN1YmVlLkNvbG9yLmdldEFyZ2JDb2xvckJ5Q29tcG9uZW50cyIsImN1YmVlLkNvbG9yLmdldFJnYkNvbG9yIiwiY3ViZWUuQ29sb3IuZ2V0UmdiQ29sb3JCeUNvbXBvbmVudHMiLCJjdWJlZS5Db2xvci5maXhDb21wb25lbnQiLCJjdWJlZS5Db2xvci5mYWRlQ29sb3JzIiwiY3ViZWUuQ29sb3IubWl4Q29tcG9uZW50IiwiY3ViZWUuQ29sb3IuYXJnYiIsImN1YmVlLkNvbG9yLmFscGhhIiwiY3ViZWUuQ29sb3IucmVkIiwiY3ViZWUuQ29sb3IuZ3JlZW4iLCJjdWJlZS5Db2xvci5ibHVlIiwiY3ViZWUuQ29sb3IuZmFkZSIsImN1YmVlLkNvbG9yLnRvQ1NTIiwiY3ViZWUuQ29sb3JCYWNrZ3JvdW5kIiwiY3ViZWUuQ29sb3JCYWNrZ3JvdW5kLmNvbnN0cnVjdG9yIiwiY3ViZWUuQ29sb3JCYWNrZ3JvdW5kLmNvbG9yIiwiY3ViZWUuQ29sb3JCYWNrZ3JvdW5kLmFwcGx5IiwiY3ViZWUuUGFkZGluZyIsImN1YmVlLlBhZGRpbmcuY29uc3RydWN0b3IiLCJjdWJlZS5QYWRkaW5nLmNyZWF0ZSIsImN1YmVlLlBhZGRpbmcubGVmdCIsImN1YmVlLlBhZGRpbmcudG9wIiwiY3ViZWUuUGFkZGluZy5yaWdodCIsImN1YmVlLlBhZGRpbmcuYm90dG9tIiwiY3ViZWUuUGFkZGluZy5hcHBseSIsImN1YmVlLkJvcmRlciIsImN1YmVlLkJvcmRlci5jb25zdHJ1Y3RvciIsImN1YmVlLkJvcmRlci5jcmVhdGUiLCJjdWJlZS5Cb3JkZXIubGVmdFdpZHRoIiwiY3ViZWUuQm9yZGVyLnRvcFdpZHRoIiwiY3ViZWUuQm9yZGVyLnJpZ2h0V2lkdGgiLCJjdWJlZS5Cb3JkZXIuYm90dG9tV2lkdGgiLCJjdWJlZS5Cb3JkZXIubGVmdENvbG9yIiwiY3ViZWUuQm9yZGVyLnRvcENvbG9yIiwiY3ViZWUuQm9yZGVyLnJpZ2h0Q29sb3IiLCJjdWJlZS5Cb3JkZXIuYm90dG9tQ29sb3IiLCJjdWJlZS5Cb3JkZXIudG9wTGVmdFJhZGl1cyIsImN1YmVlLkJvcmRlci50b3BSaWdodFJhZGl1cyIsImN1YmVlLkJvcmRlci5ib3R0b21MZWZ0UmFkaXVzIiwiY3ViZWUuQm9yZGVyLmJvdHRvbVJpZ2h0UmFkaXVzIiwiY3ViZWUuQm9yZGVyLmFwcGx5IiwiY3ViZWUuQm94U2hhZG93IiwiY3ViZWUuQm94U2hhZG93LmNvbnN0cnVjdG9yIiwiY3ViZWUuQm94U2hhZG93LmhQb3MiLCJjdWJlZS5Cb3hTaGFkb3cudlBvcyIsImN1YmVlLkJveFNoYWRvdy5ibHVyIiwiY3ViZWUuQm94U2hhZG93LnNwcmVhZCIsImN1YmVlLkJveFNoYWRvdy5jb2xvciIsImN1YmVlLkJveFNoYWRvdy5pbm5lciIsImN1YmVlLkJveFNoYWRvdy5hcHBseSIsImN1YmVlLkVUZXh0T3ZlcmZsb3ciLCJjdWJlZS5FVGV4dE92ZXJmbG93LmNvbnN0cnVjdG9yIiwiY3ViZWUuRVRleHRPdmVyZmxvdy5DTElQIiwiY3ViZWUuRVRleHRPdmVyZmxvdy5FTExJUFNJUyIsImN1YmVlLkVUZXh0T3ZlcmZsb3cuQ1NTIiwiY3ViZWUuRVRleHRPdmVyZmxvdy5hcHBseSIsImN1YmVlLkVUZXh0QWxpZ24iLCJjdWJlZS5FVGV4dEFsaWduLmNvbnN0cnVjdG9yIiwiY3ViZWUuRVRleHRBbGlnbi5MRUZUIiwiY3ViZWUuRVRleHRBbGlnbi5DRU5URVIiLCJjdWJlZS5FVGV4dEFsaWduLlJJR0hUIiwiY3ViZWUuRVRleHRBbGlnbi5KVVNUSUZZIiwiY3ViZWUuRVRleHRBbGlnbi5DU1MiLCJjdWJlZS5FVGV4dEFsaWduLmFwcGx5IiwiY3ViZWUuRUhBbGlnbiIsImN1YmVlLkVIQWxpZ24uY29uc3RydWN0b3IiLCJjdWJlZS5FSEFsaWduLkxFRlQiLCJjdWJlZS5FSEFsaWduLkNFTlRFUiIsImN1YmVlLkVIQWxpZ24uUklHSFQiLCJjdWJlZS5FSEFsaWduLkNTUyIsImN1YmVlLkVWQWxpZ24iLCJjdWJlZS5FVkFsaWduLmNvbnN0cnVjdG9yIiwiY3ViZWUuRVZBbGlnbi5UT1AiLCJjdWJlZS5FVkFsaWduLk1JRERMRSIsImN1YmVlLkVWQWxpZ24uQk9UVE9NIiwiY3ViZWUuRVZBbGlnbi5DU1MiLCJjdWJlZS5Gb250RmFtaWx5IiwiY3ViZWUuRm9udEZhbWlseS5jb25zdHJ1Y3RvciIsImN1YmVlLkZvbnRGYW1pbHkuQXJpYWwiLCJjdWJlZS5Gb250RmFtaWx5LmluaXRGb250Q29udGFpbmVyU3R5bGUiLCJjdWJlZS5Gb250RmFtaWx5LnJlZ2lzdGVyRm9udCIsImN1YmVlLkZvbnRGYW1pbHkuQ1NTIiwiY3ViZWUuRm9udEZhbWlseS5hcHBseSIsImN1YmVlLkVDdXJzb3IiLCJjdWJlZS5FQ3Vyc29yLmNvbnN0cnVjdG9yIiwiY3ViZWUuRUN1cnNvci5BVVRPIiwiY3ViZWUuRUN1cnNvci5jc3MiLCJjdWJlZS5Qb2ludDJEIiwiY3ViZWUuUG9pbnQyRC5jb25zdHJ1Y3RvciIsImN1YmVlLlBvaW50MkQueCIsImN1YmVlLlBvaW50MkQueSIsImN1YmVlLkxheW91dENoaWxkcmVuIiwiY3ViZWUuTGF5b3V0Q2hpbGRyZW4uY29uc3RydWN0b3IiLCJjdWJlZS5MYXlvdXRDaGlsZHJlbi5hZGQiLCJjdWJlZS5MYXlvdXRDaGlsZHJlbi5pbnNlcnQiLCJjdWJlZS5MYXlvdXRDaGlsZHJlbi5yZW1vdmVDb21wb25lbnQiLCJjdWJlZS5MYXlvdXRDaGlsZHJlbi5yZW1vdmVJbmRleCIsImN1YmVlLkxheW91dENoaWxkcmVuLmNsZWFyIiwiY3ViZWUuTGF5b3V0Q2hpbGRyZW4uZ2V0IiwiY3ViZWUuTGF5b3V0Q2hpbGRyZW4uaW5kZXhPZiIsImN1YmVlLkxheW91dENoaWxkcmVuLnNpemUiLCJjdWJlZS5Nb3VzZUV2ZW50VHlwZXMiLCJjdWJlZS5Nb3VzZUV2ZW50VHlwZXMuY29uc3RydWN0b3IiLCJjdWJlZS5BQ29tcG9uZW50IiwiY3ViZWUuQUNvbXBvbmVudC5jb25zdHJ1Y3RvciIsImN1YmVlLkFDb21wb25lbnQuaW52b2tlUG9zdENvbnN0cnVjdCIsImN1YmVlLkFDb21wb25lbnQucG9zdENvbnN0cnVjdCIsImN1YmVlLkFDb21wb25lbnQuc2V0Q3ViZWVQYW5lbCIsImN1YmVlLkFDb21wb25lbnQuZ2V0Q3ViZWVQYW5lbCIsImN1YmVlLkFDb21wb25lbnQudXBkYXRlVHJhbnNmb3JtIiwiY3ViZWUuQUNvbXBvbmVudC5yZXF1ZXN0TGF5b3V0IiwiY3ViZWUuQUNvbXBvbmVudC5tZWFzdXJlIiwiY3ViZWUuQUNvbXBvbmVudC5vbk1lYXN1cmUiLCJjdWJlZS5BQ29tcG9uZW50LnNjYWxlUG9pbnQiLCJjdWJlZS5BQ29tcG9uZW50LnJvdGF0ZVBvaW50IiwiY3ViZWUuQUNvbXBvbmVudC5lbGVtZW50IiwiY3ViZWUuQUNvbXBvbmVudC5wYXJlbnQiLCJjdWJlZS5BQ29tcG9uZW50Ll9zZXRQYXJlbnQiLCJjdWJlZS5BQ29tcG9uZW50LmxheW91dCIsImN1YmVlLkFDb21wb25lbnQubmVlZHNMYXlvdXQiLCJjdWJlZS5BQ29tcG9uZW50LlRyYW5zbGF0ZVgiLCJjdWJlZS5BQ29tcG9uZW50LnRyYW5zbGF0ZVgiLCJjdWJlZS5BQ29tcG9uZW50LlRyYW5zbGF0ZVkiLCJjdWJlZS5BQ29tcG9uZW50LnRyYW5zbGF0ZVkiLCJjdWJlZS5BQ29tcG9uZW50LlBhZGRpbmciLCJjdWJlZS5BQ29tcG9uZW50LnBhZGRpbmciLCJjdWJlZS5BQ29tcG9uZW50LkJvcmRlciIsImN1YmVlLkFDb21wb25lbnQuYm9yZGVyIiwiY3ViZWUuQUNvbXBvbmVudC5NZWFzdXJlZFdpZHRoIiwiY3ViZWUuQUNvbXBvbmVudC5tZWFzdXJlZFdpZHRoIiwiY3ViZWUuQUNvbXBvbmVudC5NZWFzdXJlZEhlaWdodCIsImN1YmVlLkFDb21wb25lbnQubWVhc3VyZWRIZWlnaHQiLCJjdWJlZS5BQ29tcG9uZW50LkNsaWVudFdpZHRoIiwiY3ViZWUuQUNvbXBvbmVudC5jbGllbnRXaWR0aCIsImN1YmVlLkFDb21wb25lbnQuQ2xpZW50SGVpZ2h0IiwiY3ViZWUuQUNvbXBvbmVudC5jbGllbnRIZWlnaHQiLCJjdWJlZS5BQ29tcG9uZW50LkJvdW5kc1dpZHRoIiwiY3ViZWUuQUNvbXBvbmVudC5ib3VuZHNXaWR0aCIsImN1YmVlLkFDb21wb25lbnQuQm91bmRzSGVpZ2h0IiwiY3ViZWUuQUNvbXBvbmVudC5ib3VuZHNIZWlnaHQiLCJjdWJlZS5BQ29tcG9uZW50LkJvdW5kc0xlZnQiLCJjdWJlZS5BQ29tcG9uZW50LmJvdW5kc0xlZnQiLCJjdWJlZS5BQ29tcG9uZW50LkJvdW5kc1RvcCIsImN1YmVlLkFDb21wb25lbnQuYm91bmRzVG9wIiwiY3ViZWUuQUNvbXBvbmVudC5NaW5XaWR0aCIsImN1YmVlLkFDb21wb25lbnQubWluV2lkdGgiLCJjdWJlZS5BQ29tcG9uZW50Lk1pbkhlaWdodCIsImN1YmVlLkFDb21wb25lbnQubWluSGVpZ2h0IiwiY3ViZWUuQUNvbXBvbmVudC5NYXhXaWR0aCIsImN1YmVlLkFDb21wb25lbnQubWF4V2lkdGgiLCJjdWJlZS5BQ29tcG9uZW50Lk1heEhlaWdodCIsImN1YmVlLkFDb21wb25lbnQubWF4SGVpZ2h0IiwiY3ViZWUuQUNvbXBvbmVudC5zZXRQb3NpdGlvbiIsImN1YmVlLkFDb21wb25lbnQuX3NldExlZnQiLCJjdWJlZS5BQ29tcG9uZW50Ll9zZXRUb3AiLCJjdWJlZS5BQ29tcG9uZW50LnNldFNpemUiLCJjdWJlZS5BQ29tcG9uZW50LkN1cnNvciIsImN1YmVlLkFDb21wb25lbnQuY3Vyc29yIiwiY3ViZWUuQUNvbXBvbmVudC5Qb2ludGVyVHJhbnNwYXJlbnQiLCJjdWJlZS5BQ29tcG9uZW50LnBvaW50ZXJUcmFuc3BhcmVudCIsImN1YmVlLkFDb21wb25lbnQuVmlzaWJsZSIsImN1YmVlLkFDb21wb25lbnQudmlzaWJsZSIsImN1YmVlLkFDb21wb25lbnQub25DbGljayIsImN1YmVlLkFDb21wb25lbnQub25Db250ZXh0TWVudSIsImN1YmVlLkFDb21wb25lbnQub25Nb3VzZURvd24iLCJjdWJlZS5BQ29tcG9uZW50Lm9uTW91c2VNb3ZlIiwiY3ViZWUuQUNvbXBvbmVudC5vbk1vdXNlVXAiLCJjdWJlZS5BQ29tcG9uZW50Lm9uTW91c2VFbnRlciIsImN1YmVlLkFDb21wb25lbnQub25Nb3VzZUxlYXZlIiwiY3ViZWUuQUNvbXBvbmVudC5vbk1vdXNlV2hlZWwiLCJjdWJlZS5BQ29tcG9uZW50Lm9uS2V5RG93biIsImN1YmVlLkFDb21wb25lbnQub25LZXlQcmVzcyIsImN1YmVlLkFDb21wb25lbnQub25LZXlVcCIsImN1YmVlLkFDb21wb25lbnQub25QYXJlbnRDaGFuZ2VkIiwiY3ViZWUuQUNvbXBvbmVudC5BbHBoYSIsImN1YmVlLkFDb21wb25lbnQuYWxwaGEiLCJjdWJlZS5BQ29tcG9uZW50LkhhbmRsZVBvaW50ZXIiLCJjdWJlZS5BQ29tcG9uZW50LmhhbmRsZVBvaW50ZXIiLCJjdWJlZS5BQ29tcG9uZW50LkVuYWJsZWQiLCJjdWJlZS5BQ29tcG9uZW50LmVuYWJsZWQiLCJjdWJlZS5BQ29tcG9uZW50LlNlbGVjdGFibGUiLCJjdWJlZS5BQ29tcG9uZW50LnNlbGVjdGFibGUiLCJjdWJlZS5BQ29tcG9uZW50LmxlZnQiLCJjdWJlZS5BQ29tcG9uZW50LnRvcCIsImN1YmVlLkFDb21wb25lbnQuX2RvUG9pbnRlckV2ZW50Q2xpbWJpbmdVcCIsImN1YmVlLkFDb21wb25lbnQub25Qb2ludGVyRXZlbnRDbGltYmluZ1VwIiwiY3ViZWUuQUNvbXBvbmVudC5vblBvaW50ZXJFdmVudEZhbGxpbmdEb3duIiwiY3ViZWUuQUNvbXBvbmVudC5faXNJbnRlcnNlY3RzUG9pbnQiLCJjdWJlZS5BQ29tcG9uZW50LmlzUG9pbnRJbnRlcnNlY3RzTGluZSIsImN1YmVlLkFDb21wb25lbnQuUm90YXRlIiwiY3ViZWUuQUNvbXBvbmVudC5yb3RhdGUiLCJjdWJlZS5BQ29tcG9uZW50LlNjYWxlWCIsImN1YmVlLkFDb21wb25lbnQuc2NhbGVYIiwiY3ViZWUuQUNvbXBvbmVudC5TY2FsZVkiLCJjdWJlZS5BQ29tcG9uZW50LnNjYWxlWSIsImN1YmVlLkFDb21wb25lbnQuVHJhbnNmb3JtQ2VudGVyWCIsImN1YmVlLkFDb21wb25lbnQudHJhbnNmb3JtQ2VudGVyWCIsImN1YmVlLkFDb21wb25lbnQuVHJhbnNmb3JtQ2VudGVyWSIsImN1YmVlLkFDb21wb25lbnQudHJhbnNmb3JtQ2VudGVyWSIsImN1YmVlLkFDb21wb25lbnQuSG92ZXJlZCIsImN1YmVlLkFDb21wb25lbnQuaG92ZXJlZCIsImN1YmVlLkFDb21wb25lbnQuUHJlc3NlZCIsImN1YmVlLkFDb21wb25lbnQucHJlc3NlZCIsImN1YmVlLkFMYXlvdXQiLCJjdWJlZS5BTGF5b3V0LmNvbnN0cnVjdG9yIiwiY3ViZWUuQUxheW91dC5jaGlsZHJlbl9pbm5lciIsImN1YmVlLkFMYXlvdXQubGF5b3V0IiwiY3ViZWUuQUxheW91dC5fZG9Qb2ludGVyRXZlbnRDbGltYmluZ1VwIiwiY3ViZWUuQUxheW91dC5fcm90YXRlUG9pbnQiLCJjdWJlZS5BTGF5b3V0LmdldENvbXBvbmVudHNBdFBvc2l0aW9uIiwiY3ViZWUuQUxheW91dC5nZXRDb21wb25lbnRzQXRQb3NpdGlvbl9pbXBsIiwiY3ViZWUuQUxheW91dC5zZXRDaGlsZExlZnQiLCJjdWJlZS5BTGF5b3V0LnNldENoaWxkVG9wIiwiY3ViZWUuQVVzZXJDb250cm9sIiwiY3ViZWUuQVVzZXJDb250cm9sLmNvbnN0cnVjdG9yIiwiY3ViZWUuQVVzZXJDb250cm9sLl9XaWR0aCIsImN1YmVlLkFVc2VyQ29udHJvbC5XaWR0aCIsImN1YmVlLkFVc2VyQ29udHJvbC53aWR0aCIsImN1YmVlLkFVc2VyQ29udHJvbC5fSGVpZ2h0IiwiY3ViZWUuQVVzZXJDb250cm9sLkhlaWdodCIsImN1YmVlLkFVc2VyQ29udHJvbC5oZWlnaHQiLCJjdWJlZS5BVXNlckNvbnRyb2wuX0JhY2tncm91bmQiLCJjdWJlZS5BVXNlckNvbnRyb2wuQmFja2dyb3VuZCIsImN1YmVlLkFVc2VyQ29udHJvbC5iYWNrZ3JvdW5kIiwiY3ViZWUuQVVzZXJDb250cm9sLl9TaGFkb3ciLCJjdWJlZS5BVXNlckNvbnRyb2wuU2hhZG93IiwiY3ViZWUuQVVzZXJDb250cm9sLnNoYWRvdyIsImN1YmVlLkFVc2VyQ29udHJvbC5EcmFnZ2FibGUiLCJjdWJlZS5BVXNlckNvbnRyb2wuZHJhZ2dhYmxlIiwiY3ViZWUuQVVzZXJDb250cm9sLl9vbkNoaWxkQWRkZWQiLCJjdWJlZS5BVXNlckNvbnRyb2wuX29uQ2hpbGRSZW1vdmVkIiwiY3ViZWUuQVVzZXJDb250cm9sLl9vbkNoaWxkcmVuQ2xlYXJlZCIsImN1YmVlLkFVc2VyQ29udHJvbC5vbkxheW91dCIsImN1YmVlLlBhbmVsIiwiY3ViZWUuUGFuZWwuY29uc3RydWN0b3IiLCJjdWJlZS5QYW5lbC5XaWR0aCIsImN1YmVlLlBhbmVsLndpZHRoIiwiY3ViZWUuUGFuZWwuSGVpZ2h0IiwiY3ViZWUuUGFuZWwuaGVpZ2h0IiwiY3ViZWUuUGFuZWwuQmFja2dyb3VuZCIsImN1YmVlLlBhbmVsLmJhY2tncm91bmQiLCJjdWJlZS5QYW5lbC5TaGFkb3ciLCJjdWJlZS5QYW5lbC5zaGFkb3ciLCJjdWJlZS5QYW5lbC5jaGlsZHJlbiIsImN1YmVlLkhCb3giLCJjdWJlZS5IQm94LmNvbnN0cnVjdG9yIiwiY3ViZWUuSEJveC5zZXRDZWxsV2lkdGgiLCJjdWJlZS5IQm94LmdldENlbGxXaWR0aCIsImN1YmVlLkhCb3guc2V0Q2VsbEhBbGlnbiIsImN1YmVlLkhCb3guZ2V0Q2VsbEhBbGlnbiIsImN1YmVlLkhCb3guc2V0Q2VsbFZBbGlnbiIsImN1YmVlLkhCb3guZ2V0Q2VsbFZBbGlnbiIsImN1YmVlLkhCb3guc2V0TGFzdENlbGxIQWxpZ24iLCJjdWJlZS5IQm94LnNldExhc3RDZWxsVkFsaWduIiwiY3ViZWUuSEJveC5zZXRMYXN0Q2VsbFdpZHRoIiwiY3ViZWUuSEJveC5hZGRFbXB0eUNlbGwiLCJjdWJlZS5IQm94Ll9vbkNoaWxkQWRkZWQiLCJjdWJlZS5IQm94Ll9vbkNoaWxkUmVtb3ZlZCIsImN1YmVlLkhCb3guX29uQ2hpbGRyZW5DbGVhcmVkIiwiY3ViZWUuSEJveC5vbkxheW91dCIsImN1YmVlLkhCb3guc2V0SW5MaXN0IiwiY3ViZWUuSEJveC5nZXRGcm9tTGlzdCIsImN1YmVlLkhCb3gucmVtb3ZlRnJvbUxpc3QiLCJjdWJlZS5IQm94LmNoaWxkcmVuIiwiY3ViZWUuSEJveC5IZWlnaHQiLCJjdWJlZS5IQm94LmhlaWdodCIsImN1YmVlLlZCb3giLCJjdWJlZS5WQm94LmNvbnN0cnVjdG9yIiwiY3ViZWUuVkJveC5jaGlsZHJlbiIsImN1YmVlLlZCb3guc2V0Q2VsbEhlaWdodCIsImN1YmVlLlZCb3guc2V0SW5MaXN0IiwiY3ViZWUuVkJveC5nZXRGcm9tTGlzdCIsImN1YmVlLlZCb3gucmVtb3ZlRnJvbUxpc3QiLCJjdWJlZS5WQm94LmdldENlbGxIZWlnaHQiLCJjdWJlZS5WQm94LnNldENlbGxIQWxpZ24iLCJjdWJlZS5WQm94LmdldENlbGxIQWxpZ24iLCJjdWJlZS5WQm94LnNldENlbGxWQWxpZ24iLCJjdWJlZS5WQm94LmdldENlbGxWQWxpZ24iLCJjdWJlZS5WQm94LnNldExhc3RDZWxsSEFsaWduIiwiY3ViZWUuVkJveC5zZXRMYXN0Q2VsbFZBbGlnbiIsImN1YmVlLlZCb3guc2V0TGFzdENlbGxIZWlnaHQiLCJjdWJlZS5WQm94LmFkZEVtcHR5Q2VsbCIsImN1YmVlLlZCb3guV2lkdGgiLCJjdWJlZS5WQm94LndpZHRoIiwiY3ViZWUuVkJveC5fb25DaGlsZEFkZGVkIiwiY3ViZWUuVkJveC5fb25DaGlsZFJlbW92ZWQiLCJjdWJlZS5WQm94Ll9vbkNoaWxkcmVuQ2xlYXJlZCIsImN1YmVlLlZCb3gub25MYXlvdXQiLCJjdWJlZS5MYWJlbCIsImN1YmVlLkxhYmVsLmNvbnN0cnVjdG9yIiwiY3ViZWUuTGFiZWwuV2lkdGgiLCJjdWJlZS5MYWJlbC53aWR0aCIsImN1YmVlLkxhYmVsLkhlaWdodCIsImN1YmVlLkxhYmVsLmhlaWdodCIsImN1YmVlLkxhYmVsLlRleHQiLCJjdWJlZS5MYWJlbC50ZXh0IiwiY3ViZWUuTGFiZWwuVGV4dE92ZXJmbG93IiwiY3ViZWUuTGFiZWwudGV4dE92ZXJmbG93IiwiY3ViZWUuTGFiZWwuRm9yZUNvbG9yIiwiY3ViZWUuTGFiZWwuZm9yZUNvbG9yIiwiY3ViZWUuTGFiZWwuVmVydGljYWxBbGlnbiIsImN1YmVlLkxhYmVsLnZlcnRpY2FsQWxpZ24iLCJjdWJlZS5MYWJlbC5Cb2xkIiwiY3ViZWUuTGFiZWwuYm9sZCIsImN1YmVlLkxhYmVsLkl0YWxpYyIsImN1YmVlLkxhYmVsLml0YWxpYyIsImN1YmVlLkxhYmVsLlVuZGVybGluZSIsImN1YmVlLkxhYmVsLnVuZGVybGluZSIsImN1YmVlLkxhYmVsLlRleHRBbGlnbiIsImN1YmVlLkxhYmVsLnRleHRBbGlnbiIsImN1YmVlLkxhYmVsLkZvbnRTaXplIiwiY3ViZWUuTGFiZWwuZm9udFNpemUiLCJjdWJlZS5MYWJlbC5Gb250RmFtaWx5IiwiY3ViZWUuTGFiZWwuZm9udEZhbWlseSIsImN1YmVlLkFQb3B1cCIsImN1YmVlLkFQb3B1cC5jb25zdHJ1Y3RvciIsImN1YmVlLkFQb3B1cC5fX19wb3B1cFJvb3QiLCJjdWJlZS5BUG9wdXAucm9vdENvbXBvbmVudCIsImN1YmVlLkFQb3B1cC5zaG93IiwiY3ViZWUuQVBvcHVwLmNsb3NlIiwiY3ViZWUuQVBvcHVwLmlzQ2xvc2VBbGxvd2VkIiwiY3ViZWUuQVBvcHVwLm9uQ2xvc2VkIiwiY3ViZWUuQVBvcHVwLm1vZGFsIiwiY3ViZWUuQVBvcHVwLmF1dG9DbG9zZSIsImN1YmVlLkFQb3B1cC5nbGFzc0NvbG9yIiwiY3ViZWUuQVBvcHVwLlRyYW5zbGF0ZVgiLCJjdWJlZS5BUG9wdXAudHJhbnNsYXRlWCIsImN1YmVlLkFQb3B1cC5UcmFuc2xhdGVZIiwiY3ViZWUuQVBvcHVwLnRyYW5zbGF0ZVkiLCJjdWJlZS5BUG9wdXAuQ2VudGVyIiwiY3ViZWUuQVBvcHVwLmNlbnRlciIsImN1YmVlLkFQb3B1cC5fZG9Qb2ludGVyRXZlbnRDbGltYmluZ1VwIiwiY3ViZWUuQVBvcHVwLl9sYXlvdXQiLCJjdWJlZS5Qb3B1cHMiLCJjdWJlZS5Qb3B1cHMuY29uc3RydWN0b3IiLCJjdWJlZS5Qb3B1cHMuX2FkZFBvcHVwIiwiY3ViZWUuUG9wdXBzLl9yZW1vdmVQb3B1cCIsImN1YmVlLlBvcHVwcy5fcmVxdWVzdExheW91dCIsImN1YmVlLlBvcHVwcy5sYXlvdXQiLCJjdWJlZS5Qb3B1cHMuZG9Qb2ludGVyRXZlbnRDbGltYmluZ1VwIiwiY3ViZWUuQ3ViZWVQYW5lbCIsImN1YmVlLkN1YmVlUGFuZWwuY29uc3RydWN0b3IiLCJjdWJlZS5DdWJlZVBhbmVsLmNoZWNrQm91bmRzIiwiY3ViZWUuQ3ViZWVQYW5lbC5yZXF1ZXN0TGF5b3V0IiwiY3ViZWUuQ3ViZWVQYW5lbC5sYXlvdXQiLCJjdWJlZS5DdWJlZVBhbmVsLnJvb3RDb21wb25lbnQiLCJjdWJlZS5DdWJlZVBhbmVsLl9kb1BvaW50ZXJFdmVudENsaW1iaW5nVXAiLCJjdWJlZS5DdWJlZVBhbmVsLkNsaWVudFdpZHRoIiwiY3ViZWUuQ3ViZWVQYW5lbC5jbGllbnRXaWR0aCIsImN1YmVlLkN1YmVlUGFuZWwuQ2xpZW50SGVpZ2h0IiwiY3ViZWUuQ3ViZWVQYW5lbC5jbGllbnRIZWlnaHQiLCJjdWJlZS5DdWJlZVBhbmVsLkJvdW5kc1dpZHRoIiwiY3ViZWUuQ3ViZWVQYW5lbC5ib3VuZHNXaWR0aCIsImN1YmVlLkN1YmVlUGFuZWwuQm91bmRzSGVpZ2h0IiwiY3ViZWUuQ3ViZWVQYW5lbC5ib3VuZHNIZWlnaHQiLCJjdWJlZS5DdWJlZVBhbmVsLkJvdW5kc0xlZnQiLCJjdWJlZS5DdWJlZVBhbmVsLmJvdW5kc0xlZnQiLCJjdWJlZS5DdWJlZVBhbmVsLkJvdW5kc1RvcCIsImN1YmVlLkN1YmVlUGFuZWwuYm91bmRzVG9wIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBLElBQU8sS0FBSyxDQWtSWDtBQWxSRCxXQUFPLEtBQUssRUFBQyxDQUFDO0lBRVZBO1FBQ0lDLG1CQUFtQkEsTUFBY0E7WUFBZEMsV0FBTUEsR0FBTkEsTUFBTUEsQ0FBUUE7UUFBSUEsQ0FBQ0E7UUFDMUNELGdCQUFDQTtJQUFEQSxDQUFDQSxBQUZERCxJQUVDQTtJQUZZQSxlQUFTQSxZQUVyQkEsQ0FBQUE7SUFFREE7UUFBQUc7WUFFWUMsY0FBU0EsR0FBd0JBLEVBQUVBLENBQUNBO1FBb0NoREEsQ0FBQ0E7UUFsQ1VELHFCQUFLQSxHQUFaQTtRQUNBRSxDQUFDQTtRQUVERiwyQkFBV0EsR0FBWEEsVUFBWUEsUUFBMkJBO1lBQ25DRyxFQUFFQSxDQUFDQSxDQUFDQSxRQUFRQSxJQUFJQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDbkJBLE1BQU1BLHlDQUF5Q0EsQ0FBQ0E7WUFDcERBLENBQUNBO1lBRURBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLFFBQVFB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Q2JBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO2dCQUN6Q0EsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzFDQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDM0NBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO1lBQzlDQSxDQUFDQTtZQUVEQSxJQUFJQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUM1QkEsSUFBSUEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0E7WUFFNUJBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLElBQUlBLEdBQUdBLElBQUlBLEVBQUVBLElBQUlBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO2dCQUN6QkEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ2pEQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQTtnQkFDakRBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO2dCQUNqREEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7WUFDckRBLENBQUNBO1lBRURBLElBQUlBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2hFQSxJQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNoRUEsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDaEVBLElBQUlBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2hFQSxFQUFFQSxHQUFHQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQTtZQUNqQkEsRUFBRUEsR0FBR0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0E7WUFDakJBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBO1lBQ1ZBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBO1lBRVZBLElBQUlBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsS0FBS0EsR0FBR0EsRUFBRUEsQ0FBQ0E7WUFDbENBLElBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsS0FBS0EsR0FBR0EsRUFBRUEsQ0FBQ0E7WUFDakNBLElBQUlBLENBQUNBLGtCQUFrQkEsQ0FBQ0EsS0FBS0EsR0FBR0EsRUFBRUEsQ0FBQ0E7WUFDbkNBLElBQUlBLENBQUNBLG1CQUFtQkEsQ0FBQ0EsS0FBS0EsR0FBR0EsRUFBRUEsQ0FBQ0E7UUFDeENBLENBQUNBO1FBRURULCtCQUFVQSxHQUFWQSxVQUFXQSxPQUFlQSxFQUFFQSxPQUFlQSxFQUFFQSxNQUFjQSxFQUFFQSxNQUFjQSxFQUFFQSxNQUFjQSxFQUFFQSxNQUFjQTtZQUN2R1UsSUFBSUEsSUFBSUEsR0FBR0EsQ0FBQ0EsT0FBT0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsR0FBR0EsT0FBT0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDekRBLElBQUlBLElBQUlBLEdBQUdBLENBQUNBLE9BQU9BLEdBQUdBLENBQUNBLENBQUNBLE1BQU1BLEdBQUdBLE9BQU9BLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQ3pEQSxNQUFNQSxDQUFDQSxJQUFJQSxhQUFPQSxDQUFDQSxJQUFJQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUNuQ0EsQ0FBQ0E7UUFFT1YsZ0NBQVdBLEdBQW5CQSxVQUFvQkEsRUFBVUEsRUFBRUEsRUFBVUEsRUFBRUEsQ0FBU0EsRUFBRUEsQ0FBU0EsRUFBRUEsS0FBYUE7WUFDM0VXLEtBQUtBLEdBQUdBLENBQUNBLEtBQUtBLEdBQUdBLEdBQUdBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBO1lBQ3hDQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUNYQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUNYQSxJQUFJQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtZQUMxQkEsSUFBSUEsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7WUFDMUJBLElBQUlBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQ3JDQSxJQUFJQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNyQ0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0E7WUFDYkEsRUFBRUEsR0FBR0Es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T0FBT0EsQ0FBQ0EsS0FBS0EsSUFBSUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzVCQSxFQUFFQSxHQUFHQSxDQUFDQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxpQkFBaUJBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO2dCQUNoRkEsRUFBRUEsR0FBR0EsQ0FBQ0EsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDdEZBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBO2dCQUNSQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUNaQSxDQUFDQTtZQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxJQUFJQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDNUJBLEVBQUVBLEdBQUdBLENBQUNBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2hGQSxFQUFFQSxHQUFHQSxDQUFDQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxpQkFBaUJBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO2dCQUN0RkEsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0E7Z0JBQ1JBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBO1lBQ1pBLENBQUNBO1lBR0RBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLElBQUlBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO2dCQUNyQkEsSUFBSUEsR0FBR0EsR0FBR0EsQ0FBQ0EsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDekRBLElBQUlBLEdBQUdBLEdBQUdBLENBQUNBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3pEQSxJQUFJQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxHQUFHQSxHQUFHQSxFQUFFQSxFQUFFQSxHQUFHQSxHQUFHQSxFQUFFQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtnQkFDakVBLElBQUlBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLEdBQUdBLEdBQUdBLEVBQUVBLEVBQUVBLEdBQUdBLEdBQUdBLEVBQUVBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO2dCQUNqRUEsSUFBSUEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsR0FBR0EsR0FBR0EsRUFBRUEsRUFBRUEsR0FBR0EsR0FBR0EsRUFBRUEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ2pFQSxJQUFJQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxHQUFHQSxHQUFHQSxFQUFFQSxFQUFFQSxHQUFHQSxHQUFHQSxFQUFFQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtnQkFDakVBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBO2dCQUNoQkEsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0E7Z0JBQ2hCQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQTtnQkFDaEJBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBO2dCQUNoQkEsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0E7Z0JBQ2hCQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQTtnQkFDaEJBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBO2dCQUNoQkEsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0E7WUFDcEJBLENBQUNBO1lBRURBLElBQUlBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBO1lBQ1pBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ25EQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUNWQSxDQUFDQTtZQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxxQkFBcUJBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNuREEsR0FBR0EsRUFBRUEsQ0FBQ0E7WUFDVkEsQ0FBQ0E7WUFDREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EscUJBQXFCQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDbkRBLEdBQUdBLEVBQUVBLENBQUNBO1lBQ1ZBLENBQUNBO1lBQ0RBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ25EQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUNWQSxDQUFDQTtZQUNEQSxNQUFNQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUNoQ0EsQ0FBQ0E7UUFFT3BGLDBDQUFxQkEsR0FBN0JBLFVBQThCQSxFQUFVQSxFQUFFQSxFQUFVQSxFQUFFQSxHQUFXQSxFQUFFQSxHQUFXQSxFQUFFQSxHQUFXQSxFQUFFQSxHQUFXQTtZQUlwR3FGLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLEVBQUVBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLEdBQUdBLENBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEVBQUVBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEdBQUdB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QUFDQSxPQUFPQSxFQUFFQSxPQUFPQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxhQUFhQSxFQUFFQSxVQUFVQSxFQUMvRUEsV0FBV0EsRUFBRUEsWUFBWUEsRUFBRUEsV0FBV0EsRUFBRUEsSUFBSUEsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3hEQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxFQUFFQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtvQkFDbERBLElBQUlBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUNsQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsSUFBSUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ2hCQSxJQUFJQSxPQUFPQSxHQUFHQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxVQUFVQSxDQUFDQTt3QkFDMUNBLElBQUlBLE9BQU9BLEdBQUdBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFNBQVNBLENBQUNBO3dCQUN6Q0EsSUFBSUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7d0JBQ3JCQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDWkEsT0FBT0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0E7NEJBQ2xCQSxPQUFPQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQTt3QkFDckJBLENBQUNBO3dCQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxrQkFBa0JBLENBQUNBLE9BQU9BLEVBQUVBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLENBQUNBOzRCQUM3Q0EsSUFBSUEsSUFBSUEsR0FBR0EsS0FBS0EsQ0FBQ0EsSUFBSUEsR0FBR0EsS0FBS0EsQ0FBQ0EsVUFBVUEsQ0FBQ0E7NEJBQ3pDQSxJQUFJQSxLQUFHQSxHQUFHQSxLQUFLQSxDQUFDQSxHQUFHQSxHQUFHQSxLQUFLQSxDQUFDQSxVQUFVQSxDQUFDQTs0QkFDdkNBLElBQUlBLEdBQUdBLEdBQUdBLENBQUNBLElBQUlBLEdBQUdBLEtBQUtBLENBQUNBLGFBQWFBLEdBQUdBLEtBQUtBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7NEJBQ3BFQSxJQUFJQSxHQUFHQSxHQUFHQSxDQUFDQSxLQUFHQSxHQUFHQSxLQUFLQSxDQUFDQSxjQUFjQSxHQUFHQSxLQUFLQSxDQUFDQSxnQkFBZ0JBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBOzRCQUNwRUEsSUFBSUEsVUFBVUEsR0FBR0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsR0FBR0EsRUFBRUEsR0FBR0EsRUFBRUEsT0FBT0EsRUFBRUEsT0FBT0EsRUFBRUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7NEJBQzlFQSxJQUFJQSxNQUFNQSxHQUFHQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDMUJBLElBQUlBLE1BQU1BLEdBQUdBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBOzRCQUMxQkEsTUFBTUEsR0FBR0EsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0E7NEJBQ3ZCQSxNQUFNQSxHQUFHQSxNQUFNQSxHQUFHQSxLQUFHQSxDQUFDQTs0QkFFdEJBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLHlCQUF5QkEsQ0FBQ0EsT0FBT0EsRUFBRUEsT0FBT0EsRUFBRUEsTUFBTUEsRUFBRUEsTUFBTUEsRUFBRUEsYUFBYUEsRUFDL0VBLFVBQVVBLEVBQUVBLFdBQVdBLEVBQUVBLFlBQVlBLEVBQUVBLFdBQVdBLEVBQUVBLElBQUlBLEVBQUVBLE1BQU1BLEVBQUVBLEtBQUtBLENBQUNBLENBQUNB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Q0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsSUFBSUEsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7b0JBQ2xEQSxJQUFJQSxTQUFTQSxHQUFHQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDM0NBLEVBQUVBLENBQUNBLENBQUNBLFNBQVNBLElBQUlBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO3dCQUNwQkEsUUFBUUEsQ0FBQ0E7b0JBQ2JBLENBQUNBO29CQUNEQSxJQUFJQSxFQUFFQSxHQUFHQSxDQUFDQSxHQUFHQSxTQUFTQSxDQUFDQSxJQUFJQSxHQUFHQSxTQUFTQSxDQUFDQSxVQUFVQSxDQUFDQTtvQkFDbkRBLElBQUlBLEVBQUVBLEdBQUdBLENBQUNBLEdBQUdBLFNBQVNBLENBQUNBLEdBQUdBLEdBQUdBLFNBQVNBLENBQUNBLFVBQVVBLENBQUNBO29CQUNsREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsU0FBU0EsWUFBWUEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQy9CQSxJQUFJQSxDQUFVQSxDQUFDQTt3QkFDZkEsSUFBSUEsQ0FBQ0EsNEJBQTRCQSxDQUFVQSxTQUFTQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQTtvQkFDMUVBLENBQUNBO29CQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTt3QkFDSkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsSUFBSUEsRUFBRUEsSUFBSUEsU0FBU0EsQ0FBQ0EsV0FBV0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsU0FBU0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQ2xGQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxT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QUNBLENBQUNBO2dCQUNiQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxJQUFJQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtvQkFDbERBLElBQUlBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUMzQ0EsSUFBSUEsRUFBRUEsR0FBR0EsU0FBU0EsQ0FBQ0EsV0FBV0EsR0FBR0EsU0FBU0EsQ0FBQ0EsVUFBVUEsR0FBR0EsU0FBU0EsQ0FBQ0EsVUFBVUEsQ0FBQ0E7b0JBQzdFQSxJQUFJQSxFQUFFQSxHQUFHQSxTQUFTQSxDQUFDQSxZQUFZQSxHQUFHQSxTQUFTQSxDQUFDQSxTQUFTQSxHQUFHQSxTQUFTQSxDQUFDQSxVQUFVQSxDQUFDQTtvQkFFN0VBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO3dCQUNaQSxJQUFJQSxHQUFHQSxFQUFFQSxDQUFDQTtvQkFDZEEsQ0FBQ0E7b0JBRURBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO3dCQUNaQSxJQUFJQSxHQUFHQSxFQUFFQSxDQUFDQTtvQkFDZEEsQ0FBQ0E7Z0JBQ0xBLENBQUNBO2dCQUVEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxJQUFJQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDckJBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBO2dCQUN2QkEsQ0FBQ0E7Z0JBRURBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLElBQUlBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO29CQUN0QkEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7Z0JB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QSxVQUFVQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUNqQ0EsQ0FBQ0E7aUJBQ0RoQixVQUFlQSxLQUFLQTtnQkFDaEJnQixJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQTtZQUNsQ0EsQ0FBQ0E7OztXQUhBaEI7UUFLREEsc0JBQUlBLGlDQUFTQTtpQkFBYkE7Z0JBQ0lpQixNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxTQUFTQSxDQUFDQTtZQUN4Q0EsQ0FBQ0E7OztXQUFBakI7UUFDREEsc0JBQUlBLGlDQUFTQTtpQkFBYkE7Z0JBQ0lrQixNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUNoQ0EsQ0FBQ0E7aUJBQ0RsQixVQUFjQSxLQUFLQTtnQkFDZmtCLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBO1lBQ2pDQSxDQUFDQTs7O1dBSEFsQjtRQUtMQSxpQkFBQ0E7SUFBREEsQ0FBQ0EsQUExS0R6ZCxJQTBLQ0E7SUExS1lBLGdCQUFVQSxhQTBLdEJBLENBQUFBO0FBRUxBLENBQUNBLEVBOUtNLEtBQUssS0FBTCxLQUFLLFFBOEtYIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlIGN1YmVlIHtcblxuICAgIGV4cG9ydCBjbGFzcyBFdmVudEFyZ3Mge1xuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc2VuZGVyOiBPYmplY3QpIHsgfVxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBFdmVudDxUPiB7XG5cbiAgICAgICAgcHJpdmF0ZSBsaXN0ZW5lcnM6IElFdmVudExpc3RlbmVyPFQ+W10gPSBbXTtcblxuICAgICAgICBwdWJsaWMgRXZlbnQoKSB7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRMaXN0ZW5lcihsaXN0ZW5lcjogSUV2ZW50TGlzdGVuZXI8VD4pIHtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgbGlzdGVuZXIgcGFyYW1ldGVyIGNhbiBub3QgYmUgbnVsbC5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzTGlzdGVuZXIobGlzdGVuZXIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZUxpc3RlbmVyKGxpc3RlbmVyOiBJRXZlbnRMaXN0ZW5lcjxUPikge1xuICAgICAgICAgICAgdmFyIGlkeCA9IHRoaXMubGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpO1xuICAgICAgICAgICAgaWYgKGlkeCA8IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVycy5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGhhc0xpc3RlbmVyKGxpc3RlbmVyOiBJRXZlbnRMaXN0ZW5lcjxUPikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpID4gLTE7XG4gICAgICAgIH1cblxuICAgICAgICBmaXJlRXZlbnQoYXJnczogVCkge1xuICAgICAgICAgICAgZm9yICh2YXIgbCBpbiB0aGlzLmxpc3RlbmVycykge1xuICAgICAgICAgICAgICAgIGxldCBsaXN0ZW5lcjogSUV2ZW50TGlzdGVuZXI8VD4gPSBsO1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyKGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgVGltZXIge1xuXG4gICAgICAgIHByaXZhdGUgdG9rZW46IG51bWJlcjtcbiAgICAgICAgcHJpdmF0ZSByZXBlYXQ6IGJvb2xlYW4gPSB0cnVlO1xuICAgICAgICBwcml2YXRlIGFjdGlvbjogeyAoKTogdm9pZCB9ID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mdW5jKCk7XG4gICAgICAgICAgICBpZiAoIXRoaXMucmVwZWF0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b2tlbiA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBmdW5jOiB7ICgpOiB2b2lkIH0pIHtcbiAgICAgICAgICAgIGlmIChmdW5jID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoZSBmdW5jIHBhcmFtZXRlciBjYW4gbm90IGJlIG51bGwuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzdGFydChkZWxheTogbnVtYmVyLCByZXBlYXQ6IGJvb2xlYW4pIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICAgICAgdGhpcy5yZXBlYXQgPSByZXBlYXQ7XG4gICAgICAgICAgICBpZiAodGhpcy5yZXBlYXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRva2VuID0gc2V0SW50ZXJ2YWwodGhpcy5mdW5jLCBkZWxheSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudG9rZW4gPSBzZXRUaW1lb3V0KHRoaXMuZnVuYywgZGVsYXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3RvcCgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnRva2VuICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMudG9rZW4pO1xuICAgICAgICAgICAgICAgIHRoaXMudG9rZW4gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFN0YXJ0ZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b2tlbiAhPSBudWxsO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIElFdmVudExpc3RlbmVyPFQ+IHtcbiAgICAgICAgKGFyZ3M6IFQpOiB2b2lkO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBFdmVudFF1ZXVlIHtcblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogRXZlbnRRdWV1ZSA9IG51bGw7XG5cbiAgICAgICAgc3RhdGljIGdldCBJbnN0YW5jZSgpIHtcbiAgICAgICAgICAgIGlmIChFdmVudFF1ZXVlLmluc3RhbmNlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBFdmVudFF1ZXVlLmluc3RhbmNlID0gbmV3IEV2ZW50UXVldWUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIEV2ZW50UXVldWUuaW5zdGFuY2U7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHF1ZXVlOiB7ICgpOiB2b2lkIH1bXSA9IFtdO1xuICAgICAgICBwcml2YXRlIHRpbWVyOiBUaW1lciA9IG51bGw7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVyID0gbmV3IFRpbWVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgc2l6ZSA9IHRoaXMucXVldWUubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0YXNrOiB7ICgpOiB2b2lkIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXNrID0gdGhpcy5xdWV1ZVswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucXVldWUuc3BsaWNlKDAsIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhc2sgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhc2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzaXplID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlcmUgd2VyZSBzb21lIHRhc2sgdGhhbiB3ZSBuZWVkIHRvIGNoZWNrIGZhc3QgaWYgbW9yZSB0YXNrcyBhcmUgcmVjZWl2ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGltZXIuc3RhcnQoMCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXNuJ3QgYW55IHRhc2sgdGhhbiB3ZSBjYW4gcmVsYXggYSBiaXRcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGltZXIuc3RhcnQoNTAsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudGltZXIuc3RhcnQoMTAsIGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGludm9rZUxhdGVyKHRhc2s6IHsgKCk6IHZvaWQgfSkge1xuICAgICAgICAgICAgaWYgKHRhc2sgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIHRhc2sgY2FuIG5vdCBiZSBudWxsLlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5xdWV1ZS5wdXNoKHRhc2spO1xuICAgICAgICB9XG5cbiAgICAgICAgaW52b2tlUHJpb3IodGFzazogeyAoKTogdm9pZCB9KSB7XG4gICAgICAgICAgICBpZiAodGFzayA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgdGFzayBjYW4gbm90IGJlIG51bGwuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnF1ZXVlLnNwbGljZSgwLCAwLCB0YXNrKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFJ1bk9uY2Uge1xuXG4gICAgICAgIHByaXZhdGUgc2NoZWR1bGVkID0gZmFsc2U7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBmdW5jOiBJUnVubmFibGUpIHtcbiAgICAgICAgICAgIGlmIChmdW5jID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoZSBmdW5jIHBhcmFtZXRlciBjYW4gbm90IGJlIG51bGwuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBydW4oKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zY2hlZHVsZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlZCA9IHRydWU7XG4gICAgICAgICAgICBFdmVudFF1ZXVlLkluc3RhbmNlLmludm9rZUxhdGVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuZnVuYygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgTW91c2VEcmFnRXZlbnRBcmdzIHtcbiAgICAgICAgY29uc3RydWN0b3IoXG4gICAgICAgICAgICBwdWJsaWMgc2NyZWVuWDogbnVtYmVyLFxuICAgICAgICAgICAgcHVibGljIHNjcmVlblk6IG51bWJlcixcbiAgICAgICAgICAgIHB1YmxpYyBkZWx0YVg6IG51bWJlcixcbiAgICAgICAgICAgIHB1YmxpYyBkZWx0YVk6IG51bWJlcixcbiAgICAgICAgICAgIHB1YmxpYyBhbHRQcmVzc2VkOiBib29sZWFuLFxuICAgICAgICAgICAgcHVibGljIGN0cmxQcmVzc2VkOiBib29sZWFuLFxuICAgICAgICAgICAgcHVibGljIHNoaWZ0UHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHB1YmxpYyBtZXRhUHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHB1YmxpYyBzZW5kZXI6IE9iamVjdCkgeyB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIE1vdXNlVXBFdmVudEFyZ3Mge1xuICAgICAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgICAgIHB1YmxpYyBzY3JlZW5YOiBudW1iZXIsXG4gICAgICAgICAgICBwdWJsaWMgc2NyZWVuWTogbnVtYmVyLFxuICAgICAgICAgICAgcHVibGljIGRlbHRhWDogbnVtYmVyLFxuICAgICAgICAgICAgcHVibGljIGRlbHRhWTogbnVtYmVyLFxuICAgICAgICAgICAgcHVibGljIGFsdFByZXNzZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICBwdWJsaWMgY3RybFByZXNzZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICBwdWJsaWMgc2hpZnRQcmVzc2VkOiBib29sZWFuLFxuICAgICAgICAgICAgcHVibGljIG1ldGFQcmVzc2VkOiBib29sZWFuLFxuICAgICAgICAgICAgcHVibGljIGJ1dHRvbjogbnVtYmVyLFxuICAgICAgICAgICAgcHVibGljIG5hdGl2ZUV2ZW50OiBNb3VzZUV2ZW50LFxuICAgICAgICAgICAgcHVibGljIHNlbmRlcjogT2JqZWN0KSB7IH1cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgTW91c2VEb3duRXZlbnRBcmdzIHtcbiAgICAgICAgY29uc3RydWN0b3IoXG4gICAgICAgICAgICBwdWJsaWMgc2NyZWVuWDogbnVtYmVyLFxuICAgICAgICAgICAgcHVibGljIHNjcmVlblk6IG51bWJlcixcbiAgICAgICAgICAgIHB1YmxpYyBkZWx0YVg6IG51bWJlcixcbiAgICAgICAgICAgIHB1YmxpYyBkZWx0YVk6IG51bWJlcixcbiAgICAgICAgICAgIHB1YmxpYyBhbHRQcmVzc2VkOiBib29sZWFuLFxuICAgICAgICAgICAgcHVibGljIGN0cmxQcmVzc2VkOiBib29sZWFuLFxuICAgICAgICAgICAgcHVibGljIHNoaWZ0UHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHB1YmxpYyBtZXRhUHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHB1YmxpYyBidXR0b246IG51bWJlcixcbiAgICAgICAgICAgIHB1YmxpYyBuYXRpdmVFdmVudDogTW91c2VFdmVudCxcbiAgICAgICAgICAgIHB1YmxpYyBzZW5kZXI6IE9iamVjdCkgeyB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIE1vdXNlTW92ZUV2ZW50QXJncyB7XG4gICAgICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICAgICAgcHVibGljIHNjcmVlblg6IG51bWJlcixcbiAgICAgICAgICAgIHB1YmxpYyBzY3JlZW5ZOiBudW1iZXIsXG4gICAgICAgICAgICBwdWJsaWMgeDogbnVtYmVyLFxuICAgICAgICAgICAgcHVibGljIHk6IG51bWJlcixcbiAgICAgICAgICAgIHB1YmxpYyBhbHRQcmVzc2VkOiBib29sZWFuLFxuICAgICAgICAgICAgcHVibGljIGN0cmxQcmVzc2VkOiBib29sZWFuLFxuICAgICAgICAgICAgcHVibGljIHNoaWZ0UHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHB1YmxpYyBtZXRhUHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHB1YmxpYyBzZW5kZXI6IE9iamVjdCkgeyB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIE1vdXNlV2hlZWxFdmVudEFyZ3Mge1xuICAgICAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgICAgIHB1YmxpYyB3aGVlbFZlbG9jaXR5OiBudW1iZXIsXG4gICAgICAgICAgICBwdWJsaWMgYWx0UHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHB1YmxpYyBjdHJsUHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHB1YmxpYyBzaGlmdFByZXNzZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICBwdWJsaWMgbWV0YVByZXNzZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICBwdWJsaWMgc2VuZGVyOiBPYmplY3QpIHsgfVxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBDbGlja0V2ZW50QXJncyB7XG4gICAgICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICAgICAgcHVibGljIHNjcmVlblg6IG51bWJlcixcbiAgICAgICAgICAgIHB1YmxpYyBzY3JlZW5ZOiBudW1iZXIsXG4gICAgICAgICAgICBwdWJsaWMgZGVsdGFYOiBudW1iZXIsXG4gICAgICAgICAgICBwdWJsaWMgZGVsdGFZOiBudW1iZXIsXG4gICAgICAgICAgICBwdWJsaWMgYWx0UHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHB1YmxpYyBjdHJsUHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHB1YmxpYyBzaGlmdFByZXNzZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICBwdWJsaWMgbWV0YVByZXNzZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICBwdWJsaWMgYnV0dG9uOiBudW1iZXIsXG4gICAgICAgICAgICBwdWJsaWMgc2VuZGVyOiBPYmplY3QpIHsgfVxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBLZXlFdmVudEFyZ3Mge1xuICAgICAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgICAgIHB1YmxpYyBrZXlDb2RlOiBudW1iZXIsXG4gICAgICAgICAgICBwdWJsaWMgYWx0UHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHB1YmxpYyBjdHJsUHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHB1YmxpYyBzaGlmdFByZXNzZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICBwdWJsaWMgbWV0YVByZXNzZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICBwdWJsaWMgc2VuZGVyOiBPYmplY3QsXG4gICAgICAgICAgICBwdWJsaWMgbmF0aXZlRXZlbnQ6IEtleWJvYXJkRXZlbnRcbiAgICAgICAgKSB7IH1cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgUGFyZW50Q2hhbmdlZEV2ZW50QXJncyBleHRlbmRzIEV2ZW50QXJncyB7XG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuZXdQYXJlbnQ6IEFMYXlvdXQsXG4gICAgICAgICAgICBwdWJsaWMgc2VuZGVyOiBPYmplY3QpIHtcbiAgICAgICAgICAgIHN1cGVyKHNlbmRlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQ29udGV4dE1lbnVFdmVudEFyZ3Mge1xuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmF0aXZlRXZlbnQ6IFVJRXZlbnQsXG4gICAgICAgICAgICBwdWJsaWMgc2VuZGVyOiBPYmplY3QpIHsgfVxuICAgIH1cblxufVxuXG5cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJldmVudHMudHNcIi8+XG5cbm1vZHVsZSBjdWJlZSB7XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIElDaGFuZ2VMaXN0ZW5lciB7XG4gICAgICAgIChzZW5kZXI/OiBPYmplY3QpOiB2b2lkO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSU9ic2VydmFibGUge1xuICAgICAgICBhZGRDaGFuZ2VMaXN0ZW5lcihsaXN0ZW5lcjogSUNoYW5nZUxpc3RlbmVyKTogdm9pZDtcbiAgICAgICAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIobGlzdGVuZXI6IElDaGFuZ2VMaXN0ZW5lcik6IHZvaWQ7XG4gICAgICAgIGhhc0NoYW5nZUxpc3RlbmVyKGxpc3RlbmVyOiBJQ2hhbmdlTGlzdGVuZXIpOiB2b2lkO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSUJpbmRhYmxlPFQ+IHtcbiAgICAgICAgYmluZChzb3VyY2U6IFQpOiB2b2lkO1xuICAgICAgICB1bmJpbmQoKTogdm9pZDtcbiAgICAgICAgaXNCb3VuZCgpOiBib29sZWFuO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSUFuaW1hdGVhYmxlPFQ+IHtcbiAgICAgICAgYW5pbWF0ZShwb3M6IG51bWJlciwgc3RhcnRWYWx1ZTogVCwgZW5kVmFsdWU6IFQpOiBUO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVByb3BlcnR5PFQ+IGV4dGVuZHMgSU9ic2VydmFibGUge1xuICAgICAgICBnZXRPYmplY3RWYWx1ZSgpOiBPYmplY3Q7XG4gICAgICAgIGludmFsaWRhdGUoKTogdm9pZDtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIElWYWxpZGF0b3I8VD4ge1xuICAgICAgICB2YWxpZGF0ZSh2YWx1ZTogVCk6IFQ7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFByb3BlcnR5PFQ+IGltcGxlbWVudHMgSVByb3BlcnR5PFQ+LCBJQW5pbWF0ZWFibGU8VD4sIElCaW5kYWJsZTxJUHJvcGVydHk8VD4+IHtcblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfbmV4dElkID0gMDtcblxuICAgICAgICBwcml2YXRlIF9jaGFuZ2VMaXN0ZW5lcnM6IElDaGFuZ2VMaXN0ZW5lcltdID0gW107XG5cbiAgICAgICAgcHJpdmF0ZSBfdmFsaWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcHJpdmF0ZSBfYmluZGluZ1NvdXJjZTogSVByb3BlcnR5PFQ+O1xuXG4gICAgICAgIHByaXZhdGUgX3JlYWRvbmx5QmluZDogSVByb3BlcnR5PFQ+O1xuICAgICAgICBwcml2YXRlIF9iaWRpcmVjdGlvbmFsQmluZFByb3BlcnR5OiBQcm9wZXJ0eTxUPjtcbiAgICAgICAgcHJpdmF0ZSBfYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyVGhpczogSUNoYW5nZUxpc3RlbmVyO1xuICAgICAgICBwcml2YXRlIF9iaWRpcmVjdGlvbmFsQ2hhbmdlTGlzdGVuZXJPdGhlcjogSUNoYW5nZUxpc3RlbmVyO1xuICAgICAgICBwcml2YXRlIF9pZDogc3RyaW5nID0gXCJwXCIgKyBQcm9wZXJ0eS5fbmV4dElkKys7XG4gICAgICAgIHByaXZhdGUgYmluZExpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmludmFsaWRhdGVJZk5lZWRlZCgpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgY29uc3RydWN0b3IoXG4gICAgICAgICAgICBwcml2YXRlIF92YWx1ZT86IFQsXG4gICAgICAgICAgICBwcml2YXRlIF9udWxsYWJsZTogYm9vbGVhbiA9IHRydWUsXG4gICAgICAgICAgICBwcml2YXRlIF9yZWFkb25seTogYm9vbGVhbiA9IGZhbHNlLFxuICAgICAgICAgICAgcHJpdmF0ZSBfdmFsaWRhdG9yOiBJVmFsaWRhdG9yPFQ+ID0gbnVsbCkge1xuXG4gICAgICAgICAgICBpZiAoX3ZhbHVlID09IG51bGwgJiYgX251bGxhYmxlID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJBIG51bGxhYmxlIHByb3BlcnR5IGNhbiBub3QgYmUgbnVsbC5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX3ZhbHVlICE9IG51bGwgJiYgX3ZhbGlkYXRvciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSBfdmFsaWRhdG9yLnZhbGlkYXRlKF92YWx1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGlkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lkO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHZhbGlkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbGlkO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHZhbHVlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBzZXQgdmFsdWUobmV3VmFsdWU6IFQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0KG5ld1ZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBudWxsYWJsZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9udWxsYWJsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCByZWFkb25seSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZWFkb25seTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXRSZWFkb25seUJpbmQocmVhZG9ubHlCaW5kOiBJUHJvcGVydHk8VD4pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9yZWFkb25seUJpbmQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIHJlYWRvbmx5IGJpbmQgaXMgYWxyZWFkeSBpbml0aWFsaXplZC5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3JlYWRvbmx5QmluZCA9IHJlYWRvbmx5QmluZDtcbiAgICAgICAgICAgIGlmIChyZWFkb25seUJpbmQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJlYWRvbmx5QmluZC5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLmJpbmRMaXN0ZW5lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmludmFsaWRhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgZ2V0KCk6IFQge1xuICAgICAgICAgICAgdGhpcy5fdmFsaWQgPSB0cnVlO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fYmluZGluZ1NvdXJjZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3ZhbGlkYXRvciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl92YWxpZGF0b3IudmFsaWRhdGUoPFQ+dGhpcy5fYmluZGluZ1NvdXJjZS5nZXRPYmplY3RWYWx1ZSgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIDxUPnRoaXMuX2JpbmRpbmdTb3VyY2UuZ2V0T2JqZWN0VmFsdWUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX3JlYWRvbmx5QmluZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3ZhbGlkYXRvciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl92YWxpZGF0b3IudmFsaWRhdGUoPFQ+dGhpcy5fcmVhZG9ubHlCaW5kLmdldE9iamVjdFZhbHVlKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gPFQ+dGhpcy5fcmVhZG9ubHlCaW5kLmdldE9iamVjdFZhbHVlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc2V0KG5ld1ZhbHVlOiBUKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fcmVhZG9ubHkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIkNhbiBub3QgY2hhbmdlIHRoZSB2YWx1ZSBvZiBhIHJlYWRvbmx5IHByb3BlcnR5LlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5pc0JvdW5kKCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIkNhbiBub3QgY2hhbmdlIHRoZSB2YWx1ZSBvZiBhIGJvdW5kIHByb3BlcnR5LlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXRoaXMuX251bGxhYmxlICYmIG5ld1ZhbHVlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIkNhbiBub3Qgc2V0IHRoZSB2YWx1ZSB0byBudWxsIG9mIGEgbm9uIG51bGxhYmxlIHByb3BlcnR5LlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fdmFsaWRhdG9yICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IHRoaXMuX3ZhbGlkYXRvci52YWxpZGF0ZShuZXdWYWx1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl92YWx1ZSA9PSBuZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX3ZhbHVlICE9IG51bGwgJiYgdGhpcy5fdmFsdWUgPT0gbmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW52YWxpZGF0ZSgpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmZpcmVDaGFuZ2VMaXN0ZW5lcnMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGludmFsaWRhdGVJZk5lZWRlZCgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fdmFsaWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmludmFsaWRhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpcmVDaGFuZ2VMaXN0ZW5lcnMoKSB7XG4gICAgICAgICAgICB0aGlzLl9jaGFuZ2VMaXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXIpID0+IHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcih0aGlzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0T2JqZWN0VmFsdWUoKTogT2JqZWN0IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkQ2hhbmdlTGlzdGVuZXIobGlzdGVuZXI6IElDaGFuZ2VMaXN0ZW5lcikge1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVyID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoZSBsaXN0ZW5lciBwYXJhbWV0ZXIgY2FuIG5vdCBiZSBudWxsLlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNDaGFuZ2VMaXN0ZW5lcihsaXN0ZW5lcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2NoYW5nZUxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcblxuICAgICAgICAgICAgLy8gdmFsaWRhdGUgdGhlIGNvbXBvbmVudFxuICAgICAgICAgICAgdGhpcy5nZXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZUNoYW5nZUxpc3RlbmVyKGxpc3RlbmVyOiBJQ2hhbmdlTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHZhciBpZHggPSB0aGlzLl9jaGFuZ2VMaXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcik7XG4gICAgICAgICAgICBpZiAoaWR4IDwgMCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2NoYW5nZUxpc3RlbmVycy5zcGxpY2UoaWR4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGhhc0NoYW5nZUxpc3RlbmVyKGxpc3RlbmVyOiBJQ2hhbmdlTGlzdGVuZXIpOiBib29sZWFuIHtcbiAgICAgICAgICAgIHRoaXMuX2NoYW5nZUxpc3RlbmVycy5mb3JFYWNoKChsKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGwgPT0gbGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBhbmltYXRlKHBvczogbnVtYmVyLCBzdGFydFZhbHVlOiBULCBlbmRWYWx1ZTogVCkge1xuICAgICAgICAgICAgaWYgKHBvcyA8IDAuNSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdGFydFZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZW5kVmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBiaW5kKHNvdXJjZTogSVByb3BlcnR5PFQ+KSB7XG4gICAgICAgICAgICBpZiAoc291cmNlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoZSBzb3VyY2UgY2FuIG5vdCBiZSBudWxsLlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5pc0JvdW5kKCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoaXMgcHJvcGVydHkgaXMgYWxyZWFkeSBib3VuZC5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX3JlYWRvbmx5KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJDYW4ndCBiaW5kIGEgcmVhZG9ubHkgcHJvcGVydHkuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2JpbmRpbmdTb3VyY2UgPSBzb3VyY2U7XG4gICAgICAgICAgICB0aGlzLl9iaW5kaW5nU291cmNlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuYmluZExpc3RlbmVyKTtcbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgYmlkaXJlY3Rpb25hbEJpbmQob3RoZXI6IFByb3BlcnR5PFQ+KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0JvdW5kKCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoaXMgcHJvcGVydHkgaXMgYWxyZWFkeSBib3VuZC5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX3JlYWRvbmx5KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJDYW4ndCBiaW5kIGEgcmVhZG9ubHkgcHJvcGVydHkuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvdGhlciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgb3RoZXIgcGFyYW1ldGVyIGNhbiBub3QgYmUgbnVsbC5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG90aGVyLl9yZWFkb25seSkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiQ2FuIG5vdCBiaW5kIGEgcHJvcGVydHkgYmlkaXJlY3Rpb25hbGx5IHRvIGEgcmVhZG9ubHkgcHJvcGVydHkuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvdGhlciA9PSB0aGlzKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJDYW4gbm90IGJpbmQgYSBwcm9wZXJ0eSBiaWRpcmVjdGlvbmFsbHkgZm9yIHRoZW1zZWxmLlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3RoZXIuaXNCb3VuZCgpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgdGFyZ2V0IHByb3BlcnR5IGlzIGFscmVhZHkgYm91bmQuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2JpZGlyZWN0aW9uYWxCaW5kUHJvcGVydHkgPSBvdGhlcjtcbiAgICAgICAgICAgIHRoaXMuX2JpZGlyZWN0aW9uYWxDaGFuZ2VMaXN0ZW5lck90aGVyID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0KHRoaXMuX2JpZGlyZWN0aW9uYWxCaW5kUHJvcGVydHkuZ2V0KCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3RoZXIuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyT3RoZXIpO1xuICAgICAgICAgICAgdGhpcy5fYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyVGhpcyA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9iaWRpcmVjdGlvbmFsQmluZFByb3BlcnR5LnNldCh0aGlzLmdldCgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyVGhpcyk7XG5cbiAgICAgICAgICAgIG90aGVyLl9iaWRpcmVjdGlvbmFsQmluZFByb3BlcnR5ID0gdGhpcztcbiAgICAgICAgICAgIG90aGVyLl9iaWRpcmVjdGlvbmFsQ2hhbmdlTGlzdGVuZXJPdGhlciA9IHRoaXMuX2JpZGlyZWN0aW9uYWxDaGFuZ2VMaXN0ZW5lclRoaXM7XG4gICAgICAgICAgICBvdGhlci5fYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyVGhpcyA9IHRoaXMuX2JpZGlyZWN0aW9uYWxDaGFuZ2VMaXN0ZW5lck90aGVyO1xuXG4gICAgICAgIH1cblxuICAgICAgICB1bmJpbmQoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fYmluZGluZ1NvdXJjZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmluZGluZ1NvdXJjZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLmJpbmRMaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmluZGluZ1NvdXJjZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNCaWRpcmVjdGlvbmFsQm91bmQoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyVGhpcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmlkaXJlY3Rpb25hbEJpbmRQcm9wZXJ0eS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9iaWRpcmVjdGlvbmFsQ2hhbmdlTGlzdGVuZXJPdGhlcik7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmlkaXJlY3Rpb25hbEJpbmRQcm9wZXJ0eS5fYmlkaXJlY3Rpb25hbEJpbmRQcm9wZXJ0eSA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmlkaXJlY3Rpb25hbEJpbmRQcm9wZXJ0eS5fYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyT3RoZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuX2JpZGlyZWN0aW9uYWxCaW5kUHJvcGVydHkuX2JpZGlyZWN0aW9uYWxDaGFuZ2VMaXN0ZW5lclRoaXMgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuX2JpZGlyZWN0aW9uYWxCaW5kUHJvcGVydHkgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuX2JpZGlyZWN0aW9uYWxDaGFuZ2VMaXN0ZW5lck90aGVyID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLl9iaWRpcmVjdGlvbmFsQ2hhbmdlTGlzdGVuZXJUaGlzID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHVuYmluZFRhcmdldHMoKSB7XG4gICAgICAgICAgICAvLyBUT0RPIG51bGwgYmluZGluZ1NvdXJjZSBvZiB0YXJnZXRzXG4gICAgICAgICAgICB0aGlzLl9jaGFuZ2VMaXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlzQm91bmQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYmluZGluZ1NvdXJjZSAhPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaXNCaWRpcmVjdGlvbmFsQm91bmQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYmlkaXJlY3Rpb25hbEJpbmRQcm9wZXJ0eSAhPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY3JlYXRlUHJvcGVydHlMaW5lKGtleUZyYW1lczogS2V5RnJhbWU8VD5bXSk6IFByb3BlcnR5TGluZTxUPiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb3BlcnR5TGluZTxUPihrZXlGcmFtZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVzdHJveSgpIHtcbiAgICAgICAgICAgIHRoaXMudW5iaW5kKCk7XG4gICAgICAgICAgICB0aGlzLl9jaGFuZ2VMaXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuYmluZExpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEV4cHJlc3Npb248VD4gaW1wbGVtZW50cyBJUHJvcGVydHk8VD4sIElPYnNlcnZhYmxlIHtcblxuICAgICAgICBwcml2YXRlIF9ub3RpZnlMaXN0ZW5lcnNPbmNlID0gbmV3IFJ1bk9uY2UoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5maXJlQ2hhbmdlTGlzdGVuZXJzKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHByaXZhdGUgX2JpbmRpbmdTb3VyY2VzOiBJUHJvcGVydHk8YW55PltdID0gW107XG4gICAgICAgIHByaXZhdGUgX2JpbmRpbmdMaXN0ZW5lcjogSUNoYW5nZUxpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlSWZOZWVkZWQoKTtcbiAgICAgICAgfTtcbiAgICAgICAgcHJpdmF0ZSBfY2hhbmdlTGlzdGVuZXJzOiBJQ2hhbmdlTGlzdGVuZXJbXSA9IFtdO1xuXG4gICAgICAgIHByaXZhdGUgX2Z1bmM6IHsgKCk6IFQgfTtcbiAgICAgICAgcHJpdmF0ZSBfdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgcHJpdmF0ZSBfdmFsdWU6IFQgPSBudWxsO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGZ1bmM6IHsgKCk6IFQgfSwgLi4uYWN0aXZhdG9yczogSVByb3BlcnR5PGFueT5bXSkge1xuICAgICAgICAgICAgaWYgKGZ1bmMgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhlICdmdW5jJyBwYXJhbWV0ZXIgY2FuIG5vdCBiZSBudWxsXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9mdW5jID0gZnVuYztcbiAgICAgICAgICAgIHRoaXMuYmluZC5hcHBseSh0aGlzLCBhY3RpdmF0b3JzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB2YWx1ZSgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fdmFsaWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZSA9IHRoaXMuX2Z1bmMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl92YWxpZCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZENoYW5nZUxpc3RlbmVyKGxpc3RlbmVyOiBJQ2hhbmdlTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgbGlzdGVuZXIgcGFyYW1ldGVyIGNhbiBub3QgYmUgbnVsbC5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzQ2hhbmdlTGlzdGVuZXIobGlzdGVuZXIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9jaGFuZ2VMaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG5cbiAgICAgICAgICAgIGxldCB4ID0gdGhpcy52YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZUNoYW5nZUxpc3RlbmVyKGxpc3RlbmVyOiBJQ2hhbmdlTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuX2NoYW5nZUxpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKTtcbiAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2hhbmdlTGlzdGVuZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9jaGFuZ2VMaXN0ZW5lcnMubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2JpbmRpbmdTb3VyY2VzLmZvckVhY2goKHByb3ApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcC5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9iaW5kaW5nTGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmludmFsaWRhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGhhc0NoYW5nZUxpc3RlbmVyKGxpc3RlbmVyOiBJQ2hhbmdlTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGFuZ2VMaXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcikgPiAtMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldE9iamVjdFZhbHVlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBiaW5kKC4uLnByb3BlcnRpZXM6IElQcm9wZXJ0eTxhbnk+W10pIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMuZm9yRWFjaCgocHJvcCkgPT4ge1xuICAgICAgICAgICAgICAgIHByb3AuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fYmluZGluZ0xpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9iaW5kaW5nU291cmNlcy5wdXNoKHByb3ApO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdW5iaW5kQWxsKCkge1xuICAgICAgICAgICAgdGhpcy5fYmluZGluZ1NvdXJjZXMuZm9yRWFjaCgocHJvcCkgPT4ge1xuICAgICAgICAgICAgICAgIHByb3AucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fYmluZGluZ0xpc3RlbmVyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fYmluZGluZ1NvdXJjZXMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdW5iaW5kKHByb3BlcnR5OiBJUHJvcGVydHk8YW55Pikge1xuICAgICAgICAgICAgcHJvcGVydHkucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fYmluZGluZ0xpc3RlbmVyKTtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuX2JpbmRpbmdTb3VyY2VzLmluZGV4T2YocHJvcGVydHkpO1xuICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9iaW5kaW5nU291cmNlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbnZhbGlkYXRlKCkge1xuICAgICAgICAgICAgdGhpcy5fdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuX25vdGlmeUxpc3RlbmVyc09uY2UucnVuKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbnZhbGlkYXRlSWZOZWVkZWQoKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX3ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGZpcmVDaGFuZ2VMaXN0ZW5lcnMoKSB7XG4gICAgICAgICAgICB0aGlzLl9jaGFuZ2VMaXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXI6IElDaGFuZ2VMaXN0ZW5lcikgPT4ge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyKHRoaXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBLZXlGcmFtZTxUPiB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoXG4gICAgICAgICAgICBwcml2YXRlIF90aW1lOiBudW1iZXIsXG4gICAgICAgICAgICBwcml2YXRlIF9wcm9wZXJ0eTogUHJvcGVydHk8VD4sXG4gICAgICAgICAgICBwcml2YXRlIF9lbmRWYWx1ZTogVCxcbiAgICAgICAgICAgIHByaXZhdGUgX2tleWZyYW1lUmVhY2hlZExpc3RlbmVyOiB7ICgpOiB2b2lkIH0gPSBudWxsLFxuICAgICAgICAgICAgcHJpdmF0ZSBfaW50ZXJwb2xhdG9yOiBJSW50ZXJwb2xhdG9yID0gSW50ZXJwb2xhdG9ycy5MaW5lYXIpIHtcblxuICAgICAgICAgICAgaWYgKF90aW1lIDwgMCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIHRpbWUgcGFyYW1ldGVyIGNhbiBub3QgYmUgc21hbGxlciB0aGFuIHplcm8uXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfcHJvcGVydHkgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIHByb3BlcnR5IHBhcmFtZXRlciBjYW4gbm90IGJlIG51bGwuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoX3Byb3BlcnR5LnJlYWRvbmx5KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJDYW4ndCBhbmltYXRlIGEgcmVhZC1vbmx5IHByb3BlcnR5LlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoX2VuZFZhbHVlID09IG51bGwgJiYgIV9wcm9wZXJ0eS5udWxsYWJsZSkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiQ2FuJ3Qgc2V0IG51bGwgdmFsdWUgdG8gYSBub24gbnVsbGFibGUgcHJvcGVydHkuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfaW50ZXJwb2xhdG9yID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pbnRlcnBvbGF0b3IgPSBJbnRlcnBvbGF0b3JzLkxpbmVhcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB0aW1lKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RpbWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgcHJvcGVydHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcHJvcGVydHlcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBlbmRWYWx1ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9lbmRWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBpbnRlcnBvbGF0b3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faW50ZXJwb2xhdG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGtleUZyYW1lUmVhY2hlZExpc3RlbmVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2tleWZyYW1lUmVhY2hlZExpc3RlbmVyO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgUHJvcGVydHlMaW5lPFQ+IHtcblxuICAgICAgICBwcml2YXRlIF9wcm9wZXJ0eTogUHJvcGVydHk8VD47XG4gICAgICAgIHByaXZhdGUgX3N0YXJ0VGltZTogbnVtYmVyID0gLTE7XG4gICAgICAgIHByaXZhdGUgX2xhc3RSdW5UaW1lOiBudW1iZXIgPSAtMTtcbiAgICAgICAgcHJpdmF0ZSBfcHJldmlvdXNGcmFtZTogS2V5RnJhbWU8VD4gPSBudWxsO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2tleUZyYW1lczogS2V5RnJhbWU8VD5bXSkge1xuICAgICAgICAgICAgdGhpcy5fcHJvcGVydHkgPSBfa2V5RnJhbWVzWzBdLnByb3BlcnR5O1xuICAgICAgICAgICAgdmFyIGZpcnN0RnJhbWU6IEtleUZyYW1lPFQ+ID0gX2tleUZyYW1lc1swXTtcbiAgICAgICAgICAgIGlmIChmaXJzdEZyYW1lLnRpbWUgPiAwKSB7XG4gICAgICAgICAgICAgICAgX2tleUZyYW1lcy5zcGxpY2UoMCwgMCwgbmV3IEtleUZyYW1lKDAsIGZpcnN0RnJhbWUucHJvcGVydHksIGZpcnN0RnJhbWUucHJvcGVydHkudmFsdWUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBzdGFydFRpbWUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhcnRUaW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0IHN0YXJ0VGltZShzdGFydFRpbWU6IG51bWJlcikge1xuICAgICAgICAgICAgdGhpcy5fc3RhcnRUaW1lID0gc3RhcnRUaW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgYW5pbWF0ZSgpIHtcbiAgICAgICAgICAgIHZhciBhY3RUaW1lID0gRGF0ZS5ub3coKTtcblxuICAgICAgICAgICAgaWYgKGFjdFRpbWUgPT0gdGhpcy5fc3RhcnRUaW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbmV4dEZyYW1lOiBLZXlGcmFtZTxUPiA9IG51bGw7XG4gICAgICAgICAgICB2YXIgYWN0RnJhbWU6IEtleUZyYW1lPFQ+ID0gbnVsbDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fa2V5RnJhbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZyYW1lID0gdGhpcy5fa2V5RnJhbWVzW2ldO1xuICAgICAgICAgICAgICAgIHZhciBmcjogS2V5RnJhbWU8VD4gPSBmcmFtZTtcbiAgICAgICAgICAgICAgICBpZiAoYWN0VGltZSA+PSB0aGlzLl9zdGFydFRpbWUgKyBmci50aW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGFjdEZyYW1lID0gZnJhbWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dEZyYW1lID0gZnJhbWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zdGFydFRpbWUgKyBmci50aW1lID4gdGhpcy5fbGFzdFJ1blRpbWUgJiYgdGhpcy5fc3RhcnRUaW1lICsgZnIudGltZSA8PSBhY3RUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmci5rZXlGcmFtZVJlYWNoZWRMaXN0ZW5lciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmci5rZXlGcmFtZVJlYWNoZWRMaXN0ZW5lcigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYWN0RnJhbWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmIChuZXh0RnJhbWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcG9zID0gKChhY3RUaW1lIC0gdGhpcy5fc3RhcnRUaW1lIC0gYWN0RnJhbWUudGltZSkpIC8gKG5leHRGcmFtZS50aW1lIC0gYWN0RnJhbWUudGltZSk7XG4gICAgICAgICAgICAgICAgICAgIGFjdEZyYW1lLnByb3BlcnR5LnZhbHVlID0gYWN0RnJhbWUucHJvcGVydHkuYW5pbWF0ZShwb3MsIGFjdEZyYW1lLmVuZFZhbHVlLCBuZXh0RnJhbWUuZW5kVmFsdWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFjdEZyYW1lLnByb3BlcnR5LnZhbHVlID0gYWN0RnJhbWUuZW5kVmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9sYXN0UnVuVGltZSA9IGFjdFRpbWU7XG5cbiAgICAgICAgICAgIHJldHVybiBhY3RUaW1lID49IHRoaXMuX3N0YXJ0VGltZSArIHRoaXMuX2tleUZyYW1lc1t0aGlzLl9rZXlGcmFtZXMubGVuZ3RoIC0gMV0udGltZTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIElJbnRlcnBvbGF0b3Ige1xuICAgICAgICAodmFsdWU6IG51bWJlcik6IG51bWJlcjtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgSW50ZXJwb2xhdG9ycyB7XG4gICAgICAgIHN0YXRpYyBnZXQgTGluZWFyKCk6IElJbnRlcnBvbGF0b3Ige1xuICAgICAgICAgICAgcmV0dXJuICh2YWx1ZTogbnVtYmVyKTogbnVtYmVyID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnQgYWJzdHJhY3QgY2xhc3MgQUFuaW1hdG9yIHtcblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBhbmltYXRvcnM6IEFBbmltYXRvcltdID0gW107XG4gICAgICAgIHByaXZhdGUgc3RhdGljIEFOSU1BVE9SX1RBU0sgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBBQW5pbWF0b3IuYW5pbWF0ZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHByaXZhdGUgc3RhcnRlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgICAgIHN0YXRpYyBhbmltYXRlKCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IEFBbmltYXRvci5hbmltYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICBpZiAoQUFuaW1hdG9yLmFuaW1hdG9ycy5sZW5ndGggPD0gaSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGFuaW1hdG9yOiBBQW5pbWF0b3IgPSBBQW5pbWF0b3IuYW5pbWF0b3JzW2ldO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdG9yLm9uQW5pbWF0ZSgpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3IENvbnNvbGUoKS5lcnJvcih0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChBQW5pbWF0b3IuYW5pbWF0b3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBFdmVudFF1ZXVlLkluc3RhbmNlLmludm9rZUxhdGVyKEFBbmltYXRvci5BTklNQVRPUl9UQVNLKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXJ0KCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhcnRlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgQUFuaW1hdG9yLmFuaW1hdG9ycy5wdXNoKHRoaXMpO1xuICAgICAgICAgICAgaWYgKEFBbmltYXRvci5hbmltYXRvcnMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICBFdmVudFF1ZXVlLkluc3RhbmNlLmludm9rZUxhdGVyKEFBbmltYXRvci5BTklNQVRPUl9UQVNLKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc3RhcnRlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXJ0ZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICB2YXIgaWR4ID0gQUFuaW1hdG9yLmFuaW1hdG9ycy5pbmRleE9mKHRoaXMpO1xuICAgICAgICAgICAgQUFuaW1hdG9yLmFuaW1hdG9ycy5zcGxpY2UoaWR4LCAxKVxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFN0YXJ0ZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdGFydGVkO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFN0b3BwZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gIXRoaXMuc3RhcnRlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBhYnN0cmFjdCBvbkFuaW1hdGUoKTogdm9pZDtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgVGltZWxpbmUgZXh0ZW5kcyBBQW5pbWF0b3Ige1xuXG5cbiAgICAgICAgcHJpdmF0ZSBwcm9wZXJ0eUxpbmVzOiBQcm9wZXJ0eUxpbmU8YW55PltdID0gW107XG4gICAgICAgIHByaXZhdGUgcmVwZWF0Q291bnQgPSAwO1xuICAgICAgICBwcml2YXRlIGZpbmlzaGVkRXZlbnQ6IEV2ZW50PFRpbWVsaW5lRmluaXNoZWRFdmVudEFyZ3M+ID0gbmV3IEV2ZW50PFRpbWVsaW5lRmluaXNoZWRFdmVudEFyZ3M+KCk7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBrZXlGcmFtZXM6IEtleUZyYW1lPGFueT5bXSkge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNyZWF0ZVByb3BlcnR5TGluZXMoKSB7XG4gICAgICAgICAgICB2YXIgcGxNYXA6IHsgW2tleTogc3RyaW5nXTogS2V5RnJhbWU8YW55PltdIH0gPSB7fTtcbiAgICAgICAgICAgIHZhciBrZXlzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmtleUZyYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBrZXlGcmFtZSA9IHRoaXMua2V5RnJhbWVzW2ldO1xuICAgICAgICAgICAgICAgIGxldCBrZjogS2V5RnJhbWU8YW55PiA9IGtleUZyYW1lO1xuICAgICAgICAgICAgICAgIGxldCBwcm9wZXJ0eUxpbmUgPSBwbE1hcFtrZi5wcm9wZXJ0eS5pZF07XG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5TGluZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5TGluZSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBwbE1hcFtrZi5wcm9wZXJ0eS5pZF0gPSBwcm9wZXJ0eUxpbmU7XG4gICAgICAgICAgICAgICAgICAgIGtleXMucHVzaChrZi5wcm9wZXJ0eS5pZClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5TGluZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eUxpbmVbcHJvcGVydHlMaW5lLmxlbmd0aCAtIDFdLnRpbWUgPj0ga2YudGltZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUga2V5ZnJhbWVzIG11c3QgYmUgaW4gYXNjZW5kaW5nIHRpbWUgb3JkZXIgcGVyIHByb3BlcnR5LlwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHByb3BlcnR5TGluZS5wdXNoKGtleUZyYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGtleXMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHByb3BlcnR5TGluZTogUHJvcGVydHlMaW5lPGFueT4gPSBwbE1hcFtrZXldWzBdLnByb3BlcnR5LmNyZWF0ZVByb3BlcnR5TGluZShwbE1hcFtrZXldKTtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnR5TGluZXMucHVzaChwcm9wZXJ0eUxpbmUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGFydChyZXBlYXRDb3VudDogbnVtYmVyID0gMCkge1xuICAgICAgICAgICAgaWYgKHJlcGVhdENvdW50ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXBlYXRDb3VudCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXBlYXRDb3VudCA9IHJlcGVhdENvdW50IHwgMDtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUHJvcGVydHlMaW5lcygpO1xuICAgICAgICAgICAgdGhpcy5yZXBlYXRDb3VudCA9IHJlcGVhdENvdW50O1xuICAgICAgICAgICAgdmFyIHN0YXJ0VGltZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgICB0aGlzLnByb3BlcnR5TGluZXMuZm9yRWFjaCgocHJvcGVydHlMaW5lKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHBsOiBQcm9wZXJ0eUxpbmU8YW55PiA9IHByb3BlcnR5TGluZTtcbiAgICAgICAgICAgICAgICBwbC5zdGFydFRpbWUgPSBzdGFydFRpbWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLlN0YXJ0ZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdXBlci5zdG9wKCk7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaGVkRXZlbnQuZmlyZUV2ZW50KG5ldyBUaW1lbGluZUZpbmlzaGVkRXZlbnRBcmdzKHRydWUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9uQW5pbWF0ZSgpIHtcbiAgICAgICAgICAgIHZhciBmaW5pc2hlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnByb3BlcnR5TGluZXMuZm9yRWFjaCgocHJvcGVydHlMaW5lKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHBsOiBQcm9wZXJ0eUxpbmU8YW55PiA9IHByb3BlcnR5TGluZTtcbiAgICAgICAgICAgICAgICBmaW5pc2hlZCA9IGZpbmlzaGVkICYmIHBsLmFuaW1hdGUoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoZmluaXNoZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yZXBlYXRDb3VudCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN0YXJ0VGltZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydHlMaW5lcy5mb3JFYWNoKChwcm9wZXJ0eUxpbmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwbDogUHJvcGVydHlMaW5lPGFueT4gPSBwcm9wZXJ0eUxpbmU7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbC5zdGFydFRpbWUgPSBzdGFydFRpbWU7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVwZWF0Q291bnQtLTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucmVwZWF0Q291bnQgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHN0YXJ0VGltZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnR5TGluZXMuZm9yRWFjaCgocHJvcGVydHlMaW5lKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBsOiBQcm9wZXJ0eUxpbmU8YW55PiA9IHByb3BlcnR5TGluZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbC5zdGFydFRpbWUgPSBzdGFydFRpbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1cGVyLnN0b3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmluaXNoZWRFdmVudC5maXJlRXZlbnQobmV3IFRpbWVsaW5lRmluaXNoZWRFdmVudEFyZ3MoZmFsc2UpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG9uRmluaXNoZWRFdmVudCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbmlzaGVkRXZlbnQ7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBUaW1lbGluZUZpbmlzaGVkRXZlbnRBcmdzIHtcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBzdG9wcGVkOiBib29sZWFuID0gZmFsc2UpIHtcblxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFN0b3BwZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdG9wcGVkO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIE51bWJlclByb3BlcnR5IGV4dGVuZHMgUHJvcGVydHk8bnVtYmVyPiB7XG5cbiAgICAgICAgYW5pbWF0ZShwb3M6IG51bWJlciwgc3RhcnRWYWx1ZTogbnVtYmVyLCBlbmRWYWx1ZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgICAgIHJldHVybiBzdGFydFZhbHVlICsgKChlbmRWYWx1ZSAtIHN0YXJ0VmFsdWUpICogcG9zKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFN0cmluZ1Byb3BlcnR5IGV4dGVuZHMgUHJvcGVydHk8c3RyaW5nPiB7XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgUGFkZGluZ1Byb3BlcnR5IGV4dGVuZHMgUHJvcGVydHk8UGFkZGluZz4ge1xuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEJvcmRlclByb3BlcnR5IGV4dGVuZHMgUHJvcGVydHk8Qm9yZGVyPiB7XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQmFja2dyb3VuZFByb3BlcnR5IGV4dGVuZHMgUHJvcGVydHk8QUJhY2tncm91bmQ+IHtcblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBCb29sZWFuUHJvcGVydHkgZXh0ZW5kcyBQcm9wZXJ0eTxib29sZWFuPiB7XG5cbiAgICB9XG4gICAgXG4gICAgZXhwb3J0IGNsYXNzIENvbG9yUHJvcGVydHkgZXh0ZW5kcyBQcm9wZXJ0eTxDb2xvcj4ge1xuXG4gICAgfVxuXG59XG5cblxuIiwiXG5cbm1vZHVsZSBjdWJlZSB7XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIElTdHlsZSB7XG5cbiAgICAgICAgYXBwbHkoZWxlbWVudDogSFRNTEVsZW1lbnQpOiB2b2lkO1xuXG4gICAgfVxuXG4gICAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFCYWNrZ3JvdW5kIGltcGxlbWVudHMgSVN0eWxlIHtcblxuICAgICAgICBhYnN0cmFjdCBhcHBseShlbGVtZW50OiBIVE1MRWxlbWVudCk6IHZvaWQ7XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQ29sb3Ige1xuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9UUkFOU1BBUkVOVCA9IENvbG9yLmdldEFyZ2JDb2xvcigweDAwMDAwMDAwKTtcbiAgICAgICAgc3RhdGljIGdldCBUUkFOU1BBUkVOVCgpIHtcbiAgICAgICAgICAgIHJldHVybiBDb2xvci5fVFJBTlNQQVJFTlQ7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQkxBQ0sgPSBDb2xvci5nZXRBcmdiQ29sb3IoMHhmZjAwMDAwMCk7XG4gICAgICAgIHN0YXRpYyBnZXQgQkxBQ0soKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29sb3IuX0JMQUNLO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBnZXRBcmdiQ29sb3IoYXJnYjogbnVtYmVyKTogQ29sb3Ige1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb2xvcihhcmdiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZ2V0QXJnYkNvbG9yQnlDb21wb25lbnRzKGFscGhhOiBudW1iZXIsIHJlZDogbnVtYmVyLCBncmVlbjogbnVtYmVyLCBibHVlOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGFscGhhID0gdGhpcy5maXhDb21wb25lbnQoYWxwaGEpO1xuICAgICAgICAgICAgcmVkID0gdGhpcy5maXhDb21wb25lbnQocmVkKTtcbiAgICAgICAgICAgIGdyZWVuID0gdGhpcy5maXhDb21wb25lbnQoZ3JlZW4pO1xuICAgICAgICAgICAgYmx1ZSA9IHRoaXMuZml4Q29tcG9uZW50KGJsdWUpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRBcmdiQ29sb3IoXG4gICAgICAgICAgICAgICAgYWxwaGEgPDwgMjRcbiAgICAgICAgICAgICAgICB8IHJlZCA8PCAxNlxuICAgICAgICAgICAgICAgIHwgZ3JlZW4gPDwgOFxuICAgICAgICAgICAgICAgIHwgYmx1ZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZ2V0UmdiQ29sb3IocmdiOiBudW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEFyZ2JDb2xvcihyZ2IgfCAweGZmMDAwMDAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZ2V0UmdiQ29sb3JCeUNvbXBvbmVudHMocmVkOiBudW1iZXIsIGdyZWVuOiBudW1iZXIsIGJsdWU6IG51bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QXJnYkNvbG9yQnlDb21wb25lbnRzKDI1NSwgcmVkLCBncmVlbiwgYmx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBmaXhDb21wb25lbnQoY29tcG9uZW50OiBudW1iZXIpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudCA9IGNvbXBvbmVudCB8IDA7XG4gICAgICAgICAgICBpZiAoY29tcG9uZW50IDwgMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY29tcG9uZW50ID4gMjU1KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDI1NTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZmFkZUNvbG9ycyhzdGFydENvbG9yOiBDb2xvciwgZW5kQ29sb3I6IENvbG9yLCBmYWRlUG9zaXRpb246IG51bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIENvbG9yLmdldEFyZ2JDb2xvckJ5Q29tcG9uZW50cyhcbiAgICAgICAgICAgICAgICB0aGlzLm1peENvbXBvbmVudChzdGFydENvbG9yLmFscGhhLCBlbmRDb2xvci5hbHBoYSwgZmFkZVBvc2l0aW9uKSxcbiAgICAgICAgICAgICAgICB0aGlzLm1peENvbXBvbmVudChzdGFydENvbG9yLnJlZCwgZW5kQ29sb3IucmVkLCBmYWRlUG9zaXRpb24pLFxuICAgICAgICAgICAgICAgIHRoaXMubWl4Q29tcG9uZW50KHN0YXJ0Q29sb3IuZ3JlZW4sIGVuZENvbG9yLmdyZWVuLCBmYWRlUG9zaXRpb24pLFxuICAgICAgICAgICAgICAgIHRoaXMubWl4Q29tcG9uZW50KHN0YXJ0Q29sb3IuYmx1ZSwgZW5kQ29sb3IuYmx1ZSwgZmFkZVBvc2l0aW9uKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIG1peENvbXBvbmVudChzdGFydFZhbHVlOiBudW1iZXIsIGVuZFZhbHVlOiBudW1iZXIsIHBvczogbnVtYmVyKSB7XG4gICAgICAgICAgICB2YXIgcmVzID0gKHN0YXJ0VmFsdWUgKyAoKGVuZFZhbHVlIC0gc3RhcnRWYWx1ZSkgKiBwb3MpKSB8IDA7XG4gICAgICAgICAgICByZXMgPSB0aGlzLmZpeENvbXBvbmVudChyZXMpO1xuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX2FyZ2IgPSAwO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGFyZ2I6IG51bWJlcikge1xuICAgICAgICAgICAgYXJnYiA9IGFyZ2IgfCAwO1xuICAgICAgICAgICAgdGhpcy5fYXJnYiA9IGFyZ2I7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgYXJnYigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hcmdiO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGFscGhhKCkge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLl9hcmdiID4+PiAyNCkgJiAweGZmO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHJlZCgpIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5fYXJnYiA+Pj4gMTYpICYgMHhmZjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBncmVlbigpIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5fYXJnYiA+Pj4gOCkgJiAweGZmO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGJsdWUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYXJnYiAmIDB4ZmY7XG4gICAgICAgIH1cblxuICAgICAgICBmYWRlKGZhZGVDb2xvcjogQ29sb3IsIGZhZGVQb3NpdGlvbjogbnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29sb3IuZmFkZUNvbG9ycyh0aGlzLCBmYWRlQ29sb3IsIGZhZGVQb3NpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICB0b0NTUygpIHtcbiAgICAgICAgICAgIHJldHVybiBcInJnYmEoXCIgKyB0aGlzLnJlZCArIFwiLCBcIiArIHRoaXMuZ3JlZW4gKyBcIiwgXCIgKyB0aGlzLmJsdWUgKyBcIiwgXCIgKyAodGhpcy5hbHBoYSAvIDI1NS4wKSArIFwiKVwiO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQ29sb3JCYWNrZ3JvdW5kIGV4dGVuZHMgQUJhY2tncm91bmQge1xuXG4gICAgICAgIHByaXZhdGUgX2NvbG9yOiBDb2xvciA9IG51bGw7XG4gICAgICAgIHByaXZhdGUgX2NhY2hlOiBzdHJpbmcgPSBudWxsO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNvbG9yOiBDb2xvcikge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgICAgIHRoaXMuX2NvbG9yID0gY29sb3I7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgY29sb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY29sb3I7XG4gICAgICAgIH1cblxuICAgICAgICBhcHBseShlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2NhY2hlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuX2NhY2hlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY29sb3IgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYmFja2dyb3VuZENvbG9yXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlID0gdGhpcy5fY29sb3IudG9DU1MoKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLl9jYWNoZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBQYWRkaW5nIGltcGxlbWVudHMgSVN0eWxlIHtcblxuICAgICAgICBzdGF0aWMgY3JlYXRlKHBhZGRpbmc6IG51bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQYWRkaW5nKHBhZGRpbmcsIHBhZGRpbmcsIHBhZGRpbmcsIHBhZGRpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IoXG4gICAgICAgICAgICBwcml2YXRlIF9sZWZ0OiBudW1iZXIsXG4gICAgICAgICAgICBwcml2YXRlIF90b3A6IG51bWJlcixcbiAgICAgICAgICAgIHByaXZhdGUgX3JpZ2h0OiBudW1iZXIsXG4gICAgICAgICAgICBwcml2YXRlIF9ib3R0b206IG51bWJlcikgeyB9XG5cbiAgICAgICAgZ2V0IGxlZnQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbGVmdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB0b3AoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdG9wO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHJpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGJvdHRvbSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib3R0b207XG4gICAgICAgIH1cblxuICAgICAgICBhcHBseShlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5wYWRkaW5nTGVmdCA9IHRoaXMuX2xlZnQgKyBcInB4XCI7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLnBhZGRpbmdUb3AgPSB0aGlzLl90b3AgKyBcInB4XCI7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLnBhZGRpbmdSaWdodCA9IHRoaXMuX3JpZ2h0ICsgXCJweFwiO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5wYWRkaW5nQm90dG9tID0gdGhpcy5fYm90dG9tICsgXCJweFwiO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQm9yZGVyIGltcGxlbWVudHMgSVN0eWxlIHtcblxuICAgICAgICBzdGF0aWMgY3JlYXRlKHdpZHRoOiBudW1iZXIsIGNvbG9yOiBDb2xvciwgcmFkaXVzOiBudW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQm9yZGVyKHdpZHRoLCB3aWR0aCwgd2lkdGgsIHdpZHRoLCBjb2xvciwgY29sb3IsIGNvbG9yLCBjb2xvciwgcmFkaXVzLCByYWRpdXMsIHJhZGl1cywgcmFkaXVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICAgICAgcHJpdmF0ZSBfbGVmdFdpZHRoOiBudW1iZXIsXG4gICAgICAgICAgICBwcml2YXRlIF90b3BXaWR0aDogbnVtYmVyLFxuICAgICAgICAgICAgcHJpdmF0ZSBfcmlnaHRXaWR0aDogbnVtYmVyLFxuICAgICAgICAgICAgcHJpdmF0ZSBfYm90dG9tV2lkdGg6IG51bWJlcixcbiAgICAgICAgICAgIHByaXZhdGUgX2xlZnRDb2xvcjogQ29sb3IsXG4gICAgICAgICAgICBwcml2YXRlIF90b3BDb2xvcjogQ29sb3IsXG4gICAgICAgICAgICBwcml2YXRlIF9yaWdodENvbG9yOiBDb2xvcixcbiAgICAgICAgICAgIHByaXZhdGUgX2JvdHRvbUNvbG9yOiBDb2xvcixcbiAgICAgICAgICAgIHByaXZhdGUgX3RvcExlZnRSYWRpdXM6IG51bWJlcixcbiAgICAgICAgICAgIHByaXZhdGUgX3RvcFJpZ2h0UmFkaXVzOiBudW1iZXIsXG4gICAgICAgICAgICBwcml2YXRlIF9ib3R0b21MZWZ0UmFkaXVzOiBudW1iZXIsXG4gICAgICAgICAgICBwcml2YXRlIF9ib3R0b21SaWdodFJhZGl1czogbnVtYmVyKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fbGVmdENvbG9yID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sZWZ0Q29sb3IgPSBDb2xvci5UUkFOU1BBUkVOVDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLl90b3BDb2xvciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdG9wQ29sb3IgPSBDb2xvci5UUkFOU1BBUkVOVDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLl9yaWdodENvbG9yID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yaWdodENvbG9yID0gQ29sb3IuVFJBTlNQQVJFTlQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5fYm90dG9tQ29sb3IgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2JvdHRvbUNvbG9yID0gQ29sb3IuVFJBTlNQQVJFTlQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgbGVmdFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xlZnRXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdG9wV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdG9wV2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHJpZ2h0V2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmlnaHRXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm90dG9tV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYm90dG9tV2lkdGg7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgbGVmdENvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xlZnRDb2xvcjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdG9wQ29sb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdG9wQ29sb3I7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHJpZ2h0Q29sb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmlnaHRDb2xvcjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm90dG9tQ29sb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYm90dG9tQ29sb3I7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgdG9wTGVmdFJhZGl1cygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90b3BMZWZ0UmFkaXVzO1xuICAgICAgICB9XG4gICAgICAgIGdldCB0b3BSaWdodFJhZGl1cygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90b3BSaWdodFJhZGl1cztcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm90dG9tTGVmdFJhZGl1cygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib3R0b21MZWZ0UmFkaXVzO1xuICAgICAgICB9XG4gICAgICAgIGdldCBib3R0b21SaWdodFJhZGl1cygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib3R0b21SaWdodFJhZGl1cztcbiAgICAgICAgfVxuXG4gICAgICAgIGFwcGx5KGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJvcmRlclN0eWxlID0gXCJzb2xpZFwiO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5ib3JkZXJMZWZ0Q29sb3IgPSB0aGlzLl9sZWZ0Q29sb3IudG9DU1MoKTtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuYm9yZGVyTGVmdFdpZHRoID0gdGhpcy5fbGVmdFdpZHRoICsgXCJweFwiO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5ib3JkZXJUb3BDb2xvciA9IHRoaXMuX3RvcENvbG9yLnRvQ1NTKCk7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJvcmRlclRvcFdpZHRoID0gdGhpcy5fdG9wV2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJvcmRlclJpZ2h0Q29sb3IgPSB0aGlzLl9yaWdodENvbG9yLnRvQ1NTKCk7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJvcmRlclJpZ2h0V2lkdGggPSB0aGlzLl9yaWdodFdpZHRoICsgXCJweFwiO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5ib3JkZXJCb3R0b21Db2xvciA9IHRoaXMuX2JvdHRvbUNvbG9yLnRvQ1NTKCk7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJvcmRlckJvdHRvbVdpZHRoID0gdGhpcy5fYm90dG9tV2lkdGggKyBcInB4XCI7XG5cbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuYm9yZGVyVG9wTGVmdFJhZGl1cyA9IHRoaXMuX3RvcExlZnRSYWRpdXMgKyBcInB4XCI7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJvcmRlclRvcFJpZ2h0UmFkaXVzID0gdGhpcy5fdG9wUmlnaHRSYWRpdXMgKyBcInB4XCI7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJvcmRlckJvdHRvbUxlZnRSYWRpdXMgPSB0aGlzLl9ib3R0b21MZWZ0UmFkaXVzICsgXCJweFwiO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5ib3JkZXJCb3R0b21SaWdodFJhZGl1cyA9IHRoaXMuX2JvdHRvbVJpZ2h0UmFkaXVzICsgXCJweFwiO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQm94U2hhZG93IGltcGxlbWVudHMgSVN0eWxlIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgICAgIHByaXZhdGUgX2hQb3M6IG51bWJlcixcbiAgICAgICAgICAgIHByaXZhdGUgX3ZQb3M6IG51bWJlcixcbiAgICAgICAgICAgIHByaXZhdGUgX2JsdXI6IG51bWJlcixcbiAgICAgICAgICAgIHByaXZhdGUgX3NwcmVhZDogbnVtYmVyLFxuICAgICAgICAgICAgcHJpdmF0ZSBfY29sb3I6IENvbG9yLFxuICAgICAgICAgICAgcHJpdmF0ZSBfaW5uZXI6IGJvb2xlYW4pIHsgfVxuXG4gICAgICAgIGdldCBoUG9zKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hQb3M7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgdlBvcygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92UG9zO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGJsdXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYmx1cjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBzcHJlYWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3ByZWFkO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGNvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGlubmVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lubmVyO1xuICAgICAgICB9XG5cbiAgICAgICAgYXBwbHkoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuYm94U2hhZG93ID0gdGhpcy5faFBvcyArIFwicHggXCIgKyB0aGlzLl92UG9zICsgXCJweCBcIiArIHRoaXMuX2JsdXIgKyBcInB4IFwiICsgdGhpcy5fc3ByZWFkICsgXCJweCBcIlxuICAgICAgICAgICAgKyB0aGlzLl9jb2xvci50b0NTUygpICsgKHRoaXMuX2lubmVyID8gXCIgaW5zZXRcIiA6IFwiXCIpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRVRleHRPdmVyZmxvdyBpbXBsZW1lbnRzIElTdHlsZSB7XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0NMSVAgPSBuZXcgRVRleHRPdmVyZmxvdyhcImNsaXBcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9FTExJUFNJUyA9IG5ldyBFVGV4dE92ZXJmbG93KFwiZWxsaXBzaXNcIik7XG5cbiAgICAgICAgc3RhdGljIGdldCBDTElQKCkge1xuICAgICAgICAgICAgcmV0dXJuIEVUZXh0T3ZlcmZsb3cuX0NMSVA7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0aWMgZ2V0IEVMTElQU0lTKCkge1xuICAgICAgICAgICAgcmV0dXJuIEVUZXh0T3ZlcmZsb3cuX0VMTElQU0lTO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBfY3NzOiBzdHJpbmcpIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBDU1MoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY3NzO1xuICAgICAgICB9XG5cbiAgICAgICAgYXBwbHkoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudGV4dE92ZXJmbG93ID0gdGhpcy5fY3NzO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRVRleHRBbGlnbiBpbXBsZW1lbnRzIElTdHlsZSB7XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0xFRlQgPSBuZXcgRVRleHRBbGlnbihcImxlZnRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DRU5URVIgPSBuZXcgRVRleHRBbGlnbihcImNlbnRlclwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1JJR0hUID0gbmV3IEVUZXh0QWxpZ24oXCJyaWdodFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0pVU1RJRlkgPSBuZXcgRVRleHRBbGlnbihcImp1c3RpZnlcIik7XG5cbiAgICAgICAgc3RhdGljIGdldCBMRUZUKCkge1xuICAgICAgICAgICAgcmV0dXJuIEVUZXh0QWxpZ24uX0xFRlQ7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0aWMgZ2V0IENFTlRFUigpIHtcbiAgICAgICAgICAgIHJldHVybiBFVGV4dEFsaWduLl9DRU5URVI7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0aWMgZ2V0IFJJR0hUKCkge1xuICAgICAgICAgICAgcmV0dXJuIEVUZXh0QWxpZ24uX1JJR0hUO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIGdldCBKVVNUSUZZKCkge1xuICAgICAgICAgICAgcmV0dXJuIEVUZXh0QWxpZ24uX0pVU1RJRlk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jc3M6IHN0cmluZykge1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IENTUygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jc3M7XG4gICAgICAgIH1cblxuICAgICAgICBhcHBseShlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS50ZXh0QWxpZ24gPSB0aGlzLl9jc3M7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBFSEFsaWduIHtcblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTEVGVCA9IG5ldyBFSEFsaWduKFwibGVmdFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0NFTlRFUiA9IG5ldyBFSEFsaWduKFwiY2VudGVyXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUklHSFQgPSBuZXcgRUhBbGlnbihcInJpZ2h0XCIpO1xuXG4gICAgICAgIHN0YXRpYyBnZXQgTEVGVCgpIHtcbiAgICAgICAgICAgIHJldHVybiBFSEFsaWduLl9MRUZUO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIGdldCBDRU5URVIoKSB7XG4gICAgICAgICAgICByZXR1cm4gRUhBbGlnbi5fQ0VOVEVSO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIGdldCBSSUdIVCgpIHtcbiAgICAgICAgICAgIHJldHVybiBFSEFsaWduLl9SSUdIVDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2Nzczogc3RyaW5nKSB7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQ1NTKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NzcztcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEVWQWxpZ24ge1xuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9UT1AgPSBuZXcgRVZBbGlnbihcInRvcFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX01JRERMRSA9IG5ldyBFVkFsaWduKFwibWlkZGxlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQk9UVE9NID0gbmV3IEVWQWxpZ24oXCJib3R0b21cIik7XG5cbiAgICAgICAgc3RhdGljIGdldCBUT1AoKSB7XG4gICAgICAgICAgICByZXR1cm4gRVZBbGlnbi5fVE9QO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIGdldCBNSURETEUoKSB7XG4gICAgICAgICAgICByZXR1cm4gRVZBbGlnbi5fTUlERExFO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIGdldCBCT1RUT00oKSB7XG4gICAgICAgICAgICByZXR1cm4gRVZBbGlnbi5fQk9UVE9NO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBfY3NzOiBzdHJpbmcpIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBDU1MoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY3NzO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRm9udEZhbWlseSBpbXBsZW1lbnRzIElTdHlsZSB7XG4gICAgICAgIFxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfYXJpYWwgPSBuZXcgRm9udEZhbWlseShcIkFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWZcIik7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZ2V0IEFyaWFsKCkge1xuICAgICAgICAgICAgcmV0dXJuIEZvbnRGYW1pbHkuX2FyaWFsO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBpbml0Rm9udENvbnRhaW5lclN0eWxlKCkge1xuICAgICAgICAgICAgdmFyIHduZDogYW55ID0gd2luZG93O1xuICAgICAgICAgICAgd25kLmZvbnRzU3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gICAgICAgICAgICB3bmQuZm9udHNTdHlsZS50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuICAgICAgICAgICAgdmFyIGRvYzogYW55ID0gZG9jdW1lbnQ7XG4gICAgICAgICAgICBkb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdLmFwcGVuZENoaWxkKHduZC5mb250c1N0eWxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVnaXN0ZXJGb250KG5hbWU6IHN0cmluZywgc3JjOiBzdHJpbmcsIGV4dHJhOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHZhciBleCA9IGV4dHJhO1xuICAgICAgICAgICAgaWYgKGV4ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBleCA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGN0ID0gXCJAZm9udC1mYWNlIHtmb250LWZhbWlseTogJ1wiICsgbmFtZSArIFwiJzsgc3JjOiB1cmwoJ1wiICsgc3JjICsgXCInKTtcIiArIGV4ICsgXCJ9XCI7XG4gICAgICAgICAgICB2YXIgaWggPSAoPGFueT53aW5kb3cpLmZvbnRzU3R5bGUuaW5uZXJIVE1MO1xuICAgICAgICAgICAgaWYgKGloID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpaCA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgKDxhbnk+d2luZG93KS5mb250c1N0eWxlLmlubmVySFRNTCA9IGloICsgY3Q7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jc3M6IHN0cmluZykge1xuICAgICAgICAgICAgaWYgKCFGb250RmFtaWx5LmluaXRpYWxpemVkKSB7XG4gICAgICAgICAgICAgICAgRm9udEZhbWlseS5pbml0Rm9udENvbnRhaW5lclN0eWxlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQ1NTKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NzcztcbiAgICAgICAgfVxuXG4gICAgICAgIGFwcGx5KGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmZvbnRGYW1pbHkgPSB0aGlzLl9jc3M7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBFQ3Vyc29yIHtcblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBhdXRvID0gbmV3IEVDdXJzb3IoXCJhdXRvXCIpO1xuICAgICAgICBzdGF0aWMgZ2V0IEFVVE8oKSB7XG4gICAgICAgICAgICByZXR1cm4gRUN1cnNvci5hdXRvO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBfY3NzOiBzdHJpbmcpIHsgfVxuXG4gICAgICAgIGdldCBjc3MoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY3NzO1xuICAgICAgICB9XG4gICAgfVxuXG59XG5cblxuIiwibW9kdWxlIGN1YmVlIHtcbiAgICBcbiAgICBleHBvcnQgaW50ZXJmYWNlIElSdW5uYWJsZSB7XG4gICAgICAgICgpOiB2b2lkO1xuICAgIH1cbiAgICBcbiAgICBleHBvcnQgY2xhc3MgUG9pbnQyRCB7XG4gICAgICAgIFxuICAgICAgICBjb25zdHJ1Y3RvciAocHJpdmF0ZSBfeDogbnVtYmVyLCBwcml2YXRlIF95OiBudW1iZXIpIHtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBnZXQgeCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl94O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBnZXQgeSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl95O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH1cbiAgICBcbn1cblxuXG4iLCJtb2R1bGUgY3ViZWUge1xuICAgIFxuICAgIGV4cG9ydCBjbGFzcyBMYXlvdXRDaGlsZHJlbiB7XG4gICAgICAgIHByaXZhdGUgY2hpbGRyZW46IEFDb21wb25lbnRbXSA9IFtdO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcGFyZW50OiBBTGF5b3V0KSB7XG4gICAgICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZChjb21wb25lbnQ6IEFDb21wb25lbnQpIHtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQucGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgY29tcG9uZW50IGlzIGFscmVhZHkgYSBjaGlsZCBvZiBhIGxheW91dC5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29tcG9uZW50Ll9zZXRQYXJlbnQodGhpcy5wYXJlbnQpO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5vblBhcmVudENoYW5nZWQuZmlyZUV2ZW50KG5ldyBQYXJlbnRDaGFuZ2VkRXZlbnRBcmdzKHRoaXMucGFyZW50LCBjb21wb25lbnQpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNvbXBvbmVudCk7XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5fb25DaGlsZEFkZGVkKGNvbXBvbmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbnNlcnQoaW5kZXg6IG51bWJlciwgY29tcG9uZW50OiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICBpZiAoY29tcG9uZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LnBhcmVudCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIGNvbXBvbmVudCBpcyBhbHJlYWR5IGEgY2hpbGQgb2YgYSBsYXlvdXQuXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbmV3Q2hpbGRyZW46IEFDb21wb25lbnRbXSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgICAgICAgICAgIG5ld0NoaWxkcmVuLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBuZXdDaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDAsIGNvbXBvbmVudCk7XG5cbiAgICAgICAgICAgIC8vIFRPRE8gVkVSWSBJTkVGRUNUSVZFXG4gICAgICAgICAgICB0aGlzLmNsZWFyKCk7XG5cbiAgICAgICAgICAgIG5ld0NoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGQoY2hpbGQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmVDb21wb25lbnQoY29tcG9uZW50OiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICB2YXIgaWR4ID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKGNvbXBvbmVudCk7XG4gICAgICAgICAgICBpZiAoaWR4IDwgMCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIGdpdmVuIGNvbXBvbmVudCBpc24ndCBhIGNoaWxkIG9mIHRoaXMgbGF5b3V0LlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yZW1vdmVJbmRleChpZHgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlSW5kZXgoaW5kZXg6IG51bWJlcikge1xuICAgICAgICAgICAgdmFyIHJlbW92ZWRDb21wb25lbnQ6IEFDb21wb25lbnQgPSB0aGlzLmNoaWxkcmVuW2luZGV4XTtcbiAgICAgICAgICAgIGlmIChyZW1vdmVkQ29tcG9uZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZW1vdmVkQ29tcG9uZW50Ll9zZXRQYXJlbnQobnVsbCk7XG4gICAgICAgICAgICAgICAgcmVtb3ZlZENvbXBvbmVudC5vblBhcmVudENoYW5nZWQuZmlyZUV2ZW50KG5ldyBQYXJlbnRDaGFuZ2VkRXZlbnRBcmdzKG51bGwsIHJlbW92ZWRDb21wb25lbnQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucGFyZW50Ll9vbkNoaWxkUmVtb3ZlZChyZW1vdmVkQ29tcG9uZW50LCBpbmRleCk7XG4gICAgICAgIH1cblxuICAgICAgICBjbGVhcigpIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZC5fc2V0UGFyZW50KG51bGwpO1xuICAgICAgICAgICAgICAgICAgICBjaGlsZC5vblBhcmVudENoYW5nZWQuZmlyZUV2ZW50KG5ldyBQYXJlbnRDaGFuZ2VkRXZlbnRBcmdzKG51bGwsIGNoaWxkKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5fb25DaGlsZHJlbkNsZWFyZWQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldChpbmRleDogbnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbltpbmRleF1cbiAgICAgICAgfVxuXG4gICAgICAgIGluZGV4T2YoY29tcG9uZW50OiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5pbmRleE9mKGNvbXBvbmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBzaXplKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxufVxuXG5cbiIsIm1vZHVsZSBjdWJlZSB7XG4gICAgXG4gICAgZXhwb3J0IGNsYXNzIE1vdXNlRXZlbnRUeXBlcyB7XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBNT1VTRV9ET1dOID0gMDtcbiAgICAgICAgcHVibGljIHN0YXRpYyBNT1VTRV9NT1ZFID0gMTtcbiAgICAgICAgcHVibGljIHN0YXRpYyBNT1VTRV9VUCA9IDI7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgTU9VU0VfRU5URVIgPSAzO1xuICAgICAgICBwdWJsaWMgc3RhdGljIE1PVVNFX0xFQVZFID0gNDtcbiAgICAgICAgcHVibGljIHN0YXRpYyBNT1VTRV9XSEVFTCA9IDU7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7IH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBQ29tcG9uZW50IHtcblxuICAgICAgICAvLyAgICAgICAgcHJpdmF0ZSBzdGF0aWMgcG9pbnRlckRvd25FdmVudHM6IE1vdXNlRG93bkV2ZW50TG9nW10gPSBbXTtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgICAgIHByaXZhdGUgc3RhdGljIGxvZ1BvaW50ZXJEb3duRXZlbnQoaXRlbTogTW91c2VEb3duRXZlbnRMb2cpIHtcbiAgICAgICAgLy8gICAgICAgICAgICBBQ29tcG9uZW50LnBvaW50ZXJEb3duRXZlbnRzLnB1c2goaXRlbSk7XG4gICAgICAgIC8vICAgICAgICB9XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgICAgICBzdGF0aWMgZmlyZURyYWdFdmVudHMoc2NyZWVuWDogbnVtYmVyLCBzY3JlZW5ZOiBudW1iZXIsIGFsdFByZXNzZWQ6IGJvb2xlYW4sIGN0cmxQcmVzc2VkOiBib29sZWFuLFxuICAgICAgICAvLyAgICAgICAgICAgIHNoaWZ0UHJlc3NlZDogYm9vbGVhbiwgbWV0YVByZXNzZWQ6IGJvb2xlYW4pIHtcbiAgICAgICAgLy8gICAgICAgICAgICBBQ29tcG9uZW50LnBvaW50ZXJEb3duRXZlbnRzLmZvckVhY2goKGxvZykgPT4ge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICBsZXQgYXJncyA9IG5ldyBNb3VzZURyYWdFdmVudEFyZ3Moc2NyZWVuWCwgc2NyZWVuWSwgc2NyZWVuWCAtIGxvZy5zY3JlZW5YLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgc2NyZWVuWSAtIGxvZy5zY3JlZW5ZLCBhbHRQcmVzc2VkLCBjdHJsUHJlc3NlZCwgc2hpZnRQcmVzc2VkLCBtZXRhUHJlc3NlZCwgbG9nLmNvbXBvbmVudCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGxvZy5jb21wb25lbnQub25Nb3VzZURyYWcuZmlyZUV2ZW50KGFyZ3MpO1xuICAgICAgICAvLyAgICAgICAgICAgIH0pO1xuICAgICAgICAvLyAgICAgICAgfVxuICAgICAgICAvL1xuICAgICAgICAvLyAgICAgICAgc3RhdGljIGZpcmVVcEV2ZW50cyhzY3JlZW5YOiBudW1iZXIsIHNjcmVlblk6IG51bWJlciwgYWx0UHJlc3NlZDogYm9vbGVhbiwgY3RybFByZXNzZWQ6IGJvb2xlYW4sXG4gICAgICAgIC8vICAgICAgICAgICAgc2hpZnRQcmVzc2VkOiBib29sZWFuLCBtZXRhUHJlc3NlZDogYm9vbGVhbiwgYnV0dG9uOiBudW1iZXIsIG5hdGl2ZUV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIC8vICAgICAgICAgICAgdmFyIHN0YW1wID0gRGF0ZS5ub3coKTtcbiAgICAgICAgLy8gICAgICAgICAgICBBQ29tcG9uZW50LnBvaW50ZXJEb3duRXZlbnRzLmZvckVhY2goKGxvZykgPT4ge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICBsZXQgYXJncyA9IG5ldyBNb3VzZVVwRXZlbnRBcmdzKHNjcmVlblgsIHNjcmVlblksIHNjcmVlblggLSBsb2cuc2NyZWVuWCxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIHNjcmVlblkgLSBsb2cuc2NyZWVuWSwgYWx0UHJlc3NlZCwgY3RybFByZXNzZWQsIHNoaWZ0UHJlc3NlZCwgbWV0YVByZXNzZWQsIGJ1dHRvbiwgbmF0aXZlRXZlbnQsIGxvZy5jb21wb25lbnQpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICBsb2cuY29tcG9uZW50Lm9uTW91c2VVcC5maXJlRXZlbnQoYXJncyk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGlmIChzdGFtcCAtIGxvZy50aW1lc3RhbXAgPCA1MDApIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGxvZy5jb21wb25lbnQub25DbGljay5maXJlRXZlbnQobmV3IENsaWNrRXZlbnRBcmdzKHNjcmVlblgsIHNjcmVlblksIGxvZy54LCBsb2cueSxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICBhbHRQcmVzc2VkLCBjdHJsUHJlc3NlZCwgc2hpZnRQcmVzc2VkLCBtZXRhUHJlc3NlZCwgYnV0dG9uLCBsb2cuY29tcG9uZW50KSk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICAgICB9KTtcbiAgICAgICAgLy8gICAgICAgICAgICBBQ29tcG9uZW50LnBvaW50ZXJEb3duRXZlbnRzID0gW107XG4gICAgICAgIC8vICAgICAgICB9XG5cbiAgICAgICAgLy8gICAgICAgIHB1YmxpYyBzdGF0aWMgYWRkTmF0aXZlRXZlbnQoZWxlbWVudDogRWxlbWVudCwgZXZlbnROYW1lOiBzdHJpbmcsIG5hdGl2ZUV2ZW50TGlzdGVuZXI6IHsgKGV2ZW50OiBVSUV2ZW50KTogYW55IH0sIHVzZUNhcHR1cmU6IGJvb2xlYW4pIHtcbiAgICAgICAgLy8gICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBuYXRpdmVFdmVudExpc3RlbmVyLCB1c2VDYXB0dXJlKTtcbiAgICAgICAgLy8gICAgICAgIH1cbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVtb3ZlTmF0aXZlRXZlbnQoZWxlbWVudDogRWxlbWVudCwgZXZlbnROYW1lOiBzdHJpbmcsIG5hdGl2ZUV2ZW50TGlzdGVuZXI6IHsgKGV2ZW50OiBVSUV2ZW50KTogYW55IH0sIHVzZUNhcHR1cmU6IGJvb2xlYW4pIHtcbiAgICAgICAgLy8gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBuYXRpdmVFdmVudExpc3RlbmVyLCB1c2VDYXB0dXJlKTtcbiAgICAgICAgLy8gICAgICAgIH1cblxuICAgICAgICAvLyAgICAgICAgcHJpdmF0ZSBuYXRpdmVFdmVudExpc3RlbmVyOiBJTmF0aXZlRXZlbnRMaXN0ZW5lciA9IChldmVudDogVUlFdmVudCk6IGFueSA9PiB7XG4gICAgICAgIC8vICAgICAgICAgICAgdGhpcy5oYW5kbGVOYXRpdmVFdmVudChldmVudCk7XG4gICAgICAgIC8vICAgICAgICB9O1xuXG4gICAgICAgIC8vICAgICAgICBwcml2YXRlIGhhbmRsZU5hdGl2ZUV2ZW50KGV2ZW50OiBVSUV2ZW50KSB7XG4gICAgICAgIC8vICAgICAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBUZXh0Qm94KSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGlmIChldmVudC50eXBlID09IFwia2V5dXBcIikge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgRXZlbnRRdWV1ZS5JbnN0YW5jZS5pbnZva2VQcmlvcigoKSA9PiB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgKDxUZXh0Qm94PnRoaXMpLnRleHRQcm9wZXJ0eSgpLnNldChnZXRFbGVtZW50KCkuZ2V0UHJvcGVydHlTdHJpbmcoXCJ2YWx1ZVwiKSk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgICAgIH1cbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgICAgICAgICAvL3ZhciB4ID0gZXZlbnQuY2xpZW50WDtcbiAgICAgICAgLy8gICAgICAgICAgICAvL3ZhciB5ID0gZXZlbnQuY2xpZW50WTtcbiAgICAgICAgLy8gICAgICAgICAgICAvL3ZhciB3aGVlbFZlbG9jaXR5ID0gZXZlbnQudmVsb2NpdHlZO1xuICAgICAgICAvLyAgICAgICAgICAgIHZhciBwYXJlbnQ6IEFDb21wb25lbnQ7XG4gICAgICAgIC8vICAgICAgICAgICAgdmFyIGtleUFyZ3M6IEtleUV2ZW50QXJncztcbiAgICAgICAgLy8gICAgICAgICAgICB2YXIgY3AgPSB0aGlzLmdldEN1YmVlUGFuZWwoKTtcbiAgICAgICAgLy8gICAgICAgICAgICB2YXIga2V2dDogS2V5Ym9hcmRFdmVudCA9IG51bGw7XG4gICAgICAgIC8vICAgICAgICAgICAgc3dpdGNoIChldmVudC50eXBlKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGNhc2UgXCJtb3VzZWRvd25cIjpcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgY2FzZSBcIm1vdXNld2hlZWxcIjpcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgaWYgKGNwICE9IG51bGwpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICBjcC5kb1BvaW50ZXJFdmVudENsaW1iaW5nVXAoeCwgeSwgd2hlZWxWZWxvY2l0eSxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuZ2V0QWx0S2V5KCksIGV2ZW50LmdldEN0cmxLZXkoKSwgZXZlbnQuZ2V0U2hpZnRLZXkoKSwgZXZlbnQuZ2V0TWV0YUtleSgpLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5nZXRUeXBlSW50KCksIGV2ZW50LmdldEJ1dHRvbigpLCBldmVudCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIFBvcHVwcy5kb1BvaW50ZXJFdmVudENsaW1iaW5nVXAoeCwgeSwgd2hlZWxWZWxvY2l0eSxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuZ2V0QWx0S2V5KCksIGV2ZW50LmdldEN0cmxLZXkoKSwgZXZlbnQuZ2V0U2hpZnRLZXkoKSwgZXZlbnQuZ2V0TWV0YUtleSgpLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5nZXRUeXBlSW50KCksIGV2ZW50LmdldEJ1dHRvbigpLCBldmVudCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgY2FzZSBcIm1vdXNlbW92ZVwiOlxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICBpZiAoQUNvbXBvbmVudC5wb2ludGVyRG93bkV2ZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGV2dCA9IDxNb3VzZUV2ZW50PmV2ZW50O1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIEFDb21wb25lbnQuZmlyZURyYWdFdmVudHMoZXZ0LmNsaWVudFgsIGV2dC5jbGllbnRZLCBldnQuYWx0S2V5LCBldnQuY3RybEtleSxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZ0LnNoaWZ0S2V5LCBldnQubWV0YUtleSk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIGxldCB3ZXZ0ID0gPFdoZWVsRXZlbnQ+ZXZlbnQ7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNwICE9IG51bGwpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3AuZG9Qb2ludGVyRXZlbnRDbGltYmluZ1VwKHdldnQuY2xpZW50WCwgd2V2dC5jbGllbnRZLCB3ZXZ0LmRlbHRhWSxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdldnQuYWx0S2V5LCB3ZXZ0LmN0cmxLZXksIHdldnQuc2hpZnRLZXksIHdldnQubWV0YUtleSxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdldnQudHlwZSwgd2V2dC5idXR0b24sIHdldnQpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBvcHVwcy5kb1BvaW50ZXJFdmVudENsaW1iaW5nVXAod2V2dC5jbGllbnRYLCB3ZXZ0LmNsaWVudFksIHdldnQuZGVsdGFZLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2V2dC5hbHRLZXksIHdldnQuY3RybEtleSwgd2V2dC5zaGlmdEtleSwgd2V2dC5tZXRhS2V5LFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2V2dC50eXBlLCB3ZXZ0LmJ1dHRvbiwgd2V2dCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGNhc2UgXCJtb3VzZXVwXCI6XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGxldCBldnQgPSA8TW91c2VFdmVudD5ldmVudDtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIEFDb21wb25lbnQuZmlyZURyYWdFdmVudHMoZXZ0LmNsaWVudFgsIGV2dC5jbGllbnRZLCBldnQuYWx0S2V5LCBldnQuY3RybEtleSxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICBldnQuc2hpZnRLZXksIGV2dC5tZXRhS2V5KTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICBjYXNlIFwibW91c2VvdmVyXCI6XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fcG9pbnRlclRyYW5zcGFyZW50LlZhbHVlKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAvL1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgaGFuZGxlIHBvaW50ZXJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIHBhcmVudCA9IHRoaXM7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICB3aGlsZSAocGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXBhcmVudC5oYW5kbGVQb2ludGVyKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LlBhcmVudDtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5ob3ZlcmVkKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbk1vdXNlRW50ZXIuZmlyZUV2ZW50KG5ldyBFdmVudEFyZ3ModGhpcykpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGNhc2UgXCJtb3VzZW91dFwiOlxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucG9pbnRlclRyYW5zcGFyZW50KSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAvL1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgaGFuZGxlIHBvaW50ZXJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIHBhcmVudCA9IHRoaXM7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICB3aGlsZSAocGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXBhcmVudC5oYW5kbGVQb2ludGVyKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LlBhcmVudDtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmhvdmVyZWQpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAvKmludCBjb21wWCA9IGdldExlZnQoKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgaW50IGNvbXBZID0gZ2V0VG9wKCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4ID49IGNvbXBYICYmIHkgPj0gY29tcFkgJiYgeCA8PSBjb21wWCArIGJvdW5kc1dpZHRoUHJvcGVydHkoKS5nZXQoKSAmJiB5IDw9IGNvbXBZICsgYm91bmRzSGVpZ2h0UHJvcGVydHkoKS5nZXQoKSkge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIH0qL1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25Nb3VzZUxlYXZlLmZpcmVFdmVudChuZXcgRXZlbnRBcmdzKHRoaXMpKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICBjYXNlIFwia2V5ZHdvblwiOlxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICBrZXZ0ID0gPEtleWJvYXJkRXZlbnQ+ZXZlbnQ7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICBsZXQga2V5QXJncyA9IG5ldyBLZXlFdmVudEFyZ3Moa2V2dC5rZXlDb2RlLCBrZXZ0LmFsdEtleSwga2V2dC5jdHJsS2V5LFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIGtldnQuc2hpZnRLZXksIGtldnQubWV0YUtleSwgdGhpcywga2V2dCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICB0aGlzLm9uS2V5RG93bi5maXJlRXZlbnQoa2V5QXJncyk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgY2FzZSBcImtleXByZXNzXCI6XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGtldnQgPSA8S2V5Ym9hcmRFdmVudD5ldmVudDtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGtleUFyZ3MgPSBuZXcgS2V5RXZlbnRBcmdzKGtldnQua2V5Q29kZSwga2V2dC5hbHRLZXksIGtldnQuY3RybEtleSxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICBrZXZ0LnNoaWZ0S2V5LCBrZXZ0Lm1ldGFLZXksIHRoaXMsIGtldnQpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgdGhpcy5vbktleVByZXNzLmZpcmVFdmVudChrZXlBcmdzKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICBjYXNlIFwia2V5dXBcIjpcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAga2V2dCA9IDxLZXlib2FyZEV2ZW50PmV2ZW50O1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAga2V5QXJncyA9IG5ldyBLZXlFdmVudEFyZ3Moa2V2dC5rZXlDb2RlLCBrZXZ0LmFsdEtleSwga2V2dC5jdHJsS2V5LFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIGtldnQuc2hpZnRLZXksIGtldnQubWV0YUtleSwgdGhpcywga2V2dCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICB0aGlzLm9uS2V5VXAuZmlyZUV2ZW50KGtleUFyZ3MpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGNhc2UgXCJjb250ZXh0bWVudVwiOlxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkNvbnRleHRNZW51LmZpcmVFdmVudChuZXcgQ29udGV4dE1lbnVFdmVudEFyZ3MoZXZlbnQsIHRoaXMpKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyAgICAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF90cmFuc2xhdGVYID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3RyYW5zbGF0ZVkgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfcm90YXRlID0gbmV3IE51bWJlclByb3BlcnR5KDAuMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfc2NhbGVYID0gbmV3IE51bWJlclByb3BlcnR5KDEuMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfc2NhbGVZID0gbmV3IE51bWJlclByb3BlcnR5KDEuMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdHJhbnNmb3JtQ2VudGVyWCA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLjUsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3RyYW5zZm9ybUNlbnRlclkgPSBuZXcgTnVtYmVyUHJvcGVydHkoMC41LCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9wYWRkaW5nID0gbmV3IFBhZGRpbmdQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2JvcmRlciA9IG5ldyBCb3JkZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX21lYXN1cmVkV2lkdGggPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIHRydWUpO1xuICAgICAgICBwcml2YXRlIF9tZWFzdXJlZEhlaWdodCA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgIHByaXZhdGUgX2NsaWVudFdpZHRoID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgcHJpdmF0ZSBfY2xpZW50SGVpZ2h0ID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgcHJpdmF0ZSBfYm91bmRzV2lkdGggPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIHRydWUpO1xuICAgICAgICBwcml2YXRlIF9ib3VuZHNIZWlnaHQgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIHRydWUpO1xuICAgICAgICBwcml2YXRlIF9ib3VuZHNMZWZ0ID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgcHJpdmF0ZSBfYm91bmRzVG9wID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgcHJpdmF0ZSBfbWVhc3VyZWRXaWR0aFNldHRlciA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9tZWFzdXJlZEhlaWdodFNldHRlciA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9jbGllbnRXaWR0aFNldHRlciA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9jbGllbnRIZWlnaHRTZXR0ZXIgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYm91bmRzV2lkdGhTZXR0ZXIgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYm91bmRzSGVpZ2h0U2V0dGVyID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2JvdW5kc0xlZnRTZXR0ZXIgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYm91bmRzVG9wU2V0dGVyID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2N1cnNvciA9IG5ldyBQcm9wZXJ0eTxFQ3Vyc29yPihFQ3Vyc29yLkFVVE8sIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3BvaW50ZXJUcmFuc3BhcmVudCA9IG5ldyBQcm9wZXJ0eTxib29sZWFuPihmYWxzZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfaGFuZGxlUG9pbnRlciA9IG5ldyBQcm9wZXJ0eTxib29sZWFuPih0cnVlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF92aXNpYmxlID0gbmV3IFByb3BlcnR5PGJvb2xlYW4+KHRydWUsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2VuYWJsZWQgPSBuZXcgUHJvcGVydHk8Ym9vbGVhbj4odHJ1ZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYWxwaGEgPSBuZXcgTnVtYmVyUHJvcGVydHkoMS4wLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9zZWxlY3RhYmxlID0gbmV3IFByb3BlcnR5PGJvb2xlYW4+KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9taW5XaWR0aCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX21pbkhlaWdodCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX21heFdpZHRoID0gbmV3IE51bWJlclByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfbWF4SGVpZ2h0ID0gbmV3IE51bWJlclByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfaG92ZXJlZCA9IG5ldyBQcm9wZXJ0eTxib29sZWFuPihmYWxzZSwgZmFsc2UsIHRydWUpO1xuICAgICAgICBwcml2YXRlIF9ob3ZlcmVkU2V0dGVyID0gbmV3IFByb3BlcnR5PGJvb2xlYW4+KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9wcmVzc2VkID0gbmV3IFByb3BlcnR5PGJvb2xlYW4+KGZhbHNlLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgIHByaXZhdGUgX3ByZXNzZWRTZXR0ZXIgPSBuZXcgUHJvcGVydHk8Ym9vbGVhbj4oZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX29uQ2xpY2sgPSBuZXcgRXZlbnQ8Q2xpY2tFdmVudEFyZ3M+KCk7XG4gICAgICAgIHByaXZhdGUgX29uTW91c2VEb3duID0gbmV3IEV2ZW50PE1vdXNlRG93bkV2ZW50QXJncz4oKTtcbiAgICAgICAgcHJpdmF0ZSBfb25Nb3VzZURyYWcgPSBuZXcgRXZlbnQ8TW91c2VEcmFnRXZlbnRBcmdzPigpO1xuICAgICAgICBwcml2YXRlIF9vbk1vdXNlTW92ZSA9IG5ldyBFdmVudDxNb3VzZU1vdmVFdmVudEFyZ3M+KCk7XG4gICAgICAgIHByaXZhdGUgX29uTW91c2VVcCA9IG5ldyBFdmVudDxNb3VzZVVwRXZlbnRBcmdzPigpO1xuICAgICAgICBwcml2YXRlIF9vbk1vdXNlRW50ZXIgPSBuZXcgRXZlbnQ8T2JqZWN0PigpO1xuICAgICAgICBwcml2YXRlIF9vbk1vdXNlTGVhdmUgPSBuZXcgRXZlbnQ8T2JqZWN0PigpO1xuICAgICAgICBwcml2YXRlIF9vbk1vdXNlV2hlZWwgPSBuZXcgRXZlbnQ8TW91c2VXaGVlbEV2ZW50QXJncz4oKTtcbiAgICAgICAgcHJpdmF0ZSBfb25LZXlEb3duID0gbmV3IEV2ZW50PEtleUV2ZW50QXJncz4oKTtcbiAgICAgICAgcHJpdmF0ZSBfb25LZXlQcmVzcyA9IG5ldyBFdmVudDxLZXlFdmVudEFyZ3M+KCk7XG4gICAgICAgIHByaXZhdGUgX29uS2V5VXAgPSBuZXcgRXZlbnQ8S2V5RXZlbnRBcmdzPigpO1xuICAgICAgICBwcml2YXRlIF9vblBhcmVudENoYW5nZWQgPSBuZXcgRXZlbnQ8UGFyZW50Q2hhbmdlZEV2ZW50QXJncz4oKTtcbiAgICAgICAgcHJpdmF0ZSBfb25Db250ZXh0TWVudSA9IG5ldyBFdmVudDxDb250ZXh0TWVudUV2ZW50QXJncz4oKTtcbiAgICAgICAgcHJpdmF0ZSBfbGVmdCA9IDA7XG4gICAgICAgIHByaXZhdGUgX3RvcCA9IDA7XG4gICAgICAgIHByaXZhdGUgX2VsZW1lbnQ6IEhUTUxFbGVtZW50O1xuICAgICAgICBwcml2YXRlIF9wYXJlbnQ6IEFMYXlvdXQ7XG4gICAgICAgIHB1YmxpYyBfbmVlZHNMYXlvdXQgPSB0cnVlO1xuICAgICAgICBwcml2YXRlIF9jdWJlZVBhbmVsOiBDdWJlZVBhbmVsO1xuICAgICAgICBwcml2YXRlIF90cmFuc2Zvcm1DaGFuZ2VkTGlzdGVuZXIgPSAoc2VuZGVyOiBPYmplY3QpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtKCk7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgfTtcbiAgICAgICAgcHJpdmF0ZSBfcG9zdENvbnN0cnVjdFJ1bk9uY2UgPSBuZXcgUnVuT25jZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBvc3RDb25zdHJ1Y3QoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgQUNvbXBvbmV0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gcm9vdEVsZW1lbnQgVGhlIHVuZGVybGF5aW5nIEhUTUwgZWxlbWVudCB3aGljaCB0aGlzIGNvbXBvbmVudCB3cmFwcy5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yKHJvb3RFbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudCA9IHJvb3RFbGVtZW50O1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5ib3hTaXppbmcgPSBcImJvcmRlci1ib3hcIjtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKFwiZHJhZ2dhYmxlXCIsIFwiZmFsc2VcIik7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5vdXRsaW5lU3R5bGUgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUub3V0bGluZVdpZHRoID0gXCIwcHhcIjtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUubWFyZ2luID0gXCIwcHhcIjtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9IFwiYWxsXCI7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2xhdGVYLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX3RyYW5zZm9ybUNoYW5nZWRMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2xhdGVZLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX3RyYW5zZm9ybUNoYW5nZWRMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLl9yb3RhdGUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fdHJhbnNmb3JtQ2hhbmdlZExpc3RlbmVyKTtcbiAgICAgICAgICAgIHRoaXMuX3NjYWxlWC5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl90cmFuc2Zvcm1DaGFuZ2VkTGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy5fc2NhbGVZLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX3RyYW5zZm9ybUNoYW5nZWRMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2Zvcm1DZW50ZXJYLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX3RyYW5zZm9ybUNoYW5nZWRMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2Zvcm1DZW50ZXJZLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX3RyYW5zZm9ybUNoYW5nZWRMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLl9ob3ZlcmVkLmluaXRSZWFkb25seUJpbmQodGhpcy5faG92ZXJlZFNldHRlcik7XG4gICAgICAgICAgICB0aGlzLl9wcmVzc2VkLmluaXRSZWFkb25seUJpbmQodGhpcy5fcHJlc3NlZFNldHRlcik7XG4gICAgICAgICAgICB0aGlzLl9wYWRkaW5nLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgcCA9IHRoaXMuX3BhZGRpbmcudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHAgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnBhZGRpbmcgPSBcIjBweFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHAuYXBwbHkodGhpcy5fZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9wYWRkaW5nLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2JvcmRlci5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGIgPSB0aGlzLl9ib3JkZXIudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKGIgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYm9yZGVyU3R5bGVcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJib3JkZXJDb2xvclwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImJvcmRlcldpZHRoXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYm9yZGVyUmFkaXVzXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGIuYXBwbHkodGhpcy5fZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9jdXJzb3IuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUuY3Vyc29yID0gdGhpcy5jdXJzb3IuY3NzO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl92aXNpYmxlLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdmlzaWJsZS52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZW5hYmxlZC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2VuYWJsZWQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2FscGhhLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLm9wYWNpdHkgPSBcIlwiICsgdGhpcy5fYWxwaGEudmFsdWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGFibGUuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zZWxlY3RhYmxlLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJtb3pVc2VyU2VsZWN0XCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwia2h0bWxVc2VyU2VsZWN0XCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwid2Via2l0VXNlclNlbGVjdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcIm1zVXNlclNlbGVjdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcInVzZXJTZWxlY3RcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcIm1velVzZXJTZWxlY3RcIiwgXCJub25lXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KFwia2h0bWxVc2VyU2VsZWN0XCIsIFwibm9uZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcIndlYmtpdFVzZXJTZWxlY3RcIiwgXCJub25lXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KFwibXNVc2VyU2VsZWN0XCIsIFwibm9uZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcInVzZXJTZWxlY3RcIiwgXCJub25lXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fc2VsZWN0YWJsZS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9taW5XaWR0aC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX21pbldpZHRoLnZhbHVlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcIm1pbldpZHRoXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoXCJtaW5XaWR0aFwiLCB0aGlzLl9taW5XaWR0aC52YWx1ZSArIFwicHhcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9taW5IZWlnaHQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9taW5IZWlnaHQudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwibWluSGVpZ2h0XCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoXCJtaW5IZWlnaHRcIiwgdGhpcy5fbWluSGVpZ2h0LnZhbHVlICsgXCJweFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX21heFdpZHRoLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbWF4V2lkdGgudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwibWF4V2lkdGhcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcIm1heFdpZHRoXCIsIHRoaXMuX21heFdpZHRoLnZhbHVlICsgXCJweFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX21heEhlaWdodC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX21heEhlaWdodC52YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJtYXhIZWlnaHRcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcIm1heEhlaWdodFwiLCB0aGlzLl9tYXhIZWlnaHQudmFsdWUgKyBcInB4XCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5faGFuZGxlUG9pbnRlci5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9oYW5kbGVQb2ludGVyLnZhbHVlIHx8IHRoaXMuX3BvaW50ZXJUcmFuc3BhcmVudC52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KFwicG9pbnRlckV2ZW50c1wiLCBcIm5vbmVcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcInBvaW50ZXJFdmVudHNcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9wb2ludGVyVHJhbnNwYXJlbnQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5faGFuZGxlUG9pbnRlci52YWx1ZSB8fCB0aGlzLl9wb2ludGVyVHJhbnNwYXJlbnQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcInBvaW50ZXJFdmVudHNcIiwgXCJub25lXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJwb2ludGVyRXZlbnRzXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLl9tZWFzdXJlZFdpZHRoLmluaXRSZWFkb25seUJpbmQodGhpcy5fbWVhc3VyZWRXaWR0aFNldHRlcik7XG4gICAgICAgICAgICB0aGlzLl9tZWFzdXJlZEhlaWdodC5pbml0UmVhZG9ubHlCaW5kKHRoaXMuX21lYXN1cmVkSGVpZ2h0U2V0dGVyKTtcbiAgICAgICAgICAgIHRoaXMuX2NsaWVudFdpZHRoLmluaXRSZWFkb25seUJpbmQodGhpcy5fY2xpZW50V2lkdGhTZXR0ZXIpO1xuICAgICAgICAgICAgdGhpcy5fY2xpZW50SGVpZ2h0LmluaXRSZWFkb25seUJpbmQodGhpcy5fY2xpZW50SGVpZ2h0U2V0dGVyKTtcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kc1dpZHRoLmluaXRSZWFkb25seUJpbmQodGhpcy5fYm91bmRzV2lkdGhTZXR0ZXIpO1xuICAgICAgICAgICAgdGhpcy5fYm91bmRzSGVpZ2h0LmluaXRSZWFkb25seUJpbmQodGhpcy5fYm91bmRzSGVpZ2h0U2V0dGVyKTtcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kc0xlZnQuaW5pdFJlYWRvbmx5QmluZCh0aGlzLl9ib3VuZHNMZWZ0U2V0dGVyKTtcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kc1RvcC5pbml0UmVhZG9ubHlCaW5kKHRoaXMuX2JvdW5kc1RvcFNldHRlcik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIFRPRE8gcmVwbGFjZSBldmVudCBoYW5kbGluZyBtZWNoYW5pc21cbiAgICAgICAgICAgIC8vRE9NLnNldEV2ZW50TGlzdGVuZXIoZ2V0RWxlbWVudCgpLCBuYXRpdmVFdmVudExpc3RlbmVyKTtcbiAgICAgICAgICAgIC8vIHNpbmtpbmcgYWxsIHRoZSBldmVudHNcbiAgICAgICAgICAgIC8vRE9NLnNpbmtFdmVudHMoZ2V0RWxlbWVudCgpLCAtMSk7XG5cbiAgICAgICAgICAgIHRoaXMuX29uTW91c2VFbnRlci5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5faG92ZXJlZFNldHRlci52YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX29uTW91c2VMZWF2ZS5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5faG92ZXJlZFNldHRlci52YWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9vbk1vdXNlRG93bi5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJlc3NlZFNldHRlci52YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX29uTW91c2VVcC5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJlc3NlZFNldHRlci52YWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGludm9rZVBvc3RDb25zdHJ1Y3QoKSB7XG4gICAgICAgICAgICB0aGlzLl9wb3N0Q29uc3RydWN0UnVuT25jZS5ydW4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBwb3N0Q29uc3RydWN0KCkge1xuXG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc2V0Q3ViZWVQYW5lbChjdWJlZVBhbmVsOiBDdWJlZVBhbmVsKSB7XG4gICAgICAgICAgICB0aGlzLl9jdWJlZVBhbmVsID0gY3ViZWVQYW5lbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldEN1YmVlUGFuZWwoKTogQ3ViZWVQYW5lbCB7XG4gICAgICAgICAgICBpZiAodGhpcy5fY3ViZWVQYW5lbCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2N1YmVlUGFuZWw7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0Q3ViZWVQYW5lbCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgdXBkYXRlVHJhbnNmb3JtKCkge1xuICAgICAgICAgICAgdmFyIGFuZ2xlID0gdGhpcy5fcm90YXRlLnZhbHVlO1xuICAgICAgICAgICAgYW5nbGUgPSBhbmdsZSAtIChhbmdsZSB8IDApO1xuICAgICAgICAgICAgYW5nbGUgPSBhbmdsZSAqIDM2MDtcbiAgICAgICAgICAgIHZhciBhbmdsZVN0ciA9IGFuZ2xlICsgXCJkZWdcIjtcblxuICAgICAgICAgICAgdmFyIGNlbnRlclggPSAodGhpcy5fdHJhbnNmb3JtQ2VudGVyWC52YWx1ZSAqIDEwMCkgKyBcIiVcIjtcbiAgICAgICAgICAgIHZhciBjZW50ZXJZID0gKHRoaXMuX3RyYW5zZm9ybUNlbnRlclkudmFsdWUgKiAxMDApICsgXCIlXCI7XG5cbiAgICAgICAgICAgIHZhciBzWCA9IHRoaXMuX3NjYWxlWC52YWx1ZS50b1N0cmluZygpO1xuICAgICAgICAgICAgdmFyIHNZID0gdGhpcy5fc2NhbGVZLnZhbHVlLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gY2VudGVyWCArIFwiIFwiICsgY2VudGVyWTtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gXCJ0cmFuc2xhdGUoXCIgKyB0aGlzLl90cmFuc2xhdGVYLnZhbHVlICsgXCJweCwgXCIgKyB0aGlzLl90cmFuc2xhdGVZLnZhbHVlXG4gICAgICAgICAgICArIFwicHgpIHJvdGF0ZShcIiArIGFuZ2xlU3RyICsgXCIpIHNjYWxlWCggXCIgKyBzWCArIFwiKSBzY2FsZVkoXCIgKyBzWSArIFwiKVwiO1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5iYWNrZmFjZVZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVxdWVzdExheW91dCgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fbmVlZHNMYXlvdXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9uZWVkc0xheW91dCA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3BhcmVudCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcmVudC5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9jdWJlZVBhbmVsICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3ViZWVQYW5lbC5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgUG9wdXBzLl9yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbWVhc3VyZSgpIHtcbiAgICAgICAgICAgIHRoaXMub25NZWFzdXJlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIG9uTWVhc3VyZSgpIHtcbiAgICAgICAgICAgIC8vIGNhbGN1bGF0aW5nIGNsaWVudCBib3VuZHNcbiAgICAgICAgICAgIHZhciBjdyA9IHRoaXMuX2VsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgICAgICAgICB2YXIgY2ggPSB0aGlzLl9lbGVtZW50LmNsaWVudEhlaWdodDtcbiAgICAgICAgICAgIHZhciBwID0gdGhpcy5fcGFkZGluZy52YWx1ZTtcbiAgICAgICAgICAgIGlmIChwICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjdyA9IGN3IC0gcC5sZWZ0IC0gcC5yaWdodDtcbiAgICAgICAgICAgICAgICBjaCA9IGNoIC0gcC50b3AgLSBwLmJvdHRvbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2NsaWVudFdpZHRoU2V0dGVyLnZhbHVlID0gY3c7XG4gICAgICAgICAgICB0aGlzLl9jbGllbnRIZWlnaHRTZXR0ZXIudmFsdWUgPSBjaDtcblxuICAgICAgICAgICAgLy8gY2FsY3VsYXRpbmcgbWVhc3VyZWQgYm91bmRzXG4gICAgICAgICAgICB2YXIgbXcgPSB0aGlzLl9lbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICAgICAgdmFyIG1oID0gdGhpcy5fZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICB0aGlzLl9tZWFzdXJlZFdpZHRoU2V0dGVyLnZhbHVlID0gbXc7XG4gICAgICAgICAgICB0aGlzLl9tZWFzdXJlZEhlaWdodFNldHRlci52YWx1ZSA9IG1oO1xuXG4gICAgICAgICAgICAvLyBjYWxjdWxhdGluZyBwYXJlbnQgYm91bmRzXG4gICAgICAgICAgICB2YXIgdGN4ID0gdGhpcy5fdHJhbnNmb3JtQ2VudGVyWC52YWx1ZTtcbiAgICAgICAgICAgIHZhciB0Y3kgPSB0aGlzLl90cmFuc2Zvcm1DZW50ZXJZLnZhbHVlO1xuXG4gICAgICAgICAgICB2YXIgYnggPSAwO1xuICAgICAgICAgICAgdmFyIGJ5ID0gMDtcbiAgICAgICAgICAgIHZhciBidyA9IG13O1xuICAgICAgICAgICAgdmFyIGJoID0gbWg7XG5cbiAgICAgICAgICAgIHZhciB0bCA9IG5ldyBQb2ludDJEKDAsIDApO1xuICAgICAgICAgICAgdmFyIHRyID0gbmV3IFBvaW50MkQobXcsIDApO1xuICAgICAgICAgICAgdmFyIGJyID0gbmV3IFBvaW50MkQobXcsIG1oKTtcbiAgICAgICAgICAgIHZhciBibCA9IG5ldyBQb2ludDJEKDAsIG1oKTtcblxuICAgICAgICAgICAgdmFyIGN4ID0gKG13ICogdGN4KSB8IDA7XG4gICAgICAgICAgICB2YXIgY3kgPSAobWggKiB0Y3kpIHwgMDtcblxuICAgICAgICAgICAgdmFyIHJvdCA9IHRoaXMuX3JvdGF0ZS52YWx1ZTtcbiAgICAgICAgICAgIGlmIChyb3QgIT0gMC4wKSB7XG4gICAgICAgICAgICAgICAgdGwgPSB0aGlzLnJvdGF0ZVBvaW50KGN4LCBjeSwgMCwgMCwgcm90KTtcbiAgICAgICAgICAgICAgICB0ciA9IHRoaXMucm90YXRlUG9pbnQoY3gsIGN5LCBidywgMCwgcm90KTtcbiAgICAgICAgICAgICAgICBiciA9IHRoaXMucm90YXRlUG9pbnQoY3gsIGN5LCBidywgYmgsIHJvdCk7XG4gICAgICAgICAgICAgICAgYmwgPSB0aGlzLnJvdGF0ZVBvaW50KGN4LCBjeSwgMCwgYmgsIHJvdCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzeCA9IHRoaXMuX3NjYWxlWC52YWx1ZTtcbiAgICAgICAgICAgIHZhciBzeSA9IHRoaXMuX3NjYWxlWS52YWx1ZTtcblxuICAgICAgICAgICAgaWYgKHN4ICE9IDEuMCB8fCBzeSAhPSAxLjApIHtcbiAgICAgICAgICAgICAgICB0bCA9IHRoaXMuc2NhbGVQb2ludChjeCwgY3ksIHRsLngsIHRsLnksIHN4LCBzeSk7XG4gICAgICAgICAgICAgICAgdHIgPSB0aGlzLnNjYWxlUG9pbnQoY3gsIGN5LCB0ci54LCB0ci55LCBzeCwgc3kpO1xuICAgICAgICAgICAgICAgIGJyID0gdGhpcy5zY2FsZVBvaW50KGN4LCBjeSwgYnIueCwgYnIueSwgc3gsIHN5KTtcbiAgICAgICAgICAgICAgICBibCA9IHRoaXMuc2NhbGVQb2ludChjeCwgY3ksIGJsLngsIGJsLnksIHN4LCBzeSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBtaW5YID0gTWF0aC5taW4oTWF0aC5taW4odGwueCwgdHIueCksIE1hdGgubWluKGJyLngsIGJsLngpKTtcbiAgICAgICAgICAgIHZhciBtaW5ZID0gTWF0aC5taW4oTWF0aC5taW4odGwueSwgdHIueSksIE1hdGgubWluKGJyLnksIGJsLnkpKTtcbiAgICAgICAgICAgIHZhciBtYXhYID0gTWF0aC5tYXgoTWF0aC5tYXgodGwueCwgdHIueCksIE1hdGgubWF4KGJyLngsIGJsLngpKTtcbiAgICAgICAgICAgIHZhciBtYXhZID0gTWF0aC5tYXgoTWF0aC5tYXgodGwueSwgdHIueSksIE1hdGgubWF4KGJyLnksIGJsLnkpKTtcbiAgICAgICAgICAgIGJ3ID0gbWF4WCAtIG1pblg7XG4gICAgICAgICAgICBiaCA9IG1heFkgLSBtaW5ZO1xuICAgICAgICAgICAgYnggPSBtaW5YO1xuICAgICAgICAgICAgYnkgPSBtaW5ZO1xuXG4gICAgICAgICAgICB0aGlzLl9ib3VuZHNMZWZ0U2V0dGVyLnZhbHVlID0gYng7XG4gICAgICAgICAgICB0aGlzLl9ib3VuZHNUb3BTZXR0ZXIudmFsdWUgPSBieTtcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kc1dpZHRoU2V0dGVyLnZhbHVlID0gYnc7XG4gICAgICAgICAgICB0aGlzLl9ib3VuZHNIZWlnaHRTZXR0ZXIudmFsdWUgPSBiaDtcbiAgICAgICAgfVxuXG4gICAgICAgIHNjYWxlUG9pbnQoY2VudGVyWDogbnVtYmVyLCBjZW50ZXJZOiBudW1iZXIsIHBvaW50WDogbnVtYmVyLCBwb2ludFk6IG51bWJlciwgc2NhbGVYOiBudW1iZXIsIHNjYWxlWTogbnVtYmVyKSB7XG4gICAgICAgICAgICB2YXIgcmVzWCA9IChjZW50ZXJYICsgKChwb2ludFggLSBjZW50ZXJYKSAqIHNjYWxlWCkpIHwgMDtcbiAgICAgICAgICAgIHZhciByZXNZID0gKGNlbnRlclkgKyAoKHBvaW50WSAtIGNlbnRlclkpICogc2NhbGVZKSkgfCAwO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQb2ludDJEKHJlc1gsIHJlc1kpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSByb3RhdGVQb2ludChjeDogbnVtYmVyLCBjeTogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlciwgYW5nbGU6IG51bWJlcikge1xuICAgICAgICAgICAgYW5nbGUgPSAoYW5nbGUgKiAzNjApICogKE1hdGguUEkgLyAxODApO1xuICAgICAgICAgICAgeCA9IHggLSBjeDtcbiAgICAgICAgICAgIHkgPSB5IC0gY3k7XG4gICAgICAgICAgICB2YXIgc2luID0gTWF0aC5zaW4oYW5nbGUpO1xuICAgICAgICAgICAgdmFyIGNvcyA9IE1hdGguY29zKGFuZ2xlKTtcbiAgICAgICAgICAgIHZhciByeCA9ICgoY29zICogeCkgLSAoc2luICogeSkpIHwgMDtcbiAgICAgICAgICAgIHZhciByeSA9ICgoc2luICogeCkgKyAoY29zICogeSkpIHwgMDtcbiAgICAgICAgICAgIHJ4ID0gcnggKyBjeDtcbiAgICAgICAgICAgIHJ5ID0gcnkgKyBjeTtcblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQb2ludDJEKHJ4LCByeSk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgZWxlbWVudCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9lbGVtZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHBhcmVudCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgX3NldFBhcmVudChwYXJlbnQ6IEFMYXlvdXQpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxheW91dCgpIHtcbiAgICAgICAgICAgIHRoaXMuX25lZWRzTGF5b3V0ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLm1lYXN1cmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBuZWVkc0xheW91dCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9uZWVkc0xheW91dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUcmFuc2xhdGVYKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0ZVg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRyYW5zbGF0ZVgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UcmFuc2xhdGVYLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0cmFuc2xhdGVYKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRyYW5zbGF0ZVgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUcmFuc2xhdGVZKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0ZVk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRyYW5zbGF0ZVkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UcmFuc2xhdGVZLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0cmFuc2xhdGVZKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRyYW5zbGF0ZVkudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgXG5cbiAgICAgICAgLy9cdHB1YmxpYyBmaW5hbCBEb3VibGVQcm9wZXJ0eSByb3RhdGVQcm9wZXJ0eSgpIHtcbiAgICAgICAgLy9cdFx0cmV0dXJuIHJvdGF0ZTtcbiAgICAgICAgLy9cdH1cbiAgICAgICAgLy9cbiAgICAgICAgLy9cdHB1YmxpYyBmaW5hbCBEb3VibGVQcm9wZXJ0eSBzY2FsZVhQcm9wZXJ0eSgpIHtcbiAgICAgICAgLy9cdFx0cmV0dXJuIHNjYWxlWDtcbiAgICAgICAgLy9cdH1cbiAgICAgICAgLy9cbiAgICAgICAgLy9cdHB1YmxpYyBmaW5hbCBEb3VibGVQcm9wZXJ0eSBzY2FsZVlQcm9wZXJ0eSgpIHtcbiAgICAgICAgLy9cdFx0cmV0dXJuIHNjYWxlWTtcbiAgICAgICAgLy9cdH1cbiAgICAgICAgLy9cbiAgICAgICAgLy9cdHB1YmxpYyBmaW5hbCBEb3VibGVQcm9wZXJ0eSB0cmFuc2Zvcm1DZW50ZXJYUHJvcGVydHkoKSB7XG4gICAgICAgIC8vXHRcdHJldHVybiB0cmFuc2Zvcm1DZW50ZXJYO1xuICAgICAgICAvL1x0fVxuICAgICAgICAvL1xuICAgICAgICAvL1x0cHVibGljIGZpbmFsIERvdWJsZVByb3BlcnR5IHRyYW5zZm9ybUNlbnRlcllQcm9wZXJ0eSgpIHtcbiAgICAgICAgLy9cdFx0cmV0dXJuIHRyYW5zZm9ybUNlbnRlclk7XG4gICAgICAgIC8vXHR9XG4gICAgICAgIFxuICAgICAgICBnZXQgUGFkZGluZygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYWRkaW5nO1xuICAgICAgICB9XG4gICAgICAgIGdldCBwYWRkaW5nKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuUGFkZGluZy52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgcGFkZGluZyh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5QYWRkaW5nLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm9yZGVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvcmRlcjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm9yZGVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm9yZGVyLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBib3JkZXIodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQm9yZGVyLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgTWVhc3VyZWRXaWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tZWFzdXJlZFdpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGdldCBtZWFzdXJlZFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuTWVhc3VyZWRXaWR0aC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgbWVhc3VyZWRXaWR0aCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5NZWFzdXJlZFdpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgTWVhc3VyZWRIZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbWVhc3VyZWRIZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IG1lYXN1cmVkSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuTWVhc3VyZWRIZWlnaHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IG1lYXN1cmVkSGVpZ2h0KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLk1lYXN1cmVkSGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQ2xpZW50V2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2xpZW50V2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGNsaWVudFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQ2xpZW50V2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGNsaWVudFdpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkNsaWVudFdpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQ2xpZW50SGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NsaWVudEhlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgY2xpZW50SGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQ2xpZW50SGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBjbGllbnRIZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQ2xpZW50SGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm91bmRzV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYm91bmRzV2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJvdW5kc1dpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm91bmRzV2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGJvdW5kc1dpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkJvdW5kc1dpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm91bmRzSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvdW5kc0hlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm91bmRzSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm91bmRzSGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBib3VuZHNIZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQm91bmRzSGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm91bmRzTGVmdCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib3VuZHNMZWZ0O1xuICAgICAgICB9XG4gICAgICAgIGdldCBib3VuZHNMZWZ0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm91bmRzTGVmdC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYm91bmRzTGVmdCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Cb3VuZHNMZWZ0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm91bmRzVG9wKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvdW5kc1RvcDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm91bmRzVG9wKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm91bmRzVG9wLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBib3VuZHNUb3AodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQm91bmRzVG9wLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IE1pbldpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21pbldpZHRoO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBnZXQgbWluV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5NaW5XaWR0aC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgc2V0IG1pbldpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLk1pbldpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IE1pbkhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9taW5IZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGdldCBtaW5IZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5NaW5IZWlnaHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIHNldCBtaW5IZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuTWluSGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IE1heFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21heFdpZHRoO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBnZXQgbWF4V2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5NYXhXaWR0aC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgc2V0IG1heFdpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLk1heFdpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IE1heEhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tYXhIZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGdldCBtYXhIZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5NYXhIZWlnaHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIHNldCBtYXhIZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuTWF4SGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0cyB0aGUgYmFzZSBwb3NpdGlvbiBvZiB0aGlzIGNvbXBvbmVudCByZWxhdGl2ZSB0byB0aGUgcGFyZW50J3MgdG9wLWxlZnQgY29ybmVyLiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgZnJvbSBhXG4gICAgICAgICAqIGxheW91dCdzIG9uTGF5b3V0IG1ldGhvZCB0byBzZXQgdGhlIGJhc2UgcG9zaXRpb24gb2YgdGhpcyBjb21wb25lbnQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBsZWZ0IFRoZSBsZWZ0IGJhc2UgcG9zaXRpb24gb2YgdGhpcyBjb21wb25lbnQgcmVsYXRpdmUgdG8gdGhlIHBhcmVudHMgdG9wLWxlZnQgY29ybmVyLlxuICAgICAgICAgKiBAcGFyYW0gdG9wIFRoZSB0b3AgYmFzZSBwb3NpdGlvbiBvZiB0aGlzIGNvbXBvbmVudCByZWxhdGl2ZSB0byB0aGUgcGFyZW50cyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqL1xuICAgICAgICBwcm90ZWN0ZWQgc2V0UG9zaXRpb24obGVmdDogbnVtYmVyLCB0b3A6IG51bWJlcikge1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5sZWZ0ID0gXCJcIiArIGxlZnQgKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnRvcCA9IFwiXCIgKyB0b3AgKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLl9sZWZ0ID0gbGVmdDtcbiAgICAgICAgICAgIHRoaXMuX3RvcCA9IHRvcDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIHRoZSBiYXNlIGxlZnQgcG9zaXRpb24gb2YgdGhpcyBjb21wb25lbnQgcmVsYXRpdmUgdG8gdGhlIHBhcmVudCdzIHRvcC1sZWZ0IGNvcm5lci4gVGhpcyBtZXRob2QgaXMgY2FsbGVkXG4gICAgICAgICAqIGZyb20gYSBsYXlvdXQncyBvbkxheW91dCBtZXRob2QgdG8gc2V0IHRoZSBiYXNlIGxlZnQgcG9zaXRpb24gb2YgdGhpcyBjb21wb25lbnQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBsZWZ0IFRoZSBsZWZ0IGJhc2UgcG9zaXRpb24gb2YgdGhpcyBjb21wb25lbnQgcmVsYXRpdmUgdG8gdGhlIHBhcmVudHMgdG9wLWxlZnQgY29ybmVyLlxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIF9zZXRMZWZ0KGxlZnQ6IG51bWJlcikge1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5sZWZ0ID0gXCJcIiArIGxlZnQgKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLl9sZWZ0ID0gbGVmdDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIHRoZSBiYXNlIHRvcCBwb3NpdGlvbiBvZiB0aGlzIGNvbXBvbmVudCByZWxhdGl2ZSB0byB0aGUgcGFyZW50J3MgdG9wLWxlZnQgY29ybmVyLiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgZnJvbVxuICAgICAgICAgKiBhIGxheW91dCdzIG9uTGF5b3V0IG1ldGhvZCB0byBzZXQgdGhlIGJhc2UgdG9wIHBvc2l0aW9uIG9mIHRoaXMgY29tcG9uZW50LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gdG9wIFRoZSB0b3AgYmFzZSBwb3NpdGlvbiBvZiB0aGlzIGNvbXBvbmVudCByZWxhdGl2ZSB0byB0aGUgcGFyZW50cyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgX3NldFRvcCh0b3A6IG51bWJlcikge1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS50b3AgPSBcIlwiICsgdG9wICsgXCJweFwiO1xuICAgICAgICAgICAgdGhpcy5fdG9wID0gdG9wO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgdGhlIHNpemUgb2YgdGhpcyBjb21wb25lbnQuIFRoaXMgbWV0aG9kIGNhbiBiZSBjYWxsZWQgd2hlbiBhIGR5bmFtaWNhbGx5IHNpemVkIGNvbXBvbmVudCdzIHNpemUgaXNcbiAgICAgICAgICogY2FsY3VsYXRlZC4gVHlwaWNhbGx5IGZyb20gdGhlIG9uTGF5b3V0IG1ldGhvZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHdpZHRoIFRoZSB3aWR0aCBvZiB0aGlzIGNvbXBvbmVudC5cbiAgICAgICAgICogQHBhcmFtIGhlaWdodCBUaGUgaGVpZ2h0IG9mIHRoaXMgY29tcG9uZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgcHJvdGVjdGVkIHNldFNpemUod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUud2lkdGggPSBcIlwiICsgd2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLmhlaWdodCA9IFwiXCIgKyBoZWlnaHQgKyBcInB4XCI7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQ3Vyc29yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnNvcjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgY3Vyc29yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQ3Vyc29yLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBjdXJzb3IodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQ3Vyc29yLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgUG9pbnRlclRyYW5zcGFyZW50KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BvaW50ZXJUcmFuc3BhcmVudDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgcG9pbnRlclRyYW5zcGFyZW50KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuUG9pbnRlclRyYW5zcGFyZW50LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBwb2ludGVyVHJhbnNwYXJlbnQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuUG9pbnRlclRyYW5zcGFyZW50LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVmlzaWJsZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92aXNpYmxlO1xuICAgICAgICB9XG4gICAgICAgIGdldCB2aXNpYmxlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVmlzaWJsZS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdmlzaWJsZSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5WaXNpYmxlLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgb25DbGljaygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbkNsaWNrO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IG9uQ29udGV4dE1lbnUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25Db250ZXh0TWVudTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBvbk1vdXNlRG93bigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbk1vdXNlRG93bjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBvbk1vdXNlTW92ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbk1vdXNlTW92ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBvbk1vdXNlVXAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25Nb3VzZVVwO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IG9uTW91c2VFbnRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbk1vdXNlRW50ZXI7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgb25Nb3VzZUxlYXZlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX29uTW91c2VMZWF2ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBvbk1vdXNlV2hlZWwoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25Nb3VzZVdoZWVsO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IG9uS2V5RG93bigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbktleURvd247XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgb25LZXlQcmVzcygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbktleVByZXNzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IG9uS2V5VXAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25LZXlVcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBvblBhcmVudENoYW5nZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25QYXJlbnRDaGFuZ2VkO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEFscGhhKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FscGhhO1xuICAgICAgICB9XG4gICAgICAgIGdldCBhbHBoYSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkFscGhhLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBhbHBoYSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5BbHBoYS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEhhbmRsZVBvaW50ZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGFuZGxlUG9pbnRlcjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgaGFuZGxlUG9pbnRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkhhbmRsZVBvaW50ZXIudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGhhbmRsZVBvaW50ZXIodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuSGFuZGxlUG9pbnRlci52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEVuYWJsZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZW5hYmxlZDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgZW5hYmxlZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkVuYWJsZWQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGVuYWJsZWQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuRW5hYmxlZC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFNlbGVjdGFibGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0YWJsZTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgc2VsZWN0YWJsZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlNlbGVjdGFibGUudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHNlbGVjdGFibGUodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0YWJsZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cblxuICAgICAgICBnZXQgbGVmdCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sZWZ0O1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHRvcCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90b3A7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIGJ5IHRoZSBwYXJlbnQgb2YgdGhpcyBjb21wb25lbnQgd2hlbiBhIHBvaW50ZXIgZXZlbnQgaXMgb2NjdXJlZC4gVGhlIGdvYWwgb2YgdGhpcyBtZXRob2QgaXNcbiAgICAgICAgICogdG8gZGVjaWRlIGlmIHRoaXMgY29tcG9uZW50IHdhbnRzIHRvIGhhbmRsZSB0aGUgZXZlbnQgb3Igbm90LCBhbmQgZGVsZWdhdGUgdGhlIGV2ZW50IHRvIGNoaWxkIGNvbXBvbmVudHMgaWZcbiAgICAgICAgICogbmVlZGVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gc2NyZWVuWCBUaGUgeCBjb29yZGluYXRlIG9mIHRoZSBwb2ludGVyIHJlbGF0aXZlIHRvIHRoZSBzY3JlZW4ncyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqIEBwYXJhbSBzY3JlZW5ZIFRoZSB5IGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50ZXIgcmVsYXRpdmUgdG8gdGhlIHNjcmVlbidzIHRvcC1sZWZ0IGNvcm5lci5cbiAgICAgICAgICogQHBhcmFtIHBhcmVudFNjcmVlblggVGhlIHggY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnRlciByZWxhdGl2ZSB0byB0aGUgcGFyZW50J3MgdG9wLWxlZnQgY29ybmVyLlxuICAgICAgICAgKiBAcGFyYW0gcGFyZW50U2NyZWVuWSBUaGUgeSBjb29yZGluYXRlIG9mIHRoZSBwb2ludGVyIHJlbGF0aXZlIHRvIHRoZSBwYXJlbnQncyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqIEBwYXJhbSB4IFRoZSB4IGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50ZXIgcmVsYXRpdmUgdG8gdGhpcyBjb21wb25lbnQncyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqIEBwYXJhbSB5IFRoZSB5IGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50ZXIgcmVsYXRpdmUgdG8gdGhpcyBjb21wb25lbnQncyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqIEBwYXJhbSB3aGVlbFZlbG9jaXR5IFRoZSBtb3VzZSB3aGVlbCB2ZWxvY2l0eSB2YWx1ZS5cbiAgICAgICAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgdGhlIGV2ZW50LiBWYWxpZCB2YWx1ZXMgYXJlIGxpc3RlZCBpbiBQb2ludGVyRXZlbnRBcmdzIGNsYXNzLlxuICAgICAgICAgKiBAcGFyYW0gYWx0UHJlc3NlZCBJbmRpY2F0ZXMgaWYgdGhlIGFsdCBrZXkgaXMgcHJlc3NlZCB3aGVuIHRoZSBldmVudCBvY2N1cmVkIG9yIG5vdC5cbiAgICAgICAgICogQHBhcmFtIGN0cmxQcmVzc2VkIEluZGljYXRlcyBpZiB0aGUgY3RybCBrZXkgaXMgcHJlc3NlZCB3aGVuIHRoZSBldmVudCBvY2N1cmVkIG9yIG5vdC5cbiAgICAgICAgICogQHBhcmFtIHNoaWZ0UHJlc3NlZCBJbmRpY2F0ZXMgaWYgdGhlIHNoaWZ0IGtleSBpcyBwcmVzc2VkIHdoZW4gdGhlIGV2ZW50IG9jY3VyZWQgb3Igbm90LlxuICAgICAgICAgKiBAcGFyYW0gbWV0YVByZXNzZWQgSW5kaWNhdGVzIGlmIHRoZSBtZXRhIGtleSBpcyBwcmVzc2VkIHdoZW4gdGhlIGV2ZW50IG9jY3VyZWQgb3Igbm90LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIFRydWUgaWYgdGhlIGV2ZW50IGlzIGZ1bGx5IGhhbmRsZWQgYW5kIHVuZGVybGF5aW5nIGNvbXBvbmVudHMgY2FuJ3QgaGFuZGxlIHRoaXMgZXZlbnQsIG90aGVyd2lzZSBmYWxzZSBpZlxuICAgICAgICAgKiB1bmRlcmxheWluZyBjb21wb25lbnRzIGNhbiBoYW5kbGUgdGhpcyBldmVudC5cbiAgICAgICAgICovXG4gICAgICAgIF9kb1BvaW50ZXJFdmVudENsaW1iaW5nVXAoc2NyZWVuWDogbnVtYmVyLCBzY3JlZW5ZOiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyLCB3aGVlbFZlbG9jaXR5OiBudW1iZXIsXG4gICAgICAgICAgICBhbHRQcmVzc2VkOiBib29sZWFuLCBjdHJsUHJlc3NlZDogYm9vbGVhbiwgc2hpZnRQcmVzc2VkOiBib29sZWFuLCBtZXRhUHJlc3NlZDogYm9vbGVhblxuICAgICAgICAgICAgLCBldmVudFR5cGU6IG51bWJlciwgYnV0dG9uOiBudW1iZXIsIG5hdGl2ZUV2ZW50OiBVSUV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2hhbmRsZVBvaW50ZXIudmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5fcG9pbnRlclRyYW5zcGFyZW50LnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuX2VuYWJsZWQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdGhpcy5fdmlzaWJsZS52YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMub25Qb2ludGVyRXZlbnRDbGltYmluZ1VwKHNjcmVlblgsIHNjcmVlblksIHgsIHksIHdoZWVsVmVsb2NpdHksIGFsdFByZXNzZWQsXG4gICAgICAgICAgICAgICAgY3RybFByZXNzZWQsIHNoaWZ0UHJlc3NlZCwgbWV0YVByZXNzZWQsIGV2ZW50VHlwZSwgYnV0dG9uKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9uUG9pbnRlckV2ZW50RmFsbGluZ0Rvd24oc2NyZWVuWCwgc2NyZWVuWSwgeCwgeSwgd2hlZWxWZWxvY2l0eSwgYWx0UHJlc3NlZCxcbiAgICAgICAgICAgICAgICBjdHJsUHJlc3NlZCwgc2hpZnRQcmVzc2VkLCBtZXRhUHJlc3NlZCwgZXZlbnRUeXBlLCBidXR0b24sIG5hdGl2ZUV2ZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vXHRib29sZWFuIGRvUG9pbnRlckV2ZW50RmFsbGluZ0Rvd24oaW50IHNjcmVlblgsIGludCBzY3JlZW5ZLCBpbnQgcGFyZW50U2NyZWVuWCwgaW50IHBhcmVudFNjcmVlblksXG4gICAgICAgIC8vXHRcdFx0aW50IHgsIGludCB5LCBpbnQgd2hlZWxWZWxvY2l0eSwgYm9vbGVhbiBhbHRQcmVzc2VkLCBib29sZWFuIGN0cmxQcmVzc2VkLCBib29sZWFuIHNoaWZ0UHJlc3NlZCxcbiAgICAgICAgLy9cdFx0XHRib29sZWFuIG1ldGFQcmVzc2VkLCBpbnQgdHlwZSkge1xuICAgICAgICAvL1x0XHRyZXR1cm4gb25Qb2ludGVyRXZlbnRGYWxsaW5nRG93bihzY3JlZW5YLCBzY3JlZW5ZLCBwYXJlbnRTY3JlZW5YLCBwYXJlbnRTY3JlZW5ZLCB4LCB5LCB3aGVlbFZlbG9jaXR5LCBhbHRQcmVzc2VkLFxuICAgICAgICAvL1x0XHRcdFx0Y3RybFByZXNzZWQsIHNoaWZ0UHJlc3NlZCwgbWV0YVByZXNzZWQsIHR5cGUpO1xuICAgICAgICAvL1x0fVxuICAgICAgICAvKipcbiAgICAgICAgICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIHdoZW4gYSBwb2ludGVyIGV2ZW50IGlzIGNsaW1iaW5nIHVwIG9uIHRoZSBjb21wb25lbnQgaGllcmFyY2h5LiBUaGUgZ29hbCBvZiB0aGlzIG1ldGhvZCBpc1xuICAgICAgICAgKiB0byBkZWNpZGUgaWYgdGhlIGV2ZW50IGNhbiByZWFjaCBjaGlsZCBjb21wb25lbnRzIG9yIG5vdC4gSW4gdGhlIG1vc3Qgb2YgdGhlIGNhc2VzIHlvdSBkb24ndCBuZWVkIHRvIG92ZXJ3cml0ZVxuICAgICAgICAgKiB0aGlzIG1ldGhvZC4gVGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gaXMgcmV0dXJucyB0cnVlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gc2NyZWVuWCBUaGUgeCBjb29yZGluYXRlIG9mIHRoZSBwb2ludGVyIHJlbGF0aXZlIHRvIHRoZSBzY3JlZW4ncyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqIEBwYXJhbSBzY3JlZW5ZIFRoZSB5IGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50ZXIgcmVsYXRpdmUgdG8gdGhlIHNjcmVlbidzIHRvcC1sZWZ0IGNvcm5lci5cbiAgICAgICAgICogQHBhcmFtIHggVGhlIHggY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnRlciByZWxhdGl2ZSB0byB0aGlzIGNvbXBvbmVudCdzIHRvcC1sZWZ0IGNvcm5lci5cbiAgICAgICAgICogQHBhcmFtIHkgVGhlIHkgY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnRlciByZWxhdGl2ZSB0byB0aGlzIGNvbXBvbmVudCdzIHRvcC1sZWZ0IGNvcm5lci5cbiAgICAgICAgICogQHBhcmFtIHdoZWVsVmVsb2NpdHkgVGhlIG1vdXNlIHdoZWVsIHZlbG9jaXR5IHZhbHVlLlxuICAgICAgICAgKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSBvZiB0aGUgZXZlbnQuIFZhbGlkIHZhbHVlcyBhcmUgbGlzdGVkIGluIFBvaW50ZXJFdmVudEFyZ3MgY2xhc3MuXG4gICAgICAgICAqIEBwYXJhbSBhbHRQcmVzc2VkIEluZGljYXRlcyBpZiB0aGUgYWx0IGtleSBpcyBwcmVzc2VkIHdoZW4gdGhlIGV2ZW50IG9jY3VyZWQgb3Igbm90LlxuICAgICAgICAgKiBAcGFyYW0gY3RybFByZXNzZWQgSW5kaWNhdGVzIGlmIHRoZSBjdHJsIGtleSBpcyBwcmVzc2VkIHdoZW4gdGhlIGV2ZW50IG9jY3VyZWQgb3Igbm90LlxuICAgICAgICAgKiBAcGFyYW0gc2hpZnRQcmVzc2VkIEluZGljYXRlcyBpZiB0aGUgc2hpZnQga2V5IGlzIHByZXNzZWQgd2hlbiB0aGUgZXZlbnQgb2NjdXJlZCBvciBub3QuXG4gICAgICAgICAqIEBwYXJhbSBtZXRhUHJlc3NlZCBJbmRpY2F0ZXMgaWYgdGhlIG1ldGEga2V5IGlzIHByZXNzZWQgd2hlbiB0aGUgZXZlbnQgb2NjdXJlZCBvciBub3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4gRmFsc2UgaWYgdGhpcyBldmVudCBjYW4ndCByZWFjaCBvdmVybGF5aW5nIGNvbXBvbmVudHMsIG9yIHRydWUgaWYgb3ZlcmxheWluZyBjb21wb25lbnRzIGNhbiBhbHNvIGdldCB0aGVcbiAgICAgICAgICogY2xpbWJpbmcgdXAgZXZlbnQuXG4gICAgICAgICAqL1xuICAgICAgICBwcm90ZWN0ZWQgb25Qb2ludGVyRXZlbnRDbGltYmluZ1VwKHNjcmVlblg6IG51bWJlciwgc2NyZWVuWTogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlciwgd2hlZWxWZWxvY2l0eTogbnVtYmVyLFxuICAgICAgICAgICAgYWx0UHJlc3NlZDogYm9vbGVhbiwgY3RybFByZXNzZWQ6IGJvb2xlYW4sIHNoaWZ0UHJlc3NlZDogYm9vbGVhbiwgbWV0YVByZXNzZWQ6IGJvb2xlYW5cbiAgICAgICAgICAgICwgZXZlbnRUeXBlOiBudW1iZXIsIGJ1dHRvbjogbnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgd2hlbiBhIHBvaW50ZXIgZXZlbnQgaXMgZmFsbGluZyBkb3duIG9uIHRoZSBjb21wb25lbnQgaGllcmFyY2h5LiBUaGUgZ29hbCBvZiB0aGlzIG1ldGhvZCBpc1xuICAgICAgICAgKiB0byBmaXJlIGV2ZW50cyBpZiBuZWVkZWQsIGFuZCBpbiB0aGUgcmVzdWx0IHR5cGUgZGVmaW5lIGlmIHRoZSB1bmRlcmxheWluZyBjb21wb25lbnRzIGNhbiBwcm9jZXNzIHRoaXMgZXZlbnQgdG9vLlxuICAgICAgICAgKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBpcyBmaXJlcyB0aGUgYXNzb2NpYXRlZCBldmVudCwgYW5kIHJldHVybnMgdHJ1ZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHNjcmVlblggVGhlIHggY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnRlciByZWxhdGl2ZSB0byB0aGUgc2NyZWVuJ3MgdG9wLWxlZnQgY29ybmVyLlxuICAgICAgICAgKiBAcGFyYW0gc2NyZWVuWSBUaGUgeSBjb29yZGluYXRlIG9mIHRoZSBwb2ludGVyIHJlbGF0aXZlIHRvIHRoZSBzY3JlZW4ncyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqIEBwYXJhbSB4IFRoZSB4IGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50ZXIgcmVsYXRpdmUgdG8gdGhpcyBjb21wb25lbnQncyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqIEBwYXJhbSB5IFRoZSB5IGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50ZXIgcmVsYXRpdmUgdG8gdGhpcyBjb21wb25lbnQncyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqIEBwYXJhbSB3aGVlbFZlbG9jaXR5IFRoZSBtb3VzZSB3aGVlbCB2ZWxvY2l0eSB2YWx1ZS5cbiAgICAgICAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgdGhlIGV2ZW50LiBWYWxpZCB2YWx1ZXMgYXJlIGxpc3RlZCBpbiBQb2ludGVyRXZlbnRBcmdzIGNsYXNzLlxuICAgICAgICAgKiBAcGFyYW0gYWx0UHJlc3NlZCBJbmRpY2F0ZXMgaWYgdGhlIGFsdCBrZXkgaXMgcHJlc3NlZCB3aGVuIHRoZSBldmVudCBvY2N1cmVkIG9yIG5vdC5cbiAgICAgICAgICogQHBhcmFtIGN0cmxQcmVzc2VkIEluZGljYXRlcyBpZiB0aGUgY3RybCBrZXkgaXMgcHJlc3NlZCB3aGVuIHRoZSBldmVudCBvY2N1cmVkIG9yIG5vdC5cbiAgICAgICAgICogQHBhcmFtIHNoaWZ0UHJlc3NlZCBJbmRpY2F0ZXMgaWYgdGhlIHNoaWZ0IGtleSBpcyBwcmVzc2VkIHdoZW4gdGhlIGV2ZW50IG9jY3VyZWQgb3Igbm90LlxuICAgICAgICAgKiBAcGFyYW0gbWV0YVByZXNzZWQgSW5kaWNhdGVzIGlmIHRoZSBtZXRhIGtleSBpcyBwcmVzc2VkIHdoZW4gdGhlIGV2ZW50IG9jY3VyZWQgb3Igbm90LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIFRydWUgaWYgdGhpcyBldmVudCBpcyBmdWxseSBwcm9jZXNzZWQsIGFuZCB1bmRlcmxheWluZyBjb21wb25lbnRzIGNhbid0IHByb2Nlc3MgdGhpcyBldmVudCwgb3IgZmFsc2UgaWZcbiAgICAgICAgICogdW5kZXJsYXlpbmcgY29tcG9uZW50cyBjYW4gYWxzbyBnZXQgdGhlIGZhbGxpbmcgZG93biBldmVudC5cbiAgICAgICAgICovXG4gICAgICAgIHByb3RlY3RlZCBvblBvaW50ZXJFdmVudEZhbGxpbmdEb3duKHNjcmVlblg6IG51bWJlciwgc2NyZWVuWTogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlciwgd2hlZWxWZWxvY2l0eTogbnVtYmVyLFxuICAgICAgICAgICAgYWx0UHJlc3NlZDogYm9vbGVhbiwgY3RybFByZXNzZWQ6IGJvb2xlYW4sIHNoaWZ0UHJlc3NlZDogYm9vbGVhbiwgbWV0YVByZXNzZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICBldmVudFR5cGU6IG51bWJlciwgYnV0dG9uOiBudW1iZXIsIG5hdGl2ZUV2ZW50OiBVSUV2ZW50KSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGV2ZW50VHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgTW91c2VFdmVudFR5cGVzLk1PVVNFX0RPV046XG4gICAgICAgICAgICAgICAgICAgIHZhciBtZGVhID0gbmV3IE1vdXNlRG93bkV2ZW50QXJncyhzY3JlZW5YLCBzY3JlZW5ZLCB4LCB5LCBhbHRQcmVzc2VkLCBjdHJsUHJlc3NlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoaWZ0UHJlc3NlZCwgbWV0YVByZXNzZWQsIGJ1dHRvbiwgPE1vdXNlRXZlbnQ+bmF0aXZlRXZlbnQsIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICAvL3RoaXMucmVnaXN0ZXJEb3duRXZlbnQoc2NyZWVuWCwgc2NyZWVuWSwgeCwgeSwgYWx0UHJlc3NlZCwgY3RybFByZXNzZWQsIHNoaWZ0UHJlc3NlZCwgbWV0YVByZXNzZWQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbk1vdXNlRG93bi5maXJlRXZlbnQobWRlYSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgTW91c2VFdmVudFR5cGVzLk1PVVNFX01PVkU6XG4gICAgICAgICAgICAgICAgICAgIHZhciBtbWVhID0gbmV3IE1vdXNlTW92ZUV2ZW50QXJncyhzY3JlZW5YLCBzY3JlZW5ZLCB4LCB5LCBhbHRQcmVzc2VkLCBjdHJsUHJlc3NlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoaWZ0UHJlc3NlZCwgbWV0YVByZXNzZWQsIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbk1vdXNlTW92ZS5maXJlRXZlbnQobW1lYSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgTW91c2VFdmVudFR5cGVzLk1PVVNFX0VOVEVSOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbk1vdXNlRW50ZXIuZmlyZUV2ZW50KG5ldyBFdmVudEFyZ3ModGhpcykpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIE1vdXNlRXZlbnRUeXBlcy5NT1VTRV9MRUFWRTpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25Nb3VzZUxlYXZlLmZpcmVFdmVudChuZXcgRXZlbnRBcmdzKHRoaXMpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBNb3VzZUV2ZW50VHlwZXMuTU9VU0VfV0hFRUw6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29uTW91c2VXaGVlbC5maXJlRXZlbnQobmV3IE1vdXNlV2hlZWxFdmVudEFyZ3Mod2hlZWxWZWxvY2l0eSwgYWx0UHJlc3NlZCwgY3RybFByZXNzZWQsIHNoaWZ0UHJlc3NlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGFQcmVzc2VkLCB0aGlzKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAgICAgICAgcHJvdGVjdGVkIHJlZ2lzdGVyRG93bkV2ZW50KHNjcmVlblg6IG51bWJlciwgc2NyZWVuWTogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlcixcbiAgICAgICAgLy8gICAgICAgICAgICBhbHRQcmVzc2VkOiBib29sZWFuLCBjdHJsUHJlc3NlZDogYm9vbGVhbiwgc2hpZnRQcmVzc2VkOiBib29sZWFuLCBtZXRhUHJlc3NlZDogYm9vbGVhbikge1xuICAgICAgICAvLyAgICAgICAgICAgIEFDb21wb25lbnQubG9nUG9pbnRlckRvd25FdmVudChuZXcgTW91c2VEb3duRXZlbnRMb2codGhpcywgc2NyZWVuWCwgc2NyZWVuWSwgeCwgeSkpO1xuICAgICAgICAvLyAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbmRpY2F0ZXMgaWYgdGhpcyBjb21wb25lbnQgaXMgaW50ZXJzZWN0cyB0aGUgZ2l2ZW4gcG9pbnQuIFRoZSB4IGFuZCB5IGNvb3JkaW5hdGUgaXMgcmVsYXRpdmUgdG8gdGhlIHBhcmVudCdzXG4gICAgICAgICAqIHRvcC1sZWZ0IGNvb3JkaW5hdGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB4IFRoZSB4IGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50LlxuICAgICAgICAgKiBAcGFyYW0geSBUaGUgeSBjb29yZGluYXRlIG9mIHRoZSBwb2ludC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiBUcnVlIGlmIHRoaXMgY29tcG9uZW50IGlzIGludGVyc2VjdHMgdGhlIGdpdmVuIHBvaW50LCBvdGhlcndpc2UgZmFsc2UuXG4gICAgICAgICAqL1xuICAgICAgICBfaXNJbnRlcnNlY3RzUG9pbnQoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICAgICAgICAgIC8vIG1lYXN1cmVkIHBvc2l0aW9uc1xuICAgICAgICAgICAgdmFyIHgxID0gdGhpcy5fbGVmdCArIHRoaXMuX3RyYW5zbGF0ZVgudmFsdWU7XG4gICAgICAgICAgICB2YXIgeTEgPSB0aGlzLl90b3AgKyB0aGlzLl90cmFuc2xhdGVZLnZhbHVlO1xuICAgICAgICAgICAgdmFyIHgyID0geDEgKyB0aGlzLl9tZWFzdXJlZFdpZHRoLnZhbHVlO1xuICAgICAgICAgICAgdmFyIHkyID0geTE7XG4gICAgICAgICAgICB2YXIgeDMgPSB4MjtcbiAgICAgICAgICAgIHZhciB5MyA9IHkyICsgdGhpcy5fbWVhc3VyZWRIZWlnaHQudmFsdWU7XG4gICAgICAgICAgICB2YXIgeDQgPSB4MTtcbiAgICAgICAgICAgIHZhciB5NCA9IHkzO1xuXG4gICAgICAgICAgICAvLyBzY2FsZSBwb2ludHNcbiAgICAgICAgICAgIGlmICh0aGlzLl9zY2FsZVgudmFsdWUgIT0gMS4wKSB7XG4gICAgICAgICAgICAgICAgeDEgPSAoeDEgLSAoKHgyIC0geDEpICogdGhpcy5fdHJhbnNmb3JtQ2VudGVyWC52YWx1ZSAqIHRoaXMuX3NjYWxlWC52YWx1ZSkpIHwgMDtcbiAgICAgICAgICAgICAgICB4MiA9ICh4MSArICgoeDIgLSB4MSkgKiAoMSAtIHRoaXMuX3RyYW5zZm9ybUNlbnRlclgudmFsdWUpICogdGhpcy5fc2NhbGVYLnZhbHVlKSkgfCAwO1xuICAgICAgICAgICAgICAgIHgzID0geDI7XG4gICAgICAgICAgICAgICAgeDQgPSB4MTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLl9zY2FsZVkudmFsdWUgIT0gMS4wKSB7XG4gICAgICAgICAgICAgICAgeTEgPSAoeTEgLSAoKHkyIC0geTEpICogdGhpcy5fdHJhbnNmb3JtQ2VudGVyWS52YWx1ZSAqIHRoaXMuX3NjYWxlWS52YWx1ZSkpIHwgMDtcbiAgICAgICAgICAgICAgICB5NCA9ICh5NCArICgoeTQgLSB5MSkgKiAoMSAtIHRoaXMuX3RyYW5zZm9ybUNlbnRlclkudmFsdWUpICogdGhpcy5fc2NhbGVZLnZhbHVlKSkgfCAwO1xuICAgICAgICAgICAgICAgIHkyID0geTE7XG4gICAgICAgICAgICAgICAgeTMgPSB5NDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gcm90YXRlUG9pbnRzXG4gICAgICAgICAgICBpZiAodGhpcy5yb3RhdGUgIT0gMC4wKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJweCA9ICh4MSArICgoeDIgLSB4MSkgKiB0aGlzLnRyYW5zZm9ybUNlbnRlclgpKSB8IDA7XG4gICAgICAgICAgICAgICAgdmFyIHJweSA9ICh5MSArICgoeTQgLSB5MSkgKiB0aGlzLnRyYW5zZm9ybUNlbnRlclgpKSB8IDA7XG4gICAgICAgICAgICAgICAgdmFyIHRsID0gdGhpcy5yb3RhdGVQb2ludCgwLCAwLCB4MSAtIHJweCwgeTEgLSBycHksIHRoaXMucm90YXRlKTtcbiAgICAgICAgICAgICAgICB2YXIgdHIgPSB0aGlzLnJvdGF0ZVBvaW50KDAsIDAsIHgyIC0gcnB4LCB5MiAtIHJweSwgdGhpcy5yb3RhdGUpO1xuICAgICAgICAgICAgICAgIHZhciBiciA9IHRoaXMucm90YXRlUG9pbnQoMCwgMCwgeDMgLSBycHgsIHkzIC0gcnB5LCB0aGlzLnJvdGF0ZSk7XG4gICAgICAgICAgICAgICAgdmFyIGJsID0gdGhpcy5yb3RhdGVQb2ludCgwLCAwLCB4NCAtIHJweCwgeTQgLSBycHksIHRoaXMucm90YXRlKTtcbiAgICAgICAgICAgICAgICB4MSA9IHRsLnggKyBycHg7XG4gICAgICAgICAgICAgICAgeTEgPSB0bC55ICsgcnB5O1xuICAgICAgICAgICAgICAgIHgyID0gdHIueCArIHJweDtcbiAgICAgICAgICAgICAgICB5MiA9IHRyLnkgKyBycHk7XG4gICAgICAgICAgICAgICAgeDMgPSBici54ICsgcnB4O1xuICAgICAgICAgICAgICAgIHkzID0gYnIueSArIHJweTtcbiAgICAgICAgICAgICAgICB4NCA9IGJsLnggKyBycHg7XG4gICAgICAgICAgICAgICAgeTQgPSBibC55ICsgcnB5O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgY250ID0gMDtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzUG9pbnRJbnRlcnNlY3RzTGluZSh4LCB5LCB4MSwgeTEsIHgyLCB5MikpIHtcbiAgICAgICAgICAgICAgICBjbnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmlzUG9pbnRJbnRlcnNlY3RzTGluZSh4LCB5LCB4MiwgeTIsIHgzLCB5MykpIHtcbiAgICAgICAgICAgICAgICBjbnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmlzUG9pbnRJbnRlcnNlY3RzTGluZSh4LCB5LCB4MywgeTMsIHg0LCB5NCkpIHtcbiAgICAgICAgICAgICAgICBjbnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmlzUG9pbnRJbnRlcnNlY3RzTGluZSh4LCB5LCB4NCwgeTQsIHgxLCB5MSkpIHtcbiAgICAgICAgICAgICAgICBjbnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjbnQgPT0gMSB8fCBjbnQgPT0gMztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgaXNQb2ludEludGVyc2VjdHNMaW5lKHB4OiBudW1iZXIsIHB5OiBudW1iZXIsIGx4MTogbnVtYmVyLCBseTE6IG51bWJlciwgbHgyOiBudW1iZXIsIGx5MjogbnVtYmVyKSB7XG4gICAgICAgICAgICAvKiAoKHBvbHlbaV1bMV0gPiB5KSAhPSAocG9seVtqXVsxXSA+IHkpKSBhbmQgXFxcbiAgICAgICAgICAgICAoeCA8IChwb2x5W2pdWzBdIC0gcG9seVtpXVswXSkgKiAoeSAtIHBvbHlbaV1bMV0pIC8gKHBvbHlbal1bMV0gLSBwb2x5W2ldWzFdKSArIHBvbHlbaV1bMF0pXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHJldHVybiAoKGx5MSA+IHB5KSAhPSAobHkyID4gcHkpKSAmJiAocHggPCAobHgyIC0gbHgxKSAqICgocHkgLSBseTEpKSAvIChseTIgLSBseTEpICsgbHgxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBSb3RhdGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcm90YXRlO1xuICAgICAgICB9XG4gICAgICAgIGdldCByb3RhdGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Sb3RhdGUudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHJvdGF0ZSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Sb3RhdGUudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBTY2FsZVgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2NhbGVYO1xuICAgICAgICB9XG4gICAgICAgIGdldCBzY2FsZVgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5TY2FsZVgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHNjYWxlWCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5TY2FsZVgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBTY2FsZVkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2NhbGVZO1xuICAgICAgICB9XG4gICAgICAgIGdldCBzY2FsZVkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5TY2FsZVkudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHNjYWxlWSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5TY2FsZVkudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUcmFuc2Zvcm1DZW50ZXJYKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zZm9ybUNlbnRlclg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRyYW5zZm9ybUNlbnRlclgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UcmFuc2Zvcm1DZW50ZXJYLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0cmFuc2Zvcm1DZW50ZXJYKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRyYW5zZm9ybUNlbnRlclgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUcmFuc2Zvcm1DZW50ZXJZKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zZm9ybUNlbnRlclk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRyYW5zZm9ybUNlbnRlclkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UcmFuc2Zvcm1DZW50ZXJZLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0cmFuc2Zvcm1DZW50ZXJZKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRyYW5zZm9ybUNlbnRlclkudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBIb3ZlcmVkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hvdmVyZWQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGhvdmVyZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Ib3ZlcmVkLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBob3ZlcmVkKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkhvdmVyZWQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBQcmVzc2VkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ByZXNzZWQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHByZXNzZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5QcmVzc2VkLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBwcmVzc2VkKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlByZXNzZWQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG5cblxuICAgICAgICAvLyAgICAgICAgcHVibGljIGZpbmFsIGludCBnZXRTY3JlZW5YKCkge1xuICAgICAgICAvLyAgICAgICAgICAgIHJldHVybiBnZXRFbGVtZW50KCkuZ2V0QWJzb2x1dGVMZWZ0KCk7XG4gICAgICAgIC8vICAgICAgICB9XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgICAgICBwdWJsaWMgZmluYWwgaW50IGdldFNjcmVlblkoKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgcmV0dXJuIGdldEVsZW1lbnQoKS5nZXRBYnNvbHV0ZVRvcCgpO1xuICAgICAgICAvLyAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG5cbn1cblxuXG4iLCJtb2R1bGUgY3ViZWUge1xuXG4gICAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFMYXlvdXQgZXh0ZW5kcyBBQ29tcG9uZW50IHtcbiAgICAgICAgcHJpdmF0ZSBfY2hpbGRyZW4gPSBuZXcgTGF5b3V0Q2hpbGRyZW4odGhpcyk7XG5cbiAgICAgICAgY29uc3RydWN0b3IoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHN1cGVyKGVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIGdldCBjaGlsZHJlbl9pbm5lcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBhYnN0cmFjdCBfb25DaGlsZEFkZGVkKGNoaWxkOiBBQ29tcG9uZW50KTogdm9pZDtcblxuICAgICAgICBwdWJsaWMgYWJzdHJhY3QgX29uQ2hpbGRSZW1vdmVkKGNoaWxkOiBBQ29tcG9uZW50LCBpbmRleDogbnVtYmVyKTogdm9pZDtcblxuICAgICAgICBwdWJsaWMgYWJzdHJhY3QgX29uQ2hpbGRyZW5DbGVhcmVkKCk6IHZvaWQ7XG5cbiAgICAgICAgbGF5b3V0KCkge1xuICAgICAgICAgICAgdGhpcy5fbmVlZHNMYXlvdXQgPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbl9pbm5lci5zaXplKCk7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuY2hpbGRyZW5faW5uZXIuZ2V0KGkpO1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZC5uZWVkc0xheW91dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQubGF5b3V0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm9uTGF5b3V0KCk7XG4gICAgICAgICAgICB0aGlzLm1lYXN1cmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBfZG9Qb2ludGVyRXZlbnRDbGltYmluZ1VwKHNjcmVlblg6IG51bWJlciwgc2NyZWVuWTogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlciwgd2hlZWxWZWxvY2l0eTogbnVtYmVyLFxuICAgICAgICAgICAgYWx0UHJlc3NlZDogYm9vbGVhbiwgY3RybFByZXNzZWQ6IGJvb2xlYW4sIHNoaWZ0UHJlc3NlZDogYm9vbGVhbiwgbWV0YVByZXNzZWQ6IGJvb2xlYW4sIHR5cGU6IG51bWJlciwgYnV0dG9uOiBudW1iZXIsIGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaGFuZGxlUG9pbnRlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdGhpcy5lbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRoaXMudmlzaWJsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLm9uUG9pbnRlckV2ZW50Q2xpbWJpbmdVcChzY3JlZW5YLCBzY3JlZW5ZLCB4LCB5LCB3aGVlbFZlbG9jaXR5LCBhbHRQcmVzc2VkLFxuICAgICAgICAgICAgICAgIGN0cmxQcmVzc2VkLCBzaGlmdFByZXNzZWQsIG1ldGFQcmVzc2VkLCB0eXBlLCBidXR0b24pKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMuX2NoaWxkcmVuLnNpemUoKSAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuX2NoaWxkcmVuLmdldChpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYXJlbnRYID0geCArIHRoaXMuZWxlbWVudC5zY3JvbGxMZWZ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBhcmVudFkgPSB5ICsgdGhpcy5lbGVtZW50LnNjcm9sbFRvcDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwID0gdGhpcy5wYWRkaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHAgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudFggLT0gcC5sZWZ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudFkgLT0gcC50b3A7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGQuX2lzSW50ZXJzZWN0c1BvaW50KHBhcmVudFgsIHBhcmVudFkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxlZnQgPSBjaGlsZC5sZWZ0ICsgY2hpbGQudHJhbnNsYXRlWDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdG9wID0gY2hpbGQudG9wICsgY2hpbGQudHJhbnNsYXRlWTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGN4ID0gKGxlZnQgKyBjaGlsZC5tZWFzdXJlZFdpZHRoICogY2hpbGQudHJhbnNmb3JtQ2VudGVyWCkgfCAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0Y3kgPSAodG9wICsgY2hpbGQubWVhc3VyZWRIZWlnaHQgKiBjaGlsZC50cmFuc2Zvcm1DZW50ZXJZKSB8IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNoaWxkUG9pbnQgPSB0aGlzLl9yb3RhdGVQb2ludCh0Y3gsIHRjeSwgcGFyZW50WCwgcGFyZW50WSwgLWNoaWxkLnJvdGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNoaWxkWCA9IGNoaWxkUG9pbnQueDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2hpbGRZID0gY2hpbGRQb2ludC55O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkWCA9IGNoaWxkWCAtIGxlZnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRZID0gY2hpbGRZIC0gdG9wO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRPRE8gc2NhbGUgYmFjayBwb2ludFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZC5fZG9Qb2ludGVyRXZlbnRDbGltYmluZ1VwKHNjcmVlblgsIHNjcmVlblksIGNoaWxkWCwgY2hpbGRZLCB3aGVlbFZlbG9jaXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbHRQcmVzc2VkLCBjdHJsUHJlc3NlZCwgc2hpZnRQcmVzc2VkLCBtZXRhUHJlc3NlZCwgdHlwZSwgYnV0dG9uLCBldmVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMucG9pbnRlclRyYW5zcGFyZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5vblBvaW50ZXJFdmVudEZhbGxpbmdEb3duKHNjcmVlblgsIHNjcmVlblksIHgsIHksIHdoZWVsVmVsb2NpdHksIGFsdFByZXNzZWQsXG4gICAgICAgICAgICAgICAgICAgIGN0cmxQcmVzc2VkLCBzaGlmdFByZXNzZWQsIG1ldGFQcmVzc2VkLCB0eXBlLCBidXR0b24sIGV2ZW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcm90YXRlUG9pbnQoY3g6IG51bWJlciwgY3k6IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIsIGFuZ2xlOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGFuZ2xlID0gKGFuZ2xlICogMzYwKSAqIChNYXRoLlBJIC8gMTgwKTtcbiAgICAgICAgICAgIHggPSB4IC0gY3g7XG4gICAgICAgICAgICB5ID0geSAtIGN5O1xuICAgICAgICAgICAgdmFyIHNpbiA9IE1hdGguc2luKGFuZ2xlKTtcbiAgICAgICAgICAgIHZhciBjb3MgPSBNYXRoLmNvcyhhbmdsZSk7XG4gICAgICAgICAgICB2YXIgcnggPSAoKGNvcyAqIHgpIC0gKHNpbiAqIHkpKSB8IDA7XG4gICAgICAgICAgICB2YXIgcnkgPSAoKHNpbiAqIHgpICsgKGNvcyAqIHkpKSB8IDA7XG4gICAgICAgICAgICByeCA9IHJ4ICsgY3g7XG4gICAgICAgICAgICByeSA9IHJ5ICsgY3k7XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUG9pbnQyRChyeCwgcnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIGFic3RyYWN0IG9uTGF5b3V0KCk6IHZvaWQ7XG5cbiAgICAgICAgZ2V0Q29tcG9uZW50c0F0UG9zaXRpb24oeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICAgICAgICAgIHZhciByZXM6IEFDb21wb25lbnRbXSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnRzQXRQb3NpdGlvbl9pbXBsKHRoaXMsIHgsIHksIHJlcyk7XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBnZXRDb21wb25lbnRzQXRQb3NpdGlvbl9pbXBsKHJvb3Q6IEFMYXlvdXQsIHg6IG51bWJlciwgeTogbnVtYmVyLCByZXN1bHQ6IEFDb21wb25lbnRbXSkge1xuICAgICAgICAgICAgaWYgKHggPj0gMCAmJiB4IDw9IHJvb3QuYm91bmRzV2lkdGggJiYgeSA+PSAwICYmIHkgPD0gcm9vdC5ib3VuZHNIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuc3BsaWNlKDAsIDAsIHJvb3QpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm9vdC5jaGlsZHJlbl9pbm5lci5zaXplKCk7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29tcG9uZW50ID0gcm9vdC5jaGlsZHJlbl9pbm5lci5nZXQoaSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGV0IHR4ID0geCAtIGNvbXBvbmVudC5sZWZ0IC0gY29tcG9uZW50LnRyYW5zbGF0ZVg7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0eSA9IHkgLSBjb21wb25lbnQudG9wIC0gY29tcG9uZW50LnRyYW5zbGF0ZVk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBBTGF5b3V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbDogQUxheW91dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50c0F0UG9zaXRpb25faW1wbCg8QUxheW91dD5jb21wb25lbnQsIHR4LCB0eSwgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eCA+PSAwICYmIHR4IDw9IGNvbXBvbmVudC5ib3VuZHNXaWR0aCAmJiB5ID49IDAgJiYgeSA8PSBjb21wb25lbnQuYm91bmRzSGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnNwbGljZSgwLCAwLCBjb21wb25lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIHNldENoaWxkTGVmdChjaGlsZDogQUNvbXBvbmVudCwgbGVmdDogbnVtYmVyKSB7XG4gICAgICAgICAgICBjaGlsZC5fc2V0TGVmdChsZWZ0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBzZXRDaGlsZFRvcChjaGlsZDogQUNvbXBvbmVudCwgdG9wOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGNoaWxkLl9zZXRUb3AodG9wKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG4iLCJtb2R1bGUgY3ViZWUge1xuXG4gICAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFVc2VyQ29udHJvbCBleHRlbmRzIEFMYXlvdXQge1xuXG4gICAgICAgIHByaXZhdGUgX3dpZHRoID0gbmV3IE51bWJlclByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfaGVpZ2h0ID0gbmV3IE51bWJlclByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYmFja2dyb3VuZCA9IG5ldyBCYWNrZ3JvdW5kUHJvcGVydHkobmV3IENvbG9yQmFja2dyb3VuZChDb2xvci5UUkFOU1BBUkVOVCksIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfc2hhZG93ID0gbmV3IFByb3BlcnR5PEJveFNoYWRvdz4obnVsbCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9kcmFnZ2FibGUgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlKTtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93WCA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUub3ZlcmZsb3dZID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgIHRoaXMuX3dpZHRoLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fd2lkdGgudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJ3aWR0aFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2lkdGggPSBcIlwiICsgdGhpcy5fd2lkdGgudmFsdWUgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl93aWR0aC5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9oZWlnaHQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9oZWlnaHQudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJoZWlnaHRcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmhlaWdodCA9IFwiXCIgKyB0aGlzLl9oZWlnaHQudmFsdWUgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9oZWlnaHQuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYmFja2dyb3VuZENvbG9yXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImJhY2tncm91bmRJbWFnZVwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJiYWNrZ3JvdW5kXCIpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9iYWNrZ3JvdW5kLnZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZC52YWx1ZS5hcHBseSh0aGlzLmVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZC5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9zaGFkb3cuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zaGFkb3cudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJib3hTaGFkb3dcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhZG93LnZhbHVlLmFwcGx5KHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9kcmFnZ2FibGUuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9kcmFnZ2FibGUudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcImRyYWdnYWJsZVwiLCBcInRydWVcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcImRyYWdnYWJsZVwiLCBcImZhbHNlXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZHJhZ2dhYmxlLmludmFsaWRhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBnZXQgX1dpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dpZHRoO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBnZXQgV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGdldCB3aWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLldpZHRoLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBzZXQgd2lkdGgodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuV2lkdGgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcHJvdGVjdGVkIGdldCBfSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IEhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGdldCBoZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5IZWlnaHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIHNldCBoZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuSGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IF9CYWNrZ3JvdW5kKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JhY2tncm91bmQ7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGdldCBCYWNrZ3JvdW5kKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JhY2tncm91bmQ7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGdldCBiYWNrZ3JvdW5kKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQmFja2dyb3VuZC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgc2V0IGJhY2tncm91bmQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQmFja2dyb3VuZC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIGdldCBfU2hhZG93KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NoYWRvdztcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IFNoYWRvdygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zaGFkb3c7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGdldCBzaGFkb3coKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5TaGFkb3cudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIHNldCBzaGFkb3codmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuU2hhZG93LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgRHJhZ2dhYmxlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RyYWdnYWJsZTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgZHJhZ2dhYmxlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRHJhZ2dhYmxlLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBkcmFnZ2FibGUodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuRHJhZ2dhYmxlLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgX29uQ2hpbGRBZGRlZChjaGlsZDogQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgaWYgKGNoaWxkICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hpbGQuZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBfb25DaGlsZFJlbW92ZWQoY2hpbGQ6IEFDb21wb25lbnQsIGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmIChjaGlsZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNoaWxkKGNoaWxkLmVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgX29uQ2hpbGRyZW5DbGVhcmVkKCkge1xuICAgICAgICAgICAgdmFyIHJvb3QgPSB0aGlzLmVsZW1lbnQ7XG4gICAgICAgICAgICB2YXIgZSA9IHRoaXMuZWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICAgICAgICAgIHdoaWxlIChlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICByb290LnJlbW92ZUNoaWxkKGUpO1xuICAgICAgICAgICAgICAgIGUgPSByb290LmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgb25MYXlvdXQoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy53aWR0aCAhPSBudWxsICYmIHRoaXMuaGVpZ2h0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNpemUodGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgbWF4VyA9IDA7XG4gICAgICAgICAgICAgICAgdmFyIG1heEggPSAwO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbl9pbm5lci5zaXplKCk7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29tcG9uZW50ID0gdGhpcy5jaGlsZHJlbl9pbm5lci5nZXQoaSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjVyA9IGNvbXBvbmVudC5ib3VuZHNXaWR0aCArIGNvbXBvbmVudC5ib3VuZHNMZWZ0ICsgY29tcG9uZW50LnRyYW5zbGF0ZVg7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjSCA9IGNvbXBvbmVudC5ib3VuZHNIZWlnaHQgKyBjb21wb25lbnQuYm91bmRzVG9wICsgY29tcG9uZW50LnRyYW5zbGF0ZVk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNXID4gbWF4Vykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF4VyA9IGNXO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNIID4gbWF4SCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF4SCA9IGNIO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMud2lkdGggIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBtYXhXID0gdGhpcy5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGVpZ2h0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF4SCA9IHRoaXMuaGVpZ2h0O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U2l6ZShtYXhXLCBtYXhIKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG59XG5cblxuIiwibW9kdWxlIGN1YmVlIHtcblxuICAgIGV4cG9ydCBjbGFzcyBQYW5lbCBleHRlbmRzIEFVc2VyQ29udHJvbCB7XG4gICAgICAgIFxuICAgICAgICBwdWJsaWMgZ2V0IFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX1dpZHRoO1xuICAgICAgICB9XG4gICAgICAgIHB1YmxpYyBnZXQgd2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5XaWR0aC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBwdWJsaWMgc2V0IHdpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLldpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0IEhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9IZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgcHVibGljIGdldCBoZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5IZWlnaHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcHVibGljIHNldCBoZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuSGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0IEJhY2tncm91bmQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fQmFja2dyb3VuZDtcbiAgICAgICAgfVxuICAgICAgICBwdWJsaWMgZ2V0IGJhY2tncm91bmQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5CYWNrZ3JvdW5kLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHB1YmxpYyBzZXQgYmFja2dyb3VuZCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5CYWNrZ3JvdW5kLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0IFNoYWRvdygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9TaGFkb3c7XG4gICAgICAgIH1cbiAgICAgICAgcHVibGljIGdldCBzaGFkb3coKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5TaGFkb3cudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcHVibGljIHNldCBzaGFkb3codmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuU2hhZG93LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHB1YmxpYyBnZXQgY2hpbGRyZW4oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbl9pbm5lcjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG5cbn1cbiIsIm1vZHVsZSBjdWJlZSB7XG5cbiAgICBleHBvcnQgY2xhc3MgSEJveCBleHRlbmRzIEFMYXlvdXQge1xuXG4gICAgICAgIHByaXZhdGUgX2hlaWdodCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2NlbGxXaWR0aHM6IG51bWJlcltdID0gW107XG4gICAgICAgIHByaXZhdGUgX2hBbGlnbnM6IEVIQWxpZ25bXSA9IFtdO1xuICAgICAgICBwcml2YXRlIF92QWxpZ25zOiBFVkFsaWduW10gPSBbXTtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgIHRoaXMucG9pbnRlclRyYW5zcGFyZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX2hlaWdodC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzZXRDZWxsV2lkdGgoaW5kZXhPckNvbXBvbmVudDogbnVtYmVyIHwgQUNvbXBvbmVudCwgY2VsbEhlaWdodDogbnVtYmVyKSB7XG4gICAgICAgICAgICBpZiAoaW5kZXhPckNvbXBvbmVudCBpbnN0YW5jZW9mIEFDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldENlbGxXaWR0aCh0aGlzLmNoaWxkcmVuX2lubmVyLmluZGV4T2YoaW5kZXhPckNvbXBvbmVudCksIGNlbGxIZWlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZXRJbkxpc3QodGhpcy5fY2VsbFdpZHRocywgPG51bWJlcj5pbmRleE9yQ29tcG9uZW50LCBjZWxsSGVpZ2h0KTtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldENlbGxXaWR0aChpbmRleE9yQ29tcG9uZW50OiBudW1iZXIgfCBBQ29tcG9uZW50KTogbnVtYmVyIHtcbiAgICAgICAgICAgIGlmIChpbmRleE9yQ29tcG9uZW50IGluc3RhbmNlb2YgQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldENlbGxXaWR0aCh0aGlzLmNoaWxkcmVuX2lubmVyLmluZGV4T2YoaW5kZXhPckNvbXBvbmVudCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RnJvbUxpc3QodGhpcy5fY2VsbFdpZHRocywgPG51bWJlcj5pbmRleE9yQ29tcG9uZW50KTtcbiAgICB9XG4gICAgXG4gICAgcHVibGljIHNldENlbGxIQWxpZ24oaW5kZXhPckNvbXBvbmVudDogbnVtYmVyIHwgQUNvbXBvbmVudCwgaEFsaWduOiBFSEFsaWduKSB7XG4gICAgICAgICAgICBpZiAoaW5kZXhPckNvbXBvbmVudCBpbnN0YW5jZW9mIEFDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldENlbGxIQWxpZ24odGhpcy5jaGlsZHJlbl9pbm5lci5pbmRleE9mKGluZGV4T3JDb21wb25lbnQpLCBoQWxpZ24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZXRJbkxpc3QodGhpcy5faEFsaWducywgPG51bWJlcj5pbmRleE9yQ29tcG9uZW50LCBoQWxpZ24pO1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgIH1cblxuICAgIHB1YmxpYyBnZXRDZWxsSEFsaWduKGluZGV4T3JDb21wb25lbnQ6IG51bWJlciB8IEFDb21wb25lbnQpOiBFSEFsaWduIHtcbiAgICAgICAgICAgIGlmIChpbmRleE9yQ29tcG9uZW50IGluc3RhbmNlb2YgQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldENlbGxIQWxpZ24odGhpcy5jaGlsZHJlbl9pbm5lci5pbmRleE9mKGluZGV4T3JDb21wb25lbnQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEZyb21MaXN0KHRoaXMuX2hBbGlnbnMsIDxudW1iZXI+aW5kZXhPckNvbXBvbmVudCk7XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBzZXRDZWxsVkFsaWduKGluZGV4T3JDb21wb25lbnQ6IG51bWJlciB8IEFDb21wb25lbnQsIHZBbGlnbjogRVZBbGlnbikge1xuICAgICAgICAgICAgaWYgKGluZGV4T3JDb21wb25lbnQgaW5zdGFuY2VvZiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRDZWxsVkFsaWduKHRoaXMuY2hpbGRyZW5faW5uZXIuaW5kZXhPZihpbmRleE9yQ29tcG9uZW50KSwgdkFsaWduKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2V0SW5MaXN0KHRoaXMuX3ZBbGlnbnMsIDxudW1iZXI+aW5kZXhPckNvbXBvbmVudCwgdkFsaWduKTtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Q2VsbFZBbGlnbihpbmRleE9yQ29tcG9uZW50OiBudW1iZXIgfCBBQ29tcG9uZW50KTogRVZBbGlnbiB7XG4gICAgICAgICAgICBpZiAoaW5kZXhPckNvbXBvbmVudCBpbnN0YW5jZW9mIEFDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRDZWxsVkFsaWduKHRoaXMuY2hpbGRyZW5faW5uZXIuaW5kZXhPZihpbmRleE9yQ29tcG9uZW50KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRGcm9tTGlzdCh0aGlzLl92QWxpZ25zLCA8bnVtYmVyPmluZGV4T3JDb21wb25lbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRMYXN0Q2VsbEhBbGlnbihoQWxpZ246IEVIQWxpZ24pIHtcbiAgICAgICAgdGhpcy5zZXRDZWxsSEFsaWduKHRoaXMuY2hpbGRyZW5faW5uZXIuc2l6ZSgpIC0gMSwgaEFsaWduKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0TGFzdENlbGxWQWxpZ24odkFsaWduOiBFVkFsaWduKSB7XG4gICAgICAgIHRoaXMuc2V0Q2VsbFZBbGlnbih0aGlzLmNoaWxkcmVuX2lubmVyLnNpemUoKSAtIDEsIHZBbGlnbik7XG4gICAgfVxuXG4gICAgcHVibGljIHNldExhc3RDZWxsV2lkdGgod2lkdGg6IG51bWJlcikge1xuICAgICAgICB0aGlzLnNldENlbGxXaWR0aCh0aGlzLmNoaWxkcmVuX2lubmVyLnNpemUoKSAtIDEsIHdpZHRoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkRW1wdHlDZWxsKHdpZHRoOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5jaGlsZHJlbl9pbm5lci5hZGQobnVsbCk7XG4gICAgICAgIHRoaXMuc2V0Q2VsbFdpZHRoKHRoaXMuY2hpbGRyZW5faW5uZXIuc2l6ZSgpIC0gMSwgd2lkdGgpO1xuICAgIH1cblxuICAgIF9vbkNoaWxkQWRkZWQoY2hpbGQ6IEFDb21wb25lbnQpIHtcbiAgICAgICAgaWYgKGNoaWxkICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChjaGlsZC5lbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICB9XG5cbiAgICBfb25DaGlsZFJlbW92ZWQoY2hpbGQ6IEFDb21wb25lbnQsIGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKGNoaWxkICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDaGlsZChjaGlsZC5lbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbW92ZUZyb21MaXN0KHRoaXMuX2hBbGlnbnMsIGluZGV4KTtcbiAgICAgICAgdGhpcy5yZW1vdmVGcm9tTGlzdCh0aGlzLl92QWxpZ25zLCBpbmRleCk7XG4gICAgICAgIHRoaXMucmVtb3ZlRnJvbUxpc3QodGhpcy5fY2VsbFdpZHRocywgaW5kZXgpO1xuICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICB9XG5cbiAgICBfb25DaGlsZHJlbkNsZWFyZWQoKSB7XG4gICAgICAgIGxldCByb290ID0gdGhpcy5lbGVtZW50O1xuICAgICAgICBsZXQgZSA9IHRoaXMuZWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICAgICAgd2hpbGUgKGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgcm9vdC5yZW1vdmVDaGlsZChlKTtcbiAgICAgICAgICAgIGUgPSByb290LmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2hBbGlnbnMgPSBbXTtcbiAgICAgICAgdGhpcy5fdkFsaWducyA9IFtdO1xuICAgICAgICB0aGlzLl9jZWxsV2lkdGhzID0gW107XG4gICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBvbkxheW91dCgpIHtcbiAgICAgICAgdmFyIG1heEhlaWdodCA9IC0xO1xuICAgICAgICBpZiAodGhpcy5oZWlnaHQgIT0gbnVsbCkge1xuICAgICAgICAgICAgbWF4SGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYWN0VyA9IDA7XG4gICAgICAgIHZhciBtYXhIID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLnNpemUoKTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY2hpbGRYID0gMDtcbiAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuY2hpbGRyZW4uZ2V0KGkpO1xuICAgICAgICAgICAgbGV0IGNlbGxXID0gdGhpcy5nZXRDZWxsV2lkdGgoaSk7XG4gICAgICAgICAgICBsZXQgaEFsaWduID0gdGhpcy5nZXRDZWxsSEFsaWduKGkpO1xuICAgICAgICAgICAgbGV0IHJlYWxDZWxsVyA9IC0xO1xuICAgICAgICAgICAgaWYgKGNlbGxXICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZWFsQ2VsbFcgPSBjZWxsVztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNoaWxkID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVhbENlbGxXID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBhY3RXICs9IHJlYWxDZWxsVztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vY2hpbGQubGF5b3V0KCk7XG4gICAgICAgICAgICAgICAgbGV0IGN3ID0gY2hpbGQuYm91bmRzV2lkdGg7XG4gICAgICAgICAgICAgICAgbGV0IGNoID0gY2hpbGQuYm91bmRzSGVpZ2h0O1xuICAgICAgICAgICAgICAgIGxldCBjbCA9IGNoaWxkLnRyYW5zbGF0ZVg7XG4gICAgICAgICAgICAgICAgbGV0IGN0ID0gY2hpbGQudHJhbnNsYXRlWTtcbiAgICAgICAgICAgICAgICBsZXQgY2FsY3VsYXRlZENlbGxXID0gcmVhbENlbGxXO1xuICAgICAgICAgICAgICAgIGlmIChjYWxjdWxhdGVkQ2VsbFcgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGF0ZWRDZWxsVyA9IGN3ICsgY2w7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjYWxjdWxhdGVkQ2VsbFcgPCBjdykge1xuICAgICAgICAgICAgICAgICAgICBjYWxjdWxhdGVkQ2VsbFcgPSBjdztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjaGlsZFggPSBhY3RXIC0gY2hpbGQudHJhbnNsYXRlWDtcblxuICAgICAgICAgICAgICAgIGlmIChoQWxpZ24gPT0gRUhBbGlnbi5DRU5URVIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRYICs9IChjYWxjdWxhdGVkQ2VsbFcgLSBjdykgLyAyO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaEFsaWduID09IEVIQWxpZ24uUklHSFQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRYICs9IChjYWxjdWxhdGVkQ2VsbFcgLSBjdyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNoaWxkLl9zZXRMZWZ0KGNoaWxkWCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoY2ggKyBjdCA+IG1heEgpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF4SCA9IGNoICsgY3Q7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFjdFcgKz0gY2FsY3VsYXRlZENlbGxXO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlYWxIZWlnaHQgPSBtYXhIO1xuICAgICAgICBpZiAobWF4SGVpZ2h0ID4gLTEpIHtcbiAgICAgICAgICAgIHJlYWxIZWlnaHQgPSBtYXhIZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLnNpemUoKTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY2hpbGRZID0gMDtcbiAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuY2hpbGRyZW4uZ2V0KGkpO1xuICAgICAgICAgICAgaWYgKGNoaWxkID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCB2QWxpZ24gPSB0aGlzLmdldENlbGxWQWxpZ24oaSk7XG4gICAgICAgICAgICBsZXQgY2ggPSBjaGlsZC5ib3VuZHNIZWlnaHQ7XG4gICAgICAgICAgICBpZiAodkFsaWduID09IEVWQWxpZ24uTUlERExFKSB7XG4gICAgICAgICAgICAgICAgY2hpbGRZICs9IChyZWFsSGVpZ2h0IC0gY2gpIC8gMjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodkFsaWduID09IEVWQWxpZ24uQk9UVE9NKSB7XG4gICAgICAgICAgICAgICAgY2hpbGRZICs9IChyZWFsSGVpZ2h0IC0gY2gpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjaGlsZC5fc2V0VG9wKGNoaWxkWSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFNpemUoYWN0VywgcmVhbEhlaWdodCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRJbkxpc3Q8VD4obGlzdDogVFtdLCBpbmRleDogbnVtYmVyLCB2YWx1ZTogVCkge1xuICAgICAgICB3aGlsZSAobGlzdC5sZW5ndGggPCBpbmRleCkge1xuICAgICAgICAgICAgbGlzdC5wdXNoKG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIGxpc3RbaW5kZXhdID0gdmFsdWU7XG4gICAgfVxuXG4gICAgICAgIHByaXZhdGUgZ2V0RnJvbUxpc3Q8VD4obGlzdDogVFtdLCBpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIGlmIChsaXN0Lmxlbmd0aCA+IGluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm4gbGlzdFtpbmRleF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgICAgIHByaXZhdGUgcmVtb3ZlRnJvbUxpc3Q8VD4obGlzdDogVFtdLCBpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIGlmIChsaXN0Lmxlbmd0aCA+IGluZGV4KSB7XG4gICAgICAgICAgICBsaXN0LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgY2hpbGRyZW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuX2lubmVyO1xuICAgIH1cbiAgICBcbiAgICBnZXQgSGVpZ2h0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xuICAgIH1cbiAgICBnZXQgaGVpZ2h0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5IZWlnaHQudmFsdWU7XG4gICAgfVxuICAgIHNldCBoZWlnaHQodmFsdWUpIHtcbiAgICAgICAgdGhpcy5IZWlnaHQudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG5cblxufVxuICAgIFxufVxuXG4iLCJtb2R1bGUgY3ViZWUge1xuXG4gICAgZXhwb3J0IGNsYXNzIFZCb3ggZXh0ZW5kcyBBTGF5b3V0IHtcblxuICAgICAgICBwcml2YXRlIF93aWR0aCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIC8vcHJpdmF0ZSBmaW5hbCBBcnJheUxpc3Q8RWxlbWVudD4gd3JhcHBpbmdQYW5lbHMgPSBuZXcgQXJyYXlMaXN0PEVsZW1lbnQ+KCk7XG4gICAgICAgIHByaXZhdGUgX2NlbGxIZWlnaHRzOiBudW1iZXJbXSA9IFtdO1xuICAgICAgICBwcml2YXRlIF9oQWxpZ25zOiBFSEFsaWduW10gPSBbXTtcbiAgICAgICAgcHJpdmF0ZSBfdkFsaWduczogRVZBbGlnbltdID0gW107XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICB0aGlzLnBvaW50ZXJUcmFuc3BhcmVudCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLl93aWR0aC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuX2lubmVyO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0Q2VsbEhlaWdodChpbmRleE9yQ29tcG9uZW50OiBudW1iZXIgfCBBQ29tcG9uZW50LCBjZWxsSGVpZ2h0OiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmIChpbmRleE9yQ29tcG9uZW50IGluc3RhbmNlb2YgQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q2VsbEhlaWdodCh0aGlzLmNoaWxkcmVuLmluZGV4T2YoPEFDb21wb25lbnQ+aW5kZXhPckNvbXBvbmVudCksIGNlbGxIZWlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZXRJbkxpc3QodGhpcy5fY2VsbEhlaWdodHMsIDxudW1iZXI+aW5kZXhPckNvbXBvbmVudCwgY2VsbEhlaWdodCk7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc2V0SW5MaXN0PFQ+KGxpc3Q6IFRbXSwgaW5kZXg6IG51bWJlciwgdmFsdWU6IFQpIHtcbiAgICAgICAgICAgIHdoaWxlIChsaXN0Lmxlbmd0aCA8IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgbGlzdC5wdXNoKG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGlzdFtpbmRleF0gPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgZ2V0RnJvbUxpc3Q8VD4obGlzdDogVFtdLCBpbmRleDogbnVtYmVyKSB7XG4gICAgICAgICAgICBpZiAobGlzdC5sZW5ndGggPiBpbmRleCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsaXN0W2luZGV4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSByZW1vdmVGcm9tTGlzdDxUPihsaXN0OiBUW10sIGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmIChsaXN0Lmxlbmd0aCA+IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgbGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldENlbGxIZWlnaHQoaW5kZXhPckNvbXBvbmVudDogbnVtYmVyIHwgQUNvbXBvbmVudCk6IG51bWJlciB7XG4gICAgICAgICAgICBpZiAoaW5kZXhPckNvbXBvbmVudCBpbnN0YW5jZW9mIEFDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRDZWxsSGVpZ2h0KHRoaXMuY2hpbGRyZW4uaW5kZXhPZihpbmRleE9yQ29tcG9uZW50KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmdldEZyb21MaXN0KHRoaXMuX2NlbGxIZWlnaHRzLCA8bnVtYmVyPmluZGV4T3JDb21wb25lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHNldENlbGxIQWxpZ24oaW5kZXhPckNvbXBvbmVudDogbnVtYmVyIHwgQUNvbXBvbmVudCwgaEFsaWduOiBFSEFsaWduKSB7XG4gICAgICAgICAgICBpZiAoaW5kZXhPckNvbXBvbmVudCBpbnN0YW5jZW9mIEFDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldENlbGxIQWxpZ24odGhpcy5jaGlsZHJlbi5pbmRleE9mKGluZGV4T3JDb21wb25lbnQpLCBoQWxpZ24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZXRJbkxpc3QodGhpcy5faEFsaWducywgPG51bWJlcj5pbmRleE9yQ29tcG9uZW50LCBoQWxpZ24pO1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0Q2VsbEhBbGlnbihpbmRleE9yQ29tcG9uZW50OiBudW1iZXIgfCBBQ29tcG9uZW50KTogRUhBbGlnbiB7XG4gICAgICAgICAgICBpZiAoaW5kZXhPckNvbXBvbmVudCBpbnN0YW5jZW9mIEFDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRDZWxsSEFsaWduKHRoaXMuY2hpbGRyZW4uaW5kZXhPZihpbmRleE9yQ29tcG9uZW50KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRGcm9tTGlzdCh0aGlzLl9oQWxpZ25zLCA8bnVtYmVyPmluZGV4T3JDb21wb25lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHNldENlbGxWQWxpZ24oaW5kZXhPckNvbXBvbmVudDogbnVtYmVyIHwgQUNvbXBvbmVudCwgdkFsaWduOiBFVkFsaWduKSB7XG4gICAgICAgICAgICBpZiAoaW5kZXhPckNvbXBvbmVudCBpbnN0YW5jZW9mIEFDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldENlbGxWQWxpZ24odGhpcy5jaGlsZHJlbi5pbmRleE9mKGluZGV4T3JDb21wb25lbnQpLCB2QWxpZ24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZXRJbkxpc3QodGhpcy5fdkFsaWducywgPG51bWJlcj5pbmRleE9yQ29tcG9uZW50LCB2QWxpZ24pO1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRDZWxsVkFsaWduKGluZGV4T3JDb21wb25lbnQ6IG51bWJlciB8IEFDb21wb25lbnQpOiBFVkFsaWduIHtcbiAgICAgICAgaWYgKGluZGV4T3JDb21wb25lbnQgaW5zdGFuY2VvZiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRDZWxsVkFsaWduKHRoaXMuY2hpbGRyZW4uaW5kZXhPZihpbmRleE9yQ29tcG9uZW50KSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nZXRGcm9tTGlzdCh0aGlzLl92QWxpZ25zLCA8bnVtYmVyPmluZGV4T3JDb21wb25lbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRMYXN0Q2VsbEhBbGlnbihoQWxpZ246IEVIQWxpZ24pIHtcbiAgICAgICAgdGhpcy5zZXRDZWxsSEFsaWduKHRoaXMuY2hpbGRyZW4uc2l6ZSgpIC0gMSwgaEFsaWduKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0TGFzdENlbGxWQWxpZ24odkFsaWduOiBFVkFsaWduKSB7XG4gICAgICAgIHRoaXMuc2V0Q2VsbFZBbGlnbih0aGlzLmNoaWxkcmVuLnNpemUoKSAtIDEsIHZBbGlnbik7XG4gICAgfVxuXG4gICAgcHVibGljIHNldExhc3RDZWxsSGVpZ2h0KGhlaWdodDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuc2V0Q2VsbEhlaWdodCh0aGlzLmNoaWxkcmVuLnNpemUoKSAtIDEsIGhlaWdodCk7XG4gICAgfVxuXG4gICAgcHVibGljIGFkZEVtcHR5Q2VsbChoZWlnaHQ6IG51bWJlcikge1xuICAgICAgICB0aGlzLmNoaWxkcmVuLmFkZChudWxsKTtcbiAgICAgICAgdGhpcy5zZXRDZWxsSGVpZ2h0KHRoaXMuY2hpbGRyZW4uc2l6ZSgpIC0gMSwgaGVpZ2h0KTtcbiAgICB9XG4gICAgXG4gICAgZ2V0IFdpZHRoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XG4gICAgfVxuICAgIGdldCB3aWR0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuV2lkdGgudmFsdWU7XG4gICAgfVxuICAgIHNldCB3aWR0aCh2YWx1ZSkge1xuICAgICAgICB0aGlzLldpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgfVxuXG4gICAgcHVibGljIF9vbkNoaWxkQWRkZWQoY2hpbGQ6IEFDb21wb25lbnQpIHtcbiAgICAgICAgaWYgKGNoaWxkICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChjaGlsZC5lbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgX29uQ2hpbGRSZW1vdmVkKGNoaWxkOiBBQ29tcG9uZW50LCBpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIGlmIChjaGlsZCAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2hpbGQoY2hpbGQuZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZW1vdmVGcm9tTGlzdCh0aGlzLl9oQWxpZ25zLCBpbmRleCk7XG4gICAgICAgIHRoaXMucmVtb3ZlRnJvbUxpc3QodGhpcy5fdkFsaWducywgaW5kZXgpO1xuICAgICAgICB0aGlzLnJlbW92ZUZyb21MaXN0KHRoaXMuX2NlbGxIZWlnaHRzLCBpbmRleCk7XG4gICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBfb25DaGlsZHJlbkNsZWFyZWQoKSB7XG4gICAgICAgIHZhciByb290ID0gdGhpcy5lbGVtZW50O1xuICAgICAgICB2YXIgZSA9IHRoaXMuZWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICAgICAgd2hpbGUgKGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgcm9vdC5yZW1vdmVDaGlsZChlKTtcbiAgICAgICAgICAgIGUgPSByb290LmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2hBbGlnbnMgPSBbXTtcbiAgICAgICAgdGhpcy5fdkFsaWducyA9IFtdO1xuICAgICAgICB0aGlzLl9jZWxsSGVpZ2h0cyA9IFtdO1xuICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgb25MYXlvdXQoKSB7XG4gICAgICAgIHZhciBtYXhXaWR0aCA9IC0xO1xuICAgICAgICBpZiAodGhpcy53aWR0aCAhPSBudWxsKSB7XG4gICAgICAgICAgICBtYXhXaWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYWN0SCA9IDA7XG4gICAgICAgIHZhciBtYXhXID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLnNpemUoKTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY2hpbGRZID0gMDtcbiAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuY2hpbGRyZW4uZ2V0KGkpO1xuICAgICAgICAgICAgbGV0IGNlbGxIID0gdGhpcy5nZXRDZWxsSGVpZ2h0KGkpO1xuICAgICAgICAgICAgbGV0IHZBbGlnbiA9IHRoaXMuZ2V0Q2VsbFZBbGlnbihpKTtcbiAgICAgICAgICAgIGxldCByZWFsQ2VsbEggPSAtMTtcbiAgICAgICAgICAgIGlmIChjZWxsSCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmVhbENlbGxIID0gY2VsbEg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjaGlsZCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlYWxDZWxsSCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgYWN0SCArPSByZWFsQ2VsbEg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL2NoaWxkLmxheW91dCgpO1xuICAgICAgICAgICAgICAgIGxldCBjdyA9IGNoaWxkLmJvdW5kc1dpZHRoO1xuICAgICAgICAgICAgICAgIGxldCBjaCA9IGNoaWxkLmJvdW5kc0hlaWdodDtcbiAgICAgICAgICAgICAgICBsZXQgY2wgPSBjaGlsZC50cmFuc2xhdGVYO1xuICAgICAgICAgICAgICAgIGxldCBjdCA9IGNoaWxkLnRyYW5zbGF0ZVk7XG4gICAgICAgICAgICAgICAgbGV0IGNhbGN1bGF0ZWRDZWxsSCA9IHJlYWxDZWxsSDtcbiAgICAgICAgICAgICAgICBpZiAoY2FsY3VsYXRlZENlbGxIIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICBjYWxjdWxhdGVkQ2VsbEggPSBjaCArIGN0O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2FsY3VsYXRlZENlbGxIIDwgY2gpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXRlZENlbGxIID0gY2g7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY2hpbGRZID0gYWN0SCAtIGNoaWxkLnRyYW5zbGF0ZVk7XG5cbiAgICAgICAgICAgICAgICBpZiAodkFsaWduID09IEVWQWxpZ24uTUlERExFKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkWSArPSAoY2FsY3VsYXRlZENlbGxIIC0gY2gpIC8gMjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZBbGlnbiA9PSBFVkFsaWduLkJPVFRPTSkge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZFkgKz0gKGNhbGN1bGF0ZWRDZWxsSCAtIGNoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2hpbGQuX3NldFRvcChjaGlsZFkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGN3ICsgY2wgPiBtYXhXKSB7XG4gICAgICAgICAgICAgICAgICAgIG1heFcgPSBjdyArIGNsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhY3RIICs9IGNhbGN1bGF0ZWRDZWxsSDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZWFsV2lkdGggPSBtYXhXO1xuICAgICAgICBpZiAobWF4V2lkdGggPiAtMSkge1xuICAgICAgICAgICAgcmVhbFdpZHRoID0gbWF4V2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLnNpemUoKTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY2hpbGRYID0gMDtcbiAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuY2hpbGRyZW4uZ2V0KGkpO1xuICAgICAgICAgICAgaWYgKGNoaWxkID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBoQWxpZ24gPSB0aGlzLmdldENlbGxIQWxpZ24oaSk7XG4gICAgICAgICAgICBsZXQgY3cgPSBjaGlsZC5ib3VuZHNXaWR0aDtcbiAgICAgICAgICAgIGlmIChoQWxpZ24gPT0gRUhBbGlnbi5DRU5URVIpIHtcbiAgICAgICAgICAgICAgICBjaGlsZFggPSAocmVhbFdpZHRoIC0gY3cpIC8gMjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaEFsaWduID09IEVIQWxpZ24uUklHSFQpIHtcbiAgICAgICAgICAgICAgICBjaGlsZFggPSAocmVhbFdpZHRoIC0gY3cpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjaGlsZC5fc2V0TGVmdChjaGlsZFgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRTaXplKHJlYWxXaWR0aCwgYWN0SCk7XG4gICAgfVxuXG5cblxufVxuICAgIFxufVxuXG5cbiIsIm1vZHVsZSBjdWJlZSB7XG5cbiAgICBleHBvcnQgY2xhc3MgTGFiZWwgZXh0ZW5kcyBBQ29tcG9uZW50IHtcblxuICAgICAgICBwcml2YXRlIF93aWR0aCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2hlaWdodCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3RleHQgPSBuZXcgU3RyaW5nUHJvcGVydHkoXCJcIiwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdGV4dE92ZXJmbG93ID0gbmV3IFByb3BlcnR5PEVUZXh0T3ZlcmZsb3c+KEVUZXh0T3ZlcmZsb3cuQ0xJUCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfZm9yZUNvbG9yID0gbmV3IENvbG9yUHJvcGVydHkoQ29sb3IuQkxBQ0ssIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdGV4dEFsaWduID0gbmV3IFByb3BlcnR5PEVUZXh0QWxpZ24+KEVUZXh0QWxpZ24uTEVGVCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdmVydGljYWxBbGlnbiA9IG5ldyBQcm9wZXJ0eTxFVkFsaWduPihFVkFsaWduLlRPUCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYm9sZCA9IG5ldyBCb29sZWFuUHJvcGVydHkoZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2l0YWxpYyA9IG5ldyBCb29sZWFuUHJvcGVydHkoZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3VuZGVybGluZSA9IG5ldyBCb29sZWFuUHJvcGVydHkoZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2ZvbnRTaXplID0gbmV3IE51bWJlclByb3BlcnR5KDEyLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9mb250RmFtaWx5ID0gbmV3IFByb3BlcnR5PEZvbnRGYW1pbHk+KEZvbnRGYW1pbHkuQXJpYWwsIGZhbHNlLCBmYWxzZSk7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKTtcbiAgICAgICAgICAgIHRoaXMuX3dpZHRoLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy53aWR0aCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aGl0ZVNwYWNlID0gXCJub3dyYXBcIjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93WCA9IFwidmlzaWJsZVwiO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJ3aWR0aFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2hpdGVTcGFjZSA9IFwibm9ybWFsXCI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vdmVyZmxvd1ggPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2lkdGggPSB0aGlzLndpZHRoICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fd2lkdGguaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5faGVpZ2h0LmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oZWlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJoZWlnaHRcIilcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93WSA9IFwidmlzaWJsZVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93WSA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9oZWlnaHQuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fdGV4dC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmlubmVySFRNTCA9IHRoaXMudGV4dDtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl90ZXh0LmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3RleHRPdmVyZmxvdy5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0T3ZlcmZsb3cuYXBwbHkodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50ZXh0T3ZlcmZsb3cgPT0gRVRleHRPdmVyZmxvdy5FTExJUFNJUykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2hpdGVTcGFjZSA9IFwibm93cmFwXCI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwid2hpdGVTcGFjZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fd2lkdGguaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9oZWlnaHQuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdGV4dE92ZXJmbG93LmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2ZvcmVDb2xvci5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9yZUNvbG9yID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmNvbG9yID0gXCJyZ2JhKDAsMCwwLDAuMClcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuY29sb3IgPSB0aGlzLmZvcmVDb2xvci50b0NTUygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZm9yZUNvbG9yLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3RleHRBbGlnbi5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0QWxpZ24uYXBwbHkodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdGV4dEFsaWduLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRpY2FsQWxpZ24uYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB0YSA9IHRoaXMudmVydGljYWxBbGlnbjtcbiAgICAgICAgICAgICAgICBpZiAodGEgPT0gRVZBbGlnbi5UT1ApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZlcnRpY2FsQWxpZ24gPSBcInRvcFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGEgPT0gRVZBbGlnbi5NSURETEUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZlcnRpY2FsQWxpZ24gPSBcIm1pZGRsZVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGEgPT0gRVZBbGlnbi5CT1RUT00pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZlcnRpY2FsQWxpZ24gPSBcImJvdHRvbVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdmVydGljYWxBbGlnbi5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl91bmRlcmxpbmUuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnVuZGVybGluZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudGV4dERlY29yYXRpb24gPSBcInVuZGVybGluZVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50ZXh0RGVjb3JhdGlvbiA9IFwibm9uZVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdW5kZXJsaW5lLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2JvbGQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZvbnRXZWlnaHQgPSBcImJvbGRcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFdlaWdodCA9IFwibm9ybWFsXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9ib2xkLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2l0YWxpYy5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXRhbGljKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250U3R5bGUgPSBcIml0YWxpY1wiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250U3R5bGUgPSBcIm5vcm1hbFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5faXRhbGljLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2ZvbnRTaXplLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFNpemUgPSB0aGlzLmZvbnRTaXplICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9mb250U2l6ZS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9mb250RmFtaWx5LmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmZvbnRGYW1pbHkuYXBwbHkodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZm9udEZhbWlseS5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuV2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHdpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLldpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGdldCBIZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGdldCBoZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5IZWlnaHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGhlaWdodCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5IZWlnaHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUZXh0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RleHQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRleHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UZXh0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0ZXh0KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRleHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUZXh0T3ZlcmZsb3coKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGV4dE92ZXJmbG93O1xuICAgICAgICB9XG4gICAgICAgIGdldCB0ZXh0T3ZlcmZsb3coKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UZXh0T3ZlcmZsb3cudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHRleHRPdmVyZmxvdyh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5UZXh0T3ZlcmZsb3cudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuUGFkZGluZ1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEZvcmVDb2xvcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb3JlQ29sb3I7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGZvcmVDb2xvcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkZvcmVDb2xvci52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgZm9yZUNvbG9yKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkZvcmVDb2xvci52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFZlcnRpY2FsQWxpZ24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmVydGljYWxBbGlnbjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdmVydGljYWxBbGlnbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlZlcnRpY2FsQWxpZ24udmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHZlcnRpY2FsQWxpZ24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVmVydGljYWxBbGlnbi52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEJvbGQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYm9sZDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm9sZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkJvbGQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGJvbGQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQm9sZC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEl0YWxpYygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pdGFsaWM7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGl0YWxpYygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkl0YWxpYy52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgaXRhbGljKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkl0YWxpYy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFVuZGVybGluZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl91bmRlcmxpbmU7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHVuZGVybGluZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlVuZGVybGluZS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdW5kZXJsaW5lKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlVuZGVybGluZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFRleHRBbGlnbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZXh0QWxpZ247XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRleHRBbGlnbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlRleHRBbGlnbi52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdGV4dEFsaWduKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRleHRBbGlnbi52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEZvbnRTaXplKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvbnRTaXplO1xuICAgICAgICB9XG4gICAgICAgIGdldCBmb250U2l6ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkZvbnRTaXplLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBmb250U2l6ZSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Gb250U2l6ZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEZvbnRGYW1pbHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9udEZhbWlseTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgZm9udEZhbWlseSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkZvbnRGYW1pbHkudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGZvbnRGYW1pbHkodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuRm9udEZhbWlseS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn1cblxuXG4iLCJtb2R1bGUgY3ViZWUge1xuXG4gICAgZXhwb3J0IGNsYXNzIEFQb3B1cCB7XG5cbiAgICAgICAgcHJpdmF0ZSBfbW9kYWw6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcHJpdmF0ZSBfYXV0b0Nsb3NlID0gdHJ1ZTtcbiAgICAgICAgcHJpdmF0ZSBfZ2xhc3NDb2xvciA9IENvbG9yLlRSQU5TUEFSRU5UO1xuXG4gICAgICAgIHByaXZhdGUgX3RyYW5zbGF0ZVggPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdHJhbnNsYXRlWSA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9jZW50ZXIgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuXG4gICAgICAgIHByaXZhdGUgX3BvcHVwUm9vdDogUGFuZWwgPSBudWxsO1xuICAgICAgICBwcml2YXRlIF9yb290Q29tcG9uZW50Q29udGFpbmVyOiBQYW5lbCA9IG51bGw7XG4gICAgICAgIHByaXZhdGUgX3Jvb3RDb21wb25lbnQ6IEFDb21wb25lbnQgPSBudWxsO1xuXG4gICAgICAgIHByaXZhdGUgX3Zpc2libGUgPSBmYWxzZTtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihtb2RhbDogYm9vbGVhbiA9IHRydWUsIGF1dG9DbG9zZTogYm9vbGVhbiA9IHRydWUsIGdsYXNzQ29sb3IgPSBDb2xvci5nZXRBcmdiQ29sb3IoMHgwMDAwMDAwMCkpIHtcbiAgICAgICAgICAgIHRoaXMuX21vZGFsID0gbW9kYWw7XG4gICAgICAgICAgICB0aGlzLl9hdXRvQ2xvc2UgPSBhdXRvQ2xvc2U7XG4gICAgICAgICAgICB0aGlzLl9nbGFzc0NvbG9yID0gZ2xhc3NDb2xvcjtcbiAgICAgICAgICAgIHRoaXMuX3BvcHVwUm9vdCA9IG5ldyBQYW5lbCgpO1xuICAgICAgICAgICAgdGhpcy5fcG9wdXBSb290LmVsZW1lbnQuc3R5bGUubGVmdCA9IFwiMHB4XCI7XG4gICAgICAgICAgICB0aGlzLl9wb3B1cFJvb3QuZWxlbWVudC5zdHlsZS50b3AgPSBcIjBweFwiO1xuICAgICAgICAgICAgdGhpcy5fcG9wdXBSb290LmVsZW1lbnQuc3R5bGUucmlnaHQgPSBcIjBweFwiO1xuICAgICAgICAgICAgdGhpcy5fcG9wdXBSb290LmVsZW1lbnQuc3R5bGUuYm90dG9tID0gXCIwcHhcIjtcbiAgICAgICAgICAgIHRoaXMuX3BvcHVwUm9vdC5lbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gXCJmaXhlZFwiO1xuICAgICAgICAgICAgaWYgKGdsYXNzQ29sb3IgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3BvcHVwUm9vdC5iYWNrZ3JvdW5kID0gbmV3IENvbG9yQmFja2dyb3VuZChnbGFzc0NvbG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtb2RhbCB8fCBhdXRvQ2xvc2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wb3B1cFJvb3QuZWxlbWVudC5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJhbGxcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcG9wdXBSb290LmVsZW1lbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9IFwibm9uZVwiO1xuICAgICAgICAgICAgICAgIHRoaXMuX3BvcHVwUm9vdC5wb2ludGVyVHJhbnNwYXJlbnQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9yb290Q29tcG9uZW50Q29udGFpbmVyID0gbmV3IFBhbmVsKCk7XG4gICAgICAgICAgICB0aGlzLl9yb290Q29tcG9uZW50Q29udGFpbmVyLlRyYW5zbGF0ZVguYmluZChuZXcgRXhwcmVzc2lvbjxudW1iZXI+KCgpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgYmFzZVggPSAwO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jZW50ZXIudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgYmFzZVggPSAodGhpcy5fcG9wdXBSb290LmNsaWVudFdpZHRoIC0gdGhpcy5fcm9vdENvbXBvbmVudENvbnRhaW5lci5ib3VuZHNXaWR0aCkgLyAyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gYmFzZVggKyB0aGlzLl90cmFuc2xhdGVYLnZhbHVlO1xuICAgICAgICAgICAgfSwgdGhpcy5fY2VudGVyLCB0aGlzLl9wb3B1cFJvb3QuQ2xpZW50V2lkdGgsIHRoaXMuX3RyYW5zbGF0ZVgsXG4gICAgICAgICAgICAgICAgdGhpcy5fcm9vdENvbXBvbmVudENvbnRhaW5lci5Cb3VuZHNXaWR0aCkpO1xuICAgICAgICAgICAgdGhpcy5fcm9vdENvbXBvbmVudENvbnRhaW5lci5UcmFuc2xhdGVZLmJpbmQobmV3IEV4cHJlc3Npb248bnVtYmVyPigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGJhc2VZID0gMDtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY2VudGVyLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGJhc2VZID0gKHRoaXMuX3BvcHVwUm9vdC5jbGllbnRIZWlnaHQgLSB0aGlzLl9yb290Q29tcG9uZW50Q29udGFpbmVyLmJvdW5kc0hlaWdodCkgLyAyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gYmFzZVkgKyB0aGlzLl90cmFuc2xhdGVZLnZhbHVlO1xuICAgICAgICAgICAgfSwgdGhpcy5fY2VudGVyLCB0aGlzLl9wb3B1cFJvb3QuQ2xpZW50SGVpZ2h0LCB0aGlzLl90cmFuc2xhdGVZLFxuICAgICAgICAgICAgICAgIHRoaXMuX3Jvb3RDb21wb25lbnRDb250YWluZXIuQm91bmRzSGVpZ2h0KSk7XG4gICAgICAgICAgICB0aGlzLl9wb3B1cFJvb3QuY2hpbGRyZW4uYWRkKHRoaXMuX3Jvb3RDb21wb25lbnRDb250YWluZXIpO1xuXG4gICAgICAgICAgICBpZiAoYXV0b0Nsb3NlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcG9wdXBSb290Lm9uQ2xpY2suYWRkTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgX19wb3B1cFJvb3QoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcG9wdXBSb290O1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIGdldCByb290Q29tcG9uZW50KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jvb3RDb21wb25lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgc2V0IHJvb3RDb21wb25lbnQocm9vdENvbXBvbmVudDogQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgdGhpcy5fcm9vdENvbXBvbmVudENvbnRhaW5lci5jaGlsZHJlbi5jbGVhcigpO1xuICAgICAgICAgICAgdGhpcy5fcm9vdENvbXBvbmVudCA9IG51bGw7XG4gICAgICAgICAgICBpZiAocm9vdENvbXBvbmVudCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcm9vdENvbXBvbmVudENvbnRhaW5lci5jaGlsZHJlbi5hZGQocm9vdENvbXBvbmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9yb290Q29tcG9uZW50ID0gcm9vdENvbXBvbmVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBzaG93KCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3Zpc2libGUpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoaXMgcG9wdXAgaXMgYWxyZWFkeSBzaG93bi5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBib2R5OiBIVE1MQm9keUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJvZHlcIilbMF07XG4gICAgICAgICAgICBib2R5LmFwcGVuZENoaWxkKHRoaXMuX3BvcHVwUm9vdC5lbGVtZW50KTtcbiAgICAgICAgICAgIFBvcHVwcy5fYWRkUG9wdXAodGhpcyk7XG4gICAgICAgICAgICB0aGlzLl92aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBjbG9zZSgpOiBib29sZWFuIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fdmlzaWJsZSkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhpcyBwb3B1cCBpc24ndCBzaG93bi5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdGhpcy5pc0Nsb3NlQWxsb3dlZCgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGJvZHk6IEhUTUxCb2R5RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXTtcbiAgICAgICAgICAgIGJvZHkucmVtb3ZlQ2hpbGQodGhpcy5fcG9wdXBSb290LmVsZW1lbnQpO1xuICAgICAgICAgICAgUG9wdXBzLl9yZW1vdmVQb3B1cCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuX3Zpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMub25DbG9zZWQoKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIGlzQ2xvc2VBbGxvd2VkKCk6IGJvb2xlYW4ge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgb25DbG9zZWQoKSB7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBtb2RhbCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tb2RhbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBhdXRvQ2xvc2UoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYXV0b0Nsb3NlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGdsYXNzQ29sb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2xhc3NDb2xvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUcmFuc2xhdGVYKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0ZVg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRyYW5zbGF0ZVgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UcmFuc2xhdGVYLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0cmFuc2xhdGVYKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRyYW5zbGF0ZVgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUcmFuc2xhdGVZKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0ZVk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRyYW5zbGF0ZVkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UcmFuc2xhdGVZLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0cmFuc2xhdGVZKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRyYW5zbGF0ZVkudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBDZW50ZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2VudGVyO1xuICAgICAgICB9XG4gICAgICAgIGdldCBjZW50ZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5DZW50ZXIudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGNlbnRlcih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5DZW50ZXIudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9kb1BvaW50ZXJFdmVudENsaW1iaW5nVXAoc2NyZWVuWDogbnVtYmVyLCBzY3JlZW5ZOiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyLCB3aGVlbFZlbG9jaXR5OiBudW1iZXIsXG4gICAgICAgICAgICBhbHRQcmVzc2VkOiBib29sZWFuLCBjdHJsUHJlc3NlZDogYm9vbGVhbiwgc2hpZnRQcmVzc2VkOiBib29sZWFuLCBtZXRhUHJlc3NlZDogYm9vbGVhbiwgZXZlbnRUeXBlOiBudW1iZXIsIGJ1dHRvbjogbnVtYmVyLCBuYXRpdmVFdmVudDogTW91c2VFdmVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BvcHVwUm9vdC5fZG9Qb2ludGVyRXZlbnRDbGltYmluZ1VwKHNjcmVlblgsIHNjcmVlblksIHgsIHksIHdoZWVsVmVsb2NpdHksIGFsdFByZXNzZWQsIGN0cmxQcmVzc2VkLCBzaGlmdFByZXNzZWQsIG1ldGFQcmVzc2VkLCBldmVudFR5cGUsIGJ1dHRvbiwgbmF0aXZlRXZlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgX2xheW91dCgpIHtcbiAgICAgICAgICAgIHRoaXMuX3BvcHVwUm9vdC53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICAgICAgdGhpcy5fcG9wdXBSb290LmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgICAgIHRoaXMuX3BvcHVwUm9vdC5sYXlvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFBvcHVwcyB7XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX3BvcHVwczogQVBvcHVwW10gPSBbXTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX2xheW91dFJ1bk9uY2UgPSBuZXcgUnVuT25jZSgoKSA9PiB7XG4gICAgICAgICAgICBQb3B1cHMubGF5b3V0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHN0YXRpYyBfYWRkUG9wdXAocG9wdXA6IEFQb3B1cCkge1xuICAgICAgICAgICAgUG9wdXBzLl9wb3B1cHMucHVzaChwb3B1cCk7XG4gICAgICAgICAgICBQb3B1cHMuX3JlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRpYyBfcmVtb3ZlUG9wdXAocG9wdXA6IEFQb3B1cCkge1xuICAgICAgICAgICAgdmFyIGlkeCA9IFBvcHVwcy5fcG9wdXBzLmluZGV4T2YocG9wdXApO1xuICAgICAgICAgICAgaWYgKGlkeCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgUG9wdXBzLl9wb3B1cHMuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgICAgICAgICAgUG9wdXBzLl9yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0aWMgX3JlcXVlc3RMYXlvdXQoKSB7XG4gICAgICAgICAgICBQb3B1cHMuX2xheW91dFJ1bk9uY2UucnVuKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBsYXlvdXQoKSB7XG4gICAgICAgICAgICBQb3B1cHMuX3BvcHVwcy5mb3JFYWNoKChwb3B1cCkgPT4ge1xuICAgICAgICAgICAgICAgIHBvcHVwLl9sYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIGRvUG9pbnRlckV2ZW50Q2xpbWJpbmdVcCh4OiBudW1iZXIsIHk6IG51bWJlciwgd2hlZWxWZWxvY2l0eTogbnVtYmVyLFxuICAgICAgICAgICAgYWx0UHJlc3NlZDogYm9vbGVhbiwgY3RybFByZXNzZWQ6IGJvb2xlYW4sIHNoaWZ0UHJlc3NlZDogYm9vbGVhbiwgbWV0YVByZXNzZWQ6IGJvb2xlYW4sIGV2ZW50VHlwZTogbnVtYmVyLCBidXR0b246IG51bWJlciwgbmF0aXZlRXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBQb3B1cHMuX3BvcHVwcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIGxldCBwb3B1cCA9IFBvcHVwcy5fcG9wdXBzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChwb3B1cC5fZG9Qb2ludGVyRXZlbnRDbGltYmluZ1VwKHgsIHksIHgsIHksIHdoZWVsVmVsb2NpdHksIGFsdFByZXNzZWQsIGN0cmxQcmVzc2VkLCBzaGlmdFByZXNzZWQsIG1ldGFQcmVzc2VkLCBldmVudFR5cGUsIGJ1dHRvbiwgbmF0aXZlRXZlbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgdGhyb3cgXCJDYW4gbm90IGluc3RhbnRpYXRlIFBvcHVwcyBjbGFzcy5cIlxuICAgICAgICB9XG5cbiAgICB9XG5cbn1cblxuXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwidXRpbHMudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiZXZlbnRzLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInByb3BlcnRpZXMudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwic3R5bGVzLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImNvbXBvbmVudF9iYXNlL0xheW91dENoaWxkcmVuLnRzXCIvPiBcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJjb21wb25lbnRfYmFzZS9BQ29tcG9uZW50LnRzXCIvPiBcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJjb21wb25lbnRfYmFzZS9BTGF5b3V0LnRzXCIvPiBcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJjb21wb25lbnRfYmFzZS9BVXNlckNvbnRyb2wudHNcIi8+IFxuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwibGF5b3V0cy9QYW5lbC50c1wiLz4gIFxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImxheW91dHMvSGJveC50c1wiLz4gICBcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJsYXlvdXRzL1Zib3gudHNcIi8+ICAgIFxuICAgXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiY29tcG9uZW50cy9MYWJlbC50c1wiLz4gIFxuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicG9wdXBzLnRzXCIvPiBcblxubW9kdWxlIGN1YmVlIHsgICAgICAgICAgICAgICAgXG5cbiAgICBleHBvcnQgY2xhc3MgQ3ViZWVQYW5lbCB7ICAgICAgICBcblxuICAgICAgICBwcml2YXRlIF9sYXlvdXRSdW5PbmNlOiBSdW5PbmNlID0gbnVsbDtcblxuICAgICAgICBwcml2YXRlIF9jb250ZW50UGFuZWw6IFBhbmVsID0gbnVsbDtcbiAgICAgICAgcHJpdmF0ZSBfcm9vdENvbXBvbmVudDogQUNvbXBvbmVudCA9IG51bGw7XG5cblxuICAgICAgICBwcml2YXRlIF9lbGVtZW50OiBIVE1MRWxlbWVudDtcblxuICAgICAgICBwcml2YXRlIF9sZWZ0ID0gLTE7XG4gICAgICAgIHByaXZhdGUgX3RvcCA9IC0xO1xuICAgICAgICBwcml2YXRlIF9jbGllbnRXaWR0aCA9IC0xO1xuICAgICAgICBwcml2YXRlIF9jbGllbnRIZWlnaHQgPSAtMTtcbiAgICAgICAgcHJpdmF0ZSBfb2Zmc2V0V2lkdGggPSAtMTtcbiAgICAgICAgcHJpdmF0ZSBfb2Zmc2V0SGVpZ2h0ID0gLTE7XG5cbiAgICAgICAgY29uc3RydWN0b3IoZWxlbWVudDogSFRNTERpdkVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJvbnJlc2l6ZVwiLCAoZXZ0OiBVSUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5fY29udGVudFBhbmVsID0gbmV3IFBhbmVsKCk7XG4gICAgICAgICAgICB0aGlzLl9jb250ZW50UGFuZWwuZWxlbWVudC5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJub25lXCI7XG4gICAgICAgICAgICB0aGlzLl9jb250ZW50UGFuZWwucG9pbnRlclRyYW5zcGFyZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbC5zZXRDdWJlZVBhbmVsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLl9jb250ZW50UGFuZWwuZWxlbWVudCk7XG5cbiAgICAgICAgICAgIHRoaXMuY2hlY2tCb3VuZHMoKTtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuXG4gICAgICAgICAgICB2YXIgdCA9IG5ldyBUaW1lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgRXZlbnRRdWV1ZS5JbnN0YW5jZS5pbnZva2VMYXRlcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tCb3VuZHMoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdC5zdGFydCgxMDAsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBjaGVja0JvdW5kcygpIHtcbiAgICAgICAgICAgIC8vIFRPRE8gb2Zmc2V0TGVmdCAtPiBhYnNvbHV0ZUxlZnRcbiAgICAgICAgICAgIHZhciBuZXdMZWZ0ID0gdGhpcy5fZWxlbWVudC5vZmZzZXRMZWZ0O1xuICAgICAgICAgICAgLy8gVE9ETyBvZmZzZXRUb3AgLT4gYWJzb2x1dGVUb3BcbiAgICAgICAgICAgIHZhciBuZXdUb3AgPSB0aGlzLl9lbGVtZW50Lm9mZnNldFRvcDtcbiAgICAgICAgICAgIHZhciBuZXdDbGllbnRXaWR0aCA9IHRoaXMuX2VsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgICAgICAgICB2YXIgbmV3Q2xpZW50SGVpZ2h0ID0gdGhpcy5fZWxlbWVudC5jbGllbnRIZWlnaHQ7XG4gICAgICAgICAgICB2YXIgbmV3T2Zmc2V0V2lkdGggPSB0aGlzLl9lbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICAgICAgdmFyIG5ld09mZnNldEhlaWdodCA9IHRoaXMuX2VsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgaWYgKG5ld0xlZnQgIT0gdGhpcy5fbGVmdCB8fCBuZXdUb3AgIT0gdGhpcy5fdG9wIHx8IG5ld0NsaWVudFdpZHRoICE9IHRoaXMuX2NsaWVudFdpZHRoIHx8IG5ld0NsaWVudEhlaWdodCAhPSB0aGlzLl9jbGllbnRIZWlnaHRcbiAgICAgICAgICAgICAgICB8fCBuZXdPZmZzZXRXaWR0aCAhPSB0aGlzLl9vZmZzZXRXaWR0aCB8fCBuZXdPZmZzZXRIZWlnaHQgIT0gdGhpcy5fb2Zmc2V0SGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGVmdCA9IG5ld0xlZnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fdG9wID0gbmV3VG9wO1xuICAgICAgICAgICAgICAgIHRoaXMuX2NsaWVudFdpZHRoID0gbmV3Q2xpZW50V2lkdGg7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2xpZW50SGVpZ2h0ID0gbmV3Q2xpZW50SGVpZ2h0O1xuICAgICAgICAgICAgICAgIHRoaXMuX29mZnNldFdpZHRoID0gbmV3T2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICAgICAgdGhpcy5fb2Zmc2V0SGVpZ2h0ID0gbmV3T2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbC53aWR0aCA9IHRoaXMuX29mZnNldFdpZHRoO1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbC5oZWlnaHQgPSB0aGlzLl9vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2VsZW1lbnQuc3R5bGUucG9zaXRpb24gPT0gXCJhYnNvbHV0ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbC50cmFuc2xhdGVYID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29udGVudFBhbmVsLnRyYW5zbGF0ZVkgPSAwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbC50cmFuc2xhdGVYID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29udGVudFBhbmVsLnRyYW5zbGF0ZVkgPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlcXVlc3RMYXlvdXQoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fbGF5b3V0UnVuT25jZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGF5b3V0UnVuT25jZSA9IG5ldyBSdW5PbmNlKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXlvdXQoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2xheW91dFJ1bk9uY2UucnVuKCk7XG4gICAgICAgIH1cblxuICAgICAgICBsYXlvdXQoKSB7XG4gICAgICAgICAgICBQb3B1cHMuX3JlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbC5sYXlvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCByb290Q29tcG9uZW50KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jvb3RDb21wb25lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBzZXQgcm9vdENvbXBvbmVudChyb290Q29tcG9uZW50OiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9jb250ZW50UGFuZWwuY2hpbGRyZW4uY2xlYXIoKTtcbiAgICAgICAgICAgIHRoaXMuX3Jvb3RDb21wb25lbnQgPSBudWxsO1xuICAgICAgICAgICAgaWYgKHJvb3RDb21wb25lbnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbC5jaGlsZHJlbi5hZGQocm9vdENvbXBvbmVudCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcm9vdENvbXBvbmVudCA9IHJvb3RDb21wb25lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBfZG9Qb2ludGVyRXZlbnRDbGltYmluZ1VwKHNjcmVlblg6IG51bWJlciwgc2NyZWVuWTogbnVtYmVyLCB3aGVlbFZlbG9jaXR5OiBudW1iZXIsXG4gICAgICAgICAgICBhbHRQcmVzc2VkOiBib29sZWFuLCBjdHJsUHJlc3NlZDogYm9vbGVhbiwgc2hpZnRQcmVzc2VkOiBib29sZWFuLCBtZXRhUHJlc3NlZDogYm9vbGVhbiwgZXZlbnRUeXBlOiBudW1iZXIsIGJ1dHRvbjogbnVtYmVyLCBuYXRpdmVFdmVudDogTW91c2VFdmVudCkge1xuICAgICAgICAgICAgaWYgKFBvcHVwcy5kb1BvaW50ZXJFdmVudENsaW1iaW5nVXAoc2NyZWVuWCwgc2NyZWVuWSwgd2hlZWxWZWxvY2l0eSwgYWx0UHJlc3NlZCwgY3RybFByZXNzZWQsIHNoaWZ0UHJlc3NlZCwgbWV0YVByZXNzZWQsIGV2ZW50VHlwZSwgYnV0dG9uLCBuYXRpdmVFdmVudCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX2VsZW1lbnQuc3R5bGUucG9zaXRpb24gIT0gXCJhYnNvbHV0ZVwiKSB7XG4gICAgICAgICAgICAgICAgc2NyZWVuWCA9IHNjcmVlblggKyB3aW5kb3cuc2Nyb2xsWCAtIHRoaXMuX2xlZnQ7XG4gICAgICAgICAgICAgICAgc2NyZWVuWSA9IHNjcmVlblkgKyB3aW5kb3cuc2Nyb2xsWSAtIHRoaXMuX3RvcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250ZW50UGFuZWwuX2RvUG9pbnRlckV2ZW50Q2xpbWJpbmdVcChzY3JlZW5YLCBzY3JlZW5ZLCBzY3JlZW5YLCBzY3JlZW5ZLCB3aGVlbFZlbG9jaXR5LCBhbHRQcmVzc2VkLCBjdHJsUHJlc3NlZCwgc2hpZnRQcmVzc2VkLCBtZXRhUHJlc3NlZCwgZXZlbnRUeXBlLCBidXR0b24sIG5hdGl2ZUV2ZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBDbGllbnRXaWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250ZW50UGFuZWwuQ2xpZW50V2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGNsaWVudFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQ2xpZW50V2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGNsaWVudFdpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkNsaWVudFdpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQ2xpZW50SGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRlbnRQYW5lbC5DbGllbnRIZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGNsaWVudEhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkNsaWVudEhlaWdodC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgY2xpZW50SGVpZ2h0KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkNsaWVudEhlaWdodC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEJvdW5kc1dpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRlbnRQYW5lbC5Cb3VuZHNXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm91bmRzV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Cb3VuZHNXaWR0aC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYm91bmRzV2lkdGgodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQm91bmRzV2lkdGgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBCb3VuZHNIZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY29udGVudFBhbmVsLkJvdW5kc0hlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm91bmRzSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm91bmRzSGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBib3VuZHNIZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQm91bmRzSGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm91bmRzTGVmdCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250ZW50UGFuZWwuQm91bmRzTGVmdDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm91bmRzTGVmdCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkJvdW5kc0xlZnQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGJvdW5kc0xlZnQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQm91bmRzTGVmdC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEJvdW5kc1RvcCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250ZW50UGFuZWwuQm91bmRzVG9wO1xuICAgICAgICB9XG4gICAgICAgIGdldCBib3VuZHNUb3AoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Cb3VuZHNUb3AudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGJvdW5kc1RvcCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Cb3VuZHNUb3AudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG59XG5cblxuIl19