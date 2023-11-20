import { useState } from 'react';
import { useSelector } from 'react-redux';
import './CreateGroupPage.css'

const CreateGroupPage = () => {
    const sessionUser = useSelector((state) => state.session.user);
    const [location, setLocation] = useState("");
    const [name, setName] = useState("");
    const [about, setAbout] = useState("");
    const [url, setUrl] = useState("");
    const [type, setType] = useState(null);
    const [privateBoolean, setPrivateBoolean] = useState(null);
    const [errors, setErrors] = useState({});

    // console.log(sessionUser)

    return (
        <form className="createGroup-form-container">
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
                    required
                />
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
                    required
                />
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
            </div>
            <div className='createGroup-form-section-container'>
                <h2>Final steps...</h2>
                <p>Is this an in-person or online group?</p>
                <select onChange={(e) => setType(e.target.value)}>
                    <option value="" disabled selected>{`(Select one)`}</option>
                    <option value="In person">In Person</option>
                    <option value="Online">Online</option>
                </select>
                <p>Is this group private or public?</p>
                <select onChange={(e) => setPrivateBoolean(e.target.value === 'true')}>
                    <option value="" disabled selected>{`(Select one)`}</option>
                    <option value="true">Private</option>
                    <option value="false">Public</option>
                </select>
                <p>Please add an image url for your group below:</p>
                <input
                    className='createGroup-form-input'
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder='Image Url'
                    required
                />
            </div>
            <button type="submit" className='create-button'>Create group</button>
        </form>
    )
}

export default CreateGroupPage;
