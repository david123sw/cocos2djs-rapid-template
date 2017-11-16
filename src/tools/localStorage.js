/**
 * Created by davidsw on 2017/9/7.
 * 按配置文件方式存储,常规配置
 * app_settings(key)         cache(文件)
 */
(function () {
    const localStorageFileName = 'cache';
    let storagePath = jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "./";
    let fullHeadPath = storagePath + cc.game.LOADED_PREFIX_PATH;
    let fullFilePath = fullHeadPath + localStorageFileName;
    let fileExist = jsb.fileUtils.isFileExist(fullFilePath);
    let localStorage = function () {
        return {
            loadInitialLocalData : function () {
                let ret = this.getItem('app_settings');
                if(ret) Configuration.modules_special_config.user_setting = JSON.parse(JSON.stringify(ret));
            },

            getStoragePath : function () {
                let storagePath = jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "./";
                return storagePath + cc.game.LOADED_PREFIX_PATH;
            },

            saveItem : function (valueMap, cb) {
                let ret = jsb.fileUtils.writeStringToFile(JSON.stringify(valueMap), fullFilePath);
                if(ret)
                {
                    Logger.log('localStorage::saveItem finished.');
                    cb && cb();
                }
            },

            getItem : function (key, cb) {
                let valueString = jsb.fileUtils.getStringFromFile(fullFilePath);
                let ret = valueString ? JSON.parse(valueString) : {};
                Logger.log('localStorage::getItem finished.');
                cb && cb(ret[key]);
                return ret[key];
            },

            removeItem : function (key) {
                this.saveItem(key, {});
            }
        };
    };

    LocalStorage = new localStorage();
    LocalStorage.loadInitialLocalData();
})();
