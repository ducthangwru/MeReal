$(document).ready(function() {
    var dataSource = []
    var token = localStorage.getItem('token')
    loadDataHistory()

    var tableHistory = $('#tableHistory').DataTable({
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
            {title: "Người tổ chức"},
            {title: "Số điểm"},
            {title: "Quà tặng"},
            {title: "Thời gian"}
        ],
        columnDefs: [{
                orderable: false,
                "width": "0%",
                visible : false,
                "targets": 0
            },
            {
                orderable: false,
                "width": "10%",
                "className": 'text-center',
                "targets": 1
            },
            {
                orderable: true,
                "width": "25%",
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
                "width": "20%",
                "className": 'text-center',
                "targets": 4
            },
            {
                orderable: true,
                "width": "25%",
                "className": 'text-center',
                "targets": 5,
                "mRender": function(data, type, row) {
                    return moment(row[5]).format('DD/MM/YYYY HH:mm:ss')
                }
            }
        ],
        "fnRowCallback": function(nRow, aData, iDisplayIndex) {
            $("td:first", nRow).html(iDisplayIndex + 1)
            return nRow
        }
    })

    function loadDataHistory() {
        dataSource = []
        tableHistory ? tableHistory.clear().draw() : null

        callAPI('userHistory', 'GET', '', token, null, (res) => {
            if(!res.success)
                alert(res.error)
            else
            {
                for (let i = 0; i < res.data.docs.length; i++) {
                    dataSource.push([ 
                        res.data.docs[i]._id,
                        '',
                        res.data.docs[i].user_request.user.username,
                        res.data.docs[i].score,
                        res.data.docs[i].gift ? res.data.docs[i].gift.name : 'Không có dữ liệu',
                        res.data.docs[i].createdAt,
                        ''
                    ])
                }

                tableHistory.rows.add(dataSource).draw()
            }
        })
    }
})