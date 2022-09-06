const Router = require("koa-router");

const { auth, hadAdminPermission } = require("../middleware/auth.middleware");

const { validator } = require("../middleware/goods.middleware");

const { upload, create } = require("../controller/goods.controller");

const router = new Router({ prefix: "/goods" });

router
  .post("/upload", auth, hadAdminPermission, upload) // 商品图片上传
  .post("/", auth, hadAdminPermission, validator, create); // 发布商品

module.exports = router;
