import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setTasks, setPageCount } from '../../redux/reducers/todo';
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';
import useAPI from '../../hooks/useAPI';
import config from '../../config';
import Pagination from '../elements/Pagination';
import TasksList from './TasksList';
import Loading1 from '../../assets/images/loadings/Loading-1';

const highlightWithRanges = [
    {
        "react-datepicker__day--highlighted-custom-1": [
            new Date(),
            new Date(1653313103 * 1000)
        ],
    },
    {
        "react-datepicker__day--highlighted-custom-2": [
            new Date()
        ],
    },
];

const Home = () => {

    const [date, setDate] = useState(new Date());
    const [datePickerMaxHeight, setDatePickerMaxHeight] = useState(0);
    const [datePickerShow, setDatePickerShow] = useState(false);

    const [tasksPaginationOffset, setTasksPaginationOffset] = useState({
        from: 0,
        to: config.pagination.pageToShow
    });

    const [currentPage, setCurrentPage] = useState(1);

    const datePickerRef = useRef(null);

    const storeToDo = useSelector((state) => state.todo);

    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const { apiPublic } = useAPI();

    const params = Object.fromEntries([...searchParams]);

    useEffect(() => {
        apiPublic('/tasks') 
            .then((data) => {
                const { data: tasks } = data;

                dispatch(setPageCount(Math.ceil(tasks.length / config.pagination.pageToShow)));
                dispatch(setTasks(tasks));
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    useEffect(() => {
        let { page } = params;
        page = Number(page);

        if (!page || !storeToDo.pageCount) return;

        if (page > storeToDo.pageCount) {
            page = storeToDo.pageCount;
            setCurrentPage(page);
            setPagination(page);
            return setSearchParams({
                ...params,
                page
            });
        }

        setCurrentPage(page);
        setPagination(page);
    }, [storeToDo.pageCount]);

    useEffect(() => {
        if (datePickerRef.current) {
            setDatePickerMaxHeight(datePickerRef.current.calendar.componentNode.offsetHeight);
        }
    }, [datePickerRef]);

    const tasksPagination = useMemo(() => {
        if (storeToDo.tasks) {
            return storeToDo.tasks.slice(tasksPaginationOffset.from, tasksPaginationOffset.to);
        }
    }, [storeToDo.tasks, tasksPaginationOffset]);

    const changePage = (page) => {
        setSearchParams({
            ...params,
            page
        });
        setCurrentPage(page);
        setPagination(page);
    };

    const setPagination = (page) => {
        setTasksPaginationOffset({
            from: page * config.pagination.pageToShow - config.pagination.pageToShow,
            to: page * config.pagination.pageToShow
        });
    };
    
    return (
        <div className="home">
            <div className="home-content">
                <div className={`home-content__calendar ${datePickerShow ? 'calendar-active' : ''}`}>
                    <div className="home-content__calendar-input">
                        <div className="input-wrapper input-primary">
                            <div className="input-wrapper__content">
                                <input 
                                    type="text" 
                                    onClick={() => setDatePickerShow((prev) => !prev)} 
                                    className="input" 
                                    spellCheck="false" 
                                    value={dayjs(date).format('YYYY-MM-DD')} 
                                    readOnly 
                                />
                            </div>
                        </div>
                    </div>
                    <div className={`home-content__calendar-picker ${datePickerShow ? 'picker-active' : ''}`} style={{ maxHeight: datePickerMaxHeight }}>
                        <DatePicker
                            inline
                            onFocus={() => console.log(1)}
                            onBlur={() => console.log(2)}
                            locale="uk"
                            showTimeSelect
                            selected={date}
                            onChange={(date) => setDate(date)}
                            highlightDates={highlightWithRanges}
                            timeCaption="Час"
                            ref={datePickerRef}
                        />
                    </div>
                </div>
                <div className="home-content__tasks">
                    {storeToDo.tasks === null ?
                        <div className="home-content__tasks-loading">
                            <Loading1 />
                        </div>
                        :
                        tasksPagination.length ?
                            <TasksList tasks={tasksPagination} />
                            :
                            <div className="home-content__tasks-not__found">
                                <p>Sorry</p>
                                <p>We couldn't find anything 😔</p>
                            </div>
                    }
                </div>
                {storeToDo.pageCount > 1 &&
                    <div className="home-content__pagination">
                        <Pagination 
                            className="pagination-primary"
                            pageCount={storeToDo.pageCount} 
                            currentPage={currentPage} 
                            changePage={changePage}
                            options={{
                                buttonsShow: 5
                            }} 
                        />
                    </div>
                }
            </div>
        </div>
    );
};

export default Home;