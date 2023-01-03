const db = require('../db/index')
const jwt = require('jsonwebtoken')
const global = require('../global')

exports.register = function(req, res){
  const createTime = new Date().getTime().toString()
  const userId = (Math.random()+ new Date().getTime()).toString(32).slice(0,8)
  const data = {...req.body, userId, createTime}
  const sqlStr = "INSERT INTO users SET ?"
  db.query(sqlStr, data, (err, result) => {
    if(err)return res.send({code:-1,msg:err})
    res.send({
      code:0,
      msg:'注册成功'
    })
  })
}

exports.userLogin = (req, res)=> {
    const data = req.query
    const keys = Object.keys(data)
    let where = ''
    tempValues = []
    // console.log('tempValues',tempValues);
    keys.forEach(( key, index ) => {
      if(index ===0 )where = 'WHERE '
      where += `${ key } = ?`
      tempValues.push(data[key])
      if(index < keys.length -1)where += 'and '
    })
    const sqlStr =`SELECT * FROM users ${where}`
    db.query(sqlStr, tempValues, (err, result)=>{
      if(err) return res.send({code:-1,msg:err})
      if(result.length > 0){
        const secret = jwt.sign({ userId: result[0].userId }, global.secretKey, { expiresIn: '604800s' })
        res.send({
              code: 0,
              message: '登录成功',
              secret
            })
      }else{
        res.send({
            status: -1,
            message: '账号或密码错误'
        })
      }
    })
}

exports.adminLogin = (req, res)=> {
  const data = req.query
  const keys = Object.keys(data)
  let where = ''
  tempValues = []
  // console.log('tempValues',tempValues);
  keys.forEach(( key, index ) => {
    if(index ===0 )where = 'WHERE '
    where += `${ key } = ?`
    tempValues.push(data[key])
    if(index < keys.length -1)where += 'and '
  })
  const sqlStr =`SELECT * FROM admin ${where}`
  db.query(sqlStr, tempValues, (err, result)=>{
    if(err) return res.send({code:-1,msg:err})
    if(result.length > 0){
      const secret = jwt.sign({ userId: result[0].id }, global.secretKey, { expiresIn: '604800s' })
      res.send({
            code: 0,
            message: '登录成功',
            secret
          })
    }else{
      res.send({
          status: -1,
          message: '账号或密码错误'
      })
    }
  })
}