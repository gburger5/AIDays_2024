import { Text, StyleSheet, View, Pressable, TouchableOpacity, Image } from "react-native";
import ImageCapture from "@/components/ImageCapture";
import * as ImagePicker from "expo-image-picker"
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import MapView, { Callout, Marker, PROVIDER_GOOGLE, Region, PROVIDER_DEFAULT} from 'react-native-maps';
import { useNavigation, useRouter } from "expo-router";
import { markers } from "../assets/dummyMarkers";

// This line is needed in order to upload an image to the backend
const FormData = global.FormData

export default function Index() {
  const router = useRouter();
  const mapRef = useRef<any>(null);
  const navigation = useNavigation();

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
  }, []);

  const focusMap = () => {
    mapRef.current?.animateToRegion({
      latitude: 29.6516,
      longitude: -82.3248,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  }

  // first load, can also use on reload
  const loadMarkers = async () => {
    try {
      const response = await axios.get("http://10.136.200.191:3000/api/images/34287")
      const markerstwo = response.data.images.map((image) => ({
        id: image._id,
        createdAt: image.createdAt,
        description: image.description,
        endDate: image.endDate,
        imageUrl: image.imageUrl,
        zipCode: image.zipCode,
      }));

      console.log(markerstwo);
    } catch (error) {
      alert(error)
    }
  }

  loadMarkers()

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
        initialRegion={{
          latitude: 29.6516,
          longitude: -82.3248,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        ref={mapRef}
        onRegionChangeComplete={(region) => console.log(region)}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
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
            position: 'absolute',
            right: 20,
            bottom: 20,
            marginTop: 20,
          }}
          onPress={() => router.push("/report")}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>Create Report</Text>
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
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  contentContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
    padding: 20,
  }
});