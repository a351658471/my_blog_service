const db = require('../db/index')

exports.saveSkill = function(req, res){
  const data = req.body
  let sqlStr = ''
  if(data.id){
    let id = data.id
    sqlStr = "UPDATE skills SET ? WHERE id = ?"
    db.query(sqlStr, [data, id], (err, result) => {
      if(err)return res.send({code:-1, msg:err})
      res.send({
        code:0,
        msg:'保存成功'
      })
    })
  }else{
    sqlStr = "INSERT INTO skills SET ?"
    db.query(sqlStr, data, (err, result) => {
      if(err)return res.send({code:-1, msg:err})
      res.send({
        code:0,
        msg:'保存成功'
      })
    })
  }
}

exports.getSkills = function(req, res){
  const params = req.query
  const pageSize = parseInt(params.pageSize)
  const start = (params.page-1)*pageSize
  const sqlStr = "SELECT SQL_CALC_FOUND_ROWS * FROM skills LIMIT ?, ?"
  db.query(sqlStr,[start, pageSize], (err, result) => {
    if(err)return res.send({code:-1, msg:err})
    db.query('select found_rows()',(err_c, result_c) => {
      if(err_c)return res.send({})
      const total = result_c[0]['found_rows()']
      res.send({code:0,result,total})
    })
  })
}

exports.deleteSkill = function(req, res){
  const { id } = req.params
  const sqlStr = "DELETE FROM skills WHERE id = ?"
  db.query(sqlStr, id, (err, result) => {
    if(err) return res.send({code:-1,msg:err})
    res.send({code:0, msg:'删除成功'})
  })
}