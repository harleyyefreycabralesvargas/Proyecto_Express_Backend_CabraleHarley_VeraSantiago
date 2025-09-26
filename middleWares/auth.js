// Impotamos jwt para manejar tokens de acceso
import jwt from "jsonwebtoken";
// cargamos nuestra token para autorizar el uso de otros tokens
const SECRET = process.env.JWT_SECRET;
// autenticacion con token de sesion
export function authMiddleware(req, res, next) {
// verifica el token exista
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token requerido" });
// valida que el token esta correcto
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    // si es correcto nos deja pasar 
    req.user = user;
    next();
  });
}
// verifica sila persona que inicio sesion es admin y le da permiso a rutas avazadas
export function esAdmin(req, res, next) {
  if (req.user.rol !== "admin") {
    return res.status(403).json({ error: "Acceso denegado" });
  }
  next();
}