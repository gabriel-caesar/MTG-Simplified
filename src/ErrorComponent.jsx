import { NavLink, useRouteError } from 'react-router';

const Wx = 'w-[785.25px]' // 3/4 of 1047px (image's width)
const Wy = 'h-[768px]' // 3/4 of 1024px (image's height)

export default function ErrorComponent() {
  const error = useRouteError();
  console.log(error)
  return (
    <>
      <div
        className={`
          wooden-sign-bg ${Wx} ${Wy} p-12 pt-15 flex flex-col justify-center items-center z-0
        `}
        id='error-container'
      >
        <h1
          id='error-header'
          aria-label='error-header'
          className='fontUncial text-amber-100 text-4xl'
        >
          An error had ocurred
        </h1>
        <div className='text-center text-lg text-amber-300 bg-gray-950 rounded-md p-2 border-2 font-bold my-8'>
          <h3 className='text-2xl'>
            Error {error.status} {error.statusText && `• ${error.statusText}`}
          </h3>
          <p>
            {error.message}
          </p>
        </div>
        <div className='flex items-center justify-center' id='buttons-container'>
          <NavLink
            to='/'
            id='back-btn'
            className='button-shadow bg-amber-100 rounded-sm text-3xl font-bold p-2 border-2 active:brightness-50 transition-all hover:cursor-pointer hover:brightness-60 mr-8'
          >
            Back
          </NavLink>
          <button 
            onClick={() => window.location.reload()}
            id="reload-button"
            aria-label="reload-button"
            className='button-shadow bg-amber-300 rounded-sm text-3xl font-bold p-2 border-2 active:brightness-50 transition-all hover:cursor-pointer hover:brightness-60'
          >
            Reload
          </button>
        </div>
      </div>
      <VerticalChains />
    </>
  )
}

function VerticalChains() {
  return (
    <div
      className='chains-img absolute -z-1 top-0 right-1/2 translate-x-1/2'
      id='vertical-chains'
    ></div>
  )
}