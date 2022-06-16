import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSortType } from '../../redux/reducers/todo';
 
const Sort = () => {

    const [sortTypes, setSortTypes] = useState([
        {
            active: false,
            type: 'date',
            title: 'Date'
        },
        {
            active: false,
            type: 'status',
            title: 'Status'
        }
    ]);

    const storeToDo = useSelector((state) => state.todo);

    const dispatch = useDispatch();

    useEffect(() => {
        setSortTypes((prev) => prev.map((a) => {
            if (storeToDo.sort.includes(a.type)) {
                a.active = true;
            } else {
                a.active = false;
            }
            return a;
        }));
    }, [storeToDo.sort]);

    const selectSortType = (type) => {
        dispatch(setSortType({
            type
        }));
    };

    return (
        <div className="sort">
            <div className="sort-title">
                <span>Sort by:</span>
            </div>
            <ul className="sort-list">
                {sortTypes.map((sort) => (
                    <li key={sort.type} onClick={() => selectSortType(sort.type)} className={`sort-list__item ${sort.active ? 'item-active' : ''}`}>
                        <div className="sort-list__item-title">
                            <span>{sort.title}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sort;