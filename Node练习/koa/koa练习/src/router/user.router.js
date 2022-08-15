// user 模块 相关路由

// 引入koa-router
const Router = require('koa-router')

const { register,login } = require('../controller/user.controller')

// prefix 加前缀 
const router = new Router({prefix:'/users'})  // 创建路由，支持传递参数

// GET/POST: 加前缀 + 路径   /users/index  
router
  .post('/register', register)    // 注册
  .post('/login', login)          // 登录
  .get('/index',(ctx,next)=>{
    ctx.body = 'hi users index'
  })
 
// 导出 
module.exports = router



