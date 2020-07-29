import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../../config/auth';

class UserController{
    async store(req, res){
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().required()
            .min(6)
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({ error: 'Validation fails' })
        }
        
        const userExists = await User.findOne({ where: {email: req.body.email }})

        if(userExists){
            return res.status(400).json({
                error: 'This email is already in use.'
            })
        }

        const {id, email, nickname} = await User.create(req.body);

        return res.json({
            user: {
                id,
                email,
                nickname
            }, 
            token: jwt.sign({ id }, authConfig.secret , {
                expiresIn: authConfig.expiresIn,
            })
        })
    }

    async update(req, res){
        const schema = Yup.object().shape({
            nickname: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string().min(6),
            password: Yup.string()
                .min(6)
                .when('oldPassword', (oldPassword, field) => {
                    return oldPassword ? field.required() : field
            })
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({ error: 'Validation fails' })
        }

        const { email, oldPassword } = req.body;

        const user = await User.findByPk(req.userId) //auth

        if(email){
            if (email !== user.email) {
                const userExists = await User.findOne({ where: { email }})

                if (userExists){
                    return res.status(400).json({ error: 'An user with this email already exists.'})
                }
            }
        }
        

        if (oldPassword && !(user.checkPassword(oldPassword))){
            return res.status(401).json({ error: 'Password does not match'})
        }

        await user.update(req.body);

        const { id, nickname } = await User.findByPk(req.userId)

        return res.json({
            id,
            email,
            nickname
        })
    }
}

export default new UserController()