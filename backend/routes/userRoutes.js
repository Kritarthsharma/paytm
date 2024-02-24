const { Router } = require("express");
const userController = require("../controllers/userController");
const userMiddleware = require("../middlewares/userMiddleware");

const router = Router();

router.post("/signup", userMiddleware.userMiddleware, userController.signUp);
router.post("/signin", userController.signIn);
router.patch("/", userMiddleware.authMiddleware, userController.updateUser);
router.get("/bulk", userMiddleware.authMiddleware, userController.searchUser);

module.exports = router;
