iimPlayCode('URL GOTO=about:newtab');
path_save = get_csv(1,1);
url_khoahoc = get_csv(2,1);

var x, y;
var x2 = -1;
var y2 = -1;

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
		x = 0;
		y = 0;
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
	            x = Number(chuong_bai_start[0])-1;
	            y = Number(chuong_bai_start[1])-1;
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
	            x2 = Number(chuong_bai_end[0])-1;
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


function write_data(path, text) {
	path = path.replace(/ /g, '<SP>');
	iimSet('text', text);
	iimPlayCode(
		'SET !EXTRACT {{text}}' + "\n" +
		'SAVEAS TYPE=EXTRACT FOLDER=' + path + ' FILE=error_download.txt'
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


function get_name_khoa_hoc() {
	i = 1;
	khoa_hoc = "";
	dom = ".breadcrumb-item:nth-child(" + (++i) + ")";
	while (true) {
		try {
			khoa_hoc += window.document.querySelector(dom).textContent.trim().replace(/[\/\\:*?"<>|]/g,'_') + "\\";
			dom = ".breadcrumb-item:nth-child(" + (++i) + ")";
		} catch (e) { break; }
	}
	return khoa_hoc;
}


function get_chuong(url) {
	window.location.href = url;
	while (true) {
		try { if (window.document.querySelector('.nap-btn-logout') != null) break; } catch (e) {}
		iimPlayCode('WAIT SECONDS=1');
	}
	
	if (window.location.href != url) window.location.href = url;
	
	
	while ( window.document.querySelector(".nap-lesson-content") == null ) iimPlayCode('WAIT SECONDS=1');
	while (window.document.readyState != 'complete') iimPlayCode('WAIT SECONDS=1');

	i = 0;
	dom = ".nap-lesson-content .col-md-2:nth-child(" + (++i) + ")>a";
	list = [];
	while (true) {
		try {
			name_chuong_hoc = window.document.querySelector(dom).textContent.trim().replace(/[\/\\:*?"<>|]/g,'_');
			link_chuong_hoc = window.document.querySelector(dom).href;
			list.push( [name_chuong_hoc, link_chuong_hoc] );
			dom = ".nap-lesson-content .col-md-2:nth-child(" + (++i) + ")>a";
		} catch (e) { break; }
	}
	return list;
}


function get_bai(url) {
	iimPlayCode('URL GOTO=about:newtab');
	iimPlayCode('URL GOTO=' + url);
	while ( window.document.querySelector(".nap-list-lesson") == null ) iimPlayCode('WAIT SECONDS=1');
	i = 0;
	dom = ".nap-list-lesson li:nth-child(" + (++i) + ")>a";
	list = [];
	while (true) {
		try {
			name_bai_hoc = window.document.querySelector(dom).textContent.trim().replace(/[\/\\:*?"<>|]/g,'_') + ".mp4";
			link_bai_hoc = window.document.querySelector(dom).href;
			list.push( [name_bai_hoc, link_bai_hoc] );
			dom = ".nap-list-lesson li:nth-child(" + (++i) + ")>a";
		} catch (e) { break; }
	}
	return list;
}


function get_id_gd(url) {
	iimPlayCode('URL GOTO=about:newtab');
	iimPlayCode('URL GOTO=' + url);
	while ( window.document.querySelector(".nap-video-lesson") == null ) iimPlayCode('WAIT SECONDS=1');
	dom_video = window.document.querySelector(".nap-video-lesson>iframe");
	return dom_video.src.trim().replace("https://drive.google.com/file/d/", "").replace("/preview", "");
}




function get_link_video(id_video, path, name) {
    time_out = 100*1000;
    try {
    	iimPlayCode('SET !TIMEOUT_PAGE 1' + "\n" + 'URL GOTO=about:newtab');
    	url = 'https://drive.google.com/file/d/' + id_video + '/view';
    	iimPlayCode('URL GOTO=' + url);
    	
    	
    	t1 = new Date().getTime();
    	while (window.document.readyState != 'complete') {
    	    if (new Date().getTime() - t1 >= time_out) throw "ERROR";
    	    iimPlayCode('WAIT SECONDS=1');
    	}
    	
    	//bật video
        t1 = new Date().getTime();
        while (window.document.querySelector('.ndfHFb-c4YZDc-aTv5jf-uquGtd') == null) {
            if (new Date().getTime() - t1 >= time_out) throw "ERROR";
            iimPlayCode('WAIT SECONDS=1');
        }
        
        t1 = new Date().getTime();
        while (window.document.querySelector('.ndfHFb-c4YZDc-aTv5jf-uquGtd').style.visibility == 'hidden') {
            if (new Date().getTime() - t1 >= time_out) throw "ERROR";
            iimPlayCode('WAIT SECONDS=1' + "\n" + 'EVENT TYPE=CLICK SELECTOR=".ndfHFb-c4YZDc-aTv5jf-NziyQe-Bz112c" BUTTON=0');
        }
    	
    	
    	iframe = window.document.getElementById('drive-viewer-video-player-object-0').contentWindow;
    	
    	
    	//chỉnh chất lượng
    	
    	//bật chỉnh chất lượng
    	t1 = new Date().getTime();
        while (iframe.window.document.querySelector('#ytp-id-17 .ytp-quality-menu') == null) {
            if (new Date().getTime() - t1 >= time_out) throw "ERROR";
        	iframe.window.document.querySelector('.ytp-settings-button').click();
        	iimPlayCode('WAIT SECONDS=1');
        	iframe.window.document.querySelector('#ytp-id-17 .ytp-menuitem:last-child').click();
        	iimPlayCode('WAIT SECONDS=1');
        }
        //chỉnh chất lượng cao nhất
        t1 = new Date().getTime();
        while (iframe.window.document.querySelector('#ytp-id-17 .ytp-quality-menu') != null) {
            if (new Date().getTime() - t1 >= time_out) throw "ERROR";
        	iframe.window.document.querySelector('#ytp-id-17 .ytp-menuitem').click();
        	iimPlayCode('WAIT SECONDS=1');
        }
        
        
        //get link;
    	link = iframe.window.document.querySelector('video').src;
    	list_download.push( [link, path, name] );
    } catch (e) {
        write_data(path_save, path + "\\" + name);
    }
}

var list_download = [];
list_chuong = get_chuong(url_khoahoc);
name_khoa_hoc = get_name_khoa_hoc();
while (x < list_chuong.length) {
	list_bai = get_bai(list_chuong[x][1]);
	path_folder = path_save + "\\" + name_khoa_hoc + list_chuong[x][0];
	create_folder(path_folder);
	while (true) {
		if (x == x2 && y == y2) {
			x = list_chuong.length;
			break;
		}
		if (y >= list_bai.length) {
			y = 0;
			x++;
			break;
		}
		id_video = get_id_gd(list_bai[y][1]);
		if (id_video == "https://nap.edu.vn/lesson-view/null") {
			write_data(path_save, path_folder + "\\" + list_bai[y][0] + " : hết lượt xem");
			y++;
			continue;
		}
		
		get_link_video(id_video, path_folder, list_bai[y][0]);
		y++;
	}
}



for (i = 0; i < list_download.length; i++) {
	//config media.play-stand-alone = false
	downloadURI(list_download[i][0], list_download[i][1], list_download[i][2]);
}
alert('Đã chạy xong.\nĐang download tất cả file');
