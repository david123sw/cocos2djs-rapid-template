/**
 * Created by davidsw on 2017/8/21.
 */
/**
 *Preloading && Updating Resource
 */
let preRes = {
    CommonRes : ["res/commonRes/LoadingBarFile.png", "res/commonRes/Button_Press.png", "res/commonRes/Button_Normal.png", "res/commonRes/Button_Disable.png"],
    PreloadingScene : ["res/preloadScene/PreloadingScene.json"]
};
let preResArr = Object.keys(preRes);
let g_preResources = [];
let preResIndex = 0;
for(let i in preRes)
{
    let preResArrayLength = preRes[i].length;
    preResIndex += preResArrayLength;
    for(let j = 0; j < preResArrayLength; ++j)
    {
        Logger.log('preresource:' + '' + preRes[i][j]);
        g_preResources.push(cc.game.LOADED_PREFIX_PATH + preRes[i][j]);
    }
}
