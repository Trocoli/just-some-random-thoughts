const User = require('../models/User')

const bcrypt = require('bcryptjs')


module.exports = class AuthController {

    static login(req, res) {
        res.render('auth/login')
    }
    static async loginPost(req, res) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email:email}})
        if(!user){
            req.flash('message','Email not found')
            res.render('auth/login')
            return
        }
        const passwordMatch = bcrypt.compareSync(password, user.password)
        if(!passwordMatch) {
            req.flash('message','Invalid password!')
            res.render('auth/login')
            return
        }

        // if both confirmations works initialize session
        req.session.userid = user.id
        req.flash('message','Logged in!')
        req.session.save(() => {
            res.redirect('/')
        })
    }
    static register(req, res) {
        res.render('auth/register')
    }
    static async registerPost(req, res) {

        const {name, email, password, confirmpassword} = req.body
        // passwrod confirmation validation
        if(password != confirmpassword) {
            // mensagem
            req.flash('message', 'Passwords does not match!')
            res.render('auth/register')
            return
        }
        // check if user exists
        const checkIfUserExists = await User.findOne({where: {email: email}})
        if(checkIfUserExists) {
            req.flash('message', 'this Email is already in use')
            res.render('auth/register')
            return
        }
        // create a password
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)
        const user = {
            name,
            email,
            password: hashedPassword
        }
        try {
            const createdUser = await User.create(user)

            // initialize session after register
            req.session.userid = createdUser.id 

            req.flash('message', 'Created successfully!')
            req.session.save(() => {
                res.redirect('/')
            })

        } catch (error) {
            console.log(err)
        }
    }
    static logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }
}