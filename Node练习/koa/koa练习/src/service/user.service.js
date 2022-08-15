// // user 操作数据库相关 方法（逻辑），可不拆分，直接写在 控制器 中

class UserService {
  async createUser(user_name,password){
    // todo: 写入数据库
    return '写入数据库成功'
  }
}


module.exports = new UserService()