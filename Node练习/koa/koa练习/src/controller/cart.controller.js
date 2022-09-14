const { createOrUpdate, findCarts, updateCarts } = require("../service/cart.service");
const { cartFormatError } = require("../constant/err.type");

class CartController {
  // 将商品添加到购物车
  async add(ctx) {
    // 1.解析user_id、goods_id
    const user_id = ctx.state.user.id; // ctx.state -- 跨中间件分享数据
    const goods_id = ctx.request.body.goods_id;

    // 2. 操作数据库
    const res = await createOrUpdate(user_id, goods_id);

    // 3. 返回结果
    ctx.body = {
      code: 0,
      message: "添加到购物车成功",
      result: res,
    };
  }

  // 获取 购物车 列表
  async findAll(ctx) {
    // 1、解析请求参数
    const { pageNum = 1, pageSize = 10 } = ctx.request.query; // ctx.request.query 根据 ? 获取原始查询字符串，问号后面的字符

    // 2、操作数据库
    const res = await findCarts(pageNum, pageSize);

    // 3、返回结果
    ctx.body = {
      code: 0,
      message: "购物车列表获取成功",
      result: res,
    };
  }

  // 更新购物车
  async update(ctx) {
    // 1、解析请求参数
    const { id } = ctx.request.params;
    const { number, selected } = ctx.request.body;

    if (number === undefined && selected === undefined) {
      cartFormatError.message = "number和selected不能同时为空";
      return ctx.app.emit("error", cartFormatError, ctx);
    }

    // 2、操作数据库
    const res = await updateCarts({ id, number, selected });

    // 3、返回结果
    ctx.body = {
      code: 0,
      message: "更新购物车成功",
      result: res,
    };

    if(!res){
      ctx.body.message="没有找到数据，更新失败"
    }

  }
}

module.exports = new CartController();
