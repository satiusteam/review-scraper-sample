export const curry = fn => (...args) => fn.bind(null, ...args);
export const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);


export const escapeCommaForCSV = s => s ? s.replace(/,/g, "", "") : s;
export const removeManyWhiteSpacesWithSingleSpace = s => s ? s.replace(/\s/g, " ") : s;
export const removeEndLine = s => s ? s.replace(/\n/g, "") : s;
export const createAKeyAbleValue = s => s ? s.replace(/\s|\.|,|:/g, "") : s;
export const trimString = s => s ? s.trim() : s;


export const prepStringForCSv = pipe(
    escapeCommaForCSV,
    removeEndLine,
    removeManyWhiteSpacesWithSingleSpace,
    trimString
);
