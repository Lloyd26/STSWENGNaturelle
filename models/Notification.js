const { Schema, SchemaTypes, model, SchemaType } = require('mongoose');

const notificationSchema = new Schema ({
    receiver: {
        type: SchemaTypes.ObjectId,
        ref: "User"
    },
    type: {
        type: SchemaTypes.String
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
    reservationID: {
        type: SchemaTypes.ObjectId,
        ref: "Reservation"
    },
    reason: {
        type: SchemaTypes.String
    },
    isRead: {
        type: SchemaTypes.Boolean
    }

})

const Notification = model("Notification", notificationSchema, "notifications");
module.exports = Notification;