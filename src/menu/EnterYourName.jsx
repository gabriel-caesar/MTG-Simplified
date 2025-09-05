// wooden sign for the player to enter its name
export default function EnterYourName({ submitPlayerName, playerName, setPlayerName }) {
  return (
    <form
      className={`z-2 w-115 h-70 px-10 py-14`}
      id='greetingContainer'
      onSubmit={(e) => submitPlayerName(e)}
    >
      <h1 className='text-center text-amber-100 mb-3 text-3xl font-bold fontUncial'>
        Welcome to MTG Simplified!
      </h1>
      <label className='flex flex-col text-amber-100 text-center font-bold text-2xl'>
        Tell us your name:
        <input
          type='text'
          placeholder='Name...'
          className='bg-gray-900 text-gray-300 p-2 rounded-sm text-xl w-3/4 m-auto border-1'
          value={playerName}
          onChange={(e) => {
            // 7 characters max
            if (e.target.value.length < 8) setPlayerName(e.target.value);
          }}
          autoFocus={true}
          required
        />
      </label>
    </form>
  );
}