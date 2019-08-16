$(document).ready(function() {
    var dataSource = []

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
                "width": "20%",
                "className": 'text-center',
                "targets": 5
            },
            {
                orderable: false,
                "width": "20%",
                "className": 'text-center',
                "targets": 6
            }
        ]
    })
})