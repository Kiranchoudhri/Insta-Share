import './index.css'
import {Link, withRouter} from 'react-router-dom'
import {BsHeart} from 'react-icons/bs'
import {FcLike} from 'react-icons/fc'
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'

const Postcard = props => {
  const {eachPost, isLiked, onClickLike, onClickUnlike} = props
  const {
    comments,
    createdAt,
    likesCount,
    postDetails,
    profilePic,
    userId,
    userName,
    postId,
  } = eachPost
  const {caption, imageUrl} = postDetails
  console.log('initial', isLiked)

  const incrementLike = () => {
    onClickLike(postId)
  }

  const decrementLike = () => {
    onClickUnlike(postId)
    console.log('dislike')
  }

  const toggleLikedClass = isLiked.includes(postId)
  console.log('likeList', isLiked)
  console.log('likeClass', toggleLikedClass)

  return (
    <li className="postcardContainer">
      <div className="cardProfile">
        <div className="backgroundProfileImage">
          <img
            className="profileImage"
            src={profilePic}
            alt="post author profile"
          />
        </div>
        <Link to={`users/${userId}`} className="postCardLinkItem">
          <p className="profileName">{userName}</p>
        </Link>
      </div>
      <img src={imageUrl} className="postImage" alt="post" />
      <div className="postCardFooter">
        <div className="userActionsContainer">
          {toggleLikedClass ? (
            <button
              className="actionBtn"
              type="button"
              onClick={decrementLike}
              //   testid="unLikeIcon"
            >
              <FcLike className="likeIcon" />
            </button>
          ) : (
            <button
              type="button"
              className="actionBtn"
              onClick={incrementLike}
              //   testid="likeIcon"
            >
              <BsHeart className="likeIcon" />
            </button>
          )}

          <button type="button" className="actionBtn">
            <FaRegComment className="commentIcon" />
          </button>
          <button type="button" className="actionBtn">
            <BiShareAlt className="shareIcon" />
          </button>
        </div>
        <p className="likesCount footerText">{likesCount} likes</p>
        <p className="caption footerText">{caption}</p>
        {comments.map(eachComment => (
          <div key={eachComment.userId} className="commentHistory">
            {/* <p className="commentedUser footerText"></p> */}
            <p className="comment footerText">
              <span className="commentedUser">{eachComment.userName}</span>
              {eachComment.comment}
            </p>
          </div>
        ))}
        <p className="postTime footerText">{createdAt}</p>
      </div>
    </li>
  )
}

export default withRouter(Postcard)
