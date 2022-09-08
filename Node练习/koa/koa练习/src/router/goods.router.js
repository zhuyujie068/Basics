const Router = require("koa-router");

const { auth, hadAdminPermission } = require("../middleware/auth.middleware");

const { validator, validatorId } = require("../middleware/goods.middleware");

const {
  upload,
  create,
  update,
  remove,
  close,
  putaway,
} = require("../controller/goods.controller");

const router = new Router({ prefix: "/goods" });

router
  .post("/upload", auth, hadAdminPermission, upload) // 商品图片上传
  .post("/", auth, hadAdminPermission, validator, create) // 发布商品
  .post("/remove", auth, hadAdminPermission, validatorId, remove) // 删除商品 (使用 Paranoid - 偏执表，会为表新增 deletedAt 字段 ， 调用 destroy() 时不会将数据进行删除（物理删除） ，而 为 deletedAt 字段 给个时间戳，代表该数据已删除（逻辑删除），使用 restore() 非复)
  .post("/close/:id", auth, hadAdminPermission, close) // 下架商品 （逻辑删除）
  .post("/putaway/:id", auth, hadAdminPermission, putaway) // 上架商品
  .post("/:id", auth, hadAdminPermission, validator, update); // 修改商品 ( /:id  这么写路由需要将其放在后面，不然会影响到后面其他api ，原因不明 )

module.exports = router;
