import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Video, ResizeMode } from 'expo-av';
import icons from '@/constants/icons';

function VideoCard({
  video: { title, thumbnail, sport, video, creator: { username, avatar } },
}: {
  video: {
    title: any;
    thumbnail: any;
    sport: any;
    video: any;
    creator: { username: any; avatar: any };
  };
}) {
  const [play, setPlay] = useState(false);

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          <View className="justify-center flex-1 ml-3">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xl text-white font-pregular"
              numberOfLines={1}
            >
              {username}
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
    </View>
  );
}

export default VideoCard;
