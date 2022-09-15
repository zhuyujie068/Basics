const Address = require("../model/addr.model");

class AddrService {
  async createAddr(addr) {
    return await Address.create(addr);
  }

  async findAllAddr(user_id) {
    return await Address.findAll({
      attributes: ["id", "consignee", "phone", "address", "is_default"],
      where: { user_id },
    });
  }

  async updateAddr(id, addr) {
    return await Address.update(addr, { where: { id } });
  }

  async removeAddr(id) {
    return await Address.destroy({ where: { id } });
  }

  async setDefaultAddr(user_id, id) {
    // 先将所有地址取消，选中
    await Address.update(
      { is_default: false },
      {
        where: {
          user_id,
        },
      }
    );

    // 再将 传入的 id 设置为默认地址
    return await Address.update(
      { is_default: true },
      {
        where: {
          id,
        },
      }
    );
  }
}

module.exports = new AddrService();
