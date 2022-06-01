import React, { useState, useEffect } from 'react';

const DEFAULT_OPTIONS = {
    config: { attributes: true, childList: true, subtree: true },
};

const useMutationObservable = (targetEl, cb, options = DEFAULT_OPTIONS) => {

    const [observer, setObserver] = useState(null);

    useEffect(() => {
        const obs = new MutationObserver(cb);
        setObserver(obs);
    }, [cb, options, setObserver]);

    useEffect(() => {
        if (!observer) return;

        const { config } = options;
        observer.observe(targetEl, config);

        return () => {
            if (observer) {
                observer.disconnect();
            }
        };
    }, [observer, targetEl, options]);
};

export default useMutationObservable;