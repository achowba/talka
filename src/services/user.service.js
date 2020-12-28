const Service = require('./index');
const User = require('../models/user.model');
const ErrorHelper = require('../helpers/error.helper');

class UserService extends Service {
    constructor() {
        super(User);
    }

    async create(payload) {
        const exist = await this.emailExists(payload.email);

        if (exist) {
            ErrorHelper.error_unprocessable_entity(`A user with this email already exist!`);
        }

        const user = await this.model.create(payload);
        return user.save();
    }

    async get(filters = {}, query = {}, options = {}) {
        return super.get(filters, query, options);
    }

    async getById(_id, filters = {}) {
        return super.getById(_id, filters);
    }

    async update(_id, payload) {
        const user = await this.getById(_id);

        user.dob = payload.dob || user.dob;
        user.username = payload.username || user.username;

        return user.save();
    }

    async delete(_id) {
        const user = await this.getById(_id);
        return await this.model.findOneAndDelete({ _id: user._id });
    }

    async emailExists(email) {
        return await this.model.exists({ email });
    }
}

module.exports = UserService;
