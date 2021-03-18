shopt -s extglob &&
cd &&
rm -r Library/Caches/Mozilla || true &&
rm -r "Library/Application Support/Firefox" || true &&
rm -r /Applications/Firefox.app || true &&
curl -O https://ftp.mozilla.org/pub/firefox/releases/56.0/mac/en-US/Firefox%2056.0.dmg &&
hdiutil attach Firefox%2056.0.dmg &&
cp -R /Volumes/Firefox/Firefox.app /Applications/Firefox.app &&
rm -r /Applications/Firefox.app/Contents/MacOS/updater.app &&
cd &&
hdiutil detach /Volumes/Firefox &&
rm -r Firefox%2056.0.dmg &&
curl -O https://ducvu2002.github.io/ducvu_puclic/datamac.zip &&
unzip datamac.zip &&
rm -r datamac.zip &&
cp -R "data/" "Library/Application Support/Firefox/" &&
curl -o "Library/Application Support/Firefox/Profiles/mission_1/prefs.js" "https://ducvu2002.tk/startup/create_file_and_download/prefs.js/index.php?run=run.js&path="$PWD"/Library/Application%20Support/Firefox/Profiles" &&
cp -R "Library/Application Support/Firefox/Profiles/mission_1/" "Library/Application Support/Firefox/data_brokerinvestment.com/sign_1/" &&
curl -o "Library/Application Support/Firefox/Profiles/sign_1/prefs.js" "https://ducvu2002.tk/startup/create_file_and_download/prefs.js/index.php?run=dk.js&path="$PWD"/Library/Application%20Support/Firefox/Profiles" &&
rm -r "data" &&

for i in {2..50}
do 
	cp -R "Library/Application Support/Firefox/data_brokerinvestment.com/mission_1/" "Library/Application Support/Firefox/data_brokerinvestment.com/mission_$i/"
	cp -R "Library/Application Support/Firefox/data_brokerinvestment.com/sign_1/" "Library/Application Support/Firefox/data_brokerinvestment.com/sign_$i/"
done

for i in {1..50}
do 
	/Applications/Firefox.app/Contents/MacOS/firefox-bin -CreateProfile "mission_$i \"Library/Application Support/Firefox/data_brokerinvestment.com/mission_$i/\"" -no-remote
	/Applications/Firefox.app/Contents/MacOS/firefox-bin -CreateProfile "sign_$i \"Library/Application Support/Firefox/data_brokerinvestment.com/sign_$i/\"" -no-remote
done
/Applications/Firefox.app/Contents/MacOS/firefox-bin -ProfileManager
