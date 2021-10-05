const OnlineUser = require("../models/onlineUser");
const User = require("../models/user")

const addUser = async (req, res) => {
    try {
        console.log(OnlineUser);
        console.log("in adding user", req.body);
        let user = await User.create({
            name: req.body.name
        });
        // let user = await OnlineUser.create({
        //     user_id: 1
        // });
        console.log(user)
        return res.json(user)
    } catch (err) {
        return res.json(err);
    }
}

const getUsers = async (req, res) => {
    try {
        let users = await User.findAll();
        return res.json(users)
    } catch (err) {
        return res.json(err);
    }
}


module.exports = {
    addUser,
    getUsers
};