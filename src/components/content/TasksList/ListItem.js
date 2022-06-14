import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeTask } from '../../../redux/reducers/todo.js';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import tasksStatus from '../../../data/tasksStatus.js';
import Spoiler from '../../elements/Spoiler';
import Dropdown from '../../elements/Dropdown';
import Information from './ListItem/Information.js';
import Edit from './ListItem/Edit.js';
import Dots1 from '../../../assets/images/icons/Dots-1';
import Pencil1 from '../../../assets/images/icons/Pencil-1';
import Trash1 from '../../../assets/images/icons/Trash-1';
import Cross1 from '../../../assets/images/icons/Cross-1';

const ListItem = ({ task, taskDelete }) => {

    const storeToDo = useSelector((state) => state.todo);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!task.isActive) {
            task.isEdit && setTaskIsEdit(false);
        }
    }, [task.isActive]);

    const findTaskStatus = (id) => {
        return tasksStatus.find((a) => a.id === id);
    };

    const setTaskIsActive = (isActive) => {
        dispatch(changeTask({
            id: task.id,
            data: {
                isActive
            }
        }));
    };

    const setTaskIsEdit = (isEdit) => {
        if (isEdit) {
            storeToDo.tasks.forEach((item) => {
                if (item.isActive && item.id !== task.id) {
                    dispatch(changeTask({
                        id: item.id,
                        data: {
                            isActive: false,
                            isEdit: false
                        }
                    }));
                }
            });
        }

        dispatch(changeTask({
            id: task.id,
            data: {
                isEdit
            }
        }));
    };

    return (
        <li className="tasks-list__item">
            <Spoiler
                active={task.isActive}
                activeCallback={(active) => setTaskIsActive(active)}
                header={(
                    <div className="task-list__item-spoiler__header">
                        <div className="task-list__item-spoiler__header-status">
                            <span className={findTaskStatus(task.is_status)?.className}></span>
                        </div>
                        <div className="task-list__item-spoiler__header-title">
                            <span>{task.title}</span>
                        </div>
                        <div className="task-list__item-spoiler__header-time">
                            <span>{new Date(task.date * 1000).toLocaleTimeString('uk-UA')}</span>
                        </div>
                        <div className="task-list__item-spoiler__header-action">
                        <SwitchTransition>
                            <CSSTransition
                                key={task.isEdit}
                                addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}
                                classNames="task-list-item-spoiler-header-action-animation">
                                    {task.isEdit ?
                                        <div onClick={() => {
                                            setTimeout(() => {
                                                setTaskIsEdit(false);
                                            }, task.isActive ? 0 : 500);
                                        }} className="task-list__item-spoiler__header-action__edit-close">
                                            <Cross1 />
                                        </div>
                                        :
                                        <Dropdown 
                                            action={(
                                                <Dots1 />
                                            )}>
                                                <div onClick={() => {
                                                        setTaskIsActive(true);
                                                        setTimeout(() => {
                                                            setTaskIsEdit(true);
                                                        }, task.isActive ? 0 : 500);
                                                    }} className="task-list__item-spoiler__header-action__edit">
                                                        <Pencil1 />
                                                </div>
                                                <div onClick={() => taskDelete(task.id)} className="task-list__item-spoiler__header-action__delete">
                                                    <Trash1 />
                                                </div>
                                        </Dropdown>
                                    }
                                </CSSTransition>
                            </SwitchTransition>
                        </div>
                    </div>
                )}>
                    <div className="task-list__item-spoiler__content">
                        <SwitchTransition>
                            <CSSTransition
                                key={task.isEdit}
                                addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}
                                classNames="task-list-item-spoiler-content-animation">
                                    {task.isEdit ?
                                        <Edit task={task} />
                                        :
                                        <Information task={task} />
                                    }
                            </CSSTransition>
                        </SwitchTransition>
                    </div>
            </Spoiler>
        </li>
    );
};

export default ListItem;