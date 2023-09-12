/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *

 * @format
 * @flow strict-local
 */

import React from 'react';
import { Router, Scene, Stack } from 'react-native-router-flux';
import {
  Analysis,
  Announcements,
  Boards,
  Branches,
  BuyPackages,
  CalendarNew,
  ChangePassword,
  Chapters,
  ConceptVideo,
  ContactUs,
  Dashboard,
  EditProfile,
  ForgotPassword,
  Games,
  Grades,
  HeatMap,
  LeaderBoard,
  LiveClassList,
  LiveSessionActivity,
  Login,
  NormalVideo,
  Notifications,
  Otp,
  PdfViewNew,
  Practice,
  PracticeAssesment,
  PracticeChapter,
  PracticeReview,
  PracticeSolutions,
  PracticeSummary,
  PreAssesment,
  PrePaperAssesment,
  PrePaperReview,
  PrePaperSolutions,
  PrePaperSummary,
  PreQuestionPapers,
  PreSolutions,
  PreSummary,
  PreviousPapers,
  ProVideoView,
  ProWebLinkView,
  ProfConceptVideo,
  ProfNormalVideo,
  ProfPdfViewNew,
  ProfPreAssesment,
  Profile,
  ProgressTopics,
  RecommededTopicsMain,
  ReferView,
  Register,
  ReviewPostSummary,
  SearchPage,
  Settings,
  Subjects,
  Survey,
  TopicAnalysis,
  TopicMainView,
  Topics,
  VideoView,
  ViewLiveClass,
  WebLinkView,
} from './src/containers';

import Sample from './Sample';
import LoadingScreen from './src/containers/LoadingScreen';
import VersionUpdate from './src/containers/Versionupdate';

const App = () => {
  return (
    <Router>
      <Stack key="root" hideNavBar>
        <Scene key="sample" component={Sample} />

        <Scene key="loadingscreen" component={LoadingScreen} initial />
        <Scene key="versionupdate" component={VersionUpdate} />

        <Scene key="login" component={Login} />
        <Scene key="register" component={Register} />
        <Scene key="forgotPassword" component={ForgotPassword} />
        <Scene key="otp" component={Otp} />
        <Scene key="boards" component={Boards} />
        <Scene key="grades" component={Grades} />
        <Scene key="branches" component={Branches} />
        <Scene key="subjects" component={Subjects} />
        <Scene key="dashboard" component={Dashboard} />
        <Scene key="chapters" component={Chapters} />
        <Scene key="calendar" component={CalendarNew} />
        <Scene key="topics" component={Topics} />
        <Scene key="topicanalysis" component={TopicAnalysis} />
        <Scene key="preassesment" component={PreAssesment} />
        <Scene key="presummary" component={PreSummary} />
        <Scene key="presolutions" component={PreSolutions} />

        <Scene key="normalvideoview" component={NormalVideo} />
        <Scene key="weblinkview" component={WebLinkView} />
        <Scene key="topicmainview" component={TopicMainView} />
        <Scene key="progresstopics" component={ProgressTopics} />
        <Scene key="previouspapers" component={PreviousPapers} />
        <Scene key="prequestionpapers" component={PreQuestionPapers} />
        <Scene key="reviewpostsummary" component={ReviewPostSummary} />
        <Scene key="prepaperassesment" component={PrePaperAssesment} />
        <Scene key="prepapersummary" component={PrePaperSummary} />
        <Scene key="prepapersolutions" component={PrePaperSolutions} />
        <Scene key="prepaperreview" component={PrePaperReview} />

        <Scene key="practice" component={Practice} />
        <Scene key="practicechapter" component={PracticeChapter} />
        <Scene key="practiceassesment" component={PracticeAssesment} />
        <Scene key="practicesummary" component={PracticeSummary} />
        <Scene key="practicesolutions" component={PracticeSolutions} />
        <Scene key="practicereview" component={PracticeReview} />

        <Scene key="pdfview" component={PdfViewNew} />
        <Scene key="referview" component={ReferView} />
        <Scene key="changepassword" component={ChangePassword} />
        <Scene key="contactus" component={ContactUs} />
        <Scene key="notifications" component={Notifications} />
        <Scene key="profile" component={Profile} />
        <Scene key="editprofile" component={EditProfile} />
        <Scene key="analysis" component={Analysis} />
        <Scene key="games" component={Games} />
        <Scene key="settings" component={Settings} />
        <Scene key="announcements" component={Announcements} />
        <Scene key="leaderboard" component={LeaderBoard} />
        <Scene key="livesessionactivity" component={LiveSessionActivity} />
        <Scene key="liveclasslist" component={LiveClassList} />
        <Scene key="viewliveclass" component={ViewLiveClass} />

        <Scene key="buypackages" component={BuyPackages} />
        <Scene key="survey" component={Survey} />

        <Scene key="heatmap" component={HeatMap} />
        <Scene key="recommendedtopics" component={RecommededTopicsMain} />
        <Scene key="conceptvideo" component={ConceptVideo} />
        <Scene key="videoview" component={VideoView} />

        <Scene key="searchpage" component={SearchPage} />

        <Scene key="ProWebLinkView" component={ProWebLinkView} />
        <Scene key="ProfPdfViewNew" component={ProfPdfViewNew} />
        <Scene key="ProVideoView" component={ProVideoView} />
        <Scene key="ProfConceptVideo" component={ProfConceptVideo} />
        <Scene key="ProfNormalVideo" component={ProfNormalVideo} />
        <Scene key="ProfPreAssesment" component={ProfPreAssesment} />
      </Stack>
    </Router>
  );
};

export default App;
