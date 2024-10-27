import { useRouter } from 'expo-router';
import WelcomeScreen from './components/WelcomeScreen';

export default function Welcome() {
  const router = useRouter();

  // Update the navigation handling to use Expo Router
  const handleNavigation = (route: 'explore' | 'share') => {
    if (route === 'explore') {
      router.push('/home');
    } else {
      router.push('/report');
    }
  };

  return <WelcomeScreen navigation={handleNavigation} />;
}