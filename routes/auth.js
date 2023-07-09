const router = require("express").Router();
const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const { registerValidation, loginValidation } = require("../validation");

router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) {
    res.send({ isSuccessfull: false, message: error.details[0].message });
    return;
  }

  try {
    const existingAdmin = await Admin.findOne({ email: req.body.email });
    if (existingAdmin) {
      res.send({ isSuccessfull: false, message: "Email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const admin = new Admin({
      name: req.body.name,
      email: req.body.email,
      passwordHash: hashedPassword,
    });

    await admin.save();
    res.send({ isSuccessfull: true });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) {
    res.send({ isSuccessfull: false, message: error.details[0].message });
    return;
  }

  try {
    const existingAdmin = await Admin.findOne({ email: req.body.email });
    if (!existingAdmin) {
      res.send({ isSuccessfull: false, message: "Email doesn't exist" });
      return;
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      existingAdmin.passwordHash
    );
    if (!validPassword) {
      res.send({
        isSuccessfull: false,
        message: "Credentials are not correct",
      });
      return;
    }
    res.send({
      isSuccessfull: true,
      name: existingAdmin.name,
      message: "Success",
    });
    return;
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
