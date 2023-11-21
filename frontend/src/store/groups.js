import { csrfFetch } from './csrf';

const LOAD_GROUPS = 'groups/loadGroups';
const LOAD_GROUP_DETAILS = 'groups/loadGroupDetails'
const CREATE_GROUP = 'groups/createGroup';

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

// export const createGroup = (group) => {
//     type: CREATE_GROUP
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
// export const createGroup = (group) => async (dispatch) => {
//     const { name, about, type, isPrivate, city, state, url } = group;
//     const response = await csrfFetch("/api/groups", {
//         method: "POST",
//         body: JSON.stringify({
//             name,
//             about,
//             type,
//             isPrivate,
//             city,
//             state
//         })
//     });
//     const data = await response.json();
//     if (response.ok) {

//     }
//     //if response.ok:
//         // dispatch(loadGroupDetails(data.))
//         // nest the add image thunk here
//     // try
//     // catch (e)
// }

const initialState = { allGroups: {}, singleGroup: {} };

const groupReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_GROUPS: {
            const allGroups = {}
            action.groups.Groups.forEach(group => {allGroups[group.id] = group})
            return {...state, allGroups};
        }
        case LOAD_GROUP_DETAILS: {
            const singleGroup = {}
            singleGroup[action.groups.id] = action.groups
            return {...state, singleGroup};
        }
        default:
            return state;
    }
}

export default groupReducer;
