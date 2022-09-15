// 1、导入 koa-router
const Router = require("koa-router");

// 2、实例化对象
const router = new Router({ prefix: "/address" });

// 中间件
const { auth } = require("../middleware/auth.middleware");
const { validator } = require("../middleware/addr.middleware");

// 控制器
const { create, findAll,update } = require("../controller/addr.controller");

// 3、编写路由规则

// 添加地址
router.post(
  "/",
  auth,
  validator({
    consignee: "string",
    phone: { type: "string", format: /^1\d{10}$/ },
    address: "string",
  }),
  create
);

router.get("/list", auth, findAll); // 获取地址列表

// 修改地址
router.post(
  "/revamp/:id",
  auth,
  validator({
    consignee: "string",
    phone: { type: "string", format: /^1\d{10}$/ },
    address: "string",
  }),
  update
); 

// 4、导出 router 对象
module.exports = router;
