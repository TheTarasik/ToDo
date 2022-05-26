import Home from '../content/Home';
import Archive from '../content/Archive';

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
        element: <Home />
    }
];