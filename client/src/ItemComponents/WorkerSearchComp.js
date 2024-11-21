import React from 'react';

import WorkerSearchMod1 from '../Modules/Worker/WorkerSearchMod1';
import WorkerSearchMod2 from '../Modules/Worker/WorkerSearchMod2';

const WorkerSearchComp = () => {
    return (
        <div className="container my-4">
            <WorkerSearchMod1/>
            <WorkerSearchMod2/>
        </div>
    );
};

export default WorkerSearchComp;
