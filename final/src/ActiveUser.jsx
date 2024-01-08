function ActiveUser({ activeUser }) {
  // replace all username here of activeUsers, everything got solved
  return (
    <>
      <label>
        <span data-id="${activeUser}">{activeUser}(Active)</span>
      </label>
    </>
  );
}

export default ActiveUser;
