iimPlayCode('URL GOTO=https://accounts.google.com/');
while (window.location.href.indexOf('https://myaccount.google.com') != 0) iimPlayCode('WAIT SECONDS=1');

iimPlayCode('URL GOTO=about:newtab');


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



function downloadURI(url, path, name) {
    url = url.replace(/ /g, '<SP>');
    path = path.replace(/ /g, '<SP>');
    name = name.replace(/ /g, '<SP>');
	iimPlayCode('SET !TIMEOUT_PAGE 1' + "\n" + 'URL GOTO=about:newtab');
	iimPlayCode("ONDOWNLOAD FOLDER=" + path + " FILE=" + name + " WAIT=NO");
	iimPlayCode('SET !TIMEOUT_PAGE 2592000' + "\n" + 'URL GOTO=' + url);
	iimPlayCode('WAIT SECONDS=1');
	return;

	
	//iimPlayCode('URL GOTO=about:newtab');
	//iimPlayCode("ONDOWNLOAD FOLDER=" + path + " FILE=" + name + " WAIT=YES");

	//download
	//var link = window.document.createElement("a");
	//link.style.display = 'none';
	//link.download = name;
	//link.href = url;
	//window.document.body.appendChild(link);
	//link.click();
	//window.document.body.removeChild(link);
	//delete link;
	//iimPlayCode('SET !TIMEOUT_PAGE 864000' + "\n" + 'WAIT SECONDS=1');
}


function check_downloaded(path) {
	iimPlayCode('SET !DATASOURCE ' + path);
	return iimGetErrorText().indexOf('Data source file does not exist') == -1
}


var list_download = [];

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
        d = new Date();
        time_current = ('0' + (d.getDay()+1)).slice(-2) + "/" + ('0' + (d.getMonth()+1)).slice(-2) + "/" + d.getFullYear() + " " + d.getHours() + "h" + d.getMinutes() + "min" + d.getSeconds() + "s";
        path_main = get_csv(2,1).replace(/ /g, '<SP>');
        write_data(path_main, time_current + " : " + path.replace(path_main, "") + name);
    }
}



function folder_query_video(id_folder, path) {
	iimPlayCode('URL GOTO=about:newtab');
	url = 'https://drive.google.com/drive/folders/' + id_folder;
	iimPlayCode('URL GOTO=' + url);
	while (window.document.readyState != 'complete') iimPlayCode('WAIT SECONDS=1');
	let name = "";
	while (true) {
	    try {
	        name = window.document.querySelector(".o-Yc-Wb .o-Yc-o:last-child>div").getAttribute("data-tooltip");
	        break;
	    } catch (e) {
	        iimPlayCode('WAIT SECONDS=1');
	    }
	}
	t1 = new Date().getTime();
	while (name == 'Thư mục') {
	    if (new Date().getTime() - t1 >= 10000) {
	        name = 'Thư mục';
	        break;
	    }
	    try {
	        name = window.document.querySelector(".o-Yc-Wb .o-Yc-o:last-child>div").getAttribute("data-tooltip");
	        break;
	    } catch (e) {
	        iimPlayCode('WAIT SECONDS=1');
	    }
	}
	
	name = name.replace(/[\/\\:*?"<>|]/g,'_').replace(/ /g, '<SP>') + '\\';
	iimPlayCode('ONDOWNLOAD FOLDER=' + path + name + ' FILE=*');
	let data_bucketnames = window.document.querySelector('.NtzyH').getAttribute('data-bucketnames');
	let i = 0;
	let list_folder = [];
	let list_video = [];
	if (data_bucketnames.indexOf('Thư mục') != -1) {
		i++;
		let j = 1;
		dom = '.NtzyH .Zz99o:nth-child(' + i + ') .iZmuQc .pmHCK:nth-child(' + j + ') > div';
		while (window.document.querySelector(dom) != null) {
			list_folder.push( window.document.querySelector( dom ).getAttribute('data-id') );
			j++;
			dom = '.NtzyH .Zz99o:nth-child(' + i + ') .iZmuQc .pmHCK:nth-child(' + j + ') > div';
		}
	}
	
	if (data_bucketnames.indexOf('Tệp') != -1) {
		i++;
		let j = 1;
		dom = '.NtzyH .Zz99o:nth-child(' + i + ') .iZmuQc .pmHCK:nth-child(' + j + ') > div';
		while (window.document.querySelector(dom) != null) {
			if (window.document.querySelector( dom + ' .l-u-Ab-zb-c' ).src.indexOf('https://drive-thirdparty.googleusercontent.com/128/type/video/') != -1) {
				list_video.push( [window.document.querySelector( dom ).getAttribute('data-id'), window.document.querySelector(dom + " .Q5txwe").getAttribute("data-tooltip").replace(/[\/\\:*?"<>|]/g,'_').replace(/ /g, '<SP>') + '.mp4'] );
			}
			//if (window.document.querySelector( dom + ' .l-u-Ab-zb-c' ).src.indexOf('https://drive-thirdparty.googleusercontent.com/128/type/application/pdf') != -1) {
			else {
			    list_download.push( ["https://drive.google.com/uc?export=download&id=" + window.document.querySelector( dom ).getAttribute('data-id') , path + name, window.document.querySelector(dom + " .Q5txwe").getAttribute("data-tooltip").replace(/[\/\\:*?"<>|]/g,'_').replace(/ /g, '<SP>')] );
			}
			j++;
			dom = '.NtzyH .Zz99o:nth-child(' + i + ') .iZmuQc .pmHCK:nth-child(' + j + ') > div';
		}
	}
	
	list_folder.forEach(function(ij){
		folder_query_video(ij, path + name);
	});
	
	list_video.forEach(function(ij){
		get_link_video(ij[0], path + name, ij[1]);
	});
}

folder_query_video(get_csv(1,1), get_csv(2,1).replace(/ /g, '<SP>'));



for (i = 0; i < list_download.length; i++) {
	//config media.play-stand-alone = false
	downloadURI(list_download[i][0], list_download[i][1], list_download[i][2]);
}
alert('Đã chạy xong.\nĐang download tất cả file');
