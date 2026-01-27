import { NavLink, useRouteError } from 'react-router';

const Wx = 'w-[785.25px]' // 3/4 of 1047px (image's width)
const Wy = 'h-[768px]' // 3/4 of 1024px (image's height)

export default function ErrorComponent() {
  const error = useRouteError();
  return (
    <>
      <div
        className={`
          wooden-sign-bg ${Wx} ${Wy} p-10 pt-15 flex flex-col justify-center items-center z-0
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
          <p>
            {error.message}
          </p>
        </div>
        <NavLink
          to='/'
          id='back-btn'
          className='button-shadow bg-amber-300 rounded-sm text-3xl font-bold p-2 border-2 active:brightness-50 transition-all hover:cursor-pointer hover:bg-amber-300/60'
        >
          Back
        </NavLink>
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