import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'
import './index.css'
import Header from '../Header'

const apiConstants = {
  initial: 'INITIAL',
  progress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class MyProfile extends Component {
  state = {userProfileList: [], apiStatus: apiConstants.initial}

  componentDidMount() {
    this.getUserProfileDetails()
  }

  getUserProfileDetails = async () => {
    this.setState({apiStatus: apiConstants.progress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    console.log('userId', params)
    const {id} = params
    console.log('comingid', id)
    const apiUrl = `https://apis.ccbp.in/insta-share/users/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()
      console.log(data)

      const modifiedData = {
        followersCount: data.user_details.followers_count,
        followingCount: data.user_details.following_count,
        id: data.user_details.id,
        posts: data.user_details.posts,
        postsCount: data.user_details.posts_count,
        profilePic: data.user_details.profile_pic,
        stories: data.user_details.stories,
        userBio: data.user_details.user_bio,
        userId: data.user_details.user_id,
        userName: data.user_details.user_name,
      }

      this.setState({
        userProfileList: modifiedData,
        apiStatus: apiConstants.success,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  onClickRetry = () => {
    this.getUserProfileDetails()
  }

  renderLoadingView = () => (
    <div className="myProfileContainer">
      <Header />
      <div className="profileContentsWrapper">
        <div className="loader-container loaderUser">
          <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
        </div>
      </div>
    </div>
  )

  renderFailureView = () => (
    <div className="myProfileContainer">
      <Header />
      <div className="profileContentsWrapper">
        <div className="failureViewContainer">
          <img
            src="https://res.cloudinary.com/dcva6xwxy/image/upload/v1672985481/failure_image_jwtxx7.png"
            className="failureViewImage"
            alt="failure view"
          />
          <p className="failureViewMsg">
            Something went wrong. Please try again
          </p>
          <button
            type="button"
            className="tryAgainBtn"
            onClick={this.onClickRetry}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  )

  renderSuccessView = () => {
    const {userProfileList} = this.state

    const {
      followersCount,
      followingCount,
      postsCount,
      profilePic,
      posts,
      stories,
      userName,
      userBio,
      userId,
    } = userProfileList

    return (
      <div className="myProfileContainer">
        <Header />
        <div className="profileContentsWrapper">
          <div className="bioSection">
            <div className="profilePicContainer">
              <img className="profilePic" src={profilePic} alt="user profile" />
            </div>
            <ul className="bioTextContent">
              <li>
                <h1 className="profileUsername">{userName}</h1>
              </li>
              <li>
                <div className="profileAndStatsWrapper">
                  <div className="profilePicContainerSmall">
                    <img
                      className="profilePic"
                      src={profilePic}
                      alt="user profile"
                    />
                  </div>
                  <ul className="connectionStats">
                    <li className="commonTitle wholeTitle">
                      <span className="statsTitle">{postsCount}</span> posts
                    </li>
                    <li className="commonTitle wholeTitle">
                      <span className="statsTitle">{followersCount}</span>{' '}
                      followers
                    </li>
                    <li className="commonTitle wholeTitle">
                      <span className="statsTitle">{followingCount}</span>{' '}
                      following
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <p className="commonTitle profileUsernameSmall">{userId}</p>
              </li>
              <li>
                <p className=" commonTitle bio">{userBio}</p>
              </li>
            </ul>
          </div>
          <ul className="profileStoriesList">
            {stories &&
              stories.map(eachStory => (
                <li className="profile-story" key={eachStory.id}>
                  <div className="profileStoryWrapper">
                    <img
                      className="profileStoryImage"
                      src={eachStory.image}
                      alt="user story"
                    />
                  </div>
                </li>
              ))}
          </ul>
          <div className="profilePostsContainer">
            <div className="postsIconTitle">
              <BsGrid3X3 className="profilePostsIcon" />
              <h1 className="profilePostsTitle">Posts</h1>
            </div>
            {posts && posts.length > 0 ? (
              <ul className="profilePostsList">
                {posts &&
                  posts.map(eachPost => (
                    <li key={eachPost.id} className="profilePostItem">
                      <img
                        src={eachPost.image}
                        alt="user post"
                        className="profilePostImage"
                      />
                    </li>
                  ))}
              </ul>
            ) : (
              <div className="noPostsWrapper">
                <div className="noPostsContainer">
                  <BiCamera className="noPostsIcon" />
                </div>
                <h1 className="noPostsMsg">No Posts Yet</h1>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiConstants.progress:
        return this.renderLoadingView()
      case apiConstants.success:
        return this.renderSuccessView()
      case apiConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }
}

export default MyProfile
