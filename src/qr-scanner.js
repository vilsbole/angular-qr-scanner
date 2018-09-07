if (require){
  if (!angular) var angular = require('angular');
  if (!qrcode) var qrcode = require('jsqrcode');
}

require('./jsqrcode-combined.min')

(function() {
'use strict';

angular.module('qrScanner', ["ng"]).directive('qrScanner', ['$interval', '$window', function($interval, $window) {
  return {
    restrict: 'E',
    scope: {
      ngSuccess: '&ngSuccess',
      ngError: '&ngError',
      ngVideoError: '&ngVideoError'
    },
    link: function(scope, element, attrs) {
      window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

      var height = attrs.height || 300;
      var width = attrs.width || 250;

      var video = $window.document.createElement('video');
      video.setAttribute('width', width);
      video.setAttribute('height', height);
      video.setAttribute('style', '-moz-transform:rotateY(-180deg);-webkit-transform:rotateY(-180deg);transform:rotateY(-180deg);');
      var canvas = $window.document.createElement('canvas');
      canvas.setAttribute('id', 'qr-canvas');
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);
      canvas.setAttribute('style', 'display:none;');

      angular.element(element).append(video);
      angular.element(element).append(canvas);
      var context = canvas.getContext('2d');
      var stopScan;

      var scan = function() {
        if (video.srcObject) {
          context.drawImage(video, 0, 0, 307,250);
          try {
            qrcode.decode();
          } catch(e) {
            scope.ngError({error: e});
          }
        }
      }

      var successCallback = function(stream) {
        video.srcObject = stream;
        scope.video = video;
        video.play();
        stopScan = $interval(scan, 500);
      }

      if (navigator.getUserMedia) {
        navigator.mediaDevices.getUserMedia({video: { facingMode: {front: "environment"} }})
          .then(successCallback)
      } else {
        scope.ngVideoError({error: 'Native web camera streaming (getUserMedia) not supported in this browser.'});
      }

      qrcode.callback = function(data) {
        scope.ngSuccess({data: data});
      };

      element.bind('$destroy', function() {
        if ($window.localMediaStream) {
          $window.localMediaStream.getVideoTracks()[0].stop();
        }
        if (stopScan) {
          $interval.cancel(stopScan);
        }
      });
    }
  }
}]);
})();
