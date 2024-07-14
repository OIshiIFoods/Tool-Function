const fs = require('fs')
const path = require('path')
const xlsx = require('xlsx')

/*
    查看：获取指定目录的文件列表，读取文件内容，判断路径是否存在
*/

/**
* 判断路径是否存在
* @param {String} filePath 
* @returns  boolean
*/
function isPathExist(filePath) {
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
function getFileListByDir(dir) {
    return fs.statSync(dir).isDirectory() ? fs.readdirSync(dir) : false
}

/**
 * 读取指定文件内容
 * @param {String} filePath 文件路径 
 * @returns {} | @returns String
 */
function readFileContent(filePath) {
    const extMap = {
        txt: 'txt',
        html: 'txt',
        css: 'txt',
        js: 'txt',
        ts: 'txt',
        json: 'txt',
        vue: 'txt',
        xlsx: 'xlsx'
    }
    const readMethodMap = {
        xlsx: () => {
            const fileContent = xlsx.readFile(filePath); // 读取excel文件
            // 遍历excel每一张sheet的名字
            return fileContent.SheetNames.reduce((acc, name) => {
                let sheet = fileContent.Sheets[name] // 获取指定sheet表中的数据
                let jsonData = xlsx.utils.sheet_to_json(sheet) // 将数据转成 json 格式
                acc[name] = jsonData
                return acc
            }, {})
        },
        txt: () => {
            return '' + fs.readFileSync(filePath, 'utf-8')
        }
    }
    let fileExt = path.parse(filePath).ext.slice(1)
    fileExt = extMap[fileExt] ?? fileExt
    return readMethodMap[fileExt] ? readMethodMap[fileExt]() : false
}

module.exports = {
    isPathExist,
    getFileListByDir,
    readFileContent,
}