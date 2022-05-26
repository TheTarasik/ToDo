import React, { useState, useEffect } from 'react';

const Dropdown = ({ children, action, closeAfterSelect = true }) => {

    const [dropdownActive, setDropdownActive] = useState(false);

    useEffect(() => {
        document.addEventListener('click', dropdownClickListener);

        return () => {
            document.removeEventListener('click', dropdownClickListener);
        };
    }, [dropdownActive]);

    const dropdownHandler = () => {
        setDropdownActive((prev) => !prev);
    };

    const dropdownClickListener = (e) => {
        if (dropdownActive) {
            if (!e.target.closest('.dropdown')) {
                setDropdownActive(false);
            }
        }
    };

    return (
        <div className={`dropdown ${dropdownActive ? 'dropdown-active' : ''}`}>
            <div onClick={dropdownHandler} className="dropdown-action">
                {action}
            </div>
            <div onClick={() => closeAfterSelect && setDropdownActive(false)} className="dropdown-content">
                {children}
            </div>
        </div>
    );
};

export default Dropdown;