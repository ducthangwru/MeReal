var dataSource = []
var token = localStorage.getItem('token')
var u = JSON.parse(localStorage.getItem('user'))
var dataTime = null

var tableRequest = $('#tableRequest').DataTable({
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
        {title: "Mô tả"},
        {title: "Đại lý"},
        {title: "Quà tặng"},
        {title: "Báo giá (VNĐ)"},
        {title: "Top win"},
        {title: "Khung giờ"},
        {title: "Ngày"},
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
            "width": "2%",
            "className": 'text-center',
            "targets": 1
        },
        {
            orderable: true,
            "width": "10%",
            "className": 'text-center',
            "targets": 2
        },
        {
            orderable: true,
            "width": "10%",
            "className": 'text-center',
            "targets": 3
        },
        {
            orderable: true,
            "width": "10%",
            "className": 'text-center',
            "targets": 4
        },
        {
            orderable: true,
            "width": "8%",
            "className": 'text-center',
            "targets": 5,
            "mRender": function(data, type, row) {
                return numeral(row[5]).format('0,0')
            }
        },
        {
            orderable: true,
            "width": "10%",
            "className": 'text-center',
            "targets": 6
        },
        {
            orderable: true,
            "width": "10%",
            "className": 'text-center',
            "targets": 7,
            "mRender": function(data, type, row) {
                for (let i = 0; i < dataTime.length; i++) {
                    if(dataTime[i].id == row[7])
                        return `${dataTime[i].from}-${dataTime[i].to}`
                }
            }
        },
        {
            orderable: true,
            "width": "10%",
            "className": 'text-center',
            "targets": 8,
            "mRender": function(data, type, row) {
                return moment(row[8]).format('DD/MM/YYYY')
            }
        },
        {
            orderable: true,
            "width": "10%",
            "className": 'text-center',
            "targets": 9,
            "mRender": function(data, type, row) {
                //PENDING : 0,
                //ACTIVED : 1,
                //CANCEL : -1,
                //SAVE : -2
                let nRow = ''

                switch(row[9])
                {
                    case 0:
                        nRow =  `<a class="label label-warning">Đã gửi</a>`
                        break
                    case 1:
                        nRow =  `<a class="label label-success">Đã duyệt</a>`
                        break
                    case -1:
                        nRow =  `<a class="label label-danger">Hủy</a>`
                        break
                    case -2:
                        nRow =  `<a class="label label-default">Lưu</a>`
                        break
                }
                return nRow
            }
        },
        {
            orderable: false,
            "width": "10%",
            "className": 'text-center',
            "targets": 10,
            "mRender": function(data, type, row) {
                if(u.role == 3)
                {
                    return `
                    <a class="label label-warning" href="/question?id=${row[0]}"><i class="fa fa-question"></i></a>
                    <a class="label label-success" onclick="acceptRequest('${row[0]}')"><i class="fa fa-check"></i></a>
                    <a class="label label-danger" onclick="cancelRequest('${row[0]}')"><i class="fa fa-lock"></i></a>`
                }
                else
                {
                    let hidden = ''
                    if(row[9] != -2)
                        hidden = 'hidden'

                    return `<a class="label label-success" onclick="editRequest('${encodeURI(JSON.stringify(row))}')" ${hidden}><i class="fa fa-edit"></i></a>
                    <a class="label label-danger" onclick="deleteRequest('${row[0]}')" ${hidden}><i class="fa fa-trash"></i></a>`
                }
            }
        }
    ],
    "fnRowCallback": function(nRow, aData, iDisplayIndex) {
        $("td:first", nRow).html(iDisplayIndex + 1)
        return nRow
    }
})

if(u.role == 3)
{
    $('#btnAddRequest').hide()
}

