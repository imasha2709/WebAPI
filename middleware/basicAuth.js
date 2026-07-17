function basicAuth(req, res, next) {

    const auth = req.headers.authorization;


    if (!auth) {

        res.set(
            "WWW-Authenticate",
            'Basic realm="Police API"'
        );

        return res.status(401).json({
            message: "Authentication required"
        });
    }


    if (!auth.startsWith("Basic ")) {

        return res.status(401).json({
            message: "Invalid authentication type"
        });
    }


    const encoded = auth.split(" ")[1];


    const decoded = Buffer
        .from(encoded, "base64")
        .toString();


    const [username,password] = decoded.split(":");


    if(
        username !== "police" ||
        password !== "nibm2024"
    ){

        return res.status(403).json({
            message:"Invalid credentials"
        });

    }


    next();
}


module.exports = basicAuth;