function get_csv(line, col) {
	iimPlayCode(
		'SET !DATASOURCE data.csv' + "\n" +
		'SET !DATASOURCE_LINE ' + line + "\n" +
		'SET !EXTRACT {{!COL' + col + '}}'
	);
	return iimGetLastExtract();
}


function update1(txt, name, value, addurl = '') {
	iimSet('value', value);
	iimPlayCode(
		'URL GOTO=https://m.facebook.com/nt/screen/?params=%7B%22page_id%22%3A' + id + '%2C%22entry_point%22%3A%22edit_page_info%22%7D&path=pages%2Finfo%2Foverview' + addurl + "\n" +
		'TAG POS=1 TYPE=DIV ATTR=DATA-NT:NT*TAP_ACTION_WRAPPER&&TXT:' + txt + "\n" +
		'TAG POS=1 TYPE=INPUT ATTR=NAME:' + name + ' CONTENT={{value}}'
	);
}

function check_save() {
	let x;
	while (true) {
		try {
			z = window.document.getElementById('root').innerHTML;
			x = z.indexOf('value="Lưu"');
			if (x == -1) throw "ERROR"
			break;
		} catch(e) { iimPlayCode('WAIT SECONDS=1'); }
	}
	z = z.slice( x );
	z = z.slice( z.indexOf('id="') + 4 );
	id_save = z.slice(0, z.indexOf('"'));
	window.document.getElementById(id_save).click();
	time = new Date().getTime();
	while (true) {
		if ( window.document.querySelector('body').innerHTML.indexOf('Đã lưu thay đổi') != -1 || new Date().getTime() - time > 5000 ) {
			break;
		}
		iimPlayCode('WAIT SECONDS=1');
		window.document.getElementById(id_save).click();
	}
}




function getid(name) {
	let x;
	while (true) {
		try {
			z = window.document.getElementById('facebook').innerHTML;
			x = z.indexOf('aria-label="' + name + '"');
			if (x == -1) throw "ERROR"
			break;
		} catch(e) { iimPlayCode('WAIT SECONDS=1'); }
	}
	
	z = z.slice( x );
	z = z.slice( z.indexOf('for="') + 5 );
	return z.slice( 0, z.indexOf('"') );
}


//function even_input(value) {
	//while (true) { try { temp = window.document.querySelector('#modalDialogView>DIV>DIV>INPUT').innerHTML; break;} catch (e) { iimPlayCode('WAIT SECONDS=1'); } }
	//iimPlayCode('WAIT SECONDS=1');
	//iimPlayCode('EVENTS TYPE=KEYPRESS SELECTOR="#modalDialogView>DIV>DIV>INPUT" CHARS="' + value + '"');
	//while (true) { try {window.document.querySelector("#nt-typeahead-results-view>DIV>DIV>DIV").click(); break;} catch (e) { iimPlayCode('WAIT SECONDS=1'); } }
//}




i = 1;