$(document).ready(function() {
    $(":input").inputmask()
    loadDataRequest()
    loadDataTime()
    loadDataGift()

    $('#btnAddRequest').click(() => {
        $('#h4AddEditRequest').text('Thêm mới yêu cầu')
        $('#btnAddEditRequest').text('Thêm')
        $('#btnAddEditRequest').attr('data-name', 'add')
        $('#modalAddEditRequest').modal('show')
    })

    $('#btnAddEditRequest').click(() => {
        if($('#btnAddEditRequest').attr('data-name') == 'add')
        {
            callAPI('userRequest', 'POST', '', token, {
                gift: $('#selectGift').val(),
                top_win : $('#inputTopWin').val(),
                desc : $('#inputDesc').val(),
                price : $('#inputPrice').val(),
                time : $('#selectTime').val(),
                date: $('#inputDate').val(),
                status: $('#selectStatus').val() 
            }, (res) => {
                if(!res.success)
                    alert(res.error)
                else
                {
                    $('#inputTopWin').val('')
                    $('#inputDesc').val('')
                    $('#inputPrice').val('')
                    $('#inputDate').val('')
                    loadDataRequest()
                    $('#modalAddEditRequest').modal('hide')
                }
            })
        }
        else if($('#btnAddEditRequest').attr('data-name') == 'edit')
        {
            callAPI('userRequest', 'PUT', '', token, {
                gift: $('#selectGift').val(),
                top_win : $('#inputTopWin').val(),
                desc : $('#inputDesc').val(),
                price : $('#inputPrice').val(),
                time : $('#selectTime').val(),
                date: $('#inputDate').val(),
                status: $('#selectStatus').val(),
                _id: $('#idRequest').text() 
            }, (res) => {
                if(!res.success)
                    alert(res.error)
                else
                {
                    $('#inputTopWin').val('')
                    $('#inputDesc').val('')
                    $('#inputPrice').val('')
                    $('#inputDate').val('')
                    loadDataRequest()
                    $('#modalAddEditRequest').modal('hide')
                }
            })
        }
    })
})

function loadDataRequest() {
    dataSource = []
    tableRequest ? tableRequest.clear().draw() : null

    callAPI('userrequest', 'GET', '', token, null, (res) => {
        if(!res.success)
            alert(res.error)
        else
        {
            for (let i = 0; i < res.data.docs.length; i++) {
                dataSource.push([ 
                    res.data.docs[i]._id,
                    '',
                    res.data.docs[i].desc,
                    res.data.docs[i].user.username,
                    res.data.docs[i].gift.name,
                    res.data.docs[i].price,
                    res.data.docs[i].top_win,
                    res.data.docs[i].time,
                    res.data.docs[i].date,
                    res.data.docs[i].status,
                    ''
                ])
            }

            tableRequest.rows.add(dataSource).draw()
        }
    })
}

function editRequest(data) {
    data = JSON.parse(decodeURI(data))
    $('#h4AddEditRequest').text('Sửa yêu cầu')
    $('#btnAddEditRequest').text('Cập nhật')
    $('#btnAddEditRequest').attr('data-name', 'edit')
    $('#inputTopWin').val(data[6])
    $('#inputDesc').val(data[2])
    $('#inputPrice').val(data[5])
    $('#selectTime').val(data[7])
    $('#inputDate').val(moment(data[8]).format('DD/MM/YYYY'))
    $('#selectStatus').val(data[9])
    $('#idRequest').text(data[0]) 
    $('#modalAddEditRequest').modal('show')
}

function loadDataGift() {
    callAPI('gift', 'GET', '', token, null, (res) => {
        if(!res.success)
            alert(res.error)
        else
        {
            $('#selectGift').append(`<option value="0" selected>---Chọn quà tặng---</option>`)
                for (let i = 0; i < res.data.docs.length; i++) {
                    $('#selectGift').append(`<option value="${res.data.docs[i]._id}">${res.data.docs[i].name}</option>`)
            }
        }
    })
}

function loadDataTime() {
    callAPI('time', 'GET', '', token, null, (res) => {
        if(!res.success)
            alert(res.error)
        else
        {
            $('#selectTime').append(`<option value="0" selected>---Chọn thời gian---</option>`)
            dataTime = res.data
            for (let i = 0; i < res.data.length; i++) {
                $('#selectTime').append(`<option value="${res.data[i].id}">${res.data[i].from}-${res.data[i].to}. Giá min: ${numeral(res.data[i].price).format('0,0')} (VNĐ)</option>`)
            }
        }
    })
}

function deleteRequest(requestId) {
    let r = confirm("Bạn có chắc chắn muốn xóa!")
    if (r == true) {
        callAPI('userrequest', 'DELETE', '', token, {
            _id : requestId
        }, (res) => {
            if(!res.success)
                alert(res.error)
            else
            {
                alert('Xóa thành công!')
                loadDataRequest()
            }
        })
    }
}

function acceptRequest(requestId) {
    let r = confirm("Bạn có chắc chắn muốn chấp nhận yêu cầu này?")
    if (r == true) {
        callAPI('userrequest/status', 'PUT', '', token, {
            _id : requestId,
            status : 1
        }, (res) => {
            if(!res.success)
                alert(res.error)
            else
            {
                alert('Thành công!')
                loadDataRequest()
            }
        })
    }
}

function cancelRequest(requestId) {
    let r = confirm("Bạn có chắc chắn muốn hủy yêu cầu này?")
    if (r == true) {
        callAPI('userrequest/status', 'PUT', '', token, {
            _id : requestId,
            status : -1
        }, (res) => {
            if(!res.success)
                alert(res.error)
            else
            {
                alert('Thành công!')
                loadDataRequest()
            }
        })
    }
}
