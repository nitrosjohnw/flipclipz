import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
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

const Upload = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    video: null,
    thumbnail: null,
    sport: '',
  });

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
        mediaTypes: selectType === 'image' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
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
    if(!form.title || !form.video || !form.thumbnail || !form.sport){
      return Alert.alert('Please fill in all the fields')
    }
    setUploading(true)

    try {
      await createVideo ({
        ...form, userId: user.$id
      })
      Alert.alert('Succsess', 'Post Uploaded succsessfully')
      router.push('/(tabs)/home')
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setForm({
        title: '',
        video: null,
        thumbnail: null,
        sport: '',
      })
      setUploading(false)
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 mt-6">
        <Text className="text-2xl text-white font-psemibold">
          Upload Video
        </Text>

        <FormField
          otherStyles="mt-10"
          title="Video Title"
          value={form.title}
          placeholder="Give your clip a catchy title..."
          handleChangeText={(e: any) => setForm({ ...form, title: e })}
        />

        {/* VIDEO PICKER */}
        <View className="mt-7 space-y-2">
          <Text className="text-base text-white font-pmedium">
            Upload Video
          </Text>
          <TouchableOpacity 
            onPress={() => openPicker('video')} 
            disabled={!!form.video} // Disable picker when a video is selected
          >
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
                  isLoading={undefined}                />
              </>
            ) : (
              <View className="w-full h-40 bg-white rounded-2xl justify-center items-center border-2 border-red-500">
                <View className="w-14 h-14 border border-dashed border-secondary justify-center items-center">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* THUMBNAIL PICKER */}
        <View className="mt-7 space-y-2">
          <Text className="text-base text-white font-pmedium">
            Thumbnail Image
          </Text>
          <TouchableOpacity 
            onPress={() => openPicker('image')} 
            disabled={!!form.thumbnail} // Disable picker when an image is selected
          >
            {form.thumbnail?.uri ? (
              <>
                <Image
                  source={{ uri: form.thumbnail.uri }}
                  resizeMode="cover"
                  style={{ width: '100%', height: 200, borderRadius: 20 }}
                />

                {/* Remove Thumbnail Button */}
                <CustomButton
                  title="Remove Thumbnail"
                  handlePress={removeImage}
                  containerStyles="mt-3 bg-red-500"
                  textStyles="text-base text-white font-pmedium" 
                  isLoading={undefined}                />
              </>
            ) : (
              <View className="w-full h-16 bg-white rounded-2xl justify-center items-center border-2 border-red-500 flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  className="w-5 h-5"
                />
                <Text className="text-sm text-secondary font-pmedium px-4">
                  Upload Thumbnail Image
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField
          otherStyles="mt-7"
          title="Sport"
          value={form.sport}
          placeholder="Insert Sport Here..."
          handleChangeText={(e: any) => setForm({ ...form, sport: e })}
        />

        <CustomButton
          title="Post Clip"
          handlePress={submit}
          containerStyles="mt-7"
          textStyles={undefined}
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Upload;
