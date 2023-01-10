import './index.css'
import Slider from 'react-slick'

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 7,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 7,
        slidesToScroll: 1,
      },
    },

    {
      breakpoint: 600,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
  ],
}

const ImageSlider = props => {
  const {storiesList} = props
  console.log(storiesList)
  return (
    <ul className="imageSliderContainer">
      <Slider {...settings}>
        {storiesList.map(eachStory => {
          const {userId, storyUrl, userName} = eachStory
          return (
            <li className="slick-item" key={userId}>
              <div className="storyContainer">
                <img className="story-image" src={storyUrl} alt="user story" />
              </div>
              <p className="story-username">{userName}</p>
            </li>
          )
        })}
      </Slider>
    </ul>
  )
}

export default ImageSlider
