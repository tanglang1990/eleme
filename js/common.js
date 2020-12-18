// 1. 全局公用
// 1.1 禁用路由
$.config = { router: false }

// 1.2 点击返回回到之前页面
$(function () {
    $('.back').click(function () {
        history.back()
    })
})

// 1.3 封装睡眠函数(用于模拟耗时操作)
function sleep(time) {
    var timeStamp = new Date().getTime();
    var endTime = timeStamp + time;
    while (true) {
        if (new Date().getTime() > endTime) {
            return;
        }
    }
}

// 1.4 获取url地址中的查询字符串参数的函数
function getQueryParam(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}

// 1.5 获取localStorage中存储数据的函数
function getData(key) {
    var datas = localStorage.getItem(key);
    if (datas) {
        return JSON.parse(datas);
    } else {
        return {};
    }
}

// 1.6 保存数据到localStorage中的函数
function saveDatas(key, datas) {
    var datasStr = JSON.stringify(datas);
    localStorage.setItem(key, datasStr);
}

// 1.7 获取当前时间的函数
function getNowTime() {
    var time = new Date();
    var year = time.getFullYear();
    var month = time.getMonth();
    month++
    month = month < 10 ? '0' + month : month;
    var date = time.getDate();
    var h = time.getHours();
    h = h < 10 ? '0' + h : h;
    var m = time.getMinutes();
    m = m < 10 ? '0' + m : m;
    var s = time.getSeconds();
    s = s < 10 ? '0' + s : s;
    return `${year}-${month}-${date} ${h}:${m}:${s}`
}

// 2. 登录 (封装好的函数)
// 2.1 正则表达式
var phoneReg = /^1[3|4|5|7|8]\d{9}$/; // 手机
var smsCodeReg = /^\d{4,6}$/; // 验证码

// 2.2 生成验证码函数
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
2.3 通过手机号码得到验证码的函数
    参  数： 函数接受一个手机号作为参数, 应符合 /^1[3|4|5|7|8]\d{9}$/ 规则
    返回值:
        如果参数符合正则表达式规则，则会发送验证码，并返回：
            { ok: true, msg: '发送成功！', expired: 60 }
        否则会返回：
            { ok: false, msg: '手机号码不正确！' }
*/
function getSmsCodeByPhone(phone) {
    if (phoneReg.test(phone)) {
        var smsCode = random(100000, 999999);
        sessionStorage.setItem(phone, smsCode);
        $.toast(`验证码为：${smsCode}，请赶快使用`, 4000);
        return { ok: true, msg: '发送成功！', expired: 60 }
    } else {
        return { ok: false, msg: '手机号码不正确！' }
    }
}

// 2.4 通过手机号码和验证码登录的函数
function login(phone, smsCode) {
    var smsCodeInStorage = sessionStorage.getItem(phone, smsCode);
    if (!smsCodeInStorage) {
        return { ok: false, msg: '请先获取验证码' }
    }
    if (smsCode == smsCodeInStorage) {
        localStorage.setItem('phone', phone)
        return { ok: true, msg: '登录成功！' }
    } else {
        return { ok: false, msg: '验证码错误！' }
    }
}

// 3. 首页 (封装好的函数)
// 3.1 根据调用参数req获取店铺列表的函数
function getShopList(req) {
    var { pagesize, pagenum, keyword } = req
    var startIndex = (pagenum - 1) * pagesize;
    var endIndex = startIndex + pagesize;

    var allShops = getAllShops()
    var shops = []
    allShops.forEach(function (shop) {
        if (shop.name.indexOf(keyword) != -1 || shop.introduce.indexOf(keyword) != -1) {
            shops.push(shop)
        }
    })

    var count = shops.length;
    var rsp = {
        count: count,
        hasnext: endIndex < count,
        datas: shops.slice(startIndex, endIndex)
    }
    // 模拟网络耗时操作
    sleep(400)
    return rsp
}

