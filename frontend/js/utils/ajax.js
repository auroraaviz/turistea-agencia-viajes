function ajax(url, method, data, callback) {

    let xhr = new XMLHttpRequest();

    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            let response = JSON.parse(xhr.responseText);
            callback(response, xhr.status);
        }
    };

    xhr.send(JSON.stringify(data));
}