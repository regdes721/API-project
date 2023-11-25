import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet} from 'react-router-dom';
import { Modal, ModalProvider } from './context/Modal';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import GroupsPage from './components/GroupsPage';
import GroupDetailsPage from './components/GroupsPage/GroupDetailsPage';
import CreateGroupPage from './components/GroupsPage/CreateGroupPage';
import EventsPage from './components/EventsPage';
import EventDetailsPage from './components/EventsPage/EventDetailsPage';
import CreateEventPage from './components/EventsPage/CreateEventPage';
import UpdateGroupPage from './components/GroupsPage/UpdateGroupPage';
import * as sessionActions from './store/session';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <ModalProvider>
        <Navigation isLoaded={isLoaded} />
        {isLoaded && <Outlet />}
        <Modal />
      </ModalProvider>
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandingPage />

      },
      {
        path: 'groups',
        element: <GroupsPage />
      },
      {
        path: 'groups/:groupId',
        element: <GroupDetailsPage />
      },
      {
        path: 'groups/:groupId/edit',
        element: <UpdateGroupPage />
      },
      {
        path: '/groups/:groupId/events/new',
        element: <CreateEventPage />
      },
      {
        path: 'groups/new',
        element: <CreateGroupPage />
      },
      {
        path: 'events',
        element: <EventsPage />
      },
      {
        path: 'events/:eventId',
        element: <EventDetailsPage />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
