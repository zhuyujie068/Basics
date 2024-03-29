const { Op } = require("sequelize");
const Cart = require("../model/cart.model");
const Goods = require("../model/goods.model");

class CartService {
  async createOrUpdate(user_id, goods_id) {
    // 根据user_id和goods_id同时查找, 有没有记录
    let res = await Cart.findOne({
      where: {
        [Op.and]: {
          user_id,
          goods_id,
        },
      },
    });

    if (res) {
      // 已经存在一条记录, 将number + 1
      await res.increment("number");
      return await res.reload();
    } else {
      return await Cart.create({
        user_id,
        goods_id,
      });
    }
  }

  async findCarts(pageNum, pageSize) {
    const offset = (pageNum - 1) * pageSize;
    const { count, rows } = await Cart.findAndCountAll({
      attributes: ["id", "number", "selected"], // attributes 选取表中的特定列
      offset: offset, // 使用 limit 和 offset 参数可以进行限制和分页
      limit: pageSize * 1,
      include: {
        model: Goods,
        as: "goods_info", // as 别名
        attributes: ["id", "goods_name", "goods_price", "goods_img"],
      },
    });
    return {
      pageNum,
      pageSize,
      total: count,
      list: rows,
    };
  }

  async updateCarts(params) {
    const { id, number, selected } = params;

    // 通过主键来查询一条记录
    const res = await Cart.findByPk(id);
    if (!res) return false; // 没有 数据 则返回

    // 有 数据 ，则更新 数据
    number !== undefined ? (res.number = number) : "";
    if (selected !== undefined) {
      res.selected = selected;
    }

    return await res.save();
  }

  async removeCarts(ids) {
    return await Cart.destroy({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });
  }

  async selectAllCarts(user_id) {
    return await Cart.update(
      { selected: true },
      {
        where: {
          user_id,
        },
      }
    );
  }

  async unselectAllCarts(user_id) {
    return await Cart.update(
      { selected: false },
      {
        where: {
          user_id,
        },
      }
    );
  }
}

module.exports = new CartService();
