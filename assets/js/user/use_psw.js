$(function () {
    //为密码框定义校验规则
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位,且不能出现空格'
        ],
        samPwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致,请重新输入'
            }
        }

    })

    //发请求实现密码重置功能(监听表单的提交事件)
    $('.layui-form').submit(function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                layer.msg('更新密码成功')
                console.log(res);
                // 密码更新更改以后重置表单
                $('.layui-form')[0].reset();
            }
        });

    });
})