/**
 * Created by davidsw on 2017/8/15.
 * 配置当前项目相关参数，包括调试以及项目导出
 * 其中
 */
(function(){
    Configuration = {
        dev_env : 'cocos2d-js v3.10',
        dev_mode : true,
        log_enabled : true,     //log输出调试
        warn_enabled : true,    //warn输出调试
        error_enabled : true,   //error输出调试
        module_sound_enabled : true,   //模块打开关闭音效
        with_login_module : true,
        game_name : 'poker',     //游戏名字
        main_logic : 'mainLogic_A' ,  //当前游戏逻辑 etc:mainLogic_B
        modules_special_config : {
            network : {

            },
            user_setting : {
            }
        }//modules特殊使用配置
    };
})();