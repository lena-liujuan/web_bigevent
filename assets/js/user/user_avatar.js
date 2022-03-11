$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    var layer = layui.layer;
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 给上传文件按钮绑定点击事件
    $('#btnUP').on('click', function () {
        //alert('1')
        $('#file').click();
    })

    // 实现剪裁区域图片替换(change)
    $('#file').change(function (e) {
        // console.log(e);
        // 获取用户的文件
        var filelist = e.target.files
        // 判断文件的个数
        if (filelist.length === 0) {
            return layer.msg('请上传图片')
        }
        // 拿到用户的图片
        var file = e.target.files[0]
        // console.log(file);
        // 将文件转换为url路径
        var imgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')//销毁裁剪区域
            .attr('src', imgURL)//重新设置图片路径
            .cropper(options)//重新初始化裁剪区域
    });

    // 将裁剪后的头像进行上传(为确定按钮绑定点击事件)
    $('#btnUpload').click(function () {
        // 1. 要拿到用户裁剪之后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $.ajax({
            type: "POST",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('上传图片失败')
                }
                //上传成功后渲染头像
                // console.log('上传图片成功');
                window.parent.getUserInfo();
            }
        });
    });


})