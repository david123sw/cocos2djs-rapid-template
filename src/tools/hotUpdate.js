/**
 * Created by davidsw on 2017/8/22.
 * 检查更新
 */
/**
 *尝试最大连接次数
 */
const hotUpdateFailureMaxCount = 10;
let hotUpdateFailureCount = 0;

let HotAssetsManager = function () {
    /**
     *更新相关
     */
    this.updator = null;
    this.progress = null;
    this.percent = null;
    this.percentByFile = null;
    this.listener = null;

    this.match = (callback) => {
        let storagePath = jsb.fileUtils ? jsb.fileUtils.getWritablePath() + cc.game.LOADED_TAG : "./";
        this.updator = new jsb.AssetsManager(cc.game.LOADED_PREFIX_PATH + "res/project.manifest", storagePath);
        this.updator.retain();

        // Logger.log('runner path:' + storagePath);

        if(!this.updator.getLocalManifest().isLoaded())
        {
            Logger.log('Fail to update assets, step skipped.');
            this.errorAlert();
        }
        else
        {
            this.listener = new jsb.EventListenerAssetsManager(this.updator, (event) => {
                let evtCode = event.getEventCode();
                switch(evtCode)
                {
                    case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                        Logger.log('No local manifest file found, skip assets update.');
                        this.errorAlert(jsb.EventListenerAssetsManager.ERROR_NO_LOCAL_MANIFEST);
                        break;

                    case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                        Logger.log('Update progression.');
                        this.percent = event.getPercent();
                        this.percentByFile = event.getPercentByFile();

                        Logger.log('percent :' + this.percent);
                        Logger.log('percentByFile :' + this.percentByFile);

                        let trans = Math.ceil(this.percentByFile);
                        Events.local.dispatch(EVT_LOCAL_TYPE.START_GAME_UPDATE, {ratio:trans, useRatio:true});
                        break;

                    case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                        Logger.log('Download manifest failed.');
                        this.errorAlert(jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST);
                        callback && callback({result:true});
                        break;

                    case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                        Logger.log('Parse manifest failed.');
                        this.errorAlert(jsb.EventListenerAssetsManager.ERROR_PARSE_MANIFEST);
                        break;

                    case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                        Logger.log('Already Up to date.');
                        this.errorAlert(jsb.EventListenerAssetsManager.ALREADY_UP_TO_DATE);
                        callback && callback({result:true});
                        break;

                    case jsb.EventAssetsManager.UPDATE_FINISHED:
                        Logger.log('Update finished.');
                        this.errorAlert(jsb.EventListenerAssetsManager.UPDATE_FINISHED);
                        callback && callback({result:true});
                        break;

                    case jsb.EventAssetsManager.UPDATE_FAILED:
                        Logger.log('Update Failed.');
                        this.errorAlert(jsb.EventListenerAssetsManager.UPDATE_FAILED);
                        ++hotUpdateFailureCount;
                        if(hotUpdateFailureCount < hotUpdateFailureMaxCount)
                        {
                            this.updator.downloadFailedAssets();
                        }
                        else
                        {
                            Logger.log('Reach maximum fail count, exit update process.');
                            hotUpdateFailureCount = 0;
                            this.errorAlert(jsb.EventListenerAssetsManager.UPDATE_FAILED);
                        }
                        break;

                    case jsb.EventAssetsManager.ERROR_UPDATING:
                        Logger.log('Asset update error:' + event.getAssetId() + ', ' + event.getMessage());
                        this.errorAlert(jsb.EventListenerAssetsManager.ERROR_UPDATING);
                        break;

                    case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                        Logger.log('Decompressing Failed.');
                        this.errorAlert(jsb.EventListenerAssetsManager.ERROR_DECOMPRESS);
                        break;

                    default:
                        break;
                }
            });

            cc.eventManager.addListener(this.listener, 1);
            Logger.log('Begin to update now...');
            this.updator.update();
        }
    };

    this.clear = () => {
        this.listener && cc.eventManager.removeListener(this.listener);
        this.listener = null;
        this.updator.release();
        this.updator = null;
        this.progress = null;
        this.percent = null;
        this.percentByFile = null;
    };

    this.errorAlert = (code) => {
        if(code != jsb.EventListenerAssetsManager.UPDATE_FINISHED && code != jsb.EventListenerAssetsManager.ALREADY_UP_TO_DATE)
        {
            Logger.log('热更新失败，错误代码:' + code);
        }
    };
};
