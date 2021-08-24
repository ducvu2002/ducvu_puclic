iimPlayCode('URL GOTO=about:newtab');
var chuong, bai1;
chuong2 = 9999999999999;
bai2 = 9999999999999;




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
	if (tinh_nang == null) break;
	if (tinh_nang == '1' || tinh_nang == '2') break;
	alert('Nhập không đúng vui lòng nhập lại');
}

switch(tinh_nang) {
	case '1':
		chuong = 0;
		bai1 = 0;
		break;
	case '2':
        while(true) {
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
            chuong = Number(chuong_bai_start[0])-1;
            bai1 = Number(chuong_bai_start[1])-1;
            break;
        }
        
        while(true) {
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
            chuong2 = Number(chuong_bai_end[0]);
            bai2 = Number(chuong_bai_end[1]);
            break;
        }
		break;
}



first = true;
stop = false;

chuongx = chuong;
baix = bai1;





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
    return iimGetLastExtract().substr(0, iimGetLastExtract().length-32);
}

path_list_download = get_path_run() + "Data\\manager_download\\";
//title
write_data(path_list_download, "list_download.txt", "Download video tuyensinh247.com (" + new Date().getTime() + ")");
//so_luong
write_data(path_list_download, "list_download.txt", so_luong);



path_save = get_csv(1,1);
url_khoahoc = get_csv(2,1);


iimPlayCode('URL GOTO=about:newtab');
window.location.href = url_khoahoc;
while (window.document.querySelector(".td-navbar-signup .avt-signup") == null) iimPlayCode("WAIT SECONDS=1");
if (window.location.href != url_khoahoc) window.location.href = url_khoahoc;
iimPlayCode("WAIT SECONDS=1");


