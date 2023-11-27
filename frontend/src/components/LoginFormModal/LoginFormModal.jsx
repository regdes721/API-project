import { useState } from 'react';
// import { NavLink } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  // console.log(process.env.DEMO_USER)
  // console.log(import.meta.env.VITE_DEMO_USER)

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const handleDemo = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential: import.meta.env.VITE_DEMO_USER, password: import.meta.env.VITE_DEMO_PASSWORD }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  // const handleDemo = (e) => {
  //   e.preventDefault();
  //   setErrors({});
  //   return dispatch(sessionActions.login({ credential: 'Demo-lition', password: 'password' }))
  //     .then(closeModal)
  //     .catch(async (res) => {
  //       const data = await res.json();
  //       if (data && data.errors) {
  //         setErrors(data.errors);
  //       }
  //     });
  // };

  return (
    <div className='login-form-container'>
      <h1 className='login-header'>Log In</h1>
      <form onSubmit={handleSubmit}>
        <div className='login-form-content-container'>
          <label>
            Username or Email
            {/* <input
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            /> */}
          </label>
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </div>
        <div className='login-form-content-container'>
          <label>
            Password
            {/* <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          /> */}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errors.credential && (
          <p className='login-form-content-container errors'>{errors.credential}</p>
        )}
        <div>
          {credential.length < 4 || password.length < 6 ? <button type="submit" className='login-button' disabled={credential.length < 4 || password.length < 6}>Log In</button> : <button type="submit" className='login-button enabled pointer-cursor' disabled={credential.length < 4 || password.length < 6}>Log In</button>}
        </div>
        <div className='login-form-demo-user-container'>
          <p className='login-form-demo-user' onClick={handleDemo}>Demo User</p>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;
