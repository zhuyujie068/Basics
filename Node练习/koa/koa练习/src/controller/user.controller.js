// user router 控制器 ， 用来存放 方法

// 导入 user 操作 sql 逻辑，可不再拆分出去，直接写在该文件中
const { createUser } = require("../service/user.service");

class UserController {
  // 注册
  async register(ctx, next) {
    // 1.获取数据
    const { user_name, password } = ctx.request.body;

    // 2.操作数据库
    const res = await createUser(user_name, password);

    // 3. 返回结果
    ctx.body = {
      code: 0,
      message: "用户注册成功",
      result: {
        id: res.id,
        user_name: res.user_name,
      },
    };
  }

  // 登录
  async login(ctx, next) {
    ctx.body = "登录成功";
  }
}

module.exports = new UserController();
