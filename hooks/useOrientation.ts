import { ORIENTATION, ORIENTATION_NUMBER } from '@/constants/orientation';
import * as ScreenOrientation from 'expo-screen-orientation';
import {useEffect, useState } from 'react';

const useOrientation = () => {
    const [screenOrientation, setScreenOrientation] = useState(
        ScreenOrientation.Orientation.PORTRAIT_UP
    );

    useEffect(() => {

        const onOrientationChange = (currentOrientation) => {
            const orientationValue = currentOrientation.orientationInfo.orientation;
            setScreenOrientation(orientationValue);
        };

        const initScreenOrientation = async () => {
            const currentOrientation = await ScreenOrientation.getOrientationAsync();
            setScreenOrientation(currentOrientation);
        };

        initScreenOrientation();

        const screenOrientationListener = 
        ScreenOrientation.addOrientationChangeListener(onOrientationChange);

        return () => {
            ScreenOrientation.removeOrientationChangeListeners(screenOrientationListener)
        }
    }, []);

    return ORIENTATION_NUMBER[screenOrientation];
};

export default useOrientation;

