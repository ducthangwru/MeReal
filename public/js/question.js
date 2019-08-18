$(document).ready(function() {
    var dataQuestionSource = []
    var token = localStorage.getItem('token')

    loadDataRequest()

    $('select').on('change', function() {
        loadQuestionByRequest(this.value)
    })

    var tableQuestion = $('#tableQuestion').DataTable({
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
                "targets": 4,
                "mRender": function(data, type, row) {
                    return (row[4] == 1) ? `<a class="label label-success">Hoạt động</a>` : `<a class="label label-success">Khóa</a>`
                }
            },
            {
                orderable: false,
                "width": "20%",
                "className": 'text-center',
                "targets": 5,
                "mRender": function(data, type, row) {
                    return `<a class="label label-success"><i class="fa fa-edit"></i></a>
                            <a class="label label-danger"><i class="fa fa-trash"></i></a>`
                }
            }
        ],
        "fnRowCallback": function(nRow, aData, iDisplayIndex) {
            $("td:first", nRow).html(iDisplayIndex + 1);
            return nRow
        }
    })

    var tableAnswer = $('#tableAnswer').DataTable({
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
        ]
    })

    function loadDataRequest() {
        callAPI('userRequest', 'GET', '', token, null, (res) => {
            if(!res.success)
                alert(res.error)
            else
            {
                $('#selectRequest').append(`<option value="0" selected>---Chọn yêu cầu---</option>`)
                for (let i = 0; i < res.data.docs.length; i++) {
                    $('#selectRequest').append(`<option value="${res.data.docs[i]._id}">${res.data.docs[i].desc}</option>`)
                }
            }
        })
    }

    function loadQuestionByRequest(requestId) {
        dataQuestionSource = []
        tableQuestion.clear().draw()

        callAPI('question', 'GET', `_id=${requestId}`, token, null, (res) => {
            if(!res.success)
                alert(res.error)
            else
            {
                for (let i = 0; i < res.data.docs.length; i++) {
                    dataQuestionSource.push([ 
                        res.data.docs[i]._id,
                        '',
                        res.data.docs[i].content,
                        res.data.docs[i].suggest,
                        res.data.docs[i].status,
                        ''
                    ])
                }

                tableQuestion.rows.add(dataQuestionSource).draw()
            }
        })
    }
})