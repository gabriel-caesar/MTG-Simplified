import { FaPlus } from "react-icons/fa6";

export default function SideBar({ h }) {
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

      <p className='mt-2 text-gray-500 text-center font-bold'>No friends added yet</p>

      <AddFriendButton />
    </div>
  )
}

function AddFriendButton() {
  return (
    <div id="friend-button-wrapper" className='absolute bottom-2 right-2 group'>
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
    </div>
  )
}