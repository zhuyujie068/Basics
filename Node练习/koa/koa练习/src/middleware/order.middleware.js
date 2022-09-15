const { orderFormatError } = require("../constant/err.type");

// 参数检验
const validator = rules => {
  // rules 需要检验的规则
  return async (ctx, next) => {
    try {
      ctx.verifyParams(rules); // 不需要在前面添加  await 
    } catch (err) {
      console.error(err);
      orderFormatError.result = err;
      return ctx.app.emit("error", orderFormatError, ctx);
    }

    await next();
  };
};

module.exports = {
  validator,
};
