import { NavLink } from 'react-router';
import { dashboardContext } from '../../../../contexts/contexts'
import { useContext } from 'react'
import { useSocket } from '../../../../SocketProvider';

export default function TopBarTab({ contentTab }) {

  const { tab, setTab } = useContext(dashboardContext);

  const { connected } = useSocket();

  return (
    <NavLink
      to={contentTab.text === 'Log out' ? 'logout' : contentTab.text.toLowerCase()}
      onClick={() => setTab(contentTab.text)}
      id='topbar-tab-content-container'
      className={`
        ${tab === contentTab.text 
          ? 'bg-gray-800 scale-110 border-gray-700 hover:brightness-80' 
          : 'bg-transparent hover:border-gray-700 hover:bg-gray-800 hover:scale-102 border-transparent'}
        relative group flex flex-col justify-center items-center border rounded-md hover:cursor-pointer p-1 z-2 transition-all
      `}
    >
      {contentTab.img && (
        <img 
          className='rounded-full border-2 border-amber-100 w-10'
          id='tab-img'
          src={contentTab.img} 
          alt='user-avatar' 
        />
      )}

      {contentTab.icon && (
        <span id='tab-icon'>
          {<contentTab.icon className='text-amber-100 text-3xl' />}
        </span>
      )}


      {contentTab.hover_text === 'View profile' ? (
        <div
          id='username-wrapper'
          className='flex items-center justify-center'
        >
          <span
            className={`${connected ? 'bg-green-600' : 'bg-red-600'} rounded-full w-3 h-3 border border-black mr-1 mt-1`}
            style={{ boxShadow: 'inset 0 0 1px 1px' }}
            id='network-status-bubble'
          />     
          <p
            className='text-amber-300'
            id='tab-text'
            aria-label='tab-text'
          >
            {contentTab.text}     
          </p>
        </div>
      ) : (
        <p
          className='text-amber-300'
          id='tab-text'
          aria-label='tab-text'
        >
          {contentTab.text}     
        </p>
      )}

      <span 
        id='tab-hover-text'
        className='font-bold border-2 border-gray-700 shadow-lg absolute -bottom-8 rounded-md w-22 text-center bg-gray-800 text-gray-200 opacity-0 group-hover:opacity-100 pointer-events-none transition-all'
      >
        {contentTab.hover_text}
      </span>
    </NavLink>
  )
}