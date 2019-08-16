$(document).ready(function() {
    var dataSource = []

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
                "targets": 5
            }
        ]
    })
})