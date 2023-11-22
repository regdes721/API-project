import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../context/Modal";
import { thunkDeleteGroup } from '../../../store/groups';
import './DeleteModal.css';

function DeleteGroupModal() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const groupDetailsObj = useSelector(state => state.groups.singleGroup);
    const group = Object.values(groupDetailsObj);
    let groupId;
    if (group && group[0]) groupId = group[0].id
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    // console.log(message)

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(thunkDeleteGroup({groupId})).then(async (res) => {
            setMessage(res.message)
            console.log("then 1")
        }).then(() => {
            navigate(`/groups`)
            console.log("then 2")
        }).then(closeModal).catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) {
                setErrors(data.errors)
                // console.log(data.errors)
            }
        })
    }

    // if (message === "Successfully deleted") return <Navigate to={`/groups`} replace={true} />

    return (
        <div className='delete-modal-container'>
            <h1 className='delete-modal-text'>Confirm Delete</h1>
            <p className='delete-modal-text'>Are you sure you want to remove this group?</p>
            <button className='delete-modal-button red-button' onClick={handleSubmit}>{`Yes (Delete Group)`}</button>
            <button className='delete-modal-button gray-button' onClick={closeModal}>{`No (Keep Group)`}</button>
        </div>
    )
}

export default DeleteGroupModal;
