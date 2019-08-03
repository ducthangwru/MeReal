if(getParameterByName('email'))
{
    $('#inputEmail').val(getParameterByName('email'))
}

if(getParameterByName('code'))
{
    $('#inputCode').val(getParameterByName('code'))
}

$(document).ready(function() {
    $('#btnResetPwd').click(() => {
        if($('#inputPwd').val() === $('#inputRePwd').val())
        {
            callAPI('public/resetpwd', 'post', '', {
                email : $('#inputEmail').val(),
                reset_code : $('#inputCode').val(),
                new_password : $('#inputPwd').val()
            }, (res) => {
                if(!res.success)
                    alert(res.error)
                else
                {
                    alert('Thay đổi mật khẩu thành công.')
                    window.location.href = '/login'
                }
            })
        }
        else
            alert('Nhập lại mật khẩu không trùng khớp')
    })
})