while (get_csv(++i,1) != '') {
	iimPlayCode('URL GOTO=about:newtab');


	var id = get_csv(i,1);
    var namepg_id = request("https://www.facebook.com/"+id);
    alert(namepg_id);
    namepg_id = namepg_id.slice( namepg_id.indexOf('URL=/') + 5 );
    namepg_id = namepg_id.slice( 0, namepg_id.indexOf('/') );
	
	
	
	
	
	
	window.location.href = 'https://www.facebook.com/'+ namepg_id +'/page/info/editing/?entry_point=comet&end_point=comet_left_nav_bar&interface=full_page';
	var id_address = getid('Tỉnh/Thành phố');
	if ( window.document.getElementById(id_address).value != 'Thành phố Hồ Chí Minh' ) {
		iimPlayCode(
			'SET !TIMEOUT_STEP 300' + "\n" +
			'TAG POS=1 TYPE=INPUT ATTR=ID:' + id_address + ' CONTENT=Thành<SP>phố<SP>Hồ<SP>Chí<SP>Minh' + "\n" +
			'TAG POS=1 TYPE=SPAN ATTR=TXT:Thành<SP>phố<SP>Hồ<SP>Chí<SP>Minh'
		);
	}
	
	
	
	
	
	//hạng mục
	//iimPlayCode(
		//'URL GOTO=https://m.facebook.com/nt/screen/?params=%7B%22page_id%22%3A' + id + '%2C%22entry_point%22%3A%22edit_page_info%22%7D&path=pages%2Finfo%2Foverview' + "\n" +
		//'TAG POS=1 TYPE=DIV ATTR=DATA-NT:NT*TAP_ACTION_WRAPPER&&TXT:*Hạng<SP>Mục*'
	//);
	//while (true) { try {z = window.document.getElementById('root').innerHTML; xx = z.indexOf('Thêm hạng mục'); if (xx == -1) {throw "ERROR";} break;} catch (e) { iimPlayCode('WAIT SECONDS=1'); } }
	//z = z.slice( xx );
	//z = z.slice( z.indexOf('id="') + 4 );
	//id_hm = z.slice(0, z.indexOf('"') );
	//window.document.getElementById(id_hm).click();
	
	//even_input("Dịch vụ cho vay tiền mặt");
	//check_save();
	
	
	
	
	
	//Thành phố
	//iimPlayCode(
		//'URL GOTO=https://m.facebook.com/nt/screen/?params=%7B%22page_id%22%3A' + id + '%2C%22entry_point%22%3A%22edit_page_info%22%7D&path=pages%2Finfo%2Foverview%2Flocation&state' + "\n" +
		//'TAG POS=1 TYPE=DIV ATTR=DATA-NT:NT*TAP_ACTION_WRAPPER&&TXT:*tỉnh/thành*phố*'
	//);
	//(true) { try {window.document.querySelector('form>div>div>div:nth-child(2)>div').click(); break;} catch (e) { iimPlayCode('WAIT SECONDS=1'); } }
	//even_input("Thành phố Hồ Chí Minh");
	//check_save();
	
	
	
	
	
	
	
	
	
	
	update1( '*ô*tả', 'blurb', get_csv(i,2) ); check_save();
	update1('*rang*eb*', 'website', get_csv(i,6) ); check_save();
	update1('*mail*', 'email', get_csv(i,5) ); check_save();
	
	
	
	//giờ
	iimPlayCode(
		'SET !TIMEOUT_STEP 3' + "\n" +
		'URL GOTO=https://m.facebook.com/nt/screen/?params=%7B%22page_id%22%3A' + id + '%2C%22entry_point%22%3A%22edit_page_info%22%7D&path=pages%2Finfo%2Foverview' + "\n" +
		'TAG POS=1 TYPE=DIV ATTR=DATA-NT:NT*TAP_ACTION_WRAPPER&&TXT:*Giờ*' + "\n" +
		'EVENT TYPE=CLICK SELECTOR="form>div>div>div:nth-child(2)>div>div>div:nth-child(2)>div" BUTTON=0'
	);
	check_save();
	
	
	
	
	
	
	
	
	
	
	//sdt
	iimPlayCode(
		'URL GOTO=https://m.facebook.com/nt/screen/?params=%7B%22page_id%22%3A' + id + '%2C%22entry_point%22%3A%22edit_page_info%22%7D&path=pages%2Finfo%2Foverview' + "\n" +
		'TAG POS=1 TYPE=DIV ATTR=DATA-NT:NT*TAP_ACTION_WRAPPER&&TXT:*ố*điện*hoại*'
	);
	
	while (true) { try {window.document.querySelector('form>div>div>div:nth-child(2)>div>div>div>img').click(); break;} catch (e) { iimPlayCode('WAIT SECONDS=1'); } }
	iimPlayCode(
		'WAIT SECONDS=2' + "\n" +
		'TAG POS=2 TYPE=DIV ATTR=TXT:Việt<SP>Nam<SP>(+84)' + "\n" +
		'TAG POS=1 TYPE=INPUT ATTR=NAME:phone CONTENT=' + get_csv(i,4)
	);
	check_save();
	
	
	
	update1('*đường/phố*', 'street', get_csv(i,3), '%2Flocation&state'); check_save();
	update1('*mã*bưu*chính*', 'zip', 710000, '%2Flocation&state'); check_save();
	
	window.location.href = 'https://www.facebook.com/'+ namepg_id +'/page/info/editing/?entry_point=comet&end_point=comet_left_nav_bar&interface=full_page';
	iimPlayCode(
		'SET !TIMEOUT_STEP 300' + "\n" +
		'TAG POS=1 TYPE=INPUT ATTR=ID:' + getid('Hạng mục') + ' CONTENT=Dịch<SP>vụ<SP>cho<SP>vay<SP>tiền<SP>mặt' + "\n" +
		'TAG POS=2 TYPE=SPAN ATTR=TXT:Dịch<SP>vụ<SP>cho<SP>vay<SP>tiền<SP>mặt'
	);
	
	iimPlayCode('WAIT SECONDS=3');
}
