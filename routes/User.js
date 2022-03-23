const router = require("express").Router();
const UserControler = require('../controlers/UserControler')

router.get("/users", UserControler.getAllUsers);
router.post("/users", UserControler.newUser);
router.get("/users/exercises", (req, res) => res.sendStatus(404));

router.post("/users/:_id/exercises", UserControler.newExcercise);
router.get("/users/:_id/logs", UserControler.getLog);

module.exports = router;
