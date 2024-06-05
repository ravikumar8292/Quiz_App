import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import Question from './components/Question';
const { height, width } = Dimensions.get('window');

const transformApiData = (apiData) => {
  return apiData.results.map((item, index) => ({
    id: index + 1,
    Question: item.question,
    Option: [...item.incorrect_answers, item.correct_answer].sort(() => Math.random() - 0.5),
    Correct: item.correct_answer,
    Marked: -1,
  }));
};

function App() {
  const [questions, setQuestions] = useState([]);
  const listRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);

  const getApiData = async () => {
    const url = 'https://opentdb.com/api.php?amount=10&category=18&difficulty=easy';
    let result = await fetch(url);
    result = await result.json();
    const transformedData = transformApiData(result);
    setQuestions(transformedData);
  };

  useEffect(() => {
    getApiData();
  }, []);

  const OnSelectOption = (index, x) => {
    const tempData = [...questions];
    tempData[index].Marked = tempData[index].Marked === x ? -1 : x;
    setQuestions(tempData);
  };

  const getTextScore = () => {
    let score = 0;
    questions.forEach(item => {
      if (item.Marked !== -1 && item.Option[item.Marked - 1] === item.Correct) {
        score += 4;
      }
    });
    return score;
  };

  const reset = () => {
    const tempData = questions.map(item => ({ ...item, Marked: -1 }));
    setQuestions(tempData);
  };

  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: 30,
          color: 'white',
          textAlign: 'center',
          paddingTop: 20,
          fontWeight: 'bold',
          backgroundColor: 'purple',
          width: width,
          padding: 12,
        }}>
        Quiz App
      </Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingTop: 15,
          paddingHorizontal: 15,
          paddingBottom: 30,
          backgroundColor: 'purple',
          color: 'white',
          
        }}>
        <Text style={{ fontSize: 19, color: 'white', fontWeight: 'bold' }}>
          English Question : {' ' + currentIndex + '/' + questions.length}
        </Text>
        <TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginRight: 8,
            }}
            onPress={() => {
              reset();
              listRef.current.scrollToIndex({ animated: true, index: 0 });
            }}>
            Reset
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 20 }}>
        <FlatList
          ref={listRef}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          horizontal
          onScroll={e => {
            const x = e.nativeEvent.contentOffset.x / width;
            setCurrentIndex((x + 1).toFixed(0));
          }}
          data={questions}
          renderItem={({ item, index }) => {
            return (
              <Question
                data={item}
                SelectedOption={x => {
                  OnSelectOption(index, x);
                }}
              />
            );
          }}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'absolute',
          top: 650,
          width: '100%',
        }}>
        <TouchableOpacity
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            width: 100,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: currentIndex > 1 ? 'purple' : 'gray',
            borderRadius: 10,
            marginLeft: 20,
          }}
          onPress={() => {
            if (currentIndex > 1) {
              listRef.current.scrollToIndex({
                animated: true,
                index: currentIndex - 2,
              });
            }
          }}>
          <Text style={{ color: 'white' }}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            width: 100,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: currentIndex == questions.length ? 'green' : 'purple',
            borderRadius: 10,
            marginRight: 20,
          }}
          onPress={() => {
            if (questions[currentIndex - 1].Marked !== -1) {
              if (currentIndex < questions.length) {
                listRef.current.scrollToIndex({
                  animated: true,
                  index: currentIndex,
                });
              } else {
                setModalVisible(true);
              }
            }
          }}>
          {currentIndex == questions.length ? (
            <Text style={{ color: 'white' }}>Submit</Text>
          ) : (
            <Text style={{ color: 'white' }}>Next</Text>
          )}
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              width: '90%',
              borderRadius: 10,
            }}>
            <Text
              style={{
                fontSize: 30,
                fontWeight: '800',
                alignSelf: 'center',
                marginTop: 20,
              }}>
              Test Score
            </Text>
            <Text
              style={{
                fontSize: 50,
                fontWeight: '800',
                alignSelf: 'center',
                marginTop: 10,
                color:'green'
              }}>
              {getTextScore()}
            </Text>
            <TouchableOpacity>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '600',
                  alignSelf: 'center',
                  marginTop: 20,
                  backgroundColor: 'purple',
                  color: 'white',
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  borderRadius: 8,
                  marginBottom:18
                }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default App;
















