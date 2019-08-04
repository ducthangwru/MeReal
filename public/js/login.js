function rememberPwd(cb) {
    localStorage.setItem('rememberPwd', cb.checked)
}

$(document).ready(function() {
    //Nếu tồn tại remember 
    if(localStorage.getItem('rememberPwd') == 'true')
    {
        $('#inputRemember').prop('checked', true)
        $('#inputUsername').val(localStorage.getItem('username'))
        $('#inputPassword').val(localStorage.getItem('password'))
    }
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

                if(localStorage.getItem('rememberPwd') == 'true')
                {
                    localStorage.setItem('username', $('#inputUsername').val())
                    localStorage.setItem('password', $('#inputPassword').val())
                }
                    
                window.location.href = '/'
            }
        })
    })
})