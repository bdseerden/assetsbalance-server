const bcrypt = require("bcrypt");
const { Router } = require("express");
const { toJWT } = require("../auth/jwt");
const authMiddleware = require("../auth/middleware");
const User = require("../models/").user;
const Holding = require("../models/").holding;
const { SALT_ROUNDS } = require("../config/constants");

const router = new Router();

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Please provide both email and password" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).send({
        message: "User with that email not found or password incorrect",
      });
    }

    delete user.dataValues["password"]; // don't send back the password hash
    const token = toJWT({ userId: user.id });
    return res.status(200).send({ token, user: user.dataValues });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).send("Please provide an email, password and a name");
  }

  try {
    const newUser = await User.create({
      email,
      password: bcrypt.hashSync(password, SALT_ROUNDS),
      name,
    });

    delete newUser.dataValues["password"]; // don't send back the password hash

    const token = toJWT({ userId: newUser.id });

    const newBTC = await Holding.create({
      asset: "BTC",
      amount: 0,
      userId: newUser.id,
    });

    const newETH = await Holding.create({
      asset: "ETH",
      amount: 0,
      userId: newUser.id,
    });

    const newLTC = await Holding.create({
      asset: "LTC",
      amount: 0,
      userId: newUser.id,
    });

    const newXRP = await Holding.create({
      asset: "XRP",
      amount: 0,
      userId: newUser.id,
    });

    const newAAPL = await Holding.create({
      asset: "AAPL",
      amount: 0,
      userId: newUser.id,
    });

    const newABNB = await Holding.create({
      asset: "ABNB",
      amount: 0,
      userId: newUser.id,
    });

    const newAMD = await Holding.create({
      asset: "AMD",
      amount: 0,
      userId: newUser.id,
    });

    const newAMZN = await Holding.create({
      asset: "AMZN",
      amount: 0,
      userId: newUser.id,
    });

    res.status(201).json({
      token,
      user: newUser.dataValues,
      holdings: {
        BTC: { ...newBTC.dataValues },
        ETH: { ...newETH.dataValues },
        LTC: { ...newLTC.dataValues },
        XRP: { ...newXRP.dataValues },
        AAPL: { ...newAAPL.dataValues },
        ABNB: { ...newABNB.dataValues },
        AMD: { ...newAMD.dataValues },
        AMZN: { ...newAMZN.dataValues },
      },
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .send({ message: "There is an existing account with this email" });
    }

    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

// The /me endpoint can be used to:
// - get the users email & name using only their token
// - checking if a token is (still) valid
router.get("/me", authMiddleware, async (req, res) => {
  // don't send back the password hash
  delete req.user.dataValues["password"];
  res.status(200).send({ ...req.user.dataValues });
});

module.exports = router;
