import _ from 'underscore'
import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jQuery'
import Tone from 'Tone'

class Track {

  constructor(filename, name) {
    this.filename = './assets/' + filename + '.mp3'
    this.name = name
    this.player = new Tone.Player({
      url: this.filename,
      loop: true,
      autostart: false
    })
  }

  onLoad() {
    this.player.toMaster()
    this.player.start()
  }

  get mute() {
    return this.player.mute
  }
  set mute(val) {
    this.player.mute = val
  }

  get volume() {
    let db = this.player.volume.value
    return Math.exp(db / 20) * 100
  }
  set volume(perc) {

    if (perc == 0) {
      this.mute = true
      return
    }

    // Set volume as percentage 0-100
    let db = 20 * Math.log(perc / 100)
    this.player.volume.value = db
    this.mute = false
  }
}

const tracks = [
  new Track('track1/1-Bass', 'Bass'),
  new Track('track1/2-Emotion', 'Emotion'),
  new Track('track1/3-Glass', 'Glass'),
  new Track('track1/4-Hats', 'Hats'),
  new Track('track1/5-Kicks', 'Kick'),
  new Track('track1/6-Beads', 'Beads')
]
window.tracks = tracks


Tone.Buffer.on('load', e => {
    tracks.map(track => track.onLoad())
    $('.slider input').trigger('input')
})


class VolumeSlider extends React.Component {

  constructor(props) {
    super(props)
    this.state = {volume: 50, previousVolume: 50}
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    this.setState({volume: event.target.value})
    this.props.track.volume = this.state.volume
  }

  render() {
    return (
      <div className="range">
        <input type="range" min="0" value={this.state.volume} max="100" step="1" onChange={this.handleChange}/>
      </div>
    )
  }
}

class ToggleButton extends React.Component {

  constructor(props) {
    super(props)
    this.state = {active: false}
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(event) {
    this.setState({active: !this.state.active})

    // Call parent
    this.props.onToggle(!this.state.active)
  }

  render() {
    let activeClass = this.state.active ? 'active' : ''
    let className = this.props.name + ' ' + activeClass
    return (
      <button className={className} onClick={this.handleClick}>{this.props.name}</button>
    )
  }
}


class Slider extends React.Component {

  constructor(props) {
    super(props)
    this.onToggleMute = this.onToggleMute.bind(this)
    this.onToggleSolo = this.onToggleSolo.bind(this)
    this.solo = false
    this.mute = false
  }

  onToggleMute(active) {
    this.setState({'mute': active})
    this.muteSlider(active)

    this.mute = active
    this.props.update()
  }

  muteSlider(active) {
    if (active) {
      // toggle mute on - save volume
      let currentVolume = this.slider.state.volume;
      if (currentVolume > 0) {
        this.slider.setState({previousVolume: currentVolume})
      }
      // slide to volume 0
      this.slider.setState({volume: 0})

    } else {
      // toggle mute off - restore volume
      this.slider.setState({volume: this.slider.state.previousVolume})
    }

    // mute Tone
    this.props.track.mute = active
  }

  onToggleSolo(active) {
    this.solo = active

    if (active) {
      this.slider.setState({volume: this.slider.state.volume})
    }

    this.props.update()
  }

  render() {
    return (
      <div className="slider">
        <h5>{this.props.track.name}</h5>
        <ToggleButton name="mute" key={this.props.id} onToggle={this.onToggleMute} ref={b => this.muteButton = b}/>
        <ToggleButton name="solo" key={this.props.id} onToggle={this.onToggleSolo} ref={b => this.soloButton = b}/>
        <VolumeSlider track={this.props.track} key={this.props.id} ref={input => this.slider = input}/>
      </div>
    )
  }
}

class SliderList extends React.Component {

  constructor(props) {
    super(props)
    this.update = this.update.bind(this)
  }

  update() {

    let soloEnabled = _.any(_.mapObject(this.refs, slider => slider.solo ))

    _.mapObject(this.refs, (slider, id) => {

      let mute;
      if (soloEnabled) {
        // Mute if solo is enabled and this track doesn't have solo enabled
        mute = !slider.solo;
      } else {
        // Otherwise just use mute button
        mute = slider.mute;
      }
      slider.muteSlider(mute)
    })
  }

  render() {
    return (
      <div className="mixer">
        {this.props.tracks.map( (track, id) =>
          <Slider track={track} key={id} ref={id} update={this.update}/>
        )}
      </div>
    )
  }
}

ReactDOM.render(
  <SliderList tracks={tracks}/>,
  document.getElementById('main')
)