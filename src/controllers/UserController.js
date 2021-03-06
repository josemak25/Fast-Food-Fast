import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel';
require('dotenv').config();

class UserController {
    signUp(request, response) {
      UserModel.createUser(request.body).then((result) => {
          const payload = {
              isAdmin: (result[0].email === process.env.ADMIN) ? true : false,
              userId: result[0].id,
              email: result[0].email
          };
          result[0].token = jwt.sign(payload, process.env.SECRET_KEY);
          response.status(201).json({ status: 'success', data: result[0] });
      });
    }

    login(request, response) {
      UserModel.login(request.body.email).then((result) => {
          const output = (result.length < 1) ? 'Invalid email or password' :
          (bcrypt.compareSync(request.body.password, result[0].password)) ? 'verified' :
          'Invalid email or password';
          if (output !== 'verified') {
              response.status(400).json({ status: 'error', message: output });
          } else {
              const payload = {
                  isAdmin: (result[0].email === process.env.ADMIN) ? true : false,
                  userId: result[0].id,
                  email: result[0].email
              };
              const token = jwt.sign(payload, process.env.SECRET_KEY);
              response.status(200).json({ status: 'success', token });
          }
      });
    }

    getUser(request, response) {
      UserModel.getUser(request.auth.userId).then((result) => {
          if (result.length > 0) {
            const { name, email, phone } = result[0];
            response.status(200).json({ status: 'success', data: { name, email, phone } });
          } else {
            response.status(401).json({ status: 'error', message: 'authentication failed' });
          }
          
      });
    }
}

export default new UserController();