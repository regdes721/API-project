import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet, NavLink} from 'react-router-dom';
import Navigation from './components/Navigation';
import GroupsPage from './components/GroupsPage';
import GroupDetailsPage from './components/GroupsPage/GroupDetailsPage';
import EventsPage from './components/EventsPage';
import EventDetailsPage from './components/EventsPage/EventDetailsPage';
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
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element:
        <>
          <h1>Welcome!</h1>
          <div>
            <NavLink to="/groups">See all groups</NavLink>
            <NavLink to="/events">Find an event</NavLink>
          </div>
        </>
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
