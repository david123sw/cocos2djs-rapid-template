/**
 * 加载源JS
 */
let loadCustomJs = function (singleJs, loadSingleJsCb, isBatch = false, jsType = 'src', loadBatchJsCb = () => {}) {
    Logger.log('Begin to (loadCustomJs)::' + singleJs);
    let loadingJs = cc.game.LOADED_PREFIX_PATH + singleJs;
    cc.loader.loadJs(loadingJs, (err) => {
        if(err)
        {
            Logger.log('Loading js single file failed.' + err);
        }
        else
        {
            Logger.log('Loading js single file succeeded.');
            loadSingleJsCb && loadSingleJsCb();
            if(!isBatch) return;
            else
            {
                if('src' === jsType)
                {
                    cc.loader.loadJs(MainSource, (err) => {
                        if(err)
                        {
                            Logger.log('Loading js batch files failed.' + err);
                        }
                        else
                        {
                            Logger.log('Loading js batch files succeeded.');
                            loadBatchJsCb && loadBatchJsCb();
                        }
                    });
                }
            }
        }
    });
};
/**
 * 准备界面，处理加载和更新
 */
let Entrance = cc.Scene.extend({
    scene : null,
    percentTextNode : null,
    percentLoadingBarNode : null,
    debugButtonNode : null,

    hasHotAssetsUpdateFinished : false,
    ctor : function () {
        this._super();

        Logger.log('Entrance ctor');

        this.init();
    },

    init : function () {
        this.scene = ccs.load(preRes.PreloadingScene[0]).node;
        DisplayObjectAssert(this.scene);
        this.addChild(this.scene);

        this.percentTextNode = ccui.helper.seekWidgetByName(this.scene, 'LoadingText');
        this.percentLoadingBarNode = ccui.helper.seekWidgetByName(this.scene, 'LoadingBarTop');
        this.debugButtonNode = ccui.helper.seekWidgetByName(this.scene, 'DebugingButton');

        this.onHotAssetsUpdateNotifier = this.onHotAssetsUpdateNotifier.bind(this);
        this.onLoadsAssetsUpdateNotifier = this.onLoadsAssetsUpdateNotifier.bind(this);

        this.addEvents();
    },

    updateData : function () {
        /**
         *Reserved
         */
        !Configuration.dev_mode && this.debugButtonNode.setVisible(false);
    },

    addEvents : function () {
        Events.local.addListener(EVT_LOCAL_TYPE.START_GAME_UPDATE, this.onHotAssetsUpdateNotifier, this);
        Events.local.addListener(EVT_LOCAL_TYPE.START_LOAD_RES, this.onLoadsAssetsUpdateNotifier, this);
        Events.local.addListener(EVT_LOCAL_TYPE.START_LOAD_SRC, this.onLoadsAssetsUpdateNotifier, this);

        /**
         *Reserved
         */
        this.debugButtonNode.addTouchEventListener(this.onDebugButtonTouchEventNotifier, this);
    },

    /**
     *Reserved
     */
    onDebugButtonTouchEventNotifier : function (target, type) {
        if(type === ccui.Widget.TOUCH_ENDED)
        {
            switch(target)
            {
                case this.debugButtonNode:
                    {
                        // this.count = this.count || 1;
                        // if(this.count > 100) return;
                        // this.count *= 2;
                        // this.percentTextNode.setString(this.count + '%');
                        // this.percentLoadingBarNode.setPercent(this.count);
                        Logger.log('开始界面测试按钮::Press');
                        DisplayObjectController.getInstance().openDisplayer('Login', {});
                    }
                    break;

                default:
                    break;
            }
        }
    },

    onAssetsUpdate : function (data) {
        if(data._userData.useRatio)
        {
            this.percentTextNode.setString(data._userData.ratio + '%');
            this.percentLoadingBarNode.setPercent(data._userData.ratio);
        }
        else
        {
            let ratio = data._userData.currentIndex / data._userData.totalCount;
            let trans = ratio.toFixed(2) * 100;
            this.percentTextNode.setString(trans + '%');
            this.percentLoadingBarNode.setPercent(trans);
        }
    },

    onLoadsAssetsUpdateNotifier : function (data) {
        Logger.log('onLoadsAssetsUpdateNotifier:' + JSON.stringify(data));
        this.onAssetsUpdate(data);
    },

    onHotAssetsUpdateNotifier : function(data) {
        Logger.log('onHotAssetsUpdateNotifier:' + JSON.stringify(data));
        this.onAssetsUpdate(data);
    },

    clean : function () {
        Events.local.removeListener(EVT_LOCAL_TYPE.START_GAME_UPDATE);
        Events.local.removeListener(EVT_LOCAL_TYPE.START_LOAD_RES);
        Events.local.removeListener(EVT_LOCAL_TYPE.START_LOAD_SRC);

        this.percentTextNode = null;
        this.percentLoadingBarNode = null;
        this.debugButtonNode = null;
        this.hasHotAssetsUpdateFinished = null;
        this.scene = null;
    },

    loadLocalJSQueue : function () {
        //TODO:DEBUG
        MainResource = {
            Cube2 : "res/tiles/方块2.png",
            Cube3 : "res/tiles/方块3.png",
            Cube4 : "res/tiles/方块4.png",
            Cube5 : "res/tiles/方块5.png",
            Cube6 : "res/tiles/方块6.png",
            Cube7 : "res/tiles/方块7.png",
            Cube8 : "res/tiles/方块8.png",
            Cube9 : "res/tiles/方块9.png",
            Cube10 : "res/tiles/方块10.png"
        };
        //TODO:DEBUG

        loadCustomJs('src/source.js', () => {
            Logger.log('加载source.js完毕');
        }, true, 'src', () => {
            Logger.log('加载MainSource完毕');
            let playground = new Playground();
            playground.initModules();
            loadCustomJs('src/resource.js', () => {
                Logger.log('加载resource.js完毕');
                cc.LoaderScene.preload(g_resources, () => {
                    Logger.log('游戏主资源加载完毕，进游戏');
                }, this);
            });
        });
    },

    onEnter : function () {
        this._super();

        AutoLayout(this.scene);
        this.updateData();
        if(!this.hasHotAssetsUpdateFinished)
        {
            let hotAssetsManager = new HotAssetsManager();
            hotAssetsManager.match((params) => {
                Logger.log('params:' + JSON.stringify(params));
                this.hasHotAssetsUpdateFinished = params.result;
                hotAssetsManager.clear();

                this.loadLocalJSQueue();
            });
        }
    },
    
    onExit : function () {
        this._super();

        this.clean();
    }
});

