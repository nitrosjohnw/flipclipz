import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs, Redirect } from 'expo-router'
import  icons  from '@/constants/icons'

const TabIcon = ({icon, color, name, focused}: {focused: boolean; icon: any; color: any; name: string;}) => {


    return(
        <View className='items-center justify-center gap-2'>
            <Image
            source={icon}
            resizeMode='contain'
            tintColor={color}
            className='w-6 h-6'
            />
<Text
  className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs w-12 items-center justify-center`} style={{color: color}}
>
  {name}
</Text> 


        </View>
    )
}

const TabsLayout = () => {
  return (
    <>
    <Tabs
        screenOptions={{
            tabBarShowLabel: false,
            tabBarActiveTintColor: '#ff8585',
            tabBarInactiveTintColor: '#ffffff',
            tabBarStyle:{
                backgroundColor: '#D2c5c5',
                borderTopWidth: 1,
                borderTopColor: '#D2c5c5',
                height: 84,
            }
        }}
    >
        <Tabs.Screen 
        name="home"
        options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon:({color, focused}) => (
                <TabIcon
                    icon={icons.home} 
                    focused={focused} 
                    color={color} 
                    name={'  Home'}                
                    />
            )
        }}
        />
                <Tabs.Screen 
        name="record"
        options={{
            title: 'Record',
            headerShown: false,
            tabBarIcon:({color, focused}) => (
                <TabIcon
                    icon={icons.film} 
                    focused={focused} 
                    color={color} 
                    name={'Record'}                
                    />
            )
        }}
        />
                <Tabs.Screen 
        name="edit"
        options={{
            title: 'Edit',
            headerShown: false,
            tabBarIcon:({color, focused}) => (
                <TabIcon
                    icon={icons.edit} 
                    focused={focused} 
                    color={color} 
                    name={'   Edit'}                
                    />
            )
        }}
        />
        
        <Tabs.Screen 
        name="upload"
        options={{
            title: 'Upload',
            headerShown: false,
            tabBarIcon:({color, focused}) => (
                <TabIcon
                    icon={icons.upload} 
                    focused={focused} 
                    color={color} 
                    name={' Upload'}                
                    />
            )
        }}
        />

                <Tabs.Screen 
        name="profile"
        options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon:({color, focused}) => (
                <TabIcon
                    icon={icons.profile} 
                    focused={focused} 
                    color={color} 
                    name={'  Profile'}                
                    />
            )
        }}
        />
    </Tabs>
    </>

  )
}

export default TabsLayout