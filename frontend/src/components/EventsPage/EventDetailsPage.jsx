import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, NavLink } from "react-router-dom";
import { fetchEventDetails } from "../../store/events";
import './EventDetailsPage.css';
import { fetchGroupDetails } from "../../store/groups";

const EventDetailsPage = () => {
    const { eventId } = useParams();
    const dispatch = useDispatch();
    const eventDetailsObj = useSelector(state => state.events.singleEvent);
    const event = Object.values(eventDetailsObj);
    // const groupDetailsObj = useSelector(state => state.groups.entries);
    // const group = Object.values(groupDetailsObj);

    console.log("eventDetailsObj", eventDetailsObj)
    console.log("event", event)

    useEffect(() => {
        dispatch(fetchEventDetails(eventId))
    }, [dispatch])
    return (
        <div>
            <div className="event-header-container">
                <p>{`<`} <NavLink to="/events" className="breadcrumb">Events</NavLink></p>
                {event.length === 1 ? <h1>{event[0].name}</h1> : null}
                <h3>{`Hosted by <Firstname> <Lastname>`}</h3>
            </div>
        </div>
    )
}

export default EventDetailsPage;
