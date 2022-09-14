const { createOrUpdate , findCarts} = require("../service/cart.service");

class CartController {
  // 将商品添加到购物车
  async add(ctx) {
    // 1.解析user_id、goods_id
    const user_id = ctx.state.user.id;
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
    const { pageNum = 1, pageSize = 10 } = ctx.request.query;

    // 2、操作数据库
    const res = await findCarts(pageNum, pageSize);

    // 3、返回结果
    ctx.body = {
      code: 0,
      message: "购物车列表获取成功",
      result: res,
    };
  }
}

module.exports = new CartController();
