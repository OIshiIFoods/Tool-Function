const fileAdd = require('./modules/fileAdd')
const fileDelete = require('./modules/fileDelete')
const FileModify = require('./modules/fileModify')
const fileView = require('./modules/fileView')

/*
    思想：文件的增删改查，修改可以链式操作
    增加：复制文件，下载文件，创建目录
    删除：
    修改：文件位置，文件名称
    查看：获取指定目录的文件列表，读取文件内容，判断路径是否存在
*/
module.exports = {
    fileAdd,
    fileDelete,
    FileModify,
    fileView,
}