import React, { useState, useEffect, useContext } from "react";
import { Link } from 'react-router-dom';
import { UserContext } from "../providers/UserProvider";
import LoaderComponent from '../Components/LoaderComponent';
import ReviewsBlockComponent from '../Components/ReviewsBlockComponent'
import ProfileStyles from "../Styles/ProfilePage.module.css"
import { getReviewsByUser } from "../firestore"

const ProfilePage = () => {

  //Set Tab Name:
  document.title = "Profile Page";

  const user = useContext(UserContext);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const getReviews = async () => {
      console.log('fetching reviews', user.uid);
      try {
        const rvws = await getReviewsByUser(user.uid);
        setReviews(rvws);
      } catch (e) {
        console.error(e);
        // error occured, maybe show user the error
      }
    }

    if (user?.uid) {
      getReviews();
    }
  }, [user]);

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
  
  return (
    <div className={ProfileStyles.windowDivSection}>
      
      <div className={ProfileStyles.mainSection}>
        
        <div className={ProfileStyles.userColumnSection}>

          <div className={ProfileStyles.userInfo}>
            
            <div className={ProfileStyles.userImageBox}>
              <div
                style={{
                  background: `url(${user.photoURL || 'https://res.cloudinary.com/dqcsk8rsc/image/upload/v1577268053/avatar-1-bitmoji_upgwhc.png'})  no-repeat center center`,
                  backgroundSize: "cover",
                  height: "250px",
                  width: "250px"
                }}
              />
            </div>

            <div className={ProfileStyles.userNameBox}>
              {user.displayName}
            </div>

            <div className={ProfileStyles.userGradYearBox}>
              {user.email} {/* should be changed to grad year */}
            </div>

          </div>
        </div>

        <div className={ProfileStyles.userReviewSection}>
          <p>{reviews.length} reviews</p>
          <ReviewsBlockComponent reviews={reviews} />
        </div>

      </div>

    </div>
  ) 
};

export default ProfilePage;