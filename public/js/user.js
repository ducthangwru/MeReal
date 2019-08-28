var dataSource = []
var token = localStorage.getItem('token')

var tableUser = $('#tableUser').DataTable({
    scrollY:        '50vh',
    sDom: '<"row view-filter"<"col-sm-12"<"pull-left"l><"pull-right"f><"clearfix">>>t<"row view-pager"<"col-sm-12"<"text-center"ip>>>',
    scrollCollapse: true,
    paging:         false,
    search : true,
    select: {
        style : "multi"
    },
    columns: [
        {},
        {title: "STT"},
        {title: "Tên đăng nhập"},
        {title: "Họ tên"},
        {title: "Email"},
        {title: "Quyền"},
        {title: "Trạng thái"},
        {title: "Thao tác"}
    ],
    columnDefs: [{
            orderable: false,
            "width": "0%",
            visible : false,
            "targets": 0
        },
        {
            orderable: false,
            "width": "5%",
            "className": 'text-center',
            "targets": 1
        },
        {
            orderable: true,
            "width": "20%",
            "className": 'text-center',
            "targets": 2
        },
        {
            orderable: true,
            "width": "20%",
            "className": 'text-center',
            "targets": 3
        },
        {
            orderable: true,
            "width": "15%",
            "className": 'text-center',
            "targets": 4
        },
        {
            orderable: true,
            "width": "15%",
            "className": 'text-center',
            "targets": 5,
            "mRender": function(data, type, row) {
                if(row[5] == 1) 
                    return `<a class="label label-default">Người dùng</a>` 
                else if(row[5] == 2)
                    return `<a class="label label-warning">Đại lý</a>`
                else if(row[5] == 3)
                    return `<a class="label label-success">Quản trị viên</a>`
            }
        },
        {
            orderable: true,
            "width": "15%",
            "className": 'text-center',
            "targets": 6,
            "mRender": function(data, type, row) {
                return (row[6] == 1) ? `<a class="label label-success">Hoạt động</a>` : `<a class="label label-danger">Khóa</a>`
            }
        },
        {
            orderable: false,
            "width": "10%",
            "className": 'text-center',
            "targets": 7,
            "mRender": function(data, type, row) {
                let lock = ''
                lock = (row[6] == 1) ? `lock` : `check`
                return `<a class="label label-success" onclick="lockUser('${encodeURI(JSON.stringify(row))}')"><i class="fa fa-${lock}"></i></a>
                        <a class="label label-danger" onclick="deleteUser('${row[0]}')"><i class="fa fa-trash"></i></a>`
            }
        }
    ],
     "fnRowCallback": function(nRow, aData, iDisplayIndex) {
        $("td:first", nRow).html(iDisplayIndex + 1)
        return nRow
    }
})

$(document).ready(function() {
    loadDataUser()
})

function loadDataUser() {
    dataSource = []
    tableUser ? tableUser.clear().draw() : null

    callAPI('user', 'GET', '', token, null, (res) => {
        if(!res.success)
            alert(res.error)
        else
        {
            for (let i = 0; i < res.data.docs.length; i++) {
                dataSource.push([ 
                    res.data.docs[i]._id,
                    '',
                    res.data.docs[i].username,
                    res.data.docs[i].fullname,
                    res.data.docs[i].email,
                    res.data.docs[i].role,
                    res.data.docs[i].status,
                    ''
                ])
            }

            tableUser.rows.add(dataSource).draw()
        }
    })
}

function lockUser(data) {
    data = JSON.parse(decodeURI(data))
    let r = null
    if(data[6] == 1)
        r = confirm("Bạn có chắc chắn muốn khóa tài khoản này?")
    else
        r = confirm("Bạn có chắc chắn muốn mở khóa tài khoản này?")

    if (r == true) {
        callAPI('user/status', 'PUT', '', token, {
            _id : data[0],
            status : data[6] * -1
        }, (res) => {
            if(!res.success)
                alert(res.error)
            else
            {
                alert('Thành công!')
                loadDataUser()
            }
        })
    }
}
