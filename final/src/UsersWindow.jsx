import ActiveUser from "./ActiveUser";
import "./UsersWindow.css";

function UsersWindow({ activeUsers }) {
  return (
    <div className="users__window">
      <p>Active Users</p>
      <ul className="users">
        {Object.values(activeUsers).map((activeUser) => (
          <li className="user" key={activeUser.id}>
            <ActiveUser activeUser={activeUser} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersWindow;
