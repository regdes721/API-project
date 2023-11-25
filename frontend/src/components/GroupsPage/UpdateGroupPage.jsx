import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import { fetchGroups, fetchGroupDetails, thunkUpdateGroup } from '../../store/groups';
import './CreateGroupPage.css'

const UpdateGroupPage = () => {
    const { groupId } = useParams();
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const groupObj = useSelector ((state) => state.groups.singleGroup)
    const group = Object.values(groupObj);
    const allGroupsObj = useSelector(state => state.groups.allGroups)
    const [newGroupId, setNewGroupId] = useState(null)
    const [location, setLocation] = useState(group && group[0] && group[0].city && group[0].state ? [group[0].city, group[0].state].join(", ") : "")
    const [name, setName] = useState(group && group[0] && group[0].name ? group[0].name : "");
    const [about, setAbout] = useState(group && group[0] && group[0].about ? group[0].about : "");
    const [url, setUrl] = useState(group && group[0] && allGroupsObj && allGroupsObj[groupId] ? allGroupsObj[groupId].previewImage : "");
    const [type, setType] = useState(group && group[0] && group[0].type ? group[0].type : "");
    const [isPrivate, setIsPrivate] = useState(group && group[0] && group[0].isPrivate ? group[0].isPrivate : "");
    const [errors, setErrors] = useState({});

    // console.log(group)
    // console.log(sessionUser)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        const city = location.split(", ")[0]
        const state = location.split(", ")[1]
        // if (!name) submitErrors.name = "Name is required"
        // console.log("name?", name)
        // setErrors(submitErrors)
        dispatch(
            thunkUpdateGroup({
                groupId,
                name,
                about,
                type,
                isPrivate,
                city,
                state,
                url
            })
        ).then(async (res) => {
            setNewGroupId(res.id);
        }).catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) {
                setErrors(data.errors)
                // setType("");
            }

        })
        // setLocation("");
        // setName("");
        // setAbout("");
        // setUrl("");
        // setType("");
        // setIsPrivate("");
    }

    // console.log("isPrivate", isPrivate)

    useEffect(() => {
        dispatch(fetchGroupDetails(parseInt(groupId)))
        dispatch(fetchGroups())
    }, [dispatch, groupId])

    if (newGroupId) return <Navigate to={`/groups/${newGroupId}`} replace={true} />

    if (!group) return null

    // console.log(url.endsWith(".jpg"));

    if (!sessionUser || sessionUser && group && group[0] && group[0].Organizer && group[0].Organizer.id && sessionUser.id !== group[0].Organizer.id) return <Navigate to={`/`} replace={true} />

    return (
        <form className="createGroup-form-container" onSubmit={handleSubmit}>
            <div className='createGroup-form-section-container'>
                <h3 className='createGroup-teal'>UPDATE YOUR GROUP&apos;S INFORMATION</h3>
                <h2>We&apos;ll walk you through a few steps to update your group&apos;s information</h2>
            </div>
            <div className='createGroup-form-section-container'>
                <h2>First, set your group&apos;s location.</h2>
                <p>Meetup groups meet locally, in person and online. We&apos;ll connect you with people in your area, and more can join you online.</p>
                <input
                    className='createGroup-form-input'
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, STATE"
                />
                {errors.location && (
                    <p>{errors.location}</p>
                )}
                 {errors.city && !errors.location && (
                    <p>{errors.city}</p>
                )}
                 {errors.state && !errors.location && (
                    <p className='errors'>{errors.state}</p>
                )}
            </div>
            <div className='createGroup-form-section-container'>
                <h2>What will your group&apos;s name be?</h2>
                <p>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</p>
                <input
                    className='createGroup-form-input'
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='What is your group name?'
                />
                    {errors.name && (
                    <p className='errors'>{errors.name}</p>
                )}
            </div>
            <div className='createGroup-form-section-container'>
                <h2>Now describe what your group will be about</h2>
                <p>People will see this when we promote your group, but you&apos;ll be able to add to it later, too.</p>
                <ol>
                    <li>What&apos;s the purpose of the group?</li>
                    <li>Who should join?</li>
                    <li>What will you do at your events?</li>
                </ol>
                <textarea
                    className='createGroup-form-input'
                    rows="8"
                    cols="40"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="Please write at least 50 characters"
                />
                    {errors.about && (
                    <p className='errors'>{errors.about}</p>
                )}
            </div>
            <div className='createGroup-form-section-container'>
                <h2>Final steps...</h2>
                <p>Is this an in-person or online group?</p>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="" disabled>{`(Select one)`}</option>
                    <option value="In person">In Person</option>
                    <option value="Online">Online</option>
                </select>
                {errors.type && (
                    <p className='errors'>{errors.type}</p>
                )}
                <p>Is this group private or public?</p>
                <select value={isPrivate} onChange={(e) => setIsPrivate(e.target.value === 'true')}>
                    <option value="" disabled>{`(Select one)`}</option>
                    <option value="true">Private</option>
                    <option value="false">Public</option>
                </select>
                {errors.isPrivate && (
                    <p className='errors'>{errors.isPrivate}</p>
                )}
                <p>Please add an image url for your group below:</p>
                <input
                    className='createGroup-form-input'
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder='Image Url'
                />
                    {errors.url && (
                    <p className='errors'>{errors.url}</p>
                )}
            </div>
            <button type="submit" className='create-button'>Update group</button>
        </form>
    )
}

export default UpdateGroupPage;
