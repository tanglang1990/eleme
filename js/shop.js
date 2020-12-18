// 1. 获取登录的用户信息
// 1.1 获取当前登录用户的手机号码
let phone = localStorage.getItem('phone')
// 1.2 如果用户没有登录则调转到登录页
if (!phone) {
    var next = encodeURIComponent(location.pathname + location.search);
    window.location = './login.html?next=' + next
}

// 2. 获取店铺信息
// 2.1 通过公用函数获取查询字符串中的店铺id
let shopId = getQueryParam('id');
// 2.2 如果没有店铺id跳转回首页
if (!shopId) {
    window.location = './index.html'
}
// 2.3 如果有店铺id，则利用店铺id获取店铺详情
let shop = getShopDetailById(shopId);

// 3. 渲染店铺商品类别和列表信息
let shopcarFlag = false;
let that;
class goodsList {
    // 3.1 构造方法
    constructor(goods) {
        // 保存this的指向
        that = this;
        // 装载商品类别和商品列表的容器
        this.dom = $('#tab1');
        // 用于渲染商品类别和商品列表的数据
        this.goods = goods;
        // 存储左侧每一个分类标题type的位置
        this.leftTypePositionArr = [];
        // 存储右侧每一个分类标题type的位置
        this.rightTypePositionArr = [];
        // 页面下面是否可以滚动
        this.pageFlag = false;
        // 页面滚动时的节流阀
        this.scrollFlag = true;
        // 初始化类的方法
        this.init();
    }
    // 3.2 初始化方法
    init() {
        // 渲染左侧列表
        this.randerLeftLi();
        // 渲染右侧列表
        this.randerRightLi();
        // 开启滚动功能（table栏滚动到顶部位置解锁）
        this.isPageFlag()
        // 分别获取左右侧列表的每一个Type位置
        this.getTypePosition()
        // 滚动右侧，来控制左侧高亮
        this.rightScroll()
        // 点击左侧按钮，让右侧滚动到对应位置
        this.leftBtnClickHandler()
        // 处理数据data，方便后面加菜品数量
        this.initData()
        // 根据本地存储数据，更新选中过的菜品
        this.updata()
        // 新增菜品
        this.addGoodClickHandler();
        // 删除菜品
        this.delGoodClickHandler();
        // 点击底部购物车，弹出层
        this.openModelClickHandler()
        // 点击清除购物车
        this.clearShopCarClickHandler()
        // 新增购物车中菜品
        this.addShopGoodClickHandler();
        // 删除购物车中菜品
        this.delShopGoodClickHandler();
        // 点击结算
        this.paymentClickHandler()
    }
    // 3.3 渲染左侧商品类别的函数
    randerLeftLi() {
        // 3.3.1 定义存储拼接标签字符串的变量
        var html_str = ''

        // 3.3.2 TODO：根据this.goods属性拼接展示左侧商品类别的字符串
        /* 要求：
            1. 如果 this.goods 属性类似如下形式:
            
                [{
                    "name": "热销榜",
                    "foods": []
                }, {
                    "name": "单人精彩套餐",
                    "foods": []
                }, {
                    "name": "冰爽饮品限时特惠",
                    "foods": []
                }]
    
            2. 拼接出来的字符串 html_str 形式为：

                <li class="active">热销榜</li>
                <li>单人精彩套餐</li>
                <li>冰爽饮品限时特惠</li>
        */
        // write code here...
        $.each(this.goods, (i, v) => {
            if (i == 0) {
                html_str += `<li class="active">${v.name}</li>`
            } else {
                html_str += `<li>${v.name}</li>`
            }
        })

        // 3.3.3 如果html_str有内容，则渲染页面
        if (html_str) {
            this.dom.find('.left').html(html_str);
        }
    }
    // 3.4 渲染右侧商品列表的函数
    randerRightLi() {
        // 3.4.1 定义存储拼接标签字符串的变量
        var html_str = ''

        // 3.4.2 TODO：根据this.goods属性拼接展示右侧侧商品列表的标签字符串
        /* 要求：
            1. 如果 this.goods 属性类似如下形式:

            [{
                "name": "热销榜",
                "foods": [{
                    "name": "皮蛋瘦肉粥",
                    "price": 10,
                    "oldPrice": "12",
                    "description": "咸粥",
                    "sellCount": 229,
                    "rating": 100,
                    "info": "一碗皮蛋瘦肉粥，总是我到粥店时的不二之选。",
                    "image": "a.jpg",
                    "good_id": 2,
                    "shop_id": 2
                }, {
                    "name": "扁豆焖面",
                    "price": 14,
                    "oldPrice": "16",
                    "description": "",
                    "sellCount": 188,
                    "rating": 96,
                    "info": "",
                    "image": "b.jpg",
                    "good_id": 3,
                    "shop_id": 2
                }]
            }, {
                "name": "单人精彩套餐",
                "foods": [{
                    "name": "红枣山药粥套餐",
                    "price": 29,
                    "oldPrice": 36,
                    "description": "红枣山药糙米粥,素材包,爽口莴笋丝,四川泡菜或八宝酱菜,配菜可备注",
                    "sellCount": 17,
                    "rating": 100,
                    "info": "",
                    "image": "c.jpg",
                    "good_id": 4,
                    "shop_id": 2
                }]
            }]
    
            2. 拼接出来的字符串 html_str 形式为：

                <li class="card-type sticky">热销榜</li>
                <li class="card" data-good-id="2" data-shop-id="2">
                    <img class="abs-shop-img" src="a.jpg">
                    <div class="card-header">皮蛋瘦肉粥</div>
                    <div class="card-content">
                        <div class="list-block media-list">
                            <ul>
                                <li class="item-content">
                                    <div class="item-inner">
                                        <div class="item-type">咸粥</div>
                                        <div class="item-sell">
                                            <span>月售229份</span>
                                            <span>好评率100%</span>
                                        </div>
                                        <div class="item-price">
                                            <span>￥<i class="nowprice">10</i></span>
                                            <del>￥<i class="oldprice">12</i></del>
                                        </div>
                                        <div class="abs-item-num">
                                            <span class="min iconfont icon-reduce hide"></span>
                                            <span class="num hide"></span>
                                            <span class="plus iconfont icon-add-fill"></span>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </li>
                <li class="card" data-good-id="3" data-shop-id="2">
                    <img class="abs-shop-img" src="b.jpg" alt="">
                    <div class="card-header">扁豆焖面</div>
                    <div class="card-content">
                        <div class="list-block media-list">
                            <ul>
                                <li class="item-content">
                                    <div class="item-inner">
                                        <div class="item-type"></div>
                                        <div class="item-sell">
                                            <span>月售188份</span>
                                            <span>好评率96%</span>
                                        </div>
                                        <div class="item-price">
                                            <span>￥<i class="nowprice">14</i></span>
                                            <del>￥<i class="oldprice">16</i></del>
                                        </div>
                                        <div class="abs-item-num">
                                            <span class="min iconfont icon-reduce hide"></span>
                                            <span class="num hide"></span>
                                            <span class="plus iconfont icon-add-fill"></span>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </li>
                <li class="card-type sticky">单人精彩套餐</li>
                <li class="card" data-good-id="4" data-shop-id="2">
                    <img class="abs-shop-img" src="c.jpg" alt="">
                    <div class="card-header">红枣山药粥套餐</div>
                    <div class="card-content">
                        <div class="list-block media-list">
                            <ul>
                                <li class="item-content">
                                    <div class="item-inner">
                                        <div class="item-type">红枣山药糙米粥,素材包,爽口莴笋丝,四川泡菜或八宝酱菜,配菜可备注</div>
                                        <div class="item-sell">
                                            <span>月售17份</span>
                                            <span>好评率100%</span>
                                        </div>
                                        <div class="item-price">
                                            <span>￥<i class="nowprice">29</i></span>
                                            <del>￥<i class="oldprice">36</i></del>
                                        </div>
                                        <div class="abs-item-num">
                                            <span class="min iconfont icon-reduce hide"></span>
                                            <span class="num hide"></span>
                                            <span class="plus iconfont icon-add-fill"></span>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </li>
        */
        // write code here...
        $.each(this.goods, (i, v) => {
            html_str += `<li class="card-type sticky">${v.name}</li>`;
            if (v.foods.length > 0) {
                $.each(v.foods, (fi, fv) => {
                    html_str += `
                        <li class="card" data-good-id="${fv.good_id}" data-shop-id="${fv.shop_id}">
                            <img class="abs-shop-img" src="${fv.image}" alt="">
                            <div class="card-header">${fv.name}</div>
                            <div class="card-content">
                                <div class="list-block media-list">
                                    <ul>
                                        <li class="item-content">
                                            <div class="item-inner">
                                                <div class="item-type">${fv.description}</div>
                                                <div class="item-sell">
                                                    <span>月售${fv.sellCount}份</span>
                                                    <span>好评率${fv.rating}%</span>
                                                </div>
                                                <div class="item-price">
                                                    <span>￥<i class="nowprice">${fv.price}</i></span>
                                                    <del>￥<i class="oldprice">${fv.oldPrice}</i></del>
                                                </div>
                                                <div class="abs-item-num">
                                                    <span class="min iconfont icon-reduce hide"></span>
                                                    <span class="num hide"></span>
                                                    <span class="plus iconfont icon-add-fill"></span>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </li>`;
                })
            }
        })

        // 3.3.3 如果html_str有内容，则渲染页面
        if (html_str) {
            this.dom.find('.right').html(html_str);
        }
    }
    // 3.5 开启滚动功能
    isPageFlag() {
        let domArr = this.dom.find('.left,.right')
        isOpenScroll(domArr, false);
        let shopHeaderHeight = $('.shop-header').innerHeight();
        let shopBarHeight = $('.shop-bar').innerHeight();
        $('.content').scroll(function () {
            let contentScrollTop = $(this).scrollTop();
            if (Math.ceil(contentScrollTop) + 1 >= shopHeaderHeight - shopBarHeight) {
                isOpenScroll(domArr, true);
            } else {
                isOpenScroll(domArr, false);
            }
        }).trigger('scroll')
    }
    getTypePosition() {
        let lisRight = that.dom.find('.right li.card-type');
        let leftLis = that.dom.find('.left li');
        lisRight.each((index, value) => {
            this.rightTypePositionArr.push(value.offsetTop);
        })
        leftLis.each((index, value) => {
            this.leftTypePositionArr.push(value.offsetTop);
        })
    }
    rightScroll() {
        that.dom.find('.right').scroll(function () {
            if (!that.scrollFlag) return
            // 获取被卷去距离和最大位置
            let listScrollTop = $(this).scrollTop();
            let max = 0;
            $.each(that.rightTypePositionArr, (index, value) => {
                if (listScrollTop > value) {
                    max = index;
                }
            })
            that.dom.find('.left').stop().animate({
                scrollTop: that.leftTypePositionArr[max]
            }, 1000).children().eq(max).addClass('active').siblings().removeClass('active');
        })
    }
    leftBtnClickHandler() {
        this.dom.find('.left li').click(function () {
            that.scrollFlag = false;
            $(this).addClass('active').siblings().removeClass('active');
            let index = $(this).index();
            that.dom.find('.right').stop().animate({
                scrollTop: that.rightTypePositionArr[index] + 1
            }, () => {
                that.scrollFlag = true
            })
        })
        return false
    }
    initData() {
        // 给所有的商品都加入一个购物车数量
        this.goods = this.goods.map(res => {
            let obj = res.foods.map(res2 => {
                res2.shopcarnum = 0
                return res2;
            })
            return obj
        })
    }
    updata(isitem = false) {
        // 更新页面所有的dom数据
        this.clearShopcarPage(isitem)
        let filterData = this.filterGoodData();
        if (!filterData[0]) return;
        filterData[0].shoplist.forEach(v => {
            $('li.card').each(function (index, value) {
                if ($(value).data('goodId') == v.good_id) {
                    $(value).find('.abs-item-num').children('.min').show()
                    $(value).find('.abs-item-num').children('.num').show().html(v.shopcarnum)
                }
            })
            if (isitem) {
                $('li.shop-li').each(function (index, value) {
                    if ($(value).data('goodId') == v.good_id) {
                        $(value).find('.abs-list-num').children('.min').show()
                        $(value).find('.abs-list-num').children('.num').show().html(v.shopcarnum)
                    }
                })
            }
        });
        // 更新价格
        let { nowSum, oldSum, num } = this.getSum();
        $('.shop-car').addClass('active').find('.abs-num').show()
        $('.shop-car-button').find('.abs-num').html(num);
        $('.shop-car-button .money').find('.shopcar-nowprice').html(nowSum);
        $('.shop-car-button .money').find('.shopcar-oldprice').html(oldSum);
    }
    getGoodsData() {
        let data = localStorage.getItem('goodsList') || this.getInitData();
        return JSON.parse(data);
    }
    setGoodsData(data) {
        localStorage.setItem('goodsList', JSON.stringify(data));
    }
    addGoodClickHandler() {
        this.dom.find('.right .plus').click(function (event) {
            event.stopPropagation();
            let goodId = $(this).parents('.card').data('goodId');

            let chooseGood = that.chooseGoodData(goodId);
            chooseGood.shopcarnum = 1;
            let shopCarListData = that.getGoodsData();
            if (shopCarListData.shopcar[0]) {
                let shopflag = false;
                for (let i = 0; i < shopCarListData.shopcar.length; i++) {
                    if (shopCarListData.shopcar[i].shopid == chooseGood.shop_id) {
                        let foodflag = false;
                        for (let j = 0; j < shopCarListData.shopcar[i].shoplist.length; j++) {
                            if (shopCarListData.shopcar[i].shoplist[j].good_id == chooseGood.good_id) {
                                shopCarListData.shopcar[i].shoplist[j].shopcarnum++;
                                foodflag = true;
                                break;
                            }
                        }
                        if (!foodflag) {
                            shopCarListData.shopcar[i].shoplist.push(chooseGood)
                        }
                        shopflag = true;
                    }
                }
                if (!shopflag) {
                    shopCarListData.shopcar.push({
                        shopid: chooseGood.shop_id,
                        shoplist: [chooseGood]
                    })
                }
            } else {
                shopCarListData.shopcar.push({
                    shopid: chooseGood.shop_id,
                    shoplist: [chooseGood]
                })
            }
            that.setGoodsData(shopCarListData);
            that.updata()
        })
    }
    delGoodClickHandler() {
        this.dom.find('.right .min').click(function (event) {
            event.stopPropagation()
            let goodId = $(this).parents('.card').data('goodId');
            let chooseGood = that.chooseGoodData(goodId);
            let shopCarListData = that.getGoodsData();
            for (let i = 0; i < shopCarListData.shopcar.length; i++) {
                if (shopCarListData.shopcar[i].shopid == chooseGood.shop_id) {
                    for (let j = 0; j < shopCarListData.shopcar[i].shoplist.length; j++) {
                        if (shopCarListData.shopcar[i].shoplist[j].good_id == chooseGood.good_id) {
                            if (shopCarListData.shopcar[i].shoplist[j].shopcarnum <= 1) {
                                shopCarListData.shopcar[i].shoplist.splice(j, 1)
                                $(this).hide()
                                $(this).next().hide().html('')
                            } else {
                                shopCarListData.shopcar[i].shoplist[j].shopcarnum--;
                            }
                            break;
                        }
                    }
                }
            }
            that.setGoodsData(shopCarListData);
            that.updata()
        })
    }
    openModelClickHandler() {
        $('.shop-car-button .info').click(function (event) {
            event.stopPropagation()
            let shopCarListData = that.getGoodsData();
            let isflag = false;
            for (let i = 0; i < shopCarListData.shopcar.length; i++) {
                if (shopCarListData.shopcar[i].shopid == shopId && shopCarListData.shopcar[i].shoplist.length > 0) {
                    isflag = true;
                }
            }
            if (!isflag) return;
            let { shoplist } = shopCarListData.shopcar.filter(res => {
                if (res.shopid == shopId) {
                    return res.shoplist
                }
            })[0];
            if (shopcarFlag) {
                hideShopCar()
                return false
            }
            // shopId
            let shoplistArr = shoplist.map(res => {
                return `<li class="shop-li" data-good-id="${res.good_id}" data-shop-id="${res.shop_id}">
                <img src="${res.image}" alt="">
                <div class="shop-li-info">
                    <p class="name">${res.name}</p>
                    <p class="info">
                        <span>￥<i class="nowprice">${res.price}</i></span>
                        <del>￥<i class="oldprice">${res.oldPrice}</i></del>
                    </p>
                    <div class="abs-list-num">
                        <span class="min iconfont icon-reduce"></span>
                        <span class="num">${res.shopcarnum}</span>
                        <span class="plus iconfont icon-add-fill"></span>
                    </div>
                </div>
            </li>`
            })
            if (!shopcarFlag) {
                showShopCar(shoplistArr)
            }
        })
        $('.model-bg').click(function () {
            hideShopCar()
            return false
        })
    }
    clearShopCarClickHandler() {
        $('.shop-car-list .clear').click(function () {
            let shopCarListData = that.getGoodsData();
            shopCarListData.shopcar.forEach((v, i) => {
                if (v.shopid == shopId) {
                    shopCarListData.shopcar.splice(i, 1)
                    hideShopCar()
                }
            })
            that.setGoodsData(shopCarListData);
            that.updata(true)
        })
    }
    getInitData = () => {
        let obj = {
            phone: phone,
            shopcar: []
        }
        return JSON.stringify(obj)
    }
    addShopGoodClickHandler() {
        $('.shop-car-list').on('click', '.plus', function (event) {
            event.stopPropagation()
            let goodId = $(this).parents('.shop-li').data('goodId');
            let chooseGood = that.chooseGoodData(goodId)
            chooseGood.shopcarnum = 1;
            let shopCarListData = that.getGoodsData();
            if (shopCarListData.shopcar[0]) {
                let shopflag = false;
                for (let i = 0; i < shopCarListData.shopcar.length; i++) {
                    if (shopCarListData.shopcar[i].shopid == chooseGood.shop_id) {
                        let foodflag = false;
                        for (let j = 0; j < shopCarListData.shopcar[i].shoplist.length; j++) {
                            if (shopCarListData.shopcar[i].shoplist[j].good_id == chooseGood.good_id) {
                                shopCarListData.shopcar[i].shoplist[j].shopcarnum++;
                                foodflag = true;
                                break;
                            }
                        }
                        if (!foodflag) {
                            shopCarListData.shopcar[i].shoplist.push(chooseGood)
                        }
                        shopflag = true;
                    }
                }
                if (!shopflag) {
                    shopCarListData.shopcar.push({
                        shopid: chooseGood.shop_id,
                        shoplist: [chooseGood]
                    })
                }
            } else {
                shopCarListData.shopcar.push({
                    shopid: chooseGood.shop_id,
                    shoplist: [chooseGood]
                })
            }
            that.setGoodsData(shopCarListData);
            that.updata(true)
        })
    }
    delShopGoodClickHandler() {
        $('.shop-car-list').on('click', '.min', function (event) {
            event.stopPropagation()
            let goodId = $(this).parents('.shop-li').data('goodId');
            let delId;
            let chooseGood = that.chooseGoodData(goodId)
            let shopCarListData = that.getGoodsData();
            for (let i = 0; i < shopCarListData.shopcar.length; i++) {
                if (shopCarListData.shopcar[i].shopid == chooseGood.shop_id) {
                    for (let j = 0; j < shopCarListData.shopcar[i].shoplist.length; j++) {
                        if (shopCarListData.shopcar[i].shoplist[j].good_id == chooseGood.good_id) {
                            if (shopCarListData.shopcar[i].shoplist[j].shopcarnum <= 1) {
                                shopCarListData.shopcar[i].shoplist.splice(j, 1)
                                $(this).hide();
                                $(this).next().hide().html('');
                                $(this).parents('.shop-li').remove();
                                delId = chooseGood.good_id
                                if (shopCarListData.shopcar[i].shoplist.length == 0) {
                                    hideShopCar()
                                }
                            } else {
                                shopCarListData.shopcar[i].shoplist[j].shopcarnum--;
                            }
                            break;
                        }
                    }
                }
            }
            if (delId) {
                $('.shop-goods-list li.card').each(function (index, value) {
                    if ($(value).data('goodId') == delId) {
                        $(value).find('.abs-item-num').children('.min').hide()
                        $(value).find('.abs-item-num').children('.num').hide().html(0)
                    }
                })
            }
            that.setGoodsData(shopCarListData);
            that.updata(true)
        })
    }
    getSum() {
        let nowSum = 0;
        let oldSum = 0;
        let num = 0;
        let shopCarListData = that.getGoodsData();
        let isflag = false;
        for (let i = 0; i < shopCarListData.shopcar.length; i++) {
            if (shopCarListData.shopcar[i].shopid == shopId && shopCarListData.shopcar[i].shoplist.length > 0) {
                isflag = true;
            }
        }
        if (!isflag) return { nowSum, oldSum, num };
        let { shoplist } = shopCarListData.shopcar.filter(res => {
            if (res.shopid == shopId) {
                return res.shoplist
            }
        })[0];
        shoplist.forEach(v => {
            nowSum += parseFloat(v.price) * v.shopcarnum * 10000;
            oldSum += parseFloat(v.oldPrice || v.price) * v.shopcarnum * 10000;
            num += v.shopcarnum || 0;
        })
        nowSum /= 10000;
        oldSum /= 10000;
        return { nowSum, oldSum, num }
    }
    clearShopcarPage(isitem = false) {
        // 清空菜品列表
        $('.abs-item-num').children('.min').hide();
        $('.abs-item-num').children('.num').html('').hide();
        // 清空底部购物车
        $('.shop-car').removeClass('active').find('.abs-num').html('').hide().siblings('.money').find('.shopcar-nowprice').html('0').parents('.money').find('.shopcar-oldprice').html('0');
        // 清空购物车列表
        if (!isitem) {
            $('.shop-car-list .list').empty();
        }
    }
    filterGoodData() {
        let data = that.getGoodsData();
        var filterData = data.shopcar.filter(res => {
            if (res.shopid == shopId && res.shoplist.length > 0) {
                return res
            }
        })
        return filterData
    }
    chooseGoodData(goodId) {
        let chooseGood;
        that.goods.forEach(v => {
            v.some(res => {
                if (res.good_id == goodId) {
                    chooseGood = res;
                    return true;
                }
            })
        });
        return chooseGood
    }
    paymentClickHandler() {
        $('.shop-car').on('click', '.check', function () {
            if ($('.shop-car').hasClass('active')) {
                $.confirm('是否结算', function () {
                    let order = {
                        'order_id': getOrderId(),
                        'total_price': $('.shopcar-nowprice').text(),
                        'shop': { 'id': shop.id, 'name': shop.name, 'img': shop.img },
                        'state': '待配送',
                        'goods': that.filterGoodData()[0]['shoplist'],
                        'create_time': getNowTime()
                    }
                    addUserOrder(phone, order)
                    localStorage.removeItem('goodsList')
                    window.location = './order.html'
                });
            }
        });
    }
}

// 4. 渲染店铺基础信息的函数
function renderShop(shop) {
    $('#shopInfo .card-header').text(shop.name)
    $('#shopInfo .abs-shop-img').attr('src', shop.img)
    $('#shopInfo .item-title').text(`${shop.sender} · 送约${shop.sendTime}分钟 · 月售${shop.monthSellCount}`)
    $('#shopInfo .introduce').text(shop.introduce)
}


// 5. 页面加载完后调用函数和使用类渲染页面
$(function () {
    renderShop(shop)
    new goodsList(shop.goods);
})


