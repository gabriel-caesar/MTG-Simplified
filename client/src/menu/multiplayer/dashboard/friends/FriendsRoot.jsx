import axios from 'axios';

import { useContext, useState } from 'react';
import { authContext } from '../../../../contexts/contexts';
import { LoaderCircle } from 'lucide-react';
import { useSocket } from '../../../../SocketProvider';

export default function FriendsRoot() {
  const { user, dispatchUser } = useContext(authContext);
  const { socket } = useSocket();

  const [friendUsername, setFriendUsername] = useState('');
  const [inviteSent, setInviteSent] = useState(null);
  const [formErrors, setFormErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function sendInvite() {
    // Formatting the friend username as the backend expects
    const formData = { senderUsername: user.username, friendUsername: friendUsername };

    // Validates the friend username and check if it exists
    axios
      .post('http://localhost:8080/multiplayer/add-friend', formData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {          
          setInviteSent('Invite sent successfully')

          // Updating user object
          const invite = response.data.invite
          const updatedUserObj = { 
            ...user, 
            friend_invites: [ ...user.friend_invites, invite ] 
          }

          dispatchUser({ type: 'assign-user', payload: updatedUserObj });
          // Communicate with websockets
          const socketMessage = {
            to: invite.to,
            from: user._id,
            type: 'send-friend-invite',
            content: invite
          }
          socket.send(JSON.stringify(socketMessage))
        }
      })
      .catch((err) => {
        console.log(err)
        setFormErrors(err.response.data);
        setInviteSent(null); // Clear invite sent feedback
      })
      .finally(() => setIsLoading(false));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    sendInvite();
    setFriendUsername(''); // Clear the input
    return;
  }

  return (
    <>
    <div 
      id="container-header"
      className='rounded-t-sm border-b text-amber-300 p-2 w-full bg-gray-800 flex items-start'
    >
      <h1 className='fontUncial text-center'>
        Add a friend
      </h1>

    </div>
    <form
      id='add-friend-form'
      onSubmit={handleSubmit}
      className='flex flex-col justify-center items-center h-3/4 w-full'
    >

      <label
        htmlFor='add-friend-input'
        id='add-friend-header'
        className='fontUncial text-2xl text-amber-300 text-center'
      >
        Add a friend
      </label>
      <input
        value={friendUsername}
        onChange={(e) => {
          if (e.target.value.length <= 50) setFriendUsername(e.target.value);
        }}
        type='text'
        placeholder={`Friend's username...`}
        name='add_friend_input'
        id='add-friend-input'
        className={`
          ${(!formErrors && !inviteSent) && 'mb-4'}
          rounded-md p-2 border border-transparent bg-amber-100 button-shadow mt-4 
          focus-within:outline-none focus-within:border-amber-300 focus-within:scale-105 
          transition-all w-1/2 text-xl
        `}
        autoFocus
      />

      {formErrors ? (
        <SubmissionFeedback
          loading={isLoading}
          response={formErrors}
          setResponse={setFormErrors}
        />
      ) : inviteSent && (
        <SubmissionFeedback
          loading={isLoading}
          response={inviteSent}
          setResponse={setInviteSent}
        />
      )}

      <button
        disabled={isLoading}
        type='submit'
        id='add-friend-button'
        className={`
          ${isLoading ? 'bg-gray-700' : 'bg-amber-300'}
          rounded-md font-bold text-xl text-center p-2 button-shadow hover:brightness-80 active:brightness-60 hover:cursor-pointer transition-all w-1/2 flex justify-center items-center
        `}
      >
        {isLoading ? <LoaderCircle className='spin scale-150 text-amber-300' /> : 'Add'}
      </button>
    </form></>
  );
}

function SubmissionFeedback({ loading, response, setResponse }) {
  const color_condition = response.errors
    ? 'bg-red-500'
    : response.notices
      ? 'bg-green-600'
      : '';

  return (
    <div
      id='submission-feedback-container'
      className={`${color_condition} button-shadow rounded-md font-bold p-2 my-2`}
    >
      {loading ? (
        <LoaderCircle className='spin scale-150 text-amber-100' />
      ) : response.errors ? (
        <ul id='error-list' className='text-lg text-amber-100 font-bold'>
          {response.errors ? (
            response.errors.map((err) => <li key={err}>• {err}</li>)
          ) : (
            <p>Something went wrong, try again</p>
          )}
        </ul>
      ) : (
        response.notices &&
        response.notices.map((notice, index) => {
          return (
            <p
              key={index}
              id='notice-text'
              className='text-center text-lg text-gray-950 font-bold'
            >
              {notice}
            </p>
          );
        })
      )}
    </div>
  );
}
