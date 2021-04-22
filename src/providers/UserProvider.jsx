import { createContext, useEffect, useState } from 'react';
import { auth } from '../firebase';

export const UserContext = createContext({ user: null });

function UserProvider({ children }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    auth.onAuthStateChanged((userAuth) => {
      setUser(userAuth);
    });
  });

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;