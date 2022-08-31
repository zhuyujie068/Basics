// user 操作数据库相关 方法（逻辑），可不拆分，直接写在 控制器 中

// 引入 user model
const User = require("../model/user.model");

class UserService {
  // 创建用户账号
  async createUser(user_name, password) {
    // todo: 写入数据库
    const res = await User.create({ user_name, password });
    console.log(res);

    // console.log(object1111111); // 模拟（创造） 错误

    // return '写入数据库成功'
    return res.dataValues;
  }

  // 根据 参数 查询 信息是否存在 , 返回 详情
  async getUerInfo({ id, user_name, password, is_admin }) {
    const whereOpt = {};

    id && Object.assign(whereOpt, { id });
    user_name && Object.assign(whereOpt, { user_name });
    password && Object.assign(whereOpt, { password });
    is_admin && Object.assign(whereOpt, { is_admin });

    const res = await User.findOne({
      attributes: ["id", "user_name", "password", "is_admin"],
      where: whereOpt,
    });

    return res ? res.dataValues : null;
  }

  // 根据 用户 id 修改用户信息(密码、用户名)
  async updateById({ id, user_name, password, is_admin }) {
    const whereOpt = { id };
    const newUser = {};

    user_name && Object.assign(newUser, { user_name });
    password && Object.assign(newUser, { password });
    is_admin && Object.assign(newUser, { is_admin });

    const res = await User.update(newUser, { where: whereOpt });

    return res[0] > 0 ? true : false;
  }
}

module.exports = new UserService();
