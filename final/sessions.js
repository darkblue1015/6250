const uuid = require("uuid").v4;

const sessions = {};

function addSession(username) {
  const sid = uuid();
  sessions[sid] = {
    username,
  };

  return sid;
}

function getSessionUser(sid) {
  return sessions[sid]?.username;
}

function getAllActiveUsers() {
  const activeUsers = new Set();

  for (const sid of Object.keys(sessions)) {
    const username = getSessionUser(sid);
    if (username) {
      activeUsers.add(username);
    }
  }

  return Array.from(activeUsers);
}

function deleteSession(sid) {
  delete sessions[sid];
}

// const getSessions = () => sessions;

module.exports = {
  addSession,
  deleteSession,
  getSessionUser,
  getAllActiveUsers,
};
