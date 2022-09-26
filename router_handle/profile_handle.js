const db = require('../db/index')

exports.saveProfile = function(req, res){
  const data = req.body
  let sqlStr = ''
  if(data.id != undefined){
    sqlStr = "UPDATE profile SET ? WHERE id = ?"
  }else{
    sqlStr = "INSET INFO profile SET ?"
  }
  db.query(sqlStr, data, (err, result) => {
    if(err)return res.send({code:-1, msg:err})
    res.send({
      code:0,
      msg:'保存成功'
    })
  })
}

exports.getProfile = function(req, res){
  const sqlStr = "SELECT * FROM profile"
  db.query(sqlStr, (err, result) => {
    if(err)return res.send({code:-1, msg:err})
    res.send({
      code:0,
      result,
    })
  })
}