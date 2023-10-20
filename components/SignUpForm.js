import React, { useCallback, useEffect, useReducer, useState } from 'react';
import Input from '../components/Input';
import SubmitButton from '../components/SubmitButton';
import { Feather, FontAwesome } from '@expo/vector-icons';

import { validateInput } from '../utils/actions/formActions';
import { reducer } from '../utils/reducers/formReducer';
import { signUp } from '../utils/actions/authActions';
import { ActivityIndicator, Alert } from 'react-native';
import colors from '../constants/colors';
import { useDispatch, useSelector } from 'react-redux';

const initialState = {
    inputValues: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    },
    inputValidities: {
        firstName: false,
        lastName: false,
        email: false,
        password: false,
    },
    formIsValid: false
}

const SignUpForm = props => {

    const dispatch = useDispatch();

    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [formState, dispatchFormState] = useReducer(reducer, initialState);

    const inputChangedHandler = useCallback((inputId, inputValue) => {
        const result = validateInput(inputId, inputValue);
        dispatchFormState({ inputId, validationResult: result, inputValue })
    }, [dispatchFormState]);

    useEffect(() => {
        if (error) {
            Alert.alert("An error occured", error, [{ text: "Okay" }]);
        }
    }, [error])

    const authHandler = useCallback(async () => {
        try {
            setIsLoading(true);

            const action = signUp(
                formState.inputValues.firstName.trimEnd(),
                formState.inputValues.lastName.trimEnd(),
                formState.inputValues.email.trimEnd(),
                formState.inputValues.password.trimEnd(),
            );
            setError(null);
            await dispatch(action);
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    }, [dispatch, formState]);

    const marVerticalSize = 0

    return (
            <>
                <Input
                    id="firstName"
                    // label="First name"
                    icon="user-o"
                    iconSize={18}
                    marTop={0}
                    iconPack={FontAwesome}
                    placeholder="First Name"
                    onInputChanged={inputChangedHandler}
                    autoCapitalize="none"
                    errorText={formState.inputValidities["firstName"]} />

                <Input
                    id="lastName"
                    // label="Last name"
                    icon="user-o"
                    iconSize={18}
                    marTop={marVerticalSize}
                    iconPack={FontAwesome}
                    placeholder="Last Name"
                    onInputChanged={inputChangedHandler}
                    autoCapitalize="none"
                    errorText={formState.inputValidities["lastName"]} />

                <Input
                    id="email"
                    // label="Email"
                    icon="mail"
                    iconSize={18}
                    marTop={marVerticalSize}
                    iconPack={Feather}
                    placeholder="Name@mail.com"
                    onInputChanged={inputChangedHandler}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    errorText={formState.inputValidities["email"]} />

                <Input
                    id="password"
                    // label="Password"
                    icon="lock"
                    iconSize={18}
                    marTop={marVerticalSize}
                    autoCapitalize="none"
                    placeholder="Password"
                    secureTextEntry
                    iconPack={Feather}
                    onInputChanged={inputChangedHandler}
                    errorText={formState.inputValidities["password"]} />
                
                {
                    isLoading ? 
                    <ActivityIndicator size={'small'} color={colors.blue} style={{ marginTop: 10 }} /> :
                    <SubmitButton
                        color={colors.darkBlue}
                        title="Sign up"
                        onPress={authHandler}
                        style={{ marginTop: 40 }}
                        disabled={!formState.formIsValid}/>
                }
            </>
    )
};

export default SignUpForm;