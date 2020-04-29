

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
                onSuccessFn(new KasimirHttpResponse(xhttp.response, xhttp.status, this));
                return;
            }

        };

        xhttp.send(this.request.body);
    }

}