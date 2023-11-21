import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroupDetails } from '../../store/groups';
import './CreateEventPage.css'

const CreateEventPage = () => {
    const { groupId } = useParams();
    const dispatch = useDispatch();
    const groupDetailsObj = useSelector(state => state.groups.singleGroup);
    const group = Object.values(groupDetailsObj);
    const [name, setName] = useState("");
    const [type, setType] = useState(null);
    const [price, setPrice] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [url, setUrl] = useState("");
    const [description, setDescription] = useState("");
    // console.log(group)
    // console.log(type)

    useEffect(() => {
        dispatch(fetchGroupDetails(groupId))
    }, [dispatch])

    return (
        <form className='createEvent-form-container'>
            <div className='createEvent-form-section-container'>
                {group.length === 1 ? <h2>{`Create an event for ${group[0].name}`}</h2> : null}
                <p>What is the name of your event?</p>
                <input
                    className='createEvent-form-input'
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Event Name"
                />
            </div>
            <div className='createEvent-form-section-container'>
                <p>Is this an in person or online event?</p>
                <select onChange={(e) => setType(e.target.value)}>
                    <option value="" disabled selected>{`(Select one)`}</option>
                    <option value="In person">In Person</option>
                    <option value="Online">Online</option>
                </select>
                <p className='createEvent-form-p'>What is the price for your event?</p>
                <input
                    className='createEvent-form-price-input'
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                />
            </div>
            <div className='createEvent-form-section-container'>
                <p>When does your event start?</p>
                <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder='MM/DD/YYYY HH:mm AM'
                />
                <i className="fa-regular fa-calendar-days"></i>
                <p className='createEvent-form-p'>When does your event end?</p>
                <input
                    className='createEvent-form-date-input'
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder='MM/DD/YYYY HH:mm PM'
                />
                <i className="fa-regular fa-calendar-days"></i>
            </div>
            <div className='createEvent-form-section-container'>
                <p>Please add an image url for your event below:</p>
                <input
                    className='createEvent-form-input'
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder='Image URL'
                />
            </div>
            <div>
                <p>Please describe your event:</p>
                <textarea
                    rows="13"
                    cols="90"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder='Please include at least 30 characters'
                />
                <button type="submit" className='createEvent-button'>Create Event</button>
            </div>
        </form>
    )
}

export default CreateEventPage;
