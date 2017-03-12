import _ from 'underscore'
import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jQuery'
import Tone from 'Tone'

class Track {

    constructor(filename, label) {
        this.filename = './assets/' + filename + '.mp3'
        this.label = label
        this.player = new Tone.Player({
            "url" : this.filename,
            "loop" : true,
            "autostart": false
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

// <div>
//     <h5>Bass</h5>
//     <input type="range" min="0" value="50" max="100" step="1">
//     <button>mute</button>
//     <button>solo</button>
// </div>


Tone.Buffer.on('load', e => {
    tracks.map(track => track.onLoad())
    $('.slider input').trigger('input')
})

$('#mixer .mute').on('click', e => {
    e.preventDefault()
    let id = $(this).closest('.slider').index()
    let track = tracks[id]
    let input = $(this).siblings('input')
    debugger
    if (track.mute) {
        input.val(50)
    } else {
        input.val(0)
    }
    input.trigger('input')
})


let onChangeVolume = function(e) {

    let id = $(this).closest('.slider').index()
    let track = tracks[id]

    track.volume = $(this).val()
}

// Throttle per slider, not across all sliders
$('.slider input').each( (id, obj) =>
    $(obj).on('input', _.throttle(onChangeVolume, 30))
)


class Slider extends React.Component {
  render() {
    return (
      <div>
        <h5>{this.props.name}</h5>
        <input type="range" min="0" value="50" max="100" step="1"/>
        <button className="mute">mute</button>
        <button className="solo">solo</button>
      </div>
    )
  }
}

class SliderList extends React.Component {

  render() {
    return (
      <div>
        {this.props.tracks.map( track =>
          <Slider name={track.name}/>
        )}
      </div>
    )
  }
}

ReactDOM.render(
  <SliderList tracks={tracks}/>,
  document.getElementById('mixer')
);
