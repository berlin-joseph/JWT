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
          data: [user.email, user.password],
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
        const accessToken = jwt.sign({ id: user._id }, "hi_Ruby", {
          algorithm: "HS256",
          expiresIn: "5m",
        });

        const refreshToken = jwt.sign({ id: user._id }, refreshTokens, {
          algorithm: "HS256",
          expiresIn: "7d",
        });

        return res.status(200).send({
          message: "Login successful",
          accessToken,
          refreshToken,
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
    const { _id } = req.body;
    const exist = await userModel.findById({ _id });
    const refreshToken = exist.refresh;
    if (!refreshToken) {
      return res.status(401).send({ message: "Refresh token required" });
    }

    const user = await userModel.findOne({ refresh: refreshToken });

    if (!user) {
      return res.status(403).send({ message: "Invalid refresh token" });
    }

    jwt.verify(refreshToken, exist.refresh, (err, decoded) => {
      if (err) {
        return res.status(403).send({ message: "Invalid refresh token" });
      }

      const accessToken = jwt.sign({ id: decoded.id }, "hi_Ruby", {
        algorithm: "HS256",
        expiresIn: "5m",
      });

      return res.status(200).send({ accessToken });
    });
  } catch (error) {
    return res.status(500).send({ message: "Server error", error });
  }
};
