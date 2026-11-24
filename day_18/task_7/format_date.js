function formatDate(date, format) {
    const parsedDate = date instanceof Date ? new Date(date.getTime()) : new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        throw new RangeError("Invalid date provided");
    }

    const day = String(parsedDate.getDate()).padStart(2, "0");
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const year = parsedDate.getFullYear();
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    switch (format) {
        case "DD/MM/YYYY": return `${day}/${month}/${year}`;
        case "YYYY-MM-DD": return `${year}-${month}-${day}`;
        case "Month DD, YYYY": return `${monthNames[parsedDate.getMonth()]} ${day}, ${year}`;
        case "relative": {
            const now = new Date();
            const targetDate = Date.UTC(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());
            const currentDate = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
            const difference = Math.round((targetDate - currentDate) / (1000 * 60 * 60 * 24));

            if (difference === 0) {
                return "today";
            }

            const days = Math.abs(difference);
            const dayText = days === 1 ? "day" : "days";
            return difference < 0 ? `${days} ${dayText} ago` : `in ${days} ${dayText}`;
        }
        default: throw new RangeError("Unsupported date format");
    }
}
module.exports = { formatDate };
