let defaultImage = function (color, scale) {//参数为css的color和scale {0,1}
  let canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;
  let ctx = canvas.getContext('2d');
  let p = canvas.width / 2;
  let grd = ctx.createRadialGradient(p, p, 0, p, p, p * (scale || 1));
  grd.addColorStop(0, 'rgba(0,0,0,0)');
  grd.addColorStop(1, color);
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(p, p, p * (scale || 1), 0, 2 * Math.PI);
  ctx.fill();
  return canvas.toDataURL();
};
//默认的绘制的另一种方式
function getColorRamp(color, scale) {
  let Color = Cesium.Color.fromCssColorString(color);
  let canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;
  let ctx = canvas.getContext('2d');
  let p = canvas.width / 2;
  ctx.fillStyle = Color.withAlpha(0.3).toCssColorString();
  ctx.beginPath();
  ctx.arc(p, p, p * (scale || 1), 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillStyle = Color.withAlpha(0.5).toCssColorString();
  ctx.beginPath();
  ctx.arc(p, p, p * (scale || 1) / 2, 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillStyle = Color.withAlpha(0.9).toCssColorString();
  ctx.beginPath();
  ctx.arc(p, p, p * (scale || 1) / 2 / 2, 0, 2 * Math.PI);
  ctx.fill();
  return canvas.toDataURL();
}
/**
 * A {@link MaterialProperty} that maps to image {@link Material} uniforms.
 * @alias FadeMaterialProperty
 * @constructor
 *
 * @param {Object} [options] Object with the following properties:
 * @param {Property} [options.image] A Property specifying the Image, URL, Canvas, or Video.
 * @param {Property} [options.repeat=new Cartesian2(1.0, 1.0)] A {@link Cartesian2} Property specifying the number of times the image repeats in each direction.
 * @param {Property} [options.color=Color.WHITE] The color applied to the image
 * @param {Property} [options.transparent=false] Set to true when the image has transparency (for example, when a png has transparent sections)
 */
function FadeMaterialProperty(options) {
  let Cartesian2 = Cesium.Cartesian2,
    Color = Cesium.Color,
    defaultValue = Cesium.defaultValue,
    defined = Cesium.defined,
    defineProperties = Cesium.defineProperties,
    Event = Cesium.Event,
    createPropertyDescriptor = Cesium.createPropertyDescriptor,
    Property = Cesium.Property;

  let defaultRepeat = new Cartesian2(1, 1);
  let defaultTransparent = true;
  let defaultColor = Color.WHITE;
  let defaultPeriod = 1000;
  let defaultSync = true;


  options = defaultValue(options, defaultValue.EMPTY_OBJECT);

  this._definitionChanged = new Event();
  this._image = undefined;
  this._imageSubscription = undefined;
  this._repeat = undefined;
  this._repeatSubscription = undefined;
  this._color = undefined;
  this._colorSubscription = undefined;
  this._transparent = undefined;
  this._transparentSubscription = undefined;
  this._period = undefined;
  this._periodSubscription = undefined;
  this._sync = undefined;
  this._syncSubscription = undefined;

  if (typeof options.image === 'function') {
    this._drawImage = options.image;
  } else {
    this._drawImage = defaultImage;
    this.image = options.image;
  }
  this.repeat = options.repeat;
  this.color = options.color;
  this.transparent = options.transparent;
  this.period = options.period;
  this.sync = options.sync;

  this._startTime = new Date().getTime();//Cesium.JulianDate.fromDate(new Date());//开始时间
}
export default FadeMaterialProperty;
