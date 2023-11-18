import { csrfFetch } from './csrf';

const LOAD_GROUPS = 'groups/loadGroups';

export const loadGroups = (groups) => {
    return {
        type: LOAD_GROUPS,
        groups
    }
}

export const fetchGroups = () => async (dispatch) => {
    const response = await csrfFetch('/api/groups');
    const groups = await response.json();
    dispatch(loadGroups(groups));
}

const initialState = { entries: {} };

const groupReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_GROUPS: {
            const entries = {}
            action.groups.Groups.forEach(group => {entries[group.id] = group})
            return {...state, entries};
        }
        default:
            return state;
    }
}

export default groupReducer;
