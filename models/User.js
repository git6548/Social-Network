const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: 'Username is required',
        trim: true
    },
    email: {
        type: String,
        required: 'Email is required',
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid e-mail address']
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }
    ],
    // not totally sure about this one
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
},
{
    toJSON: {
      virtuals: true
    },
    id: false
  }
  );

  UserSchema.virtual('friendCount').get(function() {
    return this.replies.length;
  });

const User = model('User', UserSchema);

module.exports = User;
