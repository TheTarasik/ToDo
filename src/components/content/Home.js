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

    const [datePickerDate, setDatePickerDate] = useState(new Date());
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
    const { apiPublic } = useAPI();
    const [searchParams, setSearchParams] = useSearchParams();

    const params = Object.fromEntries([...searchParams]);

    useEffect(() => {
        const getTasks = async () => {
            try {
                const getTasks = await apiPublic('/tasks');
    
                const { data: tasks } = getTasks;
    
                for (const task in tasks) {
                    if (!tasks[task].is_archive &&
                        tasks[task].is_status === 1 &&
                        new Date(tasks[task].created_at * 1000).toLocaleDateString() !== new Date().toLocaleDateString()) {
                            const moveTaskToArchive = await apiPublic.put(`/tasks/${tasks[task].id}`, {
                                is_archive: true
                            });

                            tasks[task].is_archive = true;
                            console.log(`Move task id-${tasks[task].id} to archive`);
                    }
                }

                dispatch(setTasks(tasks));
            } catch (e) {
                alert(`Something went wrong: ${e.message}`);
            } finally {
                setTaskLoading(false);
            }
        };

        getTasks();
    }, []);

    useEffect(() => {
        let { page, date } = params;

        page = Number(page);

        if (storeToDo.pageCount) {
            if (isNaN(page) || page <= 0) {
                delete params.page;
                changePage(1);
                return setSearchParams(params);
            }
            changePage(page > storeToDo.pageCount ? storeToDo.pageCount : page);
        }

        if (date) {
            date = new Date(date.replace(/(\d{2})\.(\d{2})\.(\d{4})/,'$3-$2-$1'));
            setDatePickerDate(date.toString() === 'Invalid Date' ? new Date() : date);
        }
    }, [searchParams, storeToDo.pageCount]);

    useEffect(() => {
        if (datePickerRef.current) {
            setDatePickerMaxHeight(datePickerRef.current.calendar.componentNode.offsetHeight);
        }
    }, [datePickerRef]);

    const tasks = useMemo(() => {
        if (storeToDo.tasks) {
            return storeToDo.tasks.filter((a) => new Date(a.date * 1000).toLocaleDateString() === datePickerDate.toLocaleDateString() &&
            !a.is_archive);
        }
    }, [storeToDo.tasks, tasksPaginationOffset, datePickerDate]);

    const tasksPaginated = useMemo(() => {
        return tasks.slice(tasksPaginationOffset.from, tasksPaginationOffset.to);
    }, [tasks]);

    useEffect(() => {
        dispatch(setPageCount(Math.ceil(tasks.length / config.pagination.pageToShow)));
    }, [tasksPaginated]);

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
                    'day-hightlight__3': [] // Till 10+ tasks per day
                }
            ];

            const uniqueDates = Array.from(
                new Set(
                    tasks.map((a) => new Date(a.date * 1000).toLocaleDateString())
                )
            );

            return uniqueDates.reduce((a, b) => {
                const dates = tasks
                    .filter((a) => new Date(a.date * 1000).toLocaleDateString() === b && !a.is_archive)
                    .map((a) => new Date(a.date * 1000));
                
                const getHightlight = (hightlight) => {
                    return Object.values(a.find((a) => a[`day-hightlight__${hightlight}`]))[0];
                };
                
                if (dates.length <= 5) {
                    getHightlight(1).push(...dates);
                } else if (dates.length >= 5 && dates.length <= 10) {
                    getHightlight(2).push(...dates);
                } else if (dates.length > 10) {
                    getHightlight(3).push(...dates);
                }

                return a;
            }, hightlight);
        }
    }, [storeToDo.tasks]);

    const changeDateHandler = (date) => {
        setSearchParams({
            ...params,
            page: 1,
            date: date.toLocaleDateString()
        });
        setDatePickerDate(date);
    };

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
                                    value={dayjs(datePickerDate).format('YYYY-MM-DD')} 
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                    <div className={`home-content__calendar-picker ${datePickerShow ? 'picker-active' : ''}`} style={{ maxHeight: datePickerMaxHeight }}>
                        <DatePicker
                            inline
                            locale="en"
                            // showTimeSelect
                            selected={datePickerDate}
                            onChange={(date) => changeDateHandler(date)}
                            highlightDates={datePickerHightlight}
                            // timeCaption="Time"
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
                        tasksPaginated.length ?
                            <TasksList 
                                tasks={tasksPaginated} 
                                loadingCallback={(status) => setTaskLoading(status)}
                                action={{
                                    archive: true
                                }}
                            />
                            :
                            <div className="home-content__tasks-not__found">
                                <p>Sorry</p>
                                <p>We couldn't find anything tasks for today 😔</p>
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