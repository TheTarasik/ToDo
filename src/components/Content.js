import React from 'react';
import {
    Routes,
    Route,
    useLocation
  } from 'react-router-dom';
  import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { toDoPublicRoutes } from '../data/routes';

const Content = () => {

    const location = useLocation();
    
    return (
        <div className="content">
            <div className="content-title">
                <h1>ToDo List</h1>
            </div>
            <TransitionGroup component={null}>
                <CSSTransition key={location.pathname} classNames="content-fade-animation" timeout={300}>
                    <Routes location={location}>
                        {toDoPublicRoutes.map(({ path, element }) => (
                            <Route key={path} path={path} element={element} />
                        ))}
                    </Routes>
                </CSSTransition>
            </TransitionGroup>
        </div>
    );
};

export default Content;