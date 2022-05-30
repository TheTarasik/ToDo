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

const Home = () => {

    const [date, setDate] = useState(new Date());
    const [datePickerMaxHeight, setDatePickerMaxHeight] = useState(0);
    const [datePickerShow, setDatePickerShow] = useState(false);

    const [tasksPaginationOffset, setTasksPaginationOffset] = useState({
        from: 0,
        to: config.pagination.pageToShow
    });

    const [currentPage, setCurrentPage] = useState(null);

    const [tasksLoading, setTaskLoading] = useState(true);

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
            })
            .finally(() => {
                setTaskLoading(false);
            });
    }, []);

    useEffect(() => {
        let { page } = params;

        page = Number(page);

        if (!storeToDo.pageCount) return;

        if (isNaN(page) || page <= 0) {
            delete params.page;
            changePage(1);
            return setSearchParams(params);
        }

        changePage(page > storeToDo.pageCount ? storeToDo.pageCount : page);
    }, [storeToDo.pageCount]);

    useEffect(() => {
        if (datePickerRef.current) {
            setDatePickerMaxHeight(datePickerRef.current.calendar.componentNode.offsetHeight);
        }
    }, [datePickerRef]);

    const tasks = useMemo(() => {
        if (storeToDo.tasks) {
            return storeToDo.tasks.slice(tasksPaginationOffset.from, tasksPaginationOffset.to);
        }
    }, [storeToDo.tasks, tasksPaginationOffset]);

    const datePickerHightlight = useMemo(() => {
        if (storeToDo.tasks) {
            const { tasks } = storeToDo;
            let hightlight = [
                {
                    'day-hightlight__1': [] // Till 5 tasks per day
                },
                {
                    'day-hightlight__2': [] // Till 10 tasks per day
                },
                {
                    'day-hightlight__3': [] // Till 15+ tasks per day
                }
            ];

            const uniqueDates = Array.from(
                new Set(
                    tasks.map((a) => new Date(a.date * 1000).toLocaleDateString())
                )
            );

            return uniqueDates.reduce((a, b) => {
                const dates = tasks
                    .filter((a) => new Date(a.date * 1000).toLocaleDateString() === b)
                    .map((a) => new Date(a.date * 1000));
                
                const getHightlight = (hightlight) => {
                    return Object.values(a.find((a) => a[`day-hightlight__${hightlight}`]))[0];
                };

                if (dates.length <= 5) {
                    getHightlight(1).push(...dates);
                } else if (dates.length <= 10) {
                    getHightlight(2).push(...dates);
                } else if (dates.length >= 15) {
                    getHightlight(3).push(...dates);
                }

                return a;
            }, hightlight);
        }
    }, [storeToDo.tasks]);

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
                            highlightDates={datePickerHightlight}
                            timeCaption="Час"
                            ref={datePickerRef}
                        />
                    </div>
                </div>
                <div className="home-content__tasks">
                    {tasksLoading ?
                        <div className="home-content__tasks-loading">
                            <Loading1 />
                        </div>
                        :
                        tasks.length ?
                            <TasksList 
                                tasks={tasks} 
                                loadingCallback={(status) => setTaskLoading(status)} 
                            />
                            :
                            <div className="home-content__tasks-not__found">
                                <p>Sorry</p>
                                <p>We couldn't find anything 😔</p>
                            </div>
                    }
                </div>
                {storeToDo.pageCount > 1 && currentPage !== null &&
                    <div className="home-content__pagination" style={tasksLoading ? { opacity: .5, pointerEvents: 'none' } : null}>
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