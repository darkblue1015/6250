import { useState } from "react";
import "./AddMessageForm.css";

function AddMessageForm({ onAddMessage }) {
  const [task, setTask] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    setTask("");
    onAddMessage(task);
  }

  function onTyping(e) {
    setTask(e.target.value);
  }

  return (
    <form className="add__form" action="#/add" onSubmit={onSubmit}>
      <input className="add__task" value={task} onChange={onTyping} />
      <button type="submit" className="add__button">
        Send
      </button>
    </form>
  );
}

export default AddMessageForm;
