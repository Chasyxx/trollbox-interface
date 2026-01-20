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

export function unhide(x: string) {
    let o = x.replace(/\u200b/g,"[ZWSP]").replace(/\u200c/g,"[ZWNJ]")
            .replace(/\u200d/g,"[ZWJ]").replace(/\u2007/g,"[FSP]")
            .replace(/\u061c/g,"[ALM]").replace(/\u180B/g,"[FVS1]")
            .replace(/\u2062/g,"[INVS]").replace(/\ufeff/g,"[BOM]")
            .replace(/\u3164/g,"[HF]").replace(/\uffa0/g,"[HWHF]")
            .replace(/\u034f/g,"[CGJ]")
        
            .replace(/\u202d/ig,"\u202d[LRO]").replace(/\u202e/ig,"\u202d[RLO]\u202e")
            .replace(/\u200e/ig,"\u202d[LRM]").replace(/\u200f/ig,"\u202d[RLM]\u200f")
            .replace(/\u202a/ig,"\u202d[LRE]").replace(/\u202b/ig,"\u202d[RLE]\u202b")
            .replace(/\u2066/ig,"\u202d[LRI]").replace(/\u2067/ig,"\u202d[RLI]\u2067");
    for(let i = 0; i < 16; i++) {
        const char = String.fromCodePoint(0xFE00+i);
        o=o.replace(new RegExp(char, 'g'), `${char}[${i+1}]`);
    }
    for(let i = 0; i < 240; i++) {
        const char = String.fromCodePoint(0xE0100+i);
        o=o.replace(new RegExp(char, 'g'), `${char}[${i+17}]`);
    }
    return o;
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
    return wrapChars(splitMultis(unhide(str))).replace(/~/g,'#');
}

