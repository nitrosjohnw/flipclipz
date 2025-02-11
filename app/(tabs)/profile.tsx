
import { View, Text, Image, RefreshControl, TouchableOpacity, Alert} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler'
import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import { getCurrentUser, getUserPosts, searchPosts, signOut } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useLocalSearchParams } from 'expo-router'
import { useGlobalContext } from '../../context/GlobalProvider'
import icons from '@/constants/icons';
import InfoBox from '../../components/InfoBox'
import { router } from 'expo-router'


const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  console.log("Global Context:", { user, setUser, setIsLoggedIn });
  const {data: posts} = useAppwrite(() => getUserPosts(user.$id));

  const logout = async () => {
    try {
        console.log("Checking if user is logged in...");
        const currentUser = await getCurrentUser(); // Ensure user is logged in

        if (!currentUser) {
            console.warn("No active session found. Redirecting to Sign-In...");
            setUser(null);
            setIsLoggedIn(false);
            router.replace('/(auth)/sign-in');
            return;
        }

        console.log("Logging out user...");
        await signOut();
        setUser(null);
        setIsLoggedIn(false);
        router.replace('/(auth)/sign-in');
    } catch (error) {
        console.error("Logout Error:", error);
        Alert.alert("Logout Failed", error.message || "Something went wrong while logging out.");
    }
};




  const [refreshing, setRefreshing] = useState(false);
  return (
    <GestureHandlerRootView>
    <SafeAreaView className='bg-primary h-full'>
      <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <VideoCard video={item}/>
      )}
      ListHeaderComponent={() => (
        <View className='w-full justify-center items-center mt-6 mb-12 px-4'>
          <TouchableOpacity className='w-full items-end mb-10'onPress={logout}>
            <Image source={icons.logout}
            resizeMode='contain'
            className='w-6 h-6'
            />
          </TouchableOpacity>
          <View className= 'w-16 h-16 border border-secondary rounded-lg justify-center items-center'>
            <Image source={{uri: user?.avatar}} className='w-[90%] h-[90%] rounded-lg' resizeMode='cover'/>
          </View>
          <InfoBox
            title={user?.username}
            containerStyles='mt-5'
            titleStyles='text-lg' 
            subtitle={undefined}          />
          <View className='flex-row mt-5'>
            <InfoBox
            title={posts.length || 0}
            subtitle='Posts          '
            containerStyles='mr-10'
            titleStyles='text-xl'
            />
            <InfoBox
              title='1.2k'
              subtitle='Followers'
              titleStyles='text-xl' 
              containerStyles={undefined}            />
          </View>
        </View>
          
      )}
      ListEmptyComponent={() => (
        <EmptyState
        title='No Videos Found'
        subtitle='No videos found'
        />
      )}
      />
    </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default Profile

