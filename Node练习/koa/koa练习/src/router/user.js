// 引入koa-router
const Router = require('koa-router')

// prefix 加前缀 
const router = new Router({prefix:'/users'})  // 创建路由，支持传递参数

// GET: 加前缀 + 路径   /users/index  
router
  .get('/',(ctx,next)=>{
    ctx.body = 'hi '
  })
  .get('/index',(ctx,next)=>{
    ctx.body = 'hi users index'
  })

// 导出
module.exports = router



