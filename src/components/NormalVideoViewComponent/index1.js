import Slider from '@react-native-community/slider';
import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import Video from 'react-native-video';

import Orientation from 'react-native-orientation-locker';
import { imageUrl } from '../../constants';
import styles from './styles';
// import AWS from 'aws-sdk/dist/aws-sdk-react-native';

// const credentials = new AWS.Crendentials({ accessKeyId: 'AKIAZR3HR6PZJ3FGC25V', secretAccessKey: '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'})
// const s3 = new AWS.S3({ credentials, signatureVersion: 'v1', region: 'ap-south-1'});

var currentTime = 0;
export default class NormalVideoViewComponent extends Component {
  state = {
    isReady: false,
    status: null,
    quality: null,
    error: null,
    isLooping: true,
    duration: 0,
    currentTime: 0,
    fullscreen: false,
    playerWidth: Dimensions.get('window').width,
    elapsed: 0,
    time: 0,
    singleSliderValues: [],
    value: 0,
    isvisible: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      spinner: true,
      normaldata: this.props.data,
      visisted: false,
      showpausebutton: true,
      videoid: '',
      array: ['10', '20'],
      pausedtime: null,
      currentTime: 0,
      duration: 0,
      data: null,
      show: null,
      questiondisplay: null,
      fullscreen: false,
      isPlaying: true,
      index: 0,
      questionsarray: [],
      loading: true,
      videourl: '',
      newarr: [],
      setX: [],
      getViewX: 0,
      getViewY: 0,
    };
    this.onProgress = this.onProgress.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.onRewatch = this.onRewatch.bind(this);
    this.onPause = this.onPause.bind(this);
    this.handlescreenfull = this.handlescreenfull.bind(this);
    this._panResponder;
  }
  _youTubeRef = React.createRef();
  componentDidMount() {
    //alert("hi"+JSON.stringify(this.props.questionsArray))
    Orientation.addOrientationListener(this.handleOrientation.bind(this));

    if (this.props.questionsArray.length > 0) {
      let orders = this.props.questionsArray;
      orders.sort(function (a, b) {
        let dateA = parseInt(a.question.timeinsec);
        let dateB = parseInt(b.question.timeinsec);
        if (dateA < dateB) {
          return -1;
        } else if (dateA > dateB) {
          return 1;
        }
        return 0;
      });

      console.log('ordersordersorders', orders);
      this.setState(
        {
          questionsarray: orders,
        },
        () => {
          this.setState({
            questiondisplay: this.state.questionsarray[0],
            pausedtime: parseInt(
              this.state.questionsarray[0].question.timeinsec
            ),
          });
          var newarr = [];
          this.state.questionsarray.map((res, i) => {
            var time = parseInt(res.question.timeinsec);
            newarr.push(time);
            console.log('vvvvv', newarr);
            this.setState(
              {
                newarr,
              },
              () => {
                console.log('fff', newarr);
              }
            );
          });
        }
      );
    } else {
      this.setState({
        loading: false,
      });
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    // if(prevState.normaldata === nextProps.data){
    //           return{

    //           }
    //       }else {
    if (nextProps.data) {
      if (prevState.visisted) {
      } else {
        // console.log("111",prevState.normaldata)
        // const url = s3.getSignedUrl('getObject', { Bucket: 'iconed', Key: nextProps.data.url})

        return {
          normaldata: nextProps.data,
          loading: false,
          visisted: true,
        };
      }
    }
    //}
  }

  onquestionSubmit(time) {
    console.log('ddddd', this.state.questionsarray[this.state.index + 1]);
    this.setState({
      isPlaying: true,
      show: false,
    });
    //    if(this.state.questionsarray[this.state.index+1]){
    // this.setState({
    //     pausedtime :   parseInt(this.state.questionsarray[this.state.index+1].question.timeinsec),
    //     questiondisplay: this.state.questionsarray[this.state.index+1],
    //     show:false,
    //     isVisible: false,
    //     index: this.state.index+1
    //   },()=>
    //   {
    //     setTimeout(()=>{
    //       this.setState({
    //         isPlaying: false,

    //       })
    //     },500)

    //     // console.log("dfndnflkdnfkl",this.state.isVisible)
    //   })

    //    }else{
    //     this.setState({
    //       pausedtime :  null,
    //       questiondisplay: null,
    //       show:false,
    //       isVisible: false
    //     },()=>
    //     {
    //       setTimeout(()=>{
    //         this.setState({
    //           isPlaying: false,

    //         })
    //       },500)

    //       // console.log("dfndnflkdnfkl",this.state.isVisible)
    //     })
    //    }
  }

  //   const interval = setInterval(async () => {
  //   var count = null
  // var compare = false
  //     const elapsed_sec = await  this. _youTubeRef.current.getCurrentTime();
  //       console.log("elaps",elapsed_sec)

  //   //  console.log(",,,",elapsed_sec,"mm",count)

  //   // calculations
  //   // const elapsed_ms = Math.floor(elapsed_sec * 1000);
  //   // const ms = elapsed_ms % 1000;
  //   // const min = Math.floor(elapsed_ms / 60000);
  //   // const seconds = Math.floor((elapsed_ms - min * 60000) / 1000);

  //   // var newelapsed =
  //   //   min.toString().padStart(2, '0') +':' +seconds.toString().padStart(2, '0')
  //    if(parseInt(elapsed_sec) === 10 ){
  //      console.log("naflafklalkfjkl")

  //      this.setState({ isPlaying: false,questiondata: question2},()=>this.props.onPause(this.state.questiondata));
  //       clearInterval(interval);

  //    }
  //   this.setState({
  //     time: elapsed_sec,
  //     elapsed: elapsed_sec,

  //   })
  // }, 600);

  // }
  //    ))
  // }

  onnext() {
    this.setState({
      isPlaying: false,
    });
  }

  onLoad = (data) => {
    console.log('onloaddd', data);
    //this.setInteractiveAxis(data);
    this.setState({ duration: parseInt(data.duration) }, () => {
      //   this.onReady()
    });
  };
  onReady() {
    if (this.playerRef) {
      // if(this.state.youtubedata.video_played){
      //   this._youTubeRef.current?.seekTo(this.state.youtubedata.video_played,true);
      // }
      initial = 1;
      const interval = setInterval(async () => {
        const elapsed_sec = await tthis.playerRef?.current?.getCurrentTime();

        this.setState(
          {
            currentTime: parseInt(data.currentTime),
          },
          () => {
            currentTime = parseInt(data.currentTime);
            const elapsed_sec = parseInt(data.currentTime);

            //let result = this.state.newarr.filter(o1 => parseInt(o1) === elapsed_sec);
            console.log('progress', elapsed_sec, '   ', this.state.pausedtime);
            //  console.log("filterer",result)
            if (elapsed_sec === 10) {
              if (this.state.show) {
              } else {
                // var newdata = this.state.questionsarray.filter(o1 => parseInt(o1.question.timeinsec) === result[0]);
                //parseInt(this.state.questionsarray[0].question.timeinsec) ===
                this.setState(
                  {
                    isPlaying: true,
                    data: this.state.questiondisplay,
                    show: true,
                  },
                  () => this.props.onPause(this.state.data)
                );
              }
            }
          }
        );
      }, 100);
    }
  }

  onLoadStart = (data) => {
    console.log('xxxx', data);
    // if(this.state.normaldata.video_played){
    //   console.log("dflkjlkdf",this.state.normaldata.video_played)
    //   if(this.playerRef){
    //   this.playerRef.seek(this.state.normaldata.video_played);
    //   }
    //  }
  };
  onLoadEnd = (data) => {
    console.log('enddddd');
  };
  async getcurrentTime() {
    if (this.playerRef) {
      // let elapsed_sec = await  this.playerRef.current?.getCurrentTime();
      // let duration = await this.playerRef.current.getDuration()
      console.log('fff', currentTime);
      this.props.onBackNew(currentTime, this.state.duration);
    }
  }
  async onNext() {
    if (this.playerRef) {
      // let elapsed_sec = await  this.playerRef.current?.getCurrentTime();
      // let duration = await this. playerRef.current.getDuration()
      this.props.onActivityNext(currentTime, this.state.duration);
    }
  }
  async onPrevious() {
    if (this.playerRef) {
      // let elapsed_sec = await  this.playerRef.current?.getCurrentTime();
      // let duration = await this. playerRef.current.getDuration()
      this.props.onActivityPrevious(currentTime, this.state.duration);
    }
  }
  onProgress(data) {
    //alert("dmf;ldf")
    //this.checkForPoints(parseInt(data.currentTime))

    this.setState(
      {
        currentTime: parseInt(data.currentTime),
      },
      () => {
        currentTime = parseInt(data.currentTime);
        const elapsed_sec = parseInt(data.currentTime);

        let result = this.state.newarr.filter(
          (o1) => parseInt(o1) === elapsed_sec
        );
        console.log('progress', elapsed_sec, '   ', this.state.pausedtime);
        //  console.log("filterer",result)
        if (elapsed_sec === result[0]) {
          if (this.state.show) {
          } else {
            var newdata = this.state.questionsarray.filter(
              (o1) => parseInt(o1.question.timeinsec) === result[0]
            );
            //parseInt(this.state.questionsarray[0].question.timeinsec) ===
            this.setState(
              {
                isPlaying: true,
                data: newdata[0],
                show: true,
                currentTime: result[0] + 1,
                pausedtime: result[0],
              },
              () => this.props.onPause(this.state.data)
            );
          }
        }
      }
    );
  }
  onPause() {
    this.playerRef.paused = true;
    this.setState({
      isPlaying: true,
    });
  }

  onRewatch(data) {
    //alert(JSON.stringify(data))
    // console.log("rewatch",id)

    // this.state.questionsArray
    if (this.playerRef) {
      //this._youTubeRef.current?.seekTo(0,true);
      // alert(this.state.newarr.indexOf(this.state.pausedtime)-1)
      console.log('onerrewarch', this.state.pausedtime);
      var value = this.state.newarr.indexOf(this.state.pausedtime);
      var newwatch = this.state.newarr[value - 1];
      console.log('onqustionnn', newwatch);
      var newvalue = this.state.newarr.indexOf(newwatch);
      if (newvalue === -1) {
        this.playerRef.seek(0);
        this.setState({
          currentTime: 0,
          show: false,
          isPlaying: false,
        });
      } else {
        this.playerRef.seek(this.state.newarr[newvalue] + 1);
        this.setState({
          currentTime: this.state.newarr[value] + 1,
          show: false,
          isPlaying: false,
        });
      }
      // this.playerRef.seek(this.state.pausedtime);
      //  this.setState({
      //   show:false,
      //     isPlaying: false,

      //   })
    }
  }
  handleOrientation(orientation) {
    console.log('orintatin', orientation);
    // orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT'
    //   ? (this.setState({fullscreen: true}), StatusBar.setHidden(true))
    //   : (this.setState({ fullscreen: false}),
    //   StatusBar.setHidden(false);
  }

  onfullscreen() {
    this.props.onfullscreen();

    //   Orientation.lockToLandscapeLeft();
  }
  handlescreenfull(val) {
    console.log('fulll', val);
    this.setState(
      {
        fullscreen: val,
      },
      () => {
        console.log(this.state.fullscreen);
        this.state.fullscreen
          ? Orientation.lockToLandscape()
          : Orientation.lockToPortrait();
      }
    );
  }
  handleMainButtonTouch() {
    this.setState((state) => {
      return {
        isPlaying: !state.isPlaying,
      };
    });
  }

  toHHMMSS = (secs) => {
    var sec_num = parseInt(secs, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor(sec_num / 60) % 60;
    var seconds = sec_num % 60;

    return [hours, minutes, seconds]
      .map((v) => (v < 10 ? '0' + v : v))
      .filter((v, i) => v !== '00' || i > 0)
      .join(':');
  };
  render() {
    const data = [];
    for (var i = 0; i < this.state.duration; i++) {
      data.push({ value: i });
    }
    const YOUR_API_KEY = 'paste yout api key here';

    var timesarray = [];
    var count = 0;
    {
      data.map((res, i) =>
        this.state.newarr.map((newrews, j) => {
          if (res.value === parseInt(newrews)) {
            timesarray.push(
              <Image
                source={require('../../assets/images/videos/point.png')}
                style={{ width: 10, height: 10 }}
              />
            );
          } else {
            timesarray.push(
              <Text style={{ color: 'transparent', fontSize: 13 }}>?</Text>
            );
          }
        })
      );
    }
    return this.state.loading ? (
      <Text>Loading...</Text>
    ) : (
      <TouchableNativeFeedback
        onPress={() =>
          this.setState({ showpausebutton: !this.state.showpausebutton })
        }
      >
        <View style={styles.mainView}>
          <View
            style={{
              width: '100%',
              height: this.state.fullscreen ? '100%' : '100%',
              backgroundColor: 'black',
            }}
          >
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1 }}>
                <Video
                  source={{
                    uri: imageUrl + this.state.normaldata.url,
                    headers: {
                      Referer:
                        'http://my-professor-ui-test.s3-website.ap-south-1.amazonaws.com/',
                    },
                  }} // Can be a URL or a local file.
                  ref={(ref) => {
                    this.playerRef = ref;
                  }}
                  paused={this.state.isPlaying}
                  //controls={true}
                  // fullscreen={true}                          // Store referenc              // Callback when video cannot be loaded
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    elevation: 10,
                  }}
                  onLoadStart={this.onLoadStart.bind(this)}
                  onChangeState={(data) => console.log('djfjk', data)}
                  onLoad={this.onLoad}
                  onError={(err) => console.log('errorrr', err)}
                  resizeMode={this.state.fullscreen ? 'cover' : 'contain'}
                  onProgress={this.onProgress}
                />
                {/* {this.state.showpausebutton ? 
    <View style={{position:"absolute",top:this.state.fullscreen ? windowWidth/2 :windowHeigh/2.7,alignSelf:"center"}}>
    <TouchableOpacity onPress={this.handleMainButtonTouch.bind(this)}>
                             {!this.state.isPlaying ? 
                             <Image source={require('../../assets/images/pause.png')}
                             style={{width:20,height:20}} /> : 
                             <Image source={require('../../assets/images/play.png')}
                             style={{width:20,height:20,tintColor:"black"}} /> 
                            }
                         </TouchableOpacity>
    </View> : null} */}

                <TouchableOpacity
                  onPress={this.onfullscreen.bind(this)}
                  style={{
                    top: this.state.fullscreen ? 50 : 50,
                    elevation: 20,
                    position: 'absolute',
                    padding: 10,
                    backgroundColor: 'transparent',
                    right: 10,
                  }}
                >
                  {this.state.fullscreen ? (
                    <Image
                      source={require('../../assets/images/halfscreen.png')}
                      style={{ width: 20, height: 20, tintColor: 'white' }}
                    />
                  ) : (
                    <Image
                      source={require('../../assets/images/fullscreen.png')}
                      style={{ width: 20, height: 20, tintColor: 'white' }}
                    />
                  )}
                </TouchableOpacity>
                {/* <View style={[styles.absview,{bottom:25}]}>
      <View style={styles.subview}>
        <View style={styles.subleftview}/>
        <View style={styles.submiddleview}>
        <View style={styles.subright}>
          {timesarray}
          
          </View>
        </View>
        <View style={styles.sublastright}/>
      </View>
    </View> */}
                <View
                  style={[
                    styles.absview,
                    {
                      bottom: this.state.fullscreen ? 40 : 40,
                      height: 40,
                      borderRadius: 10,
                    },
                  ]}
                >
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View
                      style={{
                        flex: 0.2,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    />
                    <View style={{ flex: 0.65 }}>
                      <View style={[styles.subright, { marginLeft: 5 }]}>
                        {timesarray}
                      </View>
                    </View>
                    <View
                      style={{
                        flex: 0.15,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    />
                  </View>
                </View>
                <View
                  style={[
                    styles.absview,
                    {
                      bottom: this.state.fullscreen ? 30 : 30,
                      height: 30,
                      borderRadius: 20,
                      backgroundColor: 'rgba(211,211,211,0.3)',
                    },
                  ]}
                >
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View
                      style={{
                        flex: 0.2,
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}
                    >
                      <TouchableOpacity
                        onPress={this.handleMainButtonTouch.bind(this)}
                      >
                        {!this.state.isPlaying ? (
                          <Image
                            source={require('../../assets/images/pause.png')}
                            style={{
                              width: 15,
                              height: 15,
                              tintColor: 'white',
                            }}
                          />
                        ) : (
                          <Image
                            source={require('../../assets/images/play.png')}
                            style={{
                              width: 15,
                              height: 15,
                              tintColor: 'white',
                            }}
                          />
                        )}
                      </TouchableOpacity>
                      <Text style={{ color: 'white', fontSize: 12 }}>
                        {this.toHHMMSS(this.state.currentTime)}
                      </Text>
                    </View>
                    <View style={{ flex: 0.65 }}>
                      <View style={styles.subright}>
                        {this.state.duration > 0 ? (
                          <Slider
                            style={{ width: '100%', height: 20 }}
                            minimumValue={0}
                            maximumValue={this.state.duration}
                            minimumTrackTintColor="#FFFFFF"
                            maximumTrackTintColor="#000000"
                            thumbImage={require('../../assets/images/thumb1.png')}
                            value={this.state.currentTime} // Which is updated by videoRef.onProgress listener
                            onSlidingStart={(value) => {
                              console.log('slidingstarte', value, currentTime);
                            }}
                            onValueChange={(value) => {
                              console.log('prsl', value, '', currentTime);
                              if (parseInt(value) > parseInt(currentTime)) {
                                console.log(
                                  'prigressvl',
                                  value,
                                  '',
                                  currentTime
                                );
                              } else {
                                this.setState({ currentTime: parseInt(value) });
                                this.playerRef.seek(parseInt(value));
                              }
                            }}
                          />
                        ) : null}
                      </View>
                    </View>
                    <View
                      style={{
                        flex: 0.15,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: 'white', fontSize: 12 }}>
                        {this.toHHMMSS(this.state.duration)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  }
}