// 3.2 根据id获取店铺简介信息的函数
function getShopById(id) {
    var id = parseInt(id);
    return [{
        "id": id,
        "name": `粥品香坊${id}`,
        "img": `./images/shop${id % 3}.jpg`,
        "score": 5 - id % 2,
        "monthSellCount": 90 - id % 5,
        "sendTime": 38 - id % 6,
        "distance": 1.5 + id % 3,
        "minPrice": 20 + id % 3,
        "sender": "蜂鸟专送",
        "sendPrice": 4 + id % 2,
        "introduce": "好粥道，经典粥系",
        "discounts": ["4元老友补贴", "8元无门槛"]
    }, {
        "id": id,
        "name": `日本料理${id}`,
        "img": `./images/shop${id % 3}.jpg`,
        "score": 5 - id % 2,
        "monthSellCount": 90 - id % 5,
        "sendTime": 38 - id % 6,
        "distance": 1.5 + id % 3,
        "minPrice": 20 + id % 3,
        "sender": "蜂鸟专送",
        "sendPrice": 4 + id % 2,
        "introduce": "好料理，日本造",
        "discounts": ["4元老友补贴", "8元无门槛", "28减3"]
    }, {
        "id": id,
        "name": `龙猫美食${id}`,
        "img": `./images/shop${id % 3}.jpg`,
        "score": 5 - id % 2,
        "monthSellCount": 90 - id % 5,
        "sendTime": 38 - id % 6,
        "distance": 1.5 + id % 3,
        "minPrice": 20 + id % 3,
        "sender": "蜂鸟专送",
        "sendPrice": 4 + id % 2,
        "introduce": "龙猫美食，不容错过哦",
        "discounts": ["4元老友补贴", "8元无门槛"]
    }][id % 3]
}

// 3.3 获取所有店铺的函数
function getAllShops() {
    var totalCount = 42
    var allShop = []
    for (var i = 0; i < totalCount; i++) {
        var id = i + 1;
        allShop.push(getShopById(id))
    }
    return allShop
}

// 3.4 测试获取店铺的代码
// rsp = getShopList({
//     pagesize: 2, // 每页记录数
//     pagenum: 16, // 当前页码
// })
// console.log(JSON.stringify(rsp));
// console.log(getAllShops());


// 4. 店铺首页
// 4.1 店铺中的商品信息
var allGoods = [
    {
        "name": "热销榜",
        "foods": [
            {
                "name": "皮蛋瘦肉粥",
                "price": 10,
                "oldPrice": "12",
                "description": "咸粥",
                "sellCount": 229,
                "rating": 100,
                "info": "一碗皮蛋瘦肉粥，总是我到粥店时的不二之选。香浓软滑，饱腹暖心，皮蛋的Q弹与瘦肉的滑嫩伴着粥香溢于满口，让人喝这样的一碗粥也觉得心满意足",
                "image": "http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/750/h/750"
            },
            {
                "name": "扁豆焖面",
                "price": 14,
                "oldPrice": "16",
                "description": "",
                "sellCount": 188,
                "rating": 96,
                "info": "",
                "image": "http://fuss10.elemecdn.com/c/6b/29e3d29b0db63d36f7c500bca31d8jpeg.jpeg?imageView2/1/w/750/h/750"
            },
            {
                "name": "葱花饼",
                "price": 10,
                "oldPrice": "13",
                "description": "",
                "sellCount": 124,
                "rating": 85,
                "info": "",
                "image": "http://fuss10.elemecdn.com/f/28/a51e7b18751bcdf871648a23fd3b4jpeg.jpeg?imageView2/1/w/750/h/750"
            },
            {
                "name": "牛肉馅饼",
                "price": 14,
                "oldPrice": "16",
                "description": "",
                "sellCount": 114,
                "rating": 91,
                "info": "",
                "image": "http://fuss10.elemecdn.com/d/b9/bcab0e8ad97758e65ae5a62b2664ejpeg.jpeg?imageView2/1/w/750/h/750"
            },
            {
                "name": "招牌猪肉白菜锅贴/10个",
                "price": 17,
                "oldPrice": "28",
                "description": "",
                "sellCount": 101,
                "rating": 78,
                "info": "",
                "image": "http://fuss10.elemecdn.com/7/72/9a580c1462ca1e4d3c07e112bc035jpeg.jpeg?imageView2/1/w/750/h/750"
            },
        ]
    },
    {
        "name": "单人精彩套餐",
        "foods": [
            {
                "name": "红枣山药粥套餐",
                "price": 29,
                "oldPrice": 36,
                "description": "红枣山药糙米粥,素材包,爽口莴笋丝,四川泡菜或八宝酱菜,配菜可备注",
                "sellCount": 17,
                "rating": 100,
                "info": "",
                "image": "http://fuss10.elemecdn.com/6/72/cb844f0bb60c502c6d5c05e0bddf5jpeg.jpeg?imageView2/1/w/750/h/750"
            }
        ]
    },
    {
        "name": "冰爽饮品限时特惠",
        "foods": [
            {
                "name": "VC无限橙果汁",
                "price": 8,
                "oldPrice": 10,
                "description": "",
                "sellCount": 15,
                "rating": 100,
                "info": "",
                "image": "http://fuss10.elemecdn.com/e/c6/f348e811772016ae24e968238bcbfjpeg.jpeg?imageView2/1/w/750/h/750"
            }
        ]
    },
    {
        "name": "精选热菜",
        "foods": [
            {
                "name": "娃娃菜炖豆腐",
                "price": 17,
                "oldPrice": "",
                "description": "",
                "sellCount": 43,
                "rating": 92,
                "info": "",
                "image": "http://fuss10.elemecdn.com/d/2d/b1eb45b305635d9dd04ddf157165fjpeg.jpeg?imageView2/1/w/750/h/750"
            },
            {
                "name": "手撕包菜",
                "price": 16,
                "oldPrice": "18",
                "description": "",
                "sellCount": 29,
                "rating": 100,
                "info": "",
                "image": "http://fuss10.elemecdn.com/9/c6/f3bc84468820121112e79583c24efjpeg.jpeg?imageView2/1/w/750/h/750"
            },
        ]
    },
    {
        "name": "爽口凉菜",
        "foods": [
            {
                "name": "八宝酱菜",
                "price": 4,
                "oldPrice": "5",
                "description": "",
                "sellCount": 84,
                "rating": 100,
                "info": "",
                "image": "http://fuss10.elemecdn.com/9/b5/469d8854f9a3a03797933fd01398bjpeg.jpeg?imageView2/1/w/750/h/750"
            },
            {
                "name": "拍黄瓜",
                "price": 9,
                "oldPrice": "",
                "description": "",
                "sellCount": 28,
                "rating": 100,
                "info": "",
                "image": "http://fuss10.elemecdn.com/6/54/f654985b4e185f06eb07f8fa2b2e8jpeg.jpeg?imageView2/1/w/750/h/750"
            }
        ]
    },
];

