const User = require("../models").user;
const Holding = require("../models").holding;
const { Router } = require("express");
const { toJWT } = require("../auth/jwt");
const authMiddleware = require("../auth/middleware");

const router = new Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  console.log(id);
  if (isNaN(parseInt(id))) {
    return res.status(400).send({ message: "User id is not a number" });
  }

  const holding = await User.findByPk(id, {
    include: [Holding],
    order: [[Holding, "asset", "ASC"]],
  });

  if (holding === null) {
    return res.status(404).send({ message: "User not found" });
  }

  res.status(200).send({ message: "ok", holding });
});

router.patch("/update/:id", async (req, res) => {
  const { asset, amount } = req.body;

  const specificAsset = await Holding.findOne({
    where: {
      asset: asset,
      userId: req.params.id,
    },
  });

  const response = await specificAsset.update({
    amount: specificAsset.amount + parseInt(amount),
  });

  return res.status(200).send(response);
});

module.exports = router;
