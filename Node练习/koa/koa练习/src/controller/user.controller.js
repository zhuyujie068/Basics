// user router 控制器 ， 用来存放 方法

class UserController {
  async register(ctx,next) {
    ctx.body = '用户注册成功'
  }
}

module.exports = new UserController()














