// 引入 sequelize
const { Sequelize } = require("sequelize");

// 导入 全局变量
const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PWD, MYSQL_DB } = require("../config/default");

// 连接 mysql
const seq = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PWD, {
  host: MYSQL_HOST,
  dialect: "mysql",
});

// 测试连接
seq
  .authenticate()
  .then(() => {
    console.log("数据库连接成功");
  })
  .catch(err => {
    console.log("数据库连接失败：", err);
  });

module.exports = seq;
