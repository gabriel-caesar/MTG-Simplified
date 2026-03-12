import mtgFlatLogo from '../../../assets/mtg-flat-logo.png';

export default function OutletWrapper({ children, h }) {

  return (
    <div 
      id="outlet-wrapper-container"
      className={`w-3/4 ${h} bg-gray-900 rounded-md border-2 border-amber-300 shadow-lg shadow-amber-900 relative`}
    >
      {children}
    </div>
  )
}

function MTGFlatLogo() {
  return (
    <div 
      id='mtg-icon'
      className='absolute scale-125 left-1/2 -translate-x-1/2 opacity-50 top-1/2 -translate-y-1/2'
    >
      <img 
        src={mtgFlatLogo} 
        alt='mtg-3d-logo' 
      />
    </div>
  )
}