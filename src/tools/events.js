/**
 * Created by davidsw on 2017/8/22.
 * 本地自定义事件 && 网络收发事件
 */
//本地事件
let EVT_LOCAL_TYPE = {
    START_GAME_UPDATE : 'start_game_update',
    FINISH_GAME_UPDATE : 'finish_game_update',

    START_LOAD_RES : 'start_load_res',
    FINISH_LOAD_RES : 'finish_load_res',
    START_LOAD_SRC : 'start_load_src',
    FINISH_LOAD_SRC : 'finish_load_src',

    NET_CONNECTOR_COMMON_OPENED : 'net_connector_common_opened',
    NET_CONNECTOR_COMMON_CLOSED : 'net_connector_common_closed',
    NET_CONNECTOR_OPENED : 'net_connector_opened',
    NET_CONNECTOR_CLOSED : 'net_connector_closed',
    NET_CONNECTOR_MSG_RECEIVED : 'net_connector_msg_received',
    NET_CONNECTOR_FAILED : 'net_connector_failed'
};
//网络事件
let EVT_NET_TYPE = {
    NET_CONNECTED : 'net_connected',
    NET_CONNECTING : 'net_connecting',
    NET_DISCONNECTED : 'net_disconnected',
};

let Events = {
    backgroundPersist : () => {
        cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, (event) => {
            Logger.log('Enter background.');
        });

        cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, (event) => {
            Logger.log('Enter foreground');
        });

        cc.eventManager.addCustomListener(EVT_LOCAL_TYPE.NET_CONNECTOR_COMMON_OPENED, (event) => {
            Logger.log('Net connector common opened:' + JSON.stringify(event));
            WebConnectorPool[event._userData.ref] = event._userData.status;
        });

        cc.eventManager.addCustomListener(EVT_LOCAL_TYPE.NET_CONNECTOR_COMMON_CLOSED, (event) => {
            // Logger.log('Net connector common closed:' + JSON.stringify(event));
            WebConnectorPool[event._userData.ref] = event._userData.status;
        });
    },

    local : {
        addListener : (eventName, callback, owner) => {
            owner && callback && callback.bind(owner);
            cc.eventManager.addCustomListener(eventName, callback);
        },

        dispatch : (eventName, userData) => {
            cc.eventManager.dispatchCustomEvent(eventName, userData);
        },

        removeListener : (eventName) => {
            cc.eventManager.removeCustomListeners(eventName);
        },

        removeAllListeners : (eventName) => {
            Events.local.removeListener(eventName);
        }
    },

    net : {
        addListener : () => {

        },

        dispatch : () => {

        },

        removeListener : () => {

        },

        removeAllListeners : () => {

        }
    }
};