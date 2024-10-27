import {
  Text,
  StyleSheet,
  View,
  Pressable,
  TouchableOpacity,
  Image,
} from "react-native";
import ImageCapture from "@/components/ImageCapture";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import MapView, {
  Callout,
  Marker,
  PROVIDER_GOOGLE,
  Region,
  PROVIDER_DEFAULT,
} from "react-native-maps";
import { useNavigation, useRouter } from "expo-router";
import * as Location from "expo-location";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

// This line is needed in order to upload an image to the backend
const FormData = global.FormData;

export default function Index() {
  const router = useRouter();
  const mapRef = useRef<any>(null);
  const navigation = useNavigation();
  const [location, setLocation] = useState();
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const loadMarkers = async () => {
      try {
        const response = await axios.get(
          "http://10.136.200.191:3000/api/images/34287"
        );
        const loadedMarkers = response.data.images.map((image) => ({
          id: image._id,
          createdAt: image.createdAt,
          description: image.description,
          endDate: image.endDate,
          imageUrl: image.imageUrl,
          zipCode: image.zipCode,
          latitude: image.latitude,
          longitude: image.longitude,
        }));

        setMarkers(loadedMarkers);
      } catch (error) {
        alert(error);
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

      let { coords } = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
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
      ),
    });
  }, [location]);

  const focusMap = () => {
    if (location) {
      mapRef.current?.animateToRegion(location);
    } else {
      mapRef.current?.animateToRegion({
        latitude: 29.6516,
        longitude: -82.3248,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MapView
        style={styles.map}
        initialRegion={location}
        showsUserLocation
        showsMyLocationButton
        ref={mapRef}
        onRegionChangeComplete={(region) => console.log(region)}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.name}
          >
            <Callout>
              <Text>{marker.name}</Text>
              <Text>{marker.description}</Text>
              {marker.photos.map((photo, index) => (
                <Image
                  key={index}
                  source={{ uri: photo }}
                  style={{ width: 100, height: 100, marginVertical: 5 }}
                />
              ))}
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.contentContainer}>
        {/* Report Button */}
        <Pressable
          style={{
            backgroundColor: "#007AFF",
            padding: 15,
            borderRadius: 10,
            // alignItems: "center",
            position: "absolute",
            right: 20,
            bottom: 20,
            marginTop: 20,
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
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  contentContainer: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
    padding: 20,
  },
});
