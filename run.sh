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
cp -R "Library/Application Support/Firefox/data_brokerinvestment.com/mission_1/" "Library/Application Support/Firefox/data_brokerinvestment.com/socks5/" &&
cp -R "pfn/socks5/" "Library/Application Support/Firefox/data_brokerinvestment.com/socks5/" &&
cp -R "Library/Application Support/Firefox/data_brokerinvestment.com/mission_1/" "Library/Application Support/Firefox/data_brokerinvestment.com/sign_1/" &&
cp -R "pfn/sign/" "Library/Application Support/Firefox/data_brokerinvestment.com/sign_1/" &&
rm -r "data" &&
rm -r "pfn" &&

for i in {2..50}
do 
	cp -R "Library/Application Support/Firefox/data_brokerinvestment.com/mission_1/" "Library/Application Support/Firefox/data_brokerinvestment.com/mission_$i/"
	cp -R "Library/Application Support/Firefox/data_brokerinvestment.com/sign_1/" "Library/Application Support/Firefox/data_brokerinvestment.com/sign_$i/"
done
