import { LoaderCircle, X } from 'lucide-react';

export default function ErrorDialog({ response, setResponse, loading }) {
  return (
    <div
      id='error-dialog-container'
      className='
        absolute text-gray-300 w-80 top-[5%] opacity-98
        border border-amber-300 rounded-md bg-gray-900 p-4
      '
    >
      <div className='relative w-full flex flex-col justify-center items-center'>
        {loading ? (
          <LoaderCircle className='spin scale-150' />
        ) : (
          <>
            <button
              className='absolute top-0 right-0 hover:text-amber-300 hover:cursor-pointer transition-all'
              id='close-dialog-button'
              aria-label='close-dialog-button'
              onClick={() => setResponse(null)}
            >
              <X />
            </button>
            <h2 className='fontUncial text-2xl text-center'>Attention</h2>
            <hr className='border border-amber-300 w-full my-2' />
            <ul id='error-list' className='text-lg text-red-400 font-bold'>
              {response.errors ? (
                response.errors.map((err) => <li key={err}>• {err}</li>)
              ) : (
                <p>Something went wrong, try again</p>
              )}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
