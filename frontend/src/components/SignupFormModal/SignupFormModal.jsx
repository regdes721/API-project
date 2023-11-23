import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import { useModal } from '../../context/Modal';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      ).then(closeModal).catch(async (res) => {
        const data = await res.json();
        // console.log(data)
        // todo: get remaining errors from signup action response
        if (data?.errors) {
          setErrors(data.errors);
        }
      });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <div className='login-form-container'>
      <h1 className='login-header'>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className='login-form-content-container'>
          <label>
            Email
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {errors.email && <p className='login-form-content-container errors'>{errors.email}</p>}
        <div className='signup-form-content-container'>
          <label>
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        {errors.username && <p>{errors.username}</p>}
        <div className='login-form-content-container'>
          <label>
            First Name
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        {errors.firstName && <p className='login-form-content-container errors'>{errors.firstName}</p>}
        <div className='signup-form-content-container'>
          <label>
            Last Name
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        {errors.lastName && <p className='login-form-content-container errors'>{errors.lastName}</p>}
        <div className='login-form-content-container'>
          <label>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errors.password && <p className='login-form-content-container errors'>{errors.password}</p>}
        <div className='signup-form-content-container'>
          <label>
            Confirm Password
          </label>
          <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
        </div>
        {errors.confirmPassword && <p className='login-form-content-container errors'>{errors.confirmPassword}</p>}
        {!email.length || !username.length || !firstName.length || !lastName.length || !password.length || !confirmPassword.length || username.length < 4 || password.length < 6 ? <button type="submit" className='login-button' disabled={true}>Sign Up</button> : <button type="submit" className='login-button enabled'>Sign Up</button>}
      </form>
    </div>
  );
}

export default SignupFormModal;
