import React from 'react';
import Menu from './Menu';
import Content from './Content';

const ToDo = () => {

    return (
        <div className="todo">
            <div className="todo-wrapper">
                <Menu />
                <Content />
            </div>
        </div>
    );
};

export default ToDo;