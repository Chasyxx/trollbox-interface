export {};

export function fit(str: string, len: number) {
    if (str.length > len) return str.slice(0, len - 3) + "...";
    if (str.length === len) return str;
    let left = false;
    while (str.length < len) {
        if (left) str = " " + str;
        else str = str + " ";
        left = !left;
    }
    return str;
}

export type filteredTerm = {
    filterName: string,
    term: string,
    replacement?: string
}

export function splitMultis(str: string): string {
    let out = "";
    for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        if (c > 255) {
            out += String.fromCharCode(c >> 8 & 255);
            out += String.fromCharCode(c & 255);
        } else out += str[i];
    }
    return out;
}
export function wrapChars(str: string): string {
    let out = "";
    for (let i = 0; i < str.length; i++) {
        let c = str.charCodeAt(i);
        if (c > 255) c = c & 255;
        if (c > 127) c -= 128;
        if (c < 32) c += 32;
        out += String.fromCharCode(c);
    }
    return out;
}
export function deunicode(str: string): string {
    return wrapChars(splitMultis(str));
}

