import { csrfFetch } from './csrf';
import { fetchGroupDetails } from './groups';

const LOAD_EVENTS = 'events/loadEvents';
const LOAD_EVENT_DETAILS = 'events/loadEventDetails'
const CREATE_EVENT = 'events/createEvent'
const CREATE_EVENT_IMAGE = 'events/createEventImage'
const DELETE_EVENT = 'events/deleteEvent'

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

export const createEvent = (event) => {
    return {
        type: CREATE_EVENT,
        event
    }
}

export const createEventImage = (eventImage) => {
    return {
        type: CREATE_EVENT_IMAGE,
        eventImage
    }
}

export const deleteEvent = () => {
    return {
        type: DELETE_EVENT
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
    if (response.ok) dispatch(fetchGroupDetails(events.Group.id))
}

export const thunkCreateEvent = (event) => async (dispatch) => {
    const { groupId, name, type, capacity, price, description, startDate, endDate, url } = event;
    const response = await csrfFetch(`/api/groups/${groupId}/events`, {
        method: "POST",
        body: JSON.stringify({
            name,
            type,
            capacity,
            price,
            description,
            startDate,
            endDate,
            url
        })
    })
    const data = await response.json();
    if (response.ok) {
        const eventId = data.id
        const object = {eventId, url}
        dispatch(createEvent(data))
        dispatch(thunkCreateEventPreviewImage(object))
        return data
    } else {
        return data
    }
}

export const thunkCreateEventPreviewImage = (eventImage) => async (dispatch) => {
    const { eventId, url } = eventImage;
    const response = await csrfFetch(`/api/events/${eventId}/images`, {
        method: "POST",
        body: JSON.stringify({ url, preview: true })
    })
    const data = await response.json();
    if (response.ok) {
        dispatch(createEventImage(data))
    }
}

export const thunkDeleteEvent = (event) => async (dispatch) => {
    const { eventId } = event;
    const response = await csrfFetch(`/api/events/${eventId}`, {
        method: "DELETE"
    })
    const data = await response.json();
    if (response.ok) {
        dispatch(deleteEvent(data))
        return data
    } else {
        return data
    }
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
        case CREATE_EVENT: {
            const newEvent = {}
            newEvent[0] = action.event
            return {...state, newEvent}
        }
        case CREATE_EVENT_IMAGE: {
            const newEventImage = {}
            newEvent[0] = action.eventImage
            return {...state, newEventImage}
        }
        case DELETE_EVENT: {
            return {...state, singleEvent: {}}
        }
        default:
            return state;
    }
}

export default eventReducer;
