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

        url = url.replace(/(\{|\:)([a-zA-Z0-9_\-]+)/, (match, p1, p2) => {
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
                console.log("ok", xhttp);
                if (this.request.onError !== null && xhttp.status >= 400) {
                    this.request.onError(new KasimirHttpResponse(xhttp.response, xhttp.status, this));
                    return;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImthLWh0dHAtcmVxLmpzIiwia2FzaW1pci1odHRwLXJlcXVlc3QuanMiLCJLYXNpbWlySHR0cFJlc3BvbnNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJrYXNpbWlyLWh0dHAtcmVxdWVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3RhcnQgYSBuZXcgaHR0cCByZXF1ZXN0XG4gKlxuICpcbiAqIEBwYXJhbSB1cmxcbiAqIEBwYXJhbSBwYXJhbXNcbiAqL1xuZnVuY3Rpb24ga2FfaHR0cF9yZXEodXJsLCBwYXJhbXM9e30pIHtcbiAgICByZXR1cm4gbmV3IEthc2ltaXJIdHRwUmVxdWVzdCh1cmwsIHBhcmFtcyk7XG59XG4iLCJcblxuY2xhc3MgS2FzaW1pckh0dHBSZXF1ZXN0IHtcblxuICAgIGNvbnN0cnVjdG9yKHVybCwgcGFyYW1zPXt9KSB7XG5cbiAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UoLyhcXHt8XFw6KShbYS16QS1aMC05X1xcLV0rKS8sIChtYXRjaCwgcDEsIHAyKSA9PiB7XG4gICAgICAgICAgICBpZiAoICEgcGFyYW1zLmhhc093blByb3BlcnR5KHAyKSlcbiAgICAgICAgICAgICAgICB0aHJvdyBcInBhcmFtZXRlciAnXCIgKyBwMiArIFwiJyBtaXNzaW5nIGluIHVybCAnXCIgKyB1cmwgKyBcIidcIjtcbiAgICAgICAgICAgIHJldHVybiBlbmNvZGVVUkkocGFyYW1zW3AyXSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucmVxdWVzdCA9IHtcbiAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgYm9keTogbnVsbCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHt9LFxuICAgICAgICAgICAgZGF0YVR5cGU6IFwidGV4dFwiLFxuICAgICAgICAgICAgb25FcnJvcjogbnVsbCxcbiAgICAgICAgICAgIGRhdGE6IG51bGxcbiAgICAgICAgfTtcblxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGFkZGl0aW9uYWwgcXVlcnkgcGFyYW1ldGVycyB0byB1cmxcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKiBAcmV0dXJuIHtLYXNpbWlySHR0cFJlcXVlc3R9XG4gICAgICovXG4gICAgd2l0aFBhcmFtcyhwYXJhbXMpIHtcbiAgICAgICAgaWYgKHRoaXMucmVxdWVzdC51cmwuaW5kZXhPZihcIj9cIikgPT09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3QudXJsICs9IFwiP1wiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0LnVybCArPSBcIiZcIjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgc3RyID0gW107XG4gICAgICAgIGZvciAobGV0IG5hbWUgaW4gcGFyYW1zKSB7XG4gICAgICAgICAgICBpZiAocGFyYW1zLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgICAgICAgICAgc3RyLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KG5hbWUpICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQocGFyYW1zW25hbWVdKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZXF1ZXN0LnVybCArPSBzdHIuam9pbihcIiZcIik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIG1ldGhvZFxuICAgICAqIEByZXR1cm4ge0thc2ltaXJIdHRwUmVxdWVzdH1cbiAgICAgKi9cbiAgICB3aXRoTWV0aG9kKG1ldGhvZCkge1xuICAgICAgICB0aGlzLnJlcXVlc3QubWV0aG9kID0gbWV0aG9kO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0b2tlblxuICAgICAqIEByZXR1cm4ge0thc2ltaXJIdHRwUmVxdWVzdH1cbiAgICAgKi9cbiAgICB3aXRoQmVhcmVyVG9rZW4odG9rZW4pIHtcbiAgICAgICAgdGhpcy53aXRoSGVhZGVycyh7XCJhdXRob3JpemF0aW9uXCI6IFwiYmVhcmVyIFwiICsgdG9rZW59KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBoZWFkZXJzXG4gICAgICogQHJldHVybiB7S2FzaW1pckh0dHBSZXF1ZXN0fVxuICAgICAqL1xuICAgIHdpdGhIZWFkZXJzKGhlYWRlcnMpIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLnJlcXVlc3QuaGVhZGVycywgaGVhZGVycyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYm9keVxuICAgICAqIEByZXR1cm4ge0thc2ltaXJIdHRwUmVxdWVzdH1cbiAgICAgKi9cbiAgICB3aXRoQm9keShib2R5KSB7XG4gICAgICAgIGlmICh0aGlzLnJlcXVlc3QubWV0aG9kID09PSBcIkdFVFwiKVxuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0Lm1ldGhvZCA9IFwiUE9TVFwiO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShib2R5KSB8fCB0eXBlb2YgYm9keSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5KGJvZHkpO1xuICAgICAgICAgICAgdGhpcy53aXRoSGVhZGVycyh7XCJjb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJ9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVxdWVzdC5ib2R5ID0gYm9keTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICAgKiBAcmV0dXJuIHtLYXNpbWlySHR0cFJlcXVlc3R9XG4gICAgICovXG4gICAgd2l0aE9uRXJyb3IoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5yZXF1ZXN0Lm9uRXJyb3IgPSBjYWxsYmFjaztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc2V0IGpzb24oZm4pIHtcbiAgICAgICAgdGhpcy5zZW5kKChyZXMpID0+IHtcbiAgICAgICAgICAgIGZuKHJlcy5nZXRCb2R5SnNvbigpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2V0IHBsYWluKGZuKSB7XG4gICAgICAgIHRoaXMuc2VuZCgocmVzKSA9PiB7XG4gICAgICAgICAgICBmbihyZXMuZ2V0Qm9keSgpKTtcbiAgICAgICAgfSlcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGZuXG4gICAgICogQHBhcmFtIGZpbHRlclxuICAgICAqIEByZXR1cm5cbiAgICAgKi9cbiAgICBzZW5kKG9uU3VjY2Vzc0ZuKSB7XG4gICAgICAgIGxldCB4aHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgICAgIHhodHRwLm9wZW4odGhpcy5yZXF1ZXN0Lm1ldGhvZCwgdGhpcy5yZXF1ZXN0LnVybCk7XG4gICAgICAgIGZvciAobGV0IGhlYWRlck5hbWUgaW4gdGhpcy5yZXF1ZXN0LmhlYWRlcnMpIHtcbiAgICAgICAgICAgIHhodHRwLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyTmFtZSwgdGhpcy5yZXF1ZXN0LmhlYWRlcnNbaGVhZGVyTmFtZV0pO1xuICAgICAgICB9XG4gICAgICAgIHhodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmICh4aHR0cC5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJva1wiLCB4aHR0cCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmVxdWVzdC5vbkVycm9yICE9PSBudWxsICYmIHhodHRwLnN0YXR1cyA+PSA0MDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0Lm9uRXJyb3IobmV3IEthc2ltaXJIdHRwUmVzcG9uc2UoeGh0dHAucmVzcG9uc2UsIHhodHRwLnN0YXR1cywgdGhpcykpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9uU3VjY2Vzc0ZuKG5ldyBLYXNpbWlySHR0cFJlc3BvbnNlKHhodHRwLnJlc3BvbnNlLCB4aHR0cC5zdGF0dXMsIHRoaXMpKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcblxuICAgICAgICB4aHR0cC5zZW5kKHRoaXMucmVxdWVzdC5ib2R5KTtcbiAgICB9XG5cbn0iLCJcblxuY2xhc3MgS2FzaW1pckh0dHBSZXNwb25zZSB7XG5cblxuICAgIGNvbnN0cnVjdG9yIChib2R5LCBzdGF0dXMsIHJlcXVlc3QpIHtcbiAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcbiAgICAgICAgdGhpcy5zdGF0dXMgPSBzdGF0dXM7XG4gICAgICAgIHRoaXMucmVxdWVzdCA9IHJlcXVlc3Q7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAgICovXG4gICAgZ2V0Qm9keUpzb24oKSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRoaXMuYm9keSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXRCb2R5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ib2R5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBpc09rKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0dXMgPT09IDIwMDtcbiAgICB9XG5cbn0iXX0=