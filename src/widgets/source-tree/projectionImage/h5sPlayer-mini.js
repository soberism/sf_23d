/**
 * 只用到了h5splayer的ws版本
 * */

function createRTCSessionDescription(t) {
  return new RTCSessionDescription(t)
}

function H5sPlayerWS(t) {
  var s;
  this.sourceBuffer, this.buffer = [], this.t, this.video, this.s, this.i, this.o, this.h = 0, this.l = 0, this.u = 0, this.C = !1, this.S = !1, this.v = !1, this.H, this.p = !0, void 0 !== t.consolelog && "false" === t.consolelog && (this.p = !1), this.k = t, !0 === this.p && console.log("[WS] Websocket Conf:", t), this.R = t.videoid, this.P = t.pbconf, this.W = t.token, void 0 === this.R ? (this.T = t.videodom, !0 === this.p && console.log("[WS] use dom directly", t.token)) : (this.T = document.getElementById(this.R), !0 === this.p && console.log("[WS] use videoid", t.token)), this.video = this.T, void 0 != this.P && "false" == this.P.showposter || (s = this.k.protocol + "//" + this.k.host + this.k.rootpath + "api/v1/GetImage?token=" + this.W + "&session=" + this.k.session, !0 === this.p && console.log("[WS] connect src", t.token), this.T.setAttribute("poster", s))
}

function H5sPlayerAudio(t) {
  this.buffer = [], this.s, this.C = !1, this.S = !1, this.k = t, this.p = !0, void 0 !== t.consolelog && "false" === t.consolelog && (this.p = !1), !0 === this.p && console.log("[AUD] Aduio Player Conf:", t), this.W = t.token, this.D = new AudioContext
}

function H5sPlayerAudBack(t) {
  this.buffer = [], this.s, this.C = !1, this.S = !1, this.k = t, this.U = 0, this.L = 48e3, this.B = !1, this.p = !0, void 0 !== t.consolelog && "false" === t.consolelog && (this.p = !1), !0 === this.p && console.log("[AUDBACK] Aduio Back Conf:", t), this.W = t.token, this.D = new AudioContext, !0 === this.p && console.log("[AUDBACK] sampleRate", this.D.sampleRate), this.K()
}

function float32ToInt16(t) {
  for (var s = t.length, i = new Int16Array(s); s--;) i[s] = 32767 * Math.min(1, t[s]);
  return i
}

