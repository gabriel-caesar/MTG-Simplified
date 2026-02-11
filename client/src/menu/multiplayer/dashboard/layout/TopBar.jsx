import knightAvatar from '../../../../assets/avatars/knight.png'

import { IoChatboxEllipsesOutline, IoLogInOutline } from "react-icons/io5";
import { GiDungeonGate } from "react-icons/gi";
import { authContext } from '../../../../contexts/contexts';
import { useContext } from 'react';

import TopBarTab from './TopBarTab';
import axios from 'axios';
import { useNavigate } from 'react-router';

const HEADER_WIDTH = 'w-[640px]'

export default function TopBar() {

  const { user, dispatchUser } = useContext(authContext);

  const navigate = useNavigate();

  function handleLogOut() {
    axios
      .get('http://localhost:8080/multiplayer/logout', { withCredentials: true }) 
      .then(response => {
        if (response.data.success) {
          dispatchUser({ type: 'assign-user', payload: null }); // Nullify user
          navigate('/multiplayer'); // Redirect user to the multiplayer menu
        }
      })
      .catch(err => {
        console.error(err);
        throw new Error(err)
      })
  }

  const tabContent = [
    {
      action: null,
      icon: null,
      img: knightAvatar,
      text: user ? user.username : 'Unknown',
      hover_text: 'View profile'
    },
    {
      action: null,
      icon: IoChatboxEllipsesOutline,
      img: null,
      text: 'Chats',
      hover_text: 'Go to chats'
    },
    {
      action: null,
      icon: GiDungeonGate,
      img: null,
      text: 'Lobby',
      hover_text: 'Go to lobby'
    },
    {
      action: handleLogOut,
      icon: IoLogInOutline,
      img: null,
      text: 'Log out',
      hover_text: 'Sign off'
    },
  ];

  return (
    <div
      id='dashboard-topbar'
      className={`
        ${HEADER_WIDTH} flex flex-col justify-between items-center
        bg-gray-900 rounded-md border-2 border-amber-300 shadow-lg shadow-amber-900
      `}
    >
      <div 
        id="topbar-header"
        className='h-fit rounded-t-sm border-b text-amber-300 px-2 w-full bg-gray-800 flex justify-between items-center'
      >
        <h1 className='fontUncial'>
          Menu
        </h1>
      </div>

      <ul id="tabcontent-wrapper" className='flex justify-between items-center w-full px-8 py-2'>
        {tabContent.map(contentTab => {
          return (
            <TopBarTab contentTab={contentTab} key={contentTab.hover_text} />
          )
        })}
      </ul>

    </div>
  )
}