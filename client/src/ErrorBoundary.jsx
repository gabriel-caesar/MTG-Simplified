import React from 'react';
import WoodenSign from './menu/WoodenSign';

class ErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.log(error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main
          className='mainContainerImage relative'
          style={{
            backgroundImage: `url('/UI_themes/gameboard-forest.png')`
          }}
        >
          <WoodenSign
            animate={false}
            w='w-[625px]'
            h='h-screen'
            style='flex flex-col justify-center items-center m-auto'
          >
            <h1
              id='error-header'
              className='text-amber-300 fontUncial text-3xl'
            >
              Error
            </h1>
            <p
              id='info-text'
              className='text-center w-100 text-amber-100 font-bold text-lg my-8'
            >
              An internal error has occurred, try reloading the
              page. If the error persists, contact our team immediately
              at <span className='underline text-amber-300'>gabriel.mdonno@hotmail.com</span>.
            </p>
            <button 
              onClick={() => window.location.reload()}
              id="reload-button"
              aria-label="reload-button"
              className='button-shadow bg-amber-300 rounded-sm text-3xl font-bold p-2 border-2 active:brightness-50 transition-all hover:cursor-pointer hover:brightness-60'
            >
              Reload
            </button>
          </WoodenSign>
          <VerticalChains />
        </main>
      )
    }
    return this.props.children
  }
}

function VerticalChains() {
  return (
    <div
      className='chains-img absolute -z-1 top-0 right-1/2 translate-x-1/2'
      id='vertical-chains'
    ></div>
  )
}

export default ErrorBoundary