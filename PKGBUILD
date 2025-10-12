# Maintainer: ghhccghk <2137610394@qq.com>
pkgname=hydrogenmusic
pkgver=0.5.0
pkgrel=1
pkgdesc=""
arch=('x86_64')
url="https://hydrogen-music.org/"
license=('GPL')
depends=('glib2' 'gtk3' 'jack' 'alsa-lib' 'libsndfile' 'fftw' 'lv2')
makedepends=('cmake' 'git' 'pkg-config' 'gcc' 'make')
source=("https://github.com/hydrogen-music/hydrogen/releases/download/v${pkgver}/Hydrogen Music-${pkgver}-linux.pacman")
sha256sums=('SKIP') # 这里建议用实际 sha256sum 替换

package() {
    cd ${srcdir}
    tar -xvf "Hydrogen Music-${pkgver}-linux.pacman" -C ${pkgdir}
    # Remove exsiting files
    rm -f ${pkgdir}/.PKGINFO ${pkgdir}/.MTREE ${pkgdir}/.INSTALL
    # Make KDE happy :)
    echo 'Comment[zh_CN]=仿明日方舟工业风音乐播放器，支持添加曲绘' >>${pkgdir}/usr/share/applications/hydrogenmusic.desktop
    sed -i -E "s|Categories=Music;|Categories=Music;AudioVideo;Player;|" ${pkgdir}/usr/share/applications/hydrogenmusic.desktop
}
