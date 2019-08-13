$(document).ready(function() {
    var token = localStorage.getItem('token')
    var u = null

    getProfile(token, null, (data) => {
        u = data
        if(u)
        {
            localStorage.setItem('user', JSON.stringify(u))
      
            $('#inputUsername').val(u.username)
            $('#inputFullname').val(u.fullname)
            $('#inputEmail').val(u.email)
            
            $('#btnChangePwd1').click(() => {
                $('#divChangeInfo').hide()
                $('#divChangePwd').show()
            })

            $('#btnBack').click(() => {
                $('#divChangePwd').hide()
                $('#divChangeInfo').show()
            })

            $('#btnSave').click(() => {
                callAPI('user/profile', 'put', '', token, {
                    fullname : $('#inputFullname').val()
                }, (res) => {
                    if(!res.success)
                        alert(res.error)
                    else
                    {
                        getProfile(token, '', (data) => {
                            if(data)
                            {
                                localStorage.setItem('user', JSON.stringify(data))
                                u = JSON.parse(localStorage.getItem('user'))
                            }
                        })

                        alert('Đổi thông tin thành công!')
                    }
                })

            })

            //Đổi mật khẩu
            $('#btnChangePwd2').click(() => {
                if($('#inputPwd').val() === $('#inputRePwd').val())
                {
                    callAPI('user/changepwd', 'put', '', token, {
                        old_password : $('#inputOldPwd').val(),
                        new_password : $('#inputPwd').val()
                    }, (res) => {
                        if(!res.success)
                            alert(res.error)
                        else
                        {
                            alert('Đổi mật khẩu thành công')
                            window.location.href = '/logout'
                        }
                    })
                }
            })
        }
    })
})