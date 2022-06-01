import React, { useState, useRef, useEffect, useCallback } from 'react';
import { transitionParser } from '../../functions/transitionParser';
import useMutationObservable from '../../hooks/useMutationObservable';

const Spoiler = ({ children, header, active = false, activeCallback = () => {} }) => {

    const [spoilerActive, setSpoilerActive] = useState(active);
    const [spoilerOpenStatus, setSpoilerOpenStatus] = useState('collapse');

    const [spoilerMaxHeight, setSpoilerMaxHeight] = useState(0);

    const spoilerContentRef = useRef(null);
    const spoilerTimeout = useRef(null);

    const onSpoilerContentMutation = useCallback(
        () => {
            setSpoilerMaxHeight(spoilerContentRef.current.scrollHeight);
        },
        []
    );

    useMutationObservable(spoilerContentRef.current, onSpoilerContentMutation);

    useEffect(() => {
        setSpoilerMaxHeight(spoilerContentRef.current.scrollHeight);
    }, []);

    useEffect(() => {
        setSpoilerActive(active);
    }, [active]);

    useEffect(() => {
        spoilerHandler();
        activeCallback(spoilerActive);
    }, [spoilerActive]);

    const spoilerHandler = () => {
        setSpoilerOpenStatus('collapsing');
        let { 'max-height': maxHeight } = transitionParser(spoilerContentRef.current);

        spoilerTimeout.current && clearTimeout(spoilerTimeout.current);
        spoilerTimeout.current = setTimeout(() => {
            setSpoilerOpenStatus('collapse');
        }, maxHeight.duration);
    };

    return (
        <div className={`spoiler ${spoilerActive ? 'spoile-active' : ''} spoiler-${spoilerOpenStatus} ${spoilerActive && spoilerOpenStatus === 'collapse' ? 'spoiler-collapse__show' : ''}`}>
            <div className="spoiler-header">
                <div onClick={() => setSpoilerActive((prev) => !prev)} className="spoiler-header__trigger"></div>
                {header}
            </div>
            <div className="spoiler-content" style={{ maxHeight: spoilerActive ? spoilerMaxHeight : 0 }} ref={spoilerContentRef}>
                <div className="spoiler-content__container">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Spoiler;