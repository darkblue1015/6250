const msgs = [
  { sender: "Bob", msg: "Hi, I am bob" },
  { sender: "Ada", msg: "hello, I am ada" },
];

const addMsg = ({ sender, msg }) => {
  msgs.push({ sender, msg });
};

const getMsgs = () => {
  return msgs;
};

module.exports = {
  addMsg,
  getMsgs,
};
