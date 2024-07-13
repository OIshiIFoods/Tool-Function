const fs = require('fs')
const https = require('https')
const http = require('http')
const path = require('path')
const xlsx = require('xlsx')

/*
    思想：文件的增删改查，修改可以链式操作
    增加：复制文件，下载文件，创建目录
    删除：
    修改：文件位置，文件名称
    查看：获取指定目录的文件列表，读取文件内容，判断路径是否存在
*/
class FileOperation {
    constructor(filename, dir = './') {
        this.filename = filename
        this.dir = dir
    }

    /**
     * 重命名指定文件
     * @param {String} newName 文件新名称
     * @returns 当前实例
     */
    rename(newName) {
        fs.renameSync(this.dir + this.filename, this.dir + newName)
        return this
    }

    /**
     * 移动指定文件
     * @param {String} newDir 文件新路径
     * @returns 当前实例
     */
    moveFile(newDir) {
        fs.existsSync(newDir) || FileOperation.mkdirs(newDir)
        fs.renameSync(this.dir + this.filename, newDir + this.filename)
        return this
    }

    /**
     * 判断路径是否存在
     * @param {String} filePath 
     * @returns  boolean
     */
    static isPathExist(filePath) {
        try {
            fs.accessSync(filePath)
            return true
        } catch (err) {
            return false
        }
    }

    /**
     * 获取指定目录的文件列表
     * @param {String} dir 目录路径
     * @returns 返回文件列表，如果所传路径未指向目录，返回 false
     */
    static getFileListByDir(dir) {
        return fs.statSync(dir).isDirectory() ? fs.readdirSync(dir) : false
    }

    /**
     * 读取指定文件内容
     * @param {String} filePath 文件路径 
     * @returns {}
     */
    static readFileContent(filePath) {
        const canReadType = {
            xlsx: () => {
                const fileContent = xlsx.readFile(filePath); // 读取excel文件
                // 遍历excel每一张sheet的名字
                return fileContent.SheetNames.reduce((acc, name) => {
                    let sheet = fileContent.Sheets[name] // 获取指定sheet表中的数据
                    let jsonData = xlsx.utils.sheet_to_json(sheet) // 将数据转成 json 格式
                    acc[name] = jsonData
                    return acc
                }, {})
            }
        }
        let fileExt = path.parse(filePath).ext.slice(1)
        return canReadType[fileExt] ? canReadType[fileExt]() : false
    }

    /**
     * 创建指定路径文件夹
     * @param {String} dir 目录路径 
     * @returns 无
     */
    static mkdirs(dir) {
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
    static copyFile(srcPath, desPath) {
        fs.copyFileSync(srcPath, desPath, fs.constants.COPYFILE_EXCL)
    }

    /**
     * 下载文件到本地指定位置
     * @param {String} dir 文件路径 
     * @param {String} filename 文件名称
     * @param {String} url 文件资源url
     * @returns promise 实例对象
     */
    static downLoadFile(dir = './', filename = '' + new Date.now(), url = '') {
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
}