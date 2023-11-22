import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useModal } from "../../../context/Modal";
import { thunkDeleteGroup } from '../../../store/groups';

function DeleteGroupModal() {
    const dispatch = useDispatch();
    const groupDetailsObj = useSelector(state => state.groups.singleGroup);
    const group = Object.values(groupDetailsObj);
    let groupId;
    if (group && group[0]) groupId = group[0].id
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    console.log(message)

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(thunkDeleteGroup({groupId})).then(async (res) => {
            setMessage(res.message)
        }).then(closeModal).catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) {
                setErrors(data.errors)
                // console.log(data.errors)
            }
        })
    }

    if (message === "Successfully deleted") return <Navigate to={`/groups`} replace={true} />

    return (
        <div>
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this group?</p>
            <button onClick={handleSubmit}>{`Yes (Delete Group)`}</button>
            <button onClick={closeModal}>{`No (Keep Group)`}</button>
            {/* <p>{groupId}</p> */}
        </div>
    )
}

export default DeleteGroupModal;
