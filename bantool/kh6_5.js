var x;
x2 = -1;

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
		x = 0;
		break;
	case '2':
        while(true) {
            bai_start = prompt('Nhập bài bắt đầu' + "\n" + 'Ví dụ nhập bài 2 là' + "\n" + '2');
            if (!isNumeric(bai_start)) {
                alert('Nhập không đúng vui lòng nhập lại');
                continue;
            }
            x = Number(bai_start)-1;
            break;
        }
        
        while(true) {
            bai_end = prompt('Nhập bài kết thúc' + "\n" + 'Ví dụ nhập bài 4 là' + "\n" + '4');
            if (!isNumeric(bai_end)) {
                alert('Nhập không đúng vui lòng nhập lại');
                continue;
            }
            x2 = Number(bai_end);
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
    return iimGetLastExtract().substr(0, iimGetLastExtract().length-32);
}

path_list_download = get_path_run() + "Data\\manager_download\\";
//title
write_data(path_list_download, "list_download.txt", "Download video tuyensinh247.com (" + new Date().getTime() + ")");
//so_luong
write_data(path_list_download, "list_download.txt", so_luong);


iimPlayCode('URL GOTO=about:newtab');
path_save = get_csv(1,1);
url_khoahoc = get_csv(2,1);





function get_bai(url) {
	iimPlayCode('URL GOTO=about:newtab');
	window.location.href = 'https://tuyensinh247.com/';	
	while (window.document.querySelector(".td-navbar-signup .avt-signup") == null) iimPlayCode("WAIT SECONDS=1");
	iimPlayCode('URL GOTO=' + url);
	while (window.document.querySelector(".listCourse") == null) iimPlayCode("WAIT SECONDS=1");
	i = 0;
	dom = ".listCourse>div:nth-child(" + (++i) + ")>div>a";
	list = [];
	while (true) {
		try {
			name_bai_hoc = window.document.querySelector(dom + ">span").textContent.trim().replace(/[\/\\:*?"<>|]/g,'_');
			link_bai_hoc = window.document.querySelector(dom).href;
			list.push( [name_bai_hoc, link_bai_hoc] );
			dom = ".listCourse>div:nth-child(" + (++i) + ")>div>a";
		} catch (e) { break; }
	}
	return list;
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
	return link;
}

list_bai = get_bai(url_khoahoc);
while (x < list_bai.length) {
	if (x == x2) break;
	iimPlayCode("URL GOTO=" + list_bai[x][1]);
	path_save_video = path_save + "\\" + list_bai[x][0] + "\\";
	create_folder(path_save_video);
	while (window.document.querySelector(".btnShowVideoList") == null) iimPlayCode("WAIT SECONDS=1");
	y = 0;
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
				write_data(path_save, "error.txt", path_save_video + ten_video + " : " + link_video);
			} else {
				write_data(path_list_download, "list_download.txt", path_save_video + ten_video + "|" + link_video);
			}
		} catch(e) { break };
	}
	
	//download pdf
	dom_document = window.document.querySelector(".documentNavigation>a:nth-child(3)");
	if (dom_document != null) {
		if (dom_document.textContent.trim() == 'Tải về') {
			iimPlayCode("ONDOWNLOAD FOLDER=" + path_save_video.replace(/ /g, '<SP>') + " FILE=*" + " WAIT=NO");
			dom_document.click();
			iimPlayCode('WAIT SECONDS=1');
		}
	}
	
	
	//download pdf btvn
	list_btvn = [];
	i = 0;
	while (true) {
		try { list_btvn.push(window.document.querySelector(".exerciseContent>p>a:nth-child(" + (++i) +")").href); }
		catch(e) {break;}
	}
	list_btvn.forEach(function(link){
		iimPlayCode('URL GOTO=about:newtab');
		window.location.href = link;
		while (true) {
			iimPlayCode("ONDOWNLOAD FOLDER=" + path_save_video.replace(/ /g, '<SP>') + " FILE=*" + " WAIT=NO");
			try { window.document.querySelector(".download_exam").click(); break; }
			catch (e) { iimPlayCode('SET !TIMEOUT_PAGE 1' + "\n" + 'WAIT SECONDS=1'); }
			iimPlayCode('WAIT SECONDS=1');
		}
	});
	
	
	x++;
}


iimPlayCode('URL GOTO=about:newtab');
window.location.href = "download://download";
iimPlayCode("WAIT SECONDS=60");
iimPlayCode("TAB CLOSE");
