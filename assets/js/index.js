$(function () {
    getUserInfo();
})

// 获取layui中的layer模板；
var layer = layui.layer;
// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 就是请求头配置对象
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data)
        },
        // // 设置用户访问权限
        // complete: function (res) {
        //     // console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         //强制清除本地token
        //         localStorage.removeItem('token')
        //         // 强制跳转到登录页面
        //         location.href = '/login.html'
        //     }
        // }
    })
}

//渲染用户头像方法
function renderAvatar(user) {
    var name = user.nickname || user.username;
    //获取用户名
    $('#welcome').html('欢迎&nbsp&nbsp' + name);
    //按需渲染用户的头像
    if (user.user_pic !== null) {
        //渲染用户上传的头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide();
    } else {
        // 渲染用户名首个字或者首个字母的大写
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}

// 给退出绑定点击事件
$('#btnlogout').on('click', function () {
    layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
        // 强制清除本地的token缓存
        localStorage.removeItem('token');
        // 强制跳转到登录页面
        location.href = '/login.html'
        layer.close(index);
    });
})

