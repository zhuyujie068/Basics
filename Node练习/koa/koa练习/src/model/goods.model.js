// 引入 sequelize
const { DataTypes } = require("sequelize");

// 数据库连接
const seq = require("../db/seq");

// 创建模型 ，通过模型创建 zd_goods 表
const Goods = seq.define(
  "zd_goods",
  {
    goods_name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "商品名称",
    },
    goods_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "商品价格",
    },
    goods_num: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "商品库存",
    },
    goods_img: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "商品图片url",
    },
  },
  {
    paranoid: true, // Paranoid - 偏执表，会为表新增 deletedAt 字段 ， 调用 destroy() 时不会将数据进行删除（物理删除） ，而 为 deletedAt 字段 给个时间戳，代表该数据已删除（逻辑删除），使用 restore() 非复
  }
);

// Goods.sync({ force: true }); // 创建表

module.exports = Goods;
