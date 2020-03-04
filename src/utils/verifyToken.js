const jwt = require('jsonwebtoken')
const env = require('../envp')

const auth = (req, res, next) => {
    const token = req.header('auth-token')
    if (!token) return res.status(401).json({
        "msg": "access denied"
    })

    try {
        const verified = jwt.verify(token, env.SECRET)
        req.user = verified
        next()
    } catch (error) {
        res.status(400).send('Invalid Token')
    }
}

module.exports = auth