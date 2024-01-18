import React from 'react';
import './../App.css';
import { useTaskContext } from '../context/TaskContext';

const Header = () => {
    const { state, dispatch } = useTaskContext();

    const handleAddTask = () => {
        dispatch({ type: 'TOGGLE_MODAL' });
    };

    const handleToggleLogin = () => {
        if (state.loggedIn) {
            dispatch({ type: 'LOGOUT' });
        } else {
            dispatch({ type: 'TOGGLE_LOGIN_MODAL' });
        }
    };

    return (
        <div className="headerMainCont">
            <img src={require('./../assets/list.png')} alt="logo" className="logo" />

            <div className="buttonSec">
                <button className="addButton" onClick={handleAddTask}>
                    Add Task
                </button>
                <button className="loginButton" onClick={handleToggleLogin}>
                    {state.loggedIn ? 'Logout' : 'Login'}
                </button>
            </div>
        </div>
    );
};

export default Header;