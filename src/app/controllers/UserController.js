import User from '../models/User';
import * as Yup from 'yup';


class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password_virtual: Yup.string().required().min(6), 
    });
    
    if(!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails'});
    };

    const emailAlreadyExists = await User.findOne({
      where: { email: req.body.email }
    });

    if(emailAlreadyExists) {
      return res.status(400).json({
        error: 'User already exists'
      });
    };

    const { id, name, email, provider } = await User.create(req.body);
    return res.json({
      id,
      name,
      email,
      provider
    });
  };

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password_virtual: Yup.string().min(6).when('oldPassword', (oldPassword, field) => {
        return oldPassword ? field.required() : field;
      }),
      confirmPassword: Yup.string().when('password_virtual', (password_virtual, field) => {
        return password_virtual ? field.required().oneOf([Yup.ref('password_virtual')]) : field;
      }),
    });
    
    if(!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails'});
    };
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if(email && email !== user.email) {
      const emailAlreadyExists = await User.findOne({
        where: { email: email }
      });
  
      if(emailAlreadyExists) {
        return res.status(400).json({ error: 'User already exists' });
      };
    };

    if(oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    };

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider
    });
  };
};

export default new UserController();