const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const getUserByToken = require("../helpers/get-user-by-token");
const getToken = require("../helpers/get-token");
const createUserToken = require("../helpers/create-user-token");
const { imageUpload } = require("../helpers/image-upload");
const { BadRequestError, NotFoundError } = require("../helpers/api-error");

module.exports = class UserController {
  static async register(req, res, next) {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;

    try {
      if (!name) {
        throw new BadRequestError("O nome é obrigatório!");
      }

      if (!email) {
        throw new BadRequestError("O e-mail é obrigatório!");
      }

      if (!phone) {
        throw new BadRequestError("O telefone é obrigatório!");
      }

      if (!password) {
        throw new BadRequestError("A senha é obrigatória!");
      }

      if (!confirmpassword) {
        throw new BadRequestError("A confirmação de senha é obrigatória!");
      }

      if (password != confirmpassword) {
        throw new BadRequestError(
          "A senha e a confirmação precisam ser iguais!"
        );
      }
      const userExists = await User.findOne({where: {email: email}});
      console.log(userExists)

      if (userExists) {
        throw new BadRequestError("Por favor utilize outro e-mail!");
      }

      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = new User({
        name: name,
        email: email,
        phone: phone,
        password: passwordHash,
      });

      const newUser = await user.save();

      return res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    try {
      if (!email) {
        throw new BadRequestError("O e-mail é obrigatório!");
      }

      if (!password) {
        throw new BadRequestError("A senha é obrigatória!");
      }

      const user = await User.findOne({where: {email: email}});

      if (!user) {
        throw new NotFoundError("Não há usuário cadastrado com este e-mail!");
      }

      const checkPassword = await bcrypt.compare(password, user.password);

      if (!checkPassword) {
        throw new BadRequestError("Senha inválida!");
      }
      await createUserToken(user, req, res);
    } catch (erro) {
      next(erro);
    }
  }

  static async checkUser(req, res) {
    let currentUser;

    if (req.headers.authorization) {
      const token = getToken(req);
      const decoded = jwt.verify(token, "nossosecret");

      currentUser = await User.findById(decoded.id);

      currentUser.password = undefined;
    } else {
      currentUser = null;
    }

    res.status(200).send(currentUser);
  }

  static async getUserById(req, res, next) {
    const id = req.params.id;

    try {
      const user = await User.findById(id);

      if (!user) {
        throw new NotFoundError("Usuário não encontrado!");
      }
      res.status(200).json({ user });
    } catch (erro) {
      next(erro);
    }
  }

  static async editUser(req, res, next) {
    const token = getToken(req);

    const user = await getUserByToken(token);

    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;

    let image = "";

    if (req.file) {
      image = req.file.filename;
    }

    try {
      if (!name) {
        throw new BadRequestError("O nome é obrigatório!");
      }

      user.name = name;

      if (!email) {
        throw new BadRequestError("O e-mail é obrigatório!");
      }

      const userExists = await User.findOne({ email: email });

      if (user.email !== email && userExists) {
        throw new BadRequestError("Por favor, utilizar outro e-mail!");
      }

      user.email = email;

      if (image) {
        const imageName = req.file.filename;
        user.image = imageName;
      }

      if (!phone) {
        throw new BadRequestError("O telefone é obrigatório!");
      }

      user.phone = phone;

      if (password != confirmpassword) {
        throw new BadRequestError("As senhas não conferem!");
      } else if (password == confirmpassword && password != null) {
        const salt = await bcrypt.genSalt(12);
        const reqPassword = req.body.password;

        const passwordHash = await bcrypt.hash(reqPassword, salt);

        user.password = passwordHash;
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $set: user },
        { new: true }
      );
      res.json({
        message: "Usuário atualizado com sucesso!",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }
};
