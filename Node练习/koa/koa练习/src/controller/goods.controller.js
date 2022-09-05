const path = require("path");

const { fileUploadError } = require("../constant/err.type");
class GoodsController {
  async upload(ctx, next) {
    try {
      // 获取所有上传文件的信息 ctx.request.files 可以是多个文件，可以通过 ctx.request.files.XXX 获取某一个具体上传文件的详细信息
      console.log(ctx.request.files.file);

      const { file } = ctx.request.files;
      if (file) {
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
