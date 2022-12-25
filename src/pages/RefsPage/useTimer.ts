import { useEffect, useRef, useState } from 'react';

const useTimer = (imageAmount: number) => {
    const initialSeconds = 0;
    const initialMinutes = 2;

    const timerRef = useRef<NodeJS.Timer | null>(null);
    const isSessionEnd = useRef(false);

    const [seconds, setSeconds] = useState(initialSeconds);
    const [minutes, setMinutes] = useState(initialMinutes);
    const [refNumber, setRefNumber] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        startTimer();
        return () => resetTimeout();
    }, []);

    useEffect(() => {
        if (minutes === 0 && seconds === 0) {
            setRefNumber((prev) => prev + 1);
            stopTimer();
        }
    }, [minutes === 0 && seconds === 0]);

    const startTimer = () => {
        resetTimeout();

        timerRef.current = setTimeout(() => {
            setSeconds((s) => (s <= 0 ? 59 : s - 1));
            startTimer();
        }, 1000);
    };

    const resetTimeout = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    useEffect(() => {
        if (seconds === 59) {
            setMinutes((m) => m - 1);
        }
    }, [seconds]);

    const stopTimer = () => {
        setSeconds(initialSeconds);
        setMinutes(initialMinutes);

        if (refNumber + 1 === imageAmount) {
            isSessionEnd.current = true;
        }

        if (isSessionEnd.current) {
            resetTimeout();
        }
    };

    const pauseTimer = () => {
        if (!paused) {
            resetTimeout();
            setPaused(true);
        } else {
            startTimer();
            setPaused(false);
        }
    };

    return { seconds, minutes, refNumber, paused, startTimer, stopTimer, setRefNumber, pauseTimer };
};

export default useTimer;
