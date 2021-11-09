var i; //1
var j; //0

i2 = -1;
j2 = -1;

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

var so_luong;
while (true) {
    so_luong = prompt('Nhập số luồng');
    if (isNumeric(so_luong)) break;
    alert('Nhập không đúng vui lòng nhập lại');
}



while (true) {
    tinh_nang = prompt('Menu : ' + "\n" + '1. Download Hết' + "\n" + '2. Download tùy chọn');
    if (tinh_nang == '1' || tinh_nang == '2') break;
    alert('Nhập không đúng vui lòng nhập lại');
}

switch (tinh_nang) {
    case '1':
        i = 1;
        j = 0;
        break;
    case '2':
        while (true) {
            chuong_bai_start = prompt('Nhập chương và bài bắt đầu' + "\n" + 'Ví dụ nhập chương 2 bài 2 là' + "\n" + '2|2');
            chuong_bai_start = chuong_bai_start.split("|");
            if (chuong_bai_start.length != 2) {
                alert('Nhập không đúng vui lòng nhập lại');
                continue;
            }
            if (!isNumeric(chuong_bai_start[0]) || !isNumeric(chuong_bai_start[1])) {
                alert('Nhập không đúng vui lòng nhập lại');
                continue;
            }
            i = Number(chuong_bai_start[0]);
            j = Number(chuong_bai_start[1]) - 1;
            break;
        }

        while (true) {
            chuong_bai_end = prompt('Nhập chương và bài kết thúc' + "\n" + 'Ví dụ nhập chương 4 bài 4 là' + "\n" + '4|4');
            chuong_bai_end = chuong_bai_end.split("|");
            if (chuong_bai_end.length != 2) {
                alert('Nhập không đúng vui lòng nhập lại');
                continue;
            }
            if (!isNumeric(chuong_bai_end[0]) || !isNumeric(chuong_bai_end[1])) {
                alert('Nhập không đúng vui lòng nhập lại');
                continue;
            }
            i2 = Number(chuong_bai_end[0]);
            j2 = Number(chuong_bai_end[1]);
            break;
        }
        break;
}


function get_csv(line, col) {
    iimPlayCode(
        'SET !DATASOURCE data.csv' + "\n" +
        'SET !DATASOURCE_LINE ' + line + "\n" +
        'SET !EXTRACT {{!COL' + col + '}}'
    );
    return iimGetLastExtract();
}

function create_folder(path) {
    path = path.replace(/ /g, '<SP>');
    iimPlayCode('ONDOWNLOAD FOLDER=' + path + ' FILE=*');
}


function write_data(path, name_file, text) {
    path = path.replace(/ /g, '<SP>');
    name_file = name_file.replace(/ /g, '<SP>');
    iimSet('text', text);
    iimPlayCode(
        'SET !EXTRACT {{text}}' + "\n" +
        'SAVEAS TYPE=EXTRACT FOLDER=' + path + ' FILE=' + name_file
    );
}

function get_path_run() {
    iimPlayCode('SET !EXTRACT {{!FOLDER_DATASOURCE}}');
    return iimGetLastExtract().slice(0, -32);
}

function wait_load(link_current) {
    status_error = null;
    while (window.location.href == link_current) {
        status_error = window.document.querySelector('.ant-modal-confirm-title');
        if (status_error != null) return status_error;
        iimPlayCode('WAIT SECONDS=1');
    }
    while (window.document.querySelector('.ant-list-bordered') == null) {
        iimPlayCode('WAIT SECONDS=1');
    }
    return status_error;
}


path_list_download = get_path_run() + "Data\\manager_download\\";
//title
write_data(path_list_download, "list_download.txt", "Download video mapstudy.vn (" + new Date().getTime() + ")");
//so_luong
write_data(path_list_download, "list_download.txt", so_luong);


iimPlayCode('URL GOTO=about:newtab');
path_save = get_csv(1, 1);
url_khoahoc = get_csv(2, 1);

window.location.href = url_khoahoc;
while (true) {

    try {
        if (window.document.querySelector('.ant-btn-danger').textContent.trim() == "Đăng xuất") break;
    } catch (e) {}
    iimPlayCode('WAIT SECONDS=1');
}

if (window.location.href != url_khoahoc) window.location.href = url_khoahoc;
while (window.document.querySelector('video') == null) {
    try {
        if (window.document.querySelector('.ant-result-title').textContent == "Bạn đã xem hết lượt xem của video này") break;
    } catch (e) {}
    iimPlayCode('WAIT SECONDS=1');
}


