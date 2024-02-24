const { Schema, SchemaTypes, model, SchemaType } = require('mongoose');

const notificationSchema = new Schema ({
    receiver: {
        type: SchemaTypes.ObjectId,
        ref: "User"
    },
    timestamp: {
        type: SchemaTypes.String
    },
    title: {
        type: SchemaTypes.String
    },
    body: {
        type: SchemaTypes.String
    },
    isRead: {
        type: SchemaTypes.Boolean
    }

})

const Notification = model("Notification", notificationSchema, "notification");
module.exports = Notification;