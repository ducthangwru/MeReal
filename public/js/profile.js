const BASE_URL = "https://api.cloudinary.com/v1_1/ducthangwru/upload"
const CLOUD_NAME = 'mereal'

$(document).ready(function() {
    var token = localStorage.getItem('token')
    var u = null

    function readURL(input) {
        if (input.files && input.files[0]) {
          var reader = new FileReader()
          
          reader.onload = function(e) {
            $('#imgAvatar').attr('src', e.target.result)
          }
          
          reader.readAsDataURL(input.files[0])
        }
      }
      
      $("#inputUploadAvatar").change(function() {
        readURL(this)
    })

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
                console.log($("#inputUploadAvatar")[0].files[0])
                let form = new FormData()
                form.append('fullname', $('#inputFullname').val())
                form.append('avatar', $("#inputUploadAvatar")[0].files[0])
                callUploadAPI('user/profile', 'put', '', token, form, (res) => {
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