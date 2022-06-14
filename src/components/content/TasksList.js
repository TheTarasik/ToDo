import React from 'react';
import { useDispatch } from 'react-redux';
import { setPageCount, setTasks } from '../../redux/reducers/todo.js';
import { NotificationManager } from 'react-notifications';
import useAPI from '../../hooks/useAPI.js';
import config from '../../config.js';
import ListItem from './TasksList/ListItem.js';

const TasksList = ({ tasks, loadingCallback, action }) => {

    const dispatch = useDispatch();
    const { apiPublic } = useAPI();

    const taskDelete = async (id) => {
        try {
            loadingCallback(true);

            const deleteTask = await apiPublic(`/tasks/${id}`, {
                method: 'DELETE'
            });

            // Must return from backend the status true/false
            if (deleteTask.status !== 200) {
                return NotificationManager.error('Something went wrong...', 'ToDo');
            }

            const getTasks = await apiPublic('/tasks');

            const { data: tasks } = getTasks;

            dispatch(setPageCount(Math.ceil(tasks.length / config.pagination.pageToShow)));
            dispatch(setTasks(tasks));

            NotificationManager.success('Task deleted successfully.', 'ToDo');
        } catch (e) {
            NotificationManager.error(`Something went wrong: ${e.message}`, 'ToDo');
        } finally {
            loadingCallback(false);
        }
    };

    const updateTask = async (taskId, data) => {
        try {
            loadingCallback(true);

            const findTask = tasks.find((a) => a.id === taskId);

            if (findTask) {
                const updateTask = await apiPublic(`/tasks/${taskId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(data)
                });

                // Must return from backend the status true/false
                if (updateTask.status !== 200) {
                    return NotificationManager.error('Something went wrong...', 'ToDo');
                }

                const getTasks = await apiPublic('/tasks');

                const { data: tasks } = getTasks;

                dispatch(setPageCount(Math.ceil(tasks.length / config.pagination.pageToShow)));
                dispatch(setTasks(tasks));

                NotificationManager.success('Changes saved successfully.', 'ToDo');
            }
        } catch (e) {
            NotificationManager.error(`Something went wrong: ${e.message}`, 'ToDo');
        } finally {
            loadingCallback(false);
        }
    };

    return (
        <ul className="tasks-list">
            {tasks &&
                tasks.map((task) => (
                    <ListItem
                        key={task.id}
                        task={task}
                        taskDelete={taskDelete}
                        updateTask={updateTask}
                        action={action} />
                ))
            }
        </ul>
    );
};

export default TasksList;