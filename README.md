#Audio2Day - bringing Audio to Twoday

Full German documentation and demo [here](http://cdn.twoday.net/stories/audioplayer).

##Features
This jQuery Script enables easy HTML audio integration for blogs on the [Twoday Blogger Platform](http://twoday.net). The Twoday Platform does currently not support modern HTML5 and filters out any ```audio``` or ```source``` tag from a story's text/code content in its editor. Therefore the adapted audio syntax uses simple HTML4-compatible DIV-classes which tell the script to inject the correct audio/source-tag for the desired target audio.

The **audio2day** script mainly relies on the awesome responsive "Audio Player"-solution from [Osvaldas Valutis](www.osvaldas.info), which has been slightly adapted to cope with the above Twoday restrictions.

The DIV triggering the audio code must carry the special class **"audio"** and parametrize the song (e.g. MP3) in its ```title``` attribute. You may want to add the class "autoplay" to start the song automatically (does not work on some Android browsers) and/or the class "loop" to restart the song at the end. The song title (descriptive text) may be included within the DIV's innerText:

    <div class="audio autoplay loop" title="http://myurl/myway.mp3">My Way by Frank Sinatra</div>

Since the Audio Player is fully responsive, the DIV's width reacts to any change caused by static CSS definitions or dynamic user window size changes.

##Getting started
###A. Script & CSS
####jQuery
Twoday Bloggers need to activate the standard jQuery module at _Admin_ &rarr; _Module_ &rarr; _Extension Module_ &rarr; _jQuery Integration_.

Other script users need to make sure that the latest jQuery script is being loaded prior to embedding the audio2day script:

    <script src="http://code.jquery.com/jquery-latest.min.js"></script>

####Audio2Day.js
Then, after the jQuery, embed the following script-tag at the end of your HTML's body-tag

    <script src="http://static.twoday.net/cdn/files/audio2day-min-js.js"></script>
    <script type="text/javascript">
         $(document).ready(function(){
             $(".audio").audio2day({options});
         });
    </script>

`{Options}` may consist of a number of key/value pairs which are described under **Usage** on [Osvaldas Valutis' component page](http://osvaldas.info/audio-player-responsive-and-touch-friendly).

####Audio2Day.css
The audio2day component comes with a predefined styling similar to Osvaldas demopage. The related LESS-file is included here on Github and may be adapted to your own needs and styling desires. The predefined minified CSS is also available from the Twoday CDN blog

    <link href="http://static.twoday.net/cdn/files/audio2day-min-css.css" rel="stylesheet">

and should be included in your HTML's head area.

###B. The HTML

Here are a couple of usage examples for the Audio-DIV:

* MP3, no song title included:<br>
`<div class="audio" title="http://myowncloudurl/somesong.mp3"></div>`
* MP3, no song title, fixed width:<br>
`<div class="audio" title="http://myowncloudurl/someother.mp3" style="width:400px"></div>`
* MP3, song title embedded, autoplay and loop:<br>
`<div class="audio autoplay loop" title="http://https://googledrive.com/host/0B87rILW4RVIJYkRIWjFZSjVNUkE/Jeopardy.mp3">The Jeopardy song</div>`

If you don't specify a **width** on the Audio-DIV-tag (or its CSS), the audio bar uses the width of its parent DIV container.