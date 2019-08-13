$(document).ready(function() {
    $('#btnForgot').click(function() {
        callAPI('public/forgotpwd', 'post', '', '', {
            email : $('#inputEmail').val()
        }, (res) => {
            if(!res.success)
                alert(res.error)
            else
            {
                alert('Chúng tôi đã gửi mã vào email. Vui lòng kiểm tra email.')
                window.location.href = '/'
            }
        })
    })
})