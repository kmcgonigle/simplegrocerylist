import React, { useEffect, useState } from 'react';
import { SectionList, Text, View, Button, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
//@ts-ignore
import styles from '../App.scss';
import { sampleData as data } from '../data/sampleJSON';

// On web, ensures that authentication is completed properly
WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://www.dropbox.com/oauth2/authorize',
  tokenEndpoint: 'https://www.dropbox.com/oauth2/token',
};

const useProxy = Platform.select({ web: false, default: true });

type HeaderProps = { title: string };
type ItemProps = { title: string };

const Header = ({ title }: HeaderProps) => (
  <View style={styles.header}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const Item = ({ title }: ItemProps) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const List = () => {
  const [auth, setAuth] = useState(false);

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

  const handleSync = () => {
    return true;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Simple Grocery List</Text>

      {!auth && (
        <Button
          disabled={!request}
          onPress={() => promptAsync({ useProxy })}
          title="Authenticate with Dropbox"
        />
      )}

      {auth && <Button onPress={handleSync} title="Sync" />}

      {data?.list?.length > 0 && (
        <SectionList
          sections={data.list}
          renderItem={({ item }) => <Item title={item} />}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderSectionHeader={({ section: { title } }) => <Header title={title} key={title} />}
          stickyHeaderIndices={[0]}
        />
      )}
    </View>
  );
};

export default List;
