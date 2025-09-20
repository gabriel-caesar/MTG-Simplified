import { LoaderCircle } from 'lucide-react';
import { useContext } from 'react';
import { gameboardContext } from '../contexts/gameboard-context';
import '../css/rotate_spin.css';

export default function LoadingSpinner() {

  const { loadSpin } = useContext(gameboardContext);

  return (
    <div>
      <LoaderCircle className={loadSpin && 'spin'} />
    </div>
  )
}