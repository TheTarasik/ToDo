import React from 'react';
import { NavLink } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useSelector, useDispatch } from 'react-redux';
import { showMenu } from '../redux/reducers/menu';
import { toDoPublicRoutes } from '../data/routes';

const Menu = () => {

    const storeMenu = useSelector((state) => state.menu);

    const dispatch = useDispatch();

    return (
        <div className={`menu menu-${storeMenu.show ? 'active' : 'hide'}`}>
            <div className="menu-toggle">
                <button onClick={() => dispatch(showMenu())} className={storeMenu.show ? 'button-active' : ''}>
                    <div className="toggle-menu__line-1">
                        <span></span>
                    </div>
                    <div className="toggle-menu__line-2">
                        <span></span>
                    </div>
                    <div className="toggle-menu__line-3">
                        <span></span>
                    </div>
                </button>
            </div>
            <TransitionGroup component="ul" className="menu-list">
                {toDoPublicRoutes.map(({ path, title }) => (
                    storeMenu.show &&
                        <CSSTransition
                            key={path}
                            timeout={1000}
                            classNames="menu-list-item-animation">
                                <li className="menu-list__item">
                                    <div className="menu-list__item-title">
                                        <NavLink to={path} className={({ isActive }) => isActive ? 'active' : ''}>{title}</NavLink>
                                    </div>
                                </li>
                    </CSSTransition>
                ))}
            </TransitionGroup>
        </div>
    );
};

export default Menu;