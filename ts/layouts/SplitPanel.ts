/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace cubee {
    
    export class HSplitPanel extends AUserControl {
        
        private leftPanel = SplitPanelContainer.create();
        private rightPanel = SplitPanelContainer.create();
        
    }
    
    export class VSplitPanel extends AUserControl {
        
        
        
    }
    
    export class SplitPanelContainer extends AUserControl {
        
        public static create() {
            return new SplitPanelContainer();
        }
        
        private constructor() {
            super();
        }
        
        public get children() {
            return this.children_inner;
        }
        
    }
    
}

