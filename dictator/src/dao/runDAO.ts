import Run from "../../db/run";


/***
 * Creates new run inside the database
 * @param status: current status of the run
 * @param snippet: code that needs to executed for this run.
 */
export const createRun = async (status: string, snippet: string) => {
    return await Run.create({status: status, snippet: snippet});
}