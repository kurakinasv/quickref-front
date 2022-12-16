import React, { FC, useState } from 'react';

import { categoriesInfo } from '@config/categories';
import { FileUploadOutlined } from '@mui/icons-material';
import {
    FormControl,
    Input,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
} from '@mui/material';

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
    const [value, setValue] = useState({
        fileName: '',
        source: '',
        authorName: '',
        authorSurname: '',
        authorMedia: '',
    });

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = event.target;
        setValue((val) => ({ ...val, [name]: value }));
    };

    const [category, setCategory] = useState('');

    const onSelectChange = (event: SelectChangeEvent) => {
        setCategory(event.target.value);
    };

    // todo add image uploading
    const sendToDB = () => {
        console.log('...sending', { ...value, category });

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
                    <Input type="file" id="file-upload-input" />
                </UploadImage>

                <InfoPanel>
                    <InfoPanelItem>
                        <SubTitle>Изображение</SubTitle>
                        <OutlinedInput
                            fullWidth={true}
                            size="small"
                            placeholder="Имя файла"
                            name="fileName"
                            onChange={handleChange}
                            value={value.fileName}
                        />
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
                                    <MenuItem key={id} value={key}>
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
                            placeholder="Имя"
                            name="authorName"
                            onChange={handleChange}
                            value={value.authorName}
                        />
                        <OutlinedInput
                            fullWidth={true}
                            size="small"
                            placeholder="Фамилия"
                            name="authorSurname"
                            onChange={handleChange}
                            value={value.authorSurname}
                        />
                        <OutlinedInput
                            fullWidth={true}
                            size="small"
                            placeholder="Медиа"
                            name="authorMedia"
                            onChange={handleChange}
                            value={value.authorMedia}
                        />
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
