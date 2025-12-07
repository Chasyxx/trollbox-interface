export {}

import { readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";

export class Storage<storageType = never> {
    val: storageType;
    readonly file: string | null;

    constructor(file: string | null, init: storageType) {
        this.file = file;
        if(this.file) {
            try {
                this.val = JSON.parse(readFileSync("../storage/"+this.file+".json", { encoding: "utf8" }));
                console.log("Loaded storage file",this.file);
            } catch(error) {
                console.warn("Couldn't load setstorage file",this.file,error);
                this.val = init;
            }
        } else this.val = init;
        this.save();
    }

    set(value: storageType) {
        this.val = value;
        this.save();
        return this;
    }

    get() {
        return this.val;
    }

    save() {
        if(!this.file) return;
        try {
            writeFile("../storage/"+this.file+".json", JSON.stringify(this.val,null,2));
            console.log("Saved storage file",this.file);
        } catch(error) {
            console.error("Couldn't save storage file",this.file,error);
        }
    }
}

export class SetStorage<storageType = never> {
    readonly set: Set<storageType>;
    readonly file: string | null;

    constructor(file: string | null) {
        this.file = file;
        if(this.file) {
            try {
                this.set = new Set(JSON.parse(readFileSync("../storage/"+this.file+".json", { encoding: "utf8" })));
                console.log("Loaded setstorage file",this.file);
            } catch(error) {
                console.warn("Couldn't load setstorage file",this.file,error);
                this.set = new Set();
            }
        } else this.set = new Set();
        this.save();
    }

    add(value: storageType) {
        this.set.add(value);
        this.save();
        return this;
    }

    has(value: storageType) {
        return this.set.has(value);
    }

    delete(value: storageType) {
        const removed = this.set.delete(value);
        if(removed) this.save();
        return removed;
    }

    /**
     * Note that **this function *intentionally* does not save by itself**.
     * That way, you don't accidentially wipe out the file.
     * 
     * If you're really concerned, back-up the storage file too.
     */
    clear() {
        this.set.clear();
    }

    entries() { return this.set.entries(); }
    keys() { return this.set.keys(); }
    values() { return this.set.values(); }

    forEach(callbackfn: (value: storageType, value2: storageType, set: Set<storageType>) => void, thisArg?: any) {
        return this.set.forEach(callbackfn, thisArg);
    }

    get size(){ return this.set.size }

    save() {
        if(!this.file) return;
        try {
            writeFile("../storage/"+this.file+".json", JSON.stringify([...this.set.values()],null,2));
            console.log("Saved setstorage file",this.file);
        } catch(error) {
            console.error("Couldn't save setstorage file",this.file,error);
        }
    }
}

export class MapStorage<keyType, valueType> {
    readonly map: Map<keyType, valueType>;
    readonly file: string | null;

    constructor(file: string | null) {
        this.file = file;
        if(this.file) {
            try {
                this.map = new Map(JSON.parse(readFileSync("../storage/"+this.file+".json", { encoding: "utf8" })));
                console.log("Loaded mapstorage file",this.file);
            } catch(error) {
                console.warn("Couldn't load mapstorage file",this.file,error);
                this.map = new Map();
            }
        } else this.map = new Map();
        this.save();
    }

    set(k: keyType, v: valueType) {
        this.map.set(k, v);
        this.save();
        return this;
    }

    has(k: keyType) {
        return this.map.has(k);
    }

    get(k: keyType) {
        return this.map.get(k);
    }

    delete(k: keyType) {
        const removed = this.map.delete(k);
        if(removed) this.save();
        return removed;
    }

    /**
     * Note that **this function *intentionally* does not save by itself**.
     * That way, you don't accidentially wipe out the file.
     * 
     * If you're really concerned, back-up the storage file too.
     */
    clear() {
        this.map.clear();
    }

    entries() { return this.map.entries(); }
    keys() { return this.map.keys(); }
    values() { return this.map.values(); }

    forEach(callbackfn: (value: valueType, value2: keyType, set: Map<keyType, valueType>) => void, thisArg?: any) {
        return this.map.forEach(callbackfn, thisArg);
    }

    get size(){ return this.map.size }

    save() {
        if(!this.file) return;
        try {
            writeFile("../storage/"+this.file+".json", JSON.stringify([...this.map.entries()],null,2));
            console.log("Saved mapstorage file",this.file);
        } catch(error) {
            console.error("Couldn't save mapstorage file",this.file,error);
        }
    }
}

export const blockedUsers = new SetStorage<string>("blocked_users");