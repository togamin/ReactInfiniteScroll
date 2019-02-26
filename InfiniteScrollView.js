import React from "react";
import {
   StyleSheet,
   Text,
   View,
   ListView,
   ActivityIndicator,
   FlatList
 } from "react-native";

class InfiniteScrollScreen extends React.Component{

  //初期化関数
  constructor(props) {
    super(props);
    this.state = {
      dataSource: null,
      isLoading: true,
      count:1,
    };
  }

  //データを取得する関数
  fetchData(count){
    count = count*10;
    //console.log(count);
    fetch(`https://ci.nii.ac.jp/books/opensearch/search?title=ポケモン&format=json&count=${count}`)
      .then(response => response.json())
      .then(responseJson => {
        let ds = new ListView.DataSource({
          //??変更された行のみを再レンダリングする。r1は前のデータ、r2は変更後のデータ。返り値はBool
          rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.setState({
          //dataSource.cloneWithRowsに配列を渡すことで、ListView ComponentのrenderRow関数の引数に自動的に入れるの各要素がindexの若い順に渡される。
          dataSource: ds.cloneWithRows(responseJson['@graph'][0].items),
          isLoading: false,
        });
    })
    .catch(error => {
      console.error(error);
    });
  }
  fetchMore(){
    console.log(this.state.dataSource.rowIdentities[0].length);
    if (this.state.dataSource.rowIdentities[0].length >= this.state.count*10){
      this.state.count += 1
      this.fetchData(this.state.count)
      this.isLoading = false;
    }
  }
  //コンポーネント描画直後に呼ばれる.データを取得する。
  componentDidMount(){
    this.fetchData(this.state.count)
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
      return (
        <ListView
          dataSource={this.state.dataSource}
          renderRow={
            rowData =>
            <View style = {styles.ListView}>
              <Text style = {styles.text}>{rowData.title}</Text>
            </View>
          }
          onEndReachedThreshold = {10}//下からどれくらいの距離になった時に「onEndReached」を動作させるか。
          onEndReached={() => this.fetchMore()}

          //リストの最後に表示するView.読み込み時は、インジケーターを表示する。
          renderFooter={() => {
          }}
        />
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  ListView:{
    height:100,
    margin:9,
    padding:9,
    borderRadius:9,
    backgroundColor:'#333366',
    justifyContent: "center",
    alignItems: "center",
  },
  text:{
    fontSize:18,
    color:'#fff',
  }
});

export default InfiniteScrollScreen;




