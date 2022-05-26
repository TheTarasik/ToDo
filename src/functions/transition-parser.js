const transitionParser = (node) => {
    const transition = getComputedStyle(node)['transition'].split(',');
    return transition.reduce((a, b) => {
        b = [...b.split(' ')].filter((a) => a);
        Object.assign(a, {
            [b[0]]: {
                duration: transitionTypeResolver(b[1]),
                type: b[2],
                delay: transitionTypeResolver(b[3])
            }
        });
        return a;
    }, {});
};

const transitionTypeResolver = (time) => {
    time = time.split('');

    // To seconds only
    return time.slice(0, time.length - 1).join('') * 1000;
};

export {
    transitionParser
};