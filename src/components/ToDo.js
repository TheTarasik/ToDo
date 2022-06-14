import React from 'react';
import { NotificationContainer } from 'react-notifications';
import Menu from './Menu';
import Content from './Content';

const ToDo = () => {
    return (
        <div className="todo">
            <div className="todo-wrapper">
                <Menu />
                <Content />
            </div>
            <NotificationContainer />
        </div>
    );
};

export default ToDo;