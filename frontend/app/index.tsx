import { useRouter } from 'expo-router';
import WelcomeScreen from './components/WelcomeScreen';

export default function Welcome() {
  const router = useRouter();

  const handleNavigation = (route: 'explore' | 'share') => {
    switch (route) {
      case 'explore':
        router.push('/home');
        break;
      case 'share':
        router.push('/report');
        break;
    }
  };

  return <WelcomeScreen navigation={handleNavigation} />;
}