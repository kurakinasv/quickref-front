import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import refs from '@img/refs';
import { ArrowLeft, ArrowRight, Close, InfoOutlined, Pause, PlayArrow } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { PathsEnum } from '@pages/Router';

import { Content, Footer, Header, Logo, RefImage, RightBlock, Timer } from './RefsPage.styles';

type RefsPageProps = {
    chosenCategory?: string;
};

enum ArrowDirection {
    prev = 'prev',
    next = 'next',
}

const RefsPage: FC<RefsPageProps> = () => {
    const navigate = useNavigate();

    const [isPaused, setIsPaused] = useState(false);

    const handleContinue = () => {
        setIsPaused(false);
    };

    const handlePause = () => {
        setIsPaused(true);
    };

    const [currentImageNum, setCurrentImageNum] = useState(0);
    const [currentImage, setCurrentImage] = useState(refs.camp);

    const nextImageNumber = (imgAmount: number) => {
        return currentImageNum === imgAmount - 1 ? 0 : currentImageNum + 1;
    };

    const prevImageNumber = (imgAmount: number) => {
        return currentImageNum === 0 ? imgAmount - 1 : currentImageNum - 1;
    };

    const changeRef = (arrowDir: ArrowDirection) => () => {
        const imageAmount = Object.keys(refs).length;

        const currImgNum =
            arrowDir === ArrowDirection.prev
                ? prevImageNumber(imageAmount)
                : nextImageNumber(imageAmount);

        const currImg = Object.values(refs)[currImgNum];

        setCurrentImageNum(currImgNum);
        setCurrentImage(currImg);
    };

    const endSession = () => {
        navigate(PathsEnum.main);
    };

    return (
        <div>
            <Header>
                <Logo>QuickRef</Logo>
                <RightBlock>
                    <Timer>00:00</Timer>
                    <IconButton size="large" sx={{ mr: 1 }}>
                        <InfoOutlined />
                    </IconButton>
                    <IconButton size="large" onClick={endSession}>
                        <Close />
                    </IconButton>
                </RightBlock>
            </Header>
            <Content>
                <RefImage src={currentImage} alt="ref" />
            </Content>
            <Footer>
                <IconButton size="large" onClick={changeRef(ArrowDirection.prev)}>
                    <ArrowLeft />
                </IconButton>
                <IconButton size="large" onClick={isPaused ? handleContinue : handlePause}>
                    {isPaused ? <PlayArrow /> : <Pause />}
                </IconButton>
                <IconButton size="large" onClick={changeRef(ArrowDirection.next)}>
                    <ArrowRight />
                </IconButton>
            </Footer>
        </div>
    );
};

export default RefsPage;
