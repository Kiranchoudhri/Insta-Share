import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', showError: false, errorMessage: ''}

  onChangeUsername = e => {
    this.setState({username: e.target.value})
  }

  onChangePassword = e => {
    this.setState({password: e.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    console.log('login', this.props)
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  onSubmitFailure = message => {
    this.setState({showError: true, errorMessage: message})
  }

  submitForm = async e => {
    e.preventDefault()
    const {username, password} = this.state
    const userDetails = {
      username,
      password,
    }
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log(data)
    console.log(response)
    if (response.ok) {
      this.setState({showError: false})
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    const {username, password, showError, errorMessage} = this.state
    return (
      <div className="loginContainer">
        <img
          className="websiteImage"
          alt="website login"
          src="https://res.cloudinary.com/dcva6xwxy/image/upload/v1672810413/Layer_2_skgiu3.png"
        />
        <div className="loginForm">
          <div className="logoHeadingContainer">
            <img
              className="websiteLogo"
              alt="website logo"
              src="https://res.cloudinary.com/dcva6xwxy/image/upload/v1672811032/Group_lcpog9.png"
            />
            <h1 className="websiteHeading">Insta Share</h1>
          </div>
          <div className="formContainer">
            <form onSubmit={this.submitForm} className="userLoginForm">
              <div className="labelInputContainer">
                <label className="labelTitle" htmlFor="userInput">
                  Username
                </label>
                <input
                  className="inputField"
                  type="text"
                  id="userInput"
                  value={username}
                  onChange={this.onChangeUsername}
                />
              </div>
              <div className="labelInputContainer">
                <label className="labelTitle" htmlFor="userPassword">
                  Password
                </label>
                <input
                  className="inputField"
                  type="password"
                  id="userPassword"
                  value={password}
                  onChange={this.onChangePassword}
                />
              </div>
              <button className="loginBtn" type="submit">
                Login
              </button>
              {showError && <p className="errorMessage">{errorMessage}</p>}
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
