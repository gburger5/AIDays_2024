import { StyleSheet, View, Text, Image, Pressable, ViewStyle } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { MapPin, Camera } from 'lucide-react-native';

// Update props type to accept a simple navigation function
type WelcomeScreenProps = {
  navigation: (route: 'explore' | 'share') => void;
};

type NavButtonProps = {
  icon: React.ElementType;
  label: string;
  onPress: () => void;
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  const NavButton: React.FC<NavButtonProps> = ({ icon: Icon, label, onPress }) => {
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: withSpring(1) }],
      } as ViewStyle;
    });

    const handlePress = () => {
      animatedStyle.transform = [
        { 
          scale: withSequence(
            withSpring(0.9),
            withSpring(1.1),
            withSpring(1, {}, (finished) => {
              if (finished) {
                runOnJS(onPress)();
              }
            })
          ) 
        }
      ];
    };

    return (
      <AnimatedPressable
        style={[styles.navItem, animatedStyle]}
        onPress={handlePress}
      >
        <View style={styles.iconContainer}>
          <Icon size={24} color="white" />
        </View>
        <Text style={styles.navLabel}>{label}</Text>
      </AnimatedPressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>
          Rescue Radar
        </Text>
        
        <Text style={styles.subtitle}>
          Connecting communities during natural disasters
        </Text>

        <View style={styles.navigation}>
          <NavButton
            icon={MapPin}
            label="Explore"
            onPress={() => navigation('explore')}
          />
          <NavButton
            icon={Camera}
            label="Report"
            onPress={() => navigation('share')}
          />
        </View>

        <Text style={styles.description}>
          Discover and report critical support locations during emergencies. Your community's lifeline in times of need.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2B8A8C',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 40,
    textAlign: 'center',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginVertical: 40,
  },
  navItem: {
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
});

export default WelcomeScreen;