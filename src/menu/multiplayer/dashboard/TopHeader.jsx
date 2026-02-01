import knightAvatar from '../../../assets/avatars/knight.png'

import { authContext } from '../../../contexts/contexts';
import { useContext } from 'react';

const HEADER_WIDTH = 'w-[550px]'

export default function TopHeader() {
  const { user } = useContext(authContext);
  return (
    <div
      id='dashboard-top-bar'
      className={`
        ${HEADER_WIDTH} flex justify-between items-center
        bg-gray-900 rounded-md border-2 border-amber-300 p-1 shadow-lg shadow-amber-900
      `}
    >
      <div className='relative group flex flex-col justify-center items-center border border-transparent rounded-md hover:border-gray-700 hover:bg-gray-800 hover:scale-102 hover:cursor-pointer p-1 transition-all'>
        <img 
          className='rounded-full border-2 border-amber-100'
          src={knightAvatar} 
          alt='user-avatar' 
        />
        <p
          className='text-amber-300'
          id='username-text'
          aria-label='username-text'
        >
          {user ? user.username : 'PaladinCaesar'}
        </p>
        <span 
          id='view-profile-text'
          className='font-bold border-2 border-gray-700 shadow-lg absolute -bottom-8 rounded-md w-22 text-center bg-gray-800 text-gray-200 opacity-0 group-hover:opacity-100 pointer-events-none transition-all'
        >
          View profile
        </span>
      </div>
    </div>
  )
}