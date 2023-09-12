import Slider from '@react-native-community/slider';
import React, { useEffect, useRef, useState } from 'react';
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import DeviceConstants from 'react-native-device-constants';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';

import Orientation from 'react-native-orientation-locker';
import { imageUrl } from '../../constants';
import styles from './styles';
// import AWS from 'aws-sdk/dist/aws-sdk-react-native';

// const credentials = new AWS.Crendentials({ accessKeyId: 'AKIAZR3HR6PZJ3FGC25V', secretAccessKey: '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'})
// const s3 = new AWS.S3({ credentials, signatureVersion: 'v1', region: 'ap-south-1'});
// var timesarray = [];

// var initial = 0;

// const windowHeigh = Dimensions.get('window').height;
const NormalVideoViewComponent = (props) => {
  const playerRef = useRef(null);
  const { questionsArray } = props;
  // let [spinner, setSpinner] = useState(true);
  let [normaldata, setNormlaData] = useState(props.data);
  // let [visisted, setVisited] = useState(false);
  let [pausedtime, setPausedTime] = useState(null);

  let [currentTime, setCurrentTime] = useState(0);

  let [duration, setDuration] = useState(0);
  let [data, setData] = useState(null);

  let [show, setShow] = useState(null);
  let [questiondisplay, setQuestionDisplay] = useState(null);
  let [fullscreen, setFullScreen] = useState(false);
  let [isPlaying, setisplaying] = useState(true);
  let [index, setIndex] = useState(0);
  let [questionsarray, setquestionsarray] = useState([]);
  let [loading, setLoading] = useState(true);
  let [newarr, setnewarr] = useState([]);

  useEffect(() => {
    Orientation.addOrientationListener(handleOrientation);
    // console.log("PRopssss.......",questionsArray)
    if (questionsArray.length > 0) {
      //   console.log("hhhhhhh")
      let orders = questionsArray;
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

      // console.log("ordersordersorders",orders)
      setquestionsarray(orders);
      setQuestionDisplay(orders[0]);
      // setPausedTime(parseInt(orders[0].question.timeinsec))
      setNormlaData(props.data);
      setLoading(false);
      var newarr = [];
      orders.map((res, i) => {
        var time = parseInt(res.question.timeinsec);
        newarr.push(time);
        console.log('vvvvv', newarr);
        setnewarr(newarr);
      });
    } else {
      setLoading(false);
    }
  }, [questionsArray]);
  props.forwardRef((name, value) => {
    if (name === 'rewatch') {
      onRewatch(value);
    } else if (name === 'questionsubmit') {
      onquestionSubmit(value);
    } else if (name === 'fullscreen') {
      handlescreenfull(value);
    } else if (name === 'gettime') {
      getcurrentTime();
    } else if (name === 'previous') {
      onPrevious();
    } else if (name === 'next') {
      onNext();
    }
  });
  onquestionSubmit = (time) => {
    console.log('ddddd', questionsarray[index + 1]);
    setisplaying(false);
    //setShow(false);
    // if(questionsarray[index+1]){
    //     setPausedTime(parseInt(questionsarray[index+1].question.timeinsec));
    //     setQuestionDisplay(questionsarray[index+1]);
    //     setShow(false);
    //     setIndex(index+1)
    //     setTimeout(()=>{
    //         setisplaying(false)
    //       },500)

    // }else{
    //     setPausedTime(null);
    //     setQuestionDisplay(null);
    //     setShow(false);
    //     setTimeout(()=>{
    //         setisplaying(false)
    //       },500)
    // }
  };
  onLoad = (data) => {
    console.log('onloaddd', data.duration);
    //this.setInteractiveAxis(data);
    setDuration(parseInt(data.duration));
    if (normaldata.video_played) {
      console.log('onloaddd', normaldata.video_played);
      setCurrentTime(parseInt(normaldata.video_played));
      playerRef.current.seek(parseInt(normaldata.video_played));
    } else {
      setCurrentTime(0);
    }
  };
  getcurrentTime = async () => {
    if (playerRef) {
      if (DeviceConstants.isTablet) {
        Orientation.lockToLandscape();
      } else {
        Orientation.lockToPortrait();
      }
      console.log('fff', currentTime);
      props.onBackNew(currentTime, duration);
    }
  };
  onNext = async () => {
    if (playerRef) {
      if (DeviceConstants.isTablet) {
        Orientation.lockToLandscape();
      } else {
        Orientation.lockToPortrait();
      }
      props.onActivityNext(currentTime, duration);
    }
  };
  onPrevious = async () => {
    if (playerRef) {
      if (DeviceConstants.isTablet) {
        Orientation.lockToLandscape();
      } else {
        Orientation.lockToPortrait();
      }
      console.log('dsdsdsdsdsdsd', currentTime);
      props.onActivityPrevious(currentTime, duration);
    }
  };
  onProgress = (data) => {
    //alert("dmf;ldf")
    //this.checkForPoints(parseInt(data.currentTime))
    setCurrentTime(parseInt(data.currentTime));
    const elapsed_sec = parseInt(data.currentTime);
    let result = newarr.filter((o1) => parseInt(o1) === parseInt(elapsed_sec));

    console.log('progress', elapsed_sec, '   ', result[0], newarr, pausedtime);
    if (elapsed_sec === result[0]) {
      if (parseInt(elapsed_sec) === pausedtime) {
      } else {
        var newdata = questionsarray.filter(
          (o1) => parseInt(o1.question.timeinsec) === result[0]
        );
        //parseInt(this.state.questionsarray[0].question.timeinsec) ===
        setisplaying(true);
        setData(newdata[0]);
        setShow(true);
        setPausedTime(result[0]);
        props.onPause(newdata[0]);
        //this.setState({ isPlaying: true,data:this.state.questiondisplay,show: true},()=>this.props.onPause(this.state.data));
      }
    }
    onRewatch = (data) => {
      console.log.bind('DAtaaaa', data);
      if (playerRef) {
        console.log('onerrewarch', pausedtime);
        var value = newarr.indexOf(pausedtime);
        var newwatch = newarr[value - 1];
        console.log('onqustionnn', newwatch);
        var newvalue = newarr.indexOf(newwatch);
        if (newvalue === -1) {
          playerRef.current.seek(0);
          setCurrentTime(0);
          setShow(false);
          setisplaying(false);
        } else {
          playerRef.current.seek(newarr[newvalue] + 1);
          setCurrentTime(newarr[newvalue] + 1);
          setShow(false);
          setisplaying(false);
        }
      }
    };
  };

  handleOrientation = (orientation) => {
    console.log('orintatin', orientation);
    // orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT'
    //   ? (this.setState({fullscreen: true}), StatusBar.setHidden(true))
    //   : (this.setState({ fullscreen: false}),
    //   StatusBar.setHidden(false);
  };

  onfullscreen = () => {
    props.onfullscreen();

    //   Orientation.lockToLandscapeLeft();
  };
  handlescreenfull = (val) => {
    console.log('fulll', val);
    setFullScreen(val);
    val
      ? Orientation.lockToLandscape()
      : DeviceConstants.isTablet
      ? Orientation.lockToLandscape()
      : Orientation.lockToPortrait();
  };
  handleMainButtonTouch = () => {
    setisplaying(!isPlaying);
  };
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
  // useEffect(()=>{

  // },[timesarray])
  const timesarray = [];
  const arraydata = [];
  for (var i = 0; i < duration; i++) {
    arraydata.push({ value: i });
  }
  const YOUR_API_KEY = 'paste yout api key here';

  var count = 0;
  {
    arraydata.map((res, i) =>
      newarr.map((newrews, j) => {
        if (res.value === parseInt(newrews)) {
          timesarray.push(
            //<Text style={{color: "white",fontSize:13}} >?</Text>
            <FastImage
              style={{ width: 10, height: 10 }}
              source={require('../../assets/images/videos/point.png')}
              //resizeMode={FastImage.resizeMode.contain}
            />
            // <Image source={require('../../assets/images/videos/point.png')}
            //    style={{width:10,height:10}} />
          );
        } else {
          timesarray.push(
            <Text style={{ color: 'transparent', fontSize: 13 }}>?</Text>
          );
        }
      })
    );
  }

  var isTablet = DeviceConstants.isTablet;
  var fullimg = 20,
    playicon = 15,
    subfont = 12,
    progrsheight = 30;
  if (isTablet) {
    (fullimg = 30), (playicon = 25), (subfont = 18), (progrsheight = 40);
  }
  return loading ? (
    <Text>Loading...</Text>
  ) : (
    <View style={styles.mainView}>
      <View
        style={{
          width: '100%',
          height: fullscreen ? '100%' : '100%',
          backgroundColor: 'black',
        }}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <Video
              source={{
                uri: normaldata.url,
                headers: {
                  Referer:
                    'http://my-professor-ui-test.s3-website.ap-south-1.amazonaws.com/',
                },
              }} // Can be a URL or a local file.
              ref={playerRef}
              paused={isPlaying}
              //controls={true}
              // fullscreen={true}                          // Store referenc              // Callback when video cannot be loaded
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                elevation: 20,
              }}
              onLoad={onLoad}
              onError={(err) => console.log('errorrr', err)}
              resizeMode={fullscreen ? 'cover' : 'contain'}
              onProgress={onProgress}
            />
            <TouchableOpacity
              onPress={onfullscreen}
              style={{
                top: fullscreen ? 50 : 50,
                elevation: 20,
                position: 'absolute',
                padding: 10,
                backgroundColor: 'transparent',
                right: 10,
              }}
            >
              {fullscreen ? (
                <Image
                  source={require('../../assets/images/halfscreen.png')}
                  style={{
                    width: fullimg,
                    height: fullimg,
                    tintColor: 'white',
                  }}
                />
              ) : (
                <Image
                  source={require('../../assets/images/fullscreen.png')}
                  style={{
                    width: fullimg,
                    height: fullimg,
                    tintColor: 'white',
                  }}
                />
              )}
            </TouchableOpacity>
            <View
              style={[
                styles.absview,
                { bottom: fullscreen ? 40 : 40, height: 40, borderRadius: 10 },
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
                  bottom: fullscreen ? 30 : 30,
                  height: progrsheight,
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
                  {duration > 0 ? (
                    <TouchableOpacity onPress={handleMainButtonTouch}>
                      {!isPlaying ? (
                        <Image
                          source={require('../../assets/images/pause.png')}
                          style={{
                            width: playicon,
                            height: playicon,
                            tintColor: 'white',
                          }}
                        />
                      ) : (
                        <Image
                          source={require('../../assets/images/play.png')}
                          style={{
                            width: playicon,
                            height: playicon,
                            tintColor: 'white',
                          }}
                        />
                      )}
                    </TouchableOpacity>
                  ) : null}
                  <Text style={{ color: 'white', fontSize: subfont }}>
                    {toHHMMSS(currentTime)}
                  </Text>
                </View>
                <View style={{ flex: 0.65 }}>
                  <View style={styles.subright}>
                    {duration > 0 ? (
                      <Slider
                        style={{ width: '100%', height: fullimg }}
                        minimumValue={0}
                        maximumValue={duration}
                        minimumTrackTintColor="#FFFFFF"
                        maximumTrackTintColor="#000000"
                        thumbImage={
                          Platform.OS === 'ios'
                            ? require('../../assets/images/thumb1.png')
                            : require('../../assets/images/thumb.png')
                        }
                        value={currentTime} // Which is updated by videoRef.onProgress listener
                        onSlidingStart={(value) => {
                          console.log('slidingstarte', value, currentTime);
                        }}
                        onValueChange={(value) => {
                          console.log('prsl', value, '', currentTime);
                          if (parseInt(value) > parseInt(currentTime)) {
                            if (props.resourcedata.percentage !== 0) {
                              console.log('playerRef', playerRef);
                              setCurrentTime(parseInt(value));
                              if (pausedtime > parseInt(value)) {
                                setPausedTime(null);
                              }

                              playerRef.current.seek(parseInt(value));
                            } else {
                              // console.log("sadfkajshdfkuahfkudhfkad")
                              playerRef.current.seek(parseInt(currentTime));
                            }
                            console.log('prigressvl', value, '', currentTime);
                          } else {
                            console.log('playerRef', playerRef);
                            setCurrentTime(parseInt(value));
                            if (pausedtime > parseInt(value)) {
                              setPausedTime(null);
                            }

                            playerRef.current.seek(parseInt(value));
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
                  <Text style={{ color: 'white', fontSize: subfont }}>
                    {toHHMMSS(duration)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
export default NormalVideoViewComponent;
