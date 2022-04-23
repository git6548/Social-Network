const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

const { Thought, User } = require('./models');
const { db } = require('./models/User');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// not sure what to put here for db
mongoose.connect(
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Userdb',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
)

mongoose.set('debug', true);


// /api/users
// get all users
app.get("/api/users", (req, res) => {
    User.find({})
        .then(dbUser => {
            console.log(typeof dbUser)
            res.json(dbUser);
        })
        .catch(err => {
            console.error(err);
            res.json(err);
        });
});
// GET a single user by its _id and populated thought and friend data
app.get("/api/users/:id", (req, res) => {
    User.findOne({ _id: req.params.id })
        .populate('friends')
        .populate('thoughts')
        .then((dbUser) => {
            //console.log(dbUser)
            if (!dbUser) {
                return res.status(404)
            }
            res.json(dbUser);
        })
        .catch(err => {
            res.json(err);
        });
});

// POST a new user:
app.post("/api/users", ({ body }, res) => {
    User.create(body)
        .then(dbUser => {
            res.json(dbUser);
        })
        .catch(err => {
            res.json(err);
        });

});

// PUT to update a user by its _id
app.put('/api/users/:id', ({ params, body }, res) => {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true })
        .then(dbUser => {
            if (!dbUser) {
                res.json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbUser);
        })
        .catch(err => {
            res.json(err);
        });
});

// DELETE to remove user by its _id
app.delete('/api/users/:id', ({ params }, res) => {
    User.findOneAndDelete({ _id: params.id })
        .then(dbUser => {
            if (!dbUser) {
                res.json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbUser);
        })
        .catch(err => {
            res.json(err);
        });
});

// /api/users/:userId/friends/:friendId
// POST to add a new friend to a user's friend list
app.post("/api/users/:userId/friends/:friendId", (req, res) => {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: { friendId: req.params.friendId } } },
        { runValidators: true, new: true }
    )
    .then((dbUser) => {
        if (!dbUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(dbUser);
    })
        .catch(err => {
            res.json(err);
        });
});
// DELETE to remove a friend from a user's friend list
app.delete('/api/users/:userId/friends/:friendId', (req, res) => {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: { friendId: req.params.friendId } } },
      { runValidators: true, new: true }
    )
      .then(dbUser => {
        if (!dbUser) {
          return res.status(404).json({ message: 'No friend with this id!' });
        }
        res.json(dbUser);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });


// /api/thoughts
// GET to get all thoughts
app.get("/api/thoughts", (req, res) => {
    Thought.find({})
        .then(dbThought => {
            console.log(typeof dbThought)
            res.json(dbThought);
        })
        .catch(err => {
            console.error(err);
            res.json(err);
        });
});
// GET to get a single thought by its _id
app.get("/api/thoughts/:id", (req, res) => {
    Thought.findOne({ _id: req.params.id })
        .then((dbThought) => {
            if (!dbThought) {
                return res.status(404)
            }
            res.json(dbThought);
        })
        .catch(err => {
            res.json(err);
        });
});

//i'm not sure how to tie the username part of this
// POST to create a new thought (don't forget to push the created thought's _id to the associated user's thoughts array field)
app.post("/api/thoughts", ({ body }, res) => {
    Thought.create(body)
        .then(dbThought => {
            res.json(dbThought);
        })
        .catch(err => {
            res.json(err);
        });

});

// PUT to update a thought by its _id
app.post('/api/thoughts/:id', ({ params, body }, res) => {
    Thought.findOneAndUpdate({ _id: params.id }, body, { new: true })
        .then(dbThought => {
            if (!dbThought) {
                res.json({ message: 'No thought found with this id!' });
                return;
            }
            res.json(dbThought);
        })
        .catch(err => {
            res.json(err);
        });
});

// DELETE to remove a thought by its _id
app.delete('/api/thoughts/:id', ({ params }, res) => {
    Thought.findOneAndDelete({ _id: params.id })
        .then(dbThought => {
            if (!dbThought) {
                res.json({ message: 'No thought found with this id!' });
                return;
            }
            res.json(dbThought);
        })
        .catch(err => {
            res.json(err);
        });
});


// /api/thoughts/:thoughtId/reactions
// POST to create a reaction stored in a single thought's reactions array field
app.post('/api/thoughts/:thoughtId/reactions', (req, res) => {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then(dbThought => {
        if (!dbThought) {
          return res.status(404).json({ message: 'No thought with this id!' });
        }
        res.json(dbThought);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

// DELETE to pull and remove a reaction by the reaction's reactionId value
app.delete('/api/thoughts/:thoughtId/reactions/:reactionId', (req, res) => {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then(dbThought => {
        if (!dbThought) {
          return res.status(404).json({ message: 'No thought with this id!' });
        }
        res.json(dbThought);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`App running on port ${PORT}!`)
    })
})