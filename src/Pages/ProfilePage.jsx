import { useContext } from "react";
import { Link } from 'react-router-dom';
import { UserContext } from "../providers/UserProvider";
import LoaderComponent from '../Components/LoaderComponent';
import ReviewsBlockComponent from '../Components/ReviewsBlockComponent'
import ProfileStyles from "../Styles/ProfilePage.module.css"
import { auth } from "../firebase";
import {getReviewsByUser} from "../firestore"

const ProfilePage = () => {

  //Set Tab Name:
  document.title = "Profile Page";

  const user = useContext(UserContext);
  const [reviews, setReviews] = useState([]);
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

  
  useEffect(async () => {
    try {
      const rvws = await getReviewsByUser(user.uid)
      setReviews(rvws);
    } catch (e) {
      console.error(e);
      // error occured, maybe show user the error
    }
  }, [user.uid]);

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
                {user.displayName}
              </div>

              <div className={ProfileStyles.userGradYearBox}>
                {user.email}
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