var tracks = [
    './audio/1/1-Bass.mp3',
    './audio/1/2-Emotion.mp3',
    './audio/1/3-Glass.mp3',
    './audio/1/4-Hats.mp3',
    './audio/1/5-Kicks.mp3',
    './audio/1/6-Beads.mp3'
];

            // <div>
            //     <h5>Bass</h5>
            //     <input type="range" min="0" value="50" max="100" step="1">
            //     <button>shh</button>
            // </div>
            // <div>
            //     <h5>Emotion</h5>
            //     <input type="range" min="0" value="50" max="100" step="1">
            //     <button>shh</button>
            // </div>
            // <div>
            //     <h5>Glass</h5>
            //     <input type="range" min="0" value="50" max="100" step="1">
            //     <button>shh</button>
            // </div>
            // <div>
            //     <h5>Hats</h5>
            //     <input type="range" min="0" value="50" max="100" step="1">
            //     <button>shh</button>
            // </div>
            // <div>
            //     <h5>Kick</h5>
            //     <input type="range" min="0" value="50" max="100" step="1">
            //     <button>shh</button>
            // </div>
            // <div>
            //     <h5>Beads</h5>
            //     <input type="range" min="0" value="50" max="100" step="1">
            //     <button>shh</button>
            // </div>

var players = _.map(tracks, function(track){
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
    var id = $(this).parent().index();
    var player = players[id];
    var input = $(this).siblings('input');
    if (player.mute) {
        input.val(50);
    } else {
        input.val(0);
    }
    input.trigger('input');
})

$('#tracks input').on('input', function(e){
    var id = $(this).parent().index();
    var player = players[id];

    if ($(this).val() == 0){
        player.mute = true;
    } else {
        player.mute = false;
        var perc = $(this).val() / 100;
        var vol = 20 * Math.log(perc);
        player.volume.value = vol;
    }
})

$('#tracks input').trigger('input');
