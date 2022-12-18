import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import refs from '@img/refs';
import { ArrowLeft, ArrowRight, Close, InfoOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { PathsEnum } from '@pages/Router';
import useTimer from './useTimer';

import { Content, Footer, Header, Logo, RefImage, RightBlock, Timer } from './RefsPage.styles';

type RefsPageProps = {
    chosenCategory?: string;
};

enum ArrowDirection {
    prev = 'prev',
    next = 'next',
}

const RefsPage: FC<RefsPageProps> = () => {
    const imageAmount = Object.keys(refs).length;

    const navigate = useNavigate();

    const { stopTimer, seconds, minutes, refNumber, setRefNumber } = useTimer();

    const [currentImageNum, setCurrentImageNum] = useState(0);
    const [currentImage, setCurrentImage] = useState(refs.camp);

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

        const currImg = Object.values(refs)[currImgNum];

        setCurrentImageNum(currImgNum);
        setCurrentImage(currImg);
    };

    const handleChangeRefClick = (arrowDir: ArrowDirection) => () => {
        changeRef(arrowDir);
        arrowDir === ArrowDirection.next
            ? setRefNumber((prev) => prev + 1)
            : setRefNumber((prev) => prev - 1);
        stopTimer();
    };

    const endSession = () => {
        navigate(PathsEnum.main);
    };

    useEffect(() => {
        if (minutes === 0 && seconds === 0 && refNumber + 1 !== imageAmount) {
            changeRef(ArrowDirection.next);
        }
    }, [minutes === 0 && seconds === 0]);

    return (
        <div>
            <Header>
                <Logo>QuickRef</Logo>
                <RightBlock>
                    <Timer>
                        {minutes < 10 ? '0' : ''}
                        {minutes}:{seconds < 10 ? '0' : ''}
                        {seconds}
                    </Timer>
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
        </div>
    );
};

export default RefsPage;
