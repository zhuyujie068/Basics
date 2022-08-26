// sequelize 主要通过 Model 对应数据表

// 引入 sequelize
const { DataTypes } = require("sequelize");

const seq = require("../db/seq");

// 创建模型(Model zd_user -> 表 zd_users)
const User = seq.define(
  "zd_user",
  {
    // id 会被 sequelize 自动创建, 管理
    user_name: {
      type: DataTypes.STRING, // 字段类型
      allowNull: false, // 是否可以为空
      unique: true, // 是否唯一
      comment: "用户名, 唯一", // 说明
    },
    password: {
      type: DataTypes.CHAR(64),
      allowNull: false,
      comment: "密码",
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0, // 默认值
      comment: "是否为管理员, 0: 不是管理员(默认); 1: 是管理员",
    },
  },
  // {
  //   timestamps: false, //禁止 生成时间戳
  // }
  );

// 强制同步数据库(创建数据表)
// User.sync({ force: true }); // 判断数据库有没有该表，有就删除，重新创建，没有就直接创建该表

module.exports = User;
