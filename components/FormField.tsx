import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import  icons  from '@/constants/icons'

const FormField = ({title, value, placeholder , handleChangeText, otherStyles, ...props}: {otherStyles:any;handleChangeText:any; title: string; value: any; placeholder: string;}) => {
    const [showPassword, setShowPassword] = useState(false)
  return (
    <View className= {`space-y-2 ${otherStyles}`}>
      <Text className='text-base text-white font-pmedium'>{title}</Text>
      <View className='border-2 border-red-500 w-full h-16 px-4 bg-white rounded-2xl focus:border-secondary items-center flex-row'>
        <TextInput className='flex-1 text-secondary font-psemibold text-base'
        value={value}
        placeholder={placeholder}
        placeholderTextColor='#e22020'
        onChangeText={handleChangeText}
        secureTextEntry={title === 'Password' && !showPassword}
        />
        {title === 'Password' && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image source={!showPassword ? icons.eye : icons.eyeHide} 
            className='w-6 h-6'
            resizeMode='contain'
            />
            </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField