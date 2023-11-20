import { csrfFetch } from './csrf';

const LOAD_GROUPS = 'groups/loadGroups';
const LOAD_GROUP_DETAILS = 'groups/loadGroupDetails'

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
export const createGroup = (group) => async (dispatch) => {
    const { name, about, type, isPrivate, city, state } = group;
    const response = await csrfFetch("/api/groups", {
        method: "POST",
        body: JSON.stringify({
            name,
            about,
            type,
            isPrivate,
            city,
            state
        })
    });
    const data = await response.json();
    //if response.ok:
        // dispatch(loadGroupDetails(data.))
        // nest the add image thunk here
    // try
    // catch (e)
}

const initialState = { entries: {} };

const groupReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_GROUPS: {
            const entries = {}
            action.groups.Groups.forEach(group => {entries[group.id] = group})
            return {...state, entries};
        }
        case LOAD_GROUP_DETAILS: {
            const entries = {}
            entries[action.groups.id] = action.groups
            return {...state, entries};
        }
        default:
            return state;
    }
}

export default groupReducer;
