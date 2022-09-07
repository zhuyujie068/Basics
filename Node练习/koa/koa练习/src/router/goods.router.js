const Router = require("koa-router");

const { auth, hadAdminPermission } = require("../middleware/auth.middleware");

const { validator, validatorId } = require("../middleware/goods.middleware");

const { upload, create, update, remove } = require("../controller/goods.controller");

const router = new Router({ prefix: "/goods" });

router
  .post("/upload", auth, hadAdminPermission, upload) // 商品图片上传
  .post("/", auth, hadAdminPermission, validator, create) // 发布商品
  .post("/remove", auth, hadAdminPermission, validatorId, remove) // 删除商品
  .post("/:id", auth, hadAdminPermission, validator, update); // 修改商品 ( /:id  这么写路由需要将其放在后面，不然会影响到后面其他api ，原因不明 )

//   router.post('/:id/off', auth, hadAdminPermission, remove)
// router.post('/:id/on', auth, hadAdminPermission, restore)

module.exports = router;
