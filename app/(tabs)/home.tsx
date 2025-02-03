import { View, Text, FlatList, Image, RefreshControl, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import icons from '@/constants/icons';
import SearchInput from '@/components/SearchInput';
import Trending from '@/components/Trending';
import EmptyState from '@/components/EmptyState';
import { getAllPosts, getLatestPosts } from '@/lib/appwrite';
import useAppwrite from '@/lib/useAppwrite'
import VideoCard from '@/components/VideoCard';

const Home = () => {
  const { data: posts, refetch} = useAppwrite(getAllPosts)
  const { data: latestPosts} = useAppwrite(getLatestPosts)

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }
  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList
      data={posts}
      keyExtractor={(item) => item}  
      renderItem={({ item }) => (
      <VideoCard video={item}/>

      )}
      ListHeaderComponent={() => (
        <View className='my-6 px-4 space-y-6'>
          <View className='justify-between items-start flex-row mb-6'>
            <View>
              <Text className='font-pmedium text-sm text-white'>
                Welcome Back
              </Text>
              <Text className='text-2xl font-psemibold text-white'>
                john
              </Text>
            </View>
            <View className='mt-1.5'>
              <Image
              source={icons.logo}
              className='w-12 h-12'
              resizeMode='contain'
              />

            </View>
          </View>
          <SearchInput 
          otherStyles={undefined} 
          handleChangeText={undefined} 
          title={''} value={undefined} 
          placeholder={''}/>
          <View className='w-full flex-1 pt-5 pb-8'>
            <Text className='text-white text-lg font-pregular mb-3'>
              Latest Videos
            </Text>
            <Trending posts={latestPosts ?? []}/>

          </View>
        </View>
      )}
      ListEmptyComponent={() => (
        <EmptyState
        title='No Videos Found'
        subtitle='No Videos Created Yet'
        />
      )}
      refreshControl={<RefreshControl refreshing= {refreshing} onRefresh={onRefresh}/>}
      />
    </SafeAreaView>
  )
}

export default Home