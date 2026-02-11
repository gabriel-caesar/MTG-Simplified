import '../../css/rotate_spin.css';

import ErrorDialog from './ErrorDialog';
import axios from 'axios';

import { globalContext, soundContext } from '../../contexts/contexts';
import { NavLink, useOutletContext } from 'react-router';
import { useContext, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import WoodenSign from '../WoodenSign';

export default function SignUp() {
  const { liftWoodenSign } = useContext(globalContext);
  const { chainSound, setChainSound, buttonSound, setButtonSound } =
    useContext(soundContext);

  // Wooden sign dimensions
  const { Wx, Wy } = useOutletContext();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm_password: '',
  });
  const [formErrors, setFormErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    setIsLoading(true);

    axios
      .post('http://localhost:8080/multiplayer/signup', formData)
      .then((response) => {
        if (response.success) setFormErrors(null); // Clear errors
      })
      .catch((err) => setFormErrors(err.response.data))
      .finally(() => setIsLoading(false));
  }

  return (
    <>
      <WoodenSign
        animate={true}
        w={Wx}
        h={Wy}
        style='p-10 pt-15 flex flex-col justify-center items-center z-0'
      >
        <h1 className='text-center text-amber-100 text-4xl font-bold fontUncial mb-3'>
          Create a new account
        </h1>

        <form
          className='flex flex-col justify-center items-center w-1/2'
          id='signup-form'
          onSubmit={handleSubmit}
        >
          <section id='email-section' className='flex flex-col'>
            <label
              htmlFor='email'
              className='text-amber-300 text-start font-bold text-2xl'
            >
              Email
            </label>
            <input
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              type='text'
              id='email'
              name='email'
              placeholder='helius@email.com...'
              className='bg-gray-900 text-gray-300 p-2 rounded-sm text-3xl font-bold w-full border-1'
            />
          </section>

          <section id='password-section' className='flex flex-col my-3'>
            <label
              htmlFor='password'
              className='text-amber-300 text-start font-bold text-2xl'
            >
              Password
            </label>
            <input
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              type='password'
              id='password'
              name='password'
              placeholder='********'
              className='bg-gray-900 text-gray-300 p-2 rounded-sm text-3xl font-bold w-full border-1'
            />
          </section>

          <section id='confirm_password-section' className='flex flex-col'>
            <label
              htmlFor='confirm_password'
              className='text-amber-300 text-start font-bold text-2xl'
            >
              Confirm password
            </label>
            <input
              value={formData.confirm_password}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  confirm_password: e.target.value,
                }))
              }
              type='password'
              id='confirm_password'
              name='confirm_password'
              placeholder='********'
              className='bg-gray-900 text-gray-300 p-2 rounded-sm text-3xl font-bold w-full border-1'
            />
          </section>

          <div
            id='buttons-container'
            className='flex justify-between items-center w-full mt-6 px-3'
          >
            <NavLink
              to='/multiplayer'
              id='back-btn'
              aria-label='back-button'
              disabled={isLoading}
              className='button-shadow active:brightness-50 bg-amber-100 rounded-sm text-3xl font-bold p-2 border-2 transition-all hover:cursor-pointer hover:brightness-50 text-center w-35 h-13'
              onClick={() => {
                setButtonSound(!buttonSound);
                setChainSound(!chainSound);
              }}
            >
              Back
            </NavLink>
            <button
              id='create-btn'
              aria-label='create-button'
              disabled={isLoading}
              className='button-shadow active:brightness-50 bg-amber-300 rounded-sm text-3xl font-bold p-2 border-2 transition-all hover:cursor-pointer hover:brightness-50 text-center w-35 h-13 flex items-center justify-center'
              onClick={() => setButtonSound(!buttonSound)}
            >
              {isLoading ? (
                <LoaderCircle className='spin scale-150' />
              ) : (
                'Create'
              )}
            </button>
          </div>
        </form>
      </WoodenSign>
      <VerticalChains liftWoodenSign={liftWoodenSign} />
      {formErrors && (
        <ErrorDialog
          loading={isLoading}
          response={formErrors}
          setResponse={setFormErrors}
        />
      )}
    </>
  );
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
  );
}