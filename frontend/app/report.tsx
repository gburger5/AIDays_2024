import { Text, StyleSheet, View, Pressable, TextInput, Image, TouchableOpacity, Platform, Keyboard, ScrollView, Modal } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";

const FormData = global.FormData;

export default function ReportForm() {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [date, setDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [currentPicker, setCurrentPicker] = useState<'date' | 'time' | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const showPicker = (type: 'date' | 'time') => {
    setCurrentPicker(type);
    setShowModal(true);
  };

  const handleDateTimeChange = (event: any, selectedValue?: Date) => {
    if (selectedValue) {
      const newDate = new Date(date);
      
      if (currentPicker === 'date') {
        newDate.setFullYear(selectedValue.getFullYear());
        newDate.setMonth(selectedValue.getMonth());
        newDate.setDate(selectedValue.getDate());
      } else {
        newDate.setHours(selectedValue.getHours());
        newDate.setMinutes(selectedValue.getMinutes());
      }
      
      setDate(newDate);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    });
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    })();
  }, []);

  const sendToBackend = async () => {
    if (!description.trim()) {
      alert("Please provide a description before submitting.");
      return;
    }
    if (!image) {
      alert("Please capture an image before submitting.");
      return;
    }
    
    if (location) {
      console.log(`Latitude: ${location.latitude}, Longitude: ${location.longitude}`);
    } else {
      console.log("Location not available");
    }

    try {
      const formData: FormData = new FormData();
      formData.append("image", {
        uri: image,
        type: "image/png",
        name: "report-image",
      } as any);
      formData.append("description", description);
      formData.append("expiration", date.toISOString());
      formData.append("latitude", location?.latitude.toString() || '');
      formData.append("longitude", location?.longitude.toString() || '');
      console.log(formData);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios.post(
        "http://10.136.200.191:3000/api/image",
        formData,
        config
      );
      console.log(response)
      alert("Report successfully created!");

      router.back();
    } catch (error) {
      alert("Error submitting report. Please try again.");
    }
  };

  const captureImage = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera permissions to capture images.');
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      alert("Error capturing image. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Create Report</Text>
        </View>
        {isEditing && (
          <TouchableOpacity 
            onPress={() => {
              Keyboard.dismiss();
              setIsEditing(false);
            }}
            style={styles.doneButton}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        )}
      </View> */}

      {/* Content */}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Description Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            placeholder="Enter description here..."
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            multiline
            numberOfLines={4}
            placeholderTextColor="#999"
            returnKeyType="done"
            onFocus={() => setIsEditing(true)}
            blurOnSubmit={true}
          />
        </View>

        {/* DateTime Section */}
        <View style={styles.dateTimeContainer}>
          <Text style={styles.label}>Relevant Until *</Text>
          <View style={styles.dateTimeRow}>
            <TouchableOpacity 
              style={styles.dateTimeButton} 
              onPress={() => showPicker('date')}
            >
              <Text style={styles.dateTimeLabel}>Date</Text>
              <Text style={styles.dateTimeValue}>
                {date.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.dateTimeButton}
              onPress={() => showPicker('time')}
            >
              <Text style={styles.dateTimeLabel}>Time</Text>
              <Text style={styles.dateTimeValue}>
                {formatTime(date)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Image Section */}
        <View style={styles.imageSection}>
          <Text style={styles.label}>Attach Photo *</Text>
          {image ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.imagePreview} />
              <TouchableOpacity 
                style={styles.retakeButton}
                onPress={captureImage}
              >
                <Text style={styles.retakeButtonText}>Retake Photo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={captureImage} style={styles.imageButton}>
              <Text style={styles.imageButtonText}>Capture Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[
            styles.submitButton,
            (!description.trim() || !image) && styles.submitButtonDisabled
          ]}
          onPress={sendToBackend}
          disabled={!description.trim() || !image}
        >
          <Text style={styles.submitButtonText}>Submit Report</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* DateTime Picker Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Select {currentPicker === 'date' ? 'Date' : 'Time'}
              </Text>
              <TouchableOpacity 
                onPress={() => setShowModal(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>Done</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={date}
              mode={currentPicker}
              display="spinner"
              onChange={handleDateTimeChange}
              minimumDate={currentPicker === 'date' ? new Date() : undefined}
              textColor="#000"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: -50,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 20,
  },
  backButton: {
    padding: 8,
    width: 50,
    alignItems: 'flex-start',
  },
  backButtonText: {
    fontSize: 24,
    color: '#007AFF',
  },
  doneButton: {
    width: 50,
    alignItems: 'flex-end',
  },
  doneButtonText: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '500',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  dateTimeContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  dateTimeButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateTimeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dateTimeValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalCloseText: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '500',
  },
  imageSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  imageContainer: {
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  imageButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  retakeButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  retakeButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});