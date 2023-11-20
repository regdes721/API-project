import { csrfFetch } from './csrf';

const LOAD_EVENTS = 'events/loadEvents';
const LOAD_EVENT_DETAILS = 'events/loadEventDetails'

export const loadEvents = (events) => {
    return {
        type: LOAD_EVENTS,
        events
    }
}

export const loadEventDetails = (events) => {
    return {
        type: LOAD_EVENT_DETAILS,
        events
    }
}

export const fetchEvents = () => async (dispatch) => {
    const response = await csrfFetch('/api/events');
    const events = await response.json();
    dispatch(loadEvents(events));
}

export const fetchEventDetails = (eventId) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${eventId}`);
    const events = await response.json();
    dispatch(loadEventDetails(events));
}

const initialState = { allEvents: {}, singleEvent: {} };

const eventReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_EVENTS: {
            const allEvents = {}
            action.events.Events.forEach(event => {allEvents[event.id] = event})
            return {...state, allEvents};
        }
        case LOAD_EVENT_DETAILS: {
            const singleEvent = {}
            singleEvent[action.events.id] = action.events
            return {...state, singleEvent}
        }
        default:
            return state;
    }
}

export default eventReducer;
