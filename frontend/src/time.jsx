import { useEffect, useState } from 'react'

function Time(){
    const [currentTime, setCurrentTime] = useState('');

    const updateTime = () => {
        const longtime = new Date();
        setCurrentTime(longtime.toLocaleString('en-US', { hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit"}));
    };

    useEffect(() => {
        updateTime();
        const intervalId = setInterval(updateTime, 1000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <span id="time">{currentTime}</span>
    );
};

export default Time;