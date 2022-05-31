import React from 'react';

const Information = ({ task }) => {
    return (
        <div className="task-list__item-spoiler__content-information">
            <div className="task-list__item-spoiler__content-information__description">
                <p>{task.description ? task.description : <span className="description-unset">No description set</span>}</p>
            </div>
            <div className="task-list__item-spoiler__content-information__image">
                <img src={task.image ? task.image : require('../../../../assets/images/image-default.png')} alt="Task preview" />
            </div>
        </div>
    );
};

export default Information;