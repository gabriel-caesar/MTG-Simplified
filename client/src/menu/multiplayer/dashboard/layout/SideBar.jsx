import axios from 'axios';

import { FaCheck, FaPlus, FaUserClock, FaUserPlus, FaX } from "react-icons/fa6";
import { authContext } from '../../../../contexts/contexts';
import { useContext } from 'react';
import { NavLink } from 'react-router';
import { useSocket } from '../../../../SocketProvider';

export default function SideBar({ h }) {

  const { user, dispatchUser } = useContext(authContext);
  const { socket } = useSocket();

  if (!user) return null; // Forcing the user to be fetched before displaying anything

  function acceptInvite(invite) {
    axios
      .post('http://localhost:8080/multiplayer/accept-friend', invite, {
        withCredentials: true,
      })
      .then((response) => {
        // Updating user object
        const sender = response.data.sender
        const updatedUserObj = {
          ...user,
          friends: [ ...user.friends, sender ],
          friend_invites: user.friend_invites.filter(f => f.from !== sender._id)
        }

        dispatchUser({ type: 'assign-user', payload: updatedUserObj })

        // Communicate with websockets
        const socketMessage = {
          to: sender._id,
          from: user._id,
          type: 'accept-friend-invite'
        }
        socket.send(JSON.stringify(socketMessage))
      })
      .catch((err) => {
        window.alert(`An error had occurred: ${err}`)
      })
  }

  function denyInvite() {
    return
  }

  return (
    <div
      id="sidebar-container"
      className={`${h} w-1/5 bg-gray-900 rounded-md border-2 border-amber-300 shadow-lg shadow-amber-900 relative`}
    >
      <div 
        id="container-header"
        className='rounded-t-sm border-b text-amber-300 p-2 w-full bg-gray-800 text-center'
      >
        <h1 className='fontUncial text-center'>
          Friend list
        </h1>

      </div>

      <ul
        id='friends-unordered-list'
        className='flex flex-col'
      >

        {(user && user.friend_invites) && (
          user.friend_invites.map(invite => {
            return (
              <div
                id='friend-invite-container'
                className='group relative flex items-center justify-center flex-col px-4 py-1 font-bold text-amber-300 not-first:border-t border-b bg-gray-950'
                key={invite.sender}
              >
                <div className='flex items-center justify-around w-full' id='name-icon-wrapper'>
                  {user.username === invite.recipient ? <FaUserPlus /> : <FaUserClock />}
                  <p className='text-gray-400'>
                    {
                      user.username === invite.recipient
                        ? invite.sender
                        : invite.recipient
                    }
                  </p>
                </div>
                
                { user.username === invite.recipient && (
                  <>
                    <button 
                      className='opacity-0 group-hover:opacity-100 absolute -left-6.5 border border-r-transparent h-full rounded-tl rounded-bl p-1 text-amber-300 bg-gray-950 flex justify-center items-center hover:bg-amber-400 hover:text-gray-950 hover:cursor-pointer button-shadow transition-all'
                      id='accept-invite'
                      onClick={() => acceptInvite(invite)}
                    >
                      <FaCheck />
                    </button>

                    <button 
                      className='opacity-0 group-hover:opacity-100 absolute -right-6.5 rounded-br rounded-tr border border-l-transparent p-1 text-amber-300 bg-gray-950 h-full flex justify-center items-center hover:bg-red-600 hover:text-gray-950 hover:cursor-pointer button-shadow transition-all'
                      id='deny-invite'
                      onClick={denyInvite}
                    >
                      <FaX />
                    </button>
                  </>
                )}
              </div>
            )
          })
        )}

        {user.friends.length <= 0 ? (
          <p className='mt-2 text-gray-500 text-center font-bold'>No friends added yet</p>
        ) : (
          user.friends.map(friend => 
            <p 
              key={friend._id}
              className='text-center text-amber-300'
            >
              {friend.username}
            </p>
          )
        )}

      </ul>


      <AddFriendButton />
    </div>
  )
}

function AddFriendButton() {
  return (
    <NavLink to='friends' id="friend-button-wrapper" className='absolute bottom-2 right-2 group'>
      <button 
        id="add-friend-button"
        className='text-amber-300 text-2xl relative p-1 rounded-md hover:bg-gray-700 hover:cursor-pointer transition-all'
      >
        <FaPlus />
      </button>
      <span 
        id='friend-btn-hover-text'
        className='font-bold border-2 border-gray-700 shadow-lg absolute translate-y-1/6 -translate-x-full -left-2 rounded-md w-22 text-center bg-gray-800 text-gray-200 opacity-0 group-hover:opacity-100 pointer-events-none transition-all'
      >
        Add friend
      </span>
    </NavLink>
  )
}