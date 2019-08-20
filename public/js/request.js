$(document).ready(function() {
    var dataSource = []
    var token = localStorage.getItem('token')

    loadDataRequest()

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
                "targets": 7
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
                            nRow =  `<a class="label label-warning">Chờ duyệt</a>`
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
})