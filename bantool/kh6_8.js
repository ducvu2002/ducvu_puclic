iimPlayCode('URL GOTO=about:newtab');
var x, y1;
x2 = 9999999999999;
y2 = 9999999999999;




function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}



while (true) {
    tinh_nang = prompt('Menu : ' + "\n" + '1. Download Hết' + "\n" + '2. Download tùy chọn');
    if (tinh_nang == '1' || tinh_nang == '2') break;
    alert('Nhập không đúng vui lòng nhập lại');
}

switch (tinh_nang) {
    case '1':
        x = 0;
        y1 = 0;
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
            x = Number(chuong_bai_start[0]);
            y1 = Number(chuong_bai_start[1]) - 1;
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
            x2 = Number(chuong_bai_end[0]);
            y2 = Number(chuong_bai_end[1]);
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




function downloadURI(url, path, name) {
    url = url.replace(/ /g, '<SP>');
    path = path.replace(/ /g, '<SP>');
    name = name.replace(/ /g, '<SP>');
    iimPlayCode('SET !TIMEOUT_PAGE 1' + "\n" + 'URL GOTO=about:newtab');
    iimPlayCode("ONDOWNLOAD FOLDER=" + path + " FILE=" + name + " WAIT=NO");
    iimPlayCode('SET !TIMEOUT_PAGE 2592000' + "\n" + 'URL GOTO=' + url);
    iimPlayCode('WAIT SECONDS=1');
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


function request_dom(url) {
    url = url.replace("https://vted.vn", "");
    let req = new window.XMLHttpRequest();
    req.open('GET', url, false);
    req.send(null);
    let data = req.responseText;
    if (req.status == 200 || req.status == 500) {
        dom = new window.DOMParser().parseFromString(data, "text/html");
        return dom;
    } else {
        iimPlayCode('WAIT SECONDS=10');
        return request_dom(url);
    }
}



first = true;
stop = false;

function get_chuong(dom_html, path) {
    let chuong = dom_html.getElementsByClassName("main-item");
    while (x < chuong.length) {
        if (x > x2) {
            return;
        }
        let name_chuong = chuong[x].querySelector("h4").textContent.trim().replace(/[\/\\:*?"<>|]/g, '_');
        let pathx = path + name_chuong + "\\";
        create_folder(pathx);
        let dom_chuong = dom_html.querySelector("#sub-menu-" + chuong[x].getAttribute("data-id"));
        if (dom_chuong != null) {
            while (dom_chuong.getAttribute("aria-expanded") != "true") {
                chuong[x].click();
                iimPlayCode('WAIT SECONDS=1');
            }
            get_bai(dom_chuong, pathx);
            if (stop) {
                return;
            }
        }
        x++;
    }
}


function get_bai(dom_html, path) {
    let y;
    if (first) {
        y = y1;
    } else {
        y = 0;
    }
    first = false;

    let bai = dom_html.querySelectorAll("#" + dom_html.id + ">a");
    while (y < bai.length) {
        if (x == x2 && y == y2) {
            stop = true;
            return;
        }
        let name_bai = bai[y].querySelector("h4").textContent.trim().replace(/[\/\\:*?"<>|]/g, '_');
        let pathx = path + name_bai + "\\";
        create_folder(pathx);
        if (bai[y].getAttribute("data-toggle") != null) {
            let dom_bai = dom_html.querySelector("#sub-menu-" + bai[y].getAttribute("data-id"));
            if (dom_bai != null) {
                while (dom_bai.getAttribute("aria-expanded") != "true") {
                    bai[y].click();
                    iimPlayCode('WAIT SECONDS=1');
                }
                let dom_hoc = dom_bai.querySelectorAll("#" + dom_bai.id + ">a");
                for (let i = 0; i < dom_hoc.length; i++) {
                    get_video_pdf(dom_hoc[i], pathx);
                }
            }
        } else {
            get_video_pdf(bai[y], pathx);
        }
        y++;
    }
}




function get_video_pdf(dom_html, path) {
    let name_obj = dom_html.querySelector("h4").textContent.trim().replace(/[\/\\:*?"<>|]/g, '_');
    if (dom_html.href.startsWith('https://vted.vn/khoa-hoc/')) {
        let dom_video = request_dom(dom_html.href).querySelector(".asyncVideo");
        if (dom_video != null) {
            let link_video = dom_video.getAttribute("data-url");
            link_video = "https://vted.vn" + decodeURIComponent(link_video.substring(16, link_video.indexOf(".mp4") + 4));
            list_download.push([link_video, path, name_obj + ".mp4"]);
        } else {
            write_data(path_save, "error.txt", path + name_obj + ".mp4");
        }
    } else {
        while (true) {
            let dom_thi = request_dom(dom_html.href).querySelector("#sidebarleft .btn.btn-danger");
            if (dom_thi.textContent.trim() == "Làm đề thi") {
                request_dom(dom_thi.getAttribute("data-href"));
            } else if (dom_thi.textContent.trim() == "Nạp tiền vào tài khoản") {
                write_data(path_save, "error.txt", path + " : hết lượt xem");
                break;
            } else {
                iimPlayCode(
                    'TAB OPEN' + "\n" +
                    'TAB T=2' + "\n" +
                    'SET !TIMEOUT_PAGE 3600' + "\n" +
                    'URL GOTO=' + dom_thi.href
                );
                while (window.document.readyState != 'complete') {
                    iimPlayCode('WAIT SECONDS=1');
                }


                try {
                    window.document.getElementById("menutop-sticky-wrapper").remove();
                } catch (e) {}
                try {
                    window.document.querySelector(".breadcrumbs").remove();
                } catch (e) {}
                try {
                    window.document.querySelector(".footer-default").remove();
                } catch (e) {}


                let dom_pdf = window.document.querySelector(".btn.btn-link.btn-lg");
                if (dom_pdf != null) {
                    list_download.push([dom_pdf.href, path, "Đề thi.pdf"]);
                } else {
                    write_data(path_save, "error.txt", path + "Đề thi.pdf");
                }

                if (window.document.querySelector(".answer") == null) {
                    iimPlayCode(
                        'TAB CLOSE' + "\n" +
                        'WAIT SECONDS=1'
                    );
                    write_data(path, "không có hướng dẫn giải.txt", "");
                    write_data(path_save, "error.txt", path + " : Không có đáp án");
                    break;
                }




                try {
                    window.document.querySelector(".container-fluid .row .row .col-md-12").remove();
                } catch (e) {}
                try {
                    window.document.querySelector(".container-fluid .col-md-4.col-sm-12.col-xs-12").remove();
                } catch (e) {}
                try {
                    window.document.querySelector(".container-fluid .text-right.margin-bottom-15").remove();
                } catch (e) {}
                try {
                    window.document.querySelector(".modal.fade.modal-eror").remove();
                } catch (e) {}
                while (true) {
                    let dom_cau = window.document.querySelector(".answer.lock");
                    if (dom_cau == null) {
                        break;
                    }
                    dom_cau.className = dom_cau.className.replace("answer lock", "answer block");
                }
                while (true) {
                    let dom_loi_giai = window.document.querySelector(".overflow-a.margin-bottom-10.hidden");
                    if (dom_loi_giai == null) {
                        break;
                    }
                    dom_loi_giai.className = dom_loi_giai.className.replace("hidden", "");
                }
                while (true) {
                    let dom = window.document.querySelector(".pull-right.text-danger");
                    if (dom == null) {
                        break;
                    }
                    dom.remove();
                }
                while (true) {
                    let dom = window.document.querySelector(".text-right.margin-bottom-20");
                    if (dom == null) {
                        break;
                    }
                    dom.remove();
                }
                while (true) {
                    let dom = window.document.querySelector(".btn.btn-sm.btn-danger.btn_nextResult.pull-right");
                    if (dom == null) {
                        break;
                    }
                    dom.remove();
                }
                while (true) {
                    let dom = window.document.querySelector(".btn.btn-sm.btn-danger.btn_prevResult");
                    if (dom == null) {
                        break;
                    }
                    dom.remove();
                }
                try {
                    window.document.querySelector(".container-fluid .header-card-line").remove();
                } catch (e) {}
                try {
                    window.document.querySelector(".container-fluid .margin-top-15.text-right").remove();
                } catch (e) {}
                try {
                    window.document.getElementById("form-comment").remove();
                } catch (e) {}
                try {
                    window.document.getElementById("comment-list").remove();
                } catch (e) {}




                iimPlayCode('WAIT SECONDS=1');
                cau = window.document.querySelectorAll(".answer");
                dom_capture = window.document.querySelector(".bg-color-white.content-card");

                max_height = 60000; //65536 

                //save image
                let start = 0;
                while (true) {
                    let end = cau.length;
                    while (dom_capture.offsetHeight > max_height) {
                        cau[end - 1].className = cau[end - 1].className.replace("answer block", "answer lock");
                        end--;
                    }

                    iimPlayCode(
                        'WAIT SECONDS=1' + "\n" +
                        'ONDOWNLOAD FOLDER=' + path.replace(/ /g, '<SP>') + ' FILE=Hướng<SP>dẫn<SP>giải<SP>câu<SP>' + (start + 1) + "-" + end + ".png" + "\n" +
                        'TAG POS=1 TYPE=DIV ATTR=CLASS:bg-color-white<SP>content-card CONTENT=EVENT:SAVE_ELEMENT_SCREENSHOT'
                    );

                    if (end == cau.length) {
                        break;
                    }
                    for (let i = end; i < cau.length; i++) {
                        cau[i].className = cau[i].className.replace("answer lock", "answer block");
                    }
                    start = end;
                    for (let i = start - 1; i >= 0; i--) {
                        cau[i].className = cau[i].className.replace("answer block", "answer lock");
                    }
                }



                iimPlayCode(
                    'TAB CLOSE' + "\n" +
                    'WAIT SECONDS=1'
                );
                break;
            }
        }
    }
}


list_download = [];

path_save = get_csv(1, 1);
url_khoahoc = get_csv(2, 1);

iimPlayCode("URL GOTO=" + url_khoahoc);
while (window.document.querySelector(".member.dropdown") == null) {
    iimPlayCode('WAIT SECONDS=1');
}
if (window.location.href != url_khoahoc) iimPlayCode("URL GOTO=" + url_khoahoc);
while (window.document.querySelector("#home") == null) {
    iimPlayCode('WAIT SECONDS=1');
}
name_khoa_hoc = window.document.querySelector(".course-bar .font-bold").textContent.trim().replace(/[\/\\:*?"<>|]/g, '_');
get_chuong(window.document, path_save + "\\" + name_khoa_hoc + "\\");

for (i = 0; i < list_download.length; i++) {
    //config media.play-stand-alone = false
    downloadURI(list_download[i][0], list_download[i][1], list_download[i][2]);
}
alert('Đã chạy xong.\nĐang download tất cả file');
