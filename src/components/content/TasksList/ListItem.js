import React, { useState } from 'react';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import taskStatus from '../../../data/taskStatus.js';
import Spoiler from '../../elements/Spoiler';
import Dropdown from '../../elements/Dropdown';
import Dots1 from '../../../assets/images/icons/Dots-1';
import Pencil1 from '../../../assets/images/icons/Pencil-1';
import Trash1 from '../../../assets/images/icons/Trash-1';

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
                            <Dropdown 
                                action={(
                                    <Dots1 />
                                )}>
                                    <div onClick={() => {
                                            !spoilerActive && setSpoilerActive(true);
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
                        </div>
                    </div>
                )}>
                    <div className="task-list__item-spoiler__content">
                        <SwitchTransition>
                            <CSSTransition
                                key={isEdit}
                                addEndListener={(node, done) => node.addEventListener("transitionend", done, false)}
                                classNames="task-list-item-spoiler-content-animation">
                                    {isEdit ?
                                        <div className="task-list__item-spoiler__content-edit">
                                            123
                                        </div>
                                        :
                                        <div className="task-list__item-spoiler__content-information">
                                            <div className="task-list__item-spoiler__content-information__description">
                                                <p>{task.desciption ? task.desciption : <span className="description-unset">No description set</span>}</p>
                                            </div>
                                            <div className="task-list__item-spoiler__content-information__image">
                                                <img src={task.image ? task.image : require('../../../assets/images/image-default.png')} alt="Task preview" />
                                            </div>
                                        </div>
                                    }
                            </CSSTransition>
                        </SwitchTransition>
                    </div>
            </Spoiler>
        </li>
    );
};

export default ListItem;