
const db = require('../db/index')
const fs = require('fs')
const os = require('os')
const path = require('path')
const moment = require('moment')
exports.upload = function(req, res){
  const imges = req.file
  fs.readFile(imges.path,(err, data) => {
    if(err)return res.send({code:-1,msg:'上传失败'})
    const imgesori = imges.originalname
    //得到上传文件的类型
    let type = file.originalname.split('.')[1]
    //设置文件的新名字
    let ttt = moment.defaultFormat('YYYMMDDHHmmss')
    let ran = parseInt(Math.random() * 89999 + 10000 )
    let newName = ttt + ran + '.' + type
    fs.writeFile(path.join(__dirname,'/public/images/'+ newName), data, (err)=> {
      if(err)return res.send({code:-1,msg:'写入失败'})
      const couter = os.networkInterfaces()
      for(var cm in couter){
        var cms = couter[cm]
      }
      const picPath = "http://" + cms[1].address + ":3000/publick/image" + newName
      const inserData = {
        picPath
      }
      const insertPic = "INSERT INTO pic_table SET ?"
      db.query(insertPic,inserData, (err, result) => {
        if(err)return res.send({code:-1,msg:'保存到数据库失败'})
        res.send({
          code:0,
          msg:'图片上传成功',
          url:picPath
        })
      })
    })
  })
}