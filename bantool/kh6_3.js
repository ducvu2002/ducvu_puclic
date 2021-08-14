function get_csv(line, col) {
	iimPlayCode(
		'SET !DATASOURCE data.csv' + "\n" +
		'SET !DATASOURCE_LINE ' + line + "\n" +
		'SET !EXTRACT {{!COL' + col + '}}'
	);
	return iimGetLastExtract();
}


function write_data(path, name_file, text) {
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
write_data(path_list_download, "list_download.txt", "Download video luyenthitop.vn (" + new Date().getTime() + ")");

iimPlayCode('URL GOTO=about:newtab');
path_save = get_csv(1,1);
url_khoahoc = get_csv(2,1);

window.location.href = url_khoahoc;
while (true) {
	try { if (window.document.querySelector('#header_links>li:last-child>a').textContent == "Đăng xuất") break; } catch (e) {}
	iimPlayCode('WAIT SECONDS=1');
}

if (window.location.href != url_khoahoc) window.location.href = url_khoahoc;
while (window.document.querySelector('video') == null) {
	try {
		if ( window.document.querySelector('.ant-result-title').textContent == "Bạn đã xem hết lượt xem của video này" ) break;
	} catch (e) {}
	iimPlayCode('WAIT SECONDS=1');
}


function get_link_video() {	
	while (window.document.querySelector('video') == null) {
		try {
			if ( window.document.querySelector('.ant-result-title').textContent == "Bạn đã xem hết lượt xem của video này" ) return "hết lượt xem";
		} catch (e) {}
		iimPlayCode('WAIT SECONDS=1');
	}
	
	window.document.querySelector('video').play();
	while (window.document.querySelector('video').currentTime == 0) iimPlayCode('WAIT SECONDS=1');
	
	if ( !window.document.querySelector('video').src.startsWith('blob:') ) return window.document.querySelector('video').src;
	iimPlayCode('WAIT SECONDS=1');
	
	

	var capture_resource = window.performance.getEntriesByType("resource");
	window.performance.clearResourceTimings();
	for (var i = 0; i < capture_resource.length; i++) {
		let link = capture_resource[i].name;
		if (link.indexOf("video-reviews/m3u8/") == -1 && link.indexOf(".m3u8") != -1) { //type xmlhttprequest
			return link;
		}
	}
	return "NO_LINK";
}




i = 1;
j = 0;
dom = '.section:nth-child(' + (++i) + ')';
first = true;
khoa_hoc = window.document.querySelector('.course-detail-title').textContent.trim().replace(/[\/\\:*?"<>|]/g,'_');
while (window.document.querySelector(dom) != null) {
	link_current = window.location.href;
	while ( window.document.querySelector(dom + ">ul") == null ) {
		window.document.querySelector(dom + " .section-right-name").click();
		iimPlayCode('WAIT SECONDS=1');
	}
	try {
		chuyen_de = window.document.querySelector(dom + ' .name').textContent.trim().replace(/[\/\\:*?"<>|]/g,'_');
		dom_video = window.document.querySelector(dom + '>ul>li:nth-child(' + (++j) + ') .scorm-right-link');
		ten_bai = dom_video.textContent.trim().replace(/[\/\\:*?"<>|]/g,'_') + '.mp4';
		dom_video.click();
		iimPlayCode('WAIT SECONDS=1');
		status_error = null;
		while (window.location.href == link_current) {
			status_error = window.document.querySelector('.ant-modal-confirm-title');
			if ( status_error != null ) break;
			iimPlayCode('WAIT SECONDS=1');
		}
		if ( status_error == null ) { 
			link_video = get_link_video();
			path_save_video = path_save + "\\" + khoa_hoc + "\\" + chuyen_de + "\\" + ten_bai;
			if (link_video == "NO_LINK" || link_video == "hết lượt xem") {
				write_data(path_save, "error.txt", path_save_video + " : " + link_video);
			} else {
				write_data(path_list_download, "list_download.txt", path_save_video + "|" + link_video);
			}
		} else {
			error = status_error.textContent.trim();
			path_save_video = path_save + "\\" + khoa_hoc + "\\" + chuyen_de + "\\" + ten_bai;
			write_data(path_save, "error.txt", error);
			break;
		}
		
	} catch(e) {
		dom = '.section:nth-child(' + (++i) + ')';
		j = 0;
	}
	if (first) { dom = '.section:nth-child(' + (--i) + ')'; first = false; }
}

iimPlayCode('URL GOTO=about:newtab');
window.location.href = "download://download";
iimPlayCode("WAIT SECONDS=5");
iimPlayCode("TAB CLOSE");
