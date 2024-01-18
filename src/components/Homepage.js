import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './../App.css';

const LoginSchema = Yup.object().shape({
    username: Yup.string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be at most 20 characters')
        .required('Username is required'),
    password: Yup.string()
        .matches(
            /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
            'Password must contain at least 8 characters, 1 special character, and 1 numeric digit'
        )
        .required('Password is required'),
});

const AddTaskSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string()
        .min(10, 'Description must be at least 10 characters')
        .max(100, 'Description must be at most 100 characters')
        .required('Description is required'),
});

const Home = () => {
    const { state, dispatch } = useTaskContext();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [viewTaskModal, setViewTaskModal] = useState(false);
    const [editTaskModal, setEditTaskModal] = useState(false);
    const [viewTask, setViewTask] = useState(null);
    const [editTaskIndex, setEditTaskIndex] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');

    useEffect(() => {
        if (viewTask) {
            setTitle(viewTask.title);
            setDescription(viewTask.description);
        }
    }, [viewTask]);

    const handleCreateTask = () => {
        if (title.trim() === '' || description.trim() === '') {
            alert('Title and description are required');
            return;
        }

        dispatch({
            type: 'ADD_TASK',
            payload: { title, description },
        });

        setTitle('');
        setDescription('');
        dispatch({ type: 'TOGGLE_MODAL' });
    };

    const handleViewTask = (task) => {
        setViewTask(task);
        setViewTaskModal(true);
    };

    const closeModal = () => {
        setViewTaskModal(false);
        setViewTask(null);
    };

    const handleLogin = (values, { setSubmitting }) => {
        // Perform login logic
        // For now, just close the modal
        dispatch({ type: 'TOGGLE_LOGIN_MODAL' });
        dispatch({ type: 'LOGIN' });
        setSubmitting(false);
    };

    const handleDeleteTask = (taskIndex) => {
        dispatch({
            type: 'DELETE_TASK',
            payload: { index: taskIndex },
        });
    };

    const handleEditTask = (task, index) => {
        setEditTaskModal(true);
        setEditTaskIndex(index);
        setEditTitle(task.title);
        setEditDescription(task.description);
    };

    const handleUpdateTask = () => {
        if (editTitle.trim() === '' || editDescription.trim() === '') {
            alert('Title and description are required');
            return;
        }

        dispatch({
            type: 'UPDATE_TASK',
            payload: { index: editTaskIndex, title: editTitle, description: editDescription },
        });

        setEditTaskModal(false);
    };

    return (
        <div>
            {state.tasks.length === 0 && (
                <p>You have no tasks. Add New.</p>
            )}

            {/* Add Task Modal */}
            {state.showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <Formik
                            initialValues={{ title: '', description: '' }}
                            validationSchema={AddTaskSchema}
                            onSubmit={() => handleCreateTask()}
                        >
                            {({ errors, touched }) => (
                                <Form>
                                    <div>
                                        <label htmlFor="title">Title:</label>
                                        <Field
                                            type="text"
                                            id="title"
                                            name="title"
                                            className={`form-field ${errors.title && touched.title ? 'error-border' : ''}`}
                                        />
                                        <ErrorMessage name="title" component="div" className="error" />
                                    </div>
                                    <div>
                                        <label htmlFor="description">Description:</label>
                                        <Field
                                            as="textarea"
                                            id="description"
                                            name="description"
                                            className={`form-field ${errors.description && touched.description ? 'error-border' : ''}`}
                                        />
                                        <ErrorMessage name="description" component="div" className="error" />
                                    </div>
                                    <button type="submit">Create</button>
                                    <button className="cancel" onClick={() => dispatch({ type: 'TOGGLE_MODAL' })}>
                                        Cancel
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )}

            {/* View Login Modal */}
            {state.loginModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <Formik
                            initialValues={{ username: '', password: '' }}
                            validationSchema={LoginSchema}
                            onSubmit={handleLogin}
                        >
                            {({ errors, touched }) => (
                                <Form>
                                    <div>
                                        <label htmlFor="username">Username:</label>
                                        <Field
                                            type="text"
                                            id="username"
                                            name="username"
                                            className={`form-field ${errors.username && touched.username ? 'error-border' : ''}`}
                                        />
                                        <ErrorMessage name="username" component="div" className="error" />
                                    </div>
                                    <div>
                                        <label htmlFor="password">Password:</label>
                                        <Field
                                            type="password"
                                            id="password"
                                            name="password"
                                            className={`form-field ${errors.password && touched.password ? 'error-border' : ''}`}
                                        />
                                        <ErrorMessage name="password" component="div" className="error" />
                                    </div>
                                    <button type="submit">Login</button>
                                    <button className="cancel" onClick={() => dispatch({ type: 'TOGGLE_LOGIN_MODAL' })}>
                                        Cancel
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )}

            {/* View Task Modal */}
            {viewTaskModal && viewTask && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p>Title: {title}</p>
                        <p>Description: {description}</p>
                        <button className="cancel" onClick={closeModal}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Edit Task Modal */}
            {editTaskModal && editTaskIndex !== null && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <input
                            type="text"
                            placeholder="Title"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                        />
                        <textarea
                            placeholder="Description"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                        />
                        <button onClick={handleUpdateTask}>Update</button>
                        <button className="cancel" onClick={() => setEditTaskModal(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {state.tasks.length > 0 && (
                <div className="card">
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Action</th>
                                    {state.loggedIn && (
                                        <>
                                            <th>Edit</th>
                                            <th>Delete</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {state.tasks.map((task, index) => (
                                    <tr key={index}>
                                        <td>{task.title}</td>
                                        <td>
                                            <button onClick={() => handleViewTask(task)} className='viewButton'>View</button>
                                        </td>
                                        {state.loggedIn && (
                                            <>
                                                <td>
                                                    <button onClick={() => handleEditTask(task, index)} className='editButton'>Edit Task</button>
                                                </td>
                                                <td>
                                                    <button onClick={() => handleDeleteTask(index)} className='deleteButton'>Delete Task</button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;