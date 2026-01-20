import * as Storage from "./storage";
import * as Interface from "./interface";
import * as Text from "./text";
import * as Trollbox from "./trollbox";
import * as Cooldown from "./cooldown";

const per = {};

export function evalulate(code: string, asFunc = false, priv = false) {
    let result: unknown = null;
    try {
        const func = new Function("per","NR",
            "Storage","Interface","Text","Trollbox","Cooldown",
            "'use strict';\n"+(asFunc?"":"return ")+code).bind(per,
                per,fetch,
                Storage,Interface,Text,Trollbox,Cooldown);
        result = func();
    } catch(error) {
        console.error(error);
        return "Error in eval! Full error logged to console.\n"+Interface.getPublicErrorInfo(error);
    }
    let stringResult = "";
    console.log(result);
    if(priv) return "Output logged to console.";
    try {
        stringResult = JSON.stringify(result, null, 2);
    } catch (error) {
        console.warn(error);
        return "Error thrown converting to JSON but output was still logged to console.";
    }
    return "Output: \n"+stringResult;
}
