import React from 'react';
import { useDispatch } from 'react-redux';
import { setPageCount, setTasks } from '../../redux/reducers/todo.js';
import useAPI from '../../hooks/useAPI.js';
import config from '../../config.js';
import Spoiler from '../elements/Spoiler';
import Dropdown from '../elements/Dropdown';
import Dots1 from '../../assets/images/icons/Dots-1';
import Pencil1 from '../../assets/images/icons/Pencil-1';
import Trash1 from '../../assets/images/icons/Trash-1';

const TasksList = ({ tasks }) => {

    const dispatch = useDispatch();
    const { apiPublic } = useAPI();

    const taskDelete = async (id) => {
        try {
            const deleteTask = await apiPublic(`/tasks/${id}`, {
                method: 'DELETE'
            });

            if (deleteTask.status !== 200) {
                return console.log('Something went wrong!')
            }

            const getTasks = await apiPublic('/tasks');

            const { data: tasks } = getTasks;
            
            dispatch(setPageCount(Math.ceil(tasks.length / config.pagination.pageToShow)));
            dispatch(setTasks(tasks));
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <ul className="tasks-list">
            {tasks &&
                tasks.map((task) => (
                    <li key={task.id} className="tasks-list__item">
                        <Spoiler
                            header={(
                                <div className="task-list__item-spoiler__header">
                                    <div className="task-list__item-spoiler__header-status">
                                        <span className="success"></span>
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
                                                <div className="task-list__item-spoiler__header-action__edit">
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
                                    <div className="task-list__item-spoiler__content-description">
                                        <p>{task.desciption ? task.desciption : <span className="description-unset">No description set</span>}</p>
                                    </div>
                                </div>
                        </Spoiler>
                    </li>
                ))
            }
        </ul>
    );
};

export default TasksList;