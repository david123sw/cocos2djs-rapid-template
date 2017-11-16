/**
 * Created by davidsw on 2017/8/21.
 * 自适应
 */
(function(){
    AutoLayout = (root) => {
        if(!root)
        {
            Logger.warn('AutoLayout root == null Error');
            ExceptionThrownStop('DisplayObject Not Found.');
        }
        let visibleSize = cc.director.getVisibleSize();
        root.setContentSize(visibleSize);
        ccui.helper.doLayout(root);
    };
})();