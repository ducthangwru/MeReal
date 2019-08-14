$(document).ready(function() {
    var dataSource = []
    var globalID = []

    var tableQuestion = $('#tableQuestion').DataTable({
         scrollY:        '50vh',
        scrollCollapse: true,
        paging:         false,
        search : true,
        select: {
            style : "multi"
        },
        columns: [
            {},
            {title: "STT"},
            {title: "Nội dung"},
            {title: "Gợi ý"},
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
                "width": "30%",
                "className": 'text-center',
                "targets": 2
            },
            {
                orderable: true,
                "width": "30%",
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
                orderable: false,
                "width": "20%",
                "className": 'text-center',
                "targets": 5
            }
            ],
            "fnRowCallback": function( nRow, aData, iDisplayIndex) {
            $(nRow).attr("id",'data_' + aData[1]);
            $($(nRow)[0].childNodes[0].childNodes[0].childNodes[0]).prop('checked', $('#select_all').is(':checked'));
            return nRow;
            }
    })

    var tableAnswer = $('#tableAnswer').DataTable({
        scrollY:        '50vh',
       scrollCollapse: true,
       paging:         false,
       search : true,
       select: {
           style : "multi"
       },
       columns: [
           {},
           {title: "STT"},
           {title: "Nội dung"},
           {title: "Đúng/Sai"},
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
               "width": "50%",
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
               orderable: false,
               "width": "25%",
               "className": 'text-center',
               "targets": 4
           },
           ],
           "fnRowCallback": function( nRow, aData, iDisplayIndex) {
           $(nRow).attr("id",'data_' + aData[1]);
           $($(nRow)[0].childNodes[0].childNodes[0].childNodes[0]).prop('checked', $('#select_all').is(':checked'));
           return nRow;
           }
   })
})