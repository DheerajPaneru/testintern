// import package and components

import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Dashboard from './views/Dashboard';
import Login from './views/Login';
import './App.css';
import Topbar from './views/Topbar';
import SideBar from './views/SideBar';
import AdminAccess from './AdminAccess';
import ChangePassword from './views/ChangePassword';
import UserManagement from './views/User/UserManagement';
import UserDetails from './views/User/UserDetails';
import AddUpdateUser from './views/User/AddUpdateUser';
import CMSManagement from './views/CMS/CMSManagement';
import ChildCMS from './views/CMS/ChildCMS';
import AddUpdateCmsDetails from './views/CMS/AddUpdateCMS';
import Faqs from './views/FAQS/Faqs';
import AddFaqs from './views/FAQS/AddFaqs';
import BannerManagement from './views/Banner/BannerManagement';
import AddUpdateBanner from './views/Banner/AddUpdateBanner';
import VideoManagement from './views/Video/VideoManagement';
import PlanManagement from './views/Plan/PlanManagement';
import AddUpdatePlan from './views/Plan/AddUpdatePlan';
import StoryList from './views/User/StoryList';

import CountryManagement from  './views/Location/CountryManagement'; 
import StateManagement from  './views/Location/StateManagement'; 
import CityManagement from  './views/Location/CityManagement'; 
import EnrollmentPlanManagement from './views/EnrollmentPlan/DataManagement';
import AddUpdateUserEnrollmentPlan from './views/EnrollmentPlan/AddUpdate';
import CategoryManagement from './views/Category/DataManagement';
import AddUpdateCategory from './views/Category/AddUpdate';
import StoryManagement from './views/Story/DataManagement';
import PoemManagement from './views/Poem/DataManagement';
import ContestManagement from './views/Contest/DataManagement';
import AddUpdateContest from './views/Contest/AddUpdate';
import AddUpdateStory from './views/Story/AddUpdate';
import AddUpdatePoem from './views/Poem/AddUpdate';
import SocialMedia from './views/SocialMedia/DataManagement';
import AddUpdateSocialMedia from './views/SocialMedia/AddUpdate';
import BadgeManagement from './views/Badge/DataManagement';
import AddUpdateBadge from './views/Badge/AddUpdate';
import AddUpdateVideo from './views/Video/AddUpdate';
import AudioManagement from './views/Audio/DataManagement';
import AddUpdateAudio from './views/Audio/AddUpdate';
import MoviesManagement from './views/Movies/DataManagement';
import AddUpdateMovies from './views/Movies/AddUpdate';
import ThumbnailManagement from './views/ContentThumbnail/DataManagement';
import UploadThumbnail from './views/ContentThumbnail/Upload';
import EventManagement from './views/Event/DataManagement';
import AddEvent from './views/Event/Add';

/* End */

