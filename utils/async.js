import AsyncStorage from "@react-native-async-storage/async-storage";

export const setItem = async (key, value) => {
    try{ 
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.log("Error storing Async: ", error);
    }
}

export const getItem = async (key) => {
    try{ 
        const value = await AsyncStorage.getItem(key);
        return value;
    } catch (error) {
        console.log("Error retrieving Async: ", error);
    }
}

export const removeItem = async (key) => {
    try{ 
        await AsyncStorage.removeItem(key);
        return value;
    } catch (error) {
        console.log("Error deleting Async: ", error);
    }
}