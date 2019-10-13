const base_url = ""

const callAPI = (path, method, query, token, data, callback) => {
    let settings = {
        "async": true,
        "url": `${base_url}/api/${path}?${query}`,
        "method": method,
        "headers": {
          "Content-Type": "application/x-www-form-urlencoded",
          "x-access-token" : token
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

const callUploadAPI = (path, method, query, token, data, callback) => {
  let settings = {
      "async": true,
      "url": `${base_url}/api/${path}?${query}`,
      "method": method,
      "headers": {
        "Content-Type": "multipart/form-data",
        "x-access-token" : token
      },
      "mimeType": "multipart/form-data",
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

const getProfile = (token, _id, callback) => {
  callAPI('user/profile', 'get', _id ? `_id=${_id}` : '', token, '', (res) => {
    if(res.success)
      callback(res.data)
    else
      callback(null)
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
