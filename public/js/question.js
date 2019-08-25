var token = localStorage.getItem('token')
var dataQuestionSource = []
var dataAnswerSource = []
var idQuestion = null
var nameQuestion = undefined

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
                return (row[4] == 1) ? `<a class="label label-success">Hoạt động</a>` : `<a class="label label-danger">Khóa</a>`
            }
        },
        {
            orderable: false,
            "width": "20%",
            "className": 'text-center',
            "targets": 5,
            "mRender": function(data, type, row) {
                return `<a class="label label-success" onclick="editQuestion('${encodeURI(JSON.stringify(row))}')"><i class="fa fa-edit"></i></a>
                        <a class="label label-danger" onclick="deleteQuestion('${row[0]}')"><i class="fa fa-trash"></i></a>`
            }
        }
    ],
    "fnRowCallback": function(nRow, aData, iDisplayIndex) {
        $("td:first", nRow).html(iDisplayIndex + 1)
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
            "width": "50%",
            "className": 'text-center',
            "targets": 2
        },
        {
            orderable: true,
            "width": "20%",
            "className": 'text-center',
            "targets": 3,
            "mRender": function(data, type, row) {
                return (row[3] == true) ? `<a class="label label-success">Đúng</a>` : `<a class="label label-danger">Sai</a>`
            }
        },
        {
            orderable: false,
            "width": "25%",
            "className": 'text-center',
            "targets": 4,
            "mRender": function(data, type, row) {
                return `<a class="label label-success" onclick="editAnswer('${encodeURI(JSON.stringify(row))}')"><i class="fa fa-edit"></i></a>
                        <a class="label label-danger" onclick="deleteAnswer('${row[0]}')"><i class="fa fa-trash"></i></a>`
            }
        },
    ],
    "fnRowCallback": function(nRow, aData, iDisplayIndex) {
        $("td:first", nRow).html(iDisplayIndex + 1)
        return nRow
    }
})

