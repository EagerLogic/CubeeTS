declare namespace cubee {
    interface IRunnable {
        (): void;
    }
    class Point2D {
        private _x;
        private _y;
        constructor(_x: number, _y: number);
        readonly x: number;
        readonly y: number;
    }
}
declare namespace cubee {
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
        readonly Started: boolean;
    }
    interface IEventListener<T> {
        (args: T): void;
    }
    class EventQueue {
        private static instance;
        static readonly Instance: EventQueue;
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
declare namespace cubee {
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
        readonly id: string;
        readonly valid: boolean;
        value: T;
        readonly nullable: boolean;
        readonly readonly: boolean;
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
        readonly value: T;
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
        readonly time: number;
        readonly property: Property<T>;
        readonly endValue: T;
        readonly interpolator: IInterpolator;
        readonly keyFrameReachedListener: () => void;
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
        static readonly Linear: IInterpolator;
    }
    abstract class AAnimator {
        private static animators;
        private static ANIMATOR_TASK;
        private started;
        static animate(): void;
        start(): void;
        stop(): void;
        readonly Started: boolean;
        readonly Stopped: boolean;
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
        readonly Stopped: boolean;
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
declare namespace cubee {
    interface IStyle {
        apply(element: HTMLElement): void;
    }
    abstract class ABackground implements IStyle {
        abstract apply(element: HTMLElement): void;
    }
    class Color {
        private static _TRANSPARENT;
        static readonly TRANSPARENT: Color;
        private static _WHITE;
        static readonly WHITE: Color;
        private static _BLACK;
        static readonly BLACK: Color;
        private static _LIGHT_GRAY;
        static readonly LIGHT_GRAY: Color;
        static getArgbColor(argb: number): Color;
        static getArgbColorByComponents(alpha: number, red: number, green: number, blue: number): Color;
        static getRgbColor(rgb: number): Color;
        static getRgbColorByComponents(red: number, green: number, blue: number): Color;
        private static fixComponent(component);
        static fadeColors(startColor: Color, endColor: Color, fadePosition: number): Color;
        private static mixComponent(startValue, endValue, pos);
        private _argb;
        constructor(argb: number);
        readonly argb: number;
        readonly alpha: number;
        readonly red: number;
        readonly green: number;
        readonly blue: number;
        fade(fadeColor: Color, fadePosition: number): Color;
        toCSS(): string;
    }
    class ColorBackground extends ABackground {
        private _color;
        private _cache;
        constructor(color: Color);
        readonly color: Color;
        apply(element: HTMLElement): void;
    }
    class Padding implements IStyle {
        private _left;
        private _top;
        private _right;
        private _bottom;
        static create(padding: number): Padding;
        constructor(_left: number, _top: number, _right: number, _bottom: number);
        readonly left: number;
        readonly top: number;
        readonly right: number;
        readonly bottom: number;
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
        readonly leftWidth: number;
        readonly topWidth: number;
        readonly rightWidth: number;
        readonly bottomWidth: number;
        readonly leftColor: Color;
        readonly topColor: Color;
        readonly rightColor: Color;
        readonly bottomColor: Color;
        readonly topLeftRadius: number;
        readonly topRightRadius: number;
        readonly bottomLeftRadius: number;
        readonly bottomRightRadius: number;
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
        readonly hPos: number;
        readonly vPos: number;
        readonly blur: number;
        readonly spread: number;
        readonly color: Color;
        readonly inner: boolean;
        apply(element: HTMLElement): void;
    }
    class ETextOverflow implements IStyle {
        private _css;
        private static _CLIP;
        private static _ELLIPSIS;
        static readonly CLIP: ETextOverflow;
        static readonly ELLIPSIS: ETextOverflow;
        constructor(_css: string);
        readonly CSS: string;
        apply(element: HTMLElement): void;
    }
    class ETextAlign implements IStyle {
        private _css;
        private static _LEFT;
        private static _CENTER;
        private static _RIGHT;
        private static _JUSTIFY;
        static readonly LEFT: ETextAlign;
        static readonly CENTER: ETextAlign;
        static readonly RIGHT: ETextAlign;
        static readonly JUSTIFY: ETextAlign;
        constructor(_css: string);
        readonly CSS: string;
        apply(element: HTMLElement): void;
    }
    class EHAlign {
        private _css;
        private static _LEFT;
        private static _CENTER;
        private static _RIGHT;
        static readonly LEFT: EHAlign;
        static readonly CENTER: EHAlign;
        static readonly RIGHT: EHAlign;
        constructor(_css: string);
        readonly CSS: string;
    }
    class EVAlign {
        private _css;
        private static _TOP;
        private static _MIDDLE;
        private static _BOTTOM;
        static readonly TOP: EVAlign;
        static readonly MIDDLE: EVAlign;
        static readonly BOTTOM: EVAlign;
        constructor(_css: string);
        readonly CSS: string;
    }
    class FontFamily implements IStyle {
        private _css;
        private static _arial;
        static readonly Arial: FontFamily;
        private static initialized;
        private static initFontContainerStyle();
        static registerFont(name: string, src: string, extra: string): void;
        constructor(_css: string);
        readonly CSS: string;
        apply(element: HTMLElement): void;
    }
    class ECursor {
        private _css;
        private static auto;
        static readonly AUTO: ECursor;
        constructor(_css: string);
        readonly css: string;
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
        readonly url: string;
        readonly onLoad: Event<EventArgs>;
        readonly width: number;
        readonly height: number;
        readonly loaded: boolean;
        apply(element: HTMLElement): void;
    }
}
declare namespace cubee {
    function call<$P, $R>(url: string, method: string, param: $P, callback: RpcResult<$R>): void;
    interface RpcResult<$R> {
        (status: number, result: $R): void;
    }
}
declare namespace cubee {
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
declare namespace cubee {
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
        private getClassName();
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
        readonly element: HTMLElement;
        readonly parent: ALayout;
        _setParent(parent: ALayout): void;
        layout(): void;
        readonly needsLayout: boolean;
        readonly TranslateX: NumberProperty;
        translateX: number;
        readonly TranslateY: NumberProperty;
        translateY: number;
        protected paddingProperty(): PaddingProperty;
        protected readonly Padding: PaddingProperty;
        protected padding: Padding;
        protected borderProperty(): BorderProperty;
        protected readonly Border: BorderProperty;
        protected border: Border;
        readonly MeasuredWidth: NumberProperty;
        measuredWidth: number;
        readonly MeasuredHeight: NumberProperty;
        measuredHeight: number;
        readonly ClientWidth: NumberProperty;
        clientWidth: number;
        readonly ClientHeight: NumberProperty;
        clientHeight: number;
        readonly BoundsWidth: NumberProperty;
        boundsWidth: number;
        readonly BoundsHeight: NumberProperty;
        boundsHeight: number;
        readonly BoundsLeft: NumberProperty;
        boundsLeft: number;
        readonly BoundsTop: NumberProperty;
        boundsTop: number;
        protected minWidthProperty(): NumberProperty;
        protected readonly MinWidth: NumberProperty;
        protected minWidth: number;
        protected minHeightProperty(): NumberProperty;
        protected readonly MinHeight: NumberProperty;
        protected minHeight: number;
        protected maxWidthProperty(): NumberProperty;
        protected readonly MaxWidth: NumberProperty;
        protected maxWidth: number;
        protected maxHeightProperty(): NumberProperty;
        protected readonly MaxHeight: NumberProperty;
        protected maxHeight: number;
        protected setPosition(left: number, top: number): void;
        _setLeft(left: number): void;
        _setTop(top: number): void;
        protected setSize(width: number, height: number): void;
        readonly Cursor: Property<ECursor>;
        cursor: ECursor;
        readonly PointerTransparent: Property<boolean>;
        pointerTransparent: boolean;
        readonly Visible: Property<boolean>;
        visible: boolean;
        readonly onClick: Event<MouseEvent>;
        readonly onContextMenu: Event<Object>;
        readonly onMouseDown: Event<MouseEvent>;
        readonly onMouseMove: Event<MouseEvent>;
        readonly onMouseUp: Event<MouseEvent>;
        readonly onMouseEnter: Event<MouseEvent>;
        readonly onMouseLeave: Event<MouseEvent>;
        readonly onMouseWheel: Event<MouseEvent>;
        readonly onKeyDown: Event<KeyboardEvent>;
        readonly onKeyPress: Event<KeyboardEvent>;
        readonly onKeyUp: Event<KeyboardEvent>;
        readonly onParentChanged: Event<ParentChangedEventArgs>;
        readonly Alpha: NumberProperty;
        alpha: number;
        readonly HandlePointer: Property<boolean>;
        handlePointer: boolean;
        readonly Enabled: Property<boolean>;
        enabled: boolean;
        readonly Selectable: Property<boolean>;
        selectable: boolean;
        readonly left: number;
        readonly top: number;
        readonly Rotate: NumberProperty;
        rotate: number;
        readonly ScaleX: NumberProperty;
        scaleX: number;
        readonly ScaleY: NumberProperty;
        scaleY: number;
        readonly TransformCenterX: NumberProperty;
        transformCenterX: number;
        readonly TransformCenterY: NumberProperty;
        transformCenterY: number;
        readonly Hovered: Property<boolean>;
        hovered: boolean;
        readonly Pressed: Property<boolean>;
        pressed: boolean;
    }
}
declare namespace cubee {
    abstract class ALayout extends AComponent {
        private _children;
        constructor(element: HTMLElement);
        protected readonly children_inner: LayoutChildren;
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
declare namespace cubee {
    abstract class AUserControl extends ALayout {
        private _width;
        private _height;
        private _background;
        private _shadow;
        private _draggable;
        constructor();
        protected widthProperty(): NumberProperty;
        protected readonly Width: NumberProperty;
        protected width: number;
        protected heightProperty(): NumberProperty;
        protected readonly Height: NumberProperty;
        protected height: number;
        protected backgroundProperty(): BackgroundProperty;
        protected readonly Background: BackgroundProperty;
        protected background: ABackground;
        protected shadowProperty(): Property<BoxShadow>;
        protected readonly Shadow: Property<BoxShadow>;
        protected shadow: BoxShadow;
        readonly Draggable: BooleanProperty;
        draggable: boolean;
        _onChildAdded(child: AComponent): void;
        _onChildRemoved(child: AComponent, index: number): void;
        _onChildrenCleared(): void;
        protected onLayout(): void;
    }
}
declare namespace cubee {
    class AView<T> extends AUserControl {
        private _model;
        constructor(_model: T);
        readonly model: T;
    }
}
declare namespace cubee {
    class Panel extends AUserControl {
        protected widthProperty(): NumberProperty;
        readonly Width: NumberProperty;
        width: number;
        protected heightProperty(): NumberProperty;
        readonly Height: NumberProperty;
        height: number;
        protected backgroundProperty(): BackgroundProperty;
        readonly Background: BackgroundProperty;
        background: ABackground;
        protected shadowProperty(): Property<BoxShadow>;
        readonly Shadow: Property<BoxShadow>;
        shadow: BoxShadow;
        readonly children: LayoutChildren;
    }
}
declare namespace cubee {
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
        readonly children: LayoutChildren;
        readonly Height: NumberProperty;
        height: number;
    }
}
declare namespace cubee {
    class VBox extends ALayout {
        private _width;
        private _cellHeights;
        private _hAligns;
        private _vAligns;
        constructor();
        readonly children: LayoutChildren;
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
        readonly Width: NumberProperty;
        width: number;
        _onChildAdded(child: AComponent): void;
        _onChildRemoved(child: AComponent, index: number): void;
        _onChildrenCleared(): void;
        protected onLayout(): void;
    }
}
declare namespace cubee {
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
        readonly Width: NumberProperty;
        width: number;
        protected heightProperty(): NumberProperty;
        readonly Height: NumberProperty;
        height: number;
        readonly Content: Property<AComponent>;
        content: AComponent;
        readonly HScrollPolicy: Property<EScrollBarPolicy>;
        hScrollPolicy: EScrollBarPolicy;
        readonly VScrollPolicy: Property<EScrollBarPolicy>;
        vScrollPolicy: EScrollBarPolicy;
        readonly ScrollWidth: NumberProperty;
        scrollWidth: number;
        readonly ScrollHeight: NumberProperty;
        scrollHeight: number;
        readonly HScrollPos: NumberProperty;
        hScrollPos: number;
        readonly VScrollPos: NumberProperty;
        vScrollPos: number;
        readonly MaxHScrollPos: NumberProperty;
        maxHScrollPos: number;
        readonly MaxVScrollPos: NumberProperty;
        maxVScrollPos: number;
    }
}
declare namespace cubee {
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
        readonly Width: NumberProperty;
        width: number;
        readonly Height: NumberProperty;
        height: number;
        readonly Text: StringProperty;
        text: string;
        readonly TextOverflow: Property<ETextOverflow>;
        textOverflow: ETextOverflow;
        readonly ForeColor: ColorProperty;
        foreColor: Color;
        readonly VerticalAlign: Property<EVAlign>;
        verticalAlign: EVAlign;
        readonly Bold: BooleanProperty;
        bold: boolean;
        readonly Italic: BooleanProperty;
        italic: boolean;
        readonly Underline: BooleanProperty;
        underline: boolean;
        readonly TextAlign: Property<ETextAlign>;
        textAlign: ETextAlign;
        readonly FontSize: NumberProperty;
        fontSize: number;
        readonly FontFamily: Property<FontFamily>;
        fontFamily: FontFamily;
    }
}
declare namespace cubee {
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
        readonly Width: NumberProperty;
        width: number;
        readonly Height: NumberProperty;
        height: number;
        readonly Text: StringProperty;
        text: string;
        readonly TextOverflow: Property<ETextOverflow>;
        textOverflow: ETextOverflow;
        readonly ForeColor: ColorProperty;
        foreColor: Color;
        readonly VerticalAlign: Property<EVAlign>;
        verticalAlign: EVAlign;
        readonly Bold: BooleanProperty;
        bold: boolean;
        readonly Italic: BooleanProperty;
        italic: boolean;
        readonly Underline: BooleanProperty;
        underline: boolean;
        readonly TextAlign: Property<ETextAlign>;
        textAlign: ETextAlign;
        readonly FontSize: NumberProperty;
        fontSize: number;
        readonly FontFamily: Property<FontFamily>;
        fontFamily: FontFamily;
        readonly Background: BackgroundProperty;
        background: ABackground;
        readonly Shadow: Property<BoxShadow>;
        shadow: BoxShadow;
    }
}
declare namespace cubee {
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
        readonly Width: NumberProperty;
        width: number;
        readonly Height: NumberProperty;
        height: number;
        readonly Text: StringProperty;
        text: string;
        readonly Background: BackgroundProperty;
        background: ABackground;
        readonly ForeColor: ColorProperty;
        foreColor: Color;
        readonly TextAlign: Property<ETextAlign>;
        textAlign: ETextAlign;
        readonly VerticalAlign: Property<EVAlign>;
        verticalAlign: EVAlign;
        readonly Bold: BooleanProperty;
        bold: boolean;
        readonly Italic: BooleanProperty;
        italic: boolean;
        readonly Underline: BooleanProperty;
        underline: boolean;
        readonly FontSize: NumberProperty;
        fontSize: number;
        readonly FontFamily: Property<FontFamily>;
        fontFamily: FontFamily;
        readonly Placeholder: StringProperty;
        placeholder: string;
    }
}
declare namespace cubee {
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
        readonly Width: NumberProperty;
        width: number;
        readonly Height: NumberProperty;
        height: number;
        readonly Text: StringProperty;
        text: string;
        readonly Background: BackgroundProperty;
        background: ABackground;
        readonly ForeColor: ColorProperty;
        foreColor: Color;
        readonly TextAlign: Property<ETextAlign>;
        textAlign: ETextAlign;
        readonly VerticalAlign: Property<EVAlign>;
        verticalAlign: EVAlign;
        readonly Bold: BooleanProperty;
        bold: boolean;
        readonly Italic: BooleanProperty;
        italic: boolean;
        readonly Underline: BooleanProperty;
        underline: boolean;
        readonly FontSize: NumberProperty;
        fontSize: number;
        readonly FontFamily: Property<FontFamily>;
        fontFamily: FontFamily;
        readonly Placeholder: StringProperty;
        placeholder: string;
    }
}
declare namespace cubee {
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
        readonly Width: NumberProperty;
        width: number;
        readonly Height: NumberProperty;
        height: number;
        readonly Text: StringProperty;
        text: string;
        readonly Background: BackgroundProperty;
        background: ABackground;
        readonly ForeColor: ColorProperty;
        foreColor: Color;
        readonly TextAlign: Property<ETextAlign>;
        textAlign: ETextAlign;
        readonly VerticalAlign: Property<EVAlign>;
        verticalAlign: EVAlign;
        readonly Bold: BooleanProperty;
        bold: boolean;
        readonly Italic: BooleanProperty;
        italic: boolean;
        readonly Underline: BooleanProperty;
        underline: boolean;
        readonly FontSize: NumberProperty;
        fontSize: number;
        readonly FontFamily: Property<FontFamily>;
        fontFamily: FontFamily;
        readonly Placeholder: StringProperty;
        placeholder: string;
    }
}
declare namespace cubee {
    class CheckBox extends AComponent {
        private _checked;
        constructor();
        readonly Checked: BooleanProperty;
        checked: boolean;
    }
}
declare namespace cubee {
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
        readonly Width: NumberProperty;
        width: number;
        readonly Height: NumberProperty;
        height: number;
        readonly Text: StringProperty;
        text: string;
        readonly Background: BackgroundProperty;
        background: ABackground;
        readonly ForeColor: ColorProperty;
        foreColor: Color;
        readonly TextAlign: Property<ETextAlign>;
        textAlign: ETextAlign;
        readonly VerticalAlign: Property<EVAlign>;
        verticalAlign: EVAlign;
        readonly Bold: BooleanProperty;
        bold: boolean;
        readonly Italic: BooleanProperty;
        italic: boolean;
        readonly Underline: BooleanProperty;
        underline: boolean;
        readonly FontSize: NumberProperty;
        fontSize: number;
        readonly FontFamily: Property<FontFamily>;
        fontFamily: FontFamily;
        readonly Placeholder: StringProperty;
        placeholder: string;
        protected selectedIndexProperty(): NumberProperty;
        readonly SelectedIndex: NumberProperty;
        selectedIndex: number;
        protected selectedItemProperty(): Property<T>;
        readonly SelectedItem: Property<T>;
        selectedItem: T;
    }
}
declare namespace cubee {
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
        readonly PictureSizeMode: Property<EPictureSizeMode>;
        pictureSizeMode: EPictureSizeMode;
        protected widthProperty(): NumberProperty;
        readonly Width: NumberProperty;
        width: number;
        protected heightProperty(): NumberProperty;
        readonly Height: NumberProperty;
        height: number;
        protected paddingProperty(): PaddingProperty;
        readonly Padding: PaddingProperty;
        padding: Padding;
        protected borderProperty(): BorderProperty;
        readonly Border: BorderProperty;
        border: Border;
        protected backgroundProperty(): BackgroundProperty;
        readonly Background: BackgroundProperty;
        background: ABackground;
        protected imageProperty(): Property<Image>;
        readonly Image: Property<Image>;
        image: Image;
    }
}
declare namespace cubee {
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
        readonly __popupRoot: Panel;
        protected rootComponent: AComponent;
        protected show(): void;
        protected close(): boolean;
        protected isCloseAllowed(): boolean;
        protected onClosed(): void;
        readonly modal: boolean;
        readonly autoClose: boolean;
        readonly glassColor: Color;
        readonly TranslateX: NumberProperty;
        translateX: number;
        readonly TranslateY: NumberProperty;
        translateY: number;
        readonly Center: BooleanProperty;
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
declare namespace cubee {
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
        readonly ClientWidth: NumberProperty;
        clientWidth: number;
        readonly ClientHeight: NumberProperty;
        clientHeight: number;
        readonly BoundsWidth: NumberProperty;
        boundsWidth: number;
        readonly BoundsHeight: NumberProperty;
        boundsHeight: number;
        readonly BoundsLeft: NumberProperty;
        boundsLeft: number;
        readonly BoundsTop: NumberProperty;
        boundsTop: number;
    }
}
