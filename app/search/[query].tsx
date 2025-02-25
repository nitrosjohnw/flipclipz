import { View, Text, Image, RefreshControl} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler'
import SearchInput from '@/components/SearchInput'
import EmptyState from '@/components/EmptyState'
import { searchPosts } from '@/lib/appwrite'
import useAppwrite from '@/lib/useAppwrite'
import VideoCard from '@/components/VideoCard'
import { Stack, useLocalSearchParams } from 'expo-router'


const Search = () => {
  const { query } = useLocalSearchParams()
  const {data: posts, refetch} = useAppwrite(() => searchPosts(query));
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    refetch()
  },[query])
  
  return (
    <GestureHandlerRootView>
      <Stack.Screen options={{ headerShown: false }}/>
    <SafeAreaView className='bg-primary h-full' >
      <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <VideoCard video={item}/>
      )}
      ListHeaderComponent={() => (
        <View className='my-6 px-4'>
              <Text className='font-pmedium text-m text-white'> 
                Search Results
              </Text>
              <Text className='text-3xl font-psemibold text-white'>
                {query}
              </Text>
            <View className='mt-6 mb-8'>
            <SearchInput 
            initialQuery={query} 
            otherStyles={undefined} 
            handleChangeText={undefined} title={''}
             value={undefined} placeholder={''}/>
            </View>
          </View>
          
      )}
      ListEmptyComponent={() => (
        <EmptyState
        title='No Videos Found'
        subtitle='No Videos Found'
        />
      )}
      />
    </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default Search

