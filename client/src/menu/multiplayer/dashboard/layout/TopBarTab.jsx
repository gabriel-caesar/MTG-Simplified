import { dashboardContext } from '../../../../contexts/contexts'
import { useContext } from 'react'

export default function TopBarTab({ contentTab }) {

  const { tab, setTab } = useContext(dashboardContext);

  return (
    <li 
      id='topbar-tab-content-container'
      onClick={() => {
        if (contentTab.action) contentTab.action(); // Log out
        setTab(contentTab.text)
      }}
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

      <p
        className='text-amber-300'
        id='tab-text'
        aria-label='tab-text'
      >
        {contentTab.text}
      </p>
      <span 
        id='tab-hover-text'
        className='font-bold border-2 border-gray-700 shadow-lg absolute -bottom-8 rounded-md w-22 text-center bg-gray-800 text-gray-200 opacity-0 group-hover:opacity-100 pointer-events-none transition-all'
      >
        {contentTab.hover_text}
      </span>
    </li>
  )
}