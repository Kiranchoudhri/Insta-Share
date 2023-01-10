import {Component} from 'react'
import './index.css'
import Cookies from 'js-cookie'
import {GiHamburgerMenu} from 'react-icons/gi'
import {IoCloseCircle} from 'react-icons/io5'

import {FaSearch} from 'react-icons/fa'
import {Link, withRouter} from 'react-router-dom'

class Header extends Component {
  state = {menuDropdown: false, searchVisible: false}

  updateSearch = e => {
    const {onChangeSearch} = this.props
    onChangeSearch(e.target.value)
  }

  searchPosts = () => {
    const {onClickGetSearchPosts} = this.props
    onClickGetSearchPosts()
  }

  onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = this.props
    history.replace('/login')
  }

  onClickShowMenu = () => {
    this.setState({menuDropdown: true})
  }

  onClickCloseMenu = () => {
    this.setState({menuDropdown: false})
  }

  onClickMenuSearch = () => {
    this.setState({searchVisible: true})
  }

  render() {
    const {searchText} = this.props
    const {menuDropdown, searchVisible} = this.state
    return (
      <div className="headerWrapper">
        <div className="headerContainer">
          <div className="headerLogoTitleContainer">
            <Link to="/" className="linkElement">
              <img
                className="websiteLogoHeader"
                alt="website logo"
                src="https://res.cloudinary.com/dcva6xwxy/image/upload/v1672811032/Group_lcpog9.png"
              />
            </Link>
            <h1 className="headerWebsiteHeading">Insta Share</h1>
          </div>
          <div className="navbarOptions">
            <div className="searchContainer">
              <input
                type="search"
                className="searchFeature"
                placeholder="Search Caption"
                onChange={this.updateSearch}
                value={searchText}
              />
              <button
                className="searchIconBtn"
                type="button"
                onClick={this.searchPosts}
                // testid="searchIcon"
              >
                <FaSearch className="searchIcon" />
              </button>
            </div>
            <ul className="navItemsList">
              <Link to="/" className="linkElement">
                <li className="navItem">Home</li>
              </Link>
              <Link to="/my-profile" className="linkElement">
                <li className="navItem">Profile</li>
              </Link>
            </ul>
            <button
              type="button"
              className="logoutBtn"
              onClick={this.onClickLogout}
            >
              Logout
            </button>
          </div>
          <div className="menuIconContainer">
            <button
              type="button"
              className="menuBtn"
              onClick={this.onClickShowMenu}
            >
              <GiHamburgerMenu className="menuIcon" />
            </button>
          </div>
        </div>
        <div className="menuOptions">
          {menuDropdown && (
            <ul className="navItemsList">
              <Link to="/" className="linkElement">
                <li className="navItem">Home</li>
              </Link>
              <li className="navItem" onClick={this.onClickMenuSearch}>
                Search
              </li>
              <Link to="/my-profile" className="linkElement">
                <li className="navItem">Profile</li>
              </Link>
              <li className="navItem">
                <button
                  type="button"
                  className="logoutBtn"
                  onClick={this.onClickLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
          {menuDropdown && (
            <button
              type="button"
              className="closeIconBtn"
              onClick={this.onClickCloseMenu}
            >
              <IoCloseCircle className="closeIcon" />
            </button>
          )}
        </div>
        {searchVisible && (
          <div className="searchContainer menuSearch">
            <input
              type="search"
              className="searchFeature"
              placeholder="Search Caption"
              onChange={this.updateSearch}
              value={searchText}
            />
            <button
              className="searchIconBtn"
              type="button"
              onClick={this.searchPosts}
              //   testid="searchIcon"
            >
              <FaSearch className="searchIcon" />
            </button>
          </div>
        )}
      </div>
    )
  }
}

export default withRouter(Header)
