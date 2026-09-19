export function getFormattedDate(daysFromToday = 0) {
    const date = new Date();

    date.setDate(date.getDate() + daysFromToday);

    const month = date.toLocaleString('en-US', {
        month: 'long'
    });

    const day = date.getDate();
    const year = date.getFullYear();

    return `${month} ${day} ${year}`;
}