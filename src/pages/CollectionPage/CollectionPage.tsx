import React, { FC, useMemo, useState } from 'react';

import { observer } from 'mobx-react-lite';

import useModal from '@hooks/useModal';
import { Close } from '@mui/icons-material';
import { Box, Grid, IconButton, Modal, TextField } from '@mui/material';
import { refsInfo } from '@pages/RefsPage/mock';
import { useUserStore } from '@stores/RootStore/hooks';
import { modalBoxStyle } from '@styles/consts';

import {
    Content,
    ImageItem,
    InfoItem,
    ItemData,
    ItemTitle,
    ModalTitle,
    PageTitle,
} from './CollectionPage.styles';

const CollectionPage: FC = () => {
    const { favourites } = useUserStore();

    const { open, openModal, closeModal } = useModal();

    const [currentImage, setCurrentImage] = useState('');

    const currentInfo = useMemo(
        () => Object.entries(refsInfo)?.find(([key]) => key === currentImage)?.[1],
        [currentImage]
    );

    const handleClick = (e: React.SyntheticEvent<HTMLDivElement>) => {
        const url = e.currentTarget.dataset.url?.valueOf();

        if (url) {
            setCurrentImage(url);
        }

        openModal();
    };

    const [tempValue, setTempValue] = useState('');
    const [value, setValue] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setTempValue(event.target.value);
    };

    const blurHandler = () => {
        setValue(tempValue);
        console.log('saved', value);
    };

    return (
        <>
            <Content>
                <PageTitle>Избранное</PageTitle>

                <TextField
                    id="outlined-multiline-static"
                    label="Описание"
                    multiline
                    minRows={4}
                    value={tempValue}
                    onChange={handleChange}
                    onBlur={blurHandler}
                    placeholder="Добавьте описание коллекции"
                    sx={{ width: '35vw' }}
                />

                <Grid container columns={5} rowSpacing={2} columnSpacing={{ xs: 2, md: 2 }}>
                    {Object.values(favourites).map((ref, id) => {
                        return (
                            <Grid item xs={1} key={ref + id} justifyContent="center">
                                <ImageItem imgUrl={ref} data-url={ref} onClick={handleClick} />
                            </Grid>
                        );
                    })}
                </Grid>
            </Content>

            <Modal open={open} onClose={closeModal}>
                <>
                    <Box sx={{ ...modalBoxStyle, width: '600px', padding: '42px' }}>
                        <ModalTitle>Об изображении</ModalTitle>
                        <IconButton
                            size="large"
                            onClick={closeModal}
                            sx={{ position: 'absolute', top: '10px', right: '10px' }}
                        >
                            <Close />
                        </IconButton>
                        <InfoItem>
                            <ItemTitle>Автор</ItemTitle>
                            <ItemData>{currentInfo ? currentInfo.author : ''}</ItemData>
                        </InfoItem>
                        <InfoItem>
                            <ItemTitle>Источник</ItemTitle>
                            <ItemData>{currentInfo ? currentInfo.source : ''}</ItemData>
                        </InfoItem>
                    </Box>
                </>
            </Modal>
        </>
    );
};

export default observer(CollectionPage);