H5sPlayerWS.prototype.Y = function () {
  !0 === this.C && (!0 === this.p && console.log("[WS] Reconnect..."), this.Z(this.W), this.C = !1)
}
H5sPlayerWS.prototype.$ = function (t) {
  var s;
  !0 === this.p && console.log("[WS] H5SWebSocketClient");
  try {
    "http:" == this.k.protocol && (s = "undefined" != typeof MozWebSocket ? new MozWebSocket("ws://" + this.k.host + t) : new WebSocket("ws://" + this.k.host + t)), "https:" == this.k.protocol && (!0 === this.p && console.log(this.k.host), s = "undefined" != typeof MozWebSocket ? new MozWebSocket("wss://" + this.k.host + t) : new WebSocket("wss://" + this.k.host + t)), !0 === this.p && console.log(this.k.host)
  } catch (t) {
    return void alert("error")
  }
  return s
}
H5sPlayerWS.prototype.tt = function () {
  if (null !== this.sourceBuffer && void 0 !== this.sourceBuffer) {
    if (0 !== this.buffer.length && !this.sourceBuffer.updating) try {
      var t = this.buffer.shift(), s = new Uint8Array(t);
      this.sourceBuffer.appendBuffer(s)
    } catch (t) {
      !0 === this.p && console.log(t)
    }
  } else !0 === this.p && console.log("[WS] is null or undefined", this.sourceBuffer)
}
H5sPlayerWS.prototype.st = function () {
  try {
    var t = {cmd: "H5_KEEPALIVE"};
    this.s.send(JSON.stringify(t))
  } catch (t) {
    !0 === this.p && console.log(t)
  }
}
H5sPlayerWS.prototype.it = function (t) {
  return t.data, ArrayBuffer, "string" == typeof t.data ? (!0 === this.p && console.log("[WS] string"), void(void 0 != this.P && void 0 != this.P.callback && this.P.callback(t.data, this.P.userdata))) : !0 !== this.S ? !1 === this.v ? (this.H = String.fromCharCode.apply(null, new Uint8Array(t.data)), this.et(this), void(this.v = !0)) : (this.buffer.push(t.data), void this.tt()) : void 0
}
H5sPlayerWS.prototype.et = function (t) {
  try {
    window.MediaSource = window.MediaSource || window.WebKitMediaSource, window.MediaSource || !0 === t.p && console.log("[WS] MediaSource API is not available");
    var s = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
    "MediaSource" in window && MediaSource.isTypeSupported(s) ? !0 === t.p && console.log("[WS] MIME type or codec: ", s) : !0 === t.p && console.log("[WS] Unsupported MIME type or codec: ", s), t.t = new window.MediaSource, t.video.autoplay = !0, !0 === t.p && console.log(t.R);
    t.video.src = window.URL.createObjectURL(t.t), t.video.play(), t.t.addEventListener("sourceopen", t.ot.bind(t), !1)
  } catch (s) {
    !0 === t.p && console.log(s)
  }
}
H5sPlayerWS.prototype.ot = function () {
  !0 === this.p && console.log("[WS] Add SourceBuffer"), this.sourceBuffer = this.t.addSourceBuffer(this.H), this.t.duration = 1 / 0, this.t.removeEventListener("sourceopen", this.ot, !1), this.sourceBuffer.addEventListener("updateend", this.tt.bind(this), !1)
}
H5sPlayerWS.prototype.Z = function (t) {
  this.video.autoplay = !0;
  var s = "api/v1/h5swsapi", i = "main";
  if (void 0 === this.k.streamprofile || (i = this.k.streamprofile), void 0 === this.P) s = this.k.rootpath + s + "?token=" + t + "&profile=" + i + "&session=" + this.k.session; else {
    var e = "false", o = "fake";
    void 0 === this.P.serverpb || (e = this.P.serverpb), void 0 === this.P.filename || (o = this.P.filename), s = this.k.rootpath + s + "?token=" + t + "&playback=true&profile=" + i + "&serverpb=" + e + "&begintime=" + encodeURIComponent(this.P.begintime) + "&endtime=" + encodeURIComponent(this.P.endtime) + "&filename=" + o + "&session=" + this.k.session
  }
  this.k.session, !0 === this.p && console.log(s), this.s = this.$(s), !0 === this.p && console.log("[WS] setupWebSocket", this.s), this.s.binaryType = "arraybuffer", this.s.nt = this, this.s.onmessage = this.it.bind(this), this.s.onopen = function () {
    !0 === this.nt.p && console.log("[WS] wsSocket.onopen", this.nt), this.nt.i = setInterval(this.nt.ht.bind(this.nt), 1e4), this.nt.o = setInterval(this.nt.st.bind(this.nt), 1e3), void 0 != this.nt.P && "true" === this.nt.P.autoplay && this.nt.start()
  }, this.s.onclose = function () {
    !0 === this.nt.p && console.log("[WS] wsSocket.onclose", this.nt), !0 === this.nt.S ? !0 === this.nt.p && console.log("[WS] wsSocket.onclose disconnect") : this.nt.C = !0, this.nt.ct(this.nt), this.nt.rt(this.nt), this.nt.H = "", this.nt.v = !1
  }
}
H5sPlayerWS.prototype.ct = function (t) {
  !0 === t.p && console.log("[WS] Cleanup Source Buffer", t);
  try {
    t.sourceBuffer.removeEventListener("updateend", t.tt, !1), t.sourceBuffer.abort(), document.documentMode || /Edge/.test(navigator.userAgent) ? !0 === t.p && console.log("[WS] IE or EDGE!") : t.t.removeSourceBuffer(t.sourceBuffer), t.sourceBuffer = null, t.t = null, t.buffer = []
  } catch (s) {
    !0 === t.p && console.log(s)
  }
}
H5sPlayerWS.prototype.rt = function (t) {
  !0 === t.p && console.log("[WS] CleanupWebSocket", t), clearInterval(t.o), clearInterval(t.i), t.h = 0, t.l = 0, t.u = 0
}
H5sPlayerWS.prototype.ht = function () {
  if (void 0 === this.P) {
    !0 === this.S && (!0 === this.p && console.log("[WS] CheckSourceBuffer has been disconnect", this), clearInterval(this.o), clearInterval(this.i), clearInterval(this.at));
    try {
      if (!0 === this.p && console.log("[WS] CheckSourceBuffer", this), this.sourceBuffer.buffered.length <= 0) {
        if (this.h++, this.h > 8) return !0 === this.p && console.log("[WS] CheckSourceBuffer Close 1"), void this.s.close()
      } else {
        this.h = 0;
        this.sourceBuffer.buffered.start(0);
        var t = this.sourceBuffer.buffered.end(0), s = t - this.video.currentTime;
        if (s > 5 || s < 0) return !0 === this.p && console.log("[WS] CheckSourceBuffer Close 2", s), void this.s.close();
        if (t == this.l) {
          if (this.u++, this.u > 3) return !0 === this.p && console.log("[WS] CheckSourceBuffer Close 3"), void this.s.close()
        } else this.u = 0;
        this.l = t
      }
    } catch (t) {
      !0 === this.p && console.log(t)
    }
  }
}
H5sPlayerWS.prototype.connect = function () {
  this.Z(this.W), this.at = setInterval(this.Y.bind(this), 3e3)
}
H5sPlayerWS.prototype.disconnect = function () {
  !0 === this.p && console.log("[WS] disconnect", this), this.S = !0, clearInterval(this.at), null != this.s && (this.s.close(), this.s = null), !0 === this.p && console.log("[WS] disconnect", this)
}
H5sPlayerWS.prototype.start = function () {
  try {
    var t = {cmd: "H5_START"};
    this.s.send(JSON.stringify(t))
  } catch (t) {
    !0 === this.p && console.log(t)
  }
}
H5sPlayerWS.prototype.pause = function () {
  try {
    var t = {cmd: "H5_PAUSE"};
    this.s.send(JSON.stringify(t))
  } catch (t) {
    !0 === this.p && console.log(t)
  }
}
H5sPlayerWS.prototype.resume = function () {
  try {
    var t = {cmd: "H5_RESUME"};
    this.s.send(JSON.stringify(t))
  } catch (t) {
    !0 === this.p && console.log(t)
  }
}
H5sPlayerWS.prototype.seek = function (t) {
  try {
    var s = {cmd: "H5_SEEK"};
    s.nSeekTime = t, this.s.send(JSON.stringify(s))
  } catch (t) {
    !0 === this.p && console.log(t)
  }
}
H5sPlayerWS.prototype.speed = function (t) {
  try {
    var s = {cmd: "H5_SPEED"};
    s.nSpeed = t, this.s.send(JSON.stringify(s))
  } catch (t) {
    !0 === this.p && console.log(t)
  }
}
H5sPlayerAudio.prototype.$ = function (t) {
  var s;
  !0 === this.p && console.log("[AUD] H5SWebSocketClient");
  try {
    "http:" == this.k.protocol && (s = "undefined" != typeof MozWebSocket ? new MozWebSocket("ws://" + this.k.host + t) : new WebSocket("ws://" + this.k.host + t)), "https:" == this.k.protocol && (!0 === this.p && console.log(this.k.host), s = "undefined" != typeof MozWebSocket ? new MozWebSocket("wss://" + this.k.host + t) : new WebSocket("wss://" + this.k.host + t)), !0 === this.p && console.log(this.k.host)
  } catch (t) {
    return void alert("error")
  }
  return s
}
H5sPlayerAudio.prototype.st = function () {
  try {
    this.s.send("keepalive")
  } catch (t) {
    !0 === this.p && console.log(t)
  }
}
H5sPlayerAudio.prototype.it = function (t) {
  for (var s = new Int16Array(t.data), i = s.length, e = this.D.createBuffer(1, i, 8e3), o = 0; o < 1; o++) for (var n = e.getChannelData(o), h = 0; h < i; h++) n[h] = s[h] / 16383.5;
  var c = this.D.createBufferSource();
  c.buffer = e, c.connect(this.D.destination), c.start()
}
H5sPlayerAudio.prototype.rt = function (t) {
  !0 === t.p && console.log("[AUD] CleanupWebSocket", t), clearInterval(t.o)
}
H5sPlayerAudio.prototype.Z = function (t) {
  var s = "api/v1/h5saudapi";
  s = this.k.rootpath + s + "?token=" + t + "&session=" + this.k.session, !0 === this.p && console.log(s), this.s = this.$(s), !0 === this.p && console.log("[AUD] setupWebSocket for audio", this.s), this.s.binaryType = "arraybuffer", this.s.nt = this, this.s.onmessage = this.it.bind(this), this.s.onopen = function () {
    !0 === this.nt.p && console.log("[AUD] wsSocket.onopen", this.nt), this.nt.o = setInterval(this.nt.st.bind(this.nt), 1e3)
  }, this.s.onclose = function () {
    !0 === this.nt.p && console.log("[AUD] wsSocket.onclose", this.nt), this.nt.rt(this.nt)
  }
}
H5sPlayerAudio.prototype.connect = function () {
  this.Z(this.W)
}
H5sPlayerAudio.prototype.disconnect = function () {
  !0 === this.p && console.log("[AUD] disconnect", this), null != this.s && (this.s.close(), this.s = null), !0 === this.p && console.log("[AUD] disconnect", this)
}
H5sPlayerAudBack.prototype.$ = function (t) {
  var s;
  !0 === this.p && console.log("[AUDBACK] H5SWebSocketClient");
  try {
    "http:" == this.k.protocol && (s = "undefined" != typeof MozWebSocket ? new MozWebSocket("ws://" + this.k.host + t) : new WebSocket("ws://" + this.k.host + t)), "https:" == this.k.protocol && (!0 === this.p && console.log(this.k.host), s = "undefined" != typeof MozWebSocket ? new MozWebSocket("wss://" + this.k.host + t) : new WebSocket("wss://" + this.k.host + t)), !0 === this.p && console.log(this.k.host)
  } catch (t) {
    return void alert("error")
  }
  return s
}
H5sPlayerAudBack.prototype.st = function () {
  try {
    this.s.send("keepalive")
  } catch (t) {
    !0 === this.p && console.log(t)
  }
}
H5sPlayerAudBack.prototype.it = function (t) {
}
H5sPlayerAudBack.prototype.rt = function (t) {
  !0 === this.p && console.log("[AUDBACK] CleanupWebSocket", t), clearInterval(t.o)
}
H5sPlayerAudBack.prototype.K = function () {
  !0 === this.p && console.log("[AUDBACK] sampleRate", this.D.sampleRate), navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.Ht;
  try {
    navigator.getUserMedia({video: !1, audio: !0}, this.pt.bind(this))
  } catch (t) {
    return void alert("[AUDBACK] Audio back false getUserMedia", t)
  }
}
H5sPlayerAudBack.prototype.Et = function () {
  this.B = !0
}
H5sPlayerAudBack.prototype.Z = function (t) {
  var s = "api/v1/h5saudbackapi";
  s = this.k.rootpath + s + "?token=" + t + "&samplerate=" + this.L + "&session=" + this.k.session, !0 === this.p && console.log(s), this.s = this.$(s), !0 === this.p && console.log("[AUDBACK] setupWebSocket for audio back", this.s), this.s.binaryType = "arraybuffer", this.s.nt = this, this.s.onmessage = this.it.bind(this), this.s.onopen = this.Et.bind(this), this.s.onclose = function () {
    !0 === this.p && console.log("[AUDBACK] wsSocket.onclose", this.nt), this.nt.rt(this.nt)
  }
}
H5sPlayerAudBack.prototype.kt = function (t) {
  var s = float32ToInt16(t.inputBuffer.getChannelData(0));
  !0 === this.B && this.s && this.s.send(s)
}
H5sPlayerAudBack.prototype.pt = function (t) {
  try {
    var s = this.D.createMediaStreamSource(t), i = this.D.createScriptProcessor(1024, 1, 1);
    s.connect(i), i.connect(this.D.destination), i.onaudioprocess = this.kt.bind(this)
  } catch (t) {
    return void alert("Audio intecomm error", t)
  }
}
H5sPlayerAudBack.prototype.connect = function () {
  this.Z(this.W)
}
H5sPlayerAudBack.prototype.disconnect = function () {
  !0 === this.p && console.log("[AUDBACK] disconnect", this), null != this.s && (this.s.close(), this.s = null), !0 === this.p && console.log("[AUDBACK] disconnect", this)
}

/**
 *=================H5Player Create
 *
 */

function H5sPlayerCreate(conf) {
  let player;
  player = new H5sPlayerWS(conf);
  return player;
}


/**
 *=================H5Player Delete
 *
 */
function remove(player) {
  player = null;
  return true;
}

export default {
  H5sPlayerCreate,
  remove
}
