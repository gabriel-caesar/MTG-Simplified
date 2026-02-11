import '../css/rotate_spin.css';

import { gameboardContext } from '../contexts/contexts';
import { LoaderCircle } from 'lucide-react';
import { useContext } from 'react';

export default function LoadingSpinner() {

  const { loadSpin } = useContext(gameboardContext);

  return (
    <div>
      <LoaderCircle className={loadSpin && 'spin'} />
    </div>
  )
}