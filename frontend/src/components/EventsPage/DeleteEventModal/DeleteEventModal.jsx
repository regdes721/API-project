import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../context/Modal";
import './DeleteEvent.css';
import { thunkDeleteEvent } from '../../../store/events';

function DeleteEventModal() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const eventDetailsObj = useSelector(state => state.events.singleEvent)
    const event = Object.values(eventDetailsObj);
    let eventId;
    if (event && event[0]) eventId = event[0].id
    const groupDetailsObj = useSelector(state => state.groups.singleGroup);
    const group = Object.values(groupDetailsObj);
    let groupId;
    if (group && group[0]) groupId = group[0].id
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    console.log("event", event)
    console.log("group", group)
    console.log("eventId", eventId)
    console.log("groupId", groupId)

    // console.log(group)

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(thunkDeleteEvent({eventId})).then(() => {
            navigate(`/groups/${groupId}`)
        }).then(closeModal).catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) {
                setErrors(data.errors)
            }
        })
    }

    return (
        <div className='delete-modal-container'>
            <h1 className='delete-modal-text'>Confirm Delete</h1>
            <p className='delete-modal-text'>Are you sure you want to remove this event?</p>
            <button className='delete-modal-button red-button' onClick={handleSubmit}>{`Yes (Delete Event)`}</button>
            <button className='delete-modal-button gray-button' onClick={closeModal}>{`No (Keep Event)`}</button>
        </div>
    )
}

export default DeleteEventModal;
