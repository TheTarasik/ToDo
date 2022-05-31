import React, { useState, useRef, useEffect } from 'react';
import { transitionParser } from '../../functions/transitionParser';

const Spoiler = ({ children, header, active = false, activeCallback = () => {} }) => {

    const [spoilerActive, setSpoilerActive] = useState(active);
    const [spoilerOpenStatus, setSpoilerOpenStatus] = useState('collapse');

    const spoilerContentRef = useRef(null);

    useEffect(() => {
        setSpoilerActive(active);
    }, [active]);

    useEffect(() => {
        spoilerHandler();
        activeCallback(spoilerActive);
    }, [spoilerActive, spoilerContentRef]);

    const spoilerHandler = () => {
        setSpoilerOpenStatus('collapsing');
        let { 'max-height': maxHeight } = transitionParser(spoilerContentRef.current);

        setTimeout(() => {
            setSpoilerOpenStatus('collapse');
        }, maxHeight.duration);
    };

    return (
        <div className={`spoiler ${spoilerActive ? 'spoile-active' : ''} spoiler-${spoilerOpenStatus} ${spoilerActive && spoilerOpenStatus === 'collapse' ? 'spoiler-collapse__show' : ''}`}>
            <div className="spoiler-header">
                <div onClick={() => setSpoilerActive((prev) => !prev)} className="spoiler-header__trigger"></div>
                {header}
            </div>
            <div className="spoiler-content" style={{ maxHeight: spoilerActive ? spoilerContentRef.current.scrollHeight : 0 }} ref={spoilerContentRef}>
                <div className="spoiler-content__container">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Spoiler;