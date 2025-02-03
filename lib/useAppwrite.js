import { useState, useEffect } from "react";
import { Alert } from "react-native";

const useAppwrite = (fn) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Define fetchData outside of useEffect
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await fn();
            setData(response);
        } catch (error) {
            Alert.alert('Error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();  // Call fetchData when the hook mounts
    }, []); 

    const refetch = () => fetchData(); // Now refetch has access to fetchData

    return { data, isLoading, refetch };
};

export default useAppwrite;
