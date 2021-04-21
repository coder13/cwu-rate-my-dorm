import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';

const UserContext = createContext({ user: null });

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

export const useUser = () => useContext(UserContext);

export default UserProvider;