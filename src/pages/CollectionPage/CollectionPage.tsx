import React, { FC, useEffect, useMemo, useState } from 'react';

import { observer } from 'mobx-react-lite';

import AlertMessage from '@components/AlertMessage';
import { BASE_URL } from '@config/api';
import { categoriesInfo } from '@config/categories';
import useAlert from '@hooks/useAlert';
import useModal from '@hooks/useModal';
import { Close, DeleteRounded } from '@mui/icons-material';
import {
    Box,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    SelectChangeEvent,
    TextField,
} from '@mui/material';
import { useAuthorsStore, useCollectionStore, useRefStore } from '@stores/RootStore/hooks';
import { modalBoxStyle } from '@styles/consts';
import { RefType } from '@typings/api';

import {
    Content,
    FilterBlock,
    ImageItem,
    InfoItem,
    ItemData,
    ItemTitle,
    ModalTitle,
    PageTitle,
} from './CollectionPage.styles';

const CollectionPage: FC = () => {
    const { getAuthors, authors } = useAuthorsStore();
    const { favImages, getCollection, editCollection, description } = useCollectionStore();
    const { removeFromCollection } = useRefStore();

    useEffect(() => {
        getCollection();
        getAuthors();
    }, []);

    useEffect(() => {
        setFiltered(favImages);
    }, [favImages]);

    useEffect(() => {
        setTempValue(description);
    }, [description]);

    const { open, openModal, closeModal } = useModal();

    const [currentImage, setCurrentImage] = useState('');

    const currentInfo = useMemo(() => {
        const found = favImages.find(({ name }) => name === currentImage);
        const source = found?.source;
        const author = authors.find(({ id }) => id === found?.authorId);

        return { source, author: author?.nickname };
    }, [currentImage]);

    const handleClick = (e: React.SyntheticEvent<HTMLDivElement>) => {
        const url = e.currentTarget.dataset.url;

        if (url) {
            setCurrentImage(url);
        }

        openModal();
    };

    const [tempValue, setTempValue] = useState(description);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setTempValue(event.target.value);
    };

    const blurHandler = async () => {
        await editCollection(tempValue);
    };

    const [category, setCategory] = useState('');
    const [filtered, setFiltered] = useState<RefType[]>(favImages);

    const onSelectChange = (event: SelectChangeEvent) => {
        const catId = event.target.value;
        setCategory(catId);
        filterImages(searchValue, catId);
    };

    const [searchValue, setSearchValue] = useState('');

    const handleSearch = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const val = event.target.value;
        setSearchValue(val);
        filterImages(val, category);
    };

    const filterImages = (searchValue: string, category: string) => {
        if (!searchValue && !category) {
            setFiltered(favImages);
            return;
        }

        if (!searchValue && category) {
            const filteredByCategory = favImages.filter(
                ({ categoryId }) => categoryId === Number(category) + 1
            );
            setFiltered(filteredByCategory);
            return;
        }

        const valLength = searchValue.length;

        const foundAuthors = authors.filter(({ nickname }) => {
            const substring = nickname.substring(0, valLength).toLowerCase();
            return substring === searchValue.toLowerCase();
        });

        const authorsIds = foundAuthors.map((v) => v.id);

        let filteredImg = favImages;

        if (searchValue && !category) {
            filteredImg = favImages.filter(({ authorId }) =>
                authorId ? authorsIds.includes(authorId) : null
            );
        }

        if (searchValue && category) {
            filteredImg = filtered.filter(({ authorId }) =>
                authorId ? authorsIds.includes(authorId) : null
            );
        }

        setFiltered(filteredImg);
    };

    const { status, handleAlert } = useAlert();

    const removeImageFromCollection = async (e: React.SyntheticEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        const id = e.currentTarget.dataset.imageid;

        if (id) {
            await removeFromCollection(Number(id));
            handleAlert('Удалено из коллекции');
        }
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

                <FilterBlock>
                    <TextField
                        id="outlined-search"
                        label="Поиск по автору"
                        type="search"
                        size="small"
                        sx={{ width: '300px' }}
                        value={searchValue}
                        onChange={handleSearch}
                    />
                    <FormControl sx={{ width: '300px' }}>
                        <InputLabel id="category-select-label">Категория</InputLabel>
                        <Select
                            size="small"
                            labelId="category-select-label"
                            label="Category"
                            value={category}
                            onChange={onSelectChange}
                            variant="outlined"
                        >
                            <MenuItem key="none" value="">
                                Не выбрано
                            </MenuItem>
                            {Object.entries(categoriesInfo).map(([key, { id, name }]) => (
                                <MenuItem key={id} value={String(id)}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </FilterBlock>

                <Grid container columns={5} rowSpacing={2} columnSpacing={{ xs: 2, md: 2 }}>
                    {filtered.map(({ name, id: imageId }, id) => {
                        return (
                            <Grid item xs={1} key={name + id} justifyContent="center">
                                <ImageItem
                                    imgUrl={BASE_URL + name}
                                    data-url={name}
                                    onClick={handleClick}
                                >
                                    <IconButton
                                        size="small"
                                        data-imageid={imageId}
                                        onClick={removeImageFromCollection}
                                        sx={{ position: 'absolute', top: '5px', right: '5px' }}
                                    >
                                        <DeleteRounded />
                                    </IconButton>
                                </ImageItem>
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

            {status && <AlertMessage key={status.key} message={status.msg} />}
        </>
    );
};

export default observer(CollectionPage);
