import React from 'react';
import {View, StyleSheet, Modal } from 'react-native';


export class PlaceInput extends React.Component {
  
  render() {
    const { isModalVisible, children } = this.props;
    return (
      <Modal
        animationType="fade"
        transparent
        visible={isModalVisible}
        onRequestClose={() => null}
      >
        <View style={styles.container}>
          <View style={styles.cardMain}>{children}</View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  cardMain: {
    position: 'absolute',//task視窗跳出後的樣式
    top: 45,
    width: 327,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignSelf: 'center',//跳出在中間
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});