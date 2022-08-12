// 导入 环境变量
const { HOST,PORT } = require('./config/default')

const app = require('./app')

// 监听本地 端口
app.listen(PORT,()=>{
  console.log(`服务器已启动： http://${HOST}:${PORT}`);
})