var dataSource = []
var token = localStorage.getItem('token')

var tableGift = $('#tableGift').DataTable({
    scrollY:        '50vh',
    scrollCollapse: true,
    paging:         false,
    sDom: '<"row view-filter"<"col-sm-12"<"pull-left"l><"pull-right"f><"clearfix">>>t<"row view-pager"<"col-sm-12"<"text-center"ip>>>',
    search : true,
    select: {
        style : "multi"
    },
    columns: [
        {},
        {title: "STT"},
        {title: "Tên"},
        {title: "Hình ảnh"},
        {title: "Mô tả"},
        {title: "Loại"},
        {title: "Giá (VNĐ)"},
        {title: "Trạng thái"},
        {title: "Thao tác"}
    ],
    columnDefs: [
        {
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
            "width": "15%",
            "className": 'text-center',
            "targets": 2
        },
        {
            orderable: true,
            "width": "15%",
            "className": 'text-center',
            "targets": 3,
            "data": "img",
            "render" : function ( url, type, row) {
            return '<img height="100px" width="100px" src="'+row[3]+'"/>';
            }
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
                return (row[5] == 1) ? `<a class="label label-success">Tiền mặt</a>` : `<a class="label label-warning">Sản phẩm</a>`
            }
        },
        {
            orderable: true,
            "width": "15%",
            "className": 'text-center',
            "targets": 6,
            "mRender": function(data, type, row) {
                return numeral(row[6]).format('0,0')
            }
        },
        {
            orderable: true,
            "width": "10%",
            "className": 'text-center',
            "targets": 7,
            "mRender": function(data, type, row) {
                if(row[7] == 1) 
                    return `<a class="label label-success">Hoạt động</a>` 
                else if(row[7] == -1)
                    return `<a class="label label-warning">Khóa</a>`
                else
                    return `<a class="label label-danger">Đã xóa</a>`
            }
        },
        {
            orderable: false,
            "width": "10%",
            "className": 'text-center',
            "targets": 8,
            "mRender": function(data, type, row) {
                return `<a class="label label-success" onclick="editGift('${encodeURI(JSON.stringify(row))}')"><i class="fa fa-edit"></i></a>
                        <a class="label label-danger" onclick="deleteGift('${row[0]}')"><i class="fa fa-trash"></i></a>`
            }
        }
    ],
    "fnRowCallback": function(nRow, aData, iDisplayIndex) {
        $("td:first", nRow).html(iDisplayIndex + 1)
        return nRow
    }
})

$(document).ready(function() {
    loadDataGift()

    function readURL(input) {
        if (input.files && input.files[0]) {
          var reader = new FileReader()
          
          reader.onload = function(e) {
            $('#imgImage').attr('src', e.target.result)
          }
          
          reader.readAsDataURL(input.files[0])
        }
      }
      
      $("#inputUploadImage").change(function() {
        readURL(this)
    })


    $('#btnAddGift').click(() => {
        $('#h4AddEditGift').text('Thêm mới quà tặng')
        $('#btnAddEditGift').text('Thêm')
        $('#btnAddEditGift').attr('data-name', 'add')
        $('#modalAddEditGift').modal('show')
    })

    $('#btnAddEditGift').click(() => {
        if($('#btnAddEditGift').attr('data-name') == 'add')
        {
            let form = new FormData()
            form.append("image", document.getElementById('inputUploadImage').files[0]);
            form.append("name", $('#inputName').val());
            form.append("desc", $('#inputDesc').val());
            form.append("type", $('#selectType').val());
            form.append("price", $('#inputPrice').val());
            form.append("status", $('#selectStatus').val());

            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "/api/gift",
                "method": "POST",
                "headers": {
                    "x-access-token": token
                },
                "processData": false,
                "contentType": false,
                "mimeType": "multipart/form-data",
                "data": form
            }

            $.ajax(settings).done(function (res) {
                if(!JSON.parse(res).success)
                    alert(JSON.parse(res).error)
                else
                {
                    $('#inputName').val('')
                    $('#inputDesc').val('')
                    $('#selectType').val('1')
                    $('#inputPrice').val('')
                    $('#selectStatus').val('true')
                    $('#modalAddEditGift').modal('hide')
                    loadDataGift()
                }
            });
        }
        else if($('#btnAddEditGift').attr('data-name') == 'edit')
        {
            let form = new FormData()
            form.append("image", document.getElementById('inputUploadImage').files[0]);
            form.append("name", $('#inputName').val());
            form.append("desc", $('#inputDesc').val());
            form.append("type", $('#selectType').val());
            form.append("price", $('#inputPrice').val());
            form.append("status", $('#selectStatus').val());
            form.append("_id", $('#idGift').text());

            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "/api/gift",
                "method": "PUT",
                "headers": {
                    "x-access-token": token
                },
                "processData": false,
                "contentType": false,
                "mimeType": "multipart/form-data",
                "data": form
            }

            $.ajax(settings).done(function (res) {
                if(!JSON.parse(res).success)
                    alert(JSON.parse(res).error)
                else
                {
                    $('#inputName').val('')
                    $('#inputDesc').val('')
                    $('#selectType').val('1')
                    $('#inputPrice').val('')
                    $('#selectStatus').val('true')
                    $('#modalAddEditGift').modal('hide')
                    loadDataGift()
                }
            });
        }
    })
})

function loadDataGift() {
    dataSource = []
    tableGift ? tableGift.clear().draw() : null

    callAPI('gift', 'GET', '', token, null, (res) => {
        if(!res.success)
            alert(res.error)
        else
        {
            for (let i = 0; i < res.data.docs.length; i++) {
                dataSource.push([ 
                    res.data.docs[i]._id,
                    '',
                    res.data.docs[i].name,
                    res.data.docs[i].image,
                    res.data.docs[i].desc,
                    res.data.docs[i].type,
                    res.data.docs[i].price,
                    res.data.docs[i].status,
                    ''
                ])
            }

            tableGift.rows.add(dataSource).draw()
        }
    })
}

function editGift(data) {
    data = JSON.parse(decodeURI(data))
    $('#h4AddEditGift').text('Sửa quà tặng')
    $('#btnAddEditGift').text('Cập nhật')
    $('#btnAddEditGift').attr('data-name', 'edit')
    $('#idGift').text(data[0])
    $('#inputName').val(data[2])
    $('#imgImage').attr('src', data[3])
    $('#inputDesc').val(data[4])
    $('#selectType').val(`${data[5]}`)
    $('#inputPrice').val(data[6])
    $('#selectStatus').val(`${data[7]}`)
    $('#modalAddEditGift').modal('show')
}

function deleteGift(giftId) {
    let r = confirm("Bạn có chắc chắn muốn xóa!")
    if (r == true) {
        callAPI('gift', 'DELETE', '', token, {
            _id : giftId
        }, (res) => {
            if(!res.success)
                alert(res.error)
            else
            {
                alert('Xóa thành công!')
                loadDataGift()
            }
        })
    }
}