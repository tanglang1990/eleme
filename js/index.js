
$(function () {
    class ShopList {
        constructor() {
            this.container = $('.index-shop-list')
            this.loading = false
            this.hasnext = true
            this.req = {
                keyword: '',
                pagesize: 10,
                pagenum: 1,
            }
            this.getPageData()
            this.listenScroll()
            this.listenSearchSubmit()
        }
        listenScroll() {
            $('.content').scroll(() => {
                let scrollTop = $('.content').scrollTop();
                var scrollHeight = $('.content')[0].scrollHeight;
                var offsetHeight = $('.content')[0].offsetHeight;
                var bottomDistance = scrollHeight - scrollTop - offsetHeight;
                if (bottomDistance < 5 && this.hasnext) {
                    this.getPageData()
                }
            })
        }
        listenSearchSubmit() {
            $('.searchbar-cancel').on('click', function () {
                $("#search").val('')
            })

            $('#searchForm').submit((e) => {
                e.preventDefault();
                this.searchInit();
                this.getPageData();
            })
        }
        searchInit() {
            // 初始化搜索参数
            this.req = {
                keyword: $("#search").val(),
                pagesize: 10,
                pagenum: 1,
            }
            // 展示加载提示符
            $('.infinite-scroll-preloader').show();
            // 清空容器中的内容
            this.container.html('')
        }
        getPageData() {
            if (this.loading) return;
            this.loading = true
            var res = getShopList(this.req)
            console.log(JSON.stringify(res));
            this.renderShopList(res.datas)
            this.req.pagenum++;
            this.hasnext = res.hasnext
            if (!this.hasnext) {
                // 隐藏加载提示符
                $('.infinite-scroll-preloader').hide();
            }

            this.loading = false
        }
        renderShopList(shopList) {
            var html = '';
            shopList.forEach(function (shop) {
                var discountHtml = ''
                shop.discounts.forEach(function (discount) {
                    discountHtml += '<span>' + discount + '</span>'

                })

                html +=
                    `<li data-direction="right">
                            <a href="./shop.html?id=${shop.id}">
                                <img src="${shop.img}" data-comp="true" style="visibility: visible;">
                                <div class="shop-info">
                                    <h4 class="name line1">${shop.name}</h4>
                                    <div class="mark">
                                        <p>
                                            <span class="text-red text-bold">${shop.score}分</span>
                                            <span>月售${shop.monthSellCount}</span>
                                        </p>
                                        <p>
                                            <span>${shop.sendTime}分钟</span>
                                            <span>${shop.distance}km</span>
                                        </p>
                                    </div>
                                    <div class="must">
                                        <span>起送￥${shop.minPrice}</span>
                                        <span>蜂鸟专送￥${shop.sendPrice}</span>
                                    </div>
                                    <div class="characteristic">
                                        <span>${shop.introduce}</span>
                                    </div>
                                    <div class="discount" data-height="51.1667" style="height: 1rem;">
                                        ${discountHtml}
                                    </div>
                                </div>
                            </a>
                        </li>
                `
            })
            this.container.append(html);
        }
    }
    new ShopList();
})
