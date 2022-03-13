$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    var q = {
        pagenum: '1',
        pagesize: '2',
        cate_id: '',
        state: ''
    }

    initTable()
    initCate()
    // 发请求获取文章列表数据的方法
    function initTable() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('获取文章列表失败')
                }
                // layer.msg('获取文章列表成功')
                // console.log(res);
                // 获取列表成功以后渲染到页面上
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                renderPage(res.total);

            }
        });
    }

    // 定义initCate函数请求文章分类的列表数据
    function initCate() {
        //初始化文章分类的方法
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('获取文章分类列表失败')
                }
                // layer.msg('获取文章分类列表成功')
                // 成功获取以后渲染到[name="cate_id"]中
                var htmlStr = template('tpl-cate', res)
                $('[name="cate_id"]').html(htmlStr)
                form.render()
            }
        });
    }

    // 监听表单的提交事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取表单中选中的项的值
        var cate_id = $('[name="cate_id"]').val();
        var state = $('[name="state"]').val();
        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件重新渲染表格
        initTable();
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function (obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                // console.log(first)
                // console.log(obj.curr)
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                // 根据最新的 q 获取对应的数据列表，并渲染表格
                // initTable()
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 实现删除文章的功能
    // 为删除按钮绑定点击事件, 通过代理形式为绑定
    $('tbody').on('click', '.btn-delete', function () {
        e.preventDefault();
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if (res.status != 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除成功')
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable();
                }
            });
            layer.close(index);
        });
    })

})