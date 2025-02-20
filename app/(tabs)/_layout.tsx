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
            tabBarActiveTintColor: '#e22020',
            tabBarInactiveTintColor: '#ffffff',
            tabBarStyle:{
                backgroundColor: '#040404',
                borderTopWidth: 1,
                borderTopColor: '#040404',
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
        name="social"
        options={{
            title: 'Social',
            headerShown: false,
            tabBarIcon:({color, focused}) => (
                <TabIcon
                    icon={icons.social} 
                    focused={focused} 
                    color={color} 
                    name={'  Social'}                
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