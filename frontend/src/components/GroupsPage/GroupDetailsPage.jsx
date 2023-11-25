import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, NavLink } from "react-router-dom";
import { fetchGroupDetails, fetchGroups } from "../../store/groups";
import { fetchEvents } from "../../store/events";
import OpenModalActionButton from "./OpenModalActionButton";
import './GroupDetailsPage.css'
import DeleteGroupModal from "./DeleteGroupModal/DeleteGroupModal";

const GroupDetailsPage = () => {
    const { groupId } = useParams();
    const dispatch = useDispatch();
    const groupDetailsObj = useSelector(state => state.groups.singleGroup);
    const group = Object.values(groupDetailsObj);
    const allGroupsObj = useSelector(state => state.groups.allGroups)
    const eventsObj = useSelector(state => state.events.allEvents)
    const events = Object.values(eventsObj)
    const sessionUser = useSelector((state) => state.session.user);

    // console.log(allGroupsObj[groupId])

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
        dispatch(fetchGroups())
        dispatch(fetchEvents())
    }, [dispatch, groupId])

    return (
        <div>
            <div className="group-header-container">
                <div>
                    <p>{`<`} <NavLink to="/groups" className="breadcrumb">Groups</NavLink></p>
                    {group.length === 1 && allGroupsObj[groupId] ? <img src={allGroupsObj[groupId].previewImage} /> : null}
                    {/* {group.length === 1 ? group.map((group) => (
                        group.GroupImages.map((image) => image.preview === true ? <img src={image.url} /> : null)
                    )) : null} */}
                </div>
                <div className="group-header-text-container">
                    {group.length === 1 ? <h1>{group[0].name}</h1> : null}
                    {group.length === 1 ? <h3>{`${group[0].city}, ${group[0].state}`}</h3> : null}
                    {group.length === 1 ? <h3>{events.filter((event) => event.groupId === group[0].id).length === 1 ? `${events.filter((event) => event.groupId === group[0].id).length} Event` : `${events.filter((event) => event.groupId === group[0].id).length} Events`} · {group[0].isPrivate === true ? "Private" : "Public"}</h3> : null}
                    {group.length === 1 ? <h3>Organized by {group[0].Organizer.firstName} {group[0].Organizer.lastName}</h3> : null}
                    <button className={`${joinButtonClassName} join-button`} onClick={() => (alert(`Feature Coming Soon...`))}>Join this group</button>
                    <div className={`${organizerButtonClassName} organizer-button-container`}>
                        {group.length === 1 ? <NavLink to={`/groups/${group[0].id}/events/new`} className="organizer-button-link"><button className="organizer-button">Create Event</button></NavLink> : null}
                        {group.length === 1 ? <NavLink to={`/groups/${group[0].id}/edit`} className="organizer-button-link">                        <button className="organizer-button">Update</button>
                        </NavLink> : null}
                        <OpenModalActionButton
                        itemText="Delete"
                        modalComponent={<DeleteGroupModal />}
                        />
                    </div>
                </div>
            </div>
            <div className="group-body-container">
                <div className="group-body-content-container">
                    <h2>Organizer</h2>
                    {group.length === 1 ? <p>{group[0].Organizer.firstName} {group[0].Organizer.lastName}</p> : null}
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
                        <div className="group-events-container" key={event.id}>
                            <div className="group-events-details-container">
                                <div>
                                    <NavLink to={`/events/${event.id}`}><img src={event.previewImage} /></NavLink>
                                </div>
                                <div>
                                    <NavLink to={`/events/${event.id}`} className="eventText-date"><h4>{event.startDate.split(" ").join(" · ")}</h4></NavLink>
                                    <NavLink to={`/events/${event.id}`} className="eventText-name"><h3>{event.name}</h3></NavLink>
                                    <NavLink to={`/events/${event.id}`} className="eventText-location">{event.Venue ?
                                        <h4>{`${event.Venue.city}, ${event.Venue.state}`}</h4> : <h4>Online</h4>}</NavLink>
                                </div>
                            </div>
                            <div>
                                <NavLink to={`/events/${event.id}`} className="eventText-name"><p>{event.description}</p></NavLink>
                            </div>
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
                        <div className="group-events-container" key={event.id}>
                            <div className="group-events-details-container">
                                <div>
                                    <NavLink to={`/events/${event.id}`}><img src={event.previewImage} /></NavLink>
                                </div>
                                <div>
                                    <NavLink to={`/events/${event.id}`} className="eventText-date"><h4>{event.startDate.split(" ").join(" · ")}</h4></NavLink>
                                    <NavLink to={`/events/${event.id}`} className="eventText-name"><h3>{event.name}</h3></NavLink>
                                    <NavLink to={`/events/${event.id}`} className="eventText-location">{event.Venue ?
                                        <h4>{`${event.Venue.city}, ${event.Venue.state}`}</h4> : <h4>Online</h4>}</NavLink>
                                </div>
                            </div>
                            <div>
                                <NavLink to={`/events/${event.id}`} className="eventText-name"><p>{event.description}</p></NavLink>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default GroupDetailsPage;
