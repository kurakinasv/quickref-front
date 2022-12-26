import { useState } from 'react';

const useAlert = () => {
    const [status, setStatus] = useState<{ msg: string; key: number } | null>(null);

    const handleAlert = (msg: string) => {
        setStatus({ msg, key: Math.random() });
    };

    return { status, handleAlert };
};

export default useAlert;
