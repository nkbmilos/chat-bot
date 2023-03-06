import {toResponse} from "../helpers";

export const validateNumberOfRows =  (stringifiesCsv: string) => {
    const lineCounter = stringifiesCsv.split("\n").length;
    if (lineCounter !==2){
        return toResponse(400, { code: '1.1.1', message: 'Number of rows is not 1000' });
    }

};