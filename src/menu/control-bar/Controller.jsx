import { useContext } from 'react';
import { globalContext } from '../../App';

export default function Controller({
  musicControl,
  themeControl,
  soundControl,
  themeSongVolumeController,
  soundFXVolumeController,
  setThemeSongVolumeController,
  setSoundFXVolumeController,
}) {
  const { buttonSound, setButtonSound, setAppTheme, appTheme } =
    useContext(globalContext);

  return (
    <div
      className={`${(soundControl || themeControl || musicControl) && 'border-t-2'} absolute text-lg font-bold ${appTheme === 'vile' ? 'bg-gray-400' : 'backdrop-blur-lg'} w-40 p-1 border-r-2 border-l-2 border-b-2 rounded-b-sm rounded-bl-sm z-10`}
      id='controller-container'
    >
      <div className={`${(soundControl || musicControl) ? 'h-15' : themeControl ? 'h-35' : 'h-0'} flex flex-col justify-center items-center transition-all duration-300`}>
        <div className={`${musicControl ? 'opacity-100' : 'opacity-0 absolute -top-100'} transition-all duration-900`}>
          <p className='fontCizel text-center'>Music Volume</p>
          <input
            type='range'
            min='0'
            max='1'
            step='0.01'
            value={themeSongVolumeController}
            onChange={(e) =>
              setThemeSongVolumeController(parseFloat(e.target.value))
            }
          />
        </div>

        <div className={`${soundControl ? 'opacity-100' : 'opacity-0 absolute -top-100'} transition-all duration-900`}>
          <p className='fontCizel text-center'>Sound Volume</p>
          <input
            type='range'
            min='0'
            max='1'
            step='0.01'
            value={soundFXVolumeController}
            onChange={(e) =>
              setSoundFXVolumeController(parseFloat(e.target.value))
            }
          />
        </div>

        <div className={`${themeControl ? 'opacity-100' : 'opacity-0 absolute -top-100'} transition-all duration-900`}>
          <p className='text-center fontCizel'>Themes</p>

          <button
            onClick={() => {
              setButtonSound(!buttonSound);
              setAppTheme('forest');
            }}
            className={`bg-green-600 shadowBox hover:cursor-pointer hover:opacity-70 hover:border-gray-400 transition-all w-full mb-1 rounded-sm border-1`}
          >
            Forest
          </button>
          <button
            onClick={() => {
              setButtonSound(!buttonSound);
              setAppTheme('vile');
            }}
            className={`bg-red-700 shadowBox hover:cursor-pointer hover:opacity-70 hover:border-gray-400 transition-all w-full mb-1 rounded-sm border-1`}
          >
            Vile
          </button>
          <button
            onClick={() => {
              setButtonSound(!buttonSound);
              setAppTheme('heaven');
            }}
            className={`bg-amber-200 shadowBox hover:cursor-pointer hover:opacity-70 hover:border-gray-400 transition-all w-full mb-1 rounded-sm border-1`}
          >
            Heaven
          </button>
        </div>
      </div>
    </div>
  );
}
