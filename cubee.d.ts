declare module cubee {
    class Event<T> {
        private listeners;
        Event(): void;
        addListener(listener: IEventListener<T>): void;
        removeListener(listener: IEventListener<T>): void;
        hasListener(listener: IEventListener<T>): boolean;
        fireEvent(args: T): void;
    }
    class Timer {
        private func;
        private token;
        private repeat;
        private action;
        constructor(func: {
            (): void;
        });
        start(delay: number, repeat: boolean): void;
        stop(): void;
        Started: boolean;
    }
    interface IEventListener<T> {
        (args: T): void;
    }
    class EventQueue {
        private static instance;
        static Instance: EventQueue;
        private queue;
        private timer;
        private EventQueue();
        invokeLater(task: {
            (): void;
        }): void;
        invokePrior(task: {
            (): void;
        }): void;
    }
    class RunOnce {
        private func;
        private scheduled;
        constructor(func: IRunnable);
        run(): void;
    }
    class MouseDragEventArgs {
        screenX: number;
        screenY: number;
        deltaX: number;
        deltaY: number;
        altPressed: boolean;
        ctrlPressed: boolean;
        shiftPressed: boolean;
        metaPressed: boolean;
        sender: Object;
        constructor(screenX: number, screenY: number, deltaX: number, deltaY: number, altPressed: boolean, ctrlPressed: boolean, shiftPressed: boolean, metaPressed: boolean, sender: Object);
    }
    class MouseUpEventArgs {
        screenX: number;
        screenY: number;
        deltaX: number;
        deltaY: number;
        altPressed: boolean;
        ctrlPressed: boolean;
        shiftPressed: boolean;
        metaPressed: boolean;
        button: number;
        nativeEvent: MouseEvent;
        sender: Object;
        constructor(screenX: number, screenY: number, deltaX: number, deltaY: number, altPressed: boolean, ctrlPressed: boolean, shiftPressed: boolean, metaPressed: boolean, button: number, nativeEvent: MouseEvent, sender: Object);
    }
    class MouseDownEventArgs {
        screenX: number;
        screenY: number;
        deltaX: number;
        deltaY: number;
        altPressed: boolean;
        ctrlPressed: boolean;
        shiftPressed: boolean;
        metaPressed: boolean;
        button: number;
        nativeEvent: MouseEvent;
        sender: Object;
        constructor(screenX: number, screenY: number, deltaX: number, deltaY: number, altPressed: boolean, ctrlPressed: boolean, shiftPressed: boolean, metaPressed: boolean, button: number, nativeEvent: MouseEvent, sender: Object);
    }
    class MouseMoveEventArgs {
        screenX: number;
        screenY: number;
        x: number;
        y: number;
        altPressed: boolean;
        ctrlPressed: boolean;
        shiftPressed: boolean;
        metaPressed: boolean;
        sender: Object;
        constructor(screenX: number, screenY: number, x: number, y: number, altPressed: boolean, ctrlPressed: boolean, shiftPressed: boolean, metaPressed: boolean, sender: Object);
    }
    class MouseWheelEventArgs {
        wheelVelocity: number;
        altPressed: boolean;
        ctrlPressed: boolean;
        shiftPressed: boolean;
        metaPressed: boolean;
        sender: Object;
        constructor(wheelVelocity: number, altPressed: boolean, ctrlPressed: boolean, shiftPressed: boolean, metaPressed: boolean, sender: Object);
    }
    class ClickEventArgs {
        screenX: number;
        screenY: number;
        deltaX: number;
        deltaY: number;
        altPressed: boolean;
        ctrlPressed: boolean;
        shiftPressed: boolean;
        metaPressed: boolean;
        button: number;
        sender: Object;
        constructor(screenX: number, screenY: number, deltaX: number, deltaY: number, altPressed: boolean, ctrlPressed: boolean, shiftPressed: boolean, metaPressed: boolean, button: number, sender: Object);
    }
    class KeyEventArgs {
        keyCode: number;
        altPressed: boolean;
        ctrlPressed: boolean;
        shiftPressed: boolean;
        metaPressed: boolean;
        sender: Object;
        nativeEvent: KeyboardEvent;
        constructor(keyCode: number, altPressed: boolean, ctrlPressed: boolean, shiftPressed: boolean, metaPressed: boolean, sender: Object, nativeEvent: KeyboardEvent);
    }
    class ParentChangedEventArgs extends EventArgs {
        newParent: ALayout;
        sender: Object;
        constructor(newParent: ALayout, sender: Object);
    }
    class ContextMenuEventArgs {
        nativeEvent: UIEvent;
        sender: Object;
        constructor(nativeEvent: UIEvent, sender: Object);
    }
    class EventArgs {
        sender: Object;
        constructor(sender: Object);
    }
}
declare module cubee {
    interface IRunnable {
        (): void;
    }
    class Point2D {
        private x;
        private y;
        constructor(x: number, y: number);
        X: number;
        Y: number;
    }
}
declare module cubee {
    interface IChangeListener {
        (sender?: Object): void;
    }
    interface IObservable {
        addChangeListener(listener: IChangeListener): void;
        removeChangeListener(listener: IChangeListener): void;
        hasChangeListener(listener: IChangeListener): void;
    }
    interface IBindable<T> {
        bind(source: T): void;
        unbind(): void;
        isBound(): boolean;
    }
    interface IAnimateable<T> {
        animate(pos: number, startValue: T, endValue: T): T;
    }
    interface IProperty<T> extends IObservable {
        getObjectValue(): Object;
        invalidate(): void;
    }
    interface IValidator<T> {
        validate(value: T): T;
    }
    class Property<T> implements IProperty<T>, IAnimateable<T>, IBindable<IProperty<T>> {
        private value;
        private nullable;
        private readonly;
        private validator;
        private static nextId;
        private changeListeners;
        private valid;
        private bindingSource;
        private readonlyBind;
        private bidirectionalBindProperty;
        private bidirectionalChangeListenerThis;
        private bidirectionalChangeListenerOther;
        private id;
        constructor(value?: T, nullable?: boolean, readonly?: boolean, validator?: IValidator<T>);
        _Id: string;
        Valid: boolean;
        Value: T;
        Nullable: boolean;
        Readonly: boolean;
        private bindListener();
        initReadonlyBind(readonlyBind: IProperty<T>): void;
        private get();
        private set(newValue);
        invalidate(): void;
        invalidateIfNeeded(): void;
        fireChangeListeners(): void;
        getObjectValue(): Object;
        addChangeListener(listener: IChangeListener): void;
        removeChangeListener(listener: IChangeListener): void;
        hasChangeListener(listener: IChangeListener): boolean;
        animate(pos: number, startValue: T, endValue: T): T;
        bind(source: IProperty<T>): void;
        bidirectionalBind(other: Property<T>): void;
        unbind(): void;
        unbindTargets(): void;
        isBound(): boolean;
        isBidirectionalBound(): boolean;
        createPropertyLine(keyFrames: KeyFrame<T>[]): PropertyLine<T>;
        destroy(): void;
    }
    class Expression<T> implements IProperty<T>, IObservable {
        private _notifyListenersOnce;
        private _bindingSources;
        private _bindingListener;
        private _changeListeners;
        private _func;
        private _valid;
        private _value;
        constructor(func: {
            (): T;
        }, ...activators: IProperty<any>[]);
        value: T;
        addChangeListener(listener: IChangeListener): void;
        removeChangeListener(listener: IChangeListener): void;
        hasChangeListener(listener: IChangeListener): boolean;
        getObjectValue(): T;
        bind(...properties: IProperty<any>[]): void;
        unbindAll(): void;
        unbind(property: IProperty<any>): void;
        invalidate(): void;
        invalidateIfNeeded(): void;
        private fireChangeListeners();
    }
    class KeyFrame<T> {
        private time;
        private property;
        private endValue;
        private keyframeReachedListener;
        private interpolator;
        constructor(time: number, property: Property<T>, endValue: T, keyframeReachedListener?: {
            (): void;
        }, interpolator?: IInterpolator);
        Time: number;
        Property: Property<T>;
        EndValue: T;
        Interpolator: IInterpolator;
        KeyFrameReachedListener: () => void;
    }
    class PropertyLine<T> {
        private keyFrames;
        private property;
        private startTime;
        private lastRunTime;
        private previousFrame;
        constructor(keyFrames: KeyFrame<T>[]);
        StartTime: number;
        animate(): boolean;
    }
    interface IInterpolator {
        (value: number): number;
    }
    class Interpolators {
        static Linear: IInterpolator;
    }
    abstract class AAnimator {
        private static animators;
        private static ANIMATOR_TASK;
        private started;
        static animate(): void;
        start(): void;
        stop(): void;
        Started: boolean;
        Stopped: boolean;
        protected abstract onAnimate(): void;
    }
    class Timeline extends AAnimator {
        private keyFrames;
        private propertyLines;
        private repeatCount;
        private finishedEvent;
        constructor(keyFrames: KeyFrame<any>[]);
        createPropertyLines(): void;
        start(repeatCount?: number): void;
        stop(): void;
        onAnimate(): void;
        onFinishedEvent(): Event<TimelineFinishedEventArgs>;
    }
    class TimelineFinishedEventArgs {
        private stopped;
        constructor(stopped?: boolean);
        Stopped: boolean;
    }
    class NumberProperty extends Property<number> {
        animate(pos: number, startValue: number, endValue: number): number;
    }
    class StringProperty extends Property<string> {
    }
    class PaddingProperty extends Property<Padding> {
    }
    class BorderProperty extends Property<Border> {
    }
    class BackgroundProperty extends Property<ABackground> {
    }
    class BooleanProperty extends Property<boolean> {
    }
}
declare module cubee {
    interface IStyle {
        apply(element: HTMLElement): void;
    }
    abstract class ABackground implements IStyle {
        abstract apply(element: HTMLElement): void;
    }
    class Color {
        private static _TRANSPARENT;
        static TRANSPARENT: Color;
        static getArgbColor(argb: number): Color;
        static getArgbColorByComponents(alpha: number, red: number, green: number, blue: number): Color;
        static getRgbColor(rgb: number): Color;
        static getRgbColorByComponents(red: number, green: number, blue: number): Color;
        private static fixComponent(component);
        static fadeColors(startColor: Color, endColor: Color, fadePosition: number): Color;
        private static mixComponent(startValue, endValue, pos);
        private _argb;
        constructor(argb: number);
        argb: number;
        alpha: number;
        red: number;
        green: number;
        blue: number;
        fade(fadeColor: Color, fadePosition: number): Color;
        toCSS(): string;
    }
    class ColorBackground extends ABackground {
        private _color;
        private _cache;
        constructor(color: Color);
        color: Color;
        apply(element: HTMLElement): void;
    }
    class Padding implements IStyle {
        private _left;
        private _top;
        private _right;
        private _bottom;
        static create(padding: number): cubee.Padding;
        constructor(_left: number, _top: number, _right: number, _bottom: number);
        left: number;
        top: number;
        right: number;
        bottom: number;
        apply(element: HTMLElement): void;
    }
    class Border implements IStyle {
        private _leftWidth;
        private _topWidth;
        private _rightWidth;
        private _bottomWidth;
        private _leftColor;
        private _topColor;
        private _rightColor;
        private _bottomColor;
        private _topLeftRadius;
        private _topRightRadius;
        private _bottomLeftRadius;
        private _bottomRightRadius;
        static create(width: number, color: Color, radius: number): cubee.Border;
        constructor(_leftWidth: number, _topWidth: number, _rightWidth: number, _bottomWidth: number, _leftColor: Color, _topColor: Color, _rightColor: Color, _bottomColor: Color, _topLeftRadius: number, _topRightRadius: number, _bottomLeftRadius: number, _bottomRightRadius: number);
        leftWidth: number;
        topWidth: number;
        rightWidth: number;
        bottomWidth: number;
        leftColor: Color;
        topColor: Color;
        rightColor: Color;
        bottomColor: Color;
        topLeftRadius: number;
        topRightRadius: number;
        bottomLeftRadius: number;
        bottomRightRadius: number;
        apply(element: HTMLElement): void;
    }
    class BoxShadow implements IStyle {
        private _hPos;
        private _vPos;
        private _blur;
        private _spread;
        private _color;
        private _inner;
        constructor(_hPos: number, _vPos: number, _blur: number, _spread: number, _color: Color, _inner: boolean);
        hPos: number;
        vPos: number;
        blur: number;
        spread: number;
        color: Color;
        inner: boolean;
        apply(element: HTMLElement): void;
    }
}
declare module cubee {
    class ECursor {
        private _css;
        private static auto;
        static AUTO: cubee.ECursor;
        constructor(_css: string);
        css: string;
    }
    class LayoutChildren {
        private parent;
        private children;
        constructor(parent: ALayout);
        add(component: AComponent): void;
        insert(index: number, component: AComponent): void;
        removeComponent(component: AComponent): void;
        removeIndex(index: number): void;
        clear(): void;
        get(index: number): AComponent;
        indexOf(component: AComponent): number;
        size(): number;
    }
    abstract class ALayout extends AComponent {
        private _children;
        constructor(element: HTMLElement);
        children: cubee.LayoutChildren;
        abstract _onChildAdded(child: AComponent): void;
        abstract _onChildRemoved(child: AComponent, index: number): void;
        abstract _onChildrenCleared(): void;
        layout(): void;
        _doPointerEventClimbingUp(screenX: number, screenY: number, x: number, y: number, wheelVelocity: number, altPressed: boolean, ctrlPressed: boolean, shiftPressed: boolean, metaPressed: boolean, type: number, button: number, event: MouseEvent): boolean;
        private _rotatePoint(cx, cy, x, y, angle);
        protected abstract onLayout(): void;
        getComponentsAtPosition(x: number, y: number): AComponent[];
        private getComponentsAtPosition_impl(root, x, y, result);
        protected setChildLeft(child: AComponent, left: number): void;
        protected setChildTop(child: AComponent, top: number): void;
    }
    abstract class AUserControl extends ALayout {
        private _width;
        private _height;
        private _background;
        private _shadow;
        private _draggable;
        constructor();
        Width: NumberProperty;
        width: number;
        Height: NumberProperty;
        height: number;
        Background: BackgroundProperty;
        background: ABackground;
        Shadow: cubee.Property<BoxShadow>;
        shadow: BoxShadow;
        Draggable: BooleanProperty;
        draggable: boolean;
        _onChildAdded(child: AComponent): void;
        _onChildRemoved(child: AComponent, index: number): void;
        _onChildrenCleared(): void;
        protected onLayout(): void;
    }
    abstract class AComponent {
        private _translateX;
        private _translateY;
        private _rotate;
        private _scaleX;
        private _scaleY;
        private _transformCenterX;
        private _transformCenterY;
        private _padding;
        private _border;
        private _measuredWidth;
        private _measuredHeight;
        private _clientWidth;
        private _clientHeight;
        private _boundsWidth;
        private _boundsHeight;
        private _boundsLeft;
        private _boundsTop;
        private _measuredWidthSetter;
        private _measuredHeightSetter;
        private _clientWidthSetter;
        private _clientHeightSetter;
        private _boundsWidthSetter;
        private _boundsHeightSetter;
        private _boundsLeftSetter;
        private _boundsTopSetter;
        private _cursor;
        private _pointerTransparent;
        private _handlePointer;
        private _visible;
        private _enabled;
        private _alpha;
        private _selectable;
        private _minWidth;
        private _minHeight;
        private _maxWidth;
        private _maxHeight;
        private _hovered;
        private _hoveredSetter;
        private _pressed;
        private _pressedSetter;
        private onClick;
        private onMouseDown;
        private onMouseDrag;
        private onMouseMove;
        private onMouseUp;
        private onMouseEnter;
        private onMouseLeave;
        private onMouseWheel;
        private onKeyDown;
        private onKeyPress;
        private onKeyUp;
        private onParentChanged;
        private onContextMenu;
        private left;
        private top;
        private element;
        private parent;
        needsLayout: boolean;
        private cubeePanel;
        private transformChangedListener;
        private postConstructRunOnce;
        constructor(rootElement: HTMLElement);
        private invokePostConstruct();
        protected postConstruct(): void;
        setCubeePanel(cubeePanel: CubeePanel): void;
        getCubeePanel(): CubeePanel;
        private updateTransform();
        requestLayout(): void;
        measure(): void;
        private onMeasure();
        scalePoint(centerX: number, centerY: number, pointX: number, pointY: number, scaleX: number, scaleY: number): cubee.Point2D;
        private rotatePoint(cx, cy, x, y, angle);
        Element: HTMLElement;
        Parent: ALayout;
        _setParent(parent: ALayout): void;
        layout(): void;
        NeedsLayout: boolean;
        TranslateX: NumberProperty;
        translateX: number;
        TranslateY: NumberProperty;
        translateY: number;
        Padding: PaddingProperty;
        padding: Padding;
        Border: BorderProperty;
        border: Border;
        MeasuredWidth: NumberProperty;
        measuredWidth: number;
        MeasuredHeight: NumberProperty;
        measuredHeight: number;
        ClientWidth: NumberProperty;
        clientWidth: number;
        ClientHeight: NumberProperty;
        clientHeight: number;
        BoundsWidth: NumberProperty;
        boundsWidth: number;
        BoundsHeight: NumberProperty;
        boundsHeight: number;
        BoundsLeft: NumberProperty;
        boundsLeft: number;
        BoundsTop: NumberProperty;
        boundsTop: number;
        MinWidth: NumberProperty;
        minWIdth: number;
        MinHeight: NumberProperty;
        minHeight: number;
        MaxWidth: NumberProperty;
        maxWidth: number;
        MaxHeight: NumberProperty;
        maxHeight: number;
        protected setPosition(left: number, top: number): void;
        _setLeft(left: number): void;
        _setTop(top: number): void;
        protected setSize(width: number, height: number): void;
        Cursor: cubee.Property<ECursor>;
        cursor: ECursor;
        PointerTransparent: cubee.Property<boolean>;
        pointerTransparent: boolean;
        Visible: cubee.Property<boolean>;
        visible: boolean;
        OnClick: Event<ClickEventArgs>;
        OnContextMenu: Event<ContextMenuEventArgs>;
        OnMouseDown: Event<MouseDownEventArgs>;
        OnMouseMove: Event<MouseMoveEventArgs>;
        OnMouseUp: Event<MouseUpEventArgs>;
        OnMouseEnter: Event<Object>;
        OnMouseLeave: Event<Object>;
        OnMouseWheel: Event<MouseWheelEventArgs>;
        OnKeyDown: Event<KeyEventArgs>;
        OnKeyPress: Event<KeyEventArgs>;
        OnKeyUp: Event<KeyEventArgs>;
        OnParentChanged: Event<ParentChangedEventArgs>;
        Alpha: NumberProperty;
        alpha: number;
        HandlePointer: cubee.Property<boolean>;
        handlePointer: boolean;
        Enabled: cubee.Property<boolean>;
        enabled: boolean;
        Selectable: cubee.Property<boolean>;
        selectable: boolean;
        Left: number;
        Top: number;
        _doPointerEventClimbingUp(screenX: number, screenY: number, x: number, y: number, wheelVelocity: number, altPressed: boolean, ctrlPressed: boolean, shiftPressed: boolean, metaPressed: boolean, eventType: number, button: number, nativeEvent: UIEvent): boolean;
        protected onPointerEventClimbingUp(screenX: number, screenY: number, x: number, y: number, wheelVelocity: number, altPressed: boolean, ctrlPressed: boolean, shiftPressed: boolean, metaPressed: boolean, eventType: number, button: number): boolean;
        protected onPointerEventFallingDown(screenX: number, screenY: number, x: number, y: number, wheelVelocity: number, altPressed: boolean, ctrlPressed: boolean, shiftPressed: boolean, metaPressed: boolean, eventType: number, button: number, nativeEvent: UIEvent): boolean;
        _isIntersectsPoint(x: number, y: number): boolean;
        private isPointIntersectsLine(px, py, lx1, ly1, lx2, ly2);
        Rotate: NumberProperty;
        rotate: number;
        ScaleX: NumberProperty;
        scaleX: number;
        ScaleY: NumberProperty;
        scaleY: number;
        TransformCenterX: NumberProperty;
        transformCenterX: number;
        TransformCenterY: NumberProperty;
        transformCenterY: number;
        Hovered: cubee.Property<boolean>;
        hovered: boolean;
        Pressed: cubee.Property<boolean>;
        pressed: boolean;
    }
    class MouseEventTypes {
        static MOUSE_DOWN: number;
        static MOUSE_MOVE: number;
        static MOUSE_UP: number;
        static MOUSE_ENTER: number;
        static MOUSE_LEAVE: number;
        static MOUSE_WHEEL: number;
        constructor();
    }
}
declare module cubee {
    class Panel extends AUserControl {
    }
}
declare module cubee {
    class CubeePanel {
        private _layoutRunOnce;
        private _contentPanel;
        private _rootComponent;
        private _element;
        private _left;
        private _top;
        private _clientWidth;
        private _clientHeight;
        private _offsetWidth;
        private _offsetHeight;
        constructor(element: HTMLDivElement);
        private checkBounds();
        requestLayout(): void;
        layout(): void;
        rootComponent: AComponent;
        _doPointerEventClimbingUp(screenX: number, screenY: number, wheelVelocity: number, altPressed: boolean, ctrlPressed: boolean, shiftPressed: boolean, metaPressed: boolean, eventType: number, button: number, nativeEvent: MouseEvent): boolean;
        ClientWidth: NumberProperty;
        clientWidth: number;
        ClientHeight: NumberProperty;
        clientHeight: number;
        BoundsWidth: NumberProperty;
        boundsWidth: number;
        BoundsHeight: NumberProperty;
        boundsHeight: number;
        BoundsLeft: NumberProperty;
        boundsLeft: number;
        BoundsTop: NumberProperty;
        boundsTop: number;
    }
}
declare module cubee {
    class APopup {
        private _modal;
        private _autoClose;
        private _glassColor;
        private _translateX;
        private _translateY;
        private _center;
        private _popupRoot;
        private _rootComponentContainer;
        private _rootComponent;
        private _visible;
        constructor(modal?: boolean, autoClose?: boolean, glassColor?: Color);
        __popupRoot: Panel;
        protected rootComponent: AComponent;
        protected show(): void;
        protected close(): boolean;
        protected isCloseAllowed(): boolean;
        protected onClosed(): void;
        modal: boolean;
        autoClose: boolean;
        glassColor: Color;
        TranslateX: NumberProperty;
        translateX: number;
        TranslateY: NumberProperty;
        translateY: number;
        Center: BooleanProperty;
        center: boolean;
        _doPointerEventClimbingUp(screenX: number, screenY: number, x: number, y: number, wheelVelocity: number, altPressed: boolean, ctrlPressed: boolean, shiftPressed: boolean, metaPressed: boolean, eventType: number, button: number, nativeEvent: MouseEvent): boolean;
        _layout(): void;
    }
    class Popups {
        private static _popups;
        private static _layoutRunOnce;
        static _addPopup(popup: APopup): void;
        static _removePopup(popup: APopup): void;
        static _requestLayout(): void;
        private static layout();
        static doPointerEventClimbingUp(x: number, y: number, wheelVelocity: number, altPressed: boolean, ctrlPressed: boolean, shiftPressed: boolean, metaPressed: boolean, eventType: number, button: number, nativeEvent: MouseEvent): boolean;
        constructor();
    }
}
