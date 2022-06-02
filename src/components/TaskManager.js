import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setTasks, setPageCount } from '../redux/reducers/todo';
import DatePicker from 'react-datepicker';
import tasksStatus from '../data/tasksStatus';
import useAPI from '../hooks/useAPI';
import config from '../config';
import Input from './elements/Input';
import CheckboxRadio from './elements/CheckboxRadio';
import Refresh1 from '../assets/images/icons/Refresh-1';

const TaskManager = () => {

    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [image, setImage] = useState(null);

    const [status, setStatus] = useState(0);

    const [datePickerDate, setDatePickerDate] = useState(new Date());

    const [buttonSubmitDisabled, setButtonSubmitDisabled] = useState(true);
    const [buttonSubmitLoading, setButtonSubmitLoading] = useState(false);

    const dispatch = useDispatch();
    const { apiPublic } = useAPI();

    useEffect(() => {
        if (title?.valid && 
            description?.valid && 
            image?.valid) {
                    setButtonSubmitDisabled(false);
                } else {
                    setButtonSubmitDisabled(true);
                }
    }, [title, description, image]);

    const taskAdd = async (e) => {
        e.preventDefault();
        if (title.valid && 
            description.valid &&
            image.valid) {
                try {
                    setButtonSubmitLoading(true);

                    const addTask = await apiPublic(`/tasks`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify({
                            title: title.value,
                            description: description.value,
                            image: image.value,
                            date: Math.floor(datePickerDate.getTime() / 1000),
                            is_status: status
                        })
                    });

                    // Must return from backend the status true/false
                    if (addTask.status !== 201) {
                        return alert('Something went wrong!');
                    }

                    const getTasks = await apiPublic('/tasks');

                    const { data: tasks } = getTasks;

                    dispatch(setPageCount(Math.ceil(tasks.length / config.pagination.pageToShow)));
                    dispatch(setTasks(tasks));

                    setButtonSubmitDisabled(true);

                    alert('Task added successfully.');
                } catch (e) {
                    alert(`Something went wrong: ${e.message}`);
                } finally {
                    setButtonSubmitLoading(false);
                }
        } else {
            console.log('Check the correctness of the data in the fields.');
        }
    };

    return (
        <div className="task-manager">
            <div className="task-manager__content">
                <form onSubmit={taskAdd} className="task-manager__content-form">
                    <div className="task-manager__content-form__inputs">
                        <Input
                            theme="primary"
                            placeholder="Title"
                            validation={{
                                length: {
                                    min: {
                                        value: 1,
                                        message: {
                                            code: 1,
                                            text: 'The field must not be empty'
                                        }
                                    },
                                    max: {
                                        value: 50,
                                        message: {
                                            code: 1,
                                            text: 'Maximum length is 50 characters'
                                        }
                                    }
                                }
                            }}
                            validationCallback={(validation) => setTitle(validation)}
                        />
                        <Input
                            theme="primary"
                            placeholder="Description"
                            validation={{
                                length: {
                                    min: {
                                        value: 1,
                                        message: {
                                            code: 1,
                                            text: 'The field must not be empty'
                                        }
                                    },
                                    max: {
                                        value: 1000,
                                        message: {
                                            code: 1,
                                            text: 'Maximum length is 1000 characters'
                                        }
                                    }
                                }
                            }}
                            validationCallback={(validation) => setDescription(validation)}
                        />
                        <Input
                            theme="primary"
                            placeholder="Image"
                            validation={{
                                length: {
                                    max: {
                                        validOnMount: true,
                                        value: 2000,
                                        message: {
                                            code: 1,
                                            text: 'Maximum length is 2000 characters'
                                        }
                                    }
                                }
                            }}
                            validationCallback={(validation) => setImage(validation)}
                        />
                        {image?.value &&
                            <div className="task-manager__content-form__inputs-image__preview">
                                <img 
                                    onError={(e) => e.target.src = require('../assets/images/image-default.png')} 
                                    src={image?.value} 
                                    alt="Task preview"
                                />
                            </div>
                        }
                    </div>
                    <div className="task-manager__content-form__checkbox-radio">
                        {tasksStatus.map((status) => (
                            <CheckboxRadio
                                key={status.id}
                                onChange={() => setStatus(status.id)}
                                id={`taskListEditTaskStatus-${status.className}`}
                                name="taskListEditTaskStatus"
                                label={status.title}
                                defaultChecked={status.id === 0}
                            />
                        ))}
                    </div>
                    <div className="task-manager__content-form__calendar">
                        <DatePicker
                            inline
                            locale="en"
                            showTimeSelect
                            selected={datePickerDate}
                            onChange={(date) => setDatePickerDate(date)}
                            timeCaption="Time"
                        />
                    </div>
                    <div className="task-manager__content-form__action">
                        <button type="submit" className={`button button-primary button-loader ${buttonSubmitLoading ? 'button-loader__active' : ''}`} disabled={buttonSubmitDisabled}>
                            Add task
                            <Refresh1 className="button-loader__1" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskManager;