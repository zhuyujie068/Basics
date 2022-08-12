// 引入 koa
const Koa = require('koa');
const app = new Koa(); // 创建 koa 应用


// 将 router 按模块进行拆分，发布后期维护  (多个 router 可以使用自动导入)
// 导入 user 模块 的 router
const userRouter = require('../router/user')


// 中间件，use 必须接收一个函数
app
  .use(userRouter.routes()) // routes()来组装匹配好的路由，返回一个合并好的中间件

  // 调用allowedMethods()获得一个中间件，当发送了不符合的请求时，会返回 `405 Method Not Allowed` 或 `501 Not Implemented`
  .use(userRouter.allowedMethods({
    // throw: true, // 抛出错误，代替设置响应头状态
    // notImplemented: () => '不支持当前请求所需要的功能',
    // methodNotAllowed: () => '不支持的请求方式'
  }));

// .use((ctx,next)=>{
//   ctx.body = 'hello world'
// })


module.exports = app