/**
 * Created by davidsw on 2017/8/24.
 * 配置添加等代码文件
 * 文件名:文件路径
 */
let src = {
    alertModule : 'src/modules/alert/alertModule.js',
    // alertModuleData : 'src/modules/alert/alertModuleData.js',

    loginModule : 'src/modules/login/loginModule.js'
};
let srcArray = Object.keys(src);
let srcIndex = 0;
let g_sources = [];
for(let i in src)
{
    ++srcIndex;
    Logger.log('i:' + srcIndex + '/' + srcArray.length);
    Logger.log('i:' + ' ' + src[i]);
    g_sources.push(cc.game.LOADED_PREFIX_PATH + src[i]);

    Events.local.dispatch(EVT_LOCAL_TYPE.START_LOAD_SRC, {currentIndex:srcIndex, totalCount:srcArray.length, useRatio:false});
}
MainSource = g_sources.slice(0);