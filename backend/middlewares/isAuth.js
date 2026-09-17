import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    let token = req.cookies?.token;

    // Support Authorization: Bearer xxx
    if (!token) {
      const authHeader = req.headers.authorization;

      if (
        authHeader &&
        authHeader.startsWith("Bearer ")
      ) {
        token = authHeader.split(" ")[1];
      }
    }

    console.log("TOKEN:", token);

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: No token provided",
      });
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
console.log("JWT_SECRET =", process.env.JWT_SECRET);
console.log("TOKEN =", token);
    req.user = decodedToken;

    next();

  } catch (error) {
    console.log(error);

    return res.status(401).json({
      message:
        "Unauthorized: Invalid or expired token",
    });
  }
};

export default isAuth;