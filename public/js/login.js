function rememberPwd(cb) {
    localStorage.setItem('rememberPwd', cb.checked)
}

$(document).ready(function() {
    //Nếu tồn tại remember 
    if(localStorage.getItem('rememberPwd') == 'true')
        $('#inputRemember').prop('checked', true)
    else
        $('#inputRemember').prop('checked', false)

    $('#btnLogin').click(function() {
        callAPI('public/login', 'post', '', {
            username : $('#inputUsername').val(),
            password : $('#inputPassword').val()
        }, (res) => {
            if(!res.success)
                alert(res.error)
            else
            {
                localStorage.setItem('token', res.data.token)
                localStorage.setItem('user', JSON.stringify(res.data.user))
                window.location.href = '/'
            }
        })
    })
})