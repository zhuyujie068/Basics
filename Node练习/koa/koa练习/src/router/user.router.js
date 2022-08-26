// user 模块 相关路由

// 引入koa-router
const Router = require("koa-router");

const { register, login } = require("../controller/user.controller");
const { userValidator, verifyUser } = require("../middleware/user.middleware");

// prefix 加前缀
const router = new Router({ prefix: "/users" }); // 创建路由，支持传递参数

// GET/POST: 加前缀 + 路径   /users/index
router
  .post("/register", userValidator, verifyUser, register) // 注册,先通过 userValidator、verifyUser 中间件 进行检验，检验通过再进行注册操作
  .post("/login", login) // 登录
  .get("/index", (ctx, next) => {
    ctx.body = "hi users index";
  });

// 导出
module.exports = router;
