// 自动导入目录下面的所有 router 模块

// 引入 文件 操作
const fs = require("fs");

const Router = require("koa-router");
const router = new Router();

const fsList = fs.readdirSync(__dirname); // 获取当前目录下的使用文件

fsList.forEach(file => {
  // 排除该文件（index.js）,依次循环，加载文件
  if (file !== "index.js") {
    let r = require("./" + file); // 加载文件
    router.use(r.routes()); // 将文件中的 router() 注册到 router 中
  }
});

module.exports = router;
