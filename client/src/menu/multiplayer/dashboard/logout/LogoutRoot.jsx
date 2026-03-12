import axios from 'axios';

import { NavLink, useNavigate, useOutletContext } from 'react-router';
import { authContext } from '../../../../contexts/contexts';
import { useContext } from 'react';
import { useSocket } from '../../../../SocketProvider';

export default function LogoutRoot() {

  const { setTab } = useOutletContext();

  const { dispatchUser } = useContext(authContext);

  const { socket } = useSocket();

  const navigate = useNavigate();

  function handleLogOut() {
    axios
      .get('http://localhost:8080/multiplayer/logout', { withCredentials: true }) 
      .then(response => {
        if (response.data.success) {
          if (socket.readyState === 1) { // Close the websocket connection
            socket.close();
            dispatchUser({ type: 'assign-user', payload: null }); // Nullify user
            navigate('/multiplayer'); // Redirect user to the multiplayer menu
          }
        }
      })
      .catch(err => {
        console.error(err);
        throw new Error(err)
      })
  }

  return (
    <div id='logout-container' className='flex flex-col justify-center items-center h-full'>
      <h1
        id='logout-header'
        className='fontUncial text-2xl text-amber-300 text-center'
      >
        Are you sure you want to log out?
      </h1>
      <div 
        id="buttons-container"
        className='flex items-center justify-center w-1/2 mt-4'
      >
        <button 
          id="yes-btn"
          className='rounded-md font-bold text-xl w-2/4 text-center p-2 button-shadow bg-amber-100 hover:brightness-80 active:brightness-60 hover:cursor-pointer transition-all mr-6'
          onClick={handleLogOut}
        >
          Yes
        </button>
        <NavLink 
          to='/multiplayer/dashboard'
          onClick={() => setTab('Chats')}
          id="no-btn"
          className='rounded-md font-bold text-xl w-2/4 text-center p-2 button-shadow bg-amber-300 hover:brightness-80 active:brightness-60 hover:cursor-pointer transition-all'
        >
          No
        </NavLink>
      </div>
    </div>
  )
}