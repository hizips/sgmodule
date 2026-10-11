(function () {
  function headerValue(headers, name) {
    if (!headers || typeof headers !== "object") return "";
    var wanted = String(name).toLowerCase();
    var keys = Object.keys(headers);
    for (var index = 0; index < keys.length; index += 1) {
      var key = keys[index];
      if (String(key).toLowerCase() === wanted) return String(headers[key]);
    }
    return "";
  }

  function bodySize(message) {
    if (!message || typeof message !== "object") return 0;
    var bytes = message.bodyBytes;
    if (bytes && typeof bytes.byteLength === "number") return bytes.byteLength;
    if (bytes && typeof bytes.length === "number") return bytes.length;
    return typeof message.body === "string" ? message.body.length : 0;
  }

  function urlWithoutQuery(rawUrl) {
    var value = String(rawUrl || "");
    var queryIndex = value.indexOf("?");
    return queryIndex === -1 ? value : value.slice(0, queryIndex);
  }

  try {
    var request = typeof $request === "undefined" ? {} : $request;
    var response = typeof $response === "undefined" ? null : $response;
    var stage = response ? "response" : "request";
    var responseHeaders = response && response.headers ? response.headers : {};
    var requestHeaders = request && request.headers ? request.headers : {};
    var record = {
      stage: stage,
      method: request.method || "",
      url: urlWithoutQuery(request.url),
      status: response ? response.status || response.statusCode || "" : "",
      contentType: headerValue(responseHeaders, "content-type"),
      contentEncoding: headerValue(responseHeaders, "content-encoding"),
      bodyBytes: response ? bodySize(response) : bodySize(request),
      clientName: headerValue(requestHeaders, "x-youtube-client-name"),
      clientVersion: headerValue(requestHeaders, "x-youtube-client-version")
    };
    console.log("[YouTube-tvOS-diagnostic] " + JSON.stringify(record));
  } catch (error) {
    console.log("[YouTube-tvOS-diagnostic] logger error: " + String(error));
  }

  $done({});
})();
