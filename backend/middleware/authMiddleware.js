export function isAuthenticated(req, res, next) {
  if (req.session && req.session.userEmail) return next();
  return res.status(401).json({ error: "Not authenticated" });
}
