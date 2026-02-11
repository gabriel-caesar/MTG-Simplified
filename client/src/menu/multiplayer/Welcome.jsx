import WoodenSign from '../WoodenSign';
import MTGFlatLogo from '../../assets/mtg-flat-logo.png';

import { globalContext, soundContext } from '../../contexts/contexts'
import { NavLink, useOutletContext } from 'react-router';
import { useContext } from 'react'

export default function Welcome() {
  const { liftWoodenSign } = useContext(globalContext);
  const { 
    buttonSound, 
    setButtonSound, 
    setChainSound, 
    chainSound,
  } = useContext(soundContext);

  const { Wx, Wy } = useOutletContext(); // wooden sign dimesions
  
  return (
    <>
      <WoodenSign
        animate={true}
        w={Wx}
        h={Wy}
        style='p-10 flex flex-col justify-center items-center z-0'
      >
        <img 
          src={MTGFlatLogo} 
          alt='mtg-3d-logo' 
          className='w-205 absolute left-1/2 -translate-x-1/2 -z-1 opacity-50'
        />

        <h1 className='text-center text-amber-100 text-3xl font-bold fontUncial mt-2 mb-10'>
          MTG Simplified Multiplayer
        </h1>

        <div 
          className='flex fontUncial justify-between items-center w-1/2'
          id="buttons-container"
        >
          <NavLink 
            to='login'
            id='login-btn'
            arial-label='login-button'
            className='button-shadow active:brightness-50 bg-amber-300 rounded-sm text-3xl font-bold p-2 border-2 transition-all hover:cursor-pointer hover:brightness-50 w-40 text-center'
            onClick={() => {setChainSound(!chainSound); setButtonSound(!buttonSound)}}
            >
            Log In
          </NavLink>
          <NavLink 
            to='signup'
            id='signup-btn'
            arial-label='signup-button'
            className='button-shadow active:brightness-50 bg-amber-300 rounded-sm text-3xl font-bold p-2 border-2 transition-all hover:cursor-pointer hover:brightness-50 w-40 text-center'
            onClick={() => {setChainSound(!chainSound); setButtonSound(!buttonSound)}}
          >
            Sign Up
          </NavLink>
        </div>

          <NavLink 
            to='/'
            id='back-btn'
            arial-label='back-button'
            className='button-shadow active:brightness-50 bg-amber-100 rounded-sm text-3xl font-bold p-2 border-2 transition-all hover:cursor-pointer hover:brightness-50 w-1/2 text-center mt-8'
            onClick={() => setButtonSound(!buttonSound)}
          >
            Back
          </NavLink>
      </WoodenSign>
      <VerticalChains liftWoodenSign={liftWoodenSign} />
    </>
  )
}

function VerticalChains({ liftWoodenSign }) {
  return (
    <div
      className='chains-img absolute -z-1 top-0 right-1/2 translate-x-1/2'
      id='vertical-chains'
      style={{
        animation: liftWoodenSign // tells the code to lift up or drag the wooden sign down
          ? 'bounce-out 1s linear'
          : 'bounce-in 1s linear',
      }}
    ></div>
  )
}