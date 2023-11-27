import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroupDetails } from '../../store/groups';
import { thunkCreateEvent } from '../../store/events';
import './CreateEventPage.css'

const CreateEventPage = () => {
    const { groupId } = useParams();
    const dispatch = useDispatch();
    const groupDetailsObj = useSelector(state => state.groups.singleGroup);
    const group = Object.values(groupDetailsObj);
    const [newEventId, setNewEventId] = useState(null);
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [price, setPrice] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [url, setUrl] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState({});
    // console.log(group)
    // console.log(type)
    // console.log(price)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        dispatch(
            thunkCreateEvent({
                groupId,
                name,
                type,
                capacity: 100,
                price: parseFloat(price),
                description,
                startDate,
                endDate,
                url
            })
        ).then(async (res) => {
            setNewEventId(res.id)
        }).catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) {
                setErrors(data.errors)
                // console.log(data.errors)
            }
        })
        // setName("");
        // setType("");
        // setPrice("");
        // setStartDate("");
        // setEndDate("");
        // setDescription("");
        // setUrl("")
    }

    useEffect(() => {
        dispatch(fetchGroupDetails(groupId))
    }, [dispatch, groupId])

    if (newEventId) return <Navigate to={`/events/${newEventId}`} replace={true} />


    return (
        <form className='createEvent-form-container' onSubmit={handleSubmit}>
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
                {errors.name && (
                    <p className='errors'>{errors.name}</p>
                )}
            </div>
            <div className='createEvent-form-section-container'>
                <p>Is this an in person or online event?</p>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="" disabled>{`(Select one)`}</option>
                    <option value="In person">In Person</option>
                    <option value="Online">Online</option>
                </select>
                {errors.type && (
                    <p className='errors'>{errors.type}</p>
                )}
                <p className='createEvent-form-p'>What is the price for your event?</p>
                <input
                    className='createEvent-form-price-input'
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                />
                {errors.price && (
                    <p className='errors'>{errors.price}</p>
                )}
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
                {errors.startDate && (
                    <p className='errors'>{errors.startDate}</p>
                )}
                <p className='createEvent-form-p'>When does your event end?</p>
                <input
                    className='createEvent-form-date-input'
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder='MM/DD/YYYY HH:mm PM'
                />
                <i className="fa-regular fa-calendar-days"></i>
                {errors.endDate && (
                    <p className='errors'>{errors.endDate}</p>
                )}
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
                {errors.url && (
                    <p className='errors'>{errors.url}</p>
                )}
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
                {errors.description && (
                    <p className='errors'>{errors.description}</p>
                )}
            </div>
            <button type="submit" className='createEvent-button'>Create Event</button>
        </form>
    )
}

export default CreateEventPage;
