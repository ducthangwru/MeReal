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

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
