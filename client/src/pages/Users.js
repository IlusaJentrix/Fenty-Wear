import React, { useContext} from 'react';
import { UserContext } from '../context/UserContext';

const Users = () => {
  const { currentUser, allUsers, deleteAccount,getAllUsers } = useContext(UserContext);

  // Fetch users when the component mounts
  
  // Check if the current user is an admin
  const isAdmin = currentUser && currentUser.role === 'Admin';

  console.log("All Users from Users page: ", allUsers);
  return (
    <div className="container mt-5">
      {isAdmin ? (
        <>
          <h2>User Management</h2>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allUsers && allUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        deleteAccount(user.id);
                        getAllUsers();

                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div className="text-center">
          <div className="alert alert-danger mt-4" role="alert">
            You are not authorized to view this page.
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
