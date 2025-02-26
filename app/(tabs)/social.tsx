import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  RefreshControl, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '@/constants/icons';
import SearchInput from '@/components/SearchInput';
import EmptyState from '@/components/EmptyState';
import { getAllPosts } from '@/lib/appwrite';
import useAppwrite from '@/lib/useAppwrite';
import VideoCard from '@/components/VideoCard';
import { useGlobalContext } from '../../context/GlobalProvider';
import { router } from 'expo-router';

const Social = () => {
  const { user } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const [refreshing, setRefreshing] = useState(false);
  // Holds the sport selected when "More" is pressed.
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  // Define the fixed list of sports categories.
  const sportsCategories = [
    "Skateboarding",
    "BMX",
    "Climbing",
    "Surfing",
    "Snowboarding",
    "Skiing",
    "Other",
    "Scootering",
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // When a sport is selected, filter posts by that sport.
  if (selectedSport) {
    const sportPosts = posts.filter((post) => post.sport === selectedSport);
    // Sort sport posts by $createdAt descending (latest first)
    sportPosts.sort((a, b) =>
      a.$createdAt && b.$createdAt
        ? Number(new Date(b.$createdAt)) - Number(new Date(a.$createdAt))
        : 0
    );
    return (
      <SafeAreaView className="bg-primary h-full">
        <View className="px-4 mt-6">
          <TouchableOpacity onPress={() => setSelectedSport(null)}>
            <Text className="text-white font-psemibold mb-4">Back</Text>
          </TouchableOpacity>
          <Text className="text-2xl text-white font-psemibold mb-4">
            {selectedSport}
          </Text>
        </View>
        <FlatList
          data={sportPosts}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => <VideoCard video={item} />}
          ListEmptyComponent={() => (
            <EmptyState
              title="No Videos Found"
              subtitle="No videos for this sport yet"
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </SafeAreaView>
    );
  }

  // Group posts by sport.
  const groupedBySport = posts?.reduce((acc, post) => {
    const sport = post.sport;
    if (!acc[sport]) {
      acc[sport] = [];
    }
    acc[sport].push(post);
    return acc;
  }, {} as Record<string, any[]>) || {};

  // Sort each group by created time descending (latest first).
  Object.keys(groupedBySport).forEach((sport) => {
    groupedBySport[sport].sort((a, b) => {
      if (a.$createdAt && b.$createdAt) {
        return Number(new Date(b.$createdAt)) - Number(new Date(a.$createdAt));
      }
      return 0;
    });
  });

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        className="px-4 mt-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="my-6 px-4 space-y-6">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="font-pmedium text-sm text-white">
                Welcome Back
              </Text>
              <Text className="text-2xl font-psemibold text-white">
                {user?.username}
              </Text>
            </View>
            <View className="mt-1.5">
              <Image
                source={icons.logo}
                className="w-12 h-12"
                resizeMode="contain"
              />
            </View>
          </View>
          <SearchInput
            otherStyles={undefined}
            handleChangeText={undefined}
            title={''}
            value={undefined}
            placeholder={''}
          />
        </View>

        {/* Display each sport category */}
        {sportsCategories.map((sport) => {
          // Get posts for this sport if available.
          const sportPosts = groupedBySport[sport] || [];
          return (
            <View key={sport} className="mb-8">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-2xl text-white font-psemibold">
                  {sport}
                </Text>
                {sportPosts.length > 0 && (
                  <TouchableOpacity onPress={() => setSelectedSport(sport)}>
                    <Text className="text-white">More</Text>
                  </TouchableOpacity>
                )}
              </View>
              {sportPosts.length > 0 ? (
                <VideoCard video={sportPosts[0]} />
              ) : (
                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/upload')}
                  className="p-4 border border-dashed border-gray-500 rounded-lg"
                >
                  <Text className="text-white text-center">
                    No videos yet, be the first to upload
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Social;
