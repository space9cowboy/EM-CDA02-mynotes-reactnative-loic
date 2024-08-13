// useDeviceType.ts
import { useMediaQuery } from 'react-responsive';
import '@expo/match-media';

export const useDeviceType = () => {
  const isTabletOrMobileDevice = useMediaQuery({ minDeviceWidth: 768 });
  const isTablet = useMediaQuery({ minDeviceWidth: 768, maxDeviceWidth: 1224 });

  return { isTabletOrMobileDevice, isTablet };
  
};
