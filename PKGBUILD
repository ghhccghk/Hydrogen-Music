# Maintainer: ghhccghk <2137610394@qq.com>
pkgname=hydrogenmusic-git
pkgver=0.5.0
pkgrel=1
_pkgver=0.5.0
pkgdesc="Hydrogen Music - Modern music player built with Electron + Vite"
arch=('x86_64')
url="https://github.com/ghhccghk/Hydrogen-Music"
license=('MIT')
depends=('electron' 'nodejs')
makedepends=('npm' 'git' 'base-devel')
provides=('hydrogenmusic')
conflicts=('hydrogenmusic')
source=("git+https://github.com/ghhccghk/Hydrogen-Music.git")
sha256sums=('SKIP')

pkgver() {
    cd "$srcdir/Hydrogen-Music"
    # 自动生成版本号，例如 0.5.0.r23.gabcdef1
    git describe --tags --long 2>/dev/null | sed 's/^v//;s/-/.r/;s/-/./' || echo "0.5.0.r0"
}

build() {
    cd "$srcdir/Hydrogen-Music"
    npm install --ignore-scripts --no-audit --no-fund
    vite build && electron-builder --linux pacman
}

package() {
    cd "$srcdir/Hydrogen-Music/release/$_pkgver"
    tar -xvf "Hydrogen Music-${pkgver}-linux.pacman" -C ${pkgdir}
    # Remove exsiting files
    rm -f ${pkgdir}/.PKGINFO ${pkgdir}/.MTREE ${pkgdir}/.INSTALL
    # Make KDE happy :)
    echo 'Comment[zh_CN]=仿明日方舟工业风音乐播放器，支持添加曲绘' >>${pkgdir}/usr/share/applications/hydrogenmusic.desktop
    sed -i -E "s|Categories=Music;|Categories=Music;AudioVideo;Player;|" ${pkgdir}/usr/share/applications/hydrogenmusic.desktop
}
