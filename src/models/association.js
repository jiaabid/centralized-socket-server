const Chats = require("./chat");
const ChatUser = require("./chatUser");
const User = require("./user");

// User.belongsToMany(Chats, { through: 'chat_user' ,as:"users",foreignKey:'user_id' });
// Chats.belongsToMany(User, { through: 'chat_user',as:"chats",foreignKey:'chat_id' })

User.belongsToMany(Chats, { as: 'Chats', through: { model: ChatUser, unique: false }, foreignKey: 'user_id' });
Chats.belongsToMany(User, { as: 'Users', through: { model: ChatUser, unique: false }, foreignKey: 'chat_id' });