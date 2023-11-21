import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, NavLink } from "react-router-dom";
import { fetchEventDetails } from "../../store/events";
import './EventDetailsPage.css';

const EventDetailsPage = () => {
    const { eventId } = useParams();
    const dispatch = useDispatch();
    const eventDetailsObj = useSelector(state => state.events.singleEvent);
    const event = Object.values(eventDetailsObj);
    const groupDetailsObj = useSelector(state => state.groups.singleGroup);
    const group = Object.values(groupDetailsObj);

    // console.log("event", event)
    // console.log("group", group)
    // console.log("eventDetailsObj", eventDetailsObj)
    // console.log("event", event)

    useEffect(() => {
        dispatch(fetchEventDetails(eventId))
    }, [dispatch])

    if (event.length !== 1 || group.length !== 1) return null

    return (
        <div>
            <div className="event-header-container">
                <p>{`<`} <NavLink to="/events" className="breadcrumb">Events</NavLink></p>
                {event.length === 1 ? <h1>{event[0].name}</h1> : null}
                {group.length === 1 ? <h3>{`Hosted by ${group[0].Organizer.firstName} ${group[0].Organizer.lastName}`}</h3> : null}
            </div>
        </div>
    )
}

export default EventDetailsPage;
