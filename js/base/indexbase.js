// 1. 页面特效
$(function () {
    // 1.0 轮播图
    var swiper = new Swiper('.swiper-container', {
        pagination: {
            el: '.swiper-pagination',
        },
        loop: true,
        autoplay: {
            delay: 2500,
            stopOnLastSlide: false,
            disableOnInteraction: true,
        }
    });

    // 1.2 页面滚动特效
    let barHeight = $('.index-bar').innerHeight();
    let locationHeight = $('.index-location').innerHeight();
    $('.content').scroll(function () {
        let y = $('.content').scrollTop();
        if (y > 0) {
            $('.index-bar').css('background', 'rgba(2,182,253,' + y / barHeight + ')')
        } else {
            $('.index-bar').css('background', 'rgba(2,182,253,0)')
        }
        if (y > locationHeight) {
            $('.index-search').css({
                'background': 'rgba(255,255,255,1)',
                'position': 'fixed',
                'top': '2.2rem'
            })
            $('.index-hot').css('visibility', 'hidden')
        } else {
            $('.index-search').css({
                'background': 'rgba(255,255,255,0)',
                'position': 'absolute',
                'top': '4.2rem'
            })
            $('.index-hot').css('visibility', 'visible')
        }
    })
})

// 2. 地图定位
$(function () {
    // 百度地图API功能
    // API参考地址 http://lbsyun.baidu.com/jsdemo.htm#i8_1
    var map = new BMap.Map("allmap");
    var point = new BMap.Point(116.331398, 39.897445);
    map.centerAndZoom(point, 12);
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            var mk = new BMap.Marker(r.point);
            map.addOverlay(mk);
            map.panTo(r.point);
            console.log('位置：' + r.point.lng + ',' + r.point.lat + '\n' + r.address.city + r.address.district);
            $('#address').text(r.address.city + r.address.district)
        }
        else {
            console.log('failed' + this.getStatus());
        }
    }, { enableHighAccuracy: true })

    //关于状态码
    //BMAP_STATUS_SUCCESS	检索成功。对应数值“0”。
    //BMAP_STATUS_CITY_LIST	城市列表。对应数值“1”。
    //BMAP_STATUS_UNKNOWN_LOCATION	位置结果未知。对应数值“2”。
    //BMAP_STATUS_UNKNOWN_ROUTE	导航结果未知。对应数值“3”。
    //BMAP_STATUS_INVALID_KEY	非法密钥。对应数值“4”。
    //BMAP_STATUS_INVALID_REQUEST	非法请求。对应数值“5”。
    //BMAP_STATUS_PERMISSION_DENIED	没有权限。对应数值“6”。(自 1.1 新增)
    //BMAP_STATUS_SERVICE_UNAVAILABLE	服务不可用。对应数值“7”。(自 1.1 新增)
    //BMAP_STATUS_TIMEOUT	超时。对应数值“8”。(自 1.1 新增)
})
