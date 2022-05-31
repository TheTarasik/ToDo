import React, { useState } from 'react';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import taskStatus from '../../../data/taskStatus.js';
import Spoiler from '../../elements/Spoiler';
import Dropdown from '../../elements/Dropdown';
import Information from './ListItem/Information.js';
import Edit from './ListItem/Edit.js';
import Dots1 from '../../../assets/images/icons/Dots-1';
import Pencil1 from '../../../assets/images/icons/Pencil-1';
import Trash1 from '../../../assets/images/icons/Trash-1';
import Cross1 from '../../../assets/images/icons/Cross-1';

const ListItem = ({ task, taskDelete }) => {

    const [isEdit, setIsEdit] = useState(false);
    const [spoilerActive, setSpoilerActive] = useState(false);

    return (
        <li className="tasks-list__item">
            <Spoiler
                active={spoilerActive}
                activeCallback={(active) => setSpoilerActive(active)}
                header={(
                    <div className="task-list__item-spoiler__header">
                        <div className="task-list__item-spoiler__header-status">
                            <span className={taskStatus[task.is_status]?.className}></span>
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
                                key={isEdit}
                                addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}
                                classNames="task-list-item-spoiler-header-action-animation">
                                    {isEdit ?
                                        <div onClick={() => {
                                            setTimeout(() => {
                                                setIsEdit(false);
                                            }, spoilerActive ? 0 : 500);
                                        }} className="task-list__item-spoiler__header-action__edit-close">
                                            <Cross1 />
                                        </div>
                                        :
                                        <Dropdown 
                                            action={(
                                                <Dots1 />
                                            )}>
                                                <div onClick={() => {
                                                        setSpoilerActive(true);
                                                        setTimeout(() => {
                                                            setIsEdit(true);
                                                        }, spoilerActive ? 0 : 500);
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
                                key={isEdit}
                                addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}
                                classNames="task-list-item-spoiler-content-animation">
                                    {isEdit ?
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