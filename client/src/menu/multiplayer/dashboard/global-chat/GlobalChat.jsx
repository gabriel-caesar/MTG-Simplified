import mtgFlatLogo from '../../../../assets/mtg-flat-logo.png';

import { BiWorld } from "react-icons/bi";
import { useState } from 'react';

export default function GlobalChat() {

  const [chatMessage, setChatMessage] = useState('');

  return (
    <>
      <div 
        id="global-chat-header"
        className='h-1/8 rounded-t-sm border-b text-amber-300 p-2 w-full bg-gray-800 flex justify-between items-center'
      >
        <h1 className='fontUncial'>
          Global chat
        </h1>
        <span>
          <BiWorld className='text-2xl'/>
        </span>
      </div>

      <MTGFlatLogo />

      <div 
        id="chat-panel"
        className='w-full h-6/8'
      >

      </div>

      <form 
        onSubmit={e => e.preventDefault()}
        id="chat-input-container"
        className='w-full h-1/8 flex items-center justify-center border-t border-amber-300'
      > 
        <input 
          type='text'
          name='chat_input'
          id='chat-input'
          placeholder='Send your message...'
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          className='text-lg bg-gray-800 text-amber-300 rounded-b-sm w-full h-full px-2 hover:bg-gray-950 focus-within:bg-gray-950 focus-within:outline-none transition-all'
        />
        <button
          type='submit'
          className='rounded-br-sm bg-amber-300 button-shadow border-l border-amber-300 fontUncial h-full px-2 hover:cursor-pointer hover:brightness-60 transition-all'
          id='send-message-button'
        >
          Send
        </button>
      </form>

    </>
  )
}

function MTGFlatLogo() {
  return (
    <div 
      id='mtg-icon'
      className='absolute scale-125 left-1/2 -translate-x-1/2 opacity-50 top-1/2 -translate-y-1/2'
    >
      <img 
        src={mtgFlatLogo} 
        alt='mtg-3d-logo' 
      />
    </div>
  )
}