class App extends Component {

  
  render() {
    

    return (
      <div>
        <Router>
          <Switch>
            <Route exact strict path="/" component={UploadThumbnail} />
            <Route exact strict path="/login" component={Login} />
            <Route component={DefaultContainer}/>
          </Switch>
         </Router>
      </div>
    )
  }
}
//To be change in to default router
const DefaultContainer = () => ( 
  <div>
    <Topbar />
    <div className="container-fluid">
    <div className="wrapper"> 
    <SideBar/>
        <AdminAccess exact strict path="/change-password/:id" component={ChangePassword} />
        <AdminAccess exact strict path="/dashboard" component={Dashboard} />
        <AdminAccess exact strict path="/user-management" component={UserManagement} />
        <AdminAccess exact strict path="/user-details/:id" component={UserDetails} />
        <AdminAccess exact strict path="/add-user" component={AddUpdateUser} />
        <AdminAccess exact strict path="/update-user/:id" component={AddUpdateUser} />
        <AdminAccess exact strict path="/cms-management" component={CMSManagement} />
        <AdminAccess exact strict path="/view-cms/:id" component={ChildCMS} />
        <AdminAccess exact strict path="/add-cms/:id/:type" component={AddUpdateCmsDetails} />
        <AdminAccess exact strict path="/edit-cms/:id/:type/:contentId" component={AddUpdateCmsDetails} />
        <AdminAccess exact strict path="/faqs-management" component={Faqs} />
        <AdminAccess exact strict path="/add-faqs" component={AddFaqs} />
        <AdminAccess exact strict path="/edit-faqs/:id" component={AddFaqs} />
        <AdminAccess exact strict path="/banner-management" component={BannerManagement} />
        <AdminAccess exact strict path="/update-banner/:id" component={AddUpdateBanner} />
        <AdminAccess exact strict path="/add-banner" component={AddUpdateBanner} />
        <AdminAccess exact strict path="/video-management" component={VideoManagement} /> 
        <AdminAccess exact strict path="/add-video" component={AddUpdateVideo}/>
        <AdminAccess exact strict path="/update-video/:id" component={AddUpdateVideo}/>
        <AdminAccess exact strict path="/plan-management" component={PlanManagement} />  
        <AdminAccess exact strict path="/add-plan" component={AddUpdatePlan} />  
        <AdminAccess exact strict path="/update-plan/:id" component={AddUpdatePlan} />  
        <AdminAccess exact strict path="/user-stories/:user_id" component={StoryList} /> 
        <AdminAccess exact strict path="/country-management" component={CountryManagement}/>
        <AdminAccess exact strict path="/state-management" component={StateManagement}/> 
        <AdminAccess exact strict path="/city-management" component={CityManagement}/> 
        <AdminAccess exact strict path="/membership-plan" component={EnrollmentPlanManagement}/>
        <AdminAccess exact strict path="/add-membership-plan" component={AddUpdateUserEnrollmentPlan}/>
        <AdminAccess exact strict path="/update-membership-plan/:id" component={AddUpdateUserEnrollmentPlan}/>
        <AdminAccess exact strict path="/category-management" component={CategoryManagement}/>
        <AdminAccess exact strict path="/add-category" component={AddUpdateCategory}/>
        <AdminAccess exact strict path="/update-category/:id" component={AddUpdateCategory}/>  
        <AdminAccess exact strict path="/story-management" component={StoryManagement}/>  
        <AdminAccess exact strict path="/poem-management" component={PoemManagement}/>  
        <AdminAccess exact strict path="/contest-management" component={ContestManagement}/>
        <AdminAccess exact strict path="/add-contest" component={AddUpdateContest}/>
        <AdminAccess exact strict path="/update-contest/:id" component={AddUpdateContest}/>
        <AdminAccess exact strict path="/create-story" component={AddUpdateStory}/>
        <AdminAccess exact strict path="/update-story/:id" component={AddUpdateStory}/>
        <AdminAccess exact strict path="/create-poem" component={AddUpdatePoem}/>
        <AdminAccess exact strict path="/update-poem/:id" component={AddUpdatePoem}/>
        <AdminAccess exact strict path="/social-media" component={SocialMedia}/>
        <AdminAccess exact strict path="/add-social-media" component={AddUpdateSocialMedia}/>
        <AdminAccess exact strict path="/badge-management" component={BadgeManagement}/>
        <AdminAccess exact strict path="/add-badge" component={AddUpdateBadge}/>
        <AdminAccess exact strict path="/update-badge/:id" component={AddUpdateBadge}/>
        <AdminAccess exact strict path="/audio-management" component={AudioManagement} /> 
        <AdminAccess exact strict path="/add-audio" component={AddUpdateAudio}/>
        <AdminAccess exact strict path="/update-audio/:id" component={AddUpdateAudio}/>
        <AdminAccess exact strict path="/movies-management" component={MoviesManagement} /> 
        <AdminAccess exact strict path="/add-movies" component={AddUpdateMovies}/>
        <AdminAccess exact strict path="/update-movies/:id" component={AddUpdateMovies}/>
        <AdminAccess exact strict path="/upload-thumbnail" component={UploadThumbnail}/>
        <AdminAccess exact strict path="/thumbnail-management" component={ThumbnailManagement}/>
        <AdminAccess exact strict path="/event-management" component={EventManagement}/>
        <AdminAccess exact strict path="/create-event" component={AddEvent}/>
      </div>
    </div>
  </div>
 )



export default App;