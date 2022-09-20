const db = require('../db/index')

exports.addNote = function(req, res){
  const createTime = new Date().getTime().toString()
  const id = (Math.random()+ createTime).toString(32).slice(0,8)
  const data = {...req.body, id, createTime}
  const sqlStr = "INSERT INTO notes SET ?"
  db.query(sqlStr, data, (err, result) => {
    if(err)return res.send({code:-1,msg:'新增失败'})
    res.send({
      code:0,
      msg:'新增成功'
    })
  })
}