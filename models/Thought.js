const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');


const ReactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: 'A reaction is required',
            max: 280
        },
        username: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        }
    },
    {
        toJSON: {
            virtuals: true
        },
        id: false
    }
);
//this part isn't working
// UserSchema.virtual('reactionCount').get(function () {
//     return this.replies?.length || 0;
// });

const ThoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: 'Thought is required',
        max: 280
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
    },
    // not sure if this is correct of if I have to reference User somehow
    username: {
        type: String,
        required: 'Username is required'
    },
    reactions: [ReactionSchema],
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;
