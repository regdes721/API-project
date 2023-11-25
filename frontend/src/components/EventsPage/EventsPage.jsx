import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';
import { fetchEvents } from "../../store/events";
import './EventsPage.css';

const EventsPage = () => {
    const dispatch = useDispatch();
    const eventsObj = useSelector(state => state.events.allEvents)
    const events = Object.values(eventsObj)
    const sortedUpcomingEvents = events.filter((event) => new Date(event.startDate) > new Date()).sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    const sortedPastEvents = events.filter((event) => new Date(event.startDate) < new Date()).sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
    const sortedEvents = [...sortedUpcomingEvents, ...sortedPastEvents]
    // console.log("unsorted events", events);
    // console.log("sorted events", sortedEvents)

    useEffect(() => {
        dispatch(fetchEvents())
    }, [dispatch]);

    return (
        <div className="eventsList-container">
            <div className="eventsList-header-container">
                <div className="groups-events-links-container">
                    <h2><NavLink to="/events" className="events-eventsLink">Events</NavLink></h2>
                    <h2><NavLink to="/groups" className="events-groupsLink">Groups</NavLink></h2>
                </div>
                <p>Events in Meetup</p>
            </div>
            {sortedEvents.map((event) => (
                <div className="event-container" key={event.id}>
                    <div className="event-details-container">
                        <div className="eventImg-container">
                            <NavLink to={`/events/${event.id}`}><img src={event.previewImage} /></NavLink>
                        </div>
                        <div className="eventText-container">
                            <NavLink to={`/events/${event.id}`} className="eventText-date"><h4>{event.startDate.split(" ").join(" · ")}</h4></NavLink>
                            <NavLink to={`/events/${event.id}`} className="eventText-name"><h3>{event.name}</h3></NavLink>
                            <NavLink to={`/events/${event.id}`} className="eventText-location">{event.Venue ? <h4>{`${event.Venue.city}, ${event.Venue.state}`}</h4> : <h4>Online</h4>}</NavLink>
                        </div>
                    </div>
                    <div>
                        <NavLink to={`/events/${event.id}`} className="eventText-name"><p>
                            {event.description}
                        </p></NavLink>
                    </div>
                </div>


            ))}
        </div>
    )
}

export default EventsPage;
