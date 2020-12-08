import React, { Component } from 'react'
import { Text, View, SafeAreaView } from 'react-native'
import ProgressBar from 'react-native-progress/Bar';
import { Actions } from 'react-native-router-flux';
import RNSecureStorage from 'rn-secure-storage'

export class AppLoading extends Component {
	constructor(props) {
    super(props);
    this.state = { progress: 0 };
	}
	
	// componentDidMount() {
	// 	RNSecureStorage.get("user").then((value) => {
	// 		setTimeout(() => { Actions.dashboard() }, 6000);
	// 		// setTimeout(() => { Actions.terms()}, 6000);
	// 	}).catch((err) => {
	// 		console.log(err)
	// 		setTimeout(() => { Actions.onboardingIntro() }, 6000);
	// 	})
	// }
	
	render() {
		setTimeout(() => { this.setState({ progress: this.state.progress + (0.4 * Math.random()) }); }, 1000);
		return (
			<SafeAreaView style={{ backgroundColor: '#001A71', flex: 1,  justifyContent: 'center', alignItems: 'center' }}>
				<Text style={{ color: 'white', fontSize: 40, marginBottom: 10 }}> Mi </Text>
				<View style={{ paddingHorizontal: 20 }}>
					<ProgressBar width={300} height={10} color={'#1BD7BA'} backgroundColor={'#fff'} progress={this.state.progress} style={{ borderRadius: 20 }} />
				</View>
				{/* <Text style={{ color: 'white' }}> App loading... </Text> */}
			</SafeAreaView>
		)
	}
}

export default AppLoading
