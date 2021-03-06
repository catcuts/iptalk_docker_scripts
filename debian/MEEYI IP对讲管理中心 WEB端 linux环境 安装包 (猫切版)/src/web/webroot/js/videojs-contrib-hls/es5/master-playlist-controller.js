/**
 * @file master-playlist-controller.js
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _playlistLoader = require('./playlist-loader');

var _playlistLoader2 = _interopRequireDefault(_playlistLoader);

var _segmentLoader = require('./segment-loader');

var _segmentLoader2 = _interopRequireDefault(_segmentLoader);

var _vttSegmentLoader = require('./vtt-segment-loader');

var _vttSegmentLoader2 = _interopRequireDefault(_vttSegmentLoader);

var _ranges = require('./ranges');

var _ranges2 = _interopRequireDefault(_ranges);

var _videoJs = require('video.js');

var _videoJs2 = _interopRequireDefault(_videoJs);

var _adCueTags = require('./ad-cue-tags');

var _adCueTags2 = _interopRequireDefault(_adCueTags);

var _syncController = require('./sync-controller');

var _syncController2 = _interopRequireDefault(_syncController);

var _videojsContribMediaSourcesEs5CodecUtils = require('videojs-contrib-media-sources/es5/codec-utils');

var _webworkify = require('webworkify');

var _webworkify2 = _interopRequireDefault(_webworkify);

var _decrypterWorker = require('./decrypter-worker');

var _decrypterWorker2 = _interopRequireDefault(_decrypterWorker);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _utilCodecsJs = require('./util/codecs.js');

var ABORT_EARLY_BLACKLIST_SECONDS = 60 * 2;

var Hls = undefined;

// Default codec parameters if none were provided for video and/or audio
var defaultCodecs = {
  videoCodec: 'avc1',
  videoObjectTypeIndicator: '.4d400d',
  // AAC-LC
  audioProfile: '2'
};

// SegmentLoader stats that need to have each loader's
// values summed to calculate the final value
var loaderStats = ['mediaRequests', 'mediaRequestsAborted', 'mediaRequestsTimedout', 'mediaRequestsErrored', 'mediaTransferDuration', 'mediaBytesTransferred'];
var sumLoaderStat = function sumLoaderStat(stat) {
  return this.audioSegmentLoader_[stat] + this.mainSegmentLoader_[stat];
};

/**
 * determine if an object a is differnt from
 * and object b. both only having one dimensional
 * properties
 *
 * @param {Object} a object one
 * @param {Object} b object two
 * @return {Boolean} if the object has changed or not
 */
var objectChanged = function objectChanged(a, b) {
  if (typeof a !== typeof b) {
    return true;
  }
  // if we have a different number of elements
  // something has changed
  if (Object.keys(a).length !== Object.keys(b).length) {
    return true;
  }

  for (var prop in a) {
    if (a[prop] !== b[prop]) {
      return true;
    }
  }
  return false;
};

/**
 * Replace codecs in the codec string with the old apple-style `avc1.<dd>.<dd>` to the
 * standard `avc1.<hhhhhh>`.
 *
 * @param codecString {String} the codec string
 * @return {String} the codec string with old apple-style codecs replaced
 *
 * @private
 */
var mapLegacyAvcCodecs_ = function mapLegacyAvcCodecs_(codecString) {
  return codecString.replace(/avc1\.(\d+)\.(\d+)/i, function (match) {
    return (0, _videojsContribMediaSourcesEs5CodecUtils.translateLegacyCodecs)([match])[0];
  });
};

exports.mapLegacyAvcCodecs_ = mapLegacyAvcCodecs_;
/**
 * Build a media mime-type string from a set of parameters
 * @param {String} type either 'audio' or 'video'
 * @param {String} container either 'mp2t' or 'mp4'
 * @param {Array} codecs an array of codec strings to add
 * @return {String} a valid media mime-type
 */
var makeMimeTypeString = function makeMimeTypeString(type, container, codecs) {
  // The codecs array is filtered so that falsey values are
  // dropped and don't cause Array#join to create spurious
  // commas
  return type + '/' + container + '; codecs="' + codecs.filter(function (c) {
    return !!c;
  }).join(', ') + '"';
};

/**
 * Returns the type container based on information in the playlist
 * @param {Playlist} media the current media playlist
 * @return {String} a valid media container type
 */
var getContainerType = function getContainerType(media) {
  // An initialization segment means the media playlist is an iframe
  // playlist or is using the mp4 container. We don't currently
  // support iframe playlists, so assume this is signalling mp4
  // fragments.
  if (media.segments && media.segments.length && media.segments[0].map) {
    return 'mp4';
  }
  return 'mp2t';
};

/**
 * Returns a set of codec strings parsed from the playlist or the default
 * codec strings if no codecs were specified in the playlist
 * @param {Playlist} media the current media playlist
 * @return {Object} an object with the video and audio codecs
 */
var getCodecs = function getCodecs(media) {
  // if the codecs were explicitly specified, use them instead of the
  // defaults
  var mediaAttributes = media.attributes || {};

  if (mediaAttributes.CODECS) {
    return (0, _utilCodecsJs.parseCodecs)(mediaAttributes.CODECS);
  }
  return defaultCodecs;
};

/**
 * Calculates the MIME type strings for a working configuration of
 * SourceBuffers to play variant streams in a master playlist. If
 * there is no possible working configuration, an empty array will be
 * returned.
 *
 * @param master {Object} the m3u8 object for the master playlist
 * @param media {Object} the m3u8 object for the variant playlist
 * @return {Array} the MIME type strings. If the array has more than
 * one entry, the first element should be applied to the video
 * SourceBuffer and the second to the audio SourceBuffer.
 *
 * @private
 */
var mimeTypesForPlaylist_ = function mimeTypesForPlaylist_(master, media) {
  var containerType = getContainerType(media);
  var codecInfo = getCodecs(media);
  var mediaAttributes = media.attributes || {};
  // Default condition for a traditional HLS (no demuxed audio/video)
  var isMuxed = true;
  var isMaat = false;

  if (!media) {
    // Not enough information
    return [];
  }

  if (master.mediaGroups.AUDIO && mediaAttributes.AUDIO) {
    var audioGroup = master.mediaGroups.AUDIO[mediaAttributes.AUDIO];

    // Handle the case where we are in a multiple-audio track scenario
    if (audioGroup) {
      isMaat = true;
      // Start with the everything demuxed then...
      isMuxed = false;
      // ...check to see if any audio group tracks are muxed (ie. lacking a uri)
      for (var groupId in audioGroup) {
        if (!audioGroup[groupId].uri) {
          isMuxed = true;
          break;
        }
      }
    }
  }

  // HLS with multiple-audio tracks must always get an audio codec.
  // Put another way, there is no way to have a video-only multiple-audio HLS!
  if (isMaat && !codecInfo.audioProfile) {
    _videoJs2['default'].log.warn('Multiple audio tracks present but no audio codec string is specified. ' + 'Attempting to use the default audio codec (mp4a.40.2)');
    codecInfo.audioProfile = defaultCodecs.audioProfile;
  }

  // Generate the final codec strings from the codec object generated above
  var codecStrings = {};

  if (codecInfo.videoCodec) {
    codecStrings.video = '' + codecInfo.videoCodec + codecInfo.videoObjectTypeIndicator;
  }

  if (codecInfo.audioProfile) {
    codecStrings.audio = 'mp4a.40.' + codecInfo.audioProfile;
  }

  // Finally, make and return an array with proper mime-types depending on
  // the configuration
  var justAudio = makeMimeTypeString('audio', containerType, [codecStrings.audio]);
  var justVideo = makeMimeTypeString('video', containerType, [codecStrings.video]);
  var bothVideoAudio = makeMimeTypeString('video', containerType, [codecStrings.video, codecStrings.audio]);

  if (isMaat) {
    if (!isMuxed && codecStrings.video) {
      return [justVideo, justAudio];
    }
    // There exists the possiblity that this will return a `video/container`
    // mime-type for the first entry in the array even when there is only audio.
    // This doesn't appear to be a problem and simplifies the code.
    return [bothVideoAudio, justAudio];
  }

  // If there is ano video codec at all, always just return a single
  // audio/<container> mime-type
  if (!codecStrings.video) {
    return [justAudio];
  }

  // When not using separate audio media groups, audio and video is
  // *always* muxed
  return [bothVideoAudio];
};

