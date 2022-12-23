import React, { FC, useEffect, useState } from 'react';

import { observer } from 'mobx-react-lite';

import { Box, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import { useAuthStore } from '@stores/RootStore/hooks';
import { UserType } from '@stores/UserStore/UserStore';

import { Content, PageTitle, StyledButton } from './ProfilePage.styles';

// todo review types?
type InputType = 'name' | 'surname' | 'email' | 'username';

type InputsInfoType = Pick<UserType, InputType>;

const inputInfo: InputsInfoType = {
    name: 'Имя',
    surname: 'Фамилия',
    email: 'Почта',
    username: 'Псевдоним',
};

const ProfilePage: FC = () => {
    const {
        user: { name, surname, username, email },
        editUser,
    } = useAuthStore();

    useEffect(() => {
        setUserInfo({ name, surname, username, email });
    }, []);

    const [userInfo, setUserInfo] = useState<InputsInfoType>({
        name: '',
        surname: '',
        email: '',
        username: '',
    });

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = event.target;
        setUserInfo((val) => ({ ...val, [name]: value }));
    };

    const save = () => {
        console.log('edit', userInfo);
        editUser({
            name: userInfo.name ? userInfo.name : undefined,
            surname: userInfo.surname ? userInfo.surname : undefined,
            email: userInfo.email,
            username: userInfo.username ? userInfo.username : undefined,
        });
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
                                value={userInfo[key as InputType] || ''}
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
