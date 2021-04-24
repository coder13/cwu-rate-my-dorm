import { Component, createContext } from 'react';
import { auth, generateUserDocument } from '../firebase';

export const UserContext = createContext({ user: null });

class UserProvider extends Component {
  state = {
    user: undefined,
  }

  componentDidMount() {
    console.log(12, this.state.user);
    this.unsub = auth.onAuthStateChanged(async (userAuth) => {
      console.log(14, userAuth);
      if (userAuth) {
        const user = await generateUserDocument(userAuth);
        console.log(15, user);
        this.setState({ user });
      } else {
        this.setState({ user: null });
      }
    });
  }

  componentWillUnmount() {
    this.unsub();
  }

  render() {
    return (
      <UserContext.Provider value={this.state.user}>
        {this.props.children}
        <button onClick={() => alert(auth.currentUser)}>Check</button>
      </UserContext.Provider>
    );
  }
}

export default UserProvider;