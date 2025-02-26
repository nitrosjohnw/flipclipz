import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '@/components/FormField';
import React, { useState, useEffect } from 'react';
import { Video, ResizeMode } from 'expo-av';
import icons from '@/constants/icons';
import CustomButton from '@/components/CustomButton';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { createVideo } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';

const sportsOptions = [
  { label: 'Skateboarding', value: 'Skateboarding' },
  { label: 'BMX', value: 'BMX' },
  { label: 'Climbing', value: 'Climbing' },
  { label: 'Surfing', value: 'Surfing' },
  { label: 'Snowboarding', value: 'Snowboarding' },
  { label: 'Skiing', value: 'Skiing' },
  { label: 'Other', value: 'Other' },
  { label: 'Scootering', value: 'Scootering' },
];

const Upload = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    video: null,
    thumbnail: null,
    sport: '',
  });
  const [showSportModal, setShowSportModal] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'You need to grant permission to access the gallery.');
      }
    })();
  }, []);

  const openPicker = async (selectType: string) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          selectType === 'image'
            ? ImagePicker.MediaTypeOptions.Images
            : ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true, // Editing is now enabled
        quality: 1,
      });

      console.log('Picker result:', result);

      if (!result.canceled && result.assets.length > 0) {
        if (selectType === 'image') {
          setForm((prevForm) => ({ ...prevForm, thumbnail: result.assets[0] }));
        } else if (selectType === 'video') {
          setForm((prevForm) => ({ ...prevForm, video: result.assets[0] }));
        }
      }
    } catch (error) {
      console.error('Picker Error:', error);
    }
  };

  const removeVideo = () => {
    setForm((prevForm) => ({ ...prevForm, video: null }));
  };

  const removeImage = () => {
    setForm((prevForm) => ({ ...prevForm, thumbnail: null }));
  };

  const submit = async () => {
    if (!form.title || !form.video || !form.thumbnail || !form.sport) {
      return Alert.alert('Please fill in all the fields');
    }
    setUploading(true);

    try {
      await createVideo({ ...form, userId: user.$id });
      Alert.alert('Success', 'Post Uploaded successfully');
      router.push('/(tabs)/home');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setForm({
        title: '',
        video: null,
        thumbnail: null,
        sport: '',
      });
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 mt-6" keyboardShouldPersistTaps="handled">
        <Text className="text-2xl text-white font-psemibold">Upload Video</Text>

        <FormField
          otherStyles="mt-10"
          title="Video Title"
          value={form.title}
          placeholder="Give your clip a catchy title..."
          handleChangeText={(e: any) => setForm({ ...form, title: e })}
        />

        {/* VIDEO PICKER */}
        <View className="mt-7 space-y-2">
          <Text className="text-base text-white font-pmedium">Upload Video</Text>
          <TouchableOpacity onPress={() => openPicker('video')} disabled={!!form.video}>
            {form.video?.uri ? (
              <>
                <Video
                  source={{ uri: form.video.uri }}
                  style={{ width: '100%', height: 500, borderRadius: 20 }}
                  useNativeControls
                  resizeMode={ResizeMode.CONTAIN}
                  isLooping
                  shouldPlay
                  onError={(e) => console.log('Video Error:', e)}
                />
                <CustomButton
                  title="Remove Video"
                  handlePress={removeVideo}
                  containerStyles="mt-3 bg-red-500"
                  textStyles="text-base text-white font-pmedium"
                />
              </>
            ) : (
              <View className="w-full h-40 bg-white rounded-2xl justify-center items-center border-2 border-red-500">
                <View className="w-14 h-14 border border-dashed border-secondary justify-center items-center">
                  <Image source={icons.upload} resizeMode="contain" className="w-1/2 h-1/2" />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* THUMBNAIL PICKER */}
        <View className="mt-7 space-y-2">
          <Text className="text-base text-white font-pmedium">Thumbnail Image</Text>
          <TouchableOpacity onPress={() => openPicker('image')} disabled={!!form.thumbnail}>
            {form.thumbnail?.uri ? (
              <>
                <Image
                  source={{ uri: form.thumbnail.uri }}
                  resizeMode="cover"
                  style={{ width: '100%', height: 200, borderRadius: 20 }}
                />
                <CustomButton
                  title="Remove Thumbnail"
                  handlePress={removeImage}
                  containerStyles="mt-3 bg-red-500"
                  textStyles="text-base text-white font-pmedium"
                />
              </>
            ) : (
              <View className="w-full h-16 bg-white rounded-2xl justify-center items-center border-2 border-red-500 flex-row space-x-2">
                <Image source={icons.upload} resizeMode="contain" className="w-5 h-5" />
                <Text className="text-sm text-secondary font-pmedium px-4">
                  Upload Thumbnail Image
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* SPORT DROPDOWN USING MODAL */}
        <View className="mt-7">
          <Text className="text-base text-white font-pmedium">Select Sport</Text>
          <TouchableOpacity
            onPress={() => setShowSportModal(true)}
            className="bg-white rounded-2xl border-2 border-red-500 p-3"
          >
            <Text className="text-secondary">
              {form.sport
                ? sportsOptions.find((option) => option.value === form.sport)?.label
                : 'Select a sport...'}
            </Text>
          </TouchableOpacity>
        </View>

        <CustomButton
          title="Post Clip"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>

      {/* SPORT SELECTION MODAL */}
      <Modal
        visible={showSportModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSportModal(false)}
      >
        <Pressable
          onPressOut={() => setShowSportModal(false)}
          className="flex-1 bg-black bg-opacity-50 justify-center items-center"
        >
          <View className="bg-white m-5 rounded-lg p-5 w-full">
            {sportsOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => {
                  setForm({ ...form, sport: option.value });
                  setShowSportModal(false);
                }}
                className="py-2"
              >
                <Text className="text-base text-secondary">{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default Upload;
