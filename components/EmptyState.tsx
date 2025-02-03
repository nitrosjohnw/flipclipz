import { View, Text, Image } from 'react-native'
import React from 'react'

import  icons  from '@/constants/icons'
import CustomButton from './CustomButton'
import { router } from 'expo-router'

const EmptyState = ({title, subtitle}:{title:string,subtitle:string}) => {
  return (
    <View className='justify-center items-center px-4'>
      <Image
        source={icons.search}
        className='w-[270px] h-[215px]'
        resizeMode='contain'
      />
        <Text className='text-3xl text-center font-psemibold text-white mt-2'>
        {title}
        </Text>
        <Text className='font-pmedium text-xl text-white'>
        {subtitle}
        </Text>
        <CustomButton
              title="Create Video" 
              handlePress={() => router.push('/(tabs)/upload')} 
              containerStyles='w-full my-5'
              textStyles={undefined} 
              isLoading={undefined}        
        />

    </View>
  )
}

export default EmptyState