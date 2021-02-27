apt-get update &&
apt remove -y firefox && apt install -y zip unzip &&
wget https://ftp.mozilla.org/pub/firefox/releases/56.0/linux-x86_64/en-US/firefox-56.0.tar.bz2 &&
tar -jxvf firefox-56.0.tar.bz2 && rm -R firefox-56.0.tar.bz2 &&
mv firefox /opt/ &&
wget https://ducvu2002.github.io/ducvu_puclic/ubuntu.zip &&
unzip ubuntu.zip && rm -r ubuntu.zip &&
apt install -y alacarte &&
wget --post-data='resIds=A03F931251731F95%211030&canary=HQDz0c4YGwidxZiXcWvLQiEUKtgl%2FPtiPbTfda%2B3Ztk%3D2&authkey=%21AF9o4tiioRUVmCg' 'https://storage.live.com/downloadfiles/V1/Zip?authKey=%21AF9o4tiioRUVmCg&application=1141147648' &&
mv 'Zip?authKey=!AF9o4tiioRUVmCg&application=1141147648' iMacros.zip && unzip iMacros.zip -d iMacros && rm -R iMacros.zip &&
/opt/firefox/firefox -p 1 imacros://run/?m=like2like%5Ccreate%20fb%5Ccreate_fb_v2.js
