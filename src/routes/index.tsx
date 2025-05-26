import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../../app/(tabs)/b-courses';
import Curso01 from '@/app/courses/e-curso-01';
import Curso02 from '@/app/courses/e-curso-02';
import Curso03 from '@/app/courses/e-curso-03'; 

const Stack = createNativeStackNavigator();

function ContainerRoute() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Home'>
                <Stack.Screen name="Curso01" component={Curso01} />
                <Stack.Screen name="Curso02" component={Curso02} />
                <Stack.Screen name="Curso03" component={Curso03} />

            </Stack.Navigator>
        </NavigationContainer>
        )
}

export default ContainerRoute;