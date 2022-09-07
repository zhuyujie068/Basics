const Goods = require("../model/goods.model");
class GoodsService {
  async createGoods(goods) {
    const res = await Goods.create(goods);
    return res.dataValues;
  }

  async updateGoods(id, goods) {
    const res = await Goods.update(goods, { where: { id } });
    return res[0] > 0 ? true : false; // res[0] 有多少条数据 发生变化，如果没有数据发送变化，则修改失败
  }

  async removeGoods(id) {
    const res = await Goods.destroy({ where: { id } });
    return res > 0 ? true : false;
  }
}

module.exports = new GoodsService();
