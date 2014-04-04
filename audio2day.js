/*
    "audioPlayer" By Osvaldas Valutis, www.osvaldas.info
    Available for use under the MIT License

    Forked 3/2014 as "Audio2Day" by NeonWilderness (Adaption to the Twoday Blogger Platform)
    <div class="audio autoplay loop" title="https://googledrive.com/host/0B87rILW4RVIJYkRIWjFZSjVNUkE/Jeopardy.mp3">Jeopardy song</div>
*/
;(function( $, window, document, undefined )
{ "use strict";

    var isTouch       = 'ontouchstart' in window,
        eStart        = isTouch ? 'touchstart'  : 'mousedown',
        eMove         = isTouch ? 'touchmove'   : 'mousemove',
        eEnd          = isTouch ? 'touchend'    : 'mouseup',
        eCancel       = isTouch ? 'touchcancel' : 'mouseup',
        secondsToTime = function( secs )
        {
            var hoursDiv = secs / 3600, hours = Math.floor( hoursDiv ), minutesDiv = secs % 3600 / 60, minutes = Math.floor( minutesDiv ), seconds = Math.ceil( secs % 3600 % 60 );
            if( seconds > 59 ) { seconds = 0; minutes = Math.ceil( minutesDiv ); }
            if( minutes > 59 ) { minutes = 0; hours = Math.ceil( hoursDiv ); }
            return ( hours === 0 ? '' : hours > 0 && hours.toString().length < 2 ? '0'+hours+':' : hours+':' ) + ( minutes.toString().length < 2 ? '0'+minutes : minutes ) + ':' + ( seconds.toString().length < 2 ? '0'+seconds : seconds );
        },
        canPlayType   = function( file )
        {
            var audioElement = document.createElement( 'audio' );
            return !!( audioElement.canPlayType && audioElement.canPlayType( 'audio/' + file.split( '.' ).pop().toLowerCase() + ';' ).replace( /no/, '' ) );
        };

    $.fn.audioPlayer = function( options )
    {
        var params      = $.extend( { classPrefix: 'audioplayer', strPlay: 'Wiedergabe', strPause: 'Pause', strVolume: 'Lautstärke' }, options ),
            htmlAudio   = '<audio preload="auto" controls{autoplay}{loop}><source src="{file}" type="audio/mpeg"></audio>',
            cmdAutoPlay = { true: " autoplay", false: "" },
            cmdLoop     = { true: " loop", false: "" },
            cssClass    = {},
            cssClassSub =
            {
                playPause:      'playpause',
                playing:        'playing',
                stopped:        'stopped',
                time:           'time',
                timeCurrent:    'time-current',
                timeDuration:   'time-duration',
                bar:            'bar',
                barLoaded:      'bar-loaded',
                barPlayed:      'bar-played',
                volume:         'volume',
                volumeButton:   'volume-button',
                volumeAdjust:   'volume-adjust',
                noVolume:       'novolume',
                muted:          'muted',
                mini:           'mini',
//------------- Added a songTitle cssClass
                songTitle:      'title'
            };

        for( var subName in cssClassSub )
            cssClass[ subName ] = params.classPrefix + '-' + cssClassSub[ subName ];

        this.each( function()
        {
            var $this      = $( this ),
//------------- Extract the song URL from the title-attribute
                audioFile  = $this.attr( 'title' ) || "",
                isAutoPlay = false,
                isLoop     = false,
                isSupport  = false,
//------------- Songtitle may be passed through the DIVs innerText
                songTitle  = $this.text(),
                classList  = $this.attr('class').toLowerCase().split(/\s+/);
//--------- Analyze class names: split class specs to array and process each single class
            $.each( classList, function(){
                switch(this){
                case "autoplay": isAutoPlay = true; break;
                case "loop": isLoop = true; break;
                }
            });

//--------- Return error message if audiofile was not specified
            if (audioFile.length===0){
                $this.html('<p class="message">Bitte die URL der Audiodatei im DIV-Attribut "title" ergänzen!</p>');
                return;
            } else {
                isSupport = canPlayType( audioFile );
            }

            var thePlayer = $( '<div class="' + params.classPrefix + '">' + ( isSupport ? htmlAudio.replace(/{file}/, audioFile).replace(/{autoplay}/, cmdAutoPlay[isAutoPlay]).replace(/{loop}/, cmdLoop[isLoop]) : '<embed src="' + audioFile + '" width="0" height="0" volume="100" autostart="' + isAutoPlay.toString() +'" loop="' + isLoop.toString() + '" />' ) + '<div class="' + cssClass.playPause + '" title="' + params.strPlay + '"><a href="#">' + params.strPlay + '</a></div></div>' ),
                theAudio  = isSupport ? thePlayer.find( 'audio' ) : thePlayer.find( 'embed' ), theRealEvent;
            theAudio = theAudio.get( 0 );

            if( isSupport )
            {
                thePlayer.find( 'audio' ).css( { 'width': 0, 'height': 0, 'visibility': 'hidden' } );
//------------- Added Songtitle display across the barLoaded/barPlayed DIVs, if it has been provided by the user
                thePlayer.append( '<div class="' + cssClass.time + ' ' + cssClass.timeCurrent + '"></div><div class="' + cssClass.bar + '"><div class="' + cssClass.barLoaded + '"></div><div class="' + cssClass.barPlayed + '"></div>'+(songTitle.length>0 ? '<div class="'+cssClass.songTitle+'">'+songTitle+'</div>' : '')+'</div><div class="' + cssClass.time + ' ' + cssClass.timeDuration + '"></div><div class="' + cssClass.volume + '"><div class="' + cssClass.volumeButton + '" title="' + params.strVolume + '"><a href="#">' + params.strVolume + '</a></div><div class="' + cssClass.volumeAdjust + '"><div><div></div></div></div></div>' );

                var theBar            = thePlayer.find( '.' + cssClass.bar ),
                    barPlayed         = thePlayer.find( '.' + cssClass.barPlayed ),
                    barLoaded         = thePlayer.find( '.' + cssClass.barLoaded ),
                    timeCurrent       = thePlayer.find( '.' + cssClass.timeCurrent ),
                    timeDuration      = thePlayer.find( '.' + cssClass.timeDuration ),
                    volumeButton      = thePlayer.find( '.' + cssClass.volumeButton ),
                    volumeAdjuster    = thePlayer.find( '.' + cssClass.volumeAdjust + ' > div' ),
                    volumeDefault     = 0,
                    adjustCurrentTime = function( e )
                    {
                        theRealEvent         = isTouch ? e.originalEvent.touches[ 0 ] : e;
                        theAudio.currentTime = Math.round( ( theAudio.duration * ( theRealEvent.pageX - theBar.offset().left ) ) / theBar.width() );
                    },
                    adjustVolume = function( e )
                    {
                        theRealEvent    = isTouch ? e.originalEvent.touches[ 0 ] : e;
                        theAudio.volume = Math.abs( ( theRealEvent.pageY - ( volumeAdjuster.offset().top + volumeAdjuster.height() ) ) / volumeAdjuster.height() );
                    },
                    updateLoadBar = function()
                    {
                        var interval = setInterval( function()
                        {
                            if( theAudio.buffered.length < 1 ) return true;
                            barLoaded.width( ( theAudio.buffered.end( 0 ) / theAudio.duration ) * 100 + '%' );
                            if( Math.floor( theAudio.buffered.end( 0 ) ) >= Math.floor( theAudio.duration ) ) clearInterval( interval );
                        }, 100 );
                    };

                var volumeTestDefault = theAudio.volume, volumeTestValue = theAudio.volume = 0.111;
                if( Math.round( theAudio.volume * 1000 ) / 1000 == volumeTestValue ) theAudio.volume = volumeTestDefault;
                else thePlayer.addClass( cssClass.noVolume );

                timeDuration.html( '&hellip;' );
                timeCurrent.html( secondsToTime( 0 ) );

                theAudio.addEventListener( 'loadeddata', function()
                {
                    updateLoadBar();
                    timeDuration.html( $.isNumeric( theAudio.duration ) ? secondsToTime( theAudio.duration ) : '&hellip;' );
                    volumeAdjuster.find( 'div' ).height( theAudio.volume * 100 + '%' );
                    volumeDefault = theAudio.volume;
                });

                theAudio.addEventListener( 'timeupdate', function()
                {
                    timeCurrent.html( secondsToTime( theAudio.currentTime ) );
                    barPlayed.width( ( theAudio.currentTime / theAudio.duration ) * 100 + '%' );
                });

                theAudio.addEventListener( 'volumechange', function()
                {
                    volumeAdjuster.find( 'div' ).height( theAudio.volume * 100 + '%' );
                    if( theAudio.volume > 0 && thePlayer.hasClass( cssClass.muted ) ) thePlayer.removeClass( cssClass.muted );
                    if( theAudio.volume <= 0 && !thePlayer.hasClass( cssClass.muted ) ) thePlayer.addClass( cssClass.muted );
                });

                theAudio.addEventListener( 'ended', function()
                {
                    thePlayer.removeClass( cssClass.playing ).addClass( cssClass.stopped );
                });

                theBar.on( eStart, function( e )
                {
                    adjustCurrentTime( e );
                    theBar.on( eMove, function( e ) { adjustCurrentTime( e ); } );
                })
                .on( eCancel, function()
                {
                    theBar.unbind( eMove );
                });

                volumeButton.on( 'click', function()
                {
                    if( thePlayer.hasClass( cssClass.muted ) )
                    {
                        thePlayer.removeClass( cssClass.muted );
                        theAudio.volume = volumeDefault;
                    }
                    else
                    {
                        thePlayer.addClass( cssClass.muted );
                        volumeDefault = theAudio.volume;
                        theAudio.volume = 0;
                    }
                    return false;
                });

                volumeAdjuster.on( eStart, function( e )
                {
                    adjustVolume( e );
                    volumeAdjuster.on( eMove, function( e ) { adjustVolume( e ); } );
                })
                .on( eCancel, function()
                {
                    volumeAdjuster.unbind( eMove );
                });
            }
            else thePlayer.addClass( cssClass.mini );

            thePlayer.addClass( isAutoPlay ? cssClass.playing : cssClass.stopped );

            thePlayer.find( '.' + cssClass.playPause ).on( 'click', function()
            {
                if( thePlayer.hasClass( cssClass.playing ) )
                {
                    $( this ).attr( 'title', params.strPlay ).find( 'a' ).html( params.strPlay );
                    thePlayer.removeClass( cssClass.playing ).addClass( cssClass.stopped );
                    if (isSupport){ theAudio.pause(); } else { theAudio.Stop(); }
                }
                else
                {
                    $( this ).attr( 'title', params.strPause ).find( 'a' ).html( params.strPause );
                    thePlayer.addClass( cssClass.playing ).removeClass( cssClass.stopped );
                    if (isSupport){ theAudio.play(); } else { theAudio.Play(); }
                }
                return false;
            });

            $this.replaceWith( thePlayer );
        });
        return this;
    };
})( jQuery, window, document );