const { invalidGoodsID } = require("../constant/err.type");

// 参数检验
const validator = async (ctx, next) => {
  try {
    ctx.verifyParams({
      goods_id: "number",
    });
  } catch (error) {
    console.error("error", error);
    invalidGoodsID.result = error;
    return ctx.app.emit("error", invalidGoodsID, ctx);
  }

  await next();
};

module.exports = {
  validator,
};
