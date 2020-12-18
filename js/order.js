$(function () {
    class OrderList {
        constructor() {
            this.container = $('#order-list')
            this.loading = false
            this.hasnext = true
            this.req = {
                keyword: '',
                pagesize: 5,
                pagenum: 1,
            }
            this.getPageData()
            this.listenScroll()
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
        getPageData() {
            if (this.loading) return;
            this.loading = true
            var res = getOrderList(this.req)
            console.log(JSON.stringify(res));
            this.renderOrderList(res.datas)
            this.req.pagenum++;
            this.hasnext = res.hasnext
            if (!this.hasnext) {
                // 隐藏加载提示符
                $('.infinite-scroll-preloader').hide();
            }
            this.loading = false
        }
        renderOrderList(orderList) {
            var html = '';
            orderList.forEach(function (order) {
                html +=
                    `
                        <div class="card">
                        <div class="card-content">
                            <div class="list-block media-list">
                                <ul>
                                    <li class="item-content">
                                        <div class="item-media">
                                            <img src="${order.shop.img}" width="44">
                                        </div>
                                        <div class="item-inner">
                                            <div class="item-title-row">
                                                <div class="item-title">${order.shop.name}</div>
                                                <div class="litte_font">${order.state}</div>
                                            </div>
                                            <div class="item-subtitle small_font">${order.create_time}</div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="card-footer">
                            <span>${order.goods[0].name} 等${order.goods.length}件</span>
                            <span>
                                <span class="small_font">￥</span> ${order.total_price}
                            </span>
                        </div>
                    </div>
                        `
            })
            this.container.append(html);
        }
    }
    new OrderList();
})