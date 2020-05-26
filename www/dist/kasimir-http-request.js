/**
 * Start a new http request
 *
 *
 * @param url
 * @param params
 */
function ka_http_req(url, params={}) {
    return new KasimirHttpRequest(url, params);
}



class KasimirHttpRequest {

    constructor(url, params={}) {

        url = url.replace(/(\{|\:)([a-zA-Z0-9_\-]+)/g, (match, p1, p2) => {
            if ( ! params.hasOwnProperty(p2))
                throw "parameter '" + p2 + "' missing in url '" + url + "'";
            return encodeURI(params[p2]);
        });

        this.request = {
            url: url,
            method: "GET",
            body: null,
            headers: {},
            dataType: "text",
            onError: null,
            debug: false,
            data: null
        };


    }

    /**
     * Add additional query parameters to url
     *
     * @param params
     * @return {KasimirHttpRequest}
     */
    withParams(params) {
        if (this.request.url.indexOf("?") === -1) {
            this.request.url += "?";
        } else {
            this.request.url += "&";
        }
        let str = [];
        for (let name in params) {
            if (params.hasOwnProperty(name)) {
                str.push(encodeURIComponent(name) + "=" + encodeURIComponent(params[name]));
            }
        }
        this.request.url += str.join("&");
        return this;
    }

    /**
     *
     * @param method
     * @return {KasimirHttpRequest}
     */
    withMethod(method) {
        this.request.method = method;
        return this;
    }

    /**
     *
     * @param token
     * @return {KasimirHttpRequest}
     */
    withBearerToken(token) {
        this.withHeaders({"authorization": "bearer " + token});
        return this;
    }


    /**
     *
     * @param headers
     * @return {KasimirHttpRequest}
     */
    withHeaders(headers) {
        Object.assign(this.request.headers, headers);
        return this;
    }


    /**
     *
     * @param body
     * @return {KasimirHttpRequest}
     */
    withBody(body) {
        if (this.request.method === "GET")
            this.request.method = "POST";
        if (Array.isArray(body) || typeof body === "object") {
            body = JSON.stringify(body);
            this.withHeaders({"content-type": "application/json"});
        }

        this.request.body = body;
        return this;
    }

    /**
     *
     * @param callback
     * @return {KasimirHttpRequest}
     */
    withOnError(callback) {
        this.request.onError = callback;
        return this;
    }

    /**
     * Switch debug mode on. Errors will trigger
     * a message and a alert window.
     *
     * @return {KasimirHttpRequest}
     */
    withDebug() {
        this.request.debug = true;
        return this;
    }

    set json(fn) {
        this.send((res) => {
            fn(res.getBodyJson());
        });
    }

    set plain(fn) {
        this.send((res) => {
            fn(res.getBody());
        })
    }


    /**
     *
     * @param fn
     * @param filter
     * @return
     */
    send(onSuccessFn) {
        let xhttp = new XMLHttpRequest();

        xhttp.open(this.request.method, this.request.url);
        for (let headerName in this.request.headers) {
            xhttp.setRequestHeader(headerName, this.request.headers[headerName]);
        }
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4) {

                if (this.request.onError !== null || parseInt(xhttp.status) >= 400) {
                    let errMsg = `𝗥𝗲𝗾𝘂𝗲𝘀𝘁 𝗳𝗮𝗶𝗹𝗲𝗱 '${xhttp.status} ${xhttp.statusText}':`;
                    let errData = xhttp.response;
                    try {
                        errData = JSON.parse(errData);
                        errMsg += "\n\n𝗠𝘀𝗴: '" + errData.error.msg + "'\n\n"
                    } catch (e) {
                        errMsg += errData;
                    }

                    console.warn(errMsg, errData);
                    if (this.request.debug)
                        alert(errMsg + "\n𝘴𝘦𝘦 𝘤𝘰𝘯𝘴𝘰𝘭𝘦 𝘧𝘰𝘳 𝘥𝘦𝘵𝘢𝘪𝘭𝘴. (𝘥𝘦𝘣𝘶𝘨 𝘮𝘰𝘥𝘦 𝘰𝘯)");
                    if (typeof this.request.onError === "function")
                        this.request.onError(new KasimirHttpResponse(xhttp.response, xhttp.status, this));
                    return;
                }

                if (this.request.debug) {
                    let msg = xhttp.response;
                    try {
                        msg = JSON.parse(msg);
                    } catch (e) {
                        // cannot parse json - output plain
                    }
                    console.debug(`𝗥𝗲𝗾𝘂𝗲𝘀𝘁: ${xhttp.status} ${xhttp.statusText}':\n`, msg);
                }

                onSuccessFn(new KasimirHttpResponse(xhttp.response, xhttp.status, this));
                return;
            }

        };

