const db = require('../db/index')

exports.addTag = function(req, res){
  const createTime = new Date().getTime().toString()
  const id = (Math.random()+ new Date().getTime()).toString(32).slice(0,8)
  const data = {...req.body, id, createTime}
  const sqlStr = "INSERT INTO tags SET ?"
  db.query(sqlStr, data, (err, result) => {
    if(err)return res.send({code:-1,msg:err})
    res.send({
      code:0,
      msg:'新增成功'
    })
  })
}

exports.editTag = function(req,res){
  const data = req.body
  const id = data.id
  delete(data.id)
  const sqlStr = "UPDATE tags SET ? WHERE id = ?"
  db.query(sqlStr, [data, id], (err, result) => {
    if(err) return res.send({code:-1,msg:err})
    res.send({
      code:0,
      msg:'编辑成功'
    })
  })
}

exports.deleteTag = function(req, res){
  const { id } = req.params
  const sqlStr = "DELETE FROM tags WHERE id = ?"
  db.query(sqlStr, id, (err, result) => {
    if(err) return res.send({code:-1,msg:err})
    res.send({code:0, msg:'删除成功'})
  })
}

exports.queryTag = function(req, res){
  const sqlStr =`SELECT * FROM tags`
  db.query(sqlStr, (err, result) => {
    if(err) return res.send({code:-1,msg:err})
    res.send({code:0,result})
  })
  
}