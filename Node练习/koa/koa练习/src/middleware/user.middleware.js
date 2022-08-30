// 拆分一个中间件层, 封装多个中间件函数，进行检验 (可以不拆，直接在 user.controller 中进行判断)

// 导入 bcrypt 进行密码加密
const bcrypt = require("bcryptjs");

const { getUerInfo } = require("../service/user.service");

// 导入错误类型
const { userFormateError, userAlreadyExited, userRegisterError } = require("../constant/err.type");

// 合法性 （判断需要传入的参数是否合法）
const userValidator = async (ctx, next) => {
  const { user_name, password } = ctx.request.body;
  if (!user_name || !password) {
    console.error("用户名或密码为空", ctx.request.body);
    ctx.app.emit("error", userFormateError, ctx);
    return;
  }

  await next();
};

// 合理性（判断 新增的数据是否符合 需求）
const verifyUser = async (ctx, next) => {
  const { user_name } = ctx.request.body;

  try {
    const res = await getUerInfo({ user_name });

    if (res) {
      console.error("用户名已经存在", { user_name }); // console.error 的打印会写入到 服务器 日志中
      ctx.app.emit("error", userAlreadyExited, ctx);
      return;
    }
  } catch (err) {
    console.error("获取用户信息错误", err);
    ctx.app.emit("error", userRegisterError, ctx);
    return;
  }

  await next();
};

// 将密码进行 bcrypt 加密
const crpytPassword = async (ctx, next) => {
  const { password } = ctx.request.body;

  const salt = bcrypt.genSaltSync(10);

  // hash保存的是 密文
  const hash = bcrypt.hashSync(password, salt);
  ctx.request.body.password = hash;

  await next();
};

module.exports = {
  userValidator,
  verifyUser,
  crpytPassword,
};
