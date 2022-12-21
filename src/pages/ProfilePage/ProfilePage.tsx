import React, { FC, useState } from 'react';

import { observer } from 'mobx-react-lite';

import { Box, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import { useUserStore } from '@stores/RootStore/hooks';

import { Content, PageTitle, StyledButton } from './ProfilePage.styles';

// todo review types?
type InputType = 'name' | 'surname' | 'email' | 'username';

type InputsInfoType = Record<InputType, string>;

const inputInfo: InputsInfoType = {
    name: 'Имя',
    surname: 'Фамилия',
    email: 'Почта',
    username: 'Псевдоним',
};

const ProfilePage: FC = () => {
    const { userName, surname, email, nickname, updateUserInfo } = useUserStore();

    const [userInfo, setUserInfo] = useState<InputsInfoType>({
        name: userName,
        surname: surname,
        email: email,
        username: nickname,
    });

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = event.target;
        setUserInfo((val) => ({ ...val, [name]: value }));
    };

    const save = () => {
        console.log('saved', JSON.stringify(userInfo));
        updateUserInfo(userInfo);
    };

    return (
        <Content>
            <PageTitle>Профиль</PageTitle>

            <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: '20px', width: '50vw' }}>
                {Object.entries(inputInfo).map(([key, val], i) => {
                    const id = `profile-${key}-input`;
                    return (
                        <FormControl key={i + key}>
                            <InputLabel htmlFor={id}>{val}</InputLabel>
                            <OutlinedInput
                                value={userInfo[key as InputType]}
                                id={id}
                                name={key}
                                onChange={handleChange}
                                label={val}
                            />
                        </FormControl>
                    );
                })}

                <StyledButton variant="contained" size="large" onClick={save}>
                    Сохранить
                </StyledButton>
            </Box>
        </Content>
    );
};

export default observer(ProfilePage);
