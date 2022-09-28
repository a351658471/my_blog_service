const db = require('../db/index')

exports.saveProfile = function(req, res){
  const data = req.body
  let sqlStr = ''
  if(data.id){
    let id = data.id
    sqlStr = "UPDATE profile SET ? WHERE id = ?"
    db.query(sqlStr, [data, id], (err, result) => {
      if(err)return res.send({code:-1, msg:err})
      res.send({
        code:0,
        msg:'保存成功'
      })
    })
  }else{
    sqlStr = "INSERT INTO profile SET ?"
    db.query(sqlStr, data, (err, result) => {
      if(err)return res.send({code:-1, msg:err})
      res.send({
        code:0,
        result:{id:result.insertId},
        msg:'保存成功'
      })
    })
  }
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