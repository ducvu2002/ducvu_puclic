iimPlayCode('URL GOTO=about:newtab');
path_save = get_csv(1,1);
url_khoahoc = get_csv(2,1);
id_khoa_hoc = new window.URL(url_khoahoc).searchParams.get("id");
url_khoahoc = "https://chuvanbien.vn/course/learn?id=" + id_khoa_hoc;

var muc, chuong1;
var muc2 = -1;
var chuong2 = -1;

function isNumeric(str) {
	if (typeof str != "string") return false // we only process strings!  
	return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
	 !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

while (true) {
	tinh_nang = prompt('Menu : ' + "\n" + '1. Download Hết' + "\n" + '2. Download tùy chọn');
	if (tinh_nang == null) break;
	if (tinh_nang == '1' || tinh_nang == '2') break;
	alert('Nhập không đúng vui lòng nhập lại');
}

switch(tinh_nang) {
	case '1':
		muc = 0;
		chuong1 = 0;
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
	            muc = Number(chuong_bai_start[0])-1;
	            chuong1 = Number(chuong_bai_start[1])-1;
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
	            muc2 = Number(chuong_bai_end[0]);
	            chuong2 = Number(chuong_bai_end[1]);
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



function decodeHTML(text) {
	var textArea = window.document.createElement('textarea');
	textArea.style.display = "none";
	textArea.innerHTML = text;
	let data = textArea.value;
	textArea.remove();
	return data;
}

function get_url_video(url) {
	var req = new window.XMLHttpRequest();
	req.open('GET', url, false);
	req.send(null);
	let tm = req.responseText;
	
	url_Params = new window.URL(url);
	id = url_Params.searchParams.get("video_id");
	var req = new window.XMLHttpRequest();
	req.open('HEAD', 'https://chuvanbien.vn/video.php?id=' + id, false);
	req.setRequestHeader('Range', 'bytes=0-');
	req.send(null);
	return req.getResponseHeader("location");
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

function create_folder(path) {
	path = path.replace(/ /g, '<SP>');
	iimPlayCode('ONDOWNLOAD FOLDER=' + path + ' FILE=*');
}

function downloadURI(url, path, name) {
	url = url.replace(/ /g, '<SP>');
	path = path.replace(/ /g, '<SP>');
	name = name.replace(/ /g, '<SP>');
	
	iimPlayCode('SET !TIMEOUT_PAGE 1' + "\n" + 'URL GOTO=about:newtab');
	iimPlayCode('SET !TIMEOUT_PAGE 2592000' + "\n" + 'URL GOTO=' + url);
	iimPlayCode("ONDOWNLOAD FOLDER=" + path + " FILE=" + name + " WAIT=NO");
	iimPlayCode('WAIT SECONDS=5');
	iimPlayCode("ONDOWNLOAD FOLDER=" + path + " FILE=" + name + " WAIT=NO");
	iimPlayCode('WAIT SECONDS=1');
}

function get_muc(path) {
	while(true) {
		let dom = ".course-chapter:nth-child(" + (++muc) + ")";
		if (window.document.querySelector(dom) == null) break;
		let pathx = path + window.document.querySelector(dom + " .chapter-title").textContent.trim().replace(/[\/\\:*?"<>|]/g,'_') + '\\';
		create_folder(pathx);
		get_chuong(pathx, dom);
		if (stop) return;
	}
}

first = true;
function get_chuong(path, dom_m, loop = 1) {
	let space = new RegExp(decodeURIComponent('%C2%A0'), "g");
	let chuong;
	if (first) { chuong = chuong1; } else { chuong = 0; }
	first = false;
	try {
		let id_lession = window.document.querySelector(dom_m + " .tree-lessons").id;
		while(true) {
			if (loop == 1 && muc == muc2 && chuong == chuong2) { stop = true; return; }
			let dom = "#" + id_lession + ">li:nth-child(" + (++chuong) + ")";
			if (window.document.querySelector(dom) == null) break;
			let name = window.document.querySelector(dom + ">a") != null ? window.document.querySelector(dom + ">a") : window.document.querySelector(dom + ">div");
			let namex = name.textContent.replace(space, ' ').trim().replace(/[\/\\:*?"<>|]/g,'_').replace('  Bấm vào đây   Đề   Giải chi tiết', '').replace('tải BT', '').trim() + "\\";
			if (namex.startsWith("(")) {
				namex = namex.substr(namex.indexOf(")") + 2);
			}
			let pathx = path + namex;
			create_folder(pathx);

			let data_name = name.innerHTML;
			while (data_name.indexOf('href="') != -1) {
				data_name = data_name.substr(data_name.indexOf('href="../../') + 12);
				link = decodeHTML(data_name.substr(0, data_name.indexOf('"')));
				if (link.startsWith("files")) {
					list_download.push( ["https://chuvanbien.vn/" + link, pathx, "*"] );
				}
				if (link.startsWith("course")) {
					write_data(pathx, "video giải.txt", "https://chuvanbien.vn/" + link);
				}
			}


			if (window.document.querySelector(dom + " .tree-lessons>li") != null) {
				get_chuong(pathx, dom, 2);
			} else get_bai(pathx, dom);
		}
	} catch(e) { return }
}


load = 0;
function adds_str() {
	if (load == 10) { load = 0; }
	load++;
	let t = "";
	for (i = 0; i < load; i++) { t += "."; }
	return t;
}

function get_bai(path, dom_c) {
	let bai = 0;
	try {
		let id_bai = window.document.querySelector(dom_c + " .tree-videos").id;
		while(true) {
		    window.document.title = "Đang chạy " + adds_str();
			let dom = "#" + id_bai + ">li:nth-child(" + (++bai) + ")>a";
			if (window.document.querySelector(dom) == null) break;
			let name_video = window.document.querySelector(dom).textContent.trim().replace(/[\/\\:*?"<>|]/g,'_') + ".mp4";
			let link_video = get_url_video(window.document.querySelector(dom).href.trim());
			if (link_video != null) {
				list_download.push( [link_video, path, name_video] );
			} else {
				write_data(path_save, "error.txt", path + name_video);
			}
		}
	} catch(e) { return }
}





iimPlayCode('URL GOTO=' + url_khoahoc);
while (window.document.querySelector("#primary-nav-collapse>ul>li:last-child").textContent.trim() == "Đăng nhập") { iimPlayCode('WAIT SECONDS=1'); }
if (window.location.href != url_khoahoc) { window.stop(); iimPlayCode('URL GOTO=' + url_khoahoc); }
while (window.document.querySelector(".course-chapter") == null) { iimPlayCode('WAIT SECONDS=1'); }

khoa_hoc = window.document.querySelector(".title").textContent.trim().replace(/[\/\\:*?"<>|]/g,'_') + '\\';
create_folder(path_save + "\\" + khoa_hoc);

list_download = [];
stop = false;


get_muc(path_save + "\\" + khoa_hoc);


for (i = 0; i < list_download.length; i++) {
	//config media.play-stand-alone = false
	downloadURI(list_download[i][0], list_download[i][1], list_download[i][2]);
}
alert('Đã chạy xong.\nĐang download tất cả file');
