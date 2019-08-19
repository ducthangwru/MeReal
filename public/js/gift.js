$(document).ready(function() {
    var dataSource = []
    var token = localStorage.getItem('token')
    
    loadDataGift()

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
                "width": "20%",
                "className": 'text-center',
                "targets": 2
            },
            {
                orderable: true,
                "width": "25%",
                "className": 'text-center',
                "targets": 3
            },
            {
                orderable: true,
                "width": "15%",
                "className": 'text-center',
                "targets": 4,
                "mRender": function(data, type, row) {
                    return (row[4] == 1) ? `<a class="label label-success">Tiền mặt</a>` : `<a class="label label-warning">Sản phẩm</a>`
                }
            },
            {
                orderable: true,
                "width": "15%",
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
                    return `<a class="label label-success"><i class="fa fa-edit"></i></a>
                            <a class="label label-danger"><i class="fa fa-trash"></i></a>`
                }
            }
        ],
        "fnRowCallback": function(nRow, aData, iDisplayIndex) {
            $("td:first", nRow).html(iDisplayIndex + 1)
            return nRow
        }
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
})