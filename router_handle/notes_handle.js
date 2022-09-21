const db = require('../db/index')

exports.addNote = function(req, res){
  const createTime = new Date().getTime().toString()
  const id = (Math.random()+ new Date().getTime()).toString(32).slice(0,8)
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

exports.editNote = function(req,res){
  const data = req.body
  const id = data.id
  delete(data.id)
  const sqlStr = "UPDATE notes SET ? WHERE id = ?"
  db.query(sqlStr, [data, id], (err, result) => {
    if(err) return res.send({code:-1,msg:err})
    res.send({
      code:0,
      msg:'编辑成功'
    })
  })
}

exports.noteHotChange = function(req, res){
  const { type } = req.params
  const { id } = req.body
  const sqlStr = `UPDATE notes SET ${type } = ${type} + 1  WHERE id = ?`
  db.query(sqlStr, id, (err, result) => {
    if(err) return res.send({code:-1,msg:err})
    res.send({code:0})
  })
}

exports.deleteNote = function(req, res){
  const { id } = req.params
  const sqlStr = "DELETE FROM notes WHERE id = ?"
  db.query(sqlStr, id, (err, result) => {
    if(err) return res.send({code:-1,msg:err})
    res.send({code:0, msg:'删除成功'})
  })
}

exports.queryNotes = function(req, res){
  const data = req.body
  const {page, pageSize} = data
  const start = (page - 1)* pageSize
  delete(data.page)
  delete(data.pageSize)
  let where = ''
  const whereValue = []
  const keys = Object.keys(data)
  keys.forEach((key, index) => {
    if(index == 0 )where = 'WHERE '
    where += `${key} LIKE ?`
    whereValue.push('%'+data[key]+'%')
    if(index < keys.length -1)where += 'and'
  })
  const sqlStr =`SELECT SQL_CALC_FOUND_ROWS * FROM notes ${where}  LIMIT ?, ?`
  const tempArr = JSON.stringify(data) === '{}'? [start, pageSize*1]: [...whereValue, start, pageSize*1]
  db.query(sqlStr, tempArr, (err, result) => {
    if(err) return res.send({code:-1,msg:err})
    db.query('select found_rows()',(err_c, result_c) => {
      if(err_c)return res.send({})
      const total = result_c[0]['found_rows()']
      res.send({code:0,result,total})
    })
    
  })
  
}