import { Volume2, Palette, Headphones, HeadphoneOff } from 'lucide-react';
import { useContext, useState } from 'react';
import { globalContext } from '../../contexts/global-context.js';
import Controller from './Controller';

export default function ControlBar({
  soundFXVolumeController,
  themeSongVolumeController,
  setSoundFXVolumeController,
  setThemeSongVolumeController,
}) {
  const { appTheme, setButtonSound, buttonSound } = useContext(globalContext);

  // control bar for sound fxs, music and theme
  const [themeControl, setThemeControl] = useState(false);
  const [musicControl, setMusicControl] = useState(false);
  const [soundControl, setSoundControl] = useState(false);

  return (
    <div className='absolute top-5 left-6 z-10'>
      <nav
        className={`relative flex justify-around items-center border-r-2 border-t-2 border-l-2 p-1 w-40 ${appTheme === 'vile' ? 'bg-gray-400' : 'backdrop-blur-lg'} rounded-t-sm rounded-tl-sm`}
        id='control-nav-bar'
      >
        <button
          className={`${musicControl ? 'border-black' : 'border-transparent'} active:opacity-50 hover:cursor-pointer border-2 rounded-sm hover:text-gray-300 hover:border-black p-1 transition-colors`}
          onClick={() => {
            setButtonSound(!buttonSound);
            setMusicControl(!musicControl);
            setThemeControl(false);
            setSoundControl(false);
          }}
        >
          {themeSongVolumeController === 0 ? <HeadphoneOff /> : <Headphones />}
        </button>
        <button
          className={`${themeControl ? 'border-black' : 'border-transparent'} active:opacity-50 hover:cursor-pointer border-2 rounded-sm hover:text-gray-300 hover:border-black p-1 transition-colors`}
          onClick={() => {
            setButtonSound(!buttonSound);
            setThemeControl(!themeControl);
            setMusicControl(false);
            setSoundControl(false);
          }}
        >
          <Palette />
        </button>
        <button
          className={`${soundControl ? 'border-black' : 'border-transparent'} active:opacity-50 hover:cursor-pointer border-2 rounded-sm hover:text-gray-300  hover:border-black p-1 transition-colors`}
          onClick={() => {
            setButtonSound(!buttonSound);
            setSoundControl(!soundControl);
            setThemeControl(false);
            setMusicControl(false);
          }}
        >
          <Volume2 />
        </button>
      </nav>

      <Controller
        musicControl={musicControl}
        themeControl={themeControl}
        soundControl={soundControl}
        themeSongVolumeController={themeSongVolumeController}
        soundFXVolumeController={soundFXVolumeController}
        setThemeSongVolumeController={setThemeSongVolumeController}
        setSoundFXVolumeController={setSoundFXVolumeController}
      />
    </div>
  );
}
