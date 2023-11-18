import { csrfFetch } from './csrf';

const LOAD_EVENTS = 'events/loadEvents';

export const loadEvents = (events) => {
    return {
        type: LOAD_EVENTS,
        events
    }
}

export const fetchEvents = () => async (dispatch) => {
    const response = await csrfFetch('/api/events');
    const events = await response.json();
    dispatch(loadEvents(events));
}

const initialState = { entries: {} };

const eventReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_EVENTS: {
            const entries = {}
            action.events.Events.forEach(event => {entries[event.id] = event})
            return {...state, entries};
        }
        default:
            return state;
    }
}

export default eventReducer;
