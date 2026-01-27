import ControlBar from '../control-bar/ControlBar';

import { Outlet } from 'react-router';

const WOODENSIGN_X = 'w-[785.25px]' // 3/4 of 1047px (image's width)
const WOODENSIGN_Y = 'h-[768px]' // 3/4 of 1024px (image's height)

export default function Root() {

  return (
    <div className='relative w-full h-screen flex justify-center items-center' id='root-wrapper'>
      <ControlBar />
      
      <Outlet context={{ Wx: WOODENSIGN_X, Wy: WOODENSIGN_Y }} /> 
    </div>
  )
}