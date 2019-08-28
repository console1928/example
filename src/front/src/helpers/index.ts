class Helpers {
    formatDate(dateString: string): string {
        const monthNames: string[] = [
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

        const date: Date = new Date(dateString);
        let hours: number | string = date.getHours();
        if (hours < 10) { hours = "0" + hours; }
        let minutes: number | string = date.getMinutes();
        if (minutes < 10) { minutes = "0" + minutes; }
        const day: number = date.getDate();
        const month: number = date.getMonth();
        const year: number = date.getFullYear();

        return `${monthNames[month]} ${day}, ${year} at ${hours}:${minutes}`;
    }
}

export default Helpers;
