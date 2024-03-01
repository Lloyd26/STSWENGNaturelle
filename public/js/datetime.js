export function formatDateTime(date, format) {
    if (!date instanceof Date) {
        throw new Error("Parameter \"date\" is not an instance of the Date object.");
    }

    const y = date.getFullYear();
    const M = date.getMonth();
    const d = date.getDate();
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const monthNamesFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayNamesFull = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const dateTimeFormatMap = new Map();

    dateTimeFormatMap.set("yyyy", y);
    dateTimeFormatMap.set("yy", padZero(y % 100));
    dateTimeFormatMap.set("y", y % 100);

    dateTimeFormatMap.set("MMMM", monthNamesFull[M]);
    dateTimeFormatMap.set("MMM", monthNames[M]);
    dateTimeFormatMap.set("MM", padZero(M + 1));
    dateTimeFormatMap.set("M", M + 1);

    dateTimeFormatMap.set("dddd", dayNamesFull[date.getDay()]);
    dateTimeFormatMap.set("ddd", dayNames[date.getDay()]);

    dateTimeFormatMap.set("dd", padZero(d));
    dateTimeFormatMap.set("d", d);

    dateTimeFormatMap.set("hh", (h + 1) > 12 ? padZero(h - 12 + 1) : padZero(h + 1));
    dateTimeFormatMap.set("h", (h + 1) > 12 ? (h - 12 + 1) : (h + 1));
    dateTimeFormatMap.set("HH", padZero(h));
    dateTimeFormatMap.set("H", h);

    dateTimeFormatMap.set("mm", padZero(m));
    dateTimeFormatMap.set("m", m);

    dateTimeFormatMap.set("ss", padZero(s));
    dateTimeFormatMap.set("s", s);

    dateTimeFormatMap.set("tt", h >= 12 ? "PM" : "AM");
    dateTimeFormatMap.set("t", h >= 12 ? "P" : "A");

    let formatted = format;
    dateTimeFormatMap.forEach((v, k) => formatted = formatted.replaceAll(k, v));

    return formatted;
}

function padZero(n, threshold) {
    if (threshold === undefined) threshold = 10;
    return n < threshold ? "0" + n : n;
}