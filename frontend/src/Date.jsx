import { useEffect, useState } from 'react'

function DateComponent(){
    const [currentDate, setCurrentDate] = useState('');

    const updateDate = () => {
        const dateObj = new Date();
        setCurrentDate(dateObj.toLocaleDateString("en-US", { weekday: "long", day: "2-digit", month: "long", year: "numeric"}));
    };

    useEffect(() => {
        updateDate();
    }, []);

    return (
        <span id="date">{currentDate}</span>
    );
};

export default DateComponent;