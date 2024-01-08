function Message({ message }) {
  return (
    <>
      <label>
        <span>{message.sender}: </span>
        <span data-id="${message.sender}">{message.msg}</span>
      </label>
    </>
  );
}

export default Message;