function get_link_video() {
    if (window.document.querySelector(".responsive-iframe") != null) {
        iframe = window.document.querySelector("iframe").contentWindow.document.documentElement;
    } else {
        iframe = window.document.documentElement;
    }
    while (iframe.querySelector('video') == null) {
        try {
            if (window.document.querySelector('.ant-result-title').textContent == "Bạn đã xem hết lượt xem của video này") return "hết lượt xem";
        } catch (e) {}
        iimPlayCode('WAIT SECONDS=1');
    }

    if (!iframe.querySelector('video').src.startsWith('blob:')) return iframe.querySelector('video').src;
    playlist = iframe.querySelector('video>source').src;
    //playlist.m3u8
    list_link = request(playlist).split("\n");
    for (let c = 0; c < list_link.length; c++) {
        if (!list_link[c].startsWith("#")) return playlist.substr(0, playlist.indexOf("playlist.m3u8")) + list_link[c];
    }

    return "NO_LINK";
}



dom = '.section:nth-child(' + (i + 1) + ')';
first = true;
while (true) {
    try {
        khoa_hoc = window.document.querySelector('.course-detail-title').textContent.trim().replace(/[\/\\:*?"<>|]/g, '_');
        break;
    } catch (e) {}
    iimPlayCode('WAIT SECONDS=1');
}
while (window.document.querySelector(dom) != null) {
    if (i == i2 && j == j2) {
        break;
    }


    link_current = window.location.href;
    while (window.document.querySelector(dom + ">ul") == null) {
        window.document.querySelector(dom + " .section-right-name").click();
        iimPlayCode('WAIT SECONDS=1');
    }
    try {
        chuyen_de = window.document.querySelector(dom + ' .name').textContent.trim().replace(/[\/\\:*?"<>|]/g, '_');
        dom_bai = window.document.querySelector(dom + '>ul>li:nth-child(' + (++j) + ') .scorm-right-link');
        ten_bai = dom_bai.textContent.trim().replace(/[\/\\:*?"<>|]/g, '_');
        path_save_video = path_save + "\\" + khoa_hoc + "\\" + chuyen_de + "\\" + ten_bai + "\\";
        create_folder(path_save_video);
        dom_bai.click();
        iimPlayCode('WAIT SECONDS=1');
        status_wait = wait_load(link_current);

        x = 0;
        domx = ".ant-list-bordered .ant-list-item:nth-child(" + (++x) + ")";
        if (status_wait == null) {
            while (window.document.querySelector(domx) != null) {
                domx_video = window.document.querySelector(domx + ">a");
                view_remaining = window.document.querySelector(domx + ">span").className;

                domx_video.click();
                while (domx_video.className != "document-name active" && view_remaining == "view-remaining") {
                    iimPlayCode('WAIT SECONDS=1');
                }

                link_video = get_link_video();

                ten_video = domx_video.textContent.trim().replace(/[\/\\:*?"<>|]/g, '_') + ".mp4";

                if (link_video == "NO_LINK" || link_video == "hết lượt xem") {
                    write_data(path_save, "error.txt", path_save_video + ten_video + " : " + link_video);
                } else {
                    write_data(path_list_download, "list_download.txt", path_save_video + ten_video + "|" + link_video);
                }
                domx = ".ant-list-bordered .ant-list-item:nth-child(" + (++x) + ")";
            }

            //tải file pdf
            try {
                domx = ".ant-list-bordered .ant-list-item:nth-child(1)>a>button:nth-child(" + (1) + ")";
                iimPlayCode("ONDOWNLOAD FOLDER=" + path_save_video.replace(/ /g, '<SP>') + " FILE=" + ten_bai.replace(/ /g, '<SP>') + ".pdf" + " WAIT=NO");
                window.document.querySelector(domx).click();
                iimPlayCode('WAIT SECONDS=5');

                domx = ".ant-list-bordered .ant-list-item:nth-child(1)>a>button:nth-child(" + (2) + ")";
                iimPlayCode("ONDOWNLOAD FOLDER=" + path_save_video.replace(/ /g, '<SP>') + " FILE=" + (ten_bai + '[Lời giải + Đáp án]').replace(/ /g, '<SP>') + ".pdf" + " WAIT=NO");
                window.document.querySelector(domx).click();
                iimPlayCode('WAIT SECONDS=5');
            } catch (e) {}

        } else {
            error = status_wait.textContent.trim();
            write_data(path_save, "error.txt", path_save_video + " : " + error);
            break;
        }

    } catch (e) {
        dom = '.section:nth-child(' + (++i) + ')';
        j = 0;
    }
    if (first) {
        dom = '.section:nth-child(' + (i) + ')';
        first = false;
    }
}

iimPlayCode('URL GOTO=about:newtab');
window.location.href = "download://download";
iimPlayCode("WAIT SECONDS=60");
iimPlayCode("TAB CLOSE");
