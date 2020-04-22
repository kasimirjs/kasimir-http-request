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
