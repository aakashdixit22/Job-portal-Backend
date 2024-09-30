import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];
  
  if (!token) {
    return res.status(401).json({ error: "Access denied, no token provided" });
  }
  
  try {

    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    

    req.userId = decoded.userId;
    
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};
