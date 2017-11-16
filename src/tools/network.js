/**
 * Created by davidsw on 2017/8/29.
 */
let WebConnectorPool = WebConnectorPool || {};
let hasWebConnectorInPool = (ref) => {
    return WebConnectorPool[ref];
};

let Network = function () {
    this.createHTTPRequest = (method, url, body = '', requestHeadMap = {}, cbSuccess = null, cbFailure = null) => {
        Logger.log('Network::loadHTTPRequest');
        let xhrRequest = cc.loader.getXMLHttpRequest();
        let errorAlreadyNoticed = false;
        let errorNotice = function () {
            if(errorAlreadyNoticed) return;
            cbFailure && cbFailure(xhrRequest.status);
            errorAlreadyNoticed = true;
        }
        xhrRequest.open(method, url, true);
        xhrRequest.setRequestHeader("Content-Type", "x-www-form-urlencoded");//application/json
        xhrRequest.setRequestHeader("Connection", "close");
        for(let i in requestHeadMap)
        {
            xhrRequest.setRequestHeader(i, requestHeadMap[i]);
        }
        xhrRequest.onloadend = () => {
            if(200 !== xhrRequest.status)
            {
                Logger.log('HTTP请求失败,错误码(onloadend) ' + xhrRequest.status);
                errorNotice();
            }
        };
        xhrRequest.onreadystatechange = () => {
            if(4 === xhrRequest.readyState)
            {
                if(200 === xhrRequest.status)
                {
                    Logger.log('HTTP请求成功');
                    let response = xhrRequest.responseText;
                    Logger.log('response:' + response);
                    cbSuccess && cbSuccess(response);
                }
                else
                {
                    Logger.log('HTTP请求失败,错误码(onreadystatechange) ' + xhrRequest.status);
                    errorNotice();
                }
            }
        };
        if(body)
        {
            xhrRequest.send(JSON.stringify(body));
        }
        else
        {
            xhrRequest.send();
        }
    };

    this.createWebSocket = (wsUrl, ref = '') => {
        return function () {
            if(hasWebConnectorInPool(ref))
            {
                Logger.log('WebSocket <' + ref + '>  has created, returned');
                return;
            }
            this.connector = new WebSocket(wsUrl);
            this.connector.ref = ref  ? ref : 'WSRef:' + new Date().getTime();

            this.connector.binaryType = 'arraybuffer';

            Logger.log('Create new websocket');
            this.onopen = this.connector.onopen = (evt) => {
                Logger.log('connector::onopen');

                Events.local.dispatch(EVT_LOCAL_TYPE.NET_CONNECTOR_COMMON_OPENED, {ref:this.connector.ref, status:true});
                Events.local.dispatch(EVT_LOCAL_TYPE.NET_CONNECTOR_OPENED, {ref:this.connector.ref, status:true});
            };

            this.onmessage = this.connector.onmessage = (evt) => {
                Logger.log('connector::onmessage');
                Logger.log('evt data:' + typeof evt.data);
                Logger.log('evt data:' + evt.data);

                Events.local.dispatch(EVT_LOCAL_TYPE.NET_CONNECTOR_MSG_RECEIVED, {ref:this.connector.ref, msg:evt.data});
            };

            this.onerror = this.connector.onerror = (evt) => {
                Logger.log('connector::onerror');
                Logger.log('evt data:' + typeof evt.data);
                Logger.log('evt data:' + evt.data);

                Events.local.dispatch(EVT_LOCAL_TYPE.NET_CONNECTOR_FAILED, {ref:this.connector.ref, msg:evt.data});
            };

            this.onclose = this.connector.onclose =  (evt) => {
                Logger.log('connector::onclose ' + evt.code);

                Events.local.dispatch(EVT_LOCAL_TYPE.NET_CONNECTOR_COMMON_CLOSED, {ref:this.connector.ref, status:false});
                Events.local.dispatch(EVT_LOCAL_TYPE.NET_CONNECTOR_CLOSED, {ref:this.connector.ref, status:false});
            };

            this.send = function (message) {
                Logger.log('connector::send::' + message);
                this.connector && this.connector.send(message);
            }
        };
    };
};
Network.instance = null;
Network.getInstance = () => {
    if(null === Network.instance) Network.instance = new Network();
    return Network.instance;
}