const path = require("path");

const { fileUploadError, unSupportedFileType } = require("../constant/err.type");
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
}

module.exports = new GoodsController();
