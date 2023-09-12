import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { imageUrl } from '../../constants';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.getData = this.getData.bind(this);
    this.state = {
      loader: false,
      userName: 'null',
      profile_pic: 'null',
      gradeName: 'null',
      schoolname: 'null',
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ loader: false });
      this.getData();
    }, 2000);
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@user');
      //  alert(JSON.stringify(value))
      if (value !== null) {
        var data = JSON.parse(value);
        console.log('dataaa', data);
        this.setData(data);
      } else {
        //Actions.push('login')
      }
    } catch (e) {
      return null;
    }
  };

  setData(data) {
    // alert(data.profile_pic)
    this.setState({
      userName: data.name ? data.name : data.first_name + ' ' + data.last_name,
      profile_pic: data.profile_pic ? imageUrl + data.profile_pic : 'null',
      gradeName: data.grade ? data.grade.name : 'null',
      schoolname: data.school ? data.school.name : 'null',
    });
  }
  closeControlPanel = () => {
    this._drawer.close();
  };
  openControlPanel = () => {
    this._drawer.open();
  };
  render() {
    const url = imageUrl + this.state.profile_pic;
    return {
      /*	<>
		 <ImageBackground source={require('../../assets/images/Mobile_bg_1.png')}
			style={{width:"100%",height:"100%",opacity:0.5}}/>
			<View style={{width:"100%",height:"100%",position:"absolute"}}>
			<View style={styles.mainview}>
			{this.state.loader ? (
				<Loader/>
				):
				<Drawer
				type="overlay"
					ref={(ref) => this._drawer = ref}
					 tapToClose={true}
					 openDrawerOffset={100} 
					  content={ <SideMenu

						closeControlPanel={this.closeControlPanel}/>}
					>
			<View style={{width:"100%",height:"100%",}}>
			<View style={{flex:1}}>
				<View style={{flex:1}}>
			<ScrollView contentContainerStyle={{flexGrow:1,}}>
				<View style={{flex:0.2,alignItems:"flex-end",justifyContent:"center"}}>
					<Image source={require('../../assets/images/dashboard/new/dashboardabs_new.png')}
					style={{width:263/1.2,height:235/1.5}}/>
					<View style={{position: 'absolute' ,flex:1,height:"100%",width:"100%" ,justifyContent: 'center'}}>
					
                    <View style={{marginLeft:20,marginTop:20}}>
                    <Text style={{color:colors.Themecolor//"#FFB13D"
					,fontSize:15}}>{StringsOfLanguages.hello}</Text>
                       <Text style={{color:colors.Themecolor//"#FFB13D"
					   ,fontWeight:"bold",fontSize:25}}>{this.state.userName}</Text>
                    </View>
                       
					</View>
				</View>
				<View style={{flex:0.7,marginHorizontal: 0,}}>
				
                  <Library/>
			    </View>
				</ScrollView>
				</View>
	    	       <View style={styles.footerview}>

					    <Footer openControlPanel={this.openControlPanel}/>
						</View>
				</View>


						</View></Drawer>}
			</View>
			 </View> 
			</>*/
    };
  }
}
export default Dashboard;
