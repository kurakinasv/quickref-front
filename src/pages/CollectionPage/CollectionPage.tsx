import React, { FC, useEffect, useMemo, useState } from 'react';

import { observer } from 'mobx-react-lite';

import { BASE_URL } from '@config/api';
import useModal from '@hooks/useModal';
import { Close } from '@mui/icons-material';
import { Box, Grid, IconButton, Modal, TextField } from '@mui/material';
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
    const { allRefs, getAuthors, author, favImages, getCollection } = useUserStore();

    useEffect(() => {
        getCollection();
    }, []);

    const { open, openModal, closeModal } = useModal();

    const [currentImage, setCurrentImage] = useState('');

    const getAuthorInfo = async (id: number) => {
        await getAuthors(id);
    };

    const currentInfo = useMemo(() => {
        const found = allRefs.find(({ name }) => name === currentImage);
        const source = found?.source;
        if (found && found.authorId) {
            getAuthorInfo(found.authorId);
        }
        return { source, author: author?.nickname };
    }, [currentImage]);

    const handleClick = (e: React.SyntheticEvent<HTMLDivElement>) => {
        const url = e.currentTarget.dataset.url;

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
                    {favImages.map(({ name }, id) => {
                        return (
                            <Grid item xs={1} key={name + id} justifyContent="center">
                                <ImageItem
                                    imgUrl={BASE_URL + name}
                                    data-url={name}
                                    onClick={handleClick}
                                />
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
                        {currentInfo.author && (
                            <InfoItem>
                                <ItemTitle>Автор</ItemTitle>
                                <ItemData>{currentInfo.author}</ItemData>
                            </InfoItem>
                        )}
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
