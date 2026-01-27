import ErrorDialog from './ErrorDialog';
import axios from 'axios';

import { globalContext, soundContext } from '../../contexts/contexts';
import { NavLink, useOutletContext } from 'react-router';
import { useContext, useState } from 'react';

export default function LogIn() {
  const { liftWoodenSign } = useContext(globalContext);
  const { 
    buttonSound, 
    setButtonSound,
    chainSound,
    setChainSound,
   } = useContext(soundContext);

  const { Wx, Wy } = useOutletContext(); // wooden sign dimesions

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    setIsLoading(true);

    axios
      .post('http://localhost:8080/multiplayer/login', formData)
      .then((response) => {
        console.log("Logging from axios' call", `| Success: ${response.data.success}`)
        if (response.data.success) setFormErrors(null); // Clear errors
      })
      .catch((err) => setFormErrors(err.response.data))
      .finally(() => setIsLoading(false));
  }


  return ( 
    <>
      <div
        className={`
          wooden-sign-bg ${Wx} ${Wy} p-10 pt-15 flex flex-col justify-center items-center z-0
        `}
        id='login-container'
        style={{
          animation: liftWoodenSign // tells the code to lift up or drag the wooden sign down
            ? 'bounce-out 1s linear'
            : 'bounce-in 1s linear',
        }}
      >

        <h1 className='text-center text-amber-100 text-4xl font-bold fontUncial mb-10'>
          Log in to your account
        </h1>

        <form 
          className='flex flex-col justify-center items-center w-1/2'
          id="login-form"
          onSubmit={handleSubmit}
        >
          <section id="email-section" className='flex flex-col'>
            <label htmlFor="email" className='text-amber-300 text-start font-bold text-2xl'>Email</label>
            <input 
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              type="text" 
              id='email' 
              name='email' 
              placeholder='ajani@email.com...'
              className='bg-gray-900 text-gray-300 p-2 rounded-sm text-3xl font-bold w-full border-1' 
            />
          </section>

          <section id="password-section" className='flex flex-col my-6'>
            <label htmlFor="password" className='text-amber-300 text-start font-bold text-2xl'>Password</label>
            <input 
              value={formData.password}
              onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
              type="password" 
              id='password' 
              name='password' 
              placeholder='********' 
              className='bg-gray-900 text-gray-300 p-2 rounded-sm text-3xl font-bold w-full border-1' 
            />
          </section>
          <div 
            id='buttons-container'
            className='flex justify-between items-center w-full p-3'
          >
            <NavLink 
              to='/multiplayer'
              id='back-btn'
              aria-label='back-button'
              className='button-shadow active:brightness-50 bg-amber-100 rounded-sm text-3xl font-bold p-2 border-2 transition-all hover:cursor-pointer hover:brightness-50 text-center w-35' 
              onClick={() => {setChainSound(!chainSound); setButtonSound(!buttonSound)}}
            >
              Back
            </NavLink>

            <button
              id='login-btn'
              aria-label='login-button'
              className='button-shadow active:brightness-50 bg-amber-300 rounded-sm text-3xl font-bold p-2 border-2 transition-all hover:cursor-pointer hover:brightness-50 text-center w-35' 
              onClick={() => {setChainSound(!chainSound); setButtonSound(!buttonSound)}}
            >
              Log In
            </button>
          </div>
        </form>
      </div>
      <VerticalChains liftWoodenSign={liftWoodenSign} />
      {formErrors && (
        <ErrorDialog
          loading={isLoading}
          response={formErrors}
          setResponse={setFormErrors}
        />
      )}
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