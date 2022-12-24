import React, { FC, useEffect, useState } from 'react';

import { observer } from 'mobx-react-lite';

import { categoriesInfo } from '@config/categories';
import { FileUploadOutlined } from '@mui/icons-material';
import {
    Alert,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    Snackbar,
} from '@mui/material';
import { useMeta, useRefStore } from '@stores/RootStore/hooks';

import {
    Content,
    Form,
    InfoPanel,
    InfoPanelItem,
    PageTitle,
    StyledButton,
    StyledInputLabel,
    SubTitle,
    UploadImage,
} from './AdminPage.styles';

const AdminPage: FC = () => {
    const { uploadImage } = useRefStore();
    const { isError } = useMeta();

    const [value, setValue] = useState({
        source: '',
        nickname: '',
        name: '',
        surname: '',
        socialMedia: '',
    });

    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(isError);
    }, [isError]);

    const [image, setImage] = useState<File | null>(null);

    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) {
            return;
        }
        setImage(files[0]);
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = event.target;
        setValue((val) => ({ ...val, [name]: value }));
    };

    const [category, setCategory] = useState('');

    const onSelectChange = (event: SelectChangeEvent) => {
        setCategory(event.target.value);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const sendToDB = async () => {
        const cat = Number(category);

        if (image) {
            await uploadImage(new Date(), value.source, cat, value.nickname, image);
        }

        const newValues = Object.entries(value).reduce(
            (obj, [key]) => ({ ...obj, [key]: '' }),
            value
        );

        setValue(newValues);
        setCategory('');
    };

    return (
        <Content>
            <PageTitle>Админ-панель</PageTitle>

            <Form>
                <UploadImage>
                    <StyledInputLabel htmlFor="file-upload-input">
                        <FileUploadOutlined />
                    </StyledInputLabel>
                    <input
                        type="file"
                        id="file-upload-input"
                        accept=".jpg"
                        hidden
                        onChange={onImageChange}
                    />
                </UploadImage>

                <InfoPanel>
                    <InfoPanelItem>
                        <SubTitle>Изображение</SubTitle>
                        <OutlinedInput
                            fullWidth={true}
                            size="small"
                            placeholder="Источник"
                            name="source"
                            onChange={handleChange}
                            value={value.source}
                        />

                        <FormControl>
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
                    </InfoPanelItem>

                    <InfoPanelItem>
                        <SubTitle>Автор</SubTitle>
                        <OutlinedInput
                            fullWidth={true}
                            size="small"
                            placeholder="Никнейм"
                            name="nickname"
                            onChange={handleChange}
                            value={value.nickname}
                        />
                    </InfoPanelItem>
                </InfoPanel>
            </Form>

            <StyledButton variant="contained" size="large" fullWidth={false} onClick={sendToDB}>
                Добавить в базу данных
            </StyledButton>

            <Snackbar
                open={open}
                autoHideDuration={4500}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleClose}
                    severity="error"
                    sx={{ width: '100%' }}
                    variant="filled"
                >
                    Произошла ошибка при отправке данных
                </Alert>
            </Snackbar>
        </Content>
    );
};

export default observer(AdminPage);
