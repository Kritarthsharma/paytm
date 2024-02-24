const { Router } = require("express");
const { fetchBal, transfer } = require("../controllers/accountController");
const { authMiddleware } = require("../middlewares/userMiddleware");

const router = Router();

router.get("/balance", authMiddleware, fetchBal);
router.post("/transfer", authMiddleware, transfer);

module.exports = router;
