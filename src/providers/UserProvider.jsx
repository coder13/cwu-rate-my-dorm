import { Component, createContext } from 'react';
import { auth, generateUserDocument } from '../firebase';

export const UserContext = createContext({ user: null });

class UserProvider extends Component {
  state = {
    user: undefined,
  }

  componentDidMount() {
    this.unsub = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        const user = await generateUserDocument(userAuth);
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
      </UserContext.Provider>
    );
  }
}

export default UserProvider;
