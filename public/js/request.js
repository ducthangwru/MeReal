$(document).ready(function() {
    var dataSource = []

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
            {title: "Báo giá"},
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
                "targets": 5
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
                "targets": 8
            },
            {
                orderable: true,
                "width": "10%",
                "className": 'text-center',
                "targets": 9
            },
            {
                orderable: false,
                "width": "10%",
                "className": 'text-center',
                "targets": 10
            }
        ]
    })
})