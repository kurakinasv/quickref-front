import React, { FC, useState } from 'react';

import { categoriesInfo } from '@config/categories';
import { FileUploadOutlined } from '@mui/icons-material';
import {
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import { useRefStore } from '@stores/RootStore/hooks';

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

    const [value, setValue] = useState({
        source: '',
        nickname: '',
        name: '',
        surname: '',
        socialMedia: '',
    });

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
                        {/* <OutlinedInput
                            fullWidth={true}
                            size="small"
                            placeholder="Имя файла"
                            name="fileName"
                            onChange={handleChange}
                            value={value.fileName}
                        /> */}
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
                        {/* <OutlinedInput
                            fullWidth={true}
                            size="small"
                            placeholder="Имя"
                            name="name"
                            onChange={handleChange}
                            value={value.name}
                        />
                        <OutlinedInput
                            fullWidth={true}
                            size="small"
                            placeholder="Фамилия"
                            name="surname"
                            onChange={handleChange}
                            value={value.surname}
                        />
                        <OutlinedInput
                            fullWidth={true}
                            size="small"
                            placeholder="Медиа"
                            name="socialMedia"
                            onChange={handleChange}
                            value={value.socialMedia}
                        /> */}
                    </InfoPanelItem>
                </InfoPanel>
            </Form>

            <StyledButton variant="contained" size="large" fullWidth={false} onClick={sendToDB}>
                Добавить в базу данных
            </StyledButton>
        </Content>
    );
};

export default AdminPage;
