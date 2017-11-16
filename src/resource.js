/**
 *Main Resource
 */
function doDalayLog(resIndex, resArray)
{
    setTimeout(() => {
        Events.local.dispatch(EVT_LOCAL_TYPE.START_LOAD_RES, {assetsType:'res', currentIndex:resIndex, totalCount:resArray.length, useRatio:false});
    }, 3 * resIndex);
}

let effect = {
    SOUND : {
        OPEN_MODULE : 'res/commonRes/effect/sound/click.mp3',
        CLOSE_MODULE : 'res/commonRes/effect/sound/click.mp3',
    },

    ANIMATION : {
    }
};
let g_effects = {};
for(let i in effect)
{
    let elem = effect[i];
    for(let j in elem)
    {
        elem[j] = cc.game.LOADED_PREFIX_PATH + elem[j];
    }
}
g_effects = effect;
// Logger.log('g_effects:' + JSON.stringify(g_effects));

let res = MainResource || {};
let resArray = Object.keys(res);
let resIndex = 0;
let g_resources = [];
for (let i in res) {
    ++resIndex;
    Logger.log('i:' + resIndex + '/' + resArray.length);
    Logger.log('i:' + ' ' + res[i]);
    g_resources.push(cc.game.LOADED_PREFIX_PATH + res[i]);

    Events.local.dispatch(EVT_LOCAL_TYPE.START_LOAD_RES, {currentIndex:resIndex, totalCount:resArray.length, useRatio:false});
}