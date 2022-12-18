import { useEffect, useRef, useState } from 'react';

import refs from '@img/refs';

const useTimer = () => {
    const initialSeconds = 0;
    const initialMinutes = 2;

    const timerRef = useRef<NodeJS.Timer | null>(null);
    const isSessionEnd = useRef(false);

    const imageAmount = Object.keys(refs).length;

    const [seconds, setSeconds] = useState(initialSeconds);
    const [minutes, setMinutes] = useState(initialMinutes);
    const [refNumber, setRefNumber] = useState(0);

    useEffect(() => {
        startTimer();
    }, []);

    useEffect(() => {
        if (minutes === 0 && seconds === 0) {
            setRefNumber((prev) => prev + 1);
        }

        return () => {
            stopTimer();
        };
    }, [minutes === 0 && seconds === 0]);

    const startTimer = () => {
        if (timerRef.current && !isSessionEnd.current) {
            tick();
            return;
        }

        if (!timerRef.current && !isSessionEnd.current) {
            timerRef.current = setTimeout(() => {
                tick();
            }, 1000);
        }
    };

    useEffect(() => {
        if (seconds === 59) {
            setMinutes((m) => m - 1);
        }
    }, [seconds]);

    const tick = () => {
        setSeconds((s) => (s === 0 ? 59 : s - 1));

        setTimeout(() => {
            startTimer();
        }, 1000);
    };

    const stopTimer = () => {
        setSeconds(initialSeconds);
        setMinutes(initialMinutes);

        if (refNumber + 1 === imageAmount) {
            isSessionEnd.current = true;
        }

        if (timerRef.current && isSessionEnd.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    return { seconds, minutes, refNumber, startTimer, stopTimer, setRefNumber };
};

export default useTimer;
