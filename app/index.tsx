// Index.js
import { Link } from "expo-router";
import { Image, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import  icons  from '@/constants/icons'
import CustomButton from "@/components/CustomButton";
import { Redirect, router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";

export default function Index() {
  const { isLoading, isLoggedIn } = useGlobalContext();

  if (!isLoading && isLoggedIn) return <Redirect href="/home" />;

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: '100%'}}>
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
          <Image
            source={icons.logo}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          />
          <Image
          source={icons.cards}
          className="max-w-[380px] h-[300px]"
          resizeMode="contain"
          />
          <View className="relative mt-5">
            <Text className="text-3xl font-bold text-white text-center">
              Film and Share Seamlessly Today with {' '}
              <Text className="text-secondary">FlipClipz</Text>
            </Text>
            <Text className="text-xl font-pregular text-white mt-7 text-center">
              Express yourself freely and capture your clipz with ease here on FlipClipz
            </Text>
            <CustomButton
              title="Continue with Email"
              handlePress={() => router.push('/(auth)/sign-in') }
              containerStyles="mt-7" 
              textStyles={undefined} 
              isLoading={undefined}            
              />
          </View>

        </View>

      </ScrollView>
      <StatusBar backgroundColor='#040404'/>
    </SafeAreaView>
  );
}
