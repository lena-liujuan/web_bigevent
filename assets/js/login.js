$(function() {
    // 给去注册绑定点击事件
    $('#link_login').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    })

    $('#link_reg').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    })
})