var khoa_hoc = {}
khoa_hoc["name"] = window.document.querySelector(".courseTitle").textContent.trim().replace(/[\/\\:*?"<>|]/g,'_');


function get_chuong(path) {
	while (window.document.querySelector("#tabDetail .videoJustWatched") != null) window.document.querySelector("#tabDetail .videoJustWatched").remove();
	while (window.document.querySelector("#tabDetail .moduleFreeVideo") != null) window.document.querySelector("#tabDetail .moduleFreeVideo").remove();
	try {
		while (true) {
			if (chuong > chuong2) { return; }
			let dom = "#tabDetail .topicDetail:nth-child(" + (++chuong) + ")";
			if (window.document.querySelector(dom) == null) break;
			domshow = window.document.querySelector(dom + " .showDetail");
			while (domshow.className.trim()  == "showDetail") {
				domshow.click();
				iimPlayCode('WAIT SECONDS=1');
			}
			khoa_hoc["chuong_" + chuong] = {};
			khoa_hoc["chuong_" + chuong]["name"] = window.document.querySelector(dom + " .topicTitle").textContent.trim().replace(/[\/\\:*?"<>|]/g,'_');
			create_folder(path + khoa_hoc["chuong_" + chuong]["name"]);
			get_bai(khoa_hoc["chuong_" + chuong], window.document.querySelector(dom + " .topicContent").id);
			if (stop) return;
		}
		
	}
	catch (e) { return; }
}


function get_bai(c, id_c) {
	while (window.document.querySelector("#" + id_c + " .viewMore>a") != null) {
		window.document.querySelector("#" + id_c + " .viewMore>a").click();
		iimPlayCode('WAIT SECONDS=1');
	}
	let bai;
	if (first) { bai = bai1; } else { bai = 0; }
	first = false;
	try {
		while (true) {
			if (chuong == chuong2 && bai == bai2) { stop = true; return }
			let dom = "#" + id_c + " .lessonWrapper:nth-child(" + (++bai) + ")";
			if (window.document.querySelector(dom) == null) break;
			c["bai_" + bai] = {};
			let dom_b = window.document.querySelector(dom + " .lessonTitle");
			c["bai_" + bai]["name"] = dom_b.textContent.trim().replace(/[\/\\:*?"<>|]/g,'_');
			c["bai_" + bai]["link"] = dom_b.href.trim();
		}
		
	}
	catch (e) { return; }
}



function get_link_video() {
	while (window.document.getElementById('#####') != null) window.document.getElementById('#####').remove();
	while (window.document.getElementById('#####2') != null) window.document.getElementById('#####2').remove();
	
	input = window.document.createElement("input");  
	input.setAttribute("type","hidden"); 
	input.setAttribute("id","#####"); 
	input.setAttribute("src"," ");
	window.document.getElementsByTagName('body')[0].appendChild(input);
	
	script = window.document.createElement('script');
	script.setAttribute("id","#####2"); 
	script.innerHTML="document.getElementById('#####').src = player.src();";
	window.document.getElementsByTagName('body')[0].appendChild(script);
	while (window.document.getElementById('#####').src == " ") iimPlayCode("WAIT SECONDS=1");
	let link = window.document.getElementById('#####').src;
	while (window.document.getElementById('#####') != null) window.document.getElementById('#####').remove();
	while (window.document.getElementById('#####2') != null) window.document.getElementById('#####2').remove();
	if (link == window.location.href) return "NO_LINK";
    if (link.startsWith("https://v.tuyensinh247.com/")) {
        let src_v = link.substring(27, link.indexOf("?expires="));
        link = "https://s1.tuyensinh247.com:1443/ts247/_definst_/mp4:" + src_v + "/playlist.m3u8";
    }
	return link;
}


function download_btvn(url, path, name) {
	name = name.replace(/ /g, '<SP>');
	iimPlayCode('URL GOTO=about:newtab');;
	window.location.href = url;
	while (true) {
		iimPlayCode("ONDOWNLOAD FOLDER=" + path.replace(/ /g, '<SP>') + " FILE=" + name + " WAIT=NO");
		try { window.document.querySelector(".download_exam").click(); break; }
		catch (e) { iimPlayCode('SET !TIMEOUT_PAGE 1' + "\n" + 'WAIT SECONDS=1'); }
		if (window.document.readyState == 'complete') {
			write_data(path_save, "error.txt", path + name + " : Lỗi ko có PDF");
			break;
		}
	}
}


function download_video(url, path) {
	iimPlayCode('URL GOTO=about:newtab');
	iimPlayCode('URL GOTO=' + url);
	create_folder(path);
	while (window.document.querySelector(".btnShowVideoList") == null) iimPlayCode("WAIT SECONDS=1");
	let y = 0;
	while (true) {
		try {
			//show list video
			dom_list_video = window.document.querySelector(".btnShowVideoList");
			while(dom_list_video.style.display == "inline-block") {
				dom_list_video.click();
				iimPlayCode("WAIT SECONDS=1");
			}
	
			//play list video
			dom = ".listVideos>ul>li:nth-child(" + (++y) + ")";
			ten_video = window.document.querySelector(dom + ">p").textContent.trim().replace(/[\/\\:*?"<>|]/g,'_') + ".mp4";
			window.document.querySelector(dom).click();
			iimPlayCode("WAIT SECONDS=1");
			link_video = get_link_video();
			if (link_video == "NO_LINK") {
				write_data(path_save, "error.txt", path + ten_video + " : " + link_video);
			} else {
				write_data(path_list_download, "list_download.txt", path + ten_video + "|" + link_video);
			}
		} catch(e) { break };
	}
	
	//download pdf
	dom_document = window.document.querySelector(".documentNavigation>a:nth-child(3)");
	if (dom_document != null) {
		if (dom_document.textContent.trim() == 'Tải về') {
			iimPlayCode("ONDOWNLOAD FOLDER=" + path.replace(/ /g, '<SP>') + " FILE=Tài<SP>liệu.pdf" + " WAIT=NO");
			dom_document.click();
			iimPlayCode('WAIT SECONDS=1');
		}
	}

}


path_khoa_hoc = path_save + "\\" + khoa_hoc["name"] + "\\";
get_chuong(path_khoa_hoc);


while (khoa_hoc["chuong_" + (++chuongx)] != null) {
	name_chuong = khoa_hoc["chuong_" + (chuongx)]["name"];
	path_chuong = path_khoa_hoc + name_chuong + "\\";
	while (khoa_hoc["chuong_" + (chuongx)]["bai_" + (++baix)] != null) {
		name_bai = khoa_hoc["chuong_" + (chuongx)]["bai_" + (baix)]["name"];
		link_bai = khoa_hoc["chuong_" + (chuongx)]["bai_" + (baix)]["link"];
		if (link_bai.startsWith("https://tuyensinh247.com/bai-giang")) {
			download_video(link_bai, path_chuong + name_bai + "\\");
		} else {
			download_btvn(link_bai, path_chuong + name_bai + "\\", "BTVN.pdf");
		}
	}
	baix = 0;
}



iimPlayCode('URL GOTO=about:newtab');
window.location.href = "download://download";
iimPlayCode("WAIT SECONDS=60");
iimPlayCode("TAB CLOSE");
