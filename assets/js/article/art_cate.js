$(function () {
    var layer = layui.layer
    var form = layui.form
    initArtCateList();
    // 获取文章分类列表信息
    function initArtCateList() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取列表失败')
                }
                // console.log(res);
                //调用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    };

    // 为添加类别按钮绑定点击事件
    var indexAdd = null
    $('#btnAddCate').click(function (e) {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '300px'],
            content: $('#dialog-add').html()
        });
    });

    //发请求新增文章分类(监听表单的提交事件)
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('添加图书失败')
                }
                //console.log('添加图书成功');
                initArtCateList();
                //关闭对应弹出层
                layer.close(indexAdd);
            }
        });
    })


    // 通过代理的形式为编辑按钮绑定点击事件
    var indexEdit = null;
    $('body').on('click', '.btn-edit', function (e) {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '300px'],
            content: $('#dialog-edit').html()
        });

        var id = $(this).attr('data-id');
        // console.log(id);
        // 发请求根据id获取文章分类数据
        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('获取文章分类数据失败')
                }
                // console.log(res);
                // layer.msg('获取文章分类数据成功')
                form.val('form-edit', res.data)
            }
        });

    })

    // 通过代理的形式为修改分类的表单添加submit事件(监听表单的提交事件)
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    console.log(res.message);
                    return layer.msg('更新分类信息失败')
                }
                layer.msg('更新分类数据成功')
                layer.close(indexEdit)
                initArtCateList()
            }
        });
    })

    //通过代理为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            // 发起请求删除对应的数据
            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    if (res.status != 0) {
                        return layer.msg('删除文章分类失败')
                    }
                    layer.msg('删除文章分类成功')
                    initArtCateList()
                    layer.close(index);
                }
            });

        });
    })
})
