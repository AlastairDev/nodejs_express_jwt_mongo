const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const verify = require('../utils/verifyToken')
const envp = require('../envp')
const {
    registrationValidation,
    loginValidation
} = require('../utils/bodyValidator')

router.post('/singup', async (req, res) => {

    const validation = registrationValidation.validate(req.body)
    if (validation.error) return res.status(400).json(validation.error.details[0].message)

    const emailExist = await User.findOne({
        email: req.body.email
    })
    if (emailExist) {
        return res.status(400).json({
            "msg": "email already exists"
        })
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    })
    user.save().then((err, user) => {
        if (err) {
            res.status(400).json(err)
        } else {
            res.send(user)
        }
    });

})

router.post('/signin', async (req, res) => {
    const validation = loginValidation.validate(req.body)
    if (validation.error) return res.status(400).json(validation.error.details[0].message)

    const user = await User.findOne({
        email: req.body.email,
    })
    if (!user) return res.status(400).json({
        "msg": "email or password is wrong"
    })

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).json({
        "msg": "email or password is wrong"
    })

    const token = jwt.sign({
            _id: user.id,
            date: Date.now
        },
        envp.SECRET
    )

    res.header('auth-token', token).json({
        "token": token
    })

})

router.post('/', verify, async (req, res) => {
    res.json({
        user: req.user
    })
})


module.exports = router