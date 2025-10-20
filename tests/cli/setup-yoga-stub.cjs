class YogaConfigStub {
  constructor() {
    this._settings = new Map();
  }
  setPointScaleFactor() {
    // no-op
  }
  free() {}
  static destroy() {}
}

class YogaNodeStub {
  constructor() {
    this.children = [];
    this.parentNode = undefined;
    this._props = new Map();
    this._measure = undefined;
    this._dirtied = undefined;
    this.layout = {
      width: 0,
      height: 0,
      left: 0,
      top: 0,
    };
  }
  static create(config) {
    return new YogaNodeStub(config);
  }
  static createWithConfig(config) {
    return new YogaNodeStub(config);
  }
  static createDefault() {
    return new YogaNodeStub();
  }
  static destroy(node) {
    if (node) {
      node.children.length = 0;
      node.parentNode = undefined;
    }
  }
  free() {
    YogaNodeStub.destroy(this);
  }
  freeRecursive() {
    for (const child of [...this.children]) {
      child.freeRecursive?.();
    }
    this.free();
  }
  insertChild(child, index) {
    if (!child) {
      return;
    }
    if (child.parentNode) {
      child.parentNode.removeChild(child);
    }
    if (index >= this.children.length) {
      this.children.push(child);
    } else {
      this.children.splice(index, 0, child);
    }
    child.parentNode = this;
  }
  removeChild(child) {
    const idx = this.children.indexOf(child);
    if (idx >= 0) {
      this.children.splice(idx, 1);
      child.parentNode = undefined;
    }
  }
  getChild(index) {
    return this.children[index];
  }
  getChildCount() {
    return this.children.length;
  }
  getChildIndex(child) {
    return this.children.indexOf(child);
  }
  markDirty() {
    if (typeof this._dirtied === 'function') {
      this._dirtied(this);
    }
  }
  setMeasureFunc(fn) {
    this._measure = fn;
  }
  unsetMeasureFunc() {
    this._measure = undefined;
  }
  setDirtiedFunc(fn) {
    this._dirtied = fn;
  }
  calculateLayout() {
    if (this._measure) {
      const result = this._measure(this, { width: this.layout.width, height: this.layout.height }, { width: this.layout.width, height: this.layout.height });
      if (result && typeof result === 'object') {
        if (typeof result.width === 'number') this.layout.width = result.width;
        if (typeof result.height === 'number') this.layout.height = result.height;
      }
    }
  }
  getComputedWidth() {
    return this.layout.width ?? 0;
  }
  getComputedHeight() {
    return this.layout.height ?? 0;
  }
  getComputedLeft() {
    return this.layout.left ?? 0;
  }
  getComputedTop() {
    return this.layout.top ?? 0;
  }
}

const setterMethods = [
  'setPosition',
  'setPositionPercent',
  'setPositionType',
  'setMargin',
  'setMarginAuto',
  'setMarginPercent',
  'setMarginLeft',
  'setMarginRight',
  'setMarginTop',
  'setMarginBottom',
  'setMarginHorizontal',
  'setMarginVertical',
  'setPadding',
  'setPaddingPercent',
  'setPaddingLeft',
  'setPaddingRight',
  'setPaddingTop',
  'setPaddingBottom',
  'setPaddingHorizontal',
  'setPaddingVertical',
  'setFlexGrow',
  'setFlexShrink',
  'setFlexBasis',
  'setFlexBasisPercent',
  'setFlexDirection',
  'setFlexWrap',
  'setJustifyContent',
  'setAlignItems',
  'setAlignSelf',
  'setAlignContent',
  'setWidth',
  'setWidthPercent',
  'setWidthAuto',
  'setHeight',
  'setHeightPercent',
  'setHeightAuto',
  'setMinWidth',
  'setMinWidthPercent',
  'setMinHeight',
  'setMinHeightPercent',
  'setMaxWidth',
  'setMaxWidthPercent',
  'setMaxHeight',
  'setMaxHeightPercent',
  'setBorder',
  'setOverflow',
  'setDisplay',
  'setGap',
  'setAspectRatio',
  'copyStyle',
  'setBaselineDiff',
  'setIsReferenceBaseline',
];

for (const method of setterMethods) {
  if (!(method in YogaNodeStub.prototype)) {
    YogaNodeStub.prototype[method] = function (...args) {
      this._props.set(method, args);
    };
  }
}

const getterDefaults = {
  getComputedPaddingLeft: 0,
  getComputedPaddingRight: 0,
  getComputedPaddingTop: 0,
  getComputedPaddingBottom: 0,
  getComputedMarginLeft: 0,
  getComputedMarginRight: 0,
  getComputedMarginTop: 0,
  getComputedMarginBottom: 0,
  getComputedBorderLeft: 0,
  getComputedBorderRight: 0,
  getComputedBorderTop: 0,
  getComputedBorderBottom: 0,
};

for (const [method, value] of Object.entries(getterDefaults)) {
  if (!(method in YogaNodeStub.prototype)) {
    YogaNodeStub.prototype[method] = function () {
      return value;
    };
  }
}

YogaNodeStub.prototype.reset = function () {
  this.children.length = 0;
  this.parentNode = undefined;
  this._props.clear();
  this.layout.width = 0;
  this.layout.height = 0;
};

globalThis.__CLAUDE_YOGA_STUB__ = {
  Config: YogaConfigStub,
  Node: YogaNodeStub,
};
