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

switch(tinh_nang) {
	case '1':
		x = 0;
		y1 = 0;
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
            x = Number(chuong_bai_start[0]);
            y1 = Number(chuong_bai_start[1])-1;
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
	iimPlayCode("ONDOWNLOAD FOLDER=" + path + " FILE=" + name + " WAIT=NO");
	iimPlayCode('SET !TIMEOUT_PAGE 2592000' + "\n" + 'URL GOTO=' + url);
	iimPlayCode('WAIT SECONDS=1');
}



function script (text) {
	var k=window.document.createElement('script');
	k.innerHTML=text;
	window.document.getElementsByTagName('body')[0].appendChild(k);
}




all_request = 0;
function request_dom(url) {
	url = url.replace("https://hoc24h.vn", "");
	if ( all_request++ == 20 ) {
		all_request = 0;
		iimPlayCode('WAIT SECONDS=3');
	}
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



function get_result_exam(id, path) {
	path = path.replace(/ /g, '<SP>');
	create_folder(path);
	iimPlayCode('TAB OPEN' + "\n" + 'TAB T=2' + "\n" + 'URL GOTO=about:newtab');
	let url = 'https://hoc24h.vn/de-thi-truc-tuyen/' + id + '.html';
	window.location.href = url;
	while (window.document.querySelector(".examControl:nth-child(2)") == null) {
		iimPlayCode('WAIT SECONDS=1');
	}
	window.stop();
	let tm = window.document.querySelector(".examControl:nth-child(2)");
	if (tm.querySelector("a") == null) {
		script("payExam(1," + id + ");");
		while (window.document.querySelector(".test-bar") == null) {
			iimPlayCode('WAIT SECONDS=1');
		}
		window.stop();
		script("submit_exam(" + id + ",true);");
		while ( !window.location.href.startsWith("https://hoc24h.vn/ket-qua") ) {
			iimPlayCode('WAIT SECONDS=1');
		}
	} else {
		tm2 = tm.getElementsByClassName("text-center");
		if (tm2[tm2.length-1].textContent.trim() == "") {
			window.location.href = 'https://hoc24h.vn/vao-thi/' + id + '.html';
			while (window.document.querySelector(".test-bar") == null) {
				iimPlayCode('WAIT SECONDS=1');
			}
			window.stop();
			script("submit_exam(" + id + ",true);");
			while ( !window.location.href.startsWith("https://hoc24h.vn/ket-qua") ) {
				iimPlayCode('WAIT SECONDS=1');
			}
		}
		else { window.location.href = tm.querySelector("a").href; }
	}
	
	
	while (window.document.querySelector(".tab-pane.fade.in.active") == null) {
		iimPlayCode('WAIT SECONDS=1');
	}
	window.stop();
	de_pdf = window.document.querySelector(".list-information.list-unstyled a");
	if (de_pdf != null) {
		list_download.push( [de_pdf.href, path, "Đề thi.pdf"] );
	} else {
	    write_data(path_save, "error.txt", path + "Đề thi.pdf");
	}
	loi_giai = window.document.getElementsByClassName("btn btn-info btn-show-comment");
	for (let i = 0; i < loi_giai.length; i++) { loi_giai[i].click(); }
	try {
		window.document.querySelector("header").remove();
		window.document.querySelector("footer").remove();
		window.document.querySelector(".col-md-4").remove();
		window.document.querySelector("#wrapper .ng-scope").remove();
	} catch (e) {}
	
	//save image
	iimPlayCode(
		'SAVEAS TYPE=PNG FOLDER=' + path + ' FILE=Hướng<SP>dẫn<SP>giải.png' + "\n" +
		'TAB CLOSE' + "\n" + 
		'WAIT SECONDS=1'
	);
}



load = 0;
function adds_str() {
	if (load == 10) { load = 0; }
	load++;
	let t = "";
	for (i = 0; i < load; i++) { t += "."; }
	return t;
}

function get_video_pdf(dom_html, path) {
	create_folder(path);
	let dom_pdf = dom_html.querySelector(".header.header-lesson .pull-right>a");
	if (dom_pdf != null && dom_pdf.href != 'javascript:void(0);') {
		list_download.push( [dom_pdf.href, path, "Tài liệu.pdf"] );
	} else {
	    write_data(path_save, "error.txt", path + "Tài liệu.pdf");
	}
	window.document.getElementById("running").innerHTML = "Đang chạy " + adds_str();
	dom_videos = dom_html.querySelector(".content-lesson-left>ul").getElementsByTagName("li");
	for (let i = 0; i < dom_videos.length; i++) {
		let dom_info_video = dom_videos[i].querySelector("a");
		let name_video = dom_info_video.textContent.trim().replace(/[\/\\:*?"<>|]/g,'_');
		window.document.getElementById("video").innerHTML = name_video;
		if (!dom_info_video.href.endsWith("#")) {
			dom_html = request_dom("https://hoc24h.vn" + dom_info_video.href);
		}
		dom_video = dom_html.querySelector("video>source");
		if (dom_video != null) {
			list_download.push( ["https://hoc24h.vn" + dom_video.getAttribute("data-src"), path, (i+1) + "_" + name_video + ".mp4"] );
		} else {
		    write_data(path_save, "error.txt", path + (i+1) + "_" + name_video + ".mp4");
		}
		window.document.getElementById("running").innerHTML = "Đang chạy " + adds_str();
	}
	
}

//check login
function check_login(dom_html) {
	if (dom_html.querySelector(".header-login.dropdown") == null) {
		while (true) {
			if (window.document.querySelector(".header-login.dropdown") != null) break;
			iimPlayCode('WAIT SECONDS=1');
		}
		return false;
	} else { return true; }
}

function get_name_khoc_hoc(dom_html) {
	return dom_html.querySelector(".course-details__title").textContent.trim().replace(/[\/\\:*?"<>|]/g,'_');
}



first = true;
stop = false;

function get_chuong(dom_html, path) {
	chuong = dom_html.getElementsByClassName("list-collapse__item");
	while (x < chuong.length) {
		if (x > x2) { return; }
		let name_chuong = chuong[x].querySelector(".list-collapse__title").textContent.trim().replace(/[\/\\:*?"<>|]/g,'_');
		let path_chuong = path + name_chuong + "\\";
		window.document.getElementById("chuong").innerHTML = name_chuong;
		window.document.getElementById("bai").innerHTML = "";
		window.document.getElementById("video").innerHTML = "";
		create_folder(path_chuong);
		get_bai(chuong[x], path_chuong);
		if (stop) { return; }
		x++;
	};
}

function get_bai(dom_html, path) {
	bai = dom_html.getElementsByClassName("learn-outline-item");
	let y;
	if (first) { y = y1; } else { y = 0; }
	first = false;
	while (y < bai.length) {
		if (x == x2 && y == y2) { stop = true; return; }
		dom_info_bai = bai[y].querySelector(".learn-lesson-wr");
		let link_bai = "https://hoc24h.vn" + dom_info_bai.href;
		let name_bai = dom_info_bai.title.trim().replace(/[\/\\:*?"<>|]/g,'_');
		window.document.getElementById("bai").innerHTML = name_bai;
		window.document.getElementById("video").innerHTML = "";
		let path_bai = path + name_bai + "\\";
		if (bai[y].querySelector(".lesson-process-wr .fa.fa-pencil") == null) {
			let tm = link_bai.split(".");
			let link = "https://hoc24h.vn/xem-bai-giang-truc-tuyen.html?&id=" + tm[tm.length-3] + "&class_id=" + tm[tm.length-2];
			get_video_pdf(request_dom(link), path_bai);
		} else {
			get_result_exam(new window.URL(link_bai).searchParams.get("id"), path_bai);
		}
		y++;
	}
}


path_save = get_csv(1,1);
url_khoahoc = get_csv(2,1);

list_download = [];

iimPlayCode("URL GOTO=https://hoc24h.vn");
check_login(window.document.body);
dom_kh = request_dom(url_khoahoc);


window.stop();
window.document.title = "Download video hoc24h.vn";
window.document.body.innerHTML = '';


tag = window.document.createElement("div");  
tag.setAttribute("style","font-size:28px;"); 
tag.setAttribute("id","khoa_hoc"); 
window.document.body.appendChild(tag);

tag = window.document.createElement("div");  
tag.setAttribute("style","font-size:26px; text-indent:20px;"); 
tag.setAttribute("id","chuong"); 
window.document.body.appendChild(tag);

tag = window.document.createElement("div");  
tag.setAttribute("style","font-size:24px; text-indent:40px;"); 
tag.setAttribute("id","bai"); 
window.document.body.appendChild(tag);

tag = window.document.createElement("div");  
tag.setAttribute("style","font-size:22px; text-indent:60px;"); 
tag.setAttribute("id","video"); 
window.document.body.appendChild(tag);



tag = window.document.createElement("br");  
window.document.body.appendChild(tag);
tag = window.document.createElement("br");  
window.document.body.appendChild(tag);
tag = window.document.createElement("br");  
window.document.body.appendChild(tag);
tag = window.document.createElement("br");  
window.document.body.appendChild(tag);



tag = window.document.createElement("div");  
tag.setAttribute("style","font-size:30px;"); 
tag.setAttribute("id","running"); 
window.document.body.appendChild(tag);




name_khoa_hoc = get_name_khoc_hoc(dom_kh);
window.document.getElementById("khoa_hoc").innerHTML = name_khoa_hoc;
get_chuong(dom_kh, path_save + "\\" + name_khoa_hoc + "\\");






for (i = 0; i < list_download.length; i++) {
	//config media.play-stand-alone = false
	downloadURI(list_download[i][0], list_download[i][1], list_download[i][2]);
}
alert('Đã chạy xong.\nĐang download tất cả file');
