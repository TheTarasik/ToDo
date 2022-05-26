import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTasks } from '../../redux/reducers/todo';
import useAPI from '../../hooks/useAPI';
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';
import Pagination from '../elements/Pagination';
import TasksList from './TasksList';
import Loading1 from '../../assets/images/loadings/Loading-1';

const Home = () => {



    const [date, setDate] = useState(new Date());
    const [datePickerMaxHeight, setDatePickerMaxHeight] = useState(0);
    const [datePickerShow, setDatePickerShow] = useState(false);

    const [tasksPaginationOffset, setTasksPaginationOffset] = useState({
        from: 0,
        to: 5
    });

    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const datePickerRef = useRef(null);
    const pageToShow = useRef(5);

    const storeToDo = useSelector((state) => state.todo);

    const dispatch = useDispatch();
    const { apiPublic } = useAPI();

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

    useEffect(() => {
        if (datePickerRef.current) {
            setDatePickerMaxHeight(datePickerRef.current.calendar.componentNode.offsetHeight);
        }
    }, [datePickerRef]);

    useEffect(() => {
        apiPublic('/tasks') 
            .then((data) => {
                let { data: tasks } = data;
                
                setPageCount(Math.ceil(tasks.length / pageToShow.current));
                dispatch(setTasks(tasks));
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {

            });
    }, []);

    const tasksPagination = useMemo(() => {
        if (storeToDo.tasks) {
            return storeToDo.tasks.slice(tasksPaginationOffset.from, tasksPaginationOffset.to);
        }
    }, [storeToDo.tasks, tasksPaginationOffset]);

    const changePage = (page) => {
        setCurrentPage(page);
        setTasksPaginationOffset({
            from: page * pageToShow.current - pageToShow.current,
            to: page * pageToShow.current
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
                                    value={dayjs(date).format('YYYY-MM-DD HH:mm:ss')} 
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
                        <TasksList tasks={tasksPagination} />
                    }
                </div>
                <div className="home-content__pagination">
                    {pageCount > 1 &&
                        <Pagination 
                            className="pagination-primary"
                            pageCount={pageCount} 
                            currentPage={currentPage} 
                            changePage={changePage}
                            options={{
                                buttonsShow: 5
                            }} 
                        />
                    }
                </div>
            </div>
        </div>
    );
};

export default Home;