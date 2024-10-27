import { Text, StyleSheet, View, Pressable, TouchableOpacity, Image, Dimensions } from "react-native";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import MapView, { Callout, Marker, Region } from 'react-native-maps';
import { useNavigation, useRouter } from "expo-router";
import * as Location from "expo-location";

type CoordImage = {
  _id: string;
  createdAt: string;
  description: string;
  endDate: string;
  imageUrl: string;
  zipCode: string;
  latitude: number;
  longitude: number;
};

interface CustomCalloutProps {
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

const CustomCallout: React.FC<CustomCalloutProps> = ({ 
  title, 
  description, 
  imageUrl,
  createdAt 
}) => (
  <View style={styles.calloutContainer}>
    {imageUrl && (
      <Image 
        source={{ uri: imageUrl }} 
        style={styles.calloutImage}
        resizeMode="cover"
      />
    )}
    <View style={styles.calloutTextContainer}>
      <Text style={styles.calloutTitle}>{title}</Text>
      <Text style={styles.calloutDescription}>{description}</Text>
      <Text style={styles.calloutDate}>
        Posted: {new Date(createdAt).toLocaleDateString()}
      </Text>
    </View>
  </View>
);

export default function Index() {
  const router = useRouter();
  const [location, setLocation] = useState<Region>({
    latitude: 29.6516,
    longitude: -82.3248,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const mapRef = useRef<MapView | null>(null);
  const navigation = useNavigation();
  const [markers, setMarkers] = useState<CoordImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMarkers = async () => {
      try {
        const response = await axios.get<{ images: CoordImage[] }>(
          "http://10.136.200.191:3000/api/images/34287"
        );
        setMarkers(response.data.images);
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        } else {
          alert('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    loadMarkers();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={focusMap}>
          <View style={{ padding: 10 }}>
            <Text>Focus</Text>
          </View>
        </TouchableOpacity>
      )
    });
  }, [location, navigation]);

  const focusMap = () => {
    if (mapRef.current && location) {
      mapRef.current.animateToRegion(location);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={location}
        showsUserLocation
        showsMyLocationButton
        ref={mapRef}
      >
        {markers.map((marker) => (
          <Marker
            key={marker._id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude
            }}
            pinColor="#007AFF"
          >
            <Callout tooltip>
              <CustomCallout
                title={marker.title}
                description={marker.description}
                imageUrl={marker.imageUrl}
                createdAt={marker.createdAt}
              />
            </Callout>
          </Marker>
        ))}

      </MapView>

        <View style={styles.contentContainer}>
          <Pressable
            style={{
              backgroundColor: "#007AFF",
              padding: 15,
              borderRadius: 10,
              position: "absolute",
              right: 20,
              bottom: 20,
              marginTop: 20,
              zIndex: 1,
              elevation: 5,
            }}
            onPress={() => router.push("/report")}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
              Create Report
            </Text>
          </Pressable>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  calloutContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: Dimensions.get('window').width * 0.7,
    maxWidth: 300,
    padding: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  calloutTextContainer: {
    padding: 12,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#007AFF',
  },
  calloutDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  calloutDate: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
    padding: 20,
  }
});