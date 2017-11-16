/**
 * Created by davidsw on 2017/8/15.
 * Logger 接管日志打印任务
 */
(function () {
    /**
     *需要突出显示的log，屏蔽其它输出,默认为空
     * focusedLogTags   Log
     * focusedWarnTags  Warn
     * focusedErrorTags Error
     * example:    {1:true, 2:true, 3:true}    表示除了标记为1，2，3的消息外其余不打印
     */
    let focusedLogTags = {};
    let focusedWarnTags = {};
    let focusedErrorTags = {};

    let logger = function () {
        // console.log('log enabled:' + Configuration.log_enabled);
        return {
            log : function (params, focusedTag) {
                if(!Configuration.dev_mode) return;
                if(Configuration.log_enabled)
                {
                    if(0 < Object.keys(focusedLogTags).length)
                    {
                        if(focusedLogTags[focusedTag]) cc.log('Logger::log ' + params, focusedTag);
                    }
                    else
                    {
                        cc.log('Logger::log ' + params);
                    }
                }
            },

            warn : function (params, focusedTag) {
                if(!Configuration.dev_mode) return;
                if(Configuration.warn_enabled)
                {
                    if(0 < Object.keys(focusedWarnTags).length)
                    {
                        if(focusedWarnTags[focusedTag]) cc.warn('Logger::warn ' + params, focusedTag);
                    }
                    else
                    {
                        cc.warn('Logger::warn ' + params);
                    }
                }
            },

            error : function (params, focusedTag) {
                if(!Configuration.dev_mode) return;
                if(Configuration.error_enabled)
                {
                    if(0 < Object.keys(focusedErrorTags).length)
                    {
                        if(focusedErrorTags[focusedTag]) cc.error('Logger::error ' + params, focusedTag);
                    }
                    else
                    {
                        cc.error('Logger::error ' + params);
                    }
                }
            }
        };
    }
    Logger = new logger();
})();