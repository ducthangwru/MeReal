var dataSource = []
var token = localStorage.getItem('token')

var tableTime = $('#tableTime').DataTable({
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
        {title: "Thời gian từ"},
        {title: "Thời gian đến"},
        {title: "Giá tối thiểu (VNĐ)"}
    ],
    columnDefs: [{
            orderable: false,
            "width": "0%",
            visible : false,
            "targets": 0
        },
        {
            orderable: false,
            "width": "20%",
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
            "width": "25%",
            "className": 'text-center',
            "targets": 3
        },
        {
            orderable: true,
            "width": "30%",
            "className": 'text-center',
            "targets": 4,
            "mRender": function(data, type, row) {
                return numeral(row[4]).format('0,0')
            }
        }
    ],
     "fnRowCallback": function(nRow, aData, iDisplayIndex) {
        $("td:first", nRow).html(iDisplayIndex + 1)
        return nRow
    }
})

$(document).ready(function() {
    loadDataTime()
})

function loadDataTime() {
    dataSource = []
    tableTime ? tableTime.clear().draw() : null

    callAPI('time', 'GET', '', token, null, (res) => {
        if(!res.success)
            alert(res.error)
        else
        {
            for (let i = 0; i < res.data.length; i++) {
                dataSource.push([ 
                    res.data[i].id,
                    '',
                    res.data[i].from,
                    res.data[i].to,
                    res.data[i].price
                ])
            }

            tableTime.rows.add(dataSource).draw()
        }
    })
}