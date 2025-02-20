import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Video, ResizeMode } from 'expo-av';
import icons from '@/constants/icons';
import { likeVideo } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';
import CommentsSection from '@/components/CommentsSection';

function VideoCard({
  video: { $id, title, thumbnail, sport, video, likedBy, comments, creator },
}: {
  video: {
    $id: string;
    title: string;
    thumbnail: string;
    sport: string;
    video: string;
    likedBy: string[]; // array of user IDs
    comments: number;
    creator?: { username?: string; avatar?: string };
  };
}) {
  const { user } = useGlobalContext(); // current logged-in user
  const [play, setPlay] = useState(false);
  // Initialize liked state on mount based on whether the current user's ID is in likedBy.
  const [liked, setLiked] = useState(() =>
    user && likedBy ? likedBy.includes(user.$id) : false
  );
  const [currentLikes, setCurrentLikes] = useState(likedBy ? likedBy.length : 0);
  const [showComments, setShowComments] = useState(false);

  // Fallback values for deleted user
  const displayUsername = creator?.username || 'Deleted User';
  const displayAvatar = creator?.avatar || icons.defaultAvatar; // Make sure you have a default avatar image

  const handleLike = async () => {
    // If the user has already liked, do nothing.
    if (liked) return;
    try {
      await likeVideo($id, user.$id);
      setLiked(true);
      setCurrentLikes(prev => prev + 1);
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  return (
    <View className="flex-col items-center px-4 mb-14">
      {/* Top Info Row */}
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: displayAvatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          <View className="justify-center flex-1 ml-3">
            <Text className="text-white font-psemibold text-sm" numberOfLines={1}>
              {title}
            </Text>
            <Text className="text-xl text-white font-pregular" numberOfLines={1}>
              {displayUsername}
            </Text>
          </View>
          <Text className="text-white font-psemibold text-sm" numberOfLines={1}>
            {sport}
          </Text>
        </View>
        <View className="pt-3">
          <Image source={icons.menu} className="w-7 h-7" resizeMode="contain" />
        </View>
      </View>

      {/* Video or Thumbnail */}
      {play ? (
        <Video
          source={{ uri: video }}
          style={{
            width: '100%',
            height: 320,
            borderRadius: 15,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (
              status.isLoaded &&
              status.positionMillis !== undefined &&
              status.durationMillis !== undefined &&
              status.positionMillis >= status.durationMillis
            ) {
              setPlay(false); // Video finished playing
            }
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-80 relative"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <View className="absolute inset-0 justify-center items-center">
            <Image
              source={icons.play}
              className="w-12 h-12"
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      )}

      {/* Likes and Comments Section */}
      <View className="flex-row justify-between items-center mt-6 w-full">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={handleLike} 
            activeOpacity={0.7}
            disabled={liked} // disable if already liked
          >
            <Image
              source={icons.like}
              style={{
                width: 24,
                height: 24,
                tintColor: liked ? 'red' : 'white'
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {currentLikes > 0 && (
            <Text className="ml-1 text-white text-xs">{currentLikes}</Text>
          )}
        </View>
        <TouchableOpacity 
          onPress={() => setShowComments(prev => !prev)} 
          activeOpacity={0.7}
        >
          <View className="flex-row items-center">
            <Image 
              source={icons.comment} 
              className="w-6 h-6" 
              resizeMode="contain" 
            />
            <Text className="ml-1 text-white text-xs">{comments}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Inline Comments Section */}
      {showComments && <CommentsSection videoId={$id} />}
    </View>
  );
}

export default VideoCard;
