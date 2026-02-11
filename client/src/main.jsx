import SinglePlayerWrapper from './menu/singleplayer/SPWrapper.jsx';
import ErrorComponent from './ErrorComponent.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import Dashboard from './menu/multiplayer/dashboard/layout/Dashboard.jsx';
import StartMenu from './menu/StartMenu.jsx';
import Welcome from './menu/multiplayer/Welcome.jsx';
import SignUp from './menu/multiplayer/SignUp.jsx';
import LogIn from './menu/multiplayer/LogIn.jsx';
import Sound from './Sound.jsx';
import Root from './menu/multiplayer/Root.jsx';
import Auth from './Auth.jsx';
import App from './App.jsx'

import { createBrowserRouter, Outlet } from "react-router";
import { RouterProvider } from "react-router/dom";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import GlobalChat from './menu/multiplayer/dashboard/global-chat/GlobalChat.jsx';


const router = createBrowserRouter([
  { 
    path: "/", 
    element: ( 
      <ProtectedRoute toDashboard={true}>
        <MenuWrapper />
      </ProtectedRoute>
    ),
    errorElement: <ErrorComponent />,
    children: [
      {
        index: true,
        Component: StartMenu
      },
      { 
        path: 'singleplayer', 
        Component: SinglePlayerWrapper
      },
      { 
        path: 'multiplayer',
        Component: Root,
        children: [
          { index: true, Component: Welcome },
          { path: 'login', Component: LogIn },
          { path: 'signup', Component: SignUp },
          { 
            path: 'dashboard', 
            Component: Dashboard,
            children: [
              { index: true, Component: GlobalChat }
            ]
          },
        ]
      }
    ]
  },
]);

// main component to wrap the whole app
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App>
      <Auth>
        <Sound>
          <RouterProvider router={router} />
        </Sound>
      </Auth>
    </App>
  </StrictMode>,
)

// Outlets all the root's children components
function MenuWrapper() {
  return <><Outlet /></>
}