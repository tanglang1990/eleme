// 网页特效
$(function () {
    $('.buttons-tab').fixedTab({ offset: 44 });
    let barHeight = $('.shop-bar').innerHeight();
    let as = $('.shop-bar').find('a');
    $('.content').scroll(function () {
        let y = $('.content').scrollTop();
        if (y > 0) {
            $('.shop-bar').css('background', 'rgba(255,255,255,' + y / barHeight + ')')
        } else {
            $('.shop-bar').css('background', 'rgba(255,255,255,0)')
        }
        if (y > barHeight) {
            as.css('color', 'black')
        } else {
            as.css('color', 'white')
        }
    })

    let windowHieght = $(window).height();
    let buttonsTabHieght = $('.buttons-tab').height();
    let shopCarHeight = $('.shop-car-box').height();
    let tabsHeight = windowHieght - buttonsTabHieght - barHeight - shopCarHeight;
    $('#tab1,.shop-goods-list').css('height', tabsHeight + 'px');
})

// 基础函数
const isOpenScroll = (domArr, flag) => {
    let fn = null;
    let status = 'auto';
    if (!flag) {
        fn = () => false;
        status = 'hidden';
    }
    $.each(domArr, (index, value) => {
        value.onmousewheel = fn;
        $(value).css('overflow', status)
    })
}

const shopcarMaxheight = '22rem';
const shopcarMinheight = '2.3rem';
const showShopCar = dataArr => {
    let html = dataArr.join('');
    $('.model-bg').show();
    $('.shop-car-list .list').html(html).stop().animate({
        "maxHeight": shopcarMaxheight,
    }, () => {
        shopcarFlag = true;
    })
}
const hideShopCar = () => {
    $('.shop-car-list .list').stop().animate({
        "maxHeight": shopcarMinheight,
    }, function () {
        $(this).html('');
        shopcarFlag = false;
        $('.model-bg').hide();
    });
}
const getId = () => {
    return Math.random().toString() + Date.now().toString()
}
const getLocalStorage = res => {
    return localStorage.getItem(res)
}