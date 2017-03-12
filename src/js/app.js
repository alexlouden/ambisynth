import _ from 'underscore'
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


Tone.Buffer.on('load', e =>
    tracks.map(track => track.onLoad())
)

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

    if ($(this).val() == 0) {
        track.mute = true
    } else {
        track.volume = $(this).val()
    }
}

$('#mixer input').on('input', _.throttle(onChangeVolume, 30))
$('#mixer input').trigger('input')
