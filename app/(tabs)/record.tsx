import {
  CameraMode,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState, useEffect } from "react";
import { Button, Pressable, StyleSheet, Text, View, Alert } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Image } from "expo-image";
import { AntDesign, Feather, FontAwesome6 } from "@expo/vector-icons";

const Record = () => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const cameraRef = useRef(null);
  const [uri, setUri] = useState(null);
  const [mode, setMode] = useState("picture");
  const [facing, setFacing] = useState("back");
  const [recording, setRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingTimer = useRef(null);

  useEffect(() => {
    // Request both permissions on mount
    if (!cameraPermission?.granted) requestCameraPermission();
    if (!mediaPermission?.granted) requestMediaPermission();
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup recording timer on unmount
      if (recordingTimer.current) clearInterval(recordingTimer.current);
    };
  }, []);

  const startRecordingTimer = () => {
    setRecordingDuration(0);
    recordingTimer.current = setInterval(() => {
      setRecordingDuration((prev) => prev + 1);
    }, 1000);
  };

  const stopRecordingTimer = () => {
    if (recordingTimer.current) {
      clearInterval(recordingTimer.current);
      recordingTimer.current = null;
    }
  };

  const takePicture = async () => {
    try {
      const photo = await cameraRef.current?.takePictureAsync();
      if (photo?.uri) {
        setUri(photo.uri);
        await saveToLibrary(photo.uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take picture");
    }
  };

  const toggleRecording = async () => {
    if (!cameraRef.current) return;
    try {
      if (recording) {
        setRecording(false);
        stopRecordingTimer();
        const video = await cameraRef.current.stopRecording();
        if (video?.uri) await saveToLibrary(video.uri);
      } else {
        setRecording(true);
        startRecordingTimer();
        // Pass { mute: false } to record audio with the video.
        const video = await cameraRef.current.recordAsync({ mute: false });
        if (video?.uri) await saveToLibrary(video.uri);
      }
    } catch (error) {
      Alert.alert("Error", "Recording failed");
      setRecording(false);
      stopRecordingTimer();
    }
  };

  const saveToLibrary = async (mediaUri) => {
    try {
      if (!mediaPermission?.granted) {
        const { granted } = await requestMediaPermission();
        if (!granted) return;
      }
      await MediaLibrary.saveToLibraryAsync(mediaUri);
      Alert.alert("Saved!", "Media saved to gallery");
    } catch (error) {
      Alert.alert("Error", "Could not save media");
    }
  };

  const toggleMode = () =>
    setMode((prev) => (prev === "picture" ? "video" : "picture"));
  const toggleFacing = () =>
    setFacing((prev) => (prev === "back" ? "front" : "back"));

  const renderControls = () => (
    <View style={styles.controlsContainer}>
      <Pressable onPress={toggleMode} style={styles.modeButton}>
        {mode === "picture" ? (
          <AntDesign name="picture" size={28} color="white" />
        ) : (
          <Feather name="video" size={28} color="white" />
        )}
      </Pressable>

      <Pressable
        onPress={mode === "picture" ? takePicture : toggleRecording}
        style={styles.shutterButton}
      >
        <View
          style={[
            styles.shutterInner,
            mode === "video" && {
              backgroundColor: recording ? "red" : "#ffffff80",
            },
            recording && styles.recordingShutter,
          ]}
        />
      </Pressable>

      <Pressable onPress={toggleFacing} style={styles.flipButton}>
        <FontAwesome6 name="rotate-left" size={28} color="white" />
      </Pressable>
    </View>
  );

  if (!cameraPermission?.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text>Camera permission required</Text>
        <Button title="Allow Camera Access" onPress={requestCameraPermission} />
      </View>
    );
  }

  if (!mediaPermission?.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text>Gallery access required</Text>
        <Button title="Allow Gallery Access" onPress={requestMediaPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {uri ? (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri }}
            style={styles.previewImage}
            contentFit="contain"
          />
          <Button title="Retake" onPress={() => setUri(null)} color="#000" />
        </View>
      ) : (
        <CameraView
          style={styles.camera}
          ref={cameraRef}
          mode={mode}
          facing={facing}
          mute={false} // Ensure audio is enabled in the preview component.
        >
          {mode === "video" && recording && (
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>
                {Math.floor(recordingDuration / 60)
                  .toString()
                  .padStart(2, "0")}
                :
                {(recordingDuration % 60).toString().padStart(2, "0")}
              </Text>
            </View>
          )}
          {renderControls()}
        </CameraView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  previewImage: {
    width: "90%",
    aspectRatio: 3 / 4,
    marginBottom: 20,
  },
  controlsContainer: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  shutterButton: {
    borderWidth: 4,
    borderColor: "white",
    borderRadius: 50,
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  shutterInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "white",
  },
  recordingShutter: {
    borderRadius: 8,
  },
  timerContainer: {
    position: "absolute",
    top: 40,
    alignSelf: "center",
    backgroundColor: "#00000080",
    padding: 10,
    borderRadius: 5,
  },
  timerText: {
    color: "white",
    fontSize: 18,
  },
  modeButton: {
    padding: 15,
  },
  flipButton: {
    padding: 15,
  },
});

export default Record;
