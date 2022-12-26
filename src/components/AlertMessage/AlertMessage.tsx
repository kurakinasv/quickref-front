import React, { FC, memo, SyntheticEvent, useState } from 'react';

import { Alert, Snackbar } from '@mui/material';

type AlertProps = {
    message: string;
};

const AlertMessage: FC<AlertProps> = ({ message }) => {
    const [open, setOpen] = useState(true);

    const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert
                severity="success"
                onClose={handleClose}
                sx={{
                    width: '100%',
                    backgroundColor: 'rgb(139, 231, 144)',
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default memo(AlertMessage);
