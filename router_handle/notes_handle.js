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

const noteHotChange = function(id, type, isAdd=true, res){
  const sqlStr = `UPDATE notes SET ${type } = ${type} ${isAdd?'+':'-'} 1  WHERE id = ?`
  db.query(sqlStr, id, (err, result) => {
    if(err) return res.send({code:-1,msg:err})
    // res.send({code:0})
  })
}
exports.noteStarChange = function(req, res){
  let { id, isAdd, userId} = req.query
  noteHotChange(id, 'star', isAdd,res)
  const queryUserStr = `SELECT stars FROM users WHERE userId = '${userId}'`
  db.query(queryUserStr, (user_err, user_result)=> {
    if(user_err) return res.send({code:-1,msg:user_err})
    console.log('user_result',user_result);
    let stars = user_result[0].stars??''
    const arr =stars===''?[]: stars.split(',')
    if(arr.indexOf(id)==-1 && isAdd){
      console.log('===============');
      arr.push(id)
      stars = arr.join(',')
    }else if(arr.indexOf(id)!=-1 && !isAdd){
      arr.splice(arr.indexOf(id),1)
      stars = arr.join(',')
    }
    const userStarsStr = `UPDATE users SET stars = ? WHERE userId = '${userId}'`
    db.query(userStarsStr, stars, (err, result)=> {
      if(err)return res.send({code:-1,msg:err})
      res.send({code:0})
    })
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
  const data = req.query
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
    const sqlCountStr = `SELECT  count(*) as total FROM notes ${where}`
    db.query(sqlCountStr,tempArr, (err_c, result_c) => {
      if(err_c)return res.send({})
      const total = result_c[0].total
      res.send({code:0,result,total})
    })
  })
  
}

exports.article = function(req, res){
  const {id} = req.query
  let sqlStr = 'SELECT * FROM notes WHERE id = ?'
  db.query(sqlStr, id , (err, result)=> {
    if(err) return res.send({code:-1,msg:err})
    noteHotChange(id, 'views',true, res)
    res.send({code:0,data:result[0]})
  })
}
exports.noteHotChange = noteHotChange