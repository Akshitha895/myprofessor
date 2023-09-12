import React, { Component } from 'react';
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import Video from 'react-native-video';
import { imageUrl } from '../../constants';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';

var videoRef = React.createRef();

export default class VideoPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fullscreen: false,
      play: true,
      currentTime: 0,
      duration: 0,
      showControls: true,

      spinner: true,
      normaldata: this.props.data,
      videoid: '',
      array: ['10', '20'],
      pausedtime: null,
      data: null,
      show: null,
      questiondisplay: null,
      //play: false,
      index: 0,
      questionsarray: [],
      newarr: [],
    };
    this.handleOrientation = this.handleOrientation.bind(this);
    this.handlePlayPause = this.handlePlayPause.bind(this);
    this.handleFullscreen = this.handleFullscreen.bind(this);
    this.skipBackward = this.skipBackward.bind(this);
    this.skipForward = this.skipForward.bind(this);
    this.onSeek = this.onSeek.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onLoadEnd = this.onLoadEnd.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.showControls = this.showControls.bind(this);
    this.handlescreenfull = this.handlescreenfull.bind(this);
    this.onRewatch = this.onRewatch.bind(this);
    this.handleOnSlide = this.handleOnSlide.bind(this);
    // this.onSlideStart = this.onSlideStart.bind(this)
    // this.onSlidingComplete  =this.onSlideComplete.bind(this);
    // this.onSlideCapture = this.onSlideCapture.bind(this)
  }

  // const [state, setState] = useState({
  //   fullscreen: false,
  //   play: true,
  //   currentTime: 0,
  //   duration: 0,
  //   showControls: true,
  // });

  componentDidMount() {
    Orientation.addOrientationListener(this.handleOrientation);
    console.log('legthh', this.props.questionsArray.length);
    if (this.props.questionsArray.length > 0) {
      this.setState(
        {
          questionsarray: this.props.questionsArray,
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
            //  console.log("vvvvv",newarr)
            this.setState({
              newarr,
            });
          });
        }
      );
    }
  }
  componentWillUnmount() {
    Orientation.removeOrientationListener(this.handleOrientation);
  }
  onquestionSubmit(time) {
    //   alert(this.state.questionsarray[this.state.index+1])

    if (this.state.questionsarray[this.state.index + 1]) {
      this.setState(
        {
          pausedtime: parseInt(
            this.state.questionsarray[this.state.index + 1].question.timeinsec
          ),
          questiondisplay: this.state.questionsarray[this.state.index + 1],
          show: false,
          isVisible: false,
          index: this.state.index + 1,
        },
        () => {
          setTimeout(() => {
            this.setState({
              play: false,
            });
          }, 500);

          // console.log("dfndnflkdnfkl",this.state.isVisible)
        }
      );
    } else {
      this.setState(
        {
          pausedtime: null,
          questiondisplay: null,
          show: false,
          isVisible: false,
        },
        () => {
          setTimeout(() => {
            this.setState({
              play: false,
            });
          }, 500);

          // console.log("dfndnflkdnfkl",this.state.isVisible)
        }
      );
    }
  }

  render() {
    const data = [];
    for (var i = 0; i < parseInt(this.state.duration); i++) {
      data.push({ value: i });
    }
    const YOUR_API_KEY = 'paste yout api key here';
    const url = imageUrl + this.state.normaldata.url;

    var timesarray = [];
    var count = 0;
    {
      data.map((res, i) =>
        this.state.newarr.map((newrews, j) => {
          if (res.value === parseInt(newrews)) {
            timesarray.push(
              <Text style={{ color: 'red', fontSize: 13 }}>?</Text>
            );
          } else {
            timesarray.push(
              <Text style={{ color: 'transparent', fontSize: 13 }}>?</Text>
            );
          }
        })
      );
    }
    console.log('vv', count);
    // if(count == 0){
    //   timesarray.push( <Text style={{color: "red",fontSize:13}} >?</Text>)
    // }else{
    //   console.log("....",count)
    //   timesarray.push( <Image source={require('../../assets/images/videos/point.png')}
    //   style={{width:10,height:10}} />)
    // }
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.showControls}>
          <View>
            <Video
              ref={videoRef}
              source={{ uri: url }}
              style={
                this.state.fullscreen ? styles.fullscreenVideo : styles.video
              }
              controls={false}
              resizeMode={'contain'}
              onLoad={this.onLoadEnd}
              onProgress={this.onProgress}
              onEnd={this.onEnd}
              paused={!this.state.play}
            />
            {this.state.showControls && (
              <View style={styles.controlOverlay}>
                <TouchableOpacity
                  onPress={this.handleFullscreen}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={styles.fullscreenButton}
                >
                  {this.state.fullscreen ? (
                    <Text style={{ color: 'white' }}>close</Text>
                  ) : (
                    <Text>Open</Text>
                  )}
                </TouchableOpacity>
                <PlayerControls
                  onPlay={this.handlePlayPause}
                  onPause={this.handlePlayPause}
                  playing={this.state.play}
                  showPreviousAndNext={false}
                  //showSkip={true}
                  skipBackwards={this.skipBackward}
                  skipForwards={this.skipForward}
                />
                {/* <View style={{flex:1,paddingVertical:10,backgroundColor:"yellow"}}>
              {timesarray}
              </View> */}
                <ProgressBar
                  currentTime={this.state.currentTime}
                  duration={this.state.duration > 0 ? this.state.duration : 0}
                  onSlideStart={this.handlePlayPause}
                  onSlideComplete={this.handlePlayPause}
                  onSlideCapture={this.onSeek}
                />
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  handleOrientation(orientation) {
    orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT'
      ? (this.setState((s) => ({ ...s, fullscreen: true })),
        StatusBar.setHidden(true))
      : (this.setState((s) => ({ ...s, fullscreen: false })),
        StatusBar.setHidden(false));
  }

  handleFullscreen() {
    this.props.onfullscreen();
    //  this.state.fullscreen
    //   ? Orientation.lockToPortrait()
    //   : Orientation.lockToLandscapeLeft();
  }
  onRewatch(data) {
    //alert(JSON.stringify(data))
    // console.log("rewatch",id)

    // this.state.questionsArray
    if (videoRef) {
      //this._youTubeRef.current?.seekTo(0,true);
      // alert(this.state.newarr.indexOf(this.state.pausedtime)-1)
      var value = this.state.newarr.indexOf(this.state.pausedtime) - 1;
      if (value === -1) {
        videoRef.seek(0);
        this.setState({
          show: false,
          play: false,
        });
      } else {
        videoRef.seek(this.state.newarr[value]);
        this.setState({
          show: false,
          play: false,
        });
      }
      // this.playerRef.seek(this.state.pausedtime);
      //  this.setState({
      //   show:false,
      //     play: false,

      //   })
    }
  }

  handlescreenfull() {
    this.state.fullscreen
      ? Orientation.lockToPortrait()
      : Orientation.lockToLandscape();
  }

  handlePlayPause() {
    // If playing, pause and show controls immediately.
    if (this.state.play) {
      this.setState({ ...this.state, play: false, showControls: true });
      return;
    }

    this.setState({ ...this.state, play: true });
    setTimeout(
      () => this.setState((s) => ({ ...s, showControls: false })),
      2000
    );
  }

  skipBackward() {
    videoRef.current.seek(this.state.currentTime - 15);
    this.setState({ ...this.state, currentTime: this.state.currentTime - 15 });
  }

  skipForward() {
    videoRef.current.seek(this.state.currentTime + 15);
    this.setState({ ...this.state, currentTime: this.state.currentTime + 15 });
  }

  onSeek(data) {
    videoRef.current.seek(data.seekTime);
    this.setState({ ...this.state, currentTime: data.seekTime });
  }

  onLoadEnd(data) {
    console.log('video satrted', data);
    this.setState((s) => ({
      ...s,
      duration: data.duration,
      currentTime: data.currentTime,
    }));
  }

  onProgress(data) {
    this.setState((s) => ({
      ...s,
      currentTime: data.currentTime,
    }));
    //   const elapsed_sec =parseInt(data.currentTime)

    //         console.log("progress",elapsed_sec, this.state.pausedtime)
    //         if(elapsed_sec === this.state.pausedtime){

    //           if(this.state.show){

    //           }else{
    //             //console.log("insideeprogressss",JSON.stringify(this.state.questiondisplay))
    //             this.setState({ play: true,data:this.state.questiondisplay,show: true},()=>this.props.onPause(this.state.data));
    //           }

    // }
  }
  getMinutesFromSeconds(time) {
    const minutes = time >= 60 ? Math.floor(time / 60) : 0;
    const seconds = Math.floor(time - minutes * 60);

    return `${minutes >= 10 ? minutes : '0' + minutes}:${
      seconds >= 10 ? seconds : '0' + seconds
    }`;
  }

  handleOnSlide(time) {
    this.onSeek({ seekTime: time });
  }

  onEnd() {
    this.setState({ ...this.state, play: false });
    videoRef.current.seek(0);
  }

  showControls() {
    this.state.showControls
      ? this.setState({ ...this.state, showControls: false })
      : this.setState({ ...this.state, showControls: true });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebebeb',
    justifyContent: 'center',
  },
  video: {
    height: Dimensions.get('window').width * (9 / 16),
    width: Dimensions.get('window').width,
    backgroundColor: 'black',
  },
  fullscreenVideo: {
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').height,
    backgroundColor: 'black',
  },
  text: {
    marginTop: 30,
    marginHorizontal: 20,
    fontSize: 15,
    textAlign: 'justify',
  },
  fullscreenButton: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    paddingRight: 10,
  },
  controlOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  wrapper: {
    flex: 1,
  },
  timeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  timeLeft: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    paddingLeft: 10,
  },
  timeRight: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'right',
    paddingRight: 10,
  },
});
