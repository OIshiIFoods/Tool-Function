const fs = require('fs')

/*
    思想：修改可以链式操作
    修改：文件位置，文件名称
*/

class FileModify {
    constructor(filename, dir = '.') {
        this.filename = filename
        this.dir = dir + '/'
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
}

module.exports = FileModify