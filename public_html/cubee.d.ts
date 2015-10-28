declare module cubee {
    class EventArgs {
        sender: Object;
        constructor(sender: Object);
    }
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
        constructor();
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
        private _value;
        private _nullable;
        private _readonly;
        private _validator;
        private static _nextId;
        private _changeListeners;
        private _valid;
        private _bindingSource;
        private _readonlyBind;
        private _bidirectionalBindProperty;
        private _bidirectionalChangeListenerThis;
        private _bidirectionalChangeListenerOther;
        private _id;
        private bindListener;
        constructor(_value?: T, _nullable?: boolean, _readonly?: boolean, _validator?: IValidator<T>);
        id: string;
        valid: boolean;
        value: T;
        nullable: boolean;
        readonly: boolean;
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
        private _time;
        private _property;
        private _endValue;
        private _keyframeReachedListener;
        private _interpolator;
        constructor(_time: number, _property: Property<T>, _endValue: T, _keyframeReachedListener?: {
            (): void;
        }, _interpolator?: IInterpolator);
        time: number;
        property: Property<T>;
        endValue: T;
        interpolator: IInterpolator;
        keyFrameReachedListener: () => void;
    }
    class PropertyLine<T> {
        private _keyFrames;
        private _property;
        private _startTime;
        private _lastRunTime;
        private _previousFrame;
        constructor(_keyFrames: KeyFrame<T>[]);
        startTime: number;
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
    class ColorProperty extends Property<Color> {
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
        private static _BLACK;
        static BLACK: Color;
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
        static create(padding: number): Padding;
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
        static create(width: number, color: Color, radius: number): Border;
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
    class ETextOverflow implements IStyle {
        private _css;
        private static _CLIP;
        private static _ELLIPSIS;
        static CLIP: ETextOverflow;
        static ELLIPSIS: ETextOverflow;
        constructor(_css: string);
        CSS: string;
        apply(element: HTMLElement): void;
    }
    class ETextAlign implements IStyle {
        private _css;
        private static _LEFT;
        private static _CENTER;
        private static _RIGHT;
        private static _JUSTIFY;
        static LEFT: ETextAlign;
        static CENTER: ETextAlign;
        static RIGHT: ETextAlign;
        static JUSTIFY: ETextAlign;
        constructor(_css: string);
        CSS: string;
        apply(element: HTMLElement): void;
    }
    class EHAlign {
        private _css;
        private static _LEFT;
        private static _CENTER;
        private static _RIGHT;
        static LEFT: EHAlign;
        static CENTER: EHAlign;
        static RIGHT: EHAlign;
        constructor(_css: string);
        CSS: string;
    }
    class EVAlign {
        private _css;
        private static _TOP;
        private static _MIDDLE;
        private static _BOTTOM;
        static TOP: EVAlign;
        static MIDDLE: EVAlign;
        static BOTTOM: EVAlign;
        constructor(_css: string);
        CSS: string;
    }
    class FontFamily implements IStyle {
        private _css;
        private static _arial;
        static Arial: FontFamily;
        private static initialized;
        private static initFontContainerStyle();
        static registerFont(name: string, src: string, extra: string): void;
        constructor(_css: string);
        CSS: string;
        apply(element: HTMLElement): void;
    }
    class ECursor {
        private _css;
        private static auto;
        static AUTO: ECursor;
        constructor(_css: string);
        css: string;
    }
}
declare module cubee {
    interface IRunnable {
        (): void;
    }
    class Point2D {
        private _x;
        private _y;
        constructor(_x: number, _y: number);
        x: number;
        y: number;
    }
}
declare module cubee {
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
}
declare module cubee {
    class MouseEventTypes {
        static MOUSE_DOWN: number;
        static MOUSE_MOVE: number;
        static MOUSE_UP: number;
        static MOUSE_ENTER: number;
        static MOUSE_LEAVE: number;
        static MOUSE_WHEEL: number;
        constructor();
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
        private _onClick;
        private _onMouseDown;
        private _onMouseDrag;
        private _onMouseMove;
        private _onMouseUp;
        private _onMouseEnter;
        private _onMouseLeave;
        private _onMouseWheel;
        private _onKeyDown;
        private _onKeyPress;
        private _onKeyUp;
        private _onParentChanged;
        private _onContextMenu;
        private _left;
        private _top;
        private _element;
        private _parent;
        _needsLayout: boolean;
        private _cubeePanel;
        private _transformChangedListener;
        private _postConstructRunOnce;
        constructor(rootElement: HTMLElement);
        private invokePostConstruct();
        protected postConstruct(): void;
        setCubeePanel(cubeePanel: CubeePanel): void;
        getCubeePanel(): CubeePanel;
        private updateTransform();
        requestLayout(): void;
        measure(): void;
        private onMeasure();
        scalePoint(centerX: number, centerY: number, pointX: number, pointY: number, scaleX: number, scaleY: number): Point2D;
        private rotatePoint(cx, cy, x, y, angle);
        element: HTMLElement;
        parent: ALayout;
        _setParent(parent: ALayout): void;
        layout(): void;
        needsLayout: boolean;
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
        protected MinWidth: NumberProperty;
        protected minWidth: number;
        protected MinHeight: NumberProperty;
        protected minHeight: number;
        protected MaxWidth: NumberProperty;
        protected maxWidth: number;
        protected MaxHeight: NumberProperty;
        protected maxHeight: number;
        protected setPosition(left: number, top: number): void;
        _setLeft(left: number): void;
        _setTop(top: number): void;
        protected setSize(width: number, height: number): void;
        Cursor: Property<ECursor>;
        cursor: ECursor;
        PointerTransparent: Property<boolean>;
        pointerTransparent: boolean;
        Visible: Property<boolean>;
        visible: boolean;
        onClick: Event<ClickEventArgs>;
        onContextMenu: Event<ContextMenuEventArgs>;
        onMouseDown: Event<MouseDownEventArgs>;
        onMouseMove: Event<MouseMoveEventArgs>;
        onMouseUp: Event<MouseUpEventArgs>;
        onMouseEnter: Event<Object>;
        onMouseLeave: Event<Object>;
        onMouseWheel: Event<MouseWheelEventArgs>;
        onKeyDown: Event<KeyEventArgs>;
        onKeyPress: Event<KeyEventArgs>;
        onKeyUp: Event<KeyEventArgs>;
        onParentChanged: Event<ParentChangedEventArgs>;
        Alpha: NumberProperty;
        alpha: number;
        HandlePointer: Property<boolean>;
        handlePointer: boolean;
        Enabled: Property<boolean>;
        enabled: boolean;
        Selectable: Property<boolean>;
        selectable: boolean;
        left: number;
        top: number;
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
        Hovered: Property<boolean>;
        hovered: boolean;
        Pressed: Property<boolean>;
        pressed: boolean;
    }
}
declare module cubee {
    abstract class ALayout extends AComponent {
        private _children;
        constructor(element: HTMLElement);
        protected children_inner: LayoutChildren;
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
}
declare module cubee {
    abstract class AUserControl extends ALayout {
        private _width;
        private _height;
        private _background;
        private _shadow;
        private _draggable;
        constructor();
        protected _Width: NumberProperty;
        protected Width: NumberProperty;
        protected width: number;
        protected _Height: NumberProperty;
        protected Height: NumberProperty;
        protected height: number;
        protected _Background: BackgroundProperty;
        protected Background: BackgroundProperty;
        protected background: ABackground;
        protected _Shadow: Property<BoxShadow>;
        protected Shadow: Property<BoxShadow>;
        protected shadow: BoxShadow;
        Draggable: BooleanProperty;
        draggable: boolean;
        _onChildAdded(child: AComponent): void;
        _onChildRemoved(child: AComponent, index: number): void;
        _onChildrenCleared(): void;
        protected onLayout(): void;
    }
}
declare module cubee {
    class Panel extends AUserControl {
        Width: NumberProperty;
        width: number;
        Height: NumberProperty;
        height: number;
        Background: BackgroundProperty;
        background: ABackground;
        Shadow: Property<BoxShadow>;
        shadow: BoxShadow;
        children: LayoutChildren;
    }
}
declare module cubee {
    class HBox extends ALayout {
        private _height;
        private _cellWidths;
        private _hAligns;
        private _vAligns;
        constructor();
        setCellWidth(indexOrComponent: number | AComponent, cellHeight: number): void;
        getCellWidth(indexOrComponent: number | AComponent): number;
        setCellHAlign(indexOrComponent: number | AComponent, hAlign: EHAlign): void;
        getCellHAlign(indexOrComponent: number | AComponent): EHAlign;
        setCellVAlign(indexOrComponent: number | AComponent, vAlign: EVAlign): void;
        getCellVAlign(indexOrComponent: number | AComponent): EVAlign;
        setLastCellHAlign(hAlign: EHAlign): void;
        setLastCellVAlign(vAlign: EVAlign): void;
        setLastCellWidth(width: number): void;
        addEmptyCell(width: number): void;
        _onChildAdded(child: AComponent): void;
        _onChildRemoved(child: AComponent, index: number): void;
        _onChildrenCleared(): void;
        protected onLayout(): void;
        private setInList<T>(list, index, value);
        private getFromList<T>(list, index);
        private removeFromList<T>(list, index);
        children: LayoutChildren;
        Height: NumberProperty;
        height: number;
    }
}
declare module cubee {
    class VBox extends ALayout {
        private _width;
        private _cellHeights;
        private _hAligns;
        private _vAligns;
        constructor();
        children: LayoutChildren;
        setCellHeight(indexOrComponent: number | AComponent, cellHeight: number): void;
        private setInList<T>(list, index, value);
        private getFromList<T>(list, index);
        private removeFromList<T>(list, index);
        getCellHeight(indexOrComponent: number | AComponent): number;
        setCellHAlign(indexOrComponent: number | AComponent, hAlign: EHAlign): void;
        getCellHAlign(indexOrComponent: number | AComponent): EHAlign;
        setCellVAlign(indexOrComponent: number | AComponent, vAlign: EVAlign): void;
        getCellVAlign(indexOrComponent: number | AComponent): EVAlign;
        setLastCellHAlign(hAlign: EHAlign): void;
        setLastCellVAlign(vAlign: EVAlign): void;
        setLastCellHeight(height: number): void;
        addEmptyCell(height: number): void;
        Width: NumberProperty;
        width: number;
        _onChildAdded(child: AComponent): void;
        _onChildRemoved(child: AComponent, index: number): void;
        _onChildrenCleared(): void;
        protected onLayout(): void;
    }
}
declare module cubee {
    class Label extends AComponent {
        private _width;
        private _height;
        private _text;
        private _textOverflow;
        private _foreColor;
        private _textAlign;
        private _verticalAlign;
        private _bold;
        private _italic;
        private _underline;
        private _fontSize;
        private _fontFamily;
        constructor();
        Width: NumberProperty;
        width: number;
        Height: NumberProperty;
        height: number;
        Text: StringProperty;
        text: string;
        TextOverflow: Property<ETextOverflow>;
        textOverflow: ETextOverflow;
        ForeColor: ColorProperty;
        foreColor: Color;
        VerticalAlign: Property<EVAlign>;
        verticalAlign: EVAlign;
        Bold: BooleanProperty;
        bold: boolean;
        Italic: BooleanProperty;
        italic: boolean;
        Underline: BooleanProperty;
        underline: boolean;
        TextAlign: Property<ETextAlign>;
        textAlign: ETextAlign;
        FontSize: NumberProperty;
        fontSize: number;
        FontFamily: Property<FontFamily>;
        fontFamily: FontFamily;
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
    class AView<T> extends AUserControl {
        private _model;
        constructor(_model: T);
        model: T;
    }
}
