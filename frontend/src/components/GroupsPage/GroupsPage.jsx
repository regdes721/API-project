import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroups } from "../../store/groups";
import { NavLink } from 'react-router-dom';
import './GroupsPage.css';

const GroupsPage = () => {
    const dispatch = useDispatch();
    const groupsObj = useSelector(state => state.groups.entries);
    const groups = Object.values(groupsObj);

    useEffect(() => {
        dispatch(fetchGroups())
    }, [dispatch]);

    return (
        <div>
            <div>
            <h2><NavLink to="/events" className="eventsLink">Events</NavLink></h2>
                <h2><NavLink to="/groups" className="groupsLink">Groups</NavLink></h2>
                <p>Groups in Meetup</p>
            </div>
            {groups.map((group) => (
                <div key={group.id}>
                    <div>
                        <img src={group.previewImage} />
                    </div>
                    <div>
                        <h3>{group.name}</h3>
                        <h4>{`${group.city}, ${group.state}`}</h4>
                        <p>{group.about}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default GroupsPage;
