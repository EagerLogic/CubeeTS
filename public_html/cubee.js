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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3ViZWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9ldmVudHMudHMiLCIuLi8uLi9wcm9wZXJ0aWVzLnRzIiwiLi4vLi4vc3R5bGVzLnRzIiwiLi4vLi4vdXRpbHMudHMiLCIuLi8uLi9jb21wb25lbnRfYmFzZS9MYXlvdXRDaGlsZHJlbi50cyIsIi4uLy4uL2NvbXBvbmVudF9iYXNlL0FDb21wb25lbnQudHMiLCIuLi8uLi9jb21wb25lbnRfYmFzZS9BTGF5b3V0LnRzIiwiLi4vLi4vY29tcG9uZW50X2Jhc2UvQVVzZXJDb250cm9sLnRzIiwiLi4vLi4vbGF5b3V0cy9QYW5lbC50cyIsIi4uLy4uL2xheW91dHMvSEJveC50cyIsIi4uLy4uL2xheW91dHMvVkJveC50cyIsIi4uLy4uL2NvbXBvbmVudHMvbGFiZWwudHMiLCIuLi8uLi9wb3B1cHMudHMiLCIuLi8uLi9jdWJlZS50cyIsIi4uLy4uL2NvbXBvbmVudF9iYXNlL0FWaWV3LnRzIl0sIm5hbWVzIjpbImN1YmVlIiwiY3ViZWUuRXZlbnRBcmdzIiwiY3ViZWUuRXZlbnRBcmdzLmNvbnN0cnVjdG9yIiwiY3ViZWUuRXZlbnQiLCJjdWJlZS5FdmVudC5jb25zdHJ1Y3RvciIsImN1YmVlLkV2ZW50LkV2ZW50IiwiY3ViZWUuRXZlbnQuYWRkTGlzdGVuZXIiLCJjdWJlZS5FdmVudC5yZW1vdmVMaXN0ZW5lciIsImN1YmVlLkV2ZW50Lmhhc0xpc3RlbmVyIiwiY3ViZWUuRXZlbnQuZmlyZUV2ZW50IiwiY3ViZWUuVGltZXIiLCJjdWJlZS5UaW1lci5jb25zdHJ1Y3RvciIsImN1YmVlLlRpbWVyLnN0YXJ0IiwiY3ViZWUuVGltZXIuc3RvcCIsImN1YmVlLlRpbWVyLlN0YXJ0ZWQiLCJjdWJlZS5FdmVudFF1ZXVlIiwiY3ViZWUuRXZlbnRRdWV1ZS5jb25zdHJ1Y3RvciIsImN1YmVlLkV2ZW50UXVldWUuSW5zdGFuY2UiLCJjdWJlZS5FdmVudFF1ZXVlLmludm9rZUxhdGVyIiwiY3ViZWUuRXZlbnRRdWV1ZS5pbnZva2VQcmlvciIsImN1YmVlLlJ1bk9uY2UiLCJjdWJlZS5SdW5PbmNlLmNvbnN0cnVjdG9yIiwiY3ViZWUuUnVuT25jZS5ydW4iLCJjdWJlZS5Nb3VzZURyYWdFdmVudEFyZ3MiLCJjdWJlZS5Nb3VzZURyYWdFdmVudEFyZ3MuY29uc3RydWN0b3IiLCJjdWJlZS5Nb3VzZVVwRXZlbnRBcmdzIiwiY3ViZWUuTW91c2VVcEV2ZW50QXJncy5jb25zdHJ1Y3RvciIsImN1YmVlLk1vdXNlRG93bkV2ZW50QXJncyIsImN1YmVlLk1vdXNlRG93bkV2ZW50QXJncy5jb25zdHJ1Y3RvciIsImN1YmVlLk1vdXNlTW92ZUV2ZW50QXJncyIsImN1YmVlLk1vdXNlTW92ZUV2ZW50QXJncy5jb25zdHJ1Y3RvciIsImN1YmVlLk1vdXNlV2hlZWxFdmVudEFyZ3MiLCJjdWJlZS5Nb3VzZVdoZWVsRXZlbnRBcmdzLmNvbnN0cnVjdG9yIiwiY3ViZWUuQ2xpY2tFdmVudEFyZ3MiLCJjdWJlZS5DbGlja0V2ZW50QXJncy5jb25zdHJ1Y3RvciIsImN1YmVlLktleUV2ZW50QXJncyIsImN1YmVlLktleUV2ZW50QXJncy5jb25zdHJ1Y3RvciIsImN1YmVlLlBhcmVudENoYW5nZWRFdmVudEFyZ3MiLCJjdWJlZS5QYXJlbnRDaGFuZ2VkRXZlbnRBcmdzLmNvbnN0cnVjdG9yIiwiY3ViZWUuQ29udGV4dE1lbnVFdmVudEFyZ3MiLCJjdWJlZS5Db250ZXh0TWVudUV2ZW50QXJncy5jb25zdHJ1Y3RvciIsImN1YmVlLlByb3BlcnR5IiwiY3ViZWUuUHJvcGVydHkuY29uc3RydWN0b3IiLCJjdWJlZS5Qcm9wZXJ0eS5pZCIsImN1YmVlLlByb3BlcnR5LnZhbGlkIiwiY3ViZWUuUHJvcGVydHkudmFsdWUiLCJjdWJlZS5Qcm9wZXJ0eS5udWxsYWJsZSIsImN1YmVlLlByb3BlcnR5LnJlYWRvbmx5IiwiY3ViZWUuUHJvcGVydHkuaW5pdFJlYWRvbmx5QmluZCIsImN1YmVlLlByb3BlcnR5LmdldCIsImN1YmVlLlByb3BlcnR5LnNldCIsImN1YmVlLlByb3BlcnR5LmludmFsaWRhdGUiLCJjdWJlZS5Qcm9wZXJ0eS5pbnZhbGlkYXRlSWZOZWVkZWQiLCJjdWJlZS5Qcm9wZXJ0eS5maXJlQ2hhbmdlTGlzdGVuZXJzIiwiY3ViZWUuUHJvcGVydHkuZ2V0T2JqZWN0VmFsdWUiLCJjdWJlZS5Qcm9wZXJ0eS5hZGRDaGFuZ2VMaXN0ZW5lciIsImN1YmVlLlByb3BlcnR5LnJlbW92ZUNoYW5nZUxpc3RlbmVyIiwiY3ViZWUuUHJvcGVydHkuaGFzQ2hhbmdlTGlzdGVuZXIiLCJjdWJlZS5Qcm9wZXJ0eS5hbmltYXRlIiwiY3ViZWUuUHJvcGVydHkuYmluZCIsImN1YmVlLlByb3BlcnR5LmJpZGlyZWN0aW9uYWxCaW5kIiwiY3ViZWUuUHJvcGVydHkudW5iaW5kIiwiY3ViZWUuUHJvcGVydHkudW5iaW5kVGFyZ2V0cyIsImN1YmVlLlByb3BlcnR5LmlzQm91bmQiLCJjdWJlZS5Qcm9wZXJ0eS5pc0JpZGlyZWN0aW9uYWxCb3VuZCIsImN1YmVlLlByb3BlcnR5LmNyZWF0ZVByb3BlcnR5TGluZSIsImN1YmVlLlByb3BlcnR5LmRlc3Ryb3kiLCJjdWJlZS5FeHByZXNzaW9uIiwiY3ViZWUuRXhwcmVzc2lvbi5jb25zdHJ1Y3RvciIsImN1YmVlLkV4cHJlc3Npb24udmFsdWUiLCJjdWJlZS5FeHByZXNzaW9uLmFkZENoYW5nZUxpc3RlbmVyIiwiY3ViZWUuRXhwcmVzc2lvbi5yZW1vdmVDaGFuZ2VMaXN0ZW5lciIsImN1YmVlLkV4cHJlc3Npb24uaGFzQ2hhbmdlTGlzdGVuZXIiLCJjdWJlZS5FeHByZXNzaW9uLmdldE9iamVjdFZhbHVlIiwiY3ViZWUuRXhwcmVzc2lvbi5iaW5kIiwiY3ViZWUuRXhwcmVzc2lvbi51bmJpbmRBbGwiLCJjdWJlZS5FeHByZXNzaW9uLnVuYmluZCIsImN1YmVlLkV4cHJlc3Npb24uaW52YWxpZGF0ZSIsImN1YmVlLkV4cHJlc3Npb24uaW52YWxpZGF0ZUlmTmVlZGVkIiwiY3ViZWUuRXhwcmVzc2lvbi5maXJlQ2hhbmdlTGlzdGVuZXJzIiwiY3ViZWUuS2V5RnJhbWUiLCJjdWJlZS5LZXlGcmFtZS5jb25zdHJ1Y3RvciIsImN1YmVlLktleUZyYW1lLnRpbWUiLCJjdWJlZS5LZXlGcmFtZS5wcm9wZXJ0eSIsImN1YmVlLktleUZyYW1lLmVuZFZhbHVlIiwiY3ViZWUuS2V5RnJhbWUuaW50ZXJwb2xhdG9yIiwiY3ViZWUuS2V5RnJhbWUua2V5RnJhbWVSZWFjaGVkTGlzdGVuZXIiLCJjdWJlZS5Qcm9wZXJ0eUxpbmUiLCJjdWJlZS5Qcm9wZXJ0eUxpbmUuY29uc3RydWN0b3IiLCJjdWJlZS5Qcm9wZXJ0eUxpbmUuc3RhcnRUaW1lIiwiY3ViZWUuUHJvcGVydHlMaW5lLmFuaW1hdGUiLCJjdWJlZS5JbnRlcnBvbGF0b3JzIiwiY3ViZWUuSW50ZXJwb2xhdG9ycy5jb25zdHJ1Y3RvciIsImN1YmVlLkludGVycG9sYXRvcnMuTGluZWFyIiwiY3ViZWUuQUFuaW1hdG9yIiwiY3ViZWUuQUFuaW1hdG9yLmNvbnN0cnVjdG9yIiwiY3ViZWUuQUFuaW1hdG9yLmFuaW1hdGUiLCJjdWJlZS5BQW5pbWF0b3Iuc3RhcnQiLCJjdWJlZS5BQW5pbWF0b3Iuc3RvcCIsImN1YmVlLkFBbmltYXRvci5TdGFydGVkIiwiY3ViZWUuQUFuaW1hdG9yLlN0b3BwZWQiLCJjdWJlZS5UaW1lbGluZSIsImN1YmVlLlRpbWVsaW5lLmNvbnN0cnVjdG9yIiwiY3ViZWUuVGltZWxpbmUuY3JlYXRlUHJvcGVydHlMaW5lcyIsImN1YmVlLlRpbWVsaW5lLnN0YXJ0IiwiY3ViZWUuVGltZWxpbmUuc3RvcCIsImN1YmVlLlRpbWVsaW5lLm9uQW5pbWF0ZSIsImN1YmVlLlRpbWVsaW5lLm9uRmluaXNoZWRFdmVudCIsImN1YmVlLlRpbWVsaW5lRmluaXNoZWRFdmVudEFyZ3MiLCJjdWJlZS5UaW1lbGluZUZpbmlzaGVkRXZlbnRBcmdzLmNvbnN0cnVjdG9yIiwiY3ViZWUuVGltZWxpbmVGaW5pc2hlZEV2ZW50QXJncy5TdG9wcGVkIiwiY3ViZWUuTnVtYmVyUHJvcGVydHkiLCJjdWJlZS5OdW1iZXJQcm9wZXJ0eS5jb25zdHJ1Y3RvciIsImN1YmVlLk51bWJlclByb3BlcnR5LmFuaW1hdGUiLCJjdWJlZS5TdHJpbmdQcm9wZXJ0eSIsImN1YmVlLlN0cmluZ1Byb3BlcnR5LmNvbnN0cnVjdG9yIiwiY3ViZWUuUGFkZGluZ1Byb3BlcnR5IiwiY3ViZWUuUGFkZGluZ1Byb3BlcnR5LmNvbnN0cnVjdG9yIiwiY3ViZWUuQm9yZGVyUHJvcGVydHkiLCJjdWJlZS5Cb3JkZXJQcm9wZXJ0eS5jb25zdHJ1Y3RvciIsImN1YmVlLkJhY2tncm91bmRQcm9wZXJ0eSIsImN1YmVlLkJhY2tncm91bmRQcm9wZXJ0eS5jb25zdHJ1Y3RvciIsImN1YmVlLkJvb2xlYW5Qcm9wZXJ0eSIsImN1YmVlLkJvb2xlYW5Qcm9wZXJ0eS5jb25zdHJ1Y3RvciIsImN1YmVlLkNvbG9yUHJvcGVydHkiLCJjdWJlZS5Db2xvclByb3BlcnR5LmNvbnN0cnVjdG9yIiwiY3ViZWUuQUJhY2tncm91bmQiLCJjdWJlZS5BQmFja2dyb3VuZC5jb25zdHJ1Y3RvciIsImN1YmVlLkNvbG9yIiwiY3ViZWUuQ29sb3IuY29uc3RydWN0b3IiLCJjdWJlZS5Db2xvci5UUkFOU1BBUkVOVCIsImN1YmVlLkNvbG9yLkJMQUNLIiwiY3ViZWUuQ29sb3IuZ2V0QXJnYkNvbG9yIiwiY3ViZWUuQ29sb3IuZ2V0QXJnYkNvbG9yQnlDb21wb25lbnRzIiwiY3ViZWUuQ29sb3IuZ2V0UmdiQ29sb3IiLCJjdWJlZS5Db2xvci5nZXRSZ2JDb2xvckJ5Q29tcG9uZW50cyIsImN1YmVlLkNvbG9yLmZpeENvbXBvbmVudCIsImN1YmVlLkNvbG9yLmZhZGVDb2xvcnMiLCJjdWJlZS5Db2xvci5taXhDb21wb25lbnQiLCJjdWJlZS5Db2xvci5hcmdiIiwiY3ViZWUuQ29sb3IuYWxwaGEiLCJjdWJlZS5Db2xvci5yZWQiLCJjdWJlZS5Db2xvci5ncmVlbiIsImN1YmVlLkNvbG9yLmJsdWUiLCJjdWJlZS5Db2xvci5mYWRlIiwiY3ViZWUuQ29sb3IudG9DU1MiLCJjdWJlZS5Db2xvckJhY2tncm91bmQiLCJjdWJlZS5Db2xvckJhY2tncm91bmQuY29uc3RydWN0b3IiLCJjdWJlZS5Db2xvckJhY2tncm91bmQuY29sb3IiLCJjdWJlZS5Db2xvckJhY2tncm91bmQuYXBwbHkiLCJjdWJlZS5QYWRkaW5nIiwiY3ViZWUuUGFkZGluZy5jb25zdHJ1Y3RvciIsImN1YmVlLlBhZGRpbmcuY3JlYXRlIiwiY3ViZWUuUGFkZGluZy5sZWZ0IiwiY3ViZWUuUGFkZGluZy50b3AiLCJjdWJlZS5QYWRkaW5nLnJpZ2h0IiwiY3ViZWUuUGFkZGluZy5ib3R0b20iLCJjdWJlZS5QYWRkaW5nLmFwcGx5IiwiY3ViZWUuQm9yZGVyIiwiY3ViZWUuQm9yZGVyLmNvbnN0cnVjdG9yIiwiY3ViZWUuQm9yZGVyLmNyZWF0ZSIsImN1YmVlLkJvcmRlci5sZWZ0V2lkdGgiLCJjdWJlZS5Cb3JkZXIudG9wV2lkdGgiLCJjdWJlZS5Cb3JkZXIucmlnaHRXaWR0aCIsImN1YmVlLkJvcmRlci5ib3R0b21XaWR0aCIsImN1YmVlLkJvcmRlci5sZWZ0Q29sb3IiLCJjdWJlZS5Cb3JkZXIudG9wQ29sb3IiLCJjdWJlZS5Cb3JkZXIucmlnaHRDb2xvciIsImN1YmVlLkJvcmRlci5ib3R0b21Db2xvciIsImN1YmVlLkJvcmRlci50b3BMZWZ0UmFkaXVzIiwiY3ViZWUuQm9yZGVyLnRvcFJpZ2h0UmFkaXVzIiwiY3ViZWUuQm9yZGVyLmJvdHRvbUxlZnRSYWRpdXMiLCJjdWJlZS5Cb3JkZXIuYm90dG9tUmlnaHRSYWRpdXMiLCJjdWJlZS5Cb3JkZXIuYXBwbHkiLCJjdWJlZS5Cb3hTaGFkb3ciLCJjdWJlZS5Cb3hTaGFkb3cuY29uc3RydWN0b3IiLCJjdWJlZS5Cb3hTaGFkb3cuaFBvcyIsImN1YmVlLkJveFNoYWRvdy52UG9zIiwiY3ViZWUuQm94U2hhZG93LmJsdXIiLCJjdWJlZS5Cb3hTaGFkb3cuc3ByZWFkIiwiY3ViZWUuQm94U2hhZG93LmNvbG9yIiwiY3ViZWUuQm94U2hhZG93LmlubmVyIiwiY3ViZWUuQm94U2hhZG93LmFwcGx5IiwiY3ViZWUuRVRleHRPdmVyZmxvdyIsImN1YmVlLkVUZXh0T3ZlcmZsb3cuY29uc3RydWN0b3IiLCJjdWJlZS5FVGV4dE92ZXJmbG93LkNMSVAiLCJjdWJlZS5FVGV4dE92ZXJmbG93LkVMTElQU0lTIiwiY3ViZWUuRVRleHRPdmVyZmxvdy5DU1MiLCJjdWJlZS5FVGV4dE92ZXJmbG93LmFwcGx5IiwiY3ViZWUuRVRleHRBbGlnbiIsImN1YmVlLkVUZXh0QWxpZ24uY29uc3RydWN0b3IiLCJjdWJlZS5FVGV4dEFsaWduLkxFRlQiLCJjdWJlZS5FVGV4dEFsaWduLkNFTlRFUiIsImN1YmVlLkVUZXh0QWxpZ24uUklHSFQiLCJjdWJlZS5FVGV4dEFsaWduLkpVU1RJRlkiLCJjdWJlZS5FVGV4dEFsaWduLkNTUyIsImN1YmVlLkVUZXh0QWxpZ24uYXBwbHkiLCJjdWJlZS5FSEFsaWduIiwiY3ViZWUuRUhBbGlnbi5jb25zdHJ1Y3RvciIsImN1YmVlLkVIQWxpZ24uTEVGVCIsImN1YmVlLkVIQWxpZ24uQ0VOVEVSIiwiY3ViZWUuRUhBbGlnbi5SSUdIVCIsImN1YmVlLkVIQWxpZ24uQ1NTIiwiY3ViZWUuRVZBbGlnbiIsImN1YmVlLkVWQWxpZ24uY29uc3RydWN0b3IiLCJjdWJlZS5FVkFsaWduLlRPUCIsImN1YmVlLkVWQWxpZ24uTUlERExFIiwiY3ViZWUuRVZBbGlnbi5CT1RUT00iLCJjdWJlZS5FVkFsaWduLkNTUyIsImN1YmVlLkZvbnRGYW1pbHkiLCJjdWJlZS5Gb250RmFtaWx5LmNvbnN0cnVjdG9yIiwiY3ViZWUuRm9udEZhbWlseS5BcmlhbCIsImN1YmVlLkZvbnRGYW1pbHkuaW5pdEZvbnRDb250YWluZXJTdHlsZSIsImN1YmVlLkZvbnRGYW1pbHkucmVnaXN0ZXJGb250IiwiY3ViZWUuRm9udEZhbWlseS5DU1MiLCJjdWJlZS5Gb250RmFtaWx5LmFwcGx5IiwiY3ViZWUuRUN1cnNvciIsImN1YmVlLkVDdXJzb3IuY29uc3RydWN0b3IiLCJjdWJlZS5FQ3Vyc29yLkFVVE8iLCJjdWJlZS5FQ3Vyc29yLmNzcyIsImN1YmVlLlBvaW50MkQiLCJjdWJlZS5Qb2ludDJELmNvbnN0cnVjdG9yIiwiY3ViZWUuUG9pbnQyRC54IiwiY3ViZWUuUG9pbnQyRC55IiwiY3ViZWUuTGF5b3V0Q2hpbGRyZW4iLCJjdWJlZS5MYXlvdXRDaGlsZHJlbi5jb25zdHJ1Y3RvciIsImN1YmVlLkxheW91dENoaWxkcmVuLmFkZCIsImN1YmVlLkxheW91dENoaWxkcmVuLmluc2VydCIsImN1YmVlLkxheW91dENoaWxkcmVuLnJlbW92ZUNvbXBvbmVudCIsImN1YmVlLkxheW91dENoaWxkcmVuLnJlbW92ZUluZGV4IiwiY3ViZWUuTGF5b3V0Q2hpbGRyZW4uY2xlYXIiLCJjdWJlZS5MYXlvdXRDaGlsZHJlbi5nZXQiLCJjdWJlZS5MYXlvdXRDaGlsZHJlbi5pbmRleE9mIiwiY3ViZWUuTGF5b3V0Q2hpbGRyZW4uc2l6ZSIsImN1YmVlLk1vdXNlRXZlbnRUeXBlcyIsImN1YmVlLk1vdXNlRXZlbnRUeXBlcy5jb25zdHJ1Y3RvciIsImN1YmVlLkFDb21wb25lbnQiLCJjdWJlZS5BQ29tcG9uZW50LmNvbnN0cnVjdG9yIiwiY3ViZWUuQUNvbXBvbmVudC5pbnZva2VQb3N0Q29uc3RydWN0IiwiY3ViZWUuQUNvbXBvbmVudC5wb3N0Q29uc3RydWN0IiwiY3ViZWUuQUNvbXBvbmVudC5zZXRDdWJlZVBhbmVsIiwiY3ViZWUuQUNvbXBvbmVudC5nZXRDdWJlZVBhbmVsIiwiY3ViZWUuQUNvbXBvbmVudC51cGRhdGVUcmFuc2Zvcm0iLCJjdWJlZS5BQ29tcG9uZW50LnJlcXVlc3RMYXlvdXQiLCJjdWJlZS5BQ29tcG9uZW50Lm1lYXN1cmUiLCJjdWJlZS5BQ29tcG9uZW50Lm9uTWVhc3VyZSIsImN1YmVlLkFDb21wb25lbnQuc2NhbGVQb2ludCIsImN1YmVlLkFDb21wb25lbnQucm90YXRlUG9pbnQiLCJjdWJlZS5BQ29tcG9uZW50LmVsZW1lbnQiLCJjdWJlZS5BQ29tcG9uZW50LnBhcmVudCIsImN1YmVlLkFDb21wb25lbnQuX3NldFBhcmVudCIsImN1YmVlLkFDb21wb25lbnQubGF5b3V0IiwiY3ViZWUuQUNvbXBvbmVudC5uZWVkc0xheW91dCIsImN1YmVlLkFDb21wb25lbnQuVHJhbnNsYXRlWCIsImN1YmVlLkFDb21wb25lbnQudHJhbnNsYXRlWCIsImN1YmVlLkFDb21wb25lbnQuVHJhbnNsYXRlWSIsImN1YmVlLkFDb21wb25lbnQudHJhbnNsYXRlWSIsImN1YmVlLkFDb21wb25lbnQuUGFkZGluZyIsImN1YmVlLkFDb21wb25lbnQucGFkZGluZyIsImN1YmVlLkFDb21wb25lbnQuQm9yZGVyIiwiY3ViZWUuQUNvbXBvbmVudC5ib3JkZXIiLCJjdWJlZS5BQ29tcG9uZW50Lk1lYXN1cmVkV2lkdGgiLCJjdWJlZS5BQ29tcG9uZW50Lm1lYXN1cmVkV2lkdGgiLCJjdWJlZS5BQ29tcG9uZW50Lk1lYXN1cmVkSGVpZ2h0IiwiY3ViZWUuQUNvbXBvbmVudC5tZWFzdXJlZEhlaWdodCIsImN1YmVlLkFDb21wb25lbnQuQ2xpZW50V2lkdGgiLCJjdWJlZS5BQ29tcG9uZW50LmNsaWVudFdpZHRoIiwiY3ViZWUuQUNvbXBvbmVudC5DbGllbnRIZWlnaHQiLCJjdWJlZS5BQ29tcG9uZW50LmNsaWVudEhlaWdodCIsImN1YmVlLkFDb21wb25lbnQuQm91bmRzV2lkdGgiLCJjdWJlZS5BQ29tcG9uZW50LmJvdW5kc1dpZHRoIiwiY3ViZWUuQUNvbXBvbmVudC5Cb3VuZHNIZWlnaHQiLCJjdWJlZS5BQ29tcG9uZW50LmJvdW5kc0hlaWdodCIsImN1YmVlLkFDb21wb25lbnQuQm91bmRzTGVmdCIsImN1YmVlLkFDb21wb25lbnQuYm91bmRzTGVmdCIsImN1YmVlLkFDb21wb25lbnQuQm91bmRzVG9wIiwiY3ViZWUuQUNvbXBvbmVudC5ib3VuZHNUb3AiLCJjdWJlZS5BQ29tcG9uZW50Lk1pbldpZHRoIiwiY3ViZWUuQUNvbXBvbmVudC5taW5XaWR0aCIsImN1YmVlLkFDb21wb25lbnQuTWluSGVpZ2h0IiwiY3ViZWUuQUNvbXBvbmVudC5taW5IZWlnaHQiLCJjdWJlZS5BQ29tcG9uZW50Lk1heFdpZHRoIiwiY3ViZWUuQUNvbXBvbmVudC5tYXhXaWR0aCIsImN1YmVlLkFDb21wb25lbnQuTWF4SGVpZ2h0IiwiY3ViZWUuQUNvbXBvbmVudC5tYXhIZWlnaHQiLCJjdWJlZS5BQ29tcG9uZW50LnNldFBvc2l0aW9uIiwiY3ViZWUuQUNvbXBvbmVudC5fc2V0TGVmdCIsImN1YmVlLkFDb21wb25lbnQuX3NldFRvcCIsImN1YmVlLkFDb21wb25lbnQuc2V0U2l6ZSIsImN1YmVlLkFDb21wb25lbnQuQ3Vyc29yIiwiY3ViZWUuQUNvbXBvbmVudC5jdXJzb3IiLCJjdWJlZS5BQ29tcG9uZW50LlBvaW50ZXJUcmFuc3BhcmVudCIsImN1YmVlLkFDb21wb25lbnQucG9pbnRlclRyYW5zcGFyZW50IiwiY3ViZWUuQUNvbXBvbmVudC5WaXNpYmxlIiwiY3ViZWUuQUNvbXBvbmVudC52aXNpYmxlIiwiY3ViZWUuQUNvbXBvbmVudC5vbkNsaWNrIiwiY3ViZWUuQUNvbXBvbmVudC5vbkNvbnRleHRNZW51IiwiY3ViZWUuQUNvbXBvbmVudC5vbk1vdXNlRG93biIsImN1YmVlLkFDb21wb25lbnQub25Nb3VzZU1vdmUiLCJjdWJlZS5BQ29tcG9uZW50Lm9uTW91c2VVcCIsImN1YmVlLkFDb21wb25lbnQub25Nb3VzZUVudGVyIiwiY3ViZWUuQUNvbXBvbmVudC5vbk1vdXNlTGVhdmUiLCJjdWJlZS5BQ29tcG9uZW50Lm9uTW91c2VXaGVlbCIsImN1YmVlLkFDb21wb25lbnQub25LZXlEb3duIiwiY3ViZWUuQUNvbXBvbmVudC5vbktleVByZXNzIiwiY3ViZWUuQUNvbXBvbmVudC5vbktleVVwIiwiY3ViZWUuQUNvbXBvbmVudC5vblBhcmVudENoYW5nZWQiLCJjdWJlZS5BQ29tcG9uZW50LkFscGhhIiwiY3ViZWUuQUNvbXBvbmVudC5hbHBoYSIsImN1YmVlLkFDb21wb25lbnQuSGFuZGxlUG9pbnRlciIsImN1YmVlLkFDb21wb25lbnQuaGFuZGxlUG9pbnRlciIsImN1YmVlLkFDb21wb25lbnQuRW5hYmxlZCIsImN1YmVlLkFDb21wb25lbnQuZW5hYmxlZCIsImN1YmVlLkFDb21wb25lbnQuU2VsZWN0YWJsZSIsImN1YmVlLkFDb21wb25lbnQuc2VsZWN0YWJsZSIsImN1YmVlLkFDb21wb25lbnQubGVmdCIsImN1YmVlLkFDb21wb25lbnQudG9wIiwiY3ViZWUuQUNvbXBvbmVudC5fZG9Qb2ludGVyRXZlbnRDbGltYmluZ1VwIiwiY3ViZWUuQUNvbXBvbmVudC5vblBvaW50ZXJFdmVudENsaW1iaW5nVXAiLCJjdWJlZS5BQ29tcG9uZW50Lm9uUG9pbnRlckV2ZW50RmFsbGluZ0Rvd24iLCJjdWJlZS5BQ29tcG9uZW50Ll9pc0ludGVyc2VjdHNQb2ludCIsImN1YmVlLkFDb21wb25lbnQuaXNQb2ludEludGVyc2VjdHNMaW5lIiwiY3ViZWUuQUNvbXBvbmVudC5Sb3RhdGUiLCJjdWJlZS5BQ29tcG9uZW50LnJvdGF0ZSIsImN1YmVlLkFDb21wb25lbnQuU2NhbGVYIiwiY3ViZWUuQUNvbXBvbmVudC5zY2FsZVgiLCJjdWJlZS5BQ29tcG9uZW50LlNjYWxlWSIsImN1YmVlLkFDb21wb25lbnQuc2NhbGVZIiwiY3ViZWUuQUNvbXBvbmVudC5UcmFuc2Zvcm1DZW50ZXJYIiwiY3ViZWUuQUNvbXBvbmVudC50cmFuc2Zvcm1DZW50ZXJYIiwiY3ViZWUuQUNvbXBvbmVudC5UcmFuc2Zvcm1DZW50ZXJZIiwiY3ViZWUuQUNvbXBvbmVudC50cmFuc2Zvcm1DZW50ZXJZIiwiY3ViZWUuQUNvbXBvbmVudC5Ib3ZlcmVkIiwiY3ViZWUuQUNvbXBvbmVudC5ob3ZlcmVkIiwiY3ViZWUuQUNvbXBvbmVudC5QcmVzc2VkIiwiY3ViZWUuQUNvbXBvbmVudC5wcmVzc2VkIiwiY3ViZWUuQUxheW91dCIsImN1YmVlLkFMYXlvdXQuY29uc3RydWN0b3IiLCJjdWJlZS5BTGF5b3V0LmNoaWxkcmVuX2lubmVyIiwiY3ViZWUuQUxheW91dC5sYXlvdXQiLCJjdWJlZS5BTGF5b3V0Ll9kb1BvaW50ZXJFdmVudENsaW1iaW5nVXAiLCJjdWJlZS5BTGF5b3V0Ll9yb3RhdGVQb2ludCIsImN1YmVlLkFMYXlvdXQuZ2V0Q29tcG9uZW50c0F0UG9zaXRpb24iLCJjdWJlZS5BTGF5b3V0LmdldENvbXBvbmVudHNBdFBvc2l0aW9uX2ltcGwiLCJjdWJlZS5BTGF5b3V0LnNldENoaWxkTGVmdCIsImN1YmVlLkFMYXlvdXQuc2V0Q2hpbGRUb3AiLCJjdWJlZS5BVXNlckNvbnRyb2wiLCJjdWJlZS5BVXNlckNvbnRyb2wuY29uc3RydWN0b3IiLCJjdWJlZS5BVXNlckNvbnRyb2wuX1dpZHRoIiwiY3ViZWUuQVVzZXJDb250cm9sLldpZHRoIiwiY3ViZWUuQVVzZXJDb250cm9sLndpZHRoIiwiY3ViZWUuQVVzZXJDb250cm9sLl9IZWlnaHQiLCJjdWJlZS5BVXNlckNvbnRyb2wuSGVpZ2h0IiwiY3ViZWUuQVVzZXJDb250cm9sLmhlaWdodCIsImN1YmVlLkFVc2VyQ29udHJvbC5fQmFja2dyb3VuZCIsImN1YmVlLkFVc2VyQ29udHJvbC5CYWNrZ3JvdW5kIiwiY3ViZWUuQVVzZXJDb250cm9sLmJhY2tncm91bmQiLCJjdWJlZS5BVXNlckNvbnRyb2wuX1NoYWRvdyIsImN1YmVlLkFVc2VyQ29udHJvbC5TaGFkb3ciLCJjdWJlZS5BVXNlckNvbnRyb2wuc2hhZG93IiwiY3ViZWUuQVVzZXJDb250cm9sLkRyYWdnYWJsZSIsImN1YmVlLkFVc2VyQ29udHJvbC5kcmFnZ2FibGUiLCJjdWJlZS5BVXNlckNvbnRyb2wuX29uQ2hpbGRBZGRlZCIsImN1YmVlLkFVc2VyQ29udHJvbC5fb25DaGlsZFJlbW92ZWQiLCJjdWJlZS5BVXNlckNvbnRyb2wuX29uQ2hpbGRyZW5DbGVhcmVkIiwiY3ViZWUuQVVzZXJDb250cm9sLm9uTGF5b3V0IiwiY3ViZWUuUGFuZWwiLCJjdWJlZS5QYW5lbC5jb25zdHJ1Y3RvciIsImN1YmVlLlBhbmVsLldpZHRoIiwiY3ViZWUuUGFuZWwud2lkdGgiLCJjdWJlZS5QYW5lbC5IZWlnaHQiLCJjdWJlZS5QYW5lbC5oZWlnaHQiLCJjdWJlZS5QYW5lbC5CYWNrZ3JvdW5kIiwiY3ViZWUuUGFuZWwuYmFja2dyb3VuZCIsImN1YmVlLlBhbmVsLlNoYWRvdyIsImN1YmVlLlBhbmVsLnNoYWRvdyIsImN1YmVlLlBhbmVsLmNoaWxkcmVuIiwiY3ViZWUuSEJveCIsImN1YmVlLkhCb3guY29uc3RydWN0b3IiLCJjdWJlZS5IQm94LnNldENlbGxXaWR0aCIsImN1YmVlLkhCb3guZ2V0Q2VsbFdpZHRoIiwiY3ViZWUuSEJveC5zZXRDZWxsSEFsaWduIiwiY3ViZWUuSEJveC5nZXRDZWxsSEFsaWduIiwiY3ViZWUuSEJveC5zZXRDZWxsVkFsaWduIiwiY3ViZWUuSEJveC5nZXRDZWxsVkFsaWduIiwiY3ViZWUuSEJveC5zZXRMYXN0Q2VsbEhBbGlnbiIsImN1YmVlLkhCb3guc2V0TGFzdENlbGxWQWxpZ24iLCJjdWJlZS5IQm94LnNldExhc3RDZWxsV2lkdGgiLCJjdWJlZS5IQm94LmFkZEVtcHR5Q2VsbCIsImN1YmVlLkhCb3guX29uQ2hpbGRBZGRlZCIsImN1YmVlLkhCb3guX29uQ2hpbGRSZW1vdmVkIiwiY3ViZWUuSEJveC5fb25DaGlsZHJlbkNsZWFyZWQiLCJjdWJlZS5IQm94Lm9uTGF5b3V0IiwiY3ViZWUuSEJveC5zZXRJbkxpc3QiLCJjdWJlZS5IQm94LmdldEZyb21MaXN0IiwiY3ViZWUuSEJveC5yZW1vdmVGcm9tTGlzdCIsImN1YmVlLkhCb3guY2hpbGRyZW4iLCJjdWJlZS5IQm94LkhlaWdodCIsImN1YmVlLkhCb3guaGVpZ2h0IiwiY3ViZWUuVkJveCIsImN1YmVlLlZCb3guY29uc3RydWN0b3IiLCJjdWJlZS5WQm94LmNoaWxkcmVuIiwiY3ViZWUuVkJveC5zZXRDZWxsSGVpZ2h0IiwiY3ViZWUuVkJveC5zZXRJbkxpc3QiLCJjdWJlZS5WQm94LmdldEZyb21MaXN0IiwiY3ViZWUuVkJveC5yZW1vdmVGcm9tTGlzdCIsImN1YmVlLlZCb3guZ2V0Q2VsbEhlaWdodCIsImN1YmVlLlZCb3guc2V0Q2VsbEhBbGlnbiIsImN1YmVlLlZCb3guZ2V0Q2VsbEhBbGlnbiIsImN1YmVlLlZCb3guc2V0Q2VsbFZBbGlnbiIsImN1YmVlLlZCb3guZ2V0Q2VsbFZBbGlnbiIsImN1YmVlLlZCb3guc2V0TGFzdENlbGxIQWxpZ24iLCJjdWJlZS5WQm94LnNldExhc3RDZWxsVkFsaWduIiwiY3ViZWUuVkJveC5zZXRMYXN0Q2VsbEhlaWdodCIsImN1YmVlLlZCb3guYWRkRW1wdHlDZWxsIiwiY3ViZWUuVkJveC5XaWR0aCIsImN1YmVlLlZCb3gud2lkdGgiLCJjdWJlZS5WQm94Ll9vbkNoaWxkQWRkZWQiLCJjdWJlZS5WQm94Ll9vbkNoaWxkUmVtb3ZlZCIsImN1YmVlLlZCb3guX29uQ2hpbGRyZW5DbGVhcmVkIiwiY3ViZWUuVkJveC5vbkxheW91dCIsImN1YmVlLkxhYmVsIiwiY3ViZWUuTGFiZWwuY29uc3RydWN0b3IiLCJjdWJlZS5MYWJlbC5XaWR0aCIsImN1YmVlLkxhYmVsLndpZHRoIiwiY3ViZWUuTGFiZWwuSGVpZ2h0IiwiY3ViZWUuTGFiZWwuaGVpZ2h0IiwiY3ViZWUuTGFiZWwuVGV4dCIsImN1YmVlLkxhYmVsLnRleHQiLCJjdWJlZS5MYWJlbC5UZXh0T3ZlcmZsb3ciLCJjdWJlZS5MYWJlbC50ZXh0T3ZlcmZsb3ciLCJjdWJlZS5MYWJlbC5Gb3JlQ29sb3IiLCJjdWJlZS5MYWJlbC5mb3JlQ29sb3IiLCJjdWJlZS5MYWJlbC5WZXJ0aWNhbEFsaWduIiwiY3ViZWUuTGFiZWwudmVydGljYWxBbGlnbiIsImN1YmVlLkxhYmVsLkJvbGQiLCJjdWJlZS5MYWJlbC5ib2xkIiwiY3ViZWUuTGFiZWwuSXRhbGljIiwiY3ViZWUuTGFiZWwuaXRhbGljIiwiY3ViZWUuTGFiZWwuVW5kZXJsaW5lIiwiY3ViZWUuTGFiZWwudW5kZXJsaW5lIiwiY3ViZWUuTGFiZWwuVGV4dEFsaWduIiwiY3ViZWUuTGFiZWwudGV4dEFsaWduIiwiY3ViZWUuTGFiZWwuRm9udFNpemUiLCJjdWJlZS5MYWJlbC5mb250U2l6ZSIsImN1YmVlLkxhYmVsLkZvbnRGYW1pbHkiLCJjdWJlZS5MYWJlbC5mb250RmFtaWx5IiwiY3ViZWUuQVBvcHVwIiwiY3ViZWUuQVBvcHVwLmNvbnN0cnVjdG9yIiwiY3ViZWUuQVBvcHVwLl9fX3BvcHVwUm9vdCIsImN1YmVlLkFQb3B1cC5yb290Q29tcG9uZW50IiwiY3ViZWUuQVBvcHVwLnNob3ciLCJjdWJlZS5BUG9wdXAuY2xvc2UiLCJjdWJlZS5BUG9wdXAuaXNDbG9zZUFsbG93ZWQiLCJjdWJlZS5BUG9wdXAub25DbG9zZWQiLCJjdWJlZS5BUG9wdXAubW9kYWwiLCJjdWJlZS5BUG9wdXAuYXV0b0Nsb3NlIiwiY3ViZWUuQVBvcHVwLmdsYXNzQ29sb3IiLCJjdWJlZS5BUG9wdXAuVHJhbnNsYXRlWCIsImN1YmVlLkFQb3B1cC50cmFuc2xhdGVYIiwiY3ViZWUuQVBvcHVwLlRyYW5zbGF0ZVkiLCJjdWJlZS5BUG9wdXAudHJhbnNsYXRlWSIsImN1YmVlLkFQb3B1cC5DZW50ZXIiLCJjdWJlZS5BUG9wdXAuY2VudGVyIiwiY3ViZWUuQVBvcHVwLl9kb1BvaW50ZXJFdmVudENsaW1iaW5nVXAiLCJjdWJlZS5BUG9wdXAuX2xheW91dCIsImN1YmVlLlBvcHVwcyIsImN1YmVlLlBvcHVwcy5jb25zdHJ1Y3RvciIsImN1YmVlLlBvcHVwcy5fYWRkUG9wdXAiLCJjdWJlZS5Qb3B1cHMuX3JlbW92ZVBvcHVwIiwiY3ViZWUuUG9wdXBzLl9yZXF1ZXN0TGF5b3V0IiwiY3ViZWUuUG9wdXBzLmxheW91dCIsImN1YmVlLlBvcHVwcy5kb1BvaW50ZXJFdmVudENsaW1iaW5nVXAiLCJjdWJlZS5DdWJlZVBhbmVsIiwiY3ViZWUuQ3ViZWVQYW5lbC5jb25zdHJ1Y3RvciIsImN1YmVlLkN1YmVlUGFuZWwuY2hlY2tCb3VuZHMiLCJjdWJlZS5DdWJlZVBhbmVsLnJlcXVlc3RMYXlvdXQiLCJjdWJlZS5DdWJlZVBhbmVsLmxheW91dCIsImN1YmVlLkN1YmVlUGFuZWwucm9vdENvbXBvbmVudCIsImN1YmVlLkN1YmVlUGFuZWwuX2RvUG9pbnRlckV2ZW50Q2xpbWJpbmdVcCIsImN1YmVlLkN1YmVlUGFuZWwuQ2xpZW50V2lkdGgiLCJjdWJlZS5DdWJlZVBhbmVsLmNsaWVudFdpZHRoIiwiY3ViZWUuQ3ViZWVQYW5lbC5DbGllbnRIZWlnaHQiLCJjdWJlZS5DdWJlZVBhbmVsLmNsaWVudEhlaWdodCIsImN1YmVlLkN1YmVlUGFuZWwuQm91bmRzV2lkdGgiLCJjdWJlZS5DdWJlZVBhbmVsLmJvdW5kc1dpZHRoIiwiY3ViZWUuQ3ViZWVQYW5lbC5Cb3VuZHNIZWlnaHQiLCJjdWJlZS5DdWJlZVBhbmVsLmJvdW5kc0hlaWdodCIsImN1YmVlLkN1YmVlUGFuZWwuQm91bmRzTGVmdCIsImN1YmVlLkN1YmVlUGFuZWwuYm91bmRzTGVmdCIsImN1YmVlLkN1YmVlUGFuZWwuQm91bmRzVG9wIiwiY3ViZWUuQ3ViZWVQYW5lbC5ib3VuZHNUb3AiLCJjdWJlZS5BVmlldyIsImN1YmVlLkFWaWV3LmNvbnN0cnVjdG9yIiwiY3ViZWUuQVZpZXcubW9kZWwiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsSUFBTyxLQUFLLENBa1JYO0FBbFJELFdBQU8sS0FBSyxFQUFDLENBQUM7SUFFVkE7UUFDSUMsbUJBQW1CQSxNQUFjQTtZQUFkQyxXQUFNQSxHQUFOQSxNQUFNQSxDQUFRQTtRQUFJQSxDQUFDQTtRQUMxQ0QsZ0JBQUNBO0lBQURBLENBQUNBLEFBRkRELElBRUNBO0lBRllBLGVBQVNBLFlBRXJCQSxDQUFBQTtJQUVEQTtRQUFBRztZQUVZQyxjQUFTQSxHQUF3QkEsRUFBRUEsQ0FBQ0E7UUFvQ2hEQSxDQUFDQTtRQWxDVUQscUJBQUtBLEdBQVpBO1FBQ0FFLENBQUNBO1FBRURGLDJCQUFXQSxHQUFYQSxVQUFZQSxRQUEyQkE7WUFDbkNHLEVBQUVBLENBQUNBLENBQUNBLFFBQVFBLElBQUlBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO2dC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QVFBO1lBQ2xDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxJQUFJQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDMUJBLElBQUlBLENBQUNBLFVBQVVBLEdBQUdBLEtBQUtBLENBQUNBLFdBQVdBLENBQUNBO1lBQ3hDQSxDQUFDQTtZQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxJQUFJQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDekJBLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLEtBQUtBLENBQUNBLFdBQVdBLENBQUNBO1lBQ3ZDQSxDQUFDQTtZQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxJQUFJQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDM0JBLElBQUlBLENBQUNBLFdBQVdBLEdBQUdBLEtBQUtBLENBQUNBLFdBQVdBLENBQUNBO1lBQ3pDQSxDQUFDQTtZQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxJQUFJQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDNUJBLElBQUlBLENBQUNBLFlBQVlBLEdBQUdBLEtBQUtBLENBQUNBLFdBQVdBLENBQUNBO1lBQzFDQSxDQUFDQTtRQUNMQSxDQUFDQTtRQTdCTUQsYUFBTUEsR0FBYkEsVUFBY0EsS0FBYUEsRUFBRUEsS0FBWUEsRUFBRUEsTUFBY0E7WUFDckRFLE1BQU1BLENBQUNBLElBQUlBLE1BQU1BLENBQUNBLEtBQUtBLEVBQUVBLEtBQUtBLEVBQUVBLEtBQUtBLEVBQUVBLEtBQUtBLEVBQUVBLEtBQUtBLEVBQUVBLEtBQUtBLEVBQUVBLEtBQUtBLEVBQUVBLEtBQUtBLEVBQUVBLE1BQU1BLEVBQUVBLE1BQU1BLEVBQUVBLE1BQU1BLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBO1FBQzlHQSxDQUFDQTtRQTZCREYsc0JBQUlBLDZCQUFTQTtpQkFBYkE7Z0JBQ0lHLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFVBQVVB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RUEsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsWUFBWUEsQ0FBQ0E7WUFDcENBLElBQUlBLENBQUNBLG9CQUFvQkEsQ0FBQ0EsS0FBS0EsR0FBR0EsRUFBRUEsQ0FBQ0E7WUFDckNBLElBQUlBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsS0FBS0EsR0FBR0EsRUFBRUEsQ0FBQ0E7WUFHdENBLElBQUlBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7WUFDdkNBLElBQUlBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7WUFFdkNBLElBQUlBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO1lBQ1hBLElBQUlBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO1lBQ1hBLElBQUlBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBO1lBQ1pBLElBQUlBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBO1lBRVpBLElBQUlBLEVBQUVBLEdBQUdBLElBQUlBLGFBQU9BLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO1lBQzNCQSxJQUFJQSxFQUFFQSxHQUFHQSxJQUFJQSxhQUFPQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUM1QkEsSUFBSUEsRUFBRUEsR0FBR0EsSUFBSUEsYUFBT0EsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7WUFDN0JBLElBQUlBLEVBQUVBLEdBQUdBLElBQUlBLGFBQU9BLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO1lBRTVCQSxJQUFJQSxFQUFFQSxHQUFHQSxDQUFDQSxFQUFFQSxHQUFHQSxHQUFHQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUN4QkEsSUFBSUEsRUFBRUEsR0FBR0EsQ0FBQ0EsRUFBRUEsR0FBR0EsR0FBR0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFFeEJBLElBQUlBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBO1lBQzdCQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDYkEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3pDQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDMUNBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO2dCQUMzQ0EsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDOUNBLENBQUNBO1lBRURBLElBQUlBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBO1lBQzVCQSxJQUFJQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUU1QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsR0FBR0EsSUFBSUEsRUFBRUEsSUFBSUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3pCQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQTtnQkFDakRBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO2dCQUNqREEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ2pEQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQTtZQUNyREEsQ0FBQ0E7WUFFREEsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDaEVBLElBQUlBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2hFQSxJQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNoRUEsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDaEVBLEVBQUVBLEdBQUdBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBO1lBQ2pCQSxFQUFFQSxHQUFHQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQTtZQUNqQkEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0E7WUFDVkEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0E7WUFFVkEsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxLQUFLQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUNsQ0EsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxLQUFLQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUNqQ0EsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxLQUFLQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUNuQ0EsSUFBSUEsQ0FBQ0EsbUJBQW1CQSxDQUFDQSxLQUFLQSxHQUFHQSxFQUFFQSxDQUFDQTtRQUN4Q0EsQ0FBQ0E7UUFFRFQsK0JBQVVBLEdBQVZBLFVBQVdBLE9BQWVBLEVBQUVBLE9BQWVBLEVBQUVBLE1BQWNBLEVBQUVBLE1BQWNBLEVBQUVBLE1BQWNBLEVBQUVBLE1BQWNBO1lBQ3ZHVSxJQUFJQSxJQUFJQSxHQUFHQSxDQUFDQSxPQUFPQSxHQUFHQSxDQUFDQSxDQUFDQSxNQUFNQSxHQUFHQSxPQUFPQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUN6REEsSUFBSUEsSUFBSUEsR0FBR0EsQ0FBQ0EsT0FBT0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsR0FBR0EsT0FBT0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDekRBLE1BQU1BLENBQUNBLElBQUlBLGFBQU9BLENBQUNBLElBQUlBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO1FBQ25DQSxDQUFDQTtRQUVPVixnQ0FBV0EsR0FBbkJBLFVBQW9CQSxFQUFVQSxFQUFFQSxFQUFVQSxFQUFFQSxDQUFTQSxFQUFFQSxDQUFTQSxFQUFFQSxLQUFhQTtZQUMzRVcsS0FBS0EsR0FBR0EsQ0FBQ0EsS0FBS0EsR0FBR0EsR0FBR0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDeENBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBO1lBQ1hBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBO1lBQ1hBLElBQUlBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1lBQzFCQSxJQUFJQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtZQUMxQkEsSUFBSUEsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDckNBLElBQUlBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQ3JDQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUNiQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUViQSxNQUFNQSxDQUFDQSxJQUFJQSxhQUFPQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQTtRQUMvQkEsQ0FBQ0E7UUFFRFgsc0JBQUlBLCtCQUFPQTtpQkFBWEE7Z0JBQ0lZLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBO1lBQ3pCQSxDQUFDQTs7O1dBQUFaO1FBRURBLHNCQUFJQSw4QkFBTUE7aUJBQVZBO2dCQUNJYSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQTtZQUN4QkEsQ0FBQ0E7OztXQUFBYjtRQUVNQSwrQkFBVUEsR0FBakJBLFVBQWtCQSxNQUFlQTtZQUM3QmMsSUFBSUEsQ0FBQ0EsT0FBT0EsR0FBR0EsTUFBTUEsQ0FBQ0E7UUFDMUJBLENBQUNBO1FBRURkLDJCQUFNQSxHQUFOQTtZQUNJZSxJQUFJQSxDQUFDQSxZQUFZQSxHQUFHQSxLQUFLQSxDQUFDQTtZQUMxQkEsSUFBSUEsQ0FBQ0EsT0FBT0EsRUFBRUEsQ0FBQ0E7UUFDbkJBLENBQUNBO1FBRURmLHNCQUFJQSxtQ0FBV0E7aUJBQWZBO2dCQUNJZ0IsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0E7WUFDN0JBLENBQUNBOzs7V0FBQWhCO1FBRURBLHNCQUFJQSxrQ0FBVUE7aUJBQWRBO2dCQUNJaUIsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7WUFDNUJBLENBQUNBOzs7V0FBQWpCO1FBQ0RBLHNCQUFJQSxrQ0FBVUE7aUJBQWRBO2dCQUNJa0IsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7WUFDakNBLENBQUNBO2lCQUNEbEIsVUFBZUEsS0FBS0E7Z0JBQ2hCa0IsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0E7WUFDbENBLENBQUNBOzs7V0FIQWxCO1FBS0RBLHNCQUFJQSxrQ0FBVUE7aUJBQWRBO2dCQUNJbUIsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7WUFDNUJBLENBQUNBOzs7V0FBQW5CO1FBQ0RBLHNCQUFJQSxrQ0FBVUE7aUJBQWRBO2dCQUNJb0IsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7WUFDakNBLENBQUNBO2lCQUNEcEIsVUFBZUEsS0FBS0E7Z0JBQ2hCb0IsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0E7WUFDbENBLENBQUNBOzs7V0FIQXBCO1FBMkJEQSxzQkFBSUEsK0JBQU9BO2lCQUFYQTtnQkFDSXFCLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBO1lBQ3pCQSxDQUFDQTs7O1dBQUFyQjtRQUNEQSxzQkFBSUEsK0JBQU9BO2lCQUFYQTtnQkFDSXNCLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBO1lBQzlCQSxDQUFDQTtpQkFDRHRCLFVBQVlBLEtBQUtBO2dCQUNic0IsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0E7WUFDL0JBLENBQUNBOzs7V0FIQXRCO1FBS0RBLHNCQUFJQSw4QkFBTUE7aUJBQVZBO2dCQUNJdUIsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7WUFDeEJBLENBQUNBOzs7V0FBQXZCO1FBQ0RBLHNCQUFJQSw4QkFBTUE7aUJBQVZBO2dCQUNJd0IsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7WUFDN0JBLENBQUNBO2lCQUNEeEIsVUFBV0EsS0FBS0E7Z0JBQ1p3QixJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQTtZQUM5QkEsQ0FBQ0E7OztXQUhBeEI7UUFLREEsc0JBQUlBLHFDQUFhQTtpQkFBakJBO2dCQUNJeUIsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0E7WUFDL0JBLENBQUNBOzs7V0FBQXpCO1FBQ0RBLHNCQUFJQSxxQ0FBYUE7aUJBQWpCQTtnQkFDSTBCLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLEtBQUtBLENBQUNBO1lBQ3BDQSxDQUFDQTtpQkFDRDFCLFVBQWtCQSxLQUFLQTtnQkFDbkIwQixJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQTtZQUNyQ0EsQ0FBQ0E7OztXQUhBMUI7UUFLREEsc0JBQUlBLHNDQUFjQTtpQkFBbEJBO2dCQUNJMkIsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0E7WUFDaENBLENBQUNBOzs7V0FBQTNCO1FBQ0RBLHNCQUFJQSxzQ0FBY0E7aUJBQWxCQTtnQkFDSTRCLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLEtBQUtBLENBQUNBO1lBQ3JDQSxDQUFDQTtpQkFDRDVCLFVBQW1CQSxLQUFLQTtnQkFDcEI0QixJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQTtZQUN0Q0EsQ0FBQ0E7OztXQUhBNUI7UUFLREEsc0JBQUlBLG1DQUFXQTtpQkFBZkE7Z0JBQ0k2QixNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQTtZQUM3QkEsQ0FBQ0E7OztXQUFBN0I7UUFDREEsc0JBQUlBLG1DQUFXQTtpQkFBZkE7Z0JBQ0k4QixNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUNsQ0EsQ0FBQ0E7aUJBQ0Q5QixVQUFnQkEsS0FBS0E7Z0JBQ2pCOEIsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0E7WUFDbkNBLENBQUNBOzs7V0FIQTlCO1FBS0RBLHNCQUFJQSxvQ0FBWUE7aUJBQWhCQTtnQkFDSStCLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBO1lBQzlCQSxDQUFDQTs7O1dBQUEvQjtRQUNEQSxzQkFBSUEsb0NBQVlBO2lCQUFoQkE7Z0JBQ0lnQyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUNuQ0EsQ0FBQ0E7aUJBQ0RoQyxVQUFpQkEsS0FBS0E7Z0JBQ2xCZ0MsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0E7WUFDcENBLENBQUNBOzs7V0FIQWhDO1FBS0RBLHNCQUFJQSxtQ0FBV0E7aUJBQWZBO2dCQUNJaUMsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0E7WUFDN0JBLENBQUNBOzs7V0FBQWpDO1FBQ0RBLHNCQUFJQSxtQ0FBV0E7aUJBQWZBO2dCQUNJa0MsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsS0FBS0EsQ0FBQ0E7WUFDbENBLENBQUNBO2lCQUNEbEMsVUFBZ0JBLEtBQUtBO2dCQUNqQmtDLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBO1lBQ25DQSxDQUFDQTs7O1dBSEFsQztRQUtEQSxzQkFBSUEsb0NBQVlBO2lCQUFoQkE7Z0JBQ0ltQyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQTtZQUM5QkEsQ0FBQ0E7OztXQUFBbkM7UUFDREEsc0JBQUlBLG9DQUFZQTtpQkFBaEJBO2dCQUNJb0MsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7WUFDbkNBLENBQUNBO2lCQUNEcEMsVUFBaUJBLEtBQUtBO2dCQUNsQm9DLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBO1lBQ3BDQSxDQUFDQTs7O1dBSEFwQztRQUtEQSxzQkFBSUEsa0NBQVVBO2lCQUFkQTtnQkFDSXFDLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBO1lBQzVCQSxDQUFDQTs7O1dBQUFyQztRQUNEQSxzQkFBSUEsa0NBQVVBO2lCQUFkQTtnQkFDSXNDLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLEtBQUtBLENBQUNBO1lBQ2pDQSxDQUFDQTtpQkFDRHRDLFVBQWVBLEtBQUtBO2dCQUNoQnNDLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBO1lBQ2xDQSxDQUFDQTs7O1dBSEF0QztRQUtEQSxzQkFBSUEsaUNBQVNBO2lCQUFiQTtnQkFDSXVDLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBO1lBQzNCQSxDQUFDQTs7O1dBQUF2QztRQUNEQSxzQkFBSUEsaUNBQVNBO2lCQUFiQTtnQkFDSXdDLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLEtBQUtBLENBQUNBO1lBQ2hDQSxDQUFDQTtpQkFDRHhDLFVBQWNBLEtBQUtBO2dCQUNmd0MsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0E7WUFDakNBLENBQUNBOzs7V0FIQXhDO1FBS0RBLHNCQUFjQSxnQ0FBUUE7aUJBQXRCQTtnQkFDSXlDLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBO1lBQzFCQSxDQUFDQTs7O1dBQUF6QztRQUNEQSxzQkFBY0EsZ0NBQVFBO2lCQUF0QkE7Z0JBQ0kwQyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUMvQkEsQ0FBQ0E7aUJBQ0QxQyxVQUF1QkEsS0FBS0E7Z0JBQ3hCMEMsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0E7WUFDaENBLENBQUNBOzs7V0FIQTFDO1FBS0RBLHNCQUFjQSxpQ0FBU0E7aUJBQXZCQTtnQkFDSTJDLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBO1lBQzNCQSxDQUFDQTs7O1dBQUEzQztRQUNEQSxzQkFBY0EsaUNBQVNBO2lCQUF2QkE7Z0JBQ0k0QyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUNoQ0EsQ0FBQ0E7aUJBQ0Q1QyxVQUF3QkEsS0FBS0E7Z0JBQ3pCNEMsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0E7WUFDakNBLENBQUNBOzs7V0FIQTVDO1FBS0RBLHNCQUFjQSxnQ0FBUUE7aUJBQXRCQTtnQkFDSTZDLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBO1lBQzFCQSxDQUFDQTs7O1dBQUE3QztRQUNEQSxzQkFBY0EsZ0NBQVFBO2lCQUF0QkE7Z0JBQ0k4QyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUMvQkEsQ0FBQ0E7aUJBQ0Q5QyxVQUF1QkEsS0FBS0E7Z0JBQ3hCOEMsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0E7WUFDaENBLENBQUNBOzs7V0FIQTlDO1FBS0RBLHNCQUFjQSxpQ0FBU0E7aUJBQXZCQTtnQkFDSStDLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBO1lBQzNCQSxDQUFDQTs7O1dBQUEvQztRQUNEQSxzQkFBY0EsaUNBQVNBO2lCQUF2QkE7Z0JBQ0lnRCxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUNoQ0EsQ0FBQ0E7aUJBQ0RoRCxVQUF3QkEsS0FBS0E7Z0JBQ3pCZ0QsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0E7WUFDakNBLENBQUNBOzs7V0FIQWhEO1FBWVNBLGdDQUFXQSxHQUFyQkEsVUFBc0JBLElBQVlBLEVBQUVBLEdBQVdBO1lBQzNDaUQsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsR0FBR0EsRUFBRUEsR0FBR0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0E7WUFDNUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLEdBQUdBLEVBQUVBLEdBQUdBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBO1lBQzFDQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQTtZQUNsQkEsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsR0FBR0EsQ0FBQ0E7UUFDcEJBLENBQUNBO1FBUU1qRCw2QkFBUUEsR0FBZkEsVUFBZ0JBLElBQVlBO1lBQ3hCa0QsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsR0FBR0EsRUFBRUEsR0FBR0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0E7WUFDNUNBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBO1FBQ3RCQSxDQUFDQTtRQVFNbEQsNEJBQU9BLEdBQWRBLFVBQWVBLEdBQVdBO1lBQ3RCbUQsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsR0FBR0EsRUFBRUEsR0FBR0EsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0E7WUFDMUNBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLEdBQUdBLENBQUNBO1FBQ3BCQSxDQUFDQTtRQVNTbkQsNEJBQU9BLEdBQWpCQSxVQUFrQkEsS0FBYUEsRUFBRUEsTUFBY0E7WUFDM0NvRCxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxLQUFLQSxDQUFDQSxLQUFLQSxHQUFHQSxFQUFFQSxHQUFHQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQTtZQUM5Q0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsR0FBR0EsRUFBRUEsR0FBR0EsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFDcERBLENBQUNBO1FBRURwRCxzQkFBSUEsOEJBQU1BO2lCQUFWQTtnQkFDSXFELE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBO1lBQ3hCQSxDQUFDQTs7O1dBQUFyRDtRQUNEQSxzQkFBSUEsOEJBQU1BO2lCQUFWQTtnQkFDSXNELE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO1lBQzdCQSxDQUFDQTtpQkFDRHRELFVBQVdBLEtBQUtBO2dCQUNac0QsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0E7WUFDOUJBLENBQUNBOzs7V0FIQXREO1FBS0RBLHNCQUFJQSwwQ0FBa0JBO2lCQUF0QkE7Z0JBQ0l1RCxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxtQkFBbUJBLENBQUNBO1lBQ3BDQSxDQUFDQTs7O1dBQUF2RDtRQUNEQSxzQkFBSUEsMENBQWtCQTtpQkFBdEJBO2dCQUNJd0QsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUN6Q0EsQ0FBQ0E7aUJBQ0R4RCxVQUF1QkEsS0FBS0E7Z0JBQ3hCd0QsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQTtZQUMxQ0EsQ0FBQ0E7OztXQUhBeEQ7UUFLREEsc0JBQUlBLCtCQUFPQTtpQkFBWEE7Z0JBQ0l5RCxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQTtZQUN6QkEsQ0FBQ0E7OztXQUFBekQ7UUFDREEsc0JBQUlBLCtCQUFPQTtpQkFBWEE7Z0JBQ0kwRCxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUM5QkEsQ0FBQ0E7aUJBQ0QxRCxVQUFZQSxLQUFLQTtnQkFDYjBELElBQUlBLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBO1lBQy9CQSxDQUFDQTs7O1dBSEExRDtRQUtEQSxzQkFBSUEsK0JBQU9BO2lCQUFYQTtnQkFDSTJELE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBO1lBQ3pCQSxDQUFDQTs7O1dBQUEzRDtRQUVEQSxzQkFBSUEscUNBQWFBO2lCQUFqQkE7Z0JBQ0k0RCxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQTtZQUMvQkEsQ0FBQ0E7OztXQUFBNUQ7UUFFREEsc0JBQUlBLG1DQUFXQTtpQkFBZkE7Z0JBQ0k2RCxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQTtZQUM3QkEsQ0FBQ0E7OztXQUFBN0Q7UUFFREEsc0JBQUlBLG1DQUFXQTtpQkFBZkE7Z0JBQ0k4RCxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQTtZQUM3QkEsQ0FBQ0E7OztXQUFBOUQ7UUFFREEsc0JBQUlBLGlDQUFTQTtpQkFBYkE7Z0JBQ0krRCxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQTtZQUMzQkEsQ0FBQ0E7OztXQUFBL0Q7UUFFREEsc0JBQUlBLG9DQUFZQTtpQkFBaEJBO2dCQUNJZ0UsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0E7WUFDOUJBLENBQUNBOzs7V0FBQWhFO1FBRURBLHNCQUFJQSxvQ0FBWUE7aUJBQWhCQTtnQkFDSWlFLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBO1lBQzlCQSxDQUFDQTs7O1dBQUFqRTtRQUVEQSxzQkFBSUEsb0NBQVlBO2lCQUFoQkE7Z0JBQ0lrRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQTtZQUM5QkEsQ0FBQ0E7OztXQUFBbEU7UUFFREEsc0JBQUlBLGlDQUFTQTtpQkFBYkE7Z0JBQ0ltRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQTtZQUMzQkEsQ0FBQ0E7OztXQUFBbkU7UUFFREEsc0JBQUlBLGtDQUFVQTtpQkFBZEE7Z0JBQ0lvRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQTtZQUM1QkEsQ0FBQ0E7OztXQUFBcEU7UUFFREEsc0JBQUlBLCtCQUFPQTtpQkFBWEE7Z0JBQ0lxRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQTtZQUN6QkEsQ0FBQ0E7OztXQUFBckU7UUFFREEsc0JBQUlBLHVDQUFlQTtpQkFBbkJBO2dCQUNJc0UsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQTtZQUNqQ0EsQ0FBQ0E7OztXQUFBdEU7UUFFREEsc0JBQUlBLDZCQUFLQTtpQkFBVEE7Z0JBQ0l1RSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtZQUN2QkEsQ0FBQ0E7OztXQUFBdkU7UUFDREEsc0JBQUlBLDZCQUFLQTtpQkFBVEE7Z0JBQ0l3RSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUM1QkEsQ0FBQ0E7aUJBQ0R4RSxVQUFVQSxLQUFLQTtnQkFDWHdFLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBO1lBQzdCQSxDQUFDQTs7O1dBSEF4RTtRQUtEQSxzQkFBSUEscUNBQWFBO2lCQUFqQkE7Z0JBQ0l5RSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQTtZQUMvQkEsQ0FBQ0E7OztXQUFBekU7UUFDREEsc0JBQUlBLHFDQUFhQTtpQkFBakJBO2dCQUNJMEUsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7WUFDcENBLENBQUNBO2lCQUNEMUUsVUFBa0JBLEtBQUtBO2dCQUNuQjBFLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBO1lBQ3JDQSxDQUFDQTs7O1dBSEExRTtRQUtEQSxzQkFBSUEsK0JBQU9BO2lCQUFYQTtnQkFDSTJFLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBO1lBQ3pCQSxDQUFDQTs7O1dBQUEzRTtRQUNEQSxzQkFBSUEsK0JBQU9BO2lCQUFYQTtnQkFDSTRFLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBO1lBQzlCQSxDQUFDQTtpQkFDRDVFLFVBQVlBLEtBQUtBO2dCQUNiNEUsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0E7WUFDL0JBLENBQUNBOzs7V0FIQTVFO1FBS0RBLHNCQUFJQSxrQ0FBVUE7aUJBQWRBO2dCQUNJNkUsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7WUFDNUJBLENBQUNBOzs7V0FBQTdFO1FBQ0RBLHNCQUFJQSxrQ0FBVUE7aUJBQWRBO2dCQUNJOEUsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7WUFDakNBLENBQUNBO2lCQUNEOUUsVUFBZUEsS0FBS0E7Z0JBQ2hCOEUsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0E7WUFDbENBLENBQUNBOzs7V0FIQTlFO1FBTURBLHNCQUFJQSw0QkFBSUE7aUJBQVJBO2dCQUNJK0UsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7WUFDdEJBLENBQUNBOzs7V0FBQS9FO1FBRURBLHNCQUFJQSwyQkFBR0E7aUJBQVBBO2dCQUNJZ0YsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7WUFDckJBLENBQUNBOzs7V0FBQWhGO1FBdUJEQSw4Q0FBeUJBLEdBQXpCQSxVQUEwQkEsT0FBZUEsRUFBRUEsT0FBZUEsRUFBRUEsQ0FBU0EsRUFBRUEsQ0FBU0EsRUFBRUEsYUFBcUJBLEVBQ25HQSxVQUFtQkEsRUFBRUEsV0FBb0JBLEVBQUVBLFlBQXFCQSxFQUFFQSxXQUFvQkEsRUFDcEZBLFNBQWlCQSxFQUFFQSxNQUFjQSxFQUFFQSxXQUFvQkE7WUFDekRpRixFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDN0JBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO1lBQ2pCQSxDQUFDQTtZQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxtQkFBbUJBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO2dCQUNqQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7WUFDakJBLENBQUNBO1lBQ0RBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO2dCQUN0QkEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7WUFDaEJBLENBQUNBO1lBQ0RBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO2dCQUN2QkEsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7WUFDakJBLENBQUNBO1lBQ0RBLElBQUlBLENBQUNBLHdCQUF3QkEsQ0FBQ0EsT0FBT0EsRUFBRUEsT0FBT0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsYUFBYUEsRUFBRUEsVUFBVUEsRUFDM0VBLFdBQVdBLEVBQUVBLFlBQVlBLEVBQUVBLFdBQVdBLEVBQUVBLFNBQVNBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBO1lBQy9EQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSx5QkFBeUJBLENBQUNBLE9BQU9BLEVBQUVBLE9BQU9BLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLGFBQWFBLEVBQUVBLFVBQVVBLEVBQ25GQSxXQUFXQSxFQUFFQSxZQUFZQSxFQUFFQSxXQUFXQSxFQUFFQSxTQUFTQSxFQUFFQSxNQUFNQSxFQUFFQSxXQUFXQSxDQUFDQSxDQUFDQTtRQUNoRkEsQ0FBQ0E7UUEyQlNqRiw2Q0FBd0JBLEdBQWxDQSxVQUFtQ0EsT0FBZUEsRUFBRUEsT0FBZUEsRUFBRUEsQ0FBU0EsRUFBRUEsQ0FBU0EsRUFBRUEsYUFBcUJBLEVBQzVHQSxVQUFtQkEsRUFBRUEsV0FBb0JBLEVBQUVBLFlBQXFCQSxFQUFFQSxXQUFvQkEsRUFDcEZBLFNBQWlCQSxFQUFFQSxNQUFjQTtZQUNuQ2tGLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO1FBQ2hCQSxDQUFDQTtRQXFCU2xGLDhDQUF5QkEsR0FBbkNBLFVBQW9DQSxPQUFlQSxFQUFFQSxPQUFlQSxFQUFFQSxDQUFTQSxFQUFFQSxDQUFTQSxFQUFFQSxhQUFxQkEsRUFDN0dBLFVBQW1CQSxFQUFFQSxXQUFvQkEsRUFBRUEsWUFBcUJBLEVBQUVBLFdBQW9CQSxFQUN0RkEsU0FBaUJBLEVBQUVBLE1BQWNBLEVBQUVBLFdBQW9CQTtZQUN2RG1GLE1BQU1BLENBQUNBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNoQkEsS0FBS0EsZUFBZUEsQ0FBQ0EsVUFBVUE7b0JBQzNCQSxJQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSx3QkFBa0JBLENBQUNBLE9BQU9BLEVBQUVBLE9BQU9BLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLFVBQVVBLEVBQUVBLFdBQVdBLEVBQzdFQSxZQUFZQSxFQUFFQSxXQUFXQSxFQUFFQSxNQUFNQSxFQUFjQSxXQUFXQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFFdEVBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLFNBQVNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO29CQUNsQ0EsS0FBS0EsQ0FBQ0E7Z0JBQ1ZBLEtBQUtBLGVBQWVBLENBQUNBLFVBQVVBO29CQUMzQkEsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsd0JBQWtCQSxDQUFDQSxPQUFPQSxFQUFFQSxPQUFPQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxVQUFVQSxFQUFFQSxXQUFXQSxFQUM3RUEsWUFBWUEsRUFBRUEsV0FBV0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7b0JBQ3JDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDbENBLEtBQUtBLENBQUNBO2dCQUNWQSxLQUFLQSxlQUFlQSxDQUFDQSxXQUFXQTtvQkFDNUJBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLFNBQVNBLENBQUNBLElBQUlBLGVBQVNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO29CQUNsREEsS0FBS0EsQ0FBQ0E7Z0JBQ1ZBLEtBQUtBLGVBQWVBLENBQUNBLFdBQVdBO29CQUM1QkEsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsZUFBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2xEQSxLQUFLQSxDQUFDQTtnQkFDVkEsS0FBS0EsZUFBZUEsQ0FBQ0EsV0FBV0E7b0JBQzVCQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSx5QkFBbUJBLENBQUNBLGFBQWFBLEVBQUVBLFVBQVVBLEVBQUVBLFdBQVdBLEVBQUVBLFlBQVlBLEVBQ3JHQSxXQUFXQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDeEJBLEtBQUtBLENBQUNBO1lBQ2RBLENBQUNBO1lBQ0RBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO1FBQ2hCQSxDQUFDQTtRQWdCRG5GLHVDQUFrQkEsR0FBbEJBLFVBQW1CQSxDQUFTQSxFQUFFQSxDQUFTQTtZQUVuQ29GLElBQUlBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEtBQUtBLENBQUNBO1lBQzdDQSxJQUFJQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUM1Q0EsSUFBSUEsRUFBRUEsR0FBR0EsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsS0FBS0EsQ0FBQ0E7WUFDeENBLElBQUlBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBO1lBQ1pBLElBQUlBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBO1lBQ1pBLElBQUlBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLEtBQUtBLENBQUNBO1lBQ3pDQSxJQUFJQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUNaQSxJQUFJQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUdaQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxJQUFJQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDNUJBLEVBQUVBLEdBQUdBLENBQUNBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2hGQSxFQUFFQSxHQUFHQSxDQUFDQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxpQkFBaUJBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO2dCQUN0RkEsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0E7Z0JBQ1JBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBO1lBQ1pBLENBQUNBO1lBQ0RBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBLElBQUlBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO2dCQUM1QkEsRUFBRUEsR0FBR0EsQ0FBQ0EsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDaEZBLEVBQUVBLEdBQUdBLENBQUNBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3RGQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQTtnQkFDUkEsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0E7WUFDWkEsQ0FBQ0E7WUFHREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsSUFBSUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3JCQSxJQUFJQSxHQUFHQSxHQUFHQSxDQUFDQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO2dCQUN6REEsSUFBSUEsR0FBR0EsR0FBR0EsQ0FBQ0EsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDekRBLElBQUlBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLEdBQUdBLEdBQUdBLEVBQUVBLEVBQUVBLEdBQUdBLEdBQUdBLEVBQUVBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO2dCQUNqRUEsSUFBSUEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsR0FBR0EsR0FBR0EsRUFBRUEsRUFBRUEsR0FBR0EsR0FBR0EsRUFBRUEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ2pFQSxJQUFJQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxHQUFHQSxHQUFHQSxFQUFFQSxFQUFFQSxHQUFHQSxHQUFHQSxFQUFFQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtnQkFDakVBLElBQUlBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLEdBQUdBLEdBQUdBLEVBQUVBLEVBQUVBLEdBQUdBLEdBQUdBLEVBQUVBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO2dCQUNqRUEsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0E7Z0JBQ2hCQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQTtnQkFDaEJBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBO2dCQUNoQkEsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0E7Z0JBQ2hCQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQTtnQkFDaEJBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBO2dCQUNoQkEsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0E7Z0JBQ2hCQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQTtZQUNwQkEsQ0FBQ0E7WUFFREEsSUFBSUEsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDWkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EscUJBQXFCQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDbkRBLEdBQUdBLEVBQUVBLENBQUNBO1lBQ1ZBLENBQUNBO1lBQ0RBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ25EQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUNWQSxDQUFDQTtZQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxxQkFBcUJBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNuREEsR0FBR0EsRUFBRUEsQ0FBQ0E7WUFDVkEsQ0FBQ0E7WUFDREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EscUJBQXFCQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDbkRBLEdBQUdBLEVBQUVBLENBQUNBO1lBQ1ZBLENBQUNBO1lBQ0RBLE1BQU1BLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLENBQUNBO1FBQ2hDQSxDQUFDQTtRQUVPcEYsMENBQXFCQSxHQUE3QkEsVUFBOEJBLEVBQVVBLEVBQUVBLEVBQVVBLEVBQUVBLEdBQVdBLEVBQUVBLEdBQVdBLEVBQUVBLEdBQVdBLEVBQUVBLEdBQVdBO1lBSXBHcUYsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsRUFBRUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsR0FBR0EsQ0FBQ0EsR0FB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LEFBVkQ1ZSxFQUE4QkEsa0JBQVlBLEVBVXpDQTtJQVZZQSxXQUFLQSxRQVVqQkEsQ0FBQUE7QUFFTEEsQ0FBQ0EsRUFkTSxLQUFLLEtBQUwsS0FBSyxRQWNYIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlIGN1YmVlIHtcblxuICAgIGV4cG9ydCBjbGFzcyBFdmVudEFyZ3Mge1xuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc2VuZGVyOiBPYmplY3QpIHsgfVxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBFdmVudDxUPiB7XG5cbiAgICAgICAgcHJpdmF0ZSBsaXN0ZW5lcnM6IElFdmVudExpc3RlbmVyPFQ+W10gPSBbXTtcblxuICAgICAgICBwdWJsaWMgRXZlbnQoKSB7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRMaXN0ZW5lcihsaXN0ZW5lcjogSUV2ZW50TGlzdGVuZXI8VD4pIHtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgbGlzdGVuZXIgcGFyYW1ldGVyIGNhbiBub3QgYmUgbnVsbC5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzTGlzdGVuZXIobGlzdGVuZXIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZUxpc3RlbmVyKGxpc3RlbmVyOiBJRXZlbnRMaXN0ZW5lcjxUPikge1xuICAgICAgICAgICAgdmFyIGlkeCA9IHRoaXMubGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpO1xuICAgICAgICAgICAgaWYgKGlkeCA8IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVycy5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGhhc0xpc3RlbmVyKGxpc3RlbmVyOiBJRXZlbnRMaXN0ZW5lcjxUPikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpID4gLTE7XG4gICAgICAgIH1cblxuICAgICAgICBmaXJlRXZlbnQoYXJnczogVCkge1xuICAgICAgICAgICAgZm9yICh2YXIgbCBpbiB0aGlzLmxpc3RlbmVycykge1xuICAgICAgICAgICAgICAgIGxldCBsaXN0ZW5lcjogSUV2ZW50TGlzdGVuZXI8VD4gPSBsO1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyKGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgVGltZXIge1xuXG4gICAgICAgIHByaXZhdGUgdG9rZW46IG51bWJlcjtcbiAgICAgICAgcHJpdmF0ZSByZXBlYXQ6IGJvb2xlYW4gPSB0cnVlO1xuICAgICAgICBwcml2YXRlIGFjdGlvbjogeyAoKTogdm9pZCB9ID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mdW5jKCk7XG4gICAgICAgICAgICBpZiAoIXRoaXMucmVwZWF0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b2tlbiA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBmdW5jOiB7ICgpOiB2b2lkIH0pIHtcbiAgICAgICAgICAgIGlmIChmdW5jID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoZSBmdW5jIHBhcmFtZXRlciBjYW4gbm90IGJlIG51bGwuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzdGFydChkZWxheTogbnVtYmVyLCByZXBlYXQ6IGJvb2xlYW4pIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICAgICAgdGhpcy5yZXBlYXQgPSByZXBlYXQ7XG4gICAgICAgICAgICBpZiAodGhpcy5yZXBlYXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRva2VuID0gc2V0SW50ZXJ2YWwodGhpcy5mdW5jLCBkZWxheSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudG9rZW4gPSBzZXRUaW1lb3V0KHRoaXMuZnVuYywgZGVsYXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3RvcCgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnRva2VuICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMudG9rZW4pO1xuICAgICAgICAgICAgICAgIHRoaXMudG9rZW4gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFN0YXJ0ZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b2tlbiAhPSBudWxsO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIElFdmVudExpc3RlbmVyPFQ+IHtcbiAgICAgICAgKGFyZ3M6IFQpOiB2b2lkO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBFdmVudFF1ZXVlIHtcblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogRXZlbnRRdWV1ZSA9IG51bGw7XG5cbiAgICAgICAgc3RhdGljIGdldCBJbnN0YW5jZSgpIHtcbiAgICAgICAgICAgIGlmIChFdmVudFF1ZXVlLmluc3RhbmNlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBFdmVudFF1ZXVlLmluc3RhbmNlID0gbmV3IEV2ZW50UXVldWUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIEV2ZW50UXVldWUuaW5zdGFuY2U7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHF1ZXVlOiB7ICgpOiB2b2lkIH1bXSA9IFtdO1xuICAgICAgICBwcml2YXRlIHRpbWVyOiBUaW1lciA9IG51bGw7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVyID0gbmV3IFRpbWVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgc2l6ZSA9IHRoaXMucXVldWUubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0YXNrOiB7ICgpOiB2b2lkIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXNrID0gdGhpcy5xdWV1ZVswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucXVldWUuc3BsaWNlKDAsIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhc2sgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhc2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzaXplID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlcmUgd2VyZSBzb21lIHRhc2sgdGhhbiB3ZSBuZWVkIHRvIGNoZWNrIGZhc3QgaWYgbW9yZSB0YXNrcyBhcmUgcmVjZWl2ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGltZXIuc3RhcnQoMCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXNuJ3QgYW55IHRhc2sgdGhhbiB3ZSBjYW4gcmVsYXggYSBiaXRcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGltZXIuc3RhcnQoNTAsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudGltZXIuc3RhcnQoMTAsIGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGludm9rZUxhdGVyKHRhc2s6IHsgKCk6IHZvaWQgfSkge1xuICAgICAgICAgICAgaWYgKHRhc2sgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIHRhc2sgY2FuIG5vdCBiZSBudWxsLlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5xdWV1ZS5wdXNoKHRhc2spO1xuICAgICAgICB9XG5cbiAgICAgICAgaW52b2tlUHJpb3IodGFzazogeyAoKTogdm9pZCB9KSB7XG4gICAgICAgICAgICBpZiAodGFzayA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgdGFzayBjYW4gbm90IGJlIG51bGwuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnF1ZXVlLnNwbGljZSgwLCAwLCB0YXNrKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFJ1bk9uY2Uge1xuXG4gICAgICAgIHByaXZhdGUgc2NoZWR1bGVkID0gZmFsc2U7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBmdW5jOiBJUnVubmFibGUpIHtcbiAgICAgICAgICAgIGlmIChmdW5jID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoZSBmdW5jIHBhcmFtZXRlciBjYW4gbm90IGJlIG51bGwuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBydW4oKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zY2hlZHVsZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlZCA9IHRydWU7XG4gICAgICAgICAgICBFdmVudFF1ZXVlLkluc3RhbmNlLmludm9rZUxhdGVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuZnVuYygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgTW91c2VEcmFnRXZlbnRBcmdzIHtcbiAgICAgICAgY29uc3RydWN0b3IoXG4gICAgICAgICAgICBwdWJsaWMgc2NyZWVuWDogbnVtYmVyLFxuICAgICAgICAgICAgcHVibGljIHNjcmVlblk6IG51bWJlcixcbiAgICAgICAgICAgIHB1YmxpYyBkZWx0YVg6IG51bWJlcixcbiAgICAgICAgICAgIHB1YmxpYyBkZWx0YVk6IG51bWJlcixcbiAgICAgICAgICAgIHB1YmxpYyBhbHRQcmVzc2VkOiBib29sZWFuLFxuICAgICAgICAgICAgcHVibGljIGN0cmxQcmVzc2VkOiBib29sZWFuLFxuICAgICAgICAgICAgcHVibGljIHNoaWZ0UHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHB1YmxpYyBtZXRhUHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHB1YmxpYyBzZW5kZXI6IE9iamVjdCkgeyB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIE1vdXNlVXBFdmVudEFyZ3Mge1xuICAgICAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgICAgIHB1YmxpYyBzY3JlZW5YOiBudW1iZXIsXG4gICAgICAgICAgICBwdWJsaWMgc2NyZWVuWTogbnVtYmVyLFxuICAgICAgICAgICAgcHVibGljIGRlbHRhWDogbnVtYmVyLFxuICAgICAgICAgICAgcHVibGljIGRlbHRhWTogbnVtYmVyLFxuICAgICAgICAgICAgcHVibGljIGFsdFByZXNzZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICBwdWJsaWMgY3RybFByZXNzZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICBwdWJsaWMgc2hpZnRQcmVzc2VkOiBib29sZWFuLFxuICAgICAgICAgICAgcHVibGljIG1ldGFQcmVzc2VkOiBib29sZWFuLFxuICAgICAgICAgICAgcHVibGljIGJ1dHRvbjogbnVtYmVyLFxuICAgICAgICAgICAgcHVibGljIG5hdGl2ZUV2ZW50OiBNb3VzZUV2ZW50LFxuICAgICAgICAgICAgcHVibGljIHNlbmRlcjogT2JqZWN0KSB7IH1cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgTW91c2VEb3duRXZlbnRBcmdzIHtcbiAgICAgICAgY29uc3RydWN0b3IoXG4gICAgICAgICAgICBwdWJsaWMgc2NyZWVuWDogbnVtYmVyLFxuICAgICAgICAgICAgcHVibGljIHNjcmVlblk6IG51bWJlcixcbiAgICAgICAgICAgIHB1YmxpYyBkZWx0YVg6IG51bWJlcixcbiAgICAgICAgICAgIHB1YmxpYyBkZWx0YVk6IG51bWJlcixcbiAgICAgICAgICAgIHB1YmxpYyBhbHRQcmVzc2VkOiBib29sZWFuLFxuICAgICAgICAgICAgcHVibGljIGN0cmxQcmVzc2VkOiBib29sZWFuLFxuICAgICAgICAgICAgcHVibGljIHNoaWZ0UHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHB1YmxpYyBtZXRhUHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHB1YmxpYyBidXR0b246IG51bWJlcixcbiAgICAgICAgICAgIHB1YmxpYyBuYXRpdmVFdmVudDogTW91c2VFdmVudCxcbiAgICAgICAgICAgIHB1YmxpYyBzZW5kZXI6IE9iamVjdCkgeyB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIE1vdXNlTW92ZUV2ZW50QXJncyB7XG4gICAgICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICAgICAgcHVibGljIHNjcmVlblg6IG51bWJlcixcbiAgICAgICAgICAgIHB1YmxpYyBzY3JlZW5ZOiBudW1iZXIsXG4gICAgICAgICAgICBwdWJsaWMgeDogbnVtYmVyLFxuICAgICAgICAgICAgcHVibGljIHk6IG51bWJlcixcbiAgICAgICAgICAgIHB1YmxpYyBhbHRQcmVzc2VkOiBib29sZWFuLFxuICAgICAgICAgICAgcHVibGljIGN0cmxQcmVzc2VkOiBib29sZWFuLFxuICAgICAgICAgICAgcHVibGljIHNoaWZ0UHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHB1YmxpYyBtZXRhUHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHB1YmxpYyBzZW5kZXI6IE9iamVjdCkgeyB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIE1vdXNlV2hlZWxFdmVudEFyZ3Mge1xuICAgICAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgICAgIHB1YmxpYyB3aGVlbFZlbG9jaXR5OiBudW1iZXIsXG4gICAgICAgICAgICBwdWJsaWMgYWx0UHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHB1YmxpYyBjdHJsUHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHB1YmxpYyBzaGlmdFByZXNzZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICBwdWJsaWMgbWV0YVByZXNzZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICBwdWJsaWMgc2VuZGVyOiBPYmplY3QpIHsgfVxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBDbGlja0V2ZW50QXJncyB7XG4gICAgICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICAgICAgcHVibGljIHNjcmVlblg6IG51bWJlcixcbiAgICAgICAgICAgIHB1YmxpYyBzY3JlZW5ZOiBudW1iZXIsXG4gICAgICAgICAgICBwdWJsaWMgZGVsdGFYOiBudW1iZXIsXG4gICAgICAgICAgICBwdWJsaWMgZGVsdGFZOiBudW1iZXIsXG4gICAgICAgICAgICBwdWJsaWMgYWx0UHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHB1YmxpYyBjdHJsUHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHB1YmxpYyBzaGlmdFByZXNzZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICBwdWJsaWMgbWV0YVByZXNzZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICBwdWJsaWMgYnV0dG9uOiBudW1iZXIsXG4gICAgICAgICAgICBwdWJsaWMgc2VuZGVyOiBPYmplY3QpIHsgfVxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBLZXlFdmVudEFyZ3Mge1xuICAgICAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgICAgIHB1YmxpYyBrZXlDb2RlOiBudW1iZXIsXG4gICAgICAgICAgICBwdWJsaWMgYWx0UHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHB1YmxpYyBjdHJsUHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgIHB1YmxpYyBzaGlmdFByZXNzZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICBwdWJsaWMgbWV0YVByZXNzZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICBwdWJsaWMgc2VuZGVyOiBPYmplY3QsXG4gICAgICAgICAgICBwdWJsaWMgbmF0aXZlRXZlbnQ6IEtleWJvYXJkRXZlbnRcbiAgICAgICAgKSB7IH1cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgUGFyZW50Q2hhbmdlZEV2ZW50QXJncyBleHRlbmRzIEV2ZW50QXJncyB7XG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuZXdQYXJlbnQ6IEFMYXlvdXQsXG4gICAgICAgICAgICBwdWJsaWMgc2VuZGVyOiBPYmplY3QpIHtcbiAgICAgICAgICAgIHN1cGVyKHNlbmRlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQ29udGV4dE1lbnVFdmVudEFyZ3Mge1xuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmF0aXZlRXZlbnQ6IFVJRXZlbnQsXG4gICAgICAgICAgICBwdWJsaWMgc2VuZGVyOiBPYmplY3QpIHsgfVxuICAgIH1cblxufVxuXG5cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJldmVudHMudHNcIi8+XG5cbm1vZHVsZSBjdWJlZSB7XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIElDaGFuZ2VMaXN0ZW5lciB7XG4gICAgICAgIChzZW5kZXI/OiBPYmplY3QpOiB2b2lkO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSU9ic2VydmFibGUge1xuICAgICAgICBhZGRDaGFuZ2VMaXN0ZW5lcihsaXN0ZW5lcjogSUNoYW5nZUxpc3RlbmVyKTogdm9pZDtcbiAgICAgICAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIobGlzdGVuZXI6IElDaGFuZ2VMaXN0ZW5lcik6IHZvaWQ7XG4gICAgICAgIGhhc0NoYW5nZUxpc3RlbmVyKGxpc3RlbmVyOiBJQ2hhbmdlTGlzdGVuZXIpOiB2b2lkO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSUJpbmRhYmxlPFQ+IHtcbiAgICAgICAgYmluZChzb3VyY2U6IFQpOiB2b2lkO1xuICAgICAgICB1bmJpbmQoKTogdm9pZDtcbiAgICAgICAgaXNCb3VuZCgpOiBib29sZWFuO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSUFuaW1hdGVhYmxlPFQ+IHtcbiAgICAgICAgYW5pbWF0ZShwb3M6IG51bWJlciwgc3RhcnRWYWx1ZTogVCwgZW5kVmFsdWU6IFQpOiBUO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVByb3BlcnR5PFQ+IGV4dGVuZHMgSU9ic2VydmFibGUge1xuICAgICAgICBnZXRPYmplY3RWYWx1ZSgpOiBPYmplY3Q7XG4gICAgICAgIGludmFsaWRhdGUoKTogdm9pZDtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIElWYWxpZGF0b3I8VD4ge1xuICAgICAgICB2YWxpZGF0ZSh2YWx1ZTogVCk6IFQ7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFByb3BlcnR5PFQ+IGltcGxlbWVudHMgSVByb3BlcnR5PFQ+LCBJQW5pbWF0ZWFibGU8VD4sIElCaW5kYWJsZTxJUHJvcGVydHk8VD4+IHtcblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfbmV4dElkID0gMDtcblxuICAgICAgICBwcml2YXRlIF9jaGFuZ2VMaXN0ZW5lcnM6IElDaGFuZ2VMaXN0ZW5lcltdID0gW107XG5cbiAgICAgICAgcHJpdmF0ZSBfdmFsaWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcHJpdmF0ZSBfYmluZGluZ1NvdXJjZTogSVByb3BlcnR5PFQ+O1xuXG4gICAgICAgIHByaXZhdGUgX3JlYWRvbmx5QmluZDogSVByb3BlcnR5PFQ+O1xuICAgICAgICBwcml2YXRlIF9iaWRpcmVjdGlvbmFsQmluZFByb3BlcnR5OiBQcm9wZXJ0eTxUPjtcbiAgICAgICAgcHJpdmF0ZSBfYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyVGhpczogSUNoYW5nZUxpc3RlbmVyO1xuICAgICAgICBwcml2YXRlIF9iaWRpcmVjdGlvbmFsQ2hhbmdlTGlzdGVuZXJPdGhlcjogSUNoYW5nZUxpc3RlbmVyO1xuICAgICAgICBwcml2YXRlIF9pZDogc3RyaW5nID0gXCJwXCIgKyBQcm9wZXJ0eS5fbmV4dElkKys7XG4gICAgICAgIHByaXZhdGUgYmluZExpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmludmFsaWRhdGVJZk5lZWRlZCgpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgY29uc3RydWN0b3IoXG4gICAgICAgICAgICBwcml2YXRlIF92YWx1ZT86IFQsXG4gICAgICAgICAgICBwcml2YXRlIF9udWxsYWJsZTogYm9vbGVhbiA9IHRydWUsXG4gICAgICAgICAgICBwcml2YXRlIF9yZWFkb25seTogYm9vbGVhbiA9IGZhbHNlLFxuICAgICAgICAgICAgcHJpdmF0ZSBfdmFsaWRhdG9yOiBJVmFsaWRhdG9yPFQ+ID0gbnVsbCkge1xuXG4gICAgICAgICAgICBpZiAoX3ZhbHVlID09IG51bGwgJiYgX251bGxhYmxlID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJBIG51bGxhYmxlIHByb3BlcnR5IGNhbiBub3QgYmUgbnVsbC5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX3ZhbHVlICE9IG51bGwgJiYgX3ZhbGlkYXRvciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSBfdmFsaWRhdG9yLnZhbGlkYXRlKF92YWx1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGlkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lkO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHZhbGlkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbGlkO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHZhbHVlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBzZXQgdmFsdWUobmV3VmFsdWU6IFQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0KG5ld1ZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBudWxsYWJsZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9udWxsYWJsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCByZWFkb25seSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZWFkb25seTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXRSZWFkb25seUJpbmQocmVhZG9ubHlCaW5kOiBJUHJvcGVydHk8VD4pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9yZWFkb25seUJpbmQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIHJlYWRvbmx5IGJpbmQgaXMgYWxyZWFkeSBpbml0aWFsaXplZC5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3JlYWRvbmx5QmluZCA9IHJlYWRvbmx5QmluZDtcbiAgICAgICAgICAgIGlmIChyZWFkb25seUJpbmQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJlYWRvbmx5QmluZC5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLmJpbmRMaXN0ZW5lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmludmFsaWRhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgZ2V0KCk6IFQge1xuICAgICAgICAgICAgdGhpcy5fdmFsaWQgPSB0cnVlO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fYmluZGluZ1NvdXJjZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3ZhbGlkYXRvciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl92YWxpZGF0b3IudmFsaWRhdGUoPFQ+dGhpcy5fYmluZGluZ1NvdXJjZS5nZXRPYmplY3RWYWx1ZSgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIDxUPnRoaXMuX2JpbmRpbmdTb3VyY2UuZ2V0T2JqZWN0VmFsdWUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX3JlYWRvbmx5QmluZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3ZhbGlkYXRvciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl92YWxpZGF0b3IudmFsaWRhdGUoPFQ+dGhpcy5fcmVhZG9ubHlCaW5kLmdldE9iamVjdFZhbHVlKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gPFQ+dGhpcy5fcmVhZG9ubHlCaW5kLmdldE9iamVjdFZhbHVlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc2V0KG5ld1ZhbHVlOiBUKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fcmVhZG9ubHkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIkNhbiBub3QgY2hhbmdlIHRoZSB2YWx1ZSBvZiBhIHJlYWRvbmx5IHByb3BlcnR5LlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5pc0JvdW5kKCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIkNhbiBub3QgY2hhbmdlIHRoZSB2YWx1ZSBvZiBhIGJvdW5kIHByb3BlcnR5LlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXRoaXMuX251bGxhYmxlICYmIG5ld1ZhbHVlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIkNhbiBub3Qgc2V0IHRoZSB2YWx1ZSB0byBudWxsIG9mIGEgbm9uIG51bGxhYmxlIHByb3BlcnR5LlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fdmFsaWRhdG9yICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IHRoaXMuX3ZhbGlkYXRvci52YWxpZGF0ZShuZXdWYWx1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl92YWx1ZSA9PSBuZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX3ZhbHVlICE9IG51bGwgJiYgdGhpcy5fdmFsdWUgPT0gbmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW52YWxpZGF0ZSgpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmZpcmVDaGFuZ2VMaXN0ZW5lcnMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGludmFsaWRhdGVJZk5lZWRlZCgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fdmFsaWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmludmFsaWRhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpcmVDaGFuZ2VMaXN0ZW5lcnMoKSB7XG4gICAgICAgICAgICB0aGlzLl9jaGFuZ2VMaXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXIpID0+IHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcih0aGlzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0T2JqZWN0VmFsdWUoKTogT2JqZWN0IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkQ2hhbmdlTGlzdGVuZXIobGlzdGVuZXI6IElDaGFuZ2VMaXN0ZW5lcikge1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVyID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoZSBsaXN0ZW5lciBwYXJhbWV0ZXIgY2FuIG5vdCBiZSBudWxsLlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNDaGFuZ2VMaXN0ZW5lcihsaXN0ZW5lcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2NoYW5nZUxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcblxuICAgICAgICAgICAgLy8gdmFsaWRhdGUgdGhlIGNvbXBvbmVudFxuICAgICAgICAgICAgdGhpcy5nZXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZUNoYW5nZUxpc3RlbmVyKGxpc3RlbmVyOiBJQ2hhbmdlTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHZhciBpZHggPSB0aGlzLl9jaGFuZ2VMaXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcik7XG4gICAgICAgICAgICBpZiAoaWR4IDwgMCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2NoYW5nZUxpc3RlbmVycy5zcGxpY2UoaWR4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGhhc0NoYW5nZUxpc3RlbmVyKGxpc3RlbmVyOiBJQ2hhbmdlTGlzdGVuZXIpOiBib29sZWFuIHtcbiAgICAgICAgICAgIHRoaXMuX2NoYW5nZUxpc3RlbmVycy5mb3JFYWNoKChsKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGwgPT0gbGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBhbmltYXRlKHBvczogbnVtYmVyLCBzdGFydFZhbHVlOiBULCBlbmRWYWx1ZTogVCkge1xuICAgICAgICAgICAgaWYgKHBvcyA8IDAuNSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdGFydFZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZW5kVmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBiaW5kKHNvdXJjZTogSVByb3BlcnR5PFQ+KSB7XG4gICAgICAgICAgICBpZiAoc291cmNlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoZSBzb3VyY2UgY2FuIG5vdCBiZSBudWxsLlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5pc0JvdW5kKCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoaXMgcHJvcGVydHkgaXMgYWxyZWFkeSBib3VuZC5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX3JlYWRvbmx5KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJDYW4ndCBiaW5kIGEgcmVhZG9ubHkgcHJvcGVydHkuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2JpbmRpbmdTb3VyY2UgPSBzb3VyY2U7XG4gICAgICAgICAgICB0aGlzLl9iaW5kaW5nU291cmNlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuYmluZExpc3RlbmVyKTtcbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgYmlkaXJlY3Rpb25hbEJpbmQob3RoZXI6IFByb3BlcnR5PFQ+KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0JvdW5kKCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoaXMgcHJvcGVydHkgaXMgYWxyZWFkeSBib3VuZC5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX3JlYWRvbmx5KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJDYW4ndCBiaW5kIGEgcmVhZG9ubHkgcHJvcGVydHkuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvdGhlciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgb3RoZXIgcGFyYW1ldGVyIGNhbiBub3QgYmUgbnVsbC5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG90aGVyLl9yZWFkb25seSkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiQ2FuIG5vdCBiaW5kIGEgcHJvcGVydHkgYmlkaXJlY3Rpb25hbGx5IHRvIGEgcmVhZG9ubHkgcHJvcGVydHkuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvdGhlciA9PSB0aGlzKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJDYW4gbm90IGJpbmQgYSBwcm9wZXJ0eSBiaWRpcmVjdGlvbmFsbHkgZm9yIHRoZW1zZWxmLlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3RoZXIuaXNCb3VuZCgpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgdGFyZ2V0IHByb3BlcnR5IGlzIGFscmVhZHkgYm91bmQuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2JpZGlyZWN0aW9uYWxCaW5kUHJvcGVydHkgPSBvdGhlcjtcbiAgICAgICAgICAgIHRoaXMuX2JpZGlyZWN0aW9uYWxDaGFuZ2VMaXN0ZW5lck90aGVyID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0KHRoaXMuX2JpZGlyZWN0aW9uYWxCaW5kUHJvcGVydHkuZ2V0KCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3RoZXIuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyT3RoZXIpO1xuICAgICAgICAgICAgdGhpcy5fYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyVGhpcyA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9iaWRpcmVjdGlvbmFsQmluZFByb3BlcnR5LnNldCh0aGlzLmdldCgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyVGhpcyk7XG5cbiAgICAgICAgICAgIG90aGVyLl9iaWRpcmVjdGlvbmFsQmluZFByb3BlcnR5ID0gdGhpcztcbiAgICAgICAgICAgIG90aGVyLl9iaWRpcmVjdGlvbmFsQ2hhbmdlTGlzdGVuZXJPdGhlciA9IHRoaXMuX2JpZGlyZWN0aW9uYWxDaGFuZ2VMaXN0ZW5lclRoaXM7XG4gICAgICAgICAgICBvdGhlci5fYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyVGhpcyA9IHRoaXMuX2JpZGlyZWN0aW9uYWxDaGFuZ2VMaXN0ZW5lck90aGVyO1xuXG4gICAgICAgIH1cblxuICAgICAgICB1bmJpbmQoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fYmluZGluZ1NvdXJjZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmluZGluZ1NvdXJjZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLmJpbmRMaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmluZGluZ1NvdXJjZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNCaWRpcmVjdGlvbmFsQm91bmQoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyVGhpcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmlkaXJlY3Rpb25hbEJpbmRQcm9wZXJ0eS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9iaWRpcmVjdGlvbmFsQ2hhbmdlTGlzdGVuZXJPdGhlcik7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmlkaXJlY3Rpb25hbEJpbmRQcm9wZXJ0eS5fYmlkaXJlY3Rpb25hbEJpbmRQcm9wZXJ0eSA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmlkaXJlY3Rpb25hbEJpbmRQcm9wZXJ0eS5fYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyT3RoZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuX2JpZGlyZWN0aW9uYWxCaW5kUHJvcGVydHkuX2JpZGlyZWN0aW9uYWxDaGFuZ2VMaXN0ZW5lclRoaXMgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuX2JpZGlyZWN0aW9uYWxCaW5kUHJvcGVydHkgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuX2JpZGlyZWN0aW9uYWxDaGFuZ2VMaXN0ZW5lck90aGVyID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLl9iaWRpcmVjdGlvbmFsQ2hhbmdlTGlzdGVuZXJUaGlzID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHVuYmluZFRhcmdldHMoKSB7XG4gICAgICAgICAgICAvLyBUT0RPIG51bGwgYmluZGluZ1NvdXJjZSBvZiB0YXJnZXRzXG4gICAgICAgICAgICB0aGlzLl9jaGFuZ2VMaXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlzQm91bmQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYmluZGluZ1NvdXJjZSAhPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaXNCaWRpcmVjdGlvbmFsQm91bmQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYmlkaXJlY3Rpb25hbEJpbmRQcm9wZXJ0eSAhPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY3JlYXRlUHJvcGVydHlMaW5lKGtleUZyYW1lczogS2V5RnJhbWU8VD5bXSk6IFByb3BlcnR5TGluZTxUPiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb3BlcnR5TGluZTxUPihrZXlGcmFtZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVzdHJveSgpIHtcbiAgICAgICAgICAgIHRoaXMudW5iaW5kKCk7XG4gICAgICAgICAgICB0aGlzLl9jaGFuZ2VMaXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuYmluZExpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEV4cHJlc3Npb248VD4gaW1wbGVtZW50cyBJUHJvcGVydHk8VD4sIElPYnNlcnZhYmxlIHtcblxuICAgICAgICBwcml2YXRlIF9ub3RpZnlMaXN0ZW5lcnNPbmNlID0gbmV3IFJ1bk9uY2UoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5maXJlQ2hhbmdlTGlzdGVuZXJzKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHByaXZhdGUgX2JpbmRpbmdTb3VyY2VzOiBJUHJvcGVydHk8YW55PltdID0gW107XG4gICAgICAgIHByaXZhdGUgX2JpbmRpbmdMaXN0ZW5lcjogSUNoYW5nZUxpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlSWZOZWVkZWQoKTtcbiAgICAgICAgfTtcbiAgICAgICAgcHJpdmF0ZSBfY2hhbmdlTGlzdGVuZXJzOiBJQ2hhbmdlTGlzdGVuZXJbXSA9IFtdO1xuXG4gICAgICAgIHByaXZhdGUgX2Z1bmM6IHsgKCk6IFQgfTtcbiAgICAgICAgcHJpdmF0ZSBfdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgcHJpdmF0ZSBfdmFsdWU6IFQgPSBudWxsO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGZ1bmM6IHsgKCk6IFQgfSwgLi4uYWN0aXZhdG9yczogSVByb3BlcnR5PGFueT5bXSkge1xuICAgICAgICAgICAgaWYgKGZ1bmMgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhlICdmdW5jJyBwYXJhbWV0ZXIgY2FuIG5vdCBiZSBudWxsXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9mdW5jID0gZnVuYztcbiAgICAgICAgICAgIHRoaXMuYmluZC5hcHBseSh0aGlzLCBhY3RpdmF0b3JzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB2YWx1ZSgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fdmFsaWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZSA9IHRoaXMuX2Z1bmMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl92YWxpZCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZENoYW5nZUxpc3RlbmVyKGxpc3RlbmVyOiBJQ2hhbmdlTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgbGlzdGVuZXIgcGFyYW1ldGVyIGNhbiBub3QgYmUgbnVsbC5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzQ2hhbmdlTGlzdGVuZXIobGlzdGVuZXIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9jaGFuZ2VMaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG5cbiAgICAgICAgICAgIGxldCB4ID0gdGhpcy52YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZUNoYW5nZUxpc3RlbmVyKGxpc3RlbmVyOiBJQ2hhbmdlTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuX2NoYW5nZUxpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKTtcbiAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2hhbmdlTGlzdGVuZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9jaGFuZ2VMaXN0ZW5lcnMubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2JpbmRpbmdTb3VyY2VzLmZvckVhY2goKHByb3ApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcC5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9iaW5kaW5nTGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmludmFsaWRhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGhhc0NoYW5nZUxpc3RlbmVyKGxpc3RlbmVyOiBJQ2hhbmdlTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGFuZ2VMaXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcikgPiAtMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldE9iamVjdFZhbHVlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBiaW5kKC4uLnByb3BlcnRpZXM6IElQcm9wZXJ0eTxhbnk+W10pIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMuZm9yRWFjaCgocHJvcCkgPT4ge1xuICAgICAgICAgICAgICAgIHByb3AuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fYmluZGluZ0xpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9iaW5kaW5nU291cmNlcy5wdXNoKHByb3ApO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdW5iaW5kQWxsKCkge1xuICAgICAgICAgICAgdGhpcy5fYmluZGluZ1NvdXJjZXMuZm9yRWFjaCgocHJvcCkgPT4ge1xuICAgICAgICAgICAgICAgIHByb3AucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fYmluZGluZ0xpc3RlbmVyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fYmluZGluZ1NvdXJjZXMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdW5iaW5kKHByb3BlcnR5OiBJUHJvcGVydHk8YW55Pikge1xuICAgICAgICAgICAgcHJvcGVydHkucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fYmluZGluZ0xpc3RlbmVyKTtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuX2JpbmRpbmdTb3VyY2VzLmluZGV4T2YocHJvcGVydHkpO1xuICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9iaW5kaW5nU291cmNlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbnZhbGlkYXRlKCkge1xuICAgICAgICAgICAgdGhpcy5fdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuX25vdGlmeUxpc3RlbmVyc09uY2UucnVuKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbnZhbGlkYXRlSWZOZWVkZWQoKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX3ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGZpcmVDaGFuZ2VMaXN0ZW5lcnMoKSB7XG4gICAgICAgICAgICB0aGlzLl9jaGFuZ2VMaXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXI6IElDaGFuZ2VMaXN0ZW5lcikgPT4ge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyKHRoaXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBLZXlGcmFtZTxUPiB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoXG4gICAgICAgICAgICBwcml2YXRlIF90aW1lOiBudW1iZXIsXG4gICAgICAgICAgICBwcml2YXRlIF9wcm9wZXJ0eTogUHJvcGVydHk8VD4sXG4gICAgICAgICAgICBwcml2YXRlIF9lbmRWYWx1ZTogVCxcbiAgICAgICAgICAgIHByaXZhdGUgX2tleWZyYW1lUmVhY2hlZExpc3RlbmVyOiB7ICgpOiB2b2lkIH0gPSBudWxsLFxuICAgICAgICAgICAgcHJpdmF0ZSBfaW50ZXJwb2xhdG9yOiBJSW50ZXJwb2xhdG9yID0gSW50ZXJwb2xhdG9ycy5MaW5lYXIpIHtcblxuICAgICAgICAgICAgaWYgKF90aW1lIDwgMCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIHRpbWUgcGFyYW1ldGVyIGNhbiBub3QgYmUgc21hbGxlciB0aGFuIHplcm8uXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfcHJvcGVydHkgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIHByb3BlcnR5IHBhcmFtZXRlciBjYW4gbm90IGJlIG51bGwuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoX3Byb3BlcnR5LnJlYWRvbmx5KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJDYW4ndCBhbmltYXRlIGEgcmVhZC1vbmx5IHByb3BlcnR5LlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoX2VuZFZhbHVlID09IG51bGwgJiYgIV9wcm9wZXJ0eS5udWxsYWJsZSkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiQ2FuJ3Qgc2V0IG51bGwgdmFsdWUgdG8gYSBub24gbnVsbGFibGUgcHJvcGVydHkuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfaW50ZXJwb2xhdG9yID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pbnRlcnBvbGF0b3IgPSBJbnRlcnBvbGF0b3JzLkxpbmVhcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB0aW1lKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RpbWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgcHJvcGVydHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcHJvcGVydHlcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBlbmRWYWx1ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9lbmRWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBpbnRlcnBvbGF0b3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faW50ZXJwb2xhdG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGtleUZyYW1lUmVhY2hlZExpc3RlbmVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2tleWZyYW1lUmVhY2hlZExpc3RlbmVyO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgUHJvcGVydHlMaW5lPFQ+IHtcblxuICAgICAgICBwcml2YXRlIF9wcm9wZXJ0eTogUHJvcGVydHk8VD47XG4gICAgICAgIHByaXZhdGUgX3N0YXJ0VGltZTogbnVtYmVyID0gLTE7XG4gICAgICAgIHByaXZhdGUgX2xhc3RSdW5UaW1lOiBudW1iZXIgPSAtMTtcbiAgICAgICAgcHJpdmF0ZSBfcHJldmlvdXNGcmFtZTogS2V5RnJhbWU8VD4gPSBudWxsO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2tleUZyYW1lczogS2V5RnJhbWU8VD5bXSkge1xuICAgICAgICAgICAgdGhpcy5fcHJvcGVydHkgPSBfa2V5RnJhbWVzWzBdLnByb3BlcnR5O1xuICAgICAgICAgICAgdmFyIGZpcnN0RnJhbWU6IEtleUZyYW1lPFQ+ID0gX2tleUZyYW1lc1swXTtcbiAgICAgICAgICAgIGlmIChmaXJzdEZyYW1lLnRpbWUgPiAwKSB7XG4gICAgICAgICAgICAgICAgX2tleUZyYW1lcy5zcGxpY2UoMCwgMCwgbmV3IEtleUZyYW1lKDAsIGZpcnN0RnJhbWUucHJvcGVydHksIGZpcnN0RnJhbWUucHJvcGVydHkudmFsdWUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBzdGFydFRpbWUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhcnRUaW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0IHN0YXJ0VGltZShzdGFydFRpbWU6IG51bWJlcikge1xuICAgICAgICAgICAgdGhpcy5fc3RhcnRUaW1lID0gc3RhcnRUaW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgYW5pbWF0ZSgpIHtcbiAgICAgICAgICAgIHZhciBhY3RUaW1lID0gRGF0ZS5ub3coKTtcblxuICAgICAgICAgICAgaWYgKGFjdFRpbWUgPT0gdGhpcy5fc3RhcnRUaW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbmV4dEZyYW1lOiBLZXlGcmFtZTxUPiA9IG51bGw7XG4gICAgICAgICAgICB2YXIgYWN0RnJhbWU6IEtleUZyYW1lPFQ+ID0gbnVsbDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fa2V5RnJhbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZyYW1lID0gdGhpcy5fa2V5RnJhbWVzW2ldO1xuICAgICAgICAgICAgICAgIHZhciBmcjogS2V5RnJhbWU8VD4gPSBmcmFtZTtcbiAgICAgICAgICAgICAgICBpZiAoYWN0VGltZSA+PSB0aGlzLl9zdGFydFRpbWUgKyBmci50aW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGFjdEZyYW1lID0gZnJhbWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dEZyYW1lID0gZnJhbWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zdGFydFRpbWUgKyBmci50aW1lID4gdGhpcy5fbGFzdFJ1blRpbWUgJiYgdGhpcy5fc3RhcnRUaW1lICsgZnIudGltZSA8PSBhY3RUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmci5rZXlGcmFtZVJlYWNoZWRMaXN0ZW5lciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmci5rZXlGcmFtZVJlYWNoZWRMaXN0ZW5lcigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYWN0RnJhbWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmIChuZXh0RnJhbWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcG9zID0gKChhY3RUaW1lIC0gdGhpcy5fc3RhcnRUaW1lIC0gYWN0RnJhbWUudGltZSkpIC8gKG5leHRGcmFtZS50aW1lIC0gYWN0RnJhbWUudGltZSk7XG4gICAgICAgICAgICAgICAgICAgIGFjdEZyYW1lLnByb3BlcnR5LnZhbHVlID0gYWN0RnJhbWUucHJvcGVydHkuYW5pbWF0ZShwb3MsIGFjdEZyYW1lLmVuZFZhbHVlLCBuZXh0RnJhbWUuZW5kVmFsdWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFjdEZyYW1lLnByb3BlcnR5LnZhbHVlID0gYWN0RnJhbWUuZW5kVmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9sYXN0UnVuVGltZSA9IGFjdFRpbWU7XG5cbiAgICAgICAgICAgIHJldHVybiBhY3RUaW1lID49IHRoaXMuX3N0YXJ0VGltZSArIHRoaXMuX2tleUZyYW1lc1t0aGlzLl9rZXlGcmFtZXMubGVuZ3RoIC0gMV0udGltZTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIElJbnRlcnBvbGF0b3Ige1xuICAgICAgICAodmFsdWU6IG51bWJlcik6IG51bWJlcjtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgSW50ZXJwb2xhdG9ycyB7XG4gICAgICAgIHN0YXRpYyBnZXQgTGluZWFyKCk6IElJbnRlcnBvbGF0b3Ige1xuICAgICAgICAgICAgcmV0dXJuICh2YWx1ZTogbnVtYmVyKTogbnVtYmVyID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnQgYWJzdHJhY3QgY2xhc3MgQUFuaW1hdG9yIHtcblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBhbmltYXRvcnM6IEFBbmltYXRvcltdID0gW107XG4gICAgICAgIHByaXZhdGUgc3RhdGljIEFOSU1BVE9SX1RBU0sgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBBQW5pbWF0b3IuYW5pbWF0ZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHByaXZhdGUgc3RhcnRlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgICAgIHN0YXRpYyBhbmltYXRlKCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IEFBbmltYXRvci5hbmltYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICBpZiAoQUFuaW1hdG9yLmFuaW1hdG9ycy5sZW5ndGggPD0gaSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGFuaW1hdG9yOiBBQW5pbWF0b3IgPSBBQW5pbWF0b3IuYW5pbWF0b3JzW2ldO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdG9yLm9uQW5pbWF0ZSgpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3IENvbnNvbGUoKS5lcnJvcih0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChBQW5pbWF0b3IuYW5pbWF0b3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBFdmVudFF1ZXVlLkluc3RhbmNlLmludm9rZUxhdGVyKEFBbmltYXRvci5BTklNQVRPUl9UQVNLKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXJ0KCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhcnRlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgQUFuaW1hdG9yLmFuaW1hdG9ycy5wdXNoKHRoaXMpO1xuICAgICAgICAgICAgaWYgKEFBbmltYXRvci5hbmltYXRvcnMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICBFdmVudFF1ZXVlLkluc3RhbmNlLmludm9rZUxhdGVyKEFBbmltYXRvci5BTklNQVRPUl9UQVNLKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc3RhcnRlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXJ0ZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICB2YXIgaWR4ID0gQUFuaW1hdG9yLmFuaW1hdG9ycy5pbmRleE9mKHRoaXMpO1xuICAgICAgICAgICAgQUFuaW1hdG9yLmFuaW1hdG9ycy5zcGxpY2UoaWR4LCAxKVxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFN0YXJ0ZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdGFydGVkO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFN0b3BwZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gIXRoaXMuc3RhcnRlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBhYnN0cmFjdCBvbkFuaW1hdGUoKTogdm9pZDtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgVGltZWxpbmUgZXh0ZW5kcyBBQW5pbWF0b3Ige1xuXG5cbiAgICAgICAgcHJpdmF0ZSBwcm9wZXJ0eUxpbmVzOiBQcm9wZXJ0eUxpbmU8YW55PltdID0gW107XG4gICAgICAgIHByaXZhdGUgcmVwZWF0Q291bnQgPSAwO1xuICAgICAgICBwcml2YXRlIGZpbmlzaGVkRXZlbnQ6IEV2ZW50PFRpbWVsaW5lRmluaXNoZWRFdmVudEFyZ3M+ID0gbmV3IEV2ZW50PFRpbWVsaW5lRmluaXNoZWRFdmVudEFyZ3M+KCk7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBrZXlGcmFtZXM6IEtleUZyYW1lPGFueT5bXSkge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNyZWF0ZVByb3BlcnR5TGluZXMoKSB7XG4gICAgICAgICAgICB2YXIgcGxNYXA6IHsgW2tleTogc3RyaW5nXTogS2V5RnJhbWU8YW55PltdIH0gPSB7fTtcbiAgICAgICAgICAgIHZhciBrZXlzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmtleUZyYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBrZXlGcmFtZSA9IHRoaXMua2V5RnJhbWVzW2ldO1xuICAgICAgICAgICAgICAgIGxldCBrZjogS2V5RnJhbWU8YW55PiA9IGtleUZyYW1lO1xuICAgICAgICAgICAgICAgIGxldCBwcm9wZXJ0eUxpbmUgPSBwbE1hcFtrZi5wcm9wZXJ0eS5pZF07XG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5TGluZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5TGluZSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBwbE1hcFtrZi5wcm9wZXJ0eS5pZF0gPSBwcm9wZXJ0eUxpbmU7XG4gICAgICAgICAgICAgICAgICAgIGtleXMucHVzaChrZi5wcm9wZXJ0eS5pZClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5TGluZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eUxpbmVbcHJvcGVydHlMaW5lLmxlbmd0aCAtIDFdLnRpbWUgPj0ga2YudGltZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUga2V5ZnJhbWVzIG11c3QgYmUgaW4gYXNjZW5kaW5nIHRpbWUgb3JkZXIgcGVyIHByb3BlcnR5LlwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHByb3BlcnR5TGluZS5wdXNoKGtleUZyYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGtleXMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHByb3BlcnR5TGluZTogUHJvcGVydHlMaW5lPGFueT4gPSBwbE1hcFtrZXldWzBdLnByb3BlcnR5LmNyZWF0ZVByb3BlcnR5TGluZShwbE1hcFtrZXldKTtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnR5TGluZXMucHVzaChwcm9wZXJ0eUxpbmUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGFydChyZXBlYXRDb3VudDogbnVtYmVyID0gMCkge1xuICAgICAgICAgICAgaWYgKHJlcGVhdENvdW50ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXBlYXRDb3VudCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXBlYXRDb3VudCA9IHJlcGVhdENvdW50IHwgMDtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUHJvcGVydHlMaW5lcygpO1xuICAgICAgICAgICAgdGhpcy5yZXBlYXRDb3VudCA9IHJlcGVhdENvdW50O1xuICAgICAgICAgICAgdmFyIHN0YXJ0VGltZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgICB0aGlzLnByb3BlcnR5TGluZXMuZm9yRWFjaCgocHJvcGVydHlMaW5lKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHBsOiBQcm9wZXJ0eUxpbmU8YW55PiA9IHByb3BlcnR5TGluZTtcbiAgICAgICAgICAgICAgICBwbC5zdGFydFRpbWUgPSBzdGFydFRpbWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLlN0YXJ0ZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdXBlci5zdG9wKCk7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaGVkRXZlbnQuZmlyZUV2ZW50KG5ldyBUaW1lbGluZUZpbmlzaGVkRXZlbnRBcmdzKHRydWUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9uQW5pbWF0ZSgpIHtcbiAgICAgICAgICAgIHZhciBmaW5pc2hlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnByb3BlcnR5TGluZXMuZm9yRWFjaCgocHJvcGVydHlMaW5lKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHBsOiBQcm9wZXJ0eUxpbmU8YW55PiA9IHByb3BlcnR5TGluZTtcbiAgICAgICAgICAgICAgICBmaW5pc2hlZCA9IGZpbmlzaGVkICYmIHBsLmFuaW1hdGUoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoZmluaXNoZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yZXBlYXRDb3VudCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN0YXJ0VGltZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydHlMaW5lcy5mb3JFYWNoKChwcm9wZXJ0eUxpbmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwbDogUHJvcGVydHlMaW5lPGFueT4gPSBwcm9wZXJ0eUxpbmU7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbC5zdGFydFRpbWUgPSBzdGFydFRpbWU7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVwZWF0Q291bnQtLTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucmVwZWF0Q291bnQgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHN0YXJ0VGltZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnR5TGluZXMuZm9yRWFjaCgocHJvcGVydHlMaW5lKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBsOiBQcm9wZXJ0eUxpbmU8YW55PiA9IHByb3BlcnR5TGluZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbC5zdGFydFRpbWUgPSBzdGFydFRpbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1cGVyLnN0b3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmluaXNoZWRFdmVudC5maXJlRXZlbnQobmV3IFRpbWVsaW5lRmluaXNoZWRFdmVudEFyZ3MoZmFsc2UpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG9uRmluaXNoZWRFdmVudCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbmlzaGVkRXZlbnQ7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBUaW1lbGluZUZpbmlzaGVkRXZlbnRBcmdzIHtcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBzdG9wcGVkOiBib29sZWFuID0gZmFsc2UpIHtcblxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFN0b3BwZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdG9wcGVkO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIE51bWJlclByb3BlcnR5IGV4dGVuZHMgUHJvcGVydHk8bnVtYmVyPiB7XG5cbiAgICAgICAgYW5pbWF0ZShwb3M6IG51bWJlciwgc3RhcnRWYWx1ZTogbnVtYmVyLCBlbmRWYWx1ZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgICAgIHJldHVybiBzdGFydFZhbHVlICsgKChlbmRWYWx1ZSAtIHN0YXJ0VmFsdWUpICogcG9zKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFN0cmluZ1Byb3BlcnR5IGV4dGVuZHMgUHJvcGVydHk8c3RyaW5nPiB7XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgUGFkZGluZ1Byb3BlcnR5IGV4dGVuZHMgUHJvcGVydHk8UGFkZGluZz4ge1xuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEJvcmRlclByb3BlcnR5IGV4dGVuZHMgUHJvcGVydHk8Qm9yZGVyPiB7XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQmFja2dyb3VuZFByb3BlcnR5IGV4dGVuZHMgUHJvcGVydHk8QUJhY2tncm91bmQ+IHtcblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBCb29sZWFuUHJvcGVydHkgZXh0ZW5kcyBQcm9wZXJ0eTxib29sZWFuPiB7XG5cbiAgICB9XG4gICAgXG4gICAgZXhwb3J0IGNsYXNzIENvbG9yUHJvcGVydHkgZXh0ZW5kcyBQcm9wZXJ0eTxDb2xvcj4ge1xuXG4gICAgfVxuXG59XG5cblxuIiwiXG5cbm1vZHVsZSBjdWJlZSB7XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIElTdHlsZSB7XG5cbiAgICAgICAgYXBwbHkoZWxlbWVudDogSFRNTEVsZW1lbnQpOiB2b2lkO1xuXG4gICAgfVxuXG4gICAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFCYWNrZ3JvdW5kIGltcGxlbWVudHMgSVN0eWxlIHtcblxuICAgICAgICBhYnN0cmFjdCBhcHBseShlbGVtZW50OiBIVE1MRWxlbWVudCk6IHZvaWQ7XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQ29sb3Ige1xuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9UUkFOU1BBUkVOVCA9IENvbG9yLmdldEFyZ2JDb2xvcigweDAwMDAwMDAwKTtcbiAgICAgICAgc3RhdGljIGdldCBUUkFOU1BBUkVOVCgpIHtcbiAgICAgICAgICAgIHJldHVybiBDb2xvci5fVFJBTlNQQVJFTlQ7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQkxBQ0sgPSBDb2xvci5nZXRBcmdiQ29sb3IoMHhmZjAwMDAwMCk7XG4gICAgICAgIHN0YXRpYyBnZXQgQkxBQ0soKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29sb3IuX0JMQUNLO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBnZXRBcmdiQ29sb3IoYXJnYjogbnVtYmVyKTogQ29sb3Ige1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb2xvcihhcmdiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZ2V0QXJnYkNvbG9yQnlDb21wb25lbnRzKGFscGhhOiBudW1iZXIsIHJlZDogbnVtYmVyLCBncmVlbjogbnVtYmVyLCBibHVlOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGFscGhhID0gdGhpcy5maXhDb21wb25lbnQoYWxwaGEpO1xuICAgICAgICAgICAgcmVkID0gdGhpcy5maXhDb21wb25lbnQocmVkKTtcbiAgICAgICAgICAgIGdyZWVuID0gdGhpcy5maXhDb21wb25lbnQoZ3JlZW4pO1xuICAgICAgICAgICAgYmx1ZSA9IHRoaXMuZml4Q29tcG9uZW50KGJsdWUpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRBcmdiQ29sb3IoXG4gICAgICAgICAgICAgICAgYWxwaGEgPDwgMjRcbiAgICAgICAgICAgICAgICB8IHJlZCA8PCAxNlxuICAgICAgICAgICAgICAgIHwgZ3JlZW4gPDwgOFxuICAgICAgICAgICAgICAgIHwgYmx1ZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZ2V0UmdiQ29sb3IocmdiOiBudW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEFyZ2JDb2xvcihyZ2IgfCAweGZmMDAwMDAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZ2V0UmdiQ29sb3JCeUNvbXBvbmVudHMocmVkOiBudW1iZXIsIGdyZWVuOiBudW1iZXIsIGJsdWU6IG51bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QXJnYkNvbG9yQnlDb21wb25lbnRzKDI1NSwgcmVkLCBncmVlbiwgYmx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBmaXhDb21wb25lbnQoY29tcG9uZW50OiBudW1iZXIpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudCA9IGNvbXBvbmVudCB8IDA7XG4gICAgICAgICAgICBpZiAoY29tcG9uZW50IDwgMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY29tcG9uZW50ID4gMjU1KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDI1NTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZmFkZUNvbG9ycyhzdGFydENvbG9yOiBDb2xvciwgZW5kQ29sb3I6IENvbG9yLCBmYWRlUG9zaXRpb246IG51bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIENvbG9yLmdldEFyZ2JDb2xvckJ5Q29tcG9uZW50cyhcbiAgICAgICAgICAgICAgICB0aGlzLm1peENvbXBvbmVudChzdGFydENvbG9yLmFscGhhLCBlbmRDb2xvci5hbHBoYSwgZmFkZVBvc2l0aW9uKSxcbiAgICAgICAgICAgICAgICB0aGlzLm1peENvbXBvbmVudChzdGFydENvbG9yLnJlZCwgZW5kQ29sb3IucmVkLCBmYWRlUG9zaXRpb24pLFxuICAgICAgICAgICAgICAgIHRoaXMubWl4Q29tcG9uZW50KHN0YXJ0Q29sb3IuZ3JlZW4sIGVuZENvbG9yLmdyZWVuLCBmYWRlUG9zaXRpb24pLFxuICAgICAgICAgICAgICAgIHRoaXMubWl4Q29tcG9uZW50KHN0YXJ0Q29sb3IuYmx1ZSwgZW5kQ29sb3IuYmx1ZSwgZmFkZVBvc2l0aW9uKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIG1peENvbXBvbmVudChzdGFydFZhbHVlOiBudW1iZXIsIGVuZFZhbHVlOiBudW1iZXIsIHBvczogbnVtYmVyKSB7XG4gICAgICAgICAgICB2YXIgcmVzID0gKHN0YXJ0VmFsdWUgKyAoKGVuZFZhbHVlIC0gc3RhcnRWYWx1ZSkgKiBwb3MpKSB8IDA7XG4gICAgICAgICAgICByZXMgPSB0aGlzLmZpeENvbXBvbmVudChyZXMpO1xuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX2FyZ2IgPSAwO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGFyZ2I6IG51bWJlcikge1xuICAgICAgICAgICAgYXJnYiA9IGFyZ2IgfCAwO1xuICAgICAgICAgICAgdGhpcy5fYXJnYiA9IGFyZ2I7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgYXJnYigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hcmdiO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGFscGhhKCkge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLl9hcmdiID4+PiAyNCkgJiAweGZmO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHJlZCgpIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5fYXJnYiA+Pj4gMTYpICYgMHhmZjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBncmVlbigpIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5fYXJnYiA+Pj4gOCkgJiAweGZmO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGJsdWUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYXJnYiAmIDB4ZmY7XG4gICAgICAgIH1cblxuICAgICAgICBmYWRlKGZhZGVDb2xvcjogQ29sb3IsIGZhZGVQb3NpdGlvbjogbnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29sb3IuZmFkZUNvbG9ycyh0aGlzLCBmYWRlQ29sb3IsIGZhZGVQb3NpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICB0b0NTUygpIHtcbiAgICAgICAgICAgIHJldHVybiBcInJnYmEoXCIgKyB0aGlzLnJlZCArIFwiLCBcIiArIHRoaXMuZ3JlZW4gKyBcIiwgXCIgKyB0aGlzLmJsdWUgKyBcIiwgXCIgKyAodGhpcy5hbHBoYSAvIDI1NS4wKSArIFwiKVwiO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQ29sb3JCYWNrZ3JvdW5kIGV4dGVuZHMgQUJhY2tncm91bmQge1xuXG4gICAgICAgIHByaXZhdGUgX2NvbG9yOiBDb2xvciA9IG51bGw7XG4gICAgICAgIHByaXZhdGUgX2NhY2hlOiBzdHJpbmcgPSBudWxsO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNvbG9yOiBDb2xvcikge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgICAgIHRoaXMuX2NvbG9yID0gY29sb3I7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgY29sb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY29sb3I7XG4gICAgICAgIH1cblxuICAgICAgICBhcHBseShlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2NhY2hlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuX2NhY2hlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY29sb3IgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYmFja2dyb3VuZENvbG9yXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlID0gdGhpcy5fY29sb3IudG9DU1MoKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLl9jYWNoZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBQYWRkaW5nIGltcGxlbWVudHMgSVN0eWxlIHtcblxuICAgICAgICBzdGF0aWMgY3JlYXRlKHBhZGRpbmc6IG51bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQYWRkaW5nKHBhZGRpbmcsIHBhZGRpbmcsIHBhZGRpbmcsIHBhZGRpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IoXG4gICAgICAgICAgICBwcml2YXRlIF9sZWZ0OiBudW1iZXIsXG4gICAgICAgICAgICBwcml2YXRlIF90b3A6IG51bWJlcixcbiAgICAgICAgICAgIHByaXZhdGUgX3JpZ2h0OiBudW1iZXIsXG4gICAgICAgICAgICBwcml2YXRlIF9ib3R0b206IG51bWJlcikgeyB9XG5cbiAgICAgICAgZ2V0IGxlZnQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbGVmdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB0b3AoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdG9wO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHJpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGJvdHRvbSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib3R0b207XG4gICAgICAgIH1cblxuICAgICAgICBhcHBseShlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5wYWRkaW5nTGVmdCA9IHRoaXMuX2xlZnQgKyBcInB4XCI7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLnBhZGRpbmdUb3AgPSB0aGlzLl90b3AgKyBcInB4XCI7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLnBhZGRpbmdSaWdodCA9IHRoaXMuX3JpZ2h0ICsgXCJweFwiO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5wYWRkaW5nQm90dG9tID0gdGhpcy5fYm90dG9tICsgXCJweFwiO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQm9yZGVyIGltcGxlbWVudHMgSVN0eWxlIHtcblxuICAgICAgICBzdGF0aWMgY3JlYXRlKHdpZHRoOiBudW1iZXIsIGNvbG9yOiBDb2xvciwgcmFkaXVzOiBudW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQm9yZGVyKHdpZHRoLCB3aWR0aCwgd2lkdGgsIHdpZHRoLCBjb2xvciwgY29sb3IsIGNvbG9yLCBjb2xvciwgcmFkaXVzLCByYWRpdXMsIHJhZGl1cywgcmFkaXVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICAgICAgcHJpdmF0ZSBfbGVmdFdpZHRoOiBudW1iZXIsXG4gICAgICAgICAgICBwcml2YXRlIF90b3BXaWR0aDogbnVtYmVyLFxuICAgICAgICAgICAgcHJpdmF0ZSBfcmlnaHRXaWR0aDogbnVtYmVyLFxuICAgICAgICAgICAgcHJpdmF0ZSBfYm90dG9tV2lkdGg6IG51bWJlcixcbiAgICAgICAgICAgIHByaXZhdGUgX2xlZnRDb2xvcjogQ29sb3IsXG4gICAgICAgICAgICBwcml2YXRlIF90b3BDb2xvcjogQ29sb3IsXG4gICAgICAgICAgICBwcml2YXRlIF9yaWdodENvbG9yOiBDb2xvcixcbiAgICAgICAgICAgIHByaXZhdGUgX2JvdHRvbUNvbG9yOiBDb2xvcixcbiAgICAgICAgICAgIHByaXZhdGUgX3RvcExlZnRSYWRpdXM6IG51bWJlcixcbiAgICAgICAgICAgIHByaXZhdGUgX3RvcFJpZ2h0UmFkaXVzOiBudW1iZXIsXG4gICAgICAgICAgICBwcml2YXRlIF9ib3R0b21MZWZ0UmFkaXVzOiBudW1iZXIsXG4gICAgICAgICAgICBwcml2YXRlIF9ib3R0b21SaWdodFJhZGl1czogbnVtYmVyKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fbGVmdENvbG9yID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sZWZ0Q29sb3IgPSBDb2xvci5UUkFOU1BBUkVOVDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLl90b3BDb2xvciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdG9wQ29sb3IgPSBDb2xvci5UUkFOU1BBUkVOVDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLl9yaWdodENvbG9yID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yaWdodENvbG9yID0gQ29sb3IuVFJBTlNQQVJFTlQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5fYm90dG9tQ29sb3IgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2JvdHRvbUNvbG9yID0gQ29sb3IuVFJBTlNQQVJFTlQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgbGVmdFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xlZnRXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdG9wV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdG9wV2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHJpZ2h0V2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmlnaHRXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm90dG9tV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYm90dG9tV2lkdGg7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgbGVmdENvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xlZnRDb2xvcjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdG9wQ29sb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdG9wQ29sb3I7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHJpZ2h0Q29sb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmlnaHRDb2xvcjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm90dG9tQ29sb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYm90dG9tQ29sb3I7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgdG9wTGVmdFJhZGl1cygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90b3BMZWZ0UmFkaXVzO1xuICAgICAgICB9XG4gICAgICAgIGdldCB0b3BSaWdodFJhZGl1cygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90b3BSaWdodFJhZGl1cztcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm90dG9tTGVmdFJhZGl1cygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib3R0b21MZWZ0UmFkaXVzO1xuICAgICAgICB9XG4gICAgICAgIGdldCBib3R0b21SaWdodFJhZGl1cygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib3R0b21SaWdodFJhZGl1cztcbiAgICAgICAgfVxuXG4gICAgICAgIGFwcGx5KGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJvcmRlclN0eWxlID0gXCJzb2xpZFwiO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5ib3JkZXJMZWZ0Q29sb3IgPSB0aGlzLl9sZWZ0Q29sb3IudG9DU1MoKTtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuYm9yZGVyTGVmdFdpZHRoID0gdGhpcy5fbGVmdFdpZHRoICsgXCJweFwiO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5ib3JkZXJUb3BDb2xvciA9IHRoaXMuX3RvcENvbG9yLnRvQ1NTKCk7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJvcmRlclRvcFdpZHRoID0gdGhpcy5fdG9wV2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJvcmRlclJpZ2h0Q29sb3IgPSB0aGlzLl9yaWdodENvbG9yLnRvQ1NTKCk7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJvcmRlclJpZ2h0V2lkdGggPSB0aGlzLl9yaWdodFdpZHRoICsgXCJweFwiO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5ib3JkZXJCb3R0b21Db2xvciA9IHRoaXMuX2JvdHRvbUNvbG9yLnRvQ1NTKCk7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJvcmRlckJvdHRvbVdpZHRoID0gdGhpcy5fYm90dG9tV2lkdGggKyBcInB4XCI7XG5cbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuYm9yZGVyVG9wTGVmdFJhZGl1cyA9IHRoaXMuX3RvcExlZnRSYWRpdXMgKyBcInB4XCI7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJvcmRlclRvcFJpZ2h0UmFkaXVzID0gdGhpcy5fdG9wUmlnaHRSYWRpdXMgKyBcInB4XCI7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJvcmRlckJvdHRvbUxlZnRSYWRpdXMgPSB0aGlzLl9ib3R0b21MZWZ0UmFkaXVzICsgXCJweFwiO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5ib3JkZXJCb3R0b21SaWdodFJhZGl1cyA9IHRoaXMuX2JvdHRvbVJpZ2h0UmFkaXVzICsgXCJweFwiO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQm94U2hhZG93IGltcGxlbWVudHMgSVN0eWxlIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgICAgIHByaXZhdGUgX2hQb3M6IG51bWJlcixcbiAgICAgICAgICAgIHByaXZhdGUgX3ZQb3M6IG51bWJlcixcbiAgICAgICAgICAgIHByaXZhdGUgX2JsdXI6IG51bWJlcixcbiAgICAgICAgICAgIHByaXZhdGUgX3NwcmVhZDogbnVtYmVyLFxuICAgICAgICAgICAgcHJpdmF0ZSBfY29sb3I6IENvbG9yLFxuICAgICAgICAgICAgcHJpdmF0ZSBfaW5uZXI6IGJvb2xlYW4pIHsgfVxuXG4gICAgICAgIGdldCBoUG9zKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hQb3M7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgdlBvcygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92UG9zO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGJsdXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYmx1cjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBzcHJlYWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3ByZWFkO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGNvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGlubmVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lubmVyO1xuICAgICAgICB9XG5cbiAgICAgICAgYXBwbHkoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuYm94U2hhZG93ID0gdGhpcy5faFBvcyArIFwicHggXCIgKyB0aGlzLl92UG9zICsgXCJweCBcIiArIHRoaXMuX2JsdXIgKyBcInB4IFwiICsgdGhpcy5fc3ByZWFkICsgXCJweCBcIlxuICAgICAgICAgICAgKyB0aGlzLl9jb2xvci50b0NTUygpICsgKHRoaXMuX2lubmVyID8gXCIgaW5zZXRcIiA6IFwiXCIpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRVRleHRPdmVyZmxvdyBpbXBsZW1lbnRzIElTdHlsZSB7XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0NMSVAgPSBuZXcgRVRleHRPdmVyZmxvdyhcImNsaXBcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9FTExJUFNJUyA9IG5ldyBFVGV4dE92ZXJmbG93KFwiZWxsaXBzaXNcIik7XG5cbiAgICAgICAgc3RhdGljIGdldCBDTElQKCkge1xuICAgICAgICAgICAgcmV0dXJuIEVUZXh0T3ZlcmZsb3cuX0NMSVA7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0aWMgZ2V0IEVMTElQU0lTKCkge1xuICAgICAgICAgICAgcmV0dXJuIEVUZXh0T3ZlcmZsb3cuX0VMTElQU0lTO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBfY3NzOiBzdHJpbmcpIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBDU1MoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY3NzO1xuICAgICAgICB9XG5cbiAgICAgICAgYXBwbHkoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudGV4dE92ZXJmbG93ID0gdGhpcy5fY3NzO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRVRleHRBbGlnbiBpbXBsZW1lbnRzIElTdHlsZSB7XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0xFRlQgPSBuZXcgRVRleHRBbGlnbihcImxlZnRcIik7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9DRU5URVIgPSBuZXcgRVRleHRBbGlnbihcImNlbnRlclwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1JJR0hUID0gbmV3IEVUZXh0QWxpZ24oXCJyaWdodFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0pVU1RJRlkgPSBuZXcgRVRleHRBbGlnbihcImp1c3RpZnlcIik7XG5cbiAgICAgICAgc3RhdGljIGdldCBMRUZUKCkge1xuICAgICAgICAgICAgcmV0dXJuIEVUZXh0QWxpZ24uX0xFRlQ7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0aWMgZ2V0IENFTlRFUigpIHtcbiAgICAgICAgICAgIHJldHVybiBFVGV4dEFsaWduLl9DRU5URVI7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0aWMgZ2V0IFJJR0hUKCkge1xuICAgICAgICAgICAgcmV0dXJuIEVUZXh0QWxpZ24uX1JJR0hUO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIGdldCBKVVNUSUZZKCkge1xuICAgICAgICAgICAgcmV0dXJuIEVUZXh0QWxpZ24uX0pVU1RJRlk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jc3M6IHN0cmluZykge1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IENTUygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jc3M7XG4gICAgICAgIH1cblxuICAgICAgICBhcHBseShlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS50ZXh0QWxpZ24gPSB0aGlzLl9jc3M7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBFSEFsaWduIHtcblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfTEVGVCA9IG5ldyBFSEFsaWduKFwibGVmdFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX0NFTlRFUiA9IG5ldyBFSEFsaWduKFwiY2VudGVyXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfUklHSFQgPSBuZXcgRUhBbGlnbihcInJpZ2h0XCIpO1xuXG4gICAgICAgIHN0YXRpYyBnZXQgTEVGVCgpIHtcbiAgICAgICAgICAgIHJldHVybiBFSEFsaWduLl9MRUZUO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIGdldCBDRU5URVIoKSB7XG4gICAgICAgICAgICByZXR1cm4gRUhBbGlnbi5fQ0VOVEVSO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIGdldCBSSUdIVCgpIHtcbiAgICAgICAgICAgIHJldHVybiBFSEFsaWduLl9SSUdIVDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2Nzczogc3RyaW5nKSB7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQ1NTKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NzcztcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEVWQWxpZ24ge1xuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9UT1AgPSBuZXcgRVZBbGlnbihcInRvcFwiKTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX01JRERMRSA9IG5ldyBFVkFsaWduKFwibWlkZGxlXCIpO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfQk9UVE9NID0gbmV3IEVWQWxpZ24oXCJib3R0b21cIik7XG5cbiAgICAgICAgc3RhdGljIGdldCBUT1AoKSB7XG4gICAgICAgICAgICByZXR1cm4gRVZBbGlnbi5fVE9QO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIGdldCBNSURETEUoKSB7XG4gICAgICAgICAgICByZXR1cm4gRVZBbGlnbi5fTUlERExFO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIGdldCBCT1RUT00oKSB7XG4gICAgICAgICAgICByZXR1cm4gRVZBbGlnbi5fQk9UVE9NO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBfY3NzOiBzdHJpbmcpIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBDU1MoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY3NzO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRm9udEZhbWlseSBpbXBsZW1lbnRzIElTdHlsZSB7XG4gICAgICAgIFxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfYXJpYWwgPSBuZXcgRm9udEZhbWlseShcIkFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWZcIik7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZ2V0IEFyaWFsKCkge1xuICAgICAgICAgICAgcmV0dXJuIEZvbnRGYW1pbHkuX2FyaWFsO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBpbml0Rm9udENvbnRhaW5lclN0eWxlKCkge1xuICAgICAgICAgICAgdmFyIHduZDogYW55ID0gd2luZG93O1xuICAgICAgICAgICAgd25kLmZvbnRzU3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gICAgICAgICAgICB3bmQuZm9udHNTdHlsZS50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuICAgICAgICAgICAgdmFyIGRvYzogYW55ID0gZG9jdW1lbnQ7XG4gICAgICAgICAgICBkb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdLmFwcGVuZENoaWxkKHduZC5mb250c1N0eWxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVnaXN0ZXJGb250KG5hbWU6IHN0cmluZywgc3JjOiBzdHJpbmcsIGV4dHJhOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHZhciBleCA9IGV4dHJhO1xuICAgICAgICAgICAgaWYgKGV4ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBleCA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGN0ID0gXCJAZm9udC1mYWNlIHtmb250LWZhbWlseTogJ1wiICsgbmFtZSArIFwiJzsgc3JjOiB1cmwoJ1wiICsgc3JjICsgXCInKTtcIiArIGV4ICsgXCJ9XCI7XG4gICAgICAgICAgICB2YXIgaWggPSAoPGFueT53aW5kb3cpLmZvbnRzU3R5bGUuaW5uZXJIVE1MO1xuICAgICAgICAgICAgaWYgKGloID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpaCA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgKDxhbnk+d2luZG93KS5mb250c1N0eWxlLmlubmVySFRNTCA9IGloICsgY3Q7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jc3M6IHN0cmluZykge1xuICAgICAgICAgICAgaWYgKCFGb250RmFtaWx5LmluaXRpYWxpemVkKSB7XG4gICAgICAgICAgICAgICAgRm9udEZhbWlseS5pbml0Rm9udENvbnRhaW5lclN0eWxlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQ1NTKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NzcztcbiAgICAgICAgfVxuXG4gICAgICAgIGFwcGx5KGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmZvbnRGYW1pbHkgPSB0aGlzLl9jc3M7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBFQ3Vyc29yIHtcblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBhdXRvID0gbmV3IEVDdXJzb3IoXCJhdXRvXCIpO1xuICAgICAgICBzdGF0aWMgZ2V0IEFVVE8oKSB7XG4gICAgICAgICAgICByZXR1cm4gRUN1cnNvci5hdXRvO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBfY3NzOiBzdHJpbmcpIHsgfVxuXG4gICAgICAgIGdldCBjc3MoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY3NzO1xuICAgICAgICB9XG4gICAgfVxuXG59XG5cblxuIiwibW9kdWxlIGN1YmVlIHtcbiAgICBcbiAgICBleHBvcnQgaW50ZXJmYWNlIElSdW5uYWJsZSB7XG4gICAgICAgICgpOiB2b2lkO1xuICAgIH1cbiAgICBcbiAgICBleHBvcnQgY2xhc3MgUG9pbnQyRCB7XG4gICAgICAgIFxuICAgICAgICBjb25zdHJ1Y3RvciAocHJpdmF0ZSBfeDogbnVtYmVyLCBwcml2YXRlIF95OiBudW1iZXIpIHtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBnZXQgeCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl94O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBnZXQgeSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl95O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH1cbiAgICBcbn1cblxuXG4iLCJtb2R1bGUgY3ViZWUge1xuICAgIFxuICAgIGV4cG9ydCBjbGFzcyBMYXlvdXRDaGlsZHJlbiB7XG4gICAgICAgIHByaXZhdGUgY2hpbGRyZW46IEFDb21wb25lbnRbXSA9IFtdO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcGFyZW50OiBBTGF5b3V0KSB7XG4gICAgICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZChjb21wb25lbnQ6IEFDb21wb25lbnQpIHtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQucGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgY29tcG9uZW50IGlzIGFscmVhZHkgYSBjaGlsZCBvZiBhIGxheW91dC5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29tcG9uZW50Ll9zZXRQYXJlbnQodGhpcy5wYXJlbnQpO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5vblBhcmVudENoYW5nZWQuZmlyZUV2ZW50KG5ldyBQYXJlbnRDaGFuZ2VkRXZlbnRBcmdzKHRoaXMucGFyZW50LCBjb21wb25lbnQpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNvbXBvbmVudCk7XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5fb25DaGlsZEFkZGVkKGNvbXBvbmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbnNlcnQoaW5kZXg6IG51bWJlciwgY29tcG9uZW50OiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICBpZiAoY29tcG9uZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LnBhcmVudCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIGNvbXBvbmVudCBpcyBhbHJlYWR5IGEgY2hpbGQgb2YgYSBsYXlvdXQuXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbmV3Q2hpbGRyZW46IEFDb21wb25lbnRbXSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgICAgICAgICAgIG5ld0NoaWxkcmVuLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBuZXdDaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDAsIGNvbXBvbmVudCk7XG5cbiAgICAgICAgICAgIC8vIFRPRE8gVkVSWSBJTkVGRUNUSVZFXG4gICAgICAgICAgICB0aGlzLmNsZWFyKCk7XG5cbiAgICAgICAgICAgIG5ld0NoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGQoY2hpbGQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmVDb21wb25lbnQoY29tcG9uZW50OiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICB2YXIgaWR4ID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKGNvbXBvbmVudCk7XG4gICAgICAgICAgICBpZiAoaWR4IDwgMCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIGdpdmVuIGNvbXBvbmVudCBpc24ndCBhIGNoaWxkIG9mIHRoaXMgbGF5b3V0LlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yZW1vdmVJbmRleChpZHgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlSW5kZXgoaW5kZXg6IG51bWJlcikge1xuICAgICAgICAgICAgdmFyIHJlbW92ZWRDb21wb25lbnQ6IEFDb21wb25lbnQgPSB0aGlzLmNoaWxkcmVuW2luZGV4XTtcbiAgICAgICAgICAgIGlmIChyZW1vdmVkQ29tcG9uZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZW1vdmVkQ29tcG9uZW50Ll9zZXRQYXJlbnQobnVsbCk7XG4gICAgICAgICAgICAgICAgcmVtb3ZlZENvbXBvbmVudC5vblBhcmVudENoYW5nZWQuZmlyZUV2ZW50KG5ldyBQYXJlbnRDaGFuZ2VkRXZlbnRBcmdzKG51bGwsIHJlbW92ZWRDb21wb25lbnQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucGFyZW50Ll9vbkNoaWxkUmVtb3ZlZChyZW1vdmVkQ29tcG9uZW50LCBpbmRleCk7XG4gICAgICAgIH1cblxuICAgICAgICBjbGVhcigpIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZC5fc2V0UGFyZW50KG51bGwpO1xuICAgICAgICAgICAgICAgICAgICBjaGlsZC5vblBhcmVudENoYW5nZWQuZmlyZUV2ZW50KG5ldyBQYXJlbnRDaGFuZ2VkRXZlbnRBcmdzKG51bGwsIGNoaWxkKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5fb25DaGlsZHJlbkNsZWFyZWQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldChpbmRleDogbnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbltpbmRleF1cbiAgICAgICAgfVxuXG4gICAgICAgIGluZGV4T2YoY29tcG9uZW50OiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5pbmRleE9mKGNvbXBvbmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBzaXplKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxufVxuXG5cbiIsIm1vZHVsZSBjdWJlZSB7XG4gICAgXG4gICAgZXhwb3J0IGNsYXNzIE1vdXNlRXZlbnRUeXBlcyB7XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBNT1VTRV9ET1dOID0gMDtcbiAgICAgICAgcHVibGljIHN0YXRpYyBNT1VTRV9NT1ZFID0gMTtcbiAgICAgICAgcHVibGljIHN0YXRpYyBNT1VTRV9VUCA9IDI7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgTU9VU0VfRU5URVIgPSAzO1xuICAgICAgICBwdWJsaWMgc3RhdGljIE1PVVNFX0xFQVZFID0gNDtcbiAgICAgICAgcHVibGljIHN0YXRpYyBNT1VTRV9XSEVFTCA9IDU7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7IH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBQ29tcG9uZW50IHtcblxuICAgICAgICAvLyAgICAgICAgcHJpdmF0ZSBzdGF0aWMgcG9pbnRlckRvd25FdmVudHM6IE1vdXNlRG93bkV2ZW50TG9nW10gPSBbXTtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgICAgIHByaXZhdGUgc3RhdGljIGxvZ1BvaW50ZXJEb3duRXZlbnQoaXRlbTogTW91c2VEb3duRXZlbnRMb2cpIHtcbiAgICAgICAgLy8gICAgICAgICAgICBBQ29tcG9uZW50LnBvaW50ZXJEb3duRXZlbnRzLnB1c2goaXRlbSk7XG4gICAgICAgIC8vICAgICAgICB9XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgICAgICBzdGF0aWMgZmlyZURyYWdFdmVudHMoc2NyZWVuWDogbnVtYmVyLCBzY3JlZW5ZOiBudW1iZXIsIGFsdFByZXNzZWQ6IGJvb2xlYW4sIGN0cmxQcmVzc2VkOiBib29sZWFuLFxuICAgICAgICAvLyAgICAgICAgICAgIHNoaWZ0UHJlc3NlZDogYm9vbGVhbiwgbWV0YVByZXNzZWQ6IGJvb2xlYW4pIHtcbiAgICAgICAgLy8gICAgICAgICAgICBBQ29tcG9uZW50LnBvaW50ZXJEb3duRXZlbnRzLmZvckVhY2goKGxvZykgPT4ge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICBsZXQgYXJncyA9IG5ldyBNb3VzZURyYWdFdmVudEFyZ3Moc2NyZWVuWCwgc2NyZWVuWSwgc2NyZWVuWCAtIGxvZy5zY3JlZW5YLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgc2NyZWVuWSAtIGxvZy5zY3JlZW5ZLCBhbHRQcmVzc2VkLCBjdHJsUHJlc3NlZCwgc2hpZnRQcmVzc2VkLCBtZXRhUHJlc3NlZCwgbG9nLmNvbXBvbmVudCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGxvZy5jb21wb25lbnQub25Nb3VzZURyYWcuZmlyZUV2ZW50KGFyZ3MpO1xuICAgICAgICAvLyAgICAgICAgICAgIH0pO1xuICAgICAgICAvLyAgICAgICAgfVxuICAgICAgICAvL1xuICAgICAgICAvLyAgICAgICAgc3RhdGljIGZpcmVVcEV2ZW50cyhzY3JlZW5YOiBudW1iZXIsIHNjcmVlblk6IG51bWJlciwgYWx0UHJlc3NlZDogYm9vbGVhbiwgY3RybFByZXNzZWQ6IGJvb2xlYW4sXG4gICAgICAgIC8vICAgICAgICAgICAgc2hpZnRQcmVzc2VkOiBib29sZWFuLCBtZXRhUHJlc3NlZDogYm9vbGVhbiwgYnV0dG9uOiBudW1iZXIsIG5hdGl2ZUV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIC8vICAgICAgICAgICAgdmFyIHN0YW1wID0gRGF0ZS5ub3coKTtcbiAgICAgICAgLy8gICAgICAgICAgICBBQ29tcG9uZW50LnBvaW50ZXJEb3duRXZlbnRzLmZvckVhY2goKGxvZykgPT4ge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICBsZXQgYXJncyA9IG5ldyBNb3VzZVVwRXZlbnRBcmdzKHNjcmVlblgsIHNjcmVlblksIHNjcmVlblggLSBsb2cuc2NyZWVuWCxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIHNjcmVlblkgLSBsb2cuc2NyZWVuWSwgYWx0UHJlc3NlZCwgY3RybFByZXNzZWQsIHNoaWZ0UHJlc3NlZCwgbWV0YVByZXNzZWQsIGJ1dHRvbiwgbmF0aXZlRXZlbnQsIGxvZy5jb21wb25lbnQpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICBsb2cuY29tcG9uZW50Lm9uTW91c2VVcC5maXJlRXZlbnQoYXJncyk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGlmIChzdGFtcCAtIGxvZy50aW1lc3RhbXAgPCA1MDApIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGxvZy5jb21wb25lbnQub25DbGljay5maXJlRXZlbnQobmV3IENsaWNrRXZlbnRBcmdzKHNjcmVlblgsIHNjcmVlblksIGxvZy54LCBsb2cueSxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICBhbHRQcmVzc2VkLCBjdHJsUHJlc3NlZCwgc2hpZnRQcmVzc2VkLCBtZXRhUHJlc3NlZCwgYnV0dG9uLCBsb2cuY29tcG9uZW50KSk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICAgICB9KTtcbiAgICAgICAgLy8gICAgICAgICAgICBBQ29tcG9uZW50LnBvaW50ZXJEb3duRXZlbnRzID0gW107XG4gICAgICAgIC8vICAgICAgICB9XG5cbiAgICAgICAgLy8gICAgICAgIHB1YmxpYyBzdGF0aWMgYWRkTmF0aXZlRXZlbnQoZWxlbWVudDogRWxlbWVudCwgZXZlbnROYW1lOiBzdHJpbmcsIG5hdGl2ZUV2ZW50TGlzdGVuZXI6IHsgKGV2ZW50OiBVSUV2ZW50KTogYW55IH0sIHVzZUNhcHR1cmU6IGJvb2xlYW4pIHtcbiAgICAgICAgLy8gICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBuYXRpdmVFdmVudExpc3RlbmVyLCB1c2VDYXB0dXJlKTtcbiAgICAgICAgLy8gICAgICAgIH1cbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVtb3ZlTmF0aXZlRXZlbnQoZWxlbWVudDogRWxlbWVudCwgZXZlbnROYW1lOiBzdHJpbmcsIG5hdGl2ZUV2ZW50TGlzdGVuZXI6IHsgKGV2ZW50OiBVSUV2ZW50KTogYW55IH0sIHVzZUNhcHR1cmU6IGJvb2xlYW4pIHtcbiAgICAgICAgLy8gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBuYXRpdmVFdmVudExpc3RlbmVyLCB1c2VDYXB0dXJlKTtcbiAgICAgICAgLy8gICAgICAgIH1cblxuICAgICAgICAvLyAgICAgICAgcHJpdmF0ZSBuYXRpdmVFdmVudExpc3RlbmVyOiBJTmF0aXZlRXZlbnRMaXN0ZW5lciA9IChldmVudDogVUlFdmVudCk6IGFueSA9PiB7XG4gICAgICAgIC8vICAgICAgICAgICAgdGhpcy5oYW5kbGVOYXRpdmVFdmVudChldmVudCk7XG4gICAgICAgIC8vICAgICAgICB9O1xuXG4gICAgICAgIC8vICAgICAgICBwcml2YXRlIGhhbmRsZU5hdGl2ZUV2ZW50KGV2ZW50OiBVSUV2ZW50KSB7XG4gICAgICAgIC8vICAgICAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBUZXh0Qm94KSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGlmIChldmVudC50eXBlID09IFwia2V5dXBcIikge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgRXZlbnRRdWV1ZS5JbnN0YW5jZS5pbnZva2VQcmlvcigoKSA9PiB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgKDxUZXh0Qm94PnRoaXMpLnRleHRQcm9wZXJ0eSgpLnNldChnZXRFbGVtZW50KCkuZ2V0UHJvcGVydHlTdHJpbmcoXCJ2YWx1ZVwiKSk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgICAgIH1cbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgICAgICAgICAvL3ZhciB4ID0gZXZlbnQuY2xpZW50WDtcbiAgICAgICAgLy8gICAgICAgICAgICAvL3ZhciB5ID0gZXZlbnQuY2xpZW50WTtcbiAgICAgICAgLy8gICAgICAgICAgICAvL3ZhciB3aGVlbFZlbG9jaXR5ID0gZXZlbnQudmVsb2NpdHlZO1xuICAgICAgICAvLyAgICAgICAgICAgIHZhciBwYXJlbnQ6IEFDb21wb25lbnQ7XG4gICAgICAgIC8vICAgICAgICAgICAgdmFyIGtleUFyZ3M6IEtleUV2ZW50QXJncztcbiAgICAgICAgLy8gICAgICAgICAgICB2YXIgY3AgPSB0aGlzLmdldEN1YmVlUGFuZWwoKTtcbiAgICAgICAgLy8gICAgICAgICAgICB2YXIga2V2dDogS2V5Ym9hcmRFdmVudCA9IG51bGw7XG4gICAgICAgIC8vICAgICAgICAgICAgc3dpdGNoIChldmVudC50eXBlKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGNhc2UgXCJtb3VzZWRvd25cIjpcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgY2FzZSBcIm1vdXNld2hlZWxcIjpcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgaWYgKGNwICE9IG51bGwpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICBjcC5kb1BvaW50ZXJFdmVudENsaW1iaW5nVXAoeCwgeSwgd2hlZWxWZWxvY2l0eSxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuZ2V0QWx0S2V5KCksIGV2ZW50LmdldEN0cmxLZXkoKSwgZXZlbnQuZ2V0U2hpZnRLZXkoKSwgZXZlbnQuZ2V0TWV0YUtleSgpLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5nZXRUeXBlSW50KCksIGV2ZW50LmdldEJ1dHRvbigpLCBldmVudCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIFBvcHVwcy5kb1BvaW50ZXJFdmVudENsaW1iaW5nVXAoeCwgeSwgd2hlZWxWZWxvY2l0eSxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuZ2V0QWx0S2V5KCksIGV2ZW50LmdldEN0cmxLZXkoKSwgZXZlbnQuZ2V0U2hpZnRLZXkoKSwgZXZlbnQuZ2V0TWV0YUtleSgpLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5nZXRUeXBlSW50KCksIGV2ZW50LmdldEJ1dHRvbigpLCBldmVudCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgY2FzZSBcIm1vdXNlbW92ZVwiOlxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICBpZiAoQUNvbXBvbmVudC5wb2ludGVyRG93bkV2ZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGV2dCA9IDxNb3VzZUV2ZW50PmV2ZW50O1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIEFDb21wb25lbnQuZmlyZURyYWdFdmVudHMoZXZ0LmNsaWVudFgsIGV2dC5jbGllbnRZLCBldnQuYWx0S2V5LCBldnQuY3RybEtleSxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZ0LnNoaWZ0S2V5LCBldnQubWV0YUtleSk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIGxldCB3ZXZ0ID0gPFdoZWVsRXZlbnQ+ZXZlbnQ7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNwICE9IG51bGwpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3AuZG9Qb2ludGVyRXZlbnRDbGltYmluZ1VwKHdldnQuY2xpZW50WCwgd2V2dC5jbGllbnRZLCB3ZXZ0LmRlbHRhWSxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdldnQuYWx0S2V5LCB3ZXZ0LmN0cmxLZXksIHdldnQuc2hpZnRLZXksIHdldnQubWV0YUtleSxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdldnQudHlwZSwgd2V2dC5idXR0b24sIHdldnQpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBvcHVwcy5kb1BvaW50ZXJFdmVudENsaW1iaW5nVXAod2V2dC5jbGllbnRYLCB3ZXZ0LmNsaWVudFksIHdldnQuZGVsdGFZLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2V2dC5hbHRLZXksIHdldnQuY3RybEtleSwgd2V2dC5zaGlmdEtleSwgd2V2dC5tZXRhS2V5LFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2V2dC50eXBlLCB3ZXZ0LmJ1dHRvbiwgd2V2dCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGNhc2UgXCJtb3VzZXVwXCI6XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGxldCBldnQgPSA8TW91c2VFdmVudD5ldmVudDtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIEFDb21wb25lbnQuZmlyZURyYWdFdmVudHMoZXZ0LmNsaWVudFgsIGV2dC5jbGllbnRZLCBldnQuYWx0S2V5LCBldnQuY3RybEtleSxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICBldnQuc2hpZnRLZXksIGV2dC5tZXRhS2V5KTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICBjYXNlIFwibW91c2VvdmVyXCI6XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fcG9pbnRlclRyYW5zcGFyZW50LlZhbHVlKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAvL1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgaGFuZGxlIHBvaW50ZXJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIHBhcmVudCA9IHRoaXM7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICB3aGlsZSAocGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXBhcmVudC5oYW5kbGVQb2ludGVyKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LlBhcmVudDtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5ob3ZlcmVkKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbk1vdXNlRW50ZXIuZmlyZUV2ZW50KG5ldyBFdmVudEFyZ3ModGhpcykpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGNhc2UgXCJtb3VzZW91dFwiOlxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucG9pbnRlclRyYW5zcGFyZW50KSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAvL1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgaGFuZGxlIHBvaW50ZXJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIHBhcmVudCA9IHRoaXM7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICB3aGlsZSAocGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXBhcmVudC5oYW5kbGVQb2ludGVyKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LlBhcmVudDtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmhvdmVyZWQpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAvKmludCBjb21wWCA9IGdldExlZnQoKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgaW50IGNvbXBZID0gZ2V0VG9wKCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4ID49IGNvbXBYICYmIHkgPj0gY29tcFkgJiYgeCA8PSBjb21wWCArIGJvdW5kc1dpZHRoUHJvcGVydHkoKS5nZXQoKSAmJiB5IDw9IGNvbXBZICsgYm91bmRzSGVpZ2h0UHJvcGVydHkoKS5nZXQoKSkge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIH0qL1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25Nb3VzZUxlYXZlLmZpcmVFdmVudChuZXcgRXZlbnRBcmdzKHRoaXMpKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICBjYXNlIFwia2V5ZHdvblwiOlxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICBrZXZ0ID0gPEtleWJvYXJkRXZlbnQ+ZXZlbnQ7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICBsZXQga2V5QXJncyA9IG5ldyBLZXlFdmVudEFyZ3Moa2V2dC5rZXlDb2RlLCBrZXZ0LmFsdEtleSwga2V2dC5jdHJsS2V5LFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIGtldnQuc2hpZnRLZXksIGtldnQubWV0YUtleSwgdGhpcywga2V2dCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICB0aGlzLm9uS2V5RG93bi5maXJlRXZlbnQoa2V5QXJncyk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgY2FzZSBcImtleXByZXNzXCI6XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGtldnQgPSA8S2V5Ym9hcmRFdmVudD5ldmVudDtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGtleUFyZ3MgPSBuZXcgS2V5RXZlbnRBcmdzKGtldnQua2V5Q29kZSwga2V2dC5hbHRLZXksIGtldnQuY3RybEtleSxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICBrZXZ0LnNoaWZ0S2V5LCBrZXZ0Lm1ldGFLZXksIHRoaXMsIGtldnQpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgdGhpcy5vbktleVByZXNzLmZpcmVFdmVudChrZXlBcmdzKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICBjYXNlIFwia2V5dXBcIjpcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAga2V2dCA9IDxLZXlib2FyZEV2ZW50PmV2ZW50O1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAga2V5QXJncyA9IG5ldyBLZXlFdmVudEFyZ3Moa2V2dC5rZXlDb2RlLCBrZXZ0LmFsdEtleSwga2V2dC5jdHJsS2V5LFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIGtldnQuc2hpZnRLZXksIGtldnQubWV0YUtleSwgdGhpcywga2V2dCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICB0aGlzLm9uS2V5VXAuZmlyZUV2ZW50KGtleUFyZ3MpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGNhc2UgXCJjb250ZXh0bWVudVwiOlxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkNvbnRleHRNZW51LmZpcmVFdmVudChuZXcgQ29udGV4dE1lbnVFdmVudEFyZ3MoZXZlbnQsIHRoaXMpKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyAgICAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF90cmFuc2xhdGVYID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3RyYW5zbGF0ZVkgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfcm90YXRlID0gbmV3IE51bWJlclByb3BlcnR5KDAuMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfc2NhbGVYID0gbmV3IE51bWJlclByb3BlcnR5KDEuMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfc2NhbGVZID0gbmV3IE51bWJlclByb3BlcnR5KDEuMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdHJhbnNmb3JtQ2VudGVyWCA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLjUsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3RyYW5zZm9ybUNlbnRlclkgPSBuZXcgTnVtYmVyUHJvcGVydHkoMC41LCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9wYWRkaW5nID0gbmV3IFBhZGRpbmdQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2JvcmRlciA9IG5ldyBCb3JkZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX21lYXN1cmVkV2lkdGggPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIHRydWUpO1xuICAgICAgICBwcml2YXRlIF9tZWFzdXJlZEhlaWdodCA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgIHByaXZhdGUgX2NsaWVudFdpZHRoID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgcHJpdmF0ZSBfY2xpZW50SGVpZ2h0ID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgcHJpdmF0ZSBfYm91bmRzV2lkdGggPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIHRydWUpO1xuICAgICAgICBwcml2YXRlIF9ib3VuZHNIZWlnaHQgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIHRydWUpO1xuICAgICAgICBwcml2YXRlIF9ib3VuZHNMZWZ0ID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgcHJpdmF0ZSBfYm91bmRzVG9wID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgcHJpdmF0ZSBfbWVhc3VyZWRXaWR0aFNldHRlciA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9tZWFzdXJlZEhlaWdodFNldHRlciA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9jbGllbnRXaWR0aFNldHRlciA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9jbGllbnRIZWlnaHRTZXR0ZXIgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYm91bmRzV2lkdGhTZXR0ZXIgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYm91bmRzSGVpZ2h0U2V0dGVyID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2JvdW5kc0xlZnRTZXR0ZXIgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYm91bmRzVG9wU2V0dGVyID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2N1cnNvciA9IG5ldyBQcm9wZXJ0eTxFQ3Vyc29yPihFQ3Vyc29yLkFVVE8sIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3BvaW50ZXJUcmFuc3BhcmVudCA9IG5ldyBQcm9wZXJ0eTxib29sZWFuPihmYWxzZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfaGFuZGxlUG9pbnRlciA9IG5ldyBQcm9wZXJ0eTxib29sZWFuPih0cnVlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF92aXNpYmxlID0gbmV3IFByb3BlcnR5PGJvb2xlYW4+KHRydWUsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2VuYWJsZWQgPSBuZXcgUHJvcGVydHk8Ym9vbGVhbj4odHJ1ZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYWxwaGEgPSBuZXcgTnVtYmVyUHJvcGVydHkoMS4wLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9zZWxlY3RhYmxlID0gbmV3IFByb3BlcnR5PGJvb2xlYW4+KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9taW5XaWR0aCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX21pbkhlaWdodCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX21heFdpZHRoID0gbmV3IE51bWJlclByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfbWF4SGVpZ2h0ID0gbmV3IE51bWJlclByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfaG92ZXJlZCA9IG5ldyBQcm9wZXJ0eTxib29sZWFuPihmYWxzZSwgZmFsc2UsIHRydWUpO1xuICAgICAgICBwcml2YXRlIF9ob3ZlcmVkU2V0dGVyID0gbmV3IFByb3BlcnR5PGJvb2xlYW4+KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9wcmVzc2VkID0gbmV3IFByb3BlcnR5PGJvb2xlYW4+KGZhbHNlLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgIHByaXZhdGUgX3ByZXNzZWRTZXR0ZXIgPSBuZXcgUHJvcGVydHk8Ym9vbGVhbj4oZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX29uQ2xpY2sgPSBuZXcgRXZlbnQ8Q2xpY2tFdmVudEFyZ3M+KCk7XG4gICAgICAgIHByaXZhdGUgX29uTW91c2VEb3duID0gbmV3IEV2ZW50PE1vdXNlRG93bkV2ZW50QXJncz4oKTtcbiAgICAgICAgcHJpdmF0ZSBfb25Nb3VzZURyYWcgPSBuZXcgRXZlbnQ8TW91c2VEcmFnRXZlbnRBcmdzPigpO1xuICAgICAgICBwcml2YXRlIF9vbk1vdXNlTW92ZSA9IG5ldyBFdmVudDxNb3VzZU1vdmVFdmVudEFyZ3M+KCk7XG4gICAgICAgIHByaXZhdGUgX29uTW91c2VVcCA9IG5ldyBFdmVudDxNb3VzZVVwRXZlbnRBcmdzPigpO1xuICAgICAgICBwcml2YXRlIF9vbk1vdXNlRW50ZXIgPSBuZXcgRXZlbnQ8T2JqZWN0PigpO1xuICAgICAgICBwcml2YXRlIF9vbk1vdXNlTGVhdmUgPSBuZXcgRXZlbnQ8T2JqZWN0PigpO1xuICAgICAgICBwcml2YXRlIF9vbk1vdXNlV2hlZWwgPSBuZXcgRXZlbnQ8TW91c2VXaGVlbEV2ZW50QXJncz4oKTtcbiAgICAgICAgcHJpdmF0ZSBfb25LZXlEb3duID0gbmV3IEV2ZW50PEtleUV2ZW50QXJncz4oKTtcbiAgICAgICAgcHJpdmF0ZSBfb25LZXlQcmVzcyA9IG5ldyBFdmVudDxLZXlFdmVudEFyZ3M+KCk7XG4gICAgICAgIHByaXZhdGUgX29uS2V5VXAgPSBuZXcgRXZlbnQ8S2V5RXZlbnRBcmdzPigpO1xuICAgICAgICBwcml2YXRlIF9vblBhcmVudENoYW5nZWQgPSBuZXcgRXZlbnQ8UGFyZW50Q2hhbmdlZEV2ZW50QXJncz4oKTtcbiAgICAgICAgcHJpdmF0ZSBfb25Db250ZXh0TWVudSA9IG5ldyBFdmVudDxDb250ZXh0TWVudUV2ZW50QXJncz4oKTtcbiAgICAgICAgcHJpdmF0ZSBfbGVmdCA9IDA7XG4gICAgICAgIHByaXZhdGUgX3RvcCA9IDA7XG4gICAgICAgIHByaXZhdGUgX2VsZW1lbnQ6IEhUTUxFbGVtZW50O1xuICAgICAgICBwcml2YXRlIF9wYXJlbnQ6IEFMYXlvdXQ7XG4gICAgICAgIHB1YmxpYyBfbmVlZHNMYXlvdXQgPSB0cnVlO1xuICAgICAgICBwcml2YXRlIF9jdWJlZVBhbmVsOiBDdWJlZVBhbmVsO1xuICAgICAgICBwcml2YXRlIF90cmFuc2Zvcm1DaGFuZ2VkTGlzdGVuZXIgPSAoc2VuZGVyOiBPYmplY3QpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVHJhbnNmb3JtKCk7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgfTtcbiAgICAgICAgcHJpdmF0ZSBfcG9zdENvbnN0cnVjdFJ1bk9uY2UgPSBuZXcgUnVuT25jZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBvc3RDb25zdHJ1Y3QoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgQUNvbXBvbmV0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gcm9vdEVsZW1lbnQgVGhlIHVuZGVybGF5aW5nIEhUTUwgZWxlbWVudCB3aGljaCB0aGlzIGNvbXBvbmVudCB3cmFwcy5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yKHJvb3RFbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudCA9IHJvb3RFbGVtZW50O1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5ib3hTaXppbmcgPSBcImJvcmRlci1ib3hcIjtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKFwiZHJhZ2dhYmxlXCIsIFwiZmFsc2VcIik7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5vdXRsaW5lU3R5bGUgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUub3V0bGluZVdpZHRoID0gXCIwcHhcIjtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUubWFyZ2luID0gXCIwcHhcIjtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9IFwiYWxsXCI7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2xhdGVYLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX3RyYW5zZm9ybUNoYW5nZWRMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2xhdGVZLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX3RyYW5zZm9ybUNoYW5nZWRMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLl9yb3RhdGUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fdHJhbnNmb3JtQ2hhbmdlZExpc3RlbmVyKTtcbiAgICAgICAgICAgIHRoaXMuX3NjYWxlWC5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl90cmFuc2Zvcm1DaGFuZ2VkTGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy5fc2NhbGVZLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX3RyYW5zZm9ybUNoYW5nZWRMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2Zvcm1DZW50ZXJYLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX3RyYW5zZm9ybUNoYW5nZWRMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2Zvcm1DZW50ZXJZLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX3RyYW5zZm9ybUNoYW5nZWRMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLl9ob3ZlcmVkLmluaXRSZWFkb25seUJpbmQodGhpcy5faG92ZXJlZFNldHRlcik7XG4gICAgICAgICAgICB0aGlzLl9wcmVzc2VkLmluaXRSZWFkb25seUJpbmQodGhpcy5fcHJlc3NlZFNldHRlcik7XG4gICAgICAgICAgICB0aGlzLl9wYWRkaW5nLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgcCA9IHRoaXMuX3BhZGRpbmcudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHAgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnBhZGRpbmcgPSBcIjBweFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHAuYXBwbHkodGhpcy5fZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9wYWRkaW5nLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2JvcmRlci5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGIgPSB0aGlzLl9ib3JkZXIudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKGIgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYm9yZGVyU3R5bGVcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJib3JkZXJDb2xvclwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImJvcmRlcldpZHRoXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYm9yZGVyUmFkaXVzXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGIuYXBwbHkodGhpcy5fZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9jdXJzb3IuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUuY3Vyc29yID0gdGhpcy5jdXJzb3IuY3NzO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl92aXNpYmxlLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdmlzaWJsZS52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZW5hYmxlZC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2VuYWJsZWQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2FscGhhLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLm9wYWNpdHkgPSBcIlwiICsgdGhpcy5fYWxwaGEudmFsdWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGFibGUuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zZWxlY3RhYmxlLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJtb3pVc2VyU2VsZWN0XCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwia2h0bWxVc2VyU2VsZWN0XCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwid2Via2l0VXNlclNlbGVjdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcIm1zVXNlclNlbGVjdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcInVzZXJTZWxlY3RcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcIm1velVzZXJTZWxlY3RcIiwgXCJub25lXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KFwia2h0bWxVc2VyU2VsZWN0XCIsIFwibm9uZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcIndlYmtpdFVzZXJTZWxlY3RcIiwgXCJub25lXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KFwibXNVc2VyU2VsZWN0XCIsIFwibm9uZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcInVzZXJTZWxlY3RcIiwgXCJub25lXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fc2VsZWN0YWJsZS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9taW5XaWR0aC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX21pbldpZHRoLnZhbHVlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcIm1pbldpZHRoXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoXCJtaW5XaWR0aFwiLCB0aGlzLl9taW5XaWR0aC52YWx1ZSArIFwicHhcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9taW5IZWlnaHQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9taW5IZWlnaHQudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwibWluSGVpZ2h0XCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoXCJtaW5IZWlnaHRcIiwgdGhpcy5fbWluSGVpZ2h0LnZhbHVlICsgXCJweFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX21heFdpZHRoLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbWF4V2lkdGgudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwibWF4V2lkdGhcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcIm1heFdpZHRoXCIsIHRoaXMuX21heFdpZHRoLnZhbHVlICsgXCJweFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX21heEhlaWdodC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX21heEhlaWdodC52YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJtYXhIZWlnaHRcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcIm1heEhlaWdodFwiLCB0aGlzLl9tYXhIZWlnaHQudmFsdWUgKyBcInB4XCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5faGFuZGxlUG9pbnRlci5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9oYW5kbGVQb2ludGVyLnZhbHVlIHx8IHRoaXMuX3BvaW50ZXJUcmFuc3BhcmVudC52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KFwicG9pbnRlckV2ZW50c1wiLCBcIm5vbmVcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcInBvaW50ZXJFdmVudHNcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9wb2ludGVyVHJhbnNwYXJlbnQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5faGFuZGxlUG9pbnRlci52YWx1ZSB8fCB0aGlzLl9wb2ludGVyVHJhbnNwYXJlbnQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcInBvaW50ZXJFdmVudHNcIiwgXCJub25lXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJwb2ludGVyRXZlbnRzXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLl9tZWFzdXJlZFdpZHRoLmluaXRSZWFkb25seUJpbmQodGhpcy5fbWVhc3VyZWRXaWR0aFNldHRlcik7XG4gICAgICAgICAgICB0aGlzLl9tZWFzdXJlZEhlaWdodC5pbml0UmVhZG9ubHlCaW5kKHRoaXMuX21lYXN1cmVkSGVpZ2h0U2V0dGVyKTtcbiAgICAgICAgICAgIHRoaXMuX2NsaWVudFdpZHRoLmluaXRSZWFkb25seUJpbmQodGhpcy5fY2xpZW50V2lkdGhTZXR0ZXIpO1xuICAgICAgICAgICAgdGhpcy5fY2xpZW50SGVpZ2h0LmluaXRSZWFkb25seUJpbmQodGhpcy5fY2xpZW50SGVpZ2h0U2V0dGVyKTtcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kc1dpZHRoLmluaXRSZWFkb25seUJpbmQodGhpcy5fYm91bmRzV2lkdGhTZXR0ZXIpO1xuICAgICAgICAgICAgdGhpcy5fYm91bmRzSGVpZ2h0LmluaXRSZWFkb25seUJpbmQodGhpcy5fYm91bmRzSGVpZ2h0U2V0dGVyKTtcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kc0xlZnQuaW5pdFJlYWRvbmx5QmluZCh0aGlzLl9ib3VuZHNMZWZ0U2V0dGVyKTtcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kc1RvcC5pbml0UmVhZG9ubHlCaW5kKHRoaXMuX2JvdW5kc1RvcFNldHRlcik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIFRPRE8gcmVwbGFjZSBldmVudCBoYW5kbGluZyBtZWNoYW5pc21cbiAgICAgICAgICAgIC8vRE9NLnNldEV2ZW50TGlzdGVuZXIoZ2V0RWxlbWVudCgpLCBuYXRpdmVFdmVudExpc3RlbmVyKTtcbiAgICAgICAgICAgIC8vIHNpbmtpbmcgYWxsIHRoZSBldmVudHNcbiAgICAgICAgICAgIC8vRE9NLnNpbmtFdmVudHMoZ2V0RWxlbWVudCgpLCAtMSk7XG5cbiAgICAgICAgICAgIHRoaXMuX29uTW91c2VFbnRlci5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5faG92ZXJlZFNldHRlci52YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX29uTW91c2VMZWF2ZS5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5faG92ZXJlZFNldHRlci52YWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9vbk1vdXNlRG93bi5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJlc3NlZFNldHRlci52YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX29uTW91c2VVcC5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJlc3NlZFNldHRlci52YWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGludm9rZVBvc3RDb25zdHJ1Y3QoKSB7XG4gICAgICAgICAgICB0aGlzLl9wb3N0Q29uc3RydWN0UnVuT25jZS5ydW4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBwb3N0Q29uc3RydWN0KCkge1xuXG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc2V0Q3ViZWVQYW5lbChjdWJlZVBhbmVsOiBDdWJlZVBhbmVsKSB7XG4gICAgICAgICAgICB0aGlzLl9jdWJlZVBhbmVsID0gY3ViZWVQYW5lbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldEN1YmVlUGFuZWwoKTogQ3ViZWVQYW5lbCB7XG4gICAgICAgICAgICBpZiAodGhpcy5fY3ViZWVQYW5lbCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2N1YmVlUGFuZWw7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0Q3ViZWVQYW5lbCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgdXBkYXRlVHJhbnNmb3JtKCkge1xuICAgICAgICAgICAgdmFyIGFuZ2xlID0gdGhpcy5fcm90YXRlLnZhbHVlO1xuICAgICAgICAgICAgYW5nbGUgPSBhbmdsZSAtIChhbmdsZSB8IDApO1xuICAgICAgICAgICAgYW5nbGUgPSBhbmdsZSAqIDM2MDtcbiAgICAgICAgICAgIHZhciBhbmdsZVN0ciA9IGFuZ2xlICsgXCJkZWdcIjtcblxuICAgICAgICAgICAgdmFyIGNlbnRlclggPSAodGhpcy5fdHJhbnNmb3JtQ2VudGVyWC52YWx1ZSAqIDEwMCkgKyBcIiVcIjtcbiAgICAgICAgICAgIHZhciBjZW50ZXJZID0gKHRoaXMuX3RyYW5zZm9ybUNlbnRlclkudmFsdWUgKiAxMDApICsgXCIlXCI7XG5cbiAgICAgICAgICAgIHZhciBzWCA9IHRoaXMuX3NjYWxlWC52YWx1ZS50b1N0cmluZygpO1xuICAgICAgICAgICAgdmFyIHNZID0gdGhpcy5fc2NhbGVZLnZhbHVlLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gY2VudGVyWCArIFwiIFwiICsgY2VudGVyWTtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gXCJ0cmFuc2xhdGUoXCIgKyB0aGlzLl90cmFuc2xhdGVYLnZhbHVlICsgXCJweCwgXCIgKyB0aGlzLl90cmFuc2xhdGVZLnZhbHVlXG4gICAgICAgICAgICArIFwicHgpIHJvdGF0ZShcIiArIGFuZ2xlU3RyICsgXCIpIHNjYWxlWCggXCIgKyBzWCArIFwiKSBzY2FsZVkoXCIgKyBzWSArIFwiKVwiO1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5iYWNrZmFjZVZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVxdWVzdExheW91dCgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fbmVlZHNMYXlvdXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9uZWVkc0xheW91dCA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3BhcmVudCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcmVudC5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9jdWJlZVBhbmVsICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3ViZWVQYW5lbC5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgUG9wdXBzLl9yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbWVhc3VyZSgpIHtcbiAgICAgICAgICAgIHRoaXMub25NZWFzdXJlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIG9uTWVhc3VyZSgpIHtcbiAgICAgICAgICAgIC8vIGNhbGN1bGF0aW5nIGNsaWVudCBib3VuZHNcbiAgICAgICAgICAgIHZhciBjdyA9IHRoaXMuX2VsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgICAgICAgICB2YXIgY2ggPSB0aGlzLl9lbGVtZW50LmNsaWVudEhlaWdodDtcbiAgICAgICAgICAgIHZhciBwID0gdGhpcy5fcGFkZGluZy52YWx1ZTtcbiAgICAgICAgICAgIGlmIChwICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjdyA9IGN3IC0gcC5sZWZ0IC0gcC5yaWdodDtcbiAgICAgICAgICAgICAgICBjaCA9IGNoIC0gcC50b3AgLSBwLmJvdHRvbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2NsaWVudFdpZHRoU2V0dGVyLnZhbHVlID0gY3c7XG4gICAgICAgICAgICB0aGlzLl9jbGllbnRIZWlnaHRTZXR0ZXIudmFsdWUgPSBjaDtcblxuICAgICAgICAgICAgLy8gY2FsY3VsYXRpbmcgbWVhc3VyZWQgYm91bmRzXG4gICAgICAgICAgICB2YXIgbXcgPSB0aGlzLl9lbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICAgICAgdmFyIG1oID0gdGhpcy5fZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICB0aGlzLl9tZWFzdXJlZFdpZHRoU2V0dGVyLnZhbHVlID0gbXc7XG4gICAgICAgICAgICB0aGlzLl9tZWFzdXJlZEhlaWdodFNldHRlci52YWx1ZSA9IG1oO1xuXG4gICAgICAgICAgICAvLyBjYWxjdWxhdGluZyBwYXJlbnQgYm91bmRzXG4gICAgICAgICAgICB2YXIgdGN4ID0gdGhpcy5fdHJhbnNmb3JtQ2VudGVyWC52YWx1ZTtcbiAgICAgICAgICAgIHZhciB0Y3kgPSB0aGlzLl90cmFuc2Zvcm1DZW50ZXJZLnZhbHVlO1xuXG4gICAgICAgICAgICB2YXIgYnggPSAwO1xuICAgICAgICAgICAgdmFyIGJ5ID0gMDtcbiAgICAgICAgICAgIHZhciBidyA9IG13O1xuICAgICAgICAgICAgdmFyIGJoID0gbWg7XG5cbiAgICAgICAgICAgIHZhciB0bCA9IG5ldyBQb2ludDJEKDAsIDApO1xuICAgICAgICAgICAgdmFyIHRyID0gbmV3IFBvaW50MkQobXcsIDApO1xuICAgICAgICAgICAgdmFyIGJyID0gbmV3IFBvaW50MkQobXcsIG1oKTtcbiAgICAgICAgICAgIHZhciBibCA9IG5ldyBQb2ludDJEKDAsIG1oKTtcblxuICAgICAgICAgICAgdmFyIGN4ID0gKG13ICogdGN4KSB8IDA7XG4gICAgICAgICAgICB2YXIgY3kgPSAobWggKiB0Y3kpIHwgMDtcblxuICAgICAgICAgICAgdmFyIHJvdCA9IHRoaXMuX3JvdGF0ZS52YWx1ZTtcbiAgICAgICAgICAgIGlmIChyb3QgIT0gMC4wKSB7XG4gICAgICAgICAgICAgICAgdGwgPSB0aGlzLnJvdGF0ZVBvaW50KGN4LCBjeSwgMCwgMCwgcm90KTtcbiAgICAgICAgICAgICAgICB0ciA9IHRoaXMucm90YXRlUG9pbnQoY3gsIGN5LCBidywgMCwgcm90KTtcbiAgICAgICAgICAgICAgICBiciA9IHRoaXMucm90YXRlUG9pbnQoY3gsIGN5LCBidywgYmgsIHJvdCk7XG4gICAgICAgICAgICAgICAgYmwgPSB0aGlzLnJvdGF0ZVBvaW50KGN4LCBjeSwgMCwgYmgsIHJvdCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzeCA9IHRoaXMuX3NjYWxlWC52YWx1ZTtcbiAgICAgICAgICAgIHZhciBzeSA9IHRoaXMuX3NjYWxlWS52YWx1ZTtcblxuICAgICAgICAgICAgaWYgKHN4ICE9IDEuMCB8fCBzeSAhPSAxLjApIHtcbiAgICAgICAgICAgICAgICB0bCA9IHRoaXMuc2NhbGVQb2ludChjeCwgY3ksIHRsLngsIHRsLnksIHN4LCBzeSk7XG4gICAgICAgICAgICAgICAgdHIgPSB0aGlzLnNjYWxlUG9pbnQoY3gsIGN5LCB0ci54LCB0ci55LCBzeCwgc3kpO1xuICAgICAgICAgICAgICAgIGJyID0gdGhpcy5zY2FsZVBvaW50KGN4LCBjeSwgYnIueCwgYnIueSwgc3gsIHN5KTtcbiAgICAgICAgICAgICAgICBibCA9IHRoaXMuc2NhbGVQb2ludChjeCwgY3ksIGJsLngsIGJsLnksIHN4LCBzeSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBtaW5YID0gTWF0aC5taW4oTWF0aC5taW4odGwueCwgdHIueCksIE1hdGgubWluKGJyLngsIGJsLngpKTtcbiAgICAgICAgICAgIHZhciBtaW5ZID0gTWF0aC5taW4oTWF0aC5taW4odGwueSwgdHIueSksIE1hdGgubWluKGJyLnksIGJsLnkpKTtcbiAgICAgICAgICAgIHZhciBtYXhYID0gTWF0aC5tYXgoTWF0aC5tYXgodGwueCwgdHIueCksIE1hdGgubWF4KGJyLngsIGJsLngpKTtcbiAgICAgICAgICAgIHZhciBtYXhZID0gTWF0aC5tYXgoTWF0aC5tYXgodGwueSwgdHIueSksIE1hdGgubWF4KGJyLnksIGJsLnkpKTtcbiAgICAgICAgICAgIGJ3ID0gbWF4WCAtIG1pblg7XG4gICAgICAgICAgICBiaCA9IG1heFkgLSBtaW5ZO1xuICAgICAgICAgICAgYnggPSBtaW5YO1xuICAgICAgICAgICAgYnkgPSBtaW5ZO1xuXG4gICAgICAgICAgICB0aGlzLl9ib3VuZHNMZWZ0U2V0dGVyLnZhbHVlID0gYng7XG4gICAgICAgICAgICB0aGlzLl9ib3VuZHNUb3BTZXR0ZXIudmFsdWUgPSBieTtcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kc1dpZHRoU2V0dGVyLnZhbHVlID0gYnc7XG4gICAgICAgICAgICB0aGlzLl9ib3VuZHNIZWlnaHRTZXR0ZXIudmFsdWUgPSBiaDtcbiAgICAgICAgfVxuXG4gICAgICAgIHNjYWxlUG9pbnQoY2VudGVyWDogbnVtYmVyLCBjZW50ZXJZOiBudW1iZXIsIHBvaW50WDogbnVtYmVyLCBwb2ludFk6IG51bWJlciwgc2NhbGVYOiBudW1iZXIsIHNjYWxlWTogbnVtYmVyKSB7XG4gICAgICAgICAgICB2YXIgcmVzWCA9IChjZW50ZXJYICsgKChwb2ludFggLSBjZW50ZXJYKSAqIHNjYWxlWCkpIHwgMDtcbiAgICAgICAgICAgIHZhciByZXNZID0gKGNlbnRlclkgKyAoKHBvaW50WSAtIGNlbnRlclkpICogc2NhbGVZKSkgfCAwO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQb2ludDJEKHJlc1gsIHJlc1kpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSByb3RhdGVQb2ludChjeDogbnVtYmVyLCBjeTogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlciwgYW5nbGU6IG51bWJlcikge1xuICAgICAgICAgICAgYW5nbGUgPSAoYW5nbGUgKiAzNjApICogKE1hdGguUEkgLyAxODApO1xuICAgICAgICAgICAgeCA9IHggLSBjeDtcbiAgICAgICAgICAgIHkgPSB5IC0gY3k7XG4gICAgICAgICAgICB2YXIgc2luID0gTWF0aC5zaW4oYW5nbGUpO1xuICAgICAgICAgICAgdmFyIGNvcyA9IE1hdGguY29zKGFuZ2xlKTtcbiAgICAgICAgICAgIHZhciByeCA9ICgoY29zICogeCkgLSAoc2luICogeSkpIHwgMDtcbiAgICAgICAgICAgIHZhciByeSA9ICgoc2luICogeCkgKyAoY29zICogeSkpIHwgMDtcbiAgICAgICAgICAgIHJ4ID0gcnggKyBjeDtcbiAgICAgICAgICAgIHJ5ID0gcnkgKyBjeTtcblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQb2ludDJEKHJ4LCByeSk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgZWxlbWVudCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9lbGVtZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHBhcmVudCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgX3NldFBhcmVudChwYXJlbnQ6IEFMYXlvdXQpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxheW91dCgpIHtcbiAgICAgICAgICAgIHRoaXMuX25lZWRzTGF5b3V0ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLm1lYXN1cmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBuZWVkc0xheW91dCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9uZWVkc0xheW91dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUcmFuc2xhdGVYKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0ZVg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRyYW5zbGF0ZVgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UcmFuc2xhdGVYLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0cmFuc2xhdGVYKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRyYW5zbGF0ZVgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUcmFuc2xhdGVZKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0ZVk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRyYW5zbGF0ZVkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UcmFuc2xhdGVZLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0cmFuc2xhdGVZKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRyYW5zbGF0ZVkudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgXG5cbiAgICAgICAgLy9cdHB1YmxpYyBmaW5hbCBEb3VibGVQcm9wZXJ0eSByb3RhdGVQcm9wZXJ0eSgpIHtcbiAgICAgICAgLy9cdFx0cmV0dXJuIHJvdGF0ZTtcbiAgICAgICAgLy9cdH1cbiAgICAgICAgLy9cbiAgICAgICAgLy9cdHB1YmxpYyBmaW5hbCBEb3VibGVQcm9wZXJ0eSBzY2FsZVhQcm9wZXJ0eSgpIHtcbiAgICAgICAgLy9cdFx0cmV0dXJuIHNjYWxlWDtcbiAgICAgICAgLy9cdH1cbiAgICAgICAgLy9cbiAgICAgICAgLy9cdHB1YmxpYyBmaW5hbCBEb3VibGVQcm9wZXJ0eSBzY2FsZVlQcm9wZXJ0eSgpIHtcbiAgICAgICAgLy9cdFx0cmV0dXJuIHNjYWxlWTtcbiAgICAgICAgLy9cdH1cbiAgICAgICAgLy9cbiAgICAgICAgLy9cdHB1YmxpYyBmaW5hbCBEb3VibGVQcm9wZXJ0eSB0cmFuc2Zvcm1DZW50ZXJYUHJvcGVydHkoKSB7XG4gICAgICAgIC8vXHRcdHJldHVybiB0cmFuc2Zvcm1DZW50ZXJYO1xuICAgICAgICAvL1x0fVxuICAgICAgICAvL1xuICAgICAgICAvL1x0cHVibGljIGZpbmFsIERvdWJsZVByb3BlcnR5IHRyYW5zZm9ybUNlbnRlcllQcm9wZXJ0eSgpIHtcbiAgICAgICAgLy9cdFx0cmV0dXJuIHRyYW5zZm9ybUNlbnRlclk7XG4gICAgICAgIC8vXHR9XG4gICAgICAgIFxuICAgICAgICBnZXQgUGFkZGluZygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYWRkaW5nO1xuICAgICAgICB9XG4gICAgICAgIGdldCBwYWRkaW5nKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuUGFkZGluZy52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgcGFkZGluZyh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5QYWRkaW5nLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm9yZGVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvcmRlcjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm9yZGVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm9yZGVyLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBib3JkZXIodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQm9yZGVyLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgTWVhc3VyZWRXaWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tZWFzdXJlZFdpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGdldCBtZWFzdXJlZFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuTWVhc3VyZWRXaWR0aC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgbWVhc3VyZWRXaWR0aCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5NZWFzdXJlZFdpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgTWVhc3VyZWRIZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbWVhc3VyZWRIZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IG1lYXN1cmVkSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuTWVhc3VyZWRIZWlnaHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IG1lYXN1cmVkSGVpZ2h0KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLk1lYXN1cmVkSGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQ2xpZW50V2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2xpZW50V2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGNsaWVudFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQ2xpZW50V2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGNsaWVudFdpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkNsaWVudFdpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQ2xpZW50SGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NsaWVudEhlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgY2xpZW50SGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQ2xpZW50SGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBjbGllbnRIZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQ2xpZW50SGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm91bmRzV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYm91bmRzV2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJvdW5kc1dpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm91bmRzV2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGJvdW5kc1dpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkJvdW5kc1dpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm91bmRzSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvdW5kc0hlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm91bmRzSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm91bmRzSGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBib3VuZHNIZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQm91bmRzSGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm91bmRzTGVmdCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib3VuZHNMZWZ0O1xuICAgICAgICB9XG4gICAgICAgIGdldCBib3VuZHNMZWZ0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm91bmRzTGVmdC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYm91bmRzTGVmdCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Cb3VuZHNMZWZ0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm91bmRzVG9wKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvdW5kc1RvcDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm91bmRzVG9wKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm91bmRzVG9wLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBib3VuZHNUb3AodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQm91bmRzVG9wLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IE1pbldpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21pbldpZHRoO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBnZXQgbWluV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5NaW5XaWR0aC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgc2V0IG1pbldpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLk1pbldpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IE1pbkhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9taW5IZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGdldCBtaW5IZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5NaW5IZWlnaHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIHNldCBtaW5IZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuTWluSGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IE1heFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21heFdpZHRoO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBnZXQgbWF4V2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5NYXhXaWR0aC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgc2V0IG1heFdpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLk1heFdpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IE1heEhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tYXhIZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGdldCBtYXhIZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5NYXhIZWlnaHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIHNldCBtYXhIZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuTWF4SGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0cyB0aGUgYmFzZSBwb3NpdGlvbiBvZiB0aGlzIGNvbXBvbmVudCByZWxhdGl2ZSB0byB0aGUgcGFyZW50J3MgdG9wLWxlZnQgY29ybmVyLiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgZnJvbSBhXG4gICAgICAgICAqIGxheW91dCdzIG9uTGF5b3V0IG1ldGhvZCB0byBzZXQgdGhlIGJhc2UgcG9zaXRpb24gb2YgdGhpcyBjb21wb25lbnQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBsZWZ0IFRoZSBsZWZ0IGJhc2UgcG9zaXRpb24gb2YgdGhpcyBjb21wb25lbnQgcmVsYXRpdmUgdG8gdGhlIHBhcmVudHMgdG9wLWxlZnQgY29ybmVyLlxuICAgICAgICAgKiBAcGFyYW0gdG9wIFRoZSB0b3AgYmFzZSBwb3NpdGlvbiBvZiB0aGlzIGNvbXBvbmVudCByZWxhdGl2ZSB0byB0aGUgcGFyZW50cyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqL1xuICAgICAgICBwcm90ZWN0ZWQgc2V0UG9zaXRpb24obGVmdDogbnVtYmVyLCB0b3A6IG51bWJlcikge1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5sZWZ0ID0gXCJcIiArIGxlZnQgKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnRvcCA9IFwiXCIgKyB0b3AgKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLl9sZWZ0ID0gbGVmdDtcbiAgICAgICAgICAgIHRoaXMuX3RvcCA9IHRvcDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIHRoZSBiYXNlIGxlZnQgcG9zaXRpb24gb2YgdGhpcyBjb21wb25lbnQgcmVsYXRpdmUgdG8gdGhlIHBhcmVudCdzIHRvcC1sZWZ0IGNvcm5lci4gVGhpcyBtZXRob2QgaXMgY2FsbGVkXG4gICAgICAgICAqIGZyb20gYSBsYXlvdXQncyBvbkxheW91dCBtZXRob2QgdG8gc2V0IHRoZSBiYXNlIGxlZnQgcG9zaXRpb24gb2YgdGhpcyBjb21wb25lbnQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBsZWZ0IFRoZSBsZWZ0IGJhc2UgcG9zaXRpb24gb2YgdGhpcyBjb21wb25lbnQgcmVsYXRpdmUgdG8gdGhlIHBhcmVudHMgdG9wLWxlZnQgY29ybmVyLlxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIF9zZXRMZWZ0KGxlZnQ6IG51bWJlcikge1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5sZWZ0ID0gXCJcIiArIGxlZnQgKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLl9sZWZ0ID0gbGVmdDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIHRoZSBiYXNlIHRvcCBwb3NpdGlvbiBvZiB0aGlzIGNvbXBvbmVudCByZWxhdGl2ZSB0byB0aGUgcGFyZW50J3MgdG9wLWxlZnQgY29ybmVyLiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgZnJvbVxuICAgICAgICAgKiBhIGxheW91dCdzIG9uTGF5b3V0IG1ldGhvZCB0byBzZXQgdGhlIGJhc2UgdG9wIHBvc2l0aW9uIG9mIHRoaXMgY29tcG9uZW50LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gdG9wIFRoZSB0b3AgYmFzZSBwb3NpdGlvbiBvZiB0aGlzIGNvbXBvbmVudCByZWxhdGl2ZSB0byB0aGUgcGFyZW50cyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgX3NldFRvcCh0b3A6IG51bWJlcikge1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS50b3AgPSBcIlwiICsgdG9wICsgXCJweFwiO1xuICAgICAgICAgICAgdGhpcy5fdG9wID0gdG9wO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgdGhlIHNpemUgb2YgdGhpcyBjb21wb25lbnQuIFRoaXMgbWV0aG9kIGNhbiBiZSBjYWxsZWQgd2hlbiBhIGR5bmFtaWNhbGx5IHNpemVkIGNvbXBvbmVudCdzIHNpemUgaXNcbiAgICAgICAgICogY2FsY3VsYXRlZC4gVHlwaWNhbGx5IGZyb20gdGhlIG9uTGF5b3V0IG1ldGhvZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHdpZHRoIFRoZSB3aWR0aCBvZiB0aGlzIGNvbXBvbmVudC5cbiAgICAgICAgICogQHBhcmFtIGhlaWdodCBUaGUgaGVpZ2h0IG9mIHRoaXMgY29tcG9uZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgcHJvdGVjdGVkIHNldFNpemUod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUud2lkdGggPSBcIlwiICsgd2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLmhlaWdodCA9IFwiXCIgKyBoZWlnaHQgKyBcInB4XCI7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQ3Vyc29yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnNvcjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgY3Vyc29yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQ3Vyc29yLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBjdXJzb3IodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQ3Vyc29yLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgUG9pbnRlclRyYW5zcGFyZW50KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BvaW50ZXJUcmFuc3BhcmVudDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgcG9pbnRlclRyYW5zcGFyZW50KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuUG9pbnRlclRyYW5zcGFyZW50LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBwb2ludGVyVHJhbnNwYXJlbnQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuUG9pbnRlclRyYW5zcGFyZW50LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVmlzaWJsZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92aXNpYmxlO1xuICAgICAgICB9XG4gICAgICAgIGdldCB2aXNpYmxlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVmlzaWJsZS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdmlzaWJsZSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5WaXNpYmxlLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgb25DbGljaygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbkNsaWNrO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IG9uQ29udGV4dE1lbnUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25Db250ZXh0TWVudTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBvbk1vdXNlRG93bigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbk1vdXNlRG93bjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBvbk1vdXNlTW92ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbk1vdXNlTW92ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBvbk1vdXNlVXAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25Nb3VzZVVwO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IG9uTW91c2VFbnRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbk1vdXNlRW50ZXI7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgb25Nb3VzZUxlYXZlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX29uTW91c2VMZWF2ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBvbk1vdXNlV2hlZWwoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25Nb3VzZVdoZWVsO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IG9uS2V5RG93bigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbktleURvd247XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgb25LZXlQcmVzcygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbktleVByZXNzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IG9uS2V5VXAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25LZXlVcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBvblBhcmVudENoYW5nZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25QYXJlbnRDaGFuZ2VkO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEFscGhhKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FscGhhO1xuICAgICAgICB9XG4gICAgICAgIGdldCBhbHBoYSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkFscGhhLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBhbHBoYSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5BbHBoYS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEhhbmRsZVBvaW50ZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGFuZGxlUG9pbnRlcjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgaGFuZGxlUG9pbnRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkhhbmRsZVBvaW50ZXIudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGhhbmRsZVBvaW50ZXIodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuSGFuZGxlUG9pbnRlci52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEVuYWJsZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZW5hYmxlZDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgZW5hYmxlZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkVuYWJsZWQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGVuYWJsZWQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuRW5hYmxlZC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFNlbGVjdGFibGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0YWJsZTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgc2VsZWN0YWJsZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlNlbGVjdGFibGUudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHNlbGVjdGFibGUodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0YWJsZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cblxuICAgICAgICBnZXQgbGVmdCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sZWZ0O1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHRvcCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90b3A7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIGJ5IHRoZSBwYXJlbnQgb2YgdGhpcyBjb21wb25lbnQgd2hlbiBhIHBvaW50ZXIgZXZlbnQgaXMgb2NjdXJlZC4gVGhlIGdvYWwgb2YgdGhpcyBtZXRob2QgaXNcbiAgICAgICAgICogdG8gZGVjaWRlIGlmIHRoaXMgY29tcG9uZW50IHdhbnRzIHRvIGhhbmRsZSB0aGUgZXZlbnQgb3Igbm90LCBhbmQgZGVsZWdhdGUgdGhlIGV2ZW50IHRvIGNoaWxkIGNvbXBvbmVudHMgaWZcbiAgICAgICAgICogbmVlZGVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gc2NyZWVuWCBUaGUgeCBjb29yZGluYXRlIG9mIHRoZSBwb2ludGVyIHJlbGF0aXZlIHRvIHRoZSBzY3JlZW4ncyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqIEBwYXJhbSBzY3JlZW5ZIFRoZSB5IGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50ZXIgcmVsYXRpdmUgdG8gdGhlIHNjcmVlbidzIHRvcC1sZWZ0IGNvcm5lci5cbiAgICAgICAgICogQHBhcmFtIHBhcmVudFNjcmVlblggVGhlIHggY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnRlciByZWxhdGl2ZSB0byB0aGUgcGFyZW50J3MgdG9wLWxlZnQgY29ybmVyLlxuICAgICAgICAgKiBAcGFyYW0gcGFyZW50U2NyZWVuWSBUaGUgeSBjb29yZGluYXRlIG9mIHRoZSBwb2ludGVyIHJlbGF0aXZlIHRvIHRoZSBwYXJlbnQncyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqIEBwYXJhbSB4IFRoZSB4IGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50ZXIgcmVsYXRpdmUgdG8gdGhpcyBjb21wb25lbnQncyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqIEBwYXJhbSB5IFRoZSB5IGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50ZXIgcmVsYXRpdmUgdG8gdGhpcyBjb21wb25lbnQncyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqIEBwYXJhbSB3aGVlbFZlbG9jaXR5IFRoZSBtb3VzZSB3aGVlbCB2ZWxvY2l0eSB2YWx1ZS5cbiAgICAgICAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgdGhlIGV2ZW50LiBWYWxpZCB2YWx1ZXMgYXJlIGxpc3RlZCBpbiBQb2ludGVyRXZlbnRBcmdzIGNsYXNzLlxuICAgICAgICAgKiBAcGFyYW0gYWx0UHJlc3NlZCBJbmRpY2F0ZXMgaWYgdGhlIGFsdCBrZXkgaXMgcHJlc3NlZCB3aGVuIHRoZSBldmVudCBvY2N1cmVkIG9yIG5vdC5cbiAgICAgICAgICogQHBhcmFtIGN0cmxQcmVzc2VkIEluZGljYXRlcyBpZiB0aGUgY3RybCBrZXkgaXMgcHJlc3NlZCB3aGVuIHRoZSBldmVudCBvY2N1cmVkIG9yIG5vdC5cbiAgICAgICAgICogQHBhcmFtIHNoaWZ0UHJlc3NlZCBJbmRpY2F0ZXMgaWYgdGhlIHNoaWZ0IGtleSBpcyBwcmVzc2VkIHdoZW4gdGhlIGV2ZW50IG9jY3VyZWQgb3Igbm90LlxuICAgICAgICAgKiBAcGFyYW0gbWV0YVByZXNzZWQgSW5kaWNhdGVzIGlmIHRoZSBtZXRhIGtleSBpcyBwcmVzc2VkIHdoZW4gdGhlIGV2ZW50IG9jY3VyZWQgb3Igbm90LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIFRydWUgaWYgdGhlIGV2ZW50IGlzIGZ1bGx5IGhhbmRsZWQgYW5kIHVuZGVybGF5aW5nIGNvbXBvbmVudHMgY2FuJ3QgaGFuZGxlIHRoaXMgZXZlbnQsIG90aGVyd2lzZSBmYWxzZSBpZlxuICAgICAgICAgKiB1bmRlcmxheWluZyBjb21wb25lbnRzIGNhbiBoYW5kbGUgdGhpcyBldmVudC5cbiAgICAgICAgICovXG4gICAgICAgIF9kb1BvaW50ZXJFdmVudENsaW1iaW5nVXAoc2NyZWVuWDogbnVtYmVyLCBzY3JlZW5ZOiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyLCB3aGVlbFZlbG9jaXR5OiBudW1iZXIsXG4gICAgICAgICAgICBhbHRQcmVzc2VkOiBib29sZWFuLCBjdHJsUHJlc3NlZDogYm9vbGVhbiwgc2hpZnRQcmVzc2VkOiBib29sZWFuLCBtZXRhUHJlc3NlZDogYm9vbGVhblxuICAgICAgICAgICAgLCBldmVudFR5cGU6IG51bWJlciwgYnV0dG9uOiBudW1iZXIsIG5hdGl2ZUV2ZW50OiBVSUV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2hhbmRsZVBvaW50ZXIudmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5fcG9pbnRlclRyYW5zcGFyZW50LnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuX2VuYWJsZWQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdGhpcy5fdmlzaWJsZS52YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMub25Qb2ludGVyRXZlbnRDbGltYmluZ1VwKHNjcmVlblgsIHNjcmVlblksIHgsIHksIHdoZWVsVmVsb2NpdHksIGFsdFByZXNzZWQsXG4gICAgICAgICAgICAgICAgY3RybFByZXNzZWQsIHNoaWZ0UHJlc3NlZCwgbWV0YVByZXNzZWQsIGV2ZW50VHlwZSwgYnV0dG9uKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9uUG9pbnRlckV2ZW50RmFsbGluZ0Rvd24oc2NyZWVuWCwgc2NyZWVuWSwgeCwgeSwgd2hlZWxWZWxvY2l0eSwgYWx0UHJlc3NlZCxcbiAgICAgICAgICAgICAgICBjdHJsUHJlc3NlZCwgc2hpZnRQcmVzc2VkLCBtZXRhUHJlc3NlZCwgZXZlbnRUeXBlLCBidXR0b24sIG5hdGl2ZUV2ZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vXHRib29sZWFuIGRvUG9pbnRlckV2ZW50RmFsbGluZ0Rvd24oaW50IHNjcmVlblgsIGludCBzY3JlZW5ZLCBpbnQgcGFyZW50U2NyZWVuWCwgaW50IHBhcmVudFNjcmVlblksXG4gICAgICAgIC8vXHRcdFx0aW50IHgsIGludCB5LCBpbnQgd2hlZWxWZWxvY2l0eSwgYm9vbGVhbiBhbHRQcmVzc2VkLCBib29sZWFuIGN0cmxQcmVzc2VkLCBib29sZWFuIHNoaWZ0UHJlc3NlZCxcbiAgICAgICAgLy9cdFx0XHRib29sZWFuIG1ldGFQcmVzc2VkLCBpbnQgdHlwZSkge1xuICAgICAgICAvL1x0XHRyZXR1cm4gb25Qb2ludGVyRXZlbnRGYWxsaW5nRG93bihzY3JlZW5YLCBzY3JlZW5ZLCBwYXJlbnRTY3JlZW5YLCBwYXJlbnRTY3JlZW5ZLCB4LCB5LCB3aGVlbFZlbG9jaXR5LCBhbHRQcmVzc2VkLFxuICAgICAgICAvL1x0XHRcdFx0Y3RybFByZXNzZWQsIHNoaWZ0UHJlc3NlZCwgbWV0YVByZXNzZWQsIHR5cGUpO1xuICAgICAgICAvL1x0fVxuICAgICAgICAvKipcbiAgICAgICAgICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIHdoZW4gYSBwb2ludGVyIGV2ZW50IGlzIGNsaW1iaW5nIHVwIG9uIHRoZSBjb21wb25lbnQgaGllcmFyY2h5LiBUaGUgZ29hbCBvZiB0aGlzIG1ldGhvZCBpc1xuICAgICAgICAgKiB0byBkZWNpZGUgaWYgdGhlIGV2ZW50IGNhbiByZWFjaCBjaGlsZCBjb21wb25lbnRzIG9yIG5vdC4gSW4gdGhlIG1vc3Qgb2YgdGhlIGNhc2VzIHlvdSBkb24ndCBuZWVkIHRvIG92ZXJ3cml0ZVxuICAgICAgICAgKiB0aGlzIG1ldGhvZC4gVGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gaXMgcmV0dXJucyB0cnVlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gc2NyZWVuWCBUaGUgeCBjb29yZGluYXRlIG9mIHRoZSBwb2ludGVyIHJlbGF0aXZlIHRvIHRoZSBzY3JlZW4ncyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqIEBwYXJhbSBzY3JlZW5ZIFRoZSB5IGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50ZXIgcmVsYXRpdmUgdG8gdGhlIHNjcmVlbidzIHRvcC1sZWZ0IGNvcm5lci5cbiAgICAgICAgICogQHBhcmFtIHggVGhlIHggY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnRlciByZWxhdGl2ZSB0byB0aGlzIGNvbXBvbmVudCdzIHRvcC1sZWZ0IGNvcm5lci5cbiAgICAgICAgICogQHBhcmFtIHkgVGhlIHkgY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnRlciByZWxhdGl2ZSB0byB0aGlzIGNvbXBvbmVudCdzIHRvcC1sZWZ0IGNvcm5lci5cbiAgICAgICAgICogQHBhcmFtIHdoZWVsVmVsb2NpdHkgVGhlIG1vdXNlIHdoZWVsIHZlbG9jaXR5IHZhbHVlLlxuICAgICAgICAgKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSBvZiB0aGUgZXZlbnQuIFZhbGlkIHZhbHVlcyBhcmUgbGlzdGVkIGluIFBvaW50ZXJFdmVudEFyZ3MgY2xhc3MuXG4gICAgICAgICAqIEBwYXJhbSBhbHRQcmVzc2VkIEluZGljYXRlcyBpZiB0aGUgYWx0IGtleSBpcyBwcmVzc2VkIHdoZW4gdGhlIGV2ZW50IG9jY3VyZWQgb3Igbm90LlxuICAgICAgICAgKiBAcGFyYW0gY3RybFByZXNzZWQgSW5kaWNhdGVzIGlmIHRoZSBjdHJsIGtleSBpcyBwcmVzc2VkIHdoZW4gdGhlIGV2ZW50IG9jY3VyZWQgb3Igbm90LlxuICAgICAgICAgKiBAcGFyYW0gc2hpZnRQcmVzc2VkIEluZGljYXRlcyBpZiB0aGUgc2hpZnQga2V5IGlzIHByZXNzZWQgd2hlbiB0aGUgZXZlbnQgb2NjdXJlZCBvciBub3QuXG4gICAgICAgICAqIEBwYXJhbSBtZXRhUHJlc3NlZCBJbmRpY2F0ZXMgaWYgdGhlIG1ldGEga2V5IGlzIHByZXNzZWQgd2hlbiB0aGUgZXZlbnQgb2NjdXJlZCBvciBub3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4gRmFsc2UgaWYgdGhpcyBldmVudCBjYW4ndCByZWFjaCBvdmVybGF5aW5nIGNvbXBvbmVudHMsIG9yIHRydWUgaWYgb3ZlcmxheWluZyBjb21wb25lbnRzIGNhbiBhbHNvIGdldCB0aGVcbiAgICAgICAgICogY2xpbWJpbmcgdXAgZXZlbnQuXG4gICAgICAgICAqL1xuICAgICAgICBwcm90ZWN0ZWQgb25Qb2ludGVyRXZlbnRDbGltYmluZ1VwKHNjcmVlblg6IG51bWJlciwgc2NyZWVuWTogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlciwgd2hlZWxWZWxvY2l0eTogbnVtYmVyLFxuICAgICAgICAgICAgYWx0UHJlc3NlZDogYm9vbGVhbiwgY3RybFByZXNzZWQ6IGJvb2xlYW4sIHNoaWZ0UHJlc3NlZDogYm9vbGVhbiwgbWV0YVByZXNzZWQ6IGJvb2xlYW5cbiAgICAgICAgICAgICwgZXZlbnRUeXBlOiBudW1iZXIsIGJ1dHRvbjogbnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgd2hlbiBhIHBvaW50ZXIgZXZlbnQgaXMgZmFsbGluZyBkb3duIG9uIHRoZSBjb21wb25lbnQgaGllcmFyY2h5LiBUaGUgZ29hbCBvZiB0aGlzIG1ldGhvZCBpc1xuICAgICAgICAgKiB0byBmaXJlIGV2ZW50cyBpZiBuZWVkZWQsIGFuZCBpbiB0aGUgcmVzdWx0IHR5cGUgZGVmaW5lIGlmIHRoZSB1bmRlcmxheWluZyBjb21wb25lbnRzIGNhbiBwcm9jZXNzIHRoaXMgZXZlbnQgdG9vLlxuICAgICAgICAgKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBpcyBmaXJlcyB0aGUgYXNzb2NpYXRlZCBldmVudCwgYW5kIHJldHVybnMgdHJ1ZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHNjcmVlblggVGhlIHggY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnRlciByZWxhdGl2ZSB0byB0aGUgc2NyZWVuJ3MgdG9wLWxlZnQgY29ybmVyLlxuICAgICAgICAgKiBAcGFyYW0gc2NyZWVuWSBUaGUgeSBjb29yZGluYXRlIG9mIHRoZSBwb2ludGVyIHJlbGF0aXZlIHRvIHRoZSBzY3JlZW4ncyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqIEBwYXJhbSB4IFRoZSB4IGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50ZXIgcmVsYXRpdmUgdG8gdGhpcyBjb21wb25lbnQncyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqIEBwYXJhbSB5IFRoZSB5IGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50ZXIgcmVsYXRpdmUgdG8gdGhpcyBjb21wb25lbnQncyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqIEBwYXJhbSB3aGVlbFZlbG9jaXR5IFRoZSBtb3VzZSB3aGVlbCB2ZWxvY2l0eSB2YWx1ZS5cbiAgICAgICAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgdGhlIGV2ZW50LiBWYWxpZCB2YWx1ZXMgYXJlIGxpc3RlZCBpbiBQb2ludGVyRXZlbnRBcmdzIGNsYXNzLlxuICAgICAgICAgKiBAcGFyYW0gYWx0UHJlc3NlZCBJbmRpY2F0ZXMgaWYgdGhlIGFsdCBrZXkgaXMgcHJlc3NlZCB3aGVuIHRoZSBldmVudCBvY2N1cmVkIG9yIG5vdC5cbiAgICAgICAgICogQHBhcmFtIGN0cmxQcmVzc2VkIEluZGljYXRlcyBpZiB0aGUgY3RybCBrZXkgaXMgcHJlc3NlZCB3aGVuIHRoZSBldmVudCBvY2N1cmVkIG9yIG5vdC5cbiAgICAgICAgICogQHBhcmFtIHNoaWZ0UHJlc3NlZCBJbmRpY2F0ZXMgaWYgdGhlIHNoaWZ0IGtleSBpcyBwcmVzc2VkIHdoZW4gdGhlIGV2ZW50IG9jY3VyZWQgb3Igbm90LlxuICAgICAgICAgKiBAcGFyYW0gbWV0YVByZXNzZWQgSW5kaWNhdGVzIGlmIHRoZSBtZXRhIGtleSBpcyBwcmVzc2VkIHdoZW4gdGhlIGV2ZW50IG9jY3VyZWQgb3Igbm90LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIFRydWUgaWYgdGhpcyBldmVudCBpcyBmdWxseSBwcm9jZXNzZWQsIGFuZCB1bmRlcmxheWluZyBjb21wb25lbnRzIGNhbid0IHByb2Nlc3MgdGhpcyBldmVudCwgb3IgZmFsc2UgaWZcbiAgICAgICAgICogdW5kZXJsYXlpbmcgY29tcG9uZW50cyBjYW4gYWxzbyBnZXQgdGhlIGZhbGxpbmcgZG93biBldmVudC5cbiAgICAgICAgICovXG4gICAgICAgIHByb3RlY3RlZCBvblBvaW50ZXJFdmVudEZhbGxpbmdEb3duKHNjcmVlblg6IG51bWJlciwgc2NyZWVuWTogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlciwgd2hlZWxWZWxvY2l0eTogbnVtYmVyLFxuICAgICAgICAgICAgYWx0UHJlc3NlZDogYm9vbGVhbiwgY3RybFByZXNzZWQ6IGJvb2xlYW4sIHNoaWZ0UHJlc3NlZDogYm9vbGVhbiwgbWV0YVByZXNzZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICBldmVudFR5cGU6IG51bWJlciwgYnV0dG9uOiBudW1iZXIsIG5hdGl2ZUV2ZW50OiBVSUV2ZW50KSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGV2ZW50VHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgTW91c2VFdmVudFR5cGVzLk1PVVNFX0RPV046XG4gICAgICAgICAgICAgICAgICAgIHZhciBtZGVhID0gbmV3IE1vdXNlRG93bkV2ZW50QXJncyhzY3JlZW5YLCBzY3JlZW5ZLCB4LCB5LCBhbHRQcmVzc2VkLCBjdHJsUHJlc3NlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoaWZ0UHJlc3NlZCwgbWV0YVByZXNzZWQsIGJ1dHRvbiwgPE1vdXNlRXZlbnQ+bmF0aXZlRXZlbnQsIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICAvL3RoaXMucmVnaXN0ZXJEb3duRXZlbnQoc2NyZWVuWCwgc2NyZWVuWSwgeCwgeSwgYWx0UHJlc3NlZCwgY3RybFByZXNzZWQsIHNoaWZ0UHJlc3NlZCwgbWV0YVByZXNzZWQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbk1vdXNlRG93bi5maXJlRXZlbnQobWRlYSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgTW91c2VFdmVudFR5cGVzLk1PVVNFX01PVkU6XG4gICAgICAgICAgICAgICAgICAgIHZhciBtbWVhID0gbmV3IE1vdXNlTW92ZUV2ZW50QXJncyhzY3JlZW5YLCBzY3JlZW5ZLCB4LCB5LCBhbHRQcmVzc2VkLCBjdHJsUHJlc3NlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoaWZ0UHJlc3NlZCwgbWV0YVByZXNzZWQsIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbk1vdXNlTW92ZS5maXJlRXZlbnQobW1lYSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgTW91c2VFdmVudFR5cGVzLk1PVVNFX0VOVEVSOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbk1vdXNlRW50ZXIuZmlyZUV2ZW50KG5ldyBFdmVudEFyZ3ModGhpcykpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIE1vdXNlRXZlbnRUeXBlcy5NT1VTRV9MRUFWRTpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25Nb3VzZUxlYXZlLmZpcmVFdmVudChuZXcgRXZlbnRBcmdzKHRoaXMpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBNb3VzZUV2ZW50VHlwZXMuTU9VU0VfV0hFRUw6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29uTW91c2VXaGVlbC5maXJlRXZlbnQobmV3IE1vdXNlV2hlZWxFdmVudEFyZ3Mod2hlZWxWZWxvY2l0eSwgYWx0UHJlc3NlZCwgY3RybFByZXNzZWQsIHNoaWZ0UHJlc3NlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGFQcmVzc2VkLCB0aGlzKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAgICAgICAgcHJvdGVjdGVkIHJlZ2lzdGVyRG93bkV2ZW50KHNjcmVlblg6IG51bWJlciwgc2NyZWVuWTogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlcixcbiAgICAgICAgLy8gICAgICAgICAgICBhbHRQcmVzc2VkOiBib29sZWFuLCBjdHJsUHJlc3NlZDogYm9vbGVhbiwgc2hpZnRQcmVzc2VkOiBib29sZWFuLCBtZXRhUHJlc3NlZDogYm9vbGVhbikge1xuICAgICAgICAvLyAgICAgICAgICAgIEFDb21wb25lbnQubG9nUG9pbnRlckRvd25FdmVudChuZXcgTW91c2VEb3duRXZlbnRMb2codGhpcywgc2NyZWVuWCwgc2NyZWVuWSwgeCwgeSkpO1xuICAgICAgICAvLyAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbmRpY2F0ZXMgaWYgdGhpcyBjb21wb25lbnQgaXMgaW50ZXJzZWN0cyB0aGUgZ2l2ZW4gcG9pbnQuIFRoZSB4IGFuZCB5IGNvb3JkaW5hdGUgaXMgcmVsYXRpdmUgdG8gdGhlIHBhcmVudCdzXG4gICAgICAgICAqIHRvcC1sZWZ0IGNvb3JkaW5hdGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB4IFRoZSB4IGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50LlxuICAgICAgICAgKiBAcGFyYW0geSBUaGUgeSBjb29yZGluYXRlIG9mIHRoZSBwb2ludC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiBUcnVlIGlmIHRoaXMgY29tcG9uZW50IGlzIGludGVyc2VjdHMgdGhlIGdpdmVuIHBvaW50LCBvdGhlcndpc2UgZmFsc2UuXG4gICAgICAgICAqL1xuICAgICAgICBfaXNJbnRlcnNlY3RzUG9pbnQoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICAgICAgICAgIC8vIG1lYXN1cmVkIHBvc2l0aW9uc1xuICAgICAgICAgICAgdmFyIHgxID0gdGhpcy5fbGVmdCArIHRoaXMuX3RyYW5zbGF0ZVgudmFsdWU7XG4gICAgICAgICAgICB2YXIgeTEgPSB0aGlzLl90b3AgKyB0aGlzLl90cmFuc2xhdGVZLnZhbHVlO1xuICAgICAgICAgICAgdmFyIHgyID0geDEgKyB0aGlzLl9tZWFzdXJlZFdpZHRoLnZhbHVlO1xuICAgICAgICAgICAgdmFyIHkyID0geTE7XG4gICAgICAgICAgICB2YXIgeDMgPSB4MjtcbiAgICAgICAgICAgIHZhciB5MyA9IHkyICsgdGhpcy5fbWVhc3VyZWRIZWlnaHQudmFsdWU7XG4gICAgICAgICAgICB2YXIgeDQgPSB4MTtcbiAgICAgICAgICAgIHZhciB5NCA9IHkzO1xuXG4gICAgICAgICAgICAvLyBzY2FsZSBwb2ludHNcbiAgICAgICAgICAgIGlmICh0aGlzLl9zY2FsZVgudmFsdWUgIT0gMS4wKSB7XG4gICAgICAgICAgICAgICAgeDEgPSAoeDEgLSAoKHgyIC0geDEpICogdGhpcy5fdHJhbnNmb3JtQ2VudGVyWC52YWx1ZSAqIHRoaXMuX3NjYWxlWC52YWx1ZSkpIHwgMDtcbiAgICAgICAgICAgICAgICB4MiA9ICh4MSArICgoeDIgLSB4MSkgKiAoMSAtIHRoaXMuX3RyYW5zZm9ybUNlbnRlclgudmFsdWUpICogdGhpcy5fc2NhbGVYLnZhbHVlKSkgfCAwO1xuICAgICAgICAgICAgICAgIHgzID0geDI7XG4gICAgICAgICAgICAgICAgeDQgPSB4MTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLl9zY2FsZVkudmFsdWUgIT0gMS4wKSB7XG4gICAgICAgICAgICAgICAgeTEgPSAoeTEgLSAoKHkyIC0geTEpICogdGhpcy5fdHJhbnNmb3JtQ2VudGVyWS52YWx1ZSAqIHRoaXMuX3NjYWxlWS52YWx1ZSkpIHwgMDtcbiAgICAgICAgICAgICAgICB5NCA9ICh5NCArICgoeTQgLSB5MSkgKiAoMSAtIHRoaXMuX3RyYW5zZm9ybUNlbnRlclkudmFsdWUpICogdGhpcy5fc2NhbGVZLnZhbHVlKSkgfCAwO1xuICAgICAgICAgICAgICAgIHkyID0geTE7XG4gICAgICAgICAgICAgICAgeTMgPSB5NDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gcm90YXRlUG9pbnRzXG4gICAgICAgICAgICBpZiAodGhpcy5yb3RhdGUgIT0gMC4wKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJweCA9ICh4MSArICgoeDIgLSB4MSkgKiB0aGlzLnRyYW5zZm9ybUNlbnRlclgpKSB8IDA7XG4gICAgICAgICAgICAgICAgdmFyIHJweSA9ICh5MSArICgoeTQgLSB5MSkgKiB0aGlzLnRyYW5zZm9ybUNlbnRlclgpKSB8IDA7XG4gICAgICAgICAgICAgICAgdmFyIHRsID0gdGhpcy5yb3RhdGVQb2ludCgwLCAwLCB4MSAtIHJweCwgeTEgLSBycHksIHRoaXMucm90YXRlKTtcbiAgICAgICAgICAgICAgICB2YXIgdHIgPSB0aGlzLnJvdGF0ZVBvaW50KDAsIDAsIHgyIC0gcnB4LCB5MiAtIHJweSwgdGhpcy5yb3RhdGUpO1xuICAgICAgICAgICAgICAgIHZhciBiciA9IHRoaXMucm90YXRlUG9pbnQoMCwgMCwgeDMgLSBycHgsIHkzIC0gcnB5LCB0aGlzLnJvdGF0ZSk7XG4gICAgICAgICAgICAgICAgdmFyIGJsID0gdGhpcy5yb3RhdGVQb2ludCgwLCAwLCB4NCAtIHJweCwgeTQgLSBycHksIHRoaXMucm90YXRlKTtcbiAgICAgICAgICAgICAgICB4MSA9IHRsLnggKyBycHg7XG4gICAgICAgICAgICAgICAgeTEgPSB0bC55ICsgcnB5O1xuICAgICAgICAgICAgICAgIHgyID0gdHIueCArIHJweDtcbiAgICAgICAgICAgICAgICB5MiA9IHRyLnkgKyBycHk7XG4gICAgICAgICAgICAgICAgeDMgPSBici54ICsgcnB4O1xuICAgICAgICAgICAgICAgIHkzID0gYnIueSArIHJweTtcbiAgICAgICAgICAgICAgICB4NCA9IGJsLnggKyBycHg7XG4gICAgICAgICAgICAgICAgeTQgPSBibC55ICsgcnB5O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgY250ID0gMDtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzUG9pbnRJbnRlcnNlY3RzTGluZSh4LCB5LCB4MSwgeTEsIHgyLCB5MikpIHtcbiAgICAgICAgICAgICAgICBjbnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmlzUG9pbnRJbnRlcnNlY3RzTGluZSh4LCB5LCB4MiwgeTIsIHgzLCB5MykpIHtcbiAgICAgICAgICAgICAgICBjbnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmlzUG9pbnRJbnRlcnNlY3RzTGluZSh4LCB5LCB4MywgeTMsIHg0LCB5NCkpIHtcbiAgICAgICAgICAgICAgICBjbnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmlzUG9pbnRJbnRlcnNlY3RzTGluZSh4LCB5LCB4NCwgeTQsIHgxLCB5MSkpIHtcbiAgICAgICAgICAgICAgICBjbnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjbnQgPT0gMSB8fCBjbnQgPT0gMztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgaXNQb2ludEludGVyc2VjdHNMaW5lKHB4OiBudW1iZXIsIHB5OiBudW1iZXIsIGx4MTogbnVtYmVyLCBseTE6IG51bWJlciwgbHgyOiBudW1iZXIsIGx5MjogbnVtYmVyKSB7XG4gICAgICAgICAgICAvKiAoKHBvbHlbaV1bMV0gPiB5KSAhPSAocG9seVtqXVsxXSA+IHkpKSBhbmQgXFxcbiAgICAgICAgICAgICAoeCA8IChwb2x5W2pdWzBdIC0gcG9seVtpXVswXSkgKiAoeSAtIHBvbHlbaV1bMV0pIC8gKHBvbHlbal1bMV0gLSBwb2x5W2ldWzFdKSArIHBvbHlbaV1bMF0pXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHJldHVybiAoKGx5MSA+IHB5KSAhPSAobHkyID4gcHkpKSAmJiAocHggPCAobHgyIC0gbHgxKSAqICgocHkgLSBseTEpKSAvIChseTIgLSBseTEpICsgbHgxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBSb3RhdGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcm90YXRlO1xuICAgICAgICB9XG4gICAgICAgIGdldCByb3RhdGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Sb3RhdGUudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHJvdGF0ZSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Sb3RhdGUudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBTY2FsZVgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2NhbGVYO1xuICAgICAgICB9XG4gICAgICAgIGdldCBzY2FsZVgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5TY2FsZVgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHNjYWxlWCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5TY2FsZVgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBTY2FsZVkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2NhbGVZO1xuICAgICAgICB9XG4gICAgICAgIGdldCBzY2FsZVkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5TY2FsZVkudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHNjYWxlWSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5TY2FsZVkudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUcmFuc2Zvcm1DZW50ZXJYKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zZm9ybUNlbnRlclg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRyYW5zZm9ybUNlbnRlclgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UcmFuc2Zvcm1DZW50ZXJYLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0cmFuc2Zvcm1DZW50ZXJYKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRyYW5zZm9ybUNlbnRlclgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUcmFuc2Zvcm1DZW50ZXJZKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zZm9ybUNlbnRlclk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRyYW5zZm9ybUNlbnRlclkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UcmFuc2Zvcm1DZW50ZXJZLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0cmFuc2Zvcm1DZW50ZXJZKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRyYW5zZm9ybUNlbnRlclkudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBIb3ZlcmVkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hvdmVyZWQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGhvdmVyZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Ib3ZlcmVkLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBob3ZlcmVkKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkhvdmVyZWQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBQcmVzc2VkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ByZXNzZWQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHByZXNzZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5QcmVzc2VkLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBwcmVzc2VkKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlByZXNzZWQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG5cblxuICAgICAgICAvLyAgICAgICAgcHVibGljIGZpbmFsIGludCBnZXRTY3JlZW5YKCkge1xuICAgICAgICAvLyAgICAgICAgICAgIHJldHVybiBnZXRFbGVtZW50KCkuZ2V0QWJzb2x1dGVMZWZ0KCk7XG4gICAgICAgIC8vICAgICAgICB9XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgICAgICBwdWJsaWMgZmluYWwgaW50IGdldFNjcmVlblkoKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgcmV0dXJuIGdldEVsZW1lbnQoKS5nZXRBYnNvbHV0ZVRvcCgpO1xuICAgICAgICAvLyAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG5cbn1cblxuXG4iLCJtb2R1bGUgY3ViZWUge1xuXG4gICAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFMYXlvdXQgZXh0ZW5kcyBBQ29tcG9uZW50IHtcbiAgICAgICAgcHJpdmF0ZSBfY2hpbGRyZW4gPSBuZXcgTGF5b3V0Q2hpbGRyZW4odGhpcyk7XG5cbiAgICAgICAgY29uc3RydWN0b3IoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHN1cGVyKGVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIGdldCBjaGlsZHJlbl9pbm5lcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBhYnN0cmFjdCBfb25DaGlsZEFkZGVkKGNoaWxkOiBBQ29tcG9uZW50KTogdm9pZDtcblxuICAgICAgICBwdWJsaWMgYWJzdHJhY3QgX29uQ2hpbGRSZW1vdmVkKGNoaWxkOiBBQ29tcG9uZW50LCBpbmRleDogbnVtYmVyKTogdm9pZDtcblxuICAgICAgICBwdWJsaWMgYWJzdHJhY3QgX29uQ2hpbGRyZW5DbGVhcmVkKCk6IHZvaWQ7XG5cbiAgICAgICAgbGF5b3V0KCkge1xuICAgICAgICAgICAgdGhpcy5fbmVlZHNMYXlvdXQgPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbl9pbm5lci5zaXplKCk7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuY2hpbGRyZW5faW5uZXIuZ2V0KGkpO1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZC5uZWVkc0xheW91dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQubGF5b3V0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm9uTGF5b3V0KCk7XG4gICAgICAgICAgICB0aGlzLm1lYXN1cmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBfZG9Qb2ludGVyRXZlbnRDbGltYmluZ1VwKHNjcmVlblg6IG51bWJlciwgc2NyZWVuWTogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlciwgd2hlZWxWZWxvY2l0eTogbnVtYmVyLFxuICAgICAgICAgICAgYWx0UHJlc3NlZDogYm9vbGVhbiwgY3RybFByZXNzZWQ6IGJvb2xlYW4sIHNoaWZ0UHJlc3NlZDogYm9vbGVhbiwgbWV0YVByZXNzZWQ6IGJvb2xlYW4sIHR5cGU6IG51bWJlciwgYnV0dG9uOiBudW1iZXIsIGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaGFuZGxlUG9pbnRlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdGhpcy5lbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRoaXMudmlzaWJsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLm9uUG9pbnRlckV2ZW50Q2xpbWJpbmdVcChzY3JlZW5YLCBzY3JlZW5ZLCB4LCB5LCB3aGVlbFZlbG9jaXR5LCBhbHRQcmVzc2VkLFxuICAgICAgICAgICAgICAgIGN0cmxQcmVzc2VkLCBzaGlmdFByZXNzZWQsIG1ldGFQcmVzc2VkLCB0eXBlLCBidXR0b24pKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMuX2NoaWxkcmVuLnNpemUoKSAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuX2NoaWxkcmVuLmdldChpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYXJlbnRYID0geCArIHRoaXMuZWxlbWVudC5zY3JvbGxMZWZ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBhcmVudFkgPSB5ICsgdGhpcy5lbGVtZW50LnNjcm9sbFRvcDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwID0gdGhpcy5wYWRkaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHAgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudFggLT0gcC5sZWZ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudFkgLT0gcC50b3A7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGQuX2lzSW50ZXJzZWN0c1BvaW50KHBhcmVudFgsIHBhcmVudFkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxlZnQgPSBjaGlsZC5sZWZ0ICsgY2hpbGQudHJhbnNsYXRlWDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdG9wID0gY2hpbGQudG9wICsgY2hpbGQudHJhbnNsYXRlWTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGN4ID0gKGxlZnQgKyBjaGlsZC5tZWFzdXJlZFdpZHRoICogY2hpbGQudHJhbnNmb3JtQ2VudGVyWCkgfCAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0Y3kgPSAodG9wICsgY2hpbGQubWVhc3VyZWRIZWlnaHQgKiBjaGlsZC50cmFuc2Zvcm1DZW50ZXJZKSB8IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNoaWxkUG9pbnQgPSB0aGlzLl9yb3RhdGVQb2ludCh0Y3gsIHRjeSwgcGFyZW50WCwgcGFyZW50WSwgLWNoaWxkLnJvdGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNoaWxkWCA9IGNoaWxkUG9pbnQueDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2hpbGRZID0gY2hpbGRQb2ludC55O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkWCA9IGNoaWxkWCAtIGxlZnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRZID0gY2hpbGRZIC0gdG9wO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRPRE8gc2NhbGUgYmFjayBwb2ludFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZC5fZG9Qb2ludGVyRXZlbnRDbGltYmluZ1VwKHNjcmVlblgsIHNjcmVlblksIGNoaWxkWCwgY2hpbGRZLCB3aGVlbFZlbG9jaXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbHRQcmVzc2VkLCBjdHJsUHJlc3NlZCwgc2hpZnRQcmVzc2VkLCBtZXRhUHJlc3NlZCwgdHlwZSwgYnV0dG9uLCBldmVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMucG9pbnRlclRyYW5zcGFyZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5vblBvaW50ZXJFdmVudEZhbGxpbmdEb3duKHNjcmVlblgsIHNjcmVlblksIHgsIHksIHdoZWVsVmVsb2NpdHksIGFsdFByZXNzZWQsXG4gICAgICAgICAgICAgICAgICAgIGN0cmxQcmVzc2VkLCBzaGlmdFByZXNzZWQsIG1ldGFQcmVzc2VkLCB0eXBlLCBidXR0b24sIGV2ZW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcm90YXRlUG9pbnQoY3g6IG51bWJlciwgY3k6IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIsIGFuZ2xlOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGFuZ2xlID0gKGFuZ2xlICogMzYwKSAqIChNYXRoLlBJIC8gMTgwKTtcbiAgICAgICAgICAgIHggPSB4IC0gY3g7XG4gICAgICAgICAgICB5ID0geSAtIGN5O1xuICAgICAgICAgICAgdmFyIHNpbiA9IE1hdGguc2luKGFuZ2xlKTtcbiAgICAgICAgICAgIHZhciBjb3MgPSBNYXRoLmNvcyhhbmdsZSk7XG4gICAgICAgICAgICB2YXIgcnggPSAoKGNvcyAqIHgpIC0gKHNpbiAqIHkpKSB8IDA7XG4gICAgICAgICAgICB2YXIgcnkgPSAoKHNpbiAqIHgpICsgKGNvcyAqIHkpKSB8IDA7XG4gICAgICAgICAgICByeCA9IHJ4ICsgY3g7XG4gICAgICAgICAgICByeSA9IHJ5ICsgY3k7XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUG9pbnQyRChyeCwgcnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIGFic3RyYWN0IG9uTGF5b3V0KCk6IHZvaWQ7XG5cbiAgICAgICAgZ2V0Q29tcG9uZW50c0F0UG9zaXRpb24oeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICAgICAgICAgIHZhciByZXM6IEFDb21wb25lbnRbXSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnRzQXRQb3NpdGlvbl9pbXBsKHRoaXMsIHgsIHksIHJlcyk7XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBnZXRDb21wb25lbnRzQXRQb3NpdGlvbl9pbXBsKHJvb3Q6IEFMYXlvdXQsIHg6IG51bWJlciwgeTogbnVtYmVyLCByZXN1bHQ6IEFDb21wb25lbnRbXSkge1xuICAgICAgICAgICAgaWYgKHggPj0gMCAmJiB4IDw9IHJvb3QuYm91bmRzV2lkdGggJiYgeSA+PSAwICYmIHkgPD0gcm9vdC5ib3VuZHNIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuc3BsaWNlKDAsIDAsIHJvb3QpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm9vdC5jaGlsZHJlbl9pbm5lci5zaXplKCk7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29tcG9uZW50ID0gcm9vdC5jaGlsZHJlbl9pbm5lci5nZXQoaSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGV0IHR4ID0geCAtIGNvbXBvbmVudC5sZWZ0IC0gY29tcG9uZW50LnRyYW5zbGF0ZVg7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0eSA9IHkgLSBjb21wb25lbnQudG9wIC0gY29tcG9uZW50LnRyYW5zbGF0ZVk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBBTGF5b3V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbDogQUxheW91dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50c0F0UG9zaXRpb25faW1wbCg8QUxheW91dD5jb21wb25lbnQsIHR4LCB0eSwgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eCA+PSAwICYmIHR4IDw9IGNvbXBvbmVudC5ib3VuZHNXaWR0aCAmJiB5ID49IDAgJiYgeSA8PSBjb21wb25lbnQuYm91bmRzSGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnNwbGljZSgwLCAwLCBjb21wb25lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIHNldENoaWxkTGVmdChjaGlsZDogQUNvbXBvbmVudCwgbGVmdDogbnVtYmVyKSB7XG4gICAgICAgICAgICBjaGlsZC5fc2V0TGVmdChsZWZ0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBzZXRDaGlsZFRvcChjaGlsZDogQUNvbXBvbmVudCwgdG9wOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGNoaWxkLl9zZXRUb3AodG9wKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG4iLCJtb2R1bGUgY3ViZWUge1xuXG4gICAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFVc2VyQ29udHJvbCBleHRlbmRzIEFMYXlvdXQge1xuXG4gICAgICAgIHByaXZhdGUgX3dpZHRoID0gbmV3IE51bWJlclByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfaGVpZ2h0ID0gbmV3IE51bWJlclByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYmFja2dyb3VuZCA9IG5ldyBCYWNrZ3JvdW5kUHJvcGVydHkobmV3IENvbG9yQmFja2dyb3VuZChDb2xvci5UUkFOU1BBUkVOVCksIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfc2hhZG93ID0gbmV3IFByb3BlcnR5PEJveFNoYWRvdz4obnVsbCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9kcmFnZ2FibGUgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlKTtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93WCA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUub3ZlcmZsb3dZID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgIHRoaXMuX3dpZHRoLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fd2lkdGgudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJ3aWR0aFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2lkdGggPSBcIlwiICsgdGhpcy5fd2lkdGgudmFsdWUgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl93aWR0aC5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9oZWlnaHQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9oZWlnaHQudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJoZWlnaHRcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmhlaWdodCA9IFwiXCIgKyB0aGlzLl9oZWlnaHQudmFsdWUgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9oZWlnaHQuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYmFja2dyb3VuZENvbG9yXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImJhY2tncm91bmRJbWFnZVwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJiYWNrZ3JvdW5kXCIpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9iYWNrZ3JvdW5kLnZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZC52YWx1ZS5hcHBseSh0aGlzLmVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZC5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9zaGFkb3cuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zaGFkb3cudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJib3hTaGFkb3dcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhZG93LnZhbHVlLmFwcGx5KHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9kcmFnZ2FibGUuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9kcmFnZ2FibGUudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcImRyYWdnYWJsZVwiLCBcInRydWVcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcImRyYWdnYWJsZVwiLCBcImZhbHNlXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZHJhZ2dhYmxlLmludmFsaWRhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBnZXQgX1dpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dpZHRoO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBnZXQgV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGdldCB3aWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLldpZHRoLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBzZXQgd2lkdGgodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuV2lkdGgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcHJvdGVjdGVkIGdldCBfSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IEhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGdldCBoZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5IZWlnaHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIHNldCBoZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuSGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IF9CYWNrZ3JvdW5kKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JhY2tncm91bmQ7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGdldCBCYWNrZ3JvdW5kKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JhY2tncm91bmQ7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGdldCBiYWNrZ3JvdW5kKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQmFja2dyb3VuZC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgc2V0IGJhY2tncm91bmQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQmFja2dyb3VuZC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIGdldCBfU2hhZG93KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NoYWRvdztcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IFNoYWRvdygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zaGFkb3c7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGdldCBzaGFkb3coKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5TaGFkb3cudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIHNldCBzaGFkb3codmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuU2hhZG93LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgRHJhZ2dhYmxlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RyYWdnYWJsZTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgZHJhZ2dhYmxlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRHJhZ2dhYmxlLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBkcmFnZ2FibGUodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuRHJhZ2dhYmxlLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgX29uQ2hpbGRBZGRlZChjaGlsZDogQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgaWYgKGNoaWxkICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hpbGQuZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBfb25DaGlsZFJlbW92ZWQoY2hpbGQ6IEFDb21wb25lbnQsIGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmIChjaGlsZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNoaWxkKGNoaWxkLmVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgX29uQ2hpbGRyZW5DbGVhcmVkKCkge1xuICAgICAgICAgICAgdmFyIHJvb3QgPSB0aGlzLmVsZW1lbnQ7XG4gICAgICAgICAgICB2YXIgZSA9IHRoaXMuZWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICAgICAgICAgIHdoaWxlIChlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICByb290LnJlbW92ZUNoaWxkKGUpO1xuICAgICAgICAgICAgICAgIGUgPSByb290LmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgb25MYXlvdXQoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy53aWR0aCAhPSBudWxsICYmIHRoaXMuaGVpZ2h0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNpemUodGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgbWF4VyA9IDA7XG4gICAgICAgICAgICAgICAgdmFyIG1heEggPSAwO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbl9pbm5lci5zaXplKCk7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29tcG9uZW50ID0gdGhpcy5jaGlsZHJlbl9pbm5lci5nZXQoaSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjVyA9IGNvbXBvbmVudC5ib3VuZHNXaWR0aCArIGNvbXBvbmVudC5ib3VuZHNMZWZ0ICsgY29tcG9uZW50LnRyYW5zbGF0ZVg7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjSCA9IGNvbXBvbmVudC5ib3VuZHNIZWlnaHQgKyBjb21wb25lbnQuYm91bmRzVG9wICsgY29tcG9uZW50LnRyYW5zbGF0ZVk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNXID4gbWF4Vykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF4VyA9IGNXO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNIID4gbWF4SCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF4SCA9IGNIO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMud2lkdGggIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBtYXhXID0gdGhpcy5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGVpZ2h0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF4SCA9IHRoaXMuaGVpZ2h0O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U2l6ZShtYXhXLCBtYXhIKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG59XG5cblxuIiwibW9kdWxlIGN1YmVlIHtcblxuICAgIGV4cG9ydCBjbGFzcyBQYW5lbCBleHRlbmRzIEFVc2VyQ29udHJvbCB7XG4gICAgICAgIFxuICAgICAgICBwdWJsaWMgZ2V0IFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX1dpZHRoO1xuICAgICAgICB9XG4gICAgICAgIHB1YmxpYyBnZXQgd2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5XaWR0aC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBwdWJsaWMgc2V0IHdpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLldpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0IEhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9IZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgcHVibGljIGdldCBoZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5IZWlnaHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcHVibGljIHNldCBoZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuSGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0IEJhY2tncm91bmQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fQmFja2dyb3VuZDtcbiAgICAgICAgfVxuICAgICAgICBwdWJsaWMgZ2V0IGJhY2tncm91bmQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5CYWNrZ3JvdW5kLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHB1YmxpYyBzZXQgYmFja2dyb3VuZCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5CYWNrZ3JvdW5kLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0IFNoYWRvdygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9TaGFkb3c7XG4gICAgICAgIH1cbiAgICAgICAgcHVibGljIGdldCBzaGFkb3coKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5TaGFkb3cudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcHVibGljIHNldCBzaGFkb3codmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuU2hhZG93LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHB1YmxpYyBnZXQgY2hpbGRyZW4oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbl9pbm5lcjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG5cbn1cbiIsIm1vZHVsZSBjdWJlZSB7XG5cbiAgICBleHBvcnQgY2xhc3MgSEJveCBleHRlbmRzIEFMYXlvdXQge1xuXG4gICAgICAgIHByaXZhdGUgX2hlaWdodCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2NlbGxXaWR0aHM6IG51bWJlcltdID0gW107XG4gICAgICAgIHByaXZhdGUgX2hBbGlnbnM6IEVIQWxpZ25bXSA9IFtdO1xuICAgICAgICBwcml2YXRlIF92QWxpZ25zOiBFVkFsaWduW10gPSBbXTtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgIHRoaXMucG9pbnRlclRyYW5zcGFyZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX2hlaWdodC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzZXRDZWxsV2lkdGgoaW5kZXhPckNvbXBvbmVudDogbnVtYmVyIHwgQUNvbXBvbmVudCwgY2VsbEhlaWdodDogbnVtYmVyKSB7XG4gICAgICAgICAgICBpZiAoaW5kZXhPckNvbXBvbmVudCBpbnN0YW5jZW9mIEFDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldENlbGxXaWR0aCh0aGlzLmNoaWxkcmVuX2lubmVyLmluZGV4T2YoaW5kZXhPckNvbXBvbmVudCksIGNlbGxIZWlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZXRJbkxpc3QodGhpcy5fY2VsbFdpZHRocywgPG51bWJlcj5pbmRleE9yQ29tcG9uZW50LCBjZWxsSGVpZ2h0KTtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldENlbGxXaWR0aChpbmRleE9yQ29tcG9uZW50OiBudW1iZXIgfCBBQ29tcG9uZW50KTogbnVtYmVyIHtcbiAgICAgICAgICAgIGlmIChpbmRleE9yQ29tcG9uZW50IGluc3RhbmNlb2YgQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldENlbGxXaWR0aCh0aGlzLmNoaWxkcmVuX2lubmVyLmluZGV4T2YoaW5kZXhPckNvbXBvbmVudCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RnJvbUxpc3QodGhpcy5fY2VsbFdpZHRocywgPG51bWJlcj5pbmRleE9yQ29tcG9uZW50KTtcbiAgICB9XG4gICAgXG4gICAgcHVibGljIHNldENlbGxIQWxpZ24oaW5kZXhPckNvbXBvbmVudDogbnVtYmVyIHwgQUNvbXBvbmVudCwgaEFsaWduOiBFSEFsaWduKSB7XG4gICAgICAgICAgICBpZiAoaW5kZXhPckNvbXBvbmVudCBpbnN0YW5jZW9mIEFDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldENlbGxIQWxpZ24odGhpcy5jaGlsZHJlbl9pbm5lci5pbmRleE9mKGluZGV4T3JDb21wb25lbnQpLCBoQWxpZ24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZXRJbkxpc3QodGhpcy5faEFsaWducywgPG51bWJlcj5pbmRleE9yQ29tcG9uZW50LCBoQWxpZ24pO1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgIH1cblxuICAgIHB1YmxpYyBnZXRDZWxsSEFsaWduKGluZGV4T3JDb21wb25lbnQ6IG51bWJlciB8IEFDb21wb25lbnQpOiBFSEFsaWduIHtcbiAgICAgICAgICAgIGlmIChpbmRleE9yQ29tcG9uZW50IGluc3RhbmNlb2YgQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldENlbGxIQWxpZ24odGhpcy5jaGlsZHJlbl9pbm5lci5pbmRleE9mKGluZGV4T3JDb21wb25lbnQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEZyb21MaXN0KHRoaXMuX2hBbGlnbnMsIDxudW1iZXI+aW5kZXhPckNvbXBvbmVudCk7XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBzZXRDZWxsVkFsaWduKGluZGV4T3JDb21wb25lbnQ6IG51bWJlciB8IEFDb21wb25lbnQsIHZBbGlnbjogRVZBbGlnbikge1xuICAgICAgICAgICAgaWYgKGluZGV4T3JDb21wb25lbnQgaW5zdGFuY2VvZiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRDZWxsVkFsaWduKHRoaXMuY2hpbGRyZW5faW5uZXIuaW5kZXhPZihpbmRleE9yQ29tcG9uZW50KSwgdkFsaWduKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2V0SW5MaXN0KHRoaXMuX3ZBbGlnbnMsIDxudW1iZXI+aW5kZXhPckNvbXBvbmVudCwgdkFsaWduKTtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Q2VsbFZBbGlnbihpbmRleE9yQ29tcG9uZW50OiBudW1iZXIgfCBBQ29tcG9uZW50KTogRVZBbGlnbiB7XG4gICAgICAgICAgICBpZiAoaW5kZXhPckNvbXBvbmVudCBpbnN0YW5jZW9mIEFDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRDZWxsVkFsaWduKHRoaXMuY2hpbGRyZW5faW5uZXIuaW5kZXhPZihpbmRleE9yQ29tcG9uZW50KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRGcm9tTGlzdCh0aGlzLl92QWxpZ25zLCA8bnVtYmVyPmluZGV4T3JDb21wb25lbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRMYXN0Q2VsbEhBbGlnbihoQWxpZ246IEVIQWxpZ24pIHtcbiAgICAgICAgdGhpcy5zZXRDZWxsSEFsaWduKHRoaXMuY2hpbGRyZW5faW5uZXIuc2l6ZSgpIC0gMSwgaEFsaWduKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0TGFzdENlbGxWQWxpZ24odkFsaWduOiBFVkFsaWduKSB7XG4gICAgICAgIHRoaXMuc2V0Q2VsbFZBbGlnbih0aGlzLmNoaWxkcmVuX2lubmVyLnNpemUoKSAtIDEsIHZBbGlnbik7XG4gICAgfVxuXG4gICAgcHVibGljIHNldExhc3RDZWxsV2lkdGgod2lkdGg6IG51bWJlcikge1xuICAgICAgICB0aGlzLnNldENlbGxXaWR0aCh0aGlzLmNoaWxkcmVuX2lubmVyLnNpemUoKSAtIDEsIHdpZHRoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkRW1wdHlDZWxsKHdpZHRoOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5jaGlsZHJlbl9pbm5lci5hZGQobnVsbCk7XG4gICAgICAgIHRoaXMuc2V0Q2VsbFdpZHRoKHRoaXMuY2hpbGRyZW5faW5uZXIuc2l6ZSgpIC0gMSwgd2lkdGgpO1xuICAgIH1cblxuICAgIF9vbkNoaWxkQWRkZWQoY2hpbGQ6IEFDb21wb25lbnQpIHtcbiAgICAgICAgaWYgKGNoaWxkICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChjaGlsZC5lbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICB9XG5cbiAgICBfb25DaGlsZFJlbW92ZWQoY2hpbGQ6IEFDb21wb25lbnQsIGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKGNoaWxkICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDaGlsZChjaGlsZC5lbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbW92ZUZyb21MaXN0KHRoaXMuX2hBbGlnbnMsIGluZGV4KTtcbiAgICAgICAgdGhpcy5yZW1vdmVGcm9tTGlzdCh0aGlzLl92QWxpZ25zLCBpbmRleCk7XG4gICAgICAgIHRoaXMucmVtb3ZlRnJvbUxpc3QodGhpcy5fY2VsbFdpZHRocywgaW5kZXgpO1xuICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICB9XG5cbiAgICBfb25DaGlsZHJlbkNsZWFyZWQoKSB7XG4gICAgICAgIGxldCByb290ID0gdGhpcy5lbGVtZW50O1xuICAgICAgICBsZXQgZSA9IHRoaXMuZWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICAgICAgd2hpbGUgKGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgcm9vdC5yZW1vdmVDaGlsZChlKTtcbiAgICAgICAgICAgIGUgPSByb290LmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2hBbGlnbnMgPSBbXTtcbiAgICAgICAgdGhpcy5fdkFsaWducyA9IFtdO1xuICAgICAgICB0aGlzLl9jZWxsV2lkdGhzID0gW107XG4gICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBvbkxheW91dCgpIHtcbiAgICAgICAgdmFyIG1heEhlaWdodCA9IC0xO1xuICAgICAgICBpZiAodGhpcy5oZWlnaHQgIT0gbnVsbCkge1xuICAgICAgICAgICAgbWF4SGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYWN0VyA9IDA7XG4gICAgICAgIHZhciBtYXhIID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLnNpemUoKTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY2hpbGRYID0gMDtcbiAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuY2hpbGRyZW4uZ2V0KGkpO1xuICAgICAgICAgICAgbGV0IGNlbGxXID0gdGhpcy5nZXRDZWxsV2lkdGgoaSk7XG4gICAgICAgICAgICBsZXQgaEFsaWduID0gdGhpcy5nZXRDZWxsSEFsaWduKGkpO1xuICAgICAgICAgICAgbGV0IHJlYWxDZWxsVyA9IC0xO1xuICAgICAgICAgICAgaWYgKGNlbGxXICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZWFsQ2VsbFcgPSBjZWxsVztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNoaWxkID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVhbENlbGxXID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBhY3RXICs9IHJlYWxDZWxsVztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vY2hpbGQubGF5b3V0KCk7XG4gICAgICAgICAgICAgICAgbGV0IGN3ID0gY2hpbGQuYm91bmRzV2lkdGg7XG4gICAgICAgICAgICAgICAgbGV0IGNoID0gY2hpbGQuYm91bmRzSGVpZ2h0O1xuICAgICAgICAgICAgICAgIGxldCBjbCA9IGNoaWxkLnRyYW5zbGF0ZVg7XG4gICAgICAgICAgICAgICAgbGV0IGN0ID0gY2hpbGQudHJhbnNsYXRlWTtcbiAgICAgICAgICAgICAgICBsZXQgY2FsY3VsYXRlZENlbGxXID0gcmVhbENlbGxXO1xuICAgICAgICAgICAgICAgIGlmIChjYWxjdWxhdGVkQ2VsbFcgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGF0ZWRDZWxsVyA9IGN3ICsgY2w7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjYWxjdWxhdGVkQ2VsbFcgPCBjdykge1xuICAgICAgICAgICAgICAgICAgICBjYWxjdWxhdGVkQ2VsbFcgPSBjdztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjaGlsZFggPSBhY3RXIC0gY2hpbGQudHJhbnNsYXRlWDtcblxuICAgICAgICAgICAgICAgIGlmIChoQWxpZ24gPT0gRUhBbGlnbi5DRU5URVIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRYICs9IChjYWxjdWxhdGVkQ2VsbFcgLSBjdykgLyAyO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaEFsaWduID09IEVIQWxpZ24uUklHSFQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRYICs9IChjYWxjdWxhdGVkQ2VsbFcgLSBjdyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNoaWxkLl9zZXRMZWZ0KGNoaWxkWCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoY2ggKyBjdCA+IG1heEgpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF4SCA9IGNoICsgY3Q7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFjdFcgKz0gY2FsY3VsYXRlZENlbGxXO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlYWxIZWlnaHQgPSBtYXhIO1xuICAgICAgICBpZiAobWF4SGVpZ2h0ID4gLTEpIHtcbiAgICAgICAgICAgIHJlYWxIZWlnaHQgPSBtYXhIZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLnNpemUoKTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY2hpbGRZID0gMDtcbiAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuY2hpbGRyZW4uZ2V0KGkpO1xuICAgICAgICAgICAgaWYgKGNoaWxkID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCB2QWxpZ24gPSB0aGlzLmdldENlbGxWQWxpZ24oaSk7XG4gICAgICAgICAgICBsZXQgY2ggPSBjaGlsZC5ib3VuZHNIZWlnaHQ7XG4gICAgICAgICAgICBpZiAodkFsaWduID09IEVWQWxpZ24uTUlERExFKSB7XG4gICAgICAgICAgICAgICAgY2hpbGRZICs9IChyZWFsSGVpZ2h0IC0gY2gpIC8gMjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodkFsaWduID09IEVWQWxpZ24uQk9UVE9NKSB7XG4gICAgICAgICAgICAgICAgY2hpbGRZICs9IChyZWFsSGVpZ2h0IC0gY2gpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjaGlsZC5fc2V0VG9wKGNoaWxkWSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFNpemUoYWN0VywgcmVhbEhlaWdodCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRJbkxpc3Q8VD4obGlzdDogVFtdLCBpbmRleDogbnVtYmVyLCB2YWx1ZTogVCkge1xuICAgICAgICB3aGlsZSAobGlzdC5sZW5ndGggPCBpbmRleCkge1xuICAgICAgICAgICAgbGlzdC5wdXNoKG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIGxpc3RbaW5kZXhdID0gdmFsdWU7XG4gICAgfVxuXG4gICAgICAgIHByaXZhdGUgZ2V0RnJvbUxpc3Q8VD4obGlzdDogVFtdLCBpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIGlmIChsaXN0Lmxlbmd0aCA+IGluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm4gbGlzdFtpbmRleF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgICAgIHByaXZhdGUgcmVtb3ZlRnJvbUxpc3Q8VD4obGlzdDogVFtdLCBpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIGlmIChsaXN0Lmxlbmd0aCA+IGluZGV4KSB7XG4gICAgICAgICAgICBsaXN0LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgY2hpbGRyZW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuX2lubmVyO1xuICAgIH1cbiAgICBcbiAgICBnZXQgSGVpZ2h0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xuICAgIH1cbiAgICBnZXQgaGVpZ2h0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5IZWlnaHQudmFsdWU7XG4gICAgfVxuICAgIHNldCBoZWlnaHQodmFsdWUpIHtcbiAgICAgICAgdGhpcy5IZWlnaHQudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG5cblxufVxuICAgIFxufVxuXG4iLCJtb2R1bGUgY3ViZWUge1xuXG4gICAgZXhwb3J0IGNsYXNzIFZCb3ggZXh0ZW5kcyBBTGF5b3V0IHtcblxuICAgICAgICBwcml2YXRlIF93aWR0aCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIC8vcHJpdmF0ZSBmaW5hbCBBcnJheUxpc3Q8RWxlbWVudD4gd3JhcHBpbmdQYW5lbHMgPSBuZXcgQXJyYXlMaXN0PEVsZW1lbnQ+KCk7XG4gICAgICAgIHByaXZhdGUgX2NlbGxIZWlnaHRzOiBudW1iZXJbXSA9IFtdO1xuICAgICAgICBwcml2YXRlIF9oQWxpZ25zOiBFSEFsaWduW10gPSBbXTtcbiAgICAgICAgcHJpdmF0ZSBfdkFsaWduczogRVZBbGlnbltdID0gW107XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICB0aGlzLnBvaW50ZXJUcmFuc3BhcmVudCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLl93aWR0aC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuX2lubmVyO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0Q2VsbEhlaWdodChpbmRleE9yQ29tcG9uZW50OiBudW1iZXIgfCBBQ29tcG9uZW50LCBjZWxsSGVpZ2h0OiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmIChpbmRleE9yQ29tcG9uZW50IGluc3RhbmNlb2YgQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q2VsbEhlaWdodCh0aGlzLmNoaWxkcmVuLmluZGV4T2YoPEFDb21wb25lbnQ+aW5kZXhPckNvbXBvbmVudCksIGNlbGxIZWlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZXRJbkxpc3QodGhpcy5fY2VsbEhlaWdodHMsIDxudW1iZXI+aW5kZXhPckNvbXBvbmVudCwgY2VsbEhlaWdodCk7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc2V0SW5MaXN0PFQ+KGxpc3Q6IFRbXSwgaW5kZXg6IG51bWJlciwgdmFsdWU6IFQpIHtcbiAgICAgICAgICAgIHdoaWxlIChsaXN0Lmxlbmd0aCA8IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgbGlzdC5wdXNoKG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGlzdFtpbmRleF0gPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgZ2V0RnJvbUxpc3Q8VD4obGlzdDogVFtdLCBpbmRleDogbnVtYmVyKSB7XG4gICAgICAgICAgICBpZiAobGlzdC5sZW5ndGggPiBpbmRleCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsaXN0W2luZGV4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSByZW1vdmVGcm9tTGlzdDxUPihsaXN0OiBUW10sIGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmIChsaXN0Lmxlbmd0aCA+IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgbGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldENlbGxIZWlnaHQoaW5kZXhPckNvbXBvbmVudDogbnVtYmVyIHwgQUNvbXBvbmVudCk6IG51bWJlciB7XG4gICAgICAgICAgICBpZiAoaW5kZXhPckNvbXBvbmVudCBpbnN0YW5jZW9mIEFDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRDZWxsSGVpZ2h0KHRoaXMuY2hpbGRyZW4uaW5kZXhPZihpbmRleE9yQ29tcG9uZW50KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmdldEZyb21MaXN0KHRoaXMuX2NlbGxIZWlnaHRzLCA8bnVtYmVyPmluZGV4T3JDb21wb25lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHNldENlbGxIQWxpZ24oaW5kZXhPckNvbXBvbmVudDogbnVtYmVyIHwgQUNvbXBvbmVudCwgaEFsaWduOiBFSEFsaWduKSB7XG4gICAgICAgICAgICBpZiAoaW5kZXhPckNvbXBvbmVudCBpbnN0YW5jZW9mIEFDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldENlbGxIQWxpZ24odGhpcy5jaGlsZHJlbi5pbmRleE9mKGluZGV4T3JDb21wb25lbnQpLCBoQWxpZ24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZXRJbkxpc3QodGhpcy5faEFsaWducywgPG51bWJlcj5pbmRleE9yQ29tcG9uZW50LCBoQWxpZ24pO1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0Q2VsbEhBbGlnbihpbmRleE9yQ29tcG9uZW50OiBudW1iZXIgfCBBQ29tcG9uZW50KTogRUhBbGlnbiB7XG4gICAgICAgICAgICBpZiAoaW5kZXhPckNvbXBvbmVudCBpbnN0YW5jZW9mIEFDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRDZWxsSEFsaWduKHRoaXMuY2hpbGRyZW4uaW5kZXhPZihpbmRleE9yQ29tcG9uZW50KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRGcm9tTGlzdCh0aGlzLl9oQWxpZ25zLCA8bnVtYmVyPmluZGV4T3JDb21wb25lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHNldENlbGxWQWxpZ24oaW5kZXhPckNvbXBvbmVudDogbnVtYmVyIHwgQUNvbXBvbmVudCwgdkFsaWduOiBFVkFsaWduKSB7XG4gICAgICAgICAgICBpZiAoaW5kZXhPckNvbXBvbmVudCBpbnN0YW5jZW9mIEFDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldENlbGxWQWxpZ24odGhpcy5jaGlsZHJlbi5pbmRleE9mKGluZGV4T3JDb21wb25lbnQpLCB2QWxpZ24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZXRJbkxpc3QodGhpcy5fdkFsaWducywgPG51bWJlcj5pbmRleE9yQ29tcG9uZW50LCB2QWxpZ24pO1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRDZWxsVkFsaWduKGluZGV4T3JDb21wb25lbnQ6IG51bWJlciB8IEFDb21wb25lbnQpOiBFVkFsaWduIHtcbiAgICAgICAgaWYgKGluZGV4T3JDb21wb25lbnQgaW5zdGFuY2VvZiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRDZWxsVkFsaWduKHRoaXMuY2hpbGRyZW4uaW5kZXhPZihpbmRleE9yQ29tcG9uZW50KSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nZXRGcm9tTGlzdCh0aGlzLl92QWxpZ25zLCA8bnVtYmVyPmluZGV4T3JDb21wb25lbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRMYXN0Q2VsbEhBbGlnbihoQWxpZ246IEVIQWxpZ24pIHtcbiAgICAgICAgdGhpcy5zZXRDZWxsSEFsaWduKHRoaXMuY2hpbGRyZW4uc2l6ZSgpIC0gMSwgaEFsaWduKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0TGFzdENlbGxWQWxpZ24odkFsaWduOiBFVkFsaWduKSB7XG4gICAgICAgIHRoaXMuc2V0Q2VsbFZBbGlnbih0aGlzLmNoaWxkcmVuLnNpemUoKSAtIDEsIHZBbGlnbik7XG4gICAgfVxuXG4gICAgcHVibGljIHNldExhc3RDZWxsSGVpZ2h0KGhlaWdodDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuc2V0Q2VsbEhlaWdodCh0aGlzLmNoaWxkcmVuLnNpemUoKSAtIDEsIGhlaWdodCk7XG4gICAgfVxuXG4gICAgcHVibGljIGFkZEVtcHR5Q2VsbChoZWlnaHQ6IG51bWJlcikge1xuICAgICAgICB0aGlzLmNoaWxkcmVuLmFkZChudWxsKTtcbiAgICAgICAgdGhpcy5zZXRDZWxsSGVpZ2h0KHRoaXMuY2hpbGRyZW4uc2l6ZSgpIC0gMSwgaGVpZ2h0KTtcbiAgICB9XG4gICAgXG4gICAgZ2V0IFdpZHRoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XG4gICAgfVxuICAgIGdldCB3aWR0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuV2lkdGgudmFsdWU7XG4gICAgfVxuICAgIHNldCB3aWR0aCh2YWx1ZSkge1xuICAgICAgICB0aGlzLldpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgfVxuXG4gICAgcHVibGljIF9vbkNoaWxkQWRkZWQoY2hpbGQ6IEFDb21wb25lbnQpIHtcbiAgICAgICAgaWYgKGNoaWxkICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChjaGlsZC5lbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgX29uQ2hpbGRSZW1vdmVkKGNoaWxkOiBBQ29tcG9uZW50LCBpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIGlmIChjaGlsZCAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2hpbGQoY2hpbGQuZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZW1vdmVGcm9tTGlzdCh0aGlzLl9oQWxpZ25zLCBpbmRleCk7XG4gICAgICAgIHRoaXMucmVtb3ZlRnJvbUxpc3QodGhpcy5fdkFsaWducywgaW5kZXgpO1xuICAgICAgICB0aGlzLnJlbW92ZUZyb21MaXN0KHRoaXMuX2NlbGxIZWlnaHRzLCBpbmRleCk7XG4gICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBfb25DaGlsZHJlbkNsZWFyZWQoKSB7XG4gICAgICAgIHZhciByb290ID0gdGhpcy5lbGVtZW50O1xuICAgICAgICB2YXIgZSA9IHRoaXMuZWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICAgICAgd2hpbGUgKGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgcm9vdC5yZW1vdmVDaGlsZChlKTtcbiAgICAgICAgICAgIGUgPSByb290LmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2hBbGlnbnMgPSBbXTtcbiAgICAgICAgdGhpcy5fdkFsaWducyA9IFtdO1xuICAgICAgICB0aGlzLl9jZWxsSGVpZ2h0cyA9IFtdO1xuICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgb25MYXlvdXQoKSB7XG4gICAgICAgIHZhciBtYXhXaWR0aCA9IC0xO1xuICAgICAgICBpZiAodGhpcy53aWR0aCAhPSBudWxsKSB7XG4gICAgICAgICAgICBtYXhXaWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYWN0SCA9IDA7XG4gICAgICAgIHZhciBtYXhXID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLnNpemUoKTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY2hpbGRZID0gMDtcbiAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuY2hpbGRyZW4uZ2V0KGkpO1xuICAgICAgICAgICAgbGV0IGNlbGxIID0gdGhpcy5nZXRDZWxsSGVpZ2h0KGkpO1xuICAgICAgICAgICAgbGV0IHZBbGlnbiA9IHRoaXMuZ2V0Q2VsbFZBbGlnbihpKTtcbiAgICAgICAgICAgIGxldCByZWFsQ2VsbEggPSAtMTtcbiAgICAgICAgICAgIGlmIChjZWxsSCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmVhbENlbGxIID0gY2VsbEg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjaGlsZCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlYWxDZWxsSCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgYWN0SCArPSByZWFsQ2VsbEg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL2NoaWxkLmxheW91dCgpO1xuICAgICAgICAgICAgICAgIGxldCBjdyA9IGNoaWxkLmJvdW5kc1dpZHRoO1xuICAgICAgICAgICAgICAgIGxldCBjaCA9IGNoaWxkLmJvdW5kc0hlaWdodDtcbiAgICAgICAgICAgICAgICBsZXQgY2wgPSBjaGlsZC50cmFuc2xhdGVYO1xuICAgICAgICAgICAgICAgIGxldCBjdCA9IGNoaWxkLnRyYW5zbGF0ZVk7XG4gICAgICAgICAgICAgICAgbGV0IGNhbGN1bGF0ZWRDZWxsSCA9IHJlYWxDZWxsSDtcbiAgICAgICAgICAgICAgICBpZiAoY2FsY3VsYXRlZENlbGxIIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICBjYWxjdWxhdGVkQ2VsbEggPSBjaCArIGN0O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2FsY3VsYXRlZENlbGxIIDwgY2gpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXRlZENlbGxIID0gY2g7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY2hpbGRZID0gYWN0SCAtIGNoaWxkLnRyYW5zbGF0ZVk7XG5cbiAgICAgICAgICAgICAgICBpZiAodkFsaWduID09IEVWQWxpZ24uTUlERExFKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkWSArPSAoY2FsY3VsYXRlZENlbGxIIC0gY2gpIC8gMjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZBbGlnbiA9PSBFVkFsaWduLkJPVFRPTSkge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZFkgKz0gKGNhbGN1bGF0ZWRDZWxsSCAtIGNoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2hpbGQuX3NldFRvcChjaGlsZFkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGN3ICsgY2wgPiBtYXhXKSB7XG4gICAgICAgICAgICAgICAgICAgIG1heFcgPSBjdyArIGNsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhY3RIICs9IGNhbGN1bGF0ZWRDZWxsSDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZWFsV2lkdGggPSBtYXhXO1xuICAgICAgICBpZiAobWF4V2lkdGggPiAtMSkge1xuICAgICAgICAgICAgcmVhbFdpZHRoID0gbWF4V2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLnNpemUoKTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY2hpbGRYID0gMDtcbiAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuY2hpbGRyZW4uZ2V0KGkpO1xuICAgICAgICAgICAgaWYgKGNoaWxkID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBoQWxpZ24gPSB0aGlzLmdldENlbGxIQWxpZ24oaSk7XG4gICAgICAgICAgICBsZXQgY3cgPSBjaGlsZC5ib3VuZHNXaWR0aDtcbiAgICAgICAgICAgIGlmIChoQWxpZ24gPT0gRUhBbGlnbi5DRU5URVIpIHtcbiAgICAgICAgICAgICAgICBjaGlsZFggPSAocmVhbFdpZHRoIC0gY3cpIC8gMjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaEFsaWduID09IEVIQWxpZ24uUklHSFQpIHtcbiAgICAgICAgICAgICAgICBjaGlsZFggPSAocmVhbFdpZHRoIC0gY3cpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjaGlsZC5fc2V0TGVmdChjaGlsZFgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRTaXplKHJlYWxXaWR0aCwgYWN0SCk7XG4gICAgfVxuXG5cblxufVxuICAgIFxufVxuXG5cbiIsIm1vZHVsZSBjdWJlZSB7XG5cbiAgICBleHBvcnQgY2xhc3MgTGFiZWwgZXh0ZW5kcyBBQ29tcG9uZW50IHtcblxuICAgICAgICBwcml2YXRlIF93aWR0aCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2hlaWdodCA9IG5ldyBOdW1iZXJQcm9wZXJ0eShudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3RleHQgPSBuZXcgU3RyaW5nUHJvcGVydHkoXCJcIiwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdGV4dE92ZXJmbG93ID0gbmV3IFByb3BlcnR5PEVUZXh0T3ZlcmZsb3c+KEVUZXh0T3ZlcmZsb3cuQ0xJUCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfZm9yZUNvbG9yID0gbmV3IENvbG9yUHJvcGVydHkoQ29sb3IuQkxBQ0ssIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdGV4dEFsaWduID0gbmV3IFByb3BlcnR5PEVUZXh0QWxpZ24+KEVUZXh0QWxpZ24uTEVGVCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdmVydGljYWxBbGlnbiA9IG5ldyBQcm9wZXJ0eTxFVkFsaWduPihFVkFsaWduLlRPUCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYm9sZCA9IG5ldyBCb29sZWFuUHJvcGVydHkoZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2l0YWxpYyA9IG5ldyBCb29sZWFuUHJvcGVydHkoZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3VuZGVybGluZSA9IG5ldyBCb29sZWFuUHJvcGVydHkoZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2ZvbnRTaXplID0gbmV3IE51bWJlclByb3BlcnR5KDEyLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9mb250RmFtaWx5ID0gbmV3IFByb3BlcnR5PEZvbnRGYW1pbHk+KEZvbnRGYW1pbHkuQXJpYWwsIGZhbHNlLCBmYWxzZSk7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKTtcbiAgICAgICAgICAgIHRoaXMuX3dpZHRoLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy53aWR0aCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aGl0ZVNwYWNlID0gXCJub3dyYXBcIjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93WCA9IFwidmlzaWJsZVwiO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJ3aWR0aFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2hpdGVTcGFjZSA9IFwibm9ybWFsXCI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vdmVyZmxvd1ggPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2lkdGggPSB0aGlzLndpZHRoICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fd2lkdGguaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5faGVpZ2h0LmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oZWlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJoZWlnaHRcIilcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93WSA9IFwidmlzaWJsZVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93WSA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9oZWlnaHQuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fdGV4dC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmlubmVySFRNTCA9IHRoaXMudGV4dDtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl90ZXh0LmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3RleHRPdmVyZmxvdy5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0T3ZlcmZsb3cuYXBwbHkodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50ZXh0T3ZlcmZsb3cgPT0gRVRleHRPdmVyZmxvdy5FTExJUFNJUykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2hpdGVTcGFjZSA9IFwibm93cmFwXCI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwid2hpdGVTcGFjZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fd2lkdGguaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9oZWlnaHQuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdGV4dE92ZXJmbG93LmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2ZvcmVDb2xvci5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9yZUNvbG9yID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmNvbG9yID0gXCJyZ2JhKDAsMCwwLDAuMClcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuY29sb3IgPSB0aGlzLmZvcmVDb2xvci50b0NTUygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZm9yZUNvbG9yLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3RleHRBbGlnbi5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0QWxpZ24uYXBwbHkodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdGV4dEFsaWduLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRpY2FsQWxpZ24uYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB0YSA9IHRoaXMudmVydGljYWxBbGlnbjtcbiAgICAgICAgICAgICAgICBpZiAodGEgPT0gRVZBbGlnbi5UT1ApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZlcnRpY2FsQWxpZ24gPSBcInRvcFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGEgPT0gRVZBbGlnbi5NSURETEUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZlcnRpY2FsQWxpZ24gPSBcIm1pZGRsZVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGEgPT0gRVZBbGlnbi5CT1RUT00pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnZlcnRpY2FsQWxpZ24gPSBcImJvdHRvbVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdmVydGljYWxBbGlnbi5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl91bmRlcmxpbmUuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnVuZGVybGluZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudGV4dERlY29yYXRpb24gPSBcInVuZGVybGluZVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50ZXh0RGVjb3JhdGlvbiA9IFwibm9uZVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fdW5kZXJsaW5lLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2JvbGQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZvbnRXZWlnaHQgPSBcImJvbGRcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFdlaWdodCA9IFwibm9ybWFsXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9ib2xkLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2l0YWxpYy5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXRhbGljKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250U3R5bGUgPSBcIml0YWxpY1wiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250U3R5bGUgPSBcIm5vcm1hbFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5faXRhbGljLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2ZvbnRTaXplLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFNpemUgPSB0aGlzLmZvbnRTaXplICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9mb250U2l6ZS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9mb250RmFtaWx5LmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmZvbnRGYW1pbHkuYXBwbHkodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZm9udEZhbWlseS5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuV2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHdpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLldpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGdldCBIZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGdldCBoZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5IZWlnaHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGhlaWdodCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5IZWlnaHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUZXh0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RleHQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRleHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UZXh0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0ZXh0KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRleHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUZXh0T3ZlcmZsb3coKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGV4dE92ZXJmbG93O1xuICAgICAgICB9XG4gICAgICAgIGdldCB0ZXh0T3ZlcmZsb3coKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UZXh0T3ZlcmZsb3cudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHRleHRPdmVyZmxvdyh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5UZXh0T3ZlcmZsb3cudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuUGFkZGluZ1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEZvcmVDb2xvcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb3JlQ29sb3I7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGZvcmVDb2xvcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkZvcmVDb2xvci52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgZm9yZUNvbG9yKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkZvcmVDb2xvci52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFZlcnRpY2FsQWxpZ24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmVydGljYWxBbGlnbjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdmVydGljYWxBbGlnbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlZlcnRpY2FsQWxpZ24udmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHZlcnRpY2FsQWxpZ24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVmVydGljYWxBbGlnbi52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEJvbGQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYm9sZDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm9sZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkJvbGQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGJvbGQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQm9sZC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEl0YWxpYygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pdGFsaWM7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGl0YWxpYygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkl0YWxpYy52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgaXRhbGljKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkl0YWxpYy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFVuZGVybGluZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl91bmRlcmxpbmU7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHVuZGVybGluZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlVuZGVybGluZS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdW5kZXJsaW5lKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlVuZGVybGluZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFRleHRBbGlnbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZXh0QWxpZ247XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRleHRBbGlnbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlRleHRBbGlnbi52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdGV4dEFsaWduKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRleHRBbGlnbi52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEZvbnRTaXplKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvbnRTaXplO1xuICAgICAgICB9XG4gICAgICAgIGdldCBmb250U2l6ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkZvbnRTaXplLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBmb250U2l6ZSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Gb250U2l6ZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEZvbnRGYW1pbHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9udEZhbWlseTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgZm9udEZhbWlseSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkZvbnRGYW1pbHkudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGZvbnRGYW1pbHkodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuRm9udEZhbWlseS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn1cblxuXG4iLCJtb2R1bGUgY3ViZWUge1xuXG4gICAgZXhwb3J0IGNsYXNzIEFQb3B1cCB7XG5cbiAgICAgICAgcHJpdmF0ZSBfbW9kYWw6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcHJpdmF0ZSBfYXV0b0Nsb3NlID0gdHJ1ZTtcbiAgICAgICAgcHJpdmF0ZSBfZ2xhc3NDb2xvciA9IENvbG9yLlRSQU5TUEFSRU5UO1xuXG4gICAgICAgIHByaXZhdGUgX3RyYW5zbGF0ZVggPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdHJhbnNsYXRlWSA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9jZW50ZXIgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuXG4gICAgICAgIHByaXZhdGUgX3BvcHVwUm9vdDogUGFuZWwgPSBudWxsO1xuICAgICAgICBwcml2YXRlIF9yb290Q29tcG9uZW50Q29udGFpbmVyOiBQYW5lbCA9IG51bGw7XG4gICAgICAgIHByaXZhdGUgX3Jvb3RDb21wb25lbnQ6IEFDb21wb25lbnQgPSBudWxsO1xuXG4gICAgICAgIHByaXZhdGUgX3Zpc2libGUgPSBmYWxzZTtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihtb2RhbDogYm9vbGVhbiA9IHRydWUsIGF1dG9DbG9zZTogYm9vbGVhbiA9IHRydWUsIGdsYXNzQ29sb3IgPSBDb2xvci5nZXRBcmdiQ29sb3IoMHgwMDAwMDAwMCkpIHtcbiAgICAgICAgICAgIHRoaXMuX21vZGFsID0gbW9kYWw7XG4gICAgICAgICAgICB0aGlzLl9hdXRvQ2xvc2UgPSBhdXRvQ2xvc2U7XG4gICAgICAgICAgICB0aGlzLl9nbGFzc0NvbG9yID0gZ2xhc3NDb2xvcjtcbiAgICAgICAgICAgIHRoaXMuX3BvcHVwUm9vdCA9IG5ldyBQYW5lbCgpO1xuICAgICAgICAgICAgdGhpcy5fcG9wdXBSb290LmVsZW1lbnQuc3R5bGUubGVmdCA9IFwiMHB4XCI7XG4gICAgICAgICAgICB0aGlzLl9wb3B1cFJvb3QuZWxlbWVudC5zdHlsZS50b3AgPSBcIjBweFwiO1xuICAgICAgICAgICAgdGhpcy5fcG9wdXBSb290LmVsZW1lbnQuc3R5bGUucmlnaHQgPSBcIjBweFwiO1xuICAgICAgICAgICAgdGhpcy5fcG9wdXBSb290LmVsZW1lbnQuc3R5bGUuYm90dG9tID0gXCIwcHhcIjtcbiAgICAgICAgICAgIHRoaXMuX3BvcHVwUm9vdC5lbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gXCJmaXhlZFwiO1xuICAgICAgICAgICAgaWYgKGdsYXNzQ29sb3IgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3BvcHVwUm9vdC5iYWNrZ3JvdW5kID0gbmV3IENvbG9yQmFja2dyb3VuZChnbGFzc0NvbG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtb2RhbCB8fCBhdXRvQ2xvc2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wb3B1cFJvb3QuZWxlbWVudC5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJhbGxcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcG9wdXBSb290LmVsZW1lbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9IFwibm9uZVwiO1xuICAgICAgICAgICAgICAgIHRoaXMuX3BvcHVwUm9vdC5wb2ludGVyVHJhbnNwYXJlbnQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9yb290Q29tcG9uZW50Q29udGFpbmVyID0gbmV3IFBhbmVsKCk7XG4gICAgICAgICAgICB0aGlzLl9yb290Q29tcG9uZW50Q29udGFpbmVyLlRyYW5zbGF0ZVguYmluZChuZXcgRXhwcmVzc2lvbjxudW1iZXI+KCgpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgYmFzZVggPSAwO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jZW50ZXIudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgYmFzZVggPSAodGhpcy5fcG9wdXBSb290LmNsaWVudFdpZHRoIC0gdGhpcy5fcm9vdENvbXBvbmVudENvbnRhaW5lci5ib3VuZHNXaWR0aCkgLyAyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gYmFzZVggKyB0aGlzLl90cmFuc2xhdGVYLnZhbHVlO1xuICAgICAgICAgICAgfSwgdGhpcy5fY2VudGVyLCB0aGlzLl9wb3B1cFJvb3QuQ2xpZW50V2lkdGgsIHRoaXMuX3RyYW5zbGF0ZVgsXG4gICAgICAgICAgICAgICAgdGhpcy5fcm9vdENvbXBvbmVudENvbnRhaW5lci5Cb3VuZHNXaWR0aCkpO1xuICAgICAgICAgICAgdGhpcy5fcm9vdENvbXBvbmVudENvbnRhaW5lci5UcmFuc2xhdGVZLmJpbmQobmV3IEV4cHJlc3Npb248bnVtYmVyPigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGJhc2VZID0gMDtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY2VudGVyLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGJhc2VZID0gKHRoaXMuX3BvcHVwUm9vdC5jbGllbnRIZWlnaHQgLSB0aGlzLl9yb290Q29tcG9uZW50Q29udGFpbmVyLmJvdW5kc0hlaWdodCkgLyAyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gYmFzZVkgKyB0aGlzLl90cmFuc2xhdGVZLnZhbHVlO1xuICAgICAgICAgICAgfSwgdGhpcy5fY2VudGVyLCB0aGlzLl9wb3B1cFJvb3QuQ2xpZW50SGVpZ2h0LCB0aGlzLl90cmFuc2xhdGVZLFxuICAgICAgICAgICAgICAgIHRoaXMuX3Jvb3RDb21wb25lbnRDb250YWluZXIuQm91bmRzSGVpZ2h0KSk7XG4gICAgICAgICAgICB0aGlzLl9wb3B1cFJvb3QuY2hpbGRyZW4uYWRkKHRoaXMuX3Jvb3RDb21wb25lbnRDb250YWluZXIpO1xuXG4gICAgICAgICAgICBpZiAoYXV0b0Nsb3NlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcG9wdXBSb290Lm9uQ2xpY2suYWRkTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgX19wb3B1cFJvb3QoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcG9wdXBSb290O1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIGdldCByb290Q29tcG9uZW50KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jvb3RDb21wb25lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgc2V0IHJvb3RDb21wb25lbnQocm9vdENvbXBvbmVudDogQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgdGhpcy5fcm9vdENvbXBvbmVudENvbnRhaW5lci5jaGlsZHJlbi5jbGVhcigpO1xuICAgICAgICAgICAgdGhpcy5fcm9vdENvbXBvbmVudCA9IG51bGw7XG4gICAgICAgICAgICBpZiAocm9vdENvbXBvbmVudCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcm9vdENvbXBvbmVudENvbnRhaW5lci5jaGlsZHJlbi5hZGQocm9vdENvbXBvbmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9yb290Q29tcG9uZW50ID0gcm9vdENvbXBvbmVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBzaG93KCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3Zpc2libGUpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoaXMgcG9wdXAgaXMgYWxyZWFkeSBzaG93bi5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBib2R5OiBIVE1MQm9keUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJvZHlcIilbMF07XG4gICAgICAgICAgICBib2R5LmFwcGVuZENoaWxkKHRoaXMuX3BvcHVwUm9vdC5lbGVtZW50KTtcbiAgICAgICAgICAgIFBvcHVwcy5fYWRkUG9wdXAodGhpcyk7XG4gICAgICAgICAgICB0aGlzLl92aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBjbG9zZSgpOiBib29sZWFuIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fdmlzaWJsZSkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhpcyBwb3B1cCBpc24ndCBzaG93bi5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdGhpcy5pc0Nsb3NlQWxsb3dlZCgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGJvZHk6IEhUTUxCb2R5RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXTtcbiAgICAgICAgICAgIGJvZHkucmVtb3ZlQ2hpbGQodGhpcy5fcG9wdXBSb290LmVsZW1lbnQpO1xuICAgICAgICAgICAgUG9wdXBzLl9yZW1vdmVQb3B1cCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuX3Zpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMub25DbG9zZWQoKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIGlzQ2xvc2VBbGxvd2VkKCk6IGJvb2xlYW4ge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgb25DbG9zZWQoKSB7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBtb2RhbCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tb2RhbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBhdXRvQ2xvc2UoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYXV0b0Nsb3NlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGdsYXNzQ29sb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2xhc3NDb2xvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUcmFuc2xhdGVYKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0ZVg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRyYW5zbGF0ZVgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UcmFuc2xhdGVYLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0cmFuc2xhdGVYKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRyYW5zbGF0ZVgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUcmFuc2xhdGVZKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0ZVk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRyYW5zbGF0ZVkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UcmFuc2xhdGVZLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0cmFuc2xhdGVZKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRyYW5zbGF0ZVkudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBDZW50ZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2VudGVyO1xuICAgICAgICB9XG4gICAgICAgIGdldCBjZW50ZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5DZW50ZXIudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGNlbnRlcih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5DZW50ZXIudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9kb1BvaW50ZXJFdmVudENsaW1iaW5nVXAoc2NyZWVuWDogbnVtYmVyLCBzY3JlZW5ZOiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyLCB3aGVlbFZlbG9jaXR5OiBudW1iZXIsXG4gICAgICAgICAgICBhbHRQcmVzc2VkOiBib29sZWFuLCBjdHJsUHJlc3NlZDogYm9vbGVhbiwgc2hpZnRQcmVzc2VkOiBib29sZWFuLCBtZXRhUHJlc3NlZDogYm9vbGVhbiwgZXZlbnRUeXBlOiBudW1iZXIsIGJ1dHRvbjogbnVtYmVyLCBuYXRpdmVFdmVudDogTW91c2VFdmVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BvcHVwUm9vdC5fZG9Qb2ludGVyRXZlbnRDbGltYmluZ1VwKHNjcmVlblgsIHNjcmVlblksIHgsIHksIHdoZWVsVmVsb2NpdHksIGFsdFByZXNzZWQsIGN0cmxQcmVzc2VkLCBzaGlmdFByZXNzZWQsIG1ldGFQcmVzc2VkLCBldmVudFR5cGUsIGJ1dHRvbiwgbmF0aXZlRXZlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgX2xheW91dCgpIHtcbiAgICAgICAgICAgIHRoaXMuX3BvcHVwUm9vdC53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICAgICAgdGhpcy5fcG9wdXBSb290LmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgICAgIHRoaXMuX3BvcHVwUm9vdC5sYXlvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFBvcHVwcyB7XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX3BvcHVwczogQVBvcHVwW10gPSBbXTtcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX2xheW91dFJ1bk9uY2UgPSBuZXcgUnVuT25jZSgoKSA9PiB7XG4gICAgICAgICAgICBQb3B1cHMubGF5b3V0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHN0YXRpYyBfYWRkUG9wdXAocG9wdXA6IEFQb3B1cCkge1xuICAgICAgICAgICAgUG9wdXBzLl9wb3B1cHMucHVzaChwb3B1cCk7XG4gICAgICAgICAgICBQb3B1cHMuX3JlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRpYyBfcmVtb3ZlUG9wdXAocG9wdXA6IEFQb3B1cCkge1xuICAgICAgICAgICAgdmFyIGlkeCA9IFBvcHVwcy5fcG9wdXBzLmluZGV4T2YocG9wdXApO1xuICAgICAgICAgICAgaWYgKGlkeCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgUG9wdXBzLl9wb3B1cHMuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgICAgICAgICAgUG9wdXBzLl9yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0aWMgX3JlcXVlc3RMYXlvdXQoKSB7XG4gICAgICAgICAgICBQb3B1cHMuX2xheW91dFJ1bk9uY2UucnVuKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBsYXlvdXQoKSB7XG4gICAgICAgICAgICBQb3B1cHMuX3BvcHVwcy5mb3JFYWNoKChwb3B1cCkgPT4ge1xuICAgICAgICAgICAgICAgIHBvcHVwLl9sYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIGRvUG9pbnRlckV2ZW50Q2xpbWJpbmdVcCh4OiBudW1iZXIsIHk6IG51bWJlciwgd2hlZWxWZWxvY2l0eTogbnVtYmVyLFxuICAgICAgICAgICAgYWx0UHJlc3NlZDogYm9vbGVhbiwgY3RybFByZXNzZWQ6IGJvb2xlYW4sIHNoaWZ0UHJlc3NlZDogYm9vbGVhbiwgbWV0YVByZXNzZWQ6IGJvb2xlYW4sIGV2ZW50VHlwZTogbnVtYmVyLCBidXR0b246IG51bWJlciwgbmF0aXZlRXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBQb3B1cHMuX3BvcHVwcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIGxldCBwb3B1cCA9IFBvcHVwcy5fcG9wdXBzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChwb3B1cC5fZG9Qb2ludGVyRXZlbnRDbGltYmluZ1VwKHgsIHksIHgsIHksIHdoZWVsVmVsb2NpdHksIGFsdFByZXNzZWQsIGN0cmxQcmVzc2VkLCBzaGlmdFByZXNzZWQsIG1ldGFQcmVzc2VkLCBldmVudFR5cGUsIGJ1dHRvbiwgbmF0aXZlRXZlbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgdGhyb3cgXCJDYW4gbm90IGluc3RhbnRpYXRlIFBvcHVwcyBjbGFzcy5cIlxuICAgICAgICB9XG5cbiAgICB9XG5cbn1cblxuXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwidXRpbHMudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiZXZlbnRzLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInByb3BlcnRpZXMudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwic3R5bGVzLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImNvbXBvbmVudF9iYXNlL0xheW91dENoaWxkcmVuLnRzXCIvPiBcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJjb21wb25lbnRfYmFzZS9BQ29tcG9uZW50LnRzXCIvPiBcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJjb21wb25lbnRfYmFzZS9BTGF5b3V0LnRzXCIvPiBcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJjb21wb25lbnRfYmFzZS9BVXNlckNvbnRyb2wudHNcIi8+IFxuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwibGF5b3V0cy9QYW5lbC50c1wiLz4gIFxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImxheW91dHMvSGJveC50c1wiLz4gICBcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJsYXlvdXRzL1Zib3gudHNcIi8+ICAgIFxuICAgXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiY29tcG9uZW50cy9MYWJlbC50c1wiLz4gIFxuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicG9wdXBzLnRzXCIvPiBcblxubW9kdWxlIGN1YmVlIHsgICAgICAgICAgICAgICAgXG5cbiAgICBleHBvcnQgY2xhc3MgQ3ViZWVQYW5lbCB7ICAgICAgICBcblxuICAgICAgICBwcml2YXRlIF9sYXlvdXRSdW5PbmNlOiBSdW5PbmNlID0gbnVsbDtcblxuICAgICAgICBwcml2YXRlIF9jb250ZW50UGFuZWw6IFBhbmVsID0gbnVsbDtcbiAgICAgICAgcHJpdmF0ZSBfcm9vdENvbXBvbmVudDogQUNvbXBvbmVudCA9IG51bGw7XG5cblxuICAgICAgICBwcml2YXRlIF9lbGVtZW50OiBIVE1MRWxlbWVudDtcblxuICAgICAgICBwcml2YXRlIF9sZWZ0ID0gLTE7XG4gICAgICAgIHByaXZhdGUgX3RvcCA9IC0xO1xuICAgICAgICBwcml2YXRlIF9jbGllbnRXaWR0aCA9IC0xO1xuICAgICAgICBwcml2YXRlIF9jbGllbnRIZWlnaHQgPSAtMTtcbiAgICAgICAgcHJpdmF0ZSBfb2Zmc2V0V2lkdGggPSAtMTtcbiAgICAgICAgcHJpdmF0ZSBfb2Zmc2V0SGVpZ2h0ID0gLTE7XG5cbiAgICAgICAgY29uc3RydWN0b3IoZWxlbWVudDogSFRNTERpdkVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJvbnJlc2l6ZVwiLCAoZXZ0OiBVSUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5fY29udGVudFBhbmVsID0gbmV3IFBhbmVsKCk7XG4gICAgICAgICAgICB0aGlzLl9jb250ZW50UGFuZWwuZWxlbWVudC5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJub25lXCI7XG4gICAgICAgICAgICB0aGlzLl9jb250ZW50UGFuZWwucG9pbnRlclRyYW5zcGFyZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbC5zZXRDdWJlZVBhbmVsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLl9jb250ZW50UGFuZWwuZWxlbWVudCk7XG5cbiAgICAgICAgICAgIHRoaXMuY2hlY2tCb3VuZHMoKTtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuXG4gICAgICAgICAgICB2YXIgdCA9IG5ldyBUaW1lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgRXZlbnRRdWV1ZS5JbnN0YW5jZS5pbnZva2VMYXRlcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tCb3VuZHMoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdC5zdGFydCgxMDAsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBjaGVja0JvdW5kcygpIHtcbiAgICAgICAgICAgIC8vIFRPRE8gb2Zmc2V0TGVmdCAtPiBhYnNvbHV0ZUxlZnRcbiAgICAgICAgICAgIHZhciBuZXdMZWZ0ID0gdGhpcy5fZWxlbWVudC5vZmZzZXRMZWZ0O1xuICAgICAgICAgICAgLy8gVE9ETyBvZmZzZXRUb3AgLT4gYWJzb2x1dGVUb3BcbiAgICAgICAgICAgIHZhciBuZXdUb3AgPSB0aGlzLl9lbGVtZW50Lm9mZnNldFRvcDtcbiAgICAgICAgICAgIHZhciBuZXdDbGllbnRXaWR0aCA9IHRoaXMuX2VsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgICAgICAgICB2YXIgbmV3Q2xpZW50SGVpZ2h0ID0gdGhpcy5fZWxlbWVudC5jbGllbnRIZWlnaHQ7XG4gICAgICAgICAgICB2YXIgbmV3T2Zmc2V0V2lkdGggPSB0aGlzLl9lbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICAgICAgdmFyIG5ld09mZnNldEhlaWdodCA9IHRoaXMuX2VsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgaWYgKG5ld0xlZnQgIT0gdGhpcy5fbGVmdCB8fCBuZXdUb3AgIT0gdGhpcy5fdG9wIHx8IG5ld0NsaWVudFdpZHRoICE9IHRoaXMuX2NsaWVudFdpZHRoIHx8IG5ld0NsaWVudEhlaWdodCAhPSB0aGlzLl9jbGllbnRIZWlnaHRcbiAgICAgICAgICAgICAgICB8fCBuZXdPZmZzZXRXaWR0aCAhPSB0aGlzLl9vZmZzZXRXaWR0aCB8fCBuZXdPZmZzZXRIZWlnaHQgIT0gdGhpcy5fb2Zmc2V0SGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGVmdCA9IG5ld0xlZnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fdG9wID0gbmV3VG9wO1xuICAgICAgICAgICAgICAgIHRoaXMuX2NsaWVudFdpZHRoID0gbmV3Q2xpZW50V2lkdGg7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2xpZW50SGVpZ2h0ID0gbmV3Q2xpZW50SGVpZ2h0O1xuICAgICAgICAgICAgICAgIHRoaXMuX29mZnNldFdpZHRoID0gbmV3T2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICAgICAgdGhpcy5fb2Zmc2V0SGVpZ2h0ID0gbmV3T2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbC53aWR0aCA9IHRoaXMuX29mZnNldFdpZHRoO1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbC5oZWlnaHQgPSB0aGlzLl9vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2VsZW1lbnQuc3R5bGUucG9zaXRpb24gPT0gXCJhYnNvbHV0ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbC50cmFuc2xhdGVYID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29udGVudFBhbmVsLnRyYW5zbGF0ZVkgPSAwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbC50cmFuc2xhdGVYID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29udGVudFBhbmVsLnRyYW5zbGF0ZVkgPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlcXVlc3RMYXlvdXQoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fbGF5b3V0UnVuT25jZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGF5b3V0UnVuT25jZSA9IG5ldyBSdW5PbmNlKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXlvdXQoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2xheW91dFJ1bk9uY2UucnVuKCk7XG4gICAgICAgIH1cblxuICAgICAgICBsYXlvdXQoKSB7XG4gICAgICAgICAgICBQb3B1cHMuX3JlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbC5sYXlvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCByb290Q29tcG9uZW50KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jvb3RDb21wb25lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBzZXQgcm9vdENvbXBvbmVudChyb290Q29tcG9uZW50OiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9jb250ZW50UGFuZWwuY2hpbGRyZW4uY2xlYXIoKTtcbiAgICAgICAgICAgIHRoaXMuX3Jvb3RDb21wb25lbnQgPSBudWxsO1xuICAgICAgICAgICAgaWYgKHJvb3RDb21wb25lbnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbC5jaGlsZHJlbi5hZGQocm9vdENvbXBvbmVudCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcm9vdENvbXBvbmVudCA9IHJvb3RDb21wb25lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBfZG9Qb2ludGVyRXZlbnRDbGltYmluZ1VwKHNjcmVlblg6IG51bWJlciwgc2NyZWVuWTogbnVtYmVyLCB3aGVlbFZlbG9jaXR5OiBudW1iZXIsXG4gICAgICAgICAgICBhbHRQcmVzc2VkOiBib29sZWFuLCBjdHJsUHJlc3NlZDogYm9vbGVhbiwgc2hpZnRQcmVzc2VkOiBib29sZWFuLCBtZXRhUHJlc3NlZDogYm9vbGVhbiwgZXZlbnRUeXBlOiBudW1iZXIsIGJ1dHRvbjogbnVtYmVyLCBuYXRpdmVFdmVudDogTW91c2VFdmVudCkge1xuICAgICAgICAgICAgaWYgKFBvcHVwcy5kb1BvaW50ZXJFdmVudENsaW1iaW5nVXAoc2NyZWVuWCwgc2NyZWVuWSwgd2hlZWxWZWxvY2l0eSwgYWx0UHJlc3NlZCwgY3RybFByZXNzZWQsIHNoaWZ0UHJlc3NlZCwgbWV0YVByZXNzZWQsIGV2ZW50VHlwZSwgYnV0dG9uLCBuYXRpdmVFdmVudCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX2VsZW1lbnQuc3R5bGUucG9zaXRpb24gIT0gXCJhYnNvbHV0ZVwiKSB7XG4gICAgICAgICAgICAgICAgc2NyZWVuWCA9IHNjcmVlblggKyB3aW5kb3cuc2Nyb2xsWCAtIHRoaXMuX2xlZnQ7XG4gICAgICAgICAgICAgICAgc2NyZWVuWSA9IHNjcmVlblkgKyB3aW5kb3cuc2Nyb2xsWSAtIHRoaXMuX3RvcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250ZW50UGFuZWwuX2RvUG9pbnRlckV2ZW50Q2xpbWJpbmdVcChzY3JlZW5YLCBzY3JlZW5ZLCBzY3JlZW5YLCBzY3JlZW5ZLCB3aGVlbFZlbG9jaXR5LCBhbHRQcmVzc2VkLCBjdHJsUHJlc3NlZCwgc2hpZnRQcmVzc2VkLCBtZXRhUHJlc3NlZCwgZXZlbnRUeXBlLCBidXR0b24sIG5hdGl2ZUV2ZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBDbGllbnRXaWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250ZW50UGFuZWwuQ2xpZW50V2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGNsaWVudFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQ2xpZW50V2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGNsaWVudFdpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkNsaWVudFdpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQ2xpZW50SGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRlbnRQYW5lbC5DbGllbnRIZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGNsaWVudEhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkNsaWVudEhlaWdodC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgY2xpZW50SGVpZ2h0KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkNsaWVudEhlaWdodC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEJvdW5kc1dpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRlbnRQYW5lbC5Cb3VuZHNXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm91bmRzV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Cb3VuZHNXaWR0aC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYm91bmRzV2lkdGgodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQm91bmRzV2lkdGgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBCb3VuZHNIZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY29udGVudFBhbmVsLkJvdW5kc0hlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm91bmRzSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm91bmRzSGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBib3VuZHNIZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQm91bmRzSGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm91bmRzTGVmdCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250ZW50UGFuZWwuQm91bmRzTGVmdDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm91bmRzTGVmdCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkJvdW5kc0xlZnQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGJvdW5kc0xlZnQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQm91bmRzTGVmdC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEJvdW5kc1RvcCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250ZW50UGFuZWwuQm91bmRzVG9wO1xuICAgICAgICB9XG4gICAgICAgIGdldCBib3VuZHNUb3AoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Cb3VuZHNUb3AudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGJvdW5kc1RvcCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Cb3VuZHNUb3AudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG59XG5cblxuIiwibW9kdWxlIGN1YmVlIHtcbiAgICBcbiAgICBleHBvcnQgY2xhc3MgQVZpZXc8VD4gZXh0ZW5kcyBBVXNlckNvbnRyb2wge1xuICAgICAgICBcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBfbW9kZWw6IFQpIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGdldCBtb2RlbCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tb2RlbDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG4gICAgXG59XG5cbiJdfQ==