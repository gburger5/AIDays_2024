import { Text, View } from "react-native";
import ImageCapture from "@/components/ImageCapture";
import * as ImagePicker from "expo-image-picker"
import { useState } from "react";
import axios from "axios";

// This line is needed in order to upload an image to the backend
const FormData = global.FormData

export default function Index() {
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

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Hola! This is the beginning of the project.</Text>

      {/* To use the image capture module, import it like this */}
      {/* There may be a warning saying source.uri should not be empty. I was too lazy to fix it, but it doesn't break anything. */}
      {/* You can move the functions i commented above to be more modular. */}
      <ImageCapture onButtonPress={uploadImage} uri={image} ></ImageCapture>
    </View>
  );
}
