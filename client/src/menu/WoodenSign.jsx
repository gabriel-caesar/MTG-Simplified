import { useContext } from 'react';
import { globalContext } from '../contexts/contexts';

export default function WoodenSign({ children, w, h, style, animate }) {
  let animation = null;
  if (animate) {
    const { liftWoodenSign } = useContext(globalContext);

    // Lifting and dropping animation style
    animation = {
      animation: liftWoodenSign
        ? 'bounce-out 1s linear'
        : 'bounce-in 1s linear',
    };
  }


  return (
    <div
      id='wooden-sign-container'
      className={`wooden-sign-bg ${w} ${h} ${style}`}
      style={animate ? animation: {}}
    >
      {children}
    </div>
  );
}
