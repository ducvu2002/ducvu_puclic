iimPlayCode('URL GOTO=about:newtab');
var x1;
var x2 = 9999999999999;




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
        x1 = 1;
        break;
    case '2':
        while (true) {
            chuong_bai_start = prompt('Nhập bài bắt đầu' + "\n" + 'Ví dụ nhập bài 2 là' + "\n" + '2');
            if (!isNumeric(chuong_bai_start)) {
                alert('Nhập không đúng vui lòng nhập lại');
                continue;
            }
            x1 = Number(chuong_bai_start);
            break;
        }

        while (true) {
            chuong_bai_end = prompt('Nhập bài kết thúc' + "\n" + 'Ví dụ nhập bài 4 là' + "\n" + '4');
            if (!isNumeric(chuong_bai_end)) {
                alert('Nhập không đúng vui lòng nhập lại');
                continue;
            }
            x2 = Number(chuong_bai_end);
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




function downloadURI(url, path, name) {
    path = path.replace(/ /g, '<SP>');
    name = name.replace(/ /g, '<SP>');
    iimPlayCode("ONDOWNLOAD FOLDER=" + path + " FILE=" + name + " WAIT=NO");
    var link = window.document.createElement("a");
    link.style.display = 'none';
    link.download = "download";
    link.href = url;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    iimPlayCode('SET !TIMEOUT_PAGE 864000' + "\n" + 'WAIT SECONDS=1');
}




function get_path_run() {
    iimPlayCode('SET !EXTRACT {{!FOLDER_DATASOURCE}}');
    return iimGetLastExtract().substr(0, iimGetLastExtract().length - 32);
}

path_list_download = get_path_run() + "Data\\manager_download\\";
//title
write_data(path_list_download, "list_download.txt", "Download video ngoaingu24h.vn (" + new Date().getTime() + ")");
//so_luong
write_data(path_list_download, "list_download.txt", so_luong);




function get_value_console(script_text) {
    while (window.document.getElementById('#####') != null) window.document.getElementById('#####').remove();
    while (window.document.getElementById('#####2') != null) window.document.getElementById('#####2').remove();

    input = window.document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("id", "#####");
    input.setAttribute("value", " ");
    window.document.getElementsByTagName('body')[0].appendChild(input);

    script = window.document.createElement('script');
    script.setAttribute("id", "#####2");
    script.innerHTML = "document.getElementById('#####').value = " + script_text;
    window.document.getElementsByTagName('body')[0].appendChild(script);
    while (window.document.getElementById('#####').value == " ") iimPlayCode("WAIT SECONDS=1");
    let data = window.document.getElementById('#####').value;
    while (window.document.getElementById('#####') != null) window.document.getElementById('#####').remove();
    while (window.document.getElementById('#####2') != null) window.document.getElementById('#####2').remove();
    return data;
}

function get_link_bai(name, id) {
    return get_value_console(`getLinkTopic("${name}", ${id})`);
}




function get_bai(dom_html, path, main = true) {
    let bai = dom_html.getElementsByClassName("topic-item-panel");
    let x;
    if (main) {
        x = x1;
    } else {
        x = 0;
    }
    while (x < bai.length) {
        if (main && x > x2) {
            break;
        }
        let info_bai = bai[x].querySelector(".name-panel");
        let name_bai = info_bai.textContent.trim();
        let id_bai = info_bai.getAttribute("data-target"); //#collapse-topic-item-(21)
        let link_bai = "https://ngoaingu24h.vn" + get_link_bai(name_bai, id_bai.substr(21));
        if (bai[x].querySelector("#Shape") != null) {
            get_video(link_bai, path + "\\" + name_bai.replace(/[\/\\:*?"<>|]/g, '_') + "\\");
        } else {
            get_exam(link_bai, path + "\\" + name_bai.replace(/[\/\\:*?"<>|]/g, '_') + "\\");
        }
        x++;
    }
}


function get_video(url, path) {
    iimPlayCode(
        'TAB OPEN' + "\n" +
        'TAB T=2' + "\n" +
        'SET !TIMEOUT_PAGE 3600' + "\n" +
        'URL GOTO=' + url.replace(/ /g, '<SP>')
    );
    while (window.document.readyState != 'complete') {
        iimPlayCode('WAIT SECONDS=1');
    }
    iimPlayCode('WAIT SECONDS=2');
    
    
    let dom_video = window.document.querySelector("#check-mathjax-element img");
    if (dom_video != null) {
        write_data(path_list_download, "list_download.txt", path + "Bài giảng.mp4" + "|" + dom_video.getAttribute("src-video-js"));
    } else {
        write_data(path_save, "error.txt", path + "Bài giảng.mp4");
    }


    let dom_pdf = window.document.querySelector(".document-item.flex .view");
    if (dom_pdf != null) {
        downloadURI(dom_pdf.href, path, "tài liệu.pdf");
    } else {
        write_data(path_save, "error.txt", path + "tài liệu.pdf");
    }


    get_bai(window.document.documentElement, path, false);

    iimPlayCode(
        'TAB CLOSE' + "\n" +
        'WAIT SECONDS=1'
    );
}



function get_exam(url, path) {
    iimPlayCode(
        'TAB OPEN' + "\n" +
        'TAB T=2' + "\n" +
        'SET !TIMEOUT_PAGE 3600' + "\n" +
        'URL GOTO=' + url.replace(/ /g, '<SP>')
    );

    while (window.document.readyState != 'complete') {
        iimPlayCode('WAIT SECONDS=1');
    }
    iimPlayCode('WAIT SECONDS=2');
    

    let dom_pdf = window.document.querySelector(".document-item.flex .view");
    if (dom_pdf != null) {
        downloadURI(dom_pdf.href, path, "đề thi.pdf");
    } else {
        write_data(path_save, "error.txt", path + "đề thi.pdf");
    }

    while (true) {
        let nopbai;
        while (true) {
            try {
                window.document.querySelector(".button-play-main").click();
            } catch (e) {}
            iimPlayCode('WAIT SECONDS=1');
            if ((nopbai = window.document.querySelector("#btn-submit-game")) != null) {
                break;
            }
        }
        if (nopbai.className == 'buttonLoading disabled') {
            iimPlayCode('WAIT SECONDS=1');
            break;
        } else {
            while ((nopbai = window.document.querySelector("#btn-submit-game")) != null) {
                try {
                    window.document.querySelector(".BTB").querySelector(".radioButtonAnswer").click();
                } catch (e) {}
                try {
                    nopbai.click();
                } catch (e) {}
                iimPlayCode('WAIT SECONDS=1');
                try {
                    window.document.getElementsByClassName("btn-close-bottom")[1].click();
                } catch (e) {}
            }
        }
    }




    img_default = "data:image/png;base64,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";

    style_default = "width: 100%; border-top: medium none; margin-top: 2px; border-radius: 2px;";



    while (true) {
        kq_sai = window.document.querySelector(".ks-checkBox.cardAnswer-incorrect");
        if (kq_sai == null) break;
        kq_sai.style = style_default;
        kq_sai.querySelector(".gwt-Image").src = img_default;
        kq_sai.className = "ks-checkBox";
    }



    try {
        window.document.getElementById("header").remove();
    } catch (e) {}
    try {
        window.document.getElementById("path-link-main-panel").remove();
    } catch (e) {}
    try {
        window.document.getElementById("tidio-chat").remove();
    } catch (e) {}
    try {
        window.document.getElementById("timePanel").remove();
    } catch (e) {}
    try {
        window.document.querySelector(".button-back-review").remove();
    } catch (e) {}
    try {
        window.document.querySelector(".hidden-xs.basic-game-view-right-panel").remove();
    } catch (e) {}


    while (true) {
        dom = window.document.querySelector(".questionOptionPanel");
        if (dom == null) break;
        dom.remove();
    }


    iimPlayCode(
        'WAIT SECONDS=1' + "\n" +
        'SAVEAS TYPE=PNG FOLDER=' + path.replace(/ /g, '<SP>') + ' FILE=Hướng<SP>dẫn<SP>giải.png' + "\n" +
        'TAB CLOSE' + "\n" +
        'WAIT SECONDS=1'
    );

}


path_save = get_csv(1, 1);
url_khoahoc = get_csv(2, 1);



iimPlayCode("URL GOTO=" + url_khoahoc.replace(/ /g, '<SP>'));
while (window.document.querySelector(".img-avatar.login-dialog-img-panel.loaded") == null) {
    iimPlayCode('WAIT SECONDS=1');
}

while (window.document.readyState != 'complete') {
    iimPlayCode('WAIT SECONDS=1');
}
iimPlayCode('WAIT SECONDS=2');


name_khoa_hoc = window.document.querySelector(".banner-content-text").textContent.trim().replace(/[\/\\:*?"<>|]/g, '_');
get_bai(window.document.documentElement, path_save + "\\" + name_khoa_hoc + "\\");



iimPlayCode('URL GOTO=about:newtab');
window.location.href = "download://download";
iimPlayCode("WAIT SECONDS=60");
iimPlayCode("TAB CLOSE");
