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