$(document).ready(function() {
    loadDataRequest()

    $('#selectRequest').on('change', function() {
        loadQuestionByRequest(this.value)
    })

    $('#tableQuestion tbody').on('click', 'tr', function () {
        idQuestion = tableQuestion.row(this).data()[0]
        nameQuestion = tableQuestion.row(this).data()[2]
        $('#h1Answer').text(`DANH SÁCH CÂU TRẢ LỜI "${nameQuestion}"`)
        loadAnswerByQuestion(idQuestion)
    })

    $('#btnAddQuestion').click(() => {
        if($('#selectRequest').val() == null || $('#selectRequest').val() == 0)
            alert('Vui lòng chọn yêu cầu!')
        else
        {
            $('#h4AddEditQuestion').text('Thêm mới câu hỏi')
            $('#btnAddEditQuestion').text('Thêm')
            $('#btnAddEditQuestion').attr('data-name', 'add')
            $('#modalAddEditQuestion').modal('show')
        }
    })
    
    $('#btnAddAnswer').click(() => {
        if(!idQuestion)
            alert('Vui lòng chọn câu hỏi!')
        else
        {
            $('#h4AddEditAnswer').text('Thêm mới câu trả lời')
            $('#btnAddEditAnswer').text('Thêm')
            $('#btnAddEditAnswer').attr('data-name', 'add')
            $('#modalAddEditAnswer').modal('show')
        }
    })

    $('#btnAddEditQuestion').click(() => {
        if($('#btnAddEditQuestion').attr('data-name') == 'add')
        {
            callAPI('question', 'POST', '', token, {
                content: $('#inputContent').val(),
                suggest : $('#inputSuggest').val(),
                status : $('#selectStatus').val(),
                user_request: $('#selectRequest').val() 
            }, (res) => {
                if(!res.success)
                    alert(res.error)
                else
                {
                    $('#inputContent').val('')
                    $('#inputSuggest').val('')
                    $('#modalAddEditQuestion').modal('hide')
                    loadQuestionByRequest($('#selectRequest').val())
                }
            })
        }
        else if($('#btnAddEditQuestion').attr('data-name') == 'edit')
        {
            callAPI('question', 'PUT', '', token, {
                content: $('#inputContent').val(),
                suggest : $('#inputSuggest').val(),
                status : $('#selectStatus').val(),
                _id: $('#idQuestion').text() 
            }, (res) => {
                if(!res.success)
                    alert(res.error)
                else
                {
                    $('#inputContent').val('')
                    $('#inputSuggest').val('')
                    $('#modalAddEditQuestion').modal('hide')
                    loadQuestionByRequest($('#selectRequest').val())
                }
            })
        }
    })
    
    $('#btnAddEditAnswer').click(() => {
        if($('#btnAddEditAnswer').attr('data-name') == 'add')
        {
            callAPI('answer', 'POST', '', token, {
                content: $('#inputContentAnswer').val(),
                is_true : $('#selectTrueFalse').val(),
                question: idQuestion
            }, (res) => {
                if(!res.success)
                    alert(res.error)
                else
                {
                    $('#inputContentAnswer').val('')
                    $('#modalAddEditAnswer').modal('hide')
                    loadAnswerByQuestion(idQuestion)
                }
            })
        }
        else if($('#btnAddEditAnswer').attr('data-name') == 'edit')
        {
            callAPI('answer', 'PUT', '', token, {
                content: $('#inputContentAnswer').val(),
                is_true : $('#selectTrueFalse').val(),
                question: idQuestion,
                _id: $('#idAnswer').text() 
            }, (res) => {
                if(!res.success)
                    alert(res.error)
                else
                {
                    $('#inputContentAnswer').val('')
                    $('#modalAddEditAnswer').modal('hide')
                    loadAnswerByQuestion(idQuestion)
                }
            })
        }
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
})

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

function loadAnswerByQuestion(questionId) {
    dataAnswerSource = []
    tableAnswer.clear().draw()

    callAPI('answer', 'GET', `_id=${questionId}`, token, null, (res) => {
        if(!res.success)
            alert(res.error)
        else
        {
            for (let i = 0; i < res.data.docs.length; i++) {
                dataAnswerSource.push([ 
                    res.data.docs[i]._id,
                    '',
                    res.data.docs[i].content,
                    res.data.docs[i].is_true,
                    ''
                ])
            }

            tableAnswer.rows.add(dataAnswerSource).draw()
        }
    })
}

function deleteQuestion(questionId) {
    let r = confirm("Bạn có chắc chắn muốn xóa!")
    if (r == true) {
        callAPI('question', 'DELETE', '', token, {
            _id : questionId
        }, (res) => {
            if(!res.success)
                alert(res.error)
            else
            {
                alert('Xóa thành công!')
                loadQuestionByRequest($('#selectRequest').val())
                loadAnswerByQuestion('')
            }
        })
    }
}

function deleteAnswer(answerId) {
    let r = confirm("Bạn có chắc chắn muốn xóa!")
    if (r == true) {
        callAPI('answer', 'DELETE', '', token, {
            _id : answerId
        }, (res) => {
            if(!res.success)
                alert(res.error)
            else
            {
                alert('Xóa thành công!')
                loadAnswerByQuestion(idQuestion)
            }
        })
    }
}

function editQuestion(data) {
    data = JSON.parse(decodeURI(data))
    $('#h4AddEditQuestion').text('Sửa câu hỏi')
    $('#btnAddEditQuestion').text('Cập nhật')
    $('#btnAddEditQuestion').attr('data-name', 'edit')
    $('#idQuestion').text(data[0])
    $('#inputContent').val(data[2])
    $('#inputSuggest').val(data[3])
    $('#selectStatus').val(data[4]) 
    $('#modalAddEditQuestion').modal('show')
}

function editAnswer(data) {
    data = JSON.parse(decodeURI(data))
    $('#h4AddEditAnswer').text('Sửa câu trả lời')
    $('#btnAddEditAnswer').text('Cập nhật')
    $('#btnAddEditAnswer').attr('data-name', 'edit')
    $('#idAnswer').text(data[0])
    $('#inputContentAnswer').val(data[2])
    $('#selectTrueFalse').val(`${data[3]}`) 
    $('#modalAddEditAnswer').modal('show')
}

