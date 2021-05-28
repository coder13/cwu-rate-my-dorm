import { useContext } from "react";
import { Link } from 'react-router-dom';
import LoaderComponent from '../Components/LoaderComponent';
import { UserContext } from "../providers/UserProvider";
import { auth } from "../firebase";
import ProfileStyles from "../Styles/ProfilePage.module.css";
import React, { useEffect, useState } from "react";
import {getReviewsByUser} from "../firestore";

const ProfilePage = () => {
  const user = useContext(UserContext);
  const [reviews, setReviews] = useState([]);

  useEffect(async () => {
    try {
      const rvws = await getReviewsByUser(user.uid)
      setReviews(rvws);
    } catch (e) {
      console.error(e);
      // error occured, maybe show user the error
    }
  }, [user.uid]);

  if (user === undefined) {

    return (
      <LoaderComponent />
    )

  } else if (user === null) {

    return (
      <Link to="/signin">
        Sign In
      </Link>
    )

  }

  const { photoURL, displayName, email } = user;
  
  return (
    <div className={ProfileStyles.windowDivSection}>
      
      <div className={ProfileStyles.mainSection}>
        
        <div className={ProfileStyles.userColumnSection}>

            <div className={ProfileStyles.userInfo}>
              
              <div className={ProfileStyles.userImageBox}>
              <div
                  style={{
                    background: `url(${photoURL || 'https://res.cloudinary.com/dqcsk8rsc/image/upload/v1577268053/avatar-1-bitmoji_upgwhc.png'})  no-repeat center center`,
                    backgroundSize: "cover",
                    height: "250px",
                    width: "250px"
                  }}
                />
              </div>

              <div className={ProfileStyles.userNameBox}>
                {displayName}
              </div>

              <div className={ProfileStyles.userGradYearBox}>
                {email}
              </div>

            </div>

            <div className={ProfileStyles.userColumnSpacer}>
              User Column Spacer
            </div>

        </div>

        <div className={ProfileStyles.userReviewSection}>
          Reviews Section
        </div>

      </div>

    </div>
  ) 
};

export default ProfilePage;