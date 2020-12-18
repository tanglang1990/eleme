// 手机验证码登录功能
// write code here...
var phoneReg = /^1[3|4|5|7|8]\d{9}$/;
var smsCodeReg = /^\d{4,6}$/;

$('input[name=phone]').keyup(function () {
    var phone = $(this).val();
    if (phoneReg.test(phone)) {
        $('#smsCodeBtn').removeAttr('disabled').removeClass('disabled')
    } else {
        $('#smsCodeBtn').attr('disabled', 'disabled').addClass('disabled')
    }
})

$('#smsCodeBtn').click(function () {
    var phone = $('input[name=phone]').val();
    var res = getSmsCodeByPhone(phone)
    if (res.ok) {
        handleSmsCodeBtn(res.expired)
    } else {
        $.toast(res.msg)
    }
})

function handleSmsCodeBtn(expired = 60) {
    $('#smsCodeBtn').attr('disabled', 'disabled').addClass('disabled')
    var timer = setInterval(function () {
        expired--
        if (expired == 0) {
            $('#smsCodeBtn').removeAttr('disabled').removeClass('disabled')
            $('#smsCodeBtn').html('获取验证码')
            clearInterval(timer)
        } else {
            $('#smsCodeBtn').html(`已发送(${expired}s)`)
        }
    }, 1000)
}

$('#loginBtn').click(function () {
    if ($(this).hasClass('disabled')) return;
    var smsCode = $('input[name=smsCode]').val();
    var phone = $('input[name=phone]').val();
    var res = login(phone, smsCode)
    if (res.ok) {
        var next = getQueryParam('next')
        if (next) {
            window.location = decodeURIComponent(next);
            return false
        }
        window.location = 'index.html'
    } else {
        $.toast(res.msg)
    }
})

$("input[name=phone], input[name=smsCode]").keyup(function () {
    var smsCode = $('input[name=smsCode]').val();
    var phone = $('input[name=phone]').val();

    if (phoneReg.test(phone) && smsCodeReg.test(smsCode)) {
        $('#loginBtn').removeClass('disabled')
    } else {
        $('#loginBtn').addClass('disabled')
    }
})