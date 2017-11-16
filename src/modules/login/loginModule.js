/**
 * Created by davidsw on 2017/8/28.
 */
let LoginModule = DisplayBase.extend({
    scene : null,
    loginConfirmButtonNode : null,

    ctor : function () {
        this._super();
        Logger.log('LoginModule::ctor');
    },

    init : function () {
        this._super();
        Logger.log('LoginModule::init');

        this.scene = ccs.load(cc.game.LOADED_PREFIX_PATH + MainResource['Login0']).node;
        DisplayObjectAssert(this.scene);
        this.addChild(this.scene);

        this.loginConfirmButtonNode = ccui.helper.seekWidgetByName(this.scene, 'LoginButton');

        this.addEvents();
    },

    show : function (cb, params) {
        this._super(cb, params);
        Logger.log('LoginModule::show');
    },

    close : function (cb, params) {
        this._super(cb, params);
        Logger.log('LoginModule::close');
    },

    addEvents : function () {
        this.loginConfirmButtonNode.addTouchEventListener(this.onTouchEventNotifier, this);
    },

    onTouchEventNotifier : function (target, type) {
        if(type === ccui.Widget.TOUCH_ENDED)
        {
            switch(target)
            {
                case this.loginConfirmButtonNode:
                    {
                        Logger.log('登陆界面测试按钮::Press');
                        DisplayObjectController.getInstance().openDisplayer('Alert', {});
                    }
                    break;

                default:
                    break;
            }
        }
    },

    onEnter : function () {
        this._super();
        Logger.log('LoginModule::onEnter');
        AutoLayout(this.scene);
    },

    onExit : function () {
        this._super();
        Logger.log('LoginModule::onExit');

        this.loginConfirmButtonNode = null;
        this.scene = null;
    }
});