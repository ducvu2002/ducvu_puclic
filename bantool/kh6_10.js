var request = function(url,data = null){
 results="";
 var xmlhttp= new window.XMLHttpRequest;
  try {
  var type = data==null?"GET":"POST";
  xmlhttp.open(type, url, false);
  xmlhttp.onreadystatechange=function() {
     if (xmlhttp.readyState==4 ) {
        if(xmlhttp.status==200 || xmlhttp.status==500 ){
           results = xmlhttp.responseText;
           //window.alert(results);
           }
        }
   };
   xmlhttp.send(data);
 } catch (e) {};
  return results;
}








iimPlayCode('URL GOTO=about:newtab');
var x, y1;
x2 = 9999999999999;
y2 = 9999999999999;




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
        x = 1;
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
    return iimGetLastExtract().slice(0, -32);
}


path_list_download = get_path_run() + "Data\\manager_download\\";
//title
write_data(path_list_download, "list_download.csv", "Download video tuduymo.com (" + new Date().getTime() + ")");
//so_luong
write_data(path_list_download, "list_download.csv", so_luong);




first = true;
stop = false;

function get_chuong(dom_html, path) {
    chuong = dom_html.getElementsByClassName("navigation__chapter");
    while (x < chuong.length) {
        if (x > x2) {
            return;
        }
        let dom_chuong = chuong[x].querySelector(".subtitle-1");
        dom_chuong.click();
        //iimPlayCode('WAIT SECONDS=1');
        let name_chuong = dom_chuong.textContent.trim().replace(/[\/\\:*?"<>|]/g, '_');
        let pathx = path + name_chuong + "\\";
        get_bai(chuong[x], pathx);
        if (stop) {
            return;
        }
        x++;
    }

}




data_image_bai = {
    "thi": "M6 2C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H10V20.1L20 10.1V8L14 2H6ZM13 3.5L18.5 9H13V3.5ZM20.1 13C20 13 19.8 13.1 19.7 13.2L18.7 14.2L20.8 16.3L21.8 15.3C22 15.1 22 14.7 21.8 14.5L20.5 13.2C20.4 13.1 20.3 13 20.1 13ZM18.1 14.8L12 20.9V23H14.1L20.2 16.9L18.1 14.8Z",
    "loi_giai": "M6 2C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2H6ZM13 9V3.5L18.5 9H13Z",
    "bai_giang": "M17 10.5V7C17 6.45 16.55 6 16 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H16C16.55 18 17 17.55 17 17V13.5L21 17.5V6.5L17 10.5Z"
}

function get_bai(dom_html, path) {
    let y;
    if (first) {
        y = y1;
    } else {
        y = 0;
    }
    first = false;
    bai = dom_html.getElementsByClassName("navigation__lesson");
    while (y < bai.length) {
        if (x == x2 && y == y2) {
            stop = true;
            return;
        }
        window.performance.clearResourceTimings();
        bai[y].click();
        iimPlayCode('WAIT SECONDS=1');
        let name_bai = bai[y].querySelector(".ml-2").textContent.trim().replace(/[\/\\:*?"<>|]/g, '_');
        let pathx = path + name_bai + "\\";
        switch (bai[y].querySelector("path").getAttribute("d")) {
            case data_image_bai.bai_giang:
                create_folder(pathx);
                get_link_video(pathx + "Bài Giảng" + ".mp4");
                break;
            case data_image_bai.thi:
                download_de_thi(pathx, "Đề thi");
                break;
            case data_image_bai.loi_giai:
                download_loi_giai(pathx, "Lời giải");
                break;
        }
        y++;
    }
}



function download_de_thi(path, name) {
    path = path.replace(/ /g, '<SP>');
    name = name.replace(/ /g, '<SP>');
    while ((download = window.document.querySelector(".mdi-download")) == null) {
        iimPlayCode('WAIT SECONDS=1');
    }
    iimPlayCode("ONDOWNLOAD FOLDER=" + path + " FILE=" + name + " WAIT=NO");
    download.click();
    iimPlayCode('SET !TIMEOUT_PAGE 864000' + "\n" + 'WAIT SECONDS=1');
}



function download_loi_giai(path, name) {
    while ((canva = window.document.querySelector(".pdf-canvas")) == null) {
        iimPlayCode('WAIT SECONDS=1');
    }

    let page_next = window.document.querySelector(".small-padding:nth-child(2)");

    let i = 1;
    do {
        temp = canva.toDataURL();
        downloadURI(temp, path, name + "_page_" + (i++) + ".png");
        page_next.click();
        iimPlayCode('WAIT SECONDS=1');
    } while (canva.toDataURL() != temp);
}



var temp = "";

function get_link_video(path) {
    var capture_resource = window.performance.getEntriesByType("resource");
    while (true) {
        for (var i = 0; i < capture_resource.length; i++) {
            let link = capture_resource[i].name;
            if (link.endsWith("/index.m3u8") && temp != link) { //type xmlhttprequest
                temp = link;
                window.performance.clearResourceTimings();
                iimPlayCode('WAIT SECONDS=1');
                let list_m = request(link);
                
                
                let max = 0;
                let j;
                while ((j = list_m.indexOf("cdnkey")) != -1) {
                    list_m = list_m.substr(i+7);
                    num = Number(list_m.substr(0, list_m.indexOf("p")));
                    if (max < num) max = num;
                }
                
                
                
                let link_main = link.slice(0, -10);
                let audio = `${link_main}cdnkey-${max}p/index-a1.m3u8`;
                let video = `${link_main}cdnkey-${max}p/index-v1.m3u8`;
                
                

                content_text = `${path}|ffmpeg -i "${video}" -i "${audio}" -c:v copy -c:a aac "${path}"`;
                write_data(path_list_download, "list_download.csv", content_text);
                return;

            }
        }
        capture_resource = window.performance.getEntriesByType("resource");
        iimPlayCode('WAIT SECONDS=1');
    }
}




path_save = get_csv(1, 1);
url_khoahoc = get_csv(2, 1);

iimPlayCode("URL GOTO=https://tuduymo.com");
while (window.document.querySelector(".navigation-item__image-wrapper") == null) {
    iimPlayCode('WAIT SECONDS=1');
}
iimPlayCode("URL GOTO=" + url_khoahoc.replace(/ /g, '<SP>'));


while ((dom_khoa_hoc = window.document.querySelector(".cursor-pointer .content--left.subtitle-2")) == null || window.document.querySelector(".base__loading") != null) {
    iimPlayCode('WAIT SECONDS=1');
}
dom_khoa_hoc.click();
window.performance.clearResourceTimings();
iimPlayCode('WAIT SECONDS=1');

get_chuong(window.document.querySelector(".pattern.syllabus"), path_save + "\\" + dom_khoa_hoc.textContent.trim().replace(/[\/\\:*?"<>|]/g, '_') + "\\");



iimPlayCode('URL GOTO=about:newtab');
window.location.href = "download://download";
iimPlayCode("WAIT SECONDS=60");
iimPlayCode("TAB CLOSE");
