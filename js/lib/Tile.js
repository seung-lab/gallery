/**
 * author @ Mark Richardson
 **/

function Tile(omni, twoD, view, p, dim) {
  "use strict";

  this.omni = omni;

  var _this = this;
  var _dim = dim;
  var _twoD = twoD;
  var _view = view;
  var _o = Omni.ortho[_dim];

  this.coord = p.coord;
  this.channel = new Image();
  this.segmentation = new Image();
  this.channel.uv = new THREE.Vector4(0, 0, 1, 1);
  this.segmentation.uv = new THREE.Vector4(0, 0, 1, 1);

  var _channelTex = new THREE.Texture(this.channel,
    undefined,
    undefined,
    undefined,
    THREE.NearestFilter,
    THREE.NearestFilter);
  _channelTex.generateMipmaps = false;
  _channelTex.format = THREE.LuminanceFormat;

  var _tileTex = new THREE.Texture(this.channel,
    undefined,
    undefined,
    undefined,
    THREE.LinearFilter,
    THREE.LinearFilter);
  _tileTex.generateMipmaps = false;
  _tileTex.format = THREE.LuminanceFormat;

  var _segmentationTex = new THREE.Texture(this.segmentation,
    undefined,
    undefined,
    undefined,
    THREE.NearestFilter,
    THREE.NearestFilter);
  _segmentationTex.generateMipmaps = false;

  var _dummyTex = THREE.ImageUtils.generateDataTexture(1, 1, new THREE.Color(0xBBBBBB));

  this.mat = new THREE.MeshBasicMaterial({
    map: this.omni.prefs.get('em3d') ? _tileTex : _dummyTex,
    color: 0xFFFFFF,
    transparent: true,
    opacity: this.omni.prefs.get('planeopacity')
  });

  var _shader = $.extend(true, {}, Shaders.omni);
  _shader.uniforms.channel.texture = _channelTex;
  _shader.uniforms.segmentation.texture = _segmentationTex;
  _shader.uniforms.segcolors.texture = _view.segTex;

  var _tileMaterial = new THREE.ShaderMaterial(_shader);
  _tileMaterial.blendEquation = THREE.AddEquation;
  _tileMaterial.blendSrc = THREE.SrcAlphaFactor;
  _tileMaterial.blendDst = THREE.OneFactor;

  var _tileGeometry = new THREE.PlaneGeometry(128 * Math.pow(2, p.mip), 128 * Math.pow(2, p.mip));
  
  var _tile = new THREE.Mesh(_tileGeometry, _tileMaterial);
  _tile.position = new THREE.Vector3(0, 0, 0);
  _tile.position[_o.top] = p.coord.top;
  _tile.position[_o.left] = p.coord.left;
  _tile.doubleSided = true;

  switch (_dim) {
  case 'z':
    _tile.rotation.x = -Math.PI / 2;
    break;
  case 'y':
    break;
  case 'x':
    _tile.rotation.x = -Math.PI / 2;
    _tile.rotation.z = -Math.PI / 2;
    break;
  default:
    break;
  }

  _view.addTile(_tile, _dim);

  this.segtex = function (segtex) {
    _shader.uniforms.segcolors.texture = _view.segTex;
  };

  this.tex3d = function (enabled) {
    _tileTex.needsUpdate = true;
    this.mat.map = enabled ? _tileTex : _dummyTex;
    this.omni.threeD.render();
  };

  this.update = function () {
    var u = _tile.material.uniforms;
    u.opacity.value = this.omni.alpha;
    u.segmax.value = _view.segrows;
    u.maxTexSize.value = this.omni.detector.get('MAX_TEXTURE_SIZE');
    u.mode.value = _view.mode;
    u.uOpacity.value = _twoD.planeOpacity[_dim];
    _tile.material.blending = (_view.mode === 0) ? THREE.NoBlending : THREE.CustomBlending;
  };

  this.destroy = function () {
    if (_tile) {
      _view.removeTile(_tile, _dim);
    }
  };

  function chanLoad() {
    _channelTex.needsUpdate = true;
    if (_this.omni.prefs.get('em3d')) {
      _tileTex.repeat.x = _this.channel.uv.z;
      _tileTex.repeat.y = _this.channel.uv.w;
      _tileTex.offset.x = _this.channel.uv.x;
      _tileTex.offset.y = _this.channel.uv.y;
      _tileTex.needsUpdate = true;
    }
    _tile.material.uniforms.coffsetRepeat.value = _this.channel.uv;
    _twoD.tileReady();
  }

  function segLoad() {
    _segmentationTex.needsUpdate = true;
    _tile.material.uniforms.soffsetRepeat.value = _this.segmentation.uv;
    _twoD.tileReady();
  }

  this.channel.onload = chanLoad;
  this.segmentation.onload = segLoad;
}