        xhttp.send(this.request.body);
    }

}


class KasimirHttpResponse {


    constructor (body, status, request) {
        this.body = body;
        this.status = status;
        this.request = request;
    }

    /**
     *
     * @return {object}
     */
    getBodyJson() {
        return JSON.parse(this.body)
    }

    /**
     *
     * @return {string}
     */
    getBody() {
        return this.body;
    }

    /**
     *
     * @return {boolean}
     */
    isOk() {
        return this.status === 200;
    }

}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImthLWh0dHAtcmVxLmpzIiwia2FzaW1pci1odHRwLXJlcXVlc3QuanMiLCJLYXNpbWlySHR0cFJlc3BvbnNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJrYXNpbWlyLWh0dHAtcmVxdWVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3RhcnQgYSBuZXcgaHR0cCByZXF1ZXN0XG4gKlxuICpcbiAqIEBwYXJhbSB1cmxcbiAqIEBwYXJhbSBwYXJhbXNcbiAqL1xuZnVuY3Rpb24ga2FfaHR0cF9yZXEodXJsLCBwYXJhbXM9e30pIHtcbiAgICByZXR1cm4gbmV3IEthc2ltaXJIdHRwUmVxdWVzdCh1cmwsIHBhcmFtcyk7XG59XG4iLCJcblxuY2xhc3MgS2FzaW1pckh0dHBSZXF1ZXN0IHtcblxuICAgIGNvbnN0cnVjdG9yKHVybCwgcGFyYW1zPXt9KSB7XG5cbiAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UoLyhcXHt8XFw6KShbYS16QS1aMC05X1xcLV0rKS9nLCAobWF0Y2gsIHAxLCBwMikgPT4ge1xuICAgICAgICAgICAgaWYgKCAhIHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShwMikpXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJwYXJhbWV0ZXIgJ1wiICsgcDIgKyBcIicgbWlzc2luZyBpbiB1cmwgJ1wiICsgdXJsICsgXCInXCI7XG4gICAgICAgICAgICByZXR1cm4gZW5jb2RlVVJJKHBhcmFtc1twMl0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnJlcXVlc3QgPSB7XG4gICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgICAgICAgIGJvZHk6IG51bGwsXG4gICAgICAgICAgICBoZWFkZXJzOiB7fSxcbiAgICAgICAgICAgIGRhdGFUeXBlOiBcInRleHRcIixcbiAgICAgICAgICAgIG9uRXJyb3I6IG51bGwsXG4gICAgICAgICAgICBkZWJ1ZzogZmFsc2UsXG4gICAgICAgICAgICBkYXRhOiBudWxsXG4gICAgICAgIH07XG5cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBhZGRpdGlvbmFsIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gdXJsXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICogQHJldHVybiB7S2FzaW1pckh0dHBSZXF1ZXN0fVxuICAgICAqL1xuICAgIHdpdGhQYXJhbXMocGFyYW1zKSB7XG4gICAgICAgIGlmICh0aGlzLnJlcXVlc3QudXJsLmluZGV4T2YoXCI/XCIpID09PSAtMSkge1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0LnVybCArPSBcIj9cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdC51cmwgKz0gXCImXCI7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHN0ciA9IFtdO1xuICAgICAgICBmb3IgKGxldCBuYW1lIGluIHBhcmFtcykge1xuICAgICAgICAgICAgaWYgKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgICAgICAgICAgIHN0ci5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChuYW1lKSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtc1tuYW1lXSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVxdWVzdC51cmwgKz0gc3RyLmpvaW4oXCImXCIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBtZXRob2RcbiAgICAgKiBAcmV0dXJuIHtLYXNpbWlySHR0cFJlcXVlc3R9XG4gICAgICovXG4gICAgd2l0aE1ldGhvZChtZXRob2QpIHtcbiAgICAgICAgdGhpcy5yZXF1ZXN0Lm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdG9rZW5cbiAgICAgKiBAcmV0dXJuIHtLYXNpbWlySHR0cFJlcXVlc3R9XG4gICAgICovXG4gICAgd2l0aEJlYXJlclRva2VuKHRva2VuKSB7XG4gICAgICAgIHRoaXMud2l0aEhlYWRlcnMoe1wiYXV0aG9yaXphdGlvblwiOiBcImJlYXJlciBcIiArIHRva2VufSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaGVhZGVyc1xuICAgICAqIEByZXR1cm4ge0thc2ltaXJIdHRwUmVxdWVzdH1cbiAgICAgKi9cbiAgICB3aXRoSGVhZGVycyhoZWFkZXJzKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5yZXF1ZXN0LmhlYWRlcnMsIGhlYWRlcnMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGJvZHlcbiAgICAgKiBAcmV0dXJuIHtLYXNpbWlySHR0cFJlcXVlc3R9XG4gICAgICovXG4gICAgd2l0aEJvZHkoYm9keSkge1xuICAgICAgICBpZiAodGhpcy5yZXF1ZXN0Lm1ldGhvZCA9PT0gXCJHRVRcIilcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdC5tZXRob2QgPSBcIlBPU1RcIjtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYm9keSkgfHwgdHlwZW9mIGJvZHkgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgIGJvZHkgPSBKU09OLnN0cmluZ2lmeShib2R5KTtcbiAgICAgICAgICAgIHRoaXMud2l0aEhlYWRlcnMoe1wiY29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwifSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlcXVlc3QuYm9keSA9IGJvZHk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGNhbGxiYWNrXG4gICAgICogQHJldHVybiB7S2FzaW1pckh0dHBSZXF1ZXN0fVxuICAgICAqL1xuICAgIHdpdGhPbkVycm9yKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMucmVxdWVzdC5vbkVycm9yID0gY2FsbGJhY2s7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN3aXRjaCBkZWJ1ZyBtb2RlIG9uLiBFcnJvcnMgd2lsbCB0cmlnZ2VyXG4gICAgICogYSBtZXNzYWdlIGFuZCBhIGFsZXJ0IHdpbmRvdy5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0thc2ltaXJIdHRwUmVxdWVzdH1cbiAgICAgKi9cbiAgICB3aXRoRGVidWcoKSB7XG4gICAgICAgIHRoaXMucmVxdWVzdC5kZWJ1ZyA9IHRydWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNldCBqc29uKGZuKSB7XG4gICAgICAgIHRoaXMuc2VuZCgocmVzKSA9PiB7XG4gICAgICAgICAgICBmbihyZXMuZ2V0Qm9keUpzb24oKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNldCBwbGFpbihmbikge1xuICAgICAgICB0aGlzLnNlbmQoKHJlcykgPT4ge1xuICAgICAgICAgICAgZm4ocmVzLmdldEJvZHkoKSk7XG4gICAgICAgIH0pXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBmblxuICAgICAqIEBwYXJhbSBmaWx0ZXJcbiAgICAgKiBAcmV0dXJuXG4gICAgICovXG4gICAgc2VuZChvblN1Y2Nlc3NGbikge1xuICAgICAgICBsZXQgeGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgICB4aHR0cC5vcGVuKHRoaXMucmVxdWVzdC5tZXRob2QsIHRoaXMucmVxdWVzdC51cmwpO1xuICAgICAgICBmb3IgKGxldCBoZWFkZXJOYW1lIGluIHRoaXMucmVxdWVzdC5oZWFkZXJzKSB7XG4gICAgICAgICAgICB4aHR0cC5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlck5hbWUsIHRoaXMucmVxdWVzdC5oZWFkZXJzW2hlYWRlck5hbWVdKTtcbiAgICAgICAgfVxuICAgICAgICB4aHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoeGh0dHAucmVhZHlTdGF0ZSA9PT0gNCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmVxdWVzdC5vbkVycm9yICE9PSBudWxsIHx8IHBhcnNlSW50KHhodHRwLnN0YXR1cykgPj0gNDAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBlcnJNc2cgPSBg8J2XpfCdl7LwnZe+8J2YgvCdl7LwnZiA8J2YgSDwnZez8J2XrvCdl7bwnZe58J2XsvCdl7EgJyR7eGh0dHAuc3RhdHVzfSAke3hodHRwLnN0YXR1c1RleHR9JzpgO1xuICAgICAgICAgICAgICAgICAgICBsZXQgZXJyRGF0YSA9IHhodHRwLnJlc3BvbnNlO1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyRGF0YSA9IEpTT04ucGFyc2UoZXJyRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJNc2cgKz0gXCJcXG5cXG7wnZeg8J2YgPCdl7Q6ICdcIiArIGVyckRhdGEuZXJyb3IubXNnICsgXCInXFxuXFxuXCJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyTXNnICs9IGVyckRhdGE7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oZXJyTXNnLCBlcnJEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucmVxdWVzdC5kZWJ1ZylcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KGVyck1zZyArIFwiXFxu8J2YtPCdmKbwnZimIPCdmKTwnZiw8J2Yr/CdmLTwnZiw8J2YrfCdmKYg8J2Yp/CdmLDwnZizIPCdmKXwnZim8J2YtfCdmKLwnZiq8J2YrfCdmLQuICjwnZil8J2YpvCdmKPwnZi28J2YqCDwnZiu8J2YsPCdmKXwnZimIPCdmLDwnZivKVwiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnJlcXVlc3Qub25FcnJvciA9PT0gXCJmdW5jdGlvblwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0Lm9uRXJyb3IobmV3IEthc2ltaXJIdHRwUmVzcG9uc2UoeGh0dHAucmVzcG9uc2UsIHhodHRwLnN0YXR1cywgdGhpcykpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmVxdWVzdC5kZWJ1Zykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbXNnID0geGh0dHAucmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtc2cgPSBKU09OLnBhcnNlKG1zZyk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhbm5vdCBwYXJzZSBqc29uIC0gb3V0cHV0IHBsYWluXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1Zyhg8J2XpfCdl7LwnZe+8J2YgvCdl7LwnZiA8J2YgTogJHt4aHR0cC5zdGF0dXN9ICR7eGh0dHAuc3RhdHVzVGV4dH0nOlxcbmAsIG1zZyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgb25TdWNjZXNzRm4obmV3IEthc2ltaXJIdHRwUmVzcG9uc2UoeGh0dHAucmVzcG9uc2UsIHhodHRwLnN0YXR1cywgdGhpcykpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuXG4gICAgICAgIHhodHRwLnNlbmQodGhpcy5yZXF1ZXN0LmJvZHkpO1xuICAgIH1cblxufSIsIlxuXG5jbGFzcyBLYXNpbWlySHR0cFJlc3BvbnNlIHtcblxuXG4gICAgY29uc3RydWN0b3IgKGJvZHksIHN0YXR1cywgcmVxdWVzdCkge1xuICAgICAgICB0aGlzLmJvZHkgPSBib2R5O1xuICAgICAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcbiAgICAgICAgdGhpcy5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge29iamVjdH1cbiAgICAgKi9cbiAgICBnZXRCb2R5SnNvbigpIHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGhpcy5ib2R5KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldEJvZHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJvZHk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICAqL1xuICAgIGlzT2soKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXR1cyA9PT0gMjAwO1xuICAgIH1cblxufSJdfQ==