// 4.2 根据id获取店铺简详情的函数
function getShopDetailById(id) {
    var shop = getShopById(id);
    allGoods.forEach(goods_type => {
        goods_type.foods.forEach(good => {
            good.good_id = id++;
            good.shop_id = shop.id;
        })
    })
    shop.goods = allGoods
    return shop
}


// 4.3 读取所有用户订单数据的函数
function getAllUserOrders() {
    return getData('orders')
    // {
    //     '18311112222': [
    //         { 'shopid': 1, 'goods': [], 'total_price': 12 },
    //         { 'shopid': 2, 'goods': [], 'total_price': 13 },
    //     ]
    // }
}

// 4.4 获取特定用户订单信息的函数
function getUserOrder(phone) {
    var AllUserOrders = getAllUserOrders()
    return AllUserOrders[phone] || []
    // [
    //     { 'shopid': 1, 'goods': [], 'total_price': 12 },
    //     { 'shopid': 2, 'goods': [], 'total_price': 13 },
    // ]
}

// 4.5 保存用户订单信息的函数
function saveUserOrders(phone, userOrders) {
    var AllUserOrders = getAllUserOrders()
    AllUserOrders[phone] = userOrders
    saveDatas('orders', AllUserOrders)
}

// 4.6 为用户添加订单信息的函数
function addUserOrder(phone, order) {
    var userOrders = getUserOrder(phone)
    userOrders.unshift(order)
    saveUserOrders(phone, userOrders)
}

// 4.7 获取随机订单id的函数
function getOrderId() {
    var time = new Date();
    var year = time.getFullYear();
    var month = time.getMonth();
    month++
    month = month < 10 ? '0' + month : month;
    var date = time.getDate();
    var h = time.getHours();
    h = h < 10 ? '0' + h : h;
    var m = time.getMinutes();
    m = m < 10 ? '0' + m : m;
    var s = time.getSeconds();
    s = s < 10 ? '0' + s : s;
    return `${year}${month}${date}${h}${m}${s}${random(100000, 999999)}`
}

// 5. 订单页 (封装好的函数)
// 5.1 根据分页参数获取订单列表的函数
function getOrderList(req) {
    var phone = localStorage.getItem('phone')
    var { pagesize, pagenum } = req
    var startIndex = (pagenum - 1) * pagesize;
    var endIndex = startIndex + pagesize;

    var orders = getUserOrder(phone)
    var count = orders.length;

    res = {
        count: count,
        hasnext: endIndex < count,
        datas: orders.slice(startIndex, endIndex)
    }

    // 模拟网络耗时
    sleep(300)
    return res
}