/**
 * Created by davidsw on 2017/8/24.
 * 处理界面创建以及关闭
 */

//////////////////////////////////////////////////////NOTICES///////////////////////////////////////////////////////////
/**
 * DisplayBase && DataBase
 */
let DisplayBase = cc.Layer.extend({
    ctor : function () {
        this._super();
        Logger.log('DisplayBase::ctor');
    },

    init : function () {
        this._super();
        Logger.log('DisplayBase::init');
    },

    show : function (cb, params) {
        Logger.log('DisplayBase::show');
        params && false !== params.openSoundEnabled && Configuration.module_sound_enabled && cc.audioEngine.playEffect(g_effects.SOUND.OPEN_MODULE, false);
    },

    close : function (cb, params) {
        Logger.log('DisplayBase::close');
        params && false !== params.closeSoundEnabled && Configuration.module_sound_enabled && cc.audioEngine.playEffect(g_effects.SOUND.OPEN_MODULE, false);
    },

    onEnter : function () {
        this._super();
        Logger.log('DisplayBase::onEnter');
    },

    onExit : function () {
        this._super();
        Logger.log('DisplayBase::onExit');
    }
});

let DataBase = cc.Class.extend({
    ctor : function () {
        this._super();
        Logger.log('DataBase::onExit');
    },

    init : function () {
        Logger.log('DataBase::onExit');
    },
});
//////////////////////////////////////////////////////NOTICES///////////////////////////////////////////////////////////
/**
 * ModuleController
 */
const ModuleLayer = ModuleLayer || {};
ModuleLayer.LAYER_GROUND = 0;
ModuleLayer.LAYER_UI = 1;
ModuleLayer.LAYER_EFFECT = 2;
ModuleLayer.LAYER_TOP = 3;
ModuleLayer.LAYER_UNKNOWN = 4;

const ModuleStatus = ModuleStatus || {};
ModuleStatus.HIDE = 0;
ModuleStatus.SHOW = 1;

let ModuleController = function () {
    let _gameDisplayedScene = null;
    let _gameDisplayedLayer = null;
    let _gameDisplayedExtendScene = null;//RESERVED
    let _modulesConfig = {};
    let _modulesData = {};
    let _cachedModules = {};
    let _cachedModulesClassReference = {};
    let _cachedDataClassReference = {};
    let _layersAddedArray = [];

    this.init = function () {
        _gameDisplayedScene = new cc.Scene();
        _gameDisplayedLayer = new cc.Layer();
        for(let i = 0; i < ModuleLayer.LAYER_UNKNOWN; ++i)
        {
            let layer = new cc.Layer();
            _layersAddedArray[i] = layer;
            _gameDisplayedLayer.addChild(layer);
        }
        _gameDisplayedScene.addChild(_gameDisplayedLayer);
    }

    this.registerCustomModule = function (moduleName, moduleRef, moduleData, needCached = false, moduleStatus = ModuleStatus.SHOW, moduleLayer = ModuleLayer.LAYER_UI, moduleOpenCallback = () => {}, moduleCloseCallback = () => {}) {
        _modulesConfig[moduleName] = {
            cached : needCached,
            status : moduleStatus,
            layer : moduleLayer,
            openCb : moduleOpenCallback,
            closeCb : moduleCloseCallback
        };

        _cachedModulesClassReference[moduleName] = moduleRef.moduleClass;
        _cachedDataClassReference[moduleName] = moduleRef.dataClass;
        _modulesData[moduleName] = {UI:moduleData.UI, storage:moduleData.storage};

        for(let i = 0; i < moduleData.UI.length; ++i)
        {
            MainResource[moduleName + i] = moduleData.UI[i];
        }
    };

    this.addToStage = function () {
        cc.director.runScene(_gameDisplayedScene);
    };

    this.addToTargetNode = function (displayObject, layer) {
        _layersAddedArray[layer].addChild(displayObject);
    };

    this.openModule = function (moduleName, params) {
        Logger.log('Module::' + moduleName + ' Opened.');
        this.initModuleData(moduleName);

        let exist = _cachedModules[moduleName];
        if(exist)
        {
            Logger.log('Module::Exist Before.');
            exist.module.setVisible(undefined !== params.moduleStatus ? params.moduleStatus : true);
            exist.module.show(exist.openCb, params);
            return;
        }
        let classReference = _cachedModulesClassReference[moduleName];
        let module = {};
        module.module = new classReference();
        module.status = _modulesConfig[moduleName].status;
        module.openCb = _modulesConfig[moduleName].openCb;
        module.closeCb = _modulesConfig[moduleName].closeCb;
        module.layer = _modulesConfig[moduleName].layer;
        module.module.init();
        module.module.show(module.openCb, params);
        module.module.setVisible(module.status);
        module.openCb && module.openCb();
        _cachedModules[moduleName] = module;
        this.addToTargetNode(module.module, module.layer);
    };

    this.closeModule = function (moduleName, params) {
        let exist = _cachedModules[moduleName];
        if(!exist)
        {
            Logger.log('Module::' + moduleName + ' does not Exist.');
            return;
        }
        let needCached = exist.cached;
        needCached = undefined !== params.cached ? params.cached : needCached;

        if(exist.module)
        {
            exist.closeCb && exist.closeCb();
            exist.module.close(exist.closeCb, params);
            exist.module.stopAllActions();
            exist.module.removeAllChildren();
            exist.module.parent && exist.module.removeFromParent();
            exist.module = null;
            Logger.log('Module::' + moduleName + ' Closed.');
        }

        if(needCached)
        {
            Logger.log('Retain Module::' + moduleName + ' Cache.');
        }
        else
        {
            delete _cachedModules[moduleName];
        }

        if(true === params.deleteModuleData)
        {
            this.deleteModuleData(moduleName);
        }
    };

    this.getModule = function (moduleName) {
        return _cachedModules[moduleName];
    };

    this.initModuleData = function (moduleName) {
        _modulesData[moduleName].rawData = _modulesData[moduleName].rawData || {};
    };

    this.deleteModuleData = function (moduleName) {
        if(_modulesData[moduleName] && _modulesData[moduleName].rawData) _modulesData[moduleName].rawData = {};
    };

    this.getModuleData = function (moduleName) {
       if(_modulesData[moduleName]) return _modulesData[moduleName].rawData;
    };
};
/**
 *  DataController(Reserved)
 */
