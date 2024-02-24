const z = require("zod");
const jwt = require("jsonwebtoken");

const signUpSchema = z.object({
  userName: z.string().min(3),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  passWord: z.string().min(6),
});

const signInSchema = z.object({
  userName: z.string().min(3),
  passWord: z.string().min(6),
});

exports.userMiddleware = (req, res, next) => {
  const { success } =
    req.url === "/signup"
      ? signUpSchema.safeParse(req.body)
      : signInSchema.safeParse(req.body);

  if (!success)
    return res
      .status(422)
      .send(
        "Incorrect inputs / Make sure your password is 6 or more characters long. Try Again!"
      );
  next();
};

exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).send("Not Authorized!");

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(403).send("Token provided is Incorrect!");
  }
};
