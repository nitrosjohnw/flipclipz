import { 
  View, 
  Text, 
  Image, 
  RefreshControl, 
  TouchableOpacity 
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useLocalSearchParams } from 'expo-router';
import SearchInput from '@/components/SearchInput';
import EmptyState from '@/components/EmptyState';
import { getUserAndPosts, getFilePreview } from '@/lib/appwrite';
import VideoCard from '@/components/VideoCard';
import { router } from 'expo-router';
import icons from '@/constants/icons';
import InfoBox from '@/components/InfoBox';

const UserProfile = () => {
  // Support both passedUserId and userId for flexibility.
  const { passedUserId, userId } = useLocalSearchParams<{ passedUserId?: string; userId?: string }>();
  const effectiveUserId = passedUserId || userId;

  // Log the passed user id for debugging.
  useEffect(() => {
    console.log('Passed user id:', effectiveUserId);
  }, [effectiveUserId]);

  if (!effectiveUserId) {
    return (
      <SafeAreaView className="bg-primary h-full flex-1 justify-center items-center">
        <Text className="text-white">Error: No user specified.</Text>
      </SafeAreaView>
    );
  }

  // State to store the user document and posts.
  const [data, setData] = useState<{ user: any; posts: any[] } | null>(null);
  // State to store the transformed avatar URL.
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Toggle for showing clips (videos).
  const [showClips, setShowClips] = useState(false);

  const fetchData = async () => {
    try {
      const result = await getUserAndPosts(effectiveUserId);
      setData(result);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching user and posts:", err);
      setError(err.message || "Error fetching user and posts");
    }
  };

  useEffect(() => {
    fetchData();
  }, [effectiveUserId]);

  // Convert the avatar if available.
  useEffect(() => {
    if (data && data.user && data.user.avatar) {
      getFilePreview(data.user.avatar, 'image')
        .then(url => setAvatarUrl(url))
        .catch(err => {
          console.error("Error fetching avatar preview:", err);
          setAvatarUrl(data.user.avatar);
        });
    }
  }, [data]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  if (error) {
    return (
      <SafeAreaView className="bg-primary h-full flex-1 justify-center items-center">
        <Text className="text-white">{error}</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-white underline">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView className="bg-primary h-full flex-1 justify-center items-center">
        <Text className="text-white">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="bg-primary h-full">
        <FlatList
          data={showClips ? data.posts : []}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => <VideoCard video={item} />}
          ListHeaderComponent={() => (
            <View className="w-full justify-center items-center mt-6 mb-12 px-4">
              {/* Back button header */}
              <TouchableOpacity
                className="w-full items-start mb-10"
                onPress={() => router.back()}
              >
                <Image
                  source={icons.back}
                  resizeMode="contain"
                  className="w-6 h-6"
                />
              </TouchableOpacity>
              <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
                <Image
                  source={{ uri: avatarUrl || data.user.avatar }}
                  className="w-[90%] h-[90%] rounded-lg"
                  resizeMode="cover"
                />
              </View>
              <InfoBox
                title={data.user.username}
                containerStyles="mt-5"
                titleStyles="text-lg"
                subtitle={undefined}
              />
              <View className="flex-row mt-5">
                <InfoBox
                  title={data.posts.length || 0}
                  subtitle="Posts"
                  containerStyles="mr-10"
                  titleStyles="text-xl"
                />
                <InfoBox
                  title="1.2k"
                  subtitle="Followers"
                  titleStyles="text-xl"
                  containerStyles={undefined}
                />
              </View>
              {/* View Clip Button */}
              <TouchableOpacity 
                onPress={() => setShowClips(!showClips)}
                className="mt-4 bg-blue-600 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-bold">
                  {showClips ? "Hide Clips" : "View Clip"}
                </Text>
              </TouchableOpacity>
              <SearchInput
                otherStyles={undefined}
                handleChangeText={undefined}
                title={''}
                value={undefined}
                placeholder={''}
              />
            </View>
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title="No Videos Found"
              subtitle="No videos found"
            />
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default UserProfile;