exports.mimeTypesForPlaylist_ = mimeTypesForPlaylist_;
/**
 * the master playlist controller controller all interactons
 * between playlists and segmentloaders. At this time this mainly
 * involves a master playlist and a series of audio playlists
 * if they are available
 *
 * @class MasterPlaylistController
 * @extends videojs.EventTarget
 */

var MasterPlaylistController = (function (_videojs$EventTarget) {
  _inherits(MasterPlaylistController, _videojs$EventTarget);

  function MasterPlaylistController(options) {
    var _this = this;

    _classCallCheck(this, MasterPlaylistController);

    _get(Object.getPrototypeOf(MasterPlaylistController.prototype), 'constructor', this).call(this);

    var url = options.url;
    var withCredentials = options.withCredentials;
    var mode = options.mode;
    var tech = options.tech;
    var bandwidth = options.bandwidth;
    var externHls = options.externHls;
    var useCueTags = options.useCueTags;
    var blacklistDuration = options.blacklistDuration;
    var enableLowInitialPlaylist = options.enableLowInitialPlaylist;

    if (!url) {
      throw new Error('A non-empty playlist URL is required');
    }

    Hls = externHls;

    this.withCredentials = withCredentials;
    this.tech_ = tech;
    this.hls_ = tech.hls;
    this.mode_ = mode;
    this.useCueTags_ = useCueTags;
    this.blacklistDuration = blacklistDuration;
    this.enableLowInitialPlaylist = enableLowInitialPlaylist;
    if (this.useCueTags_) {
      this.cueTagsTrack_ = this.tech_.addTextTrack('metadata', 'ad-cues');
      this.cueTagsTrack_.inBandMetadataTrackDispatchType = '';
    }

    this.requestOptions_ = {
      withCredentials: this.withCredentials,
      timeout: null
    };

    this.audioGroups_ = {};
    this.subtitleGroups_ = { groups: {}, tracks: {} };
    this.closedCaptionGroups_ = { groups: {}, tracks: {} };

    this.mediaSource = new _videoJs2['default'].MediaSource({ mode: mode });
    this.audioinfo_ = null;
    this.mediaSource.on('audioinfo', this.handleAudioinfoUpdate_.bind(this));

    // load the media source into the player
    this.mediaSource.addEventListener('sourceopen', this.handleSourceOpen_.bind(this));

    this.seekable_ = _videoJs2['default'].createTimeRanges();
    this.hasPlayed_ = function () {
      return false;
    };

    this.syncController_ = new _syncController2['default'](options);
    this.segmentMetadataTrack_ = tech.addRemoteTextTrack({
      kind: 'metadata',
      label: 'segment-metadata'
    }, false).track;

    this.decrypter_ = (0, _webworkify2['default'])(_decrypterWorker2['default']);

    var segmentLoaderSettings = {
      hls: this.hls_,
      mediaSource: this.mediaSource,
      currentTime: this.tech_.currentTime.bind(this.tech_),
      seekable: function seekable() {
        return _this.seekable();
      },
      seeking: function seeking() {
        return _this.tech_.seeking();
      },
      duration: function duration() {
        return _this.mediaSource.duration;
      },
      hasPlayed: function hasPlayed() {
        return _this.hasPlayed_();
      },
      goalBufferLength: function goalBufferLength() {
        return _this.goalBufferLength();
      },
      bandwidth: bandwidth,
      syncController: this.syncController_,
      decrypter: this.decrypter_
    };

    // setup playlist loaders
    this.masterPlaylistLoader_ = new _playlistLoader2['default'](url, this.hls_, this.withCredentials);
    this.setupMasterPlaylistLoaderListeners_();
    this.audioPlaylistLoader_ = null;
    this.subtitlePlaylistLoader_ = null;

    // setup segment loaders
    // combined audio/video or just video when alternate audio track is selected
    this.mainSegmentLoader_ = new _segmentLoader2['default'](_videoJs2['default'].mergeOptions(segmentLoaderSettings, {
      segmentMetadataTrack: this.segmentMetadataTrack_,
      loaderType: 'main'
    }), options);

    // alternate audio track
    this.audioSegmentLoader_ = new _segmentLoader2['default'](_videoJs2['default'].mergeOptions(segmentLoaderSettings, {
      loaderType: 'audio'
    }), options);

    this.subtitleSegmentLoader_ = new _vttSegmentLoader2['default'](_videoJs2['default'].mergeOptions(segmentLoaderSettings, {
      loaderType: 'vtt'
    }), options);

    this.setupSegmentLoaderListeners_();

    // Create SegmentLoader stat-getters
    loaderStats.forEach(function (stat) {
      _this[stat + '_'] = sumLoaderStat.bind(_this, stat);
    });

    this.masterPlaylistLoader_.load();
  }

  /**
   * Register event handlers on the master playlist loader. A helper
   * function for construction time.
   *
   * @private
   */

  _createClass(MasterPlaylistController, [{
    key: 'setupMasterPlaylistLoaderListeners_',
    value: function setupMasterPlaylistLoaderListeners_() {
      var _this2 = this;

      this.masterPlaylistLoader_.on('loadedmetadata', function () {
        var media = _this2.masterPlaylistLoader_.media();
        var requestTimeout = _this2.masterPlaylistLoader_.targetDuration * 1.5 * 1000;

        // If we don't have any more available playlists, we don't want to
        // timeout the request.
        if (_this2.masterPlaylistLoader_.isLowestEnabledRendition_()) {
          _this2.requestOptions_.timeout = 0;
        } else {
          _this2.requestOptions_.timeout = requestTimeout;
        }

        // if this isn't a live video and preload permits, start
        // downloading segments
        if (media.endList && _this2.tech_.preload() !== 'none') {
          _this2.mainSegmentLoader_.playlist(media, _this2.requestOptions_);
          _this2.mainSegmentLoader_.load();
        }

        _this2.fillAudioTracks_();
        _this2.setupAudio();

        _this2.fillSubtitleTracks_();
        _this2.setupSubtitles();

        _this2.triggerPresenceUsage_(_this2.master(), media);
        _this2.fillClosedCaptionTracks_();

        try {
          _this2.setupSourceBuffers_();
        } catch (e) {
          _videoJs2['default'].log.warn('Failed to create SourceBuffers', e);
          return _this2.mediaSource.endOfStream('decode');
        }
        _this2.setupFirstPlay();

        _this2.trigger('audioupdate');
        _this2.trigger('selectedinitialmedia');
      });

      this.masterPlaylistLoader_.on('loadedplaylist', function () {
        var updatedPlaylist = _this2.masterPlaylistLoader_.media();

        if (!updatedPlaylist) {
          var selectedMedia = undefined;

          if (_this2.enableLowInitialPlaylist) {
            selectedMedia = _this2.selectInitialPlaylist();
          }

          if (!selectedMedia) {
            selectedMedia = _this2.selectPlaylist();
          }

          _this2.initialMedia_ = selectedMedia;
          _this2.masterPlaylistLoader_.media(_this2.initialMedia_);
          return;
        }

        if (_this2.useCueTags_) {
          _this2.updateAdCues_(updatedPlaylist);
        }

        // TODO: Create a new event on the PlaylistLoader that signals
        // that the segments have changed in some way and use that to
        // update the SegmentLoader instead of doing it twice here and
        // on `mediachange`
        _this2.mainSegmentLoader_.playlist(updatedPlaylist, _this2.requestOptions_);
        _this2.updateDuration();

        // If the player isn't paused, ensure that the segment loader is running,
        // as it is possible that it was temporarily stopped while waiting for
        // a playlist (e.g., in case the playlist errored and we re-requested it).
        if (!_this2.tech_.paused()) {
          _this2.mainSegmentLoader_.load();
        }

        if (!updatedPlaylist.endList) {
          (function () {
            var addSeekableRange = function addSeekableRange() {
              var seekable = _this2.seekable();

              if (seekable.length !== 0) {
                _this2.mediaSource.addSeekableRange_(seekable.start(0), seekable.end(0));
              }
            };

            if (_this2.duration() !== Infinity) {
              (function () {
                var onDurationchange = function onDurationchange() {
                  if (_this2.duration() === Infinity) {
                    addSeekableRange();
                  } else {
                    _this2.tech_.one('durationchange', onDurationchange);
                  }
                };

                _this2.tech_.one('durationchange', onDurationchange);
              })();
            } else {
              addSeekableRange();
            }
          })();
        }
      });

      this.masterPlaylistLoader_.on('error', function () {
        _this2.blacklistCurrentPlaylist(_this2.masterPlaylistLoader_.error);
      });

      this.masterPlaylistLoader_.on('mediachanging', function () {
        _this2.mainSegmentLoader_.abort();
        _this2.mainSegmentLoader_.pause();
      });

      this.masterPlaylistLoader_.on('mediachange', function () {
        var media = _this2.masterPlaylistLoader_.media();
        var requestTimeout = _this2.masterPlaylistLoader_.targetDuration * 1.5 * 1000;
        var activeAudioGroup = undefined;
        var activeTrack = undefined;

        // If we don't have any more available playlists, we don't want to
        // timeout the request.
        if (_this2.masterPlaylistLoader_.isLowestEnabledRendition_()) {
          _this2.requestOptions_.timeout = 0;
        } else {
          _this2.requestOptions_.timeout = requestTimeout;
        }

        // TODO: Create a new event on the PlaylistLoader that signals
        // that the segments have changed in some way and use that to
        // update the SegmentLoader instead of doing it twice here and
        // on `loadedplaylist`
        _this2.mainSegmentLoader_.playlist(media, _this2.requestOptions_);
        _this2.mainSegmentLoader_.load();

        // if the audio group has changed, a new audio track has to be
        // enabled
        activeAudioGroup = _this2.activeAudioGroup();
        activeTrack = activeAudioGroup.filter(function (track) {
          return track.enabled;
        })[0];
        if (!activeTrack) {
          _this2.mediaGroupChanged();
          _this2.trigger('audioupdate');
        }
        _this2.setupSubtitles();

        _this2.tech_.trigger({
          type: 'mediachange',
          bubbles: true
        });
      });

      this.masterPlaylistLoader_.on('playlistunchanged', function () {
        var updatedPlaylist = _this2.masterPlaylistLoader_.media();
        var playlistOutdated = _this2.stuckAtPlaylistEnd_(updatedPlaylist);

        if (playlistOutdated) {
          // Playlist has stopped updating and we're stuck at its end. Try to
          // blacklist it and switch to another playlist in the hope that that
          // one is updating (and give the player a chance to re-adjust to the
          // safe live point).
          _this2.blacklistCurrentPlaylist({
            message: 'Playlist no longer updating.'
          });
          // useful for monitoring QoS
          _this2.tech_.trigger('playliststuck');
        }
      });

      this.masterPlaylistLoader_.on('renditiondisabled', function () {
        _this2.tech_.trigger({ type: 'usage', name: 'hls-rendition-disabled' });
      });
      this.masterPlaylistLoader_.on('renditionenabled', function () {
        _this2.tech_.trigger({ type: 'usage', name: 'hls-rendition-enabled' });
      });
    }

    /**
     * A helper function for triggerring presence usage events once per source
     *
     * @private
     */
  }, {
    key: 'triggerPresenceUsage_',
    value: function triggerPresenceUsage_(master, media) {
      var mediaGroups = master.mediaGroups || {};
      var defaultDemuxed = true;
      var audioGroupKeys = Object.keys(mediaGroups.AUDIO);

      for (var mediaGroup in mediaGroups.AUDIO) {
        for (var label in mediaGroups.AUDIO[mediaGroup]) {
          var properties = mediaGroups.AUDIO[mediaGroup][label];

          if (!properties.uri) {
            defaultDemuxed = false;
          }
        }
      }

      if (defaultDemuxed) {
        this.tech_.trigger({ type: 'usage', name: 'hls-demuxed' });
      }

      if (Object.keys(mediaGroups.SUBTITLES).length) {
        this.tech_.trigger({ type: 'usage', name: 'hls-webvtt' });
      }

      if (Hls.Playlist.isAes(media)) {
        this.tech_.trigger({ type: 'usage', name: 'hls-aes' });
      }

      if (Hls.Playlist.isFmp4(media)) {
        this.tech_.trigger({ type: 'usage', name: 'hls-fmp4' });
      }

      if (audioGroupKeys.length && Object.keys(mediaGroups.AUDIO[audioGroupKeys[0]]).length > 1) {
        this.tech_.trigger({ type: 'usage', name: 'hls-alternate-audio' });
      }

      if (this.useCueTags_) {
        this.tech_.trigger({ type: 'usage', name: 'hls-playlist-cue-tags' });
      }
    }

    /**
     * Register event handlers on the segment loaders. A helper function
     * for construction time.
     *
     * @private
     */
  }, {
    key: 'setupSegmentLoaderListeners_',
    value: function setupSegmentLoaderListeners_() {
      var _this3 = this;

      this.mainSegmentLoader_.on('bandwidthupdate', function () {
        var nextPlaylist = _this3.selectPlaylist();
        var currentPlaylist = _this3.masterPlaylistLoader_.media();
        var buffered = _this3.tech_.buffered();
        var forwardBuffer = buffered.length ? buffered.end(buffered.length - 1) - _this3.tech_.currentTime() : 0;

        var bufferLowWaterLine = _this3.bufferLowWaterLine();

        // If the playlist is live, then we want to not take low water line into account.
        // This is because in LIVE, the player plays 3 segments from the end of the
        // playlist, and if `BUFFER_LOW_WATER_LINE` is greater than the duration availble
        // in those segments, a viewer will never experience a rendition upswitch.
        if (!currentPlaylist.endList ||
        // For the same reason as LIVE, we ignore the low water line when the VOD
        // duration is below the max potential low water line
        _this3.duration() < _config2['default'].MAX_BUFFER_LOW_WATER_LINE ||
        // we want to switch down to lower resolutions quickly to continue playback, but
        nextPlaylist.attributes.BANDWIDTH < currentPlaylist.attributes.BANDWIDTH ||
        // ensure we have some buffer before we switch up to prevent us running out of
        // buffer while loading a higher rendition.
        forwardBuffer >= bufferLowWaterLine) {
          _this3.masterPlaylistLoader_.media(nextPlaylist);
        }

        _this3.tech_.trigger('bandwidthupdate');
      });
      this.mainSegmentLoader_.on('progress', function () {
        _this3.trigger('progress');
      });

      this.mainSegmentLoader_.on('error', function () {
        _this3.blacklistCurrentPlaylist(_this3.mainSegmentLoader_.error());
      });

      this.mainSegmentLoader_.on('syncinfoupdate', function () {
        _this3.onSyncInfoUpdate_();
      });

      this.mainSegmentLoader_.on('timestampoffset', function () {
        _this3.tech_.trigger({ type: 'usage', name: 'hls-timestamp-offset' });
      });
      this.audioSegmentLoader_.on('syncinfoupdate', function () {
        _this3.onSyncInfoUpdate_();
      });

      this.mainSegmentLoader_.on('ended', function () {
        _this3.onEndOfStream();
      });

      this.mainSegmentLoader_.on('earlyabort', function () {
        _this3.blacklistCurrentPlaylist({
          message: 'Aborted early because there isn\'t enough bandwidth to complete the ' + 'request without rebuffering.'
        }, ABORT_EARLY_BLACKLIST_SECONDS);
      });

      this.mainSegmentLoader_.on('reseteverything', function () {
        _this3.tech_.trigger('hls-reset');
      });

      this.audioSegmentLoader_.on('ended', function () {
        _this3.onEndOfStream();
      });

      this.audioSegmentLoader_.on('error', function () {
        _videoJs2['default'].log.warn('Problem encountered with the current alternate audio track' + '. Switching back to default.');
        _this3.audioSegmentLoader_.abort();
        _this3.audioPlaylistLoader_ = null;
        _this3.setupAudio();
      });

      this.subtitleSegmentLoader_.on('error', this.handleSubtitleError_.bind(this));
    }
  }, {
    key: 'handleAudioinfoUpdate_',
    value: function handleAudioinfoUpdate_(event) {
      if (Hls.supportsAudioInfoChange_() || !this.audioInfo_ || !objectChanged(this.audioInfo_, event.info)) {
        this.audioInfo_ = event.info;
        return;
      }

      var error = 'had different audio properties (channels, sample rate, etc.) ' + 'or changed in some other way.  This behavior is currently ' + 'unsupported in Firefox 48 and below due to an issue: \n\n' + 'https://bugzilla.mozilla.org/show_bug.cgi?id=1247138\n\n';

      var enabledIndex = this.activeAudioGroup().map(function (track) {
        return track.enabled;
      }).indexOf(true);
      var enabledTrack = this.activeAudioGroup()[enabledIndex];
      var defaultTrack = this.activeAudioGroup().filter(function (track) {
        return track.properties_ && track.properties_['default'];
      })[0];

      // they did not switch audiotracks
      // blacklist the current playlist
      if (!this.audioPlaylistLoader_) {
        error = 'The rendition that we tried to switch to ' + error + 'Unfortunately that means we will have to blacklist ' + 'the current playlist and switch to another. Sorry!';
        this.blacklistCurrentPlaylist();
      } else {
        error = 'The audio track \'' + enabledTrack.label + '\' that we tried to ' + ('switch to ' + error + ' Unfortunately this means we will have to ') + ('return you to the main track \'' + defaultTrack.label + '\'. Sorry!');
        defaultTrack.enabled = true;
        this.activeAudioGroup().splice(enabledIndex, 1);
        this.trigger('audioupdate');
      }

      _videoJs2['default'].log.warn(error);
      this.setupAudio();
    }
  }, {
    key: 'mediaSecondsLoaded_',
    value: function mediaSecondsLoaded_() {
      return Math.max(this.audioSegmentLoader_.mediaSecondsLoaded + this.mainSegmentLoader_.mediaSecondsLoaded);
    }

    /**
     * fill our internal list of HlsAudioTracks with data from
     * the master playlist or use a default
     *
     * @private
     */
  }, {
    key: 'fillAudioTracks_',
    value: function fillAudioTracks_() {
      var master = this.master();
      var mediaGroups = master.mediaGroups || {};

      // force a default if we have none or we are not
      // in html5 mode (the only mode to support more than one
      // audio track)
      if (!mediaGroups || !mediaGroups.AUDIO || Object.keys(mediaGroups.AUDIO).length === 0 || this.mode_ !== 'html5') {
        // "main" audio group, track name "default"
        mediaGroups.AUDIO = { main: { 'default': { 'default': true } } };
      }

      for (var mediaGroup in mediaGroups.AUDIO) {
        if (!this.audioGroups_[mediaGroup]) {
          this.audioGroups_[mediaGroup] = [];
        }

        for (var label in mediaGroups.AUDIO[mediaGroup]) {
          var properties = mediaGroups.AUDIO[mediaGroup][label];
          var track = new _videoJs2['default'].AudioTrack({
            id: label,
            kind: this.audioTrackKind_(properties),
            enabled: false,
            language: properties.language,
            label: label
          });

          track.properties_ = properties;
          this.audioGroups_[mediaGroup].push(track);
        }
      }

      // enable the default active track
      (this.activeAudioGroup().filter(function (audioTrack) {
        return audioTrack.properties_['default'];
      })[0] || this.activeAudioGroup()[0]).enabled = true;
    }

    /**
     * Convert the properties of an HLS track into an audioTrackKind.
     *
     * @private
     */
  }, {
    key: 'audioTrackKind_',
    value: function audioTrackKind_(properties) {
      var kind = properties['default'] ? 'main' : 'alternative';

      if (properties.characteristics && properties.characteristics.indexOf('public.accessibility.describes-video') >= 0) {
        kind = 'main-desc';
      }

      return kind;
    }

    /**
     * fill our internal list of Subtitle Tracks with data from
     * the master playlist or use a default
     *
     * @private
     */
  }, {
    key: 'fillSubtitleTracks_',
    value: function fillSubtitleTracks_() {
      var master = this.master();
      var mediaGroups = master.mediaGroups || {};

      for (var mediaGroup in mediaGroups.SUBTITLES) {
        if (!this.subtitleGroups_.groups[mediaGroup]) {
          this.subtitleGroups_.groups[mediaGroup] = [];
        }

        for (var label in mediaGroups.SUBTITLES[mediaGroup]) {
          var properties = mediaGroups.SUBTITLES[mediaGroup][label];

          if (!properties.forced) {
            this.subtitleGroups_.groups[mediaGroup].push(_videoJs2['default'].mergeOptions({ id: label }, properties));

            if (typeof this.subtitleGroups_.tracks[label] === 'undefined') {
              var track = this.tech_.addRemoteTextTrack({
                id: label,
                kind: 'subtitles',
                enabled: false,
                language: properties.language,
                label: label
              }, false).track;

              this.subtitleGroups_.tracks[label] = track;
            }
          }
        }
      }

      // Do not enable a default subtitle track. Wait for user interaction instead.
    }

    /**
     * fill our internal list of Captions Tracks with data from
     * the master playlist or use a default
     *
     * @private
     */
  }, {
    key: 'fillClosedCaptionTracks_',
    value: function fillClosedCaptionTracks_() {
      var master = this.master();
      var mediaGroups = master.mediaGroups || {};

      for (var mediaGroup in mediaGroups['CLOSED-CAPTIONS']) {
        if (!this.closedCaptionGroups_.groups[mediaGroup]) {
          this.closedCaptionGroups_.groups[mediaGroup] = [];
        }

        for (var label in mediaGroups['CLOSED-CAPTIONS'][mediaGroup]) {
          var properties = mediaGroups['CLOSED-CAPTIONS'][mediaGroup][label];

          // We only support CEA608 captions for now, so ignore anything that
          // doesn't use a CCx INSTREAM-ID
          if (!properties.instreamId.match(/CC\d/)) {
            continue;
          }

          this.closedCaptionGroups_.groups[mediaGroup].push(_videoJs2['default'].mergeOptions({ id: label }, properties));

          if (typeof this.closedCaptionGroups_.tracks[label] === 'undefined') {
            var track = this.tech_.addRemoteTextTrack({
              id: properties.instreamId,
              kind: 'captions',
              enabled: false,
              language: properties.language,
              label: label
            }, false).track;

            this.closedCaptionGroups_.tracks[label] = track;
          }
        }
      }
    }

    /**
     * Call load on our SegmentLoaders
     */
  }, {
    key: 'load',
    value: function load() {
      this.mainSegmentLoader_.load();
      if (this.audioPlaylistLoader_) {
        this.audioSegmentLoader_.load();
      }
      if (this.subtitlePlaylistLoader_) {
        this.subtitleSegmentLoader_.load();
      }
    }

    /**
     * Returns the audio group for the currently active primary
     * media playlist.
     */
  }, {
    key: 'activeAudioGroup',
    value: function activeAudioGroup() {
      var videoPlaylist = this.masterPlaylistLoader_.media();
      var result = undefined;

      if (videoPlaylist.attributes.AUDIO) {
        result = this.audioGroups_[videoPlaylist.attributes.AUDIO];
      }

      return result || this.audioGroups_.main;
    }

    /**
     * Returns the subtitle group for the currently active primary
     * media playlist.
     */
  }, {
    key: 'activeSubtitleGroup_',
    value: function activeSubtitleGroup_() {
      var videoPlaylist = this.masterPlaylistLoader_.media();
      var result = undefined;

      if (!videoPlaylist) {
        return null;
      }

      if (videoPlaylist.attributes.SUBTITLES) {
        result = this.subtitleGroups_.groups[videoPlaylist.attributes.SUBTITLES];
      }

      return result || this.subtitleGroups_.groups.main;
    }
  }, {
    key: 'activeSubtitleTrack_',
    value: function activeSubtitleTrack_() {
      for (var trackName in this.subtitleGroups_.tracks) {
        if (this.subtitleGroups_.tracks[trackName].mode === 'showing') {
          return this.subtitleGroups_.tracks[trackName];
        }
      }

      return null;
    }
  }, {
    key: 'handleSubtitleError_',
    value: function handleSubtitleError_() {
      _videoJs2['default'].log.warn('Problem encountered loading the subtitle track' + '. Switching back to default.');

      this.subtitleSegmentLoader_.abort();

      var track = this.activeSubtitleTrack_();

      if (track) {
        track.mode = 'disabled';
      }

      this.setupSubtitles();
    }

    /**
     * Determine the correct audio renditions based on the active
     * AudioTrack and initialize a PlaylistLoader and SegmentLoader if
     * necessary. This method is only called when the media-group changes
     * and performs non-destructive 'resync' of the SegmentLoader(s) since
     * the playlist has likely changed
     */
  }, {
    key: 'mediaGroupChanged',
    value: function mediaGroupChanged() {
      var track = this.getActiveAudioTrack_();

      this.stopAudioLoaders_();
      this.resyncAudioLoaders_(track);
    }

    /**
     * Determine the correct audio rendition based on the active
     * AudioTrack and initialize a PlaylistLoader and SegmentLoader if
     * necessary. This method is called once automatically before
     * playback begins to enable the default audio track and should be
     * invoked again if the track is changed. Performs destructive 'reset'
     * on the SegmentLoaders(s) to ensure we start loading audio as
     * close to currentTime as possible
     */
  }, {
    key: 'setupAudio',
    value: function setupAudio() {
      var track = this.getActiveAudioTrack_();

      this.stopAudioLoaders_();
      this.resetAudioLoaders_(track);
    }

    /**
     * Returns the currently active track or the default track if none
     * are active
     */
  }, {
    key: 'getActiveAudioTrack_',
    value: function getActiveAudioTrack_() {
      // determine whether seperate loaders are required for the audio
      // rendition
      var audioGroup = this.activeAudioGroup();
      var track = audioGroup.filter(function (audioTrack) {
        return audioTrack.enabled;
      })[0];

      if (!track) {
        track = audioGroup.filter(function (audioTrack) {
          return audioTrack.properties_['default'];
        })[0] || audioGroup[0];
        track.enabled = true;
      }

      return track;
    }

    /**
     * Destroy the PlaylistLoader and pause the SegmentLoader specifically
     * for audio when switching audio tracks
     */
  }, {
    key: 'stopAudioLoaders_',
    value: function stopAudioLoaders_() {
      // stop playlist and segment loading for audio
      if (this.audioPlaylistLoader_) {
        this.audioPlaylistLoader_.dispose();
        this.audioPlaylistLoader_ = null;
      }
      this.audioSegmentLoader_.pause();
    }

    /**
     * Destructive reset of the mainSegmentLoader (when audio is muxed)
     * or audioSegmentLoader (when audio is demuxed) to prepare them
     * to start loading new data right at currentTime
     */
  }, {
    key: 'resetAudioLoaders_',
    value: function resetAudioLoaders_(track) {
      if (!track.properties_.resolvedUri) {
        this.mainSegmentLoader_.resetEverything();
        return;
      }

      this.audioSegmentLoader_.resetEverything();
      this.setupAudioPlaylistLoader_(track);
    }

    /**
     * Non-destructive resync of the audioSegmentLoader (when audio
     * is demuxed) to prepare to continue appending new audio data
     * at the end of the current buffered region
     */
  }, {
    key: 'resyncAudioLoaders_',
    value: function resyncAudioLoaders_(track) {
      if (!track.properties_.resolvedUri) {
        return;
      }

      this.audioSegmentLoader_.resyncLoader();
      this.setupAudioPlaylistLoader_(track);
    }

    /**
     * Setup a new audioPlaylistLoader and start the audioSegmentLoader
     * to begin loading demuxed audio
     */
  }, {
    key: 'setupAudioPlaylistLoader_',
    value: function setupAudioPlaylistLoader_(track) {
      var _this4 = this;

      // startup playlist and segment loaders for the enabled audio
      // track
      this.audioPlaylistLoader_ = new _playlistLoader2['default'](track.properties_.resolvedUri, this.hls_, this.withCredentials);
      this.audioPlaylistLoader_.load();

      this.audioPlaylistLoader_.on('loadedmetadata', function () {
        var audioPlaylist = _this4.audioPlaylistLoader_.media();

        _this4.audioSegmentLoader_.playlist(audioPlaylist, _this4.requestOptions_);

        // if the video is already playing, or if this isn't a live video and preload
        // permits, start downloading segments
        if (!_this4.tech_.paused() || audioPlaylist.endList && _this4.tech_.preload() !== 'none') {
          _this4.audioSegmentLoader_.load();
        }

        if (!audioPlaylist.endList) {
          _this4.audioPlaylistLoader_.trigger('firstplay');
        }
      });

      this.audioPlaylistLoader_.on('loadedplaylist', function () {
        var updatedPlaylist = undefined;

        if (_this4.audioPlaylistLoader_) {
          updatedPlaylist = _this4.audioPlaylistLoader_.media();
        }

        if (!updatedPlaylist) {
          // only one playlist to select
          _this4.audioPlaylistLoader_.media(_this4.audioPlaylistLoader_.playlists.master.playlists[0]);
          return;
        }

        _this4.audioSegmentLoader_.playlist(updatedPlaylist, _this4.requestOptions_);
      });

      this.audioPlaylistLoader_.on('error', function () {
        _videoJs2['default'].log.warn('Problem encountered loading the alternate audio track' + '. Switching back to default.');
        _this4.audioSegmentLoader_.abort();
        _this4.setupAudio();
      });
    }

    /**
     * Determine the correct subtitle playlist based on the active
     * SubtitleTrack and initialize a PlaylistLoader and SegmentLoader if
     * necessary. This method is called once automatically before
     * playback begins to enable the default subtitle track and should be
     * invoked again if the track is changed.
     */
  }, {
    key: 'setupSubtitles',
    value: function setupSubtitles() {
      var _this5 = this;

      var subtitleGroup = this.activeSubtitleGroup_();
      var track = this.activeSubtitleTrack_();

      this.subtitleSegmentLoader_.pause();

      if (!track) {
        // stop playlist and segment loading for subtitles
        if (this.subtitlePlaylistLoader_) {
          this.subtitlePlaylistLoader_.dispose();
          this.subtitlePlaylistLoader_ = null;
        }
        return;
      }

      var properties = subtitleGroup.filter(function (subtitleProperties) {
        return subtitleProperties.id === track.id;
      })[0];

      // startup playlist and segment loaders for the enabled subtitle track
      if (!this.subtitlePlaylistLoader_ ||
      // if the media hasn't loaded yet, we don't have the URI to check, so it is
      // easiest to simply recreate the playlist loader
      !this.subtitlePlaylistLoader_.media() || this.subtitlePlaylistLoader_.media().resolvedUri !== properties.resolvedUri) {

        if (this.subtitlePlaylistLoader_) {
          this.subtitlePlaylistLoader_.dispose();
        }

        // reset the segment loader only when the subtitle playlist is changed instead of
        // every time setupSubtitles is called since switching subtitle tracks fires
        // multiple `change` events on the TextTrackList
        this.subtitleSegmentLoader_.resetEverything();

        // can't reuse playlistloader because we're only using single renditions and not a
        // proper master
        this.subtitlePlaylistLoader_ = new _playlistLoader2['default'](properties.resolvedUri, this.hls_, this.withCredentials);

        this.subtitlePlaylistLoader_.on('loadedmetadata', function () {
          var subtitlePlaylist = _this5.subtitlePlaylistLoader_.media();

          _this5.subtitleSegmentLoader_.playlist(subtitlePlaylist, _this5.requestOptions_);
          _this5.subtitleSegmentLoader_.track(_this5.activeSubtitleTrack_());

          // if the video is already playing, or if this isn't a live video and preload
          // permits, start downloading segments
          if (!_this5.tech_.paused() || subtitlePlaylist.endList && _this5.tech_.preload() !== 'none') {
            _this5.subtitleSegmentLoader_.load();
          }
        });

        this.subtitlePlaylistLoader_.on('loadedplaylist', function () {
          var updatedPlaylist = undefined;

          if (_this5.subtitlePlaylistLoader_) {
            updatedPlaylist = _this5.subtitlePlaylistLoader_.media();
          }

          if (!updatedPlaylist) {
            return;
          }

          _this5.subtitleSegmentLoader_.playlist(updatedPlaylist, _this5.requestOptions_);
        });

        this.subtitlePlaylistLoader_.on('error', this.handleSubtitleError_.bind(this));
      }

      if (this.subtitlePlaylistLoader_.media() && this.subtitlePlaylistLoader_.media().resolvedUri === properties.resolvedUri) {
        this.subtitleSegmentLoader_.load();
      } else {
        this.subtitlePlaylistLoader_.load();
      }
    }

    /**
     * Re-tune playback quality level for the current player
     * conditions. This method may perform destructive actions, like
     * removing already buffered content, to readjust the currently
     * active playlist quickly.
     *
     * @private
     */
  }, {
    key: 'fastQualityChange_',
    value: function fastQualityChange_() {
      var media = this.selectPlaylist();

      if (media !== this.masterPlaylistLoader_.media()) {
        this.masterPlaylistLoader_.media(media);

        this.mainSegmentLoader_.resetLoader();
        // don't need to reset audio as it is reset when media changes
      }
    }

    /**
     * Begin playback.
     */
  }, {
    key: 'play',
    value: function play() {
      if (this.setupFirstPlay()) {
        return;
      }

      if (this.tech_.ended()) {
        this.tech_.setCurrentTime(0);
      }

      if (this.hasPlayed_()) {
        this.load();
      }

      var seekable = this.tech_.seekable();

      // if the viewer has paused and we fell out of the live window,
      // seek forward to the live point
      if (this.tech_.duration() === Infinity) {
        if (this.tech_.currentTime() < seekable.start(0)) {
          return this.tech_.setCurrentTime(seekable.end(seekable.length - 1));
        }
      }
    }

    /**
     * Seek to the latest media position if this is a live video and the
     * player and video are loaded and initialized.
     */
  }, {
    key: 'setupFirstPlay',
    value: function setupFirstPlay() {
      var seekable = undefined;
      var media = this.masterPlaylistLoader_.media();

      // check that everything is ready to begin buffering in the live
      // scenario
      // 1) the active media playlist is available
      if (media &&
      // 2) the player is not paused
      !this.tech_.paused() &&
      // 3) the player has not started playing
      !this.hasPlayed_()) {

        // when the video is a live stream
        if (!media.endList) {
          this.trigger('firstplay');

          // seek to the latest media position for live videos
          seekable = this.seekable();
          if (seekable.length) {
            this.tech_.setCurrentTime(seekable.end(0));
          }
        }
        this.hasPlayed_ = function () {
          return true;
        };
        // now that we are ready, load the segment
        this.load();
        return true;
      }
      return false;
    }

    /**
     * handle the sourceopen event on the MediaSource
     *
     * @private
     */
  }, {
    key: 'handleSourceOpen_',
    value: function handleSourceOpen_() {
      // Only attempt to create the source buffer if none already exist.
      // handleSourceOpen is also called when we are "re-opening" a source buffer
      // after `endOfStream` has been called (in response to a seek for instance)
      try {
        this.setupSourceBuffers_();
      } catch (e) {
        _videoJs2['default'].log.warn('Failed to create Source Buffers', e);
        return this.mediaSource.endOfStream('decode');
      }

      // if autoplay is enabled, begin playback. This is duplicative of
      // code in video.js but is required because play() must be invoked
      // *after* the media source has opened.
      if (this.tech_.autoplay()) {
        this.tech_.play();
      }

      this.trigger('sourceopen');
    }

    /**
     * Calls endOfStream on the media source when all active stream types have called
     * endOfStream
     *
     * @param {string} streamType
     *        Stream type of the segment loader that called endOfStream
     * @private
     */
  }, {
    key: 'onEndOfStream',
    value: function onEndOfStream() {
      var isEndOfStream = this.mainSegmentLoader_.ended_;

      if (this.audioPlaylistLoader_) {
        // if the audio playlist loader exists, then alternate audio is active, so we need
        // to wait for both the main and audio segment loaders to call endOfStream
        isEndOfStream = isEndOfStream && this.audioSegmentLoader_.ended_;
      }

      if (isEndOfStream) {
        this.mediaSource.endOfStream();
      }
    }

    /**
     * Check if a playlist has stopped being updated
     * @param {Object} playlist the media playlist object
     * @return {boolean} whether the playlist has stopped being updated or not
     */
  }, {
    key: 'stuckAtPlaylistEnd_',
    value: function stuckAtPlaylistEnd_(playlist) {
      var seekable = this.seekable();

      if (!seekable.length) {
        // playlist doesn't have enough information to determine whether we are stuck
        return false;
      }

      var expired = this.syncController_.getExpiredTime(playlist, this.mediaSource.duration);

      if (expired === null) {
        return false;
      }

      // does not use the safe live end to calculate playlist end, since we
      // don't want to say we are stuck while there is still content
      var absolutePlaylistEnd = Hls.Playlist.playlistEnd(playlist, expired);
      var currentTime = this.tech_.currentTime();
      var buffered = this.tech_.buffered();

      if (!buffered.length) {
        // return true if the playhead reached the absolute end of the playlist
        return absolutePlaylistEnd - currentTime <= _ranges2['default'].TIME_FUDGE_FACTOR;
      }
      var bufferedEnd = buffered.end(buffered.length - 1);

      // return true if there is too little buffer left and
      // buffer has reached absolute end of playlist
      return bufferedEnd - currentTime <= _ranges2['default'].TIME_FUDGE_FACTOR && absolutePlaylistEnd - bufferedEnd <= _ranges2['default'].TIME_FUDGE_FACTOR;
    }

    /**
     * Blacklists a playlist when an error occurs for a set amount of time
     * making it unavailable for selection by the rendition selection algorithm
     * and then forces a new playlist (rendition) selection.
     *
     * @param {Object=} error an optional error that may include the playlist
     * to blacklist
     * @param {Number=} blacklistDuration an optional number of seconds to blacklist the
     * playlist
     */
  }, {
    key: 'blacklistCurrentPlaylist',
    value: function blacklistCurrentPlaylist(error, blacklistDuration) {
      if (error === undefined) error = {};

      var currentPlaylist = undefined;
      var nextPlaylist = undefined;

      // If the `error` was generated by the playlist loader, it will contain
      // the playlist we were trying to load (but failed) and that should be
      // blacklisted instead of the currently selected playlist which is likely
      // out-of-date in this scenario
      currentPlaylist = error.playlist || this.masterPlaylistLoader_.media();

      // If there is no current playlist, then an error occurred while we were
      // trying to load the master OR while we were disposing of the tech
      if (!currentPlaylist) {
        this.error = error;

        try {
          return this.mediaSource.endOfStream('network');
        } catch (e) {
          return this.trigger('error');
        }
      }

      var isFinalRendition = this.masterPlaylistLoader_.isFinalRendition_();

      if (isFinalRendition) {
        // Never blacklisting this playlist because it's final rendition
        _videoJs2['default'].log.warn('Problem encountered with the current ' + 'HLS playlist. Trying again since it is the final playlist.');

        this.tech_.trigger('retryplaylist');
        return this.masterPlaylistLoader_.load(isFinalRendition);
      }
      // Blacklist this playlist
      currentPlaylist.excludeUntil = Date.now() + (blacklistDuration ? blacklistDuration : this.blacklistDuration) * 1000;
      this.tech_.trigger('blacklistplaylist');
      this.tech_.trigger({ type: 'usage', name: 'hls-rendition-blacklisted' });

      // Select a new playlist
      nextPlaylist = this.selectPlaylist();
      _videoJs2['default'].log.warn('Problem encountered with the current HLS playlist.' + (error.message ? ' ' + error.message : '') + ' Switching to another playlist.');

      return this.masterPlaylistLoader_.media(nextPlaylist);
    }

    /**
     * Pause all segment loaders
     */
  }, {
    key: 'pauseLoading',
    value: function pauseLoading() {
      this.mainSegmentLoader_.pause();
      if (this.audioPlaylistLoader_) {
        this.audioSegmentLoader_.pause();
      }
      if (this.subtitlePlaylistLoader_) {
        this.subtitleSegmentLoader_.pause();
      }
    }

    /**
     * set the current time on all segment loaders
     *
     * @param {TimeRange} currentTime the current time to set
     * @return {TimeRange} the current time
     */
  }, {
    key: 'setCurrentTime',
    value: function setCurrentTime(currentTime) {
      var buffered = _ranges2['default'].findRange(this.tech_.buffered(), currentTime);

      if (!(this.masterPlaylistLoader_ && this.masterPlaylistLoader_.media())) {
        // return immediately if the metadata is not ready yet
        return 0;
      }

      // it's clearly an edge-case but don't thrown an error if asked to
      // seek within an empty playlist
      if (!this.masterPlaylistLoader_.media().segments) {
        return 0;
      }

      // In flash playback, the segment loaders should be reset on every seek, even
      // in buffer seeks
      var isFlash = this.mode_ === 'flash' || this.mode_ === 'auto' && !_videoJs2['default'].MediaSource.supportsNativeMediaSources();

      // if the seek location is already buffered, continue buffering as
      // usual
      if (buffered && buffered.length && !isFlash) {
        return currentTime;
      }

      // cancel outstanding requests so we begin buffering at the new
      // location
      this.mainSegmentLoader_.resetEverything();
      this.mainSegmentLoader_.abort();
      if (this.audioPlaylistLoader_) {
        this.audioSegmentLoader_.resetEverything();
        this.audioSegmentLoader_.abort();
      }
      if (this.subtitlePlaylistLoader_) {
        this.subtitleSegmentLoader_.resetEverything();
        this.subtitleSegmentLoader_.abort();
      }

      // start segment loader loading in case they are paused
      this.load();
    }

    /**
     * get the current duration
     *
     * @return {TimeRange} the duration
     */
  }, {
    key: 'duration',
    value: function duration() {
      if (!this.masterPlaylistLoader_) {
        return 0;
      }

      if (this.mediaSource) {
        return this.mediaSource.duration;
      }

      return Hls.Playlist.duration(this.masterPlaylistLoader_.media());
    }

    /**
     * check the seekable range
     *
     * @return {TimeRange} the seekable range
     */
  }, {
    key: 'seekable',
    value: function seekable() {
      return this.seekable_;
    }
  }, {
    key: 'onSyncInfoUpdate_',
    value: function onSyncInfoUpdate_() {
      var mainSeekable = undefined;
      var audioSeekable = undefined;

      if (!this.masterPlaylistLoader_) {
        return;
      }

      var media = this.masterPlaylistLoader_.media();

      if (!media) {
        return;
      }

      var expired = this.syncController_.getExpiredTime(media, this.mediaSource.duration);

      if (expired === null) {
        // not enough information to update seekable
        return;
      }

      mainSeekable = Hls.Playlist.seekable(media, expired);

      if (mainSeekable.length === 0) {
        return;
      }

      if (this.audioPlaylistLoader_) {
        media = this.audioPlaylistLoader_.media();
        expired = this.syncController_.getExpiredTime(media, this.mediaSource.duration);

        if (expired === null) {
          return;
        }

        audioSeekable = Hls.Playlist.seekable(media, expired);

        if (audioSeekable.length === 0) {
          return;
        }
      }

      if (!audioSeekable) {
        // seekable has been calculated based on buffering video data so it
        // can be returned directly
        this.seekable_ = mainSeekable;
      } else if (audioSeekable.start(0) > mainSeekable.end(0) || mainSeekable.start(0) > audioSeekable.end(0)) {
        // seekables are pretty far off, rely on main
        this.seekable_ = mainSeekable;
      } else {
        this.seekable_ = _videoJs2['default'].createTimeRanges([[audioSeekable.start(0) > mainSeekable.start(0) ? audioSeekable.start(0) : mainSeekable.start(0), audioSeekable.end(0) < mainSeekable.end(0) ? audioSeekable.end(0) : mainSeekable.end(0)]]);
      }

      this.tech_.trigger('seekablechanged');
    }

    /**
     * Update the player duration
     */
  }, {
    key: 'updateDuration',
    value: function updateDuration() {
      var _this6 = this;

      var oldDuration = this.mediaSource.duration;
      var newDuration = Hls.Playlist.duration(this.masterPlaylistLoader_.media());
      var buffered = this.tech_.buffered();
      var setDuration = function setDuration() {
        _this6.mediaSource.duration = newDuration;
        _this6.tech_.trigger('durationchange');

        _this6.mediaSource.removeEventListener('sourceopen', setDuration);
      };

      if (buffered.length > 0) {
        newDuration = Math.max(newDuration, buffered.end(buffered.length - 1));
      }

      // if the duration has changed, invalidate the cached value
      if (oldDuration !== newDuration) {
        // update the duration
        if (this.mediaSource.readyState !== 'open') {
          this.mediaSource.addEventListener('sourceopen', setDuration);
        } else {
          setDuration();
        }
      }
    }

    /**
     * dispose of the MasterPlaylistController and everything
     * that it controls
     */
  }, {
    key: 'dispose',
    value: function dispose() {
      this.decrypter_.terminate();
      this.masterPlaylistLoader_.dispose();
      this.mainSegmentLoader_.dispose();

      if (this.audioPlaylistLoader_) {
        this.audioPlaylistLoader_.dispose();
      }
      if (this.subtitlePlaylistLoader_) {
        this.subtitlePlaylistLoader_.dispose();
      }
      this.audioSegmentLoader_.dispose();
      this.subtitleSegmentLoader_.dispose();
    }

    /**
     * return the master playlist object if we have one
     *
     * @return {Object} the master playlist object that we parsed
     */
  }, {
    key: 'master',
    value: function master() {
      return this.masterPlaylistLoader_.master;
    }

    /**
     * return the currently selected playlist
     *
     * @return {Object} the currently selected playlist object that we parsed
     */
  }, {
    key: 'media',
    value: function media() {
      // playlist loader will not return media if it has not been fully loaded
      return this.masterPlaylistLoader_.media() || this.initialMedia_;
    }

    /**
     * setup our internal source buffers on our segment Loaders
     *
     * @private
     */
  }, {
    key: 'setupSourceBuffers_',
    value: function setupSourceBuffers_() {
      var media = this.masterPlaylistLoader_.media();
      var mimeTypes = undefined;

      // wait until a media playlist is available and the Media Source is
      // attached
      if (!media || this.mediaSource.readyState !== 'open') {
        return;
      }

      mimeTypes = mimeTypesForPlaylist_(this.masterPlaylistLoader_.master, media);
      if (mimeTypes.length < 1) {
        this.error = 'No compatible SourceBuffer configuration for the variant stream:' + media.resolvedUri;
        return this.mediaSource.endOfStream('decode');
      }
      this.mainSegmentLoader_.mimeType(mimeTypes[0]);
      if (mimeTypes[1]) {
        this.audioSegmentLoader_.mimeType(mimeTypes[1]);
      }

      // exclude any incompatible variant streams from future playlist
      // selection
      this.excludeIncompatibleVariants_(media);
    }

    /**
     * Blacklist playlists that are known to be codec or
     * stream-incompatible with the SourceBuffer configuration. For
     * instance, Media Source Extensions would cause the video element to
     * stall waiting for video data if you switched from a variant with
     * video and audio to an audio-only one.
     *
     * @param {Object} media a media playlist compatible with the current
     * set of SourceBuffers. Variants in the current master playlist that
     * do not appear to have compatible codec or stream configurations
     * will be excluded from the default playlist selection algorithm
     * indefinitely.
     * @private
     */
  }, {
    key: 'excludeIncompatibleVariants_',
    value: function excludeIncompatibleVariants_(media) {
      var master = this.masterPlaylistLoader_.master;
      var codecCount = 2;
      var videoCodec = null;
      var codecs = undefined;

      if (media.attributes.CODECS) {
        codecs = (0, _utilCodecsJs.parseCodecs)(media.attributes.CODECS);
        videoCodec = codecs.videoCodec;
        codecCount = codecs.codecCount;
      }
      master.playlists.forEach(function (variant) {
        var variantCodecs = {
          codecCount: 2,
          videoCodec: null
        };

        if (variant.attributes.CODECS) {
          var codecString = variant.attributes.CODECS;

          variantCodecs = (0, _utilCodecsJs.parseCodecs)(codecString);

          if (window.MediaSource && window.MediaSource.isTypeSupported && !window.MediaSource.isTypeSupported('video/mp4; codecs="' + mapLegacyAvcCodecs_(codecString) + '"')) {
            variant.excludeUntil = Infinity;
          }
        }

        // if the streams differ in the presence or absence of audio or
        // video, they are incompatible
        if (variantCodecs.codecCount !== codecCount) {
          variant.excludeUntil = Infinity;
        }

        // if h.264 is specified on the current playlist, some flavor of
        // it must be specified on all compatible variants
        if (variantCodecs.videoCodec !== videoCodec) {
          variant.excludeUntil = Infinity;
        }
      });
    }
  }, {
    key: 'updateAdCues_',
    value: function updateAdCues_(media) {
      var offset = 0;
      var seekable = this.seekable();

      if (seekable.length) {
        offset = seekable.start(0);
      }

      _adCueTags2['default'].updateAdCues(media, this.cueTagsTrack_, offset);
    }

    /**
     * Calculates the desired forward buffer length based on current time
     *
     * @return {Number} Desired forward buffer length in seconds
     */
  }, {
    key: 'goalBufferLength',
    value: function goalBufferLength() {
      var currentTime = this.tech_.currentTime();
      var initial = _config2['default'].GOAL_BUFFER_LENGTH;
      var rate = _config2['default'].GOAL_BUFFER_LENGTH_RATE;
      var max = Math.max(initial, _config2['default'].MAX_GOAL_BUFFER_LENGTH);

      return Math.min(initial + currentTime * rate, max);
    }

    /**
     * Calculates the desired buffer low water line based on current time
     *
     * @return {Number} Desired buffer low water line in seconds
     */
  }, {
    key: 'bufferLowWaterLine',
    value: function bufferLowWaterLine() {
      var currentTime = this.tech_.currentTime();
      var initial = _config2['default'].BUFFER_LOW_WATER_LINE;
      var rate = _config2['default'].BUFFER_LOW_WATER_LINE_RATE;
      var max = Math.max(initial, _config2['default'].MAX_BUFFER_LOW_WATER_LINE);

      return Math.min(initial + currentTime * rate, max);
    }
  }]);

  return MasterPlaylistController;
})(_videoJs2['default'].EventTarget);

exports.MasterPlaylistController = MasterPlaylistController;