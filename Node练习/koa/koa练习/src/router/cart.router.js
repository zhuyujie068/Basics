// 1.导入koa-router
const Router = require("koa-router");

// 2.实例化router对象
const router = new Router({ prefix: "/carts" });

// 中间件
const { auth } = require("../middleware/auth.middleware");
const { validator } = require("../middleware/cart.middleware");

// 控制器
const { add, findAll, update, remove, selectAll, unselectAll } = require("../controller/cart.controller");

// 3.编写路由规则
router.post("/", auth, validator({ goods_id: "number" }), add); //添加到购物车
router.get("/list", auth, findAll); // 获取购物车列表
router.post("/delete", auth, validator({ ids: "array" }), remove); // 删除购物车
router.post("/selectAll", auth, selectAll); // 全选  
router.post("/unselectAll", auth, unselectAll); // 全部取消

// 更新购物车
router.post(
  "/:id",
  auth,
  validator({
    number: { type: "number", required: false },
    selected: { type: "bool", required: false },
  }),
  update
);


// 4. 导出router对象
module.exports = router;
