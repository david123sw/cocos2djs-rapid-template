/**
 * A brief explanation for "project.json":
 * Here is the content of project.json file, this is the global configuration for your game, you can modify it to customize some behavior.
 * The detail of each field is under it.
 {
    "project_type": "javascript",
    // "project_type" indicate the program language of your project, you can ignore this field

    "debugMode"     : 1,
    // "debugMode" possible values :
    //      0 - No message will be printed.
    //      1 - cc.error, cc.assert, cc.warn, cc.log will print in console.
    //      2 - cc.error, cc.assert, cc.warn will print in console.
    //      3 - cc.error, cc.assert will print in console.
    //      4 - cc.error, cc.assert, cc.warn, cc.log will print on canvas, available only on web.
    //      5 - cc.error, cc.assert, cc.warn will print on canvas, available only on web.
    //      6 - cc.error, cc.assert will print on canvas, available only on web.

    "showFPS"       : true,
    // Left bottom corner fps information will show when "showFPS" equals true, otherwise it will be hide.

    "frameRate"     : 60,
    // "frameRate" set the wanted frame rate for your game, but the real fps depends on your game implementation and the running environment.

    "noCache"       : false,
    // "noCache" set whether your resources will be loaded with a timestamp suffix in the url.
    // In this way, your resources will be force updated even if the browser holds a cache of it.
    // It's very useful for mobile browser debuging.

    "id"            : "gameCanvas",
    // "gameCanvas" sets the id of your canvas element on the web page, it's useful only on web.

    "renderMode"    : 0,
    // "renderMode" sets the renderer type, only useful on web :
    //      0 - Automatically chosen by engine
    //      1 - Forced to use canvas renderer
    //      2 - Forced to use WebGL renderer, but this will be ignored on mobile browsers

    "engineDir"     : "frameworks/cocos2d-html5/",
    // In debug mode, if you use the whole engine to develop your game, you should specify its relative path with "engineDir",
    // but if you are using a single engine file, you can ignore it.

    "modules"       : ["cocos2d"],
    // "modules" defines which modules you will need in your game, it's useful only on web,
    // using this can greatly reduce your game's resource size, and the cocos console tool can package your game with only the modules you set.
    // For details about modules definitions, you can refer to "../../frameworks/cocos2d-html5/modulesConfig.json".

    "jsList"        : [
    ]
    // "jsList" sets the list of js files in your game.
 }
 *
 */

//////////////////////////////////////////////////////NOTICES///////////////////////////////////////////////////////////
/**
 * 要导出的游戏配置：
 * LOADED_TAG : 游戏名                                   Xcode 开发模式置 ''        导出后置游戏名字
 * LOADED_PREFIX_PATH : 游戏配置路径                      Xcode 开发模式置 ''        导出后置cc.game.LOADED_TAG + "/"
 * LOADED_BY_DOWNLOADED_TAG : 改游戏导出包是否内置在RN     true(不内置，需要下载)      false(内置)
 */
cc.game.LOADED_TAG = "";//(导出模式定义为 poke)
cc.game.LOADED_PREFIX_PATH = ""; //cc.game.LOADED_TAG + "/";
cc.game.LOADED_BY_DOWNLOADED_TAG = false;

/**
 * 以下配置为初始化准备
 * 不要修改 && 不要更改顺序
 */
let Configuration;
let Logger;
let LocalStorage;
let AutoLayout;
let MainResource;
let MainSource;
let ExceptionThrownStop = (desc) => {
    throw new Error(desc);
};
let DisplayObjectAssert = (root, path) => {
    if(!root)
    {
        Logger.log('场景加载失败，资源路径:' + path);
        ExceptionThrownStop('DisplayObject Not Found.');
    }
};
let ObjectDeepCopy = (obj) => {
    if(null === obj || typeof obj !== 'object')
    {
        return obj;
    }

    if(obj instanceof Array)
    {
        let copy = [];
        for(let i = 0; i < obj.length; ++i)
        {
            copy.push(obj[i]);
        }
        return copy;
    }

    if(obj instanceof Object)
    {
        let copy = {};
        for(let key in obj)
        {
            if(obj.hasOwnProperty(key))
            {
                copy[key] = ObjectDeepCopy(obj[key]);
            }
        }
        return copy;
    }
};
//////////////////////////////////////////////////////NOTICES///////////////////////////////////////////////////////////

cc.game.onStart = function(){
    if(!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
        document.body.removeChild(document.getElementById("cocosLoading"));

    // Pass true to enable retina display, on Android disabled by default to improve performance
    cc.view.enableRetina(cc.sys.os === cc.sys.OS_IOS ? true : false);
    // Adjust viewport meta
    cc.view.adjustViewPort(true);
    // Setup the resolution policy and design resolution size
    cc.view.setDesignResolutionSize(960, 640, cc.ResolutionPolicy.FIXED_HEIGHT);
    // H5 Resize
    cc.view.resizeWithBrowserSize(true);
    // Game Entrance
    cc.LoaderScene.preload(g_preResources, () => {
        cc.director.runScene(new Entrance());
    }, this);
    // Common Events
    Events.backgroundPersist();
};
cc.game.run();
