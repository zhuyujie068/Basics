// 引入 path (推荐：node 核心模块 放在最上面，然后再放第三方，最后在放自己写的中间件)
const path = require("path");

// 引入 koa
const Koa = require("koa");
const app = new Koa(); // 创建 koa 应用

/*
  引入 koa-body  https://www.npmjs.com/package/koa-body 
*/
const KoaBody = require("koa-body");
// 需要在所有 路由处理 之前进行注册 koa-body 中间件
app.use(
  KoaBody({
    multipart: true, // 开启文件上传
    // json: true, // 是否解析 json 请求体，默认 true

    formidable: {
      // 文件上传的一些配置

      // 在配置 选项（option） 里的路径时，不推荐使用相对路径（例：uploadDir:"../upload"），应该使用绝对路径（例：path.join(__dirname, "../upload")），在 option 里的相对路径，不是相对的当前文件，而是相对 process.cwd() (项目进程运行地址)

      // 上传存放的路劲
      // uploadDir:"../upload",
      uploadDir: path.join(__dirname, "../upload"),
      // 保留后缀名
      keepExtensions: true,
      // 是否允许上传多个文件，默认 true
      multiples: true,
      // 文件上传大小限制
      maxFieldsSize: 10 * 1024 * 1024,
      onFileBegin: (name, file) => {
        // 无论是多文件还是单文件上传都会重复调用此函数

        // 获取后缀, 如: .js  .txt
        const reg = /\.[A-Za-z]+$/g;
        const ext = file.originalFilename.match(reg)[0];

        // file api 自动生成了 filepath （文件路径）
        // file.path = path.join(__dirname, "../upload/") + Date.now() + ext;

        // console.log('----',name,ext,file);
      },
      onError(err) {
        console.log(err);
      },
    },

    /*
      strict {Boolean} 严格模式 如果启用，则不解析 GET、HEAD、DELETE 请求，默认true ，
      只解析 POST、PUT、PATCH 请求，解析后 可以从 ctx.request.body 获取到 参数。

      parsedMethods { String[] } 声明将解析正文的 HTTP 方法，默认值['POST', 'PUT', 'PATCH']。替换strict选项。
    */
    parsedMethods: ["POST", "PUT", "PATCH", "GET"],
  })
);

// 引入 koa-parameter 进行参数检验 , 需要在所有 路由处理 之前进行注册 koa-parameter 中间件，会在 ctx 上注册 verifyParams()
const parameter = require("koa-parameter");
app.use(parameter(app));

// 引入 koa-staitc , 在项目目录中创建静态资源文件
const koaStatic = require("koa-static");
// 指定当前静态资源的文件夹
app.use(koaStatic(path.join(__dirname, "../upload"))); // 这样就可以在 浏览器 中通过路径访问 upload 文件下面的静态资源（ .img ）（例：http://localhost:8000/xxx.jpeg）

// 将 router 按模块进行拆分，发布后期维护  (多个 router 可以使用自动导入)

// 手动导入 router ，并 进行注册
/*
  const userRouter = require("../router/user.router"); // 导入 user 模块 的 router
  const goodsRoute = require("../router/goods.router");

  // 中间件，use 必须接收一个函数
  app
    .use(userRouter.routes()) // routes()来组装匹配好的路由，返回一个合并好的中间件

    // 调用allowedMethods()获得一个中间件，当发送了不符合的请求时，会返回 `405 Method Not Allowed` 或 `501 Not Implemented`
    .use(
      userRouter.allowedMethods({
        // throw: true, // 抛出错误，代替设置响应头状态
        // notImplemented: () => '不支持当前请求所需要的功能',
        // methodNotAllowed: () => '不支持的请求方式'
      })
    )

    .use(goodsRoute.routes());

  // .use((ctx,next)=>{
  //   ctx.body = 'hello world'
  // })
*/

// 自动 导入 router ，并 进行注册
const router = require("../router/index");
app.use(router.routes()).use(router.allowedMethods());

// 统一的错误处理 （导入错误状态码）
const errHandler = require("./errHandler");
app.on("error", errHandler);

module.exports = app;
