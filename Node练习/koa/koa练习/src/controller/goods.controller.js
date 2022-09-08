const path = require("path");

const { createGoods, updateGoods, removeGoods, putawayGoods } = require("../service/goods.service");

const {
  fileUploadError,
  unSupportedFileType,
  publishGoodsError,
  invalidGoodsID,
} = require("../constant/err.type");
class GoodsController {
  async upload(ctx, next) {
    try {
      // 获取所有上传文件的信息 ctx.request.files 可以是多个文件，可以通过 ctx.request.files.XXX 获取某一个具体上传文件的详细信息
      console.log(ctx.request.files.file);

      const { file } = ctx.request.files;

      const fileTypes = ["image/jpeg", "image/png"]; // 允许上传的文件类型

      // 不推荐在此 做文件上传类型 判断，因为，到此处时，文件已经上传到 服务器 了，
      if (file) {
        if (!fileTypes.includes(file.mimetype)) {
          return ctx.app.emit("error", unSupportedFileType, ctx);
        }

        ctx.body = {
          code: 0,
          message: "商品图片上传成功",
          result: {
            goods_img: file.newFilename,
            // goods_img1: path.basename(file.filepath), // path.basename() 返回路径中的文件名
          },
        };
      } else {
        return ctx.app.emit("error", fileUploadError, ctx);
      }
    } catch (error) {
      console.error("error", error);
      return ctx.app.emit("error", fileUploadError, ctx);
    }
  }

  async create(ctx, next) {
    try {
      const { createdAt, updatedAt, ...res } = await createGoods(ctx.request.body);
      ctx.body = {
        code: 0,
        message: "发布商品成功",
        result: res,
      };
    } catch (error) {
      console.error("error", error);
      return ctx.app.emit("error", publishGoodsError, ctx);
    }
  }

  async update(ctx, next) {
    try {
      let res = await updateGoods(ctx.params.id, ctx.request.body); // ctx.params.id 从 url 上面取 id
      if (res) {
        ctx.body = {
          code: 0,
          message: "修改商品成功",
          result: "",
        };
      } else {
        return ctx.app.emit("error", invalidGoodsID, ctx);
      }
    } catch (error) {
      console.error("error", error);
    }
  }

  async remove(ctx, next) {
    try {
      let res = await removeGoods(ctx.request.body.id);
      if (res) {
        ctx.body = {
          code: 0,
          message: "删除商品成功",
          result: "",
        };
      } else {
        return ctx.app.emit("error", invalidGoodsID, ctx);
      }
    } catch (error) {
      console.error("error", error);
    }
  }

  async close(ctx, next) {
    try {
      let res = await removeGoods(ctx.params.id);
      if (res) {
        ctx.body = {
          code: 0,
          message: "下架商品成功",
          result: "",
        };
      } else {
        return ctx.app.emit("error", invalidGoodsID, ctx);
      }
    } catch (error) {
      console.error("error", error);
    }
  }

  async putaway(ctx, next) {
    try {
      const res = await putawayGoods(ctx.params.id);
      if (res) {
        ctx.body = {
          code: 0,
          message: "上架商品成功",
          result: "",
        };
      } else {
        return ctx.app.emit("error", invalidGoodsID, ctx);
      }
    } catch (error) {
      console.error("error", error);
    }
  }
}

module.exports = new GoodsController();
