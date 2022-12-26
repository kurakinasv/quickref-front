import React, { FC, MouseEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { observer } from 'mobx-react-lite';

import AlertMessage from '@components/AlertMessage';
import { BASE_URL } from '@config/api';
import useAlert from '@hooks/useAlert';
import useModal from '@hooks/useModal';
import {
    ArrowBackRounded,
    ArrowForwardRounded,
    Close,
    InfoOutlined,
    PauseRounded,
    PlayArrowRounded,
    StarOutlineRounded,
    StarRounded,
} from '@mui/icons-material';
import { Box, Button, IconButton, Modal } from '@mui/material';
import { PathsEnum } from '@pages/Router';
import {
    useAuthorsStore,
    useAuthStore,
    useCollectionStore,
    useRefStore,
} from '@stores/RootStore/hooks';
import { modalBoxStyle } from '@styles/consts';
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
    const params = useParams();

    const { getAuthors, author, setAuthor } = useAuthorsStore();
    const { isAuthenticated } = useAuthStore();
    const { favImages, setFavourites, getCollection } = useCollectionStore();
    const { allRefs, addToCollection, removeFromCollection, getRefs } = useRefStore();

    const categoryRefs = useMemo(
        () => allRefs.filter(({ categoryId }) => categoryId === Number(params.id) + 1),
        [params.id]
    );

    const [currentImageNum, setCurrentImageNum] = useState(0);
    const [currentRef, setCurrentRef] = useState(categoryRefs[currentImageNum]);

    const imageAmount = useMemo(() => categoryRefs.length, [categoryRefs.length]);

    const init = async () => {
        await getCollection();
        await getRefs();
    };

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (currentRef && currentRef.authorId) {
            getAuthors(currentRef.authorId);
        } else {
            setAuthor(null);
        }
    }, [currentRef]);

    const navigate = useNavigate();

    const { open, openModal, closeModal } = useModal();
    const {
        open: collectionsOpen,
        openModal: openCollectionsModal,
        closeModal: closeCollectionsModal,
    } = useModal();

    const { stopTimer, seconds, minutes, refNumber, setRefNumber, pauseTimer, paused } =
        useTimer(imageAmount);

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

        const currImg = categoryRefs[currImgNum];

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

    const endSession = async () => {
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

        for (const imgId of selectedImages) {
            await addToCollection(Number(imgId));
        }

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
        if (isAuthenticated && imageAmount) {
            openCollectionsModal();
        } else {
            navigate(PathsEnum.main);
        }
    };

    const [inFavs, setInFavs] = useState(false);

    useEffect(() => {
        if (categoryRefs.length && favImages.length) {
            setInFavs(!!favImages.find(({ id }) => id === categoryRefs[currentImageNum].id));
        }
    }, [currentImageNum, favImages.length, categoryRefs.length]);

    const { status, handleAlert } = useAlert();

    const addToFavourites = async () => {
        const currentImgId = categoryRefs[currentImageNum]?.id;

        // check if image is already in favImages
        if (inFavs) {
            await removeFromCollection(currentImgId);
            setInFavs(false);
            handleAlert('Удалено из избранного');
            return;
        }

        await addToCollection(currentImgId);
        setInFavs(true);
        handleAlert('Добавлено в избранное');
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
                    <IconButton
                        size="large"
                        sx={{ mr: 1 }}
                        onClick={addToFavourites}
                        title={inFavs ? 'Убрать из избранного' : 'Добавить в избранное'}
                    >
                        {inFavs ? <StarRounded /> : <StarOutlineRounded />}
                    </IconButton>
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
                    <ArrowBackRounded />
                </IconButton>
                <IconButton size="large" onClick={pauseTimer}>
                    {paused ? <PlayArrowRounded /> : <PauseRounded />}
                </IconButton>
                <IconButton
                    size="large"
                    onClick={handleChangeRefClick(ArrowDirection.next)}
                    disabled={currentImageNum === imageAmount - 1 || !imageAmount}
                >
                    <ArrowForwardRounded />
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
                        <Box sx={{ ...modalBoxStyle, width: '834px', padding: '42px' }}>
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
                                {categoryRefs.map(({ name, id }) => {
                                    const isActive = !!selectedImages.find(
                                        (img) => img === String(id)
                                    );
                                    return (
                                        <ImageButton
                                            key={name + id}
                                            id={id + 'image-button'}
                                            imgUrl={BASE_URL + name}
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

            {status && <AlertMessage key={status.key} message={status.msg} />}
        </>
    );
};

export default observer(RefsPage);
