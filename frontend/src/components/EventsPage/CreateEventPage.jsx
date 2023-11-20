import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroupDetails } from '../../store/groups';
import './CreateEventPage.css'

const CreateEventPage = () => {
    const { groupId } = useParams();
    const dispatch = useDispatch();
    const groupDetailsObj = useSelector(state => state.groups.entries);
    const group = Object.values(groupDetailsObj);
    const [name, setName] = useState("");
    const [type, setType] = useState(null);
    const [price, setPrice] = useState(null);
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
        </form>
    )
}

export default CreateEventPage;
