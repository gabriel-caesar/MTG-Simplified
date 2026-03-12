import SinglePlayerWrapper from './menu/singleplayer/SPWrapper.jsx';
import ErrorComponent from './ErrorComponent.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import Dashboard from './menu/multiplayer/dashboard/layout/Dashboard.jsx';
import ChatsRoot from './menu/multiplayer/dashboard/chats/ChatsRoot.jsx';
import StartMenu from './menu/StartMenu.jsx';
import Welcome from './menu/multiplayer/Welcome.jsx';
import SignUp from './menu/multiplayer/SignUp.jsx';
import LogIn from './menu/multiplayer/LogIn.jsx';
import Sound from './Sound.jsx';
import Root from './menu/multiplayer/Root.jsx';
import Auth from './Auth.jsx';
import App from './App.jsx';
import LobbyRoot from './menu/multiplayer/dashboard/lobby/LobbyRoot.jsx'
import LogoutRoot from './menu/multiplayer/dashboard/logout/LogoutRoot.jsx'
import DecksRoot from './menu/multiplayer/dashboard/decks/DecksRoot.jsx'
import ProfileRoot from './menu/multiplayer/dashboard/profile/ProfileRoot.jsx'
import FriendsRoot from './menu/multiplayer/dashboard/friends/FriendsRoot.jsx';
import SocketProvider from './SocketProvider.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';


import { createBrowserRouter, Outlet } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const router = createBrowserRouter([
  {
    path: '/',
    element: (      
      <ProtectedRoute toDashboard={true}>
        <MenuWrapper />
      </ProtectedRoute>
    ),
    errorElement: <ErrorComponent />,
    children: [
      {
        index: true,
        Component: StartMenu,
      },
      {
        path: 'singleplayer',
        Component: SinglePlayerWrapper,
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
              { index: true, Component: ChatsRoot },
              { path: 'friends', Component: FriendsRoot },
              { path: 'chats', Component: ChatsRoot },
              { path: 'lobby', Component: LobbyRoot },
              { path: 'decks', Component: DecksRoot },
              { path: 'logout', Component: LogoutRoot },
              { path: 'profile', Component: ProfileRoot },
            ],
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary fallback='Error'>
      <App>
        <Auth>
          <Sound>
            <SocketProvider> 
              <RouterProvider router={router} />
            </SocketProvider>
          </Sound>
        </Auth>
      </App>
    </ErrorBoundary>
  </StrictMode>,
);

// Outlets all the root's children components
function MenuWrapper() {
  return (
    <>
      <Outlet />
    </>
  );
}
