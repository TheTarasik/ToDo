import React, { useEffect, useState, useMemo } from 'react';

const Pagination = ({ className, pageCount, currentPage, changePage, options }) => {

    const [firstIndex, setFirstIndex] = useState(0);
    const [lastIndex, setLastIndex] = useState(options.buttonsShow);

    useEffect(() => {
        const pagination = Array(pageCount).fill().map((a, b) => b + 1);
        if (Math.ceil(options.buttonsShow / 2) + 1 < currentPage) {
            if (Math.ceil(options.buttonsShow / 2) >= pageCount - currentPage) {
                if (pageCount > options.buttonsShow + 2) {
                    setFirstIndex(pageCount - options.buttonsShow - 2);
                    setLastIndex(pageCount);
                }
            } else {
                setFirstIndex(pagination.indexOf(currentPage + 1) - Math.ceil(options.buttonsShow / 2) - 1);
                setLastIndex(pagination.indexOf(currentPage) + Math.ceil(options.buttonsShow / 2) - 1);
            }
        } else {
            setFirstIndex(0);
            setLastIndex(options.buttonsShow);
        }
    }, [currentPage]);

    const pagination = useMemo(() => {
        return Array(pageCount).fill()
            .map((a, b) => b + 1)
            .filter((a) => a !== 1 && a !== pageCount)
            .slice(firstIndex, lastIndex);
    }, [pageCount, firstIndex, lastIndex]);

    return (
        <div className={`pagination ${className}`}>
            <ul className="pagination-list">
                <li onClick={() => changePage(1)} className={`pagination-list__item ${1 === currentPage ? 'active' : ''}`}>
                    <span>1</span>
                </li>
                {pagination.map((page, index) => (
                    (page !== 1) && (page !== pageCount) &&
                    <li key={page} onClick={() => changePage(page)} className={`pagination-list__item ${page === currentPage ? 'active' : ''}`}>
                        <span>
                            {
                                index === 0 && currentPage > Math.ceil(options.buttonsShow / 2) + 1 && 
                                pageCount > options.buttonsShow + 2 || 
                                index === options.buttonsShow - 1 && 
                                pageCount - currentPage > Math.ceil(options.buttonsShow / 2) && 
                                pageCount > options.buttonsShow + 2 ? 
                                    '...' 
                                    :
                                    page
                            }
                        </span>
                    </li>
                ))}
                <li onClick={() => changePage(pageCount)} className={`pagination-list__item ${pageCount === currentPage ? 'active' : ''}`}>
                    <span>{pageCount}</span>
                </li>
            </ul>
        </div>
    )
};

export default Pagination;