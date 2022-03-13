$(function () {
    var layer = layui.layer;
    var form = layui.form;


    initCate();
    // 初始化富文本编辑器
    initEditor()
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('获取分类列表失败')
                }
                // layer.msg('获取分类列表成功')
                // 获取到以后渲染到tpl-table下拉框中
                var htmlStr = template('tpl-cate', res)
                $('[name="cate_id"]').html(htmlStr)
                form.render();
            }
        });
    }

    // 实现基本剪裁效果
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    //为选择封面按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })

    // 监听coverFile的change事件
    $('#coverFile').on('change', function (e) {
        console.log(e);
        // 获取到文件的列表数组
        var files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return layer.msg('请选择图片');
        }
        // 根据文件创建对应的url地址
        var url = URL.createObjectURL(files[0])
        // 为剪裁区重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', url)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义文章发布的状态
    var art_state = '已发布'
    // 给存为草稿绑定点击事件
    $('#btnSave').on('click', function () {
        art_state = '草稿'
    })

    // 监听表单的提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        // 基于form表单快速创建一个formdata对象
        var fd = new FormData($(this)[0])

        fd.append('state', art_state);
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })
    })

    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }
}

)