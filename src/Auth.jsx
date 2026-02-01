import axios from 'axios';

import { useEffect, useReducer } from 'react';
import { authContext } from './contexts/contexts';
import { userReducer } from './reducers/reducers';

export default function Auth({ children }) {
  const [user, dispatchUser] = useReducer(userReducer, null);

  // Contacts the backend to know if user is authenticated
  useEffect(() => {
    axios
      .get('http://localhost:8080/multiplayer/auth', { withCredentials: true })
      .then(response => {
        if (response.data.user)
          dispatchUser({ type: 'assign-user', payload: response.data.user });
      })
      .catch(err => {
        console.error(err)
        throw new Error(err)
      })
  }, [])

  const values = { user, dispatchUser };

  return (
    <authContext.Provider value={ values }>
      { children }
    </authContext.Provider>
  )
}