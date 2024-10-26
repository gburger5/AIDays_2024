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
  const [image, setImage] = useState('')

  // this is a skeleton function that sends the image to the backend
  const sendToBackend = async () => {
    try {
      const formData: FormData = new FormData();

      formData.append("image", {
        uri: image,
        type: "image/png",
        name: "map-image",
      } as any)

      const config = {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        transformRequest: () => {
          return formData
        }
      }

      // when api is specified uncomment this line
      // await axios.post("http://api-url-goes-here", formData, config)
      alert("success")
    } catch (error) {
      
    }
  }

  // this just saves the image uri to useState hook
  const saveImage = async (image: string) => {
    try {
      setImage(image)

      // make api call to backend
    } catch (error) {
      throw error; 
    }
  }

  // for now, this takes a picture and saves uri to image
  const uploadImage = async () => {
    try {
      // get user permission to use camera first
      await ImagePicker.requestCameraPermissionsAsync();

      // if successful, launch the BACK camera
      let result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.back,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1
      })

      if (!result.canceled) {
        // this is just a string that represents the path to the saved image file (called uri)
        await saveImage(result.assets[0].uri);
      }

    } catch (error) {
      if (error instanceof Error) {
        alert("Error uploading image: " + error.message);
      } else {
        alert("Error uploading image");
      }
    }
  }

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
        provider={PROVIDER_DEFAULT}
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
        {/* <Text>Hola! This is the beginning of the project.</Text> */}

        {/* Image Capture Component */}
        {/* <ImageCapture onButtonPress={uploadImage} uri={image} /> */}

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