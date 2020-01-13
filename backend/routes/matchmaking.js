const router = require("express").Router();
const passport = require("passport");
const mongoose = require("mongoose");
const Post = require("../models/Post");
const User = require("../models/User");

router.get(
  "/matches",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    Post.find({ poster: { $ne: req.user._id } })
      .select("-liked -unliked  -__proto__ -__v")
      .populate("poster", "username discord")
      .exec(function(err, posts) {
        if (err) return res.status(400).json({ error: "failed" });
        res.json(posts);
      });
  }
);

router.get(
  "/connect",
  passport.authenticate("jwt", { session: false }),
  function(req, res, next) {
    // Mandatory headers and http status to keep connection open
    const headers = {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache"
    };
    res.writeHead(200, headers);

    // After client opens connection send all nests as string
    const data = `data: ${JSON.stringify(nests)}\n\n`;
    res.write(data);
    req.user.responses.push(res);
    req.user.save();
    // When client closes connection we update the clients list
    // avoiding the disconnected one
    req.on("close", () => {
      const removable = req.user.responses.indexOf(res);
      if (removable !== -1) {
        req.user.responses.splice(removable, 1);
        req.user.save();
      }
    });
  }
);

router.post("/like", passport.authenticate("jwt", { session: false }), function(
  req,
  res
) {
  let userId = mongoose.Types.ObjectId(req.body._id);
  Post.findOne({ _id: userId }).exec(function(err, otherPost) {
    if (req.body.like) {
      otherPost.liked.push(req.user._id);
    } else {
      otherPost.unliked.push(req.user._id);
    }
    otherPost.save();
    Post.findOne({ poster: req.user._id })
      .populate("poster")
      .exec(function(err, userPost) {
        if (userPost.liked.includes(userId) && req.body.like) {
          userPost.responses.map(response => response.write("match:true"));
          return res.json({ match: true });
        }
      });
  });
  res.send("ok");
});

module.exports = router;
