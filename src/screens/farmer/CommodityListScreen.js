import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  FlatList,
  Image,
  Modal,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import groupBy from 'json-groupby';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  FIND_COMMODITY_BY_FARM_ID,
  FIND_ALL_COMMODITY,
} from '../../graphql/Queries';
import { CREATE_NEW_MARKET } from '../../graphql/Mutations';
import Spinner from '../../components/Spinner';

const CommodityListScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();
  const [skip, setSkip] = useState();
  const [groupedResult, setGroupedResult] = useState();
  const [dataResult, setDataResult] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const Item = ({ result }) => (
    <View style={styles.resultContainer}>
      <View style={styles.categoryContainer}>
        <Image
          style={styles.categoryImage}
          source={
            result.title === 'Telur'
              ? require('../../assets/Komoditas_Telur.png')
              : result.title === 'Susu'
              ? require('../../assets/Komoditas_Susu.jpg')
              : {
                  uri: `https://api.adorable.io/avatars/${result.title}`,
                }
          }
        />
        <View style={styles.categoryTextContainer}>
          <Text style={styles.categoryTextName}>Kelompok {result.title}</Text>
          <Text style={styles.categoryTextTotal}>
            Ada {result.data.length} komoditas terkait
          </Text>
        </View>
      </View>
      <FlatList
        data={result.data}
        renderItem={({ item }) => (
          <View>
            <View style={styles.commodityContainer}>
              <Image
                style={styles.commodityImage}
                source={
                  result.title === 'Telur'
                    ? require('../../assets/Komoditas_Telur.png')
                    : result.title === 'Susu'
                    ? require('../../assets/Komoditas_Susu.jpg')
                    : {
                        uri: `https://api.adorable.io/avatars/${result.title}`,
                      }
                }
              />
              <View style={styles.categoryTextContainer}>
                <Text style={styles.categoryTextName}>{item.name}</Text>
                <Text style={styles.commodityTextPrice}>
                  harga terbaru Rp ***,- /kg
                </Text>
              </View>
            </View>
            {user.commodity ? (
              item.id === user.commodity[0].id ? (
                <TouchableHighlight
                  style={styles.stopButton}
                  underlayColor="#FFBA4933"
                  onPress={() => setModalVisible(true)}>
                  <Text style={styles.stopButtonText}>Berhenti Mengelola</Text>
                </TouchableHighlight>
              ) : (
                <TouchableHighlight
                  style={styles.kelolaButton}
                  underlayColor="#FFBA49CC"
                  onPress={() => console.log('Dummy')}>
                  <Text style={styles.kelolaButtonText}>Kelola Komoditas</Text>
                </TouchableHighlight>
              )
            ) : (
              <TouchableHighlight
                style={styles.kelolaButton}
                underlayColor="#FFBA49CC"
                onPress={() => onSelectCommodity(item.id)}>
                <Text style={styles.kelolaButtonText}>Kelola Komoditas</Text>
              </TouchableHighlight>
            )}
          </View>
        )}
        keyExtractor={(data) => data.id}
      />
    </View>
  );

  const readUserDataFromStorage = async () => {
    let item = await AsyncStorage.getItem('user');
    item = JSON.parse(item);
    setUser(item);
  };

  const mergeUserData = async (value) => {
    try {
      await AsyncStorage.mergeItem('user', JSON.stringify(value));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    readUserDataFromStorage();
    getAllCommodity({ variables: { page: 1 } });
  }, []);

  // Cari komoditas berdasarkan id peternakan
  const [getCommodity] = useLazyQuery(FIND_COMMODITY_BY_FARM_ID, {
    errorPolicy: 'ignore',
    fetchPolicy: 'network-only',
    onCompleted(data) {
      const result = data.findCommodityByFarmId;
      if (result.length !== 0) {
        mergeUserData({
          commodity: result,
        });
        setLoading(false);
        navigation.pop();
        navigation.navigate('Komoditas');
      }
    },
    onError(data) {
      console.log(data);
    },
  });

  // Filter data kategori yang sesuai input
  const onSearchCommodity = (text) => {
    let dataFilter = groupedResult
      .filter((item) =>
        item.title.toLocaleLowerCase().includes(text.toLocaleLowerCase()),
      )
      .map((item) => item);
    setDataResult(dataFilter);
  };

  // Ambil semua komoditas yang ada
  const [getAllCommodity] = useLazyQuery(FIND_ALL_COMMODITY, {
    errorPolicy: 'ignore',
    fetchPolicy: 'network-only',
    onCompleted(data) {
      const result = data.findAllCommodity;
      let groupedData = groupBy(result, ['category.name']);
      let arrayGroupedData = [];
      for (const key in groupedData) {
        arrayGroupedData.push({
          title: key,
          data: groupedData[key],
        });
      }
      setGroupedResult(arrayGroupedData);
      setDataResult(arrayGroupedData);
    },
    onError(data) {
      console.log(data);
    },
  });

  // Simpan komoditas yang dipilih
  const [addNewMarket] = useMutation(CREATE_NEW_MARKET, {
    onCompleted() {
      getCommodity({ variables: { farmId: user.farm.id } });
    },
    onError(data) {
      console.log(data);
    },
  });

  const onSelectCommodity = (commodityId) => {
    setLoading(true);
    addNewMarket({
      variables: {
        price: 0,
        farmId: user.farm.id,
        commodityId,
      },
    });
  };

  return (
    <SafeAreaView style={styles.contentContainer}>
      {skip ? (
        <View style={styles.secondPage}>
          <Text style={styles.textHeader}>
            Atur Komoditas Yang Sedang Anda Kelola
          </Text>
          <Text style={styles.textDescription}>
            Sesuaikan dengan komoditas yang sedang anda kelola saat ini.
            Percayakan sisanya pada kami untuk memberikan rekomendasi harga yang
            sesuai
          </Text>
          <TextInput
            style={styles.searchInput}
            returnKeyType="search"
            placeholder="Cari Kategori Komoditas"
            autoCorrect={false}
            onChangeText={(text) => onSearchCommodity(text)}
          />
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={dataResult}
            renderItem={({ item }) => <Item result={item} />}
            keyExtractor={(item) => item.title}
          />
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalHeaderText}>
                    Anda sudah mengelola komoditas lainnya ...
                  </Text>
                  <Text style={styles.modalText}>
                    Berlangganan fitur premium untuk menambahkan komoditas baru,
                    atau ubah komoditas yang anda kelola
                  </Text>
                  <TouchableHighlight
                    style={styles.moreButton}
                    underlayColor="#FFBA49CC"
                    onPress={() => setModalVisible(false)}>
                    <Text style={styles.moreButtonText}>
                      Berlangganan Premium
                    </Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    style={styles.skipButton}
                    activeOpacity={0.3}
                    underlayColor="#FAFAFA"
                    onPress={() => setModalVisible(false)}>
                    <Text style={styles.skipButtonText}>
                      Ubah Komoditas Saat Ini
                    </Text>
                  </TouchableHighlight>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
          {loading ? <Spinner /> : null}
        </View>
      ) : (
        <View style={styles.firstPage}>
          <Text style={styles.textHeader}>
            Wah sayang, saat ini hanya satu saja
          </Text>
          <Text style={styles.textDescriptionSkip}>
            Upgrade plan growfar anda, dan kelola komoditas sebanyak yang anda
            mau. Soal pekerja? Jangan khawatir
          </Text>
          <TouchableHighlight
            style={styles.moreButton}
            underlayColor="#FFBA49CC"
            onPress={() => console.log('Pelajari Lebih Banyak')}>
            <Text style={styles.moreButtonText}>Pelajari Lebih Banyak</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.skipButton}
            activeOpacity={0.3}
            underlayColor="#FAFAFA"
            onPress={() => setSkip(true)}>
            <Text style={styles.skipButtonText}>Nanti Dulu Deh</Text>
          </TouchableHighlight>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: '#FAFAFA',
  },
  firstPage: {
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingTop: 21,
  },
  secondPage: {
    height: '100%',
    paddingHorizontal: 18,
    paddingTop: 21,
  },
  textHeader: {
    width: '77%',
    color: '#2E4057',
    fontSize: 28,
    fontWeight: 'bold',
  },
  textDescription: {
    width: '81.5%',
    color: '#2E4057',
    fontSize: 14,
    marginTop: 16,
  },
  textDescriptionSkip: {
    width: '81.5%',
    color: '#2E4057',
    fontSize: 14,
    marginTop: 16,
    marginBottom: 64,
  },
  moreButton: {
    paddingVertical: 12,
    backgroundColor: '#FFBA49',
    borderWidth: 1.5,
    borderColor: '#D69A38',
    borderRadius: 10,
  },
  moreButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  skipButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 10,
  },
  skipButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFBA49',
  },
  searchInput: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginTop: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#B6B6B6',
    borderRadius: 8,
  },
  resultContainer: {
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#ededed',
    borderRadius: 10,
    marginBottom: 8,
  },
  categoryContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1.5,
    borderColor: '#ededed',
  },
  categoryImage: {
    height: 40,
    width: 40,
    borderRadius: 4,
    backgroundColor: '#2F9C95',
  },
  categoryTextContainer: {
    marginLeft: 16,
  },
  categoryTextName: {
    color: '#2E4057',
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryTextTotal: {
    color: '#2E4057',
    textTransform: 'uppercase',
    fontSize: 11,
  },
  commodityContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  kelolaButton: {
    paddingVertical: 12,
    marginTop: 8,
    marginBottom: 16,
    marginHorizontal: 16,
    backgroundColor: '#FFBA49',
    borderWidth: 1.5,
    borderColor: '#D69A38',
    borderRadius: 10,
  },
  kelolaButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  stopButton: {
    paddingVertical: 12,
    marginTop: 8,
    marginBottom: 16,
    marginHorizontal: 16,
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#FFBA49',
    borderRadius: 10,
  },
  stopButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFBA49',
  },
  commodityImage: {
    height: 48,
    width: 48,
    borderRadius: 8,
    backgroundColor: '#2F9C95',
  },
  commodityTextPrice: {
    color: '#2E4057',
  },
  centeredView: {
    flex: 1,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '100%',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeaderText: {
    color: '#2E4057',
    fontSize: 22,
    fontWeight: 'bold',
  },
  modalText: {
    marginTop: 12,
    color: '#2E4057',
    marginBottom: 24,
  },
});

export default CommodityListScreen;
