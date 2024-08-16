const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { userModel } = require("../schema/userSchema");

exports.createUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const exist = await userModel.findOne({ email });

    if (!exist) {
      const user = await userModel.create({
        email,
        password: bcrypt.hashSync(password, 10),
        refresh: crypto.randomBytes(64).toString("hex"),
      });
      if (user) {
        return res.status(201).send({
          success: true,
          status: true,
          message: "user created",
          data: { id: user._id, email: user.email },
        });
      }
      return res
        .status(400)
        .send({ success: true, status: false, message: "not created" });
    }
    return res.status(400).send({
      success: true,
      status: false,
      message: `${exist.email} already available`,
    });
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (user) {
      const passMatch = bcrypt.compareSync(password, user.password);

      const refreshTokens = user.refresh;

      if (passMatch) {
        const accessToken = jwt.sign({ id: user._id }, refreshTokens, {
          algorithm: "HS256",
          expiresIn: "5m",
        });

        return res.status(200).send({
          message: "Login successful",
          id: user._id,
          accessToken,
        });
      }
      return res.status(401).send({ message: "Credentials do not match" });
    }
    return res.status(404).send({ message: "User not found" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.refresh = async (req, res) => {
  try {
    const { _id, token } = req.body;
    const exist = await userModel.findById({ _id });
    const refreshToken = exist.refresh;
    if (!refreshToken) {
      return res.status(401).send({ message: "Refresh token required" });
    }
    jwt.verify(token, refreshToken, (err, decoded) => {
      console.log(decoded, "decoded");

      if (err) {
        return res.status(403).send({ message: "Invalid token" });
      }

      const accessToken = jwt.sign({ id: decoded.id }, refreshToken, {
        algorithm: "HS256",
        expiresIn: "5m",
      });

      return res.status(200).send({ accessToken });
    });
  } catch (error) {
    return res.status(500).send({ message: "Server error", error });
  }
};
