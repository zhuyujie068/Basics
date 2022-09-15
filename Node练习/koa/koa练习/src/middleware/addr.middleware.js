const { addrFormatError } = require("../constant/err.type");

// 参数检验
const validator = rules => {
  // rules 需要检验的规则
  return async (ctx, next) => {
    try {
      await ctx.verifyParams(rules);
    } catch (err) {
      console.error(err);
      addrFormatError.result = err;
      return ctx.app.emit("error", addrFormatError, ctx);
    }

    await next();
  };
};

module.exports = {
  validator,
};
