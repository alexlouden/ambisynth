import _ from 'underscore'
import $ from 'jQuery'
import Tone from 'Tone'

class Track {
    constructor(filename, label) {
        this.filename = './assets/' + filename + '.mp3'
        this.label = label
    }
}

let tracks = [
    new Track('track1/1-Bass', 'Bass'),
    new Track('track1/2-Emotion', 'Emotion'),
    new Track('track1/3-Glass', 'Glass'),
    new Track('track1/4-Hats', 'Hats'),
    new Track('track1/5-Kicks', 'Kick'),
    new Track('track1/6-Beads', 'Beads')
];

// <div>
//     <h5>Bass</h5>
//     <input type="range" min="0" value="50" max="100" step="1">
//     <button>mute</button>
//     <button>solo</button>
// </div>

let players = _.map(tracks, function(track){
    return new Tone.Player({
        "url" : track,
        "loop" : true,
        "autostart": false
    });
})

Tone.Buffer.on('load', function(e){
    console.log('loaded');
    _.each(players, function(player){
        player.toMaster();
        player.start();
    });
})

$('#tracks button').on('click', function(e){
    e.preventDefault();
    let id = $(this).parent().index();
    let player = players[id];
    let input = $(this).siblings('input');
    if (player.mute) {
        input.val(50);
    } else {
        input.val(0);
    }
    input.trigger('input');
})

$('#tracks input').on('input', function(e){
    let id = $(this).parent().index();
    let player = players[id];

    if ($(this).val() == 0){
        player.mute = true;
    } else {
        player.mute = false;
        let perc = $(this).val() / 100;
        let vol = 20 * Math.log(perc);
        player.volume.value = vol;
    }
})

$('#tracks input').trigger('input');
