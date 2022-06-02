import Home from '../components/content/Home';
import Archive from '../components/content/Archive';
import TaskManager from '../components/TaskManager';

export const toDoPublicRoutes = [
    {
        path: 'home',
        name: 'home',
        title: 'Home',
        element: <Home />
    },
    {
        path: 'archive',
        name: 'archive',
        title: 'Archive',
        element: <Archive />
    },
    {
        path: 'task-manager',
        name: 'task-manager',
        title: 'Task manager',
        element: <TaskManager />
    }
];