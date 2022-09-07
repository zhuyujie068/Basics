const { goodsFormatError } = require("../constant/err.type");

const validator = async (ctx, next) => {
  // 参数检验
  try {
    ctx.verifyParams({
      goods_name: { type: "string", required: true }, // 商品名称
      goods_price: { type: "number", required: true }, // 商品价格
      goods_num: { type: "number", required: true }, // 商品数量
      goods_img: { type: "string", required: true }, // 商品图片
    });
  } catch (error) {
    console.error("error", error);
    goodsFormatError.result = error;
    return ctx.app.emit("error", goodsFormatError, ctx);
  }

  await next();
};

const validatorId = async (ctx, next) => {
  try {
    ctx.verifyParams({
      id: { type: "string", required: true }, // 商品 id
    });
  } catch (error) {
    console.error("error", error);
    goodsFormatError.result = error;
    return ctx.app.emit("error", goodsFormatError, ctx);
  }

  await next();
};

module.exports = {
  validator,
  validatorId,
};
