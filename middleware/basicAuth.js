function basicAuth(req, res, next) {
    const auth = req.headers.authorization;

    if (!auth) {
        res.set("WWW-Authenticate", 'Basic realm="Police API"');
        return res.status(401).json({
            error: "Authentication required"
        });
    }

    if (!auth.startsWith("Basic ")) {
        res.set("WWW-Authenticate", 'Basic realm="Police API"');
        return res.status(401).json({
            error: "Invalid authentication scheme"
        });
    }

    const encoded = auth.split(" ")[1];
    const decoded = Buffer.from(encoded, "base64").toString("utf-8");
    const [username, password] = decoded.split(":");

    if (username !== "police" || password !== "nibm2024") {
        return res.status(403).json({
            error: "Forbidden: Invalid credentials"
        });
    }

    next();
}

module.exports = basicAuth;