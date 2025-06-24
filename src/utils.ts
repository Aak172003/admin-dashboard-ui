// Function to get greeting based on current time
export const getGreeting = () => {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();

    if (currentHour >= 6 && currentHour < 12) return "Good Morning";
    else if (currentHour >= 12 && currentHour < 18) return "Good Afternoon";
    else if (currentHour >= 18 && currentHour < 24) return "Good Evening";
    else return "Good Night";
};