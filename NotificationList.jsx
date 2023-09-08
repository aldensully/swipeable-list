import { View } from 'react-native';
import { useEffect, useState } from 'react';
import {  ScrollView } from 'react-native-gesture-handler';


const NotificationList = () => {
  const [notifications, setNotifications] = useState(null);

  useEffect(()=>{
    getNotifications()
  },[])

  async function getNotifications() {
    //fetch notifications and set notifications or just use react-query instead
  }

  const removeNotification = async (id) => {
    //delete notification item after delay to wait for animation to finish
      setTimeout(() => {
        setNotifications(notis => notis.filter(noti =>noti.id !== id))
      }, 500);
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
        }}
      >
        {notifications?.map(noti => (
            <NotificationPreview notification={noti} key={noti.id} removeNotification={removeNotification} />
        ))}
      </ScrollView>
    </View>
  );
};

export default NotificationList;