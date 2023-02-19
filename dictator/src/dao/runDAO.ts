import Run from "../../db/run";


/***
 * Creates new run inside the database
 * @param status: current status of the run
 * @param snippet: code that needs to executed for this run.
 */
export const createRun = async (status: string, snippet: string) => {
    return await Run.create({status: status, snippet: snippet});
}

export const updateContainerName = async (runId: number, containerName: string) => {
    const run = await Run.findByPk(runId);
    if (run) {
        run.containerName = containerName;
        await run.save();
        return run;
    } else {
        throw new Error("Run Not Found!");
    }
}

export const updateStatus = async (runId: number, status: string) => {
    const run = await Run.findByPk(runId);
    if (run) {
        run.containerName = status;
        await run.save();
        return run;
    } else {
        throw new Error("Run Not Found!");
    }
}


export const getRunById = async (runId: number) => {
    const run = await Run.findByPk(runId);
    if (!run) {
        throw new Error("Run Not Found!");
    }
    return run;
}
