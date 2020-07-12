import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import moment from 'moment';
import { Context } from './Context';

//儲存與更新刪除形成的操作
export default class TodoStore extends Component {
  state = {

    todo: [],

    updateTodo: item => {this._updateTodo(item); },
    
    deleteTodo: item => {this._deleteTodo(item); },

    updateSelectedTask: item => {this._updateSelectedTask(item); },

    deleteSelectedTask: item => {this._deleteSelectedTask(item); },
  };

  //製作個各個function

  _deleteSelectedTask = async item => {
    const previousTodo = [...this.state.todo];
    const newTodo = previousTodo.filter(data => {
      if (item.key === data.key) {
        return false;
      }
      return true;
    });
    try {
      await AsyncStorage.setItem('TODO', JSON.stringify(newTodo));//類似localstorage的東西 https://docs.expo.io/versions/v37.0.0/react-native/asyncstorage/
      this.setState({
        todo: newTodo,
      });
    } catch (error) {
      // Error saving data
    }
  };

  _updateSelectedTask = async item => {
    const previousTodo = [...this.state.todo];
    const newTodo = previousTodo.map(data => {
      if (item.key === data.key) {
        data=item;
        return data;
      }
      return data;
    });
    try {
      await AsyncStorage.setItem('TODO', JSON.stringify(newTodo));//類似localstorage的東西 https://docs.expo.io/versions/v37.0.0/react-native/asyncstorage/
      this.setState({
        todo: newTodo,
      });
    } catch (error) {
      // Error saving data
    }
  };

  async componentDidMount() {//render之前載入
    try {
      const todo = await AsyncStorage.getItem('TODO');//類似localstorage的東西 https://docs.expo.io/versions/v37.0.0/react-native/asyncstorage/
      if (todo !== null) {
        this.setState({
          todo: JSON.parse(todo),
        });
      }
      console.log('this is asyncStorage')
      //console.log(todo)
    } catch (error) {
      // Error saving data
    }
  }

  _updateTodo = async item => {
    console.log('here i am')

      const newTodo = [...this.state.todo, item];//把item加到後面
      try {
        await AsyncStorage.setItem('TODO', JSON.stringify(newTodo));
        this.setState({
          todo: newTodo,
        });
      } catch (error) {
        // Error saving data
      }
  };

  _deleteTodo = () => {};

  render() {
    return (//context.provider
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}
