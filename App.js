import { StatusBar } from "expo-status-bar";
import { StyleSheet, Button, View, Alert, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Exponent_Push_Token } from "@env";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowAlert: true,
    };
  },
});

export default function App() {
  useEffect(() => {
    //// START: NOTIFICATION PERMISSIONS FOR IOS ////
    const configurePushNotifications = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;

      if (finalStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert(
          "Permission required",
          "Push Notification needs the appropriate permissions."
        );
        return;
      }

      const pushTokenData = await Notifications.getExpoPushTokenAsync();
      console.log(pushTokenData);

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    };
    configurePushNotifications();
  }, []);

  useEffect(() => {
    const subscription1 = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("NOTIFICATION RECEIVED!");
        // const userName = notification.request.content.data.userName;
        // console.log(userName);
      }
    );

    const subscription2 = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("NOTIFICATION RESPONSE RECEIVED!");
        // // console.log(response);
        // const userName = response.notification.request.content.data.userName;
        // console.log(userName);
      }
    );

    return () => {
      subscription1.remove();
      subscription2.remove();
    };
  }, []);

  const scheduleNotificationHandler = async () => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Congratulations Timi",
        body: "Your Visa has been approved",
        data: { userName: "Harrytimbog" },
      },
      trigger: {
        seconds: 2,
      },
    });
  };

  const sendPushNotificationHandler = () => {
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: Exponent_Push_Token,
        title: "Congratulations Timi",
        body: "Your have been offered the role of full stack developer",
      }),
    });
  };

  return (
    <View style={styles.container}>
      <Button
        title="Schedule Notification"
        onPress={scheduleNotificationHandler}
      />

      <Button
        title="Send Push Notification"
        onPress={sendPushNotificationHandler}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
