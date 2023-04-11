const db = require('../db/index')
const jwt = require('jsonwebtoken')
const global = require('../global')
const bgColor = [
  '#778beb',
  '#e77f67',
  '#f8a5c2',
  '#f3a683',
  '#20bf6b',
  '#0fb9b1',
  '#f5cd79',
  '#596275',
  '#96cae5',
  '#ff5777',
]
const getColor = () => {
  return bgColor[Math.floor(Math.random() * 10)]
}
exports.register = function(req, res){
  const createTime = new Date().getTime().toString()
  const userId = (Math.random()+ new Date().getTime()).toString(32).slice(0,8)
  const data = {...req.body, userId, createTime, color:getColor()}
  const querySqlStr =`SELECT * FROM users WHERE email = ?`
  db.query(querySqlStr, data.email, (err, result)=> {
    if(err)return res.send({code:-1, msg:err})
    if(result.length > 0)return res.send({code:-2, message:'邮箱已被注册'})
    const sqlStr = "INSERT INTO users SET ?"
    db.query(sqlStr, data, (err, result) => {
      if(err)return res.send({code:-1,msg:err})
      const secret = jwt.sign({ userId }, global.secretKey, { expiresIn: '604800s' })
      const userInfo = {
        email:data.email,
        color:data.color,
        nickName:data.nickName,
        userId,
      }
      res.send({
        code:0,
        msg:'注册成功',
        secret,
        userInfo
      })
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
        const userInfo = {
          email: result[0].email,
          color:result[0].color,
          nickName:result[0].nickName,
          userId: result[0].userId,
          stars:result[0].stars,
        }
        const secret = jwt.sign({ userId: result[0].userId }, global.secretKey, { expiresIn: '604800s' })
        res.send({
              code: 0,
              message: '登录成功',
              secret,
              userInfo
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
  const sqlStr =`SELECT * FROM users ${where}`
  db.query(sqlStr, tempValues, (err, result)=>{
    if(err) return res.send({code:-1,msg:err})
    if(result.length > 0){
      if(result[0].level < 1)return res.send({code:-2, message:'权限不足'})
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