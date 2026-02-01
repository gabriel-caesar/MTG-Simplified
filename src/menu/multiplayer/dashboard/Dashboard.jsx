import { authContext, globalContext, soundContext } from '../../../contexts/contexts';
import { Navigate, useNavigate, useOutletContext } from 'react-router';
import { useContext } from 'react';
import TopHeader from './TopHeader';
import axios from 'axios';

export default function Dashboard() {
  const { liftWoodenSign } = useContext(globalContext);
  const { 
    chainSound, 
    setChainSound, 
    buttonSound, 
    setButtonSound 
  } = useContext(soundContext);

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

  // Wooden sign dimensions
  const { Wx, Wy } = useOutletContext();
  return (
    <>
      <div
        className={`
          wooden-sign-bg ${Wx} ${Wy} p-10 pt-40 flex flex-col justify-start items-center z-0
        `}
        id='signup-container'
        style={{
          animation: liftWoodenSign // tells the code to lift up or drag the wooden sign down
            ? 'bounce-out 1s linear'
            : 'bounce-in 1s linear',
        }}
      >

        <TopHeader />

        <div className='w-[550px] flex justify-start items-center mt-1'>
          <h1 className='fontUncial text-xl text-amber-400'>Welcome to dashboard</h1>
        </div>

        <button
          id='play-button'
          aria-label='play-button'
          className='button-shadow active:brightness-50 bg-amber-300 rounded-sm text-3xl font-bold p-2 border-2 transition-all hover:cursor-pointer hover:brightness-50 text-center w-30 mt-10'
        >
          Play
        </button>

        <button
          id='logout-button'
          aria-label='logout-button'
          className='button-shadow active:brightness-50 bg-amber-700 rounded-sm text-3xl font-bold p-2 border-2 transition-all hover:cursor-pointer hover:brightness-50 text-center w-30 mt-10'
          onClick={handleLogOut}
        >
          Log Out
        </button>
        
      </div>
      <VerticalChains liftWoodenSign={liftWoodenSign} />
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