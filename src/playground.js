/**
 * Created by davidsw on 2017/8/26.
 */
let Playground = function () {
    /**
     * 加载场景
     */
    let displayModules = [];

    /**
     * 游戏各场景加载配置列表
     */
    this.initModules = function () {
        //Step1
        displayModules.push({moduleName:'Alert',
            moduleRef:{moduleClass:AlertModule, dataClass:null},
            moduleData:{UI:[
                'res/alertScene/MsgAlertScene.json',
                'res/alertScene/DialogBkg.png'
            ], storage:[]},
            needCached:false,
            moduleStatus:ModuleStatus.SHOW,
            moduleLayer:ModuleLayer.LAYER_TOP,
            moduleOpenCallback:() => {
                Logger.log('Alert open callback');
            },
            moduleCloseCallback:() => {
                Logger.log('Alert close callback');
            }});

        displayModules.push({moduleName:'Login',
            moduleRef:{moduleClass:LoginModule, dataClass:null},
            moduleData:{UI:[
                'res/loginScene/LoginScene.json',
                'res/loginScene/BaS31.png',
                'res/loginScene/BaS32.png',
                'res/loginScene/Frd11.png',
                'res/loginScene/LI07.jpg'
            ], storage:[]},
            needCached:false,
            moduleStatus:ModuleStatus.SHOW,
            moduleLayer:ModuleLayer.LAYER_UI,
            moduleOpenCallback:() => {
                Logger.log('Login open callback');
            },
            moduleCloseCallback:() => {
                Logger.log('Login close callback');
            }});

        //Step2
        let displayObjCtrl = DisplayObjectController.getInstance();
        displayObjCtrl.registerAllCustomModules(displayModules);
    };
};