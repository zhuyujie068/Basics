// 拆分一个中间件层, 封装多个中间件函数，进行检验 (可以不拆，直接在 user.controller 中进行判断)

const { getUerInfo } = require("../service/user.service");

// 导入错误类型
const { userFormateError, userAlreadyExited } = require("../constant/err.type");

const userValidator = async (ctx, next) => {
  const { user_name, password } = ctx.request.body;
  // 合法性
  if (!user_name || !password) {
    console.error("用户名或密码为空", ctx.request.body);
    ctx.app.emit("error", userFormateError, ctx);
    return;
  }

  await next();
};

const verifyUser = async (ctx, next) => {
  const { user_name } = ctx.request.body; 
  // 合理性
  if (getUerInfo({ user_name })) {
    ctx.app.emit("error", userAlreadyExited, ctx);
    return;
  }

  await next();
};

module.exports = {
  userValidator,
  verifyUser,
};
