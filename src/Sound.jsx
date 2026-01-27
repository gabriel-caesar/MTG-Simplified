import { useContext, useEffect, useRef, useState } from 'react';
import { globalContext, soundContext } from './contexts/contexts';

export default function Sound({ children }) {

  const { 
    startWebPage, 
    battleStarts, 
    gameWonBy,
    liftWoodenSign,
    setBattlePrep,
    toEnlarge,
    player
   } = useContext(globalContext);

  const [playMainTheme, setPlayMainTheme] = useState(false); // when user quits battlefield
  
  const [buttonSound, setButtonSound] = useState(false); // plays when a button is clicked

  const [cardSound, setCardSound] = useState(false); // plays when the card is previewed

  const [manaSound, setManaSound] = useState(false); // plays when the mana is activated

  const [chainSound, setChainSound] = useState(false); // used only for the multiplayer

  // state to control the theme volume
  const [themeSongVolumeController, setThemeSongVolumeController] =
    useState(0.3);

  // sound effects volume controller
  const [soundFXVolumeController, setSoundFXVolumeController] = useState(0.5);

  // theme song ref to keep it away from being created from scratch every time react re-renders
  const songRef = useRef(null);

  // buttons sound state
  const buttonSoundRef = useRef(null);

  // card sound effect when selected from hands container
  const previewCardSoundRef = useRef(null);

  // mana activation effect
  const manaSoundRef = useRef(null);

  // stores the enlarging battlefield card sound effect
  const toEnlargeSoundRef = useRef(null);

  // making battleHorn global so it can be accessed by audiotInit()
  let battleHorn = {}

  function audioInit(config) {
    // Readability
    const { stopBattleHorn, isMusic, audio } = config;

    if (audio.volume) {

      if (isMusic) {
        audio.volume = themeSongVolumeController
        audio.loop = true;
      } else {
        audio.volume = soundFXVolumeController
        buttonSoundRef.currentTime = 0
      }

      // for when the player is about to land on the gameboard
      if (stopBattleHorn) {
        battleHorn.pause();
        setBattlePrep(false); // screen backs to normal
      }
      
      audio.play();

    }
  };

  // starts the main theme song and sound effects
  useEffect(() => {
    // if there is already a soundtrack going on, pause it
    if (songRef.current) songRef.current.pause();

    // if the page loaded the sounds and music
    songRef.current = new Audio('../../soundfxs/main-theme.mp3');

    // initialize audio
    if (startWebPage || playMainTheme)
      audioInit({ stopBattleHorn: false, isMusic: true, audio: songRef.current })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startWebPage, playMainTheme]);


  // if the volume controller changes, we update the song volume property
  useEffect(() => {
    // if the page loaded the sounds and music
    if (songRef.current)
      songRef.current.volume = themeSongVolumeController;
  }, [themeSongVolumeController]);

  
  // when battle starts, song changes (player clicked 'To Battle')
  useEffect(() => {
    if (battleStarts) {
      // main theme stops
      songRef.current.pause();

      // getting battle horn
      battleHorn = new Audio('../../soundfxs/horn-sound.mp3');

      battleHorn.volume = 0.8;

      // blow the horn
      battleHorn.play();

      setTimeout(() => {

        songRef.current = new Audio('../../soundfxs/battle-theme.mp3');
        
        audioInit({ stopBattleHorn: true, isMusic: true, audio: songRef.current })

      }, 12000);
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [battleStarts]);

  // change the music theme when the player gets defeated or defeats bot
  useEffect(() => {
    // if there is already a soundtrack going on, pause it
    if (songRef.current)
      songRef.current.pause();

    // if the page loaded the sounds and music
    songRef.current = new Audio(
      `../../soundfxs/${gameWonBy === 'Bot' ? 'defeat' : gameWonBy !== '' && gameWonBy === player.name && 'victory'}-theme.mp3`
    );

    if (startWebPage || playMainTheme)
      audioInit({ stopBattleHorn: false, isMusic: true, audio: songRef.current })

  }, [gameWonBy]);

  // hook to watch for button clicks and sounds
  useEffect(() => {
    buttonSoundRef.current = new Audio('../../soundfxs/button-sound.mp3');

    if (buttonSoundRef.current.volume && startWebPage)
      audioInit({ stopBattleHorn: false, isMusic: false, audio: buttonSoundRef.current })
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buttonSound]);

  // plays a sound for when cards are previewed
  useEffect(() => {
    previewCardSoundRef.current = new Audio('../../soundfxs/draw-card.mp3');

    if (previewCardSoundRef.current.volume && startWebPage) 
      audioInit({ stopBattleHorn: false, isMusic: false, audio: previewCardSoundRef.current })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardSound]);

  // plays a sound for when mana is activated
  useEffect(() => {
    manaSoundRef.current = new Audio('../../soundfxs/mana-activation.mp3');

    if (manaSoundRef.current.volume && startWebPage) 
      audioInit({ stopBattleHorn: false, isMusic: false, audio: manaSoundRef.current })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manaSound]);

  // plays a sound when a card from the battlefield gets enlarged
  useEffect(() => {
    toEnlargeSoundRef.current = new Audio(`../../soundfxs/${toEnlarge ? 'to-shrink-sound' : 'to-enlarge-sound'}.mp3`);

    if (toEnlargeSoundRef.current.volume && startWebPage) 
      audioInit({ stopBattleHorn: false, isMusic: false, audio: toEnlargeSoundRef.current });

  }, [toEnlarge]);

  // < ====== NOTE ====== >

  /*
  
  ####### UNDERSTAND: #######

  The first useEffect is used for the singleplayer where
  the wooden sign moves up and down, therefore triggering
  the chain sound, now for the multiplayer, since it is
  being controlled by routes, the wooden signs ALWAYS come
  from the top edge of the screen, hence there is the SECOND
  useEffect to only take care of the sound and not the lifting
  and of the sign itself.

  This is happens because when the route controls the wooden
  signs, there is no suitable way of awaiting for the sign
  content to change before it can finish its up and down animation.

  */

  // plays the chain sound for the singleplayer where wooden signs
  // are not controlled by the routes like they are on multiplayer
  useEffect(() => {
    if (startWebPage) {
      const chainSoundWithSign = new Audio('/soundfxs/chain-drag.mp3');

      audioInit({ stopBattleHorn: false, isMusic: false, audio: chainSoundWithSign })
    }
    
    // plays the sound if the start button is hit or if the lift sign state changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startWebPage, liftWoodenSign]);
  
  // plays the chain sound for the muliplayer where wooden signs
  // are controlled by routes
  useEffect(() => {
    if (startWebPage) {
      const chainAudio = new Audio('/soundfxs/chain-drag.mp3');
      
      audioInit({ stopBattleHorn: false, isMusic: false, audio: chainAudio })
    }
  }, [chainSound])

  // < ====== NOTE ====== >

  const contextValues = {
    buttonSound,
    setButtonSound,
    cardSound,
    setCardSound,
    manaSound,
    setManaSound,
    chainSound,
    setChainSound,
    soundFXVolumeController,
    setSoundFXVolumeController,
    playMainTheme,
    setPlayMainTheme,
    themeSongVolumeController,
    setThemeSongVolumeController,
    toEnlargeSoundRef
  }

  return (
    <soundContext.Provider value={contextValues}>
      { children }
    </soundContext.Provider>
  )
}

