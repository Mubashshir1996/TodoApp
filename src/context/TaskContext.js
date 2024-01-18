import React, { createContext, useContext, useReducer, useEffect } from 'react';

const TaskContext = createContext();

const initialState = {
    tasks: JSON.parse(localStorage.getItem('tasks')) || [],
    showModal: false,
    viewModal: false,
    loginModal: false,
    loggedIn: false,
};

const taskReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TASK':
            const newTasks = [...state.tasks, action.payload];
            localStorage.setItem('tasks', JSON.stringify(newTasks));
            return {
                ...state,
                tasks: newTasks,
                showModal: false,
            };
        case 'TOGGLE_MODAL':
            return {
                ...state,
                showModal: !state.showModal,
            };
        case 'TOGGLE_VIEW_MODAL':
            return {
                ...state,
                viewModal: !state.viewModal,
            };
        case 'TOGGLE_LOGIN_MODAL':
            return {
                ...state,
                loginModal: !state.loginModal,
            };
        case 'LOGIN':
            return {
                ...state,
                loggedIn: true,
                loginModal: false,
            };
        case 'LOGOUT':
            return {
                ...state,
                loggedIn: false,
            };
        case 'DELETE_TASK':
            const updatedTasks = state.tasks.filter((task, index) => index !== action.payload.index);
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
            return {
                ...state,
                tasks: updatedTasks,
            };
        case 'UPDATE_TASK':
            const editTasks = state.tasks.map((task, index) => {
                if (index === action.payload.index) {
                    return {
                        ...task,
                        title: action.payload.title,
                        description: action.payload.description,
                    };
                }
                return task;
            });
            localStorage.setItem('tasks', JSON.stringify(editTasks));
            return {
                ...state,
                tasks: editTasks,
            };
        default:
            return state;
    }
};

const TaskProvider = ({ children }) => {
    const [state, dispatch] = useReducer(taskReducer, initialState);

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
    }, [state.tasks]);

    return (
        <TaskContext.Provider value={{ state, dispatch }}>
            {children}
        </TaskContext.Provider>
    );
};

const useTaskContext = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTaskContext must be used within a TaskProvider');
    }
    return context;
};

export { TaskProvider, useTaskContext };