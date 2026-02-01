import '../css/main_menu.css';

import { soundContext, globalContext } from '../contexts/contexts.js';
import { useContext } from 'react';
import { NavLink } from 'react-router';

export default function StartMenu() {
  
  const { setStartWebPage } = useContext(globalContext);
  const { 
    buttonSound, 
    setButtonSound,
    chainSound,
    setChainSound
  } = useContext(soundContext);

  return (
    <>
      <div className='wooden-sign-bg flex justify-center items-center h-screen'>
        <div
          className='flex flex-col justify-center items-center py-6 px-12'
          id='startContainer'
        >
          <h1 className='text-amber-100 text-center text-3xl font-bold fontUncial'>
            Magic: The Gathering Simplified
          </h1>
          <p className='text-center text-2xl text-amber-300 bg-gray-950 rounded-md p-2 border-2 font-bold my-8'>
            A simplified version of the famous MTG card game
          </p>
          <div
            id='buttons-container'
            className='flex justify-around items-center w-full'
          >
            <NavLink
              to='/singleplayer'
              id='sp-btn'
              className='button-shadow bg-amber-300 rounded-sm text-3xl font-bold p-2 border-2 active:brightness-50 transition-all hover:cursor-pointer hover:brightness-60'
              onClick={() => {
                setButtonSound(!buttonSound);
                setChainSound(!chainSound);
                setStartWebPage(true);
              }}
            >
              Singleplayer
            </NavLink>
            <NavLink
              to='/multiplayer'
              id='mp-btn'
              className='button-shadow bg-amber-100 rounded-sm text-3xl font-bold p-2 border-2 active:brightness-50 transition-all hover:cursor-pointer hover:brightness-60'
              onClick={() => {
                setButtonSound(!buttonSound);
                setChainSound(!chainSound);
                setStartWebPage(true);
              }}
            >
              Multiplayer
            </NavLink>
          </div>
        </div>
      </div>
      <VerticalChains />
    </>
  );
}

function VerticalChains() {
  return (
    <div
      className='chains-img absolute -z-1 top-0 right-1/2 translate-x-1/2'
      id='vertical-chains'
    ></div>
  )
}