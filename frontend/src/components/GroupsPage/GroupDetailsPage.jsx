import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, NavLink } from "react-router-dom";
import { fetchGroupDetails } from "../../store/groups";
import { fetchEvents } from "../../store/events";
import './GroupDetailsPage.css'

const GroupDetailsPage = () => {
    const { groupId } = useParams();
    const dispatch = useDispatch();
    const groupDetailsObj = useSelector(state => state.groups.entries);
    const group = Object.values(groupDetailsObj);
    // console.log(group);
    const eventsObj = useSelector(state => state.events.entries)
    const events = Object.values(eventsObj)
    const sessionUser = useSelector((state) => state.session.user);

    const joinButtonClassName = (!sessionUser || group.length === 1 && sessionUser.id === group[0].Organizer.id) ? "hidden" : null

    const organizerButtonClassName = (!sessionUser || group.length === 1 && sessionUser.id !== group[0].Organizer.id) ? "hidden" : null

    const sortedUpcomingEvents = group.length === 1 ? events.filter((event) => event.groupId === group[0].id && new Date(event.startDate) > new Date()).sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        : []

    const upcomingEventCount = group.length === 1 ? `(${events.filter((event) => event.groupId === group[0].id && new Date(event.startDate) > new Date()).length})`
        : `(0)`

    const sortedPastEvents = group.length === 1 ? events.filter((event) => event.groupId === group[0].id && new Date(event.startDate) < new Date()).sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
        : []

    const pastEventCount = group.length === 1 ? `(${events.filter((event) => event.groupId === group[0].id && new Date(event.startDate) < new Date()).length})`
        : `(0)`

    // console.log(sortedPastEvents)

    useEffect(() => {
        dispatch(fetchGroupDetails(groupId))
        dispatch(fetchEvents())
    }, [dispatch])
    return (
        <div>
            <div className="group-header-container">
                <div>
                    <p>{`<`} <NavLink to="/groups" className="breadcrumb">Groups</NavLink></p>
                    {group.length === 1 ? group.map((group) => (
                        group.GroupImages.map((image) => image.preview === true ? <img src={image.url} /> : null)
                    )) : null}
                </div>
                <div className="group-header-text-container">
                    {group.length === 1 ? <h1>{group[0].name}</h1> : null}
                    {group.length === 1 ? <h3>{`${group[0].city}, ${group[0].state}`}</h3> : null}
                    {group.length === 1 ? <h3>{events.filter((event) => event.groupId === group[0].id).length === 1 ? `${events.filter((event) => event.groupId === group[0].id).length} Event` : `${events.filter((event) => event.groupId === group[0].id).length} Events`} · {group[0].private === true ? "Private" : "Public"}</h3> : null}
                    {group.length === 1 ? <h3>Organized by {group[0].Organizer.firstName} {group[0].Organizer.lastName}</h3> : null}
                    <button className={`${joinButtonClassName} join-button`} onClick={() => (alert(`Feature Coming Soon...`))}>Join this group</button>
                    <div className={`${organizerButtonClassName} organizer-button-container`}>
                        <button className="organizer-button">Create Event</button>
                        <button className="organizer-button">Update</button>
                        <button className="organizer-button">Delete</button>
                    </div>
                </div>
            </div>
            <div className="group-body-container">
                <div className="group-body-content-container">
                    <h2>Organizer</h2>
                    {group.length === 1 ? <p>Organized by {group[0].Organizer.firstName} {group[0].Organizer.lastName}</p> : null}
                </div>
                <div className="group-body-content-container">
                    <h2>What we&apos;re about</h2>
                    {group.length === 1 ? <p>{group[0].about}</p> : null}
                </div>
                <div className="group-body-content-container">
                    {group.length === 1 ? (
                        <h2>
                            {`Upcoming Events ${upcomingEventCount}`}
                        </h2>
                    ) : (
                        null
                    )}
                    {sortedUpcomingEvents.map((event) =>
                        <div className="group-events-container">
                            <div>
                                <img src={event.previewImage} />
                            </div>
                            <div>
                                <h4>{event.startDate.split(" ").join(" · ")}</h4>
                                <h3>{event.name}</h3>
                                {event.Venue ?
                                    <h4>{`${event.Venue.city}, ${event.Venue.state}`}</h4> : <h4>Online</h4>}
                            </div>
                            <div>Details</div>
                        </div>
                    )}
                </div>
                <div className="group-body-content-container">
                    {group.length === 1 ? (
                        <h2>
                            {`Past Events ${pastEventCount}`}
                        </h2>
                    ) : (
                        null
                    )}
                    {sortedPastEvents.map((event) =>
                        <div className="group-events-container">
                            <div>
                                <img src={event.previewImage} />
                            </div>
                            <div>
                                <h4>{event.startDate.split(" ").join(" · ")}</h4>
                                <h3>{event.name}</h3>
                                {event.Venue ?
                                    <h4>{`${event.Venue.city}, ${event.Venue.state}`}</h4> : <h4>Online</h4>}
                            </div>
                            <div>Details</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default GroupDetailsPage;