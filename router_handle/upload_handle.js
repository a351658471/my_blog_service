
const db = require('../db/index')
const fs = require('fs')
const os = require('os')
const path = require('path')
const moment = require('moment')
const { parse } = require('path')
exports.upload = function(req, res){
  const imges = req.files[0]
  console.log();
  fs.readFile(imges.path,(err, data) => {
    if(err)return res.send({code:-1,msg:'上传失败'})
    const file = imges.originalname
    //得到上传文件的类型
    let type = file.split('.')[1]
    //设置文件的新名字
    let radname = Date.now() + parseInt(Math.random()*999 ) + parseInt(Math.random()*666)
    let newName = radname+'.'+ type
    fs.writeFile(path.join(process.cwd(),'/public/images/'+ newName), data, (err)=> {
      console.log('err',err);
      if(err)return res.send({code:-1,msg:err})
      const couter = os.networkInterfaces()
      for(var cm in couter){
        var cms = couter[cm]
      }
      const picPath = "http://" + cms[1].address + ":3000/public/images/" + newName
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