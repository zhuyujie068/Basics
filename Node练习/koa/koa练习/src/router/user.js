const Router = require('koa-router')

// prefix 加前缀 
const router = new Router({prefix:'/users'}) 

// GET: 加前缀 + 路径   /users/index  
router.get('/index',(ctx,next)=>{
  ctx.body = 'hi users index'
})

// 导出
module.exports = router



