$.ajaxPrefilter(function (options) {
    options.url = 'http://www.liulongbin.top:3007' + options.url;

    // 统一为有权限的接口设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    //控制用户访问权限
    options.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            //强制清除本地token
            localStorage.removeItem('token')
            //    强制退回登录页面
            location.href = '/login.html';
        }
    }
});