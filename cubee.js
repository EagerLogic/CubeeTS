var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b == null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var cubee;
(function (cubee) {
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
    var EventArgs = (function () {
        function EventArgs(sender) {
            this.sender = sender;
        }
        return EventArgs;
    })();
    cubee.EventArgs = EventArgs;
})(cubee || (cubee = {}));
var cubee;
(function (cubee) {
    var Point2D = (function () {
        function Point2D(x, y) {
            this.x = x;
            this.y = y;
        }
        Object.defineProperty(Point2D.prototype, "X", {
            get: function () {
                return this.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Point2D.prototype, "Y", {
            get: function () {
                return this.y;
            },
            enumerable: true,
            configurable: true
        });
        return Point2D;
    })();
    cubee.Point2D = Point2D;
})(cubee || (cubee = {}));
/// <reference path="events.ts"/>
var cubee;
(function (cubee) {
    var Property = (function () {
        function Property(value, nullable, readonly, validator) {
            if (nullable == void 0) { nullable = true; }
            if (readonly == void 0) { readonly = false; }
            if (validator == void 0) { validator = null; }
            this.value = value;
            this.nullable = nullable;
            this.readonly = readonly;
            this.validator = validator;
            this.changeListeners = [];
            this.valid = false;
            this.id = "p" + Property.nextId++;
            if (value == null && nullable == false) {
                throw "A nullable property can not be null.";
            }
            if (this.value != null && validator != null) {
                this.value = validator.validate(value);
            }
            this.invalidate();
        }
        Object.defineProperty(Property.prototype, "_Id", {
            get: function () {
                return this.id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Property.prototype, "Valid", {
            get: function () {
                return this.valid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Property.prototype, "Value", {
            get: function () {
                return this.value;
            },
            set: function (newValue) {
                this.set(newValue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Property.prototype, "Nullable", {
            get: function () {
                return this.nullable;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Property.prototype, "Readonly", {
            get: function () {
                return this.readonly;
            },
            enumerable: true,
            configurable: true
        });
        Property.prototype.bindListener = function () {
            this.invalidateIfNeeded();
        };
        Property.prototype.initReadonlyBind = function (readonlyBind) {
            if (this.readonlyBind != null) {
                throw "The readonly bind is already initialized.";
            }
            this.readonlyBind = readonlyBind;
            if (readonlyBind != null) {
                readonlyBind.addChangeListener(this.bindListener);
            }
            this.invalidate();
        };
        Property.prototype.get = function () {
            this.valid = true;
            if (this.bindingSource != null) {
                if (this.validator != null) {
                    return this.validator.validate(this.bindingSource.getObjectValue());
                }
                return this.bindingSource.getObjectValue();
            }
            if (this.readonlyBind != null) {
                if (this.validator != null) {
                    return this.validator.validate(this.readonlyBind.getObjectValue());
                }
                return this.readonlyBind.getObjectValue();
            }
            return this.value;
        };
        Property.prototype.set = function (newValue) {
            if (this.readonly) {
                throw "Can not change the value of a readonly property.";
            }
            if (this.isBound()) {
                throw "Can not change the value of a bound property.";
            }
            if (!this.nullable && newValue == null) {
                throw "Can not set the value to null of a non nullable property.";
            }
            if (this.validator != null) {
                newValue = this.validator.validate(newValue);
            }
            if (this.value == newValue) {
                return;
            }
            if (this.value != null && this.value == newValue) {
                return;
            }
            this.value = newValue;
            this.invalidate();
        };
        Property.prototype.invalidate = function () {
            this.valid = false;
            this.fireChangeListeners();
        };
        Property.prototype.invalidateIfNeeded = function () {
            if (!this.valid) {
                return;
            }
            this.invalidate();
        };
        Property.prototype.fireChangeListeners = function () {
            for (var listener in this.changeListeners) {
                listener(this);
            }
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
            this.changeListeners.push(listener);
            this.get();
        };
        Property.prototype.removeChangeListener = function (listener) {
            var idx = this.changeListeners.indexOf(listener);
            if (idx < 0) {
                return;
            }
            this.changeListeners.splice(idx);
        };
        Property.prototype.hasChangeListener = function (listener) {
            for (var l in this.changeListeners) {
                if (l == listener) {
                    return true;
                }
            }
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
            if (this.readonly) {
                throw "Can't bind a readonly property.";
            }
            this.bindingSource = source;
            this.bindingSource.addChangeListener(this.bindListener);
            this.invalidate();
        };
        Property.prototype.bidirectionalBind = function (other) {
            var _this = this;
            if (this.isBound()) {
                throw "This property is already bound.";
            }
            if (this.readonly) {
                throw "Can't bind a readonly property.";
            }
            if (other == null) {
                throw "The other parameter can not be null.";
            }
            if (other.readonly) {
                throw "Can not bind a property bidirectionally to a readonly property.";
            }
            if (other == this) {
                throw "Can not bind a property bidirectionally for themself.";
            }
            if (other.isBound()) {
                throw "The target property is already bound.";
            }
            this.bidirectionalBindProperty = other;
            this.bidirectionalChangeListenerOther = function () {
                _this.set(_this.bidirectionalBindProperty.get());
            };
            other.addChangeListener(this.bidirectionalChangeListenerOther);
            this.bidirectionalChangeListenerThis = function () {
                _this.bidirectionalBindProperty.set(_this.get());
            };
            this.addChangeListener(this.bidirectionalChangeListenerThis);
            other.bidirectionalBindProperty = this;
            other.bidirectionalChangeListenerOther = this.bidirectionalChangeListenerThis;
            other.bidirectionalChangeListenerThis = this.bidirectionalChangeListenerOther;
        };
        Property.prototype.unbind = function () {
            if (this.bindingSource != null) {
                this.bindingSource.removeChangeListener(this.bindListener);
                this.bindingSource = null;
                this.invalidate();
            }
            else if (this.isBidirectionalBound()) {
                this.removeChangeListener(this.bidirectionalChangeListenerThis);
                this.bidirectionalBindProperty.removeChangeListener(this.bidirectionalChangeListenerOther);
                this.bidirectionalBindProperty.bidirectionalBindProperty = null;
                this.bidirectionalBindProperty.bidirectionalChangeListenerOther = null;
                this.bidirectionalBindProperty.bidirectionalChangeListenerThis = null;
                this.bidirectionalBindProperty = null;
                this.bidirectionalChangeListenerOther = null;
                this.bidirectionalChangeListenerThis = null;
            }
        };
        Property.prototype.unbindTargets = function () {
            this.changeListeners = [];
        };
        Property.prototype.isBound = function () {
            return this.bindingSource != null;
        };
        Property.prototype.isBidirectionalBound = function () {
            return this.bidirectionalBindProperty != null;
        };
        Property.prototype.createPropertyLine = function (keyFrames) {
            return new PropertyLine(keyFrames);
        };
        Property.prototype.destroy = function () {
            this.unbind();
            this.changeListeners = [];
            this.bindListener = null;
        };
        Property.nextId = 0;
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
        function KeyFrame(time, property, endValue, keyframeReachedListener, interpolator) {
            if (keyframeReachedListener == void 0) { keyframeReachedListener = null; }
            if (interpolator == void 0) { interpolator = Interpolators.Linear; }
            this.time = time;
            this.property = property;
            this.endValue = endValue;
            this.keyframeReachedListener = keyframeReachedListener;
            this.interpolator = interpolator;
            if (time < 0) {
                throw "The time parameter can not be smaller than zero.";
            }
            if (property == null) {
                throw "The property parameter can not be null.";
            }
            if (property.Readonly) {
                throw "Can't animate a read-only property.";
            }
            if (endValue == null && !property.Nullable) {
                throw "Can't set null value to a non nullable property.";
            }
            if (interpolator == null) {
                this.interpolator = Interpolators.Linear;
            }
        }
        Object.defineProperty(KeyFrame.prototype, "Time", {
            get: function () {
                return this.time;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(KeyFrame.prototype, "Property", {
            get: function () {
                return this.property;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(KeyFrame.prototype, "EndValue", {
            get: function () {
                return this.endValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(KeyFrame.prototype, "Interpolator", {
            get: function () {
                return this.interpolator;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(KeyFrame.prototype, "KeyFrameReachedListener", {
            get: function () {
                return this.keyframeReachedListener;
            },
            enumerable: true,
            configurable: true
        });
        return KeyFrame;
    })();
    cubee.KeyFrame = KeyFrame;
    var PropertyLine = (function () {
        function PropertyLine(keyFrames) {
            this.keyFrames = keyFrames;
            this.startTime = -1;
            this.lastRunTime = -1;
            this.previousFrame = null;
            this.property = keyFrames[0].Property;
            var firstFrame = keyFrames[0];
            if (firstFrame.Time > 0) {
                keyFrames.splice(0, 0, new KeyFrame(0, firstFrame.Property, firstFrame.Property.Value));
            }
        }
        Object.defineProperty(PropertyLine.prototype, "StartTime", {
            get: function () {
                return this.startTime;
            },
            set: function (startTime) {
                this.startTime = startTime;
            },
            enumerable: true,
            configurable: true
        });
        PropertyLine.prototype.animate = function () {
            var actTime = Date.now();
            if (actTime == this.startTime) {
                return false;
            }
            var nextFrame = null;
            var actFrame = null;
            for (var frame in this.keyFrames) {
                var fr = frame;
                if (actTime >= this.startTime + fr.Time) {
                    actFrame = frame;
                }
                else {
                    nextFrame = frame;
                    break;
                }
                if (this.startTime + fr.Time > this.lastRunTime && this.startTime + fr.Time <= actTime) {
                    if (fr.KeyFrameReachedListener != null) {
                        fr.KeyFrameReachedListener();
                    }
                }
            }
            if (actFrame != null) {
                if (nextFrame != null) {
                    var pos = ((actTime - this.startTime - actFrame.Time)) / (nextFrame.Time - actFrame.Time);
                    actFrame.Property.Value = actFrame.Property.animate(pos, actFrame.EndValue, nextFrame.EndValue);
                }
                else {
                    actFrame.Property.Value = actFrame.EndValue;
                }
            }
            this.lastRunTime = actTime;
            return actTime >= this.startTime + this.keyFrames[this.keyFrames.length - 1].Time;
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
            var plMap = {};
            var keys = [];
            for (var keyFrame in this.keyFrames) {
                var kf = keyFrame;
                var propertyLine = plMap[kf.Property._Id];
                if (propertyLine == null) {
                    propertyLine = [];
                    plMap[kf.Property._Id] = propertyLine;
                    keys.push(kf.Property._Id);
                }
                if (propertyLine.length > 0) {
                    if (propertyLine[propertyLine.length - 1].Time >= kf.Time) {
                        throw "The keyframes must be in ascending time order per property.";
                    }
                }
                propertyLine.push(keyFrame);
            }
            for (var key in keys) {
                var propertyLine = plMap[key][0].Property.createPropertyLine(plMap[key]);
                this.propertyLines.push(propertyLine);
            }
        };
        Timeline.prototype.start = function (repeatCount) {
            if (repeatCount == void 0) { repeatCount = 0; }
            if (repeatCount == null) {
                repeatCount = 0;
            }
            repeatCount = repeatCount | 0;
            this.createPropertyLines();
            this.repeatCount = repeatCount;
            var startTime = Date.now();
            for (var propertyLine in this.propertyLines) {
                var pl = propertyLine;
                pl.StartTime = startTime;
            }
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
            for (var propertyLine in this.propertyLines) {
                var pl = propertyLine;
                finished = finished && pl.animate();
            }
            if (finished) {
                if (this.repeatCount < 0) {
                    var startTime = Date.now();
                    for (var propertyLine in this.propertyLines) {
                        var pl = propertyLine;
                        pl.StartTime = startTime;
                    }
                }
                else {
                    this.repeatCount--;
                    if (this.repeatCount > -1) {
                        var startTime = Date.now();
                        for (var propertyLine in this.propertyLines) {
                            var pl = propertyLine;
                            pl.StartTime = startTime;
                        }
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
            if (stopped == void 0) { stopped = false; }
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
/// <reference path="utils.ts"/>
/// <reference path="events.ts"/>
/// <reference path="properties.ts"/>
var cubee;
(function (cubee) {
    var MouseDownEventLog = (function () {
        function MouseDownEventLog(component, screenX, screenY, x, y, timestamp) {
            if (timestamp == void 0) { timestamp = Date.now(); }
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
                if (component.Parent != null) {
                    throw "The component is already a child of a layout.";
                }
                component._setParent(this.parent);
                component.OnParentChanged.fireEvent(new cubee.ParentChangedEventArgs(this.parent, component));
            }
            this.children.push(component);
            this.parent._onChildAdded(component);
        };
        LayoutChildren.prototype.insert = function (index, component) {
            var _this = this;
            if (component != null) {
                if (component.Parent != null) {
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
                removedComponent.OnParentChanged.fireEvent(new cubee.ParentChangedEventArgs(null, removedComponent));
            }
            this.parent._onChildRemoved(removedComponent, index);
        };
        LayoutChildren.prototype.clear = function () {
            this.children.forEach(function (child) {
                if (child != null) {
                    child._setParent(null);
                    child.OnParentChanged.fireEvent(new cubee.ParentChangedEventArgs(null, child));
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
            this.needsLayout = false;
            for (var i = 0; i < this.children.size(); i++) {
                var child = this.children.get(i);
                if (child != null) {
                    if (child.NeedsLayout) {
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
                        var parentX = x + this.Element.scrollLeft;
                        var parentY = y + this.Element.scrollTop;
                        var p = this.padding;
                        if (p != null) {
                            parentX -= p.left;
                            parentY -= p.top;
                        }
                        if (child._isIntersectsPoint(parentX, parentY)) {
                            var left = child.Left + child.translateX;
                            var top_1 = child.Top + child.translateY;
                            var tcx = (left + child.measuredWidth * child.transformCenterX) | 0;
                            var tcy = (top_1 + child.measuredHeight * child.transformCenterY) | 0;
                            var childPoint = this._rotatePoint(tcx, tcy, parentX, parentY, -child.rotate);
                            var childX = childPoint.X;
                            var childY = childPoint.Y;
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
                    var tx = x - component.Left - component.translateX;
                    var ty = y - component.Top - component.translateY;
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
            this.Element.style.overflowX = "hidden";
            this.Element.style.overflowY = "hidden";
            this._width.addChangeListener(function () {
                if (_this._width.Value == null) {
                    _this.Element.style.removeProperty("width");
                }
                else {
                    _this.Element.style.width = "" + _this._width.Value + "px";
                }
                _this.requestLayout();
            });
            this._width.invalidate();
            this._height.addChangeListener(function () {
                if (_this._height.Value == null) {
                    _this.Element.style.removeProperty("height");
                }
                else {
                    _this.Element.style.height = "" + _this._height.Value + "px";
                }
                _this.requestLayout();
            });
            this._height.invalidate();
            this._background.addChangeListener(function () {
                _this.Element.style.removeProperty("backgroundColor");
                _this.Element.style.removeProperty("backgroundImage");
                _this.Element.style.removeProperty("background");
                if (_this._background.Value != null) {
                    _this._background.Value.apply(_this.Element);
                }
            });
            this._background.invalidate();
            this._shadow.addChangeListener(function () {
                if (_this._shadow.Value == null) {
                    _this.Element.style.removeProperty("boxShadow");
                }
                else {
                    _this._shadow.Value.apply(_this.Element);
                }
            });
            this._draggable.addChangeListener(function () {
                if (_this._draggable.Value) {
                    _this.Element.setAttribute("draggable", "true");
                }
                else {
                    _this.Element.setAttribute("draggable", "false");
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
                return this.Width.Value;
            },
            set: function (value) {
                this.Width.Value = value;
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
                return this.Height.Value;
            },
            set: function (value) {
                this.Height.Value = value;
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
                return this.Background.Value;
            },
            set: function (value) {
                this.Background.Value = value;
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
                return this.Shadow.Value;
            },
            set: function (value) {
                this.Shadow.Value = value;
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
                return this.Draggable.Value;
            },
            set: function (value) {
                this.Draggable.Value = value;
            },
            enumerable: true,
            configurable: true
        });
        AUserControl.prototype._onChildAdded = function (child) {
            if (child != null) {
                this.Element.appendChild(child.Element);
            }
            this.requestLayout();
        };
        AUserControl.prototype._onChildRemoved = function (child, index) {
            if (child != null) {
                this.Element.removeChild(child.Element);
            }
            this.requestLayout();
        };
        AUserControl.prototype._onChildrenCleared = function () {
            var root = this.Element;
            var e = this.Element.firstElementChild;
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
            this.onClick = new cubee.Event();
            this.onMouseDown = new cubee.Event();
            this.onMouseDrag = new cubee.Event();
            this.onMouseMove = new cubee.Event();
            this.onMouseUp = new cubee.Event();
            this.onMouseEnter = new cubee.Event();
            this.onMouseLeave = new cubee.Event();
            this.onMouseWheel = new cubee.Event();
            this.onKeyDown = new cubee.Event();
            this.onKeyPress = new cubee.Event();
            this.onKeyUp = new cubee.Event();
            this.onParentChanged = new cubee.Event();
            this.onContextMenu = new cubee.Event();
            this.left = 0;
            this.top = 0;
            this.needsLayout = true;
            this.transformChangedListener = function (sender) {
                _this.updateTransform();
                _this.requestLayout();
            };
            this.postConstructRunOnce = new cubee.RunOnce(function () {
                _this.postConstruct();
            });
            this.element = rootElement;
            this.element.style.boxSizing = "content-box";
            this.element.setAttribute("draggable", "false");
            this.element.style.position = "absolute";
            this.element.style.outlineStyle = "none";
            this.element.style.outlineWidth = "0px";
            this.element.style.margin = "0px";
            this.element.style.pointerEvents = "all";
            this._translateX.addChangeListener(this.transformChangedListener);
            this._translateY.addChangeListener(this.transformChangedListener);
            this._rotate.addChangeListener(this.transformChangedListener);
            this._scaleX.addChangeListener(this.transformChangedListener);
            this._scaleY.addChangeListener(this.transformChangedListener);
            this._transformCenterX.addChangeListener(this.transformChangedListener);
            this._transformCenterY.addChangeListener(this.transformChangedListener);
            this._hovered.initReadonlyBind(this._hoveredSetter);
            this._pressed.initReadonlyBind(this._pressedSetter);
            this._padding.addChangeListener(function () {
                var p = _this._padding.Value;
                if (p == null) {
                    _this.element.style.padding = "0px";
                }
                else {
                    p.apply(_this.element);
                }
                _this.requestLayout();
            });
            this._padding.invalidate();
            this._border.addChangeListener(function () {
                var b = _this._border.Value;
                if (b == null) {
                    _this.element.style.removeProperty("borderStyle");
                    _this.element.style.removeProperty("borderColor");
                    _this.element.style.removeProperty("borderWidth");
                    _this.element.style.removeProperty("borderRadius");
                }
                else {
                    b.apply(_this.element);
                }
                _this.requestLayout();
            });
            this._cursor.addChangeListener(function () {
                _this.element.style.cursor = _this.cursor.css;
            });
            this._visible.addChangeListener(function () {
                if (_this._visible.Value) {
                    _this.element.style.visibility = "visible";
                }
                else {
                    _this.element.style.visibility = "hidden";
                }
            });
            this._enabled.addChangeListener(function () {
                if (_this._enabled.Value) {
                    _this.element.removeAttribute("disabled");
                }
                else {
                    _this.element.setAttribute("disabled", "true");
                }
            });
            this._alpha.addChangeListener(function () {
                _this.element.style.opacity = "" + _this._alpha.Value;
            });
            this._selectable.addChangeListener(function () {
                if (_this._selectable.Value) {
                    _this.element.style.removeProperty("mozUserSelect");
                    _this.element.style.removeProperty("khtmlUserSelect");
                    _this.element.style.removeProperty("webkitUserSelect");
                    _this.element.style.removeProperty("msUserSelect");
                    _this.element.style.removeProperty("userSelect");
                }
                else {
                    _this.element.style.setProperty("mozUserSelect", "none");
                    _this.element.style.setProperty("khtmlUserSelect", "none");
                    _this.element.style.setProperty("webkitUserSelect", "none");
                    _this.element.style.setProperty("msUserSelect", "none");
                    _this.element.style.setProperty("userSelect", "none");
                }
            });
            this._selectable.invalidate();
            this._minWidth.addChangeListener(function () {
                if (_this._minWidth.Value == null) {
                    _this.element.style.removeProperty("minWidth");
                }
                else {
                    _this.element.style.setProperty("minWidth", _this._minWidth.Value + "px");
                }
                _this.requestLayout();
            });
            this._minHeight.addChangeListener(function () {
                if (_this._minHeight.Value == null) {
                    _this.element.style.removeProperty("minHeight");
                }
                else {
                    _this.element.style.setProperty("minHeight", _this._minHeight.Value + "px");
                }
                _this.requestLayout();
            });
            this._maxWidth.addChangeListener(function () {
                if (_this._maxWidth.Value == null) {
                    _this.element.style.removeProperty("maxWidth");
                }
                else {
                    _this.element.style.setProperty("maxWidth", _this._maxWidth.Value + "px");
                }
                _this.requestLayout();
            });
            this._maxHeight.addChangeListener(function () {
                if (_this._maxHeight.Value == null) {
                    _this.element.style.removeProperty("maxHeight");
                }
                else {
                    _this.element.style.setProperty("maxHeight", _this._maxHeight.Value + "px");
                }
                _this.requestLayout();
            });
            this._handlePointer.addChangeListener(function () {
                if (!_this._handlePointer.Value || _this._pointerTransparent.Value) {
                    _this.element.style.setProperty("pointerEvents", "none");
                }
                else {
                    _this.element.style.removeProperty("pointerEvents");
                }
            });
            this._pointerTransparent.addChangeListener(function () {
                if (!_this._handlePointer.Value || _this._pointerTransparent.Value) {
                    _this.element.style.setProperty("pointerEvents", "none");
                }
                else {
                    _this.element.style.removeProperty("pointerEvents");
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
            this.onMouseEnter.addListener(function () {
                _this._hoveredSetter.Value = true;
            });
            this.onMouseLeave.addListener(function () {
                _this._hoveredSetter.Value = false;
            });
            this.onMouseDown.addListener(function () {
                _this._pressedSetter.Value = true;
            });
            this.onMouseUp.addListener(function () {
                _this._pressedSetter.Value = false;
            });
        }
        AComponent.prototype.invokePostConstruct = function () {
            this.postConstructRunOnce.run();
        };
        AComponent.prototype.postConstruct = function () {
        };
        AComponent.prototype.setCubeePanel = function (cubeePanel) {
            this.cubeePanel = cubeePanel;
        };
        AComponent.prototype.getCubeePanel = function () {
            if (this.cubeePanel != null) {
                return this.cubeePanel;
            }
            else if (this.Parent != null) {
                return this.Parent.getCubeePanel();
            }
            else {
                return null;
            }
        };
        AComponent.prototype.updateTransform = function () {
            var angle = this._rotate.Value;
            angle = angle - (angle | 0);
            angle = angle * 360;
            var angleStr = angle + "deg";
            var centerX = (this._transformCenterX.Value * 100) + "%";
            var centerY = (this._transformCenterY.Value * 100) + "%";
            var sX = this._scaleX.Value.toString();
            var sY = this._scaleY.Value.toString();
            this.element.style.transformOrigin = centerX + " " + centerY;
            this.element.style.transform = "translate(" + this._translateX.Value + "px, " + this._translateY.Value
                + "px) rotate(" + angleStr + ") scaleX( " + sX + ") scaleY(" + sY + ")";
            this.element.style.backfaceVisibility = "hidden";
        };
        AComponent.prototype.requestLayout = function () {
            if (!this.needsLayout) {
                this.needsLayout = true;
                if (this.parent != null) {
                    this.parent.requestLayout();
                }
                else if (this.cubeePanel != null) {
                    this.cubeePanel.requestLayout();
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
            var cw = this.element.clientWidth;
            var ch = this.element.clientHeight;
            var p = this._padding.Value;
            if (p != null) {
                cw = cw - p.left - p.right;
                ch = ch - p.top - p.bottom;
            }
            this._clientWidthSetter.Value = cw;
            this._clientHeightSetter.Value = ch;
            var mw = this.element.offsetWidth;
            var mh = this.element.offsetHeight;
            this._measuredWidthSetter.Value = mw;
            this._measuredHeightSetter.Value = mh;
            var tcx = this._transformCenterX.Value;
            var tcy = this._transformCenterY.Value;
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
            var rot = this._rotate.Value;
            if (rot != 0.0) {
                tl = this.rotatePoint(cx, cy, 0, 0, rot);
                tr = this.rotatePoint(cx, cy, bw, 0, rot);
                br = this.rotatePoint(cx, cy, bw, bh, rot);
                bl = this.rotatePoint(cx, cy, 0, bh, rot);
            }
            var sx = this._scaleX.Value;
            var sy = this._scaleY.Value;
            if (sx != 1.0 || sy != 1.0) {
                tl = this.scalePoint(cx, cy, tl.X, tl.Y, sx, sy);
                tr = this.scalePoint(cx, cy, tr.X, tr.Y, sx, sy);
                br = this.scalePoint(cx, cy, br.X, br.Y, sx, sy);
                bl = this.scalePoint(cx, cy, bl.X, bl.Y, sx, sy);
            }
            var minX = Math.min(Math.min(tl.X, tr.X), Math.min(br.X, bl.X));
            var minY = Math.min(Math.min(tl.Y, tr.Y), Math.min(br.Y, bl.Y));
            var maxX = Math.max(Math.max(tl.X, tr.X), Math.max(br.X, bl.X));
            var maxY = Math.max(Math.max(tl.Y, tr.Y), Math.max(br.Y, bl.Y));
            bw = maxX - minX;
            bh = maxY - minY;
            bx = minX;
            by = minY;
            this._boundsLeftSetter.Value = bx;
            this._boundsTopSetter.Value = by;
            this._boundsWidthSetter.Value = bw;
            this._boundsHeightSetter.Value = bh;
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
        Object.defineProperty(AComponent.prototype, "Element", {
            get: function () {
                return this.element;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "Parent", {
            get: function () {
                return this.parent;
            },
            enumerable: true,
            configurable: true
        });
        AComponent.prototype._setParent = function (parent) {
            this.parent = parent;
        };
        AComponent.prototype.layout = function () {
            this.needsLayout = false;
            this.measure();
        };
        Object.defineProperty(AComponent.prototype, "NeedsLayout", {
            get: function () {
                return this.needsLayout;
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
                return this.TranslateX.Value;
            },
            set: function (value) {
                this.TranslateX.Value = value;
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
                return this.TranslateY.Value;
            },
            set: function (value) {
                this.TranslateY.Value = value;
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
                return this.Padding.Value;
            },
            set: function (value) {
                this.Padding.Value = value;
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
                return this.Border.Value;
            },
            set: function (value) {
                this.Border.Value = value;
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
                return this.MeasuredWidth.Value;
            },
            set: function (value) {
                this.MeasuredWidth.Value = value;
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
                return this.MeasuredHeight.Value;
            },
            set: function (value) {
                this.MeasuredHeight.Value = value;
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
                return this.ClientWidth.Value;
            },
            set: function (value) {
                this.ClientWidth.Value = value;
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
                return this.ClientHeight.Value;
            },
            set: function (value) {
                this.ClientHeight.Value = value;
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
                return this.BoundsWidth.Value;
            },
            set: function (value) {
                this.BoundsWidth.Value = value;
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
                return this.BoundsHeight.Value;
            },
            set: function (value) {
                this.BoundsHeight.Value = value;
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
                return this.BoundsLeft.Value;
            },
            set: function (value) {
                this.BoundsLeft.Value = value;
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
                return this.BoundsTop.Value;
            },
            set: function (value) {
                this.BoundsTop.Value = value;
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
                return this.MinWidth.Value;
            },
            set: function (value) {
                this.MinWidth.Value = value;
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
                return this.MinHeight.Value;
            },
            set: function (value) {
                this.MinHeight.Value = value;
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
                return this.MaxWidth.Value;
            },
            set: function (value) {
                this.MaxWidth.Value = value;
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
                return this.MaxHeight.Value;
            },
            set: function (value) {
                this.MaxHeight.Value = value;
            },
            enumerable: true,
            configurable: true
        });
        AComponent.prototype.setPosition = function (left, top) {
            this.element.style.left = "" + left + "px";
            this.element.style.top = "" + top + "px";
            this.left = left;
            this.top = top;
        };
        AComponent.prototype._setLeft = function (left) {
            this.element.style.left = "" + left + "px";
            this.left = left;
        };
        AComponent.prototype._setTop = function (top) {
            this.element.style.top = "" + top + "px";
            this.top = top;
        };
        AComponent.prototype.setSize = function (width, height) {
            this.element.style.width = "" + width + "px";
            this.element.style.height = "" + height + "px";
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
                return this.Cursor.Value;
            },
            set: function (value) {
                this.Cursor.Value = value;
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
                return this.PointerTransparent.Value;
            },
            set: function (value) {
                this.PointerTransparent.Value = value;
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
                return this.Visible.Value;
            },
            set: function (value) {
                this.Visible.Value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "OnClick", {
            get: function () {
                return this.onClick;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "OnContextMenu", {
            get: function () {
                return this.onContextMenu;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "OnMouseDown", {
            get: function () {
                return this.onMouseDown;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "OnMouseMove", {
            get: function () {
                return this.onMouseMove;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "OnMouseUp", {
            get: function () {
                return this.onMouseUp;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "OnMouseEnter", {
            get: function () {
                return this.onMouseEnter;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "OnMouseLeave", {
            get: function () {
                return this.onMouseLeave;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "OnMouseWheel", {
            get: function () {
                return this.onMouseWheel;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "OnKeyDown", {
            get: function () {
                return this.onKeyDown;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "OnKeyPress", {
            get: function () {
                return this.onKeyPress;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "OnKeyUp", {
            get: function () {
                return this.onKeyUp;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "OnParentChanged", {
            get: function () {
                return this.onParentChanged;
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
                return this.Alpha.Value;
            },
            set: function (value) {
                this.Alpha.Value = value;
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
                return this.HandlePointer.Value;
            },
            set: function (value) {
                this.HandlePointer.Value = value;
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
                return this.Enabled.Value;
            },
            set: function (value) {
                this.Enabled.Value = value;
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
                return this.Selectable.Value;
            },
            set: function (value) {
                this.Selectable.Value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "Left", {
            get: function () {
                return this.left;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AComponent.prototype, "Top", {
            get: function () {
                return this.top;
            },
            enumerable: true,
            configurable: true
        });
        AComponent.prototype._doPointerEventClimbingUp = function (screenX, screenY, x, y, wheelVelocity, altPressed, ctrlPressed, shiftPressed, metaPressed, eventType, button, nativeEvent) {
            if (!this._handlePointer.Value) {
                return false;
            }
            if (this._pointerTransparent.Value) {
                return false;
            }
            if (this._enabled.Value) {
                return true;
            }
            if (!this._visible.Value) {
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
                    this.onMouseDown.fireEvent(mdea);
                    break;
                case MouseEventTypes.MOUSE_MOVE:
                    var mmea = new cubee.MouseMoveEventArgs(screenX, screenY, x, y, altPressed, ctrlPressed, shiftPressed, metaPressed, this);
                    this.onMouseMove.fireEvent(mmea);
                    break;
                case MouseEventTypes.MOUSE_ENTER:
                    this.onMouseEnter.fireEvent(new cubee.EventArgs(this));
                    break;
                case MouseEventTypes.MOUSE_LEAVE:
                    this.onMouseLeave.fireEvent(new cubee.EventArgs(this));
                    break;
                case MouseEventTypes.MOUSE_WHEEL:
                    this.onMouseWheel.fireEvent(new cubee.MouseWheelEventArgs(wheelVelocity, altPressed, ctrlPressed, shiftPressed, metaPressed, this));
                    break;
            }
            return true;
        };
        AComponent.prototype._isIntersectsPoint = function (x, y) {
            var x1 = this.left + this._translateX.Value;
            var y1 = this.top + this._translateY.Value;
            var x2 = x1 + this._measuredWidth.Value;
            var y2 = y1;
            var x3 = x2;
            var y3 = y2 + this._measuredHeight.Value;
            var x4 = x1;
            var y4 = y3;
            if (this._scaleX.Value != 1.0) {
                x1 = (x1 - ((x2 - x1) * this._transformCenterX.Value * this._scaleX.Value)) | 0;
                x2 = (x1 + ((x2 - x1) * (1 - this._transformCenterX.Value) * this._scaleX.Value)) | 0;
                x3 = x2;
                x4 = x1;
            }
            if (this._scaleY.Value != 1.0) {
                y1 = (y1 - ((y2 - y1) * this._transformCenterY.Value * this._scaleY.Value)) | 0;
                y4 = (y4 + ((y4 - y1) * (1 - this._transformCenterY.Value) * this._scaleY.Value)) | 0;
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
                x1 = tl.X + rpx;
                y1 = tl.Y + rpy;
                x2 = tr.X + rpx;
                y2 = tr.Y + rpy;
                x3 = br.X + rpx;
                y3 = br.Y + rpy;
                x4 = bl.X + rpx;
                y4 = bl.Y + rpy;
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
                return this.Rotate.Value;
            },
            set: function (value) {
                this.Rotate.Value = value;
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
                return this.ScaleX.Value;
            },
            set: function (value) {
                this.ScaleX.Value = value;
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
                return this.ScaleY.Value;
            },
            set: function (value) {
                this.ScaleY.Value = value;
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
                return this.TransformCenterX.Value;
            },
            set: function (value) {
                this.TransformCenterX.Value = value;
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
                return this.TransformCenterY.Value;
            },
            set: function (value) {
                this.TransformCenterY.Value = value;
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
                return this.Hovered.Value;
            },
            set: function (value) {
                this.Hovered.Value = value;
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
                return this.Pressed.Value;
            },
            set: function (value) {
                this.Pressed.Value = value;
            },
            enumerable: true,
            configurable: true
        });
        return AComponent;
    })();
    cubee.AComponent = AComponent;
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
/// <reference path="utils.ts"/>
/// <reference path="events.ts"/>
/// <reference path="properties.ts"/>
/// <reference path="styles.ts"/>
/// <reference path="component_base.ts"/>
/// <reference path="components.ts"/> 
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
            this._contentPanel.Element.style.pointerEvents = "none";
            this._contentPanel.pointerTransparent = true;
            this._contentPanel.setCubeePanel(this);
            this._element.appendChild(this._contentPanel.Element);
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
                if (this._rootComponent != null) {
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
                return this.ClientWidth.Value;
            },
            set: function (value) {
                this.ClientWidth.Value = value;
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
                return this.ClientHeight.Value;
            },
            set: function (value) {
                this.ClientHeight.Value = value;
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
                return this.BoundsWidth.Value;
            },
            set: function (value) {
                this.BoundsWidth.Value = value;
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
                return this.BoundsHeight.Value;
            },
            set: function (value) {
                this.BoundsHeight.Value = value;
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
                return this.BoundsLeft.Value;
            },
            set: function (value) {
                this.BoundsLeft.Value = value;
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
                return this.BoundsTop.Value;
            },
            set: function (value) {
                this.BoundsTop.Value = value;
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
    var APopup = (function () {
        function APopup(modal, autoClose, glassColor) {
            var _this = this;
            if (modal == void 0) { modal = true; }
            if (autoClose == void 0) { autoClose = true; }
            if (glassColor == void 0) { glassColor = cubee.Color.getArgbColor(0x00000000); }
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
            this._popupRoot.Element.style.left = "0px";
            this._popupRoot.Element.style.top = "0px";
            this._popupRoot.Element.style.right = "0px";
            this._popupRoot.Element.style.bottom = "0px";
            this._popupRoot.Element.style.position = "fixed";
            if (glassColor != null) {
                this._popupRoot.background = new cubee.ColorBackground(glassColor);
            }
            if (modal || autoClose) {
                this._popupRoot.Element.style.pointerEvents = "all";
            }
            else {
                this._popupRoot.Element.style.pointerEvents = "none";
                this._popupRoot.pointerTransparent = true;
            }
            this._rootComponentContainer = new cubee.Panel();
            this._rootComponentContainer.TranslateX.bind(new cubee.Expression(function () {
                var baseX = 0;
                if (_this._center.Value) {
                    baseX = (_this._popupRoot.clientWidth - _this._rootComponentContainer.boundsWidth) / 2;
                }
                return baseX + _this._translateX.Value;
            }, this._center, this._popupRoot.ClientWidth, this._translateX, this._rootComponentContainer.BoundsWidth));
            this._rootComponentContainer.TranslateY.bind(new cubee.Expression(function () {
                var baseY = 0;
                if (_this._center.Value) {
                    baseY = (_this._popupRoot.clientHeight - _this._rootComponentContainer.boundsHeight) / 2;
                }
                return baseY + _this._translateY.Value;
            }, this._center, this._popupRoot.ClientHeight, this._translateY, this._rootComponentContainer.BoundsHeight));
            this._popupRoot.children.add(this._rootComponentContainer);
            if (autoClose) {
                this._popupRoot.OnClick.addListener(function () {
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
            body.appendChild(this._popupRoot.Element);
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
            body.removeChild(this._popupRoot.Element);
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
                return this.TranslateX.Value;
            },
            set: function (value) {
                this.TranslateX.Value = value;
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
                return this.TranslateY.Value;
            },
            set: function (value) {
                this.TranslateY.Value = value;
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
                return this.Center.Value;
            },
            set: function (value) {
                this.Center.Value = value;
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
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function start() {
    var div = document.getElementById("cubeePanel");
    var cp = new cubee.CubeePanel(div);
    var p = new cubee.Panel();
    p.width = 200;
    p.height = 100;
    p.background = new cubee.ColorBackground(cubee.Color.getRgbColor(0xff4000));
    cp.rootComponent = p;
}
//# sourceMappingURL=cubee.js.map