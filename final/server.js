const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;

const messages = require("./messages");
const sessions = require("./sessions");
const users = require("./users");

app.use(cookieParser());
app.use(express.static("./dist"));
app.use(express.json());

app.get("/api/v1/session", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";
  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: "auth-missing" });
    return;
  }

  res.json({
    username,
    msgs: messages.getMsgs(),
    activeUsers: sessions.getAllActiveUsers(),
  });
});

app.post("/api/v1/session", (req, res) => {
  const { username } = req.body;

  if (!users.isValid(username)) {
    res.status(400).json({ error: "required-username" });
    return;
  }

  if (username === "dog") {
    res.status(403).json({ error: "auth-insufficient" });
    return;
  }

  const sid = sessions.addSession(username);

  res.cookie("sid", sid);
  res.json({
    messages: messages.getMsgs(),
    username,
    activeUsers: sessions.getAllActiveUsers(),
  });
});

app.delete("/api/v1/session", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";

  if (sid) {
    res.clearCookie("sid");
  }

  if (username) {
    sessions.deleteSession(sid);
  }

  res.json({ username });
});

app.get("/api/v1/messages", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";
  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: "auth-missing" });
    return;
  }

  res.json({
    messages: messages.getMsgs(),
    activeUsers: sessions.getAllActiveUsers(),
  });
});

app.post("/api/v1/messages", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";
  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: "auth-missing" });
    return;
  }
  const { task } = req.body;
  if (!task) {
    res.status(400).json({ error: "required-task" });
    return;
  }
  messages.addMsg({ sender: username, msg: task });
  res.json({
    messages: messages.getMsgs(),
    activeUsers: sessions.getAllActiveUsers(),
  });
});

app.get("/api/v1/messages/:id", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";
  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: "auth-missing" });
    return;
  }
  const messageList = users.getUserData(username);
  const { id } = req.params;
  if (!messageList.contains(id)) {
    res
      .status(404)
      .json({ error: `noSuchId`, message: `No message with id ${id}` });
    return;
  }
  res.json(messageList.getMessage(id));
});

app.put("/api/v1/messages/:id", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";
  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: "auth-missing" });
    return;
  }
  const messageList = users.getUserData(username);
  const { id } = req.params;
  const { task, done = false } = req.body;
  if (!task) {
    res.status(400).json({ error: "required-task" });
    return;
  }
  if (!messageList.contains(id)) {
    res
      .status(404)
      .json({ error: `noSuchId`, message: `No Message with id ${id}` });
    return;
  }
  messageList.updateMessage(id, { task, done });
  res.json(messageList.getMessage(id));
});

app.patch("/api/v1/messages/:id", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";
  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: "auth-missing" });
    return;
  }
  const { id } = req.params;
  const { task, done } = req.body;
  const messageList = users.getUserData(username);
  if (!messageList.contains(id)) {
    res
      .status(404)
      .json({ error: `noSuchId`, message: `No Message with id ${id}` });
    return;
  }
  messageList.updateMessage(id, { task, done });
  res.json(messageList.getMessage(id));
});

app.delete("/api/v1/messages/:id", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";
  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: "auth-missing" });
    return;
  }
  const { id } = req.params;
  const messageList = users.getUserData(username);
  const exists = messageList.contains(id);
  if (exists) {
    messageList.deleteMessage(id);
  }
  res.json({
    message: exists ? `Message ${id} deleted` : `Message ${id} did not exist`,
  });
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
