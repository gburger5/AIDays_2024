import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";


// for now, all this component does is save an image and display it in the image block.
// The next goal is to make it so when the image is taken, it can be reflected on the map as a pin
// when that pin is clicked, this image would show up

interface ImageCaptureProps {
  onButtonPress: () => Promise<void>;
  uri: string
}

const ImageCapture = ({ onButtonPress, uri }: ImageCaptureProps) => {
  return (
    <View style={styles.container}>
      <Text>This component just allows a user to take a picture.</Text>
      <Image
        source={{ uri }}
        style={styles.image}
      />
      <TouchableOpacity style={styles.editButton} onPress={onButtonPress}>
        <MaterialCommunityIcons
          name="camera-outline"
          size={30}
          color={"#ffffff"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ImageCapture;

const styles = StyleSheet.create({
  image: {
    borderRadius: 75,
    width: 150,
    height: 150,
    borderWidth: 5,
    borderColor: "#C0C0C0",
    marginTop: 10,
    marginBottom: 20
  },

  editButton: {
    backgroundColor: "#C0C0C0",
    borderRadius: 24,
    padding: 8,
  },

  container: {
    alignItems: "center",
    position: "relative"
  }
});
