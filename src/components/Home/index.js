import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import './index.css'
import Header from '../Header'
import ImageSlider from '../ImageSlider'
import Postcard from '../Postcard'

const apiConstants = {
  initial: 'INITIAL',
  progress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    storiesList: [],
    postsList: [],
    searchedPostsList: [],
    storiesApiStatus: apiConstants.initial,
    postsApiStatus: apiConstants.initial,
    searchApiStatus: apiConstants.initial,
    isLiked: [],
    searchText: '',
    showSearchView: false,
  }

  componentDidMount() {
    this.getStories()
    this.getPosts()
  }

  onChangeSearch = value => {
    this.setState({searchText: value})
  }

  getStories = async () => {
    this.setState({storiesApiStatus: apiConstants.progress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/insta-share/stories'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log(data)
    if (response.ok) {
      const modifiedData = data.users_stories.map(eachStory => ({
        storyUrl: eachStory.story_url,
        userId: eachStory.user_id,
        userName: eachStory.user_name,
      }))
      this.setState({
        storiesList: modifiedData,
        storiesApiStatus: apiConstants.success,
      })
    } else {
      this.setState({storiesApiStatus: apiConstants.failure})
    }
  }

  getPosts = async () => {
    this.setState({postsApiStatus: apiConstants.progress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/insta-share/posts'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log(data)
    if (response.ok) {
      const modifiedData = data.posts.map(eachPost => ({
        comments: eachPost.comments.map(eachComment => ({
          comment: eachComment.comment,
          userId: eachComment.user_id,
          userName: eachComment.user_name,
        })),
        createdAt: eachPost.created_at,
        likesCount: eachPost.likes_count,
        postDetails: {
          caption: eachPost.post_details.caption,
          imageUrl: eachPost.post_details.image_url,
        },
        postId: eachPost.post_id,
        profilePic: eachPost.profile_pic,
        userId: eachPost.user_id,
        userName: eachPost.user_name,
      }))
      console.log('post', modifiedData)
      this.setState({
        postsList: modifiedData,
        postsApiStatus: apiConstants.success,
      })
    } else {
      this.setState({postsApiStatus: apiConstants.failure})
    }
  }

  getLikes = async postId => {
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/insta-share/posts/${postId}/like`
    const likeStatus = {like_status: true}
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'POST',
      body: JSON.stringify(likeStatus),
    }
    const response = await fetch(apiUrl, options)
    console.log('like', response)
    const data = await response.json()
    const {postsList} = this.state
    this.setState({
      postsList: postsList.map(eachPost => {
        if (eachPost.postId === postId) {
          return {...eachPost, likesCount: eachPost.likesCount + 1}
        }
        return eachPost
      }),
    })
  }

  getUnlike = async postId => {
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/insta-share/posts/${postId}/like`
    const likeStatus = {like_status: false}
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'POST',
      body: JSON.stringify(likeStatus),
    }
    const response = await fetch(apiUrl, options)
    console.log('unlike', response)
    const data = await response.json()
    const {postsList} = this.state

    this.setState({
      postsList: postsList.map(eachPost => {
        if (eachPost.postId === postId) {
          return {...eachPost, likesCount: eachPost.likesCount - 1}
        }
        return eachPost
      }),
    })
  }

  getSearchPosts = async () => {
    this.setState({searchApiStatus: apiConstants.progress})
    const {searchText} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/insta-share/posts?search=${searchText}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log('noResult', response)
    console.log('search', data)
    if (response.ok && data.posts.length > 0) {
      const modifiedData = data.posts.map(eachPost => ({
        comments: eachPost.comments.map(eachComment => ({
          comment: eachComment.comment,
          userId: eachComment.user_id,
          userName: eachComment.user_name,
        })),
        createdAt: eachPost.created_at,
        likesCount: eachPost.likes_count,
        postDetails: {
          caption: eachPost.post_details.caption,
          imageUrl: eachPost.post_details.image_url,
        },
        postId: eachPost.post_id,
        profilePic: eachPost.profile_pic,
        userId: eachPost.user_id,
        userName: eachPost.user_name,
      }))
      console.log('post', modifiedData)
      this.setState({
        searchedPostsList: modifiedData,
        searchApiStatus: apiConstants.success,
      })
    } else if (response.ok && data.posts.length === 0) {
      this.setState({
        searchApiStatus: apiConstants.success,
        searchedPostsList: [],
      })
    } else {
      this.setState({searchApiStatus: apiConstants.failure})
    }
  }

  onClickGetSearchPosts = () => {
    this.setState({showSearchView: true})
    this.getSearchPosts()
  }

  onClickLike = postId => {
    const {isLiked} = this.state
    this.setState({isLiked: [...isLiked, postId]})
    this.getLikes(postId)
  }

  onClickUnlike = postId => {
    const {isLiked} = this.state
    const filterLiked = isLiked.filter(eachPost => eachPost !== postId)
    this.setState({isLiked: filterLiked})
    this.getUnlike(postId)
  }

  reloadPosts = () => {
    this.getPosts()
  }

  reloadStories = () => {
    this.getStories()
  }

  reloadSearchPosts = () => {
    this.getSearchPosts()
  }

  renderStoryLoadingView = () => (
    <div className="loader-container storiesLoader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderStoriesSuccessView = () => {
    const {storiesList} = this.state
    return <ImageSlider storiesList={storiesList} />
  }

  renderStoriesFailureView = () => (
    <div className="StoriesFailureContainer">
      <img
        src="https://res.cloudinary.com/dcva6xwxy/image/upload/v1673087819/alert-triangle_1_ndlytv.png"
        alt="failure view"
        className="postsFailureImage"
      />
      <p className="postsFailureInfo">Something went wrong. Please try again</p>
      <button
        type="button"
        className="postTryAgainBtn"
        onClick={this.reloadStories}
      >
        Try Again
      </button>
    </div>
  )

  renderPostsLoadingView = () => (
    <div className="postsLoaderWrapper">
      <div className="loader-container postsLoader">
        <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
      </div>
    </div>
  )

  renderPostsSuccessView = () => {
    const {postsList, isLiked} = this.state
    return (
      <ul className="postsContainer">
        {postsList.map(eachPost => (
          <Postcard
            key={eachPost.postId}
            eachPost={eachPost}
            isLiked={isLiked}
            onClickLike={this.onClickLike}
            onClickUnlike={this.onClickUnlike}
          />
        ))}
      </ul>
    )
  }

  renderPostsFailureView = () => (
    <div className="postsFailureContainer">
      <img
        src="https://res.cloudinary.com/dcva6xwxy/image/upload/v1673087819/alert-triangle_1_ndlytv.png"
        alt="failure view"
        className="postsFailureImage"
      />
      <p className="postsFailureInfo">Something went wrong. Please try again</p>
      <button
        type="button"
        className="postTryAgainBtn"
        onClick={this.reloadPosts}
      >
        Try Again
      </button>
    </div>
  )

  renderSearchSuccessView = () => {
    const {searchedPostsList, isLiked} = this.state
    console.log('searchList', searchedPostsList)
    return (
      <div>
        {searchedPostsList.length > 0 ? (
          <div>
            <h1 className="searchResultsTitle">Search Results</h1>
            <ul className="searchResultsWrapper">
              {searchedPostsList.map(eachPost => (
                <Postcard
                  key={eachPost.postId}
                  eachPost={eachPost}
                  isLiked={isLiked}
                  onClickLike={this.onClickLike}
                  onClickUnlike={this.onClickUnlike}
                />
              ))}
            </ul>
          </div>
        ) : (
          <div className="search-not-found-container">
            <img
              className="noSearchImage"
              src="https://res.cloudinary.com/dcva6xwxy/image/upload/v1673004292/No_search_h8opeq.png"
              alt="search not found"
            />
            <h1 className="noSearchTitle">Search Not Found</h1>
            <p className="noSearchInfo">
              Try different keyword or search again
            </p>
          </div>
        )}
      </div>
    )
  }

  renderSearchFailureView = () => (
    <div className="postsFailureContainer">
      <img
        src="https://res.cloudinary.com/dcva6xwxy/image/upload/v1673087819/alert-triangle_1_ndlytv.png"
        alt="failure view"
        className="postsFailureImage"
      />
      <p className="postsFailureInfo">Something went wrong. Please try again</p>
      <button
        type="button"
        className="postTryAgainBtn"
        onClick={this.reloadSearchPosts}
      >
        Try again
      </button>
    </div>
  )

  toggleStoriesView = () => {
    const {storiesApiStatus} = this.state
    switch (storiesApiStatus) {
      case apiConstants.progress:
        return this.renderStoryLoadingView()
      case apiConstants.success:
        return this.renderStoriesSuccessView()
      case apiConstants.failure:
        return this.renderStoriesFailureView()
      default:
        return null
    }
  }

  togglePostsView = () => {
    const {postsApiStatus} = this.state
    switch (postsApiStatus) {
      case apiConstants.progress:
        return this.renderPostsLoadingView()
      case apiConstants.success:
        return this.renderPostsSuccessView()
      case apiConstants.failure:
        return this.renderPostsFailureView()
      default:
        return null
    }
  }

  toggleSearchView = () => {
    const {searchApiStatus} = this.state
    switch (searchApiStatus) {
      case apiConstants.progress:
        return this.renderPostsLoadingView()
      case apiConstants.success:
        return this.renderSearchSuccessView()
      case apiConstants.failure:
        return this.renderSearchFailureView()
      default:
        return null
    }
  }

  toggleSearchPostsView = () => {
    const {showSearchView} = this.state

    switch (showSearchView) {
      case true:
        return this.toggleSearchView()
      case false:
        return this.togglePostsView()
      default:
        return null
    }
  }

  render() {
    const {searchText, showSearchView} = this.state
    return (
      <div className="homeContainer">
        <Header
          onChangeSearch={this.onChangeSearch}
          searchText={searchText}
          onClickGetSearchPosts={this.onClickGetSearchPosts}
        />
        <div className="homeContentsWrapper">
          {!showSearchView && this.toggleStoriesView()}
          {this.toggleSearchPostsView()}
        </div>
      </div>
    )
  }
}

export default Home
