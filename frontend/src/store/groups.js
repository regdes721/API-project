import { csrfFetch } from './csrf';

const LOAD_GROUPS = 'groups/loadGroups';
const LOAD_GROUP_DETAILS = 'groups/loadGroupDetails'
const CREATE_GROUP = 'groups/createGroup';
const CREATE_GROUP_IMAGE = 'groups/createGroupImage';
const UPDATE_GROUP = 'groups/updateGroup';
const DELETE_GROUP = 'groups/deleteGroup'
// const RESET_NEW_GROUP = 'groups/resetNewGroup'


export const loadGroups = (groups) => {
    return {
        type: LOAD_GROUPS,
        groups
    }
}

export const loadGroupDetails = (groups) => {
    return {
        type: LOAD_GROUP_DETAILS,
        groups
    }
}

export const createGroup = (group) => {
    return {
        type: CREATE_GROUP,
        group
    }
}

export const createGroupImage = (groupImage) => {
    return {
        type: CREATE_GROUP_IMAGE,
        groupImage
    }
}

export const updateGroup = (group) => {
    return {
        type: UPDATE_GROUP,
        group
    }
}

export const deleteGroup = () => {
    return {
        type: DELETE_GROUP
    }
}

// export const resetNewGroup = () => {
//     return {
//         type: RESET_NEW_GROUP
//     }
// }

export const fetchGroups = () => async (dispatch) => {
    const response = await csrfFetch('/api/groups');
    const groups = await response.json();
    dispatch(loadGroups(groups));
}

export const fetchGroupDetails = (groupId) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${groupId}`);
    const groups = await response.json();
    dispatch(loadGroupDetails(groups));
}

// todo: complete this thunk
export const thunkCreateGroup = (group) => async (dispatch) => {
    const { name, about, type, isPrivate, city, state, url } = group;
    const response = await csrfFetch("/api/groups", {
        method: "POST",
        body: JSON.stringify({
            name,
            about,
            type,
            isPrivate,
            city,
            state,
            url
        })
    });
    const data = await response.json();
    if (response.ok) {
        const groupId = data.id
        const object = { groupId, url }
        dispatch(createGroup(data))
        dispatch(thunkCreatePreviewImage(object))
        return data
    } else {
        return data
    }
    //if response.ok:

    // nest the add image thunk here
    // try
    // catch (e)
}

export const thunkCreatePreviewImage = (groupImage) => async (dispatch) => {
    const { groupId, url } = groupImage;
    const response = await csrfFetch(`/api/groups/${groupId}/images`, {
        method: "POST",
        body: JSON.stringify({ url, preview: true })
    })
    const data = await response.json();
    if (response.ok) {
        dispatch(createGroupImage(data))
    }
}

export const thunkUpdateGroup = (group) => async (dispatch) => {
    const { groupId, name, about, type, isPrivate, city, state, url } = group;
    const response = await csrfFetch(`/api/groups/${groupId}`, {
        method: "PUT",
        body: JSON.stringify({
            name,
            about,
            type,
            isPrivate,
            city,
            state,
            url
        })
    });
    const data = await response.json();
    if (response.ok) {
        const groupId = data.id
        const object = { groupId, url }
        dispatch(updateGroup(data))
        dispatch(thunkCreatePreviewImage(object))
        return data
    } else {
        return data
    }
    //if response.ok:

    // nest the add image thunk here
    // try
    // catch (e)
}

export const thunkDeleteGroup = (group) => async (dispatch) => {
    const { groupId } = group;
    const response = await csrfFetch(`/api/groups/${groupId}`, {
        method: "DELETE"
    })
    const data = await response.json();
    if (response.ok) {
        dispatch(deleteGroup(data))
        return data
    } else {
        return data
    }
}

const initialState = { allGroups: {}, singleGroup: {} };

const groupReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_GROUPS: {
            const allGroups = {}
            action.groups.Groups.forEach(group => { allGroups[group.id] = group })
            return { ...state, allGroups };
        }
        case LOAD_GROUP_DETAILS: {
            const singleGroup = {}
            singleGroup[action.groups.id] = action.groups
            return { ...state, singleGroup };
        }
        case CREATE_GROUP: {
            const newGroup = {}
            newGroup[0] = action.group
            return { ...state, newGroup }
        }
        case CREATE_GROUP_IMAGE: {
            const newGroupImage = {}
            newGroupImage[0] = action.groupImage
            return {...state, newGroupImage}
        }
        case UPDATE_GROUP: {
            const newGroup = {}
            newGroup[0] = action.group
            return { ...state, newGroup }
        }
        case DELETE_GROUP: {
            return {...state, singleGroup: {}}
        }
        // case RESET_NEW_GROUP: {
        //     const newGroup = {}
        //     return { ...state, newGroup }
        // }
        default:
            return state;
    }
}

export default groupReducer;
