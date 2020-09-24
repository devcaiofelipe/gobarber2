import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init({
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      password_virtual: Sequelize.VIRTUAL,
      password: Sequelize.STRING,
      provider: Sequelize.BOOLEAN
    }, {sequelize,});

    this.addHook('beforeSave', async (user) => {
      console.log(user);
      if(user.password_virtual) {
        user.password = await bcrypt.hash(user.password_virtual, 8);
      };
    });
    return this;
  };

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  };

  checkPassword(password) {
    return bcrypt.compare(password, this.password);
  };  
};

export default User;