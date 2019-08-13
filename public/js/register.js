let roleUser = 1

$(document).ready(function() {
    $('#btnRegister').click(() => {
        //check repwd
        if($('#inputPwd').val() === $('#inputRePwd').val())
        {
            callAPI('public/register', 'post', '', '', {
                username : $('#inputUsername').val(),
                fullname : $('#inputFullname').val(),
                email : $('#inputEmail').val(),
                password : $('#inputPwd').val(),
                role : roleUser
            }, (res) => {
                if(!res.success)
                    alert(res.error)
                else
                {
                    alert('Đăng ký thành công. Nhấn OK để đăng nhập')
                    window.location.href = '/login'
                }
            })
        }
        else
            alert('Nhập lại mật khẩu không trùng khớp')
    })

    $('#selectRoleUser').on('change', function() {
        roleUser = this.value
    });
})