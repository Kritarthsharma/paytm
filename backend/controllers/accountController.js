const Account = require("../models/accountModel");

exports.fetchBal = async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.userId });
    const bal = account.balance;
    return res.json({ balance: bal });
  } catch (error) {
    return res.status(500).send("Unable to fetch balance!");
  }
};

exports.transfer = async (req, res) => {
  const { amount, to } = req.body;
  try {
    const payeeAccount = await Account.findOne({ userId: to });
    if (!payeeAccount)
      return res.status(400).send("Payee account does not exist!");
    const userAccount = await Account.findOne({ userId: req.userId });
    if (!userAccount)
      return res.status(400).send("Payer account does not exist!");
    if (userAccount.balance < amount)
      return res.status(400).send("Not enough balance!");

    const account = await Account.findOneAndUpdate(
      {
        userId: req.userId,
      },
      {
        $inc: {
          balance: -amount,
        },
      },
      { new: true }
    );
    await Account.findOneAndUpdate(
      {
        userId: to,
      },
      {
        $inc: {
          balance: amount,
        },
      }
    );

    return res.json({
      message: "Transfer succesful",
      bal: account.balance,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};
