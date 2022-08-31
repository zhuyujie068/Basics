// 拆分一个中间件层, 封装多个中间件函数，进行逻辑处理 (可以不拆，直接在 user.controller 中进行判断，同一个逻辑有在多处使用，建议 成中间件 进行逻辑复用)

// 导入 bcrypt 进行密码加密
const bcrypt = require("bcryptjs");

const { getUerInfo } = require("../service/user.service");

// 导入错误类型
const {
  userFormateError,
  passwordIsEmpty,
  userAlreadyExited,
  userRegisterError,
  userDoesNotExist,
  invalidPassword,
  userLoginError,
} = require("../constant/err.type");

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

// 合理性（判断 新增用户 的数据是否符合 需求）
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

// 将 密码 进行 bcrypt 加密
const crpytPassword = async (ctx, next) => {
  const { password } = ctx.request.body;

  if (!password) {
    console.error("密码为空", ctx.request.body);
    ctx.app.emit("error", passwordIsEmpty, ctx);
    return;
  }

  const salt = bcrypt.genSaltSync(10);

  // hash保存的是 密文
  const hash = bcrypt.hashSync(password, salt);
  ctx.request.body.password = hash;

  await next();
};

// 检验 登录 信息是否正确
const verifyLogin = async (ctx, next) => {
  const { user_name, password } = ctx.request.body;

  try {
    const res = await getUerInfo({ user_name });
    // 1.判断用户是否存在
    if (!res) {
      console.error("用户不存在", { user_name });
      ctx.app.emit("error", userDoesNotExist, ctx);
      return;
    }

    // 2.判断密码是否正确
    if (!bcrypt.compareSync(password, res.password)) {
      ctx.app.emit("error", invalidPassword, ctx);
      return;
    }
  } catch (error) {
    console.error(error);
    ctx.app.emit("error", userLoginError, ctx);
    return;
  }

  await next();
};

module.exports = {
  userValidator,
  verifyUser,
  crpytPassword,
  verifyLogin,
};
