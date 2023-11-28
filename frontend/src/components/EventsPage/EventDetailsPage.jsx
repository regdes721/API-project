import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, NavLink } from "react-router-dom";
import { fetchEventDetails } from "../../store/events";
import { fetchGroups } from "../../store/groups";
import OpenModalActionButton from "../GroupsPage/OpenModalActionButton";
import DeleteEventModal from "./DeleteEventModal";
import './EventDetailsPage.css';

const EventDetailsPage = () => {
    const { eventId } = useParams();
    const dispatch = useDispatch();
    const eventDetailsObj = useSelector(state => state.events.singleEvent);
    const event = Object.values(eventDetailsObj);
    const groupDetailsObj = useSelector(state => state.groups.singleGroup);
    const group = Object.values(groupDetailsObj);
    const allGroupsObj = useSelector(state => state.groups.allGroups);
    const sessionUser = useSelector((state) => state.session.user);

    const organizerButtonClassName = (!sessionUser || group.length === 1 && sessionUser.id !== group[0].Organizer.id) ? "hidden" : null

    // console.log("event", event)
    // console.log("group", group)
    // console.log("eventDetailsObj", eventDetailsObj)
    // console.log("event", event)

    // console.log("date", new Date(event[0].startDate).getTime())

    useEffect(() => {
        dispatch(fetchEventDetails(eventId))
        dispatch(fetchGroups())
    }, [dispatch, eventId])

    if (event.length !== 1 || group.length !== 1) return null

    return (
        <div>
            <div className="event-header-container">
                <p>{`<`} <NavLink to="/events" className="breadcrumb">Events</NavLink></p>
                {event.length === 1 ? <h1>{event[0].name}</h1> : null}
                {group.length === 1 ? <h3 className="event-header-name">{`Hosted by ${group[0].Organizer.firstName} ${group[0].Organizer.lastName}`}</h3> : null}
            </div>
            <div className="event-body-container">
                <div className="event-body-content-container">
                    <div className="event-body-section1-container">
                        <div className="event-body-section1-img">
                            {event.length === 1 && event[0] && event[0].EventImages ? <img src={event[0].EventImages[0].url}/> : null}
                        </div>
                        <div className="event-body-cards-container">
                            <div className="event-group-card-container event-group-card1-container">
                                {event.length === 1 && group && allGroupsObj && allGroupsObj[group[0].id] ? <NavLink to={`/groups/${group[0].id}`}><img src={allGroupsObj[group[0].id].previewImage}/></NavLink> : null}
                                <div>
                                    {event.length === 1 ? <NavLink to={`/groups/${group[0].id}`} className="no-underline"><h4 className="event-group-card1-name">{group[0].name}</h4></ NavLink> : null}
                                    {event.length === 1 ? group[0].isPrivate === true ? <NavLink to={`/groups/${group[0].id}`} className="no-underline"><h5 className="event-group-card1-isPrivate">Private</h5></NavLink> : <NavLink to={`/groups/${group[0].id}`} className="no-underline"><h5 className="event-group-card1-isPrivate">Public</h5></NavLink> : null}
                                </div>
                            </div>
                            <div className="event-group-card-container">
                                <div className="event-card2-content">
                                    <i className="fa-regular fa-clock"></i>
                                    <div className="event-card2-dates">
                                        <h5>START</h5>
                                        <h5>END</h5>
                                    </div>
                                    <div>
                                        {event.length === 1 ? <h4 className="eventText-date">{event[0].startDate.split(" ").join(" · ")}</h4> : null}
                                        {event.length === 1 ? <h4 className="eventText-date">{event[0].endDate.split(" ").join(" · ")}</h4> : null}
                                    </div>
                                </div>
                                <div className="event-card2-content">
                                    <i className="fa-solid fa-dollar-sign"></i>
                                    <div>
                                        {event.length === 1 ? event[0].price > 0 ? <h5>{event[0].price.toFixed(2)}</h5> : <h5>FREE</h5> : null}
                                    </div>
                                </div>
                                <div className="event-card2-content">
                                    <i className="fa-solid fa-location-dot"></i>
                                    <div>
                                        {event.length === 1 ? <h5>{event[0].type}</h5> : null}
                                    </div>
                                    <div className={`${organizerButtonClassName} event-card2-button-container`}>
                                        <button className="organizer-button event-button" onClick={() => (alert(`Feature Coming Soon...`))}>Update</button>
                                        <OpenModalActionButton
                                        itemText="Delete"
                                        modalComponent={<DeleteEventModal />}
                                        />
                                        {/* <button className="organizer-button event-button">Delete 2</button> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2>Details</h2>
                        {event.length === 1 ? <p>{event[0].description}</p> : null }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventDetailsPage;
