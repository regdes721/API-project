import { NavLink } from 'react-router-dom';
import './LandingPage.css'

const LandingPage = () => {
    return (
        <div className='landing-container'>
            <div className="landing-section-1">
                <div>
                    <h1>The people platform—Where interests become friendships</h1>
                    <p>Whatever your interest, from hiking and reading to networking and skill sharing, there are thousands of people who share it on Meetup. Events are happening every day—sign up to join the fun.</p>
                </div>
                <div>
                    <img src="https://secure.meetupstatic.com/next/images/indexPage/irl_event.svg?w=384" />
                </div>
            </div>
            <div className='landing-section-2'>
                <h2>How Meetup works</h2>
                <p>Since 2002, members have used Meetup to make new friends, meet like-minded people, spend time on hobbies, and connect with locals over shared interests.</p>
            </div>
            <div className='landing-section-3'>
                <div className='landing-section-3-links'>
                    <img src="https://imgur.com/a/iIUMddn" />
                    <NavLink to="/groups" className="landing-link-teal"><h3>See all groups</h3></NavLink>
                    <p>See who&apos;s hosting local events for all the things you love</p>
                </div>
                <div className='landing-section-3-links'>
                    <img src="https://imgur.com/a/iIUMddn" />
                    <NavLink to="/events" className="landing-link-teal"><h3>Find an event</h3></NavLink>
                    <p>Find your next adventure and connect with like-minded people - your next memorable experience is just a click away!</p>
                </div>
                <div className='landing-section-3-links'>
                    <img src="https://imgur.com/a/iIUMddn" />
                    <NavLink to="/groups/new" className="landing-link-teal"><h3>Start a new group</h3></NavLink>
                    <p>Create your own Meetup group, and draw from a community of millions.</p>
                </div>
            </div>
            <div className='landing-section-4'>
                <button className='join-meetup-button'>Join Meetup</button>
            </div>
        </div>
    )
}

export default LandingPage;
