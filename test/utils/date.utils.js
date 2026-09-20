export function getFlightDates() {
    const departure = new Date();
    const returnDate = new Date();

    returnDate.setDate(returnDate.getDate() + 3);

    const formatCalendarDate = (date) => {
        const month = date.toLocaleString('en-US', {
            month: 'long'
        });

        return `${month} ${date.getDate()} ${date.getFullYear()}`;
    };

    const formatHeaderDate = (date) => {
        const weekday = date.toLocaleString('en-US', {
            weekday: 'short'
        });

        return `${weekday} ${date.getDate()}/${date.getMonth() + 1}`;
    };

    return {
        departure: {
            calendar: formatCalendarDate(departure),
            header: formatHeaderDate(departure)
        },
        return: {
            calendar: formatCalendarDate(returnDate),
            header: formatHeaderDate(returnDate)
        }
    };
}