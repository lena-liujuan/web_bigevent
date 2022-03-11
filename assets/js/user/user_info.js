$(function () {
    //获取layui的form模板
    var form = layui.form;
    var layer = layui.layer;
    // 自定义验证规则
    form.verify({
        // 设置用户名长度
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间'
            }
        }
    })

    initUserInfo()

    // 初始化用户的信息 获取用户信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('获取用户信息失败')
                }
                // console.log(res);
                // 通过form.val() 赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    //实现表单重置效果(获取重置按钮)
    $('#btnReset').on('click', function (e) {
        //阻止表单的默认提交行为
        e.preventDefault();
        //初始化用户信息
        initUserInfo();
    })

    // 发请求更新用户信息(监听表单的提交事件)
    $('.layui-form').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        //发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('获取用户信息失败')
                }
                layer.msg('获取用户信息成功')
                // 获取用户信息成功以后 需要同步渲染用户头像等信息(调取父页面中的方法window.parent)
                window.parent.getUserInfo();
            }
        })

    })

})