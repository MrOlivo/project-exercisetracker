const { v4 } = require("uuid");

const Users = [];
const Exercises = [];

const getUser = (userId) => Users.filter((user) => user._id == userId)[0];

const getAllUsers = (req, res) => res.json(Users);

const newUser = (req, res) => {
  let { username } = req.body;

  if (username !== "") Users.push({ _id: v4(), username });
  else res.json({ error: "Username can not be empty." });

  return res.json(Users[Users.length - 1]);
};

const newExcercise = (req, res) => {
  let { description, duration, date } = req.body;
  let userId = req.params["_id"];

  if (description === "" || duration <= 1) {
    return res.json({ error: "Description or Duration can not be empty." });
  }

  const user = getUser(userId);
  if (!user) return res.json({ error: "User doesn't exist." });

  let { _id, username } = user;
  let formatedDate = new Date(date).toDateString();

  if (formatedDate === "Invalid Date") {
    formatedDate = new Date().toDateString();
  }

  Exercises.push({
    _id,
    username,
    description: description,
    duration: parseInt(duration),
    date: formatedDate,
  });

  return res.json(Exercises[Exercises.length - 1]);
};

const getLog = (req, res) => {
  const userId = req.params["_id"];
  const { from, to, limit } = req.query;

  const user = getUser(userId);

  if (!user) res.json({ error: "User doesn't exist." });

  let log = Exercises.filter((exercise) => {
    return exercise._id == user["_id"];
  }).map((exercise) => {
    return {
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date,
    };
  });

  if (from) {
    log = log.filter((ele) => new Date(ele.date) > new Date(from));
  }

  if (to) {
    log = log.filter((ele) => new Date(ele.date) < new Date(to));
  }

  if (!isNaN(limit)){
    log = log.slice(0, limit);
  }

  res.json({
    _id: user["_id"],
    username: user["username"],
    count: log.length,
    log: log,
  });
};

module.exports = { getAllUsers, newUser, newExcercise, getLog };
