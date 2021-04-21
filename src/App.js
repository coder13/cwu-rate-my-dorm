import UserProvider, { useUser } from './providers/UserProvider';
import { auth } from './firebase';
import './App.css';

function App() {
  const { user } = useUser();

  return (
    <UserProvider>
      <div className="App">
        {user ? `logged in as ${user}` : 'Not logged in'}

        <button>Sign in with Google</button>
      </div>
    </UserProvider>
  );
}

export default App;
