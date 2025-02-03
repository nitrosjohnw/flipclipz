import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import  icons  from '@/constants/icons'
import { router, usePathname } from 'expo-router';

const SearchInput = ({title, value, placeholder , handleChangeText, otherStyles,initialQuery ,...props}: {initialQuery:any,otherStyles:any;handleChangeText:any; title: string; value: any; placeholder: string;}) => {
    const pathname = usePathname();
  
    const [query, setQuery] = useState(initialQuery || '')
  
    return (
  
        <View className='border-2 border-secondary w-full h-16 px-4 bg-white rounded-2xl focus:border-secondary items-center flex-row space-x-4'>
          <TextInput
            className='text-base mt-0.5 text-secondary flex-1 font-pregular'
            value={query}
            placeholder='Search for a video topic'
            placeholderTextColor="red"
            onChangeText={(e) => setQuery(e)}
          />
          <TouchableOpacity onPress={() => {
            if(!query){
              return Alert.alert('missing Query', "Please input something to the search bar")
            }
            if(pathname.startsWith('/search'))router.setParams({query})
              else router.push(`/search/${query}`)
          }}
          >
              <Image
              source={icons.search}
              className='w-5 h-5'
              resizeMode='contain'
              />
          </TouchableOpacity>
        </View>
    );
  };
  
  export default SearchInput; 