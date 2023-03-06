const db = require('../db/index')

exports.addComment = (req, res)=>{
  const from_id = req.auth.userId
  const createTime = new Date().getTime().toString()
  const id = (Math.random()+ new Date().getTime()).toString(32).slice(0,8)
  const status = 0
  const praise = 0
  const data = {...req.body, id, createTime,from_id, status, praise}
  console.log('data',data);
  const sqlStr = "INSERT INTO comments SET ?"
  db.query(sqlStr, data, (err,  result)=> {
    if(err){
      console.log('err',err);
      return res.send({code:-1,msg:'评论失败'})
    }
    res.send({
      code:0,
      msg:'评论成功',
      id
    })
  })
}

exports.queryComment = (req, res)=> {
  const users = {}
  const data = req.query
  const {page, pageSize} = data
  const start = (page - 1)* pageSize
  delete(data.page)
  delete(data.pageSize)
  let where = ''
  const tempValues = []
  const keys = Object.keys(data)
  console.log('keys',keys);
  keys.forEach(( key, index ) => {
    if(index ===0 )where = 'WHERE '
    where += `${ key } = ?`
    tempValues.push(data[key])
    if(index < keys.length -1)where += 'and '
  })
  console.log('where',where);
  const sqlStr =`SELECT SQL_CALC_FOUND_ROWS * FROM comments ${where}  LIMIT ?, ?`
  const tempArr = JSON.stringify(data) === '{}'? [start, pageSize*1]: [...tempValues, start, pageSize*1]
  db.query(sqlStr, tempArr, (err, result) => {
    if(err) return res.send({code:-1,msg:err})
    result.forEach(item => {
      if(users[item.from_id]){
        item.from_nickName = users[item.from_id]
      }else{
        const userSqlStr = `SELECT nickName FROM users WHERE userId = ?`
        db.query(userSqlStr, item.from_id, (err, userData)=> {
          if(err)return res.send({code:-1,msg:err})
          users[item.from_id] = userData[0].nickName
          item.from_nickName = userData[0].nickName
        })
      }
      if(item.to_uid){
        if(users[item.to_uid]){
          item.to_nickName = users[item.to_uid]
        }else{
          const userSqlStr = `SELECT nickName FROM users WHERE userId = ?`
          db.query(userSqlStr, item.to_uid, (err, userData)=> {
            if(err)return res.send({code:-1,msg:err})
            users[item.to_uid] = userData[0].nickName
            item.to_nickName = userData[0].nickName
          })
        }
      }
      
    })
    const sqlCountStr = `SELECT  count(*) as total FROM comments ${where}`
    db.query(sqlCountStr,tempArr, (err_c, result_c) => {
      if(err_c)return res.send({})
      const total = result_c[0].total
      res.send({code:0,result,total})
    })
  })
}