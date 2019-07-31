const base_url = ""

const callAPI = (path, method, query, data, callback) => {
    let settings = {
        "async": true,
        "url": `${base_url}/api/${path}?${query}`,
        "method": method,
        "headers": {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        "data": data
      }
      
    $.ajax(settings)
    .done(function (response) {
        callback(response)
    })
    .fail((e) => {
        callback({success : false, error: e.message })
    })
}
