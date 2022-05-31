import React, { useState, useEffect } from 'react';
import Input from '../../../elements/Input';
import Refresh1 from '../../../../assets/images/icons/Refresh-1';

const Edit = ({ task }) => {

    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);

    const [buttonSubmitDisabled, setButtonSubmitDisabled] = useState(true);
    const [buttonSubmitLoading, setButtonSubmitLoading] = useState(false);

    useEffect(() => {
        if (title && description) {
            if (title.valid && title.value !== task.title || 
                description.valid && description.value !== task.description) {
                    setButtonSubmitDisabled(false);
            } else {
                setButtonSubmitDisabled(true);
            }
        }
    }, [title, description]);

    const taskChange = (e) => {
        e.preventDefault();
        if (title.valid && 
            description.valid) {
            setButtonSubmitLoading(true);
            setTimeout(() => {
                setButtonSubmitLoading(false);
            }, 32000);
        } else {
            console.log('Check the correctness of the data in the fields');
        }
    };

    return (
        <div className="task-list__item-spoiler__content-edit">
            <div className="task-list__item-spoiler__content-edit__form">
                <form onSubmit={taskChange}>
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
                    <div className="task-list__item-spoiler__content-edit__form-action">
                        <button type="submit" className={`button button-primary button-loader ${buttonSubmitLoading ? 'button-loader__active' : ''}`} disabled={buttonSubmitDisabled}>
                            Change task
                            <Refresh1 className="button-loader__1" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Edit;