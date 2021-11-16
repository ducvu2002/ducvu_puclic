try {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "//cdn.jsdelivr.net/npm/sweetalert2@11", false); // false for synchronous request
    xmlHttp.send(null);
    alert(xmlHttp.responseText);
} catch (e) {
    alert(e);
}
