/*
==============================
        API 1.0.10
    Created By Davenchy
==============================

// DOCS:

xhr -> XMLHTTPRequest Object

==========================================================================================

// send get request

API('http://example.com/api/users').then((xhr) => {});


==========================================================================================


// send post request

API('http://example.com/api/users', 'POST').then((xhr) => {});


==========================================================================================


// send post request with json body

API({
    url: 'http://example.com/api/users',
    method: 'POST',
    json: {
        id: 'z546',
        group: 'root'
    }
}).then((xhr) => {});


==========================================================================================


// set headers

API({
    url: 'http://example.com/api/users',
    method: 'POST',
    json: {
        id: 'z546',
        group: 'root'
    },
    headers: {
        'X-Access-Token': '8e4jerz4jzw64k68j4s56hb4s6b85s4'
    }
}).then((xhr) => {});


==========================================================================================


// set body

API({
    url: 'http://example.com/api/users',
    method: 'POST',
    body: 'hello world!'
}).then((xhr) => {});


==========================================================================================


// set events

API({
    url: 'http://example.com/files/file.zip',
    events: {
        progress: function(event) {
            var p = 100 * event.loaded / event.total;
            console.log(Math.round(p) + '%');
        }
    }
}).then((xhr) => {});


==========================================================================================


// custom xml http request

const xhr = new XMLHttpRequest();

API({
    url: 'http://example.com/files/file.zip', xhr
}).then((xhr) => {});


==========================================================================================


// convert response to json or return null

API({
    url: 'http://example.com/api/list'
}).then((xhr) => {
    var json = xhr.toJSON();
});


==========================================================================================



// convert response to buffer

API({
    url: 'http://example.com/files/file.zip',
    type: 'arraybuffer'
}).then((xhr) => {
    var buffer = xhr.toBuffer();
});


==========================================================================================



// convert response to base64

API({
    url: 'http://example.com/files/image.png',
    type: 'arraybuffer'
}).then((xhr) => {
    var base64 = xhr.toBase64();
});


==========================================================================================



// change response type

types:
    - arraybuffer
    - text
    - document
    - blob
    - json

API({
    url: 'http://example.com/files/file.zip',
    type: 'arraybuffer'
}).then((xhr) => {});


==========================================================================================
*/

const API = function(url = '', method = '') {
    var ops = {};

    // detect if param1 is string or object
    if (url && url !== '' && typeof url === "string") ops.url = url;
    else ops = url;

    // detect if param2 is string and set as method
    if (method && method !== '' && typeof method === "string") ops.method = method;

    // check if the url is undefined
    if (!ops.url || ops.url === '') return console.error('url is required');

    // create xml http request Object
    const xhr = ops.xhr || new XMLHttpRequest();

    // open http request
    xhr.open(ops.method || 'GET', ops.url)

    // support json body
    if (ops.json) {
        if (!ops.headers) ops.headers = {};
        ops.headers['Content-Type'] = 'application/json';
    }

    // add headers
    if (ops.headers) Object.keys(ops.headers).forEach(k => xhr.setRequestHeader(k, ops.headers[k]) );

    // add events
    if (ops.events) Object.keys(ops.events).forEach(e => xhr.addEventListener(e, ops.events[e]) );

    // add body, send request and handle feedback
    const body = ops.body || (ops.json) ? JSON.stringify(ops.json) : null;

    // set response type
    if (ops.type) xhr.responseType = ops.type;

    // replace defaults
    if (ops.replace) Object.assign(xhr, ops.replace);

    // try to convert response to buffer
    xhr.toBuffer = function () { return new Uint8Array(xhr.response); }

    // try to convert response to json
    xhr.toJSON = function () {
        try { return JSON.parse(xhr.responseText); }
        catch(e) { return null; }
    }

    // try to convert response to base64
    xhr.toBase64 = function () {
        var buffer = new Uint8Array(xhr.response);
        var data = '';
        for (let i = 0; i < buffer.length; i++) {
            const char = buffer[i];
            data += String.fromCharCode(char);
        }
        return btoa(data);
    }

    return new Promise((resolve, reject) => {
        xhr.addEventListener('error', () => reject(xhr));
        xhr.addEventListener('loadend', () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve(xhr);
            else reject(xhr);
        });
        xhr.send(body);
    });
};
