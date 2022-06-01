import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageCount, setTasks } from '../../../../redux/reducers/todo';
import DatePicker from 'react-datepicker';
import tasksStatus from '../../../../data/tasksStatus';
import useAPI from '../../../../hooks/useAPI';
import config from '../../../../config';
import Input from '../../../elements/Input';
import CheckboxRadio from '../../../elements/CheckboxRadio';
import Refresh1 from '../../../../assets/images/icons/Refresh-1';

const Edit = ({ task }) => {

    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [image, setImage] = useState(null);

    const [status, setStatus] = useState(null);

    const [datePickerDate, setDatePickerDate] = useState(new Date());

    const [buttonSubmitDisabled, setButtonSubmitDisabled] = useState(true);
    const [buttonSubmitLoading, setButtonSubmitLoading] = useState(false);

    const dispatch = useDispatch();
    const { apiPublic } = useAPI();

    useEffect(() => {
        setStatus(task.is_status);
        setDatePickerDate(new Date(task.date * 1000));
    }, [task.date]);

    useEffect(() => {
        if (title && description && image && datePickerDate) {
            if (title.valid && title.value !== task.title || 
                description.valid && description.value !== task.description || 
                image.valid && image.value !== task.image || 
                status !== task.is_status || 
                datePickerDate.getTime() !== new Date(task.date * 1000).getTime()) {
                    setButtonSubmitDisabled(false);
            } else {
                setButtonSubmitDisabled(true);
            }
        }
    }, [title, description, image, status, datePickerDate]);

    const taskEdit = async (e) => {
        e.preventDefault();
        if (title.valid && 
            description.valid &&
            image.valid) {
                try {
                    setButtonSubmitLoading(true);

                    const updateTask = await apiPublic(`/tasks/${task.id}`, {
                        method: 'PUT',
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
                    if (updateTask.status !== 200) {
                        return alert('Something went wrong!');
                    }

                    const getTasks = await apiPublic('/tasks');

                    const { data: tasks } = getTasks;

                    dispatch(setPageCount(Math.ceil(tasks.length / config.pagination.pageToShow)));
                    dispatch(setTasks(tasks));

                    alert('Changes saved successfully');
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
        <div className="task-list__item-spoiler__content-edit">
            <form onSubmit={taskEdit} className="task-list__item-spoiler__content-edit__form">
                <div className="task-list__item-spoiler__content-edit__form-inputs">
                    <Input
                        theme="primary"
                        placeholder="Title"
                        defaultValue={task.title}
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
                        defaultValue={task.description}
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
                        defaultValue={task.image}
                        validation={{
                            length: {
                                max: {
                                    value: 1000,
                                    message: {
                                        code: 1,
                                        text: 'Maximum length is 1000 characters'
                                    }
                                }
                            }
                        }}
                        validationCallback={(validation) => setImage(validation)}
                    />
                    <div className="task-list__item-spoiler__content-edit__form-inputs__image-preview">
                        <img 
                            onError={(e) => e.target.src = require('../../../../assets/images/image-default.png')} 
                            src={image?.value} 
                            alt="Task preview"
                        />
                    </div>
                </div>
                <div className="task-list__item-spoiler__content-edit__form-checkbox__radio">
                    {tasksStatus.map((status) => (
                        <CheckboxRadio
                            key={status.id}
                            onChange={() => setStatus(status.id)}
                            id={`taskListEditTaskStatus-${status.className}`}
                            name="taskListEditTaskStatus"
                            label={status.title}
                            defaultChecked={task.is_status === status.id && true}
                        />
                    ))}
                </div>
                <div className="task-list__item-spoiler__content-edit__form-calendar">
                    <DatePicker
                        inline
                        locale="en"
                        showTimeSelect
                        selected={datePickerDate}
                        onChange={(date) => setDatePickerDate(date)}
                        timeCaption="Time"
                    />
                </div>
                <div className="task-list__item-spoiler__content-edit__form-action">
                    <button type="submit" className={`button button-primary button-loader ${buttonSubmitLoading ? 'button-loader__active' : ''}`} disabled={buttonSubmitDisabled}>
                        Save changes
                        <Refresh1 className="button-loader__1" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Edit;