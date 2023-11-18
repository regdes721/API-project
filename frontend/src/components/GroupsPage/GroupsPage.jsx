import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroups } from "../../store/groups";
import { NavLink } from 'react-router-dom';
import './GroupsPage.css';
import { fetchEvents } from "../../store/events";

const GroupsPage = () => {
    const dispatch = useDispatch();
    const groupsObj = useSelector(state => state.groups.entries);
    const groups = Object.values(groupsObj);
    const eventsObj = useSelector(state => state.events.entries)
    const events = Object.values(eventsObj)

    useEffect(() => {
        dispatch(fetchGroups())
        dispatch(fetchEvents())
    }, [dispatch]);

    return (
        <div className="groupsList-container">
            <div className="groupsList-header-container">
                <div className="groups-events-links-container">
                    <h2><NavLink to="/events" className="eventsLink">Events</NavLink></h2>
                    <h2><NavLink to="/groups" className="groupsLink">Groups</NavLink></h2>
                </div>
                <p>Groups in Meetup</p>
            </div>
            {groups.map((group) => (
                <div key={group.id} className="group-container">
                    <div className="groupImg-container">
                        <NavLink to={`/groups/${group.id}`}><img src={group.previewImage} /></NavLink>
                    </div>
                    <div className="groupText-container">
                        <NavLink to={`/groups/${group.id}`}className="groupText-name"><h3>{group.name}</h3></NavLink>
                        <NavLink to={`/groups/${group.id}`} className="groupText-location"><h4>{`${group.city}, ${group.state}`}</h4></NavLink>
                        <NavLink to={`/groups/${group.id}`}className="groupText-about"><p>{group.about}</p></NavLink>
                        <NavLink to={`/groups/${group.id}`}className="groupText-about"><h4>{events.filter((event) => event.groupId === group.id).length === 1 ? `${events.filter((event) => event.groupId === group.id).length} Event` : `${events.filter((event) => event.groupId === group.id).length} Events`} · {group.private === true ? "Private" : "Public"}</h4></NavLink>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default GroupsPage;
