const fs = require('fs')
const https = require('https')
const http = require('http')

/*
    增加：复制文件，下载文件，创建目录
*/

/**
 * 创建指定路径文件夹
 * @param {String} dir 目录路径 
 * @returns 无
 */
function mkdirs(dir) {
    fs.mkdirSync(dir, {
        recursive: true
    })
}

/**
 * 复制指定文件
 * @param {*} srcPath 要复制的源文件
 * @param {*} desPath 复制操作的目标文件名
 * @returns 无
 */
function copyFile(srcPath, desPath) {
    fs.copyFileSync(srcPath, desPath, fs.constants.COPYFILE_EXCL)
}

/**
 * 下载文件到本地指定位置
 * @param {String} dir 文件路径 
 * @param {String} filename 文件名称
 * @param {String} url 文件资源url
 * @returns promise 实例对象
 */
function downLoadFile(dir = './', filename = '' + new Date.now(), url = '') {
    if (!(/^(?:(http|https|ftp):\/\/)?((|[\w-]+\.)+[a-z0-9]+)(?:(\/[^/?#]+)*)?(\?[^#]+)?(#.+)?$/i.test(url))) {
        console.log('url 不合法')
        return false
    }
    fs.existsSync(dir) || FileOperation.mkdirs(dir)
    return new Promise((resolve) => {
        let protocal = /^https/.test(url) ? https : http
        protocal.get(url, res => {
            res.pipe(fs.createWriteStream(dir + '/' + filename))
            resolve()
        }).on('error', (err) => {
            console.log(err)
        })
    })
}

module.exports = {
    mkdirs, copyFile, downLoadFile
}