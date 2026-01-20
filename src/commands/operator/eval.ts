import { evalulate } from "../../eval";

export {};

export const names = [ "eval", "e" ];
export const operatorOnly = true;

export function execute(args: string[]): string {
    let priv = false;
    let asFunc = false;
    if(args[0]==="-p") {
        args.shift();
        priv = true;
    }
    if(args[0]==="-f") {
        args.shift();
        asFunc = true;
    }
    const code = args.join(' ');
    return evalulate(code, asFunc, priv);
}