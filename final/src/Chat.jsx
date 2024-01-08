import Loading from "./Loading";
import Message from "./Message";
import "./Chat.css";

function Chat({ messages, isMessagePending }) {
  // All this code before the return is to make the return easier to skim
  const SHOW = {
    // a constant used only in this component
    PENDING: "pending",
    EMPTY: "empty",
    MESSAGES: "messages",
  };

  let show;
  if (isMessagePending) {
    show = SHOW.PENDING;
  } else if (!Object.keys(messages).length) {
    show = SHOW.EMPTY;
  } else {
    show = SHOW.MESSAGES;
  }

  return (
    <div className="content">
      {show === SHOW.PENDING && (
        <Loading className="messages__waiting">Loading Messages...</Loading>
      )}
      {show === SHOW.EMPTY && <p>No Messages yet, add one!</p>}
      {show === SHOW.MESSAGES && (
        <ul className="messages">
          {Object.values(messages).map((message) => (
            <li className="message" key={message.id}>
              <Message message={message} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Chat;
