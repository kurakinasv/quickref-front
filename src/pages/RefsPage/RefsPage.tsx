import React, { FC, MouseEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { observer } from 'mobx-react-lite';

import { BASE_URL } from '@config/api';
import useModal from '@hooks/useModal';
import { ArrowLeft, ArrowRight, Close, InfoOutlined } from '@mui/icons-material';
import { Box, Button, IconButton, Modal } from '@mui/material';
import { PathsEnum } from '@pages/Router';
import { useAuthStore, useUserStore } from '@stores/RootStore/hooks';
import { modalBoxStyle } from '@styles/consts';
import { AuthorType, RefType } from '@typings/api';
import useTimer from './useTimer';

import {
    ButtonsBlock,
    Content,
    Footer,
    Header,
    ImageBlock,
    ImageButton,
    InfoItem,
    ItemData,
    ItemTitle,
    Logo,
    ModalTitle,
    RefImage,
    RightBlock,
    Timer,
} from './RefsPage.styles';

type RefsPageProps = {
    chosenCategory?: string;
};

enum ArrowDirection {
    prev = 'prev',
    next = 'next',
}

const RefsPage: FC<RefsPageProps> = () => {
    const { getRefs, allRefs } = useUserStore();

    const [dbRefs, setDBRefs] = useState<RefType[]>([]);
    const [currentImageNum, setCurrentImageNum] = useState(0);
    const [currentRef, setCurrentRef] = useState(dbRefs[currentImageNum]);

    const imageAmount = dbRefs.length;

    const [author, setAuthor] = useState<AuthorType | null>(null);

    const getAuthor = async (id: number) => {
        const data = await fetch(`${BASE_URL}/api/author/${id}`);
        const response = await data.json();

        setAuthor(response);
    };

    useEffect(() => {
        getRefs();
        setDBRefs(allRefs);
        setCurrentRef(allRefs[0]);
    }, []);

    useEffect(() => {
        if (currentRef && currentRef.authorId) {
            getAuthor(currentRef.authorId);
        } else {
            setAuthor(null);
        }
    }, [currentRef]);

    const navigate = useNavigate();

    const { isAuthenticated } = useAuthStore();
    const { setFavourites } = useUserStore();

    const { open, openModal, closeModal } = useModal();
    const {
        open: collectionsOpen,
        openModal: openCollectionsModal,
        closeModal: closeCollectionsModal,
    } = useModal();

    const { stopTimer, seconds, minutes, refNumber, setRefNumber } = useTimer();

    const nextImageNumber = (imgAmount: number) => {
        return currentImageNum === imgAmount - 1 ? 0 : currentImageNum + 1;
    };

    const prevImageNumber = (imgAmount: number) => {
        return currentImageNum === 0 ? imgAmount - 1 : currentImageNum - 1;
    };

    const changeRef = (arrowDir: ArrowDirection) => {
        const currImgNum =
            arrowDir === ArrowDirection.prev
                ? prevImageNumber(imageAmount)
                : nextImageNumber(imageAmount);

        const currImg = dbRefs[currImgNum];

        setCurrentImageNum(currImgNum);
        setCurrentRef(currImg);
    };

    const handleChangeRefClick = (arrowDir: ArrowDirection) => () => {
        changeRef(arrowDir);
        arrowDir === ArrowDirection.next
            ? setRefNumber((prev) => prev + 1)
            : setRefNumber((prev) => prev - 1);
        stopTimer();
    };

    const endSession = () => {
        // if images are selected and collection is not
        // if (!!selectedImages.length && !collection) {
        //     console.log('Не выбрана коллекция!');
        //     return;
        // }

        // if collection is selected and images are not
        if (!selectedImages.length && !!collection) {
            console.log('Не выбраны изображения!');
            return;
        }

        setFavourites(selectedImages);

        closeCollectionsModal();
        navigate(PathsEnum.main);
    };

    useEffect(() => {
        if (minutes === 0 && seconds === 0 && refNumber + 1 !== imageAmount) {
            changeRef(ArrowDirection.next);
        }
    }, [minutes === 0 && seconds === 0]);

    const [collection, setCollection] = useState('');

    // const onSelectChange = (event: SelectChangeEvent) => {
    //     setCollection(event.target.value);
    // };

    const [selectedImages, setSelectedImages] = useState<string[]>([]);

    const selectImage = (e: MouseEvent) => {
        const img = e.currentTarget.id.split('image-button')[0];

        const isSelected = selectedImages.find((image) => image === img);

        if (!isSelected) {
            setSelectedImages((imgs) => [...imgs, img]);
        } else {
            const index = selectedImages.indexOf(img);
            const deletedImg = selectedImages.splice(index, 1)[0];
            const newArr = selectedImages.filter((img) => img !== deletedImg);

            if (index > -1) {
                setSelectedImages(newArr);
            }
        }
    };

    const discardChanges = () => {
        setCollection('');
        setSelectedImages([]);
        closeCollectionsModal();
    };

    const handleCloseButton = () => {
        if (isAuthenticated) {
            openCollectionsModal();
        } else {
            navigate(PathsEnum.main);
        }
    };

    return (
        <>
            <Header>
                <Logo>QuickRef</Logo>
                <RightBlock>
                    <Timer>
                        {minutes < 10 ? '0' : ''}
                        {minutes}:{seconds < 10 ? '0' : ''}
                        {seconds}
                    </Timer>
                    <IconButton size="large" sx={{ mr: 1 }} onClick={openModal}>
                        <InfoOutlined />
                    </IconButton>
                    <IconButton size="large" onClick={handleCloseButton}>
                        <Close />
                    </IconButton>
                </RightBlock>
            </Header>
            <Content>
                {currentRef && <RefImage src={BASE_URL + currentRef.name} alt="ref" />}
            </Content>
            <Footer>
                <IconButton
                    size="large"
                    onClick={handleChangeRefClick(ArrowDirection.prev)}
                    disabled={currentImageNum === 0}
                >
                    <ArrowLeft />
                </IconButton>
                {/* <IconButton size="large" onClick={isPaused ? handleContinue : handlePause}>
                    {isPaused ? <PlayArrow /> : <Pause />}
                </IconButton> */}
                <IconButton
                    size="large"
                    onClick={handleChangeRefClick(ArrowDirection.next)}
                    disabled={currentImageNum === imageAmount - 1}
                >
                    <ArrowRight />
                </IconButton>
            </Footer>

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
                        {author && (
                            <InfoItem>
                                <ItemTitle>Автор</ItemTitle>
                                <ItemData>{author.nickname}</ItemData>
                            </InfoItem>
                        )}
                        <InfoItem>
                            <ItemTitle>Источник</ItemTitle>
                            <ItemData>{currentRef ? currentRef.source : ''}</ItemData>
                        </InfoItem>
                    </Box>
                </>
            </Modal>

            {isAuthenticated && (
                <Modal open={collectionsOpen} onClose={closeCollectionsModal}>
                    <>
                        <Box sx={{ ...modalBoxStyle, width: '900px', padding: '42px' }}>
                            <ModalTitle>Добавить в избранное</ModalTitle>
                            <IconButton
                                size="large"
                                onClick={closeCollectionsModal}
                                sx={{ position: 'absolute', top: '10px', right: '10px' }}
                            >
                                <Close />
                            </IconButton>

                            {/* <StyledFormControl fullWidth={true}>
                                <InputLabel id="collection-select-label">Коллекция</InputLabel>
                                <Select
                                    size="small"
                                    labelId="collection-select-label"
                                    label="Collection"
                                    value={collection}
                                    onChange={onSelectChange}
                                    variant="outlined"
                                >
                                    <MenuItem key="none" value="">
                                        Не выбрано
                                    </MenuItem>
                                    {collections.map(({ id, name }) => (
                                        <MenuItem key={id} value={id}>
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </StyledFormControl> */}

                            <ImageBlock>
                                {dbRefs.map(({ name: ref }, id) => {
                                    const isActive = !!selectedImages.find((img) => img === ref);
                                    return (
                                        <ImageButton
                                            key={ref + id}
                                            id={ref + 'image-button'}
                                            imgUrl={BASE_URL + ref}
                                            isActive={isActive}
                                            onClick={selectImage}
                                        />
                                    );
                                })}
                            </ImageBlock>

                            <ButtonsBlock>
                                <Button onClick={discardChanges} variant="outlined">
                                    Отмена
                                </Button>
                                <Button onClick={endSession} variant="contained">
                                    Готово
                                </Button>
                            </ButtonsBlock>
                        </Box>
                    </>
                </Modal>
            )}
        </>
    );
};

export default observer(RefsPage);
