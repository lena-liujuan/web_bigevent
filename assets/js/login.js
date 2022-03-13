$(function () {
    // 给去注册绑定点击事件
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    // 给去登录绑定点击事件
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })
    // 先获取layui中的form元素
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位,且不能出现空格'
        ],
        repwd: function (value) {
            //获取第一次输入密码的值
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    //监听注册的表单提交事件
    $('#form_reg').on('submit', function (e) {
        //阻止表单的默认提交行为
        e.preventDefault();
        var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() };
        // 发起ajax请求
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功！');
            $('#link_login').click();
        })
    })

    // 监听登录的表单提交事件
    $('#form_login').on('submit', function (e) {
        //阻止表单的默认提交行为
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                localStorage.setItem('token', res.token)
                layer.msg('登录成功！');
                console.log(res.token);
                window.location.href = '/index.html';
            }
        })
    })

})




