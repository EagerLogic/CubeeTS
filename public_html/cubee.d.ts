declare module cubee {
    class EventArgs {
        sender: Object;
        constructor(sender: Object);
    }
    interface IListenerCallback<T> {
        onAdded(listener: IEventListener<T>): void;
        onRemoved(listener: IEventListener<T>): void;
    }
    class HtmlEventListenerCallback<T> implements IListenerCallback<T> {
        private _element;
        private _eventType;
        constructor(_element: HTMLElement, _eventType: string);
        onAdded(listener: IEventListener<T>): void;
        onRemoved(listener: IEventListener<T>): void;
    }
    class Event<T> {
        private _listenerCallback;
        private _listeners;
        constructor(_listenerCallback?: IListenerCallback<T>);
        addListener(listener: IEventListener<T>): void;
        removeListener(listener: IEventListener<T>): void;
        hasListener(listener: IEventListener<T>): boolean;
        fireEvent(args: T): void;
        listenerCallback: IListenerCallback<T>;
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
    class ParentChangedEventArgs extends EventArgs {
        newParent: ALayout;
        sender: Object;
        constructor(newParent: ALayout, sender: Object);
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
        private static _WHITE;
        static WHITE: Color;
        private static _BLACK;
        static BLACK: Color;
        private static _LIGHT_GRAY;
        static LIGHT_GRAY: Color;
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
    enum EScrollBarPolicy {
        VISIBLE = 0,
        AUTO = 1,
        HIDDEN = 2,
    }
    enum EPictureSizeMode {
        NORMAL = 0,
        CENTER = 1,
        STRETCH = 2,
        FILL = 3,
        ZOOM = 4,
        FIT_WIDTH = 5,
        FIT_HEIGHT = 6,
    }
    class Image implements IStyle {
        private _url;
        private _onLoad;
        private _width;
        private _height;
        private _loaded;
        constructor(_url: string);
        url: string;
        onLoad: Event<EventArgs>;
        width: number;
        height: number;
        loaded: boolean;
        apply(element: HTMLElement): void;
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
        protected paddingProperty(): PaddingProperty;
        protected Padding: PaddingProperty;
        protected padding: Padding;
        protected borderProperty(): BorderProperty;
        protected Border: BorderProperty;
        protected border: Border;
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
        protected minWidthProperty(): NumberProperty;
        protected MinWidth: NumberProperty;
        protected minWidth: number;
        protected minHeightProperty(): NumberProperty;
        protected MinHeight: NumberProperty;
        protected minHeight: number;
        protected maxWidthProperty(): NumberProperty;
        protected MaxWidth: NumberProperty;
        protected maxWidth: number;
        protected maxHeightProperty(): NumberProperty;
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
        onClick: Event<MouseEvent>;
        onContextMenu: Event<Object>;
        onMouseDown: Event<MouseEvent>;
        onMouseMove: Event<MouseEvent>;
        onMouseUp: Event<MouseEvent>;
        onMouseEnter: Event<MouseEvent>;
        onMouseLeave: Event<MouseEvent>;
        onMouseWheel: Event<MouseEvent>;
        onKeyDown: Event<KeyboardEvent>;
        onKeyPress: Event<KeyboardEvent>;
        onKeyUp: Event<KeyboardEvent>;
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
        protected widthProperty(): NumberProperty;
        protected Width: NumberProperty;
        protected width: number;
        protected heightProperty(): NumberProperty;
        protected Height: NumberProperty;
        protected height: number;
        protected backgroundProperty(): BackgroundProperty;
        protected Background: BackgroundProperty;
        protected background: ABackground;
        protected shadowProperty(): Property<BoxShadow>;
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
    class AView<T> extends AUserControl {
        private _model;
        constructor(_model: T);
        model: T;
    }
}
declare module cubee {
    class Panel extends AUserControl {
        protected widthProperty(): NumberProperty;
        Width: NumberProperty;
        width: number;
        protected heightProperty(): NumberProperty;
        Height: NumberProperty;
        height: number;
        protected backgroundProperty(): BackgroundProperty;
        Background: BackgroundProperty;
        background: ABackground;
        protected shadowProperty(): Property<BoxShadow>;
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
    class ScrollBox extends AUserControl {
        private _content;
        private _hScrollPolicy;
        private _vScrollPolicy;
        private _scrollWidth;
        private _scrollHeight;
        private _hScrollPos;
        private _vScrollPos;
        private _maxHScrollPos;
        private _maxVScrollPos;
        private _maxHScrollPosWriter;
        private _maxVScrollPosWriter;
        private _calculateScrollWidthExp;
        private _calculateScrollHeightExp;
        constructor();
        protected widthProperty(): NumberProperty;
        Width: NumberProperty;
        width: number;
        protected heightProperty(): NumberProperty;
        Height: NumberProperty;
        height: number;
        Content: Property<AComponent>;
        content: AComponent;
        HScrollPolicy: Property<EScrollBarPolicy>;
        hScrollPolicy: EScrollBarPolicy;
        VScrollPolicy: Property<EScrollBarPolicy>;
        vScrollPolicy: EScrollBarPolicy;
        ScrollWidth: NumberProperty;
        scrollWidth: number;
        ScrollHeight: NumberProperty;
        scrollHeight: number;
        HScrollPos: NumberProperty;
        hScrollPos: number;
        VScrollPos: NumberProperty;
        vScrollPos: number;
        MaxHScrollPos: NumberProperty;
        maxHScrollPos: number;
        MaxVScrollPos: NumberProperty;
        maxVScrollPos: number;
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
    class Button extends AComponent {
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
        private _background;
        private _shadow;
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
        Background: BackgroundProperty;
        background: ABackground;
        Shadow: Property<BoxShadow>;
        shadow: BoxShadow;
    }
}
declare module cubee {
    class TextBox extends AComponent {
        private _width;
        private _height;
        private _text;
        private _background;
        private _foreColor;
        private _textAlign;
        private _verticalAlign;
        private _bold;
        private _italic;
        private _underline;
        private _fontSize;
        private _fontFamily;
        private _placeholder;
        constructor();
        Width: NumberProperty;
        width: number;
        Height: NumberProperty;
        height: number;
        Text: StringProperty;
        text: string;
        Background: BackgroundProperty;
        background: ABackground;
        ForeColor: ColorProperty;
        foreColor: Color;
        TextAlign: Property<ETextAlign>;
        textAlign: ETextAlign;
        VerticalAlign: Property<EVAlign>;
        verticalAlign: EVAlign;
        Bold: BooleanProperty;
        bold: boolean;
        Italic: BooleanProperty;
        italic: boolean;
        Underline: BooleanProperty;
        underline: boolean;
        FontSize: NumberProperty;
        fontSize: number;
        FontFamily: Property<FontFamily>;
        fontFamily: FontFamily;
        Placeholder: StringProperty;
        placeholder: string;
    }
}
declare module cubee {
    class PasswordBox extends AComponent {
        private _width;
        private _height;
        private _text;
        private _background;
        private _foreColor;
        private _textAlign;
        private _verticalAlign;
        private _bold;
        private _italic;
        private _underline;
        private _fontSize;
        private _fontFamily;
        private _placeholder;
        constructor();
        Width: NumberProperty;
        width: number;
        Height: NumberProperty;
        height: number;
        Text: StringProperty;
        text: string;
        Background: BackgroundProperty;
        background: ABackground;
        ForeColor: ColorProperty;
        foreColor: Color;
        TextAlign: Property<ETextAlign>;
        textAlign: ETextAlign;
        VerticalAlign: Property<EVAlign>;
        verticalAlign: EVAlign;
        Bold: BooleanProperty;
        bold: boolean;
        Italic: BooleanProperty;
        italic: boolean;
        Underline: BooleanProperty;
        underline: boolean;
        FontSize: NumberProperty;
        fontSize: number;
        FontFamily: Property<FontFamily>;
        fontFamily: FontFamily;
        Placeholder: StringProperty;
        placeholder: string;
    }
}
declare module cubee {
    class TextArea extends AComponent {
        private _width;
        private _height;
        private _text;
        private _background;
        private _foreColor;
        private _textAlign;
        private _verticalAlign;
        private _bold;
        private _italic;
        private _underline;
        private _fontSize;
        private _fontFamily;
        private _placeholder;
        constructor();
        Width: NumberProperty;
        width: number;
        Height: NumberProperty;
        height: number;
        Text: StringProperty;
        text: string;
        Background: BackgroundProperty;
        background: ABackground;
        ForeColor: ColorProperty;
        foreColor: Color;
        TextAlign: Property<ETextAlign>;
        textAlign: ETextAlign;
        VerticalAlign: Property<EVAlign>;
        verticalAlign: EVAlign;
        Bold: BooleanProperty;
        bold: boolean;
        Italic: BooleanProperty;
        italic: boolean;
        Underline: BooleanProperty;
        underline: boolean;
        FontSize: NumberProperty;
        fontSize: number;
        FontFamily: Property<FontFamily>;
        fontFamily: FontFamily;
        Placeholder: StringProperty;
        placeholder: string;
    }
}
declare module cubee {
    class CheckBox extends AComponent {
        private _checked;
        constructor();
        Checked: BooleanProperty;
        checked: boolean;
    }
}
declare module cubee {
    class ComboBox<T> extends AComponent {
        private _selectedIndex;
        private _selectedItem;
        private items;
        private _width;
        private _height;
        private _text;
        private _background;
        private _foreColor;
        private _textAlign;
        private _verticalAlign;
        private _bold;
        private _italic;
        private _underline;
        private _fontSize;
        private _fontFamily;
        private _placeholder;
        constructor();
        Width: NumberProperty;
        width: number;
        Height: NumberProperty;
        height: number;
        Text: StringProperty;
        text: string;
        Background: BackgroundProperty;
        background: ABackground;
        ForeColor: ColorProperty;
        foreColor: Color;
        TextAlign: Property<ETextAlign>;
        textAlign: ETextAlign;
        VerticalAlign: Property<EVAlign>;
        verticalAlign: EVAlign;
        Bold: BooleanProperty;
        bold: boolean;
        Italic: BooleanProperty;
        italic: boolean;
        Underline: BooleanProperty;
        underline: boolean;
        FontSize: NumberProperty;
        fontSize: number;
        FontFamily: Property<FontFamily>;
        fontFamily: FontFamily;
        Placeholder: StringProperty;
        placeholder: string;
        protected selectedIndexProperty(): NumberProperty;
        SelectedIndex: NumberProperty;
        selectedIndex: number;
        protected selectedItemProperty(): Property<T>;
        SelectedItem: Property<T>;
        selectedItem: T;
    }
}
declare module cubee {
    class PictureBox extends AComponent {
        private _width;
        private _height;
        private _pictureSizeMode;
        private _image;
        private _background;
        private _imgElement;
        constructor();
        private recalculateSize();
        protected pictureSizeModeProperty(): Property<EPictureSizeMode>;
        PictureSizeMode: Property<EPictureSizeMode>;
        pictureSizeMode: EPictureSizeMode;
        protected widthProperty(): NumberProperty;
        Width: NumberProperty;
        width: number;
        protected heightProperty(): NumberProperty;
        Height: NumberProperty;
        height: number;
        protected paddingProperty(): PaddingProperty;
        Padding: PaddingProperty;
        padding: Padding;
        protected borderProperty(): BorderProperty;
        Border: BorderProperty;
        border: Border;
        protected backgroundProperty(): BackgroundProperty;
        Background: BackgroundProperty;
        background: ABackground;
        protected imageProperty(): Property<Image>;
        Image: Property<Image>;
        image: Image;
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
        _layout(): void;
    }
    class Popups {
        private static _popups;
        private static _layoutRunOnce;
        static _addPopup(popup: APopup): void;
        static _removePopup(popup: APopup): void;
        static _requestLayout(): void;
        private static layout();
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
    class EIcon {
        private _value;
        private static _ADJUST;
        static ADJUST: EIcon;
        private static _ANCHOR;
        static ANCHOR: EIcon;
        private static _ARCHIVE;
        static ARCHIVE: EIcon;
        private static _ARROWS;
        static ARROWS: EIcon;
        private static _ARROWS_H;
        static ARROWS_H: EIcon;
        private static _ARROWS_V;
        static ARROWS_V: EIcon;
        private static _ASTERISK;
        static ASTERISK: EIcon;
        private static _BAN;
        static BAN: EIcon;
        private static _BAR_CHART_O;
        static BAR_CHART_O: EIcon;
        private static _BARCODE;
        static BARCODE: EIcon;
        private static _BARS;
        static BARS: EIcon;
        private static _BEER;
        static BEER: EIcon;
        private static _BELL;
        static BELL: EIcon;
        private static _BELL_O;
        static BELL_O: EIcon;
        private static _BOLT;
        static BOLT: EIcon;
        private static _BOOK;
        static BOOK: EIcon;
        private static _BOOKMARK;
        static BOOKMARK: EIcon;
        private static _BOOKMARK_O;
        static BOOKMARK_O: EIcon;
        private static _BRIEFCASE;
        static BRIEFCASE: EIcon;
        private static _BUG;
        static BUG: EIcon;
        private static _BUILDING_O;
        private static _BULLHORN;
        private static _BULLSEYE;
        private static _CALENDAR;
        private static _CALENDAR_O;
        private static _CAMERA;
        private static _CAMERA_RETRO;
        private static _CARET_SQUARE_O_DOWN;
        private static _CARET_SQUARE_O_RIGHT;
        private static _CARET_SQUARE_O_UP;
        private static _CERTIFICATE;
        private static _CHECK;
        private static _CHECK_CIRCLE;
        private static _CHECK_CIRCLE_O;
        private static _CHECK_SQUARE;
        private static _CHECK_SQUARE_O;
        private static _CIRCLE;
        private static _CIRCLE_O;
        private static _CLOCK_O;
        private static _CLOUD;
        private static _CLOUD_DOWNLOAD;
        private static _CLOUD_UPLOAD;
        private static _CODE;
        private static _CODE_FORK;
        private static _COFFEE;
        private static _COG;
        private static _COGS;
        private static _COMMENT;
        private static _COMMENT_O;
        private static _COMMENTS;
        private static _COMMENTS_O;
        private static _COMPASS;
        private static _CREDIT_CARD;
        private static _CROP;
        private static _CROSSHAIRS;
        private static _CUTLERY;
        private static _DASHBOARD;
        private static _DESKTOP;
        private static _DOWNLOAD;
        private static _EDIT;
        private static _ELLIPSIS_H;
        private static _ELLIPSIS_V;
        private static _ENVELOPE;
        private static _ENVELOPE_O;
        private static _ERASER;
        private static _EXCHANGE;
        private static _EXCLAMATION;
        private static _EXCLAMATION_CIRCLE;
        private static _EXCLAMATION_TRIANGLE;
        private static _EXTERNAL_LINK;
        private static _EXTERNAL_LINK_SQUARE;
        private static _EYE;
        private static _EYE_SLASH;
        private static _FEMALE;
        private static _FIGHTER_JET;
        private static _FILM;
        private static _FILTER;
        private static _FIRE;
        private static _FIRE_EXTINGUISHER;
        private static _FLAG;
        private static _FLAG_CHECKERED;
        private static _FLAG_O;
        private static _FLASH;
        private static _FLASK;
        private static _FOLDER;
        private static _FOLDER_O;
        private static _FOLDER_OPEN;
        private static _FOLDER_OPEN_O;
        private static _FROWN_O;
        private static _GAMEPAD;
        private static _GAVEL;
        private static _GEAR;
        private static _GEARS;
        private static _GIFT;
        private static _GLASS;
        private static _GLOBE;
        private static _GROUP;
        private static _HDD_O;
        private static _HEADPHONES;
        private static _HEART;
        private static _HEART_O;
        private static _HOME;
        private static _INBOX;
        private static _INFO;
        private static _INFO_CIRCLE;
        private static _KEY;
        private static _KEYBOARD_O;
        private static _LAPTOP;
        private static _LEAF;
        private static _LEGAL;
        private static _LEMON_O;
        private static _LEVEL_DOWN;
        private static _LEVEL_UP;
        private static _LIGHTBULB_O;
        private static _LOCATION_ARROW;
        private static _LOCK;
        private static _MAGIC;
        private static _MAGNET;
        private static _MAIL_FORWARD;
        private static _MAIL_REPLY;
        private static _MAIL_REPLY_ALL;
        private static _MALE;
        private static _MAP_MARKER;
        private static _MEH_O;
        private static _MICROPHONE;
        private static _MICROPHONE_SLASH;
        private static _MINUS;
        private static _MINUS_CIRCLE;
        private static _MINUS_SQUARE;
        private static _MINUS_SQUARE_O;
        private static _MOBILE;
        private static _MOBILE_PHONE;
        private static _MONEY;
        private static _MOON_O;
        private static _MUSIC;
        private static _PENCIL;
        private static _PENCIL_SQUARE;
        private static _PENCIL_SQUARE_O;
        private static _PHONE;
        private static _PHONE_SQUARE;
        private static _PICTURE_O;
        private static _PLANE;
        private static _PLUS;
        private static _PLUS_CIRCLE;
        private static _PLUS_SQUARE;
        private static _PLUS_SQUARE_O;
        private static _POWER_OFF;
        private static _PRINT;
        private static _PUZZLE_PIECE;
        private static _QRCODE;
        private static _QUESTION;
        private static _QUESTION_CIRCLE;
        private static _QUOTE_LEFT;
        private static _QUOTE_RIGHT;
        private static _RANDOM;
        private static _REFRESH;
        private static _REPLY;
        private static _REPLY_ALL;
        private static _RETWEET;
        private static _ROAD;
        private static _ROCKET;
        private static _RSS;
        private static _RSS_SQUARE;
        private static _SEARCH;
        private static _SEARCH_MINUS;
        private static _SEARCH_PLUS;
        private static _SHARE;
        private static _SHARE_SQUARE;
        private static _SHARE_SQUARE_O;
        private static _SHIELD;
        private static _SHOPPING_CART;
        private static _SIGN_IN;
        private static _SIGN_OUT;
        private static _SIGNAL;
        private static _SITEMAP;
        private static _SMILE_O;
        private static _SORT;
        private static _SORT_ALPHA_ASC;
        private static _SORT_ALPHA_DESC;
        private static _SORT_AMOUNT_ASC;
        private static _SORT_AMOUNT_DESC;
        private static _SORT_ASC;
        private static _SORT_DESC;
        private static _SORT_DOWN;
        private static _SORT_NUMERIC_ASC;
        private static _SORT_NUMERIC_DESC;
        private static _SORT_UP;
        private static _SPINNER;
        private static _SQUARE;
        private static _SQUARE_O;
        private static _STAR;
        private static _STAR_HALF;
        private static _STAR_HALF_EMPTY;
        private static _STAR_HALF_FULL;
        private static _STAR_HALF_O;
        private static _STAR_O;
        private static _SUBSCRIPT;
        private static _SUITCASE;
        private static _SUN_O;
        private static _SUPERSCRIPT;
        private static _TABLET;
        private static _TACHOMETER;
        private static _TAG;
        private static _TAGS;
        private static _TASKS;
        private static _TERMINAL;
        private static _THUMB_TACK;
        private static _THUMBS_DOWN;
        private static _THUMBS_O_DOWN;
        private static _THUMBS_O_UP;
        private static _THUMBS_UP;
        private static _TICKET;
        private static _TIMES;
        private static _TIMES_CIRCLE;
        private static _TIMES_CIRCLE_O;
        private static _TINT;
        private static _TOGGLE_DOWN;
        private static _TOGGLE_LEFT;
        private static _TOGGLE_RIGHT;
        private static _TOGGLE_UP;
        private static _TRASH_O;
        private static _TROPHY;
        private static _TRUCK;
        private static _UMBRELLA;
        private static _UNLOCK;
        private static _UNLOCK_ALT;
        private static _UNSORTED;
        private static _UPLOAD;
        private static _USER;
        private static _USERS;
        private static _VIDEO_CAMERA;
        private static _VOLUME_DOWN;
        private static _VOLUME_OFF;
        private static _VOLUME_UP;
        private static _WARNING;
        private static _WHEELCHAIR;
        private static _WRENCH;
        private static _DOT_CIRCLE_O;
        private static _BITCOIN;
        private static _BTC;
        private static _CNY;
        private static _DOLLAR;
        private static _EUR;
        private static _EURO;
        private static _GBP;
        private static _INR;
        private static _JPY;
        private static _KRW;
        private static _RMB;
        private static _ROUBLE;
        private static _RUB;
        private static _RUBLE;
        private static _RUPEE;
        private static _TRY;
        private static _TURKISH_LIRA;
        private static _USD;
        private static _WON;
        private static _YEN;
        private static _ALIGN_CENTER;
        private static _ALIGN_JUSTIFY;
        private static _ALIGN_LEFT;
        private static _ALIGN_RIGHT;
        private static _BOLD;
        private static _CHAIN;
        private static _CHAIN_BROKEN;
        private static _CLIPBOARD;
        private static _COLUMNS;
        private static _COPY;
        private static _CUT;
        private static _DEDENT;
        private static _FILE;
        private static _FILE_O;
        private static _FILE_TEXT;
        private static _FILE_TEXT_O;
        private static _FILES_O;
        private static _FLOPPY_O;
        private static _FONT;
        private static _INDENT;
        private static _ITALIC;
        private static _LINK;
        private static _LIST;
        private static _LIST_ALT;
        private static _LIST_OL;
        private static _LIST_UL;
        private static _OUTDENT;
        private static _PAPERCLIP;
        private static _PASTE;
        private static _REPEAT;
        private static _ROTATE_LEFT;
        private static _ROTATE_RIGHT;
        private static _SAVE;
        private static _SCISSORS;
        private static _STRIKETHROUGH;
        private static _TABLE;
        private static _TEXT_HEIGHT;
        private static _TEXT_WIDTH;
        private static _TH;
        private static _TH_LARGE;
        private static _TH_LIST;
        private static _UNDERLINE;
        private static _UNDO;
        private static _UNLINK;
        private static _ANGLE_DOUBLE_DOWN;
        private static _ANGLE_DOUBLE_LEFT;
        private static _ANGLE_DOUBLE_RIGHT;
        private static _ANGLE_DOUBLE_UP;
        private static _ANGLE_DOWN;
        private static _ANGLE_LEFT;
        private static _ANGLE_RIGHT;
        private static _ANGLE_UP;
        private static _ARROW_CIRCLE_DOWN;
        private static _ARROW_CIRCLE_LEFT;
        private static _ARROW_CIRCLE_O_DOWN;
        private static _ARROW_CIRCLE_O_LEFT;
        private static _ARROW_CIRCLE_O_RIGHT;
        private static _ARROW_CIRCLE_O_UP;
        private static _ARROW_CIRCLE_RIGHT;
        private static _ARROW_CIRCLE_UP;
        private static _ARROW_DOWN;
        private static _ARROW_LEFT;
        private static _ARROW_RIGHT;
        private static _ARROW_UP;
        private static _ARROWS_ALT;
        private static _CARET_DOWN;
        private static _CARET_LEFT;
        private static _CARET_RIGHT;
        private static _CARET_SQUARE_O_LEFT;
        private static _CARET_UP;
        private static _CHEVRON_CIRCLE_DOWN;
        private static _CHEVRON_CIRCLE_LEFT;
        private static _CHEVRON_CIRCLE_RIGHT;
        private static _CHEVRON_CIRCLE_UP;
        private static _CHEVRON_DOWN;
        private static _CHEVRON_LEFT;
        private static _CHEVRON_RIGHT;
        private static _CHEVRON_UP;
        private static _HAND_O_DOWN;
        private static _HAND_O_LEFT;
        private static _HAND_O_RIGHT;
        private static _HAND_O_UP;
        private static _LONG_ARROW_DOWN;
        private static _LONG_ARROW_LEFT;
        private static _LONG_ARROW_RIGHT;
        private static _LONG_ARROW_UP;
        private static _BACKWARD;
        private static _COMPRESS;
        private static _EJECT;
        private static _EXPAND;
        private static _FAST_BACKWARD;
        private static _FAST_FORWARD;
        private static _FORWARD;
        private static _PAUSE;
        private static _PLAY;
        private static _PLAY_CIRCLE;
        private static _PLAY_CIRCLE_O;
        private static _STEP_BACKWARD;
        private static _STEP_FORWARD;
        private static _STOP;
        private static _YOUTUBE_PLAY;
        private static _ADN;
        private static _ANDROID;
        private static _APPLE;
        private static _BITBUCKET;
        private static _BITBUCKET_SQUARE;
        private static _CSS3;
        private static _DRIBBBLE;
        private static _DROPBOX;
        private static _FACEBOOK;
        private static _FACEBOOK_SQUARE;
        private static _FLICKR;
        private static _FOURSQUARE;
        private static _GITHUB;
        private static _GITHUB_ALT;
        private static _GITHUB_SQUARE;
        private static _GITTIP;
        private static _GOOGLE_PLUS;
        private static _GOOGLE_PLUS_SQUARE;
        private static _HTML5;
        private static _INSTAGRAM;
        private static _LINKEDIN;
        private static _LINKEDIN_SQUARE;
        private static _LINUX;
        private static _MAXCDN;
        private static _PAGELINES;
        private static _PINTEREST;
        private static _PINTEREST_SQUARE;
        private static _RENREN;
        private static _SKYPE;
        private static _STACK_EXCHANGE;
        private static _STACK_OVERFLOW;
        private static _TRELLO;
        private static _TUMBLR;
        private static _TUMBLR_SQUARE;
        private static _TWITTER;
        private static _TWITTER_SQUARE;
        private static _VIMEO_SQUARE;
        private static _VK;
        private static _WEIBO;
        private static _WINDOWS;
        private static _XING;
        private static _XING_SQUARE;
        private static _YOUTUBE;
        private static _YOUTUBE_SQUARE;
        private static _AMBULANCE;
        private static _H_SQUARE;
        private static _HOSPITAL_O;
        private static _MEDKIT;
        private static _STETHOSCOPE;
        private static _USER_MD;
        constructor(_value: string);
        className: string;
    }
}
declare module cubee {
    class FAIcon extends AUserControl {
        private static _initialized;
        private static initFA();
        private _size;
        private _color;
        private _spin;
        private _icon;
        private _iElement;
        private _changeListener;
        constructor(icon: EIcon);
        private refreshStyle();
        protected colorProperty(): ColorProperty;
        Color: ColorProperty;
        color: Color;
        protected sizeProperty(): NumberProperty;
        Size: NumberProperty;
        size: number;
        protected spinProperty(): BooleanProperty;
        Spin: BooleanProperty;
        spin: boolean;
        protected iconProperty(): Property<EIcon>;
        Icon: Property<EIcon>;
        icon: EIcon;
    }
}
