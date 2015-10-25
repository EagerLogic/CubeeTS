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
            this.queue = [];
            this.timer = null;
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
        EventQueue.prototype.EventQueue = function () {
            var _this = this;
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
                catch (ex) {
                    new Console().error(ex);
                }
                if (size > 0) {
                    _this.timer.start(0, false);
                }
                else {
                    _this.timer.start(50, false);
                }
            });
            this.timer.start(10, false);
        };
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
                return this._value;
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
        Property.prototype.bindListener = function () {
            this.invalidateIfNeeded();
        };
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
/// <reference path="utils.ts"/>
/// <reference path="events.ts"/>
/// <reference path="properties.ts"/>
var cubee;
(function (cubee) {
    var MouseDownEventLog = (function () {
        function MouseDownEventLog(component, screenX, screenY, x, y, timestamp) {
            if (timestamp === void 0) { timestamp = Date.now(); }
            this.component = component;
            this.screenX = screenX;
            this.screenY = screenY;
            this.x = x;
            this.y = y;
            this.timestamp = timestamp;
        }
        return MouseDownEventLog;
    })();
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
            this._cursor = new cubee.Property(ECursor.AUTO, false, false);
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
            this._element.style.boxSizing = "content-box";
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
        Object.defineProperty(AComponent.prototype, "minWIdth", {
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
    var ALayout = (function (_super) {
        __extends(ALayout, _super);
        function ALayout(element) {
            _super.call(this, element);
            this._children = new LayoutChildren(this);
        }
        Object.defineProperty(ALayout.prototype, "children", {
            get: function () {
                return this._children;
            },
            enumerable: true,
            configurable: true
        });
        ALayout.prototype.layout = function () {
            this._needsLayout = false;
            for (var i = 0; i < this.children.size(); i++) {
                var child = this.children.get(i);
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
                for (var i = 0; i < root.children.size(); i++) {
                    var component = root.children.get(i);
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
    })(AComponent);
    cubee.ALayout = ALayout;
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
                for (var i = 0; i < this.children.size(); i++) {
                    var component = this.children.get(i);
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
    })(ALayout);
    cubee.AUserControl = AUserControl;
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
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var Panel = (function (_super) {
        __extends(Panel, _super);
        function Panel() {
            _super.apply(this, arguments);
        }
        return Panel;
    })(cubee.AUserControl);
    cubee.Panel = Panel;
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
/// <reference path="component_base.ts"/>
/// <reference path="components.ts"/> 
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3ViZWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9ldmVudHMudHMiLCIuLi8uLi9wcm9wZXJ0aWVzLnRzIiwiLi4vLi4vc3R5bGVzLnRzIiwiLi4vLi4vdXRpbHMudHMiLCIuLi8uLi9jb21wb25lbnRfYmFzZS50cyIsIi4uLy4uL2NvbXBvbmVudHMudHMiLCIuLi8uLi9wb3B1cHMudHMiLCIuLi8uLi9jdWJlZS50cyJdLCJuYW1lcyI6WyJjdWJlZSIsImN1YmVlLkV2ZW50QXJncyIsImN1YmVlLkV2ZW50QXJncy5jb25zdHJ1Y3RvciIsImN1YmVlLkV2ZW50IiwiY3ViZWUuRXZlbnQuY29uc3RydWN0b3IiLCJjdWJlZS5FdmVudC5FdmVudCIsImN1YmVlLkV2ZW50LmFkZExpc3RlbmVyIiwiY3ViZWUuRXZlbnQucmVtb3ZlTGlzdGVuZXIiLCJjdWJlZS5FdmVudC5oYXNMaXN0ZW5lciIsImN1YmVlLkV2ZW50LmZpcmVFdmVudCIsImN1YmVlLlRpbWVyIiwiY3ViZWUuVGltZXIuY29uc3RydWN0b3IiLCJjdWJlZS5UaW1lci5zdGFydCIsImN1YmVlLlRpbWVyLnN0b3AiLCJjdWJlZS5UaW1lci5TdGFydGVkIiwiY3ViZWUuRXZlbnRRdWV1ZSIsImN1YmVlLkV2ZW50UXVldWUuY29uc3RydWN0b3IiLCJjdWJlZS5FdmVudFF1ZXVlLkluc3RhbmNlIiwiY3ViZWUuRXZlbnRRdWV1ZS5FdmVudFF1ZXVlIiwiY3ViZWUuRXZlbnRRdWV1ZS5pbnZva2VMYXRlciIsImN1YmVlLkV2ZW50UXVldWUuaW52b2tlUHJpb3IiLCJjdWJlZS5SdW5PbmNlIiwiY3ViZWUuUnVuT25jZS5jb25zdHJ1Y3RvciIsImN1YmVlLlJ1bk9uY2UucnVuIiwiY3ViZWUuTW91c2VEcmFnRXZlbnRBcmdzIiwiY3ViZWUuTW91c2VEcmFnRXZlbnRBcmdzLmNvbnN0cnVjdG9yIiwiY3ViZWUuTW91c2VVcEV2ZW50QXJncyIsImN1YmVlLk1vdXNlVXBFdmVudEFyZ3MuY29uc3RydWN0b3IiLCJjdWJlZS5Nb3VzZURvd25FdmVudEFyZ3MiLCJjdWJlZS5Nb3VzZURvd25FdmVudEFyZ3MuY29uc3RydWN0b3IiLCJjdWJlZS5Nb3VzZU1vdmVFdmVudEFyZ3MiLCJjdWJlZS5Nb3VzZU1vdmVFdmVudEFyZ3MuY29uc3RydWN0b3IiLCJjdWJlZS5Nb3VzZVdoZWVsRXZlbnRBcmdzIiwiY3ViZWUuTW91c2VXaGVlbEV2ZW50QXJncy5jb25zdHJ1Y3RvciIsImN1YmVlLkNsaWNrRXZlbnRBcmdzIiwiY3ViZWUuQ2xpY2tFdmVudEFyZ3MuY29uc3RydWN0b3IiLCJjdWJlZS5LZXlFdmVudEFyZ3MiLCJjdWJlZS5LZXlFdmVudEFyZ3MuY29uc3RydWN0b3IiLCJjdWJlZS5QYXJlbnRDaGFuZ2VkRXZlbnRBcmdzIiwiY3ViZWUuUGFyZW50Q2hhbmdlZEV2ZW50QXJncy5jb25zdHJ1Y3RvciIsImN1YmVlLkNvbnRleHRNZW51RXZlbnRBcmdzIiwiY3ViZWUuQ29udGV4dE1lbnVFdmVudEFyZ3MuY29uc3RydWN0b3IiLCJjdWJlZS5Qcm9wZXJ0eSIsImN1YmVlLlByb3BlcnR5LmNvbnN0cnVjdG9yIiwiY3ViZWUuUHJvcGVydHkuaWQiLCJjdWJlZS5Qcm9wZXJ0eS52YWxpZCIsImN1YmVlLlByb3BlcnR5LnZhbHVlIiwiY3ViZWUuUHJvcGVydHkubnVsbGFibGUiLCJjdWJlZS5Qcm9wZXJ0eS5yZWFkb25seSIsImN1YmVlLlByb3BlcnR5LmJpbmRMaXN0ZW5lciIsImN1YmVlLlByb3BlcnR5LmluaXRSZWFkb25seUJpbmQiLCJjdWJlZS5Qcm9wZXJ0eS5nZXQiLCJjdWJlZS5Qcm9wZXJ0eS5zZXQiLCJjdWJlZS5Qcm9wZXJ0eS5pbnZhbGlkYXRlIiwiY3ViZWUuUHJvcGVydHkuaW52YWxpZGF0ZUlmTmVlZGVkIiwiY3ViZWUuUHJvcGVydHkuZmlyZUNoYW5nZUxpc3RlbmVycyIsImN1YmVlLlByb3BlcnR5LmdldE9iamVjdFZhbHVlIiwiY3ViZWUuUHJvcGVydHkuYWRkQ2hhbmdlTGlzdGVuZXIiLCJjdWJlZS5Qcm9wZXJ0eS5yZW1vdmVDaGFuZ2VMaXN0ZW5lciIsImN1YmVlLlByb3BlcnR5Lmhhc0NoYW5nZUxpc3RlbmVyIiwiY3ViZWUuUHJvcGVydHkuYW5pbWF0ZSIsImN1YmVlLlByb3BlcnR5LmJpbmQiLCJjdWJlZS5Qcm9wZXJ0eS5iaWRpcmVjdGlvbmFsQmluZCIsImN1YmVlLlByb3BlcnR5LnVuYmluZCIsImN1YmVlLlByb3BlcnR5LnVuYmluZFRhcmdldHMiLCJjdWJlZS5Qcm9wZXJ0eS5pc0JvdW5kIiwiY3ViZWUuUHJvcGVydHkuaXNCaWRpcmVjdGlvbmFsQm91bmQiLCJjdWJlZS5Qcm9wZXJ0eS5jcmVhdGVQcm9wZXJ0eUxpbmUiLCJjdWJlZS5Qcm9wZXJ0eS5kZXN0cm95IiwiY3ViZWUuRXhwcmVzc2lvbiIsImN1YmVlLkV4cHJlc3Npb24uY29uc3RydWN0b3IiLCJjdWJlZS5FeHByZXNzaW9uLnZhbHVlIiwiY3ViZWUuRXhwcmVzc2lvbi5hZGRDaGFuZ2VMaXN0ZW5lciIsImN1YmVlLkV4cHJlc3Npb24ucmVtb3ZlQ2hhbmdlTGlzdGVuZXIiLCJjdWJlZS5FeHByZXNzaW9uLmhhc0NoYW5nZUxpc3RlbmVyIiwiY3ViZWUuRXhwcmVzc2lvbi5nZXRPYmplY3RWYWx1ZSIsImN1YmVlLkV4cHJlc3Npb24uYmluZCIsImN1YmVlLkV4cHJlc3Npb24udW5iaW5kQWxsIiwiY3ViZWUuRXhwcmVzc2lvbi51bmJpbmQiLCJjdWJlZS5FeHByZXNzaW9uLmludmFsaWRhdGUiLCJjdWJlZS5FeHByZXNzaW9uLmludmFsaWRhdGVJZk5lZWRlZCIsImN1YmVlLkV4cHJlc3Npb24uZmlyZUNoYW5nZUxpc3RlbmVycyIsImN1YmVlLktleUZyYW1lIiwiY3ViZWUuS2V5RnJhbWUuY29uc3RydWN0b3IiLCJjdWJlZS5LZXlGcmFtZS50aW1lIiwiY3ViZWUuS2V5RnJhbWUucHJvcGVydHkiLCJjdWJlZS5LZXlGcmFtZS5lbmRWYWx1ZSIsImN1YmVlLktleUZyYW1lLmludGVycG9sYXRvciIsImN1YmVlLktleUZyYW1lLmtleUZyYW1lUmVhY2hlZExpc3RlbmVyIiwiY3ViZWUuUHJvcGVydHlMaW5lIiwiY3ViZWUuUHJvcGVydHlMaW5lLmNvbnN0cnVjdG9yIiwiY3ViZWUuUHJvcGVydHlMaW5lLnN0YXJ0VGltZSIsImN1YmVlLlByb3BlcnR5TGluZS5hbmltYXRlIiwiY3ViZWUuSW50ZXJwb2xhdG9ycyIsImN1YmVlLkludGVycG9sYXRvcnMuY29uc3RydWN0b3IiLCJjdWJlZS5JbnRlcnBvbGF0b3JzLkxpbmVhciIsImN1YmVlLkFBbmltYXRvciIsImN1YmVlLkFBbmltYXRvci5jb25zdHJ1Y3RvciIsImN1YmVlLkFBbmltYXRvci5hbmltYXRlIiwiY3ViZWUuQUFuaW1hdG9yLnN0YXJ0IiwiY3ViZWUuQUFuaW1hdG9yLnN0b3AiLCJjdWJlZS5BQW5pbWF0b3IuU3RhcnRlZCIsImN1YmVlLkFBbmltYXRvci5TdG9wcGVkIiwiY3ViZWUuVGltZWxpbmUiLCJjdWJlZS5UaW1lbGluZS5jb25zdHJ1Y3RvciIsImN1YmVlLlRpbWVsaW5lLmNyZWF0ZVByb3BlcnR5TGluZXMiLCJjdWJlZS5UaW1lbGluZS5zdGFydCIsImN1YmVlLlRpbWVsaW5lLnN0b3AiLCJjdWJlZS5UaW1lbGluZS5vbkFuaW1hdGUiLCJjdWJlZS5UaW1lbGluZS5vbkZpbmlzaGVkRXZlbnQiLCJjdWJlZS5UaW1lbGluZUZpbmlzaGVkRXZlbnRBcmdzIiwiY3ViZWUuVGltZWxpbmVGaW5pc2hlZEV2ZW50QXJncy5jb25zdHJ1Y3RvciIsImN1YmVlLlRpbWVsaW5lRmluaXNoZWRFdmVudEFyZ3MuU3RvcHBlZCIsImN1YmVlLk51bWJlclByb3BlcnR5IiwiY3ViZWUuTnVtYmVyUHJvcGVydHkuY29uc3RydWN0b3IiLCJjdWJlZS5OdW1iZXJQcm9wZXJ0eS5hbmltYXRlIiwiY3ViZWUuU3RyaW5nUHJvcGVydHkiLCJjdWJlZS5TdHJpbmdQcm9wZXJ0eS5jb25zdHJ1Y3RvciIsImN1YmVlLlBhZGRpbmdQcm9wZXJ0eSIsImN1YmVlLlBhZGRpbmdQcm9wZXJ0eS5jb25zdHJ1Y3RvciIsImN1YmVlLkJvcmRlclByb3BlcnR5IiwiY3ViZWUuQm9yZGVyUHJvcGVydHkuY29uc3RydWN0b3IiLCJjdWJlZS5CYWNrZ3JvdW5kUHJvcGVydHkiLCJjdWJlZS5CYWNrZ3JvdW5kUHJvcGVydHkuY29uc3RydWN0b3IiLCJjdWJlZS5Cb29sZWFuUHJvcGVydHkiLCJjdWJlZS5Cb29sZWFuUHJvcGVydHkuY29uc3RydWN0b3IiLCJjdWJlZS5BQmFja2dyb3VuZCIsImN1YmVlLkFCYWNrZ3JvdW5kLmNvbnN0cnVjdG9yIiwiY3ViZWUuQ29sb3IiLCJjdWJlZS5Db2xvci5jb25zdHJ1Y3RvciIsImN1YmVlLkNvbG9yLlRSQU5TUEFSRU5UIiwiY3ViZWUuQ29sb3IuZ2V0QXJnYkNvbG9yIiwiY3ViZWUuQ29sb3IuZ2V0QXJnYkNvbG9yQnlDb21wb25lbnRzIiwiY3ViZWUuQ29sb3IuZ2V0UmdiQ29sb3IiLCJjdWJlZS5Db2xvci5nZXRSZ2JDb2xvckJ5Q29tcG9uZW50cyIsImN1YmVlLkNvbG9yLmZpeENvbXBvbmVudCIsImN1YmVlLkNvbG9yLmZhZGVDb2xvcnMiLCJjdWJlZS5Db2xvci5taXhDb21wb25lbnQiLCJjdWJlZS5Db2xvci5hcmdiIiwiY3ViZWUuQ29sb3IuYWxwaGEiLCJjdWJlZS5Db2xvci5yZWQiLCJjdWJlZS5Db2xvci5ncmVlbiIsImN1YmVlLkNvbG9yLmJsdWUiLCJjdWJlZS5Db2xvci5mYWRlIiwiY3ViZWUuQ29sb3IudG9DU1MiLCJjdWJlZS5Db2xvckJhY2tncm91bmQiLCJjdWJlZS5Db2xvckJhY2tncm91bmQuY29uc3RydWN0b3IiLCJjdWJlZS5Db2xvckJhY2tncm91bmQuY29sb3IiLCJjdWJlZS5Db2xvckJhY2tncm91bmQuYXBwbHkiLCJjdWJlZS5QYWRkaW5nIiwiY3ViZWUuUGFkZGluZy5jb25zdHJ1Y3RvciIsImN1YmVlLlBhZGRpbmcuY3JlYXRlIiwiY3ViZWUuUGFkZGluZy5sZWZ0IiwiY3ViZWUuUGFkZGluZy50b3AiLCJjdWJlZS5QYWRkaW5nLnJpZ2h0IiwiY3ViZWUuUGFkZGluZy5ib3R0b20iLCJjdWJlZS5QYWRkaW5nLmFwcGx5IiwiY3ViZWUuQm9yZGVyIiwiY3ViZWUuQm9yZGVyLmNvbnN0cnVjdG9yIiwiY3ViZWUuQm9yZGVyLmNyZWF0ZSIsImN1YmVlLkJvcmRlci5sZWZ0V2lkdGgiLCJjdWJlZS5Cb3JkZXIudG9wV2lkdGgiLCJjdWJlZS5Cb3JkZXIucmlnaHRXaWR0aCIsImN1YmVlLkJvcmRlci5ib3R0b21XaWR0aCIsImN1YmVlLkJvcmRlci5sZWZ0Q29sb3IiLCJjdWJlZS5Cb3JkZXIudG9wQ29sb3IiLCJjdWJlZS5Cb3JkZXIucmlnaHRDb2xvciIsImN1YmVlLkJvcmRlci5ib3R0b21Db2xvciIsImN1YmVlLkJvcmRlci50b3BMZWZ0UmFkaXVzIiwiY3ViZWUuQm9yZGVyLnRvcFJpZ2h0UmFkaXVzIiwiY3ViZWUuQm9yZGVyLmJvdHRvbUxlZnRSYWRpdXMiLCJjdWJlZS5Cb3JkZXIuYm90dG9tUmlnaHRSYWRpdXMiLCJjdWJlZS5Cb3JkZXIuYXBwbHkiLCJjdWJlZS5Cb3hTaGFkb3ciLCJjdWJlZS5Cb3hTaGFkb3cuY29uc3RydWN0b3IiLCJjdWJlZS5Cb3hTaGFkb3cuaFBvcyIsImN1YmVlLkJveFNoYWRvdy52UG9zIiwiY3ViZWUuQm94U2hhZG93LmJsdXIiLCJjdWJlZS5Cb3hTaGFkb3cuc3ByZWFkIiwiY3ViZWUuQm94U2hhZG93LmNvbG9yIiwiY3ViZWUuQm94U2hhZG93LmlubmVyIiwiY3ViZWUuQm94U2hhZG93LmFwcGx5IiwiY3ViZWUuUG9pbnQyRCIsImN1YmVlLlBvaW50MkQuY29uc3RydWN0b3IiLCJjdWJlZS5Qb2ludDJELngiLCJjdWJlZS5Qb2ludDJELnkiLCJjdWJlZS5Nb3VzZURvd25FdmVudExvZyIsImN1YmVlLk1vdXNlRG93bkV2ZW50TG9nLmNvbnN0cnVjdG9yIiwiY3ViZWUuRUN1cnNvciIsImN1YmVlLkVDdXJzb3IuY29uc3RydWN0b3IiLCJjdWJlZS5FQ3Vyc29yLkFVVE8iLCJjdWJlZS5FQ3Vyc29yLmNzcyIsImN1YmVlLkxheW91dENoaWxkcmVuIiwiY3ViZWUuTGF5b3V0Q2hpbGRyZW4uY29uc3RydWN0b3IiLCJjdWJlZS5MYXlvdXRDaGlsZHJlbi5hZGQiLCJjdWJlZS5MYXlvdXRDaGlsZHJlbi5pbnNlcnQiLCJjdWJlZS5MYXlvdXRDaGlsZHJlbi5yZW1vdmVDb21wb25lbnQiLCJjdWJlZS5MYXlvdXRDaGlsZHJlbi5yZW1vdmVJbmRleCIsImN1YmVlLkxheW91dENoaWxkcmVuLmNsZWFyIiwiY3ViZWUuTGF5b3V0Q2hpbGRyZW4uZ2V0IiwiY3ViZWUuTGF5b3V0Q2hpbGRyZW4uaW5kZXhPZiIsImN1YmVlLkxheW91dENoaWxkcmVuLnNpemUiLCJjdWJlZS5BQ29tcG9uZW50IiwiY3ViZWUuQUNvbXBvbmVudC5jb25zdHJ1Y3RvciIsImN1YmVlLkFDb21wb25lbnQuaW52b2tlUG9zdENvbnN0cnVjdCIsImN1YmVlLkFDb21wb25lbnQucG9zdENvbnN0cnVjdCIsImN1YmVlLkFDb21wb25lbnQuc2V0Q3ViZWVQYW5lbCIsImN1YmVlLkFDb21wb25lbnQuZ2V0Q3ViZWVQYW5lbCIsImN1YmVlLkFDb21wb25lbnQudXBkYXRlVHJhbnNmb3JtIiwiY3ViZWUuQUNvbXBvbmVudC5yZXF1ZXN0TGF5b3V0IiwiY3ViZWUuQUNvbXBvbmVudC5tZWFzdXJlIiwiY3ViZWUuQUNvbXBvbmVudC5vbk1lYXN1cmUiLCJjdWJlZS5BQ29tcG9uZW50LnNjYWxlUG9pbnQiLCJjdWJlZS5BQ29tcG9uZW50LnJvdGF0ZVBvaW50IiwiY3ViZWUuQUNvbXBvbmVudC5lbGVtZW50IiwiY3ViZWUuQUNvbXBvbmVudC5wYXJlbnQiLCJjdWJlZS5BQ29tcG9uZW50Ll9zZXRQYXJlbnQiLCJjdWJlZS5BQ29tcG9uZW50LmxheW91dCIsImN1YmVlLkFDb21wb25lbnQubmVlZHNMYXlvdXQiLCJjdWJlZS5BQ29tcG9uZW50LlRyYW5zbGF0ZVgiLCJjdWJlZS5BQ29tcG9uZW50LnRyYW5zbGF0ZVgiLCJjdWJlZS5BQ29tcG9uZW50LlRyYW5zbGF0ZVkiLCJjdWJlZS5BQ29tcG9uZW50LnRyYW5zbGF0ZVkiLCJjdWJlZS5BQ29tcG9uZW50LlBhZGRpbmciLCJjdWJlZS5BQ29tcG9uZW50LnBhZGRpbmciLCJjdWJlZS5BQ29tcG9uZW50LkJvcmRlciIsImN1YmVlLkFDb21wb25lbnQuYm9yZGVyIiwiY3ViZWUuQUNvbXBvbmVudC5NZWFzdXJlZFdpZHRoIiwiY3ViZWUuQUNvbXBvbmVudC5tZWFzdXJlZFdpZHRoIiwiY3ViZWUuQUNvbXBvbmVudC5NZWFzdXJlZEhlaWdodCIsImN1YmVlLkFDb21wb25lbnQubWVhc3VyZWRIZWlnaHQiLCJjdWJlZS5BQ29tcG9uZW50LkNsaWVudFdpZHRoIiwiY3ViZWUuQUNvbXBvbmVudC5jbGllbnRXaWR0aCIsImN1YmVlLkFDb21wb25lbnQuQ2xpZW50SGVpZ2h0IiwiY3ViZWUuQUNvbXBvbmVudC5jbGllbnRIZWlnaHQiLCJjdWJlZS5BQ29tcG9uZW50LkJvdW5kc1dpZHRoIiwiY3ViZWUuQUNvbXBvbmVudC5ib3VuZHNXaWR0aCIsImN1YmVlLkFDb21wb25lbnQuQm91bmRzSGVpZ2h0IiwiY3ViZWUuQUNvbXBvbmVudC5ib3VuZHNIZWlnaHQiLCJjdWJlZS5BQ29tcG9uZW50LkJvdW5kc0xlZnQiLCJjdWJlZS5BQ29tcG9uZW50LmJvdW5kc0xlZnQiLCJjdWJlZS5BQ29tcG9uZW50LkJvdW5kc1RvcCIsImN1YmVlLkFDb21wb25lbnQuYm91bmRzVG9wIiwiY3ViZWUuQUNvbXBvbmVudC5NaW5XaWR0aCIsImN1YmVlLkFDb21wb25lbnQubWluV0lkdGgiLCJjdWJlZS5BQ29tcG9uZW50Lk1pbkhlaWdodCIsImN1YmVlLkFDb21wb25lbnQubWluSGVpZ2h0IiwiY3ViZWUuQUNvbXBvbmVudC5NYXhXaWR0aCIsImN1YmVlLkFDb21wb25lbnQubWF4V2lkdGgiLCJjdWJlZS5BQ29tcG9uZW50Lk1heEhlaWdodCIsImN1YmVlLkFDb21wb25lbnQubWF4SGVpZ2h0IiwiY3ViZWUuQUNvbXBvbmVudC5zZXRQb3NpdGlvbiIsImN1YmVlLkFDb21wb25lbnQuX3NldExlZnQiLCJjdWJlZS5BQ29tcG9uZW50Ll9zZXRUb3AiLCJjdWJlZS5BQ29tcG9uZW50LnNldFNpemUiLCJjdWJlZS5BQ29tcG9uZW50LkN1cnNvciIsImN1YmVlLkFDb21wb25lbnQuY3Vyc29yIiwiY3ViZWUuQUNvbXBvbmVudC5Qb2ludGVyVHJhbnNwYXJlbnQiLCJjdWJlZS5BQ29tcG9uZW50LnBvaW50ZXJUcmFuc3BhcmVudCIsImN1YmVlLkFDb21wb25lbnQuVmlzaWJsZSIsImN1YmVlLkFDb21wb25lbnQudmlzaWJsZSIsImN1YmVlLkFDb21wb25lbnQub25DbGljayIsImN1YmVlLkFDb21wb25lbnQub25Db250ZXh0TWVudSIsImN1YmVlLkFDb21wb25lbnQub25Nb3VzZURvd24iLCJjdWJlZS5BQ29tcG9uZW50Lm9uTW91c2VNb3ZlIiwiY3ViZWUuQUNvbXBvbmVudC5vbk1vdXNlVXAiLCJjdWJlZS5BQ29tcG9uZW50Lm9uTW91c2VFbnRlciIsImN1YmVlLkFDb21wb25lbnQub25Nb3VzZUxlYXZlIiwiY3ViZWUuQUNvbXBvbmVudC5vbk1vdXNlV2hlZWwiLCJjdWJlZS5BQ29tcG9uZW50Lm9uS2V5RG93biIsImN1YmVlLkFDb21wb25lbnQub25LZXlQcmVzcyIsImN1YmVlLkFDb21wb25lbnQub25LZXlVcCIsImN1YmVlLkFDb21wb25lbnQub25QYXJlbnRDaGFuZ2VkIiwiY3ViZWUuQUNvbXBvbmVudC5BbHBoYSIsImN1YmVlLkFDb21wb25lbnQuYWxwaGEiLCJjdWJlZS5BQ29tcG9uZW50LkhhbmRsZVBvaW50ZXIiLCJjdWJlZS5BQ29tcG9uZW50LmhhbmRsZVBvaW50ZXIiLCJjdWJlZS5BQ29tcG9uZW50LkVuYWJsZWQiLCJjdWJlZS5BQ29tcG9uZW50LmVuYWJsZWQiLCJjdWJlZS5BQ29tcG9uZW50LlNlbGVjdGFibGUiLCJjdWJlZS5BQ29tcG9uZW50LnNlbGVjdGFibGUiLCJjdWJlZS5BQ29tcG9uZW50LmxlZnQiLCJjdWJlZS5BQ29tcG9uZW50LnRvcCIsImN1YmVlLkFDb21wb25lbnQuX2RvUG9pbnRlckV2ZW50Q2xpbWJpbmdVcCIsImN1YmVlLkFDb21wb25lbnQub25Qb2ludGVyRXZlbnRDbGltYmluZ1VwIiwiY3ViZWUuQUNvbXBvbmVudC5vblBvaW50ZXJFdmVudEZhbGxpbmdEb3duIiwiY3ViZWUuQUNvbXBvbmVudC5faXNJbnRlcnNlY3RzUG9pbnQiLCJjdWJlZS5BQ29tcG9uZW50LmlzUG9pbnRJbnRlcnNlY3RzTGluZSIsImN1YmVlLkFDb21wb25lbnQuUm90YXRlIiwiY3ViZWUuQUNvbXBvbmVudC5yb3RhdGUiLCJjdWJlZS5BQ29tcG9uZW50LlNjYWxlWCIsImN1YmVlLkFDb21wb25lbnQuc2NhbGVYIiwiY3ViZWUuQUNvbXBvbmVudC5TY2FsZVkiLCJjdWJlZS5BQ29tcG9uZW50LnNjYWxlWSIsImN1YmVlLkFDb21wb25lbnQuVHJhbnNmb3JtQ2VudGVyWCIsImN1YmVlLkFDb21wb25lbnQudHJhbnNmb3JtQ2VudGVyWCIsImN1YmVlLkFDb21wb25lbnQuVHJhbnNmb3JtQ2VudGVyWSIsImN1YmVlLkFDb21wb25lbnQudHJhbnNmb3JtQ2VudGVyWSIsImN1YmVlLkFDb21wb25lbnQuSG92ZXJlZCIsImN1YmVlLkFDb21wb25lbnQuaG92ZXJlZCIsImN1YmVlLkFDb21wb25lbnQuUHJlc3NlZCIsImN1YmVlLkFDb21wb25lbnQucHJlc3NlZCIsImN1YmVlLkFMYXlvdXQiLCJjdWJlZS5BTGF5b3V0LmNvbnN0cnVjdG9yIiwiY3ViZWUuQUxheW91dC5jaGlsZHJlbiIsImN1YmVlLkFMYXlvdXQubGF5b3V0IiwiY3ViZWUuQUxheW91dC5fZG9Qb2ludGVyRXZlbnRDbGltYmluZ1VwIiwiY3ViZWUuQUxheW91dC5fcm90YXRlUG9pbnQiLCJjdWJlZS5BTGF5b3V0LmdldENvbXBvbmVudHNBdFBvc2l0aW9uIiwiY3ViZWUuQUxheW91dC5nZXRDb21wb25lbnRzQXRQb3NpdGlvbl9pbXBsIiwiY3ViZWUuQUxheW91dC5zZXRDaGlsZExlZnQiLCJjdWJlZS5BTGF5b3V0LnNldENoaWxkVG9wIiwiY3ViZWUuQVVzZXJDb250cm9sIiwiY3ViZWUuQVVzZXJDb250cm9sLmNvbnN0cnVjdG9yIiwiY3ViZWUuQVVzZXJDb250cm9sLldpZHRoIiwiY3ViZWUuQVVzZXJDb250cm9sLndpZHRoIiwiY3ViZWUuQVVzZXJDb250cm9sLkhlaWdodCIsImN1YmVlLkFVc2VyQ29udHJvbC5oZWlnaHQiLCJjdWJlZS5BVXNlckNvbnRyb2wuQmFja2dyb3VuZCIsImN1YmVlLkFVc2VyQ29udHJvbC5iYWNrZ3JvdW5kIiwiY3ViZWUuQVVzZXJDb250cm9sLlNoYWRvdyIsImN1YmVlLkFVc2VyQ29udHJvbC5zaGFkb3ciLCJjdWJlZS5BVXNlckNvbnRyb2wuRHJhZ2dhYmxlIiwiY3ViZWUuQVVzZXJDb250cm9sLmRyYWdnYWJsZSIsImN1YmVlLkFVc2VyQ29udHJvbC5fb25DaGlsZEFkZGVkIiwiY3ViZWUuQVVzZXJDb250cm9sLl9vbkNoaWxkUmVtb3ZlZCIsImN1YmVlLkFVc2VyQ29udHJvbC5fb25DaGlsZHJlbkNsZWFyZWQiLCJjdWJlZS5BVXNlckNvbnRyb2wub25MYXlvdXQiLCJjdWJlZS5Nb3VzZUV2ZW50VHlwZXMiLCJjdWJlZS5Nb3VzZUV2ZW50VHlwZXMuY29uc3RydWN0b3IiLCJjdWJlZS5QYW5lbCIsImN1YmVlLlBhbmVsLmNvbnN0cnVjdG9yIiwiY3ViZWUuQVBvcHVwIiwiY3ViZWUuQVBvcHVwLmNvbnN0cnVjdG9yIiwiY3ViZWUuQVBvcHVwLl9fX3BvcHVwUm9vdCIsImN1YmVlLkFQb3B1cC5yb290Q29tcG9uZW50IiwiY3ViZWUuQVBvcHVwLnNob3ciLCJjdWJlZS5BUG9wdXAuY2xvc2UiLCJjdWJlZS5BUG9wdXAuaXNDbG9zZUFsbG93ZWQiLCJjdWJlZS5BUG9wdXAub25DbG9zZWQiLCJjdWJlZS5BUG9wdXAubW9kYWwiLCJjdWJlZS5BUG9wdXAuYXV0b0Nsb3NlIiwiY3ViZWUuQVBvcHVwLmdsYXNzQ29sb3IiLCJjdWJlZS5BUG9wdXAuVHJhbnNsYXRlWCIsImN1YmVlLkFQb3B1cC50cmFuc2xhdGVYIiwiY3ViZWUuQVBvcHVwLlRyYW5zbGF0ZVkiLCJjdWJlZS5BUG9wdXAudHJhbnNsYXRlWSIsImN1YmVlLkFQb3B1cC5DZW50ZXIiLCJjdWJlZS5BUG9wdXAuY2VudGVyIiwiY3ViZWUuQVBvcHVwLl9kb1BvaW50ZXJFdmVudENsaW1iaW5nVXAiLCJjdWJlZS5BUG9wdXAuX2xheW91dCIsImN1YmVlLlBvcHVwcyIsImN1YmVlLlBvcHVwcy5jb25zdHJ1Y3RvciIsImN1YmVlLlBvcHVwcy5fYWRkUG9wdXAiLCJjdWJlZS5Qb3B1cHMuX3JlbW92ZVBvcHVwIiwiY3ViZWUuUG9wdXBzLl9yZXF1ZXN0TGF5b3V0IiwiY3ViZWUuUG9wdXBzLmxheW91dCIsImN1YmVlLlBvcHVwcy5kb1BvaW50ZXJFdmVudENsaW1iaW5nVXAiLCJjdWJlZS5DdWJlZVBhbmVsIiwiY3ViZWUuQ3ViZWVQYW5lbC5jb25zdHJ1Y3RvciIsImN1YmVlLkN1YmVlUGFuZWwuY2hlY2tCb3VuZHMiLCJjdWJlZS5DdWJlZVBhbmVsLnJlcXVlc3RMYXlvdXQiLCJjdWJlZS5DdWJlZVBhbmVsLmxheW91dCIsImN1YmVlLkN1YmVlUGFuZWwucm9vdENvbXBvbmVudCIsImN1YmVlLkN1YmVlUGFuZWwuX2RvUG9pbnRlckV2ZW50Q2xpbWJpbmdVcCIsImN1YmVlLkN1YmVlUGFuZWwuQ2xpZW50V2lkdGgiLCJjdWJlZS5DdWJlZVBhbmVsLmNsaWVudFdpZHRoIiwiY3ViZWUuQ3ViZWVQYW5lbC5DbGllbnRIZWlnaHQiLCJjdWJlZS5DdWJlZVBhbmVsLmNsaWVudEhlaWdodCIsImN1YmVlLkN1YmVlUGFuZWwuQm91bmRzV2lkdGgiLCJjdWJlZS5DdWJlZVBhbmVsLmJvdW5kc1dpZHRoIiwiY3ViZWUuQ3ViZWVQYW5lbC5Cb3VuZHNIZWlnaHQiLCJjdWJlZS5DdWJlZVBhbmVsLmJvdW5kc0hlaWdodCIsImN1YmVlLkN1YmVlUGFuZWwuQm91bmRzTGVmdCIsImN1YmVlLkN1YmVlUGFuZWwuYm91bmRzTGVmdCIsImN1YmVlLkN1YmVlUGFuZWwuQm91bmRzVG9wIiwiY3ViZWUuQ3ViZWVQYW5lbC5ib3VuZHNUb3AiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsSUFBTyxLQUFLLENBbVJYO0FBblJELFdBQU8sS0FBSyxFQUFDLENBQUM7SUFFVkE7UUFDSUMsbUJBQW1CQSxNQUFjQTtZQUFkQyxXQUFNQSxHQUFOQSxNQUFNQSxDQUFRQTtRQUFHQSxDQUFDQTtRQUN6Q0QsZ0JBQUNBO0lBQURBLENBQUNBLEFBRkRELElBRUNBO0lBRllBLGVBQVNBLFlBRXJCQSxDQUFBQTtJQUVEQTtRQUFBRztZQUVZQyxjQUFTQSxHQUF3QkEsRUFBRUEsQ0FBQ0E7UUFvQ2hEQSxDQUFDQTtRQWxDVUQscUJBQUtBLEdBQVpBO1FBQ0FFLENBQUNBO1FBRURGLDJCQUFXQSxHQUFYQSxVQUFZQSxRQUEyQkE7WUFDbkNHLEVBQUVBLENBQUNBLENBQUNBLFFBQVFBLElBQUlBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO2dCQUNuQkEsTUFBTUEseUNBQXlDQSxDQUFDQTtZQUNwREEsQ0FBQ0E7WUFFREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzdCQSxNQUFNQSxDQUFDQTtZQUNYQSxDQUFDQTtZQUVEQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtRQUNsQ0EsQ0FBQ0E7UUFFREgsOEJBQWNBLEdBQWRBLFVBQWVBLFFBQTJCQTtZQUN0Q0ksSUFBSUEsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7WUFDM0NBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNWQSxNQUFNQSxDQUFDQTtZ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QUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtnQkFDOUNBLElBQUlBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUMvQkEsSUFBSUEsRUFBRUEsR0FBZ0JBLEtBQUtBLENBQUNBO2dCQUM1QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsSUFBSUEsSUFBSUEsQ0FBQ0EsVUFBVUEsR0FBR0EsRUFBRUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3ZDQSxRQUFRQSxHQUFHQSxLQUFLQSxDQUFDQTtnQkFDckJBLENBQUNBO2dCQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDSkEsU0FBU0EsR0FBR0EsS0FBS0EsQ0FBQ0E7b0JBQ2xCQSxLQUFLQSxDQUFDQTtnQkFDVkEsQ0FBQ0E7Z0JBRURBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLEdBQUdBLEVBQUVBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLFlBQVlBLElBQUlBLElBQUlBLENBQUNBLFVBQVVBLEdBQUdBLEVBQUVBLENBQUNBLElBQUlBLElBQUlBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO29CQUN4RkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsdUJBQXVCQSxJQUFJQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDckNBLEVBQUVBLENBQUNBLHVCQUF1QkEsRUFBRUEsQ0FBQ0E7b0JBQ2pDQSxDQUFDQTtnQkFDTEEsQ0FBQ0E7WUFDTEEsQ0FBQ0E7WUFFREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsUUFBUUEsSUFBSUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ25CQSxFQUFFQSxDQUFDQSxDQUFDQSxTQUFTQSxJQUFJQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtv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QSxLQUFLQSxDQUFDQTtZQUMvQkEsS0FBS0EsR0FBR0EsS0FBS0EsR0FBR0EsQ0FBQ0EsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDNUJBLEtBQUtBLEdBQUdBLEtBQUtBLEdBQUdBLEdBQUdBLENBQUNBO1lBQ3BCQSxJQUFJQSxRQUFRQSxHQUFHQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQTtZQUU3QkEsSUFBSUEsT0FBT0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxLQUFLQSxHQUFHQSxHQUFHQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQTtZQUN6REEsSUFBSUEsT0FBT0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxLQUFLQSxHQUFHQSxHQUFHQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQTtZQUV6REEsSUFBSUEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsUUFBUUEsRUFBRUEsQ0FBQ0E7WUFDdkNBLElBQUlBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBLFFBQVFBLEVBQUVBLENBQUNBO1lBRXZDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxLQUFLQSxDQUFDQSxlQUFlQSxHQUFHQSxPQUFPQSxHQUFHQSxHQUFHQSxHQUFHQSxPQUFPQSxDQUFDQTtZQUM5REEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsU0FBU0EsR0FBR0EsWUFBWUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsS0FBS0EsR0FBR0EsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsS0FBS0E7a0JBQ3JHQSxhQUFhQSxHQUFHQSxRQUFRQSxHQUFHQSxZQUFZQSxHQUFHQSxFQUFFQSxHQUFHQSxXQUFXQSxHQUFHQSxFQUFFQSxHQUFHQSxHQUFHQSxDQUFDQTtZQUN4RUEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsS0FBS0EsQ0FBQ0Es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QUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUM1QkEsSUFBSUEsRUFBRUEsR0FBR0EsSUFBSUEsYUFBT0EsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7WUFDN0JBLElBQUlBLEVBQUVBLEdBQUdBLElBQUlBLGFBQU9BLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO1lBRTVCQSxJQUFJQSxFQUFFQSxHQUFHQSxDQUFDQSxFQUFFQSxHQUFHQSxHQUFHQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUN4QkEsSUFBSUEsRUFBRUEsR0FBR0EsQ0FBQ0EsRUFBRUEsR0FBR0EsR0FBR0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFFeEJBLElBQUlBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBO1lBQzdCQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDYkEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3pDQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDMUNBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO2dCQUMzQ0EsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDOUNBLENBQUNBO1lBRURBLElBQUlBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBO1lBQzVCQSxJQUFJQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUU1QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsR0FBR0EsSUFBSUEsRUFBRUEsSUFBSUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3pCQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQTtnQkFDakRBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO2dCQUNqREEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ2pEQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQTtZQUNyREEsQ0FBQ0E7WUFFREEsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDaEVBLElBQUlBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2hFQSxJQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNoRUEsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDaEVBLEVBQUVBLEdBQUdBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBO1lBQ2pCQSxFQUFFQSxHQUFHQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQTtZQUNqQkEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0E7WUFDVkEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0E7WUFFVkEsSUFBSUEsQ0FBQ0Es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R0EsRUFBRUEsQ0FBQ0E7WUFDWkEsQ0FBQ0E7WUFDREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsSUFBSUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzVCQSxFQUFFQSxHQUFHQSxDQUFDQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxpQkFBaUJBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO2dCQUNoRkEsRUFBRUEsR0FBR0EsQ0FBQ0EsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDdEZBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBO2dCQUNSQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUNaQSxDQUFDQTtZQUdEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxJQUFJQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDckJBLElBQUlBLEdBQUdBLEdBQUdBLENBQUNBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3pEQSxJQUFJQSxHQUFHQSxHQUFHQSxDQUFDQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO2dCQUN6REEsSUFBSUEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsR0FBR0EsR0FBR0EsRUFBRUEsRUFBRUEsR0FBR0EsR0FBR0EsRUFBRUEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ2pFQSxJQUFJQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxHQUFHQSxHQUFHQSxFQUFFQSxFQUFFQSxHQUFHQSxHQUFHQSxFQUFFQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtnQkFDakVBLElBQUlBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLEdBQUdBLEdBQUdBLEVBQUVBLEVBQUVBLEdBQUdBLEdBQUdBLEVBQUVBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO2dCQUNqRUEsSUFBSUEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsR0FBR0EsR0FBR0EsRUFBRUEsRUFBRUEsR0FBR0EsR0FBR0EsRUFBRUEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ2pFQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQTtnQkFDaEJBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBO2dCQUNoQkEsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0E7Z0JBQ2hCQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQTtnQkFDaEJBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBO2dCQUNoQkEsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0E7Z0JBQ2hCQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQTtnQkFDaEJBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBO1lBQ3BCQSxDQUFDQTtZQUVEQSxJQUFJQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNaQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxxQkFBcUJBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNuREEsR0FBR0EsRUFBRUEsQ0FBQ0E7WUFDVkEsQ0FBQ0E7WUFDREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EscUJBQXFCQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDbkRBLEdBQUdBLEVBQUVBLENBQUNBO1lBQ1ZBLENBQUNBO1lBQ0RBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ25EQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUNWQSxDQUFDQTtZQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxxQkFBcUJBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNuREEsR0FB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QUFLQTtnQkFDbEJjLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBO1lBQ3BDQSxDQUFDQTs7O1dBSEFkO1FBS0RBLHNCQUFJQSxrQ0FBVUE7aUJBQWRBO2dCQUNJZSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxVQUFVQSxDQUFDQTtZQUN6Q0EsQ0FBQ0E7OztXQUFBZjtRQUNEQSxzQkFBSUEsa0NBQVVBO2lCQUFkQTtnQkFDSWdCLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLEtBQUtBLENBQUNBO1lBQ2pDQSxDQUFDQTtpQkFDRGhCLFVBQWVBLEtBQUtBO2dCQUNoQmdCLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBO1lBQ2xDQSxDQUFDQTs7O1dBSEFoQjtRQUtEQSxzQkFBSUEsaUNBQVNBO2lCQUFiQTtnQkFDSWlCLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLFNBQVNBLENBQUNBO1lBQ3hDQSxDQUFDQTs7O1dBQUFqQjtRQUNEQSxzQkFBSUEsaUNBQVNBO2lCQUFiQTtnQkFDSWtCLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLEtBQUtBLENBQUNBO1lBQ2hDQSxDQUFDQTtpQkFDRGxCLFVBQWNBLEtBQUtBO2dCQUNma0IsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0E7WUFDakNBLENBQUNBOzs7V0FIQWxCO1FBS0xBLGlCQUFDQTtJQUFEQSxDQUFDQSxBQTFLRHRXLElBMEtDQTtJQTFLWUEsZ0JBQVVBLGFBMEt0QkEsQ0FBQUE7QUFFTEEsQ0FBQ0EsRUE5S00sS0FBSyxLQUFMLEtBQUssUUE4S1giLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUgY3ViZWUge1xuICAgIFxuICAgIGV4cG9ydCBjbGFzcyBFdmVudEFyZ3Mge1xuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc2VuZGVyOiBPYmplY3QpIHt9XG4gICAgfVxuICAgIFxuICAgIGV4cG9ydCBjbGFzcyBFdmVudDxUPiB7XG4gICAgICAgIFxuICAgICAgICBwcml2YXRlIGxpc3RlbmVyczogSUV2ZW50TGlzdGVuZXI8VD5bXSA9IFtdO1xuXG4gICAgICAgIHB1YmxpYyBFdmVudCgpIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZExpc3RlbmVyKGxpc3RlbmVyOiBJRXZlbnRMaXN0ZW5lcjxUPikge1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVyID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoZSBsaXN0ZW5lciBwYXJhbWV0ZXIgY2FuIG5vdCBiZSBudWxsLlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNMaXN0ZW5lcihsaXN0ZW5lcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlTGlzdGVuZXIobGlzdGVuZXI6IElFdmVudExpc3RlbmVyPFQ+KSB7XG4gICAgICAgICAgICB2YXIgaWR4ID0gdGhpcy5saXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcik7XG4gICAgICAgICAgICBpZiAoaWR4IDwgMCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzLnNwbGljZShpZHgsIDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgaGFzTGlzdGVuZXIobGlzdGVuZXI6IElFdmVudExpc3RlbmVyPFQ+KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5saXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcikgPiAtMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpcmVFdmVudChhcmdzOiBUKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBsIGluIHRoaXMubGlzdGVuZXJzKSB7XG4gICAgICAgICAgICAgICAgbGV0IGxpc3RlbmVyOiBJRXZlbnRMaXN0ZW5lcjxUPiA9IGw7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXIoYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfVxuICAgIFxuICAgIGV4cG9ydCBjbGFzcyBUaW1lciB7XG4gICAgICAgIFxuICAgICAgICBwcml2YXRlIHRva2VuOiBudW1iZXI7XG4gICAgICAgIHByaXZhdGUgcmVwZWF0OiBib29sZWFuID0gdHJ1ZTtcbiAgICAgICAgcHJpdmF0ZSBhY3Rpb246IHsoKTogdm9pZH0gPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZ1bmMoKTtcbiAgICAgICAgICAgIGlmICghdGhpcy5yZXBlYXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRva2VuID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0cnVjdG9yIChwcml2YXRlIGZ1bmM6IHsoKTogdm9pZH0pIHtcbiAgICAgICAgICAgIGlmIChmdW5jID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoZSBmdW5jIHBhcmFtZXRlciBjYW4gbm90IGJlIG51bGwuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHN0YXJ0KGRlbGF5OiBudW1iZXIsIHJlcGVhdDogYm9vbGVhbikge1xuICAgICAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgICAgICB0aGlzLnJlcGVhdCA9IHJlcGVhdDtcbiAgICAgICAgICAgIGlmICh0aGlzLnJlcGVhdCkge1xuICAgICAgICAgICAgICAgIHRoaXMudG9rZW4gPSBzZXRJbnRlcnZhbCh0aGlzLmZ1bmMsIGRlbGF5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b2tlbiA9IHNldFRpbWVvdXQodGhpcy5mdW5jLCBkZWxheSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHN0b3AoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy50b2tlbiAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRva2VuKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRva2VuID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgZ2V0IFN0YXJ0ZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b2tlbiAhPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH1cbiAgICBcbiAgICBleHBvcnQgaW50ZXJmYWNlIElFdmVudExpc3RlbmVyPFQ+IHtcbiAgICAgICAgKGFyZ3M6IFQpOiB2b2lkO1xuICAgIH1cbiAgICBcbiAgICBleHBvcnQgY2xhc3MgRXZlbnRRdWV1ZSB7XG4gICAgICAgIFxuICAgICAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogRXZlbnRRdWV1ZSA9IG51bGw7XG5cbiAgICAgICAgc3RhdGljIGdldCBJbnN0YW5jZSgpIHtcbiAgICAgICAgICAgIGlmIChFdmVudFF1ZXVlLmluc3RhbmNlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBFdmVudFF1ZXVlLmluc3RhbmNlID0gbmV3IEV2ZW50UXVldWUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIEV2ZW50UXVldWUuaW5zdGFuY2U7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHByaXZhdGUgcXVldWU6IHsoKTogdm9pZH1bXSA9IFtdO1xuICAgICAgICBwcml2YXRlIHRpbWVyOiBUaW1lciA9IG51bGw7XG5cbiAgICAgICAgcHJpdmF0ZSBFdmVudFF1ZXVlKCkge1xuICAgICAgICAgICAgdGhpcy50aW1lciA9IG5ldyBUaW1lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHNpemUgPSB0aGlzLnF1ZXVlLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwb2xsRmlyc3QoKSBtZXRob2QgaXNuJ3QgcGFydCBvZiB0aGUgR1dUIEFQSVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0YXNrOiB7KCk6IHZvaWR9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhc2sgPSB0aGlzLnF1ZXVlWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucXVldWUuc3BsaWNlKDAsIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YXNrICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFzaygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBDb25zb2xlKCkuZXJyb3IoZXgpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNpemUgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGVyZSB3ZXJlIHNvbWUgdGFzayB0aGFuIHdlIG5lZWQgdG8gY2hlY2sgZmFzdCBpZiBtb3JlIHRhc2tzIGFyZSByZWNlaXZlZFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50aW1lci5zdGFydCgwLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGVyZSBpc24ndCBhbnkgdGFzayB0aGFuIHdlIGNhbiByZWxheCBhIGJpdFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50aW1lci5zdGFydCg1MCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnRpbWVyLnN0YXJ0KDEwLCBmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpbnZva2VMYXRlcih0YXNrOiB7KCk6IHZvaWR9KSB7XG4gICAgICAgICAgICBpZiAodGFzayA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgdGFzayBjYW4gbm90IGJlIG51bGwuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnF1ZXVlLnB1c2godGFzayk7XG4gICAgICAgIH1cblxuICAgICAgICBpbnZva2VQcmlvcih0YXNrOiB7KCk6IHZvaWR9KSB7XG4gICAgICAgICAgICBpZiAodGFzayA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgdGFzayBjYW4gbm90IGJlIG51bGwuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnF1ZXVlLnNwbGljZSgwLCAwLCB0YXNrKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG4gICAgXG4gICAgZXhwb3J0IGNsYXNzIFJ1bk9uY2Uge1xuICAgICAgICBcbiAgICAgICAgcHJpdmF0ZSBzY2hlZHVsZWQgPSBmYWxzZTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZnVuYzogSVJ1bm5hYmxlKSB7XG4gICAgICAgICAgICBpZiAoZnVuYyA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgZnVuYyBwYXJhbWV0ZXIgY2FuIG5vdCBiZSBudWxsLlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBydW4oKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zY2hlZHVsZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEV2ZW50UXVldWUuSW5zdGFuY2UuaW52b2tlTGF0ZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5mdW5jKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBleHBvcnQgY2xhc3MgTW91c2VEcmFnRXZlbnRBcmdzIHtcbiAgICAgICAgY29uc3RydWN0b3IgKFxuICAgICAgICAgICAgICAgIHB1YmxpYyBzY3JlZW5YOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgcHVibGljIHNjcmVlblk6IG51bWJlcixcbiAgICAgICAgICAgICAgICBwdWJsaWMgZGVsdGFYOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgcHVibGljIGRlbHRhWTogbnVtYmVyLFxuICAgICAgICAgICAgICAgIHB1YmxpYyBhbHRQcmVzc2VkOiBib29sZWFuLFxuICAgICAgICAgICAgICAgIHB1YmxpYyBjdHJsUHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgICAgICBwdWJsaWMgc2hpZnRQcmVzc2VkOiBib29sZWFuLFxuICAgICAgICAgICAgICAgIHB1YmxpYyBtZXRhUHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgICAgICBwdWJsaWMgc2VuZGVyOiBPYmplY3QpIHt9XG4gICAgfVxuICAgIFxuICAgIGV4cG9ydCBjbGFzcyBNb3VzZVVwRXZlbnRBcmdzIHtcbiAgICAgICAgY29uc3RydWN0b3IgKFxuICAgICAgICAgICAgICAgIHB1YmxpYyBzY3JlZW5YOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgcHVibGljIHNjcmVlblk6IG51bWJlcixcbiAgICAgICAgICAgICAgICBwdWJsaWMgZGVsdGFYOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgcHVibGljIGRlbHRhWTogbnVtYmVyLFxuICAgICAgICAgICAgICAgIHB1YmxpYyBhbHRQcmVzc2VkOiBib29sZWFuLFxuICAgICAgICAgICAgICAgIHB1YmxpYyBjdHJsUHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgICAgICBwdWJsaWMgc2hpZnRQcmVzc2VkOiBib29sZWFuLFxuICAgICAgICAgICAgICAgIHB1YmxpYyBtZXRhUHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgICAgICBwdWJsaWMgYnV0dG9uOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgcHVibGljIG5hdGl2ZUV2ZW50OiBNb3VzZUV2ZW50LFxuICAgICAgICAgICAgICAgIHB1YmxpYyBzZW5kZXI6IE9iamVjdCkge31cbiAgICB9XG4gICAgXG4gICAgZXhwb3J0IGNsYXNzIE1vdXNlRG93bkV2ZW50QXJncyB7XG4gICAgICAgIGNvbnN0cnVjdG9yIChcbiAgICAgICAgICAgICAgICBwdWJsaWMgc2NyZWVuWDogbnVtYmVyLFxuICAgICAgICAgICAgICAgIHB1YmxpYyBzY3JlZW5ZOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgcHVibGljIGRlbHRhWDogbnVtYmVyLFxuICAgICAgICAgICAgICAgIHB1YmxpYyBkZWx0YVk6IG51bWJlcixcbiAgICAgICAgICAgICAgICBwdWJsaWMgYWx0UHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgICAgICBwdWJsaWMgY3RybFByZXNzZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgcHVibGljIHNoaWZ0UHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgICAgICBwdWJsaWMgbWV0YVByZXNzZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgcHVibGljIGJ1dHRvbjogbnVtYmVyLFxuICAgICAgICAgICAgICAgIHB1YmxpYyBuYXRpdmVFdmVudDogTW91c2VFdmVudCxcbiAgICAgICAgICAgICAgICBwdWJsaWMgc2VuZGVyOiBPYmplY3QpIHt9XG4gICAgfVxuICAgIFxuICAgIGV4cG9ydCBjbGFzcyBNb3VzZU1vdmVFdmVudEFyZ3Mge1xuICAgICAgICBjb25zdHJ1Y3RvciAoXG4gICAgICAgICAgICAgICAgcHVibGljIHNjcmVlblg6IG51bWJlcixcbiAgICAgICAgICAgICAgICBwdWJsaWMgc2NyZWVuWTogbnVtYmVyLFxuICAgICAgICAgICAgICAgIHB1YmxpYyB4OiBudW1iZXIsXG4gICAgICAgICAgICAgICAgcHVibGljIHk6IG51bWJlcixcbiAgICAgICAgICAgICAgICBwdWJsaWMgYWx0UHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgICAgICBwdWJsaWMgY3RybFByZXNzZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgcHVibGljIHNoaWZ0UHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgICAgICBwdWJsaWMgbWV0YVByZXNzZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgcHVibGljIHNlbmRlcjogT2JqZWN0KSB7fVxuICAgIH1cbiAgICBcbiAgICBleHBvcnQgY2xhc3MgTW91c2VXaGVlbEV2ZW50QXJncyB7XG4gICAgICAgIGNvbnN0cnVjdG9yIChcbiAgICAgICAgICAgICAgICBwdWJsaWMgd2hlZWxWZWxvY2l0eTogbnVtYmVyLFxuICAgICAgICAgICAgICAgIHB1YmxpYyBhbHRQcmVzc2VkOiBib29sZWFuLFxuICAgICAgICAgICAgICAgIHB1YmxpYyBjdHJsUHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgICAgICBwdWJsaWMgc2hpZnRQcmVzc2VkOiBib29sZWFuLFxuICAgICAgICAgICAgICAgIHB1YmxpYyBtZXRhUHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgICAgICBwdWJsaWMgc2VuZGVyOiBPYmplY3QpIHt9XG4gICAgfVxuICAgIFxuICAgIGV4cG9ydCBjbGFzcyBDbGlja0V2ZW50QXJncyB7XG4gICAgICAgIGNvbnN0cnVjdG9yIChcbiAgICAgICAgICAgICAgICBwdWJsaWMgc2NyZWVuWDogbnVtYmVyLFxuICAgICAgICAgICAgICAgIHB1YmxpYyBzY3JlZW5ZOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgcHVibGljIGRlbHRhWDogbnVtYmVyLFxuICAgICAgICAgICAgICAgIHB1YmxpYyBkZWx0YVk6IG51bWJlcixcbiAgICAgICAgICAgICAgICBwdWJsaWMgYWx0UHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgICAgICBwdWJsaWMgY3RybFByZXNzZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgcHVibGljIHNoaWZ0UHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgICAgICBwdWJsaWMgbWV0YVByZXNzZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgcHVibGljIGJ1dHRvbjogbnVtYmVyLFxuICAgICAgICAgICAgICAgIHB1YmxpYyBzZW5kZXI6IE9iamVjdCkge31cbiAgICB9XG4gICAgXG4gICAgZXhwb3J0IGNsYXNzIEtleUV2ZW50QXJncyB7XG4gICAgICAgIGNvbnN0cnVjdG9yIChcbiAgICAgICAgICAgICAgICBwdWJsaWMga2V5Q29kZTogbnVtYmVyLFxuICAgICAgICAgICAgICAgIHB1YmxpYyBhbHRQcmVzc2VkOiBib29sZWFuLFxuICAgICAgICAgICAgICAgIHB1YmxpYyBjdHJsUHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgICAgICBwdWJsaWMgc2hpZnRQcmVzc2VkOiBib29sZWFuLFxuICAgICAgICAgICAgICAgIHB1YmxpYyBtZXRhUHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgICAgICAgICBwdWJsaWMgc2VuZGVyOiBPYmplY3QsXG4gICAgICAgICAgICAgICAgcHVibGljIG5hdGl2ZUV2ZW50OiBLZXlib2FyZEV2ZW50XG4gICAgICAgICAgICApIHt9XG4gICAgfVxuICAgIFxuICAgIGV4cG9ydCBjbGFzcyBQYXJlbnRDaGFuZ2VkRXZlbnRBcmdzIGV4dGVuZHMgRXZlbnRBcmdzIHtcbiAgICAgICAgY29uc3RydWN0b3IgKHB1YmxpYyBuZXdQYXJlbnQ6IEFMYXlvdXQsXG4gICAgICAgICAgICAgICAgcHVibGljIHNlbmRlcjogT2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHN1cGVyKHNlbmRlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBleHBvcnQgY2xhc3MgQ29udGV4dE1lbnVFdmVudEFyZ3Mge1xuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmF0aXZlRXZlbnQ6IFVJRXZlbnQsXG4gICAgICAgICAgICAgICAgcHVibGljIHNlbmRlcjogT2JqZWN0KSB7fVxuICAgIH1cbiAgICBcbn1cblxuXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiZXZlbnRzLnRzXCIvPlxuXG5tb2R1bGUgY3ViZWUge1xuXG4gICAgZXhwb3J0IGludGVyZmFjZSBJQ2hhbmdlTGlzdGVuZXIge1xuICAgICAgICAoc2VuZGVyPzogT2JqZWN0KTogdm9pZDtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIElPYnNlcnZhYmxlIHtcbiAgICAgICAgYWRkQ2hhbmdlTGlzdGVuZXIobGlzdGVuZXI6IElDaGFuZ2VMaXN0ZW5lcik6IHZvaWQ7XG4gICAgICAgIHJlbW92ZUNoYW5nZUxpc3RlbmVyKGxpc3RlbmVyOiBJQ2hhbmdlTGlzdGVuZXIpOiB2b2lkO1xuICAgICAgICBoYXNDaGFuZ2VMaXN0ZW5lcihsaXN0ZW5lcjogSUNoYW5nZUxpc3RlbmVyKTogdm9pZDtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIElCaW5kYWJsZTxUPiB7XG4gICAgICAgIGJpbmQoc291cmNlOiBUKTogdm9pZDtcbiAgICAgICAgdW5iaW5kKCk6IHZvaWQ7XG4gICAgICAgIGlzQm91bmQoKTogYm9vbGVhbjtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIElBbmltYXRlYWJsZTxUPiB7XG4gICAgICAgIGFuaW1hdGUocG9zOiBudW1iZXIsIHN0YXJ0VmFsdWU6IFQsIGVuZFZhbHVlOiBUKTogVDtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIElQcm9wZXJ0eTxUPiBleHRlbmRzIElPYnNlcnZhYmxlIHtcbiAgICAgICAgZ2V0T2JqZWN0VmFsdWUoKTogT2JqZWN0O1xuICAgICAgICBpbnZhbGlkYXRlKCk6IHZvaWQ7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBJVmFsaWRhdG9yPFQ+IHtcbiAgICAgICAgdmFsaWRhdGUodmFsdWU6IFQpOiBUO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBQcm9wZXJ0eTxUPiBpbXBsZW1lbnRzIElQcm9wZXJ0eTxUPiwgSUFuaW1hdGVhYmxlPFQ+LCBJQmluZGFibGU8SVByb3BlcnR5PFQ+PiB7XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX25leHRJZCA9IDA7XG5cbiAgICAgICAgcHJpdmF0ZSBfY2hhbmdlTGlzdGVuZXJzOiBJQ2hhbmdlTGlzdGVuZXJbXSA9IFtdO1xuXG4gICAgICAgIHByaXZhdGUgX3ZhbGlkOiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHByaXZhdGUgX2JpbmRpbmdTb3VyY2U6IElQcm9wZXJ0eTxUPjtcblxuICAgICAgICBwcml2YXRlIF9yZWFkb25seUJpbmQ6IElQcm9wZXJ0eTxUPjtcbiAgICAgICAgcHJpdmF0ZSBfYmlkaXJlY3Rpb25hbEJpbmRQcm9wZXJ0eTogUHJvcGVydHk8VD47XG4gICAgICAgIHByaXZhdGUgX2JpZGlyZWN0aW9uYWxDaGFuZ2VMaXN0ZW5lclRoaXM6IElDaGFuZ2VMaXN0ZW5lcjtcbiAgICAgICAgcHJpdmF0ZSBfYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyT3RoZXI6IElDaGFuZ2VMaXN0ZW5lcjtcbiAgICAgICAgcHJpdmF0ZSBfaWQ6IHN0cmluZyA9IFwicFwiICsgUHJvcGVydHkuX25leHRJZCsrO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICAgICAgcHJpdmF0ZSBfdmFsdWU/OiBULFxuICAgICAgICAgICAgcHJpdmF0ZSBfbnVsbGFibGU6IGJvb2xlYW4gPSB0cnVlLFxuICAgICAgICAgICAgcHJpdmF0ZSBfcmVhZG9ubHk6IGJvb2xlYW4gPSBmYWxzZSxcbiAgICAgICAgICAgIHByaXZhdGUgX3ZhbGlkYXRvcjogSVZhbGlkYXRvcjxUPiA9IG51bGwpIHtcblxuICAgICAgICAgICAgaWYgKF92YWx1ZSA9PSBudWxsICYmIF9udWxsYWJsZSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiQSBudWxsYWJsZSBwcm9wZXJ0eSBjYW4gbm90IGJlIG51bGwuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl92YWx1ZSAhPSBudWxsICYmIF92YWxpZGF0b3IgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gX3ZhbGlkYXRvci52YWxpZGF0ZShfdmFsdWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmludmFsaWRhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBpZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB2YWxpZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92YWxpZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB2YWx1ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldCB2YWx1ZShuZXdWYWx1ZTogVCkge1xuICAgICAgICAgICAgdGhpcy5zZXQobmV3VmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IG51bGxhYmxlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX251bGxhYmxlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHJlYWRvbmx5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlYWRvbmx5O1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBiaW5kTGlzdGVuZXIoKSB7XG4gICAgICAgICAgICB0aGlzLmludmFsaWRhdGVJZk5lZWRlZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdFJlYWRvbmx5QmluZChyZWFkb25seUJpbmQ6IElQcm9wZXJ0eTxUPikge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3JlYWRvbmx5QmluZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgcmVhZG9ubHkgYmluZCBpcyBhbHJlYWR5IGluaXRpYWxpemVkLlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fcmVhZG9ubHlCaW5kID0gcmVhZG9ubHlCaW5kO1xuICAgICAgICAgICAgaWYgKHJlYWRvbmx5QmluZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmVhZG9ubHlCaW5kLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuYmluZExpc3RlbmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBnZXQoKTogVCB7XG4gICAgICAgICAgICB0aGlzLl92YWxpZCA9IHRydWU7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9iaW5kaW5nU291cmNlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdmFsaWRhdG9yICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbGlkYXRvci52YWxpZGF0ZSg8VD50aGlzLl9iaW5kaW5nU291cmNlLmdldE9iamVjdFZhbHVlKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gPFQ+dGhpcy5fYmluZGluZ1NvdXJjZS5nZXRPYmplY3RWYWx1ZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fcmVhZG9ubHlCaW5kICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdmFsaWRhdG9yICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbGlkYXRvci52YWxpZGF0ZSg8VD50aGlzLl9yZWFkb25seUJpbmQuZ2V0T2JqZWN0VmFsdWUoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiA8VD50aGlzLl9yZWFkb25seUJpbmQuZ2V0T2JqZWN0VmFsdWUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzZXQobmV3VmFsdWU6IFQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9yZWFkb25seSkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiQ2FuIG5vdCBjaGFuZ2UgdGhlIHZhbHVlIG9mIGEgcmVhZG9ubHkgcHJvcGVydHkuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzQm91bmQoKSkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiQ2FuIG5vdCBjaGFuZ2UgdGhlIHZhbHVlIG9mIGEgYm91bmQgcHJvcGVydHkuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5fbnVsbGFibGUgJiYgbmV3VmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiQ2FuIG5vdCBzZXQgdGhlIHZhbHVlIHRvIG51bGwgb2YgYSBub24gbnVsbGFibGUgcHJvcGVydHkuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl92YWxpZGF0b3IgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy5fdmFsaWRhdG9yLnZhbGlkYXRlKG5ld1ZhbHVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX3ZhbHVlID09IG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fdmFsdWUgIT0gbnVsbCAmJiB0aGlzLl92YWx1ZSA9PSBuZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbnZhbGlkYXRlKCkge1xuICAgICAgICAgICAgdGhpcy5fdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuZmlyZUNoYW5nZUxpc3RlbmVycygpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW52YWxpZGF0ZUlmTmVlZGVkKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl92YWxpZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZmlyZUNoYW5nZUxpc3RlbmVycygpIHtcbiAgICAgICAgICAgIHRoaXMuX2NoYW5nZUxpc3RlbmVycy5mb3JFYWNoKChsaXN0ZW5lcikgPT4ge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyKHRoaXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRPYmplY3RWYWx1ZSgpOiBPYmplY3Qge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRDaGFuZ2VMaXN0ZW5lcihsaXN0ZW5lcjogSUNoYW5nZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICBpZiAobGlzdGVuZXIgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIGxpc3RlbmVyIHBhcmFtZXRlciBjYW4gbm90IGJlIG51bGwuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmhhc0NoYW5nZUxpc3RlbmVyKGxpc3RlbmVyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fY2hhbmdlTGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuXG4gICAgICAgICAgICAvLyB2YWxpZGF0ZSB0aGUgY29tcG9uZW50XG4gICAgICAgICAgICB0aGlzLmdldCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIobGlzdGVuZXI6IElDaGFuZ2VMaXN0ZW5lcikge1xuICAgICAgICAgICAgdmFyIGlkeCA9IHRoaXMuX2NoYW5nZUxpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKTtcbiAgICAgICAgICAgIGlmIChpZHggPCAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fY2hhbmdlTGlzdGVuZXJzLnNwbGljZShpZHgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaGFzQ2hhbmdlTGlzdGVuZXIobGlzdGVuZXI6IElDaGFuZ2VMaXN0ZW5lcik6IGJvb2xlYW4ge1xuICAgICAgICAgICAgdGhpcy5fY2hhbmdlTGlzdGVuZXJzLmZvckVhY2goKGwpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobCA9PSBsaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFuaW1hdGUocG9zOiBudW1iZXIsIHN0YXJ0VmFsdWU6IFQsIGVuZFZhbHVlOiBUKSB7XG4gICAgICAgICAgICBpZiAocG9zIDwgMC41KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXJ0VmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBlbmRWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJpbmQoc291cmNlOiBJUHJvcGVydHk8VD4pIHtcbiAgICAgICAgICAgIGlmIChzb3VyY2UgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhlIHNvdXJjZSBjYW4gbm90IGJlIG51bGwuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzQm91bmQoKSkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhpcyBwcm9wZXJ0eSBpcyBhbHJlYWR5IGJvdW5kLlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fcmVhZG9ubHkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIkNhbid0IGJpbmQgYSByZWFkb25seSBwcm9wZXJ0eS5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fYmluZGluZ1NvdXJjZSA9IHNvdXJjZTtcbiAgICAgICAgICAgIHRoaXMuX2JpbmRpbmdTb3VyY2UuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5iaW5kTGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBiaWRpcmVjdGlvbmFsQmluZChvdGhlcjogUHJvcGVydHk8VD4pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzQm91bmQoKSkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhpcyBwcm9wZXJ0eSBpcyBhbHJlYWR5IGJvdW5kLlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fcmVhZG9ubHkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIkNhbid0IGJpbmQgYSByZWFkb25seSBwcm9wZXJ0eS5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG90aGVyID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoZSBvdGhlciBwYXJhbWV0ZXIgY2FuIG5vdCBiZSBudWxsLlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3RoZXIuX3JlYWRvbmx5KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJDYW4gbm90IGJpbmQgYSBwcm9wZXJ0eSBiaWRpcmVjdGlvbmFsbHkgdG8gYSByZWFkb25seSBwcm9wZXJ0eS5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG90aGVyID09IHRoaXMpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIkNhbiBub3QgYmluZCBhIHByb3BlcnR5IGJpZGlyZWN0aW9uYWxseSBmb3IgdGhlbXNlbGYuXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvdGhlci5pc0JvdW5kKCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlRoZSB0YXJnZXQgcHJvcGVydHkgaXMgYWxyZWFkeSBib3VuZC5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fYmlkaXJlY3Rpb25hbEJpbmRQcm9wZXJ0eSA9IG90aGVyO1xuICAgICAgICAgICAgdGhpcy5fYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyT3RoZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXQodGhpcy5fYmlkaXJlY3Rpb25hbEJpbmRQcm9wZXJ0eS5nZXQoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvdGhlci5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9iaWRpcmVjdGlvbmFsQ2hhbmdlTGlzdGVuZXJPdGhlcik7XG4gICAgICAgICAgICB0aGlzLl9iaWRpcmVjdGlvbmFsQ2hhbmdlTGlzdGVuZXJUaGlzID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX2JpZGlyZWN0aW9uYWxCaW5kUHJvcGVydHkuc2V0KHRoaXMuZ2V0KCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9iaWRpcmVjdGlvbmFsQ2hhbmdlTGlzdGVuZXJUaGlzKTtcblxuICAgICAgICAgICAgb3RoZXIuX2JpZGlyZWN0aW9uYWxCaW5kUHJvcGVydHkgPSB0aGlzO1xuICAgICAgICAgICAgb3RoZXIuX2JpZGlyZWN0aW9uYWxDaGFuZ2VMaXN0ZW5lck90aGVyID0gdGhpcy5fYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyVGhpcztcbiAgICAgICAgICAgIG90aGVyLl9iaWRpcmVjdGlvbmFsQ2hhbmdlTGlzdGVuZXJUaGlzID0gdGhpcy5fYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyT3RoZXI7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHVuYmluZCgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9iaW5kaW5nU291cmNlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9iaW5kaW5nU291cmNlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuYmluZExpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9iaW5kaW5nU291cmNlID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0JpZGlyZWN0aW9uYWxCb3VuZCgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9iaWRpcmVjdGlvbmFsQ2hhbmdlTGlzdGVuZXJUaGlzKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9iaWRpcmVjdGlvbmFsQmluZFByb3BlcnR5LnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX2JpZGlyZWN0aW9uYWxDaGFuZ2VMaXN0ZW5lck90aGVyKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9iaWRpcmVjdGlvbmFsQmluZFByb3BlcnR5Ll9iaWRpcmVjdGlvbmFsQmluZFByb3BlcnR5ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLl9iaWRpcmVjdGlvbmFsQmluZFByb3BlcnR5Ll9iaWRpcmVjdGlvbmFsQ2hhbmdlTGlzdGVuZXJPdGhlciA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmlkaXJlY3Rpb25hbEJpbmRQcm9wZXJ0eS5fYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyVGhpcyA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmlkaXJlY3Rpb25hbEJpbmRQcm9wZXJ0eSA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmlkaXJlY3Rpb25hbENoYW5nZUxpc3RlbmVyT3RoZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuX2JpZGlyZWN0aW9uYWxDaGFuZ2VMaXN0ZW5lclRoaXMgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdW5iaW5kVGFyZ2V0cygpIHtcbiAgICAgICAgICAgIC8vIFRPRE8gbnVsbCBiaW5kaW5nU291cmNlIG9mIHRhcmdldHNcbiAgICAgICAgICAgIHRoaXMuX2NoYW5nZUxpc3RlbmVycyA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgaXNCb3VuZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9iaW5kaW5nU291cmNlICE9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpc0JpZGlyZWN0aW9uYWxCb3VuZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9iaWRpcmVjdGlvbmFsQmluZFByb3BlcnR5ICE9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBjcmVhdGVQcm9wZXJ0eUxpbmUoa2V5RnJhbWVzOiBLZXlGcmFtZTxUPltdKTogUHJvcGVydHlMaW5lPFQ+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvcGVydHlMaW5lPFQ+KGtleUZyYW1lcyk7XG4gICAgICAgIH1cblxuICAgICAgICBkZXN0cm95KCkge1xuICAgICAgICAgICAgdGhpcy51bmJpbmQoKTtcbiAgICAgICAgICAgIHRoaXMuX2NoYW5nZUxpc3RlbmVycyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5iaW5kTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRXhwcmVzc2lvbjxUPiBpbXBsZW1lbnRzIElQcm9wZXJ0eTxUPiwgSU9ic2VydmFibGUge1xuXG4gICAgICAgIHByaXZhdGUgX25vdGlmeUxpc3RlbmVyc09uY2UgPSBuZXcgUnVuT25jZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZpcmVDaGFuZ2VMaXN0ZW5lcnMoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcHJpdmF0ZSBfYmluZGluZ1NvdXJjZXM6IElQcm9wZXJ0eTxhbnk+W10gPSBbXTtcbiAgICAgICAgcHJpdmF0ZSBfYmluZGluZ0xpc3RlbmVyOiBJQ2hhbmdlTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmludmFsaWRhdGVJZk5lZWRlZCgpO1xuICAgICAgICB9O1xuICAgICAgICBwcml2YXRlIF9jaGFuZ2VMaXN0ZW5lcnM6IElDaGFuZ2VMaXN0ZW5lcltdID0gW107XG5cbiAgICAgICAgcHJpdmF0ZSBfZnVuYzogeyAoKTogVCB9O1xuICAgICAgICBwcml2YXRlIF92YWxpZCA9IGZhbHNlO1xuICAgICAgICBwcml2YXRlIF92YWx1ZTogVCA9IG51bGw7XG5cbiAgICAgICAgY29uc3RydWN0b3IoZnVuYzogeyAoKTogVCB9LCAuLi5hY3RpdmF0b3JzOiBJUHJvcGVydHk8YW55PltdKSB7XG4gICAgICAgICAgICBpZiAoZnVuYyA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgJ2Z1bmMnIHBhcmFtZXRlciBjYW4gbm90IGJlIG51bGxcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2Z1bmMgPSBmdW5jO1xuICAgICAgICAgICAgdGhpcy5iaW5kLmFwcGx5KHRoaXMsIGFjdGl2YXRvcnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHZhbHVlKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl92YWxpZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gdGhpcy5fZnVuYygpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3ZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkQ2hhbmdlTGlzdGVuZXIobGlzdGVuZXI6IElDaGFuZ2VMaXN0ZW5lcikge1xuICAgICAgICBpZiAobGlzdGVuZXIgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgXCJUaGUgbGlzdGVuZXIgcGFyYW1ldGVyIGNhbiBub3QgYmUgbnVsbC5cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmhhc0NoYW5nZUxpc3RlbmVyKGxpc3RlbmVyKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fY2hhbmdlTGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuXG4gICAgICAgIGxldCB4ID0gdGhpcy52YWx1ZTtcbiAgICB9XG5cbiAgICByZW1vdmVDaGFuZ2VMaXN0ZW5lcihsaXN0ZW5lcjogSUNoYW5nZUxpc3RlbmVyKSB7XG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuX2NoYW5nZUxpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKTtcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuX2NoYW5nZUxpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2NoYW5nZUxpc3RlbmVycy5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICB0aGlzLl9iaW5kaW5nU291cmNlcy5mb3JFYWNoKChwcm9wKSA9PiB7XG4gICAgICAgICAgICAgICAgcHJvcC5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9iaW5kaW5nTGlzdGVuZXIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmludmFsaWRhdGUoKTtcbiAgICB9XG5cbiAgICBoYXNDaGFuZ2VMaXN0ZW5lcihsaXN0ZW5lcjogSUNoYW5nZUxpc3RlbmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jaGFuZ2VMaXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcikgPiAtMTtcbiAgICB9XG5cbiAgICBnZXRPYmplY3RWYWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gICAgfVxuXG4gICAgYmluZCguLi5wcm9wZXJ0aWVzOiBJUHJvcGVydHk8YW55PltdKSB7XG4gICAgICAgIHByb3BlcnRpZXMuZm9yRWFjaCgocHJvcCkgPT4ge1xuICAgICAgICAgICAgcHJvcC5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9iaW5kaW5nTGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy5fYmluZGluZ1NvdXJjZXMucHVzaChwcm9wKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgfVxuXG4gICAgdW5iaW5kQWxsKCkge1xuICAgICAgICB0aGlzLl9iaW5kaW5nU291cmNlcy5mb3JFYWNoKChwcm9wKSA9PiB7XG4gICAgICAgICAgICBwcm9wLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX2JpbmRpbmdMaXN0ZW5lcik7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9iaW5kaW5nU291cmNlcyA9IFtdO1xuICAgICAgICB0aGlzLmludmFsaWRhdGUoKTtcbiAgICB9XG5cbiAgICB1bmJpbmQocHJvcGVydHk6IElQcm9wZXJ0eTxhbnk+KSB7XG4gICAgICAgIHByb3BlcnR5LnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX2JpbmRpbmdMaXN0ZW5lcik7XG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuX2JpbmRpbmdTb3VyY2VzLmluZGV4T2YocHJvcGVydHkpO1xuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgdGhpcy5fYmluZGluZ1NvdXJjZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmludmFsaWRhdGUoKTtcbiAgICB9XG5cbiAgICBpbnZhbGlkYXRlKCkge1xuICAgICAgICB0aGlzLl92YWxpZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9ub3RpZnlMaXN0ZW5lcnNPbmNlLnJ1bigpO1xuICAgIH1cblxuICAgIGludmFsaWRhdGVJZk5lZWRlZCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl92YWxpZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZmlyZUNoYW5nZUxpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy5fY2hhbmdlTGlzdGVuZXJzLmZvckVhY2goKGxpc3RlbmVyOiBJQ2hhbmdlTGlzdGVuZXIpID0+IHtcbiAgICAgICAgICAgIGxpc3RlbmVyKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn1cblxuZXhwb3J0IGNsYXNzIEtleUZyYW1lPFQ+IHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIF90aW1lOiBudW1iZXIsXG4gICAgICAgIHByaXZhdGUgX3Byb3BlcnR5OiBQcm9wZXJ0eTxUPixcbiAgICAgICAgcHJpdmF0ZSBfZW5kVmFsdWU6IFQsXG4gICAgICAgIHByaXZhdGUgX2tleWZyYW1lUmVhY2hlZExpc3RlbmVyOiB7ICgpOiB2b2lkIH0gPSBudWxsLFxuICAgICAgICBwcml2YXRlIF9pbnRlcnBvbGF0b3I6IElJbnRlcnBvbGF0b3IgPSBJbnRlcnBvbGF0b3JzLkxpbmVhcikge1xuXG4gICAgICAgIGlmIChfdGltZSA8IDApIHtcbiAgICAgICAgICAgIHRocm93IFwiVGhlIHRpbWUgcGFyYW1ldGVyIGNhbiBub3QgYmUgc21hbGxlciB0aGFuIHplcm8uXCI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX3Byb3BlcnR5ID09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IFwiVGhlIHByb3BlcnR5IHBhcmFtZXRlciBjYW4gbm90IGJlIG51bGwuXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF9wcm9wZXJ0eS5yZWFkb25seSkge1xuICAgICAgICAgICAgdGhyb3cgXCJDYW4ndCBhbmltYXRlIGEgcmVhZC1vbmx5IHByb3BlcnR5LlwiO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF9lbmRWYWx1ZSA9PSBudWxsICYmICFfcHJvcGVydHkubnVsbGFibGUpIHtcbiAgICAgICAgICAgIHRocm93IFwiQ2FuJ3Qgc2V0IG51bGwgdmFsdWUgdG8gYSBub24gbnVsbGFibGUgcHJvcGVydHkuXCI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX2ludGVycG9sYXRvciA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLl9pbnRlcnBvbGF0b3IgPSBJbnRlcnBvbGF0b3JzLkxpbmVhcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCB0aW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGltZTtcbiAgICB9XG5cbiAgICBnZXQgcHJvcGVydHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9wZXJ0eVxuICAgIH1cblxuICAgIGdldCBlbmRWYWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VuZFZhbHVlO1xuICAgIH1cblxuICAgIGdldCBpbnRlcnBvbGF0b3IoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnRlcnBvbGF0b3I7XG4gICAgfVxuXG4gICAgZ2V0IGtleUZyYW1lUmVhY2hlZExpc3RlbmVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fa2V5ZnJhbWVSZWFjaGVkTGlzdGVuZXI7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBjbGFzcyBQcm9wZXJ0eUxpbmU8VD4ge1xuXG4gICAgcHJpdmF0ZSBfcHJvcGVydHk6IFByb3BlcnR5PFQ+O1xuICAgIHByaXZhdGUgX3N0YXJ0VGltZTogbnVtYmVyID0gLTE7XG4gICAgcHJpdmF0ZSBfbGFzdFJ1blRpbWU6IG51bWJlciA9IC0xO1xuICAgIHByaXZhdGUgX3ByZXZpb3VzRnJhbWU6IEtleUZyYW1lPFQ+ID0gbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2tleUZyYW1lczogS2V5RnJhbWU8VD5bXSkge1xuICAgICAgICB0aGlzLl9wcm9wZXJ0eSA9IF9rZXlGcmFtZXNbMF0ucHJvcGVydHk7XG4gICAgICAgIHZhciBmaXJzdEZyYW1lOiBLZXlGcmFtZTxUPiA9IF9rZXlGcmFtZXNbMF07XG4gICAgICAgIGlmIChmaXJzdEZyYW1lLnRpbWUgPiAwKSB7XG4gICAgICAgICAgICBfa2V5RnJhbWVzLnNwbGljZSgwLCAwLCBuZXcgS2V5RnJhbWUoMCwgZmlyc3RGcmFtZS5wcm9wZXJ0eSwgZmlyc3RGcmFtZS5wcm9wZXJ0eS52YWx1ZSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IHN0YXJ0VGltZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXJ0VGltZTtcbiAgICB9XG5cbiAgICBzZXQgc3RhcnRUaW1lKHN0YXJ0VGltZTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX3N0YXJ0VGltZSA9IHN0YXJ0VGltZTtcbiAgICB9XG5cbiAgICBhbmltYXRlKCkge1xuICAgICAgICB2YXIgYWN0VGltZSA9IERhdGUubm93KCk7XG5cbiAgICAgICAgaWYgKGFjdFRpbWUgPT0gdGhpcy5fc3RhcnRUaW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbmV4dEZyYW1lOiBLZXlGcmFtZTxUPiA9IG51bGw7XG4gICAgICAgIHZhciBhY3RGcmFtZTogS2V5RnJhbWU8VD4gPSBudWxsO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2tleUZyYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGZyYW1lID0gdGhpcy5fa2V5RnJhbWVzW2ldO1xuICAgICAgICAgICAgdmFyIGZyOiBLZXlGcmFtZTxUPiA9IGZyYW1lO1xuICAgICAgICAgICAgaWYgKGFjdFRpbWUgPj0gdGhpcy5fc3RhcnRUaW1lICsgZnIudGltZSkge1xuICAgICAgICAgICAgICAgIGFjdEZyYW1lID0gZnJhbWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5leHRGcmFtZSA9IGZyYW1lO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fc3RhcnRUaW1lICsgZnIudGltZSA+IHRoaXMuX2xhc3RSdW5UaW1lICYmIHRoaXMuX3N0YXJ0VGltZSArIGZyLnRpbWUgPD0gYWN0VGltZSkge1xuICAgICAgICAgICAgICAgIGlmIChmci5rZXlGcmFtZVJlYWNoZWRMaXN0ZW5lciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGZyLmtleUZyYW1lUmVhY2hlZExpc3RlbmVyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFjdEZyYW1lICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChuZXh0RnJhbWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHZhciBwb3MgPSAoKGFjdFRpbWUgLSB0aGlzLl9zdGFydFRpbWUgLSBhY3RGcmFtZS50aW1lKSkgLyAobmV4dEZyYW1lLnRpbWUgLSBhY3RGcmFtZS50aW1lKTtcbiAgICAgICAgICAgICAgICBhY3RGcmFtZS5wcm9wZXJ0eS52YWx1ZSA9IGFjdEZyYW1lLnByb3BlcnR5LmFuaW1hdGUocG9zLCBhY3RGcmFtZS5lbmRWYWx1ZSwgbmV4dEZyYW1lLmVuZFZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYWN0RnJhbWUucHJvcGVydHkudmFsdWUgPSBhY3RGcmFtZS5lbmRWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2xhc3RSdW5UaW1lID0gYWN0VGltZTtcblxuICAgICAgICByZXR1cm4gYWN0VGltZSA+PSB0aGlzLl9zdGFydFRpbWUgKyB0aGlzLl9rZXlGcmFtZXNbdGhpcy5fa2V5RnJhbWVzLmxlbmd0aCAtIDFdLnRpbWU7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBJSW50ZXJwb2xhdG9yIHtcbiAgICAodmFsdWU6IG51bWJlcik6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIEludGVycG9sYXRvcnMge1xuICAgIHN0YXRpYyBnZXQgTGluZWFyKCk6IElJbnRlcnBvbGF0b3Ige1xuICAgICAgICByZXR1cm4gKHZhbHVlOiBudW1iZXIpOiBudW1iZXIgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQUFuaW1hdG9yIHtcblxuICAgIHByaXZhdGUgc3RhdGljIGFuaW1hdG9yczogQUFuaW1hdG9yW10gPSBbXTtcbiAgICBwcml2YXRlIHN0YXRpYyBBTklNQVRPUl9UQVNLID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICBBQW5pbWF0b3IuYW5pbWF0ZSgpO1xuICAgIH07XG5cbiAgICBwcml2YXRlIHN0YXJ0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIHN0YXRpYyBhbmltYXRlKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gQUFuaW1hdG9yLmFuaW1hdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgaWYgKEFBbmltYXRvci5hbmltYXRvcnMubGVuZ3RoIDw9IGkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBhbmltYXRvcjogQUFuaW1hdG9yID0gQUFuaW1hdG9yLmFuaW1hdG9yc1tpXTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgYW5pbWF0b3Iub25BbmltYXRlKCk7XG4gICAgICAgICAgICB9IGNhdGNoICh0KSB7XG4gICAgICAgICAgICAgICAgbmV3IENvbnNvbGUoKS5lcnJvcih0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChBQW5pbWF0b3IuYW5pbWF0b3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIEV2ZW50UXVldWUuSW5zdGFuY2UuaW52b2tlTGF0ZXIoQUFuaW1hdG9yLkFOSU1BVE9SX1RBU0spO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXJ0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIEFBbmltYXRvci5hbmltYXRvcnMucHVzaCh0aGlzKTtcbiAgICAgICAgaWYgKEFBbmltYXRvci5hbmltYXRvcnMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIEV2ZW50UXVldWUuSW5zdGFuY2UuaW52b2tlTGF0ZXIoQUFuaW1hdG9yLkFOSU1BVE9SX1RBU0spO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RhcnRlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgc3RvcCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXJ0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlO1xuXG4gICAgICAgIHZhciBpZHggPSBBQW5pbWF0b3IuYW5pbWF0b3JzLmluZGV4T2YodGhpcyk7XG4gICAgICAgIEFBbmltYXRvci5hbmltYXRvcnMuc3BsaWNlKGlkeCwgMSlcbiAgICB9XG5cbiAgICBnZXQgU3RhcnRlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhcnRlZDtcbiAgICB9XG5cbiAgICBnZXQgU3RvcHBlZCgpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLnN0YXJ0ZWQ7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IG9uQW5pbWF0ZSgpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgVGltZWxpbmUgZXh0ZW5kcyBBQW5pbWF0b3Ige1xuXG5cbiAgICBwcml2YXRlIHByb3BlcnR5TGluZXM6IFByb3BlcnR5TGluZTxhbnk+W10gPSBbXTtcbiAgICBwcml2YXRlIHJlcGVhdENvdW50ID0gMDtcbiAgICBwcml2YXRlIGZpbmlzaGVkRXZlbnQ6IEV2ZW50PFRpbWVsaW5lRmluaXNoZWRFdmVudEFyZ3M+ID0gbmV3IEV2ZW50PFRpbWVsaW5lRmluaXNoZWRFdmVudEFyZ3M+KCk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGtleUZyYW1lczogS2V5RnJhbWU8YW55PltdKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgY3JlYXRlUHJvcGVydHlMaW5lcygpIHtcbiAgICAgICAgdmFyIHBsTWFwOiB7IFtrZXk6IHN0cmluZ106IEtleUZyYW1lPGFueT5bXSB9ID0ge307XG4gICAgICAgIHZhciBrZXlzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMua2V5RnJhbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQga2V5RnJhbWUgPSB0aGlzLmtleUZyYW1lc1tpXTtcbiAgICAgICAgICAgIGxldCBrZjogS2V5RnJhbWU8YW55PiA9IGtleUZyYW1lO1xuICAgICAgICAgICAgbGV0IHByb3BlcnR5TGluZSA9IHBsTWFwW2tmLnByb3BlcnR5LmlkXTtcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eUxpbmUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHByb3BlcnR5TGluZSA9IFtdO1xuICAgICAgICAgICAgICAgIHBsTWFwW2tmLnByb3BlcnR5LmlkXSA9IHByb3BlcnR5TGluZTtcbiAgICAgICAgICAgICAgICBrZXlzLnB1c2goa2YucHJvcGVydHkuaWQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJvcGVydHlMaW5lLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHlMaW5lW3Byb3BlcnR5TGluZS5sZW5ndGggLSAxXS50aW1lID49IGtmLnRpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUga2V5ZnJhbWVzIG11c3QgYmUgaW4gYXNjZW5kaW5nIHRpbWUgb3JkZXIgcGVyIHByb3BlcnR5LlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByb3BlcnR5TGluZS5wdXNoKGtleUZyYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBrZXlzLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgbGV0IHByb3BlcnR5TGluZTogUHJvcGVydHlMaW5lPGFueT4gPSBwbE1hcFtrZXldWzBdLnByb3BlcnR5LmNyZWF0ZVByb3BlcnR5TGluZShwbE1hcFtrZXldKTtcbiAgICAgICAgICAgIHRoaXMucHJvcGVydHlMaW5lcy5wdXNoKHByb3BlcnR5TGluZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHN0YXJ0KHJlcGVhdENvdW50OiBudW1iZXIgPSAwKSB7XG4gICAgICAgIGlmIChyZXBlYXRDb3VudCA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXBlYXRDb3VudCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmVwZWF0Q291bnQgPSByZXBlYXRDb3VudCB8IDA7XG4gICAgICAgIHRoaXMuY3JlYXRlUHJvcGVydHlMaW5lcygpO1xuICAgICAgICB0aGlzLnJlcGVhdENvdW50ID0gcmVwZWF0Q291bnQ7XG4gICAgICAgIHZhciBzdGFydFRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICB0aGlzLnByb3BlcnR5TGluZXMuZm9yRWFjaCgocHJvcGVydHlMaW5lKSA9PiB7XG4gICAgICAgICAgICBsZXQgcGw6IFByb3BlcnR5TGluZTxhbnk+ID0gcHJvcGVydHlMaW5lO1xuICAgICAgICAgICAgcGwuc3RhcnRUaW1lID0gc3RhcnRUaW1lO1xuICAgICAgICB9KTtcbiAgICAgICAgc3VwZXIuc3RhcnQoKTtcbiAgICB9XG5cbiAgICBzdG9wKCkge1xuICAgICAgICBpZiAoIXRoaXMuU3RhcnRlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHN1cGVyLnN0b3AoKTtcbiAgICAgICAgdGhpcy5maW5pc2hlZEV2ZW50LmZpcmVFdmVudChuZXcgVGltZWxpbmVGaW5pc2hlZEV2ZW50QXJncyh0cnVlKSk7XG4gICAgfVxuXG4gICAgb25BbmltYXRlKCkge1xuICAgICAgICB2YXIgZmluaXNoZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnByb3BlcnR5TGluZXMuZm9yRWFjaCgocHJvcGVydHlMaW5lKSA9PiB7XG4gICAgICAgICAgICBsZXQgcGw6IFByb3BlcnR5TGluZTxhbnk+ID0gcHJvcGVydHlMaW5lO1xuICAgICAgICAgICAgZmluaXNoZWQgPSBmaW5pc2hlZCAmJiBwbC5hbmltYXRlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChmaW5pc2hlZCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucmVwZWF0Q291bnQgPCAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0YXJ0VGltZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eUxpbmVzLmZvckVhY2goKHByb3BlcnR5TGluZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcGw6IFByb3BlcnR5TGluZTxhbnk+ID0gcHJvcGVydHlMaW5lO1xuICAgICAgICAgICAgICAgICAgICBwbC5zdGFydFRpbWUgPSBzdGFydFRpbWU7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucmVwZWF0Q291bnQtLTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yZXBlYXRDb3VudCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzdGFydFRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnR5TGluZXMuZm9yRWFjaCgocHJvcGVydHlMaW5lKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGw6IFByb3BlcnR5TGluZTxhbnk+ID0gcHJvcGVydHlMaW5lO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGwuc3RhcnRUaW1lID0gc3RhcnRUaW1lO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzdXBlci5zdG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmluaXNoZWRFdmVudC5maXJlRXZlbnQobmV3IFRpbWVsaW5lRmluaXNoZWRFdmVudEFyZ3MoZmFsc2UpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkZpbmlzaGVkRXZlbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZpbmlzaGVkRXZlbnQ7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBjbGFzcyBUaW1lbGluZUZpbmlzaGVkRXZlbnRBcmdzIHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHN0b3BwZWQ6IGJvb2xlYW4gPSBmYWxzZSkge1xuXG4gICAgfVxuXG4gICAgZ2V0IFN0b3BwZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0b3BwZWQ7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTnVtYmVyUHJvcGVydHkgZXh0ZW5kcyBQcm9wZXJ0eTxudW1iZXI+IHtcblxuICAgIGFuaW1hdGUocG9zOiBudW1iZXIsIHN0YXJ0VmFsdWU6IG51bWJlciwgZW5kVmFsdWU6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBzdGFydFZhbHVlICsgKChlbmRWYWx1ZSAtIHN0YXJ0VmFsdWUpICogcG9zKTtcbiAgICB9XG5cbn1cblxuZXhwb3J0IGNsYXNzIFN0cmluZ1Byb3BlcnR5IGV4dGVuZHMgUHJvcGVydHk8c3RyaW5nPiB7XG5cbn1cblxuZXhwb3J0IGNsYXNzIFBhZGRpbmdQcm9wZXJ0eSBleHRlbmRzIFByb3BlcnR5PFBhZGRpbmc+IHtcblxufVxuXG5leHBvcnQgY2xhc3MgQm9yZGVyUHJvcGVydHkgZXh0ZW5kcyBQcm9wZXJ0eTxCb3JkZXI+IHtcblxufVxuXG5leHBvcnQgY2xhc3MgQmFja2dyb3VuZFByb3BlcnR5IGV4dGVuZHMgUHJvcGVydHk8QUJhY2tncm91bmQ+IHtcblxufVxuXG5leHBvcnQgY2xhc3MgQm9vbGVhblByb3BlcnR5IGV4dGVuZHMgUHJvcGVydHk8Ym9vbGVhbj4ge1xuXG59XG5cbn1cblxuXG4iLCJcblxubW9kdWxlIGN1YmVlIHtcblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVN0eWxlIHtcblxuICAgICAgICBhcHBseShlbGVtZW50OiBIVE1MRWxlbWVudCk6IHZvaWQ7XG5cbiAgICB9XG5cbiAgICBleHBvcnQgYWJzdHJhY3QgY2xhc3MgQUJhY2tncm91bmQgaW1wbGVtZW50cyBJU3R5bGUge1xuXG4gICAgICAgIGFic3RyYWN0IGFwcGx5KGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogdm9pZDtcblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBDb2xvciB7XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgX1RSQU5TUEFSRU5UID0gQ29sb3IuZ2V0QXJnYkNvbG9yKDB4MDAwMDAwMDApO1xuICAgICAgICBzdGF0aWMgZ2V0IFRSQU5TUEFSRU5UKCkge1xuICAgICAgICAgICAgcmV0dXJuIENvbG9yLl9UUkFOU1BBUkVOVDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZ2V0QXJnYkNvbG9yKGFyZ2I6IG51bWJlcik6IENvbG9yIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29sb3IoYXJnYik7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGdldEFyZ2JDb2xvckJ5Q29tcG9uZW50cyhhbHBoYTogbnVtYmVyLCByZWQ6IG51bWJlciwgZ3JlZW46IG51bWJlciwgYmx1ZTogbnVtYmVyKSB7XG4gICAgICAgICAgICBhbHBoYSA9IHRoaXMuZml4Q29tcG9uZW50KGFscGhhKTtcbiAgICAgICAgICAgIHJlZCA9IHRoaXMuZml4Q29tcG9uZW50KHJlZCk7XG4gICAgICAgICAgICBncmVlbiA9IHRoaXMuZml4Q29tcG9uZW50KGdyZWVuKTtcbiAgICAgICAgICAgIGJsdWUgPSB0aGlzLmZpeENvbXBvbmVudChibHVlKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QXJnYkNvbG9yKFxuICAgICAgICAgICAgICAgIGFscGhhIDw8IDI0XG4gICAgICAgICAgICAgICAgfCByZWQgPDwgMTZcbiAgICAgICAgICAgICAgICB8IGdyZWVuIDw8IDhcbiAgICAgICAgICAgICAgICB8IGJsdWVcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGdldFJnYkNvbG9yKHJnYjogbnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRBcmdiQ29sb3IocmdiIHwgMHhmZjAwMDAwMCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGdldFJnYkNvbG9yQnlDb21wb25lbnRzKHJlZDogbnVtYmVyLCBncmVlbjogbnVtYmVyLCBibHVlOiBudW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEFyZ2JDb2xvckJ5Q29tcG9uZW50cygyNTUsIHJlZCwgZ3JlZW4sIGJsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgZml4Q29tcG9uZW50KGNvbXBvbmVudDogbnVtYmVyKSB7XG4gICAgICAgICAgICBjb21wb25lbnQgPSBjb21wb25lbnQgfCAwO1xuICAgICAgICAgICAgaWYgKGNvbXBvbmVudCA8IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNvbXBvbmVudCA+IDI1NSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAyNTU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGZhZGVDb2xvcnMoc3RhcnRDb2xvcjogQ29sb3IsIGVuZENvbG9yOiBDb2xvciwgZmFkZVBvc2l0aW9uOiBudW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBDb2xvci5nZXRBcmdiQ29sb3JCeUNvbXBvbmVudHMoXG4gICAgICAgICAgICAgICAgdGhpcy5taXhDb21wb25lbnQoc3RhcnRDb2xvci5hbHBoYSwgZW5kQ29sb3IuYWxwaGEsIGZhZGVQb3NpdGlvbiksXG4gICAgICAgICAgICAgICAgdGhpcy5taXhDb21wb25lbnQoc3RhcnRDb2xvci5yZWQsIGVuZENvbG9yLnJlZCwgZmFkZVBvc2l0aW9uKSxcbiAgICAgICAgICAgICAgICB0aGlzLm1peENvbXBvbmVudChzdGFydENvbG9yLmdyZWVuLCBlbmRDb2xvci5ncmVlbiwgZmFkZVBvc2l0aW9uKSxcbiAgICAgICAgICAgICAgICB0aGlzLm1peENvbXBvbmVudChzdGFydENvbG9yLmJsdWUsIGVuZENvbG9yLmJsdWUsIGZhZGVQb3NpdGlvbilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBtaXhDb21wb25lbnQoc3RhcnRWYWx1ZTogbnVtYmVyLCBlbmRWYWx1ZTogbnVtYmVyLCBwb3M6IG51bWJlcikge1xuICAgICAgICAgICAgdmFyIHJlcyA9IChzdGFydFZhbHVlICsgKChlbmRWYWx1ZSAtIHN0YXJ0VmFsdWUpICogcG9zKSkgfCAwO1xuICAgICAgICAgICAgcmVzID0gdGhpcy5maXhDb21wb25lbnQocmVzKTtcbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9hcmdiID0gMDtcblxuICAgICAgICBjb25zdHJ1Y3RvcihhcmdiOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGFyZ2IgPSBhcmdiIHwgMDtcbiAgICAgICAgICAgIHRoaXMuX2FyZ2IgPSBhcmdiO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGFyZ2IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYXJnYjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBhbHBoYSgpIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5fYXJnYiA+Pj4gMjQpICYgMHhmZjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCByZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuX2FyZ2IgPj4+IDE2KSAmIDB4ZmY7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgZ3JlZW4oKSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuX2FyZ2IgPj4+IDgpICYgMHhmZjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBibHVlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FyZ2IgJiAweGZmO1xuICAgICAgICB9XG5cbiAgICAgICAgZmFkZShmYWRlQ29sb3I6IENvbG9yLCBmYWRlUG9zaXRpb246IG51bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIENvbG9yLmZhZGVDb2xvcnModGhpcywgZmFkZUNvbG9yLCBmYWRlUG9zaXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgdG9DU1MoKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJyZ2JhKFwiICsgdGhpcy5yZWQgKyBcIiwgXCIgKyB0aGlzLmdyZWVuICsgXCIsIFwiICsgdGhpcy5ibHVlICsgXCIsIFwiICsgKHRoaXMuYWxwaGEgLyAyNTUuMCkgKyBcIilcIjtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIENvbG9yQmFja2dyb3VuZCBleHRlbmRzIEFCYWNrZ3JvdW5kIHtcblxuICAgICAgICBwcml2YXRlIF9jb2xvcjogQ29sb3IgPSBudWxsO1xuICAgICAgICBwcml2YXRlIF9jYWNoZTogc3RyaW5nID0gbnVsbDtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihjb2xvcjogQ29sb3IpIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgICAgICB0aGlzLl9jb2xvciA9IGNvbG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGNvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgYXBwbHkoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jYWNoZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLl9jYWNoZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2NvbG9yID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImJhY2tncm91bmRDb2xvclwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYWNoZSA9IHRoaXMuX2NvbG9yLnRvQ1NTKCk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5fY2FjaGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgUGFkZGluZyBpbXBsZW1lbnRzIElTdHlsZSB7XG5cbiAgICAgICAgc3RhdGljIGNyZWF0ZShwYWRkaW5nOiBudW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUGFkZGluZyhwYWRkaW5nLCBwYWRkaW5nLCBwYWRkaW5nLCBwYWRkaW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICAgICAgcHJpdmF0ZSBfbGVmdDogbnVtYmVyLFxuICAgICAgICAgICAgcHJpdmF0ZSBfdG9wOiBudW1iZXIsXG4gICAgICAgICAgICBwcml2YXRlIF9yaWdodDogbnVtYmVyLFxuICAgICAgICAgICAgcHJpdmF0ZSBfYm90dG9tOiBudW1iZXIpIHsgfVxuXG4gICAgICAgIGdldCBsZWZ0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xlZnQ7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgdG9wKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RvcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCByaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBib3R0b20oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYm90dG9tO1xuICAgICAgICB9XG5cbiAgICAgICAgYXBwbHkoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUucGFkZGluZ0xlZnQgPSB0aGlzLl9sZWZ0ICsgXCJweFwiO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5wYWRkaW5nVG9wID0gdGhpcy5fdG9wICsgXCJweFwiO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5wYWRkaW5nUmlnaHQgPSB0aGlzLl9yaWdodCArIFwicHhcIjtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUucGFkZGluZ0JvdHRvbSA9IHRoaXMuX2JvdHRvbSArIFwicHhcIjtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEJvcmRlciBpbXBsZW1lbnRzIElTdHlsZSB7XG5cbiAgICAgICAgc3RhdGljIGNyZWF0ZSh3aWR0aDogbnVtYmVyLCBjb2xvcjogQ29sb3IsIHJhZGl1czogbnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEJvcmRlcih3aWR0aCwgd2lkdGgsIHdpZHRoLCB3aWR0aCwgY29sb3IsIGNvbG9yLCBjb2xvciwgY29sb3IsIHJhZGl1cywgcmFkaXVzLCByYWRpdXMsIHJhZGl1cyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgICAgIHByaXZhdGUgX2xlZnRXaWR0aDogbnVtYmVyLFxuICAgICAgICAgICAgcHJpdmF0ZSBfdG9wV2lkdGg6IG51bWJlcixcbiAgICAgICAgICAgIHByaXZhdGUgX3JpZ2h0V2lkdGg6IG51bWJlcixcbiAgICAgICAgICAgIHByaXZhdGUgX2JvdHRvbVdpZHRoOiBudW1iZXIsXG4gICAgICAgICAgICBwcml2YXRlIF9sZWZ0Q29sb3I6IENvbG9yLFxuICAgICAgICAgICAgcHJpdmF0ZSBfdG9wQ29sb3I6IENvbG9yLFxuICAgICAgICAgICAgcHJpdmF0ZSBfcmlnaHRDb2xvcjogQ29sb3IsXG4gICAgICAgICAgICBwcml2YXRlIF9ib3R0b21Db2xvcjogQ29sb3IsXG4gICAgICAgICAgICBwcml2YXRlIF90b3BMZWZ0UmFkaXVzOiBudW1iZXIsXG4gICAgICAgICAgICBwcml2YXRlIF90b3BSaWdodFJhZGl1czogbnVtYmVyLFxuICAgICAgICAgICAgcHJpdmF0ZSBfYm90dG9tTGVmdFJhZGl1czogbnVtYmVyLFxuICAgICAgICAgICAgcHJpdmF0ZSBfYm90dG9tUmlnaHRSYWRpdXM6IG51bWJlcikge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2xlZnRDb2xvciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGVmdENvbG9yID0gQ29sb3IuVFJBTlNQQVJFTlQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5fdG9wQ29sb3IgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3RvcENvbG9yID0gQ29sb3IuVFJBTlNQQVJFTlQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5fcmlnaHRDb2xvciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmlnaHRDb2xvciA9IENvbG9yLlRSQU5TUEFSRU5UO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuX2JvdHRvbUNvbG9yID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9ib3R0b21Db2xvciA9IENvbG9yLlRSQU5TUEFSRU5UO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGxlZnRXaWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sZWZ0V2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRvcFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RvcFdpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGdldCByaWdodFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JpZ2h0V2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJvdHRvbVdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvdHRvbVdpZHRoO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGxlZnRDb2xvcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sZWZ0Q29sb3I7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRvcENvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RvcENvbG9yO1xuICAgICAgICB9XG4gICAgICAgIGdldCByaWdodENvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JpZ2h0Q29sb3I7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJvdHRvbUNvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvdHRvbUNvbG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHRvcExlZnRSYWRpdXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdG9wTGVmdFJhZGl1cztcbiAgICAgICAgfVxuICAgICAgICBnZXQgdG9wUmlnaHRSYWRpdXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdG9wUmlnaHRSYWRpdXM7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJvdHRvbUxlZnRSYWRpdXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYm90dG9tTGVmdFJhZGl1cztcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm90dG9tUmlnaHRSYWRpdXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYm90dG9tUmlnaHRSYWRpdXM7XG4gICAgICAgIH1cblxuICAgICAgICBhcHBseShlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5ib3JkZXJTdHlsZSA9IFwic29saWRcIjtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuYm9yZGVyTGVmdENvbG9yID0gdGhpcy5fbGVmdENvbG9yLnRvQ1NTKCk7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJvcmRlckxlZnRXaWR0aCA9IHRoaXMuX2xlZnRXaWR0aCArIFwicHhcIjtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuYm9yZGVyVG9wQ29sb3IgPSB0aGlzLl90b3BDb2xvci50b0NTUygpO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5ib3JkZXJUb3BXaWR0aCA9IHRoaXMuX3RvcFdpZHRoICsgXCJweFwiO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5ib3JkZXJSaWdodENvbG9yID0gdGhpcy5fcmlnaHRDb2xvci50b0NTUygpO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5ib3JkZXJSaWdodFdpZHRoID0gdGhpcy5fcmlnaHRXaWR0aCArIFwicHhcIjtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuYm9yZGVyQm90dG9tQ29sb3IgPSB0aGlzLl9ib3R0b21Db2xvci50b0NTUygpO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5ib3JkZXJCb3R0b21XaWR0aCA9IHRoaXMuX2JvdHRvbVdpZHRoICsgXCJweFwiO1xuXG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJvcmRlclRvcExlZnRSYWRpdXMgPSB0aGlzLl90b3BMZWZ0UmFkaXVzICsgXCJweFwiO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5ib3JkZXJUb3BSaWdodFJhZGl1cyA9IHRoaXMuX3RvcFJpZ2h0UmFkaXVzICsgXCJweFwiO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5ib3JkZXJCb3R0b21MZWZ0UmFkaXVzID0gdGhpcy5fYm90dG9tTGVmdFJhZGl1cyArIFwicHhcIjtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuYm9yZGVyQm90dG9tUmlnaHRSYWRpdXMgPSB0aGlzLl9ib3R0b21SaWdodFJhZGl1cyArIFwicHhcIjtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEJveFNoYWRvdyBpbXBsZW1lbnRzIElTdHlsZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoXG4gICAgICAgICAgICBwcml2YXRlIF9oUG9zOiBudW1iZXIsXG4gICAgICAgICAgICBwcml2YXRlIF92UG9zOiBudW1iZXIsXG4gICAgICAgICAgICBwcml2YXRlIF9ibHVyOiBudW1iZXIsXG4gICAgICAgICAgICBwcml2YXRlIF9zcHJlYWQ6IG51bWJlcixcbiAgICAgICAgICAgIHByaXZhdGUgX2NvbG9yOiBDb2xvcixcbiAgICAgICAgICAgIHByaXZhdGUgX2lubmVyOiBib29sZWFuKSB7IH1cblxuICAgICAgICBnZXQgaFBvcygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9oUG9zO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHZQb3MoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdlBvcztcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBibHVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JsdXI7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgc3ByZWFkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NwcmVhZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBjb2xvcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb2xvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBpbm5lcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbm5lcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGFwcGx5KGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJveFNoYWRvdyA9IHRoaXMuX2hQb3MgKyBcInB4IFwiICsgdGhpcy5fdlBvcyArIFwicHggXCIgKyB0aGlzLl9ibHVyICsgXCJweCBcIiArIHRoaXMuX3NwcmVhZCArIFwicHggXCJcbiAgICAgICAgICAgICsgdGhpcy5fY29sb3IudG9DU1MoKSArICh0aGlzLl9pbm5lciA/IFwiIGluc2V0XCIgOiBcIlwiKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG59XG5cblxuIiwibW9kdWxlIGN1YmVlIHtcbiAgICBcbiAgICBleHBvcnQgaW50ZXJmYWNlIElSdW5uYWJsZSB7XG4gICAgICAgICgpOiB2b2lkO1xuICAgIH1cbiAgICBcbiAgICBleHBvcnQgY2xhc3MgUG9pbnQyRCB7XG4gICAgICAgIFxuICAgICAgICBjb25zdHJ1Y3RvciAocHJpdmF0ZSBfeDogbnVtYmVyLCBwcml2YXRlIF95OiBudW1iZXIpIHtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBnZXQgeCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl94O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBnZXQgeSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl95O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH1cbiAgICBcbn1cblxuXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwidXRpbHMudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiZXZlbnRzLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInByb3BlcnRpZXMudHNcIi8+XG5cbm1vZHVsZSBjdWJlZSB7XG5cbiAgICAvLyAgICBleHBvcnQgaW50ZXJmYWNlIElOYXRpdmVFdmVudExpc3RlbmVyIHtcbiAgICAvLyAgICAgICAgKGV2ZW50OiBVSUV2ZW50KTogYW55O1xuICAgIC8vICAgIH1cblxuICAgIGNsYXNzIE1vdXNlRG93bkV2ZW50TG9nIHtcbiAgICAgICAgY29uc3RydWN0b3IoXG4gICAgICAgICAgICBwdWJsaWMgY29tcG9uZW50OiBBQ29tcG9uZW50LFxuICAgICAgICAgICAgcHVibGljIHNjcmVlblg6IG51bWJlcixcbiAgICAgICAgICAgIHB1YmxpYyBzY3JlZW5ZOiBudW1iZXIsXG4gICAgICAgICAgICBwdWJsaWMgeDogbnVtYmVyLFxuICAgICAgICAgICAgcHVibGljIHk6IG51bWJlcixcbiAgICAgICAgICAgIHB1YmxpYyB0aW1lc3RhbXA6IG51bWJlciA9IERhdGUubm93KCkpIHsgfVxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBFQ3Vyc29yIHtcblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBhdXRvID0gbmV3IEVDdXJzb3IoXCJhdXRvXCIpO1xuICAgICAgICBzdGF0aWMgZ2V0IEFVVE8oKSB7XG4gICAgICAgICAgICByZXR1cm4gRUN1cnNvci5hdXRvO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBfY3NzOiBzdHJpbmcpIHsgfVxuXG4gICAgICAgIGdldCBjc3MoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY3NzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIExheW91dENoaWxkcmVuIHtcbiAgICAgICAgcHJpdmF0ZSBjaGlsZHJlbjogQUNvbXBvbmVudFtdID0gW107XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBwYXJlbnQ6IEFMYXlvdXQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkKGNvbXBvbmVudDogQUNvbXBvbmVudCkge1xuICAgICAgICAgICAgaWYgKGNvbXBvbmVudCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5wYXJlbnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBcIlRoZSBjb21wb25lbnQgaXMgYWxyZWFkeSBhIGNoaWxkIG9mIGEgbGF5b3V0LlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb21wb25lbnQuX3NldFBhcmVudCh0aGlzLnBhcmVudCk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50Lm9uUGFyZW50Q2hhbmdlZC5maXJlRXZlbnQobmV3IFBhcmVudENoYW5nZWRFdmVudEFyZ3ModGhpcy5wYXJlbnQsIGNvbXBvbmVudCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goY29tcG9uZW50KTtcbiAgICAgICAgICAgIHRoaXMucGFyZW50Ll9vbkNoaWxkQWRkZWQoY29tcG9uZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluc2VydChpbmRleDogbnVtYmVyLCBjb21wb25lbnQ6IEFDb21wb25lbnQpIHtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQucGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgY29tcG9uZW50IGlzIGFscmVhZHkgYSBjaGlsZCBvZiBhIGxheW91dC5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBuZXdDaGlsZHJlbjogQUNvbXBvbmVudFtdID0gW107XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICAgICAgICAgICAgbmV3Q2hpbGRyZW4ucHVzaChjaGlsZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG5ld0NoaWxkcmVuLnNwbGljZShpbmRleCwgMCwgY29tcG9uZW50KTtcblxuICAgICAgICAgICAgLy8gVE9ETyBWRVJZIElORUZFQ1RJVkVcbiAgICAgICAgICAgIHRoaXMuY2xlYXIoKTtcblxuICAgICAgICAgICAgbmV3Q2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZChjaGlsZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZUNvbXBvbmVudChjb21wb25lbnQ6IEFDb21wb25lbnQpIHtcbiAgICAgICAgICAgIHZhciBpZHggPSB0aGlzLmNoaWxkcmVuLmluZGV4T2YoY29tcG9uZW50KTtcbiAgICAgICAgICAgIGlmIChpZHggPCAwKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGUgZ2l2ZW4gY29tcG9uZW50IGlzbid0IGEgY2hpbGQgb2YgdGhpcyBsYXlvdXQuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUluZGV4KGlkeCk7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmVJbmRleChpbmRleDogbnVtYmVyKSB7XG4gICAgICAgICAgICB2YXIgcmVtb3ZlZENvbXBvbmVudDogQUNvbXBvbmVudCA9IHRoaXMuY2hpbGRyZW5baW5kZXhdO1xuICAgICAgICAgICAgaWYgKHJlbW92ZWRDb21wb25lbnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJlbW92ZWRDb21wb25lbnQuX3NldFBhcmVudChudWxsKTtcbiAgICAgICAgICAgICAgICByZW1vdmVkQ29tcG9uZW50Lm9uUGFyZW50Q2hhbmdlZC5maXJlRXZlbnQobmV3IFBhcmVudENoYW5nZWRFdmVudEFyZ3MobnVsbCwgcmVtb3ZlZENvbXBvbmVudCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wYXJlbnQuX29uQ2hpbGRSZW1vdmVkKHJlbW92ZWRDb21wb25lbnQsIGluZGV4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNsZWFyKCkge1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLl9zZXRQYXJlbnQobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLm9uUGFyZW50Q2hhbmdlZC5maXJlRXZlbnQobmV3IFBhcmVudENoYW5nZWRFdmVudEFyZ3MobnVsbCwgY2hpbGQpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgICAgIHRoaXMucGFyZW50Ll9vbkNoaWxkcmVuQ2xlYXJlZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0KGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuW2luZGV4XVxuICAgICAgICB9XG5cbiAgICAgICAgaW5kZXhPZihjb21wb25lbnQ6IEFDb21wb25lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmluZGV4T2YoY29tcG9uZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNpemUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5sZW5ndGg7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG4gICAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFDb21wb25lbnQge1xuXG4gICAgICAgIC8vICAgICAgICBwcml2YXRlIHN0YXRpYyBwb2ludGVyRG93bkV2ZW50czogTW91c2VEb3duRXZlbnRMb2dbXSA9IFtdO1xuICAgICAgICAvL1xuICAgICAgICAvLyAgICAgICAgcHJpdmF0ZSBzdGF0aWMgbG9nUG9pbnRlckRvd25FdmVudChpdGVtOiBNb3VzZURvd25FdmVudExvZykge1xuICAgICAgICAvLyAgICAgICAgICAgIEFDb21wb25lbnQucG9pbnRlckRvd25FdmVudHMucHVzaChpdGVtKTtcbiAgICAgICAgLy8gICAgICAgIH1cbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgICAgIHN0YXRpYyBmaXJlRHJhZ0V2ZW50cyhzY3JlZW5YOiBudW1iZXIsIHNjcmVlblk6IG51bWJlciwgYWx0UHJlc3NlZDogYm9vbGVhbiwgY3RybFByZXNzZWQ6IGJvb2xlYW4sXG4gICAgICAgIC8vICAgICAgICAgICAgc2hpZnRQcmVzc2VkOiBib29sZWFuLCBtZXRhUHJlc3NlZDogYm9vbGVhbikge1xuICAgICAgICAvLyAgICAgICAgICAgIEFDb21wb25lbnQucG9pbnRlckRvd25FdmVudHMuZm9yRWFjaCgobG9nKSA9PiB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGxldCBhcmdzID0gbmV3IE1vdXNlRHJhZ0V2ZW50QXJncyhzY3JlZW5YLCBzY3JlZW5ZLCBzY3JlZW5YIC0gbG9nLnNjcmVlblgsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICBzY3JlZW5ZIC0gbG9nLnNjcmVlblksIGFsdFByZXNzZWQsIGN0cmxQcmVzc2VkLCBzaGlmdFByZXNzZWQsIG1ldGFQcmVzc2VkLCBsb2cuY29tcG9uZW50KTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgbG9nLmNvbXBvbmVudC5vbk1vdXNlRHJhZy5maXJlRXZlbnQoYXJncyk7XG4gICAgICAgIC8vICAgICAgICAgICAgfSk7XG4gICAgICAgIC8vICAgICAgICB9XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgICAgICBzdGF0aWMgZmlyZVVwRXZlbnRzKHNjcmVlblg6IG51bWJlciwgc2NyZWVuWTogbnVtYmVyLCBhbHRQcmVzc2VkOiBib29sZWFuLCBjdHJsUHJlc3NlZDogYm9vbGVhbixcbiAgICAgICAgLy8gICAgICAgICAgICBzaGlmdFByZXNzZWQ6IGJvb2xlYW4sIG1ldGFQcmVzc2VkOiBib29sZWFuLCBidXR0b246IG51bWJlciwgbmF0aXZlRXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgLy8gICAgICAgICAgICB2YXIgc3RhbXAgPSBEYXRlLm5vdygpO1xuICAgICAgICAvLyAgICAgICAgICAgIEFDb21wb25lbnQucG9pbnRlckRvd25FdmVudHMuZm9yRWFjaCgobG9nKSA9PiB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGxldCBhcmdzID0gbmV3IE1vdXNlVXBFdmVudEFyZ3Moc2NyZWVuWCwgc2NyZWVuWSwgc2NyZWVuWCAtIGxvZy5zY3JlZW5YLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgc2NyZWVuWSAtIGxvZy5zY3JlZW5ZLCBhbHRQcmVzc2VkLCBjdHJsUHJlc3NlZCwgc2hpZnRQcmVzc2VkLCBtZXRhUHJlc3NlZCwgYnV0dG9uLCBuYXRpdmVFdmVudCwgbG9nLmNvbXBvbmVudCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGxvZy5jb21wb25lbnQub25Nb3VzZVVwLmZpcmVFdmVudChhcmdzKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgaWYgKHN0YW1wIC0gbG9nLnRpbWVzdGFtcCA8IDUwMCkge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgbG9nLmNvbXBvbmVudC5vbkNsaWNrLmZpcmVFdmVudChuZXcgQ2xpY2tFdmVudEFyZ3Moc2NyZWVuWCwgc2NyZWVuWSwgbG9nLngsIGxvZy55LFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIGFsdFByZXNzZWQsIGN0cmxQcmVzc2VkLCBzaGlmdFByZXNzZWQsIG1ldGFQcmVzc2VkLCBidXR0b24sIGxvZy5jb21wb25lbnQpKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgICAgIH0pO1xuICAgICAgICAvLyAgICAgICAgICAgIEFDb21wb25lbnQucG9pbnRlckRvd25FdmVudHMgPSBbXTtcbiAgICAgICAgLy8gICAgICAgIH1cblxuICAgICAgICAvLyAgICAgICAgcHVibGljIHN0YXRpYyBhZGROYXRpdmVFdmVudChlbGVtZW50OiBFbGVtZW50LCBldmVudE5hbWU6IHN0cmluZywgbmF0aXZlRXZlbnRMaXN0ZW5lcjogeyAoZXZlbnQ6IFVJRXZlbnQpOiBhbnkgfSwgdXNlQ2FwdHVyZTogYm9vbGVhbikge1xuICAgICAgICAvLyAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIG5hdGl2ZUV2ZW50TGlzdGVuZXIsIHVzZUNhcHR1cmUpO1xuICAgICAgICAvLyAgICAgICAgfVxuICAgICAgICAvL1xuICAgICAgICAvLyAgICAgICAgcHVibGljIHN0YXRpYyByZW1vdmVOYXRpdmVFdmVudChlbGVtZW50OiBFbGVtZW50LCBldmVudE5hbWU6IHN0cmluZywgbmF0aXZlRXZlbnRMaXN0ZW5lcjogeyAoZXZlbnQ6IFVJRXZlbnQpOiBhbnkgfSwgdXNlQ2FwdHVyZTogYm9vbGVhbikge1xuICAgICAgICAvLyAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIG5hdGl2ZUV2ZW50TGlzdGVuZXIsIHVzZUNhcHR1cmUpO1xuICAgICAgICAvLyAgICAgICAgfVxuXG4gICAgICAgIC8vICAgICAgICBwcml2YXRlIG5hdGl2ZUV2ZW50TGlzdGVuZXI6IElOYXRpdmVFdmVudExpc3RlbmVyID0gKGV2ZW50OiBVSUV2ZW50KTogYW55ID0+IHtcbiAgICAgICAgLy8gICAgICAgICAgICB0aGlzLmhhbmRsZU5hdGl2ZUV2ZW50KGV2ZW50KTtcbiAgICAgICAgLy8gICAgICAgIH07XG5cbiAgICAgICAgLy8gICAgICAgIHByaXZhdGUgaGFuZGxlTmF0aXZlRXZlbnQoZXZlbnQ6IFVJRXZlbnQpIHtcbiAgICAgICAgLy8gICAgICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIFRleHRCb3gpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT0gXCJrZXl1cFwiKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICBFdmVudFF1ZXVlLkluc3RhbmNlLmludm9rZVByaW9yKCgpID0+IHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAoPFRleHRCb3g+dGhpcykudGV4dFByb3BlcnR5KCkuc2V0KGdldEVsZW1lbnQoKS5nZXRQcm9wZXJ0eVN0cmluZyhcInZhbHVlXCIpKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICB9XG4gICAgICAgIC8vICAgICAgICAgICAgfVxuICAgICAgICAvL1xuICAgICAgICAvLyAgICAgICAgICAgIC8vdmFyIHggPSBldmVudC5jbGllbnRYO1xuICAgICAgICAvLyAgICAgICAgICAgIC8vdmFyIHkgPSBldmVudC5jbGllbnRZO1xuICAgICAgICAvLyAgICAgICAgICAgIC8vdmFyIHdoZWVsVmVsb2NpdHkgPSBldmVudC52ZWxvY2l0eVk7XG4gICAgICAgIC8vICAgICAgICAgICAgdmFyIHBhcmVudDogQUNvbXBvbmVudDtcbiAgICAgICAgLy8gICAgICAgICAgICB2YXIga2V5QXJnczogS2V5RXZlbnRBcmdzO1xuICAgICAgICAvLyAgICAgICAgICAgIHZhciBjcCA9IHRoaXMuZ2V0Q3ViZWVQYW5lbCgpO1xuICAgICAgICAvLyAgICAgICAgICAgIHZhciBrZXZ0OiBLZXlib2FyZEV2ZW50ID0gbnVsbDtcbiAgICAgICAgLy8gICAgICAgICAgICBzd2l0Y2ggKGV2ZW50LnR5cGUpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgY2FzZSBcIm1vdXNlZG93blwiOlxuICAgICAgICAvLyAgICAgICAgICAgICAgICBjYXNlIFwibW91c2V3aGVlbFwiOlxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICBpZiAoY3AgIT0gbnVsbCkge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIGNwLmRvUG9pbnRlckV2ZW50Q2xpbWJpbmdVcCh4LCB5LCB3aGVlbFZlbG9jaXR5LFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5nZXRBbHRLZXkoKSwgZXZlbnQuZ2V0Q3RybEtleSgpLCBldmVudC5nZXRTaGlmdEtleSgpLCBldmVudC5nZXRNZXRhS2V5KCksXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LmdldFR5cGVJbnQoKSwgZXZlbnQuZ2V0QnV0dG9uKCksIGV2ZW50KTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgUG9wdXBzLmRvUG9pbnRlckV2ZW50Q2xpbWJpbmdVcCh4LCB5LCB3aGVlbFZlbG9jaXR5LFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5nZXRBbHRLZXkoKSwgZXZlbnQuZ2V0Q3RybEtleSgpLCBldmVudC5nZXRTaGlmdEtleSgpLCBldmVudC5nZXRNZXRhS2V5KCksXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LmdldFR5cGVJbnQoKSwgZXZlbnQuZ2V0QnV0dG9uKCksIGV2ZW50KTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICBjYXNlIFwibW91c2Vtb3ZlXCI6XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGlmIChBQ29tcG9uZW50LnBvaW50ZXJEb3duRXZlbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZXZ0ID0gPE1vdXNlRXZlbnQ+ZXZlbnQ7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgQUNvbXBvbmVudC5maXJlRHJhZ0V2ZW50cyhldnQuY2xpZW50WCwgZXZ0LmNsaWVudFksIGV2dC5hbHRLZXksIGV2dC5jdHJsS2V5LFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICBldnQuc2hpZnRLZXksIGV2dC5tZXRhS2V5KTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHdldnQgPSA8V2hlZWxFdmVudD5ldmVudDtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3AgIT0gbnVsbCkge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcC5kb1BvaW50ZXJFdmVudENsaW1iaW5nVXAod2V2dC5jbGllbnRYLCB3ZXZ0LmNsaWVudFksIHdldnQuZGVsdGFZLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2V2dC5hbHRLZXksIHdldnQuY3RybEtleSwgd2V2dC5zaGlmdEtleSwgd2V2dC5tZXRhS2V5LFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2V2dC50eXBlLCB3ZXZ0LmJ1dHRvbiwgd2V2dCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgUG9wdXBzLmRvUG9pbnRlckV2ZW50Q2xpbWJpbmdVcCh3ZXZ0LmNsaWVudFgsIHdldnQuY2xpZW50WSwgd2V2dC5kZWx0YVksXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3ZXZ0LmFsdEtleSwgd2V2dC5jdHJsS2V5LCB3ZXZ0LnNoaWZ0S2V5LCB3ZXZ0Lm1ldGFLZXksXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3ZXZ0LnR5cGUsIHdldnQuYnV0dG9uLCB3ZXZ0KTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgICAgICAgICAgICAgY2FzZSBcIm1vdXNldXBcIjpcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgbGV0IGV2dCA9IDxNb3VzZUV2ZW50PmV2ZW50O1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgQUNvbXBvbmVudC5maXJlRHJhZ0V2ZW50cyhldnQuY2xpZW50WCwgZXZ0LmNsaWVudFksIGV2dC5hbHRLZXksIGV2dC5jdHJsS2V5LFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIGV2dC5zaGlmdEtleSwgZXZ0Lm1ldGFLZXkpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGNhc2UgXCJtb3VzZW92ZXJcIjpcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9wb2ludGVyVHJhbnNwYXJlbnQuVmFsdWUpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAvLyBjaGVjayBoYW5kbGUgcG9pbnRlclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgcGFyZW50ID0gdGhpcztcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIHdoaWxlIChwYXJlbnQgIT0gbnVsbCkge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcGFyZW50LmhhbmRsZVBvaW50ZXIpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQuUGFyZW50O1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmhvdmVyZWQpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uTW91c2VFbnRlci5maXJlRXZlbnQobmV3IEV2ZW50QXJncyh0aGlzKSk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgY2FzZSBcIm1vdXNlb3V0XCI6XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wb2ludGVyVHJhbnNwYXJlbnQpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAvLyBjaGVjayBoYW5kbGUgcG9pbnRlclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgcGFyZW50ID0gdGhpcztcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIHdoaWxlIChwYXJlbnQgIT0gbnVsbCkge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcGFyZW50LmhhbmRsZVBvaW50ZXIpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQuUGFyZW50O1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaG92ZXJlZCkge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIC8qaW50IGNvbXBYID0gZ2V0TGVmdCgpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBpbnQgY29tcFkgPSBnZXRUb3AoKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHggPj0gY29tcFggJiYgeSA+PSBjb21wWSAmJiB4IDw9IGNvbXBYICsgYm91bmRzV2lkdGhQcm9wZXJ0eSgpLmdldCgpICYmIHkgPD0gY29tcFkgKyBib3VuZHNIZWlnaHRQcm9wZXJ0eSgpLmdldCgpKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgfSovXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbk1vdXNlTGVhdmUuZmlyZUV2ZW50KG5ldyBFdmVudEFyZ3ModGhpcykpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGNhc2UgXCJrZXlkd29uXCI6XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGtldnQgPSA8S2V5Ym9hcmRFdmVudD5ldmVudDtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGxldCBrZXlBcmdzID0gbmV3IEtleUV2ZW50QXJncyhrZXZ0LmtleUNvZGUsIGtldnQuYWx0S2V5LCBrZXZ0LmN0cmxLZXksXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAga2V2dC5zaGlmdEtleSwga2V2dC5tZXRhS2V5LCB0aGlzLCBrZXZ0KTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIHRoaXMub25LZXlEb3duLmZpcmVFdmVudChrZXlBcmdzKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICBjYXNlIFwia2V5cHJlc3NcIjpcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAga2V2dCA9IDxLZXlib2FyZEV2ZW50PmV2ZW50O1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAga2V5QXJncyA9IG5ldyBLZXlFdmVudEFyZ3Moa2V2dC5rZXlDb2RlLCBrZXZ0LmFsdEtleSwga2V2dC5jdHJsS2V5LFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIGtldnQuc2hpZnRLZXksIGtldnQubWV0YUtleSwgdGhpcywga2V2dCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICB0aGlzLm9uS2V5UHJlc3MuZmlyZUV2ZW50KGtleUFyZ3MpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIGNhc2UgXCJrZXl1cFwiOlxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICBrZXZ0ID0gPEtleWJvYXJkRXZlbnQ+ZXZlbnQ7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICBrZXlBcmdzID0gbmV3IEtleUV2ZW50QXJncyhrZXZ0LmtleUNvZGUsIGtldnQuYWx0S2V5LCBrZXZ0LmN0cmxLZXksXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAga2V2dC5zaGlmdEtleSwga2V2dC5tZXRhS2V5LCB0aGlzLCBrZXZ0KTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIHRoaXMub25LZXlVcC5maXJlRXZlbnQoa2V5QXJncyk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgY2FzZSBcImNvbnRleHRtZW51XCI6XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQ29udGV4dE1lbnUuZmlyZUV2ZW50KG5ldyBDb250ZXh0TWVudUV2ZW50QXJncyhldmVudCwgdGhpcykpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vICAgICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgX3RyYW5zbGF0ZVggPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdHJhbnNsYXRlWSA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9yb3RhdGUgPSBuZXcgTnVtYmVyUHJvcGVydHkoMC4wLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9zY2FsZVggPSBuZXcgTnVtYmVyUHJvcGVydHkoMS4wLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9zY2FsZVkgPSBuZXcgTnVtYmVyUHJvcGVydHkoMS4wLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF90cmFuc2Zvcm1DZW50ZXJYID0gbmV3IE51bWJlclByb3BlcnR5KDAuNSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfdHJhbnNmb3JtQ2VudGVyWSA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLjUsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3BhZGRpbmcgPSBuZXcgUGFkZGluZ1Byb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYm9yZGVyID0gbmV3IEJvcmRlclByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfbWVhc3VyZWRXaWR0aCA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgIHByaXZhdGUgX21lYXN1cmVkSGVpZ2h0ID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgcHJpdmF0ZSBfY2xpZW50V2lkdGggPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIHRydWUpO1xuICAgICAgICBwcml2YXRlIF9jbGllbnRIZWlnaHQgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIHRydWUpO1xuICAgICAgICBwcml2YXRlIF9ib3VuZHNXaWR0aCA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgIHByaXZhdGUgX2JvdW5kc0hlaWdodCA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgIHByaXZhdGUgX2JvdW5kc0xlZnQgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIHRydWUpO1xuICAgICAgICBwcml2YXRlIF9ib3VuZHNUb3AgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIHRydWUpO1xuICAgICAgICBwcml2YXRlIF9tZWFzdXJlZFdpZHRoU2V0dGVyID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX21lYXN1cmVkSGVpZ2h0U2V0dGVyID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2NsaWVudFdpZHRoU2V0dGVyID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2NsaWVudEhlaWdodFNldHRlciA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9ib3VuZHNXaWR0aFNldHRlciA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9ib3VuZHNIZWlnaHRTZXR0ZXIgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYm91bmRzTGVmdFNldHRlciA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9ib3VuZHNUb3BTZXR0ZXIgPSBuZXcgTnVtYmVyUHJvcGVydHkoMCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfY3Vyc29yID0gbmV3IFByb3BlcnR5PEVDdXJzb3I+KEVDdXJzb3IuQVVUTywgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfcG9pbnRlclRyYW5zcGFyZW50ID0gbmV3IFByb3BlcnR5PGJvb2xlYW4+KGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9oYW5kbGVQb2ludGVyID0gbmV3IFByb3BlcnR5PGJvb2xlYW4+KHRydWUsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3Zpc2libGUgPSBuZXcgUHJvcGVydHk8Ym9vbGVhbj4odHJ1ZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfZW5hYmxlZCA9IG5ldyBQcm9wZXJ0eTxib29sZWFuPih0cnVlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9hbHBoYSA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgxLjAsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3NlbGVjdGFibGUgPSBuZXcgUHJvcGVydHk8Ym9vbGVhbj4oZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX21pbldpZHRoID0gbmV3IE51bWJlclByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfbWluSGVpZ2h0ID0gbmV3IE51bWJlclByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfbWF4V2lkdGggPSBuZXcgTnVtYmVyUHJvcGVydHkobnVsbCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9tYXhIZWlnaHQgPSBuZXcgTnVtYmVyUHJvcGVydHkobnVsbCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9ob3ZlcmVkID0gbmV3IFByb3BlcnR5PGJvb2xlYW4+KGZhbHNlLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgIHByaXZhdGUgX2hvdmVyZWRTZXR0ZXIgPSBuZXcgUHJvcGVydHk8Ym9vbGVhbj4oZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX3ByZXNzZWQgPSBuZXcgUHJvcGVydHk8Ym9vbGVhbj4oZmFsc2UsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgcHJpdmF0ZSBfcHJlc3NlZFNldHRlciA9IG5ldyBQcm9wZXJ0eTxib29sZWFuPihmYWxzZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfb25DbGljayA9IG5ldyBFdmVudDxDbGlja0V2ZW50QXJncz4oKTtcbiAgICAgICAgcHJpdmF0ZSBfb25Nb3VzZURvd24gPSBuZXcgRXZlbnQ8TW91c2VEb3duRXZlbnRBcmdzPigpO1xuICAgICAgICBwcml2YXRlIF9vbk1vdXNlRHJhZyA9IG5ldyBFdmVudDxNb3VzZURyYWdFdmVudEFyZ3M+KCk7XG4gICAgICAgIHByaXZhdGUgX29uTW91c2VNb3ZlID0gbmV3IEV2ZW50PE1vdXNlTW92ZUV2ZW50QXJncz4oKTtcbiAgICAgICAgcHJpdmF0ZSBfb25Nb3VzZVVwID0gbmV3IEV2ZW50PE1vdXNlVXBFdmVudEFyZ3M+KCk7XG4gICAgICAgIHByaXZhdGUgX29uTW91c2VFbnRlciA9IG5ldyBFdmVudDxPYmplY3Q+KCk7XG4gICAgICAgIHByaXZhdGUgX29uTW91c2VMZWF2ZSA9IG5ldyBFdmVudDxPYmplY3Q+KCk7XG4gICAgICAgIHByaXZhdGUgX29uTW91c2VXaGVlbCA9IG5ldyBFdmVudDxNb3VzZVdoZWVsRXZlbnRBcmdzPigpO1xuICAgICAgICBwcml2YXRlIF9vbktleURvd24gPSBuZXcgRXZlbnQ8S2V5RXZlbnRBcmdzPigpO1xuICAgICAgICBwcml2YXRlIF9vbktleVByZXNzID0gbmV3IEV2ZW50PEtleUV2ZW50QXJncz4oKTtcbiAgICAgICAgcHJpdmF0ZSBfb25LZXlVcCA9IG5ldyBFdmVudDxLZXlFdmVudEFyZ3M+KCk7XG4gICAgICAgIHByaXZhdGUgX29uUGFyZW50Q2hhbmdlZCA9IG5ldyBFdmVudDxQYXJlbnRDaGFuZ2VkRXZlbnRBcmdzPigpO1xuICAgICAgICBwcml2YXRlIF9vbkNvbnRleHRNZW51ID0gbmV3IEV2ZW50PENvbnRleHRNZW51RXZlbnRBcmdzPigpO1xuICAgICAgICBwcml2YXRlIF9sZWZ0ID0gMDtcbiAgICAgICAgcHJpdmF0ZSBfdG9wID0gMDtcbiAgICAgICAgcHJpdmF0ZSBfZWxlbWVudDogSFRNTEVsZW1lbnQ7XG4gICAgICAgIHByaXZhdGUgX3BhcmVudDogQUxheW91dDtcbiAgICAgICAgcHVibGljIF9uZWVkc0xheW91dCA9IHRydWU7XG4gICAgICAgIHByaXZhdGUgX2N1YmVlUGFuZWw6IEN1YmVlUGFuZWw7XG4gICAgICAgIHByaXZhdGUgX3RyYW5zZm9ybUNoYW5nZWRMaXN0ZW5lciA9IChzZW5kZXI6IE9iamVjdCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVUcmFuc2Zvcm0oKTtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICB9O1xuICAgICAgICBwcml2YXRlIF9wb3N0Q29uc3RydWN0UnVuT25jZSA9IG5ldyBSdW5PbmNlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucG9zdENvbnN0cnVjdCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiBBQ29tcG9uZXQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSByb290RWxlbWVudCBUaGUgdW5kZXJsYXlpbmcgSFRNTCBlbGVtZW50IHdoaWNoIHRoaXMgY29tcG9uZW50IHdyYXBzLlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RydWN0b3Iocm9vdEVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50ID0gcm9vdEVsZW1lbnQ7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLmJveFNpemluZyA9IFwiY29udGVudC1ib3hcIjtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKFwiZHJhZ2dhYmxlXCIsIFwiZmFsc2VcIik7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5vdXRsaW5lU3R5bGUgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUub3V0bGluZVdpZHRoID0gXCIwcHhcIjtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUubWFyZ2luID0gXCIwcHhcIjtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9IFwiYWxsXCI7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2xhdGVYLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX3RyYW5zZm9ybUNoYW5nZWRMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2xhdGVZLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX3RyYW5zZm9ybUNoYW5nZWRMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLl9yb3RhdGUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fdHJhbnNmb3JtQ2hhbmdlZExpc3RlbmVyKTtcbiAgICAgICAgICAgIHRoaXMuX3NjYWxlWC5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl90cmFuc2Zvcm1DaGFuZ2VkTGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy5fc2NhbGVZLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX3RyYW5zZm9ybUNoYW5nZWRMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2Zvcm1DZW50ZXJYLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX3RyYW5zZm9ybUNoYW5nZWRMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2Zvcm1DZW50ZXJZLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX3RyYW5zZm9ybUNoYW5nZWRMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLl9ob3ZlcmVkLmluaXRSZWFkb25seUJpbmQodGhpcy5faG92ZXJlZFNldHRlcik7XG4gICAgICAgICAgICB0aGlzLl9wcmVzc2VkLmluaXRSZWFkb25seUJpbmQodGhpcy5fcHJlc3NlZFNldHRlcik7XG4gICAgICAgICAgICB0aGlzLl9wYWRkaW5nLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgcCA9IHRoaXMuX3BhZGRpbmcudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHAgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnBhZGRpbmcgPSBcIjBweFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHAuYXBwbHkodGhpcy5fZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9wYWRkaW5nLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2JvcmRlci5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGIgPSB0aGlzLl9ib3JkZXIudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKGIgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYm9yZGVyU3R5bGVcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJib3JkZXJDb2xvclwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImJvcmRlcldpZHRoXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYm9yZGVyUmFkaXVzXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGIuYXBwbHkodGhpcy5fZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9jdXJzb3IuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUuY3Vyc29yID0gdGhpcy5jdXJzb3IuY3NzO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl92aXNpYmxlLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdmlzaWJsZS52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZW5hYmxlZC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2VuYWJsZWQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2FscGhhLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLm9wYWNpdHkgPSBcIlwiICsgdGhpcy5fYWxwaGEudmFsdWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGFibGUuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zZWxlY3RhYmxlLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJtb3pVc2VyU2VsZWN0XCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwia2h0bWxVc2VyU2VsZWN0XCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwid2Via2l0VXNlclNlbGVjdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcIm1zVXNlclNlbGVjdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcInVzZXJTZWxlY3RcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcIm1velVzZXJTZWxlY3RcIiwgXCJub25lXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KFwia2h0bWxVc2VyU2VsZWN0XCIsIFwibm9uZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcIndlYmtpdFVzZXJTZWxlY3RcIiwgXCJub25lXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KFwibXNVc2VyU2VsZWN0XCIsIFwibm9uZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcInVzZXJTZWxlY3RcIiwgXCJub25lXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fc2VsZWN0YWJsZS5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9taW5XaWR0aC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX21pbldpZHRoLnZhbHVlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcIm1pbldpZHRoXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoXCJtaW5XaWR0aFwiLCB0aGlzLl9taW5XaWR0aC52YWx1ZSArIFwicHhcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9taW5IZWlnaHQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9taW5IZWlnaHQudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwibWluSGVpZ2h0XCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoXCJtaW5IZWlnaHRcIiwgdGhpcy5fbWluSGVpZ2h0LnZhbHVlICsgXCJweFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX21heFdpZHRoLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbWF4V2lkdGgudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwibWF4V2lkdGhcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcIm1heFdpZHRoXCIsIHRoaXMuX21heFdpZHRoLnZhbHVlICsgXCJweFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX21heEhlaWdodC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX21heEhlaWdodC52YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJtYXhIZWlnaHRcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcIm1heEhlaWdodFwiLCB0aGlzLl9tYXhIZWlnaHQudmFsdWUgKyBcInB4XCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5faGFuZGxlUG9pbnRlci5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9oYW5kbGVQb2ludGVyLnZhbHVlIHx8IHRoaXMuX3BvaW50ZXJUcmFuc3BhcmVudC52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KFwicG9pbnRlckV2ZW50c1wiLCBcIm5vbmVcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcInBvaW50ZXJFdmVudHNcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9wb2ludGVyVHJhbnNwYXJlbnQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5faGFuZGxlUG9pbnRlci52YWx1ZSB8fCB0aGlzLl9wb2ludGVyVHJhbnNwYXJlbnQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcInBvaW50ZXJFdmVudHNcIiwgXCJub25lXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJwb2ludGVyRXZlbnRzXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLl9tZWFzdXJlZFdpZHRoLmluaXRSZWFkb25seUJpbmQodGhpcy5fbWVhc3VyZWRXaWR0aFNldHRlcik7XG4gICAgICAgICAgICB0aGlzLl9tZWFzdXJlZEhlaWdodC5pbml0UmVhZG9ubHlCaW5kKHRoaXMuX21lYXN1cmVkSGVpZ2h0U2V0dGVyKTtcbiAgICAgICAgICAgIHRoaXMuX2NsaWVudFdpZHRoLmluaXRSZWFkb25seUJpbmQodGhpcy5fY2xpZW50V2lkdGhTZXR0ZXIpO1xuICAgICAgICAgICAgdGhpcy5fY2xpZW50SGVpZ2h0LmluaXRSZWFkb25seUJpbmQodGhpcy5fY2xpZW50SGVpZ2h0U2V0dGVyKTtcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kc1dpZHRoLmluaXRSZWFkb25seUJpbmQodGhpcy5fYm91bmRzV2lkdGhTZXR0ZXIpO1xuICAgICAgICAgICAgdGhpcy5fYm91bmRzSGVpZ2h0LmluaXRSZWFkb25seUJpbmQodGhpcy5fYm91bmRzSGVpZ2h0U2V0dGVyKTtcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kc0xlZnQuaW5pdFJlYWRvbmx5QmluZCh0aGlzLl9ib3VuZHNMZWZ0U2V0dGVyKTtcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kc1RvcC5pbml0UmVhZG9ubHlCaW5kKHRoaXMuX2JvdW5kc1RvcFNldHRlcik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIFRPRE8gcmVwbGFjZSBldmVudCBoYW5kbGluZyBtZWNoYW5pc21cbiAgICAgICAgICAgIC8vRE9NLnNldEV2ZW50TGlzdGVuZXIoZ2V0RWxlbWVudCgpLCBuYXRpdmVFdmVudExpc3RlbmVyKTtcbiAgICAgICAgICAgIC8vIHNpbmtpbmcgYWxsIHRoZSBldmVudHNcbiAgICAgICAgICAgIC8vRE9NLnNpbmtFdmVudHMoZ2V0RWxlbWVudCgpLCAtMSk7XG5cbiAgICAgICAgICAgIHRoaXMuX29uTW91c2VFbnRlci5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5faG92ZXJlZFNldHRlci52YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX29uTW91c2VMZWF2ZS5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5faG92ZXJlZFNldHRlci52YWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9vbk1vdXNlRG93bi5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJlc3NlZFNldHRlci52YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX29uTW91c2VVcC5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJlc3NlZFNldHRlci52YWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGludm9rZVBvc3RDb25zdHJ1Y3QoKSB7XG4gICAgICAgICAgICB0aGlzLl9wb3N0Q29uc3RydWN0UnVuT25jZS5ydW4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBwb3N0Q29uc3RydWN0KCkge1xuXG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc2V0Q3ViZWVQYW5lbChjdWJlZVBhbmVsOiBDdWJlZVBhbmVsKSB7XG4gICAgICAgICAgICB0aGlzLl9jdWJlZVBhbmVsID0gY3ViZWVQYW5lbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldEN1YmVlUGFuZWwoKTogQ3ViZWVQYW5lbCB7XG4gICAgICAgICAgICBpZiAodGhpcy5fY3ViZWVQYW5lbCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2N1YmVlUGFuZWw7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0Q3ViZWVQYW5lbCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgdXBkYXRlVHJhbnNmb3JtKCkge1xuICAgICAgICAgICAgdmFyIGFuZ2xlID0gdGhpcy5fcm90YXRlLnZhbHVlO1xuICAgICAgICAgICAgYW5nbGUgPSBhbmdsZSAtIChhbmdsZSB8IDApO1xuICAgICAgICAgICAgYW5nbGUgPSBhbmdsZSAqIDM2MDtcbiAgICAgICAgICAgIHZhciBhbmdsZVN0ciA9IGFuZ2xlICsgXCJkZWdcIjtcblxuICAgICAgICAgICAgdmFyIGNlbnRlclggPSAodGhpcy5fdHJhbnNmb3JtQ2VudGVyWC52YWx1ZSAqIDEwMCkgKyBcIiVcIjtcbiAgICAgICAgICAgIHZhciBjZW50ZXJZID0gKHRoaXMuX3RyYW5zZm9ybUNlbnRlclkudmFsdWUgKiAxMDApICsgXCIlXCI7XG5cbiAgICAgICAgICAgIHZhciBzWCA9IHRoaXMuX3NjYWxlWC52YWx1ZS50b1N0cmluZygpO1xuICAgICAgICAgICAgdmFyIHNZID0gdGhpcy5fc2NhbGVZLnZhbHVlLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gY2VudGVyWCArIFwiIFwiICsgY2VudGVyWTtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gXCJ0cmFuc2xhdGUoXCIgKyB0aGlzLl90cmFuc2xhdGVYLnZhbHVlICsgXCJweCwgXCIgKyB0aGlzLl90cmFuc2xhdGVZLnZhbHVlXG4gICAgICAgICAgICArIFwicHgpIHJvdGF0ZShcIiArIGFuZ2xlU3RyICsgXCIpIHNjYWxlWCggXCIgKyBzWCArIFwiKSBzY2FsZVkoXCIgKyBzWSArIFwiKVwiO1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5iYWNrZmFjZVZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVxdWVzdExheW91dCgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fbmVlZHNMYXlvdXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9uZWVkc0xheW91dCA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3BhcmVudCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcmVudC5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9jdWJlZVBhbmVsICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3ViZWVQYW5lbC5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgUG9wdXBzLl9yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbWVhc3VyZSgpIHtcbiAgICAgICAgICAgIHRoaXMub25NZWFzdXJlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIG9uTWVhc3VyZSgpIHtcbiAgICAgICAgICAgIC8vIGNhbGN1bGF0aW5nIGNsaWVudCBib3VuZHNcbiAgICAgICAgICAgIHZhciBjdyA9IHRoaXMuX2VsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgICAgICAgICB2YXIgY2ggPSB0aGlzLl9lbGVtZW50LmNsaWVudEhlaWdodDtcbiAgICAgICAgICAgIHZhciBwID0gdGhpcy5fcGFkZGluZy52YWx1ZTtcbiAgICAgICAgICAgIGlmIChwICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjdyA9IGN3IC0gcC5sZWZ0IC0gcC5yaWdodDtcbiAgICAgICAgICAgICAgICBjaCA9IGNoIC0gcC50b3AgLSBwLmJvdHRvbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2NsaWVudFdpZHRoU2V0dGVyLnZhbHVlID0gY3c7XG4gICAgICAgICAgICB0aGlzLl9jbGllbnRIZWlnaHRTZXR0ZXIudmFsdWUgPSBjaDtcblxuICAgICAgICAgICAgLy8gY2FsY3VsYXRpbmcgbWVhc3VyZWQgYm91bmRzXG4gICAgICAgICAgICB2YXIgbXcgPSB0aGlzLl9lbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICAgICAgdmFyIG1oID0gdGhpcy5fZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICB0aGlzLl9tZWFzdXJlZFdpZHRoU2V0dGVyLnZhbHVlID0gbXc7XG4gICAgICAgICAgICB0aGlzLl9tZWFzdXJlZEhlaWdodFNldHRlci52YWx1ZSA9IG1oO1xuXG4gICAgICAgICAgICAvLyBjYWxjdWxhdGluZyBwYXJlbnQgYm91bmRzXG4gICAgICAgICAgICB2YXIgdGN4ID0gdGhpcy5fdHJhbnNmb3JtQ2VudGVyWC52YWx1ZTtcbiAgICAgICAgICAgIHZhciB0Y3kgPSB0aGlzLl90cmFuc2Zvcm1DZW50ZXJZLnZhbHVlO1xuXG4gICAgICAgICAgICB2YXIgYnggPSAwO1xuICAgICAgICAgICAgdmFyIGJ5ID0gMDtcbiAgICAgICAgICAgIHZhciBidyA9IG13O1xuICAgICAgICAgICAgdmFyIGJoID0gbWg7XG5cbiAgICAgICAgICAgIHZhciB0bCA9IG5ldyBQb2ludDJEKDAsIDApO1xuICAgICAgICAgICAgdmFyIHRyID0gbmV3IFBvaW50MkQobXcsIDApO1xuICAgICAgICAgICAgdmFyIGJyID0gbmV3IFBvaW50MkQobXcsIG1oKTtcbiAgICAgICAgICAgIHZhciBibCA9IG5ldyBQb2ludDJEKDAsIG1oKTtcblxuICAgICAgICAgICAgdmFyIGN4ID0gKG13ICogdGN4KSB8IDA7XG4gICAgICAgICAgICB2YXIgY3kgPSAobWggKiB0Y3kpIHwgMDtcblxuICAgICAgICAgICAgdmFyIHJvdCA9IHRoaXMuX3JvdGF0ZS52YWx1ZTtcbiAgICAgICAgICAgIGlmIChyb3QgIT0gMC4wKSB7XG4gICAgICAgICAgICAgICAgdGwgPSB0aGlzLnJvdGF0ZVBvaW50KGN4LCBjeSwgMCwgMCwgcm90KTtcbiAgICAgICAgICAgICAgICB0ciA9IHRoaXMucm90YXRlUG9pbnQoY3gsIGN5LCBidywgMCwgcm90KTtcbiAgICAgICAgICAgICAgICBiciA9IHRoaXMucm90YXRlUG9pbnQoY3gsIGN5LCBidywgYmgsIHJvdCk7XG4gICAgICAgICAgICAgICAgYmwgPSB0aGlzLnJvdGF0ZVBvaW50KGN4LCBjeSwgMCwgYmgsIHJvdCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzeCA9IHRoaXMuX3NjYWxlWC52YWx1ZTtcbiAgICAgICAgICAgIHZhciBzeSA9IHRoaXMuX3NjYWxlWS52YWx1ZTtcblxuICAgICAgICAgICAgaWYgKHN4ICE9IDEuMCB8fCBzeSAhPSAxLjApIHtcbiAgICAgICAgICAgICAgICB0bCA9IHRoaXMuc2NhbGVQb2ludChjeCwgY3ksIHRsLngsIHRsLnksIHN4LCBzeSk7XG4gICAgICAgICAgICAgICAgdHIgPSB0aGlzLnNjYWxlUG9pbnQoY3gsIGN5LCB0ci54LCB0ci55LCBzeCwgc3kpO1xuICAgICAgICAgICAgICAgIGJyID0gdGhpcy5zY2FsZVBvaW50KGN4LCBjeSwgYnIueCwgYnIueSwgc3gsIHN5KTtcbiAgICAgICAgICAgICAgICBibCA9IHRoaXMuc2NhbGVQb2ludChjeCwgY3ksIGJsLngsIGJsLnksIHN4LCBzeSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBtaW5YID0gTWF0aC5taW4oTWF0aC5taW4odGwueCwgdHIueCksIE1hdGgubWluKGJyLngsIGJsLngpKTtcbiAgICAgICAgICAgIHZhciBtaW5ZID0gTWF0aC5taW4oTWF0aC5taW4odGwueSwgdHIueSksIE1hdGgubWluKGJyLnksIGJsLnkpKTtcbiAgICAgICAgICAgIHZhciBtYXhYID0gTWF0aC5tYXgoTWF0aC5tYXgodGwueCwgdHIueCksIE1hdGgubWF4KGJyLngsIGJsLngpKTtcbiAgICAgICAgICAgIHZhciBtYXhZID0gTWF0aC5tYXgoTWF0aC5tYXgodGwueSwgdHIueSksIE1hdGgubWF4KGJyLnksIGJsLnkpKTtcbiAgICAgICAgICAgIGJ3ID0gbWF4WCAtIG1pblg7XG4gICAgICAgICAgICBiaCA9IG1heFkgLSBtaW5ZO1xuICAgICAgICAgICAgYnggPSBtaW5YO1xuICAgICAgICAgICAgYnkgPSBtaW5ZO1xuXG4gICAgICAgICAgICB0aGlzLl9ib3VuZHNMZWZ0U2V0dGVyLnZhbHVlID0gYng7XG4gICAgICAgICAgICB0aGlzLl9ib3VuZHNUb3BTZXR0ZXIudmFsdWUgPSBieTtcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kc1dpZHRoU2V0dGVyLnZhbHVlID0gYnc7XG4gICAgICAgICAgICB0aGlzLl9ib3VuZHNIZWlnaHRTZXR0ZXIudmFsdWUgPSBiaDtcbiAgICAgICAgfVxuXG4gICAgICAgIHNjYWxlUG9pbnQoY2VudGVyWDogbnVtYmVyLCBjZW50ZXJZOiBudW1iZXIsIHBvaW50WDogbnVtYmVyLCBwb2ludFk6IG51bWJlciwgc2NhbGVYOiBudW1iZXIsIHNjYWxlWTogbnVtYmVyKSB7XG4gICAgICAgICAgICB2YXIgcmVzWCA9IChjZW50ZXJYICsgKChwb2ludFggLSBjZW50ZXJYKSAqIHNjYWxlWCkpIHwgMDtcbiAgICAgICAgICAgIHZhciByZXNZID0gKGNlbnRlclkgKyAoKHBvaW50WSAtIGNlbnRlclkpICogc2NhbGVZKSkgfCAwO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQb2ludDJEKHJlc1gsIHJlc1kpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSByb3RhdGVQb2ludChjeDogbnVtYmVyLCBjeTogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlciwgYW5nbGU6IG51bWJlcikge1xuICAgICAgICAgICAgYW5nbGUgPSAoYW5nbGUgKiAzNjApICogKE1hdGguUEkgLyAxODApO1xuICAgICAgICAgICAgeCA9IHggLSBjeDtcbiAgICAgICAgICAgIHkgPSB5IC0gY3k7XG4gICAgICAgICAgICB2YXIgc2luID0gTWF0aC5zaW4oYW5nbGUpO1xuICAgICAgICAgICAgdmFyIGNvcyA9IE1hdGguY29zKGFuZ2xlKTtcbiAgICAgICAgICAgIHZhciByeCA9ICgoY29zICogeCkgLSAoc2luICogeSkpIHwgMDtcbiAgICAgICAgICAgIHZhciByeSA9ICgoc2luICogeCkgKyAoY29zICogeSkpIHwgMDtcbiAgICAgICAgICAgIHJ4ID0gcnggKyBjeDtcbiAgICAgICAgICAgIHJ5ID0gcnkgKyBjeTtcblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQb2ludDJEKHJ4LCByeSk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgZWxlbWVudCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9lbGVtZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHBhcmVudCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgX3NldFBhcmVudChwYXJlbnQ6IEFMYXlvdXQpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxheW91dCgpIHtcbiAgICAgICAgICAgIHRoaXMuX25lZWRzTGF5b3V0ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLm1lYXN1cmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBuZWVkc0xheW91dCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9uZWVkc0xheW91dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUcmFuc2xhdGVYKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0ZVg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRyYW5zbGF0ZVgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UcmFuc2xhdGVYLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0cmFuc2xhdGVYKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRyYW5zbGF0ZVgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUcmFuc2xhdGVZKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0ZVk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRyYW5zbGF0ZVkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UcmFuc2xhdGVZLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0cmFuc2xhdGVZKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRyYW5zbGF0ZVkudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgXG5cbiAgICAgICAgLy9cdHB1YmxpYyBmaW5hbCBEb3VibGVQcm9wZXJ0eSByb3RhdGVQcm9wZXJ0eSgpIHtcbiAgICAgICAgLy9cdFx0cmV0dXJuIHJvdGF0ZTtcbiAgICAgICAgLy9cdH1cbiAgICAgICAgLy9cbiAgICAgICAgLy9cdHB1YmxpYyBmaW5hbCBEb3VibGVQcm9wZXJ0eSBzY2FsZVhQcm9wZXJ0eSgpIHtcbiAgICAgICAgLy9cdFx0cmV0dXJuIHNjYWxlWDtcbiAgICAgICAgLy9cdH1cbiAgICAgICAgLy9cbiAgICAgICAgLy9cdHB1YmxpYyBmaW5hbCBEb3VibGVQcm9wZXJ0eSBzY2FsZVlQcm9wZXJ0eSgpIHtcbiAgICAgICAgLy9cdFx0cmV0dXJuIHNjYWxlWTtcbiAgICAgICAgLy9cdH1cbiAgICAgICAgLy9cbiAgICAgICAgLy9cdHB1YmxpYyBmaW5hbCBEb3VibGVQcm9wZXJ0eSB0cmFuc2Zvcm1DZW50ZXJYUHJvcGVydHkoKSB7XG4gICAgICAgIC8vXHRcdHJldHVybiB0cmFuc2Zvcm1DZW50ZXJYO1xuICAgICAgICAvL1x0fVxuICAgICAgICAvL1xuICAgICAgICAvL1x0cHVibGljIGZpbmFsIERvdWJsZVByb3BlcnR5IHRyYW5zZm9ybUNlbnRlcllQcm9wZXJ0eSgpIHtcbiAgICAgICAgLy9cdFx0cmV0dXJuIHRyYW5zZm9ybUNlbnRlclk7XG4gICAgICAgIC8vXHR9XG4gICAgICAgIFxuICAgICAgICBnZXQgUGFkZGluZygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYWRkaW5nO1xuICAgICAgICB9XG4gICAgICAgIGdldCBwYWRkaW5nKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuUGFkZGluZy52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgcGFkZGluZyh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5QYWRkaW5nLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm9yZGVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvcmRlcjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm9yZGVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm9yZGVyLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBib3JkZXIodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQm9yZGVyLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgTWVhc3VyZWRXaWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tZWFzdXJlZFdpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGdldCBtZWFzdXJlZFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuTWVhc3VyZWRXaWR0aC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgbWVhc3VyZWRXaWR0aCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5NZWFzdXJlZFdpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgTWVhc3VyZWRIZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbWVhc3VyZWRIZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IG1lYXN1cmVkSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuTWVhc3VyZWRIZWlnaHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IG1lYXN1cmVkSGVpZ2h0KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLk1lYXN1cmVkSGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQ2xpZW50V2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2xpZW50V2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGNsaWVudFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQ2xpZW50V2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGNsaWVudFdpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkNsaWVudFdpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQ2xpZW50SGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NsaWVudEhlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgY2xpZW50SGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQ2xpZW50SGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBjbGllbnRIZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQ2xpZW50SGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm91bmRzV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYm91bmRzV2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJvdW5kc1dpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm91bmRzV2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGJvdW5kc1dpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkJvdW5kc1dpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm91bmRzSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvdW5kc0hlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm91bmRzSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm91bmRzSGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBib3VuZHNIZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQm91bmRzSGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm91bmRzTGVmdCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib3VuZHNMZWZ0O1xuICAgICAgICB9XG4gICAgICAgIGdldCBib3VuZHNMZWZ0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm91bmRzTGVmdC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYm91bmRzTGVmdCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Cb3VuZHNMZWZ0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm91bmRzVG9wKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvdW5kc1RvcDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm91bmRzVG9wKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm91bmRzVG9wLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBib3VuZHNUb3AodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQm91bmRzVG9wLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgTWluV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbWluV2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IG1pbldJZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuTWluV2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IG1pbldJZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLk1pbldpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgTWluSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21pbkhlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgbWluSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuTWluSGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBtaW5IZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuTWluSGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgTWF4V2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbWF4V2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IG1heFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuTWF4V2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IG1heFdpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLk1heFdpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgTWF4SGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21heEhlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgbWF4SGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuTWF4SGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBtYXhIZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuTWF4SGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0cyB0aGUgYmFzZSBwb3NpdGlvbiBvZiB0aGlzIGNvbXBvbmVudCByZWxhdGl2ZSB0byB0aGUgcGFyZW50J3MgdG9wLWxlZnQgY29ybmVyLiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgZnJvbSBhXG4gICAgICAgICAqIGxheW91dCdzIG9uTGF5b3V0IG1ldGhvZCB0byBzZXQgdGhlIGJhc2UgcG9zaXRpb24gb2YgdGhpcyBjb21wb25lbnQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBsZWZ0IFRoZSBsZWZ0IGJhc2UgcG9zaXRpb24gb2YgdGhpcyBjb21wb25lbnQgcmVsYXRpdmUgdG8gdGhlIHBhcmVudHMgdG9wLWxlZnQgY29ybmVyLlxuICAgICAgICAgKiBAcGFyYW0gdG9wIFRoZSB0b3AgYmFzZSBwb3NpdGlvbiBvZiB0aGlzIGNvbXBvbmVudCByZWxhdGl2ZSB0byB0aGUgcGFyZW50cyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqL1xuICAgICAgICBwcm90ZWN0ZWQgc2V0UG9zaXRpb24obGVmdDogbnVtYmVyLCB0b3A6IG51bWJlcikge1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5sZWZ0ID0gXCJcIiArIGxlZnQgKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnRvcCA9IFwiXCIgKyB0b3AgKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLl9sZWZ0ID0gbGVmdDtcbiAgICAgICAgICAgIHRoaXMuX3RvcCA9IHRvcDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIHRoZSBiYXNlIGxlZnQgcG9zaXRpb24gb2YgdGhpcyBjb21wb25lbnQgcmVsYXRpdmUgdG8gdGhlIHBhcmVudCdzIHRvcC1sZWZ0IGNvcm5lci4gVGhpcyBtZXRob2QgaXMgY2FsbGVkXG4gICAgICAgICAqIGZyb20gYSBsYXlvdXQncyBvbkxheW91dCBtZXRob2QgdG8gc2V0IHRoZSBiYXNlIGxlZnQgcG9zaXRpb24gb2YgdGhpcyBjb21wb25lbnQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBsZWZ0IFRoZSBsZWZ0IGJhc2UgcG9zaXRpb24gb2YgdGhpcyBjb21wb25lbnQgcmVsYXRpdmUgdG8gdGhlIHBhcmVudHMgdG9wLWxlZnQgY29ybmVyLlxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIF9zZXRMZWZ0KGxlZnQ6IG51bWJlcikge1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5sZWZ0ID0gXCJcIiArIGxlZnQgKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLl9sZWZ0ID0gbGVmdDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIHRoZSBiYXNlIHRvcCBwb3NpdGlvbiBvZiB0aGlzIGNvbXBvbmVudCByZWxhdGl2ZSB0byB0aGUgcGFyZW50J3MgdG9wLWxlZnQgY29ybmVyLiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgZnJvbVxuICAgICAgICAgKiBhIGxheW91dCdzIG9uTGF5b3V0IG1ldGhvZCB0byBzZXQgdGhlIGJhc2UgdG9wIHBvc2l0aW9uIG9mIHRoaXMgY29tcG9uZW50LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gdG9wIFRoZSB0b3AgYmFzZSBwb3NpdGlvbiBvZiB0aGlzIGNvbXBvbmVudCByZWxhdGl2ZSB0byB0aGUgcGFyZW50cyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgX3NldFRvcCh0b3A6IG51bWJlcikge1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS50b3AgPSBcIlwiICsgdG9wICsgXCJweFwiO1xuICAgICAgICAgICAgdGhpcy5fdG9wID0gdG9wO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgdGhlIHNpemUgb2YgdGhpcyBjb21wb25lbnQuIFRoaXMgbWV0aG9kIGNhbiBiZSBjYWxsZWQgd2hlbiBhIGR5bmFtaWNhbGx5IHNpemVkIGNvbXBvbmVudCdzIHNpemUgaXNcbiAgICAgICAgICogY2FsY3VsYXRlZC4gVHlwaWNhbGx5IGZyb20gdGhlIG9uTGF5b3V0IG1ldGhvZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHdpZHRoIFRoZSB3aWR0aCBvZiB0aGlzIGNvbXBvbmVudC5cbiAgICAgICAgICogQHBhcmFtIGhlaWdodCBUaGUgaGVpZ2h0IG9mIHRoaXMgY29tcG9uZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgcHJvdGVjdGVkIHNldFNpemUod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUud2lkdGggPSBcIlwiICsgd2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLmhlaWdodCA9IFwiXCIgKyBoZWlnaHQgKyBcInB4XCI7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQ3Vyc29yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnNvcjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgY3Vyc29yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQ3Vyc29yLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBjdXJzb3IodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQ3Vyc29yLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgUG9pbnRlclRyYW5zcGFyZW50KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BvaW50ZXJUcmFuc3BhcmVudDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgcG9pbnRlclRyYW5zcGFyZW50KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuUG9pbnRlclRyYW5zcGFyZW50LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBwb2ludGVyVHJhbnNwYXJlbnQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuUG9pbnRlclRyYW5zcGFyZW50LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgVmlzaWJsZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92aXNpYmxlO1xuICAgICAgICB9XG4gICAgICAgIGdldCB2aXNpYmxlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuVmlzaWJsZS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgdmlzaWJsZSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5WaXNpYmxlLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgb25DbGljaygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbkNsaWNrO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IG9uQ29udGV4dE1lbnUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25Db250ZXh0TWVudTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBvbk1vdXNlRG93bigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbk1vdXNlRG93bjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBvbk1vdXNlTW92ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbk1vdXNlTW92ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBvbk1vdXNlVXAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25Nb3VzZVVwO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IG9uTW91c2VFbnRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbk1vdXNlRW50ZXI7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgb25Nb3VzZUxlYXZlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX29uTW91c2VMZWF2ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBvbk1vdXNlV2hlZWwoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25Nb3VzZVdoZWVsO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IG9uS2V5RG93bigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbktleURvd247XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgb25LZXlQcmVzcygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbktleVByZXNzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IG9uS2V5VXAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25LZXlVcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBvblBhcmVudENoYW5nZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25QYXJlbnRDaGFuZ2VkO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEFscGhhKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FscGhhO1xuICAgICAgICB9XG4gICAgICAgIGdldCBhbHBoYSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkFscGhhLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBhbHBoYSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5BbHBoYS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEhhbmRsZVBvaW50ZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGFuZGxlUG9pbnRlcjtcbiAgICAgICAgfVxuICAgICAgICBnZXQgaGFuZGxlUG9pbnRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkhhbmRsZVBvaW50ZXIudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGhhbmRsZVBvaW50ZXIodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuSGFuZGxlUG9pbnRlci52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEVuYWJsZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZW5hYmxlZDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgZW5hYmxlZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkVuYWJsZWQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGVuYWJsZWQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuRW5hYmxlZC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFNlbGVjdGFibGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0YWJsZTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgc2VsZWN0YWJsZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlNlbGVjdGFibGUudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHNlbGVjdGFibGUodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0YWJsZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cblxuICAgICAgICBnZXQgbGVmdCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sZWZ0O1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHRvcCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90b3A7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIGJ5IHRoZSBwYXJlbnQgb2YgdGhpcyBjb21wb25lbnQgd2hlbiBhIHBvaW50ZXIgZXZlbnQgaXMgb2NjdXJlZC4gVGhlIGdvYWwgb2YgdGhpcyBtZXRob2QgaXNcbiAgICAgICAgICogdG8gZGVjaWRlIGlmIHRoaXMgY29tcG9uZW50IHdhbnRzIHRvIGhhbmRsZSB0aGUgZXZlbnQgb3Igbm90LCBhbmQgZGVsZWdhdGUgdGhlIGV2ZW50IHRvIGNoaWxkIGNvbXBvbmVudHMgaWZcbiAgICAgICAgICogbmVlZGVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gc2NyZWVuWCBUaGUgeCBjb29yZGluYXRlIG9mIHRoZSBwb2ludGVyIHJlbGF0aXZlIHRvIHRoZSBzY3JlZW4ncyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqIEBwYXJhbSBzY3JlZW5ZIFRoZSB5IGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50ZXIgcmVsYXRpdmUgdG8gdGhlIHNjcmVlbidzIHRvcC1sZWZ0IGNvcm5lci5cbiAgICAgICAgICogQHBhcmFtIHBhcmVudFNjcmVlblggVGhlIHggY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnRlciByZWxhdGl2ZSB0byB0aGUgcGFyZW50J3MgdG9wLWxlZnQgY29ybmVyLlxuICAgICAgICAgKiBAcGFyYW0gcGFyZW50U2NyZWVuWSBUaGUgeSBjb29yZGluYXRlIG9mIHRoZSBwb2ludGVyIHJlbGF0aXZlIHRvIHRoZSBwYXJlbnQncyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqIEBwYXJhbSB4IFRoZSB4IGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50ZXIgcmVsYXRpdmUgdG8gdGhpcyBjb21wb25lbnQncyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqIEBwYXJhbSB5IFRoZSB5IGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50ZXIgcmVsYXRpdmUgdG8gdGhpcyBjb21wb25lbnQncyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqIEBwYXJhbSB3aGVlbFZlbG9jaXR5IFRoZSBtb3VzZSB3aGVlbCB2ZWxvY2l0eSB2YWx1ZS5cbiAgICAgICAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgdGhlIGV2ZW50LiBWYWxpZCB2YWx1ZXMgYXJlIGxpc3RlZCBpbiBQb2ludGVyRXZlbnRBcmdzIGNsYXNzLlxuICAgICAgICAgKiBAcGFyYW0gYWx0UHJlc3NlZCBJbmRpY2F0ZXMgaWYgdGhlIGFsdCBrZXkgaXMgcHJlc3NlZCB3aGVuIHRoZSBldmVudCBvY2N1cmVkIG9yIG5vdC5cbiAgICAgICAgICogQHBhcmFtIGN0cmxQcmVzc2VkIEluZGljYXRlcyBpZiB0aGUgY3RybCBrZXkgaXMgcHJlc3NlZCB3aGVuIHRoZSBldmVudCBvY2N1cmVkIG9yIG5vdC5cbiAgICAgICAgICogQHBhcmFtIHNoaWZ0UHJlc3NlZCBJbmRpY2F0ZXMgaWYgdGhlIHNoaWZ0IGtleSBpcyBwcmVzc2VkIHdoZW4gdGhlIGV2ZW50IG9jY3VyZWQgb3Igbm90LlxuICAgICAgICAgKiBAcGFyYW0gbWV0YVByZXNzZWQgSW5kaWNhdGVzIGlmIHRoZSBtZXRhIGtleSBpcyBwcmVzc2VkIHdoZW4gdGhlIGV2ZW50IG9jY3VyZWQgb3Igbm90LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIFRydWUgaWYgdGhlIGV2ZW50IGlzIGZ1bGx5IGhhbmRsZWQgYW5kIHVuZGVybGF5aW5nIGNvbXBvbmVudHMgY2FuJ3QgaGFuZGxlIHRoaXMgZXZlbnQsIG90aGVyd2lzZSBmYWxzZSBpZlxuICAgICAgICAgKiB1bmRlcmxheWluZyBjb21wb25lbnRzIGNhbiBoYW5kbGUgdGhpcyBldmVudC5cbiAgICAgICAgICovXG4gICAgICAgIF9kb1BvaW50ZXJFdmVudENsaW1iaW5nVXAoc2NyZWVuWDogbnVtYmVyLCBzY3JlZW5ZOiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyLCB3aGVlbFZlbG9jaXR5OiBudW1iZXIsXG4gICAgICAgICAgICBhbHRQcmVzc2VkOiBib29sZWFuLCBjdHJsUHJlc3NlZDogYm9vbGVhbiwgc2hpZnRQcmVzc2VkOiBib29sZWFuLCBtZXRhUHJlc3NlZDogYm9vbGVhblxuICAgICAgICAgICAgLCBldmVudFR5cGU6IG51bWJlciwgYnV0dG9uOiBudW1iZXIsIG5hdGl2ZUV2ZW50OiBVSUV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2hhbmRsZVBvaW50ZXIudmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5fcG9pbnRlclRyYW5zcGFyZW50LnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuX2VuYWJsZWQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdGhpcy5fdmlzaWJsZS52YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMub25Qb2ludGVyRXZlbnRDbGltYmluZ1VwKHNjcmVlblgsIHNjcmVlblksIHgsIHksIHdoZWVsVmVsb2NpdHksIGFsdFByZXNzZWQsXG4gICAgICAgICAgICAgICAgY3RybFByZXNzZWQsIHNoaWZ0UHJlc3NlZCwgbWV0YVByZXNzZWQsIGV2ZW50VHlwZSwgYnV0dG9uKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9uUG9pbnRlckV2ZW50RmFsbGluZ0Rvd24oc2NyZWVuWCwgc2NyZWVuWSwgeCwgeSwgd2hlZWxWZWxvY2l0eSwgYWx0UHJlc3NlZCxcbiAgICAgICAgICAgICAgICBjdHJsUHJlc3NlZCwgc2hpZnRQcmVzc2VkLCBtZXRhUHJlc3NlZCwgZXZlbnRUeXBlLCBidXR0b24sIG5hdGl2ZUV2ZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vXHRib29sZWFuIGRvUG9pbnRlckV2ZW50RmFsbGluZ0Rvd24oaW50IHNjcmVlblgsIGludCBzY3JlZW5ZLCBpbnQgcGFyZW50U2NyZWVuWCwgaW50IHBhcmVudFNjcmVlblksXG4gICAgICAgIC8vXHRcdFx0aW50IHgsIGludCB5LCBpbnQgd2hlZWxWZWxvY2l0eSwgYm9vbGVhbiBhbHRQcmVzc2VkLCBib29sZWFuIGN0cmxQcmVzc2VkLCBib29sZWFuIHNoaWZ0UHJlc3NlZCxcbiAgICAgICAgLy9cdFx0XHRib29sZWFuIG1ldGFQcmVzc2VkLCBpbnQgdHlwZSkge1xuICAgICAgICAvL1x0XHRyZXR1cm4gb25Qb2ludGVyRXZlbnRGYWxsaW5nRG93bihzY3JlZW5YLCBzY3JlZW5ZLCBwYXJlbnRTY3JlZW5YLCBwYXJlbnRTY3JlZW5ZLCB4LCB5LCB3aGVlbFZlbG9jaXR5LCBhbHRQcmVzc2VkLFxuICAgICAgICAvL1x0XHRcdFx0Y3RybFByZXNzZWQsIHNoaWZ0UHJlc3NlZCwgbWV0YVByZXNzZWQsIHR5cGUpO1xuICAgICAgICAvL1x0fVxuICAgICAgICAvKipcbiAgICAgICAgICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIHdoZW4gYSBwb2ludGVyIGV2ZW50IGlzIGNsaW1iaW5nIHVwIG9uIHRoZSBjb21wb25lbnQgaGllcmFyY2h5LiBUaGUgZ29hbCBvZiB0aGlzIG1ldGhvZCBpc1xuICAgICAgICAgKiB0byBkZWNpZGUgaWYgdGhlIGV2ZW50IGNhbiByZWFjaCBjaGlsZCBjb21wb25lbnRzIG9yIG5vdC4gSW4gdGhlIG1vc3Qgb2YgdGhlIGNhc2VzIHlvdSBkb24ndCBuZWVkIHRvIG92ZXJ3cml0ZVxuICAgICAgICAgKiB0aGlzIG1ldGhvZC4gVGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gaXMgcmV0dXJucyB0cnVlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gc2NyZWVuWCBUaGUgeCBjb29yZGluYXRlIG9mIHRoZSBwb2ludGVyIHJlbGF0aXZlIHRvIHRoZSBzY3JlZW4ncyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqIEBwYXJhbSBzY3JlZW5ZIFRoZSB5IGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50ZXIgcmVsYXRpdmUgdG8gdGhlIHNjcmVlbidzIHRvcC1sZWZ0IGNvcm5lci5cbiAgICAgICAgICogQHBhcmFtIHggVGhlIHggY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnRlciByZWxhdGl2ZSB0byB0aGlzIGNvbXBvbmVudCdzIHRvcC1sZWZ0IGNvcm5lci5cbiAgICAgICAgICogQHBhcmFtIHkgVGhlIHkgY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnRlciByZWxhdGl2ZSB0byB0aGlzIGNvbXBvbmVudCdzIHRvcC1sZWZ0IGNvcm5lci5cbiAgICAgICAgICogQHBhcmFtIHdoZWVsVmVsb2NpdHkgVGhlIG1vdXNlIHdoZWVsIHZlbG9jaXR5IHZhbHVlLlxuICAgICAgICAgKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSBvZiB0aGUgZXZlbnQuIFZhbGlkIHZhbHVlcyBhcmUgbGlzdGVkIGluIFBvaW50ZXJFdmVudEFyZ3MgY2xhc3MuXG4gICAgICAgICAqIEBwYXJhbSBhbHRQcmVzc2VkIEluZGljYXRlcyBpZiB0aGUgYWx0IGtleSBpcyBwcmVzc2VkIHdoZW4gdGhlIGV2ZW50IG9jY3VyZWQgb3Igbm90LlxuICAgICAgICAgKiBAcGFyYW0gY3RybFByZXNzZWQgSW5kaWNhdGVzIGlmIHRoZSBjdHJsIGtleSBpcyBwcmVzc2VkIHdoZW4gdGhlIGV2ZW50IG9jY3VyZWQgb3Igbm90LlxuICAgICAgICAgKiBAcGFyYW0gc2hpZnRQcmVzc2VkIEluZGljYXRlcyBpZiB0aGUgc2hpZnQga2V5IGlzIHByZXNzZWQgd2hlbiB0aGUgZXZlbnQgb2NjdXJlZCBvciBub3QuXG4gICAgICAgICAqIEBwYXJhbSBtZXRhUHJlc3NlZCBJbmRpY2F0ZXMgaWYgdGhlIG1ldGEga2V5IGlzIHByZXNzZWQgd2hlbiB0aGUgZXZlbnQgb2NjdXJlZCBvciBub3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4gRmFsc2UgaWYgdGhpcyBldmVudCBjYW4ndCByZWFjaCBvdmVybGF5aW5nIGNvbXBvbmVudHMsIG9yIHRydWUgaWYgb3ZlcmxheWluZyBjb21wb25lbnRzIGNhbiBhbHNvIGdldCB0aGVcbiAgICAgICAgICogY2xpbWJpbmcgdXAgZXZlbnQuXG4gICAgICAgICAqL1xuICAgICAgICBwcm90ZWN0ZWQgb25Qb2ludGVyRXZlbnRDbGltYmluZ1VwKHNjcmVlblg6IG51bWJlciwgc2NyZWVuWTogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlciwgd2hlZWxWZWxvY2l0eTogbnVtYmVyLFxuICAgICAgICAgICAgYWx0UHJlc3NlZDogYm9vbGVhbiwgY3RybFByZXNzZWQ6IGJvb2xlYW4sIHNoaWZ0UHJlc3NlZDogYm9vbGVhbiwgbWV0YVByZXNzZWQ6IGJvb2xlYW5cbiAgICAgICAgICAgICwgZXZlbnRUeXBlOiBudW1iZXIsIGJ1dHRvbjogbnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgd2hlbiBhIHBvaW50ZXIgZXZlbnQgaXMgZmFsbGluZyBkb3duIG9uIHRoZSBjb21wb25lbnQgaGllcmFyY2h5LiBUaGUgZ29hbCBvZiB0aGlzIG1ldGhvZCBpc1xuICAgICAgICAgKiB0byBmaXJlIGV2ZW50cyBpZiBuZWVkZWQsIGFuZCBpbiB0aGUgcmVzdWx0IHR5cGUgZGVmaW5lIGlmIHRoZSB1bmRlcmxheWluZyBjb21wb25lbnRzIGNhbiBwcm9jZXNzIHRoaXMgZXZlbnQgdG9vLlxuICAgICAgICAgKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBpcyBmaXJlcyB0aGUgYXNzb2NpYXRlZCBldmVudCwgYW5kIHJldHVybnMgdHJ1ZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHNjcmVlblggVGhlIHggY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnRlciByZWxhdGl2ZSB0byB0aGUgc2NyZWVuJ3MgdG9wLWxlZnQgY29ybmVyLlxuICAgICAgICAgKiBAcGFyYW0gc2NyZWVuWSBUaGUgeSBjb29yZGluYXRlIG9mIHRoZSBwb2ludGVyIHJlbGF0aXZlIHRvIHRoZSBzY3JlZW4ncyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqIEBwYXJhbSB4IFRoZSB4IGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50ZXIgcmVsYXRpdmUgdG8gdGhpcyBjb21wb25lbnQncyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqIEBwYXJhbSB5IFRoZSB5IGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50ZXIgcmVsYXRpdmUgdG8gdGhpcyBjb21wb25lbnQncyB0b3AtbGVmdCBjb3JuZXIuXG4gICAgICAgICAqIEBwYXJhbSB3aGVlbFZlbG9jaXR5IFRoZSBtb3VzZSB3aGVlbCB2ZWxvY2l0eSB2YWx1ZS5cbiAgICAgICAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgdGhlIGV2ZW50LiBWYWxpZCB2YWx1ZXMgYXJlIGxpc3RlZCBpbiBQb2ludGVyRXZlbnRBcmdzIGNsYXNzLlxuICAgICAgICAgKiBAcGFyYW0gYWx0UHJlc3NlZCBJbmRpY2F0ZXMgaWYgdGhlIGFsdCBrZXkgaXMgcHJlc3NlZCB3aGVuIHRoZSBldmVudCBvY2N1cmVkIG9yIG5vdC5cbiAgICAgICAgICogQHBhcmFtIGN0cmxQcmVzc2VkIEluZGljYXRlcyBpZiB0aGUgY3RybCBrZXkgaXMgcHJlc3NlZCB3aGVuIHRoZSBldmVudCBvY2N1cmVkIG9yIG5vdC5cbiAgICAgICAgICogQHBhcmFtIHNoaWZ0UHJlc3NlZCBJbmRpY2F0ZXMgaWYgdGhlIHNoaWZ0IGtleSBpcyBwcmVzc2VkIHdoZW4gdGhlIGV2ZW50IG9jY3VyZWQgb3Igbm90LlxuICAgICAgICAgKiBAcGFyYW0gbWV0YVByZXNzZWQgSW5kaWNhdGVzIGlmIHRoZSBtZXRhIGtleSBpcyBwcmVzc2VkIHdoZW4gdGhlIGV2ZW50IG9jY3VyZWQgb3Igbm90LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIFRydWUgaWYgdGhpcyBldmVudCBpcyBmdWxseSBwcm9jZXNzZWQsIGFuZCB1bmRlcmxheWluZyBjb21wb25lbnRzIGNhbid0IHByb2Nlc3MgdGhpcyBldmVudCwgb3IgZmFsc2UgaWZcbiAgICAgICAgICogdW5kZXJsYXlpbmcgY29tcG9uZW50cyBjYW4gYWxzbyBnZXQgdGhlIGZhbGxpbmcgZG93biBldmVudC5cbiAgICAgICAgICovXG4gICAgICAgIHByb3RlY3RlZCBvblBvaW50ZXJFdmVudEZhbGxpbmdEb3duKHNjcmVlblg6IG51bWJlciwgc2NyZWVuWTogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlciwgd2hlZWxWZWxvY2l0eTogbnVtYmVyLFxuICAgICAgICAgICAgYWx0UHJlc3NlZDogYm9vbGVhbiwgY3RybFByZXNzZWQ6IGJvb2xlYW4sIHNoaWZ0UHJlc3NlZDogYm9vbGVhbiwgbWV0YVByZXNzZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICBldmVudFR5cGU6IG51bWJlciwgYnV0dG9uOiBudW1iZXIsIG5hdGl2ZUV2ZW50OiBVSUV2ZW50KSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGV2ZW50VHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgTW91c2VFdmVudFR5cGVzLk1PVVNFX0RPV046XG4gICAgICAgICAgICAgICAgICAgIHZhciBtZGVhID0gbmV3IE1vdXNlRG93bkV2ZW50QXJncyhzY3JlZW5YLCBzY3JlZW5ZLCB4LCB5LCBhbHRQcmVzc2VkLCBjdHJsUHJlc3NlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoaWZ0UHJlc3NlZCwgbWV0YVByZXNzZWQsIGJ1dHRvbiwgPE1vdXNlRXZlbnQ+bmF0aXZlRXZlbnQsIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICAvL3RoaXMucmVnaXN0ZXJEb3duRXZlbnQoc2NyZWVuWCwgc2NyZWVuWSwgeCwgeSwgYWx0UHJlc3NlZCwgY3RybFByZXNzZWQsIHNoaWZ0UHJlc3NlZCwgbWV0YVByZXNzZWQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbk1vdXNlRG93bi5maXJlRXZlbnQobWRlYSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgTW91c2VFdmVudFR5cGVzLk1PVVNFX01PVkU6XG4gICAgICAgICAgICAgICAgICAgIHZhciBtbWVhID0gbmV3IE1vdXNlTW92ZUV2ZW50QXJncyhzY3JlZW5YLCBzY3JlZW5ZLCB4LCB5LCBhbHRQcmVzc2VkLCBjdHJsUHJlc3NlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoaWZ0UHJlc3NlZCwgbWV0YVByZXNzZWQsIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbk1vdXNlTW92ZS5maXJlRXZlbnQobW1lYSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgTW91c2VFdmVudFR5cGVzLk1PVVNFX0VOVEVSOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbk1vdXNlRW50ZXIuZmlyZUV2ZW50KG5ldyBFdmVudEFyZ3ModGhpcykpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIE1vdXNlRXZlbnRUeXBlcy5NT1VTRV9MRUFWRTpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25Nb3VzZUxlYXZlLmZpcmVFdmVudChuZXcgRXZlbnRBcmdzKHRoaXMpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBNb3VzZUV2ZW50VHlwZXMuTU9VU0VfV0hFRUw6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29uTW91c2VXaGVlbC5maXJlRXZlbnQobmV3IE1vdXNlV2hlZWxFdmVudEFyZ3Mod2hlZWxWZWxvY2l0eSwgYWx0UHJlc3NlZCwgY3RybFByZXNzZWQsIHNoaWZ0UHJlc3NlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGFQcmVzc2VkLCB0aGlzKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAgICAgICAgcHJvdGVjdGVkIHJlZ2lzdGVyRG93bkV2ZW50KHNjcmVlblg6IG51bWJlciwgc2NyZWVuWTogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlcixcbiAgICAgICAgLy8gICAgICAgICAgICBhbHRQcmVzc2VkOiBib29sZWFuLCBjdHJsUHJlc3NlZDogYm9vbGVhbiwgc2hpZnRQcmVzc2VkOiBib29sZWFuLCBtZXRhUHJlc3NlZDogYm9vbGVhbikge1xuICAgICAgICAvLyAgICAgICAgICAgIEFDb21wb25lbnQubG9nUG9pbnRlckRvd25FdmVudChuZXcgTW91c2VEb3duRXZlbnRMb2codGhpcywgc2NyZWVuWCwgc2NyZWVuWSwgeCwgeSkpO1xuICAgICAgICAvLyAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbmRpY2F0ZXMgaWYgdGhpcyBjb21wb25lbnQgaXMgaW50ZXJzZWN0cyB0aGUgZ2l2ZW4gcG9pbnQuIFRoZSB4IGFuZCB5IGNvb3JkaW5hdGUgaXMgcmVsYXRpdmUgdG8gdGhlIHBhcmVudCdzXG4gICAgICAgICAqIHRvcC1sZWZ0IGNvb3JkaW5hdGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB4IFRoZSB4IGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50LlxuICAgICAgICAgKiBAcGFyYW0geSBUaGUgeSBjb29yZGluYXRlIG9mIHRoZSBwb2ludC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiBUcnVlIGlmIHRoaXMgY29tcG9uZW50IGlzIGludGVyc2VjdHMgdGhlIGdpdmVuIHBvaW50LCBvdGhlcndpc2UgZmFsc2UuXG4gICAgICAgICAqL1xuICAgICAgICBfaXNJbnRlcnNlY3RzUG9pbnQoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICAgICAgICAgIC8vIG1lYXN1cmVkIHBvc2l0aW9uc1xuICAgICAgICAgICAgdmFyIHgxID0gdGhpcy5fbGVmdCArIHRoaXMuX3RyYW5zbGF0ZVgudmFsdWU7XG4gICAgICAgICAgICB2YXIgeTEgPSB0aGlzLl90b3AgKyB0aGlzLl90cmFuc2xhdGVZLnZhbHVlO1xuICAgICAgICAgICAgdmFyIHgyID0geDEgKyB0aGlzLl9tZWFzdXJlZFdpZHRoLnZhbHVlO1xuICAgICAgICAgICAgdmFyIHkyID0geTE7XG4gICAgICAgICAgICB2YXIgeDMgPSB4MjtcbiAgICAgICAgICAgIHZhciB5MyA9IHkyICsgdGhpcy5fbWVhc3VyZWRIZWlnaHQudmFsdWU7XG4gICAgICAgICAgICB2YXIgeDQgPSB4MTtcbiAgICAgICAgICAgIHZhciB5NCA9IHkzO1xuXG4gICAgICAgICAgICAvLyBzY2FsZSBwb2ludHNcbiAgICAgICAgICAgIGlmICh0aGlzLl9zY2FsZVgudmFsdWUgIT0gMS4wKSB7XG4gICAgICAgICAgICAgICAgeDEgPSAoeDEgLSAoKHgyIC0geDEpICogdGhpcy5fdHJhbnNmb3JtQ2VudGVyWC52YWx1ZSAqIHRoaXMuX3NjYWxlWC52YWx1ZSkpIHwgMDtcbiAgICAgICAgICAgICAgICB4MiA9ICh4MSArICgoeDIgLSB4MSkgKiAoMSAtIHRoaXMuX3RyYW5zZm9ybUNlbnRlclgudmFsdWUpICogdGhpcy5fc2NhbGVYLnZhbHVlKSkgfCAwO1xuICAgICAgICAgICAgICAgIHgzID0geDI7XG4gICAgICAgICAgICAgICAgeDQgPSB4MTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLl9zY2FsZVkudmFsdWUgIT0gMS4wKSB7XG4gICAgICAgICAgICAgICAgeTEgPSAoeTEgLSAoKHkyIC0geTEpICogdGhpcy5fdHJhbnNmb3JtQ2VudGVyWS52YWx1ZSAqIHRoaXMuX3NjYWxlWS52YWx1ZSkpIHwgMDtcbiAgICAgICAgICAgICAgICB5NCA9ICh5NCArICgoeTQgLSB5MSkgKiAoMSAtIHRoaXMuX3RyYW5zZm9ybUNlbnRlclkudmFsdWUpICogdGhpcy5fc2NhbGVZLnZhbHVlKSkgfCAwO1xuICAgICAgICAgICAgICAgIHkyID0geTE7XG4gICAgICAgICAgICAgICAgeTMgPSB5NDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gcm90YXRlUG9pbnRzXG4gICAgICAgICAgICBpZiAodGhpcy5yb3RhdGUgIT0gMC4wKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJweCA9ICh4MSArICgoeDIgLSB4MSkgKiB0aGlzLnRyYW5zZm9ybUNlbnRlclgpKSB8IDA7XG4gICAgICAgICAgICAgICAgdmFyIHJweSA9ICh5MSArICgoeTQgLSB5MSkgKiB0aGlzLnRyYW5zZm9ybUNlbnRlclgpKSB8IDA7XG4gICAgICAgICAgICAgICAgdmFyIHRsID0gdGhpcy5yb3RhdGVQb2ludCgwLCAwLCB4MSAtIHJweCwgeTEgLSBycHksIHRoaXMucm90YXRlKTtcbiAgICAgICAgICAgICAgICB2YXIgdHIgPSB0aGlzLnJvdGF0ZVBvaW50KDAsIDAsIHgyIC0gcnB4LCB5MiAtIHJweSwgdGhpcy5yb3RhdGUpO1xuICAgICAgICAgICAgICAgIHZhciBiciA9IHRoaXMucm90YXRlUG9pbnQoMCwgMCwgeDMgLSBycHgsIHkzIC0gcnB5LCB0aGlzLnJvdGF0ZSk7XG4gICAgICAgICAgICAgICAgdmFyIGJsID0gdGhpcy5yb3RhdGVQb2ludCgwLCAwLCB4NCAtIHJweCwgeTQgLSBycHksIHRoaXMucm90YXRlKTtcbiAgICAgICAgICAgICAgICB4MSA9IHRsLnggKyBycHg7XG4gICAgICAgICAgICAgICAgeTEgPSB0bC55ICsgcnB5O1xuICAgICAgICAgICAgICAgIHgyID0gdHIueCArIHJweDtcbiAgICAgICAgICAgICAgICB5MiA9IHRyLnkgKyBycHk7XG4gICAgICAgICAgICAgICAgeDMgPSBici54ICsgcnB4O1xuICAgICAgICAgICAgICAgIHkzID0gYnIueSArIHJweTtcbiAgICAgICAgICAgICAgICB4NCA9IGJsLnggKyBycHg7XG4gICAgICAgICAgICAgICAgeTQgPSBibC55ICsgcnB5O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgY250ID0gMDtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzUG9pbnRJbnRlcnNlY3RzTGluZSh4LCB5LCB4MSwgeTEsIHgyLCB5MikpIHtcbiAgICAgICAgICAgICAgICBjbnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmlzUG9pbnRJbnRlcnNlY3RzTGluZSh4LCB5LCB4MiwgeTIsIHgzLCB5MykpIHtcbiAgICAgICAgICAgICAgICBjbnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmlzUG9pbnRJbnRlcnNlY3RzTGluZSh4LCB5LCB4MywgeTMsIHg0LCB5NCkpIHtcbiAgICAgICAgICAgICAgICBjbnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmlzUG9pbnRJbnRlcnNlY3RzTGluZSh4LCB5LCB4NCwgeTQsIHgxLCB5MSkpIHtcbiAgICAgICAgICAgICAgICBjbnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjbnQgPT0gMSB8fCBjbnQgPT0gMztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgaXNQb2ludEludGVyc2VjdHNMaW5lKHB4OiBudW1iZXIsIHB5OiBudW1iZXIsIGx4MTogbnVtYmVyLCBseTE6IG51bWJlciwgbHgyOiBudW1iZXIsIGx5MjogbnVtYmVyKSB7XG4gICAgICAgICAgICAvKiAoKHBvbHlbaV1bMV0gPiB5KSAhPSAocG9seVtqXVsxXSA+IHkpKSBhbmQgXFxcbiAgICAgICAgICAgICAoeCA8IChwb2x5W2pdWzBdIC0gcG9seVtpXVswXSkgKiAoeSAtIHBvbHlbaV1bMV0pIC8gKHBvbHlbal1bMV0gLSBwb2x5W2ldWzFdKSArIHBvbHlbaV1bMF0pXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHJldHVybiAoKGx5MSA+IHB5KSAhPSAobHkyID4gcHkpKSAmJiAocHggPCAobHgyIC0gbHgxKSAqICgocHkgLSBseTEpKSAvIChseTIgLSBseTEpICsgbHgxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBSb3RhdGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcm90YXRlO1xuICAgICAgICB9XG4gICAgICAgIGdldCByb3RhdGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Sb3RhdGUudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHJvdGF0ZSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Sb3RhdGUudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBTY2FsZVgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2NhbGVYO1xuICAgICAgICB9XG4gICAgICAgIGdldCBzY2FsZVgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5TY2FsZVgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHNjYWxlWCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5TY2FsZVgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBTY2FsZVkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2NhbGVZO1xuICAgICAgICB9XG4gICAgICAgIGdldCBzY2FsZVkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5TY2FsZVkudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHNjYWxlWSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5TY2FsZVkudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUcmFuc2Zvcm1DZW50ZXJYKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zZm9ybUNlbnRlclg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRyYW5zZm9ybUNlbnRlclgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UcmFuc2Zvcm1DZW50ZXJYLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0cmFuc2Zvcm1DZW50ZXJYKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRyYW5zZm9ybUNlbnRlclgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBUcmFuc2Zvcm1DZW50ZXJZKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zZm9ybUNlbnRlclk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHRyYW5zZm9ybUNlbnRlclkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5UcmFuc2Zvcm1DZW50ZXJZLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCB0cmFuc2Zvcm1DZW50ZXJZKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlRyYW5zZm9ybUNlbnRlclkudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBIb3ZlcmVkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hvdmVyZWQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGhvdmVyZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Ib3ZlcmVkLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBob3ZlcmVkKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkhvdmVyZWQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBQcmVzc2VkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ByZXNzZWQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IHByZXNzZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5QcmVzc2VkLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBwcmVzc2VkKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLlByZXNzZWQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG5cblxuICAgICAgICAvLyAgICAgICAgcHVibGljIGZpbmFsIGludCBnZXRTY3JlZW5YKCkge1xuICAgICAgICAvLyAgICAgICAgICAgIHJldHVybiBnZXRFbGVtZW50KCkuZ2V0QWJzb2x1dGVMZWZ0KCk7XG4gICAgICAgIC8vICAgICAgICB9XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgICAgICBwdWJsaWMgZmluYWwgaW50IGdldFNjcmVlblkoKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgcmV0dXJuIGdldEVsZW1lbnQoKS5nZXRBYnNvbHV0ZVRvcCgpO1xuICAgICAgICAvLyAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG5cbiAgICBleHBvcnQgYWJzdHJhY3QgY2xhc3MgQUxheW91dCBleHRlbmRzIEFDb21wb25lbnQge1xuICAgICAgICBwcml2YXRlIF9jaGlsZHJlbiA9IG5ldyBMYXlvdXRDaGlsZHJlbih0aGlzKTtcblxuICAgICAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgc3VwZXIoZWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgY2hpbGRyZW4oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW47XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgYWJzdHJhY3QgX29uQ2hpbGRBZGRlZChjaGlsZDogQUNvbXBvbmVudCk6IHZvaWQ7XG5cbiAgICAgICAgcHVibGljIGFic3RyYWN0IF9vbkNoaWxkUmVtb3ZlZChjaGlsZDogQUNvbXBvbmVudCwgaW5kZXg6IG51bWJlcik6IHZvaWQ7XG5cbiAgICAgICAgcHVibGljIGFic3RyYWN0IF9vbkNoaWxkcmVuQ2xlYXJlZCgpOiB2b2lkO1xuXG4gICAgICAgIGxheW91dCgpIHtcbiAgICAgICAgICAgIHRoaXMuX25lZWRzTGF5b3V0ID0gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4uc2l6ZSgpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGQgPSB0aGlzLmNoaWxkcmVuLmdldChpKTtcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGQubmVlZHNMYXlvdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLmxheW91dCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5vbkxheW91dCgpO1xuICAgICAgICAgICAgdGhpcy5tZWFzdXJlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgX2RvUG9pbnRlckV2ZW50Q2xpbWJpbmdVcChzY3JlZW5YOiBudW1iZXIsIHNjcmVlblk6IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHdoZWVsVmVsb2NpdHk6IG51bWJlcixcbiAgICAgICAgICAgIGFsdFByZXNzZWQ6IGJvb2xlYW4sIGN0cmxQcmVzc2VkOiBib29sZWFuLCBzaGlmdFByZXNzZWQ6IGJvb2xlYW4sIG1ldGFQcmVzc2VkOiBib29sZWFuLCB0eXBlOiBudW1iZXIsIGJ1dHRvbjogbnVtYmVyLCBldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmhhbmRsZVBvaW50ZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRoaXMuZW5hYmxlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF0aGlzLnZpc2libGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5vblBvaW50ZXJFdmVudENsaW1iaW5nVXAoc2NyZWVuWCwgc2NyZWVuWSwgeCwgeSwgd2hlZWxWZWxvY2l0eSwgYWx0UHJlc3NlZCxcbiAgICAgICAgICAgICAgICBjdHJsUHJlc3NlZCwgc2hpZnRQcmVzc2VkLCBtZXRhUHJlc3NlZCwgdHlwZSwgYnV0dG9uKSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSB0aGlzLl9jaGlsZHJlbi5zaXplKCkgLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hpbGQgPSB0aGlzLl9jaGlsZHJlbi5nZXQoaSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGFyZW50WCA9IHggKyB0aGlzLmVsZW1lbnQuc2Nyb2xsTGVmdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYXJlbnRZID0geSArIHRoaXMuZWxlbWVudC5zY3JvbGxUb3A7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcCA9IHRoaXMucGFkZGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRYIC09IHAubGVmdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRZIC09IHAudG9wO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkLl9pc0ludGVyc2VjdHNQb2ludChwYXJlbnRYLCBwYXJlbnRZKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBsZWZ0ID0gY2hpbGQubGVmdCArIGNoaWxkLnRyYW5zbGF0ZVg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRvcCA9IGNoaWxkLnRvcCArIGNoaWxkLnRyYW5zbGF0ZVk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRjeCA9IChsZWZ0ICsgY2hpbGQubWVhc3VyZWRXaWR0aCAqIGNoaWxkLnRyYW5zZm9ybUNlbnRlclgpIHwgMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGN5ID0gKHRvcCArIGNoaWxkLm1lYXN1cmVkSGVpZ2h0ICogY2hpbGQudHJhbnNmb3JtQ2VudGVyWSkgfCAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjaGlsZFBvaW50ID0gdGhpcy5fcm90YXRlUG9pbnQodGN4LCB0Y3ksIHBhcmVudFgsIHBhcmVudFksIC1jaGlsZC5yb3RhdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjaGlsZFggPSBjaGlsZFBvaW50Lng7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNoaWxkWSA9IGNoaWxkUG9pbnQueTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZFggPSBjaGlsZFggLSBsZWZ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkWSA9IGNoaWxkWSAtIHRvcDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUT0RPIHNjYWxlIGJhY2sgcG9pbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGQuX2RvUG9pbnRlckV2ZW50Q2xpbWJpbmdVcChzY3JlZW5YLCBzY3JlZW5ZLCBjaGlsZFgsIGNoaWxkWSwgd2hlZWxWZWxvY2l0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWx0UHJlc3NlZCwgY3RybFByZXNzZWQsIHNoaWZ0UHJlc3NlZCwgbWV0YVByZXNzZWQsIHR5cGUsIGJ1dHRvbiwgZXZlbnQpKSB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5wb2ludGVyVHJhbnNwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm9uUG9pbnRlckV2ZW50RmFsbGluZ0Rvd24oc2NyZWVuWCwgc2NyZWVuWSwgeCwgeSwgd2hlZWxWZWxvY2l0eSwgYWx0UHJlc3NlZCxcbiAgICAgICAgICAgICAgICAgICAgY3RybFByZXNzZWQsIHNoaWZ0UHJlc3NlZCwgbWV0YVByZXNzZWQsIHR5cGUsIGJ1dHRvbiwgZXZlbnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9yb3RhdGVQb2ludChjeDogbnVtYmVyLCBjeTogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlciwgYW5nbGU6IG51bWJlcikge1xuICAgICAgICAgICAgYW5nbGUgPSAoYW5nbGUgKiAzNjApICogKE1hdGguUEkgLyAxODApO1xuICAgICAgICAgICAgeCA9IHggLSBjeDtcbiAgICAgICAgICAgIHkgPSB5IC0gY3k7XG4gICAgICAgICAgICB2YXIgc2luID0gTWF0aC5zaW4oYW5nbGUpO1xuICAgICAgICAgICAgdmFyIGNvcyA9IE1hdGguY29zKGFuZ2xlKTtcbiAgICAgICAgICAgIHZhciByeCA9ICgoY29zICogeCkgLSAoc2luICogeSkpIHwgMDtcbiAgICAgICAgICAgIHZhciByeSA9ICgoc2luICogeCkgKyAoY29zICogeSkpIHwgMDtcbiAgICAgICAgICAgIHJ4ID0gcnggKyBjeDtcbiAgICAgICAgICAgIHJ5ID0gcnkgKyBjeTtcblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQb2ludDJEKHJ4LCByeSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgYWJzdHJhY3Qgb25MYXlvdXQoKTogdm9pZDtcblxuICAgICAgICBnZXRDb21wb25lbnRzQXRQb3NpdGlvbih4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgICAgICAgICAgdmFyIHJlczogQUNvbXBvbmVudFtdID0gW107XG4gICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudHNBdFBvc2l0aW9uX2ltcGwodGhpcywgeCwgeSwgcmVzKTtcbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGdldENvbXBvbmVudHNBdFBvc2l0aW9uX2ltcGwocm9vdDogQUxheW91dCwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHJlc3VsdDogQUNvbXBvbmVudFtdKSB7XG4gICAgICAgICAgICBpZiAoeCA+PSAwICYmIHggPD0gcm9vdC5ib3VuZHNXaWR0aCAmJiB5ID49IDAgJiYgeSA8PSByb290LmJvdW5kc0hlaWdodCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5zcGxpY2UoMCwgMCwgcm9vdCk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByb290LmNoaWxkcmVuLnNpemUoKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb21wb25lbnQgPSByb290LmNoaWxkcmVuLmdldChpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZXQgdHggPSB4IC0gY29tcG9uZW50LmxlZnQgLSBjb21wb25lbnQudHJhbnNsYXRlWDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHR5ID0geSAtIGNvbXBvbmVudC50b3AgLSBjb21wb25lbnQudHJhbnNsYXRlWTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIEFMYXlvdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBsOiBBTGF5b3V0O1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnRzQXRQb3NpdGlvbl9pbXBsKDxBTGF5b3V0PmNvbXBvbmVudCwgdHgsIHR5LCByZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR4ID49IDAgJiYgdHggPD0gY29tcG9uZW50LmJvdW5kc1dpZHRoICYmIHkgPj0gMCAmJiB5IDw9IGNvbXBvbmVudC5ib3VuZHNIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQuc3BsaWNlKDAsIDAsIGNvbXBvbmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgc2V0Q2hpbGRMZWZ0KGNoaWxkOiBBQ29tcG9uZW50LCBsZWZ0OiBudW1iZXIpIHtcbiAgICAgICAgICAgIGNoaWxkLl9zZXRMZWZ0KGxlZnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIHNldENoaWxkVG9wKGNoaWxkOiBBQ29tcG9uZW50LCB0b3A6IG51bWJlcikge1xuICAgICAgICAgICAgY2hpbGQuX3NldFRvcCh0b3ApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFVc2VyQ29udHJvbCBleHRlbmRzIEFMYXlvdXQge1xuXG4gICAgICAgIHByaXZhdGUgX3dpZHRoID0gbmV3IE51bWJlclByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfaGVpZ2h0ID0gbmV3IE51bWJlclByb3BlcnR5KG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfYmFja2dyb3VuZCA9IG5ldyBCYWNrZ3JvdW5kUHJvcGVydHkobmV3IENvbG9yQmFja2dyb3VuZChDb2xvci5UUkFOU1BBUkVOVCksIHRydWUsIGZhbHNlKTtcbiAgICAgICAgcHJpdmF0ZSBfc2hhZG93ID0gbmV3IFByb3BlcnR5PEJveFNoYWRvdz4obnVsbCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF9kcmFnZ2FibGUgPSBuZXcgQm9vbGVhblByb3BlcnR5KGZhbHNlKTtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm92ZXJmbG93WCA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUub3ZlcmZsb3dZID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgIHRoaXMuX3dpZHRoLmFkZENoYW5nZUxpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fd2lkdGgudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJ3aWR0aFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2lkdGggPSBcIlwiICsgdGhpcy5fd2lkdGgudmFsdWUgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl93aWR0aC5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9oZWlnaHQuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9oZWlnaHQudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJoZWlnaHRcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmhlaWdodCA9IFwiXCIgKyB0aGlzLl9oZWlnaHQudmFsdWUgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9oZWlnaHQuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZC5hZGRDaGFuZ2VMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYmFja2dyb3VuZENvbG9yXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImJhY2tncm91bmRJbWFnZVwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJiYWNrZ3JvdW5kXCIpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9iYWNrZ3JvdW5kLnZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZC52YWx1ZS5hcHBseSh0aGlzLmVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZC5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9zaGFkb3cuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zaGFkb3cudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJib3hTaGFkb3dcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhZG93LnZhbHVlLmFwcGx5KHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9kcmFnZ2FibGUuYWRkQ2hhbmdlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9kcmFnZ2FibGUudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcImRyYWdnYWJsZVwiLCBcInRydWVcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcImRyYWdnYWJsZVwiLCBcImZhbHNlXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fZHJhZ2dhYmxlLmludmFsaWRhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBXaWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgd2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5XaWR0aC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgd2lkdGgodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuV2lkdGgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBIZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGdldCBoZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5IZWlnaHQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGhlaWdodCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5IZWlnaHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBCYWNrZ3JvdW5kKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JhY2tncm91bmQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGJhY2tncm91bmQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5CYWNrZ3JvdW5kLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBiYWNrZ3JvdW5kKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkJhY2tncm91bmQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBTaGFkb3coKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2hhZG93O1xuICAgICAgICB9XG4gICAgICAgIGdldCBzaGFkb3coKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5TaGFkb3cudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHNoYWRvdyh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5TaGFkb3cudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBEcmFnZ2FibGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZHJhZ2dhYmxlO1xuICAgICAgICB9XG4gICAgICAgIGdldCBkcmFnZ2FibGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5EcmFnZ2FibGUudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGRyYWdnYWJsZSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5EcmFnZ2FibGUudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBfb25DaGlsZEFkZGVkKGNoaWxkOiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICBpZiAoY2hpbGQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChjaGlsZC5lbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIF9vbkNoaWxkUmVtb3ZlZChjaGlsZDogQUNvbXBvbmVudCwgaW5kZXg6IG51bWJlcikge1xuICAgICAgICAgICAgaWYgKGNoaWxkICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2hpbGQoY2hpbGQuZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBfb25DaGlsZHJlbkNsZWFyZWQoKSB7XG4gICAgICAgICAgICB2YXIgcm9vdCA9IHRoaXMuZWxlbWVudDtcbiAgICAgICAgICAgIHZhciBlID0gdGhpcy5lbGVtZW50LmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICAgICAgd2hpbGUgKGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJvb3QucmVtb3ZlQ2hpbGQoZSk7XG4gICAgICAgICAgICAgICAgZSA9IHJvb3QuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBvbkxheW91dCgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLndpZHRoICE9IG51bGwgJiYgdGhpcy5oZWlnaHQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U2l6ZSh0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBtYXhXID0gMDtcbiAgICAgICAgICAgICAgICB2YXIgbWF4SCA9IDA7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLnNpemUoKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb21wb25lbnQgPSB0aGlzLmNoaWxkcmVuLmdldChpKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNXID0gY29tcG9uZW50LmJvdW5kc1dpZHRoICsgY29tcG9uZW50LmJvdW5kc0xlZnQgKyBjb21wb25lbnQudHJhbnNsYXRlWDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNIID0gY29tcG9uZW50LmJvdW5kc0hlaWdodCArIGNvbXBvbmVudC5ib3VuZHNUb3AgKyBjb21wb25lbnQudHJhbnNsYXRlWTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoY1cgPiBtYXhXKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXhXID0gY1c7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoY0ggPiBtYXhIKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXhIID0gY0g7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy53aWR0aCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIG1heFcgPSB0aGlzLmhlaWdodDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oZWlnaHQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBtYXhIID0gdGhpcy5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTaXplKG1heFcsIG1heEgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgTW91c2VFdmVudFR5cGVzIHtcblxuICAgICAgICBwdWJsaWMgc3RhdGljIE1PVVNFX0RPV04gPSAwO1xuICAgICAgICBwdWJsaWMgc3RhdGljIE1PVVNFX01PVkUgPSAxO1xuICAgICAgICBwdWJsaWMgc3RhdGljIE1PVVNFX1VQID0gMjtcbiAgICAgICAgcHVibGljIHN0YXRpYyBNT1VTRV9FTlRFUiA9IDM7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgTU9VU0VfTEVBVkUgPSA0O1xuICAgICAgICBwdWJsaWMgc3RhdGljIE1PVVNFX1dIRUVMID0gNTtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gICAgfVxuXG59XG5cbiIsIm1vZHVsZSBjdWJlZSB7XG4gICAgXG4gICAgZXhwb3J0IGNsYXNzIFBhbmVsIGV4dGVuZHMgQVVzZXJDb250cm9sIHtcbiAgICAgICAgXG4gICAgfVxuICAgIFxufVxuXG5cbiIsIm1vZHVsZSBjdWJlZSB7XG5cbiAgICBleHBvcnQgY2xhc3MgQVBvcHVwIHtcblxuICAgICAgICBwcml2YXRlIF9tb2RhbDogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBwcml2YXRlIF9hdXRvQ2xvc2UgPSB0cnVlO1xuICAgICAgICBwcml2YXRlIF9nbGFzc0NvbG9yID0gQ29sb3IuVFJBTlNQQVJFTlQ7XG5cbiAgICAgICAgcHJpdmF0ZSBfdHJhbnNsYXRlWCA9IG5ldyBOdW1iZXJQcm9wZXJ0eSgwLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICBwcml2YXRlIF90cmFuc2xhdGVZID0gbmV3IE51bWJlclByb3BlcnR5KDAsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIHByaXZhdGUgX2NlbnRlciA9IG5ldyBCb29sZWFuUHJvcGVydHkoZmFsc2UsIGZhbHNlLCBmYWxzZSk7XG5cbiAgICAgICAgcHJpdmF0ZSBfcG9wdXBSb290OiBQYW5lbCA9IG51bGw7XG4gICAgICAgIHByaXZhdGUgX3Jvb3RDb21wb25lbnRDb250YWluZXI6IFBhbmVsID0gbnVsbDtcbiAgICAgICAgcHJpdmF0ZSBfcm9vdENvbXBvbmVudDogQUNvbXBvbmVudCA9IG51bGw7XG5cbiAgICAgICAgcHJpdmF0ZSBfdmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKG1vZGFsOiBib29sZWFuID0gdHJ1ZSwgYXV0b0Nsb3NlOiBib29sZWFuID0gdHJ1ZSwgZ2xhc3NDb2xvciA9IENvbG9yLmdldEFyZ2JDb2xvcigweDAwMDAwMDAwKSkge1xuICAgICAgICAgICAgdGhpcy5fbW9kYWwgPSBtb2RhbDtcbiAgICAgICAgICAgIHRoaXMuX2F1dG9DbG9zZSA9IGF1dG9DbG9zZTtcbiAgICAgICAgICAgIHRoaXMuX2dsYXNzQ29sb3IgPSBnbGFzc0NvbG9yO1xuICAgICAgICAgICAgdGhpcy5fcG9wdXBSb290ID0gbmV3IFBhbmVsKCk7XG4gICAgICAgICAgICB0aGlzLl9wb3B1cFJvb3QuZWxlbWVudC5zdHlsZS5sZWZ0ID0gXCIwcHhcIjtcbiAgICAgICAgICAgIHRoaXMuX3BvcHVwUm9vdC5lbGVtZW50LnN0eWxlLnRvcCA9IFwiMHB4XCI7XG4gICAgICAgICAgICB0aGlzLl9wb3B1cFJvb3QuZWxlbWVudC5zdHlsZS5yaWdodCA9IFwiMHB4XCI7XG4gICAgICAgICAgICB0aGlzLl9wb3B1cFJvb3QuZWxlbWVudC5zdHlsZS5ib3R0b20gPSBcIjBweFwiO1xuICAgICAgICAgICAgdGhpcy5fcG9wdXBSb290LmVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSBcImZpeGVkXCI7XG4gICAgICAgICAgICBpZiAoZ2xhc3NDb2xvciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcG9wdXBSb290LmJhY2tncm91bmQgPSBuZXcgQ29sb3JCYWNrZ3JvdW5kKGdsYXNzQ29sb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1vZGFsIHx8IGF1dG9DbG9zZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3BvcHVwUm9vdC5lbGVtZW50LnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcImFsbFwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wb3B1cFJvb3QuZWxlbWVudC5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJub25lXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5fcG9wdXBSb290LnBvaW50ZXJUcmFuc3BhcmVudCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX3Jvb3RDb21wb25lbnRDb250YWluZXIgPSBuZXcgUGFuZWwoKTtcbiAgICAgICAgICAgIHRoaXMuX3Jvb3RDb21wb25lbnRDb250YWluZXIuVHJhbnNsYXRlWC5iaW5kKG5ldyBFeHByZXNzaW9uPG51bWJlcj4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBiYXNlWCA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2NlbnRlci52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBiYXNlWCA9ICh0aGlzLl9wb3B1cFJvb3QuY2xpZW50V2lkdGggLSB0aGlzLl9yb290Q29tcG9uZW50Q29udGFpbmVyLmJvdW5kc1dpZHRoKSAvIDI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBiYXNlWCArIHRoaXMuX3RyYW5zbGF0ZVgudmFsdWU7XG4gICAgICAgICAgICB9LCB0aGlzLl9jZW50ZXIsIHRoaXMuX3BvcHVwUm9vdC5DbGllbnRXaWR0aCwgdGhpcy5fdHJhbnNsYXRlWCxcbiAgICAgICAgICAgICAgICB0aGlzLl9yb290Q29tcG9uZW50Q29udGFpbmVyLkJvdW5kc1dpZHRoKSk7XG4gICAgICAgICAgICB0aGlzLl9yb290Q29tcG9uZW50Q29udGFpbmVyLlRyYW5zbGF0ZVkuYmluZChuZXcgRXhwcmVzc2lvbjxudW1iZXI+KCgpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgYmFzZVkgPSAwO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jZW50ZXIudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgYmFzZVkgPSAodGhpcy5fcG9wdXBSb290LmNsaWVudEhlaWdodCAtIHRoaXMuX3Jvb3RDb21wb25lbnRDb250YWluZXIuYm91bmRzSGVpZ2h0KSAvIDI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBiYXNlWSArIHRoaXMuX3RyYW5zbGF0ZVkudmFsdWU7XG4gICAgICAgICAgICB9LCB0aGlzLl9jZW50ZXIsIHRoaXMuX3BvcHVwUm9vdC5DbGllbnRIZWlnaHQsIHRoaXMuX3RyYW5zbGF0ZVksXG4gICAgICAgICAgICAgICAgdGhpcy5fcm9vdENvbXBvbmVudENvbnRhaW5lci5Cb3VuZHNIZWlnaHQpKTtcbiAgICAgICAgICAgIHRoaXMuX3BvcHVwUm9vdC5jaGlsZHJlbi5hZGQodGhpcy5fcm9vdENvbXBvbmVudENvbnRhaW5lcik7XG5cbiAgICAgICAgICAgIGlmIChhdXRvQ2xvc2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wb3B1cFJvb3Qub25DbGljay5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBfX3BvcHVwUm9vdCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wb3B1cFJvb3Q7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IHJvb3RDb21wb25lbnQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcm9vdENvbXBvbmVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBzZXQgcm9vdENvbXBvbmVudChyb290Q29tcG9uZW50OiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9yb290Q29tcG9uZW50Q29udGFpbmVyLmNoaWxkcmVuLmNsZWFyKCk7XG4gICAgICAgICAgICB0aGlzLl9yb290Q29tcG9uZW50ID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChyb290Q29tcG9uZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yb290Q29tcG9uZW50Q29udGFpbmVyLmNoaWxkcmVuLmFkZChyb290Q29tcG9uZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3Jvb3RDb21wb25lbnQgPSByb290Q29tcG9uZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIHNob3coKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fdmlzaWJsZSkge1xuICAgICAgICAgICAgICAgIHRocm93IFwiVGhpcyBwb3B1cCBpcyBhbHJlYWR5IHNob3duLlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGJvZHk6IEhUTUxCb2R5RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXTtcbiAgICAgICAgICAgIGJvZHkuYXBwZW5kQ2hpbGQodGhpcy5fcG9wdXBSb290LmVsZW1lbnQpO1xuICAgICAgICAgICAgUG9wdXBzLl9hZGRQb3B1cCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuX3Zpc2libGUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIGNsb3NlKCk6IGJvb2xlYW4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl92aXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJUaGlzIHBvcHVwIGlzbid0IHNob3duLlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzQ2xvc2VBbGxvd2VkKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYm9keTogSFRNTEJvZHlFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJib2R5XCIpWzBdO1xuICAgICAgICAgICAgYm9keS5yZW1vdmVDaGlsZCh0aGlzLl9wb3B1cFJvb3QuZWxlbWVudCk7XG4gICAgICAgICAgICBQb3B1cHMuX3JlbW92ZVBvcHVwKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5fdmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5vbkNsb3NlZCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgaXNDbG9zZUFsbG93ZWQoKTogYm9vbGVhbiB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBvbkNsb3NlZCgpIHtcblxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IG1vZGFsKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21vZGFsO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGF1dG9DbG9zZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hdXRvQ2xvc2U7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgZ2xhc3NDb2xvcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9nbGFzc0NvbG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFRyYW5zbGF0ZVgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNsYXRlWDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdHJhbnNsYXRlWCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlRyYW5zbGF0ZVgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHRyYW5zbGF0ZVgodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVHJhbnNsYXRlWC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IFRyYW5zbGF0ZVkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNsYXRlWTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgdHJhbnNsYXRlWSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLlRyYW5zbGF0ZVkudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IHRyYW5zbGF0ZVkodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuVHJhbnNsYXRlWS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IENlbnRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jZW50ZXI7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGNlbnRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkNlbnRlci52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgY2VudGVyKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkNlbnRlci52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgX2RvUG9pbnRlckV2ZW50Q2xpbWJpbmdVcChzY3JlZW5YOiBudW1iZXIsIHNjcmVlblk6IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHdoZWVsVmVsb2NpdHk6IG51bWJlcixcbiAgICAgICAgICAgIGFsdFByZXNzZWQ6IGJvb2xlYW4sIGN0cmxQcmVzc2VkOiBib29sZWFuLCBzaGlmdFByZXNzZWQ6IGJvb2xlYW4sIG1ldGFQcmVzc2VkOiBib29sZWFuLCBldmVudFR5cGU6IG51bWJlciwgYnV0dG9uOiBudW1iZXIsIG5hdGl2ZUV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcG9wdXBSb290Ll9kb1BvaW50ZXJFdmVudENsaW1iaW5nVXAoc2NyZWVuWCwgc2NyZWVuWSwgeCwgeSwgd2hlZWxWZWxvY2l0eSwgYWx0UHJlc3NlZCwgY3RybFByZXNzZWQsIHNoaWZ0UHJlc3NlZCwgbWV0YVByZXNzZWQsIGV2ZW50VHlwZSwgYnV0dG9uLCBuYXRpdmVFdmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBfbGF5b3V0KCkge1xuICAgICAgICAgICAgdGhpcy5fcG9wdXBSb290LndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgICAgICB0aGlzLl9wb3B1cFJvb3QuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICAgICAgdGhpcy5fcG9wdXBSb290LmxheW91dCgpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgUG9wdXBzIHtcblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBfcG9wdXBzOiBBUG9wdXBbXSA9IFtdO1xuICAgICAgICBwcml2YXRlIHN0YXRpYyBfbGF5b3V0UnVuT25jZSA9IG5ldyBSdW5PbmNlKCgpID0+IHtcbiAgICAgICAgICAgIFBvcHVwcy5sYXlvdXQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc3RhdGljIF9hZGRQb3B1cChwb3B1cDogQVBvcHVwKSB7XG4gICAgICAgICAgICBQb3B1cHMuX3BvcHVwcy5wdXNoKHBvcHVwKTtcbiAgICAgICAgICAgIFBvcHVwcy5fcmVxdWVzdExheW91dCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIF9yZW1vdmVQb3B1cChwb3B1cDogQVBvcHVwKSB7XG4gICAgICAgICAgICB2YXIgaWR4ID0gUG9wdXBzLl9wb3B1cHMuaW5kZXhPZihwb3B1cCk7XG4gICAgICAgICAgICBpZiAoaWR4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICBQb3B1cHMuX3BvcHVwcy5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICAgICAgICBQb3B1cHMuX3JlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRpYyBfcmVxdWVzdExheW91dCgpIHtcbiAgICAgICAgICAgIFBvcHVwcy5fbGF5b3V0UnVuT25jZS5ydW4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGxheW91dCgpIHtcbiAgICAgICAgICAgIFBvcHVwcy5fcG9wdXBzLmZvckVhY2goKHBvcHVwKSA9PiB7XG4gICAgICAgICAgICAgICAgcG9wdXAuX2xheW91dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0aWMgZG9Qb2ludGVyRXZlbnRDbGltYmluZ1VwKHg6IG51bWJlciwgeTogbnVtYmVyLCB3aGVlbFZlbG9jaXR5OiBudW1iZXIsXG4gICAgICAgICAgICBhbHRQcmVzc2VkOiBib29sZWFuLCBjdHJsUHJlc3NlZDogYm9vbGVhbiwgc2hpZnRQcmVzc2VkOiBib29sZWFuLCBtZXRhUHJlc3NlZDogYm9vbGVhbiwgZXZlbnRUeXBlOiBudW1iZXIsIGJ1dHRvbjogbnVtYmVyLCBuYXRpdmVFdmVudDogTW91c2VFdmVudCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IFBvcHVwcy5fcG9wdXBzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgbGV0IHBvcHVwID0gUG9wdXBzLl9wb3B1cHNbaV07XG4gICAgICAgICAgICAgICAgaWYgKHBvcHVwLl9kb1BvaW50ZXJFdmVudENsaW1iaW5nVXAoeCwgeSwgeCwgeSwgd2hlZWxWZWxvY2l0eSwgYWx0UHJlc3NlZCwgY3RybFByZXNzZWQsIHNoaWZ0UHJlc3NlZCwgbWV0YVByZXNzZWQsIGV2ZW50VHlwZSwgYnV0dG9uLCBuYXRpdmVFdmVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICB0aHJvdyBcIkNhbiBub3QgaW5zdGFudGlhdGUgUG9wdXBzIGNsYXNzLlwiXG4gICAgICAgIH1cblxuICAgIH1cblxufVxuXG5cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ1dGlscy50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJldmVudHMudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicHJvcGVydGllcy50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJzdHlsZXMudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiY29tcG9uZW50X2Jhc2UudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiY29tcG9uZW50cy50c1wiLz4gXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicG9wdXBzLnRzXCIvPiBcblxubW9kdWxlIGN1YmVlIHsgICAgICAgICAgICAgICAgXG5cbiAgICBleHBvcnQgY2xhc3MgQ3ViZWVQYW5lbCB7ICAgICAgICBcblxuICAgICAgICBwcml2YXRlIF9sYXlvdXRSdW5PbmNlOiBSdW5PbmNlID0gbnVsbDtcblxuICAgICAgICBwcml2YXRlIF9jb250ZW50UGFuZWw6IFBhbmVsID0gbnVsbDtcbiAgICAgICAgcHJpdmF0ZSBfcm9vdENvbXBvbmVudDogQUNvbXBvbmVudCA9IG51bGw7XG5cblxuICAgICAgICBwcml2YXRlIF9lbGVtZW50OiBIVE1MRWxlbWVudDtcblxuICAgICAgICBwcml2YXRlIF9sZWZ0ID0gLTE7XG4gICAgICAgIHByaXZhdGUgX3RvcCA9IC0xO1xuICAgICAgICBwcml2YXRlIF9jbGllbnRXaWR0aCA9IC0xO1xuICAgICAgICBwcml2YXRlIF9jbGllbnRIZWlnaHQgPSAtMTtcbiAgICAgICAgcHJpdmF0ZSBfb2Zmc2V0V2lkdGggPSAtMTtcbiAgICAgICAgcHJpdmF0ZSBfb2Zmc2V0SGVpZ2h0ID0gLTE7XG5cbiAgICAgICAgY29uc3RydWN0b3IoZWxlbWVudDogSFRNTERpdkVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJvbnJlc2l6ZVwiLCAoZXZ0OiBVSUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0TGF5b3V0KCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5fY29udGVudFBhbmVsID0gbmV3IFBhbmVsKCk7XG4gICAgICAgICAgICB0aGlzLl9jb250ZW50UGFuZWwuZWxlbWVudC5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJub25lXCI7XG4gICAgICAgICAgICB0aGlzLl9jb250ZW50UGFuZWwucG9pbnRlclRyYW5zcGFyZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbC5zZXRDdWJlZVBhbmVsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLl9jb250ZW50UGFuZWwuZWxlbWVudCk7XG5cbiAgICAgICAgICAgIHRoaXMuY2hlY2tCb3VuZHMoKTtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdExheW91dCgpO1xuXG4gICAgICAgICAgICB2YXIgdCA9IG5ldyBUaW1lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgRXZlbnRRdWV1ZS5JbnN0YW5jZS5pbnZva2VMYXRlcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tCb3VuZHMoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdC5zdGFydCgxMDAsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBjaGVja0JvdW5kcygpIHtcbiAgICAgICAgICAgIC8vIFRPRE8gb2Zmc2V0TGVmdCAtPiBhYnNvbHV0ZUxlZnRcbiAgICAgICAgICAgIHZhciBuZXdMZWZ0ID0gdGhpcy5fZWxlbWVudC5vZmZzZXRMZWZ0O1xuICAgICAgICAgICAgLy8gVE9ETyBvZmZzZXRUb3AgLT4gYWJzb2x1dGVUb3BcbiAgICAgICAgICAgIHZhciBuZXdUb3AgPSB0aGlzLl9lbGVtZW50Lm9mZnNldFRvcDtcbiAgICAgICAgICAgIHZhciBuZXdDbGllbnRXaWR0aCA9IHRoaXMuX2VsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgICAgICAgICB2YXIgbmV3Q2xpZW50SGVpZ2h0ID0gdGhpcy5fZWxlbWVudC5jbGllbnRIZWlnaHQ7XG4gICAgICAgICAgICB2YXIgbmV3T2Zmc2V0V2lkdGggPSB0aGlzLl9lbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICAgICAgdmFyIG5ld09mZnNldEhlaWdodCA9IHRoaXMuX2VsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgaWYgKG5ld0xlZnQgIT0gdGhpcy5fbGVmdCB8fCBuZXdUb3AgIT0gdGhpcy5fdG9wIHx8IG5ld0NsaWVudFdpZHRoICE9IHRoaXMuX2NsaWVudFdpZHRoIHx8IG5ld0NsaWVudEhlaWdodCAhPSB0aGlzLl9jbGllbnRIZWlnaHRcbiAgICAgICAgICAgICAgICB8fCBuZXdPZmZzZXRXaWR0aCAhPSB0aGlzLl9vZmZzZXRXaWR0aCB8fCBuZXdPZmZzZXRIZWlnaHQgIT0gdGhpcy5fb2Zmc2V0SGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGVmdCA9IG5ld0xlZnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fdG9wID0gbmV3VG9wO1xuICAgICAgICAgICAgICAgIHRoaXMuX2NsaWVudFdpZHRoID0gbmV3Q2xpZW50V2lkdGg7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2xpZW50SGVpZ2h0ID0gbmV3Q2xpZW50SGVpZ2h0O1xuICAgICAgICAgICAgICAgIHRoaXMuX29mZnNldFdpZHRoID0gbmV3T2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICAgICAgdGhpcy5fb2Zmc2V0SGVpZ2h0ID0gbmV3T2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbC53aWR0aCA9IHRoaXMuX29mZnNldFdpZHRoO1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbC5oZWlnaHQgPSB0aGlzLl9vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2VsZW1lbnQuc3R5bGUucG9zaXRpb24gPT0gXCJhYnNvbHV0ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbC50cmFuc2xhdGVYID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29udGVudFBhbmVsLnRyYW5zbGF0ZVkgPSAwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbC50cmFuc2xhdGVYID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29udGVudFBhbmVsLnRyYW5zbGF0ZVkgPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlcXVlc3RMYXlvdXQoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fbGF5b3V0UnVuT25jZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGF5b3V0UnVuT25jZSA9IG5ldyBSdW5PbmNlKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXlvdXQoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2xheW91dFJ1bk9uY2UucnVuKCk7XG4gICAgICAgIH1cblxuICAgICAgICBsYXlvdXQoKSB7XG4gICAgICAgICAgICBQb3B1cHMuX3JlcXVlc3RMYXlvdXQoKTtcbiAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbC5sYXlvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCByb290Q29tcG9uZW50KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jvb3RDb21wb25lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBzZXQgcm9vdENvbXBvbmVudChyb290Q29tcG9uZW50OiBBQ29tcG9uZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9jb250ZW50UGFuZWwuY2hpbGRyZW4uY2xlYXIoKTtcbiAgICAgICAgICAgIHRoaXMuX3Jvb3RDb21wb25lbnQgPSBudWxsO1xuICAgICAgICAgICAgaWYgKHJvb3RDb21wb25lbnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRQYW5lbC5jaGlsZHJlbi5hZGQocm9vdENvbXBvbmVudCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcm9vdENvbXBvbmVudCA9IHJvb3RDb21wb25lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBfZG9Qb2ludGVyRXZlbnRDbGltYmluZ1VwKHNjcmVlblg6IG51bWJlciwgc2NyZWVuWTogbnVtYmVyLCB3aGVlbFZlbG9jaXR5OiBudW1iZXIsXG4gICAgICAgICAgICBhbHRQcmVzc2VkOiBib29sZWFuLCBjdHJsUHJlc3NlZDogYm9vbGVhbiwgc2hpZnRQcmVzc2VkOiBib29sZWFuLCBtZXRhUHJlc3NlZDogYm9vbGVhbiwgZXZlbnRUeXBlOiBudW1iZXIsIGJ1dHRvbjogbnVtYmVyLCBuYXRpdmVFdmVudDogTW91c2VFdmVudCkge1xuICAgICAgICAgICAgaWYgKFBvcHVwcy5kb1BvaW50ZXJFdmVudENsaW1iaW5nVXAoc2NyZWVuWCwgc2NyZWVuWSwgd2hlZWxWZWxvY2l0eSwgYWx0UHJlc3NlZCwgY3RybFByZXNzZWQsIHNoaWZ0UHJlc3NlZCwgbWV0YVByZXNzZWQsIGV2ZW50VHlwZSwgYnV0dG9uLCBuYXRpdmVFdmVudCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX2VsZW1lbnQuc3R5bGUucG9zaXRpb24gIT0gXCJhYnNvbHV0ZVwiKSB7XG4gICAgICAgICAgICAgICAgc2NyZWVuWCA9IHNjcmVlblggKyB3aW5kb3cuc2Nyb2xsWCAtIHRoaXMuX2xlZnQ7XG4gICAgICAgICAgICAgICAgc2NyZWVuWSA9IHNjcmVlblkgKyB3aW5kb3cuc2Nyb2xsWSAtIHRoaXMuX3RvcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250ZW50UGFuZWwuX2RvUG9pbnRlckV2ZW50Q2xpbWJpbmdVcChzY3JlZW5YLCBzY3JlZW5ZLCBzY3JlZW5YLCBzY3JlZW5ZLCB3aGVlbFZlbG9jaXR5LCBhbHRQcmVzc2VkLCBjdHJsUHJlc3NlZCwgc2hpZnRQcmVzc2VkLCBtZXRhUHJlc3NlZCwgZXZlbnRUeXBlLCBidXR0b24sIG5hdGl2ZUV2ZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBDbGllbnRXaWR0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250ZW50UGFuZWwuQ2xpZW50V2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGNsaWVudFdpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQ2xpZW50V2lkdGgudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGNsaWVudFdpZHRoKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkNsaWVudFdpZHRoLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQ2xpZW50SGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRlbnRQYW5lbC5DbGllbnRIZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IGNsaWVudEhlaWdodCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkNsaWVudEhlaWdodC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgY2xpZW50SGVpZ2h0KHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLkNsaWVudEhlaWdodC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEJvdW5kc1dpZHRoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRlbnRQYW5lbC5Cb3VuZHNXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm91bmRzV2lkdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Cb3VuZHNXaWR0aC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZXQgYm91bmRzV2lkdGgodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQm91bmRzV2lkdGgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBCb3VuZHNIZWlnaHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY29udGVudFBhbmVsLkJvdW5kc0hlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm91bmRzSGVpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuQm91bmRzSGVpZ2h0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNldCBib3VuZHNIZWlnaHQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQm91bmRzSGVpZ2h0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgQm91bmRzTGVmdCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250ZW50UGFuZWwuQm91bmRzTGVmdDtcbiAgICAgICAgfVxuICAgICAgICBnZXQgYm91bmRzTGVmdCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkJvdW5kc0xlZnQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGJvdW5kc0xlZnQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuQm91bmRzTGVmdC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IEJvdW5kc1RvcCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250ZW50UGFuZWwuQm91bmRzVG9wO1xuICAgICAgICB9XG4gICAgICAgIGdldCBib3VuZHNUb3AoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5Cb3VuZHNUb3AudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0IGJvdW5kc1RvcCh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Cb3VuZHNUb3AudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG59XG5cblxuIl19