import React from 'react';
import {
    Routes,
    Route
  } from 'react-router-dom';
import { toDoPublicRoutes } from '../data/routes';

const Content = () => {
    return (
        <div className="content">
            <div className="content-title">
                <h1>ToDo List</h1>
            </div>
            <Routes>
                {toDoPublicRoutes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                ))}
            </Routes>
        </div>
    );
};

export default Content;