const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../config/default");

const { tokenExpiredError, invalidToken, hasNotAdminPermission } = require("../constant/err.type");

// 进行 token 验证
const auth = async (ctx, next) => {
  const { authorization='' } = ctx.request.header; // 没有 authorization 时，默认为 '' 
  const token = authorization.replace("Bearer ", ""); // replace() （用……）替换
  // console.log("token",token);

  try {
    // user中包含了payload 的信息(id, user_name, is_admin)
    const user = jwt.verify(token, JWT_SECRET); // 核实 token , token 有问题，jwt.verify() 会抛出 错误，catch() 会拦截到，然后再对错误进行判断、处理

    ctx.state.user = user; // ctx.state -- 跨中间件分享数据
  } catch (err) {
    switch (err.name) {
      case "TokenExpiredError":
        console.error("token已过期", err);
        return ctx.app.emit("error", tokenExpiredError, ctx);

      case "JsonWebTokenError":
        console.error("无效的token", err);
        return ctx.app.emit("error", invalidToken, ctx);
    }
  }

  await next();
};

// 验证 是否有管理员权限
const hadAdminPermission = async (ctx, next) => {
  const { is_admin } = ctx.state.user;

  if (!is_admin) {
    console.error("该用户没有管理员的权限", ctx.state.user);
    return ctx.app.emit("error", hasNotAdminPermission, ctx);
  }

  await next();
};

module.exports = {
  auth,
  hadAdminPermission,
};
