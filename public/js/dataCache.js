export function checkCache(data, cached_data) {
    if (cached_data.length === 0) {
        updateCache(data, cached_data);
        return false;
    }

    if (cached_data === data) return true;
    if (cached_data === null || data === null) return false;
    if (cached_data.length !== data.length) {
        updateCache(data, cached_data);
        return false;
    }

    if (!compareJSONArray(cached_data, data)) {
        updateCache(data, cached_data);
        return false;
    }

    return true;
}

function updateCache(new_data, cached_data) {
    cached_data.splice(0, cached_data.length);
    cached_data.push(...new_data);
}

function compareJSON(json1, json2) {
    const json1Keys = Object.keys(json1);
    const json2Keys = Object.keys(json2);

    if(json1Keys.length !== json2Keys.length) {
        return false;
    }

    for (let jsonKey of json1Keys) {
        if (json1[jsonKey] !== json2[jsonKey]) {
            if(typeof json1[jsonKey] == "object" && typeof json2[jsonKey] == "object") {
                if(!compareJSON(json1[jsonKey], json2[jsonKey])) {
                    return false;
                }
            }
            else {
                return false;
            }
        }
    }

    return true;
}

function compareJSONArray(jsonArray1, jsonArray2) {
    if (jsonArray1.length !== jsonArray2.length) return false;

    for (let i in jsonArray1) {
        if (!compareJSON(jsonArray1[i], jsonArray2[i])) {
            return false;
        }
    }

    return true;
}