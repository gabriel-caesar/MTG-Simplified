import SinglePlayerWrapper from './menu/singleplayer/SPWrapper.jsx';
import ErrorComponent from './ErrorComponent.jsx';
import Welcome from './menu/multiplayer/Welcome.jsx';
import Root from './menu/multiplayer/Root.jsx';
import SignUp from './menu/multiplayer/SignUp.jsx';
import LogIn from './menu/multiplayer/LogIn.jsx';
import Start from './menu/Start.jsx';
import Sound from './Sound.jsx';
import App from './App.jsx'

import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


const router = createBrowserRouter([
  { path: "/", Component: Start },
  { 
    errorElement: <ErrorComponent />,
    path: '/singleplayer', 
    Component: SinglePlayerWrapper 
  },
  { 
    path: '/multiplayer',
    errorElement: <ErrorComponent />,
    Component: Root,
    children: [
      { index: true, Component: Welcome },
      { path: 'login', Component: LogIn },
      { path: 'signup', Component: SignUp },
    ]
  }
]);

// main component to wrap the whole app
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App>
      <Sound>
        <RouterProvider router={router} />
      </Sound>
    </App>
  </StrictMode>,
)
