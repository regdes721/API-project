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

    useEffect(() => {
        dispatch(fetchGroupDetails(groupId))
        dispatch(fetchEvents())
    }, [dispatch])
    return (
        <div>
            <div className="group-header-container">
                <div>
                    <p>{`<`} <NavLink to="/groups">Groups</NavLink></p>
                    {group.length === 1 ? group.map((group) => (
                        group.GroupImages.map((image) => image.preview === true ? <img src={image.url} /> : null)
                    )) : null}
                </div>
                <div className="group-header-text-container">
                    <h1>{group[0].name}</h1>
                    <h3>{`${group[0].city}, ${group[0].state}`}</h3>
                    <h3>{events.filter((event) => event.groupId === group[0].id).length === 1 ? `${events.filter((event) => event.groupId === group[0].id).length} Event` : `${events.filter((event) => event.groupId === group[0].id).length} Events`} · {group[0].private === true ? "Private" : "Public"}</h3>
                    <h3>Organized by {group[0].Organizer.firstName} {group[0].Organizer.lastName}</h3>
                    <button>Join this group</button>
                </div>
            </div>
            <div>
                <h2>Organizer</h2>
                <p>Firstname Lastname</p>
                <h2>What we are about</h2>
                <p>about</p>
                <h2>Upcoming Events</h2>
                <div>
                    <div>
                    </div>
                    <div>
                        <h4>YYYY-MM-DD · time</h4>
                        <h3>Event title with word wrapping</h3>
                        <h4>Location</h4>
                    </div>
                    <div>Details</div>
                </div>
                <h2>Past Events</h2>
                <div>
                    <div>
                    </div>
                    <div>
                        <h4>YYYY-MM-DD · time</h4>
                        <h3>Event title with word wrapping</h3>
                        <h4>Location</h4>
                    </div>
                    <div>Details</div>
                </div>
            </div>
        </div>
    )
}

export default GroupDetailsPage;
