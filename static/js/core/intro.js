const $input = document.querySelector("input");
const $btn = document.querySelector("button");


function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function processFile(uploadedFile) {
    const size = uploadedFile.size;
    const sliceSize = 30 * 1000 * 1000;
    const fileName = uploadedFile.name;
    let slicedFileSet = setSlicedFileSet(uploadedFile, fileName, size, sliceSize);
    let order = 0;
    if (slicedFileSet.length == 0) return false;
    let numberOfSlice = slicedFileSet.length - 1;
    let xhr = setXMLHttpRequest(slicedFileSet, numberOfSlice, order);
    send(slicedFileSet[0], numberOfSlice, order, xhr);
}

function setSlicedFileSet(file, fileName, size, sliceSize) {
    let slicedFileSet = Array();
    for (let i = 0; i < size; i += sliceSize) {
        let start = i, end = i + sliceSize;
        slicedFileSet.push({ file: slice(file, start, end), name: fileName, start: start, end: end });
    }
    return slicedFileSet;
}

function setXMLHttpRequest(slicedFileSet, numberOfSlice, order) {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("loadend", e => {
        if (e.target.status == 200) {
            slicedFileSet.shift();
            if (slicedFileSet.length > 0) {
                order += 1;
                send(slicedFileSet[0], numberOfSlice, order, xhr);
            }
        } else {
            console.log(`전송 실패. 상태 코드: ${e.target.status}`);
        }
    })
    return xhr;
}

function slice(file, start, end) {
    var slice = file.mozSlice ? file.mozSlice :
        file.webkitSlice ? file.webkitSlice :
            file.slice ? file.slice : noop;

    return slice.bind(file)(start, end);
}

function send(piece, numberOfSlice, order, xhr) {
    let formdata = new FormData();

    xhr.open('POST', '/upload/file/', true);
    formdata.append('limit', numberOfSlice);
    formdata.append('order', order);
    formdata.append('file', piece.file, piece.name);
    const csrftoken = getCookie('csrftoken');
    xhr.setRequestHeader('X-CSRFToken', csrftoken);
    xhr.send(formdata);
}

function noop() {

}


function clickBtn(e) {
    let uploadedFile = $input.files[0];
    processFile(uploadedFile);
}


function init() {
    $btn.addEventListener("click", clickBtn);
}

window.addEventListener("load", () => {
    init();
})
