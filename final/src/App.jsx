import { useState, useEffect } from "react";

import "./App.css";

import { LOGIN_STATUS, SERVER } from "./constants";
import {
  fetchLogin,
  fetchLogout,
  fetchSession,
  fetchMessages,
  fetchAddMessage,
} from "./services";
import LoginForm from "./LoginForm";
import Loading from "./Loading";
import Controls from "./Controls";
import Status from "./Status";
import AddMessageForm from "./AddMessageForm";
import Chat from "./Chat";
import UsersWindow from "./UsersWindow";

function App() {
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [loginStatus, setLoginStatus] = useState(LOGIN_STATUS.PENDING);
  const [isMessagePending, setIsMessagePending] = useState(false);
  const [messages, setMessages] = useState({});
  const [activeUsers, setActiveUsers] = useState({});

  function onLogin(username) {
    setIsMessagePending(true);
    fetchLogin(username)
      .then((fetchedMessages) => {
        setError("");
        console.log(fetchedMessages);

        setMessages(fetchedMessages.messages);
        setActiveUsers(fetchedMessages.activeUsers);
        setIsMessagePending(false);
        setUsername(fetchedMessages.username);
        setLoginStatus(LOGIN_STATUS.IS_LOGGED_IN);
      })
      .catch((err) => {
        setError(err?.error || "ERROR");
      });
  }

  function onLogout() {
    setError("");
    setUsername("");
    setLoginStatus(LOGIN_STATUS.NOT_LOGGED_IN);
    setMessages({});
    setActiveUsers({});
    fetchLogout().catch((err) => {
      setError(err?.error || "ERROR");
    });
  }

  function onRefresh() {
    setError("");
    setIsMessagePending(true); // Show loading state
    fetchMessages()
      .then((messages) => {
        setMessages(messages.messages);
        setIsMessagePending(false);
      })
      .catch((err) => {
        setError(err?.error || "ERROR"); // Ensure that the error ends up truthy
      });
  }

  function onAddMessage(task) {
    fetchAddMessage(task)
      .then((message) => {
        setMessages(message.messages);
        setActiveUsers(message.activeUsers);
      })
      .catch((err) => {
        setError(err?.error || "ERROR");
      });
  }
  function checkForSession() {
    fetchSession()
      .then((session) => {
        setUsername(session.username);
        setMessages(session.msgs);
        setLoginStatus(LOGIN_STATUS.IS_LOGGED_IN);
        setActiveUsers(session.activeUsers);
        return;
      })
      .catch((err) => {
        if (err?.error === SERVER.AUTH_MISSING) {
          setLoginStatus(LOGIN_STATUS.NOT_LOGGED_IN);
        }
      });
  }

  useEffect(() => {
    checkForSession();
    const intervalId = setInterval(() => {
      checkForSession();
    }, 5000);

    //  return a clear function to make sure to delete the timer
    return () => clearInterval(intervalId);
  }, []); // only run in the initial render

  return (
    <div className="app">
      <main className="">
        {error && <Status error={error} />}

        {loginStatus === LOGIN_STATUS.PENDING && (
          <Loading className="login__waiting">Loading user...</Loading>
        )}

        {loginStatus === LOGIN_STATUS.NOT_LOGGED_IN && (
          <LoginForm onLogin={onLogin} />
        )}

        {loginStatus === LOGIN_STATUS.IS_LOGGED_IN && (
          <div className="content">
            <p>Hello, {username}</p>
            <Controls onLogout={onLogout} onRefresh={onRefresh} />
            <Chat isMessagePending={isMessagePending} messages={messages} />
            <AddMessageForm onAddMessage={onAddMessage} />
            <UsersWindow activeUsers={activeUsers} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
