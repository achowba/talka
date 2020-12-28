const serializeUser = require('../serializers/user.serializer');
const userService = new (require('../services/user.service'));

class HomeController {
    static async renderProfile(req, res, next) {
        res.render('pages/profile.ejs', {
            user: serializeUser(req.user)
        });
    }

    static async renderUsers(req, res, next) {
        const users = await userService.get();

        res.render('pages/users.ejs', {
            user: serializeUser(req.user),
            users: users.map(serializeUser)
        });
    }

    static async renderChat(req, res, next) {
        const receiver = await userService.getById(req.params.id);

        res.render('pages/chat.ejs', {
            sender: serializeUser(req.user),
            receiver: serializeUser(receiver)
        });
    }
}

module.exports = HomeController;
