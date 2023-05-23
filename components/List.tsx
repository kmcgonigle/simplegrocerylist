import React, { useEffect, useState, useRef } from 'react';
import { SectionList, Text, View, Button, Platform, Pressable } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import SvgCircleXMark from '../assets/icons/SvgCircleXMark';
//@ts-ignore
import styles from '../App.scss';
import { sampleData as data } from '../data/sampleJSON'; // TODO switch out for storage/Dropbox data

// On web, ensures that authentication is completed properly
WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://www.dropbox.com/oauth2/authorize',
  tokenEndpoint: 'https://www.dropbox.com/oauth2/token',
};

const useProxy = Platform.select({ web: false, default: true });

type AisleProps = { title: string };
const Aisle = ({ title }: AisleProps) => (
  <View style={styles.aisle}>
    <Text style={styles.aisle__text}>{title}</Text>
  </View>
);

const List = () => {
  const [auth, setAuth] = useState(false);
  const [groceryList, setGroceryList] = useState(data?.list || []);
  const itemRefs: { [index: string]: any } = useRef([]);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: 'ivolaw89oje30gn',
      scopes: [],
      usePKCE: true,
      redirectUri: makeRedirectUri({
        native: 'simplegrocerylist://redirect',
        useProxy,
      }),
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      return setAuth(true);
    }
  }, [response]);

  const handleRemoveAisle = (aisleIndex: number) => {
    const tempListData = [...groceryList];
    tempListData.splice(aisleIndex, 1);

    return setGroceryList(tempListData);
  };

  const handleRemoveItem = (sectionTitle: string, item: string, itemIndex: number) => {
    // Find which aisle the item is being removed from
    const aisleIndex = groceryList.findIndex((aisleName) => aisleName.title === sectionTitle);
    if (aisleIndex === -1) {
      console.error('Error: cannot find aisle containing item to be removed.');
      return false;
    }

    // TODO set up Expo animation; animation works on web build but not Android:
    // Animate removed element fade out
    // let fadeOutItem = setInterval(
    //   () => (itemRefs.current[`${sectionTitle}-${item}`].style.opacity -= 0.1),
    //   25
    // );

    // setTimeout(() => {
    // clearInterval(fadeOutItem);

    // Update State data
    const tempListData = [...groceryList];
    const tempAisleData = [...groceryList[aisleIndex].data];
    tempAisleData.splice(itemIndex, 1); // Remove clicked item from aisle
    tempListData[aisleIndex].data = tempAisleData; // Replace aisle data

    // If item is the last in an aisle, remove the aisle
    if (tempAisleData.length === 0) {
      return handleRemoveAisle(aisleIndex);
    }

    // Otherwise, just update the groceryList dataset
    return setGroceryList(tempListData);
    // }, 300);
  };

  const handleSync = () => {
    return true;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header__main}>Simple Grocery List</Text>

      {!auth && (
        <Button
          disabled={!request}
          onPress={() => promptAsync({ useProxy })}
          title="Authenticate with Dropbox"
        />
      )}

      {auth && <Button onPress={handleSync} title="Sync" />}

      <View style={styles.buttonsWrapper}>
        {/* TODO */}
        <Button title="Add Item" />
        <Button title="Add Aisle" />
      </View>

      {groceryList.length > 0 && (
        <SectionList
          sections={groceryList}
          renderItem={({ item, section, index }) => (
            <View
              style={styles.item}
              ref={(el) => (itemRefs.current[`${section.title}-${item}`] = el)}
            >
              <Text style={styles.item__text}>{item}</Text>
              <Pressable
                style={styles.removeItem}
                onPress={() => handleRemoveItem(section.title, item, index)}
              >
                <SvgCircleXMark fill="#cd1919" width={20} height={20} />
              </Pressable>
            </View>
          )}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderSectionHeader={({ section: { title } }) => <Aisle title={title} key={title} />}
          stickyHeaderIndices={[0]}
          stickySectionHeadersEnabled
          style={styles.list}
        />
      )}
    </View>
  );
};

export default List;
