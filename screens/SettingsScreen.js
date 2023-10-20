import { Feather, FontAwesome } from '@expo/vector-icons';
import React, { useCallback, useMemo, useReducer, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DataItem from '../components/DataItem';
import Input from '../components/Input';
import PageContainer from '../components/PageContainer';
import PageTitle from '../components/PageTitle';
import ProfileImage from '../components/ProfileImage';
import SubmitButton from '../components/SubmitButton';
import colors from '../constants/colors';
import { updateLoggedInUserData } from '../store/authSlice';
import { reset, updateSignedInUserData, userLogout, userReset } from '../utils/actions/authActions';
import { validateInput } from '../utils/actions/formActions';
import { reducer } from '../utils/reducers/formReducer';

const SettingsScreen = props => {

    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const userData = useSelector(state => state.auth.userData);
    const starredMessages = useSelector(state => state.messages.starredMessages ?? {});

    const [aboutLength, setAboutLength] = useState(0);

    const [isAboutChanged, setIsAboutChanged] = useState(false);

    const handleAboutInputChange = (inputId, inputValue) => {
        setAboutLength(inputValue.length);
        setIsAboutChanged(true);
        inputChangedHandler(inputId, inputValue);
    };

    const sortedStarredMessages = useMemo(() => {
        let result = [];

        const chats = Object.values(starredMessages);

        chats.forEach(chat => {
            const chatMessages = Object.values(chat);
            result = result.concat(chatMessages);
        })

        return result;
    }, [starredMessages]);
    
    const firstName = userData.firstName || "";
    const lastName = userData.lastName || "";
    const email = userData.email || "";
    const about = userData.about || "";

    const initialState = {
        inputValues: {
            firstName,
            lastName,
            email,
            about,
        },
        inputValidities: {
            firstName: undefined,
            lastName: undefined,
            email: undefined,
            about: undefined,
        },
        formIsValid: false
    }

    const [formState, dispatchFormState] = useReducer(reducer, initialState);

    const inputChangedHandler = useCallback((inputId, inputValue) => {
        const result = validateInput(inputId, inputValue);
        dispatchFormState({ inputId, validationResult: result, inputValue })
    }, [dispatchFormState]);

    const saveHandler = useCallback(async () => {
        const updatedValues = formState.inputValues;
        
        try {
            setIsLoading(true);
            await updateSignedInUserData(userData.userId, updatedValues);
            dispatch(updateLoggedInUserData({newData: updatedValues}));

            setShowSuccessMessage(true);

            setTimeout(() => {
                setShowSuccessMessage(false)
            }, 3000);
        } catch (error) {
            console.log(error);
        }
        finally {
            setIsLoading(false);
        }
    }, [formState, dispatch]);

    const hasChanges = () => {
        const currentValues = formState.inputValues;

        return currentValues.firstName != firstName ||
            currentValues.lastName != lastName || 
            currentValues.email != email ||
            currentValues.about != about;
    }

    const marTopSize = 0
    const marBottomSize = '4%'

    return <PageContainer>

        <ScrollView contentContainerStyle={styles.formContainer}>

            <ProfileImage
                width={'100%'}
                height={200}
                userId={userData.userId}
                uri={userData.profilePicture}
                showEditButton={true} 
                style={{ marginBottom: '2%',}}/>
                
            <Input
                id="firstName"
                label="First name"
                icon="user-o" 
                marTop={'5%'}
                marBottom={marBottomSize}
                iconPack={FontAwesome}
                onInputChanged={inputChangedHandler}
                autoCapitalize="none"
                errorText={formState.inputValidities["firstName"]}
                initialValue={userData.firstName} />

            <Input
                id="lastName"
                label="Last name"
                icon="user-o"
                marTop={marTopSize}
                marBottom={marBottomSize}
                iconPack={FontAwesome}
                onInputChanged={inputChangedHandler}
                autoCapitalize="none"
                errorText={formState.inputValidities["lastName"]}
                initialValue={userData.lastName} />

                <Input
                    id="email"
                    label="Email"
                    icon="mail"
                    marTop={marTopSize}
                    marBottom={marBottomSize}
                    iconPack={Feather}
                    onInputChanged={inputChangedHandler}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    errorText={formState.inputValidities["email"]}
                    initialValue={userData.email}
                    editable={false} // This disables the input field
                    inputContainerStyle={{opacity: 0.7}}  // This makes the input field appear disabled
                />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{marginTop:'5%', fontFamily:'semiBold', fontSize:16}}>About: </Text>
                   {isAboutChanged && <Text style={{marginTop:'5%',fontFamily:'thinItalic'}}>{100 - aboutLength} characters remaining</Text>}           
                </View>
                <Input
                    id="about"
                    icon="user-o"
                    inputContainerStyle={{paddingVertical:0}}
                    // marTop={marTopSize}
                    marBottom={marBottomSize}
                    iconPack={FontAwesome}
                    onInputChanged={handleAboutInputChange}
                    autoCapitalize="none"
                    errorText={formState.inputValidities["about"]}
                    initialValue={userData.about}
                    maxLength={100}
                    multiline={true}
                    // marVertical={2}
                    numberOfLines={4} // Adjust this to control the initial height of the TextInput
                />
                            

            <View style={{ marginTop: 5 }}>
                {
                    showSuccessMessage && <Text>Saved!</Text>
                }
                <DataItem
                    type={"link"}
                    title="Starred messages"
                    hideImage={true}
                    titleStyle={{ color: 'white'}} // Add your custom color here
                    style={{ backgroundColor:colors.darkBlue, margin:0}}
                    iconColor='white'
                    onPress={() => props.navigation.navigate("DataList", { title: "Starred messages", data: sortedStarredMessages, type: "messages" })}
                />

                {
                    isLoading ? 
                    <ActivityIndicator size={'small'} color={colors.primary} style={{ marginTop: 10 }} /> :
                    hasChanges() && <SubmitButton
                        title="Save"
                        onPress={saveHandler}
                        style={{ marginTop: '10%'}}
                        textColor='black'
                        disabled={!formState.formIsValid} />
                }
            </View>

           <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <SubmitButton
                    title="Logout"
                    onPress={() => dispatch(userLogout())}
                    style={{ marginTop: 20, }}
                    color={'#E87B3D'}
                />

                <SubmitButton
                    title="Reset"
                    onPress={() => dispatch(userReset())}
                    style={{ marginTop: 20, marginLeft:'10%'}}
                    color={colors.red}
                />
            </View>

        </ScrollView>   
    </PageContainer>
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white'
    },
    formContainer: { 
        width:'95%',
        marginTop:20,
        marginBottom:20,
        paddingBottom:50,
        marginLeft:5
    },
})

export default SettingsScreen;