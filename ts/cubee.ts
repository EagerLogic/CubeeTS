/// <reference path="utils.ts"/>
/// <reference path="events.ts"/>
/// <reference path="properties.ts"/>
/// <reference path="styles.ts"/>
/// <reference path="rpc.ts"/>
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
/// <reference path="components/FAIcon.ts"/>     
/// <reference path="components/EIcon.ts"/>     

/// <reference path="popups.ts"/>

/// <reference path="components/treeview/ATreeItem.ts"/>  
/// <reference path="components/treeview/FolderTreeItem.ts"/>  
/// <reference path="components/treeview/LeafTreeItem.ts"/> 
/// <reference path="components/treeview/TreeView.ts"/>  
/// <reference path="layouts/SplitPanel.ts"/>

// html component
// hyperlink

// faicon
// eicon

// EVENTS


namespace cubee {                

    export class CubeePanel {        

        private _layoutRunOnce: RunOnce = null; 

        private _contentPanel: Panel = null;
        private _rootComponent: AComponent = null;


        private _element: HTMLElement;

        private _left = -1;
        private _top = -1;
        private _clientWidth = -1;
        private _clientHeight = -1;
        private _offsetWidth = -1;
        private _offsetHeight = -1;

        constructor(element: HTMLDivElement) {
            this._element = element;
            window.addEventListener("onresize", (evt: UIEvent) => {
                this.requestLayout();
            });

            this._contentPanel = new Panel();
            this._contentPanel.element.style.pointerEvents = "none";
            this._contentPanel.pointerTransparent = true;
            this._contentPanel.setCubeePanel(this);
            this._element.appendChild(this._contentPanel.element);

            this.checkBounds();
            this.requestLayout();

            var t = new Timer(() => {
                EventQueue.Instance.invokeLater(() => {
                    this.checkBounds();
                });
            });
            t.start(100, true);
        }

        private checkBounds() {
            // TODO offsetLeft -> absoluteLeft
            var newLeft = this._element.offsetLeft;
            // TODO offsetTop -> absoluteTop
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
                } else {
                    this._contentPanel.translateX = 0;
                    this._contentPanel.translateY = 0;
                }
                this.requestLayout();
            }
        }

        requestLayout() {
            if (this._layoutRunOnce == null) {
                this._layoutRunOnce = new RunOnce(() => {
                    this.layout();
                });
            }
            this._layoutRunOnce.run();
        }

        layout() {
            Popups._requestLayout();
            this._contentPanel.layout();
        }

        get rootComponent() {
            return this._rootComponent;
        }

        set rootComponent(rootComponent: AComponent) {
            this._contentPanel.children.clear();
            this._rootComponent = null;
            if (rootComponent != null) {
                this._contentPanel.children.add(rootComponent);
                this._rootComponent = rootComponent;
            }
        }

        get ClientWidth() {
            return this._contentPanel.ClientWidth;
        }
        get clientWidth() {
            return this.ClientWidth.value;
        }
        set clientWidth(value) {
            this.ClientWidth.value = value;
        }

        get ClientHeight() {
            return this._contentPanel.ClientHeight;
        }
        get clientHeight() {
            return this.ClientHeight.value;
        }
        set clientHeight(value) {
            this.ClientHeight.value = value;
        }

        get BoundsWidth() {
            return this._contentPanel.BoundsWidth;
        }
        get boundsWidth() {
            return this.BoundsWidth.value;
        }
        set boundsWidth(value) {
            this.BoundsWidth.value = value;
        }

        get BoundsHeight() {
            return this._contentPanel.BoundsHeight;
        }
        get boundsHeight() {
            return this.BoundsHeight.value;
        }
        set boundsHeight(value) {
            this.BoundsHeight.value = value;
        }

        get BoundsLeft() {
            return this._contentPanel.BoundsLeft;
        }
        get boundsLeft() {
            return this.BoundsLeft.value;
        }
        set boundsLeft(value) {
            this.BoundsLeft.value = value;
        }

        get BoundsTop() {
            return this._contentPanel.BoundsTop;
        }
        get boundsTop() {
            return this.BoundsTop.value;
        }
        set boundsTop(value) {
            this.BoundsTop.value = value;
        }

    }

}


