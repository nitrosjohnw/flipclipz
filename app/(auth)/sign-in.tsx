import { View, Text, ScrollView, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '@/constants/icons';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import { Link, router } from 'expo-router';
import { getCurrentUser, signIn } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';

const SignIn = () => {
    const { setUser, setIsLoggedIn } = useGlobalContext() 

    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = async () => {
      if (!form.email || !form.password) {
          Alert.alert('Error', 'Please fill in all fields');

      }
  
      setIsSubmitting(true);
  
      try {
          await signIn(form.email, form.password);
          const result = await getCurrentUser();
          setUser(result);
          setIsLoggedIn(true);
          router.replace('/(tabs)/home');
      } catch (error: unknown) {
          // Type narrow the error object
          if (error instanceof Error) {
              console.error('Sign-in Error:', error);
              Alert.alert('Error', error.message || 'An unexpected error occurred during sign-in.');
          } else {
              console.error('An unexpected error occurred:', error);
              Alert.alert('Error', 'An unknown error occurred during sign-in.');
          }
      } finally {
          setIsSubmitting(false);
      }
  };
  
  


    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView>
                <View className="w-full justify-center min-h-[85vh] px-4 my-6">
                    <Image
                        source={icons.logo}
                        className="w-[130px] h-[84px]"
                        resizeMode="contain"
                    />
                    <Text className="text-3xl text-white font-semibold mt-10">
                        Log in to FlipClipz
                    </Text>
                    <FormField
                        title="Email"
                        value={form.email}
                        handleChangeText={(e:string) => setForm({ ...form, email: e })}
                        otherStyles="mt-7"
                        placeholder="Enter your email"
                    />
                    <FormField
                        title="Password"
                        value={form.password}
                        handleChangeText={(e:string) => setForm({ ...form, password: e })}
                        otherStyles="mt-7"
                        placeholder="Enter your password"
                    />
                    <CustomButton
                        title="Sign In"
                        handlePress={submit}
                        containerStyles="mt-7"
                        textStyles={undefined}
                        isLoading={isSubmitting}
                    />
                    <View className="justify-center pt-5 flex-row gap-2">
                        <Text className="text-white text-lg">Don't have an account?</Text>
                        <Link href="/(auth)/sign-up" className="text-lg font-semibold text-secondary">
                            Sign Up
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignIn;
