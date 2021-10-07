const Chats = require("./chat");
const ChatMessage = require("./chatMessage");
const ChatUser = require("./chatUser");
const GroupChatMessage = require("./groupChatMessage");
const GroupMessages = require("./groupMessage");
const Messages = require("./message");
const Notifications = require("./notification");
const NotificationUser = require("./notificationUser");
const User = require("./user");

// User.belongsToMany(Chats, { through: 'chat_user' ,as:"users",foreignKey:'user_id' });
// Chats.belongsToMany(User, { through: 'chat_user',as:"chats",foreignKey:'chat_id' })

User.belongsToMany(Chats, { as: 'Chats', through: { model: ChatUser, unique: false }, foreignKey: 'user_id' });
Chats.belongsToMany(User, { as: 'Users', through: { model: ChatUser, unique: false }, foreignKey: 'chat_id' });


Messages.belongsToMany(Chats, { as: 'Rooms', through: { model: ChatMessage, unique: false }, foreignKey: 'message_id' });
Chats.belongsToMany(Messages, { as: 'Messages', through: { model: ChatMessage, unique: false }, foreignKey: 'chat_id' });


GroupMessages.belongsToMany(Chats, { as: 'ChatRooms', through: { model: GroupChatMessage, unique: false }, foreignKey: 'message_id' });
Chats.belongsToMany(GroupMessages, { as: 'GroupMessages', through: { model: GroupChatMessage, unique: false }, foreignKey: 'chat_id' });


User.belongsToMany(Notifications, { as: 'Notifications', through: { model: NotificationUser, unique: false }, foreignKey: 'user_id' });
Notifications.belongsToMany(User, { as: 'users', through: { model: NotificationUser, unique: false }, foreignKey: 'notification_id' });