let DataController = function () {
};
//////////////////////////////////////////////////////NOTICES///////////////////////////////////////////////////////////
/**
 * DisplayObjectController
 */
let DisplayObjectController = function () {
    let _cachedModules = new ModuleController();
    let _cachedData = new DataController();
    let _initialOpenDisplay = false;

    this.registerAllCustomModules = function (modulesArray) {
        for(let i = 0; i < modulesArray.length; ++i)
        {
            // example
            // moduleName, moduleRef, moduleData, needCached = false, moduleStatus = ModuleStatus.SHOW, moduleLayer = ModuleLayer.LAYER_UI, moduleOpenCallback = () => {}, moduleCloseCallback= () => {}
            let module = modulesArray[i];
            let moduleName = module.moduleName;
            let moduleRef = module.moduleRef;
            let moduleData = module.moduleData;
            let needCached = module.needCached;
            let moduleStatus = module.moduleStatus;
            let moduleLayer = module.moduleLayer;
            let moduleOpenCallback = module.moduleOpenCallback;
            let moduleCloseCallback = module.moduleCloseCallback;
            _cachedModules.registerCustomModule(moduleName, moduleRef, moduleData, needCached, moduleStatus, moduleLayer, moduleOpenCallback, moduleCloseCallback);
        }
    };

    this.openDisplayer = function (moduleName, params) {
        if(!_initialOpenDisplay)
        {
            _cachedModules.init();
            _cachedModules.addToStage();
            _initialOpenDisplay = true;
        }

        _cachedModules.openModule(moduleName, params);
    };

    this.closeDisplayer = function (moduleName, params) {
        _cachedModules.closeModule(moduleName, params);
    };

    this.getDisplayer = function (moduleName) {
        return _cachedModules.getModule(moduleName);
    };

    this.getDisplayerData = function (moduleName) {
        return _cachedModules.getModuleData(moduleName);
    };
};

DisplayObjectController.instance = null;
DisplayObjectController.getInstance = () => {
    if(null == DisplayObjectController.instance) DisplayObjectController.instance = new DisplayObjectController();
    return DisplayObjectController.instance;
}