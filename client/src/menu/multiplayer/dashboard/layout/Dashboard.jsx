import OutletWrapper from '../OutletWrapper';
import WoodenSign from '../../../WoodenSign';
import SideBar from './SideBar';
import TopBar from './TopBar';
import axios from 'axios';

import { authContext, globalContext, soundContext } from '../../../../contexts/contexts';
import { Outlet, useNavigate, useOutletContext } from 'react-router';
import { useContext, useState } from 'react';
import { dashboardContext } from '../../../../contexts/contexts';

export default function Dashboard() {
  const { liftWoodenSign } = useContext(globalContext);
  const { 
    chainSound, 
    setChainSound, 
    buttonSound, 
    setButtonSound 
  } = useContext(soundContext);

  const [tab, setTab] = useState('Chats');

  // Wooden sign dimensions
  const { Wy } = useOutletContext();
  const EXTRA_W = 'w-[925px]';
  const OUTLET_H = 'h-[345px]';

  const value = {
    tab, 
    setTab
  };

  return (
    <dashboardContext.Provider value={value}>
      <WoodenSign 
        animate={true}
        w={EXTRA_W}
        h={Wy}
        style='p-10 pt-28 flex flex-col justify-start items-center z-0'
      >
        <TopBar />

        <div  
          id="content-wrapper"
          className='flex items-center justify-between mt-2 w-full px-6'
        >
          <OutletWrapper h={OUTLET_H}>
            <Outlet/>
          </OutletWrapper>
          
          <SideBar h={OUTLET_H} />
        </div>

      </WoodenSign>
      <VerticalChains liftWoodenSign={liftWoodenSign} />
    </dashboardContext.Provider>
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