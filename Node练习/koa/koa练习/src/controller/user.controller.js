// user router 控制器 ， 用来存放 方法

// 导入 user 操作 sql 逻辑，可不再拆分出去，直接写在该文件中
const { createUser, getUerInfo, updateById } = require("../service/user.service");

// 导入 错误类型
const { userRegisterError, changePasswordError } = require("../constant/err.type");

// 引入 jsonwebtoken 用来生成 token
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/default");

class UserController {
  // 注册
  async register(ctx, next) {
    // 1.获取数据
    const { user_name, password } = ctx.request.body;

    try {
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
    } catch (err) {
      console.log("err：", err);
      ctx.app.emit("error", userRegisterError, ctx);
    }
  }

  // 登录
  async login(ctx, next) {
    const { user_name } = ctx.request.body;

    // 1. 获取用户信息(在token的payload中, 记录id, user_name, is_admin)
    try {
      // 从返回结果对象中剔除password属性, 将剩下的属性放到res对象
      const { password, ...res } = await getUerInfo({ user_name });

      ctx.body = {
        code: 0,
        message: "用户登录成功",
        result: {
          // jwt.sign(携带信息, 私钥, 过去时间（可选，1d 代表过期时间为一天, 10  代表 10秒）)
          token: jwt.sign(res, JWT_SECRET, { expiresIn: "100d" }),
        },
      };
    } catch (error) {
      console.error("用户登录失败", error);
      ctx.app.emit("error", userLoginError, ctx);
    }
  }

  // 修改密码
  async changePassword(ctx, next) {
    try {
      // 1.获取数据
      const id = ctx.state.user.id;
      const password = ctx.request.body.password;

      // 2.操作数据库
      const res = await updateById({ id, password });

      // 3.返回结果
      if (res) {
        ctx.body = {
          code: 0,
          message: "修改密码成功",
          result: "",
        };
      } else {
        ctx.app.emit("error", changePasswordError, ctx);
      }
    } catch (error) {
      console.error("修改密码失败", error);
      ctx.app.emit("error", changePasswordError, ctx);
    }
  }
}

module.exports = new UserController();
