/**
 * Created by davidsw on 2017/8/26.
 */
let AlertModule = DisplayBase.extend({
    scene : null,
    bottomLayoutNode : null,
    alertLayoutNode : null,
    alertConfirmButtonNode : null,
    alertCancelButtonNode : null,
    ctor : function () {
        this._super();
        Logger.log('AlertModule::ctor');
    },

    init : function () {
        this._super();
        Logger.log('AlertModule::init');

        this.scene = ccs.load(cc.game.LOADED_PREFIX_PATH + MainResource['Alert0']).node;
        DisplayObjectAssert(this.scene);
        this.addChild(this.scene);

        this.bottomLayoutNode = ccui.helper.seekWidgetByName(this.scene, 'BottomBkg');
        this.alertLayoutNode = ccui.helper.seekWidgetByName(this.scene, 'MainLayer');
        this.alertConfirmButtonNode = ccui.helper.seekWidgetByName(this.scene, 'ConfirmButton');
        this.alertCancelButtonNode = ccui.helper.seekWidgetByName(this.scene, 'CancelButton');

        this.onCurrentNetConnectorOpenedNotifier = this.onCurrentNetConnectorOpenedNotifier.bind(this);
        this.onCurrentNetConnectorMsgReceivedNotifier = this.onCurrentNetConnectorMsgReceivedNotifier.bind(this);
        this.onCurrentNetConnectorFailedNotifier = this.onCurrentNetConnectorFailedNotifier.bind(this);
        this.onCurrentNetConnectorClosedNotifier = this.onCurrentNetConnectorClosedNotifier.bind(this);

        this.addEvents();
    },

    show : function (cb, params) {
        this._super(cb, params);
        Logger.log('AlertModule::show');
    },

    close : function (cb, params) {
        this._super(cb, params);
        Logger.log('AlertModule::close');
    },

    onTouchEventNotifier : function (target, type) {
        if(type === ccui.Widget.TOUCH_ENDED)
        {
            switch(target)
            {
                case this.bottomLayoutNode:
                    {
                        Logger.log('对话框界面背景界面::Press::Bottom');
                        DisplayObjectController.getInstance().closeDisplayer('Alert', {});
                    }
                    break;

                case this.alertConfirmButtonNode:
                    {
                        //TODO:DEBUG
                        // let url = 'http://192.168.2.52:3000/login?type=1&desc=from_login';
                        // Network.getInstance().createHTTPRequest('GET', url, '', {}, (params) => {
                        //     Logger.log('请求成功');
                        // }, (errorCode) => {
                        //     Logger.log('请求失败，错误码:' + errorCode);
                        // });

                        // let url = 'http://localhost:8888/feedback';
                        // let data = {a:11, b:22, c:33};
                        // Network.getInstance().createHTTPRequest('POST', url, data, {}, (params) => {
                        //     Logger.log('请求成功');
                        // }, (errorCode) => {
                        //     Logger.log('请求失败，错误码:' + errorCode);
                        // });

                        Logger.log('对话框界面测试按钮::Press::Confirm');
                        let cws = Network.getInstance().createWebSocket('ws://localhost:8181', 'mainWebSocket');
                        this.wss = new cws();
                        Logger.log('web instance ref:' + this.wss.connector.ref);
                        // Network.getInstance().createWebSocket('ws://121.40.165.18:8088')();
                    }
                    break;

                case this.alertCancelButtonNode:
                    {
                        Logger.log('对话框界面测试按钮::Press::Cancel');
                        //TODO:DEBUG
                        // this.wss.send('hack_code_close');

                        let msgStr = JSON.stringify({client:'yes', msg:[0, 0, 0]});
                        let msgAb = this.str2ab(msgStr);
                        let ab = new Uint8Array(msgAb.length);
                        for(let i = 0; i < msgAb.length; ++i)
                        {
                            ab[i] = msgAb[i];
                        }
                        this.wss.send(ab.buffer);
                    }

                default:
                    break;
            }
        }
    },

    str2ab : function (val) {
        let bytes = new Array;
        for(let i = 0 ; i < val.length ; ++i)
        {
            let codePoint = val.charCodeAt(i);
            if((0xD800 <= codePoint) && (codePoint < 0xDC00))
            {
                let leading = codePoint & 0x3FF;
                let trailing = val.charCodeAt(++i) & 0x3FF;
                codePoint = ((leading << 10) | trailing) + 0x10000;
            }
            if( codePoint < 0x80 )
            { // 7 位
                bytes.push(codePoint);
            }
            else if(codePoint < 0x800)
            { // 11 位 = 5 + 6
                bytes.push(((codePoint >>> 6) & 0x1F) | 0xC0);
                bytes.push(((codePoint      ) & 0x3F) | 0x80);
            }
            else if(codePoint < 0x10000)
            { // 16 位 = 4 + 6 + 6
                bytes.push(((codePoint >>> 12) & 0x0F) | 0xE0);
                bytes.push(((codePoint >>> 6) & 0x3F) | 0x80);
                bytes.push(((codePoint       ) & 0x3F) | 0x80);
            }
            else
            { // 21 位 = 3 + 6 + 6 + 6
                bytes.push(((codePoint >>> 18) & 0x07) | 0xF0);
                bytes.push(((codePoint >>> 12) & 0x3F) | 0x80);
                bytes.push(((codePoint >>> 6) & 0x3F) | 0x80);
                bytes.push(((codePoint       ) & 0x3F) | 0x80);
            }
        }
        return bytes;
    },

    ab2str : function (bytesArray) {
        let val = new String("");
        while(bytesArray.length > 0)
        {
            let codePoint = bytesArray.shift();
            if(codePoint >= 0x80)
            {
                if((codePoint & 0xE0) == 0xC0)
                { // 11 位
                    codePoint &= 0x1F;
                    codePoint <<= 6;
                    codePoint |= bytesArray.shift() & 0x3F;
                }
                else if((codePoint & 0xF0) == 0xE0)
                { // 16 位
                    codePoint &= 0x0F;
                    codePoint <<= 12;
                    codePoint |= (bytesArray.shift() & 0x3F) << 6;
                    codePoint |= bytesArray.shift() & 0x3F;
                }
                else
                { // 21 位
                    codePoint &= 0x0F;
                    codePoint <<= 18;
                    codePoint |= (bytesArray.shift() & 0x3F) << 12;
                    codePoint |= (bytesArray.shift() & 0x3F) << 6;
                    codePoint |= bytesArray.shift() & 0x3F;
                }
            }

            if(codePoint < 0x10000) {
                val += String.fromCharCode(codePoint);
            }
            else {
                let leading = ((codePoint - 0x10000) >>> 10) & 0x3FF;
                let trailing = codePoint & 0x3FF;
                val += String.fromCharCode(leading | 0xD800 , trailing | 0xDC00);
            }
        }
        return val;
    },

    onCurrentNetConnectorOpenedNotifier : function (data) {
        Logger.log('onCurrentNetConnectorOpenedNotifier invoke:' + data._userData.ref);
    },

    onCurrentNetConnectorMsgReceivedNotifier : function (data) {
        Logger.log('onCurrentNetConnectorMsgReceivedNotifier invoke:' + data._userData.ref);
        let msgAb = new Uint8Array(data._userData.msg);
        let msgArr = Array.apply([], msgAb);
        let msgStr = this.ab2str(msgArr);
        Logger.log('decode:' + msgStr);
    },

    onCurrentNetConnectorFailedNotifier : function (data) {

    },

    onCurrentNetConnectorClosedNotifier : function (data) {

    },

    addEvents : function () {
        this.bottomLayoutNode.addTouchEventListener(this.onTouchEventNotifier, this);
        this.alertConfirmButtonNode.addTouchEventListener(this.onTouchEventNotifier, this);
        this.alertCancelButtonNode.addTouchEventListener(this.onTouchEventNotifier, this);

        Events.local.addListener(EVT_LOCAL_TYPE.NET_CONNECTOR_OPENED, this.onCurrentNetConnectorOpenedNotifier, this);
        Events.local.addListener(EVT_LOCAL_TYPE.NET_CONNECTOR_MSG_RECEIVED, this.onCurrentNetConnectorMsgReceivedNotifier, this);
        Events.local.addListener(EVT_LOCAL_TYPE.NET_CONNECTOR_FAILED, this.onCurrentNetConnectorFailedNotifier, this);
        Events.local.addListener(EVT_LOCAL_TYPE.NET_CONNECTOR_CLOSED, this.onCurrentNetConnectorClosedNotifier, this);
    },

    onEnter : function () {
        this._super();
        Logger.log('AlertModule::onEnter');

        AutoLayout(this.scene);
    },

    onExit : function () {
        this._super();
        Logger.log('AlertModule::onExit');

        Events.local.removeListener(EVT_LOCAL_TYPE.NET_CONNECTOR_OPENED);
        Events.local.removeListener(EVT_LOCAL_TYPE.NET_CONNECTOR_MSG_RECEIVED);
        Events.local.removeListener(EVT_LOCAL_TYPE.NET_CONNECTOR_FAILED);
        Events.local.removeListener(EVT_LOCAL_TYPE.NET_CONNECTOR_CLOSED);

        this.bottomLayoutNode = null;
        this.alertLayoutNode = null;
        this.alertConfirmButtonNode = null;
        this.alertCancelButtonNode = null;
        this.scene = null;
    }
});