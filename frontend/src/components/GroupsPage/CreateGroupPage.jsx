import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { thunkCreateGroup } from '../../store/groups';
import './CreateGroupPage.css'

const CreateGroupPage = () => {
    const dispatch = useDispatch();
    // const sessionUser = useSelector((state) => state.session.user);
    // const groupObj = useSelector ((state) => state.groups.newGroup)
    const [newGroupId, setNewGroupId] = useState(null)
    const [location, setLocation] = useState("");
    const [name, setName] = useState("");
    const [about, setAbout] = useState("");
    const [url, setUrl] = useState("");
    const [type, setType] = useState("");
    const [isPrivate, setIsPrivate] = useState("");
    const [errors, setErrors] = useState({});
    // const [goodForm, setGoodForm] = useState(false)

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
            thunkCreateGroup({
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
                setType("");
            }

        })
        setLocation("");
        setName("");
        setAbout("");
        setUrl("");
        setType("");
        setIsPrivate("");
    }

    if (newGroupId) return <Navigate to={`/groups/${newGroupId}`} replace={true} />

    return (
        <form className="createGroup-form-container" onSubmit={handleSubmit}>
            <div className='createGroup-form-section-container'>
                <h3 className='createGroup-teal'>BECOME AN ORGANIZER</h3>
                <h2>We&apos;ll walk you through a few steps to build your local community</h2>
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
            <button type="submit" className='create-button'>Create group</button>
        </form>
    )
}

export default CreateGroupPage;
