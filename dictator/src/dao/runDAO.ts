import Run from "../../db/run";


/***
 * Creates new run inside the database
 * @param status: current status of the run
 * @param snippet: code that needs to executed for this run.
 */
export const createRun = async (status: string, snippet: string) => {
    return await Run.create({status: status, snippet: snippet});
}

export const updateContainerNameAndContainerId = async (runId: string, containerName: string, containerId: string) => {
    const run = await Run.findByPk(runId);
    if (run) {
        run.containerName = containerName;
        run.containerId = containerId
        await run.save();
        return run;
    } else {
        throw new Error("Run Not Found!");
    }
}

export const updateStatus = async (runId: string, status: string) => {
    const run = await Run.findByPk(runId);
    if (run) {
        run.status = status;
        await run.save();
        return run;
    } else {
        throw new Error("Run Not Found!");
    }
}


export const getRunById = async (runId: string) => {
    const run = await Run.findByPk(runId);
    if (!run) {
        throw new Error("Run Not Found!");
    }
    return run;
}
